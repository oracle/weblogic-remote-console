// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.jdbc.utils;

import java.io.Serializable;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import weblogic.jdbc.common.internal.AddressList;

/**
 * This class represents a set of metadata regarding a making a JDBC
 * Connection using a JDBC Driver.  This class wraps the internal
 * class MetaJDBCDriverInfo which is populated by the xml parser,
 * JDBCConnectionMetaDataParser
 * <p>
 * This class lists what attributes must be gathered to make a
 * connection to the DBMS and holds them as they are gathered from the
 * user
 * <p>
 * Using JDBCURLHelperFactory and a JDBCDriverInfo you can get a
 * JDBCURLHelper which formats the JDBC URL and the required
 * properties object
 *
 */

public class JDBCDriverInfo implements Serializable, Comparable {
  private static final long serialVersionUID = 6919106869180583924L;
  private static final boolean debug = false; // not used

  private boolean triedToLoadDriver = false;
  private boolean driverLoaded = false;
  private Exception loadDriverException;

  private MetaJDBCDriverInfo metaInfo = null;
  private Map<String,JDBCDriverAttribute> myJDBCDriverAtributes = null;
  private Map<String,JDBCDriverAttribute> unknownDriverAttributes = null;
  private transient AddressList hostPorts = new AddressList();
  private boolean fillRequired = false;

  // FortifyIssueSuppression Password Management: Password in Comment
  // Reference to DbmsPassword does not reveal a secret
  /*
   * List of well known "properties" that we will support in the
   * JDBCDriverInfo, other drivers may add specialized properties and
   * they will show up in the UI to be prompted for, and the UI can
   * know to stick them in the URL or in the Properties object.
   * ie. java.sql.Driver.connect(java.lang.String,
   * java.util.Properties)
   * ie. java.sql.DriverManager.getConnection(java.lang.String,
   * java.util.Properties)
   *
       DbmsHost
       DbmsPort
       DbmsName
       DbmsUsername
       DbmsPassword
  */

  public static final String DB_HOST = "DbmsHost";
  public static final String DB_PORT = "DbmsPort";
  public static final String DB_SERVERNAME = "DbmsName";
  public static final String DB_USER = "DbmsUsername";
  public static final String DB_PASS = "DbmsPassword";
  static final String[] WELL_KNOWN_KEYS = new String[] {DB_HOST, DB_PORT, DB_SERVERNAME, DB_USER, DB_PASS};


  /* package */ JDBCDriverInfo(MetaJDBCDriverInfo metaInfo) {
    this.metaInfo = metaInfo;
  }

  /*
   * <p>Returns unique primary key</p>
   */
  public String getDriverPK() {
    return metaInfo.toString();
  }


  public List<? extends Object> getDbmsVersionList() {
    return metaInfo.getDbmsVersionList();
  }

  public String getDbmsVersion() {
    return metaInfo.getDbmsVersion();
  }

  /*
   * Who makes the DB
   */
  public String getDbmsVendor() {
    return metaInfo.getDbmsVendor();
  }

  /**
   * Who makes the Driver
   */
  public String getDriverVendor() {
    return metaInfo.getDriverVendor();
  }

  public String getDriverClassName() {
    return metaInfo.getDriverClassName();
  }

  /**
   * name of class that extends JDBCURLHelper and using JDBCURLHelperFactory
   * and this class will return a JDBC url, any name/value pairs for the
   * Driver properties
   */
  public String getURLHelperClassName() {
    return metaInfo.getURLHelperClassName();
  }

  /**
   * The type of driver, 2,3,4
   */
  public String getType() {
    return metaInfo.getType();
  }

  public String getTestSQL() {
    return metaInfo.getTestSQL();
  }

  public String getInstallURL() {
    return metaInfo.getInstallURL();
  }

  public String getDescription() {
    return metaInfo.getDescription();
  }

  public boolean isForXA() {
    return metaInfo.isForXA();
  }

  public boolean isCert() {
    return metaInfo.isCert();
  }

  public boolean isFillRequired() {
    return fillRequired;
  }

  public void setFillRequired(boolean fillRequired) {
    this.fillRequired = fillRequired;
  }

  //BEGIN Holders for user gathered data

  /**
   * set by UI
   */
  public void setDbmsName(String dbmsName) {
    setWellKnownAttribute(DB_SERVERNAME, dbmsName);
  }

  /**
   * Customer specific db name
   */
  public String getDbmsName() {
    return getWellKnownAttribute(DB_SERVERNAME);
  }

  /**
   * just in case there is a well known default
   * or one is configured that way
   */
  public String getDbmsNameDefault() {
    return getDefaultFor(DB_SERVERNAME);
  }

  /**
   * set by UI
   */
  public void setDbmsHost(String host) {
    setWellKnownAttribute(DB_HOST, host);
  }

  /**
   * Host where DBMS lives, this one that is not always needed in the URL
   */
  public String getDbmsHost() {
    return getWellKnownAttribute(DB_HOST);
  }

  /**
   * just in case there is a well known default
   * or one is configured that way
   */
  public String getDbmsHostDefault() {
    return getDefaultFor(DB_HOST);
  }

  /**
   * set by UI
   */
  public void setDbmsPort(String port) {
    setWellKnownAttribute(DB_PORT, port);
  }

  public String getDbmsPort() {
    return getWellKnownAttribute(DB_PORT);
  }

  /**
   * just in case there is a well known default
   * or one is configured that way
   */
  public String getDbmsPortDefault() {
    return getDefaultFor(DB_PORT);
  }

  /**
   * set by UI
   */
  public void setPassword(String pass) {
    setWellKnownAttribute(DB_PASS, pass);
  }

  public String getPassword() {
    return getWellKnownAttribute(DB_PASS);
  }

  /**
   * set by UI
   */
  public void setUserName(String user) {
    setWellKnownAttribute(DB_USER, user);
  }

  public String getUserName() {
    return getWellKnownAttribute(DB_USER);
  }

  /**
   * set by UI
   */
  public void setUknownAttribute(String attributeName, String value) {
    setUnknownAttribute(attributeName, value);
  }

  //END expect to be set by the UI
  //END expect to be set by the UI

  //BEGIN called by UI to see if field is required
  //BEGIN called by UI to see if field is required

  //these are the list of the well known name/value pairs that
  //we know will be required with each JDBC Connection
  //this is for the UI to prompt
  //these are convenience methods, alternatively
  //one could call getDriverAttributes() and for each JDBCDriverAttribute
  //call isRequired()
  public boolean isServerNameRequired() {
    return isAttributeRequired(DB_SERVERNAME);
  }

  public boolean isPortRequired() {
    return isAttributeRequired(DB_PORT);
  }

  //I don't know of a single case where this is not required
  //but...... I will leave it here just in case
  public boolean isHostNameRequired() {
    return isAttributeRequired(DB_HOST);
  }

  //possibly these should always default to true?
  //but rather than do this I will just always require it in the xml
  //it seems overkill, but I would prefer to offer flexiblity
  //and I guess complexity at the sake of hardcoding and not
  //allowing override
  public boolean isUserNameRequired() {
    return isAttributeRequired(DB_USER);
  }


  // FortifyIssueSuppression Password Management: Password in Comment
  // This comment does not reveal a password
  //the password should always for connection pools go into the
  // <JDBCConnectionPool Password="#$(*&($*%ENCRYPTED#@$(*))(*">
  // never by default when we setup go into the Properties=
  public boolean isPassWordRequired() {
    return isAttributeRequired(DB_PASS);
  }

  public void addHostPort(String host, int port) {
    hostPorts.add(host, port);
  }

  public void setHostPortAddressList(AddressList hostPortList) {
    hostPorts = hostPortList;
  }

  public boolean removeHostPort(String host, int port) {
    return hostPorts.remove(host, port);
  }

  public AddressList getHostPorts() {
    return hostPorts;
  }

  /*
   * this is here for the UI to say what else besides the well known ones do you possibly want me to prompt the user
   *  for the UI doesnt have to worry about WHERE these properties go, the URLlHelperClassname will either return them
   *  in the URL and will return a list of Properties that belong in the Properties object passed through to the Driver
   */
  public Map<String,JDBCDriverAttribute> getUnknownDriverAttributes() {
    if (unknownDriverAttributes == null) {
      unknownDriverAttributes = new LinkedHashMap<String,JDBCDriverAttribute>(getUnknownDriverAttributesKeys().size());
      Set<String> keys = getUnknownDriverAttributesKeys();
      Iterator<String> i = keys.iterator();
      Map<String,JDBCDriverAttribute> driverAttributes = getDriverAttributes();
      while (i.hasNext()) {
        String key = i.next();
        unknownDriverAttributes.put(key, driverAttributes.get(key));
      }
    }
    return unknownDriverAttributes;
  }

  /*
   * Map containing all JDBCDriverAttribute objects
   * these are the ones that are required and not required
   *
   * see getUnknownProperties()
   */
  public Map<String,JDBCDriverAttribute> getDriverAttributes() {
    if (myJDBCDriverAtributes == null) {
      myJDBCDriverAtributes = metaInfo.getDriverAttributes();
    }
    return myJDBCDriverAtributes;
  }

  /*
   * The keys of the unknown but required properties
   */

  public Set<String> getUnknownDriverAttributesKeys() {
    return metaInfo.getUnknownDriverAttributesKeys();
  }

  //END called by UI to see if field is required
  //END called by UI to see if field is required

  //General public convenience methods
  //General public convenience methods

  public boolean isDriverInClasspath() {
    if (!triedToLoadDriver) {
      triedToLoadDriver = true;
      try {
        Class.forName(getDriverClassName()).getDeclaredConstructor().newInstance();
        driverLoaded = true;
      } catch (Exception e) {
        loadDriverException = e;
      }
    }
    return driverLoaded;
  }

  //ClassNotFoundException
  //InstantiationException
  //IllegalAccessError
  //UnsatisfiedLinkError
  //returns null in none encountered
  public Exception exceptionEncounteredLoadingDriver() {
    return loadDriverException;
  }

  //If this doesnt work for you and you need to format yourself just delete this method
  //more than likely this doesnt work
  public String displayString() {
    StringBuffer buff = new StringBuffer();
    if (isCert()) {
      buff.append("*");
    }
    buff.append(getDriverVendor());
    buff.append("'s ");
    if (!getDriverVendor().equals(getDbmsVendor())) {
      buff.append(getDbmsVendor() + " ");
    }
    buff.append("Type ");
    buff.append(getType());
    buff.append(" Driver ");
    if (isForXA()) {
      buff.append("for Distributed Transactions (XA) ");
    }
    buff.append(" - Versions : " + getDbmsVersion());
    return buff.toString();
  }

  //This is a nicely formated dispaly string that the console uses
  public String toString() {
    return metaInfo.toString();
  }

  public String toVerboseString() {
    StringBuffer buff = new StringBuffer();
    buff.append("DBMS Vendor      :  " + (getDbmsVendor() == null ? "null" : getDbmsVendor()) + "\n");
    buff.append("Driver Vendor    :  " + (getDriverVendor() == null ? "null" : getDriverVendor()) + "\n");
    buff.append("Driver Type      :  " + (getType() == null ? "null" : getType()) + "\n");
    buff.append("Driver Class     :  " + (getDriverClassName() == null ? "null" : getDriverClassName()) + "\n");
    buff.append("XA ?             :  " + Boolean.valueOf(isForXA()).toString() + "\n");

    buff.append("URLHelperClass   :  " + (getURLHelperClassName() == null ? "null" : getURLHelperClassName()) + "\n");

    buff.append("DBMS Version     :  " + (getDbmsVersion() == null ? "null" : getDbmsVersion()) + "\n");
    buff.append("DBMS Name        :  " + (getDbmsName() == null ? "null" : getDbmsName()) + "\n");

    //    buff.append("DBMS Def Host    :  " + (getDefaultDbmsHost() == null ? "null" : getDefaultDbmsHost())+ "\n");
    buff.append("DBMS Host        :  " + (getDbmsHost() == null ? "null" : getDbmsHost()) + "\n");
    buff.append("isHostRequired   :  " + Boolean.valueOf(isHostNameRequired()).toString() + "\n");


    //    buff.append("DBMS Def Port    :  " + (getDefaultDbmsPort() == null ? "null" : getDefaultDbmsPort())+ "\n");
    buff.append("DBMS Port        :  " + (getDbmsPort() == null ? "null" : getDbmsPort()) + "\n");
    buff.append("isPortRequired   :  " + Boolean.valueOf(isPortRequired()).toString() + "\n");

    buff.append("DBMS password    :  " + (getPassword() == null ? "null" : getPassword()) + "\n");

    buff.append("DBMS user        :  " + (getUserName() == null ? "null" : getUserName()) + "\n");

    buff.append("DBMS test sql    :  " + (getTestSQL() == null ? "null" : getTestSQL()) + "\n");

    buff.append("Description      :  " + (getDescription() == null ? "null" : getDescription()) + "\n");
    return buff.toString();

  }

  // ~;;~-_-__--_||_--__-_-;;~ //
  // Internal Convenience methods
  // Internal Convenience methods
  // ~;;~-_-__--_||_--__-_-;;~ //


  private void setWellKnownAttribute(String attributeName, String attributeValue) {
    JDBCDriverAttribute prop = null;
    if (getDriverAttributes().containsKey(attributeName)) {
      prop = getDriverAttributes().get(attributeName);
    } else {
      prop = new JDBCDriverAttribute(metaInfo);
      prop.setName(attributeValue);
    }
    prop.setValue(attributeValue);
    getDriverAttributes().put(attributeName, prop);
  }

  private void setUnknownAttribute(String attributeName, String attributeValue) {
    if (!getDriverAttributes().containsKey(attributeName)) {
      throw new AssertionError(
        "Trying to set a value '" + attributeValue + "' on an unknown attribute '" + attributeName + "'");
    }
    JDBCDriverAttribute prop = getDriverAttributes().get(attributeName);
    prop.setValue(attributeValue);
    getDriverAttributes().put(attributeName, prop);
  }

  private String getWellKnownAttribute(String attributeName) {
    return getWellKnownAttribute(attributeName, false);
  }

  private String getWellKnownAttribute(String attributeName, boolean returnDefault) {
    if (getDriverAttributes().containsKey(attributeName)) {
      JDBCDriverAttribute prop = getDriverAttributes().get(attributeName);
      if (prop.getValue() != null) {
        if (fillRequired && prop.getValue().equals("")) {
          return attributeName; // make sure isValid will pass
        }
        return prop.getValue();
      }
      if (returnDefault) {
        if (prop.getDefaultValue() != null) {
          return prop.getDefaultValue();
        }
      }
      if (fillRequired) {
        return attributeName;
      }
    }
    return null;
  }

  /*
   * get default value for this attribute
   * null if there is no attribute found by that name
   * or null if there is no default attribute
   * or empty string if its in the XML as DefautlValue=""
   */
  private String getDefaultFor(String attributeName) {
    if (getAttribute(attributeName) != null) {
      return getAttribute(attributeName).getDefaultValue();
    }
    return null;
  }

  private JDBCDriverAttribute getAttribute(String attributeName) {
    if (getDriverAttributes().containsKey(attributeName)) {
      return getDriverAttributes().get(attributeName);
    }
    return null;
  }

  /*
   * Is this Attribute with attributeName required?
   */
  private boolean isAttributeRequired(String attributeName) {
    if (getDriverAttributes().containsKey(attributeName)) {
      JDBCDriverAttribute prop = getDriverAttributes().get(attributeName);
      return prop.isRequired();
    } else {
      return false;
    }
  }

  //========== Comparable Implementation
  public int compareTo(Object o) throws ClassCastException {
    JDBCDriverInfo info1 = (JDBCDriverInfo) o;
    return getDriverPK().compareTo(info1.getDriverPK());
  }


}
