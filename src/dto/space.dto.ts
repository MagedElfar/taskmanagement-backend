export class FindSpaceDto {
    limit: number;
    term?: string;
    page: number;
    userId: number
}

export class CreateSpaceDto {
    owner: number;
    name: string
}

export class UpdateSpaceDto {
    name: string
}