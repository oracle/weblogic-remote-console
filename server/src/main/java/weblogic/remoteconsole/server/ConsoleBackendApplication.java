// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server;

import java.util.HashSet;
import java.util.Set;
import javax.enterprise.context.ApplicationScoped;
import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;

import org.glassfish.jersey.media.multipart.MultiPartFeature;
import weblogic.remoteconsole.server.filter.CorsFilter;
import weblogic.remoteconsole.server.filter.SessionFilter;
import weblogic.remoteconsole.server.webapp.IndexHTML;
import weblogic.remoteconsole.server.webapp.RemoteConsoleResource;
import weblogic.remoteconsole.server.webapp.RootHTML;

/** */
@ApplicationScoped
@ApplicationPath("/")
public class ConsoleBackendApplication extends Application {

  @Override
  public Set<Class<?>> getClasses() {
    Set<Class<?>> ret = new HashSet<>();
    ret.add(CorsFilter.class);
    ret.add(SessionFilter.class);
    ret.add(IndexHTML.class); // handles http://localhost:8012/index.html
    ret.add(RootHTML.class);  // handles http://localhost:8012
    ret.add(RemoteConsoleResource.class);
    ret.add(MultiPartFeature.class);
    return ret;
  }
}
