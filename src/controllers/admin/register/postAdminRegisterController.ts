import type { Request, Response } from 'express';

const postAdminRegisterController = (req: Request, res: Response) => {
    res.redirect('/admin');
}

export default postAdminRegisterController;