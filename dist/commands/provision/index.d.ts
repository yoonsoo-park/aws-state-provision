import { Command } from '@oclif/core';
export default class Provision extends Command {
    static description: string;
    static examples: string[];
    static flags: {
        authKey: import("@oclif/core/lib/interfaces").OptionFlag<string, import("@oclif/core/lib/interfaces/parser").CustomOptions>;
        configFilePath: import("@oclif/core/lib/interfaces").OptionFlag<string, import("@oclif/core/lib/interfaces/parser").CustomOptions>;
    };
    run(): Promise<void>;
}
