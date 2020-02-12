process.env.CHROME_BIN = require("puppeteer").executablePath();
const fs = require('fs')

var TRAVIS_WITHOUT_BS = process.env.TRAVIS_SECURE_ENV_VARS === 'false'

var launchers = {
  bs_chrome: {
    base: 'BrowserStack',
    browser: 'chrome',
    os: 'Windows',
    os_version: '10'
  }
}

// Verify the install. This will run async but that's ok we'll see the log.
fs.lstat('node_modules/karma', (err, stats) => {
  if (err) {
    console.error('Cannot verify installation', err.stack || err)
  }
  if (stats && stats.isSymbolicLink()) {
    return
  }

  console.log('**** Incorrect directory layout for karma self-tests ****')
  console.log(`
    $ npm install
    $ rm -rf node_modules/karma
    $ cd node_modules
    $ ln -s ../ karma
    $ cd ../
    $ grunt browserify
  `)
  process.exit(1)
})

var browsers = []

if (process.env.TRAVIS) {
  if (TRAVIS_WITHOUT_BS) {
    browsers.push('Firefox')
  } else {
    browsers = Object.keys(launchers)
  }
} else {
  browsers.push('Chrome')
}

module.exports = function (config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: './',

    frameworks: ['browserify', 'mocha'],

    // list of files / patterns to load in the browser
    files: [
      'test/unit/*.js'
    ],

    // list of files to exclude
    exclude: [
    ],

    preprocessors: {
      'test/unit/*.js': ['browserify']
    },

    // use dots reporter, as travis terminal does not support escaping sequences
    // possible values: 'dots', 'progress'
    // CLI --reporters progress
    reporters: ['dots', 'junit'],
    singleRun: true,
    junitReporter: {
      // will be resolved to basePath (in the same way as files/exclude patterns)
      outputDir: 'TEST_RESULTS',
      outputFile: 'test-results.xml'
    },

    // web server port
    // CLI --port 9876
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    // CLI --colors --no-colors
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    // CLI --log-level debug
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    // CLI --auto-watch --no-auto-watch
    autoWatch: true,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    // CLI --browsers Chrome,Firefox,Safari
    browsers: browsers,

    customLaunchers: launchers,

    // If browser does not capture in given timeout [ms], kill it
    // CLI --capture-timeout 5000
    captureTimeout: 50000,

    // Auto run tests on start (when browsers are captured) and exit
    // CLI --single-run --no-single-run
    singleRun: false,

    // report which specs are slower than 500ms
    // CLI --report-slower-than 500
    reportSlowerThan: 500,

    plugins: [
      'karma-mocha',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-junit-reporter',
      'karma-browserify',
      'karma-browserstack-launcher',
	  'karma-coverage',
      'karma-chrome-launcher',
	  'karma-ie-launcher',
	  'karma-qunit'
    ],

    concurrency: 3,

    forceJSONP: true,

    browserStack: {
      project: 'Karma',
      // The karma-browserstack-launcher polls for each browser.
      // With many browsers the 120 requests per minute limit is hit
      // resulting in fails Error: 403 Forbidden (Rate Limit Exceeded)
      pollingTimeout: 10000
    }
  })
}
