// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchResults;
import weblogic.remoteconsole.server.repo.BeanSearchResults;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.CustomBeanSearchResults;
import weblogic.remoteconsole.server.repo.CustomView;
import weblogic.remoteconsole.server.repo.CustomViewDefManager;
import weblogic.remoteconsole.server.repo.CustomViewManager;
import weblogic.remoteconsole.server.repo.CustomViewPathSegment;
import weblogic.remoteconsole.server.repo.CustomViewPathSegmentDef;
import weblogic.remoteconsole.server.repo.CustomViewProperty;
import weblogic.remoteconsole.server.repo.CustomViewPropertyDef;
import weblogic.remoteconsole.server.repo.DateValue;
import weblogic.remoteconsole.server.repo.Form;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.LongValue;
import weblogic.remoteconsole.server.repo.Page;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.SearchBeanPropertyResults;
import weblogic.remoteconsole.server.repo.SearchBeanResults;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.repo.TableCell;
import weblogic.remoteconsole.server.repo.TableRow;
import weblogic.remoteconsole.server.webapp.BaseResource;

/** 
 * Custom code for processing CustomViewMBean
 */
public class CustomViewMBeanCustomizer {

  private CustomViewMBeanCustomizer() {
  }

  // Creates the JAXRS resource for either the custom views collection or a custom view.
  public static BaseResource createResource(InvocationContext ic) {
    if (ic.getBeanTreePath().isCollection()) {
      return new CustomViewMBeanCollectionResource();
    } else {
      return new CustomViewMBeanCollectionChildResource();
    }
  }

  // Customizes the PDJ for creating a custom view for a bean.
  public static Response<PageDef> customizeCreateFormDef(InvocationContext ic, PageDef uncustomizedPageDef) {
    return CustomViewDefManager.customizeCreateFormDef(ic, uncustomizedPageDef);
  }

  // Customizes the PDJ for configuring the filters for an existing custom view.
  public static Response<PageDef> customizeQuerySliceDef(InvocationContext ic, PageDef uncustomizedPageDef) {
    return CustomViewDefManager.customizeQuerySliceDef(ic, uncustomizedPageDef);
  }

  // Customize the PDJ for returning the results (i.e. filtered beans) of an existing custom view.
  public static Response<PageDef> customizeResultsSliceDef(InvocationContext ic, PageDef uncustomizedPageDef) {
    return CustomViewDefManager.customizeResultsSliceDef(ic, uncustomizedPageDef);
  }

  // Customizes the RDJ for creating a custom view for a bean.
  public static Response<Void> customizeCreateForm(InvocationContext ic, Page page) {
    Response<Void> response = new Response<>();
    // Add a link to the corresponding PDJ.
    // The current request includes a 'path' query parameter that indicates
    // the bean to create a custom view for.
    // Get it and add it to the PDJ's url since it needs to know too.
    String pathQueryParam =
      CustomViewDefManager.computePathQueryParam(
        CustomViewDefManager.getBeanTreePathTemplateFromPathQueryParam(ic)
      );
    page.setBackendRelativePDJURI(page.getBackendRelativePDJURI() + "&" + pathQueryParam);
    return response.setSuccess(null);
  }

  // Customizes the RDJ for configuring the filters for an existing custom view.
  public static Response<Void> customizeQuerySlice(InvocationContext ic, Page page) {
    Response<Void> response = new Response<>();
    // Get the view name from the request get the corresonding view (if it exists)
    String viewName = ic.getBeanTreePath().getLastSegment().getKey();
    Response<CustomView> resultsResponse = getCustomViewManager(ic).getSearchResults(ic, viewName);
    if (!resultsResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(resultsResponse);
    }
    CustomView view = resultsResponse.getResults();
    // Create the 'path' query param that indicates the unfiltered beans this view can
    // return and use it to add a PDJ link to the RDJ.
    String pathQueryParam =
      CustomViewDefManager.computePathQueryParam(view.getQuery().getViewDef().getBeanTreePathTemplate());
    page.setBackendRelativePDJURI(page.getBackendRelativePDJURI() + "&" + pathQueryParam);
    // Get the PDJ for this custom view.  It includes all of the properties that
    // the user can use to filter the beans this custom view returns.
    Form form = page.asForm();
    form.setExists(true);
    Response<PageDef> pageDefResponse = ic.getPageRepo().asPageReaderRepo().getPageDef(ic);
    if (!pageDefResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(pageDefResponse);
    }
    // Make it easy to find these properties by name:
    Map<String,PagePropertyDef> nameToPagePropertyDef = new HashMap<>();
    for (PagePropertyDef pagePropertyDef : pageDefResponse.getResults().getAllPropertyDefs()) {
      nameToPagePropertyDef.put(pagePropertyDef.getFormPropertyName(), pagePropertyDef);
    }
    // There always should be a name property.
    form.getProperties().add(
      new FormProperty(
        nameToPagePropertyDef.get("Name"),
        new StringValue(view.getQuery().getName())
      )
    );
    // Loop over the path segments that are used to locate the beans this custom view can return.
    for (CustomViewPathSegment segment : view.getQuery().getPath()) {
      CustomViewPathSegmentDef segmentDef = segment.getSegmentDef();
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
    // Loop over the properties of the beans this custom view can return
    for (CustomViewProperty property : view.getQuery().getProperties()) {
      // Add properties for filtering this mbean property (criteria & value).
      CustomViewPropertyDef propertyDef = property.getPropertyDef();
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

  // Customizes the RDJ for returning the filtered beans for an existing custom view.
  public static Response<Void> customizeResultsSlice(InvocationContext ic, Page page) {
    Response<Void> response = new Response<>();
    // Get the view name from the request then get the corresonding view's current results
    // (i.e. the currently existing beans that pass the view's filters).
    String viewName = ic.getBeanTreePath().getLastSegment().getKey();
    Response<CustomView> resultsResponse = getCustomViewManager(ic).getSearchResults(ic, viewName);
    if (!resultsResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(resultsResponse);
    }
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
    CustomView view = resultsResponse.getResults();
    // Loop over all of the currently existing beans that pass this view's filters,
    // adding a row for each bean.
    for (SearchBeanResults beanResults : view.getResults()) {
      TableRow row = new TableRow();
      BeanTreePath btp = beanResults.getBeanTreePath();
      row.getCells().add(new TableCell("identity", btp));
      // Loop over this bean's bean tree path.
      // Use it to track the bean's sorting key and to add
      // cells for the bean names in the bean tree path.
      List<CustomViewPathSegmentDef> segmentDefs = view.getQuery().getViewDef().getPathDef();
      Path sortingKey = new Path();
      for (int i = 0; i < segmentDefs.size(); i++) {
        CustomViewPathSegmentDef segmentDef = segmentDefs.get(i);
        if (segmentDef.isFilterable()) {
          // Add this segment's key to the beginning of the sorting key.
          String key = btp.getSegments().get(i).getKey();
          sortingKey.getComponents().add(0, key);
          // Add this segment's key to the results
          row.getCells().add(
            new TableCell(
              segmentDef.getValuePropertyDef().getFormPropertyName(),
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
    // Add a customized intro to the RDJ.
    // It includes the name of the view and the date of when the results were computed.
    page.setLocalizedIntroductionHTML(
      ic.getLocalizer().localizeString(
        page.getPageDef().getIntroductionHTML(),
        view.getName(),
        ic.getLocalizer().formatDate(view.getResultsDate())
      )
    );
    // Add a link to the corresponding PDJ.
    String pathQueryParam =
      CustomViewDefManager.computePathQueryParam(view.getQuery().getViewDef().getBeanTreePathTemplate());
    page.setBackendRelativePDJURI(page.getBackendRelativePDJURI() + "&" + pathQueryParam);
    return response.setSuccess(null);
  }

  // Return the list of custom views (so that it can be added to the custom views table RDJ).
  public static Response<List<BeanSearchResults>> getCollection(
    InvocationContext ic,
    BeanTreePath collectionPath,
    BeanReaderRepoSearchResults searchResults,
    List<BeanPropertyDef> propertyDefs
  ) {
    BeanTypeDef typeDef = collectionPath.getTypeDef();
    List<BeanSearchResults> collectionResults = new ArrayList<>();
    // Loop over the views
    for (CustomView view : getCustomViewManager(ic).getCustomViews(ic)) {
      // Compute the view's identity
      String viewName = view.getName();
      BeanTreePath childPath =
        BeanTreePath.create(
          collectionPath.getBeanRepo(),
          collectionPath.getPath().childPath(viewName)
        );
      // Create the results to return for this view
      CustomBeanSearchResults beanResults = new CustomBeanSearchResults(searchResults, childPath);
      // Add its identity and name
      beanResults.addPropertyResults(
        typeDef.getIdentityPropertyDef(),
        childPath
      );
      beanResults.addPropertyResults(
        typeDef.getPropertyDef(new Path("Name")),
        new StringValue(viewName)
      );
      if (view.getResults() != null) {
        // We've done this search earlier
        // Return when it was last done and how many matches there were
        beanResults.addPropertyResults(
          typeDef.getPropertyDef(new Path("Date")),
          new DateValue(view.getResultsDate())
        );
        beanResults.addPropertyResults(
          typeDef.getPropertyDef(new Path("NumberOfMatches")),
          new LongValue(view.getResults().size())
        );
      } else {
        // We haven't done this search yet (i.e. it's been created but not displayed yet)
      }
      collectionResults.add(beanResults);
    }
    return new Response<List<BeanSearchResults>>().setSuccess(collectionResults);
  }

  private static CustomViewManager getCustomViewManager(InvocationContext ic) {
    return ic.getPageRepo().asPageReaderRepo().getCustomViewManager();
  }
}
