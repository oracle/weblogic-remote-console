---
weight: 251
title: Scheduling Work
---



You can use Work Managers to prioritize work based on rules that you define and by monitoring actual run time performance statistics to then optimize the performance of your applications.

Work Managers can be applied globally to a WebLogic Server domain.

A Work Manager defines a set of request classes and thread constraints that manage work performed by WebLogic Server.

A request class defines a fair share thread entitlement, a response time goal, or a context policy for a particular class of application request.

Thread constraints define the maximum number of threads to allocate for requests, the minimum number of threads to use for resolving deadlocks, and the total number of requests that can be queued or running before WebLogic Server begins rejecting requests.

See [Using Work Managers to Optimize Scheduled Work](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=CNFGD-GUID-0670CD7C-AC96-46D4-AA43-1F99F21F1CC3) in **Administering Server Environments for Oracle WebLogic Server**.

## Create a Global Work Manager {#GUID-FC4F63E2-4793-4311-8A98-4F9C9D2697BE}

You can create global Work Managers that are used to prioritize thread execution.

1.  In the **Edit Tree**, go to **Scheduling**, then **Work Managers**.

2.  Click **New**.

3.  Enter a name for the new Work Manager and click **Create**.

4.  Update the default values as appropriate.

5.  On the **Targets** tab, select the servers or clusters on which you plan to deploy applications that reference the Work Manager and move them under **Chosen**. Move unwanted servers or clusters under **Available**.

6.  Click **Save**.


Next, you must create at least one request class or constraint. The global Work Manager uses request classes and constraints to determine how to prioritize work. See [Create Request Classes](#GUID-DB4D6BD0-3948-4E6A-ACDC-D9D663C49F03) and [Create Constraints](#GUID-BAE0F946-EEA6-449C-8893-D83BBCD23179).

## Create Request Classes {#GUID-DB4D6BD0-3948-4E6A-ACDC-D9D663C49F03}

Request classes express a scheduling guideline that WebLogic Server uses to allocate threads to requests.

1.  In the **Edit Tree**, go to **Scheduling**, then choose one of the request class types:

    -   **Context Request Classes**
    -   **Fair Share Request Classes**
    -   **Response Time Request Classes**
    For information on the different request class types, see [Request Classes](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=CNFGD-GUID-9C8BC85F-C61D-4DFA-A46E-9558ADF91735) in **Administering Server Environments for Oracle WebLogic Server**.

2.  Click **New**.

3.  Enter a name for the new request class and, for Response Time request classes, update the **Response Time Goal** value.

4.  Click **Create**.

5.  On the **Targets** tab, select the servers or clusters on which you plan to deploy applications that reference this request class and move them under **Chosen**.

    The servers or clusters that you select must share at least one target with the applicable Work Manager.

6.  Click **Save**.


Next, you must assign this request class to a Work Manager to use it. See [Assign a Request Class or Constraints to a Work Manager](#GUID-77305107-4C5F-46CC-83E5-EC0EE3CC238F).

## Create Constraints {#GUID-BAE0F946-EEA6-449C-8893-D83BBCD23179}

A constraint defines the minimum and maximum numbers of threads allocated to execute requests and the total number of requests that can be queued or executing before WebLogic Server begins rejecting requests.

1.  In the **Edit Tree**, go to **Scheduling**, then choose one of the constraint types:

    -   **Capacities**
    -   **Max Threads Constraints**
    -   **Min Threads Constraints**
    For information on the different request class types, see [Constraints](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=CNFGD-GUID-DBFDE1EF-481A-41B9-985F-444EBCD96FF5) in **Administering Server Environments for Oracle WebLogic Server**.

2.  Click **New**.

3.  Enter a name for the new constraint and click **Create**.

4.  Update the default values for the constraint as necessary. Click **Save** when you are done with your changes.

5.  On the **Targets** tab, select the servers or clusters on which you plan to deploy applications that reference this constraint and move them under **Chosen**.

    The servers or clusters that you select must share at least one target with the applicable Work Manager.

6.  Click **Save**.

7.  **Optional**: Repeat to add another type of constraint, if necessary.

    Each Work Manager can contain only one constraint of each type.


Next, you must assign this constraint to a Work Manager to use it. See [Assign a Request Class or Constraints to a Work Manager](#GUID-77305107-4C5F-46CC-83E5-EC0EE3CC238F).

## Assign a Request Class or Constraints to a Work Manager {#GUID-77305107-4C5F-46CC-83E5-EC0EE3CC238F}

Before you can use the settings defined in a request class or constraint, you must assign it to a Work Manager.

{{< alert title="Note" color="primary" >}}



-   **Request Classes**: Each Work Manager can contain only *one* request class, but you can share request classes among multiple Work Managers.

-   **Constraints**: Each Work Manager can contain only one constraint of each *type*, but you can share constraints among multiple Work Managers.


{{< /alert >}}


1.  If you haven't done so already, create a global Work Manager. See [Create a Global Work Manager](#GUID-FC4F63E2-4793-4311-8A98-4F9C9D2697BE).

2.  In the **Edit Tree**, go to **Scheduling**, then **Work Managers** and select the Work Manager where you want to assign the request class or constraints.

3.  Use the applicable drop-down lists to choose a request class or constraints to assign to this Work Manager.

4.  Click **Save**.


## Create a Work Manager Shutdown Trigger {#GUID-46144962-EBE3-428D-AE95-89A3B7505A70}

You can define how a Work Manager should handle stuck threads.

For more information, see [Stuck Thread Handling](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=CNFGD-GUID-63A11D05-8128-40EE-8E52-854BDE516BEE) in **Administering Server Environments for Oracle WebLogic Server**.

1.  If you haven't done so already, create a global Work Manager. See [Create a Global Work Manager](#GUID-FC4F63E2-4793-4311-8A98-4F9C9D2697BE).

2.  In the **Edit Tree**, go to **Scheduling**, then **Work Managers**, then *myWorkManager*, then **Work Manager Shutdown Trigger**.

3.  Click **Create**.

4.  Update the default values as needed.

5.  Click **Save**.


## Concurrent Managed Object Templates {#GUID-F4073670-85D5-4246-A195-966A6C331C02}

WebLogic Server provides concurrency capabilities to Jakarta EE applications by using Concurrent Managed Object \(CMO\) templates to make threads container-managed. You can configure CMO templates and then make them available for use by application components, such as servlets and EJBs.

You can define three types of CMO templates:

-   Managed Executor Service Template - Used by applications to execute submitted tasks asynchronously. See [Create a Global Managed Executor Service Template](#GUID-FF036380-DF70-429B-95EA-A9C962637804).
-   Managed Scheduled Executor Service Template - Used by applications to execute submitted tasks asynchronously at specific times. See [Create a Global Managed Scheduled Executor Service Template](#GUID-8BF9B3FC-6EF0-4097-89A7-E3453CD7BAB1).
-   Managed Thread Factory Template - Used by applications to create managed threads. See [Create a Global Managed Thread Factory Template](#GUID-0FF74BB7-79AE-4DD4-BCD1-9E211140CAC4).

For more information, see [Configuring Concurrent Managed Objects](https://docs.oracle.com/pls/topic/lookup?ctx=en/middleware/fusion-middleware/weblogic-remote-console/administer&id=CNFGD-GUID-9BD68EFA-5614-43F8-BB69-870F55605951) in **Administering Server Environments for Oracle WebLogic Server**.

### Create a Global Managed Executor Service Template {#GUID-FF036380-DF70-429B-95EA-A9C962637804}

You can create managed executor service \(MES\) templates that are used by applications to execute submitted tasks asynchronously.

1.  In the **Edit Tree**, go to **Scheduling**, then **Managed Executor Service Templates**.

2.  Click **New**.

3.  Enter a name for the new MES template.

4.  Click **Create**.

5.  If you want to use a non-default Work Manager with this MES template, in the **Dispatch Policy** field, enter the name of the custom Work Manager.

6.  If you want to specify the priority of the long running daemon thread, update the value in the **Long Running Threads Priority** field.

7.  If you want to define the maximum number of concurrent long-running tasks submitted to this MES template in the domain, update the value in the **Max Concurrent Long Running Requests** field.

8.  Click **Save**.

9.  On the **Targets** tab, select the servers or clusters where this MES template will be accessible and move them under **Chosen**. Move unwanted servers or clusters under **Available**.

    Only applications that have been deployed to the selected servers and clusters can use this MES template.

10. Click **Save**.


### Create a Global Managed Scheduled Executor Service Template {#GUID-8BF9B3FC-6EF0-4097-89A7-E3453CD7BAB1}

You can create managed scheduled executor service \(MSES\) templates that are used by applications to execute submitted tasks asynchronously at specific times.

1.  In the **Edit Tree**, go to **Scheduling**, then **Managed Scheduled Executor Service Templates**.

2.  Click **New**.

3.  Enter a name for the new MSES template.

4.  Click **Create**.

5.  If you want to use a non-default Work Manager with this MSES template, in the **Dispatch Policy** field, enter the name of the custom Work Manager.

6.  If you want to specify the priority of the long running daemon thread, update the value in the **Long Running Threads Priority** field.

7.  If you want to define the maximum number of concurrent long-running tasks submitted to this MSES template in the domain, update the value in the **Max Concurrent Long Running Requests** field.

8.  Click **Save**.

9.  On the **Targets** tab, select the servers or clusters where this MSES template will be accessible and move them under **Chosen**. Move unwanted servers or clusters under **Available**.

    Only applications that have been deployed to the selected servers and clusters can use this MSES template.

10. Click **Save**.


### Create a Global Managed Thread Factory Template {#GUID-0FF74BB7-79AE-4DD4-BCD1-9E211140CAC4}

You can create managed thread factory \(MTF\) templates that are used by applications to create managed threads.

1.  In the **Edit Tree**, go to **Scheduling**, then **Managed Thread Factory Templates**.

2.  Click **New**.

3.  Enter a name for the new MTF template.

4.  Click **Create**.

5.  If you want to specify the priority assigned to the thread, update the value in the **Priority** field. The greater the number, the higher the priority.

6.  If you want to define the maximum number of threads that are created by the MTF and are still executing the <code>run()</code> method of the tasks, update the value in the **Max Concurrent New Threads** field.

7.  Click **Save**.

8.  On the **Targets** tab, select the servers or clusters where this MTF template will be accessible and move them under **Chosen**. Move unwanted servers or clusters under **Available**.

    Only applications that have been deployed to the selected servers and clusters can use this MTF template.

9.  Click **Save**.


