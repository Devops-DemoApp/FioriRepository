process.env.CHROME_BIN = require("puppeteer").executablePath();

module.exports = function(config) {
	config.set({

		plugins: [
			require("../../"),
			require("karma-coverage"),
			require("karma-chrome-launcher"),
			require("karma-ie-launcher"),
			require("karma-qunit")
		],

		customLaunchers: {
			ChromeHeadlessNoSandbox: {
				base: "ChromeHeadless",
				flags: [
					"--no-sandbox"
				]
			}
		},

		browsers: ["ChromeHeadlessNoSandbox"],

		browserConsoleLogOptions: {
			level: "error"
		},

		reporters: ['dots', 'junit'],
    		singleRun: true,
    		junitReporter: {
      		// will be resolved to basePath (in the same way as files/exclude patterns)
      		outputDir: 'TEST_RESULTS',
      		outputFile: 'test-results.xml'
    		}

	});
};
