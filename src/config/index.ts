import config from './config';

class Config {
    private static configInstance:Config;
    private config;

    private constructor() {
        this.config = config
    }

    static CreateInstance() {
        if(!this.configInstance){
            this.configInstance = new Config();
        }

        return Config.configInstance
    }

    getConfig() {
        return this.config
    }
}

const instance = Config.CreateInstance()

export default instance.getConfig();