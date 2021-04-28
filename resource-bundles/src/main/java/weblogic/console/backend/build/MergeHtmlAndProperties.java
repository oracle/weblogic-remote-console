// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.build;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.util.Properties;

import static weblogic.console.backend.build.PropertiesToHtml.NON_HTML_PREFIX;

// FortifyIssueSuppression Whole File
// This is a build tool that is not even shipped outside Oracle.
// The issues that Fortify is finding are irrelevant

/**
 * This tool takes a list of properties files and corresponding html files.  For each properties file,
 * we load it into a SortedProperties object.  Then we read the corresponding html file one line at
 * a time. If the line starts with "<div id=" then we parse it as follows:
 *   <div id="prop">val</div>
 * Note that val may span multiple lines, so we have to continue reading lines until we find one that ends
 * with </div>
 * For each such line we create a property, with Name="prop" and Value="val" and add it to the
 * Properties object.
 * After doing this for each property, we write out a new sorted properties file from the Properties
 * object, thus giving us a file of the merged properties from the html file and its companion
 * html file
 */
public class MergeHtmlAndProperties {
  private static boolean debug = "true".equals(System.getProperty("debug"));
  //  The directory to put the merged propeties files in
  private static final File MERGED_DIR = new File("merged");

  static {
    if (!MERGED_DIR.exists()) {
      MERGED_DIR.mkdir();
    }
  }

  public static void main(String... args) throws Exception {
    new MergeHtmlAndProperties(args);
  }

  public MergeHtmlAndProperties(String... htmlAndPropsToMerge) throws Exception {
    int numFiles = htmlAndPropsToMerge.length / 2;
    // There are pairs are files, [html-1,props-1,html-2, props-2,...]

    for (int i = 0; i < numFiles; i++) {
      // merge the next pair of html and property files
      String htmlFileName = htmlAndPropsToMerge[2 * i];
      String propFileName = htmlAndPropsToMerge[2 * i + 1];
      mergeFiles(htmlFileName, propFileName);
    }
  }

  public void mergeFiles(String htmlFileName, String propFileName) throws Exception {
    File htmlFile = new File(htmlFileName);
    File propFile = new File(propFileName);
    String htmlFname = htmlFile.getName();
    String propFname = propFile.getName();
    // load the properties file first
    Properties props = new Properties();
    if (debug) {
      System.out.println("Loading file " + propFile.getCanonicalPath());
    }
    props.load(new FileInputStream(propFile));
    // parse the html file, convert each entry to a property, and add them to props from the properties file
    if (debug) {
      System.out.println("Parsing file " + propFile.getCanonicalPath());
    }
    parseHtmlFile(htmlFile, props);
    // create a new file with the merged properties in the MERGED_DIR
    String mergedPropsFileName = propFname.replaceAll(NON_HTML_PREFIX, "");
    File mergedFile = new File(MERGED_DIR, mergedPropsFileName);
    OutputStream outputStream = new FileOutputStream(mergedFile);
    if (debug) {
      System.out.println("Writing out sorted properties file " + mergedFile.getCanonicalPath());
    }
    PropertiesSorter.store(props, outputStream, "Merged properties from " + htmlFname
      + " and " + propFname);
    if (debug) {
      System.out.println("Completed writing out sorted properties file " + mergedFile.getCanonicalPath());
    }
  }

  private void parseHtmlFile(File htmlFile, Properties props) throws Exception {
    // The html files are UTF-8, so make sure we read them that way otherwise the encoding defaults
    // to the locale of whatever machine this program runs on.  In the case of Jenkins nodes, that may be POSIX
    // which results in \uFFFD ending up in place of all non US-ASCII characters
    BufferedReader in = new BufferedReader(new InputStreamReader(new FileInputStream(htmlFile), "UTF-8"));
    skipHtmlHeaders(in);
    while (addProperty(props, in)) {
    }
  }

  private void skipHtmlHeaders(BufferedReader in) throws IOException {
    String line = "";
    while (!line.equals("<body>")) {
      line = in.readLine();
    }
  }

  private boolean addProperty(Properties props, BufferedReader in) throws Exception {
    boolean result;
    // get <div id="propName"...
    String input = in.readLine();
    if (input.startsWith("<div id=")) {
      // get the property name and the start of the value
      int idEnd = input.indexOf(">");
      String propName = input.substring(9, idEnd - 1);
      String value = "";
      if (input.endsWith("</div>")) {
        // the value is on this line
        value = input.substring(idEnd + 1, input.indexOf("</div>"));
      } else {
        value = input.substring(idEnd + 1, input.length());
        // get the rest of the value on subsequent lines
        boolean atEndOfValue = false;
        while (!atEndOfValue) {
          String nextLine = in.readLine();
          if (nextLine.endsWith("</div>")) {
            value += "\n" + nextLine.substring(0, nextLine.indexOf("</div>"));
            atEndOfValue = true;
          } else {
            value += "\n" + nextLine;
          }
        }
      }
      props.setProperty(propName, value);
      return true;
    } else if (input.startsWith("</body>")) {
      return false;
    } else {
      throw new Exception("Stopping unexpectedly with input =" + input);
    }
  }

}
