import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Request, Response, NextFunction } from "express";
import { setError } from "../utils/error-format"
import config from '../config'
import Container from "typedi";
import { UserRepository } from "../model/user.model";
import UserServices from "../services/user.services";


export class AuthorizationMiddleware {
    private static instance: AuthorizationMiddleware | null;

    private constructor() {
    }

    static generateInstance() {
        if (!AuthorizationMiddleware.instance) AuthorizationMiddleware.instance = new AuthorizationMiddleware();

        return AuthorizationMiddleware.instance
    }

    authStrategy: Strategy = new Strategy(
        {
            secretOrKey: config?.jwt.secret,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        },
        (payload, done) => {
            return done(null, payload);
        }
    );

    refreshTokenExtract(req: Request, res: Response, next: NextFunction) {
        const refreshToken = req.signedCookies["refresh_token"];

        if (!refreshToken) {
            return next(setError(400, "refresh_token required"))
        }

        req.refreshToken = refreshToken;

        next();
    }


    authMiddleware(req: Request, res: Response, next: NextFunction) {

        passport.authenticate("jwt", { session: false }, async (error: any, decryptToken: any, jwtError: any) => {
            if (error || jwtError) {
                return next(setError(401, "ACCESS_TOKEN_EXPIRED"))
            }

            try {
                const userSrv = Container.get(UserServices)

                const user = await userSrv.findUser({ id: decryptToken.id });
                req.user = user;
                next()
            } catch (error) {
                return next(error)
            }

        })(req, res, next);
    };


}


const authorizationMiddleware = AuthorizationMiddleware.generateInstance()

const authStrategy = authorizationMiddleware.authStrategy

passport.use(authStrategy);

export default authorizationMiddleware

