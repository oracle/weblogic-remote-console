// Copyright (c) 2022, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import javax.ws.rs.NotFoundException;

import weblogic.console.utils.Path;
import weblogic.console.utils.StringUtils;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.repodef.PageActionDef;
import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchResults;
import weblogic.remoteconsole.server.repo.BeanSearchResults;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.CustomBeanSearchResults;
import weblogic.remoteconsole.server.repo.Dashboard;
import weblogic.remoteconsole.server.repo.DashboardManager;
import weblogic.remoteconsole.server.repo.DateValue;
import weblogic.remoteconsole.server.repo.FilteringDashboard;
import weblogic.remoteconsole.server.repo.FilteringDashboardDefManager;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.LongValue;
import weblogic.remoteconsole.server.repo.Page;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.SettableValue;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.repo.Value;
import weblogic.remoteconsole.server.webapp.BaseResource;

/** 
 * Custom code for processing the DashboardMBean
 */
public class DashboardMBeanCustomizer {

  private DashboardMBeanCustomizer() {
  }

  // Determines a dashboard's type
  public static SettableValue getType(InvocationContext ic) {
    String type =
      ic
        .getPageRepo()
        .asPageReaderRepo()
        .getDashboardManager(ic)
        .getDashboard(ic)
        .getResults()
        .getType();
    return new SettableValue(new StringValue(type), false);
  }

  // Creates the JAXRS resource for either the dashboards collection or a dashboard.
  public static BaseResource createResource(InvocationContext ic) {
    if (ic.getBeanTreePath().isCollection()) {
      return new DashboardMBeanCollectionResource();
    } else {
      Dashboard dashboard = getDashboardManager(ic).getDashboardOrNull(ic);
      if (dashboard == null) {
        throw new NotFoundException();
      }
      if (dashboard.isCustomFilteringDashboard()) {
        return new CustomFilteringDashboardMBeanCollectionChildResource();
      } else if (dashboard.isBuiltinFilteringDashboard()) {
        return new BuiltinFilteringDashboardMBeanCollectionChildResource();
      }
      throw new AssertionError("Unknown dashboard: " + dashboard);
    }
  }

  // Customizes the PDJ for creating a custom filtering dashboard.
  public static PageDef customizeCreateFormDef(InvocationContext ic, PageDef uncustomizedPageDef) {
    return FilteringDashboardDefManager.customizeCreateFormDef(ic, uncustomizedPageDef).getResults();
  }

  // Customizes the RDJ for creating a custom filtering dashboard.
  public static void customizeCreateForm(InvocationContext ic, Page page) {
    // Add a link to the corresponding PDJ.
    // The current request includes a 'path' query parameter that indicates
    // the bean to create a custom filtering dashboard for.
    // Get it and add it to the PDJ's url since it needs to know too.
    BeanTreePath btpTemplate = FilteringDashboardDefManager.getBeanTreePathTemplateFromPathQueryParam(ic);
    String pathQueryParam = FilteringDashboardDefManager.computePathQueryParam(btpTemplate);
    page.setBackendRelativePDJURI(page.getBackendRelativePDJURI() + "&" + pathQueryParam);
    // Customize the page's intro to include the type.
    page.setLocalizedIntroductionHTML(
      ic.getLocalizer().localizeString(
        page.getPageDef().getIntroductionHTML(),
        getCustomFilteringDashboardTypeLabel(ic, btpTemplate)
      )
    );
    FilteringDashboardDefManager.customizeCreateForm(ic, page);
  }

  // Return the list of dashboards (so that it can be added to the dashboards table RDJ).
  public static List<BeanSearchResults> getCollection(
    InvocationContext ic,
    BeanTreePath collectionPath,
    BeanReaderRepoSearchResults searchResults,
    List<BeanPropertyDef> propertyDefs
  ) {
    BeanTypeDef typeDef = collectionPath.getTypeDef();
    Map<String,BeanSearchResults> collectionResults = new TreeMap<>();
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
        new StringValue(dashboard.getName())
      );
      beanResults.addPropertyResults(
        typeDef.getPropertyDef(new Path("Type")),
        new StringValue(dashboard.getTypeLabel(ic))
      );
      if (dashboard.isFilteringDashboard()) {
        FilteringDashboard filteringDashboard = dashboard.asFilteringDashboard();
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
      collectionResults.put(dashboardName, beanResults);
    }
    return new ArrayList<>(collectionResults.values());
  }

  // Create a copy of a dashboard
  public static Value copy(
    InvocationContext ic,
    PageActionDef pageActionDef,
    List<FormProperty> formProperties
  ) {
    Dashboard dashboard = 
      ic.getPageRepo().asPageReaderRepo().getDashboardManager(ic).getDashboard(ic).getResults();
    String name = FormProperty.getStringPropertyValue("Name", formProperties, null);
    if (StringUtils.isEmpty(name)) {
      throw
        Response
        .userBadRequestException()
        .addFailureMessage(
          ic.getLocalizer().localizeString(
            LocalizedConstants.REQUIRED_PROPERTY_NOT_SPECIFIED,
            "Name"
          )
        );
    }
    dashboard.copy(ic, name).getResults();
    return null; // TBD return a reference to the copy?
  }

  private static String getCustomFilteringDashboardTypeLabel(InvocationContext ic, BeanTreePath btpTemplate) {
    return
      ic.getLocalizer().localizeString(
        btpTemplate.getLastSegment().getChildDef().getChildTypeDef().getInstanceNameLabel()
      );
  }

  private static DashboardManager getDashboardManager(InvocationContext ic) {
    return ic.getPageRepo().asPageReaderRepo().getDashboardManager(ic);
  }
}
