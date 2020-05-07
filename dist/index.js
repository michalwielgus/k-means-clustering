(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var exampleRandomCentroids = [[1, 12, 24], [5, 4, 16], [3, 0, 25]];

var example2d3k = [[1, 2], [2, 3], [2, 5], [1, 6], [4, 6], [3, 5], [2, 4], [4, 3], [5, 2], [6, 9], [4, 4], [3, 3], [8, 6], [7, 5], [9, 6], [9, 7], [8, 8], [7, 9], [11, 3], [11, 2], [9, 9], [7, 8], [6, 8], [12, 2], [14, 3], [15, 1], [15, 4], [14, 2], [13, 1], [16, 4]];

exports.default = {
  exampleRandomCentroids: exampleRandomCentroids,
  example2d3k: example2d3k
};

},{}],2:[function(require,module,exports){
'use strict';

var _kmeans = require('./kmeans');

var _kmeans2 = _interopRequireDefault(_kmeans);

var _data = require('./data');

var _data2 = _interopRequireDefault(_data);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialRandomCentroids = function initialRandomCentroids() {
  console.log('K-means clustering');
  console.log('====================================\n');

  console.log('Centroids generate testing');
  console.log('====================================\n');

  var exRandomCentroidsSolver = new _kmeans2.default(2, _data2.default.exampleRandomCentroids);

  console.log('Random generated centroids:');
  console.log(exRandomCentroidsSolver.centroids);
  console.log('\n====================================\n\n');
};

var resolve = function resolve() {
  console.log('Example resolving: 2-dimensional data, 3 clusters:');
  console.log('====================================\n');

  console.log('Results for example: 2-dimensional data, 3 clusters');
  console.log('\n====================================\n');
  var resolver = new _kmeans2.default(3, _data2.default.example2d3k);
  var centroids = resolver.solve();
  console.log(centroids);
  console.log('');
};

initialRandomCentroids();
resolve();

},{"./data":1,"./kmeans":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
 * @returns {number}
 */
var distance = function distance(arrayA, arrayB) {
  console.log(arrayA, arrayB);
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
   * Method resolves k-means algorithm until stability state, or until maxIterations is reached
   *
   * @param {number}
   * @returns {object}
   */


  _createClass(KMeans, [{
    key: "solve",
    value: function solve() {
      var maxIterations = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1000;

      while (this.iterations < maxIterations) {
        var didAssigmentChange = this.assignPointsToCentroids();
        this.updateCentroidLocations();
        this.calculateError();

        this.iterationLogs[this.iterations] = {
          centroids: [].concat(_toConsumableArray(this.centroids)),
          iteration: this.iterations,
          error: this.error,
          didReachSteadyState: !didAssigmentChange
        };

        if (didAssigmentChange === false) {
          break;
        }

        this.iterations += 1;
      }
      return this.iterationLogs[this.iterationLogs.length - 1];
    }

    /**
     * Reset initial state of instance.
     * Use only when you want use the same instance to analyze
     * the same set of data but with new start conditionals.
     */

  }, {
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

    /**
     * Gets the nearest centroid for given point. Returns boolean that inform if
     * point relation to centroid has been changed
     * @param pointIndex
     * @returns {boolean}
     */

  }, {
    key: "assignPointToCentroid",
    value: function assignPointToCentroid(pointIndex) {
      var lastAssignedCentroid = this.centroidAssigments[pointIndex];
      var point = this.data[pointIndex];
      var minDistance = null;
      var assignedCentroid = null;

      for (var i = 0; i < this.centroids.length; i += 1) {
        var centroid = this.centroids[i];
        var distanceToCentroid = distance((point, centroid));

        if (minDistance === null || distanceToCentroid < minDistance) {
          minDistance = distanceToCentroid;
          assignedCentroid = i;
        }
      }

      this.centroidAssigments[pointIndex] = assignedCentroid;

      return lastAssignedCentroid !== assignedCentroid;
    }

    /**
     * Call assignPoinntToCentroid method for all points of data.
     * Returns information if for any point assigment has changed.
     * @see assignPointToCentroid
     * @returns {boolean}
     */

  }, {
    key: "assignPointsToCentroids",
    value: function assignPointsToCentroids() {
      var didAnyPointGetReassigned = false;
      for (var i = 0; i < this.data.length; i += 1) {
        var wasReassigned = this.assignPointToCentroid(i);
        if (wasReassigned) didAnyPointGetReassigned = true;
      }

      return didAnyPointGetReassigned;
    }

    /**
     * For given centroid returns all point assigned to this centroid.
     * @param centroidInex
     * @returns {array}
     */

  }, {
    key: "getPointsForCentroid",
    value: function getPointsForCentroid(centroidIndex) {
      var points = [];

      for (var i = 0; i < this.data.length; i += 1) {
        var assigment = this.centroidAssigments[i];
        if (assigment === centroidIndex) {
          points.push(this.data[i]);
        }
      }

      return points;
    }

    /**
     * For a given centroids method calculate mean value of sassigned points,
     * and next use it as new coordinates of centroid.
     * @see getPointsForCentroid
     * @param centroidIndex
     * @returns {array}
     */

  }, {
    key: "updateCentroidLocation",
    value: function updateCentroidLocation(centroidIndex) {
      var thisCentroidPoints = this.getPointsForCentroid(centroidIndex);
      var dimensionality = this.getDimensionality;
      var newCentroid = [];

      var _loop = function _loop(i) {
        newCentroid[i] = mean(thisCentroidPoints.map(function (point) {
          return point[i];
        }));
      };

      for (var i = 0; i < dimensionality; i += 1) {
        _loop(i);
      }

      this.centroids[centroidIndex] = newCentroid;
      return newCentroid;
    }

    /**
     * Method calls updateCentroidLocation for all centroids
     */

  }, {
    key: "updateCentroidLocations",
    value: function updateCentroidLocations() {
      for (var i = 0; i < this.centroids.length; i += 1) {
        this.updateCentroidLocation(i);
      }
    }

    /**
     * Return "error" for actual state of centroids and assignecd points of data.
     * @returns {number}
     */

  }, {
    key: "callculateError",
    value: function callculateError() {
      var sumDistanceSquared = 0;

      for (var i = 0; i < this.data.length; i += 1) {
        var centroidIndex = this.centroidAssigments[i];
        var centroid = this.centroids[centroidIndex];
        var point = this.data[i];
        var thisDistance = distance(point, centroid);
        sumDistanceSquared += thisDistance * thisDistance;
      }

      this.error = Math.sqrt(sumDistanceSquared / this.data.length);
      return this.error;
    }
  }]);

  return KMeans;
}();

exports.default = KMeans;

},{}]},{},[2]);
