import mongoose from "mongoose";

mongoose.connect('mongodb://127.0.0.1:27017/taskmanagement', {
    useNewUrlparser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
// db.on('error', (error) => console.log(error));
// db.once('open', () => console.log("Database Connected"));


export default db;