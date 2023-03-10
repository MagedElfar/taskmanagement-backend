import { RefreshTokenRepository, IRefresh_Token } from './../model/refreshTokenList.model';
import { Inject, Service } from "typedi";

@Service()
export default class RefreshTokenServices {
    private readonly tokenRepo: RefreshTokenRepository;

    constructor(@Inject() tokenRepo: RefreshTokenRepository) {
        this.tokenRepo = tokenRepo;
    }

    async create(data: Partial<IRefresh_Token>) {
        try {
            return await this.tokenRepo.create(data);
        } catch (error) {
            throw error;
        }
    }

    async findOne(data: Partial<IRefresh_Token>) {
        try {
            return await this.tokenRepo.findOne(data);
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Partial<IRefresh_Token>) {
        try {
            return await this.tokenRepo.update(id, data)
        } catch (error) {
            throw error;
        }
    }

    async delete(id: number) {
        try {
            return await this.tokenRepo.delete(id)
        } catch (error) {
            throw error;
        }
    }
}
