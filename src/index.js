import KMeans from './kmeans';
import exampleData from './data';

const init = () => {
  console.log('K-means clustering');
  console.log('====================================\n');

  console.log('Centroids generate testing');
  console.log('====================================\n');

  const exRandomCentroidsSolver = new KMeans(2, exampleData.exampleRandomCentroids);

  console.log('Random generated centroids:');
  console.log(exRandomCentroidsSolver.centroids);
  console.log('\n====================================\n\n');
};

init();
