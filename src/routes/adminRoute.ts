import express from 'express';
import passport from 'passport';
import getStepBeforeGitHubController from '../controllers/admin/connect/stepBeforeGitHub/getStepBeforeGitHubController';
import getAdminController from '../controllers/admin/getAdminController';
import getAdminLoginController from '../controllers/admin/login/getAdminLoginController';
import getAdminLogoutController from '../controllers/admin/logout/getAdminLogoutController';
import postAdminProfileChangeAvatarController from '../controllers/admin/profile/changeAvatar/postAdminProfileChangeAvatarController';
import getAdminProfileController from '../controllers/admin/profile/getAdminProfileController';
import getAdminRegisterController from '../controllers/admin/register/getAdminRegisterController';
import postAdminRegisterController from '../controllers/admin/register/postAdminRegisterController';
import { User } from '../models/User';

const router = express.Router();

router.get('/', getAdminController);

router.get('/profile', getAdminProfileController);
router.post('/profile/changeAvatar', postAdminProfileChangeAvatarController);

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

router.get('/logout', getAdminLogoutController);

router.get('/auth/github',
  passport.authenticate('github'));

router.get('/auth/github/callback', 
  passport.authenticate('github', { 
    successRedirect: '/admin',
    failureRedirect: '/admin/login',
    failureFlash: true
  })
);

router.get('/connect/stepBeforeGitHub', getStepBeforeGitHubController);

router.get('/connect/github',
  passport.authorize('github')
);

export const adminRoute = router;