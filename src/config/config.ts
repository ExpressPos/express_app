import path from "path";
import fs from "fs";
import {app} from "electron";
import {ConfigModel} from "../model/config-model";
import {ServerConfigModel} from "../model/server-config-model";
import {Utils} from "./utils";
import * as http from "node:http";
import * as https from "node:https";

class Config {
    private _config: ConfigModel|null;
    private _serverConfig: ServerConfigModel|null;
    private utils: Utils;

    constructor(utils: Utils) {
        this.utils = utils;
        this._serverConfig = null;
        this._config = this.getAppConfigFromFile();
    }

    get config(): ConfigModel|null {
        return this._config;
    }

    get serverConfig(): ServerConfigModel|null {
        return this._serverConfig;
    }

    public saveConfig(): void {
        console.log("Saving local config");
        const procDir = app.getPath('userData');
        const filePath = path.resolve(procDir, 'config.json');
        fs.writeFileSync(filePath, JSON.stringify(this._config));
    }

    public setConfig(configJson : string) {
        console.log("Setting local config");
        const data = JSON.parse(configJson);
        const configModel: ConfigModel = {
            url: data.url,
            invertDisplay: false,
            clientDeviceId: data.clientDeviceId,
            companyId: data.companyId,
            terminalId: data.terminalId,
            apgUrl: data.apgUrl,
            apgAuthUrl: data.apgAuthUrl,
            apgAuthData: data.apgAuthData
        };
        configModel.clientDeviceId = this.utils.getUUID();
        this._config = configModel;
        this.saveConfig();
    }

    public getAppConfigFromFile(): ConfigModel|null {
        try {
            const procDir = app.getPath('userData');
            const filePath = path.resolve(procDir, 'config.json');
            const data = fs.readFileSync(filePath, 'utf8');
            const configJson = data.trim();
            return JSON.parse(configJson);
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.error("Config file does not exist");
            } else {
                console.error("Error reading config file: ", error);
            }
            //return this.defaultConfig(utils);
            return null;
        }
    }

    public async getServerConfig(): Promise<void> {
        try {
            console.log('Fetching server config...');
            if (this.config != null) {
                const response = await this.httpGetPromise(this.config.url + "/auth/application/web-application");
                console.log('Server config: ' + response);
                this._serverConfig = JSON.parse(response);
            } else {
                throw Error("Local config is null");
            }
        } catch (error) {
            console.error('Error fetching server config:', JSON.stringify(error));
            throw error;
        }
    }

    private httpGetPromise(url: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const lib = url.startsWith('https') ? https : http;
            lib.get(url, (response) => {
                let data = '';

                // Acumula los datos recibidos
                response.on('data', (chunk) => {
                    data += chunk;
                });

                // Una vez que se completa la respuesta
                response.on('end', () => {
                    if (response.statusCode === 200) {
                        resolve(data);
                    } else {
                        reject(new Error(`Request failed with status code ${response.statusCode}`));
                    }
                });

                // Maneja errores
                response.on('error', (err) => {
                    reject(err);
                });
            }).on('error', (err) => {
                reject(err);
            });
        });
    }
}

export {Config};
