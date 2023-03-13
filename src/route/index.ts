import { Container } from 'typedi';
import Controller from "../app/controller";
import AuthController from "../controllers/auth.controllers";
import SpaceController from '../controllers/space.controllers';
import UserController from '../controllers/user.controllers';
import AuthServices from "../services/auth.services";
import ProfileServices from '../services/profile.services';
import ProfileImageServices from '../services/profileImage.services';
import SpaceServices from '../services/space.services';
import UserServices from '../services/user.services';


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
        Container.get(SpaceServices)
    )

]

export default routes