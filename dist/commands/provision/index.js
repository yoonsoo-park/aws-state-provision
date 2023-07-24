"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const featureLauncher_1 = require("../../feature/featureLauncher");
const provisioner_1 = require("../../provision/provisioner");
class Provision extends core_1.Command {
    async run() {
        const { flags } = await this.parse(Provision);
        const authKey = flags.authKey;
        const configFilePaths = flags.configFilePath.split(',');
        const provisionLauncher = new featureLauncher_1.FeatureLauncher(new provisioner_1.Provisioner(authKey, configFilePaths));
        provisionLauncher.launch();
    }
}
exports.default = Provision;
Provision.description = 'Provides State Provisioning of a Salesforce org to a given state.';
Provision.examples = [
    '$ dx-auto provision -a "${authKey}" -f "${configFilePath1}, ${configFilePath2}, ${configFilePath3}"',
];
Provision.flags = {
    authKey: core_1.Flags.string({
        char: 'a',
        description: 'authorization key to execute',
        required: true,
    }),
    configFilePath: core_1.Flags.string({
        char: 'f',
        description: 'file path to config file',
        required: true,
    }),
};
