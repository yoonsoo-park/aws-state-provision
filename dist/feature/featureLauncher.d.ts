import { Feature } from './feature';
export declare class FeatureLauncher {
    private feature;
    constructor(feature: Feature);
    launch(): Promise<void>;
}
