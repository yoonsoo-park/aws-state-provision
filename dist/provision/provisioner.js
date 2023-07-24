"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Provisioner = void 0;
const auth_1 = require("./sfdx/auth");
const org_1 = require("./sfdx/org");
const deploy_1 = require("./sfdx/deploy");
const fileManager_1 = require("../modules/managers/fileManager");
const recordManager_1 = require("./sfdx/recordManager");
const apexExecution_1 = require("./sfdx/apexExecution");
class Provisioner {
    constructor(authKey, configFilePaths) {
        this.org = new org_1.Org();
        this.recordManager = new recordManager_1.RecordManager();
        this.apexExecution = new apexExecution_1.ApexExecution();
        this.authKey = authKey;
        this.configFilePaths = configFilePaths;
    }
    async launch() {
        console.log('\n\tState Provisioning 🌠 Starting\n');
        const isAuthorized = await (0, auth_1.authorize)(this.authKey);
        if (!isAuthorized) {
            return;
        }
        for (const configFilePath of this.configFilePaths) {
            const trimmedConfigFilePath = configFilePath.trim();
            const canAccessConfigFile = await (0, fileManager_1.canAccessFile)(trimmedConfigFilePath);
            if (!canAccessConfigFile) {
                continue;
            }
            const config = await (0, fileManager_1.parseFile)(trimmedConfigFilePath);
            if ('sfUserDef' in config.configuration) {
                await this.org.switchUser(config.configuration.sfUserDef);
            }
            if ('postInstallScripts' in config.configuration) {
                await this.apexExecution.runPostInstallScripts(config.configuration.postInstallScripts);
            }
            if ('sfMetadata' in config.configuration) {
                await (0, deploy_1.deployUnmanagedMetadata)(config.configuration.sfMetadata);
            }
            if ('sfRecordData' in config.configuration) {
                await this.recordManager.importUnmanagedRecordData(config.configuration.sfRecordData);
            }
            if ('featureManagement' in config.configuration) {
                await this.apexExecution.runFeatureToggles(config.configuration.featureManagement);
            }
            if ('sfSeedData' in config.configuration) {
                await this.recordManager.importUnmanagedSeedData(config.configuration.sfSeedData);
            }
        }
        console.log('\tState Provisioning 🌠 Complete\n');
    }
}
exports.Provisioner = Provisioner;
Provisioner.SFDX_VERSION_REQUIRED = '7.186.2';
