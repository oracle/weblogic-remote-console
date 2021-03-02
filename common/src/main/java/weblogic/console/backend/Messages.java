// Copyright (c) 2020, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.console.backend;

import java.util.ArrayList;
import java.util.List;

/** Represents a container for structures used to relay messages */
public class Messages {
  /**
   * No-arg constructor
   * <p>
   * Creates a new Messages instance with no global or scoped messages
   */
  public Messages() {
    this(new ArrayList<>());
  }

  public Messages(List<Message> messages) {
    this.messages = messages;
  }

  public void add(Message message) {
    this.messages.add(message);
  }

  public List<Message> getMessages() {
    return this.messages;
  }

  // private:
  private final List<Message> messages;
}
