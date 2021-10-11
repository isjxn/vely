import express from 'express';
import passport from 'passport';
import getAdminController from '../controllers/admin/getAdminController';
import getAdminLoginController from '../controllers/admin/login/getAdminLoginController';
import getAdminRegisterController from '../controllers/admin/register/getAdminRegisterController';
import postAdminRegisterController from '../controllers/admin/register/postAdminRegisterController';

const router = express.Router();

router.get('/', getAdminController);

router.get('/login', getAdminLoginController);
router.post('/login',
    passport.authenticate('local', { 
        successRedirect: '/admin',
        failureRedirect: '/admin/login',
        failureFlash: true
    })
);

router.get('/register', getAdminRegisterController);
router.post('/register', postAdminRegisterController);

export const adminRoute = router;