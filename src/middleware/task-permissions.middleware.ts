import { Inject, Service } from "typedi";
import { Role } from "../model/team.model";
import TeamServices from "../services/team.service";

@Service()
export default class TaskPermission {

    private readonly teamService: TeamServices;

    constructor(@Inject() teamService: TeamServices) {
        this.teamService = teamService
    }

    adminPermission = async (space: number, userId: number) => {
        try {
            const roles = [Role.OWNER, Role.ADMIN];

            const member = await this.teamService.findOne({
                userId,
                space
            });

            if (!member || !roles.includes(member?.role)) return false;

            return true;

        } catch (error) {
            throw error
        }

    }

    userPermission = async (space: number, userId: number) => {
        try {

            const member = await this.teamService.findOne({
                userId,
                space
            });

            if (!member) return false

            return true;

        } catch (error) {
            throw error
        }

    }


}