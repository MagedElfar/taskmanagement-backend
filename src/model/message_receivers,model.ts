import { Service } from 'typedi';
import Model from "../app/model";
import BaseRepository from "../plugins/mysqldb";
import { setError } from '../utils/error-format';


export interface IMessageReceiver extends Model {
    is_read: boolean,
    message_id: number,
    receiver_id: number
}

@Service()
export class MessageReceiverRepository extends BaseRepository<IMessageReceiver>{
    constructor() {
        super("message_receivers")
    }

    // async find(item: Partial<IMessage>) {
    //     try {
    //         return await this.db(this.tableName)
    //             .select(
    //                 'contacts.*',
    //                 'user.username',
    //                 "image.image_url as image",
    //                 "profile.first_name",
    //                 "profile.last_name",
    //             )
    //             .leftJoin("users as user", "user.id", "=", "contacts.user_Id")
    //             .leftJoin("profiles_images as image", "image.userId", "=", "user.id")
    //             .leftJoin("profiles as profile", "user.id", "=", "profile.userId")
    //             .whereIn('contacts.conversation_id', function () {
    //                 this.select("conversation_id")
    //                     .from("contacts")
    //                     .where("user_Id", "=", item.user_Id!)
    //             })
    //             .andWhereNot("user_Id", "=", item.user_Id!)
    //     } catch (error) {
    //         console.log(error)
    //         throw setError(500, "database failure")
    //     }
    // }
}
