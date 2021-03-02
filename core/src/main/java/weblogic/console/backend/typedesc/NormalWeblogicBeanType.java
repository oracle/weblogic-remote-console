// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.typedesc;

import java.util.List;

/**
 * This class holds the effective description of a real Weblogic bean type,
 * i.e. one defined in a type.yaml file, e.g. ClusterMBean/type.yaml
 */
public class NormalWeblogicBeanType extends WeblogicBeanType {

  private HarvestedWeblogicBeanTypeExtension harvestedTypeExtension;
  private ConsoleWeblogicBeanType consoleType;

  /*package*/ HarvestedWeblogicBeanTypeExtension getHarvestedTypeExtension() {
    return this.harvestedTypeExtension;
  }

  /*package*/ ConsoleWeblogicBeanType getConsoleType() {
    return this.consoleType;
  }

  @Override
  public String getName() {
    return getHarvestedType().getName();
  }

  @Override
  public String do_getSubTypeDiscriminatorPropertyName() {
    return getConsoleType().getSubTypeDiscriminatorProperty();
  }

  @Override
  public List<SubType> do_getSubTypes() {
    return (getConsoleType() != null) ? getConsoleType().getSubTypes() : null;
  }

  @Override
  public String getDeleteMethod() {
    return (getConsoleType() != null) ? getConsoleType().getDeleteMethod() : null;
  }

  @Override
  public String getCreateMethod() {
    return (getConsoleType() != null) ? getConsoleType().getCreateMethod() : null;
  }

  @Override
  public String getCreateFormPropertiesMethod() {
    return (getConsoleType() != null) ? getConsoleType().getCreateFormPropertiesMethod() : null;
  }

  @Override
  public String getCollectionResourceClass() {
    return (getConsoleType() != null) ? getConsoleType().getCollectionResourceClass() : null;
  }

  @Override
  public String getInstanceResourceClass() {
    return (getConsoleType() != null) ? getConsoleType().getInstanceResourceClass() : null;
  }

  public NormalWeblogicBeanType(
    WeblogicBeanTypes beanTypes,
    HarvestedWeblogicBeanType harvestedType,
    HarvestedWeblogicBeanTypeExtension harvestedTypeExtension,
    ConsoleWeblogicBeanType consoleType
  ) {
    super(beanTypes, harvestedType, consoleType);
    this.harvestedTypeExtension = harvestedTypeExtension;
    this.consoleType = consoleType;
  }
}
