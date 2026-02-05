"use strict";

var assert = require("assert"),
    G = require("../geographiclib-geodesic"),
    g = G.Geodesic,
    m = G.Math;

assert.approx = function(x, y, d) {
  assert(Math.abs(x-y) <= d, x + " = " + y + " +/- " + d);
};

assert.sincosCheck = function(v, s, c) {
  assert.strictEqual(v.s, s);
  assert.strictEqual(v.c, c);
};

describe("geodesic", function() {
  describe("SignTest", function () {

    it("check AngRound", function () {
      var eps = Number.EPSILON;
      assert.strictEqual(m.AngRound(-eps/32), -eps/32);
      assert.strictEqual(m.AngRound(-eps/64), -0     );
      assert.strictEqual(m.AngRound(-    0 ), -0     );
      assert.strictEqual(m.AngRound(     0 ), +0     );
      assert.strictEqual(m.AngRound( eps/64), +0     );
      assert.strictEqual(m.AngRound( eps/32), +eps/32);
      assert.strictEqual(m.AngRound((1-2*eps)/64), (1-2*eps)/64);
      assert.strictEqual(m.AngRound((1-eps  )/64),    1     /64);
      assert.strictEqual(m.AngRound((1-eps/2)/64),    1     /64);
      assert.strictEqual(m.AngRound((1-eps/4)/64),    1     /64);
      assert.strictEqual(m.AngRound(   1     /64),    1     /64);
      assert.strictEqual(m.AngRound((1+eps/2)/64),    1     /64);
      assert.strictEqual(m.AngRound((1+eps  )/64),    1     /64);
      assert.strictEqual(m.AngRound((1+2*eps)/64), (1+2*eps)/64);
      assert.strictEqual(m.AngRound((1-eps  )/32), (1-eps  )/32);
      assert.strictEqual(m.AngRound((1-eps/2)/32),    1     /32);
      assert.strictEqual(m.AngRound((1-eps/4)/32),    1     /32);
      assert.strictEqual(m.AngRound(   1     /32),    1     /32);
      assert.strictEqual(m.AngRound((1+eps/2)/32),    1     /32);
      assert.strictEqual(m.AngRound((1+eps  )/32), (1+eps  )/32);
      assert.strictEqual(m.AngRound((1-eps  )/16), (1-eps  )/16);
      assert.strictEqual(m.AngRound((1-eps/2)/16), (1-eps/2)/16);
      assert.strictEqual(m.AngRound((1-eps/4)/16),    1     /16);
      assert.strictEqual(m.AngRound(   1     /16),    1     /16);
      assert.strictEqual(m.AngRound((1+eps/4)/16),    1     /16);
      assert.strictEqual(m.AngRound((1+eps/2)/16),    1     /16);
      assert.strictEqual(m.AngRound((1+eps  )/16), (1+eps  )/16);
      assert.strictEqual(m.AngRound((1-eps  )/ 8), (1-eps  )/ 8);
      assert.strictEqual(m.AngRound((1-eps/2)/ 8), (1-eps/2)/ 8);
      assert.strictEqual(m.AngRound((1-eps/4)/ 8),    1     / 8);
      assert.strictEqual(m.AngRound((1+eps/2)/ 8),    1     / 8);
      assert.strictEqual(m.AngRound((1+eps  )/ 8), (1+eps  )/ 8);
      assert.strictEqual(m.AngRound( 1-eps      ),  1-eps      );
      assert.strictEqual(m.AngRound( 1-eps/2    ),  1-eps/2    );
      assert.strictEqual(m.AngRound( 1-eps/4    ),  1          );
      assert.strictEqual(m.AngRound(   1        ),  1          );
      assert.strictEqual(m.AngRound( 1+eps/4    ),  1          );
      assert.strictEqual(m.AngRound( 1+eps/2    ),  1          );
      assert.strictEqual(m.AngRound( 1+eps      ),  1+  eps    );
      assert.strictEqual(m.AngRound(  90 -64*eps),  90-64*eps  );
      assert.strictEqual(m.AngRound(  90 -32*eps),  90         );
      assert.strictEqual(m.AngRound(  90        ),  90         );
    });

    it("check sincosd", function () {
      var nan = NaN, inf = Infinity, v1, v2, v3;
      assert.sincosCheck(m.sincosd(-inf),nan,nan);
      assert.sincosCheck(m.sincosd(-810), -1, +0);
      assert.sincosCheck(m.sincosd(-720), -0, +1);
      assert.sincosCheck(m.sincosd(-630), +1, +0);
      assert.sincosCheck(m.sincosd(-540), -0, -1);
      assert.sincosCheck(m.sincosd(-450), -1, +0);
      assert.sincosCheck(m.sincosd(-360), -0, +1);
      assert.sincosCheck(m.sincosd(-270), +1, +0);
      assert.sincosCheck(m.sincosd(-180), -0, -1);
      assert.sincosCheck(m.sincosd(- 90), -1, +0);
      assert.sincosCheck(m.sincosd(-  0), -0, +1);
      assert.sincosCheck(m.sincosd(+  0), +0, +1);
      assert.sincosCheck(m.sincosd(+ 90), +1, +0);
      assert.sincosCheck(m.sincosd(+180), +0, -1);
      assert.sincosCheck(m.sincosd(+270), -1, +0);
      assert.sincosCheck(m.sincosd(+360), +0, +1);
      assert.sincosCheck(m.sincosd(+450), +1, +0);
      assert.sincosCheck(m.sincosd(+540), +0, -1);
      assert.sincosCheck(m.sincosd(+630), -1, +0);
      assert.sincosCheck(m.sincosd(+720), +0, +1);
      assert.sincosCheck(m.sincosd(+810), +1, +0);
      assert.sincosCheck(m.sincosd(+inf),nan,nan);
      assert.sincosCheck(m.sincosd( nan),nan,nan);
      v1 = m.sincosd(         9);
      v2 = m.sincosd(        81);
      v3 = m.sincosd(-123456789);
      assert.strictEqual(v1.s,  v2.c);
      assert.strictEqual(v1.s,  v3.s);
      assert.strictEqual(v1.c,  v2.s);
      assert.strictEqual(v1.c, -v3.c);
    });

    it("check atan2d", function () {
      var nan = NaN, inf = Infinity, s;
      assert.strictEqual( m.atan2d(+  0 , -  0 ), +180 );
      assert.strictEqual( m.atan2d(-  0 , -  0 ), -180 );
      assert.strictEqual( m.atan2d(+  0 , +  0 ),   +0 );
      assert.strictEqual( m.atan2d(-  0 , +  0 ),   -0 );
      assert.strictEqual( m.atan2d(+  0 , -  1 ), +180 );
      assert.strictEqual( m.atan2d(-  0 , -  1 ), -180 );
      assert.strictEqual( m.atan2d(+  0 , +  1 ),   +0 );
      assert.strictEqual( m.atan2d(-  0 , +  1 ),   -0 );
      assert.strictEqual( m.atan2d(-  1 , +  0 ),  -90 );
      assert.strictEqual( m.atan2d(-  1 , -  0 ),  -90 );
      assert.strictEqual( m.atan2d(+  1 , +  0 ),  +90 );
      assert.strictEqual( m.atan2d(+  1 , -  0 ),  +90 );
      assert.strictEqual( m.atan2d(+  1 ,  -inf), +180 );
      assert.strictEqual( m.atan2d(-  1 ,  -inf), -180 );
      assert.strictEqual( m.atan2d(+  1 ,  +inf),   +0 );
      assert.strictEqual( m.atan2d(-  1 ,  +inf),   -0 );
      assert.strictEqual( m.atan2d( +inf, +  1 ),  +90 );
      assert.strictEqual( m.atan2d( +inf, -  1 ),  +90 );
      assert.strictEqual( m.atan2d( -inf, +  1 ),  -90 );
      assert.strictEqual( m.atan2d( -inf, -  1 ),  -90 );
      assert.strictEqual( m.atan2d( +inf,  -inf), +135 );
      assert.strictEqual( m.atan2d( -inf,  -inf), -135 );
      assert.strictEqual( m.atan2d( +inf,  +inf),  +45 );
      assert.strictEqual( m.atan2d( -inf,  +inf),  -45 );
      assert.strictEqual( m.atan2d(  nan, +  1 ),  nan );
      assert.strictEqual( m.atan2d(+  1 ,   nan),  nan );
      assert.strictEqual( m.atan2d(s, -1), 180 - m.atan2d(s, 1) );
    });

    it("check sum", function () {
      assert.strictEqual( m.sum(+9, -9).s, +0 );
      assert.strictEqual( m.sum(-9, +9).s, +0 );
      assert.strictEqual( m.sum(-0, +0).s, +0 );
      assert.strictEqual( m.sum(+0, -0).s, +0 );
      assert.strictEqual( m.sum(-0, -0).s, -0 );
      assert.strictEqual( m.sum(+0, +0).s, +0 );
    });

    it("check AngNormalize", function () {
      assert.strictEqual( m.AngNormalize(-900), -180 );
      assert.strictEqual( m.AngNormalize(-720),   -0 );
      assert.strictEqual( m.AngNormalize(-540), -180 );
      assert.strictEqual( m.AngNormalize(-360),   -0 );
      assert.strictEqual( m.AngNormalize(-180), -180 );
      assert.strictEqual( m.AngNormalize(  -0),   -0 );
      assert.strictEqual( m.AngNormalize(  +0),   +0 );
      assert.strictEqual( m.AngNormalize( 180), +180 );
      assert.strictEqual( m.AngNormalize( 360),   +0 );
      assert.strictEqual( m.AngNormalize( 540), +180 );
      assert.strictEqual( m.AngNormalize( 720),   +0 );
      assert.strictEqual( m.AngNormalize( 900), +180 );
    });

    it("check AngDiff", function () {
      var eps = Number.EPSILON, x, y;
      assert.strictEqual( m.AngDiff(+  0, +  0).d,   +0 );
      assert.strictEqual( m.AngDiff(+  0, -  0).d,   -0 );
      assert.strictEqual( m.AngDiff(-  0, +  0).d,   +0 );
      assert.strictEqual( m.AngDiff(-  0, -  0).d,   +0 );
      assert.strictEqual( m.AngDiff(+  5, +365).d,   +0 );
      assert.strictEqual( m.AngDiff(+365, +  5).d,   -0 );
      assert.strictEqual( m.AngDiff(+  5, +185).d, +180 );
      assert.strictEqual( m.AngDiff(+185, +  5).d, -180 );
      assert.strictEqual( m.AngDiff(+eps, +180).d, +180 );
      assert.strictEqual( m.AngDiff(-eps, +180).d, -180 );
      assert.strictEqual( m.AngDiff(+eps, -180).d, +180 );
      assert.strictEqual( m.AngDiff(-eps, -180).d, -180 );
      x = 138 + 128 * eps; y = -164;
      assert.strictEqual( m.AngDiff(x, y).d, 58 - 128 * eps );
    });

    it("azimuth with coincident point on equator", function () {
      var geod = g.WGS84, i, inv,
          // lat1 lat2 azi1/2
          C = [
            [ +0, -0, 180 ],
            [ -0, +0,   0 ]
          ];
      for (i = 0; i < C.length; ++i) {
        inv = geod.Inverse(C[i][0], 0, C[i][1], 0);
        assert.strictEqual(inv.azi1, C[i][2]);
        assert.strictEqual(inv.azi2, C[i][2]);
      }
    });

    it("Direction of nearly antipodal equatorial solution", function () {
      var geod = g.WGS84, i, inv,
          // lat1 lat2 azi1 azi2
          C = [
            [ +0, +0,  56, 124],
            [ -0, -0, 124,  56]
          ];
      for (i = 0; i < C.length; ++i) {
        inv = geod.Inverse(C[i][0], 0, C[i][1], 179.5);
        assert.approx(inv.azi1, C[i][2], 0.5);
        assert.approx(inv.azi2, C[i][3], 0.5);
      }
    });

    it("Direction of the exact antipodal equatorial path", function () {
      var geod = g.WGS84, i, inv,
          // lat1 lat2 lon2 azi1 azi2
          C = [
            [ +0, +0, +180,   +0, +180],
            [ -0, -0, +180, +180,   +0],
            [ +0, +0, -180,   -0, -180],
            [ -0, -0, -180, -180,   -0]
          ];
      for (i = 0; i < C.length; ++i) {
        inv = geod.Inverse(C[i][0], 0, C[i][1], C[i][2]);
        assert.strictEqual(inv.azi1, C[i][3]);
        assert.strictEqual(inv.azi2, C[i][4]);
      }
    });

    it("Antipodal points on the equator with prolate ellipsoid", function () {
      var geod = new g.Geodesic(6.4e6, -1/300), i, inv,
          // lon2 azi1/2
          C = [
            [ +180, +90 ],
            [ -180, -90 ]
          ];
      for (i = 0; i < C.length; ++i) {
        inv = geod.Inverse(0, 0, 0, C[i][0]);
        assert.strictEqual(inv.azi1, C[i][1]);
        assert.strictEqual(inv.azi2, C[i][1]);
      }
    });

    it("Meridional azimuths for the direct problem", function () {
      var geod = g.WGS84, i, dir,
          // azi1, lon2, azi2
          C = [
            [ +0, +180, +180 ],
            [ -0, -180, -180 ],
            [ +180, +180, +0 ],
            [ -180, -180, -0 ]
          ];
      for (i = 0; i < C.length; ++i) {
        dir = geod.Direct(0, 0, C[i][0], 15e6, g.LONG_UNROLL);
        assert.strictEqual(dir.lon2, C[i][1]);
        assert.strictEqual(dir.azi2, C[i][2]);
      }
    });

  });
});
