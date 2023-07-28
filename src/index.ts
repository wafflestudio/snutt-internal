import express from 'express';

const app = express();
const port = 3000;

app.use('/health-check', (req, res) => res.sendStatus(200));

app.listen(port, () => `Server is running on port ${port}`);
