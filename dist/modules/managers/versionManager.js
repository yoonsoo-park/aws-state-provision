"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVersion = exports.getInstalledVersion = exports.isValidVersionCheck = exports.sfdxVersionCheck = void 0;
const semver_1 = require("semver");
const child_process_1 = require("child_process");
async function sfdxVersionCheck(versionRequired) {
    console.log(`🔬 Checking installed sfdx version...`);
    let isValid = false;
    let checkAttempts = 0;
    do {
        isValid = await isValidVersionCheck('>=' + versionRequired, 'sfdx --version', /sfdx-cli\/(\d+\.\d+\.\d+)/i);
        checkAttempts++;
        if (!isValid) {
            const sfdxInstallCommand = 'npm i -g sfdx-cli@<minVersion>'.replace('<minVersion>', versionRequired);
            console.log(`   Updating installed sfdx version to minimum required version...`);
            updateVersion('npm uninstall -g sfdx-cli', sfdxInstallCommand);
        }
    } while (!isValid && checkAttempts < 3);
    if (!isValid) {
        console.log(`❌ Error checking installed sfdx version\n`);
        return isValid;
    }
    console.log(`✅ Checking installed sfdx version successful\n`);
    return isValid;
}
exports.sfdxVersionCheck = sfdxVersionCheck;
async function isValidVersionCheck(versionRequired, versionCommand, versionRegex) {
    const installedVersion = await getInstalledVersion(versionCommand, versionRegex);
    console.log(`   Installed version: ${installedVersion}`);
    console.log(`   Required version: ${versionRequired}`);
    return (0, semver_1.satisfies)(installedVersion, versionRequired);
}
exports.isValidVersionCheck = isValidVersionCheck;
async function getInstalledVersion(versionCommand, versionRegex) {
    let installedVersion = 'SFDX is not installed.';
    try {
        const stdout = (0, child_process_1.execSync)(versionCommand).toString();
        const match = versionRegex.exec(stdout);
        if (match && match.length > 1) {
            installedVersion = match[1];
        }
    }
    catch (error) {
        return installedVersion; // sfdx is not installed: catch, continue and install required version
    }
    return installedVersion;
}
exports.getInstalledVersion = getInstalledVersion;
async function updateVersion(uninstallCommand, installCommand) {
    (0, child_process_1.execSync)(uninstallCommand);
    (0, child_process_1.execSync)(installCommand);
}
exports.updateVersion = updateVersion;
