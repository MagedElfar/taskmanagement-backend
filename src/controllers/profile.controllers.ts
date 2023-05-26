import Controller, { APIRoute } from "../app/controller";
import { Request, Response, NextFunction } from "express";
import routes from "../route/_profile.routes";
import { Inject } from "typedi";
import ProfileServices from "../services/profile.services";

export default class ProfileController extends Controller {
    protected routes: APIRoute[];
    private readonly profileService: ProfileServices;

    constructor(
        path: string,
        @Inject() profileService: ProfileServices,

    ) {
        super(path);
        this.profileService = profileService;
        this.routes = routes(this);
    }


    async createProfileHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const id = req.user?.id;

            await this.profileService.create(id!, req.body)

            super.setResponseSuccess({
                res,
                status: 201,
                message: "user profile are created"
            })

        } catch (error) {
            next(error)
        }
    };
}
