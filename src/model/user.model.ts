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

    async findOne(id: number | Partial<IUser>): Promise<IUser> {
        try {
            const query = this.db(this.tableName)
                .leftJoin("profiles_images as image", "image.userId", "=", "users.id")
                .leftJoin("profiles as profile", "users.id", "=", "profile.userId")

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
            console.log("error")
            throw setError(500, "database failure")
        }
    }

}
