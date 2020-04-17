(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var exampleRandomCentroids = [[1, 12, 24], [5, 4, 16], [3, 0, 25]];

exports.default = {
  exampleRandomCentroids: exampleRandomCentroids
};

},{}],2:[function(require,module,exports){
'use strict';

var _kmeans = require('./kmeans');

var _kmeans2 = _interopRequireDefault(_kmeans);

var _data = require('./data');

var _data2 = _interopRequireDefault(_data);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var init = function init() {
  console.log('K-means clustering');
  console.log('====================================\n');

  console.log('Centroids generate testing');
  console.log('====================================\n');

  var exRandomCentroidsSolver = new _kmeans2.default(2, _data2.default.exampleRandomCentroids);

  console.log('Random generated centroids:');
  console.log(exRandomCentroidsSolver.centroids);
  console.log('\n====================================\n\n');
};

init();

},{"./data":1,"./kmeans":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Calculate mean for array of numbers
 * @param {Array.<number>} numbersArray
 * @return {number}
 */
var mean = function mean(numbersArray) {
  return numbersArray.reduce(function (sum, val) {
    return sum + val;
  }, 0) / numbersArray.length;
};

/**
 * Calculate distance between two points
 * @param {Array.<number>} arrayA
 * @param {Array.<number>} arrayB
 * @return {number}
 */
var distance = function distance(arrayA, arrayB) {
  return Math.sqrt(arrayA.map(function (aPoint, index) {
    return arrayB[index] - aPoint;
  }).reduce(function (sumOfSquares, diff) {
    return sumOfSquares + diff * diff;
  }, 0));
};

var KMeans = function () {
  /**
   * @param k
   * @param data
   */
  function KMeans(k, data) {
    _classCallCheck(this, KMeans);

    this.k = k;
    this.data = data;
    this.reset();
  }

  /**
   * Reset initial state of instance.
   * Use only when you want use the same instance to analyze
   * the same set of data but with new start conditionals.
   */


  _createClass(KMeans, [{
    key: "reset",
    value: function reset() {
      this.error = null;
      this.iterations = 0;
      this.iterationLogs = [];
      this.centroids = this.initRadomCentroids();
      this.centroidAssigments = [];
    }

    /**
     * get number of dimensions in dataset
     * @return {number}
     */

  }, {
    key: "getDimensionality",
    value: function getDimensionality() {
      var point = this.data[0];
      return point.length;
    }

    /**
     * For given dimension rerurns min and max value.
     * Used during random initialization of centroids to ensure
     * that centroids are in range of data.
     * @param n
     * @returns {{min: *, max: *}}
     */

  }, {
    key: "getRangeForDimension",
    value: function getRangeForDimension(n) {
      var values = this.data.map(function (point) {
        return point[n];
      });

      return {
        min: Math.min.apply(null, values),
        max: Math.max.apply(null, values)
      };
    }

    /**
     * Returns ranges for all dimensions
     * @see getRangeForDimension
     * @returns {dimensionRanges}
     */

  }, {
    key: "getAllDimensionRanges",
    value: function getAllDimensionRanges() {
      var dimensionRanges = [];
      var dimensionality = this.getDimensionality();

      for (var i = 0; i < dimensionality; i += 1) {
        dimensionRanges[i] = this.getRangeForDimension(i);
      }

      return dimensionRanges;
    }

    /**
     * Method initialze random centroids
     * @see getAllDimensionRanges
     * @see getAllDimensionRanges
     * @returns {centroidsArray}
     */

  }, {
    key: "initRadomCentroids",
    value: function initRadomCentroids() {
      var dimensionality = this.getDimensionality();
      var dimensionRanges = this.getAllDimensionRanges();
      var centroids = [];

      for (var i = 0; i < this.k; i += 1) {
        var point = [];

        for (var dimension = 0; dimension < dimensionality; dimension += 1) {
          var _dimensionRanges$dime = dimensionRanges[dimension],
              min = _dimensionRanges$dime.min,
              max = _dimensionRanges$dime.max;

          point[dimension] = min + Math.random() * (max - min);
        }

        centroids.push(point);
      }
      return centroids;
    }
  }]);

  return KMeans;
}();

exports.default = KMeans;

},{}]},{},[2]);
