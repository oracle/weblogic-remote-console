// Copyright (c) 2023, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.ArrayList;
import java.util.List;

import weblogic.console.utils.Path;
import weblogic.console.utils.StringUtils;
import weblogic.remoteconsole.common.repodef.CustomPagePropertyDef;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.SettableValue;
import weblogic.remoteconsole.server.repo.StringValue;

/** 
 * Custom code for processing the ServerMBean
 */
public class HostnameVerifierCustomizer {

  private static final String HNV_WILDCARD = "weblogic.security.utils.SSLWLSWildcardHostnameVerifier";
  private static final String HNV_BEA = "weblogic.security.utils.SSLWLSHostnameVerifier$DefaultHostnameVerifier";
  private static final String HNV_TYPE_WILDCARD = "Wildcard Verifier";
  private static final String HNV_TYPE_BEA = "BEA Verifier";
  private static final String HNV_TYPE_CUSTOM = "Custom Verifier";

  private HostnameVerifierCustomizer() {
  }

  public static SettableValue getHostnameVerifierType(
    SettableValue hostnameVerifier
  ) {
    boolean isSet = hostnameVerifier.isSet();
    String type = computeHostnameVerifierType(hostnameVerifier);
    return new SettableValue(new StringValue(type), isSet);
  }

  public static SettableValue getCustomHostnameVerifier(
    SettableValue hostnameVerifier
  ) {
    boolean isSet = false;
    String hnv = null;
    if (HNV_TYPE_CUSTOM.equals(computeHostnameVerifierType(hostnameVerifier))) {
      isSet = true;
      hnv = hostnameVerifier.getValue().asString().getValue();
    }
    return new SettableValue(new StringValue(hnv), isSet);
  }

  private static String computeHostnameVerifierType(SettableValue hostnameVerifier) {
    String type = null;
    if (hostnameVerifier.isSet()) {
      String hnv = hostnameVerifier.getValue().asString().getValue();
      if (HNV_WILDCARD.equals(hnv)) {
        type = HNV_TYPE_WILDCARD;
      } else if (HNV_BEA.equals(hnv)) {
        type = HNV_TYPE_BEA;
      } else if (!StringUtils.isEmpty(hnv)) {
        type = HNV_TYPE_CUSTOM;
      }
    }
    return type;
  }

  public static Response<List<FormProperty>> customizeFormProperties(
    InvocationContext ic,
    List<FormProperty> formProperties
  ) {
    Response<List<FormProperty>> response = new Response<>();
    List<FormProperty> customizedProperties = new ArrayList<>();
    FormProperty hnvTypeProperty = null;
    FormProperty customHnvProperty = null;
    for (FormProperty formProperty : formProperties) {
      String name = formProperty.getName();
      if ("HostnameVerifierType".equals(name)) {
        hnvTypeProperty = formProperty;
      } else if ("CustomHostnameVerifier".equals(name)) {
        customHnvProperty = formProperty;
      } else {
        customizedProperties.add(formProperty);
      }
    }
    if (hnvTypeProperty != null || customHnvProperty != null) {
      Response<FormProperty> hnvResponse = createHostnameVerifierFormProperty(ic, hnvTypeProperty, customHnvProperty);
      if (!hnvResponse.isSuccess()) {
        return response.copyUnsuccessfulResponse(hnvResponse);
      }
      customizedProperties.add(hnvResponse.getResults());
    }
    return response.setSuccess(customizedProperties);
  }

  private static Response<FormProperty> createHostnameVerifierFormProperty(
    InvocationContext ic,
    FormProperty hnvTypeProperty,
    FormProperty customHnvProperty
  ) {
    Response<FormProperty> response = new Response<>();
    boolean isSet = false;
    String hnv = null;
    boolean isCustom = false;
    if (hnvTypeProperty != null) {
      // The user modified the hnv type  
      SettableValue hnvType = hnvTypeProperty.getValue().asSettable();
      if (hnvType.isSet()) {
        String hnvTypeValue = hnvType.getValue().asString().getValue();
        if (hnvTypeValue == null) {
          hnv = null;
          isSet = true;
        } else if (HNV_TYPE_WILDCARD.equals(hnvTypeValue)) {
          hnv = HNV_WILDCARD;
          isSet = true;
        } else if (HNV_TYPE_BEA.equals(hnvTypeValue)) {
          hnv = HNV_BEA;
          isSet = true;
        } else if (HNV_TYPE_CUSTOM.equals(hnvTypeValue)) {
          isCustom = true;
        }
      }
    } else if (customHnvProperty != null) {
      // The user didn't modify the hnv type but modified the custom hnv.
      // Assume that the type was already custom.
      isCustom = true;
    }
    if (isCustom) {
      hnv = computeCustomHostnameVerifier(customHnvProperty);
      if (hnv == null) {
        response.addFailureMessage(
          ic.getLocalizer().localizeString(
            LocalizedConstants.CUSTOM_HOSTNAME_VERIFIER_NOT_SPECIFIED
          )
        );
        return response.setUserBadRequest();
      }
      isSet = true;
    }
    // The underlying HostnameVerifier property is
    // "SSL.HostnameVerifier" for a ServerMBean and just
    // "HostnameVerifier" for a NetworkAccessPointMBean
    String typeName = ic.getBeanTreePath().getTypeDef().getTypeName();
    String parentPath = ("ServerMBean".equals(typeName)) ? "SSL" : "";
    // Only specify what the repos need to write out the HostnameVerifier property:
    String propertyName = "HostnameVerifier";
    CustomPagePropertyDef hnvPropertyDef =
      new CustomPagePropertyDef()
        .parentPath(new Path(parentPath))
        .propertyName(propertyName)
        .onlinePropertyName(StringUtils.getRestName(propertyName))
        .offlinePropertyName(propertyName);
    SettableValue hnvValue = new SettableValue(new StringValue(hnv), isSet);
    return response.setSuccess(new FormProperty(hnvPropertyDef, hnvValue));
  }

  private static String computeCustomHostnameVerifier(FormProperty customHvnProperty) {
    if (customHvnProperty != null) {
      SettableValue customHvn = customHvnProperty.getValue().asSettable();
      if (customHvn.isSet()) {
        String hnv = customHvn.getValue().asString().getValue();
        if (!StringUtils.isEmpty(hnv)) {
          return hnv;
        }
      }
    }
    return null;
  }
}
