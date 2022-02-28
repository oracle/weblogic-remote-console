// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.providers;

import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;

import weblogic.remoteconsole.common.repodef.LocalizableString;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.PageRepo;

public class Root {
  public static final String EDIT_NAME = "edit";
  public static final LocalizableString EDIT_LABEL = LocalizedConstants.EDIT_LABEL;
  public static final String PROPERTY_LIST_CONFIGURATION_NAME = "propertyList";
  public static final String COMPOSITE_CONFIGURATION_NAME = "compositeConfig";
  public static final String SERVER_CONFIGURATION_NAME = "serverConfig";
  public static final String DOMAIN_RUNTIME_NAME = "domainRuntime";
  public static final String CONFIGURATION_ROOT = "Domain";
  public static final LocalizableString CONFIGURATION_LABEL = LocalizedConstants.CONFIGURATION_LABEL;
  public static final LocalizableString PROPERTY_LIST_CONFIGURATION_LABEL =
    LocalizedConstants.PROPERTY_LIST_CONFIGURATION_LABEL;
  public static final String MONITORING_ROOT = "DomainRuntime";
  public static final LocalizableString MONITORING_LABEL = LocalizedConstants.MONITORING_LABEL;
  private String name;
  private String rootName;
  private LocalizableString label;
  private String navtree;
  private String changeManager;
  private String download;
  private boolean readOnly;
  private PageRepo pageRepo;

  public Root(
    String name,
    String rootName,
    LocalizableString label,
    String navtree,
    String changeManager,
    boolean readOnly
  ) {
    this(name, rootName, label, navtree, changeManager, null, readOnly);
  }

  public Root(
    String name,
    String rootName,
    LocalizableString label,
    String navtree,
    String changeManager,
    String download,
    boolean readOnly
  ) {
    this.name = name;
    this.rootName = rootName;
    this.label = label;
    this.navtree = navtree;
    this.changeManager = changeManager;
    this.download = download;
    this.readOnly = readOnly;
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
    ret.add("navtree", navtree);
    if (changeManager != null) {
      ret.add("changeManager", changeManager);
    }
    if (download != null) {
      ret.add("download", download);
    }
    if (readOnly) {
      ret.add("readOnly", true);
    }
    ret.add("actionsEnabled", true);
    return ret.build();
  }
}
