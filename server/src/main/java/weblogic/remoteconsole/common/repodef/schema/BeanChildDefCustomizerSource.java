// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import java.util.List;

import weblogic.remoteconsole.common.utils.Path;

/**
 * This POJO mirrors the yaml source file format for customizing information about
 * child of a type (i.e. singleton contained bean or collection of contained beans
 * e.g. ServerTemplateMBean/type.yaml
 */
public class BeanChildDefCustomizerSource {
  private StringValue name = new StringValue();
  private StringValue onlineName = new StringValue();
  private StringValue offlineName = new StringValue();
  private BooleanValue useUnlocalizedNameAsLabel = new BooleanValue();
  private StringValue label = new StringValue();
  private StringValue singularLabel = new StringValue();
  private BooleanValue nonCreatableOptionalSingleton = new BooleanValue();
  private BooleanValue collapsedInWDT = new BooleanValue();
  private BooleanValue creatable = new BooleanValue();
  private BooleanValue deletable = new BooleanValue();
  private BooleanValue asyncCreate = new BooleanValue();
  private BooleanValue asyncDelete = new BooleanValue();
  private ListValue<String> requiredCapabilities = new ListValue<>();

  public void merge(BeanChildDefCustomizerSource from, Path fromContainedBeanPath) {
    // don't merge name - it's fixed by whoever created this instance
    onlineName.merge(from.onlineName, fromContainedBeanPath);
    offlineName.merge(from.offlineName, fromContainedBeanPath);
    useUnlocalizedNameAsLabel.merge(from.useUnlocalizedNameAsLabel, fromContainedBeanPath);
    label.merge(from.label, fromContainedBeanPath);
    singularLabel.merge(from.singularLabel, fromContainedBeanPath);
    nonCreatableOptionalSingleton.merge(from.nonCreatableOptionalSingleton, fromContainedBeanPath);
    collapsedInWDT.merge(from.collapsedInWDT, fromContainedBeanPath);
    creatable.merge(from.creatable, fromContainedBeanPath);
    deletable.merge(from.deletable, fromContainedBeanPath);
    asyncCreate.merge(from.asyncCreate, fromContainedBeanPath);
    asyncDelete.merge(from.asyncDelete, fromContainedBeanPath);
    requiredCapabilities.merge(from.requiredCapabilities, fromContainedBeanPath);
  }

  // The path from the page-relative bean type to this child,
  // e.g. if the top level bean is a DomainMBean
  // and this is the SecurityConfiguration singleton child's Realms
  // collection child, then the 'name' is 'SecurityConfiguration.Realms'.
  public String getName() {
    return name.getValue();
  }

  public void setName(String value) {
    name.setValue(value);
  }

  // The name of this child in online WebLogic admin server connections.
  // e.g. realms (instead of Realms)
  public String getOnlineName() {
    return onlineName.getValue();
  }

  public void setOnlineName(String value) {
    onlineName.setValue(value);
  }

  // The name of this property in offline WLST and in WDT models.
  // e.g. JdbcResource (instead of JDBCResource)
  public String getOfflineName() {
    return offlineName.getValue();
  }

  public void setOfflineName(String value) {
    offlineName.setValue(value);
  }

  // Whether to use the unlocalized name of the property as its label.
  public boolean isUseUnlocalizedNameAsLabel() {
    return useUnlocalizedNameAsLabel.getValue();
  }

  public void setUseUnlocalizedNameAsLabel(boolean value) {
    useUnlocalizedNameAsLabel.setValue(value);
  }

  // The english label to display for this child.
  public String getLabel() {
    return label.getValue();
  }

  public void setLabel(String value) {
    label.setValue(value);
  }

  // The english singular label to display for this child.
  public String getSingularLabel() {
    return singularLabel.getValue();
  }

  public void setSingularLabel(String value) {
    singularLabel.setValue(value);
  }

  // Usually the bean info give us enough information to determine the child's type, i.e.:
  //   - collection of contained beans
  //   - optional contained bean that the user can create and delete
  //   - automatically created contained bean that always exists and that the
  //     user cannot create or delete
  // However, there is one other child type that we can't figure out from the bean infos:
  //   - optional contained bean that the user cannot create or delete
  //     (used for a server's default JTA migratable target - it exists only if the
  //     server has a corresponding migratable target)
  // Since the CBE and CFE need to know about this pattern, it must be configured in
  // type.yaml using this property:
  public boolean isNonCreatableOptionalSingleton() {
    return nonCreatableOptionalSingleton.getValue();
  }

  public void setNonCreatableOptionalSingleton(boolean value) {
    nonCreatableOptionalSingleton.setValue(value);
  }

  // Whether this collection should be collapsed in WDT
  // e.g. JDBCDriverParamsBean has Properties singleton bean
  // that has a Properties collection of beans.
  // In WDT, the Properties singleton is omitted.
  public boolean isCollapsedInWDT() {
    return collapsedInWDT.getValue();
  }

  public void setCollapsedInWDT(boolean value) {
    collapsedInWDT.setValue(value);
  }

  // Indicates that whether this child is creatable is specified in type.yaml
  // (v.s. looking at its BeanPropertyDefSource)
  //
  // e.g. DomainMBean's Libraries and AppDeployments collections
  // bean infos don't have creators, so appear to be read-only,
  // but the WLS REST api has custom REST resources for creating these deployments
  // so they really are creatable and we need to configure that in type.yaml
  public boolean isCreatableSpecifiedInYaml() {
    return creatable.isSpecifiedInYaml();
  }

  // Whether the child is creatable.
  public boolean isCreatable() {
    if (!isCreatableSpecifiedInYaml()) {
      throw new AssertionError("isCreatable called when isCreatableSpecifiedInYaml is false");
    }
    return creatable.getValue();
  }

  public void setCreatable(boolean value) {
    creatable.setValue(value);
  }

  // Indicates that whether this child is deletable is specified in type.yaml
  // (v.s. looking at its BeanPropertyDefSource)
  //
  // e.g. the DomainRuntimeMBean's Dashboard collection is
  // deletable, but not creatable.
  public boolean isDeletableSpecifiedInYaml() {
    return deletable.isSpecifiedInYaml();
  }

  // Whether this child is deletable.
  public boolean isDeletable() {
    if (!isDeletableSpecifiedInYaml()) {
      throw new AssertionError("isDeletable called when isDeletableSpecifiedInYaml is false");
    }
    return deletable.getValue();
  }

  public void setDeletable(boolean value) {
    deletable.setValue(value);
  }

  // Whether creating this child is asynchronous.
  public boolean isAsyncCreate() {
    return asyncCreate.getValue();
  }

  public void setAsyncCreate(boolean value) {
    asyncCreate.setValue(value);
  }

  // Whether deleting this child is asynchronous.
  public boolean isAsyncDelete() {
    return asyncDelete.getValue();
  }

  public void setAsyncDelete(boolean value) {
    asyncDelete.setValue(value);
  }

  // The bean repo capabilities that are required for child type to be present
  public List<String> getRequiredCapabilities() {
    return requiredCapabilities.getValue();
  }

  public void setRequiredCapabilities(List<String> val) {
    requiredCapabilities.setValue(val);
  }
}
