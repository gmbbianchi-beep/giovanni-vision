import { useState } from "react";
import { analyze } from "./engine/decisionEngine";
import { neighbors } from "./engine/wheel";

const SENHA = "Forra01";
const MAX_ANALISES = 999;
const RED = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
const ZERO_VIZINHOS = [26, 0, 32]; // vizinhos do zero na roda europeia

// ── SPLASH ──────────────────────────────────────────────────────────
function TelaSplash({ onEnter }) {
  const [fade, setFade] = useState(false);
  const enter = () => { setFade(true); setTimeout(onEnter, 600); };

  return (
    <div onClick={enter} style={{position:'fixed',inset:0,background:'#04080b',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',cursor:'pointer',overflow:'hidden',opacity:fade?0:1,transition:'opacity 0.6s'}}>
      <div style={{position:'absolute',bottom:0,left:0,right:0,height:'45%'}}>
        <svg viewBox="0 0 800 250" style={{width:'100%',height:'100%'}} preserveAspectRatio="xMidYMax meet">
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#04080b"/><stop offset="100%" stopColor="#0a1520"/>
            </linearGradient>
            <linearGradient id="glow1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00c87a" stopOpacity="0.6"/><stop offset="100%" stopColor="#00c87a" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <rect x="0" y="200" width="800" height="50" fill="url(#sky)" opacity="0.5"/>
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
              {Array.from({length:Math.floor(h/18)},(_,j)=>
                Array.from({length:Math.floor(w/10)},(_,k)=>(
                  <rect key={`${j}-${k}`} x={x+4+k*10} y={y+6+j*18} width={4} height={6}
                    fill={Math.random()>0.4?'#f5a800':'#00c87a'} opacity={0.3+Math.random()*0.5}/>
                ))
              )}
            </g>
          ))}
          <rect x="330" y="5" width="58" height="240" fill="#0e1f2e" stroke="#1a3040" strokeWidth="1"/>
          <rect x="345" y="0" width="28" height="30" fill="#0e1f2e"/>
          <rect x="353" y="-15" width="12" height="20" fill="#0e1f2e"/>
          <line x1="359" y1="-20" x2="359" y2="0" stroke="#00c87a" strokeWidth="2" opacity="0.8"/>
          <ellipse cx="359" cy="-18" rx="8" ry="4" fill="url(#glow1)" opacity="0.6"/>
        </svg>
      </div>
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
      {[...Array(20)].map((_,i)=>(
        <div key={i} style={{position:'absolute',left:`${Math.random()*100}%`,top:`${Math.random()*60}%`,width:2,height:2,borderRadius:'50%',background:i%2===0?'#00c87a':'#f5a800',opacity:0.4,animation:`float ${2+Math.random()*3}s ease-in-out infinite`,animationDelay:`${Math.random()*2}s`}}/>
      ))}
      <div style={{position:'relative',zIndex:10,textAlign:'center',marginBottom:20}}>
        <div style={{fontSize:11,color:'#2e4a60',letterSpacing:6,marginBottom:8}}>BEM VINDO AO</div>
        <div style={{fontSize:36,fontWeight:900,letterSpacing:6,color:'#e8f5ff',textShadow:'0 0 30px rgba(0,200,122,0.5)',marginBottom:4}}>GIOVANNI</div>
        <div style={{fontSize:36,fontWeight:900,letterSpacing:6,color:'#00c87a',textShadow:'0 0 30px rgba(0,200,122,0.8)'}}>VISION</div>
        <div style={{fontSize:10,color:'#00c87a',letterSpacing:4,marginTop:6,opacity:0.7}}>L A B O R A T Ó R I O</div>
        <div style={{fontSize:9,color:'#2e4a60',letterSpacing:3,marginTop:4}}>SIMULADOR ESTATÍSTICO · v8.0</div>
      </div>
      <div style={{position:'relative',zIndex:10,display:'flex',gap:12,marginBottom:24}}>
        {['🔴','⚫','🔴','⚫','🟢'].map((c,i)=>(
          <div key={i} style={{fontSize:24,animation:`float ${1.5+i*0.3}s ease-in-out infinite`,animationDelay:`${i*0.2}s`}}>{c}</div>
        ))}
      </div>
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

// ── LOGIN ────────────────────────────────────────────────────────────
function TelaLogin({ onLogin }) {
  const [s,setS]=useState('');const [err,setErr]=useState(false);
  const tentar=()=>{if(s===SENHA){onLogin();}else{setErr(true);setS('');setTimeout(()=>setErr(false),2000);}};
  return(
    <div style={{background:'#04080b',minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'0 24px',fontFamily:"'Courier New',monospace"}}>
      <div style={{position:'fixed',inset:0,backgroundImage:'linear-gradient(rgba(0,200,122,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(0,200,122,0.02) 1px,transparent 1px)',backgroundSize:'30px 30px',pointerEvents:'none'}}/>
      <div style={{position:'relative',zIndex:1,width:'100%',maxWidth:340,textAlign:'center'}}>
        <div style={{fontSize:44,marginBottom:14}}>🔬</div>
        <div style={{fontSize:22,fontWeight:900,letterSpacing:4,color:'#e8f5ff',marginBottom:2}}>GIOVANNI <span style={{color:'#00c87a'}}>VISION</span></div>
        <div style={{fontSize:11,color:'#00c87a',letterSpacing:4,marginBottom:4,opacity:0.7}}>L A B</div>
        <div style={{fontSize:9,color:'#2e4a60',letterSpacing:2,marginBottom:36}}>SIMULADOR ESTATÍSTICO · v8.0</div>
        <input type="password" value={s} onChange={e=>setS(e.target.value)} onKeyDown={e=>e.key==='Enter'&&tentar()} placeholder="Digite a senha..."
          style={{width:'100%',background:'#080f14',border:`2px solid ${err?'#d42035':'#132030'}`,borderRadius:10,padding:'14px 16px',color:'#e8f5ff',fontSize:16,fontFamily:'monospace',outline:'none',textAlign:'center',letterSpacing:2,marginBottom:12}}/>
        <button onClick={tentar} style={{width:'100%',padding:'14px',background:'linear-gradient(135deg,#006040,#00c87a)',border:'none',borderRadius:10,color:'#000',fontWeight:900,fontSize:16,letterSpacing:3,cursor:'pointer'}}>ENTRAR</button>
        {err&&<div style={{marginTop:12,fontSize:11,color:'#d42035'}}>⚠ SENHA INCORRETA</div>}
      </div>
    </div>
  );
}

// ── BALL COMPONENT ───────────────────────────────────────────────────
function Ball({ n, main = false }) {
  const isRed = RED.has(n);
  const isZero = n === 0;
  const bg = main
    ? isRed ? 'rgba(212,32,53,0.35)' : isZero ? 'rgba(0,200,122,0.25)' : 'rgba(56,189,248,0.25)'
    : isRed ? '#2a0608' : isZero ? '#082015' : '#0d0d0d';
  const color = main
    ? isRed ? '#ff9090' : isZero ? '#00c87a' : '#38bdf8'
    : isRed ? '#cc7070' : isZero ? '#00c87a' : '#555';
  const border = main
    ? isRed ? '#d42035' : isZero ? '#00c87a' : '#38bdf8'
    : isRed ? '#4a1015' : isZero ? '#1a5030' : '#1a1a1a';
  return (
    <div style={{
      width: main ? 40 : 32,
      height: main ? 40 : 32,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: main ? 14 : 12,
      fontWeight: main ? 900 : 600,
      flexShrink: 0,
      background: bg,
      color,
      border: `${main ? 2 : 1}px solid ${border}`,
      boxShadow: main ? `0 0 14px ${border}55` : 'none',
      transition: 'all 0.2s',
    }}>{n}</div>
  );
}

// ── ZERO FLEX ─────────────────────────────────────────────────────────
function calcZeroFlex(selected, timeline) {
  const allSectorNums = selected.flatMap(s => s.sector);
  const zeroCovered = ZERO_VIZINHOS.some(n => allSectorNums.includes(n));
  if (zeroCovered) {
    return { covered: true, nums: [] };
  }
  // zero flex: 0 + seus vizinhos diretos na roda (26 e 32)
  const freq = {};
  timeline.forEach(n => { freq[n] = (freq[n] || 0) + 1; });
  // se 0 não apareceu nas últimas 14, aumenta relevância
  const zeroAusente = !timeline.includes(0);
  return { covered: false, nums: ZERO_VIZINHOS, zeroAusente };
}

// ── ANÁLISE CARD ─────────────────────────────────────────────────────
function AnaliseCard({ resultado, index, total, timeline }) {
  const labels = ['A', 'B', 'C'];
  const colors = ['#00c87a', '#38bdf8', '#f5a800'];
  const { selected } = resultado;
  const zeroFlex = calcZeroFlex(selected, timeline);
  const isV2 = resultado?.mode === "GV_MASTER_V2";
  const tq =
    resultado?.finalQuality
    || resultado?.operationalStressQuality
    || resultado?.operationalQuality
    || resultado?.timelineQuality;
  const tqColor =
    tq?.label === "FORTE" ? "#00c87a" :
    tq?.label === "OPERÁVEL" ? "#f5a800" :
    "#d42035";

  const allReasons = [...new Set(selected.flatMap(s => s.reasons))];

  return (
    <div style={{background:'#080f14',border:'1px solid #132030',borderRadius:14,overflow:'hidden',marginBottom:12}}>
      <div style={{padding:'10px 14px',borderBottom:'1px solid #132030',display:'flex',justifyContent:'space-between',alignItems:'center',background:'rgba(0,200,122,0.04)'}}>
        <div style={{fontSize:11,fontWeight:900,color:'#00c87a',letterSpacing:2}}>
          🎯 ANÁLISE {index}/{total} — SIMULAÇÃO ESTATÍSTICA
        </div>
        <div style={{fontSize:9,color:'#2e4a60',letterSpacing:1}}>
          14 NÚMEROS
        </div>
      </div>

      {isV2 && (
        <div style={{padding:'12px 14px',borderBottom:'1px solid #132030',background:'rgba(0,200,122,0.03)'}}>
          {resultado.action === "NO_TRADE" ? (
            <div>
              <div style={{fontSize:15,fontWeight:900,color:'#d42035',letterSpacing:2}}>
                🚫 NO TRADE
              </div>
              <div style={{fontSize:10,color:'#b06070',marginTop:6}}>
                {resultado.reason}
              </div>
            </div>
          ) : (
            <div>
              <div style={{fontSize:15,fontWeight:900,color:'#00c87a',letterSpacing:2,marginBottom:8}}>
                🎯 T{resultado.terminal} {resultado.stars}
              </div>

              <div style={{fontSize:11,color:'#b8d8f0',lineHeight:1.8}}>
                🔥 Principal: <strong>{resultado.main}</strong>
                <br/>
                🛡️ Proteção: <strong>{resultado.protection}</strong>
                <br/>
                📊 Score: <strong>{resultado.score}</strong>

                {tq && (
                  <>
                    <br/>
                    🧭 Timeline: <strong style={{color:tqColor}}>
                      {tq.label} · {tq.score}/100
                    </strong>
                    <br/>
                    <span style={{fontSize:9,color:'#6a8a9a'}}>
                      {tq.reasons?.length
                        ? tq.reasons.join(' · ')
                        : 'sem sinais estruturais relevantes'}
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{padding:'12px 14px',display:'flex',flexDirection:'column',gap:10}}>
        {selected.length === 0 && (
          <div style={{fontSize:11,color:'#2e4a60',textAlign:'center',padding:'8px 0'}}>
            Dispersão insuficiente — adicione mais números
          </div>
        )}

        {selected.map((item, i) => (
          <div key={i} style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{
              width:22, height:22, borderRadius:4,
              background:`${colors[i]}18`,
              border:`1px solid ${colors[i]}44`,
              display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:11,fontWeight:900,color:colors[i],flexShrink:0
            }}>{labels[i]}</div>

            <div style={{fontSize:9,color:'#2e4a60',flexShrink:0,lineHeight:1.2}}>
              <span style={{color:colors[i],fontWeight:700}}>{item.number}</span>
              <br/>
              <span>com 2V</span>
            </div>

            <div style={{fontSize:9,color:'#2e4a60',flexShrink:0}}>→</div>

            <div style={{display:'flex',gap:4,flexWrap:'nowrap',overflowX:'auto'}}>
              {item.sector.map((n, j) => (
                <Ball key={j} n={n} main={n === item.number} />
              ))}
            </div>
          </div>
        ))}

        <div style={{borderTop:'1px solid #0d1a22',paddingTop:10}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{
              width:22,height:22,borderRadius:4,
              background:'rgba(0,200,122,0.08)',
              border:'1px solid rgba(0,200,122,0.2)',
              display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:9,fontWeight:900,color:'#00c87a44',flexShrink:0
            }}>0</div>

            <div style={{fontSize:9,color:'#2e4a60',flexShrink:0,lineHeight:1.2}}>
              <span style={{color:'#00c87a',fontWeight:700,opacity:0.6}}>Zero</span>
              <br/>
              <span>flexível</span>
            </div>

            <div style={{fontSize:9,color:'#2e4a60',flexShrink:0}}>=</div>

            {zeroFlex.covered ? (
              <div style={{fontSize:9,color:'#2e4a60',fontStyle:'italic'}}>coberto por setor acima</div>
            ) : (
              <div style={{display:'flex',gap:4,alignItems:'center'}}>
                {zeroFlex.nums.map((n,j) => <Ball key={j} n={n} main={n===0} />)}
                {zeroFlex.zeroAusente && (
                  <div style={{fontSize:8,color:'#00c87a',opacity:0.6,marginLeft:4}}>ausente</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{padding:'10px 14px',borderTop:'1px solid #0d1a22',background:'rgba(255,255,255,0.01)'}}>
        <div style={{fontSize:8,color:'#2e4a60',letterSpacing:2,marginBottom:5}}>MOTIVO</div>
        <div style={{fontSize:10,color:'#6a8a9a',lineHeight:1.7}}>
          Convergência {allReasons.join(' + ')} + geometria da roda + dispersão angular.
        </div>
      </div>
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────────────
function App() {
  const [timeline, setTimeline] = useState([]); // esquerda = mais recente
  const [input, setInput] = useState('');
  const [analises, setAnalises] = useState([]); // histórico de análises da sessão
  const [sessaoEncerrada, setSessaoEncerrada] = useState(false);

  const C = {
    bg:'#04080b', panel:'#080f14', border:'#132030',
    green:'#00c87a', gold:'#f5a800', red:'#d42035',
    blue:'#38bdf8', text:'#b8d8f0', dim:'#2e4a60', white:'#e8f5ff'
  };

  const needsMore = timeline.length < 14;
  const podeanalisar = !needsMore && !sessaoEncerrada && analises.length < MAX_ANALISES;

  const addNumber = (n) => {
    if (n < 0 || n > 36) return;
    setTimeline(prev => [n, ...prev].slice(0, 50));
    setInput('');
  };

  const addInput = () => {
    const n = parseInt(input);
    if (isNaN(n) || n < 0 || n > 36) return;
    addNumber(n);
  };

  const rodarAnalise = () => {
    if (!podeanalisar) return;
    const nums = timeline.slice(0, 14);
    const resultado = analyze(nums);
    if (!resultado) return;
    const novasAnalises = [...analises, { resultado, timeline: [...nums] }];
    setAnalises(novasAnalises);
    if (novasAnalises.length >= MAX_ANALISES) {
      setSessaoEncerrada(true);
    }
  };

  const novasSessao = () => {
    setTimeline([]);
    setInput('');
    setAnalises([]);
    setSessaoEncerrada(false);
  };

  const removeUltimo = () => {
    setTimeline(prev => prev.slice(1));
  };

  const limparTudo = () => {
    setTimeline([]);
    setInput('');
  };

  return (
    <div style={{background:C.bg,minHeight:'100vh',color:C.text,fontFamily:"'Courier New',monospace",paddingBottom:50}}>

      {/* BG decorativo */}
      <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0,overflow:'hidden'}}>
        <div style={{position:'absolute',top:-80,right:-80,width:300,height:300,borderRadius:'50%',border:'2px solid rgba(0,200,122,0.05)',animation:'spin-slow 30s linear infinite'}}/>
        <div style={{position:'absolute',bottom:-100,left:-100,width:260,height:260,borderRadius:'50%',border:'1px solid rgba(245,168,0,0.04)',animation:'spin-slow 40s linear infinite reverse'}}/>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(0,200,122,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(0,200,122,0.015) 1px,transparent 1px)',backgroundSize:'40px 40px'}}/>
      </div>

      {/* TICKER */}
      <div style={{position:'fixed',top:0,left:0,right:0,height:18,background:'rgba(4,8,11,0.97)',borderBottom:'1px solid rgba(0,200,122,0.08)',overflow:'hidden',zIndex:100,display:'flex',alignItems:'center'}}>
        <div style={{display:'flex',animation:'ticker 28s linear infinite',whiteSpace:'nowrap'}}>
          {['GIOVANNI VISION LAB','·','SIMULADOR ESTATÍSTICO','·','3-6-5 + GV365 + CAM + GEOMETRIA','·','APENAS PARA ESTUDO','·','14 NÚMEROS','·','MÁX 5 ANÁLISES','·','GIOVANNI VISION LAB','·','SIMULADOR ESTATÍSTICO','·'].map((t,i)=>(
            <span key={i} style={{fontSize:8,color:i%2===0?'rgba(0,200,122,0.4)':'rgba(245,168,0,0.3)',letterSpacing:2,padding:'0 10px'}}>{t}</span>
          ))}
        </div>
      </div>

      <div style={{maxWidth:430,margin:'0 auto',padding:'26px 12px 0',position:'relative',zIndex:1}}>

        {/* HEADER */}
        <div style={{padding:'10px 0 10px',borderBottom:`1px solid ${C.border}`,marginBottom:12}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
            <div>
              <div style={{fontSize:16,fontWeight:900,letterSpacing:3,color:C.white}}>
                GIOVANNI <span style={{color:C.green}}>VISION</span>
              </div>
              <div style={{fontSize:10,color:C.green,letterSpacing:4,opacity:0.65,marginTop:1}}>L A B</div>
              <div style={{fontSize:8,color:C.dim,letterSpacing:1,marginTop:2}}>SIMULADOR ESTATÍSTICO · ROLETA EUROPEIA</div>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:9,color:analises.length>=MAX_ANALISES?C.red:C.green,fontWeight:700}}>
                {analises.length}/{MAX_ANALISES} análises
              </div>
              <div style={{height:4,width:80,background:'#0d1a22',borderRadius:2,marginTop:4,overflow:'hidden'}}>
                <div style={{height:'100%',width:`${(analises.length/MAX_ANALISES)*100}%`,background:analises.length>=MAX_ANALISES?C.red:C.green,borderRadius:2,transition:'width 0.3s'}}/>
              </div>
              <div style={{fontSize:8,color:C.dim,marginTop:3}}>{timeline.length} núm. na timeline</div>
            </div>
          </div>
        </div>

        {/* AVISO LABORATÓRIO */}
        <div style={{background:'rgba(56,189,248,0.04)',border:'1px solid rgba(56,189,248,0.12)',borderRadius:8,padding:'7px 12px',marginBottom:10,display:'flex',gap:8,alignItems:'center'}}>
          <span style={{fontSize:14}}>🔬</span>
          <div style={{fontSize:9,color:'#4a7a9a',lineHeight:1.6}}>
            <strong style={{color:'#38bdf8'}}>Laboratório estatístico.</strong> Simula padrões da roleta europeia. Não é ferramenta operacional — use apenas para estudo.
          </div>
        </div>

        {/* SESSÃO ENCERRADA */}
        {sessaoEncerrada && (
          <div style={{background:'rgba(212,32,53,0.06)',border:`2px solid ${C.red}`,borderRadius:12,padding:16,marginBottom:12,textAlign:'center'}}>
            <div style={{fontSize:20,marginBottom:8}}>🔴</div>
            <div style={{fontSize:14,fontWeight:900,color:C.red,letterSpacing:2,marginBottom:6}}>
              SESSÃO ENCERRADA
            </div>
            <div style={{fontSize:10,color:'#b06070',marginBottom:14,lineHeight:1.6}}>
              Limite de {MAX_ANALISES} análises atingido.<br/>
              Inicie uma nova sessão para continuar.
            </div>
            <button onClick={novasSessao} style={{padding:'10px 32px',background:`linear-gradient(135deg,#600010,${C.red})`,border:'none',borderRadius:8,color:'#fff',fontWeight:900,fontSize:12,letterSpacing:3,cursor:'pointer'}}>
              NOVA SESSÃO
            </button>
          </div>
        )}

        {/* TIMELINE */}
        <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:10,padding:'8px 10px',marginBottom:8}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
            <div style={{fontSize:8,color:C.dim,letterSpacing:2}}>
              TIMELINE — {timeline.length} números (esquerda = mais recente)
            </div>
            <div style={{display:'flex',gap:5}}>
              <button onClick={removeUltimo} disabled={timeline.length===0}
                style={{fontSize:8,padding:'2px 7px',background:'transparent',border:`1px solid ${timeline.length>0?C.red:C.border}`,borderRadius:4,color:timeline.length>0?C.red:C.dim,cursor:timeline.length>0?'pointer':'default'}}>-1</button>
              <button onClick={limparTudo} disabled={timeline.length===0}
                style={{fontSize:8,padding:'2px 7px',background:'transparent',border:`1px solid ${C.border}`,borderRadius:4,color:C.dim,cursor:'pointer'}}>limpar</button>
            </div>
          </div>
          <div style={{display:'flex',gap:3,overflowX:'auto',minHeight:34,alignItems:'center'}}>
            {timeline.length===0
              ? <div style={{fontSize:10,color:C.dim,textAlign:'center',width:'100%'}}>Digite os 14 últimos números da roleta</div>
              : timeline.slice(0,20).map((n,i)=>(
                  <div key={i} style={{
                    width:26,height:26,borderRadius:'50%',flexShrink:0,
                    display:'flex',alignItems:'center',justifyContent:'center',
                    fontSize:10,fontWeight:'bold',
                    background:i===0?'rgba(245,168,0,0.15)':n===0?'#082015':RED.has(n)?'#2a0608':'#0d0d0d',
                    color:i===0?C.gold:n===0?C.green:RED.has(n)?'#cc7070':'#555',
                    border:`1px solid ${i===0?C.gold:n===0?'#1a5030':RED.has(n)?'#4a1015':'#1a1a1a'}`
                  }}>{n}</div>
                ))
            }
            {timeline.length>20 && <div style={{fontSize:9,color:C.dim,flexShrink:0}}>+{timeline.length-20}</div>}
          </div>
          {/* barra de progresso para 14 */}
          {needsMore && (
            <div style={{marginTop:7}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                <div style={{fontSize:8,color:C.blue}}>Aguardando 14 números para análise</div>
                <div style={{fontSize:9,fontWeight:900,color:C.blue}}>{timeline.length}/14</div>
              </div>
              <div style={{height:3,background:'#0d1a22',borderRadius:2,overflow:'hidden'}}>
                <div style={{height:'100%',width:`${(timeline.length/14)*100}%`,background:`linear-gradient(90deg,${C.blue},${C.green})`,borderRadius:2,transition:'width 0.3s'}}/>
              </div>
            </div>
          )}
        </div>

        {/* INPUT */}
        <div style={{marginBottom:10}}>
          <div style={{display:'flex',gap:6}}>
            <input
              type="number" min="0" max="36" value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&addInput()}
              placeholder="Número (0–36)..."
              style={{flex:1,background:C.panel,border:`2px solid ${C.green}`,borderRadius:8,padding:'10px 12px',color:C.white,fontSize:16,fontFamily:'monospace',outline:'none'}}
            />
            <button onClick={addInput}
              style={{padding:'10px 18px',background:`linear-gradient(135deg,#006040,${C.green})`,border:'none',borderRadius:8,color:'#000',fontWeight:900,fontSize:18,cursor:'pointer'}}>＋</button>
          </div>
        </div>

        {/* GRID RÁPIDO */}
        <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:10,padding:10,marginBottom:10}}>
          <div style={{fontSize:8,color:C.dim,letterSpacing:2,marginBottom:7,textAlign:'center'}}>TOQUE PARA ADICIONAR</div>
          <button onClick={()=>addNumber(0)} style={{display:'block',width:'100%',padding:'8px',background:'#082015',border:'1px solid #1a5030',borderRadius:6,color:C.green,fontFamily:'monospace',fontSize:14,fontWeight:'bold',cursor:'pointer',marginBottom:6,letterSpacing:3}}>— 0 —</button>
          <div style={{display:'grid',gridTemplateColumns:'repeat(9,1fr)',gap:4}}>
            {Array.from({length:36},(_,i)=>i+1).map(n=>(
              <button key={n} onClick={()=>addNumber(n)}
                style={{height:36,borderRadius:6,fontFamily:'monospace',fontSize:13,fontWeight:'bold',cursor:'pointer',border:'none',background:RED.has(n)?'#2a0608':'#0d0d0d',color:RED.has(n)?'#cc7070':'#555'}}>
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* BOTÃO ANALISAR */}
        {!sessaoEncerrada && (
          <button
            onClick={rodarAnalise}
            disabled={!podeanalisar}
            style={{
              width:'100%', padding:'14px',
              background: podeanalisar
                ? `linear-gradient(135deg,#005030,${C.green})`
                : 'rgba(255,255,255,0.04)',
              border: `2px solid ${podeanalisar ? C.green : C.border}`,
              borderRadius:10, color: podeanalisar ? '#000' : C.dim,
              fontWeight:900, fontSize:13, letterSpacing:3,
              cursor: podeanalisar ? 'pointer' : 'not-allowed',
              marginBottom:14, transition:'all 0.2s'
            }}
          >
            {needsMore
              ? `⏳ AGUARDANDO ${14 - timeline.length} NÚMEROS`
              : analises.length >= MAX_ANALISES
              ? `🔴 LIMITE ATINGIDO (${MAX_ANALISES}/${MAX_ANALISES})`
              : `🎯 RODAR ANÁLISE ${analises.length+1}/${MAX_ANALISES}`}
          </button>
        )}

        {/* HISTÓRICO DE ANÁLISES */}
        {analises.length > 0 && (
          <div>
            <div style={{fontSize:8,color:C.dim,letterSpacing:3,marginBottom:10,textAlign:'center'}}>
              — ANÁLISES DA SESSÃO —
            </div>
            {[...analises].reverse().map((a, i) => (
              <AnaliseCard
                key={i}
                resultado={a.resultado}
                index={analises.length - i}
                total={MAX_ANALISES}
                timeline={a.timeline}
              />
            ))}
          </div>
        )}

        {/* ENCERRAR SESSÃO manual */}
        {!sessaoEncerrada && analises.length > 0 && (
          <div style={{marginTop:4,marginBottom:12}}>
            <button onClick={()=>setSessaoEncerrada(true)}
              style={{width:'100%',padding:'9px',background:'transparent',border:`1px solid ${C.border}`,borderRadius:7,color:C.dim,fontSize:10,cursor:'pointer',letterSpacing:2}}>
              ENCERRAR SESSÃO
            </button>
          </div>
        )}

        <div style={{textAlign:'center',fontSize:8,color:'#1a2a38',marginTop:10,marginBottom:4,lineHeight:1.8}}>
          ⚠ LABORATÓRIO ESTATÍSTICO · NÃO É FERRAMENTA OPERACIONAL<br/>
          ROLETA EUROPEIA · 37 NÚMEROS · BASE 14 LANÇAMENTOS
        </div>
      </div>

      <style>{`
        @keyframes spin-slow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        *{box-sizing:border-box}
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
        input[type=number]{-moz-appearance:textfield}
        ::-webkit-scrollbar{width:3px;height:3px}
        ::-webkit-scrollbar-track{background:#04080b}
        ::-webkit-scrollbar-thumb{background:#1a3040;border-radius:2px}
      `}</style>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────
export default function Root() {
  const [step, setStep] = useState('splash');
  if (step === 'splash') return <TelaSplash onEnter={() => setStep('login')} />;
  if (step === 'login') return <TelaLogin onLogin={() => setStep('app')} />;
  return <App />;
}
