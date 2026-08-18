import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Heart, GitBranch, Users, FolderGit2 } from 'lucide-react';
import { fetchGitHubUser, GitHubUser } from '@/lib/github';

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
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3.5 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4 shadow-sm backdrop-blur-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
              <Eye className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-wider text-cyan-200/70 uppercase">Total Views</p>
              <p className="text-lg font-bold text-cyan-400">1,753,123</p>
            </div>
          </motion.div>

          {/* Interactive Like Card */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLike}
            className={`flex items-center gap-3.5 rounded-2xl border p-4 text-left shadow-sm backdrop-blur-md transition-all ${
              hasLiked
                ? 'border-pink-500 bg-pink-500/20 text-pink-400'
                : 'border-pink-500/30 bg-pink-500/10 text-pink-400 hover:border-pink-500/50'
            }`}
          >
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${hasLiked ? 'bg-pink-500 text-white' : 'bg-pink-500/20 text-pink-400'}`}>
              <Heart className={`h-5 w-5 ${hasLiked ? 'fill-current' : ''}`} />
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-wider text-pink-200/70 uppercase">
                {hasLiked ? 'Liked!' : 'Click to Like'}
              </p>
              <p className="text-lg font-bold text-pink-400">
                {likes.toLocaleString()}
              </p>
            </div>
          </motion.button>

          {/* Repos Card - Live from GitHub */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3.5 rounded-2xl border border-white/10 bg-black/40 p-4 shadow-sm backdrop-blur-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
              <FolderGit2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-wider text-white/60 uppercase">Live Repos</p>
              <p className="text-lg font-bold text-white">
                {userInfo ? `${userInfo.public_repos}+` : '58+'}
              </p>
            </div>
          </motion.div>

          {/* Followers Card - Live from GitHub */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3.5 rounded-2xl border border-white/10 bg-black/40 p-4 shadow-sm backdrop-blur-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-wider text-white/60 uppercase">Followers</p>
              <p className="text-lg font-bold text-white">
                {userInfo ? userInfo.followers : '55'}
              </p>
            </div>
          </motion.div>

          {/* Commits Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="col-span-2 sm:col-span-1 flex items-center gap-3.5 rounded-2xl border border-white/10 bg-black/40 p-4 shadow-sm backdrop-blur-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <GitBranch className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-wider text-white/60 uppercase">Commits & Trees</p>
              <p className="text-lg font-bold text-white">100+</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
