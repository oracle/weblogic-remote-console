// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.ArrayList;
import java.util.List;

import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchResults;
import weblogic.remoteconsole.server.repo.BeanSearchResults;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.CustomBeanSearchResults;
import weblogic.remoteconsole.server.repo.CustomFilteringDashboard;
import weblogic.remoteconsole.server.repo.CustomFilteringDashboardDefManager;
import weblogic.remoteconsole.server.repo.Dashboard;
import weblogic.remoteconsole.server.repo.DashboardManager;
import weblogic.remoteconsole.server.repo.DateValue;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.LongValue;
import weblogic.remoteconsole.server.repo.Page;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.SettableValue;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.webapp.BaseResource;

/** 
 * Custom code for processing the DashboardMBean
 */
public class DashboardMBeanCustomizer {

  private DashboardMBeanCustomizer() {
  }

  // Determines a dashboard's type
  public static Response<SettableValue> getType(InvocationContext ic) {
    Response<SettableValue> response = new Response<>();
    Response<Dashboard> dashboardResponse =
      ic.getPageRepo().asPageReaderRepo().getDashboardManager().getDashboard(ic);
    if (!dashboardResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(dashboardResponse);
    }
    String type = dashboardResponse.getResults().getType();
    response.setSuccess(new SettableValue(new StringValue(type), false));
    return response;
  }

  // Creates the JAXRS resource for either the dashboards collection or a dashboard.
  public static BaseResource createResource(InvocationContext ic) {
    if (ic.getBeanTreePath().isCollection()) {
      return new DashboardMBeanCollectionResource();
    } else {
      // When this collection becomes truly heterogeneous,
      // find the type for the collection child and create
      // the corresponding resource for that type:
      // Can we just fetch its type def?
      return new CustomFilteringDashboardMBeanCollectionChildResource();
    }
  }

  // Customizes the PDJ for creating a custom filtering dashboard.
  public static Response<PageDef> customizeCreateFormDef(InvocationContext ic, PageDef uncustomizedPageDef) {
    return CustomFilteringDashboardDefManager.customizeCreateFormDef(ic, uncustomizedPageDef);
  }

  // Customizes the RDJ for creating a custom filtering dashboard.
  public static Response<Void> customizeCreateForm(InvocationContext ic, Page page) {
    Response<Void> response = new Response<>();
    // Add a link to the corresponding PDJ.
    // The current request includes a 'path' query parameter that indicates
    // the bean to create a custom filtering dashboard for.
    // Get it and add it to the PDJ's url since it needs to know too.
    BeanTreePath btpTemplate = CustomFilteringDashboardDefManager.getBeanTreePathTemplateFromPathQueryParam(ic);
    String pathQueryParam = CustomFilteringDashboardDefManager.computePathQueryParam(btpTemplate);
    page.setBackendRelativePDJURI(page.getBackendRelativePDJURI() + "&" + pathQueryParam);
    // Customize the page's intro to include the type.
    page.setLocalizedIntroductionHTML(
      ic.getLocalizer().localizeString(
        page.getPageDef().getIntroductionHTML(),
        getCustomFilteringDashboardTypeLabel(ic, btpTemplate)
      )
    );
    CustomFilteringDashboardDefManager.customizeCreateForm(ic, page);
    return response.setSuccess(null);
  }

  // Return the list of dashboards (so that it can be added to the dashboards table RDJ).
  public static Response<List<BeanSearchResults>> getCollection(
    InvocationContext ic,
    BeanTreePath collectionPath,
    BeanReaderRepoSearchResults searchResults,
    List<BeanPropertyDef> propertyDefs
  ) {
    BeanTypeDef typeDef = collectionPath.getTypeDef();
    List<BeanSearchResults> collectionResults = new ArrayList<>();
    // Loop over the dashboards
    for (Dashboard dashboard : getDashboardManager(ic).getDashboards(ic)) {
      // Compute the dashboard's identity
      String dashboardName = dashboard.getName();
      BeanTreePath childPath =
        BeanTreePath.create(
          collectionPath.getBeanRepo(),
          collectionPath.getPath().childPath(dashboardName)
        );
      // Create the results to return for this dashboard
      CustomBeanSearchResults beanResults = new CustomBeanSearchResults(searchResults, childPath);
      // Add its identity and name
      beanResults.addPropertyResults(
        typeDef.getIdentityPropertyDef(),
        childPath
      );
      beanResults.addPropertyResults(
        typeDef.getPropertyDef(new Path("Name")),
        new StringValue(dashboardName)
      );
      beanResults.addPropertyResults(
        typeDef.getPropertyDef(new Path("Type")),
        new StringValue(dashboard.getTypeLabel(ic))
      );
      if (dashboard.isCustomFilteringDashboard()) {
        CustomFilteringDashboard filteringDashboard = dashboard.asCustomFilteringDashboard();
        if (filteringDashboard.getResults() != null) {
          boolean includeSubTypes = true;
          // We've done this search earlier
          // Return when it was last done and how many matches there were
          beanResults.addPropertyResults(
            typeDef.getPropertyDef(new Path("Date"), includeSubTypes),
            new DateValue(filteringDashboard.getResultsDate())
          );
          beanResults.addPropertyResults(
            typeDef.getPropertyDef(new Path("NumberOfMatches"), includeSubTypes),
            new LongValue(filteringDashboard.getResults().size())
          );
        } else {
          // We haven't done this search yet (i.e. it's been created but not displayed yet)
        }
      } else {
        throw new AssertionError("Unsupported dashboard : " + dashboard.getName() + " " + dashboard.getClass());
      }
      collectionResults.add(beanResults);
    }
    return new Response<List<BeanSearchResults>>().setSuccess(collectionResults);
  }

  private static String getCustomFilteringDashboardTypeLabel(InvocationContext ic, BeanTreePath btpTemplate) {
    return
      ic.getLocalizer().localizeString(
        btpTemplate.getLastSegment().getChildDef().getChildTypeDef().getInstanceNameLabel()
      );
  }

  private static DashboardManager getDashboardManager(InvocationContext ic) {
    return ic.getPageRepo().asPageReaderRepo().getDashboardManager();
  }
}
