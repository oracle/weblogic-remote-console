// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.typedesc;

import java.util.ArrayList;
import java.util.List;

import weblogic.console.backend.utils.ListUtils;

/**
 * This POJO mirrors the yaml file format for the weblogic bean property information harvested from
 * a weblogic BeanInfo, e.g. harvestedWeblogicBeanTypes/14.1.0.0.0/ClusterMBean.yaml
 */
public class HarvestedWeblogicBeanProperty {
  private String name;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  private boolean array = false;

  public boolean isArray() {
    return array;
  }

  public void setArray(boolean array) {
    this.array = array;
  }

  private String type;

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  private String descriptionHTML;

  public String getDescriptionHTML() {
    return descriptionHTML;
  }

  public void setDescriptionHTML(String descriptionHTML) {
    this.descriptionHTML = descriptionHTML;
  }

  private boolean key = false;

  public boolean isKey() {
    return key;
  }

  public void setKey(boolean key) {
    this.key = key;
  }

  private boolean writable = false;

  public boolean isWritable() {
    return writable;
  }

  public void setWritable(boolean writable) {
    this.writable = writable;
  }

  private boolean nullable = false;

  public boolean isNullable() {
    return nullable;
  }

  public void setNullable(boolean nullable) {
    this.nullable = nullable;
  }

  private boolean restartNeeded = false;

  public boolean isRestartNeeded() {
    return restartNeeded;
  }

  public void setRestartNeeded(boolean restartNeeded) {
    this.restartNeeded = restartNeeded;
  }

  private boolean redeployNeeded = false;

  public boolean isRedeployNeeded() {
    return redeployNeeded;
  }

  public void setRedeployNeeded(boolean redeployNeeded) {
    this.redeployNeeded = redeployNeeded;
  }

  private boolean encrypted = false;

  public boolean isEncrypted() {
    return encrypted;
  }

  public void setEncrypted(boolean encrypted) {
    this.encrypted = encrypted;
  }

  private boolean transientVar = false;

  public boolean isTransient() {
    return transientVar;
  }

  public void setTransient(boolean transientVar) {
    this.transientVar = transientVar;
  }

  private List<Object> legalValues = new ArrayList<>();

  public List<Object> getLegalValues() {
    return legalValues;
  }

  public void setLegalValues(List<Object> legalValues) {
    this.legalValues = ListUtils.nonNull(legalValues);
  }

  private List<String> creators = new ArrayList<>();

  public List<String> getCreators() {
    return creators;
  }

  public void setCreators(List<String> creators) {
    this.creators = ListUtils.nonNull(creators);
  }

  private String relationship = "";

  public String getRelationship() {
    return relationship;
  }

  public void setRelationship(String relationship) {
    this.relationship = relationship;
  }

  private String deprecated;

  public String getDeprecated() {
    return deprecated;
  }

  public void setDeprecated(String deprecated) {
    this.deprecated = deprecated;
  }

  private String obsolete;

  public String getObsolete() {
    return obsolete;
  }

  public void setObsolete(String obsolete) {
    this.obsolete = obsolete;
  }

  private boolean exclude;

  public boolean isExclude() {
    return exclude;
  }

  public void setExclude(boolean exclude) {
    this.exclude = exclude;
  }

  private String excludeFromRest;

  public String getExcludeFromRest() {
    return excludeFromRest;
  }

  public void setExcludeFromRest(String excludeFromRest) {
    this.excludeFromRest = excludeFromRest;
  }

  private String restInternal;

  public String getRestInternal() {
    return restInternal;
  }

  public void setRestInternal(String restInternal) {
    this.restInternal = restInternal;
  }

  // Whether this property was defined in extension.yaml,
  // i.e. did not come from a harvested bean info
  private boolean extension;

  public boolean isExtension() {
    return extension;
  }

  public void setExtension(boolean extension) {
    this.extension = extension;
  }

  private boolean supported = true;

  public boolean isSupported() {
    return supported;
  }

  public void setSupported(boolean supported) {
    this.supported = supported;
  }

  // The default value to use for this property.
  private HarvestedDefaultValue defaultValue;

  public HarvestedDefaultValue getDefaultValue() {
    return this.defaultValue;
  }

  public void setDefaultValue(HarvestedDefaultValue defaultValue) {
    this.defaultValue = defaultValue;
  }
}
