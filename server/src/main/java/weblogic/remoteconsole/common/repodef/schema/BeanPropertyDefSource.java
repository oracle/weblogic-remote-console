// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import java.util.List;

/**
 * This POJO mirrors the yaml file format for a property (e.g. scalar
 * or child (e.g. a contained collection or singleton) of a type.
 * 
 * It parallels the information available in a WebLogic bean info,
 * which is a superset of what's available from a normal java bean info.
 */
public class BeanPropertyDefSource extends BeanValueDefSource {
  private StringValue name = new StringValue();
  private StringValue descriptionHTML = new StringValue();
  private BooleanValue key = new BooleanValue();
  private BooleanValue writable = new BooleanValue();
  private BooleanValue nullable = new BooleanValue();
  private BooleanValue restartNeeded = new BooleanValue();
  private BooleanValue redeployNeeded = new BooleanValue();
  private BooleanValue encrypted = new BooleanValue();
  private BooleanValue sensitive = new BooleanValue();
  private BooleanValue transientVar = new BooleanValue();
  private ListValue<Object> legalValues = new ListValue<>();
  private ListValue<String> creators = new ListValue<>();
  private StringValue relationship = new StringValue();
  private StringValue deprecated = new StringValue();
  private StringValue obsolete = new StringValue();
  private BooleanValue exclude = new BooleanValue();
  private StringValue excludeFromRest = new StringValue();
  private StringValue restInternal =  new StringValue();
  private BooleanValue extension =  new BooleanValue();
  private BooleanValue supported = new BooleanValue(true);
  private Value<DefaultValueDefSource> defaultValue = new Value<>(null);
  private Value<RolesDefSource> getRoles = new Value<>(null);
  private Value<RolesDefSource> setRoles = new Value<>(null);

  // The property's name
  public String getName() {
    return name.getValue();
  }

  public void setName(String val) {
    name.setValue(val);
  }

  // The property's description
  public String getDescriptionHTML() {
    return descriptionHTML.getValue();
  }

  public void setDescriptionHTML(String val) {
    descriptionHTML.setValue(val);
  }

  // Whether this property is used as the key
  // to look up children a collection.
  // For example, a ServerMBean's Name is its key property.
  public boolean isKey() {
    return key.getValue();
  }

  public void setKey(boolean val) {
    key.setValue(val);
  }

  // Whether this property is writable (v.s. read-only)
  public boolean isWritable() {
    return writable.getValue();
  }

  public void setWritable(boolean val) {
    writable.setValue(val);
  }

  // Currently unused.
  public boolean isNullable() {
    return nullable.getValue();
  }

  public void setNullable(boolean val) {
    nullable.setValue(val);
  }

  // Whether WebLogic servers need to be restarted before they
  // can see changes to this property.  This is WebLogic specific.
  public boolean isRestartNeeded() {
    return restartNeeded.getValue();
  }

  public void setRestartNeeded(boolean val) {
    restartNeeded.setValue(val);
  }

  // WebLogic specific.  Currently unused.
  public boolean isRedeployNeeded() {
    return redeployNeeded.getValue();
  }

  public void setRedeployNeeded(boolean val) {
    redeployNeeded.setValue(val);
  }

  // implies secret - could be named better

  // Whether this property is encrypted.
  // This implies that the property holds sensitive data.
  public boolean isEncrypted() {
    return encrypted.getValue();
  }

  public void setEncrypted(boolean val) {
    encrypted.setValue(val);
  }

  // Whether this property is sensitive.
  // This implies that the property holds sensitive data.
  public boolean isSensitive() {
    return sensitive.getValue();
  }

  public void setSensitive(boolean val) {
    sensitive.setValue(val);
  }

  // WebLogic specific.  Currently unused.
  public boolean isTransient() {
    return transientVar.getValue();
  }

  public void setTransient(boolean val) {
    transientVar.setValue(val);
  }

  // The list of legal values for this property.
  // The values must match the property's type.
  public List<Object> getLegalValues() {
    return legalValues.getValue();
  }

  public void setLegalValues(List<Object> val) {
    ScalarUtils.validateScalars(val);
    legalValues.setValue(val);
  }

  public void addLegalValue(Object val) {
    legalValues.add(val);
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
    creators.setValue(val);
  }

  public void addCreator(String val) {
    creators.add(val);
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
    relationship.setValue(val);
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
    deprecated.setValue(val);
  }

  public String getObsolete() {
    return obsolete.getValue();
  }

  public void setObsolete(String val) {
    obsolete.setValue(val);
  }

  public boolean isExclude() {
    return exclude.getValue();
  }

  public void setExclude(boolean val) {
    exclude.setValue(val);
  }

  // Currently unused.
  public String getExcludeFromRest() {
    return excludeFromRest.getValue();
  }

  public void setExcludeFromRest(String val) {
    excludeFromRest.setValue(val);
  }

  // Currently unused.
  public String getRestInternal() {
    return restInternal.getValue();
  }

  public void setRestInternal(String val) {
    restInternal.setValue(val);
  }

  // Whether this property was defined in extension.yaml,
  // i.e. did not come from a harvested bean info
  public boolean isExtension() {
    return extension.getValue();
  }

  public void setExtension(boolean val) {
    extension.setValue(val);
  }

  // Currently unused.
  public boolean isSupported() {
    return supported.getValue();
  }

  public void setSupported(boolean val) {
    supported.setValue(val);
  }

  // The default value to use for this property.
  public DefaultValueDefSource getDefaultValue() {
    return defaultValue.getValue();
  }

  public void setDefaultValue(DefaultValueDefSource val) {
    defaultValue.setValue(val);
  }

  // The roles that are allowed to get this property
  public RolesDefSource getGetRoles() {
    return getRoles.getValue();
  }

  public void setGetRoles(RolesDefSource value) {
    getRoles.setValue(value);
  }

  // The roles that are allowed to set this property
  public RolesDefSource getSetRoles() {
    return setRoles.getValue();
  }

  public void setSetRoles(RolesDefSource value) {
    setRoles.setValue(value);
  }
}
