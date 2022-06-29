// Modify and verify:
// Configuration -> Environment -> Domain Properties Tabs
//     General, Security, JTA, Concurrency, EJB, Web Application and Batch Pages
//
'use strict'

const {Builder, By, Key, until} = require('selenium-webdriver')
const assert = require('assert')

// Initialize type of browser driver
const getDriver = require('../lib/browser');

// Get AdminServer properties
const Admin = require('../lib/admin');
const browser = require('../lib/admin').browserName;

// Get Domain functions
const Domain = require('../lib/domainProperty');

// Configuration Domain Panel Test Suite
describe.only('Test Suite: domainProps_test for Domain Configuration properties', function () {
    let driver;
    let file = "domainConfig.png";
    let element;
    let domain;
    let admin;
    var sec = 1000;
    this.timeout(600*sec);

    beforeEach(async function () {
        // Get Browser driver
        driver = getDriver(browser);
        await driver.manage().window().maximize();
        domain = new Domain(driver, file);
        admin = new Admin(driver, file);
    })
    afterEach(async function () {
        await driver.quit();
    })

    //Test Case Name to modify:
    // Configuration -> Environments > Domain General Page Tab:
    //
    it('1. Test Category: GAT/Risk1\n \t Test Scenario: Modify Domain General Tab', async function () {
        file = "modifyDomainGeneralProp.png";
        try {
            await domain.modifyDomainGeneralTab(driver,'ON','ON','9002','ON','ON','ON','OFF','OFF','console-1',
                'ADMINCONSOLESESSION-1','OFF','4800','200','http://myTest.com','console-ext-2','ON','https','Audit',
                'ON','3','OFF','ON','ON','OFF','OFF','OFF','OFF','Admin','ON','60' );
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case Name to verify:
    // Configuration -> Environments > Domain -> General Tabs:
    //
    it('2. Test Category: GAT/Risk1\n \t Test Scenario: Verify Domain General Properties Page ', async function () {
        file = "verifyDomainGeneralProp.png";
        try {
            console.log("Verify Domain General Tab after configuration");
            await domain.verifyDomainGeneralTab(driver);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })


    //Test Case Name for modify:
    // Configuration->Environments->Domain->Security->General Page Properties
    it('3. Test Category: GAT/Risk1\n \t Test Scenario: Modify Environment Domain->Security->General Properties Pages', async function () {
        file = "modifyDomainSecurityGeneralProp.png";
        try {
            await domain.modifyDomainSecurityGeneralTab(driver,'weblogic',process.env.CONSOLE_TEST_PASSWORD,'False','OFF','ON','ON','ON',
                'ON','ON','ON','ON','OFF','OFF','OFF','OFF','OFF','OFF');
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case Name for verify:
    // Configuration -> Environments > Domain Tabs:
    //    General, Security, JTA, Concurrency, EJB, Web Application and Batch
    // 
    it('4. Test Category: GAT/Risk1\n \t Test Scenario: Verify Environment Domain->Security->General Properties Pages ', async function () {
        file = "verifyDomainSecurityGeneralProp.png";
        try {
            await domain.verifyDomainSecurityGeneralTab(driver);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case Name to modify:
    // Configuration->Environments->Domain->Security->Filter Page Properties
    //
    it('5. Test Category: GAT/Risk1\n \t Test Scenario: Modify Environment Domain->Security->Filter Properties Pages', async function () {
        file = "modifyDomainSecurityFilterProp.png";
        try {
            await domain.modifyDomainSecurityFilterTab(driver,'ON','filter-1','filterRule-1');
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case Name to modify:
    // Configuration->Environments->Domain->Security->Embedded LDAP Page Properties
    //
    it('6. Test Category: GAT/Risk1\n \t Test Scenario: Modify Environment Domain->Security->Embedded LDAP Properties Pages', async function () {
        file = "modifyDomainSecurityLDAPProp.png";
        try {
            await domain.modifyDomainSecurityEmbeddedLDAPTab(driver,process.env.CONSOLE_TEST_PASSWORD,'3','30','2','OFF','35','2',
                'ON','ON','100','ON');
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case Name to modify:
    // Configuration->Environments->Domain->Security->SSL Certificate->General Page Properties
    //
    it('7. Test Category: GAT/Risk1\n \t Test Scenario: Environment Domain->Security->SSL Certificate->General Properties Pages', async function () {
        file = "modifyDomainSSLCertificateProp.png";
        try {
            await domain.modifyDomainSecuritySSLGeneralTab(driver,'ON','OCSP THEN CRL','ON');
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case Name to modify:
    // Configuration>Environment->Domain->Security->SSL->OCSP Properties
    //
    it('8. Test Category: GAT/Risk1\n \t Test Scenario: Modify Environment->Domain->Security->SSL->OCSP Properties Pages', async function () {
        file = "modifyDomainSSLOCSPProp.png";
        try {
            //*[@id="SecurityConfiguration_CertRevoc_OcspNonceEnabled"]/div[1]/div/div
            await domain.modifyDomainSecuritySSLOCSPTab(driver,'SecurityConfiguration_CertRevoc_OcspNonceEnabled',
                'SecurityConfiguration_CertRevoc_OcspResponseCacheEnabled');
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case Name to modify:
    // Configuration>Environment->Domain->Security->SSL->CRL Page Properties
    //
    it('9. Test Category: GAT/Risk1\n \t Test Scenario: Modify Environment->Domain->Security->SSL->CRL Page Properties', async function () {
        file = "modifyDomainSecuritySSLCRProp.png";
        try {
            await domain.modifyDomainSecuritySSLCRLTab(driver,'SecurityConfiguration_CertRevoc_CrlDpEnabled',
                '25','111');
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case Name for modify:
    // Configuration->Environments->Domain->Concurrency Page Properties
    //
    it('10. Test Category: GAT/Risk1\n \t Test Scenario: Modify Environment->Domain->Concurrency Properties Pages', async function () {
        file = "modifyDomainConcurrencyProp.png";
        try {
            await domain.modifyDomainConcurrencyTab(driver,'25','100');
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case Name for modify:
    // Configuration->Environments->Domain->Web Application Page Properties
    //
    it('11. Test Category: GAT/Risk1\n \t Test Scenario: Modify Environment->Domain->Web Application Properties Pages', async function () {
        file = "modifyDomainWebAppProp.png";
        try {
            await domain.modifyDomainWebApplicationTab(driver,'WebAppContainer_ReloginEnabled','WebAppContainer_AllowAllRoles',
                'WebAppContainer_FilterDispatchedRequestsEnabled', 'WebAppContainer_OverloadProtectionEnabled',
                'Full','./config/mimemapping-2.properties',
                'WebAppContainer_OptimisticSerialization', 'WebAppContainer_RtexprvalueJspParamName',
                'WebAppContainer_ClientCertProxyEnabled', 'WebAppContainer_HttpTraceSupportEnabled',
                'WebAppContainer_WeblogicPluginEnabled', 'WebAppContainer_AuthCookieEnabled',
                'WebAppContainer_ChangeSessionIDOnAuthentication','WebAppContainer_WAPEnabled','11','5','555',
                'WebAppContainer_WorkContextPropagationEnabled', 'None','WebAppContainer_JSPCompilerBackwardsCompatible',
                'WebAppContainer_ShowArchivedRealPathEnabled','WebAppContainer_GzipCompression_GzipCompressionEnabled','4444',
                'text/html,text/xml,text/plain,jsp/json,text/yaml','6666','999','75537','26384','147483647');

            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case Name for modify:
    // Configuration->Environments->Domain->Logging Page Properties
    //
    it('12. Test Category: GAT/Risk1\n \t Test Scenario: Modify Environment->Domain->Logging Properties Pages', async function () {
        file = "modifyDomainLoggingProp.png";
        try {
            await domain.modifyDomainLoggingTab(driver,'logs/domain1-1.log','byTime','555','01:05',
                '35','Log_NumberOfFilesLimited','999','./tmp',
                'Log_RotateLogOnStartup','MMM d, y, h:mm:ss,SSS a zzzz',
                '444');
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case Name for modify:
    // Configuration->Environments->Domain->Batch Page Properties
    //
    it.skip('13. Test Category: GAT/Risk1\n \t Test Scenario: Modify Environment->Domain->Batch Properties Pages', async function () {
        file = "modifyDomainBatchProp.png";
        try {
            await domain.modifyDomainBatchTab(driver,'testJNDIName','testSchema','testServiceTemplate');
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

})
