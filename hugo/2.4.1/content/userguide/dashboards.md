---
title: Generate dashboards
date: 2022-07-26
draft: false
description: How to generate dashboards
weight: 3
---

Dashboards let you quickly assess the state of your WebLogic Server domain. With dashboards, you can assemble a set of criteria (or 'filters') and WebLogic Remote Console will match them against any bean in your domain and return the results. Because you control the filters of the dashboard, you control what you see and can determine the importance of the results, updating the dashboard as needed. 

Dashboards are only available for Administration Server providers (in the Monitoring Tree perspective).

## Filters

Filters in dashboards are the criteria that you use to curate your results. Each filter consists of a name or property from the domain, a value, and an operator.

WebLogic Remote Console limits which filters are available to a dashboard depending on where you are in the WebLogic Remote Console. For example, if you create a dashboard from the *Environment/Servers* node, the property filters are based on the properties in the columns of the Servers table, whereas the property filters in the *Deployments/Application Runtimes* node are based on the properties in the columns of the Application Runtime table.

Values may be in text, numeric or Boolean form depending on the name or property. You cannot add a text value into a numeric filter. Boolean values are displayed as toggles. Set the toggle to On for True, Off for False.

Operators control how a value is assessed. You can filter values using the following operators: *Any, Equals, Not Equals, Contains, Less Than, Less Than or Equals, Greater Than, Greater Than or Equals*. Only the operators that are applicable to a name or property appear as options. By default, all filters are set to *Any* to provide the broadest search parameters.

You only need to add values to the filters that matter to your dashboard. Additionally, filters are cumulative - beans must match ALL of the defined filters to be returned as a result.


## Create a dashboard

1. In the Monitoring Tree perspective of an Administration Server provider, expand a node in the Navigation Tree related to the type of content you want to see. For example, if you want to learn about servers, open the *Environment/Servers* node.
1. Click **New Dashboard**.
1. Enter a name for your new dashboard and then begin specifying the filters that will populate the results of the dashboard.
1. Click **Create** to generate the dashboard.

Click **Customize Table** to show or hide relevant columns in the dashboard.

Click on an entry in the View table to open that bean in the Content Pane.

Any changes to beans will not be reflected in the dashboard until you refresh the page. Click ![Reload icon](/weblogic-remote-console/images/icons/sync-off-icon-blk_24x24.png) **Reload** to update the results. You can also click ![Sync interval icon](/weblogic-remote-console/images/icons/sync-interval-icon-blk_24x24.png) **Auto Reload Interval** to set the dashboard to regularly reload and update the results.

You can return to this dashboard at any time. Previously created dashboards appear under the **Dashboards** node in the Navigation Tree.

## Edit a dashboard

1. In the Navigation Tree, expand **Dashboards** and select the dashboard that you want to edit.
1. In the Content Pane, select the **Edit** tab.
1. Update the filters to match your new requirements.
1. Click **Save**.

## Delete a dashboard

1. In the Navigation Tree, select **Dashboards**.
1. Beside the dashboard that you want to delete, click the ![trash icon](/weblogic-remote-console/images/icons/data-providers-delete-icon-brn_24x24.png) delete icon.

