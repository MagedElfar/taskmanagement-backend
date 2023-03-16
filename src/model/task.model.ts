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

    async findOne(id: number | Partial<ITask>): Promise<ITask> {
        try {
            const query = this.qb()
                .leftJoin("tasks as subTasks", "subTasks.parentId", "=", "tasks.id")
                .leftJoin("users as user", "user.id", "=", "tasks.userId")
                .leftJoin("profiles_images as userImage", "userImage.userId", "=", "user.id")
                .leftJoin("assignees as assign", "assign.taskId", "=", "tasks.id")
                .leftJoin("teams as member", "member.id", "=", "assign.memberId")
                .leftJoin("users as assignTo", "assignTo.id", "=", "member.userId")
                .leftJoin("profiles_images as assignToImage", "assignToImage.userId", "=", "assignTo.id")

                .select(
                    "tasks.*",
                    "subTasks.title",
                    "subTasks.id",
                    "user.username",
                    "userImage.image_url as url",
                    "assign.id",
                    "assignTo.username",
                    "assignToImage.image_url as url"
                )
                .options({ nestTables: true })


            typeof id === 'number'
                ? query.where('tasks.id', id)
                : Object.keys(id).includes("id") ? query.where({
                    ...id,
                    "tasks.id": id.id,
                }) : query.where(id)

            return await query.then((result) => {
                const task = oneToManyMapped(result, "tasks", {
                    subTasks: "oneToMany",
                    user: "oneToOne",
                    userImage: "oneToOne",
                    assign: "oneToOne",
                    assignTo: "oneToOne",
                    assignToImage: "oneToOne"
                });

                if (task) {
                    task.user = {
                        ...task.user,
                        userImage: task.userImage?.url
                    }

                    task.assign = {
                        ...task.assign,
                        username: task.assignTo.username,
                        userImage: task.assignToImage?.url
                    }

                    const { userImage, assignTo, assignToImage, ...others } = task

                    return others

                }


                return task
            })
        } catch (error) {
            console.log(error)
            throw setError(500, "database failure")
        }
    }
}
