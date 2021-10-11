import type { Request, Response } from 'express';

const getAdminLoginController = (req: Request, res: Response) => {
    res.render('admin/login.njk');
}

export default getAdminLoginController;