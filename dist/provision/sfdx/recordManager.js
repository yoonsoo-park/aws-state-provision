"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordManager = void 0;
const fileManager_1 = require("../../modules/managers/fileManager");
const jsforce_1 = require("jsforce");
class RecordManager {
    async createConnection() {
        if (this.conn) {
            return this.conn;
        }
        else {
            const accessToken = process.env.ACCESS_TOKEN;
            const instanceUrl = process.env.INSTANCE_URL;
            this.conn = new jsforce_1.Connection({
                accessToken: accessToken,
                instanceUrl: instanceUrl,
            });
            return this.conn;
        }
    }
    async importUnmanagedRecordData(recordDefinitions) {
        if (!Array.isArray(recordDefinitions) || recordDefinitions.length === 0) {
            return;
        }
        console.log(`\n📞 Importing unmanaged record-based configuration...`);
        await this.handleRecordCreation(recordDefinitions);
        console.log('✅ Importing unmanaged record-based configuration successful\n');
    }
    async importUnmanagedSeedData(recordDefinitions) {
        if (!Array.isArray(recordDefinitions) || recordDefinitions.length === 0) {
            return;
        }
        console.log(`\n📞 Importing unmanaged scenario-driven seed data...`);
        await this.handleRecordCreation(recordDefinitions);
        console.log('✅ Importing unmanaged scenario-driven seed data successful\n');
    }
    async handleRecordCreation(recordDefinitions) {
        var _a;
        for (const definitionObj of recordDefinitions) {
            const csvFile = definitionObj.csvFilePath;
            console.log(`   Checking if ${definitionObj.csvFilePath} exists...`);
            const definitionObjExists = await (0, fileManager_1.canAccessFile)(definitionObj.csvFilePath);
            if (!definitionObjExists) {
                console.log(`❌ Error: CSV file ${definitionObj.csvFilePath} does not exist.`);
                continue;
            }
            console.log(`   ${definitionObj.csvFilePath} found!`);
            const sobjectName = (_a = csvFile.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('.')[0];
            console.log(`   Checking if ${sobjectName} exists...`);
            const sObjectExists = await this.checkSObjectExists(`${sobjectName}`);
            if (!sObjectExists) {
                console.log(`❌ Error: ${sobjectName} does not exist.`);
                continue;
            }
            console.log(`   ${sobjectName} found!`);
            console.log(`🔫 Upserting records from ${csvFile}`);
            const csvFileContents = await (0, fileManager_1.readFile)(csvFile);
            await this.upsertBulkRecords(`${sobjectName}`, csvFileContents, definitionObj.externalId);
        }
    }
    async upsertBulkRecords(objectName, csvData, externalId) {
        try {
            const connection = await this.createConnection();
            connection.bulk.pollInterval = 5000; // 5 sec
            connection.bulk.pollTimeout = 60000; // 60 sec
            const result = await connection.sobject(objectName).upsertBulk(csvData, externalId);
            result.forEach((ret) => {
                if (ret.success) {
                    console.log(`   Created record id (bulk upsert): ${ret.id}`);
                }
                else {
                    console.error(`❌ Error creating bulk records: ${ret.errors.join(',')}`);
                }
            });
        }
        catch (error) {
            console.error(`❌ An error occurred while performing bulk upsert: ${error.message}`);
        }
    }
    async checkSObjectExists(sObjectName) {
        try {
            // Check if the sObject is defined in the org
            const connection = await this.createConnection();
            await connection.describe(sObjectName);
            return true;
        }
        catch (error) {
            console.log(`❌ Error describing sObject ${sObjectName}: ${error.message}`);
            return false;
        }
    }
}
exports.RecordManager = RecordManager;
