import type { Request, Response } from 'express';

const getAdminController = (req: Request, res: Response) => {
    res.render('admin/index.njk');
}

export default getAdminController;