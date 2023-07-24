import { Feature } from './feature';

export class FeatureLauncher {
	private feature: Feature;

	constructor(feature: Feature) {
		this.feature = feature;
	}

	async launch(): Promise<void> {
		await this.feature.launch();
	}
}
