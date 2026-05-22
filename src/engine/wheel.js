export const WHEEL = [
  0,32,15,19,4,21,2,25,17,34,6,27,13,36,
  11,30,8,23,10,5,24,16,33,1,20,14,31,
  9,22,18,29,7,28,12,35,3,26
];

export function wheelIndex(n){
  return WHEEL.indexOf(n);
}

export function neighbors(number, size = 2){
  const idx = wheelIndex(number);

  if(idx === -1) return [];

  const arr = [];

  for(let i = -size; i <= size; i++){
    arr.push(
      WHEEL[
        (idx + i + WHEEL.length) % WHEEL.length
      ]
    );
  }

  return arr;
}
