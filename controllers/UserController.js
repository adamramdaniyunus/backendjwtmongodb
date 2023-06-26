import User from '../models/UsersModel.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

export const getUser = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    try {
        const user = await User.findOne({ refresh_token: refreshToken }).select('name email refresh_token');
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ msg: "User tidak ditemukan" })
    }
}


export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('name email');
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ msg: "User tidak ada" })
    }
}


export const Register = async (req, res) => {
    const { name, email, password, confpassword } = req.body;
    if (password !== confpassword) return res.status(400).json({ msg: "Password Tidak Sesuai" });
    const hashPassword = await argon2.hash(password)
    try {
        const user = new User({
            name: name,
            email: email,
            password: hashPassword
        })
        await user.save();
        res.status(201).json({ msg: "Berhasil registrasi" });
    } catch (error) {
        console.log(error);
        res.status(401).json({ msg: "Ada kesalahan dalam server" });
    }
}

export const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const { name, email, password, confpassword } = req.body;

        let hashPassword;
        if (password === '' || password === null) {
            hashPassword = user.password
        } else {
            hashPassword = await argon2.hash(password);
        }
        if (password !== confpassword) return res.status(400).json({ msg: "Password tidak sesuai" });

        user.name = name;
        user.email = email;
        user.password = hashPassword;
        await user.save();
        res.status(200).json({ msg: "Berhasil Update" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: "Ada kesalahan dalam server" });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const deleteuser = await User.deleteOne({ _id: req.params.id })
        res.status(200).json({ msg: "Berhasil Delete" })
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: "Ada kesalahan dalam server" });
    }
}

export const Login = async (req, res) => {
    try {
        const user = await User.findOne({ name: req.body.name });

        if (!user) {
            return res.status(400).json({ msg: 'Email tidak ditemukan' });
        }

        const match = await argon2.verify(user.password, req.body.password);

        if (!match) {
            return res.status(400).json({ msg: 'Password salah' });
        }

        const userId = user.id;
        const name = user.name;
        const email = user.email;
        const accessToken = jwt.sign({ userId, name, email }, process.env.SECRET_KEY, {
            expiresIn: '20s'
        });
        const refreshToken = jwt.sign({ userId, name, email }, process.env.REFRESH_KEY, {
            expiresIn: '1d'
        });

        await User.updateOne({ _id: userId }, { refresh_token: refreshToken });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            // secure: 'auto'
        });

        res.header('Authorization', `Bearer ${accessToken}`);

        res.json({ accessToken });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Terjadi kesalahan server' });
    }
};


export const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);
    const user = await User.findOne({ refresh_token: refreshToken });

    if (!user) return res.sendStatus(204);
    const userId = user.id;
    await User.updateOne({ refresh_token: null }, {
        where: {
            id: userId
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}