import type { Request, Response } from 'express';

const getAdminRegisterController = (req: Request, res: Response) => {
    res.render('admin/register.njk');
}

export default getAdminRegisterController;