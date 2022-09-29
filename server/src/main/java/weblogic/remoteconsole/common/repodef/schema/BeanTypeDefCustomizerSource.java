// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef.schema;

import java.util.List;

/**
 * This POJO mirrors the yaml source file format for customizing information about type,
 * e.g. ServerLifeCycleRuntimeMBean/type.yaml.
 */
public class BeanTypeDefCustomizerSource {
  private ListValue<BeanPropertyDefCustomizerSource> properties = new ListValue<>();
  private ListValue<BeanChildDefCustomizerSource> children = new ListValue<>();
  private ListValue<BeanActionDefCustomizerSource> actions = new ListValue<>();
  private ListValue<SubTypeDefSource> subTypes = new ListValue<>();
  private StringValue subTypeDiscriminatorProperty = new StringValue();
  private StringValue deleteMethod = new StringValue();
  private StringValue createResourceMethod = new StringValue();
  private StringValue getCollectionMethod = new StringValue();
  private BooleanValue disableMBeanJavadoc = new BooleanValue();
  private StringValue instanceName = new StringValue();
  private BooleanValue referenceable = new BooleanValue();
  private BooleanValue ordered = new BooleanValue();
  private BooleanValue editable = new BooleanValue();
  private BooleanValue supportsCustomFilteringDashboards = new BooleanValue(true);

  // The list of properties on this type that have been customized.
  public List<BeanPropertyDefCustomizerSource> getProperties() {
    return properties.getValue();
  }

  public void setProperties(List<BeanPropertyDefCustomizerSource> value) {
    properties.setValue(value);
  }

  public void addProperty(BeanPropertyDefCustomizerSource value) {
    properties.add(value);
  }

  // The list of children (i.e. collections and singletons) on this
  // type that have been customized.
  public List<BeanChildDefCustomizerSource> getChildren() {
    return children.getValue();
  }

  public void setChildren(List<BeanChildDefCustomizerSource> value) {
    children.setValue(value);
  }

  public void addChild(BeanChildDefCustomizerSource value) {
    children.add(value);
  }

  // The list of actions on this type that have been customized.
  public List<BeanActionDefCustomizerSource> getActions() {
    return actions.getValue();
  }

  public void setActions(List<BeanActionDefCustomizerSource> value) {
    actions.setValue(value);
  }

  public void addAction(BeanActionDefCustomizerSource value) {
    actions.add(value);
  }

  // The list of instantiable derived (sub) types of this type.
  // If not empty, then this type is heterogeneous.

  public List<SubTypeDefSource> getSubTypes() {
    return subTypes.getValue();
  }

  public void setSubTypes(List<SubTypeDefSource> value) {
    subTypes.setValue(value);
  }

  public void addSubTypes(SubTypeDefSource value) {
    subTypes.add(value);
  }

  // The name of the property on this type that can be used to
  // determine which sub type an instance is.  Only meaningful
  // for heterogenous types.
  //
  // If null or empty, the type is homogeneous.
  public String getSubTypeDiscriminatorProperty() {
    return subTypeDiscriminatorProperty.getValue();
  }

  public void setSubTypeDiscriminatorProperty(String value) {
    subTypeDiscriminatorProperty.setValue(value);
  }

  // Specifics a custom static method to call to delete an instance of this bean type. (overrides
  // the standard delete behavior). The format is <package>.<class>.<method>
  //
  // The method is called after the CBE checks that the bean exists and after it starts a
  // configuration transaction.
  //
  // This method completely takes over deleting the bean and is responsible for:
  // - deleting the bean
  // - deleting any other beans that must be removed too
  //   (e.g. the automatically created migratable target for a server)
  // - removing any references to this bean
  // (e.g. removing any references from servers to a cluster that's being deleted)

  public String getDeleteMethod() {
    return deleteMethod.getValue();
  }

  public void setDeleteMethod(String value) {
    deleteMethod.setValue(value);
  }

  // Specifics the name of a custom static method to call to create the JAXRS resource 
  // for this type. The format is <package>.<class>.<method>
  //
  // Required signature: BaseResource mymethod(InvocationContext ic)
  //
  // Either returns a new BaseResource instance which will be used to handle this request,
  // or returns null, indicating that the standard resource for the invocation context
  // should be used.
  public String getCreateResourceMethod() {
    return createResourceMethod.getValue();
  }

  public void setCreateResourceMethod(String value) {
    createResourceMethod.setValue(value);
  }

  // Specifics the name of a custom static method to call get a collection of this type.
  // The format is <package>.<class>.<method>
  //
  // Required signature:
  //   Response<List<CustomBeanSearchResults>> mymethod(
  //     InvocationContext ic,
  //     BeanTreePath beanTreePath,
  //     BeanReaderRepoSearchResults,
  //     List<BeanPropertyDef> propertyDefs
  //   )
  public String getGetCollectionMethod() {
    return getCollectionMethod.getValue();
  }

  public void setGetCollectionMethod(String value) {
    getCollectionMethod.setValue(value);
  }

  // Used to turn off the entire type's mbean javadoc links.
  // Used to work around the case where the public oracle mbean javadoc for 
  // JMSConnectionFactoryBean doesn't work (i.e. it seems to get
  // confused with the JmsConnectionFactoryBean javadoc)
  public boolean isDisableMBeanJavadoc() {
    return disableMBeanJavadoc.getValue();
  }

  public void setDisableMBeanJavadoc(boolean value) {
    disableMBeanJavadoc.setValue(value);
  }

  // Specifics the name to use when referring to instances of this type, e.g. Server Runtimes.
  // It is not localized.  It's used in the page help titles for referring to bean types.
  public String getInstanceName() {
    return instanceName.getValue();
  }

  public void setInstanceName(String value) {
    instanceName.setValue(value);
  }

  // Whether beans of this type can be referenced by other beans.
  public boolean isReferenceable() {
    return referenceable.getValue();
  }

  public void setReferenceable(boolean value) {
    referenceable.setValue(value);
  }


  // Whether collections of this type are ordered.
  public boolean isOrdered() {
    return ordered.getValue();
  }

  public void setOrdered(boolean value) {
    ordered.setValue(value);
  }


  // Indicates that whether this type is editable is specified in type.yaml
  // (v.s. v.s. using the defaults for the bean repo)
  //
  // e.g. a DefaultAuthenticator's Group child is editable, even
  // when accessed from the server config perspective, which is read-only.
  public boolean isEditableSpecifiedInYaml() {
    return editable.isSpecifiedInYaml();
  }

  // Whether the type is editable.
  public boolean isEditable() {
    if (!isEditableSpecifiedInYaml()) {
      throw new AssertionError("isEditable called when isEditableSpecifiedInYaml is false");
    }
    return editable.getValue();
  }

  public void setEditable(boolean value) {
    editable.setValue(value);
  }

  // Whether this type supports custom filtering dashboards.
  // e.g. we won't want to support creating custom filtering dashboards
  // for simple searches.
  public boolean isSupportsCustomFilteringDashboards() {
    return supportsCustomFilteringDashboards.getValue();
  }

  public void setSupportsCustomFilteringDashboards(boolean value) {
    supportsCustomFilteringDashboards.setValue(value);
  }
}
