// Copyright (c) 2020, 2024, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.common.utils;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.yaml.snakeyaml.Yaml;
import weblogic.remoteconsole.jdbc.utils.JDBCDriverAttribute;
import weblogic.remoteconsole.jdbc.utils.JDBCDriverInfoFactory;
import weblogic.remoteconsole.jdbc.utils.MetaJDBCDriverInfo;

public class JDBCDriversUtils {
  private static final String JDBC_DRIVERS_RESOURCE = "jdbcdrivers.yaml";
  private static List<MetaJDBCDriverInfo> driverInfos = new ArrayList<>();
  private static JDBCDriverInfoFactory infoFactory = null;

  public static JDBCDriverInfoFactory getJDBCDriverInfoFactory() {
    if (infoFactory == null) {
      if (driverInfos.isEmpty()) {
        driverInfos = JDBCDriversUtils.getJdbcDrivers();
      }
      infoFactory = new JDBCDriverInfoFactory(driverInfos);
    }
    return infoFactory;
  }

  @SuppressWarnings("unchecked")
  public static List<MetaJDBCDriverInfo> getJdbcDrivers() {
    InputStream is = JDBCDriversUtils.class
      .getClassLoader()
      .getResourceAsStream(JDBC_DRIVERS_RESOURCE);
    Yaml yaml = new Yaml();
    Map<String,ArrayList<Object>> obj = yaml.load(is);
    try {
      is.close();
    } catch (java.io.IOException ignore) {
      // This is to shut up the code checkers
      is = null;
    }
    /*
    This stuff couldn't work with the unmodified yaml.
    Representer representer = new Representer();
    representer.getPropertyUtils().setSkipMissingProperties(true);

    Yaml yaml = new Yaml(new Constructor(JdbcDriversConfig.class));
    JdbcDriversConfig jdbcDriversConfig = yaml.load(is);
    */
    // gets the whole list of driverInfos from the yaml
    ArrayList<Map<String,Object>> rawDriversList =
      (ArrayList<Map<String,Object>>) (((Map<String,Object>) obj.get("JDBC-Drivers")).get("Driver"));
    // convert to a collection of Driver objects
    for (Map<String, Object> driverObj : rawDriversList) {
      MetaJDBCDriverInfo driver = new MetaJDBCDriverInfo();
      for (Map.Entry<String, Object> entry: driverObj.entrySet()) {
        String key = entry.getKey();
        Object value = entry.getValue();
        switch (key) {
          case "@_Database":
            driver.setDbmsVendor((String) value);
            break;
          case "@_Vendor":
            driver.setDriverVendor((String) value);
            break;
          case "@_Type":
            driver.setType((String) value);
            break;
          case "@_DatabaseVersion":
            driver.setDbmsVersion((String) value);
            break;
          case "@_ForXA":
            driver.setForXA(((String) value).equalsIgnoreCase("true"));
            break;
          case "@_ClassName":
            driver.setDriverClassName((String) value);
            break;
          case "@_URLHelperClassname":
            driver.setURLHelperClassName(((String) value)
              .replace("weblogic.jdbc.utils", "weblogic.remoteconsole.jdbc.utils"));
            break;
          case "@_TestSql":
            driver.setTestSQL((String) value);
            break;
          case "@_Description":
            driver.setDescription((String) value);
            break;
          case "@_Cert":
            driver.setCert(((String) value).equalsIgnoreCase("true"));
            break;
          case "Attribute":
            setDriverAttributes(driver, (List<Map<String, String>>) value);
            break;
          default:
            System.out.println("No action defined for Driver key: " + key);
        }

      }
      driverInfos.add(driver);
    }
    return driverInfos;
  }

  private static void setDriverAttributes(MetaJDBCDriverInfo driver, List<Map<String, String>> rawAttributes) {
    for (Map<String, String> attr : rawAttributes) {
      JDBCDriverAttribute attribute = new JDBCDriverAttribute(driver);
      for (Map.Entry<String, String> entry: attr.entrySet()) {
        String key = entry.getKey();
        String value = entry.getValue();
        switch (key) {
          case "@_Name":
            attribute.setName(value);
            driver.setDriverAttribute(value, attribute);
            break;
          case "@_Required":
            attribute.setIsRequired(value);
            break;
          case "@_Encrypted":
            attribute.setEncrypted(value);
            break;
          case "@_InURL":
            attribute.setInURL(value.equalsIgnoreCase("true"));
            break;
          case "@_Description":
            attribute.setDescription(value);
            break;
          case "@_DefaultValue":
            attribute.setDefaultValue(value);
            break;

          default:
            System.out.println("No action defined for JDBCDriverAttribute key: " + key);
        }
      }
    }

  }

  // for testing
  public static void main(String... args) {
    List<MetaJDBCDriverInfo> drivers = JDBCDriversUtils.getJdbcDrivers();
    System.out.println(drivers);
  }

}
