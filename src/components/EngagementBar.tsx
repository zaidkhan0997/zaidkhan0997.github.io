import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Heart, FolderGit2, Users, GitBranch } from 'lucide-react';
import { fetchGitHubUser, GitHubUser } from '@/lib/github';
import { BASE_VIEWS, BASE_LIKES, fetchCloudStats, updateCloudStats } from '@/lib/statsApi';

// Reusable 3D Frosted Glass Tilt Card Wrapper for Metrics
const Glass3DCard = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window === 'undefined') return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || window.innerWidth < 768) return;
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
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      }}
      className={`frosted-glass-card rounded-3xl p-3 sm:p-4.5 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const EngagementBar = () => {
  const [hasLiked, setHasLiked] = useState(false);
  const [likes, setLikes] = useState(BASE_LIKES);
  const [views, setViews] = useState(BASE_VIEWS);
  const [userInfo, setUserInfo] = useState<GitHubUser | null>(null);

  useEffect(() => {
    // Persistent Local Like State
    const savedLiked = localStorage.getItem('portfolio_has_liked_v1') === 'true';
    setHasLiked(savedLiked);

    // Sync real-time stats from Cloud API
    fetchCloudStats().then((data) => {
      let currentViews = data.views;
      const currentLikes = data.likes;

      // Increment view count in Cloud if new visit in this session
      if (typeof window !== 'undefined' && !sessionStorage.getItem('portfolio_visited_session')) {
        sessionStorage.setItem('portfolio_visited_session', 'true');
        currentViews += 1;
        updateCloudStats({ views: currentViews, likes: currentLikes });
      }

      setViews(currentViews);
      setLikes(currentLikes);
    });

    fetchGitHubUser().then((data) => {
      if (data) setUserInfo(data);
    });

    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        if (typeof customEvent.detail.views === 'number') setViews(customEvent.detail.views);
        if (typeof customEvent.detail.likes === 'number') setLikes(customEvent.detail.likes);
        if (typeof customEvent.detail.hasLiked === 'boolean') setHasLiked(customEvent.detail.hasLiked);
      }
    };

    window.addEventListener('portfolio-cloud-stats-updated', handleSync);
    return () => window.removeEventListener('portfolio-cloud-stats-updated', handleSync);
  }, []);

  const handleLike = async () => {
    const nextState = !hasLiked;
    setHasLiked(nextState);
    localStorage.setItem('portfolio_has_liked_v1', nextState ? 'true' : 'false');

    const nextLikes = nextState ? likes + 1 : Math.max(BASE_LIKES, likes - 1);
    setLikes(nextLikes);

    const updated = await updateCloudStats({ views, likes: nextLikes });
    setLikes(updated.likes);

    window.dispatchEvent(
      new CustomEvent('portfolio-cloud-stats-updated', {
        detail: { views, likes: updated.likes, hasLiked: nextState },
      })
    );
  };

  return (
    <section className="bg-transparent py-6 sm:py-8 border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-10">
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {/* Views Card with Real-Time Global Views Count */}
          <Glass3DCard className="flex items-center gap-2 sm:gap-3 border-rose-400/30">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl border border-rose-400/40 bg-white/[0.08] text-rose-300 shadow-sm backdrop-blur-md">
              <Eye className="h-4 w-4 sm:h-5 sm:w-5 animate-pulse" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] sm:text-[10px] font-semibold tracking-wider text-rose-200/80 uppercase truncate">Total Views</p>
              <p className="text-xs sm:text-base md:text-lg font-extrabold text-rose-300 tracking-tight truncate">{views.toLocaleString()}</p>
            </div>
          </Glass3DCard>

          {/* Persistent Real-Time Global Like Card */}
          <motion.div onClick={handleLike} className="cursor-pointer">
            <Glass3DCard className={`flex items-center gap-2 sm:gap-3 ${hasLiked ? 'border-rose-400 bg-rose-500/15 text-rose-300' : 'border-rose-400/30 text-rose-300'}`}>
              <div className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl border border-rose-400/40 transition-colors backdrop-blur-md ${hasLiked ? 'bg-rose-500 text-white font-bold' : 'bg-white/[0.08] text-rose-300'}`}>
                <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${hasLiked ? 'fill-current' : ''}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] sm:text-[10px] font-semibold tracking-wider text-rose-200/80 uppercase truncate">
                  {hasLiked ? 'Liked!' : 'Click to Like'}
                </p>
                <p className="text-xs sm:text-base md:text-lg font-extrabold text-rose-300 tracking-tight truncate">
                  {likes.toLocaleString()}
                </p>
              </div>
            </Glass3DCard>
          </motion.div>

          {/* Repos Card */}
          <Glass3DCard className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl border border-white/30 bg-white/[0.08] text-rose-300 shadow-sm backdrop-blur-md">
              <FolderGit2 className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] sm:text-[10px] font-semibold tracking-wider text-white/70 uppercase truncate">Live Repos</p>
              <p className="text-xs sm:text-base md:text-lg font-extrabold text-white tracking-tight truncate">
                {userInfo ? `${userInfo.public_repos}+` : '58+'}
              </p>
            </div>
          </Glass3DCard>

          {/* Followers Card */}
          <Glass3DCard className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl border border-rose-400/40 bg-white/[0.08] text-rose-300 shadow-sm backdrop-blur-md">
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] sm:text-[10px] font-semibold tracking-wider text-white/70 uppercase truncate">Followers</p>
              <p className="text-xs sm:text-base md:text-lg font-extrabold text-white tracking-tight truncate">
                {userInfo ? userInfo.followers : '55'}
              </p>
            </div>
          </Glass3DCard>

          {/* Commits Card */}
          <Glass3DCard className="col-span-2 sm:col-span-1 flex items-center gap-2 sm:gap-3">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl border border-rose-400/40 bg-white/[0.08] text-rose-300 shadow-sm backdrop-blur-md">
              <GitBranch className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] sm:text-[10px] font-semibold tracking-wider text-white/70 uppercase truncate">Commits & Trees</p>
              <p className="text-xs sm:text-base md:text-lg font-extrabold text-white tracking-tight truncate">100+</p>
            </div>
          </Glass3DCard>
        </div>
      </div>
    </section>
  );
};
