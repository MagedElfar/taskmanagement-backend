export class GetTasksDto {
    [key: string]: any
    parentId?: number;
    limit?: number;
    term?: string;
    page?: number;
    userId?: number;
    spaceId?: number;
    project?: number;
    user?: any;
    orderBy?: string;
    order?: string;
    status?: string
}