import { Service } from 'typedi';
import Model from "../app/model";
import BaseRepository from "../plugins/mysqldb";
import { setError } from '../utils/error-format';


export interface ITaskAttachment extends Model {
    taskId: number;
    url: String;
    storage_key: string;
    type: string
}

@Service()
export class TaskAttachmentRepository extends BaseRepository<ITaskAttachment>{
    constructor() {
        super("task_attachments")
    }

    async findOne(id: number | Partial<ITaskAttachment>): Promise<ITaskAttachment> {
        try {
            const query = this.qb()
                .leftJoin("tasks as task", "task.id", "=", "task_attachments.taskId")

                .select(
                    "task_attachments.*",
                    "task.spaceId as spaceId"
                )


            if (typeof id === 'number') {
                query.where('task_attachments.id', id)
            } else {
                Object.keys(id).forEach(key => {
                    id[`task_attachments.${key}`] = id[key];

                    delete id[key]
                })
                query.where(id)
            }

            return query.first()
        } catch (error) {
            console.log(error)
            throw setError(500, "database failure")
        }
    }
}
