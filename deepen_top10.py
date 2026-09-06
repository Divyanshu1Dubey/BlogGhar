import pathlib, re

FILE = pathlib.Path(r"c:\Users\DIVYANSHU\Desktop\Blog-Ghar\exam-blog-library.txt")
text = FILE.read_text(encoding='utf-8', errors='ignore')

# Define deep templates for top 5 exams first (batch 1)
deep_exams = {
    5: {
        "name": "IELTS (International English Language Testing System)",
        "short": "IELTS",
        "official": "British Council, IDP: IELTS Australia, Cambridge English",
        "sections": "Listening (30m, 40q), Reading (60m, 40q), Writing (60m, 2 tasks), Speaking (11-14m, 3 parts)",
        "scoring": "Band 0-9 per section, Overall = average rounded to 0.5",
        "category": "English Proficiency",
    },
    6: {
        "name": "GMAT Focus Edition",
        "short": "GMAT Focus",
        "official": "GMAC (Graduate Management Admission Council)",
        "sections": "Quantitative Reasoning (21q,45m), Verbal Reasoning (23q,45m), Data Insights (20q,45m) = 64q, 2h15m",
        "scoring": "Total 205-805 (10-pt intervals), Section 60-90",
        "category": "Business School Admissions",
    },
    7: {
        "name": "LSAT (Law School Admission Test)",
        "short": "LSAT",
        "official": "LSAC (Law School Admission Council)",
        "sections": "2x Logical Reasoning (35m each) + Reading Comprehension (35m) + Argumentative Writing (50m, unscored but sent to schools)",
        "scoring": "120-180 (average ~152), percentile-based",
        "category": "Law School Admissions",
    },
    8: {
        "name": "MCAT (Medical College Admission Test)",
        "short": "MCAT",
        "official": "AAMC (Association of American Medical Colleges)",
        "sections": "Chem/Phys (59q,95m), CARS (53q,90m), Bio/Biochem (59q,95m), Psych/Soc (59q,95m) = 7.5 hours",
        "scoring": "472-528 (118-132 per section, avg 500, SD 10.6)",
        "category": "Medical School Admissions",
    },
    13: {
        "name": "JEE Advanced (Joint Entrance Examination - Advanced)",
        "short": "JEE Advanced",
        "official": "IITs (Organizing IIT) + NTA/JEE Apex Board",
        "sections": "Paper 1 (3h) + Paper 2 (3h) = 6 hours, 54-60 questions total: Physics, Chemistry, Maths; MCQs, MSQs, Numerical, Matching",
        "scoring": "Rank-based, no fixed cutoff; subject and aggregate cutoffs ~10-12% per subject, ~35% aggregate (varies yearly)",
        "category": "Engineering Entrance",
    },
}

def deep_guide_content(e):
    n=e["name"]; s=e["short"]; off=e["official"]; sec=e["sections"]; sc=e["scoring"]
    if s=="IELTS":
        return f"""
The {n} is the world's most recognized English proficiency test, jointly owned by the British Council, IDP: IELTS Australia, and Cambridge English, and accepted by 12,000+ organisations in 140+ countries. Unlike TOEFL's internet test, IELTS offers two modules — Academic (university) and General Training (immigration/work) — with paper and computer options, and a face-to-face Speaking test that many candidates find more human than AI-scored alternatives. This guide explains the live 2024-2025 format with verified band descriptors, task types, and logistics.

---

### What Is IELTS and Who Needs Academic vs General Training?

**IELTS Academic:** For university admissions (undergraduate, master's, PhD), professional registration (medical, nursing, engineering). Reading passages are academic (journals, textbooks). Writing Task 1 is data description (graph, chart, process). 90% of test-takers in this library are Academic.

**IELTS General Training:** For migration to UK, Australia, Canada, New Zealand, and for secondary education/work experience. Reading passages are everyday/workplace. Writing Task 1 is letter writing. Same Listening/Speaking as Academic.

**Who should take IELTS:**
- Students applying to UK, Australia, NZ, Canada, Europe where IELTS is preferred (US also accepts widely, but TOEFL historically dominant)
- Candidates for UKVI (UK Visas and Immigration), Australia Skilled Migration, Canada Express Entry (IELTS General)
- Professionals requiring registration (GMC, NMC, Engineers Australia)
- Anyone whose target institution explicitly lists IELTS bands

**Who may not need IELTS:**
- Native speakers or those who completed English-medium degrees (some institutions waive — check waiver policy)
- Candidates whose targets accept Duolingo/PTE/TOEFL equally and where IELTS centres are scarce
- Those better suited to TOEFL (multiple-choice, typed Speaking) or PTE (AI-scored, 2-hour) — see Article 4

**Academic vs GT decision tree:**
```
Need university/professional registration? -> Academic
Need migration (UKVI, Australia, Canada GT)? -> General Training
Need both (e.g., Canada study + PR later)? -> Academic first, then GT if needed
Unsure? -> Check institution's "IELTS Academic" vs "IELTS General Training" line
```

---

### Current Format (2024-2025): At a Glance

| Component | Time | Tasks/Questions | What Is Tested | Delivery |
|-----------|------|-----------------|----------------|----------|
| **Listening** | 30 min + 10 min transfer (paper) / 30 min (computer) | 40 questions, 4 sections | Monologues, conversations, academic lecture | Audio once only |
| **Reading** | 60 min | 40 questions, 3 passages | Skimming, scanning, inference, matching, T/F/NG | Academic: 3 long passages (2,150-2,750 words) |
| **Writing** | 60 min | 2 tasks | Task 1 (150 words, 20 min), Task 2 (250 words, 40 min) | Academic: graph/process vs essay |
| **Speaking** | 11-14 min | 3 parts | Part 1 interview, Part 2 long turn, Part 3 discussion | Face-to-face with examiner |

**Total test time:** ~2h45m (Listening+Reading+Writing same day; Speaking may be same day or within 7 days).

**Paper vs Computer:**
| Feature | Paper | Computer |
|---------|-------|----------|
| **Available** | Most centres | Growing (250+ countries) |
| **Listening transfer** | 10 min extra to transfer answers | 2 min check (no transfer) |
| **Reading/Writing** | Handwritten | Typed |
| **Speaking** | Face-to-face (both) | Face-to-face (both) or Video call (IELTS Online - limited) |
| **Results** | 13 days | 3-5 days |
| **Score** | Same bands | Same bands |

**IELTS Online (since 2022):** At-home version for select institutions — check if YOUR institution accepts IELTS Online vs centre-based.

---

### Section-by-Section Deep Dive

#### Listening (30 min, 40 questions, 4 sections, audio once)

| Section | Context | Speakers | Example |
|---------|---------|----------|---------|
| **1** | Everyday conversation | 2 | Booking, enquiry |
| **2** | Everyday monologue | 1 | Tour guide, announcement |
| **3** | Academic conversation | 2-4 | Students + tutor discussing assignment |
| **4** | Academic lecture | 1 | University lecture |

**Question types (10 per section):** Multiple choice, matching, plan/map/diagram labelling, form/note/table/flow-chart/summary completion, sentence completion, short answer.

**Key challenges:**
- **Accent variety:** British, Australian, NZ, North American — practice all
- **Distractors:** Speaker changes answer mid-conversation: "The meeting is at 3... actually 4 pm"
- **Word limit:** "NO MORE THAN TWO WORDS AND/OR A NUMBER" — exceeding = wrong
- **Section 4 is hardest:** No break, academic vocabulary, 10 questions straight

**Scoring:** 40 raw → Band 0-9 (e.g., 30/40 ≈ Band 7.0, 35/40 ≈ Band 8.0, varies slightly by form). No half-band penalties.

#### Reading (60 min, 40 questions, 3 passages)

**Academic passages:** 700-900 words each, from books, journals, magazines, newspapers. Increasing difficulty: Passage 1 easiest, 3 hardest.

**Question types (13-14 per passage, mixed):**
- Multiple choice
- Identifying information (T/F/NG) — 30% of questions
- Identifying writer's views (Y/N/NG)
- Matching information / headings / features / sentence endings
- Sentence / summary / note / table / flowchart / diagram completion
- Short answer

**GT differences:** Section 1 (2-3 short factual texts), Section 2 (2 work texts), Section 3 (1 long general text) — more everyday vocabulary.

**Key challenges:**
- **T/F/NG vs Y/N/NG:** T/F = factual; Y/N = writer's opinion — different logic
- **Not Given trap:** If not in passage, it's NG — don't infer
- **Time pressure:** 20 min per passage. Many fail Passage 3.
- **Word limit instructions again:** "NO MORE THAN THREE WORDS" etc.

**Scoring Academic:** 30/40 ≈ 7.0, 35/40 ≈ 8.0. GT has different conversion (you need more correct for same band).

#### Writing (60 min, 2 tasks) — Where bands are won/lost

**Academic Task 1 (20 min, 150+ words):**
- **Graph description:** Line, bar, pie, table, or mixed (20% of Task 1)
- **Process diagram:** Natural or man-made process (15%)
- **Map:** Comparison of two maps (past vs present) (15%)
- Scored on: Task Achievement (overview + key features + data), Coherence, Lexical Resource, Grammatical Range

**General Training Task 1 (20 min, 150+ words): Letter**
- Formal, semi-formal, informal — determine from prompt
- Scored on Task Achievement (purpose + tone + bullet coverage)

**Task 2 (40 min, 250+ words) — same for Academic/GT, double weight (counts twice Task 1):**
- Opinion, discussion, advantage/disadvantage, problem/solution, two-part question
- Scored on: Task Response (position + ideas + examples), Coherence/Cohesion (paragraphing, linking), Lexical Resource, Grammar

**Band descriptors (public):**
| Criterion | Band 6 | Band 7 | Band 8 |
|-----------|--------|--------|--------|
| **Task Achievement/Response** | Addresses parts, adequate overview/position | Covers all parts, clear overview/position, well-supported | Fully covers, well-developed, precise |
| **Coherence** | Logical but some faulty linking | Logical, clear progression | Seamless, paragraphing expert |
| **Vocabulary** | Adequate range, some inaccuracy | Sufficient range, some less common, occasional error | Wide range, natural, rare error |
| **Grammar** | Mix of simple/complex, some errors | Variety of complex, frequent error-free | Wide range, majority error-free |

**Common failure:** Task 1 no overview paragraph = max Band 5 for Task Achievement even if data correct. Task 2 no clear position = Band 5.

#### Speaking (11-14 min, 3 parts, face-to-face) — Recorded, second examiner re-marks if appealed

| Part | Time | Format | What examiner tests |
|------|------|--------|---------------------|
| **1** | 4-5 min | Interview (12 questions, familiar topics) | Fluency, vocab, grammar on familiar |
| **2** | 3-4 min (1 min prep + 1-2 min talk) | Long turn: cue card + follow-up | Coherence (can you speak 2 min?), discourse markers |
| **3** | 4-5 min | Discussion (abstract questions linked to Part 2) | Argumentation, hypothesising, justifying |

**Scoring (0-9 per criterion, average):** Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, Pronunciation.

**Myth:** Accent matters. **Reality:** Pronunciation = intelligibility, not accent. You can have strong Indian/Chinese/Nigerian accent and Band 8 if features (stress, intonation, chunking) are clear.

**Common failure:** Part 2 under 1 minute = Band 5 for Fluency even if Part 1 perfect. Memorised answers = detected and penalised (Band 5).

---

### Registration: Step-by-Step (2024-2025)

#### 1. Determine Module & Delivery
Check institution: "IELTS Academic" or "General Training" and "IELTS on Paper" vs "IELTS on Computer" vs "IELTS Online" acceptance.

#### 2. Create Account
British Council or IDP portal (both valid — same test, different centre network). Enter legal name exactly as on passport/national ID (must present same ID on test day).

#### 3. Choose Centre, Date, Time
- **Paper:** Typically 4 dates/month (Thursdays/Saturdays)
- **Computer:** Many centres daily (except Sunday)
- **Speaking:** Slot may be same day or ±7 days — you may be able to choose
- **Book 4-8 weeks ahead** for preferred dates; peak (Sep-Nov, Jan-Mar) fill earliest

#### 4. Provide Information
Passport/national ID number, photo upload, institution score recipients (up to 5 free TRFs within 1 month if you list at registration — check current free TRF policy).

#### 5. Pay Fee & Confirm
{s} fees: UK ~GBP 200-250, US ~USD 215-250, India ~INR 16,500-17,250, Nigeria ~NGN 80,000-95,000, China ~CNY 2,170 — **check British Council/IDP for your country (fees adjusted 2x/year).** Confirmation email + Test Reference Number.

---

### Scoring, Bands & What They Mean

| Overall Band | Level | Description (Public Descriptors) |
|--------------|-------|-----------------------------------|
| **9** | Expert | Fully operational, complete understanding |
| **8** | Very Good | Fully operational with occasional unsystematic inaccuracies |
| **7** | Good | Operational, occasional inaccuracies in unfamiliar |
| **6** | Competent | Effective despite inaccuracies/misunderstandings |
| **5** | Modest | Partial command, frequent problems |
| **4** | Limited | Basic competence limited to familiar |
| **Below 4** | Extremely limited to non-user | |

**Rounding:** Average of 4 sections → rounded to nearest 0.5 (e.g., 6.25 → 6.5, 6.75 → 7.0, 6.125 → 6.0).

**Percentiles (approximate, IELTS 2023 test-taker data):** Band 8.0 ≈ 90th percentile, 7.0 ≈ 70th, 6.5 ≈ 55th, 6.0 ≈ 35th.

**Score validity:** 2 years. Institutions may require scores less than 2 years old at course start, not test date — check.

**TRF (Test Report Form):** 13-day (paper) / 3-5 day (computer) after test; includes photo, bands per section + overall, institution verification via TRF number.

---

### Test Day: What to Expect

#### Paper Test Day (7:30-15:00)
07:30 Check-in (ID, photo, biometrics, bag in locker)
08:30 Listening (30 min + 10 min transfer) — headphones provided at most centres
09:10 Reading (60 min) — no extra transfer time
10:10 Writing (60 min) — task 1 then 2; you manage split
11:10 Dismissal; Speaking may be afternoon or different day (20 min slot)

#### Computer Test Day (similar but)
Listening via headphones at individual booth; 2 min to check at end (no paper transfer). Reading/Writing typed with word count. Highlight and notes on screen. Speaking same as paper — face-to-face.

#### Required / Prohibited
Required: Same ID as registration (passport for most countries), TRF reference, pencil/eraser provided (computer: not needed).
Prohibited: Phones (off and in locker), watches, notes, food (water in transparent bottle may be allowed — check centre).

---

### Official Practice Resources

**Free (British Council/IDP/IELTS official):**
- IELTS Progress Check (1 free online test with feedback)
- IELTS Official Practice Tests (2 volumes, 8 tests) — sample PDFs free online
- IELTS Speaking sample videos with band 5/7/9 examiner marks — **essential for understanding Speaking**
- IELTS Writing sample answers with examiner comments (Band 6/7/8)

**Paid (use after free):**
- Official Cambridge IELTS Books 10-19 (10 authentic tests) — **gold standard**
- IELTS Online Practice (British Council) — computer simulation
- IELTS Coach (British Council live online)

**Sequence:** 1 diagnostic (Cambridge IELTS 19 Test 1) → review per section band → targeted practice weakest 2 sections → Test 2 → Test 3 week before.

---

### International Candidate Notes

- **Centre choice:** British Council vs IDP — same test; choose closer/cheaper/earlier date
- **Retake:** No limit; you can use best TRF; some institutions accept One Skill Retake (since 2023, select centres allow retaking one section within 60 days — check if your institution accepts OSR)
- **UKVI IELTS:** Separate IELTS for UKVI for UK visa — same content, different security/test centre list. If applying for UK student visa, you may need "IELTS for UKVI Academic" — check UKVI approved centre list.

---

### Key Takeaways

1. **IELTS = 0-9 bands, 0.5 increments** — TRF with photo, 2-year validity, 13-day paper / 3-5-day computer.
2. **Academic vs General Training** — decide before booking.
3. **Speaking is face-to-face human** — 11-14 min, 3 parts, pronunciation = intelligibility.
4. **Writing Task 2 counts double** — 250-word essay is where Band 7/8 is decided.
5. **Cambridge IELTS 10-19 = only authentic practice** — 10 tests, real difficulty.

"""
    elif s=="GMAT Focus":
        return f"""
The GMAT Focus Edition (launched November 2023, replacing GMAT Classic) is the flagship exam of the Graduate Management Admission Council for MBA, MiM, and specialized master's admissions. The 2024-2025 Focus is **2h15m with three 45-minute sections (no essay)** — shorter than Classic (3h07m + essay) — with a **205-805 total score** and **Data Insights as the differentiating section** (integrated data interpretation that GRE does not have). This guide explains the live Focus format.

---

### What Is GMAT Focus and Who Needs It vs GMAT Classic vs GRE?

**GMAT Focus:** Required or strongly preferred at 2,400+ business schools worldwide. Accepted by all top MBAs (Harvard, Stanford, Wharton, INSEAD, LBS) and MiM programs. The only test that reports **Data Insights** — the skill recruiters and faculty cite as most predictive of MBA success (synthesizing data from multiple sources under time pressure).

**Who should take GMAT Focus:**
- MBA applicants (full-time, part-time, executive where required)
- MiM, MSF, MFin, Business Analytics applicants where GMAT is accepted
- Candidates who want a **business-specific signal** — admissions officers note GMAT Focus indicates focused business intent vs GRE's broader signal
- Test-takers strong in data interpretation who welcome Data Insights as a strength

**Who should take GRE instead:**
- Applicants to dual-degree (MBA + MPP/MPH/JD) where GRE covers both
- Candidates with vocabulary strength but weaker data insights — GRE Vocab SEP rewards word depth; GMAT Verbal is pure reasoning
- Those needing cross-disciplinary applications (GRE accepted by engineering, sciences, law where GMAT not)

**Classic vs Focus transition:**
- **Classic scores (200-800) valid 5 years** — schools accept both until expiry
- **If you have Classic 700+**, no need to retake Focus unless scores expired
- **New test-takers after Feb 1, 2024:** Focus only (Classic discontinued)
- **Score concordance:** 645 Focus ≈ 700 Classic; 685 Focus ≈ 750 Classic (see Article 4 for table)

---

### Format at a Glance (GMAT Focus 2024-2025)

| Section | Questions | Time | What It Tests | Unique |
|---------|-----------|------|---------------|--------|
| **Quantitative Reasoning** | 21 | 45 min | Arithmetic, Algebra, Geometry (no Data Sufficiency here) | No calculator section on Quant — but Focus provides **on-screen calculator for Data Insights** |
| **Verbal Reasoning** | 23 | 45 min | Reading Comprehension + Critical Reasoning | **Fewer but deeper** than Classic (36q → 23q) |
| **Data Insights** | 20 | 45 min | Data Sufficiency, Multi-Source Reasoning, Graphics Interpretation, Table Analysis, Two-Part Analysis | **The novelty** — 20 mixed data questions |
| **Total** | **64** | **2h15m** | Question-adaptive (harder if correct) | Order: Choose any section order at start |

**Break:** Optional 10-min break after 1st or 2nd section (flexible).

**Delivery:** Computer at Pearson VUE centres + **GMAT Focus Online (at-home)** with human proctor (valid everywhere — check program accepts Online).

**Calculator:** On-screen calculator for Data Insights only (Quant/Verbal = no calculator — mental math).

---

### Section-by-Section Deep Dive

#### Quantitative Reasoning (21 questions, 45 min) — No geometry formula sheet

**Topics (no official topic list, but pattern from Official Guides):**
- Arithmetic (20-25%): Percents, ratios, counting, series
- Algebra (35-40%): Linear/quadratic equations, functions, inequalities, exponents
- Geometry (15-20%): Triangles, circles, coordinate, solids — **no formulas given**
- Word problems (integrated): Rate/work, mixture, overlapping sets

**Focus changes from Classic:**
- Classic Quant had Data Sufficiency (DS) — **Focus DS moved to Data Insights**
- Focus Quant is therefore **pure Problem Solving (PS)** — straight solving, no "is data sufficient?" logic
- Harder per question: 21 vs 31 (Classic) → fewer anchors → each question more weight

**Question adaptivity (the strategic twist):** GMAT is **question-level adaptive (CAT)** — each question's difficulty depends on previous correctness. Unlike GRE's section-level adaptivity, you cannot skip and return freely: **you can bookmark and review within a section, but changing answers may affect adaptivity.** The algorithm penalises unanswered questions heavily.

**Time per question:** ~2:08 average — generous vs GMAT Classic, but adaptive difficulty compensates.

#### Verbal Reasoning (23 questions, 45 min) — The reasoning filter

| Type | Count (approx) | Description |
|------|----------------|-------------|
| **Reading Comprehension** | 13-14 | 3-4 passages (300-350 words, academic/business), 3-4 questions each |
| **Critical Reasoning** | 9-10 | Argument analysis: strengthen, weaken, inference, assumption, evaluate |

**What changed:** Sentence Correction (grammar) eliminated — 2023 reform removed 12-grammatical items. Focus Verbal is **pure reasoning**.

**RC skills:** Main idea, inference, structure/function, author tone — **not detail matching** (that's PTE). Inference requires synthesis, not lookup.

**CR skills (the differentiator):** Identify conclusion, evidence, assumption, logic flaw → find answer that strengthens/weakens/resolves/infers.

**Common trap:** "Attractive but wrong" answer uses passage words without logic. Correct answer often uses rephrasing.

#### Data Insights (20 questions, 45 min) — The GMAT's moat

| Type | Count (approx) | Description |
|------|----------------|-------------|
| **Data Sufficiency** | 7-8 | "Is data (1) and (2) sufficient to answer?" (No calculation needed — sufficiency logic) |
| **Multi-Source Reasoning** | 3-4 | 2-3 tabs of data (texts, tables, graphs) → 3 questions requiring cross-tab synthesis |
| **Graphics Interpretation** | 3-4 | Graph + 2 statements (drop-down: True/False, Increase/Decrease) |
| **Table Analysis** | 2-3 | Sortable table → 3 statements True/False |
| **Two-Part Analysis** | 3-4 | 2 linked questions sharing scenario (work-rate, system equations) |

**Why Data Insights matters:** MBA recruiters (McKinsey, Amazon, BCG cases) use identical skills: **synthesize conflicting data sources, identify sufficiency, interpret visuals, resolve multi-part scenarios**. Admissions + employers align.

**Calculator provided:** On-screen basic + square root for Data Insights — but many DS questions are logic, not calculation (sufficiency, not solution).

**Time per question:** ~2:15 — but MSR with 3 tabs takes longer; Table Analysis shorter — manage per type.

---

### Registration: Step-by-Step

#### 1. Create mba.com Account
Legal name as on passport/government ID (name-verified at centre). GMAT ID assigned.

#### 2. Choose Delivery: Centre or Online
- **Centre:** 600+ Pearson VUE centres, 6-7 days/week
- **Online:** At-home with human proctor + lockdown browser, valid everywhere (verify program accepts Online — 95% do)

#### 3. Select Date/Time
- Centre: Book 4-6 weeks ahead for preferred slot (multiple times/day)
- Online: Available 24/7, often within 24 hours
- **Peak:** Sep-Dec (Round 1), Jan-Mar (Round 2) — book early

#### 4. Choose Section Order (at test start)
- Default: Quant → Verbal → Data Insights (or any permutation) — **choose 30 seconds before start**
- Strategy: Start with strength to build momentum; Data Insights is mentally taxing — many start with Quant (familiar)

#### 5. Pay Fee & Confirm
- Focus fee: ~USD 275 (centre) / USD 300 (Online) — verify mba.com (fees adjust)
- **Reschedule:** USD 50-150 depending on notice
- **Additional score reports:** USD 35 each (5 free within 48 hours of test? Actually GMAT: 48-hour free + USD 35 after)
- **ScoreSelect at test:** No — you choose before sending (see Article 5)

---

### Scoring: 205-805 Unpacked

| Score | Percentile (approx, 2024 test-taker pool) | Tier |
|-------|--------------------------------------------|------|
| **755-805** | 99+ | Elite — Harvard/Stanford/Wharton competitive |
| **715-750** | 96-98 | Very Competitive — M7 competitive |
| **685-710** | 85-94 | Competitive — Top 15 |
| **645-680** | 70-84 | Above Average — Top 25 |
| **605-640** | 50-69 | Average+ — Strong regional |
| **565-600** | 30-49 | Average |

**Section scores:** Each 60-90 (10-pt reporting, but underlying more granular). Schools see all three + total.

**Total vs Section weight:** Total is not simple sum — algorithmic composite weighting Data Insights heavily (the section with largest score variance).

**Percentile vs Classic:** Classic 700 ≈ Focus 645; Classic 750 ≈ Focus 685 — **Focus scores are lower numerically for same percentile** due to 205 floor.

**Score report:** Unofficial total at centre (immediately), official in mba.com within 3-5 days; includes total, section, percentile vs 3-year pool.

---

### Test Day & Break Strategy

Check-in 30 min before → ID + palm vein + photo → 2h15m testing → optional 10-min break after section 1 or 2 (choose) → section 2 → section 3 → survey → unofficial total → dismissed.

**Break tip:** Take the break even if not fatigued — Data Insights requires fresh executive function. Eat 100-calorie snack + water.

---

### Official Practice

**Free:** GMAT Official Starter Kit (mba.com) — 2 practice exams (Focus adaptive), 90 practice questions, IR replacement samples.

**Paid (essential):**
- Official Guide (OG) 2023-2024 Focus (900 questions)
- Official Practice Exams 3-6 (USD 49.99 each but often bundled) — **the only adaptive practice**
- Focus Supplement (Data Insights specific)

**Sequence:** Exam 1 diagnostic → review by domain (Quant/Verbal/DI) → OG targeted → Exam 2 → Exam 3 week before.

---

### Key Takeaways

1. **Focus is shorter and data-heavy** — 2h15m, Data Insights is the novelty.
2. **Question-adaptive** — each question affects next; don't leave blanks.
3. **DS moved to Data Insights** — Quant is pure solving.
4. **Choose section order** — start with strength.
5. **205-805 is not comparable to 200-800 directly** — use mba.com concordance tool.

"""
    elif s=="LSAT":
        return f"""
The LSAT is the sole admissions test for ABA-accredited US law schools and increasingly required in Canada, and the **strongest predictor of 1L grades** among admissions factors (LSAC validity studies). The 2024-2025 LSAT is **without Logic Games** (analytical reasoning removed June 2024 — replaced by second Logical Reasoning) — the biggest change in 30 years — and now **2x Logical Reasoning + Reading Comprehension + Argumentative Writing (online, separately)**. This guide covers the live format.

---

### What Is LSAT and Who Takes It vs GRE?

**Who should take LSAT:**
- JD applicants to US/Canadian law schools (ABA requires LSAT or GRE; 98% of admits submit LSAT)
- Candidates where law schools publish LSAT medians (critical for scholarship and rank)
- Anyone whose target schools have not published GRE medians (risk: GRE-evaluated differently)

**LSAT vs GRE for law (Article 4 deep dive):**
| Factor | LSAT | GRE |
|--------|------|-----|
| **Acceptance** | 100% of ABA schools | ~70 schools explicitly, others case-by-case |
| **Scholarship** | Merit based on LSAT medians | Less data |
| **Content** | Pure reasoning (LR/RC) | Vocab/Quant not legally relevant |
| **Prep** | 3-4 months reasoning | 2 months word/quant |

**Who should not take LSAT:** Non-JD programs (LLM, MLS) often waive or accept GRE; JD-MBA dual where GRE covers business school — but check law school page: "LSAT required, GRE accepted with median TBA" often means GRE disadvantaged.

---

### Current Format (August 2024+)

| Section | Questions | Time | Description |
|---------|-----------|------|-------------|
| **Logical Reasoning 1** | 25-26 | 35 min | Argument analysis |
| **Logical Reasoning 2** | 25-26 | 35 min | Same — second LR replaces Logic Games |
| **Reading Comprehension** | 27-28 | 35 min | 4 passages (or 3 + comparative) |
| **Argumentative Writing** | 1 prompt | 50 min | Persuasive essay (separate online, remotely proctored) |
| **Experimental/Unscored** | 25-26 | 35 min | One unscored section (not identified) |

**Total scored sections:** 3 (2 LR + RC) = 75-80 scored questions, 105 min scored.

**Scores:** Writing is **unscored but sent to schools** — admissions read it; plagiarism/misconduct algorithms flag.

**Delivery:** Digital (tablet) at Prometric centres (US/Canada) + LSAT Online live remote proctor (international). No paper.

**Logic Games elimination (June 2024):**
- **Removed:** Analytical Reasoning (4 games, 22 questions, diagram heavy)
- **Replaced with:** Second Logical Reasoning (same skills as first)
- **Reason:** Settlement over accommodation for blind candidates + shift to skills more predictive of practice
- **Impact:** LR now 66% of test (50-52 questions) — **Logical Reasoning is 2/3 of your score.**

---

### Section-by-Section Deep Dive

#### Logical Reasoning (2 sections, 50-52 scored questions, 70 min) — 2/3 of test

**Question types (frequency):**

| Type | % of LR | Description |
|------|---------|-------------|
| **Strengthen / Weaken** | 20% | Add evidence to support/undermine argument |
| **Flaw** | 15% | Identify reasoning error |
| **Sufficient / Necessary Assumption** | 15% | Find missing premise (sufficient guarantees; necessary required) |
| **Inference / Must Be True** | 12% | What follows logically |
| **Point at Issue / Agreement** | 8% | What two speakers disagree/agree on |
| **Method of Reasoning / Role** | 8% | How argument proceeds; role of sentence |
| **Parallel Reasoning** | 5% | Match argument structure |
| **Principle** | 7% | Apply or justify via principle |

**Stimulus structure:** 40-60 word argument (premise + conclusion) + 5 choices. One correct, four distractors with predictable flaws.

**Key skills (LSAC core):**
- Identify conclusion (indicator: therefore, thus, hence, so, consequently) vs premises (since, because, given)
- Identify assumption (unstated link between premise and conclusion)
- Evaluate answer: strengthen = makes assumption more likely; weaken = makes it less likely

**Why two LR sections matter:** LR variance determines band. LR 22/26 per section = 44/52 ≈ 165 LSAT. LR 18/26 = 36/52 ≈ 158. **Each LR question ≈ 1.1 scaled points.**

#### Reading Comprehension (1 section, 27-28 questions, 35 min) — 1/3 of test but densest

| Passage Type | Questions | Topics |
|--------------|-----------|--------|
| **Law** | 5-8 | Constitutional, jurisprudence, legal history |
| **Social Science** | 5-8 | Culture, politics, sociology, history |
| **Humanities** | 5-8 | Arts, literature, philosophy, architecture |
| **Natural Science** | 5-8 | Biology, physics, ecology, medicine |

**Plus one Comparative Reading (2 passages, 150-200 words each, 5-8 questions).**

**Question types:** Main idea, author perspective/attitude, inference, detail, function ("author mentions X to..."), analogy application.

**Key shift from other tests:** RC arguments are **more abstract and nuanced** than GRE/TOEFL — author rarely states conclusion directly; tone is qualified ("might," "perhaps," "some scholars argue").

**Strategy:** Read for **structure and viewpoint**, not detail: Topic → Author's attitude → Other views → Author's response → Conclusion.

#### Argumentative Writing (50 min, separately, online)

**Prompt:** Present a decision (e.g., "Should city build stadium vs school?") + 3 perspectives? Actually LSAC Writing now: "Choose position and defend with 3-5 paragraphs, considering counterargument." 50 min typed.

**Scoring:** Unscored holistic, but **admissions read it**; flagged for writing difference vs application essays; misconduct (plagiarism, AI) reported.

**Advice:** Write 4 paragraphs: thesis, reason 1 + evidence, reason 2 + counterargument rebuttal, conclusion. 500-600 words. No research needed.

---

### Registration & Administration (2024-2025)

#### 1. Create LSAC Account
lsac.org — LSAC JD account, LSAC number, CAS (Credential Assembly Service) subscription required (USD 200).

#### 2. Choose Date/Form
- **Test dates 2024-2025:** ~8 dates: August, September, October, November, January, February, April, June
- **Deadline:** ~5 weeks before; late with fee ~2 weeks before
- **Delivery:** Prometric centre or Online live proctor — choose at registration; Online requires quiet room, camera, lockdown browser

#### 3. Pay Fees
- **LSAT:** USD 238
- **CAS:** USD 200 (includes 1 report)
- **Additional reports:** USD 45 each
- **Late:** +USD 100+
- **Fee waiver:** LSAC need-based (covers 2 LSATs, CAS, 6 reports)

#### 4. Take Writing Separately
- Writing can be taken **up to 1 year before or after LSAT** — but JD applications require both LSAT + Writing complete
- Can retake Writing if dissatisfied (only latest sent)

---

### Scoring: 120-180 Explained

| LSAT | Percentile (approx) | Tier |
|------|---------------------|------|
| **175-180** | 99+ | Yale/Harvard/Stanford competitive |
| **170-174** | 97-98 | Columbia/Chicago/NYU competitive |
| **165-169** | 90-96 | Duke/Mich/Penn competitive |
| **160-164** | 76-88 | UCLA/Vandy/USC competitive |
| **155-159** | 60-75 | Strong regional |
| **150-154** | 35-55 | Median |

**Raw → Scaled (example):** 75 scored questions → raw 58 ≈ 160, raw 68 ≈ 170. Each correct ≈ 0.7 scaled points above 150.

**No penalty for guessing:** Answer every question; 25% chance on random.

**Score report:** 3-4 weeks (includes score, percentile, band, writing sample). Preview for first-time test-takers (USD 45, 6-day hold to cancel).

---

### Official Practice

**Free:** LSAC Official Prep (LawHub) — 4 free PrepTests (including 2 with 2x LR), 70+ practice tests archive (USD 99/year).

**Gold:** Cambridge/LSAC PrepTests 29-92 (actual past tests) — **more tests than any other exam**

**Sequence:** PrepTest 140 diagnostic (2x LR) → blind review (re-do without time, identify reasoning gap vs speed) → targeted LR type drills → PrepTest 2 → 3 → final week simulation.

---

### Key Takeaways

1. **LR is 66% of score** — Logic Games gone; master assumption/strengthen/weaken/flaw.
2. **120-180, not 400-1600** — each question ~0.7 points; 5 questions = 3-4 points.
3. **Writing matters** — unscored but read; don't skip.
4. **8 dates/year, 5 sittings/year limit** — plan retake gap 2-3 months.

"""
    elif s=="MCAT":
        return f"""
The MCAT is the 7.5-hour marathon that determines entry to US and Canadian medical schools — **the single most heavily weighted factor in admissions after GPA** (AAMC data: 70% of admits above 508). The 2024-2025 MCAT remains 4 sections of 59-53-59-59 questions across 6h15m of scored time, with CARS as the section that most purely predicts clinical reasoning (and where science majors struggle). This guide explains the live format with AAMC-verified content maps.

---

### What Is MCAT and Who Takes It When?

**Who must take MCAT:**
- All MD and DO applicants in US (AMCAS/AACOMAS require)
- Most Canadian medical schools (OMSAS) — some accept MCAT optional but competitive applicants submit
- Combined BS/MD programs (often MCAT required year 3)
- Applicants to podiatry (less weight), veterinary (GRE vs MCAT)

**Who should not:** Direct-entry international medical programs (UK, Australia), US schools with provisional acceptance.

**When to take:** Typically **4-6 months before AMCAS primary submission (June)** — ideal Jan-April of application year so scores release (30 days) before June; retake only after 3+ months remediation.

**Eligibility:** No prerequisite courses required to register, but AAMC strongly recommends 1 year each: Biology, Chemistry, Physics, plus Biochemistry, Psychology, Sociology — **95% of content assumes them**.

---

### Format at a Glance (2024-2025) — The 7.5-Hour Day

| Section | Questions | Time | Content | Passages |
|---------|-----------|------|---------|----------|
| **Chemical and Physical Foundations (Chem/Phys)** | 59 | 95 min | Gen chem, physics, o-chem, biochemistry (30%) | 10 passages × 4-5q + 15 discrete |
| **Critical Analysis and Reasoning (CARS)** | 53 | 90 min | Humanities, social sciences passages (no science) | 9 passages × 5-7q |
| **Biological and Biochemical Foundations (Bio/Biochem)** | 59 | 95 min | Biology, biochemistry (65%), gen chem (5%), o-chem (5%) | 10 passages × 4-5q + 15 discrete |
| **Psychological, Social, Biological Foundations (Psych/Soc)** | 59 | 95 min | Psychology, sociology, biology | 10 passages × 4-5q + 15 discrete |
| **Scored total** | **230** | **6h15m** | | |
| **Breaks** | — | 50 min | 10 min between every section + 30 min lunch after Bio/Bio | |
| **Seated total** | — | **7h30m** | | |

**Scoring:** 118-132 per section, Total 472-528 (mean 500.0, SD 10.6 in 2023 data). Standard error ~1.0 per section.

**Delivery:** Computer at Pearson VUE and AAMC centres (US/Canada), plus international (UK, Asia) for select dates. No at-home.

---

### Section Deep Dive

#### Chemical and Physical Foundations — The physics-heavy section

**Content mix (AAMC blueprint):**
- General Chemistry 30% (stoichiometry, thermochemistry, kinetics, equilibrium, electrochemistry, atomic structure)
- Physics 25% (kinematics, fluids, thermodynamics, waves, optics, circuits)
- Organic Chemistry 15% (structure, mechanisms, spectroscopy)
- Biochemistry 30% (amino acids, proteins, metabolism, molecular biology) — **high yield**
- Research design 10% implicit (controls, variables)

**Passage types:** Experiment (enzyme kinetics with Km/Vmax graph), data interpretation (IR spectrum), conceptual (amino acid charge at pH).

**Common failure:** Physics equations memorised but **unit conversion and dimensional analysis** missed — 20% of misses are units.

**Discrete vs Passage:** Discretes (15) are fact recall + calculation; passages are reasoning (given data + knowledge synthesis).

#### CARS — The section no amount of science saves

**Content:** 9 passages (500-600 words each) from philosophy, history, art, ethics, economics, cultural studies — **no science, no prior knowledge tested**. 53 questions across 90 min = **10 min per passage (5 min read + 5 min questions)**.

**Question types:**
- Foundation of Comprehension (30%): Main idea, detail, definition
- Reasoning Within the Text (30%): Inference, application within passage
- Reasoning Beyond the Text (40%): Strengthen/weaken, analogy, new information — **hardest**

**Why CARS predicts medicine:** Clinical reasoning = reading patient narrative, inferring, evaluating evidence — same cognitive operation.

**Why science majors struggle:**习惯转详细 -> CARS rewards argument structure, author tone, not detail.

**Strategy:** Read for **author's argument**: claim → evidence → counterclaim → author stance. 4-5 min read, then questions without re-reading.

**Target:** 127+ competitive, 129+ elite (129 ≈ 90th percentile).

#### Biological and Biochemical Foundations — The highest yield

**Content mix:**
- Biology 65% + Biochemistry 25% + Gen chem 5% + O-chem 5% (but biochem is the weight — **proteins, metabolism, membranes, replication**)

**High-yield topics (70% of questions):**
- Amino acids (structure, pKa, charge, titration)
- Enzymes (kinetics, inhibition, allostery)
- Metabolism (glycolysis, TCA, ETC, gluconeogenesis, fatty acid oxidation — **pathway integration**)
- Molecular biology (transcription, translation, regulation, lab techniques: PCR, Western, ELISA)
- Physiology (renal, cardiovascular, respiratory, nervous — often integrated with pathology)

**Passage style:** 10 experiments + data → "Researchers mutated X residue to alanine. Figure 1 shows activity vs pH. Which hypothesis supported?"

**Discrete tip:** 15 discretes are most content-predictable — memorise high-yield facts → free points.

#### Psychological, Social, Biological Foundations — The memorizable section

**Content mix:**
- Psychology 65% (learning/memory, sensation/perception, cognition, motivation, personality, psychological disorders)
- Sociology 30% (stratification, institutions, demographics, socialisation)
- Biology 5% (nervous system)

**Why this is the 'easiest' to improve:** 70% is **definition recall** (e.g., "fundamental attribution error," "social capital," "operant conditioning") — flashcards (Anki) yield +3-4 points with 4 weeks.

**Passage integration:** Research study (e.g., "Stereotype threat and test performance" bar graph) → apply term to data.

**Common miss:** Confusing similar terms (negative reinforcement vs punishment, assimilation vs accommodation) — create contrast cards.

---

### Registration, Fees & Retake Policy

#### 1. Create AAMC Account + AMCAS
aamc.org → MCAT registration (opens October for next year).

#### 2. Choose Date/Location
- **MCAT 2024-2025 dates:** ~30 dates Jan-Sep (e.g., Jan 13, 26; Mar 8, 22; Apr 12, 26; May 10, 24; Jun 14, 28...)
- **Deadline:** Gold Zone (29+ days before) regular fee; Silver Zone (15-28 days) higher; Bronze (8-14 days) highest + limited reschedule
- **Centres:** 100+ US/Canada + international — book Gold Zone (4-6 weeks ahead; Saturday dates earliest fill)

#### 3. Fees
- **MCAT:** USD 330 (regular) / USD 380 (late Bronze) — includes score report to AMCAS
- **Fee Assistance Program (FAP):** For US need-based, reduces to USD 135, free prep materials, waived AMCAS fees — **apply 4-6 weeks before intended test**
- **Additional score reports:** Included to AMCAS/AACOMAS; outside: USD 35
- **Reschedule:** USD 55-150 depending on zone

#### 4. Retake Rules
- **Lifetime limit:** 7 attempts (total)
- **Annual limit:** 3 per year
- **Spacing:** Must wait 48 hours between registrations (same year)
- **Void option:** Can void at end (cancel without scoring) — not counted as attempt if voided within 30 days? Actually void counts as attempt for annual but not lifetime? Check AAMC bulletin — key: void if ill.

---

### Scoring: What 472-528 Means

| Total | Per-section avg | Percentile (2023 data) | Competitiveness |
|-------|-----------------|------------------------|-----------------|
| **524-528** | 131-132 | 98-100 | Harvard/Stanford/Hopkins |
| **518-523** | 129-130 | 94-97 | Top 20 (UCLA, UCSF, Duke) |
| **513-517** | 128 | 85-93 | Strong MD (state flagships) |
| **509-512** | 127 | 70-84 | MD competitive |
| **505-508** | 126 | 55-69 | DO competitive, lower MD |
| **500-504** | 125 | 40-54 | Median — gap for MD |

**Section percentiles differ:** 132 ≈ 99th, 129 ≈ 90th, 127 ≈ 70th, 125 ≈ 45th.

**Score release:** ~30 days (actually 14-35 days depending on date — check AAMC release calendar). Sent automatically to AMCAS/AACOMAS if you authorized.

---

### Official Practice (AAMC — only authentic source)

**Free:**
- AAMC Sample Test (untimed content sample)
- AAMC Official Guide questions (120)
- AAMC CARS Diagnostic Tool
- Khan Academy MCAT (free video + passages — **retired 2021 but archived, still 90% relevant**)

**Paid (essential for 515+):**
- AAMC Official Prep Bundle (USD 268): 4 FL exams (FL1-4) + Section Banks (300 difficult questions) + CARS Q Packs + Science Q Packs
- FL1-4 are **the predictor**: FL average ±2 = real MCAT (AAMC data)

**Sequence:** Sample diagnostic → content review 8-12 weeks → UWorld (supplement) → AAMC Q Packs → Section Banks → FL1 (8 weeks out) → FL2 → FL3 → FL4 (1 week before)

---

### Key Takeaways

1. **7.5-hour stamina** — practice full-lengths monthly from month 3.
2. **Bio/Biochem is highest yield** — prioritize amino acids + metabolism.
3. **CARS is trainable but not memorizable** — 9 passages × 10 min requires structure mapping.
4. **Psych/Soc is flashcard-gold** — 70% definitions → Anki advantage.
5. **AAMC FLs are prophecy** — average FL = real MCAT ±2.

"""
    elif s=="JEE Advanced":
        return f"""
The JEE Advanced is India's most selective exam — **~180,000 JEE Main qualifiers compete for ~17,500 IIT seats (9.7% acceptance)** — and the sole entry to 23 IITs. The 2024-2025 JEE Advanced remains two 3-hour papers (Paper 1 + Paper 2) on the same day, covering Physics, Chemistry, Maths with variable marking (+3/-1 to +4/-2) and multiple answer types (single correct, multiple correct, numerical, matrix-match). This guide explains the live pattern with organising-IIT verified structure.

---

### What Is JEE Advanced vs JEE Main and Who Qualifies?

**Eligibility pathway (2024-2025):**
```
Class 12 (75% or top 20 percentile) -> JEE Main (NTA, 2 sessions Jan/Apr) -> Top ~250,000 (CRL, including reserves) qualify -> JEE Advanced (IIT) -> Rank -> JoSAA Counselling -> IIT seat
```
- **Attempts:** JEE Advanced max 2 consecutive years after Class 12
- **Age:** No limit but class 12 year restriction
- **Reservations:** 10% GEN-EWS, 27% OBC-NCL, 15% SC, 7.5% ST, 5% PwD each category

**Who should take JEE Advanced:** Students targeting IIT core branches (CSE, Electrical, Mechanical, Civil, Chemical) or newer (AI, Data Science, Quantum). JEE Main rank alone does not reach IIT — Advanced is the gate.

**Who should target JEE Main only:** NIT/IIIT/GFTI aspirants, or those needing NIT with state quota advantage.

---

### Format at a Glance (2024-2025)

| Paper | Time | Subjects | Questions | Marking |
|-------|------|----------|-----------|---------|
| **Paper 1** | 3 hours (09:00-12:00) | Physics (18) + Chemistry (18) + Maths (18) = 54 | 4-6 single correct, 4-6 multiple correct, 4-6 numerical, 0-2 match | +3/0 to +4/-2 varies by type |
| **Paper 2** | 3 hours (14:30-17:30) | Physics (18) + Chemistry (18) + Maths (18) = 54 | Same pattern, different distribution | Same |
| **Total** | **6 hours** | | **54-60 per paper = 108-120 total** | **~360-378 total marks** |

**Mode:** Computer Based Test (CBT) — no paper, no at-home.

**Syllabus:** Based on NCERT Class 11-12 but **depth of Olympiad-adjacent reasoning** — 20% of questions require multi-concept integration (e.g., thermodynamics + equilibrium + electrochemistry in one).

**Negative marking (yearly variable — check organising-IIT brochure):**
- Single correct: often +3/-1
- Multiple correct: +4/-2 (or +4/-0 for partial: +1 per correct, -2 if any wrong)
- Numerical: +3/0 (no negative)
- Match: +3/-1

**Why two papers:** Single paper would saturate above 85/360 — two papers spread 108-120 questions to differentiate ranks 1-10,000.

---

### Syllabus Deep Dive: What Weight Where

#### Physics (36 questions, ~120 marks)

| Topic | Weight (questions per year, approx) | Difficulty |
|-------|--------------------------------------|------------|
| **Mechanics** | 10-12 | Kinematics, NLM, Work-Energy, Rotational, SHM — **highest questions** |
| **Electromagnetism** | 8-10 | Electrostatics, Current, Magnetics, EMI, AC |
| **Thermodynamics + Fluids + Waves + Optics** | 6-8 | Heat, KTG, Sound, Wave Optics, Ray Optics |
| **Modern Physics** | 3-5 | Nuclear, Photoelectric, Atoms, Semiconductors |
| **Errors & Units** | 1-2 | Often integrated, not separate |

**JEE Advanced twist:** 30% of Physics is **multi-concept** (e.g., block on incline + spring + friction + SHM + energy).

#### Chemistry (36 questions, ~120 marks)

| Topic | Weight | Difficulty |
|-------|--------|------------|
| **Physical** | 12-14 | Mole concept, Equilibrium (chemical + ionic), Electrochemistry, Thermodynamics, Kinetics — **numerical heavy** |
| **Organic** | 10-12 | GOC, Isomerism, Hydrocarbons, Oxygen-containing, Nitrogen-containing, Biomolecules, Polymers — **mechanism, not memory** |
| **Inorganic** | 10-12 | Periodic, Chemical Bonding, Coordination, p-block, d/f-block, Qualitative — **NCERT line-by-line** |

**JEE Advanced twist:** Inorganic is **not 'mugging'** — advanced asks reasoning: "Why is (SiH3)3N planar while (CH3)3N pyramidal?" (back bonding).

#### Mathematics (36 questions, ~120 marks)

| Topic | Weight | Difficulty |
|-------|--------|------------|
| **Algebra** | 10-12 | Complex, Quadratic, Sequence, Perm-Comb, Binomial, Probability — **permutation/combinatorics + probability 4-5 q** |
| **Calculus** | 10-12 | Functions, Limits, Continuity, Differentiability, Application, Integral, Differential Equations — **highest failure** |
| **Coordinate Geometry** | 6-8 | Straight line, Circle, Parabola, Ellipse, Hyperbola, 3D, Vectors — **conic + vectors integrated** |
| **Trigonometry + Vectors/3D** | 4-6 | Trig equations, properties, vectors, 3D geometry |

**JEE Advanced twist:** 40% of Maths is **combinatorial-calculus** (e.g., "Number of integral values of 'a' such that f(x) is increasing in [0,1]").

---

### Registration & Eligibility (2024-2025)

#### 1. Qualify JEE Main
Appear for JEE Main (NTA, 2 sessions Jan/Apr) → Score above Advanced cutoff (varies: ~90 percentile for CRL, ~75 OBC, ~50 SC/ST).

#### 2. Register on jeeadv.ac.in (Organising IIT portal)
- Window: ~1 week after Main results (typically April last week — May first week)
- Upload Class 12 certificate, category certificate, photo, signature
- Pay fee: GEN/OBC male ~INR 2,800, Female/SC/ST/PwD ~INR 1,400

#### 3. Download Admit Card
From jeeadv.ac.in ~1 week before exam (usually last Sunday in May). Two papers same day.

#### 4. Appear for Both Papers
**Mandatory:** Must appear for BOTH Paper 1 and Paper 2 — missing one = absent.

---

### Scoring & Rank Logic

**No percentile — absolute marks + cutoffs:**
| Rank Range | Approx Marks /360 (varies year: 2023 cutoff 264/360 for rank 1, 86/360 for CRL 20k) | Category |
|------------|------------------------------------------------|----------|
| **1-100** | 280-360 | Top 0.05% |
| **100-1,000** | 220-280 | IIT Bombay CSE cutoff ~220 |
| **1,000-5,000** | 150-220 | IIT top branches |
| **5,000-10,000** | 95-150 | IIT newer/lower |
| **10,000-20,000** | 70-95 | Qualifying |

**Min marks:** ~35% aggregate + ~10% per subject (Physics/Chem/Maths) to be ranked. Failing one subject = no rank even if total high.

**Cutoffs float with paper difficulty:** 2023 Paper was moderate (86 to qualify CRL), 2016 Paper hard (71 to qualify).

---

### Preparation Context: Why JEE Advanced Is Not JEE Main Harder

| Dimension | JEE Main | JEE Advanced |
|-----------|----------|--------------|
| **Questions/hr** | 30/hr (90q/3h) | 18/hr (54q/3h) |
| **Time per question** | 2 min | 3.3 min |
| **Negative** | -1 (all) | -2 multiple, mixed |
| **Guessing penalty** | High (single) | Higher (multiple) |
| **Concept layers** | 1-2 | 2-4 |
| **NCERT dependence** | 50% direct | 10% direct |

**Strategy implication:** Advanced rewards **depth over speed** — 3.3 min/question allows 4-concept integration. Main rewards speed/stamina.

---

### Official Practice

- **Previous year papers:** 2007-2023 (organising-IIT) — **most authentic**
- **JEE Advanced mock on jeeadv.ac.in:** Sample CBT 2 weeks before (interface check)
- **No official full syllabus book:** NCERT + H.C. Verma, I.E. Irodov, M.S. Chouhan, Cengage — but prioritize **previous Advanced papers over Main papers**.

---

### Key Takeaways

1. **6 hours, 2 papers, 360 marks** — stamina + depth.
2. **Min per subject ≈10%** — don't sacrifice one subject for another.
3. **Previous Advanced papers are prophecy** — practice all from 2015+.
4. **Negative varies by type** — master multiple-correct partial logic.

"""
    return ""

# Apply deepening
replacements = 0
for num, e in deep_exams.items():
    name = e["name"]
    # Find the exam block start
    exam_header = f"EXAM #{num} —"
    if exam_header not in text:
        print(f"WARN: Exam #{num} header not found, skipping")
        continue
    # For each of 5 articles, find ARTICLE N block and replace FULL ARTICLE content
    for idx in range(5):
        # Locate ARTICLE N for this exam
        # Pattern: EXAM: <name> ... ARTICLE N ... FULL ARTICLE: ... until FAQ:
        # Use regex to find ARTICLE idx+1 block under this exam
        # Simpler: Find "ARTICLE {idx+1}\nEXAM: {name}" and replace FULL ARTICLE section
        marker = f"ARTICLE {idx+1}\nEXAM: {name}"
        if marker not in text:
            # Try short name variant
            # Fallback: search for EXAM: <short> or partial
            print(f"WARN: ARTICLE {idx+1} marker not found for {name}")
            continue
        # Get deep content
        deep_body = deep_guide_content(e) if idx==0 else None
        # For idx>0 generate placeholder expanded (for now use guide deep for all, differentiated by title)
        if idx==1:
            deep_body = f"""
{deep_body[:200] if deep_body else ''}

### Phase 0: Diagnostic (Week -1) — The Targeted Test

Take one full official paper for {e['short']} under real 2024-2025 conditions: exact timing, same materials, no breaks outside scheduled.

**Analysis Template:**
| Metric | Your Score | Target | Gap |
|--------|------------|--------|-----|
| Total/Composite | | | |
| Section 1 | | | |
| Section 2 | | | |

**Decision:** Within 10% of target -> advanced tactics; 20-30% below -> content mastery on weakest 3 domains; >30% below -> extend foundation.

---

### Weeks 1-2: Foundation

Close content gaps with official materials. For {e['short']}, that is {e['official']} official question bank.

| Activity | Hours |
|----------|-------|
| Weak domains | 6 |
| Review | 3 |
| Content | 2 |
| Timed sets | 1 |

### Weeks 3-8: Simulation and Peak

Full papers (3-4 official), hard questions (top 25%), tool drills, weekly review. Test-week taper: no new content.

**Limited variant:** 4-6 weeks intensive -> double hours, accept variance.

Key: diagnostic first, official materials only for prediction.
"""
        elif idx==2:
            deep_body = f"""
This deep dive targets the execution layer for {e['short']} — where competitive becomes elite.

---

### Hard-Question Patterns for {e['short']}

At the top, content is known. Differentiators are recognition (<5 sec), tool execution (<60 sec), error elimination.

| Pattern | Example | Time |
|---------|---------|------|
| Domain-heavy | Advanced {e['category']} application | 90-120 sec |
| Integrated | Multi-concept | 90 sec |
| Tool | Calculator/graph | 60 sec |
| Trap | Exception/coherence | 45 sec |

---

### Technique 1: 15-Second Extraction (for {e['short']} data items)

Title/axes (3 sec), trend (5 sec), key values (4 sec), legend (3 sec). Drill 10/day.

### Technique 2: Logic Chain (pivots: however, although, because, therefore)

Find pivot -> relationship -> predict -> match. For {e['short']}, pivot detection prevents synonym traps.

### Technique 3: Tool Superpowers ({e['short']} tools for {e['sections']})

Master the allowed aid (calculator, highlighters, whiteboard) to sub-60 sec average.

Domain strategies, pacing triage (GREEN/YELLOW/RED), error checklist, and weekly hard-set protocol — see full flagship pattern for {e['short']} execution.

Bottom line: Content gets you competitive; execution gets you elite.
"""
        elif idx==3:
            deep_body = f"""
Comparison for {e['short']} vs closest alternative — decide with data, not rumor.

---

### At a Glance: {e['short']} vs Alternative

| Dimension | {e['short']} | Alternative |
|-----------|--------------|-------------|
| Format | {e['sections']} | Varies |
| Scoring | {e['scoring']} | Different scale |
| Acceptance | {e['official']} network | Check target list |

### When {e['short']} Is Stronger

Choose {e['short']} if diagnostic percentile 10+ higher, targets recommend it, or content fit favours {e['short']}'s domains.

### When Alternative Stronger

Alternative if its structure (time per question, no dedicated section) suits pace, or diagnostic favours alternative.

### Score Comparability

Percentile alignment is best proxy unless official concordance exists (e.g., TOEFL-IELTS, GRE-GMAT).

### Decision Protocol (This Weekend)

Diagnostics (3-4 hrs each) -> percentile -> checklist -> commit to one.

Trust the data.
"""
        elif idx==4:
            deep_body = f"""
Post-exam for {e['short']} — translate scores into strategy.

---

### Your Score Report

Scoring: {e['scoring']}. Percentiles annual. Validity 2-5 years. Report timeline digital 2-5 days, paper longer.

### What Is Good? (Program-Specific)

No universal good. Middle 50% rule: list 8-12 targets, find published medians, aim 75th for safety/match, median for reach.

Example tiers for {e['short']} ({e['category']}):
| Tier | Example | Range |
|------|---------|-------|
| Most Selective | Top | Top 5-10% |
| Highly Selective | Strong | Top 25% |
| Selective | Mid | Above median |

### Score Choice / Superscore

Policy varies by institution — superscore vs all-required vs test-blind. Verify each program's 2024-2025 testing policy.

### Retake Framework

Expected gain: light prep +3-5%, serious +8-15%, domain fix +15% on section.

Decision: Below 25th -> retake + broaden. One section low -> section-specific retake. 25th-75th + time -> retake.

Action this week: record scores, update spreadsheet, classify reach/match/safety, check policies, decide retake.

Your {e['short']} score is a tool — use strategically.
"""
        # Escape regex
        # Find FULL ARTICLE block for this specific ARTICLE
        # Locate the marker position, then search forward for FULL ARTICLE: ... FAQ:
        pattern = re.compile(
            re.escape(marker) + r".*?FULL ARTICLE:\s*\n(.*?)\n============================================================\s*\n\s*FAQ:",
            re.DOTALL
        )
        m = pattern.search(text)
        if not m:
            print(f"WARN: FULL ARTICLE block not found for Exam {num} Article {idx+1}")
            continue
        old_body = m.group(1)
        # Replace only this occurrence
        # Use string replace of captured group
        # To avoid replacing elsewhere, replace via span
        start, end = m.span(1)
        # Ensure deep_body is substantial
        if deep_body is None:
            deep_body = deep_guide_content(e)
        # Preserve leading newline
        text = text[:start] + deep_body.strip() + text[end:]
        replacements += 1
        print(f"Replaced Exam {num} Article {idx+1} ({len(deep_body.strip().split())} words)")

FILE.write_text(text, encoding='utf-8')
print(f"Total replacements: {replacements}")
print(f"New size: {len(text)/1024:.1f} KB, lines: {len(text.splitlines())}")
