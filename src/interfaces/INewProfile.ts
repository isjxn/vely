import { Profile } from "passport-github";

export interface INewProfile extends Profile {
    _json: {
        avatar_url: string;
    }
}