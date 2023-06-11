import { CreateTeamDto, FindTeamDto } from './../dto/team.dto';
import { TeamRepository, ITeam, Role } from './../model/team.model';
import { setError } from '../utils/error-format';
import { IUserServices, UserServices } from './user.services';
import { IJwtServices, JwtServices } from './jwt.services';
import { SpaceRepository } from '../model/space.model';
import { autoInjectable, container, inject } from 'tsyringe';
import { Knex } from 'knex';

export interface ITeamServices {
    teamQueryServices(): Knex.QueryBuilder;
    find(findTeamDto: FindTeamDto): Promise<{ count: number, team: ITeam[] }>;
    findOne(data: Partial<ITeam> | number): Promise<ITeam>;
    create(createTeamDto: CreateTeamDto): Promise<ITeam>;

    update(id: number, role: Role): Promise<ITeam>;
    remove(id: number): Promise<void>;
    leave(userId: number, id: number): Promise<void>

}

@autoInjectable()
export class TeamServices implements ITeamServices {
    private readonly teamRepo: TeamRepository;
    private readonly spaceService: SpaceRepository;
    private readonly jwtServices: IJwtServices;

    constructor(
        @inject(UserServices) private userService: IUserServices,
        @inject(JwtServices) jwtServices: IJwtServices,
        teamRepo: TeamRepository,
        spaceService: SpaceRepository

    ) {
        this.teamRepo = teamRepo;
        this.jwtServices = jwtServices;
        this.spaceService = spaceService;

    }

    teamQueryServices() {
        return this.teamRepo.qb()
    }

    async find(findTeamDto: FindTeamDto) {
        const { space, ...querySearch } = findTeamDto
        try {
            return await this.teamRepo.find({ space }, querySearch)
        } catch (error) {
            throw error
        }
    }

    async findOne(data: Partial<ITeam> | number) {
        try {
            return await this.teamRepo.findOne(data)
        } catch (error) {
            throw error
        }
    }

    async create(createTeamDto: CreateTeamDto) {
        try {
            return await this.teamRepo.create(createTeamDto);
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, role: Role) {
        try {
            return await this.teamRepo.update(id, { role })
        } catch (error) {
            throw error
        }
    }

    async remove(id: number) {
        try {
            await this.teamRepo.delete(id)
        } catch (error) {
            throw error
        }
    }

    async leave(userId: number, id: number) {
        try {
            const member: ITeam = await this.teamRepo.findOne(id);

            if (!member || member.userId !== userId || member.role === Role.OWNER) throw setError(403, "Forbidden");

            await this.teamRepo.delete(id)

            return;
        } catch (error) {
            throw error
        }
    }
}


container.register<ITeamServices>("ITeamServices", { useClass: TeamServices });
const teamServices = container.resolve(TeamServices);

export default teamServices;