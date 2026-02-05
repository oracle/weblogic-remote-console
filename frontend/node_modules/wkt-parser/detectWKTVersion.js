/**
 * Detects whether the WKT string is WKT1 or WKT2.
 * @param {string} wkt The WKT string.
 * @returns {string} The detected version ("WKT1" or "WKT2").
 */
export function detectWKTVersion(wkt) {
  // Normalize the WKT string for easier keyword matching
  const normalizedWKT = wkt.toUpperCase();

  // Check for WKT2-specific keywords
  if (
    normalizedWKT.includes('PROJCRS') ||
    normalizedWKT.includes('GEOGCRS') ||
    normalizedWKT.includes('BOUNDCRS') ||
    normalizedWKT.includes('VERTCRS') ||
    normalizedWKT.includes('LENGTHUNIT') ||
    normalizedWKT.includes('ANGLEUNIT') ||
    normalizedWKT.includes('SCALEUNIT')
  ) {
    return 'WKT2';
  }

  // Check for WKT1-specific keywords
  if (
    normalizedWKT.includes('PROJCS') ||
    normalizedWKT.includes('GEOGCS') ||
    normalizedWKT.includes('LOCAL_CS') ||
    normalizedWKT.includes('VERT_CS') ||
    normalizedWKT.includes('UNIT')
  ) {
    return 'WKT1';
  }

  // Default to WKT1 if no specific indicators are found
  return 'WKT1';
}