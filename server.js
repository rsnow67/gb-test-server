const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const http = require('http');
const fs = require('fs');
const path = require('path');

const app = express();
const host = 'localhost';
const port = 8000;

const jsonParser = bodyParser.json();

app.use(cookieParser());

const user = {
	id: 123,
	username: 'testuser',
	password: 'qwerty'
};

const callbackStatus405 = (req, res) => {
	res.status(405).send('HTTP method not allowed.');
}

app.get('/get', (req, res) => {
	const fullPath = path.join(__dirname, 'files');
	let list = '';
	try {
		list = fs.readdirSync(fullPath).join(', ')
	} catch (err) {
		res.status(500).send('Internal server error.');
	}
	res.status(200).send(list);
}).all('/get', callbackStatus405);

app.post('/post', jsonParser, (req, res) => {
	const {
		userId,
		authorized
	} = req.cookies;
	const {
		filename,
		content
	} = req.body;

	if (userId == user.id && authorized === 'true') {
		const pathToFile = path.join(__dirname, `files/${filename}`);
		fs.writeFile(pathToFile, content, (err) => {
			if (err) throw err;
			res.status(200).send(`File ${filename} created/rewrited.`);
		});
	} else {
		res.status(401).send('Access denied. You are not logged in.');
	}
}).all('/post', callbackStatus405);

app.delete('/delete', (req, res) => {
	res.status(200).send('Success.');
}).all('/delete', callbackStatus405);

app.get('/redirect', (req, res) => {
	res.status(200).send('Resource has been permanently moved to "/redirected".');
});

app.post('/auth', jsonParser, (req, res) => {
	const {
		username,
		password
	} = req.body;
	if (username === user.username && password === user.password) {
		res.cookie('userId', user.id, {
			expires: new Date(Date.now() + 183600000),
			maxAge: 183600000
		});
		res.cookie('authorized', true, {
			expires: new Date(Date.now() + 183600000),
			maxAge: 183600000
		});
		res.status(200).send('You are logged in to your account.');
	} else {
		res.cookie('userId', user.id, {
			maxAge: 0
		});
		res.cookie('authorized', false, {
			maxAge: 0
		});
		res.status(400).send('Incorrect login or password.');
	}
}).all('/auth', callbackStatus405);

app.use((req, res) => {
	res.status(404).send('Page not found.');
});

app.listen(port, host, () => {
	console.log(`Server is running on http://${host}:${port}`);
});