export function terminal(n){
  return Math.abs(n % 10);
}

export function dsum(n){
  let num = Math.abs(n);

  while(num > 9){
    num = num
      .toString()
      .split("")
      .reduce((a,b)=>a+Number(b),0);
  }

  return num;
}

export function terminalGroup(t){
  const arr = [];

  for(let i=t;i<=36;i+=10){
    arr.push(i);
  }

  return arr.filter(n=>n<=36);
}

export function distance(a,b){
  return Math.abs(a-b);
}
