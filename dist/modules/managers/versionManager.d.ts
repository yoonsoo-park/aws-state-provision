export declare function sfdxVersionCheck(versionRequired: string): Promise<boolean>;
export declare function isValidVersionCheck(versionRequired: string, versionCommand: string, versionRegex: RegExp): Promise<boolean>;
export declare function getInstalledVersion(versionCommand: string, versionRegex: RegExp): Promise<string>;
export declare function updateVersion(uninstallCommand: string, installCommand: string): Promise<void>;
