"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = (0, tslib_1.__importDefault)(require("express"));
const featureLauncher_1 = require("./feature/featureLauncher");
const provisioner_1 = require("./provision/provisioner");
const app = (0, express_1.default)();
// Enable JSON body parsing
app.use(express_1.default.json());
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
        const configFilePaths = req.body.configFilePaths.split(',');
        const provisionLauncher = new featureLauncher_1.FeatureLauncher(new provisioner_1.Provisioner(authKey, configFilePaths));
        await provisionLauncher.launch();
        res.send(`welcome to the State Provision API!`);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});
// Define a POST route for "/data"
app.post('/data', (req, res) => {
    console.log(req.body); // Log whatever data was sent
    res.send('Data received! ' + `Body: ${req.body.authKey}`);
});
app.listen(4000, () => {
    console.log('server running on port 4000');
});
