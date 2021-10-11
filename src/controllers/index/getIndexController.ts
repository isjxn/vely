import type { Request, Response } from 'express';

const getIndexController = (req: Request, res: Response) => {
    res.render('index.njk');
}

export default getIndexController;