// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package com.oracle.weblogic.console.backend.services;

import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.ws.rs.core.Response;

import weblogic.console.backend.connection.Connection;
import weblogic.console.backend.driver.InvocationContext;
import weblogic.console.backend.driver.PageRestMapping;
import weblogic.console.backend.driver.PageWeblogicSearchQueryRestMapper;
import weblogic.console.backend.pagedesc.Localizer;
import weblogic.console.backend.pagedesc.PagePath;
import weblogic.console.backend.pagedesc.PagesPath;
import weblogic.console.backend.typedesc.WeblogicBeanIdentity;
import weblogic.console.backend.typedesc.WeblogicBeanType;
import weblogic.console.backend.typedesc.WeblogicBeanTypes;
import weblogic.console.backend.utils.Path;
import weblogic.console.backend.utils.StringUtils;

/**
 * This class contains code that is shared by the classes that do the real work behind the JAXRS
 * resources for the configuration, monitoring and control pages.
 */
public abstract class BaseTreeManager /* extends TreeManager */ {

  private static final Logger LOGGER = Logger.getLogger(BaseTreeManager.class.getName());

  private InvocationContext invocationContext;

  protected InvocationContext getInvocationContext() {
    return this.invocationContext;
  }

  /** Constructor */
  protected BaseTreeManager(InvocationContext invocationContext) {
    this.invocationContext = invocationContext;
  }

  /** Returns the RDJ for the root bean or a collection child bean */
  protected Response viewBean(String slice) throws Exception {
    try {
      // FortifyIssueSuppression Log Forging
      // Value is scrubbed, so is not an issue
      LOGGER.fine("viewBean invocationContext="
        + getInvocationContext()
        + " slice=" + StringUtils.cleanStringForLogging(slice));
      return Response.ok(createRDJ(newBeanSlicePagePath(slice))).build();
    } catch (Throwable t) {
      throw toServiceException(t);
    }
  }

  /** Returns the RDJ for an optional singleton bean */
  protected Response viewOptionalSingleton(String slice) throws Exception {
    try {
      // FortifyIssueSuppression Log Forging
      // Value is scrubbed, so is not an issue
      LOGGER.fine(
        "viewOptionalSingleton invocationContext="
        + getInvocationContext()
        + " slice=" + StringUtils.cleanStringForLogging(slice)
      );
      return Response.ok(createRDJ(newBeanSlicePagePath(slice))).build();
    } catch (Throwable t) {
      throw toServiceException(t);
    }
  }

  /** Returns the RDJ for a collection of beans */
  public Response viewCollection() throws Exception {
    try {
      LOGGER.fine("viewCollection invocationContext=" + getInvocationContext());
      return Response.ok(createRDJ(newTablePagePath())).build();
    } catch (Throwable t) {
      throw toServiceException(t);
    }
  }

  /**
   * Create the RDJ for a collection or a bean slice from the WLS search query results.
   * <p>
   * Abstract since the configuration pages need to do this a different way than the monitoring pages.
   */
  protected abstract JsonObject createRDJ(
    PageRestMapping pageRestMapping,
    JsonObject weblogicSearchResponse
  ) throws Exception;

  /**
   * Gets a RDJ for a collecton of beans or for a single bean
   * <p>
   * The RDJ's "data" element will be an empty json object if the bean could not be found.
   */
  protected JsonObject createRDJ(PagePath pagePath) throws Exception {
    PageRestMapping pageRestMapping = getPageRestMapping(pagePath);
    JsonObject weblogicRestSearchQuery =
      PageWeblogicSearchQueryRestMapper.createPageQuery(
        pageRestMapping,
        getInvocationContext()
      );
    JsonObject weblogicSearchResponse = getBeanTreeSlice(weblogicRestSearchQuery);
    return newResponseBody(createRDJ(pageRestMapping, weblogicSearchResponse));
  }

  /** We're managing a bean (v.s. a collection). Create the page path for the bean's slice */
  protected PagePath newBeanSlicePagePath(String slice) throws Exception {
    Path slicePath = (slice != null) ? new Path(slice) : new Path();
    return PagePath.newSlicePagePath(newPagesPath(getBeanType()), slicePath);
  }

  /** We're managing a collection (v.s. a bean). Create a page path for the collection's table */
  protected PagePath newTablePagePath() throws Exception {
    return PagePath.newTablePagePath(newPagesPath(getIdentity().getBeanType()));
  }

  /**
   * We're managing a bean (v.s. a collection). Get the bean's actual type.
   * <p>
   * If the bean's type is heterogeneous, return the type of this bean instance.
   */
  private WeblogicBeanType getBeanType() throws Exception {
    WeblogicBeanType type = getIdentity().getBeanType();
    if (type.isHomogeneous()) {
      return type;
    } else {
      return getIdentity().getBeanType().getSubType(getSubTypeDiscriminator());
    }
  }

  /**
   * We're managing a bean (v.s. a collection) and the bean's type is heterogeneous.
   * <p>
   * Get the property on this bean that indicates its type from WLS
   */
  private String getSubTypeDiscriminator() throws Exception {
    PagesPath baseTypePagesPath = newPagesPath(getIdentity().getBeanType());
    PagePath baseTypeDefaultSlicePagePath =
      PagePath.newSlicePagePath(baseTypePagesPath, new Path());
    PageRestMapping baseTypeDefaultSliceRestMapping =
      getPageRestMapping(baseTypeDefaultSlicePagePath);
    JsonObject weblogicRestSearchQuery =
      PageWeblogicSearchQueryRestMapper.createSubTypeDiscriminatorQuery(
        baseTypeDefaultSliceRestMapping,
        getInvocationContext()
      );
    JsonObject weblogicSearchResponse = getBeanTreeSlice(weblogicRestSearchQuery);
    return
      getSubTypeDiscriminatorFromSearchResponse(
        baseTypeDefaultSliceRestMapping,
        weblogicSearchResponse
      );
  }

  /** Get the page rest mapping for a page of this bean or collection */
  protected PageRestMapping getPageRestMapping(PagePath pagePath) throws Exception {
    return
      getInvocationContext()
        .getVersionedWeblogicPages()
        .getPageRestMappings()
        .getPageRestMapping(pagePath, getIdentity().getFoldedBeanPathWithoutIdentities());
  }

  /** Create a new PagesPath for a bean type in this perspective */
  protected PagesPath newPagesPath(WeblogicBeanType beanType) throws Exception {
    return getInvocationContext().getRootPagesPath().newPagesPath(beanType);
  }

  /**
   * Get a slice of the bean tree from WLS.
   * <p>
   * Abstract since the configuration pages need to do this a different way than
   * the monitoring and control pages.
   */
  protected abstract JsonObject getBeanTreeSlice(JsonObject weblogicRestSearchQuery) throws Exception;

  /**
   * We're managing a bean (v.s. a collection) and the bean's type is heterogeneous.
   * <p>
   * Get a bean's subtype discriminator from the WLS search query results.
   * <p>
   * Abstract since the configuration pages need to do this a different way than
   * the monitoring pages.
   */
  protected abstract String getSubTypeDiscriminatorFromSearchResponse(
    PageRestMapping baseTypeDefaultSliceRestMapping,
    JsonObject weblogicSearchResponse
  ) throws Exception;

  /**
   * Create the final response body to return to the client for an operation that returns an RDJ.
   */
  protected JsonObject newResponseBody(JsonObject rdj) {
    return addWeblogicVersionToResponseBody(rdj);
  }

  /**
   * Create the final response body to return to the client for an operation that doesn't have any
   * specific data to return.
   */
  protected JsonObject newResponseBody() {
    // same as a response with no messages
    JsonArray messages = Json.createArrayBuilder().build();
    return newResponseBody(messages);
  }

  /**
   * Create the final response body to return to the client for an operation that can return
   * messages.
   */
  protected JsonObject newResponseBody(JsonArray messages) {
    JsonObjectBuilder responseBody = Json.createObjectBuilder();
    if (!messages.isEmpty()) {
      responseBody.add("messages", messages);
    }

    // TBD - Why are we adding an empty data property to the
    // response body when creating, updating or deleting a bean?
    // Currently the CFE requires it.  Why?
    responseBody.add("data", Json.createObjectBuilder());

    return addWeblogicVersionToResponseBody(responseBody.build());
  }

  /**
   * Adds the connection's domain's weblogic version to the response body. TBD - why are we adding
   * this? Does the CFE need/use it?
   */
  protected JsonObject addWeblogicVersionToResponseBody(JsonObject responseBody) {
    return
      Json.createObjectBuilder(responseBody)
        .add("weblogicVersion", getConnection().getDomainVersion())
        .build();
  }

  /** Convenience methods */
  protected WeblogicBeanIdentity getIdentity() {
    return getInvocationContext().getIdentity();
  }

  protected WeblogicBeanTypes getWeblogicBeanTypes() {
    return getInvocationContext().getWeblogicBeanTypes();
  }

  protected Connection getConnection() {
    return getInvocationContext().getConnection();
  }

  protected Localizer getLocalizer() {
    return getInvocationContext().getLocalizer();
  }

  protected Path getFoldedBeanPathWithIdentities() {
    return getIdentity().getFoldedBeanPathWithIdentities();
  }

  protected Path getUnfoldedBeanPathWithIdentities() {
    return getIdentity().getUnfoldedBeanPathWithIdentities();
  }

  protected ServiceException toServiceException(Throwable t) {
    return ServiceException.toServiceException(t);
  }
}
