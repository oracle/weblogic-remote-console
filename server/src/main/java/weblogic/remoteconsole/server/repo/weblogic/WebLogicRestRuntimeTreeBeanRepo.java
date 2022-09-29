// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import java.util.Map;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;

import weblogic.remoteconsole.common.repodef.weblogic.WebLogicRuntimeTreeBeanRepoDef;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.WebLogicMBeansVersion;
import weblogic.remoteconsole.server.repo.BeanEditorRepo;
import weblogic.remoteconsole.server.repo.BeanPropertyValue;
import weblogic.remoteconsole.server.repo.BeanPropertyValues;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;

/**
 * This class uses the WLS REST api to view and invoke operations on
 * the beans in the domain runtime and server config trees.
 * 
 * It also supports editing the security data beans in the server config tree
 * (e.g. for the DefaultAuthenticator's users and groups)
 */
public class WebLogicRestRuntimeTreeBeanRepo extends WebLogicRestBeanRepo implements BeanEditorRepo {
  private static final String SERVER_CONFIG = "serverConfig";
  private static final Path SERVER_CONFIG_PATH = new Path(SERVER_CONFIG);
  private static final boolean EXPANDED_VALUES_FALSE = false; // the runtime tree doesn't support expanded values
  private static final boolean SAVE_CHANGES_FALSE = false; // the runtime tree doesn't support config transactions
  private static final boolean ASYNC_FALSE = false;

  public WebLogicRestRuntimeTreeBeanRepo(WebLogicMBeansVersion mbeansVersion) {
    super(
      mbeansVersion.findOrCreate(WebLogicRuntimeTreeBeanRepoDef.class),
      Map.of(
        "DomainRuntime", "domainRuntime",
        "Domain", SERVER_CONFIG
      )
    );
  }

  @Override
  public Response<Void> updateBean(InvocationContext ic, BeanPropertyValues propertyValues) {
    Response<Void> response = new Response<>();
    Response<JsonObject> postResponse =
      WebLogicRestInvoker.post(
        ic,
        SERVER_CONFIG_PATH.childPath(getTreeRelativeRestPath(propertyValues.getBeanTreePath())),
        propertyValuesToJson(propertyValues),
        EXPANDED_VALUES_FALSE,
        SAVE_CHANGES_FALSE,
        ASYNC_FALSE
      );
    convertRestMessagesToRepoMessages(postResponse, response);
    return response.copyStatus(postResponse);
  }

  @Override
  public Response<Void> createBean(InvocationContext ic, BeanPropertyValues propertyValues) {
    Response<Void> response = new Response<>();
    BeanTreePath beanTreePath = propertyValues.getBeanTreePath();
    Response<JsonObject> postResponse =
      WebLogicRestInvoker.post(
        ic,
        SERVER_CONFIG_PATH.childPath(getTreeRelativeRestPath(beanTreePath)),
        propertyValuesToJson(propertyValues),
        EXPANDED_VALUES_FALSE,
        SAVE_CHANGES_FALSE,
        beanTreePath.isAsyncCreate()
      );
    convertRestMessagesToRepoMessages(postResponse, response);
    return response.copyStatus(postResponse);
  }

  @Override
  public Response<Void> deleteBean(InvocationContext ic, BeanTreePath beanTreePath) {
    Response<Void> response = new Response<>();
    Response<JsonObject> deleteResponse =
      WebLogicRestInvoker.delete(
        ic,
        SERVER_CONFIG_PATH.childPath(getTreeRelativeRestPath(beanTreePath)),
        SAVE_CHANGES_FALSE,
        beanTreePath.isAsyncDelete()
      );
    if (!deleteResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(deleteResponse);
    }
    return response;
  }

  private JsonObject propertyValuesToJson(BeanPropertyValues propertyValues) {
    JsonObjectBuilder builder = Json.createObjectBuilder();
    for (BeanPropertyValue propertyValue : propertyValues.getPropertyValues()) {
      builder.add(
        propertyValue.getPropertyDef().getOnlinePropertyName(),
        toJson(propertyValue.getValue().getValue()) // propertyValue.getValue is a SettableValue.  Unwrap it.
      );
    }
    return builder.build();
  }
}
