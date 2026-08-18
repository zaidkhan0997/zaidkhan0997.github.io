import React from 'react';
import { Github, Send, Mail, Instagram, Linkedin } from 'lucide-react';
import { MinimalistHero } from '@/components/ui/minimalist-hero';

const MinimalistHeroDemo = () => {
  const navLinks = [
    { label: 'HOME', href: '#hero' },
    { label: 'SPECIALIZATION', href: '#skills' },
    { label: 'REPOSITORIES', href: '#projects' },
    { label: 'TERMINAL', href: '#terminal' },
    { label: 'CONTACT', href: '#contact' },
  ];

  const socialLinks = [
    { icon: Github, href: 'https://github.com/zaidkhan0997' },
    { icon: Instagram, href: 'https://www.instagram.com/zaidkhan0997' },
    { icon: Send, href: 'https://t.me/zaidkhan0997' },
    { icon: Mail, href: 'mailto:kzaid0997@gmail.com' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/zaid-khan-a74948212/' },
  ];

  return (
    <MinimalistHero
      logoText="MOHD ZAID"
      navLinks={navLinks}
      mainText="Specializing in C, C++, Linux kernel optimization, hardware separation trees, and custom Android OS maintenance for Xiaomi devices."
      readMoreLink="#skills"
      imageSrc="assets/profile.jpg"
      imageAlt="MOHD ZAID (zaidkhan0997) Android Kernel Maintainer"
      overlayText={{
        part1: 'MOHD',
        part2: 'ZAID',
      }}
      socialLinks={socialLinks}
      locationText="Himachal Pradesh, India"
      subBadge="Android Kernel & OS Developer"
      quote='"Be happy, it drives people crazy."'
    />
  );
};

export default MinimalistHeroDemo;
