import Controller, { APIRoute } from "../app/controller";
import { Request, Response, NextFunction } from "express";
import routes from "../route/user.routes";
import UserServices from "../services/user.services";
import { Inject } from "typedi";

export default class UserController extends Controller {
    protected routes: APIRoute[];
    private readonly userServices: UserServices;

    constructor(path: string, @Inject() userServices: UserServices) {
        super(path);
        this.userServices = userServices;
        this.routes = routes(this);
    }

    async userImageHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const id = req.user?.id;
            // console.log(req.file, id);

            const image = await this.userServices.userImage(req.file?.filename!, id!)


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

            await this.userServices.delEteUserImage(id!)

            super.setResponseSuccess({
                res,
                status: 200,
            })

        } catch (error) {
            next(error)
        }
    };
    // async getUserHandler(req:Request , res:Response , next:NextFunction) :  Promise<void> {
    //     try {

    //         const id = req.user?.id;

    //         const userServices = new UserServices();

    //         const user = await userServices.findOne({id});

    //         const {password:pass , ...others} = user

    //         super.setResponseSuccess({res , status:200 , data:{
    //             user:others
    //         } })

    //     } catch (error) {
    //         next(error)
    //     }
    // };

    // async updateUserHandler(req:Request , res:Response , next:NextFunction) :  Promise<void> {
    //     try {

    //         const id = req.user?.id;

    //         const data = req.body;

    //         const userServices = new UserServices();

    //         const {password , ...user} = await userServices.update(id! , data)

    //         super.setResponseSuccess({res , status:200 , message:"user updated successfully" , data:{user}})

    //     } catch (error) {
    //         next(error)
    //     }
    // };

    // async updateBrushTypeHandler(req:Request , res:Response , next:NextFunction) :  Promise<void> {
    //     try {

    //         const id = req.user?.id;

    //         const brush_type = req.body.brush_type;

    //         const userServices = new UserServices();

    //         await userServices.brushTypeUpdate(id! , brush_type)

    //         super.setResponseSuccess({res , status:200 , message:"brush type updated successfully"})

    //     } catch (error) {
    //         next(error)
    //     }
    // };

    // async restPasswordHandler(req:Request , res:Response , next:NextFunction) :  Promise<void> {
    //     try {

    //         const id = req.user?.id;

    //         const userServices = new UserServices();

    //         await userServices.changePassword(id! , req.body.password , req.body.new_password)

    //         super.setResponseSuccess({res , status:200 , message:"password is updated successfully"})

    //     } catch (error) {
    //         next(error)
    //     }
    // }
}
