import { GetNotificationDto } from './../dto/notification.dto';
import { Inject, Service } from "typedi";
import { setError } from '../utils/error-format';
import { INotification, NotificationRepository } from '../model/notification.model';
import SocketServices from './Socket.services';

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

            const notification = await this.notificationRepository.create(data);

            SocketServices.emitNotification(notification)

            return notification;

        } catch (error) {
            throw error;
        }
    }

    async markASRead(userId: number, notificationId: number) {
        try {
            const notification = await this.notificationRepository.findOne(notificationId);

            if (!notification || notification?.receiver !== userId || notification.is_read) throw setError(404, "Not found");

            await this.notificationRepository.update(notificationId, {
                is_read: true
            })

        } catch (error) {
            throw error
        }
    }

    async deleteNotification(userId: number, notificationId: number) {
        try {
            const notification = await this.notificationRepository.findOne(notificationId);
            console.log(notification)
            if (!notification || notification.receiver !== userId) throw setError(403, "Forbidden")


            await this.notificationRepository.delete(notificationId)

        } catch (error) {
            throw error;
        }
    }

    async markAllIsRead(receiver: number) {
        try {
            await this.notificationRepository.updateMany({ receiver }, { is_read: true })
        } catch (error) {
            throw error
        }
    }

    async deleteAll(receiver: number) {
        try {
            await this.notificationRepository.deleteMany({ receiver })
        } catch (error) {
            throw error
        }
    }

}
