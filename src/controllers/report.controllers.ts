import Controller, { APIRoute } from "../app/controller";
import { Request, Response, NextFunction } from "express";
import routes from "../route/_report.routes";
import { Inject } from "typedi";
import ReportServices from "../services/report.services";


export default class ReportController extends Controller {
    protected routes: APIRoute[];
    private readonly reportServices: ReportServices


    constructor(
        path: string,
        @Inject() reportServices: ReportServices
    ) {
        super(path);
        this.routes = routes(this);
        this.reportServices = reportServices
    }

    async generalSpaceReportHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {


            const { id } = req.params

            const spaceReport = await this.reportServices.spaceReport(+id, req.query)
            const teamReport = await this.reportServices.teamReport(+id, req.query)

            super.setResponseSuccess({
                res,
                status: 200,
                data: {
                    spaceReport,
                    teamReport

                }
            })

        } catch (error) {
            next(error)
        }
    };
}
