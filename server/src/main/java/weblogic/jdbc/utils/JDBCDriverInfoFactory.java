// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.jdbc.utils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.TreeSet;

/**
 * This is the entry class for getting JDBCDriverInfo's
 * <p>
 * You get this factory from JDBCConnectionMetaDataParser.getJDBCDriverInfoFactory()
 * <p>
 * You can use this factory to get handles to the various JDBCDriverInfo objects
 * <p>
 * Using JDBCURLHelperFactory and a JDBCDriverInfo you can get a JDBCURLHelper
 * which formats the JDBC URL and the required properties object
 *
 */

public final class JDBCDriverInfoFactory {

  /* package */
  public JDBCDriverInfoFactory(List<MetaJDBCDriverInfo> listOfJDBCDriverInfos) {
    driverInfos = listOfJDBCDriverInfos;
  }

  private List<MetaJDBCDriverInfo> driverInfos = null;

  private String[] dbVendorNames;

  public String[] getDBMSVendorNames() {
    if (driverInfos == null) {
      return null;
    }
    if (dbVendorNames == null) {
      //take all the vendor names and strip out all the duplicates
      //they just replace 
      HashSet<String> set = new HashSet<String>();
      Iterator<MetaJDBCDriverInfo> it = driverInfos.iterator();
      while (it.hasNext()) {
        MetaJDBCDriverInfo info = it.next();
        set.add(info.getDbmsVendor());
      }
      dbVendorNames = new String[set.size()];
      dbVendorNames = set.toArray(dbVendorNames);
      Arrays.sort(dbVendorNames);
    }
    return dbVendorNames;
  }

  /*
   * <p>Returns an array of database driver infos for this vendor</p>
   *
   */
  public JDBCDriverInfo[] getDriverInfos(String vendorName) {
    // Filter out the database driver info for other vendors
    TreeSet<JDBCDriverInfo> set = new TreeSet<>();
    for (MetaJDBCDriverInfo driverInfo : driverInfos) {
      if (driverInfo.getDescription() != null
        && (driverInfo.getDescription().contains("GridLink")
        || driverInfo.getDescription().contains("UCP"))) {
        continue;
      }
      if (driverInfo.getDbmsVendor().equals(vendorName)) {
        set.add(new JDBCDriverInfo(driverInfo));
      }
    }
    // Return the results, as an array
    JDBCDriverInfo[] vendorDriverInfos = new JDBCDriverInfo[set.size()];
    vendorDriverInfos = set.toArray(vendorDriverInfos);
    Arrays.sort(vendorDriverInfos);
    return vendorDriverInfos;
  }

  /*
   * <p>Returns an array of database driver infos for GridLink</p>
   */
  public JDBCDriverInfo[] getGridLinkDriverInfos() {
    // Filter out the database driver info for only GridLink
    TreeSet<JDBCDriverInfo> set = new TreeSet<>();
    for (MetaJDBCDriverInfo driverInfo : driverInfos) {
      if (driverInfo.getDescription() == null
        || !driverInfo.getDescription().contains("GridLink")) {
        continue;
      }
      set.add(new JDBCDriverInfo(driverInfo));
    }
    // Return the results, as an array
    JDBCDriverInfo[] vendorDriverInfos = new JDBCDriverInfo[set.size()];
    vendorDriverInfos = set.toArray(vendorDriverInfos);
    return vendorDriverInfos;
  }

  /*
   * <p>Returns an array of database driver infos for UCP</p>
   */
  public JDBCDriverInfo[] getUCPDriverInfos() {
    // Filter out the database driver info for only UCP
    TreeSet<JDBCDriverInfo> driverInfos = new TreeSet<>();
    for (MetaJDBCDriverInfo driverInfo : this.driverInfos) {
      if (driverInfo.getDescription() == null || !driverInfo.getDescription().contains("UCP")) {
        continue;
      }
      driverInfos.add(new JDBCDriverInfo(driverInfo));
    }
    // Return the results, as an array
    JDBCDriverInfo[] vendorDriverInfos = new JDBCDriverInfo[driverInfos.size()];
    vendorDriverInfos = driverInfos.toArray(vendorDriverInfos);
    return vendorDriverInfos;
  }

  /*
   * get JDBCDriverInfo based on vendorName
   *
   * @vendorName is the toString() of JDBCDriverInfo
   */
  public JDBCDriverInfo getDriverInfo(String vendorName) {
    // Look for a driver with this name
    for (MetaJDBCDriverInfo metaInfo : driverInfos) {
      if (metaInfo.toString().equals(vendorName)) {
        return new JDBCDriverInfo(metaInfo);
      }
    }
    return null;
  }

  /*
   * get JDBCDriverInfo based on className and transactional flag
   *
   * @driverClassName is the class name for the driver
   */
  public JDBCDriverInfo getDriverInfoByClass(String driverClassName) {
    // Look for a driver with this name
    for (MetaJDBCDriverInfo metaInfo : driverInfos) {
      if (metaInfo.getDriverClassName().equals(driverClassName)) {
        return new JDBCDriverInfo(metaInfo);
      }
    }
    return null;
  }

  /*
   * get JDBCDriverInfo based on className and transactional flag
   *
   * @driverClassName is the class name for the driver
   * @ isForXA is whether or not the isForXA flag is true
   */
  public JDBCDriverInfo getDriverInfoByClass(String driverClassName,
                                             boolean isForXA) {
    // Look for a driver with this name and flag
    for (MetaJDBCDriverInfo metaInfo : driverInfos) {
      if ((metaInfo.isForXA() == isForXA) && metaInfo.getDriverClassName().equals(driverClassName)) {
        return new JDBCDriverInfo(metaInfo);
      }
    }
    return null;
  }

  //for testing purposes
  public List<JDBCDriverInfo> getJDBCDriverInfos() {
    List<JDBCDriverInfo> newDriverInfoList = new ArrayList<>();
    for (MetaJDBCDriverInfo metaInfo : driverInfos) {
      if (metaInfo.getDescription() != null
        && (metaInfo.getDescription().contains("GridLink") || metaInfo.getDescription().contains("UCP"))) {
        continue;
      }
      newDriverInfoList.add(new JDBCDriverInfo(metaInfo));
    }
    return newDriverInfoList;
  }
}
