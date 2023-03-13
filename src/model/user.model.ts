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

    async findUser(id: number | Partial<IUser>) {
        try {

            return typeof id === 'number'
                ? await this.qb().where('users.id', id).first()
                : await this.qb().where(id).first()

        } catch (error) {
            console.log(error)
            throw setError(500, "database failure")
        }
    }

    async findWithTeam(id: number | Partial<IUser>) {
        try {
            const q = this.qb()
                .select("users.*", "teams.*")
                .leftJoin("teams", "teams.userId", "=", "users.id")
                .options({ nestTables: true })

            const user = typeof id === 'number'
                ? q.where('users.id', id)
                : q.where(id)


            return await q.then((result) => {
                return oneToManyMapped(result, "users", {
                    teams: "oneToMany"
                })
            })
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
