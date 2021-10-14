import { Request, Response } from "express";
import { User } from "../../../../models/User";

const getStepBeforeGitHubController = async (req: Request, res: Response) => {
    const user = await User.findById(req.session.passport.user._id);
  
    if (user) {
      if (user.githubId === 'UNKNOWN') {
        user.githubId = 'AUTH';
        await user.save();
      } else {
        user.githubId = 'UNKNOWN';
        await user.save();
      }
    }
  
    res.redirect('/admin/connect/github');
}

export default getStepBeforeGitHubController;