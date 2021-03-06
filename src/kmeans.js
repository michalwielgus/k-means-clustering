/**
 * Calculate mean for array of numbers
 * @param {Array.<number>} numbersArray
 * @return {number}
 */
const mean = (numbersArray) =>
  numbersArray.reduce((sum, val) => sum + val, 0) / numbersArray.length;

/**
 * Calculate distance between two points
 * @param {Array.<number>} arrayA
 * @param {Array.<number>} arrayB
 * @returns {number}
 */
const distance = (arrayA, arrayB) => {
  testArray = [5, 2];
  return Math.sqrt(
    arrayA
      .map((aPoint, index) => arrayB[index] - aPoint)
      .reduce((sumOfSquares, diff) => sumOfSquares + diff * diff, 0),
  );
};

class KMeans {
  /**
   * @param k
   * @param data
   */
  constructor(k, data) {
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
  solve(maxIterations = 1000) {
    while (this.iterations < maxIterations) {
      const didAssigmentChange = this.assignPointsToCentroids();
      this.updateCentroidLocations();
      this.calculateError();

      this.iterationLogs[this.iterations] = {
        centroids: [...this.centroids],
        iteration: this.iterations,
        error: this.error,
        didReachSteadyState: !didAssigmentChange,
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
  reset() {
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
  getDimensionality() {
    const point = this.data[0];
    return point.length;
  }

  /**
   * For given dimension rerurns min and max value.
   * Used during random initialization of centroids to ensure
   * that centroids are in range of data.
   * @param n
   * @returns {{min: *, max: *}}
   */
  getRangeForDimension(n) {
    const values = this.data.map((point) => point[n]);

    return {
      min: Math.min.apply(null, values),
      max: Math.max.apply(null, values),
    };
  }

  /**
   * Returns ranges for all dimensions
   * @see getRangeForDimension
   * @returns {dimensionRanges}
   */
  getAllDimensionRanges() {
    const dimensionRanges = [];
    const dimensionality = this.getDimensionality();

    for (let i = 0; i < dimensionality; i += 1) {
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
  initRadomCentroids() {
    const dimensionality = this.getDimensionality();
    const dimensionRanges = this.getAllDimensionRanges();
    const centroids = [];

    for (let i = 0; i < this.k; i += 1) {
      const point = [];

      for (let dimension = 0; dimension < dimensionality; dimension += 1) {
        const { min, max } = dimensionRanges[dimension];
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
  assignPointToCentroid(pointIndex) {
    const lastAssignedCentroid = this.centroidAssigments[pointIndex];
    const point = this.data[pointIndex];
    let minDistance = null;
    let assignedCentroid = null;

    for (let i = 0; i < this.centroids.length; i += 1) {
      const centroid = this.centroids[i];
      const distanceToCentroid = distance((point, centroid));

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
  assignPointsToCentroids() {
    let didAnyPointGetReassigned = false;
    for (let i = 0; i < this.data.length; i += 1) {
      const wasReassigned = this.assignPointToCentroid(i);
      if (wasReassigned) didAnyPointGetReassigned = true;
    }

    return didAnyPointGetReassigned;
  }

  /**
   * For given centroid returns all point assigned to this centroid.
   * @param centroidInex
   * @returns {array}
   */
  getPointsForCentroid(centroidIndex) {
    const points = [];

    for (let i = 0; i < this.data.length; i += 1) {
      const assigment = this.centroidAssigments[i];
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
  updateCentroidLocation(centroidIndex) {
    const thisCentroidPoints = this.getPointsForCentroid(centroidIndex);
    const dimensionality = this.getDimensionality;
    const newCentroid = [];

    for (let i = 0; i < dimensionality; i += 1) {
      newCentroid[i] = mean(thisCentroidPoints.map((point) => point[i]));
    }

    this.centroids[centroidIndex] = newCentroid;
    return newCentroid;
  }

  /**
   * Method calls updateCentroidLocation for all centroids
   */
  updateCentroidLocations() {
    for (let i = 0; i < this.centroids.length; i += 1) {
      this.updateCentroidLocation(i);
    }
  }

  /**
   * Return "error" for actual state of centroids and assignecd points of data.
   * @returns {number}
   */
  callculateError() {
    let sumDistanceSquared = 0;

    for (let i = 0; i < this.data.length; i += 1) {
      const centroidIndex = this.centroidAssigments[i];
      const centroid = this.centroids[centroidIndex];
      const point = this.data[i];
      const thisDistance = distance(point, centroid);
      sumDistanceSquared += thisDistance * thisDistance;
    }

    this.error = Math.sqrt(sumDistanceSquared / this.data.length);
    return this.error;
  }
}
export default KMeans;
