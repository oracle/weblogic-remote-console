// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.build;

import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.OutputStream;
import java.io.PrintStream;
import java.util.Properties;
import java.util.Set;
import java.util.TreeSet;

/**
 * This tool takes a list of properties files.  For each file, props, we load it int a Properties object,
 * and examine each property.  If the property key ends with "HTML" or "helpSummaryHTML" or contains
 * ".helpTopics", we move it from the original Properties object to a new Properties object.
 * After doing this for each property, we write out a newproperties file for those that did not match,
 * and write out another new file, formatted as an html file.
 */
public class PropertiesToHtml {
  // The file prefix for the newly-created properties files with html entries removed
  public static final String NON_HTML_PREFIX = "non_html_";

  public static void main(String... args) throws Exception {
    new PropertiesToHtml(args);
  }

  public PropertiesToHtml(String... propsToConvert) throws Exception {
    int numPropsFiles = propsToConvert.length;

    String[] propFileNames = new String[numPropsFiles];
    Integer[] numProps = new Integer[numPropsFiles];
    // propsToConvert is a list of path names of properties files from different versions of WLS
    // We load all of these, each into a separate Properties object
    Properties[] originalProps = new Properties[numPropsFiles];
    for (int i = 0; i < numPropsFiles; i++) {
      // FortifyIssueSuppression Path Manipulation
      // This is a build tool.
      File propFile = new File(propsToConvert[i]);
      propFileNames[i] = propFile.getName();
      originalProps[i] = new Properties();
      // FortifyIssueSuppression Unreleased Resource: Streams
      // This is a build tool.
      originalProps[i].load(new FileReader(propFile));
      numProps[i] = originalProps[i].size();
    }

    // Now that they're all loaded we create a new Properties object that will contain props whose keys end in
    // HTML
    for (int i = 0; i < numPropsFiles; i++) {
      // create a copy of the original properties so the values will still be available when we need them to
      // create the html file
      Properties scanning = new Properties();
      scanning.putAll(originalProps[i]);
      TreeSet<String> htmlPropKeys = new TreeSet<String>();
      Set<String> propNames = scanning.stringPropertyNames();
      for (String key: propNames) {
        if (key.endsWith("HTML") || key.contains(".helpTopics")) {
          String value = scanning.getProperty(key);
          scanning.remove(key, value);
          htmlPropKeys.add(key);
        }
      }
      // Now write out the original properties with the helpDetailsHTML entries removed, and then write out
      // a new html file with the helpDetailsHTML entries formatted as html elements.
      // FortifyIssueSuppression Path Manipulation
      // This is a build tool.
      File origProps = new File(propsToConvert[i]);
      // Create the reduced/new file in the same directory as the original and the name prefixed with NON_HTML_PREFIX
      // FortifyIssueSuppression Path Manipulation
      // This is a build tool.
      File newProps = new File(origProps.getParent(), NON_HTML_PREFIX + origProps.getName());
      // FortifyIssueSuppression Unreleased Resource: Streams
      // This is a build tool.
      OutputStream out = new FileOutputStream(newProps);
      PropertiesSorter.store(scanning,out,origProps.getName() + " with html entries removed.");
      System.out.println("Created " + newProps.getCanonicalPath());

      // Now the html file
      String htmlName = origProps.getName().replace(".properties", ".html");
      // FortifyIssueSuppression Path Manipulation
      // This is a build tool.
      File htmlFile = new File(origProps.getParent(), htmlName);
      PrintStream htmlOut = new PrintStream(new FileOutputStream(htmlFile), true);
      writeHtmlHeader(origProps.getName(), htmlOut);
      // Now write one entry for each key in htmlPropKeys
      for (String key : htmlPropKeys) {
        String value = originalProps[i].getProperty(key);
        writeElement(key, value, htmlOut);
      }
      // finish it off
      htmlOut.println("</body>");
      htmlOut.println("</html>");
      htmlOut.close();
    }
  }

  private void writeElement(String key, String value, PrintStream htmlOut) {
    // ex: <div id="JDBCDataSourceRuntimeMBean.monitoring.link.label.instance.JDBC\ Datasource">JDBC Datasource</div>
    htmlOut.println("<div id=\"" + key + "\">" + value + "</div>");
  }

  private void writeHtmlHeader(String origName, PrintStream htmlOut) {
    htmlOut.println("<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\" \"http://www.w3.org/TR/html4/loose.dtd\">");
    htmlOut.println("<html>");
    htmlOut.println("<head>");
    htmlOut.println("<!-- html entries from " + origName + " -->");
    htmlOut.println("</head>");
    htmlOut.println("<body>");
  }


}
