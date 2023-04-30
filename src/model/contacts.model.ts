import { Service } from 'typedi';
import Model from "../app/model";
import BaseRepository from "../plugins/mysqldb";
import { setError } from '../utils/error-format';


export interface IContacts extends Model {
    conversation_id: number,
    user_Id: number
}

@Service()
export class ContactsRepository extends BaseRepository<IContacts>{
    constructor() {
        super("contacts")
    }

    async find(item: Partial<IContacts>) {
        try {
            return await this.db(this.tableName)
                .select(
                    'contacts.*',
                    'user.username',
                    "image.image_url as image",
                    "profile.first_name",
                    "profile.last_name",
                )
                .leftJoin("users as user", "user.id", "=", "contacts.user_Id")
                .leftJoin("profiles_images as image", "image.userId", "=", "user.id")
                .leftJoin("profiles as profile", "user.id", "=", "profile.userId")
                .whereIn('contacts.conversation_id', function () {
                    this.select("conversation_id")
                        .from("contacts")
                        .where("user_Id", "=", item.user_Id!)
                })
                .andWhereNot("user_Id", "=", item.user_Id!)
        } catch (error) {
            console.log(error)
            throw setError(500, "database failure")
        }
    }
}
