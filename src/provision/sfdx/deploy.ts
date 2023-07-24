import { ComponentSet } from '@salesforce/source-deploy-retrieve';

export async function deployUnmanagedMetadata(sfMetadata: string): Promise<void> {
	try {
		if (!sfMetadata || sfMetadata.length === 0) {
			return;
		}
		console.log(`\n📞 Deploying unmanaged metadata configuration...`);
		const metadataList = Array.isArray(sfMetadata) ? sfMetadata : [sfMetadata];
		for (const metadata of metadataList) {
			console.log(`🔫 Deploying unmanaged metadata: ${metadata}`);
			await deployMetadata(metadata);
		}
		console.log('✅ Deploying unmanaged metadata configuration successful\n');
	} catch (error) {
		console.log(`❌ Error deploying unmanaged metadata configuration: ${error}`);
		return;
	}
}

export async function deployMetadata(metadata: string): Promise<void> {
	const username = process.env.USERNAME;
	const deploy = await ComponentSet.fromSource(metadata).deploy({
		usernameOrConnection: `${username}`,
	});

	// Attach a listener to check the deploy status on each poll
	deploy.onUpdate(() => {
		// waiting for deploy to finish
	});

	// Wait for polling to finish and get the DeployResult object
	const result = await deploy.pollStatus();

	// Output each file along with its state change of the deployment
	console.log(result.getFileResponses());
}
