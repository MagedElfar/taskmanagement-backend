import { Inject, Service } from "typedi";
import { ActivityRepository, IActivity } from '../model/activity.model';
import { setError } from "../utils/error-format";

@Service()
export default class ActivityServices {
    private readonly activityRepository: ActivityRepository;

    constructor(
        @Inject() activityRepository: ActivityRepository,
    ) {
        this.activityRepository = activityRepository;
    }

    async _find(taskId: number, querySearch: { limit: number, page: number }) {
        try {
            return await this.activityRepository.find({ taskId }, querySearch)
        } catch (error) {
            throw error
        }
    }

    async find(userId: number, taskId: number, querySearch: { limit: number, page: number }) {
        try {
            return await this.activityRepository.find({ taskId }, querySearch)
        } catch (error) {
            throw error
        }
    }



    async addActivity(data: Partial<IActivity>) {
        try {
            return await this.activityRepository.create(data);
        } catch (error) {

            throw error;
        }
    }

    async addComment(userId: number, data: Partial<IActivity>) {
        try {


            return this.addActivity({
                user1_Id: userId,
                type: "comment",
                ...data
            })


        } catch (error) {

            throw error;
        }
    }

    async deleteComment(userId: number, activityId: number) {
        try {
            const comment = await this.activityRepository.findOne(activityId);

            if (!comment || comment.user1_Id !== userId) throw setError(403, "Forbidden")


            await this.activityRepository.delete(activityId)

        } catch (error) {
            throw error;
        }
    }

    async editComment(userId: number, activityId: number, data: Partial<IActivity>) {
        try {
            const comment = await this.activityRepository.findOne(activityId);

            if (!comment || comment.user1_Id !== userId) throw setError(403, "Forbidden")


            await this.activityRepository.update(activityId, data)

        } catch (error) {
            throw error;
        }
    }

} 
