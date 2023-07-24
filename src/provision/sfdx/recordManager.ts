import { canAccessFile, readFile } from '../../modules/managers/fileManager';
import { Connection } from 'jsforce';

interface RecordDefinition {
	externalId?: string;
	csvFilePath: string;
}

export class RecordManager {
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

	async importUnmanagedRecordData(recordDefinitions: Array<RecordDefinition>): Promise<void> {
		if (!Array.isArray(recordDefinitions) || recordDefinitions.length === 0) {
			return;
		}
		console.log(`\n📞 Importing unmanaged record-based configuration...`);
		await this.handleRecordCreation(recordDefinitions);
		console.log('✅ Importing unmanaged record-based configuration successful\n');
	}

	async importUnmanagedSeedData(recordDefinitions: Array<RecordDefinition>): Promise<void> {
		if (!Array.isArray(recordDefinitions) || recordDefinitions.length === 0) {
			return;
		}
		console.log(`\n📞 Importing unmanaged scenario-driven seed data...`);
		await this.handleRecordCreation(recordDefinitions);
		console.log('✅ Importing unmanaged scenario-driven seed data successful\n');
	}

	async handleRecordCreation(recordDefinitions: Array<RecordDefinition>): Promise<void> {
		for (const definitionObj of recordDefinitions) {
			const csvFile = definitionObj.csvFilePath;
			console.log(`   Checking if ${definitionObj.csvFilePath} exists...`);
			const definitionObjExists = await canAccessFile(definitionObj.csvFilePath);

			if (!definitionObjExists) {
				console.log(`❌ Error: CSV file ${definitionObj.csvFilePath} does not exist.`);
				continue;
			}
			console.log(`   ${definitionObj.csvFilePath} found!`);

			const sobjectName = csvFile.split('/').pop()?.split('.')[0];
			console.log(`   Checking if ${sobjectName} exists...`);
			const sObjectExists = await this.checkSObjectExists(`${sobjectName}`);

			if (!sObjectExists) {
				console.log(`❌ Error: ${sobjectName} does not exist.`);
				continue;
			}
			console.log(`   ${sobjectName} found!`);

			console.log(`🔫 Upserting records from ${csvFile}`);
			const csvFileContents = await readFile(csvFile);
			await this.upsertBulkRecords(
				`${sobjectName}`,
				csvFileContents,
				definitionObj.externalId
			);
		}
	}

	async upsertBulkRecords(
		objectName: string,
		csvData: string,
		externalId?: string
	): Promise<void> {
		try {
			const connection = await this.createConnection();
			connection.bulk.pollInterval = 5000; // 5 sec
			connection.bulk.pollTimeout = 60000; // 60 sec
			const result = await connection.sobject(objectName).upsertBulk(csvData, externalId);

			result.forEach((ret) => {
				if (ret.success) {
					console.log(`   Created record id (bulk upsert): ${ret.id}`);
				} else {
					console.error(`❌ Error creating bulk records: ${ret.errors.join(',')}`);
				}
			});
		} catch (error: any) {
			console.error(`❌ An error occurred while performing bulk upsert: ${error.message}`);
		}
	}

	async checkSObjectExists(sObjectName: string): Promise<boolean> {
		try {
			// Check if the sObject is defined in the org
			const connection = await this.createConnection();
			await connection.describe(sObjectName);
			return true;
		} catch (error: any) {
			console.log(`❌ Error describing sObject ${sObjectName}: ${error.message}`);
			return false;
		}
	}
}
