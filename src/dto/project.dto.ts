export class CreateProjectDto {
    name: string;
    spaceId: number;
    userId: number
}

export class UpdateProjectDto {
    name: string;
}

export class FindProjectDto {
    spaceId: number;
    limit?: number;
    page?: number;
    term?: number
}