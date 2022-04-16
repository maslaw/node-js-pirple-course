/**
 * Helpers for various tasks
 */

// Dependencies
const crypto = require('crypto');
const config = require('./config');

// Container for all helpers
const helpers = {};

// Create a SHA256 hash
helpers.hash = (string) => {
	if (typeof(string) === 'string' && string.trim().length) {
		return crypto.createHmac('sha256', config.hashingSecret).update(string).digest('hex');
	} else {
		return false;
	}
};

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = (string) => {
	try {
		return JSON.parse(string);
	} catch (e) {
		return {};
	}
};

// Export the module
module.exports = helpers;