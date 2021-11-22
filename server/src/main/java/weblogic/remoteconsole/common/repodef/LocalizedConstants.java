// Copyright (c) 2021, Oracle and/or its affiliates.
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
      "Invalid port (must be an integer): "
    );

  // Indicates that a string that should identify a grid link listener
  // is not in the correct format.
  public static final LocalizableString INVALID_GRID_LINK_LISTENER =
    addConstant(
      "invalidGridLinkListener",
      "Invalid listener (must be host:port): "
    );

  // Indicates that a WLS domain version isn't one that the remote console supports.
  public static final LocalizableString UNSUPPORTED_DOMAIN_VERSION =
    addConstant(
      "unsupportedDomainVersion",
      "Unsupported WebLogic domain version"
    );

  // Indicates that the user used to connect to an online admin server connection
  // is not a WebLogic adminitrator.
  public static final LocalizableString USER_NOT_ADMIN =
    addConstant(
      "userNotAdmin",
      "The connected user is not a WebLogic Administrator."
      + " Pages requiring administrator privileges will experience unexpected behavior."
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
      "Already exists: "
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
      "Required property not specified: "
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

  public static final LocalizableString MONITORING_LABEL =
    addConstant(
      "label.monitoring",
      "Monitoring Tree"
    );

  public static final LocalizableString INVALID_MODEL_TOKEN =
    addConstant(
      "invalidModelToken",
      "Invalid model token: "
    );

  public static final LocalizableString NO_UNRESOLVED_REF =
    addConstant(
      "noUnresolvedRef",
      "Unresolved Reference value was not specified!"
    );

  public static final LocalizableString NO_REFS_VALUE =
    addConstant(
      "noRefsValue",
      "References value was not specified!"
    );

  public static final LocalizableString UNMAPPED_SECTION =
    addConstant(
      "unmappedSection",
      "Unmapped section for: "
    );

  public static final LocalizableString NO_MACHINES_DEF =
    addConstant(
      "noMachinesDef",
      "no Machines child definition: "
    );

  public static final LocalizableString KEY_VALUE_NOT_MAP =
    addConstant(
      "keyValueNotMap",
      "key value is not a Map: "
    );

  public static final LocalizableString VALUE_NOT_MAP =
    addConstant(
      "valueNotMap",
      "value is not a Map: "
    );

  public static final LocalizableString MODEL_INVALID =
    addConstant(
      "modelInvalid",
      "Model not valid!"
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
