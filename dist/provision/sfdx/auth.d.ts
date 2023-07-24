export interface OrgDetails {
    accessToken: string;
    instanceUrl: string;
    username: string;
    orgAlias?: string;
    authUrl?: string;
}
/**
 * The following process steps are handled by authorizing a farmed org
 * 1. Org creation
 * 2. Install Feature's dependency 1GP packages
 * 3. Deploy Feature's package metadata
 * 4. Deploy Feature’s dependency features/modules package metadata
 * @return: {boolean} - Returns true if the org is authorized, false if the org is not authorized
 */
export declare function authorize(auth: string): Promise<boolean>;
export declare function getOrgData(): Promise<OrgDetails | undefined>;
export declare function setEnvironmentVariables(orgData: Record<string, any>): Promise<void>;
