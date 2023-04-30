import db from "../database";
import type { Knex } from 'knex'
import { setError } from "../utils/error-format";
import { object } from "joi";

export function oneToManyMapped(arr: any[], target: string, relation: any) {

    if (!arr.length) return null

    const user = arr.reduce((obj, item, index) => {
        if (index === 0) {
            const targetObj = item[target];
            obj = {
                ...targetObj
            }
        }

        delete item[target];

        Object.keys(relation).forEach(key => {
            if (relation[key] === "oneToOne") {
                !obj[key] ? Object.assign(obj, { [key]: { ...item[key] } }) : obj
            } else {
                !obj[key] ? Object.assign(obj, { [key]: [item[key]] }) : obj[key] = [...obj[key], item[key]]
            }
        })


        return obj
    }, {})

    return user;
}

interface Writer<T> {
    create(item: Omit<T, 'id'>): Promise<T>
    update(id: number, item: Partial<T>): Promise<T>
    delete(id: number): Promise<boolean>
}
interface Reader<T> {
    find(item: Partial<T>, option: any): Promise<any>;
    findOne(id: number | Partial<T>): Promise<T>
}

type BaseRepository<T> = Writer<T> & Reader<T>

export default abstract class KnexRepository<T> implements BaseRepository<T> {
    protected tableName: string;
    protected readonly db;

    constructor(tableName: string) {
        this.tableName = tableName;
        this.db = db;
    }
    public qb(): Knex.QueryBuilder {
        try {
            return this.db(this.tableName)
        } catch (error) {
            console.log(error)
            throw setError(500, "database failure")
        }
    }


    async create(item: Omit<T, 'id'>): Promise<T> {
        try {
            const [output] = await this.qb().insert(item)
            const data = await this.findOne(output)
            return data
        } catch (error) {
            console.log(error)
            throw setError(500, "database failure")
        }
    }

    async createMany(item: Partial<T>[] | T[]) {
        try {
            const [output] = await this.qb().insert(item)
        } catch (error) {
            console.log(error)
            throw setError(500, "database failure")
        }
    }

    async update(id: number, item: Partial<T>): Promise<T> {
        try {
            const updated_at = new Date()

            await this.qb()
                .where('id', id)
                .update({
                    ...item,
                    updated_at
                })

            const data = await this.findOne(id);

            return data

        } catch (error) {
            console.log(error)
            throw setError(500, "database failure")
        }
    }

    async updateMany(selector: Partial<T>, item: Partial<T>): Promise<void> {
        try {
            const updated_at = new Date()

            await this.qb()
                .where(selector)
                .update({
                    ...item,
                    updated_at
                })

        } catch (error) {
            console.log(error)
            throw setError(500, "database failure")
        }
    }


    async delete(id: number): Promise<boolean> {
        try {
            return await this.qb()
                .where('id', id)
                .delete()
        } catch (error) {
            console.log(error)
            throw setError(500, "database failure")
        }
    };

    async deleteMany(selector: Partial<T>): Promise<void> {
        try {
            return await this.qb()
                .where(selector)
                .delete()
        } catch (error) {
            console.log(error)
            throw setError(500, "database failure")
        }
    };

    async find(item: Partial<T>, option?: any): Promise<any> {
        try {
            return this.qb()
                .where(item)
                .select()
        } catch (error) {
            console.log(error)
            throw setError(500, "database failure")
        }
    }

    async findOne(id: number | Partial<T>): Promise<T> {
        try {
            return typeof id === 'number'
                ? await this.qb().where('id', id).first()
                : await this.qb().where(id).first()
        } catch (error) {
            console.log(error)
            throw setError(500, "database failure")
        }
    }

    findItem(id: number | Partial<T>) {
        try {
            return typeof id === 'number'
                ? this.qb().where('id', id).first()
                : this.qb().where(id).first()
        } catch (error) {
            console.log(error)
            throw setError(500, "database failure")
        }
    }

    async isExist(id: number | Partial<T>): Promise<boolean> {
        try {
            const exist = await this.qb().where(id).first();

            if (!exist) return false;

            return true
        } catch (error) {
            console.log(error)
            throw setError(500, "database failure")
        }
    }
}