import { CreateUsersDto } from "./user.dto";

export class LoginDto {
    password: string;
    email: string;
}

export class SignupDto extends CreateUsersDto {
    token?: string
}