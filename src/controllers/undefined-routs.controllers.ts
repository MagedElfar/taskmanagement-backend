import Controller, { APIRoute } from "../app/controller";
import {Request , Response , NextFunction} from "express"
import { setError } from '../utils/error-format';


export default class UnHandledRoutes extends Controller{
    protected routes: APIRoute[] = [];

    constructor(){
        super("")
    }
    static unHandledRoutesHandler(req:Request , res:Response , next:NextFunction) :  void {
        try {

            throw setError(404 , "route not found")

        } catch (error) {
            next(error)
        }
    }; 
} 