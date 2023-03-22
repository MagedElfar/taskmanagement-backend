import { Service } from 'typedi';
import Model from "../app/model";
import BaseRepository, { oneToManyMapped } from "../plugins/mysqldb";
import { setError } from '../utils/error-format';

export enum TaskStatus {
    TO_DO = "to do",
    IN_PROGRESS = "in progress",
    IN_REVIEW = "in review",
    COMPLETED = "completed",
    BLOCKED = "blocked"
}

export enum TaskPRIORITY {
    LOW = "low",
    MEDIUM = "medium",
    HEIGH = "heigh"
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
    parentId?: number
}


@Service()
export class TakRepository extends BaseRepository<ITask>{
    constructor() {
        super("tasks")
    }



    async find(item: Partial<ITask>, option: any): Promise<any> {

        console.log("option", option)

        const {
            user = null,
            userId,
            limit = 10,
            page = 1,
            term = null,
            space = null,
            orderBy = "created_at",
            order = "asc",
            status,
            project,
            parentId
        } = option
        try {
            const query = this.db(this.tableName)


            if (parentId) {
                return await query.where({ parentId }).select("*")
            }

            query.leftJoin("assignees", "assignees.taskId", "=", "tasks.id")
                .leftJoin("teams as member", "member.id", "=", "assignees.memberId")
                .select("tasks.*")

            if (user) {
                query.where("member.userId", "=", userId)
                    .orWhere("tasks.userId", "=", userId)
            }

            if (space) {
                query.andWhere("tasks.spaceId", "=", space)
            }

            if (status) {
                query.andWhere("tasks.status", "=", status)
            }

            if (term) {
                query.andWhere("tasks.title", "like", `%${term}%`)
            }

            if (project) {
                query.andWhere("tasks.projectId", "=", project)
            }

            const tasks = await query.clone()
                .limit(limit)
                .offset((page - 1) * limit)
                .orderBy(orderBy, order);

            const count = await query.clone().count('tasks.id as CNT').first();


            return {
                tasks,
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
                    "assignTo.username as assignToImageName",
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
                console.log(id)
                query.where(id)
            }


            return await query.first()

        } catch (error) {
            console.log(error)
            throw setError(500, "database failure")
        }
    }
}
