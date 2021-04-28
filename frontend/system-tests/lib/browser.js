//This file to provide the list of browsers name and browser properties
//It's also provide option to run tests without browsers.

'use strict';

const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const edge = require('selenium-webdriver/edge');
const safari = require('selenium-webdriver/safari');
const { Builder } = require('selenium-webdriver');

var ffOptions = new firefox.Options().headless();
ffOptions.addArguments('--no-sandbox');
ffOptions.addArguments('--headless');
ffOptions.addArguments('--disable-gpu');


var chOptions   = new chrome.Options().headless();
chOptions.addArguments('--no-sandbox');
chOptions.addArguments('--headless');
chOptions.addArguments('--window-size=1920x1080');
chOptions.addArguments('--disable-dev-shm-usage');

// Variables need for Accessibility and Globalization when run with GAT
var chromeCap = webdriver.Capabilities.chrome();
chromeCap.set('chromeOptions', {args: ['--no-sandbox',
                                       '--disable-gpu',
                                       '--window-size=1920x1080',
                                       '--disable-setuid-sandbox',
                                       '--disable-dev-shm-usage']});


module.exports = function getDriver(browser='chrome') {
    var browsername = browser == undefined ? this.browserName : browser;
    switch (browsername.toUpperCase()) {
        case 'CHROME':
            return new Builder()
                .forBrowser('chrome')
                .withCapabilities(chromeCap)
                .build();
        case 'FIREFOX':
            return new Builder()
                .forBrowser('firefox')
                .build();
        case 'EDGE':
            return new Builder()
                .forBrowser('edge')
                .build();
        case 'SAFARI':
            return new Builder()
                .forBrowser('safari')
                .build();
        case 'CHROME-HEADLESS':
            return new Builder()
                .forBrowser('chrome')
                .setChromeOptions(chOptions)
                .build();
        case 'FIREFOX-HEADLESS':
            return new Builder()
                .forBrowser('firefox')
                .setFirefoxOptions(ffOptions)
                .build();
        default:
            return new Builder()
                .forBrowser('chrome')
                .withCapabilities(chromeCap)
                .build();
    }
    //Add .usingServer(http://100.96.190.138/wd/hub) after Builder when test cases running within
    //gat.us.oracle.com for Accessibility and Globalization testing.
}
