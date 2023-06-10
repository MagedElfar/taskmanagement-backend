import { Role } from "../model/team.model";

export class FindTeamDto {
    space: number;
    limit?: number;
    page?: number;
}

export class CreateTeamDto {
    userId: number;
    space: number;
    role: Role
}