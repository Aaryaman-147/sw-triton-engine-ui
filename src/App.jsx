import { useState } from 'react';

// PASTE YOUR LOCALTUNNEL LINK HERE (no trailing slash)
const API_URL = "https://better-cars-write.loca.lt";

export default function App() {
  const [seq1, setSeq1] = useState("TGTTACGG");
  const [seq2, setSeq2] = useState("GGTTGACTA");
  const [match, setMatch] = useState(2);
  const [mismatch, setMismatch] = useState(-1);
  const [gap, setGap] = useState(-1);
  const [mode, setMode] = useState("local");
  const [apiUrl, setApiUrl] = useState("");
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAlign = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/align`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Bypass-Tunnel-Reminder": "true"
        },
        // NEW: Added 'mode' to the payload below
        body: JSON.stringify({ seq1, seq2, match, mismatch, gap, mode }) 
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Connection failed. Is the Colab server running?", error);
      alert("Failed to connect to the GPU. Check the console.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#00ff41] font-mono p-8 selection:bg-[#00ff41] selection:text-black">
      {/* Neo-Brutalist Header */}
      <header className="border-4 border-[#00ff41] p-6 mb-8 shadow-[8px_8px_0px_0px_rgba(0,255,65,1)]">
        <h1 className="text-4xl font-black uppercase tracking-tighter">BioCUDA // Local Alignment</h1>
        <p className="mt-2 text-sm opacity-80">GPU-Accelerated Smith-Waterman Triton Engine</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Controls Sidebar */}
        <div className="flex flex-col gap-6 border-2 border-[#00ff41] p-6 h-fit relative">
          {/* Decorative scanline */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,255,65,0.05)_1px,transparent_1px)] bg-[size:100%_4px]"></div>
          {/* Server Connection Bridge */}
          <div className="relative z-10 mb-6">
            <label className="block mb-2 font-bold uppercase text-xs tracking-widest text-[#00ff41]">BioCUDA GPU Server URL</label>
            <input 
              type="text" 
              placeholder="Paste Localtunnel link here..." 
              className="w-full bg-black border-2 border-[#00ff41] p-2 text-xs text-white outline-none focus:bg-[#00ff41] focus:text-black transition-colors placeholder:text-[#00ff41]/50"
              value={apiUrl} 
              onChange={e => {
                // Instantly strip trailing slashes so you never get that 503 error again!
                let url = e.target.value.trim();
                if (url.endsWith('/')) url = url.slice(0, -1);
                setApiUrl(url);
              }}
            />
          </div>
          {/* Engine Mode Toggle */}
          <div className="relative z-10">
            <label className="block mb-2 font-bold uppercase text-xs tracking-widest opacity-80">Alignment Engine</label>
            <div className="flex border-2 border-[#00ff41] p-1 gap-1 bg-black">
              <button
                onClick={() => setMode("local")}
                className={`flex-1 py-2 text-xs font-black uppercase transition-all ${
                  mode === "local" 
                    ? "bg-[#00ff41] text-black shadow-[2px_2px_0px_0px_rgba(0,255,65,0.5)]" 
                    : "text-[#00ff41] hover:bg-[#00ff41]/10"
                }`}
              >
                Local<br/><span className="text-[10px] opacity-70 font-normal">Smith-Waterman</span>
              </button>
              <button
                onClick={() => setMode("global")}
                className={`flex-1 py-2 text-xs font-black uppercase transition-all ${
                  mode === "global" 
                    ? "bg-[#00ff41] text-black shadow-[2px_2px_0px_0px_rgba(0,255,65,0.5)]" 
                    : "text-[#00ff41] hover:bg-[#00ff41]/10"
                }`}
              >
                Global<br/><span className="text-[10px] opacity-70 font-normal">Needleman-Wunsch</span>
              </button>
            </div>
          </div>
          <div>
            <label className="block mb-2 font-bold uppercase text-sm">Sequence 1</label>
            <textarea 
  className="w-full bg-transparent border-2 border-[#00ff41] text-sm p-2 outline-none focus:bg-[#00ff41] focus:text-black transition-colors uppercase h-24 resize-y"
  value={seq1} onChange={e => setSeq1(e.target.value.toUpperCase().replace(/[^ACGT]/g, ''))}
/>
          </div>
          <div>
            <label className="block mb-2 font-bold uppercase text-sm">Sequence 2</label>
            <input 
              className="w-full bg-transparent border-b-2 border-[#00ff41] text-xl p-2 outline-none focus:bg-[#00ff41] focus:text-black transition-colors uppercase"
              value={seq2} onChange={e => setSeq2(e.target.value.toUpperCase())}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block mb-2 text-xs uppercase">Match</label>
              <input type="number" className="w-full bg-transparent border-2 border-[#00ff41] p-2 text-center outline-none"
                value={match} onChange={e => setMatch(Number(e.target.value))} />
            </div>
            <div>
              <label className="block mb-2 text-xs uppercase">Mismatch</label>
              <input type="number" className="w-full bg-transparent border-2 border-[#00ff41] p-2 text-center outline-none"
                value={mismatch} onChange={e => setMismatch(Number(e.target.value))} />
            </div>
            <div>
              <label className="block mb-2 text-xs uppercase">Gap</label>
              <input type="number" className="w-full bg-transparent border-2 border-[#00ff41] p-2 text-center outline-none"
                value={gap} onChange={e => setGap(Number(e.target.value))} />
            </div>
          </div>

          <button 
            onClick={handleAlign}
            disabled={loading}
            className="mt-4 bg-[#00ff41] text-black font-black text-xl p-4 uppercase hover:bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,255,65,1)] transition-all disabled:opacity-50"
          >
            {loading ? "Computing..." : "Execute Alignment"}
          </button>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {result ? (
            <>
              {/* Alignment Display */}
              <div className="border-2 border-[#00ff41] p-6 bg-[#00ff41]/5">
                <h2 className="text-2xl mb-4 uppercase">Peak Score: <span className="font-black text-white">{result.score}</span></h2>
                <div className="text-3xl tracking-[0.5em] font-black break-words">
                  <div>{result.seq1_aligned}</div>
                  <div className="text-white">{result.seq2_aligned}</div>
                </div>
              </div>

              {/* Live Telemetry Panel */}
<div className="border-2 border-[#00ff41] p-6 mt-6">
  <h3 className="mb-4 uppercase text-sm font-bold border-b-2 border-[#00ff41] inline-block">Hardware Telemetry</h3>
  
  <div className="grid grid-cols-2 gap-8 text-sm">
    <div>
      <div className="uppercase opacity-70 mb-1">GPU Execution Time</div>
      <div className="text-4xl font-black">{result.execution_time_ms} <span className="text-xl">ms</span></div>
    </div>
    
    <div>
      <div className="uppercase opacity-70 mb-1">Wavefront Efficiency</div>
      <div>Standard CPU Steps: <span className="font-bold text-white">{(seq1.length * seq2.length).toLocaleString()}</span></div>
      <div>Triton GPU Steps: <span className="font-bold text-white">{(seq1.length + seq2.length).toLocaleString()}</span></div>
    </div>
  </div>
</div>

{/* Dynamic Matrix Visualizer with Overload Safety Switch */}
{seq1.length * seq2.length > 2500 ? (
  <div className="border-2 border-dashed border-[#00ff41]/50 p-6 text-center text-[#00ff41] uppercase animate-pulse mt-6">
    Matrix visualization disabled for sequences {">"} 50x50 to prevent browser overload.<br/>
    Telemetry and Alignment data remain active.
  </div>
) : (
  <div className="border-2 border-[#00ff41] p-6 overflow-auto mt-6">
    <h3 className="mb-4 uppercase text-sm font-bold">Raw GPU Matrix Output (Traceback Path)</h3>
    <div 
      className="grid gap-1 text-xs text-center font-bold" 
      style={{ gridTemplateColumns: `repeat(${result.matrix[0].length}, minmax(0, 1fr))` }}
    >
      {result.matrix.map((row, i) => 
        row.map((cell, j) => {
          const isPath = result.path?.some(([r, c]) => r === i && c === j);
          const isPeak = result.path?.[0]?.[0] === i && result.path?.[0]?.[1] === j;

          return (
            <div 
              key={`${i}-${j}`} 
              className={`p-2 border transition-all duration-300 ${
                isPeak ? 'bg-white text-black shadow-[0_0_15px_#00ff41] scale-110 z-10 animate-pulse border-white' :
                isPath ? 'bg-[#00ff41] text-black border-[#00ff41]' :
                'border-[#00ff41]/20 text-[#00ff41]/30 bg-transparent'
              }`}
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