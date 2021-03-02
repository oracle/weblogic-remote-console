// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package com.oracle.weblogic.console.backend.server;

import java.util.HashSet;
import java.util.Set;
import javax.enterprise.context.ApplicationScoped;
import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;

import com.oracle.weblogic.console.backend.services.ConsoleResource;
import com.oracle.weblogic.console.backend.services.ServiceExceptionMapper;
import org.glassfish.jersey.media.multipart.MultiPartFeature;
import weblogic.console.backend.MessagesExceptionMapper;
import weblogic.console.backend.filter.ConnectionFilter;
import weblogic.console.backend.filter.CorsFilter;

/** */
@ApplicationScoped
@ApplicationPath("/")
public class ConsoleBackendApplication extends Application {

  @Override
  public Set<Class<?>> getClasses() {
    Set<Class<?>> ret = new HashSet<>();
    ret.add(ServiceExceptionMapper.class);
    ret.add(CorsFilter.class);
    ret.add(ConnectionFilter.class);
    ret.add(MessagesExceptionMapper.class);
    ret.add(ConsoleResource.class);
    ret.add(MultiPartFeature.class);
    return ret;
  }
}
