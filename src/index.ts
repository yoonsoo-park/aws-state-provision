import express, { Request, Response } from 'express';
import { FeatureLauncher } from './feature/featureLauncher';
import { Provisioner } from './provision/provisioner';

const app = express();
// Enable JSON body parsing
app.use(express.json());

// Define the /hello route
app.get('/hello', (req, res) => {
	res.send('Hello, world!');
});

app.post('/provisions', async (req, res) => {
	try {
		console.log(req.body);
		if (!req.body.authKey || !req.body.configFilePaths) {
			throw new Error('Missing required parameters');
		}
		const authKey = req.body.authKey;
		const configFilePaths = req.body.configFilePaths.split(',') as string[];

		const provisionLauncher = new FeatureLauncher(new Provisioner(authKey, configFilePaths));
		await provisionLauncher.launch();
		res.send(`welcome to the State Provision API!`);
	} catch (error) {
		console.error(error);
		res.status(500).send('An error occurred');
	}
});

// Define a POST route for "/data"
app.post('/data', (req: Request, res: Response) => {
	console.log(req.body); // Log whatever data was sent
	res.send('Data received! ' + `Body: ${req.body.authKey}`);
});

app.listen(4000, () => {
	console.log('server running on port 4000');
});
