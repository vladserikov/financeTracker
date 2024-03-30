import express from 'express';

const app = express();

app.use(express.json());

const port = 3001;

app.get('/', (_req, res) => {
	res.send(`<h1>Hello</h1>`);
});

app.listen(port, () => {
	console.log(`${port}`);
});
