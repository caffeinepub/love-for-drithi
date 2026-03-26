import { Slider } from "@/components/ui/slider";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "./backend";
import { useActor } from "./hooks/useActor";

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
}: {
  className?: string;
  flip?: boolean;
}) {
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

const FLOWER_HEART_EMOJIS = [
  "🌸",
  "🌺",
  "🌹",
  "🌷",
  "❤️",
  "💕",
  "💗",
  "💖",
  "💓",
  "🌼",
];
const HEART_EMOJIS = new Set(["❤️", "💕", "💗", "💖", "💓"]);

const PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  emoji: FLOWER_HEART_EMOJIS[i % FLOWER_HEART_EMOJIS.length],
  left: Math.round((i * 2.5 + (i % 7) * 3.1) % 100),
  size: 14 + Math.round((i * 1.7 + (i % 5) * 4.8) % 24),
  duration: 5 + Math.round((i * 0.9 + (i % 6) * 1.5) % 9),
  delay: Math.round((i * 0.8 + (i % 9) * 0.7) % 100) / 10,
  sway: 20 + Math.round((i * 1.3 + (i % 4) * 7) % 40),
  isHeart: HEART_EMOJIS.has(
    FLOWER_HEART_EMOJIS[i % FLOWER_HEART_EMOJIS.length],
  ),
}));

interface BurstParticle {
  id: number;
  x: number;
  y: number;
  angle: number;
  distance: number;
  emoji: string;
}

function PremiumParticles() {
  const [burstParticles, setBurstParticles] = useState<BurstParticle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const containerRef = useRef<HTMLDivElement>(null);
  const burstIdRef = useRef(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  const handleClick = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const newBursts: BurstParticle[] = Array.from({ length: 10 }, (_, i) => ({
      id: burstIdRef.current++,
      x: cx,
      y: cy,
      angle: (i / 10) * Math.PI * 2 + Math.random() * 0.5,
      distance: 60 + Math.random() * 60,
      emoji:
        FLOWER_HEART_EMOJIS[
          Math.floor(Math.random() * FLOWER_HEART_EMOJIS.length)
        ],
    }));
    setBurstParticles((prev) => [...prev, ...newBursts]);
    setTimeout(() => {
      setBurstParticles((prev) =>
        prev.filter((p) => !newBursts.some((b) => b.id === p.id)),
      );
    }, 900);
  };

  const parallaxX = (mousePos.x - 0.5) * 30;
  const parallaxY = (mousePos.y - 0.5) * 15;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-auto"
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      onKeyDown={() => {}}
      role="presentation"
      style={{ zIndex: 2 }}
    >
      {PARTICLES.map((p) => (
        <motion.span
          key={p.id}
          className="absolute select-none pointer-events-none"
          style={{
            left: `${p.left}%`,
            bottom: "-5%",
            fontSize: `${p.size}px`,
            filter: p.isHeart
              ? "drop-shadow(0 0 6px rgba(231,163,168,0.8))"
              : undefined,
            x: parallaxX * (0.3 + (p.id % 5) * 0.15),
            y: parallaxY * (0.2 + (p.id % 4) * 0.1),
          }}
          animate={{
            y: [
              0,
              -(typeof window !== "undefined" ? window.innerHeight : 800) - 100,
            ],
            x: [
              parallaxX * (0.3 + (p.id % 5) * 0.15),
              p.sway + parallaxX,
              parallaxX * (0.3 + (p.id % 5) * 0.15),
              -p.sway + parallaxX,
              parallaxX * (0.3 + (p.id % 5) * 0.15),
            ],
            opacity: [0, 0.9, 0.9, 0],
            scale: p.isHeart ? [1, 1.15, 1, 1.15, 1] : 1,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          {p.emoji}
        </motion.span>
      ))}

      <AnimatePresence>
        {burstParticles.map((bp) => (
          <motion.span
            key={bp.id}
            className="absolute select-none pointer-events-none"
            style={{
              left: bp.x,
              top: bp.y,
              fontSize: "20px",
              translateX: "-50%",
              translateY: "-50%",
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
            animate={{
              x: Math.cos(bp.angle) * bp.distance,
              y: Math.sin(bp.angle) * bp.distance,
              opacity: 0,
              scale: 1.2,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {bp.emoji}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}

type GalleryItem = { id: number; label: string; photoUrl: string; bg: string };

const BG_COLORS = [
  "#f9c5cb",
  "#fde68a",
  "#fbc2cb",
  "#fed7aa",
  "#fce7f3",
  "#d1fae5",
  "#e0e7ff",
  "#fef3c7",
];

const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: 1,
    label: "First Date",
    photoUrl:
      "/assets/uploads/img_5703-019d26f7-da96-73ca-8164-6863235eb7cd-1.jpeg",
    bg: "#f9c5cb",
  },
  {
    id: 2,
    label: "Summer Trip",
    photoUrl:
      "/assets/uploads/img_5707-019d26f7-daea-70a8-9a5f-f155f1811d08-2.jpeg",
    bg: "#fde68a",
  },
  {
    id: 3,
    label: "Your Birthday",
    photoUrl:
      "/assets/uploads/img_5706-019d26f7-dc29-77a1-a860-f70e37a8aac6-3.jpeg",
    bg: "#fbc2cb",
  },
  {
    id: 4,
    label: "Our Adventure",
    photoUrl:
      "/assets/uploads/img_5705-019d26f7-dbf0-76cd-833f-0824d6e6e093-4.jpeg",
    bg: "#fed7aa",
  },
  {
    id: 5,
    label: "Just Us",
    photoUrl:
      "/assets/uploads/image-019d26fe-1c46-708c-a0d7-dc9b5ac06982-1.jpeg",
    bg: "#fce7f3",
  },
];

const GALLERY_KEY = "drithi_gallery";
const CONTENT_KEY = "drithi_content";
const MUSIC_KEY = "drithi_music";

function loadGallery(): GalleryItem[] {
  try {
    const raw = localStorage.getItem(GALLERY_KEY);
    if (raw) return JSON.parse(raw) as GalleryItem[];
  } catch {
    // ignore
  }
  return DEFAULT_GALLERY;
}

function saveGallery(items: GalleryItem[]) {
  try {
    localStorage.setItem(GALLERY_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

type LetterContent = {
  title: string;
  date: string;
  excerpt: string;
  body: string;
};

type AppContent = {
  heroSubtitle: string;
  letters: LetterContent[];
  storyHowItBegan: string;
  storyPara1: string;
  storyPara2: string;
  storyClosing: string;
  quoteText: string;
  quoteAttribution: string;
  gallerySubheading: string;
  lettersSubheading: string;
  galleryItems?: { id: number; label: string; bg: string }[];
};

const DEFAULT_CONTENT: AppContent = {
  heroSubtitle:
    "Every day with you is a blessing.\nThis is my love letter to you, Drithi.",
  letters: [
    {
      title: "The Day I Knew You",
      date: "March 2023",
      excerpt:
        "From the moment I saw you, I knew you were the one I'd been searching for. The world seemed to pause, and all I could see was you...",
      body: "From the moment I saw you, I knew you were the one I'd been searching for. The world seemed to pause, and all I could see was you. With every sunrise, I am reminded of how lucky I am to have you in my life, Drithi. You are my sunshine, my moonlight, and every star in between. My love for you grows deeper with every passing day, and I would choose you again and again, in every lifetime, in every world.",
    },
    {
      title: "The Day I Told I Love You",
      date: "December 28th, 2024",
      excerpt:
        "I love you because you make every moment worth living. Your laugh, your smile, the way your eyes light up when you're excited...",
      body: "I love you because you make every moment worth living. Your laugh, your smile, the way your eyes light up when you're excited — all of it fills my heart with a joy I never knew was possible. That day I told you I love you was the truest thing I've ever said. With every sunrise, I am reminded of how lucky I am to have you in my life, Drithi. You are my sunshine, my moonlight, and every star in between.",
    },
    {
      title: "A Promise to You",
      date: "December 31st, 2024",
      excerpt:
        "I promise to be by your side through every joy and every storm. Through laughter and tears, in sunrise and in dusk...",
      body: "I promise to be by your side through every joy and every storm. Through laughter and tears, in sunrise and in dusk. I promise to hold your hand when the world feels heavy, and to dance with you when the music plays. My love for you grows deeper with every passing day, and I would choose you again and again, in every lifetime, in every world.",
    },
    {
      title: "Forever and Always",
      date: "December 31st, 2024",
      excerpt:
        "No matter where life takes us, my love for you will never waver. You are my home, my peace, my greatest adventure...",
      body: "No matter where life takes us, my love for you will never waver. You are my home, my peace, my greatest adventure. Every moment with you is a gift I cherish endlessly. With every sunrise, I am reminded of how lucky I am to have you in my life, Drithi. You are my sunshine, my moonlight, and every star in between. My love for you grows deeper with every passing day.",
    },
  ],
  storyHowItBegan: "how it began",
  storyPara1:
    "It started with a glance — and somehow, the entire universe conspired for us to meet. Every step I took before I knew you was leading me to you, Drithi. You walked into my life and everything changed: the colors became brighter, the music became sweeter, and every ordinary moment became extraordinary.",
  storyPara2:
    "I cherish every laugh we share, every quiet moment, every adventure and every ordinary Tuesday. You are my favorite person in the world, and I am grateful for every single day with you.",
  storyClosing: "— With all my love ♥",
  quoteText:
    "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.",
  quoteAttribution: "— Maya Angelou",
  gallerySubheading: "our story in pictures",
  lettersSubheading: "with all my heart",
};

function loadContent(): AppContent {
  try {
    const raw = localStorage.getItem(CONTENT_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as Partial<AppContent>;
      return {
        ...DEFAULT_CONTENT,
        ...saved,
        letters: saved.letters ?? DEFAULT_CONTENT.letters,
      };
    }
  } catch {
    // ignore
  }
  return DEFAULT_CONTENT;
}

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
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
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

// ===== MUSIC PLAYER =====
function MusicPlayer() {
  const [expanded, setExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const musicFileRef = useRef<HTMLInputElement>(null);
  const { actor } = useActor();

  useEffect(() => {
    const saved = localStorage.getItem(MUSIC_KEY);
    if (saved) setAudioSrc(saved);
  }, []);

  // Load music from cloud when actor is ready
  useEffect(() => {
    if (!actor) return;
    actor
      .getMusicTrack("background-music")
      .then((track) => {
        if (track) {
          const url = track.audioFile.getDirectURL();
          setAudioSrc(url);
          try {
            localStorage.setItem(MUSIC_KEY, url);
          } catch {
            /* ignore */
          }
        }
      })
      .catch(() => {
        /* ignore */
      });
  }, [actor]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioSrc && audioRef.current) {
      audioRef.current.src = audioSrc;
      audioRef.current.load();
    }
  }, [audioSrc]);

  const fileToUint8Array = (file: File): Promise<Uint8Array> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () =>
        resolve(new Uint8Array(reader.result as ArrayBuffer));
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });

  const handleMusicFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (actor) {
      try {
        toast("Uploading music to cloud...");
        const bytes = await fileToUint8Array(file);
        const blob = ExternalBlob.fromBytes(bytes as Uint8Array<ArrayBuffer>);
        await actor.addMusicTrack("background-music", blob);
        const track = await actor.getMusicTrack("background-music");
        if (track) {
          const url = track.audioFile.getDirectURL();
          setAudioSrc(url);
          try {
            localStorage.setItem(MUSIC_KEY, url);
          } catch {
            /* ignore */
          }
          setIsPlaying(true);
          toast("✅ Music saved to cloud!");
        }
      } catch (err) {
        console.error("Music upload error:", err);
        const msg = err instanceof Error ? err.message : String(err);
        toast(`Failed to upload music: ${msg}`);
      }
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setAudioSrc(dataUrl);
        try {
          localStorage.setItem(MUSIC_KEY, dataUrl);
        } catch {
          /* ignore */
        }
        setIsPlaying(true);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const togglePlay = () => {
    if (!audioSrc) {
      musicFileRef.current?.click();
      return;
    }
    setIsPlaying((p) => !p);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {/* biome-ignore lint/a11y/useMediaCaption: background music player has no speech content */}
      <audio ref={audioRef} loop />
      <input
        ref={musicFileRef}
        type="file"
        accept="audio/mp3,audio/mpeg"
        className="hidden"
        onChange={handleMusicFile}
      />

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="rounded-2xl p-4 flex flex-col gap-3 w-56 shadow-lg"
            style={{ backgroundColor: "#FAF6EE", border: "1px solid #D8C9B3" }}
            data-ocid="music.panel"
          >
            <p className="text-xs font-semibold" style={{ color: "#9C6A64" }}>
              🎵 Background Music
            </p>

            <button
              type="button"
              data-ocid="music.upload_button"
              onClick={() => musicFileRef.current?.click()}
              className="w-full px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:opacity-80 active:scale-95"
              style={{ backgroundColor: "#E7A3A8", color: "#FAF6EE" }}
            >
              📂 Upload MP3
            </button>

            <button
              type="button"
              data-ocid="music.toggle"
              onClick={togglePlay}
              className="w-full px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:opacity-80 active:scale-95"
              style={{
                backgroundColor: isPlaying ? "#B07A73" : "#D8C9B3",
                color: isPlaying ? "#FAF6EE" : "#4A3830",
              }}
            >
              {isPlaying ? "⏸ Pause" : "▶ Play"}
            </button>

            <div className="flex flex-col gap-1">
              <p className="text-xs" style={{ color: "#8A7A72" }}>
                Volume
              </p>
              <Slider
                min={0}
                max={1}
                step={0.01}
                value={[volume]}
                onValueChange={([v]) => setVolume(v ?? 0.7)}
                className="w-full"
              />
            </div>

            {!audioSrc && (
              <p className="text-xs italic" style={{ color: "#B07A73" }}>
                Upload an MP3 to play music 🎶
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        data-ocid="music.button"
        onClick={() => setExpanded((p) => !p)}
        className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg text-xl transition-all hover:scale-105 active:scale-95"
        style={{
          backgroundColor: isPlaying ? "#B07A73" : "#FAF6EE",
          border: "2px solid #D8C9B3",
          color: isPlaying ? "#FAF6EE" : "#B07A73",
        }}
        aria-label="Music player"
      >
        🎵
      </button>
    </div>
  );
}

// ===== EDIT PANEL =====
function EditPanel({
  content,
  onSave,
  onClose,
}: {
  content: AppContent;
  onSave: (c: AppContent) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<AppContent>(() =>
    JSON.parse(JSON.stringify(content)),
  );

  const setField = <K extends keyof AppContent>(
    key: K,
    value: AppContent[K],
  ) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const setLetterField = (
    index: number,
    field: keyof LetterContent,
    value: string,
  ) => {
    setDraft((prev) => {
      const letters = prev.letters.map((l, i) =>
        i === index ? { ...l, [field]: value } : l,
      );
      return { ...prev, letters };
    });
  };

  const handleSave = () => {
    onSave(draft);
    toast("✅ Changes saved!", {
      style: {
        background: "#FAF6EE",
        color: "#9C6A64",
        border: "1px solid #D8C9B3",
      },
    });
    onClose();
  };

  const labelStyle = { color: "#4A3830" } as const;
  const inputStyle = {
    border: "1px solid #D8C9B3",
    backgroundColor: "#FFF9F3",
  } as const;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end"
      data-ocid="edit.modal"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close editor"
        className="absolute inset-0 w-full h-full cursor-default"
        style={{ backgroundColor: "rgba(42,36,32,0.5)", border: "none" }}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative h-full w-full max-w-xl flex flex-col overflow-hidden shadow-2xl"
        style={{ backgroundColor: "#FAF6EE" }}
        data-ocid="edit.panel"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderBottom: "1px solid #D8C9B3" }}
        >
          <h2
            className="font-display text-xl font-bold"
            style={{ color: "#2A2420" }}
          >
            ✏️ Edit App Content
          </h2>
          <button
            type="button"
            data-ocid="edit.close_button"
            onClick={onClose}
            className="text-2xl leading-none"
            style={{ color: "#9C6A64" }}
          >
            ×
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <Tabs defaultValue="hero">
            <TabsList
              className="w-full mb-4 flex flex-wrap gap-1 h-auto"
              style={{ backgroundColor: "#EEE4D0" }}
            >
              <TabsTrigger value="hero" data-ocid="edit.hero.tab">
                Hero
              </TabsTrigger>
              <TabsTrigger value="letters" data-ocid="edit.letters.tab">
                Letters
              </TabsTrigger>
              <TabsTrigger value="story" data-ocid="edit.story.tab">
                Story
              </TabsTrigger>
              <TabsTrigger value="quote" data-ocid="edit.quote.tab">
                Quote
              </TabsTrigger>
              <TabsTrigger value="headings" data-ocid="edit.headings.tab">
                Headings
              </TabsTrigger>
            </TabsList>

            {/* Hero Tab */}
            <TabsContent value="hero" className="flex flex-col gap-4">
              <div>
                <p
                  className="block text-sm font-semibold mb-1"
                  style={labelStyle}
                >
                  Subtitle Text
                </p>
                <Textarea
                  value={draft.heroSubtitle}
                  onChange={(e) => setField("heroSubtitle", e.target.value)}
                  rows={3}
                  data-ocid="edit.hero.textarea"
                  className="w-full rounded-lg text-sm"
                  style={{ borderColor: "#D8C9B3", backgroundColor: "#FFF9F3" }}
                />
              </div>
            </TabsContent>

            {/* Letters Tab */}
            <TabsContent value="letters" className="flex flex-col gap-6">
              {draft.letters.map((letter, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: edit panel letter list
                  key={i}
                  className="flex flex-col gap-3 p-4 rounded-xl"
                  style={{
                    border: "1px solid #D8C9B3",
                    backgroundColor: "#FFF9F3",
                  }}
                >
                  <p
                    className="text-xs font-bold uppercase tracking-wide"
                    style={{ color: "#B07A73" }}
                  >
                    Letter {i + 1}
                  </p>
                  <div>
                    <p
                      className="block text-sm font-semibold mb-1"
                      style={labelStyle}
                    >
                      Title
                    </p>
                    <input
                      type="text"
                      value={letter.title}
                      onChange={(e) =>
                        setLetterField(i, "title", e.target.value)
                      }
                      data-ocid={`edit.letter${i + 1}.input`}
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <p
                      className="block text-sm font-semibold mb-1"
                      style={labelStyle}
                    >
                      Date
                    </p>
                    <input
                      type="text"
                      value={letter.date}
                      onChange={(e) =>
                        setLetterField(i, "date", e.target.value)
                      }
                      data-ocid={`edit.letter${i + 1}date.input`}
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <p
                      className="block text-sm font-semibold mb-1"
                      style={labelStyle}
                    >
                      Preview / Excerpt
                    </p>
                    <Textarea
                      value={letter.excerpt}
                      onChange={(e) =>
                        setLetterField(i, "excerpt", e.target.value)
                      }
                      rows={3}
                      className="w-full rounded-lg text-sm"
                      style={{
                        borderColor: "#D8C9B3",
                        backgroundColor: "#FFF9F3",
                      }}
                    />
                  </div>
                  <div>
                    <p
                      className="block text-sm font-semibold mb-1"
                      style={labelStyle}
                    >
                      Full Letter Body
                    </p>
                    <Textarea
                      value={letter.body}
                      onChange={(e) =>
                        setLetterField(i, "body", e.target.value)
                      }
                      rows={5}
                      className="w-full rounded-lg text-sm"
                      style={{
                        borderColor: "#D8C9B3",
                        backgroundColor: "#FFF9F3",
                      }}
                    />
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* Story Tab */}
            <TabsContent value="story" className="flex flex-col gap-4">
              <div>
                <p
                  className="block text-sm font-semibold mb-1"
                  style={labelStyle}
                >
                  &ldquo;How it began&rdquo; subheading
                </p>
                <input
                  type="text"
                  value={draft.storyHowItBegan}
                  onChange={(e) => setField("storyHowItBegan", e.target.value)}
                  data-ocid="edit.story.input"
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={inputStyle}
                />
              </div>
              <div>
                <p
                  className="block text-sm font-semibold mb-1"
                  style={labelStyle}
                >
                  Paragraph 1
                </p>
                <Textarea
                  value={draft.storyPara1}
                  onChange={(e) => setField("storyPara1", e.target.value)}
                  rows={4}
                  data-ocid="edit.story.para1.textarea"
                  className="w-full rounded-lg text-sm"
                  style={{ borderColor: "#D8C9B3", backgroundColor: "#FFF9F3" }}
                />
              </div>
              <div>
                <p
                  className="block text-sm font-semibold mb-1"
                  style={labelStyle}
                >
                  Paragraph 2
                </p>
                <Textarea
                  value={draft.storyPara2}
                  onChange={(e) => setField("storyPara2", e.target.value)}
                  rows={3}
                  className="w-full rounded-lg text-sm"
                  style={{ borderColor: "#D8C9B3", backgroundColor: "#FFF9F3" }}
                />
              </div>
              <div>
                <p
                  className="block text-sm font-semibold mb-1"
                  style={labelStyle}
                >
                  Closing line
                </p>
                <input
                  type="text"
                  value={draft.storyClosing}
                  onChange={(e) => setField("storyClosing", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={inputStyle}
                />
              </div>
            </TabsContent>

            {/* Quote Tab */}
            <TabsContent value="quote" className="flex flex-col gap-4">
              <div>
                <p
                  className="block text-sm font-semibold mb-1"
                  style={labelStyle}
                >
                  Quote Text
                </p>
                <Textarea
                  value={draft.quoteText}
                  onChange={(e) => setField("quoteText", e.target.value)}
                  rows={4}
                  data-ocid="edit.quote.textarea"
                  className="w-full rounded-lg text-sm"
                  style={{ borderColor: "#D8C9B3", backgroundColor: "#FFF9F3" }}
                />
              </div>
              <div>
                <p
                  className="block text-sm font-semibold mb-1"
                  style={labelStyle}
                >
                  Attribution
                </p>
                <input
                  type="text"
                  value={draft.quoteAttribution}
                  onChange={(e) => setField("quoteAttribution", e.target.value)}
                  data-ocid="edit.quote.attribution.input"
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={inputStyle}
                />
              </div>
            </TabsContent>

            {/* Headings Tab */}
            <TabsContent value="headings" className="flex flex-col gap-4">
              <div>
                <p
                  className="block text-sm font-semibold mb-1"
                  style={labelStyle}
                >
                  Gallery subheading
                </p>
                <input
                  type="text"
                  value={draft.gallerySubheading}
                  onChange={(e) =>
                    setField("gallerySubheading", e.target.value)
                  }
                  data-ocid="edit.gallery.subheading.input"
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={inputStyle}
                />
              </div>
              <div>
                <p
                  className="block text-sm font-semibold mb-1"
                  style={labelStyle}
                >
                  Letters subheading
                </p>
                <input
                  type="text"
                  value={draft.lettersSubheading}
                  onChange={(e) =>
                    setField("lettersSubheading", e.target.value)
                  }
                  data-ocid="edit.letters.subheading.input"
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={inputStyle}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div
          className="px-6 py-4 flex gap-3 shrink-0"
          style={{ borderTop: "1px solid #D8C9B3" }}
        >
          <button
            type="button"
            data-ocid="edit.save_button"
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-full font-semibold text-sm transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: "#B07A73", color: "#FAF6EE" }}
          >
            Save Changes
          </button>
          <button
            type="button"
            data-ocid="edit.cancel_button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full font-semibold text-sm transition-all hover:opacity-80"
            style={{ backgroundColor: "#EEE4D0", color: "#4A3830" }}
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ===== COUNTDOWN SECTION =====
function daysUntilNextBirthday(month: number, day: number): number {
  const today = new Date();
  const thisYear = new Date(today.getFullYear(), month - 1, day);
  const nextYear = new Date(today.getFullYear() + 1, month - 1, day);
  const target = today > thisYear ? nextYear : thisYear;
  return Math.max(
    0,
    Math.floor((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
  );
}

function CountdownSection() {
  const anniversary = new Date("2024-12-31");
  const today = new Date();
  const daysTogether = Math.max(
    0,
    Math.floor(
      (today.getTime() - anniversary.getTime()) / (1000 * 60 * 60 * 24),
    ),
  );
  const mehulBday = daysUntilNextBirthday(8, 25);
  const drithiBday = daysUntilNextBirthday(12, 18);

  const cards = [
    {
      emoji: "💑",
      label: "Days Together",
      value: daysTogether,
      sublabel: "since 31 Dec 2024",
      color: "#9C6A64",
    },
    {
      emoji: "🎂",
      label: "Mehul's Birthday",
      value: mehulBday,
      sublabel: "days to go · 25 Aug",
      color: "#B07A73",
    },
    {
      emoji: "🎀",
      label: "Drithi's Birthday",
      value: drithiBday,
      sublabel: "days to go · 18 Dec",
      color: "#9C6A64",
    },
  ];

  return (
    <section
      id="countdown"
      className="py-16 px-4"
      style={{ backgroundColor: "#FAF6EE" }}
    >
      <div className="max-w-4xl mx-auto">
        <FadeSection className="text-center mb-10">
          <p className="font-script text-2xl mb-1" style={{ color: "#B07A73" }}>
            our milestones
          </p>
          <h2
            className="font-display text-4xl md:text-5xl font-bold"
            style={{ color: "#2A2420" }}
          >
            Counting Every Moment
          </h2>
          <div
            className="mx-auto mt-4 w-16 h-0.5"
            style={{ backgroundColor: "#D8C9B3" }}
          />
        </FadeSection>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <FadeSection key={card.label} delay={i * 0.12}>
              <div
                data-ocid={`countdown.item.${i + 1}`}
                className="relative rounded-3xl p-8 text-center overflow-hidden"
                style={{
                  backgroundColor: "#FFF9F3",
                  border: "1px solid #D8C9B3",
                  boxShadow: "0 4px 20px rgba(42,36,32,0.07)",
                }}
              >
                <FloralCorner className="absolute top-0 left-0 opacity-40" />
                <FloralCorner className="absolute bottom-0 right-0 rotate-180 opacity-40" />
                <div className="relative z-10">
                  <div className="text-4xl mb-3">{card.emoji}</div>
                  <div
                    className="font-display text-6xl font-bold mb-1"
                    style={{ color: card.color }}
                  >
                    {card.value}
                  </div>
                  <div
                    className="font-display text-sm font-semibold uppercase tracking-wider mb-1"
                    style={{ color: "#2A2420" }}
                  >
                    {card.label}
                  </div>
                  <div className="text-xs italic" style={{ color: "#8A7A72" }}>
                    {card.sublabel}
                  </div>
                </div>
              </div>
            </FadeSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== SLIDESHOW =====
function Slideshow({
  gallery,
  onClose,
}: {
  gallery: GalleryItem[];
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const validGallery = gallery.filter((g) => g.photoUrl);

  const goNext = useCallback(() => {
    setIdx((prev) => (prev + 1) % validGallery.length);
  }, [validGallery.length]);

  const goPrev = useCallback(() => {
    setIdx((prev) => (prev - 1 + validGallery.length) % validGallery.length);
  }, [validGallery.length]);

  useEffect(() => {
    if (playing && validGallery.length > 1) {
      intervalRef.current = setInterval(goNext, 3000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, goNext, validGallery.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, goNext, goPrev]);

  if (validGallery.length === 0) return null;
  const current = validGallery[idx];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      data-ocid="slideshow.modal"
    >
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(10,5,5,0.94)" }}
      />
      {/* Close */}
      <button
        type="button"
        data-ocid="slideshow.close_button"
        onClick={onClose}
        className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold transition-all hover:scale-105"
        style={{ backgroundColor: "rgba(176,122,115,0.9)", color: "white" }}
        aria-label="Close slideshow"
      >
        ×
      </button>
      {/* Prev */}
      <button
        type="button"
        data-ocid="slideshow.pagination_prev"
        onClick={(e) => {
          e.stopPropagation();
          goPrev();
        }}
        className="absolute left-4 z-20 w-11 h-11 rounded-full flex items-center justify-center text-2xl transition-all hover:scale-105"
        style={{ backgroundColor: "rgba(176,122,115,0.85)", color: "white" }}
        aria-label="Previous"
      >
        ‹
      </button>
      {/* Next */}
      <button
        type="button"
        data-ocid="slideshow.pagination_next"
        onClick={(e) => {
          e.stopPropagation();
          goNext();
        }}
        className="absolute right-4 z-20 w-11 h-11 rounded-full flex items-center justify-center text-2xl transition-all hover:scale-105"
        style={{ backgroundColor: "rgba(176,122,115,0.85)", color: "white" }}
        aria-label="Next"
      >
        ›
      </button>
      {/* Play/Pause */}
      <button
        type="button"
        data-ocid="slideshow.toggle"
        onClick={() => setPlaying((p) => !p)}
        className="absolute bottom-16 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all hover:scale-105"
        style={{ backgroundColor: "rgba(176,122,115,0.85)", color: "white" }}
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? "⏸" : "▶"}
      </button>
      {/* Photo */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex flex-col items-center gap-4 px-16 max-w-4xl w-full"
        >
          <img
            src={current.photoUrl}
            alt={current.label}
            className="rounded-2xl object-contain"
            style={{ maxHeight: "75vh", maxWidth: "100%" }}
          />
          <span
            className="px-4 py-1 rounded-full text-sm font-semibold"
            style={{ backgroundColor: "rgba(176,122,115,0.9)", color: "white" }}
          >
            {current.label}
          </span>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
            {idx + 1} / {validGallery.length}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ===== LIGHTBOX =====
function Lightbox({
  photo,
  gallery,
  onClose,
  onNav,
}: {
  photo: GalleryItem;
  gallery: GalleryItem[];
  onClose: () => void;
  onNav: (item: GalleryItem) => void;
}) {
  const idx = gallery.findIndex((g) => g.id === photo.id);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && idx > 0) onNav(gallery[idx - 1]);
      if (e.key === "ArrowRight" && idx < gallery.length - 1)
        onNav(gallery[idx + 1]);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [idx, gallery, onClose, onNav]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      data-ocid="lightbox.modal"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close lightbox"
        className="absolute inset-0 w-full h-full cursor-default"
        style={{ backgroundColor: "rgba(10,5,5,0.92)", border: "none" }}
        onClick={onClose}
      />

      {/* Close */}
      <button
        type="button"
        data-ocid="lightbox.close_button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold transition-all hover:scale-105"
        style={{ backgroundColor: "rgba(176,122,115,0.9)", color: "white" }}
        aria-label="Close"
      >
        ×
      </button>

      {/* Prev */}
      {idx > 0 && (
        <button
          type="button"
          data-ocid="lightbox.pagination_prev"
          onClick={(e) => {
            e.stopPropagation();
            onNav(gallery[idx - 1]);
          }}
          className="absolute left-4 z-10 w-11 h-11 rounded-full flex items-center justify-center text-xl transition-all hover:scale-105"
          style={{ backgroundColor: "rgba(176,122,115,0.85)", color: "white" }}
          aria-label="Previous photo"
        >
          ‹
        </button>
      )}

      {/* Next */}
      {idx < gallery.length - 1 && (
        <button
          type="button"
          data-ocid="lightbox.pagination_next"
          onClick={(e) => {
            e.stopPropagation();
            onNav(gallery[idx + 1]);
          }}
          className="absolute right-4 z-10 w-11 h-11 rounded-full flex items-center justify-center text-xl transition-all hover:scale-105"
          style={{ backgroundColor: "rgba(176,122,115,0.85)", color: "white" }}
          aria-label="Next photo"
        >
          ›
        </button>
      )}

      {/* Image */}
      <motion.div
        key={photo.id}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 flex flex-col items-center gap-3 px-16"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.photoUrl}
          alt={photo.label}
          className="max-w-3xl w-full rounded-2xl object-contain shadow-2xl"
          style={{ maxHeight: "85vh" }}
        />
        <span
          className="px-4 py-1 rounded-full text-sm font-semibold"
          style={{ backgroundColor: "rgba(176,122,115,0.9)", color: "white" }}
        >
          {photo.label}
        </span>
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
          {idx + 1} / {gallery.length}
        </span>
      </motion.div>
    </div>
  );
}

// ===== MAIN APP =====
export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [letterOpen, setLetterOpen] = useState<number | null>(null);
  const [gallery, setGallery] = useState<GalleryItem[]>(loadGallery);
  const [editMode, setEditMode] = useState(false);
  const [editingLabelId, setEditingLabelId] = useState<number | null>(null);
  const [labelDraft, setLabelDraft] = useState("");
  const [lightboxPhoto, setLightboxPhoto] = useState<GalleryItem | null>(null);
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [content, setContent] = useState<AppContent>(loadContent);
  const [showSlideshowMode, setShowSlideshowMode] = useState(false);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [pinValue, setPinValue] = useState("");
  const [pinError, setPinError] = useState(false);

  const { actor } = useActor();

  useEffect(() => {
    actorRef.current = actor;
  }, [actor]);

  const titleClickCount = useRef(0);
  const titleClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentRef = useRef<AppContent>(loadContent());
  const actorRef = useRef<typeof actor>(null);
  const addFileRef = useRef<HTMLInputElement>(null);
  const replaceFileRef = useRef<HTMLInputElement>(null);
  const replaceTargetId = useRef<number | null>(null);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: "home", label: "Home" },
    { id: "countdown", label: "Milestones" },
    { id: "letters", label: "Love Letters" },
    { id: "memories", label: "Memories Gallery" },
    { id: "story", label: "Story" },
    { id: "moments", label: "Shared Moments" },
  ];

  // Load photos and music from cloud on mount / actor ready
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally run only when actor changes
  useEffect(() => {
    if (!actor) return;
    (async () => {
      // Step 1: Load app content from cloud first
      let cloudGalleryItems: { id: number; label: string; bg: string }[] = [];
      try {
        const cloudContent = await actor.getAppContent();
        if (cloudContent) {
          const parsed = JSON.parse(cloudContent) as Partial<AppContent>;
          const merged = {
            ...DEFAULT_CONTENT,
            ...parsed,
            letters: parsed.letters ?? DEFAULT_CONTENT.letters,
          };
          setContent(merged);
          contentRef.current = merged;
          try {
            localStorage.setItem(CONTENT_KEY, JSON.stringify(merged));
          } catch {
            /* ignore */
          }
          if (parsed.galleryItems && parsed.galleryItems.length > 0) {
            cloudGalleryItems = parsed.galleryItems;
          }
        }
      } catch {
        /* ignore */
      }

      // Step 2: Apply gallery metadata from cloud, then fetch photos by ID
      setGallery((prev) => {
        const base =
          cloudGalleryItems.length > 0
            ? prev.map((item) => {
                const meta = cloudGalleryItems.find((m) => m.id === item.id);
                if (meta) return { ...item, label: meta.label, bg: meta.bg };
                return item;
              })
            : prev;
        // Save merged metadata locally
        try {
          localStorage.setItem(GALLERY_KEY, JSON.stringify(base));
        } catch {
          /* ignore */
        }
        return base;
      });

      // Step 3: Fetch photos by ID (not label)
      setGallery((prev) => {
        const base = [...prev];
        (async () => {
          const updated = await Promise.all(
            base.map(async (item) => {
              try {
                const photo = await actor.getPhoto(String(item.id));
                if (photo) {
                  return {
                    ...item,
                    photoUrl: photo.galleryImage.getDirectURL(),
                  };
                }
              } catch {
                /* ignore */
              }
              return item;
            }),
          );
          setGallery(updated);
          try {
            localStorage.setItem(GALLERY_KEY, JSON.stringify(updated));
          } catch {
            /* ignore */
          }
        })();
        return base;
      });

      // Step 4: Load background music from cloud
      try {
        const track = await actor.getMusicTrack("background-music");
        if (track) {
          const url = track.audioFile.getDirectURL();
          try {
            localStorage.setItem(MUSIC_KEY, url);
          } catch {
            /* ignore */
          }
        }
      } catch {
        /* ignore */
      }
    })();
  }, [actor]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightboxPhoto) {
          setLightboxPhoto(null);
          return;
        }
        setLetterOpen(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxPhoto]);

  const activeLetter =
    letterOpen !== null ? (content.letters[letterOpen - 1] ?? null) : null;

  const updateGallery = useCallback((items: GalleryItem[]) => {
    setGallery(items);
    saveGallery(items);
    // Sync gallery metadata to cloud
    const currentActor = actorRef.current;
    if (currentActor) {
      const galleryMeta = items.map(({ id, label, bg }) => ({ id, label, bg }));
      const updatedContent = {
        ...contentRef.current,
        galleryItems: galleryMeta,
      };
      currentActor
        .saveAppContent(JSON.stringify(updatedContent))
        .catch((err) => {
          console.error("Cloud gallery sync failed:", err);
        });
    }
  }, []);

  const handleTitleClick = () => {
    titleClickCount.current += 1;
    if (titleClickTimer.current) clearTimeout(titleClickTimer.current);
    titleClickTimer.current = setTimeout(() => {
      titleClickCount.current = 0;
    }, 600);
    if (titleClickCount.current >= 3) {
      titleClickCount.current = 0;
      if (titleClickTimer.current) clearTimeout(titleClickTimer.current);
      setEditMode((prev) => {
        const next = !prev;
        toast(
          next
            ? "✏️ Edit mode on — triple-click title to exit"
            : "✅ Edit mode off",
          {
            style: {
              background: "#FAF6EE",
              color: "#9C6A64",
              border: "1px solid #D8C9B3",
            },
          },
        );
        return next;
      });
    }
  };

  const removeMemory = (id: number) => {
    updateGallery(gallery.filter((g) => g.id !== id));
  };

  const startReplacePhoto = (id: number) => {
    replaceTargetId.current = id;
    replaceFileRef.current?.click();
  };

  const fileToUint8Array = (file: File): Promise<Uint8Array> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () =>
        resolve(new Uint8Array(reader.result as ArrayBuffer));
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });

  const handleReplaceFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || replaceTargetId.current === null) return;
    const targetId = replaceTargetId.current;
    const targetItem = gallery.find((g) => g.id === targetId);
    try {
      if (actor && targetItem) {
        toast("Uploading photo to cloud...");
        const bytes = await fileToUint8Array(file);
        const blob = ExternalBlob.fromBytes(bytes as Uint8Array<ArrayBuffer>);
        await actor.addPhoto(String(targetId), blob);
        const photo = await actor.getPhoto(String(targetId));
        const photoUrl = photo
          ? photo.galleryImage.getDirectURL()
          : URL.createObjectURL(file);
        updateGallery(
          gallery.map((g) => (g.id === targetId ? { ...g, photoUrl } : g)),
        );
        toast("✅ Photo saved to cloud!");
      } else {
        // Fallback to local
        const reader = new FileReader();
        reader.onload = () => {
          updateGallery(
            gallery.map((g) =>
              g.id === targetId
                ? { ...g, photoUrl: reader.result as string }
                : g,
            ),
          );
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error("Photo upload error:", err);
      const msg = err instanceof Error ? err.message : String(err);
      toast(`Failed to upload photo: ${msg}`);
    }
    e.target.value = "";
    replaceTargetId.current = null;
  };

  const handleAddFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const label =
      window.prompt("Enter a label for this memory:", "Our Moment") ??
      "Our Moment";
    try {
      const newId = Math.max(0, ...gallery.map((g) => g.id)) + 1;
      const bg = BG_COLORS[gallery.length % BG_COLORS.length];
      if (actor) {
        toast("Uploading photo to cloud...");
        const bytes = await fileToUint8Array(file);
        const blob = ExternalBlob.fromBytes(bytes as Uint8Array<ArrayBuffer>);
        await actor.addPhoto(String(newId), blob);
        const photo = await actor.getPhoto(String(newId));
        const photoUrl = photo
          ? photo.galleryImage.getDirectURL()
          : URL.createObjectURL(file);
        updateGallery([...gallery, { id: newId, label, photoUrl, bg }]);
        toast("✅ Photo saved to cloud!");
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          updateGallery([
            ...gallery,
            { id: newId, label, photoUrl: reader.result as string, bg },
          ]);
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error("Add photo error:", err);
      const msg = err instanceof Error ? err.message : String(err);
      toast(`Failed to upload photo: ${msg}`);
    }
    e.target.value = "";
  };

  const startEditLabel = (item: GalleryItem) => {
    setEditingLabelId(item.id);
    setLabelDraft(item.label);
  };

  const saveLabel = (id: number) => {
    updateGallery(
      gallery.map((g) => (g.id === id ? { ...g, label: labelDraft } : g)),
    );
    setEditingLabelId(null);
  };

  const handleSaveContent = (updated: AppContent) => {
    setContent(updated);
    contentRef.current = updated;
    try {
      localStorage.setItem(CONTENT_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    if (actor) {
      actor.saveAppContent(JSON.stringify(updated)).catch((err) => {
        console.error("Cloud content save failed:", err);
      });
    }
  };

  const handlePhotoClick = (item: GalleryItem) => {
    if (!editMode) setLightboxPhoto(item);
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#F3ECDC", color: "#2A2420" }}
    >
      <Toaster />

      {/* Hidden file inputs */}
      <input
        ref={replaceFileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleReplaceFile}
      />
      <input
        ref={addFileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAddFile}
      />

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

        <PremiumParticles />

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
              {content.heroSubtitle.split("\n").map((line, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static subtitle lines
                <span key={i}>
                  {line}
                  {i < content.heroSubtitle.split("\n").length - 1 && <br />}
                </span>
              ))}
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

      {/* ===== COUNTDOWN ===== */}
      <CountdownSection />

      {/* ===== LOVE LETTERS ===== */}
      <section id="letters" className="py-20 px-4 max-w-7xl mx-auto">
        <FadeSection className="text-center mb-14">
          <p className="font-script text-2xl mb-1" style={{ color: "#B07A73" }}>
            {content.lettersSubheading}
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
          {content.letters.map((letter, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static letters list
            <FadeSection key={i} delay={i * 0.1}>
              <div
                data-ocid={`letters.item.${i + 1}`}
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
                    data-ocid={`letters.read_button.${i + 1}`}
                    onClick={() => setLetterOpen(i + 1)}
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
                {activeLetter.body}
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
          <FadeSection className="text-center mb-6">
            <p
              className="font-script text-2xl mb-1"
              style={{ color: "#B07A73" }}
            >
              {content.gallerySubheading}
            </p>
            <h2
              className="font-display text-4xl md:text-5xl font-bold cursor-pointer select-none"
              style={{ color: "#2A2420" }}
              onClick={handleTitleClick}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleTitleClick();
              }}
              title="Triple-click to toggle edit mode"
            >
              Drithi&apos;s Memory Gallery
            </h2>
            <div
              className="mx-auto mt-4 w-16 h-0.5"
              style={{ backgroundColor: "#D8C9B3" }}
            />
          </FadeSection>

          <AnimatePresence>
            {editMode && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="text-center mb-8"
              >
                <span
                  className="inline-block px-4 py-2 rounded-full text-sm font-semibold"
                  style={{ backgroundColor: "#fbc2cb", color: "#9C6A64" }}
                  data-ocid="memories.edit_mode.panel"
                >
                  ✏️ Edit mode — triple-click title to exit
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-end mb-4">
            <button
              type="button"
              data-ocid="memories.slideshow.button"
              onClick={() => setShowSlideshowMode(true)}
              className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
              style={{
                backgroundColor: "#B07A73",
                color: "#FAF6EE",
                boxShadow: "0 2px 12px rgba(176,122,115,0.25)",
              }}
            >
              ▶ Slideshow
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            {gallery.map((mem, i) => (
              <FadeSection key={mem.id} delay={i * 0.08}>
                <div
                  data-ocid={`memories.item.${i + 1}`}
                  className="relative rounded-2xl overflow-hidden group cursor-pointer"
                  style={{ paddingBottom: "130%" }}
                  onClick={() => handlePhotoClick(mem)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      handlePhotoClick(mem);
                  }}
                  // biome-ignore lint/a11y/useSemanticElements: complex gallery card with overlapping controls
                  role="button"
                  tabIndex={editMode ? -1 : 0}
                >
                  {mem.photoUrl ? (
                    <img
                      src={mem.photoUrl}
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

                  {editMode && (
                    <>
                      <button
                        type="button"
                        data-ocid={`memories.delete_button.${i + 1}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeMemory(mem.id);
                        }}
                        className="absolute top-2 right-2 z-20 w-7 h-7 flex items-center justify-center rounded-full text-white font-bold text-sm shadow transition-transform hover:scale-110"
                        style={{ backgroundColor: "rgba(200,50,50,0.85)" }}
                        aria-label="Remove photo"
                      >
                        ×
                      </button>
                      <button
                        type="button"
                        data-ocid={`memories.edit_button.${i + 1}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          startReplacePhoto(mem.id);
                        }}
                        className="absolute top-2 left-2 z-20 w-7 h-7 flex items-center justify-center rounded-full text-white text-sm shadow transition-transform hover:scale-110"
                        style={{ backgroundColor: "rgba(176,122,115,0.85)" }}
                        aria-label="Replace photo"
                      >
                        📷
                      </button>
                    </>
                  )}

                  <div className="absolute bottom-3 left-0 right-0 flex justify-center z-10">
                    {editMode && editingLabelId === mem.id ? (
                      <input
                        type="text"
                        value={labelDraft}
                        data-ocid="memories.input"
                        className="px-2 py-0.5 rounded-full text-xs font-semibold text-center outline-none"
                        style={{
                          backgroundColor: "rgba(243,236,220,0.96)",
                          color: "#9C6A64",
                          border: "1px solid #B07A73",
                          maxWidth: "90%",
                        }}
                        onChange={(e) => setLabelDraft(e.target.value)}
                        onBlur={() => saveLabel(mem.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveLabel(mem.id);
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span
                        role={editMode ? "button" : undefined}
                        tabIndex={editMode ? 0 : undefined}
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: "rgba(243,236,220,0.92)",
                          color: "#9C6A64",
                          cursor: editMode ? "text" : "default",
                        }}
                        onClick={(e) => {
                          if (editMode) {
                            e.stopPropagation();
                            startEditLabel(mem);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (
                            editMode &&
                            (e.key === "Enter" || e.key === " ")
                          ) {
                            e.stopPropagation();
                            startEditLabel(mem);
                          }
                        }}
                      >
                        {mem.label}
                      </span>
                    )}
                  </div>
                </div>
              </FadeSection>
            ))}

            {editMode && (
              <FadeSection delay={gallery.length * 0.08}>
                <button
                  type="button"
                  data-ocid="memories.upload_button"
                  onClick={() => addFileRef.current?.click()}
                  className="relative rounded-2xl w-full flex flex-col items-center justify-center gap-2 transition-all hover:opacity-80 active:scale-95 border-2 border-dashed"
                  style={{
                    paddingBottom: "130%",
                    borderColor: "#B07A73",
                    backgroundColor: "rgba(176,122,115,0.07)",
                  }}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <span className="text-3xl" style={{ color: "#B07A73" }}>
                      +
                    </span>
                    <span
                      className="text-xs font-semibold"
                      style={{ color: "#B07A73" }}
                    >
                      Add Memory
                    </span>
                  </div>
                </button>
              </FadeSection>
            )}
          </div>
        </div>
      </section>

      {/* ===== STORY ===== */}
      <section id="story" className="py-20 px-4 max-w-4xl mx-auto text-center">
        <FadeSection>
          <p className="font-script text-2xl mb-1" style={{ color: "#B07A73" }}>
            {content.storyHowItBegan}
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
            {content.storyPara1}
          </p>
          <p
            className="font-display italic text-lg leading-relaxed"
            style={{ color: "#4A3830" }}
          >
            {content.storyPara2}
          </p>
          <p className="mt-8 font-script text-3xl" style={{ color: "#9C6A64" }}>
            {content.storyClosing}
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
              &ldquo;{content.quoteText}&rdquo;
            </blockquote>
            <p
              className="mt-6 font-script text-3xl"
              style={{ color: "#9C6A64" }}
            >
              {content.quoteAttribution}
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
          </p>
        </div>
      </footer>

      {/* ===== LIGHTBOX ===== */}
      <AnimatePresence>
        {lightboxPhoto && (
          <Lightbox
            photo={lightboxPhoto}
            gallery={gallery}
            onClose={() => setLightboxPhoto(null)}
            onNav={setLightboxPhoto}
          />
        )}
      </AnimatePresence>

      {/* ===== EDIT PANEL ===== */}
      <AnimatePresence>
        {showEditPanel && (
          <EditPanel
            content={content}
            onSave={handleSaveContent}
            onClose={() => setShowEditPanel(false)}
          />
        )}
      </AnimatePresence>

      {/* ===== FLOATING EDIT BUTTON ===== */}
      <button
        type="button"
        data-ocid="edit.open_modal_button"
        onClick={() => {
          setPinValue("");
          setPinError(false);
          setShowPinDialog(true);
        }}
        title="Edit app content"
        className="fixed bottom-6 left-6 z-40 w-12 h-12 rounded-full flex items-center justify-center shadow-lg text-xl transition-all hover:scale-105 active:scale-95"
        style={{
          backgroundColor: "#FAF6EE",
          border: "2px solid #D8C9B3",
          color: "#B07A73",
        }}
        aria-label="Edit content"
      >
        ✏️
      </button>

      {/* ===== MUSIC PLAYER ===== */}
      <MusicPlayer />

      {/* ===== SLIDESHOW ===== */}
      <AnimatePresence>
        {showSlideshowMode && (
          <Slideshow
            gallery={gallery}
            onClose={() => setShowSlideshowMode(false)}
          />
        )}
      </AnimatePresence>

      {/* ===== PIN DIALOG ===== */}
      <AnimatePresence>
        {showPinDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(42,36,32,0.6)" }}
            data-ocid="pin.dialog"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="rounded-3xl p-8 flex flex-col items-center gap-5 w-full max-w-xs shadow-2xl"
              style={{
                backgroundColor: "#FAF6EE",
                border: "1px solid #D8C9B3",
              }}
            >
              <div className="text-4xl">🔐</div>
              <h3
                className="font-display text-xl font-bold"
                style={{ color: "#2A2420" }}
              >
                Enter PIN
              </h3>
              <p className="text-sm text-center" style={{ color: "#8A7A72" }}>
                Enter your 4-digit PIN to edit app content
              </p>
              <input
                type="password"
                maxLength={4}
                value={pinValue}
                data-ocid="pin.input"
                onChange={(e) => {
                  setPinValue(e.target.value);
                  setPinError(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (pinValue === "5802") {
                      setShowPinDialog(false);
                      setShowEditPanel(true);
                    } else {
                      setPinError(true);
                      setPinValue("");
                    }
                  }
                }}
                className="w-full text-center text-2xl tracking-widest px-4 py-3 rounded-xl outline-none"
                style={{
                  border: pinError ? "2px solid #C0392B" : "2px solid #D8C9B3",
                  backgroundColor: "#FFF9F3",
                  color: "#2A2420",
                  letterSpacing: "0.5em",
                }}
                placeholder="••••"
                // biome-ignore lint/a11y/noAutofocus: PIN dialog should focus input automatically
                autoFocus
              />
              {pinError && (
                <p
                  data-ocid="pin.error_state"
                  className="text-sm font-semibold"
                  style={{ color: "#C0392B" }}
                >
                  Incorrect PIN. Try again.
                </p>
              )}
              <div className="flex gap-3 w-full">
                <button
                  type="button"
                  data-ocid="pin.confirm_button"
                  onClick={() => {
                    if (pinValue === "5802") {
                      setShowPinDialog(false);
                      setShowEditPanel(true);
                    } else {
                      setPinError(true);
                      setPinValue("");
                    }
                  }}
                  className="flex-1 py-2.5 rounded-full font-semibold text-sm transition-all hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: "#B07A73", color: "#FAF6EE" }}
                >
                  Confirm
                </button>
                <button
                  type="button"
                  data-ocid="pin.cancel_button"
                  onClick={() => {
                    setShowPinDialog(false);
                    setPinValue("");
                    setPinError(false);
                  }}
                  className="px-5 py-2.5 rounded-full font-semibold text-sm transition-all hover:opacity-80"
                  style={{ backgroundColor: "#EEE4D0", color: "#4A3830" }}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
