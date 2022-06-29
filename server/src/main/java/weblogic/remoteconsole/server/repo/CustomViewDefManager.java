// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import javax.ws.rs.core.UriBuilder;

import weblogic.remoteconsole.common.repodef.BeanChildDef;
import weblogic.remoteconsole.common.repodef.CustomCreateFormDef;
import weblogic.remoteconsole.common.repodef.CustomPagePropertyDef;
import weblogic.remoteconsole.common.repodef.CustomSliceFormDef;
import weblogic.remoteconsole.common.repodef.CustomSliceTableDef;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.Localizer;
import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.repodef.PagePath;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.repodef.PagesPath;
import weblogic.remoteconsole.common.utils.Path;

/**
 * Utility class for managing custom view definitions.
 * 
 * It customizes the custom view PDJs (create form, query slice, results slice).
 * 
 * It also handles the 'path' query parameter that gets added to some of the
 * urls to indicate a custom view's bean tree path pattern (which defines the
 * list of beans the custom view could potentially return).
 */
public class CustomViewDefManager {

  private CustomViewDefManager() {
  }

  // Determines whether a bean tree path template supports custom views.
  public static boolean isSupportsCustomViews(InvocationContext ic, BeanTreePath templateBtp) {
    // Check whether the page repo supports custom views
    if (!ic.getPageRepo().getPageRepoDef().isSupportsCustomViews()) {
      return false;
    }
    Set<String> childNames = new HashSet<>();
    boolean hasCollection = false;
    for (BeanTreePathSegment segment : templateBtp.getSegments()) {
      String childName = segment.getChildDef().getChildName();
      if (childNames.contains(childName)) {
        // Don't support custom views for this child (since we use the children's
        // singular names to name the columns and we don't want two columns
        // with the same name and we don't want to have to invent a name
        // to disambiguate them).
        return false;
      }
      childNames.add(childName);
      // If the segment doesn't support custom views,
      // then no child beans are allowed to support them either.
      if (!segment.getChildDef().getChildTypeDef().isSupportsCustomViews()) {
        return false;
      }
      if (segment.getChildDef().isCollection()) {
        hasCollection = true;
      }
    }
    if (!hasCollection) {
      // There are no collections in the path, so this path is to a singleton or to the root.
      // There's no point in creating a custom view that only finds one bean.
      return false;
    } else {
      return true;
    }
  }

  // Computes the query param to add to a custom view's PDJ or RDJ url
  // to indicate the bean tree path template of the beans it can return.
  public static String computePathQueryParam(BeanTreePath btp) {
    UriBuilder bldr = UriBuilder.fromPath("");
    for (String component : btp.getPath().getComponents()) {
      bldr.queryParam("path", component);
    }
    String uriStr = bldr.build().toString();
    return uriStr.substring(uriStr.indexOf("?") + 1);
  }

  public static BeanTreePath getBeanTreePathTemplateFromPathQueryParam(InvocationContext ic) {
    BeanTreePath btp = getBeanTreePathFromPathQueryParam(ic);
    if (btp == null) {
      return null;
    }
    // Converts a bean tree path to a template by stripping out its identities
    BeanTreePath btpTemplate = BeanTreePath.create(btp.getBeanRepo(), new Path());
    for (BeanTreePathSegment segment : btp.getSegments()) {
      btpTemplate = btpTemplate.childPath(segment.getChildDef().getChildPath());
    }
    return btpTemplate;
  }

  // Get the bean tree path / template for a custom view from the query params
  // in its PDJ or RDJ url.
  public static BeanTreePath getBeanTreePathFromPathQueryParam(InvocationContext ic) {
    // The bean tree path was passed in via the 'path' JAXRS query parameter
    List<String> pathComponents = ic.getUriInfo().getQueryParameters().get("path");
    if (pathComponents == null) {
      return null;
    }
    Path path = new Path();
    for (String pathComponent : pathComponents) {
      path.addComponent(pathComponent);
    }
    return BeanTreePath.create(ic.getPageRepo().getBeanRepo(), path);
  }

  // Customize a custom view's create form PDJ.
  // It starts off with the standard one defined in yaml
  // then adds properties for filtering beans by their path and properties.
  public static Response<PageDef> customizeCreateFormDef(InvocationContext ic, PageDef uncustomizedPageDef) {
    Response<PageDef> response = new Response<>();
    Response<CustomViewDef> viewDefResponse = getViewDef(ic);
    if (!viewDefResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(viewDefResponse);
    }
    return
      response.setSuccess(
        new CustomCreateFormDef(uncustomizedPageDef.asCreateFormDef())
          .propertyDefs(
            getCriteriaAndValuePagePropertyDefs(ic, viewDefResponse.getResults(), uncustomizedPageDef)
          )
      );
  }

  // Customize a custom view's query slice PDJ.
  // It starts off with the standard one defined in yaml
  // then adds properties for filtering beans by their path and properties.
  public static Response<PageDef> customizeQuerySliceDef(InvocationContext ic, PageDef uncustomizedPageDef) {
    Response<PageDef> response = new Response<>();
    Response<CustomViewDef> viewDefResponse = getViewDef(ic);
    if (!viewDefResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(viewDefResponse);
    }
    return
      response.setSuccess(
        new CustomSliceFormDef(uncustomizedPageDef.asSliceFormDef())
          .propertyDefs(
            getCriteriaAndValuePagePropertyDefs(ic, viewDefResponse.getResults(), uncustomizedPageDef)
          )
      );
  }

  // Customize a custom view's results slice PDJ.
  // It starts off with the standard one defined in yaml
  // then adds properties returning the matching beans' names and property values.
  public static Response<PageDef> customizeResultsSliceDef(InvocationContext ic, PageDef uncustomizedPageDef) {
    Response<PageDef> response = new Response<>();
    Response<CustomViewDef> viewDefResponse = getViewDef(ic);
    if (!viewDefResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(viewDefResponse);
    }
    CustomViewDef viewDef = viewDefResponse.getResults();
    CustomSliceTableDef sliceTableDef =
      new CustomSliceTableDef(uncustomizedPageDef.asSliceTableDef());
    for (CustomViewPathSegmentDef segmentDef : viewDef.getPathDef()) {
      if (segmentDef.isFilterable()) {
        sliceTableDef.getDisplayedColumnDefs().add(
          new CustomPagePropertyDef(segmentDef.getResultPropertyDef()).writable(false)
        );
      }
    }
    for (CustomViewPropertyDef propertyDef : viewDef.getPropertyDefs()) {
      sliceTableDef.getDisplayedColumnDefs().add(propertyDef.getSourcePropertyDef());
    }
    return response.setSuccess(sliceTableDef);
  }

  private static List<PagePropertyDef> getCriteriaAndValuePagePropertyDefs(
    InvocationContext ic,
    CustomViewDef viewDef,
    PageDef uncustomizedPageDef
  ) {
    List<PagePropertyDef> pagePropertyDefs = new ArrayList<>();
    pagePropertyDefs.add(
      new CustomPagePropertyDef(getNamePropertyDef(uncustomizedPageDef)).createWritable(true)
    );
    for (CustomViewPathSegmentDef segmentDef : viewDef.getPathDef()) {
      if (segmentDef.isFilterable()) {
        pagePropertyDefs.add(segmentDef.getCriteriaPropertyDef());
        pagePropertyDefs.add(segmentDef.getValuePropertyDef());
      }
    }
    for (CustomViewPropertyDef propertyDef : viewDef.getPropertyDefs()) {
      pagePropertyDefs.add(propertyDef.getCriteriaPropertyDef());
      pagePropertyDefs.add(propertyDef.getValuePropertyDef());;
    }
    return pagePropertyDefs;
  }

  private static PagePropertyDef getNamePropertyDef(PageDef uncustomizedPageDef) {
    for (PagePropertyDef pagePropertyDef : uncustomizedPageDef.getAllPropertyDefs()) {
      if ("Name".equals(pagePropertyDef.getFormPropertyName())) {
        return pagePropertyDef;
      }
    }
    throw new AssertionError("Could not find Name property: " + uncustomizedPageDef.getAllPropertyDefs());
  }

  // Get the localized custom view definition for the custom view referenced by this request.
  public static Response<CustomViewDef> getViewDef(InvocationContext ic) {
    BeanTreePath btpTemplate = getBeanTreePathTemplateFromPathQueryParam(ic);
    if (btpTemplate != null) {
      // The request is for a custom view create form RDJ or PDJ for the
      // bean tree path in ic's path query param.
      // Create a localized view def from it.
    } else {
      // A custom view should already exist and ic's btp should point at it.
      // We can't just return it because it could be localized to a different locale.
      // Instead, get it, get it's template btp then create a new one for this locale.
      Response<CustomViewDef> response = new Response<>();
      Response<CustomView> viewResponse =
        ic.getPageRepo().asPageReaderRepo().getCustomViewManager().getCustomView(ic);
      if (!viewResponse.isSuccess()) {
        return response.copyUnsuccessfulResponse(viewResponse);
      }
      btpTemplate = viewResponse.getResults().getQuery().getViewDef().getBeanTreePathTemplate();
    }
    return createLocalizedViewDef(ic, btpTemplate);
  }

  private static Response<CustomViewDef> createLocalizedViewDef(InvocationContext ic, BeanTreePath templateBtp) {
    PageDef uncustomizedCreateFormDef = getUncustomizedCreateFormDef(ic, templateBtp);
    Response<CustomViewDef> response = new Response<>();
    if (!isSupportsCustomViews(ic, templateBtp)) {
      throw new AssertionError(templateBtp + " doesn't support custom views.");
    }
    Map<String,PagePropertyDef> templatePagePropertyDefs = new HashMap<>();
    for (PagePropertyDef templatePagePropertyDef : uncustomizedCreateFormDef.getAllPropertyDefs()) {
      templatePagePropertyDefs.put(templatePagePropertyDef.getFormPropertyName(), templatePagePropertyDef);
    }
    List<CustomViewPathSegmentDef> pathDef =
      createPathDefFromTemplate(ic, templateBtp, templatePagePropertyDefs);
    Response<List<CustomViewPropertyDef>> propertyDefsResponse =
      createPropertyDefsFromTemplate(ic, templateBtp, templatePagePropertyDefs);
    if (!propertyDefsResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(propertyDefsResponse);
    }
    return response.setSuccess(new CustomViewDef(templateBtp, pathDef, propertyDefsResponse.getResults()));
  }

  private static List<CustomViewPathSegmentDef> createPathDefFromTemplate(
    InvocationContext ic,
    BeanTreePath templateBtp,
    Map<String,PagePropertyDef> templatePagePropertyDefs
  ) {
    List<CustomViewPathSegmentDef> pathDef = new ArrayList<>();
    for (BeanTreePathSegment segmentTemplate : templateBtp.getSegments()) {
      CustomViewPathSegmentDef segmentDef = null;
      BeanChildDef childDef = segmentTemplate.getChildDef();
      if (childDef.isCollection()) {
        LocalizableString name = childDef.getSingularLabel();
        String baseFormPropertyName = childDef.getChildName();
        PagePropertyDef criteriaDef =
          customizePropertyDef(
            ic,
            templatePagePropertyDefs.get("TemplateBeanKeyCriteria"),
            name,
            "BeanKeyCriteria_" + baseFormPropertyName
          );
        PagePropertyDef valueDef =
          customizePropertyDef(
            ic,
            templatePagePropertyDefs.get("TemplateBeanKeyValue"),
            name,
            "BeanKeyValue_" + baseFormPropertyName
          );
        PagePropertyDef resultDef =
          customizePropertyDef(
            ic,
            templatePagePropertyDefs.get("TemplateBeanKeyResult"),
            name,
            "BeanKeyResult_" + baseFormPropertyName
          );
        segmentDef = new CustomViewPathSegmentDef(segmentTemplate, criteriaDef, valueDef, resultDef);
      } else {
        segmentDef = new CustomViewPathSegmentDef(segmentTemplate);
      }
      pathDef.add(segmentDef);
    }
    return pathDef;
  }

  private static Response<List<CustomViewPropertyDef>> createPropertyDefsFromTemplate(
    InvocationContext ic,
    BeanTreePath templateBtp,
    Map<String,PagePropertyDef> templatePagePropertyDefs
  ) {
    Response<List<CustomViewPropertyDef>> response = new Response<>();
    Collection<PagePropertyDef> pagePropertyDefs =
      SearchUtils.getPagePropertyDefs(ic.getPageRepo().getPageRepoDef(), templateBtp.getTypeDef()).values();
    List<CustomViewPropertyDef> propertyDefs = new ArrayList<>();
    for (PagePropertyDef sourcePropertyDef : pagePropertyDefs) {
      String baseTemplatePropertyFormName = getBaseTemplatePagePropertyDefName(sourcePropertyDef);
      LocalizableString name = sourcePropertyDef.getLabel();
      String baseFormPropertyName = sourcePropertyDef.getFormPropertyName();
      PagePropertyDef criteriaDef =
        customizePropertyDef(
          ic,
          templatePagePropertyDefs.get(baseTemplatePropertyFormName + "Criteria"),
          name,
          "PropertyCriteria_" + baseFormPropertyName
        );
      PagePropertyDef valueDef =
        customizePropertyDef(
          ic,
          templatePagePropertyDefs.get(baseTemplatePropertyFormName + "Value"),
          name,
          "PropertyValue_" + baseFormPropertyName
        );
      propertyDefs.add(new CustomViewPropertyDef(sourcePropertyDef, criteriaDef, valueDef));
    }
    return response.setSuccess(propertyDefs);
  }

  private static String getBaseTemplatePagePropertyDefName(PagePropertyDef pagePropertyDef) {
    if (!pagePropertyDef.isArray()) {
      if (pagePropertyDef.isInt() || pagePropertyDef.isLong()) {
        return "TemplateLongProperty";
      }
      if (pagePropertyDef.isDouble()) {
        return "TemplateDoubleProperty";
      }
      if (pagePropertyDef.isBoolean()) {
        return "TemplateBooleanProperty";
      }
      if (pagePropertyDef.isString() || pagePropertyDef.isHealthState()) {
        return "TemplateStringProperty";
      }
    }
    return "TemplateGenericProperty";
  }

  private static CustomPagePropertyDef customizePropertyDef(
    InvocationContext ic,
    PagePropertyDef uncustomizedPagePropertyDef,
    LocalizableString name,
    String formPropertyName
  ) {
    CustomPagePropertyDef rtn =
      new CustomPagePropertyDef(uncustomizedPagePropertyDef)
        .formPropertyName(formPropertyName)
        .writable(true);
    customizeTemplateStrings(ic, rtn, name);
    return rtn;
  }

  private static void customizeTemplateStrings(
    InvocationContext ic,
    CustomPagePropertyDef pagePropertyDef,
    LocalizableString name
  ) {
    pagePropertyDef.setLabel(
      customizeTemplateString(ic, pagePropertyDef.getLabel(), name)
    );
    pagePropertyDef.setHelpSummaryHTML(
      customizeTemplateString(ic, pagePropertyDef.getHelpSummaryHTML(), name)
    );
    pagePropertyDef.setDetailedHelpHTML(
      customizeTemplateString(ic, pagePropertyDef.getDetailedHelpHTML(), name)
    );
  }

  private static LocalizableString customizeTemplateString(
    InvocationContext ic,
    LocalizableString template,
    LocalizableString name
  ) {
    Localizer localizer = ic.getLocalizer();
    String localizedName = localizer.localizeString(name);
    String localizedTemplate = localizer.localizeString(template, localizedName);
    return new LocalizableString(localizedTemplate); // Already localized
  }

  private static PageDef getUncustomizedCreateFormDef(InvocationContext ic, BeanTreePath templateBtp) {
    String tree = templateBtp.getSegments().get(0).getChildDef().getChildName();
    Path customViewsPath = new Path(tree).childPath("CustomViews");
    BeanTreePath customViewsBtp = BeanTreePath.create(templateBtp.getBeanRepo(), customViewsPath);
    PagesPath customViewsPagesPath = ic.getPageRepo().getPageRepoDef().newPagesPath(customViewsBtp.getTypeDef());
    PagePath customViewsCreateFormPagePath = PagePath.newCreateFormPagePath(customViewsPagesPath);
    InvocationContext customViewsIc = new InvocationContext(ic); // clone
    customViewsIc.setIdentity(customViewsBtp);
    customViewsIc.setPagePath(customViewsCreateFormPagePath);
    return customViewsIc.getPageRepo().getPageRepoDef().getPageDef(customViewsCreateFormPagePath);
  }
}
