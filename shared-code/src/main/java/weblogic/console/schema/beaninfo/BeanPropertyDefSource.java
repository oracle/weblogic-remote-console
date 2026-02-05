// Copyright (c) 2021, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.schema.beaninfo;

import java.util.List;

import weblogic.console.schema.BooleanValue;
import weblogic.console.schema.ListValue;
import weblogic.console.schema.StringValue;
import weblogic.console.schema.Value;

/**
 * This POJO mirrors the yaml file format for a property (e.g. scalar
 * or child (e.g. a contained collection or singleton) of a type.
 * 
 * It parallels the information available in a WebLogic bean info,
 * which is a superset of what's available from a normal java bean info.
 */
public class BeanPropertyDefSource extends BeanValueDefSource {
  private StringValue name = StringValue.create();
  private StringValue descriptionHTML = StringValue.create();
  private BooleanValue key = BooleanValue.create();
  private BooleanValue writable = BooleanValue.create();
  private BooleanValue nullable = BooleanValue.create();
  private BooleanValue restartNeeded = BooleanValue.create();
  private BooleanValue redeployNeeded = BooleanValue.create();
  private BooleanValue encrypted = BooleanValue.create();
  private BooleanValue sensitive = BooleanValue.create();
  private BooleanValue transientVar = BooleanValue.create();
  private ListValue<String> creators = ListValue.create();
  private StringValue relationship = StringValue.create();
  private StringValue deprecated = StringValue.create();
  private StringValue obsolete = StringValue.create();
  private BooleanValue exclude = BooleanValue.create();
  private StringValue excludeFromRest = StringValue.create();
  private StringValue restInternal = StringValue.create();
  private BooleanValue extension = BooleanValue.create();
  private BooleanValue supported = BooleanValue.create(true);
  private Value<DefaultValueDefSource> defaultValue = Value.create();
  private Value<RolesDefSource> getRoles = Value.create();
  private Value<RolesDefSource> setRoles = Value.create();

  // The property's name
  public String getName() {
    return name.getValue();
  }

  public void setName(String val) {
    name = name.setValue(val);
  }

  // The property's description
  public String getDescriptionHTML() {
    return descriptionHTML.getValue();
  }

  public void setDescriptionHTML(String val) {
    descriptionHTML = descriptionHTML.setValue(val);
  }

  // Whether this property is used as the key
  // to look up children a collection.
  // For example, a ServerMBean's Name is its key property.
  public boolean isKey() {
    return key.getValue();
  }

  public void setKey(boolean val) {
    key = key.setValue(val);
  }

  // Whether this property is writable (v.s. read-only)
  public boolean isWritable() {
    return writable.getValue();
  }

  public void setWritable(boolean val) {
    writable = writable.setValue(val);
  }

  // Currently unused.
  public boolean isNullable() {
    return nullable.getValue();
  }

  public void setNullable(boolean val) {
    nullable = nullable.setValue(val);
  }

  // Whether WebLogic servers need to be restarted before they
  // can see changes to this property.  This is WebLogic specific.
  public boolean isRestartNeeded() {
    return restartNeeded.getValue();
  }

  public void setRestartNeeded(boolean val) {
    restartNeeded = restartNeeded.setValue(val);
  }

  // WebLogic specific.  Currently unused.
  public boolean isRedeployNeeded() {
    return redeployNeeded.getValue();
  }

  public void setRedeployNeeded(boolean val) {
    redeployNeeded = redeployNeeded.setValue(val);
  }

  // implies secret - could be named better

  // Whether this property is encrypted.
  // This implies that the property holds sensitive data.
  public boolean isEncrypted() {
    return encrypted.getValue();
  }

  public void setEncrypted(boolean val) {
    encrypted = encrypted.setValue(val);
  }

  // Whether this property is sensitive.
  // This implies that the property holds sensitive data.
  public boolean isSensitive() {
    return sensitive.getValue();
  }

  public void setSensitive(boolean val) {
    sensitive = sensitive.setValue(val);
  }

  // WebLogic specific.  Currently unused.
  public boolean isTransient() {
    return transientVar.getValue();
  }

  public void setTransient(boolean val) {
    transientVar = transientVar.setValue(val);
  }

  // WLS specific - only used to determine if this child bean is create-able

  // WebLogic specific.  The list of create method names for this
  // child bean property. Currently only used to determine whether
  // the child bean is creatable (e.g. you can create a ServerMBean
  // but you can't create a ServerLifeCycleRuntimeMBean).
  public List<String> getCreators() {
    return creators.getValue();
  }

  public void setCreators(List<String> val) {
    creators = creators.setValue(val);
  }

  public void addCreator(String val) {
    creators = creators.add(val);
  }

  // Whether this child bean property is creatable.
  public boolean isCreatable() {
    return !getCreators().isEmpty();
  }

  // This property's value is a reference to another bean.
  // What is the nature of the relationship between this property
  // and that bean?  either 'reference' (e.g. a ServerMBean's Cluster
  // property  references a MachineBean) or 'containment' (e.g. a
  // DomainMBean's Servers property contains (parents) ServerMBeans.
  public String getRelationship() {
    return relationship.getValue();
  }

  public void setRelationship(String val) {
    relationship = relationship.setValue(val);
  }

  // Whether this property holds a sensitive value.
  @Override
  public boolean isSecret() {
    return isEncrypted();
  }

  // Whether this property is a reference to an other bean.
  @Override
  public boolean isReference() {
    return "reference".equals(getRelationship());
  }

  // Whether this property holds a collection of child beans
  // or a single child bean.
  public boolean isChild() {
    return "containment".equals(getRelationship());
  }

  // Currently unused.
  public String getDeprecated() {
    return deprecated.getValue();
  }

  public void setDeprecated(String val) {
    deprecated = deprecated.setValue(val);
  }

  public String getObsolete() {
    return obsolete.getValue();
  }

  public void setObsolete(String val) {
    obsolete = obsolete.setValue(val);
  }

  public boolean isExclude() {
    return exclude.getValue();
  }

  public void setExclude(boolean val) {
    exclude = exclude.setValue(val);
  }

  // Currently unused.
  public String getExcludeFromRest() {
    return excludeFromRest.getValue();
  }

  public void setExcludeFromRest(String val) {
    excludeFromRest = excludeFromRest.setValue(val);
  }

  // Currently unused.
  public String getRestInternal() {
    return restInternal.getValue();
  }

  public void setRestInternal(String val) {
    restInternal = restInternal.setValue(val);
  }

  // Whether this property was defined in extension.yaml,
  // i.e. did not come from a harvested bean info
  public boolean isExtension() {
    return extension.getValue();
  }

  public void setExtension(boolean val) {
    extension = extension.setValue(val);
  }

  // Currently unused.
  public boolean isSupported() {
    return supported.getValue();
  }

  public void setSupported(boolean val) {
    supported = supported.setValue(val);
  }

  // The default value to use for this property.
  public DefaultValueDefSource getDefaultValue() {
    return defaultValue.getValue();
  }

  public void setDefaultValue(DefaultValueDefSource val) {
    defaultValue = defaultValue.setValue(val);
  }

  // The roles that are allowed to get this property
  public RolesDefSource getGetRoles() {
    return getRoles.getValue();
  }

  public void setGetRoles(RolesDefSource value) {
    getRoles = getRoles.setValue(value);
  }

  // The roles that are allowed to set this property
  public RolesDefSource getSetRoles() {
    return setRoles.getValue();
  }

  public void setSetRoles(RolesDefSource value) {
    setRoles = setRoles.setValue(value);
  }

  @Override
  protected void validateExtension() {
    super.validateExtension();
    validateExtensionChild(getDefaultValue(), "defaultValue");
    validateExtensionChild(getGetRoles(), "getRoles");
    validateExtensionChild(getSetRoles(), "setRoles");
  }
}
