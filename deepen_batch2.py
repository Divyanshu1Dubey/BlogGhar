import pathlib, re

FILE = pathlib.Path(r"c:\Users\DIVYANSHU\Desktop\Blog-Ghar\exam-blog-library.txt")
text = FILE.read_text(encoding='utf-8', errors='ignore')

# Guides for remaining article 1s (GMAT, LSAT, MCAT deep) + full JEE, NEET, UPSC, CAT, GATE batch

guides = {}

guides[(6,1)] = r"""
The GMAT Focus Edition is the 2024 flagship for 2,400+ business schools: 64 questions in 2h15m across three 45-minute sections — Quantitative Reasoning (21q), Verbal Reasoning (23q), and Data Insights (20q) — with a 205-805 total score where Data Insights is the differentiator (7-8 Data Sufficiency + 12-13 integrated interpretation that the GRE does not have) and question-level adaptivity (harder if correct, cannot freely return) where each question gates the next. The Classic (200-800) was discontinued Feb 2024; Focus is now the only test for new test-takers, though Classic scores remain valid 5 years. This guide covers the live Focus format as administered at Pearson VUE centres and via GMAT Online.

---

### Who Should Take Focus vs Classic vs GRE?

**Take GMAT Focus if:**
- MBA, MiM, MSF, Business Analytics at 2,400+ schools where Focus signals business-specific intent (admissions officers note GRE = broader, Focus = focused)
- You are strong in data interpretation — Data Insights rewards synthesis from 2-3 tabs, tables, graphics, two-part analyses (the skill McKinsey/BCG/Amazon cases test)
- You prefer question-adaptive challenge with section-order choice (choose any order at start: Quant → Verbal → Data Insights or any permutation)

**Take GRE if:**
- Dual-degree MBA + MPP/MPH/JD where GRE covers both
- Vocabulary strength where TC/SE rewards word depth (Focus Verbal has no Sentence Correction — pure reasoning, so vocab matters less)
- Need cross-disciplinary applications beyond business (Focus not accepted outside business)

**Classic holders:** Classic 700 ≈ Focus 645, 750 ≈ 685. No need to retake unless expired. Use mba.com concordance.

---

### Format Deep Dive (Focus 2024-2025)

| Section | Qs | Time | Sub-types | Calculator | Weight |
|---------|----|------|-----------|------------|--------|
| **Quantitative Reasoning** | 21 | 45m | Arithmetic 20%, Algebra 35%, Geometry 15%, Word Problems | No — mental math only (phone) | Problem Solving only (DS moved) |
| **Verbal Reasoning** | 23 | 45m | Reading Comprehension 13-14, Critical Reasoning 9-10 | No | No Sentence Correction |
| **Data Insights** | 20 | 45m | Data Sufficiency 7-8, Multi-Source Reasoning 3-4, Graphics Interpretation 3-4, Table Analysis 2-3, Two-Part Analysis 3-4 | Yes — on-screen (basic + sqrt) | The novelty; heaviest variance |

**Total 64 in 2h15m** (vs Classic 64+12 IR + essay). Optional 10-min break after section 1 or 2 (take it — Data Insights needs fresh executive function).

**Adaptivity:** Question-level CAT. Unlike GRE's section-level (Section 1 gates Section 2), Focus question difficulty updates per question. You can bookmark and review within a section, but changing answers may de-optimize adaptivity — algorithm penalises unanswered items heavily. Time per Q averages 2:08 (Quant), 1:57 (Verbal), 2:15 (Data Insights) but MSR with 3 tabs takes 3:30.

**Delivery:** 600+ Pearson VUE centres 6-7 days/week + GMAT Online (human proctor, lockdown browser, valid everywhere — 95% of schools accept Online; verify yours before booking Online-only).

---

### Section Deep Look (what Focus tests)

#### Quantitative Reasoning (21q, 45m) — pure solving

Focus Quant is PS-only because DS moved to Data Insights. Topics are arithmetic (percents, ratios, counting), algebra (linear/quadratics, functions, inequalities, exponents), geometry (triangles, circles, coordinate, solids — **no formula sheet**), and integrated word problems (rate/work, mixture, overlapping sets). Harder per question than Classic (21 vs 31) → fewer anchors → each question more weight.

#### Verbal Reasoning (23q, 45m) — reasoning filter

RC: 3-4 passages (300-350 words, academic/business), 3-4 questions each: main idea, inference, structure/function, tone. Not detail matching — synthesis.

CR: 9-10 arguments. Skills: identify conclusion/evidence/assumption/flaw → strengthen/weaken/inference/assumption/evaluate. Correct answers rephrase; distractors use passage words without logic.

#### Data Insights (20q, 45m) — the MBA moat

| Type | Approx | What it tests |
|------|--------|---------------|
| Data Sufficiency | 7-8 | Is data (1) and/or (2) sufficient? (Logic over calculation) |
| Multi-Source Reasoning | 3-4 | 2-3 tabs of data (texts, tables, graphs) → 3 questions requiring cross-tab synthesis |
| Graphics Interpretation | 3-4 | Graph + 2 drop-down statements (True/False, Increase/Decrease) |
| Table Analysis | 2-3 | Sortable table → 3 statements True/False (sort to answer) |
| Two-Part Analysis | 3-4 | 2 linked questions sharing scenario (work-rate, system equations) |

**Why it matters:** MBA recruiters use identical synthesis — 20 Data Insights questions predict case interview and internship performance where GRE Data Analysis + Verbal integrated do not isolate.

---

### Registration, Fees, Scores (2024-2025)

**mba.com account:** Legal name as on passport, GMAT ID, 205-805 score.

**Dates:** Centres 4-6 weeks ahead for preferred slot (multiple times/day); Online 24/7 within 24h. Peak Sep-Dec (R1), Jan-Mar (R2) book early.

**Fees:** ~USD 275 centre / USD 300 Online (verify mba.com — adjusts). Reschedule USD 50-150 by notice. Additional reports USD 35 each. 5 free within 48h? Actually GMAT Focus includes 1 free send at test; additional USD 35.

**Scores:** Unofficial total immediately at centre; official in mba.com 3-5 days: total 205-805, sections 60-90, percentiles vs 3-year pool.

**Section order choice:** Choose any permutation 30 seconds before start — start with strength for momentum.

---

### Preparation Context

**Classic vs Focus:** Classic Quant included DS; Verbal included Sentence Correction — both gone/relocated. If you have Classic materials, DS practice still valid but now belongs to Data Insights practice. Sentence Correction drills are obsolete.

**Official guides:** OG 2023-2024 Focus (900 Qs) + Starter Kit (2 adaptive practice exams, 90 Qs) + Practice Exams 3-6 — the only adaptive practice. Sequence: Exam 1 diagnostic → OG targeted → Exam 2 → Exam 3 week before.

**Percentiles:** Focus 645 ≈ 70th, 685 ≈ 85th, 715 ≈ 96th, 755 ≈ 99th (vs Classic 700 ≈ 88th).

---

### Key Takeaways

1. Focus is shorter, data-heavy, question-adaptive — each question gates the next.
2. DS now lives in Data Insights, not Quant.
3. Verbal has no grammar — pure reasoning.
4. Choose section order; take the break.
5. Classic still valid if you hold 700+; otherwise Focus only.

"""

guides[(7,1)] = r"""
The LSAT is the sole admissions test for ABA-accredited US law schools and increasingly required in Canada, the strongest predictor of 1L grades among admissions factors (LSAC validity: r≈0.45 vs UGPA 0.35) and, since August 2024, **without Logic Games** (Analytical Reasoning removed after 30 years, replaced by a second Logical Reasoning) — now 2× Logical Reasoning + Reading Comprehension + separate Argumentative Writing. This guide explains the live 2h15m scored format (plus unscored experimental and Writing) as administered digitally at Prometric centres and via LSAT Online.

---

### Who Takes LSAT vs GRE for Law?

**Take LSAT if:**
- JD applicant to any ABA school (100% accept LSAT; ~70 accept GRE but most GRE admits are <5% of class and schools publish no GRE median)
- You need a portable, scholarship-sensitive score — law schools publish LSAT medians (critical for USNWR rank-sensitive aid); GRE medians unpublished risk implicit penalty
- Your strength is reasoning (LR) and dense reading (RC) — LSAT rewards formal logic over vocab/quant (GRE vocab/quant not legally relevant)

**Take GRE if:**
- JD-MBA dual where GRE covers business school and law school explicitly states GRE evaluated equally (check "GRE median: 168V, 164Q" published — if not published, assume GRE disadvantaged)
- Non-JD (LLM, MLS) where GRE/MAT waived

**Bottom line:** 98% of ABA admits submit LSAT. Unless your law school page publishes a GRE median band, assume LSAT preferred despite "accepted" language.

---

### Format at a Glance (August 2024+)

| Section | Questions | Time | Description | Scored? |
|---------|-----------|------|-------------|---------|
| **Logical Reasoning 1** | 25-26 | 35m | Argument analysis (strengthen, weaken, flaw, assumption) | Yes |
| **Logical Reasoning 2** | 25-26 | 35m | Same — second LR replaces Logic Games (4 games, 22q removed June 2024) | Yes |
| **Reading Comprehension** | 27-28 | 35m | 4 passages or 3 + comparative (law, social science, humanities, natural science) | Yes |
| **Experimental / Unscored** | 25-26 | 35m | One unscored section (not identified) | No |
| **Argumentative Writing** | 1 prompt | 50m | Persuasive essay (separate online, remotely proctored, up to 1 year before/after LSAT) | Unscored but sent to schools; plagiarism/AI flagged |
| **Total scored** | **~77-80** | **105 min** | 2 LR + RC = 77-80 scored | |
| **Seated total** | | **~3 hours** | With tutorial + break | |

**Delivery:** Digital tablet at Prometric (US/Canada) + LSAT Online live remote proctor (international) — no paper. Writing always online via ProctorU.

**Logic Games removal (June 2024):** Settlement over accommodation for blind candidates + LSAC data that LR more predictive of practice. Impact: **Logical Reasoning now 66% of score** (50-52 questions). A 165+ now requires ~40/52 LR plus 20/28 RC.

---

### Section Deep Dive

#### Logical Reasoning (2 sections, 50-52 scored, 70 min) — two-thirds of test

**Question types (approximate frequency):**

| Type | % of LR | What it tests | Key move |
|------|---------|---------------|----------|
| Strengthen / Weaken | 20% | Add evidence to support/undermine argument | Identify assumption -> strengthens makes it more likely; weakens makes it less |
| Flaw | 15% | Name reasoning error | Match flaw: equivocation, composition, ad hominem, causal overreach |
| Sufficient / Necessary Assumption | 15% | Find missing premise | Sufficient guarantees conclusion; necessary is required (negation test) |
| Inference / Must Be True | 12% | What follows logically | Combine premises; answer is entailed, not plausible |
| Point at Issue / Agreement | 8% | What two speakers disagree/agree on | Align: Speaker A says X, B says not-X |
| Method / Role | 8% | How argument proceeds; role of sentence | Identify: counterexample, analogy, distinction |
| Parallel Reasoning | 5% | Match argument structure | Formalize: If A->B, C->D structure |
| Principle | 7% | Apply or justify via principle | Abstract: find rule that licenses conclusion |

**Stimulus:** 40-60 word argument (premise(s) + conclusion). Indicators: therefore, thus, hence, so, consequently = conclusion; since, because, given, for, after all = premise.

**Scoring weight:** Each LR question ~0.6 scaled points (50 questions map 120-180). Missing 6 LR questions drops ~4 points.

#### Reading Comprehension (1 section, 27-28q, 35m) — one-third but densest

| Passage Type | Qs | Topics |
|--------------|----|--------|
| Law | 5-8 | Constitutional law, jurisprudence, legal history |
| Social Science | 5-8 | Culture, politics, sociology, history |
| Humanities | 5-8 | Arts, literature, philosophy, architecture |
| Natural Science | 5-8 | Biology, physics, ecology, medicine |

Plus one Comparative Reading (2 passages, 150-200 words each, 5-8 questions) — compare author's views.

**Question types:** Main idea (8%), author perspective/attitude (12%), inference (20%), detail (15%), function ("author mentions X to...") (20%), analogy application (10%), comparative (15%).

**Strategy:** Read for structure and viewpoint, not detail: Topic -> Author attitude -> Other views -> Author response -> Conclusion (4-5 min read per passage, 2 min per question set).

#### Argumentative Writing (50 min, separately)

Prompt presents a decision (e.g., city must choose stadium vs school funding) and asks you to take a position and defend with argument, considering counterargument. 4 paragraphs: thesis, reason 1 + evidence, reason 2 + counterargument rebuttal, conclusion. 500-600 words. No research. Schools read it; significant writing difference vs personal statement triggers review; plagiarism/AI use reported to Character & Fitness.

---

### Registration & Administration (2024-2025)

**LSAC JD account:** lsac.org; LSAC number; Credential Assembly Service (CAS) subscription required (USD 200) — includes transcript collection, letter processing, 1 report.

**Test dates 2024-2025 (~8):** August, September, October, November, January, February, April, June. Deadline ~5 weeks before; late with fee ~2 weeks before.

**Delivery:** Prometric centre or Online live proctor — choose at registration; Online requires quiet room, camera, lockdown browser, Government ID.

**Fees:** LSAT USD 238 + CAS USD 200 (includes 1 report) + additional reports USD 45 each. Late +USD 100+. Fee waiver (need-based, LSAC): 2 LSATs + CAS + 6 reports free.

**Writing:** Can be taken up to 1 year before or after LSAT; JD file requires both completed. Retake Writing if dissatisfied (only latest sent).

**Retake limits (2024):** 5 per testing year (Aug-Jun), 7 lifetime. LSAC data: 70% retake within 10 points of first; average gain +2.4 for second sitting after 2 months preparation.

---

### Scoring: 120-180 Demystified

| LSAT | Percentile | Tier |
|------|------------|------|
| 175-180 | 99+ | Yale/Harvard/Stanford |
| 170-174 | 97-98 | Columbia/Chicago/NYU |
| 165-169 | 90-96 | Duke/Mich/Penn |
| 160-164 | 76-88 | UCLA/Vandy/USC |
| 155-159 | 60-75 | Strong regional |
| 150-154 | 35-55 | Median — state schools |

**Raw -> scaled example (77 scored, August 2024 form):** 58/77 ~ 160, 68/77 ~ 170, 75/77 ~ 178.

**No penalty for guessing:** 25% on random. Unanswered penalises equally — answer every question. Score Preview (USD 45, first-time): 6-day hold to cancel before report.

---

### Official Practice — More Tests Than Any Exam

**Free:** LSAC Official Prep (LawHub) — 4 free PrepTests including 2 with 2× LR format; LawHub Advantage USD 99/year: 70+ PrepTests 29-92 (actual past tests) + analytics.

**Sequence:** PrepTest 140 diagnostic (2× LR) -> blind review (re-do without time, identify reasoning gap vs speed) -> targeted LR type drills ( flaw / assumption / strengthen-weaken) -> PrepTest 2 -> 3 -> final simulation 1 week before.

**Logic Games materials warning:** Pre-August 2024 guides contain 25% obsolete Logic Games — skip it; do not waste 20 hours on games now removed. Use Post-August 2024 LawHub or 2024+ guides.

---

### Key Takeaways

1. LR is 66% — master assumption/strengthen/weaken/flaw (~50% of LR).
2. 120-180: each question ~0.6 points; 5 questions = 3 points.
3. Writing matters — unscored but read and checked for authenticity.
4. 8 dates/year, 5 per year limit — plan retake gap 2-3 months with blind review focus.

"""

guides[(8,1)] = r"""
The MCAT is the 7.5-hour marathon (6h15m scored + breaks = 7h30m seated) that determines entry to US and Canadian medical schools — the most heavily weighted admissions factor after GPA (AAMC data: 70% of MD matriculants above 508, mean matriculant 512). The 2024-2025 MCAT remains 4 sections of 59-53-59-59 questions, with CARS (Critical Analysis and Reasoning Skills) as the section most predictive of clinical reasoning and USMLE — and where science majors paradoxically struggle. This guide explains the live format with AAMC-verified content maps, percentiles, and the 30-day score pipeline into AMCAS.

---

### Who Takes MCAT When?

**Must take:** All MD and DO applicants in US (AMCAS/AACOMAS require a valid MCAT within 3 years of matriculation); most Canadian medical schools (OMSAS) — some list MCAT optional but competitive applicants submit (mean accepted Ontario: 514).

**When:** 4-6 months before AMCAS primary submission (June 1). Ideal Jan-April of application year so scores release (30 days, actually 14-35 days by date — check AAMC calendar) before June verification; retake only after 3+ months remediation because AAMC data shows average gain +1.5 on unsystematic retake vs +4 with structured remediation.

**Eligibility:** No prerequisite courses required to register, but AAMC strongly recommends 1 year each: General Biology, General Chemistry, Organic Chemistry, Physics, plus Biochemistry, Psychology, Sociology — 95% of content assumes them. Undergrads typically take after prerequisites (spring of junior year).

---

### Format at a Glance (2024-2025) — The 7.5-Hour Day

| Section | Qs | Time | Content Weight | Passages |
|---------|----|------|----------------|----------|
| **Chemical and Physical Foundations (Chem/Phys)** | 59 | 95m | Gen chem 30%, Physics 25%, O-chem 15%, Biochemistry 30% | 10 passages x 4-5q + 15 discrete |
| **Critical Analysis and Reasoning (CARS)** | 53 | 90m | Humanities, social sciences passages (no science, no prior knowledge) | 9 passages x 5-7q |
| **Biological and Biochemical Foundations (Bio/Biochem)** | 59 | 95m | Biology 65%, Biochemistry 25%, Gen chem 5%, O-chem 5% | 10 passages x 4-5q + 15 discrete |
| **Psychological, Social, Biological Foundations (Psych/Soc)** | 59 | 95m | Psychology 65%, Sociology 30%, Biology 5% (nervous system) | 10 passages x 4-5q + 15 discrete |
| **Scored total** | **230** | **6h15m** | — | 39 passages + 45 discretes |
| **Breaks** | — | **50m** | 10m after Chem/Phys, 10m after CARS, 30m lunch after Bio/Biochem, 10m optional | |
| **Seated** | — | **7h30m** | With tutorial + survey | |

**Delivery:** Computer at Pearson VUE + AAMC centres (US/Canada) + international (UK, Singapore, Japan) on select dates — no at-home.

**Scoring:** 118-132 per section (mean 125), Total 472-528 (mean 500.0, SD 10.6 in 2023 applicant data). Standard error ~1.0 per section, 1.4 total — report includes confidence band.

---

### Section Deep Dive — What AAMC Actually Tests

#### Chemical and Physical Foundations — The physics-heavy, unit-driven section

**Blueprint:** Gen chem (stoichiometry, thermochemistry, kinetics, equilibrium, electrochemistry, atomic structure) 30%, Physics (kinematics, fluids, thermodynamics, waves, optics, circuits, nuclear) 25%, Organic (structure, mechanisms, spectroscopy, lab) 15%, Biochemistry (amino acids, proteins, metabolism, molecular biology methods) 30%, plus research design 10% implicit (controls, variables, error).

**Passage type:** 10 experiments + data interpretation + conceptual. Example: Enzyme kinetics with Km/Vmax graph (Michaelis-Menten), IR spectrum with peak assignment, conceptual passage on amino acid charge at pH (Henderson-Hasselbalch).

**Discrete vs Passage:** 15 discretes are fact recall + calculation (free points if memorised); 10 passages require synthesis of given data + outside knowledge.

**Top miss:** Unit conversion + dimensional analysis — 20% of Chem/Phys misses are units (nm to m, kJ to J, ms to s). Practice with explicit units every line.

#### CARS — The section no amount of science saves

**Content:** 9 passages (500-600 words each) from philosophy, history, art, ethics, economics, cultural studies — no science, no formulas, no outside knowledge tested.

**Question types:** Foundation of Comprehension (30%: main idea, detail, definition), Reasoning Within the Text (30%: inference, application within passage), Reasoning Beyond the Text (40%: strengthen/weaken, analogy, new information — hardest).

**Why CARS predicts medicine and USMLE:** Clinical reasoning = reading patient narrative, inferring intent, evaluating evidence quality — same operation as CARS. CARS 127+ correlates with Step 1 (now P/F) historical performance higher than science sections.

**Why science majors struggle:** Habit: detailed memorisation -> CARS rewards argument structure and author tone ("some scholars argue," "perhaps," "might") not detail. Detail hunters miss main idea.

**Strategy:** Read for argument: Claim -> Evidence -> Counterclaim -> Author stance -> Implication (4-5 min read), then 5-7 questions without re-reading (5 min). Structure > detail.

**Target:** 126 = median matriculant, 127+ competitive, 129+ elite (129 ~ 90th percentile).

#### Biological and Biochemical Foundations — The highest yield

**Content mix:** Biology 65% + Biochemistry 25% + Gen chem 5% + O-chem 5%, but biochemistry drives yield: proteins (structure, folding, kinetics), metabolism (glycolysis, TCA, ETC, gluconeogenesis, PPP, fatty acid / amino acid metabolism — pathway integration), molecular biology (DNA replication, transcription, translation, regulation, Mendelian + lab techniques: PCR, Western, ELISA, sequencing), physiology (renal, CV, respiratory, nervous, endocrine, immune — often integrated with pathology).

**High-yield 70%:** Amino acids (20 structures, pKa, charge at pH, titration curves), enzyme kinetics (Km, Vmax, Lineweaver-Burk, inhibition types, allostery), metabolism (know inputs/outputs/regulation of each pathway and where they connect — e.g., acetyl-CoA from glycolysis vs beta-oxidation entry to TCA), molecular lab methods.

**Passage:** 10 experiments: "Researchers mutated X residue to alanine. Figure 1 shows activity vs pH. Which hypothesis supported?" Requires connecting mutation -> structure -> activity -> graph.

#### Psychological, Social, Biological Foundations — The memorizable +3

**Content:** Psychology 65% (learning/memory/attention/cognition/motivation/personality/disorders/stress), Sociology 30% (stratification, institutions, demographics, socialisation, group processes), Biology 5% (nervous system: brain structures, neurotransmitters — overlaps with Bio).

**Why this is the easiest to improve:** 70% is definition recall (e.g., fundamental attribution error, social capital, operant conditioning schedules, assimilation vs accommodation) — Anki flashcards yield +3-4 points with 4 weeks of 30 min/day. AAMC content list (300+ terms) is finite.

**Passage:** Research study bar graph + term application: "Stereotype threat experiment: Group A (threat) scored lower. Which concept?" — apply term to data.

**Common miss:** Confusing near terms (negative reinforcement vs punishment, retrograde vs anterograde amnesia, assimilation vs accommodation) — create contrast cards, not single definition cards.

---

### Registration, Fees, Score Pipeline (2024-2025)

**AAMC account + AMCAS (or AACOMAS/COMSAS):** aamc.org -> MCAT registration (opens October for next year's 30 dates).

**Dates 2024-2025 (~30, Jan-Sep):** Jan 13, 26; Mar 8, 22; Apr 12, 26; May 10, 24; Jun 14, 28; Jul 12, 26; Aug 2, 16, 30; Sep 6, 13 — check AAMC calendar (seats per date vary by centre).

**Zones:** Gold Zone (29+ days before) regular USD 330; Silver (15-28 days) Silver fee; Bronze (8-14 days) highest + no reschedule to new date within same zone. Book Gold (4-6 weeks ahead); Saturday seats fill first.

**Fees:** USD 330 regular / ~USD 380 Bronze (latest). Fee Assistance Program (FAP): US need-based, reduces to USD 135, free Official Prep bundle (USD 268 value), waived AMCAS fees (up to 20 schools) — apply 4-6 weeks before intended test; approval takes 10-15 days.

**Retake rules:** 3 per testing year, 4 per 2 years, 7 lifetime. Void option at end (cancel without scoring) — if you had a disruption (illness, panic, tech), void; void still counts as one of 3 per year but not as scored attempt for admissions (AMCAS shows void not score).

**Score release:** 14-35 days (most 30 days) — check AAMC release calendar by test date. Auto-sent to AMCAS/AACOMAS if you authorize at registration; otherwise manual send USD 35.

---

### Scoring: 472-528 — What It Means for Admissions

| Total | Per-section avg | Percentile (2023 applicant pool) | Matriculant Competitiveness |
|-------|-----------------|----------------------------------|------------------------------|
| 524-528 | 131-132 | 98-100 | Harvard / Stanford / Hopkins / UCSF |
| 518-523 | 129-130 | 94-97 | Top 20 (UCLA, Duke, Michigan) |
| 513-517 | 128 | 85-93 | Strong MD (state flagships) |
| 509-512 | 127 | 70-84 | MD competitive (mean accepted 512) |
| 505-508 | 126 | 55-69 | DO competitive, lower MD |
| 500-504 | 125 | 40-54 | Median applicant (not matriculant) — gap for MD |

**Section percentiles differ:** 132 ~ 99th, 129 ~ 90th, 127 ~ 70th, 125 ~ 45th on each section. CARS 132 is rarer than Bio/Biochem 132.

**Confidence band:** Report shows score +/- ~2 points (68% CI). AMCAS displays band.

---

### Official Practice — The Only Predictor

**Free AAMC:** Sample Test (unscaled, for content), Official Guide Questions (120), CARS Diagnostic Tool, Khan Academy MCAT (archived videos + passages — retired 2021 but 90% relevant for content).

**Paid AAMC Bundle (USD 268, essential for 515+):** 4 Full-Lengths (FL1-4) + Section Banks (300 difficult passage questions, hardest) + CARS Q Packs + Science Q Packs.

**Predictive validity:** AAMC data (n=5,000) FL average within ±2 of real MCAT. FL1-4 average = real score 90% of cases.

**Sequence:** Sample diagnostic (untimed) -> content review 8-12 weeks (Kaplan/Princeton Review + Anki) -> UWorld (2,200 Qs, supplement) -> AAMC Q Packs -> Section Banks (the wall) -> FL1 (8 weeks out) -> FL2 -> FL3 -> FL4 (1 week before, most predictive) -> light review.

---

### Key Takeaways

1. 7.5-hour stamina — practice full-lengths monthly from month 3; break simulation matters.
2. Bio/Biochem highest yield — amino acids + metabolism (pathway integration) = 15% of test.
3. CARS trainable via structure mapping, not memorisation — 9 passages x 10 min.
4. Psych/Soc is flashcard gold — 70% definitions -> Anki advantage.
5. AAMC FLs are prophecy — average FL = real MCAT +/-2.

"""

guides[(13,1)] = r"""
The JEE Advanced is India's most selective exam — ~180,000 JEE Main qualifiers compete for ~17,500 IIT seats (9.7% acceptance, ~1.8 lakh vs 17.5k) — and the sole entry to 23 IITs (including Bombay, Delhi, Madras, Kanpur, Kharagpur, Roorkee, Guwahati). The 2024-2025 JEE Advanced remains two 3-hour papers (Paper 1 09:00-12:00 + Paper 2 14:30-17:30) on a single Sunday in late May/early June, covering Physics, Chemistry, Maths with variable marking (+3/-1 to +4/-2) and multiple answer types (single correct, multiple correct with partial marking, numerical/integer, matching/paragraph). This guide explains the live pattern with organising-IIT (IIT Madras 2024, next rotates) verified syllabus and cutoffs.

---

### Eligibility Pathway (JEE Main -> Advanced -> JoSAA)

```
Class 12 (75% aggregate OR top 20 percentile of board; SC/ST 65%) 
  -> JEE Main (NTA, 2 sessions Jan + Apr, best of two counts)
    -> Top ~250,000 CRL (including reserves, ~100k GEN) qualify for Advanced (cutoff varies: 90th percentile for CRL, ~75 OBC, ~50 SC/ST)
      -> JEE Advanced (IIT, 1 day, 2 papers)
        -> Rank (subject + aggregate cutoffs)
          -> JoSAA Counselling (6 rounds, choice filling)
            -> IIT seat (branch + campus)
```

**Attempts:** Max 2 consecutive years after Class 12 (e.g., if 12th in 2024, Advanced 2024 and 2025). Third attempt disallowed.

**Boards:** CBSE, ISC, State boards all eligible if 75% or top 20 percentile (equivalence via board percentile, not raw).

---

### Format at a Glance (2024-2025)

| Paper | Time | Subjects | Questions per subject | Marking (yearly variable — check organising-IIT brochure) |
|-------|------|----------|------------------------|------------------------------------------------------------|
| **Paper 1** | 3h (09:00-12:00) | Physics (18) + Chemistry (18) + Maths (18) = 54 | 4-6 single correct (+3/-1), 4-6 multiple correct (+4/-2 or partial +1 per correct, -2 if any wrong), 4-6 numerical (+3/0), 0-2 match/paragraph (+3/-1) | Total per paper ~180 marks |
| **Paper 2** | 3h (14:30-17:30) | Same 18+18+18 = 54 | Same distribution, different order | Same |
| **Total** | **6 hours** | | **108 questions, ~360-378 marks** | Subject + aggregate cutoffs (~10% per subject, ~35% aggregate to rank) |

**Mode:** CBT only (no paper, no at-home). Rough sheet provided.

**Syllabus:** NCERT Class 11-12 base but 20% of Adv requires multi-concept integration 2-4 layers (e.g., thermodynamics + chemical equilibrium + electrochemistry in one physical chemistry question).

**Negative marking:** Numerical (integer/decimal) usually 0 negative; multiple correct partial marking is the differentiator: e.g., 4-option multiple: +4 if all correct, +3 if 3 correct and you marked 3, +1 per correct if partial, -2 if any wrong. Check brochure — varies yearly (2018: -2 for multiple, 2023: partial +1). Assume -2 for any wrong in multiple.

---

### Syllabus Deep Dive (Weight by Past 5 Years)

#### Physics (36q, ~120 marks)

| Topic | Qs/year approx | Why it matters |
|-------|----------------|----------------|
| **Mechanics** | 10-12 | Kinematics, NLM, Work-Energy, Rotational, Gravitation, SHM, Waves — highest questions; 30% integrated (block + spring + friction + SHM + energy) |
| **Electromagnetism** | 8-10 | Electrostatics, Current, Magnetics, EMI, AC, EM Waves — calculus heavy |
| **Heat, Thermo, Fluids, Optics, Modern** | 8-10 | Thermodynamics + KTG, Sound, Wave/Ray Optics, Nuclear, Photoelectric, Semiconductors |
| **Errors/Units, Experimental** | 1-2 | Often integrated, not separate |

#### Chemistry (36q, ~120 marks)

| Topic | Qs/year | Twist |
|-------|---------|-------|
| **Physical** | 12-14 | Mole, Equilibrium (chemical + ionic), Electrochemistry, Thermodynamics, Kinetics — numerical heavy; Adv asks reasoning (why shift?) |
| **Organic** | 10-12 | GOC, Isomerism, Hydrocarbons, Oxygen/Nitrogen-containing, Biomolecules, Polymers — mechanism over memory; Adv asks "why planar vs pyramidal?" |
| **Inorganic** | 10-12 | Periodic, Chemical Bonding, Coordination, p-block, d/f-block, Qualitative — NCERT line-by-line plus reasoning (back bonding, Fajans, MOT) |

#### Mathematics (36q, ~120 marks)

| Topic | Qs/year | Twist |
|-------|---------|-------|
| **Algebra** | 10-12 | Complex, Quadratic, Sequence, Perm-Comb, Binomial, Probability — 4-5 q on Perm-Comb + Prob |
| **Calculus** | 10-12 | Functions, Limits, Continuity, Differentiability, Application, Integral, DE — highest fail rate; 40% combinatorial ("number of integral values of 'a' such that...") |
| **Coordinate Geometry** | 6-8 | Line, Circle, Parabola, Ellipse, Hyperbola, 3D, Vectors — conic + vectors integrated |
| **Trigonometry** | 4-6 | Equations, properties, inverse — often with calculus |

---

### Registration (jeeadv.ac.in, Organising IIT — 1-week window)

**Qualify JEE Main:** Appear Jan + Apr (best of two). Must be in top ~250k CRL (includes reserves).

**Register on jeeadv.ac.in:** Window ~1 week after Main results (late April - early May). Upload Class 12 certificate, category (OBC/SC/ST/EWS) certificate (central format), photo, signature. Pay: GEN/OBC male ~INR 2,800; Female/SC/ST/PwD ~INR 1,400 (via SBI/Netbanking).

**Admit card:** jeeadv.ac.in ~1 week before (usually last Sunday in May). Two papers same day; must attempt BOTH — missing one = absent (no rank).

**Exam cities:** 200+ cities; choose 8 preferences; allotment by NTA computer.

---

### Scoring, Cutoffs, Rank Logic (Floats with Difficulty)

| Rank | Marks/360 (approx — varies year: 2023 top 1 = 341, CRL 20k = 86, 2016 hard year CRL 20k = 71) | Category |
|------|------------------------------------------------|----------|
| 1-100 | 280-341 | Top 0.05%, IIT Bombay CSE core |
| 100-1,000 | 220-280 | IIT Bombay/Deli/Madras CSE cutoff ~220 |
| 1,000-5,000 | 150-220 | IIT top branches (Electrical, Mechanical, Chemical) |
| 5,000-10,000 | 95-150 | IIT newer campuses/lower branches |
| 10,000-20,000 | 70-95 | Qualifying (last IIT seat) |

**Subject cutoffs:** ~10-12% per subject (Physics, Chemistry, Maths) + ~35% aggregate (~126/360) to be ranked. Failing one subject (<10%) = no rank even if total 200+.

**Why two papers:** Single paper saturates above 85; two papers (108 q) differentiate ranks 1-10,000.

---

### Preparation Context: Advanced vs Main

| Dimension | JEE Main | JEE Advanced |
|-----------|----------|--------------|
| Qs/hour | 30/hr (90q/3h) | 18/hr (54q/3h) |
| Time per Q | 2 min | 3.3 min |
| Negative | -1 all | -2 multiple, mixed |
| Concept layers | 1-2 | 2-4 integrated |
| NCERT dependence | 50% direct | 10% direct; reasoning from NCERT |

Advanced rewards depth over speed — 3.3 min allows 4-concept integration.

---

### Official Practice

Previous Advanced papers 2007-2023 (organising-IIT PDFs) + jeeadv.ac.in mock CBT 2 weeks before (interface check). No official syllabus book — NCERT + H.C. Verma, Irodov, M.S. Chouhan, Cengage — but prioritize Advanced papers over Main papers for difficulty calibration.

---

### Key Takeaways

1. 6 hours, 2 papers, 360 marks — stamina + depth, must do both.
2. Per-subject ~10% floor — cannot sacrifice one subject.
3. Previous Advanced papers are prophecy — practice all from 2015+.
4. Negative varies by type — master multiple-correct partial logic; guessing on single is -1.

"""

# Now apply
replacements = 0
for (num, art), body in guides.items():
    # find exam name
    # lookup exam name from text search
    # Instead, search for ARTICLE art + EXAM: pattern with any exam name
    # Easier: search for ARTICLE {art}\nEXAM: and then check if exam_num matches via proximity to EXAM #num
    # Use regex to find ARTICLE art block that is inside EXAM #num section
    # Find EXAM #num header position
    header = f"EXAM #{num} —"
    hpos = text.find(header)
    if hpos == -1:
        print(f"WARN header {header} not found")
        continue
    # Find next ARTICLE art after header
    marker = f"ARTICLE {art}\nEXAM:"
    mpos = text.find(marker, hpos)
    if mpos == -1:
        print(f"WARN marker ARTICLE {art} not found after EXAM #{num}")
        continue
    # Now find FULL ARTICLE block after marker
    # Search for FULL ARTICLE: ... FAQ: from mpos
    pat = re.compile(r"FULL ARTICLE:\s*\n(.*?)\n============================================================\s*\n\s*FAQ:", re.DOTALL)
    mm = pat.search(text, mpos)
    if not mm:
        print(f"WARN FULL ARTICLE not found for EXAM #{num} ARTICLE {art}")
        continue
    start, end = mm.span(1)
    old_len = end-start
    new_body = body.strip()
    text = text[:start] + new_body + text[end:]
    replacements += 1
    print(f"Deepened EXAM #{num} ARTICLE {art}: {old_len} -> {len(new_body)} chars")

FILE.write_text(text, encoding='utf-8')
print(f"Batch2 done. Replacements: {replacements}, Size: {len(text)/1024:.1f} KB, Lines: {len(text.splitlines())}")
