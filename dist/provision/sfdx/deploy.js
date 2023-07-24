"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployMetadata = exports.deployUnmanagedMetadata = void 0;
const source_deploy_retrieve_1 = require("@salesforce/source-deploy-retrieve");
async function deployUnmanagedMetadata(sfMetadata) {
    try {
        if (!sfMetadata || sfMetadata.length === 0) {
            return;
        }
        console.log(`\n📞 Deploying unmanaged metadata configuration...`);
        const metadataList = Array.isArray(sfMetadata) ? sfMetadata : [sfMetadata];
        for (const metadata of metadataList) {
            console.log(`🔫 Deploying unmanaged metadata: ${metadata}`);
            await deployMetadata(metadata);
        }
        console.log('✅ Deploying unmanaged metadata configuration successful\n');
    }
    catch (error) {
        console.log(`❌ Error deploying unmanaged metadata configuration: ${error}`);
        return;
    }
}
exports.deployUnmanagedMetadata = deployUnmanagedMetadata;
async function deployMetadata(metadata) {
    const username = process.env.USERNAME;
    const deploy = await source_deploy_retrieve_1.ComponentSet.fromSource(metadata).deploy({
        usernameOrConnection: `${username}`,
    });
    // Attach a listener to check the deploy status on each poll
    deploy.onUpdate(() => {
        // waiting for deploy to finish
    });
    // Wait for polling to finish and get the DeployResult object
    const result = await deploy.pollStatus();
    // Output each file along with its state change of the deployment
    console.log(result.getFileResponses());
}
exports.deployMetadata = deployMetadata;
