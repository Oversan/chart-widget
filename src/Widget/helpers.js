export function camelcaseToWords(string){
  return string.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1")
}
