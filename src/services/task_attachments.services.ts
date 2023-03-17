import { TaskAttachmentRepository } from './../model/task_attachments.model';
import { Inject, Service } from "typedi";
import StorageService from './storage.services';
import { setError } from '../utils/error-format';
import TaskServices from './task.services';
import fs from "fs";
import TakPermission from '../middleware/task-permissions.middleware';

@Service()
export default class TaskAttachmentServices {
    private readonly taskAttachmentRepo: TaskAttachmentRepository;
    private readonly taskService: TaskServices;
    private readonly storageService: StorageService;
    private readonly takPermission: TakPermission;

    constructor(
        @Inject() takPermission: TakPermission,
        @Inject() taskAttachmentRepo: TaskAttachmentRepository,
        @Inject() taskService: TaskServices,
        @Inject() storageService: StorageService
    ) {
        this.taskAttachmentRepo = taskAttachmentRepo;
        this.taskService = taskService;
        this.storageService = storageService,
            this.takPermission = takPermission;
    }


    async addAttachment(userId: number, taskId: number, files: any) {
        try {

            const media: any = [];

            await this.taskService.findOne(userId, taskId);

            await Promise.all(files.map(async (file: Express.Multer.File) => {
                const storageData: any = await this.storageService.upload(file.filename, "task")

                const att = await this.taskAttachmentRepo.create({
                    url: storageData.secure_url,
                    storage_key: storageData.public_id,
                    type: file.mimetype,
                    taskId
                });

                media.push(att);

                return;
            }))

            return media;
        } catch (error) {
            files.map((file: Express.Multer.File) => {
                console.log(file)
                fs.unlink(file.path, function (err) {
                    if (err) console.log(err)
                })
            })
            throw error;
        }
    }

    async deleteAtt(userId: number, attId: number) {
        try {
            const att = await this.taskAttachmentRepo.findOne(attId);

            if (!att) throw setError(404, "not found")

            console.log(att)
            const hasPermission = await this.takPermission.adminPermission(att.spaceId, userId)

            if (!hasPermission) throw setError(403, "Forbidden")

            await this.storageService.delete(att.storage_key);

            await this.taskAttachmentRepo.delete(attId)

        } catch (error) {
            throw error;
        }
    }

}
