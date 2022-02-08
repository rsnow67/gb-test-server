const http = require('http');
const fs = require('fs');
const path = require('path');

const host = 'localhost';
const port = 8000;

const requestListener = (req, res) => {
	if (req.url === '/get' && req.method === 'GET') {
		const fullPath = path.join(__dirname, 'files');
		let list = '';
		try {
			list = fs.readdirSync(fullPath).join(', ')
		} catch (err) {
			res.writeHead(500);
			res.end('Internal server error.');
		}
		res.writeHead(200, 'OK');
		res.end(list);
	} else if (req.url === '/delete' && req.method === 'DELETE' || req.url === '/post' && req.method === 'POST' || req.url === '/redirected') {
		res.writeHead(200, 'OK');
		res.end('Success.');
	} else if (req.url === '/redirect' && req.method === 'GET' || req.url === '/redirect' && req.method === 'POST') {
		res.writeHead(200, 'OK');
		res.end('Resource has been permanently moved to "/redirected".');
	} else if (req.url === '/get' || req.url === '/delete' || req.url === '/post') {
		res.writeHead(405);
		res.end('HTTP method not allowed.');
	} else {
		res.writeHead(404);
		res.end('Page not found.');
	}
}

const server = http.createServer(requestListener);

server.listen(port, host, () => {
	console.log(`Server is running on http://${host}:${port}`);
});