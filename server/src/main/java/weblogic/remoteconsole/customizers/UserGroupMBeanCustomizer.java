// Copyright (c) 2024, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;

import weblogic.console.utils.Path;
import weblogic.console.utils.StringUtils;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.CustomPagePropertyDef;
import weblogic.remoteconsole.common.repodef.CustomSliceFormDef;
import weblogic.remoteconsole.common.repodef.CustomSlicesDef;
import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.repodef.PageActionDef;
import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.repodef.SliceDef;
import weblogic.remoteconsole.common.repodef.SliceFormDef;
import weblogic.remoteconsole.common.repodef.SlicesDef;
import weblogic.remoteconsole.server.providers.AdminServerDataProvider;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchBuilder;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchResults;
import weblogic.remoteconsole.server.repo.BeanSearchResults;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Page;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.SettableValue;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.repo.TableCell;
import weblogic.remoteconsole.server.repo.TableRow;
import weblogic.remoteconsole.server.repo.Value;
import weblogic.remoteconsole.server.repo.weblogic.WebLogicRestInvoker;

/** 
 * Custom code for processing the user and group mbeans
 */
public class UserGroupMBeanCustomizer {

  private static String FILTER_CACHE_LOCK = new String();

  private static final int MAX_USERS = 1000; // must be the same as UserGroupUtils MAX_USERS
  private static final int MAX_GROUPS = 1000; // must be the same as UserGroupUtils MAX_GROUPS

  private static FilterCache filterCache = new FilterCache();

  public static void customizeFilterActionInputForm(InvocationContext ic, Page page) {
    List<FormProperty> oldProperties = page.asForm().getProperties();
    List<FormProperty> newProperties =
      List.of(
        CustomizerUtils.createFormProperty("NameFilter", oldProperties, new StringValue(getNameWildCard(ic)))
      );
    oldProperties.clear();
    oldProperties.addAll(newProperties);
  }

  public static Response<Value> setTableFilter(
    InvocationContext ic,
    PageActionDef pageActionDef,
    List<FormProperty> formProperties
  ) {
    String nameFilter = formProperties.get(0).getValue().asSettable().getValue().asString().getValue();
    if ("*".equals(nameFilter)) {
      nameFilter = null;
    }
    recordFilter(ic, nameFilter);
    return new Response<Value>().setSuccess(null);
  }

  public static void customizeReflectingUsersTable(InvocationContext ic, Page page) {
    customizeUsersTable(ic, page);
    AuthenticationProviderCapabilities capabilities = new AuthenticationProviderCapabilities(ic);
    if (!capabilities.isUserEditor()) {
      page.forceReadOnly();
    }
  }

  public static void customizeReflectingGroupsTable(InvocationContext ic, Page page) {
    customizeUsersTable(ic, page);
    AuthenticationProviderCapabilities capabilities = new AuthenticationProviderCapabilities(ic);
    if (!capabilities.isGroupEditor()) {
      page.forceReadOnly();
    }
  }

  public static void customizeUsersTable(InvocationContext ic, Page page) {
    customizeTable(
      ic,
      page,
      MAX_USERS,
      LocalizedConstants.LEGACY_TOO_MANY_USERS,
      LocalizedConstants.TOO_MANY_USERS,
      LocalizedConstants.USERS_FILTER
    );
  }

  public static void customizeGroupsTable(InvocationContext ic, Page page) {
    customizeTable(
      ic,
      page,
      MAX_GROUPS,
      LocalizedConstants.LEGACY_TOO_MANY_GROUPS,
      LocalizedConstants.TOO_MANY_GROUPS,
      LocalizedConstants.GROUPS_FILTER
    );
  }

  private static void customizeTable(
    InvocationContext ic,
    Page page,
    int max,
    LocalizableString legacyTooMany,
    LocalizableString tooMany,
    LocalizableString filter
  ) {
    StringBuilder sb = new StringBuilder();
    if (supportsFiltering(ic)) {
      String nameFilter = getNameFilter(ic);
      if (nameFilter != null) {
        sb.append(ic.getLocalizer().localizeString(filter, nameFilter));
      }
    }
    // The extension will return one more than the maximum so that we can tell
    // the difference between having the maximum and having too many.
    // Trim back to the maximum so that we have a nice round number.
    List<TableRow> rows = page.asTable().getRows();
    if (rows.size() > max) {
      while (rows.size() > max) {
        rows.remove(max);
      }
      if (supportsFiltering(ic)) {
        sb.append(ic.getLocalizer().localizeString(tooMany));
      } else {
        sb.append(ic.getLocalizer().localizeString(legacyTooMany, max));
      }
    } else if (rows.isEmpty()) {
      String providerStatus = getProviderStatus(ic);
      if (providerStatus != null) {
        sb.append(
          ic.getLocalizer().localizeString(
            LocalizedConstants.SECURITY_PROVIDER_DATA_NOT_AVAILABLE,
            providerStatus
          )
        );
      }
    }
    sb.append(ic.getLocalizer().localizeString(page.getPageDef().getIntroductionHTML()));
    page.setLocalizedIntroductionHTML(sb.toString());
  }

  public static List<TableRow> getUsers(InvocationContext ic, BeanReaderRepoSearchResults searchResults) {
    return getCollection(ic, MAX_USERS);
  }

  public static List<TableRow> getGroups(InvocationContext ic, BeanReaderRepoSearchResults searchResults) {
    return getCollection(ic, MAX_GROUPS);
  }

  private static List<TableRow> getCollection(InvocationContext ic, int max) {
    Map<String,TableRow> sortedRows = new TreeMap<>();
    JsonArray items = getCollectionJson(ic, max);
    for (int i = 0; i < items.size(); i++) {
      TableRow row = new TableRow();
      JsonObject item = items.getJsonObject(i);
      String name = CustomizerUtils.getStringField(item, "name");
      String description = CustomizerUtils.getStringField(item, "description");
      BeanTreePath collectionBTP = ic.getBeanTreePath();
      BeanTreePath itemBTP = 
        BeanTreePath.create(
          collectionBTP.getBeanRepo(),
          collectionBTP.getPath().childPath(name)
        );
      List<TableCell> cells = row.getCells();
      cells.add(new TableCell("identity", itemBTP));
      cells.add(new TableCell("Name", new StringValue(name)));
      cells.add(new TableCell("Description", new StringValue(description)));
      sortedRows.put(name, row);
    }
    return new ArrayList<>(sortedRows.values());
  }

  private static JsonArray getCollectionJson(InvocationContext ic, int max) {
    // e.g. <Domain/RealmsSecurityData/myrealm/AuthenticationProviders/DefaultAuthenticator/Groups>
    List<String> components = ic.getBeanTreePath().getPath().getComponents();
    String realmName = components.get(2);
    String providerName = components.get(4);
    String collectionName = components.get(5);
    JsonObject query =
      Json.createObjectBuilder()
        .add("fields", Json.createArrayBuilder())
        .add(
          "children",
          Json.createObjectBuilder()
            .add(
              "realmsSecurityData",
              Json.createObjectBuilder()
                .add("fields", Json.createArrayBuilder())
                .add("name", Json.createArrayBuilder().add(realmName))
                .add(
                  "children",
                  Json.createObjectBuilder()
                    .add(
                      "authenticationProviders",
                      Json.createObjectBuilder()
                        .add("fields", Json.createArrayBuilder())
                        .add("name", Json.createArrayBuilder().add(providerName))
                        .add(
                          "children",
                          Json.createObjectBuilder()
                            .add(
                              StringUtils.getRestName(collectionName),
                              Json.createObjectBuilder()
                                .add("fields", Json.createArrayBuilder().add("name").add("description"))
                                .add("nameWildCard", getNameWildCard(ic))
                                .add("maxToReturn", max)
                            )
                        )
                    )
                )
            )
        )
        .build();
    JsonObject invokeResponse =
      WebLogicRestInvoker.post(
        ic,
        new Path("serverConfig.search"),
        query,
        false, // expanded values
        false, // save changes
        false // asynchronous
       ).getResults();
    JsonArray realms = getCollectionJson(invokeResponse, "realmsSecurityData");
    JsonObject realm = getChildJson(realms, realmName);
    JsonArray providers = getCollectionJson(realm, "authenticationProviders");
    JsonObject provider = getChildJson(providers, providerName);
    JsonArray items = getCollectionJson(provider, StringUtils.getRestName(collectionName));
    if (items == null) {
      items = Json.createArrayBuilder().build();
    }
    return items;
  }

  private static JsonArray getCollectionJson(JsonObject parent, String collectionName) {
    if (parent == null) {
      return null;
    }
    if (!parent.containsKey(collectionName)) {
      return null;
    }
    return parent.getJsonObject(collectionName).getJsonArray("items");
  }

  private static JsonObject getChildJson(JsonArray items, String childName) {
    if (items == null) {
      return null;
    }
    for (int i = 0; i < items.size(); i++) {
      JsonObject child = items.getJsonObject(i);
      if (childName.equals(CustomizerUtils.getStringField(child, "name"))) {
        return child;
      }
    }
    return null;
  }

  public static SettableValue getStatus(
    InvocationContext ic,
    @Source(property = "Status") SettableValue statusValue
  ) {
    String status = statusValue.getValue().asString().getValue();
    if ("OK".equals(status)) {
      status = ic.getLocalizer().localizeString(LocalizedConstants.USER_GROUP_READER_STATUS_OK);
    }
    return new SettableValue(new StringValue(status), false);
  }

  public static PageDef customizeUserPageDef(InvocationContext ic, PageDef uncustomizedPageDef) {
    AuthenticationProviderCapabilities capabilities = new AuthenticationProviderCapabilities(ic);
    SliceFormDef uncustomizedFormDef = uncustomizedPageDef.asSliceFormDef();
    CustomSliceFormDef customizedFormDef = new CustomSliceFormDef(uncustomizedFormDef);
    if (!capabilities.isMemberGroupLister()) {
      removeSliceIfPresent(customizedFormDef, "Membership");
    }
    if (!capabilities.isPasswordEditor()) {
      removeSliceIfPresent(customizedFormDef, "Password");
    }
    if (!capabilities.isUserEditor()) {
      makePropertyReadOnlyIfPresent(customizedFormDef, "Description");
    }
    if (!capabilities.isGroupEditor()) {
      makePropertyReadOnlyIfPresent(customizedFormDef, "Groups");
    }
    return customizedFormDef;
  }

  public static PageDef customizeGroupPageDef(InvocationContext ic, PageDef uncustomizedPageDef) {
    AuthenticationProviderCapabilities capabilities = new AuthenticationProviderCapabilities(ic);
    SliceFormDef uncustomizedFormDef = uncustomizedPageDef.asSliceFormDef();
    CustomSliceFormDef customizedFormDef = new CustomSliceFormDef(uncustomizedFormDef);
    if (!capabilities.isMemberGroupLister()) {
      removeSliceIfPresent(customizedFormDef, "Membership");
    }
    if (!capabilities.isGroupEditor()) {
      makePropertyReadOnlyIfPresent(customizedFormDef, "Description");
      makePropertyReadOnlyIfPresent(customizedFormDef, "Groups");
    }
    return customizedFormDef;
  }

  private static void removeSliceIfPresent(CustomSliceFormDef formDef, String slice) {
    SlicesDef oldSlicesDef = formDef.getSlicesDef();
    List<SliceDef> newContentDefs = new ArrayList<>();
    for (SliceDef sliceDef : oldSlicesDef.getContentDefs()) {
      if (!slice.equals(sliceDef.getName())) {
        newContentDefs.add(sliceDef);
      }
    }
    CustomSlicesDef newSlicesDef = new CustomSlicesDef(oldSlicesDef);
    newSlicesDef.setContentDefs(newContentDefs);
    formDef.setSlicesDef(newSlicesDef);
  }

  private static void makePropertyReadOnlyIfPresent(CustomSliceFormDef formDef, String property) {
    formDef.setPropertyDefs(makePropertyReadOnlyIfPresent(formDef.getPropertyDefs(), property));
    formDef.setAdvancedPropertyDefs(makePropertyReadOnlyIfPresent(formDef.getAdvancedPropertyDefs(), property));
  }

  private static List<PagePropertyDef> makePropertyReadOnlyIfPresent(
    List<PagePropertyDef> propertyDefs,
    String property
  ) {
    List<PagePropertyDef> newPropertyDefs = new ArrayList<>();
    for (PagePropertyDef oldPropertyDef : propertyDefs) {
      if (property.equals(oldPropertyDef.getPropertyName())) {
        CustomPagePropertyDef newPropertyDef = new CustomPagePropertyDef(oldPropertyDef);
        newPropertyDef.setWritable(false);
        newPropertyDefs.add(newPropertyDef);
      } else {
        newPropertyDefs.add(oldPropertyDef);
      }
    }
    return newPropertyDefs;
  }

  private static class AuthenticationProviderCapabilities {
    private static final String PROP_GROUP_EDITOR = "GroupEditor";
    private static final String PROP_MEMBER_GROUP_LISTER = "MemberGroupLister";
    // FortifyIssueSuppression Password Management: Hardcoded Password
    // Just a property name
    private static final String PROP_PASSWORD_EDITOR = "PasswordEditor";
    private static final String PROP_USER_EDITOR = "UserEditor";

    private static final List<String> CAPABILITIES =
      List.of(
        PROP_GROUP_EDITOR,
        PROP_MEMBER_GROUP_LISTER,
        PROP_PASSWORD_EDITOR,
        PROP_USER_EDITOR
      );

    private Map<String,Boolean> capabilityToSupports = new HashMap<>();

    private AuthenticationProviderCapabilities(InvocationContext ic) {
      // e.g. Domain / RealmsSecurityData / myrealm / AuthenticationProviders / DefaultAuthenticator / ...
      BeanTreePath btp = ic.getBeanTreePath();
      Path path = btp.getPath();
      Path providerPath = path.subPath(0, 5);
      BeanTreePath providerBTP = BeanTreePath.create(btp.getBeanRepo(), providerPath);
      InvocationContext providerIC = new InvocationContext(ic, providerBTP);
      BeanReaderRepoSearchBuilder builder =
        providerIC.getPageRepo().getBeanRepo().asBeanReaderRepo().createSearchBuilder(providerIC, false);
      BeanTypeDef typeDef = btp.getBeanRepo().getBeanRepoDef().getTypeDef("ReflectingUserGroupAuthenticatorMBean");
      for (String capability : CAPABILITIES) {
        builder.addProperty(providerBTP, typeDef.getPropertyDef(new Path(capability)));
      }
      BeanReaderRepoSearchResults searchResults = builder.search().getResults();
      BeanSearchResults beanResults = searchResults.getBean(providerBTP);
      if (beanResults == null) {
        throw Response.notFoundException();
      }
      for (String capability : CAPABILITIES) {
        boolean val = false;
        Value value = beanResults.getValue(typeDef.getPropertyDef(new Path(capability)));
        if (value == null) {
          // it's an old DefaultAuthenticator which doesn't list its capabilities
          val = true;
        } else {
          // it's a new authenticator that lists its capabilities
          val = value.asBoolean().getValue();
        }
        capabilityToSupports.put(capability, val);
      }
    }

    private boolean isGroupEditor() {
      return supports(PROP_GROUP_EDITOR);
    }

    private boolean isMemberGroupLister() {
      return supports(PROP_MEMBER_GROUP_LISTER);
    }

    private boolean isPasswordEditor() {
      return supports(PROP_PASSWORD_EDITOR);
    }

    private boolean isUserEditor() {
      return supports(PROP_USER_EDITOR);
    }

    private boolean supports(String capability) {
      return capabilityToSupports.containsKey(capability) ? capabilityToSupports.get(capability) : false;
    }
  }

  private static String getProviderStatus(InvocationContext ic) {
    BeanTreePath collectionBTP = ic.getBeanTreePath();
    BeanTreePath providerBTP =
      BeanTreePath.create(
        collectionBTP.getBeanRepo(),
        collectionBTP.getPath().getParent()
      );
    InvocationContext providerIC = new InvocationContext(ic, providerBTP);
    BeanReaderRepoSearchBuilder builder =
      ic.getPageRepo().getBeanRepo().asBeanReaderRepo().createSearchBuilder(providerIC, false);
    BeanPropertyDef statusPropertyDef = providerBTP.getTypeDef().getPropertyDef(new Path("Status"), true);
    if (statusPropertyDef != null) {
      builder.addProperty(providerBTP, statusPropertyDef);
      Value statusValue =
        builder
          .search()
          .getResults()
          .getBean(providerBTP)
          .getValue(statusPropertyDef);
      if (statusValue != null) {
        String status = statusValue.asString().getValue();
        if (!"OK".equals(status)) {
          return status;
        }
      }
    }
    return null;
  }

  private static String getNameWildCard(InvocationContext ic) {
    String nameFilter = (supportsFiltering(ic)) ? getNameFilter(ic) : null;
    return (nameFilter != null) ? nameFilter : "*";
  }

  private static boolean supportsFiltering(InvocationContext ic) {
    return ic.getPageRepo().getBeanRepo().getBeanRepoDef().supportsCapabilities(List.of("UserGroupFiltering"));
  }

  private static String getNameFilter(InvocationContext ic) {
    synchronized (FILTER_CACHE_LOCK) {
      return getFilterCache(ic).getNameFilter(ic);
    }
  }

  private static void recordFilter(InvocationContext ic, String nameFilter) {
    synchronized (FILTER_CACHE_LOCK) {
      getFilterCache(ic).setFilter(ic, nameFilter);
    }
  }

  @SuppressWarnings("unchecked")
  private static FilterCache getFilterCache(InvocationContext ic) {
    String key = "USER_GROUP_FILTER_CACHE";
    Map<String,Object> providerCache = ((AdminServerDataProvider)ic.getProvider()).getCache();
    FilterCache filterCache = (FilterCache)providerCache.get(key);
    if (filterCache == null) {
      filterCache = new FilterCache();
      providerCache.put(key, filterCache);
    }
    return filterCache;
  }

  private static class FilterCache {
    private Map<String,String> keyToNameFilter = new HashMap<>();

    private void setFilter(InvocationContext ic, String nameFilter) {
      String key = getKey(ic);
      if (nameFilter == null) {
        keyToNameFilter.remove(key);
      } else {
        keyToNameFilter.put(key, nameFilter);
      }
    }

    private String getNameFilter(InvocationContext ic) {
      return keyToNameFilter.get(getKey(ic));
    }

    private String getKey(InvocationContext ic) {
      return ic.getBeanTreePath().getPath().toString();
    }
  }
}
