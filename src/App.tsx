import React, { useEffect } from 'react';
import AuroraBackground from '@/components/ui/animated-background';
import MinimalistHeroDemo from '@/components/ui/demo';
import { EngagementBar } from '@/components/EngagementBar';
import { SkillsSection } from '@/components/SkillsSection';
import { ReposSection } from '@/components/ReposSection';
import { TerminalSection } from '@/components/TerminalSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { FloatingMenu } from '@/components/FloatingMenu';

export default function App() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <AuroraBackground>
      {/* 21st.dev Minimalist Hero Component integrated with MOHD ZAID's profile */}
      <MinimalistHeroDemo />

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

      {/* 3-Line Floating Menu (Desktop & Mobile) */}
      <FloatingMenu />
    </AuroraBackground>
  );
}
