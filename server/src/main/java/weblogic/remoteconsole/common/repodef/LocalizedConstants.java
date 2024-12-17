// Copyright (c) 2021, 2024, Oracle and/or its affiliates.
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

  // Indicates that while we were able to connect to the server,
  // the url has a bad path (as in, path/management is not the REST API)
  public static final LocalizableString BAD_PATH_GOOD_CONNECTION =
    addConstant(
      "badPathOnGoodConnection",
      "There is a server at this address, but the end point doesn't seem to be correct."
    );

  // Indicates that while we were able to connect to the server,
  // the url has a bad path and that path ends in /console.
  public static final LocalizableString TAKE_OFF_THE_SLASH_MANAGEMENT =
    addConstant(
      "takeOffSlashManagement",
      "most likely the /management part is not needed in the URL"
    );

  // Indicates that while we were able to connect to the server,
  // the url has a bad path and that path ends in /console.
  public static final LocalizableString TAKE_OFF_THE_SLASH_CONSOLE =
    addConstant(
      "takeOffSlashConsole",
      "most likely the /console part is not needed in the URL"
    );

  // Indicates that the user is trying to connect to a non-admin port
  public static final LocalizableString USE_ADMIN_PORT =
    addConstant(
      "useAdminPort",
      "most likely the port should be set to the domain's administration port (which defaults to 9002)"
    );

  // Indicates that the domain isn't properly configured to allow the admin server
  // to make WebLogic REST requests to servers in the domain.
  public static final LocalizableString WEBLOGIC_REST_DELEGATION_NOT_WORKING_MESSAGE =
    addConstant(
      "weblogicRestDelegationNotWorkingMessage",
      "The domain is experiencing REST communication issues between servers."
    );

  public static final LocalizableString SUGGEST_RESTART_SERVER_MESSAGE =
    addConstant(
        "suggestRestartServerMessage",
        "A restart of the administration server may resolve communication errors."
    );

  public static final LocalizableString WEBLOGIC_REST_DELEGATION_NOT_WORKING_LINK =
    addConstant(
      "weblogicRestDelegationNotWorkingLink",
      "Troubleshoot"
    );

  public static final LocalizableString WEBLOGIC_REST_DELEGATION_NOT_WORKING_DETAILS_LABEL =
    addConstant(
      "weblogicRestDelegationNotWorkingDetailsLabel",
      "Details"
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

  // A catch-all message for the case where there is no error messages returned from UserBadRequest response.
  public static final LocalizableString REFER_TO_LOGS =
      addConstant(
          "referToLogs",
          "The cause of the failure is unavailable.  "
            + "The WebLogic Remote Console and the admin server logs may have more information."
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

  public static final LocalizableString FILTERING_DASHBOARD_DEFAULT_DESCRIPTION =
    addConstant(
      "filteringDashboardDefaultDescription",
      "Displays all {0} instances in the domain matching this custom filtering dashboard's filters.</p>"
    );

  public static final LocalizableString CUSTOM_FILTERING_DASHBOARD_TYPE_LABEL =
    addConstant(
      "label.customFilteringDashboardType",
      "Custom Filtering Dashboard"
    );

  public static final LocalizableString BUILTIN_FILTERING_DASHBOARD_TYPE_LABEL =
    addConstant(
      "label.builtinFilteringDashboardType",
      "Builtin Filtering Dashboard"
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

  public static final LocalizableString NO_SECURITY_VALIDATION_WARNINGS_LABEL =
    addConstant(
      "noSecurityValidationWarningsLabel",
      "No security warnings."
    );

  public static final LocalizableString HAVE_SECURITY_VALIDATION_WARNINGS_LABEL =
    addConstant(
      "haveSecurityValidationWarningsLabel",
      "Security warnings detected."
    );

  public static final LocalizableString SECURITY_VALIDATION_WARNINGS_LINK_LABEL =
    addConstant(
      "securityValidationWarningsLinkLabel",
      "View/Refresh Report"
    );

  public static final LocalizableString NEED_SERVER_RESTART_LABEL =
    addConstant(
      "needServerRestartLabel",
      "One or more servers need to be restarted."
    );

  public static final LocalizableString SERVER_RESTART_LINK_LABEL =
    addConstant(
      "serverRestartLinkLabel",
      "View Servers"
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

  public static final LocalizableString DOWNLOADLOGFILE_ERROR =
    addConstant(
      "downloadLogFileError",
      "Error in creating log file: "
    );

  public static final LocalizableString NO_JMS_MESSAGES =
    addConstant(
      "noUnfilteredJmsMessages",
      "<p>This destination has no messages.</p>"
    );

  public static final LocalizableString ALL_UNFILTERED_JMS_MESSAGES =
    addConstant(
      "allUnfilteredJmsMessages",
      "<p>This unfiltered table displays all {0} messages in this destination.</p>"
    );

  public static final LocalizableString SOME_UNFILTERED_JMS_MESSAGES =
    addConstant(
      "someUnfilteredJmsMessages",
      "<p>This destination has {0} messages."
      + " This unfiltered table displays the first {1} sorted messages.</p>"
      + "<ul>"
      +   "<li>Sorted on: {2}</li>"
      +   "<li>Ascending: {3}</li>"
      + "</ul>"
    );

  public static final LocalizableString NO_FILTERED_JMS_MESSAGES =
    addConstant(
      "noFilteredJmsMessages",
      "<p>This destination has {0} messages."
      + " It does not have any matching messages.</p>"
      + "<ul>"
      +   "<li>JMS message selector: {1}</li>"
      + "</ul>"
    );

  public static final LocalizableString ALL_FILTERED_JMS_MESSAGES =
    addConstant(
      "allFilteredJmsMessages",
      "<p>This destination has {0} messages."
      + " This filtered table displays all {1} matching messages.</p>"
      + "<ul>"
      +   "<li>JMS message selector: {2}</li>"
      + "</ul>"
    );

  public static final LocalizableString SOME_FILTERED_JMS_MESSAGES =
    addConstant(
      "someFilteredJmsMessages",
      "<p>This destination has {0} messages."
      + " This filtered table lists the first {2} of {1} sorted matching messages.</p>"
      + "<ul>"
      +   "<li>JMS message selector: {3}</li>"
      +   "<li>Sorted on: {4}</li>"
      +   "<li>Ascending: {5}</li>"
      + "</ul>"
    );

  public static final LocalizableString TX_STATUS_ACTIVE =
    addConstant("txStatusActive", "active");

  public static final LocalizableString TX_STATUS_PRE_PREPARING =
    addConstant("txStatusPrePreparing", "pre-preparing");

  public static final LocalizableString TX_STATUS_PRE_PREPARED =
    addConstant("txStatusPrePrepared", "pre-prepared");

  public static final LocalizableString TX_STATUS_PREPARING =
    addConstant("txStatusPerparing", "preparing");

  public static final LocalizableString TX_STATUS_PREPARED =
    addConstant("txStatusPrepared", "prepared");

  public static final LocalizableString TX_STATUS_LOGGING =
    addConstant("txStatusLogging", "logging");

  public static final LocalizableString TX_STATUS_COMMITTING =
    addConstant("txStatusCommitting", "committing");

  public static final LocalizableString TX_STATUS_COMMITTED =
    addConstant("txStatusCommitted", "committed");

  public static final LocalizableString TX_STATUS_ROLLING_BACK =
    addConstant("txStatusRollingBack", "rolling-back");

  public static final LocalizableString TX_STATUS_MARKED_ROLLBACK =
    addConstant("txStatusMarkedRollback", "marked-rollback");

  public static final LocalizableString TX_STATUS_ROLLEDBACK =
    addConstant("txStatusRolledback", "rolledback");

  public static final LocalizableString TX_STATUS_NEW =
    addConstant("txStatusNew", "new");

  public static final LocalizableString TX_STATUS_SUSPENDED =
    addConstant("txStatusSuspended", "suspended");

  public static final LocalizableString TX_STATUS_UNKNOWN =
    addConstant("txStatusUnknown", "unknown");

  public static final LocalizableString MBEAN_EXTERNAL_HELP_INTRO_LABEL =
    addConstant("mbeanExternalHelpIntroLabel", "MBean:");

  public static final LocalizableString MBEAN_ATTRIBUTE_EXTERNAL_HELP_INTRO_LABEL =
    addConstant("mbeanPropertyExternalHelpIntroLabel", "MBean Attribute:");

  public static final LocalizableString MBEAN_OPERATION_EXTERNAL_HELP_INTRO_LABEL =
    addConstant("mbeanOperationExternalHelpIntroLabel", "MBean Operation:");

  public static final LocalizableString UNLOCK_USER_SUCCESS =
    addConstant(
      "mbeanOperationUnlockUserSuccess",
      "The unlock user action completed successfully."
    );

  public static final LocalizableString SSO_TOKEN_UNAVAILABLE =
    addConstant(
      "ssoTokenUnavailable",
      "Unable to connect, token is unavailable."
    );

  public static final LocalizableString HEALTH_STATE_OK =
    addConstant(
      "healthStateOkay",
      "Okay"
    );

  public static final LocalizableString HEALTH_STATE_WARN =
    addConstant(
      "healthStateWarn",
      "Warn"
    );

  public static final LocalizableString HEALTH_STATE_CRITICAL =
    addConstant(
      "healthStateCritical",
      "Critical"
    );

  public static final LocalizableString HEALTH_STATE_FAILED =
    addConstant(
      "healthStateFailed",
      "Failed"
    );

  public static final LocalizableString HEALTH_STATE_OVERLOADED =
    addConstant(
      "healthStateOverloaded",
      "Overloaded"
    );

  public static final LocalizableString HEALTH_STATE_UNKNOWN =
    addConstant(
      "healthStateUnknown",
      "Unknown"
    );

  public static final LocalizableString VARIABLE_ASSIGNMENT_INTRO =
    addConstant(
      "variableAssignmentIntro",
      ""
      + "<ul>"
      +   "<li>Module : {0}</li>"
      +   "<li>Descriptor : {1}</li>"
      +   "<li>xpath : {2}</li>"
      +   "<li>Variable : {3}</li>"
      + "</ul>"
    );

  public static final LocalizableString APPLICATION_HAS_PLAN =
    addConstant(
      "applicationHasPlan",
      "The application ''{0}'' already has a deployment plan: ''{1}''"
    );

  public static final LocalizableString APPLICATION_HAS_NO_PLAN =
      addConstant(
          "applicationHasNoPlan",
          "The application ''{0}'' does not have a deployment plan."
      );

  public static final LocalizableString REFER_TO_DEPLOYMENT_TASKS_DASHBOARD =
      addConstant(
          "referToDeploymentTasksDashboard",
          "Refer to Deployment Tasks dashboard for more information."
      );

  public static final LocalizableString DATA_PROVIDER_HELP_NAME_SUMMARY =
    addConstant(
      "dataProviderHelpNameSummary",
      "The name of the provider"
    );

  public static final LocalizableString DATA_PROVIDER_HELP_NAME_DETAIL =
    addConstant(
      "dataProviderHelpNameDetail",
      "A provider name should be unique within a project.  "
      + "It is not a functional field, but is used by the user to identify the connection"
    );

  public static final LocalizableString ADMIN_SERVER_HELP_URL_SUMMARY =
    addConstant(
      "adminServerHelpURLSummary",
      "The URL of the Administration Server being targeted"
    );

  public static final LocalizableString ADMIN_SERVER_HELP_URL_DETAIL =
    addConstant(
      "adminServerHelpURLDetail",
      "The URL of the Administration Server being targeted. "
      + "Note that the context path is not part of this URL, as in https://adminserver.example.com:7002). "
      + "The end point that is being reached is https://adminserver.example.com:7002/management, "
      + "but the path part is automatically added by the Remote Console software"
    );

  public static final LocalizableString ADMIN_SERVER_HELP_PROXY_SUMMARY =
    addConstant(
      "adminServerHelpProxySummary",
      "Allows the setting of a proxy server for this particular provider to use while connecting"
    );

  public static final LocalizableString ADMIN_SERVER_HELP_PROXY_DETAIL =
    addConstant(
      "adminServerHelpProxyDetail",
      "Allows the setting of a proxy server for this particular provider to use while connecting. "
      + "It is termed an 'override' because it takes precedence over any global settings for proxying. "
      + "The format of the entry is either 'DIRECT' to not use a proxy at all or a URL "
      + "(i.e. protocol://host:port - with no path), following the traditional standard for specifying a proxy server. "
      + "The protocol portion can be http, https, socks, socks4 or socks5."
    );

  public static final LocalizableString ADMIN_SERVER_HELP_USERNAME_SUMMARY =
    addConstant(
      "adminServerHelpUserNameSummary",
      "The user id portion of the credential needed to log in to the Admin Server"
    );

  public static final LocalizableString ADMIN_SERVER_HELP_USERNAME_DETAIL =
    addConstant(
      "adminServerHelpUserNameDetail",
      "The user id portion of the credential needed to log in to the Admin Server. "
      + "Note that this assumes a 'BASIC AUTH' authentication scheme. "
      + "The 'Single Sign-On' option allows one to use a different authentication mechanism."
    );

  public static final LocalizableString ADMIN_SERVER_HELP_PASSWORD_SUMMARY =
    addConstant(
      "adminServerHelpPasswordSummary",
      "The password portion of the credential needed to log in to the Admin Server"
    );

  public static final LocalizableString ADMIN_SERVER_HELP_PASSWORD_DETAIL =
    addConstant(
      "adminServerHelpPasswordDetail",
      "The password portion of the credential needed to log in to the Admin Server. "
      + "Note that this assumes a 'BASIC AUTH' authentication scheme. "
      + "The 'Single Sign-On' option allows one to use a different authentication mechanism."
    );

  public static final LocalizableString ADMIN_SERVER_HELP_INSECURE_SUMMARY =
    addConstant(
      "adminServerHelpInsecureSummary",
      "Turn off certificate checking for this provider's connection"
    );

  public static final LocalizableString ADMIN_SERVER_HELP_INSECURE_DETAIL =
    addConstant(
      "adminServerHelpInsecureDetail",
      "You can allow WebLogic Remote Console to connect to an Administration Server regardless of warnings "
      + "about expired, untrusted, or missing certificates. "
      + "We *strongly* recommend that you only enable this setting for development or demonstration environments."
    );

  public static final LocalizableString ADMIN_SERVER_HELP_SSO_SUMMARY =
    addConstant(
      "adminServerHelpSSOSummary",
      "Use an alternative authentication method, requires WebLogic 14.1.2.0.0 or greater"
    );

  public static final LocalizableString ADMIN_SERVER_HELP_SSO_DETAIL =
    addConstant(
      "adminServerHelpSSODetail",
      "Sends users to the browser to complete the login process with an "
      + "alternative authentication method such as Single Sign On. "
      + "Supported with WebLogic Server 14.1.2.0.0 or greater."
    );

  public static final LocalizableString WDT_PROVIDER_HELP_FILE_SUMMARY =
    addConstant(
      "wdtProviderHelpFileSummary",
      "The path to a WebLogic Deploy Tooling model file"
    );

  public static final LocalizableString WDT_PROVIDER_HELP_FILE_DETAIL =
    addConstant(
      "wdtProviderHelpFileDetail",
      "The path to a WebLogic Deploy Tooling model file"
    );


  public static final LocalizableString PROPERTY_LIST_PROVIDER_HELP_FILE_SUMMARY =
    addConstant(
      "propertyListProviderHelpFileSummary",
      "The path to a property file"
    );

  public static final LocalizableString PROPERTY_LIST_PROVIDER_HELP_FILE_DETAIL =
    addConstant(
      "propertyListProviderHelpFileDetail",
      "The path to a property file, as described in java.util.Properties"
    );

  public static final LocalizableString WDT_COMPOSITE_PROVIDER_HELP_MODELS_SUMMARY =
    addConstant(
      "wdtCompositeProviderHelpModelsSummary",
      "A list of WebLogic Deploy Tooling model providers"
    );

  public static final LocalizableString WDT_COMPOSITE_PROVIDER_HELP_MODELS_DETAIL =
    addConstant(
      "wdtCompositeProviderHelpModelsDetail",
      "A list of WebLogic Deploy Tooling model providers. "
      + "These models will be combined to form a single model and assessed as such"
    );

  public static final LocalizableString CANT_CONNECT_TO_ADMIN_SERVER =
    addConstant(
      "cantConnectToDomain",
      "Unable to connect to the WebLogic domain's administration server."
    );

  public static final LocalizableString CANT_SHUTDOWN_ADMIN_SERVER_AND_MANAGED_SERVERS =
    addConstant(
      "cantShutdownAdminServerAndManagedServers",
      "Shut down the managed servers then shut down the administration server."
    );

  public static final LocalizableString DATA_SOURCE_TEST_POOL_SUCCESS =
    addConstant(
      "dataSourceTestPoolSuccess",
      "The test of {0} on server {1} was successful."
    );

  public static final LocalizableString DATA_SOURCE_TEST_POOL_FAILURE =
    addConstant(
      "dataSourceTestPoolFailure",
      "The test of {0} on server {1} failed: {2}"
    );

  public static final LocalizableString CUSTOM_HOSTNAME_VERIFIER_NOT_SPECIFIED =
    addConstant(
      "customHostnameVerifierNotSpecified",
      "Custom Hostname Verifier must be specified."
    );

  public static final LocalizableString CANNOT_DELETE_BUILTIN_DASHBOARD =
    addConstant(
      "cannotDeleteBuiltintDashboard",
      "Builtin dashboards cannot be deleted: ''{0}''"
    );

  public static final LocalizableString CANNOT_MODIFY_BUILTIN_DASHBOARD =
    addConstant(
      "cannotModifyBuiltintDashboard",
      "Builtin dashboards cannot be modified: ''{0}''"
    );


  public static final LocalizableString NODE_MANAGER_LOG_DOWNLOAD_LABEL =
    addConstant(
      "nodeManagerLogDownloadLabel",
      "Download"
    );

  public static final LocalizableString NODE_MANAGER_LOG_DOWNLOAD_NOT_SUPPORTED =
      addConstant(
          "nodeManagerLogDownloadNotSupported",
          "Download Log not supported"
      );

  public static final LocalizableString NODE_MANAGER_LOG_NOT_AVAILABLE_LABEL =
    addConstant(
      "nodeManagerLogNotAvailableLabel",
      "Not Available"
    );

  public static final LocalizableString CONSOLE_REST_EXTENSION_NOT_INSTALLED =
    addConstant(
      "consoleRestExtensionNotInstalled",
      "not installed"
    );

  public static final LocalizableString READONLY_DEPLOYMENT_CONFIGURATION_PAGE_INTRO =
    addConstant(
      "readOnlyDeploymentConfigurationPageIntro",
      "<p>Note: You cannot modify this deployment's configuration because"
      + " the deployment does not have a deployment plan.</p>"
    );

  public static final LocalizableString AUTODEPLOYED_DEPLOYMENT_CONFIGURATION_PAGE_INTRO =
    addConstant(
      "autoDeployedDeploymentConfigurationPageIntro",
      "<p>Note: You cannot modify this deployment's configuration because"
      + " the deployment is auto-deployed.</p>"
    );

  public static final LocalizableString WEBLOGIC_REST_REQUEST_TIMED_OUT =
    addConstant(
      "weblogicRESTRequestTimedOut",
      "A request to the WebLogic administration server timed out."
        + "  Increasing the WebLogic Remote Console's 'Administration Server Read Timeout' may help."
    );

  public static final LocalizableString TOO_MANY_USERS =
    addConstant(
        "tooManyUsers",
        "<p>Note: There are more users than the WebLogic Remote Console supports. Only {0} are displayed.</p>"
    );

  public static final LocalizableString TOO_MANY_GROUPS =
    addConstant(
        "tooManyGroups",
        "<p>Note: There are more groups than the WebLogic Remote Console supports. Only {0} are displayed.</p>"
    );

  public static final LocalizableString CLONED_SERVER_NOT_ALL_SETTINGS_COPIED =
    addConstant(
      "clonedServerNotAllSettingsCopied",
      "Note: Sensitive settings for the Server such as the passwords and keys, have not been copied."
    );

  // Default provider name for hosted
  public static final LocalizableString DEFAULT_HOSTED_PROVIDER_NAME =
    addConstant(
      "thisServer",
      "This Server"
    );

  public static final LocalizableString USER_GROUP_READER_STATUS_OK =
    addConstant(
      "userGroupReaderStatusOK",
      "OK"
    );

  // Returns all of the constants (used when the resource bundles are generated at build time)
  public static List<LocalizableString> getAllConstants() {
    return allConstants;
  }

  private static LocalizableString addConstant(String constantKey, String englishText) {
    LocalizableString ls = new LocalizableString("constant." + constantKey, englishText);
    allConstants.add(ls);
    return ls;
  }
}
