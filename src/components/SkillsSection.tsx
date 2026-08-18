import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Smartphone, Wrench, Cpu, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

interface SkillItem {
  name: string;
  level: number;
  category: 'languages' | 'android' | 'tools' | 'devices';
  desc: string;
}

const SKILLS_DATA: SkillItem[] = [
  // Languages
  { name: 'C', level: 95, category: 'languages', desc: 'Kernel drivers, low-level memory management, and system calls.' },
  { name: 'C++', level: 90, category: 'languages', desc: 'HAL implementation, Android native daemons, and OS frameworks.' },
  { name: 'Shell / Bash', level: 92, category: 'languages', desc: 'Automated build pipelines, flashing templates, and CLI tools.' },
  { name: 'Python', level: 78, category: 'languages', desc: 'Build tools automation, parsing, and payload delivery scripts.' },
  { name: 'Makefile / Kconfig', level: 88, category: 'languages', desc: 'Kernel configuration, device Makefile definitions, and AOSP build rules.' },

  // Android & Kernel
  { name: 'Linux Kernel Tweaking', level: 95, category: 'android', desc: 'CPU governor tuning, scheduler optimization, and RAM management.' },
  { name: 'Device Tree (DTB/DTS)', level: 92, category: 'android', desc: 'Xiaomi lisa & sweet hardware separation and pin control mapping.' },
  { name: 'KernelSU & Root Drivers', level: 90, category: 'android', desc: 'Kernel-level permission drivers, su interface, and security patches.' },
  { name: 'AnyKernel3 Flashable Zips', level: 92, category: 'android', desc: 'Dynamic boot image patcher template maintainer.' },
  { name: 'Vendor & Camera Trees', level: 88, category: 'android', desc: 'GCam mod integration and proprietary blobless vendor trees.' },

  // Build & Tools
  { name: 'Git & Repo Tool', level: 95, category: 'tools', desc: 'Multirepo AOSP synchronization, patch merging, and rebase strategies.' },
  { name: 'Clang / GCC Toolchains', level: 90, category: 'tools', desc: 'Custom toolchain compilation with LLVM LTO optimization.' },
  { name: 'AOSP Build System', level: 88, category: 'tools', desc: 'Lunch targets, envy setup, and ROM zip generation.' },
  { name: 'ADB & Fastboot Debugging', level: 95, category: 'tools', desc: 'Logcat analysis, dmesg debugging, ramdisk patching, and fastboot flashing.' },

  // Hardware & Devices
  { name: 'Xiaomi 11 Lite NE 5G (lisa)', level: 95, category: 'devices', desc: 'Full custom kernel & device tree maintainer.' },
  { name: 'Redmi Note 10 Pro (sweet)', level: 95, category: 'devices', desc: 'Android kernel source maintenance & camera config trees.' },
  { name: 'Snapdragon SoC Architecture', level: 88, category: 'devices', desc: 'Qualcomm SM7325 & SM6150 platform driver bringup.' },
];

const SkillCard3D = ({ skill, index }: { skill: SkillItem; index: number }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX(((y - centerY) / centerY) * -12);
    setRotateY(((x - centerX) / centerX) * 12);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.08 }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      }}
      className="group rounded-3xl border border-white/20 bg-white/[0.03] p-6 backdrop-blur-3xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.25),0_12px_32px_rgba(0,0,0,0.35)] hover:border-rose-300/80 hover:bg-white/[0.09] hover:shadow-[0_0_35px_rgba(244,63,94,0.4)] transition-all duration-300 ease-out"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="h-4.5 w-4.5 text-rose-300" />
          <h3 className="text-base font-bold text-white group-hover:text-rose-300 transition-colors">
            {skill.name}
          </h3>
        </div>
        <span className="text-xs font-mono font-bold text-rose-300">
          {skill.level}%
        </span>
      </div>

      <p className="text-xs text-white/75 mb-4 min-h-[32px] leading-relaxed">
        {skill.desc}
      </p>

      {/* Solid Clean Rose Progress bar */}
      <div className="h-2 w-full rounded-full bg-white/15 overflow-hidden shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-full rounded-full bg-rose-400 shadow-md"
        />
      </div>
    </motion.div>
  );
};

export const SkillsSection = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'languages' | 'android' | 'tools' | 'devices'>('all');
  const [showAllSkills, setShowAllSkills] = useState(false);

  const filteredSkills = activeTab === 'all' 
    ? SKILLS_DATA 
    : SKILLS_DATA.filter((s) => s.category === activeTab);

  const displayedSkills = showAllSkills ? filteredSkills : filteredSkills.slice(0, 3);
  const hasMoreSkills = filteredSkills.length > 3;

  return (
    <section id="skills" className="bg-transparent py-20 border-b border-white/10 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3 mb-12"
        >
          <span className="inline-block rounded-full bg-rose-400/20 px-3.5 py-1 text-xs font-semibold text-rose-300 border border-rose-400/40 backdrop-blur-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]">
            TECHNICAL MASTERY
          </span>
          <h2 className="text-3xl font-extrabold md:text-5xl tracking-tight text-white">
            Specialization & Skills
          </h2>
          <p className="text-sm text-white/70 max-w-2xl mx-auto">
            Extracted directly from @zaidkhan0997&apos;s GitHub repositories, device trees, and Android kernel commits.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-2.5 mb-12"
        >
          <button
            onClick={() => { setActiveTab('all'); setShowAllSkills(false); }}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold backdrop-blur-3xl transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] ${
              activeTab === 'all'
                ? 'bg-rose-400 text-black font-bold shadow-md'
                : 'bg-white/[0.04] text-white/80 hover:text-white border border-white/20 hover:bg-white/10'
            }`}
          >
            All Skills ({SKILLS_DATA.length})
          </button>

          <button
            onClick={() => { setActiveTab('languages'); setShowAllSkills(false); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-semibold backdrop-blur-3xl transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] ${
              activeTab === 'languages'
                ? 'bg-rose-400 text-black font-bold shadow-md'
                : 'bg-white/[0.04] text-white/80 hover:text-white border border-white/20 hover:bg-white/10'
            }`}
          >
            <Code2 className="h-3.5 w-3.5" /> Languages
          </button>

          <button
            onClick={() => { setActiveTab('android'); setShowAllSkills(false); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-semibold backdrop-blur-3xl transition-all shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.3)] ${
              activeTab === 'android'
                ? 'bg-rose-400 text-black font-bold shadow-md'
                : 'bg-white/[0.04] text-white/80 hover:text-white border border-white/20 hover:bg-white/10'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" /> Android & Kernel
          </button>

          <button
            onClick={() => { setActiveTab('tools'); setShowAllSkills(false); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-semibold backdrop-blur-3xl transition-all shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.3)] ${
              activeTab === 'tools'
                ? 'bg-rose-400 text-black font-bold shadow-md'
                : 'bg-white/[0.04] text-white/80 hover:text-white border border-white/20 hover:bg-white/10'
            }`}
          >
            <Wrench className="h-3.5 w-3.5" /> Build & Tools
          </button>

          <button
            onClick={() => { setActiveTab('devices'); setShowAllSkills(false); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-semibold backdrop-blur-3xl transition-all shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.3)] ${
              activeTab === 'devices'
                ? 'bg-rose-400 text-black font-bold shadow-md'
                : 'bg-white/[0.04] text-white/80 hover:text-white border border-white/20 hover:bg-white/10'
            }`}
          >
            <Cpu className="h-3.5 w-3.5" /> Hardware & Devices
          </button>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {displayedSkills.map((skill, index) => (
              <SkillCard3D key={skill.name} skill={skill} index={index} />
            ))}
          </AnimatePresence>
        </div>

        {/* Show More / Show Less Button */}
        {hasMoreSkills && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 flex justify-center"
          >
            <button
              onClick={() => setShowAllSkills(!showAllSkills)}
              className="group flex items-center gap-2 rounded-full border border-rose-400/50 bg-white/[0.05] px-6 py-3 text-xs font-bold text-rose-300 backdrop-blur-3xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.3),0_10px_25px_rgba(0,0,0,0.4)] transition-all hover:border-rose-300 hover:bg-rose-400 hover:text-black hover:scale-105"
            >
              <span>
                {showAllSkills
                  ? 'Show Less Skills'
                  : `Show All Skills (${filteredSkills.length} Total)`}
              </span>
              {showAllSkills ? (
                <ChevronUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
              ) : (
                <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              )}
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};
