import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Smartphone, Wrench, Cpu, CheckCircle2 } from 'lucide-react';

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

export const SkillsSection = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'languages' | 'android' | 'tools' | 'devices'>('all');

  const filteredSkills = activeTab === 'all' 
    ? SKILLS_DATA 
    : SKILLS_DATA.filter((s) => s.category === activeTab);

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
          <span className="inline-block rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
            TECHNICAL MASTERY
          </span>
          <h2 className="text-3xl font-extrabold md:text-5xl tracking-tight text-white">
            Specialization & Skills
          </h2>
          <p className="text-sm text-white/60 max-w-2xl mx-auto">
            Extracted directly from @zaidkhan0997&apos;s GitHub repositories, device trees, and Android kernel commits.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-12"
        >
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold backdrop-blur-md transition-all ${
              activeTab === 'all'
                ? 'bg-cyan-500 text-black shadow-md font-bold'
                : 'bg-black/40 text-white/70 hover:text-white border border-white/10'
            }`}
          >
            All Skills ({SKILLS_DATA.length})
          </button>

          <button
            onClick={() => setActiveTab('languages')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold backdrop-blur-md transition-all ${
              activeTab === 'languages'
                ? 'bg-cyan-500 text-black shadow-md font-bold'
                : 'bg-black/40 text-white/70 hover:text-white border border-white/10'
            }`}
          >
            <Code2 className="h-3.5 w-3.5" /> Languages
          </button>

          <button
            onClick={() => setActiveTab('android')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold backdrop-blur-md transition-all ${
              activeTab === 'android'
                ? 'bg-cyan-500 text-black shadow-md font-bold'
                : 'bg-black/40 text-white/70 hover:text-white border border-white/10'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" /> Android & Kernel
          </button>

          <button
            onClick={() => setActiveTab('tools')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold backdrop-blur-md transition-all ${
              activeTab === 'tools'
                ? 'bg-cyan-500 text-black shadow-md font-bold'
                : 'bg-black/40 text-white/70 hover:text-white border border-white/10'
            }`}
          >
            <Wrench className="h-3.5 w-3.5" /> Build & Tools
          </button>

          <button
            onClick={() => setActiveTab('devices')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold backdrop-blur-md transition-all ${
              activeTab === 'devices'
                ? 'bg-cyan-500 text-black shadow-md font-bold'
                : 'bg-black/40 text-white/70 hover:text-white border border-white/10'
            }`}
          >
            <Cpu className="h-3.5 w-3.5" /> Hardware & Devices
          </button>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.4, delay: (index % 3) * 0.1 }}
              className="group rounded-2xl border border-white/10 bg-black/40 p-6 shadow-sm backdrop-blur-md hover:border-cyan-500/50 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4.5 w-4.5 text-cyan-400" />
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {skill.name}
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400">
                  {skill.level}%
                </span>
              </div>

              <p className="text-xs text-white/60 mb-4 min-h-[32px] leading-relaxed">
                {skill.desc}
              </p>

              {/* Progress bar with Aurora Gradient */}
              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
