// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import weblogic.remoteconsole.common.utils.Path;

/**
 * This POJO mirrors the yaml source file format for customizing information about an action on
 * type, e.g. ServerLifeCycleRuntimeMBean/type.yaml
 */
public class BeanActionDefCustomizerSource extends BeanValueDefCustomizerSource {
  private StringValue name = new StringValue();
  private StringValue label = new StringValue();
  private Value<UsedIfDefSource> usedIf = new Value<>(null);
  private StringValue actionMethod = new StringValue();
  private Value<BeanActionDefSource> definition = new Value<>(null);

  public void merge(BeanActionDefCustomizerSource from, Path fromContainedBeanPath) {
    // don't merge name - it's fixed by whoever created this instance
    super.merge(from, fromContainedBeanPath);
    label.merge(from.label, fromContainedBeanPath);
    actionMethod.merge(from.actionMethod, fromContainedBeanPath);
    definition.merge(from.definition, fromContainedBeanPath);
    mergeUsedIf(from, fromContainedBeanPath);
  }

  private void mergeUsedIf(BeanActionDefCustomizerSource from, Path fromContainedBeanPath) {
    if (from.usedIf.isSpecifiedInYaml()) {
      setUsedIf(new UsedIfDefSource(from.getUsedIf(), fromContainedBeanPath));
    }
  }

  // The name of the action (i.e. in the urls, PDJs and RDJs)
  public String getName() {
    return name.getValue();
  }

  public void setName(String value) {
    name.setValue(value);
  }

  // The english label to display for this action.
  public String getLabel() {
    return label.getValue();
  }

  public void setLabel(String value) {
    this.label.setValue(value);
  }

  // When this action should be enabled.
  // If not specified, then this action should always be enabled.
  public UsedIfDefSource getUsedIf() {
    return usedIf.getValue();
  }

  public void setUsedIf(UsedIfDefSource value) {
    usedIf.setValue(value);
  }

  // Customizes the implementation of this action.  Optional.
  // The format is <package>.<class>.<method>
  //
  // required signature:
  //  public static Response<Value> <method>(InvocationContext ic)
  //
  // The CBE ensures that the bean referenced by ic exists
  // before calling this method.
  public String getActionMethod() {
    return actionMethod.getValue();
  }

  public void setActionMethod(String value) {

    actionMethod.setValue(value);
  }

  // If this action was not configured in type.yaml or extension.yaml,
  // i.e. only exists at the page level, not the bean level,
  // this returns the rest of the information about the action.
  public BeanActionDefSource getDefinition() {
    return definition.getValue();
  }

  public void setDefinition(BeanActionDefSource value) {
    definition.setValue(value);
  }

  public String toString() {
    return getName();
  }
}
