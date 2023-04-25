import { Service } from 'typedi';
import Model from "../app/model";
import BaseRepository from "../plugins/mysqldb";
import { setError } from '../utils/error-format';


export interface IAssignee extends Model {
    taskId: number;
    memberId: number;
}

@Service()
export class AssigneeRepository extends BaseRepository<IAssignee>{
    constructor() {
        super("assignees")
    }

    async findOne(id: number | Partial<IAssignee>): Promise<any> {
        try {
            const query = this.qb()
                .leftJoin("teams as member", "member.id", "=", "assignees.memberId")
                .leftJoin("tasks as task", "task.id", "=", "assignees.taskId")
                .leftJoin("users as user", "user.id", "=", "member.userId")
                .leftJoin("profiles_images as userImage", "userImage.userId", "=", "user.id")
                .select(
                    "assignees.*",
                    "member.space as spaceId",
                    "user.id as userId",
                    "user.username",
                    "userImage.image_url as url",
                    "task.id as taskId",
                    "task.spaceId as spaceId",
                    "task.userId as author",
                    "task.title as title"
                )
            return typeof id === 'number'
                ? await query.where('assignees.id', id).first()
                : Object.keys(id).includes("id") ? query.where({ "assignees.id": id.id }) : query.where(id).first()
        } catch (error) {
            console.log(error)
            throw setError(500, "database failure")
        }
    }

}
