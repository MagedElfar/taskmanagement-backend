import { CommentRepository, IComment } from './../model/comment.model';
import { Inject, Service } from "typedi";
import { setError } from '../utils/error-format';
import TaskServices from './task.services';
import TakPermission from '../middleware/task-permissions.middleware';

@Service()
export default class CommentServices {
    private readonly commentRepository: CommentRepository;
    private readonly taskService: TaskServices;
    private readonly takPermission: TakPermission;

    constructor(
        @Inject() takPermission: TakPermission,
        @Inject() commentRepository: CommentRepository,
        @Inject() taskService: TaskServices,
    ) {
        this.commentRepository = commentRepository;
        this.taskService = taskService;
        this.takPermission = takPermission;
    }

    async _find(taskId: number, querySearch: { limit: number, page: number }) {
        try {
            return await this.commentRepository.find({ taskId }, querySearch)
        } catch (error) {
            throw error
        }
    }

    async find(userId: number, taskId: number, querySearch: { limit: number, page: number }) {
        try {
            await this.taskService.getTask(userId, taskId!);

            return await this.commentRepository.find({ taskId }, querySearch)
        } catch (error) {
            throw error
        }
    }



    async addComment(userId: number, data: Partial<IComment>) {
        try {

            const media: any = [];

            await this.taskService.getTask(userId, +data.taskId!);

            return await this.commentRepository.create({
                ...data,
                userId,
            });


        } catch (error) {

            throw error;
        }
    }

    async deleteComment(userId: number, commentId: number) {
        try {
            const comment = await this.commentRepository.findOne(commentId);

            if (!comment || comment.userId !== userId) throw setError(403, "Forbidden")


            await this.commentRepository.delete(commentId)

        } catch (error) {
            throw error;
        }
    }

}
