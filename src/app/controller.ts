import { Router, Request, Response, NextFunction } from "express";
import authorizationMiddleware from "../middleware/authorization.middleware";
import { setError } from './../utils/error-format'

export enum Methods {
    ALL = 'all',
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    DELETE = 'delete',
    PATCH = 'patch',
    OPTIONS = 'options',
    HEAD = 'head',
}

export interface APIRoute {
    path: string,
    method: Methods,
    handler: (req: Request, res: Response, next: NextFunction) => void | Promise<void>,
    localMiddleware: any[],
    auth: boolean
}

export default abstract class Controller {
    path: string;
    router: Router;
    protected abstract routes: APIRoute[];

    constructor(path: string) {
        this.router = Router();
        this.path = path;
    }

    setRoutes(): Router {
        this.routes.forEach((route: APIRoute) => {
            if (route.auth) {
                route.localMiddleware.unshift(authorizationMiddleware.authMiddleware)
            }
            this.router[route.method](route.path, route.localMiddleware, route.handler.bind(this))
        })
        return this.router
    }

    setResponseError(status: number, message: string): object {
        return setError(status, message)
    }

    setResponseSuccess({ res, status, data, message }: { res: Response, status: number, data?: object, message?: string }): Response {
        return res.status(status).json({
            type: "success",
            message,
            ...data
        })
    }
} 