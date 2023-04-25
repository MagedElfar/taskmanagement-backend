import { GetNotificationDto } from './../dto/notification.dto';
import { Inject, Service } from "typedi";
import { setError } from '../utils/error-format';
import { INotification, NotificationRepository } from '../model/notification.model';

@Service()
export default class NotificationServices {
    private readonly notificationRepository: NotificationRepository;

    constructor(
        @Inject() notificationRepository: NotificationRepository
    ) {
        this.notificationRepository = notificationRepository;
    }

    QueryServices() {
        return this.notificationRepository.qb()
    }

    async find(getNotificationDto: GetNotificationDto) {
        try {
            return await this.notificationRepository.find(getNotificationDto);
        } catch (error) {
            throw error
        }
    }



    async addNotification(data: Partial<INotification>) {
        try {

            return await this.notificationRepository.create(data);

        } catch (error) {
            throw error;
        }
    }

    // async deleteComment(userId: number, commentId: number) {
    //     try {
    //         const comment = await this.commentRepository.findOne(commentId);

    //         if (!comment || comment.userId !== userId) throw setError(403, "Forbidden")


    //         await this.commentRepository.delete(commentId)

    //     } catch (error) {
    //         throw error;
    //     }
    // }

}
