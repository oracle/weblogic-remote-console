// Copyright (c) 2025, Oracle Corporation and/or its affiliates.
// Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.

package weblogic.remoteconsole.server;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

// Note that this is a singleton.  In other words, the assumption is that
// there is only one encryptor, for one user.  There is support for multiple
// sessions, though.  Isn't that a problem?  No, this encryptor/decryptor is
// associated with a CBE that is associated with a particular store.  That
// store has only one encryptor/decryptor.
public final class EncryptDecrypt {
  private static boolean enabled;
  private static Map<String, String> encryptionMap = new HashMap<>();
  private static Map<String, String> decryptionMap = new HashMap<>();
  private static List<Pair> listeners = new LinkedList<>();
  public static final String MESSAGE_PREFIX = "EncryptionService: ";

  public static void init() {
    enabled = true;
  }

  public static boolean isEnabled() {
    return enabled;
  }

  public static String encrypt(String unencrypted, Listener listener) {
    String ret = encryptionMap.get(unencrypted);
    if (ret == null) {
      // send to electron to encrypt
      StdoutRedirector.println(MESSAGE_PREFIX
        + new String(
          Base64.getEncoder().encode(unencrypted.getBytes()), StandardCharsets.ISO_8859_1));
      if (listener != null) {
        listeners.add(new Pair(unencrypted, listener));
      }
    }
    return ret;
  }

  public static void processMessage(String line) {
    line = line.substring(MESSAGE_PREFIX.length());
    String[] strings = line.split(" ");
    if (strings.length != 2) {
      System.err.println("Bad data from electron, the encryption service sent"
        + " a message that looks like this: " + line);
      return;
    }
    String unencrypted = 
      new String(Base64.getDecoder().decode(strings[0]), StandardCharsets.ISO_8859_1);
    if (unencrypted.endsWith("\n")) {
      unencrypted = unencrypted.substring(0, unencrypted.length() - 1);
    }
    String encrypted = 
      new String(Base64.getDecoder().decode(strings[1]), StandardCharsets.ISO_8859_1);
    if (encrypted.endsWith("\n")) {
      encrypted = encrypted.substring(0, encrypted.length() - 1);
    }
    encryptionMap.put(unencrypted, encrypted);
    decryptionMap.put(encrypted, unencrypted);
    for (Pair pair : new LinkedList<Pair>(listeners)) {
      if (pair.unencrypted.equals(unencrypted)) {
        pair.listener.encrypted(unencrypted, encrypted);
        listeners.remove(pair);
      }
    }
  }

  public static String decrypt(String encrypted) {
    return decryptionMap.get(encrypted);
  }

  public static interface Listener {
    public void encrypted(String unencrypted, String encrypted);
  }

  private static class Pair {
    String unencrypted;
    Listener listener;

    Pair(String unencrypted, Listener listener) {
      this.unencrypted = unencrypted;
      this.listener = listener;
    }
  }
}
