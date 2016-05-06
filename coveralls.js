// Karma configuration
// Generated on Wed Sep 09 2015 11:00:16 GMT+0500 (YEKT)
var karma = require('./karma.conf.js');
module.exports = function (config) {
	karma(config);
	config.plugins.push('karma-coverage');
	config.plugins.push('karma-coveralls');
	config.reporters = ['coverage', 'progress', 'coveralls'];
	config.coverageReporter = {
		type: 'lcov',
		dir: 'coverage/'
	};
	config.webpack.module['postLoaders'] = [{
		test: /\.ts$/,
		exclude: /tests/,
		loader: 'istanbul-instrumenter'
	}];
};
