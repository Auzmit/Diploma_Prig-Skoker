export default function removeCloud(cloud, arrClouds) {
  // Удаляет DOM-элемент облака из родительского элемента
  const cloudsParent = cloud.domElement.parentNode;
  cloudsParent.removeChild(cloud.domElement);
  
  // Удаляет из массива первый элемент (самое нижнее облако)
  // arrClouds.shift();

  const index = arrClouds.indexOf(cloud);
  if (index !== -1) {
    arrClouds.splice(index, 1);
  }
}
