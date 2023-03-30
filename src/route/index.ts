import { Container } from 'typedi';
import Controller from "../app/controller";
import AuthController from "../controllers/auth.controllers";
import SpaceController from '../controllers/space.controllers';
import TaskController from '../controllers/task.controllers';
import TeamController from '../controllers/team.controller';
import UserController from '../controllers/user.controllers';
import AuthServices from "../services/auth.services";
import ProfileServices from '../services/profile.services';
import ProfileImageServices from '../services/profileImage.services';
import SpaceServices from '../services/space.services';
import TeamServices from '../services/team.service';
import UserServices from '../services/user.services';
import TaskServices from '../services/task.services';
import TaskAttachmentServices from '../services/task_attachments.services';
import CommentController from '../controllers/comment.controllers';
import CommentServices from '../services/comment.services';
import ActivityServices from '../services/activity.services';
import ActivityController from '../controllers/activity.controllers';
import ProjectServices from '../services/project.services';
import ProjectController from '../controllers/project.controllers';


const routes: Controller[] = [
    new AuthController(
        "",
        Container.get(AuthServices)
    ),

    new UserController(
        "/users",
        Container.get(UserServices),
        Container.get(ProfileServices),
        Container.get(ProfileImageServices)
    ),

    new SpaceController(
        "/spaces",
        Container.get(SpaceServices),
        Container.get(ProjectServices),
        Container.get(TeamServices)
    ),

    new TeamController(
        "/teams",
        Container.get(TeamServices),
        Container.get(SpaceServices),
        Container.get(ProjectServices)
    ),

    new TaskController(
        "/tasks",
        Container.get(TaskServices),
        Container.get(TaskAttachmentServices),
        Container.get(CommentServices),
        Container.get(ActivityServices)
    ),

    new CommentController(
        "/comments",
        Container.get(CommentServices)
    ),

    new ActivityController(
        "/activities",
        Container.get(ActivityServices)
    ),

    new ProjectController(
        "/projects",
        Container.get(ProjectServices)
    )

]

export default routes