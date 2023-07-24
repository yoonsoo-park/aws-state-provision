import * as fs from 'fs-extra';
import * as path from 'path';

export async function readDirectory(dir: string): Promise<string[]> {
	let content: any;
	try {
		content = fs.readdirSync(dir);
	} catch (error) {
		console.log(`❌ Error reading directory: ${error}`);
	}
	return content;
}

export async function createDirectory(dir: string): Promise<void> {
	removeDirectory(dir);
	try {
		fs.mkdir(dir);
	} catch (error) {
		console.log(`❌ Error creating directory: ${error}`);
	}
}

export async function removeDirectory(dir: string): Promise<void> {
	try {
		if (fs.existsSync(dir)) {
			fs.removeSync(dir);
		}
	} catch (error) {
		console.log(`❌ Error removing directory: ${error}`);
	}
}

export async function canAccessFile(filePath: string): Promise<boolean> {
	try {
		fs.accessSync(filePath);
		return true;
	} catch (error) {
		console.log(`❌ Error locating file ${error}`);
		return false;
	}
}

export async function parseFile(filePath: string): Promise<JSON> {
	let json: any;
	try {
		json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
	} catch (error) {
		console.log(`❌ Error parsing file: ${error}`);
	}
	return json;
}

export async function readFile(filePath: string): Promise<string> {
	let content: any;
	try {
		content = fs.readFileSync(filePath, 'utf8');
	} catch (error) {
		console.log(`❌ Error parsing file: ${error}`);
	}
	return content;
}

export async function copyFile(sourcePath: string, destinationPath: string): Promise<void> {
	try {
		fs.copyFileSync(sourcePath, destinationPath);
	} catch (error) {
		console.log(`❌ Error copying file: ${error}`);
	}
}

export async function replacePlaceholders(
	filePath: string,
	placeholder: string,
	replacement: string
): Promise<void> {
	const fileContent = fs.readFileSync(filePath, 'utf8');
	const updatedFileContent = fileContent.replace(placeholder, replacement);

	try {
		fs.writeFileSync(filePath, updatedFileContent);
	} catch (error) {
		console.log(`❌ Error replacing placeholders: ${error}`);
	}
}

export function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
	const files = fs.readdirSync(dirPath);

	files.forEach(function (file) {
		if (fs.statSync(dirPath + '/' + file).isDirectory()) {
			arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
		} else {
			arrayOfFiles.push(path.join(dirPath, '/', file));
		}
	});

	return arrayOfFiles;
}
