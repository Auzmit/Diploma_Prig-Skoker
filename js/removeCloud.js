export default function removeCloud(cloud, arrClouds) {
  // Удаляет DOM
  if (cloud.element && cloud.element.parentNode) {
    cloud.element.parentNode.removeChild(cloud.element);
  }
  // Удаляет из массива первый элемент (самое нижнее облако)
  arrClouds.shift();
}
