import { Container } from 'typedi';
import Controller from "../app/controller";
import AuthController from "../controllers/auth.controllers";
import UserController from '../controllers/user.controllers';
import AuthServices from "../services/auth.services";
import ProfileServices from '../services/profile.services';
import ProfileImageServices from '../services/profileImage.services';
import UserServices from '../services/user.services';


const routes: Controller[] = [
    new AuthController("", Container.get(AuthServices)),
    new UserController(
        "/users",
        Container.get(UserServices),
        Container.get(ProfileServices),
        Container.get(ProfileImageServices)
    )
]

export default routes