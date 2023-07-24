import { Feature } from '../feature/feature';
export declare class Provisioner implements Feature {
    static SFDX_VERSION_REQUIRED: string;
    private org;
    private recordManager;
    private apexExecution;
    authKey: string;
    configFilePaths: string[];
    constructor(authKey: string, configFilePaths: string[]);
    launch(): Promise<void>;
}
