// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.CustomFilteringDashboard;
import weblogic.remoteconsole.server.repo.CustomFilteringDashboardDefManager;
import weblogic.remoteconsole.server.repo.CustomFilteringDashboardPathSegment;
import weblogic.remoteconsole.server.repo.CustomFilteringDashboardPathSegmentDef;
import weblogic.remoteconsole.server.repo.CustomFilteringDashboardProperty;
import weblogic.remoteconsole.server.repo.CustomFilteringDashboardPropertyDef;
import weblogic.remoteconsole.server.repo.Dashboard;
import weblogic.remoteconsole.server.repo.DashboardManager;
import weblogic.remoteconsole.server.repo.Form;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Page;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.SearchBeanPropertyResults;
import weblogic.remoteconsole.server.repo.SearchBeanResults;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.repo.TableCell;
import weblogic.remoteconsole.server.repo.TableRow;

/** 
 * Custom code for processing CustomFilteringDashboardMBean
 */
public class CustomFilteringDashboardMBeanCustomizer {

  private CustomFilteringDashboardMBeanCustomizer() {
  }

  // Customizes the PDJ for configuring the filters for an existing custom filtering dashboard.
  public static Response<PageDef> customizeEditSliceDef(InvocationContext ic, PageDef uncustomizedPageDef) {
    return CustomFilteringDashboardDefManager.customizeEditSliceDef(ic, uncustomizedPageDef);
  }

  // Customize the PDJ for viewing the results (i.e. filtered beans) of an existing custom  filtering dashboard.
  public static Response<PageDef> customizeViewSliceDef(InvocationContext ic, PageDef uncustomizedPageDef) {
    return CustomFilteringDashboardDefManager.customizeViewSliceDef(ic, uncustomizedPageDef);
  }

  // Customizes the RDJ for configuring the filters for an existing custom filtering dashboard.
  public static Response<Void> customizeEditSlice(InvocationContext ic, Page page) {
    Response<Void> response = new Response<>();
    // Get the dashboard (if it exists)
    Response<Dashboard> getResponse = getDashboardManager(ic).getDashboard(ic);
    if (!getResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(getResponse);
    }
    CustomFilteringDashboard dashboard = getResponse.getResults().asCustomFilteringDashboard();
    BeanTreePath btpTemplate = dashboard.getConfig().getDashboardDef().getBeanTreePathTemplate();
    // Customize the page's intro to include the type.
    page.setLocalizedIntroductionHTML(
      ic.getLocalizer().localizeString(
        page.getPageDef().getIntroductionHTML(),
        getDashboardTypeLabel(ic, btpTemplate)
      )
    );
    // Create the 'path' query param that indicates the unfiltered beans this dashboard can
    // return and use it to add a PDJ link to the RDJ.
    String pathQueryParam = CustomFilteringDashboardDefManager.computePathQueryParam(btpTemplate);
    page.setBackendRelativePDJURI(page.getBackendRelativePDJURI() + "&" + pathQueryParam);
    // Get the PDJ for this dahboard.  It includes all of the properties that
    // the user can use to filter the beans this dashboard returns.
    Form form = page.asForm();
    form.setExists(true);
    // Make it easy to find these properties by name:
    Map<String,PagePropertyDef> nameToPagePropertyDef = new HashMap<>();
    for (PagePropertyDef pagePropertyDef : page.getPageDef().getAllPropertyDefs()) {
      nameToPagePropertyDef.put(pagePropertyDef.getFormPropertyName(), pagePropertyDef);
    }
    // There always should be a name property.
    form.getProperties().add(
      new FormProperty(
        nameToPagePropertyDef.get("Name"),
        new StringValue(dashboard.getName())
      )
    );
    // Loop over the path segments that are used to locate the beans this dashboard can return.
    for (CustomFilteringDashboardPathSegment segment : dashboard.getConfig().getPath()) {
      CustomFilteringDashboardPathSegmentDef segmentDef = segment.getSegmentDef();
      if (segmentDef.isFilterable()) {
        // This segment is filterable (e.g. a collection's children can be filtered by name).
        // Add properties for filtering this segment (criteria & value).
        form.getProperties().add(
          new FormProperty(
            nameToPagePropertyDef.get(segmentDef.getCriteriaPropertyDef().getFormPropertyName()),
            new StringValue(segment.getCriteria())
          )
        );
        form.getProperties().add(
          new FormProperty(
            nameToPagePropertyDef.get(segmentDef.getValuePropertyDef().getFormPropertyName()),
            new StringValue(segment.getValue())
          )
        );
      }
    }
    // Loop over the properties of the beans this dashboard can return
    for (CustomFilteringDashboardProperty property : dashboard.getConfig().getProperties()) {
      // Add properties for filtering this mbean property (criteria & value).
      CustomFilteringDashboardPropertyDef propertyDef = property.getPropertyDef();
      form.getProperties().add(
        new FormProperty(
          nameToPagePropertyDef.get(propertyDef.getCriteriaPropertyDef().getFormPropertyName()),
          new StringValue(property.getCriteria())
        )
      );
      form.getProperties().add(
        new FormProperty(
          nameToPagePropertyDef.get(propertyDef.getValuePropertyDef().getFormPropertyName()),
          property.getValue()
        )
      );
    }
    return response.setSuccess(null);
  }

  // Customizes the RDJ for returning the filtered beans for an existing custom filtering dashboard.
  public static Response<Void> customizeViewSlice(InvocationContext ic, Page page) {
    Response<Void> response = new Response<>();
    // Get the dashboard name from the request then get the corresonding dashboard's current results
    // (i.e. the currently existing beans that pass the dashboard's filters).
    String dashboardName = ic.getBeanTreePath().getLastSegment().getKey();
    Response<CustomFilteringDashboard> resultsResponse =
      getDashboardManager(ic).getCustomFilteringDashboardSearchResults(ic, page.getPageDef(), dashboardName);
    if (!resultsResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(resultsResponse);
    }
    CustomFilteringDashboard dashboard = resultsResponse.getResults();
    BeanTreePath btpTemplate = dashboard.getConfig().getDashboardDef().getBeanTreePathTemplate();
    // Customize the page's intro to include the type and results date.
    page.setLocalizedIntroductionHTML(
      ic.getLocalizer().localizeString(
        page.getPageDef().getIntroductionHTML(),
        getDashboardTypeLabel(ic, btpTemplate),
        ic.getLocalizer().formatDate(dashboard.getResultsDate())
      )
    );
    // Add a link to the corresponding PDJ.
    String pathQueryParam = CustomFilteringDashboardDefManager.computePathQueryParam(btpTemplate);
    page.setBackendRelativePDJURI(page.getBackendRelativePDJURI() + "&" + pathQueryParam);
    // Sort the returned beans by the names in their bean tree paths, in reverse order.
    // For example, if the matching beans are:
    //   Servers/Server1/NetworAccessPoints/Channl3
    //   Servers/Server2/NetworkAccessPoints/Channel3
    //   Servers/Server2/NetworkAccessPoints/Channel2
    // then they are returned in this order:
    //   Servers/Server2/NetworkAccessPoints/Channel2 (Channel2/Server2)
    //   Servers/Server1/NetworAccessPoints/Channl3   (Channel3/Server1)
    //   Servers/Server2/NetworkAccessPoints/Channel3 (Channel3/Server2)
    Map<Path,TableRow> sorter = new TreeMap<>();
    // Loop over all of the currently existing beans that pass ths dashboard's filters,
    // adding a row for each bean.
    for (SearchBeanResults beanResults : dashboard.getResults()) {
      TableRow row = new TableRow();
      BeanTreePath btp = beanResults.getBeanTreePath();
      row.getCells().add(new TableCell("identity", btp));
      // Loop over this bean's bean tree path.
      // Use it to track the bean's sorting key and to add
      // cells for the bean names in the bean tree path.
      List<CustomFilteringDashboardPathSegmentDef> segmentDefs =
        dashboard.getConfig().getDashboardDef().getPathDef();
      Path sortingKey = new Path();
      for (int i = 0; i < segmentDefs.size(); i++) {
        CustomFilteringDashboardPathSegmentDef segmentDef = segmentDefs.get(i);
        if (segmentDef.isFilterable()) {
          // Add this segment's key to the beginning of the sorting key.
          String key = btp.getSegments().get(i).getKey();
          sortingKey.getComponents().add(0, key);
          // Add this segment's key to the results
          row.getCells().add(
            new TableCell(
              segmentDef.getResultPropertyDef().getFormPropertyName(),
              new StringValue(key)
            )
          );
        }
      }
      // Add a cell for each of this bean's property values
      for (SearchBeanPropertyResults propertyResults : beanResults.getPropertiesResults()) {
        row.getCells().add(
          new TableCell(
            propertyResults.getPropertyDef().getFormPropertyName(),
            propertyResults.getValue()
          )
        );
      }
      // Add the row for this bean to the sorter.
      sorter.put(sortingKey, row);
    }
    // Add the sorted rows to the RDJ
    page.asTable().getRows().addAll(sorter.values());
    return response.setSuccess(null);
  }

  private static String getDashboardTypeLabel(InvocationContext ic, BeanTreePath btpTemplate) {
    return
      ic.getLocalizer().localizeString(
        btpTemplate.getLastSegment().getChildDef().getChildTypeDef().getInstanceNameLabel()
      );
  }

  private static DashboardManager getDashboardManager(InvocationContext ic) {
    return ic.getPageRepo().asPageReaderRepo().getDashboardManager();
  }
}
