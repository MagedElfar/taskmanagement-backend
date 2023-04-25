import { IUser } from './../model/user.model';
import express, { Application, RequestHandler, Request, Response, Router, NextFunction } from 'express';
import path from 'path';
import { requestErrorFormat } from '../utils/error-format';
import Controller from './controller'
import config from '../config';
import UnHandledRoutes from '../controllers/undefined-routs.controllers';
import { Server as SocketServer, Socket } from 'socket.io';
import http from "http";
import SocketServices from '../services/Socket.services';

declare global {
    namespace Express {
        interface User extends IUser { }
        interface Request {
            refreshToken?: string
        }
    }
}

export default class Server {
    app: Application;
    private readonly port: number = config.port!;
    private router: Router;

    constructor(app: Application) {
        this.app = app;
        this.router = Router()
    }

    run(): void {
        const server = http.createServer(this.app)
        server.listen(this.port, () => {
            console.log(`server is running on port ${this.port}...`)
        })

        SocketServices.initIo(server)

    }

    loadMiddleware(middleware: RequestHandler[]): void {
        const io = require('socket.io')(http);

        middleware.forEach((mid: RequestHandler) => {
            this.app.use(mid)
        });

        this.app.use(express.static(path.join(path.dirname(__dirname), "..", "public")));

        this.app.use("/media", express.static(path.join(__dirname, "..", "public", "media")));

        this.app.get("/", (req: Request, res: Response) => {
            res.send("app backend server")
        })
    }

    setRoutes(controllers: Controller[]) {
        controllers.forEach((controller: Controller) => {
            this.router.use(controller.path, controller.setRoutes())
        })

        this.app.use('/api', this.router)
        this.app.use('*', UnHandledRoutes.unHandledRoutesHandler)
    }

    errorHandler(): void {
        this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            console.log(err)
            const error = requestErrorFormat(err)
            res.status(err.status || err.response?.data.code || 500).json(error)
        })
    }
}