// Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server.providers;

/**
 * This extends the Provider interface for providers that are
 * based on network connections.
*/
public interface ConnectionOrientedProvider extends Provider {
  public boolean isLastConnectionAttemptSuccessful();

  public boolean isAnyConnectionAttemptSuccessful();
}
