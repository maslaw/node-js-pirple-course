/**
 * Request handlers
 */

// Dependencies
const _data = require('./data');
const helpers = require('./helpers');

// Define the handlers
const handlers = {};

// Users
handlers.users = (data, callback) => {
  const acceptableMethods = ['post', 'get', 'put', 'delete'];

	if (acceptableMethods.indexOf(data.method > -1)) {
		handlers._users[data.method](data, callback);
	} else {
		callback(405);
	}
};

// Container for the users submethods
handlers._users = {};

// Users - post
// Required data: firstName, lastName, phone, password, tosAgreement
// Optional data: none
handlers._users.post = (data, callback) => {
	// Check that all requered fields are filled out
	const firstName = typeof(data.payload.firstName) === 'string' && data.payload.firstName.trim().length ? data.payload.firstName.trim() : false;
	const lastName = typeof(data.payload.lastName) === 'string' && data.payload.lastName.trim().length ? data.payload.lastName.trim() : false;
	const phone = typeof(data.payload.phone) === 'string' && data.payload.phone.trim().length === 10 ? data.payload.phone.trim() : false;
	const password = typeof(data.payload.password) === 'string' && data.payload.password.trim().length ? data.payload.password : false;
	const tosAgreement = typeof(data.payload.tosAgreement) === 'boolean' && data.payload.tosAgreement;

	if (firstName && lastName && phone && password && tosAgreement) {
		// Make sure that the user doesn't already exist
		_data.read('users', phone, (error, data) => {
			if (error) {
				// Hash password
				const hashedPassword = helpers.hash(password);

				if (!hashedPassword) {
					callback(500, {'Error': 'Could not hash the user\'s password'});
					return;
				}

				// Create the user object
				const user = {
					firstName,
					lastName,
					phone,
					password: hashedPassword,
					tosAgreement
				};

				// Store the user
				_data.create('users', phone, user, (error) => {
					if (!error) {
						callback(200);
					} else {
						console.log(error);
						callback(500, {'Error': 'Could not create the new user'});
					}
				});
			} else {
				// User already exists
				callback(400, {'Error': 'User with that phone number already exists'});
			}
		});
	} else {
		callback(400, {'Error': 'Missing required fields'});
	}
};

// Users - get
// Required data: phone
// Optional data: none
// TODO: only let an authenticated user access their object. Don't let them access anyone else
handlers._users.get = (data, callback) => {
	// Check that the phone number is valid
	const phone = typeof(data.queryStringObject.phone) === 'string' && data.queryStringObject.phone.trim().length === 10 ? data.queryStringObject.phone : false;

	if (phone) {
		// Lookup the user
		_data.read('users', phone, (error, data) => {
			if (!error && data) {
				// Remove hashed password from the user object before the returning it to requestor
				delete data.password;
				callback(200, data);
			} else {
				callback(404);
			}
		});
	} else {
		callback(400, {'Error': 'Missing required field'});
	}
};

// Users - put
// Required data: phone
// Optional data: firstName, lastName, password (at least one must be specified)
// TODO: Only let an authenticated user update their own object. Don't let them update anyone else's
handlers._users.put = (data, callback) => {
	// Check that the phone number is valid
	const phone = typeof(data.payload.phone) === 'string' && data.payload.phone.trim().length === 10 ? data.payload.phone : false;

	// Check for the optional fields
	const firstName = typeof(data.payload.firstName) === 'string' && data.payload.firstName.trim().length ? data.payload.firstName.trim() : false;
	const lastName = typeof(data.payload.lastName) === 'string' && data.payload.lastName.trim().length ? data.payload.lastName.trim() : false;
	const password = typeof(data.payload.password) === 'string' && data.payload.password.trim().length ? data.payload.password : false;

	// Error if the phone is invalid
	if (phone) {
		if (firstName || lastName || password) {
			// Lookup the user
			_data.read('users', phone, (error, data) => {
				if (!error && data) {
					// Update the fields necessary
					if (firstName) {
						data.firstName = firstName;
					}

					if (lastName) {
						data.lastName = lastName;
					}

					if (password) {
						data.password = helpers.hash(password);
					}

					// Store the new updates
					_data.update('users', phone, data, (error) => {
						if (!error) {
							callback(200);
						} else {
							console.log(error);
							callback(500, {'Error': 'Could not update the user'});
						}
					});
				} else {
					callback(400, {'Error': 'The specified user does not exist'});
				}
			});
		} else {
			callback(400, {'Error': 'Missing fields to update'});	
		}
	} else {
		callback(400, {'Error': 'Missing required field'});
	}
};

// Users - delete
// Required data: phone
// Optional data: none
// TODO: Only let an authenticated user delete their own object. Don't let them delete anyone else's
// TODO: Cleanup (delete) any other data files associated withi this user
handlers._users.delete = (data, callback) => {
	// Check that the phone number is valid
	const phone = typeof(data.queryStringObject.phone) === 'string' && data.queryStringObject.phone.trim().length === 10 ? data.queryStringObject.phone : false;

	if (phone) {
		// Lookup the user
		_data.read('users', phone, (error, data) => {
			if (!error && data) {
				_data.delete('users', phone, (error) => {
					if (!error) {
						callback(200);
					} else {
						callback(500, {'Error': 'Could not delete the specified user'});
					}
				});
			} else {
				callback(400, {'Error': 'Could not find the specified user'});
			}
		});
	} else {
		callback(400, {'Error': 'Missing required field'});
	}
};

// Ping handler
handlers.ping = (data, callback) => {
  // Callback a http status code and a payload object
  callback(200);
};

// Not found handler
handlers.notFount = (data, callback) => {
  callback(404);
};

module.exports = handlers;
