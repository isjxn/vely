import type { Request, Response } from 'express';
import { User } from '../../../models/User';

const getAdminProfileController = async (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
        const user = await User.findById(req.session.passport.user._id);

        res.render('admin/profile.njk', { user: user });
    } else {
        res.redirect('/admin/login');
    }
}

export default getAdminProfileController;