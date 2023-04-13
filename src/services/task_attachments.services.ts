import { TaskAttachmentRepository } from './../model/task_attachments.model';
import { Inject, Service } from "typedi";
import StorageService from './storage.services';
import fs from "fs";

@Service()
export default class TaskAttachmentServices {
    private readonly taskAttachmentRepo: TaskAttachmentRepository;
    private readonly storageService: StorageService;

    constructor(
        @Inject() taskAttachmentRepo: TaskAttachmentRepository,
        @Inject() storageService: StorageService
    ) {
        this.taskAttachmentRepo = taskAttachmentRepo;
        this.storageService = storageService;
    }

    QueryServices() {
        return this.taskAttachmentRepo.qb()
    }

    async find(taskId: number) {
        try {
            return await this.taskAttachmentRepo.find({ taskId })
        } catch (error) {
            throw error
        }
    }
    async addAttachment(userId: number, taskId: number, files: any) {
        try {

            const media: any = [];

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

            await this.storageService.delete(att.storage_key);

            await this.taskAttachmentRepo.delete(attId)

        } catch (error) {
            throw error;
        }
    }

}
