import { WHEEL } from "./wheel";

const TIER = new Set([27,13,36,11,30,8,23,10,5,24,16,33]);
const VOIS = new Set([19,4,21,2,25,28,7,18,22]);
const ZERO_BLOCK = new Set([26,3,0,32,15]);

function region(n){
  if(ZERO_BLOCK.has(n)) return "Zero";
  if(TIER.has(n)) return "Tier";
  if(VOIS.has(n)) return "Voisins";
  return "Orph";
}

function wheelPos(n){
  return WHEEL.indexOf(n);
}

function dominantRegion(numbers, span = 8){
  const counts = { Tier:0, Voisins:0, Zero:0, Orph:0 };

  numbers.slice(0, span).forEach(n => {
    counts[region(n)]++;
  });

  return Object.entries(counts).sort((a,b)=>b[1]-a[1])[0][0];
}

function detectMomentum(numbers){
  const last = numbers.slice(0,6);
  const positions = last.map(wheelPos).filter(x => x >= 0);

  if(positions.length < 4){
    return {
      type: "neutral",
      strength: 0,
      message: "Momentum insuficiente."
    };
  }

  let smallMoves = 0;
  let bigMoves = 0;

  for(let i=0;i<positions.length-1;i++){
    const d = Math.abs(positions[i] - positions[i+1]);
    const dist = Math.min(d, 37-d);

    if(dist <= 7) smallMoves++;
    if(dist >= 13) bigMoves++;
  }

  if(smallMoves >= 3){
    return {
      type: "compressed",
      strength: smallMoves,
      message: "Mesa comprimida: tendência de continuidade angular."
    };
  }

  if(bigMoves >= 3){
    return {
      type: "dispersed",
      strength: bigMoves,
      message: "Mesa dispersa: cuidado com quebra de dominância."
    };
  }

  return {
    type: "mixed",
    strength: 1,
    message: "Momentum misto."
  };
}

function detectTransition(numbers){
  const [r,a,b] = numbers;

  if(b === 34 && a === 5){
    return {
      state: "break",
      action: "migrate",
      message: "34→5 detectado: possível quebra Tier/Zero para Voisins lateral."
    };
  }

  if([32,35,15].includes(r)){
    return {
      state: "expansion",
      action: "bridge",
      message: "Eixo Zero/32 pode expandir para Tier superior."
    };
  }

  if(r === 25){
    return {
      state: "migration",
      action: "watch_25_axis",
      message: "25 detectado: observar eixo 25→17→34→6."
    };
  }

  return {
    state: "normal",
    action: "persist",
    message: "Sem quebra estrutural clara."
  };
}

export function analyzeContext(numbers){
  const dom8 = dominantRegion(numbers, 8);
  const dom14 = dominantRegion(numbers, 14);
  const momentum = detectMomentum(numbers);
  const transition = detectTransition(numbers);

  let recommendation = "persist";

  if(transition.action === "migrate"){
    recommendation = "migrate";
  } else if(momentum.type === "dispersed"){
    recommendation = "observe";
  } else if(momentum.type === "compressed"){
    recommendation = "persist";
  }

  return {
    dominant8: dom8,
    dominant14: dom14,
    momentum,
    transition,
    recommendation,
    notes: [
      momentum.message,
      transition.message,
      `Dominância curta: ${dom8}`,
      `Dominância ampla: ${dom14}`
    ]
  };
}