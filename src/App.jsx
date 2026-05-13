import { useState, useCallback } from "react";

const SENHA = "Forra01";

function TelaLogin({ onLogin }) {
  const [s,setS]=useState('');const [err,setErr]=useState(false);
  const tentar=()=>{if(s===SENHA){onLogin();}else{setErr(true);setS('');setTimeout(()=>setErr(false),2000);}};
  return(<div style={{background:'#04080b',minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'0 24px',fontFamily:"'Courier New',monospace"}}>
    <div style={{position:'fixed',inset:0,backgroundImage:'linear-gradient(rgba(0,200,122,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(0,200,122,0.02) 1px,transparent 1px)',backgroundSize:'30px 30px',pointerEvents:'none'}}/>
    <div style={{position:'relative',zIndex:1,width:'100%',maxWidth:340,textAlign:'center'}}>
      <div style={{fontSize:48,marginBottom:16}}>🎰</div>
      <div style={{fontSize:22,fontWeight:900,letterSpacing:4,color:'#e8f5ff',marginBottom:4}}>GIOVANNI <span style={{color:'#00c87a'}}>VISION</span></div>
      <div style={{fontSize:9,color:'#2e4a60',letterSpacing:2,marginBottom:40}}>REVOLUTION · v6.0 PRO</div>
      <input type="password" value={s} onChange={e=>setS(e.target.value)} onKeyDown={e=>e.key==='Enter'&&tentar()} placeholder="Digite a senha..."
        style={{width:'100%',background:'#080f14',border:`2px solid ${err?'#d42035':'#132030'}`,borderRadius:10,padding:'14px 16px',color:'#e8f5ff',fontSize:16,fontFamily:'monospace',outline:'none',textAlign:'center',letterSpacing:2,marginBottom:12}}/>
      <button onClick={tentar} style={{width:'100%',padding:'14px',background:'linear-gradient(135deg,#006040,#00c87a)',border:'none',borderRadius:10,color:'#000',fontWeight:900,fontSize:16,letterSpacing:3,cursor:'pointer'}}>ENTRAR</button>
      {err&&<div style={{marginTop:12,fontSize:11,color:'#d42035'}}>⚠ SENHA INCORRETA</div>}
    </div>
  </div>);
}

// ── ENGINE ────────────────────────────────────────────────────────
const RED=new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
const WHEEL=[0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
const TIER=new Set([5,8,10,11,13,16,23,24,27,30,33,36]);
const VOIS=new Set([0,2,3,4,7,12,15,18,19,21,22,25,26,28,29,32,35]);
const PERM={0:[6,14,4,7],1:[3,11,21],2:[22,11,19],3:[22,33,11,25],4:[0,7,13,24],5:[25,29,33,5],6:[6,9,12,29,19],7:[7,27,23,24],8:[28,8,18,26,2,20,25,34],9:[9,1,11,21,29,19],10:[0,9,21,29],11:[29,20,34],12:[12,15],13:[0,2,9,20],14:[14,4,30,34],15:[36,15],16:[0,3,9,13,21],17:[0,24,20,29],18:[18,28,20,11,6,2,35,0],19:[16,17,18,19,20,21],20:[28,8,18,26,2,35],21:[0,16,13,29],22:[0,2,5,13,29],23:[23],24:[0,9,3],25:[25,5,7,0],26:[2,18,11,24,7,4],27:[27,36,30],28:[8,20,18,28,2,34,0],29:[11,20,34],30:[0,7,20,21],31:[30,28,17],32:[6,14,26,19],33:[0,9,25,28],34:[34,35,24],35:[35,36,20,24],36:[36,35,16,0]};
const MIRRORS={1:13,13:1,22:25,25:22,2:20,20:2,3:30,30:3,4:31,31:4,5:32,32:5,6:33,33:6,7:34,34:7,8:26,26:8,9:27,27:9,10:23,23:10,11:36,36:11,12:35,35:12,14:19,19:14,15:21,21:15,16:28,28:16,17:29,29:17,18:24,24:18};
const HORSES=[[1,4,7],[2,5,8],[3,6,9]];
const FANTASMA={0:20,1:21,2:35,3:24,4:29,5:18,6:12,7:34,8:19,9:33};
const CICLOS={3:[6],1:[4],6:[5,2],4:[0],9:[3]};

function wpos(n){return WHEEL.indexOf(n);}
function nbrs(n,c){const p=wpos(n);if(p<0)return[];return Array.from({length:c*2+1},(_,i)=>WHEEL[(p-c+i+WHEEL.length)%WHEEL.length]);}
function term(n){return n%10;}
function dsum(n){if(n<=9)return n;const s=Math.floor(n/10)+(n%10);return s>9?Math.floor(s/10)+(s%10):s;}
function region(n){if(n===0)return'Z';if(TIER.has(n))return'T';if(VOIS.has(n))return'V';return'O';}

// ── LEARNING ──────────────────────────────────────────────────────
const DW={perm:1.3,camuflagem:1.4,camDupla:1.5,terminal:1.0,espelho:1.0,cavalo:1.2,fantasma:1.2,frio:1.3,distancia:0.8,ciclo:1.0,tripleX:0.7};
function loadW(){try{const s=localStorage.getItem('gv_w6');return s?JSON.parse(s):{...DW};}catch{return{...DW};}}
function saveW(w){try{localStorage.setItem('gv_w6',JSON.stringify(w));}catch{}}
function loadStats(){try{const s=localStorage.getItem('gv_st6');return s?JSON.parse(s):{total:0,first:0,second:0,miss:0};}catch{return{total:0,first:0,second:0,miss:0};}}
function saveStats(s){try{localStorage.setItem('gv_st6',JSON.stringify(s));}catch{}}
function updateW(w,keys,result){
  const nw={...w};
  const b=result==='first'?0.15:result==='second'?0.05:-0.10;
  keys.forEach(k=>{if(nw[k]!==undefined)nw[k]=Math.max(0.1,Math.min(3,nw[k]+b));});
  saveW(nw);return nw;
}

// ── MESA STABILITY CHECK ──────────────────────────────────────────
function mesaCheck(nums){
  if(nums.length<10)return{estavel:false,score:0,dominante:null,regiao:null,msg:'Poucos números'};
  const last14=nums.slice(0,Math.min(14,nums.length));
  // Alternância de regiões
  const regs=last14.map(n=>region(n));
  let alts=0;for(let i=1;i<regs.length;i++)if(regs[i]!==regs[i-1])alts++;
  const altPct=alts/(regs.length-1);
  // Terminal dominante
  const tc={};nums.slice(0,20).forEach(n=>{const t=n%10;tc[t]=(tc[t]||0)+1;});
  const sorted=Object.entries(tc).sort((a,b)=>b[1]-a[1]);
  const topT=sorted[0];
  const maxT=parseInt(topT[1]);
  // Região dominante
  const rc={T:0,V:0,O:0,Z:0};last14.forEach(n=>rc[region(n)]++);
  const topR=Object.entries(rc).sort((a,b)=>b[1]-a[1])[0];
  // Score de estabilidade
  let score=0;
  if(altPct<0.65)score+=2; // baixa alternância
  if(altPct<0.55)score+=1;
  if(maxT>=3)score+=2; // terminal dominante
  if(maxT>=4)score+=1;
  if(topR[1]>=4)score+=2; // região dominante
  const estavel=score>=3&&altPct<0.75; // menos restritivo
  return{estavel,score,altPct:Math.round(altPct*100),dominante:`T${topT[0]}(${topT[1]}x)`,regiao:topR[0],maxT,tc,rc,msg:estavel?'Mesa estável':'Mesa instável'};
}

// ── MAIN ANALYSIS — NOVA FILOSOFIA ───────────────────────────────
// Inspirado no Prodígio: 2 números por entrada, mesma região, 3 últimos números pesados
function analyze(nums,weights,mode){
  if(!nums||nums.length<3)return null;
  const w=weights||DW;
  const mesa=mesaCheck(nums);

  const last=nums[0],second=nums[1],third=nums[2];
  const t1=term(last),t2=term(second),t3=term(third);

  // Scores por número
  const scores={};
  const add=(n,pts,key,reason)=>{
    if(n<0||n>36)return;
    if(!scores[n])scores[n]={pts:0,reasons:[],keys:[]};
    scores[n].pts+=pts*(w[key]||1);
    if(!scores[n].reasons.includes(reason))scores[n].reasons.push(reason);
    if(!scores[n].keys.includes(key))scores[n].keys.push(key);
  };

  // PERMANÊNCIA — dos 3 últimos (como Prodígio)
  (PERM[last]||[]).forEach(n=>add(n,4,'perm',`Perm ${last}`));
  if(second!==undefined)(PERM[second]||[]).forEach(n=>add(n,2.5,'perm',`Perm ${second}`));
  if(third!==undefined)(PERM[third]||[]).forEach(n=>add(n,1.5,'perm',`Perm ${third}`));

  // CAMUFLAGEM — estratégia #1 do Prodígio
  const cam=dsum(last);
  if(cam>0)[cam,cam+10,cam+20,cam+30].filter(x=>x<=36).forEach(n=>add(n,4,'camuflagem',`Cam ${last}→${cam}`));

  // CAMUFLAGEM DUPLA
  if(second!==undefined){
    let cd=last+second;while(cd>36)cd=dsum(cd);
    [cd,cd+10,cd+20,cd+30].filter(x=>x<=36&&x>0).forEach(n=>add(n,3,'camDupla',`CamD ${last}+${second}=${cd}`));
  }

  // TERMINAL
  [t1,t1+10,t1+20,t1+30].filter(x=>x<=36&&x>0).forEach(n=>add(n,2,'terminal',`T${t1}`));

  // ESPELHO
  if(MIRRORS[last])add(MIRRORS[last],2.5,'espelho',`Mir ${last}→${MIRRORS[last]}`);
  if(second!==undefined&&MIRRORS[second])add(MIRRORS[second],1.5,'espelho',`Mir ${second}`);

  // CAVALO
  const horse=HORSES.find(h=>h.includes(t1));
  if(horse)horse.forEach(t=>[t,t+10,t+20,t+30].filter(x=>x<=36&&x>0).forEach(n=>add(n,1.5,'cavalo',`Cav ${horse.join('-')}`)));

  // CICLO DE TERMINAIS
  if(CICLOS[t1])CICLOS[t1].forEach(tc2=>[tc2,tc2+10,tc2+20,tc2+30].filter(x=>x<=36&&x>0).forEach(n=>add(n,2,'ciclo',`Ciclo T${t1}→T${tc2}`)));

  // ESTRATÉGIA TERMINAL 1V — quando não sabe qual do terminal vai cair
  // Ex: terminal 6 dominante → cobre 6,16,26,36 cada um com 1V
  const domTerminal=Object.entries(mesa.tc).sort((a,b)=>b[1]-a[1])[0];
  const tDom=parseInt(domTerminal[0]);
  const tDomCount=domTerminal[1];
  const terminalNums=[tDom,tDom+10,tDom+20,tDom+30].filter(x=>x<=36&&x>0);

  // FANTASMA
  if(FANTASMA[t1]!==undefined)add(FANTASMA[t1],3,'fantasma',`Fantasma T${t1}`);

  // FRIO
  const recent20=nums.slice(0,Math.min(20,nums.length));
  const frios=[...Array(37).keys()].filter(n=>!recent20.includes(n));
  frios.forEach(n=>add(n,1.5,'frio','Frio'));

  // DISTÂNCIA GEOMÉTRICA
  const p0=wpos(last);
  if(p0>=0)[13,15,17].forEach(d=>{
    add(WHEEL[(p0+d)%37],1,'distancia',`D${d}`);
    add(WHEEL[(p0-d+37)%37],1,'distancia',`D${d}`);
  });

  // REPETIÇÕES
  const freq={};nums.forEach(n=>{freq[n]=(freq[n]||0)+1;});
  Object.entries(freq).filter(([,v])=>v>=2).forEach(([n,v])=>add(parseInt(n),v*1.5,'perm',`Rep ${v}x`));

  // ── NOVA FILOSOFIA: FILTRAR POR REGIÃO DOMINANTE ──────────────
  const sorted=Object.entries(scores).map(([n,d])=>({n:parseInt(n),...d})).sort((a,b)=>b.pts-a.pts);

  // Identificar região dominante dos top candidatos
  const topCands=sorted.slice(0,10);
  const regCount={T:0,V:0,O:0,Z:0};
  topCands.forEach(c=>regCount[region(c.n)]++);
  const topRegCands=Object.entries(regCount).sort((a,b)=>b[1]-a[1])[0][0];

  // NOVA FILOSOFIA: máximo 2 entradas, mesma região preferencial
  const entries=[];const used=new Set();
  const maxE=mode==='sniper'?1:2; // máximo 2 como Prodígio!
  const minPts=mode==='sniper'?10:6;

  // Primeiro: candidatos da região dominante
  const cands=sorted.filter(c=>c.pts>=minPts);
  if(!cands.length)cands.push(...sorted.slice(0,maxE));

  // Prioriza candidatos da mesma região
  const candsSameRegion=cands.filter(c=>region(c.n)===topRegCands||region(c.n)==='Z');
  const candsAll=candsSameRegion.length>=maxE?candsSameRegion:cands;

  candsAll.forEach(c=>{
    if(used.has(c.n)||entries.length>=maxE)return;
    const str=c.pts>=12?'s':c.pts>=7?'m':'n';
    const vc=mode==='sniper'?3:(str==='s'?3:2);
    const nb=nbrs(c.n,vc);
    if(nb.filter(x=>used.has(x)).length>nb.length*0.5&&entries.length>0)return;
    nb.forEach(x=>used.add(x));used.add(c.n);
    entries.push({main:c.n,nb,vc,str,pts:c.pts,reasons:c.reasons.slice(0,3),keys:c.keys,regiao:region(c.n)});
  });

  // ── SEMÁFORO — LÓGICA CIRÚRGICA ─────────────────────────────
  const hotS=[];
  const allKeys=entries.flatMap(e=>e.keys);
  if(allKeys.includes('perm'))hotS.push('Permanência');
  if(allKeys.includes('camuflagem'))hotS.push('Camuflagem');
  if(allKeys.includes('camDupla'))hotS.push('Cam.Dupla★');
  if(allKeys.includes('terminal'))hotS.push('Terminal');
  if(allKeys.includes('espelho'))hotS.push('Espelho');
  if(allKeys.includes('fantasma'))hotS.push('Fantasma');
  if(allKeys.includes('frio'))hotS.push('Frio');
  if(allKeys.includes('ciclo'))hotS.push('Ciclo');
  if(Object.values(freq).some(v=>v>=2))hotS.push('Repetição');

  // CONVERGÊNCIA: Perm e Cam na mesma REGIÃO (não precisa ser mesmo número)
  const TIER_SET=new Set([5,8,10,11,13,16,23,24,27,30,33,36]);
  const VOIS_SET=new Set([0,2,3,4,7,12,15,18,19,21,22,25,26,28,29,32,35]);
  const getR=n=>n===0?'Z':TIER_SET.has(n)?'T':VOIS_SET.has(n)?'V':'O';
  const permNums=(PERM[last]||[]);
  const camNums=[cam,cam+10,cam+20,cam+30].filter(x=>x<=36&&x>0);
  // Convergência = mesma região OU mesmo terminal
  const permRegs=new Set(permNums.map(n=>getR(n)));
  const camRegs=new Set(camNums.map(n=>getR(n)));
  const permCamConverge=[...permRegs].some(r=>camRegs.has(r))||
    permNums.some(n=>camNums.some(c=>term(n)===term(c)));

  // Terminais únicos — mesa caótica se muitos
  const uniqueTerms=Object.keys(mesa.tc).length;
  const mesaCaotica=uniqueTerms>=8; // aumentei de 7 para 8

  // Região converge nas entradas
  const regiaoConverge=entries.length>=1&&entries.every(e=>e.regiao===entries[0].regiao||e.regiao==='Z');

  // SEMÁFORO BALANCEADO:
  // Verde: mesa estável + não caótica + convergência de região + 3+ estratégias
  // Amarelo: mesa ok + 2 estratégias
  // Vermelho: mesa instável ou caótica
  const topPts=entries[0]?.pts||0;
  let sem='red';
  if(mesaCaotica){
    sem='red'; // só vermelho se realmente caótica
  } else if(!mesa.estavel){
    sem='yellow'; // instável mas mostra cautela
  } else if(permCamConverge&&hotS.length>=3&&topPts>=8){
    sem='green';
  } else if(hotS.length>=2&&topPts>=5){
    sem='yellow';
  } else {
    sem='yellow'; // sempre mostra pelo menos amarelo com números
  }

  // Zero proteção quando terminal saturado
  const zeroprot=mesa.maxT>=4;

  // 1 ficha — T+20+1 (soma=21 melhor universal por análise Monte Carlo)
  // Terminais especiais: T8 e T9 são os mais rentáveis (10-17%!)
  const UF_FIXO1=20, UF_FIXO2=1;
  let uf=t1+UF_FIXO1+UF_FIXO2;while(uf>36)uf=dsum(uf);
  const ufHot=t1===8||t1===9; // terminais mais rentáveis

  // Triple X CORRETO: 12 + T(último) + T(mais antigo dos 14) + 3
  const oldest=nums[Math.min(13,nums.length-1)];
  const tOldest=term(oldest);
  let tx=12+t1+tOldest+3;while(tx>36)tx=dsum(tx);

  // TX2 calc for display
  let txNum2Display=0;
  if(nums.length>=4){
    const midIdx2=Math.floor(Math.min(nums.length,14)/2);
    const tM=term(nums[midIdx2]);const tMN=term(nums[midIdx2-1]);const t2=second!==undefined?term(second):0;
    txNum2Display=tM+tMN+12+t1+t2+3;while(txNum2Display>36)txNum2Display=dsum(txNum2Display);
  }

  // TX PERFORMANCE — qual está batendo mais nos últimos 14
  let tx1Hits=0,tx2Hits=0,txChecks=0;
  for(let i=1;i<Math.min(nums.length,14);i++){
    const ln=nums[i],pn=nums[i-1],lt=term(ln);
    const old14c=nums[Math.min(i+13,nums.length-1)];
    let c1=12+lt+term(old14c)+3;while(c1>36)c1=dsum(c1);
    const midIc=Math.floor(Math.min(i+14,nums.length)/2);
    const tMc=term(nums[Math.min(midIc,nums.length-1)]);
    const tMNc=term(nums[Math.max(midIc-1,0)]);
    const t2c=i+1<nums.length?term(nums[i+1]):0;
    let c2=tMc+tMNc+12+lt+t2c+3;while(c2>36)c2=dsum(c2);
    if(nbrs(c1,2).includes(pn))tx1Hits++;
    if(nbrs(c2,2).includes(pn))tx2Hits++;
    txChecks++;
  }
  const tx1Pct=txChecks>0?Math.round(tx1Hits/txChecks*100):0;
  const tx2Pct=txChecks>0?Math.round(tx2Hits/txChecks*100):0;
  const txHot=tx1Pct>=tx2Pct?1:2;
  const txHotNum=txHot===1?txNum:txNum2Display;

  // NÚMERO SECO — fórmula otimizada T+20+1 (soma=21, melhor por análise 725 números)
  let umaFichaNum=uf;

  // TX % for display
  const tx1Hot=tx1Pct>=tx2Pct;

  return{entries,mesa,sem,hotS,regiaoConverge,topRegCands,
    umaFicha:umaFichaNum,ufHot,ufTerminal:t1,
    txNum,txNum2:txNum2Display,
    txFormula:`12+T${t1}+T${term(oldest14)}+3`,
    tx1Pct,tx2Pct,txHot,tx1Hot,
    terminalNums,tDom,tDomCount,
    fantasmaNum:FANTASMA[t1],topFrios:frios.slice(0,3),freq,tc:mesa.tc,zeroprot,score:hotS.length};
}

// ── LEARNING SYSTEM ───────────────────────────────────────────────
function loadCalib(){try{const s=localStorage.getItem('gv_cal6');return s?JSON.parse(s):null;}catch{return null;}}
function saveCalib(d){try{localStorage.setItem('gv_cal6',JSON.stringify(d));}catch{}}

export default function Root(){const[ok,setOk]=useState(false);return ok?<App/>:<TelaLogin onLogin={()=>setOk(true)}/>;}

function App(){
  const[tl,setTl]=useState([]);
  const[newN,setNewN]=useState('');
  const[tab,setTab]=useState('signal');
  const[mode,setMode]=useState('normal');
  const[retry,setRetry]=useState(0);
  const[missed,setMissed]=useState(null);
  const[showFB,setShowFB]=useState(false);
  const[lastKeys,setLastKeys]=useState([]);
  const[weights,setWeights]=useState(()=>loadW());
  const[stats,setStats]=useState(()=>loadStats());
  const[analysis,setAnalysis]=useState(null);
  const[confirm,setConfirm]=useState(false);
  const[editIdx,setEditIdx]=useState(null);
  const[calibrating,setCalibrating]=useState(true);
  const[sessionLog,setSessionLog]=useState([]);
  const[timer,setTimer]=useState(0);
  const[timerActive,setTimerActive]=useState(false);

  // Timer via setInterval
  const startTimer=()=>{
    setTimer(50);setTimerActive(true);
    const iv=setInterval(()=>{
      setTimer(t=>{
        if(t<=1){clearInterval(iv);setTimerActive(false);return 0;}
        return t-1;
      });
    },1000);
  };

  const C={bg:'#04080b',panel:'#080f14',p2:'#0c1820',border:'#132030',green:'#00c87a',gold:'#f5a800',red:'#d42035',blue:'#38bdf8',text:'#b8d8f0',dim:'#2e4a60',white:'#e8f5ff'};
  const WH=[0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
  const nbrs=(n,c)=>{const p=WH.indexOf(n);if(p<0)return[];return Array.from({length:c*2+1},(_,i)=>WH[(p-c+i+WH.length)%WH.length]);};
  const S={s:{c:C.green,bg:'rgba(0,200,122,0.12)',b:'rgba(0,200,122,0.3)',l:'FORTE'},m:{c:C.gold,bg:'rgba(245,168,0,0.12)',b:'rgba(245,168,0,0.3)',l:'MÉDIO'},n:{c:C.red,bg:'rgba(212,32,53,0.12)',b:'rgba(212,32,53,0.3)',l:'FRACO'}};

  const run=useCallback((nums,w,m)=>{
    const res=analyze(nums,w||weights,m||mode);
    setAnalysis(res);
    if(res)setLastKeys(res.entries.flatMap(e=>e.keys));
    setShowFB(true);
  },[weights,mode]);

  const addN=(n)=>{if(n<0||n>36)return;const u=[n,...tl].slice(0,50);setTl(u);run(u);setRetry(0);setMissed(null);setEditIdx(null);};
  const addInput=()=>{const n=parseInt(newN);if(isNaN(n)||n<0||n>36)return;addN(n);setNewN('');};
  const naoBateu=()=>{const n=parseInt(newN);if(retry===0){if(!isNaN(n)&&n>=0&&n<=36)setMissed(n);setRetry(1);setNewN('');}else{if(!isNaN(n)&&n>=0&&n<=36)setMissed(n);setRetry(2);setNewN('');}};
  const editNum=(idx,n)=>{if(n<0||n>36)return;const u=[...tl];u[idx]=n;setTl(u);if(u.length>=3)run(u);setEditIdx(null);};
  const handleFB=(r)=>{
    const nw=updateW(weights,lastKeys,r);setWeights(nw);
    const ns={...stats,total:stats.total+1};
    if(r==='first')ns.first=(stats.first||0)+1;
    if(r==='second')ns.second=(stats.second||0)+1;
    if(r==='miss')ns.miss=(stats.miss||0)+1;
    saveStats(ns);setStats(ns);setShowFB(false);
    startTimer();
    setSessionLog(prev=>[...prev,{result:r,num:tl[0],strategies:lastKeys}].slice(-20));
  };
  const switchMode=(m)=>{setMode(m);if(tl.length>=3)run(tl,weights,m);};
  const semColor=analysis?.sem==='green'?C.green:analysis?.sem==='yellow'?C.gold:C.red;

  const ball=(n,i)=>(
    <div key={i} onClick={()=>setEditIdx(editIdx===i?null:i)}
      style={{width:26,height:26,borderRadius:'50%',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:'bold',cursor:'pointer',
        background:editIdx===i?'rgba(56,189,248,0.3)':n===0?'#082015':RED.has(n)?'#4a0a14':'#111',
        color:editIdx===i?'#fff':n===0?C.green:RED.has(n)?'#ff9090':'#777',
        border:`2px solid ${editIdx===i?C.blue:i===0?C.gold:n===0?'#1a5030':RED.has(n)?'#8a1525':'#222'}`
      }}>{n}</div>
  );

  const bigBall=(n,main,str)=>({width:38,height:38,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:'bold',flexShrink:0,
    background:main?S[str].bg:n===0?'#082015':RED.has(n)?'#3a0a10':'#0f0f0f',
    color:main?S[str].c:n===0?C.green:RED.has(n)?'#ff9090':'#666',
    border:`1px solid ${main?S[str].b:n===0?'#1a5030':RED.has(n)?'#6a1520':'#1a1a1a'}`,
    boxShadow:main?`0 0 12px ${S[str].c}30`:'none'});

  return(<div style={{background:C.bg,minHeight:'100vh',color:C.text,fontFamily:"'Courier New',monospace",paddingBottom:50}}>
    {/* ── VISUAL BACKGROUND ── */}
    <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0,overflow:'hidden'}}>
      {/* NYC Skyline SVG */}
      <svg style={{position:'absolute',bottom:0,left:0,width:'100%',opacity:0.07}} viewBox="0 0 800 300" preserveAspectRatio="xMidYMax meet">
        <rect x="0" y="150" width="800" height="150" fill="#00c87a"/>
        {/* buildings */}
        <rect x="10" y="80" width="40" height="220" fill="#e8f5ff"/>
        <rect x="55" y="110" width="25" height="190" fill="#e8f5ff"/>
        <rect x="85" y="60" width="35" height="240" fill="#e8f5ff"/>
        <rect x="88" y="40" width="8" height="25" fill="#e8f5ff"/>
        <rect x="125" y="90" width="50" height="210" fill="#e8f5ff"/>
        <rect x="180" y="50" width="60" height="250" fill="#e8f5ff"/>
        <rect x="183" y="20" width="12" height="35" fill="#e8f5ff"/>
        <rect x="245" y="100" width="30" height="200" fill="#e8f5ff"/>
        <rect x="280" y="70" width="45" height="230" fill="#e8f5ff"/>
        <rect x="330" y="30" width="55" height="270" fill="#e8f5ff"/>
        <rect x="355" y="0" width="8" height="35" fill="#e8f5ff"/>
        <rect x="390" y="85" width="40" height="215" fill="#e8f5ff"/>
        <rect x="435" y="55" width="65" height="245" fill="#e8f5ff"/>
        <rect x="505" y="95" width="35" height="205" fill="#e8f5ff"/>
        <rect x="545" y="40" width="50" height="260" fill="#e8f5ff"/>
        <rect x="600" y="75" width="40" height="225" fill="#e8f5ff"/>
        <rect x="645" y="110" width="30" height="190" fill="#e8f5ff"/>
        <rect x="680" y="60" width="55" height="240" fill="#e8f5ff"/>
        <rect x="740" y="90" width="35" height="210" fill="#e8f5ff"/>
        <rect x="778" y="120" width="22" height="180" fill="#e8f5ff"/>
        {/* windows */}
        {[...Array(20)].map((_,i)=><rect key={i} x={15+i*38} y={100+Math.sin(i)*20} width="4" height="4" fill="#f5a800" opacity="0.8"/>)}
        {[...Array(15)].map((_,i)=><rect key={i} x={20+i*50} y={130+Math.cos(i)*15} width="3" height="3" fill="#00c87a" opacity="0.6"/>)}
      </svg>

      {/* Roulette wheel silhouette */}
      <div style={{position:'absolute',top:-80,right:-80,width:300,height:300,borderRadius:'50%',border:'2px solid rgba(0,200,122,0.08)',animation:'spin-slow 30s linear infinite'}}>
        <div style={{position:'absolute',inset:20,borderRadius:'50%',border:'1px solid rgba(245,168,0,0.06)'}}/>
        <div style={{position:'absolute',inset:40,borderRadius:'50%',border:'1px solid rgba(0,200,122,0.05)'}}/>
        <div style={{position:'absolute',inset:60,borderRadius:'50%',border:'1px solid rgba(56,189,248,0.04)'}}/>
        {[...Array(37)].map((_,i)=>(
          <div key={i} style={{position:'absolute',top:'50%',left:'50%',width:1,height:'50%',background:'rgba(0,200,122,0.06)',transformOrigin:'0 0',transform:`rotate(${i*9.73}deg)`}}/>
        ))}
      </div>

      {/* Second wheel bottom left */}
      <div style={{position:'absolute',bottom:-100,left:-100,width:280,height:280,borderRadius:'50%',border:'1px solid rgba(245,168,0,0.06)',animation:'spin-slow 40s linear infinite reverse'}}>
        <div style={{position:'absolute',inset:30,borderRadius:'50%',border:'1px solid rgba(212,32,53,0.05)'}}/>
        {[...Array(18)].map((_,i)=>(
          <div key={i} style={{position:'absolute',top:'50%',left:'50%',width:1,height:'50%',background:'rgba(245,168,0,0.05)',transformOrigin:'0 0',transform:`rotate(${i*20}deg)`}}/>
        ))}
      </div>

      {/* Floating numbers */}
      {[0,7,14,21,28,35,3,17,32].map((n,i)=>(
        <div key={i} style={{
          position:'absolute',
          left:`${8+i*11}%`,
          top:`${20+Math.sin(i*0.7)*40}%`,
          fontSize:i%3===0?28:i%3===1?20:14,
          fontWeight:900,
          color:`rgba(${i%2===0?'0,200,122':'245,168,0'},0.04)`,
          fontFamily:'monospace',
          animation:`float ${3+i*0.4}s ease-in-out infinite`,
          animationDelay:`${i*0.3}s`,
          userSelect:'none'
        }}>{n}</div>
      ))}

      {/* Grid lines */}
      <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(0,200,122,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,200,122,0.025) 1px,transparent 1px)',backgroundSize:'40px 40px'}}/>

      {/* Scanlines */}
      <div style={{position:'absolute',inset:0,background:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px)'}}/>

      {/* Glow top */}
      <div style={{position:'absolute',top:0,left:'50%',transform:'translateX(-50%)',width:'60%',height:200,background:'radial-gradient(ellipse,rgba(0,200,122,0.06) 0%,transparent 70%)',animation:'pulse-glow 4s ease-in-out infinite'}}/>

      {/* Glow bottom */}
      <div style={{position:'absolute',bottom:0,right:0,width:300,height:300,background:'radial-gradient(ellipse,rgba(245,168,0,0.04) 0%,transparent 70%)'}}/>
    </div>

    {/* Ticker tape */}
    <div style={{position:'fixed',top:0,left:0,right:0,height:20,background:'rgba(4,8,11,0.95)',borderBottom:'1px solid rgba(0,200,122,0.1)',overflow:'hidden',zIndex:100,display:'flex',alignItems:'center'}}>
      <div style={{display:'flex',gap:0,animation:'ticker 20s linear infinite',whiteSpace:'nowrap'}}>
        {['GIOVANNI VISION','●','REVOLUTION','●','v6.0 PRO','●','ANÁLISE EM TEMPO REAL','●','JOGUE COM RESPONSABILIDADE','●','GIOVANNI VISION','●','REVOLUTION','●','v6.0 PRO','●','ANÁLISE EM TEMPO REAL','●'].map((t,i)=>(
          <span key={i} style={{fontSize:8,color:i%2===0?'rgba(0,200,122,0.5)':'rgba(245,168,0,0.4)',letterSpacing:2,padding:'0 12px'}}>{t}</span>
        ))}
      </div>
    </div>

    <div style={{position:'fixed',inset:0,background:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.04) 2px,rgba(0,0,0,0.04) 4px)',pointerEvents:'none',zIndex:9999}}/>
    <div style={{maxWidth:430,margin:'0 auto',padding:'20px 12px 0',position:'relative',zIndex:1}}>

      {/* HEADER */}
      <div style={{padding:'12px 0 10px',borderBottom:`1px solid ${C.border}`,marginBottom:10,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <div style={{fontSize:18,fontWeight:900,letterSpacing:3,color:C.white}}>GIOVANNI <span style={{color:C.green}}>VISION</span></div>
          <div style={{fontSize:8,color:C.dim,letterSpacing:2}}>REVOLUTION · v6.0 PRO</div>
        </div>
        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:5}}>
          <div style={{display:'flex',gap:4}}>
            <button onClick={()=>switchMode('normal')} style={{padding:'4px 8px',fontSize:9,fontWeight:mode==='normal'?900:400,background:mode==='normal'?'rgba(0,200,122,0.15)':'transparent',border:`1px solid ${mode==='normal'?C.green:C.border}`,borderRadius:5,color:mode==='normal'?C.green:C.dim,cursor:'pointer'}}>NORMAL</button>
            <button onClick={()=>switchMode('sniper')} style={{padding:'4px 8px',fontSize:9,fontWeight:mode==='sniper'?900:400,background:mode==='sniper'?'rgba(245,168,0,0.15)':'transparent',border:`1px solid ${mode==='sniper'?C.gold:C.border}`,borderRadius:5,color:mode==='sniper'?C.gold:C.dim,cursor:'pointer'}}>🎯 SNIPER</button>
          </div>
          <div style={{fontSize:9,color:semColor,display:'flex',alignItems:'center',gap:4}}>
            <div style={{width:6,height:6,borderRadius:'50%',background:semColor,boxShadow:`0 0 6px ${semColor}`}}/>
            {analysis?.sem==='green'?'ENTRAR':analysis?.sem==='yellow'?'CAUTELA':'AGUARDAR'}
          </div>
        </div>
      </div>

      {/* MESA STATUS */}
      {analysis&&<div style={{background:C.panel,border:`1px solid ${analysis.mesa.estavel?'rgba(0,200,122,0.3)':C.red+'66'}`,borderRadius:8,padding:'8px 12px',marginBottom:8,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <div style={{fontSize:9,color:analysis.mesa.estavel?C.green:C.red,fontWeight:900,letterSpacing:1}}>{analysis.mesa.estavel?'✅ MESA ESTÁVEL':'⚠️ MESA INSTÁVEL'}</div>
          <div style={{fontSize:9,color:C.dim,marginTop:2}}>Alt: {analysis.mesa.altPct}% · {analysis.mesa.dominante} · Reg: {analysis.mesa.regiao}</div>
        </div>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:16,fontWeight:900,color:analysis.mesa.estavel?C.green:C.red}}>{analysis.mesa.score}/6</div>
          <div style={{fontSize:8,color:C.dim}}>estab.</div>
        </div>
      </div>}

      {/* TIMER */}
      {timerActive&&timer>0&&<div style={{background:'rgba(56,189,248,0.06)',border:`1px solid ${C.blue}`,borderRadius:8,padding:'8px 12px',marginBottom:8}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:5}}>
          <div style={{fontSize:10,color:C.blue,fontWeight:900}}>⏱ AGUARDANDO NOVA ANÁLISE</div>
          <div style={{fontSize:20,fontWeight:900,color:timer<=10?C.red:C.blue}}>{timer}s</div>
        </div>
        <div style={{height:4,background:'#0a0a0a',borderRadius:2,overflow:'hidden'}}>
          <div style={{height:'100%',width:`${(timer/50)*100}%`,background:timer<=10?C.red:C.blue,borderRadius:2,transition:'width 1s linear'}}/>
        </div>
        <div style={{fontSize:9,color:C.dim,marginTop:4}}>Continue digitando os números que saírem</div>
      </div>}
      {!timerActive&&timer===0&&analysis&&<div style={{background:'rgba(0,200,122,0.04)',border:`1px solid rgba(0,200,122,0.2)`,borderRadius:8,padding:'6px 12px',marginBottom:8,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{fontSize:10,color:C.green}}>✅ Pronto para nova análise</div>
        <button onClick={()=>{setTimer(50);setTimerActive(true);}} style={{fontSize:9,padding:'3px 8px',background:'transparent',border:`1px solid ${C.dim}`,borderRadius:4,color:C.dim,cursor:'pointer'}}>⏱ iniciar timer</button>
      </div>}

      {/* TIMELINE */}
      <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:10,padding:'8px 10px',marginBottom:8}}>
        <div style={{fontSize:8,color:C.dim,letterSpacing:2,marginBottom:5}}>TIMELINE ({tl.length}) → toque para editar</div>
        <div style={{display:'flex',gap:4,overflowX:'auto',minHeight:30}}>
          {tl.length===0?<div style={{fontSize:10,color:C.dim,alignSelf:'center',width:'100%',textAlign:'center'}}>Digite os 20 números para calibrar</div>:tl.slice(0,18).map((n,i)=>ball(n,i))}
          {tl.length>18&&<div style={{fontSize:9,color:C.dim,alignSelf:'center',flexShrink:0,paddingLeft:4}}>+{tl.length-18}</div>}
        </div>
      </div>

      {/* EDIT PANEL */}
      {editIdx!==null&&<div style={{background:'rgba(56,189,248,0.06)',border:`1px solid ${C.blue}`,borderRadius:10,padding:10,marginBottom:8}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:7}}>
          <div style={{fontSize:10,color:C.blue,fontWeight:900}}>✏️ Pos {editIdx+1} — atual: <strong style={{color:C.white}}>{tl[editIdx]}</strong></div>
          <button onClick={()=>{const u=[...tl];u.splice(editIdx,1);setTl(u);if(u.length>=3)run(u);else setAnalysis(null);setEditIdx(null);}} style={{fontSize:9,padding:'3px 8px',background:'rgba(212,32,53,0.15)',border:`1px solid ${C.red}`,borderRadius:5,color:C.red,cursor:'pointer'}}>🗑 APAGAR</button>
        </div>
        <button onClick={()=>editNum(editIdx,0)} style={{display:'block',width:'100%',padding:'6px',background:'#082015',border:'1px solid #1a5030',borderRadius:6,color:C.green,fontFamily:'monospace',fontSize:13,fontWeight:'bold',cursor:'pointer',marginBottom:5}}>— 0 —</button>
        <div style={{display:'grid',gridTemplateColumns:'repeat(9,1fr)',gap:4}}>
          {Array.from({length:36},(_,i)=>i+1).map(n=>(
            <button key={n} onClick={()=>editNum(editIdx,n)} style={{height:36,borderRadius:6,fontFamily:'monospace',fontSize:12,fontWeight:'bold',cursor:'pointer',border:'none',background:RED.has(n)?'#3a0a10':'#101010',color:RED.has(n)?'#ff8090':'#777'}}>{n}</button>
          ))}
        </div>
        <button onClick={()=>setEditIdx(null)} style={{width:'100%',marginTop:6,padding:'5px',background:'transparent',border:`1px solid ${C.dim}`,borderRadius:5,color:C.dim,fontSize:9,cursor:'pointer'}}>CANCELAR</button>
      </div>}

      {/* INPUT */}
      <div style={{marginBottom:8}}>
        <div style={{display:'flex',gap:6,marginBottom:retry>0?6:0}}>
          <input type="number" min="0" max="36" value={newN} onChange={e=>setNewN(e.target.value)} onKeyDown={e=>e.key==='Enter'&&(retry<2?naoBateu():addInput())}
            placeholder={retry===0?'Novo número...':retry===1?'2ª tentativa...':'2 números...'}
            style={{flex:1,background:C.panel,border:`2px solid ${retry===0?C.green:retry===1?C.gold:C.red}`,borderRadius:8,padding:'10px 12px',color:C.white,fontSize:16,fontFamily:'monospace',outline:'none'}}/>
          {retry===0&&<button onClick={addInput} style={{padding:'10px 18px',background:`linear-gradient(135deg,#006040,${C.green})`,border:'none',borderRadius:8,color:'#000',fontWeight:900,fontSize:18,cursor:'pointer'}}>＋</button>}
          {retry===1&&<button onClick={naoBateu} style={{padding:'10px 12px',background:`linear-gradient(135deg,#604000,${C.gold})`,border:'none',borderRadius:8,color:'#000',fontWeight:900,fontSize:10,cursor:'pointer',lineHeight:1.4}}>NÃO<br/>BATEU</button>}
          {retry===2&&<button onClick={addInput} style={{padding:'10px 12px',background:`linear-gradient(135deg,#600010,${C.red})`,border:'none',borderRadius:8,color:'#fff',fontWeight:900,fontSize:10,cursor:'pointer',lineHeight:1.4}}>ADD<br/>NUMS</button>}
        </div>
        {retry===1&&<div style={{background:'#1a0f00',border:`1px solid ${C.gold}`,borderRadius:8,padding:'8px 12px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{fontSize:11,color:C.gold,fontWeight:900}}>🔁 Repete + 1 ficha no <strong style={{color:C.white}}>{missed??'?'}</strong></div>
          <button onClick={()=>{setRetry(0);setMissed(null);}} style={{fontSize:9,padding:'3px 7px',background:'transparent',border:`1px solid ${C.dim}`,borderRadius:4,color:C.dim,cursor:'pointer'}}>DESISTIR</button>
        </div>}
        {retry===2&&<div style={{background:'#1a0008',border:`1px solid ${C.red}`,borderRadius:8,padding:'8px 12px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{fontSize:11,color:C.red,fontWeight:900}}>❌ Desiste → Digite os 2 números</div>
          <button onClick={()=>{setRetry(0);setMissed(null);}} style={{fontSize:9,padding:'3px 7px',background:'transparent',border:`1px solid ${C.dim}`,borderRadius:4,color:C.dim,cursor:'pointer'}}>CANCELAR</button>
        </div>}
      </div>

      {/* CALIBRAÇÃO */}
      {calibrating&&tl.length<20&&<div style={{background:'rgba(56,189,248,0.06)',border:`1px solid ${C.blue}`,borderRadius:10,padding:10,marginBottom:8}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
          <div><div style={{fontSize:10,color:C.blue,fontWeight:900}}>🔬 CALIBRANDO MESA</div>
          <div style={{fontSize:9,color:C.dim,marginTop:2}}>Digite 20 números para análise de aquecimento</div></div>
          <div style={{textAlign:'center'}}><div style={{fontSize:20,fontWeight:900,color:tl.length>=20?C.green:C.blue}}>{tl.length}</div><div style={{fontSize:8,color:C.dim}}>/ 20</div></div>
        </div>
        <div style={{height:4,background:'#0a0a0a',borderRadius:2,overflow:'hidden'}}>
          <div style={{height:'100%',width:`${Math.min(tl.length/20*100,100)}%`,background:`linear-gradient(90deg,${C.blue},${C.green})`,borderRadius:2,transition:'width 0.3s'}}/>
        </div>
      </div>}

      {calibrating&&tl.length>=20&&analysis&&<div style={{background:C.panel,border:`1px solid ${analysis.mesa.estavel?C.green:C.red}`,borderRadius:10,padding:12,marginBottom:8}}>
        <div style={{fontSize:10,color:analysis.mesa.estavel?C.green:C.red,fontWeight:900,marginBottom:8}}>
          {analysis.mesa.estavel?'✅ MESA CALIBRADA — PRONTA PARA JOGAR':'⚠️ MESA INSTÁVEL — CONSIDERE TROCAR'}
        </div>
        <div style={{fontSize:9,color:C.dim,marginBottom:8}}>Estratégias quentes agora:</div>
        {analysis.hotS.length>0?analysis.hotS.map((s,i)=>(
          <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4,padding:'4px 8px',background:'rgba(0,200,122,0.06)',border:'1px solid rgba(0,200,122,0.15)',borderRadius:5}}>
            <div style={{fontSize:11,color:C.green}}>🔥 {s}</div>
          </div>
        )):<div style={{fontSize:10,color:C.dim,textAlign:'center',padding:'8px'}}>Sem padrão claro — aguarde</div>}
        <button onClick={()=>setCalibrating(false)} style={{width:'100%',marginTop:8,padding:'8px',background:`linear-gradient(135deg,#006040,${C.green})`,border:'none',borderRadius:7,color:'#000',fontWeight:900,fontSize:12,cursor:'pointer'}}>🎯 IR PARA O SINAL</button>
      </div>}

      {/* GRID */}
      <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:10,padding:10,marginBottom:10}}>
        <div style={{fontSize:8,color:C.dim,letterSpacing:2,marginBottom:7,textAlign:'center'}}>TOQUE PARA ADICIONAR</div>
        <button onClick={()=>addN(0)} style={{display:'block',width:'100%',padding:'9px',background:'#082015',border:'1px solid #1a5030',borderRadius:7,color:C.green,fontFamily:'monospace',fontSize:15,fontWeight:'bold',cursor:'pointer',marginBottom:7,letterSpacing:3}}>— 0 —</button>
        <div style={{display:'grid',gridTemplateColumns:'repeat(9,1fr)',gap:5}}>
          {Array.from({length:36},(_,i)=>i+1).map(n=>(
            <button key={n} onClick={()=>addN(n)} style={{height:42,borderRadius:7,fontFamily:'monospace',fontSize:14,fontWeight:'bold',cursor:'pointer',border:'none',background:RED.has(n)?'#3a0a10':'#101010',color:RED.has(n)?'#ff8090':'#777'}}>{n}</button>
          ))}
        </div>
        <div style={{display:'flex',gap:6,marginTop:7}}>
          <button onClick={()=>{setTl([]);setAnalysis(null);setRetry(0);setCalibrating(true);setEditIdx(null);}} style={{flex:1,padding:'5px',background:'transparent',border:`1px solid ${C.border}`,borderRadius:5,color:C.dim,fontSize:10,cursor:'pointer'}}>⌫ LIMPAR TUDO</button>
          <button onClick={()=>{if(tl.length===0)return;const u=tl.slice(1);setTl(u);if(u.length>=3)run(u);else setAnalysis(null);}} disabled={tl.length===0} style={{padding:'5px 14px',background:tl.length>0?'rgba(212,32,53,0.12)':'transparent',border:`1px solid ${tl.length>0?C.red:C.border}`,borderRadius:5,color:tl.length>0?C.red:C.dim,fontSize:11,cursor:tl.length>0?'pointer':'default',fontWeight:900}}>⌫ -1</button>
        </div>
      </div>

      {/* TABS */}
      <div style={{display:'flex',gap:4,marginBottom:10}}>
        {[['signal','⚡ SINAL'],['mesa','🎯 MESA'],['session','📋 SESSÃO'],['settings','⚙ CONFIG']].map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={{flex:1,padding:'8px 4px',background:tab===id?C.p2:'transparent',border:`1px solid ${C.border}`,borderRadius:7,color:tab===id?C.white:C.dim,fontSize:9,fontWeight:tab===id?700:400,cursor:'pointer'}}>{label}</button>
        ))}
      </div>

      {/* ── SINAL ── */}
      {tab==='signal'&&analysis&&(<>
        {mode==='sniper'&&<div style={{background:'rgba(245,168,0,0.06)',border:`1px solid ${C.gold}`,borderRadius:8,padding:'8px 12px',marginBottom:8,display:'flex',alignItems:'center',gap:8}}>
          <span>🎯</span><div><div style={{fontSize:10,color:C.gold,fontWeight:900}}>MODO SNIPER — 1 entrada · máxima precisão</div></div>
        </div>}

        {/* SEMÁFORO */}
        {(!analysis.mesa.estavel||analysis.sem==='red')&&<div style={{background:'#140008',border:`2px solid ${C.red}`,borderRadius:12,padding:14,textAlign:'center',marginBottom:8}}>
          <div style={{fontSize:26,marginBottom:4}}>🔴</div>
          <div style={{fontSize:14,fontWeight:900,color:C.red,letterSpacing:2,marginBottom:4}}>
            {!analysis.mesa.estavel?'MESA INSTÁVEL — NÃO ENTRAR':'AGUARDAR — SINAL INSUFICIENTE'}
          </div>
          <div style={{fontSize:10,color:'#b06070',lineHeight:1.6}}>
            {!analysis.mesa.estavel?`Alternância ${analysis.mesa.altPct}% — troque de mesa`:
             Object.keys(analysis.mesa.tc).length>=7?`${Object.keys(analysis.mesa.tc).length} terminais únicos — mesa caótica`:
             !analysis.regiaoConverge?'Entradas em regiões diferentes — aguarde convergência':
             'Perm e Cam sem convergência — aguarde'}
          </div>
        </div>}

        {analysis.sem==='yellow'&&analysis.mesa.estavel&&<div style={{background:'#120f00',border:`2px solid ${C.gold}`,borderRadius:12,padding:12,marginBottom:8}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}><span style={{fontSize:20}}>🟡</span><div><div style={{fontSize:12,fontWeight:900,color:C.gold}}>CAUTELA — Entre com fichas menores</div></div></div>
          <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>{analysis.hotS.map((s,i)=><span key={i} style={{fontSize:9,padding:'2px 6px',background:'rgba(245,168,0,0.1)',color:C.gold,border:'1px solid rgba(245,168,0,0.25)',borderRadius:4}}>{s}</span>)}</div>
        </div>}

        {analysis.sem==='green'&&<div style={{background:'#001408',border:`2px solid ${C.green}`,borderRadius:12,padding:12,marginBottom:8}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
            <span style={{fontSize:20}}>🟢</span>
            <div style={{flex:1}}><div style={{fontSize:12,fontWeight:900,color:C.green}}>ENTRAR — SINAL FORTE</div>
            <div style={{fontSize:9,color:'#60b080'}}>{analysis.score} estratégias · região {analysis.topRegCands} convergindo</div></div>
          </div>
          <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>{analysis.hotS.map((s,i)=><span key={i} style={{fontSize:9,padding:'2px 6px',background:'rgba(0,200,122,0.1)',color:C.green,border:'1px solid rgba(0,200,122,0.25)',borderRadius:4}}>{s}</span>)}</div>
        </div>}

        {/* ENTRADAS — sempre mostra TX e 1 ficha, entradas principais só com sinal */}
        {(analysis.sem==='green'||analysis.sem==='yellow')&&<>
          {analysis.entries.map((e,i)=>(<div key={i} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:10,marginBottom:7,position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',left:0,top:0,bottom:0,width:3,background:S[e.str].c}}/>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:7}}>
              <div style={{fontSize:9,color:C.dim}}>{e.reasons[0]} · {e.regiao==='T'?'Tier':e.regiao==='V'?'Voisins':e.regiao==='Z'?'Zero':'Orph'}</div>
              <div style={{fontSize:9,padding:'2px 6px',borderRadius:3,background:S[e.str].bg,color:S[e.str].c,border:`1px solid ${S[e.str].b}`}}>{S[e.str].l}</div>
            </div>
            <div style={{display:'flex',flexWrap:'wrap',gap:5,marginBottom:5}}>{e.nb.map((n,j)=><div key={j} style={bigBall(n,n===e.main,e.str)}>{n}</div>)}</div>
            <div style={{fontSize:10,color:C.dim}}><span style={{color:C.white}}>{e.main} com {e.vc}V</span> · {e.nb.length} números</div>
            <div style={{marginTop:4,padding:'3px 8px',background:'rgba(255,255,255,0.03)',borderRadius:4,fontSize:9,color:C.dim,display:'flex',gap:8}}>
              <span>🟡 <b style={{color:C.white}}>{e.main}</b> → 2 fichas</span><span>⚪ vizinhos → 1 ficha</span>
            </div>
          </div>))}

          {/* SNIPER EXTRAS */}
          {mode==='sniper'&&<div style={{background:C.bg,border:`1px solid rgba(245,168,0,0.2)`,borderRadius:10,padding:10,marginBottom:7}}>
            <div style={{fontSize:9,color:C.gold,marginBottom:7}}>🎯 EXTRAS — 1 ficha cada</div>
            <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
              {analysis.topFrios.slice(0,2).map((n,i)=><div key={i} style={{display:'flex',alignItems:'center',gap:4,background:'rgba(56,189,248,0.06)',border:'1px solid rgba(56,189,248,0.2)',borderRadius:7,padding:'5px 8px'}}>
                <div style={{width:26,height:26,borderRadius:'50%',background:RED.has(n)?'#3a0a10':'#0f0f0f',color:RED.has(n)?'#ff9090':'#777',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:'bold'}}>{n}</div>
                <div style={{fontSize:9,color:C.blue}}>❄️</div>
              </div>)}
              {analysis.fantasmaNum!==undefined&&<div style={{display:'flex',alignItems:'center',gap:4,background:'rgba(240,212,0,0.06)',border:'1px solid rgba(240,212,0,0.2)',borderRadius:7,padding:'5px 8px'}}>
                <div style={{width:26,height:26,borderRadius:'50%',background:RED.has(analysis.fantasmaNum)?'#3a0a10':'#0f0f0f',color:RED.has(analysis.fantasmaNum)?'#ff9090':'#777',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:'bold'}}>{analysis.fantasmaNum}</div>
                <div style={{fontSize:9,color:'#f0d060'}}>👻</div>
              </div>}
              {analysis.zeroprot&&<div style={{display:'flex',alignItems:'center',gap:4,background:'rgba(0,200,122,0.06)',border:'1px solid rgba(0,200,122,0.2)',borderRadius:7,padding:'5px 8px'}}>
                <div style={{width:26,height:26,borderRadius:'50%',background:'#082015',color:C.green,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:'bold'}}>0</div>
                <div style={{fontSize:9,color:C.green}}>T sat.</div>
              </div>}
            </div>
          </div>}

          {/* FEEDBACK */}
          {showFB&&<div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:10,padding:10,marginBottom:8}}>
            <div style={{fontSize:9,color:C.dim,letterSpacing:2,marginBottom:7,textAlign:'center'}}>COMO FOI?</div>
            <div style={{display:'flex',gap:5}}>
              {[['first','✅ BATEU','1ª',C.green],['second','🔄 BATEU','2ª',C.blue],['miss','❌ NÃO','BATEU','#ff7090']].map(([r,l1,l2,c])=>(
                <button key={r} onClick={()=>handleFB(r)} style={{flex:1,padding:'8px 3px',background:`${c}18`,border:`1px solid ${c}44`,borderRadius:7,color:c,fontSize:11,fontWeight:700,cursor:'pointer',lineHeight:1.4}}>{l1}<br/><span style={{fontSize:9,fontWeight:400}}>{l2}</span></button>
              ))}
            </div>
          </div>}

          <div style={{background:'#0a0a00',border:'1px solid #1a1a00',borderRadius:7,padding:'7px 10px',fontSize:9,color:'#888',lineHeight:1.6}}>
            🔁 Não bateu → NÃO BATEU → repete · 2x → digita os 2 números
          </div>
        </>}
      </>)}

      {/* ── MESA ── */}
      {tab==='mesa'&&analysis&&(<div>
        <div style={{display:'flex',gap:5,marginBottom:10}}>
          {Object.entries(analysis.mesa.rc).map(([reg,count])=>{
            const colors={T:C.green,V:C.blue,O:C.gold,Z:'#a0ffa0'};
            return(<div key={reg} style={{flex:1,background:C.panel,border:`1px solid ${C.border}`,borderRadius:8,padding:'8px 5px',textAlign:'center'}}>
              <div style={{fontSize:8,color:C.dim,marginBottom:3}}>{reg==='T'?'TIER':reg==='V'?'VOISINS':reg==='O'?'ORPH':'ZERO'}</div>
              <div style={{fontSize:18,fontWeight:900,color:colors[reg]||C.dim}}>{count}</div>
              <div style={{height:3,background:'#0a0a0a',borderRadius:2,marginTop:5,overflow:'hidden'}}><div style={{height:'100%',width:`${Math.round(count/14*100)}%`,background:colors[reg]||C.dim,borderRadius:2}}/></div>
            </div>);
          })}
        </div>

        <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:10,padding:10,marginBottom:8}}>
          <div style={{fontSize:9,color:C.blue,letterSpacing:2,marginBottom:5}}>❄️ NÚMEROS FRIOS</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
            {[...Array(37).keys()].filter(n=>!tl.slice(0,20).includes(n)).map((n,i)=>(
              <div key={i} style={{width:28,height:28,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:'bold',background:n===0?'#082015':RED.has(n)?'#3a0a10':'#101010',color:n===0?C.green:RED.has(n)?'#ff9090':'#888',border:'1px solid #38bdf830'}}>{n}</div>
            ))}
          </div>
        </div>

        <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:10,padding:10,marginBottom:8}}>
          <div style={{fontSize:9,color:C.dim,letterSpacing:2,marginBottom:7}}>// TERMINAIS</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
            {Object.entries(analysis.tc).sort((a,b)=>b[1]-a[1]).map(([t,count])=>(
              <div key={t} style={{padding:'3px 9px',borderRadius:5,background:count>=3?'rgba(0,200,122,0.12)':count>=2?'rgba(245,168,0,0.12)':'rgba(255,255,255,0.03)',border:`1px solid ${count>=3?'rgba(0,200,122,0.25)':count>=2?'rgba(245,168,0,0.25)':C.border}`,color:count>=3?C.green:count>=2?C.gold:C.dim,fontSize:11,fontWeight:700}}>T{t} ({count}x)</div>
            ))}
          </div>
        </div>

        {/* MAPA DE CALOR DA RODA */}
        <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:10,padding:10,marginBottom:8}}>
          <div style={{fontSize:9,color:C.gold,letterSpacing:2,marginBottom:8}}>// MAPA DE CALOR — RODA FÍSICA</div>
          <div style={{fontSize:9,color:C.dim,marginBottom:8}}>Setores quentes baseado na timeline</div>
          {(()=>{
            const WHEEL_ORDER=[0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
            const freq={};
            tl.slice(0,20).forEach(n=>{freq[n]=(freq[n]||0)+1;});
            const maxF=Math.max(...Object.values(freq),1);
            // Dividir roda em 4 setores
            const setores=[
              {nome:'TIER',nums:[5,8,10,11,13,16,23,24,27,30,33,36],color:C.green},
              {nome:'VOISINS',nums:[0,2,3,4,7,12,15,18,19,21,22,25,26,28,29,32,35],color:C.blue},
              {nome:'ORPH',nums:[1,6,9,14,17,20,31,34],color:C.gold},
              {nome:'ZERO',nums:[0],color:'#a0ffa0'},
            ];
            return(<>
              {/* Roda linear */}
              <div style={{display:'flex',overflowX:'auto',gap:2,marginBottom:10,paddingBottom:4}}>
                {WHEEL_ORDER.map((n,i)=>{
                  const f=freq[n]||0;
                  const intensity=f/maxF;
                  const bg=f>=3?`rgba(245,168,0,${0.3+intensity*0.7})`:f>=2?`rgba(0,200,122,${0.2+intensity*0.5})`:f>=1?'rgba(56,189,248,0.2)':'#0a0a0a';
                  const color=f>=2?'#fff':f>=1?C.text:'#333';
                  return(<div key={i} style={{minWidth:20,height:32,borderRadius:3,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:bg,border:`1px solid ${f>=2?C.gold:f>=1?C.blue:'#111'}`,flexShrink:0}}>
                    <div style={{fontSize:8,fontWeight:f>=1?900:400,color}}>{n}</div>
                    {f>0&&<div style={{fontSize:7,color:C.gold,lineHeight:1}}>{f}x</div>}
                  </div>);
                })}
              </div>
              {/* Score por setor */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:5}}>
                {setores.filter(s=>s.nome!=='ZERO').map(s=>{
                  const total=s.nums.reduce((a,n)=>a+(freq[n]||0),0);
                  const pct=Math.round(total/Math.max(tl.slice(0,20).length,1)*100);
                  return(<div key={s.nome} style={{background:C.bg,border:`1px solid ${total>=3?s.color+'66':C.border}`,borderRadius:7,padding:'6px 8px'}}>
                    <div style={{display:'flex',justifyContent:'space-between'}}>
                      <div style={{fontSize:10,color:total>=3?s.color:C.dim,fontWeight:700}}>{s.nome}</div>
                      <div style={{fontSize:12,fontWeight:900,color:total>=3?s.color:C.dim}}>{pct}%</div>
                    </div>
                    <div style={{height:3,background:'#0a0a0a',borderRadius:2,marginTop:4,overflow:'hidden'}}>
                      <div style={{height:'100%',width:`${pct}%`,background:s.color,borderRadius:2}}/>
                    </div>
                    <div style={{fontSize:8,color:C.dim,marginTop:2}}>{total} quedas</div>
                  </div>);
                })}
              </div>
            </>);
          })()}
        </div>

        <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:10,padding:10}}>
          <div style={{fontSize:9,color:C.blue,letterSpacing:2,marginBottom:7}}>// LEITURA</div>
          {[`Região dominante: ${analysis.mesa.regiao==='T'?'Tier':analysis.mesa.regiao==='V'?'Voisins':analysis.mesa.regiao==='Z'?'Zero':'Orph'}`,
            `Alternância: ${analysis.mesa.altPct}% ${analysis.mesa.altPct>70?'⚠️ alta':'✅ ok'}`,
            `Terminal: ${analysis.mesa.dominante}`,
            tl[0]&&MIRRORS[tl[0]]&&`Espelho: ${tl[0]} → ${MIRRORS[tl[0]]}`,
            tl[0]&&tl[1]&&`Cam.Dupla: ${tl[0]}+${tl[1]}=${(()=>{let x=tl[0]+tl[1];while(x>36)x=dsum(x);return x;})()}`,
            analysis.zeroprot&&'⚠️ Terminal saturado — 0 em alerta!',
          ].filter(Boolean).map((r,i)=>(
            <div key={i} style={{fontSize:11,color:C.text,lineHeight:1.6,marginBottom:3,paddingLeft:10,position:'relative'}}>
              <span style={{position:'absolute',left:0,color:C.dim,fontSize:9}}>▸</span>{r}
            </div>
          ))}
        </div>
      </div>)}

      {/* ── SESSÃO ── */}
      {tab==='session'&&(<div>
        <div style={{fontSize:9,color:C.dim,letterSpacing:2,marginBottom:8}}>// HISTÓRICO DA SESSÃO</div>
        <div style={{display:'flex',gap:5,marginBottom:10}}>
          {[['TOTAL',stats.total||0,C.white],['1ª',stats.first||0,C.green],['2ª',stats.second||0,C.blue],['ERROS',stats.miss||0,C.red]].map(([l,v,c])=>(
            <div key={l} style={{flex:1,background:C.panel,border:`1px solid ${C.border}`,borderRadius:7,padding:'7px 4px',textAlign:'center'}}>
              <div style={{fontSize:8,color:c,marginBottom:2}}>{l}</div>
              <div style={{fontSize:17,fontWeight:900,color:c}}>{v}</div>
            </div>
          ))}
        </div>
        {stats.total>0&&<div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:8,padding:'10px 12px',marginBottom:10,textAlign:'center'}}>
          <div style={{fontSize:11,color:C.dim}}>Taxa de acerto</div>
          <div style={{fontSize:28,fontWeight:900,color:Math.round(((stats.first||0)+(stats.second||0))/(stats.total||1)*100)>=65?C.green:C.gold}}>
            {Math.round(((stats.first||0)+(stats.second||0))/(stats.total||1)*100)}%
          </div>
          <div style={{fontSize:9,color:C.dim}}>Meta: 65%+</div>
        </div>}
        {sessionLog.length>0&&<div>
          <div style={{fontSize:9,color:C.dim,marginBottom:6}}>Últimas entradas:</div>
          {[...sessionLog].reverse().slice(0,8).map((log,i)=>(
            <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'5px 8px',background:C.panel,border:`1px solid ${log.result==='first'?'rgba(0,200,122,0.2)':log.result==='second'?'rgba(56,189,248,0.2)':'rgba(212,32,53,0.2)'}`,borderRadius:6,marginBottom:4}}>
              <div style={{fontSize:10,color:log.result==='first'?C.green:log.result==='second'?C.blue:C.red}}>
                {log.result==='first'?'✅':log.result==='second'?'🔄':'❌'} {log.result==='first'?'Bateu 1ª':log.result==='second'?'Bateu 2ª':'Não bateu'}
              </div>
              <div style={{fontSize:9,color:C.dim}}>{log.strategies?.slice(0,2).join(', ')}</div>
            </div>
          ))}
        </div>}
      </div>)}

      {/* ── CONFIG ── */}
      {tab==='settings'&&(<div>
        <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:10,padding:12,marginBottom:8}}>
          <div style={{fontSize:9,color:C.dim,letterSpacing:2,marginBottom:8}}>// PESOS DAS ESTRATÉGIAS</div>
          {Object.entries(weights).sort((a,b)=>b[1]-a[1]).map(([k,v])=>{
            const labels={perm:'Permanência',camuflagem:'Camuflagem',camDupla:'Cam.Dupla★',terminal:'Terminal',espelho:'Espelho',cavalo:'Cavalo',fantasma:'Fantasma',frio:'Nº Frio',distancia:'Distância',ciclo:'Ciclo',tripleX:'Triple X'};
            const c=v>=1.3?C.green:v>=0.8?C.text:C.red;
            return(<div key={k} style={{display:'flex',alignItems:'center',gap:6,marginBottom:5}}>
              <div style={{fontSize:9,color:c,width:75,flexShrink:0}}>{labels[k]||k}</div>
              <div style={{flex:1,height:3,background:'#0a0a0a',borderRadius:2,overflow:'hidden'}}><div style={{height:'100%',width:`${Math.round(v/3*100)}%`,background:c,borderRadius:2}}/></div>
              <div style={{fontSize:9,fontWeight:900,color:c,width:25,textAlign:'right'}}>{v.toFixed(1)}</div>
            </div>);
          })}
          <button onClick={()=>{saveW({...DW});setWeights({...DW});}} style={{width:'100%',marginTop:8,padding:'5px',background:'transparent',border:`1px solid ${C.dim}`,borderRadius:5,color:C.dim,fontSize:9,cursor:'pointer'}}>RESETAR PESOS</button>
        </div>
        <button onClick={()=>setConfirm(true)} style={{width:'100%',padding:9,background:'transparent',border:`1px solid ${C.red}`,borderRadius:7,color:C.red,fontSize:11,cursor:'pointer',letterSpacing:2}}>↺ LIMPAR TUDO</button>
        {confirm&&<div style={{marginTop:7,background:'#1a0810',border:`1px solid ${C.red}`,borderRadius:8,padding:10,textAlign:'center'}}>
          <div style={{fontSize:11,color:'#ff8090',marginBottom:8}}>Limpar tudo?</div>
          <div style={{display:'flex',gap:6}}>
            <button onClick={()=>{setTl([]);setAnalysis(null);setRetry(0);setCalibrating(true);const ns={total:0,first:0,second:0,miss:0};saveStats(ns);setStats(ns);setSessionLog([]);setConfirm(false);}} style={{flex:1,padding:7,background:C.red,border:'none',borderRadius:5,color:'#fff',fontSize:11,cursor:'pointer'}}>SIM</button>
            <button onClick={()=>setConfirm(false)} style={{flex:1,padding:7,background:'transparent',border:`1px solid ${C.border}`,borderRadius:5,color:C.dim,fontSize:11,cursor:'pointer'}}>NÃO</button>
          </div>
        </div>}
      </div>)}

      <div style={{textAlign:'center',fontSize:8,color:'#1a2a38',marginTop:18,lineHeight:1.8}}>
        ⚠ FERRAMENTA DE ESTUDO · JOGUE COM RESPONSABILIDADE<br/>
        PERM · CAM · CAMDUPLA · ESPELHO · FANTASMA · FRIO · DISTÂNCIA
      </div>
    </div>
    <style>{`
      *{box-sizing:border-box}
      input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}
      ::-webkit-scrollbar{display:none}
      input::placeholder{color:#2e4a60}
      @keyframes float{0%,100%{transform:translateY(0px)}50%{transform:translateY(-8px)}}
      @keyframes spin-slow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      @keyframes pulse-glow{0%,100%{opacity:0.15}50%{opacity:0.35}}
      @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
    `}</style>
  </div>);
}
