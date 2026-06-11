import { terminal, dsum, terminalGroup } from "./helpers";
import { neighbors } from "./wheel";

export const HORSES = {
  H1: [1, 4, 7],
  H2: [2, 5, 8],
  H3: [3, 6, 9],
};

function camo(n){
  return dsum(n);
}

function addReason(arr,text){
  if(!arr.includes(text)) arr.push(text);
}

function createScore(){
  return {
    score:0,
    reasons:[]
  };
}

function addPoints(obj,pts,reason){
  obj.score += pts;
  addReason(obj.reasons,reason);
}

function familyDominance(nums){

  const families = {};

  nums.slice(0,14).forEach(n=>{

    const t = terminal(n);

    families[t] = (families[t] || 0) + 1;

  });

  const sorted = Object.entries(families)
    .sort((a,b)=>b[1]-a[1]);

  return sorted[0];
}

function horseDominance(nums){

  const counts = {
    H1:0,
    H2:0,
    H3:0
  };

  nums.slice(0,14).forEach(n=>{

    const c = camo(n);

    if(HORSES.H1.includes(c)) counts.H1++;
    if(HORSES.H2.includes(c)) counts.H2++;
    if(HORSES.H3.includes(c)) counts.H3++;

  });

  return Object.entries(counts)
    .sort((a,b)=>b[1]-a[1])[0];
}

function structuralMissing(nums){

  const values = [...new Set(
    nums.slice(0,7).map(camo)
  )];

  const missing=[];

  for(let i=1;i<=9;i++){

    if(!values.includes(i)){
      missing.push(i);
    }

  }

  return {
    existing:values.sort((a,b)=>a-b),
    missing
  };
}

function isNearTerminalNumber(n, target){
  return terminalGroup(target).some(x =>
    neighbors(x,1).includes(n)
  );
}

function mod10(n){
  return ((n % 10) + 10) % 10;
}

function addIfTarget(score,target,value,pts,reason){
  if(target === mod10(value)){
    addPoints(score,pts,reason);
  }
}

function terminalMissingList(numbers,span=7){
  const cams = numbers.slice(0,span).map(camo);
  const missing = [];
  for(let t=0;t<=9;t++){
    if(!cams.includes(t)) missing.push(t);
  }
  return missing;
}

function masterNarrativeScore(target,numbers){
  const score = createScore();

  const last7 = numbers.slice(0,7);
  const last14 = numbers.slice(0,14);
  const cams = last7.map(camo);

  const a = cams[0];
  const b = cams[1];
  const c = cams[2];
  const d = cams[3];

  // 1) Narrativa curta: últimos 2 e 3 números
  addIfTarget(score,target,a+b,22,"Narrativa últimos 2: soma");
  addIfTarget(score,target,Math.abs(a-b),20,"Narrativa últimos 2: diferença");
  addIfTarget(score,target,a+c,16,"Narrativa 1º+3º");
  addIfTarget(score,target,Math.abs(a-c),16,"Narrativa diferença 1º/3º");
  addIfTarget(score,target,b+c,12,"Narrativa 2º+3º");
  addIfTarget(score,target,Math.abs(b-c),12,"Narrativa diferença 2º/3º");

  // 2) Ordem crescente / decrescente nos últimos 3
  if(cams.length >= 3){
    const old3 = [c,b,a]; // antigo -> recente
    const diff1 = old3[1] - old3[0];
    const diff2 = old3[2] - old3[1];

    if(diff1 === diff2 && diff1 !== 0){
      const expected = mod10(old3[2] + diff2);

      if(target === expected){
        if(diff2 > 0){
          addPoints(score,24,"Ordem crescente favorece");
        }else{
          addPoints(score,24,"Ordem decrescente favorece");
        }
      }
    }
  }

  // 3) Alternância A-B-A-B
  if(cams.length >= 4){
    const chronological = [d,c,b,a];

    if(chronological[0] === chronological[2] && chronological[1] === chronological[3]){
      const expected = chronological[0];

      if(target === expected){
        addPoints(score,22,"Alternância matemática favorece");
      }
    }
  }

  // 4) Retorno ao estado inicial
  if(cams.length >= 3){
    if(a === b && target === c){
      addPoints(score,18,"Retorno ao estado inicial");
    }
  }

  // 5) Volta após camuflagem seguida
  // Ex: T5 vinha repetindo, quebra para outro terminal, depois pode voltar T5
  if(cams.length >= 4){
    const oldCluster =
      cams[1] === cams[2] ||
      cams[1] === cams[2] && cams[2] === cams[3];

    if(oldCluster && cams[0] !== cams[1] && target === cams[1]){
      addPoints(score,26,"Volta após camuflagem seguida");
    }
  }

  // 6) Eco terminal recente
  const hits7 = cams.filter(x=>x===target).length;
  if(hits7 >= 2){
    addPoints(score,10,"Eco terminal recente");
  }
  if(hits7 >= 3){
    addPoints(score,18,"Família matemática dominante");
  }

  // 7) Número ausente
  const missing7 = terminalMissingList(numbers,7);
  const missing14 = terminalMissingList(numbers,14);

  if(missing7.includes(target)){
    addPoints(score,4,"Terminal ausente nos últimos 7");
  }

  if(missing14.includes(target)){
    addPoints(score,3,"Terminal ausente estrutural 14");
  }

  // 8) Cavalo curto
  const horse = horseDominance(numbers.slice(0,5));
  if(horse?.[1] >= 2 && HORSES[horse[0]].includes(target)){
    addPoints(score,12,`Cavalo curto ${horse[0]} favorece`);
  }

  // 9) Espelhamento simples
  const mirrorA = mod10(10 - a);
  const mirrorB = mod10(9 - a);

  if(target === mirrorA || target === mirrorB){
    addPoints(score,8,"Espelhamento terminal favorece");
  }
  // 10) Narrativa curta prioritária
  const last3 = cams.slice(0,3);

  const shortSum = dsum(last3[0] + last3[1]);
  const shortDiff = dsum(Math.abs(last3[0] - last3[1]));

  if(target === shortSum){
    addPoints(score,10,"(Narrativa curta prioritária: soma");
  }

  if(target === shortDiff){
    addPoints(score,10,"Narrativa curta prioritária: diferença");
  }

  // 11) Mudança de eixo dominante
  const oldAxis = mostCommon(cams.slice(3,7));
  const newAxis = mostCommon(cams.slice(0,3));

  if(oldAxis !== null && newAxis !== null && oldAxis !== newAxis){
    if(target === newAxis){
      addPoints(score,8,"Mudança de eixo favorece");
    }

    if(target === oldAxis){
      addPoints(score,-4,"Eixo antigo perdeu força");
    }
  }

  // 12) Quebra de dominância
  const olderCluster = cams.slice(2,6);
  const clusterTerminal = mostCommon(olderCluster);
  const clusterHits = olderCluster.filter(x=>x===clusterTerminal).length;

  if(clusterTerminal !== null && clusterHits >= 3 && cams[0] !== clusterTerminal){
    if(target === cams[0]){
      addPoints(score,10,"Quebra de dominância favorece novo terminal");
    }

    if(target === clusterTerminal){
      addPoints(score,-5,"Quebra de dominância contra terminal antigo");
    }
  }
  const gvA = dsum(cams[0] + cams[1]);
  const gvB = dsum(Math.abs(cams[0] - cams[1]));
  const gvC = dsum(cams[1] + cams[2]);
  const gvD = dsum(Math.abs(cams[1] - cams[2]));
  const gvE = dsum(Math.abs(cams[0] - cams[2]));

  if(target === gvA){
    addPoints(score,14,"GV curto A favorece");
  }

  if(target === gvB){
    addPoints(score,18,"GV curto B favorece");
  }

  if(target === gvC){
    addPoints(score,12,"GV curto C favorece");
  }

  if(target === gvD){
    addPoints(score,12,"GV curto D favorece");
  }

  if(target === gvE){
    addPoints(score,10,"GV curto E favorece");
  }
  return score;
}

function timelineQualityScore(numbers){
  const cams = numbers.slice(0,14).map(camo);
  let score = 40;
  const reasons = [];

  const add = (pts, reason) => {
    score += pts;
    if(reason) reasons.push(reason);
  };

  const recent5 = cams.slice(0,5);
  const recent7 = cams.slice(0,7);

  // Repetição estrutural
  const freq = {};
  cams.forEach(t => freq[t] = (freq[t] || 0) + 1);

  const maxHits = Math.max(...Object.values(freq));
  if(maxHits >= 4){
    add(16,"repetição estrutural forte");
  }else if(maxHits >= 3){
    add(10,"repetição estrutural moderada");
  }

  // Alternância A-B-A-B
  if(cams.length >= 4){
    if(cams[0] === cams[2] && cams[1] === cams[3] && cams[0] !== cams[1]){
      add(14,"alternância clara");
    }
  }

  // Progressão / regressão nos últimos 3
  if(cams.length >= 3){
    const a = cams[2];
    const b = cams[1];
    const c = cams[0];

    const d1 = b - a;
    const d2 = c - b;

    if(d1 === d2 && d1 !== 0){
      add(14,d1 > 0 ? "progressão clara" : "regressão clara");
    }
  }

  // Ausente estrutural
  const unique = [...new Set(recent7)];
  if(unique.length >= 5 && unique.length <= 7){
    for(let t=0;t<=9;t++){
      if(!unique.includes(t)){
        add(8,"ausente estrutural identificável");
        break;
      }
    }
  }

  // Convergência recente
  const recentFreq = {};
  recent5.forEach(t => recentFreq[t] = (recentFreq[t] || 0) + 1);
  const recentMax = Math.max(...Object.values(recentFreq));

  if(recentMax >= 3){
    add(14,"convergência forte nos últimos 5");
  }else if(recentMax >= 2){
    add(8,"convergência moderada nos últimos 5");
  }

  // Fragmentação
  if(unique.length >= 7){
    add(-12,"narrativa fragmentada");
  }

  if(maxHits <= 2 && unique.length >= 7){
    add(-10,"pouca repetição estrutural");
  }

  score = Math.max(0,Math.min(100,score));

  const label =
    score >= 75 ? "FORTE" :
    score >= 55 ? "OPERÁVEL" :
    "FRACA";

  return {
    score,
    label,
    reasons
  };
}

function refinementScore(target,numbers){
  const score = createScore();

  const master = masterNarrativeScore(target,numbers);

  score.score += master.score;

  master.reasons.forEach(r=>{
    addReason(score.reasons,r);
  });

  const missing = structuralMissing(numbers);
  if(missing.missing.includes(target) && missing.existing.length >= 4){
    addPoints(score,5,"newAxisúmero Ausente Estrutural favorece");
  }

  const horse = horseDominance(numbers);
  const horseName = horse?.[0];
  const horseHits = horse?.[1] || 0;

  if(horseHits >= 3){
    const horseSet = HORSES[horseName];

    if(horseSet.includes(target)){
      addPoints(score,4,`Cavalo ${horseName} favorece`);
    }else{
      addPoints(score,-3,`Cavalo ${horseName} contradiz`);
    }
  }

  const family = familyDominance(numbers);
  const dominantTerminal = Number(family?.[0]);
  const familyHits = family?.[1] || 0;

  if(familyHits >= 3){
    if(dominantTerminal === target){
      addPoints(score,5,"Família dominante favorece");
    }else{
      addPoints(score,-3,"Família dominante contradiz");
    }
  }

  const previousWindow = numbers.slice(2,7).map(camo);
  const newestWindow = numbers.slice(0,2).map(camo);

  const previousDominant = mostCommon(previousWindow);
  const newestDominant = mostCommon(newestWindow);

  if(previousDominant && newestDominant && previousDominant !== newestDominant){
    if(target === previousDominant){
      addPoints(score,-4,"Mudança de narrativa contra o terminal");
    }

    if(target === newestDominant){
      addPoints(score,10,"Nova narrativa favorece terminal");
    }
  }

  return score;
}

function mostCommon(arr){
  if(!arr || arr.length === 0) return null;

  const counts = {};

  arr.forEach(x=>{
    counts[x] = (counts[x] || 0) + 1;
  });

  return Number(
    Object.entries(counts)
      .sort((a,b)=>b[1]-a[1])[0][0]
  );
}

function chooseMainAndProtection(target, numbers){

  const group = terminalGroup(target);
  const last7 = numbers.slice(0,7);
  const last14 = numbers.slice(0,14);

  // Principal: melhor número dentro do terminal escolhido
  const rankedMain = group.map(n => {
    const heat = last7.filter(x =>
      neighbors(n,1).includes(x)
    ).length;

    const directHit = last14.includes(n) ? 1 : 0;

    return {
      n,
      score: heat * 3 + directHit * 2
    };
  }).sort((a,b)=>b.score-a.score);

  const main = rankedMain[0]?.n ?? group[0];

  // Proteções camufladas reais por terminal
  // Critério: número cuja soma dos dígitos / estrutura matemática conversa com o terminal
  const PROTECTION_CANDIDATES = {
    0: [0],
    1: [12, 21, 10, 23, 32, 34],
    2: [11, 20],
    3: [12, 21, 30],
    4: [13, 22, 31],
    5: [14, 23, 32],
    6: [15, 24, 33],
    7: [16, 25, 34],
    8: [17, 26, 35],
    9: [18, 27, 36]
  };

  const candidates = PROTECTION_CANDIDATES[target] || [];

  const rankedProtection = candidates.map(n => {

    const heat = last7.filter(x =>
      neighbors(n,1).includes(x)
    ).length;

    const camoHits = last7.filter(x =>
      camo(x) === camo(n)
    ).length;

    const recentExact = last14.includes(n) ? 1 : 0;

    const notSameAsMain = n !== main ? 2 : -10;

    const score =
      heat * 3 +
      camoHits * 4 +
      recentExact * 2 +
      notSameAsMain;

    return {
      n,
      score
    };

  }).sort((a,b)=>b.score-a.score);

  const protection =
    rankedProtection[0]?.n ?? candidates[0] ?? null;

  return {
    main,
    protection
  };
}

function classifyDecision(scores,numbers){
  const best = scores[0];
  const second = scores[1];

  if(!best || !second){
    return {
      action:"NO_TRADE",
      reason:"Score insuficiente"
    };
  }

  const margin = best.score - second.score;

  const hasStrongMotor =
    best.reasons.includes("Camuflagem Dupla") ||
    best.reasons.includes("GV365 B") ||
    best.reasons.some(r=>r.includes("Narrativa")) ||
    best.reasons.some(r=>r.includes("Ordem")) ||
    best.reasons.some(r=>r.includes("Alternância")) ||
    best.reasons.some(r=>r.includes("Retorno")) ||
    best.reasons.some(r=>r.includes("Volta após camuflagem")) ||
    best.reasons.some(r=>r.includes("ausente"));

  const contaminated =
    terminal(numbers[0]) === best.terminal;

  const narrativeBreak =
    best.reasons.includes("Mudança de narrativa contra o terminal");

  const familyAgainst =
    best.reasons.includes("Família dominante contradiz");

  const horseAgainst =
    best.reasons.some(r=>r.includes("contradiz"));

  // Anticontaminação só bloqueia se não houver motor forte
  if(contaminated && best.score < 75){
    return {
      action:"NO_TRADE",
      reason:"Anticontaminação sem confirmação suficiente"
    };
  }

  // Mudança de narrativa só bloqueia se não houver motor forte
  if(narrativeBreak && !hasStrongMotor && best.score < 55){
    return {
      action:"NO_TRADE",
      reason:"Mudança de narrativa sem motor matemático"
    };
  }

  // Família + cavalo contra só bloqueiam score fraco
  if((familyAgainst && horseAgainst) && best.score < 35){
    return {
      action:"NO_TRADE",
      reason:"Refinadores contradizem terminal fraco"
    };
  }

  // Bem mais relaxado para laboratório
  if(best.score < 20){
    return {
      action:"NO_TRADE",
      reason:"Score insuficiente"
    };
  }

  if(margin < 0){
    return {
      action:"NO_TRADE",
      reason:"Diferença pequena entre terminais"
    };
  }

  if(!hasStrongMotor && best.score < 35){
    return {
      action:"NO_TRADE",
      reason:"Sem motor principal claro"
    };
  }

  return {
    action:"ENTRY",
    reason:"Convergência matemática forte"
  };
}
function operationalQualityScore(scores,numbers){
  const top1 = scores[0];
  const top2 = scores[1];
  const recentTerminal = terminal(numbers[0]);

  let score = 50;
  const reasons = [];

  const add = (pts, reason) => {
    score += pts;
    if(reason) reasons.push(reason);
  };

  const gap = top1.score - (top2?.score || 0);

  if(gap >= 35){
    add(22,"vantagem clara do terminal vencedor");
  }else if(gap >= 20){
    add(14,"vantagem moderada do terminal vencedor");
  }else if(gap >= 10){
    add(6,"vantagem pequena do terminal vencedor");
  }else{
    add(-18,"terminal vencedor sem folga");
  }

  const strongReasons = [
    "Camuflagem Dupla",
    "GV365 B",
    "Anticontaminação"
  ];

  const strongHits = top1.reasons.filter(r =>
    strongReasons.some(s => r.includes(s))
  ).length;

  if(strongHits >= 3){
    add(22,"motor com 3 pilares alinhados");
  }else if(strongHits === 2){
    add(14,"motor com 2 pilares alinhados");
  }else if(strongHits === 1){
    add(5,"motor com 1 pilar alinhado");
  }else{
    add(-18,"motor sem pilar forte");
  }

  if(top1.terminal === recentTerminal){
    add(-18,"risco de contaminação pelo último número");
  }

  const repetitionOnly =
    top1.reasons.length <= 2 &&
    top1.reasons.some(r => r.toLowerCase().includes("repetição"));

  if(repetitionOnly){
    add(-16,"score apoiado demais em repetição");
  }

  score = Math.max(0,Math.min(100,score));

  const label =
    score >= 78 ? "FORTE" :
    score >= 62 ? "OPERÁVEL" :
    "FRACA";

  return {
    score,
    label,
    reasons
  };
}
function operationalStressScore(scores,numbers,operationalQuality){
  const top1 = scores[0];
  const top2 = scores[1];
  const top3 = scores[2];

  let score = operationalQuality?.score ?? 50;
  const reasons = [...(operationalQuality?.reasons || [])];

  const add = (pts, reason) => {
    score += pts;
    if(reason) reasons.push(reason);
  };

  const gap12 = top1.score - (top2?.score || 0);
  const gap13 = top1.score - (top3?.score || 0);

  const recentTerminal = terminal(numbers[0]);
  const recentTerminals = numbers.slice(0,5).map(terminal);
  const top1RecentHits = recentTerminals.filter(t => t === top1.terminal).length;

  if(gap12 < 10){
    add(-24,"stress: top1 quase empatado com top2");
  }else if(gap12 < 20){
    add(-14,"stress: vantagem frágil do top1");
  }else if(gap12 >= 35){
    add(8,"stress: top1 resistente contra top2");
  }

  if(gap13 < 20){
    add(-12,"stress: top3 ainda ameaça o vencedor");
  }

  if(top1.terminal === recentTerminal){
    add(-22,"stress: risco forte de contaminação pelo último número");
  }

  if(top1RecentHits >= 2){
    add(-18,"stress: terminal vencedor muito presente nos últimos 5");
  }

  if(top1.reasons.length <= 2){
    add(-14,"stress: poucos motivos sustentando o terminal");
  }

  if(top1.score >= 70 && gap12 >= 25 && top1.terminal !== recentTerminal && top1RecentHits <= 1){
    add(14,"stress: leitura robusta");
  }

  score = Math.max(0,Math.min(100,score));

  const label =
    score >= 78 ? "FORTE" :
    score >= 62 ? "OPERÁVEL" :
    "FRACA";

  return {
    score,
    label,
    reasons,
    baseScore: operationalQuality?.score ?? null,
    stress:{
      gap12,
      gap13,
      top1:top1.terminal,
      top2:top2?.terminal,
      top3:top3?.terminal
    }
  };
}

function consistencyScore(scores,numbers){
  const top1 = scores[0];
  const top2 = scores[1];

  let score = 50;
  const reasons = [];

  const add = (pts, reason) => {
    score += pts;
    if(reason) reasons.push(reason);
  };

  const recent = numbers.slice(0,14);
  const recentTerminals = recent.map(terminal);

  const freq = {};
  recentTerminals.forEach(t => {
    freq[t] = (freq[t] || 0) + 1;
  });

  const topHits = freq[top1.terminal] || 0;
  const top2Hits = top2 ? (freq[top2.terminal] || 0) : 0;

  // 1) Top1 aparece de forma consistente na timeline
  if(topHits >= 4){
    add(24,"consistência forte do terminal vencedor");
  }else if(topHits === 3){
    add(14,"consistência moderada do terminal vencedor");
  }else if(topHits === 2){
    add(4,"consistência fraca do terminal vencedor");
  }else{
    add(-18,"terminal vencedor pouco presente na timeline");
  }

  // 2) Top1 não pode estar muito disputado com Top2
  if(top2Hits >= topHits){
    add(-18,"top2 tão presente quanto top1");
  }else if(topHits - top2Hits >= 2){
    add(10,"top1 mais recorrente que top2");
  }

  // 3) Fragmentação: muitos terminais diferentes nos 14
  const uniqueCount = Object.keys(freq).length;

  if(uniqueCount >= 8){
    add(-22,"mesa muito fragmentada");
  }else if(uniqueCount >= 7){
    add(-14,"mesa fragmentada");
  }else if(uniqueCount <= 5){
    add(10,"mesa com boa concentração estrutural");
  }

  // 4) Persistência nos últimos 5
  const last5 = recentTerminals.slice(0,5);
  const last5Hits = last5.filter(t => t === top1.terminal).length;

  if(last5Hits >= 2){
    add(10,"top1 presente nos últimos 5");
  }else{
    add(-8,"top1 ausente dos últimos 5");
  }

  // 5) Penaliza se o terminal vencedor depende só do último número
  const lastTerminal = terminal(numbers[0]);

  if(top1.terminal === lastTerminal && topHits <= 2){
    add(-20,"risco de contaminação pelo último número");
  }

  score = Math.max(0,Math.min(100,score));

  const label =
    score >= 78 ? "FORTE" :
    score >= 62 ? "OPERÁVEL" :
    "FRACA";

  return {
    score,
    label,
    reasons,
    data:{
      topTerminal: top1.terminal,
      topHits,
      top2Terminal: top2?.terminal,
      top2Hits,
      uniqueCount
    }
  };
}
export function analyzeTerminalLabV2(numbers){

  if(!numbers || numbers.length < 14){
    return null;
  }

  const recent = numbers[0];
  const n1 = numbers[1];
  const n2 = numbers[2];

  const scores = [];

  for(let t=0;t<=9;t++){

    const s = createScore();

    // Camuflagem dupla
    const cd = dsum(
      camo(n1) + camo(n2)
    );

    if(cd === t){
      addPoints(s,50,"Camuflagem Dupla");
    }

    // GV365 B
    const gvB = dsum(
      Math.abs(n1 - n2)
    );

    if(gvB === t){
      addPoints(s,35,"GV365 B");
    }

    // Anticontaminação
    if(terminal(recent) !== t){
      addPoints(s,15,"Anticontaminação");
    }

    const ref = refinementScore(t,numbers);

    s.score += ref.score;
    const recentTerminals =
      numbers.slice(0,5).map(camo);

    const t5Overused =
      recentTerminals.filter(x=>x===5).length >= 2;

    if(
      t === 5 &&
      t5Overused &&
      !s.reasons.includes("Camuflagem Dupla") &&
      !s.reasons.includes("GV365 B")
    ){
      addPoints(s,-18,"Filtro anti-vício T5");
    }

    if(
     (t === 0 || t === 8) &&
     !s.reasons.includes("Camuflagem Dupla") &&
     !s.reasons.includes("GV365 B")
    ){
      addPoints(
        s,
        -20,
        "Filtro anti-terminal aberrante"
      );
    }
    ref.reasons.forEach(r=>{
      addReason(s.reasons,r);
    });

    scores.push({
      terminal:t,
      ...s
    });

  }

  scores.sort(
    (a,b)=>b.score-a.score
  );

  scores.sort((a,b)=>b.score-a.score);

  const decision = classifyDecision(scores,numbers);
  const best = scores[0];
  const timelineQuality =
    timelineQualityScore(numbers);
  const operationalQuality =
operationalQualityScore(scores,numbers);
  const operationalStressQuality =
    operationalStressScore(
      scores,
      numbers,
      operationalQuality
    );
  const consistencyQuality =
    consistencyScore(scores,numbers);
  const finalQuality = {
    score: Math.max(
      0,
      Math.min(
        100,
        Math.round(
          operationalStressQuality.score * 0.75 +
          consistencyQuality.score * 0.25
        )
      )
    ),
    label: "",
    reasons: [
      ...(operationalStressQuality.reasons || []),
      ...(consistencyQuality.reasons || [])
    ],
    operationalStressQuality,
    consistencyQuality
  };

  finalQuality.label =
    finalQuality.score >= 78 ? "FORTE" :
    finalQuality.score >= 62 ? "OPERÁVEL" :
    "FRACA";
  if(decision.action === "NO_TRADE"){
    return {
      action:"NO_TRADE",
      reason:decision.reason,
      best,
      timelineQuality,
      operationalQuality,
      operationalStressQuality,
      consistencyQuality,
      finalQuality,
      top3:scores.slice(0,3),
      family:familyDominance(numbers),
      horse:horseDominance(numbers),
      missing:structuralMissing(numbers),
      selected:[],
      entries:[],
      mode:"GV_MASTER_V2"
    };
  }

  const execution = chooseMainAndProtection(best.terminal,numbers);

  return {
    action:"ENTRY",
    stars:"⭐⭐⭐",
    terminal:best.terminal,
    timelineQuality,
    operationalQuality,
    operationalStressQuality,
    consistencyQuality,
    finalQuality,
    main:execution.main,
    protection:execution.protection,
    score:best.score,
    reasons:best.reasons,
    top3:scores.slice(0,3),
    family:familyDominance(numbers),
    horse:horseDominance(numbers),
    missing:structuralMissing(numbers),
    mode:"GV_MASTER_V2",
    selected:[
      {
        label:"A",
        number:execution.main,
        main:execution.main,
        sector:neighbors(execution.main,2),
        nb:neighbors(execution.main,2),
        vc:2,
        str:"s",
        score:best.score,
        reasons:best.reasons
      },
      {
        label:"Proteção",
        number:execution.protection,
        main:execution.protection,
        sector:execution.protection !== null ? neighbors(execution.protection,2) : [],
        nb:execution.protection !== null ? neighbors(execution.protection,2) : [],
        vc:2,
        str:"m",
        score:Math.max(1,best.score-15),
        reasons:["Proteção Camuflada V2"]
      }
    ],
    entries:[
      {
        label:"A",
        number:execution.main,
        main:execution.main,
        sector:neighbors(execution.main,2),
        nb:neighbors(execution.main,2),
        vc:2,
        str:"s",
        score:best.score,
        reasons:best.reasons
      },
      {
        label:"Proteção",
        number:execution.protection,
        main:execution.protection,
        sector:execution.protection !== null ? neighbors(execution.protection,2) : [],
        nb:execution.protection !== null ? neighbors(execution.protection,2) : [],
        vc:2,
        str:"m",
        score:Math.max(1,best.score-15),
        reasons:["Proteção Camuflada V2"]
      }
    ]
  };
  }
