import teamServices, { ITeamServices, TeamServices } from './team.service';
import { ITeam, Role } from '../model/team.model';
import { setError } from '../utils/error-format';
import userService, { IUserServices } from './user.services';
import jwtServices, { IJwtServices } from './jwt.services';
import { container } from 'tsyringe';
import emailServices, { IEmailServices } from './email.services';
import spaceService, { ISpaceServices } from './space.services';

export interface IInvitationServices {
    sendInvitation(senderName: string, email: string, spaceId: number): Promise<void>;
    acceptNewUserInvitation(token: string, userId: number): Promise<ITeam>;
    acceptInvitation(token: string, user: number): Promise<ITeam>;
}

export abstract class InvitationServices {
    protected readonly teamServices: ITeamServices
    protected readonly userService: IUserServices;
    protected readonly spaceService: ISpaceServices;
    protected readonly jwtServices: IJwtServices;
    protected readonly emailServices: IEmailServices

    constructor(
        userService: IUserServices,
        jwtServices: IJwtServices,
        teamServices: ITeamServices,
        emailServices: IEmailServices,
        spaceService: ISpaceServices

    ) {
        this.jwtServices = jwtServices;
        this.userService = userService;
        this.teamServices = teamServices
        this.emailServices = emailServices
        this.spaceService = spaceService;

    }

    async sendInvitation(senderName: string, email: string, spaceId: number) {
        try {
            const space = await this.spaceService.findOne(spaceId);

            if (!space) throw setError(404, "workspace not exists");

            const { team } = await this.teamServices.find({ space: spaceId })

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

            await this.emailServices.sendJoinTeamInvitation(
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

    abstract acceptInvitation(token: string, user: number): Promise<ITeam>;

}

export class ExistUserInvitation extends InvitationServices {

    constructor() {
        super(
            userService,
            jwtServices,
            teamServices,
            emailServices,
            spaceService,
        )
    }



    async acceptInvitation(token: string, user: number) {
        try {

            const data = this.jwtServices.verifyToken(token, 400);

            if (user !== data.userId) throw setError(403, "Forbidden")

            const userId = data.userId

            const member = await this.teamServices.findOne({
                userId,
                space: data.spaceId
            })


            if (member) throw setError(400, "you already jointed")

            return await this.teamServices.create({
                userId,
                space: data.spaceId,
                role: Role.MEMBER
            })

        } catch (error) {
            throw error
        }
    }
}

export class NewUserInvitation extends InvitationServices {

    constructor() {
        super(
            userService,
            jwtServices,
            teamServices,
            emailServices,
            spaceService,
        )
    }

    async acceptInvitation(token: string, user: number) {
        try {
            const data = this.jwtServices.verifyToken(token, 400);

            const member = await this.teamServices.findOne({
                user,
                space: data.spaceId
            })

            if (member) throw setError(400, "you already jointed")

            return await this.teamServices.create({
                userId: user,
                space: data.spaceId,
                role: Role.MEMBER
            })
        } catch (error) {
            throw error
        }
    }
}


export const existUserInvitation = container.resolve(ExistUserInvitation);

export const newUserInvitation = container.resolve(NewUserInvitation);
