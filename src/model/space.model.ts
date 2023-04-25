import { Service } from 'typedi';
import Model from "../app/model";
import BaseRepository, { oneToManyMapped } from "../plugins/mysqldb";
import { setError } from '../utils/error-format';

export interface ISpace extends Model {
    owner: number;
    name: string
}


@Service()
export class SpaceRepository extends BaseRepository<ISpace>{
    constructor() {
        super("spaces")
    }


    async find(item: Partial<ISpace>, option: any): Promise<any> {

        const { userId = 0, limit = 10, page = 1, term = null } = option
        try {
            const query = this.db(this.tableName)
                .select("spaces.*")
                .leftJoin("teams as team", "team.space", "=", "spaces.id")
                .where("team.userId", "=", userId)

            if (term) query.where("spaces.name", "like", `%${term}%`)


            const spaces = await query.clone().limit(limit).offset((page - 1) * limit);

            const count = await query.clone().count('spaces.id as CNT').first();

            return {
                spaces,
                count: count?.CNT
            }
        } catch (error) {
            console.log(error)
            throw setError(500, "database failure")
        }
    }

    async spaceReport(id: number, { fromDate, toDate }: { toDate?: string, fromDate?: string }) {
        try {

            const query = this.db(this.tableName)
                .leftJoin("tasks", "tasks.spaceId", "=", "spaces.id")
                .select(
                    this.db.raw('COUNT(*) AS total_tasks'),
                    this.db.raw('SUM(tasks.is_complete) AS completed_tasks'),
                    this.db.raw('SUM(tasks.is_archived) AS archived_tasks'),
                    'tasks.status',
                    this.db.raw('SUM(CASE WHEN tasks.status = "to do" THEN 1 ELSE 0 END) AS toDo'),
                    this.db.raw('SUM(CASE WHEN tasks.status = "in progress" THEN 1 ELSE 0 END) as inProgress'),
                    this.db.raw('SUM(CASE WHEN tasks.status = "in review" THEN 1 ELSE 0 END) as inReview'),
                    this.db.raw('SUM(CASE WHEN tasks.status = "done" THEN 1 ELSE 0 END) as done'),
                    this.db.raw('SUM(CASE WHEN tasks.status = "blocked" THEN 1 ELSE 0 END) as blocked')
                )
                .where("spaces.id", "=", id)
                .groupBy('status')

            console.log(fromDate, toDate)

            if (toDate && fromDate) {
                query.andWhereBetween("tasks.created_at", [fromDate, toDate])
            }

            const result = await query



            return result.reduce((accumulator, current) => {
                accumulator.total_tasks += current.total_tasks;
                accumulator.completed_tasks += parseInt(current.completed_tasks);
                accumulator.archived_tasks += parseInt(current.archived_tasks);
                accumulator.toDo += parseInt(current.toDo);
                accumulator.inProgress += parseInt(current.inProgress);
                accumulator.inReview += parseInt(current.inReview);
                accumulator.done += parseInt(current.done);
                accumulator.blocked += parseInt(current.blocked);
                return accumulator;
            }, {
                total_tasks: 0,
                completed_tasks: 0,
                archived_tasks: 0,
                toDo: 0,
                inProgress: 0,
                inReview: 0,
                done: 0,
                blocked: 0
            });

        } catch (error) {
            console.log(error)
            throw setError(500, "database failure")
        }
    }

    async spaceTeamReport(id: number, { fromDate, toDate }: { toDate?: string, fromDate?: string }) {
        try {


            const query = this.db(this.tableName)
                .select(
                    'teams.userId as memberId',
                    "userImg.image_url as image",
                    "user.username",
                    "user.email",
                    "profile.first_name as firstName",
                    "profile.last_name as lastName",
                    this.db.raw('count(tasks.id) as totalTasks'),
                    this.db.raw('sum(tasks.is_complete) as completedTasks')
                )

                .leftJoin('tasks', 'tasks.spaceId', 'spaces.id')
                .leftJoin('assignees', 'assignees.taskId', 'tasks.id')
                .leftJoin('teams', 'teams.id', 'assignees.memberId')
                .leftJoin("users as user", "user.id", "=", "teams.userId")
                .leftJoin("profiles_images as userImg", "userImg.userId", "=", "user.id")
                .leftJoin("profiles as profile", "profile.userId", "=", "user.id")
                .where('teams.space', 1)
                .groupBy('memberId');

            if (toDate && fromDate) {
                query.andWhereBetween("tasks.created_at", [fromDate, toDate])
            }

            return await query

        } catch (error) {
            console.log(error)
            throw setError(500, "database failure")
        }
    }
}
