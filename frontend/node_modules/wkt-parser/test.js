import test from 'tape';
import compare from 'js-struct-compare';
import wktParser from './dist/wkt.cjs';
import fixtures from './test-fixtures.json' with {type: 'json'}; //eslint-disable-line

function derivedPropertiesOnly(input) {
  const derivedProperties = (({
    projName,
    axis,
    units,
    to_meter,
    datumCode,
    datum_params,
    nadgrids,
    ellps,
    from_greenwich,
    a,
    rf,
    k0,
    x0,
    y0,
    long0,
    longc,
    lat0,
    lat1,
    lat2,
    lat_ts,
    alpha,
    rectified_grid_angle,
    srsCode,
    name,
    title,
    sphere
  }) => ({
    projName,
    axis,
    units,
    to_meter,
    datumCode,
    datum_params,
    nadgrids,
    ellps,
    from_greenwich,
    a,
    rf,
    k0,
    x0,
    y0,
    long0,
    longc,
    lat0,
    lat1,
    lat2,
    lat_ts,
    alpha,
    rectified_grid_angle,
    srsCode,
    name,
    title,
    sphere
  }))(input);
  for (const key in derivedProperties) {
    if (derivedProperties[key] === undefined) {
      delete derivedProperties[key];
    }
  }
  return derivedProperties;
}

fixtures.forEach((item, i) => {
  test(`fixture ${i + 1}`, t => {
    const got = item.strict ? wktParser(item.code) : derivedPropertiesOnly(wktParser(item.code));
    const expected = item.strict ? item.value : derivedPropertiesOnly(item.value);
    const diff = compare(got, expected);
    if (diff.length > 0) {
      console.log('got', got, 'expected', expected);
    }
    t.deepEqual(diff, []);
    t.end();
  });
});