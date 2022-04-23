
const illegalChars = ['/', ' ', '.', ':', '"', "'", '|'];

export function legalize_name(name) {
  let ans = '';
  for (let i=0; i<name.length; i++) {
    if (!illegalChars.includes(name[i])) {
      ans += name[i];
    }
  }
  return ans;
}




