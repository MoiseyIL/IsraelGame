/* ---------- audio ---------- */
let AC=null,noiseBuf=null,hissG=null,soundOn=true;
function initAudio(){if(AC)return;try{AC=new(window.AudioContext||window.webkitAudioContext)();const len=AC.sampleRate*2;noiseBuf=AC.createBuffer(1,len,AC.sampleRate);const d=noiseBuf.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;
  const s=AC.createBufferSource();s.buffer=noiseBuf;s.loop=true;const bp=AC.createBiquadFilter();bp.type='bandpass';bp.frequency.value=2400;bp.Q.value=.7;hissG=AC.createGain();hissG.gain.value=0;s.connect(bp).connect(hissG).connect(AC.destination);s.start();}catch(e){AC=null;}}
function squelch(){if(!AC||!soundOn)return;try{const s=AC.createBufferSource();s.buffer=noiseBuf;const f=AC.createBiquadFilter();f.type='highpass';f.frequency.value=1100;const g=AC.createGain(),t=AC.currentTime;g.gain.setValueAtTime(.16,t);g.gain.exponentialRampToValueAtTime(.001,t+.12);s.connect(f).connect(g).connect(AC.destination);s.start(t,Math.random(),.14);}catch(e){}}
function beep(){if(!AC||!soundOn)return;try{const t=AC.currentTime;[0,.09].forEach((o,i)=>{const os=AC.createOscillator(),g=AC.createGain();os.frequency.value=i?1400:1000;g.gain.setValueAtTime(.05,t+o);g.gain.exponentialRampToValueAtTime(.001,t+o+.07);os.connect(g).connect(AC.destination);os.start(t+o);os.stop(t+o+.08);});}catch(e){}}
function setHiss(on){if(!AC||!hissG)return;hissG.gain.setTargetAtTime(on&&soundOn?.022:0,AC.currentTime,.05);}

