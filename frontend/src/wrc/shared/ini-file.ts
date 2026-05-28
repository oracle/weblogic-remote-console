/**
 * @license UPL-1.0
 * Copyright (c) 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

export function parseIni(content: string): Record<string, any> {
  const result: Record<string, any> = {};
  let currentSection: string | null = null;

  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const trimmedLine = line.trim();

    // Ignore empty lines and comments
    if (!trimmedLine || trimmedLine.startsWith(';') || trimmedLine.startsWith('#')) {
      continue;
    }

    // Section header
    const sectionMatch = trimmedLine.match(/^\[(.+)\]$/);
    if (sectionMatch) {
      currentSection = sectionMatch[1];
      result[currentSection] = {};
      continue;
    }

    // Key-value pair
    const keyValueMatch = trimmedLine.match(/^(.+?)\s*=\s*(.*)$/);
    if (keyValueMatch) {
      const key = keyValueMatch[1].trim();
      const value = keyValueMatch[2].trim();

      if (currentSection) {
        result[currentSection][key] = value;
      } else {
        result[key] = value;
      }
    }
  }

  return result;
}