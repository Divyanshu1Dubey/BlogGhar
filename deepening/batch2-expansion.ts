/**
 * Deepened versions of expansion career/exam stubs from expanded-content.ts.
 * These overwrite the thin ~200-word template stubs with comprehensive 1,200+ word guides.
 */
export type DeepenedExpansionPost = {
  title: string;
  slug: string;
  category: string;
  focusKeyword: string;
  excerpt: string;
  sourceUrl: string;
  body: string;
};

export const deepenedExpansionPosts: DeepenedExpansionPost[] = [
  {
    title: "UPSC Civil Services Exam: Official Syllabus and Application Workflow",
    slug: "upsc-cse-official-syllabus-application",
    category: "India Exams",
    focusKeyword: "UPSC CSE syllabus application",
    excerpt: "A practical, official-source guide to Civil Services Examination stages — from OTR registration to final allocation.",
    sourceUrl: "https://upsc.gov.in/examinations/active-exams",
    body: `The UPSC Civil Services Examination (CSE) is conducted by the Union Public Service Commission to recruit officers for the IAS, IPS, IFS, IRS, and other Group A and Group B services. Over 10 lakh candidates register annually, but only about 800-1,000 are finally selected. This guide covers the official application process, complete syllabus, and practical steps to prepare.

## Official Portal and Application Process

The UPSC application is filed through the One-Time Registration (OTR) system on [upsconline.nic.in](https://upsconline.nic.in). The OTR is a permanent registration — you only need to create it once, and it can be used for all future UPSC examinations.

### Step-by-Step Application

**Step 1: OTR Registration**
- Visit upsconline.nic.in and click "New Registration"
- Enter personal details: name (as on Class 10 certificate), date of birth, gender, category, photograph, signature
- Create login credentials (email and password)
- Note your OTR number — you will need it for all future applications

**Step 2: Apply for CSE**
- Log in to the OTR portal
- Select "Examination Application" → "Civil Services (Preliminary) Examination"
- Fill in educational qualification, preferred examination centre, and service preferences
- Upload photograph (20 KB-300 KB, JPEG format) and signature (10 KB-300 KB)
- Pay the application fee online

**Step 3: Fee Payment**
| Category | Fee |
|----------|-----|
| General / EWS / OBC | ₹100 |
| SC / ST / PwBD / Female | Exempted |
| Payment Mode | Online (SBI Net Banking, UPI, Debit/Credit Card) |

**Step 4: Confirmation**
- Take a printout of the submitted application
- Check for any corrections during the correction window (usually 1-2 weeks after the last date)

### Key Dates (Typical Cycle)

| Event | Timeline |
|-------|----------|
| Notification Release | Late January / Early February |
| Application Opens | Day of notification |
| Application Deadline | ~3 weeks from notification |
| Correction Window | ~1 week after deadline |
| Prelims Admit Card | ~2 weeks before exam |
| Prelims Exam | Late May / Early June |
| Prelims Result | June - July |
| Mains Application (DAF-I) | After Prelims result |
| Mains Exam | September - October |
| Mains Result | December - January |
| Interview (Personality Test) | February - April |
| Final Result | April - May |

Always check [upsc.gov.in](https://upsc.gov.in) for actual dates — the commission may adjust schedules.

## Eligibility Criteria

### Educational Qualification
A graduate degree from a recognized university is required. Final-year students can also apply, but they must produce proof of graduation before the Mains application deadline.

### Age Limits (as on 1st August of exam year)

| Category | Min Age | Max Age | Max Attempts |
|----------|---------|---------|-------------|
| General | 21 | 32 | 6 |
| OBC (Non-Creamy Layer) | 21 | 35 | 9 |
| SC / ST | 21 | 37 | Unlimited (within age) |
| PwBD (General) | 21 | 42 | 9 |
| PwBD (OBC) | 21 | 45 | Unlimited (within age) |
| PwBD (SC/ST) | 21 | 47 | Unlimited (within age) |

### Nationality
- IAS and IPS: Must be an Indian citizen
- Other services: Indian citizen, or subject of Nepal/Bhutan, or Tibetan refugee who arrived in India before 1st January 1962, or a person of Indian origin who migrated from Pakistan, Burma, Sri Lanka, East African countries, etc.

## Complete Syllabus

### Preliminary Examination

**Paper I: General Studies (GS-I)** — 100 questions, 200 marks, 2 hours

| Topic | Key Areas |
|-------|-----------|
| Current Events | National and international importance |
| History | Indian history, Indian National Movement |
| Geography | Indian and World geography (physical, social, economic) |
| Polity | Indian Constitution, Panchayati Raj, public policy, rights |
| Economy | Sustainable development, poverty, inclusion, demographics |
| Environment | Ecology, biodiversity, climate change |
| General Science | Physics, Chemistry, Biology at general level |

**Paper II: CSAT (GS-II)** — 80 questions, 200 marks, 2 hours (Qualifying: ≥33%)

| Topic | Key Areas |
|-------|-----------|
| Comprehension | English and Hindi passages |
| Logical Reasoning | Analytical ability, decision-making |
| Basic Numeracy | Class X level mathematics |
| Data Interpretation | Charts, graphs, tables |

### Main Examination

| Paper | Subject | Marks | Duration |
|-------|---------|-------|----------|
| A | Indian Language (qualifying) | 300 | 3 hours |
| B | English (qualifying) | 300 | 3 hours |
| I | Essay | 250 | 3 hours |
| II | GS I — Indian Heritage, History, Geography, Society | 250 | 3 hours |
| III | GS II — Polity, Governance, Constitution, IR | 250 | 3 hours |
| IV | GS III — Economy, Environment, Technology, Security | 250 | 3 hours |
| V | GS IV — Ethics, Integrity, Aptitude | 250 | 3 hours |
| VI | Optional Subject — Paper 1 | 250 | 3 hours |
| VII | Optional Subject — Paper 2 | 250 | 3 hours |

**Merit:** 7 papers × 250 = 1,750 (written) + 275 (interview) = 2,025 total

### Optional Subjects (Choose One)

Available optional subjects include: Agriculture, Animal Husbandry, Anthropology, Botany, Chemistry, Civil Engineering, Commerce, Economics, Electrical Engineering, Geography, Geology, History, Law, Management, Mathematics, Mechanical Engineering, Medical Science, Philosophy, Physics, Political Science, Psychology, Public Administration, Sociology, Statistics, Zoology, plus literature in 21 Indian languages.

**How to choose:** Select a subject with (a) genuine interest, (b) overlap with GS papers, (c) adequate study material available, and (d) manageable syllabus length.

## What to Check Before Applying

- Confirm you meet all eligibility criteria (age, attempts, education)
- Ensure your photograph and signature meet UPSC specifications
- Keep your Class 10 certificate handy for name and date of birth verification
- Prepare a list of preferred services in the correct order
- Check the official notification for any changes in exam pattern or syllabus
- Save your OTR credentials securely — you will need them throughout the process

## Official Source

Use the official source for dates, vacancies, eligibility, syllabus, and application status: [UPSC Official Website](https://upsc.gov.in). Blog-Ghar does not guarantee a deadline or vacancy; verify the page before taking action.

## Frequently Asked Questions

**Q: Can I edit my application after submission?**
A: Yes, during the correction window (usually 1-2 weeks after the last date). You cannot edit after the window closes.

**Q: Is there negative marking in Prelims?**
A: Yes. One-third of marks deducted per wrong answer in both GS-I and CSAT.

**Q: Do Prelims marks count in the final result?**
A: No. Prelims is purely a screening test. Only Mains marks and interview marks count for the final merit list.

**Q: How many optionals should I prepare?**
A: Only one optional subject with two papers (500 marks total). Choose carefully — it contributes 25% of your Mains score.

**Q: Can I apply for both CSE and CMS?**
A: Yes, if you meet the eligibility criteria for both. They are separate examinations with separate applications.`,
  },
  {
    title: "SSC CGL: Official Notification, Syllabus, and Preparation Checklist",
    slug: "ssc-cgl-official-notification-guide",
    category: "India Exams",
    focusKeyword: "SSC CGL notification guide",
    excerpt: "How to use the Staff Selection Commission portal for CGL notification, application, syllabus, and preparation.",
    sourceUrl: "https://ssc.gov.in/",
    body: `The Staff Selection Commission (SSC) conducts the Combined Graduate Level (CGL) examination annually to recruit Group B and Group C posts in central government ministries. Over 20 lakh candidates apply for approximately 7,000-10,000 vacancies. This guide covers the official notification process, application workflow, complete syllabus, and preparation checklist.

## Official Portal and Notification

SSC notifications are published on [ssc.gov.in](https://ssc.gov.in). The notification contains:
- Total vacancies and post-wise details
- Eligibility criteria (age, education, category-wise relaxation)
- Application dates and fee structure
- Exam pattern and syllabus
- Important instructions for candidates

### Notification Timeline (Typical)

| Event | Timeline |
|-------|----------|
| Notification Release | April - May |
| Application Opens | Day of notification |
| Application Deadline | ~30 days from notification |
| Correction Window | ~2-3 days after deadline |
| Tier 1 Admit Card | ~10 days before exam |
| Tier 1 Exam | July - August |
| Tier 1 Result | September - October |
| Tier 2 Exam | November - December |
| Tier 2 Result | January - February |
| Tier 3 (Descriptive) | February - March |
| Tier 4 (Skill Test) | March - April |
| Final Result | May - June |

## Application Process

**Step 1: SSC Registration**
- Visit ssc.gov.cn → "New Registration"
- Enter name, father's name, mother's name, date of birth, gender, category, email, mobile number
- Create a registration number and password

**Step 2: Apply for CGL**
- Login → "Latest Notifications" → "Combined Graduate Level Examination"
- Fill personal, educational, and preference details
- Upload photograph (20 KB-50 KB) and signature (10 KB-20 KB)
- Pay fee online

**Step 3: Fee Structure**

| Category | Fee |
|----------|-----|
| General / OBC | ₹100 |
| SC / ST / PwBD / Female | Exempted |
| Payment | Online only (BHIM UPI, Net Banking, Debit/Credit Card) |

## Eligibility

| Requirement | Details |
|-------------|---------|
| Education | Bachelor's degree from a recognized university |
| Age (varies by post) | 18-27 years (Tax Assistant) to 20-32 years (AO) |
| Nationality | Indian citizen |

### Age Relaxation

| Category | Relaxation |
|----------|-----------|
| OBC | 3 years |
| SC / ST | 5 years |
| PwBD | 10 years |
| Ex-Servicemen | 3 years after military service |

## Complete Exam Structure

### Tier 1 (Objective — Qualifying)

| Subject | Questions | Marks |
|---------|-----------|-------|
| General Intelligence & Reasoning | 25 | 50 |
| General Awareness | 25 | 50 |
| Quantitative Aptitude | 25 | 50 |
| English Comprehension | 25 | 50 |
| **Total** | **100** | **200** |

Duration: 60 minutes. Negative marking: 0.50 per wrong answer.

### Tier 2 (Objective — Merit)

| Paper | Sections | Questions | Marks | Duration |
|-------|----------|-----------|-------|----------|
| Paper I | Maths + Reasoning + English + GA | 130 | 390 | 2h 15m |
| Paper II | Statistics (for JSO post) | 100 | 200 | 2 hours |
| Paper III | Finance & Accounting (for AAO) | 100 | 200 | 2 hours |

### Tier 3 (Descriptive)

Essay / Letter / Application — 100 marks, 60 minutes.

### Tier 4 (Skill Test)

DEST or CPT depending on post allocation.

## Preparation Checklist

1. Register on ssc.gov.in and complete profile
2. Download the official notification and read it thoroughly
3. Identify which posts you are eligible for based on age and education
4. Collect required documents: photograph, signature, category certificate (if applicable)
5. Submit application before deadline — do not wait for the last day
6. Download and verify your application confirmation
7. Start preparation: Quantitative Aptitude → Reasoning → English → General Awareness
8. Solve at least 10 previous year Tier 1 papers
9. Practice mock tests weekly from Month 3 onward
10. For Tier 2: start preparation alongside Tier 1 (gap is only 2-3 months)

## Official Source

Use the official source for notifications, dates, vacancies, and application status: [SSC Official Website](https://ssc.gov.in). Blog-Ghar does not guarantee a deadline or vacancy; verify the page before taking action.`,
  },
  {
    title: "NEET UG: Official NTA Information and Counselling Verification Guide",
    slug: "neet-ug-official-nta-guide",
    category: "India Exams",
    focusKeyword: "NEET UG NTA official",
    excerpt: "Find authentic NEET UG notices, information bulletins, and counselling links through official NTA sources.",
    sourceUrl: "https://neet.nta.nic.in/",
    body: `The National Testing Agency (NTA) conducts the National Eligibility cum Entrance Test (NEET) UG for admission to MBBS, BDS, AYUSH, and veterinary courses across India. Over 20 lakh candidates register annually. This guide covers the official NTA portal, application process, exam details, and counselling verification.

## Official Portal

The primary official portal for NEET UG is [neet.nta.nic.in](https://neet.nta.nic.in). The NTA website [nta.ac.in](https://nta.ac.in) also hosts notifications and information bulletins.

**Key pages to check:**
- Information Bulletin (downloadable PDF with complete rules)
- Application form and correction window
- Admit card download
- Answer key and OMR sheet
- Result declaration
- Counselling schedule

## Application Process

**Step 1: NTA Registration**
- Visit neet.nta.nic.in → "New Registration"
- Enter personal details, create login credentials
- You will receive an application number

**Step 2: Fill Application**
- Log in and complete the application form
- Select examination city (4 preferences)
- Enter educational details (Class 10 and 12 marks)
- Upload photograph (10 KB-200 KB, recent, white background) and signature (4 KB-30 KB)
- Pay examination fee

**Step 3: Fee Structure**

| Category | Fee |
|----------|-----|
| General | ₹1,700 |
| General-EWS / OBC-NCL | ₹1,600 |
| SC / ST / PwBD / Transgender | ₹1,000 |
| Payment | Online (Credit/Debit Card, Net Banking, UPI) |

**Step 4: Confirmation**
- Download and print the confirmation page
- Verify all details are correct
- Note the correction window dates — NTA allows edits for a limited period

## NEET UG Exam Details

| Feature | Details |
|---------|---------|
| Question Type | Multiple Choice Questions (4 options) |
| Subjects | Biology, Physics, Chemistry |
| Total Questions | 200 (attempt 180) |
| Maximum Marks | 720 |
| Duration | 3 hours 20 minutes |
| Marking | +4 correct, −1 incorrect, 0 unattempted |
| Mode | Offline (pen and paper) |
| Language | English, Hindi, and 10 regional languages |

### Section Structure

Each subject has Section A (35 mandatory questions) and Section B (15 questions, attempt any 10).

| Subject | Section A | Section B (Attempt 10) | Total Marks |
|---------|-----------|----------------------|-------------|
| Biology | 35 × 4 = 140 | 10 × 4 = 40 | 180 |
| Physics | 35 × 4 = 140 | 10 × 4 = 40 | 180 |
| Chemistry | 35 × 4 = 140 | 10 × 4 = 40 | 180 |
| **Total** | | | **720** |

## Post-Exam Process

### Answer Key and Challenge
- NTA releases the provisional answer key after the exam
- Candidates can challenge specific answers by paying ₹200 per question
- Challenges are reviewed by subject experts
- Final answer key is released after considering valid challenges

### Result and Score Card
- Results are declared on neet.nta.nic.in
- Score card includes: All India Rank, Category Rank, Percentile, Marks
- NTA percentile formula: (Number of candidates with marks less than or equal to candidate / Total candidates) × 100

### Counselling

NEET UG counselling is conducted by two bodies:

**1. Medical Counselling Committee (MCC)** — for 15% All India Quota (AIQ)
- Website: mcc.nic.in
- Rounds: Round 1, Round 2, Mop-Up, Stray Vacancy
- AIQ seats include: Central Institutes (AIIMS, JIPMER), deemed universities, ESIC colleges

**2. State Counselling Authorities** — for 85% State Quota
- Each state has its own counselling body
- State domicile required for most state quota seats
- Check your state's counselling authority website

### Counselling Steps
1. Register on mcc.nic.in (for AIQ) or state portal
2. Fill college and course preferences
3. Seat allotment based on rank and preferences
4. Report to allotted college with original documents
5. If allotted a seat, choose: accept and join, or upgrade in next round

## What to Check Before Applying

- Verify your eligibility (age, education, nationality)
- Download and read the complete Information Bulletin from the NTA website
- Ensure your photograph meets NTA specifications (recent, white background, no goggles)
- Check if you need a category certificate (OBC-NCL, EWS, SC/ST)
- Verify the examination cities available in your region
- Save your application number and password securely

## Important Documents for Counselling

- NEET Score Card
- Class 10 and 12 mark sheets and certificates
- Birth certificate
- Category certificate (if applicable)
- Domicile certificate (for state quota)
- Aadhaar card or other photo ID
- Passport-size photographs (same as application)
- Migration certificate (if applicable)

## Official Source

Use the official source for notifications, dates, answer keys, results, and counselling: [NEET NTA Portal](https://neet.nta.nic.in) and [MCC Counselling](https://mcc.nic.in). Blog-Ghar does not guarantee a deadline or vacancy; verify the page before taking action.

## Frequently Asked Questions

**Q: Can I appear for NEET in two languages?**
A: You choose one language for the exam. English and Hindi are available at all centres. Regional languages are available at select centres.

**Q: Is there negative marking?**
A: Yes. −1 mark for each incorrect answer. Each correct answer earns +4 marks.

**Q: How many times can I appear for NEET?**
A: There is no limit on the number of attempts. You can appear for NEET every year until you qualify.

**Q: When does counselling start?**
A: AIQ counselling through MCC typically starts 2-3 months after the result. State counselling timelines vary by state.`,
  },
  {
    title: "JEE Main: Official NTA Exam Pattern and Registration Checklist",
    slug: "jee-main-official-registration-guide",
    category: "India Exams",
    focusKeyword: "JEE Main NTA registration",
    excerpt: "A comprehensive checklist for JEE Main application, exam pattern, session selection, and preparation from official NTA sources.",
    sourceUrl: "https://jeemain.nta.nic.in/",
    body: `JEE Main is the entrance examination for admission to NITs, IIITs, CFTIs, and serves as the qualifying exam for JEE Advanced (IITs). Conducted by the National Testing Agency (NTA), JEE Main is held twice a year (Session 1 in January, Session 2 in April), and your best score is considered for ranking.

## Official Portal

The official portal is [jeemain.nta.nic.in](https://jeemain.nta.nic.in). The NTA website [nta.ac.in](https://nta.ac.in) also hosts notifications.

## Registration Process

**Step 1: NTA Registration**
- Visit jeemain.nta.nic.in → "New Registration"
- Enter personal details: name (as on Class 10 certificate), date of birth, gender, category, contact details
- Create a password and security question
- Note your application number

**Step 2: Fill Application Form**
- Log in and select the session(s): Session 1 (January), Session 2 (April), or both
- Enter personal, educational, and contact details
- Select examination city (4 preferences for each session)
- Upload photograph (10 KB-200 KB, recent) and signature (4 KB-30 KB)

**Step 3: Fee Payment**

| Category | Session 1 | Both Sessions |
|----------|-----------|---------------|
| General / EWS / OBC-NCL | ₹1,000 | ₹2,000 |
| SC / ST / PwBD | ₹500 | ₹1,000 |
| Female (all categories) | ₹500 | ₹1,000 |
| Payment | Online (UPI, Net Banking, Cards) | |

**Step 4: Confirmation**
- Download the confirmation page
- Verify all details — especially name, date of birth, and category
- Use the correction window (if available) to fix any errors

## JEE Main Exam Pattern

### Paper 1: B.E./B.Tech

| Subject | Section A (MCQ) | Section B (Numerical) | Total (Attempt) |
|---------|----------------|----------------------|-----------------|
| Physics | 20 (all) | 10 (attempt 5) | 20 |
| Chemistry | 20 (all) | 10 (attempt 5) | 20 |
| Mathematics | 20 (all) | 10 (attempt 5) | 20 |
| **Total** | **60** | **30** | **60** |

- **Section A:** 4 options each, +4 correct, −1 incorrect
- **Section B:** Numerical type, +4 correct, −1 incorrect (no negative for unattempted)
- **Total Marks:** 300
- **Duration:** 3 hours (3.5 hours for PwD)
- **Mode:** Computer-Based Test (CBT)

### Paper 2A: B.Arch

| Section | Questions | Marks |
|---------|-----------|-------|
| Mathematics | 20 + 10 (Section B) | 100 |
| Aptitude | 50 | 200 |
| Drawing | 2 | 100 |
| **Total** | | **400** |

### Paper 2B: B.Planning

| Section | Questions | Marks |
|---------|-----------|-------|
| Mathematics | 20 + 10 (Section B) | 100 |
| Aptitude | 50 | 200 |
| Planning | 25 | 100 |
| **Total** | | **400** |

## Eligibility

| Requirement | Details |
|-------------|---------|
| Education | Class 12 (or equivalent) with Physics, Chemistry, Mathematics |
| Minimum Marks | No minimum for JEE Main (but qualifying JEE Advanced requires 75% in Class 12 or top 20 percentile) |
| Age | No age limit for JEE Main |
| Attempts | 3 consecutive years (appearing in both sessions of one year = 1 attempt) |

## Session Strategy

- **Session 1 (January):** Attempt early to gauge preparation level. If score is good, focus on JEE Advanced. If not, prepare for Session 2.
- **Session 2 (April):** Use Session 1 experience to improve. Your best of two scores is considered.
- **Both Sessions:** Recommended for most candidates — gives two attempts with 3-month gap.

## What to Check Before Applying

- Ensure your name and date of birth match your Class 10 certificate exactly
- Select appropriate category (General/OBC/SC/ST/EWS) with valid certificate
- Choose examination cities wisely — select cities you can easily travel to
- If applying for Paper 2 (B.Arch/B.Planning), ensure you have the required subjects in Class 12
- Download the Information Bulletin from the NTA website for complete rules
- Keep your Class 12 mark sheet ready for filling educational details

## Official Source

Use the official source for notifications, dates, admit cards, answer keys, and results: [JEE Main NTA Portal](https://jeemain.nta.nic.in). Blog-Ghar does not guarantee a deadline or vacancy; verify the page before taking action.

## Frequently Asked Questions

**Q: Can I appear for both Session 1 and Session 2?**
A: Yes. You can register for one or both sessions. Your best score is considered for ranking.

**Q: Is there negative marking in Section B?**
A: Yes. −1 mark per wrong answer in Section B (numerical type) as well.

**Q: Can I change my examination city after applying?**
A: No. You must select your preferred cities at the time of application. Choose carefully.

**Q: Do I need to appear for both Paper 1 and Paper 2?**
A: No. Paper 1 is for B.E./B.Tech. Paper 2A/2B is for B.Arch/B.Planning. Apply for the relevant paper based on your target course.`,
  },
  {
    title: "IBPS PO and Clerk: Official Recruitment Calendar and Application Guide",
    slug: "ibps-po-clerk-official-guide",
    category: "India Exams",
    focusKeyword: "IBPS PO Clerk official",
    excerpt: "How to verify IBPS banking recruitment notices, application process, participating banks, and prepare from the official exam pattern.",
    sourceUrl: "https://www.ibps.in/",
    body: `The Institute of Banking Personnel Selection (IBPS) conducts recruitment examinations for Probationary Officers (PO), Clerk, and Specialist Officers across 11 participating public-sector banks. Over 8-10 lakh candidates apply for each cycle. This guide covers the official IBPS portal, application process, exam structure, and preparation essentials.

## Official Portal

The IBPS official website is [ibps.in](https://www.ibps.in). Key pages:
- **Recruitment Calendar:** Announces all examination schedules for the year
- **CRP PO/MT:** Probationary Officer / Management Trainee recruitment
- **CRP Clerks:** Clerical cadre recruitment
- **CRP SPL:** Specialist Officers recruitment
- **Helpdesk:** For application queries

## IBPS Recruitment Calendar

IBPS publishes an annual calendar (usually in June-July) listing all examinations:

| Exam | Notification | Prelims | Mains | Interview |
|------|-------------|---------|-------|-----------|
| IBPS PO | August - September | October | November - December | February - March |
| IBPS Clerk | September - October | December | January | — |
| IBPS SO | October - November | December | January | February - March |

**Note:** Dates may shift. Always check ibps.in for the latest calendar.

## Application Process

**Step 1: IBPS Registration**
- Visit ibps.in → "New Registration"
- Enter basic details: name, email, mobile number
- Create a registration number and password

**Step 2: Apply for CRP PO/MT or CRP Clerks**
- Log in and select the relevant recruitment
- Fill personal, educational, and category details
- Select examination state and city (pref1 and pref2)
- Upload photograph (20 KB-50 KB) and signature (10 KB-20 KB)
- Pay fee

**Step 3: Fee Structure**

| Category | Fee |
|----------|-----|
| SC / ST / PwBD / Ex-SM | ₹175 |
| All Others | ₹850 |
| Payment | Online (Debit Card, Credit Card, Net Banking, UPI) |

**Step 4: Confirmation**
- Download the e-receipt and application printout
- Verify all details — check for spelling errors in name, date of birth, category

## Participating Banks

11 public-sector banks participate in IBPS recruitment:
Bank of Baroda, Bank of India, Bank of Maharashtra, Canara Bank, Central Bank of India, Indian Bank, Indian Overseas Bank, Punjab & Sind Bank, Punjab National Bank, UCO Bank, Union Bank of India

**Note:** SBI conducts its own separate recruitment and does not participate in IBPS.

## Exam Pattern

### PO Prelims

| Subject | Questions | Marks | Duration |
|---------|-----------|-------|----------|
| English Language | 30 | 30 | 60 minutes (composite) |
| Quantitative Aptitude | 35 | 35 | |
| Reasoning Ability | 35 | 35 | |
| **Total** | **100** | **100** | **60 minutes** |

Negative marking: 0.25 per wrong answer. Sectional timing: None.

### PO Mains

| Subject | Questions | Marks | Duration |
|---------|-----------|-------|----------|
| Reasoning & Computer Aptitude | 45 | 60 | 60 min |
| General/Economy/Banking Awareness | 40 | 40 | 35 min |
| English Language | 35 | 40 | 40 min |
| Data Analysis & Interpretation | 35 | 60 | 45 min |
| **Total (Objective)** | **155** | **200** | **180 min** |
| English (Descriptive) | 2 | 50 | 30 min |

### PO Interview
100 marks. Evaluates banking awareness, communication, personality, and suitability.

**Final Merit:** Mains (250) + Interview (100) = 350 marks

### Clerk Pattern
Similar to PO but without interview. Final merit based on Mains marks only.

## What to Check Before Applying

- Verify you meet age criteria: 20-30 years for PO (General), 28-33 for Clerk (varies)
- Check category-wise age relaxation
- Ensure you have a valid graduation degree
- Read the notification for participating banks and their specific requirements
- Keep all documents ready before the application deadline
- Apply at least 5-7 days before the deadline to avoid last-day server issues

## Eligibility

| Requirement | PO | Clerk |
|-------------|-----|-------|
| Education | Graduate from recognized university | Graduate from recognized university |
| Age (General) | 20-30 years | 20-28 years |
| Computer Literacy | Required | Required |
| Language Proficiency | Required (official language of the state) | Required |

## Preparation Strategy

1. Start with the official notification — note the exact exam pattern and syllabus
2. Focus on the four sections: Reasoning, Quantitative Aptitude, English, General Awareness
3. Solve previous year papers from ibps.in (available in the helpdesk section)
4. Take mock tests regularly — IBPS pattern is consistent and predictable
5. For PO: start Mains preparation alongside Prelims (gap is only 2-3 months)
6. For Clerk: focus on speed and accuracy (higher question volume, lower difficulty)

## Official Source

Use the official source for notifications, calendar, application status, and results: [IBPS Official Website](https://www.ibps.in). Blog-Ghar does not guarantee a deadline or vacancy; verify the page before taking action.`,
  },
  {
    title: "RBI Grade B: Official Recruitment Notice and Phase-Wise Study Plan",
    slug: "rbi-grade-b-official-guide",
    category: "India Exams",
    focusKeyword: "RBI Grade B official",
    excerpt: "Use RBI's own recruitment notices to plan Grade B preparation — covering phases, syllabus, eligibility, and study strategy.",
    sourceUrl: "https://opportunities.rbi.org.in/",
    body: `The Reserve Bank of India (RBI) conducts Grade B (Officer in Grade B DR — General/DEPR/DSIM) recruitment annually. It is one of the most prestigious banking examinations in India, offering a starting salary of approximately ₹1,08,000 per month. The recruitment is rigorous — three phases of examination followed by an interview.

## Official Portal

RBI recruitment notifications are published on [opportunities.rbi.org.in](https://opportunities.rbi.org.in). This portal hosts:
- Official notifications and corrigenda
- Phase-wise exam schedules
- Syllabus details
- Admit card downloads
- Result declarations

## Key Dates (Typical Cycle)

| Event | Timeline |
|-------|----------|
| Notification | May - June |
| Application Deadline | ~4 weeks from notification |
| Phase I Exam | July - August |
| Phase I Result | August - September |
| Phase II Exam | September - October |
| Phase II Result | November - December |
| Interview | January - February |
| Final Result | February - March |

## Application Process

**Step 1: RBI Registration**
- Visit opportunities.rbi.org.in → "Opprtunities" → Select Grade B notification
- Click "Apply Online" — redirected to RBI's application portal
- Register with email, mobile number, and basic details

**Step 2: Fill Application**
- Complete personal, educational, and category details
- Select examination centre
- Upload photograph and signature
- Pay fee

**Step 3: Fee Structure**

| Category | Fee |
|----------|-----|
| General / OBC | ₹850 |
| SC / ST / PwBD / Ex-SM | ₹100 |
| Staff candidates | Nil |
| Payment | Online (Net Banking, Cards, UPI) |

## Eligibility

| Requirement | Grade B (DR) General |
|-------------|---------------------|
| Education | Graduate in any discipline with minimum 60% marks (50% for SC/ST/PwBD) |
| Age | 21-30 years (General) |
| Experience | No experience required |

**For DEPR (Department of Economic and Policy Research):** Master's degree in Economics or a related field.
**For DSIM (Department of Statistics and Information Management):** Master's degree in Statistics/Mathematical Economics/Econometrics.

## Three-Phase Examination

### Phase I (Preliminary)

| Paper | Sections | Questions | Marks | Duration |
|-------|----------|-----------|-------|----------|
| General Awareness | 80 | 80 | 25 min |
| English Language | 30 | 30 | 25 min |
| Quantitative Aptitude | 30 | 30 | 25 min |
| Reasoning | 30 | 30 | 25 min |
| **Total** | | **200** | **120 min** |

Negative marking: 0.25 per wrong answer. Phase I is qualifying — marks are NOT added to final merit.

### Phase II (Mains)

| Paper | Subject | Marks | Duration |
|-------|---------|-------|----------|
| Paper I | Economic and Social Issues | 100 | 90 min |
| Paper II | English (Writing Skills) | 100 | 90 min |
| Paper III | Optional (Finance & Management / Economics / Statistics) | 100 | 90 min |

Phase II is descriptive + objective. Marks from Phase II count for final merit (50% weightage).

### Interview
Worth 50 marks. Evaluates knowledge of economics, banking, current affairs, and personality.

**Final Merit:** Phase II (300) + Interview (50) = 350 marks

## Preparation Strategy

### Phase I Focus
- General Awareness: RBI circulars, economic survey, budget, banking news, current affairs
- English: Reading comprehension, error spotting, vocabulary
- Quantitative Aptitude: DI, arithmetic, number series
- Reasoning: Puzzles, syllogism, inequality, coding-decoding

### Phase II Focus
- Economic and Social Issues: Indian economy, development, globalization, social sector, poverty
- English (Writing): Essay writing, précis, comprehension, letter/application writing
- Optional: Choose based on your background (Finance & Management is most popular)

### Study Resources
- RBI Annual Reports and monetary policy statements
- Economic Survey of India
- Union Budget documents
- NCERT Economics (Class 11-12)
- Standard banking awareness books

## What to Check Before Applying

- Confirm you meet the minimum educational qualification (60% aggregate for General)
- Check if DEPR or DSIM is relevant to your academic background
- Verify the age limit and category relaxation
- Read the complete notification — RBI often includes specific instructions
- Keep all certificates ready for verification during interview

## Official Source

Use the official source for notifications, syllabus, dates, and results: [RBI Opportunities Portal](https://opportunities.rbi.org.in). Blog-Ghar does not guarantee a deadline or vacancy; verify the page before taking action.`,
  },
  {
    title: "GATE: Official IIT Examination Portal, Papers, and Score Validity",
    slug: "gate-exam-official-portal-guide",
    category: "India Exams",
    focusKeyword: "GATE official portal",
    excerpt: "A source-first GATE guide for candidates comparing papers, score validity, M.Tech admission, and PSU recruitment information.",
    sourceUrl: "https://gate.iitb.ac.in/",
    body: `The Graduate Aptitude Test in Engineering (GATE) is a national-level examination conducted by one of the IITs or IISc on a rotational basis. GATE scores are used for M.Tech/M.E./M.Arch admissions and for recruitment in public-sector undertakings (PSUs). Over 8-10 lakh candidates register annually across 30 papers.

## Official Portal

The organising institute changes each year. The current organising institute's website is the primary source:
- [gate.iitb.ac.in](https://gate.iitb.ac.in) (IIT Bombay — check for the latest year)
- GATE Online Application Processing System (GOAPS): [appsgate.iitb.ac.in](https://appsgate.iitb.ac.in)

## Application Process

**Step 1: GOAPS Registration**
- Visit the GOAPS portal → "New Candidate? Register Here"
- Enter name, email, mobile number, password
- You will receive an enrolment ID

**Step 2: Fill Application**
- Log in and fill personal, educational, and category details
- Select GATE paper (choose carefully — only one paper allowed per year)
- Select examination cities (3 preferences: 2 cities in same zone, 1 in different zone)
- Upload photograph (2 KB-200 KB) and signature (5 KB-200 KB)
- Pay fee

**Step 3: Fee Structure**

| Category | Fee |
|----------|-----|
| General / OBC | ₹1,800 |
| SC / ST / PwBD | ₹900 |
| Female (all categories) | ₹900 |
| Payment | Online (Net Banking, Credit/Debit Card, UPI) |

**Step 4: Confirmation**
- Download the confirmation page
- Verify all details — especially paper choice and category
- Corrections allowed during the correction window (usually 1 week after deadline)

## Available Papers (30 Papers)

### Engineering Papers
Civil Engineering (CE), Computer Science (CS), Electrical Engineering (EE), Electronics & Communication (EC), Mechanical Engineering (ME), Instrumentation (IN), Chemical (CH), Aerospace (AE), Agricultural (AG), Biotechnology (BT), Mining (MN), Metallurgical (MT), Textile (TF), Petroleum (PE), Naval Architecture (NA), Production & Industrial (PI)

### Science Papers
Physics (PH), Chemistry (CY), Mathematics (MA), Statistics (ST), Life Sciences (XL)

### Other Papers
Architecture (AR), Ecology & Evolution (EY), Geology & Geophysics (GG), Humanities & Social Sciences (XH), Environmental Science & Engineering (ES), Naval Architecture & Marine Engineering (NM), Biomedical (BM)

## Eligibility

| Requirement | Details |
|-------------|---------|
| Education | Final-year students or graduates in engineering/science/commerce |
| Age | No age limit |
| Nationality | Indian + international (some countries allow GATE score usage) |
| Attempts | Unlimited |

## GATE Score and Validity

- **Score Range:** 0-1000 (normalised across sessions/papers)
- **Validity:** 3 years from result declaration
- **Score Card:** Downloadable from GOAPS portal

### Score Usage

| Purpose | Score Requirement |
|---------|-------------------|
| M.Tech at IITs | 600+ (varies by IIT and department) |
| M.Tech at NITs (CCMT) | 400-600 (varies by NIT) |
| PSU Recruitment | 700+ (varies by PSU) |
| PhD Admission | 500+ (varies by institution) |

## M.Tech Admission Pathways

**1. IIT M.Tech (COAP Portal)**
- Applications: March-April (after GATE results)
- Common Offer Acceptance Portal: [coap.iitd.ac.in](https://coap.iitd.ac.in)
- Selection: GATE score + interview/written test (varies by IIT)

**2. NIT M.Tech (CCMT Portal)**
- Centralized Counselling for M.Tech/M.Arch/M.Plan
- Applications: April-May
- Selection: Based purely on GATE score
- Website: [ccmt.admissions.nic.in](https://ccmt.admissions.nic.in)

## PSU Recruitment Through GATE

Major PSUs that recruit through GATE scores:

| PSU | Approx Vacancies | GATE Papers |
|-----|-----------------|-------------|
| ONGC | 200-300 | Multiple |
| NTPC | 150-200 | EE, ME, CE |
| IOCL | 100-200 | CE, ME, EE, IN |
| BHEL | 50-100 | ME, EE, CE |
| BARC | 100-200 | Multiple |
| HPCL | 50-100 | CE, ME, EE |
| BEL | 30-60 | ECE, CS, EE |
| SAIL | 100-200 | Multiple |
| GAIL | 50-100 | CE, ME, EE |

**Process:** GATE score → shortlist → group discussion/interview → final selection.

## What to Check Before Applying

- Choose your GATE paper carefully — it determines your score and eligibility for M.Tech/PSU
- Ensure your educational background aligns with the paper you choose
- Check if you need a category certificate (OBC-NCL, EWS, SC/ST)
- Verify the exam city options and choose wisely
- Download the information brochure from the organising institute's website
- If applying for international centres, check eligibility and fee structure

## Preparation Strategy

1. Download the official syllabus for your paper from the GOAPS portal
2. Cover the syllabus topic by topic using standard textbooks
3. Solve previous year GATE papers (available on the official site)
4. Focus on high-weightage topics (check previous year analysis)
5. Practice numerical problems using the virtual calculator (on-screen calculator is provided)
6. General Aptitude (15 marks) is compulsory — do not neglect it
7. Take at least 15-20 full-length mocks before the exam

## Official Source

Use the official source for notifications, syllabus, application, results, and score cards: [GATE Official Portal](https://gate.iitb.ac.in) or the year-specific organising institute website. Blog-Ghar does not guarantee a deadline or vacancy; verify the page before taking action.`,
  },
  {
    title: "CTET: Official CBSE Bulletin, Eligibility, and Application Steps",
    slug: "ctet-official-cbse-guide",
    category: "India Exams",
    focusKeyword: "CTET CBSE official",
    excerpt: "Where to find authentic CTET notices, eligibility information, application process, and preparation guidelines from CBSE.",
    sourceUrl: "https://ctet.nic.in/",
    body: `The Central Teacher Eligibility Test (CTET) is conducted by the Central Board of Secondary Education (CBSE) to determine eligibility for teaching positions in Kendriya Vidyalayas, Navodaya Vidyalayas, and as a qualifying criterion for state teacher recruitment. CTET is held twice a year (July and December cycles).

## Official Portal

The CTET official portal is [ctet.nic.in](https://ctet.nic.in). Key pages:
- Notification and information bulletin
- Online application form
- Admit card download
- Answer key and OMR sheet
- Result declaration
- Previous year papers

## Application Process

**Step 1: CTET Registration**
- Visit ctet.nic.in → "Apply Online"
- Fill personal details: name, parents' names, date of birth, gender, category, contact details
- Create login credentials
- Note your registration number

**Step 2: Fill Application**
- Select paper(s): Paper 1 (Classes 1-5), Paper 2 (Classes 6-8), or both
- Select examination centre (city)
- Upload photograph (10 KB-100 KB, recent) and signature (3 KB-30 KB)
- Pay fee

**Step 3: Fee Structure**

| Category | Paper 1 Only | Paper 1 + Paper 2 |
|----------|-------------|-------------------|
| General / OBC | ₹1,000 | ₹1,200 |
| SC / ST / PwBD | ₹500 | ₹600 |
| Payment | Online (Credit/Debit Card, Net Banking, UPI) | |

**Step 4: Confirmation**
- Download the confirmation page
- Verify all details — name, date of birth, paper selection
- Use the correction window to fix errors (if available)

## Eligibility

### Paper 1 (Classes 1-5)

| Requirement | Details |
|-------------|---------|
| Education | Senior Secondary (Class 12) with minimum 50% marks + 2-year Diploma in Elementary Education (D.El.Ed), OR Bachelor of Education (B.Ed), OR equivalent |
| Age | No minimum age limit |

### Paper 2 (Classes 6-8)

| Requirement | Details |
|-------------|---------|
| Education | Graduation with minimum 50% marks + 2-year Diploma in Elementary Education, OR Bachelor of Education (B.Ed), OR 4-year B.El.Ed, OR 2-year Special Education, OR equivalent |
| Age | No minimum age limit |

**Note:** Educational qualification requirements vary. Check the CTET information bulletin for the exact list of accepted qualifications.

## Exam Structure

### Paper 1 (Classes 1-5)

| Subject | Questions | Marks |
|---------|-----------|-------|
| Child Development & Pedagogy (CDP) | 30 | 30 |
| Language I | 30 | 30 |
| Language II | 30 | 30 |
| Mathematics | 30 | 30 |
| Environmental Studies (EVS) | 30 | 30 |
| **Total** | **150** | **150** |

### Paper 2 (Classes 6-8)

| Subject | Questions | Marks |
|---------|-----------|-------|
| Child Development & Pedagogy (CDP) | 30 | 30 |
| Language I | 30 | 30 |
| Language II | 30 | 30 |
| Math & Science OR Social Studies | 60 | 60 |
| **Total** | **150** | **150** |

**General Information:**
- No negative marking
- Duration: 2.5 hours (150 minutes)
- Mode: Offline (pen and paper)
- Qualifying marks: 90/150 (60%) for General, 82/150 (55%) for SC/ST/OBC/PwBD
- Certificate valid for 7 years

## Key Dates (Typical)

| Event | July Cycle | December Cycle |
|-------|-----------|---------------|
| Notification | April - May | September - October |
| Application Deadline | May - June | October - November |
| Exam Date | July | December |
| Result | September | February |

## What to Check Before Applying

- Verify you meet the educational qualification for Paper 1, Paper 2, or both
- Read the complete information bulletin from ctet.nic.in
- Check if the examination centre is convenient for you to reach
- If appearing for both papers, ensure you have adequate preparation time
- Keep your educational certificates ready for verification
- Note that CTET certificate is valid for 7 years — apply even if you are not immediately seeking employment

## Preparation Essentials

1. Download the CTET syllabus from the official bulletin
2. Focus on Child Development & Pedagogy (CDP) — it is the most conceptual section
3. For Paper 1: study NCERT textbooks for Classes 3-5 (Math, EVS, English, Hindi)
4. For Paper 2: study NCERT textbooks for Classes 6-8 (Math, Science, Social Studies)
5. Solve at least 10 previous year CTET papers
6. Practice time management — 150 questions in 150 minutes means 1 minute per question
7. There is no negative marking — attempt every question

## Official Source

Use the official source for notifications, dates, eligibility, application, admit cards, and results: [CTET CBSE Portal](https://ctet.nic.in). Blog-Ghar does not guarantee a deadline or vacancy; verify the page before taking action.

## Frequently Asked Questions

**Q: How many attempts are allowed for CTET?**
A: There is no limit on attempts. You can appear for every CTET cycle (twice yearly) until you qualify.

**Q: Is CTET accepted by all states?**
A: CTET is mandatory for KV and NV. For state government schools, each state has its own TET. However, many states accept CTET as well.

**Q: Can I appear for both Paper 1 and Paper 2?**
A: Yes. You can register for both papers in the same cycle by paying separate fees.

**Q: What is the CTET certificate validity?**
A: 7 years from the date of result declaration.`,
  },
];
