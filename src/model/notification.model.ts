import { Service } from 'typedi';
import Model from "../app/model";
import BaseRepository from "../plugins/mysqldb";
import { setError } from '../utils/error-format';
import { GetNotificationDto } from '../dto/notification.dto';

export interface INotification extends Model {
    text: string;
    is_read: boolean,
    space_id: number;
    task_id: number,
    receiver: number,
    sender: number
}


@Service()
export class NotificationRepository extends BaseRepository<INotification>{
    constructor() {
        super("notifications")
    }

    async find(getNotificationDto: GetNotificationDto): Promise<any> {

        try {
            const query = this.db(this.tableName)

            const {
                receiver,
                space_id,
                limit,
                page
            } = getNotificationDto

            query
                .leftJoin("tasks", "tasks.id", "=", "notifications.task_id")
                .leftJoin("users as sender", "sender.id", "=", "notifications.sender")
                .leftJoin("profiles_images as image", "image.userId", "=", "sender.id")
                .leftJoin("profiles as profile", "sender.id", "=", "profile.userId")
                .select(
                    "notifications.*",
                    "tasks.title as title",
                    "sender.username as username",
                    "image.image_url as image",
                    "profile.first_name",
                    "profile.last_name",
                )


            const notificationQuery = query
                .where("notifications.space_id", "=", space_id)
                .andWhere("notifications.receiver", "=", receiver)
                .clone()

            if (limit) {
                notificationQuery.limit(limit)
                    .offset((page! - 1) * limit)
            }

            const data = await notificationQuery.orderBy("created_at", "desc");

            const count = await query.clone().count('notifications.id as CNT').first();

            const unReadCount = await query.clone().andWhere("is_read", "=", 0).count('notifications.id as CNT').first();

            return {
                data,
                count: count?.CNT,
                unReadCount: unReadCount?.CNT
            }
        } catch (error) {
            console.log(error)
            throw setError(500, "database failure")
        }
    }

    async findOne(id: number): Promise<INotification> {
        try {
            const query = this.db(this.tableName)

            query
                .leftJoin("tasks", "tasks.id", "=", "notifications.task_id")
                .leftJoin("users as sender", "sender.id", "=", "notifications.sender")
                .leftJoin("profiles_images as image", "image.userId", "=", "sender.id")
                .leftJoin("profiles as profile", "sender.id", "=", "profile.userId")
                .select(
                    "notifications.*",
                    "tasks.title as title",
                    "sender.username as username",
                    "image.image_url as image",
                    "profile.first_name",
                    "profile.last_name",
                )

            return await query.where("notifications.id", "=", id).first()

        } catch (error) {
            console.log(error)
            throw setError(500, "database failure")
        }
    }
}
