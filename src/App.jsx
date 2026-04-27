import { useState } from 'react';

// Make sure this points to your local machine!
const API_URL = "http://127.0.0.1:11223";

export default function App() {
  const [seq1, setSeq1] = useState("AATATATACCCCCCCCCCATATATA");
  const [seq2, setSeq2] = useState("AATATATATATATA");
  const [match, setMatch] = useState(2);
  const [mismatch, setMismatch] = useState(-1);
  const [gapOpen, setGapOpen] = useState(-10);
  const [gapExtend, setGapExtend] = useState(-1);
  const [mode, setMode] = useState("local");
  const [apiUrl, setApiUrl] = useState(API_URL);
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [visibleWave, setVisibleWave] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAlign = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/align`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Bypass-Tunnel-Reminder": "true"
        },
        body: JSON.stringify({ seq1, seq2, match, mismatch, gap_open: gapOpen, gap_extend: gapExtend, mode }) 
      });
      
      const data = await response.json();
      setResult(data);
      
      // Trigger Wavefront Animation
      const maxWave = seq1.length + seq2.length + 1;
      setIsAnimating(true);
      setVisibleWave(0);
      
      let currentWave = 0;
      const interval = setInterval(() => {
        currentWave++;
        setVisibleWave(currentWave);
        if (currentWave > maxWave) {
          clearInterval(interval);
          setIsAnimating(false);
        }
      }, 50); 
    } catch (error) {
      console.error("Connection failed.", error);
      alert("Failed to connect to the GPU. Is the Python server running?");
    }
    setLoading(false);
  };

  // --- HEATMAP MATH ---
  // We calculate the global min and max of the matrix to build our color gradient
  let maxVal = -Infinity;
  let minVal = Infinity;
  if (result?.matrix) {
    result.matrix.forEach(row => {
      row.forEach(val => {
        if (val > maxVal) maxVal = val;
        if (val < minVal) minVal = val;
      });
    });
  }
  const valueRange = (maxVal - minVal) || 1; // Prevent division by zero

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#00ff41] font-mono p-8 selection:bg-[#00ff41] selection:text-black">
      {/* Header */}
      <header className="border-4 border-[#00ff41] p-6 mb-8 shadow-[8px_8px_0px_0px_rgba(0,255,65,1)]">
        <h1 className="text-4xl font-black uppercase tracking-tighter">BioCUDA // Triton Engine</h1>
        <p className="mt-2 text-sm opacity-80">GPU-Accelerated Affine Gap Sequence Alignment</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Controls Sidebar */}
        <div className="flex flex-col gap-6 border-2 border-[#00ff41] p-6 h-fit relative">
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,255,65,0.05)_1px,transparent_1px)] bg-[size:100%_4px]"></div>
          
          <div className="relative z-10 mb-2">
            <label className="block mb-2 font-bold uppercase text-xs tracking-widest text-[#00ff41]">GPU Server URL</label>
            <input 
              type="text" 
              className="w-full bg-black border-2 border-[#00ff41] p-2 text-xs text-white outline-none focus:bg-[#00ff41] focus:text-black transition-colors"
              value={apiUrl} 
              onChange={e => {
                let url = e.target.value.trim();
                if (url.endsWith('/')) url = url.slice(0, -1);
                setApiUrl(url);
              }}
            />
          </div>

          <div className="relative z-10">
            <label className="block mb-2 font-bold uppercase text-xs tracking-widest opacity-80">Compute Mode</label>
            <div className="flex border-2 border-[#00ff41] p-1 gap-1 bg-black">
              <button onClick={() => setMode("local")} className={`flex-1 py-2 text-xs font-black uppercase transition-all ${mode === "local" ? "bg-[#00ff41] text-black shadow-[2px_2px_0px_0px_rgba(0,255,65,0.5)]" : "text-[#00ff41] hover:bg-[#00ff41]/10"}`}>
                Local<br/><span className="text-[10px] opacity-70 font-normal">Smith-Waterman</span>
              </button>
              <button onClick={() => setMode("global")} className={`flex-1 py-2 text-xs font-black uppercase transition-all ${mode === "global" ? "bg-[#00ff41] text-black shadow-[2px_2px_0px_0px_rgba(0,255,65,0.5)]" : "text-[#00ff41] hover:bg-[#00ff41]/10"}`}>
                Global<br/><span className="text-[10px] opacity-70 font-normal">Needleman-Wunsch</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-2 font-bold uppercase text-sm">Sequence 1</label>
            <textarea 
              className="w-full bg-transparent border-2 border-[#00ff41] text-sm p-2 outline-none focus:bg-[#00ff41] focus:text-black transition-colors uppercase h-24 resize-y"
              value={seq1} onChange={e => setSeq1(e.target.value.toUpperCase().replace(/[^ACGTU-]/g, ''))}
            />
          </div>
          <div>
            <label className="block mb-2 font-bold uppercase text-sm">Sequence 2</label>
            <input 
              className="w-full bg-transparent border-b-2 border-[#00ff41] text-xl p-2 outline-none focus:bg-[#00ff41] focus:text-black transition-colors uppercase"
              value={seq2} onChange={e => setSeq2(e.target.value.toUpperCase().replace(/[^ACGTU-]/g, ''))}
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div>
              <label className="block mb-2 text-[10px] uppercase font-bold text-[#00ff41]/80">Match</label>
              <input type="number" className="w-full bg-transparent border-2 border-[#00ff41] p-2 text-center outline-none text-sm"
                value={match} onChange={e => setMatch(Number(e.target.value))} />
            </div>
            <div>
              <label className="block mb-2 text-[10px] uppercase font-bold text-[#00ff41]/80">Mismatch</label>
              <input type="number" className="w-full bg-transparent border-2 border-[#00ff41] p-2 text-center outline-none text-sm"
                value={mismatch} onChange={e => setMismatch(Number(e.target.value))} />
            </div>
            <div>
              <label className="block mb-2 text-[10px] uppercase font-bold text-[#00ff41]/80">Gap Open</label>
              <input type="number" className="w-full bg-transparent border-2 border-[#00ff41] p-2 text-center outline-none text-sm"
                value={gapOpen} onChange={e => setGapOpen(Number(e.target.value))} />
            </div>
            <div>
              <label className="block mb-2 text-[10px] uppercase font-bold text-[#00ff41]/80">Gap Ext.</label>
              <input type="number" className="w-full bg-transparent border-2 border-[#00ff41] p-2 text-center outline-none text-sm"
                value={gapExtend} onChange={e => setGapExtend(Number(e.target.value))} />
            </div>
          </div>

          <button 
            onClick={handleAlign} disabled={loading}
            className="mt-4 bg-[#00ff41] text-black font-black text-xl p-4 uppercase hover:bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,255,65,1)] transition-all disabled:opacity-50"
          >
            {loading ? "Computing..." : "Execute Alignment"}
          </button>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {result ? (
            <>
              <div className="border-2 border-[#00ff41] p-6 bg-[#00ff41]/5">
                <h2 className="text-2xl mb-4 uppercase">Peak Score: <span className="font-black text-white">{result.score}</span></h2>
                {/* The Visual Mutation Highlighter */}
                <div className="flex flex-col font-mono text-2xl tracking-[0.3em] font-black overflow-x-auto whitespace-nowrap pb-4 mt-4">
                  {/* Sequence 1 */}
                  <div>
                    {result.seq1_aligned.split('').map((char, i) => {
                      const isMatch = char === result.seq2_aligned[i] && char !== '-';
                      const isGap = char === '-';
                      return (
                        <span key={`s1-${i}`} className={isMatch ? "text-[#00ff41]" : isGap ? "text-gray-600" : "text-red-500"}>
                          {char}
                        </span>
                      );
                    })}
                  </div>
                  
                  {/* The Connector Bar */}
                  <div className="text-sm opacity-50 -my-1">
                    {result.seq1_aligned.split('').map((char, i) => {
                      const isMatch = char === result.seq2_aligned[i] && char !== '-';
                      return <span key={`c-${i}`}>{isMatch ? "|" : "\u00A0"}</span>;
                    })}
                  </div>

                  {/* Sequence 2 */}
                  <div>
                    {result.seq2_aligned.split('').map((char, i) => {
                      const isMatch = char === result.seq1_aligned[i] && char !== '-';
                      const isGap = char === '-';
                      return (
                        <span key={`s2-${i}`} className={isMatch ? "text-[#00ff41]" : isGap ? "text-gray-600" : "text-red-500"}>
                          {char}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
{/* Biological Metrics Panel */}
              <div className="border-2 border-[#00ff41] p-6 bg-black">
                <h3 className="mb-4 uppercase text-sm font-bold border-b-2 border-[#00ff41] inline-block">Biological Metrics</h3>
                <div className="grid grid-cols-3 gap-8 text-sm">
                  <div>
                    <div className="uppercase opacity-70 mb-1 text-[10px] tracking-widest">Sequence Identity</div>
                    <div className="text-3xl font-black text-white">{result.identity}<span className="text-sm text-[#00ff41]"> %</span></div>
                  </div>
                  <div>
                    <div className="uppercase opacity-70 mb-1 text-[10px] tracking-widest">Seq 1 Coverage</div>
                    <div className="text-3xl font-black text-white">{result.coverage1}<span className="text-sm text-[#00ff41]"> %</span></div>
                  </div>
                  <div>
                    <div className="uppercase opacity-70 mb-1 text-[10px] tracking-widest">Seq 2 Coverage</div>
                    <div className="text-3xl font-black text-white">{result.coverage2}<span className="text-sm text-[#00ff41]"> %</span></div>
                  </div>
                </div>
              </div>
              <div className="border-2 border-[#00ff41] p-6">
                <h3 className="mb-4 uppercase text-sm font-bold border-b-2 border-[#00ff41] inline-block">Hardware Telemetry</h3>
                <div className="grid grid-cols-2 gap-8 text-sm">
                  <div>
                    <div className="uppercase opacity-70 mb-1">GPU Execution Time</div>
                    <div className="text-4xl font-black">{result.execution_time_ms} <span className="text-xl">ms</span></div>
                  </div>
                  <div>
                    <p className="text-[#00ff41]/70 text-[10px] uppercase tracking-widest mb-1">Compute Throughput</p>
                    <p className="font-black text-2xl text-[#00ff41] shadow-[#00ff41]/50 drop-shadow-md">
                      {result.gcups} <span className="text-sm font-normal">GCUPS</span>
                    </p>
                  </div>
                  <div>
                    <div className="uppercase opacity-70 mb-1">Wavefront Efficiency</div>
                    <div>Standard CPU Steps: <span className="font-bold text-white">{(seq1.length * seq2.length).toLocaleString()}</span></div>
                    <div>Triton GPU Steps: <span className="font-bold text-white">{(seq1.length + seq2.length).toLocaleString()}</span></div>
                  </div>
                </div>
              </div>

              {seq1.length * seq2.length > 2500 ? (
                <div className="border-2 border-dashed border-[#00ff41]/50 p-6 text-center text-[#00ff41] uppercase animate-pulse">
                  Matrix visualization disabled for sequences {">"} 50x50 to prevent browser overload.
                </div>
              ) : (
                <div className="border-2 border-[#00ff41] p-6 overflow-auto bg-black">
                  <h3 className="mb-4 uppercase text-sm font-bold flex justify-between">
                    <span>Raw GPU Matrix (Heatmap & Traceback)</span>
                    <span className="text-[10px] font-normal opacity-70">Min: {minVal} | Max: {maxVal}</span>
                  </h3>
                  
                  <div 
                    className="grid gap-px text-xs text-center font-bold bg-[#00ff41]/20 border border-[#00ff41]/20 p-px" 
                    style={{ gridTemplateColumns: `repeat(${result.matrix[0].length}, minmax(0, 1fr))` }}
                  >
                    {result.matrix.map((row, i) => 
                      row.map((cell, j) => {
                        const isPath = result.path?.some(([r, c]) => r === i && c === j);
                        const isPeak = result.path?.[0]?.[0] === i && result.path?.[0]?.[1] === j;
                        
                        const cellWave = i + j;
                        const isVisible = cellWave <= visibleWave;
                        const isActiveWave = cellWave === visibleWave && isAnimating;

                        // Calculate Heatmap Color
                        const heatNorm = (cell - minVal) / valueRange;
                        
                        return (
                          <div 
                            key={`${i}-${j}`} 
                            className={`w-8 h-8 flex items-center justify-center text-[10px] transition-all duration-75 relative z-0 ${
                              !isVisible ? 'opacity-0 scale-90 bg-black' : 'opacity-100 scale-100'
                            } ${
                              isActiveWave ? 'bg-white/30 border border-white text-white z-20' : 
                              isPeak && !isAnimating ? 'bg-white text-black shadow-[0_0_15px_#00ff41] scale-110 z-30 animate-pulse font-black' :
                              isPath && !isAnimating ? 'bg-[#00ff41] text-black font-black z-20 shadow-[0_0_8px_rgba(0,255,65,0.8)]' :
                              'text-[#00ff41]/90'
                            }`}
                            // The Heatmap Glow!
                            style={
                              isVisible && !isActiveWave && !isPath && !isPeak 
                                ? { backgroundColor: `rgba(0, 255, 65, ${heatNorm * 0.7})` } 
                                : {}
                            }
                          >
                            {cell}
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="h-full border-2 border-dashed border-[#00ff41]/50 flex items-center justify-center text-[#00ff41]/50 uppercase tracking-widest animate-pulse">
              Awaiting Input...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}