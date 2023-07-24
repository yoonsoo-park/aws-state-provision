"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEnvironmentVariables = exports.getOrgData = exports.authorize = void 0;
const child_process_1 = require("child_process");
/**
 * The following process steps are handled by authorizing a farmed org
 * 1. Org creation
 * 2. Install Feature's dependency 1GP packages
 * 3. Deploy Feature's package metadata
 * 4. Deploy Feature’s dependency features/modules package metadata
 * @return: {boolean} - Returns true if the org is authorized, false if the org is not authorized
 */
async function authorize(auth) {
    let isAuthorized = false;
    console.log('\n📞 Authorizing org...');
    try {
        // Authorize to a farmed org with the sfdxAuthUrl
        (0, child_process_1.execSync)(auth);
        // Get the org data for the org the current session is authorized to
        const orgData = await getOrgData();
        if (!orgData) {
            throw new Error('Unable to get org data for the current session. Check the auth key provided and try again.');
        }
        // Check if the current session is authorized to the farmed org provided in the auth command
        if (orgData.orgAlias && !auth.includes(orgData.orgAlias)) {
            throw new Error(`Currently authorized org alias ${orgData.orgAlias} does not match the alias provided in the auth command.`);
        }
        // Set the environment variables for the validated current session authorized org for future use
        setEnvironmentVariables(orgData);
        isAuthorized = true;
        console.log(`✅ Authorizing org successful\n`);
    }
    catch (error) {
        console.log(`❌ Error authorizing org: ${error}`);
    }
    return isAuthorized;
}
exports.authorize = authorize;
async function getOrgData() {
    try {
        const orgDetails = JSON.parse((0, child_process_1.execSync)('sfdx force:org:display --json').toString()).result;
        const accessToken = orgDetails.accessToken;
        const instanceUrl = orgDetails.instanceUrl;
        const username = orgDetails.username;
        const orgAlias = orgDetails.alias;
        if (!accessToken || !instanceUrl || !username || !orgAlias) {
            return undefined;
        }
        return {
            accessToken,
            instanceUrl,
            username,
            orgAlias,
        };
    }
    catch (error) {
        console.log(error);
        return undefined;
    }
}
exports.getOrgData = getOrgData;
async function setEnvironmentVariables(orgData) {
    process.env.ACCESS_TOKEN = orgData.accessToken;
    process.env.INSTANCE_URL = orgData.instanceUrl;
    process.env.USERNAME = orgData.username;
    process.env.ORG_ALIAS = orgData.orgAlias;
}
exports.setEnvironmentVariables = setEnvironmentVariables;
