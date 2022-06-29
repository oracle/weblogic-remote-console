// Copyright (c) 2021, 2022, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo.weblogic;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Properties;
import javax.json.JsonArray;
import javax.json.JsonNumber;
import javax.json.JsonObject;
import javax.json.JsonString;
import javax.json.JsonValue;

import weblogic.remoteconsole.common.repodef.BeanChildDef;
import weblogic.remoteconsole.common.repodef.BeanTypeDef;
import weblogic.remoteconsole.common.repodef.BeanValueDef;
import weblogic.remoteconsole.common.utils.Path;
import weblogic.remoteconsole.common.utils.StringUtils;
import weblogic.remoteconsole.server.repo.ArrayValue;
import weblogic.remoteconsole.server.repo.BeanRepo;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.BooleanValue;
import weblogic.remoteconsole.server.repo.DateAsLongValue;
import weblogic.remoteconsole.server.repo.DateValue;
import weblogic.remoteconsole.server.repo.DoubleValue;
import weblogic.remoteconsole.server.repo.HealthStateValue;
import weblogic.remoteconsole.server.repo.IntValue;
import weblogic.remoteconsole.server.repo.LongValue;
import weblogic.remoteconsole.server.repo.NullReference;
import weblogic.remoteconsole.server.repo.PropertiesValue;
import weblogic.remoteconsole.server.repo.ReferenceAsReferencesValue;
import weblogic.remoteconsole.server.repo.SecretValue;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.repo.ThrowableValue;
import weblogic.remoteconsole.server.repo.UnresolvedReference;
import weblogic.remoteconsole.server.repo.Value;

/**
 * This class converts a json value returned from the WebLogicRest api
 * into a Value (i.e. the lingua franca of the CBE).
 */
class WebLogicRestValueBuilder {
  private BeanRepo beanRepo;
  private BeanChildDef rootChildDef;

  // 3 digit tz, e.g. ...+05:00
  private static final String ISO_8601_DATE_TIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX";

  WebLogicRestValueBuilder(BeanRepo beanRepo, BeanChildDef rootChildDef) {
    this.beanRepo = beanRepo;
    this.rootChildDef = rootChildDef;
  }

  Value buildValue(BeanValueDef valueDef, JsonValue jsonValue) {
    return getValue(valueDef, jsonValue, false);
  }

  Value buildReference(JsonValue jsonValue) {
    return getReference(jsonValue, false);
  }

  private Value getValue(BeanValueDef valueDef, JsonValue jsonValue, boolean processingArray) {
    if (valueDef.isReferenceAsReferences()) {
      List<Value> values = new ArrayList<Value>();
      for (JsonValue jsonVal : jsonValue.asJsonArray()) {
        values.add(getReference(jsonVal, true));
      }
      return new ReferenceAsReferencesValue(values);
    }
    if (valueDef.isArray() && !processingArray) {
      return getArray(valueDef, jsonValue);
    }
    if (valueDef.isReference()) {
      return getReference(jsonValue, processingArray);
    }
    if (valueDef.isString()) {
      String value = (jsonValue == JsonValue.NULL) ? null : ((JsonString)jsonValue).getString();
      return new StringValue(value);
    }
    if (valueDef.isSecret()) {
      String value = (jsonValue == JsonValue.NULL) ? null : ((JsonString)jsonValue).getString();
      return new SecretValue(value);
    }
    if (valueDef.isBoolean()) {
      return new BooleanValue(jsonValue == JsonValue.TRUE);
    }
    if (valueDef.isInt()) {
      int value = (jsonValue == JsonValue.NULL) ? 0 : ((JsonNumber)jsonValue).intValue();
      return new IntValue(value);
    }
    if (valueDef.isLong()) {
      long value = (jsonValue == JsonValue.NULL) ? 0 : ((JsonNumber)jsonValue).longValue();
      return new LongValue(value);
    }
    if (valueDef.isDouble()) {
      double value = (jsonValue == JsonValue.NULL) ? 0 : ((JsonNumber)jsonValue).doubleValue();
      return new DoubleValue(value);
    }
    if (valueDef.isDateAsLong()) {
      long value = (jsonValue == JsonValue.NULL) ? 0 : ((JsonNumber)jsonValue).longValue();
      return new DateAsLongValue(value);
    }
    if (valueDef.isProperties()) {
      return new PropertiesValue(getProperties(jsonValue));
    }
    if (valueDef.isHealthState()) {
      return new HealthStateValue(getHealthState(jsonValue));
    }
    if (valueDef.isThrowable()) {
      return new ThrowableValue(getThrowable(jsonValue));
    }
    if (valueDef.isDate()) {
      return new DateValue(getDate(jsonValue));
    }
    throw new AssertionError("Unsupported value kind: " + valueDef + " " + valueDef.getValueKind());
  }

  private ArrayValue getArray(BeanValueDef valueDef, JsonValue jsonValue) {
    List<Value> values = new ArrayList<>();
    if (jsonValue != JsonValue.NULL) {
      for (JsonValue jsonVal : jsonValue.asJsonArray()) {
        values.add(getValue(valueDef, jsonVal, true));
      }
    } else {
      // sometimes the WLS REST api represents empty arrays as nulls
    }
    return new ArrayValue(values);
  }

  private Properties getProperties(JsonValue jsonValue) {
    Properties properties = new Properties();
    if (jsonValue == JsonValue.NULL) {
      // no properties
    } else {
      JsonObject jsonObj = jsonValue.asJsonObject();
      for (String key : jsonObj.keySet()) {
        String value = jsonObj.getString(key);
        properties.setProperty(key, value);
      }
    }
    return properties;
  }

  private Date getDate(JsonValue jsonValue) {
    String iso8601 = ((JsonString)jsonValue).getString();
    if (StringUtils.isEmpty(iso8601)) {
      return null;
    } else {
      try {
        return new SimpleDateFormat(ISO_8601_DATE_TIME_FORMAT).parse(iso8601);
      } catch (ParseException e) {
        throw new AssertionError("Can't parse as iso8601: " + iso8601, e);
      }
    }
  }

  private Throwable getThrowable(JsonValue jsonValue) {
    if ((jsonValue == null) || jsonValue != JsonValue.NULL) {
      return null;
    }
    JsonObject jsonObj = jsonValue.asJsonObject();
    String message = jsonObj.getString("message");
    Throwable cause = getThrowable(jsonObj.get("cause"));
    return new Throwable(message, cause);
  }

  private String getHealthState(JsonValue jsonValue) {
    // Use the structured data to obtain the current health state
    String result = null;
    if ((jsonValue != null) && (jsonValue != JsonValue.NULL)) {
      result = jsonValue.asJsonObject().getString("state");
    }
    return result;
  }

  private Value getReference(JsonValue jsonValue, boolean processingArray) {
    // in the WLS REST api, singleton references are inline, e.g.
    //   [ "Servers", "Server1" ]
    // and array references are wrapped, e.g.
    //   [ { "identity" : [ "Servers", "Server1 "] }, { "identity" : [ "Servers", "Server2 "] } ]
    if (processingArray) {
      jsonValue = jsonValue.asJsonObject().getJsonArray("identity");
    }

    if (jsonValue == JsonValue.NULL) {
      return NullReference.INSTANCE;
    }

    // The WLS REST identity is relative to the first level bean of the
    // search results (e.g. /Domain or /DomainRuntime)
    BeanChildDef startingChildBean = rootChildDef;

    Path beanPath = new Path();

    // Add the first level bean to the new bean identity's path
    // since the WLS REST identity doesn't include it.
    beanPath.addComponent(startingChildBean.getChildName());

    // Convert the WLS REST identity segments into a bean path
    BeanTypeDef typeDef = startingChildBean.getChildTypeDef();
    JsonArray restSegments = jsonValue.asJsonArray();
    for (int i = 0; i < restSegments.size(); i++) {

      // Find the corresponding bean property for the WLS REST segment
      // and add it to the bean path
      String restName = restSegments.getString(i);
      String childName = StringUtils.getBeanName(restName);
      boolean searchSubTypes = true;
      BeanChildDef childDef = typeDef.getChildDef(new Path(childName), searchSubTypes);
      if (childDef == null) {
        // The user isn't allowed to view this child.
        // Switch to an UnresolvedReference, using the WLS REST identity's last string as the label
        // (e.g. [ servers, myServer ] -> myserver)
        // so that the user can at least see the name of the referenced bean
        return new UnresolvedReference(restSegments.getString(restSegments.size() - 1));
      }
      beanPath.addComponent(childDef.getChildName());

      if (childDef.isCollection() && i < (restSegments.size() - 1)) {
        // the next segment is the name of the item in the collection.
        // copy it over as-is
        i++;
        beanPath.addComponent(restSegments.getString(i));
      }

      typeDef = childDef.getChildTypeDef();
    }

    return BeanTreePath.create(beanRepo, beanPath);
  }
}
