// easing functions from "Tween.js"
module.exports = {
  linear: (n) => {
    return n;
  },
  inQuad: (n) => {
    return n * n;
  },
  outQuad: (n) => {
    return n * (2 - n);
  },
  inOutQuad: (n) => {
    n *= 2;
    if (n < 1) return 0.5 * n * n;
    return - 0.5 * (--n * (n - 2) - 1);
  },
  inCube: (n) => {
    return n * n * n;
  },
  outCube: (n) => {
    return --n * n * n + 1;
  },
  inOutCube: (n) => {
    n *= 2;
    if (n < 1) return 0.5 * n * n * n;
    return 0.5 * ((n -= 2 ) * n * n + 2);
  },
  inQuart: (n) => {
    return n * n * n * n;
  },
  outQuart: (n) => {
    return 1 - (--n * n * n * n);
  },
  inOutQuart: (n) => {
    n *= 2;
    if (n < 1) return 0.5 * n * n * n * n;
    return -0.5 * ((n -= 2) * n * n * n - 2);
  },
  inQuint: (n) => {
    return n * n * n * n * n;
  },
  outQuint: (n) => {
    return --n * n * n * n * n + 1;
  },
  inOutQuint: (n) => {
    n *= 2;
    if (n < 1) return 0.5 * n * n * n * n * n;
    return 0.5 * ((n -= 2) * n * n * n * n + 2);
  },
  inSine: (n) => {
    return 1 - Math.cos(n * Math.PI / 2 );
  },
  outSine: (n) => {
    return Math.sin(n * Math.PI / 2);
  },
  inOutSine: (n) => {
    return .5 * (1 - Math.cos(Math.PI * n));
  },
  inExpo: (n) => {
    return 0 == n ? 0 : Math.pow(1024, n - 1);
  },
  outExpo: (n) => {
    return 1 == n ? n : 1 - Math.pow(2, -10 * n);
  },
  inOutExpo: (n) => {
    if (0 == n) return 0;
    if (1 == n) return 1;
    if ((n *= 2) < 1) return .5 * Math.pow(1024, n - 1);
    return .5 * (-Math.pow(2, -10 * (n - 1)) + 2);
  },
  inCirc: (n) => {
    return 1 - Math.sqrt(1 - n * n);
  },
  outCirc: (n) => {
    return Math.sqrt(1 - (--n * n));
  },
  inOutCirc: (n) => {
    n *= 2
    if (n < 1) return -0.5 * (Math.sqrt(1 - n * n) - 1);
    return 0.5 * (Math.sqrt(1 - (n -= 2) * n) + 1);
  },
  inBack: (n) => {
    var s = 1.70158;
    return n * n * (( s + 1 ) * n - s);
  },
  outBack: (n) => {
    var s = 1.70158;
    return --n * n * ((s + 1) * n + s) + 1;
  },
  inOutBack: (n) => {
    var s = 1.70158 * 1.525;
    if ( ( n *= 2 ) < 1 ) return 0.5 * ( n * n * ( ( s + 1 ) * n - s ) );
    return 0.5 * ( ( n -= 2 ) * n * ( ( s + 1 ) * n + s ) + 2 );
  },

  inElastic: (n) => {
    var s, a = 0.1, p = 0.4;
    if ( n === 0 ) return 0;
    if ( n === 1 ) return 1;
    if ( !a || a < 1 ) { a = 1; s = p / 4; }
    else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
    return - ( a * Math.pow( 2, 10 * ( n -= 1 ) ) * Math.sin( ( n - s ) * ( 2 * Math.PI ) / p ) );
  },
  outElastic: (n) => {
    var s, a = 0.1, p = 0.4;
    if ( n === 0 ) return 0;
    if ( n === 1 ) return 1;
    if ( !a || a < 1 ) { a = 1; s = p / 4; }
    else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
    return ( a * Math.pow( 2, - 10 * n) * Math.sin( ( n - s ) * ( 2 * Math.PI ) / p ) + 1 );
  },
  inOutElastic: (n) => {
    var s, a = 0.1, p = 0.4;
    if ( n === 0 ) return 0;
    if ( n === 1 ) return 1;
    if ( !a || a < 1 ) { a = 1; s = p / 4; }
    else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
    if ( ( n *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( n -= 1 ) ) * Math.sin( ( n - s ) * ( 2 * Math.PI ) / p ) );
    return a * Math.pow( 2, -10 * ( n -= 1 ) ) * Math.sin( ( n - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;
  }
}
// exports.inBounce = function(n){
//   return 1 - exports.outBounce(1 - n);
// };
//
// exports.outBounce = function(n){
//   if ( n < ( 1 / 2.75 ) ) {
//     return 7.5625 * n * n;
//   } else if ( n < ( 2 / 2.75 ) ) {
//     return 7.5625 * ( n -= ( 1.5 / 2.75 ) ) * n + 0.75;
//   } else if ( n < ( 2.5 / 2.75 ) ) {
//     return 7.5625 * ( n -= ( 2.25 / 2.75 ) ) * n + 0.9375;
//   } else {
//     return 7.5625 * ( n -= ( 2.625 / 2.75 ) ) * n + 0.984375;
//   }
// };
//
// exports.inOutBounce = function(n){
//   if (n < .5) return exports.inBounce(n * 2) * .5;
//   return exports.outBounce(n * 2 - 1) * .5 + .5;
// };
