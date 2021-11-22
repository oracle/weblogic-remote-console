// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.jdbc.utils;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.StringTokenizer;

/**
 * This class represents a set of metadata regarding a making a JDBC Connection
 * using a JDBC Driver.  This is populated by the xml parser JDBCConnectionMetaDataParser
 * <p>
 * This class is never accessed directly but is wrapped by a JDBCDriverInfo
 *
 */

public class MetaJDBCDriverInfo implements Serializable {
  private static final long serialVersionUID = 184401685166623934L;

  private String dbmsVendor;
  private String dbmsDriverVendor;
  private String driverClassName;
  private String driverType;
  private String urlHelperClassname;
  private String testSQL;
  private String versionString;
  private String installURL;
  private String description;

  private String datasourceTemplateName = null;
  private String jdbcProviderTemplateName = null;

  private final List<String> versionList = new ArrayList<String>();

  private final Map<String,JDBCDriverAttribute> driverAttributes =
    new LinkedHashMap<String,JDBCDriverAttribute>(20);

  private final Map<String,JDBCDriverAttribute> unknownDriverAttributeKeys =
    new LinkedHashMap<String,JDBCDriverAttribute>(20);

  private boolean forXA;

  private boolean cert = false;    // certified

  public MetaJDBCDriverInfo() {
  }

  /*
   * can take a comma delimited string of versions
   * 8.1.7,8.1.9,9.0.1
   */
  public void setDbmsVersion(String versions) {
    versionString = versions;
    StringTokenizer tokenizer = new StringTokenizer(versions, ",");
    while (tokenizer.hasMoreTokens()) {
      String token = tokenizer.nextToken();
      versionList.add(token);
    }
  }

  public List<? extends Object> getDbmsVersionList() {
    return versionList;
  }

  public String getDbmsVersion() {
    return versionString;
  }

  public void setDbmsVendor(String dbVendor) {
    dbmsVendor = dbVendor;
  }


  /*
   * Who makes the DB
   */
  public String getDbmsVendor() {
    return dbmsVendor;
  }

  public void setDriverVendor(String driverVendor) {
    dbmsDriverVendor = driverVendor;
  }

  /**
   * Who makes the Driver
   */
  public String getDriverVendor() {
    return dbmsDriverVendor;
  }

  public void setDriverClassName(String className) {
    driverClassName = className;
  }

  public String getDriverClassName() {
    return driverClassName;
  }

  public void setURLHelperClassName(String urlClassName) {
    urlHelperClassname = urlClassName;
  }

  /**
   * name of class that extends JDBCURLHelper and using JDBCURLHelperFactory
   * and this class will return a JDBC url, any name/value pairs for the
   * Driver properties
   */
  public String getURLHelperClassName() {
    return urlHelperClassname;
  }


  public void setType(String type) {
    driverType = type;
  }

  /**
   * The type of driver, 2,3,4
   */
  public String getType() {
    return driverType;
  }

  public void setTestSQL(String sql) {
    testSQL = sql;
  }

  public String getTestSQL() {
    return testSQL;
  }

  public void setInstallURL(String url) {
    installURL = url;
  }

  public String getInstallURL() {
    return installURL;
  }

  public void setDescription(String driverDescription) {
    description = driverDescription;
  }

  public String getDescription() {
    return description;
  }

  public void setJdbcProviderTemplateName(String providerTemplateName) {
    jdbcProviderTemplateName = providerTemplateName;
  }

  public String getJdbcProviderTemplateName() {
    return jdbcProviderTemplateName;
  }

  public void setDatasourceTemplateName(String dsTemplateName) {
    datasourceTemplateName = dsTemplateName;
  }

  public String getDatasourceTemplateName() {
    return datasourceTemplateName;
  }

  public void setForXA(String xaArg) {
    setForXA(Boolean.valueOf(xaArg).booleanValue());
  }

  public void setForXA(boolean xaArg) {
    forXA = xaArg;
  }

  public boolean isForXA() {
    return forXA;
  }

  public void setCert(String certArg) {
    setCert(Boolean.valueOf(certArg).booleanValue());
  }

  public void setCert(boolean certArg) {
    cert = certArg;
  }

  public boolean isCert() {
    return cert;
  }

  public void setDriverAttribute(String attributeName, JDBCDriverAttribute attribute) {
    boolean unknown = true;
    for (int i = 0; i < JDBCDriverInfo.WELL_KNOWN_KEYS.length; i++) {
      if (JDBCDriverInfo.WELL_KNOWN_KEYS[i].equals(attributeName)) {
        unknown = false;
      }
    }
    if (unknown) {
      unknownDriverAttributeKeys.put(attributeName, attribute);
    }
    driverAttributes.put(attributeName, attribute);
  }

  /*
   * Map containing all JDBCDriverAttribute objects, the key is the attributeName
   * these are the ones that are required and not required, known and unknown
   *
   * see getUnknownDriverAttributesKeys()
   */
  public Map<String,JDBCDriverAttribute> getDriverAttributes() {
    Map<String,JDBCDriverAttribute> attackOfTheClones =
      new LinkedHashMap<String,JDBCDriverAttribute>(driverAttributes.size());
    for (Map.Entry<String, JDBCDriverAttribute> entry : driverAttributes.entrySet()) {
      JDBCDriverAttribute cloner = null;
      try {
        cloner = (JDBCDriverAttribute) entry.getValue().clone();
      } catch (CloneNotSupportedException e) {
        // Can't clone this attribute
      }
      attackOfTheClones.put(entry.getKey(), cloner);
    }
    return attackOfTheClones;
  }

  /**
   * The key entries to of unknown JDBCDriverAttribute
   */
  public Set<String> getUnknownDriverAttributesKeys() {
    return unknownDriverAttributeKeys.keySet();
  }

  public String toString() {
    StringBuffer buffy = new StringBuffer();
    if (isCert()) {
      buffy.append("*");
    }
    buffy.append(getDriverVendor());
    buffy.append("'s");
    if (!getDriverVendor().equals(getDbmsVendor())) {
      buffy.append(" " + getDbmsVendor());
    }
    buffy.append(" Driver ");
    if (isForXA() || getType() != null) {
      buffy.append("(");
      if (getType() != null) {
        buffy.append(getType());
        if (isForXA()) {
          buffy.append(" XA");
        }
        buffy.append(") ");
      } else {
        buffy.append("XA) ");
      }
    }
    if (getDescription() != null) {
      buffy.append(getDescription() + " ");
    }

    String ver = getDbmsVersion();
    if (ver != null && !ver.trim().equals("")) {
      buffy.append("Versions:");
      buffy.append(getDbmsVersion());
    }
    return buffy.toString();
  }

}
