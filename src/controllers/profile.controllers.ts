import Controller, { APIRoute } from "../app/controller";
import { Request, Response, NextFunction } from "express";
import routes from "../route/_profile.routes";
import { IProfileServices } from "../services/profile.services";
import { autoInjectable, inject } from "tsyringe";

export interface IProfileController {
    createProfileHandler(req: Request, res: Response, next: NextFunction): void
}

@autoInjectable()
export default class ProfileController extends Controller implements IProfileController {
    protected routes: APIRoute[];
    private readonly profileService: IProfileServices;

    constructor(
        @inject("IProfileServices") profileService: IProfileServices,

    ) {
        super("/profiles");
        this.profileService = profileService;
        this.routes = routes(this);
    }


    async createProfileHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const id = req.user?.id;

            await this.profileService.create({
                userId: id!,
                ...req.body
            })

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
