import Task from "../models/TasksModel.js";
import User from "../models/UsersModel.js";

export const getTask = async (req, res) => {
    try {
        const userName = req.name; //dari middleware
        const user = await User.findOne({ name: userName }); // Cari user berdasarkan name

        if (!user) {
            return res.status(404).json({ msg: 'User tidak ditemukan' });
        }

        const userId = user.id;
        const task = await Task.find({ userId });

        if (!task) {
            return res.status(404).json({ msg: 'Tidak ada task untuk user ini' });
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ msg: 'Terjadi kesalahan server' });
    }
}

export const getTaskId = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        res.status(200).json(task)
    } catch (error) {
        res.status(404).json({ msg: "Task tidak ditemukan" });
    }
}

export const createTask = async (req, res) => {
    try {
        const { taskName, dateTask, deadline, description } = req.body
        const userName = req.name;

        const user = await User.findOne({ name: userName });
        if (!user) {
            return res.status(404).json({ msg: "User tidak ditemukan" });
        }


        const task = new Task({
            taskName: taskName,
            dateTask: dateTask,
            deadline: deadline,
            description: description,
            userId: user._id
        });

        await task.save();
        res.status(201).json({ msg: "Tugas berhasil dibuat" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Terjadi kesalahan server' });
    }
}

export const editTask = async (req, res) => {
    try {
        const { taskName, dateTask, deadline, description } = req.body;
        const userName = req.name
        const taskId = req.params.id

        const user = await User.findOne({ name: userName });
        if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ msg: "Task Tidak ditemukan" });

        // hanya user yang memiliki tugas yang bisa mengakses
        if (task.userId.toString() !== user._id.toString()) {
            return res.status(403).json({ msg: "Akses Dilarang" });
        }

        // update task
        task.taskName = taskName
        task.dateTask = dateTask
        task.deadline = deadline
        task.description = description

        await task.save();
        res.status(200).json({ msg: "Berhasil Update" })
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
}

export const deleteTask = async (req, res) => {
    try {
        await Task.deleteOne({ _id: req.params.id })
        res.status(200).json({ msg: "Berhasil Delete" })
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: "Ada kesalahan dalam server" });
    }
}