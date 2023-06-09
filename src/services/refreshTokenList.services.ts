import { autoInjectable, container } from 'tsyringe';
import { RefreshTokenRepository, IRefresh_Token } from './../model/refreshTokenList.model';

export interface IRefreshTokenServices {
    create(data: Partial<IRefresh_Token>): Promise<IRefresh_Token>;
    findOne(data: Partial<IRefresh_Token>): Promise<IRefresh_Token>;
    update(id: number, data: Partial<IRefresh_Token>): Promise<IRefresh_Token>;
    delete(id: number): Promise<void>
}

@autoInjectable()
export class RefreshTokenServices implements IRefreshTokenServices {
    private readonly tokenRepo: RefreshTokenRepository;

    constructor(tokenRepo: RefreshTokenRepository) {
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
            await this.tokenRepo.delete(id);
            return;
        } catch (error) {
            throw error;
        }
    }
}

container.register("IRefreshTokenServices", { useClass: RefreshTokenServices });
const refreshTokenServices = container.resolve(RefreshTokenServices);

export default refreshTokenServices;