import express from 'express';

import AdminController from '../Controllers/AdminController.js';

import StaticPageController from '../Controllers/StaticPageController.js';
import DashboardController from '../Controllers/DasboardController.js';
import checkAdminAuth from '../Middleware/Admin-auth-middleware.js';

const router = express.Router();


router.use('/changepassword', checkAdminAuth)
router.use('/loggeduser', checkAdminAuth)

//Admin Routes
router.post('/register', AdminController.AdminRegistration)
router.post('/login', AdminController.AdminLogin)
router.post('/send-reset-password-email', AdminController.SendAdminPasswordResetEmail)
router.post('/reset-password/:id/:token', AdminController.ChangeAdminPassword)

//Static Page Routes
router.post('/static-page-get', StaticPageController.StaticPageGet)
router.post('/static-page-update', StaticPageController.StaticPageUpdate)

//Dashboard Routes
router.post('/dasboard', DashboardController.SystemDetails)



export default router;