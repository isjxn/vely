import "express-session";

declare module "express-session" {
  interface Session {
    passport: {
        user: {
            _id: string
        }
    },
  }
}