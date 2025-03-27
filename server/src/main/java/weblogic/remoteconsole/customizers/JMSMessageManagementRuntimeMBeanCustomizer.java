// Copyright (c) 2023, 2025, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.customizers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;

import weblogic.console.utils.Path;
import weblogic.console.utils.StringUtils;
import weblogic.remoteconsole.common.repodef.BeanPropertyDef;
import weblogic.remoteconsole.common.repodef.CustomPagePropertyDef;
import weblogic.remoteconsole.common.repodef.CustomSliceFormDef;
import weblogic.remoteconsole.common.repodef.LocalizedConstants;
import weblogic.remoteconsole.common.repodef.PageDef;
import weblogic.remoteconsole.common.repodef.PagePropertyDef;
import weblogic.remoteconsole.common.repodef.SliceFormDef;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchBuilder;
import weblogic.remoteconsole.server.repo.BeanReaderRepoSearchResults;
import weblogic.remoteconsole.server.repo.BeanSearchResults;
import weblogic.remoteconsole.server.repo.BeanTreePath;
import weblogic.remoteconsole.server.repo.BooleanValue;
import weblogic.remoteconsole.server.repo.DateAsLongValue;
import weblogic.remoteconsole.server.repo.Form;
import weblogic.remoteconsole.server.repo.FormProperty;
import weblogic.remoteconsole.server.repo.IntValue;
import weblogic.remoteconsole.server.repo.InvocationContext;
import weblogic.remoteconsole.server.repo.LongValue;
import weblogic.remoteconsole.server.repo.Option;
import weblogic.remoteconsole.server.repo.Page;
import weblogic.remoteconsole.server.repo.Response;
import weblogic.remoteconsole.server.repo.StringValue;
import weblogic.remoteconsole.server.repo.TableCell;
import weblogic.remoteconsole.server.repo.TableRow;
import weblogic.remoteconsole.server.repo.Value;
import weblogic.remoteconsole.server.repo.weblogic.WebLogicRestInvoker;
import weblogic.remoteconsole.server.webapp.BaseResource;

/** 
 * Custom code for processing the JMSMessageManagementRuntimeMBean
 */
public class JMSMessageManagementRuntimeMBeanCustomizer {

  private static String CONFIGURATION_LOCK = new String();

  // private static Map<Path,MessageFilters> destToMessageFilters = new HashMap<>();

  private static MessageFilters GLOBAL_MESSAGE_FILTERS = new MessageFilters();

  private JMSMessageManagementRuntimeMBeanCustomizer() {
  }

  // Creates the JAXRS resource for either the destinations collection or a destination.
  public static BaseResource createResource(InvocationContext ic) {
    if (ic.getBeanTreePath().isCollectionChild()) {
      return new JMSMessageManagementRuntimeMBeanCollectionChildResource();
    }
    // Use the standard JAXRS resource
    return null;
  }

  // Customizes the PDJ for configuring a destination's message filters
  public static PageDef customizeMessagesFilterSliceDef(InvocationContext ic, PageDef uncustomizedPageDef) {
    // Force all the properties to be writable (otherwise, since we're in the monitoring tree,
    // they're considered read-only regardless of what the PDY says)
    SliceFormDef uncustomizedSliceFormDef = uncustomizedPageDef.asSliceFormDef();
    List<PagePropertyDef> customizedPropertyDefs = new ArrayList<>();
    for (PagePropertyDef uncustomizedPropertyDef : uncustomizedSliceFormDef.getPropertyDefs()) {
      if (uncustomizedPropertyDef.getPropertyName().equals("JMSMessageSelectorFromFilters")) {
        // leave it read-only
        customizedPropertyDefs.add(uncustomizedPropertyDef);
      } else {
        // make it writable
        customizedPropertyDefs.add(
          new CustomPagePropertyDef(uncustomizedPropertyDef).writable(true)
        );
      }
    }
    return new CustomSliceFormDef(uncustomizedSliceFormDef).propertyDefs(customizedPropertyDefs);
  }

  // Customizes the RDJ for configuring a destination's message filters.
  public static void customizeMessagesFilterSlice(InvocationContext ic, Page page) {
    synchronized (CONFIGURATION_LOCK) {
      Form form = page.asForm();
      form.setExists(true);
      // Make it easy to find these properties by name:
      Map<String,PagePropertyDef> nameToPropertyDef = new HashMap<>();
      for (PagePropertyDef propertyDef : page.getPageDef().getAllPropertyDefs()) {
        nameToPropertyDef.put(propertyDef.getFormFieldName(), propertyDef);
      }
      getMessageFilters(ic, false).customizeMessageFiltersSlice(nameToPropertyDef, form);
    }
  }

  // Customizes the exportMessages action input form RDJ
  public static void customizeExportMessagesActionInputForm(InvocationContext ic, Page page) {
    initializeActionInputFormSelector(ic, page);
  }

  // Customizes the deleteMessages action input form RDJ
  public static void customizeDeleteMessagesActionInputForm(InvocationContext ic, Page page) {
    initializeActionInputFormSelector(ic, page);
  }

  // Customizes the moveMessages action input form RDJ
  public static void customizeMoveMessagesActionInputForm(InvocationContext ic, Page page) {
    for (FormProperty property : page.asForm().getProperties()) {
      if ("destinationID".equals(property.getName())) {
        property.setOptions(getAllDestinations(ic));
      }
    }
    initializeActionInputFormSelector(ic, page);
  }

  // Returns all of the JMS destination runtimes in this JMS destination's JMS server
  // on this server (used for moving messages)
  private static List<Option> getAllDestinations(InvocationContext ic) {
    List<Option> destinations = new ArrayList<>();
    // ic's btp =
    // 0 DomainRuntime
    // 1 CombinedServerRuntimes:<ServerName>
    // 2 ServerRuntime
    // 3 JMSRuntime
    // 4 JMSServers:<JMSServerName>
    // 5 Destinations:<DestinationName>
    String serverName = ic.getBeanTreePath().getSegments().get(1).getKey();
    String thisJMSServerName = ic.getBeanTreePath().getSegments().get(4).getKey();
    String thisDestName = ic.getBeanTreePath().getSegments().get(5).getKey();
    // Only consider the JMS servers that are running on this WebLogic server
    // since currently messages may only be moved within the destinations running
    // on the same WebLogic server.
    BeanTreePath jmsServersBTP =
      BeanTreePath.create(
        ic.getBeanTreePath().getBeanRepo(),
        new Path("DomainRuntime")
          .childPath("ServerRuntimes")
          .childPath(serverName)
          .childPath("JMSRuntime")
          .childPath("JMSServers")
      );
    BeanTreePath destsBTP = jmsServersBTP.childPath(new Path("Destinations"));
    BeanPropertyDef destTypePropDef = destsBTP.getTypeDef().getPropertyDef(new Path("DestinationType"));
    BeanPropertyDef destIDPropDef = destsBTP.getTypeDef().getPropertyDef(new Path("DestinationID"));
    BeanReaderRepoSearchBuilder searchBuilder =
      destsBTP.getBeanRepo().asBeanReaderRepo().createSearchBuilder(ic, false);
    searchBuilder.addProperty(destsBTP, destsBTP.getTypeDef().getIdentityPropertyDef());
    searchBuilder.addProperty(destsBTP, destTypePropDef);
    searchBuilder.addProperty(destsBTP, destIDPropDef);
    BeanReaderRepoSearchResults searchResults = searchBuilder.search().getResults();
    Map<String,Option> jmsServerAndDestToOption = new TreeMap<>();
    for (BeanSearchResults jmsServerResults : searchResults.getCollection(jmsServersBTP)) {
      BeanTreePath jmsServerBTP = jmsServerResults.getBeanTreePath();
      String jmsServerName = jmsServerBTP.getLastSegment().getKey();
      BeanTreePath jmsServerDestsBTP = jmsServerBTP.childPath(new Path("Destinations"));
      for (BeanSearchResults destResults : searchResults.getCollection(jmsServerDestsBTP)) {
        BeanTreePath destBTP = destResults.getBeanTreePath();
        String destType = destResults.getValue(destTypePropDef).asString().getValue();
        // Only let the user move the messages to another Queue.
        if ("Queue".equals(destType)) {
          String destName = destBTP.getLastSegment().getKey();
          if (thisJMSServerName.equals(jmsServerName) && thisDestName.equals(destName)) {
            // skip it - no point in moving messages from yourself to yourself
          } else {
            Value destID = destResults.getValue(destIDPropDef);
            String label = jmsServerName + ", " + destName; // Localize?
            Option option = new Option(label, destID);
            String jmsServerAndDest = jmsServerName + "," + destName;
            jmsServerAndDestToOption.put(jmsServerAndDest, option);
          }
        }
      }
    }
    return new ArrayList<>(jmsServerAndDestToOption.values());
  }

  private static void initializeActionInputFormSelector(InvocationContext ic, Page page) {
    synchronized (CONFIGURATION_LOCK) {
      List<FormProperty> properties = page.asForm().getProperties();
      List<FormProperty> newProperties = new ArrayList<>();
      for (FormProperty property : properties) {
        if ("selector".equals(property.getName())) {
          // Initialize the selector to the one that controls which messages are currently displayed
          newProperties.add(
            new FormProperty(
              property.getFieldDef(),
              new StringValue(getMessageFilters(ic, false).getMessageSelector())
            )
          );
        } else {
          newProperties.add(property);
        }
      }
      properties.clear();
      properties.addAll(newProperties);
    }
  }

  public static Response<Void> updateMessageFilters(InvocationContext ic, List<FormProperty> properties) {
    synchronized (CONFIGURATION_LOCK) {
      // Make it easy to find these properties by name:
      Map<String,FormProperty> nameToProperty = new HashMap<>();
      for (FormProperty property : properties) {
        nameToProperty.put(property.getName(), property);
      }
      getMessageFilters(ic, true).updateMessageFilters(nameToProperty);
      return new Response<Void>().setSuccess(null);
    }
  }

  public static void customizeMessagesViewPage(InvocationContext ic, Page page) {
    synchronized (CONFIGURATION_LOCK) {
      JsonObject messages = getMessages(ic);
      List<TableRow> rows = processMessages(messages.getJsonArray("jmsMessages"));
      page.asTable().getRows().addAll(rows);
      page.setLocalizedIntroductionHTML(
        ic.getLocalizer().localizeString(page.getPageDef().getIntroductionHTML())
        + getViewMessagesIntro(
          ic,
          rows.size(),
          messages.getJsonNumber("totalCount").longValueExact(),
          messages.getJsonNumber("totalFilteredCount").longValueExact()
        )
      );
    }
  }

  private static String getViewMessagesIntro(
    InvocationContext ic,
    long returnedMessages,
    long totalUnfilteredMessages,
    long totalFilteredMessages
  ) {
    MessageFilters filters = getMessageFilters(ic, false);
    String messageSelector = filters.getMessageSelector();
    String sortOn = filters.getSortOn();
    boolean ascending = filters.isAscending();
    boolean unfiltered = StringUtils.isEmpty(messageSelector);
    if (totalUnfilteredMessages == 0) {
      return
        ic.getLocalizer().localizeString(
          LocalizedConstants.NO_JMS_MESSAGES
        );
    }
    if (unfiltered) {
      if (returnedMessages == totalUnfilteredMessages) {
        return
          ic.getLocalizer().localizeString(
            LocalizedConstants.ALL_UNFILTERED_JMS_MESSAGES,
            totalUnfilteredMessages
          );
      } else {
        return
          ic.getLocalizer().localizeString(
            LocalizedConstants.SOME_UNFILTERED_JMS_MESSAGES,
            totalUnfilteredMessages,
            returnedMessages,
            sortOn,
            ascending
          );
      }
    } else {
      if (totalFilteredMessages == 0) {
        return
          ic.getLocalizer().localizeString(
            LocalizedConstants.NO_FILTERED_JMS_MESSAGES,
            totalUnfilteredMessages,
            messageSelector
          );
      } else {
        if (returnedMessages == totalFilteredMessages) {
          return
            ic.getLocalizer().localizeString(
              LocalizedConstants.ALL_FILTERED_JMS_MESSAGES,
              totalUnfilteredMessages,
              totalFilteredMessages,
              messageSelector
            );
        } else {
          return
            ic.getLocalizer().localizeString(
              LocalizedConstants.SOME_FILTERED_JMS_MESSAGES,
              totalUnfilteredMessages,
              totalFilteredMessages,
              returnedMessages,
              messageSelector,
              sortOn,
              ascending
            );
        }
      }
    }
  }

  private static JsonObject getMessages(InvocationContext ic) {
    // Either
    //   DomainRuntime.CombinedServerRuntimes.<svr>.ServerRuntime.JMSRuntime.JMSServers.<jmssvr>\
    //    .Destinations.<dest>
    // Or
    //   DomainRuntime.CombinedServerRuntimes.<svr>.ServerRuntime.JMSRuntime.JMSServers.<jmssvr>\
    //    .Destinations.<dest>.DurableSubscribers.<subscriber>
    Path cbePath = ic.getBeanTreePath().getPath();

    // Either
    //   domainRuntime.serverRuntimes.<svr>.JMSRuntime.JMSServers.<jmssvr>.\
    //     destinations.<dest>.getJMSMessages
    // Or
    //   domainRuntime.serverRuntimes.<svr>.JMSRuntime.JMSServers.<jmssvr>.\
    //     destinations.<dest>.durableSubscribers.<subscriber>.getJMSMessages
    Path wlsPath = new Path("domainRuntime.serverRuntimes");
    wlsPath.addComponent(cbePath.getComponents().get(2));
    wlsPath.addComponent("JMSRuntime");
    wlsPath.addComponent("JMSServers");
    wlsPath.addComponent(cbePath.getComponents().get(6));
    wlsPath.addComponent("destinations");
    wlsPath.addComponent(cbePath.getComponents().get(8));
    if (cbePath.length() > 9) {
      wlsPath.addComponent("durableSubscribers");
      wlsPath.addComponent(cbePath.getComponents().get(10));
    }
    wlsPath.addComponent("getJMSMessages");

    JsonObjectBuilder args = Json.createObjectBuilder();
    MessageFilters filters = getMessageFilters(ic, false);
    args.add("selector", StringUtils.nonNull(filters.getMessageSelector()));
    args.add("max", filters.getMax());
    JsonArrayBuilder sortOnArg = Json.createArrayBuilder();
    JsonArrayBuilder ascendingArg = Json.createArrayBuilder();
    String sortOn = filters.getSortOn();
    if (!StringUtils.isEmpty(sortOn)) {
      sortOnArg.add(sortOn);
      ascendingArg.add(filters.isAscending());
    }
    args.add("sortOn", sortOnArg);
    args.add("ascending", ascendingArg);

    JsonObject invokeResponse =
      WebLogicRestInvoker.post(
        ic,
        wlsPath,
        args.build(),
        false, // expanded values
        false, // save changes
        false // asynchronous
       ).getResults();
    return invokeResponse.getJsonObject("return");
  }

  private static List<TableRow> processMessages(JsonArray messages) {
    List<TableRow> rows = new ArrayList<>();
    for (int i = 0; i < messages.size(); i++) {
      rows.add(processMessage(messages.getJsonObject(i)));
    }
    return rows;
  }

  private static TableRow processMessage(JsonObject message) {
    JsonObject metaData = message.getJsonObject("metaData");
    JsonObject header = message.getJsonObject("header");
    TableRow row = new TableRow();
    row.setIdentifier(CustomizerUtils.getStringField(header, "jmsMessageID"));
    row.getCells().add(
      new TableCell(
        "JMSMessageID",
        new StringValue(CustomizerUtils.getStringField(header, "jmsMessageID"))
      )
    );
    row.getCells().add(
      new TableCell(
        "JMSCorrelationID",
        new StringValue(CustomizerUtils.getStringField(header, "jmsCorrelationID"))
      )
    );
    row.getCells().add(
      new TableCell(
        "JMSTimestamp",
        new DateAsLongValue(header.getJsonNumber("jmsTimestamp").longValueExact())
      )
    );
    row.getCells().add(
      new TableCell(
        "State",
        new StringValue(CustomizerUtils.getStringField(metaData, "state"))
      )
    );
    row.getCells().add(
      new TableCell(
        "JMSDeliveryMode",
        new StringValue(CustomizerUtils.getStringField(header, "jmsDeliveryMode"))
      )
    );
    row.getCells().add(
      new TableCell(
        "MessageSize",
        new LongValue(metaData.getJsonNumber("messageSize").longValueExact())
      )
    );
    row.getCells().add(
      new TableCell(
        "JMSType",
        new StringValue(CustomizerUtils.getStringField(header, "jmsType"))
      )
    );
    row.getCells().add(
      new TableCell(
        "JMSPriority",
        new IntValue(header.getInt("jmsPriority"))
      )
    );
    row.getCells().add(
      new TableCell(
        "Xid",
        new StringValue(CustomizerUtils.getStringField(metaData, "xid"))
      )
    );
    row.getCells().add(
      new TableCell(
        "JMSExpiration",
        new DateAsLongValue(header.getJsonNumber("jmsExpiration").longValueExact())
      )
    );
    row.getCells().add(
      new TableCell(
        "JMSRedelivered",
        new BooleanValue(header.getBoolean("jmsRedelivered"))
      )
    );
    row.getCells().add(
      new TableCell(
        "JMSRedeliveryLimit",
        new StringValue(getHeaderProperty(header, "JMS_BEA_RedeliveryLimit"))
      )
    );
    row.getCells().add(
      new TableCell(
        "JMSDeliveryTime",
        new DateAsLongValue(getLongHeaderProperty(header, "JMS_BEA_DeliveryTime"))
      )
    );
    row.getCells().add(
      new TableCell(
        "SequenceNumber",
        new IntValue(metaData.getInt("sequenceNumber"))
      )
    );

    return row;
  }

  private static long getLongHeaderProperty(JsonObject header, String property) {
    String str = getHeaderProperty(header, property);
    if (str == null) {
      return 0;
    }
    try {
      return Long.parseLong(str);
    } catch (NumberFormatException e) {
      throw new AssertionError(property + " must be a long: " + str);
    }
  }

  private static String getHeaderProperty(JsonObject header, String property) {
    JsonArray props = header.getJsonArray("properties");
    for (int i = 0; props != null && i < props.size(); i++) {
      JsonObject prop = props.getJsonObject(i);
      String name = CustomizerUtils.getStringField(prop, "name");
      if (property.equals(name)) {
        return CustomizerUtils.getStringField(prop, "value");
      }
    }
    return null;
  }

  private static MessageFilters getMessageFilters(InvocationContext ic, boolean forUpdate) {
    /*
    Path path = ic.getBeanTreePath().getPath();
    MessageFilters filters = destToMessageFilters.get(path);
    if (filters == null) {
      filters = new MessageFilters();
      if (forUpdate) {
        destToMessageFilters.put(path, filters);
      }
    }
    return filters;
    */
    return GLOBAL_MESSAGE_FILTERS;
  }

  static class MessageFilters {
    private boolean useCustomMessageSelector = false;
    private String customMessageSelector;
    private String sortOn = "JMS_BEA_SequenceNumber";
    private boolean ascending = true;
    private int max = 1000;
    private List<Filter> filters =
      List.of(
        new StringFilter("JMSCorrelationID"),
        new StringFilter("JMSDeliveryMode").value("PERSISTENT"),
        new DateAsLongFilter("JMSDeliveryTime", "JMSDeliveryTime"),
        new DateAsLongFilter("JMSExpiration"),
        new StringFilter("JMSMessageID"),
        new IntFilter("JMSPriority").value(4),
        new BooleanFilter("JMSRedelivered").value(false),
        new IntFilter("JMSRedeliveryLimit", "JMS_BEA_RedeliveryLimit"),
        new DateAsLongFilter("JMSTimestamp"),
        new StringFilter("JMSType"),
        new LongFilter("MessageSize", "JMS_BEA_Size"),
        new StringFilter("State", "JMS_BEA_State").value("visible"),
        new StringFilter("Xid", "JMS_BEA_Xid")
      );

    String getSortOn() {
      return sortOn;
    }

    boolean isAscending() {
      return ascending;
    }

    int getMax() {
      return max;
    }

    String getMessageSelector() {
      return (useCustomMessageSelector) ? customMessageSelector : computeMessageSelectorFromFilters();
    }

    private String computeMessageSelectorFromFilters() {
      boolean addedAFilter = false;
      StringBuilder sb = new StringBuilder();
      for (Filter filter : filters) {
        if (filter.addToSelector()) {
          if (addedAFilter) {
            sb.append(" AND ");
          }
          sb.append(filter.toSelector());
          addedAFilter = true;
        }
      }
      return sb.toString();
    }

    void updateMessageFilters(Map<String,FormProperty> nameToProperty) {
      {
        FormProperty property = nameToProperty.get("UseCustomJMSMessageSelector");
        if (property != null) {
          useCustomMessageSelector = property.getValue().asSettable().getValue().asBoolean().getValue();
        }
      }
      {
        FormProperty property = nameToProperty.get("CustomJMSMessageSelector");
        if (property != null) {
          customMessageSelector = property.getValue().asSettable().getValue().asString().getValue();
        }
      }
      {
        FormProperty property = nameToProperty.get("SortOn");
        if (property != null) {
          sortOn = property.getValue().asSettable().getValue().asString().getValue();
        }
      }
      {
        FormProperty property = nameToProperty.get("Ascending");
        if (property != null) {
          ascending = property.getValue().asSettable().getValue().asBoolean().getValue();
        }
      }
      {
        FormProperty property = nameToProperty.get("MaximumMatches");
        if (property != null) {
          max = property.getValue().asSettable().getValue().asInt().getValue();
        }
      }
      for (Filter filter : filters) {
        filter.updateMessageFilter(nameToProperty);
      }
    }

    void customizeMessageFiltersSlice(Map<String,PagePropertyDef> nameToPropertyDef, Form form) {
      {
        PagePropertyDef propertyDef = nameToPropertyDef.get("UseCustomJMSMessageSelector");
        if (propertyDef != null) {
          form.getProperties().add(new FormProperty(propertyDef, new BooleanValue(useCustomMessageSelector)));
        }
      }
      {
        PagePropertyDef propertyDef = nameToPropertyDef.get("CustomJMSMessageSelector");
        if (propertyDef != null) {
          form.getProperties().add(new FormProperty(propertyDef, new StringValue(customMessageSelector)));
        }
      }
      {
        PagePropertyDef propertyDef = nameToPropertyDef.get("JMSMessageSelectorFromFilters");
        if (propertyDef != null) {
          form.getProperties().add(
            new FormProperty(propertyDef, new StringValue(computeMessageSelectorFromFilters()))
          );
        }
      }
      {
        PagePropertyDef propertyDef = nameToPropertyDef.get("SortOn");
        if (propertyDef != null) {
          form.getProperties().add(new FormProperty(propertyDef, new StringValue(sortOn)));
        }
      }
      {
        PagePropertyDef propertyDef = nameToPropertyDef.get("Ascending");
        if (propertyDef != null) {
          form.getProperties().add(new FormProperty(propertyDef, new BooleanValue(ascending)));
        }
      }
      {
        PagePropertyDef propertyDef = nameToPropertyDef.get("MaximumMatches");
        if (propertyDef != null) {
          form.getProperties().add(new FormProperty(propertyDef, new IntValue(max)));
        }
      }
      for (Filter filter : filters) {
        filter.customizeMessageFiltersSlice(nameToPropertyDef, form);
      }
    }
  }

  abstract static class Filter {
    protected static final String CRITERIA_UNFILTERED = "unfiltered";
    protected static final String CRITERIA_EQUALS = "equals";
    protected static final String CRITERIA_NOT_EQUALS = "notEquals";
    protected static final String CRITERIA_LESS_THAN = "lessThan";
    protected static final String CRITERIA_LESS_THAN_OR_EQUALS = "lessThanOrEquals";
    protected static final String CRITERIA_GREATER_THAN = "greaterThan";
    protected static final String CRITERIA_GREATER_THAN_OR_EQUALS = "greaterThanOrEquals";
    protected static final String CRITERIA_CONTAINS = "contains";
    private String formProperty;
    private String selectorProperty;
    private String criteria = CRITERIA_UNFILTERED;

    protected Filter(String formProperty, String selectorProperty) {
      this.formProperty = formProperty;
      this.selectorProperty = selectorProperty;
    }

    String getCriteria() {
      return criteria;
    }

    String getSelectorProperty() {
      return selectorProperty;
    }

    String getFormProperty() {
      return formProperty;
    }

    boolean addToSelector() {
      return !CRITERIA_UNFILTERED.equals(criteria);
    }

    abstract String toSelector();

    protected AssertionError unsupportedCriteria() {
      return new AssertionError("Unsupported criteria: " + getSelectorProperty() + " " + getCriteria());
    }

    void updateMessageFilter(Map<String,FormProperty> nameToProperty) {
      {
        FormProperty property = nameToProperty.get(getCriteriaFormProperty());
        if (property != null) {
          criteria = property.getValue().asSettable().getValue().asString().getValue();
        }
      }
      {
        FormProperty property = nameToProperty.get(getValueFormProperty());
        if (property != null) {
          updateMessageFilterValue(property.getValue().asSettable().getValue());
        }
      }
    }

    protected abstract void updateMessageFilterValue(Value value);

    void customizeMessageFiltersSlice(Map<String,PagePropertyDef> nameToPropertyDef, Form form) {
      {
        PagePropertyDef propertyDef = nameToPropertyDef.get(getCriteriaFormProperty());
        if (propertyDef != null) {
          form.getProperties().add(new FormProperty(propertyDef, new StringValue(criteria)));
        }
      }
      {
        PagePropertyDef propertyDef = nameToPropertyDef.get(getValueFormProperty());
        if (propertyDef != null) {
          form.getProperties().add(new FormProperty(propertyDef, getFormValue()));
        }
      }
    }

    private String getCriteriaFormProperty() {
      return getFormProperty() + "Criteria";
    }

    private String getValueFormProperty() {
      return getFormProperty() + "Value";
    }

    protected abstract Value getFormValue();
  }

  abstract static class NumberFilter extends Filter {
    NumberFilter(String formProperty, String selectorProperty) {
      super(formProperty, selectorProperty);
    }

    protected abstract String getSelectorValue();

    @Override
    String toSelector() {
      String operator = null;
      if (CRITERIA_EQUALS.equals(getCriteria())) {
        operator = "=";
      } else if (CRITERIA_NOT_EQUALS.equals(getCriteria())) {
        operator = "<>";
      } else if (CRITERIA_LESS_THAN.equals(getCriteria())) {
        operator = "<";
      } else if (CRITERIA_LESS_THAN_OR_EQUALS.equals(getCriteria())) {
        operator = "<=";
      } else if (CRITERIA_GREATER_THAN.equals(getCriteria())) {
        operator = ">";
      } else if (CRITERIA_GREATER_THAN_OR_EQUALS.equals(getCriteria())) {
        operator = ">=";
      } else {
        throw unsupportedCriteria();
      }
      return "( " + getSelectorProperty() + " " + operator + " " + getSelectorValue() + " )";
    }
  }

  static class LongFilter extends NumberFilter {
    private long value;

    LongFilter(String property) {
      this(property, property);
    }

    LongFilter(String formProperty, String selectorProperty) {
      super(formProperty, selectorProperty);
    }

    long getValue() {
      return value;
    }

    LongFilter value(long val) {
      value = val;
      return this;
    }

    @Override
    protected String getSelectorValue() {
      return "" + value;
    }

    @Override
    protected void updateMessageFilterValue(Value val) {
      value = val.asLong().getValue();
    }

    @Override
    protected Value getFormValue() {
      return new LongValue(value);
    }
  }

  static class DateAsLongFilter extends LongFilter {

    DateAsLongFilter(String property) {
      this(property, property);
    }

    DateAsLongFilter(String formProperty, String selectorProperty) {
      super(formProperty, selectorProperty);
      value(System.currentTimeMillis());
    }

    @Override
    String toSelector() {
      // JMS selectors compare date down to the millisecond.
      // The remote console trims dates to the second.
      // Compensate for that here.
      // For example, convert 'equals' to greater or equal to the specified
      // date's second and less than the next second.

      // Rely on the unmarshalling code receiving a string form of
      // the date that's to the second, therefore its long value has no milliseconds
      long thisSecondInMillis = super.getFormValue().asLong().getValue();
      long nextSecondInMillis = thisSecondInMillis + 1000;

      if (CRITERIA_EQUALS.equals(getCriteria())) {
        return
          "( "
            + "( " + getSelectorProperty() + " >= " + thisSecondInMillis + " )"
            + " AND "
            + "( " + getSelectorProperty() + " < " + nextSecondInMillis + " )"
            + " )";
      } else if (CRITERIA_NOT_EQUALS.equals(getCriteria())) {
        return
          "( "
            + "( " + getSelectorProperty() + " < " + thisSecondInMillis + " )"
            + " OR "
            + "( " + getSelectorProperty() + " >= " + nextSecondInMillis + " )"
            + " )";
      } else if (CRITERIA_LESS_THAN.equals(getCriteria())) {
        return "( " + getSelectorProperty() + " < " + thisSecondInMillis + " )";
      } else if (CRITERIA_LESS_THAN_OR_EQUALS.equals(getCriteria())) {
        return "( " + getSelectorProperty() + " < " + nextSecondInMillis + " )";
      } else if (CRITERIA_GREATER_THAN.equals(getCriteria())) {
        return "( " + getSelectorProperty() + " >= " + nextSecondInMillis + " )";
      } else if (CRITERIA_GREATER_THAN_OR_EQUALS.equals(getCriteria())) {
        return "( " + getSelectorProperty() + " >= " + thisSecondInMillis + " )";
      } else {
        throw unsupportedCriteria();
      }
    }

    @Override
    protected void updateMessageFilterValue(Value val) {
      super.updateMessageFilterValue(val.asDateAsLong().asLong());
    }

    @Override
    protected Value getFormValue() {
      return new DateAsLongValue(super.getFormValue().asLong().getValue());
    }
  }

  static class IntFilter extends NumberFilter {
    private int value;

    IntFilter(String property) {
      this(property, property);
    }

    IntFilter(String formProperty, String selectorProperty) {
      super(formProperty, selectorProperty);
    }

    int getValue() {
      return value;
    }

    IntFilter value(int val) {
      value = val;
      return this;
    }

    @Override
    protected String getSelectorValue() {
      return "" + value;
    }

    @Override
    protected void updateMessageFilterValue(Value val) {
      value = val.asInt().getValue();
    }

    @Override
    protected Value getFormValue() {
      return new IntValue(value);
    }
  }

  static class BooleanFilter extends Filter {
    private boolean value;

    BooleanFilter(String property) {
      this(property, property);
    }

    BooleanFilter(String formProperty, String selectorProperty) {
      super(formProperty, selectorProperty);
    }

    boolean getValue() {
      return value;
    }

    BooleanFilter value(boolean val) {
      value = val;
      return this;
    }

    @Override
    String toSelector() {
      if (CRITERIA_EQUALS.equals(getCriteria())) {
        String selectorValue = (value) ? "TRUE" : "FALSE";
        return "( " + getSelectorProperty() + " = " + selectorValue + " )";
      } else {
        throw unsupportedCriteria();
      }
    }

    @Override
    protected void updateMessageFilterValue(Value val) {
      value = val.asBoolean().getValue();
    }

    @Override
    protected Value getFormValue() {
      return new BooleanValue(value);
    }
  }

  static class StringFilter extends Filter {
    private String value;

    StringFilter(String property) {
      this(property, property);
    }

    StringFilter(String formProperty, String selectorProperty) {
      super(formProperty, selectorProperty);
    }

    String getValue() {
      return value;
    }

    StringFilter value(String val) {
      value = val;
      return this;
    }

    @Override
    String toSelector() {
      String selectorValue = StringUtils.nonNull(value).replaceAll("'", "''");
      if (CRITERIA_EQUALS.equals(getCriteria())) {
        return "( " + getSelectorProperty() + " = '" + selectorValue + "' )";
      } else if (CRITERIA_NOT_EQUALS.equals(getCriteria())) {
        return "( " + getSelectorProperty() + " <> '" + selectorValue + "' )";
      } else if (CRITERIA_CONTAINS.equals(getCriteria())) {
        return "( " + getSelectorProperty() + " LIKE '%" + selectorValue + "%' )";
      } else {
        throw unsupportedCriteria();
      }
    }

    @Override
    protected void updateMessageFilterValue(Value val) {
      value = val.asString().getValue();
    }

    @Override
    protected Value getFormValue() {
      return new StringValue(value);
    }
  }
}
