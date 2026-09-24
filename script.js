document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Navbar Toggle ---
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const navLinksItems = document.querySelectorAll('.nav-link');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });

  // --- Scroll Spy ---
  const sections = document.querySelectorAll('section');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (pageYOffset >= sectionTop - 150) {
        current = section.getAttribute('id');
      }
    });
    navLinksItems.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });
  });

  // --- Intersection Observer for Staggered Fade-In ---
  const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, entry.target.dataset.delay || 0);
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const elementsToAnimate = [
    document.getElementById('hero-editor'),
    document.getElementById('hero-photo-wrap'),
    document.getElementById('about-bio-card'),
    document.getElementById('about-info-card'),
    ...document.querySelectorAll('.value-card'),
    ...document.querySelectorAll('.project-card'),
    ...document.querySelectorAll('.skill-card'),
    document.querySelector('.contact-left'),
    document.querySelector('.contact-right')
  ];

  elementsToAnimate.forEach((el, i) => {
    if (el) {
      el.classList.add('fade-in');
      el.dataset.delay = i * 60;
      observer.observe(el);
    }
  });

  // --- Typing Animation in Hero ---
  const roles = [
    'Backend Engineer',
    'Distributed Systems Builder',
    'AI Application Developer',
    'Full Stack Developer',
    'Problem Solver'
  ];
  const typingEl = document.getElementById('typing-role');
  if (typingEl) {
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeLoop() {
      const current = roles[roleIndex];
      if (!deleting) {
        typingEl.textContent = current.slice(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(typeLoop, 1800);
          return;
        }
      } else {
        typingEl.textContent = current.slice(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }
      setTimeout(typeLoop, deleting ? 55 : 90);
    }
    typeLoop();
  }

  // --- Animated Counters ---
  const counters = document.querySelectorAll('.stat-num');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        let count = 0;
        const step = Math.ceil(target / 50);
        const interval = setInterval(() => {
          count = Math.min(count + step, target);
          el.textContent = count + suffix;
          if (count >= target) clearInterval(interval);
        }, 28);
        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => countObserver.observe(c));

  // --- Card Tilt Effect on Project Cards ---
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotX = -(y / rect.height) * 5;
      const rotY = (x / rect.width) * 5;
      card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // --- Modal: ESC key & backdrop click ---
  const backdrop = document.getElementById('case-study-backdrop');
  const closeBtn = document.getElementById('cs-close');

  if (closeBtn) closeBtn.addEventListener('click', closeCaseStudy);

  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeCaseStudy();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCaseStudy();
  });

});

// --- Contact Form ---
function handleFormSubmit(event) {
  event.preventDefault();
  const form = document.getElementById('contact-form');
  const successMessage = document.getElementById('form-success');
  const btnSend = document.getElementById('btn-send-message');
  if (form.checkValidity()) {
    const originalBtnText = btnSend.innerHTML;
    btnSend.innerHTML = 'SENDING...';
    btnSend.disabled = true;
    setTimeout(() => {
      form.reset();
      successMessage.style.display = 'block';
      btnSend.innerHTML = originalBtnText;
      btnSend.disabled = false;
      setTimeout(() => { successMessage.style.display = 'none'; }, 5000);
    }, 1500);
  }
}

// =============================================================
// PROJECT CASE STUDY DATA
// =============================================================

const projectCaseStudies = {

  // --- LEDGER SYSTEM ---
  ledger: {
    num: '01 / SYSTEM DESIGN',
    title: 'Ledger System',
    subtitle: 'Distributed double-entry financial ledger with idempotent transaction posting and event-driven reconciliation.',
    repo: 'https://github.com/TanujaGunjal/ledger-system',
    overview: [
      { label: 'TYPE', value: 'Backend / Distributed Systems' },
      { label: 'STACK', value: 'Java · Spring Boot · PostgreSQL · Kafka' },
      { label: 'DATE', value: 'Jun 2026' },
      { label: 'PATTERN', value: 'Transactional Outbox' }
    ],
    features: [
      'Double-entry bookkeeping with strict debit/credit balance enforcement',
      'Idempotent transaction posting — duplicate requests are safely rejected',
      'Deadlock-free concurrent balance updates via deterministic lock ordering',
      'Transactional Outbox Pattern for reliable Kafka/Redpanda event publishing',
      'Automated self-healing reconciliation worker against external statement feeds',
      'CI/CD pipeline with GitHub Actions and Docker containerisation'
    ],
    principleSteps: [
      { strong: 'Client Request', text: 'React + TypeScript frontend submits a ledger transaction via REST.' },
      { strong: 'Ledger API', text: 'Spring Boot validates, acquires deterministic locks on both accounts, and posts a double-entry.' },
      { strong: 'Outbox Write', text: 'The confirmed transaction is atomically written to an Outbox table in PostgreSQL within the same DB transaction.' },
      { strong: 'Event Publication', text: 'An Outbox relay picks up the record and publishes it to Redpanda (Kafka-compatible).' },
      { strong: 'Reconciliation Worker', text: 'Consumes events and reconciles the internal ledger against an external statement feed, flagging discrepancies.' }
    ],
    diagram: `flowchart LR
  FE["React + TypeScript\nFrontend"]

  subgraph API["Ledger API — Spring Boot"]
    direction TB
    V["Validate & Idempotency\nCheck"]
    L["Acquire Deterministic\nLocks"]
    P["Post Double-Entry\n(PostgreSQL)"]
    O["Write Outbox\nRecord"]
    V --> L --> P --> O
  end

  subgraph Messaging["Event Bus"]
    Relay["Outbox Relay"]
    Kafka["Redpanda / Kafka"]
    Relay --> Kafka
  end

  subgraph Workers["Workers"]
    RW["Reconciliation\nWorker"]
    EXT["External Statement\nFeed"]
    RW --> EXT
  end

  FE -->|REST| V
  O -->|poll| Relay
  Kafka -->|consume| RW`,
    highlights: [
      { title: 'IDEMPOTENCY', desc: 'A unique transaction key prevents double posting under retries or network failures.' },
      { title: 'CONCURRENCY', desc: 'Deterministic lock ordering on account pairs eliminates deadlocks under concurrent load.' },
      { title: 'OUTBOX PATTERN', desc: 'Atomic DB write + outbox record guarantees at-least-once event delivery to Kafka.' },
      { title: 'RECONCILIATION', desc: 'Self-healing worker automatically flags and resolves discrepancies against external feeds.' }
    ],
    stack: ['Java 21', 'Spring Boot 3', 'PostgreSQL', 'Redpanda / Kafka', 'Docker', 'GitHub Actions', 'React', 'TypeScript']
  },

  // --- HEALTHINTEL ---
  healthintel: {
    num: '02 / SYSTEM DESIGN',
    title: 'HealthIntel',
    subtitle: 'Educational health-information platform. Does not diagnose conditions or replace qualified clinical advice.',
    repo: 'https://github.com/TanujaGunjal/HealthIntel',
    overview: [
      { label: 'TYPE', value: 'Agentic AI / Full Stack' },
      { label: 'STACK', value: 'Python · Django · LangGraph · FAISS' },
      { label: 'DATE', value: 'Apr 2026' },
      { label: 'PATTERN', value: '4-Agent LangGraph Workflow' }
    ],
    features: [
      '4-agent LangGraph workflow: Symptom Analysis → Evidence Retrieval → Safety Check → Final Response',
      'Clinical NER + negation pipeline (e.g. "denied chest pain" excluded from positive symptoms)',
      'TF-IDF / logistic-regression classifier across 6 symptom categories',
      'FAISS vector index over curated medical documents using all-MiniLM-L6-v2 embeddings',
      'EasyOCR + Tesseract fallback prescription analysis pipeline',
      'Google Calendar OAuth 2.0 for idempotent medication reminder scheduling',
      'JWT authentication, user history, and appointment management via Django REST'
    ],
    principleSteps: [
      { strong: 'Symptom Input / Prescription Upload', text: 'User submits free-text symptoms or uploads a prescription image via the React frontend.' },
      { strong: 'SymptomAnalysisAgent', text: 'Extracts clinical entities, applies negation rules, and classifies into respiratory / digestive / neurological / dermatological / musculoskeletal / general.' },
      { strong: 'EvidenceRetrievalAgent', text: 'Queries the FAISS index for relevant passages; skipped when no positive symptoms are found.' },
      { strong: 'SafetyAgent', text: 'Checks for red-flag conditions in positive symptoms; routes directly to response if no evidence retrieved.' },
      { strong: 'FinalResponseAgent', text: 'Synthesises a grounded educational response via Gemini/OpenAI; falls back to deterministic source-grounded output when no LLM is configured.' }
    ],
    diagram: `flowchart LR
  FE["React + Vite\nFrontend"]

  subgraph Django["Django REST Framework"]
    Auth["JWT Auth"]
    SA["Symptom\nAnalysis"]
    OCR["EasyOCR /\nTesseract"]
    Cal["Google Calendar\nOAuth"]
  end

  subgraph LG["LangGraph Workflow"]
    direction TB
    A1["SymptomAnalysis\nAgent"]
    A2["EvidenceRetrieval\nAgent"]
    A3["Safety\nAgent"]
    A4["FinalResponse\nAgent"]
    A1 -->|positive symptoms| A2
    A2 -->|evidence found| A3
    A3 --> A4
    A1 -->|no symptoms| A4
    A2 -->|no evidence| A4
  end

  subgraph Data["Data Layer"]
    FAISS["FAISS Index\n(MiniLM)"]
    PG[("PostgreSQL")]
    Redis["Redis /\nCelery"]
    LLM["Gemini / OpenAI\n(optional)"]
  end

  FE --> Auth --> SA --> A1
  FE --> OCR
  A2 --> FAISS
  A4 --> LLM
  Django --> PG
  Django --> Redis`,
    highlights: [
      { title: 'NEGATION HANDLING', desc: '"Denied chest pain" is excluded from positive symptoms and does not trigger red-flag safety paths.' },
      { title: 'RAG PIPELINE', desc: 'FAISS + MiniLM embeddings retrieve relevant passages; results are deduplicated and source-tagged.' },
      { title: 'DETERMINISTIC FALLBACK', desc: 'Source-grounded response synthesis works without any LLM provider configured.' },
      { title: 'IDEMPOTENT CALENDAR', desc: 'Fingerprint-based check prevents duplicate Google Calendar medication reminder events.' }
    ],
    stack: ['Python 3.11', 'Django REST Framework', 'LangGraph', 'FAISS', 'all-MiniLM-L6-v2', 'EasyOCR', 'Tesseract', 'Gemini API', 'React + Vite', 'PostgreSQL', 'Redis', 'Celery', 'Docker']
  },

  // --- BUYEASY ---
  buyeasy: {
    num: '03 / SYSTEM DESIGN',
    title: 'BuyEasy',
    subtitle: 'Scalable MERN e-commerce platform with async order processing, observability, and a full Jenkins CI/CD pipeline.',
    repo: 'https://github.com/TanujaGunjal/BuyEasy-DevOps',
    overview: [
      { label: 'TYPE', value: 'Full Stack / DevOps' },
      { label: 'STACK', value: 'MERN · RabbitMQ · Redis · Docker' },
      { label: 'DATE', value: 'Apr 2026' },
      { label: 'PATTERN', value: 'Async Queue + Cache-Aside' }
    ],
    features: [
      'Asynchronous order pipeline via RabbitMQ — inventory, notification, and DLQ consumers',
      'Redis cache-aside pattern for fast cart and product reads',
      'Automated price-drop alert notifications through async messaging',
      'Dead Letter Queue for failed message handling and reprocessing',
      'Prometheus + Grafana + Node Exporter observability stack',
      'Jenkins pipeline: GitHub → Tests → SonarQube → Docker → AWS EC2'
    ],
    principleSteps: [
      { strong: 'Client', text: 'React frontend served via Nginx sends API requests to the Express backend.' },
      { strong: 'Express Backend', text: 'Handles auth, cart (Redis cache-aside), and order creation. Publishes order events to RabbitMQ.' },
      { strong: 'Async Consumers', text: 'inventoryConsumer updates stock; notificationConsumer sends alerts; DLQ handles failures.' },
      { strong: 'Observability', text: 'Prometheus scrapes metrics; Grafana dashboards visualise throughput and error rates.' },
      { strong: 'CI/CD', text: 'Push to GitHub → Jenkins runs tests and SonarQube scan → Docker build → deploy to AWS EC2.' }
    ],
    diagram: `flowchart LR
  FE["React + Nginx\nFrontend"]

  subgraph Backend["Express Backend"]
    API["REST API"]
    Cache["Redis\nCache-Aside"]
    MQ["RabbitMQ\nPublisher"]
    API --> Cache
    API --> MQ
  end

  subgraph Consumers["Async Consumers"]
    IC["inventoryConsumer"]
    NC["notificationConsumer"]
    DLQ["Dead Letter\nQueue"]
    MQ --> IC
    MQ --> NC
    MQ -->|failed msgs| DLQ
  end

  subgraph DB["Data"]
    Mongo[("MongoDB")]
  end

  subgraph Obs["Observability"]
    Prom["Prometheus"]
    Graf["Grafana"]
    NE["Node Exporter"]
    NE --> Prom --> Graf
  end

  subgraph CICD["CI/CD"]
    GH["GitHub"]
    J["Jenkins"]
    SQ["SonarQube"]
    D["Docker"]
    EC2["AWS EC2"]
    GH --> J --> SQ --> D --> EC2
  end

  FE --> API
  API --> Mongo
  IC --> Mongo`,
    highlights: [
      { title: 'ASYNC PROCESSING', desc: 'RabbitMQ decouples order creation from inventory and notification — no synchronous blocking.' },
      { title: 'CACHE-ASIDE', desc: 'Redis caches hot product and cart data; cache is lazily populated and TTL-invalidated.' },
      { title: 'DEAD LETTER QUEUE', desc: 'Failed messages are routed to DLQ for inspection and safe reprocessing without data loss.' },
      { title: 'OBSERVABILITY', desc: 'Prometheus + Grafana provide real-time throughput, latency, and error-rate dashboards.' }
    ],
    stack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Redis', 'RabbitMQ', 'Prometheus', 'Grafana', 'Docker', 'Jenkins', 'SonarQube', 'AWS EC2', 'Nginx']
  },

  // --- HIRELENS ---
  hirelens: {
    num: '04 / SYSTEM DESIGN',
    title: 'HireLens',
    subtitle: 'AI-powered ATS with hybrid semantic resume scoring, skill-gap analysis, and AI-driven rewrite suggestions.',
    repo: 'https://github.com/TanujaGunjal/hirelens',
    overview: [
      { label: 'TYPE', value: 'AI / Full Stack' },
      { label: 'STACK', value: 'MERN · Gemini AI · Redis' },
      { label: 'DATE', value: 'Jan 2026' },
      { label: 'PATTERN', value: 'Hybrid Scoring Engine' }
    ],
    features: [
      'Hybrid scoring engine: keyword match + semantic embedding similarity',
      'Gemini AI-driven skill-gap analysis and resume rewrite suggestions',
      'Automated PDF parsing and structured data extraction from uploaded resumes',
      'Redis caching to minimise redundant Gemini API calls and reduce latency',
      'AI interview question generator tailored to job description and candidate gaps',
      'Admin analytics dashboard for ATS pipeline visibility',
      'JWT-secured multi-role authentication (candidate / recruiter / admin)'
    ],
    principleSteps: [
      { strong: 'Resume Upload', text: 'Candidate uploads PDF; the server extracts structured text via PDF parser.' },
      { strong: 'Hybrid Scoring', text: 'Keyword match score (TF-IDF style) combined with semantic similarity against the job description.' },
      { strong: 'Skill-Gap Analysis', text: 'Gemini AI identifies missing skills, suggests targeted improvements, and generates rewrite sections.' },
      { strong: 'Redis Cache', text: 'Gemini responses are cached by resume+JD hash to avoid redundant API calls.' },
      { strong: 'Interview Generator', text: 'Generates role-specific interview questions from the skill-gap report.' }
    ],
    diagram: `flowchart LR
  FE["React + Vite\nFrontend"]

  subgraph Server["Node.js + Express"]
    Auth["JWT Auth"]
    Parser["PDF\nParser"]
    Score["Hybrid Scoring\nEngine"]
    Gap["Skill-Gap\nAnalysis"]
    IQ["Interview\nGenerator"]
    Auth --> Parser --> Score --> Gap --> IQ
  end

  subgraph AI["AI Layer"]
    Gemini["Gemini AI"]
    RCache["Redis\nCache"]
    RCache -->|cache miss| Gemini
    Gap --> RCache
    IQ --> RCache
  end

  subgraph Data["Data"]
    Mongo[("MongoDB")]
    Admin["Admin\nAnalytics"]
  end

  FE --> Auth
  Server --> Mongo
  Mongo --> Admin`,
    highlights: [
      { title: 'HYBRID SCORING', desc: 'Combines keyword frequency matching with Gemini embedding similarity for more accurate candidate ranking.' },
      { title: 'REDIS CACHING', desc: 'Gemini responses cached by resume+JD hash; eliminates redundant API calls and cuts latency significantly.' },
      { title: 'AI REWRITE', desc: 'Gemini generates targeted resume section rewrites based on detected skill gaps.' },
      { title: 'INTERVIEW GEN', desc: 'Tailored interview questions generated from the candidate\'s specific gap analysis report.' }
    ],
    stack: ['React.js', 'Vite', 'Node.js', 'Express.js', 'MongoDB', 'Redis', 'Gemini AI', 'PDF Parser', 'JWT']
  },

  // --- SHOPAGENT ---
  shopagent: {
    num: '05 / SYSTEM DESIGN',
    title: 'ShopAgent',
    subtitle: 'Governed agentic AI assistant for e-commerce with deterministic business rules, human-approval gates, and RAG retrieval.',
    repo: 'https://github.com/TanujaGunjal/ShopAgent',
    overview: [
      { label: 'TYPE', value: 'Agentic AI / Full Stack' },
      { label: 'STACK', value: 'Node.js · FastAPI · MongoDB Atlas · AWS ECS' },
      { label: 'DATE', value: 'Jan 2026' },
      { label: 'PATTERN', value: 'Governed Function Calling + Human-in-the-Loop' }
    ],
    features: [
      'Gemini function calling with governed tool access — agent cannot call Stripe directly',
      'Deterministic Policy Engine enforces business rules before any action executes',
      'Human-approval gate: refunds pending admin sign-off before Stripe is charged',
      'RAG via FastAPI + MongoDB Atlas Vector Search for policy and product retrieval',
      'Idempotency keys prevent duplicate order, return, and refund operations',
      'Audit log for every agent action and approval decision',
      'Deployed on AWS ECS/Fargate with ECR, IAM, Secrets Manager, and CloudWatch'
    ],
    principleSteps: [
      { strong: 'User Request', text: 'User sends a natural-language query (order status, return request, refund).' },
      { strong: 'Agent Controller', text: 'Gemini function-calling agent selects appropriate tools — but cannot call Stripe directly.' },
      { strong: 'RAG Retrieval', text: 'FastAPI RAG service queries MongoDB Atlas Vector Search for relevant policy documents.' },
      { strong: 'Policy Engine', text: 'Deterministic rules evaluate eligibility (e.g. within 30-day return window, item condition).' },
      { strong: 'Human Approval', text: 'Refund requests enter a pending queue; admin must explicitly approve before Stripe is invoked.' },
      { strong: 'Stripe Refund', text: 'Only after admin approval does the system call Stripe with an idempotency key.' }
    ],
    diagram: `flowchart LR
  User["User"]

  subgraph API["Express API — AWS ECS/Fargate"]
    Auth["Authentication"]
    AC["Agent\nController"]
    Auth --> AC
  end

  subgraph Agent["Gemini Agent Tools"]
    PE["Deterministic\nPolicy Engine"]
    RAG["RAG Service\n(FastAPI)"]
  end

  subgraph RAGData["RAG Data"]
    MVS["MongoDB Atlas\nVector Search"]
    RAG --> MVS
  end

  subgraph Approval["Human-in-the-Loop"]
    Queue["Pending\nApproval Queue"]
    Admin["Admin\nApproval"]
    Queue --> Admin
  end

  Stripe["Stripe Refund\n(post-approval only)"]
  Note["⚠ Agent CANNOT\ncall Stripe directly"]

  User -->|query| Auth
  AC --> PE
  AC --> RAG
  PE -->|eligible refund| Queue
  Admin -->|approve| Stripe
  Note -.->|enforced| AC`,
    highlights: [
      { title: 'GOVERNED AI', desc: 'Tool access is controlled — the agent has no direct path to payment execution.' },
      { title: 'HUMAN APPROVAL', desc: 'Refunds require explicit admin sign-off in a pending queue before Stripe is ever called.' },
      { title: 'RAG RETRIEVAL', desc: 'MongoDB Atlas Vector Search retrieves relevant policy docs to ground agent decisions.' },
      { title: 'IDEMPOTENCY', desc: 'Idempotency keys prevent duplicate charges or duplicate refunds under retries.' }
    ],
    stack: ['React.js', 'Node.js', 'Express.js', 'FastAPI', 'Python', 'Gemini API', 'MongoDB Atlas', 'Vector Search', 'Stripe', 'AWS ECS/Fargate', 'ECR', 'IAM', 'CloudWatch']
  }

};

// =============================================================
// MODAL OPEN / CLOSE
// =============================================================

let _savedScrollY = 0;

function openCaseStudy(key) {
  const data = projectCaseStudies[key];
  if (!data) return;

  // Populate header
  document.getElementById('cs-num').textContent = data.num;
  document.getElementById('cs-modal-title').textContent = data.title;
  document.getElementById('cs-subtitle').textContent = data.subtitle;
  const repoLink = document.getElementById('cs-repo-link');
  repoLink.href = data.repo;

  // Build body HTML
  const body = document.getElementById('cs-body');
  body.innerHTML = buildModalBody(data);

  // Open
  const backdrop = document.getElementById('case-study-backdrop');
  backdrop.setAttribute('aria-hidden', 'false');
  backdrop.classList.add('cs-open');

  // Lock scroll
  _savedScrollY = window.scrollY;
  document.body.classList.add('cs-locked');

  // Focus close button for accessibility
  setTimeout(() => {
    document.getElementById('cs-close').focus();
    // Render mermaid diagrams inside modal
    if (window.mermaid) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        themeVariables: {
          background: '#ffffff',
          primaryColor: '#f8f8f8',
          primaryBorderColor: '#111111',
          primaryTextColor: '#111111',
          lineColor: '#444444',
          secondaryColor: '#f0f0f0',
          tertiaryColor: '#e8e8e8',
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: '13px',
          nodeBorder: '#111111',
          clusterBkg: '#f5f5f5',
          clusterBorder: '#333333',
          edgeLabelBackground: '#ffffff',
          titleColor: '#111111',
          nodeTextColor: '#111111',
          mainBkg: '#f8f8f8',
          specialStateColor: '#f22e8a',
          labelColor: '#111111'
        }
      });
      const mermaidEls = body.querySelectorAll('.mermaid');
      mermaidEls.forEach((el, idx) => {
        const graphDef = el.getAttribute('data-diagram');
        if (graphDef) {
          mermaid.render('mermaid-svg-' + key + '-' + idx, graphDef)
            .then(({ svg }) => {
              el.innerHTML = svg;
            })
            .catch(err => {
              el.innerHTML = '<p style="color:#f22e8a;font-size:0.8rem;padding:8px;">Diagram render error. Check console.</p>';
              console.error('Mermaid error:', err);
            });
        }
      });
    }
  }, 50);
}

function closeCaseStudy() {
  const backdrop = document.getElementById('case-study-backdrop');
  if (!backdrop.classList.contains('cs-open')) return;

  backdrop.classList.remove('cs-open');
  backdrop.setAttribute('aria-hidden', 'true');

  // Restore scroll
  document.body.classList.remove('cs-locked');
  window.scrollTo(0, _savedScrollY);
}

// =============================================================
// BUILD MODAL BODY HTML
// =============================================================

function buildModalBody(data) {
  return `
    <!-- OVERVIEW -->
    <div class="cs-section">
      <div class="cs-section-label">OVERVIEW</div>
      <div class="cs-overview-grid">
        ${data.overview.map(o => `
          <div class="cs-overview-card">
            <div class="cs-overview-card-label">${o.label}</div>
            <div class="cs-overview-card-value">${o.value}</div>
          </div>`).join('')}
      </div>
    </div>

    <!-- KEY FEATURES -->
    <div class="cs-section">
      <div class="cs-section-label">KEY FEATURES</div>
      <ul class="cs-feature-list">
        ${data.features.map(f => `<li>${f}</li>`).join('')}
      </ul>
    </div>

    <!-- WORKING PRINCIPLE -->
    <div class="cs-section">
      <div class="cs-section-label">WORKING PRINCIPLE</div>
      <div class="cs-principle-steps">
        ${data.principleSteps.map(s => `
          <div class="cs-principle-step">
            <div class="cs-step-connector">
              <div class="cs-step-dot"></div>
              <div class="cs-step-line"></div>
            </div>
            <div class="cs-step-text"><strong>${s.strong}</strong> — ${s.text}</div>
          </div>`).join('')}
      </div>
    </div>

    <!-- SYSTEM ARCHITECTURE -->
    <div class="cs-section">
      <div class="cs-section-label">SYSTEM ARCHITECTURE</div>
      <p class="cs-section-text" style="margin-bottom:14px;">High-level request, data, and event flow.</p>
      <div class="cs-arch-card">
        <div class="mermaid" data-diagram="${escapeAttr(data.diagram)}"></div>
      </div>
    </div>

    <!-- ENGINEERING HIGHLIGHTS -->
    <div class="cs-section">
      <div class="cs-section-label">ENGINEERING HIGHLIGHTS</div>
      <div class="cs-highlights-grid">
        ${data.highlights.map(h => `
          <div class="cs-highlight-card">
            <div class="cs-highlight-title">[ ${h.title} ]</div>
            <div class="cs-highlight-desc">${h.desc}</div>
          </div>`).join('')}
      </div>
    </div>

    <!-- TECH STACK -->
    <div class="cs-section">
      <div class="cs-section-label">TECH STACK</div>
      <div class="cs-stack-chips">
        ${data.stack.map(s => `<span class="cs-stack-chip">[ ${s} ]</span>`).join('')}
      </div>
    </div>
  `;
}

function escapeAttr(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
