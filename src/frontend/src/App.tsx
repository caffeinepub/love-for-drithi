import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

function FloralCorner({ className = "" }: { className?: string }) {
  return (
    <svg
      role="img"
      aria-label="Floral decoration"
      className={className}
      width="60"
      height="60"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 5 Q15 2 20 10 Q25 18 15 22 Q5 26 5 15 Z"
        fill="#E7A3A8"
        opacity="0.5"
      />
      <path
        d="M5 5 Q2 15 10 20 Q18 25 22 15 Q26 5 15 5 Z"
        fill="#B07A73"
        opacity="0.4"
      />
      <circle cx="22" cy="22" r="4" fill="#9C6A64" opacity="0.3" />
      <path
        d="M5 5 L28 28"
        stroke="#B07A73"
        strokeWidth="1"
        strokeDasharray="3 3"
        opacity="0.4"
      />
      <circle cx="12" cy="38" r="3" fill="#E7A3A8" opacity="0.5" />
      <circle cx="38" cy="12" r="3" fill="#E7A3A8" opacity="0.5" />
    </svg>
  );
}

function RoseIllustration({
  className = "",
  flip = false,
}: { className?: string; flip?: boolean }) {
  return (
    <svg
      role="img"
      aria-label="Rose illustration"
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : {}}
      width="120"
      height="160"
      viewBox="0 0 120 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M60 160 Q55 130 58 100 Q60 80 60 60"
        stroke="#9C6A64"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M58 120 Q40 110 35 95 Q50 90 58 110 Z"
        fill="#B07A73"
        opacity="0.4"
      />
      <path
        d="M60 100 Q78 90 82 75 Q68 73 60 92 Z"
        fill="#B07A73"
        opacity="0.4"
      />
      <ellipse cx="60" cy="40" rx="18" ry="22" fill="#E7A3A8" opacity="0.6" />
      <path
        d="M42 38 Q48 20 60 18 Q72 20 78 38 Q72 50 60 52 Q48 50 42 38 Z"
        fill="#B07A73"
        opacity="0.7"
      />
      <path
        d="M48 30 Q54 18 60 16 Q66 18 72 30 Q68 42 60 44 Q52 42 48 30 Z"
        fill="#9C6A64"
        opacity="0.6"
      />
      <ellipse cx="60" cy="26" rx="8" ry="10" fill="#7A4F4A" opacity="0.4" />
      <circle cx="30" cy="70" r="6" fill="#E7A3A8" opacity="0.5" />
      <circle cx="30" cy="70" r="3" fill="#B07A73" opacity="0.6" />
      <circle cx="92" cy="50" r="5" fill="#E7A3A8" opacity="0.4" />
      <circle cx="92" cy="50" r="2.5" fill="#B07A73" opacity="0.5" />
    </svg>
  );
}

const hearts = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  left: `${5 + ((i * 6) % 90)}%`,
  size: 16 + (i % 4) * 8,
  duration: 6 + (i % 5) * 2,
  delay: (i * 0.7) % 8,
  emoji: i % 3 === 0 ? "🌸" : i % 3 === 1 ? "💕" : "✿",
}));

const letters = [
  {
    id: 1,
    date: "March 2023",
    title: "The Day I Knew You",
    excerpt:
      "From the moment I saw you, I knew you were the one I'd been searching for. The world seemed to pause, and all I could see was you...",
  },
  {
    id: 2,
    date: "December 28th, 2024",
    title: "The Day I Told I Love You",
    excerpt:
      "I love you because you make every moment worth living. Your laugh, your smile, the way your eyes light up when you're excited...",
  },
  {
    id: 3,
    date: "December 31st, 2024",
    title: "A Promise to You",
    excerpt:
      "I promise to be by your side through every joy and every storm. Through laughter and tears, in sunrise and in dusk...",
  },
  {
    id: 4,
    date: "December 31st, 2024",
    title: "Forever and Always",
    excerpt:
      "No matter where life takes us, my love for you will never waver. You are my home, my peace, my greatest adventure...",
  },
];

const memories = [
  {
    id: 1,
    label: "First Date",
    bg: "#f9c5cb",
    photo:
      "/assets/uploads/img_5707-019d26f7-daea-70a8-9a5f-f155f1811d08-2.jpeg",
  },
  {
    id: 2,
    label: "Summer Trip",
    bg: "#fde68a",
    photo:
      "/assets/uploads/img_5703-019d26f7-da96-73ca-8164-6863235eb7cd-1.jpeg",
  },
  {
    id: 3,
    label: "Your Birthday",
    bg: "#fbc2cb",
    photo:
      "/assets/uploads/img_5706-019d26f7-dc29-77a1-a860-f70e37a8aac6-3.jpeg",
  },
  {
    id: 4,
    label: "Our Adventure",
    bg: "#fed7aa",
    photo:
      "/assets/uploads/img_5705-019d26f7-dbf0-76cd-833f-0824d6e6e093-4.jpeg",
  },
  {
    id: 5,
    label: "Just Us",
    bg: "#fce7f3",
    photo: "/assets/uploads/image-019d26fe-1c46-708c-a0d7-dc9b5ac06982-1.jpeg",
  },
];

function useInView(ref: React.RefObject<Element | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.15 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return inView;
}

function FadeSection({
  children,
  className = "",
  delay = 0,
}: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [letterOpen, setLetterOpen] = useState<number | null>(null);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: "home", label: "Home" },
    { id: "letters", label: "Love Letters" },
    { id: "memories", label: "Memories Gallery" },
    { id: "story", label: "Story" },
    { id: "moments", label: "Shared Moments" },
  ];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLetterOpen(null);
    };
    if (letterOpen !== null) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [letterOpen]);

  const activeLetter = letters.find((l) => l.id === letterOpen) ?? null;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#F3ECDC", color: "#2A2420" }}
    >
      {/* ===== NAV ===== */}
      <header
        className="sticky top-0 z-50 w-full"
        style={{
          backgroundColor: "#F3ECDC",
          boxShadow: "0 2px 12px rgba(42,36,32,0.08)",
        }}
        data-ocid="nav.panel"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-script text-4xl" style={{ color: "#9C6A64" }}>
              Drithi
            </span>
            <span className="text-xl" style={{ color: "#E7A3A8" }}>
              ♥
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 font-display text-sm tracking-wide">
            {navItems.map((item) => (
              <button
                type="button"
                key={item.id}
                data-ocid={`nav.${item.id}.link`}
                onClick={() => scrollTo(item.id)}
                className="transition-colors hover:opacity-70"
                style={{ color: "#2A2420" }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button
            type="button"
            data-ocid="nav.write_button"
            onClick={() => scrollTo("letters")}
            className="hidden md:block px-5 py-2 rounded-full text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: "#B07A73", color: "#FAF6EE" }}
          >
            Write to Drithi
          </button>

          <button
            type="button"
            className="md:hidden p-2"
            data-ocid="nav.mobile_toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="space-y-1">
              <span
                className="block w-5 h-0.5"
                style={{ backgroundColor: "#9C6A64" }}
              />
              <span
                className="block w-5 h-0.5"
                style={{ backgroundColor: "#9C6A64" }}
              />
              <span
                className="block w-5 h-0.5"
                style={{ backgroundColor: "#9C6A64" }}
              />
            </div>
          </button>
        </div>

        {mobileMenuOpen && (
          <div
            className="md:hidden px-4 pb-4 flex flex-col gap-3"
            style={{ backgroundColor: "#F3ECDC" }}
          >
            {navItems.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-left py-1"
                style={{ color: "#2A2420" }}
              >
                {item.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => scrollTo("letters")}
              className="mt-1 px-5 py-2 rounded-full text-sm font-semibold w-fit"
              style={{ backgroundColor: "#B07A73", color: "#FAF6EE" }}
            >
              Write to Drithi
            </button>
          </div>
        )}
      </header>

      {/* ===== HERO ===== */}
      <section
        id="home"
        className="relative w-full overflow-hidden"
        style={{ minHeight: "600px", height: "80vh" }}
      >
        <img
          src="/assets/generated/hero-bg.dim_1400x700.jpg"
          alt="Romantic garden"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(243,236,220,0.85) 0%, rgba(243,236,220,0.55) 55%, rgba(243,236,220,0.05) 100%)",
          }}
        />

        {hearts.map((h) => (
          <span
            key={h.id}
            className="float-heart select-none"
            style={{
              left: h.left,
              bottom: "-5%",
              fontSize: `${h.size}px`,
              animationDuration: `${h.duration}s`,
              animationDelay: `${h.delay}s`,
            }}
          >
            {h.emoji}
          </span>
        ))}

        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="max-w-xl"
          >
            <h1
              className="font-display text-5xl md:text-7xl font-bold leading-tight mb-4"
              style={{ color: "#2A2420" }}
            >
              My Love for{" "}
              <span
                className="font-script text-6xl md:text-8xl"
                style={{ color: "#9C6A64" }}
              >
                Drithi
              </span>{" "}
              <span style={{ color: "#E7A3A8" }}>♥</span>
            </h1>
            <p
              className="font-display italic text-lg md:text-xl mb-8 leading-relaxed"
              style={{ color: "#4A3830" }}
            >
              Every day with you is a blessing.
              <br />
              This is my love letter to you, Drithi.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                data-ocid="hero.letters_button"
                onClick={() => scrollTo("letters")}
                className="px-7 py-3 rounded-full font-semibold text-sm transition-all hover:opacity-90 active:scale-95"
                style={{
                  backgroundColor: "#B07A73",
                  color: "#FAF6EE",
                  boxShadow: "0 4px 20px rgba(176,122,115,0.3)",
                }}
              >
                Read Our Letters
              </button>
              <button
                type="button"
                data-ocid="hero.memories_button"
                onClick={() => scrollTo("memories")}
                className="px-7 py-3 rounded-full font-semibold text-sm border-2 transition-all hover:opacity-80 active:scale-95"
                style={{
                  borderColor: "#B07A73",
                  color: "#9C6A64",
                  backgroundColor: "transparent",
                }}
              >
                Our Memories
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== LOVE LETTERS ===== */}
      <section id="letters" className="py-20 px-4 max-w-7xl mx-auto">
        <FadeSection className="text-center mb-14">
          <p className="font-script text-2xl mb-1" style={{ color: "#B07A73" }}>
            with all my heart
          </p>
          <h2
            className="font-display text-4xl md:text-5xl font-bold"
            style={{ color: "#2A2420" }}
          >
            The Love Letters
          </h2>
          <div
            className="mx-auto mt-4 w-16 h-0.5"
            style={{ backgroundColor: "#D8C9B3" }}
          />
        </FadeSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {letters.map((letter, i) => (
            <FadeSection key={letter.id} delay={i * 0.1}>
              <div
                data-ocid={`letters.item.${letter.id}`}
                className="relative rounded-2xl p-6 flex flex-col h-full cursor-pointer group transition-all hover:-translate-y-1"
                style={{
                  backgroundColor: "#FAF6EE",
                  border: "1px solid #D8C9B3",
                  boxShadow: "0 2px 16px rgba(42,36,32,0.07)",
                }}
              >
                <FloralCorner className="absolute top-0 left-0 opacity-70" />
                <FloralCorner className="absolute bottom-0 right-0 rotate-180 opacity-70" />
                <div className="relative z-10">
                  <p className="text-xs mb-2" style={{ color: "#B07A73" }}>
                    {letter.date}
                  </p>
                  <h3
                    className="font-display text-xl font-semibold mb-3"
                    style={{ color: "#2A2420" }}
                  >
                    {letter.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed mb-5 flex-1"
                    style={{ color: "#5A4A42" }}
                  >
                    {letter.excerpt}
                  </p>
                  <button
                    type="button"
                    data-ocid={`letters.read_button.${letter.id}`}
                    onClick={() => setLetterOpen(letter.id)}
                    className="text-xs font-semibold tracking-wide uppercase transition-colors group-hover:underline"
                    style={{ color: "#9C6A64" }}
                  >
                    Read Letter →
                  </button>
                </div>
              </div>
            </FadeSection>
          ))}
        </div>
      </section>

      {/* Letter modal */}
      {activeLetter !== null && (
        <dialog
          open
          aria-modal="true"
          aria-label={activeLetter.title}
          className="fixed inset-0 z-50 m-0 w-full h-full flex items-center justify-center p-4 bg-transparent"
          style={{ maxWidth: "100vw", maxHeight: "100vh" }}
          data-ocid="letters.dialog"
        >
          <button
            type="button"
            aria-label="Close dialog"
            className="absolute inset-0 w-full h-full cursor-default"
            style={{ backgroundColor: "rgba(42,36,32,0.5)", border: "none" }}
            onClick={() => setLetterOpen(null)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-2xl p-8 max-w-lg w-full z-10"
            style={{ backgroundColor: "#FAF6EE", border: "1px solid #D8C9B3" }}
          >
            <FloralCorner className="absolute top-0 left-0 opacity-60" />
            <FloralCorner className="absolute bottom-0 right-0 rotate-180 opacity-60" />
            <div className="relative z-10">
              <p className="text-xs mb-1" style={{ color: "#B07A73" }}>
                {activeLetter.date}
              </p>
              <h3
                className="font-display text-2xl font-bold mb-4"
                style={{ color: "#2A2420" }}
              >
                {activeLetter.title}
              </h3>
              <p
                className="font-display italic leading-relaxed"
                style={{ color: "#4A3830" }}
              >
                {activeLetter.excerpt} With every sunrise, I am reminded of how
                lucky I am to have you in my life, Drithi. You are my sunshine,
                my moonlight, and every star in between. My love for you grows
                deeper with every passing day, and I would choose you again and
                again, in every lifetime, in every world.
              </p>
              <p
                className="mt-4 font-script text-2xl"
                style={{ color: "#9C6A64" }}
              >
                Forever yours ♥
              </p>
              <button
                type="button"
                data-ocid="letters.close_button"
                onClick={() => setLetterOpen(null)}
                className="mt-6 px-6 py-2 rounded-full text-sm font-semibold"
                style={{ backgroundColor: "#B07A73", color: "#FAF6EE" }}
              >
                Close
              </button>
            </div>
          </motion.div>
        </dialog>
      )}

      {/* ===== MEMORIES GALLERY ===== */}
      <section
        id="memories"
        className="py-20 px-4"
        style={{ backgroundColor: "#EEE4D0" }}
      >
        <div className="max-w-7xl mx-auto">
          <FadeSection className="text-center mb-14">
            <p
              className="font-script text-2xl mb-1"
              style={{ color: "#B07A73" }}
            >
              our story in pictures
            </p>
            <h2
              className="font-display text-4xl md:text-5xl font-bold"
              style={{ color: "#2A2420" }}
            >
              Drithi's Memory Gallery
            </h2>
            <div
              className="mx-auto mt-4 w-16 h-0.5"
              style={{ backgroundColor: "#D8C9B3" }}
            />
          </FadeSection>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {memories.map((mem, i) => (
              <FadeSection key={mem.id} delay={i * 0.08}>
                <div
                  data-ocid={`memories.item.${mem.id}`}
                  className="relative rounded-2xl overflow-hidden group cursor-pointer"
                  style={{ paddingBottom: "130%" }}
                >
                  {mem.photo ? (
                    <img
                      src={mem.photo}
                      alt={mem.label}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(135deg, ${mem.bg} 0%, #F3ECDC 100%)`,
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <span className="text-6xl">🌸</span>
                      </div>
                    </>
                  )}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ backgroundColor: "rgba(176,122,115,0.15)" }}
                  />
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: "rgba(243,236,220,0.92)",
                        color: "#9C6A64",
                      }}
                    >
                      {mem.label}
                    </span>
                  </div>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STORY ===== */}
      <section id="story" className="py-20 px-4 max-w-4xl mx-auto text-center">
        <FadeSection>
          <p className="font-script text-2xl mb-1" style={{ color: "#B07A73" }}>
            how it began
          </p>
          <h2
            className="font-display text-4xl md:text-5xl font-bold mb-8"
            style={{ color: "#2A2420" }}
          >
            Our Story
          </h2>
          <div
            className="mx-auto mb-8 w-16 h-0.5"
            style={{ backgroundColor: "#D8C9B3" }}
          />
          <p
            className="font-display italic text-lg leading-relaxed mb-6"
            style={{ color: "#4A3830" }}
          >
            It started with a glance — and somehow, the entire universe
            conspired for us to meet. Every step I took before I knew you was
            leading me to you, Drithi. You walked into my life and everything
            changed: the colors became brighter, the music became sweeter, and
            every ordinary moment became extraordinary.
          </p>
          <p
            className="font-display italic text-lg leading-relaxed"
            style={{ color: "#4A3830" }}
          >
            I cherish every laugh we share, every quiet moment, every adventure
            and every ordinary Tuesday. You are my favorite person in the world,
            and I am grateful for every single day with you.
          </p>
          <p className="mt-8 font-script text-3xl" style={{ color: "#9C6A64" }}>
            — With all my love ♥
          </p>
        </FadeSection>
      </section>

      {/* ===== SHARED MOMENTS ===== */}
      <section
        id="moments"
        className="py-24 px-4"
        style={{ backgroundColor: "#EEE4D0" }}
      >
        <FadeSection className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-6 md:gap-0">
          <div className="hidden md:flex flex-col items-end pr-8">
            <RoseIllustration />
          </div>
          <div className="text-center flex-1 max-w-xl">
            <p className="text-3xl mb-4" style={{ color: "#E7A3A8" }}>
              ❤ ❤ ❤
            </p>
            <blockquote
              className="font-display italic text-xl md:text-2xl leading-relaxed"
              style={{ color: "#2A2420" }}
            >
              &ldquo;In all the world, there is no heart for me like yours. In
              all the world, there is no love for you like mine.&rdquo;
            </blockquote>
            <p
              className="mt-6 font-script text-3xl"
              style={{ color: "#9C6A64" }}
            >
              — Maya Angelou
            </p>
            <p className="text-3xl mt-4" style={{ color: "#E7A3A8" }}>
              ❤ ❤ ❤
            </p>
          </div>
          <div className="hidden md:flex flex-col items-start pl-8">
            <RoseIllustration flip />
          </div>
        </FadeSection>
      </section>

      {/* ===== FOOTER ===== */}
      <footer
        className="py-12 px-4"
        style={{ backgroundColor: "#F3ECDC", borderTop: "1px solid #D8C9B3" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2">
              <span
                className="font-script text-4xl"
                style={{ color: "#9C6A64" }}
              >
                Drithi
              </span>
              <span style={{ color: "#E7A3A8" }}>♥</span>
            </div>
            <p className="text-xs" style={{ color: "#8A7A72" }}>
              A love story worth telling
            </p>
          </div>

          <nav className="flex gap-6 text-sm" aria-label="Footer navigation">
            {["home", "memories", "letters", "story"].map((id) => (
              <button
                type="button"
                key={id}
                data-ocid={`footer.${id}.link`}
                onClick={() => scrollTo(id)}
                className="capitalize transition-colors hover:opacity-70"
                style={{ color: "#6A5A52" }}
              >
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </button>
            ))}
          </nav>

          <p
            className="text-xs text-center md:text-right"
            style={{ color: "#8A7A72" }}
          >
            Made with ♥ for Drithi
            <br />
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Built with love using caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
