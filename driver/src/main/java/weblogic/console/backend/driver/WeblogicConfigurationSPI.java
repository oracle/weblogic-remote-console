// Copyright (c) 2020, 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend.driver;

import javax.json.JsonArray;
import javax.json.JsonObject;

import org.glassfish.jersey.media.multipart.FormDataMultiPart;
import weblogic.console.backend.utils.Path;

/**
 * Interface for managing a Weblogic domain's configuration beans.
 * <p>
 * It isolates the console back end from interacting with the beans directly
 * so that we can swap in different implementations 
 * (e.g. online WLS REST, offline WDT, testing mock beans).
 * <p>
 * It uses the Weblogic REST api terms for managing the beans and does not fold the beans.
 * Unlike the WLS REST api, it does not return links.
 * <p>
 * All property values use the WLS REST 'expandedValues' format, e.g.:
 * <pre>listenPort: { set: false, value: 7001 }</pre>
 * <p>
 * Eventually this will be enhanced to support extra per-property values
 * such as the WDT formula for computing the value from tokens.
 * It may also be enhanced to indicate where the value came from
 * (e.g. was the server's listen port configured at the server level or
 * did it inherit it from its server template?).
 * <p>
 * All operations can throw Exception if something unusual occurs
 * The caller should turn these into a 500 response.
 */
public interface WeblogicConfigurationSPI {

  /**
   * This mirrors the WLS REST latest/edit/search api.
   *
   * @param invocationContext the invocation context for this request
   *
   * @param query specifies the 'slice' of the edit bean tree that this operation should return.
   *     It uses the same format as latest/edit/search, minus the 'links' property.
   *
   * @throws Exception if something unexpected happened that the user cannot directly fix.
   *
   * @return a json object containing the search results
   */
  public JsonObject getBeanTreeSlice(InvocationContext invocationContext, JsonObject query) throws Exception;

  /**
   * This mirrors the WLS REST api for getting a bean's, or collection of beans', properties, e.g.
   * <pre>
   * GET .../edit/servers?fields=name,listenPort
   * GET .../edit/servers/Server1
   * </pre>
   *
   * @param invocationContext the invocation context for this request
   *
   * @param beanOrCollection specifies the path of the bean or collection of beans
   *
   * @param properties specifies names of the properties to retrieve.
   *        If none are specified, all properties are returned.
   *
   * @return a json object containing the results, in expended values format.
   *     <p>
   *     Any fields in "properties" that a bean doesn't support are ignored
   *     (v.s. throwing BadRequest)
   *
   * @throws NoDataFoundException
   * 
   * @throws Exception if something unexpected happened that the user cannot directly fix.
   */
  public JsonObject getBeanProperties(
      InvocationContext invocationContext,
      Path beanOrCollection,
      String... properties
  ) throws NoDataFoundException, Exception;

  /**
   * This mirrors the WLS REST api for creating a bean, eg. POST .../edit/servers
   *
   * @param invocationContext the invocation context for this request
   *
   * @param containingProperty the path of the parent bean collection or
   *     singleton property that will contain the new bean
   *
   * @param properties the values to set on the new bean (in expanded values format)
   *     <p>
   *     e.g. to create a server: 
   *     <pre>
   *     parentProperty: [ servers ]
   *     properties: {
   *       name: { value: Server2 },
   *       listenPort: { value: 7777 }
   *     }
   *     </pre>
   *     <p>
   *     e.g. to create a network access point under Server1:
   *     <pre>
   *     parentProperty: [ servers, Server1, networkAccessPoints ]
   *     properties: {
   *       name: { value: Channel1 }
   *     }
   *     </pre>
   *     <p>
   *     e.g. to create an adjudicator under myrealm:
   *     <pre>
   *     parentProperty: [ realms, myrealm, adjudicator ]
   *     properties: {
   *       name: { value: DefaultAdjudicator },
   *       type: { value: weblogic.security.providers.authorization.DefaultAdjudicator }
   *     }
   *     </pre>
   * 
   * @param asynchronous specifies whether the underling WLS REST api is asynchronous
   *
   * @return an array of messages to display to the end user
   *     <p>
   *     If the new bean could be created but there are problems setting any of the field values
   *     (e.g.the listenPort is too big), the operation will still succeed and the other field
   *     values will be set, and the operation will return a list of field-scoped error messages.
   *     <p>
   *     Any fields on "properties" that the new bean doesn't support will be silently ignored
   *     (v.s. throwing BadRequest or returning messages)
   *
   * @throws NoDataFoundException if the parent bean property does not exist
   *
   * @throws BadRequestException if the user is not editing the configuration or
   *     if the bean already exists
   *
   * @throws Exception if something unexpected happened that the user cannot directly fix.
   */
  public JsonArray createBean(
    InvocationContext invocationContext,
    Path containingProperty,
    JsonObject properties,
    boolean asynchronous
  ) throws NoDataFoundException, BadRequestException, Exception;

  /**
   * This mirrors the WLS REST api for creating a bean that uses multi-part form
   * data to upload files from the browser to the admin server's file system,
   * eg. POST .../edit/appDeployments
   *
   * @param invocationContext the invocation context for this request
   *
   * @param containingProperty the path of the parent bean collection or
   *     singleton property that will contain the new bean
   *
   * @param parts the multi-part form data that the WLS REST api requires.
   *        Typically it requires one part that contains a json object with
   *        properties to set on the new bean (with inline values, not expanded values),
   *        and one or more input stream parts for the files to upload to the admin server.
   * 
   * @param asynchronous specifies whether the underling WLS REST api is asynchronous
   *
   * @return an array of messages to display to the end user
   *     <p>
   *     If the new bean could be created but there are problems setting any of the field values
   *     (e.g.the listenPort is too big), the operation will still succeed and the other field
   *     values will be set, and the operation will return a list of field-scoped error messages.
   *     <p>
   *     Any fields on "properties" that the new bean doesn't support will be silently ignored
   *     (v.s. throwing BadRequest or returning messages)
   *
   * @throws NoDataFoundException if the parent bean property does not exist
   *
   * @throws BadRequestException if the user is not editing the configuration or
   *     if the bean already exists
   *
   * @throws Exception if something unexpected happened that the user cannot directly fix.
   */
  public JsonArray createBean(
    InvocationContext invocationContext,
    Path containingProperty,
    FormDataMultiPart parts,
    boolean asynchronous
  ) throws NoDataFoundException, BadRequestException, Exception;

  /**
   * This mirrors the WLS REST api for setting a bean's properties e.g.
   * <pre>POST .../servers/Server1</pre>
   *
   * @param invocationContext the invocation context for this request
   *
   * @param bean specifies the path of the bean that will be modified
   *
   * @param properties specifies the fields change on the bean (in expanded values format), e.g.
   *     <pre>
   *     path: [ servers, Server1 ]
   *     properties: {
   *       enabled: { value: true } // explicitly set 'enabled' to true
   *       listenPort: { set: false } // unset listenPort so that it goes back to its default value
   *     }
   *     </pre>
   *
   * @return an array of messages to display to the end user
   *     <p>
   *     If there are problems setting any of the field values (e.g.the listenPort is too big),
   *     the operation will still succeed and the other field values will be set,
   *     and the operation will return a list of field-scoped error messages.
   *     <p>
   *     Any fields on "properties" that the bean doesn't support will be silently ignored
   *     (v.s. throwing BadRequest or returning messages)
   *
   * @throws NoDataFoundException if the bean does not exist
   * 
   * @throws BadRequestException if the user is not editing the configuration
   * 
   * @throws Exception if something unexpected happened that the user cannot directly fix.
   */
  public JsonArray setBeanProperties(
    InvocationContext invocationContext,
    Path bean,
    JsonObject data
  ) throws NoDataFoundException, BadRequestException, Exception;

  /**
   * This mirrors the WLS REST api for deleting a bean, e.g.
   * <pre>DELETE .../servers/Server1</pre>
   * <p>It also deletes any references to this bean from other beans
   * (v.s. throwing BadRequest)
   *
   * @param invocationContext the invocation context for this request
   * 
   * @param bean specifies the bean that will be deleted e.g.:
   *     <pre>bean: [ servers, Server1 ]</pre>
   * 
   * @param asynchronous specifies whether the underling WLS REST api is asynchronous
   *
   * @throws NoDataFoundException if the bean does not exist
   *
   * @throws BadRequestException if the user is not editing the configuration
   *
   * @throws Exception if something unexpected happened that the user cannot directly fix.
   */
  public void deleteBean(InvocationContext invocationContext, Path bean, boolean asynchronous) throws Exception;

  /**
   * This mirrors the WLS REST api for starting the default edit session, e.g.
   * <pre>POST .../edit/changeManager/startEdit</pre>
   * <p>
   * If the current user doesn't hold the lock, and no one holds the lock, the operation grabs
   * the lock and silently succeeds.
   * <p>
   * If the current user doesn't hold the lock, but another user holds the lock, this operation
   * grabs the lock from the previous user and gives it to the current user.
   * <p>
   * If the current user already holds the lock, this operation does nothing and succeeds.
   *
   * @param invocationContext the invocation context for this request
   * 
   * @throws throws Exception if something unexpected happened that the user cannot directly fix.
   */
  public void startEdit(InvocationContext invocationContext) throws Exception;

  /**
   * Saves the in memory configuration changes to disk (e.g. the pending directory for online WLS),
   * but does not activate them.
   *
   * @throws BadRequestException if the user is not editing the configuration or
   *     if there are any bean validation failures that prevented the changes from being saved.
   *
   * @param invocationContext the invocation context for this request
   *
   * @throws Exception if something unexpected happened that the user cannot directly fix.
   */
  public void saveChanges(InvocationContext invocationContext) throws BadRequestException, Exception;

  /**
   * This mirrors the WLS REST api for saving and activating the default edit session changes, e.g.
   * <pre>POST .../edit/changeManager/activate</pre>
   * <p>
   * If the user holds the lock, all unactivated changes (if any) (in memory and saved)
   * will be activated.
   *
   * @param invocationContext the invocation context for this request
   *
   * @throws BadRequestException if the user is not editing the configuration or
   *     if there are any bean validation failures that prevented the changes from being activated.
   * 
   * @throws Exception if something unexpected happened that the user cannot directly fix.
   */
  public void activate(InvocationContext invocationContext) throws BadRequestException, Exception;

  /**
   * This mirrors the WLS REST api for cancelling the default edit session, e.g.
   * <pre>POST .../edit/changeManager/cancelEdit</pre>
   * <p>
   * If the user holds the lock, all unactivated changes (if any) (in memory and saved)
   * will be discarded.
   * <p>
   * If the user does not hold the lock, the operation will do nothing.
   *
   * @param invocationContext the invocation context for this request
   *
   * @throws Exception if something unexpected happened that the user cannot directly fix.
   */
  public void cancelEdit(InvocationContext invocationContext) throws Exception;

  /**
   * This mirrors the WLS REST api for safe resolving the default edit session, e.g.
   * <pre>POST .../edit/changeManager/cancelEdit</pre>
   * <p>
   * If the user holds the lock, and a merge isn't needed, this operation does nothing.
   * <p>
   * If the user holds the lock, and a merge is needed, and there are no conflicts,
   * the changes will be merged (in memory only).
   *
   * @param invocationContext the invocation context for this request
   *
   * @throws BadRequestException if the user is not editing the configuration or
   *     if the user holds the lock but there are conflicting changes.
   *
   * @throws Exception if something unexpected happened that the user cannot directly fix.
   */
  public void safeResolve(InvocationContext invocationContext) throws BadRequestException, Exception;

  /**
   * This mirrors the WLS REST api for force resolving the default edit session, e.g.
   * <pre>POST .../edit/changeManager/cancelEdit</pre>
   * <p>
   * If the user holds the lock, and a merge isn't needed, this operation does nothing.
   * <p>
   * If the user holds the lock, and a merge is needed, and there are no conflicts,
   * the changes will be merged (in memory only).
   * <p>
   * If the user holds the lock, and a merge is needed, but there are conflicts,
   * then all non-conflicting changes will be merged, and the user's version of
   * conflicting changes will be retained (in memory only).
   *
   * @param invocationContext the invocation context for this request
   *
   * @throws BadRequestException if the user is not editing the configuration.
   *
   * @throws Exception if something unexpected happened that the user cannot directly fix.
   */
  public void forceResolve(InvocationContext invocationContext) throws BadRequestException, Exception;

  /**
   * Registers a listener that gets called when the weblogic configuration changes.
   *
   * @param invocationContext the invocation context for this request
   *
   * @param listener that will be called when the weblogic configuration has changed.
   *
   * @return a registration object that can be used to unregister the listener later
   */
  public WeblogicConfigurationEventListenerRegistration registerConfigurationEventListener(
    InvocationContext invocationContext,
    WeblogicConfigurationEventListener listener
  ) throws Exception;

  // public JsonObject getAllBeansSparse(InvocationContext invocationContext) throws Exception;

  // public JsonObject searchForBeans(InvocationContext invocationContextJsonObject query) throws Exception;
}

// Move this consoleChangeManager info into the javadoc for the search query and responses:

/*
 * This mirrors the WLS REST api for getting the default edit session's status, i.e. GET
 * .../edit/changeManager. It also computes a weblogic configuration version (think of it as a
 * hash of the domain's config directory).
 * <p>
 * If the operation succeeds, "statusCode" will be 200 and "body" will have the following
 * fields:
 * <ul>
 *   <li>
 *     locked - true if a user holds the lock false otherwise
 *   </li>
 *   <li>
 *     mergeNeeded - whether the default edit session needs to catch up to the ast activated changes
 *     <p>
 *     returned regardless of whether the user holds the lock
 *   </li>
 *   <li>
 *     weblogicConfigationVersion - basically a hash of the config directory
 *     <p>
 *     returned regardless of whether the user holds the lock
 *   </li>
 *   <li>
 *     lockOwner - the name of the user who currently holds the lock
 *     <p>
 *     only returned if 'locked' is true
 *   </li>
 *   <li>
 *     hasChanges - whether there are any changes in the default edit session
 *     <p>
 *     only returned if the current user holds the lock
 *     Is this true? What if another user holds the lock?
 *   </li>
 * </ul>
 */

/*
 * Returns the set of changes (in memory and saved) in the default edit session.
 * <p>
 * If the operation succeeds, "statusCode" will be 200 and "body" will have the following fields:
 * <ul>
 *   <li>Document them here once we finalize the design ...</li>
 * </ul>
 * <p>
 * If the current user doesn't hold the default edit session lock, "statusCode" will be 400.
 * Currently returns a 500?
 */
