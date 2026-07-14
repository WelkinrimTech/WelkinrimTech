import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FileText, Settings, Wrench, CheckCircle2, Truck, Box } from "lucide-react";

const TIMELINE_NODES = [
  { id: "01", day: "DAY 0", title: "PO Received", desc: "Order intake and spec lockdown", pos: "on-line", left: 40, icon: Box },
  // WT ENGINE is special, left: 280
  { id: "02", day: "DAY 1", title: "PI Raised", desc: "Performa invoice issued to client", pos: "bottom", left: 540, icon: FileText },
  { id: "03", day: "DAY 2 - 9", title: "Manufacturing", desc: "Stator, rotor and PCB fabrication", pos: "top", left: 740, icon: Settings },
  { id: "04", day: "DAY 10 - 11", title: "Assembly", desc: "Rotor, stator and ESC mating", pos: "bottom", left: 940, icon: Wrench },
  { id: "05", day: "DAY 12 - 13", title: "Testing QC", desc: "End-of-line, IR and BEMF testing", pos: "top", left: 1140, icon: CheckCircle2 },
  { id: "06", day: "DAY 13", title: "Invoice Raised", desc: "Final invoice and documentation", pos: "bottom", left: 1340, icon: FileText },
  { id: "07", day: "DAY 14", title: "Shipment", desc: "DTDC, Bluedart or UPS dispatch", pos: "top", left: 1540, icon: Truck },
];

export default function MotorArchitecture() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.15 });

  return (
    <section
      id="process"
      ref={containerRef}
      className="relative w-full bg-[#050505] py-20 md:py-28 overflow-hidden border-t border-white/[0.03]"
    >
      {/* Background grid */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }}></div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-12 lg:px-16">
        
        {/* ── Heading ──────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8"
        >
          <div>
            <h2 className="text-4xl md:text-6xl text-white font-medium tracking-tighter mb-6"
                style={{ fontFamily: "Michroma, sans-serif" }}>
              Inside the engine.
            </h2>
            <div className="flex flex-wrap items-center gap-3 md:gap-5 text-[#808080] text-[9px] md:text-[10px] tracking-[0.2em] font-mono uppercase">
              <span>7 STAGES</span>
              <span className="w-px h-3 bg-white/20"></span>
              <span>3 WEEKS LT</span>
              <span className="w-px h-3 bg-white/20"></span>
              <span>100% TRACEABILITY</span>
              <span className="w-px h-3 bg-white/20"></span>
              <span>END-TO-END</span>
            </div>
          </div>
          <a href="#" className="text-white text-[10px] tracking-[0.2em] font-mono uppercase hover:text-[#ffc812] transition-colors whitespace-nowrap">
            FULL PROCESS DOCS →
          </a>
        </motion.div>

        {/* ── Timeline Container ─────────────────────────────────────────── */}
        <div className="w-full overflow-x-auto pb-16 pt-10 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="relative min-w-[1760px] h-[360px] flex items-center">
            
            {/* The main continuous yellow timeline line */}
            <motion.div 
              initial={{ scaleX: 0, opacity: 0 }}
              animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
              className="absolute top-1/2 -translate-y-1/2 h-4 rounded-full bg-gradient-to-r from-[#ffc812]/80 via-[#ffc812] to-[#ffc812]/40 z-0 origin-left" 
              style={{ left: '100px', right: '40px', boxShadow: '0 0 25px rgba(255, 200, 18, 0.4)' }}
            />

            {/* Connectors & Dots for top/bottom nodes */}
            {TIMELINE_NODES.filter(n => n.pos !== 'on-line').map((node, i) => (
              <motion.div 
                key={`conn-${node.id}`}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + (i * 0.1) }}
              >
                {/* Dot on the main line */}
                <div className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#0a0a0a] z-10" style={{ left: node.left + 90 - 5 }}></div>
                {/* Vertical connector line */}
                <div className={`absolute w-px ${node.pos === 'top' ? 'bg-gradient-to-t bottom-[50%]' : 'bg-gradient-to-b top-[50%]'} from-[#ffc812]/60 to-transparent z-0`} style={{ left: node.left + 90, height: '30px' }}></div>
              </motion.div>
            ))}

            {/* ── Nodes Rendering ────────────────────────────────────────── */}
            
            {/* PO Received (On-line) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute top-1/2 -translate-y-1/2 z-10"
              style={{ left: TIMELINE_NODES[0].left }}
            >
              <NodeBox node={TIMELINE_NODES[0]} />
            </motion.div>

            {/* WT ENGINE (Large central block) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
              className="absolute top-1/2 -translate-y-1/2 z-20"
              style={{ left: 280, width: 200, height: 240 }}
            >
              {/* corner brackets */}
              <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t border-l border-[#ffc812]"></div>
              <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t border-r border-[#ffc812]"></div>
              <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b border-l border-[#ffc812]"></div>
              <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b border-r border-[#ffc812]"></div>

              <div className="w-full h-full bg-gradient-to-b from-[#161616] to-[#0a0a0a] border border-[#ffc812]/20 rounded-lg flex flex-col items-center justify-between py-7 shadow-[0_0_30px_rgba(255,200,18,0.15)] relative overflow-hidden group">
                <div className="absolute inset-0 bg-[#ffc812]/[0.03] group-hover:bg-[#ffc812]/[0.06] transition-colors"></div>
                <div className="flex items-center gap-2 relative z-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ffc812] shadow-[0_0_8px_#ffc812]"></div>
                  <span className="text-[9px] text-[#ffc812] font-mono tracking-widest uppercase font-bold">Processing</span>
                </div>

                <div className="text-center relative z-10">
                  <h3 className="text-5xl text-white font-bold" style={{ fontFamily: "Michroma, sans-serif" }}>WT</h3>
                  <p className="text-[10px] text-white/50 font-mono tracking-[0.4em] uppercase mt-2">Engine</p>
                </div>

                <div className="relative z-10 w-full px-6 flex flex-col items-center">
                  <div className="w-full h-px bg-white/10 mb-3"></div>
                  <p className="text-[8px] text-white/40 font-mono tracking-widest uppercase">Pipeline Active</p>
                  <div className="absolute bottom-[-14px] left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-transparent via-[#ffc812]/80 to-transparent opacity-50 blur-sm"></div>
                </div>
              </div>
            </motion.div>

            {/* Remaining Nodes (Top / Bottom) */}
            {TIMELINE_NODES.filter(n => n.pos !== 'on-line').map((node, i) => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, y: node.pos === 'top' ? 20 : -20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: node.pos === 'top' ? 20 : -20 }}
                transition={{ duration: 0.6, delay: 0.9 + (i * 0.15), ease: "easeOut" }}
                className={`absolute z-10 ${node.pos === 'top' ? 'bottom-[calc(50%+40px)]' : 'top-[calc(50%+40px)]'}`}
                style={{ left: node.left }}
              >
                <NodeBox node={node} />
              </motion.div>
            ))}

          </div>
        </div>
      </div>
    </section>
  );
}

function NodeBox({ node }: { node: typeof TIMELINE_NODES[0] }) {
  const Icon = node.icon;
  return (
    <div className="w-[180px] bg-[#111]/95 backdrop-blur-md border border-white/10 rounded-md p-4 flex flex-col gap-3 shadow-xl hover:border-white/20 transition-all duration-300">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-2 text-[#ffc812]">
          <Icon className="w-3.5 h-3.5" strokeWidth={2.5} />
          <span className="text-[10px] font-mono tracking-widest font-bold whitespace-nowrap">{node.day}</span>
        </div>
        <span className="text-[9px] text-white/30 font-mono border border-white/10 px-1.5 py-0.5 rounded leading-none">{node.id}</span>
      </div>
      <div>
        <h4 className="text-white text-[13px] font-bold mb-1.5 leading-tight" style={{ fontFamily: "Michroma, sans-serif" }}>{node.title}</h4>
        <p className="text-[#808080] text-[10px] leading-relaxed font-sans">{node.desc}</p>
      </div>
    </div>
  );
}

