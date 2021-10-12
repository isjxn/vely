import type { Request, Response } from 'express';
import { expressService } from '../../..';

const getAdminRegisterController = (req: Request, res: Response) => {
    res.render('admin/register.njk', { captcha: expressService.recaptcha.render() });
}

export default getAdminRegisterController;