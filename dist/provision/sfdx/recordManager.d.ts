import { Connection } from 'jsforce';
interface RecordDefinition {
    externalId?: string;
    csvFilePath: string;
}
export declare class RecordManager {
    private conn;
    createConnection(): Promise<Connection>;
    importUnmanagedRecordData(recordDefinitions: Array<RecordDefinition>): Promise<void>;
    importUnmanagedSeedData(recordDefinitions: Array<RecordDefinition>): Promise<void>;
    handleRecordCreation(recordDefinitions: Array<RecordDefinition>): Promise<void>;
    upsertBulkRecords(objectName: string, csvData: string, externalId?: string): Promise<void>;
    checkSObjectExists(sObjectName: string): Promise<boolean>;
}
export {};
