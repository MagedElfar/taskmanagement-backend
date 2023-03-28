import { config } from "dotenv";
import { truncate } from "fs";
import path from "path"

config({
  path: path.join(path.dirname(__dirname), "..", ".env")
})

const conf = {
  port: parseInt(process.env.PORT!),

  mediaPath: path.join(path.dirname(__dirname), "..", "public", "media"),

  clientUrl: process.env.Client_URL,

  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  },

  jwt: {
    secret: process.env.TOKEN_SECRET,
    accessTokenExpire: process.env.Access_Token_Expire,
    refreshTokenExpire: process.env.Refresh_Token_Expire
  },

  cookie: {
    secret: process.env.COOKIE_SECRET,
    option: {
      httpOnly: true,
      secure: true,
      signed: true,
      maxAge: eval(process.env.COOKIE_MAX_AGE!) * 1000,
      sameSite: "none" as const,
    }
  },

  google: {
    user: process.env.GOOGLE_USER,
    password: process.env.GOOGLE_PASSWORD,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN
  },

  cloud: {
    apiKey: process.env.CLOUD_API_KEY,
    apiSecret: process.env.CLOUD_API_SECRET,
    cloudName: process.env.CLOUD_NAME
  }
};

Object.freeze(conf);

export default conf;