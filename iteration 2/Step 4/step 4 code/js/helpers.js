/**
 * degreesToRadians as the name implies
 * @param {Number} degrees The degrees to convert to radians
 */
function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

/**
 * loadNetworkResourceAsText loads server local resource as text data (one large string with newlines)
 * @param {String} resource A path to local resource
 */
async function loadNetworkResourceAsText(resource){
  const response = await fetch(resource);
  const asText = await response.text();
  return asText;
}