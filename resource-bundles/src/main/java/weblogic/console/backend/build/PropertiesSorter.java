// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.build;

import java.io.BufferedWriter;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.util.Properties;
import java.util.Set;
import java.util.TreeSet;

public class PropertiesSorter {

  // Code adapted from java.util.Properties to write out sorted properties

  /*
   * Writes out the given properties along with a comment to a file
   * @param   out      an output stream.
   * @param   comments   a description of the property list.
   * @exception  IOException if writing this property list to the specified
   *             output stream throws an {@code IOException}.
   * @exception  ClassCastException  if this {@code Properties} object
   *             contains any keys or values that are not {@code Strings}.
   * @exception  NullPointerException  if {@code out} is null.
   */
  public static void store(Properties props, OutputStream out, String comments) throws IOException {
    Set<String> unsortedKeys = props.stringPropertyNames();
    TreeSet<String> sortedKeys = new TreeSet<>();
    sortedKeys.addAll(unsortedKeys);

    BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(out, "8859_1"));
    if (comments != null) {
      // We don't need special locale-based handling as in Properties code-just simple strings here
      bw.write("#");
      bw.write(comments);
      bw.newLine();
    }
    // We don't want the date in our files to be translated.  It creates unnecessary diffs
    // bw.write("#" + new Date().toString());
    // bw.newLine();
    for (String key : sortedKeys) {
      String val = props.getProperty(key);
      key = saveConvert(key, true, true);
      /* No need to escape embedded and trailing spaces for value, hence
       * pass false to flag.
       */
      val = saveConvert(val, false, true);
      bw.write(key + "=" + val);
      bw.newLine();
    }

    bw.flush();
  }

  /*
   * Converts unicodes to encoded &#92;uxxxx and escapes
   * special characters with a preceding slash
   */
  private static String saveConvert(String theString,
                             boolean escapeSpace,
                             boolean escapeUnicode) {
    int len = theString.length();
    int bufLen = len * 2;
    if (bufLen < 0) {
      bufLen = Integer.MAX_VALUE;
    }
    StringBuilder outBuffer = new StringBuilder(bufLen);

    for (int x = 0; x < len; x++) {
      char theChar = theString.charAt(x);
      // Handle common case first, selecting largest block that
      // avoids the specials below
      if ((theChar > 61) && (theChar < 127)) {
        if (theChar == '\\') {
          outBuffer.append('\\');
          outBuffer.append('\\');
          continue;
        }
        outBuffer.append(theChar);
        continue;
      }
      switch (theChar) {
        case ' ':
          if (x == 0 || escapeSpace) {
            outBuffer.append('\\');
          }
          outBuffer.append(' ');
          break;
        case '\t':
          outBuffer.append('\\');
          outBuffer.append('t');
          break;
        case '\n':
          outBuffer.append('\\');
          outBuffer.append('n');
          break;
        case '\r':
          outBuffer.append('\\');
          outBuffer.append('r');
          break;
        case '\f':
          outBuffer.append('\\');
          outBuffer.append('f');
          break;
        case '=': // Fall through
        case ':': // Fall through
        case '#': // Fall through
        case '!':
          outBuffer.append('\\');
          outBuffer.append(theChar);
          break;
        default:
          if (((theChar < 0x0020) || (theChar > 0x007e)) & escapeUnicode) {
            outBuffer.append('\\');
            outBuffer.append('u');
            outBuffer.append(toHex((theChar >> 12) & 0xF));
            outBuffer.append(toHex((theChar >>  8) & 0xF));
            outBuffer.append(toHex((theChar >>  4) & 0xF));
            outBuffer.append(toHex(theChar        & 0xF));
          } else {
            outBuffer.append(theChar);
          }
      }
    }
    return outBuffer.toString();
  }

  /**
   * Convert a nibble to a hex character
   * @param   nibble  the nibble to convert.
   */
  private static char toHex(int nibble) {
    return hexDigit[(nibble & 0xF)];
  }

  /** A table of hex digits */
  private static final char[] hexDigit = {
    '0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'
  };
}
