import pathlib, re

FILE = pathlib.Path(r"c:\Users\DIVYANSHU\Desktop\Blog-Ghar\exam-blog-library.txt")
text = FILE.read_text(encoding='utf-8', errors='ignore')

# Helper to get exam info
exams_info = {
    5: ("IELTS (International English Language Testing System)", "IELTS", "British Council, IDP: IELTS Australia, Cambridge English", "Listening (30m, 40q), Reading (60m, 40q), Writing (60m, 2 tasks), Speaking (11-14m, 3 parts)", "Band 0-9 per section, Overall = average rounded to 0.5", "English Proficiency"),
    6: ("GMAT Focus Edition", "GMAT Focus", "GMAC (Graduate Management Admission Council)", "Quantitative Reasoning (21q,45m), Verbal Reasoning (23q,45m), Data Insights (20q,45m) = 64q, 2h15m", "Total 205-805 (10-pt intervals), Section 60-90", "Business School Admissions"),
    7: ("LSAT (Law School Admission Test)", "LSAT", "LSAC (Law School Admission Council)", "2x Logical Reasoning (35m each) + Reading Comprehension (35m) + Writing (50m)", "120-180 (average ~152)", "Law School Admissions"),
    8: ("MCAT (Medical College Admission Test)", "MCAT", "AAMC (Association of American Medical Colleges)", "Chem/Phys (59q,95m), CARS (53q,90m), Bio/Biochem (59q,95m), Psych/Soc (59q,95m) = 7.5 hours", "472-528 (118-132 per section, avg 500)", "Medical School Admissions"),
}

def gen_study_plan(num, name, short, official, sections, scoring, category):
    return f"""
This {short} Study Plan is built around official materials only and the live 2024-2025 format ({sections}) — every week maps to a timed section, an error-log category, and a pacing checkpoint. Assume 12 hours per week (adjust calendar, not principles).

---

### Phase 0: Diagnostic — Week -1 (Non-Negotiable)

Take one full official practice test for {short} under real conditions: timed, same delivery (paper/computer/centre/online), approved calculator only if allowed, real breaks, no pauses.

**Record:**
| Metric | Your Score | Target | Gap | Notes |
|--------|------------|--------|-----|-------|
| Total / Composite | | | | Percentile? |
| Section 1 | | | | Weakest domain? |
| Section 2 | | | | Pacing? |
| Section 3/4 if applicable | | | | |
| Timing left / rushed | | | | |

**Error log columns:** Date | Section | Q# | Domain | Error Type (Content / Careless / Timing / Strategy) | Root Cause | Fix

**Decision:**
- Within 10% of target -> Weeks 1-2 = advanced tactics + pacing
- 20-30% below -> Weeks 1-2 = content mastery on weakest 3 domains
- >30% below -> Extend foundation to 6 weeks before heavy simulation

For {short}, the diagnostic also reveals delivery fit (paper vs computer vs online) — decide before Week 1 and do all subsequent practice in that delivery.

---

### Weeks 1-2: Foundation — Close Content Gaps (Weeks 1-2)

**Goal:** 80%+ on official question banks for weakest 3 domains.

| Activity | Hours | Method |
|----------|-------|--------|
| Weak Domain Practice | 6 | Official question bank: easiest -> hardest, untimed then timed |
| Diagnostic Review | 3 | Deep-dive every wrong answer with domain tag + why correct is correct |
| Content Review | 2 | Official syllabus/bulletin — not third-party summaries |
| Mini-Timed Sets | 1 | 10-15 questions mixed domains, 70% time |

**For {short} ({category}):**
- If Verbal/Reading is weak: argument structure, inference, vocabulary in context, text structure
- If Quant is weak: arithmetic foundations, algebra, data analysis, geometry (no formula sheet where applicable)
- If Writing/Integrated is weak: synthesis, task achievement, cohesion, citation of evidence
- If Data/Science is weak: graph extraction in 15 seconds, variable identification, hypothesis evaluation

**Deliverable end of Week 2:** Complete official practice sets for weakest 3 domains at 80%+. Re-take diagnostic Section 1(s) — target 75%+. If not, repeat Week 2.

**Vocabulary/Formula system (where applicable):** Start spaced repetition Day 1 (Anki/Quizlet) — 20 new/day + review. For {short}, this may be words, formulas, or mechanisms depending on domain; the system matters more than the list.

---

### Weeks 3-4: Integrated Practice & Pacing Control

**Goal:** Seamless transitions between domains; section timing under control with buffer.

| Activity | Hours |
|----------|-------|
| Full Section Practice (timed, with checkpoints) | 4 |
| Official Practice Test 2 (Week 4 weekend, full sim) | 3 |
| Error Log Review (categorize every miss) | 3 |
| Weak Domain Maintenance (30 min x 4 weak topics) | 2 |

**Pacing checkpoints (adapt to {short}'s timing):**
- Example: Q9 at 10 min, Q18 at 20 min per module where module = 30-35 min
- Flag uncertainty in 10 seconds; return only if buffer remains
- No penalty for guessing where applicable — never leave blank

**Week 4 Deliverable:** Practice Test 2 under full conditions. Compare to diagnostic: +5 to +15% expected. If Section 1 performance still gates access to higher difficulty (where adaptive), extend foundation 1 week before proceeding. That gating is the single most leveraged fix.

---

### Weeks 5-8: Adaptive/Hard-Section Mastery & Tool Fluency

**Goal:** Dominate the hardest available official questions; tool use (calculators, highlighters, scratch paper, whiteboards, Desmos where allowed) automatic in <60 seconds.

| Activity | Hours |
|----------|-------|
| Official Practice Tests 3 & 4 (adaptive if applicable) | 6 |
| Hard-question sets (top 25% difficulty, official source) | 4 |
| Tool/Calculator/Annotation drills | 2 |
| Review & Synthesis (weekend re-solve every hard miss 2-3 ways) | 2 |

**Hard-question protocol:** Re-solve every hard miss two to three ways (algebraic, tool-based, estimation). Time each — your slowest domain is your next 20-point gain.

**If {short} is adaptive (section-level or question-level):** Hard Section / Hard questions carry disproportionate weight. Missing a hard question costs more than missing an easy one, but you only see hard questions if you earn them — Section 1 is the gate. Treat every Section 1 question as gatekeeping.

---

### Weeks 9-10: Peak Simulation & Test-Day Rehearsal

**Goal:** Zero surprises.

**Week 9:** Official Practice Test 5 — full simulation at same time of day, same device/centre logistics, same breakfast/snack, same break routine. Score immediately; analyze pacing per section.

**Week 10:** Official Practice Test 6 (or latest available) — 7 to 10 days before real test. Target within 2-3% of goal. If >5% below, consider rescheduling (pay change fee) vs 1-week blitz.

**Test-week taper:**

| Day | Activity |
|-----|----------|
| -7 | Light review: formula/rules sheet, short timed section |
| -6 | 1 timed section (weakest) + review |
| -5 | Rest + mental walkthrough of centre, ID, locker, break |
| -4 | 30-min pacing drill (all sections, 5 min each) |
| -3 | Device/format/tech check (app, browser, centre directions) |
| -2 | Pack bag, confirm ID, print ticket, drive route |
| -1 | No studying. Light walk. Early sleep. Hydrate. |
| Test | Execute. Trust the system. |

---

### Limited-Time Variant (4-6 Weeks, Intensive, 15-20h/week)

| Week | Focus |
|------|-------|
| 1 | Diagnostic + weakest 2 domains (official only) |
| 2 | Section pacing + Practice Test 2 |
| 3 | Hard questions + Practice Test 3 |
| 4 | Practice Test 4 + taper |
| 5-6 (if 6-week) | Extra hard-set cycle + final simulation |

**Warning:** Compressed timelines double variance. Only for strong baseline (within 15% of target).

---

### Resource Allocation (Official Only for Prediction)

| Resource | Purpose | When |
|----------|---------|------|
| Official full practice tests (free + paid) | Authentic simulation + adaptivity | Diagnostic, Weeks 4, 5, 7, 9, 10 |
| Official question bank / guide | Targeted domain practice | Daily Weeks 1-6 |
| Official prep portal/app | Adaptive drills | Daily |
| Third-party | Supplemental only after official exhausted | Last resort |

**Golden rule:** Only official tests predict real scores. Third-party difficulty is inflated/deflated.

---

### Key Takeaways

1. Diagnostic first — no plan without baseline + timing data.
2. Official materials only for prediction.
3. Domain weighting matters — heaviest weak domain first.
4. Pacing beats perfection — finish every section; guess strategically.
5. Taper final week.

Your next action: Take the diagnostic this weekend. Data beats assumptions for {short}.
"""

def gen_mastery(num, name, short, official, sections, scoring, category):
    return f"""
This is not "what to study" for {short} — it is **how to execute on the hardest {short} items** where competitive scores stall.

At the top tier for {short} ({category}), every candidate knows the syllabus. The gap is **recognition in <5 seconds, tool execution in <60 seconds, and error elimination on easy/medium**. This article targets that execution layer for the live 2024-2025 format ({sections}; {scoring}).

---

### The {short} Hard-Question Reality

**What elite requires (example calibrations):**
- Section 1 (gate): ~85-90% correct to unlock hard/upper difficulty
- Hard Section / hardest items: 80%+ correct for top decile
- Tool-solvable items (where allowed): 60% of hard items in <60 sec with aid
- Careless error rate: <2 per full test

**Miss distribution at 90th percentile for {short}:** ~70% Careless/Timing/Strategy, ~30% Content. If you are past content mastery, your gains are in process, not syllabus.

---

### Technique 1: 15-Second Extraction Protocol (for any {short} visual)

Graphs, passages, tables, and diagrams in {short} test data reading, not recall. Apply:

1. **Title & Axes (3 sec):** Variables, units, independent (x) vs dependent (y)
2. **Trend (5 sec):** Linear, exponential, inverse, threshold/plateau, periodic
3. **Key Values (4 sec):** Peaks, intercepts, intersections, asymptotes, anomalies
4. **Legend/Note (3 sec):** Series, conditions, treatments, sample size

**Drill:** 10 visuals per day, covering visuals only, then answering without reading text. Aim to answer 40% of questions from visuals alone.

---

### Technique 2: Logic-Chain Method (for text and argument items)

{short} frequently tests pivot words: *however, although, because, since, therefore, on the other hand, for example, moreover, consequently*.

**Protocol:**
1. Find the pivot -> determines relationship (contrast, cause, example, condition, conclusion)
2. Predict the fill/answer before looking at options
3. Match prediction to choices — do not hunt synonyms
4. Trap: synonyms that fit form but break logic are distractors

**Example discipline:** For {short}, equivalence in context matters more than dictionary synonymy.

---

### Technique 3: Tool Superpowers (for {short} where aids allowed)

- **Desmos / On-screen calculator:** System intersection, graphing for optimization, regression, stats — master the 5 core workflows for {short}
- **Highlighters / Flags / Eliminator:** Pre-mark pivots, axis labels, question stems; eliminate on screen
- **Whiteboard / Scratch:** 2-column table for conflicting viewpoints, quick sketches, matrix for multi-part

**Speed target:** Sub-60-second average on tool-solvable questions buys 5-8 minutes for reasoning-heavy items on {short}'s tight timing ({sections}).

---

### Domain-Specific Hard Patterns for {short}

#### Foundational Domain (Largest Weight)
- Recognize disguised forms: word problems, modelling, multi-constraint systems
- Pattern: Translate -> visualize -> compute with tool -> verify with alternate method
- Pitfall: Hidden constraints (integer, positive, domain) or "must vs could" operator

#### Advanced Domain (Differentiator for {short})
- Hybrid items combining domains (e.g., algebra + data, reasoning + evidence, science + data)
- Pattern: Graph both sides; count intersections; check domain restrictions (sqrt, log, denominator)
- Pitfall: Extraneous solutions, unit mismatch

#### Analytical / Data Domain (High Yield, Lower Volume)
- Ratios, percentages, probability, conditional relationships
- Pattern: Restrict denominator to condition; watch units; correlation vs causation (only experiments with controls support causation)
- Pitfall: "Increase by" vs "increase to"; percent of percent

---

### Pacing: The Hidden Gate for {short}

{sections} implies tight average time. Use triage on first pass:

| Tag | Meaning | Action | Time |
|-----|---------|--------|------|
| **GREEN** | Confident, quick | Solve immediately | 30-60 sec |
| **YELLOW** | Know how, multi-step | Flag, second pass | 90-120 sec |
| **RED** | No clear path | Guess, mark, move | 20-30 sec |

**First pass:** All GREEN (60% of test) in ~50% time. Second pass: YELLOW. Last 3 min: guesses/reviews. At elite levels, not attempting a RED is a feature.

---

### Error Elimination Checklist (Every Question, 5 Seconds)

- Re-read the stem after solving — what is *asked*? (x vs y, increase vs decrease)
- Units: radius vs diameter, per year vs per month, 000 vs M
- Entry format: fraction vs decimal vs percent; word limit (e.g., IELTS/GRE/SSC word limits)
- Tool verification: quick graphical/estimation check for algebraic answer

---

### Practice Protocol for {short} Mastery

**Weekly (Weeks 5-8):**
- Hard question sets (top 25% official pool) timed per section
- Post-test: Categorize every miss (Content / Careless / Timing / Strategy) -> at elite, 70% are Careless/Timing
- Daily: 10-minute tool/annotation drills until automatic

**Bi-weekly:** Full {short} section under time, with break simulation. Track time at Q10, Q20, Q30.

Bottom line: Content gets you to competitive for {short}. Execution gets you to elite. Drill the protocols until automatic.
"""

def gen_comparison(num, name, short, official, sections, scoring, category):
    return f"""
Choosing between {short} and its closest alternative on rumor costs months. This comparison uses verified structure, scoring, and acceptance to decide with data for the 2024-2025 cycle.

---

### At a Glance: {short} vs Closest Alternative(s)

| Dimension | {short} | Closest Alternative | Impact |
|-----------|---------|---------------------|--------|
| **Purpose** | {category} — {name} ({sections}) | Overlaps but distinct pathway; verify acceptance at YOUR targets | Determines whether score is even used |
| **Format** | {sections} | Varies: time per question, sections, aids | Affects preparation time (6-12 weeks) |
| **Scoring** | {scoring} | Different scale | Compare via percentiles, not raw |
| **Delivery** | Computer at authorized centres; some offer at-home/online; verify for your region | Varies | Logistics for international |
| **Cost/Time** | See official bulletin for {short} (fees adjust by region/year) | Varies | Budget and score-report timing |

**Specific mappings for {short}:**
- English proficiency: {short} vs TOEFL vs PTE vs Duolingo — ETS/British Council/Pearson provide score comparison tables (e.g., IELTS 7.0 ~ TOEFL 94-101 ~ PTE 65-72 ~ Duolingo 115-120 — verify latest tables; they shift)
- Business: {short} vs GRE — ETS/GMAC official comparison tool
- Admissions (US): {short} vs alternative — Common Data Set middle 50% comparison

---

### When {short} Is Stronger — Choose {short} If 3+ Apply

- Diagnostic percentile on {short} is >=10 points higher than alternative (official practice test, same week)
- Your 8-12 specific targets publish medians/recommend {short} or list it first on admissions page
- Content fit: you are stronger in {short}'s heaviest domains (e.g., strong data insights -> GMAT Focus; strong vocab -> GRE; strong graph reading -> ACT Science)
- Tool/format fit: you prefer {short}'s delivery (e.g., face-to-face Speaking for IELTS, on-screen calculator for GRE/GMAT Focus Data Insights, paper option for ACT)
- Timeline: {short} offers faster reporting (3-5 days vs 2-3 weeks) and your deadline is tight

### When the Alternative Is Stronger

Choose alternative if its structure suits your pace (e.g., more time per question, no dedicated science, different essay format), your alternative diagnostic is higher, or alternative is cheaper/more available in your city.

**Example:** If you are a rapid reader who hates face-to-face Speaking, TOEFL/PTE/DET may suit better than IELTS. If you are vocab-strong but data-weak, GRE may suit better than GMAT Focus.

---

### Score Comparability — Percentiles Over Raw

There is no single official concordance for many {short} vs alternatives **except** well-documented pairs:
- SAT <-> ACT (College Board/ACT concordance, 2018, validated for Digital SAT 2023)
- GRE <-> GMAT (ETS/GMAC comparison tool, not a true concordance but predictive)
- TOEFL <-> IELTS <-> PTE <-> Duolingo (ETS/British Council/Pearson/DET tables)

For others (e.g., {short} vs national exams), use **percentile alignment** as proxy: where would your score fall in each test's distribution? Admissions officers compare within context; they do not convert precisely.

**Practical step:** Convert your diagnostic to percentile via official table, then map to institution's published median. The test where you are closer to 75th for your top choice is the test to submit.

---

### Preparation Divergence — They Require Different Training

| Element | {short} Path | Alternative Path |
|---------|--------------|------------------|
| **Pacing** | {sections} implies specific sec/question | Different sec/question |
| **Content Breadth** | As per {official} syllabus — depth in {category} core | Broader/narrower complement |
| **Practice Tests** | Official only for prediction (most predictive) | Official only |
| **Aids** | Where allowed, mastery is superpower | Different aids |
| **Common Trap** | Trying to prep both simultaneously — spreading 12 weeks across 2 tests | Same |

**Rule:** Prep for **one** test. Diagnostics (6 hours total) already decide. Do not split 12 weeks.

---

### Admissions / Licensure Reality Check for {short}

**Myth:** "Schools/boards prefer one test"
**Fact:** {official} publishes acceptance lists and many institutions publish "no preference" statements. Verify your 8-12 specific targets — one program's preference (e.g., a UK medical school requiring UCAT) is not generalizable.

**Myth:** "Superscore / ScoreSelect works the same"
**Fact:** Varies by institution, not by test. Some superscore (best sections across dates), some require all dates, some are test-blind (e.g., certain state systems). Verify per institution's testing policy page for 2024-2025.

**Myth:** "Test-optional = do not take"
**Fact:** Test-optional = submit if at/above median; withhold if below 25th. Strong scores still help for merit aid and fellowships even when optional.

---

### Decision Protocol — Do This Weekend (3 Hours)

1. Block 3-4 hours Saturday: {short} diagnostic (official full test, timed, same delivery as planned)
2. Block 3-4 hours Sunday: alternative diagnostic (official)
3. Score both; convert to percentiles via official tables
4. Apply checklist above (need 3+ checks)
5. Commit to one; archive the other materials; start 12-week plan for chosen

**Tiebreaker:** If percentiles within 5 points, choose the test where careless errors were fewer — that indicates better cognitive fit.

---

### Key Takeaways for {short}

1. {short} ({sections}; {scoring}) is not universally harder/easier — it is a different instrument.
2. Acceptance: verify your 8-12 targets individually; global tables are approximate.
3. Preparation: 8-12 weeks for one test beats 6 weeks split.
4. Reporting: {short} digital results often 3-5 days; paper 2-3 weeks.

"""
def gen_post(num, name, short, official, sections, scoring, category):
    return f"""
Your {short} results are available (or you are anticipating them). The score report shows numbers, but not what to *do* with them for admissions, licensure, placement, scholarships, or retakes. This guide translates your {short} report into strategy for the 2024-2025 cycle.

---

### Understanding Your {short} Score Report

**Primary Score(s):** {scoring}
**What it means:** {sections} — the report may also include section scores, subscores, or proficiency levels depending on {official}'s 2024-2025 reporting.

| Component | Report Shows | How Institutions Use It |
|-----------|--------------|--------------------------|
| **Total / Overall** | {scoring} | Primary filter for merit lists, cutoffs, scholarships |
| **Section / Component** | Per-skill/seat | Used for sectional cutoffs (common in India, UK, Canada, Australia) |
| **Subscores / Profiles** | Diagnostic breakdown | Often NOT used for admissions; for your preparation only |
| **Percentile** | vs recent cohort (nationally representative vs test-taker pool) | Context for "how competitive" |

**Percentiles — two contexts (example for {short}):**
- Nationally representative: vs all eligible candidates (including non-takers) — higher numbers
- Test-taker pool: vs actual {short} takers — lower numbers, **more relevant for competitive programs** (this is what schools see)

**Reporting timeline:** Digital/computer: often 2-5 days; paper: 2-3 weeks; validity 2 years (English proficiency) or 5 years (admissions/licensure) — verify for {short}. Keep TRF/scorecard secure — verification via TRF/registration number.

---

### What Is 'Good'? — Program-Specific, Not Universal

There is no universal "good" for {short}. There is only "competitive for YOUR targets."

#### The Middle 50% / Median Rule (for {short})

1. List your 8-12 targets (reach: admit rate <15%; match: 15-40%; safety: >40% or licensure pass threshold + margin). For {short}, targets are programmes, institutions, or licensing boards.
2. Find each target's published middle 50% (25th-75th) or median/admitted median for {short} — search "[Institution] + {short} + Common Data Set / admission statistics / cut-off / previous year" for the most recent cycle.
3. Goal:
   - Safety / licensure qualifying: at/above 75th or pass threshold + 5-10%
   - Match: at/above 75th for overall competitiveness
   - Reach: at/above median (50th) is minimum viable

#### Example Tiers (Verify Current 2024-2025 Data — Illustrative for {short})

| Tier | Example Program Type | Typical {short} Range | Target (at this tier) |
|------|----------------------|-----------------------|------------------------|
| **Most Selective** | Top global/health/law/finance/engineering | Top 5-10% of {short} distribution | 90th+ percentile |
| **Highly Selective** | Strong national/regional flagships | Top 25% | 75th+ percentile |
| **Selective** | Mid-tier universities / qualifying boards | Average+ | Above median |
| **Qualifying** | Licensure/entry threshold | Pass mark | Pass + margin (e.g., +5-10 points/bands) |

**For {category} specifically:** {short} thresholds are often **sectional as well as overall**. Example patterns: UK/Australia: "Overall 7.0 with no section below 6.5" for IELTS/PTE; India: "Sectional cutoff 85 percentile + overall 98" for CAT; UCAT: "Total 2800+, SJT Band 1-2" for interview.

---

### Superscore / ScoreSelect / Score Choice for {short}

Policy varies more by institution than by test:

| Policy | What It Means for {short} | What You Send |
|--------|----------------------------|---------------|
| **Superscore** | Best section scores across dates recombined | All dates (they calculate) |
| **Highest Single Sitting** | Best overall in one sitting only | Best date only |
| **All Scores Required** | Institution sees every sitting | All dates (no choice) |
| **Test-Blind / Test-Optional** | Score not used or optional | Optional submit |

**{short}-specific note:** {official} may offer ScoreSelect / One Skill Retake / Enquiry on Results / revaluation / remarking — verify for {short} in 2024-2025 whether your institution accepts retooled scores (e.g., IELTS One Skill Retake, TOEFL MyBest — many UK/US universities accept MyBest/OSR, but not all Oxbridge/Medicine).

**General strategy:**
- For superscore institutions -> send all dates (they calculate best)
- For highest single sitting -> send best date only
- For test-optional -> submit if at/above median; withhold if below 25th (strong rest of profile can compensate)

---

### Retake Decision Framework for {short}

#### Expected Gain on Retake (Illustrative — varies by preparation)

| Preparation Level | Typical Gain for {short} | With Domain / Gating Fix |
|-------------------|---------------------------|---------------------------|
| Light (10-20h) | +2 to +5% (or +0.5 band / +3-5 scaled points) | +5-8% on focused section |
| Serious (40+ h, targeted on weakest 2 domains) | +5 to +10% | +10-15% if gating/access to hard difficulty fixed |
| Gating Fix (e.g., unlocking hard Section 2, fixing time management) | +8 to +15% on total | Largest single ROI |

#### Decision Tree

```
Is score below 25th percentile for ALL targets?
  -> YES -> Retake + broaden institution list to include matches where you are 75th+
Is one section >=1.3 SD below the others?
  -> YES -> Section-specific preparation -> Retake (highest ROI)
Is score in 25th-75th for top choice?
  -> Do you have 6-8 weeks before deadline with 12h/week available?
     -> YES -> Targeted preparation on highest-weight weak domain -> Retake
     -> NO -> Do not retake; submit and strengthen other components
Is score >75th for top choice?
  -> Only retake for specific scholarship/fellowship cutoff (often +0.5 band / +10-20 scaled points = significant funding)
Undecided?
  -> Take 1 official practice test under full conditions: if practice >5% above real score, retake; if within 3%, do not
```

**Retake constraints for {short}:** Verify waiting period (e.g., 3 days for TOEFL/IELTS, 21 days for GRE, 16 days for GMAT Focus, 30 days for IELTS OSR) and attempt limits (e.g., 5 per 12 months for GMAT/GRE, no limit for IELTS/TOEFL but cost).

---

### Funding / Placement / Licensure Nuances for {short}

- **Scholarships/Fellowships have hard cutoffs:** For {short}, 0.5 band / 10 scaled points below = zero for automatic merit. Example search: "[Institution] merit scholarship + {short} cutoff 2024" — retake ROI can be USD 10k-30k/year.
- **Course placement:** Some institutions use {short} section scores for placement (e.g., math for calculus, Writing for freshman composition) — a Band 7 Writing may waive a prerequisite.
- **Licensure:** Some boards set higher-than-pass for tiered recognition or interstate mobility (e.g., bar admission on motion with higher UBE).

---

### International Candidate Notes for {short}

- Percentiles compare you to the {short} test-taker pool (often international + domestic mixed) — institutions evaluate in context of your education system.
- If {short} is English proficiency, it may also affect visa: UKVI, Australia Home Affairs, IRCC (Canada) have specific {short} band/subscore minima and may not accept alternative English tests for visa even if university does.
- For {short} in {category}, your country's system context matters: admissions evaluate {short} alongside national curriculum scores (e.g., A-Level, Abitur, Gaokao, KCSE, ENEM).

---

### Action Plan: This Week (30 Minutes)

1. Download/screenshot official {short} score report and record primary scores + percentiles + section breakdown
2. Update spreadsheet with 8-12 targets' published 2024-2025 ranges (Common Data Set, admission statistics, previous-year cutoffs)
3. Classify each target: reach / match / safety based on YOUR scores (or licensure pass + margin)
4. Check score-send policy for each: superscore, all-required, optional/best, accepted retake types
5. Decide: Retake or Done? Use framework above; if retake, register for next window immediately (centres fill)
6. If done -> order score sends per strategy above (allow 1-2 weeks processing before deadline)
7. Move to next application component (essays, recommendations, work experience, interview)

---

Your {short} score is a tool with a shelf life ({scoring} validity 2-5 years). Use it strategically for the next application cycle, then build the rest of your profile. The 20 hours you spend tailoring your personal statement or securing a strong recommendation often outweigh the next 20 hours chasing +0.5 band.

"""

for exam_num in [5,6,7,8]:
    name, short, official, sections, scoring, category = exams_info[exam_num]
    for article_idx in [2,3,4,5]:  # 1-indexed; 1 already deepened for IELTS
        if exam_num==5 and article_idx==1:
            continue # already done
        # generate
        if article_idx==2:
            body = gen_study_plan(exam_num, name, short, official, sections, scoring, category)
        elif article_idx==3:
            body = gen_mastery(exam_num, name, short, official, sections, scoring, category)
        elif article_idx==4:
            body = gen_comparison(exam_num, name, short, official, sections, scoring, category)
        else:
            body = gen_post(exam_num, name, short, official, sections, scoring, category)
        marker = f"ARTICLE {article_idx}\nEXAM: {name}"
        if marker not in text:
            print(f"WARN marker missing {marker}")
            continue
        # find FULL ARTICLE block
        pattern = re.compile(re.escape(marker) + r".*?FULL ARTICLE:\s*\n(.*?)\n============================================================\s*\n\s*FAQ:", re.DOTALL)
        m = pattern.search(text)
        if not m:
            print(f"WARN FULL ARTICLE not found for {name} A{article_idx}")
            continue
        start, end = m.span(1)
        old_len = end-start
        new_body = body.strip()
        text = text[:start] + new_body + text[end:]
        print(f"Deepened Exam {exam_num} ({short}) Article {article_idx}: {old_len} -> {len(new_body)} chars")

FILE.write_text(text, encoding='utf-8')
print(f"Batch1 done. Size: {len(text)/1024:.1f} KB, lines: {len(text.splitlines())}")
