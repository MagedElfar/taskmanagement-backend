import Controller, { APIRoute } from "../app/controller";
import { Request, Response, NextFunction } from "express";
import routes from "../route/_user.routes";
import UserServices from "../services/user.services";
import { Inject } from "typedi";
import ProfileServices from "../services/profile.services";

export default class UserController extends Controller {
    protected routes: APIRoute[];
    private readonly userServices: UserServices;
    private readonly profileService: ProfileServices;

    constructor(
        path: string,
        @Inject() userServices: UserServices,
        @Inject() profileService: ProfileServices,

    ) {
        super(path);
        this.userServices = userServices;
        this.profileService = profileService;
        this.routes = routes(this);
    }


    async getUserHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const id = req.user?.id;

            const data = await this.userServices.findOne({ id });

            const { password: pass, ...user } = data

            super.setResponseSuccess({
                res, status: 200,
                data: {
                    user
                }
            })

        } catch (error) {
            next(error)
        }
    };


    async getUsersHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const id = req.user?.id;

            const query = req.query

            const users = await this.userServices.findUsers(query);

            super.setResponseSuccess({
                res, status: 200,
                data: {
                    users
                }
            })

        } catch (error) {
            next(error)
        }
    };

    async updateUserHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const id = req.user?.id;

            const { username, email, ...profile } = req.body;

            await this.profileService.update(id!, profile)

            const { password, ...user } = await this.userServices.update(id!, { username, email })

            super.setResponseSuccess({ res, status: 200, message: "user updated successfully", data: { user } })

        } catch (error) {
            next(error)
        }
    }
}
