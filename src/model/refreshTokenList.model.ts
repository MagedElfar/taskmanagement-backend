import { Service } from 'typedi';
import Model from "../app/model";
import BaseRepository from "../plugins/mysqldb";

export interface IRefresh_Token extends Model {
    user: number;
    token: string
}

@Service()
export class RefreshTokenRepository extends BaseRepository<IRefresh_Token>{
    constructor() {
        super("refresh_tokens_list")
    }
}
