import User from "../models/UsersModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.sendStatus(401);
        const user = await User.find({ refresh_token: refreshToken });

        if (!user[0]) return res.status(403).json({ msg: "Ada kesalahan" });
        jwt.verify(refreshToken, process.env.REFRESH_KEY, (err, decoded) => {
            if (err) return res.sendStatus(403);
            const userId = user[0].id;
            const name = user[0].name;
            const email = user[0].email;
            const accessToken = jwt.sign({ userId, name, email }, process.env.SECRET_KEY, {
                expiresIn: '20s'
            });
            res.json({ accessToken });
        });
    } catch (error) {
        res.status(400).json({ msg: "Ada Kesalahan Di server" });
    }
}