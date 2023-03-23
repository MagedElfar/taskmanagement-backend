import { GetCommentsDto } from './../dto/comment.dto';
import { Service } from 'typedi';
import Model from "../app/model";
import BaseRepository from "../plugins/mysqldb";
import { setError } from '../utils/error-format';


export interface IComment extends Model {
    taskId: number;
    comment: string;
    userId: number
}

@Service()
export class CommentRepository extends BaseRepository<IComment>{
    constructor() {
        super("comments")
    }

    async find(getCommentsDto: GetCommentsDto): Promise<any> {
        try {
            const query = this.db(this.tableName)
                .leftJoin("users as user", "user.id", "=", "comments.userId")
                .leftJoin("profiles_images as userImage", "userImage.userId", "=", "user.id")
                .select(
                    "comments.*",
                    "user.username",
                    "userImage.image_url as userImage"
                )
                .where("taskId", "=", getCommentsDto.taskId)

            const data = await query.clone()
                .limit(getCommentsDto.limit)
                .offset((getCommentsDto.page - 1) * getCommentsDto.limit)
                .orderBy("created_at", "desc");

            const count = await query.clone().count('comments.id as CNT').first();


            return {
                data,
                count: count?.CNT
            }
        } catch (error) {
            console.log(error)
            throw setError(500, "database failure")
        }
    }

    async findOne(id: number | Partial<IComment>): Promise<IComment> {
        try {
            const query = this.qb()
                .leftJoin("users as user", "user.id", "=", "comments.userId")
                .leftJoin("profiles_images as userImage", "userImage.userId", "=", "user.id")

                .select(
                    "comments.*",
                    "user.username",
                    "userImage.image_url as userImage"
                )


            if (typeof id === 'number') {
                query.where('comments.id', id)
            } else {
                Object.keys(id).forEach(key => {
                    id[`comments.${key}`] = id[key];

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
