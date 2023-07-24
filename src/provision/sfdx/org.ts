import { readFile } from '../../modules/managers/fileManager';
import { Connection } from 'jsforce';
import { execSync } from 'child_process';

export class Org {
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

	async open(): Promise<boolean> {
		console.log('\n📞 Opening org...');
		try {
			const open = `sfdx force:org:open`;
			execSync(open).toString();
			console.log('✅ Opening org successful\n');
			return true;
		} catch (error) {
			console.log(`❌ Error opening org: ${error}`);
			return false;
		}
	}

	async switchUser(sfUserDef: Record<string, any>): Promise<void> {
		console.log(`\n📞 Switching user execution context...`);
		try {
			const sfUserDefFile = await readFile(sfUserDef.file);
			const user = JSON.parse(sfUserDefFile);

			// let's not over create users
			const userExists = await this.userExists(user.Alias);

			if (!userExists) {
				console.log(`   Creating user ${user.Alias}...`);
				this.createUser(user.Alias, sfUserDef.file);
			}

			// set default user
			const username = await this.getUsername(user.Alias);
			this.setDefaultUser(username);

			// reset environment variables
			// todo yopa - need to find user name.  this is not it
			const orgData = await this.getOrgDataByUserName(user.Alias);
			this.setEnvironmentVariables(orgData);

			console.log('✅ Switching user execution context successful\n');
		} catch (error) {
			console.log(`❌ Error switching user execution context: ${error}`);
		}
	}

	async userExists(userAlias: string): Promise<boolean> {
		const user = await this.getUser(userAlias);
		return user && user.totalSize > 0;
	}

	async getUsername(userAlias: string): Promise<string> {
		const user = await this.getUser(userAlias);
		const username = user.records[0].Username;
		return username;
	}

	async getUser(userAlias: string): Promise<any> {
		const connection = await this.createConnection();
		const user = await connection.query(
			`SELECT Id, Name, Alias, Username FROM User WHERE Alias = '${userAlias}' LIMIT 1`
		);
		return user;
	}

	async createUser(userAlias: string, filePath: string): Promise<void> {
		const createUser = `sfdx force:user:create -a ${userAlias} -f ${filePath}`;
		execSync(createUser);
	}

	async setDefaultUser(username: string): Promise<void> {
		const setDefaultUsername = `sfdx config:set target-org=${username}`;
		execSync(setDefaultUsername);
	}

	async getOrgDataByUserName(userName: string): Promise<any> {
		try {
			const orgData = JSON.parse(
				execSync(`sfdx force:org:display -u ${userName} --json`).toString()
			).result;

			const accessToken = orgData.accessToken;
			const instanceUrl = orgData.instanceUrl;
			const username = orgData.username;
			const orgAlias = orgData.alias;

			if (!accessToken || !instanceUrl || !username || !orgAlias) {
				return null;
			}

			return {
				accessToken,
				instanceUrl,
				username,
				orgAlias,
			};
		} catch (error) {
			console.log(error);
			return null;
		}
	}

	async setEnvironmentVariables(orgData: Record<string, any>): Promise<void> {
		process.env.ACCESS_TOKEN = orgData.accessToken;
		process.env.INSTANCE_URL = orgData.instanceUrl;
		process.env.USERNAME = orgData.username;
		process.env.ORG_ALIAS = orgData.orgAlias;
	}
}
