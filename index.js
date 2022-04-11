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

    // Choose the handler this request should go to. If one is not found - use notFound handler
    const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFount;

    // Construct the data object to send to the handler
    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: buffer
    };

    // Route the request to the handler specified in the router
    chosenHandler(data, (statusCode, payload) => {
      // Use the status code called back by the handler, or default to 200
      statusCode = typeof(statusCode) === 'number' ? statusCode : 200;

      // Use the payload called back by the handler, or default to an empty object
      payload = typeof(payload) === 'object' ? payload : {};

      // Convert the payload to string
      const payloadString = JSON.stringify(payload);

      // Return the response
      res.writeHead(statusCode);
      res.end(payloadString);

      // Log the request payload
      console.log(`Returning this response: statusCode=${statusCode}, payloadString=${payloadString}`);
    });
  });
});

server.listen(3000, () => {
  console.log("Ther server is listening on port 3000 now");
});

// Define the handlers
const handlers = {};

// Sample handler
handlers.sample = (data, callback) => {
  // Callback a http status code and a payload object
  callback(406, {'name': 'sample handler'});
};

// Not found handler
handlers.notFount = (data, callback) => {
  callback(404);
};

// Define a request router
const router = {
  'sample': handlers.sample
};
