import { CreateTeamDto } from './../dto/team.dto';
import { TeamRepository, ITeam, Role } from './../model/team.model';
import { setError } from '../utils/error-format';
import { IUserServices } from './user.services';
import { IJwtServices } from './jwt.services';
import NodeMailerServices from './nodemailer.services';
import { SpaceRepository } from '../model/space.model';
import { autoInjectable, container, inject } from 'tsyringe';

export interface ITeamServices {
    find(data: Partial<ITeam>, querySearch: { limit?: number, page?: number }): Promise<{
        count: number,
        team: ITeam[]
    }>;
    findOne(data: Partial<ITeam> | number): Promise<ITeam>;
    create(createTeamDto: CreateTeamDto): Promise<ITeam>;
    sendInvitation(senderName: string, email: string, spaceId: number): Promise<void>;
    acceptNewUserInvitation(token: string, userId: number): Promise<ITeam>;
    acceptInvitation(token: string, user: number): Promise<ITeam>;
    update(id: number, role: Role): Promise<ITeam>;
    remove(id: number): Promise<void>;
    leave(userId: number, id: number): Promise<void>

}

@autoInjectable()
export class TeamServices implements ITeamServices {
    private readonly teamRepo: TeamRepository;
    // private readonly userService: IUserServices;
    private readonly spaceService: SpaceRepository;
    private readonly jwtServices: IJwtServices;
    private readonly nodeMailerServices: NodeMailerServices

    constructor(
        @inject("IUserServices") private userService: IUserServices,
        @inject("IJwtServices") jwtServices: IJwtServices,
        teamRepo: TeamRepository,
        nodeMailerServices: NodeMailerServices,
        spaceService: SpaceRepository

    ) {
        this.teamRepo = teamRepo;
        this.jwtServices = jwtServices;
        // this.userService = userService;
        this.nodeMailerServices = nodeMailerServices
        this.spaceService = spaceService;

    }

    teamQueryServices() {
        return this.teamRepo.qb()
    }

    async find(data: Partial<ITeam>, querySearch: { limit?: number, page?: number }) {
        try {
            return await this.teamRepo.find(data, querySearch)
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

    async sendInvitation(senderName: string, email: string, spaceId: number) {
        try {
            const space = await this.spaceService.findOne(spaceId);

            if (!space) throw setError(404, "workspace not exists");

            const { team } = await this.teamRepo.find({ space: spaceId }, {})

            const member = team.find((item: any) => item.userEmail === email);

            if (member) throw setError(400, "this user is already member here")

            const user = await this.userService.findUser({ email });

            let token,
                redirectUrl

            if (user) {
                token = this.jwtServices.newTokenSign({ userId: user.id, spaceId }, "7d");
                redirectUrl = "loading"
            } else {
                token = this.jwtServices.newTokenSign({ email, spaceId }, "7d")
                redirectUrl = "signup"
            }

            await this.nodeMailerServices.sendJoinTeamInvitation(
                token,
                senderName,
                space.name,
                email,
                redirectUrl
            )

        } catch (error) {
            throw error
        }

    }

    async acceptNewUserInvitation(token: string, userId: number) {
        try {
            const data = this.jwtServices.verifyToken(token, 400);

            const member = await this.teamRepo.findOne({
                userId,
                space: data.spaceId
            })

            if (member) throw setError(400, "you already jointed")

            return await this.create({
                userId,
                space: data.spaceId,
                role: Role.MEMBER
            })
        } catch (error) {
            throw error
        }
    }

    async acceptInvitation(token: string, user: number) {
        try {


            const data = this.jwtServices.verifyToken(token, 400);


            if (user !== data.userId) throw setError(403, "Forbidden")

            const userId = data.userId

            const member = await this.teamRepo.findOne({
                userId,
                space: data.spaceId
            })


            if (member) throw setError(400, "you already jointed")

            return await this.create({
                userId,
                space: data.spaceId,
                role: Role.MEMBER
            })

        } catch (error) {
            throw error
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