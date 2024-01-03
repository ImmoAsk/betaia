function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function replaceSpacesWithDots(inputString) {
    return inputString.replace(/ /g, '.');
}

function replaceSpacesWithAny(inputString,anyThing) {
    return inputString.replace(/ /g, anyThing);
}
function toLowerCaseString(inputString) {
    return inputString.toLowerCase();
  }
export { replaceSpacesWithAny,capitalizeFirstLetter,replaceSpacesWithDots,toLowerCaseString };