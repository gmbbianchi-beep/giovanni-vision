import { useState, useRef, useCallback } from "react";

// ── ROULETTE ENGINE ───────────────────────────────────────────────
const RED = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
const WHEEL = [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
const TIER = new Set([5,8,10,11,13,16,23,24,27,30,33,36]);
const VOIS = new Set([0,2,3,4,7,12,15,18,19,21,22,25,26,28,29,32,35]);
const PRIMES = new Set([2,3,5,7,11,13,17,19,23,29,31]);
const PERM = {
  0:[6,14,4,7],1:[3,11,21],2:[22,11,19],3:[22,33,11,25],4:[0,7,13,24],
  5:[25,29,33,5],6:[6,9,12,29,19],7:[7,27,23,24],8:[28,8,18,26,2,20,25,34],
  9:[9,1,11,21,29,19],10:[0,9,21,29],11:[29,20,34],12:[12,15],
  13:[0,2,9,20],14:[14,4,30,34],15:[36,15],16:[0,3,9,13,21],
  17:[0,24,20,29],18:[18,28,20,11,6,2,35,0],19:[16,17,18,19,20,21],
  20:[28,8,18,26,2,35],21:[0,16,13,29],22:[0,2,5,13,29],23:[23],
  24:[0,9,3],25:[25,5,7,0],26:[2,18,11,24,7,4],27:[27,36,30],
  28:[8,20,18,28,2,34,0],29:[11,20,34],30:[0,7,20,21],31:[30,28,17],
  32:[6,14,26,19],33:[0,9,25,28],34:[34,35,24],35:[35,36,20,24],36:[36,35,16,0]
};
const QUEBRA = {
  0:[6,9,11,13,15,17,22,32,34,36],1:[0,4,9,19,13],2:[0,5,18,22,28],
  3:[0,1,4,13],4:[0,7,13,24],5:[0,18,25,28],6:[0,2,9,20,27],
  7:[0,5,27,32],8:[0,4,28,20],9:[0,1,11,27],10:[0,9,21,29],
  11:[0,4,20,29],12:[0,6,15,24],13:[0,2,9,20],14:[0,4,8],
  15:[0,9,12,13,20,26],16:[0,3,9,13,21],17:[0,24,20,29],
  18:[0,6,20,23],19:[0,13,16,28],20:[0,2,17],21:[0,16,13,29],
  22:[0,2,5,13,29],23:[0,2,18],24:[0,9],25:[0,5,7,22],
  26:[0,2,18,24],27:[0,30,33,36],28:[0,11,20],29:[0,11,13,14,20,21],
  30:[0,7,20,21],31:[0,4,11],32:[0,9,13,14,27],33:[0,9,25,28],
  34:[0,9,14,35],35:[0,20,33,34,36],36:[0,12,34,35]
};
const MIRRORS = {1:13,13:1,22:25,25:22,2:20,20:2,3:30,30:3,4:31,31:4,5:32,32:5,
  6:33,33:6,7:34,34:7,8:26,26:8,9:27,27:9,10:23,23:10,11:36,36:11,
  12:35,35:12,14:19,19:14,15:21,21:15,16:28,28:16,17:29,29:17,18:24,24:18};
const HORSES = [[1,4,7],[2,5,8],[3,6,9]];

function wpos(n){return WHEEL.indexOf(n);}
function nbrs(n,c){const p=wpos(n);if(p<0)return[];return Array.from({length:c*2+1},(_,i)=>WHEEL[(p-c+i+WHEEL.length)%WHEEL.length]);}
function term(n){return n%10;}
function dsum(n){if(n<=9)return n;const s=Math.floor(n/10)+(n%10);return s>9?Math.floor(s/10)+(s%10):s;}
function region(n){if(n===0)return'Zero';if(TIER.has(n))return'Tier';if(VOIS.has(n))return'Voisins';return'Orph';}

// ── MONTE CARLO ───────────────────────────────────────────────────
function monteCarloOptimize(history) {
  if(history.length<8)return{tripleX:{fx1:12,fx2:3,hits:0,pct:0,top3:[]},umaFicha:{fx1:37,fx2:3,hits:0,pct:0,top3:[]},overallPct:0};
  const total=history.length-1;
  const txResults=[];
  for(let fx1=5;fx1<=20;fx1++){for(let fx2=1;fx2<=9;fx2++){let hits=0;for(let i=1;i<history.length;i++){const t=term(history[i]);let tgt=t+fx1+t+fx2;while(tgt>36)tgt=dsum(tgt);if(nbrs(tgt,2).includes(history[i-1]))hits++;}txResults.push({fx1,fx2,hits,pct:Math.round(hits/total*100)});}}
  txResults.sort((a,b)=>b.hits-a.hits);
  const bestTX={...txResults[0],top3:txResults.slice(0,3)};
  const ufResults=[];
  for(let fx1=20;fx1<=50;fx1++){for(let fx2=1;fx2<=9;fx2++){let hits=0;for(let i=1;i<history.length;i++){const t=term(history[i]);let tgt=t+fx1+fx2;while(tgt>36)tgt=dsum(tgt);if(history[i-1]===tgt)hits++;}ufResults.push({fx1,fx2,hits,pct:Math.round(hits/total*100)});}}
  ufResults.sort((a,b)=>b.hits-a.hits);
  const bestUF={...ufResults[0],top3:ufResults.slice(0,3)};
  let combinedHits=0;
  for(let i=1;i<history.length;i++){const last=history[i],prev=history[i-1],t=term(last);const permH=(PERM[last]||[]).some(n=>nbrs(n,2).includes(prev));const termH=[t,t+10,t+20,t+30].filter(x=>x<=36).some(n=>nbrs(n,1).includes(prev));const camH=(()=>{const c=dsum(last);return[c,c+10,c+20,c+30].filter(x=>x<=36).some(n=>nbrs(n,1).includes(prev));})();const mirH=MIRRORS[last]&&nbrs(MIRRORS[last],2).includes(prev);if(permH||termH||camH||mirH)combinedHits++;}
  return{tripleX:bestTX,umaFicha:bestUF,overallPct:Math.round(combinedHits/total*100)};
}

// ── STRATEGY TESTER ───────────────────────────────────────────────
function testStrategies(history){
  if(history.length<6)return{perm:0,terminal:0,camuflagem:0,cavalo:0,espelho:0,tripleX:0,umaFicha:0,quebra:0};
  const results={perm:0,terminal:0,camuflagem:0,cavalo:0,espelho:0,tripleX:0,umaFicha:0,quebra:0};
  const total=Math.min(history.length-1,20);
  for(let i=1;i<=total;i++){const last=history[i],prev=history[i-1],t=term(last);
    if((PERM[last]||[]).some(n=>nbrs(n,2).includes(prev)))results.perm++;
    if([t,t+10,t+20,t+30].filter(x=>x<=36).some(n=>nbrs(n,1).includes(prev)))results.terminal++;
    const cam=dsum(last);if([cam,cam+10,cam+20,cam+30].filter(x=>x<=36).some(n=>nbrs(n,1).includes(prev)))results.camuflagem++;
    const horse=HORSES.find(h=>h.includes(t));if(horse&&horse.flatMap(t2=>[t2,t2+10,t2+20,t2+30].filter(x=>x<=36)).some(n=>nbrs(n,1).includes(prev)))results.cavalo++;
    if(MIRRORS[last]&&nbrs(MIRRORS[last],2).includes(prev))results.espelho++;
    let tx=t+12+t+3;while(tx>36)tx=dsum(tx);if(nbrs(tx,2).includes(prev))results.tripleX++;
    let uf=t+37+3;while(uf>36)uf=dsum(uf);if(prev===uf)results.umaFicha++;
    if((QUEBRA[last]||[]).some(n=>nbrs(n,1).includes(prev)))results.quebra++;
  }
  return Object.fromEntries(Object.entries(results).map(([k,v])=>[k,Math.round(v/total*100)]));
}

// ── MAIN ANALYSIS ─────────────────────────────────────────────────
function analyze(nums,optimized){
  if(!nums||nums.length<3)return null;
  const scores={};
  const add=(n,pts,reason)=>{if(n<0||n>36)return;if(!scores[n])scores[n]={pts:0,reasons:[]};scores[n].pts+=pts;if(!scores[n].reasons.includes(reason))scores[n].reasons.push(reason);};
  const last=nums[0],second=nums[1],third=nums[2],t1=term(last);
  (PERM[last]||[]).forEach(n=>add(n,3,`Permanência ${last}`));
  if(second!==undefined)(PERM[second]||[]).forEach(n=>add(n,1,`Permanência ${second}`));
  if(third!==undefined)(PERM[third]||[]).forEach(n=>add(n,1,`Permanência ${third}`));
  (QUEBRA[last]||[]).forEach(n=>add(n,2,`Quebra ${last}`));
  [t1,t1+10,t1+20,t1+30].filter(x=>x<=36&&x>0).forEach(n=>add(n,2,`T${t1}`));
  const cam=dsum(last);if(cam!==last&&cam>0)[cam,cam+10,cam+20,cam+30].filter(x=>x<=36).forEach(n=>add(n,2,`Cam ${cam}`));
  const horse=HORSES.find(h=>h.includes(t1));if(horse)horse.forEach(t=>[t,t+10,t+20,t+30].filter(x=>x<=36&&x>0).forEach(n=>add(n,1,`Cavalo ${horse.join('-')}`)));
  if(MIRRORS[last])add(MIRRORS[last],2,`Espelho ${last}`);
  const tc={};nums.forEach(n=>{const t=n%10;tc[t]=(tc[t]||0)+1;});
  const maxT=Math.max(...Object.values(tc));
  if(maxT>=3)add(0,3,`T${Object.entries(tc).sort((a,b)=>b[1]-a[1])[0][0]} rep ${maxT}x`);
  const fx1=optimized?.tripleX?.fx1||12,fx2=optimized?.tripleX?.fx2||3;
  let tx=t1+fx1+t1+fx2;while(tx>36)tx=dsum(tx);
  nbrs(tx,2).forEach(n=>add(n,2,'Triple X'));
  const uf1=optimized?.umaFicha?.fx1||37,uf2=optimized?.umaFicha?.fx2||3;
  let uf=t1+uf1+uf2;while(uf>36)uf=dsum(uf);
  const freq={};nums.forEach(n=>{freq[n]=(freq[n]||0)+1;});
  Object.entries(freq).filter(([,v])=>v>=2).forEach(([n,v])=>add(parseInt(n),v*1.5,`Rep ${v}x`));
  const rPrimes=nums.slice(0,5).filter(n=>PRIMES.has(n));
  if(rPrimes.length>=2)PRIMES.forEach(p=>add(p,1,'Primo'));
  const sorted=Object.entries(scores).map(([n,d])=>({n:parseInt(n),...d})).sort((a,b)=>b.pts-a.pts);
  const entries=[];const used=new Set();
  const cands=sorted.filter(c=>c.pts>=4).slice(0,5);
  if(!cands.length)cands.push(...sorted.slice(0,3));
  cands.forEach(c=>{
    if(used.has(c.n)||entries.length>=3)return;
    const str=c.pts>=8?'s':c.pts>=5?'m':'n';
    const vc=c.pts>=8?3:c.pts>=5?2:1;
    const nb=nbrs(c.n,vc);
    const overlap=nb.filter(x=>used.has(x)).length;
    if(overlap>nb.length*0.6&&entries.length>0)return;
    nb.forEach(x=>used.add(x));used.add(c.n);
    entries.push({main:c.n,nb,vc,str,pts:c.pts,reasons:c.reasons.slice(0,3)});
  });
  const regions={Tier:0,Voisins:0,Orph:0,Zero:0};
  nums.slice(0,14).forEach(n=>{regions[region(n)]++;});
  const topRegion=Object.entries(regions).sort((a,b)=>b[1]-a[1])[0];
  const recent=nums.slice(0,12);
  const regSeq=recent.map(n=>region(n));
  let alts=0;for(let i=1;i<regSeq.length;i++)if(regSeq[i]!==regSeq[i-1])alts++;
  const instavel=alts>regSeq.length*0.75&&maxT<3&&Math.max(...Object.values(freq))<2;
  const hotStrategies=[];
  if(entries.some(e=>e.reasons.some(r=>r.includes('Permanência'))))hotStrategies.push('Permanência');
  if(entries.some(e=>e.reasons.some(r=>r.startsWith('T')&&!r.includes('Triple'))))hotStrategies.push('Terminal');
  if(entries.some(e=>e.reasons.some(r=>r.includes('Cam'))))hotStrategies.push('Camuflagem');
  if(entries.some(e=>e.reasons.some(r=>r.includes('Espelho'))))hotStrategies.push('Espelho');
  if(Object.values(freq).some(v=>v>=2))hotStrategies.push('Repetição');
  if(entries.some(e=>e.reasons.some(r=>r.includes('Triple'))))hotStrategies.push('Triple X');
  const mesaScore=hotStrategies.length;
  const semaforo=instavel?'red':mesaScore>=3?'green':mesaScore>=2?'yellow':'red';
  return{entries,instavel,umaFicha:uf,tripleXNum:tx,topRegion:topRegion[0],regionData:regions,shouldEnter:semaforo==='green',semaforo,hotStrategies,mesaScore,maxT,tc,freq,optimizedTX:{fx1,fx2},optimizedUF:{fx1:uf1,fx2:uf2}};
}

// ── APP COMPONENT ─────────────────────────────────────────────────
export default function App(){
  const [phase,setPhase]=useState('upload'); // upload | analyzing | ready
  const [timeline,setTimeline]=useState([]);
  const [analysis,setAnalysis]=useState(null);
  const [optimized,setOptimized]=useState(null);
  const [stratResults,setStratResults]=useState(null);
  const [newNum,setNewNum]=useState('');
  const [tab,setTab]=useState('signal');
  const [retryCount,setRetryCount]=useState(0);
  const [missedNum,setMissedNum]=useState(null);
  const [loadingStep,setLoadingStep]=useState('');
  const [error,setError]=useState('');
  const [showConfirm,setShowConfirm]=useState(false);
  const fileRef=useRef();

  const C={bg:'#04080b',panel:'#080f14',panel2:'#0c1820',border:'#132030',border2:'#1e3448',green:'#00c87a',gold:'#f5a800',red:'#d42035',blue:'#38bdf8',text:'#b8d8f0',dim:'#2e4a60',white:'#e8f5ff'};
  const STR={s:{color:C.green,bg:'rgba(0,200,122,0.12)',border:'rgba(0,200,122,0.3)',label:'FORTE'},m:{color:C.gold,bg:'rgba(245,168,0,0.12)',border:'rgba(245,168,0,0.3)',label:'MÉDIO'},n:{color:C.red,bg:'rgba(212,32,53,0.12)',border:'rgba(212,32,53,0.3)',label:'FRACO'}};

  const runFullAnalysis=useCallback((nums)=>{
    const opt=monteCarloOptimize(nums);
    const strat=testStrategies(nums);
    const res=analyze(nums,opt);
    setOptimized(opt);setStratResults(strat);setAnalysis(res);
  },[]);

  const handleFile=async(file)=>{
    if(!file)return;
    setError('');setPhase('analyzing');
    setLoadingStep('Lendo print...');
    try{
      const b64=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result.split(',')[1]);r.onerror=()=>rej(new Error('Erro ao ler arquivo'));r.readAsDataURL(file);});
      setLoadingStep('IA analisando imagem...');
      const resp=await fetch('/api/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:600,messages:[{role:'user',content:[{type:'image',source:{type:'base64',media_type:file.type||'image/jpeg',data:b64}},{type:'text',text:'Este é um print da tela de Estatísticas de uma roleta ao vivo (aba Últimas 500). Extraia todos os números visíveis nos quadradinhos. Leia da esquerda para direita, de cima para baixo. O canto superior esquerdo é o mais antigo. Retorne SOMENTE este JSON sem texto adicional: {"numeros":[3,21,12,24,19,5]}'}]}]})});
      setLoadingStep('Processando números...');
      const data=await resp.json();
      if(data.error)throw new Error(data.error.message||'Erro na API');
      const raw=(data.content||[]).map(x=>x.text||'').join('');
      const match=raw.replace(/```[\s\S]*?```/g,'').match(/\{[\s\S]*?\}/);
      if(!match)throw new Error('Não consegui ler os números. Tente um print mais nítido.');
      const parsed=JSON.parse(match[0]);
      const nums=(parsed.numeros||[]).filter(n=>typeof n==='number'&&n>=0&&n<=36);
      if(nums.length<5)throw new Error(`Poucos números encontrados (${nums.length}). Certifique que os quadradinhos estão visíveis.`);
      setLoadingStep('Rodando Monte Carlo...');
      const reversed=[...nums].reverse();
      setTimeline(reversed);
      runFullAnalysis(reversed);
      setRetryCount(0);setMissedNum(null);
      setPhase('ready');
    }catch(err){setError(err.message);setPhase('upload');}
  };

  const addNum=()=>{
    const n=parseInt(newNum);if(isNaN(n)||n<0||n>36)return;
    const updated=[n,...timeline].slice(0,50);
    setTimeline(updated);runFullAnalysis(updated);
    setNewNum('');setRetryCount(0);setMissedNum(null);
  };

  const handleNaoBateu=()=>{
    const n=parseInt(newNum);
    if(retryCount===0){if(!isNaN(n)&&n>=0&&n<=36)setMissedNum(n);setRetryCount(1);setNewNum('');}
    else if(retryCount===1){if(!isNaN(n)&&n>=0&&n<=36)setMissedNum(n);setRetryCount(2);setNewNum('');}
  };

  const ballStyle=(n,isMain=false,str='n')=>({width:36,height:36,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:'bold',flexShrink:0,background:isMain?STR[str].bg:n===0?'#082015':RED.has(n)?'#3a0a10':'#0f0f0f',color:isMain?STR[str].color:n===0?C.green:RED.has(n)?'#ff9090':'#666',border:`1px solid ${isMain?STR[str].border:n===0?'#1a5030':RED.has(n)?'#6a1520':'#1a1a1a'}`,boxShadow:isMain?`0 0 12px ${STR[str].color}30`:'none'});

  const tinyBall=(n,i)=>(
    <div key={i} style={{width:26,height:26,borderRadius:'50%',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:'bold',background:n===0?'#082015':RED.has(n)?'#4a0a14':'#111',color:n===0?C.green:RED.has(n)?'#ff9090':'#777',border:`1px solid ${i===0?C.gold:n===0?'#1a5030':RED.has(n)?'#8a1525':'#222'}`}}>{n}</div>
  );

  return(
    <div style={{background:C.bg,minHeight:'100vh',color:C.text,fontFamily:"'Courier New',monospace",paddingBottom:50}}>
      <div style={{position:'fixed',inset:0,background:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.04) 2px,rgba(0,0,0,0.04) 4px)',pointerEvents:'none',zIndex:9999}}/>
      <div style={{position:'fixed',inset:0,backgroundImage:'linear-gradient(rgba(0,200,122,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(0,200,122,0.02) 1px,transparent 1px)',backgroundSize:'30px 30px',pointerEvents:'none'}}/>
      <div style={{maxWidth:430,margin:'0 auto',padding:'0 12px',position:'relative',zIndex:1}}>

        {/* HEADER */}
        <div style={{padding:'14px 0 10px',borderBottom:`1px solid ${C.border}`,marginBottom:12,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <div style={{fontSize:19,fontWeight:900,letterSpacing:4,color:C.white}}>GIOVANNI <span style={{color:C.green}}>VISION</span></div>
            <div style={{fontSize:8,color:C.dim,letterSpacing:2,marginTop:2}}>REVOLUTION · v3.0 ELITE</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:9,color:phase==='ready'?(analysis?.semaforo==='green'?C.green:analysis?.semaforo==='yellow'?C.gold:C.red):C.dim,display:'flex',alignItems:'center',gap:5,justifyContent:'flex-end'}}>
              <div style={{width:7,height:7,borderRadius:'50%',background:phase==='ready'?(analysis?.semaforo==='green'?C.green:analysis?.semaforo==='yellow'?C.gold:C.red):C.dim,boxShadow:`0 0 6px ${phase==='ready'?(analysis?.semaforo==='green'?C.green:analysis?.semaforo==='yellow'?C.gold:C.red):C.dim}`}}/>
              {phase==='ready'?(analysis?.semaforo==='green'?'ENTRAR':analysis?.semaforo==='yellow'?'CAUTELA':'AGUARDAR'):phase==='analyzing'?'LENDO...':'AGUARDA'}
            </div>
            {phase==='ready'&&<div style={{fontSize:8,color:C.dim,marginTop:2}}>{timeline.length} números</div>}
          </div>
        </div>

        {/* UPLOAD */}
        {phase!=='ready'&&(
          <>
            <div onClick={()=>!loadingStep&&fileRef.current?.click()} style={{background:C.panel,border:`2px dashed ${loadingStep?C.dim:C.border}`,borderRadius:14,padding:loadingStep?'28px':'32px 20px',textAlign:'center',cursor:loadingStep?'default':'pointer',marginBottom:12}}>
              {loadingStep?(
                <>
                  <div style={{width:40,height:40,border:`3px solid ${C.border}`,borderTopColor:C.green,borderRadius:'50%',margin:'0 auto 12px',animation:'spin 0.8s linear infinite'}}/>
                  <div style={{fontSize:10,color:C.dim,letterSpacing:2}}>PROCESSANDO</div>
                  <div style={{fontSize:10,color:C.green,marginTop:6}}>{loadingStep}</div>
                </>
              ):(
                <>
                  <div style={{fontSize:34,marginBottom:10}}>📸</div>
                  <div style={{fontSize:17,fontWeight:700,color:C.white,marginBottom:6}}>Print dos 50 números</div>
                  <div style={{fontSize:10,color:C.dim,letterSpacing:1}}>TOQUE AQUI · TELA DE ESTATÍSTICAS</div>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={e=>handleFile(e.target.files[0])}/>
            {error&&<div style={{background:'#1a0810',border:`1px solid ${C.red}`,borderRadius:8,padding:'10px 12px',fontSize:11,color:'#ff8090',marginBottom:12}}>⚠ {error}</div>}
          </>
        )}

        {/* READY */}
        {phase==='ready'&&(
          <>
            {/* Timeline */}
            <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:10,padding:'8px 10px',marginBottom:10}}>
              <div style={{fontSize:8,color:C.dim,letterSpacing:2,marginBottom:6}}>TIMELINE — MAIS RECENTE →</div>
              <div style={{display:'flex',gap:4,overflowX:'auto',paddingBottom:2}}>
                {timeline.slice(0,18).map((n,i)=>tinyBall(n,i))}
                {timeline.length>18&&<div style={{fontSize:9,color:C.dim,alignSelf:'center',flexShrink:0,paddingLeft:4}}>+{timeline.length-18}</div>}
              </div>
            </div>

            {/* Input */}
            <div style={{marginBottom:12}}>
              <div style={{display:'flex',gap:8,marginBottom:retryCount>0?8:0}}>
                <input type="number" min="0" max="36" value={newNum} onChange={e=>setNewNum(e.target.value)} onKeyDown={e=>e.key==='Enter'&&(retryCount<2?handleNaoBateu():addNum())}
                  placeholder={retryCount===0?'⚡ Novo número...':retryCount===1?'2ª tentativa...':'Digite os 2 números...'}
                  style={{flex:1,background:C.panel,border:`2px solid ${retryCount===0?C.green:retryCount===1?C.gold:C.red}`,borderRadius:8,padding:'11px 12px',color:C.white,fontSize:15,fontFamily:'monospace',outline:'none'}}/>
                {retryCount===0&&<button onClick={addNum} style={{padding:'10px 20px',background:`linear-gradient(135deg,#006040,${C.green})`,border:'none',borderRadius:8,color:'#000',fontWeight:900,fontSize:18,cursor:'pointer'}}>＋</button>}
                {retryCount===1&&<button onClick={handleNaoBateu} style={{padding:'10px 14px',background:`linear-gradient(135deg,#604000,${C.gold})`,border:'none',borderRadius:8,color:'#000',fontWeight:900,fontSize:11,cursor:'pointer',letterSpacing:1,lineHeight:1.4}}>NÃO<br/>BATEU</button>}
                {retryCount===2&&<button onClick={addNum} style={{padding:'10px 14px',background:`linear-gradient(135deg,#600010,${C.red})`,border:'none',borderRadius:8,color:'#fff',fontWeight:900,fontSize:11,cursor:'pointer',letterSpacing:1,lineHeight:1.4}}>ADD<br/>NUMS</button>}
              </div>
              {retryCount===1&&<div style={{background:'#1a0f00',border:`1px solid ${C.gold}`,borderRadius:8,padding:'10px 12px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <div><div style={{fontSize:11,color:C.gold,fontWeight:900}}>🔁 1ª TENTATIVA NÃO BATEU</div><div style={{fontSize:10,color:'#b8a060',marginTop:3}}>Repete + 1 ficha no <strong style={{color:C.white}}>{missedNum??'?'}</strong></div></div>
                <button onClick={()=>{setRetryCount(0);setMissedNum(null);}} style={{fontSize:9,padding:'4px 8px',background:'transparent',border:`1px solid ${C.dim}`,borderRadius:5,color:C.dim,cursor:'pointer'}}>DESISTIR</button>
              </div>}
              {retryCount===2&&<div style={{background:'#1a0008',border:`1px solid ${C.red}`,borderRadius:8,padding:'10px 12px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <div><div style={{fontSize:11,color:C.red,fontWeight:900}}>❌ 2ª TENTATIVA NÃO BATEU</div><div style={{fontSize:10,color:'#b06070',marginTop:3}}>Desiste! Digite os <strong style={{color:C.white}}>2 números</strong> que saíram</div></div>
                <button onClick={()=>{setRetryCount(0);setMissedNum(null);}} style={{fontSize:9,padding:'4px 8px',background:'transparent',border:`1px solid ${C.dim}`,borderRadius:5,color:C.dim,cursor:'pointer'}}>CANCELAR</button>
              </div>}
            </div>

            {/* Tabs */}
            <div style={{display:'flex',gap:4,marginBottom:12}}>
              {[['signal','⚡ SINAL'],['strategies','📊 ESTRAT.'],['mesa','🎯 MESA'],['settings','⚙ CONFIG']].map(([id,label])=>(
                <button key={id} onClick={()=>setTab(id)} style={{flex:1,padding:'8px 4px',background:tab===id?C.panel2:'transparent',border:`1px solid ${tab===id?C.border2:C.border}`,borderRadius:7,color:tab===id?C.white:C.dim,fontSize:9,fontWeight:tab===id?700:400,cursor:'pointer',letterSpacing:1}}>{label}</button>
              ))}
            </div>

            {/* ── SINAL ── */}
            {tab==='signal'&&analysis&&(
              <>
                {analysis.instavel||(analysis.semaforo==='red')?(
                  <div style={{background:'#140008',border:`2px solid ${C.red}`,borderRadius:12,padding:16,textAlign:'center',marginBottom:10}}>
                    <div style={{fontSize:28,marginBottom:6}}>🔴</div>
                    <div style={{fontSize:15,fontWeight:900,color:C.red,letterSpacing:3,marginBottom:6}}>{analysis.instavel?'MESA INSTÁVEL':'AGUARDAR 2 RODADAS'}</div>
                    <div style={{fontSize:11,color:'#b06070',lineHeight:1.6}}>Poucas estratégias com sinal.<br/><strong style={{color:C.white}}>Não entre agora</strong> — deixe a mesa se definir.</div>
                    <div style={{marginTop:8,fontSize:10,color:C.dim}}>Estratégias ativas: <span style={{color:C.red}}>{analysis.mesaScore}/6</span></div>
                  </div>
                ):analysis.semaforo==='yellow'?(
                  <div style={{background:'#120f00',border:`2px solid ${C.gold}`,borderRadius:12,padding:14,marginBottom:10}}>
                    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
                      <div style={{fontSize:22}}>🟡</div>
                      <div><div style={{fontSize:13,fontWeight:900,color:C.gold,letterSpacing:2}}>CAUTELA — SINAL FRACO</div><div style={{fontSize:10,color:'#b8a060',marginTop:2}}>Entre com fichas menores ou aguarde +1 rodada</div></div>
                    </div>
                    <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>{analysis.hotStrategies.map((s,i)=><span key={i} style={{fontSize:9,padding:'2px 7px',background:'rgba(245,168,0,0.12)',color:C.gold,border:'1px solid rgba(245,168,0,0.25)',borderRadius:4}}>{s}</span>)}</div>
                  </div>
                ):(
                  <div style={{background:'#001408',border:`2px solid ${C.green}`,borderRadius:12,padding:14,marginBottom:10}}>
                    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
                      <div style={{fontSize:22}}>🟢</div>
                      <div style={{flex:1}}><div style={{fontSize:13,fontWeight:900,color:C.green,letterSpacing:2}}>ENTRAR — SINAL FORTE</div><div style={{fontSize:10,color:'#60b080',marginTop:2}}>{analysis.mesaScore} estratégias convergindo</div></div>
                      {optimized?.overallPct&&<div style={{textAlign:'center'}}><div style={{fontSize:18,fontWeight:900,color:C.green}}>{optimized.overallPct}%</div><div style={{fontSize:8,color:C.dim}}>acerto</div></div>}
                    </div>
                    <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>{analysis.hotStrategies.map((s,i)=><span key={i} style={{fontSize:9,padding:'2px 7px',background:'rgba(0,200,122,0.12)',color:C.green,border:'1px solid rgba(0,200,122,0.25)',borderRadius:4}}>{s}</span>)}</div>
                  </div>
                )}

                {/* Entries */}
                {(analysis.semaforo==='green'||analysis.semaforo==='yellow')&&analysis.entries.map((e,i)=>(
                  <div key={i} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:12,marginBottom:8,position:'relative',overflow:'hidden'}}>
                    <div style={{position:'absolute',left:0,top:0,bottom:0,width:3,background:STR[e.str].color}}/>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                      <div style={{fontSize:9,color:C.dim,letterSpacing:1}}>{e.reasons[0]}</div>
                      <div style={{fontSize:9,padding:'2px 7px',borderRadius:3,background:STR[e.str].bg,color:STR[e.str].color,border:`1px solid ${STR[e.str].border}`}}>{STR[e.str].label} · {e.pts.toFixed(0)}pts</div>
                    </div>
                    <div style={{display:'flex',flexWrap:'wrap',gap:5,marginBottom:6}}>{e.nb.map((n,j)=><div key={j} style={ballStyle(n,n===e.main,e.str)}>{n}</div>)}</div>
                    <div style={{fontSize:10,color:C.dim,lineHeight:1.5}}><span style={{color:C.text}}>{e.main} com {e.vc}V</span> · {e.nb.length} números{e.reasons.length>1&&<><br/>+ {e.reasons.slice(1).join(' · ')}</>}</div>
                    <div style={{marginTop:6,padding:'4px 8px',background:'rgba(255,255,255,0.03)',borderRadius:5,fontSize:9,color:C.dim,display:'flex',gap:8}}>
                      <span>🟡 <strong style={{color:C.white}}>{e.main}</strong> → 2 fichas</span><span>⚪ vizinhos → 1 ficha</span>
                    </div>
                  </div>
                ))}

                {/* 1 ficha + Triple X */}
                {(analysis.semaforo==='green'||analysis.semaforo==='yellow')&&(
                  <div style={{display:'flex',gap:8,marginBottom:10}}>
                    <div style={{flex:1,background:C.bg,border:`1px solid ${stratResults?.umaFicha>=30?'rgba(56,189,248,0.4)':'#0a2030'}`,borderRadius:10,padding:10}}>
                      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                        <div style={{width:38,height:38,borderRadius:'50%',background:'rgba(56,189,248,0.15)',border:'1px solid rgba(56,189,248,0.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:'bold',color:C.blue,flexShrink:0}}>{analysis.umaFicha}</div>
                        <div><div style={{fontSize:9,color:C.blue,letterSpacing:1}}>1 FICHA SÓ</div><div style={{fontSize:8,color:C.dim,marginTop:1}}>T+{analysis.optimizedUF.fx1}+{analysis.optimizedUF.fx2}</div></div>
                      </div>
                      <div style={{height:3,background:'#0a0a0a',borderRadius:2,overflow:'hidden',marginBottom:4}}><div style={{height:'100%',width:`${stratResults?.umaFicha||0}%`,background:stratResults?.umaFicha>=30?C.blue:'#1a2a40',borderRadius:2}}/></div>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <div style={{fontSize:11,fontWeight:900,color:stratResults?.umaFicha>=30?C.blue:C.dim}}>{stratResults?.umaFicha||0}%</div>
                        {stratResults?.umaFicha>=30&&<span style={{fontSize:8,padding:'1px 5px',background:'rgba(56,189,248,0.15)',color:C.blue,border:'1px solid rgba(56,189,248,0.3)',borderRadius:3}}>🔥</span>}
                      </div>
                    </div>
                    <div style={{flex:1,background:C.bg,border:`1px solid ${stratResults?.tripleX>=30?'rgba(245,168,0,0.4)':'#201000'}`,borderRadius:10,padding:10}}>
                      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                        <div style={{width:38,height:38,borderRadius:'50%',background:'rgba(245,168,0,0.15)',border:'1px solid rgba(245,168,0,0.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:'bold',color:C.gold,flexShrink:0}}>{analysis.tripleXNum}</div>
                        <div><div style={{fontSize:9,color:C.gold,letterSpacing:1}}>TRIPLE X</div><div style={{fontSize:8,color:C.dim,marginTop:1}}>T+{analysis.optimizedTX.fx1}+{analysis.optimizedTX.fx2}</div></div>
                      </div>
                      <div style={{height:3,background:'#0a0a0a',borderRadius:2,overflow:'hidden',marginBottom:4}}><div style={{height:'100%',width:`${stratResults?.tripleX||0}%`,background:stratResults?.tripleX>=30?C.gold:'#2a1a00',borderRadius:2}}/></div>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <div style={{fontSize:11,fontWeight:900,color:stratResults?.tripleX>=30?C.gold:C.dim}}>{stratResults?.tripleX||0}%</div>
                        {stratResults?.tripleX>=30&&<span style={{fontSize:8,padding:'1px 5px',background:'rgba(245,168,0,0.15)',color:C.gold,border:'1px solid rgba(245,168,0,0.3)',borderRadius:3}}>🔥</span>}
                      </div>
                    </div>
                  </div>
                )}

                {retryCount===0&&<div style={{background:'#0a0a00',border:'1px solid #1a1a00',borderRadius:8,padding:'8px 12px',fontSize:10,color:'#888',lineHeight:1.6}}>🔁 <span style={{color:C.gold}}>REGRA:</span> Não bateu → <strong style={{color:C.gold}}>NÃO BATEU</strong> → repete · 2x → digita os 2 números</div>}
              </>
            )}

            {/* ── ESTRATÉGIAS ── */}
            {tab==='strategies'&&stratResults&&(
              <div>
                <div style={{fontSize:9,color:C.dim,letterSpacing:2,marginBottom:10}}>// TAXA DE ACERTO · ÚLTIMAS 20 RODADAS</div>
                {Object.entries(stratResults).sort((a,b)=>b[1]-a[1]).map(([key,pct])=>{
                  const labels={perm:'Permanência',terminal:'Terminal',camuflagem:'Camuflagem',cavalo:'Cavalo',espelho:'Espelho',tripleX:'Triple X',umaFicha:'1 Ficha Só',quebra:'Quebra Mesa'};
                  const hot=pct>=40,warm=pct>=25;
                  return(
                    <div key={key} style={{background:C.panel,border:`1px solid ${hot?'rgba(0,200,122,0.3)':warm?'rgba(245,168,0,0.2)':C.border}`,borderRadius:9,padding:'10px 12px',marginBottom:7}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                        <div style={{fontSize:13,fontWeight:700,color:hot?C.green:warm?C.gold:C.dim}}>{labels[key]}</div>
                        <div style={{display:'flex',alignItems:'center',gap:6}}>
                          {hot&&<span style={{fontSize:8,padding:'1px 6px',background:'rgba(0,200,122,0.15)',color:C.green,border:'1px solid rgba(0,200,122,0.3)',borderRadius:4}}>🔥 QUENTE</span>}
                          {warm&&!hot&&<span style={{fontSize:8,padding:'1px 6px',background:'rgba(245,168,0,0.15)',color:C.gold,border:'1px solid rgba(245,168,0,0.3)',borderRadius:4}}>⚡ ATIVA</span>}
                          <span style={{fontSize:14,fontWeight:900,color:hot?C.green:warm?C.gold:C.dim}}>{pct}%</span>
                        </div>
                      </div>
                      <div style={{height:4,background:'#0a0a0a',borderRadius:2,overflow:'hidden'}}><div style={{height:'100%',width:`${pct}%`,background:hot?`linear-gradient(90deg,#006040,${C.green})`:warm?`linear-gradient(90deg,#604000,${C.gold})`:'#1a2a30',borderRadius:2}}/></div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── MESA ── */}
            {tab==='mesa'&&analysis&&(
              <div>
                <div style={{fontSize:9,color:C.dim,letterSpacing:2,marginBottom:10}}>// MAPA DE REGIÕES · ÚLTIMAS 14</div>
                <div style={{display:'flex',gap:6,marginBottom:12}}>
                  {Object.entries(analysis.regionData).map(([reg,count])=>{
                    const colors={Tier:C.green,Voisins:C.blue,Orph:C.gold,Zero:'#a0ffa0'};
                    const pct=Math.round(count/14*100);
                    return(<div key={reg} style={{flex:1,background:C.panel,border:`1px solid ${C.border}`,borderRadius:9,padding:'10px 6px',textAlign:'center'}}>
                      <div style={{fontSize:8,color:C.dim,letterSpacing:1,marginBottom:4}}>{reg.toUpperCase()}</div>
                      <div style={{fontSize:20,fontWeight:900,color:colors[reg]||C.dim}}>{count}</div>
                      <div style={{fontSize:8,color:colors[reg]||C.dim,marginTop:2}}>{pct}%</div>
                      <div style={{height:3,background:'#0a0a0a',borderRadius:2,marginTop:6,overflow:'hidden'}}><div style={{height:'100%',width:`${pct}%`,background:colors[reg]||C.dim,borderRadius:2}}/></div>
                    </div>);
                  })}
                </div>
                <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:10,padding:12,marginBottom:10}}>
                  <div style={{fontSize:9,color:C.dim,letterSpacing:2,marginBottom:8}}>// TERMINAIS DOMINANTES</div>
                  <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                    {Object.entries(analysis.tc).sort((a,b)=>b[1]-a[1]).map(([t,count])=>(
                      <div key={t} style={{padding:'4px 10px',borderRadius:6,background:count>=3?'rgba(0,200,122,0.15)':count>=2?'rgba(245,168,0,0.15)':'rgba(255,255,255,0.03)',border:`1px solid ${count>=3?'rgba(0,200,122,0.3)':count>=2?'rgba(245,168,0,0.3)':C.border}`,color:count>=3?C.green:count>=2?C.gold:C.dim,fontSize:12,fontWeight:700}}>T{t} <span style={{fontSize:9}}>({count}x)</span></div>
                    ))}
                  </div>
                </div>
                <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:10,padding:12,marginBottom:10}}>
                  <div style={{fontSize:9,color:C.dim,letterSpacing:2,marginBottom:8}}>// NÚMEROS QUENTES</div>
                  <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                    {Object.entries(analysis.freq).filter(([,v])=>v>=2).sort((a,b)=>b[1]-a[1]).map(([n,v])=>(
                      <div key={n} style={{...ballStyle(parseInt(n),true,'s'),position:'relative'}}>{n}<span style={{position:'absolute',top:-4,right:-4,fontSize:8,background:C.green,color:'#000',borderRadius:3,padding:'0 3px',fontWeight:900}}>{v}x</span></div>
                    ))}
                    {Object.entries(analysis.freq).filter(([,v])=>v>=2).length===0&&<div style={{fontSize:11,color:C.dim}}>Nenhuma repetição ainda</div>}
                  </div>
                </div>
                <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:10,padding:12}}>
                  <div style={{fontSize:9,color:C.blue,letterSpacing:2,marginBottom:8}}>// LEITURA DE MESA</div>
                  {[`Região dominante: ${analysis.topRegion} (${analysis.regionData[analysis.topRegion]} saídas)`,analysis.maxT>=3&&`Terminal dominante: T${Object.entries(analysis.tc).sort((a,b)=>b[1]-a[1])[0][0]} (${analysis.maxT}x) — considerar zero`,MIRRORS[timeline[0]]&&`Espelho ativo: ${timeline[0]} → ${MIRRORS[timeline[0]]}`,HORSES.find(h=>h.includes(term(timeline[0])))&&`Cavalo: ${HORSES.find(h=>h.includes(term(timeline[0]))).join('-')} dominando`].filter(Boolean).map((r,i)=>(
                    <div key={i} style={{fontSize:12,color:C.text,lineHeight:1.6,marginBottom:4,paddingLeft:12,position:'relative'}}><span style={{position:'absolute',left:0,color:C.dim,fontSize:9}}>▸</span>{r}</div>
                  ))}
                </div>
              </div>
            )}

            {/* ── CONFIG ── */}
            {tab==='settings'&&optimized&&(
              <div>
                <div style={{fontSize:9,color:C.dim,letterSpacing:2,marginBottom:10}}>// MONTE CARLO · NÚMEROS FIXOS OTIMIZADOS</div>
                <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:10,padding:14,marginBottom:10}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                    <div style={{fontSize:13,fontWeight:700,color:C.gold}}>TRIPLE X</div>
                    <div style={{fontSize:9,color:C.green}}>{optimized.tripleX.pct}% acerto</div>
                  </div>
                  {optimized.tripleX.top3?.map((r,i)=>(
                    <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 8px',background:i===0?'rgba(245,168,0,0.08)':'transparent',borderRadius:6,marginBottom:4,border:i===0?'1px solid rgba(245,168,0,0.2)':'none'}}>
                      <div style={{fontSize:11,color:i===0?C.gold:C.dim}}>#{i+1} T + <strong>{r.fx1}</strong> + T + <strong>{r.fx2}</strong></div>
                      <div style={{fontSize:12,fontWeight:900,color:i===0?C.gold:C.dim}}>{r.pct}%</div>
                    </div>
                  ))}
                </div>
                <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:10,padding:14,marginBottom:10}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                    <div style={{fontSize:13,fontWeight:700,color:C.blue}}>1 FICHA SÓ</div>
                    <div style={{fontSize:9,color:C.green}}>{optimized.umaFicha.pct}% acerto</div>
                  </div>
                  {optimized.umaFicha.top3?.map((r,i)=>(
                    <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 8px',background:i===0?'rgba(56,189,248,0.08)':'transparent',borderRadius:6,marginBottom:4,border:i===0?'1px solid rgba(56,189,248,0.2)':'none'}}>
                      <div style={{fontSize:11,color:i===0?C.blue:C.dim}}>#{i+1} T + <strong>{r.fx1}</strong> + <strong>{r.fx2}</strong></div>
                      <div style={{fontSize:12,fontWeight:900,color:i===0?C.blue:C.dim}}>{r.pct}%</div>
                    </div>
                  ))}
                </div>
                <div style={{background:'#080a04',border:'1px solid #1a2010',borderRadius:8,padding:'10px 12px',fontSize:10,color:'#6a8050',lineHeight:1.6,marginBottom:12}}>
                  💡 Monte Carlo testa <strong style={{color:C.green}}>centenas de combinações</strong> a cada número adicionado — sempre usando a melhor para aquela sessão.
                </div>
                <button onClick={()=>setShowConfirm(true)} style={{width:'100%',padding:10,background:'transparent',border:`1px solid ${C.red}`,borderRadius:8,color:C.red,fontSize:12,cursor:'pointer',letterSpacing:2}}>↺ NOVO PRINT</button>
                {showConfirm&&<div style={{marginTop:8,background:'#1a0810',border:`1px solid ${C.red}`,borderRadius:8,padding:12,textAlign:'center'}}>
                  <div style={{fontSize:12,color:'#ff8090',marginBottom:10}}>Voltar para upload?</div>
                  <div style={{display:'flex',gap:8}}>
                    <button onClick={()=>{setPhase('upload');setTimeline([]);setAnalysis(null);setOptimized(null);setStratResults(null);setShowConfirm(false);setRetryCount(0);}} style={{flex:1,padding:8,background:C.red,border:'none',borderRadius:6,color:'#fff',fontSize:12,cursor:'pointer'}}>SIM</button>
                    <button onClick={()=>setShowConfirm(false)} style={{flex:1,padding:8,background:'transparent',border:`1px solid ${C.border}`,borderRadius:6,color:C.dim,fontSize:12,cursor:'pointer'}}>NÃO</button>
                  </div>
                </div>}
              </div>
            )}
          </>
        )}

        <div style={{textAlign:'center',fontSize:8,color:'#1a2a38',marginTop:20,lineHeight:1.8,letterSpacing:1}}>
          ⚠ FERRAMENTA DE ESTUDO · JOGUE COM RESPONSABILIDADE<br/>
          PERMANÊNCIA · TERMINAIS · CAMUFLAGEM · CAVALOS · ESPELHOS · TRIPLE X · MONTE CARLO
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}*{box-sizing:border-box}input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}::-webkit-scrollbar{display:none}input::placeholder{color:#2e4a60}`}</style>
    </div>
  );
}
