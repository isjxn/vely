import type { Request, Response } from 'express';
import { expressService } from '../../..';

const getAdminLoginController = (req: Request, res: Response) => {
    res.render('admin/login.njk', { captcha: expressService.recaptcha.render(), errorReason: req.flash('error') });
}

export default getAdminLoginController;