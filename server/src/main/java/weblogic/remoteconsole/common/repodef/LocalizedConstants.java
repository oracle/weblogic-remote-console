// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.repodef;

import java.util.ArrayList;
import java.util.List;

/**
 * This class contains a list of localized constants that are used by the CBE.
 * 
 * Any code that needs to return text that should be displayed to the user
 * (e.g. a message) should add a constant and use it.
 */
public class LocalizedConstants {

  private LocalizedConstants() {
  }

  private static List<LocalizableString> allConstants = new ArrayList<>();

  // Indicates that a string that should identify a port is not an integer.
  public static final LocalizableString INVALID_PORT =
    addConstant(
      "invalidPort",
      "Invalid port (must be an integer): {0}"
    );

  // Indicates that a string that should identify a grid link listener
  // is not in the correct format.
  public static final LocalizableString INVALID_GRID_LINK_LISTENER =
    addConstant(
      "invalidGridLinkListener",
      "Invalid listener (must be host:port): {0}"
    );

  // Indicates that a WLS domain version isn't one that the remote console supports.
  public static final LocalizableString UNSUPPORTED_DOMAIN_VERSION =
    addConstant(
      "unsupportedDomainVersion",
      "Unsupported WebLogic domain version"
    );

  // Indicates that a bean couldn't be deleted and it was probably because
  // the user needs to delete references to it first.
  public static final LocalizableString DELETE_REFERENCES_FIRST =
    addConstant(
      "deleteReferencesFirst",
      "We recommend that you remove references to an object before you delete it."
    );

  // The title for per-property external javadoc help links
  public static final LocalizableString MBEAN_INFO_TITLE =
    addConstant(
      "mbeanInfoTitle",
      "MBean Info"
    );

  // Indicates that a bean that shouldn't exist does exist
  public static final LocalizableString BEAN_ALREADY_EXISTS =
    addConstant(
      "beanAlreadyExists",
      "Already exists: {0}"
    );

  // The label to use to refer to a null reference (e.g. setting a Server's Machine to null)
  public static final LocalizableString NULL_REFERENCE =
    addConstant(
      "nullReference",
      "None"
    );

  // Indicates that a required property has not been set (e.g. not specifing a new Server's Name)
  public static final LocalizableString REQUIRED_PROPERTY_NOT_SPECIFIED =
    addConstant(
      "requiredPropertyNotSpecified",
      "Required property not specified: {0}"
    );

  public static final LocalizableString EDIT_LABEL =
    addConstant(
      "label.edit",
      "Edit Tree"
    );

  public static final LocalizableString CONFIGURATION_LABEL =
    addConstant(
      "label.configuration",
      "Configuration View Tree"
    );

  public static final LocalizableString COMPOSITE_CONFIGURATION_LABEL =
    addConstant(
      "label.compositeConfig",
      "Composite View Tree"
    );

  public static final LocalizableString PROPERTY_LIST_CONFIGURATION_LABEL =
    addConstant(
      "label.propertyList",
      "Property List"
    );

  public static final LocalizableString MONITORING_LABEL =
    addConstant(
      "label.monitoring",
      "Monitoring Tree"
    );

  public static final LocalizableString SECURITY_DATA_LABEL =
    addConstant(
      "label.securityData",
      "Security Data Tree"
    );

  public static final LocalizableString CUSTOM_FILTERING_DASHBOARD_TYPE_LABEL =
    addConstant(
      "label.customFilteringDashboardType",
      "Custom Filtering Dashboard"
    );

  public static final LocalizableString NEW_CUSTOM_FILTERING_DASHBOARD_LABEL =
    addConstant(
      "label.newCustomFilteringDashboard",
      "New Dashboard"
    );

  public static final LocalizableString UNSPECIFIED_CUSTOM_FILTERING_DASHBOARD_FILTERED_VALUE =
    addConstant(
      "label.unspecifiedCustomFilteringDashboardFilteredValue",
      "A value must be specified for {0}"
    );
  
  public static final LocalizableString INVALID_MODEL_TOKEN =
    addConstant(
      "invalidModelToken",
      "Invalid model token: {0}"
    );

  public static final LocalizableString NO_UNRESOLVED_REF =
    addConstant(
      "noUnresolvedRef",
      "Unresolved Reference value was not specified: {0}"
    );

  public static final LocalizableString NO_REFS_VALUE =
    addConstant(
      "noRefsValue",
      "References value was not specified: {0}"
    );

  public static final LocalizableString UNMAPPED_SECTION =
    addConstant(
      "unmappedSection",
      "Unmapped section for: {0}"
    );

  public static final LocalizableString NO_MACHINES_DEF =
    addConstant(
      "noMachinesDef",
      "No Machines child definition: {0}"
    );

  public static final LocalizableString KEY_VALUE_NOT_MAP =
    addConstant(
      "keyValueNotMap",
      "{0} is not a folder."
    );

  public static final LocalizableString VALUE_NOT_MAP =
    addConstant(
      "valueNotMap",
      "{0} is not a folder."
    );

  public static final LocalizableString MODEL_INVALID =
    addConstant(
      "modelInvalid",
      "Invalid WDT model.  It must contain at least one of the following top-level folders: {0}"
    );

  public static final LocalizableString SECURITY_VALIDATION_WARNINGS_WARNING_LINK_LABEL =
    addConstant(
      "securityValidationWarningsWarningLinkLabel",
      "Security warnings detected. Click here to view the report and recommended remedies."
    );

  public static final LocalizableString SECURITY_VALIDATION_WARNINGS_INFO_LINK_LABEL =
    addConstant(
      "securityValidationWarningsInfoLinkLabel",
      "View Security Warnings Report"
    );

  public static final LocalizableString PROPERTY_LIST_PROPERTIES =
    addConstant(
      "label.propertyList.properties",
      "Properties"
    );

  public static final LocalizableString PROPERTY_LIST_HELP_TEXT =
    addConstant(
      "label.propertyList.helpText",
      "The set of properties contained in the property list file."
    );

  // Indicates that a simple search string is invalid because it's empty
  public static final LocalizableString EMPTY_SIMPLE_SEARCH_STRING =
    addConstant(
      "emptySimpleSearchString",
      "The search string must not be empty."
    );


  // Indicates that a bean can't be created because one with that name already exists
  public static final LocalizableString ALREADY_EXISTS =
    addConstant(
      "alreadyExists",
      "{0} already exists."
    );

  public static final LocalizableString WDT_MODEL_TOKEN_NOT_SUPPORTED =
    addConstant(
      "wdtModelTokenNotSupported",
      "{0} does not support variables: {1}"
    );

  public static final LocalizableString WDT_PROPERTY_VALUE_NOT_A_STRING =
    addConstant(
      "wdtPropertyValueNotAString",
      "The value of {0} is not a string: {1}"
    );

  public static final LocalizableString WDT_PROPERTY_VALUE_NOT_A_BOOLEAN =
    addConstant(
      "wdtPropertyValueNotABoolean",
      "The value of {0} is not true or false: {1}"
    );

  public static final LocalizableString WDT_PROPERTY_VALUE_NOT_AN_INT =
    addConstant(
      "wdtPropertyValueNotAnInt",
      "The value of {0} is not an int: {1}"
    );

  public static final LocalizableString WDT_PROPERTY_VALUE_NOT_A_LONG =
    addConstant(
      "wdtPropertyValueNotALong",
      "The value of {0} is not a long: {1}"
    );

  public static final LocalizableString WDT_PROPERTY_VALUE_NOT_A_DOUBLE =
    addConstant(
      "wdtPropertyValueNotADouble",
      "The value of {0} is not a double: {1}"
    );

  public static final LocalizableString WDT_PROPERTY_VALUE_NOT_PROPERTIES =
    addConstant(
      "wdtPropertyValueNotProperties",
      "The value of {0} is not a set of properties: {1}"
    );

  public static final LocalizableString WDT_INVALID_SECURITY_PROVIDER_TYPE =
    addConstant(
      "wdtInvalidSecurityProviderType",
      "{0} is not a valid security provider type."
    );

  public static final LocalizableString WDT_INVALID_SECTION =
    addConstant(
      "wdtInvalidSection",
      "{0} is not a valid top-level folder. It must be one of: {1}"
    );

  public static final LocalizableString WDT_INVALID_CHILD =
    addConstant(
      "wdtInvalidChild",
      "{0} is not a valid folder."
    );

  public static final LocalizableString WDT_INVALID_PROPERTY =
    addConstant(
      "wdtInvalidProperty",
      "{0} is not a valid attribute."
    );

  // An unlabeled property (can't be empty, otherwise the property's name is used)
  public static final LocalizableString UNLABELED_PROPERTY =
    addConstant(
      "unlabeledProperty",
      " "
    );

  // Returns all of the constants (used when the resource bundles are
  // generated at build time)
  public static List<LocalizableString> getAllConstants() {
    return allConstants;
  }

  private static LocalizableString addConstant(String constantKey, String englishText) {
    LocalizableString ls = new LocalizableString("constant." + constantKey, englishText);
    allConstants.add(ls);
    return ls;
  }
}
