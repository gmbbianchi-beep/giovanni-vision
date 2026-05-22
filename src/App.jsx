import { useState, useCallback, useEffect, useRef } from "react";
import { analyze } from "./engine/decisionEngine";

const SENHA = "Forra01";

function TelaSplash({ onEnter }) {
  const [fade, setFade] = useState(false);
  const enter = () => { setFade(true); setTimeout(onEnter, 600); };

  return (
    <div onClick={enter} style={{position:'fixed',inset:0,background:'#04080b',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',cursor:'pointer',overflow:'hidden',opacity:fade?0:1,transition:'opacity 0.6s'}}>

      {/* NYC SKYLINE ANIMADA */}
      <div style={{position:'absolute',bottom:0,left:0,right:0,height:'45%'}}>
        <svg viewBox="0 0 800 250" style={{width:'100%',height:'100%'}} preserveAspectRatio="xMidYMax meet">
          {/* Céu gradiente */}
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#04080b"/><stop offset="100%" stopColor="#0a1520"/>
            </linearGradient>
            <linearGradient id="glow1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00c87a" stopOpacity="0.6"/><stop offset="100%" stopColor="#00c87a" stopOpacity="0"/>
            </linearGradient>
          </defs>
          {/* Reflexo no chão */}
          <rect x="0" y="200" width="800" height="50" fill="url(#sky)" opacity="0.5"/>
          {/* Prédios */}
          {[
            [10,60,45,190],[60,100,20,150],[85,40,38,210],[88,15,10,30],
            [128,70,55,180],[183,25,65,225],[186,0,14,28],[250,80,32,170],
            [285,45,48,205],[333,5,58,245],[357,0,9,20],
            [395,60,42,190],[440,30,68,220],[508,70,38,180],
            [550,15,52,235],[605,50,42,200],[650,85,32,165],
            [685,35,58,215],[745,65,36,185],[782,90,22,160]
          ].map(([x,y,w,h],i)=>(
            <g key={i}>
              <rect x={x} y={y} width={w} height={h} fill="#0c1820" stroke="#1a3040" strokeWidth="0.5"/>
              {/* Janelas */}
              {Array.from({length:Math.floor(h/18)},(_,j)=>
                Array.from({length:Math.floor(w/10)},(_,k)=>(
                  <rect key={`${j}-${k}`} x={x+4+k*10} y={y+6+j*18} width={4} height={6}
                    fill={Math.random()>0.4?'#f5a800':'#00c87a'} opacity={0.3+Math.random()*0.5}/>
                ))
              )}
            </g>
          ))}
          {/* Empire State */}
          <rect x="330" y="5" width="58" height="240" fill="#0e1f2e" stroke="#1a3040" strokeWidth="1"/>
          <rect x="345" y="0" width="28" height="30" fill="#0e1f2e"/>
          <rect x="353" y="-15" width="12" height="20" fill="#0e1f2e"/>
          <line x1="359" y1="-20" x2="359" y2="0" stroke="#00c87a" strokeWidth="2" opacity="0.8"/>
          {/* Glow no topo */}
          <ellipse cx="359" cy="-18" rx="8" ry="4" fill="url(#glow1)" opacity="0.6"/>
        </svg>
      </div>

      {/* RODA INTERATIVA GIRANDO */}
      <div style={{position:'absolute',top:'5%',right:'-5%',width:220,height:220,animation:'spin-slow 8s linear infinite',opacity:0.15}}>
        <svg viewBox="0 0 200 200" style={{width:'100%',height:'100%'}}>
          <circle cx="100" cy="100" r="95" fill="none" stroke="#00c87a" strokeWidth="2"/>
          <circle cx="100" cy="100" r="75" fill="none" stroke="#f5a800" strokeWidth="1"/>
          <circle cx="100" cy="100" r="55" fill="none" stroke="#00c87a" strokeWidth="1"/>
          <circle cx="100" cy="100" r="15" fill="#00c87a" opacity="0.3"/>
          {Array.from({length:37},(_,i)=>{
            const a=(i/37)*Math.PI*2;
            return(<g key={i}>
              <line x1={100+Math.cos(a)*55} y1={100+Math.sin(a)*55} x2={100+Math.cos(a)*95} y2={100+Math.sin(a)*95} stroke={i%2===0?'#00c87a':'#d42035'} strokeWidth="8" opacity="0.8"/>
              <text x={100+Math.cos(a)*45} y={100+Math.sin(a)*45} textAnchor="middle" dominantBaseline="middle" fontSize="7" fill="white" opacity="0.9">{[0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26][i]}</text>
            </g>);
          })}
        </svg>
      </div>

      {/* Segunda roda menor */}
      <div style={{position:'absolute',bottom:'30%',left:'-3%',width:140,height:140,animation:'spin-slow 12s linear infinite reverse',opacity:0.1}}>
        <svg viewBox="0 0 200 200" style={{width:'100%',height:'100%'}}>
          <circle cx="100" cy="100" r="95" fill="none" stroke="#f5a800" strokeWidth="2"/>
          <circle cx="100" cy="100" r="15" fill="#f5a800" opacity="0.2"/>
          {Array.from({length:37},(_,i)=>{
            const a=(i/37)*Math.PI*2;
            return(<line key={i} x1={100+Math.cos(a)*20} y1={100+Math.sin(a)*20} x2={100+Math.cos(a)*95} y2={100+Math.sin(a)*95} stroke={i%2===0?'#f5a800':'#d42035'} strokeWidth="8" opacity="0.7"/>);
          })}
        </svg>
      </div>

      {/* PARTÍCULAS */}
      {[...Array(20)].map((_,i)=>(
        <div key={i} style={{position:'absolute',left:`${Math.random()*100}%`,top:`${Math.random()*60}%`,width:2,height:2,borderRadius:'50%',background:i%2===0?'#00c87a':'#f5a800',opacity:0.4,animation:`float ${2+Math.random()*3}s ease-in-out infinite`,animationDelay:`${Math.random()*2}s`}}/>
      ))}

      {/* LOGO */}
      <div style={{position:'relative',zIndex:10,textAlign:'center',marginBottom:20}}>
        <div style={{fontSize:11,color:'#2e4a60',letterSpacing:6,marginBottom:8}}>BEM VINDO AO</div>
        <div style={{fontSize:36,fontWeight:900,letterSpacing:6,color:'#e8f5ff',textShadow:'0 0 30px rgba(0,200,122,0.5)',marginBottom:4}}>
          GIOVANNI
        </div>
        <div style={{fontSize:36,fontWeight:900,letterSpacing:6,color:'#00c87a',textShadow:'0 0 30px rgba(0,200,122,0.8)'}}>
          VISION
        </div>
        <div style={{fontSize:10,color:'#2e4a60',letterSpacing:4,marginTop:8}}>REVOLUTION · v7.0 FINAL</div>
      </div>

      {/* CHIPS ANIMADOS */}
      <div style={{position:'relative',zIndex:10,display:'flex',gap:12,marginBottom:24}}>
        {['🔴','⚫','🔴','⚫','🟢'].map((c,i)=>(
          <div key={i} style={{fontSize:24,animation:`float ${1.5+i*0.3}s ease-in-out infinite`,animationDelay:`${i*0.2}s`}}>{c}</div>
        ))}
      </div>

      {/* TOQUE PARA ENTRAR */}
      <div style={{position:'relative',zIndex:10,animation:'pulse-btn 1.5s ease-in-out infinite'}}>
        <div style={{fontSize:12,color:'#00c87a',letterSpacing:4,border:'1px solid rgba(0,200,122,0.4)',padding:'12px 32px',borderRadius:30,background:'rgba(0,200,122,0.08)'}}>
          TOQUE PARA ENTRAR
        </div>
      </div>

      <style>{`
        @keyframes spin-slow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes pulse-btn{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.6;transform:scale(0.97)}}
      `}</style>
    </div>
  );
}

function TelaLogin({ onLogin }) {
  const [s,setS]=useState('');const [err,setErr]=useState(false);
  const tentar=()=>{if(s===SENHA){onLogin();}else{setErr(true);setS('');setTimeout(()=>setErr(false),2000);}};
  return(<div style={{background:'#04080b',minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'0 24px',fontFamily:"'Courier New',monospace"}}>
    <div style={{position:'fixed',inset:0,backgroundImage:'linear-gradient(rgba(0,200,122,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(0,200,122,0.02) 1px,transparent 1px)',backgroundSize:'30px 30px',pointerEvents:'none'}}/>
    <div style={{position:'relative',zIndex:1,width:'100%',maxWidth:340,textAlign:'center'}}>
      <div style={{fontSize:48,marginBottom:16}}>🎰</div>
      <div style={{fontSize:22,fontWeight:900,letterSpacing:4,color:'#e8f5ff',marginBottom:4}}>GIOVANNI <span style={{color:'#00c87a'}}>VISION</span></div>
      <div style={{fontSize:9,color:'#2e4a60',letterSpacing:2,marginBottom:40}}>REVOLUTION · v7.0 FINAL</div>
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
function loadStats(){try{const s=localStorage.getItem('gv_st7');return s?JSON.parse(s):{total:0,first:0,second:0,miss:0,consecutive_miss:0};}catch{return{total:0,first:0,second:0,miss:0,consecutive_miss:0};}}
function saveStats(s){try{localStorage.setItem('gv_st7',JSON.stringify(s));}catch{}}

// ── TX PERFORMANCE ────────────────────────────────────────────────
function calcTX(nums){
  if(nums.length<4)return{tx1Num:0,tx2Num:0,tx1Pct:0,tx2Pct:0,txHot:1};
  const last=nums[0],second=nums[1];
  const t1=term(last),t2=second!==undefined?term(second):0;
  // TX1: 12 + T(último) + T(mais antigo 14) + 3
  const oldest=nums[Math.min(13,nums.length-1)];
  let tx1=12+t1+term(oldest)+3;while(tx1>36)tx1=dsum(tx1);
  // TX2: T(meio) + T(vizinho meio) + 12 + T(último) + T(segundo) + 3
  const midIdx=Math.floor(Math.min(nums.length,14)/2);
  const tMid=term(nums[midIdx]);
  const tMidNext=term(nums[Math.max(midIdx-1,0)]);
  let tx2=tMid+tMidNext+12+t1+t2+3;while(tx2>36)tx2=dsum(tx2);
  // Performance check
  let tx1h=0,tx2h=0,total=0;
  for(let i=1;i<Math.min(nums.length,14);i++){
    const ln=nums[i],pn=nums[i-1],lt=term(ln);
    const old14=nums[Math.min(i+13,nums.length-1)];
    let c1=12+lt+term(old14)+3;while(c1>36)c1=dsum(c1);
    const mi=Math.floor(Math.min(i+14,nums.length)/2);
    const tM=term(nums[Math.min(mi,nums.length-1)]);
    const tMN=term(nums[Math.max(mi-1,0)]);
    const t2c=i+1<nums.length?term(nums[i+1]):0;
    let c2=tM+tMN+12+lt+t2c+3;while(c2>36)c2=dsum(c2);
    if(nbrs(c1,2).includes(pn))tx1h++;
    if(nbrs(c2,2).includes(pn))tx2h++;
    total++;
  }
  const tx1Pct=total>0?Math.round(tx1h/total*100):0;
  const tx2Pct=total>0?Math.round(tx2h/total*100):0;
  return{tx1Num:tx1,tx2Num:tx2,tx1Pct,tx2Pct,txHot:tx1Pct>=tx2Pct?1:2,tx1Formula:`12+T${t1}+T${term(oldest)}+3`,tx2Formula:`T${tMid}+T${tMidNext}+12+T${t1}+T${t2}+3`};
}

// ── MAIN ANALYSIS — LÓGICA DO CHAT ───────────────────────────────
function analyze(nums){
  if(!nums||nums.length<3)return null;
  const last=nums[0],second=nums[1],third=nums[2];
  const t1=term(last),t2=term(second),t3=third!==undefined?term(third):0;

  // ── SCORE POR NÚMERO ──────────────────────────────────────────
  const scores={};
  const add=(n,pts,reason)=>{
    if(n<0||n>36)return;
    if(!scores[n])scores[n]={pts:0,reasons:[]};
    scores[n].pts+=pts;
    if(!scores[n].reasons.includes(reason))scores[n].reasons.push(reason);
  };

  // 1. PERMANÊNCIA dos 3 últimos (mais peso no último)
  (PERM[last]||[]).forEach(n=>add(n,4,`Perm(${last})`));
  if(second!==undefined)(PERM[second]||[]).forEach(n=>add(n,2.5,`Perm(${second})`));
  if(third!==undefined)(PERM[third]||[]).forEach(n=>add(n,1.5,`Perm(${third})`));

  // 2. CAMUFLAGEM — estratégia #1
  const cam=dsum(last);
  if(cam>0)[cam,cam+10,cam+20,cam+30].filter(x=>x<=36).forEach(n=>add(n,4,`Cam(${last}→T${cam})`));

  // 3. CAMUFLAGEM DUPLA — confirmada nos 20 sinais
  if(second!==undefined){
    let cd=last+second;while(cd>36)cd=dsum(cd);
    [cd,cd+10,cd+20,cd+30].filter(x=>x<=36&&x>0).forEach(n=>add(n,3,`CamD(${last}+${second}=T${cd})`));
  }

  // 4. ESPELHO
  if(MIRRORS[last])add(MIRRORS[last],2.5,`Mir(${last}→${MIRRORS[last]})`);
  if(second!==undefined&&MIRRORS[second])add(MIRRORS[second],1.5,`Mir(${second})`);

  // 5. TERMINAL
  [t1,t1+10,t1+20,t1+30].filter(x=>x<=36&&x>0).forEach(n=>add(n,1.5,`T${t1}`));

  // 6. CAVALO
  const horse=HORSES.find(h=>h.includes(t1));
  if(horse)horse.forEach(t=>[t,t+10,t+20,t+30].filter(x=>x<=36&&x>0).forEach(n=>add(n,1,`Cav`)));

  // 7. CICLO
  if(CICLOS[t1])CICLOS[t1].forEach(tc=>[tc,tc+10,tc+20,tc+30].filter(x=>x<=36&&x>0).forEach(n=>add(n,1.5,`Ciclo T${t1}→T${tc}`)));

  // 8. FANTASMA
  if(FANTASMA[t1]!==undefined)add(FANTASMA[t1],2,`Fantasma T${t1}`);

  // 9. FRIO
  const recent20=nums.slice(0,Math.min(20,nums.length));
  const frios=[...Array(37).keys()].filter(n=>!recent20.includes(n));
  frios.forEach(n=>add(n,1,`Frio`));

  // 10. REPETIÇÕES
  const freq={};nums.forEach(n=>{freq[n]=(freq[n]||0)+1;});
  Object.entries(freq).filter(([,v])=>v>=2).forEach(([n,v])=>add(parseInt(n),v*1.5,`Rep ${v}x`));

  // ── CONVERGÊNCIA: números com múltiplas estratégias ───────────
  const sorted=Object.entries(scores)
    .map(([n,d])=>({n:parseInt(n),...d}))
    .sort((a,b)=>b.pts-a.pts);

  // Pega top 2 com maior convergência (múltiplas estratégias)
  const entries=[];const used=new Set();
  const cands=sorted.filter(c=>c.pts>=5).slice(0,6);
  if(!cands.length)cands.push(...sorted.slice(0,2));

  cands.forEach(c=>{
    if(used.has(c.n)||entries.length>=2)return;
    const str=c.pts>=10?'s':c.pts>=6?'m':'n';
    const vc=str==='s'?3:2;
    const nb=nbrs(c.n,vc);
    if(nb.filter(x=>used.has(x)).length>nb.length*0.5&&entries.length>0)return;
    nb.forEach(x=>used.add(x));
    entries.push({main:c.n,nb,vc,str,pts:c.pts,reasons:c.reasons.slice(0,3)});
  });

  // ── 1 FICHA SECA: T+20+1 ─────────────────────────────────────
  let uf=t1+20+1;while(uf>36)uf=dsum(uf);
  const ufHot=t1===8||t1===9;

  // ── TERMINAL DOMINANTE ────────────────────────────────────────
  const tc={};nums.slice(0,14).forEach(n=>{const t=n%10;tc[t]=(tc[t]||0)+1;});
  const topTc=Object.entries(tc).sort((a,b)=>b[1]-a[1])[0];
  const tDom=parseInt(topTc[0]);
  const tDomCount=topTc[1];
  const termNums=[tDom,tDom+10,tDom+20,tDom+30].filter(x=>x<=36&&x>0);

  // ── MESA CHECK ────────────────────────────────────────────────
  const last14=nums.slice(0,Math.min(14,nums.length));
  const regs=last14.map(n=>region(n));
  let alts=0;for(let i=1;i<regs.length;i++)if(regs[i]!==regs[i-1])alts++;
  const altPct=regs.length>1?Math.round(alts/(regs.length-1)*100):100;
  const uniqueT=Object.keys(tc).length;
  const rc={T:0,V:0,O:0,Z:0};last14.forEach(n=>rc[region(n)]++);
  const topR=Object.entries(rc).sort((a,b)=>b[1]-a[1])[0];
  const mesaOk=!(altPct>=80&&uniqueT>=9); // só bloqueia se realmente caótica

  // ── SEMÁFORO — SIMPLES E DIRETO ─────────────────────────────
  const topPts=entries[0]?.pts||0;
  const convergencia=entries[0]?.reasons?.length>=2;
  let sem='yellow';
  // Só vermelho se mesa MUITO caótica (9+ terminais únicos)
  if(uniqueT>=9&&altPct>80){sem='red';}
  else if(convergencia&&topPts>=8){sem='green';}
  else{sem='yellow';} // sempre amarelo no mínimo

  // TX
  const tx=calcTX(nums);

  // Zero protection
  const zeroprot=tDomCount>=4;

  return{entries,sem,mesaOk,altPct,uniqueT,umaFicha:uf,ufHot,ufT:t1,
    tDom,tDomCount,termNums,freq,tc,rc,topR:topR[0],
    frios:frios.slice(0,4),zeroprot,
    fantasmaNum:FANTASMA[t1],
    camDupla:(()=>{let cd=last+second;while(cd>36)cd=dsum(cd);return cd;})(),
    ...tx};
}

// ── LEARNING ─────────────────────────────────────────────────────
function loadW(){try{const s=localStorage.getItem('gv_w7');return s?JSON.parse(s):{perm:1,camuflagem:1,camDupla:1,espelho:1,terminal:1,frio:1,fantasma:1};}catch{return{perm:1,camuflagem:1,camDupla:1,espelho:1,terminal:1,frio:1,fantasma:1};}}
function saveW(w){try{localStorage.setItem('gv_w7',JSON.stringify(w));}catch{}}

export default function Root(){
  const[step,setStep]=useState('splash'); // splash | login | app
  if(step==='splash')return <TelaSplash onEnter={()=>setStep('login')}/>;
  if(step==='login')return <TelaLogin onLogin={()=>setStep('app')}/>;
  return <App/>;
}

function App(){
  const[tl,setTl]=useState([]);
  const[newN,setNewN]=useState('');
  const[tab,setTab]=useState('signal');
  const[retry,setRetry]=useState(0);
  const[missed,setMissed]=useState(null);
  const[showFB,setShowFB]=useState(false);
  const[stats,setStats]=useState(()=>loadStats());
  const[analysis,setAnalysis]=useState(null);
  const[confirm,setConfirm]=useState(false);
  const[editIdx,setEditIdx]=useState(null);
  const[calibrating,setCalibrating]=useState(true);
  const[missLog,setMissLog]=useState([]); // track consecutive misses
  const[waiting,setWaiting]=useState(0); // rounds to wait
  const[timer,setTimer]=useState(0);
  const timerRef=useRef(null);

  const C={bg:'#04080b',panel:'#080f14',p2:'#0c1820',border:'#132030',green:'#00c87a',gold:'#f5a800',red:'#d42035',blue:'#38bdf8',text:'#b8d8f0',dim:'#2e4a60',white:'#e8f5ff'};
  const S={s:{c:C.green,bg:'rgba(0,200,122,0.12)',b:'rgba(0,200,122,0.3)',l:'FORTE'},m:{c:C.gold,bg:'rgba(245,168,0,0.12)',b:'rgba(245,168,0,0.3)',l:'MÉDIO'},n:{c:C.red,bg:'rgba(212,32,53,0.12)',b:'rgba(212,32,53,0.3)',l:'FRACO'}};
  const WH=WHEEL;
  const nbrsJ=(n,c)=>{const p=WH.indexOf(n);if(p<0)return[];return Array.from({length:c*2+1},(_,i)=>WH[(p-c+i+WH.length)%WH.length]);};

  // Timer
  useEffect(()=>{
    if(timer>0){
      timerRef.current=setInterval(()=>setTimer(t=>{if(t<=1){clearInterval(timerRef.current);return 0;}return t-1;}),1000);
    }
    return()=>clearInterval(timerRef.current);
  },[timer]);

  const startTimer=()=>{clearInterval(timerRef.current);setTimer(50);};

  const run=useCallback((nums)=>{
    const res=analyze(nums);
    setAnalysis(res);
    setShowFB(true);
  },[]);

  const addN=(n)=>{
    if(n<0||n>36)return;
    const u=[n,...tl].slice(0,50);
    setTl(u);
    if(waiting>0)setWaiting(w=>w-1);
    run(u);
    setRetry(0);setMissed(null);setEditIdx(null);
  };

  const addInput=()=>{const n=parseInt(newN);if(isNaN(n)||n<0||n>36)return;addN(n);setNewN('');};

  const naoBateu=()=>{
    const n=parseInt(newN);
    if(retry===0){if(!isNaN(n)&&n>=0&&n<=36)setMissed(n);setRetry(1);setNewN('');}
    else{if(!isNaN(n)&&n>=0&&n<=36)setMissed(n);setRetry(2);setNewN('');}
  };

  const editNum=(idx,n)=>{if(n<0||n>36)return;const u=[...tl];u[idx]=n;setTl(u);if(u.length>=3)run(u);setEditIdx(null);};

  const handleFB=(r)=>{
    const ns={...stats,total:stats.total+1};
    if(r==='first'){ns.first=(stats.first||0)+1;ns.consecutive_miss=0;}
    if(r==='second'){ns.second=(stats.second||0)+1;ns.consecutive_miss=0;}
    if(r==='miss'){
      ns.miss=(stats.miss||0)+1;
      ns.consecutive_miss=(stats.consecutive_miss||0)+1;
      // 2 erros seguidos → aguarda 3 rodadas
      if(ns.consecutive_miss>=2){setWaiting(3);ns.consecutive_miss=0;}
    }
    saveStats(ns);setStats(ns);setShowFB(false);
    startTimer();
    setMissLog(prev=>[...prev,r].slice(-5));
  };

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

    {/* BACKGROUND */}
    <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0,overflow:'hidden'}}>
      <svg style={{position:'absolute',bottom:0,left:0,width:'100%',opacity:0.06}} viewBox="0 0 800 300" preserveAspectRatio="xMidYMax meet">
        <rect x="10" y="80" width="40" height="220" fill="#e8f5ff"/><rect x="55" y="110" width="25" height="190" fill="#e8f5ff"/>
        <rect x="85" y="60" width="35" height="240" fill="#e8f5ff"/><rect x="88" y="40" width="8" height="25" fill="#e8f5ff"/>
        <rect x="125" y="90" width="50" height="210" fill="#e8f5ff"/><rect x="180" y="50" width="60" height="250" fill="#e8f5ff"/>
        <rect x="183" y="20" width="12" height="35" fill="#e8f5ff"/><rect x="245" y="100" width="30" height="200" fill="#e8f5ff"/>
        <rect x="280" y="70" width="45" height="230" fill="#e8f5ff"/><rect x="330" y="30" width="55" height="270" fill="#e8f5ff"/>
        <rect x="355" y="0" width="8" height="35" fill="#e8f5ff"/><rect x="390" y="85" width="40" height="215" fill="#e8f5ff"/>
        <rect x="435" y="55" width="65" height="245" fill="#e8f5ff"/><rect x="505" y="95" width="35" height="205" fill="#e8f5ff"/>
        <rect x="545" y="40" width="50" height="260" fill="#e8f5ff"/><rect x="600" y="75" width="40" height="225" fill="#e8f5ff"/>
        <rect x="645" y="110" width="30" height="190" fill="#e8f5ff"/><rect x="680" y="60" width="55" height="240" fill="#e8f5ff"/>
        <rect x="740" y="90" width="35" height="210" fill="#e8f5ff"/><rect x="778" y="120" width="22" height="180" fill="#e8f5ff"/>
      </svg>
      <div style={{position:'absolute',top:-80,right:-80,width:300,height:300,borderRadius:'50%',border:'2px solid rgba(0,200,122,0.06)',animation:'spin-slow 30s linear infinite'}}>
        {[...Array(37)].map((_,i)=><div key={i} style={{position:'absolute',top:'50%',left:'50%',width:1,height:'50%',background:'rgba(0,200,122,0.04)',transformOrigin:'0 0',transform:`rotate(${i*9.73}deg)`}}/>)}
      </div>
      <div style={{position:'absolute',bottom:-100,left:-100,width:260,height:260,borderRadius:'50%',border:'1px solid rgba(245,168,0,0.05)',animation:'spin-slow 40s linear infinite reverse'}}/>
      <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(0,200,122,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(0,200,122,0.02) 1px,transparent 1px)',backgroundSize:'40px 40px'}}/>
      <div style={{position:'absolute',top:0,left:'50%',transform:'translateX(-50%)',width:'60%',height:200,background:'radial-gradient(ellipse,rgba(0,200,122,0.05) 0%,transparent 70%)'}}/>
    </div>

    {/* TICKER */}
    <div style={{position:'fixed',top:0,left:0,right:0,height:18,background:'rgba(4,8,11,0.97)',borderBottom:`1px solid rgba(0,200,122,0.1)`,overflow:'hidden',zIndex:100,display:'flex',alignItems:'center'}}>
      <div style={{display:'flex',animation:'ticker 25s linear infinite',whiteSpace:'nowrap'}}>
        {['GIOVANNI VISION','·','REVOLUTION v7.0','·','ANÁLISE EM TEMPO REAL','·','PERM · CAM · CAMDUPLA · TX1 · TX2 · SECA','·','JOGUE COM RESPONSABILIDADE','·','GIOVANNI VISION','·','REVOLUTION v7.0','·','ANÁLISE EM TEMPO REAL','·'].map((t,i)=>(
          <span key={i} style={{fontSize:8,color:i%2===0?'rgba(0,200,122,0.45)':'rgba(245,168,0,0.35)',letterSpacing:2,padding:'0 10px'}}>{t}</span>
        ))}
      </div>
    </div>

    <div style={{position:'fixed',inset:0,background:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px)',pointerEvents:'none',zIndex:9999}}/>

    <div style={{maxWidth:430,margin:'0 auto',padding:'22px 12px 0',position:'relative',zIndex:1}}>

      {/* HEADER */}
      <div style={{padding:'10px 0 8px',borderBottom:`1px solid ${C.border}`,marginBottom:10,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <div style={{fontSize:18,fontWeight:900,letterSpacing:3,color:C.white}}>GIOVANNI <span style={{color:C.green}}>VISION</span></div>
          <div style={{fontSize:8,color:C.dim,letterSpacing:2}}>REVOLUTION · v7.0 FINAL</div>
        </div>
        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4}}>
          {waiting>0&&<div style={{fontSize:9,color:C.red,fontWeight:900}}>⏳ AGUARDA {waiting} rodadas</div>}
          <div style={{fontSize:9,color:semColor,display:'flex',alignItems:'center',gap:4}}>
            <div style={{width:7,height:7,borderRadius:'50%',background:semColor,boxShadow:`0 0 8px ${semColor}`}}/>
            {waiting>0?'PAUSADO':analysis?.sem==='green'?'ENTRAR':analysis?.sem==='yellow'?'CAUTELA':'AGUARDAR'}
          </div>
          {timer>0&&<div style={{fontSize:9,color:timer<=10?C.red:C.blue}}>⏱ {timer}s</div>}
        </div>
      </div>

      {/* WAITING BANNER */}
      {waiting>0&&<div style={{background:'rgba(212,32,53,0.08)',border:`2px solid ${C.red}`,borderRadius:10,padding:12,marginBottom:8,textAlign:'center'}}>
        <div style={{fontSize:14,fontWeight:900,color:C.red,marginBottom:4}}>🛑 2 ERROS SEGUIDOS — PAUSA!</div>
        <div style={{fontSize:11,color:'#ff8090'}}>Aguarde <strong>{waiting}</strong> rodada{waiting>1?'s':''} antes de entrar</div>
        <div style={{fontSize:9,color:C.dim,marginTop:4}}>Continue digitando os números que saírem</div>
      </div>}

      {/* TIMELINE */}
      <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:10,padding:'8px 10px',marginBottom:8}}>
        <div style={{fontSize:8,color:C.dim,letterSpacing:2,marginBottom:5}}>TIMELINE ({tl.length}) → toque para editar</div>
        <div style={{display:'flex',gap:4,overflowX:'auto',minHeight:30}}>
          {tl.length===0?<div style={{fontSize:10,color:C.dim,alignSelf:'center',width:'100%',textAlign:'center'}}>Digite os números para começar</div>:tl.slice(0,18).map((n,i)=>ball(n,i))}
          {tl.length>18&&<div style={{fontSize:9,color:C.dim,alignSelf:'center',flexShrink:0,paddingLeft:4}}>+{tl.length-18}</div>}
        </div>
      </div>

      {/* EDIT */}
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
          <div style={{textAlign:'center'}}><div style={{fontSize:20,fontWeight:900,color:tl.length>=15?C.green:C.blue}}>{tl.length}</div><div style={{fontSize:8,color:C.dim}}>/ 20</div></div>
        </div>
        <div style={{height:4,background:'#0a0a0a',borderRadius:2,overflow:'hidden'}}>
          <div style={{height:'100%',width:`${Math.min(tl.length/20*100,100)}%`,background:`linear-gradient(90deg,${C.blue},${C.green})`,borderRadius:2,transition:'width 0.3s'}}/>
        </div>
      </div>}

      {calibrating&&tl.length>=20&&analysis&&<div style={{background:C.panel,border:`1px solid ${analysis.mesaOk?C.green:C.red}`,borderRadius:10,padding:12,marginBottom:8}}>
        <div style={{fontSize:10,color:analysis.mesaOk?C.green:C.red,fontWeight:900,marginBottom:8}}>
          {analysis.mesaOk?'✅ MESA CALIBRADA — PRONTA!':'⚠️ MESA INSTÁVEL — CONSIDERE TROCAR'}
        </div>
        {analysis.mesaOk&&<div style={{fontSize:9,color:C.dim,marginBottom:8}}>Alt: {analysis.altPct}% · T{analysis.tDom} dominante ({analysis.tDomCount}x) · Região: {analysis.topR}</div>}
        <button onClick={()=>setCalibrating(false)} style={{width:'100%',padding:'8px',background:`linear-gradient(135deg,#006040,${C.green})`,border:'none',borderRadius:7,color:'#000',fontWeight:900,fontSize:12,cursor:'pointer'}}>🎯 IR PARA O SINAL</button>
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
          <button onClick={()=>{setTl([]);setAnalysis(null);setRetry(0);setCalibrating(true);setEditIdx(null);setWaiting(0);}} style={{flex:1,padding:'5px',background:'transparent',border:`1px solid ${C.border}`,borderRadius:5,color:C.dim,fontSize:10,cursor:'pointer'}}>⌫ LIMPAR TUDO</button>
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

        {/* SEMÁFORO */}
        {(!analysis.mesaOk||waiting>0)&&<div style={{background:'#140008',border:`2px solid ${C.red}`,borderRadius:12,padding:14,textAlign:'center',marginBottom:8}}>
          <div style={{fontSize:26,marginBottom:4}}>🔴</div>
          <div style={{fontSize:14,fontWeight:900,color:C.red,letterSpacing:2,marginBottom:4}}>
            {waiting>0?`AGUARDE ${waiting} RODADA${waiting>1?'S':''}`:'MESA INSTÁVEL'}
          </div>
          <div style={{fontSize:10,color:'#b06070'}}>
            {waiting>0?'2 erros seguidos — pausa obrigatória':`Alt ${analysis.altPct}% · ${analysis.uniqueT} terminais únicos`}
          </div>
        </div>}

        {analysis.mesaOk&&waiting===0&&analysis.sem==='yellow'&&<div style={{background:'#120f00',border:`2px solid ${C.gold}`,borderRadius:12,padding:12,marginBottom:8}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}><span style={{fontSize:20}}>🟡</span><div><div style={{fontSize:12,fontWeight:900,color:C.gold}}>CAUTELA — Entre com fichas menores</div><div style={{fontSize:9,color:'#b8a060',marginTop:2}}>Sinal moderado</div></div></div>
        </div>}

        {analysis.mesaOk&&waiting===0&&analysis.sem==='green'&&<div style={{background:'#001408',border:`2px solid ${C.green}`,borderRadius:12,padding:12,marginBottom:8}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <span style={{fontSize:20}}>🟢</span>
            <div style={{flex:1}}><div style={{fontSize:12,fontWeight:900,color:C.green}}>ENTRAR — CONVERGÊNCIA FORTE</div>
            <div style={{fontSize:9,color:'#60b080',marginTop:2}}>{analysis.entries[0]?.reasons?.join(' · ')}</div></div>
          </div>
        </div>}

        {/* ENTRADAS PRINCIPAIS — sempre mostra */}
        {waiting===0&&<>
          {analysis.entries.map((e,i)=>(<div key={i} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:10,marginBottom:7,position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',left:0,top:0,bottom:0,width:3,background:S[e.str].c}}/>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:7}}>
              <div style={{fontSize:9,color:C.dim,paddingLeft:8}}>{e.reasons.join(' · ')}</div>
              <div style={{fontSize:9,padding:'2px 6px',borderRadius:3,background:S[e.str].bg,color:S[e.str].c,border:`1px solid ${S[e.str].b}`}}>{S[e.str].l}</div>
            </div>
            <div style={{display:'flex',flexWrap:'wrap',gap:5,marginBottom:5,paddingLeft:4}}>{e.nb.map((n,j)=><div key={j} style={bigBall(n,n===e.main,e.str)}>{n}</div>)}</div>
            <div style={{fontSize:10,color:C.dim,paddingLeft:4}}><span style={{color:C.white}}>{e.main} com {e.vc}V</span> · {e.nb.length} números</div>
            <div style={{marginTop:4,padding:'3px 8px',background:'rgba(255,255,255,0.03)',borderRadius:4,fontSize:9,color:C.dim,display:'flex',gap:8}}>
              <span>🟡 <b style={{color:C.white}}>{e.main}</b> → 2 fichas</span><span>⚪ vizinhos → 1 ficha</span>
            </div>
          </div>))}

          {/* FEEDBACK */}
          {showFB&&<div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:10,padding:10,marginBottom:8}}>
            <div style={{fontSize:9,color:C.dim,letterSpacing:2,marginBottom:7,textAlign:'center'}}>COMO FOI?</div>
            <div style={{display:'flex',gap:5}}>
              {[['first','✅ BATEU','1ª',C.green],['second','🔄 BATEU','2ª',C.blue],['miss','❌ NÃO','BATEU','#ff7090']].map(([r,l1,l2,c])=>(
                <button key={r} onClick={()=>handleFB(r)} style={{flex:1,padding:'8px 3px',background:`${c}18`,border:`1px solid ${c}44`,borderRadius:7,color:c,fontSize:11,fontWeight:700,cursor:'pointer',lineHeight:1.4}}>{l1}<br/><span style={{fontSize:9,fontWeight:400}}>{l2}</span></button>
              ))}
            </div>
          </div>}

          <div style={{background:'#0a0a00',border:'1px solid #1a1a00',borderRadius:7,padding:'7px 10px',fontSize:9,color:'#888',lineHeight:1.6,marginBottom:8}}>
            🔁 Não bateu → NÃO BATEU → repete · 2x → digita os 2 números
          </div>
        </>}

        {/* TRIPLE X — sempre visível */}
        {<div style={{background:C.bg,border:`1px solid ${C.gold}44`,borderRadius:10,padding:10,marginBottom:7}}>
          <div style={{fontSize:9,color:C.gold,letterSpacing:1,marginBottom:7,display:'flex',justifyContent:'space-between'}}>
            <span>⚡ TRIPLE X</span>
            <span style={{fontWeight:900}}>TX{analysis.txHot} mais quente 🔥</span>
          </div>
          <div style={{display:'flex',gap:6,marginBottom:8}}>
            {[
              {label:'TX1',num:analysis.tx1Num,pct:analysis.tx1Pct,hot:analysis.txHot===1,formula:analysis.tx1Formula},
              {label:'TX2',num:analysis.tx2Num,pct:analysis.tx2Pct,hot:analysis.txHot===2,formula:analysis.tx2Formula}
            ].map(({label,num,pct,hot,formula})=>(
              <div key={label} style={{flex:1,background:hot?'rgba(245,168,0,0.08)':'rgba(255,255,255,0.02)',border:`1px solid ${hot?C.gold+'55':'#1a1a1a'}`,borderRadius:8,padding:'8px 6px',textAlign:'center'}}>
                <div style={{fontSize:8,color:hot?C.gold:C.dim,marginBottom:4,fontWeight:hot?900:400}}>{label} {hot&&'⭐'}</div>
                <div style={{width:34,height:34,borderRadius:'50%',background:RED.has(num)?'#3a0a10':'#0f0f0f',color:RED.has(num)?'#ff9090':'#ccc',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:900,margin:'0 auto 5px',border:`2px solid ${hot?C.gold:'#222'}`,boxShadow:hot?`0 0 8px ${C.gold}44`:'none'}}>{num||'?'}</div>
                <div style={{fontSize:8,color:C.dim,marginBottom:3}}>{formula?.substring(0,14)}</div>
                <div style={{fontSize:11,fontWeight:900,color:pct>=20?C.gold:pct>=10?C.text:C.dim}}>{pct}% {pct>=20&&'🔥'}</div>
                <div style={{height:2,background:'#0a0a0a',borderRadius:1,marginTop:3,overflow:'hidden'}}>
                  <div style={{height:'100%',width:`${Math.min(pct*3,100)}%`,background:pct>=20?C.gold:'#2a2000',borderRadius:1}}/>
                </div>
              </div>
            ))}
          </div>
          {/* Vizinhos TX mais quente */}
          <div style={{fontSize:9,color:C.dim,marginBottom:5}}>2V do TX{analysis.txHot} mais quente:</div>
          <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
            {nbrsJ(analysis.txHot===1?analysis.tx1Num:analysis.tx2Num,2).map((n,i)=>{
              const isMain=n===(analysis.txHot===1?analysis.tx1Num:analysis.tx2Num);
              return(<div key={i} style={{width:30,height:30,borderRadius:'50%',background:isMain?RED.has(n)?'rgba(212,32,53,0.3)':'rgba(245,168,0,0.2)':RED.has(n)?'#3a0a10':'#0f0f0f',color:isMain?C.gold:RED.has(n)?'#ff9090':'#777',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:isMain?900:400,border:`1px solid ${isMain?C.gold:'#222'}`}}>{n}</div>);
            })}
          </div>
        </div>}

        {/* 1 FICHA SECA */}
        {<div style={{background:analysis.ufHot?'rgba(0,200,122,0.06)':C.bg,border:`1px solid ${analysis.ufHot?C.green+'66':C.blue+'44'}`,borderRadius:10,padding:10,marginBottom:7}}>
          {analysis.ufHot&&<div style={{fontSize:8,color:C.green,fontWeight:900,marginBottom:4}}>🔥 T{analysis.ufT} — TERMINAL QUENTE! (~11-17%)</div>}
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:42,height:42,borderRadius:'50%',background:analysis.ufHot?'rgba(0,200,122,0.2)':C.blue+'18',border:`2px solid ${analysis.ufHot?C.green:C.blue}66`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:900,color:analysis.ufHot?C.green:C.blue,flexShrink:0,boxShadow:analysis.ufHot?`0 0 12px ${C.green}44`:'none'}}>{analysis.umaFicha}</div>
            <div>
              <div style={{fontSize:11,color:analysis.ufHot?C.green:C.blue,fontWeight:900}}>💎 NÚMERO SECO</div>
              <div style={{fontSize:9,color:C.dim}}>T+20+1 · 1ª seco · 2ª com 2V</div>
            </div>
          </div>
        </div>}

        {/* TERMINAL DOMINANTE */}
        {analysis.tDomCount>=3&&<div style={{background:C.bg,border:`1px solid ${C.blue}44`,borderRadius:10,padding:10,marginBottom:7}}>
          <div style={{fontSize:9,color:C.blue,fontWeight:900,marginBottom:6}}>🎯 T{analysis.tDom} DOMINANTE ({analysis.tDomCount}x) — 1V cada</div>
          <div style={{display:'flex',gap:5}}>
            {analysis.termNums.map((n,i)=>(
              <div key={i} style={{flex:1,textAlign:'center'}}>
                <div style={{width:34,height:34,borderRadius:'50%',background:RED.has(n)?'rgba(212,32,53,0.15)':'rgba(56,189,248,0.1)',color:RED.has(n)?'#ff9090':C.blue,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:900,border:`1px solid ${RED.has(n)?C.red+'44':C.blue+'44'}`,margin:'0 auto 3px'}}>{n}</div>
                <div style={{fontSize:8,color:C.dim}}>1V</div>
              </div>
            ))}
          </div>
        </div>}

        {/* ZERO PROTECTION */}
        {analysis.zeroprot&&waiting===0&&<div style={{background:'rgba(0,200,122,0.06)',border:`1px solid ${C.green}44`,borderRadius:8,padding:'8px 12px',marginBottom:7,display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:28,height:28,borderRadius:'50%',background:'#082015',border:`1px solid ${C.green}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:900,color:C.green}}>0</div>
          <div style={{fontSize:10,color:C.green}}>⚠️ Terminal saturado — 1 ficha no <strong>0</strong></div>
        </div>}

      </>)}

      {/* ── MESA ── */}
      {tab==='mesa'&&analysis&&(<div>
        {/* Status mesa */}
        <div style={{background:C.panel,border:`1px solid ${analysis.mesaOk?'rgba(0,200,122,0.3)':C.red+'66'}`,borderRadius:10,padding:10,marginBottom:8,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <div style={{fontSize:10,color:analysis.mesaOk?C.green:C.red,fontWeight:900}}>{analysis.mesaOk?'✅ MESA ESTÁVEL':'⚠️ MESA INSTÁVEL'}</div>
            <div style={{fontSize:9,color:C.dim,marginTop:2}}>Alt: {analysis.altPct}% · {analysis.uniqueT} terminais únicos</div>
          </div>
          <div style={{fontSize:9,color:C.dim}}>Região: <span style={{color:C.blue,fontWeight:900}}>{analysis.topR}</span></div>
        </div>

        {/* Regiões */}
        <div style={{display:'flex',gap:5,marginBottom:8}}>
          {Object.entries(analysis.rc).map(([reg,count])=>{
            const colors={T:C.green,V:C.blue,O:C.gold,Z:'#a0ffa0'};
            return(<div key={reg} style={{flex:1,background:C.panel,border:`1px solid ${C.border}`,borderRadius:8,padding:'8px 5px',textAlign:'center'}}>
              <div style={{fontSize:8,color:C.dim,marginBottom:3}}>{reg==='T'?'TIER':reg==='V'?'VOISINS':reg==='O'?'ORPH':'ZERO'}</div>
              <div style={{fontSize:18,fontWeight:900,color:colors[reg]||C.dim}}>{count}</div>
              <div style={{height:3,background:'#0a0a0a',borderRadius:2,marginTop:5,overflow:'hidden'}}><div style={{height:'100%',width:`${Math.round(count/14*100)}%`,background:colors[reg]||C.dim,borderRadius:2}}/></div>
            </div>);
          })}
        </div>

        {/* Heatmap */}
        <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:10,padding:10,marginBottom:8}}>
          <div style={{fontSize:9,color:C.gold,letterSpacing:2,marginBottom:7}}>// MAPA DE CALOR — RODA FÍSICA</div>
          <div style={{display:'flex',overflowX:'auto',gap:2,paddingBottom:4}}>
            {WHEEL.map((n,i)=>{
              const f=analysis.freq[n]||0;
              const bg=f>=3?`rgba(245,168,0,0.4)`:f>=2?`rgba(0,200,122,0.3)`:f>=1?'rgba(56,189,248,0.15)':'#0a0a0a';
              return(<div key={i} style={{minWidth:20,height:32,borderRadius:3,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:bg,border:`1px solid ${f>=2?C.gold:f>=1?C.blue:'#111'}`,flexShrink:0}}>
                <div style={{fontSize:8,fontWeight:f>=1?900:400,color:f>=2?'#fff':f>=1?C.text:'#333'}}>{n}</div>
                {f>0&&<div style={{fontSize:7,color:C.gold,lineHeight:1}}>{f}x</div>}
              </div>);
            })}
          </div>
        </div>

        {/* Frios */}
        <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:10,padding:10,marginBottom:8}}>
          <div style={{fontSize:9,color:C.blue,letterSpacing:2,marginBottom:5}}>❄️ NÚMEROS FRIOS</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
            {[...Array(37).keys()].filter(n=>!tl.slice(0,20).includes(n)).map((n,i)=>(
              <div key={i} style={{width:28,height:28,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:'bold',background:n===0?'#082015':RED.has(n)?'#3a0a10':'#101010',color:n===0?C.green:RED.has(n)?'#ff9090':'#888',border:'1px solid #38bdf830'}}>{n}</div>
            ))}
          </div>
        </div>

        {/* Terminais */}
        <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:10,padding:10}}>
          <div style={{fontSize:9,color:C.dim,letterSpacing:2,marginBottom:7}}>// TERMINAIS</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
            {Object.entries(analysis.tc).sort((a,b)=>b[1]-a[1]).map(([t,count])=>(
              <div key={t} style={{padding:'3px 9px',borderRadius:5,background:count>=3?'rgba(0,200,122,0.12)':count>=2?'rgba(245,168,0,0.12)':'rgba(255,255,255,0.03)',border:`1px solid ${count>=3?'rgba(0,200,122,0.25)':count>=2?'rgba(245,168,0,0.25)':C.border}`,color:count>=3?C.green:count>=2?C.gold:C.dim,fontSize:11,fontWeight:700}}>T{t} ({count}x)</div>
            ))}
          </div>
        </div>
      </div>)}

      {/* ── SESSÃO ── */}
      {tab==='session'&&(<div>
        <div style={{display:'flex',gap:5,marginBottom:8}}>
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
        {missLog.length>0&&<div>
          <div style={{fontSize:9,color:C.dim,marginBottom:6}}>Últimas jogadas:</div>
          {[...missLog].reverse().map((r,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'5px 8px',background:C.panel,border:`1px solid ${r==='first'?'rgba(0,200,122,0.2)':r==='second'?'rgba(56,189,248,0.2)':'rgba(212,32,53,0.2)'}`,borderRadius:6,marginBottom:4}}>
              <span style={{fontSize:14}}>{r==='first'?'✅':r==='second'?'🔄':'❌'}</span>
              <span style={{fontSize:10,color:r==='first'?C.green:r==='second'?C.blue:C.red}}>{r==='first'?'Bateu 1ª':r==='second'?'Bateu 2ª':'Não bateu'}</span>
            </div>
          ))}
        </div>}
      </div>)}

      {/* ── CONFIG ── */}
      {tab==='settings'&&(<div>
        <button onClick={()=>setConfirm(true)} style={{width:'100%',padding:9,background:'transparent',border:`1px solid ${C.red}`,borderRadius:7,color:C.red,fontSize:11,cursor:'pointer',letterSpacing:2,marginBottom:8}}>↺ LIMPAR TUDO</button>
        {confirm&&<div style={{background:'#1a0810',border:`1px solid ${C.red}`,borderRadius:8,padding:10,textAlign:'center',marginBottom:8}}>
          <div style={{fontSize:11,color:'#ff8090',marginBottom:8}}>Limpar timeline e histórico?</div>
          <div style={{display:'flex',gap:6}}>
            <button onClick={()=>{setTl([]);setAnalysis(null);setRetry(0);setCalibrating(true);const ns={total:0,first:0,second:0,miss:0,consecutive_miss:0};saveStats(ns);setStats(ns);setMissLog([]);setWaiting(0);setConfirm(false);}} style={{flex:1,padding:7,background:C.red,border:'none',borderRadius:5,color:'#fff',fontSize:11,cursor:'pointer'}}>SIM</button>
            <button onClick={()=>setConfirm(false)} style={{flex:1,padding:7,background:'transparent',border:`1px solid ${C.border}`,borderRadius:5,color:C.dim,fontSize:11,cursor:'pointer'}}>NÃO</button>
          </div>
        </div>}
        <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:10,padding:12}}>
          <div style={{fontSize:9,color:C.dim,marginBottom:8}}>// SOBRE O SISTEMA</div>
          {['Permanência dos 3 últimos números','Camuflagem — estratégia #1','Camuflagem Dupla (último+segundo)','Espelho do último e segundo','TX1: 12+T(último)+T(antigo)+3','TX2: Tmid+T+12+T+T+3','1 Ficha: T+20+1 (soma=21)','Pausa automática após 2 erros'].map((s,i)=>(
            <div key={i} style={{fontSize:10,color:C.text,lineHeight:1.8,paddingLeft:10,position:'relative'}}>
              <span style={{position:'absolute',left:0,color:C.green,fontSize:9}}>✓</span>{s}
            </div>
          ))}
        </div>
      </div>)}

      <div style={{textAlign:'center',fontSize:8,color:'#1a2a38',marginTop:18,lineHeight:1.8}}>
        ⚠ FERRAMENTA DE ESTUDO · JOGUE COM RESPONSABILIDADE
      </div>
    </div>
    <style>{`
      *{box-sizing:border-box}
      input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}
      ::-webkit-scrollbar{display:none}
      input::placeholder{color:#2e4a60}
      @keyframes spin-slow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
    `}</style>
  </div>);
}
