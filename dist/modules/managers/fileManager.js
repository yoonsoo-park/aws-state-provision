"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFiles = exports.replacePlaceholders = exports.copyFile = exports.readFile = exports.parseFile = exports.canAccessFile = exports.removeDirectory = exports.createDirectory = exports.readDirectory = void 0;
const tslib_1 = require("tslib");
const fs = (0, tslib_1.__importStar)(require("fs-extra"));
const path = (0, tslib_1.__importStar)(require("path"));
async function readDirectory(dir) {
    let content;
    try {
        content = fs.readdirSync(dir);
    }
    catch (error) {
        console.log(`❌ Error reading directory: ${error}`);
    }
    return content;
}
exports.readDirectory = readDirectory;
async function createDirectory(dir) {
    removeDirectory(dir);
    try {
        fs.mkdir(dir);
    }
    catch (error) {
        console.log(`❌ Error creating directory: ${error}`);
    }
}
exports.createDirectory = createDirectory;
async function removeDirectory(dir) {
    try {
        if (fs.existsSync(dir)) {
            fs.removeSync(dir);
        }
    }
    catch (error) {
        console.log(`❌ Error removing directory: ${error}`);
    }
}
exports.removeDirectory = removeDirectory;
async function canAccessFile(filePath) {
    try {
        fs.accessSync(filePath);
        return true;
    }
    catch (error) {
        console.log(`❌ Error locating file ${error}`);
        return false;
    }
}
exports.canAccessFile = canAccessFile;
async function parseFile(filePath) {
    let json;
    try {
        json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    catch (error) {
        console.log(`❌ Error parsing file: ${error}`);
    }
    return json;
}
exports.parseFile = parseFile;
async function readFile(filePath) {
    let content;
    try {
        content = fs.readFileSync(filePath, 'utf8');
    }
    catch (error) {
        console.log(`❌ Error parsing file: ${error}`);
    }
    return content;
}
exports.readFile = readFile;
async function copyFile(sourcePath, destinationPath) {
    try {
        fs.copyFileSync(sourcePath, destinationPath);
    }
    catch (error) {
        console.log(`❌ Error copying file: ${error}`);
    }
}
exports.copyFile = copyFile;
async function replacePlaceholders(filePath, placeholder, replacement) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const updatedFileContent = fileContent.replace(placeholder, replacement);
    try {
        fs.writeFileSync(filePath, updatedFileContent);
    }
    catch (error) {
        console.log(`❌ Error replacing placeholders: ${error}`);
    }
}
exports.replacePlaceholders = replacePlaceholders;
function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);
    files.forEach(function (file) {
        if (fs.statSync(dirPath + '/' + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
        }
        else {
            arrayOfFiles.push(path.join(dirPath, '/', file));
        }
    });
    return arrayOfFiles;
}
exports.getAllFiles = getAllFiles;
