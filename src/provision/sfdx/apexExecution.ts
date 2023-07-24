import { readDirectory, readFile } from '../../modules/managers/fileManager';
import { Connection } from 'jsforce';

export class ApexExecution {
	private conn: Connection | undefined;

	async createConnection(): Promise<Connection> {
		if (this.conn) {
			return this.conn;
		} else {
			const accessToken = process.env.ACCESS_TOKEN;
			const instanceUrl = process.env.INSTANCE_URL;

			this.conn = new Connection({
				accessToken: accessToken,
				instanceUrl: instanceUrl,
			});
			return this.conn;
		}
	}

	async runPostInstallScripts(postInstallScripts: string[]): Promise<void> {
		try {
			if (!postInstallScripts || postInstallScripts.length === 0) {
				return;
			}
			const postInstallScriptsList = Array.isArray(postInstallScripts)
				? postInstallScripts
				: [postInstallScripts];

			console.log(`\n📞 Invoking post install scripts...`);
			for (const postInstallScriptsPath of postInstallScriptsList) {
				const scripts = await readDirectory(postInstallScriptsPath);
				if (scripts.length === 0) {
					continue;
				}
				console.log(`   Invoking post install scripts: ${postInstallScriptsPath}`);
				for (const script of scripts) {
					const code = await readFile(postInstallScriptsPath + script);

					console.log(`🔫 Invoking post install script: ${script}`);

					await this.executeAnonymousApex(code);
				}
			}
			console.log('✅ Invoking post install scripts successful\n');
		} catch (error) {
			console.log(`❌ Error invoking post install scripts: ${error}`);
			return;
		}
	}

	async runFeatureToggles(featureToggles: Record<string, any>): Promise<void> {
		try {
			if (!featureToggles) {
				throw new Error('Feature Toggles are not provided.');
			}

			const apexCode = this.generateApexCode(featureToggles);

			console.log('\n📞 Toggling Feature Management flags...');
			await this.executeAnonymousApex(apexCode);
			console.log('✅ Toggling Feature Management flags successful\n');
		} catch (error) {
			console.error(`❌ Error toggling Feature Management flags: ${error}`);
		}
	}

	private generateApexCode(featureToggles: Record<string, any>): string {
		const replacement = JSON.stringify(featureToggles).replace(/"/g, '\\"');
		console.log(`   Toggling Feature Management flags: ${replacement}`);
		const codeTemplate = `
		String jsonPayload = '{{JSON_PAYLOAD}}';
		new FeatureFlagApi().processToggleConfigurations(jsonPayload);
	`;
		const code = codeTemplate.replace('{{JSON_PAYLOAD}}', replacement);
		console.log(`   Toggling Feature Management flags: ${code}`);
		return codeTemplate.replace('{{JSON_PAYLOAD}}', replacement);
	}

	private async executeAnonymousApex(code: string): Promise<void> {
		const connection = await this.createConnection();
		await connection.tooling.executeAnonymous(code);
	}
}
