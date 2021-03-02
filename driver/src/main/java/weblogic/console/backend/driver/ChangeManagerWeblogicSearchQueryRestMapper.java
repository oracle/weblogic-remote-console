// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.util.logging.Logger;
import javax.json.JsonObject;

/** Creates change manager related WebLogic REST search queries. */
public class ChangeManagerWeblogicSearchQueryRestMapper extends BaseRestMapper {

  private static final Logger LOGGER =
    Logger.getLogger(ChangeManagerWeblogicSearchQueryRestMapper.class.getName());

  public static JsonObject createChangeManagerQuery(
    InvocationContext invocationContext
  ) throws Exception {
    LOGGER.finest("creatChangeManagerQuery");
    WeblogicObjectQueryBuilder queryBldr = new WeblogicObjectQueryBuilder();
    queryBldr.addConfigInfoToQuery();
    JsonObject query = queryBldr.getBuilder().build();
    LOGGER.finest("createChangeManagerQuery query=" + query);
    return query;
  }

  public static JsonObject createChangesQuery(
    InvocationContext invocationContext
  ) throws Exception {
    LOGGER.finest("createChangesQuery");
    WeblogicObjectQueryBuilder queryBldr = new WeblogicObjectQueryBuilder();
    queryBldr.addConfigInfoToQuery();
    queryBldr.getOrCreateChild("consoleChangeManager").getOrCreateChild("changes").allFields();
    JsonObject query = queryBldr.getBuilder().build();
    LOGGER.finest("createChangesQuery query=" + query);
    return query;
  }

  private ChangeManagerWeblogicSearchQueryRestMapper(InvocationContext invocationContext) {
    super(invocationContext);
  }
}
