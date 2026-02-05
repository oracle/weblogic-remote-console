declare class GeodesicClass {
  constructor(a: number, f: number);

  ArcDirect(
    lat1: number,
    lon1: number,
    azi1: number,
    a12: number,
    outmask?: number
  ): {
    lat1: number;
    lon1: number;
    azi1: number;
    a12: number;
  };

  ArcDirectLine(
    lat1: number,
    lon1: number,
    azi1: number,
    a12: number,
    caps?: number
  ): GeodesicLineClass;

  Direct(
    lat1: number,
    lon1: number,
    azi1: number,
    s12: number,
    outmask?: number
  ): {
    lat1: number;
    lon1: number;
    azi1: number;
    s12: number;
    a12: number;
    lat2?: number
    lon2?: number
    azi2?: number
    m12?: number
    M12?: number
    M21?: number
    S12?: number
  };

  DirectLine(
    lat1: number,
    lon1: number,
    azi1: number,
    s12: number,
    caps?: number
  ): GeodesicLineClass;

  GenDirect(
    lat1: number,
    lon1: number,
    azi1: number,
    arcmode: boolean,
    s12_a12: number,
    outmask?: number
  ): {
    lat1: number;
    lon1: number;
    azi1: number;
    s12?: number;
    a12: number;
  };

  GenDirectLine(
    lat1: number,
    lon1: number,
    azi1: number,
    arcmode: boolean,
    s12_a12: number,
    caps?: number
  ): GeodesicLineClass;

  Inverse(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
    outmask?: number
  ): {
    lat1: number;
    lon1: number;
    lat2: number;
    lon2: number;
    a12: number;
    s12?: number;
    azi1?: number
    azi2?: number
    m12?: number
    M12?: number
    M21?: number
    S12?: number
  }

  InverseLine(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
    caps?: number
  ): GeodesicLineClass;

  Polygon(polyline?: boolean): PolygonAreaClass

  readonly a: number;
  readonly f: number;
}

export interface LinePosition {
  lat1: number;
  lon1: number;
  azi1: number;
  a12: number;
  s12?: number;
  lat2?: number;
  lon2?: number;
  azi2?: number;
  m12?: number;
  M12?: number;
  M21?: number;
  S12?: number;
}

declare class GeodesicLineClass {
  constructor(
    geod: GeodesicClass,
    lat1: number,
    lon1: number,
    azi1: number,
    caps?: number,
    salp1?: number,
    calp1?: number
  );

  readonly a: number;
  readonly f: number;
  readonly lat1: number;
  readonly lon1: number;
  readonly azi1: number;
  readonly salp1: number;
  readonly calp1: number;
  readonly s13: number;
  readonly a13: number;
  readonly caps: number;

  GenPosition(arcmode: boolean, s12_a12: number, outmask?: number): LinePosition;
  Position(s12: number, outmask?: number): LinePosition;
  ArcPosition(a12: number, outmask?: number): LinePosition;
  GenSetDistance(arcmode: boolean, s13_a13: number): void;
  SetDistance(s13: number): void;
  SetArc(a13: number): void;
}

export declare const GeodesicLine: {
  GeodesicLine: typeof GeodesicLineClass;
}

interface PolygonAreaResult {
  number: number,
  perimeter: number,
  area?: number
}

declare class PolygonAreaClass {
  constructor(geod: GeodesicClass, polyline?: boolean);

  readonly a: number;
  readonly f: number;
  readonly polyline: boolean;
  readonly num: number;
  readonly lat: number;
  readonly lon: number;

  Clear(): void;
  AddPoint(lat: number, lon: number): void;
  AddEdge(azi: number, s: number): void;
  Compute(reverse: boolean, sign: boolean): PolygonAreaResult;
  TestPoint(lat: number, lon: number, reverse: boolean, sign: boolean): PolygonAreaResult;
  TestEdge(azi: number, s: number, reverse: boolean, sign: boolean): PolygonAreaResult;
}

export declare const PolygonArea: {
  PolygonArea: typeof PolygonAreaClass;
}

export declare const Geodesic: {
  NONE: number
  ARC: number
  LATITUDE: number
  LONGITUDE: number
  AZIMUTH: number
  DISTANCE: number
  STANDARD: number
  DISTANCE_IN: number
  REDUCEDLENGTH: number
  GEODESICSCALE: number
  AREA: number
  ALL: number
  LONG_UNROLL: number
  Geodesic: typeof GeodesicClass,
  WGS84: GeodesicClass
};

export declare const Constants: {
  WGS84: { a: number; f: number }
  version: { major: number; minor: number; patch: number }
  version_string: string;
}

export declare const Math: {
  digits: number;
  epsilon: number;
  degree: number;
  sq(x: number): number;
  hypot(x: number, y:number): number;
  cbrt(x: number): number;
  log1p(x: number): number;
  atanh(x: number): number;
  copysign(x: number, y: number): number;
  sum(u: number, v: number): { s: number, t: number };
  polyval(N: number, p: readonly number[], s: number, x: number): number;
  AngRound(x: number): number;
  remainder(x: number, y: number): number;
  AngNormalize(x: number): number;
  LatFix(x: number): number;
  AngDiff(x: number, y: number): { d: number, e: number };
  sincosd(x: number): { s: number, c: number };
  sincosde(x: number, t: number): { s: number, c: number };
  atan2d(x: number): number;
}

export declare class Accumulator {
  constructor(y?: number | Accumulator);
  Set(y?: number | Accumulator): void;
  Add(y: number): void;
  Sum(y?: number): number;
  Negate(): void;
  Remainder(y: number): void;
}
