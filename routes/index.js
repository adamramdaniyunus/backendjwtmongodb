import express from 'express';
import { createTask, deleteTask, editTask, getTask, getTaskId } from '../controllers/TaskController.js';
import { getUser, getUserById, Register, updateUser, deleteUser, Login, Logout } from '../controllers/UserController.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { refreshToken } from '../controllers/RefreshTokenController.js';

const route = express.Router();

route.get('/task', verifyToken, getTask);
route.get('/task/:id', verifyToken, getTaskId);
route.post('/task', verifyToken, createTask);
route.patch('/task/:id', verifyToken, editTask);
route.delete('/task/:id', verifyToken, deleteTask);
route.get('/user', verifyToken, getUser);
route.get('/user/:id', verifyToken, getUserById);
route.post('/register', Register);
route.patch('/user/:id', verifyToken, updateUser);
route.delete('/user/:id', verifyToken, deleteUser);
route.post('/login', Login);
route.delete('/logout', Logout);
route.get('/token', refreshToken);

export default route;