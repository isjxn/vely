import type { Request, Response } from 'express';
import { expressService } from '../../..';
import { registerUser } from '../../../helpers/registerUser';
import IRegisterUser from '../../../interfaces/IRegisterUser';
import { IUser } from '../../../models/User';

const postAdminRegisterController = (req: Request, res: Response) => {
    expressService.recaptcha.verify(req, (error, data) => {
        if (!error) {
            const registerUserObject: IRegisterUser = {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                passwordRepeat: req.body.passwordRepeat
            }

            registerUser(registerUserObject, (success: boolean, errorReason: string, user: IUser) => {
                if (success) {
                    req.login(user, function(err) {
                        if (err) throw err;

                        res.redirect('/admin');
                    });
                } else {
                    res.render('admin/register.njk', { captcha: expressService.recaptcha.render(), errorReason: errorReason });
                }
            });
        } else {
            res.render('admin/register.njk', { captcha: expressService.recaptcha.render(), errorReason: 'ReCaptcha thinks that you\'re a robot!' });
        }
    });
    
}

export default postAdminRegisterController;