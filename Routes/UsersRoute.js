import express from 'express';
import UserController from '../Controllers/UsersController.js';

const router = express.Router();

router.post('/GetUsers', UserController.GetUsers);
router.post('/TotalUserCount', UserController.TotalUserCount);
export default router;

