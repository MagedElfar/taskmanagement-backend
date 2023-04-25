export class GetNotificationDto {
    [key: string]: any
    limit: number;
    page: number;
    receiver: number;
    space_id: number;
}