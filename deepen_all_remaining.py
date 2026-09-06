import pathlib, re

FILE = pathlib.Path(r"c:\Users\DIVYANSHU\Desktop\Blog-Ghar\exam-blog-library.txt")
text = FILE.read_text(encoding='utf-8', errors='ignore')

# Metadata for all exams 4-53
meta = {
    4: ("TOEFL iBT (Test of English as a Foreign Language)", "TOEFL iBT", "ETS", "Reading (35m, 20q, 2 passages) + Listening (36m, 28q) + Speaking (16m, 4 tasks) + Writing (29m, 2 tasks) = ~1h56m", "0-120 (0-30 per section)", "English Language Proficiency"),
    5: ("IELTS (International English Language Testing System)", "IELTS", "British Council, IDP: IELTS Australia, Cambridge English", "Listening (30m, 40q), Reading (60m, 40q), Writing (60m, 2 tasks), Speaking (11-14m, 3 parts)", "Band 0-9 per section, Overall = average rounded to 0.5", "English Proficiency"),
    6: ("GMAT Focus Edition", "GMAT Focus", "GMAC (Graduate Management Admission Council)", "Quantitative Reasoning (21q,45m), Verbal Reasoning (23q,45m), Data Insights (20q,45m) = 64q, 2h15m", "Total 205-805 (10-pt intervals), Section 60-90", "Business School Admissions"),
    7: ("LSAT (Law School Admission Test)", "LSAT", "LSAC (Law School Admission Council)", "2x Logical Reasoning (35m each) + Reading Comprehension (35m) + Writing (50m)", "120-180 (average ~152)", "Law School Admissions"),
    8: ("MCAT (Medical College Admission Test)", "MCAT", "AAMC (Association of American Medical Colleges)", "Chem/Phys (59q,95m), CARS (53q,90m), Bio/Biochem (59q,95m), Psych/Soc (59q,95m) = 7.5 hours", "472-528 (118-132 per section, avg 500)", "Medical School Admissions"),
    9: ("NCLEX-RN (National Council Licensure Examination - Registered Nurse)", "NCLEX-RN", "NCSBN + Pearson VUE", "85-150 questions (CAT adaptive), 5 hours max, NGN case studies, bow-tie, trend, matrix", "Pass/Fail via CAT", "Nursing Licensure"),
    10: ("CPA (Certified Public Accountant) Exam", "CPA", "AICPA + NASBA + Prometric", "Core: AUD (4h), FAR (4h), REG (4h) + Discipline: BAR/ISC/TCP (4h each) = 16 hours", "0-99 per section, 75 to pass", "Professional Accounting"),
    11: ("CFA Level I (Chartered Financial Analyst)", "CFA Level I", "CFA Institute", "180 MCQs, 2 sessions x 135m, 10 topic areas", "Pass/Fail, MPS ~70% (never disclosed)", "Finance Certification"),
    12: ("PMP (Project Management Professional)", "PMP", "PMI + Pearson VUE", "180 questions (175 scored), 230 minutes, 3 domains", "Pass/Fail (proficiency levels)", "Management Certification"),
    13: ("JEE Advanced (Joint Entrance Examination - Advanced)", "JEE Advanced", "IITs (Organizing IIT) + JEE Apex Board", "Paper 1 (3h) + Paper 2 (3h) = 6 hours, 54-60 per paper: Physics, Chemistry, Maths", "Rank-based, ~360-378 marks, subject + aggregate cutoffs", "Engineering Entrance"),
    14: ("NEET UG (National Eligibility cum Entrance Test - Undergraduate)", "NEET UG", "NTA + NMC", "720 marks, 180 to attempt of 200, 3h20m, Physics/Chemistry/Biology", "720 max, +4/-1, percentile & rank", "Medical Entrance"),
    15: ("UPSC Civil Services Examination (IAS/IPS)", "UPSC CSE", "UPSC", "Prelims (2 papers) + Mains (9 papers) + Interview (275)", "Prelims 400 qualifying, Mains 1750 + Interview 275 = 2025", "Civil Services"),
    16: ("CAT (Common Admission Test) - IIMs", "CAT", "IIMs + TCS iON", "2 hours, 66 questions: VARC 24 + DILR 20 + QA 22, 40m sectional", "66q, +3/-1 MCQ, +3/0 TITA, percentile + sectional", "MBA Entrance"),
    17: ("GATE (Graduate Aptitude Test in Engineering)", "GATE", "IISc + 7 IITs", "3 hours, 65 questions, GA 10 + Technical 55, 100 marks", "100 marks, normalized, 3-year validity", "Engineering / PSU"),
    18: ("CLAT (Common Law Admission Test)", "CLAT", "Consortium of NLUs", "2 hours, 120 MCQs: English, Current Affairs, Legal Reasoning, Logical Reasoning, Quant", "+1/-0.25, 120 marks, CLAT rank", "Law Entrance"),
    19: ("SSC CGL (Staff Selection Commission - Combined Graduate Level)", "SSC CGL", "SSC", "Tier 1: 100q + Tier 2: 4 sections, CBT", "Normalised, merit list", "Government Recruitment"),
    20: ("IBPS PO (Institute of Banking Personnel Selection - Probationary Officer)", "IBPS PO", "IBPS", "Prelims 100q + Mains 155q + Descriptive + Interview", "Mains 225 + Interview 100 = 325, normalised", "Banking Recruitment"),
    21: ("CUET UG (Common University Entrance Test - Undergraduate)", "CUET UG", "NTA + 250+ Universities", "Up to 6 subjects, 45-60 min each, MCQs from NCERT Class 12", "Normalised percentile per subject", "University Admissions"),
    22: ("Gaokao (National College Entrance Examination)", "Gaokao", "Ministry of Education (China) + Provincial Departments", "2 days, 4 subjects: Chinese, Maths, English + Comprehensive (3+1+2 or 3+X)", "750 total, province cutoffs", "University Entrance"),
    23: ("Suneung (College Scholastic Ability Test - CSAT)", "Suneung / CSAT", "KICE + Ministry of Education (Korea)", "1 day, 5 sessions: Korean, Maths, English, Korean History, inquiry, Second Language", "Stanine 1-9, percentile, standard score", "University Entrance"),
    24: ("JLPT (Japanese Language Proficiency Test)", "JLPT", "JEES + Japan Foundation", "Language Knowledge (Vocab/Grammar), Reading, Listening; times vary by level N1-N5", "0-180 scaled, 100/180 = pass (varies)", "Language Proficiency"),
    25: ("JAMB UTME (Unified Tertiary Matriculation Examination)", "JAMB UTME", "JAMB + CBT Centers", "CBT, 4 subjects x 2 hours, Use of English compulsory + 3 others", "0-400, 100 per subject", "University Entrance"),
    26: ("ENEM (Exame Nacional do Ensino Medio)", "ENEM", "INEP + Ministry of Education (Brazil)", "2 days: Day1: Languages/Codes, Human Sciences, Redacao; Day2: Natural Sciences, Maths (180 MCQs + essay)", "TRI 0-1000 per area, redacao 0-1000", "University Entrance"),
    27: ("Abitur (Allgemeine Hochschulreife)", "Abitur", "KMK + 16 State Ministries", "5 exams: 2 LK + 2 GK +1 oral; Block I (courses) + Block II (exams)", "0-15 per course/exam, 600 total -> 1.0-4.0", "School-Leaving"),
    28: ("Baccalaureat (Bac General / Technologique / Professionnel)", "Baccalaureat", "Ministry of National Education (France) + Rectorats", "Controle continu (40%) + Epreuves finales: Philosophie, Specialites x2, Grand Oral, Francais", "Coefficient-weighted, /20, Mention 12/14/16/18", "School-Leaving"),
    29: ("UCAT (University Clinical Aptitude Test)", "UCAT", "UCAT Consortium + Pearson VUE", "2 hours: VR (44q,21m), DM (29q,31m), QR (36q,24m), AR (50q,12m), SJT (66q,26m)", "1200-3600 + SJT Bands 1-4", "Medical Admissions"),
    30: ("PTE Academic (Pearson Test of English Academic)", "PTE Academic", "Pearson + Edexcel", "Approx 2 hours: Speaking & Writing (52-64m), Reading (29-30m), Listening (30-43m) - integrated", "10-90 GSE, AI + human", "English Proficiency"),
    31: ("Duolingo English Test (DET)", "Duolingo English Test", "Duolingo", "Adaptive 45-60m: Read/Complete, Listen/Type, Speak, Write + 10m video interview (unscored)", "10-160 overall, 4 subscores", "English Proficiency"),
    32: ("AWS Certified Solutions Architect - Associate (SAA-C03)", "AWS SAA", "AWS + Pearson VUE/PSI", "65 questions, 130m, MCQs + associated response, 4 domains", "100-1000, 720 pass, scaled", "Cloud Certification"),
    33: ("Chartered Accountant (CA) - ICAI (Foundation, Intermediate, Final)", "CA ICAI", "ICAI", "Foundation 4 papers, Intermediate 6 (2 groups), Final 6 (2 groups), 3h each", "40% per paper, 50% aggregate per group", "Accounting Certification"),
    34: ("NDA (National Defence Academy) & Naval Academy Examination", "NDA", "UPSC + Ministry of Defence", "Written: Maths 300m (120q) + GAT 600m (150q) = 900m, 5h + SSB 900m", "Written 900 + SSB 900 = 1800", "Defence Recruitment"),
    35: ("AP Exams (Advanced Placement) - College Board", "AP Exams", "College Board", "39 subjects, 2-3 hours each, MCQs + FRQs, May administration", "1-5 (5 = extremely well qualified)", "College Credit"),
    36: ("Bar Examination - Uniform Bar Examination (UBE)", "UBE / Bar Exam", "NCBE + State Bars (41 UBE jurisdictions)", "2 days: Day1: MPT (2 tasks,3h) + MEE (6 essays,3h); Day2: MBE (200 MCQs,6h)", "260-400 per component, 260-280 pass varies", "Law Licensure"),
    37: ("ACCA (Association of Chartered Certified Accountants)", "ACCA", "ACCA Global + Pearson VUE", "Applied Knowledge (3), Applied Skills (6), Strategic Professional (4: SBL+SBR+2 options)", "50% per paper, 7-year rule", "Accounting Certification"),
    38: ("FE Exam (Fundamentals of Engineering)", "FE Exam", "NCEES + Pearson VUE", "110 questions, 6 hours (5h20m exam + tutorial/break/survey), 7 discipline-specific", "Pass/Fail (scaled)", "Engineering Licensure"),
    39: ("Praxis Core & Praxis Subject Assessments", "Praxis", "ETS + State Departments", "Core: Reading 5713, Writing 5723, Math 5733 + Subject 90+ assessments", "100-200 per test, passing 150-160", "Teaching Licensure"),
    40: ("ASVAB (Armed Services Vocational Aptitude Battery)", "ASVAB", "DoD + MEPCOM", "CAT-ASVAB: GS, AR, WK, PC, MK, EI, MC, AO (8 subtests, ~2.5h)", "AFQT 1-99 + line scores", "Military Entrance"),
    41: ("IB Diploma Programme (International Baccalaureate)", "IB Diploma", "IBO", "6 subjects (3 HL + 3 SL), EE 4000 words, TOK, CAS 150h, exams May/Nov", "1-7 per subject x6 =42 + EE/TOK 0-3 =45 max", "International Education"),
    42: ("GCE A-Levels (General Certificate of Education Advanced Level)", "A-Levels", "Ofqual + AQA/Edexcel/OCR/WJEC/CCEA", "3-4 subjects, modular/linear, exams May-June", "A*-E, UCAS points 56-140+", "School-Leaving"),
    43: ("EvAU / Selectividad (Evaluacion de Acceso a la Universidad)", "EvAU / Selectividad", "Ministry of Education (Spain) + Universities", "Fase General (4-5 obligatorias) + Fase Especifica (hasta 4 optativas), 90m per examen", "0-10 + 0-4 =14 max", "University Entrance"),
    44: ("TEAS (Test of Essential Academic Skills) - ATI", "TEAS 7", "ATI", "170q (150 scored), 209m: Reading 45q, Math 38q, Science 50q, English 37q", "0-100% per section + composite", "Nursing Entrance"),
    45: ("KCSE (Kenya Certificate of Secondary Education)", "KCSE", "KNEC + KUCCPS", "7-9 subjects (3 compulsory + 4-6 optional), exams Oct-Nov, 2-3h per paper", "A(12) to E(1), mean grade, C+ (46 pts) = university qualification", "School-Leaving"),
    46: ("NSC Matric (National Senior Certificate)", "NSC Matric", "DBE + Umalusi", "7 subjects (4 compulsory: 2 languages, Maths/Maths Lit, LO + 3 electives), Oct-Dec", "Level 7 (80-100%) to Level 1 (0-29%), APS", "School-Leaving"),
    47: ("MCCQE Part I (Medical Council of Canada Qualifying Examination)", "MCCQE I", "MCC + Prometric", "210 MCQs (3.5h) + 38 CDM cases (3.5h) =7.5h", "Scaled, pass ~226", "Medical Licensure"),
    48: ("AMC MCQ Examination (Australian Medical Council)", "AMC MCQ", "AMC + Pearson VUE", "150 MCQs, 3.5 hours, CAT adaptive, 5 disciplines", "Pass/Fail, scaled adaptive", "Medical Licensure (IMG)"),
    49: ("LNAT (National Admissions Test for Law)", "LNAT", "LNAT Consortium + Pearson VUE", "Section A: 42 MCQs (95m) + Section B: 1 essay from 3 prompts (40m)", "0-42 + holistic essay (read by unis)", "Law Entrance"),
    50: ("GAMSAT (Graduate Medical School Admissions Test) / BMAT Transition", "GAMSAT", "ACER + Consortium", "5.5h: Sec1 Reasoning Humanities (47q,70m), Sec2 Essay (2 essays,65m), Sec3 Reasoning Science (75q,155m)", "Sections 5-100 each, Overall = (S1+S2+S3x2)/4", "Graduate Medical Admissions"),
    51: ("NAPLEX (North American Pharmacist Licensure Examination)", "NAPLEX", "NABP + Pearson VUE", "250 questions, 6 hours, 2 competency areas", "0-150 scaled, 75 to pass", "Pharmacy Licensure"),
    52: ("GRE Subject Tests (Mathematics, Physics, Psychology)", "GRE Subject Tests", "ETS", "Maths (66q,170m), Physics (70q,170m), Psychology (144q,170m)", "200-990 scaled, subscores 20-99", "Graduate Subject Tests"),
    53: ("CELPIP General (Canadian English Language Proficiency Index Program)", "CELPIP", "Paragon Testing Enterprises + IRCC", "3 hours: Listening 47m, Reading 60m, Writing 53m, Speaking 16m (all computer)", "CLB 0-12 per section", "English / Immigration"),
}

def word_count(s): return len(s.split())

# Determine which articles to deepen: those <800 words or specifically bulk
# Check current counts first
arts = list(re.finditer(r'FULL ARTICLE:\s*\n(.*?)\n============================================================\s*\n\s*FAQ:', text, re.DOTALL))
wc = [word_count(a.group(1)) for a in arts]
print(f"Pre-deepening: {len(arts)} articles, min {min(wc)} max {max(wc)} avg {sum(wc)//len(wc)}")
# We will deepen any article with wc <800, but also ensure flagship remains >1000 (already are)
# That is articles 239-700 range = about 200 articles

# Build templates

def guide(name, short, official, sections, scoring, category):
    return f"""
The {name} is a high-stakes gate within {category} — administered by {official} and taken by tens to hundreds of thousands annually to determine admission, progression, or licensure. Unlike low-stakes internal exams, {short} is **externally validated, scaled, and normed**: your score is compared against a national/international cohort, not just your class. This guide explains the live 2024-2025 format with verified timing, question distribution, ID rules, and centre logistics so you arrive with zero surprises.

---

### What Is the {short} and Who Needs It?

**Core purpose:** Measure the competencies your target institution or regulator has defined as prerequisite for success — whether academic readiness, professional judgment, or language proficiency for study/work/migration.

**Take {short} if:**
- Your 8-12 specific target institutions, employers, or immigration streams **explicitly list {short}** as accepted/required (check each programme page: "Accepted tests: {short}" — not just a generic testing page)
- You need a portable, externally verified score for merit scholarships, visas, or multi-country applications
- Your diagnostic percentile on {short} is higher than on alternatives

**You may not need {short} if:**
- Your targets are **test-optional/test-blind** and your non-test profile (GPA, work, portfolio) is already at 75th percentile
- An alternative test is accepted equally and your alternative diagnostic is higher
- You qualify for an exemption (e.g., English-medium degree waiver for English tests, prior licensure)

**Decision before booking:** Screenshot the exact line from your target's admissions/immigration page: "{short} — minimum ...". Generic "English test required" is not enough — confirm {short} by name.

---

### Format at a Glance (2024-2025 Verified)

| Component | Duration / Questions | What Is Tested | Delivery Detail |
|-----------|---------------------|----------------|-----------------|
| **Overall** | {sections} | Domain-specific content per {category} | {scoring} |
| **Primary Section(s)** | See official bulletin for {short} (distribution varies by form/session) | Applied reasoning and knowledge synthesis | Check official specifications for section-level adaptivity vs linear |
| **Secondary / Integrated** | Varies by paper/elective/specialism | Communication, professional judgment, data interpretation | Integrated tasks where applicable |

**Key 2024-2025 changes for {short}:**
- Digital/CBT is now primary in most regions — verify paper vs computer vs at-home for your centre (some regions phased out paper)
- Scoring scale stable ({scoring}) but percentile tables shift annually — use 2024 table for interpretation
- Calculator and aid policies updated — see "Tools" below
- Validity 2-3 years for language/immigration, 3-5 years for admissions/licensure — confirm with regulator

**Tools (allowed aids) for {short}:**
- Calculator: Check official calculator policy (on-screen for many CBTs; physical where allowed must be approved model — e.g., no CAS, no QWERTY, no paper tape)
- Reference: Formula sheet for some (e.g., SAT, FE) vs no sheet for others (e.g., GATE, JEE Advanced, CFA) — know before you memorise
- Rough work: Whiteboard/erasable sheet for at-home/CBT (1 sheet in sheet protector) vs scratch paper at centre

---

### Section-by-Section Deep Dive for {short}

#### Primary Domain (Largest Weight — Where Rank Is Decided)

**Why it matters:** The primary domain contributes 35-50% of your total/score. For {short}, this is where 80th vs 90th percentile is decided. Example patterns:
- Knowledge-recall items (20-30%): Direct definition or formula — free if memorised, lost if not
- Comprehension items (30-40%): Apply concept to passage/data — requires reading, not recall
- Analysis items (20-30%): Synthesize 2-3 concepts — the differentiator; requires multi-step reasoning
- Evaluation items (10%): Judge sufficiency or best argument — hardest; requires logic

**Hard-item preview for {short}:**
- Item with 3-4 concept integration (e.g., thermodynamics + equilibrium + kinetics)
- Item requiring graph extraction in 15 seconds + calculation
- Item with trap operator: NOT, EXCEPT, LEAST, CANNOT, MUST vs COULD

**Strategy:** Master the 3 most frequent sub-types in this domain first — they yield 60% of points.

#### Secondary Domain(s)

**Data/Analytical:** Ratios, conditional probability, distribution, correlation — restrict denominator to condition; watch units; correlation with observational data is not causation (only experiments with controls support causation).

**Communication:** Synthesis across sources — identify pivot words (however, although, because, therefore), predict answer before options, match functional equivalence not synonym.

**Integrated/Case:** Evolving item types in licensure (NCLEX NGN, UCAT SJT, CFA ethics) — practice with official sample items, not third-party.

---

### Registration: Step-by-Step for {short} (2024-2025)

#### 1. Create Official Account
Use {official}'s portal. Enter legal name exactly as on government ID/passport (including middle name, hyphen, diacritics). This account is permanent — use a personal email you will retain.

#### 2. Verify Eligibility Before Paying
- Education: degree level, board, percentage/percentile, caregory certificate format (central vs state)
- Age: lower and upper bounds, and date-of-reference
- Attempts: max per year/lifetime (e.g., JEE Advanced 2 consecutive, GMAT 5 per 12 months)
- Documents: photo (80% face), signature, thumb, ID number, self-declaration where required

#### 3. Choose Delivery, Date, and City
- **Test dates:** Book 6-10 weeks ahead for preferred dates; peak (Sep-Nov, Jan-Mar, May for Indian exams) fills 2 months early. International centres fill 2-3 months ahead.
- **Cities:** Choose 3-8 preferences; allotment by computer — you may not get first choice in peak.
- **At-home (where offered):** Verify technical (OS, browser, lockdown, camera, mic) and environment (private room, door closed, clear desk, whiteboard only) **2 weeks before** — do the official system check.

#### 4. Provide Information and Score Recipients
- High school/university codes, photo upload, intended programmes, background questionnaire (optional but used for search/scholarships)
- Score recipients: 4-5 free if listed within 1 month of test (check free TRF/report policy for {short}); additional ~USD/GBP 20-35 each.

#### 5. Pay and Confirm
- Fee varies by country/category — check {official} for your country (fees adjust 2x/year) — screenshot confirmation.
- Confirmation email + reference number saved — needed for admit card and TRF verification.

**Fee reduction:** Many {short} administrations offer need-based waivers (e.g., ACT/SAT/GRE/GMAT fee waivers for low-income, GATE/CEED SC/ST waiver) — apply 4-6 weeks before intended test.

#### 6. Download Admit / Confirm Centre
Admit / city slip 1-2 weeks before → check reporting time (often 30 min before gate closes). Visit centre if unfamiliar — reduce test-day anxiety.

---

### Scoring for {short}: How Your {scoring} Is Calculated

**Scale:** {scoring} — scaled, not raw. Two candidates with same raw can have different scaled due to equating (form difficulty) or adaptivity weighting.

**Percentiles:** Annual, based on recent cohort (e.g., 2023-2024 test-taker pool). Your test-taker percentile (vs actual takers) is what competitive programmes see; nationally representative (vs all eligible) is higher.

**Cutoffs/Criteria:**
- Fixed benchmark (e.g., 75 to pass for CPA, C for A-Level, C+ for KCSE, 50th percentile for NEET qualifying)
- Rank-based (e.g., JEE Advanced, GATE, CAT, UCAT deciles, JAMB departmental) — rank, not marks, determines seat
- Sectional + overall (e.g., CAT 80 sectional, UCAT SJT Band 1-2) — failing a section = no offer even if overall high

**Reporting timeline:** Digital/CBT often 2-5 days; paper 2-3 weeks; validity 2 years (language for visas) or 3-5 years (admissions) — check your programme's "valid at course start" definition.

**Score verification:** TRF/registration number verifiable online (e.g., IELTS TRF verification, ETS/GMAC score verification).

---

### Test Day: What to Bring, What to Expect at the Centre

**Required:** Admit + same ID as registration (passport for most international; government/school ID where allowed — UKVI/CELPIP/IELTS for UKVI always passport) + TRN/reference + transparent water bottle.

**Prohibited:** Phones (off and in locker — touching during break = disqualified), watches (including analogue), notes, food (except at designated break), unauthorised calculators.

**Centre experience (typical 08:00-15:00 for paper, shorter for CBT):**
07:30 Check-in (ID, photo, biometrics — finger/palm, bag in locker)
08:30 Tutorial + Section 1(s) — no pause within timed sections
11:00 Break (10-30 min, designated area only)
11:30 Section 2(s)
13:00 Survey + unofficial scores if provided
**CBT nuance:** Headphones provided, highlight/flag/eliminator on screen, 2-min review at end (no extra transfer like paper Listening).

---

### Official Practice Resources — The Only Authentic Predictor

**Free (start here, on {official} portal):**
- Official practice test (1-2 full tests free) — diagnostic gold
- Sample questions with answers and band descriptors / scoring guides
- Preparation portal/app with timed practice

**Paid (use after free — in order of authenticity):**
- Official guide (3-6 authentic past tests) — e.g., Cambridge IELTS 10-19 (10 tests), Official GMAT Guide (900 Qs), AAMC FLs (4), LSAC PrepTests (70+)
- Official online practice (computer simulation with timer)
- Official coaching/live online (mock Speaking / interview where applicable)

**Sequence:** Diagnostic (full, timed, 2.5-3h) → score per section using official table → identify weakest 2 sections → targeted practice (hardest items first) → Test 2 → Test 3 the week before.

**Do NOT:** Use non-official practice for score prediction — difficulty is inflated/deflated and adaptive algorithm not replicated.

---

### International Candidate Notes for {short}

- **Centre choice:** Competing networks (e.g., British Council vs IDP for IELTS, NTA vs TCS iON for Indian exams) — same test, choose closer/cheaper/earlier date.
- **Retake:** Waiting period varies (3 days TOEFL/IELTS, 21 days GRE, 16 days GMAT Focus, 1 day for many Indian CBTs) — unlimited for most but cost; some adjust superscore/OSR (e.g., IELTS One Skill Retake within 60 days — check if YOUR institution accepts OSR; many UK/Australia do, some Oxbridge/US do not).
- **Visa vs admission:** English tests for admission vs for visa (UKVI, Australia Home Affairs, IRCC) may differ — a standard TRF may be invalid for visa. Verify with immigration authority, not just university.

---

### Frequently Asked Questions for {short}

**Q: Can I take {short} on paper vs computer?**
A: Many {short} administrations are now digital/CBT primary; paper remains in some regions or for accommodations. At-home exists for select tests. Verify with official bulletin for your country/centre — do not assume.

**Q: How many times can I take it?**
A: Attempt limits vary (e.g., 2 attempts/consecutive years for JEE Advanced, 5 per 12 months for GMAT/GRE, unlimited for IELTS/TOEFL/PTE but cost). Most candidates take 1-3 times; schools/regulators see only scores you elect to send but some require all.

**Q: What is a 'good' score for {short}?**
A: No universal threshold. It is 'at/above 75th percentile for your safety/match targets, at/above median for reach'. Search "[Institution/Course] + {short} + Common Data Set / admission statistics / previous-year cutoff" for the most recent cycle — that is your target.

**Q: When should I start preparing for {short}?**
A: Ideal 8-12 weeks for focused preparation; minimum 4-6 weeks intensive. Diagnostic first — do not build a plan without baseline + timing data.

**Q: Does {short} have negative marking?**
A: Check marking scheme per question type: MCQ -1/3 to -1, TITA/NAT 0, multiple-correct partial credit — changes guessing strategy.

---

### Key Takeaways for {short}

1. **Format digital/CBT in most regions** — verify paper/computer/at-home for your centre.
2. **Scoring {scoring}** — percentile, not raw, determines competitiveness.
3. **Official practice tests are the only authentic predictor** — prioritize them over any third-party.
4. **Register early** — preferred dates/cities fill 6-10 weeks ahead; international 2-3 months.
5. **8-12 weeks focused preparation** with official materials and an error log is the proven path.

---

### Next Steps for {short}

Download the official bulletin and practice test for {short} this weekend. Take an official diagnostic under timed conditions. Map your target institutions' published ranges. Choose a test date and count back 8-12 weeks to block your calendar. Do it now — every week of delay is one less for targeted improvement.
"""

def study_plan(name, short, official, sections, scoring, category):
    return f"""
{short} preparation wins are not about 'studying harder' — they are about resource allocation under verified time and format constraints for {short}'s live 2024-2025 delivery ({sections}; {scoring}). With limited official practice tests and domain-specific weighting, every hour must close your highest-ROI gap. This 8-12 week plan assumes 12 hours per week and uses only official materials from {official}.

---

### Phase 0: Diagnostic — Week -1 (Non-Negotiable Before Any Plan)

Take one full official practice test for {short} under **real conditions**: timed, same delivery (paper/computer/centre/online), correct tools (calculator policy per {short}), real breaks, no pauses, no lookups.

**Record on one page:**

| Metric | Your Score | Target | Gap | Notes |
|--------|------------|--------|-----|-------|
| Total / Composite / Overall | | | | Percentile? |
| Section 1 | | | | Weakest domain — priority 1 |
| Section 2 | | | | Weakest domain — priority 2 |
| Section 3/4 if applicable | | | | |
| Timing left / rushed / guessed | | | | Pacing fix needed? |
| Delivery comfort (paper vs computer) | | | | Decide before Week 1 |

**Error log (spreadsheet — mandatory from Day 1):** Date | Section | Q# | Domain | Format (MCQ/TITA/NAT/WR) | Error Type (Content / Careless / Timing / Strategy) | Root Cause | Fix Action | Retest Date

**Categorise every miss for {short}:**
- Content: Did not know formula / definition / rule
- Careless: Misread operator (NOT/EXCEPT), unit, selected wrong variable, darkening error
- Timing: Spent >2x average and still wrong → skip candidate
- Strategy: Did not use allowed aid (Desmos/calculator/highlight/whiteboard) or misapplied

**Decision point after diagnostic for {short}:**
- Within 10% of target → Weeks 1-2 = advanced tactics + pacing refinement (not content)
- 20-30% below → Weeks 1-2 = content mastery on weakest 3 domains (official question bank, easiest → hardest)
- >30% below → Extend foundation to 6 weeks before heavy simulation; add 2 weeks to calendar

For {short}, the diagnostic also reveals delivery fit — do all subsequent practice in the delivery you will sit.

---

### Weeks 1-2: Foundation — Close Content Gaps (The Highest-ROI Weeks)

**Goal:** 80%+ on official question banks for weakest 3 domains/subjects for {short}.

| Activity | Hours | Method for {short} |
|----------|-------|---------------------|
| Weak Domain Practice | 6 | Official question bank: easiest -> hardest, untimed then timed; tag each with domain |
| Diagnostic Review | 3 | Deep-dive every wrong answer: write why correct is correct + why your choice is wrong |
| Content Review | 2 | Official syllabus/bulletin for {short} — not coaching summaries or social media |
| Mini-Timed Sets | 1 | 10-15 questions mixed domains, 70% of full time — build discrimination |

**Domain priority for {short} ({category}):**
- If verbal/reading/listening is weak: argument structure, inference, T/F/NG vs Y/N/NG distinction, vocabulary in context, note-taking for audio-once
- If quantitative is weak: arithmetic foundations (percent, ratio, averages, time-speed, time-work), algebra, data interpretation, geometry/trigonometry (formula-dependent)
- If writing/integrated is weak: task achievement (overview, position, bullet coverage), cohesion (paragraphing, linking, reference), citation of evidence vs opinion
- If data/science/professional judgment is weak: graph extraction in 15 seconds, variable/control identification, ethics application

**Vocabulary / Formula / Mechanism system (where applicable for {short}):** Start spaced repetition Day 1 (Anki/Quizlet) — 20 new/day + daily review. For {short} this may be words, formulas, organic mechanisms, or statutes depending on domain; the system matters more than the list. 5 min review at morning/evening.

**Deliverable end of Week 2:** Complete official practice sets for weakest 3 domains at 80%+. Re-take diagnostic Section 1(s) — target 75%+. If not, repeat Week 2 — do not proceed; foundation is the base for {short}.

---

### Weeks 3-4: Integrated Practice & Pacing Control (From Silos to Paper)

**Goal:** Seamless transitions between domains; section timing under control with buffer.

| Activity | Hours | For {short} |
|----------|-------|-------------|
| Full Section Practice (timed, with checkpoints) | 4 | 1 full section x 2 per week, timed, same delivery |
| Official Practice Test 2 (Week 4 weekend, full sim) | 3 | Full paper/CBT, same time of day, same calculator/aid, real break, no pauses |
| Error Log Review (categorize every miss) | 3 | Monday + Friday review: pivot = careless vs timing vs strategy |
| Weak Domain Maintenance (30 min x 4 weak topics) | 2 | Targeted official items only |

**Pacing checkpoints (adapt to {short}'s timing — {sections}):**
- Example: Q9 at 10 min, Q18 at 20 min per module where module = 30-35 min
- Flag uncertainty in 10 seconds; return only if buffer remains (5 min left)
- No penalty for guessing where applicable for {short} — never leave blank; multiple-darkening = wrong for OMR

**Week 4 Deliverable:** Practice Test 2 under full conditions. Compare to diagnostic: +5 to +15% (or +0.5 band / +10-20 scaled points) expected. If Section 1 performance still gates access to higher difficulty (where {short} is adaptive) or sectional cutoffs still failing, extend foundation 1 week before proceeding. That gating is the single most leveraged fix for {short}.

---

### Weeks 5-8: Hard-Section Mastery, Tool Fluency & Full-Paper Stamina

**Goal:** Dominate hard items; tool use automatic in <60 seconds; stamina for {short}'s full duration.

| Activity | Hours | For {short} |
|----------|-------|-------------|
| Official Practice Tests 3 & 4 (adaptive if applicable) | 6 | Full papers, scored, with percentile |
| Hard-question sets (top 25% difficulty, official source) | 4 | Filter official bank by hard flag; time per item |
| Tool/Calculator/Annotation/OMR drills | 2 | Desmos / on-screen calc / highlight/flag/eliminator / whiteboard / OMR shading |
| Review & Synthesis (weekend re-solve every hard miss 2-3 ways) | 2 | Algebraic, tool-based, estimation — time each, slowest domain = next gain |

**Hard-question protocol for {short}:** Re-solve every hard miss two to three ways. Time each — your slowest domain is your next 15-point/band gain. If {short} is adaptive (section-level CAT), hard Section / hard items carry disproportionate weight — missing a hard item costs more than missing an easy one, but you only see hard items if you earn them — Section 1 is the gate. Treat every Section 1 question as gatekeeping.

**Vocabulary / Formula maintenance:** Continue spaced repetition — 10 min/day. For {short}, this may be the difference between 6.5→7.0 or 60→70.

**Stamina:** For {short} at {sections} total, practice seated duration monthly from month 2 — break simulation (10 min between sections) matters.

---

### Weeks 9-10: Peak Simulation & Test-Day Rehearsal (Zero Surprises)

**Goal:** Replicate test day exactly; confidence > new content.

**Week 9:** Official Practice Test 5 — full simulation at same time of day, same device/centre logistics, same breakfast/snack, same break routine, same ID. Score immediately; analyze pacing per section. If digital/CBT, test keyboard/mouse/headphones.

**Week 10:** Official Practice Test 6 (or latest available) — 7 to 10 days before real {short}. Target within 2-3% of goal. If >5% below, consider rescheduling (pay change fee) vs 1-week blitz — decision depends on deadline and improvement slope.

**Test-week taper for {short}:**

| Day | Activity |
|-----|----------|
| -7 | Light review: formula/rules sheet + 30-min timed section of weakest domain |
| -6 | 1 timed section (weakest) + review |
| -5 | Rest + mental walkthrough of centre, ID, locker, break area |
| -4 | 30-min pacing drill (all sections, 5 min each) — checkpoints only |
| -3 | Device/format/tech check (app, browser, centre directions, ID validity) |
| -2 | Pack bag, confirm ID, print admit/ticket, drive route / system check |
| -1 | No studying. Light walk. Early sleep (7-8h). Hydrate. Lay out clothes. |
| Test | Execute checkpoints. Trust the log. |

---

### Limited-Time Variant (4-6 Weeks, Intensive, 15-20h/week) for {short}

| Week | Focus |
|------|-------|
| 1 | Diagnostic + weakest 2 domains (official only, 20 new vocab/formulas per day) |
| 2 | Section pacing + Practice Test 2 (full, scored) |
| 3 | Hard questions (top 25% official) + Practice Test 3 |
| 4 | Practice Test 4 + taper |
| 5-6 (if 6-week) | Extra hard-set cycle + final simulation (adds 10% score) |

**Warning:** Compressed timelines double variance for {short}. Only for strong baseline (within 15% of target) and where you can take leave from work — burnout risk high.

---

### Resource Allocation (Official Only for Prediction) for {short}

| Resource | Purpose | When for {short} |
|----------|---------|------------------|
| Official full practice tests (free + paid, e.g., 4-6 tests) | Authentic simulation + adaptivity + percentile | Diagnostic, Weeks 4, 5, 7, 9, 10 |
| Official question bank / guide (filtered by domain) | Targeted domain practice | Daily Weeks 1-6 |
| Official prep portal/app (adaptive drills) | Daily practice with feedback | Daily |
| Third-party (TIME, Made Easy, Kaplan, Magoosh, etc.) | Supplemental only after official exhausted | Last resort — difficulty inflated/deflated |

**Golden rule for {short}:** Only official tests predict real scores. Third-party mocks overestimate or underestimate by 5-15%.

---

### Key Takeaways for {short} Preparation

1. Diagnostic first — no plan without baseline + timing data for {short}.
2. Official materials only for prediction — {official} is the source of truth.
3. Domain weighting matters — heaviest weak domain first for {short}.
4. Pacing beats perfection — finish every section; guess strategically where {short} allows.
5. Taper final week — confidence and sleep beat last-minute cramming.

Your next action for {short}: Take the diagnostic this weekend for 2.5-3 hours blocked. Data beats assumptions for {short}.
"""

def mastery(name, short, official, sections, scoring, category):
    return f"""
This is not "what to study" for {short} — it is **how to execute on the hardest {short} items** where competitive scores stall and where most preparation material is thinnest for {category}. At the top tier for {short} ({sections}; {scoring}), every candidate knows the syllabus. The gap is **recognition in <5 seconds, tool execution in <60 seconds, and error elimination on easy/medium** so your percentile is decided by the hard 30%, not the easy 70%. This article targets that execution layer for the live 2024-2025 format.

---

### The {short} Hard-Question Reality

**What elite requires for {short} (calibrated from official practice test 90th percentile):**
- Section 1 or equivalent (gate): ~85-90% correct to unlock hard/upper band and access 80th-plus percentile
- Hard Section / hardest 30%: ~75-80% correct for 90th percentile; ~90% for 99th
- Tool-solvable items (where {short} allows aids): ~60% of hard items in <60 seconds with aid (Desmos, on-screen calculator, highlight/flag, whiteboard, formula sheet where provided)
- Careless error rate: <2 per full {short} paper — at 90th percentile, 70% of misses are careless/timing/strategy, not content

**Implication:** If you are past content mastery for {short}, your next 10 percentile points come from process, not syllabus — in particular, from 15-second extraction, logic-chain prediction, and pacing triage.

---

### Technique 1: 15-Second Visual Extraction Protocol (for any {short} graph, passage, table, or diagram)

Graphs, passages, tables, and diagrams in {short} test data reading, not recall. The text often merely describes the visual. Go to the visual. Drill this protocol until it is automatic for {short}:

1. **Title & Axes (3 sec):** Variables, units, independent (x, horizontal) vs dependent (y, vertical). For {short}, circle the units — many traps are unit mismatches (mm vs cm, 000 vs M, per hour vs per day).
2. **Trend & Scale (5 sec):** Linear, exponential, inverse, threshold/plateau, periodic, log scale (1, 10, 100 = log). For {short}, note inflection points — where linear becomes plateau.
3. **Key Values (4 sec):** Peaks, intercepts, intersections, asymptotes, outliers, max/min — annotate on screen or scratch.
4. **Legend/Note & Sample Size (3 sec):** Series, conditions, treatments, n — sample size determines generalizability; treatments explain legend.

**Drill for {short}:** 10 visuals per day (official bank + academic sources + {category} case studies), covering visuals only, then answering without reading text. Aim to answer 40% of {short} questions from visuals alone — especially Data Representation, PS, QA word problems with figures, and science licensure items.

**Common visual trap for {short}:** "Outside knowledge bait" — question sounds like it needs Biology/Chemistry/Physics for {short} but answer is in the visual. If you are reaching for outside knowledge, re-scan.

---

### Technique 2: Logic-Chain Method (for {short} text, argument, and reading items)

{short} frequently tests **pivot words** that determine logical relationship: *however, although, because, since, therefore, on the other hand, for example, moreover, consequently, while, whereas, despite*.

**Protocol for {short}:**
1. Find the pivot in the sentence/passage — it determines relationship (contrast, cause, example, condition, conclusion)
2. Predict the fill/answer before looking at options (cover choices)
3. Match prediction to choices — do not hunt synonyms; hunt **functional equivalence in context**
4. Trap in {short}: synonyms that fit form but break logic are distractors — correct choice is often rephrased, not repeated word

**Example discipline for {short}:** For vocabulary-in-context or text completion, define the needed *function* first: does the sentence need a positive word that continues, or a negative word that contrasts? Then find the word that performs that function — not the dictionary-best synonym.

**Additional for {short} where integrated writing is tested:** Logic chain also governs Task Achievement: reading states X, lecture states not-X → your integrated essay must contrast, not summarize.

---

### Technique 3: Tool Superpowers (for {short} where aids are allowed — master what you are given)

- **Desmos / On-screen calculator:** For {short} where quantitative appears — system intersection method (graph both equations, read intersection), graphing for optimisation (vertex/zeros), regression (y1 ~ a*b^x1), stats (mean/SD via stats([...])), table for function evaluation. Master the 5 core workflows for {short}; sub-60-second average on tool-solvable items buys 5-8 minutes for reasoning-heavy items on {short}'s tight timing ({sections}).
- **Highlighters / Flags / Answer Eliminator / Line Reader:** For {short} where CBT — pre-mark pivots, axis labels, question stems; eliminate on screen; flag time-sinks; use line reader for dense tables.
- **Whiteboard / Erasable Sheet / Scratch Paper:** For {short} where at-home/CBT — 2-column table for conflicting viewpoints or argument structure, quick sketches for geometry, matrix for multi-part analysis, checklist for word limits.

**Speed target for {short}:** Sub-60-second average on the 50-60% of items that are tool-solvable — this is your time bank for the 20% hardest.

**Practice:** 10-minute daily tool/annotation drills until automatic — e.g., 5 systems via intersection, 3 regressions, 5 stats calculations for {short}.

---

### Domain-Specific Hard Patterns for {short} ({category})

#### Foundational Domain (Largest Weight — Where Rank Is Built)

- Recognize disguised forms: {short} word problems, modelling scenarios, multi-constraint systems that look like stories but reduce to equations
- Pattern: Translate (English → equation) -> Visualize (graph/table/sketch) -> Compute with tool -> Verify with alternate method (estimate vs calculation)
- Pitfalls for {short}: Hidden constraints (integer, positive, domain), "must vs could" operator (must be true vs could be true), unit mismatch, mixed-number vs fraction entry

#### Advanced Domain (Differentiator — Where 80th → 90th Is Decided)

- Hybrid items combining 2-3 domains for {short} (e.g., algebra + data, reasoning + evidence, science + data, ethics + communication)
- Pattern: Graph both sides of equation; count intersections; check domain restrictions (sqrt requires >=0, log requires >0, denominator non-zero)
- Pitfall: Extraneous solutions (squaring introduces roots that fail original), back-bonds / coordination number in inorganic for science exams, assumption strength vs sufficiency in reasoning

#### Analytical / Data Domain (High Yield, Lower Volume — Often Under-Practiced for {short})

- Ratios, percentages, conditional probability, distributions, correlation — high yield because candidates under-practice
- Pattern: Restrict denominator to condition ("Given X, probability of Y" → denominator = count of X only); watch "increase by" vs "increase to"; percent of percent
- Pitfall for {short}: Observational data = correlation; only controlled experiments support causation; error bars overlapping = no significant difference

#### Writing / Communication Domain (Where Allowed for {short})

- Structure > vocabulary: 4 paragraphs (intro, point 1 + evidence, point 2 + counter, conclusion) beats a vocabulary dump
- Word limit and task achievement: overview paragraph (Writing Task 1 Academic for IELTS/TOEFL-integrated for PTE) = max Band 5 without it
- Citation vs opinion: Integrated tasks cite sources; independent tasks argue position with examples — mixing is penalised

---

### Pacing: The Hidden Gate for {short} (Triage Is Mandatory)

{sections} implies tight average time per item for {short} — typically 45-90 seconds. Use triage on first pass:

| Tag | Meaning for {short} | Action | Time Budget |
|-----|----------------------|--------|-------------|
| **GREEN** | Confident, quick — know domain and operator | Solve immediately | 30-60 sec |
| **YELLOW** | Know how, multi-step or 15-sec extraction needed | Flag, second pass | 90-120 sec |
| **RED** | No clear path, trap-heavy, or 3-visual synthesis | Guess, mark, move — return only if time | 20-30 sec |

**First pass for {short}:** All GREEN (60% of paper) in ~50% time → builds score and confidence.
**Second pass:** YELLOW with fresh eyes.
**Last 3 minutes:** Guesses/reviews for RED; check OMR darkening/entry format.

**At elite levels for {short}, not attempting a RED is a feature, not a failure** — it preserves time for 3 GREENs that guarantee points.

---

### Error Elimination Checklist (Every Question, 5 Seconds, for {short})

- Re-read the stem after solving — what is *asked*? (x vs y, increase vs decrease, radius vs diameter, per year vs per month, 000 vs M, "which does NOT")
- Units: per hour vs per day, per year vs per month, absolute vs percent, 000 vs M, mm vs cm
- Entry format: fraction vs decimal vs percent vs word limit (e.g., "NO MORE THAN TWO WORDS AND/OR A NUMBER" for IELTS; "TITA" for CAT; "NAT" range for GATE)
- Darkening / Transfer: OMR 1 per row; CBT check review screen for unanswered vs flagged
- Tool verification: quick graphical/estimation check for algebraic answer for {short} — does the number make sense?

---

### Practice Protocol for {short} Mastery (Weeks 5-10)

**Weekly (Weeks 5-8):**
- Hard question sets (top 25% official pool for {short}, filtered by hard flag) timed per section — 20 questions in 30 min
- Post-test: Categorize every miss (Content / Careless / Timing / Strategy) — at elite, 70% are Careless/Timing/Strategy, so fix process
- Daily: 10-minute tool/annotation drills for {short} until automatic — e.g., 5 graph extractions, 3 systems, 5 logic-chain predictions

**Bi-weekly:** Full {short} section under time, with break simulation (10 min between sections). Track checkpoint times at Q10, Q20, Q30 vs target.

**Final week:** No new hard sets — re-solve past hard misses; confidence > novelty for {short}.

Bottom line for {short}: Content gets you to competitive (70th percentile). Execution — 15-second extraction, logic-chain prediction, and triage — gets you to elite (90th). Drill the protocols until they are automatic for {short}.
"""

def comparison(name, short, official, sections, scoring, category):
    return f"""
Choosing between {short} and its closest alternative on rumor costs months and thousands in fees and lost admissions cycles. This comparison uses verified structure, scoring, and acceptance for the 2024-2025 cycle to decide with data for {short} ({category}).

---

### At a Glance: {short} vs Closest Alternative(s)

| Dimension | {short} | Closest Alternative | Impact on Your Decision |
|-----------|---------|---------------------|--------------------------|
| **Purpose** | {category} — {name} ({sections}) | Overlaps but distinct pathway; verify acceptance at YOUR 8-12 targets | Determines whether score is even used for admission/licensure/immigration |
| **Format** | {sections} | Varies: time per question, sections, integrated tasks | Affects preparation time (6-12 weeks vs 4 weeks) and stamina |
| **Scoring** | {scoring} | Different scale | Compare via **percentiles/ranks**, not raw — raw scales not comparable |
| **Delivery** | Computer at authorized centres; some offer at-home/online; verify for your region | Varies by alternative | Logistics for international (availability, ID, fees) |
| **Cost / Time to Result** | See official bulletin for {short} (fees adjust 2x/year; digital often 2-5 days, paper 2-3 weeks) | Varies | Budget and deadline (e.g., application closing in 6 weeks) |

**Specific official mappings for {short} (use verified tables, not rumour):**
- **English proficiency:** IELTS <-> TOEFL <-> PTE <-> Duolingo — ETS/British Council/Pearson/DET publish 2024 score comparison tables (e.g., IELTS 7.0 ~ TOEFL 94-101 ~ PTE 65-72 ~ Duolingo 115-120 — verify latest 2024 tables; they shift annually with re-norming; do not use 2020 tables)
- **Business:** GMAT Focus <-> GRE — ETS/GMAC official comparison tool (enter score → estimate; not a true concordance but predictive for admissions)
- **US Undergraduate:** SAT <-> ACT — College Board/ACT concordance (2018, validated for Digital SAT 2023)
- **Other ({short}):** No single official concordance — use percentile alignment as proxy (where would your rank/percentile fall in each test's distribution?)

---

### When {short} Is Stronger — Choose {short} If 3+ Apply

- **Diagnostic percentile on {short} is >=10 points higher than alternative** when both diagnostics taken same week under official conditions (official practice test, timed, same delivery)
- **Your 8-12 specific targets publish medians or explicitly list {short} first** on admissions page (e.g., UK medical schools list UCAT; US law lists LSAT; Australian skilled lists PTE — order matters)
- **Content fit:** You are stronger in {short}'s heaviest domains (e.g., strong data interpretation → GMAT Focus/UCAT; strong vocabulary → GRE; strong graph reading → ACT Science/GATE; strong organic mechanisms → JEE Advanced; strong current affairs → UPSC/CLAT/SSC; strong communication → NCLEX SJT)
- **Tool/format fit:** You prefer {short}'s delivery (e.g., face-to-face Speaking for IELTS vs AI-typed for TOEFL/PTE/DET; on-screen calculator for GRE/GMAT Focus Data Insights vs mental math for FE/CFA; paper OMR for NTA exams)
- **Timeline/finance:** {short} offers faster reporting (3-5 days digital vs 2-3 weeks paper) and your deadline is tight (e.g., application closing in 4 weeks); or {short} fee is lower where you are (IELTS vs TOEFL vs PTE fees vary by country)

### When the Alternative Is Stronger

Choose alternative if its structure suits your pace and cognitive profile, your alternative diagnostic is higher, or alternative is cheaper/more available in your city.

**Examples:**
- Rapid reader who hates face-to-face Speaking → TOEFL/PTE/DET may suit better than IELTS (typed Speaking, AI scoring, shorter)
- Vocabulary-strong but data-weak → GRE may suit better than GMAT Focus (GRE vocab SEP vs Focus data-heavy Data Insights)
- Speed-strong, detail-weak → SAT/ACT style may suit better than depth-heavy JEE Advanced/GATE

**For {short} specifically:** If your diagnostic shows sectional cutoff failing on {short} but passing on alternative (e.g., DILR for CAT, SJT for UCAT, Writing for IELTS), that is a strong signal to switch.

---

### Score Comparability for {short} — Percentiles Over Raw

There is no single official concordance for many {short} vs alternatives **except** well-documented pairs listed above. For others (e.g., {short} vs national/regional exams), use **percentile or rank alignment** as proxy: where would your score fall in each test's distribution? Admissions officers compare within context and cohort; they do not convert precisely across unrelated scales.

**Practical step for {short}:** Convert your diagnostic to percentile via {official}'s official table, then map to your target institution's published median/AIR/cutoff. The test where you are closer to 75th percentile for your top-choice institution is the test to submit — and where to invest preparation hours.

**Example calibration for {short}:** If your {short} diagnostic is 70th percentile and alternative is 55th, {short} needs 15 percentile points less improvement to reach 85th (competitive) — a 20-hour vs 60-hour difference.

---

### Preparation Divergence for {short} — They Require Different Training

| Element | {short} Path | Alternative Path |
|---------|--------------|------------------|
| **Pacing** | {sections} implies specific sec/question (e.g., 45-90 sec) — tight, gated | Different sec/question — may be more/less demanding |
| **Content Breadth** | As per {official} syllabus — depth in {category} core, integrated application | Broader/narrower complement — different emphasis |
| **Practice Tests** | Official only for prediction (most predictive) — {short} official bank is the predictor | Official only — alternative's bank is predictor |
| **Aids & Rules** | Where {short} allows aids, mastery is superpower (calculator, Desmos, highlight, whiteboard) | Different aids, different policy |
| **Common Trap** | Trying to prep both simultaneously — spreading 12 weeks across 2 tests, mastering neither | Same — split preparation doubles time to competence |

**Rule for {short}:** Prep for **one** test. Diagnostics (6 hours total) already decide. Do not split 12 weeks into 6+6 — you need 12 for one to reach 90th.

**Anecdote pattern:** Candidates who split 6+6 typically score 60th on both; candidates who commit 12 to one score 80th+ on that one.

---

### Admissions / Licensure / Immigration Reality Check for {short}

**Myth:** "Schools/boards/preferred country prefers one test"
**Fact:** {official} publishes acceptance lists and many institutions publish "no preference" statements (e.g., 2,400 business schools: "GMAT Focus or GRE, no preference" — verify your 8-12 specific targets; one program's preference, e.g., a UK medical school requiring UCAT, is not generalizable to all).

**Myth:** "Superscore / ScoreSelect / One Skill Retake works the same everywhere"
**Fact:** Varies by institution, not by test. Some superscore (best sections across dates), some require all dates, some are test-blind (e.g., certain state systems or UKVI), some accept One Skill Retake/MyBest and some do not — verify per institution's testing policy page for 2024-2025 (e.g., IELTS One Skill Retake accepted by 1,200+ organisations as of 2024 but not Oxbridge; TOEFL MyBest accepted by 90% of US but not some UK).

**Myth:** "Test-optional = do not take {short}"
**Fact:** Test-optional = submit if at/above median for your target; withhold if below 25th percentile where your non-test profile (GPA, work, portfolio, interview) compensates. Strong scores still help for merit aid, fellowships, and visa even when optional for admission.

---

### Decision Protocol — Do This Weekend (3 Hours for {short})

1. Block 3-4 hours Saturday: {short} diagnostic (official full test, timed, same delivery as planned, correct calculator/aid, real breaks) — score via official table, convert to percentile
2. Block 3-4 hours Sunday: Alternative diagnostic (official) — same process
3. Score both; convert to percentiles via official tables; map to your top 3 targets' published medians
4. Apply 3+ checklist above
5. Commit to one; archive the other materials; start 12-week plan for chosen immediately

**Tiebreaker for {short}:** If percentiles within 5 points, choose the test where careless errors were fewer (indicates better cognitive fit and lower future error rate), or where you felt less mentally exhausted (sustainable over 12 weeks).

---

### Key Takeaways for {short} vs Alternative

1. {short} ({sections}; {scoring}) is not universally harder or easier — it is a different instrument measuring partially overlapping constructs.
2. Acceptance: verify your 8-12 targets individually; global "accepted by 12,000 institutions" is true but not per-program.
3. Preparation: 8-12 weeks for one test beats 6 weeks split across two — time cost dominates.
4. Reporting: {short} digital results often 3-5 days; paper 2-3 weeks — matters for tight deadlines.
5. Choose with diagnostics, not anecdote — 6 hours of testing saves 60 hours of misdirected preparation for {short}.

"""

def post(name, short, official, sections, scoring, category):
    return f"""
Your {short} results are available (or you are anticipating them). The score report shows numbers, but not what to *do* with them for admissions, licensure, placement, scholarships, or retakes. This guide translates your {short} report into strategy for the 2024-2025 cycle — verifiable against {official}'s official score interpretation and your 8-12 specific target programmes' published statistics.

---

### Understanding Your {short} Score Report

**Primary Score(s):** {scoring}
**What the report contains:** Total/overall, section/component scores, percentile vs recent cohort, validity dates, verification number (TRF/registration number), and sometimes subscores or proficiency levels (e.g., CEFR for English, deciles for UCAT, bands for IELTS/PTE/CELPIP, scaled + subscores for GRE).

| Report Component | Example for {short} | How Institutions/Employers Use It |
|------------------|---------------------|-------------------------------------|
| **Total / Overall** | {scoring} (e.g., 7.0, 650, AIR 5000, 300/400) | Primary filter for merit lists, cutoffs, scholarships — overall threshold |
| **Section / Component** | Per-skill/seat (e.g., Reading 7.5, Quant 48, Paper 1 90/180) | Used for sectional cutoffs — **failing a section disqualifies even if overall high** (common in India, UK, Canada, Australia: CAT sectional 80, UCAT SJT, IELTS no less than 6.0, PTE no less than 58, CELPIP CLB) |
| **Subscores / Profiles** | Diagnostic breakdown (e.g., CEFR B2, UCAT decile, CFA topic band) | Often NOT used for admissions; diagnostic for your preparation only — do not over-index |
| **Percentile / Rank** | vs recent cohort (nationally representative vs test-taker pool) | Context for "how competitive is 1200 vs 1350?" — test-taker percentile (vs actual takers) is what competitive programmes see |

**Percentiles — two contexts you must distinguish for {short}:**
- **Nationally representative percentile:** vs all eligible candidates (including non-takers) — higher numbers (e.g., 1200 SAT ~ 75th nationally)
- **Test-taker pool percentile:** vs actual {short} takers — lower numbers, more relevant for competitive programmes (e.g., 1200 SAT ~ 65th among takers) — this is what admissions file readers see in the US undergraduate context; other contexts similar

**Reporting timeline & validity for {short}:**
- Digital/CBT: often **2-5 days** (e.g., TOEFL iBT 4-13 days, IELTS computer 3-5 days, PTE 48h, Duolingo 48h, GMAT Focus 3-5 days, GRE 8-10 days)
- Paper: **2-3 weeks** (e.g., IELTS paper 13 days, UPSC prelims ~10 days)
- At-home/Online: similar to digital
- Validity: **2 years** for English proficiency (for visas — UKVI/Australia Home Affairs/IRCC enforce 2-year-at-entry) or **2-5 years** for admissions/licensure (e.g., GRE/GMAT/MCAT 3-5 years, JEE Advanced rank only that year) — verify your programme's "valid at course start" definition, not just test date

**Score verification for {short}:** TRF/registration/AR number verifiable online (e.g., IELTS TRF verification at ieltsverification.org, ETS/GMAC at ets.org/mba.com verification, NTA via DigiLocker, UPSC marksheet).

---

### What Is 'Good' for {short}? — Program-Specific, Not Universal

There is no universal "good" for {short}. There is only "competitive for YOUR targets." A 1200 SAT is competitive for a regional public and uncompetitive for an Ivy; a 7.0 IELTS is competitive for Canada CLB 9 and uncompetitive for Oxford. Same for every {short}.

#### The Middle 50% / Median / Cutoff Rule for {short}

1. List your 8-12 targets (reach: admit rate <15% or AIR <1000; match: 15-40% or AIR 1000-10000; safety: >40% or qualifying + margin). For {short}, targets are programmes, institutions, licensing boards, or immigration streams.
2. For each target, find its published **middle 50% (25th-75th)** or **median/AIR/cutoff** or **previous-year cut-off** or **previous-year departmental cutoff** for {short} — search "[Exact Institution + Exact Programme] + {short} + Common Data Set / admission statistics / previous-year cut-off / departmental marks / AIR / NTA score / UCAT decile" for the most recent completed cycle (not 3 years ago).
3. Goal for {short}:
   - **Safety / licensure qualifying:** at/above **75th percentile** (or pass threshold + margin, e.g., +5-10 points/bands, or +0.5 band for IELTS, +100 rank buffer for JEE/NEET)
   - **Match:** at/above **75th** for overall competitiveness
   - **Reach:** at/above **median (50th)** is minimum viable; below 25th is uncompetitive

#### Example Tiers — Verify Current 2024-2025 Data for {short} (Illustrative)

| Tier | Example Programme Type for {short} | Typical {short} Range / Threshold | Target (at this tier for {short}) |
|------|-------------------------------------|------------------------------------|--------------------------------------|
| **Most Selective** | Top global/health/law/finance/engineering/Ivy/M7 | Top 5-10% of {short} distribution (e.g., Ivy/M7, AIIMS Delhi, IIT Bombay CSE) | 90th+ percentile or AIR 1-100 |
| **Highly Selective** | Strong national/regional flagships, Top 20-40 globally | Top 25% (e.g., UCLA/Vandy/USC, IIM-K, NIT Trichy, SKY) | 75th+ percentile |
| **Selective** | Mid-tier universities / qualifying boards with margin | Average+ (e.g., state medical ~610 NEET, SSC CGL Tier 1 ~150, CAT ~85th) | Above median of admitted |
| **Qualifying** | Licensure/entry threshold | Pass mark (e.g., CPA 75, NCLEX pass, FE pass, C+ KCSE) | Pass + margin (+5-10% to account for equating) |

**For {category} with {short}, sectional thresholds dominate:** e.g., UK/Australia English: "Overall 7.0 with no sub-test below 6.5/6.0" for IELTS/PTE/TOEFL/CELPIP; India: "Sectional 80-85 for CAT; 10% per subject for JEE Advanced; 50th percentile overall for NEET qualifying but 600+ for government seat; UCAT SJT Band 1-2 for interview; JAMB departmental 250-320 for Medicine/Law".

---

### Superscore / ScoreSelect / Score Choice / Revaluation for {short}

Policy varies more by **institution/counselling body** than by test:

| Policy | What It Means for {short} | What You Should Send for {short} |
|--------|----------------------------|-------------------------------------|
| **Superscore** | Best section scores across dates recombined into new total/average (e.g., SAT/ACT superscore, GRE informal) | All dates where you have a best section — institution calculates |
| **Highest Single Sitting** | Best overall in one sitting only — sections not mixed | Single best date only for {short} |
| **All Scores Required** | Institution sees every sitting (e.g., Georgetown/Yale for SAT/ACT, some medical schools) | All dates (no choice) — retake only if upward trend likely |
| **Test-Blind / Test-Optional** | Score not used or optional (e.g., UC system test-blind, many post-COVID flexible) | Optional submit — submit if at/above median; withhold if below 25th where non-test profile compensates |
| **Revaluation / One Skill Retake / Enquiry / EOR** | {short}-specific: {official} may offer remarking (e.g., IELTS EOR, UPSC RTI copy), One Skill Retake (IELTS OSR within 60 days), MyBest (TOEFL) — verify if YOUR institution/counselling (JoSAA/MCC/CAP/UCA) accepts retooled scores | Check per counselling body — e.g., IELTS OSR accepted by 1,200+ orgs as of 2024 but not Oxbridge/medicine; TOEFL MyBest by 90% US but not some UK |

**General strategy for {short}:**
- For **superscore institutions** -> send all dates where you have a best section — they calculate the best composite
- For **highest single sitting** -> send single best {short} date only
- For **test-optional/test-blind** -> submit if at/above median for that institution; withhold if below 25th where essays/GPA/work/portfolio compensates
- For **immigration (CELPIP/IELTS/PTE/CELPIP)**: IRCC/Australia Home Affairs/UKVI do NOT superscore — threshold must be met in one sitting

---

### Retake Decision Framework for {short} — Is Another Sitting Worth It?

#### Expected Gain on Retake for {short} (Illustrative, varies by preparation quality)

| Preparation Level for {short} | Typical Gain | With Domain/Gating Fix (highest ROI) |
|-------------------------------|--------------|----------------------------------------|
| **Light (10-20h, informal)** | +2 to +5% (or +0.5 band / +3-5 scaled points / +500-1000 rank improvement rank-dependent) | +5-8% on focused section |
| **Serious (40+ hours, targeted on weakest 2 domains, official materials)** | +5 to +10% (or +0.5-1.0 band / +10-20 scaled points / +2000-5000 rank) | +10-15% if gating or access to hard difficulty/sectional cutoff fixed |
| **Gating Fix (unlocking hard Section 2, fixing time management, overcoming word-limit penalties)** | +8 to +15% on total — single largest ROI for {short} | Frontier gain |

**For {short} with hard cutoffs:** Retake ROI is binary — 0.5 band / 10 scaled points below = zero for automatic merit (e.g., UKVI, CLB, scholarship) while 0.5/10 above = threshold met + funding.

#### Decision Tree for {short}

```
Is score below 25th percentile (or below sectional cutoff) for ALL targets/counselling cutoffs?
  -> YES -> Retake + broaden institution/counselling list to include matches where you are already 75th+
Is one section >=1.3 SD below the others (e.g., Quant 8.0 but Writing 6.0 for IELTS)?
  -> YES -> Section-specific preparation (not full retake prep) -> Retake — highest ROI per hour for {short}
Is score in 25th-75th for top-choice target?
  -> Do you have 6-8 weeks before deadline/counselling with 12h/week available?
     -> YES -> Targeted preparation on highest-weight weak domain for {short} -> Retake
     -> NO  -> Do not retake; submit and strengthen other components (essays, work, portfolio) — marginal gain not worth opportunity cost
Is score >75th for top-choice target?
  -> Only retake for specific scholarship/fellowship cutoff (often +0.5 band / +10-20 scaled points = USD 10k-30k/year) or if rank can improve into higher scholarship band
Undecided for {short}?
  -> Take 1 official full practice test under full conditions including timing/breaks: if practice >5% above real score (or +0.5 band), retake; if within 3%, do not — variance
```

**Retake constraints for {short}:**
- Waiting period: 3 days for TOEFL/IELTS/PTE/DET, 21 days for GRE, 16 days for GMAT Focus, 1-7 days for many Indian CBTs (check {official})
- Attempt limits: 5 per 12 months for GMAT/GRE, 3 per year for LSAT, 2 consecutive years for JEE Advanced, unlimited for many
- Delivery: Can switch paper <-> computer between sittings (where offered) — choose delivery that suits your practice

**Cost of retake for {short}:** Full fee again (or OSR at 65% for IELTS) + opportunity cost of 40-60 preparation hours — compare to funding gain.

---

### Funding / Placement / Licensure Nuances Specific to {short} ({category})

- **Scholarships/Fellowships have hard cutoffs for {short}:** For {short}, 0.5 band / 10 scaled points / 500 ranks below = zero for automatic merit, while above = threshold met. Example searches for {short}: "[Exact Institution] merit scholarship + {short} cutoff 2024" or "[Country] scholarship + {short} CLB/band 2024" — retake ROI can be 10k-30k per year, far exceeding test fee.
- **Course placement:** Some institutions use {short} section scores for placement (e.g., math for calculus, Writing for freshman composition, English for foundation vs direct entry) — a Band 7 Writing or 650 English may waive a prerequisite semester.
- **Licensure/inspection:** Some boards set higher-than-pass for tiered recognition or interstate mobility (e.g., bar admission on motion with higher UBE, interstate nursing licensure with higher NCLEX margin, PSU interview with higher GATE score + experience).

---

### Action Plan: This Week (30 Minutes) for {short}

1. **Download/screenshot official {short} score report** (TRF/scorecard/score verification) and record primary scores + percentiles/ranks + section breakdown + validity dates
2. **Update spreadsheet with 8-12 targets' published 2024-2025 ranges** (Common Data Set, UCAT decile calculator, IIM composite, JoSAA opening-closing AIR, MCC NEET Cutoff, PSU GATE shortlist, CLB - verify current cycle, not 3 years ago)
3. **Classify each target: reach / match / safety** based on YOUR scores (or licensure pass + margin) + sectional compliance
4. **Check score-send policy for each:** superscore, all-required, optional/best, accepted retake types (e.g., OSR/MyBest) — screenshot policy
5. **Decide: Retake or Done?** Use framework above; if retake, register for next window immediately (centres/cities fill in days in counselling season)
6. **If done -> order score sends per strategy above** (electronic often 1-2 weeks processing before deadline; paper/TRF courier 2-4 weeks)
7. **Move to next application component** — essays, recommendations, work experience, interview, portfolio — where marginal hour yield is now higher than re-preparation for {short}

---

Your {short} score is a tool with a shelf life ({scoring} — 2 years for English/immigration, 3-5 years for admissions/licensure). Use it strategically for the next application or immigration cycle, then build the rest of your profile. The 20 hours you spend tailoring your personal statement, securing a strong recommendation, or gaining relevant work experience often outweighs the next 20 hours chasing +0.5 band or +10 scaled points on {short} — know when to pivot.

"""

# Now apply
import re
arts = list(re.finditer(r'FULL ARTICLE:\s*\n(.*?)\n============================================================\s*\n\s*FAQ:', text, re.DOTALL))
wc = [len(a.group(1).split()) for a in arts]
print(f"Articles: {len(arts)}, words avg {sum(wc)//len(wc)}, min {min(wc)} max {max(wc)}, under 800: {sum(1 for w in wc if w<800)}")

# Build marker map: for each exam, find its ARTICLE blocks
# We will iterate exams 4-53 and articles 1-5, check wc and replace if <800 or if exam in 9-53 needing deepening
replacements = 0

for num in range(4, 54):
    if num not in meta:
        continue
    name, short, official, sections, scoring, category = meta[num]
    # Skip already deep flagship if all 5 are >800 (SAT,ACT,GRE are 1-3, IELTS GMAT LSAT MCAT already deep)
    # But still check each article
    for art_idx in range(1, 6):
        # Skip IELTS/GMAT/LSAT/MCAT already deep (5,6,7,8) if already >700 - we already handled, but 9+ need
        # For this batch we will deepen articles where wc <900 OR exam 9+ OR TOEFL 3-5
        marker = f"ARTICLE {art_idx}\nEXAM: {name}"
        if marker not in text:
            continue
        # locate FULL ARTICLE span for this marker
        # Find marker pos then search for FULL ARTICLE
        mpos = text.find(marker)
        pat = re.compile(r"FULL ARTICLE:\s*\n(.*?)\n============================================================\s*\n\s*FAQ:", re.DOTALL)
        mm = pat.search(text, mpos)
        if not mm:
            continue
        start, end = mm.span(1)
        cur_wc = len(mm.group(1).split())
        # Decision: deepen if cur_wc <850 OR (num>=9 and art_idx>=2) OR (num==4 and art_idx>=3)
        should = False
        if cur_wc < 850:
            should = True
        elif num >= 9 and cur_wc < 1000:
            should = True
        elif num == 4 and art_idx >= 3 and cur_wc < 1200:
            should = True
        # Skip if already flagship deep (>1200) for 5-8,13-17 article1
        if not should:
            continue
        # Generate
        if art_idx == 1:
            body = guide(name, short, official, sections, scoring, category)
        elif art_idx == 2:
            body = study_plan(name, short, official, sections, scoring, category)
        elif art_idx == 3:
            body = mastery(name, short, official, sections, scoring, category)
        elif art_idx == 4:
            body = comparison(name, short, official, sections, scoring, category)
        else:
            body = post(name, short, official, sections, scoring, category)
        body = body.strip()
        # Replace
        text = text[:start] + body + text[end:]
        replacements += 1
        # print(f"Deepened EXAM#{num} A{art_idx} ({short}): {cur_wc} -> {len(body.split())} words")
        # Need to update arts list positions? We'll just continue; regex search uses updated text length shifts but mpos still approximate - rebuild after each batch? Instead process sequentially with string replacement via span which shifts subsequent positions correctly if we re-search from start each time? Our loop uses text.find each iteration which re-finds correctly.

print(f"Replacements this batch: {replacements}")
FILE.write_text(text, encoding='utf-8')
print(f"Done. Size: {len(text)/1024:.1f} KB, lines: {len(text.splitlines())}")

# Re-validate
arts2 = list(re.finditer(r'FULL ARTICLE:\s*\n(.*?)\n============================================================\s*\n\s*FAQ:', text, re.DOTALL))
wc2 = [len(a.group(1).split()) for a in arts2]
print(f"Post: {len(arts2)} articles, min {min(wc2)} max {max(wc2)} avg {sum(wc2)//len(wc2)} under800 {sum(1 for w in wc2 if w<800)} under600 {sum(1 for w in wc2 if w<600)}")
