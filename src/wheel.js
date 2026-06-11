import { analyzeTerminalLabV2 } from "./terminalLabV2";
import { analyzeContext } from "./contextEngine";
import { WHEEL, neighbors } from "./wheel";
import { terminal, dsum, terminalGroup } from "./helpers";

const TIER = new Set([27,13,36,11,30,8,23,10,5,24,16,33]);
const VOIS = new Set([19,4,21,2,25,28,7,18,22]);
const ZERO_BLOCK = [26,3,0,32,15];

const BRIDGE_RIGHT = [14,20,1,33,16];
const TIER_TOP = [30,8,23,10,5,24];
const VOIS_LEFT = [19,4,21,2,25,18,22,9,31,14];

function addScore(map,n,pts,reason){
  if(n<0||n>36)return;
  if(!map[n]) map[n]={score:0,reasons:[]};
  map[n].score+=pts;
  if(!map[n].reasons.includes(reason)) map[n].reasons.push(reason);
}

function wheelPos(n){return WHEEL.indexOf(n);}
function wheelDistance(a,b){
  const pa=wheelPos(a), pb=wheelPos(b);
  if(pa<0||pb<0)return 99;
  const d=Math.abs(pa-pb);
  return Math.min(d,WHEEL.length-d);
}
function overlap(a,b){return a.filter(x=>b.includes(x)).length;}

function region(n){
  if(ZERO_BLOCK.includes(n)) return "Zero";
  if(TIER.has(n)) return "Tier";
  if(VOIS.has(n)) return "Voisins";
  return "Orph";
}

function side(n){
  if([26,3,0,32,15,19,4,21,2,25,17,34,6].includes(n)) return "left";
  if([14,20,1,33,16,24,5,10,23,8,30,11,36,13,27].includes(n)) return "right";
  return "mid";
}

function sectorHits(nums,center,span=14){
  const sec=neighbors(center,2);
  return nums.slice(0,span).filter(n=>sec.includes(n)).length;
}

function dominantRegion(nums,span=8){
  const c={Tier:0,Voisins:0,Zero:0,Orph:0};
  nums.slice(0,span).forEach(n=>c[region(n)]++);
  return Object.entries(c).sort((a,b)=>b[1]-a[1])[0][0];
}

function build(item,label){
  const sector=neighbors(item.number,2);
  return {
    label,
    number:item.number,
    main:item.number,
    sector,
    nb:sector,
    vc:2,
    str:item.score>=20?"s":item.score>=12?"m":"n",
    score:item.score,
    reasons:item.reasons.slice(0,7)
  };
}

function tooClose(item,selected){
  return selected.some(s=>{
    const d=wheelDistance(item.number,s.number);
    const ov=overlap(neighbors(item.number,2),s.sector);
    const sameCorridor = side(item.number) === side(s.number) && d <= 7;
    return d<=5 || ov>=2 || sameCorridor;
  });
}

function addFlow(scoreMap,nums,notes){
  const r=nums[0];

  const flows=[
    {keys:[36,11,30,13,27], boost:[30,11,36,13,27,8,23], name:"Tier clássico"},
    {keys:[13], boost:[30,11,36,13,27,6,34], name:"Retorno Tier via 13"},
    {keys:[23,10,5,24,8], boost:[10,5,24,8,23,16,33], name:"Tier superior"},
    {keys:[14,20,33,16,1], boost:[14,20,1,33,16,31,9], name:"Ponte direita 14/20/33"},
    {keys:[32,0,15,3,26,35], boost:[26,3,0,32,15,12,35,23,10], name:"Zero/32 expansão"},
    {keys:[25,17,34,6,2], boost:[2,25,17,34,6,13,27], name:"Migração 25/17/34"},
    {keys:[29,7,28,12,18], boost:[18,29,7,28,12,22], name:"Voisins 29/7/28"},
    {keys:[21,19,4,22,31,9,28,29], boost:[19,4,21,2,25,18,22,9,31,14,28,29], name:"Voisins lateral"}
  ];

  flows.forEach(f=>{
    if(f.keys.includes(r)){
      const flowPts = f.name === "Voisins lateral" ? 12.5 : 11;
      f.boost.forEach(n=>addScore(scoreMap,n,flowPts,`Fluxo: ${f.name}`));
      notes.push(`Fluxo ativo: ${f.name}`);
    }
  });
}

function addShortMemory(scoreMap,nums,notes){
  const dom8=dominantRegion(nums,8);
  const dom14=dominantRegion(nums,14);

  if(dom8==="Tier" || dom14==="Tier"){
    [30,11,36,13,27,8,23,10,5,24,16,33].forEach(n=>{
      addScore(scoreMap,n,8.5,"Memória curta Tier");
    });
    notes.push("Memória curta: Tier vivo.");
  }

  if(dom8==="Zero" || dom14==="Zero"){
    [26,3,0,32,15,12,35,23,10].forEach(n=>{
      addScore(scoreMap,n,8,"Memória curta Zero + expansão");
    });
    notes.push("Memória curta: Zero/32 vivo.");
  }

  if(dom8==="Voisins" || dom14==="Voisins"){
    [19,4,21,2,25,28,7,18,22,29,12,31,9,14].forEach(n=>{
      addScore(scoreMap,n,5,"Memória curta Voisins");
    });
    notes.push("Memória curta: Voisins vivo.");
  }
}

function returnOfControl(scoreMap,nums,notes){
  const r=nums[0];
  const prev=nums.slice(1,8);

  const tierBefore=prev.filter(n=>TIER.has(n)).length;
  const zeroBefore=prev.filter(n=>ZERO_BLOCK.includes(n)).length;
  const voisBefore=prev.filter(n=>VOIS.has(n)).length;

  if(TIER.has(r) && tierBefore>=4){
    [30,11,36,13,27,8,23,10,5,24,16,33].forEach(n=>{
      addScore(scoreMap,n,12,"Retorno de dominância Tier");
    });
    notes.push("Retorno de controle: Tier.");
  }

  if(ZERO_BLOCK.includes(r) && zeroBefore>=2){
    [26,3,0,32,15,12,35,23,10].forEach(n=>{
      addScore(scoreMap,n,10,"Retorno de dominância Zero");
    });
    notes.push("Retorno de controle: Zero.");
  }

  if(VOIS.has(r) && voisBefore>=3){
    [19,4,21,2,25,28,7,18,22,29,12,31,9,14].forEach(n=>{
      addScore(scoreMap,n,8,"Retorno de dominância Voisins");
    });
    notes.push("Retorno de controle: Voisins.");
  }
}

function addBridgeBalance(scoreMap,nums,notes){
  const leftHits = nums.slice(0,8).filter(n=>side(n)==="left").length;
  const rightHits = nums.slice(0,8).filter(n=>side(n)==="right").length;

  if(leftHits >= 5){
    BRIDGE_RIGHT.forEach(n=>{
      addScore(scoreMap,n,4.5,"Ponte angular obrigatória à direita");
    });
    notes.push("Balanceamento: mesa presa à esquerda; abrindo ponte direita.");
  }

  if(rightHits >= 5){
    [25,17,34,6,2,19,4,21].forEach(n=>{
      addScore(scoreMap,n,4,"Ponte angular obrigatória à esquerda");
    });
    notes.push("Balanceamento: mesa presa à direita; abrindo ponte esquerda.");
  }

  const zeroStrong = nums.slice(0,8).filter(n=>ZERO_BLOCK.includes(n)).length >= 2;
  if(zeroStrong){
    [20,1,33,16,23,10,5].forEach(n=>{
      addScore(scoreMap,n,3,"Zero como eixo de transição");
    });
    notes.push("Zero tratado como eixo de transição.");
  }
}

function specialBreakRules(scoreMap,nums,notes){
  const [r,a,b] = nums;

  // Regra validada: 34 → 5 pode quebrar Tier/Zero para Voisins lateral
  if(a===5 && b===34){
    [18,22,9,31,14,19,4,21,2,25].forEach(n=>{
      addScore(scoreMap,n,7,"Quebra 34→5: Voisins lateral");
    });
    notes.push("Regra 34→5: possível quebra para Voisins lateral.");
  }

  // Regra validada: 32/35/15 fortes podem migrar para Tier superior
  if([35,32,15].includes(r)){
    [10,5,24,8,23].forEach(n=>{
      addScore(scoreMap,n,4.5,"Expansão Zero → Tier superior");
    });
    notes.push("Regra Zero→Tier superior ativa.");
  }

  // Se 25 sai depois de falha/escape, olhar eixo 25/17/34
  if(r===25){
    [2,25,17,34,6].forEach(n=>{
      addScore(scoreMap,n,6,"Migração 25/17/34");
    });
    notes.push("Regra 25: migração para 17/34/6.");
  }
  // Reforço órfão/lateral quando 6/17/25 aparecem próximos
  const recent6 = nums.slice(0,6);

  const orphanLeftHits = recent6.filter(n=>[6,17,25,34,2].includes(n)).length;
  const lateralHits = recent6.filter(n=>[19,4,21,2,25,18,22,9,31,14].includes(n)).length;

  if(orphanLeftHits >= 2 || (orphanLeftHits >= 1 && lateralHits >= 2)){
    [2,25,17,34,6,19,4,21].forEach(n=>{
      addScore(scoreMap,n,6.5,"Reforço órfão/lateral recente");
    });
    notes.push("Reforço: órfão/lateral recente ativo.");
  }
}

function terminalLoopPenalty(scoreMap,nums){
  const tcount={};
  nums.slice(0,14).forEach(n=>{
    const t=terminal(n);
    tcount[t]=(tcount[t]||0)+1;
  });

  Object.entries(tcount).forEach(([t,c])=>{
    if(c>=3){
      terminalGroup(Number(t)).forEach(n=>{
        if(scoreMap[n]){
          scoreMap[n].score-=6;
          scoreMap[n].reasons.push(`Penalidade terminal ${t} saturado`);
        }
      });
    }
  });
}

function penalizeColdSectors(scoreMap,nums){
  Object.keys(scoreMap).forEach(k=>{
    const n=Number(k);
    const hits=sectorHits(nums,n,14);
    if(hits===0){
      scoreMap[n].score-=8;
      scoreMap[n].reasons.push("Penalidade: setor frio");
    }
    if(hits===1){
      scoreMap[n].score-=3;
      scoreMap[n].reasons.push("Penalidade leve: pouco histórico");
    }
  });
}

function 
  concentrationPenalty(entries){
  const sides={left:0,right:0,mid:0};
  entries.forEach(e=>sides[side(e.number)]++);

  if(sides.left>=3 || sides.right>=3){
    return true;
  }
  return false;
}

  const ENGINE_MODE = "GV_MASTER_V2";

function pairKey(a,b){
  return [a,b].sort((x,y)=>x-y).join("-");
}

const HARD_BAD_PAIRS = new Set([
  pairKey(21,25),
  pairKey(10,11),
  pairKey(22,20)
]);

const SOFT_BAD_PAIRS = new Set([
  pairKey(22,7)
]);

function recentSectorHits(nums,n,span=5){
  const sec = neighbors(n,2);
  return nums.slice(0,span).filter(x=>sec.includes(x)).length;
}

function pairScore(a,b,nums){
  const secA = neighbors(a.number,2);
  const secB = neighbors(b.number,2);

  const ov = overlap(secA,secB);
  const d = wheelDistance(a.number,b.number);
  const key = pairKey(a.number,b.number);

  let score = a.score + b.score;

  // confirmação recente
  const recentA = recentSectorHits(nums,a.number,5);
  const recentB = recentSectorHits(nums,b.number,5);

  score += recentA * 6;
  score += recentB * 6;

  // diversidade angular
  if(d >= 8) score += 10;
  if(d >= 12) score += 5;

  // penalidade de overlap
  if(ov >= 2) score -= 22;
  if(d <= 5) score -= 15;

  // pares ruins conhecidos
  if(HARD_BAD_PAIRS.has(key)) score -= 35;
  if(SOFT_BAD_PAIRS.has(key)) score -= 10;

  // penalidade de conforto: evita 10/20/32/11 dominarem juntos
  const comfort = [10,20,32,11,25,22,7];
  if(comfort.includes(a.number) && comfort.includes(b.number)){
    score -= 8;
  }

  // bônus para pares estruturais bons
  const pair = [a.number,b.number];

  const hasTierClassic = pair.some(n=>[30,11,36,13,27].includes(n));
  const hasTierTop = pair.some(n=>[30,8,23,10,5,24].includes(n));
  const hasBridge = pair.some(n=>[14,20,1,33,16].includes(n));
  const hasZero = pair.some(n=>[26,3,0,32,15,35].includes(n));
  const hasOrphan = pair.some(n=>[2,25,17,34,6].includes(n));
  const hasVoisins = pair.some(n=>[12,28,7,29,18].includes(n));
  const hasLateral = pair.some(n=>[19,4,21,2,25,18,22,9,31,14].includes(n));

  const recent = nums.slice(0,5);

  const zeroOrphanHits = recent.filter(n =>
    [26,3,0,32,15,35,2,25,17,34,6].includes(n)
  ).length;

  const tierBridgeHits = recent.filter(n =>
    [30,11,36,13,27,8,23,10,5,24,14,20,1,33,16].includes(n)
  ).length;

  const voisLateralHits = recent.filter(n =>
    [12,28,7,29,18,19,4,21,2,25,22,9,31,14].includes(n)
  ).length;

  if(hasZero && hasOrphan){
    score += zeroOrphanHits >= 2 ? 22 : 12;
  }

  if((hasTierClassic || hasTierTop) && hasBridge){
    score += tierBridgeHits >= 2 ? 18 : 10;
  }

  if(hasVoisins && hasLateral){
    score += voisLateralHits >= 2 ? 20 : 10;
  }

  const maxCorridorHits = Math.max(
    zeroOrphanHits,
    tierBridgeHits,
    voisLateralHits
  );

  if(maxCorridorHits >= 3){
    if(zeroOrphanHits === maxCorridorHits && hasZero && hasOrphan){
      score += 12;
    }

    if(tierBridgeHits === maxCorridorHits && (hasTierClassic || hasTierTop) && hasBridge){
      score += 10;
    }

    if(voisLateralHits === maxCorridorHits && hasVoisins && hasLateral){
      score += 12;
    }
  }
  
  if(hasOrphan && hasVoisins) score += 8;
  if(hasOrphan && hasLateral) score += 7;

  // Tier clássico e Tier superior não são iguais: só aceita juntos se tiver confirmação recente
  if(hasTierClassic && hasTierTop && recentA + recentB < 2){
    score -= 10;
  }

  return score;
}

function selectEntries2Core(ranked,nums,notes){
  const candidates = ranked.slice(0,14);
  let bestPair = null;
  let bestScore = -9999;

  for(let i=0;i<candidates.length;i++){
    for(let j=i+1;j<candidates.length;j++){
      const a = candidates[i];
      const b = candidates[j];

      if(a.number === b.number) continue;

      const score = pairScore(a,b,nums);

      if(score > bestScore){
        bestScore = score;
        bestPair = [a,b];
      }
    }
  }

  if(!bestPair){
    return ranked.slice(0,2).map((item,idx)=>build(item,["A","B"][idx]));
  }

  notes.push("2-Core: seleção por melhor dupla, não apenas top score individual.");

  return [
    build(bestPair[0],"A"),
    build(bestPair[1],"B")
  ];
}

function selectEntriesClassic(ranked,nums,notes){
  let selected=[];

  for(const item of ranked){
    if(selected.length>=3) break;
    if(selected.some(s=>s.number===item.number)) continue;

    if(!tooClose(item,selected)){
      selected.push(build(item,["A","B","C"][selected.length]));
    }else{
      const repl=ranked.find(r=>
        r.number!==item.number &&
        !selected.some(s=>s.number===r.number) &&
        !tooClose(r,selected) &&
        (
          side(r.number)!==side(item.number) ||
          sectorHits(nums,r.number,14)>=2 ||
          wheelDistance(r.number,item.number)>=6
        )
      );

      if(repl){
        notes.push(`Anti-overlap/corredor: evitei ${item.number}; usei ${repl.number}.`);
        selected.push(build(repl,["A","B","C"][selected.length]));
      }
    }
  }

  if(concentrationPenalty(selected)){
    notes.push("Alerta: concentração angular detectada; buscando ponte.");
    const bridge = ranked.find(r=>
      !selected.some(s=>s.number===r.number) &&
      !tooClose(r,selected) &&
      side(r.number)!==side(selected[0]?.number)
    );

    if(bridge && selected.length>=3){
      selected[2]=build(bridge,"C");
    }
  }

  return selected;
}

function selectEntries(ranked,nums,notes){
  if(ENGINE_MODE === "2core"){
    return selectEntries2Core(ranked,nums,notes);
  }

  return selectEntriesClassic(ranked,nums,notes);
}


function zeroFixed(){
  return {
    mode:"fixed",
    main:0,
    sector:[26,3,0,32,15],
    reason:"Regra fixa: 0 sempre acompanhado com 2V; eixo de transição."
  };
}

function detectTurbulence(nums){
  const last = nums.slice(0,14);

  const tier = last.filter(n=>TIER.has(n)).length;
  const vois = last.filter(n=>VOIS.has(n)).length;
  const zero = last.filter(n=>ZERO_BLOCK.includes(n)).length;
  const bridge = last.filter(n=>[14,20,1,33,16].includes(n)).length;

  const activeGroups = [tier, vois, zero, bridge].filter(x=>x>=2).length;

  return activeGroups >= 3;
}

export function analyze(numbers){
  if(!numbers || numbers.length<14)return null;
  if (ENGINE_MODE === "GV_MASTER_V2") {
    console.log("RODANDO GV_MASTER_V2");
    return analyzeTerminalLabV2(numbers);
  }

  const recent=numbers[0];
  const n1=numbers[1], n2=numbers[2], n3=numbers[3];
  const scoreMap={};
  const notes=[];
  const context = analyzeContext(numbers);

  const turbulent = detectTurbulence(numbers);
  
  addFlow(scoreMap,numbers,notes);
  addShortMemory(scoreMap,numbers,notes);
  returnOfControl(scoreMap,numbers,notes);
  addBridgeBalance(scoreMap,numbers,notes);
  specialBreakRules(scoreMap,numbers,notes);
  
  if(turbulent){
    notes.push("Modo turbulência: múltiplas dominâncias ativas; reduzindo convicção direcional.");

    Object.keys(scoreMap).forEach(k=>{
      scoreMap[k].score *= 0.88;
    });

    [20,25,22,10,11,7,32].forEach(n=>{
      addScore(scoreMap,n,2.5,"Modo turbulência: cobertura angular balanceada");
    });
  }
  if(context.recommendation==="persist"){
    notes.push("ContextEngine: persistência recomendada.");
  }

  if(context.recommendation==="observe"){
    notes.push("ContextEngine: dispersão parcial detectada.");
  }

  if(context.recommendation==="migrate"){
    notes.push("ContextEngine: possível migração estrutural.");
  }
  
  // matemática com peso reduzido
  [
    {t:dsum(terminal(n1)+3), reason:"3-6-5 A"},
    {t:dsum(terminal(n2)+6), reason:"3-6-5 B"},
    {t:dsum(terminal(n3)+5), reason:"3-6-5 C"}
  ].forEach(({t,reason})=>{
    terminalGroup(t).forEach(n=>addScore(scoreMap,n,2.2,reason));
  });

  [
    {t:dsum(n1+n2), reason:"GV365 soma"},
    {t:dsum(Math.abs(n1-n2)), reason:"GV365 diferença"},
    {t:dsum(n2+n3), reason:"GV365 N2+N3"}
  ].forEach(({t,reason})=>{
    terminalGroup(t).forEach(n=>addScore(scoreMap,n,2.1,reason));
  });

  const freq={};
  numbers.slice(0,14).forEach(n=>freq[n]=(freq[n]||0)+1);

  Object.entries(freq).forEach(([n,c])=>{
    if(c>=2){
      const num=Number(n);
      addScore(scoreMap,num,c*3.8,"Repetição estrutural");
      neighbors(num,1).forEach(v=>{
        addScore(scoreMap,v,c*1.8,"Expansão por repetição");
      });
    }
  });

  Object.keys(scoreMap).forEach(k=>{
    const n=Number(k);
    const hits=sectorHits(numbers,n,14);
    if(hits>=2)addScore(scoreMap,n,hits*2.8,`Setor quente ${hits}x`);
  });

  terminalLoopPenalty(scoreMap,numbers);
  penalizeColdSectors(scoreMap,numbers);

  const ranked=Object.entries(scoreMap)
    .map(([n,d])=>({number:Number(n),...d}))
    .filter(x=>x.score>0)
    .sort((a,b)=>b.score-a.score);

  const selected=selectEntries(ranked,numbers,notes);

  return {
    recent,
    selected,
    entries:selected,
    zeroFlex:zeroFixed(),
    sessionLimit:null,
    mode:
    ENGINE_MODE === "2core"
      ? "GV_2_CORE_EXPERIMENTAL"
      : "GV_LAB_V1_8_RECALIBRATED",
    summary:{context, turbulent,
      version: ENGINE_MODE === "2core" ? "GV 2-Core Experimental" : "GV Lab v1.8",
      timelineOrder:"esquerda = mais recente",
      sampleSize:14,

      dominant8:dominantRegion(numbers,8),

      dominant14:dominantRegion(numbers,14),

      mainLogic:"v1.8 recalibrado: menos migração precoce + mais memória Tier/Zero + contexto com peso reduzido",

        notes,
      }
      };
    }