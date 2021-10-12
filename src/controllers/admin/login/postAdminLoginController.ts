import type { Request, Response } from 'express';
import { expressService } from '../../..';

const postAdminLoginController = (req: Request, res: Response) => {
    expressService.recaptcha.verify(req, (error, data) => {
        if (!error) {
            res.redirect('/admin');
        } else {
            res.redirect('/admin/login');
        }
    });
    
}

export default postAdminLoginController;