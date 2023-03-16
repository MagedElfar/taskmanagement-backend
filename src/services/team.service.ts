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

            console.log(space)

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

    private async checkIfOwner(id: number, userId: number) {
        try {
            const member = await this.teamRepo.findOne(id);

            if (!member || member?.spaceOwner !== userId) throw setError(403, "Forbidden");


            return true;

        } catch (error) {
            throw error;
        }
    }

    async update(userId: number, id: number, role: Role) {
        try {

            await this.checkIfOwner(id, userId)

            const member = await this.teamRepo.findOne(id);

            if (!member || member?.userId === userId) throw setError(400, "you cant update role for this user")


            return await this.teamRepo.update(id, { role })
        } catch (error) {
            throw error
        }
    }

    async remove(userId: number, id: number) {
        try {

            await this.checkIfOwner(id, userId)


            return await this.teamRepo.delete(id)
        } catch (error) {
            throw error
        }
    }

    async leave(userId: number, id: number) {
        try {

            const member = await this.teamRepo.findOne(id);

            if (!member || member?.spaceOwner === userId || member?.userId !== userId) throw setError(403, "Forbidden");

            return await this.teamRepo.delete(id)
        } catch (error) {
            throw error
        }
    }
}


