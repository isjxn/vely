import type { Request, Response } from 'express';

const getAdminLogoutController = (req: Request, res: Response) => {
    req.logout();
    res.redirect('/admin/login');
}

export default getAdminLogoutController;