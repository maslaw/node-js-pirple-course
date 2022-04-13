/**
 * Library for storing and editing data
 */

// Dependencies
const fs = require('fs');
const path = require('path');

// Container for lib module (to be exported)
const lib = {};

// Base directory of the data folder
lib.baseDir = path.join(__dirname, '/../.data/');

// Write data to a file
lib.create = (dir, file, data, callback) => {
	// Open the file for writing
	fs.open(lib.baseDir + dir + '/' + file + '.json', 'wx', (error, fileDescriptor) => {
		if (!error && fileDescriptor) {
			// Convert data to string
			const stringData = JSON.stringify(data);

			// Write to file and close it
			fs.writeFile(fileDescriptor, stringData, (error) => {
				if (!error) {
					fs.close(fileDescriptor, (error) => {
						if (!error) {
							callback(false);
						} else {
							callback('Error closing new file');
						}
					});
				} else {
					callback('Error writing to new file');
				}
			});
		} else {
			callback('Could not create new file, it may already exists');
		}
	});
};

// Read data from a file
lib.read = (dir, file, callback) => {
	fs.readFile(lib.baseDir + dir + '/' + file + '.json', 'utf-8', (error, data) => {
		callback(error, data);
	});
};

// Update data inside file
lib.update = (dir, file, data, callback) => {
	// Open the file for writing
	fs.open(lib.baseDir + dir + '/' + file + '.json', 'r+', (error, fileDescriptor) => {
		if (!error && fileDescriptor) {
			// Convert data to string
			const stringData = JSON.stringify(data);

			// Truncate the file
			fs.ftruncate(fileDescriptor, (error) => {
				if (!error) {
					// Write to the file and close it
					fs.writeFile(fileDescriptor, stringData, (error) => {
						if (!error) {
							fs.close(fileDescriptor, (error) => {
								if (!error) {
									callback(false);
								} else {
									callback('Error closing existing file');
								}
							});
						} else {
							callback('Error writing to existing file');
						}
					});
				} else {
					callback('Error truncating file');
				}
			});
		} else {
			callback('Cound not open file for update. It may not exist yet');
		}
	});
};

// Delete a file
lib.delete = (dir, file, callback) => {
	// Unlink the file
	fs.unlink(lib.baseDir + dir + '/' + file + '.json', (error) => {
		if (!error) {
			callback(false);
		} else {
			callback('Error during deleting file');
		}
	});
};

// Export the module
module.exports = lib;
