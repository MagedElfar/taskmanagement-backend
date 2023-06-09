import { Gender } from "../model/profile.model";

export class CreateProfileDto {
    userId: number;
    first_name?: string;
    last_name?: string;
    phone?: string;
    gender?: Gender;
}


export class UpdateProfileDto extends CreateProfileDto { }