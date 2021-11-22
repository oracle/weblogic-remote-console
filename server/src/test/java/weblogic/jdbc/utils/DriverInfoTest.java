// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.jdbc.utils;

import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import weblogic.remoteconsole.common.utils.JDBCDriversUtils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class DriverInfoTest {
  static JDBCDriverInfoFactory driverUtil = null;
  static JDBCURLHelperFactory factory = null;
  //static JDBCConnectionMetaDataParser parser = null;

  @BeforeAll
  public static void setUpBeforeClass() throws Exception {
    //parser = new JDBCConnectionMetaDataParser();
    factory = JDBCURLHelperFactory.newInstance();
    //driverUtil = parser.getJDBCDriverInfoFactory();
    driverUtil = JDBCDriversUtils.getJDBCDriverInfoFactory();
  }

  @Test
  public void testOracleVendor() throws Exception {
    testReadVendor("Oracle");
  }

  @Test
  public void testOracleDriver() throws Exception {
    testDriver("oracle.jdbc.OracleDriver",
      "jdbc:oracle:thin:@localhost:1111:testdb");
  }

  @Test
  public void testOracleDriverFill() throws Exception {
    testDriver("oracle.jdbc.OracleDriver",
      "jdbc:oracle:thin:@DbmsHost:DbmsPort:DbmsName", true);
  }

  @Test
  public void testOraclePoolDriver() throws Exception {
    // This is the one that the CTS uses
    testDriver("oracle.jdbc.pool.OracleDataSource",
      "jdbc:oracle:thin:@localhost:1111:testdb");
  }

  @Test
  public void testDerbyDriver() throws Exception {
    // This is the one that the CTS uses
    testDriver("org.apache.derby.jdbc.ClientDataSource",
      "jdbc:derby://localhost:1111/testdb;ServerName=localhost;databaseName=testdb;create=true");
  }

  @Test
  public void testMysqlDriver() throws Exception {
    testDriver("com.mysql.cj.jdbc.MysqlXADataSource",
      "jdbc:mysql://localhost:1111/testdb");
  }

  @Test
  public void testOracleUCPDriver() throws Exception {
    testUCPDriver("oracle.jdbc.pool.OracleDataSource");
  }

  private void testDriver(String className, String url) throws Exception {
    testDriver(className, url, false);
  }

  private void testDriver(String className, String url, boolean fillRequired) throws Exception {
    List<JDBCDriverInfo> driverInfos = driverUtil.getJDBCDriverInfos();
    Iterator<JDBCDriverInfo> i = driverInfos.iterator();
    boolean found = false;
    boolean derby = (className.indexOf("derby") != -1);
    while (i.hasNext()) {
      JDBCDriverInfo driverInfo = i.next();
      driverInfo.setFillRequired(fillRequired);
      if (!driverInfo.getDriverClassName().equals(className)) {
        continue;
      }
      found = true;
      String desc = driverInfo.getDescription();
      if (desc != null) {
        assertTrue((!desc.contains("GridLink")), "unexpected GridLink entry");
        assertTrue((!desc.contains("UCP")), "unexpected UCP entry");
      }
      // driverInfo.displayString()
      // driverInfo.getDriverClassName() 
      // driverInfo.getURLHelperClassName()
      if (driverInfo.isServerNameRequired() && !fillRequired) {
        driverInfo.setDbmsName("testdb");
      }

      if (driverInfo.isPortRequired() && !fillRequired) {
        driverInfo.setDbmsPort("1111");
      }

      if (driverInfo.isHostNameRequired() && !fillRequired) {
        driverInfo.setDbmsHost("localhost");
      }
      if (driverInfo.isUserNameRequired() && !fillRequired) {
        driverInfo.setUserName("user");
      }
      if (driverInfo.isPassWordRequired() && !fillRequired) {
        driverInfo.setPassword("password");
      }
      //  driverInfo.isDriverInClasspath()
      JDBCURLHelper helper = factory.getJDBCURLHelper(driverInfo);
      String newURL = helper.getURL();
      assertEquals(url, newURL);
      Properties props = helper.getProperties();
      if (props != null) {
        for (Map.Entry<Object, Object> entry: props.entrySet()) {
          String key = (String)entry.getKey();
          String val = (String)entry.getValue();
          if (derby) {
            if (val.contains("databaseName")) {
              assertTrue((val.contains(";create=true")), "create=true missing");
            }
          }
          //System.out.print(key + " : " + ((String)props.get(key)) + "\n");
        }
      } else {
        //System.out.print("none");
      }
      break;
    }
    assertTrue(found, "driver not found");
  }

  private void testUCPDriver(String className) throws Exception {
    JDBCDriverInfo[] driverInfos = driverUtil.getUCPDriverInfos();
    boolean found = false;
    for (JDBCDriverInfo driverInfo : driverInfos) {
      if (!driverInfo.getDriverClassName().equals(className)) {
        continue;
      }
      found = true;
      String desc = driverInfo.getDescription();
      assertTrue((!desc.contains("GridLink")), "unexpected GridLink entry");
      assertFalse((!desc.contains("UCP")), "expected UCP entry");
      driverInfo.getDbmsVersionList();
      driverInfo.getTestSQL();
      driverInfo.getInstallURL();
      driverInfo.getDbmsNameDefault();
      driverInfo.toVerboseString();
      JDBCURLHelper helper = factory.getJDBCURLHelper(driverInfo);
      try {
        helper.getURL();
        assertTrue(true, "UCP should not return URL");
      } catch (JDBCDriverInfoException ignore) {
        // ignore
      }
      Properties props = helper.getProperties();
      if (props != null) {
        for (Object o : props.keySet()) {
          String key = (String) o;
          //System.out.print(key + " : " + ((String)props.get(key)) + "\n");
        }
      } else {
        //System.out.print("none");
      }
      Map<String,JDBCDriverAttribute> otherAttributes = driverInfo.getUnknownDriverAttributes();

      if (otherAttributes != null) {
        boolean first = true;
        for (JDBCDriverAttribute att : otherAttributes.values()) {
          if (att.getName() != null) {
            assertNotEquals("LogWriter", att.getName());
            if (first) {
              first = false;
              att.getDisplayName();
              att.getPropertyName();
              att.isInURL();
              att.getDescription();
              att.toString();
            }
          }
        }
      }
      break;
    }
    assertTrue(found, "driver not found");
  }

  private void testReadVendor(String vendor) throws Exception {
    String[] vendorNames = driverUtil.getDBMSVendorNames();
    boolean found = false;
    for (int i = 0; i < vendorNames.length; i++) {
      if (vendorNames[i].equals(vendor)) {
        found = true;
        break;
      }
    }
    assertTrue(found, "Vendor not found: " + vendor);
  }

  @Test
  public void testDrivers() throws Exception {
    checkList(driverUtil.getDriverInfos("Oracle"));

    checkList(driverUtil.getGridLinkDriverInfos());

    // checkList(driverUtil.getUCPDriverInfos()); Tested above

    driverUtil.getDriverInfoByClass("*Oracle's Driver (Thin XA) for Instance connections; Versions:Any");

    assertNotNull(driverUtil.getDriverInfoByClass("oracle.jdbc.OracleDriver", false), "getDriverInfo null");
    List<JDBCDriverInfo> list = driverUtil.getJDBCDriverInfos();
    JDBCDriverInfo[] info = new JDBCDriverInfo[list.size()];
    info = list.toArray(info);
    checkList(info);
  }

  private void checkList(JDBCDriverInfo[] driverInfos) throws Exception {
    boolean fillRequired = false;

    for (JDBCDriverInfo driverInfo : driverInfos) {
      driverInfo.addHostPort("localhost", 7777); // Hack for Active GridLink
      Set<String> set = driverInfo.getUnknownDriverAttributesKeys();
      boolean ttcServer = false;
      boolean dsn = false;
      for (String key : set) {
        String val = "1234"; // make the default numeric in case converted
        // Hacks to handle BI Server driver and various TimesTen configurations
        switch (key) {
          case "Ssl":
          case "TrustAnyServer":
            val = "False";
            break;
          case "LogLevel":
            val = "SEVERE";
            break;
          case "TTC_SERVER":
            ttcServer = true;
            break;
          case "DSN":
            dsn = true;
            continue; // don't add it yet
          default:
            break;
        }
        if (!fillRequired || ttcServer) {
          driverInfo.setUknownAttribute(key, val);
          Map<String, JDBCDriverAttribute> otherAttributes = driverInfo.getUnknownDriverAttributes();
          boolean found = false;
          if (otherAttributes != null) {
            for (JDBCDriverAttribute att : otherAttributes.values()) {
              if (att.getName().equals(key)) {
                found = true;
                assertEquals(att.getValue(), val, "Value " + att.getValue() + " equals " + val);
                break;
              }
            }
          }
          assertTrue(found, "found attribute " + key);
        }
      }
      if (dsn && !ttcServer) {
        driverInfo.setUknownAttribute("DSN", "1234");
      }

      assertNotNull(driverInfo.displayString(), "displayString null");
      assertNotNull(driverInfo.getDriverClassName(), "DriverClassName null");
      assertNotNull(driverInfo.getURLHelperClassName(), "URLHelperClassName null");
      if (fillRequired) {
        driverInfo.setFillRequired(true);
      } else {
        if (driverInfo.isServerNameRequired()) {
          driverInfo.setDbmsName("testdb");
        }

        if (driverInfo.isPortRequired()) {
          driverInfo.getDbmsPortDefault(); // may be null
          driverInfo.setDbmsPort("7777");
        }

        if (driverInfo.isHostNameRequired()) {
          driverInfo.getDbmsHostDefault(); // may be null
          driverInfo.setDbmsHost("localhost");
        }
        if (driverInfo.isUserNameRequired()) {
          driverInfo.setUserName("scott");
        }
        if (driverInfo.isPassWordRequired()) {
          driverInfo.setPassword("tiger");
        }
      }
      driverInfo.isDriverInClasspath();

      JDBCURLHelper helper = factory.getJDBCURLHelper(driverInfo);
      if (!driverInfo.toString().contains("UCP")) {
        // ucp doesn't support getURL
        String newurl = helper.getURL();
        assertNotNull(newurl, "URL null");
        if (fillRequired) {
          System.out.println(newurl);
        }
      }
      assertNotNull(helper.getProperties(), "Properties null");
    }
  }
}
