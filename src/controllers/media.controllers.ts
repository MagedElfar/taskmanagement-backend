import Controller, { APIRoute } from "../app/controller";
import { Request, Response, NextFunction } from "express";
import routes from "../route/_media.routes";
import { Inject } from "typedi";
import ProfileImageServices from "../services/profileImage.services";

export default class MediaController extends Controller {
    protected routes: APIRoute[];
    private readonly profileImageService: ProfileImageServices;

    constructor(
        path: string,
        @Inject() profileImageService: ProfileImageServices

    ) {
        super(path);
        this.profileImageService = profileImageService
        this.routes = routes(this);
    }

    async uploadUserImageHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const id = req.user?.id;

            const image = await this.profileImageService.userImage(req.file?.filename!, id!)

            super.setResponseSuccess({
                res,
                status: 200,
                data: { image_url: image.image_url }
            })

        } catch (error) {
            next(error)
        }
    };

    async deleteUserImageHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const id = req.user?.id;

            await this.profileImageService.delEteUserImage(id!)

            super.setResponseSuccess({
                res,
                status: 200,
            })

        } catch (error) {
            next(error)
        }
    }
}
