const http = require('http');
const url = require('url');

const server = http.createServer(function (req, res) {
  // Get the url and parse it
  const parsedUrl = url.parse(req.url, true);

  // Get the path
  const path = parsedUrl.pathname;
	const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get HTTP method
  const method = req.method.toLowerCase();

  // Send the response
  res.end('Hello World!\n');

  // Log the request path
  console.log(`Request received on path: ${trimmedPath}, with method: ${method}`);
});

server.listen(3000, () => {
  console.log("Ther server is listening on port 3000 now");
});
