import { sign, verify } from "jsonwebtoken";
import config from "../config";
import { setError } from '../utils/error-format';
import { autoInjectable, container } from "tsyringe";

export interface IJwtServices {
    newTokenSign(data: any, expiresIn: string): string;
    authTokens(data: any): { accessToken: string, refreshToken: string };
    verifyToken(token: string, code: number): any
}

@autoInjectable()
export class JwtServices implements IJwtServices {
    newTokenSign(data: any, expiresIn: string) {
        return sign(data, config.jwt.secret!, {
            expiresIn
        })
    }

    authTokens(data: any) {
        const accessToken = sign(data, config.jwt.secret!, {
            expiresIn: config.jwt.accessTokenExpire
        })

        const refreshToken = sign(data, config.jwt.secret!, {
            expiresIn: config.jwt.refreshTokenExpire
        })

        return {
            accessToken,
            refreshToken
        }
    }

    verifyToken(token: string, code: number): any {

        try {
            let error: any = null;
            let data: any;

            verify(token, config.jwt.secret!, async (err, decodedData: any) => {
                if (err) {
                    error = err;
                    return;
                }
                data = decodedData
            });

            console.log(error)
            if (error) throw (setError(code, "Invalid or ExpireToken"));

            return data
        } catch (error) {
            throw error
        }
    }
}

container.register("IJwtServices", { useClass: JwtServices });
const jwtServices = container.resolve(JwtServices);

export default jwtServices;