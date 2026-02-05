# JavaScript implementation of the geodesic routines in GeographicLib

This package is a JavaScript implementation of the geodesic routines
from [GeographicLib](https://geographiclib.sourceforge.io).  This solves the
direct and inverse geodesic problems for an ellipsoid of revolution.

Prior to version 2.0.0, this was a component of the [node package
geographiclib](https://www.npmjs.com/package/geographiclib).  As of
version 2.0.0, that package was split into the packages
[geographiclib-geodesic](https://www.npmjs.com/package/geographiclib-geodesic)
(this package) and
[geographiclib-dms](https://www.npmjs.com/package/geographiclib-dms).
[geographiclib](https://www.npmjs.com/package/geographiclib) will be
deprecated on 2023-05-01.

Licensed under the MIT/X11 License; see
[LICENSE.txt](https://geographiclib.sourceforge.io/LICENSE.txt).

## Installation

```bash
$ npm install geographiclib-geodesic
```

## Usage

In [node](https://nodejs.org), do
```javascript
var geodesic = require("geographiclib-geodesic");
```

## Documentation

Full documentation is provided at
[https://geographiclib.sourceforge.io/JavaScript/doc](
https://geographiclib.sourceforge.io/JavaScript/doc/index.html).

## Examples

```javascript
var geodesic = require("geographiclib-geodesic"),
    geod = geodesic.Geodesic.WGS84, r;

// Find the distance from Wellington, NZ (41.32S, 174.81E) to
// Salamanca, Spain (40.96N, 5.50W)...
r = geod.Inverse(-41.32, 174.81, 40.96, -5.50);
console.log("The distance is " + r.s12.toFixed(3) + " m.");
// This prints "The distance is 19959679.267 m."

// Find the point 20000 km SW of Perth, Australia (32.06S, 115.74E)...
r = geod.Direct(-32.06, 115.74, 225, 20000e3);
console.log("The position is (" +
            r.lat2.toFixed(8) + ", " + r.lon2.toFixed(8) + ").");
// This prints "The position is (32.11195529, -63.95925278)."
```

## Authors

* algorithms + js code: Charles Karney (karney@alum.mit.edu)
* node.js port: Yurij Mikhalevich (yurij@mikhalevi.ch)
