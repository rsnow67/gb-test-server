const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const fs = require('fs');
const path = require('path');

const app = express();
const host = 'localhost';
const port = 8000;

const user = {
	id: 123,
	username: 'testuser',
	password: 'qwerty'
};

// create application/json parser
const jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({
	extended: false
})

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

app.post('/post', (req, res) => {
	res.status(200).send('Success.');
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
			maxAge: 183600000,
		});
		res.cookie('authorized', true, {
			expires: new Date(Date.now() + 183600000),
			maxAge: 183600000,
		});
		res.status(200).send('Вы вошли в систему.');
	} else {
		res.cookie('userId', user.id, {
			maxAge: 0,
		});
		res.cookie('authorized', true, {
			maxAge: 0,
		});
		res.status(400).send('Неверный логин или пароль.');
	}
})

app.use((req, res) => {
	res.status(404).send('Page not found.');
});

app.listen(port, host, () => {
	console.log(`Server is running on http://${host}:${port}`);
});