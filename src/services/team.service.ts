import { TeamRepository, ITeam, Role } from './../model/team.model';
import { Inject, Service } from "typedi";
import { setError } from '../utils/error-format';
import UserServices from './user.services';
import JwtServices from './jwt.services';
import NodeMailerServices from './nodemailer.services';
import { SpaceRepository } from '../model/space.model';

@Service()
export default class TeamServices {
    private readonly teamRepo: TeamRepository;
    private readonly userService: UserServices;
    private readonly spaceService: SpaceRepository;
    private readonly jwtServices: JwtServices;
    private readonly nodeMailerServices: NodeMailerServices

    constructor(
        @Inject() teamRepo: TeamRepository,
        @Inject() userService: UserServices,
        @Inject() jwtServices: JwtServices,
        @Inject() nodeMailerServices: NodeMailerServices,
        @Inject() spaceService: SpaceRepository

    ) {
        this.teamRepo = teamRepo;
        this.jwtServices = jwtServices;
        this.userService = userService;
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

    async sendInvitation(senderName: string, email: string, spaceId: number) {
        try {
            const space = await this.spaceService.findOne(spaceId);

            if (!space) throw setError(404, "workspace not exists")

            const member = space.team.find((item: any) => item.user.userEmail === email);

            if (member) throw setError(400, "this user is already member here")

            const user = await this.userService.findUser({ email });

            let token,
                redirectUrl

            if (user) {
                token = this.jwtServices.newTokenSign({ userId: user.id, spaceId }, "7d");
                redirectUrl = "team"
            } else {
                token = this.jwtServices.newTokenSign({ spaceId }, "7d")
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

    async acceptInvitation(token: string, user?: number) {
        try {


            const data = this.jwtServices.verifyToken(token, 400);

            const userId = user || data.userId

            const member = await this.teamRepo.findOne({
                userId,
                space: data.spaceId
            })

            console.log("member", member)

            if (member) throw setError(400, "you already jointed")
            console.log(member)

            return await this.create(userId, {
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
            return await this.teamRepo.delete(id)
        } catch (error) {
            throw error
        }
    }

    async leave(userId: number, id: number) {
        try {
            const member: ITeam = await this.teamRepo.findOne(id);

            if (!member || member.userId !== userId || member.role === Role.OWNER) throw setError(403, "Forbidden");

            return await this.teamRepo.delete(id)
        } catch (error) {
            throw error
        }
    }
}


