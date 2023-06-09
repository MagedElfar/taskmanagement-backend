import { autoInjectable, container, inject } from "tsyringe";
import Controller, { APIRoute } from "../app/controller";
import { Request, Response, NextFunction } from "express";
import routes from "../route/_user.routes";
import { IProfileServices, ProfileServices } from "../services/profile.services";
import { IUserServices, UserServices } from "../services/user.services";

export interface IUserController {
    getUserHandler(req: Request, res: Response, next: NextFunction): Promise<void>;
    getUsersHandler(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateUserHandler(req: Request, res: Response, next: NextFunction): Promise<void>
}

@autoInjectable()
export default class UserController extends Controller implements IUserController {
    protected routes: APIRoute[];
    private readonly userServices: IUserServices;
    private readonly profileService: IProfileServices;

    constructor(
        @inject(ProfileServices) profileService: IProfileServices,
        @inject(UserServices) userServices: IUserServices,
    ) {
        super("/users");
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

            await this.profileService.update({
                userId: id!,
                ...profile
            })

            const { password, ...user } = await this.userServices.update({
                userId: id!,
                username,
                email,
            })

            super.setResponseSuccess({ res, status: 200, message: "user updated successfully", data: { user } })

        } catch (error) {
            next(error)
        }
    }
}
