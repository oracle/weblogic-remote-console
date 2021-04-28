// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.TreeSet;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.yaml.snakeyaml.DumperOptions;
import org.yaml.snakeyaml.Yaml;
import org.yaml.snakeyaml.introspector.Property;
import org.yaml.snakeyaml.nodes.Node;
import org.yaml.snakeyaml.nodes.Tag;
import org.yaml.snakeyaml.representer.Represent;
import org.yaml.snakeyaml.representer.Representer;
import weblogic.console.backend.utils.ListUtils;
import weblogic.console.backend.utils.StringUtils;

/**
 * Condenses the yaml for a WeblogicPage by not emitting property fields that
 * are set to their default values or are not appropriate for the page.
 */
public class WeblogicPageRepresenter extends Representer {

  public WeblogicPageRepresenter() {
    super();
    representers.put(Slice.class, new RepresentSlice());
    representers.put(WeblogicPage.class, new RepresentWeblogicPage());
    representers.put(WeblogicCreateForm.class, new RepresentWeblogicCreateForm());
    representers.put(WeblogicCreateFormPresentation.class, new RepresentWeblogicCreateFormPresentation());
    representers.put(WeblogicSliceForm.class, new RepresentWeblogicSliceForm());
    representers.put(WeblogicSliceFormPresentation.class, new RepresentWeblogicSliceFormPresentation());
    representers.put(WeblogicTable.class, new RepresentWeblogicTable());
    representers.put(FormSection.class, new RepresentFormSection());
    representers.put(WeblogicProperty.class, new RepresentWeblogicProperty());
    representers.put(WeblogicPropertyPresentation.class, new RepresentWeblogicPropertyPresentation());
    representers.put(WeblogicColumn.class, new RepresentWeblogicColumn());
    representers.put(WeblogicAction.class, new RepresentWeblogicAction());
    representers.put(MBeanInfo.class, new RepresentMBeanInfo());
    representers.put(UsedIf.class, new RepresentUsedIf());
  }

  public static String convertToJsonString(Object object) throws Exception {
    String yaml = (new Yaml(new WeblogicPageRepresenter())).dumpAsMap(object);
    Map map = (new Yaml()).loadAs(yaml, Map.class);
    ObjectMapper mapper = new ObjectMapper();
    mapper.enable(SerializationFeature.INDENT_OUTPUT);
    mapper.configure(SerializationFeature.ORDER_MAP_ENTRIES_BY_KEYS, true);
    return mapper.writerWithDefaultPrettyPrinter().writeValueAsString(map);
  }

  @Override
  protected Node representMapping(Tag tag, Map<?, ?> mapping, DumperOptions.FlowStyle flowStyle) {
    Map<?, ?> sortedMapping = new TreeMap<>(mapping);
    return super.representMapping(tag, sortedMapping, flowStyle);
  }

  private class RepresentWeblogicPage extends RepresentValues<WeblogicPage> {
    protected boolean isIgnore(WeblogicPage prop, Property p) {
      String name = p.getName();
      if ("beanPath".equals(name)) {
        // only used server-side to help create the help search indices
        return true;
      }
      if ("introductionHTML".equals(name) && StringUtils.isEmpty(prop.getIntroductionHTML())) {
        return true;
      }
      if ("helpTaskLabels".equals(name) && ListUtils.isEmpty(prop.getHelpTaskLabels())) {
        return true;
      }
      if ("helpTopics".equals(name) && ListUtils.isEmpty(prop.getHelpTopics())) {
        return true;
      }
      if ("sliceForm".equals(name) && prop.getSliceForm() == null) {
        return true;
      }
      if ("table".equals(name) && prop.getTable() == null) {
        return true;
      }
      if ("createForm".equals(name) && prop.getCreateForm() == null) {
        return true;
      }
      return false;
    }

    @Override
    protected Class<? extends Object> getType() {
      return WeblogicPage.class;
    }
  }

  private class RepresentWeblogicSliceForm extends RepresentValues<WeblogicSliceForm> {
    protected boolean isIgnore(WeblogicSliceForm prop, Property p) {
      String name = p.getName();
      if ("slices".equals(name) && ListUtils.isEmpty(prop.getSlices())) {
        return true;
      }
      if ("sections".equals(name) && ListUtils.isEmpty(prop.getSections())) {
        return true;
      }
      if ("advancedProperties".equals(name) && ListUtils.isEmpty(prop.getAdvancedProperties())) {
        return true;
      }
      if ("presentation".equals(name) && prop.getPresentation() == null) {
        return true;
      }
      return false;
    }

    @Override
    protected Class<? extends Object> getType() {
      return WeblogicSliceForm.class;
    }
  }

  private class RepresentWeblogicSliceFormPresentation extends RepresentValues<WeblogicSliceFormPresentation> {
    protected boolean isIgnore(WeblogicSliceFormPresentation prop, Property p) {
      String name = p.getName();
      if ("useCheckBoxesForBooleans".equals(name) && !prop.isUseCheckBoxesForBooleans()) {
        return true;
      }
      if ("singleColumn".equals(name) && !prop.isSingleColumn()) {
        return true;
      }
      return false;
    }

    @Override
    protected Class<? extends Object> getType() {
      return WeblogicSliceFormPresentation.class;
    }
  }

  private class RepresentWeblogicCreateForm extends RepresentValues<WeblogicCreateForm> {
    protected boolean isIgnore(WeblogicCreateForm prop, Property p) {
      String name = p.getName();
      if ("properties".equals(name) && ListUtils.isEmpty(prop.getProperties())) {
        if (!ListUtils.isEmpty(prop.getSections())) {
          return true;
        } else {
          // Neither properties or sections is specified.  Return an empty properties list.
        }
      }
      if ("sections".equals(name) && ListUtils.isEmpty(prop.getSections())) {
        return true;
      }
      if ("presentation".equals(name) && prop.getPresentation() == null) {
        return true;
      }
      return false;
    }

    @Override
    protected Class<? extends Object> getType() {
      return WeblogicCreateForm.class;
    }
  }

  private class RepresentWeblogicCreateFormPresentation extends RepresentValues<WeblogicCreateFormPresentation> {
    protected boolean isIgnore(WeblogicCreateFormPresentation prop, Property p) {
      String name = p.getName();
      if ("singleColumn".equals(name) && !prop.isSingleColumn()) {
        return true;
      }
      return false;
    }

    @Override
    protected Class<? extends Object> getType() {
      return WeblogicCreateFormPresentation.class;
    }
  }

  private class RepresentWeblogicTable extends RepresentValues<WeblogicTable> {
    protected boolean isIgnore(WeblogicTable prop, Property p) {
      String name = p.getName();
      if ("hiddenColumns".equals(name) && ListUtils.isEmpty(prop.getHiddenColumns())) {
        return true;
      }
      if ("actions".equals(name) && ListUtils.isEmpty(prop.getActions())) {
        return true;
      }
      return false;
    }

    @Override
    protected Class<? extends Object> getType() {
      return WeblogicTable.class;
    }
  }

  private class RepresentFormSection extends RepresentValues<FormSection> {
    protected boolean isIgnore(FormSection prop, Property p) {
      String name = p.getName();
      if ("title".equals(name) && StringUtils.isEmpty(prop.getTitle())) {
        return true;
      }
      if ("introductionHTML".equals(name) && StringUtils.isEmpty(prop.getIntroductionHTML())) {
        return true;
      }
      if ("usedIf".equals(name) && prop.getUsedIf() == null) {
        return true;
      }
      if ("properties".equals(name) && ListUtils.isEmpty(prop.getProperties())) {
        if (!ListUtils.isEmpty(prop.getSections())) {
          return true;
        } else {
          // Neither properties or sections is specified.  Return an empty properties list.
        }
      }
      if ("sections".equals(name) && ListUtils.isEmpty(prop.getSections())) {
        return true;
      }
      return false;
    }

    @Override
    protected Class<? extends Object> getType() {
      return FormSection.class;
    }
  }

  private class RepresentSlice extends RepresentValues<Slice> {
    protected boolean isIgnore(Slice prop, Property p) {
      String name = p.getName();
      if ("pageDescriptionURL".equals(name) && StringUtils.isEmpty(prop.getPageDescriptionURL())) {
        return true;
      }
      if ("slices".equals(name) && ListUtils.isEmpty(prop.getSlices())) {
        return true;
      }
      return false;
    }

    @Override
    protected Class<? extends Object> getType() {
      return Slice.class;
    }
  }

  private class RepresentWeblogicProperty extends RepresentValues<WeblogicProperty> {
    protected boolean isIgnore(WeblogicProperty prop, Property p) {
      String name = p.getName();
      if ("array".equals(name) && !prop.isArray()) {
        return true;
      }
      if ("type".equals(name) && "string".equals(prop.getType())) {
        return true;
      }
      if ("readOnly".equals(name) && !prop.isReadOnly()) {
        return true;
      }
      if ("restartNeeded".equals(name) && !prop.isRestartNeeded()) {
        return true;
      }
      if ("redeployNeeded".equals(name) && !prop.isRedeployNeeded()) {
        return true;
      }
      if ("required".equals(name) && !prop.isRequired()) {
        return true;
      }
      if ("helpSummaryHTML".equals(name) && StringUtils.isEmpty(prop.getHelpSummaryHTML())) {
        return true;
      }
      if ("detailedHelpHTML".equals(name) && StringUtils.isEmpty(prop.getDetailedHelpHTML())) {
        return true;
      }
      if ("usedIf".equals(name) && prop.getUsedIf() == null) {
        return true;
      }
      if ("legalValues".equals(name) && ListUtils.isEmpty(prop.getLegalValues())) {
        return true;
      }
      if ("MBeanInfo".equals(name) && prop.getMBeanInfo() == null) {
        return true;
      }
      if ("presentation".equals(name) && prop.getPresentation() == null) {
        return true;
      }
      return false;
    }

    @Override
    protected Class<? extends Object> getType() {
      return WeblogicProperty.class;
    }
  }

  private class RepresentWeblogicPropertyPresentation extends RepresentValues<WeblogicPropertyPresentation> {
    protected boolean isIgnore(WeblogicPropertyPresentation prop, Property p) {
      String name = p.getName();
      if ("inlineFieldHelp".equals(name) && StringUtils.isEmpty(prop.getInlineFieldHelp())) {
        return true;
      }
      if ("displayAsHex".equals(name) && !prop.isDisplayAsHex()) {
        return true;
      }
      return false;
    }

    @Override
    protected Class<? extends Object> getType() {
      return WeblogicPropertyPresentation.class;
    }
  }

  private class RepresentWeblogicColumn extends RepresentValues<WeblogicColumn> {
    protected boolean isIgnore(WeblogicColumn prop, Property p) {
      String name = p.getName();
      if ("array".equals(name) && !prop.isArray()) {
        return true;
      }
      if ("type".equals(name) && "string".equals(prop.getType())) {
        return true;
      }
      if ("key".equals(name) && !prop.isKey()) {
        return true;
      }
      if ("helpSummaryHTML".equals(name) && StringUtils.isEmpty(prop.getHelpSummaryHTML())) {
        return true;
      }
      if ("detailedHelpHTML".equals(name) && StringUtils.isEmpty(prop.getDetailedHelpHTML())) {
        return true;
      }
      if ("usedIf".equals(name) && prop.getUsedIf() == null) {
        return true;
      }
      if ("legalValues".equals(name) && ListUtils.isEmpty(prop.getLegalValues())) {
        return true;
      }
      if ("MBeanInfo".equals(name) && prop.getMBeanInfo() == null) {
        return true;
      }
      return false;
    }

    @Override
    protected Class<? extends Object> getType() {
      return WeblogicColumn.class;
    }
  }

  private class RepresentWeblogicAction extends RepresentValues<WeblogicAction> {
    protected boolean isIgnore(WeblogicAction prop, Property p) {
      String name = p.getName();
      if ("asynchronous".equals(name) && !prop.isAsynchronous()) {
        return true;
      }
      if ("actions".equals(name) && ListUtils.isEmpty(prop.getActions())) {
        return true;
      }
      return false;
    }

    @Override
    protected Class<? extends Object> getType() {
      return WeblogicAction.class;
    }
  }

  private class RepresentMBeanInfo extends RepresentValues<MBeanInfo> {
    protected boolean isIgnore(MBeanInfo prop, Property p) {
      String name = p.getName();
      if ("path".equals(name) && StringUtils.isEmpty(prop.getPath())) {
        return true;
      }
      if ("javadocHref".equals(name) && StringUtils.isEmpty(prop.getJavadocHref())) {
        return true;
      }
      return false;
    }

    @Override
    protected Class<? extends Object> getType() {
      return MBeanInfo.class;
    }
  }

  private class RepresentUsedIf extends RepresentValues<UsedIf> {
    protected boolean isIgnore(UsedIf prop, Property p) {
      String name = p.getName();
      if ("hide".equals(name) && !prop.isHide()) {
        return true;
      }
      return false;
    }

    @Override
    protected Class<? extends Object> getType() {
      return UsedIf.class;
    }
  }

  private abstract class RepresentValues<T> implements Represent {
    public Node representData(Object data) {
      @SuppressWarnings("unchecked")
      T prop = (T) data;
      Set<Property> props = getProperties(getType());
      Set<Property> validProps = removeIgnoredProps(props, prop);
      return representJavaBean(validProps, data);
    }

    private Set<Property> removeIgnoredProps(Set<Property> props, T prop) {
      Set<Property> validProps = new TreeSet<>();
      for (Property p : props) {
        if (!isIgnore(prop, p)) {
          validProps.add(p);
        }
      }
      return validProps;
    }

    protected abstract Class<? extends Object> getType();

    protected abstract boolean isIgnore(T prop, Property p);
  }
}
