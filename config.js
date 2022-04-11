/**
 * Create and export configuration variables
 */

// Container for all the environmnets
const environmnets = {};

// Staging (default) environment
environmnets.staging = {
	port: 3000,
	envName: 'staging'
};

// Production environment
environmnets.production = {
	port: 5000,
	envName: 'production'
};

// Determine which environment was passed as a command-line argument
const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above, if not, default to staging
const environmentToExport = typeof(environmnets[currentEnvironment]) === 'object' ? environmnets[currentEnvironment] : environmnets.staging;

// Export the module
module.exports = environmentToExport;