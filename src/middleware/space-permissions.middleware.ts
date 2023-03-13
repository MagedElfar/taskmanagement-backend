import { Request, Response, NextFunction } from "express";
import { ITeam } from "../model/team.model";
import { setError } from "../utils/error-format";

class SpacePermission {
    updateAndDeletePermission(req: Request, res: Response, next: NextFunction) {

        if (!req.user?.teams) return next(setError(403, "Forbidden"));

        const space = req.params.id;

        const member = req.user.teams.find((item: ITeam) => item.userId === req.user?.id && item.space === +space && item.role === "owner")

        if (!member) return next(setError(403, "Forbidden"))

        return next()
    }

    getSpacePermission(req: Request, res: Response, next: NextFunction) {

        if (!req.user?.teams) return next(setError(403, "Forbidden"));

        const space = req.params.id;

        const member = req.user.teams.find((item: ITeam) => item.userId === req.user?.id && item.space === +space)

        if (!member) return next(setError(403, "Forbidden"))

        return next()
    }
}

export default new SpacePermission() 