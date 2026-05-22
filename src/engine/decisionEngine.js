import { neighbors } from "./wheel";
import {
  terminal,
  dsum,
  terminalGroup
} from "./helpers";

function addScore(map, number, pts, reason){

  if(number < 0 || number > 36) return;

  if(!map[number]){
    map[number] = {
      score: 0,
      reasons: []
    };
  }

  map[number].score += pts;

  if(!map[number].reasons.includes(reason)){
    map[number].reasons.push(reason);
  }
}

export function analyze(numbers){

  if(numbers.length < 14){
    return null;
  }

  // esquerda = mais recente
  const recent = numbers[0];

  const prev1 = numbers[1];
  const prev2 = numbers[2];
  const prev3 = numbers[3];

  const scoreMap = {};

  // =========================
  // 3-6-5
  // =========================

  const a = terminal(prev1) + 3;
  const b = terminal(prev2) + 6;
  const c = terminal(prev3) + 5;

  [a,b,c].forEach((v,i)=>{

    const t = dsum(v);

    terminalGroup(t).forEach(n=>{
      addScore(
        scoreMap,
        n,
        5,
        `3-6-5 ${i+1}`
      );
    });
  });

  // =========================
  // GV365
  // =========================

  const gvA = dsum(prev1 + prev2);
  const gvB = dsum(
    Math.abs(prev1 - prev2)
  );

  terminalGroup(gvA).forEach(n=>{
    addScore(scoreMap,n,3,"GV365 A");
  });

  terminalGroup(gvB).forEach(n=>{
    addScore(scoreMap,n,3,"GV365 B");
  });

  // =========================
  // CAMUFLAGEM
  // =========================

  const cam = dsum(
    prev1 + prev2 + prev3
  );

  terminalGroup(cam).forEach(n=>{
    addScore(scoreMap,n,2,"Cam");
  });

  // =========================
  // ORGANIZA
  // =========================

  const ranked = Object
    .entries(scoreMap)
    .map(([n,data])=>({
      number: Number(n),
      ...data
    }))
    .sort((a,b)=>b.score-a.score);

  // =========================
  // PEGA TOP 3
  // =========================

  const selected = [];

  ranked.forEach(item=>{

    if(selected.length >= 3) return;

    const overlap = selected.some(s=>{

      const n1 = neighbors(s.number,2);
      const n2 = neighbors(item.number,2);

      const inter = n1.filter(v=>n2.includes(v));

      return inter.length >= 3;
    });

    if(!overlap){
      selected.push({
        ...item,
        sector: neighbors(item.number,2)
      });
    }
  });

  return {
    recent,
    selected
  };
}
