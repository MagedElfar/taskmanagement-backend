import "reflect-metadata";
import express, { Application, urlencoded, json } from "express";
import Server from "./app/server";
import cors from "cors";
import morgan from "morgan";
import routes from "./route";
import cookieParser from "cookie-parser"
import config from "./config";

const app: Application = express();

const server: Server = new Server(app);

const whitelist = process.env.WHITELISTED_DOMAINS!.split(",");

server.loadMiddleware([
    cors({
        origin: function (origin, callback) {
            if (!origin || whitelist.indexOf(origin) !== -1) {
                callback(null, true)
            } else {
                callback(new Error("Not allowed by CORS"))
            }
        },
        credentials: true,
    }),
    morgan("short"),
    urlencoded({ extended: true }),
    cookieParser(config.cookie.secret),
    json(),
])

process.on("uncaughtException", (stream) => {
    console.log("err", stream)
})
process.on("unhandledRejection", (stream) => {
    console.log("err", stream)
})

server.setRoutes(routes);

server.errorHandler()

server.run()
