let homepage = require('../pages/homepage');
let fs = require('fs');  //para hacer capturas en un paso concreto
//declaramos las variables de los Step
const step2 = allure.createStep("#2 Inserte el segundo número", ()=>{});
//configuracion log4js
var log4js = require('log4js');
log4js.configure({
    appenders: { fichero: { type: 'file', filename: 'resultLog.log' } },
    categories: { default: { appenders: ['fichero'], level: 'info' } }
  });
const logger = log4js.getLogger('fichero');
//captura de pantalla en un paso concreto 
var screenshots = require('protractor-take-screenshots-on-demand');

describe('Demo calculator tests', function(){
    it('addition test', function(){
        //browser.get('http://juliemr.github.io/protractor-demo/');
       homepage.get('http://juliemr.github.io/protractor-demo/');   
       screenshots.takeScreenshot('Captura1'); // take screenshots
       logger.info("Funciona paso1");
        
       //element(by.xpath("//*[@ng-model='first']")).sendKeys('2');
        //element(by.model('first')).sendKeys('2');
        allure.createStep('#1 Inserte el primer número', function () {
            browser.takeScreenshot().then(function (png) {
              allure.createAttachment('Paso1', function () {return new Buffer(png, 'base64')}, 'image/png')();
            });
          })();
        homepage.enterFirstNumber('4');
        //Se crea el allure report el step, imagen y además la imagen se guarda en la carpeta screenshot
      allure.createStep('Paso2', function () {
      browser.takeScreenshot().then(function (png) {
          allure.createAttachment('Paso2', function () {return screenshots.takeScreenshot('Captura2'), new Buffer(png, 'base64')}, 'image/png')();
          });
      })();
      logger.info("Funciona paso2");
        
        //element(by.model('second')).sendKeys('3');
        step2();
        homepage.enterSecondNumber('3');
        screenshots.takeScreenshot('Captura3'); 
        //Otra forma de hacer una captura en un sitio concreto
        /*browser.takeScreenshot().then(function(fullPage){
            var stream = fs.createWriteStream ('fullpage.png');
            stream.write(new  Buffer(fullPage,'base64' ));
            stream.end();
        });*/
                
        //Forma de crear subStep
       allure.createStep('#3 Click', function() {
              allure.createStep('Subpaso 3.1', function () {})();
              homepage.clickGo();
              allure.createStep('Subpaso 3.2', function () {})();
        })();
        //element(by.css('[ng-click="doAddition()"]')).click();
       // homepage.clickGo();
        screenshots.takeScreenshot('Captura4'); 
        //let result= element(by.cssContainingText('.ng-binding','5'));
        //expect(result.getText()).toEqual('5');
        allure.createStep('Ultimo paso', function(){})();
        homepage.verifyResult('7');
        browser.sleep(3000);
    }); 
});
