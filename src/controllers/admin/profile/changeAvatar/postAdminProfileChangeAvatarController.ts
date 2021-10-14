import type { Request, Response } from 'express';
import { User } from '../../../../models/User';

const postAdminProfileChangeAvatarController = async (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
        const user = await User.findById(req.session.passport.user._id);
        
        if (user) {
            user.avatar_url = req.body.avatar_url;
            await user.save();
        }

        res.redirect('/admin/profile');
    } else {
        res.redirect('/admin/login');
    }
}

export default postAdminProfileChangeAvatarController;