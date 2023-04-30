import { Service } from 'typedi';
import Model from "../app/model";
import BaseRepository from "../plugins/mysqldb";
import { setError } from '../utils/error-format';


export interface IConversations extends Model {
    taskId: number;
    comment: string;
    userId: number
}

@Service()
export class ConversationsRepository extends BaseRepository<IConversations>{
    constructor() {
        super("conversations")
    }

    async checkIfExist(user1: number, user2: number) {
        try {
            const conversation = await this.db(`${this.tableName} as c`)
                .join("contacts as c1", "c.id", "c1.conversation_id")
                .join("contacts as c2", "c.id", "c2.conversation_id")
                .where("c1.user_Id", user1)
                .andWhere("c2.user_Id", user2)
                .andWhere("c.type", "private")
                .first();

            return conversation;

        } catch (error) {
            console.log(error)
            throw setError(500, "database failure")
        }
    }
}
