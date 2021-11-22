// Copyright (c) 2021, Oracle and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.repo;

import java.util.ArrayList;
import java.util.List;

import weblogic.remoteconsole.common.utils.Message;

/**
 * This class holds the response from doing work that may
 * fail in a way that needs to be propagated back to the user
 * as a non-20x Response code.
 * 
 * It collects the overall status and any messages that should be
 * returned to the user.  And, if successful, it holds the data
 * to return to the caller (e.g. the results of searching the bean repo
 * for properties).
 */
public class Response<T> {

  public enum Status {

    // The operation completed normally
    SUCCESS,

    // The top level bean for this page (or one its parent beans) doesn't exist
    NOT_FOUND,

    // problems accessing the bean store, e.g. can't connect to
    // the admin server's WLS REST api, could be because of
    // incorrect connection config or because the server isn't
    // running right now:
    SERVICE_NOT_AVAILABLE,

    // a problem in data that the user entered, e.g. the listen port is too big
    USER_BAD_REQUEST,

    // a problem in data the front end sent that the user did not enter,
    // e.g. a bogus property name, or sending in a boolean as the listen port
    // i.e. there's a bug in the front end
    FRONT_END_BAD_REQUEST
  }

  private List<Message> messages = new ArrayList<>();

  public List<Message> getMessages() {
    return this.messages;
  }

  public Response<T> addFailureMessage(String message) {
    return addMessage(Message.newFailureMessage(message));
  }

  public Response<T> addMessage(Message message) {
    getMessages().add(message);
    return this;
  }

  private Status status = Status.SUCCESS;

  public Status getStatus() {
    return this.status;
  }

  private void setStatus(Status status) {
    setStatus(status, null);
  }

  private void setStatus(Status status, T results) {
    this.status = status;
    this.results = results;
  }

  public boolean isSuccess() {
    return Status.SUCCESS == getStatus();
  }

  public Response<T> setSuccess(T results) {
    setStatus(Status.SUCCESS, results);
    this.results = results;
    return this;
  }

  public boolean isNotFound() {
    return Status.NOT_FOUND == getStatus();
  }

  public Response<T> setNotFound() {
    setStatus(Status.NOT_FOUND);
    return this;
  }

  public boolean isServiceNotAvailable() {
    return Status.SERVICE_NOT_AVAILABLE == getStatus();
  }

  public Response<T> setServiceNotAvailable() {
    setStatus(Status.SERVICE_NOT_AVAILABLE);
    return this;
  }

  public boolean isUserBadRequest() {
    return Status.USER_BAD_REQUEST == getStatus();
  }

  public Response<T> setUserBadRequest() {
    setStatus(Status.USER_BAD_REQUEST);
    return this;
  }

  public boolean isFrontEndBadRequest() {
    return Status.FRONT_END_BAD_REQUEST == getStatus();
  }

  public Response<T> setFrontEndBadRequest() {
    setStatus(Status.FRONT_END_BAD_REQUEST);
    return this;
  }

  public Response<T> copyStatus(Response<?> other) {
    setStatus(other.getStatus());
    return this;
  }

  public Response<T> copyUnsuccessfulResponse(Response<?> other) {
    return copyUnsuccessfulResponse(other, false); // by default, throw away earlier messages
  }

  public Response<T> copyUnsuccessfulResponse(Response<?> other, boolean retainEarlierMessages) {
    if (other.isSuccess()) {
      throw new AssertionError("Other response is successful");
    }
    copyStatus(other);
    if (!retainEarlierMessages) {
      getMessages().clear();
    }
    return copyMessages(other);
  }

  public Response<T> copyMessages(Response<?> other) {
    List<Message> otherMessages = other.getMessages();
    for (Message message: otherMessages) {
      addMessage(message);
    }
    return this;
  }

  private T results;

  public T getResults() {
    return this.results;
  }
}
