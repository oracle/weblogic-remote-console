// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.typedesc;

import java.util.ArrayList;
import java.util.List;

import weblogic.console.backend.utils.ListUtils;

/**
 * This POJO mirrors the yaml file format for configuring console-specific information about a
 * weblogic bean type, e.g. ClusterMBean/type.yaml
 */
public class ConsoleWeblogicBeanType {
  private List<ConsoleWeblogicBeanProperty> properties = new ArrayList<>();

  public List<ConsoleWeblogicBeanProperty> getProperties() {
    return properties;
  }

  public void setProperties(List<ConsoleWeblogicBeanProperty> properties) {
    this.properties = ListUtils.nonNull(properties);
  }

  // if not null or empty, then this heterogeneous, and each sub type lists an
  // instantiable sub type of this type.
  private List<SubType> subTypes = new ArrayList<>();

  public List<SubType> getSubTypes() {
    return subTypes;
  }

  public void setSubTypes(List<SubType> subTypes) {
    this.subTypes = ListUtils.nonNull(subTypes);
  }

  // if not null or empty, it signifies that this is a heterogeneous type,
  // and the value of this property contains the name of the property on the
  // instances of this type that can be used to distinguish which sub type an instance is.
  private String subTypeDiscriminatorProperty;

  public String getSubTypeDiscriminatorProperty() {
    return subTypeDiscriminatorProperty;
  }

  public void setSubTypeDiscriminatorProperty(String subTypeDiscriminatorProperty) {
    this.subTypeDiscriminatorProperty = subTypeDiscriminatorProperty;
  }

  private String weblogicBeanType;

  public String getWeblogicBeanType() {
    return weblogicBeanType;
  }

  public void setWeblogicBeanType(String weblogicBeanType) {
    this.weblogicBeanType = weblogicBeanType;
  }

  /**
   * Specifics a custom static method to call to delete an instance of this bean type. (overrides
   * the standard delete behavior).
   * <p>
   * The method signature declares the input data the plugin requires (just like for get and
   * options methods).
   * <p>
   * The method is called after the CBE checks that the bean exists and after it starts a
   * configuration transaction.
   * <p>
   * This method completely takes over deleting the bean and is responsible for:
   * <ul>
   *   <li>
   *     deleting the bean
   *   </li>
   *   <li>
   *     deleting any other beans that must be removed too
   *     (e.g. the automatically created migratable target for a server)
   *   </li>
   *   <li>
   *     removing any references to this bean
   *     (e.g. removing any references from servers to a cluster that's being deleted)
   *   </li>
   * </ul>
   */
  private String deleteMethod; // <package>.<class>.<method>

  public String getDeleteMethod() {
    return this.deleteMethod;
  }

  public void setDeleteMethod(String deleteMethod) {
    this.deleteMethod = deleteMethod;
  }

  // Custom code to customize creating an instance of this type.
  //
  // required signature:
  //
  //  public static JsonArray <method>(
  //
  //    // the connection to the weblogic domain:
  //    Connection connection,
  //
  //    // if creating a new bean in a collection, 'identity' is
  //    // the identity of the bean that parents the collection.
  //    // if creating an optional singleton, identity is
  //    // the identity of the bean to create.
  //    WeblogicBeanIdentity identity,
  //
  //    // the object that reads and writes the weblogic configuration:
  //    WeblogicConfiguration configuration,
  //
  //    // the client's request body, i.e. the properties that configure the new bean
  //    JsonObject requestBody
  //  ) throws Exception
  //
  //  This method is fully responsible for creating the new mbean:
  //  - ensuring that parentIdentity exists
  //  - ensuring that properties are valid
  //  - starting a config transaction
  //  - creating the new mbean
  //  - saving the mbean changes
  //  - returning any messages that need to be displayed to the client (in RDJ terms)
  private String createMethod; // <package>.<class>.<method>

  public String getCreateMethod() {
    return this.createMethod;
  }

  public void setCreateMethod(String createMethod) {
    this.createMethod = createMethod;
  }

  /**
   * Specifics a custom static method to call to get the form properties for the create form RDJ
   * for this bean type (overrides the standard create form RDJ behavior).
   * <p>
   * The method signature declares the input data the plugin requires (just like for get and
   * options methods).
   * <p>
   * This method must return a JsonObject containing the fields that will be added to the
   * returned create form RDJ.  That is, the default values and options for the create form's fields.
   */
  private String createFormPropertiesMethod; // <package>.<class>.<method>

  public String getCreateFormPropertiesMethod() {
    return this.createFormPropertiesMethod;
  }

  public void setCreateFormPropertiesMethod(String createFormPropertiesMethod) {
    this.createFormPropertiesMethod = createFormPropertiesMethod;
  }

  /**
   * Used to turn off the entire type's mbean javadoc links. Used to work around the case where the
   * public oracle mbean javadoc for JMSConnectionFactoryBean doesn't work (i.e. it seems to get
   * confused with the JmsConnectionFactoryBean javadoc)
   */
  private boolean disableMBeanJavadoc;

  public boolean isDisableMBeanJavadoc() {
    return this.disableMBeanJavadoc;
  }

  public void setDisableMBeanJavadoc(boolean disableMBeanJavadoc) {
    this.disableMBeanJavadoc = disableMBeanJavadoc;
  }

  /**
   * Specifics a custom static JAXRS resource class that handles all
   * the REST requests for a collection of this mbean type.
   * <p>
   * The class must extend com.oracle.weblogic.console.backend.services.WeblogicBeanResource
   * <p>
   * If not specified, the a default REST implemenation will be used instead.
   */
  private String collectionResourceClass; // <package>.<class>

  public String getCollectionResourceClass() {
    return this.collectionResourceClass;
  }

  public void setCollectionResourceClass(String collectionResourceClass) {
    this.collectionResourceClass = collectionResourceClass;
  }

  /**
   * Specifics a custom static JAXRS resource class that handles all
   * the REST requests for an instance of this mbean type.
   * <p>
   * The class must extend com.oracle.weblogic.console.backend.services.WeblogicBeanResource
   * <p>
   * If not specified, the a default REST implemenation will be used instead.
   */
  private String instanceResourceClass; // <package>.<class>

  public String getInstanceResourceClass() {
    return this.instanceResourceClass;
  }

  public void setInstanceResourceClass(String instanceResourceClass) {
    this.instanceResourceClass = instanceResourceClass;
  }
}
