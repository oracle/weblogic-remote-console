// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.providers;

import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;

import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.PageRepo;
import weblogic.remoteconsole.server.webapp.UriUtils;

public class Root {
  public static final String EDIT_NAME = "edit";
  public static final LocalizableString EDIT_LABEL = LocalizedConstants.EDIT_LABEL;
  public static final String PROPERTY_LIST_CONFIGURATION_NAME = "propertyList";
  public static final String COMPOSITE_CONFIGURATION_NAME = "compositeConfig";
  public static final String SERVER_CONFIGURATION_NAME = "serverConfig";
  public static final String DOMAIN_RUNTIME_NAME = "domainRuntime";
  public static final String SECURITY_DATA_NAME = "securityData";
  public static final String CONFIGURATION_ROOT = "DomainConfiguration";
  public static final String MONITORING_ROOT = "DomainRuntimeMonitoring";
  public static final String SECURITY_DATA_ROOT = "SecurityData";
  public static final String NAV_TREE_RESOURCE = "navtree";
  public static final String SIMPLE_SEARCH_RESOURCE = "simpleSearch";
  public static final String CHANGE_MANAGER_RESOURCE = "changeManager";
  public static final String DOWNLOAD_RESOURCE = "download";
  public static final LocalizableString CONFIGURATION_LABEL = LocalizedConstants.CONFIGURATION_LABEL;
  public static final LocalizableString COMPOSITE_CONFIGURATION_LABEL =
    LocalizedConstants.COMPOSITE_CONFIGURATION_LABEL;
  public static final LocalizableString PROPERTY_LIST_CONFIGURATION_LABEL =
    LocalizedConstants.PROPERTY_LIST_CONFIGURATION_LABEL;
  public static final LocalizableString MONITORING_LABEL = LocalizedConstants.MONITORING_LABEL;
  public static final LocalizableString SECURITY_DATA_LABEL = LocalizedConstants.SECURITY_DATA_LABEL;
  private Provider provider;
  private String name;
  private String rootName;
  private LocalizableString label;
  private boolean readOnly;
  private String[] topLevelResources;
  private PageRepo pageRepo;

  public Root(
    Provider provider,
    String name,
    String rootName,
    LocalizableString label,
    boolean readOnly,
    String... topLevelResources
  ) {
    this.provider = provider;
    this.name = name;
    this.rootName = rootName;
    this.label = label;
    this.readOnly = readOnly;
    this.topLevelResources = topLevelResources;
  }

  public String getName() {
    return name;
  }

  public String getRootName() {
    return rootName;
  }

  public LocalizableString getLabel() {
    return label;
  }

  public PageRepo getPageRepo() {
    return pageRepo;
  }

  public void setPageRepo(PageRepo pageRepo) {
    this.pageRepo = pageRepo;
  }

  // Consider renaming this
  public JsonObject toJSON(InvocationContext ic) {
    JsonObjectBuilder ret = Json.createObjectBuilder();
    ret.add("name", name);
    ret.add("label", ic.getLocalizer().localizeString(label));
    String encodedProviderName = StringUtils.urlEncode(provider.getName());
    for (String topLevelResource : topLevelResources) {
      ret.add(
        topLevelResource,
        "/" + UriUtils.API_URI + "/" + encodedProviderName + "/" + name + "/" + topLevelResource
      );
    }
    if (readOnly) {
      ret.add("readOnly", true);
    }
    ret.add("actionsEnabled", true);
    return ret.build();
  }
}
