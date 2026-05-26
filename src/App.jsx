import { useState, useRef, useEffect } from "react";

// ─── Data ───────────────────────────────────────────────────────────────────

const LANGUAGES = ["English","German"];

const LEVELS = [
  { value:"A1", label:"A1 – Beginner", desc:"Basic phrases & expressions" },
  { value:"A2", label:"A2 – Elementary", desc:"Everyday situations" },
  { value:"B1", label:"B1 – Intermediate", desc:"Main points of familiar topics" },
  { value:"B2", label:"B2 – Upper Intermediate", desc:"Complex texts & discussions" },
  { value:"C1", label:"C1 – Advanced", desc:"Fluent & spontaneous expression" },
  { value:"C2", label:"C2 – Mastery", desc:"Near-native proficiency" },
];

const EXERCISE_TYPES = [
  { value:"fill-in-the-blank", label:"Fill in the Blank", icon:"✏️", desc:"Complete sentences with the correct word" },
  { value:"matching",          label:"Match Words",       icon:"🔗", desc:"Connect words with their meanings" },
  { value:"reading",           label:"Reading",           icon:"📖", desc:"Read passages and answer questions" },
  { value:"placement-test",   label:"Find Your Level",   icon:"🎯", desc:"Quick test to discover your CEFR level" },
];

const TOPICS = [
  { value:"personality",      label:"Personality",     icon:"🪞" },
  { value:"sustainability",   label:"Sustainability",   icon:"🌱" },
  { value:"mobility",         label:"Mobility",        icon:"🚲" },
  { value:"sports",           label:"Sports",          icon:"⚽" },
  { value:"professional-life",label:"Professional Life",icon:"💼" },
  { value:"food-culture",     label:"Food & Culture",  icon:"🍽️" },
  { value:"technology",       label:"Technology",      icon:"💻" },
  { value:"health",           label:"Health",          icon:"🧘" },
  { value:"relationships",    label:"Relationships",   icon:"🤝" },
  { value:"travel",           label:"Travel",          icon:"✈️" },
];

// ─── Artikel Game Data (German only) ────────────────────────────────────────

const ARTIKEL_LEVELS = [
  // A1 - Level 1 & 2: everyday objects, body parts, family
  {
    id: 1, difficulty: "A1", label: "Everyday Objects I",
    words: [
      { word: "Tisch",    artikel: "der", meaning: "table" },
      { word: "Stuhl",    artikel: "der", meaning: "chair" },
      { word: "Buch",     artikel: "das", meaning: "book" },
      { word: "Tür",      artikel: "die", meaning: "door" },
      { word: "Fenster",  artikel: "das", meaning: "window" },
      { word: "Lampe",    artikel: "die", meaning: "lamp" },
      { word: "Bett",     artikel: "das", meaning: "bed" },
      { word: "Küche",    artikel: "die", meaning: "kitchen" },
      { word: "Haus",     artikel: "das", meaning: "house" },
      { word: "Garten",   artikel: "der", meaning: "garden" },
    ]
  },
  {
    id: 2, difficulty: "A1", label: "Family & People",
    words: [
      { word: "Vater",    artikel: "der", meaning: "father" },
      { word: "Mutter",   artikel: "die", meaning: "mother" },
      { word: "Kind",     artikel: "das", meaning: "child" },
      { word: "Bruder",   artikel: "der", meaning: "brother" },
      { word: "Schwester",artikel: "die", meaning: "sister" },
      { word: "Mann",     artikel: "der", meaning: "man/husband" },
      { word: "Frau",     artikel: "die", meaning: "woman/wife" },
      { word: "Freund",   artikel: "der", meaning: "friend (male)" },
      { word: "Mädchen",  artikel: "das", meaning: "girl" },
      { word: "Junge",    artikel: "der", meaning: "boy" },
    ]
  },
  // A2 - Level 3 & 4: food, transport
  {
    id: 3, difficulty: "A2", label: "Food & Drinks",
    words: [
      { word: "Brot",     artikel: "das", meaning: "bread" },
      { word: "Milch",    artikel: "die", meaning: "milk" },
      { word: "Kaffee",   artikel: "der", meaning: "coffee" },
      { word: "Wasser",   artikel: "das", meaning: "water" },
      { word: "Suppe",    artikel: "die", meaning: "soup" },
      { word: "Kuchen",   artikel: "der", meaning: "cake" },
      { word: "Fleisch",  artikel: "das", meaning: "meat" },
      { word: "Gemüse",   artikel: "das", meaning: "vegetables" },
      { word: "Flasche",  artikel: "die", meaning: "bottle" },
      { word: "Tasse",    artikel: "die", meaning: "cup" },
    ]
  },
  {
    id: 4, difficulty: "A2", label: "Transport & Places",
    words: [
      { word: "Bus",      artikel: "der", meaning: "bus" },
      { word: "Zug",      artikel: "der", meaning: "train" },
      { word: "Auto",     artikel: "das", meaning: "car" },
      { word: "Fahrrad",  artikel: "das", meaning: "bicycle" },
      { word: "Flugzeug", artikel: "das", meaning: "airplane" },
      { word: "Straße",   artikel: "die", meaning: "street" },
      { word: "Bahnhof",  artikel: "der", meaning: "train station" },
      { word: "Flughafen",artikel: "der", meaning: "airport" },
      { word: "Brücke",   artikel: "die", meaning: "bridge" },
      { word: "Stadt",    artikel: "die", meaning: "city" },
    ]
  },
  // B1 - Level 5 & 6: work, nature
  {
    id: 5, difficulty: "B1", label: "Work & Office",
    words: [
      { word: "Büro",       artikel: "das", meaning: "office" },
      { word: "Besprechung",artikel: "die", meaning: "meeting" },
      { word: "Vertrag",    artikel: "der", meaning: "contract" },
      { word: "Gehalt",     artikel: "das", meaning: "salary" },
      { word: "Kollege",    artikel: "der", meaning: "colleague (male)" },
      { word: "Bewerbung",  artikel: "die", meaning: "application" },
      { word: "Aufgabe",    artikel: "die", meaning: "task" },
      { word: "Ergebnis",   artikel: "das", meaning: "result" },
      { word: "Bericht",    artikel: "der", meaning: "report" },
      { word: "Abteilung",  artikel: "die", meaning: "department" },
    ]
  },
  {
    id: 6, difficulty: "B1", label: "Nature & Environment",
    words: [
      { word: "Wald",       artikel: "der", meaning: "forest" },
      { word: "Berg",       artikel: "der", meaning: "mountain" },
      { word: "Fluss",      artikel: "der", meaning: "river" },
      { word: "See",        artikel: "der", meaning: "lake" },
      { word: "Meer",       artikel: "das", meaning: "sea" },
      { word: "Wolke",      artikel: "die", meaning: "cloud" },
      { word: "Pflanze",    artikel: "die", meaning: "plant" },
      { word: "Tier",       artikel: "das", meaning: "animal" },
      { word: "Umwelt",     artikel: "die", meaning: "environment" },
      { word: "Energie",    artikel: "die", meaning: "energy" },
    ]
  },
  // B2 - Level 7 & 8: society, media
  {
    id: 7, difficulty: "B2", label: "Society & Politics",
    words: [
      { word: "Gesellschaft",artikel: "die", meaning: "society" },
      { word: "Gesetz",      artikel: "das", meaning: "law" },
      { word: "Wahl",        artikel: "die", meaning: "election" },
      { word: "Staat",       artikel: "der", meaning: "state" },
      { word: "Recht",       artikel: "das", meaning: "right/law" },
      { word: "Partei",      artikel: "die", meaning: "party (political)" },
      { word: "Steuern",     artikel: "die", meaning: "taxes" },
      { word: "Haushalt",    artikel: "der", meaning: "budget/household" },
      { word: "Bürger",      artikel: "der", meaning: "citizen" },
      { word: "Verantwortung",artikel:"die", meaning: "responsibility" },
    ]
  },
  {
    id: 8, difficulty: "B2", label: "Media & Technology",
    words: [
      { word: "Nachricht",   artikel: "die", meaning: "news/message" },
      { word: "Programm",    artikel: "das", meaning: "program" },
      { word: "Netzwerk",    artikel: "das", meaning: "network" },
      { word: "Daten",       artikel: "die", meaning: "data" },
      { word: "Bildschirm",  artikel: "der", meaning: "screen" },
      { word: "Anwendung",   artikel: "die", meaning: "application" },
      { word: "Plattform",   artikel: "die", meaning: "platform" },
      { word: "Algorithmus", artikel: "der", meaning: "algorithm" },
      { word: "Speicher",    artikel: "der", meaning: "storage/memory" },
      { word: "Schnittstelle",artikel:"die", meaning: "interface" },
    ]
  },
  // C1 - Level 9 & 10: abstract concepts, academia
  {
    id: 9, difficulty: "C1", label: "Abstract Concepts",
    words: [
      { word: "Bewusstsein",  artikel: "das", meaning: "consciousness/awareness" },
      { word: "Erkenntnis",   artikel: "die", meaning: "insight/realization" },
      { word: "Wahrnehmung",  artikel: "die", meaning: "perception" },
      { word: "Zusammenhang", artikel: "der", meaning: "connection/context" },
      { word: "Verhältnis",   artikel: "das", meaning: "relationship/ratio" },
      { word: "Erscheinung",  artikel: "die", meaning: "phenomenon/appearance" },
      { word: "Widerspruch",  artikel: "der", meaning: "contradiction" },
      { word: "Grundlage",    artikel: "die", meaning: "foundation/basis" },
      { word: "Merkmal",      artikel: "das", meaning: "characteristic/feature" },
      { word: "Auswirkung",   artikel: "die", meaning: "impact/effect" },
    ]
  },
  {
    id: 10, difficulty: "C1", label: "Academic & Science",
    words: [
      { word: "Forschung",    artikel: "die", meaning: "research" },
      { word: "Hypothese",    artikel: "die", meaning: "hypothesis" },
      { word: "Experiment",   artikel: "das", meaning: "experiment" },
      { word: "Methode",      artikel: "die", meaning: "method" },
      { word: "Theorie",      artikel: "die", meaning: "theory" },
      { word: "Ergebnis",     artikel: "das", meaning: "result/finding" },
      { word: "Nachweis",     artikel: "der", meaning: "proof/evidence" },
      { word: "Ansatz",       artikel: "der", meaning: "approach" },
      { word: "Studie",       artikel: "die", meaning: "study" },
      { word: "Disziplin",    artikel: "die", meaning: "discipline" },
    ]
  },
  // C2 - Level 11 & 12: idiomatic, rare, nuanced
  {
    id: 11, difficulty: "C2", label: "Nuanced Vocabulary",
    words: [
      { word: "Weltanschauung",artikel:"die", meaning: "worldview/ideology" },
      { word: "Fingerspitzengefühl",artikel:"das",meaning:"sensitivity/tact" },
      { word: "Querdenker",   artikel: "der", meaning: "lateral thinker" },
      { word: "Wandel",       artikel: "der", meaning: "change/transformation" },
      { word: "Pflicht",      artikel: "die", meaning: "duty/obligation" },
      { word: "Gemüt",        artikel: "das", meaning: "disposition/soul" },
      { word: "Zeugnis",      artikel: "das", meaning: "testimony/certificate" },
      { word: "Scheitern",    artikel: "das", meaning: "failure (the act of)" },
      { word: "Leitbild",     artikel: "das", meaning: "guiding principle" },
      { word: "Verständnis",  artikel: "das", meaning: "understanding/sympathy" },
    ]
  },
  {
    id: 12, difficulty: "C2", label: "Literary & Philosophical",
    words: [
      { word: "Dasein",       artikel: "das", meaning: "existence/being" },
      { word: "Sehnsucht",    artikel: "die", meaning: "longing/yearning" },
      { word: "Überzeugung",  artikel: "die", meaning: "conviction/belief" },
      { word: "Schicksal",    artikel: "das", meaning: "fate/destiny" },
      { word: "Vergänglichkeit",artikel:"die",meaning:"transience/mortality" },
      { word: "Ursprung",     artikel: "der", meaning: "origin/source" },
      { word: "Sein",         artikel: "das", meaning: "being/existence" },
      { word: "Zwiespalt",    artikel: "der", meaning: "inner conflict/dilemma" },
      { word: "Nichts",       artikel: "das", meaning: "nothingness" },
      { word: "Unendlichkeit",artikel: "die", meaning: "infinity" },
    ]
  },
];

const DIFFICULTY_COLORS = {
  A1: { bg: "rgba(63,185,80,0.12)",  border: "#3fb95044", text: "#3fb950" },
  A2: { bg: "rgba(63,185,80,0.08)",  border: "#3fb95033", text: "#57c96b" },
  B1: { bg: "rgba(88,166,255,0.12)", border: "#58a6ff44", text: "#58a6ff" },
  B2: { bg: "rgba(88,166,255,0.08)", border: "#58a6ff33", text: "#79b8ff" },
  C1: { bg: "rgba(210,153,34,0.12)", border: "#d2992244", text: "#d29922" },
  C2: { bg: "rgba(248,81,73,0.12)",  border: "#f8514944", text: "#f85149" },
};



// ─── Styles ──────────────────────────────────────────────────────────────────

const C = {
  bg:     "#0d1117",
  surface:"#161b22",
  border: "#30363d",
  text:   "#e6edf3",
  muted:  "#8b949e",
  accent: "#58a6ff",
  green:  "#3fb950",
  red:    "#f85149",
  amber:  "#d29922",
  grad:   "linear-gradient(135deg,#388bfd,#58a6ff)",
};

const base = {
  fontFamily:"'DM Serif Display', Georgia, serif",
  color: C.text,
  background: C.bg,
  minHeight:"100vh",
};

function pill(active) {
  return {
    padding:"6px 14px", borderRadius:20, fontSize:12, cursor:"pointer", border:"1px solid",
    borderColor: active ? C.accent : C.border,
    background:  active ? "rgba(88,166,255,0.15)" : "transparent",
    color:       active ? C.accent : C.muted,
    fontFamily:"inherit", transition:"all 0.15s",
  };
}

function card(selected) {
  return {
    background: selected ? "rgba(88,166,255,0.08)" : C.surface,
    border:`1px solid ${selected ? C.accent : C.border}`,
    borderRadius:10, padding:"14px 16px", cursor:"pointer",
    transition:"all 0.15s", textAlign:"left", width:"100%",
    color: C.text, fontFamily:"inherit",
  };
}

const inputSt = {
  background:C.surface, border:`1px solid ${C.border}`, borderRadius:8,
  padding:"10px 14px", color:C.text, fontSize:14, fontFamily:"inherit",
  outline:"none", width:"100%", boxSizing:"border-box",
};

function Btn({children, onClick, disabled, ghost, style={}, size="md"}) {
  const pad = size==="lg" ? "14px 32px" : size==="sm" ? "6px 14px" : "10px 20px";
  const fz  = size==="lg" ? 16 : size==="sm" ? 13 : 14;
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding:pad, borderRadius:8, border: ghost ? `1px solid ${C.border}` : "none",
      background: ghost ? "transparent" : disabled ? "#21262d" : C.grad,
      color: ghost ? C.muted : disabled ? C.muted : "#0d1117",
      cursor: disabled ? "not-allowed" : "pointer",
      fontWeight:"700", fontFamily:"inherit", fontSize:fz,
      transition:"opacity 0.15s", ...style,
    }}>{children}</button>
  );
}

function Badge({children, color}) {
  const colors = { blue:"rgba(88,166,255,0.15)", green:"rgba(63,185,80,0.15)", red:"rgba(248,81,73,0.15)", amber:"rgba(210,153,34,0.15)" };
  const texts  = { blue:C.accent, green:C.green, red:C.red, amber:C.amber };
  return (
    <span style={{
      padding:"3px 10px", borderRadius:20, fontSize:11, fontFamily:"monospace",
      background: colors[color]||colors.blue, color: texts[color]||texts.blue,
      border:`1px solid ${texts[color]||texts.blue}44`,
    }}>{children}</span>
  );
}

function SectionLabel({children}) {
  return <p style={{fontSize:11, letterSpacing:1.5, textTransform:"uppercase", color:C.muted, marginBottom:10, fontFamily:"'DM Mono', monospace"}}>{children}</p>;
}

function Spinner() {
  return (
    <div style={{textAlign:"center", padding:"60px 0"}}>
      <div style={{width:40,height:40,border:`3px solid ${C.border}`,borderTop:`3px solid ${C.accent}`,borderRadius:"50%",margin:"0 auto",animation:"spin 0.8s linear infinite"}} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <p style={{color:C.muted,marginTop:16,fontSize:14}}>Generating with AI…</p>
    </div>
  );
}

// ─── API helpers ─────────────────────────────────────────────────────────────

async function callClaude(systemPrompt, userPrompt) {
  const res = await fetch("/api/chat", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({
      model:"claude-sonnet-4-20250514",
      max_tokens:1000,
      system: systemPrompt,
      messages:[{role:"user", content:userPrompt}],
    }),
  });
  const data = await res.json();
  const text = data.content?.[0]?.text || "";
  const clean = text.replace(/```json|```/g,"").trim();
  const start = clean.search(/[\{\[]/);
  return JSON.parse(start > 0 ? clean.slice(start) : clean);
}

const ADVANCED_LEVELS = ["B2","C1","C2"];

function getLangInstruction(language, level) {
  if (ADVANCED_LEVELS.includes(level)) {
    return `IMPORTANT: Since the level is ${level} (B2 or above), write ALL exercise content — sentences, passage, questions, options, hints — entirely in ${language}. Do NOT use English as the base language. Full immersion in ${language}.`;
  }
  return `Since the level is ${level} (A1–B1), you may write sentences and content in ${language}, but keep instructions, hints, and question prompts in English to support the learner.`;
}

async function generateExercise(language, level, exerciseType, topic, customPrompt) {
  const topicCtx = topic ? `The exercise should be themed around "${topic}".` : "Use varied everyday topics.";
  const customCtx = customPrompt ? `\n\nStudent specifically wants to practice: "${customPrompt}". Focus on this.` : "";
  const langInstr = getLangInstruction(language, level);

  const formats = {
    "fill-in-the-blank": `Return JSON: {"title":"...","instructions":"...","questions":[{"id":1,"sentence":"Sentence with ___","correctAnswer":"word","hint":"base form"}]}. Exactly 5 questions.`,
    "matching": `Return JSON: {"title":"...","instructions":"...","pairs":[{"id":1,"left":"word","right":"meaning"}]}. Exactly 6 pairs.`,
    "reading":  `Return JSON: {"title":"...","instructions":"...","passage":"3-5 sentence passage","questions":[{"id":1,"question":"...","options":["A","B","C","D"],"correctAnswer":"correct option text"}]}. Exactly 4 questions.`,
  };

  return callClaude(
    "You are a language education expert. Generate grammar exercises. Respond with valid JSON only, no markdown.",
    `Generate a ${exerciseType} exercise for ${language} at ${level} level. ${topicCtx}${customCtx}\n\n${langInstr}\n\n${formats[exerciseType] || formats["fill-in-the-blank"]}`
  );
}

async function analyzeResults(language, level, exerciseType, exercise, answers) {
  // Build explicit correct-answer map so AI can score reliably
  let correctMap = {};
  if (exerciseType === "fill-in-the-blank" && exercise.questions) {
    exercise.questions.forEach(q => { correctMap[String(q.id)] = q.correctAnswer; });
  } else if (exerciseType === "matching" && exercise.pairs) {
    exercise.pairs.forEach(p => { correctMap[String(p.id)] = p.right; });
  } else if (exerciseType === "reading" && exercise.questions) {
    exercise.questions.forEach(q => { correctMap[String(q.id)] = q.correctAnswer; });
  }

  const userAnswersList = Object.entries(answers).map(([id, ans]) => ({
    questionId: Number(id),
    userAnswer: ans || "(no answer)",
    correctAnswer: correctMap[String(id)] || "unknown",
    isCorrect: (ans || "").toLowerCase().trim() === (correctMap[String(id)] || "").toLowerCase().trim()
  }));

  const preScored = userAnswersList.filter(x => x.isCorrect).length;
  const total = Object.keys(correctMap).length;

  return callClaude(
    "You are a language education expert. Analyze exercise results. Respond with valid JSON only, no markdown.",
    `The student completed a ${exerciseType} exercise in ${language} at ${level} level.

Pre-scored results (use these as the ground truth for correct/incorrect):
${JSON.stringify(userAnswersList, null, 2)}

Total questions: ${total}
Total correct: ${preScored}
Score: ${Math.round((preScored/total)*100)}%

Return JSON — use the pre-scored isCorrect values exactly as provided:
{
  "score": ${Math.round((preScored/total)*100)},
  "totalCorrect": ${preScored},
  "totalQuestions": ${total},
  "results": [{"questionId":number,"correct":boolean,"userAnswer":"...","correctAnswer":"...","explanation":"brief explanation if wrong, else empty string"}],
  "overallFeedback": "2-3 encouraging sentences about their performance",
  "suggestedExercises": [{"type":"fill-in-the-blank|matching|reading","topic":"grammar topic","level":"${level}"}]
}`
  );
}

async function generatePlacementSection(language, section) {
  if (section === "grammar") {
    return callClaude(
      "You are a language assessment expert. Respond with valid JSON only.",
      `Generate a grammar placement test for ${language} with exactly 10 multiple-choice questions ordered A1→C2 (2 each at A1,A2,B1,B2,C1; last 2 at C2). Return JSON:
{"title":"Grammar Placement Test","instructions":"Choose the correct answer","questions":[{"id":1,"question":"...","options":["A","B","C","D"],"correctAnswer":"correct text","difficulty":"A1"}]}`
    );
  } else {
    return callClaude(
      "You are a language assessment expert. Respond with valid JSON only.",
      `Generate a reading placement test for ${language} at B1-B2 level with a passage and exactly 5 multiple-choice questions. Return JSON:
{"title":"Reading Placement Test","instructions":"Read and answer","passage":"6-8 sentence passage in ${language}","questions":[{"id":1,"question":"...","options":["A","B","C","D"],"correctAnswer":"correct text","difficulty":"B1"}]}`
    );
  }
}

async function scorePlacementTest(language, answers, grammarQs, readingQs) {
  return callClaude(
    "You are a language assessment expert. Respond with valid JSON only.",
    `Student took ${language} placement test.
Grammar answers (indexed 0-9): ${JSON.stringify(answers.grammar)}
Reading answers (indexed 0-4): ${JSON.stringify(answers.reading)}
Grammar questions: ${JSON.stringify(grammarQs)}
Reading questions: ${JSON.stringify(readingQs)}

Determine CEFR level based on where they start failing. Return JSON:
{
  "level":"B1",
  "feedback":"2-3 sentences",
  "sectionScores":{"grammar":{"correct":6,"total":10},"reading":{"correct":3,"total":5}},
  "questionResults":[{"section":"grammar","questionIndex":0,"question":"...","difficulty":"A1","userAnswer":"...","correctAnswer":"...","isCorrect":true,"explanation":""}],
  "skillsToImprove":[{"skill":"...","description":"..."}]
}`
  );
}

// ─── Views ───────────────────────────────────────────────────────────────────

function SetupView({ onStart, isLoading, defaultLanguage, defaultLevel, onPlacementTest, onArtikelGame, onSpeak }) {
  const [language, setLanguage] = useState(defaultLanguage || "");
  const [level, setLevel]       = useState(defaultLevel || "");
  const [exType, setExType]     = useState("");
  const [topic, setTopic]       = useState("");
  const [custom, setCustom]     = useState("");

  const canStart = language && level;

  function handleTypeClick(v) {
    if (v === "placement-test") { language && onPlacementTest(language); return; }
    if (v === "artikel-game") { onArtikelGame && onArtikelGame(); return; }
    if (v === "speak") { onSpeak && onSpeak(); return; }
    setExType(v);
  }

  return (
    <div style={{maxWidth:680, margin:"0 auto", padding:"40px 20px"}}>
      {/* Hero */}
      <div style={{textAlign:"center", marginBottom:48}}>
        <div style={{
          display:"inline-flex", alignItems:"center", gap:8, padding:"6px 16px",
          background:"rgba(88,166,255,0.1)", border:`1px solid ${C.accent}44`, borderRadius:20, marginBottom:20,
        }}>
          <span style={{fontSize:13, color:C.accent}}>✦ AI-Powered Grammar Practice</span>
        </div>
        <h1 style={{fontSize:42, fontWeight:700, margin:"0 0 12px", lineHeight:1.1}}>
          Master Any<br/><span style={{background:C.grad, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"}}>Language</span>
        </h1>
        <p style={{color:C.muted, fontSize:16, margin:0}}>
          Choose your language, level, and exercise type. Our AI generates personalized exercises just for you.
        </p>
      </div>

      {/* Language */}
      <div style={{marginBottom:32}}>
        <SectionLabel>Choose a Language</SectionLabel>
        <div style={{display:"flex", flexWrap:"wrap", gap:8}}>
          {LANGUAGES.map(l => (
            <button key={l} onClick={()=>setLanguage(l)} style={pill(language===l)}>{l}</button>
          ))}
        </div>
      </div>

      {/* Level */}
      <div style={{marginBottom:32}}>
        <SectionLabel>Select Your Level</SectionLabel>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10}}>
          {LEVELS.map(lv => (
            <button key={lv.value} onClick={()=>setLevel(lv.value)} style={{...card(level===lv.value), padding:"12px 14px"}}>
              <div style={{fontWeight:700, fontSize:15, color: level===lv.value ? C.accent : C.text}}>{lv.value}</div>
              <div style={{fontSize:11, color:C.muted, marginTop:3}}>{lv.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom prompt */}
      <div style={{marginBottom:32}}>
        <SectionLabel>Train Any Topic You Wish (optional)</SectionLabel>
        <textarea
          placeholder='e.g. "I want to practice past tense irregular verbs" or "Help with subjunctive mood"…'
          value={custom} onChange={e=>setCustom(e.target.value)}
          rows={3} style={{...inputSt, resize:"vertical"}}
        />
      </div>

      {/* Exercise type */}
      <div style={{marginBottom:32}}>
        <SectionLabel>Exercise Type</SectionLabel>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10}}>
          {EXERCISE_TYPES.map(t => {
            const disabled = t.value==="placement-test" && !language;
            return (
              <button key={t.value} onClick={()=>!disabled&&handleTypeClick(t.value)}
                style={{...card(exType===t.value), opacity:disabled?0.45:1, cursor:disabled?"not-allowed":"pointer"}}>
                <div style={{fontSize:24, marginBottom:6}}>{t.icon}</div>
                <div style={{fontWeight:700, color:exType===t.value?C.accent:C.text}}>{t.label}</div>
                <div style={{fontSize:12, color:C.muted, marginTop:3}}>{disabled?"Select a language first":t.desc}</div>
              </button>
            );
          })}
          {language === "German" && (
            <button onClick={()=>handleTypeClick("artikel-game")} style={{
              ...card(false),
              background:"rgba(79,195,247,0.06)",
              border:`1px solid rgba(79,195,247,0.3)`,
              gridColumn:"1 / -1",
            }}>
              <div style={{display:"flex", alignItems:"center", gap:14}}>
                <span style={{fontSize:28}}>🇩🇪</span>
                <div>
                  <div style={{fontWeight:700, color:"#4fc3f7", fontSize:15}}>Artikel Game</div>
                  <div style={{fontSize:12, color:C.muted, marginTop:2}}>12 levels · der, die or das? — Practice German noun articles</div>
                </div>
                <span style={{marginLeft:"auto", fontSize:18, color:"#4fc3f7"}}>→</span>
              </div>
            </button>
          )}
          {language && (
            <button onClick={()=>handleTypeClick("speak")} style={{
              ...card(false),
              background:"rgba(192,132,252,0.06)",
              border:"1px solid rgba(192,132,252,0.3)",
              gridColumn:"1 / -1",
            }}>
              <div style={{display:"flex", alignItems:"center", gap:14}}>
                <span style={{fontSize:28}}>🎙️</span>
                <div>
                  <div style={{fontWeight:700, color:"#c084fc", fontSize:15}}>Conversation Practice</div>
                  <div style={{fontSize:12, color:C.muted, marginTop:2}}>Speak or type · AI tutor responds · live grammar & pronunciation feedback</div>
                </div>
                <span style={{marginLeft:"auto", fontSize:18, color:"#c084fc"}}>→</span>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Topics */}
      <div style={{marginBottom:40}}>
        <SectionLabel>Choose a Topic (optional)</SectionLabel>
        <div style={{display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8}}>
          {TOPICS.map(t => (
            <button key={t.value} onClick={()=>setTopic(topic===t.value?"":t.value)}
              style={{...card(topic===t.value), padding:"10px 8px", textAlign:"center"}}>
              <div style={{fontSize:20, marginBottom:4}}>{t.icon}</div>
              <div style={{fontSize:12, fontWeight:600, color:topic===t.value?C.accent:C.text}}>{t.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Start */}
      <div style={{textAlign:"center"}}>
        <Btn size="lg" disabled={!canStart||isLoading} onClick={()=>canStart&&onStart(language,level,exType||"fill-in-the-blank",topic||undefined,custom||undefined)}>
          {isLoading ? "Generating Exercise…" : "📖 Generate Exercise"}
        </Btn>
        {!canStart && <p style={{fontSize:12,color:C.muted,marginTop:10}}>Select a language and level to continue</p>}
      </div>
    </div>
  );
}

// ── Exercise View ─────────────────────────────────────────────────────────────

function ExerciseView({ exerciseType, exercise, onSubmit, onBack, isAnalyzing, scrollToId }) {
  const [answers, setAnswers]       = useState({});
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState({});
  const [showAnswers, setShowAnswers]   = useState(false);

  // Scroll to a specific question when asked (from results panel)
  useEffect(() => {
    if (!scrollToId) return;
    const el = document.getElementById(`question-${scrollToId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.style.outline = `2px solid ${C.accent}`;
      const t = setTimeout(() => { el.style.outline = "none"; }, 1600);
      return () => clearTimeout(t);
    }
  }, [scrollToId]);

  function setAns(k, v) { setAnswers(p => ({ ...p, [k]: v })); }

  function handleSubmit() {
    let out = {};
    if (exerciseType === "matching") {
      exercise.pairs.forEach(p => {
        const matchedRightId = matchedPairs[p.id];
        const right = matchedRightId ? exercise.pairs.find(x => x.id === matchedRightId) : null;
        out[String(p.id)] = right ? right.right : "";
      });
    } else if (exerciseType === "fill-in-the-blank") {
      exercise.questions.forEach(q => {
        const numBlanks = q.sentence.split("___").length - 1;
        if (numBlanks === 1) {
          out[String(q.id)] = answers[`${q.id}-0`] || "";
        } else {
          // Join multiple blanks with a space for multi-blank questions
          out[String(q.id)] = Array.from({ length: numBlanks }, (_, bi) => answers[`${q.id}-${bi}`] || "").join(" ");
        }
      });
    } else {
      out = { ...answers };
    }
    onSubmit(out);
  }

  // stable shuffle for matching
  const shuffledRight = useRef(null);
  if (exerciseType === "matching" && exercise.pairs && !shuffledRight.current) {
    shuffledRight.current = [...exercise.pairs].sort(() => Math.random() - 0.5);
  }

  const answeredCount = exerciseType === "matching"
    ? Object.keys(matchedPairs).length
    : exerciseType === "fill-in-the-blank"
    ? exercise.questions?.filter(q => {
        const n = q.sentence.split("___").length - 1;
        return Array.from({ length: n }, (_, bi) => answers[`${q.id}-${bi}`]?.trim()).some(Boolean);
      }).length
    : exercise.questions?.filter(q => answers[String(q.id)]).length || 0;
  const totalCount = exerciseType === "matching"
    ? exercise.pairs?.length || 0
    : exercise.questions?.length || 0;

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 20px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>
          ← New Exercise
        </button>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button onClick={() => setShowAnswers(s => !s)}
            style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>
            {showAnswers ? "🙈 Hide" : "👁 Peek"}
          </button>
          <span style={{ color: C.muted, fontSize: 12 }}>{answeredCount}/{totalCount} answered</span>
        </div>
      </div>
      <p style={{ color: C.text, fontWeight: 600, fontSize: 17, margin: "0 0 4px" }}>{exercise.title}</p>
      <p style={{ color: C.muted, fontSize: 13, margin: "0 0 28px" }}>{exercise.instructions}</p>

      {/* ── Fill in the Blank ── */}
      {exerciseType === "fill-in-the-blank" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {exercise.questions.map((q, i) => {
            const parts = q.sentence.split("___");
            const numBlanks = parts.length - 1;
            // Each blank has its own independent key: `${q.id}-${blankIdx}`
            const allFilled = numBlanks > 0 && Array.from({ length: numBlanks }, (_, bi) => answers[`${q.id}-${bi}`]?.trim()).every(Boolean);

            return (
              <div key={q.id} id={`question-${q.id}`} style={{
                display: "grid",
                gridTemplateColumns: "40px 1fr",
                gap: 0,
                borderRadius: 14,
                overflow: "hidden",
                border: `1px solid ${allFilled ? C.accent + "55" : C.border}`,
                background: C.surface,
                transition: "border-color 0.25s",
              }}>
                {/* Left number strip */}
                <div style={{
                  background: allFilled ? "rgba(88,166,255,0.18)" : "rgba(255,255,255,0.04)",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "flex-start",
                  paddingTop: 18,
                  borderRight: `1px solid ${allFilled ? C.accent + "33" : C.border}`,
                  transition: "background 0.25s",
                }}>
                  <span style={{
                    fontSize: 13, fontWeight: 700,
                    color: allFilled ? C.accent : C.muted,
                    lineHeight: 1,
                  }}>{i + 1}</span>
                </div>

                {/* Right content */}
                <div style={{ padding: "16px 20px 18px" }}>
                  {/* Sentence with independent inline inputs per blank */}
                  <p style={{
                    margin: "0 0 14px", fontSize: 16, lineHeight: 2.2,
                    color: C.text, fontWeight: 400,
                  }}>
                    {parts.map((part, idx, arr) => {
                      const blankKey = `${q.id}-${idx}`;
                      const blankVal = answers[blankKey] || "";
                      const blankFilled = blankVal.trim().length > 0;
                      return (
                        <span key={idx}>
                          {part}
                          {idx < arr.length - 1 && (
                            <input
                              value={blankVal}
                              onChange={e => setAns(blankKey, e.target.value)}
                              placeholder="________"
                              style={{
                                display: "inline-block",
                                verticalAlign: "middle",
                                width: Math.max(80, blankVal.length * 10 + 24),
                                minWidth: 80,
                                marginInline: 6,
                                padding: "2px 10px",
                                background: blankFilled ? "rgba(88,166,255,0.08)" : "rgba(255,255,255,0.05)",
                                border: "none",
                                borderBottom: `2px solid ${blankFilled ? C.accent : C.muted + "66"}`,
                                borderRadius: "4px 4px 0 0",
                                color: blankFilled ? C.accent : C.text,
                                fontSize: 15,
                                fontFamily: "inherit",
                                fontWeight: blankFilled ? 600 : 400,
                                outline: "none",
                                transition: "all 0.2s",
                                textAlign: "center",
                              }}
                              onFocus={e => {
                                e.target.style.borderBottomColor = C.accent;
                                e.target.style.background = "rgba(88,166,255,0.12)";
                              }}
                              onBlur={e => {
                                e.target.style.borderBottomColor = blankFilled ? C.accent : C.muted + "66";
                                e.target.style.background = blankFilled ? "rgba(88,166,255,0.08)" : "rgba(255,255,255,0.05)";
                              }}
                            />
                          )}
                        </span>
                      );
                    })}
                  </p>

                  {/* Hint + answer row */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    {q.hint ? (
                      <span style={{
                        fontSize: 11, color: C.muted,
                        background: "rgba(255,255,255,0.04)",
                        border: `1px solid ${C.border}`,
                        borderRadius: 20, padding: "2px 10px",
                        letterSpacing: 0.3,
                      }}>
                        💡 {q.hint}
                      </span>
                    ) : <span />}
                    {showAnswers && (
                      <span style={{
                        fontSize: 12, color: C.green, fontWeight: 600,
                        display: "flex", alignItems: "center", gap: 4,
                      }}>
                        ✅ {q.correctAnswer}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Matching ── */}
      {exerciseType === "matching" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div>
            <SectionLabel>Words</SectionLabel>
            {exercise.pairs.map(p => (
              <div key={p.id} id={`question-${p.id}`} style={{ marginBottom: 8 }}>
                <button onClick={() => setSelectedLeft(p.id)} style={{
                  ...card(selectedLeft === p.id), width: "100%",
                  background: matchedPairs[p.id] ? "rgba(63,185,80,0.08)" : selectedLeft === p.id ? "rgba(88,166,255,0.15)" : C.surface,
                  borderColor: matchedPairs[p.id] ? C.green : selectedLeft === p.id ? C.accent : C.border,
                }}>
                  <span style={{ fontWeight: 600 }}>{p.left}</span>
                  {matchedPairs[p.id] && <span style={{ fontSize: 11, color: C.green, marginLeft: 8 }}>→ {exercise.pairs.find(x => x.id === matchedPairs[p.id])?.right}</span>}
                  {showAnswers && !matchedPairs[p.id] && <span style={{ fontSize: 11, color: C.green, marginLeft: 8 }}>✅ {p.right}</span>}
                </button>
              </div>
            ))}
          </div>
          <div>
            <SectionLabel>Meanings</SectionLabel>
            {(shuffledRight.current || []).map(p => {
              const matched = Object.values(matchedPairs).includes(p.id);
              return (
                <button key={p.id} onClick={() => selectedLeft !== null && !matched && (setMatchedPairs(m => ({ ...m, [selectedLeft]: p.id })), setSelectedLeft(null))}
                  disabled={matched} style={{
                    ...card(false), marginBottom: 8, width: "100%",
                    background: matched ? "rgba(63,185,80,0.08)" : C.surface,
                    borderColor: matched ? C.green : selectedLeft !== null ? C.accent + "66" : C.border,
                    opacity: matched ? 0.7 : 1,
                  }}>
                  {p.right}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Reading ── */}
      {exerciseType === "reading" && (
        <div>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "20px", marginBottom: 20 }}>
            <SectionLabel>📖 Passage</SectionLabel>
            <p style={{ lineHeight: 1.8, fontSize: 15, margin: 0 }}>{exercise.passage}</p>
          </div>
          {exercise.questions.map((q, i) => (
            <div key={q.id} id={`question-${q.id}`} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 20px", marginBottom: 14 }}>
              <p style={{ fontWeight: 600, marginBottom: 12, fontSize: 15 }}>{q.id}. {q.question}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {q.options.map(opt => (
                  <button key={opt} onClick={() => setAns(String(q.id), opt)} style={{
                    ...card(answers[String(q.id)] === opt), padding: "10px 12px", fontSize: 13,
                    background: answers[String(q.id)] === opt ? "rgba(88,166,255,0.15)" : C.bg,
                    borderColor: answers[String(q.id)] === opt ? C.accent : C.border,
                  }}>{opt}</button>
                ))}
              </div>
              {showAnswers && <p style={{ fontSize: 12, color: C.green, marginTop: 8, marginBottom: 0 }}>✅ {q.correctAnswer}</p>}
            </div>
          ))}
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: 32 }}>
        <Btn size="lg" disabled={isAnalyzing} onClick={handleSubmit}>
          {isAnalyzing ? "Analyzing Answers…" : `✉ Submit${answeredCount < totalCount ? ` (${answeredCount}/${totalCount} answered)` : ""}`}
        </Btn>
        {answeredCount < totalCount && (
          <p style={{ fontSize: 11, color: C.muted, marginTop: 8 }}>You can submit with unanswered questions — they'll be marked empty.</p>
        )}
      </div>
    </div>
  );
}

// ── Results View ──────────────────────────────────────────────────────────────

function ResultsView({ results, onNewExercise, onContinue, onSuggestedExercise, exercise, exerciseType }) {
  const [view, setView] = useState("results"); // "results" | "questions"
  const [scrollTarget, setScrollTarget] = useState(null);
  const pct = results.score;
  const color = pct >= 80 ? C.green : pct >= 50 ? C.amber : C.red;

  function getQuestionText(questionId) {
    if (!exercise) return null;
    if (exercise.questions) {
      const q = exercise.questions.find(q => q.id === questionId);
      if (q) return q.sentence || q.question || null;
    }
    if (exercise.pairs) {
      const p = exercise.pairs.find(p => p.id === questionId);
      if (p) return p.left || null;
    }
    return null;
  }

  function handleJumpToQuestion(questionId) {
    setScrollTarget(questionId);
    setView("questions");
    setTimeout(() => setScrollTarget(null), 800);
  }

  // Tab bar
  const TabBar = () => (
    <div style={{
      display: "flex", gap: 0, marginBottom: 28,
      background: C.surface, borderRadius: 10, border: `1px solid ${C.border}`,
      padding: 4, width: "fit-content", margin: "0 auto 28px",
    }}>
      {[["results","📊 Results"],["questions","📝 Questions"]].map(([v,label]) => (
        <button key={v} onClick={() => setView(v)} style={{
          padding: "8px 22px", borderRadius: 7, border: "none",
          background: view === v ? C.grad : "transparent",
          color: view === v ? "#0d1117" : C.muted,
          fontWeight: view === v ? 700 : 400,
          fontFamily: "inherit", fontSize: 13, cursor: "pointer",
          transition: "all 0.15s",
        }}>{label}</button>
      ))}
    </div>
  );

  if (view === "questions") {
    return (
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 20px" }}>
        <TabBar />
        <ExerciseView
          exerciseType={exerciseType}
          exercise={exercise}
          onSubmit={() => setView("results")}
          onBack={() => setView("results")}
          isAnalyzing={false}
          scrollToId={scrollTarget}
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 20px" }}>
      <TabBar />

      {/* Score */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{
          width: 100, height: 100, borderRadius: "50%", margin: "0 auto 16px",
          background: C.surface, border: `3px solid ${color}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28, fontWeight: 700, color,
        }}>{pct}%</div>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>
          🏆 {results.totalCorrect}/{results.totalQuestions} correct
        </div>
        <p style={{ color: C.muted, maxWidth: 420, margin: "0 auto" }}>{results.overallFeedback}</p>
      </div>

      {/* Detailed results */}
      <SectionLabel>Detailed Results — click any row to review that question</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
        {results.results.map((r, i) => {
          const qText = getQuestionText(r.questionId);
          return (
            <button
              key={r.questionId}
              onClick={() => handleJumpToQuestion(r.questionId)}
              style={{
                display: "block", textAlign: "left", width: "100%",
                background: r.correct ? "rgba(63,185,80,0.05)" : "rgba(248,81,73,0.05)",
                border: `1px solid ${r.correct ? C.green + "44" : C.red + "44"}`,
                borderRadius: 10, padding: "14px 16px",
                cursor: "pointer", transition: "filter 0.15s",
                fontFamily: "inherit", color: C.text,
              }}
              onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.2)"}
              onMouseLeave={e => e.currentTarget.style.filter = "none"}
            >
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{r.correct ? "✅" : "❌"}</span>
                <div style={{ flex: 1 }}>
                  {qText && (
                    <p style={{ margin: "0 0 5px", fontSize: 13, color: C.text, fontWeight: 600, lineHeight: 1.4 }}>
                      Q{r.questionId}: {qText.length > 90 ? qText.slice(0, 90) + "…" : qText}
                    </p>
                  )}
                  <div style={{ fontSize: 13, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ color: C.muted }}>Your answer:</span>
                    <span style={{ fontWeight: 600, color: r.correct ? C.green : C.red }}>{r.userAnswer || "(empty)"}</span>
                    {!r.correct && <>
                      <span style={{ color: C.muted }}>→ Correct:</span>
                      <span style={{ fontWeight: 600, color: C.green }}>{r.correctAnswer}</span>
                    </>}
                  </div>
                  {r.explanation && <p style={{ margin: "5px 0 0", fontSize: 12, color: C.muted }}>{r.explanation}</p>}
                  <div style={{ marginTop: 5, fontSize: 11, color: C.accent }}>↗ click to review question</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Suggested */}
      {results.suggestedExercises?.length > 0 && (
        <>
          <SectionLabel>Suggested Next Steps</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 32 }}>
            {results.suggestedExercises.map((s, i) => (
              <button key={i} onClick={() => onSuggestedExercise(s.type, s.level)} style={{ ...card(false), textAlign: "left" }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{s.topic}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>{s.type} · {s.level}</div>
              </button>
            ))}
          </div>
        </>
      )}

      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <Btn size="lg" onClick={onContinue}>→ Continue</Btn>
        <Btn size="lg" ghost onClick={onNewExercise}>↺ New Exercise</Btn>
      </div>
    </div>
  );
}

// ── Placement Test ────────────────────────────────────────────────────────────

function PlacementTest({ language, onComplete, onSkip }) {
  const [phase, setPhase]           = useState("intro");
  const [secIdx, setSecIdx]         = useState(0);
  const [qIdx, setQIdx]             = useState(0);
  const [secData, setSecData]       = useState(null);
  const [answers, setAnswers]       = useState({grammar:{},reading:{}});
  const [loading, setLoading]       = useState(false);
  const [scoreData, setScoreData]   = useState(null);
  const stored = useRef({grammar:[],reading:[]});

  const SECS = ["grammar","reading"];
  const sec  = SECS[secIdx];
  const totalAnswered = Object.keys(answers.grammar).length + Object.keys(answers.reading).length;
  const totalQs = 15;

  async function startTest() {
    setPhase("testing");
    setLoading(true);
    try {
      const d = await generatePlacementSection(language,"grammar");
      stored.current.grammar = d.questions;
      setSecData(d);
      setQIdx(0);
    } catch(e) { alert("Failed to load test."); }
    setLoading(false);
  }

  async function goNext() {
    if (!secData) return;
    if (qIdx < secData.questions.length-1) { setQIdx(q=>q+1); return; }
    if (secIdx < SECS.length-1) {
      setLoading(true);
      try {
        const d = await generatePlacementSection(language,"reading");
        stored.current.reading = d.questions;
        setSecData(d); setSecIdx(1); setQIdx(0);
      } catch(e) { alert("Failed to load reading section."); }
      setLoading(false);
    } else {
      setLoading(true);
      try {
        const d = await scorePlacementTest(language, answers, stored.current.grammar, stored.current.reading);
        setScoreData(d); setPhase("results");
      } catch(e) { alert("Failed to score test."); }
      setLoading(false);
    }
  }

  const curQ = secData?.questions[qIdx];
  const hasAns = curQ != null && answers[sec][qIdx] != null;
  const progress = Math.round((totalAnswered/totalQs)*100);

  if (phase==="intro") return (
    <div style={{maxWidth:560,margin:"0 auto",padding:"40px 20px",textAlign:"center"}}>
      <div style={{
        width:64,height:64,borderRadius:16,background:C.grad,
        display:"flex",alignItems:"center",justifyContent:"center",
        fontSize:32,margin:"0 auto 24px",
      }}>🎓</div>
      <h1 style={{fontSize:32,fontWeight:700,marginBottom:12}}>Find Your Level</h1>
      <p style={{color:C.muted,marginBottom:32}}>
        Quick placement test to discover your CEFR level in <strong style={{color:C.text}}>{language}</strong>. ~5 minutes, 15 questions.
      </p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:32,textAlign:"left"}}>
        {[{icon:"📝",label:"Grammar",n:"10 questions"},{icon:"📖",label:"Reading",n:"5 questions"}].map(s=>(
          <div key={s.label} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:16}}>
            <div style={{fontSize:24,marginBottom:6}}>{s.icon}</div>
            <div style={{fontWeight:600}}>{s.label}</div>
            <div style={{fontSize:12,color:C.muted}}>{s.n}</div>
          </div>
        ))}
      </div>
      <Btn size="lg" onClick={startTest}>🎓 Start Placement Test</Btn>
      <br/>
      <button onClick={onSkip} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",marginTop:12,fontSize:13,fontFamily:"inherit",textDecoration:"underline"}}>
        Skip — I already know my level
      </button>
    </div>
  );

  if (phase==="results" && scoreData) {
    const grammar = (scoreData.questionResults||[]).filter(r=>r.section==="grammar");
    const reading = (scoreData.questionResults||[]).filter(r=>r.section==="reading");
    return (
      <div style={{maxWidth:640,margin:"0 auto",padding:"40px 20px"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{
            width:80,height:80,borderRadius:16,background:C.grad,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:28,fontWeight:700,color:"#0d1117",margin:"0 auto 16px",
          }}>{scoreData.level}</div>
          <h1 style={{fontSize:30,fontWeight:700,marginBottom:8}}>Your Level: {scoreData.level}</h1>
          <p style={{color:C.muted,maxWidth:400,margin:"0 auto"}}>{scoreData.feedback}</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:28}}>
          {["grammar","reading"].map(s=>{
            const sc = scoreData.sectionScores?.[s];
            return (
              <div key={s} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:16,textAlign:"center"}}>
                <div style={{fontSize:11,color:C.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>{s}</div>
                <div style={{fontSize:28,fontWeight:700}}>{sc?.correct??"-"}/{sc?.total??"-"}</div>
              </div>
            );
          })}
        </div>
        {[{label:"Grammar",results:grammar},{label:"Reading",results:reading}].map(({label,results})=>
          results.length>0 && (
            <div key={label} style={{marginBottom:24}}>
              <SectionLabel>{label} Questions</SectionLabel>
              {results.map((r,i)=>(
                <div key={i} style={{
                  background:r.isCorrect?"rgba(63,185,80,0.05)":"rgba(248,81,73,0.05)",
                  border:`1px solid ${r.isCorrect?C.green+"44":C.red+"44"}`,
                  borderRadius:8,padding:"12px 14px",marginBottom:8,
                }}>
                  <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                    <span style={{flexShrink:0}}>{r.isCorrect?"✅":"❌"}</span>
                    <div>
                      <p style={{margin:"0 0 4px",fontSize:13,fontWeight:600}}>{r.question}</p>
                      <div style={{fontSize:12,color:C.muted,display:"flex",gap:8,flexWrap:"wrap"}}>
                        <Badge color={r.isCorrect?"green":"red"}>{r.difficulty}</Badge>
                        <span>Yours: <strong style={{color:r.isCorrect?C.green:C.red}}>{r.userAnswer}</strong></span>
                        {!r.isCorrect && <span>Correct: <strong style={{color:C.green}}>{r.correctAnswer}</strong></span>}
                      </div>
                      {!r.isCorrect&&r.explanation&&<p style={{fontSize:11,color:C.muted,margin:"4px 0 0",fontStyle:"italic"}}>{r.explanation}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
        {scoreData.skillsToImprove?.length>0 && (
          <div style={{background:"rgba(210,153,34,0.08)",border:`1px solid ${C.amber}44`,borderRadius:10,padding:16,marginBottom:28}}>
            <div style={{fontWeight:600,marginBottom:10,color:C.amber}}>💡 Skills to Practice</div>
            {scoreData.skillsToImprove.map((s,i)=>(
              <p key={i} style={{fontSize:13,color:C.muted,margin:"0 0 6px"}}><strong style={{color:C.text}}>{s.skill}:</strong> {s.description}</p>
            ))}
          </div>
        )}
        <div style={{textAlign:"center"}}>
          <Btn size="lg" onClick={()=>onComplete(scoreData.level)}>Continue with {scoreData.level} →</Btn>
        </div>
      </div>
    );
  }

  // Testing
  return (
    <div style={{maxWidth:600,margin:"0 auto",padding:"32px 20px"}}>
      <div style={{marginBottom:24}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:C.muted,marginBottom:8}}>
          <span>{sec==="grammar"?"📝":"📖"} {sec.charAt(0).toUpperCase()+sec.slice(1)} — Q{qIdx+1}/{secData?.questions.length||10}</span>
          <span>{totalAnswered}/{totalQs} answered</span>
        </div>
        <div style={{height:4,background:C.surface,borderRadius:2}}>
          <div style={{height:4,background:C.grad,borderRadius:2,width:`${progress}%`,transition:"width 0.3s"}}/>
        </div>
      </div>

      {loading ? <Spinner/> : curQ && (
        <div>
          {sec==="reading" && secData?.passage && (
            <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:20,marginBottom:20}}>
              <SectionLabel>Read the passage</SectionLabel>
              <p style={{fontSize:14,lineHeight:1.8,margin:0,whiteSpace:"pre-line"}}>{secData.passage}</p>
            </div>
          )}
          <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"20px 24px",marginBottom:20}}>
            <p style={{fontSize:16,fontWeight:600,marginBottom:16}}>{curQ.question}</p>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {curQ.options.map(opt=>(
                <button key={opt} onClick={()=>setAnswers(a=>({...a,[sec]:{...a[sec],[qIdx]:opt}}))}
                  style={{
                    ...card(answers[sec][qIdx]===opt), padding:"12px 16px", fontSize:14,
                    background: answers[sec][qIdx]===opt ? "rgba(88,166,255,0.15)" : C.bg,
                    borderColor: answers[sec][qIdx]===opt ? C.accent : C.border,
                  }}>{opt}</button>
              ))}
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <Btn ghost onClick={()=>qIdx>0&&setQIdx(q=>q-1)} disabled={qIdx===0&&secIdx===0}>← Previous</Btn>
            <Btn disabled={!hasAns} onClick={goNext}>
              {secIdx===SECS.length-1&&qIdx===(secData?.questions.length||10)-1?"Finish Test":"Next →"}
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}



// ─── Conversation Tutor ───────────────────────────────────────────────────────

const CONVO_SCENARIOS = [
  { id:"free",        icon:"💬", label:"Free Chat",          desc:"Talk about anything with your tutor" },
  { id:"restaurant",  icon:"🍽️", label:"At a Restaurant",    desc:"Order food, ask questions, pay the bill" },
  { id:"job",         icon:"💼", label:"Job Interview",       desc:"Practice professional self-presentation" },
  { id:"travel",      icon:"✈️", label:"Travel & Directions", desc:"Navigate airports, hotels, ask for help" },
  { id:"shopping",    icon:"🛍️", label:"Shopping",            desc:"Prices, sizes, returning items" },
  { id:"doctor",      icon:"🏥", label:"Doctor's Appointment",desc:"Describe symptoms, understand advice" },
];

function ConversationTutor({ language, level, onBack }) {
  const [scenario, setScenario]   = useState(null);
  const [messages, setMessages]   = useState([]);   // {role:"user"|"assistant", text, feedback}
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [micAvailable, setMicAvailable] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);
  const [speaking, setSpeaking]   = useState(false);
  const bottomRef = useRef(null);
  const recognitionRef = useRef(null);

  // Check browser support on mount
  useEffect(() => {
    setMicAvailable(!!(window.SpeechRecognition || window.webkitSpeechRecognition));
    setTtsSupported(!!window.speechSynthesis);
  }, []);

  function scrollBottom() {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior:"smooth" }), 80);
  }

  function speak(text) {
    if (!ttsSupported) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const langCode = language === "German" ? "de-DE" : "en-US";
    utter.lang = langCode;
    utter.rate = 0.9;
    // Prefer a native-sounding voice
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find(v => v.lang.startsWith(langCode.slice(0,2)) && !v.name.includes("Google")) || voices.find(v => v.lang.startsWith(langCode.slice(0,2)));
    if (match) utter.voice = match;
    utter.onstart  = () => setSpeaking(true);
    utter.onend    = () => setSpeaking(false);
    utter.onerror  = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
  }

  function stopSpeaking() {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }

  function startListening() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    recognitionRef.current = rec;
    rec.lang = language === "German" ? "de-DE" : "en-US";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = e => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };
    rec.onerror = () => setIsListening(false);
    rec.onend   = () => setIsListening(false);
    rec.start();
    setIsListening(true);
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setIsListening(false);
  }

  async function startScenario(sc) {
    setScenario(sc);
    setMessages([]);
    setLoading(true);
    const systemMsg = await callClaude(
      buildTutorSystem(language, level, sc),
      "Start the conversation with a natural opening line. Be warm and encouraging."
    );
    const opening = systemMsg?.response || systemMsg?.message || (typeof systemMsg === "string" ? systemMsg : "Hello! Let\'s practice together.");
    const firstMsg = { role:"assistant", text: opening };
    setMessages([firstMsg]);
    speak(opening);
    setLoading(false);
    scrollBottom();
  }

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setInput("");
    const newMessages = [...messages, { role:"user", text:userText }];
    setMessages(newMessages);
    setLoading(true);
    scrollBottom();

    try {
      const history = newMessages.map(m => ({ role: m.role, content: m.text }));
      const res = await fetch("/api/chat", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          system: buildTutorSystem(language, level, scenario),
          messages: history,
        }),
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text || "";

      // Parse JSON response with reply + feedback
      let reply = raw, feedback = null;
      try {
        const parsed = JSON.parse(raw.replace(/```json|```/g,"").trim());
        reply    = parsed.reply    || raw;
        feedback = parsed.feedback || null;
      } catch(e) { /* plain text response, use as-is */ }

      const assistantMsg = { role:"assistant", text:reply, feedback };
      setMessages(prev => [...prev, assistantMsg]);
      speak(reply);
    } catch(e) {
      setMessages(prev => [...prev, { role:"assistant", text:"Sorry, something went wrong. Please try again." }]);
    }
    setLoading(false);
    scrollBottom();
  }

  function buildTutorSystem(lang, lvl, sc) {
    const scenarioCtx = sc?.id === "free"
      ? "Have a friendly free conversation."
      : `You are playing the role of a person in a "${sc?.label}" scenario. Stay in character.`;

    return `You are an encouraging ${lang} language tutor having a conversation with a ${lvl} level student.
${scenarioCtx}

Rules:
- Speak primarily in ${lang} (adjust complexity to ${lvl} level)
- For A1/A2: use simple words, speak mostly in English with some ${lang} phrases
- For B1/B2: mix ${lang} and English naturally
- For C1/C2: speak almost entirely in ${lang}
- After the student speaks, ALWAYS respond with valid JSON:
{
  "reply": "your conversational response in ${lang}",
  "feedback": {
    "pronunciation_tip": "one short tip about a word they used, or null",
    "correction": "gentle grammar correction if needed, or null",
    "new_word": "introduce one relevant new vocabulary word with meaning, or null"
  }
}
- Keep replies concise (2-3 sentences max)
- Be warm, patient, and encouraging. Never make the student feel bad about mistakes.`;
  }

  // ── Scenario picker ──
  if (!scenario) {
    return (
      <div style={{ maxWidth:680, margin:"0 auto", padding:"32px 20px" }}>
        <button onClick={onBack} style={{ background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:14,fontFamily:"inherit",marginBottom:24 }}>
          ← Back
        </button>
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ fontSize:44, marginBottom:12 }}>🎙️</div>
          <h2 style={{ fontSize:28, fontWeight:700, margin:"0 0 8px" }}>Conversation Practice</h2>
          <p style={{ color:C.muted, fontSize:14, margin:0 }}>
            Chat with your AI tutor in <strong style={{color:C.text}}>{language}</strong> · {level} level.
            Speak or type — get live feedback on grammar and pronunciation.
          </p>
          {micAvailable && (
            <div style={{ marginTop:10, display:"inline-flex", alignItems:"center", gap:6, fontSize:12, color:C.green }}>
              <span>●</span> Microphone available
            </div>
          )}
        </div>
        <SectionLabel>Choose a Scenario</SectionLabel>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {CONVO_SCENARIOS.map(sc => (
            <button key={sc.id} onClick={() => startScenario(sc)} style={{
              ...card(false), padding:"18px 16px",
              transition:"all 0.15s",
            }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.accent; e.currentTarget.style.background="rgba(88,166,255,0.06)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.background=C.surface; }}
            >
              <div style={{ fontSize:28, marginBottom:8 }}>{sc.icon}</div>
              <div style={{ fontWeight:700, fontSize:14, marginBottom:4 }}>{sc.label}</div>
              <div style={{ fontSize:12, color:C.muted }}>{sc.desc}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Chat view ──
  return (
    <div style={{ maxWidth:680, margin:"0 auto", display:"flex", flexDirection:"column", height:"calc(100vh - 64px)" }}>
      {/* Chat header */}
      <div style={{
        padding:"14px 20px", borderBottom:`1px solid ${C.border}`,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        background:C.bg, flexShrink:0,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <button onClick={() => { setScenario(null); setMessages([]); stopSpeaking(); }}
            style={{ background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13,fontFamily:"inherit" }}>
            ← Scenarios
          </button>
          <span style={{ color:C.border }}>|</span>
          <span style={{ fontSize:18 }}>{scenario.icon}</span>
          <span style={{ fontWeight:600, fontSize:14 }}>{scenario.label}</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <Badge color="blue">{language}</Badge>
          <Badge color="blue">{level}</Badge>
          {speaking && (
            <button onClick={stopSpeaking} style={{ background:"none",border:"none",color:C.amber,cursor:"pointer",fontSize:12,fontFamily:"inherit" }}>
              ⏹ Stop
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:"auto", padding:"20px", display:"flex", flexDirection:"column", gap:14 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display:"flex", flexDirection:"column", alignItems: msg.role==="user" ? "flex-end" : "flex-start", gap:6 }}>
            {/* Bubble */}
            <div style={{
              maxWidth:"78%",
              background: msg.role==="user" ? C.grad : C.surface,
              border: msg.role==="user" ? "none" : `1px solid ${C.border}`,
              borderRadius: msg.role==="user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              padding:"12px 16px",
              color: msg.role==="user" ? "#0d1117" : C.text,
              fontSize:15, lineHeight:1.6,
              position:"relative",
            }}>
              {msg.text}
              {msg.role==="assistant" && ttsSupported && (
                <button
                  onClick={() => speak(msg.text)}
                  title="Read aloud"
                  style={{
                    position:"absolute", bottom:6, right:8,
                    background:"none",border:"none",cursor:"pointer",
                    fontSize:14, opacity:0.5, padding:2,
                  }}>🔊</button>
              )}
            </div>
            {/* Feedback card */}
            {msg.feedback && (msg.feedback.correction || msg.feedback.pronunciation_tip || msg.feedback.new_word) && (
              <div style={{
                maxWidth:"78%", background:"rgba(88,166,255,0.06)",
                border:`1px solid ${C.accent}33`, borderRadius:10, padding:"10px 14px",
                fontSize:12, display:"flex", flexDirection:"column", gap:6,
              }}>
                {msg.feedback.correction && (
                  <div style={{ display:"flex", gap:6, alignItems:"flex-start" }}>
                    <span style={{ color:C.amber, flexShrink:0 }}>✏️</span>
                    <span style={{ color:C.muted }}><strong style={{color:C.text}}>Correction:</strong> {msg.feedback.correction}</span>
                  </div>
                )}
                {msg.feedback.pronunciation_tip && (
                  <div style={{ display:"flex", gap:6, alignItems:"flex-start" }}>
                    <span style={{ color:"#c792ea", flexShrink:0 }}>🗣️</span>
                    <span style={{ color:C.muted }}><strong style={{color:C.text}}>Pronunciation:</strong> {msg.feedback.pronunciation_tip}</span>
                  </div>
                )}
                {msg.feedback.new_word && (
                  <div style={{ display:"flex", gap:6, alignItems:"flex-start" }}>
                    <span style={{ color:C.green, flexShrink:0 }}>📚</span>
                    <span style={{ color:C.muted }}><strong style={{color:C.text}}>New word:</strong> {msg.feedback.new_word}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ display:"flex", alignItems:"center", gap:8, color:C.muted, fontSize:13 }}>
            <div style={{ display:"flex", gap:4 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{
                  width:7, height:7, borderRadius:"50%", background:C.muted,
                  animation:`bounce 1.2s ease-in-out ${i*0.2}s infinite`,
                }} />
              ))}
            </div>
            <span>Tutor is typing…</span>
          </div>
        )}
        <div ref={bottomRef} />
        <style>{`
          @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-8px)} }
        `}</style>
      </div>

      {/* Input area */}
      <div style={{
        padding:"14px 16px", borderTop:`1px solid ${C.border}`,
        background:C.bg, flexShrink:0,
        display:"flex", gap:10, alignItems:"flex-end",
      }}>
        {micAvailable && (
          <button
            onClick={isListening ? stopListening : startListening}
            title={isListening ? "Stop listening" : "Speak"}
            style={{
              width:44, height:44, borderRadius:"50%", border:"none",
              background: isListening ? C.red : "rgba(88,166,255,0.15)",
              color: isListening ? "#fff" : C.accent,
              fontSize:20, cursor:"pointer", flexShrink:0,
              display:"flex", alignItems:"center", justifyContent:"center",
              animation: isListening ? "pulse 1s ease infinite" : "none",
            }}>
            {isListening ? "⏹" : "🎙️"}
          </button>
        )}
        <div style={{ flex:1, position:"relative" }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder={isListening ? "Listening… speak now" : `Type in ${language} or press 🎙️ to speak…`}
            rows={1}
            style={{
              ...inputSt, resize:"none", paddingRight:48,
              borderRadius:22, padding:"10px 48px 10px 16px",
              lineHeight:1.5, maxHeight:120, overflowY:"auto",
              background: isListening ? "rgba(248,81,73,0.06)" : C.surface,
              borderColor: isListening ? C.red+"66" : C.border,
            }}
          />
        </div>
        <button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          style={{
            width:44, height:44, borderRadius:"50%", border:"none",
            background: input.trim() && !loading ? C.grad : "#21262d",
            color: input.trim() && !loading ? "#0d1117" : C.muted,
            fontSize:18, cursor: input.trim() && !loading ? "pointer" : "not-allowed",
            flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
          }}>
          ➤
        </button>
      </div>
      <style>{`@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(248,81,73,0.4)}50%{box-shadow:0 0 0 8px rgba(248,81,73,0)}}`}</style>
    </div>
  );
}

// ─── Artikel Game ─────────────────────────────────────────────────────────────

function ArtikelLevelSelect({ onSelectLevel, onBack, completedLevels }) {
  const difficulties = ["A1","A2","B1","B2","C1","C2"];
  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 20px" }}>
      <button onClick={onBack} style={{ background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:14,fontFamily:"inherit",marginBottom:24 }}>
        ← Back
      </button>
      <div style={{ textAlign:"center", marginBottom:40 }}>
        <div style={{ fontSize:48, marginBottom:12 }}>🇩🇪</div>
        <h2 style={{ fontSize:30, fontWeight:700, margin:"0 0 8px" }}>Artikel Game</h2>
        <p style={{ color:C.muted, fontSize:14, margin:0 }}>
          Choose the correct article — <strong style={{color:"#4fc3f7"}}>der</strong>, <strong style={{color:"#f06292"}}>die</strong>, or <strong style={{color:"#81c784"}}>das</strong> — for each German noun.
        </p>
      </div>

      {difficulties.map(diff => {
        const dc = DIFFICULTY_COLORS[diff];
        const levelsForDiff = ARTIKEL_LEVELS.filter(l => l.difficulty === diff);
        return (
          <div key={diff} style={{ marginBottom: 24 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
              <span style={{
                padding:"3px 12px", borderRadius:20, fontSize:11, fontWeight:700,
                background:dc.bg, border:`1px solid ${dc.border}`, color:dc.text,
                letterSpacing:1,
              }}>{diff}</span>
              <div style={{ flex:1, height:1, background:C.border }} />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {levelsForDiff.map(lvl => {
                const done = completedLevels[lvl.id];
                return (
                  <button key={lvl.id} onClick={() => onSelectLevel(lvl)} style={{
                    background: done ? dc.bg : C.surface,
                    border: `1px solid ${done ? dc.border : C.border}`,
                    borderRadius:12, padding:"16px 20px", cursor:"pointer",
                    textAlign:"left", fontFamily:"inherit", color:C.text,
                    transition:"all 0.15s", position:"relative",
                  }}
                    onMouseEnter={e=>e.currentTarget.style.borderColor=dc.border}
                    onMouseLeave={e=>e.currentTarget.style.borderColor=done?dc.border:C.border}
                  >
                    {done && (
                      <span style={{ position:"absolute", top:10, right:12, fontSize:16 }}>
                        {done.score === 10 ? "🏆" : done.score >= 7 ? "⭐" : "✓"}
                      </span>
                    )}
                    <div style={{ fontSize:11, color:C.muted, marginBottom:4 }}>Level {lvl.id}</div>
                    <div style={{ fontSize:15, fontWeight:700, marginBottom:4, color: done ? dc.text : C.text }}>{lvl.label}</div>
                    <div style={{ fontSize:11, color:C.muted }}>{lvl.words.length} words</div>
                    {done && (
                      <div style={{ fontSize:11, color:dc.text, marginTop:6 }}>
                        Best: {done.score}/10 correct
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ArtikelGamePlay({ level, onFinish, onBack }) {
  const [wordIdx, setWordIdx]   = useState(0);
  const [chosen, setChosen]     = useState(null);   // "der"|"die"|"das"|null
  const [results, setResults]   = useState([]);      // {word, artikel, chosen, correct}[]
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);

  const word = level.words[wordIdx];
  const ARTIKELS = ["der","die","das"];

  const ARTIKEL_COLORS = {
    der: { active:"#4fc3f7", bg:"rgba(79,195,247,0.15)", border:"rgba(79,195,247,0.5)" },
    die: { active:"#f06292", bg:"rgba(240,98,146,0.15)", border:"rgba(240,98,146,0.5)" },
    das: { active:"#81c784", bg:"rgba(129,199,132,0.15)", border:"rgba(129,199,132,0.5)" },
  };

  function handleChoose(art) {
    if (showResult) return;
    setChosen(art);
    setShowResult(true);
  }

  function handleNext() {
    const correct = chosen === word.artikel;
    const newResults = [...results, { word: word.word, artikel: word.artikel, chosen, correct, meaning: word.meaning }];
    setResults(newResults);

    if (wordIdx + 1 >= level.words.length) {
      setFinished(true);
    } else {
      setWordIdx(i => i + 1);
      setChosen(null);
      setShowResult(false);
    }
  }

  const score = results.filter(r => r.correct).length;
  const progress = ((wordIdx) / level.words.length) * 100;

  if (finished) {
    const finalScore = results.filter(r => r.correct).length;
    const pct = Math.round((finalScore / level.words.length) * 100);
    const scoreColor = pct >= 80 ? C.green : pct >= 50 ? C.amber : C.red;
    return (
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "40px 20px", textAlign:"center" }}>
        <div style={{ fontSize:64, marginBottom:16 }}>
          {pct===100?"🏆":pct>=80?"⭐":pct>=50?"👍":"💪"}
        </div>
        <h2 style={{ fontSize:28, fontWeight:700, margin:"0 0 6px" }}>Level {level.id} Complete!</h2>
        <div style={{ fontSize:42, fontWeight:700, color:scoreColor, margin:"16px 0 4px" }}>
          {finalScore}/{level.words.length}
        </div>
        <p style={{ color:C.muted, marginBottom:32 }}>
          {pct===100?"Perfect! Flawless run! 🎉":pct>=80?"Great job! Almost perfect.":pct>=50?"Good effort, keep practicing!":"Keep going — repetition is key!"}
        </p>

        {/* Per-word results */}
        <div style={{ textAlign:"left", marginBottom:28 }}>
          <SectionLabel>Word by Word</SectionLabel>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {results.map((r, i) => (
              <div key={i} style={{
                display:"flex", alignItems:"center", justifyContent:"space-between",
                background:C.surface, border:`1px solid ${r.correct?C.green+"33":C.red+"33"}`,
                borderRadius:8, padding:"8px 14px",
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span>{r.correct?"✅":"❌"}</span>
                  <span style={{ fontWeight:700, fontSize:15 }}>{r.artikel} {r.word}</span>
                  <span style={{ fontSize:12, color:C.muted }}>— {r.meaning}</span>
                </div>
                {!r.correct && (
                  <span style={{ fontSize:12, color:C.red }}>you said: <strong>{r.chosen}</strong></span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
          <Btn size="lg" onClick={() => onFinish(finalScore)}>← Back to Levels</Btn>
          <Btn size="lg" ghost onClick={() => {
            setWordIdx(0); setChosen(null); setResults([]); setShowResult(false); setFinished(false);
          }}>↺ Play Again</Btn>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "32px 20px" }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <button onClick={onBack} style={{ background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13,fontFamily:"inherit" }}>
          ← Levels
        </button>
        <span style={{ color:C.muted, fontSize:13 }}>
          {wordIdx + 1} / {level.words.length} · {score} correct
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ height:4, background:C.surface, borderRadius:2, marginBottom:32 }}>
        <div style={{ height:4, background:C.grad, borderRadius:2, width:`${progress}%`, transition:"width 0.3s" }} />
      </div>

      {/* Word card */}
      <div style={{
        background: C.surface, border:`1px solid ${C.border}`,
        borderRadius:20, padding:"48px 32px", textAlign:"center", marginBottom:32,
        position:"relative",
      }}>
        {showResult && (
          <div style={{
            position:"absolute", top:16, right:16,
            fontSize:28, animation:"popIn 0.2s ease",
          }}>
            {chosen === word.artikel ? "✅" : "❌"}
          </div>
        )}
        <p style={{ fontSize:12, color:C.muted, letterSpacing:2, textTransform:"uppercase", margin:"0 0 12px" }}>
          What is the Artikel?
        </p>
        <div style={{ fontSize:52, fontWeight:700, margin:"0 0 8px", letterSpacing:-1 }}>
          {showResult
            ? <span style={{ color: chosen===word.artikel?C.green:C.red }}>{word.artikel} {word.word}</span>
            : <span>{word.word}</span>
          }
        </div>
        {showResult && (
          <p style={{ color:C.muted, fontSize:14, margin:"8px 0 0" }}>
            {word.meaning}
            {chosen !== word.artikel && (
              <span style={{ display:"block", color:C.red, marginTop:4, fontSize:13 }}>
                You chose <strong>{chosen}</strong> — correct is <strong style={{color:C.green}}>{word.artikel}</strong>
              </span>
            )}
          </p>
        )}
      </div>

      {/* Artikel buttons */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:20 }}>
        {ARTIKELS.map(art => {
          const ac = ARTIKEL_COLORS[art];
          const isChosen = chosen === art;
          const isCorrect = art === word.artikel;
          const showCorrect = showResult && isCorrect;
          const showWrong = showResult && isChosen && !isCorrect;
          return (
            <button key={art} onClick={() => handleChoose(art)} disabled={showResult} style={{
              padding:"18px 0", borderRadius:14, border:"2px solid",
              background: showCorrect ? ac.bg : showWrong ? "rgba(248,81,73,0.15)" : isChosen ? ac.bg : C.surface,
              borderColor: showCorrect ? ac.border : showWrong ? C.red+"88" : isChosen ? ac.border : C.border,
              color: showCorrect ? ac.active : showWrong ? C.red : C.text,
              fontSize:22, fontWeight:700, fontFamily:"inherit",
              cursor: showResult ? "default" : "pointer",
              transition:"all 0.15s", transform: isChosen&&!showResult?"scale(1.04)":"scale(1)",
            }}>
              {art}
            </button>
          );
        })}
      </div>

      {showResult && (
        <div style={{ textAlign:"center" }}>
          <Btn size="lg" onClick={handleNext} style={{ width:"100%" }}>
            {wordIdx + 1 >= level.words.length ? "See Results →" : "Next Word →"}
          </Btn>
        </div>
      )}

      <style>{`@keyframes popIn{from{transform:scale(0.5);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────

export default function App() {
  const [appState, setAppState] = useState("setup");
  const [isLoading, setIsLoading]     = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [language, setLanguage]       = useState("");
  const [level, setLevel]             = useState("");
  const [exType, setExType]           = useState("fill-in-the-blank");
  const [exercise, setExercise]       = useState(null);
  const [results, setResults]         = useState(null);
  const [error, setError]             = useState("");
  const [artikelLevel, setArtikelLevel]   = useState(null);
  const [completedArtikel, setCompletedArtikel] = useState({}); // {levelId: {score}}
  const [speakLang, setSpeakLang]     = useState("");
  const [speakLevel, setSpeakLevel]   = useState("");

  async function handleStart(lang, lvl, type, topic, custom) {
    setLanguage(lang); setLevel(lvl); setExType(type);
    setIsLoading(true); setError("");
    try {
      const data = await generateExercise(lang,lvl,type,topic,custom);
      setExercise(data); setAppState("exercise");
    } catch(e) { setError(e.message||"Failed to generate exercise. Please try again."); }
    setIsLoading(false);
  }

  async function handleSubmit(answers) {
    setIsAnalyzing(true);
    try {
      const data = await analyzeResults(language,level,exType,exercise,answers);
      setResults(data); setAppState("results");
    } catch(e) { setError("Failed to analyze results."); }
    setIsAnalyzing(false);
  }

  async function handleContinue() {
    setExercise(null); setResults(null); setIsLoading(true); setAppState("setup");
    try {
      const data = await generateExercise(language,level,exType);
      setExercise(data); setAppState("exercise");
    } catch(e) { setError("Failed to generate exercise."); setAppState("setup"); }
    setIsLoading(false);
  }

  async function handleSuggested(type,sugLevel) {
    const t = type.toLowerCase().includes("match")?"matching":type.toLowerCase().includes("read")?"reading":"fill-in-the-blank";
    await handleStart(language, sugLevel||level, t);
  }

  function reset() { setExercise(null); setResults(null); setAppState("setup"); setError(""); }

  return (
    <div style={base}>
      {/* Navbar */}
      <nav style={{
        padding:"16px 32px", borderBottom:`1px solid ${C.border}`,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        position:"sticky", top:0, background:C.bg, zIndex:10,
      }}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{
            width:32,height:32,borderRadius:8,background:C.grad,
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,
          }}>G</div>
          <span style={{fontSize:18,fontWeight:700}}>
            Grammar<span style={{background:C.grad,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Guru</span>
          </span>
        </div>
        <div style={{display:"flex",gap:10}}>
          {language && <Badge color="blue">{language}</Badge>}
          {level    && <Badge color="blue">{level}</Badge>}
          {appState==="artikel-play" && artikelLevel && <Badge color="blue">Level {artikelLevel.id} · {artikelLevel.difficulty}</Badge>}
          {appState!=="setup" && <Btn ghost size="sm" onClick={()=>{reset();setArtikelLevel(null);setSpeakLang("");setSpeakLevel("");}}>← Home</Btn>}
        </div>
      </nav>

      {/* Error */}
      {error && (
        <div style={{background:"rgba(248,81,73,0.1)",border:`1px solid ${C.red}44`,color:C.red,padding:"10px 20px",textAlign:"center",fontSize:13}}>
          ⚠ {error}
        </div>
      )}

      {/* Loading overlay */}
      {isLoading && (
        <div style={{maxWidth:680,margin:"0 auto"}}><Spinner/></div>
      )}

      {/* Views */}
      {!isLoading && appState==="setup" && (
        <SetupView
          onStart={handleStart} isLoading={isLoading}
          defaultLanguage={language} defaultLevel={level}
          onPlacementTest={lang=>{setLanguage(lang);setAppState("placement");}}
          onArtikelGame={()=>setAppState("artikel-select")}
          onSpeak={()=>{ setSpeakLang(language); setSpeakLevel(level); setAppState("speak"); }}
        />
      )}
      {appState==="speak" && (
        <ConversationTutor
          language={speakLang || language || "English"}
          level={speakLevel || level || "B1"}
          onBack={()=>setAppState("setup")}
        />
      )}
      {appState==="artikel-select" && (
        <ArtikelLevelSelect
          onSelectLevel={lvl=>{setArtikelLevel(lvl);setAppState("artikel-play");}}
          onBack={()=>setAppState("setup")}
          completedLevels={completedArtikel}
        />
      )}
      {appState==="artikel-play" && artikelLevel && (
        <ArtikelGamePlay
          level={artikelLevel}
          onFinish={score=>{
            setCompletedArtikel(p=>({...p,[artikelLevel.id]:{score}}));
            setAppState("artikel-select");
          }}
          onBack={()=>setAppState("artikel-select")}
        />
      )}
      {!isLoading && appState==="placement" && (
        <PlacementTest
          language={language}
          onComplete={lvl=>{setLevel(lvl);setAppState("setup");}}
          onSkip={()=>setAppState("setup")}
        />
      )}
      {!isLoading && appState==="exercise" && exercise && (
        <ExerciseView
          exerciseType={exType} exercise={exercise}
          onSubmit={handleSubmit} onBack={reset} isAnalyzing={isAnalyzing}
        />
      )}
      {!isLoading && appState==="results" && results && (
        <ResultsView
          results={results} onNewExercise={reset}
          onContinue={handleContinue} onSuggestedExercise={handleSuggested}
          exercise={exercise} exerciseType={exType}
        />
      )}

    </div>
  );
}
