// NavTree Element Test Suite
const {Builder, By, Key, until} = require('selenium-webdriver')
const assert = require('assert')

// Initialize type of browser driver
const getDriver = require('../lib/browser');

// Get navtreeServer properties
const Admin = require('../lib/admin');
const adminUrl = require('../lib/admin').adminUrl;
const browser = require('../lib/admin').browserName;

// NavTree Test Suite
describe.only('Test Suite: navtree3_test for Navtree Test-Suite', function () {
    let driver;
    let file = "snapStripTree.png";
    let element;
    var sec = 1000;
    this.timeout(7000 * sec);

    beforeEach(async function () {
        // Get Browser driver
        driver = getDriver(browser);
        await driver.manage().window().maximize();
        admin = new Admin(driver, file);
    })
    afterEach(async function () {
        await driver.quit();
    })

    //
    //  NavTree: Configuration -> Scheduling sub-Menu Elements:
    //      WorkManagers, Capacities, ContextRequestClasses, FairShareRequestClasses, MaxThreadsConstraints,
    //      MinThreadsConstraints, SchedulingResponseTimeRequestClasses, ManagedExecutorServiceTemplates,
    //      ManagedScheduledExecutorServiceTemplates, ManagedThreadFactoryTemplates
    //
    it('5. Test Category: GAT/Risk1\n \t Test Scenario: NavTree Configuration->Scheduling Sub-Menu Elements Test', async function () {
        file = "navTreeScheduling.png";
        try {
            //Create WorkManager-1,WorkManager-1,FairShareRequestClass-1,MaxThreadsConstraint-1,MinThreadsConstraint-1,
            //       ContextRequestClass-1,ResponseTimeRequestClass-1,ManagedExecutorServiceTemplate-1
            await admin.createNewMBeanObject(driver,"TestWorkManager-1",2,"configuration","Scheduling","Work Managers");
            await admin.createNewMBeanObject(driver,"TestCapacity-1",2,"configuration","Scheduling","Capacities");
            await admin.createNewMBeanObject(driver,"TestFairShareRequestClass-1",2,"configuration","Scheduling","Fair Share Request Classes");
            await admin.createNewMBeanObject(driver,"TestContextRequestClass-1",2,"configuration","Scheduling","Context Request Classes");
            await admin.createNewMBeanObject(driver,"TestContextCase-1",4,"configuration","Scheduling",
                "Context Request Classes","TestContextRequestClass-1","Context Cases");
            await admin.createNewMBeanObject(driver,"TestMaxThreadsConstraint-1",2,"configuration","Scheduling","Max Threads Constraints");
            await admin.createNewMBeanObject(driver,"TestMinThreadsConstraint-1",2,"configuration","Scheduling","Min Threads Constraints");
            //TODO BUG?
            //await admin.createNewMBeanObject(driver,"TestResponseTimeRequestClass-1",2,"configuration","Scheduling",
            //    "Response Time Request Classes");
            await admin.createNewMBeanObject(driver,"TestManagedExecutorServiceTemplate-1",2,"configuration","Scheduling",
                "Managed Executor Service Templates");
            await admin.createNewMBeanObject(driver,"TestManagedScheduledExecutorServiceTemplates-1",2,"configuration",
                "Scheduling","Managed Scheduled Executor Service Templates");
            await admin.createNewMBeanObject(driver,"TestManagedThreadFactoryTemplates-1",2,"configuration",
                "Scheduling","Managed Thread Factory Templates");
            //Test to access to the form page
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Scheduling","Work Managers","TestWorkManager-1");
            await admin.goToNavTreeLevelFourLink(driver,"configuration","Scheduling","Work Managers","Capacities","TestCapacity-1");
            await admin.goToNavTreeLevelFourLink(driver,"configuration","Scheduling","Work Managers","TestWorkManager-1",
                "Work Manager Shutdown Trigger");
            await admin.goToNavTreeLevelFiveLink(driver,"configuration","Scheduling","Context Request Classes",
                "TestContextRequestClass-1","Context Cases","TestContextCase-1");
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Scheduling","Fair Share Request Classes",
                "TestFairShareRequestClass-1");
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Scheduling","Max Threads Constraints",
                "TestMaxThreadsConstraint-1");
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Scheduling","Min Threads Constraints",
                "TestMinThreadsConstraint-1");
            //await admin.goToNavTreeLevelThreeLink(driver,"configuration","Scheduling","Response Time Request Classes",
            //    "ResponseTimeRequestClass-1");
            await admin.goToNavTreeLevelTwoLink(driver,"configuration","Scheduling","Managed Executor Service Templates");
            await admin.goToNavTreeLevelTwoLink(driver,"configuration","Scheduling","Managed Scheduled Executor Service Templates");
            await admin.goToNavTreeLevelTwoLink(driver,"configuration","Scheduling","Managed Thread Factory Templates");

            //Delete WorkManager-2,FairShareRequestClass-1,MaxThreadsConstraint-1,MinThreadsConstraint-1,
            //       ContextRequestClass-1,ResponseTimeRequestClass-1,ManagedExecutorServiceTemplate-1,
            await admin.deleteMBeanObject(driver,"TestWorkManager-1","WorkManagers",2,"configuration",
                "Scheduling","Work Managers","","","",1);
            await admin.deleteMBeanObject(driver,"TestCapacity-1","Capacities",2,"configuration",
                "Scheduling","Capacities","","","",2);
            await admin.deleteMBeanObject(driver,"TestFairShareRequestClass-1","FairShareRequestClasses",2,"configuration",
                "Scheduling","Fair Share Request Classes","","","",2);
            await admin.deleteMBeanObject(driver,"TestContextRequestClass-1","ContextRequestClasses",2,"configuration",
                "Scheduling","Context Request Classes","","","",2);
            await admin.deleteMBeanObject(driver,"TestMaxThreadsConstraint-1","MaxThreadsConstraints",2,"configuration",
                "Scheduling","Max Threads Constraints","","","",2);
            await admin.deleteMBeanObject(driver,"TestMinThreadsConstraint-1","MinThreadsConstraints",2,"configuration",
                "Scheduling","Min Threads Constraints","","","",2);
            //await admin.deleteMBeanObject(driver,"ResponseTimeRequestClass-1","ResponseTimeRequestClasses",2,
            //    "configuration","Scheduling","Response Time Request Classes");
            await admin.deleteMBeanObject(driver,"TestManagedExecutorServiceTemplate-1","ManagedExecutorServiceTemplates",2,
                "configuration","Scheduling","Managed Executor Service Templates","","","",1);
            await admin.deleteMBeanObject(driver,"TestManagedScheduledExecutorServiceTemplates-1","ManagedScheduledExecutorServiceTemplates",2,
                "configuration","Scheduling","Managed Scheduled Executor Service Templates","","","",1);
            await admin.deleteMBeanObject(driver,"TestManagedThreadFactoryTemplates-1","ManagedThreadFactoryTemplates",2,
                "configuration","Scheduling","Managed Thread Factory Templates","","","",1);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })
})
