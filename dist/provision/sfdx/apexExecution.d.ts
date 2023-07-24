import { Connection } from 'jsforce';
export declare class ApexExecution {
    private conn;
    createConnection(): Promise<Connection>;
    runPostInstallScripts(postInstallScripts: string[]): Promise<void>;
    runFeatureToggles(featureToggles: Record<string, any>): Promise<void>;
    private generateApexCode;
    private executeAnonymousApex;
}
