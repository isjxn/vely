import type { Request, Response } from 'express';
import { User } from '../../../models/User';
import axios, { AxiosResponse } from 'axios';

const getAdminProfileController = async (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
        const user = await User.findById(req.session.passport.user._id);

        const response = await axios.get('https://api.github.com/user/repos', {
            auth: {
                username: user?.githubUsername as unknown as string,
                password: user?.githubAccessToken as unknown as string
            }
        });

        res.render('admin/profile.njk', { user: user, repos: response?.data });
    } else {
        res.redirect('/admin/login');
    }
}

export default getAdminProfileController;