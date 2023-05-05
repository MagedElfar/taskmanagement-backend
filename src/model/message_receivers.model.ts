import { Service } from 'typedi';
import Model from "../app/model";
import BaseRepository from "../plugins/mysqldb";
import { setError } from '../utils/error-format';


export interface IMessageReceiver extends Model {
    is_read: boolean,
    message_id: number,
    receiver_id: number,
    conversation_id?: number
}

@Service()
export class MessageReceiverRepository extends BaseRepository<IMessageReceiver>{
    constructor() {
        super("message_receivers")
    }

    async find(item: Partial<IMessageReceiver>): Promise<any> {


        try {
            const query = this.db(this.tableName)

            query.where(item)


            const count = await query.count('id as CNT').first();

            return count?.CNT


        } catch (error) {
            console.log(error)
            throw setError(500, "database failure")
        }
    }


    async updateMany(selector: Partial<IMessageReceiver>, item: Partial<IMessageReceiver>): Promise<void> {
        try {
            const updated_at = new Date()

            await this.qb()
                .leftJoin("messages", "messages.id", "=", "message_receivers.message_id")
                .leftJoin("conversations", "conversations.id", "=", "messages.conversation_id")
                .where("receiver_id", "=", selector.receiver_id!)
                .andWhere("conversations.id", "=", selector.conversation_id!)
                .update({
                    ...item,
                    "message_receivers.updated_at": updated_at
                })

        } catch (error) {
            console.log(error)
            throw setError(500, "database failure")
        }
    }
}
