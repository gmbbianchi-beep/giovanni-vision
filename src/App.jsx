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
      <div style={{fontSize:9,color:'#2e4a60',letterSpacing:2,marginBottom:40}}>REVOLUTION · ACESSO RESTRITO</div>
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
const QUEBRA={0:[6,9,11,13,15,17,22,32,34,36],1:[0,4,9,19,13],2:[0,5,18,22,28],3:[0,1,4,13],4:[0,7,13,24],5:[0,18,25,28],6:[0,2,9,20,27],7:[0,5,27,32],8:[0,4,28,20],9:[0,1,11,27],10:[0,9,21,29],11:[0,4,20,29],12:[0,6,15,24],13:[0,2,9,20],14:[0,4,8],15:[0,9,12,13,20,26],16:[0,3,9,13,21],17:[0,24,20,29],18:[0,6,20,23],19:[0,13,16,28],20:[0,2,17],21:[0,16,13,29],22:[0,2,5,13,29],23:[0,2,18],24:[0,9],25:[0,5,7,22],26:[0,2,18,24],27:[0,30,33,36],28:[0,11,20],29:[0,11,13,14,20,21],30:[0,7,20,21],31:[0,4,11],32:[0,9,13,14,27],33:[0,9,25,28],34:[0,9,14,35],35:[0,20,33,34,36],36:[0,12,34,35]};
const MIRRORS={1:13,13:1,22:25,25:22,2:20,20:2,3:30,30:3,4:31,31:4,5:32,32:5,6:33,33:6,7:34,34:7,8:26,26:8,9:27,27:9,10:23,23:10,11:36,36:11,12:35,35:12,14:19,19:14,15:21,21:15,16:28,28:16,17:29,29:17,18:24,24:18};
const HORSES=[[1,4,7],[2,5,8],[3,6,9]];
// NÚMERO FANTASMA — baseado em análise de 3 mesas / 500 números
const FANTASMA={0:20,1:21,2:35,3:24,4:29,5:18,6:12,7:34,8:19,9:33};
// CICLOS DE TERMINAIS — confirmados nas 3 mesas
const CICLOS={3:[6],1:[4],6:[5,2],4:[0],9:[3]};

function wpos(n){return WHEEL.indexOf(n);}
function nbrs(n,c){const p=wpos(n);if(p<0)return[];return Array.from({length:c*2+1},(_,i)=>WHEEL[(p-c+i+WHEEL.length)%WHEEL.length]);}
function term(n){return n%10;}
function dsum(n){if(n<=9)return n;const s=Math.floor(n/10)+(n%10);return s>9?Math.floor(s/10)+(s%10):s;}
function region(n){if(n===0)return'Zero';if(TIER.has(n))return'Tier';if(VOIS.has(n))return'Voisins';return'Orph';}

// ── LEARNING ──────────────────────────────────────────────────────
const DW={perm:1.2,terminal:1,camuflagem:1.3,camDupla:1.4,cavalo:0.9,espelho:1,espDuplo:1.1,tripleX:1,fantasma:1.2,frio:1.3,distancia:1.1,ciclo:1,quebra:0.8};
function loadW(){try{const s=localStorage.getItem('gv_w');return s?JSON.parse(s):{...DW};}catch{return{...DW};}}
function saveW(w){try{localStorage.setItem('gv_w',JSON.stringify(w));}catch{}}
function loadStats(){try{const s=localStorage.getItem('gv_st');return s?JSON.parse(s):{total:0,first:0,second:0,miss:0};}catch{return{total:0,first:0,second:0,miss:0};}}
function saveStats(s){try{localStorage.setItem('gv_st',JSON.stringify(s));}catch{}}
function updateW(weights,strats,result){
  const nw={...weights};
  const boost=result==='first'?0.15:result==='second'?0.05:-0.10;
  strats.forEach(s=>{if(nw[s]!==undefined)nw[s]=Math.max(0.1,Math.min(3,nw[s]+boost));});
  saveW(nw);return nw;
}

// ── MONTE CARLO ───────────────────────────────────────────────────
function monteCarlo(history){
  if(history.length<8)return{tx:{fx1:12,fx2:9,pct:0,top3:[]},uf:{fx1:37,fx2:3,pct:0,top3:[]},pct:0};
  const total=history.length-1;
  const txR=[];
  for(let f1=5;f1<=20;f1++)for(let f2=1;f2<=9;f2++){
    let h=0;
    for(let i=1;i<history.length;i++){const t=term(history[i]);let tg=t+f1+t+f2;while(tg>36)tg=dsum(tg);if(nbrs(tg,2).includes(history[i-1]))h++;}
    txR.push({fx1:f1,fx2:f2,hits:h,pct:Math.round(h/total*100)});
  }
  txR.sort((a,b)=>b.hits-a.hits);
  const ufR=[];
  for(let f1=20;f1<=50;f1++)for(let f2=1;f2<=9;f2++){
    let h=0;
    for(let i=1;i<history.length;i++){const t=term(history[i]);let tg=t+f1+f2;while(tg>36)tg=dsum(tg);if(history[i-1]===tg)h++;}
    ufR.push({fx1:f1,fx2:f2,hits:h,pct:Math.round(h/total*100)});
  }
  ufR.sort((a,b)=>b.hits-a.hits);
  let ch=0;
  for(let i=1;i<history.length;i++){
    const last=history[i],prev=history[i-1],t=term(last);
    const cam=dsum(last);
    if((PERM[last]||[]).some(n=>nbrs(n,2).includes(prev)))ch++;
    else if([cam,cam+10,cam+20,cam+30].filter(x=>x<=36).some(n=>nbrs(n,1).includes(prev)))ch++;
  }
  return{tx:{...txR[0],top3:txR.slice(0,3)},uf:{...ufR[0],top3:ufR.slice(0,3)},pct:Math.round(ch/total*100)};
}

// ── STRATEGY TEST ─────────────────────────────────────────────────
function testStrats(history){
  if(history.length<6)return{perm:0,terminal:0,camuflagem:0,camDupla:0,cavalo:0,espelho:0,espDuplo:0,tripleX:0,fantasma:0,frio:0,distancia:0,ciclo:0,quebra:0};
  const r={perm:0,terminal:0,camuflagem:0,camDupla:0,cavalo:0,espelho:0,espDuplo:0,tripleX:0,fantasma:0,frio:0,distancia:0,ciclo:0,quebra:0};
  const total=Math.min(history.length-1,20);
  for(let i=1;i<=total;i++){
    const last=history[i],prev=history[i-1],t=term(last);
    const second=history[i+1];
    if((PERM[last]||[]).some(n=>nbrs(n,2).includes(prev)))r.perm++;
    if([t,t+10,t+20,t+30].filter(x=>x<=36).some(n=>nbrs(n,1).includes(prev)))r.terminal++;
    const cam=dsum(last);if([cam,cam+10,cam+20,cam+30].filter(x=>x<=36).some(n=>nbrs(n,1).includes(prev)))r.camuflagem++;
    // Camuflagem dupla
    if(second!==undefined){const cd=dsum(last+second);if([cd,cd+10,cd+20,cd+30].filter(x=>x<=36).some(n=>nbrs(n,1).includes(prev)))r.camDupla++;}
    const horse=HORSES.find(h=>h.includes(t));if(horse&&horse.flatMap(t2=>[t2,t2+10,t2+20,t2+30].filter(x=>x<=36)).some(n=>nbrs(n,1).includes(prev)))r.cavalo++;
    if(MIRRORS[last]&&nbrs(MIRRORS[last],2).includes(prev))r.espelho++;
    if(second!==undefined&&MIRRORS[second]&&nbrs(MIRRORS[second],1).includes(prev))r.espDuplo++;
    let tx=t+12+t+9;while(tx>36)tx=dsum(tx);if(nbrs(tx,2).includes(prev))r.tripleX++;
    if(FANTASMA[t]===prev)r.fantasma++;
    const r20=history.slice(i,Math.min(i+20,history.length));if(!r20.includes(prev))r.frio++;
    const p0=wpos(last);if(p0>=0&&[13,15,17].some(d=>WHEEL[(p0+d)%37]===prev||WHEEL[(p0-d+37)%37]===prev))r.distancia++;
    if(CICLOS[t]&&CICLOS[t].some(tc=>[tc,tc+10,tc+20,tc+30].filter(x=>x<=36).some(n=>n===prev)))r.ciclo++;
    if((QUEBRA[last]||[]).some(n=>nbrs(n,1).includes(prev)))r.quebra++;
  }
  return Object.fromEntries(Object.entries(r).map(([k,v])=>[k,Math.round(v/total*100)]));
}

// ── MAIN ANALYSIS ─────────────────────────────────────────────────
function analyze(nums,opt,weights,mode){
  if(!nums||nums.length<3)return null;
  const w=weights||DW;
  const scores={};
  const add=(n,pts,key,reason)=>{
    if(n<0||n>36)return;
    if(!scores[n])scores[n]={pts:0,reasons:[],keys:[]};
    scores[n].pts+=pts*(w[key]||1);
    if(!scores[n].reasons.includes(reason))scores[n].reasons.push(reason);
    if(!scores[n].keys.includes(key))scores[n].keys.push(key);
  };

  const last=nums[0],second=nums[1],third=nums[2];
  const t1=term(last),t2=second!==undefined?term(second):null,t3=third!==undefined?term(third):null;

  // 1. PERMANÊNCIA dos 3 números (aprendido com Prodígio)
  (PERM[last]||[]).forEach(n=>add(n,3,'perm',`Perm ${last}`));
  if(second!==undefined)(PERM[second]||[]).forEach(n=>add(n,2,'perm',`Perm ${second}`));
  if(third!==undefined)(PERM[third]||[]).forEach(n=>add(n,1,'perm',`Perm ${third}`));

  // 2. CAMUFLAGEM do último (estratégia #1 do Prodígio!)
  const cam=dsum(last);
  if(cam>0)[cam,cam+10,cam+20,cam+30].filter(x=>x<=36).forEach(n=>add(n,3,'camuflagem',`Cam ${last}→${cam}`));

  // 3. CAMUFLAGEM DUPLA (nova descoberta dos 20 sinais)
  if(second!==undefined){
    let cd=last+second;while(cd>36)cd=dsum(cd);
    [cd,cd+10,cd+20,cd+30].filter(x=>x<=36&&x>0).forEach(n=>add(n,2.5,'camDupla',`CamDupla ${last}+${second}=${cd}`));
  }

  // 4. TERMINAL do último
  [t1,t1+10,t1+20,t1+30].filter(x=>x<=36&&x>0).forEach(n=>add(n,2,'terminal',`T${t1}`));

  // 5. ESPELHO do último + segundo (Prodígio usa muito)
  if(MIRRORS[last])add(MIRRORS[last],2,'espelho',`Espelho ${last}→${MIRRORS[last]}`);
  if(second!==undefined&&MIRRORS[second])add(MIRRORS[second],1.5,'espDuplo',`Esp2 ${second}→${MIRRORS[second]}`);

  // 6. CAVALO
  const horse=HORSES.find(h=>h.includes(t1));
  if(horse)horse.forEach(t=>[t,t+10,t+20,t+30].filter(x=>x<=36&&x>0).forEach(n=>add(n,1,'cavalo',`Cavalo ${horse.join('-')}`)));

  // 7. QUEBRA
  (QUEBRA[last]||[]).forEach(n=>add(n,1.5,'quebra',`Quebra ${last}`));

  // 8. TERMINAL REPETIDO → zero
  const tc={};nums.forEach(n=>{const t=n%10;tc[t]=(tc[t]||0)+1;});
  const maxT=Math.max(...Object.values(tc));
  if(maxT>=3)add(0,3*(w.terminal||1),'terminal',`T rep ${maxT}x`);

  // 9. TRIPLE X OTIMIZADO (soma fixos=20, melhor por análise Monte Carlo)
  const fx1=opt?.tx?.fx1||12,fx2=opt?.tx?.fx2||9;
  let tx=t1+fx1+t1+fx2;while(tx>36)tx=dsum(tx);
  nbrs(tx,2).forEach(n=>add(n,2,'tripleX','Triple X'));

  // 10. NÚMERO FANTASMA (confirmado em 3 mesas)
  if(FANTASMA[t1]!==undefined)add(FANTASMA[t1],3,'fantasma',`Fantasma T${t1}→${FANTASMA[t1]}`);

  // 11. DISTÂNCIA GEOMÉTRICA NA RODA (13,15,17 posições)
  const p0=wpos(last);
  if(p0>=0)[13,15,17].forEach(d=>{
    add(WHEEL[(p0+d)%37],1.5,'distancia',`Dist ${d}`);
    add(WHEEL[(p0-d+37)%37],1.5,'distancia',`Dist ${d}`);
  });

  // 12. NÚMERO FRIO (ausente há 20+ rodadas — 58% nas 3 mesas!)
  const recent20=nums.slice(0,Math.min(20,nums.length));
  const frios=[...Array(37).keys()].filter(n=>!recent20.includes(n));
  frios.forEach(n=>add(n,1.5,'frio','Frio'));

  // 13. CICLOS DE TERMINAIS
  if(CICLOS[t1])CICLOS[t1].forEach(tc2=>[tc2,tc2+10,tc2+20,tc2+30].filter(x=>x<=36&&x>0).forEach(n=>add(n,2,'ciclo',`Ciclo T${t1}→T${tc2}`)));

  // 14. REPETIÇÕES
  const freq={};nums.forEach(n=>{freq[n]=(freq[n]||0)+1;});
  Object.entries(freq).filter(([,v])=>v>=2).forEach(([n,v])=>add(parseInt(n),v*1.5,'perm',`Rep ${v}x`));

  // ── BUILD ENTRIES ──────────────────────────────────────────────
  const sorted=Object.entries(scores).map(([n,d])=>({n:parseInt(n),...d})).sort((a,b)=>b.pts-a.pts);
  const entries=[];const used=new Set();
  const maxE=mode==='sniper'?1:3;
  const minPts=mode==='sniper'?8:4;
  const cands=sorted.filter(c=>c.pts>=minPts).slice(0,maxE+3);
  if(!cands.length)cands.push(...sorted.slice(0,maxE));
  cands.forEach(c=>{
    if(used.has(c.n)||entries.length>=maxE)return;
    const str=c.pts>=12?'s':c.pts>=7?'m':'n';
    const vc=mode==='sniper'?(str==='s'?3:2):(str==='s'?3:str==='m'?2:1);
    const nb=nbrs(c.n,vc);
    if(nb.filter(x=>used.has(x)).length>nb.length*0.6&&entries.length>0)return;
    nb.forEach(x=>used.add(x));used.add(c.n);
    entries.push({main:c.n,nb,vc,str,pts:c.pts,reasons:c.reasons.slice(0,3),keys:c.keys});
  });

  // ── UMA FICHA ──────────────────────────────────────────────────
  const uf1=opt?.uf?.fx1||37,uf2=opt?.uf?.fx2||3;
  let uf=t1+uf1+uf2;while(uf>36)uf=dsum(uf);

  // ── SEMÁFORO ───────────────────────────────────────────────────
  const regions={Tier:0,Voisins:0,Orph:0,Zero:0};
  nums.slice(0,14).forEach(n=>{regions[region(n)]++;});
  const topR=Object.entries(regions).sort((a,b)=>b[1]-a[1])[0];
  const recent12=nums.slice(0,12);
  const regSeq=recent12.map(n=>region(n));
  let alts=0;for(let i=1;i<regSeq.length;i++)if(regSeq[i]!==regSeq[i-1])alts++;
  const instavel=alts>regSeq.length*0.75&&maxT<3&&Math.max(...Object.values(freq))<2;

  const hotS=[];
  const allKeys=entries.flatMap(e=>e.keys);
  if(allKeys.includes('perm'))hotS.push('Permanência');
  if(allKeys.includes('camuflagem'))hotS.push('Camuflagem');
  if(allKeys.includes('camDupla'))hotS.push('Cam.Dupla');
  if(allKeys.includes('terminal'))hotS.push('Terminal');
  if(allKeys.includes('espelho')||allKeys.includes('espDuplo'))hotS.push('Espelho');
  if(allKeys.includes('fantasma'))hotS.push('Fantasma');
  if(allKeys.includes('frio'))hotS.push('Frio');
  if(allKeys.includes('distancia'))hotS.push('Distância');
  if(allKeys.includes('ciclo'))hotS.push('Ciclo');
  if(allKeys.includes('tripleX'))hotS.push('Triple X');
  if(Object.values(freq).some(v=>v>=2))hotS.push('Repetição');

  const score=hotS.length;
  const sem=instavel?'red':score>=4?'green':score>=2?'yellow':'red';

  return{entries,instavel,umaFicha:uf,txNum:tx,fantasmaNum:FANTASMA[t1],topFrios:frios.slice(0,4),topRegion:topR[0],regionData:regions,shouldEnter:sem==='green',sem,hotS,score,maxT,tc,freq,optTX:{fx1,fx2},optUF:{fx1:uf1,fx2:uf2}};
}

// ── APP ───────────────────────────────────────────────────────────
export default function Root(){const[ok,setOk]=useState(false);return ok?<App/>:<TelaLogin onLogin={()=>setOk(true)}/>;}

function App(){
  const[tl,setTl]=useState([]);
  const[newN,setNewN]=useState('');
  const[tab,setTab]=useState('signal');
  const[mode,setMode]=useState('normal');
  const[calibrating,setCalibrating]=useState(true); // starts in calibration mode
  const[retry,setRetry]=useState(0);
  const[missed,setMissed]=useState(null);
  const[showFB,setShowFB]=useState(false);
  const[lastKeys,setLastKeys]=useState([]);
  const[weights,setWeights]=useState(()=>loadW());
  const[stats,setStats]=useState(()=>loadStats());
  const[opt,setOpt]=useState(null);
  const[strats,setStrats]=useState(null);
  const[analysis,setAnalysis]=useState(null);
  const[confirm,setConfirm]=useState(false);
  const[editIdx,setEditIdx]=useState(null); // index being edited

  const C={bg:'#04080b',panel:'#080f14',p2:'#0c1820',border:'#132030',green:'#00c87a',gold:'#f5a800',red:'#d42035',blue:'#38bdf8',text:'#b8d8f0',dim:'#2e4a60',white:'#e8f5ff'};
  const S={s:{c:C.green,bg:'rgba(0,200,122,0.12)',b:'rgba(0,200,122,0.3)',l:'FORTE'},m:{c:C.gold,bg:'rgba(245,168,0,0.12)',b:'rgba(245,168,0,0.3)',l:'MÉDIO'},n:{c:C.red,bg:'rgba(212,32,53,0.12)',b:'rgba(212,32,53,0.3)',l:'FRACO'}};

  const run=useCallback((nums,w,m)=>{
    const o=monteCarlo(nums);const st=testStrats(nums);const res=analyze(nums,o,w||weights,m||mode);
    setOpt(o);setStrats(st);setAnalysis(res);
    if(res)setLastKeys(res.entries.flatMap(e=>e.keys));
    setShowFB(true);
  },[weights,mode]);

  const addN=(n)=>{if(n<0||n>36)return;const u=[n,...tl].slice(0,50);setTl(u);run(u);setRetry(0);setMissed(null);};
  const delLast=()=>{if(tl.length===0)return;const u=tl.slice(1);setTl(u);if(u.length>=3)run(u);else{setAnalysis(null);setStrats(null);setOpt(null);}};
  const editNum=(idx,n)=>{if(n<0||n>36)return;const u=[...tl];u[idx]=n;setTl(u);if(u.length>=3)run(u);setEditIdx(null);};
  const addInput=()=>{const n=parseInt(newN);if(isNaN(n)||n<0||n>36)return;addN(n);setNewN('');};
  const naoBateu=()=>{const n=parseInt(newN);if(retry===0){if(!isNaN(n)&&n>=0&&n<=36)setMissed(n);setRetry(1);setNewN('');}else if(retry===1){if(!isNaN(n)&&n>=0&&n<=36)setMissed(n);setRetry(2);setNewN('');}};
  const handleFB=(r)=>{const nw=updateW(weights,lastKeys,r);setWeights(nw);const ns={...stats,total:stats.total+1};if(r==='first')ns.first=(stats.first||0)+1;if(r==='second')ns.second=(stats.second||0)+1;if(r==='miss')ns.miss=(stats.miss||0)+1;saveStats(ns);setStats(ns);setShowFB(false);};
  const switchMode=(m)=>{setMode(m);if(tl.length>=3)run(tl,weights,m);};

  const ball=(n,i)=>(
    <div key={i} onClick={()=>setEditIdx(editIdx===i?null:i)}
      style={{width:26,height:26,borderRadius:'50%',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:'bold',cursor:'pointer',
        background:editIdx===i?'rgba(56,189,248,0.3)':n===0?'#082015':RED.has(n)?'#4a0a14':'#111',
        color:editIdx===i?'#fff':n===0?C.green:RED.has(n)?'#ff9090':'#777',
        border:`2px solid ${editIdx===i?C.blue:i===0?C.gold:n===0?'#1a5030':RED.has(n)?'#8a1525':'#222'}`,
        boxShadow:editIdx===i?`0 0 8px ${C.blue}`:'none'
      }}>{n}</div>
  );
  const bigBall=(n,main,str)=>({width:36,height:36,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:'bold',flexShrink:0,background:main?S[str].bg:n===0?'#082015':RED.has(n)?'#3a0a10':'#0f0f0f',color:main?S[str].c:n===0?C.green:RED.has(n)?'#ff9090':'#666',border:`1px solid ${main?S[str].b:n===0?'#1a5030':RED.has(n)?'#6a1520':'#1a1a1a'}`,boxShadow:main?`0 0 12px ${S[str].c}30`:'none'});

  const semColor=analysis?.sem==='green'?C.green:analysis?.sem==='yellow'?C.gold:C.red;

  return(<div style={{background:C.bg,minHeight:'100vh',color:C.text,fontFamily:"'Courier New',monospace",paddingBottom:50}}>
    <div style={{position:'fixed',inset:0,background:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.04) 2px,rgba(0,0,0,0.04) 4px)',pointerEvents:'none',zIndex:9999}}/>
    <div style={{position:'fixed',inset:0,backgroundImage:'linear-gradient(rgba(0,200,122,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(0,200,122,0.02) 1px,transparent 1px)',backgroundSize:'30px 30px',pointerEvents:'none'}}/>
    <div style={{maxWidth:430,margin:'0 auto',padding:'0 12px',position:'relative',zIndex:1}}>

      {/* HEADER */}
      <div style={{padding:'12px 0 10px',borderBottom:`1px solid ${C.border}`,marginBottom:10,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <div style={{fontSize:18,fontWeight:900,letterSpacing:3,color:C.white}}>GIOVANNI <span style={{color:C.green}}>VISION</span></div>
          <div style={{fontSize:8,color:C.dim,letterSpacing:2}}>REVOLUTION · v5.0 FINAL</div>
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

      {/* TIMELINE */}
      <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:10,padding:'8px 10px',marginBottom:8}}>
        <div style={{fontSize:8,color:C.dim,letterSpacing:2,marginBottom:5}}>TIMELINE ({tl.length}) → MAIS RECENTE</div>
        <div style={{display:'flex',gap:4,overflowX:'auto',minHeight:30}}>
          {tl.length===0?<div style={{fontSize:10,color:C.dim,alignSelf:'center',width:'100%',textAlign:'center'}}>Toque nos números abaixo</div>:tl.slice(0,18).map((n,i)=>ball(n,i))}
          {tl.length>18&&<div style={{fontSize:9,color:C.dim,alignSelf:'center',flexShrink:0,paddingLeft:4}}>+{tl.length-18}</div>}
        </div>
      </div>

      {/* EDIT PANEL */}
      {editIdx!==null&&<div style={{background:'rgba(56,189,248,0.08)',border:`1px solid ${C.blue}`,borderRadius:10,padding:10,marginBottom:8}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:7}}>
          <div style={{fontSize:10,color:C.blue,fontWeight:900}}>✏️ Substituir posição {editIdx+1} — atual: <strong style={{color:C.white}}>{tl[editIdx]}</strong></div>
          <button onClick={()=>{const u=[...tl];u.splice(editIdx,1);setTl(u);if(u.length>=3)run(u);else{setAnalysis(null);setStrats(null);setOpt(null);}setEditIdx(null);}} style={{fontSize:9,padding:'3px 8px',background:'rgba(212,32,53,0.15)',border:`1px solid ${C.red}`,borderRadius:5,color:C.red,cursor:'pointer'}}>🗑 APAGAR</button>
        </div>
        <div style={{fontSize:9,color:C.dim,marginBottom:6}}>Toque no novo número:</div>
        <button onClick={()=>editNum(editIdx,0)} style={{display:'block',width:'100%',padding:'6px',background:'#082015',border:'1px solid #1a5030',borderRadius:6,color:C.green,fontFamily:'monospace',fontSize:13,fontWeight:'bold',cursor:'pointer',marginBottom:5,letterSpacing:3}}>— 0 —</button>
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
            placeholder={retry===0?'Novo número...':retry===1?'2ª tentativa...':'2 números que saíram...'}
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

      {/* GRID */}
      <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:10,padding:10,marginBottom:10}}>
        <div style={{fontSize:8,color:C.dim,letterSpacing:2,marginBottom:7,textAlign:'center'}}>TOQUE PARA ADICIONAR</div>
        <button onClick={()=>addN(0)} style={{display:'block',width:'100%',padding:'9px',background:'#082015',border:'1px solid #1a5030',borderRadius:7,color:C.green,fontFamily:'monospace',fontSize:15,fontWeight:'bold',cursor:'pointer',marginBottom:7,letterSpacing:3}}>— 0 —</button>
        <div style={{display:'grid',gridTemplateColumns:'repeat(9,1fr)',gap:5}}>
          {Array.from({length:36},(_,i)=>i+1).map(n=>(
            <button key={n} onClick={()=>addN(n)} style={{height:42,borderRadius:7,fontFamily:'monospace',fontSize:14,fontWeight:'bold',cursor:'pointer',border:'none',background:RED.has(n)?'#3a0a10':'#101010',color:RED.has(n)?'#ff8090':'#777'}}>{n}</button>
          ))}
        </div>
        <button onClick={()=>{setTl([]);setAnalysis(null);setOpt(null);setStrats(null);setRetry(0);}} style={{width:'100%',marginTop:7,padding:'5px',background:'transparent',border:`1px solid ${C.border}`,borderRadius:5,color:C.dim,fontSize:10,cursor:'pointer'}}>⌫ LIMPAR</button>
      </div>

      {/* CALIBRATION BANNER */}
      {calibrating&&tl.length<20&&<div style={{background:'rgba(56,189,248,0.06)',border:`1px solid ${C.blue}`,borderRadius:10,padding:10,marginBottom:8}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
          <div>
            <div style={{fontSize:10,color:C.blue,fontWeight:900,letterSpacing:1}}>🔬 CALIBRANDO MESA</div>
            <div style={{fontSize:9,color:C.dim,marginTop:2}}>Digite os últimos 20 números para análise de aquecimento</div>
          </div>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:20,fontWeight:900,color:tl.length>=20?C.green:C.blue}}>{tl.length}</div>
            <div style={{fontSize:8,color:C.dim}}>/ 20</div>
          </div>
        </div>
        <div style={{height:4,background:'#0a0a0a',borderRadius:2,overflow:'hidden',marginBottom:8}}>
          <div style={{height:'100%',width:`${Math.min(tl.length/20*100,100)}%`,background:`linear-gradient(90deg,${C.blue},${C.green})`,borderRadius:2,transition:'width 0.3s'}}/>
        </div>
        {tl.length>=20&&<button onClick={()=>setCalibrating(false)} style={{width:'100%',padding:'8px',background:`linear-gradient(135deg,#006040,${C.green})`,border:'none',borderRadius:7,color:'#000',fontWeight:900,fontSize:12,cursor:'pointer',letterSpacing:2}}>✅ CALIBRAÇÃO CONCLUÍDA — VER ANÁLISE</button>}
        {tl.length<20&&tl.length>=10&&<div style={{fontSize:9,color:C.dim,textAlign:'center'}}>Continue digitando... {20-tl.length} números restantes</div>}
        {tl.length<10&&tl.length>0&&<div style={{fontSize:9,color:C.dim,textAlign:'center'}}>Boa! Continue... faltam {20-tl.length}</div>}
      </div>}

      {/* CALIBRATION COMPLETE — SHOW RESULTS */}
      {calibrating&&tl.length>=20&&strats&&<div style={{background:C.panel,border:`1px solid ${C.green}`,borderRadius:10,padding:12,marginBottom:8}}>
        <div style={{fontSize:10,color:C.green,fontWeight:900,letterSpacing:1,marginBottom:8}}>✅ ANÁLISE DE AQUECIMENTO — MESA CALIBRADA</div>
        <div style={{fontSize:9,color:C.dim,marginBottom:10}}>Estratégias quentes neste momento:</div>
        {Object.entries(strats).filter(([,v])=>v>=25).sort((a,b)=>b[1]-a[1]).map(([k,pct])=>{
          const labels={perm:'Permanência',terminal:'Terminal',camuflagem:'Camuflagem',camDupla:'Cam. Dupla ★',cavalo:'Cavalo',espelho:'Espelho',espDuplo:'Espelho Duplo',tripleX:'Triple X',fantasma:'Nº Fantasma',frio:'Nº Frio ❄️',distancia:'Distância Roda',ciclo:'Ciclo Terminal',quebra:'Quebra Mesa'};
          const hot=pct>=40;
          return(<div key={k} style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:5,padding:'5px 8px',background:hot?'rgba(0,200,122,0.08)':'rgba(245,168,0,0.06)',border:`1px solid ${hot?'rgba(0,200,122,0.2)':'rgba(245,168,0,0.15)'}`,borderRadius:6}}>
            <div style={{fontSize:11,color:hot?C.green:C.gold}}>{hot?'🔥':' ⚡'} {labels[k]||k}</div>
            <div style={{fontSize:12,fontWeight:900,color:hot?C.green:C.gold}}>{pct}%</div>
          </div>);
        })}
        {Object.entries(strats).filter(([,v])=>v>=25).length===0&&<div style={{fontSize:10,color:C.dim,textAlign:'center',padding:'8px 0'}}>Mesa sem padrão claro — aguarde mais rodadas</div>}
        <button onClick={()=>setCalibrating(false)} style={{width:'100%',marginTop:8,padding:'8px',background:`linear-gradient(135deg,#006040,${C.green})`,border:'none',borderRadius:7,color:'#000',fontWeight:900,fontSize:12,cursor:'pointer',letterSpacing:2}}>🎯 IR PARA O SINAL</button>
      </div>}

      {/* TABS */}
      <div style={{display:'flex',gap:4,marginBottom:10}}>
        {[['signal','⚡ SINAL'],['strategies','📊 ESTRAT.'],['mesa','🎯 MESA'],['settings','⚙ CONFIG']].map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={{flex:1,padding:'8px 4px',background:tab===id?C.p2:'transparent',border:`1px solid ${tab===id?C.border:C.border}`,borderRadius:7,color:tab===id?C.white:C.dim,fontSize:9,fontWeight:tab===id?700:400,cursor:'pointer'}}>{label}</button>
        ))}
      </div>

      {/* ── SINAL ── */}
      {tab==='signal'&&analysis&&(<>
        {mode==='sniper'&&<div style={{background:'rgba(245,168,0,0.06)',border:`1px solid ${C.gold}`,borderRadius:8,padding:'8px 12px',marginBottom:8,display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontSize:16}}>🎯</span><div><div style={{fontSize:10,color:C.gold,fontWeight:900}}>MODO SNIPER</div><div style={{fontSize:9,color:C.dim}}>1 entrada · máxima precisão · menos fichas</div></div>
        </div>}

        {/* SEMÁFORO */}
        {(analysis.instavel||analysis.sem==='red')&&<div style={{background:'#140008',border:`2px solid ${C.red}`,borderRadius:12,padding:14,textAlign:'center',marginBottom:8}}>
          <div style={{fontSize:26,marginBottom:4}}>🔴</div>
          <div style={{fontSize:14,fontWeight:900,color:C.red,letterSpacing:2,marginBottom:4}}>{analysis.instavel?'MESA INSTÁVEL':'AGUARDAR 2 RODADAS'}</div>
          <div style={{fontSize:10,color:'#b06070',lineHeight:1.6}}>Não entre agora · Mesa sem sinal claro</div>
          <div style={{marginTop:6,fontSize:9,color:C.dim}}>Estratégias: <span style={{color:C.red}}>{analysis.score}/11</span></div>
        </div>}
        {analysis.sem==='yellow'&&<div style={{background:'#120f00',border:`2px solid ${C.gold}`,borderRadius:12,padding:12,marginBottom:8}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}><span style={{fontSize:20}}>🟡</span><div><div style={{fontSize:12,fontWeight:900,color:C.gold}}>CAUTELA — SINAL FRACO</div><div style={{fontSize:9,color:'#b8a060'}}>Entre com fichas menores</div></div></div>
          <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>{analysis.hotS.map((s,i)=><span key={i} style={{fontSize:9,padding:'2px 6px',background:'rgba(245,168,0,0.1)',color:C.gold,border:'1px solid rgba(245,168,0,0.25)',borderRadius:4}}>{s}</span>)}</div>
        </div>}
        {analysis.sem==='green'&&<div style={{background:'#001408',border:`2px solid ${C.green}`,borderRadius:12,padding:12,marginBottom:8}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
            <span style={{fontSize:20}}>🟢</span>
            <div style={{flex:1}}><div style={{fontSize:12,fontWeight:900,color:C.green}}>ENTRAR — SINAL FORTE</div><div style={{fontSize:9,color:'#60b080'}}>{analysis.score} estratégias convergindo</div></div>
            {opt?.pct>0&&<div style={{textAlign:'center'}}><div style={{fontSize:16,fontWeight:900,color:C.green}}>{opt.pct}%</div><div style={{fontSize:8,color:C.dim}}>acerto</div></div>}
          </div>
          <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>{analysis.hotS.map((s,i)=><span key={i} style={{fontSize:9,padding:'2px 6px',background:'rgba(0,200,122,0.1)',color:C.green,border:'1px solid rgba(0,200,122,0.25)',borderRadius:4}}>{s}</span>)}</div>
        </div>}

        {/* ENTRADAS */}
        {(analysis.sem==='green'||analysis.sem==='yellow')&&<>
          {analysis.entries.map((e,i)=>(<div key={i} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:10,marginBottom:7,position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',left:0,top:0,bottom:0,width:3,background:S[e.str].c}}/>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:7}}>
              <div style={{fontSize:9,color:C.dim}}>{e.reasons[0]}</div>
              <div style={{fontSize:9,padding:'2px 6px',borderRadius:3,background:S[e.str].bg,color:S[e.str].c,border:`1px solid ${S[e.str].b}`}}>{S[e.str].l} · {e.pts.toFixed(0)}pts</div>
            </div>
            <div style={{display:'flex',flexWrap:'wrap',gap:5,marginBottom:5}}>{e.nb.map((n,j)=><div key={j} style={bigBall(n,n===e.main,e.str)}>{n}</div>)}</div>
            <div style={{fontSize:10,color:C.dim}}><span style={{color:C.text}}>{e.main} com {e.vc}V</span> · {e.nb.length} números{e.reasons.length>1&&<><br/><span style={{fontSize:9}}>+ {e.reasons.slice(1).join(' · ')}</span></>}</div>
            <div style={{marginTop:5,padding:'3px 8px',background:'rgba(255,255,255,0.03)',borderRadius:4,fontSize:9,color:C.dim,display:'flex',gap:8}}>
              <span>🟡 <b style={{color:C.white}}>{e.main}</b> → 2 fichas</span><span>⚪ vizinhos → 1 ficha</span>
            </div>
          </div>))}

          {/* SNIPER EXTRAS */}
          {mode==='sniper'&&<div style={{background:C.bg,border:`1px solid rgba(245,168,0,0.2)`,borderRadius:10,padding:10,marginBottom:7}}>
            <div style={{fontSize:9,color:C.gold,letterSpacing:1,marginBottom:7}}>🎯 SNIPER EXTRAS — 1 FICHA CADA</div>
            <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
              {analysis.topFrios.slice(0,3).map((n,i)=><div key={i} style={{display:'flex',alignItems:'center',gap:5,background:'rgba(56,189,248,0.06)',border:'1px solid rgba(56,189,248,0.2)',borderRadius:7,padding:'5px 8px'}}>
                <div style={{width:26,height:26,borderRadius:'50%',background:n===0?'#082015':RED.has(n)?'#3a0a10':'#0f0f0f',color:n===0?C.green:RED.has(n)?'#ff9090':'#777',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:'bold',border:'1px solid #38bdf840'}}>{n}</div>
                <div style={{fontSize:9,color:C.blue}}>❄️ Frio</div>
              </div>)}
              {analysis.fantasmaNum!==undefined&&<div style={{display:'flex',alignItems:'center',gap:5,background:'rgba(240,212,0,0.06)',border:'1px solid rgba(240,212,0,0.2)',borderRadius:7,padding:'5px 8px'}}>
                <div style={{width:26,height:26,borderRadius:'50%',background:RED.has(analysis.fantasmaNum)?'#3a0a10':'#0f0f0f',color:RED.has(analysis.fantasmaNum)?'#ff9090':'#777',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:'bold',border:'1px solid #f0d04040'}}>{analysis.fantasmaNum}</div>
                <div style={{fontSize:9,color:'#f0d060'}}>👻 Fantasma</div>
              </div>}
            </div>
          </div>}

          {/* 1 FICHA + TRIPLE X */}
          <div style={{display:'flex',gap:6,marginBottom:8}}>
            {[{n:analysis.umaFicha,label:'1 FICHA',color:C.blue,key:'umaFicha',formula:`T+${analysis.optUF?.fx1||37}+${analysis.optUF?.fx2||3}`,pct:strats?.umaFicha||0},
              {n:analysis.txNum,label:'TRIPLE X',color:C.gold,key:'tripleX',formula:`T+${analysis.optTX?.fx1||12}+T+${analysis.optTX?.fx2||9}`,pct:strats?.tripleX||0}
            ].map(({n,label,color,formula,pct})=>(
              <div key={label} style={{flex:1,background:C.bg,border:`1px solid ${pct>=30?color+'66':'#0a1520'}`,borderRadius:10,padding:10}}>
                <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:5}}>
                  <div style={{width:34,height:34,borderRadius:'50%',background:color+'18',border:`1px solid ${color}40`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:'bold',color,flexShrink:0}}>{n}</div>
                  <div><div style={{fontSize:9,color,letterSpacing:1}}>{label}</div><div style={{fontSize:8,color:C.dim,marginTop:1}}>{formula}</div></div>
                </div>
                <div style={{height:3,background:'#0a0a0a',borderRadius:2,overflow:'hidden',marginBottom:3}}><div style={{height:'100%',width:`${pct}%`,background:pct>=30?color:'#1a2030',borderRadius:2}}/></div>
                <div style={{fontSize:11,fontWeight:900,color:pct>=30?color:C.dim}}>{pct}% {pct>=30&&'🔥'}</div>
              </div>
            ))}
          </div>

          {/* FEEDBACK */}
          {showFB&&<div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:10,padding:10,marginBottom:8}}>
            <div style={{fontSize:9,color:C.dim,letterSpacing:2,marginBottom:7,textAlign:'center'}}>COMO FOI A JOGADA?</div>
            <div style={{display:'flex',gap:5}}>
              {[['first','✅ BATEU','1ª vez','rgba(0,200,122,0.15)','rgba(0,200,122,0.3)',C.green],
                ['second','🔄 BATEU','2ª vez','rgba(56,189,248,0.15)','rgba(56,189,248,0.3)',C.blue],
                ['miss','❌ NÃO','BATEU','rgba(212,32,53,0.15)','rgba(212,32,53,0.3)','#ff7090']
              ].map(([r,l1,l2,bg,b,c])=>(
                <button key={r} onClick={()=>handleFB(r)} style={{flex:1,padding:'8px 3px',background:bg,border:`1px solid ${b}`,borderRadius:7,color:c,fontSize:11,fontWeight:700,cursor:'pointer',lineHeight:1.4}}>{l1}<br/><span style={{fontSize:9,fontWeight:400}}>{l2}</span></button>
              ))}
            </div>
          </div>}

          <div style={{background:'#0a0a00',border:'1px solid #1a1a00',borderRadius:7,padding:'7px 10px',fontSize:9,color:'#888',lineHeight:1.6}}>
            🔁 <span style={{color:C.gold}}>REGRA:</span> Não bateu → aperta NÃO BATEU → repete · 2x → digita os 2 números
          </div>
        </>}
      </>)}

      {/* ── ESTRATÉGIAS ── */}
      {tab==='strategies'&&strats&&(<div>
        <div style={{fontSize:9,color:C.dim,letterSpacing:2,marginBottom:8}}>// ACERTO ÚLTIMAS 20 RODADAS</div>
        {Object.entries(strats).sort((a,b)=>b[1]-a[1]).map(([k,pct])=>{
          const labels={perm:'Permanência',terminal:'Terminal',camuflagem:'Camuflagem',camDupla:'Cam. Dupla ★',cavalo:'Cavalo',espelho:'Espelho',espDuplo:'Espelho Duplo',tripleX:'Triple X',fantasma:'Nº Fantasma',frio:'Nº Frio ❄️',distancia:'Distância Roda',ciclo:'Ciclo Terminal',quebra:'Quebra Mesa'};
          const hot=pct>=40,warm=pct>=25;
          return(<div key={k} style={{background:C.panel,border:`1px solid ${hot?'rgba(0,200,122,0.3)':warm?'rgba(245,168,0,0.2)':C.border}`,borderRadius:8,padding:'9px 10px',marginBottom:6}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:5}}>
              <div style={{fontSize:12,fontWeight:700,color:hot?C.green:warm?C.gold:C.dim}}>{labels[k]||k}</div>
              <div style={{display:'flex',alignItems:'center',gap:5}}>
                {hot&&<span style={{fontSize:8,padding:'1px 5px',background:'rgba(0,200,122,0.12)',color:C.green,border:'1px solid rgba(0,200,122,0.25)',borderRadius:3}}>🔥 QUENTE</span>}
                {warm&&!hot&&<span style={{fontSize:8,padding:'1px 5px',background:'rgba(245,168,0,0.12)',color:C.gold,border:'1px solid rgba(245,168,0,0.25)',borderRadius:3}}>⚡</span>}
                <span style={{fontSize:13,fontWeight:900,color:hot?C.green:warm?C.gold:C.dim}}>{pct}%</span>
              </div>
            </div>
            <div style={{height:4,background:'#0a0a0a',borderRadius:2,overflow:'hidden'}}><div style={{height:'100%',width:`${pct}%`,background:hot?`linear-gradient(90deg,#006040,${C.green})`:warm?`linear-gradient(90deg,#604000,${C.gold})`:'#1a2030',borderRadius:2}}/></div>
          </div>);
        })}
      </div>)}

      {/* ── MESA ── */}
      {tab==='mesa'&&analysis&&(<div>
        {/* Regiões */}
        <div style={{fontSize:9,color:C.dim,letterSpacing:2,marginBottom:8}}>// REGIÕES · ÚLTIMAS 14</div>
        <div style={{display:'flex',gap:5,marginBottom:10}}>
          {Object.entries(analysis.regionData).map(([reg,count])=>{
            const colors={Tier:C.green,Voisins:C.blue,Orph:C.gold,Zero:'#a0ffa0'};
            const pct=Math.round(count/14*100);
            return(<div key={reg} style={{flex:1,background:C.panel,border:`1px solid ${C.border}`,borderRadius:8,padding:'8px 5px',textAlign:'center'}}>
              <div style={{fontSize:8,color:C.dim,marginBottom:3}}>{reg.toUpperCase()}</div>
              <div style={{fontSize:18,fontWeight:900,color:colors[reg]||C.dim}}>{count}</div>
              <div style={{height:3,background:'#0a0a0a',borderRadius:2,marginTop:5,overflow:'hidden'}}><div style={{height:'100%',width:`${pct}%`,background:colors[reg]||C.dim,borderRadius:2}}/></div>
            </div>);
          })}
        </div>

        {/* Números frios */}
        <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:10,padding:10,marginBottom:8}}>
          <div style={{fontSize:9,color:C.blue,letterSpacing:2,marginBottom:3}}>❄️ NÚMEROS FRIOS — AUSENTES HÁ 20+ RODADAS</div>
          <div style={{fontSize:9,color:C.dim,marginBottom:7}}>58% de acerto confirmado em 3 mesas / 1500 rodadas</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
            {[...Array(37).keys()].filter(n=>!tl.slice(0,20).includes(n)).map((n,i)=>(
              <div key={i} style={{width:28,height:28,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:'bold',background:n===0?'#082015':RED.has(n)?'#3a0a10':'#101010',color:n===0?C.green:RED.has(n)?'#ff9090':'#888',border:'1px solid #38bdf830'}}>{n}</div>
            ))}
          </div>
        </div>

        {/* Terminais */}
        <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:10,padding:10,marginBottom:8}}>
          <div style={{fontSize:9,color:C.dim,letterSpacing:2,marginBottom:7}}>// TERMINAIS DOMINANTES</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
            {Object.entries(analysis.tc).sort((a,b)=>b[1]-a[1]).map(([t,count])=>(
              <div key={t} style={{padding:'3px 9px',borderRadius:5,background:count>=3?'rgba(0,200,122,0.12)':count>=2?'rgba(245,168,0,0.12)':'rgba(255,255,255,0.03)',border:`1px solid ${count>=3?'rgba(0,200,122,0.25)':count>=2?'rgba(245,168,0,0.25)':C.border}`,color:count>=3?C.green:count>=2?C.gold:C.dim,fontSize:11,fontWeight:700}}>T{t} ({count}x)</div>
            ))}
          </div>
        </div>

        {/* Números quentes */}
        <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:10,padding:10,marginBottom:8}}>
          <div style={{fontSize:9,color:C.dim,letterSpacing:2,marginBottom:7}}>// REPETIÇÕES</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
            {Object.entries(analysis.freq).filter(([,v])=>v>=2).sort((a,b)=>b[1]-a[1]).map(([n,v])=>(
              <div key={n} style={{...bigBall(parseInt(n),true,'s'),position:'relative'}}>{n}<span style={{position:'absolute',top:-4,right:-4,fontSize:8,background:C.green,color:'#000',borderRadius:3,padding:'0 2px',fontWeight:900}}>{v}x</span></div>
            ))}
            {Object.entries(analysis.freq).filter(([,v])=>v>=2).length===0&&<div style={{fontSize:10,color:C.dim}}>Nenhuma repetição ainda</div>}
          </div>
        </div>

        {/* Fantasma + Leitura */}
        {analysis.fantasmaNum!==undefined&&<div style={{background:C.panel,border:'1px solid #202000',borderRadius:10,padding:10,marginBottom:8,display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontSize:20}}>👻</span>
          <div><div style={{fontSize:10,color:'#f0d060',fontWeight:700}}>NÚMERO FANTASMA ATIVO</div>
          <div style={{fontSize:11,color:C.white,marginTop:1}}>T{term(tl[0]||0)} → <strong>{analysis.fantasmaNum}</strong> · 1 ficha</div></div>
        </div>}

        <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:10,padding:10}}>
          <div style={{fontSize:9,color:C.blue,letterSpacing:2,marginBottom:7}}>// LEITURA DE MESA</div>
          {[`Região: ${analysis.topRegion} dominando`,
            analysis.maxT>=3&&`Terminal T${Object.entries(analysis.tc).sort((a,b)=>b[1]-a[1])[0][0]} rep ${analysis.maxT}x → zero provável`,
            tl[0]&&MIRRORS[tl[0]]&&`Espelho: ${tl[0]} → ${MIRRORS[tl[0]]}`,
            tl[0]&&CICLOS[term(tl[0])]&&`Ciclo: T${term(tl[0])} → T${CICLOS[term(tl[0])].join(',')}`,
            tl[0]&&tl[1]&&`Cam.Dupla: ${tl[0]}+${tl[1]}=${(()=>{let x=tl[0]+tl[1];while(x>36)x=dsum(x);return x;})()}`,
          ].filter(Boolean).map((r,i)=>(
            <div key={i} style={{fontSize:11,color:C.text,lineHeight:1.6,marginBottom:3,paddingLeft:10,position:'relative'}}>
              <span style={{position:'absolute',left:0,color:C.dim,fontSize:9}}>▸</span>{r}
            </div>
          ))}
        </div>
      </div>)}

      {/* ── CONFIG ── */}
      {tab==='settings'&&(<div>
        {opt&&<>
          <div style={{fontSize:9,color:C.dim,letterSpacing:2,marginBottom:8}}>// MONTE CARLO · OTIMIZAÇÃO EM TEMPO REAL</div>
          {[{title:'TRIPLE X',data:opt.tx,color:C.gold,fmt:(r)=>`T+${r.fx1}+T+${r.fx2}`},{title:'1 FICHA SÓ',data:opt.uf,color:C.blue,fmt:(r)=>`T+${r.fx1}+${r.fx2}`}].map(({title,data,color,fmt})=>(
            <div key={title} style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:10,padding:12,marginBottom:8}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                <div style={{fontSize:13,fontWeight:700,color}}>{title}</div>
                <div style={{fontSize:9,color:C.green}}>{data?.pct||0}% acerto</div>
              </div>
              {data?.top3?.map((r,i)=>(
                <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'5px 7px',background:i===0?`${color}12`:'transparent',borderRadius:5,marginBottom:3,border:i===0?`1px solid ${color}25`:'none'}}>
                  <div style={{fontSize:11,color:i===0?color:C.dim}}>#{i+1} {fmt(r)}</div>
                  <div style={{fontSize:12,fontWeight:900,color:i===0?color:C.dim}}>{r.pct}%</div>
                </div>
              ))}
            </div>
          ))}
        </>}

        {/* Aprendizado */}
        <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:10,padding:12,marginBottom:8}}>
          <div style={{fontSize:9,color:C.dim,letterSpacing:2,marginBottom:8}}>// APRENDIZADO</div>
          <div style={{display:'flex',gap:5,marginBottom:8}}>
            {[['TOTAL',stats.total||0,C.white],['1ª',stats.first||0,C.green],['2ª',stats.second||0,C.blue],['ERROS',stats.miss||0,C.red]].map(([l,v,c])=>(
              <div key={l} style={{flex:1,background:C.bg,border:`1px solid ${C.border}`,borderRadius:7,padding:'7px 4px',textAlign:'center'}}>
                <div style={{fontSize:8,color:c,marginBottom:2}}>{l}</div>
                <div style={{fontSize:17,fontWeight:900,color:c}}>{v}</div>
              </div>
            ))}
          </div>
          {stats.total>0&&<div style={{fontSize:10,color:C.dim,textAlign:'center',marginBottom:8}}>
            Taxa: <span style={{color:C.green,fontWeight:900}}>{Math.round(((stats.first||0)+(stats.second||0))/(stats.total||1)*100)}%</span>
          </div>}
          <div style={{fontSize:9,color:C.dim,marginBottom:6}}>PESOS DAS ESTRATÉGIAS:</div>
          {Object.entries(weights).sort((a,b)=>b[1]-a[1]).map(([k,v])=>{
            const labels={perm:'Permanência',terminal:'Terminal',camuflagem:'Camuflagem',camDupla:'Cam.Dupla',cavalo:'Cavalo',espelho:'Espelho',espDuplo:'Esp.Duplo',tripleX:'Triple X',fantasma:'Fantasma',frio:'Nº Frio',distancia:'Distância',ciclo:'Ciclo',quebra:'Quebra'};
            const c=v>=1.3?C.green:v>=0.8?C.text:C.red;
            return(<div key={k} style={{display:'flex',alignItems:'center',gap:6,marginBottom:4}}>
              <div style={{fontSize:9,color:c,width:72,flexShrink:0}}>{labels[k]||k}</div>
              <div style={{flex:1,height:3,background:'#0a0a0a',borderRadius:2,overflow:'hidden'}}><div style={{height:'100%',width:`${Math.round(v/3*100)}%`,background:c,borderRadius:2}}/></div>
              <div style={{fontSize:9,fontWeight:900,color:c,width:25,textAlign:'right'}}>{v.toFixed(1)}</div>
            </div>);
          })}
          <button onClick={()=>{saveW({...DW});setWeights({...DW});}} style={{width:'100%',marginTop:7,padding:'5px',background:'transparent',border:`1px solid ${C.dim}`,borderRadius:5,color:C.dim,fontSize:9,cursor:'pointer'}}>RESETAR PESOS</button>
        </div>

        <button onClick={()=>setConfirm(true)} style={{width:'100%',padding:9,background:'transparent',border:`1px solid ${C.red}`,borderRadius:7,color:C.red,fontSize:11,cursor:'pointer',letterSpacing:2}}>↺ LIMPAR TUDO</button>
        {confirm&&<div style={{marginTop:7,background:'#1a0810',border:`1px solid ${C.red}`,borderRadius:8,padding:10,textAlign:'center'}}>
          <div style={{fontSize:11,color:'#ff8090',marginBottom:8}}>Limpar timeline e histórico?</div>
          <div style={{display:'flex',gap:6}}>
            <button onClick={()=>{setTl([]);setAnalysis(null);setOpt(null);setStrats(null);const ns={total:0,first:0,second:0,miss:0};saveStats(ns);setStats(ns);setConfirm(false);}} style={{flex:1,padding:7,background:C.red,border:'none',borderRadius:5,color:'#fff',fontSize:11,cursor:'pointer'}}>SIM</button>
            <button onClick={()=>setConfirm(false)} style={{flex:1,padding:7,background:'transparent',border:`1px solid ${C.border}`,borderRadius:5,color:C.dim,fontSize:11,cursor:'pointer'}}>NÃO</button>
          </div>
        </div>}
      </div>)}

      <div style={{textAlign:'center',fontSize:8,color:'#1a2a38',marginTop:18,lineHeight:1.8}}>
        ⚠ FERRAMENTA DE ESTUDO · JOGUE COM RESPONSABILIDADE<br/>
        PERM · CAM · CAMDUPLA · TERMINAL · ESPELHO · TX · FANTASMA · FRIO · DISTÂNCIA
      </div>
    </div>
    <style>{`*{box-sizing:border-box}input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}::-webkit-scrollbar{display:none}input::placeholder{color:#2e4a60}`}</style>
  </div>);
}
