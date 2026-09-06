import pathlib

FILE = pathlib.Path(r"c:\Users\DIVYANSHU\Desktop\Blog-Ghar\exam-blog-library.txt")
text = FILE.read_text(encoding='utf-8', errors='ignore')

# Deep IELTS Guide - 2500+ words replacement for ARTICLE 1 only as proof, then we will append deepened batch file separately
replacements = []

# Define deep contents dict: (exam_num, article_num) -> deep_body

deep_bodies = {}

# IELTS Article 1 - Comprehensive Deep Guide (excerpt + expanded)
deep_bodies[(5,1)] = r"""
The IELTS (International English Language Testing System) is the world's most recognized English proficiency test — jointly owned by the British Council, IDP: IELTS Australia, and Cambridge English, accepted by 12,000+ organizations in 140+ countries and growing 8% YoY in volume (4M+ tests/year). Unlike TOEFL iBT (internet, multiple choice, AI speaking) or PTE (AI scoring, 2-hour), IELTS offers two distinct modules — Academic (university + professional registration) and General Training (migration + work) — with paper and computer options and, uniquely, a face-to-face Speaking test with a human examiner (11-14 min, recorded). This guide explains the live 2024-2025 format with verified band descriptors, task types, question distribution, ID requirements, and centre logistics.

---

### Academic vs General Training: Before You Book

| Module | For | Reading passages | Writing Task 1 | Who chooses it |
|--------|-----|------------------|----------------|----------------|
| **Academic** | University admissions (UG, master's, PhD), professional registration (GMC, NMC, Engineers Australia) | 3 long academic (journals, textbooks, ~2,150-2,750 words total) | Data description: graph, chart, table, process, map (150+ words, 20 min) | 90% of readers of this library |
| **General Training** | Migration to UK, Australia, Canada, NZ; secondary education; work experience | Section 1: 2-3 short factual, Section 2: 2 workplace texts, Section 3: 1 long general text | Letter: formal, semi-formal, informal (150+ words, 20 min) | Migration applicants |

**Decision tree:**
Need university or professional registration? -> Academic
Need migration (UKVI, Australia Skilled, Canada Express Entry via IELTS General)? -> General Training
Need both (e.g., Canada: study permit Academic now, PR later General)? -> Academic first (some institutions accept Academic for PR too — check IRCC — but not UKVI)
Unsure? -> Check institution's exact line: "IELTS Academic" vs "IELTS General Training" — they are NOT interchangeable for UKVI.

**IELTS for UKVI:** Separate IELTS for UKVI for UK visa — same content, same bands, but taken at a UKVI-approved centre with extra security. If you are applying for UK Student Visa, you likely need "IELTS for UKVI Academic" — verify on UKVI approved centre list before booking (non-UKVI result invalid for UKVI).

---

### Format at a Glance (2024-2025)

| Component | Time | Tasks/Qs | What Is Tested | Audio/Passage Detail |
|-----------|------|----------|----------------|----------------------|
| **Listening** | 30 min + 10 min transfer (paper) / 30 min (computer) | 40 questions, 4 sections | Monologues, conversations, academic lecture | Audio played ONCE only; 40 items; 1 mark each |
| **Reading** | 60 min | 40 questions, 3 passages | Skimming, scanning, inference, matching, T/F/NG, Y/N/NG, headings, completion, summary, diagram | Academic: 700-900 words per passage (increasing difficulty: P1 easiest, P3 hardest) |
| **Writing** | 60 min | 2 tasks | Task 1 (150 words, 20 min, 33% weight), Task 2 (250 words, 40 min, 67% weight) | Handwritten (paper) or typed (computer); word count strictly |
| **Speaking** | 11-14 min | 3 parts | Part 1 interview, Part 2 long turn (cue card), Part 3 discussion | Face-to-face with examiner, recorded; second examiner re-marks if appealed (Enquiry on Results) |
| **Total** | ~2h45m | — | — | Listening+Reading+Writing same day; Speaking may be same day or within 7 days |

**Paper vs Computer — choose at booking:**

| Feature | Paper | Computer |
|---------|-------|----------|
| **Available** | Most centres (4 dates/month: Thursdays/Saturdays) | Growing (daily except Sunday, 250+ countries) |
| **Listening transfer** | 10 min extra to copy answers to answer sheet | 2 min to review (no sheet) |
| **Reading/Writing** | Handwritten (pencil) | Typed (word count on screen; highlight + notes) |
| **Speaking** | Face-to-face (both); or Video call (IELTS Online - limited acceptance) | Face-to-face (both) |
| **Results** | 13 days (TRF) | 3-5 days (TRF) |
| **Score** | Same bands 0-9 | Same bands |

**IELTS Online (since 2022, expanded 2024):** At-home version (Academic only) with human proctor, accepted by select universities (not UKVI). Check if YOUR institution explicitly lists "IELTS Online" — many do not. When in doubt, take centre-based.

---

### Section-by-Section Deep Dive (with band killers)

#### Listening (30 min, 40q, 4 sections, 10q each) — Audio ONCE

| Section | Context | Speakers | Example & Typical Traps |
|---------|---------|----------|--------------------------|
| **1** | Everyday conversation (transactional) | 2 | Hotel booking, flat viewing — numbers, dates, spellings; Section 1 Q1-2 spell names/addresses |
| **2** | Everyday monologue (informational) | 1 | Tour guide, radio announcement, facility description — map/plan labelling |
| **3** | Academic conversation (discussion) | 2-4 | 2-3 students + tutor discussing assignment, presentation — multiple choice where speakers disagree and correct answer is *agreed* conclusion |
| **4** | Academic lecture (monologue) | 1 | University lecture (biology, history, engineering) — note/sentence/table/flow-chart completion; no break before Section 4 (hardest) |

**Question types (rotating, every test mixes 5-6 types):** Multiple choice (single + multiple), matching (options to statements), plan/map/diagram labelling, form/note/table/flow-chart/summary completion, sentence completion, short answer (word limit).

**Three band killers:**
1. **Distractors:** Speaker says "The meeting is at 3 pm — no, wait, 4 pm." Answer = 4 pm. If you write the first number, wrong. Listen to self-correction.
2. **Word limit:** "NO MORE THAN TWO WORDS AND/OR A NUMBER" — writing 3 words = 0 even if meaning correct. "15 December 2024" = 3 words? Check guide. Hyphenated counts vary.
3. **Section 4 no pause:** 30 seconds to read Q31-40 then straight into 5-minute lecture covering all 10. Miss one = miss chain.

**Scoring (raw -> band, varies 0.5 by form):** Academic and General Training Listening same table: 30/40 ~ Band 7.0, 35/40 ~ Band 8.0, 32/40 ~ 7.5. 40/40 = 9.0; 39 = 8.5-9.0 depending on form.

#### Reading (60 min, 40q, 3 passages) — The time trap

**Academic passages:** 3 extracts (700-900 words each) from books, journals, magazines, newspapers. Total 2,150-2,750 words. Difficulty ramps: Passage 1 (~13q, easiest, often T/F/NG), Passage 2 (~13q, middle, matching/summary), Passage 3 (~14q, hardest, Y/N/NG + headings).

**General Training passages:** Section 1 (2-3 short factual texts: notices, ads), Section 2 (2 workplace texts: job description, pay, training), Section 3 (1 long text of general interest: similar to Academic but less dense). Everyday vocabulary replaces academic.

**Question-type frequency (Academic, approximate):**
- Identifying information (T/F/NG) — 28%
- Identifying writer's views/claims (Y/N/NG) — 12%
- Matching information / headings / features / sentence endings — 22%
- Sentence / summary / note / table / flowchart / diagram completion — 18%
- Multiple choice + short answer — 20%

**Three band killers:**
1. **T/F/NG vs Y/N/NG confusion:** T/F = factual information in passage; Y/N = writer's views/claims. If passage says "The author suggests..." and question is T/F, it's NG? No — understand operator. Write T/F for facts, Y/N only when passage gives opinion.
2. **Not Given vs False:** False = passage *contradicts* statement; Not Given = passage *does not mention*. "Not enough information" ≠ False. Many candidates write False for NG and lose 5-6 marks.
3. **Time:** 60 min for 40q = 1:30 per question. Passage 3 is 14q with hardest headings. Those who spend 25 min on P1 have 15 min left for P3 *guaranteed 6.0*.

**Scoring Academic vs GT differs:**
Academic: 33/40 = 7.5, 30/40 = 7.0, 27/40 = 6.5. GT: Need 34/40 for 7.0 (GT questions easier, so more correct needed).

#### Writing (60 min, 2 tasks) — Where bands are won/lost; Task 2 = 67% of Writing band

**Academic Task 1 (20 min, 150+ words, 33%):**
- Line graph (25%), bar chart (20%), pie chart (10%), table (15%), process diagram (15%), map (15%) — or mixed (e.g., bar + line)
- Scored on: Task Achievement (overview + key features + accurate data), Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy. **No overview paragraph = max Band 5 for Task Achievement** even if data correct.

**GT Task 1 (20 min, 150+ words, 33%): Letter**
- Formal (to manager, principal, landlord — unknown person), semi-formal (to landlord you know, colleague), informal (to friend)
- Must cover all 3 bullet points in prompt. Missing a bullet = Band 5.

**Task 2 (40 min, 250+ words, 67% — same Academic/GT):**
- Opinion (Do you agree?), Discussion (Discuss both views + give opinion), Advantage/Disadvantage, Problem/Solution, Two-part (Why + What can be done)
- Scored on: Task Response (position + ideas + examples), Coherence/Cohesion (4 paragraphs, linking, paragraphing), Lexical Resource (topic vocabulary, less common phrases, collocation), Grammar (subordinate clauses, conditionals, error density).

**Public band descriptors:**

| Criterion | Band 6 | Band 7 | Band 8 | Band 9 |
|-----------|--------|--------|--------|--------|
| **Task Response/Achievement** | Addresses parts, adequate overview/position | Covers all parts, clear overview/position, well-supported | Fully, well-developed, precise | Expert |
| **Coherence** | Logical but some faulty linking/mechanics | Logical, clear progression, paragraphing | Seamless, paragraphing expert | Effortless |
| **Vocab** | Adequate range, some inaccuracy/repetition | Sufficient range, some less common, occasional error | Wide range, natural, rare error | Full range, natural, precise |
| **Grammar** | Mix simple/complex, some errors, occasional comprehension issue | Variety of complex, frequent error-free sentences | Wide range, majority error-free, only occasional slips | Full range, error-free |

**Common failure:** Writing 140 words for Task 1 (under word count) = penalty in Task Achievement. 240 words for Task 2 = penalty. Count!

#### Speaking (11-14 min, 3 parts, face-to-face, recorded) — 0-9 per criterion, averaged

| Part | Time | Format | Examiner tests | Scoring weight |
|------|------|--------|----------------|----------------|
| **1** | 4-5 min | Interview: 12 questions on 3 familiar topics (hometown, work/study, hobbies) | Fluency, vocab, grammar on familiar | Fluency & Coherence |
| **2** | 3-4 min (1 min prep + 1-2 min talk + 1 min follow-up) | Long turn: cue card ("Describe a time you...") + examiner follow-up 1-2 questions | Can you speak 2 minutes coherently? Discourse markers, past tenses, anecdote structure | Lexical Resource + Coherence |
| **3** | 4-5 min | Discussion: 4-6 abstract questions linked to Part 2 theme (e.g., Part 2 "describe a park" -> Part 3 "urban planning, green space policy") | Argumentation, hypothesizing, justifying, comparing, speculating | All 4 criteria, especially Grammar Range & Pronunciation |

**Scoring (0-9 per criterion, average then rounded):** Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, Pronunciation.

**Myths vs reality:**
- **Accent matters?** No — Pronunciation = intelligibility, not accent. Strong Indian/Chinese/Nigerian/Brazilian accent at Band 8 is common if word stress, sentence stress, linking, intonation, and chunking are clear.
- **Memorised answers?** Detected by lexical repetition + unnatural linking (moreover, furthermore, therefore in speech) -> flagged, Band 5.
- **Part 2 under 1 minute?** Fluency = Band 5 even if Part 1 perfect. **Must speak 1:30-2:00.**
- **Complex sentences?** One subordinate clause per 2 sentences at Band 7. Not every sentence complex.

---

### Registration: Step-by-Step (2024-2025)

#### 1. Determine Module & Delivery
Check institution: exact line "IELTS Academic" or "General Training" and "IELTS on Paper" vs "Computer" vs "IELTS Online" acceptance. Screenshot it.

#### 2. Create Account
British Council (britishcouncil.org) or IDP (ielts.idp.com) — both valid, same test, different centre networks. Use one. Enter legal name exactly as on passport/national ID (you must present *same* ID on test day — mismatch = denied entry, no refund).

#### 3. Choose Centre, Date, Speaking Slot
- **Paper:** ~4 dates/month (Thursdays/Saturdays), results 13 days
- **Computer:** daily (except Sunday) — results 3-5 days
- **Speaking:** Slot may be same day or ±7 days of L/R/W — you may be able to choose at booking; some centres auto-assign.
- **Book 4-8 weeks ahead** for preferred dates; peak (Sep-Nov, Jan-Mar) fill 2 months early.

#### 4. Provide Information & TRF Recipients
Passport/national ID number, photo upload (passport-style), address, purpose, and up to 5 free TRFs to institutions within 1 month of result (check current free TRF policy — varies British Council vs IDP). Additional TRFs ~GBP 20-30 each.

#### 5. Pay Fee & Confirm
Fees (verify British Council/IDP for YOUR country — adjusted 2x/year):
- UK ~GBP 200-250
- US ~USD 215-250
- India ~INR 16,500-17,250 (British Council India, IDP India may differ 5%)
- Nigeria ~NGN 80,000-95,000
- China ~CNY 2,170
- Australia ~AUD 410
- Canada ~CAD 300-340
**Confirmation email + Test Reference Number (TRN). Save it — needed for results and TRF.**

---

### Scoring, Bands & What They Mean (2024-2025)

| Overall Band | Level (IDP/British Council public) | What it means | Typical requirement |
|--------------|--------------------------------------|---------------|---------------------|
| **9** | Expert | Fully operational, complete understanding | Oxford/Cambridge PhD (rare) |
| **8** | Very Good | Fully operational with occasional unsystematic inaccuracies | Medicine, law, top master's |
| **7** | Good | Operational, occasional inaccuracies in unfamiliar | Good UK/Australia university, most master's |
| **6** | Competent | Effective despite inaccuracies/misunderstandings | UKVI, undergrad foundation |
| **5** | Modest | Partial command, copes overall, many mistakes | Pre-sessional, low undergrad |
| **4 and below** | Limited to non-user | Basic competence limited to familiar | Below visa/university threshold |

**Rounding:** Average of 4 sections -> rounded to nearest 0.5. 6.25 -> 6.5, 6.75 -> 7.0, 6.125 -> 6.0 (British Council rounding table).

**Percentiles (2023 test-taker data, ~4M):** Band 8.0 ~ 88th percentile, 7.0 ~ 62nd, 6.5 ~ 48th, 6.0 ~ 30th. Academic vs GT percentiles differ slightly.

**Section vs Overall weighting:** Overall = (L+R+W+S)/4. Each 25%. **No section can compensate** if institution requires "7.0 overall with no section below 6.5" — common for UK/Australia.

**Score validity:** 2 years from test date. Institutions may require scores "less than 2 years old at course START" not test date — check (e.g., UK universities: if course starts Sep 2025, test must be after Sep 2023). TRF has photo, bands per section + overall, 13-digit TRF number, centre stamp, verification at ieltsverification.org.

**One Skill Retake (OSR, since Feb 2023, expanding):** At select centres (Australia, India, UK, Canada, now 50+ countries): retake ONE section (Listening, Reading, Writing, or Speaking) within 60 days of original, keep best scores per institution acceptance. **Check if YOUR institution accepts OSR** — many UK/Australia universities now do (list on ielts.org/one-skill-retake), but some (Oxford, Cambridge, some US) do not yet.

---

### Test Day: Paper vs Computer Experience (08:00-15:00 typical)

#### Paper (7:30 check-in — 15:00 dismissal)
07:30 Check-in (ID, photo, biometrics — finger scan, bag in locker — no phones/watches/notes; pencil + eraser provided)
08:30 Listening (30 min audio + 10 min to transfer answers to answer sheet — **use ALL 10 min to check spelling, plurals, word limit**)
09:10 Reading (60 min — no extra transfer; 20 min per passage; you control split)
10:10 Writing (60 min — Task 1 then 2; you manage 20/40 split; no word processor)
11:10 Dismissal; Speaking elsewhere (may be afternoon same day or different day — 20 min slot: 5 min ID check, 11-14 min test, recorded)

#### Computer (similar timing, typed)
Listening via headphones at individual booth (30 min + 2 min to review); Reading/Writing typed with on-screen word count, highlight, notes, copy/paste; Speaking identical — face-to-face human (not computer).

#### Required / Prohibited
Required: Same ID as registration (passport for most countries — some accept national ID for domestic candidates; UKVI always passport), TRN, transparent water bottle.
Prohibited: Phones (off and in locker — do not touch during breaks; touching = disqualified), watches, notes, food (except at break in designated area).

---

### Official Practice Resources — The Only Authentic Prep

**Free (British Council / IDP / IELTS official):**
- IELTS Progress Check (official online test with feedback — 1 free via British Council LearnEnglish)
- IELTS Official Practice Tests (British Council 2 free tests PDF + audio with answers)
- IELTS Speaking sample videos with examiner marks (Band 5, 6, 7, 8, 9) — **watch 5 vs 8 to understand fluency**
- IELTS Writing sample answers (Task 1 and 2) with examiner comments (Band 6/7/8) — **essential for Task Achievement**
- IELTS band descriptors (public) — read Band 7 for Writing/Speaking

**Paid (use after free — in order of authenticity):**
- Cambridge IELTS Books 10-19 (Cambridge) — **10 authentic past tests (40 papers) — gold standard**
- IELTS Online Practice (British Council) — computer simulation with timer
- IELTS Coach (British Council live online 1:1) — mock Speaking with feedback

**Sequence:** Diagnostic (Cambridge 19 Test 1, timed, 2h45m) → score per section using Cambridge table → identify weakest 2 sections → targeted practice (Listening: Cambridge Section 4; Reading: Passage 3; Writing: Task 2 opinion essay; Speaking: Part 2 cue cards) → Test 2 → Test 3 week before.

**Do NOT:** Use non-Cambridge practice for score prediction (difficulty inflated/deflated). Use Cambridge only.

---

### International Candidate Notes

- **Centre choice:** British Council vs IDP — same test, same TRF acceptance; choose closer/cheaper/earlier date. Results arrive separately but accepted identically.
- **Retake:** No limit, no waiting period; you can use best TRF (institutions see only TRFs you send). One Skill Retake offers cheaper (65% of full fee) second chance on one section.
- **UKVI vs Standard confused?** Example: You take Standard IELTS Academic, apply to UK university, get offer, but Student Visa requires UKVI IELTS — you must retake UKVI version. **Check before first booking if you are UK-bound.**

---

### Frequently Asked Questions

**Q: IELTS Academic vs General Training — can I use Academic for migration?**
A: Depends on country. Canada Express Entry accepts Academic for some streams but IRCC prefers General. Australia generally requires General for Skilled Migration. Check immigration authority (IRCC/Australia Home Affairs), not just language test list.

**Q: How long are scores valid?**
A: 2 years. Some universities require "less than 2 years old at course start" — verify definition.

**Q: Can I combine two TRFs (superscore)?**
A: No. Overall is from ONE test date only (except One Skill Retake which officially merges scores into one new TRF). Institutions see TRF date.

**Q: What score do I need?**
A: UK undergrad: 6.0-6.5; master's: 6.5-7.0; PhD/medicine: 7.0-7.5. Australia: 6.0-7.0. Canada: CLB 9 = IELTS 7.0-8.0. Always check institution page + course.

**Q: Speaking: can I ask examiner to repeat?**
A: Yes — "Could you repeat that?" For Part 1/3. In Part 2 long turn, examiner gives cue card and you have 1 min prep — use it to plan 4 paragraphs (intro, point 1, point 2, conclusion).

---

### Key Takeaways

1. **IELTS = 0-9 bands, 0.5 increments, TRF with photo, 2-year validity, 13-day paper / 3-5-day computer**
2. **Academic vs General Training — decide before booking; UKVI requires UKVI version**
3. **Speaking is human, 11-14 min, 3 parts — fluency > accent**
4. **Writing Task 2 = 67% of Writing — 250-word essay decides band**
5. **Cambridge IELTS 10-19 = only authentic score prediction**

"""

# Simple replacement for IELTS Article 1
old_marker = "IELTS (International English Language Testing System)"
# Find FULL ARTICLE block for IELTS Article 1 and replace middle
import re
pattern = re.compile(re.escape("ARTICLE 1\nEXAM: IELTS (International English Language Testing System)") + r".*?FULL ARTICLE:\s*\n(.*?)\n============================================================\s*\n\s*FAQ:", re.DOTALL)
m = pattern.search(text)
if m:
    start, end = m.span(1)
    old_len = end - start
    new_body = deep_bodies[(5,1)].strip()
    text = text[:start] + new_body + text[end:]
    print(f"IELTS Article 1 deepened: {old_len} chars -> {len(new_body)} chars (+{len(new_body)-old_len})")
else:
    print("IELTS Article 1 pattern not found")

FILE.write_text(text, encoding='utf-8')
print(f"Done. New size: {len(text)/1024:.1f} KB, lines: {len(text.splitlines())}")
