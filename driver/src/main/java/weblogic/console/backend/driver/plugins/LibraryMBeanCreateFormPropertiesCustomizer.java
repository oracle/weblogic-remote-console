// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver.plugins;

import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonValue;

import weblogic.console.backend.driver.ExpandedValue;
import weblogic.console.backend.driver.InvocationContext;
import weblogic.console.backend.driver.WeblogicConfiguration;
import weblogic.console.backend.pagedesc.WeblogicPageSource;

import static weblogic.console.backend.utils.AppDeploymentMBeanCustomizerUtils.CREATE_FORM_PROPERTY_NAME;
import static weblogic.console.backend.utils.AppDeploymentMBeanCustomizerUtils.CREATE_FORM_PROPERTY_SOURCE;
import static weblogic.console.backend.utils.AppDeploymentMBeanCustomizerUtils.CREATE_FORM_PROPERTY_SOURCE_PATH;
import static weblogic.console.backend.utils.AppDeploymentMBeanCustomizerUtils.CREATE_FORM_PROPERTY_TARGETS;
import static weblogic.console.backend.utils.AppDeploymentMBeanCustomizerUtils.CREATE_FORM_PROPERTY_UPLOAD_FILES;

/**
 * Customize the initial property values in the LibraryMBean create form RDJ
 */
public class LibraryMBeanCreateFormPropertiesCustomizer extends AppDeploymentMBeanCreateFormPropertiesCustomizer {

  private static final Logger LOGGER =
    Logger.getLogger(LibraryMBeanCreateFormPropertiesCustomizer.class.getName());

  /*package*/ LibraryMBeanCreateFormPropertiesCustomizer(
    WeblogicPageSource pageSource,
    InvocationContext invocationContext,
    WeblogicConfiguration weblogicConfiguration
  ) {
    super(pageSource, invocationContext, weblogicConfiguration);
  }

  // Compute all of the initial property values to return in the RDJ
  @Override
  protected void computeInitialPropertyValues() throws Exception {
    JsonObjectBuilder properties = getInitialPropertyValues();

    JsonObject nullValue = ExpandedValue.fromValue(JsonValue.NULL).set(false).getJson();
    properties.add(CREATE_FORM_PROPERTY_NAME, nullValue);
    properties.add(CREATE_FORM_PROPERTY_SOURCE_PATH, nullValue);
    properties.add(CREATE_FORM_PROPERTY_SOURCE, nullValue);

    properties.add(
      CREATE_FORM_PROPERTY_UPLOAD_FILES,
      ExpandedValue.fromBoolean(false).set(false).getJson()
    );

    properties.add(
      CREATE_FORM_PROPERTY_TARGETS,
      addOptions(
        ExpandedValue
          .fromReferences(Json.createArrayBuilder().build())
          .set(false)
          .getJson(),
        getTargetsOptions()
      )
    );
  }
}
