// Copyright (c) 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.webapp;

import javax.json.JsonObject;

import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.SimpleSearchCriteria;

/**
 * Converts a JAXRS Request body to a SimpleSearchCriteria
 */
public class SimpleSearchRequestBodyMapper extends RequestBodyMapper<SimpleSearchCriteria> {

  public static Response<SimpleSearchCriteria> fromRequestBody(
    InvocationContext ic,
    JsonObject requestBody
  ) {
    return (new SimpleSearchRequestBodyMapper(ic, requestBody)).fromRequestBody();
  }

  private SimpleSearchRequestBodyMapper(InvocationContext ic, JsonObject requestBody) {
    super(ic, requestBody, null);
  }

  @Override
  protected void parseRequestBody() {
    String contains = getRequiredString(getRequestBody(), "contains");
    if (!isOK()) {
      return;
    }
    contains = contains.trim();
    if (StringUtils.isEmpty(contains)) {
      badFormat(
        getInvocationContext().getLocalizer().localizeString(
          LocalizedConstants.EMPTY_SIMPLE_SEARCH_STRING
        )
      );
    }
    if (!isOK()) {
      return;
    }
    SimpleSearchCriteria criteria = new SimpleSearchCriteria();
    criteria.setContains(contains);
    getResponse().setSuccess(criteria);
  }
}
