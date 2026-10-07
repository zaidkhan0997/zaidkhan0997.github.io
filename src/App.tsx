import React, { useEffect, useState } from 'react';
import { InteractiveNeuralVortex } from '@/components/ui/interactive-neural-vortex-background';
import { MinimalistHero } from '@/components/ui/minimalist-hero';
import { EngagementBar } from '@/components/EngagementBar';
import { SkillsSection } from '@/components/SkillsSection';
import { ReposSection } from '@/components/ReposSection';
import { TerminalSection } from '@/components/TerminalSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { FloatingMenu } from '@/components/FloatingMenu';
import { MatrixRain } from '@/components/MatrixRain';
import { KernelPanicOverlay } from '@/components/KernelPanicOverlay';
import { HackerWorkstation3D } from '@/components/HackerWorkstation3D';
import { Instagram, Github, Send, Linkedin, Mail } from 'lucide-react';

export default function App() {
  const [showMatrix, setShowMatrix] = useState<boolean>(false);
  const [showPanic, setShowPanic] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <InteractiveNeuralVortex>
      {/* Interactive Matrix Glyph Rain Overlay */}
      <MatrixRain
        isActive={showMatrix}
        onComplete={() => setShowMatrix(false)}
      />

      {/* Kernel Panic CRT Glitch Overlay */}
      <KernelPanicOverlay
        isActive={showPanic}
        onComplete={() => setShowPanic(false)}
      />

      {/* 3D Hacker Workstation Scroll-Zoom Intro */}
      <HackerWorkstation3D />

      {/* Main Portfolio Content */}
      <div
        id="portfolio-content"
        key="portfolio-content"
        className="relative z-10 w-full transition-opacity duration-700 ease-out"
      >
        {/* 3D Glass Hero Section */}
        <MinimalistHero
          logoText="MOHD ZAID"
          navLinks={[
            { label: 'Skills', href: '#skills' },
            { label: 'Projects', href: '#projects' },
            { label: 'Terminal', href: '#terminal' },
            { label: 'Contact', href: '#contact' },
          ]}
          mainText="Android Custom ROM & Linux Kernel Developer specializing in Xiaomi devices (lisa & sweet), AOSP bringup, C/C++, and low-level system software."
          subBadge="Android Kernel & OS Developer"
          quote='"Be happy, it drives people crazy."'
          readMoreLink="#skills"
          imageSrc="/assets/profile.jpg"
          imageAlt="MOHD ZAID - zaidkhan0997"
          overlayText={{
            part1: 'MOHD',
            part2: 'ZAID',
          }}
          socialLinks={[
            { icon: Github, href: 'https://github.com/zaidkhan0997' },
            { icon: Instagram, href: 'https://www.instagram.com/zaidkhan0997' },
            { icon: Send, href: 'https://t.me/zaidkhan0997' },
            { icon: Linkedin, href: 'https://www.linkedin.com/in/zaid-khan-a74948212/' },
            { icon: Mail, href: 'mailto:kzaid0997@gmail.com' },
          ]}
          locationText="Himachal Pradesh, India"
        />

        {/* Engagement & Analytics Card Bar */}
        <EngagementBar />

        {/* Skills & Specialization Section */}
        <SkillsSection />

        {/* GitHub Repositories Showcase Section */}
        <ReposSection />

        {/* Interactive Developer CLI Terminal */}
        <TerminalSection
          onTriggerMatrix={() => setShowMatrix(true)}
          onTriggerKernelPanic={() => setShowPanic(true)}
        />

        {/* Contact & Collaboration Section */}
        <ContactSection />

        {/* Footer */}
        <Footer />

        {/* Navigation Drawer Menu */}
        <FloatingMenu />
      </div>
    </InteractiveNeuralVortex>
  );
}
