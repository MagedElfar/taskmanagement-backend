import { TeamRepository, ITeam } from './../model/team.model';
import { Inject, Service } from "typedi";
import { setError } from '../utils/error-format';

@Service()
export default class TeamServices {
    private readonly teamRepo: TeamRepository;


    constructor(@Inject() teamRepo: TeamRepository) {
        this.teamRepo = teamRepo;
    }



    async create(userId: number, data: Partial<ITeam>) {
        try {

            return await this.teamRepo.create({
                ...data,
                userId
            });
        } catch (error) {
            throw error;
        }
    }

    // async update(userId: number, data: Partial<IProfile>) {
    //     try {
    //         const userProfile = await this.profileRepo.findOne({ userId })

    //         if (!userProfile) return this.create(userId, data)

    //         return await this.profileRepo.update(userProfile.id, data)
    //     } catch (error) {
    //         throw error
    //     }
    // }
}
