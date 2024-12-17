//
// Monitoring Navtree Test Suite for:
//    Environment
//    Download Log files
//
//
//
const {Builder, By, Key, until} = require('selenium-webdriver')
const assert = require('assert')

// Initialize type of browser driver
const getDriver = require('../lib/browser');

// Get browser and domain properties
const Admin = require('../lib/admin');
const adminUrl = require('../lib/admin').adminUrl;
const browser = require('../lib/admin').browserName;

// NavTree Test Suite
describe.only('Test Suite: monitoring_test for Navtree Monitoring functionality', function () {
    let driver;
    let file = "monitoring.png";
    let serverName = "AdminServer";
    let element;
    var sec = 1000;
    this.timeout(6000 * sec);

    beforeEach(async function () {
        // Get Browser driver
        driver = getDriver(browser);
        await
        driver.manage().window().maximize();
        admin = new Admin(driver, file);
    })
    afterEach(async function () {
        await
        driver.quit();
    })

    //
    // Monitoring(NavTree) -> Environment
    //
    it('1. Test Category: GAT/Risk1\n \t Test Scenario: Monitoring -> Environment -> Servers -> AdminServer', async function () {
        file = "monitoringNavTreeServerAdminTaskMenu.png";
        try {
            await admin.goToNavTreeLevelThreeLink(driver,"monitoring","Environment",
                "Servers","AdminServer");
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring",
                "Environment", "Clustering", "Scaling Tasks");
            await admin.goToNavTreeLevelFourLink(driver, "monitoring",
                "Environment", "System Component Life Cycle Runtimes",
                "SystemComponent-1", "Tasks");
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })


    // Monitoring(NavTree)->Scheduling
    //
    it('2. Test Category: GAT/Risk1\n \t Test Scenario: Monitoring(NavTree) -> Scheduling', async function () {
        file = "monitoringNavTreeSchedulingMenu.png";
        try {
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring",
                "Scheduling", "Execute Queue Runtimes", "weblogic.socket.Muxer");
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring",
                "Scheduling", "Min Threads Constraint Runtimes", "MinThreadsConstraint-1");
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring",
                "Scheduling", "Max Threads Constraint Runtimes", "MaxThreadsConstraint-1");
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring",
                "Scheduling", "Request Class Runtimes", "FairShareRequestClass-1");
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring",
                "Scheduling", "Request Class Runtimes", "ResponseTimeRequestClass-1");
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring",
                "Scheduling", "Work Manager Runtimes", "BEJmsDispatcher");
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring",
                "Scheduling", "Work Manager Runtimes", "CdsAsyncRegistration");
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring",
                "Scheduling", "Work Manager Runtimes", "DataRetirementWorkManager");
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring",
                "Scheduling", "Work Manager Runtimes", "FEJmsDispatcher");
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring",
                "Scheduling", "Work Manager Runtimes", "ImageWorkManager");
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring",
                "Scheduling", "Work Manager Runtimes", "JTACoordinatorWM");
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring",
                "Scheduling", "Work Manager Runtimes", "JmsAsyncQueue");
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring",
                "Scheduling", "Work Manager Runtimes", "OneWayJTACoordinatorWM");
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring",
                "Scheduling", "Concurrent Managed Objects Runtime","Managed Executor Service Runtimes");
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring",
                "Scheduling", "Concurrent Managed Objects Runtime", "Managed Scheduled Executor Service Runtimes");
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring",
                "Scheduling", "Concurrent Managed Objects Runtime", "Managed Thread Factory Runtimes");
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    // Monitoring(NavTree)->Deployments
    //
    it('3. Test Category: GAT/Risk3\n \t Test Scenario: Monitoring(NavTree) for Running Servers -> ' +
                'AdminServer -> Deployments ', async function () {
        file = "monitoringNavTreeServerMetricsAdminDeploymentMenu.png";
        try {
            await admin.goToNavTreeLevelFiveLink(driver,"monitoring","Deployments",
                "Application Runtime Data","medrec","Component Runtimes","AdminServer_/medrec");
            await admin.goToNavTreeLevelSevenLink(driver,"monitoring", "Deployments",
                "Application Runtime Data","physician","Component Runtimes",
                "AdminServer_/medrec/physician","Servlets","Faces Servlet");
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring", "Deployments",
                "Application Management", "jms-local-adp");
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring", "Deployments",
                "Library Runtime Data", "pwdgen");
            await admin.goToNavTreeLevelFiveLink(driver, "monitoring", "Deployments",
                "Library Management", "pwdgen","Per Server States","AdminServer");
            await driver.sleep(600);
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring", "Deployments",
                "Library Management", "pwdgen");
            console.log("Click pwdgen pop down menu");
            await driver.findElement(By.xpath("//*[@id='breadcrumbs-container']/ul/li[2]/oj-menu-button")).click();
            await driver.sleep(600);
            console.log("Select Library Configuration - Edit Tree");
            await driver.findElement(By.xpath("//oj-option[@id='Library Configuration - Edit Tree']/a")).click();
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring",
                "Deployments", "Web Services", "Wsee Wsrm Runtime");
            await admin.goToNavTreeLevelSevenLink(driver, "monitoring", "Deployments",
                "Resource Adapters","Active RAs", "jms-internal-notran-adp",
                "Connection Pools","eis/jms/internal/WLSConnectionFactoryJNDINoTX","Connections");
            await admin.goToNavTreeLevelSevenLink(driver, "monitoring", "Deployments",
                "Resource Adapters","RAs", "jms-internal-notran-adp",
                "Connection Pools", "eis/jms/internal/WLSConnectionFactoryJNDINoTX","Connections");
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    // Monitoring(NavTree)->Services
    //
    it('4. Test Category: GAT/Risk3\n \t Test Scenario: Monitoring(NavTree) for Running Servers -> ' +
           'AdminServer->Services', async function () {
        file = "monitoringNavTreeServerMetricsAdminServicesMenu.png";
        try {
            await admin.goToNavTreeLevelSevenLink(driver, "monitoring", "Services",
                "Messaging","JMS Runtime", "JMS Servers",
                "AdminJMSServer","Destinations","MyAdminJmsModule!AdminJMSServer@MyAdminUniformDistributedQueue");
            await admin.goToNavTreeLevelNineLink(driver, "monitoring", "Services",
                "Messaging","JMS Runtime", "Connections",
                "connection15","Sessions","session41",
                "Consumers","consumer43");
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring", "Services",
                "Data Sources","JDBC Data Source Runtime MBeans");
            await driver.sleep(4800);
            console.log("Click JDBC Data Source Runtime MBeans pop down menu");
            await driver.findElement(By.css(".oj-end")).click();
            await driver.sleep(4800);
            console.log("Select JDBC Data Sources - Configuration View Tree");
            await driver.findElement(By.xpath("//oj-option[@id='JDBC Data Sources - Configuration View Tree']")).click();
            await driver.sleep(4800);
            await admin.goToNavTreeLevelFourLink(driver, "monitoring", "Services",
                "Persistence","Data Access Runtimes","JMSMessageLog/AdminJMSServer");
            console.log("TEST PASS ");
         } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
         } 
     })

    // Monitoring(NavTree)->Security
    //
    it('5. Test Category: GAT/Risk3\n \t Test Scenario: Monitoring AdminServer->Security', async function () {
        file = "monitoringNavTreeServerMetricsAdminSecurityMenu.png";
        try {
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring",
                "Security","Realm Runtimes","myrealm");
            await driver.sleep(600);
            console.log("Click myrealm pop down menu");
            await driver.findElement(By.css(".oj-end")).click();
            await driver.sleep(600);
            console.log("Select Authenticator Runtimes - myrealm menu");
            await driver.findElement(By.xpath("//oj-option[@id='Authenticator Runtimes - myrealm']/a")).click();
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    // Monitoring(NavTree)->Running Servers->AdminServer->Interoperability
    //
    it.skip('6. Test Category: GAT/Risk3\n \t Test Scenario: Monitoring(NavTree) for Running Servers -> ' +
        'AdminServer->Interoperability', async function () {
        file = "monitoringNavTreeServerMetricsAdminInteroperabilityMenu.png";
        try {
            await admin.goToNavTreeLevelFourLink(driver, "monitoring",
                "Running Servers", serverName,"Interoperability","Jolt Runtime");
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    // Monitoring(NavTree)->Diagnostics
    //
    it('7. Test Category: GAT/Risk3\n \t Test Scenario: Monitoring -> Diagnostics', async function () {
        file = "monitoringNavTreeServerMetricsAdminDiagnosticsMenu.png";
        try {
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring", "Diagnostics",
                "Archive Runtimes","JMSMessageLog/AdminJMSServer");
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    // JNDI TreeView ClassName
    // Test if user is able to view and click at ClassName 'weblogic.ejb.container.internal.StatelessEJBHomeImpl'
    // At Monitoring -> Environment -> Servers -> AdminServer -> JNDI Tab (1st Row in the table)
    //
    it('8. Test Category: GAT/Risk1\n \t Test Scenario: Monitoring -> Environment -> Servers -> AdminServer', async function () {
        file = "monitoringAdminServerJNDIClassName.png";
        try {
            await admin.goToNavTreeLevelThreeLink(driver,"monitoring","Environment",
                "Servers","AdminServer");
            await driver.sleep(1200);
            await admin.goToTabName(driver,'JNDI');
            console.log("Able to click JNDI tab");
            console.log("TEST PASS ");
            //FIXME - JNDI Page reload
            /*
            element = driver.findElement(
                By.xpath("//span[text()='weblogic.ejb.container.internal.StatelessEJBHomeImpl']"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            console.log("Click ClassName 'weblogic.ejb.container.internal.StatelessEJBHomeImpl' ");
            await driver.sleep(900);
            if (element.isEnabled()) {
                await element.click();
                console.log("Successfully to view and click at ClassName 'weblogic.ejb.container.internal.StatelessEJBHomeImpl'");
                console.log("TEST PASS ");
                await driver.sleep(1200);
            }
            else {
                console.log("Unable to click at ClassName 'weblogic.ejb.container.internal.StatelessEJBHomeImpl'");
                console.log("TEST FAIL ");
            }
             */
            await driver.sleep(900);
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    // JNDI TreeView Context
    // Test if user is able to view and click at the list of JNDI Context name below from the
    // Monitoring -> Environment -> Servers -> AdminServer -> JNDI Tab
    // AdminJMSServer@com.oracle.medrec.jms, java:global.medrec.medrec-domain-impl, ejb.mgmt, java:global.mejb,...
    //
    it('9. Test Category: GAT/Risk1\n \t Test Scenario: Monitoring -> Environment -> Servers -> AdminServer', async function () {
        file = "monitoringAdminServerJNDIContext.png, java:global.medrec.medrec-domain-impl, weblogic.cluster.migration" +
            "ejb.mgmt, java:global.mejb "
        try {
            await admin.goToNavTreeLevelThreeLink(driver,"monitoring","Environment",
                "Servers","AdminServer");
            await driver.sleep(1200);
            await admin.goToTabName(driver,'JNDI');
            await driver.sleep(4800);
            await driver.executeScript("window.scrollTo(0,0)");
            element = driver.findElement(
                By.xpath("//*[@id='table']"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            console.log("Click at JNDI Table");
            await element.click();
            await driver.sleep(2400);
            element = driver.findElement(
                By.xpath("//span[text()='AdminJMSServer@com.oracle.medrec.jms']"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            console.log("Click at Context 'AdminJMSServer@com.oracle.medrec.jms'");
            await element.click();
            await driver.sleep(2400);
            element = driver.findElement(
                By.xpath("//span[text()='ejb.mgmt']"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            console.log("Click at Context 'ejb.mgmt'");
            await element.click();
            await driver.sleep(2400);
            element = driver.findElement(
                By.xpath("//span[text()='java:global.medrec.medrec-domain-impl']"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            console.log("Click at Context 'java:global.medrec.medrec-domain-impl'");
            await element.click();
            await driver.sleep(2400);
            element = driver.findElement(
                By.xpath("//span[text()='java:global.medrec.medrec-facade-impl']"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            console.log("Click at Context 'java:global.medrec.medrec-facade-impl'");
            await element.click();
            await driver.sleep(2400);
            console.log("Click at Context 'java:global.mejb'");
            if (element.isEnabled()) {
                await element.click();
                console.log("Successfully to view and click at Context 'java:global.mejb'");
                console.log("TEST PASS ");
                await driver.sleep(2400);
            }
            else {
                console.log("Unable to click at Context 'java:global.mejb'");
                console.log("TEST FAIL ");
            }
            await driver.sleep(2400);
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    // Download AdminServer Diagnostic Data Access Runtimes DomainLog.json file
    // Test if user is able to download DomainLog.json from Monitoring -> Environment ->
    // Servers -> AdminServer -> Data Access Runtimes page.
    //
    it('10. Test Category: GAT/Risk1\n \t Test Scenario: Download Monitoring -> Environment -> Servers ' +
        '-> AdminServer -> Logs and Archives -> DomainLog.json file', async function () {
        file = "DownloadAdminServerDomainLogJsonFile.png"
        try {
            await admin.goToNavTreeLevelFourLink(driver,"monitoring","Environment",
                "Servers","AdminServer","Diagnostics");
            await driver.sleep(2400);
            console.log("Click to expand Data Access Runtimes node");
            await driver.findElement(
                By.xpath("//span[text()='Logs and Archives' and @class='oj-navigationlist-item-label']")).click();
            await driver.sleep(1200);
            console.log("Click to select 2nd row / 1st column (DomainLog) of log file table to download");
            await driver.findElement(By.xpath("//oj-table/div//tbody/tr[2]/td[1]")).click();
            await driver.sleep(1200);
            console.log("Click to download DomainLog file");
            await driver.findElement(By.xpath("//oj-button[@id='downloadLogs']")).click();
            await driver.sleep(1200);
            element = driver.findElement(By.css(".oj-fwk-icon-cross"));
            if (element.isEnabled()) {
                await element.click();
            }
            console.log("Check if TypeError dialog appears");
            driver.findElements(
                By.xpath("//oj-message[contains(.,'TypeError') and @class='oj-error oj-complete']")).then((elements) => {
                if (elements.length > 0) {
                    console.log("Fail to download 'DomainLog.json' file");
                    console.log("Test FAIL");
                    throw new Error("TypeError dialog appears");
                    return false;
                } else {
                    console.log("Successfully download and close 'DomainLog.json' file");
                    console.log("Test PASS");
                    return true;
                }
            });
            await driver.sleep(1200);
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })


    // Download DataSourceLog.txt file from Monitoring -> Diagnostics -> WLDF Data Access Runtimes ->
    // DataSourceLog -> AdminServer page
    //
    it('11. Test Category: GAT/Risk1\n \t Test Scenario: Download DataSourceLog.txt file from Monitoring -> ' +
        'Logs and Archives -> DataSourceLog -> AdminServer page', async function () {
        file = "DownloadDataSourceLogTxtFile.png"
        try {
            await admin.goToNavTreeLevelThreeLink(driver,"monitoring","Diagnostics",
                "Logs and Archives","DataSourceLog");
            await driver.sleep(2400);
            console.log("Click to select AdminServer DataAccessRuntime DataSourceLog file");
            await driver.findElement(By.xpath("//oj-table/div/table/tbody/tr/td[1]")).click();
            await driver.sleep(1200);
            console.log("Click to download DomainLog file");
            //await driver.findElement(By.xpath("//oj-button[@id='downloadMenuLauncher']")).click();
            await driver.findElement(By.xpath("//oj-button[@id='downloadLogs']")).click();
            await driver.sleep(1200);
            console.log("Click File Format menu");
            await driver.findElement(By.xpath("//*[@id='FileFormat']/div[2]")).click();
            await driver.sleep(1200);
            console.log("Select file type as Text");
            await driver.findElement(By.xpath("//*[text()='PlainText']")).click();
            await driver.sleep(1200);
            console.log("Click Done button");
            await driver.findElement(By.xpath("//*[@id='[[i18n.buttons.save.id]]']")).click();
            await driver.sleep(1200);
            console.log("Click to close file download location dialog");
            element = driver.findElement(By.css(".oj-button-sm .oj-fwk-icon"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await driver.sleep(2400);
            if (element.isEnabled()) {
                await element.click();
            }
            console.log("Check if TypeError dialog appears");
            driver.findElements(
                By.xpath("//oj-message[contains(.,'TypeError') and @class='oj-error oj-complete']")).then((elements) => {
                if (elements.length > 0) {
                    console.log("Fail to download and close 'AdminServer_DataSourceLog_Date.....txt' file");
                    console.log("Test FAIL");
                    throw new Error("TypeError dialog appears");
                    return false;
                } else {
                    console.log("Successfully download and close 'AdminServer_DataSourceLog_Date.....txt' file");
                    console.log("Test PASS");
                    return true;
                }
            });
            await driver.sleep(1200);
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    // Download AdminServer Diagnostic Logs and Archives EventsDataArchive.txt file
    // Test if user is able to download EventsDataArchive.txt from Monitoring -> Environment ->
    // Servers -> AdminServer ->Logs and Archives page
    //
    it('12. Test Category: GAT/Risk1\n \t Test Scenario: Download Monitoring -> Environment -> Servers ' +
        '-> AdminServer -> Logs and Archives -> EventsDataArchive.txt file', async function () {
        file = "DownloadEventsDataArchiveTxtFile.png"
        try {
            await admin.goToNavTreeLevelFiveLink(driver,"monitoring","Environment",
                "Servers","AdminServer","Diagnostics","Logs and Archives");
            await driver.sleep(2400);
            console.log("Click to select 3rd log file (EventsDataArchive) to download");
            await driver.findElement(By.xpath("//oj-table/div//tbody/tr[3]/td[1]")).click();
            await driver.sleep(1200);
            console.log("Click to download DomainLog file");
            await driver.findElement(By.xpath("//oj-button[@id='downloadLogs']")).click();
            await driver.sleep(1200);
            console.log("Click File Format menu");
            await driver.findElement(By.xpath("//*[@id='FileFormat']/div[2]")).click();
            await driver.sleep(1200);
            console.log("Select file type as Text");
            await driver.findElement(By.xpath("//*[text()='PlainText']")).click();
            console.log("Click Done button");
            await driver.findElement(By.xpath("//*[@id='[[i18n.buttons.save.id]]']")).click();
            await driver.sleep(1200);
            console.log("Click to close file download location dialog");
            element = driver.findElement(By.css(".oj-button-sm .oj-fwk-icon"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await driver.sleep(2400);
            if (element.isEnabled()) {
                await element.click();
            }
            console.log("Check if TypeError dialog appears");
            driver.findElements(
                By.xpath("//oj-message[contains(.,'TypeError') and @class='oj-error oj-complete']")).then((elements) => {
                if (elements.length > 0) {
                    console.log("Fail to download and close 'EventsDataArchive.txt' file");
                    console.log("Test FAIL");
                    throw new Error("TypeError dialog appears");
                    return false;
                } else {
                    console.log("Successfully download and close 'EventsDataArchive.txt' file");
                    console.log("Test PASS");
                    return true;
                }
            });
            await driver.sleep(1200);
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

})
