// Copyright (c) 2022, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import weblogic.console.utils.Path;
import weblogic.console.utils.StringUtils;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.utils.UrlUtils;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.DashboardManager;
import weblogic.remoteconsole.server.repo.FilteringDashboard;
import weblogic.remoteconsole.server.repo.FilteringDashboardDefManager;
import weblogic.remoteconsole.server.repo.FilteringDashboardPathSegment;
import weblogic.remoteconsole.server.repo.FilteringDashboardPathSegmentDef;
import weblogic.remoteconsole.server.repo.FilteringDashboardProperty;
import weblogic.remoteconsole.server.repo.FilteringDashboardPropertyDef;
import weblogic.remoteconsole.server.repo.Form;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Page;
import weblogic.remoteconsole.server.repo.SearchBeanPropertyResults;
import weblogic.remoteconsole.server.repo.SearchBeanResults;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.repo.TableCell;
import weblogic.remoteconsole.server.repo.TableRow;

/** 
 * Custom code for processing CustomFilteringDashboardMBean & BuiltinFilteringDashboardMBean
 */
public class FilteringDashboardMBeanCustomizer {

  private FilteringDashboardMBeanCustomizer() {
  }

  // Customizes the PDJ for configuring the filters for an existing custom filtering dashboard.
  public static PageDef customizeFiltersSliceDef(InvocationContext ic, PageDef uncustomizedPageDef) {
    return FilteringDashboardDefManager.customizeFiltersSliceDef(ic, uncustomizedPageDef).getResults();
  }

  // Customize the PDJ for viewing the results (i.e. filtered beans) of an existing filtering dashboard.
  public static PageDef customizeViewSliceDef(InvocationContext ic, PageDef uncustomizedPageDef) {
    return FilteringDashboardDefManager.customizeViewSliceDef(ic, uncustomizedPageDef).getResults();
  }

  // Customizes the RDJ for configuring the filters for an existing custom filtering dashboard.
  public static void customizeFiltersSlice(InvocationContext ic, Page page) {
    // Get the dashboard (if it exists)
    FilteringDashboard dashboard = getDashboardManager(ic).getDashboard(ic).getResults().asFilteringDashboard();
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
    String pathQueryParam = FilteringDashboardDefManager.computePathQueryParam(btpTemplate);
    page.setBackendRelativePDJURI(page.getBackendRelativePDJURI() + "&" + pathQueryParam);
    // Get the PDJ for this dashboard.  It includes all of the properties that
    // the user can use to filter the beans this dashboard returns.
    Form form = page.asForm();
    form.setExists(true);
    // Make it easy to find these properties by name:
    Map<String,PagePropertyDef> nameToPagePropertyDef = new HashMap<>();
    for (PagePropertyDef pagePropertyDef : page.getPageDef().getAllPropertyDefs()) {
      nameToPagePropertyDef.put(pagePropertyDef.getFormFieldName(), pagePropertyDef);
    }
    // There always should be a name and description property.
    form.getProperties().add(
      new FormProperty(
        nameToPagePropertyDef.get("Name"),
        new StringValue(dashboard.getName())
      )
    );
    form.getProperties().add(
      new FormProperty(
        nameToPagePropertyDef.get("Description"),
        new StringValue(dashboard.getDescription())
      )
    );
    // Loop over the path segments that are used to locate the beans this dashboard can return.
    for (FilteringDashboardPathSegment segment : dashboard.getConfig().getPath()) {
      FilteringDashboardPathSegmentDef segmentDef = segment.getSegmentDef();
      if (segmentDef.isFilterable()) {
        // This segment is filterable (e.g. a collection's children can be filtered by name).
        // Add properties for filtering this segment (criteria & value).
        form.getProperties().add(
          new FormProperty(
            nameToPagePropertyDef.get(segmentDef.getCriteriaPropertyDef().getFormFieldName()),
            new StringValue(segment.getCriteria())
          )
        );
        form.getProperties().add(
          new FormProperty(
            nameToPagePropertyDef.get(segmentDef.getValuePropertyDef().getFormFieldName()),
            new StringValue(segment.getValue())
          )
        );
      }
    }
    // Loop over the properties of the beans this dashboard can return
    for (FilteringDashboardProperty property : dashboard.getConfig().getProperties()) {
      // Add properties for filtering this mbean property (criteria & value).
      FilteringDashboardPropertyDef propertyDef = property.getPropertyDef();
      form.getProperties().add(
        new FormProperty(
          nameToPagePropertyDef.get(propertyDef.getCriteriaPropertyDef().getFormFieldName()),
          new StringValue(property.getCriteria())
        )
      );
      form.getProperties().add(
        new FormProperty(
          nameToPagePropertyDef.get(propertyDef.getValuePropertyDef().getFormFieldName()),
          property.getValue()
        )
      );
    }
  }

  // Customizes the RDJ for returning the filtered beans for an existing filtering dashboard.
  public static void customizeViewSlice(InvocationContext ic, Page page) {
    // Get the dashboard name from the request then get the corresonding dashboard's current results
    // (i.e. the currently existing beans that pass the dashboard's filters).
    String dashboardName = ic.getBeanTreePath().getLastSegment().getKey();
    FilteringDashboard dashboard =
      getDashboardManager(ic)
        .getFilteringDashboardSearchResults(ic, page.getPageDef(), dashboardName)
        .getResults();
    BeanTreePath btpTemplate = dashboard.getConfig().getDashboardDef().getBeanTreePathTemplate();
    // Customize the page's intro to include the type and results date.
    page.setLocalizedIntroductionHTML(
      ic.getLocalizer().localizeString(
        page.getPageDef().getIntroductionHTML(),
        getDashboardDescription(dashboard.getDescriptionLabel(ic), ic, btpTemplate)
      )
    );
    // Add a link to the corresponding PDJ.
    // Add a 'path' query param that specifies the dashboard's bean tree path template
    // Add a 'dashboard' query param that specifies the dashboard's name
    page.setBackendRelativePDJURI(
      page.getBackendRelativePDJURI()
      //+ "&" + FilteringDashboardDefManager.computePathQueryParam(btpTemplate)
      + "&" + UrlUtils.computeQueryParam("dashboard", dashboard.getName())
    );
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
      List<FilteringDashboardPathSegmentDef> segmentDefs =
        dashboard.getConfig().getDashboardDef().getPathDef();
      Path sortingKey = new Path();
      for (int i = 0; i < segmentDefs.size(); i++) {
        FilteringDashboardPathSegmentDef segmentDef = segmentDefs.get(i);
        if (segmentDef.isFilterable()) {
          // Add this segment's key to the beginning of the sorting key.
          String key = btp.getSegments().get(i).getKey();
          sortingKey.getComponents().add(0, key);
          // Add this segment's key to the results
          row.getCells().add(
            new TableCell(
              segmentDef.getResultPropertyDef().getFormFieldName(),
              new StringValue(key)
            )
          );
        }
      }
      // Add a cell for each of this bean's property values
      for (SearchBeanPropertyResults propertyResults : beanResults.getPropertiesResults()) {
        row.getCells().add(
          new TableCell(
            propertyResults.getPropertyDef().getFormFieldName(),
            propertyResults.getValue()
          )
        );
      }
      // Add the row for this bean to the sorter.
      sorter.put(sortingKey, row);
    }
    // Add the sorted rows to the RDJ
    page.asTable().getRows().addAll(sorter.values());
  }

  private static String getDashboardDescription(
    String customDescription,
    InvocationContext ic,
    BeanTreePath btpTemplate
  ) {
    if (StringUtils.isEmpty(customDescription)) {
      return
        ic.getLocalizer().localizeString(
          LocalizedConstants.FILTERING_DASHBOARD_DEFAULT_DESCRIPTION,
          getDashboardTypeLabel(ic, btpTemplate)
        );
    } else {
      return customDescription;
    }
  }

  private static String getDashboardTypeLabel(InvocationContext ic, BeanTreePath btpTemplate) {
    return
      ic.getLocalizer().localizeString(
        btpTemplate.getLastSegment().getChildDef().getChildTypeDef().getInstanceNameLabel()
      );
  }

  private static DashboardManager getDashboardManager(InvocationContext ic) {
    return ic.getPageRepo().asPageReaderRepo().getDashboardManager(ic);
  }
}
