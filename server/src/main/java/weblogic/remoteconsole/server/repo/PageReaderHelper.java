// Copyright (c) 2021, 2024, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import weblogic.remoteconsole.common.repodef.BeanPropertyCustomizerDef;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.CollectionParamDef;
import weblogic.remoteconsole.common.repodef.CustomizerDef;
import weblogic.remoteconsole.common.repodef.ParamDef;
import weblogic.remoteconsole.common.utils.CustomizerInvocationUtils;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.server.repo.BeanRepo;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.InvocationContext;

/**
 * This class provides methods to help read properties and to call customizers.
 */
public class PageReaderHelper {

  private InvocationContext ic;

  public PageReaderHelper(InvocationContext ic) {
    this.ic = ic;
  }

  public Response<Value> getPropertyValue(
    BeanPropertyDef propertyDef,
    BeanSearchResults beanResults,
    BeanReaderRepoSearchResults searchResults,
    boolean includeIsSet
  ) {
    return getPropertyValue(propertyDef, getBeanTreePath(), beanResults, searchResults, includeIsSet);
  }

  public Response<Value> getPropertyValue(
    BeanPropertyDef propertyDef,
    BeanTreePath beanTreePath,
    BeanSearchResults beanResults,
    BeanReaderRepoSearchResults searchResults,
    boolean includeIsSet
  ) {
    Response<Value> response = new Response<>();
    if (propertyDef.getGetValueCustomizerDef() == null) {
      if (beanResults == null) {
        return response.setNotFound();
      }
      return response.setSuccess(beanResults.getValue(propertyDef));
    } else {
      return getCustomPropertyValue(propertyDef, beanTreePath, beanResults, searchResults, includeIsSet);
    }
  }

  private Response<Value> getCustomPropertyValue(
    BeanPropertyDef propertyDef,
    BeanTreePath beanTreePath,
    BeanSearchResults beanResults,
    BeanReaderRepoSearchResults searchResults,
    boolean includeIsSet
  ) {
    Response<Value> response = new Response<>();
    BeanPropertyCustomizerDef customizerDef = propertyDef.getGetValueCustomizerDef();
    boolean argsIncludeIsSet = true;
    Response<List<Object>> argsResponse =
      getArguments(customizerDef, beanTreePath, beanResults, searchResults, argsIncludeIsSet);
    if (!argsResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(argsResponse);
    }
    Object rtn = CustomizerInvocationUtils.invokeMethod(customizerDef.getMethod(), argsResponse.getResults());
    @SuppressWarnings("unchecked")
    Response<SettableValue> customizerResponse = (Response<SettableValue>)rtn;
    if (!customizerResponse.isSuccess()) {
      return response.copyUnsuccessfulResponse(customizerResponse);
    }
    SettableValue settableValue = customizerResponse.getResults();
    return response.setSuccess(getValue(settableValue, includeIsSet));
  }

  public Response<List<Object>> getArguments(
    CustomizerDef customizerDef,
    BeanSearchResults beanResults,
    BeanReaderRepoSearchResults searchResults,
    boolean includeIsSet
  ) {
    return getArguments(customizerDef, getBeanTreePath(), beanResults, searchResults, includeIsSet);
  }

  public Response<List<Object>> getArguments(
    CustomizerDef customizerDef,
    BeanTreePath beanTreePath,
    BeanSearchResults beanResults,
    BeanReaderRepoSearchResults searchResults,
    boolean includeIsSet
  ) {
    Response<List<Object>> response = new Response<>();
    BeanTreePath btp = (beanResults != null) ? beanResults.getBeanTreePath() : beanTreePath;
    List<Object> args = new ArrayList<>();
    for (ParamDef paramDef : customizerDef.getParamDefs()) {
      Response<Object> argResponse = getArgument(paramDef, btp, beanResults, searchResults, includeIsSet);
      if (!argResponse.isSuccess()) {
        return response.copyUnsuccessfulResponse(argResponse);
      }
      args.add(argResponse.getResults());
    }
    return response.setSuccess(args);
  }

  private Response<Object> getArgument(
    ParamDef paramDef,
    BeanTreePath beanTreePath,
    BeanSearchResults beanResults,
    BeanReaderRepoSearchResults searchResults,
    boolean includeIsSet
  ) {
    Response<Object> response = new Response<>();
    if (paramDef.isInvocationContext()) {
      InvocationContext beanIc = new InvocationContext(getInvocationContext());
      beanIc.setIdentity(beanTreePath);
      return response.setSuccess(beanIc);
    } else if (paramDef.isProperty()) {
      if (beanResults == null) {
        return response.setNotFound();
      }
      return
        response.setSuccess(
          argumentValue(beanResults.getValue(paramDef.asProperty().getPropertyDef()), includeIsSet)
        );
    } else if (paramDef.isCollection()) {
      return
        response.setSuccess(
          getCollectionArgument(paramDef.asCollection(), beanResults, searchResults, includeIsSet)
        );
    } else {
      throw new AssertionError("Unsupported parameter " + paramDef);
    }
  }

  private Object getCollectionArgument(
    CollectionParamDef paramDef,
    BeanSearchResults beanResults,
    BeanReaderRepoSearchResults searchResults,
    boolean includeIsSet
  ) {
    Path collectionPath = getCollectionPath(paramDef, beanResults);
    List<BeanSearchResults> collectionResults =
      searchResults.getCollection(BeanTreePath.create(getBeanRepo(), collectionPath));
    if (collectionResults == null) {
      return null; // the collection is not present in the search results
    }
    List<Map<String,Object>> collection = new ArrayList<>();
    for (BeanSearchResults collectionChildResults : collectionResults) {
      Map<String,Object> collectionChild = new HashMap<>();
      for (BeanPropertyDef propertyDef : paramDef.getPropertyDefs()) {
        collectionChild.put(
          propertyDef.getPropertyPath().getDotSeparatedPath(),
          argumentValue(collectionChildResults.getValue(propertyDef), includeIsSet)
        );
      }
      collection.add(collectionChild);
    }
    return collection;
  }

  private Path getCollectionPath(CollectionParamDef paramDef, BeanSearchResults beanResults) {
    Path collectionPath = paramDef.getCollectionPath();
    if (!collectionPath.isEmpty()) {
      return collectionPath;
    }
    // The collection path on the customizer is relative to the bean being invoked.
    // Get the bean's identity from the bean's search results
    // and use it to construct the collection's full path.
    if (beanResults == null) {
      // This is probably because an options customizer on a property on a create form
      // has used a bean relative @Source annotation.  This is not supported.
      throw new AssertionError("Null beanResults");
    }
    BeanPropertyDef propertyDef = paramDef.getCustomizerDef().asProperty().getPropertyDef();
    BeanPropertyDef identityDef = propertyDef.getTypeDef().getIdentityPropertyDef();
    BeanTreePath parentBeanPath =
      Value.unsettableValue(beanResults.getValue(identityDef)).asBeanTreePath();
    return parentBeanPath.getPath().childPath(paramDef.getCollectionDef().getChildPath());
  }

  private Value getValue(SettableValue settableValue, boolean includeIsSet) {
    if (includeIsSet || settableValue == null) {
      return settableValue;
    }
    return settableValue.getValue();
  }

  private Value argumentValue(Value value, boolean includeIsSet) {
    return (includeIsSet) ? Value.settableValue(value) : Value.unsettableValue(value);
  }

  public void addParamsToSearch(
    BeanReaderRepoSearchBuilder builder,
    BeanTreePath beanTreePath,
    CustomizerDef customizerDef
  ) {
    if (customizerDef == null) {
      return;
    }
    for (ParamDef paramDef : customizerDef.getParamDefs()) {
      addParamToSearch(builder, beanTreePath, paramDef);
    }
  }

  private void addParamToSearch(
    BeanReaderRepoSearchBuilder builder,
    BeanTreePath beanTreePath,
    ParamDef paramDef
  ) {
    if (paramDef.isInvocationContext()) {
      // We don't need to fetch anything from the bean repo since
      // this parameter passes the invocation context to the customizer method.
    } else if (paramDef.isProperty()) {
      builder.addProperty(beanTreePath, paramDef.asProperty().getPropertyDef());
    } else if (paramDef.isCollection()) {
      CollectionParamDef collParamDef = paramDef.asCollection();
      BeanTreePath collBeanTreePath = getCollectionBeanTreePath(beanTreePath, collParamDef);
      for (BeanPropertyDef propertyDef : collParamDef.getPropertyDefs()) {
        builder.addProperty(collBeanTreePath, propertyDef);
      }
    } else {
      throw new AssertionError("Unsupported customizer parameter: " + paramDef);
    }
  }

  private BeanTreePath getCollectionBeanTreePath(
    BeanTreePath beanTreePath,
    CollectionParamDef paramDef
  ) {
    Path collectionPath = paramDef.getCollectionPath();
    if (collectionPath.isEmpty()) {
      // The collection is relative to the bean being invoked.
      return beanTreePath.childPath(paramDef.getCollectionDef().getChildPath());
    } else {
      // The parameter specified the absolute path of a top level collection.
      return BeanTreePath.create(getBeanRepo(), collectionPath);
    }
  }

  private BeanRepo getBeanRepo() {
    return getInvocationContext().getPageRepo().getBeanRepo();
  }

  private BeanTreePath getBeanTreePath() {
    return getInvocationContext().getBeanTreePath();
  }

  private InvocationContext getInvocationContext() {
    return ic;
  }
}
