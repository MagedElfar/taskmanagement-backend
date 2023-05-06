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
            const query = this.db(this.tableName)
                .select(
                    'contacts.*',
                    'user.username',
                    'image.image_url as image',
                    'profile.first_name',
                    'profile.last_name',
                    this.db.raw('(SELECT COUNT(*) FROM message_receivers WHERE message_receivers.message_id IN (SELECT messages.id FROM messages WHERE messages.conversation_id = contacts.conversation_id AND messages.sender_id != ?) AND message_receivers.is_read = ?) AS unread_count', [item?.user_Id ? item.user_Id! : 0, false])
                )
                .leftJoin('users as user', 'user.id', '=', 'contacts.user_Id')
                .leftJoin('profiles_images as image', 'image.userId', '=', 'user.id')
                .leftJoin('profiles as profile', 'user.id', '=', 'profile.userId')


            if (item?.user_Id) {
                query
                    .whereIn('contacts.conversation_id', function () {
                        this.select('conversation_id')
                            .from('contacts')
                            .where('user_Id', '=', item.user_Id!)
                    })
                    .andWhereNot('user_Id', '=', item.user_Id!)
            }


            if (item.conversation_id) {
                query.andWhere('contacts.conversation_id', '=', item.conversation_id)
            }


            return await query
        } catch (error) {
            console.log(error)
            throw setError(500, "database failure")
        }
    }


}
