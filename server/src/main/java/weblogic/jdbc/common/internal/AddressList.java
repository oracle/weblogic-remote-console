// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.jdbc.common.internal;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class AddressList {

  private List<HostPort> hostPorts = new ArrayList<HostPort>();

  public void add(String host, int port) {
    hostPorts.add(new HostPort(host, port));
  }

  public void add(String host, int port, String protocol) {
    hostPorts.add(new HostPort(host, port, protocol));
  }

  public boolean remove(String host, int port) {
    return hostPorts.remove(new HostPort(host, port));
  }

  public boolean remove(String host, int port, String protocol) {
    return hostPorts.remove(new HostPort(host, port, protocol));
  }

  public List<HostPort> getList() {
    return hostPorts;
  }

  public String commaSeparatedList() {
    if (hostPorts.size() == 0) {
      return "";
    }

    StringBuilder sb = new StringBuilder();
    Iterator<HostPort> it = hostPorts.iterator();
    while (it.hasNext()) {
      HostPort hp = it.next();
      sb.append(hp.host + ":" + hp.port);
      if (it.hasNext()) {
        sb.append(",");
      }
    }
    return sb.toString();
  }

  public void setList(String commaSeparatedHostPortList) {
    hostPorts.clear();

    if (commaSeparatedHostPortList == null || commaSeparatedHostPortList.equals("")) {
      return;
    }
    String[] nodes = commaSeparatedHostPortList.split(",");
    if (nodes == null || nodes.length == 0) {
      return;
    }
    for (int i = 0; i < nodes.length; i++) {
      hostPorts.add(new HostPort(nodes[i].trim()));
    }
  }

  public String toString() {
    return hostPorts.toString();
  }

  public int size() {
    return hostPorts.size();
  }

  public Iterator<HostPort> iterator() {
    return hostPorts.iterator();
  }

  public void clear() {
    hostPorts.clear();
  }

  /**
   * Encapsulates a host and port tuple
   */
  public static class HostPort {
    public final String host;
    public final int port;
    public final String protocol;
    private final String id;

    public HostPort(String host, int port) {
      this.host = host;
      this.port = port;
      this.protocol = null;
      id = host + ":" + port;
    }

    public HostPort(String host, int port, String protocol) {
      this.host = host;
      this.port = port;
      this.protocol = protocol;
      id = host + ":" + port + ":" + protocol;
    }

    public HostPort(String hostColonPort) throws IllegalArgumentException {
      String[] hp = hostColonPort.split(":");
      if (hp == null || hp.length != 2) {
        //throw new IllegalArgumentException(JDBCUtil.getTextFormatter().invalidHostPort(hostColonPort));
        // FIXME jgish 10-21-2020 localize
        throw new IllegalArgumentException("Invalid host:port " + hostColonPort);
      }
      this.host = hp[0];
      this.port = Integer.parseInt(hp[1]);
      this.protocol = null;
      id = hostColonPort;
    }

    public String toString() {
      return id;
    }

    public int hashCode() {
      return id.hashCode();
    }

    public boolean equals(Object o) {
      if (!(o instanceof HostPort)) {
        return false;
      }
      return id.equals(((HostPort) o).id);
    }
  }

}
