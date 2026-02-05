// Copyright (c) 2025, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.List;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObjectBuilder;
import javax.json.JsonValue;

import weblogic.remoteconsole.server.repo.ArrayValue;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.SettableValue;
import weblogic.remoteconsole.server.repo.Value;

public class SecurityResourceMBeanCustomizer {

  private SecurityResourceMBeanCustomizer() {
  }

  public static void copySecurityResourceArgs(
    JsonObjectBuilder argsBldr,
    List<FormProperty> properties,
    String type
  ) {
    argsBldr.add("type", type);
    if ("resourceId".equals(type)) {
      copyStringArg(argsBldr, properties, "resourceId");
    } else if ("adm".equals(type)) {
      copyStringArg(argsBldr, properties, "adm_category");
      copyStringArg(argsBldr, properties, "adm_realm");
      copyStringArg(argsBldr, properties, "adm_action");
    } else if ("app".equals(type)) {
      copyStringArg(argsBldr, properties, "app_application");
    } else if ("com".equals(type)) {
      copyStringArg(argsBldr, properties, "com_application");
      copyStringArg(argsBldr, properties, "com_class");
    } else if ("eis".equals(type)) {
      copyStringArg(argsBldr, properties, "eis_application");
      copyStringArg(argsBldr, properties, "eis_module");
      copyStringArg(argsBldr, properties, "eis_eis");
      copyStringArg(argsBldr, properties, "eis_destinationId");
    } else if ("ejb".equals(type)) {
      copyStringArg(argsBldr, properties, "ejb_application");
      copyStringArg(argsBldr, properties, "ejb_module");
      copyStringArg(argsBldr, properties, "ejb_ejb");
      copyStringArg(argsBldr, properties, "ejb_method");
      copyStringArg(argsBldr, properties, "ejb_methodInterface");
      copyStringArrayArg(argsBldr, properties, "ejb_any_signature", "ejb_signature");
    } else if ("jdbc".equals(type)) {
      copyStringArg(argsBldr, properties, "jdbc_application");
      copyStringArg(argsBldr, properties, "jdbc_module");
      copyStringArg(argsBldr, properties, "jdbc_resourceType");
      copyStringArg(argsBldr, properties, "jdbc_resource");
      copyStringArg(argsBldr, properties, "jdbc_action");
    } else if ("jms".equals(type)) {
      copyStringArg(argsBldr, properties, "jms_application");
      copyStringArg(argsBldr, properties, "jms_module");
      copyStringArg(argsBldr, properties, "jms_destinationType");
      copyStringArg(argsBldr, properties, "jms_resource");
      copyStringArg(argsBldr, properties, "jms_action");
    } else if ("jmx".equals(type)) {
      copyStringArg(argsBldr, properties, "jmx_operation");
      copyStringArg(argsBldr, properties, "jmx_application");
      copyStringArg(argsBldr, properties, "jmx_mbeanType");
      copyStringArg(argsBldr, properties, "jmx_target");
    } else if ("jndi".equals(type)) {
      copyStringArg(argsBldr, properties, "jndi_application");
      copyStringArrayArg(argsBldr, properties, "jndi_any_path", "jndi_path");
      copyStringArg(argsBldr, properties, "jndi_action");
    } else if ("svr".equals(type)) {
      copyStringArg(argsBldr, properties, "svr_application");
      copyStringArg(argsBldr, properties, "svr_server");
      copyStringArg(argsBldr, properties, "svr_action");
    } else if ("url".equals(type)) {
      copyStringArg(argsBldr, properties, "url_application");
      copyStringArg(argsBldr, properties, "url_contextPath");
      copyStringArg(argsBldr, properties, "url_uri");
      copyStringArg(argsBldr, properties, "url_httpMethod");
    } else if ("webservices".equals(type)) {
      copyStringArg(argsBldr, properties, "webservices_application");
      copyStringArg(argsBldr, properties, "webservices_contextPath");
      copyStringArg(argsBldr, properties, "webservices_webService");
      copyStringArg(argsBldr, properties, "webservices_method");
      copyStringArrayArg(argsBldr, properties, "webservices_any_signature", "webservices_signature_as_array");
    } else if ("workcontext".equals(type)) {
      copyStringArg(argsBldr, properties, "workcontext_action");
      copyStringArrayArg(argsBldr, properties, "workcontext_any_path", "workcontext_path");
    }
  }

  public static void copyStringArg(
    JsonObjectBuilder argsBldr,
    List<FormProperty> properties,
    String propertyName
  ) {
    argsBldr.add(propertyName, stringToJson(getStringArg(properties, propertyName)));
  }

  private static void copyStringArrayArg(
    JsonObjectBuilder argsBldr,
    List<FormProperty> properties,
    String useNullPropertyName,
    String propertyName
  ) {
    boolean useNull = true;
    Value useNullValue = getArg(properties, useNullPropertyName);
    if (useNullValue != null) {
      useNull = useNullValue.asBoolean().getValue();
    }
    ArrayValue val = null;
    if (!useNull) {
      val = getArrayArg(properties, propertyName);
      if (val == null) {
        val = new ArrayValue(List.of());
      }
    }
    if (val != null) {
      JsonArrayBuilder bldr = Json.createArrayBuilder();
      for (Value element : val.getValues()) {
        bldr.add(stringToJson(element.asString().getValue()));
      }
      argsBldr.add(propertyName, bldr);
    } else {
      argsBldr.addNull(propertyName);
    }
  }

  private static void copyStringArrayArg(
    JsonObjectBuilder argsBldr,
    List<FormProperty> properties,
    String propertyName
  ) {
    ArrayValue val = getArrayArg(properties, propertyName);
    if (val != null) {
      JsonArrayBuilder bldr = Json.createArrayBuilder();
      for (Value element : val.getValues()) {
        bldr.add(stringToJson(element.asString().getValue()));
      }
      argsBldr.add(propertyName, bldr);
    } else {
      argsBldr.addNull(propertyName);
    }
  }

  public static String getStringArg(List<FormProperty> properties, String propertyName) {
    Value value = getArg(properties, propertyName);
    return (value == null) ? null : value.asString().getValue();
  }

  public static Value getArg(List<FormProperty> properties, String propertyName) {
    FormProperty property = CustomizerUtils.findOptionalFormProperty(propertyName, properties);
    if (property == null) {
      return null;
    }
    return property.getValue().asSettable().getValue();
  }

  private static ArrayValue getArrayArg(List<FormProperty> properties, String propertyName) {
    FormProperty property = CustomizerUtils.findOptionalFormProperty(propertyName, properties);
    if (property == null) {
      return null;
    }
    SettableValue settable = property.getValue().asSettable();
    return (settable.isSet()) ? settable.getValue().asArray() : null;
  }

  private static JsonValue stringToJson(String value) {
    return (value != null) ? Json.createValue(value) : JsonValue.NULL;
  }
}
