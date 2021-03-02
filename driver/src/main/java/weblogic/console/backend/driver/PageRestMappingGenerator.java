// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import javax.json.JsonObject;

import weblogic.console.backend.driver.PluginSourceUtils.Parameter;
import weblogic.console.backend.driver.plugins.Source;
import weblogic.console.backend.pagedesc.WeblogicPageSource;
import weblogic.console.backend.typedesc.SubType;
import weblogic.console.backend.typedesc.WeblogicBeanProperty;
import weblogic.console.backend.typedesc.WeblogicBeanType;
import weblogic.console.backend.utils.Path;
import weblogic.console.backend.utils.PluginInvocationUtils;
import weblogic.console.backend.utils.StringUtils;
import weblogic.console.backend.utils.YamlUtils;

/**
 * Receives the raw info about a page and repackages static information about a page and its
 * type so that the RDS can efficiently convert between RDJ REST requests and WLS REST requests.
 * <p>
 * Think of it as pre-computing some of the mapping between the page's CBE REST interface
 * and the underlying WLS REST interface and caching it.
 */
public class PageRestMappingGenerator {

  private static final Logger LOGGER = Logger.getLogger(PageRestMappingGenerator.class.getName());

  private PageRestMapping pageRestMapping;

  private PageRestMapping getPageRestMapping() {
    return this.pageRestMapping;
  }

  private List<WeblogicBeanProperty> beanProperties;

  private List<WeblogicBeanProperty> getBeanProperties() {
    return this.beanProperties;
  }

  private Map<String, PathSegmentRestMapping> unfoldedBeanPathToMapping = new HashMap<>();

  private PageRestMappingGenerator(
    WeblogicPageSource pageSource,
    Path foldedBeanPath,
    List<WeblogicBeanProperty> beanProperties
  ) throws Exception {
    this.pageRestMapping = new PageRestMapping(pageSource, foldedBeanPath);
    this.beanProperties = beanProperties;
  }

  /**
   * @param pageSource - info about the page and its type in PDY and type.yaml terms
   * 
   * @param foldedBeanPath - the folded bean path to the page, without identities,
   *     in RDS terms, e.g. <pre>[ Servers, NetworkAccessPoints ]</pre>
   *
   * @param beanProperties - the list of WebLogicBeanProperties that are displayed on the
   *      page as well as other ones that might be needed like Identity and the key property
   *
   * @return a PageRestMapping
   */
  public static PageRestMapping generate(
    WeblogicPageSource pageSource,
    Path foldedBeanPath,
    List<WeblogicBeanProperty> beanProperties
  ) throws Exception {
    return (new PageRestMappingGenerator(pageSource, foldedBeanPath, beanProperties)).generate();
  }

  private PageRestMapping generate() throws Exception {
    processPageFoldedBeanPath();
    processPageBeanType();
    processPageBeanProperties();
    processHeterogeneousSubTypes();
    return getPageRestMapping();
  }

  private void processPageFoldedBeanPath() throws Exception {
    PathSegmentRestMapping pagePathSegment =
      processFoldedBeanPath(getPageRestMapping().getFoldedBeanPath());
    getPageRestMapping().setPagePathSegment(pagePathSegment);
  }

  private PathSegmentRestMapping processFoldedBeanPath(Path foldedBeanPath) throws Exception {
    PathSegmentRestMapping parentSegmentMapping = getPageRestMapping().getRootPathSegment();
    WeblogicBeanType parentType =
      getPageRestMapping()
        .getPageSource()
        .getPagePath()
        .getPagesPath()
        .getPerspectivePath()
        .getRootBeanType();
    for (String component : foldedBeanPath.getComponents()) {
      String childPropName = component;
      WeblogicBeanProperty beanPathProp =
        parentSegmentMapping
          .getBeanType()
          .getProperty("processFoldedBeanPath", childPropName);
      if (beanPathProp != null) {
        Path childUnfoldedBeanPath =
          beanPathProp.getUnfoldedBeanPath().childPath(beanPathProp.getBeanName());
        parentSegmentMapping =
          processUnfoldedBeanPath(parentSegmentMapping, childUnfoldedBeanPath);
      } else {
        // can't find the definition of the child property (i.e. this is a PDY problem)
        // a warning has already been reported.
        // skip it
        // TBD - someday the warning will become a build failure
        // so we won't have to worry about null here.
        return parentSegmentMapping;
      }
    }
    return parentSegmentMapping;
  }

  private PathSegmentRestMapping processUnfoldedBeanPath(
    PathSegmentRestMapping parentSegmentMapping,
    Path unfoldedBeanPath
  ) throws Exception {
    return processUnfoldedBeanPath(parentSegmentMapping, unfoldedBeanPath, false);
  }

  private PathSegmentRestMapping processUnfoldedBeanPath(
    PathSegmentRestMapping parentSegmentMapping,
    Path unfoldedBeanPath,
    boolean unfoldedBeanPathUsesRestNames
  ) throws Exception {
    PathSegmentRestMapping parentMapping = parentSegmentMapping;
    for (String component : unfoldedBeanPath.getComponents()) {
      String unfoldedPropertyRestName =
        (unfoldedBeanPathUsesRestNames)
        ? component
        : StringUtils.getRestName(component);
      Path childUnfoldedBeanPath =
        parentMapping.getUnfoldedBeanPath().childPath(unfoldedPropertyRestName);
      String key = childUnfoldedBeanPath.getDotSeparatedPath();
      PathSegmentRestMapping childMapping = this.unfoldedBeanPathToMapping.get(key);
      if (childMapping == null) {
        WeblogicBeanProperty childBeanProp =
          parentMapping
            .getBeanType()
            .getLocalPropertyByPropertyRestName(
              "processUnfoldedBeanPath " + unfoldedBeanPath + " " + parentSegmentMapping,
              unfoldedPropertyRestName
            );
        if (childBeanProp != null) {
          childMapping = new PathSegmentRestMapping(parentMapping, childBeanProp);
          this.unfoldedBeanPathToMapping.put(key, childMapping);
        } else {
          // can't find the definition of the child property (i.e. this is a PDY problem)
          // a warning has already been reported.
          // skip it
          // TBD - someday the warning will become a build failure
          // so we won't have to worry about anything here.
          return parentMapping;
        }
      }
      parentMapping = childMapping;
    }
    return parentMapping;
  }

  private void processPageBeanType() throws Exception {
    // Process the type's delete plugin
    getPageRestMapping().setDeletePlugin(
      processConfigurationTypePlugin(
        getPageRestMapping().getPageSource().getType().getDeleteMethod(),
        Void.TYPE,
        "deleteMethod"
      )
    );
  }

  private TypePluginRestMapping processConfigurationTypePlugin(
    String pluginName,
    Class returnType,
    String methodName
  ) throws Exception {
    if (StringUtils.isEmpty(pluginName)) {
      return null;
    }
    if (!getPageRestMapping().getPageSource().getType().isConfigurationMBean()) {
      configurationError(pluginName + " runtime mbeans do not support " + methodName);
    }
    String context =
      getPageRestMapping().getPageSource().getPagePath().getPagesPath() + " " + pluginName;
    Method method = PluginInvocationUtils.getMethod(context, pluginName);
    PluginInvocationUtils.checkReturnType(context, method, returnType);
    TypePluginRestMapping plugin = new TypePluginRestMapping(method, getPageRestMapping());
    processParameters(plugin);
    return plugin;
  }

  private void processPageBeanProperties() throws Exception {
    for (WeblogicBeanProperty beanProp : getBeanProperties()) {
      processPageBeanProperty(beanProp);
    }
  }

  private void processPageBeanProperty(WeblogicBeanProperty beanProp) throws Exception {
    if (beanProp.isContainmentRelationship()) {
      configurationError(beanProp, "is a contained bean or contained collection of beans");
      return;
    }
    PathSegmentRestMapping segment =
      processUnfoldedBeanPath(
        getPageRestMapping().getPagePathSegment(),
        beanProp.getUnfoldedBeanPath()
      );
    PropertyRestMapping propertyMapping =
      new PropertyRestMapping(segment, beanProp); // registers itself with its segment
    processPageBeanPropertyPlugins(propertyMapping);
    processPageBeanPropertyOptionsProperties(propertyMapping);
    if (!segment.isRoot()) {
      WeblogicBeanType type = getPageRestMapping().getPageSource().getType();
      if (!type.isHomogeneous()) {
        // TBD - will this work if the sub type discriminator property gets aliased?
        if (beanProp.getName().equals(type.getSubTypeDiscriminatorPropertyName())) {
          getPageRestMapping().setSubTypeDiscriminatorProperty(propertyMapping);
          LOGGER.finest("Recording sub type discriminator property " + propertyMapping);
        }
      }
    }
  }

  private void processPageBeanPropertyPlugins(
    PropertyRestMapping referringProperty
  ) throws Exception {
    processGetMethod(referringProperty);
    processOptionsMethod(referringProperty);
  }

  private void processGetMethod(PropertyRestMapping referringProperty) throws Exception {
    String pluginName = referringProperty.getBeanProperty().getGetMethod();
    if (StringUtils.isEmpty(pluginName)) {
      return;
    }
    referringProperty.setGetMethod(
      processReadPlugin(referringProperty, "getMethod", pluginName)
    );
  }

  private void processOptionsMethod(PropertyRestMapping referringProperty) throws Exception {
    String pluginName = referringProperty.getBeanProperty().getOptionsMethod();
    if (StringUtils.isEmpty(pluginName)) {
      return;
    }
    if (!referringProperty.getBeanProperty().getOptionsSources().isEmpty()) {
      throw new Exception(referringProperty + " specifies both optionsSources and optionsMethod");
    }
    referringProperty.setOptionsMethod(
      processReadPlugin(referringProperty, "optionsMethod", pluginName)
    );
  }

  private GetPropertyPluginRestMapping processReadPlugin(
    PropertyRestMapping referringProperty,
    String pluginPropertyName,
    String pluginName
  ) throws Exception {
    String context = referringProperty + " " + pluginPropertyName;
    Method method = PluginInvocationUtils.getMethod(context, pluginName);
    PluginInvocationUtils.checkReturnType(
      context, method, JsonObject.class); // return { value: ..., set: boolean }
    GetPropertyPluginRestMapping plugin =
      new GetPropertyPluginRestMapping(method, referringProperty);
    processParameters(plugin);
    return plugin;
  }

  private void processParameters(PluginRestMapping plugin) throws Exception {
    for (Parameter parameter : PluginSourceUtils.getParameters(plugin.getMethod())) {
      createParameter(plugin, parameter);
    }
  }

  private PluginParameterRestMapping createParameter(PluginRestMapping plugin, Parameter parameter) throws Exception {
    PluginParameterRestMapping param = null;

    // get the perspective
    String perspective =
      getPageRestMapping()
        .getPageSource()
        .getPagePath()
        .getPagesPath()
        .getPerspectivePath()
        .getPerspective();

    // all plugins can access the InvocationContext
    if (param == null) {
      param = createBuiltinParameter(plugin, parameter, InvocationContext.class);
    }

    // plugins in the configuration perspective can access the WeblogicConfiguration
    if (param == null && "configuration".equals(perspective)) {
      // TBD - WeblogicConfiguration v.s WeblogicRuntime depending on the perspective:
      param = createBuiltinParameter(plugin, parameter, WeblogicConfiguration.class);
    }

    // plugins in the monitoring perspectiver can access the WeblogicRuntime
    if (param == null && "monitoring".equals(perspective)) {
      param = createBuiltinParameter(plugin, parameter, WeblogicRuntime.class);
    }

    if (param == null) {
      // plugins can annotate params with a 'Source' annotation which causes
      // the CBE to read mbean values from the WeblogicConfiguration/WeblogicRuntime
      // then send them into the plugins as args
      param = createSourcedParameter(plugin, parameter);
    }

    // See if the java parameter has a matching type
    if (!parameter.getJavaClass().equals(param.getJavaClass())) {
      throw
        new Exception(
          plugin
          + " wrong parameter type for "
          + param
          + " - have: "
          + parameter.getJavaClass()
          + " require: "
          + param.getJavaClass()
        );
    }

    // Looks good. Remember it.
    plugin.addParameter(param);

    return param;
  }

  private PluginParameterRestMapping createBuiltinParameter(
    PluginRestMapping plugin,
    Parameter parameter,
    Class<?> builtinParameterJavaClass
  ) throws Exception {
    if (!parameter.getJavaClass().equals(builtinParameterJavaClass)) {
      return null;
    }
    if (parameter.getSource() != null) {
      throw
        new Exception(
          plugin
          + " specified @Source annotation for a "
          + builtinParameterJavaClass
          + " method parameter"
        );
    }
    return new BuiltinPluginParameterRestMapping(builtinParameterJavaClass, plugin);
  }

  private PluginParameterRestMapping createSourcedParameter(
    PluginRestMapping plugin,
    Parameter parameter
  ) throws Exception {
    // TBD This needs a revamp! For now, do just enough to get the test to pass and the current
    // plugins to work.
    Source source = parameter.getSource();
    if (source == null) {
      throw
        new Exception(
          plugin
          + " missing @Source annotation for a "
          + parameter.getJavaClass()
         + " method parameter"
        );
    }
    ParsedSource parsedSource = parseSource(plugin, source);
    if (parsedSource.getType() == ParsedSource.Type.COLLECTION) {
      return createCollectionParameter(parsedSource, plugin);
    } else if (parsedSource.getType() == ParsedSource.Type.BEAN) {
      return createBeanParameter(parsedSource, plugin);
    } else if (parsedSource.getType() == ParsedSource.Type.PROPERTY) {
      return createPropertyParameter(parsedSource, plugin);
    } else {
      throw new AssertionError("Unknown parameter source type: " + parsedSource.getType());
    }
  }

  private CollectionPluginParameterRestMapping createCollectionParameter(
    ParsedSource parsedSource,
    PluginRestMapping plugin
  ) throws Exception {
    PathSegmentRestMapping segment =
      getReferencedPathSegment(parsedSource.getUnfoldedPath(), plugin);
    if (!segment.getBeanProperty().isContainedCollection()) {
      throw
        new Exception(
          plugin
          + " @Source annotation's collection does not refer to collection property: "
          + segment
        );
    }
    return
      new CollectionPluginParameterRestMapping(
        segment,
        createPluginBeanProperties(parsedSource.getProperties(), segment, plugin),
        plugin
      );
  }

  private BeanPluginParameterRestMapping createBeanParameter(
    ParsedSource parsedSource,
    PluginRestMapping plugin
  ) throws Exception {
    PathSegmentRestMapping segment =
      getReferencedPathSegment(parsedSource.getUnfoldedPath(), plugin);
    return
      new BeanPluginParameterRestMapping(
        segment,
        createPluginBeanProperties(parsedSource.getProperties(), segment, plugin),
        plugin
    );
  }

  private PropertyPluginParameterRestMapping createPropertyParameter(
    ParsedSource parsedSource,
    PluginRestMapping plugin
  ) throws Exception {
    PathSegmentRestMapping segment =
      getReferencedPathSegment(parsedSource.getUnfoldedPath(), plugin);
    return
      new PropertyPluginParameterRestMapping(
        createPluginBeanProperties(parsedSource.getProperties(), segment, plugin).get(0),
        plugin
      );
  }

  private PathSegmentRestMapping getReferencedPathSegment(
    String unfoldedPath,
    PluginRestMapping plugin
  ) throws Exception {

    // Start off at the top level folded bean for this page
    PathSegmentRestMapping segment = getPageRestMapping().getPagePathSegment();

    // If the plugin is scoped to a property, start at that the bean containing that property
    if (plugin.isPropertyPlugin()) {
      segment = plugin.asPropertyPlugin().getReferringProperty().getParent();
    }

    if (unfoldedPath.startsWith("/")) {
      // e.g. /clusters -> start at DomainMBean, then find clusters
      segment = segment.getRoot();
      unfoldedPath = unfoldedPath.substring(1);
    }

    if (unfoldedPath.equals("..")) {
      // e.g. .. -> if we're at securityConfiguration/realms, use securityConfiguration
      segment = segment.getParent();
      unfoldedPath = "";
    }
    while (unfoldedPath.startsWith("../")) {
      // e.g. ../../machines -> go up two levels, then find machines
      segment = segment.getParent();
      unfoldedPath = unfoldedPath.substring(3); // ../ is 3 characters long
    }

    // Source annotations use / as the path separator while bean paths use .
    unfoldedPath = unfoldedPath.replaceAll("/", ".");

    return processUnfoldedBeanPath(segment, new Path(unfoldedPath), true);
  }

  private List<PluginBeanPropertyRestMapping> createPluginBeanProperties(
    List<String> properties,
    PathSegmentRestMapping segment,
    PluginRestMapping plugin
  ) throws Exception {
    List<PluginBeanPropertyRestMapping> rtn = new ArrayList<>();
    for (String property : properties) {
      PropertySource propSource = getPluginPropertySource(property, segment, plugin);
      if (propSource == null) {
        throw new Exception(plugin + " can't find property for " + property);
      }
      rtn.add(
        new PluginBeanPropertyRestMapping(
          propSource.getSegment(),
          propSource.getBeanProperty(),
          plugin
        )
      );
    }
    for (PluginBeanPropertyRestMapping pluginBeanProp : rtn) {
      pluginBeanProp.getParent().addPluginBeanProperty(pluginBeanProp);
    }
    return rtn;
  }

  private PropertySource getPluginPropertySource(
    String property,
    PathSegmentRestMapping segment,
    PluginRestMapping plugin
  ) throws Exception {
    int idx = property.lastIndexOf(".");
    String propertyUnfoldedBeanPath = (idx == -1) ? "" : property.substring(0, idx);
    String propertyRestName = (idx == -1) ? property : property.substring(idx + 1);
    PathSegmentRestMapping propertySegment =
      processUnfoldedBeanPath(segment, new Path(propertyUnfoldedBeanPath), true);
    if (propertySegment == null) {
      throw
        new Exception(
          plugin
          + " @Source annotation can't find bean for "
          + segment
          + " "
          + property
        );
    }
    if (propertySegment.getFoldedSegment() != segment.getFoldedSegment()) {
      throw
        new Exception(
          plugin
          + " @Source annotation "
          + property
          + " is not a property of "
          + segment
          + " or one if its folded child beans"
        );
    }
    WeblogicBeanProperty beanProp =
      propertySegment
        .getBeanType()
        .getLocalPropertyByPropertyRestName(
          plugin
          + " @Source annotation "
          + segment
          + " "
          + property,
          propertyRestName
        );
    if (beanProp == null) {
      throw
        new Exception(
          plugin
          + " @Source annotation can't find property for "
          + segment
          + " "
          + property
        );
    }
    return new PropertySource(propertySegment, beanProp);
  }

  private ParsedSource parseSource(PluginRestMapping plugin, Source source) throws Exception {
    String bean = source.bean();
    String collection = source.collection();
    String property = source.property();
    String[] propertiesArray = source.properties();
    List<String> properties =
      (propertiesArray != null)
      ? Arrays.asList(propertiesArray)
      : new ArrayList<>(0);

    ParsedSource.Type type = null;
    String unfoldedPath = null;
    List<String> props = null;

    if (StringUtils.notEmpty(collection) && StringUtils.notEmpty(bean)) {
      throw
        new Exception(
          plugin
          + " @Source annotation must not specify both 'bean' and 'collection'"
        );
    }
    if (!properties.isEmpty() && StringUtils.notEmpty(property)) {
      throw
        new Exception(
          plugin
          + " @Source annotation must not specify both 'property' and 'properties'"
        );
    }

    if (StringUtils.notEmpty(collection)) {
      unfoldedPath = collection;
      type = ParsedSource.Type.COLLECTION;
      if (properties.isEmpty()) {
        throw
          new Exception(
            plugin
            + " @Source annotation must specify 'properties' when 'collection' is specified"
          );
      }
      props = properties;
    } else {
      unfoldedPath = StringUtils.nonNull(bean);
      if (!properties.isEmpty()) {
        type = ParsedSource.Type.BEAN;
        props = properties;
      } else {
        if (StringUtils.isEmpty(property)) {
          throw
            new Exception(
              plugin
              + " @Source annotation must specify 'property' or 'properties'"
            );
        }
        type = ParsedSource.Type.PROPERTY;
        props = new ArrayList<>();
        props.add(property);
      }
    }
    return new ParsedSource(type, unfoldedPath, props);
  }

  private static class ParsedSource {

    private enum Type {
      COLLECTION,
      BEAN,
      PROPERTY
    }

    private Type type;

    private Type getType() {
      return this.type;
    }

    private String unfoldedPath;

    private String getUnfoldedPath() {
      return this.unfoldedPath;
    }

    private List<String> properties;

    private List<String> getProperties() {
      return this.properties;
    }

    private ParsedSource(Type type, String unfoldedPath, List<String> properties) {
      this.type = type;
      this.unfoldedPath = unfoldedPath;
      this.properties = properties;
    }
  }

  private void processPageBeanPropertyOptionsProperties(
    PropertyRestMapping referringProperty
  ) throws Exception {
    PathSegmentRestMapping segment = referringProperty.getParent();
    WeblogicBeanProperty beanProp = referringProperty.getBeanProperty();
    if (getPageRestMapping().getPageSource().isTable()) {
      // tables don't support options
      LOGGER.finest("skipping options for table property " + segment + " " + beanProp);
      return;
    }
    if (!(beanProp.isCreateWritable() || beanProp.isUpdateWritable())) {
      // read-only properties don't support options
      LOGGER.finest("skipping options for read-only property " + segment + " " + beanProp);
      return;
    }
    if (!beanProp.isSupportsOptions()) {
      // We don't support options for this kind of property yet
      LOGGER.finest("skipping options for property " + segment + " " + beanProp);
      return;
    }
    LOGGER.finest("processPageBeanPropertyOptionsProperties " + segment + " " + beanProp);
    List<OptionsRestMapping> list = new ArrayList<>();
    for (String optionsSource : beanProp.getOptionsSources()) {
      OptionsRestMapping options =
        processPageBeanPropertyOptionsSource(referringProperty, optionsSource);
      if (options != null) {
        list.add(options);
      }
    }
    boolean hasOptionsMethod =
      !StringUtils.isEmpty(referringProperty.getBeanProperty().getOptionsMethod());
    if (list.isEmpty()) {
      if (hasOptionsMethod) {
        // the options method returns them
      } else {
        configurationError(
          "can't find options for "
          + segment
          + " "
          + beanProp
        );
      }
    } else {
      if (hasOptionsMethod) {
        configurationError(
          "optionsSources and optionsMethod specified for "
          + segment
          + " "
          + beanProp
        );
      } else {
        LOGGER.finest("found options for " + segment + " " + beanProp + " " + list);
      }
    }
    referringProperty.setOptions(list);
  }

  private OptionsRestMapping processPageBeanPropertyOptionsSource(
    PropertyRestMapping referringProperty,
    String optionsSource
  ) throws Exception {
    PropertySource source = findReferencedProperty(referringProperty, optionsSource);
    WeblogicBeanProperty optionsProp = source.getBeanProperty();
    if (!(optionsProp.isContainedCollection() || optionsProp.isReferences())) {
      configurationError(
        optionsProp,
        "is not a contained collection or reference collection: "
        + referringProperty
        + " "
        + optionsSource
      );
      return null;
    }
    return new OptionsRestMapping(source.getSegment(), optionsProp, referringProperty);
  }

  private PropertySource findReferencedProperty(
    PropertyRestMapping referringProperty,
    String foldedPath
  ) throws Exception {
    PathSegmentRestMapping referringPropertySegment =
      referringProperty.getParent().getFoldedSegment();
    PathSegmentRestMapping segment = null;
    PathSegmentRestMapping optionsSegment = null;
    String propertyName = null;
    if (foldedPath.startsWith("/")) {
      // e.g. /Machines = DomainMBean's Machines property
      segment = referringPropertySegment.getRoot();
      propertyName = foldedPath.substring(1);
    } else if (foldedPath.startsWith("../")) {
      // e.g. ../../Machines = segment's parent's parent's Machines property
      segment = referringPropertySegment;
      while (foldedPath.startsWith("../")) {
        segment = segment.getParent().getFoldedSegment();
        foldedPath = foldedPath.substring(3); // ../ is 3 characters long
      }
      propertyName = foldedPath;
    } else {
      // e.g. Machines = segment's Machines property
      segment = referringPropertySegment;
      propertyName = foldedPath;
    }
    WeblogicBeanProperty beanProp =
      segment
        .getBeanType()
        .getProperty("findReferencedProperty: " + referringProperty, propertyName);
    if (beanProp == null) {
      return null; // couldn't find the property.  already printed a warning.
    }
    return
      new PropertySource(
        processUnfoldedBeanPath(segment, beanProp.getUnfoldedBeanPath()),
        beanProp
      );
  }

  private static class PropertySource {
    private PathSegmentRestMapping segment;

    private PathSegmentRestMapping getSegment() {
      return segment;
    }

    private WeblogicBeanProperty beanProperty;

    private WeblogicBeanProperty getBeanProperty() {
      return this.beanProperty;
    }

    private PropertySource(PathSegmentRestMapping segment, WeblogicBeanProperty beanProperty) {
      this.segment = segment;
      this.beanProperty = beanProperty;
    }
  }

  private void processHeterogeneousSubTypes() throws Exception {
    WeblogicBeanType type = getPageRestMapping().getPageSource().getType();
    if (type.isHomogeneous()) {
      return;
    }
    for (SubType subType : type.getSubTypes()) {
      processSubType(getPageRestMapping().getPagePathSegment(), subType);
    }
  }

  private void processSubType(PathSegmentRestMapping segment, SubType subType) throws Exception {
    WeblogicBeanType type =
      segment.getBeanProperty().getBeanType().getTypes().getType(subType.getType());
    List<PropertyRestMapping> properties = new ArrayList<>();
    for (PropertyRestMapping property : segment.getProperties()) {
      if (type.hasProperty(property.getBeanProperty().getName())) {
        LOGGER.finest(
          "adding subtype property "
          + getPageRestMapping()
          + " "
          + type.getName()
          + " "
          + property.getBeanProperty()
        );
        properties.add(property);
      } else {
        LOGGER.finest(
          "skipping subtype property "
          + getPageRestMapping()
          + " "
          + type.getName()
          + " "
          + property.getBeanProperty()
        );
      }
    }
    segment.addSubType(subType.getValue(), properties);
    for (PathSegmentRestMapping childSegment : segment.getChildren()) {
      processSubType(childSegment, subType);
    }
  }

  private void configurationError(WeblogicBeanProperty prop, String problem) throws Exception {
    configurationError(prop + " " + problem);
  }

  private void configurationError(String problem) throws Exception {
    YamlUtils.configurationError(
      getPageRestMapping().getPageSource().getPagePath()
      + " "
      + problem
    );
  }
}
