import * as http from "node:http";
import * as https from "node:https";
import { URL } from "node:url";
import { ConfigModel } from "../model/config-model";

class LoginService {

    public async login(config: ConfigModel, pin: string): Promise<string> {
        if (!config || !config.apgAuthUrl) {
            throw new Error("apgAuthUrl no está definido en la configuración");
        }
        if (!config.apgUrl) {
            throw new Error("apgUrl no está definido en la configuración");
        }
        if (!pin) {
            throw new Error("pin es requerido para el login");
        }
        console.log("Login: calling " + config.apgAuthUrl);
        try {
            const authResponse = await this.httpPostPromise(
                config.apgAuthUrl,
                {
                    "Authorization": "Basic " + (config.apgAuthData ?? ""),
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Content-Length": 0
                }
            );
            console.log("Login: apgAuthUrl response received");

            const accessToken = this.extractAccessToken(authResponse);
            if (!accessToken) {
                throw new Error("No se recibió access_token en la respuesta de apgAuthUrl");
            }

            const loginClientAppUrl = config.apgUrl + "/auth/authenticate/login-client-app";
            console.log("Login: calling " + loginClientAppUrl);
            const body = JSON.stringify({
                terminalData: Buffer.from(JSON.stringify({
                    companyId: config.companyId,
                    terminalId: config.terminalId
                })).toString('base64'),
                pin: pin,
                clientDeviceId: config.clientDeviceId,
                app: "EXPRESS"
            });
            const clientAppResponse = await this.httpPostPromise(
                loginClientAppUrl,
                {
                    "Authorization": "Bearer " + accessToken,
                    "Content-Type": "application/json",
                    "Content-Length": Buffer.byteLength(body)
                },
                body
            );
            console.log("Login: login-client-app response received");
            return clientAppResponse;
        } catch (error) {
            console.error("Login: error during login flow:", error);
            throw error;
        }
    }

    private extractAccessToken(response: string): string | null {
        try {
            const parsed = JSON.parse(response);
            return parsed?.access_token ?? null;
        } catch (err) {
            console.error("Login: cannot parse auth response as JSON:", err);
            return null;
        }
    }

    private httpPostPromise(urlString: string, headers: http.OutgoingHttpHeaders, body?: string): Promise<string> {
        return new Promise((resolve, reject) => {
            let parsedUrl: URL;
            try {
                parsedUrl = new URL(urlString);
            } catch (err) {
                return reject(new Error(`URL inválida: ${urlString}`));
            }

            const lib = parsedUrl.protocol === "https:" ? https : http;
            const options: http.RequestOptions = {
                method: "POST",
                hostname: parsedUrl.hostname,
                port: parsedUrl.port || (parsedUrl.protocol === "https:" ? 443 : 80),
                path: parsedUrl.pathname + parsedUrl.search,
                headers: headers
            };

            const req = lib.request(options, (response) => {
                let data = "";
                response.on("data", (chunk) => {
                    data += chunk;
                });
                response.on("end", () => {
                    const status = response.statusCode ?? 0;
                    if (status >= 200 && status < 300) {
                        resolve(data);
                    } else {
                        reject(new Error(`Request to ${urlString} failed with status code ${status}: ${data}`));
                    }
                });
                response.on("error", (err) => {
                    reject(err);
                });
            });

            req.on("error", (err) => {
                reject(err);
            });

            if (body) {
                req.write(body);
            }
            req.end();
        });
    }
}

export { LoginService };
