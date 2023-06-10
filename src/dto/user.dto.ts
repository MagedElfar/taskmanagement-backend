import { GetQueryDto } from "./commen.dto";

export class GetUsersDto extends GetQueryDto {
    term?: string
}

export class CreateUsersDto {
    password: string;
    email: string;
    username: string;
}

export class UpdateUsersDto {
    userId: number;
    email?: string;
    username?: string;
    password?: string
}