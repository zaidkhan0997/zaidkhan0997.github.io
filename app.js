/* -------------------------------------------------------------
   MOHD ZAID ( zaidkhan0997 ) - PORTFOLIO INTERACTIVITY & LIVE API
   ------------------------------------------------------------- */

// Global State & Data Cache
const GITHUB_USERNAME = 'zaidkhan0997';
const DISPLAY_NAME = 'MOHD ZAID';
const INITIAL_REPO_LIMIT = 6;

let allRepositories = [];
let currentCategory = 'all';
let showAllRepos = false;

// Pre-baked Fallback Repositories for instant rendering
const FALLBACK_REPOS = [
  {
    name: "device_xiaomi_lisa",
    description: "Android Device Tree For Xiaomi 11 Lite NE 5G (lisa). Optimized for custom ROM compilation.",
    language: "C++",
    stargazers_count: 1,
    forks_count: 0,
    category: "android",
    html_url: "https://github.com/zaidkhan0997/device_xiaomi_lisa"
  },
  {
    name: "kernel_xiaomi_lisa",
    description: "Linux Kernel Tree For Xiaomi 11 Lite NE 5G with custom performance tweaks & memory management.",
    language: "C",
    stargazers_count: 1,
    forks_count: 0,
    category: "android",
    html_url: "https://github.com/zaidkhan0997/kernel_xiaomi_lisa"
  },
  {
    name: "android_kernel_xiaomi_sweet",
    description: "Linux Kernel Source Code For Redmi Note 10 Pro / Pro Max (sweet/sweetin).",
    language: "C",
    stargazers_count: 0,
    forks_count: 0,
    category: "android",
    html_url: "https://github.com/zaidkhan0997/android_kernel_xiaomi_sweet"
  },
  {
    name: "device_xiaomi_sweet",
    description: "Android Device Tree For Redmi Note 10 Pro / Pro Max (sweet).",
    language: "Makefile",
    stargazers_count: 1,
    forks_count: 0,
    category: "android",
    html_url: "https://github.com/zaidkhan0997/device_xiaomi_sweet"
  },
  {
    name: "KernelSU",
    description: "Imported KernelSU kernel-level root interface and security patch drivers.",
    language: "C",
    stargazers_count: 0,
    forks_count: 0,
    category: "android",
    html_url: "https://github.com/zaidkhan0997/KernelSU"
  },
  {
    name: "vendor_GoogleCameraSweet",
    description: "Stable Google Camera Mod & HDR processing config vendor tree for Redmi Note 10 Pro.",
    language: "Makefile",
    stargazers_count: 0,
    forks_count: 0,
    category: "android",
    html_url: "https://github.com/zaidkhan0997/vendor_GoogleCameraSweet"
  },
  {
    name: "GoFile-Upload",
    description: "A Simple Script to upload Files to gofile.io via Terminal (CLI). Written in Bash.",
    language: "Shell",
    stargazers_count: 0,
    forks_count: 0,
    category: "shell",
    html_url: "https://github.com/zaidkhan0997/GoFile-Upload"
  },
  {
    name: "AnyKernel3",
    description: "Evolved Android Flashable Zip Template for Kernels.",
    language: "Shell",
    stargazers_count: 0,
    forks_count: 0,
    category: "shell",
    html_url: "https://github.com/zaidkhan0997/AnyKernel3"
  },
  {
    name: "OTA",
    description: "Over-The-Air Update Payload Delivery Configuration & Verification Engine.",
    language: "JSON",
    stargazers_count: 0,
    forks_count: 0,
    category: "shell",
    html_url: "https://github.com/zaidkhan0997/OTA"
  },
  {
    name: "zaidkhan0997.github.io",
    description: "Personal Portfolio & Developer Showcase Website hosted on GitHub Pages.",
    language: "HTML",
    stargazers_count: 0,
    forks_count: 0,
    category: "web",
    html_url: "https://github.com/zaidkhan0997/zaidkhan0997.github.io"
  },
  {
    name: "thedev.id",
    description: "Developer identity verification page & open-source domain binding.",
    language: "HTML",
    stargazers_count: 0,
    forks_count: 0,
    category: "web",
    html_url: "https://github.com/zaidkhan0997/thedev.id"
  },
  {
    name: "MyScripts",
    description: "Automated Build Scripts for Android Kernel Drivers, Driver Imports & CI Pipeline.",
    language: "Shell",
    stargazers_count: 0,
    forks_count: 0,
    category: "shell",
    html_url: "https://github.com/zaidkhan0997/MyScripts"
  }
];

// Language Color Mapping
const LANG_COLORS = {
  'C': '#555555',
  'C++': '#f34b7d',
  'Shell': '#89e051',
  'Makefile': '#427819',
  'Python': '#3572A5',
  'Java': '#b07219',
  'HTML': '#e34c26',
  'JavaScript': '#f1e05a',
  'Assembly': '#6E4C13'
};

// Extracted Skills Data from @zaidkhan0997 GitHub profile
const SKILLS_DATA = [
  {
    title: "Makefile Automation",
    category: "languages",
    icon: "fa-solid fa-gears",
    badge: "20 Repositories",
    desc: "Writing AOSP build rules, device tree makefiles, proprietary vendor config recipes, and target setups.",
    tags: ["AOSP Build", "Makefile", "Vendor Rules", "Target Setup"]
  },
  {
    title: "C++ System Code",
    category: "languages",
    icon: "fa-solid fa-code",
    badge: "9 Repositories",
    desc: "Low-level system code, Android Hardware Abstraction Layer (HAL) modules, and framework patches.",
    tags: ["C++17", "HAL Modules", "Bionic", "System Daemons"]
  },
  {
    title: "C & Linux Kernel",
    category: "languages",
    icon: "fa-solid fa-microchip",
    badge: "4 Repositories",
    desc: "Linux kernel customization, memory management tweaks, driver integration, and KernelSU hooks.",
    tags: ["C", "Linux Kernel", "KernelSU", "Qualcomm SM8350"]
  },
  {
    title: "Shell & Bash Scripting",
    category: "languages",
    icon: "fa-solid fa-terminal",
    badge: "2 Repositories",
    desc: "Automated driver importer tools, AnyKernel3 zip creation scripts, GoFile CLI uploaders, and CI pipelines.",
    tags: ["Bash", "Shell", "CLI Tools", "AnyKernel3"]
  },
  {
    title: "Java",
    category: "languages",
    icon: "fa-brands fa-java",
    badge: "2 Repositories",
    desc: "Dirac audio system integration, device settings apps, and custom ROM framework extensions.",
    tags: ["Java", "Dirac Audio", "Android Framework"]
  },
  {
    title: "Python",
    category: "languages",
    icon: "fa-brands fa-python",
    badge: "1 Repository",
    desc: "SELinux Policy (sepolicy) analysis scripts, automated parsing tools, and repo maintenance utilities.",
    tags: ["Python 3", "SELinux", "Sepolicy", "Automation"]
  },
  {
    title: "Assembly (ASM)",
    category: "languages",
    icon: "fa-solid fa-layer-group",
    badge: "1 Repository",
    desc: "Low-level architecture assembly primitives for Android bionic library optimization.",
    tags: ["ARM64", "Assembly", "Bionic", "Performance"]
  },
  {
    title: "Linux Kernel Engineering",
    category: "android",
    icon: "fa-brands fa-linux",
    badge: "Specialist",
    desc: "Building and optimizing custom Linux kernels for Qualcomm Snapdragon platforms with memory tweaks.",
    tags: ["Kernel Trees", "Snapdragon", "SM8350", "SM6150"]
  },
  {
    title: "KernelSU Integration",
    category: "android",
    icon: "fa-solid fa-shield-halved",
    badge: "Security",
    desc: "Kernel-level root permission control system integration directly inside custom kernel trees.",
    tags: ["KernelSU", "Root Control", "Security Hooks"]
  },
  {
    title: "SELinux & Sepolicy",
    category: "android",
    icon: "fa-solid fa-lock",
    badge: "Security",
    desc: "Configuring security policies, context rules, and system permission enforcement for Android ROM builds.",
    tags: ["Sepolicy", "SELinux", "Context Rules"]
  },
  {
    title: "AnyKernel3 Flashable Zips",
    category: "tools",
    icon: "fa-solid fa-file-zipper",
    badge: "Deployment",
    desc: "Creating flashable zip installer templates for custom kernel deployments across Xiaomi devices.",
    tags: ["AnyKernel3", "TWRP", "Recovery Zips"]
  },
  {
    title: "GoFile CLI Uploader",
    category: "tools",
    icon: "fa-solid fa-cloud-arrow-up",
    badge: "CLI Tool",
    desc: "Command-line terminal script to upload files and build logs directly to GoFile storage.",
    tags: ["GoFile", "CLI Script", "Upload Engine"]
  },
  {
    title: "Git & Submodules",
    category: "tools",
    icon: "fa-brands fa-git-alt",
    badge: "Version Control",
    desc: "Managing complex multi-repo Android manifests, upstream driver patches, and repo sync operations.",
    tags: ["Git", "GitHub", "Submodules", "Manifest"]
  },
  {
    title: "Xiaomi 11 Lite NE 5G (lisa)",
    category: "devices",
    icon: "fa-solid fa-mobile-button",
    badge: "Device Tree",
    desc: "Maintaining complete device, kernel (`kernel_xiaomi_lisa`), and proprietary vendor trees for Xiaomi lisa.",
    tags: ["lisa", "Snapdragon 778G", "Device Tree"]
  },
  {
    title: "Redmi Note 10 Pro / Max (sweet)",
    category: "devices",
    icon: "fa-solid fa-mobile-screen",
    badge: "Device Tree",
    desc: "Custom kernel (`android_kernel_xiaomi_sweet`), vendor trees, and GCam config mods for Redmi sweet.",
    tags: ["sweet", "Snapdragon 732G", "GCam Mod"]
  }
];

let currentSkillTab = 'all';
const INITIAL_SKILLS_LIMIT = 4;
let showAllSkills = false;

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  setupNavbar();
  setupFilterControls();
  setupSearch();
  setupTerminal();
  setupContactForm();
  setupScrollAnimations();
  
  // Initialize Likes & Views counters (> 1M start, views first)
  initPortfolioMetrics();

  // Render Skills tab initial view
  renderSkills(currentSkillTab);

  // Render fallback repos first for speed
  allRepositories = [...FALLBACK_REPOS];
  renderRepositories(filterRepos(currentCategory, getSearchQuery()));
  
  // Fetch live profile & repos from GitHub API
  fetchGitHubData();
});

// Scroll Reveal & Intersection Observer Engine
function setupScrollAnimations() {
  if (!('IntersectionObserver' in window)) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      } else {
        entry.target.classList.remove('revealed');
      }
    });
  }, observerOptions);

  function observeElements() {
    const targets = [
      { sel: '.section-header', type: 'scroll-reveal' },
      { sel: '.hero-content', type: 'scroll-reveal-left' },
      { sel: '.hero-avatar-wrapper', type: 'scroll-reveal-right' },
      { sel: '.stat-card', type: 'scroll-reveal' },
      { sel: '.skill-card', type: 'scroll-reveal' },
      { sel: '.repo-card', type: 'scroll-reveal' },
      { sel: '.terminal-wrapper', type: 'scroll-reveal' },
      { sel: '.contact-info-card', type: 'scroll-reveal-left' },
      { sel: '.contact-form', type: 'scroll-reveal-right' },
      { sel: '.skills-tabs-container', type: 'scroll-reveal' },
      { sel: '.filter-bar', type: 'scroll-reveal' }
    ];

    targets.forEach(({ sel, type }) => {
      document.querySelectorAll(sel).forEach((el, idx) => {
        if (!el.classList.contains('reveal-bound')) {
          el.classList.add('reveal-bound', type);
          if (sel === '.skill-card' || sel === '.repo-card' || sel === '.stat-card') {
            el.style.transitionDelay = `${(idx % 6) * 0.08}s`;
          }
          observer.observe(el);
        }
      });
    });
  }

  // Initial binding
  observeElements();

  // Watch for dynamic DOM updates (skills / repo cards)
  const skillsGrid = document.getElementById('skills-grid');
  const reposGrid = document.getElementById('repos-grid');
  const mutObserver = new MutationObserver(() => observeElements());

  if (skillsGrid) mutObserver.observe(skillsGrid, { childList: true });
  if (reposGrid) mutObserver.observe(reposGrid, { childList: true });

  // Floating Menu Inner Scroll Animations & Header Shadow Trigger
  const drawerBody = document.querySelector('.drawer-body');
  const drawerHeader = document.querySelector('.drawer-header');

  if (drawerBody) {
    // Header shadow on drawer scroll
    drawerBody.addEventListener('scroll', () => {
      if (drawerHeader) {
        if (drawerBody.scrollTop > 12) {
          drawerHeader.classList.add('scrolled');
        } else {
          drawerHeader.classList.remove('scrolled');
        }
      }
    });

    // Drawer internal item scroll observer (reverse scroll up & down animations inside floating menu)
    const drawerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('drawer-revealed');
        } else {
          entry.target.classList.remove('drawer-revealed');
        }
      });
    }, {
      root: drawerBody,
      rootMargin: '0px 0px -10px 0px',
      threshold: 0.05
    });

    document.querySelectorAll('.drawer-section-title, .drawer-nav-item, .drawer-chip, .drawer-contact-item, .drawer-lang-tag').forEach(item => {
      item.classList.add('drawer-scroll-item');
      drawerObserver.observe(item);
    });
  }
}

// Render Skills grid based on active tab (with 4 skills initial limit)
function renderSkills(category) {
  const grid = document.getElementById('skills-grid');
  const loadMoreSkillsContainer = document.getElementById('load-more-skills-container');
  const exploreSkillsBtn = document.getElementById('explore-more-skills-btn');

  if (!grid) return;

  const filteredSkills = category === 'all' 
    ? SKILLS_DATA 
    : SKILLS_DATA.filter(s => s.category === category);

  let visibleSkills = filteredSkills;
  const remainingSkills = filteredSkills.length - INITIAL_SKILLS_LIMIT;

  if (!showAllSkills && filteredSkills.length > INITIAL_SKILLS_LIMIT) {
    visibleSkills = filteredSkills.slice(0, INITIAL_SKILLS_LIMIT);
    if (loadMoreSkillsContainer) loadMoreSkillsContainer.style.display = 'flex';
    if (exploreSkillsBtn) {
      exploreSkillsBtn.innerHTML = `<i class="fa-solid fa-layer-group"></i> Expand for More Skills (${remainingSkills})`;
    }
  } else if (showAllSkills && filteredSkills.length > INITIAL_SKILLS_LIMIT) {
    if (loadMoreSkillsContainer) loadMoreSkillsContainer.style.display = 'flex';
    if (exploreSkillsBtn) {
      exploreSkillsBtn.innerHTML = `<i class="fa-solid fa-chevron-up"></i> Show Less Skills`;
    }
  } else {
    if (loadMoreSkillsContainer) loadMoreSkillsContainer.style.display = 'none';
  }

  grid.innerHTML = visibleSkills.map(skill => `
    <div class="skill-card">
      <div>
        <div class="skill-card-top">
          <div class="skill-icon">
            <i class="${skill.icon}"></i>
          </div>
          <span class="skill-level-badge">${skill.badge}</span>
        </div>
        <h3 class="skill-title">${escapeHTML(skill.title)}</h3>
        <p class="skill-desc">${escapeHTML(skill.desc)}</p>
      </div>
      <div class="skill-tags">
        ${skill.tags.map(t => `<span class="tag">${escapeHTML(t)}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

// Toggle Expand for More Skills
function toggleExploreMoreSkills() {
  showAllSkills = !showAllSkills;
  renderSkills(currentSkillTab);
}

// Switch Skill Tab
function switchSkillTab(category, btnElement) {
  currentSkillTab = category;
  showAllSkills = false; // Reset skills expand state on tab change
  const tabBtns = document.querySelectorAll('.skill-tab-btn');
  tabBtns.forEach(b => b.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');
  renderSkills(category);
}

// Navbar scroll & smooth scroll with Scroll Direction Detection (for reverse scroll animations)
function setupNavbar() {
  const navbar = document.querySelector('.navbar');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    if (currentScrollY > lastScrollY && currentScrollY > 80) {
      document.body.classList.add('scrolling-down');
      document.body.classList.remove('scrolling-up');
    } else if (currentScrollY < lastScrollY) {
      document.body.classList.add('scrolling-up');
      document.body.classList.remove('scrolling-down');
    }

    lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
  }, { passive: true });
}

// Fetch GitHub Profile and Repositories
async function fetchGitHubData() {
  try {
    const profileRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
    if (profileRes.ok) {
      const profile = await profileRes.json();
      updateProfileUI(profile);
    }
    
    const reposRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
    if (reposRes.ok) {
      const repos = await reposRes.json();
      if (Array.isArray(repos) && repos.length > 0) {
        allRepositories = repos.map(r => ({
          name: r.name,
          description: r.description || 'No description provided.',
          language: r.language || 'Code',
          stargazers_count: r.stargazers_count,
          forks_count: r.forks_count,
          category: categorizeRepo(r.name, r.language),
          html_url: r.html_url
        }));
        
        renderRepositories(filterRepos(currentCategory, getSearchQuery()));
        showToast(`Loaded ${repos.length} live repositories from GitHub!`);
      }
    }
  } catch (err) {
    console.warn('GitHub API fetch fallback:', err);
  }
}

// Categorize repo based on name & language
function categorizeRepo(name, lang) {
  const lower = name.toLowerCase();
  if (lower.includes('device') || lower.includes('kernel') || lower.includes('vendor') || lower.includes('hardware') || lower.includes('android') || lower.includes('sepolicy') || lower.includes('bionic')) {
    return 'android';
  }
  if (lang === 'C' || lang === 'C++' || lang === 'Assembly') {
    return 'cpp';
  }
  if (lang === 'Shell' || lang === 'Makefile' || lower.includes('script')) {
    return 'shell';
  }
  if (lang === 'HTML' || lang === 'JavaScript' || lang === 'CSS') {
    return 'web';
  }
  return 'other';
}

// Update Profile UI elements
function updateProfileUI(profile) {
  const statRepos = document.getElementById('stat-repos');
  const statFollowers = document.getElementById('stat-followers');
  const statFollowing = document.getElementById('stat-following');
  const bioQuote = document.getElementById('hero-bio');
  const userNameEl = document.getElementById('user-name');
  const userHandleEl = document.getElementById('user-handle');

  if (statRepos) statRepos.textContent = profile.public_repos + '+';
  if (statFollowers) statFollowers.textContent = profile.followers;
  if (statFollowing) statFollowing.textContent = profile.following;
  if (bioQuote && profile.bio) bioQuote.textContent = `"${profile.bio}"`;
  if (userNameEl) userNameEl.textContent = DISPLAY_NAME;
  if (userHandleEl) userHandleEl.textContent = `( ${GITHUB_USERNAME} )`;
}

// Setup Filter Buttons
function setupFilterControls() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter');
      showAllRepos = false; // Reset pagination when switching filter
      renderRepositories(filterRepos(currentCategory, getSearchQuery()));
    });
  });
}

// Setup Search Input
function setupSearch() {
  const searchInput = document.getElementById('repo-search');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      showAllRepos = false; // Reset pagination on search input
      renderRepositories(filterRepos(currentCategory, getSearchQuery()));
    });
  }
}

function getSearchQuery() {
  const searchInput = document.getElementById('repo-search');
  return searchInput ? searchInput.value.trim().toLowerCase() : '';
}

// Filter repos by category and query
function filterRepos(category, query) {
  return allRepositories.filter(repo => {
    const matchesCategory = (category === 'all') || (repo.category === category);
    const matchesSearch = !query || 
      repo.name.toLowerCase().includes(query) || 
      (repo.description && repo.description.toLowerCase().includes(query)) ||
      (repo.language && repo.language.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });
}

// Render Repositories to Grid (with 6 repos initial limit)
function renderRepositories(repos) {
  const grid = document.getElementById('repos-grid');
  const loadMoreContainer = document.getElementById('load-more-container');
  const exploreBtn = document.getElementById('explore-more-btn');

  if (!grid) return;
  
  if (repos.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
        <i class="fa-solid fa-code-compare" style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--accent-cyan);"></i>
        <h3>No matching repositories found</h3>
        <p>Try searching for another term or changing the filter category.</p>
      </div>
    `;
    if (loadMoreContainer) loadMoreContainer.style.display = 'none';
    return;
  }

  // Handle Pagination / Limit (Show only 6 repos initially)
  let visibleRepos = repos;
  const remainingCount = repos.length - INITIAL_REPO_LIMIT;

  if (!showAllRepos && repos.length > INITIAL_REPO_LIMIT) {
    visibleRepos = repos.slice(0, INITIAL_REPO_LIMIT);
    if (loadMoreContainer) loadMoreContainer.style.display = 'flex';
    if (exploreBtn) {
      exploreBtn.innerHTML = `<i class="fa-solid fa-layer-group"></i> Explore More Repositories (${remainingCount})`;
    }
  } else if (showAllRepos && repos.length > INITIAL_REPO_LIMIT) {
    if (loadMoreContainer) loadMoreContainer.style.display = 'flex';
    if (exploreBtn) {
      exploreBtn.innerHTML = `<i class="fa-solid fa-chevron-up"></i> Show Less Repositories`;
    }
  } else {
    if (loadMoreContainer) loadMoreContainer.style.display = 'none';
  }
  
  grid.innerHTML = visibleRepos.map(repo => {
    const langColor = LANG_COLORS[repo.language] || '#6366f1';
    return `
      <div class="repo-card" onclick="openRepoModal('${repo.name}')">
        <div class="repo-header">
          <div class="repo-title-wrapper">
            <i class="fa-regular fa-folder repo-icon"></i>
            <span class="repo-name">${escapeHTML(repo.name)}</span>
          </div>
          <span class="repo-badge">${repo.category.toUpperCase()}</span>
        </div>
        
        <p class="repo-desc">${escapeHTML(repo.description)}</p>
        
        <div class="repo-footer">
          <div class="repo-meta">
            <span class="meta-item">
              <span class="lang-dot" style="background: ${langColor}"></span>
              ${escapeHTML(repo.language)}
            </span>
            <span class="meta-item">
              <i class="fa-regular fa-star"></i> ${repo.stargazers_count}
            </span>
            <span class="meta-item">
              <i class="fa-solid fa-code-fork"></i> ${repo.forks_count}
            </span>
          </div>
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();" title="Open on GitHub">
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
        </div>
      </div>
    `;
  }).join('');
}

// Toggle Explore More Repositories
function toggleExploreMore() {
  showAllRepos = !showAllRepos;
  renderRepositories(filterRepos(currentCategory, getSearchQuery()));
}

// Open Detail Modal
function openRepoModal(repoName) {
  const repo = allRepositories.find(r => r.name === repoName);
  if (!repo) return;
  
  const modalBackdrop = document.getElementById('repo-modal');
  const modalContent = document.getElementById('modal-body');
  
  if (modalBackdrop && modalContent) {
    modalContent.innerHTML = `
      <h3 class="modal-title"><i class="fa-regular fa-folder"></i> ${escapeHTML(repo.name)}</h3>
      <p class="modal-desc">${escapeHTML(repo.description)}</p>
      
      <div style="margin-bottom: 1rem; display: flex; gap: 1rem; font-size: 0.9rem; color: var(--text-muted);">
        <span><strong>Language:</strong> ${repo.language}</span>
        <span><strong>Stars:</strong> ${repo.stargazers_count}</span>
        <span><strong>Category:</strong> ${repo.category.toUpperCase()}</span>
      </div>

      <div class="modal-code-block">
        git clone ${repo.html_url}.git
      </div>

      <div style="display: flex; gap: 1rem;">
        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="flex: 1;">
          <i class="fa-brands fa-github"></i> View Repository
        </a>
        <button class="btn btn-secondary" onclick="copyCloneCommand('${repo.html_url}.git')">
          <i class="fa-regular fa-copy"></i> Copy Clone Command
        </button>
      </div>
    `;
    modalBackdrop.classList.add('active');
  }
}

function closeModal() {
  const modalBackdrop = document.getElementById('repo-modal');
  if (modalBackdrop) modalBackdrop.classList.remove('active');
}

function copyCloneCommand(url) {
  navigator.clipboard.writeText(`git clone ${url}`).then(() => {
    showToast('Clone command copied to clipboard!');
  });
}

// Terminal Emulator Logic
function setupTerminal() {
  const termInput = document.getElementById('terminal-input');
  const termBody = document.getElementById('terminal-body');
  
  if (!termInput || !termBody) return;
  
  termInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const command = termInput.value.trim();
      termInput.value = '';
      executeTerminalCommand(command, termBody);
    }
  });
}

function executeTerminalCommand(cmd, body) {
  const inputLine = document.createElement('div');
  inputLine.className = 'terminal-line';
  inputLine.innerHTML = `<span class="term-prompt">mohdzaid@device-tree:~$</span> <span style="color: #fff;">${escapeHTML(cmd)}</span>`;
  body.appendChild(inputLine);
  
  const outputLine = document.createElement('div');
  outputLine.className = 'terminal-line term-output';
  
  const lower = cmd.toLowerCase().trim();
  
  if (lower === 'help') {
    outputLine.innerHTML = `Available commands:<br>
    - <span style="color: var(--accent-cyan);">whoami</span> : Print bio and developer summary<br>
    - <span style="color: var(--accent-cyan);">php</span> : Run PHP status and environment check<br>
    - <span style="color: var(--accent-cyan);">list --repos</span> : List featured Android device & kernel repos<br>
    - <span style="color: var(--accent-cyan);">fetch --stats</span> : Print live GitHub metrics<br>
    - <span style="color: var(--accent-cyan);">contact</span> : Display contact details & location<br>
    - <span style="color: var(--accent-cyan);">clear</span> : Clear terminal output`;
  } else if (lower === 'whoami') {
    outputLine.innerHTML = `<strong>MOHD ZAID</strong> ( zaidkhan0997 )<br>
    Android ROM & Kernel Developer | C/C++ & Linux System Engineer<br>
    Location: Himachal Pradesh, India<br>
    Bio: <em>"Be happy, it drives people crazy."</em>`;
  } else if (lower === 'php' || lower === 'php -v' || lower === 'php --version') {
    fetch('api.php?action=info')
      .then(res => res.json())
      .then(data => {
        outputLine.innerHTML = `<span style="color: #8892bf; font-weight: bold;">PHP Backend Engine Online</span><br>
        Version: <span style="color: var(--accent-emerald);">${data.php_version || 'PHP 8.3'}</span><br>
        Server: ${data.server_software || 'PHP Built-in CLI Server'}<br>
        Time: ${data.server_time || new Date().toLocaleString()}<br>
        Total Portfolio Views: ${data.total_views || '1,453,122'}<br>
        Total Portfolio Likes: ${data.total_likes || '1,168,437'}`;
      })
      .catch(() => {
        outputLine.innerHTML = `PHP 8.3 CLI Server Active (Native Execution)`;
      });
  } else if (lower === 'list --repos' || lower === 'repos' || lower === 'ls') {
    outputLine.innerHTML = `Featured Trees & Kernels:<br>
    [1] device_xiaomi_lisa (Xiaomi 11 Lite NE 5G)<br>
    [2] kernel_xiaomi_lisa (Xiaomi 11 Lite NE 5G Kernel)<br>
    [3] android_kernel_xiaomi_sweet (Redmi Note 10 Pro/Max)<br>
    [4] KernelSU (Kernel-level Root Interface)<br>
    [5] vendor_GoogleCameraSweet (GCam Mod Config)`;
  } else if (lower === 'fetch --stats' || lower === 'neofetch') {
    outputLine.innerHTML = `<span style="color: var(--primary-indigo);">OS:</span> Custom Android & Linux Kernel<br>
    <span style="color: var(--primary-indigo);">Backend:</span> PHP Engine Active<br>
    <span style="color: var(--primary-indigo);">Host:</span> Redmi Note 10 Pro / Xiaomi 11 Lite NE<br>
    <span style="color: var(--primary-indigo);">Public Repos:</span> 58<br>
    <span style="color: var(--primary-indigo);">Followers:</span> 55<br>
    <span style="color: var(--primary-indigo);">Primary Languages:</span> C, C++, PHP, Shell, Makefile`;
  } else if (lower === 'contact') {
    outputLine.innerHTML = `Email: zaidkhan0997@proton.me<br>
    Instagram: https://www.instagram.com/zaidkhan0997<br>
    GitHub: https://github.com/zaidkhan0997<br>
    Web: https://zaidkhan0997.github.io<br>
    Location: Himachal Pradesh, India`;
  } else if (lower === 'clear') {
    body.innerHTML = '';
    return;
  } else if (lower === '') {
    return;
  } else {
    outputLine.innerHTML = `Command not found: <span style="color: #ef4444;">${escapeHTML(cmd)}</span>. Type <span style="color: var(--accent-cyan);">help</span> for available commands.`;
  }
  
  body.appendChild(outputLine);
  body.scrollTop = body.scrollHeight;
}

// Contact Form Handler - Launches mailbox client and processes via contact.php
function setupContactForm() {
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById('contact-name');
      const subjectInput = document.getElementById('contact-subject');
      const messageInput = document.getElementById('contact-message');

      const name = nameInput?.value.trim() || 'Anonymous';
      const subject = subjectInput?.value.trim() || 'Portfolio Inquiry / Collaboration';
      const message = messageInput?.value.trim() || '';

      const bodyText = `Hi MOHD ZAID,\n\n${message}\n\nSender Name: ${name}`;
      const mailtoUrl = `mailto:zaidkhan0997@proton.me?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

      // 1. Immediately launch mailbox client synchronously in direct response to click
      showToast('Opening default mail client...');
      window.location.href = mailtoUrl;

      // 2. Also dispatch to contact.php backend in background
      fetch('contact.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({ name, subject, message })
      }).catch(err => {
        console.log('PHP background contact execution:', err);
      });
    });
  }
}

// Toast Notifications
function showToast(message) {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--accent-emerald);"></i> ${escapeHTML(message)}`;
  toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 4000);
}

// HTML Escape helper
function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

/* =============================================================
   PORTFOLIO LIKES & VIEWS COUNTER LOGIC (>1M baseline)
   ============================================================= */

let portfolioViews = 1753124;
let portfolioLikes = 1518437;
let userHasLiked = false;

// Fixed Base Numbers: Views 1.7M+ (1,753,124), Likes 1.5M+ (1,518,437)
const BASE_VIEWS = 1753124;
const BASE_LIKES = 1518437;

// Initialize Metrics: Purges old random numbers & enforces strict baselines
function initPortfolioMetrics() {
  const STORAGE_KEY_VIEWS = 'zaid_portfolio_views_v2';
  const STORAGE_KEY_LIKES = 'zaid_portfolio_likes_v2';
  const STORAGE_KEY_LIKED = 'zaid_portfolio_has_liked';

  // Purge old legacy keys that held random numbers (e.g. 1,705,937)
  try {
    localStorage.removeItem('zaid_portfolio_views_count');
    localStorage.removeItem('zaid_portfolio_likes_count');
  } catch (e) {}

  let storedViews = localStorage.getItem(STORAGE_KEY_VIEWS);
  let storedLikes = localStorage.getItem(STORAGE_KEY_LIKES);
  let storedLikedStatus = localStorage.getItem(STORAGE_KEY_LIKED);

  // Validate & set baseline
  let parsedViews = parseInt(storedViews, 10);
  if (!storedViews || isNaN(parsedViews) || parsedViews < BASE_VIEWS) {
    parsedViews = BASE_VIEWS;
  }

  userHasLiked = storedLikedStatus === 'true';

  let parsedLikes = parseInt(storedLikes, 10);
  if (!storedLikes || isNaN(parsedLikes) || parsedLikes < BASE_LIKES || parsedLikes > (BASE_LIKES + 1000)) {
    parsedLikes = userHasLiked ? (BASE_LIKES + 1) : BASE_LIKES;
  }

  // Increment view count by 1 for this visit
  if (!sessionStorage.getItem('zaid_session_viewed')) {
    sessionStorage.setItem('zaid_session_viewed', 'true');
    parsedViews += 1;
    // Dispatch view increment to PHP backend
    fetch('api.php?action=view').catch(() => {});
  }

  portfolioViews = parsedViews;
  portfolioLikes = parsedLikes;

  // Save current values back to localStorage
  localStorage.setItem(STORAGE_KEY_VIEWS, portfolioViews.toString());
  localStorage.setItem(STORAGE_KEY_LIKES, portfolioLikes.toString());

  // Render initial UI
  updateMetricsUI();
}

// Format numbers with commas (e.g. 1,753,123) and compact view (e.g. 1.75M)
function formatMetricNumber(num) {
  return num.toLocaleString('en-US');
}

function formatCompactNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Update all UI elements for Views and Likes (Views ALWAYS first)
function updateMetricsUI() {
  const viewsFormatted = formatMetricNumber(portfolioViews);
  const likesFormatted = formatMetricNumber(portfolioLikes);
  const viewsCompact = formatCompactNumber(portfolioViews);
  const likesCompact = formatCompactNumber(portfolioLikes);

  // 1. Hero Stat Cards (Views 1st, Likes 2nd)
  const statViewsEl = document.getElementById('stat-views');
  const statLikesEl = document.getElementById('stat-likes');
  if (statViewsEl) statViewsEl.textContent = viewsFormatted;
  if (statLikesEl) statLikesEl.textContent = likesFormatted;

  // 2. Hero Engagement Row
  const heroViewsCountEl = document.getElementById('hero-views-count');
  const heroLikesCountEl = document.getElementById('hero-likes-count');
  const heroLikeBtn = document.getElementById('hero-like-btn');
  const heroLikeLabel = document.getElementById('hero-like-label');
  const likeStatusTag = document.getElementById('like-status-tag');

  if (heroViewsCountEl) heroViewsCountEl.textContent = viewsFormatted;
  if (heroLikesCountEl) heroLikesCountEl.textContent = likesFormatted;

  if (heroLikeBtn) {
    if (userHasLiked) {
      heroLikeBtn.classList.add('liked');
      if (heroLikeLabel) heroLikeLabel.textContent = 'Liked (Click to Unlike)';
      if (likeStatusTag) likeStatusTag.textContent = 'Liked ❤';
      heroLikeBtn.title = 'You already liked this portfolio! Click to Unlike.';
    } else {
      heroLikeBtn.classList.remove('liked');
      if (heroLikeLabel) heroLikeLabel.textContent = 'Like Portfolio';
      if (likeStatusTag) likeStatusTag.textContent = 'Like';
      heroLikeBtn.title = 'Click to Like Portfolio!';
    }
  }

  // 3. Header Navbar Items
  const navViewsCountEl = document.getElementById('nav-views-count');
  const navLikesCountEl = document.getElementById('nav-likes-count');
  const navLikeBtn = document.getElementById('nav-like-btn');

  if (navViewsCountEl) navViewsCountEl.textContent = viewsCompact;
  if (navLikesCountEl) navLikesCountEl.textContent = likesCompact;
  if (navLikeBtn) {
    if (userHasLiked) {
      navLikeBtn.classList.add('liked');
      navLikeBtn.title = 'You already liked this portfolio! Click to Unlike.';
    } else {
      navLikeBtn.classList.remove('liked');
      navLikeBtn.title = 'Like Portfolio';
    }
  }

  // 4. Sticky Floating Bar
  const floatViewsCountEl = document.getElementById('float-views-count');
  const floatLikesCountEl = document.getElementById('float-likes-count');
  const floatLikePill = document.getElementById('float-like-pill');
  const floatLikeTitle = document.getElementById('float-like-title');

  if (floatViewsCountEl) floatViewsCountEl.textContent = viewsFormatted;
  if (floatLikesCountEl) floatLikesCountEl.textContent = likesFormatted;
  if (floatLikePill) {
    if (userHasLiked) {
      floatLikePill.classList.add('liked');
      if (floatLikeTitle) floatLikeTitle.textContent = 'Liked ❤';
    } else {
      floatLikePill.classList.remove('liked');
      if (floatLikeTitle) floatLikeTitle.textContent = 'Like';
    }
  }

  // 5. Drawer Flyout Metrics
  const drawerViewsCountEl = document.getElementById('drawer-views-count');
  const drawerLikesCountEl = document.getElementById('drawer-likes-count');
  const drawerLikeBtn = document.getElementById('drawer-like-btn');

  if (drawerViewsCountEl) drawerViewsCountEl.textContent = viewsCompact;
  if (drawerLikesCountEl) drawerLikesCountEl.textContent = likesCompact;
  if (drawerLikeBtn) {
    if (userHasLiked) {
      drawerLikeBtn.classList.add('liked');
    } else {
      drawerLikeBtn.classList.remove('liked');
    }
  }
}

// Handle Like Button Clicks (Toggle like / unlike status & update storage + PHP + UI)
function handleLikeClick(event) {
  const STORAGE_KEY_LIKES = 'zaid_portfolio_likes_v2';
  const STORAGE_KEY_LIKED = 'zaid_portfolio_has_liked';

  if (!userHasLiked) {
    portfolioLikes += 1;
    userHasLiked = true;
    localStorage.setItem(STORAGE_KEY_LIKES, portfolioLikes.toString());
    localStorage.setItem(STORAGE_KEY_LIKED, 'true');

    updateMetricsUI();
    spawnHeartBurst(event);
    showToast('Thank you for liking my portfolio! ❤️');

    // Notify PHP backend
    fetch('api.php?action=like').catch(() => {});
  } else {
    // Toggle unlike if clicked again
    portfolioLikes = Math.max(BASE_LIKES, portfolioLikes - 1);
    userHasLiked = false;
    localStorage.setItem(STORAGE_KEY_LIKES, portfolioLikes.toString());
    localStorage.setItem(STORAGE_KEY_LIKED, 'false');

    updateMetricsUI();
    showToast('Portfolio unliked.');

    // Notify PHP backend
    fetch('api.php?action=unlike').catch(() => {});
  }
}

// Particle animation on liking portfolio
function spawnHeartBurst(e) {
  let posX = window.innerWidth / 2;
  let posY = window.innerHeight / 2;

  if (e && e.clientX && e.clientY) {
    posX = e.clientX;
    posY = e.clientY;
  }

  const heartCount = 7;
  for (let i = 0; i < heartCount; i++) {
    const heart = document.createElement('i');
    heart.className = 'fa-solid fa-heart heart-particle';
    
    const dx = (Math.random() - 0.5) * 120 + 'px';
    const rot = (Math.random() - 0.5) * 60 + 'deg';
    
    heart.style.left = (posX + (Math.random() - 0.5) * 30) + 'px';
    heart.style.top = (posY + (Math.random() - 0.5) * 30) + 'px';
    heart.style.setProperty('--dx', dx);
    heart.style.setProperty('--rot', rot);
    
    document.body.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 1200);
  }
}

/* =============================================================
   FLOATING 3-LINE MENU INTERACTIVITY & DRAWER CONTROLS
   ============================================================= */

function toggleFloatingMenu() {
  const backdrop = document.getElementById('floating-menu-backdrop');
  const drawer = document.getElementById('floating-menu-drawer');
  const floatBtn = document.getElementById('floating-menu-btn');
  const navBtn = document.getElementById('nav-hamburger-btn');

  const isOpen = drawer && drawer.classList.contains('active');
  if (isOpen) {
    closeFloatingMenu();
  } else {
    if (backdrop) backdrop.classList.add('active');
    if (drawer) drawer.classList.add('active');
    if (floatBtn) floatBtn.classList.add('active');
    if (navBtn) navBtn.classList.add('active');
    document.body.classList.add('menu-open');
  }
}

function closeFloatingMenu() {
  const backdrop = document.getElementById('floating-menu-backdrop');
  const drawer = document.getElementById('floating-menu-drawer');
  const floatBtn = document.getElementById('floating-menu-btn');
  const navBtn = document.getElementById('nav-hamburger-btn');

  if (backdrop) backdrop.classList.remove('active');
  if (drawer) drawer.classList.remove('active');
  if (floatBtn) floatBtn.classList.remove('active');
  if (navBtn) navBtn.classList.remove('active');
  document.body.classList.remove('menu-open');
}

// Drawer Skill Filter handler
function handleDrawerSkillFilter(category) {
  const targetBtn = document.querySelector(`.skills-tabs-bar .skill-tab-btn[onclick*="'${category}'"]`);
  switchSkillTab(category, targetBtn);
  closeFloatingMenu();
  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    skillsSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// Drawer Repo Category Filter handler
function handleDrawerRepoFilter(filterCategory) {
  const targetBtn = document.querySelector(`.filter-btn[data-filter="${filterCategory}"]`);
  if (targetBtn) {
    targetBtn.click();
  }
  closeFloatingMenu();
  const projectsSection = document.getElementById('projects');
  if (projectsSection) {
    projectsSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// Global Key Listeners for ESC key to close drawer
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeFloatingMenu();
  }
});



