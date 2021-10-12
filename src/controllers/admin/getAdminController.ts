import type { Request, Response } from 'express';

const getAdminController = (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
        res.render('admin/index.njk');
    } else {
        res.redirect('/admin/login');
    }
}

export default getAdminController;