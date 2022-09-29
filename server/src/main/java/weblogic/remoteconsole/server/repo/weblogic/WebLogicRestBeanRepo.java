// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonValue;

import weblogic.remoteconsole.common.repodef.BeanActionDef;
import weblogic.remoteconsole.common.repodef.BeanActionParamDef;
import weblogic.remoteconsole.common.repodef.BeanChildDef;
import weblogic.remoteconsole.common.repodef.BeanRepoDef;
import weblogic.remoteconsole.common.utils.Message;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.server.repo.BeanActionArg;
import weblogic.remoteconsole.server.repo.BeanReaderRepo;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchBuilder;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.BeanTreePathSegment;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.Value;

/**
 * Base bean repo implementation for WebLogic REST-based bean repos.
 */
public abstract class WebLogicRestBeanRepo extends WebLogicBeanRepo implements BeanReaderRepo {
  private static final Logger LOGGER = Logger.getLogger(WebLogicRestBeanRepo.class.getName());
  private Map<String,String> rootBeanNameToWebLogicRestTreeNameMap;

  protected WebLogicRestBeanRepo(BeanRepoDef beanRepoDef, Map<String,String> rootBeanNameToWebLogicRestTreeNameMap) {
    super(beanRepoDef);
    this.rootBeanNameToWebLogicRestTreeNameMap = rootBeanNameToWebLogicRestTreeNameMap;
  }

  protected Map<String,String> getRootBeanNameToWebLogicRestTreeNameMap() {
    return this.rootBeanNameToWebLogicRestTreeNameMap;
  }

  Set<String> getRootBeanNames() {
    return getRootBeanNameToWebLogicRestTreeNameMap().keySet();
  }

  String getRootBeanName(BeanTreePath beanTreePath) {
    return beanTreePath.getSegments().get(0).getChildDef().getChildName();
  }

  void verifySupportsBean(BeanTreePath beanTreePath) {
    getWebLogicRestTreeName(getRootBeanName(beanTreePath));
  }

  String getWebLogicRestTreeName(String rootBeanName) {
    String rtn = getRootBeanNameToWebLogicRestTreeNameMap().get(rootBeanName);
    if (rtn == null) {
      throw
        new AssertionError(
          "Can't find WebLogic REST tree name for " + rootBeanName
          + " " + getRootBeanNameToWebLogicRestTreeNameMap()
        );
    }
    return rtn;
  }

  @Override
  public BeanReaderRepoSearchBuilder createSearchBuilder(InvocationContext invocationContext, boolean includeIsSet) {
    LOGGER.fine("createSearchBuilder " + invocationContext.getBeanTreePath());
    return new WebLogicRestBeanRepoSearchBuilder(this, invocationContext, includeIsSet);
  }

  @Override
  public Response<Value> invokeAction(
    InvocationContext ic,
    BeanTreePath beanPath,
    BeanActionDef actionDef,
    List<BeanActionArg> args
  ) {
    Response<Value> response = new Response<>();
    Response<JsonObject> reqBodyResponse = createRestActionRequestBody(actionDef, args);
    if (!reqBodyResponse.isSuccess()) {
      response.copyUnsuccessfulResponse(reqBodyResponse);
      return response;
    }
    JsonObject restRequestBody = reqBodyResponse.getResults();
    boolean async = actionDef.isAsynchronous();
    Response<JsonObject> restResponse =
      WebLogicRestInvoker.post(
        ic,
        getRestActionPath(beanPath, actionDef),
        restRequestBody,
        false, // expandedValues,
        false, // saveChanges,
        async
      );
    convertRestActionResponseToRepoResponse(beanPath, response, restResponse, actionDef, async);
    return response;
  }

  private Response<JsonObject> createRestActionRequestBody(BeanActionDef actionDef, List<BeanActionArg> args) {
    Response<JsonObject> response = new Response<>();
    List<BeanActionParamDef> paramDefs = actionDef.getParamDefs();
    JsonObjectBuilder bldr = Json.createObjectBuilder();
    boolean argsOK = true; // until proven otherwise
    if (args.size() == paramDefs.size()) {
      for (BeanActionParamDef paramDef : paramDefs) {
        if (argsOK) {
          BeanActionArg arg = findActionArg(paramDef, args);
          if (arg != null) {
            bldr.add(paramDef.getParamName(), toJson(arg.getValue()));
          } else {
            argsOK = false;
          }
        }
      }
    }
    if (argsOK) {
      response.setSuccess(bldr.build());
    } else {
      response.addFailureMessage(
        "Action args mismatch"
        + " " + actionDef
        + " expected " + paramDefs
        + " received " + args
      );
      response.setFrontEndBadRequest();
    }
    return response;
  }

  private void convertRestActionResponseToRepoResponse(
    BeanTreePath beanPath,
    Response<Value> response,
    Response<JsonObject> restResponse,
    BeanActionDef actionDef,
    boolean async
  ) {
    if (!restResponse.isSuccess()) {
      response.copyUnsuccessfulResponse(restResponse);
      return;
    }
    response.copyMessages(restResponse);
    if (async) {
      response.setSuccess(null);
    } else if (actionDef.isVoid()) {
      // Just return a null value since it's void
      response.setSuccess(null);
    } else {
      // Note: this code hasn't been tested yet because we haven't
      // needed to call any synchronous actions that return values so far.
      JsonValue restResult = restResponse.getResults().get("return");
      // WLS REST identities in the REST response are relative to the first level
      // bean in the path to the bean the action is being invoked on (e.g. /Domain or /DomainRuntime)
      BeanChildDef rootChildBean = beanPath.getSegments().get(0).getChildDef();
      WebLogicRestValueBuilder builder = new WebLogicRestValueBuilder(beanPath.getBeanRepo(), rootChildBean);
      Value repoResult = builder.buildValue(actionDef, restResult);
      response.setSuccess(repoResult);
    }
  }

  private BeanActionArg findActionArg(BeanActionParamDef paramDef, List<BeanActionArg> args) {
    for (BeanActionArg arg : args) {
      if (paramDef.getParamName().equals(arg.getParamDef().getParamName())) {
        return arg;
      }
    }
    return null;
  }

  private Path getRestActionPath(BeanTreePath beanPath, BeanActionDef actionDef) {
    // e.g. if beanPath is DomainRuntime/ServerLifeCycleRuntimes/Server1 and actionDef is start
    // then return domainRuntime/ServerLifeCycleRuntimes/Server1/start

    // e.g. convert DomainRuntime to domainRuntime and start the path with it
    String rootBeanName = beanPath.getPath().getFirstComponent();
    Path restActionPath = new Path(getWebLogicRestTreeName(rootBeanName));

    // add in the rest of the bean tree path, e.g. ServerLifeCycleRuntimes/Server1
    restActionPath.addPath(getTreeRelativeRestPath(beanPath));

    // If the action is on a mandatory singleton beneath collection child,
    // add the path from the child to the singleton
    restActionPath.addPath(actionDef.getParentPath());

    // Add the name of the action:
    restActionPath.addComponent(actionDef.getRemoteActionName());
  
    return restActionPath;
  }

  protected void convertRestMessagesToRepoMessages(Response<?> restResponse, Response<?> repoResponse) {
    for (Message restMessage : restResponse.getMessages()) {
      repoResponse.addMessage(
        new Message(
          restMessage.getSeverity(),
          StringUtils.getBeanName(restMessage.getProperty()),
          restMessage.getText()
        )
      );
    }
  }

  protected JsonValue toJson(Value value) {
    boolean arrayElement = false;
    return toJson(value, arrayElement);
  }

  private JsonValue toJson(Value value, boolean arrayElement) {
    if (value.isString()) {
      String str = value.asString().getValue();
      return (str == null) ? JsonValue.NULL : Json.createValue(str);
    }
    if (value.isSecret()) {
      String str = value.asSecret().getValue();
      return (str == null) ? JsonValue.NULL : Json.createValue(str);
    }
    if (value.isBoolean()) {
      return value.asBoolean().getValue() ? JsonValue.TRUE : JsonValue.FALSE;
    }
    if (value.isInt()) {
      return Json.createValue(value.asInt().getValue());
    }
    if (value.isLong()) {
      return Json.createValue(value.asLong().getValue());
    }
    if (value.isDouble()) {
      return Json.createValue(value.asDouble().getValue());
    }
    if (value.isNullReference()) {
      return JsonValue.NULL;
    }
    if (value.isBeanTreePath()) {
      JsonArrayBuilder builder = Json.createArrayBuilder();
      for (String component : getTreeRelativeRestPath(value.asBeanTreePath()).getComponents()) {
        builder.add(component);
      }
      if (arrayElement) {
        // reference array elements need to be wrapped in an "identity" object:
        JsonObjectBuilder itemBuilder = Json.createObjectBuilder();
        itemBuilder.add("identity", builder);
        return itemBuilder.build();
      } else {
        return builder.build();
      }
    }
    if (value.isDate()) {
      throw new AssertionError("Setting Date properties is not currently supported");
    }
    if (value.isProperties()) {
      JsonObjectBuilder builder = Json.createObjectBuilder();
      Properties properties = value.asProperties().getValue();
      for (String key : properties.stringPropertyNames()) {
        builder.add(key, properties.getProperty(key));
      }
      return builder.build();
    }
    if (value.isArray()) {
      JsonArrayBuilder builder = Json.createArrayBuilder();
      boolean arrElement = true;
      for (Value val : value.asArray().getValues()) {
        builder.add(toJson(val, arrElement));
      }
      return builder.build();
    }
    throw new AssertionError("Unsupported value : " + value);
  }

  protected Path getTreeRelativeRestPath(BeanTreePath beanTreePath) {
    Path restPath = new Path();
    boolean first = true;
    for (BeanTreePathSegment segment : beanTreePath.getSegments()) {
      if (first) {
        // ignore the first segment (i.e. Domain) since it's implied in WLS REST
        first = false;
      } else {
        // Add the WLS REST name of the containment property.
        restPath.addComponent(segment.getChildDef().getOnlineChildName());
        if (segment.isKeySet()) {
          // It's a collection child.  Add the key.
          restPath.addComponent(segment.getKey());
        }
      }
    }
    return restPath;
  }
}
