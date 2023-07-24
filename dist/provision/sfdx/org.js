'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Org = void 0;
const fileManager_1 = require('../../modules/managers/fileManager');
const jsforce_1 = require('jsforce');
const child_process_1 = require('child_process');
class Org {
	async createConnection() {
		if (this.conn) {
			return this.conn;
		} else {
			const accessToken = process.env.ACCESS_TOKEN;
			const instanceUrl = process.env.INSTANCE_URL;
			this.conn = new jsforce_1.Connection({
				accessToken: accessToken,
				instanceUrl: instanceUrl,
			});
			return this.conn;
		}
	}
	async open() {
		console.log('\n📞 Opening org...');
		try {
			const open = `sfdx force:org:open`;
			(0, child_process_1.execSync)(open).toString();
			console.log('✅ Opening org successful\n');
			return true;
		} catch (error) {
			console.log(`❌ Error opening org: ${error}`);
			return false;
		}
	}
	async switchUser(sfUserDef) {
		console.log(`\n📞 Switching user execution context...`);
		try {
			const sfUserDefFile = await (0, fileManager_1.readFile)(sfUserDef.file);
			const user = JSON.parse(sfUserDefFile);
			// let's not over create users
			const userExists = await this.userExists(user.Alias);
			if (!userExists) {
				this.createUser(user.Alias, sfUserDef.file);
			}
			// set default user
			const username = await this.getUsername(user.Alias);
			this.setDefaultUser(username);
			// reset environment variables
			const orgData = await this.getOrgDataByUserName(user.username);
			this.setEnvironmentVariables(orgData);
			console.log('✅ Switching user execution context successful\n');
		} catch (error) {
			console.log(`❌ Error switching user execution context: ${error}`);
		}
	}
	async userExists(userAlias) {
		const user = await this.getUser(userAlias);
		return user.totalSize > 0;
	}
	async getUsername(userAlias) {
		const user = await this.getUser(userAlias);
		const username = user.records[0].Username;
		return username;
	}
	async getUser(userAlias) {
		const connection = await this.createConnection();
		const user = await connection.query(
			`SELECT Id, Name, Alias, Username FROM User WHERE Alias = '${userAlias}' LIMIT 1`
		);
		return user;
	}
	async createUser(userAlias, filePath) {
		const createUser = `sfdx force:user:create -a ${userAlias} -f ${filePath}`;
		(0, child_process_1.execSync)(createUser);
	}
	async setDefaultUser(username) {
		const setDefaultUsername = `sfdx config:set target-org=${username}`;
		(0, child_process_1.execSync)(setDefaultUsername);
	}
	async getOrgDataByUserName(userName) {
		try {
			const orgData = JSON.parse(
				(0, child_process_1.execSync)(
					`sfdx force:org:display -u ${userName} --json`
				).toString()
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
	async setEnvironmentVariables(orgData) {
		process.env.ACCESS_TOKEN = orgData.accessToken;
		process.env.INSTANCE_URL = orgData.instanceUrl;
		process.env.USERNAME = orgData.username;
		process.env.ORG_ALIAS = orgData.orgAlias;
	}
}
exports.Org = Org;
