// Copyright (c) 2021, 2022, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;

import weblogic.jdbc.utils.JDBCDriverAttribute;
import weblogic.jdbc.utils.JDBCDriverInfo;
import weblogic.jdbc.utils.JDBCDriverInfoException;
import weblogic.jdbc.utils.JDBCURLHelper;
import weblogic.jdbc.utils.JDBCURLHelperFactory;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.server.repo.ArrayValue;
import weblogic.remoteconsole.server.repo.BeanPropertyValue;
import weblogic.remoteconsole.server.repo.BeanPropertyValues;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.BeansPropertyValues;
import weblogic.remoteconsole.server.repo.BooleanValue;
import weblogic.remoteconsole.server.repo.CreateFormCreator;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Page;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.SecretValue;
import weblogic.remoteconsole.server.repo.SettableValue;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.repo.Value;
import weblogic.remoteconsole.server.repo.weblogic.WebLogicRestEditPageRepo;
import weblogic.remoteconsole.server.repo.weblogic.WebLogicRestInvoker;
import weblogic.remoteconsole.server.utils.WebLogicRestRequest;
import weblogic.remoteconsole.server.webapp.CreatableBeanCollectionResource;
import weblogic.remoteconsole.server.webapp.CreateHelper;
import weblogic.remoteconsole.server.webapp.GetPageResponseMapper;

import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.DATASOURCE_TYPE_GENERIC;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.DATASOURCE_TYPE_GRIDLINK;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.DATASOURCE_TYPE_MDS;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.DATASOURCE_TYPE_UCP;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.DEFAULT_TEST_CONFIGURATION;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.PROPERTY_DATASOURCE_TYPE;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.PROPERTY_DBMS_HOST;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.PROPERTY_DBMS_NAME;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.PROPERTY_DBMS_PASSWORD;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.PROPERTY_DBMS_PORT;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.PROPERTY_DBMS_USER_NAME;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.PROPERTY_GENERIC_DATABASE_TYPE;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.PROPERTY_GLOBAL_TRANSACTIONS_PROTOTOL;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.PROPERTY_GRIDLINK_DATABASE_DRIVER;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.PROPERTY_GRIDLINK_FAN_ENABLED;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.PROPERTY_GRIDLINK_LISTENERS;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.PROPERTY_GRIDLINK_ONS_NODE_LIST;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.PROPERTY_GRIDLINK_ONS_WALLET_FILE;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.PROPERTY_GRIDLINK_ONS_WALLET_PASSWORD;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.PROPERTY_TEST_CONFIGURATION;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.PROPERTY_UCP_DATABASE_DRIVER;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.PROPERTY_URL;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.driverNameToFormPropertyName;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.driverScopedName;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.genericDatabaseDriverProperty;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.getDBMSVendorNames;
import static weblogic.remoteconsole.customizers.JDBCSystemResourceMBeanCustomizerUtils.getDriverInfoFactory;

/** 
 * Custom JAXRS resource for creating JDBCSystemResourceMBeans
 */
public class JDBCSystemResourceMBeanCreatableCollectionResource extends CreatableBeanCollectionResource {

  // Customize creating a JDBCSystemResourceMBean
  @Override
  protected javax.ws.rs.core.Response createCollectionChild(JsonObject requestBody) {
    return (new JDBCSystemResourceMBeanCreator()).createBean(getInvocationContext(), requestBody);
  }

  // Customize the JDBCSystemResourceMBean createForm RDJ
  @Override
  protected javax.ws.rs.core.Response getCreateForm() {
    Response<Page> response =
      getInvocationContext().getPageRepo().asPageReaderRepo().getPage(getInvocationContext());
    if (response.isSuccess()) {
      // For a few properties, the create form needs different values that the mbean defaults.
      // Since there isn't a yaml way to configure this, do it here.
      //
      // Note: since the form properties returned from getPage are read-only,
      // we need to replace them to change values.
      List<FormProperty> properties = response.getResults().asForm().getProperties();
      for (int i = 0; i < properties.size(); i++) {
        FormProperty prop = properties.get(i);
        String name = prop.getPropertyDef().getPropertyPath().getDotSeparatedPath();
        if (PROPERTY_DATASOURCE_TYPE.equals(name)) {
          properties.set(i, customizeDataSourceType(prop));
        } else if (PROPERTY_GRIDLINK_FAN_ENABLED.equals(name)) {
          properties.set(i, customizeGridLinkFanEnabled(prop));
        }
      }
    }
    return GetPageResponseMapper.toResponse(getInvocationContext(), response);
  }

  private FormProperty customizeDataSourceType(FormProperty property) {
    // The underlying WLS mbeans say that the default value for DatasourceType is null.
    // Change it to GENERIC in the remote console.
    // There isn't a way at the yaml level to configure this.
    // So, get the create form RDJ from the page repo, then
    // change the DatasourceType property's value to GENERIC.
    return
      new FormProperty(
        property.getPropertyDef(),
        new SettableValue(new StringValue(DATASOURCE_TYPE_GENERIC), false)
      );
  }

  private FormProperty customizeGridLinkFanEnabled(FormProperty property) {
    // The underlying WLS mbeans say that the default value is false.
    // Change it to true for GridLink data sources.
    return
      new FormProperty(
        property.getPropertyDef(),
        new SettableValue(new BooleanValue(true), false)
      );
  }

  private class JDBCSystemResourceMBeanCreator extends CreateHelper {
    @Override
    protected Response<Void> createBean(InvocationContext ic, List<FormProperty> formProperties) {
      FormPropertiesToBeansPropertyValuesConverter converter =
        new FormPropertiesToBeansPropertyValuesConverter(ic, formProperties);
      Response<Void> response = converter.convert();
      if (!response.isSuccess()) {
        return response;
      }
      response = testConfiguration(converter);
      if (!response.isSuccess()) {
        return response;
      }
      // Create the JDBCSystemResource mbean and set the properties on its mandatory singleton children.
      response = (new CreateFormCreator(ic, converter.getDataSourceValues())).create();
      if (!response.isSuccess()) {
        return response;
      }
      // Create the JDBCSystemResource's properties mbeans.
      for (BeansPropertyValues dataSourcePropertyValues : converter.getDataSourcePropertiesValues()) {
        response = (new CreateFormCreator(ic, dataSourcePropertyValues)).create();
        if (!response.isSuccess()) {
          return response;
        }
      }
      return new Response<Void>();
    }
  }

  private Response<Void> testConfiguration(FormPropertiesToBeansPropertyValuesConverter converter) {
    Response<Void> response = new Response<>();
    if (!(getInvocationContext().getPageRepo() instanceof WebLogicRestEditPageRepo)) {
      // Only the edit tree on an admin server connection can test the configuration
      // since we need to invoke a legacy REST operation to do it.
      return response;
    }
    if (!converter.isTestConfiguration()) {
      // The user doesn't want us to test the connection.
      // Instead the user just wants us to create the data source regardless.
      return response;
    }
    // The user wants us to test the connection and not create the data source if the test fails.
    Value typeValue = converter.findRequiredDataSourceValue("DatasourceType");
    if (DATASOURCE_TYPE_MDS.equals(typeValue.asString().getValue())) {
      // Can't test an MDS data source because it just delegates to other data sources.
      return response;
    }
    Value urlValue = converter.findRequiredDataSourceValue("Url");
    Value driverValue = converter.findRequiredDataSourceValue("DriverName");
    Value passwordValue = converter.findOptionalDataSourceValue("Password");
    String url = urlValue.asString().getValue();
    String driverName = driverValue.asString().getValue();
    String password = (passwordValue != null) ? passwordValue.asSecret().getValue() : null;
    Properties properties = converter.getDataSourceProperties();
    return testConfiguration(url, driverName, password, properties);
  }

  private Response<Void> testConfiguration(
    String url,
    String driverName,
    String password,
    Properties properties
  ) {
    JsonObject requestBody = getTestConfigurationRequestBody(url, driverName, password, properties);
    Response<Void> response = new Response<>();
    Response<JsonObject> testResponse = invokeTestConfiguration(requestBody);
    if (!testResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(testResponse);
    }
    return getTestConfigurationResponse(testResponse.getResults());
  }

  private Response<JsonObject> invokeTestConfiguration(JsonObject requestBody) {
    WebLogicRestRequest.Builder builder = WebLogicRestRequest.builder();
    // Call the management/wls/datasources/test legacy REST api to test the datasource.
    // Note: testing a datasource can take a while, especially if WLS is running in docker
    // and the urls to the database incorrect.  Increase the read timeout to accomodate this.
    builder
      .root(WebLogicRestRequest.LEGACY_WEBLOGIC_REST_API_ROOT)
      .readTimeout(60000);
    return
      WebLogicRestInvoker.post(
        getInvocationContext(),
        new Path("datasources.test"),
        requestBody,
        false, // don't use expanded values
        false, // don't save changes
        false, // not asynchronous
        builder
      );
  }

  private JsonObject getTestConfigurationRequestBody(
    String url,
    String driverName,
    String password,
    Properties properties
  ) {
    JsonObjectBuilder requestBodyBuilder = Json.createObjectBuilder();
    requestBodyBuilder.add("url", url);
    requestBodyBuilder.add("driverName", driverName);
    if (password == null) {
      requestBodyBuilder.addNull("password");
    } else {
      requestBodyBuilder.add("password", password);
    }
    JsonArrayBuilder propertiesBuilder = Json.createArrayBuilder();
    for (String propertyName : properties.stringPropertyNames()) {
      JsonObjectBuilder propertyBuilder = Json.createObjectBuilder();
      propertyBuilder.add("name", propertyName);
      propertyBuilder.add("value", properties.getProperty(propertyName));
      propertiesBuilder.add(propertyBuilder);
    }
    requestBodyBuilder.add("properties", propertiesBuilder);
    return requestBodyBuilder.build();
  }

  private Response<Void> getTestConfigurationResponse(JsonObject responseBody) {
    Response<Void> response = new Response<>();
    JsonObject item = responseBody.getJsonObject("item"); // should always be present
    boolean ok = item.getBoolean("ok"); // should always be present
    if (!ok) {
      response.setUserBadRequest();
      JsonArray cause = item.getJsonArray("cause"); // should always be present
      for (int i = 0; i < cause.size(); i++) {
        response.addFailureMessage(cause.getString(i));
      }
    }
    return response;
  }

  private class FormPropertiesToBeansPropertyValuesConverter {
    private static final String PROPERTY_NAME = "Name";
    private InvocationContext ic;
    private List<FormProperty> formProperties;
    private BeansPropertyValues dataSourceValues;
    private List<BeansPropertyValues> dataSourcePropertiesValues = new ArrayList<>();
    private Response<Void> response = new Response<>();
    private boolean testConfiguration;

    private FormPropertiesToBeansPropertyValuesConverter(InvocationContext ic, List<FormProperty> formProperties) {
      this.ic = ic;
      this.formProperties = formProperties;
      this.dataSourceValues = new BeansPropertyValues(ic.getBeanTreePath());
    }

    private Value findRequiredDataSourceValue(String propertyName) {
      return findRequiredPropertyValue(dataSourceValues, propertyName);
    }

    private Value findOptionalDataSourceValue(String propertyName) {
      return findOptionalPropertyValue(dataSourceValues, propertyName);
    }

    private Value findRequiredPropertyValue(BeansPropertyValues beansValues, String propertyName) {
      Value value = findOptionalPropertyValue(beansValues, propertyName);
      if (value == null) {
        throw new AssertionError("Can't find " + propertyName);
      }
      return value;
    }

    private Value findOptionalPropertyValue(BeansPropertyValues beansValues, String propertyName) {
      for (BeanPropertyValues beanValues : beansValues.getSortedBeansPropertyValues()) {
        for (BeanPropertyValue value : beanValues.getPropertyValues()) {
          if (propertyName.equals(value.getPropertyDef().getPropertyName())) {
            return value.getValue().asSettable().getValue();
          }
        }
      }
      return null;
    }

    private Properties getDataSourceProperties() {
      Properties properties = new Properties();
      for (BeansPropertyValues beansValues : dataSourcePropertiesValues) {
        Value nameValue = findRequiredPropertyValue(beansValues, "Name");
        Value valueValue = findRequiredPropertyValue(beansValues, "Value");
        String name = nameValue.asString().getValue();
        String value = valueValue.asString().getValue();
        properties.setProperty(name, value);
      }
      return properties;
    }
  
    private BeansPropertyValues getDataSourceValues() {
      return dataSourceValues;
    }

    private List<BeansPropertyValues> getDataSourcePropertiesValues() {
      return dataSourcePropertiesValues;
    }

    private boolean isTestConfiguration() {
      return testConfiguration;
    }

    private Response<Void> convert() {
      convertProperties();
      return response;
    }

    private void convertProperties() {
      addName();
      addOptionalMBeanProperty("Targets");
      addOptionalMBeanProperty("JDBCResource.JDBCDataSourceParams.JNDINames");
      String dataSourceType = addDataSourceType();
      if (isOK()) {
        addDataSourceTypeSpecificProperties(dataSourceType);
      }
    }

    private void addName() {
      FormProperty formProperty = findRequiredFormProperty(PROPERTY_NAME);
      if (isOK()) {
        SettableValue nameValue = getFormPropertyValue(formProperty);
        addPropertyValue(PROPERTY_NAME, nameValue);
        if (getInvocationContext().getPageRepo().isChangeManagerPageRepo()) {
          // online REST requires that the JDBCResource's Name be set too.
          addPropertyValue("JDBCResource.Name", nameValue);
        } else {
          // WDT requires that the JDBCResource's Name not be set.
        }
      }
    }

    private String addDataSourceType() {
      FormProperty formProperty = findRequiredFormProperty(PROPERTY_DATASOURCE_TYPE);
      if (isOK()) {
        SettableValue value = getFormPropertyValue(formProperty);
        addPropertyValue(PROPERTY_DATASOURCE_TYPE, value);
        return value.getValue().asString().getValue();
      } else {
        return null;
      }
    }

    private void addDataSourceTypeSpecificProperties(String dataSourceType) {
      if (DATASOURCE_TYPE_GENERIC.equals(dataSourceType)) {
        addGenericProperties();
        return;
      }
      if (DATASOURCE_TYPE_GRIDLINK.equals(dataSourceType)) {
        addGridLinkProperties();
        return;
      }
      if (DATASOURCE_TYPE_UCP.equals(dataSourceType)) {
        addUCPProperties();
        return;
      }
      if (DATASOURCE_TYPE_MDS.equals(dataSourceType)) {
        addMDSProperties();
        return;
      }
      badFrontEndRequest("Illegal " + PROPERTY_DATASOURCE_TYPE + " : " + dataSourceType);
    }
  
    // Add the weblogic mbean properties needed to create a generic data source
    private void addGenericProperties() {
      String vendorName = getVendorName();
      if (!isOK()) {
        return;
      }
      JDBCDriverInfo driverInfo =
        getDriverInfo(driverNameToFormPropertyName(genericDatabaseDriverProperty(vendorName)));
      if (!isOK()) {
        return;
      }
      addTransactionProperties(DATASOURCE_TYPE_GENERIC, driverInfo);
      if (!isOK()) {
        return;
      }
      addConnectionProperties(DATASOURCE_TYPE_GENERIC, driverInfo);
    }

    private void addGridLinkProperties() {
      JDBCDriverInfo driverInfo = getDriverInfo(PROPERTY_GRIDLINK_DATABASE_DRIVER);
      if (!isOK()) {
        return;
      }
      addGridLinkListenersToDriverInfo(driverInfo);
      if (!isOK()) {
        return;
      }
      addTransactionProperties(DATASOURCE_TYPE_GRIDLINK, driverInfo);
      if (!isOK()) {
        return;
      }
      addConnectionProperties(DATASOURCE_TYPE_GRIDLINK, driverInfo);
      if (!isOK()) {
        return;
      }
      addGridLinkONSProperties();
    }

    private void addUCPProperties() {
      JDBCDriverInfo driverInfo = getDriverInfo(PROPERTY_UCP_DATABASE_DRIVER);
      if (!isOK()) {
        return;
      }
      addConnectionProperties(DATASOURCE_TYPE_UCP, driverInfo);
    }

    private void addMDSProperties() {
      addOptionalMBeanProperty("JDBCResource.JDBCDataSourceParams.AlgorithmType");
      addMDSDataSourceList();
    }

    private void addMDSDataSourceList() {
      String dataSourceList = getMDSDataSourceList();
      if (!isOK()) {
        return;
      }
      addPropertyValue(
        "JDBCResource.JDBCDataSourceParams.DataSourceList",
        new SettableValue(new StringValue(dataSourceList), true)
      );
    }

    private String getMDSDataSourceList() {
      ArrayValue dataSources = getMDSDataSources();
      if (!isOK()) {
        return null;
      }
      StringBuilder sb = new StringBuilder();
      boolean first = true;
      for (Value dataSource : dataSources.getValues()) {
        String dataSourceName = dataSource.asBeanTreePath().getLastSegment().getKey();
        if (!first) {
          sb.append(",");
        }
        sb.append(dataSourceName);
        first = false;
      }
      return sb.toString();
    }
  
    private ArrayValue getMDSDataSources() {
      FormProperty xaProp = findRequiredFormProperty("MDS_XADriver");
      if (!isOK()) {
        return null;
      }
      boolean isXA = getFormPropertyValue(xaProp).getValue().asBoolean().getValue();
      String dataSourcesPropertyName = (isXA) ? "MDS_XADataSources" : "MDS_NonXADataSources";
      FormProperty dataSourcesProp = findRequiredFormProperty(dataSourcesPropertyName);
      if (!isOK()) {
        return null;
      }
      return getFormPropertyValue(dataSourcesProp).getValue().asArray();
    }
  
    private void addGridLinkListenersToDriverInfo(JDBCDriverInfo driverInfo) {
      FormProperty formProperty =
        findRequiredFormProperty(
          driverNameToFormPropertyName(
            driverScopedName(DATASOURCE_TYPE_GRIDLINK, driverInfo, PROPERTY_GRIDLINK_LISTENERS)
          )
        );
      if (!isOK()) {
        return;
      }
      StringBuilder hostPorts = new StringBuilder();
      ArrayValue listeners = getFormPropertyValue(formProperty).getValue().asArray();
      boolean first = true;
      for (Value listener : listeners.getValues()) {
        // It should never be null since this is a required field. The CFE will enforce it.
        String hostPort = listener.asString().getValue();
        String[] hp = hostPort.split(":");
        if (hp != null && hp.length == 2 && StringUtils.isInteger(hp[1])) {
          if (!first) {
            hostPorts.append(",");
          }
          hostPorts.append(hostPort);
        } else {
          badUserRequest(
            getInvocationContext().getLocalizer().localizeString(
              LocalizedConstants.INVALID_GRID_LINK_LISTENER,
              hostPort
            )
          );
          return;
        }
        first = false;
      }
      driverInfo.getHostPorts().setList(hostPorts.toString());
    }

    private void addGridLinkONSProperties() {
      addOptionalMBeanProperty(PROPERTY_GRIDLINK_FAN_ENABLED);
      addOptionalMBeanProperty(PROPERTY_GRIDLINK_ONS_NODE_LIST);
      addOptionalMBeanProperty(PROPERTY_GRIDLINK_ONS_WALLET_FILE);
      addOptionalMBeanProperty(PROPERTY_GRIDLINK_ONS_WALLET_PASSWORD);
    }

    // Add the XA weblogic bean properties needed for the database driver
    private void addTransactionProperties(String dataSourceType, JDBCDriverInfo driverInfo) {
      String protocol = null;
      if (driverInfo.isForXA()) {
        // Since this is an XA driver, force the protocol to 2 phase commit
        protocol = "TwoPhaseCommit";
      } else {
        // Since this isn't an XA driver, use the protocol that the client configured
        // (i.e. none, one phase commit or emulate 2 phase commit)
        protocol = getRequiredStringProperty(PROPERTY_GLOBAL_TRANSACTIONS_PROTOTOL);
        if (!isOK()) {
          return;
        }
      }
      if (!"OnePhaseCommit".equals(protocol)) {
        // We're not using the default protocol.  Write it out.
        addPropertyValue(
          PROPERTY_GLOBAL_TRANSACTIONS_PROTOTOL,
          new SettableValue(new StringValue(protocol), true)
        );
      } else {
        // We're using the default protocol.  Don't write it out.
      }
    }

    // Add the connection related weblogic mbean properties for a database driver
    private void addConnectionProperties(String dataSourceType, JDBCDriverInfo driverInfo) {
      populateTestConfiguration(dataSourceType, driverInfo);
      if (!isOK()) {
        return;
      }
      // copy the connection related driver properties the client specified into the database driver
      populateDriverInfo(dataSourceType, driverInfo);
      if (!isOK()) {
        return;
      }
      // convert the populated database driver into the corresponding weblogic bean properties
      convertDriverInfoToMBeanProperties(dataSourceType, driverInfo);
    }

    // Convert the populated database driver into the corresponding weblogic bean properties
    private void convertDriverInfoToMBeanProperties(String datasourceType, JDBCDriverInfo driverInfo) {
      // copy the driver class name to the weblogic bean properties
      addPropertyValue(
        "JDBCResource.JDBCDriverParams.DriverName",
        new SettableValue(new StringValue(driverInfo.getDriverClassName()), true)
      );

      // Create a JDBCURLHelper, which maps from driver properties to weblogic properties
      JDBCURLHelper helper = createJDBCURLHelper(driverInfo);

      if (datasourceType != DATASOURCE_TYPE_UCP) {
        // Add the weblogic property for the database url
        String url = null;
        try {
          url = helper.getURL();
        } catch (JDBCDriverInfoException e) {
          // Most likely a problem in what the user typed in:
          badUserRequest(e.getLocalizedMessage());
          return;
        }
        addPropertyValue(PROPERTY_URL, new SettableValue(new StringValue(url), true));
      } else {
        // UCP database urls are configured directly by the user
        // (v.s. being computed from the connection properties)
        addOptionalMBeanProperty(PROPERTY_URL);
      }

      // FortifyIssueSuppression Password Management: Password in Comment
      // Comment below does not reveal a secret
      // Add the weblogic property for the database password (if specified)
      String password = driverInfo.getPassword();
      if (!StringUtils.isEmpty(password)) {
        addPropertyValue(
          "JDBCResource.JDBCDriverParams.Password",
          new SettableValue(new SecretValue(password), true)
        );
      }

      // Since each property gets converted to a child per-property mbean that can't be created
      // until we've created the new datasource, record them now so we can create them at the end.
      Properties properties = null;
      try {
        properties = helper.getProperties();
      } catch (JDBCDriverInfoException e) {
        // Most likely a problem in what the user typed in:
        badUserRequest(e.getLocalizedMessage());
        return;
      }
      recordDataSourcePropertiesValues(properties);
    }

    private void recordDataSourcePropertiesValues(Properties properties) {
      if (properties == null) {
        return;
      }
      BeanTreePath dataSourcesBeanTreePath = getInvocationContext().getBeanTreePath();
      // e.g. Domain/JDBCSystemResources/<MyNewDataSource>/JDBCResource/JDBCDriverParams/Properties/Properties
      Path propertiesCollectionPath =
        // start off at the JDBCSystemResourceMBean collection:
        dataSourcesBeanTreePath.getPath()
        // add the new data source's name
        .childPath(getRequiredStringProperty(PROPERTY_NAME))
        // add the child beans to get to the collection
        .childPath(new Path("JDBCResource.JDBCDriverParams.Properties.Properties"));
      BeanTreePath propertiesCollectionBeanTreePath =
        BeanTreePath.create(dataSourcesBeanTreePath.getBeanRepo(), propertiesCollectionPath);
      for (String name : properties.stringPropertyNames()) {
        recordDataSourcePropertyValues(propertiesCollectionBeanTreePath, name, properties.getProperty(name));
      }
    }
  
    private void recordDataSourcePropertyValues(
      BeanTreePath propertiesCollectionBeanTreePath,
      String name,
      String value
    ) {
      BeansPropertyValues propertyValues = new BeansPropertyValues(propertiesCollectionBeanTreePath);
      propertyValues.addPropertyValue(
        new BeanPropertyValue(
          propertiesCollectionBeanTreePath.getTypeDef().getPropertyDef(new Path("Name")),
          new SettableValue(new StringValue(name), true)
        )
      );
      propertyValues.addPropertyValue(
        new BeanPropertyValue(
          propertiesCollectionBeanTreePath.getTypeDef().getPropertyDef(new Path("Value")),
          new SettableValue(new StringValue(value), true)
        )
      );
      dataSourcePropertiesValues.add(propertyValues);
    }

    private void populateTestConfiguration(String dataSourceType, JDBCDriverInfo driverInfo) {
      testConfiguration =
        getOptionalBooleanProperty(
          driverNameToFormPropertyName(
            driverScopedName(dataSourceType, driverInfo, PROPERTY_TEST_CONFIGURATION)
          ),
          DEFAULT_TEST_CONFIGURATION
        );
    }

    // Copy the connection related driver properties the client specified into the database driver
    private void populateDriverInfo(String dataSourceType, JDBCDriverInfo driverInfo) {
      // createDriverInfo returned a new unpopulated JDBCDriverInfo instance.
      // Fill in its properties so we can use it later to convert them to their corresponding mbean properties
      driverInfo.setFillRequired(false);
      addWellKnownConnectionProperties(dataSourceType, driverInfo);
      if (isOK()) {
        addCustomConnectionProperties(dataSourceType, driverInfo);
      }
    }

    // Copy the well known connection related driver properties the client specified into the database driver
    private void addWellKnownConnectionProperties(String dataSourceType, JDBCDriverInfo driverInfo) {
      addDbmsName(dataSourceType, driverInfo);
      addDbmsHost(dataSourceType, driverInfo);
      addDbmsPort(dataSourceType, driverInfo);
      addDbmsUserName(dataSourceType, driverInfo);
      addDbmsPassword(dataSourceType, driverInfo);
      // NOTE: ServiceName is handled by collectCustomConnectionProperties
    }

    private void addDbmsName(String dataSourceType, JDBCDriverInfo driverInfo) {
      if (supportsWellKnownConnectionProperty(driverInfo, PROPERTY_DBMS_NAME)) {
        String value = getWellKnownConnectionProperty(dataSourceType, driverInfo, PROPERTY_DBMS_NAME);
        if (isOK() && !StringUtils.isEmpty(value)) { // empty indicates an unset optional property
          driverInfo.setDbmsName(value);
        }
      }
    }

    private void addDbmsHost(String dataSourceType, JDBCDriverInfo driverInfo) {
      if (supportsWellKnownConnectionProperty(driverInfo, PROPERTY_DBMS_HOST)) {
        String value = getWellKnownConnectionProperty(dataSourceType, driverInfo, PROPERTY_DBMS_HOST);
        if (isOK() && !StringUtils.isEmpty(value)) { // empty indicates an unset optional property
          driverInfo.setDbmsHost(value);
        }
      }
    }

    private void addDbmsPort(String dataSourceType, JDBCDriverInfo driverInfo) {
      if (!supportsWellKnownConnectionProperty(driverInfo, PROPERTY_DBMS_PORT)) {
        return;
      }
      String value = getWellKnownConnectionProperty(dataSourceType, driverInfo, PROPERTY_DBMS_PORT);
      if (!isOK() || StringUtils.isEmpty(value)) { // empty indicates an unset optional property
        return;
      }
      FormProperty formProperty =
        findFormProperty(
          driverNameToFormPropertyName(
            driverScopedName(dataSourceType, driverInfo, PROPERTY_DBMS_PORT)
          )
        );
      if (
        formProperty != null
          && !getFormPropertyValue(formProperty).getValue().isModelToken()
          && !StringUtils.isInteger(value)
      ) {
        badUserRequest(
          getInvocationContext().getLocalizer().localizeString(
            LocalizedConstants.INVALID_PORT,
            value
          )
        );
        return;
      }
      driverInfo.setDbmsPort(value);
    }

    private void addDbmsUserName(String dataSourceType, JDBCDriverInfo driverInfo) {
      if (supportsWellKnownConnectionProperty(driverInfo, PROPERTY_DBMS_USER_NAME)) {
        String value = getWellKnownConnectionProperty(dataSourceType, driverInfo, PROPERTY_DBMS_USER_NAME);
        if (isOK() && !StringUtils.isEmpty(value)) { // empty indicates an unset optional property
          driverInfo.setUserName(value);
        }
      }
    }

    private void addDbmsPassword(String dataSourceType, JDBCDriverInfo driverInfo) {
      if (supportsWellKnownConnectionProperty(driverInfo, PROPERTY_DBMS_PASSWORD)) {
        String value = getWellKnownConnectionProperty(dataSourceType, driverInfo, PROPERTY_DBMS_PASSWORD);
        if (isOK() && !StringUtils.isEmpty(value)) { // empty indicates an unset optional property
          driverInfo.setPassword(value);
        }
      }
    }

    private String getWellKnownConnectionProperty(
      String dataSourceType,
      JDBCDriverInfo driverInfo, 
      String propertyName
    ) {
      String formPropertyName =
        driverNameToFormPropertyName(
          driverScopedName(dataSourceType, driverInfo, propertyName)
        );
      JDBCDriverAttribute driverAttribute = driverInfo.getDriverAttributes().get(propertyName);
      boolean required = driverAttribute.isRequired();
      String defaultValue = driverAttribute.getDefaultValue();
      if (required && StringUtils.isEmpty(defaultValue)) {
        // The user must specify the value
        return getRequiredStringProperty(formPropertyName);
      }
      // The user may specify the value
      String value = getOptionalStringProperty(formPropertyName);
      if (!StringUtils.isEmpty(value)) {
        // The user specied the value.  Use it.
        return value;
      }
      if (!required) {
        // The value isn't required and the user didn't set it
        return null;
      }
      // The value is required, has default and the user didn't set it. Use the default.
      return defaultValue;
    }

    private boolean supportsWellKnownConnectionProperty(JDBCDriverInfo driverInfo, String propertyName) {
      return driverInfo.getDriverAttributes().containsKey(propertyName);
    }

    // Copy the custom driver-specific connection related driver properties
    // the client specified xinto the database driver
    private void addCustomConnectionProperties(String dataSourceType, JDBCDriverInfo driverInfo) {
      for (JDBCDriverAttribute driverAttribute : driverInfo.getUnknownDriverAttributes().values()) {
        addCustomConnectionProperty(dataSourceType, driverInfo, driverAttribute);
        if (!isOK()) {
          return;
        }
      }
    }

    private void addCustomConnectionProperty(
      String dataSourceType,
      JDBCDriverInfo driverInfo,
      JDBCDriverAttribute driverAttribute
    ) {
      String propertyName = driverAttribute.getName();
      String formPropertyName =
        driverNameToFormPropertyName(
          driverScopedName(dataSourceType, driverInfo, propertyName)
        );
      boolean required = driverAttribute.isRequired();
      FormProperty formProperty = null;
      if (required) {
        formProperty = findRequiredFormProperty(formPropertyName);
        if (!isOK()) {
          return;
        }
      } else {
        formProperty = findFormProperty(formPropertyName);
      }
      if (!required && formProperty == null) {
        return;
      }
      String value = null;
      if (formProperty != null) {
        // The user specified a value.  Use it.
        value = getOptionalStringProperty(formPropertyName);
      } else {
        // The user didn't specify a value.  Use the default value.
        value = driverAttribute.getDefaultValue();
      }
      driverInfo.setUknownAttribute(propertyName, value);
    }

    // Get the name of the database vendor from the properties the client specified
    // and verify that it exists
    private String getVendorName() {
      String vn = getRequiredStringProperty(PROPERTY_GENERIC_DATABASE_TYPE);
      if (isOK()) {
        for (String vendorName : getDBMSVendorNames()) {
          if (vendorName.equals(vn)) {
            return vn;
          }
        }
        badFrontEndRequest("Illegal " + PROPERTY_GENERIC_DATABASE_TYPE + " : " + vn);
      }
      return null;
    }

    // Create a new JDBCDriverInfo given the name of the property the client specified
    // that holds the name of the type of driver
    private JDBCDriverInfo getDriverInfo(String driverProperty) {
      String driverName = getRequiredStringProperty(driverProperty);
      if (isOK()) {
        JDBCDriverInfo driverInfo = createDriverInfo(driverName);
        if (driverInfo != null) {
          return driverInfo;
        } else {
          badFrontEndRequest("Illegal " + driverProperty + " : " + driverName);
        }
      }
      return null;
    }

    private void addOptionalMBeanProperty(String propertyName) {
      FormProperty formProperty = findFormProperty(propertyName);
      if (formProperty != null) {
        addPropertyValue(propertyName, getFormPropertyValue(formProperty));
      }
    }

    private void addPropertyValue(String beanPropertyName, SettableValue value) {
      dataSourceValues.addPropertyValue(
        new BeanPropertyValue(
          ic.getBeanTreePath().getTypeDef().getPropertyDef(new Path(beanPropertyName)),
          value
        )
      );
    }

    private String getRequiredStringProperty(String propertyName) {
      FormProperty formProperty = findRequiredFormProperty(propertyName);
      if (isOK()) {
        String value = getStringValue(formProperty);
        if (!StringUtils.isEmpty(value)) {
          return value;
        } else {
          badFrontEndRequest("Null or empty required property: " + propertyName);
        }
      }
      return null;
    }

    private String getOptionalStringProperty(String propertyName) {
      FormProperty formProperty = findFormProperty(propertyName);
      if (formProperty != null) {
        return getStringValue(formProperty);
      }
      return null;
    }

    private boolean getOptionalBooleanProperty(String propertyName, boolean dflt) {
      FormProperty formProperty = findFormProperty(propertyName);
      if (formProperty != null) {
        return getFormPropertyValue(formProperty).getValue().asBoolean().getValue();
      }
      return dflt;
    }

    private FormProperty findRequiredFormProperty(String propertyName) {
      FormProperty formProperty = findFormProperty(propertyName);
      if (formProperty == null) {
        badFrontEndRequest("Missing required property: " + propertyName);
      }
      return formProperty;
    }

    private FormProperty findFormProperty(String propertyName) {
      for (FormProperty formProperty : formProperties) {
        if (formProperty.getPropertyDef().getPropertyPath().getDotSeparatedPath().equals(propertyName)) {
          return formProperty;
        }
      }
      return null;
    }

    // In the JDBCSystemResource, strings should either be null or non-empty
    private String getStringValue(FormProperty formProperty) {
      Value value = getFormPropertyValue(formProperty).getValue();
      String stringValue = null;
      if (value.isModelToken()) {
        stringValue = value.asModelToken().getToken();
      } else if (value.isSecret()) {
        stringValue = value.asSecret().getValue();
      } else {
        stringValue = value.asString().getValue();
      }
      return StringUtils.isEmpty(stringValue) ? null : stringValue;
    }
  
    private SettableValue getFormPropertyValue(FormProperty formProperty) {
      return formProperty.getValue().asSettable(); // create always uses SettableValues
    }

    private boolean isOK() {
      return response.isSuccess();
    }

    private void badFrontEndRequest(String message) {
      response.addFailureMessage(message);
      // We can return a collection of problems.
      // Some can be caused by the front end not honoring the PDY schema (i.e. FrontEndBadRequest).
      // Some can be caused by the user entering invalid data (i.e. UserBadRequest)
      // Make sure that UserBadRequest trumps FrontEndBadRequest.
      if (!response.isUserBadRequest()) {
        response.setFrontEndBadRequest();
      }
    }

    private void badUserRequest(String message) {
      response.addFailureMessage(message);
      response.setUserBadRequest();
    }
  }

  // Create a helper that converts a populated database driver to its corresponding mbean properties
  private JDBCURLHelper createJDBCURLHelper(JDBCDriverInfo driverInfo) {
    try {
      return JDBCURLHelperFactory.newInstance().getJDBCURLHelper(driverInfo);
    } catch (Exception e) {
      throw new AssertionError(e);
    }
  }

  // Find create an unpopulated database driver
  private JDBCDriverInfo createDriverInfo(String driverName) {
    return getDriverInfoFactory().getDriverInfo(driverName);
  }
}
