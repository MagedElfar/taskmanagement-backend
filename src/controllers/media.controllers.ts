import Controller, { APIRoute } from "../app/controller";
import { Request, Response, NextFunction } from "express";
import routes from "../route/_media.routes";
import { Inject } from "typedi";
import ProfileImageServices from "../services/profileImage.services";
import TaskAttachmentServices from "../services/task_attachments.services";

export default class MediaController extends Controller {
    protected routes: APIRoute[];
    private readonly profileImageService: ProfileImageServices;
    private readonly taskAttachmentServices: TaskAttachmentServices;


    constructor(
        path: string,
        @Inject() profileImageService: ProfileImageServices,
        @Inject() taskAttachmentServices: TaskAttachmentServices

    ) {
        super(path);
        this.profileImageService = profileImageService;
        this.taskAttachmentServices = taskAttachmentServices;
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
    };

    async uploadTaskAttachmentHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.user?.id!;

            const attachments = await this.taskAttachmentServices.addAttachment(+req.body.taskId, req.files)

            super.setResponseSuccess({
                res,
                status: 201,
                data: {
                    attachments
                }
            })

        } catch (error) {
            next(error)
        }
    };

    async deleteTaskAttachmentHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.user?.id!;

            const { id } = req.params

            await this.taskAttachmentServices.deleteAtt(+id)

            super.setResponseSuccess({
                res,
                status: 200
            })

        } catch (error) {
            next(error)
        }
    };

}
