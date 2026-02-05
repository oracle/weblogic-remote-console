// Copyright (c) 2025, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server;

import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintStream;

public final class StdoutRedirector {
  private static RedirectOutputStream redirector;

  public static void init() {
    redirector = new RedirectOutputStream(System.out);
    System.setOut(new PrintStream(redirector));
    System.setErr(System.out);
  }

  public static void println(String s) {
    if (redirector != null) {
      redirector.rawWrite(s + '\n');
    } else {
      System.out.println(s);
    }
  }

  private static class RedirectOutputStream extends OutputStream {
    private PrintStream stdout;
    private boolean previousCharNewLine = true;

    private RedirectOutputStream(PrintStream stdout) {
      this.stdout = stdout;
    }

    @Override
    public synchronized void write(int b) throws IOException {
      if (previousCharNewLine) {
        stdout.print("BACKEND OUTPUT: ");
      }
      previousCharNewLine = ('\n' == (char) b);
      stdout.print((char) b);
    }

    public synchronized void rawWrite(String s) {
      stdout.print(s);
    }
  }
}
