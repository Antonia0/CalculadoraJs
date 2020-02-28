// An example configuration file.
/*var HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');
var reporter = new HtmlScreenshotReporter({
  dest: 'target/screenshots',
  filename: 'my-report.html'
});*/

exports.config = {
  //Para lanzarlo en local tienes que comentar directConnect: true y añadir seleniumAddress:''http://localhost:4444/wd/hub'
 // directConnect: true,
 seleniumAddress: 'http://localhost:4444/wd/hub',
  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome',
    //'chromeDriver': 'C:/Users/ahercast/Downloads/chromedriver_win32/chromedriver.exe'
  },

  // Framework to use. Jasmine is recommended.
  framework: 'jasmine',

  // Spec patterns are relative to the current working directory when
  // protractor is called.
  specs: ['../tests/calculator.js'],

  // Default time to wait in ms before a test fails
  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }, 
 // Setup the report before any tests start
 /*beforeLaunch: function() {
  return new Promise(function(resolve){
    reporter.beforeLaunch(resolve);
  });
},*/
onPrepare: function() {
  var jasmineReporters = require('jasmine-reporters');
  jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
      consolidateAll: true,
      savePath: './',
      filePrefix: 'xmlresults'
  }));

  //hacer captura en un paso concreto
  var screenshots = require('protractor-take-screenshots-on-demand');
     //joiner between browser name and file name
     screenshots.browserNameJoiner = ' - '; //this is the default
     //folder of screenshots
     screenshots.screenShotDirectory = 'screenshots';
     //creates folder of screenshots
     screenshots.createDirectory();

    //para hacer captura de pantalla en caso de error 
    var fs = require('fs-extra');
    fs.emptyDir('screenshots/', function (err) {
            console.log(err);
    });
    jasmine.getEnv().addReporter({
        specDone: function(result) {
            if (result.status == 'failed') {
                browser.getCapabilities().then(function () {
                    browser.takeScreenshot().then(function (png) {
                        var stream = fs.createWriteStream('screenshots/'+ result.fullName+ '.png');
                        stream.write(new Buffer(png, 'base64'));
                        stream.end();
                    });
                });
            }
        }
    });

    //Genera el archivo allure
    var AllureReporter = require('jasmine-allure-reporter');
    jasmine.getEnv().addReporter(new AllureReporter({
      resultsDir: 'allure-results'
    }));

    //Con esto crear la carpeta allure-results, el fichero xml de dentro y la captura de pantalla al final de cada describe
    /*var AllureReporter = require('jasmine-allure-reporter');
    jasmine.getEnv().addReporter(new AllureReporter());
    jasmine.getEnv().afterEach(function(done){
      browser.takeScreenshot().then(function (png) {
        allure.createAttachment('Screenshot', function () {
          return new Buffer(png, 'base64')
        }, 'image/png')();
        done();
      })
    });*/
},

// Close the report after all tests finish
/*afterLaunch: function(exitCode) {
  return new Promise(function(resolve){
    reporter.afterLaunch(resolve.bind(this, exitCode));
  });
},*/

//HTMLReport called once tests are finished
onComplete: function() {
  var browserName, browserVersion;
  var capsPromise = browser.getCapabilities();

  capsPromise.then(function (caps) {
     browserName = caps.get('browserName');
     browserVersion = caps.get('version');
     platform = caps.get('platform');

     var HTMLReport = require('protractor-html-reporter-2');

     testConfig = {
         reportTitle: 'Protractor Test Execution Report',
         outputPath: './',
         outputFilename: 'ProtractorTestReport',
         screenshotPath: './screenshots',
         testBrowser: browserName,
         browserVersion: browserVersion,
         modifiedSuiteName: false,
         screenshotsOnlyOnFailure: true,
         testPlatform: platform
     };
     new HTMLReport().from('xmlresults.xml', testConfig);
 });
}

};
