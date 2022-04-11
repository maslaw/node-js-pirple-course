const http = require('http');
const url = require('url');

const server = http.createServer(function (req, res) {
  // Get the url and parse it.
  // With second argument equal 'false', query string will be parsed as string: testParam=testValue, testParam=testValue&anotherParam=anotherValue.
  // With secong argument equal 'true', query string will be parsed as key-value object: {testParam: 'testValue'}, {testParam: 'testValue', anotherParam: 'anotherValue'}
  const parsedUrl = url.parse(req.url, true);

  // Get the path
  const path = parsedUrl.pathname;
	const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object
  const queryStringObject = parsedUrl.query;

  // Get HTTP method
  const method = req.method.toLowerCase();

  // Get the HEADERS as an object
  const headers = req.headers;

  // Send the response
  res.end('Hello World!\n');

  // Log the request path
  console.log(`Request received on path: ${trimmedPath}, with method: ${method}`);
  console.log('and query params:', queryStringObject);
  console.log('and with these headers:', headers);
});

server.listen(3000, () => {
  console.log("Ther server is listening on port 3000 now");
});
