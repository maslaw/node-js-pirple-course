const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

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

  // Get the payload, if any
  let buffer = '';
  const decoder = new StringDecoder('utf-8');

  req.on('data', data => {
    buffer += decoder.write(data);
  });

  req.on('end', () => {
    buffer += decoder.end();

    // Send the response
    res.end('Hello World!\n');

    // Log the request payload
    console.log(`Request received with payload: ${buffer}`);
  });
});

server.listen(3000, () => {
  console.log("Ther server is listening on port 3000 now");
});
