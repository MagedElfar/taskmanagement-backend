import { Service } from 'typedi';
import Model from "../app/model";
import BaseRepository from "../plugins/mysqldb";

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
    projectId?: number
}


@Service()
export class TakRepository extends BaseRepository<ITask>{
    constructor() {
        super("tasks")
    }
}
