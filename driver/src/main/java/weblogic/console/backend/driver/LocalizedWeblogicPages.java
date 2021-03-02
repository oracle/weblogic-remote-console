// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.yaml.snakeyaml.Yaml;
import weblogic.console.backend.pagedesc.Localizer;
import weblogic.console.backend.pagedesc.PagePath;

/*
 * This class manages the localized page definitions for weblogic pages for a weblogic version.
 * <p>
 * It maps a page path (= containment path to the bean starting at the domain/runtime mbean and
 * a slice path identifying the page for this bean type), and a locale to the localized page
 * definition to return to the UI.
 * <p>
 * The page definition includes everything the UI needs about the page: - the entire slice set
 * for the page - 'How Do I' - form or table contents
 * <p>
 * It localizes the strings based on the localizer passed in.
 * <p>
 * It relies on the resource bundle named console_backend_resource_bundle which should contain
 * keys based on these conventions:
 * <ul>
 *   <li>
 *     weblogic bean property's label:
 *     <pre><bean class name>.label</pre>
 *   </li>
 *   <li>
 *     weblogic bean property's description (from the weblogic bean info):
 *     <pre><bean classname>.descriptionHTML</pre>
 *   </li>
 *   <li>
 *     weblogic bean property's summary and detailed help text
 *     (from the console yaml file for this weblogic bean):
 *     <pre><bean class name>.helpSummaryHTML <bean class name>.detailedHelpHTML</pre>
 *   </li>
 *   <li>
 *     weblogic bean's property's legal value's label:
 *     <pre><bean class name>.<property name>.<value>.label</pre>
 *   </li>
 *   <li>
 *     table page's introduction text:
 *     <pre><bean containment path>.table.introductionHTML</pre>
 *   </li>
 *   <li>
 *     form page's introduction text:
 *     <pre><bean containment path>.slices.<slice path>.form.introductionHTML</pre>
 *   </li>
 *   <li>
 *     slice's label:
 *     <pre>slices.<slice name></pre>
 *   </li>
 *   <li>
 *     bean path segement's label:
 *     <pre>beanPathSegments.<bean path segment></pre>
 *   </li>
 * </ul>
 * <p>
 * This class reads in the source yaml files for the pages as they're accessed,
 * and caches the results for quick access.
 */
public class LocalizedWeblogicPages {

  private static Set<String> LOCALIZABLE_STRING_PROPERTY_NAMES =
    new HashSet<>(
      Arrays.asList(
        new String[] {
          "label",
          "title",
          "introductionHTML",
          "helpPageTitle",
          "helpSummaryHTML",
          "detailedHelpHTML",
          "hint",
          "inlineFieldHelp"
        }
      )
    );

  private static Set<String> LOCALIZABLE_STRING_LIST_PROPERTY_NAMES =
    new HashSet<>(Arrays.asList(new String[] {"helpTaskLabels"}));

  private UnlocalizedWeblogicPages unlocalizedPages;

  private UnlocalizedWeblogicPages getUnlocalizedPages() {
    return this.unlocalizedPages;
  }

  // localeKey -> WeblogicPages
  private Map<String, WeblogicPages> localizedPages = new ConcurrentHashMap<>();

  private Map<String, WeblogicPages> getLocalizedPages() {
    return this.localizedPages;
  }

  private WeblogicPages getLocalizedPages(Localizer localizer) throws Exception {
    String localeKey = localizer.getLocale().toString();
    WeblogicPages localizedPages = getLocalizedPages().get(localeKey);
    if (localizedPages == null) {
      // first time we've seen this locale
      localizedPages = new WeblogicPages();
      getLocalizedPages().put(localeKey, localizedPages);
    }
    return localizedPages;
  }

  public LocalizedWeblogicPages(UnlocalizedWeblogicPages unlocalizedPages) {
    this.unlocalizedPages = unlocalizedPages;
  }

  public WeblogicPage getPage(PagePath pagePath, Localizer localizer) throws Exception {
    WeblogicPage unlocalizedPage = getUnlocalizedPages().getPage(pagePath);
    if (unlocalizedPage == null) {
      // the page doesn't exist
      return null;
    }
    WeblogicPages localizedPages = getLocalizedPages(localizer);
    WeblogicPage localizedPage = localizedPages.getPage(pagePath);
    if (localizedPage == null) {
      localizedPage = createLocalizedPage(unlocalizedPage, localizer);
      localizedPages.putPage(pagePath, localizedPage);
    }
    return localizedPage;
  }

  private WeblogicPage createLocalizedPage(
    WeblogicPage unlocalizedPage,
    Localizer localizer
  ) throws Exception {
    Map<String, Object> map = convertToMap(unlocalizedPage);
    localizeMap(map, localizer);
    String yaml = (new Yaml()).dumpAsMap(map);
    return (new Yaml()).loadAs(yaml, WeblogicPage.class);
  }

  private Map<String, Object> convertToMap(Object object) {
    String yaml = (new Yaml()).dumpAsMap(object);
    Map map = (new Yaml()).loadAs(yaml, Map.class);
    @SuppressWarnings("unchecked")
    Map<String, Object> typedMap = (Map<String, Object>) map;
    return typedMap;
  }

  private void localizeMap(Map<String, Object> map, Localizer localizer) throws Exception {
    for (Map.Entry<String, Object> e : map.entrySet()) {
      String name = e.getKey();
      Object value = e.getValue();
      if (LOCALIZABLE_STRING_PROPERTY_NAMES.contains(name)) {
        // TBD - is it OK to modify a map while iterating over it?
        map.put(name, localizeString((String) value, localizer));
      } else if (LOCALIZABLE_STRING_LIST_PROPERTY_NAMES.contains(name)) {
        @SuppressWarnings("unchecked")
        List<String> strings = (List<String>) value;
        map.put(name, localizeStrings(strings, localizer));
      } else if (value instanceof Map) {
        @SuppressWarnings("unchecked")
        Map<String, Object> typedMap = (Map<String, Object>) value;
        localizeMap(typedMap, localizer);
      } else if (value instanceof List) {
        localizeList((List) value, localizer);
      }
    }
  }

  private void localizeList(List list, Localizer localizer) throws Exception {
    for (Object o : list) {
      if (o instanceof Map) {
        @SuppressWarnings("unchecked")
        Map<String, Object> typedMap = (Map<String, Object>) o;
        localizeMap(typedMap, localizer);
      } else if (o instanceof List) {
        localizeList((List) o, localizer);
      }
    }
  }

  private List<String> localizeStrings(List<String> keys, Localizer localizer) throws Exception {
    List<String> rtn = new ArrayList<>();
    for (String key : keys) {
      rtn.add(localizeString(key, localizer));
    }
    return rtn;
  }

  // the property values in the unlocalized WeblogicPage are actually the localization keys
  private String localizeString(String key, Localizer localizer) throws Exception {
    return localizer.localizeString(key);
  }
}
