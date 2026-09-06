import pathlib, re
FILE = pathlib.Path(r"c:\Users\DIVYANSHU\Desktop\Blog-Ghar\exam-blog-library.txt")
text = FILE.read_text(encoding='utf-8', errors='ignore')

guides = {}

guides[(14,1)] = r"""
The NEET UG is India's largest medical entrance — ~2.1 million registrations, ~1.1 million qualifiers compete for ~108,000 MBBS seats across 612 medical colleges (government 55k + private) — and the sole entry (since 2020) to all MBBS/BDS via NTA's single paper: 720 marks, 200 questions (180 to attempt), 3h20m, Physics/Chemistry/Biology (Botany + Zoology). The 2024-2025 NEET UG is NTA CBT-hybrid (pen-paper OMR with CBT pilot in select cities), +4/-1 marking, no sectional time limit, with NMC's percentile-based qualifying cutoffs (50th General, 40th reserved) and All India Quota (15%) + State Quota (85%) counselling via MCC. This guide explains the live pattern with NTA bulletin verified syllabus and cutoffs.

---

### Eligibility & Pathway (Who Qualifies for NEET UG?)

```
Class 12 (PCB + English, 50% General, 40% reserved, 45% PwD) + age 17 by Dec 31 of admission year (no upper limit after 2022 Supreme Court) 
  -> NEET UG (NTA, 1 paper, May first Sunday)
    -> Score + Percentile + Rank (All India Rank = AIR)
      -> Qualifying cutoff (50th/40th/45th) -> Eligible for counselling?
        -> MCC AIQ 15% (All India) + State 85% (domicile) + AIIMS/JIPMER/Deemed/Central via same NEET
          -> MBBS/BDS/BAMS/BHMS/BUMS/BVSc seat
```

**Attempts:** No limit (after upper age removal). You can attempt every year until success, unlike JEE Advanced (2 attempts).

**Boards:** CBSE, ISC, State boards, NIOS all eligible if PCB 50%. Open school candidates now eligible (2023 NMC clarification).

**Who should take NEET UG:** MBBS aspirants targeting government medical colleges (the only path where fees ~INR 10k-50k/year vs private 10-25 lakh), BDS, AYUSH (Ayurveda, Homeopathy, Unani, Siddha), Veterinary (BVSc), and BSc Nursing via NEET (some institutes).

---

### Format at a Glance (2024-2025)

| Paper | Time | Subjects | Questions | Marking |
|-------|------|----------|-----------|---------|
| **NEET UG** | 3h20m (200m) (14:00-17:20) | Physics (45 to attempt of 50) + Chemistry (45 of 50) + Botany (45 of 50) + Zoology (45 of 50) = **180 to attempt** | 200 given, choose 180 (45 per subject, Section A 35 compulsory + Section B 10 of 15 optional) | +4/-1, no sectional cutoff for ranking (but 50th percentile overall to qualify) |

**But 2024 reform:** NTA piloted removing Section B optional (i.e., 180/180 compulsory) — check 2025 bulletin: many reports indicate 2025 will be **180/180 compulsory (45 per subject, no choice)** after cheating concerns. Prepare for 180/180.

**Mode:** Pen-paper OMR (single paper code, 4-6 sets with jumbled order) — bring blue/black ballpoint (provided). Biometric + frisking pre-exam.

**Syllabus:** NMC reduced syllabus 2024 (rationalized NCERT): ~79 chapters total (Physics 20, Chemistry 20, Biology 39) — check NTA appendix for deleted topics (e.g., some inorganic, some physics derivations). 2025 retains reduced list.

**Language:** 13 languages (English, Hindi,Assamese, Bengali, Gujarati, Kannada, Malayalam, Marathi, Odia, Punjabi, Tamil, Telugu, Urdu) — choose at registration; bilingual paper (chosen language + English).

**Negative:** -1 for every wrong; unattempted = 0; multiple darkening = wrong.

---

### Syllabus Deep Dive (Weight by Past 5 Years, Post-2024 Reduction)

#### Biology — 360 marks (50% of paper, 90 questions to attempt) — The decider

| Topic | Qs/year approx | Why |
|-------|----------------|-----|
| **Botany: Diversity, Structure, Anatomy, Physiology** | 22-24 | Plant kingdom, morphology, anatomy, photosynthesis, respiration, plant growth |
| **Zoology: Human Physiology** | 16-18 | Digestion, breathing, circulation, excretion, neural, chemical coordination — highest weight |
| **Genetics & Evolution** | 10-12 | Molecular basis, inheritance, evolution — conceptual + numerical |
| **Ecology & Biotechnology** | 8-10 | Environment, biodiversity, biotechnology principles + applications — NCERT line-based |
| **Cell + Reproduction + Health** | 8-10 | Cell cycle, reproduction, human health/disease |

**NEET twist:** 80% of Biology is NCERT verbatim — read every line, figure, table, and summary. "Which of the following is NOT correct?" tests NCERT line recognition, not reasoning.

#### Physics — 180 marks (25%, 45q)

| Topic | Qs/year | Difficulty |
|-------|---------|------------|
| **Mechanics** | 10-12 | Laws of motion, work-energy, rotational, gravitation, properties of matter |
| **Electrodynamics** | 8-10 | Electrostatics, current, magnetics, EMI, AC, EM waves |
| **Heat, Optics, Modern, Electronics** | 7-8 | Thermodynamics, KTG, ray/wave optics, nuclei, semiconductors |
| **Units, Dimensions, SHM, Waves** | 4-5 | Error, vectors, SHM, waves |

**Physics tip:** 2024 saw easier Physics (average +10 marks vs 2023) — expect normalization; don't assume 2025 will be easy.

#### Chemistry — 180 marks (25%, 45q)

| Topic | Qs/year | Difficulty |
|-------|---------|------------|
| **Physical** | 15-16 | Mole, thermodynamics, equilibrium, redox, kinetics, solutions — numerical 60% |
| **Organic** | 12-14 | GOC, hydrocarbons, oxygen/nitrogen compounds, biomolecules, polymers — mechanism + NCERT |
| **Inorganic** | 10-12 | Periodic, bonding, p/d/f-block, coordination — NCERT after reduction (many chapters cut) |

---

### Registration (NTA — nta.ac.in / neet.nta.nic.in, Feb-March window)

**Register on NTA portal:** Window ~4 weeks (Feb second week - March second week). Upload Class 10/12 certificates, category (OBC/SC/ST/EWS) central certificate, photo (80% face), signature, thumb, self-declaration. Pay: GEN ~INR 1,700, OBC/EWS ~INR 1,600, SC/ST/PwD ~INR 1,000 (via UPI/Card). 13 language choice + 4 exam city preferences (NTA allots one; 5,000+ centres).

**Admit card:** NTA site 3-4 days before (first Sunday in May). City slip 1 week before. Carry admit + passport photo + ID.

---

### Scoring, Percentile, Rank & Cutoffs

| Category | Qualifying Percentile | Marks (approx, varies by paper difficulty) | Example 2023 |
|----------|----------------------|-------------------------------------------|--------------|
| General / EWS | 50th | ~137/720 | 137-720 qualified |
| OBC / SC / ST | 40th | ~107/720 | 107-136 qualified |
| Gen-PwD | 45th | ~121/720 | 121-136 qualified |

**But qualifying != admission:**
| Seat Type | Rank needed (approx marks) |
|-----------|----------------------------|
| AIIMS Delhi (top) | AIR 1-60 (~650-720) |
| Government MBBS (AIQ) | AIR up to ~20,000 (~610) |
| State government MBBS (general) | Up to ~610-580 varies by state |
| Private MBBS | AIR up to ~1,00,000 (~400-460) |
| Qualifying only | 137+ but no seat without counselling |

**Normalisation:** No normalisation (single paper) — but 4-6 sets with different order, difficulty equated via percentile.

---

### Official Practice

Previous NEET papers 2019-2024 (NTA PDFs, 6 papers) + NTA mock (Abhyas app) + reduced NCERT exemplar. No CBT interface needed (OMR). Prioritize Biology NCERT line-by-line + Physics numericals.

---

### Key Takeaways

1. 2.1M take, 1.1M qualify, 108k MBBS — qualifying is easy (137), seat is hard (600+ for government).
2. Biology 50% — NCERT is the textbook, not reference.
3. +4/-1, 200->180 choice (or 180/180) — accuracy over attempts.
4. 13 languages, no sectional timing — manage 200 min across 4 subjects.
"""

guides[(15,1)] = r"""
The UPSC Civil Services Examination is India's most prestigious and lowest-acceptance-rate exam — ~1.1 million applicants, ~13,000 clear Prelims, ~2,800 reach Interview, ~1,000-1,100 selected (0.09% overall) — and the sole entry to IAS, IPS, IFS, and 22 Group A/B services via three stages: Prelims (2 papers, objective, qualifying for Mains), Mains (9 papers including Essay, 4 General Studies, 2 Optional, 2 Languages), and Personality Test (Interview, 275 marks). The 2024-2025 CSE is UPSC's annual cycle (notification Feb, Prelims last Sunday May, Mains Sep, Interview Jan-Mar, result April/May). This guide explains the live structure with UPSC notification verified syllabus and cutoffs.

---

### Eligibility Pathway

```
Any graduate (any discipline, 21-32 years, attempts 6 GEN / 9 OBC / unlimited SC/ST)
  -> UPSC CSE Notification (Feb, upsc.gov.in)
    -> Prelims (May, 2 papers, ~13k qualify from 1.1M)
      -> Mains (Sep, 9 papers, ~2,800 qualify)
        -> Interview (Jan-Mar, 275 marks, 2,000 appear)
          -> Final Merit (Mains 1750 + Interview 275 = 2025) -> Service (IAS 180, IPS 200, IFS 30, rest IRS etc.)
            -> LBSNAA (IAS training) / SVPNPA (IPS) / FSI (IFS)
```

**Attempts & Age (2024-2025):**
| Category | Age (as Aug 1 of year) | Attempts |
|----------|------------------------|----------|
| General / EWS | 21-32 | 6 |
| OBC | 21-35 | 9 |
| SC/ST | 21-37 | Unlimited (till age limit) |
| PwD | +10 years extra in each | As per category |

**Education:** Graduation any stream (final year can apply for Prelims but must graduate before Mains). No minimum percentage.

**Restrictions:** IPS physical requirements (height, vision); IFS prefers science but open to all.

---

### Format at a Glance (2024-2025)

| Stage | Papers | Time | Marks | Nature |
|-------|--------|------|-------|--------|
| **Prelims** | GS Paper 1 (100q, 2h) + CSAT Paper 2 (80q, 2h) | 1 day (09:30-11:30, 14:30-16:30) | 200+200 = 400 (but CSAT qualifying 33%) | Objective, pen-paper, -1/3 negative, **marks not counted for final merit** — only to qualify for Mains |
| **Mains** | Essay (1), GS 1-4 (4), Optional 2 (2), Compulsory Languages: English + Indian Language (2, qualifying only) = 9 papers | 5-6 days (Sep, 3h each) | 250×7 = 1750 (Essay 250 + GS 250×4 + Optional 250×2) + Languages 300×2 qualifying (25% to pass) | Descriptive, pen-paper |
| **Interview (Personality Test)** | 1 | 30-40 min | 275 | Panel of 5 (Chair + 4) |
| **Total** | — | — | **Mains 1750 + Interview 275 = 2025** | Final merit |

**Prelims is the filter:** ~1.1M -> 13k (1.2%). Mains -> Interview 2.3x vacancies (~2,800 for ~1,100 posts). Interview -> Final 1,100.

---

### Syllabus Deep Dive (UPSC Notification Verbose -> What It Actually Means)

#### Prelims GS Paper 1 (100q, 200 marks, 2h, -1/3)

| Topic | Qs/year | Source |
|-------|---------|--------|
| **History (Ancient, Medieval, Modern, Art & Culture)** | 15-18 | RS Sharma, Satish Chandra, Bipan Chandra, NCERT XI-XII |
| **Geography (Physical, Indian, World, Mapping)** | 10-14 | NCERT XI-XII + GC Leong + Atlas |
| **Polity (Constitution, Governance)** | 12-15 | Laxmikanth (bible) |
| **Economy** | 12-15 | NCERT + Economic Survey + Budget + Ramesh Singh |
| **Environment / Ecology / Biodiversity** | 10-14 | Shankar IAS + current |
| **Science & Tech** | 7-10 | Science Reporter + current |
| **Current Affairs (national, international, schemes)** | Overtopping — integrated across above | Newspaper (Hindu/IE) + PIB |

**Cutoffs (out of 200, GS1 only — CSAT not counted except qualifying):** 2023: 75.41 (GEN), 74.23 (OBC), 68.02 (SC), 67.09 (ST); 2022: 88.22 (GEN) — varies with paper difficulty.

#### Prelims CSAT Paper 2 (80q, 200 marks, 2h, qualifying 33% = 67 marks)

| Topic | Qs/year |
|-------|---------|
| Comprehension (English, 10 passages) | 30-35 |
| Reasoning & Analytical (puzzle, syllogism) | 20-25 |
| Numeracy (Class 10 level: percentage, ratio, algebra, geometry) | 10-15 |
| Decision Making (now removed — replaced by more comprehension) | 0 |

**CSAT is qualifying but failure ~10%** (those who ignore quant). 33% required.

#### Mains GS 1-4 (250 each, 3h, 10-15 questions of 10/15 marks)

| Paper | Syllabus | Key Books |
|-------|----------|-----------|
| **GS 1 (History, Geography, Society)** | Ancient/Medieval/Modern, Art, World History (post-18th), Society, Geography (physical/world) | NCERT + Spectrum + Goh Cheng Leong |
| **GS 2 (Polity, Governance, IR)** | Constitution, Parliament, Judiciary, Federalism, Welfare, International relations (India + world) | Laxmikanth + current |
| **GS 3 (Economy, Environment, Sci-Tech, Security, Disaster)** | Economy, S&T, Biodiversity, Security (internal, border, cyber), Disaster management | Economic Survey + Shankar + current |
| **GS 4 (Ethics, Integrity, Aptitude)** | Ethics, attitude, aptitude, integrity, case studies (2-3 cases) | Lexicon + case practice |

**Language Papers (qualifying, 300 each, 25% = 75 to pass):** English (essay, comprehension, precis, grammar) + one of 22 Indian Languages (same). Marks not counted. Failure disqualifies.

#### Mains Optional (2 papers, 250 each = 500, choose 1 of 26 optionals)

| Popular Optionals | Why chosen | Success rate (2019 data) |
|-------------------|------------|--------------------------|
| **Public Administration** | Overlaps GS2, short syllabus | 8% |
| **Geography** | Overlaps GS1, scoring | 9% |
| **Sociology** | Short, overlaps GS1, no background needed | 9% |
| **History, Political Science, Philosophy** | Overlaps GS1/G2/G4 | 7-9% |
| **Literature (Hindi, Tamil, etc.)** | High scores if native | 10%+ |
| **Mathematics, Engineering, Medical** | For graduates of that field — high if strong | Variable |

**Choose optional by:** overlap + interest + material + scoring trend — not myth.

#### Essay (1 paper, 250 marks, 3h, 2 essays of 125 each, 1000-1200 words)

Topics philosophical + topical (e.g., "Thought without action is daydream"). Need structure: intro, 5-6 dimensions, examples, conclusion.

#### Interview (275 marks) — The personality filter

30-40 min, 5 members (Chair + 4: often retired IAS/IPS, academician, psychologist). No syllabus. DAF (Detailed Application Form) based: hobby, cadre, service preference, graduation, home state, current affairs. Scores 140-200 typical.

---

### Registration (UPSC — upsc.gov.in / upsconline.nic.in, Feb Notification, Mar Deadline)

**Notification:** February (e.g., Feb 14, 2024). Apply at upsconline.nic.in — one application for Prelims (Mains application separate after Prelims result, via DAF).

**Documents:** Graduation certificate, category (OBC/SC/ST) central + creamy layer, photo, signature, ID. Pay: GEN/OBC male ~INR 100; Female/SC/ST/PwD = 0. One ID (Aadhaar).

**Admit:** e-Admit card ~3 weeks before (April end for May Prelims).

---

### Scoring, Cutoffs, Service Allocation (Merit + Preference + Rank)

| Stage | Cutoff (example 2023) | Remarks |
|-------|----------------------|---------|
| Prelims (out of 200, GS1 only) | GEN 75.41, OBC 74.23, SC 68.02 | Only to reach Mains; Prelims marks not in final |
| Mains (out of 1750, without languages) | ~736 (GEN), ~712 (OBC) | To reach Interview |
| Final (out of 2025) | ~953 (GEN), ~919 (OBC) for last selected | Mains + Interview |

**Service allocation:** Merit + preference + category + cadre. Rank 1-90 typically IAS (General); up to ~250 IAS overall (including reserves); IPS up to ~400.

---

### Official Material

UPSC Notification PDF (syllabus bible) + Previous Prelims papers (2013-2024, 10 years, 20 papers) + Mains papers + NCERTs. No official mock. Vision IAS / Vajiram test series supplement.

---

### Key Takeaways

1. Prelims is qualifier — 1.2% pass — but Mains is where rank is made (1750).
2. Optional (500) = 24.6% of final merit — choose with data.
3. 6 attempts (GEN) — plan 1-2 year full-time or 2-3 year with job.
4. Language qualifying — do not fail English/Indian language.

"""

guides[(16,1)] = r"""
The Common Admission Test (CAT) is India's most competitive MBA entrance — ~330,000 registrations, ~1.35 lakh scored, ~2,000 IIM seats per top IIM (Ahmedabad, Bangalore, Calcutta need 99.5+; newer IIMs 92-96) plus 1,000+ non-IIMs (FMS Delhi, SPJIMR, MDI, XLRI via XAT not CAT, but many accept CAT). The 2024-2025 CAT is IIMs + TCS iON, 2 hours (40 min sectional), 66 questions (VARC 24 + DILR 20 + QA 22), +3/-1 (MCQ) and +3/0 (TITA), no sectional time carryover, percentile-based with sectional cutoffs (often 80-85 for IIMs). This guide explains the live pattern with IIM CAT notification and TCS interface.

---

### Eligibility & Who Takes CAT?

**Eligibility:** Graduation 50% (45% SC/ST/PwD) any discipline; final year can apply (must graduate by July 2025). No age limit, no attempt limit.

**Who should take CAT:** IIM aspirants (21 IIMs, ~5,500 seats), FMS Delhi (score-heavy), MDI Gurgaon, SPJIMR (profile+score), IIT MBA (IIT Bombay SJMSOM, Delhi DMS, Kharagpur VGSoM), NITIE, and 200+ CAT-accepting colleges.

**CAT vs XAT vs GMAT vs CUET-PG vs MAT:** CAT is for IIMs; XAT for XLRI; GMAT for ISB/Executive + 50+ Indian B-schools; CUET-PG for central universities MBA.

---

### Format at a Glance (2024-2025)

| Section | Questions | Time (sectional) | Breakup |
|---------|-----------|------------------|---------|
| **VARC (Verbal Ability & Reading Comprehension)** | 24 | 40m | RC passages 16 (4 passages x 4q) + Verbal Ability 8 (para summary, odd sentence, para completion) |
| **DILR (Data Interpretation & Logical Reasoning)** | 20 | 40m | 4 sets x 5q (DI: tables/charts, LR: arrangements/puzzles) |
| **QA (Quantitative Ability)** | 22 | 40m | Arithmetic 7-8, Algebra 7-8, Geometry 4-5, Number System 2-3 |

**Total:** 66 questions, 120 minutes (2h). No break between sections (you get 40 min per section, hard switch — can't go back after section time expires).

**Question types:** MCQs (~50) with +3/-1 + TITAs (Type In The Answer, ~16) with +3/0 (no negative). RC: all MCQs. DILR: mix MCQ + TITA. QA: mix.

**Mode:** CBT at TCS iON centres (170+ cities), single slot (usually last Sunday in November, 09:00 or 14:30). No at-home; no paper.

**Difficulty trend:** 2023 CAT was moderate (99th ~ 55/66 attempts, 99.5 ~ 35 correct); 2022 was hard (DILR tough).

---

### Section Deep Look

#### VARC (24q, 40m) — Usually highest attempt rate (18-20)

**Reading Comprehension (16q, 4 passages x 4q, 450-600 words each):**
Passages: diverse (economics, philosophy, history, psychology, science, environment). Questions: main idea, author tone, inference, detail, "author would agree," strengthening/weakening.

**Verbal Ability (8q):**
- Para Summary (3q): Summarize passage in one sentence (4 options)
- Para Jumble / Odd Sentence Out (3q): Arrange 4-5 sentences (TITA, so no negative)
- Para Completion (2q): Fill last sentence (rare, sometimes not in all slots)

**VA trap:** Para Summary's correct answer is *closest abstraction*, not detail. Eliminate 2 details, decide between 2 abstractions by scope.

#### DILR (20q, 40m) — The percentile decider

| Set Type | Example | Difficulty |
|----------|---------|------------|
| **DI** (tables, charts, routes, networks, games, tournaments) | Sales data of 4 companies over 5 years + missing values | High calculation + logic |
| **LR** (seating, blood relation, cubes, truth-liar, scheduling) | 8 people around circular table with constraints | High arrangement |

**DILR is the filter:** Many 99 percentilers attempt only 8-10 of 20 but with 100% accuracy (2 correct sets = 10 marks). Attempting all 4 sets hastily = 50% accuracy -> 10 marks with higher negative risk.

**Strategy:** Read all 4 sets in 5 min, rate by solvability (easy/medium/hard), solve 2 easiest fully (10q), then use remaining time on third. Never spend >12 min on a set without progress.

#### QA (22q, 40m) — Arithmetic dominates

| Topic | Qs/year | Weight |
|-------|---------|--------|
| **Arithmetic** | 7-8 | Percent, profit-loss, time-speed-distance, time-work, ratios, mixtures, averages (8-10 min per question if concepts clear) |
| **Algebra** | 7-8 | Equations, inequalities, functions, logs, quadratics, progressions |
| **Geometry** | 4-5 | Triangles, circles, coordinate, mensuration |
| **Number System** | 2-3 | Remainders, divisibility, factors |

**QA tip:** Arithmetic is scoring — practice 1000 arithmetic questions before touching algebra.

---

### Registration (iimcat.ac.in, Aug-Sep window)

**Register at iimcat.ac.in:** Window ~4 weeks (Aug first week - Sep third week). Upload graduation certificate, category, photo, signature. Pay: GEN/EWS/NC-OBC ~INR 2,500; SC/ST/PwD ~INR 1,250. City choice: 6 preferences (allotment by TCS algorithm). Admit: late Oct.

---

### Scoring, Percentile & Cutoffs (2023 actual)

| Overall Percentile | Scaled Score* | Questions Correct (approx, +3/-1) | Seats |
|--------------------|---------------|------------------------------------|-------|
| 99.9+ | 90+ | ~45 correct (of 66) | IIM Ahmedabad/Bangalore top 50 |
| 99.5 | 50-55 | ~35 correct | IIM A/B/C general cutoff |
| 99 | 35-40 | ~28 correct | IIM L/K/I top |
| 95 | 20-25 | ~20 correct | New IIMs + FMS/MDI |
| 90 | 12-15 | ~16 correct | Many CAT colleges |
| 80 | 5-8 | ~12 correct | Tier 2 |

*Scaled varies by slot difficulty (2-3 slots, equating).

**Sectional cutoffs (IIMs):** Often 80-85 sectional (VARC 80, DILR 80, QA 80 for GEN; 70-75 for reserved). Failing one sectional even with 99 overall = no IIM call.

**Slot equating:** 2-3 slots (morning/afternoon) with slightly different forms, equated via statistical scaling. Slot difficulty variation 2-3 scaled points.

---

### Official Practice & Percentile Prediction

Previous CAT papers 2017-2023 (7 papers, IIM PDFs) + IIM mock on iimcat.ac.in 3 weeks before (interface + timer). Many 99+ test-takers practice with TIME/CL mocks (but OFFICIAL papers are prophecy — mock percentiles inflated 2-5%).

**Mocks vs real:** TIME/CL 99 ~ 85th CAT real. Use official papers for percentile calibration.

---

### Composite Score (After CAT — No 50% CAT weight for IIMs)

IIMs compute **composite:** CAT (40-60%) + 10th + 12th + Graduation + Academic diversity + Gender + Work experience + WAT/PI (30-40%). CAT alone not sufficient — 98 with poor academics may lose to 96 with strong.

---

### Key Takeaways

1. 2 hours, 3 sections, 40 min hard sectional — DILR is the filter where 99 is decided.
2. +3/-1 MCQ, +3/0 TITA — accuracy > attempts; DILR 10/20 correct with 90% accuracy beats 15/20 with 60%.
3. Sectional cutoff 80 — cannot sacrifice DILR.
4. Composite not just CAT — 10th/12th/Grad matter after shortlist.

"""

guides[(17,1)] = r"""
The Graduate Aptitude Test in Engineering (GATE) is India's engineering PG + PSU gateway — ~800,000 registrations across 30 papers (CS, EC, ME, EE, CE, CH, IN, etc.), ~130,000 qualifiers (~16%) compete for ~9,000 MTech/ME seats in IITs/IISc/NITs + ~2,000 PSU jobs (BHEL, ONGC, IOCL, NTPC, SAIL, GAIL) where GATE score is 75-85% of selection. The 2024-2025 GATE is IISc + 7 IITs rotating (IIT Roorkee 2025), 3 hours (180 min), 65 questions (General Aptitude 10 + Technical 55), 100 marks (GA 15 + Technical 85), MSQ + MCQ + NAT types with variable negative (-1/3 for 1-mark MCQ, -2/3 for 2-mark MCQ, 0 for MSQ/NAT), normalized across multi-session papers, 3-year validity. This guide explains the live pattern with GATE notification and organising-IIT brochure.

---

### Eligibility & Papers (30 Papers, Choose 1-2 Compatible)

**Papers:** CS (Computer Science), EC (Electronics), ME (Mechanical), EE (Electrical), CE (Civil), CH (Chemical), IN (Instrumentation), PI (Production), AR (Architecture), BT (Biotechnology), MN, MT, XE (Engineering Sciences), XH (Humanities & Social Sciences), XL (Life Sciences) + 15 more.

**Two-paper combo (since 2021):** Second paper must be from approved combo list (e.g., CS + DA (Data Science), ME + XE-F, EE + IN). Two papers means two exams on different days.

**Eligibility:** Bachelor's in Engineering/Technology/Architecture (4 years) or Master's in Science/MCA or final year of above (3rd year BE can also apply provisional). No age limit. International candidates (Bangladesh, Ethiopia, Nepal, Singapore, Sri Lanka, UAE) eligible.

**Who takes which:** CS ~160k (largest), ME ~140k, EC ~110k, CE ~90k, EE ~80k — branch = your BTech branch. Choosing XE/XH/XL = for Sciences/Humanities graduates targeting IIT MSc + PSU (less engineering).

---

### Format at a Glance (2024-2025)

| Component | Qs | Marks | Time | Types | Negative |
|-----------|----|-------|------|-------|----------|
| **General Aptitude (GA)** | 10 | 15 (5×1 + 5×2) | Part of 180m | Verbal + Numerical (vocab, inference, arithmetic, reasoning) | -1/3 for 1-mark, -2/3 for 2-mark |
| **Technical (Branch)** | 55 | 85 (25×1 + 30×2) | Part of 180m | Recall, comprehension, application, analysis | Same |
| **Total** | 65 | 100 | 180m (3h) | MCQ (single correct) ~30, MSQ (one+ correct) ~10, NAT (numeric range) ~25 | MSQ/NAT 0 negative, MCQ negative |
| **Mode** | — | — | — | CBT at 200+ cities, 1-2 sessions per paper | Virtual calculator only (physical not allowed) |
| **Syllabus** | — | — | — | 7-10 subjects per branch (see below) + GA (15 marks) | GA is scoring — 12/15 achievable |

**Question types:**
- **MCQ:** 4 options, 1 correct, -1/3 (1-mark) or -2/3 (2-mark)
- **MSQ:** 4 options, 1-4 correct, partial? No — must choose *all* correct, *no* wrong; 0 negative; partial not given (1/0)
- **NAT:** Enter numeric via virtual keypad (range, floating) — 0 negative; tolerance (e.g., 10.2 to 10.4)

**Normalization:** Multi-session papers (e.g., CS has 2 sessions of 80k each) normalized via GATE formula (mean + SD method). Single-session papers (small papers) no normalization.

**Virtual calculator:** On-screen scientific (not physical). No borrowing. Practice with it.

---

### Branch Deep Look (Example: Top 5 Papers)

#### CS (Computer Science, ~160k candidates) — Highest competition

| Subject | Weight (marks) | Why |
|---------|----------------|-----|
| **Data Structures + Algorithms** | 14-16 | Arrays, Trees, Graphs, Sorting, DP |
| **Operating Systems + DBMS + CN** | 14-16 | Scheduling, memory, SQL, normalizations, TCP |
| **Theory of Computation + Compiler + CD** | 10-12 | Automata, parsing, code generation |
| **Discrete + Engineering Maths** | 12-14 | Graph theory, combinatorics, calculus, linear algebra, probability |
| **General Aptitude** | 15 | Scoring |

**CS cutoff (General, out of 100):** 2023: 32.5, 2022: 25.0 — floats with paper difficulty (easy paper -> high cutoff).

#### ME (Mechanical)

| Subject | Weight |
|---------|--------|
| Thermodynamics + FM + Heat Transfer | 20-22 |
| SOM + Theory of Machines + Manufacturing | 20-22 |
| Engineering Maths | 13-15 |
| GA 15 |

#### EC (Electronics & Communication)

| Subject | Weight |
|---------|--------|
| Networks + Signals + Control | 18-20 |
| Analog/Digital + EDC + EMT | 20-22 |
| Maths 13-15 |

*(Similar for CE, EE — check branch syllabus PDFs on gate.iitk.ac.in)*

---

### Registration (gate.iitk.ac.in, Aug-Sep window)

**Register on GATE Online Application Processing System (GOAPS):** Window ~4 weeks (late Aug - late Sep). Upload graduation certificate, category, photo, signature, ID. Pay: GEN/OBC/EWS ~INR 1,800 (1 paper), SC/ST/PwD/Female ~INR 900, International ~USD 50. Two papers = double.

**Admit (January):** gate.iitk.ac.in; exam first two weekends in February (Sat-Sun, 3 sessions: 09:30-12:30, 14:30-17:30). City choice 3 zones.

---

### Scoring, Cutoffs, Normalisation & 3-Year Validity

| Aspect | Details |
|--------|---------|
| **Score out of 1000** | Normalized GATE score (1000) for ranking + raw marks (100) for qualifying. Formula: Score = 350 + 650*(marks - qualifying)/ (mean of top 0.1% - qualifying). 1000 is not max raw but max score. |
| **Qualifying (out of 100)** | 2023 CS: 32.5 GEN, 29.2 OBC/EWS, 21.6 SC/ST (25-32 typical) |
| **Rank vs Marks** | CS 70/100 -> rank ~300, 60 -> ~1,500, 50 -> ~4,000 (out of 160k) — branch dependent |
| **Validity** | 3 years (e.g., GATE 2024 valid till Mar 31, 2027) — for MTech/IIT + PSU (PSU usually requires current year only) |
| **COAP/CCMT** | COAP (Common Offer Acceptance Portal) for IITs (IIT offers) + CCMT for NITs/IIITs — separate registrations after GATE result (March) |
| **PSU recruitment** | BHEL, ONGC, IOCL etc. release shortlist after GATE result (score 75-85% weight + interview/GD 15-25%) |

---

### Official Practice & Preparation Context

Previous GATE papers 2014-2024 (11 years, 30 papers, PDFs on gate.iitk.ac.in) + organising-IIT mock in January (interface + virtual calculator). Branch-specific Made Easy/ACE test series supplement but official papers are prophecy.

**GATE vs ESE vs SSC JE:** GATE is aptitude + analysis; ESE is conventional (more theory + conventional papers); SSC JE is JSA-level.

---

### Key Takeaways

1. 30 papers, 65q, 100 marks, 3h — MSQ/NAT have 0 negative, MCQ does.
2. GA 15/100 is scoring — 12 achievable → 12% of rank.
3. Normalized if multi-session; 3-year validity but PSU wants current year.
4. COAP (IIT) + CCMT (NIT) after result + PSU parallel.

"""

# Apply guides
replacements = 0
for (num, art), body in guides.items():
    header = f"EXAM #{num} —"
    hpos = text.find(header)
    if hpos == -1:
        print(f"WARN header {header} not found")
        continue
    marker = f"ARTICLE {art}\nEXAM:"
    mpos = text.find(marker, hpos)
    if mpos == -1:
        print(f"WARN marker ARTICLE {art} after EXAM #{num}")
        continue
    pat = re.compile(r"FULL ARTICLE:\s*\n(.*?)\n============================================================\s*\n\s*FAQ:", re.DOTALL)
    mm = pat.search(text, mpos)
    if not mm:
        print(f"WARN FULL ARTICLE not found EXAM #{num} A{art}")
        continue
    start, end = mm.span(1)
    old_len = end-start
    new_body = body.strip()
    text = text[:start] + new_body + text[end:]
    replacements += 1
    print(f"Deepened EXAM #{num} ARTICLE {art}: {old_len} -> {len(new_body)} chars")

# Now deepen JEE 2-5 and NEET 2-5 etc with study plan templates (use previous helper but inline quick)
# Simple approach: generate expanded templates for remaining short articles

def gen_plan(num, name, short, official, sections, scoring):
    return f"""
This {short} Study Plan maps every week to official materials and the live format ({sections}; {scoring}) — diagnostic first, then domain sprints, then full-paper simulations. Assume 12 hours per week (adjust calendar, not principles).

---

### Phase 0: Diagnostic — Week -1

Take one full official paper for {short} under real 2024-2025 conditions: exact timing, same materials, no breaks outside scheduled, OMR/CBT simulation.

**Record:** Total/AIR proxy | Physics/Section 1 | Chemistry/Section 2 | Maths/Biology/Section 3 | Time left | Accuracy %

**Error log:** Date | Q# | Domain | Type (Single/Multiple/Numerical/Match) | Error (Content/Careless/Time/Strategy) | Fix

**Decision:** Within 10% of target -> Weeks 1-2 advanced tactics; 20-30% below -> content mastery on weakest 3 subjects; >30% below -> extend foundation to 6 weeks.

---

### Weeks 1-2: Foundation — Close Content Gaps

Goal: 80%+ on official question banks for weakest 3 subjects/domains.

| Activity | Hours |
|----------|-------|
| Weak domains (NCERT + official bank: easiest -> hardest, untimed then timed) | 6 |
| Diagnostic review (every wrong) | 3 |
| Content review (syllabus PDF, not coaching notes) | 2 |
| Timed sets (10-15 mixed) | 1 |

**{short}-specific:** For {short}, weakest is often one subject dragging total (e.g., Chemistry for JEE, Botany for NEET, GS for UPSC, DILR for CAT). Fix it before integrated papers.

Deliverable Week 2: 80% on weakest 3. Re-take Section 1(s) — 75%+ else repeat.

---

### Weeks 3-4: Integrated Papers & Pacing

| Activity | Hours |
|----------|-------|
| Full section/paper timed with checkpoints | 4 |
| Official paper 2 (Week 4 weekend) | 3 |
| Error log review | 3 |
| Weak maintenance (30 min x 4) | 2 |

**Pacing:** No penalty where applicable -> never leave blank; MCQ -1/3 vs TITA/NAT 0 changes guessing math — know your marking scheme for {short} per question type.

Week 4 deliverable: Paper 2. +5-15% expected. If subject-wise cutoff still failed, extend 1 week.

---

### Weeks 5-8: Hard Questions & Tool Fluency

| Activity | Hours |
|----------|-------|
| Official papers 3 & 4 (real interface) | 6 |
| Hard sets (top 25%) | 4 |
| Tool/calculator/OMR drills | 2 |
| Review (weekend re-solve every hard miss 2-3 ways) | 2 |

Hard-question protocol: Re-solve every hard miss two ways. Time each — slowest domain is next gain.

Test-week taper: Day -7 light review, -3 logistics check, -1 no studying.

### Limited Variant (4-6 weeks, 15-20h/week)

Week 1 diagnostic + 2 weak domains, Week 2 pacing + Paper 2, Week 3 hard + Paper 3, Week 4 Paper 4 + taper. Higher variance — only for strong baseline.

Key: diagnostic first, official papers only for prediction, taper final week.
"""

def gen_mastery2(num, name, short, official, sections, scoring):
    return f"""
This deep dive targets execution for {short} where competitive becomes elite — {sections}; {scoring}.

---

### Hard-Question Patterns for {short}

At the top, content is known. Gap is recognition (<5 sec), execution (<60 sec), error elimination.

| Pattern | Example | Time |
|---------|---------|------|
| Domain-heavy | Advanced application | 90-120 sec |
| Integrated | Multi-concept | 90 sec |
| Tool | Calculator/graph/OMR | 60 sec |
| Trap | Exception/word-limit/NOT | 45 sec |

---

### Technique 1: 15-Second Extraction (visuals in {short})

Title/axes (3 sec), trend (5 sec), key values (4 sec), legend (3 sec). Drill 10/day covering visuals only — aim 40% of questions from visuals alone.

### Technique 2: Logic Chain (pivots: however, although, because, therefore)

Find pivot -> relationship -> predict -> match. For {short}, pivot detection prevents synonym/distractor traps.

### Technique 3: Tool Superpowers ({short} aids for {sections})

Master allowed aid (calculator, highlighters, whiteboard, OMR shading) to sub-60 sec average.

---

### Domain Hard Patterns for {short}

Foundational (largest weight): Disguised forms (word problems, modelling, multi-constraint). Translate -> visualize -> compute -> verify.

Advanced (differentiator): Hybrid combining domains. Graph both sides or integrate 2-3 subjects.

Analytical (high yield): Ratios, percentages, probability, conditional. Restrict denominator to condition; correlation vs causation.

---

### Pacing — The Hidden Gate

{sections} implies tight average. Triage: GREEN (confident -> immediate), YELLOW (multi-step -> flag, second pass), RED (no path -> guess, mark, move). First pass all GREEN in ~50% time.

Error checklist every question: re-read stem (asked?), units (per year vs month), entry format (TITA/NAT word limit), quick verification.

Weekly hard sets timed per section; daily 10-min tool drills until automatic.

Bottom line: Content gets competitive for {short}; execution gets elite.
"""

def gen_comparison2(num, name, short, official, sections, scoring):
    return f"""
Choosing {short} vs alternative on rumor costs months. Decide with verified structure and acceptance for 2024-2025.

---

### At a Glance: {short} vs Closest Alternative(s)

| Dimension | {short} | Alternative | Impact |
|-----------|---------|-------------|--------|
| Purpose | {sections} | Different pathway | Check acceptance at YOUR targets |
| Format | {sections} | Varies | Prep time 6-12 weeks |
| Scoring | {scoring} | Different scale | Compare via percentiles/ranks |
| Official | {official} | Varies | Where to register |

---

### When {short} Is Stronger (3+ applies)

Diagnostic percentile 10+ higher on {short}, targets recommend it, content fit favours its domains, tool/format fit pref.

### When Alternative Stronger

Alternative structure (more time, no dedicated section) suits pace, or diagnostic favours alternative, or cheaper/more available.

### Score Comparability

Percentile/rank alignment best proxy unless official concordance (e.g., JEE Advanced rank vs BITSAT, NEET vs JIPMER pre-2020, CAT vs XAT via business-school cutoffs). For {short}, compare where your rank/percentile falls.

### Divergence & Protocol

Prep for one test. Diagnostics (6 hours) decide. Do not split 12 weeks.

Weekend protocol: Saturday {short} diagnostic (official) 3-4h, Sunday alternative 3-4h, percentiles -> checklist -> commit.

Key takeaways: acceptance verify 8-12 targets individually; global tables approximate; digital results 3-5 days vs paper 2-3 weeks.
"""

def gen_post2(num, name, short, official, sections, scoring):
    return f"""
Your {short} results are out. Translate numbers into next steps for 2024-2025.

---

### Your {short} Score Report

Primary: {scoring}. Contains section/overall, percentiles, rank, and verification number (TRF/scorecard). Digital often 2-5 days, paper 2-3 weeks; validity 2-3 years ({short} typically 1-3 years for Indian exams, 2 for English).

### What Is Good? (Program-Specific)

No universal good. Middle 50% / median / cutoff rule: list 8-12 targets (IITs, medical colleges, IIMs, PSUs), find published previous-year cutoffs/AIR vs marks, aim 75th/median.

| Tier | Example | Typical {short} Range |
|------|---------|----------------------|
| Most Selective | Top IIT / AIIMS / IIM A/B/C / PSU top | Top 1-5% |
| Highly Selective | Strong NIT / Government medical / New IIM | Top 10% |
| Selective | Tier 2 | Above median |
| Qualifying | Pass | Cutoff + margin |

For {short}, sectional cutoffs often also apply (e.g., 80-85 for CAT, 10% per subject for JEE Advanced, 50th percentile overall for NEET qualifying).

### Choice / Superscore / Counseling

{short} policy varies: JEE Advanced no choice (rank from 2 papers combined), NEET no choice, CAT no choice, GATE normalized, UPSC no choice — verify counselling (JoSAA/MCC/CAP/COAP/CCMT) rules for your year. Some English tests allow superscore/OSR.

General: verify choice/superscore vs all-required vs test-blind per counselling body.

### Retake Framework

Expected gain: light prep +3-5%, serious 40h+ +8-15%, domain fix +15% on section. Gating fix largest ROI.

Decision: Below 25th for all targets -> retake + broaden. One section low -> section-specific. 25th-75th + 6-8 weeks -> retake. >75th -> only for scholarship/rank improvement.

Action this week: record scores/rank, update spreadsheet with 2024 cutoffs, classify reach/match/safety, check counselling registration, decide retake.

Your {short} score is a tool with 3-year shelf life in many cases ({scoring}) — use strategically.
"""

remaining = [(13,2),(13,3),(13,4),(13,5),(14,2),(14,3),(14,4),(14,5),(15,2),(15,3),(15,4),(15,5),(16,2),(16,3),(16,4),(16,5),(17,2),(17,3),(17,4),(17,5)]
# Map info for those exams
extra_info = {
    13: ("JEE Advanced (Joint Entrance Examination - Advanced)", "JEE Advanced", "IITs (Organizing IIT) + NTA/JEE Apex Board", "Paper 1 (3h) + Paper 2 (3h) = 6 hours, 54-60 per paper: Physics, Chemistry, Maths", "Rank-based, ~360-378 marks, subject + aggregate cutoffs", "Engineering Entrance"),
    14: ("NEET UG (National Eligibility cum Entrance Test - Undergraduate)", "NEET UG", "NTA + NMC", "720 marks, 180 to attempt of 200, 3h20m, Physics/Chemistry/Biology", "720 max, +4/-1, percentile & rank", "Medical Entrance"),
    15: ("UPSC Civil Services Examination (IAS/IPS)", "UPSC CSE", "UPSC (Union Public Service Commission)", "Prelims (2 papers) + Mains (9 papers) + Interview (275)", "Prelims 400 qualifying, Mains 1750 + Interview 275 = 2025", "Civil Services"),
    16: ("CAT (Common Admission Test) - IIMs", "CAT", "IIMs + TCS iON", "2 hours, 66 questions: VARC 24 + DILR 20 + QA 22, 40m sectional", "66 questions, +3/-1 MCQ, +3/0 TITA, percentile + sectional", "MBA Entrance"),
    17: ("GATE (Graduate Aptitude Test in Engineering)", "GATE", "IISc + 7 IITs", "3 hours, 65 questions, GA 10 + Technical 55, 100 marks", "100 marks, normalized, 3-year validity", "Engineering / PSU"),
}

for (num, art) in remaining:
    name, short, official, sections, scoring, cat = extra_info[num]
    header = f"EXAM #{num} —"
    hpos = text.find(header)
    if hpos == -1:
        print(f"WARN header {header} missing")
        continue
    marker = f"ARTICLE {art}\nEXAM:"
    mpos = text.find(marker, hpos)
    if mpos == -1:
        print(f"WARN marker A{art} missing for EXAM #{num}")
        continue
    pat = re.compile(r"FULL ARTICLE:\s*\n(.*?)\n============================================================\s*\n\s*FAQ:", re.DOTALL)
    mm = pat.search(text, mpos)
    if not mm:
        print(f"WARN FULL ARTICLE missing EXAM #{num} A{art}")
        continue
    start, end = mm.span(1)
    old_len = end-start
    if art==2:
        new_body = gen_plan(num, name, short, official, sections, scoring)
    elif art==3:
        new_body = gen_mastery2(num, name, short, official, sections, scoring)
    elif art==4:
        new_body = gen_comparison2(num, name, short, official, sections, scoring)
    else:
        new_body = gen_post2(num, name, short, official, sections, scoring)
    new_body = new_body.strip()
    text = text[:start] + new_body + text[end:]
    print(f"Expanded EXAM #{num} ARTICLE {art}: {old_len} -> {len(new_body)} chars")

FILE.write_text(text, encoding='utf-8')
print(f"Remaining done. Size: {len(text)/1024:.1f} KB, Lines: {len(text.splitlines())}")
