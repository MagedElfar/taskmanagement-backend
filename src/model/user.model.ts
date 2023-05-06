import Model from "../app/model";
import BaseRepository, { oneToManyMapped } from "../plugins/mysqldb";
import { Service } from "typedi";
import { setError } from "../utils/error-format";


export interface IUser extends Model {
    username: string;
    email: string;
    password: string;
}

@Service()
export class UserRepository extends BaseRepository<IUser>{
    constructor() {
        super("users")
    }

    async find(item: Partial<IUser>, option: any): Promise<any> {

        const { limit = 10, page = 1, term = null } = option

        console.log(term)
        try {
            const query = this.db(this.tableName)
                .leftJoin("profiles_images as image", "image.userId", "=", "users.id")
                .leftJoin("profiles as profile", "users.id", "=", "profile.userId")
                .select(
                    "users.id",
                    "users.username",
                    "profile.first_name",
                    "profile.last_name",
                    "image.image_url as image"
                )


            if (term) query.where("username", "like", `%${term}%`).orWhere("email", "like", `%${term}%`)


            const users = await query.clone().limit(limit).offset((page - 1) * limit);

            const count = await query.clone().count('users.id as CNT').first();

            return {
                users,
                count: count?.CNT
            }
        } catch (error) {
            console.log(error)
            throw setError(500, "database failure")
        }
    }

    async findOne(id: number | Partial<IUser>): Promise<IUser> {
        try {
            const query = this.db(this.tableName)
                .leftJoin("profiles_images as image", "image.userId", "=", "users.id")
                .leftJoin("profiles as profile", "users.id", "=", "profile.userId")
                .select(
                    "users.*",
                    "profile.first_name",
                    "profile.last_name",
                    "profile.phone",
                    "profile.gender",
                    "image.image_url"
                )

            typeof id === 'number'
                ? query.where('users.id', id)
                : Object.keys(id).includes("id") ? query.where({ "users.id": id.id }) : query.where(id)

            return query
                .options({ nestTables: true })
                .then(res => {
                    return oneToManyMapped(res, "users", {
                        profile: "oneToOne",
                        image: "oneToOne"
                    })
                })

        } catch (error) {
            console.log(error)
            throw setError(500, "database failure")
        }
    }

}
