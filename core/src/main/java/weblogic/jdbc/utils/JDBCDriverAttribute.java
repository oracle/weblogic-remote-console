// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.jdbc.utils;

import java.io.Serializable;

// FortifyIssueSuppression Password Management: Password in Comment
// Referring to DbmsP* doesn't actually reveal a secret
/**
 * This class represents a set attributes (name/value) paris of a JDBCDriverInfo object
 * There are several well known attributes:
 * <p>
 * DbmsHost
 * DbmsPort
 * DbmsName
 * DbmsUsername
 * DbmsPassword
 * <p>
 * There are several attributes to a Property:
 * <p>
 * Required
 * DefaultValue
 * InURL  : meaning is the value in the url.  If this is false then
 * the name value pair goes in the Properties object
 * Description
 * DisplayName : what to dispay in the UI
 * PropertyName : this is for the name=value portion of the URL or the properties object
 * but the JDBCURLHelper's already know this so I dont think it necesssary
 * <p>
 * <p>
 * populated from an xml file.  This class is also the placeholder for user
 * specific data  such as host, port and db name.  One of the main purpose's
 * of gathering this data is to create a JDBC URL using the urlHelperClassname
 */
public class JDBCDriverAttribute implements Cloneable, Serializable {

  private String name;
  private String defaultValue;
  private String description;
  private String value;
  private String displayName;
  private String propertyName;

  private boolean inURL;
  private boolean isRequired;

  //JDBCDriverInfo to which this property belongs
  private final MetaJDBCDriverInfo metaInfo;

  public JDBCDriverAttribute(MetaJDBCDriverInfo metaInfo) {
    this.metaInfo = metaInfo;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getName() {
    return name;
  }

  public void setDisplayName(String dispName) {
    displayName = dispName;
  }

  public String getDisplayName() {
    return displayName;
  }

  public void setPropertyName(String propName) {
    propertyName = propName;
  }

  public String getPropertyName() {
    return propertyName;
  }


  public void setDefaultValue(String defVal) {
    defaultValue = defVal;
  }

  public String getDefaultValue() {
    return defaultValue;
  }

  public void setInURL(String urlArg) {
    setInURL(Boolean.valueOf(urlArg).booleanValue());
  }

  public void setInURL(boolean urlArg) {
    inURL = urlArg;
  }

  public boolean isInURL() {
    return inURL;
  }

  public void setIsRequired(String reqArg) {
    setIsRequired(Boolean.valueOf(reqArg).booleanValue());
  }

  public void setIsRequired(boolean reqArg) {
    isRequired = reqArg;
  }

  public boolean isRequired() {
    return isRequired;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getDescription() {
    return description;
  }

  public void setValue(String value) {
    this.value = value;
  }

  public String getValue() {
    return value;
  }

  public String toString() {
    StringBuffer buff = new StringBuffer();
    buff.append("For : " + metaInfo.toString() + " \n");
    buff.append("\nProperty Name    : " + getName());
    buff.append("\nProperty Value   : " + getValue());
    buff.append("\nDefault Value    : " + (getDefaultValue() == null ? "null" : getDefaultValue()));
    buff.append("\nRequired?        : " + isRequired());
    buff.append("\nGoes in URL      : " + Boolean.valueOf(isInURL()).toString());
    buff.append("\nDescription      : " + (getDescription() == null ? "null" : getDescription()));
    return buff.toString();
  }

  public Object clone() throws java.lang.CloneNotSupportedException {
    return super.clone();
  }

}  
  
