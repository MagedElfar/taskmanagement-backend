import db from "../database";
import type { Knex } from 'knex'
import { setError } from "../utils/error-format";

interface Writer<T> {
    create(item: Omit<T, 'id'>): Promise<T>
    update(id: number, item: Partial<T>): Promise<T>
    delete(id: number): Promise<boolean>
}
interface Reader<T> {
    find(item: Partial<T>): Promise<T[]>
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
        return this.db(this.tableName)
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

    async update(id: number, item: Partial<T>): Promise<T> {
        try {
            await this.qb()
                .where('id', id)
                .update(item)

            const data = await this.findOne(id);

            return data

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
    }

    async find(item: Partial<T>): Promise<T[]> {
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

    async isExist(id: Partial<T>): Promise<boolean> {
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