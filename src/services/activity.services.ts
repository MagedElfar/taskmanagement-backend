import { Inject, Service } from "typedi";
import { setError } from '../utils/error-format';
import TaskServices from './task.services';
import { ActivityRepository, IActivity } from '../model/activity.model';

@Service()
export default class ActivityServices {
    private readonly activityRepository: ActivityRepository;
    @Inject(type => TaskServices) taskService: TaskServices

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

            await this.taskService.getTask(userId, taskId!);

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
