import { Connection } from 'jsforce';
export declare class Org {
    private conn;
    createConnection(): Promise<Connection>;
    open(): Promise<boolean>;
    switchUser(sfUserDef: Record<string, any>): Promise<void>;
    userExists(userAlias: string): Promise<boolean>;
    getUsername(userAlias: string): Promise<string>;
    getUser(userAlias: string): Promise<any>;
    createUser(userAlias: string, filePath: string): Promise<void>;
    setDefaultUser(username: string): Promise<void>;
    getOrgDataByUserName(userName: string): Promise<any>;
    setEnvironmentVariables(orgData: Record<string, any>): Promise<void>;
}
