// Create, modify and verify:
// Configuration -> Scheduling
//     Work Managers, Capacities, Context Request Classes, Fair Share Request Classes,
//     Max Threads Constraints, Min Threads Constraints, Response Time Request Classes,
//     Managed Executor Service Templates, Managed Scheduled Executor Service Templates,
//     Managed Thread Factory Templates
//
'use strict';

const {Builder, By, Key, until} = require('selenium-webdriver')
const assert = require('assert')

// Initialize type of browser driver
const getDriver = require('../lib/browser');

// Get AdminServer properties
const Admin = require('../lib/admin');
const browser = require('../lib/admin').browserName;


// Services Configuration Test Suite
describe.only('Test Suite: scheduling_test for Work Managers, Capacities, Context Request Classes, Fair Share Request Classes' +
    'Max Threads Constraints, Min Threads Constraints, Response Time Request Classes, Managed Executor Service Templates' +
    'Managed Scheduled Executor Service Templates, Managed Thread Factory Templates',
  function () {
     let driver;
     let file = "scheduling.png";
     let element;
     let admin;
     let scheduling;
     var sec = 1000;
     this.timeout(800 * sec);

     beforeEach(async function () {
     // Get Browser driver
        driver = getDriver(browser);
        await driver.manage().window().maximize();
        admin = new Admin(driver, file);
     })
     afterEach(async function () {
        await driver.quit();
     })


     //Test Case:
     // Create WorkManager (testWorkManager-1) -> create Work Manager Shutdown Trigger
     // Delete testWorkManager-1
     //
     it.skip('1. Test Category: GAT/Risk1\n \t Test Scenario: create/save/delete testWorkManager-1 ',
        async function () {
        file = "testWorkManager-1.png";
        try {
            await admin.createNewMBeanObject(driver, "testWorkManager-1", 2, "configuration","Scheduling", "Work Managers");
            await admin.createMBeanFromMenuDropDown(driver,"Work Manager Shutdown Trigger");
            await admin.deleteMBeanObject(driver,"testWorkManager-1","WorkManagers",
                2,"configuration", "Scheduling","Work Managers",
                "","","",1);
            console.log("TEST PASS ");
            } catch (e) {
                await admin.takeScreenshot(driver, file);
                console.log(e.toString() + " TEST FAIL");
            }
     })

      //Test Case:
      // Create Capacities (testCapacity-1) -> update AdminServer as Target -> save
      // Delete testCapacity-1
      //
      it('2. Test Category: GAT/Risk1\n \t Test Scenario: create/update/delete testCapacity-1 ',
          async function () {
              file = "testCapacity-1.png";
              try {
                  await admin.createNewMBeanObject(driver, "testCapacity-1", 2, "configuration","Scheduling", "Capacities");
                  await admin.deleteMBeanObject(driver,"testCapacity-1","Capacities", 2,"configuration",
                      "Scheduling","Capacities","","","",2);
                  console.log("TEST PASS ");
              } catch (e) {
                  await admin.takeScreenshot(driver, file);
                  console.log(e.toString() + " TEST FAIL");
              }
      })

      //Test Case:
      // Create Context Request Classes (testContextRequestClass-1) -> update AdminServer as Target -> save
      // Delete testContextRequestClass-1
      //
      it.skip('3. Test Category: GAT/Risk1\n \t Test Scenario: create/update/delete testContextRequestClass-1 ',
          async function () {
              file = "testContextRequestClass-1.png";
              try {
                  await admin.createNewMBeanObject(driver, "testContextRequestClass-1", 2, "configuration","Scheduling", "Context Request Classes");
                  await admin.selectTarget(driver,"AdminServer");
                  await admin.deleteMBeanObject(driver,"testContextRequestClass-1","ContextRequestClasses",2,"configuration",
                      "Scheduling","Context Request Classes","","","",2);
                  console.log("TEST PASS ");
              } catch (e) {
                  await admin.takeScreenshot(driver, file);
                  console.log(e.toString() + " TEST FAIL");
              }
      })

      //Test Case:
      // Create Fair Share Request Classes (testFairShareRequestClass-1) -> update AdminServer as Target -> save
      // Delete testFairShareRequestClass-1
      //
      it.skip('4. Test Category: GAT/Risk1\n \t Test Scenario: create/update/delete testFairShareRequestClass-1 ',
          async function () {
              file = "testFairShareRequestClass-1.png";
              try {
                  await admin.createNewMBeanObject(driver, "testFairShareRequestClass-1", 2, "configuration","Scheduling", "Fair Share Request Classes");
                  await admin.selectTarget(driver,"AdminServer");
                  await admin.deleteMBeanObject(driver,"testFairShareRequestClass-1","FairShareRequestClasses",2,"configuration",
                      "Scheduling","Fair Share Request Classes","","","",2);
                  console.log("TEST PASS ");
              } catch (e) {
                  await admin.takeScreenshot(driver, file);
                  console.log(e.toString() + " TEST FAIL");
              }
      })

      //Test Case:
      // Create Max Threads Constraints (testMaxThreadsConstraint-1) -> update AdminServer as Target -> save
      // Delete testMaxThreadsConstraint-1
      //
      it.skip('5. Test Category: GAT/Risk1\n \t Test Scenario: create/update/delete testMaxThreadsConstraint-1 ',
          async function () {
              file = "testMaxThreadsConstraint-1.png";
              try {
                  await admin.createNewMBeanObject(driver, "testMaxThreadsConstraint-1", 2, "configuration","Scheduling", "Max Threads Constraints");
                  await admin.selectTarget(driver,"AdminServer");
                  await admin.deleteMBeanObject(driver,"testMaxThreadsConstraint-1","MaxThreadsConstraints",2,"configuration",
                      "Scheduling","Max Threads Constraints","","","",2);
                  console.log("TEST PASS ");
              } catch (e) {
                  await admin.takeScreenshot(driver, file);
                  console.log(e.toString() + " TEST FAIL");
              }
      })

      //Test Case:
      // Create Min Threads Constraints (testMinThreadsConstraint-1) -> update AdminServer as Target -> save
      // Delete testMinThreadsConstraint-1
      //
      it('6. Test Category: GAT/Risk1\n \t Test Scenario: create/update/delete testMinThreadsConstraint-1 ',
          async function () {
              file = "testMinThreadsConstraint-1.png";
              try {
                  await admin.createNewMBeanObject(driver, "testMinThreadsConstraint-1", 2, "configuration","Scheduling", "Min Threads Constraints");
                  await admin.selectTarget(driver,"AdminServer");
                  await admin.deleteMBeanObject(driver,"testMinThreadsConstraint-1","MinThreadsConstraints",2,"configuration",
                      "Scheduling","Min Threads Constraints","","","",2);
                  console.log("TEST PASS ");
              } catch (e) {
                  await admin.takeScreenshot(driver, file);
                  console.log(e.toString() + " TEST FAIL");
              }
      })

      //Test Case:
      // Create Response Time Request Classes (testResponseTimeRequestClass-1) -> update AdminServer as Target -> save
      // Delete testResponseTimeRequestClass-1
      // TODO: WC-639
      //
      it.skip('7. Test Category: GAT/Risk1\n \t Test Scenario: create/update/delete testResponseTimeRequestClass-1 ',
          async function () {
              file = "testResponseTimeRequestClass-1.png";
              try {
                  await admin.createNewMBeanObject(driver, "testResponseTimeRequestClass-1", 2, "configuration","Scheduling", "Response Time Request Classes");
                  await admin.selectTarget(driver,"AdminServer");
                  await admin.deleteMBeanObject(driver, "testResponseTimeRequestClass-1", "ResponseTimeRequestClasses", 2,"configuration","Scheduling", "Response Time Request Classes");
              } catch (e) {
                  await admin.takeScreenshot(driver, file);
                  console.log(e.toString() + " TEST FAIL");
              }
      })

      //Test Case:
      // Create Managed Executor Service Templates (testManagedExecutorServiceTemplates-1) -> update AdminServer as Target -> save
      // Delete testManagedExecutorServiceTemplates-1
      //
      it.skip('8. Test Category: GAT/Risk1\n \t Test Scenario: create/update/delete testManagedExecutorServiceTemplates-1 ',
          async function () {
              file = "testManagedExecutorServiceTemplates-1.png";
              try {
                  await admin.createNewMBeanObject(driver, "testManagedExecutorServiceTemplates-1", 2, "configuration","Scheduling", "Managed Executor Service Templates");
                  await admin.selectTarget(driver,"AdminServer");
                  await admin.deleteMBeanObject(driver,"testManagedExecutorServiceTemplate-1","ManagedExecutorServiceTemplates",2,
                      "configuration","Scheduling","Managed Executor Service Templates","","","",1);
                  console.log("TEST PASS ");
              } catch (e) {
                  await admin.takeScreenshot(driver, file);
                  console.log(e.toString() + " TEST FAIL");
              }
      })

      //Test Case:
      // Create Managed Scheduled Executor Service Templates (testManagedScheduledExecutorServiceTemplates-1) -> update AdminServer as Target -> save
      // Delete testManagedScheduledExecutorServiceTemplates-1
      //
      it.skip('9. Test Category: GAT/Risk1\n \t Test Scenario: create/update/delete testManagedExecutorServiceTemplates-1 ',
          async function () {
              file = "testManagedScheduledExecutorServiceTemplates-1.png";
              try {
                  await admin.createNewMBeanObject(driver, "testManagedScheduledExecutorServiceTemplates-1", 2, "configuration",
                      "Scheduling", "Managed Scheduled Executor Service Templates");
                  await admin.selectTarget(driver,"AdminServer");
                  await admin.deleteMBeanObject(driver,"testManagedScheduledExecutorServiceTemplates-1","ManagedScheduledExecutorServiceTemplates",2,
                      "configuration","Scheduling","Managed Scheduled Executor Service Templates","","","",1);
                  console.log("TEST PASS ");
              } catch (e) {
                  await admin.takeScreenshot(driver, file);
                  console.log(e.toString() + " TEST FAIL");
              }
      })

      //Test Case:
      // Create Managed Thread Factory Templates (testManagedThreadFactoryTemplate-1) -> update AdminServer as Target -> save
      // Delete testManagedThreadFactoryTemplate-1
      //
      it('10. Test Category: GAT/Risk1\n \t Test Scenario: create/update/delete testManagedExecutorServiceTemplates-1 ',
          async function () {
              file = "testManagedThreadFactoryTemplate-1.png";
              try {
                  await admin.createNewMBeanObject(driver, "testManagedThreadFactoryTemplate-1", 2, "configuration","Scheduling", "Managed Thread Factory Templates");
                  await admin.selectTarget(driver,"AdminServer");
                  await admin.deleteMBeanObject(driver,"testManagedThreadFactoryTemplates-1","ManagedThreadFactoryTemplates",2,
                      "configuration","Scheduling","Managed Thread Factory Templates","","","",1);
                  console.log("TEST PASS ");
              } catch (e) {
                  await admin.takeScreenshot(driver, file);
                  console.log(e.toString() + " TEST FAIL");
              }
      })

    })
