// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.jdbc.utils;

import java.util.Locale;
import java.util.Map;
import java.util.Properties;



public abstract class JDBCURLHelper {

  public JDBCURLHelper() {
  }

  private JDBCDriverInfo info;

  protected JDBCURLHelper(JDBCDriverInfo info) {
    this.info = info;
  }

  protected void setJDBCDriverInfo(JDBCDriverInfo info) {
    this.info = info;
  }

  public JDBCDriverInfo getJDBCInfo() {
    return info;
  }

  // Need to allow for some way for the helper class to signify that
  // it was not given sufficient information in the constructure to
  // produce a URL do you do this on getInstance()? or do you do this
  // getURL?
  //
  // do we follow the javabeans model and provide an empty constructor
  // and provide setters and getters

  // REVIEW rwoollen@weblogic.com 23-Aug-02 -- Good point, we need to
  // think about all the scenarios here.  I suspect that we'll have
  // either always collect the same info, or collect the info based on
  // the database type, with some default set of info for other.  if
  // that's not sufficient then we'd have to extend this in Olympic.

  // REVIEW markg@bea.com I think I have this worked out in the XML
  // file by allow users to specify arbitrary Properties they want us
  // to gather, we keep track of a wellknown expected lists of
  // properties but if they add unknown ones the UI will still prompt
  public abstract String getURL() throws JDBCDriverInfoException;

  // There are times when you need to gather info from the user and it
  // will be formatted in the URL other times it will need to be in
  // the properties that is passed to the DriverManager/Driver an
  // exmaple of this is the logically named user database that is
  // installed on the physical DB For WebLogic's type 2 Oracle drivers
  // this needs to be in the Properties object, but in Oracle's type 4
  // drivers this needs to be in the URL
  // 
  // So if this is required by the Driver, then this should return a
  // set of name/value Strings that belong in the properties object,
  // otherwise it can return null
  public abstract Properties getProperties() throws JDBCDriverInfoException;

  // REVIEW adam@weblogic.com 01-Nov-02 -- We might want to call
  // Driver.acceptsURL() by default here.  It is likely to do the
  // right thing most of the time.

  /*
   * One possible check if a value from JDBCDriverInfo is valid
   * can be overidden for more specific and explicit checks
   */
  public boolean isValid(String checkme) {
    return checkme != null && checkme.length() > 0;
  }

  public String getOtherAttribute(String name, JDBCDriverInfo info) {
    Map<String,JDBCDriverAttribute> otherAttributes = info.getUnknownDriverAttributes();
    String lcName = name.toLowerCase(Locale.ENGLISH);
    if (otherAttributes != null) {
      for (JDBCDriverAttribute att : otherAttributes.values()) {
        if (att.getName().toLowerCase(Locale.ENGLISH).startsWith(lcName)) {
          if (att.getValue() == null) {
            if (att.isRequired() && info.isFillRequired()) {
              return att.getName();
            }
            return "";
          }
          return att.getValue();
        }

      }
    }
    return "";
  }
}
