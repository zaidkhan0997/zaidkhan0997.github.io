import React, { useEffect } from 'react';
import AuroraBackground from '@/components/ui/animated-background';
import { MinimalistHero } from '@/components/ui/minimalist-hero';
import { EngagementBar } from '@/components/EngagementBar';
import { SkillsSection } from '@/components/SkillsSection';
import { ReposSection } from '@/components/ReposSection';
import { TerminalSection } from '@/components/TerminalSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { FloatingMenu } from '@/components/FloatingMenu';
import { Instagram, Github, Send, Linkedin, Mail } from 'lucide-react';

export default function App() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <AuroraBackground>
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
      <TerminalSection />

      {/* Contact & Collaboration Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />

      {/* Navigation Drawer Menu */}
      <FloatingMenu />
    </AuroraBackground>
  );
}
