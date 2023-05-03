import { Service } from 'typedi';
import Model from "../app/model";
import BaseRepository from "../plugins/mysqldb";
import { setError } from '../utils/error-format';


export interface IMessage extends Model {
    content: String,
    conversation_id: number,
    sender_id: number
}

@Service()
export class MessageRepository extends BaseRepository<IMessage>{
    constructor() {
        super("messages")
    }

    async find(item: Partial<IMessage>, option: any): Promise<any> {

        const { page = 1 } = option

        console.log(page)

        try {
            const query = this.db(this.tableName)
                .leftJoin("users", "messages.sender_id", "=", "users.id")
                .leftJoin("profiles_images as image", "image.userId", "=", "users.id")
                .leftJoin("profiles as profile", "users.id", "=", "profile.userId")
                .select(
                    "messages.*",
                    "users.username",
                    "profile.first_name",
                    "profile.last_name",
                    "image.image_url as userImage"
                )

            query.where("messages.conversation_id", "=", item.conversation_id!)


            const messages = await query.clone().orderBy("created_at", "desc").limit(10).offset((page - 1) * 10);

            const count = await query.clone().count('users.id as CNT').first();

            return {
                messages,
                count: count?.CNT
            }
        } catch (error) {
            console.log(error)
            throw setError(500, "database failure")
        }
    }

    async findOne(id: number | Partial<IMessage>): Promise<IMessage> {
        try {
            const query = this.db(this.tableName)
                .leftJoin("users", "messages.sender_id", "=", "users.id")
                .leftJoin("profiles_images as image", "image.userId", "=", "users.id")
                .leftJoin("profiles as profile", "users.id", "=", "profile.userId")
                .select(
                    "messages.*",
                    "users.username",
                    "profile.first_name",
                    "profile.last_name",
                    "image.image_url as userImage"
                )

            typeof id === 'number'
                ? query.where('messages.id', id)
                : Object.keys(id).includes("id") ? query.where({ "messages.id": id.id }) : query.where(id)

            return await query.first()


        } catch (error) {
            console.log(error)
            throw setError(500, "database failure")
        }
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
