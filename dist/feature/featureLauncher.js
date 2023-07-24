"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureLauncher = void 0;
class FeatureLauncher {
    constructor(feature) {
        this.feature = feature;
    }
    async launch() {
        await this.feature.launch();
    }
}
exports.FeatureLauncher = FeatureLauncher;
