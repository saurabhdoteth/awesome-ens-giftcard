export function matchExact(r: any, str: string) {
  var match = str.match(r);
  return match && str === match[0];
}
