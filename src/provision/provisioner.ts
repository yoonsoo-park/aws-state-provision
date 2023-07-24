import { Feature } from '../feature/feature';

import { authorize } from './sfdx/auth';
import { Org } from './sfdx/org';
import { deployUnmanagedMetadata } from './sfdx/deploy';
import { canAccessFile, parseFile } from '../modules/managers/fileManager';
import { RecordManager } from './sfdx/recordManager';
import { ApexExecution } from './sfdx/apexExecution';

export class Provisioner implements Feature {
	static SFDX_VERSION_REQUIRED = '7.186.2';

	private org: Org;
	private recordManager: RecordManager;
	private apexExecution: ApexExecution;
	authKey: string;
	configFilePaths: string[];

	constructor(authKey: string, configFilePaths: string[]) {
		this.org = new Org();
		this.recordManager = new RecordManager();
		this.apexExecution = new ApexExecution();
		this.authKey = authKey;
		this.configFilePaths = configFilePaths;
	}

	async launch(): Promise<void> {
		console.log('\n\tState Provisioning 🌠 Starting\n');

		const isAuthorized = await authorize(this.authKey);

		if (!isAuthorized) {
			return;
		}

		for (const configFilePath of this.configFilePaths) {
			const trimmedConfigFilePath = configFilePath.trim();
			const canAccessConfigFile = await canAccessFile(trimmedConfigFilePath);
			if (!canAccessConfigFile) {
				continue;
			}
			const config: any = await parseFile(trimmedConfigFilePath);

			if ('sfUserDef' in config.configuration) {
				await this.org.switchUser(config.configuration.sfUserDef);
			}
			if ('postInstallScripts' in config.configuration) {
				await this.apexExecution.runPostInstallScripts(
					config.configuration.postInstallScripts
				);
			}
			if ('sfMetadata' in config.configuration) {
				await deployUnmanagedMetadata(config.configuration.sfMetadata);
			}
			if ('sfRecordData' in config.configuration) {
				await this.recordManager.importUnmanagedRecordData(
					config.configuration.sfRecordData
				);
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
