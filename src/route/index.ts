import { container } from 'tsyringe';
import Controller from "../app/controller";
import AuthController from "../controllers/auth.controllers";
import PasswordController from '../controllers/password.controllers';
import ProfileController from '../controllers/profile.controllers';
import SpaceController from '../controllers/space.controllers';
import UserController from '../controllers/user.controllers';



const routes: Controller[] = [

    container.resolve(AuthController),

    container.resolve(UserController),

    container.resolve(ProfileController),

    container.resolve(SpaceController),

    container.resolve(PasswordController)


    // new MediaController(
    //     "/media",
    //     Container.get(ProfileImageServices),
    //     Container.get(TaskAttachmentServices)
    // ),

    // new ReportController(
    //     "/reports",
    //     Container.get(ReportServices)
    // )

    // new TeamController(
    //     "/teams",
    //     Container.get(TeamServices),
    //     Container.get(SpaceServices),
    //     Container.get(ProjectServices)
    // ),

    // new TaskController(
    //     "/tasks",
    //     Container.get(TaskServices),
    //     Container.get(TaskAttachmentServices),
    //     Container.get(ActivityServices),
    // ),

    // new AssignController(
    //     "/assign",
    //     Container.get(AssigneeServices)
    // ),

    // new CommentController(
    //     "/comments",
    //     Container.get(CommentServices)
    // ),

    // new ActivityController(
    //     "/activities",
    //     Container.get(ActivityServices)
    // ),

    // new ProjectController(
    //     "/projects",
    //     Container.get(ProjectServices)
    // ),

    // new NotificationController(
    //     "/notifications",
    //     Container.get(NotificationServices)
    // ),

    // new ConversationController(
    //     "/conversations",
    //     Container.get(ConversationServices)
    // ),

    // new MessageController(
    //     "/messages",
    //     Container.get(MessagesServices),
    //     Container.get(MessagesReceiverServices)
    // )

]

export default routes