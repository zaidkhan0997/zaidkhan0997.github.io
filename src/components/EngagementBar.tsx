import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Heart, GitBranch, Users, FolderGit2 } from 'lucide-react';
import { fetchGitHubUser, GitHubUser } from '@/lib/github';

// Reusable Ultra-Translucent 3D Glass Tilt Wrapper
const Glass3DCard = ({ children, className = '', ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) => {
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
      whileHover={{ scale: 1.04 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      }}
      className={`rounded-3xl border border-white/20 bg-white/[0.04] p-4 backdrop-blur-3xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.25),0_12px_32px_rgba(0,0,0,0.35)] hover:border-cyan-300/80 hover:bg-white/[0.1] hover:shadow-[0_0_35px_rgba(6,182,212,0.4)] transition-all ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const EngagementBar = () => {
  const [likes, setLikes] = useState(1518437);
  const [hasLiked, setHasLiked] = useState(false);
  const [userInfo, setUserInfo] = useState<GitHubUser | null>(null);

  useEffect(() => {
    fetchGitHubUser().then((data) => {
      if (data) setUserInfo(data);
    });
  }, []);

  const handleLike = () => {
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    } else {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  return (
    <section className="bg-transparent py-8 border-b border-white/10">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {/* Views Card */}
          <Glass3DCard className="flex items-center gap-3 border-cyan-400/30">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/40 bg-white/[0.08] text-cyan-300 shadow-sm backdrop-blur-md">
              <Eye className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-wider text-cyan-200/80 uppercase">Total Views</p>
              <p className="text-base sm:text-lg font-extrabold text-cyan-300">1,753,123</p>
            </div>
          </Glass3DCard>

          {/* Interactive Like Card */}
          <motion.div onClick={handleLike} className="cursor-pointer">
            <Glass3DCard className={`flex items-center gap-3 ${hasLiked ? 'border-pink-400 bg-pink-500/15 text-pink-300' : 'border-pink-400/30 text-pink-300'}`}>
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-pink-400/40 transition-colors backdrop-blur-md ${hasLiked ? 'bg-pink-500 text-white' : 'bg-white/[0.08] text-pink-300'}`}>
                <Heart className={`h-5 w-5 ${hasLiked ? 'fill-current' : ''}`} />
              </div>
              <div>
                <p className="text-[10px] font-semibold tracking-wider text-pink-200/80 uppercase">
                  {hasLiked ? 'Liked!' : 'Click to Like'}
                </p>
                <p className="text-base sm:text-lg font-extrabold text-pink-300">
                  {likes.toLocaleString()}
                </p>
              </div>
            </Glass3DCard>
          </motion.div>

          {/* Repos Card */}
          <Glass3DCard className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/30 bg-white/[0.08] text-cyan-300 shadow-sm backdrop-blur-md">
              <FolderGit2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-wider text-white/70 uppercase">Live Repos</p>
              <p className="text-base sm:text-lg font-extrabold text-white">
                {userInfo ? `${userInfo.public_repos}+` : '58+'}
              </p>
            </div>
          </Glass3DCard>

          {/* Followers Card */}
          <Glass3DCard className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/40 bg-white/[0.08] text-emerald-300 shadow-sm backdrop-blur-md">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-wider text-white/70 uppercase">Followers</p>
              <p className="text-base sm:text-lg font-extrabold text-white">
                {userInfo ? userInfo.followers : '55'}
              </p>
            </div>
          </Glass3DCard>

          {/* Commits Card */}
          <Glass3DCard className="col-span-2 sm:col-span-1 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-purple-400/40 bg-white/[0.08] text-purple-300 shadow-sm backdrop-blur-md">
              <GitBranch className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-wider text-white/70 uppercase">Commits & Trees</p>
              <p className="text-base sm:text-lg font-extrabold text-white">100+</p>
            </div>
          </Glass3DCard>
        </div>
      </div>
    </section>
  );
};
