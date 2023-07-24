export declare function readDirectory(dir: string): Promise<string[]>;
export declare function createDirectory(dir: string): Promise<void>;
export declare function removeDirectory(dir: string): Promise<void>;
export declare function canAccessFile(filePath: string): Promise<boolean>;
export declare function parseFile(filePath: string): Promise<JSON>;
export declare function readFile(filePath: string): Promise<string>;
export declare function copyFile(sourcePath: string, destinationPath: string): Promise<void>;
export declare function replacePlaceholders(filePath: string, placeholder: string, replacement: string): Promise<void>;
export declare function getAllFiles(dirPath: string, arrayOfFiles?: string[]): string[];
