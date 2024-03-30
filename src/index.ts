import 'dotenv/config';
import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (_req, res) => {
	res.send(`<h1>Hello</h1>`);
});

app.listen(process.env.PORT || 3001, () => {
	console.log('server start');
});
