import { Inject, Service } from "typedi";
import { ActivityRepository, IActivity } from '../model/activity.model';

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
} 
