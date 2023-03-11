import Model from "../app/model";
import BaseRepository from "../plugins/mysqldb";
import { Service } from "typedi";
import { setError } from "../utils/error-format";
import knex from "knex";
import db from "../database";

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

    async findOne(id: number | Partial<IUser>): Promise<IUser> {
        try {
            const query = this.db(this.tableName)
                .leftJoin("profiles_images as image", "image.userId", "=", "users.id")
                .leftJoin("profiles as profile", "users.id", "=", "profile.userId")

            typeof id === 'number'
                ? query.where('users.id', id)
                : Object.keys(id).includes("id") ? query.where({ "users.id": id.id }) : query.where(id)

            return query.first().options({ nestTables: true })
                .then(res => {
                    if (res) {
                        const user = {}

                        Object.keys(res).forEach((key: string) => {
                            if (key === "users") return Object.assign(user, { ...res[key] });

                            if (res[key]?.id) return Object.assign(user, { [key]: res[key] });
                        })

                        return user
                    }

                    return res

                })

        } catch (error) {
            console.log("error")
            throw setError(500, "database failure")
        }
    }

}
