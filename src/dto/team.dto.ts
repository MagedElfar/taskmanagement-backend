import { Role } from "../model/team.model";

export class CreateTeamDto {
    userId: number;
    space: number;
    role: Role
}