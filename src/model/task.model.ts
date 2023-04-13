import { GetTasksDto } from './../dto/task.dto';
import { Service } from 'typedi';
import Model from "../app/model";
import BaseRepository, { oneToManyMapped } from "../plugins/mysqldb";
import { setError } from '../utils/error-format';

export enum TaskStatus {
    TO_DO = "to do",
    IN_PROGRESS = "in progress",
    IN_REVIEW = "in review",
    DONE = "done",
    BLOCKED = "blocked"
}

export enum TaskPRIORITY {
    LOW = "low",
    MEDIUM = "medium",
    HEIGH = "heigh",
}

export interface ITask extends Model {
    title: string;
    description: string
    status: TaskStatus;
    priority: TaskPRIORITY;
    due_date: string;
    spaceId: number;
    userId: number;
    projectId?: number,
    parentId?: number,
    is_complete?: boolean
}


@Service()
export class TakRepository extends BaseRepository<ITask>{
    constructor() {
        super("tasks")
    }

    async ordersUpdate(query: string) {
        try {
            await this.db.raw(query)
        } catch (error) {
            console.log(error)
            throw setError(500, "database failure")
        }
    }

    async create(item: Omit<ITask, 'id'>): Promise<ITask> {
        try {
            const pos = await this.db.raw("SELECT IFNULL((SELECT position FROM tasks ORDER BY position DESC LIMIT 1) ,0) as position;");

            const position = pos[0][0].position + 1;

            const [output] = await this.qb().insert({
                ...item,
                position
            })
            const data = await this.findOne(output)
            return data
        } catch (error) {
            console.log(error)
            throw setError(500, "database failure")
        }
    }

    async find(getTaskDto: GetTasksDto): Promise<any> {

        try {
            const query = this.db(this.tableName)

            const { user, userId, parentId, page, limit, order = "desc", orderBy = "created_at", ...others } = getTaskDto

            if (parentId) {
                return await query.where({ parentId }).select("*")
            }

            query.leftJoin("assignees", "assignees.taskId", "=", "tasks.id")
                .leftJoin("task_attachments", "task_attachments.taskId", "=", "tasks.id")
                .leftJoin("teams as member", "member.id", "=", "assignees.memberId")
                .leftJoin("users as assignTo", "assignTo.id", "=", "member.userId")
                .leftJoin("profiles_images as assignToImage", "assignToImage.userId", "=", "assignTo.id")
                .leftJoin("projects as project", "project.id", "=", "tasks.projectId")
                .select(
                    "tasks.*",
                    "assignees.id as assignId",
                    "assignees.memberId as assignIdMember",
                    "assignTo.username as assignToUserName",
                    "assignToImage.image_url as assignToImage_url",
                    "project.name as projectName",
                    "task_attachments.url as taskMedia"
                )

            if (user) {
                query.where("member.userId", "=", userId!)
                    .orWhere("tasks.userId", "=", userId!)
            }

            Object.keys(others).forEach((key: string) => {
                if (key === "term") {
                    query.andWhere("tasks.title", "like", `%${others[key]}%`)
                    return
                }

                query.andWhere(`tasks.${key}`, "=", others[key])

            })

            query.groupBy("tasks.id")


            const tasksQuery = query.clone()

            if (limit) {
                tasksQuery.limit(limit)
                    .offset((page! - 1) * limit)
            }


            const data = await tasksQuery.orderBy(orderBy, order);

            const count = await query.clone().count('tasks.id as CNT').first();


            return {
                data,
                count: count?.CNT
            }
        } catch (error) {
            console.log(error)
            throw setError(500, "database failure")
        }
    }

    async findOne(id: number | Partial<ITask>): Promise<ITask> {
        try {
            const query = this.qb()
                .leftJoin("users as user", "user.id", "=", "tasks.userId")
                .leftJoin("profiles_images as userImage", "userImage.userId", "=", "user.id")
                .leftJoin("assignees as assign", "assign.taskId", "=", "tasks.id")
                .leftJoin("teams as member", "member.id", "=", "assign.memberId")
                .leftJoin("users as assignTo", "assignTo.id", "=", "member.userId")
                .leftJoin("profiles_images as assignToImage", "assignToImage.userId", "=", "assignTo.id")
                .leftJoin("projects as project", "project.id", "=", "tasks.projectId")

                .select(
                    "tasks.*",
                    "user.username",
                    "userImage.image_url as user_url",
                    "assign.id as assignId",
                    "assign.memberId as assignIdMember",

                    "assignTo.username as assignToUserName",
                    "assignToImage.image_url as assignToImage_url",
                    "project.name as projectName"
                )


            if (typeof id === 'number') {
                query.where('tasks.id', id)
            } else {
                Object.keys(id).forEach(key => {
                    id[`tasks.${key}`] = id[key];

                    delete id[key]
                })
                query.where(id)
            }


            return await query.first()

        } catch (error) {
            console.log(error)
            throw setError(500, "database failure")
        }
    }
}
