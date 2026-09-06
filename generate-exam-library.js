const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, 'exam-blog-library.txt');

const exams = [
  { num: 5, name: "IELTS (International English Language Testing System)", country: "United Kingdom / Global", category: "English Proficiency", short: "IELTS", niche: "English Language Proficiency", articles: [
    {type:"Complete Exam Guide", intent:"Informational - complete understanding of IELTS structure, modules, bands, registration", kw:"IELTS exam guide 2024 2025", slug:"ielts-complete-guide-2024-2025", title:"Complete IELTS Guide 2024-2025: Structure, Modules, Bands, Registration & Test Dates"},
    {type:"Preparation Strategy / Study Plan", intent:"Informational/Transactional - structured preparation plan for Band 7-8", kw:"IELTS study plan Band 8 preparation", slug:"ielts-study-plan-band-7-8-preparation-2024-2025", title:"IELTS Study Plan 2024-2025: 6-Week Strategy for Band 7-8+"},
    {type:"Subject-Specific Deep Dive", intent:"Informational - master IELTS Speaking & Writing for high bands", kw:"IELTS Speaking Writing Band 7 8 strategies", slug:"ielts-speaking-writing-band-7-8-strategies", title:"IELTS Speaking & Writing Mastery: Band 7-8+ Strategies for 2024-2025"},
    {type:"Comparison Guide", intent:"Informational/Navigational - choose between IELTS vs TOEFL vs PTE vs Duolingo", kw:"IELTS vs TOEFL vs PTE comparison", slug:"ielts-vs-toefl-vs-pte-vs-duolingo-comparison-2024-2025", title:"IELTS vs TOEFL vs PTE vs Duolingo 2024-2025: Complete Comparison & Choice Guide"},
    {type:"Post-Exam Strategy", intent:"Informational/Navigational - score interpretation, TRF, retake, university requirements", kw:"IELTS score interpretation band requirements", slug:"ielts-score-interpretation-band-requirements-retake-strategy", title:"IELTS Score Interpretation 2024-2025: Bands, University Requirements & Retake Strategy"}
  ], official: "British Council, IDP: IELTS Australia, Cambridge English", sections: "Listening (30m, 40q), Reading (60m, 40q), Writing (60m, 2 tasks), Speaking (11-14m, 3 parts)", scoring: "Band 0-9 per section, Overall = average rounded to 0.5", fees: "typically £200-£250 / $215-$250 / ₹16,000-17,000 (varies by country, check official)"},
  { num: 6, name: "GMAT Focus Edition", country: "United States (Global)", category: "Business School Admissions", short: "GMAT Focus", niche: "MBA / Business School", articles: [
    {type:"Complete Exam Guide", intent:"Informational - complete GMAT Focus structure, sections, scoring", kw:"GMAT Focus exam guide 2024 2025", slug:"gmat-focus-complete-guide-2024-2025", title:"Complete GMAT Focus Guide 2024-2025: Structure, Syllabus, Scoring & Registration"},
    {type:"Preparation Strategy", intent:"Informational/Transactional - preparation plan for 705+ GMAT Focus", kw:"GMAT Focus study plan 705 preparation", slug:"gmat-focus-study-plan-705-preparation", title:"GMAT Focus Study Plan 2024-2025: 10-Week Strategy for 705+"},
    {type:"Subject Deep Dive", intent:"Informational - Data Insights mastery (Data Sufficiency, MSR, Graphics)", kw:"GMAT Data Insights strategies", slug:"gmat-focus-data-insights-mastery-2024-2025", title:"GMAT Focus Data Insights Mastery: Data Sufficiency & Multi-Source Reasoning"},
    {type:"Comparison", intent:"Informational - GMAT Focus vs Classic vs GRE for MBA", kw:"GMAT Focus vs GMAT Classic vs GRE", slug:"gmat-focus-vs-classic-vs-gre-2024-2025", title:"GMAT Focus vs Classic vs GRE 2024-2025: Transition & Comparison Guide"},
    {type:"Post-Exam", intent:"Informational - score interpretation, percentile, schools, retake", kw:"GMAT Focus score interpretation MBA admissions", slug:"gmat-focus-score-interpretation-mba-retake-strategy", title:"GMAT Focus Score Interpretation 2024-2025: Percentiles, B-Schools & Retake Strategy"}
  ], official: "GMAC (Graduate Management Admission Council)", sections: "Quantitative Reasoning (21q,45m), Verbal Reasoning (23q,45m), Data Insights (20q,45m)", scoring: "Total 205-805 (10-pt intervals), section 60-90", fees: "~$275 global, check mba.com"},
  { num: 7, name: "LSAT (Law School Admission Test)", country: "United States / Canada", category: "Law School Admissions", short: "LSAT", niche: "Legal Education", articles: [
    {type:"Complete Exam Guide", intent:"Informational - LSAT structure, sections, scoring, registration", kw:"LSAT exam guide 2024 2025", slug:"lsat-complete-guide-2024-2025", title:"Complete LSAT Guide 2024-2025: Structure, Syllabus, Scoring & Registration"},
    {type:"Preparation Strategy", intent:"Informational - study plan for 165+ LSAT", kw:"LSAT study plan 165 preparation", slug:"lsat-study-plan-165-preparation", title:"LSAT Study Plan 2024-2025: 12-Week Strategy for 165+"},
    {type:"Subject Deep Dive", intent:"Informational - Logical Reasoning & Reading Comprehension mastery", kw:"LSAT Logical Reasoning Reading Comprehension strategies", slug:"lsat-logical-reasoning-reading-comprehension-mastery", title:"LSAT Logical Reasoning & Reading Comprehension Mastery 2024-2025"},
    {type:"Comparison", intent:"Informational - LSAT vs GRE for law school", kw:"LSAT vs GRE law school", slug:"lsat-vs-gre-law-school-2024-2025", title:"LSAT vs GRE for Law School 2024-2025: Complete Comparison"},
    {type:"Post-Exam", intent:"Informational - score interpretation, law school admissions, retake", kw:"LSAT score interpretation law school admissions", slug:"lsat-score-interpretation-law-school-admissions-retake", title:"LSAT Score Interpretation 2024-2025: Law School Admissions & Retake Strategy"}
  ], official: "LSAC (Law School Admission Council)", sections: "2x Logical Reasoning (35m each), Reading Comprehension (35m), Argumentative Writing (50m, unscored but sent)", scoring: "120-180 (average ~152), percentile-based", fees: "$238 + Credential Assembly Service"},
  { num: 8, name: "MCAT (Medical College Admission Test)", country: "United States / Canada", category: "Medical School Admissions", short: "MCAT", niche: "Medical Education", articles: [
    {type:"Complete Exam Guide", intent:"Informational - MCAT structure, sections, scoring", kw:"MCAT exam guide 2024 2025", slug:"mcat-complete-guide-2024-2025", title:"Complete MCAT Guide 2024-2025: Structure, Syllabus, Scoring & Registration"},
    {type:"Preparation Strategy", intent:"Informational - 6-month MCAT study plan for 515+", kw:"MCAT study plan 515 preparation", slug:"mcat-study-plan-515-preparation-2024-2025", title:"MCAT Study Plan 2024-2025: 6-Month Strategy for 515+"},
    {type:"Subject Deep Dive", intent:"Informational - CARS and science sections mastery", kw:"MCAT CARS science strategies", slug:"mcat-cars-science-mastery-2024-2025", title:"MCAT CARS & Science Mastery: Passage Strategies for 127+"},
    {type:"Common Mistakes", intent:"Informational - avoid content and strategy errors", kw:"MCAT common mistakes retake strategy", slug:"mcat-common-mistakes-retake-strategy", title:"MCAT Common Mistakes & Retake Strategy 2024-2025"},
    {type:"Post-Exam", intent:"Informational - score interpretation, med school admissions, next steps", kw:"MCAT score interpretation medical school", slug:"mcat-score-interpretation-medical-school-admissions", title:"MCAT Score Interpretation 2024-2025: Medical School Admissions & Next Steps"}
  ], official: "AAMC (Association of American Medical Colleges)", sections: "Chem/Phys (59q,95m), CARS (53q,90m), Bio/Biochem (59q,95m), Psych/Soc (59q,95m)", scoring: "472-528 (118-132 per section, avg 500)", fees: "$330-$380 + prep"},
  { num: 9, name: "NCLEX-RN (National Council Licensure Examination - Registered Nurse)", country: "United States", category: "Nursing Licensure", short: "NCLEX-RN", niche: "Healthcare Licensure", articles: [
    {type:"Complete Exam Guide", intent:"Informational - NCLEX-RN structure, NGN, registration", kw:"NCLEX RN exam guide 2024 2025", slug:"nclex-rn-complete-guide-2024-2025", title:"Complete NCLEX-RN Guide 2024-2025: Next Gen, Structure, Registration & Scoring"},
    {type:"Preparation Strategy", intent:"Informational - study plan for first-time pass", kw:"NCLEX RN study plan preparation", slug:"nclex-rn-study-plan-first-time-pass-2024-2025", title:"NCLEX-RN Study Plan 2024-2025: 8-Week Strategy for First-Time Pass"},
    {type:"Subject Deep Dive", intent:"Informational - NGN item types & clinical judgment", kw:"NCLEX Next Gen clinical judgment strategies", slug:"nclex-rn-next-gen-clinical-judgment-strategies", title:"NCLEX-RN Next Gen: Clinical Judgment & New Item Types Mastery"},
    {type:"Practice & Review", intent:"Informational - question banks, CAT, practice tests", kw:"NCLEX practice tests question banks", slug:"nclex-rn-practice-tests-question-banks-cats", title:"NCLEX-RN Practice Tests & Question Banks: CAT Strategy 2024-2025"},
    {type:"Post-Exam", intent:"Informational - results, retake, licensing next steps", kw:"NCLEX results retake licensing", slug:"nclex-rn-results-retake-licensing-next-steps", title:"NCLEX-RN Results & Next Steps: Pass Rates, Retake Strategy & Licensing 2024-2025"}
  ], official: "NCSBN (National Council of State Boards of Nursing) + Pearson VUE", sections: "85-150 questions (CAT adaptive), 5 hours max, NGN case studies, bow-tie, trend, matrix", scoring: "Pass/Fail via computerized adaptive testing", fees: "$200 exam + state board fees"},
  { num: 10, name: "CPA (Certified Public Accountant) Exam", country: "United States", category: "Professional Certification / Accounting", short: "CPA", niche: "Accounting & Finance", articles: [
    {type:"Complete Exam Guide", intent:"Informational - CPA Evolution structure, sections, requirements", kw:"CPA exam guide 2024 2025 Evolution", slug:"cpa-complete-guide-2024-2025-evolution", title:"Complete CPA Guide 2024-2025: Evolution Model, Sections & Requirements"},
    {type:"Preparation Strategy", intent:"Informational - study plan per section (AUD, FAR, REG + Discipline)", kw:"CPA study plan AUD FAR REG preparation", slug:"cpa-study-plan-aud-far-reg-2024-2025", title:"CPA Study Plan 2024-2025: Section-by-Section Strategy for All 4 Parts"},
    {type:"Subject Deep Dive", intent:"Informational - FAR and AUD mastery", kw:"CPA FAR AUD strategies", slug:"cpa-far-aud-mastery-2024-2025", title:"CPA FAR & AUD Mastery: Complex Accounting & Auditing Strategies"},
    {type:"Discipline Choice", intent:"Informational - choose BAR, ISC, TCP discipline", kw:"CPA discipline choice BAR ISC TCP", slug:"cpa-discipline-choice-bar-isc-tcp-2024-2025", title:"CPA Discipline Choice 2024-2025: BAR vs ISC vs TCP Decision Guide"},
    {type:"Post-Exam", intent:"Informational - scores, licensing, experience, career", kw:"CPA score licensing career", slug:"cpa-score-licensing-career-next-steps", title:"CPA Scores, Licensing & Career: Next Steps After Passing 2024-2025"}
  ], official: "AICPA + NASBA + Prometric", sections: "Core: AUD (4h), FAR (4h), REG (4h) + Discipline: BAR/ISC/TCP (4h each) = 16 hours", scoring: "0-99 per section, 75 to pass", fees: "~$238 per section + state board fees"},
  { num: 11, name: "CFA Level I (Chartered Financial Analyst)", country: "Global", category: "Professional Certification / Finance", short: "CFA Level I", niche: "Finance & Investment", articles: [
    {type:"Complete Exam Guide", intent:"Informational - CFA L1 structure, topics, registration", kw:"CFA Level 1 exam guide 2024 2025", slug:"cfa-level-1-complete-guide-2024-2025", title:"Complete CFA Level I Guide 2024-2025: Structure, Topics & Registration"},
    {type:"Preparation Strategy", intent:"Informational - 6-month CFA L1 study plan 300 hours", kw:"CFA Level 1 study plan 300 hours", slug:"cfa-level-1-study-plan-300-hours-2024-2025", title:"CFA Level I Study Plan 2024-2025: 6-Month, 300-Hour Strategy"},
    {type:"Subject Deep Dive", intent:"Informational - Ethics, FRA, Quant mastery", kw:"CFA Ethics FRA Quant strategies", slug:"cfa-level-1-ethics-fra-quant-mastery", title:"CFA Level I: Ethics, FRA & Quantitative Mastery 2024-2025"},
    {type:"Common Mistakes", intent:"Informational - avoid Level I pitfalls, retake strategy", kw:"CFA Level 1 common mistakes retake", slug:"cfa-level-1-common-mistakes-retake-strategy", title:"CFA Level I Common Mistakes & Retake Strategy 2024-2025"},
    {type:"Post-Exam", intent:"Informational - results, Level II, career path", kw:"CFA Level 1 results Level 2 career", slug:"cfa-level-1-results-level-2-career-path", title:"CFA Level I Results & Next Steps: Level II & Charter Path 2024-2025"}
  ], official: "CFA Institute", sections: "180 MCQs, 2 sessions × 135m, 10 topic areas", scoring: "Pass/Fail, MPS ~70% (never disclosed)", fees: "$940-$1250 early/standard + enrollment"},
  { num: 12, name: "PMP (Project Management Professional)", country: "Global", category: "Professional Certification / Management", short: "PMP", niche: "Project Management", articles: [
    {type:"Complete Exam Guide", intent:"Informational - PMP structure, domains, eligibility", kw:"PMP exam guide 2024 2025", slug:"pmp-complete-guide-2024-2025", title:"Complete PMP Guide 2024-2025: Domains, Eligibility & Registration"},
    {type:"Preparation Strategy", intent:"Informational - 35-hour training + study plan", kw:"PMP study plan 35 hours preparation", slug:"pmp-study-plan-35-hours-2024-2025", title:"PMP Study Plan 2024-2025: 10-Week Strategy for First-Time Pass"},
    {type:"Subject Deep Dive", intent:"Informational - Agile, People, Process, Business domains", kw:"PMP Agile People Process strategies", slug:"pmp-agile-people-process-mastery", title:"PMP Domain Mastery: People, Process & Business Environment 2024-2025"},
    {type:"Practice Strategy", intent:"Informational - mock exams, question banks, exam-day tactics", kw:"PMP practice exams mock tests", slug:"pmp-practice-exams-mock-tests-tactics", title:"PMP Practice Exams & Mock Tests: Exam-Day Tactics 2024-2025"},
    {type:"Post-Exam", intent:"Informational - certification, PDUs, career", kw:"PMP certification career PDUs", slug:"pmp-certification-career-pdus-next-steps", title:"After PMP: Certification, PDUs & Career Growth 2024-2025"}
  ], official: "PMI (Project Management Institute) + Pearson VUE", sections: "180 questions (175 scored), 230 minutes, 3 domains", scoring: "Pass/Fail (proficiency levels)", fees: "$405 member / $555 non-member"},
  { num: 13, name: "JEE Advanced (Joint Entrance Examination - Advanced)", country: "India", category: "Engineering Entrance", short: "JEE Advanced", niche: "Indian Engineering Education", articles: [
    {type:"Complete Exam Guide", intent:"Informational - JEE Advanced structure, eligibility, syllabus", kw:"JEE Advanced guide 2024 2025", slug:"jee-advanced-complete-guide-2024-2025", title:"Complete JEE Advanced Guide 2024-2025: Eligibility, Pattern, Syllabus & Dates"},
    {type:"Preparation Strategy", intent:"Informational - 1-2 year preparation plan for IIT", kw:"JEE Advanced preparation strategy IIT", slug:"jee-advanced-preparation-strategy-iit-2024-2025", title:"JEE Advanced Preparation Strategy 2024-2025: 1-Year Plan for IIT Admit"},
    {type:"Subject Deep Dive", intent:"Informational - Physics, Chemistry, Maths mastery", kw:"JEE Advanced Physics Chemistry Maths strategies", slug:"jee-advanced-pcm-mastery-2024-2025", title:"JEE Advanced PCM Mastery: Physics, Chemistry & Maths Strategies 2024-2025"},
    {type:"Mistakes & Tactics", intent:"Informational - avoid rank-deciding mistakes", kw:"JEE Advanced common mistakes rank", slug:"jee-advanced-common-mistakes-rank-tactics", title:"JEE Advanced Common Mistakes & Rank-Boosting Tactics 2024-2025"},
    {type:"Post-Exam", intent:"Informational - results, JoSAA counseling, IIT choice", kw:"JEE Advanced result JoSAA counseling IIT", slug:"jee-advanced-result-josaa-counseling-iit-choice", title:"JEE Advanced Results & JoSAA Counseling: IIT Choice Guide 2024-2025"}
  ], official: "IIT + NTA (JEE Advanced Organizing IIT)", sections: "2 papers × 3h, Physics/Chemistry/Maths, MCQs/Numerical/Integer", scoring: "Rank based, no fixed cutoff, subject-wise & aggregate", fees: "₹1600-3200 (JEE Main required first)"},
  { num: 14, name: "NEET UG (National Eligibility cum Entrance Test - Undergraduate)", country: "India", category: "Medical Entrance", short: "NEET UG", niche: "Indian Medical Education", articles: [
    {type:"Complete Exam Guide", intent:"Informational - NEET UG structure, eligibility, syllabus", kw:"NEET UG guide 2024 2025", slug:"neet-ug-complete-guide-2024-2025", title:"Complete NEET UG Guide 2024-2025: Eligibility, Pattern, Syllabus & Dates"},
    {type:"Preparation Strategy", intent:"Informational - 1-year NEET preparation plan", kw:"NEET preparation strategy MBBS", slug:"neet-ug-preparation-strategy-2024-2025", title:"NEET UG Preparation Strategy 2024-2025: 1-Year Plan for MBBS Admit"},
    {type:"Subject Deep Dive", intent:"Informational - Biology, Physics, Chemistry mastery", kw:"NEET Biology Physics Chemistry strategies", slug:"neet-ug-biology-physics-chemistry-mastery", title:"NEET UG BPC Mastery: Biology, Physics & Chemistry for 650+"},
    {type:"Last-Minute", intent:"Informational - 30-day revision & mock strategy", kw:"NEET last 30 days revision strategy", slug:"neet-ug-last-30-days-revision-strategy", title:"NEET UG Last 30 Days: Revision & Mock Test Strategy 2024-2025"},
    {type:"Post-Exam", intent:"Informational - results, counseling, college predictor", kw:"NEET result counseling college predictor", slug:"neet-ug-result-counseling-college-predictor", title:"NEET UG Results & Counseling: All India & State Quota Guide 2024-2025"}
  ], official: "NTA (National Testing Agency) + NMC", sections: "720 marks, 200 questions (180 to attempt), 3h20m, Physics/Chemistry/Biology", scoring: "720 max, -1 negative, percentile & rank", fees: "₹1700 general / ₹1000 reserved"},
  { num: 15, name: "UPSC Civil Services Examination (IAS/IPS)", country: "India", category: "Civil Services / Government Recruitment", short: "UPSC CSE", niche: "Indian Civil Services", articles: [
    {type:"Complete Exam Guide", intent:"Informational - UPSC CSE Prelims, Mains, Interview structure", kw:"UPSC CSE guide 2024 2025 IAS", slug:"upsc-cse-complete-guide-2024-2025", title:"Complete UPSC CSE Guide 2024-2025: Prelims, Mains, Interview & Eligibility"},
    {type:"Preparation Strategy", intent:"Informational - 1-year integrated preparation plan", kw:"UPSC preparation strategy 1 year IAS", slug:"upsc-cse-preparation-strategy-1-year-2024-2025", title:"UPSC CSE Preparation Strategy 2024-2025: 1-Year Integrated Plan for IAS"},
    {type:"Subject Deep Dive", intent:"Informational - General Studies & Optional mastery", kw:"UPSC General Studies Optional strategies", slug:"upsc-cse-general-studies-optional-mastery", title:"UPSC CSE General Studies & Optional Mastery: Prelims + Mains 2024-2025"},
    {type:"Mistakes & Revision", intent:"Informational - avoid failure patterns, revision methodology", kw:"UPSC common mistakes revision strategy", slug:"upsc-cse-common-mistakes-revision-strategy", title:"UPSC CSE Common Mistakes & Revision Methodology 2024-2025"},
    {type:"Post-Exam", intent:"Informational - results, service allocation, career path", kw:"UPSC result service allocation IAS IPS", slug:"upsc-cse-result-service-allocation-ias-ips", title:"UPSC CSE Results & Service Allocation: IAS/IPS Career Path 2024-2025"}
  ], official: "UPSC (Union Public Service Commission)", sections: "Prelims (2 papers), Mains (9 papers including Essay, GS 1-4, Optional 2, Languages), Interview (275m)", scoring: "Prelims 400 qualifying for Mains, Mains 1750 + Interview 275 = 2025", fees: "₹100 general / 0 for reserved/female"},
];

const moreExams = [
  { num: 16, name: "CAT (Common Admission Test) - IIMs", country: "India", category: "MBA Entrance", short: "CAT", niche: "Indian Management Education", articles: [
    {type:"Complete Exam Guide", intent:"Informational - CAT VARC, DILR, QA structure", kw:"CAT exam guide 2024 2025 IIM", slug:"cat-complete-guide-2024-2025", title:"Complete CAT Guide 2024-2025: VARC, DILR, QA & IIM Admissions"},
    {type:"Preparation Strategy", intent:"Informational - 6-month CAT 99 percentile plan", kw:"CAT preparation 99 percentile strategy", slug:"cat-preparation-99-percentile-2024-2025", title:"CAT Preparation Strategy 2024-2025: 6-Month Plan for 99 Percentile"},
    {type:"Section Mastery", intent:"Informational - VARC + DILR + QA deep dive", kw:"CAT VARC DILR QA strategies", slug:"cat-varc-dilr-qa-mastery-2024-2025", title:"CAT Section Mastery: VARC, DILR & QA for 99+ 2024-2025"},
    {type:"Mock & Analysis", intent:"Informational - mock test analysis & percentile prediction", kw:"CAT mock test analysis percentile", slug:"cat-mock-test-analysis-percentile-prediction", title:"CAT Mocks & Analysis: Percentile Prediction & Strategy 2024-2025"},
    {type:"Post-Exam", intent:"Informational - results, WAT/PI, IIM shortlist", kw:"CAT result WAT PI IIM admission", slug:"cat-result-wat-pi-iim-admission-2024-2025", title:"CAT Results & IIM Admissions: WAT/PI & Final Selection 2024-2025"}
  ], official: "IIMs + TCS iON", sections: "2 hours, 3 sections: VARC 24q, DILR 20q, QA 22q", scoring: "66 questions, +3/-1, percentile-based, sectional cutoffs", fees: "₹2500"},
  { num: 17, name: "GATE (Graduate Aptitude Test in Engineering)", country: "India", category: "Engineering / PSU Recruitment", short: "GATE", niche: "Engineering Education", articles: [
    {type:"Complete Exam Guide", intent:"Informational - GATE structure, 30 papers, eligibility", kw:"GATE exam guide 2024 2025", slug:"gate-complete-guide-2024-2025", title:"Complete GATE Guide 2024-2025: Papers, Pattern, Eligibility & PSU"},
    {type:"Preparation Strategy", intent:"Informational - 6-month GATE preparation for Top 100 rank", kw:"GATE preparation Top 100 rank strategy", slug:"gate-preparation-top-100-rank-2024-2025", title:"GATE Preparation Strategy 2024-2025: 6-Month Plan for Top 100 Rank"},
    {type:"Branch Strategy", intent:"Informational - CSE, ECE, ME, EE, CE branch-specific", kw:"GATE CSE ECE ME branch strategies", slug:"gate-branch-specific-strategies-cse-ece-me", title:"GATE Branch-Specific Strategies: CSE, ECE, ME, EE, CE 2024-2025"},
    {type:"PSU & MTech", intent:"Informational - PSU recruitment & MTech admissions via GATE", kw:"GATE PSU recruitment MTech admission", slug:"gate-psu-recruitment-mtech-admission-2024-2025", title:"GATE for PSUs & MTech: Recruitment & Admission Guide 2024-2025"},
    {type:"Post-Exam", intent:"Informational - results, scorecard validity, counseling", kw:"GATE result scorecard validity COAP", slug:"gate-result-scorecard-coap-ccmt-counseling", title:"GATE Results & Counseling: COAP, CCMT & ScoreCard Validity 2024-2025"}
  ], official: "IISc + 7 IITs (rotating organizing institute)", sections: "3 hours, 65 questions, GA 10 + Technical 55, MSQ/MSQ/NAT", scoring: "100 marks, normalized, 3-year validity", fees: "₹1850-2000"},
  { num: 18, name: "CLAT (Common Law Admission Test)", country: "India", category: "Law Entrance", short: "CLAT", niche: "Legal Education", articles: [
    {type:"Complete Exam Guide", intent:"Informational - CLAT UG/PG structure, NLU admissions", kw:"CLAT exam guide 2024 2025", slug:"clat-complete-guide-2024-2025", title:"Complete CLAT Guide 2024-2025: Pattern, Syllabus & NLU Admissions"},
    {type:"Preparation Strategy", intent:"Informational - 8-month CLAT preparation for NLSIU/NALSAR", kw:"CLAT preparation NLU strategy", slug:"clat-preparation-nlu-strategy-2024-2025", title:"CLAT Preparation Strategy 2024-2025: 8-Month Plan for Top NLUs"},
    {type:"Section Mastery", intent:"Informational - English, Current Affairs, Legal Reasoning, Logical, Quant", kw:"CLAT section strategies Legal Reasoning", slug:"clat-section-mastery-legal-reasoning-2024-2025", title:"CLAT Section Mastery: Legal Reasoning, GK & Logical Reasoning 2024-2025"},
    {type:"Last-Minute", intent:"Informational - 30-day revision & mock strategy", kw:"CLAT last 30 days strategy", slug:"clat-last-30-days-strategy-2024-2025", title:"CLAT Last 30 Days: Revision & Mock Strategy 2024-2025"},
    {type:"Post-Exam", intent:"Informational - results, counseling, NLU cutoffs", kw:"CLAT result counseling NLU cutoffs", slug:"clat-result-counseling-nlu-cutoffs-2024-2025", title:"CLAT Results & Counseling: NLU Cutoffs & Choice 2024-2025"}
  ], official: "Consortium of NLUs + Organizing NLU", sections: "2 hours, 120 MCQs: English, Current Affairs, Legal Reasoning, Logical Reasoning, Quant", scoring: "+1/-0.25, 120 marks, CLAT rank", fees: "₹4000"},
  { num: 19, name: "SSC CGL (Staff Selection Commission - Combined Graduate Level)", country: "India", category: "Government Recruitment", short: "SSC CGL", niche: "Government Jobs", articles: [
    {type:"Complete Exam Guide", intent:"Informational - SSC CGL Tier 1 & 2 structure", kw:"SSC CGL exam guide 2024 2025", slug:"ssc-cgl-complete-guide-2024-2025", title:"Complete SSC CGL Guide 2024-2025: Tier 1, Tier 2 & Posts"},
    {type:"Preparation Strategy", intent:"Informational - 6-month SSC CGL preparation", kw:"SSC CGL preparation strategy Tier 1 2", slug:"ssc-cgl-preparation-strategy-2024-2025", title:"SSC CGL Preparation Strategy 2024-2025: 6-Month Tier 1+2 Plan"},
    {type:"Subject Deep Dive", intent:"Informational - Maths, Reasoning, English, GK mastery", kw:"SSC CGL Maths Reasoning English GK", slug:"ssc-cgl-subject-mastery-maths-reasoning", title:"SSC CGL Subject Mastery: Maths, Reasoning, English & GK 2024-2025"},
    {type:"Tier 2 Strategy", intent:"Informational - Tier 2 sectional & dest preparation", kw:"SSC CGL Tier 2 strategy sectional", slug:"ssc-cgl-tier-2-strategy-2024-2025", title:"SSC CGL Tier 2 Strategy: Sectional Timing & DEST 2024-2025"},
    {type:"Post-Exam", intent:"Informational - results, cutoffs, posts, DV", kw:"SSC CGL result cutoff posts", slug:"ssc-cgl-result-cutoff-posts-dv-2024-2025", title:"SSC CGL Results & Posts: Cutoffs, Preference & Document Verification 2024-2025"}
  ], official: "SSC (Staff Selection Commission)", sections: "Tier 1: 100q (General Intelligence, GK, Quant, English) + Tier 2: 4 sections", scoring: "Normalised, merit list, no interview (since 2016)", fees: "₹100"},
  { num: 20, name: "IBPS PO (Institute of Banking Personnel Selection - Probationary Officer)", country: "India", category: "Banking Recruitment", short: "IBPS PO", niche: "Banking Jobs", articles: [
    {type:"Complete Exam Guide", intent:"Informational - IBPS PO Prelims, Mains, Interview", kw:"IBPS PO exam guide 2024 2025", slug:"ibps-po-complete-guide-2024-2025", title:"Complete IBPS PO Guide 2024-2025: Prelims, Mains & Interview"},
    {type:"Preparation Strategy", intent:"Informational - 4-month IBPS PO preparation", kw:"IBPS PO preparation strategy Prelims Mains", slug:"ibps-po-preparation-strategy-2024-2025", title:"IBPS PO Preparation Strategy 2024-2025: 4-Month Prelims+Mains Plan"},
    {type:"Subject Deep Dive", intent:"Informational - Reasoning, Quant, English, GA, Computer", kw:"IBPS PO Reasoning Quant English GA", slug:"ibps-po-subject-mastery-reasoning-quant", title:"IBPS PO Subject Mastery: Reasoning, Quant, English & GA 2024-2025"},
    {type:"Mains Strategy", intent:"Informational - Mains sectional + Descriptive + Interview", kw:"IBPS PO Mains Descriptive Interview strategy", slug:"ibps-po-mains-descriptive-interview-strategy", title:"IBPS PO Mains Strategy: Descriptive Writing & Interview 2024-2025"},
    {type:"Post-Exam", intent:"Informational - results, cutoffs, allotment", kw:"IBPS PO result cutoff allotment", slug:"ibps-po-result-cutoff-allotment-2024-2025", title:"IBPS PO Results & Allotment: Cutoffs & Bank Preference 2024-2025"}
  ], official: "IBPS", sections: "Prelims 100q (English, Quant, Reasoning) + Mains 155q + Descriptive + Interview", scoring: "Mains 225 + Interview 100 = 325, normalised", fees: "₹850"},
  { num: 21, name: "CUET UG (Common University Entrance Test - Undergraduate)", country: "India", category: "University Admissions", short: "CUET UG", niche: "Indian Higher Education", articles: [
    {type:"Complete Exam Guide", intent:"Informational - CUET UG domain, language, general test structure", kw:"CUET UG guide 2024 2025", slug:"cuet-ug-complete-guide-2024-2025", title:"Complete CUET UG Guide 2024-2025: Subjects, Pattern & Universities"},
    {type:"Preparation Strategy", intent:"Informational - CUET preparation for DU, BHU, JNU", kw:"CUET preparation DU BHU strategy", slug:"cuet-ug-preparation-strategy-2024-2025", title:"CUET UG Preparation Strategy 2024-2025: Plan for DU/BHU/JNU 610+"},
    {type:"Domain Mastery", intent:"Informational - domain subject + language + general test mastery", kw:"CUET domain subject language general test", slug:"cuet-ug-domain-language-general-test-mastery", title:"CUET UG Domain & General Test Mastery: Scoring 200+ 2024-2025"},
    {type:"Last-Minute", intent:"Informational - 45-day crash strategy", kw:"CUET last 45 days crash strategy", slug:"cuet-ug-last-45-days-crash-strategy", title:"CUET UG Last 45 Days: Crash Strategy & Mocks 2024-2025"},
    {type:"Post-Exam", intent:"Informational - results, normalization, counseling", kw:"CUET result normalization counseling DU", slug:"cuet-ug-result-normalization-counseling-2024-2025", title:"CUET UG Results & Counseling: Normalization & University Choice 2024-2025"}
  ], official: "NTA + Participating Universities (250+ universities)", sections: "Up to 6 subjects, 45-60 min each, MCQs from NCERT Class 12", scoring: "Normalised percentile per subject, university-wise merit", fees: "₹1000-2000 for 4-6 subjects"},
  { num: 22, name: "Gaokao (National College Entrance Examination)", country: "China", category: "University Entrance / National Exam", short: "Gaokao", niche: "Chinese Education", articles: [
    {type:"Complete Exam Guide", intent:"Informational - Gaokao structure, subjects, provinces, registration", kw:"Gaokao exam guide 2024 2025", slug:"gaokao-complete-guide-2024-2025", title:"Complete Gaokao Guide 2024-2025: Structure, Subjects & Provinces"},
    {type:"Preparation Strategy", intent:"Informational - 3-year Gaokao preparation intensive", kw:"Gaokao preparation strategy 985 211", slug:"gaokao-preparation-strategy-985-211-2024-2025", title:"Gaokao Preparation Strategy 2024-2025: 3-Year Intensive for 985/211 Universities"},
    {type:"Subject Strategy", intent:"Informational - Chinese, Maths, English, Science/Humanities mastery", kw:"Gaokao Chinese Maths English strategies", slug:"gaokao-subject-mastery-chinese-maths-english", title:"Gaokao Subject Mastery: Chinese, Maths, English & Comprehensive 2024-2025"},
    {type:"Province Variation", intent:"Informational - new Gaokao (3+1+2) vs old (3+X) provinces", kw:"Gaokao 3+1+2 vs 3+X provinces", slug:"gaokao-new-vs-old-province-variations-2024-2025", title:"Gaokao Province Variations 2024-2025: 3+1+2 vs 3+X Explained"},
    {type:"Post-Exam", intent:"Informational - scores, tier lines,志愿填报 (preference filling)", kw:"Gaokao result tier lines volunteer filling", slug:"gaokao-result-tier-lines-volunteer-filling", title:"Gaokao Results & Volunteer Filling: Tier Lines & Choice 2024-2025"}
  ], official: "Ministry of Education (China) + Provincial Education Departments", sections: "2 days, 4 subjects: Chinese, Maths, English + Comprehensive (Science/Humanities or 3+1+2)", scoring: "750 total, province-specific cutoffs, rank critical", fees: "¥30-180 varies by province"},
  { num: 23, name: "Suneung (College Scholastic Ability Test - CSAT)", country: "South Korea", category: "University Entrance", short: "Suneung / CSAT", niche: "Korean Education", articles: [
    {type:"Complete Exam Guide", intent:"Informational - CSAT structure, sections, grading, retake", kw:"Korean CSAT Suneung guide 2024 2025", slug:"korean-csat-suneung-complete-guide-2024-2025", title:"Complete Korean CSAT (Suneung) Guide 2024-2025: Structure & Grading"},
    {type:"Preparation Strategy", intent:"Informational - 3-year intensive + re-study (jaesu)", kw:"CSAT preparation re-study strategy", slug:"korean-csat-preparation-strategy-jaesu-2024-2025", title:"Korean CSAT Preparation Strategy: 3-Year + Jaesu (Retake) 2024-2025"},
    {type:"Subject Mastery", intent:"Informational - Korean, Maths, English, 탐구 (inquiry) subjects", kw:"CSAT Korean Maths English inquiry strategies", slug:"korean-csat-subject-mastery-korean-maths-english", title:"Korean CSAT Subject Mastery: Korean, Maths, English & 탐구 2024-2025"},
    {type:"Grading & Cutoffs", intent:"Informational - stanine grades, percentile, SKY universities", kw:"CSAT grading stanine percentile SKY", slug:"korean-csat-grading-stanine-percentile-sky", title:"Korean CSAT Grading & SKY Cutoffs: Stanine & Percentile 2024-2025"},
    {type:"Post-Exam", intent:"Informational - results, sijeong counseling, admission types", kw:"CSAT result sijeong admission types", slug:"korean-csat-result-sijeong-admission-2024-2025", title:"Korean CSAT Results & Admissions: 수시/정시 & Counseling 2024-2025"}
  ], official: "KICE (Korea Institute for Curriculum and Evaluation) + Ministry of Education", sections: "1 day, 5 sessions: Korean, Maths, English, Korean History, 탐구, Second Language", scoring: "Stanine (1-9), percentile, standard score", fees: "₩47,000"},
  { num: 24, name: "JLPT (Japanese Language Proficiency Test)", country: "Japan (Global)", category: "Language Proficiency", short: "JLPT", niche: "Japanese Language", articles: [
    {type:"Complete Exam Guide", intent:"Informational - JLPT N1-N5 structure, levels, registration", kw:"JLPT guide N1 N5 2024 2025", slug:"jlpt-complete-guide-n1-n5-2024-2025", title:"Complete JLPT Guide 2024-2025: N1-N5 Levels, Structure & Registration"},
    {type:"Preparation Strategy", intent:"Informational - JLPT N3-N1 preparation timeline", kw:"JLPT preparation N1 N2 N3 strategy", slug:"jlpt-preparation-strategy-n1-n2-n3-2024-2025", title:"JLPT Preparation Strategy 2024-2025: N3 to N1 6-Month Plan"},
    {type:"Section Mastery", intent:"Informational - kanji, vocabulary, grammar, reading, listening mastery", kw:"JLPT kanji vocab grammar reading listening", slug:"jlpt-section-mastery-kanji-vocab-grammar", title:"JLPT Section Mastery: Kanji, Vocabulary, Grammar & Listening 2024-2025"},
    {type:"Level Choice", intent:"Informational - which JLPT level to take (N5-N1 decision)", kw:"JLPT level choice N1 N2 N3 which", slug:"jlpt-level-choice-n1-n5-decision-guide", title:"JLPT Level Choice Guide 2024-2025: Which Level (N5-N1) Should You Take?"},
    {type:"Post-Exam", intent:"Informational - results, scores, career, university use", kw:"JLPT results scores career university", slug:"jlpt-results-scores-career-university-2024-2025", title:"JLPT Results & Next Steps: Scores, Career & University Admissions 2024-2025"}
  ], official: "JEES + Japan Foundation", sections: "Language Knowledge (Vocab/Grammar), Reading, Listening; times vary by level", scoring: "0-180 (N1-N3) or 0-180 (N4-N5), scaled, 100/180 = pass (varies)", fees: "¥6,500 Japan / $60-100 abroad"},
  { num: 25, name: "JAMB UTME (Unified Tertiary Matriculation Examination)", country: "Nigeria", category: "University Entrance", short: "JAMB UTME", niche: "Nigerian Education", articles: [
    {type:"Complete Exam Guide", intent:"Informational - UTME structure, subjects, registration, centers", kw:"JAMB UTME guide 2024 2025", slug:"jamb-utme-complete-guide-2024-2025", title:"Complete JAMB UTME Guide 2024-2025: Structure, Subjects & Registration"},
    {type:"Preparation Strategy", intent:"Informational - UTME 300+ preparation plan", kw:"JAMB UTME 300 preparation strategy", slug:"jamb-utme-300-preparation-strategy-2024-2025", title:"JAMB UTME 300+ Strategy: 3-Month Preparation Plan 2024-2025"},
    {type:"Subject Mastery", intent:"Informational - Use of English, Maths, Sciences, Arts strategies", kw:"JAMB Use of English Maths strategies", slug:"jamb-utme-subject-mastery-english-maths", title:"JAMB UTME Subject Mastery: Use of English, Maths & Sciences 2024-2025"},
    {type:"Post-UTME", intent:"Informational - Post-UTME screening, cutoffs, direct entry", kw:"JAMB Post UTME screening cutoffs", slug:"jamb-post-utme-screening-cutoffs-2024-2025", title:"JAMB Post-UTME & Cutoffs: Departmental Marks & Screening 2024-2025"},
    {type:"Post-Exam", intent:"Informational - results, CAPS, admission list, regularization", kw:"JAMB result CAPS admission list", slug:"jamb-utme-result-caps-admission-2024-2025", title:"JAMB UTME Results & CAPS: Admission Lists & Next Steps 2024-2025"}
  ], official: "JAMB (Joint Admissions and Matriculation Board) + CBT Centers", sections: "CBT, 4 subjects × 2 hours, Use of English compulsory + 3 others", scoring: "0-400, 100 per subject, institutional & departmental cutoffs", fees: "₦4,700 + ePIN charges"},
  { num: 26, name: "ENEM (Exame Nacional do Ensino Médio)", country: "Brazil", category: "University Entrance / National Assessment", short: "ENEM", niche: "Brazilian Education", articles: [
    {type:"Complete Exam Guide", intent:"Informational - ENEM structure, areas, redação, SiSU/ProUni/FIES", kw:"ENEM exam guide 2024 2025", slug:"enem-complete-guide-2024-2025", title:"Complete ENEM Guide 2024-2025: Areas, Redação & SiSU/ProUni/FIES"},
    {type:"Preparation Strategy", intent:"Informational - ENEM preparation for 700+ TRI", kw:"ENEM preparation 700 TRI strategy", slug:"enem-preparation-700-tri-strategy-2024-2025", title:"ENEM Preparation Strategy 2024-2025: 6-Month Plan for 700+ TRI"},
    {type:"Redação Mastery", intent:"Informational - ENEM essay (nota 1000) structure & themes", kw:"ENEM redação nota 1000 strategies", slug:"enem-redacao-nota-1000-mastery-2024-2025", title:"ENEM Redação Mastery: Nota 1000 Structure & Competências 2024-2025"},
    {type:"TRI Strategy", intent:"Informational - understand TRI scoring, coherence, difficulty", kw:"ENEM TRI scoring strategy coherence", slug:"enem-tri-scoring-strategy-2024-2025", title:"ENEM TRI Scoring Strategy: Coherence & Difficulty Explained 2024-2025"},
    {type:"Post-Exam", intent:"Informational - SiSU, ProUni, FIES, scholarships, cutoffs", kw:"ENEM SiSU ProUni FIES cutoffs", slug:"enem-sisu-prouni-fies-cutoffs-2024-2025", title:"ENEM Results & SiSU/ProUni/FIES: Cutoffs, Scholarships & Admissions 2024-2025"}
  ], official: "INEP + Ministry of Education (Brazil)", sections: "2 days: Day1: Languages/Codes, Human Sciences, Redação; Day2: Natural Sciences, Maths (180 MCQs + essay)", scoring: "TRI scale 0-1000 per area, redação 0-1000, SiSU cutoff varies", fees: "R$85 (exempt for eligible)"},
  { num: 27, name: "Abitur (Allgemeine Hochschulreife)", country: "Germany", category: "University Entrance / School-Leaving", short: "Abitur", niche: "German Education", articles: [
    {type:"Complete Exam Guide", intent:"Informational - Abitur structure, LK/GK, Bundesländer variations", kw:"Abitur guide 2024 2025 Germany", slug:"abitur-complete-guide-2024-2025", title:"Complete Abitur Guide 2024-2025: LK/GK, Structure & Länder Variations"},
    {type:"Preparation Strategy", intent:"Informational - Abitur preparation for 1.0-1.5 Schnitt", kw:"Abitur preparation 1.0 strategy", slug:"abitur-preparation-1-0-strategy-2024-2025", title:"Abitur Preparation Strategy 2024-2025: Plan for 1.0-1.5 Schnitt"},
    {type:"Subject Mastery", intent:"Informational - Deutsch, Mathematik, Fremdsprache, Naturwissenschaft mastery", kw:"Abitur Deutsch Mathematik strategies", slug:"abitur-subject-mastery-deutsch-mathematik", title:"Abitur Subject Mastery: Deutsch, Mathematik & Naturwissenschaft 2024-2025"},
    {type:"NC & Admission", intent:"Informational - Numerus Clausus, Hochschulstart, Uni-Assist", kw:"Abitur NC Numerus Clausus university admission", slug:"abitur-nc-numerus-clausus-admission-2024-2025", title:"Abitur NC & University Admissions: Hochschulstart & Uni-Assist 2024-2025"},
    {type:"Post-Exam", intent:"Informational - results, Zeugnis, alternative paths (Fachabitur)", kw:"Abitur results Zeugnis Fachabitur alternatives", slug:"abitur-results-zeugnis-fachabitur-alternatives", title:"Abitur Results & Alternatives: Zeugnis, Fachabitur & Pathways 2024-2025"}
  ], official: "KMK + State Ministries of Education (16 Länder)", sections: "5 exams: 2 LK (advanced) + 2 GK (basic) +1 oral/practical; Block I (courses) + Block II (exams)", scoring: "0-15 points per course/exam, total 300 + 300 = 600, converts to 1.0-4.0 Abiturnote", fees: "Public schools free; private/Abitur nachholen varies"},
  { num: 28, name: "Baccalauréat (Bac Général / Technologique / Professionnel)", country: "France", category: "University Entrance / School-Leaving", short: "Baccalauréat", niche: "French Education", articles: [
    {type:"Complete Exam Guide", intent:"Informational - Bac reform (contrôle continu + épreuves finales), spécialités", kw:"Baccalauréat guide 2024 2025 France", slug:"baccalaureat-complete-guide-2024-2025", title:"Complete Baccalauréat Guide 2024-2025: Reform, Spécialités & Épreuves"},
    {type:"Preparation Strategy", intent:"Informational - Bac preparation for Mention Très Bien (16+/20)", kw:"Bac preparation Mention Très Bien strategy", slug:"baccalaureat-preparation-mention-tres-bien-2024-2025", title:"Bac Preparation Strategy 2024-2025: Plan for Mention Très Bien (16+/20)"},
    {type:"Subject Mastery", intent:"Informational - Philosophie, Grand Oral, spécialités mastery", kw:"Bac Philosophie Grand Oral spécialités", slug:"baccalaureat-philosophie-grand-oral-specialites", title:"Bac Subject Mastery: Philosophie, Grand Oral & Spécialités 2024-2025"},
    {type:"Parcoursup", intent:"Informational - Parcoursup admissions strategy & vœux", kw:"Bac Parcoursup admissions vœux strategy", slug:"baccalaureat-parcoursup-admissions-voeux-2024-2025", title:"Bac & Parcoursup 2024-2025: Vœux Strategy & Admissions"},
    {type:"Post-Exam", intent:"Informational - results, rattrapage, mentions, alternatives", kw:"Bac results rattrapage mentions alternatives", slug:"baccalaureat-results-rattrapage-mentions-2024-2025", title:"Bac Results & Next Steps: Rattrapage, Mentions & Alternatives 2024-2025"}
  ], official: "Ministry of National Education + Rectorats", sections: "Contrôle continu (40%) + Épreuves finales: Philosophie, Spécialités ×2, Grand Oral, Français anticipé", scoring: "Coefficient-weighted, /20 average, Mention Assez Bien (12), Bien (14), Très Bien (16), Félicitations (18)", fees: "Public free; candidat libre ~€70"},
  { num: 29, name: "UCAT (University Clinical Aptitude Test)", country: "United Kingdom / Australia / New Zealand", category: "Medical School Admissions", short: "UCAT", niche: "Medical Education", articles: [
    {type:"Complete Exam Guide", intent:"Informational - UCAT structure, subtests, scoring, consortium universities", kw:"UCAT guide 2024 2025", slug:"ucat-complete-guide-2024-2025", title:"Complete UCAT Guide 2024-2025: Subtests, Scoring & Consortium Unis"},
    {type:"Preparation Strategy", intent:"Informational - UCAT 3000+ preparation (2850+ competitive)", kw:"UCAT 3000 preparation strategy", slug:"ucat-3000-preparation-strategy-2024-2025", title:"UCAT Preparation Strategy 2024-2025: 6-Week Plan for 3000+"},
    {type:"Subtest Mastery", intent:"Informational - VR, DM, QR, AR, SJT mastery", kw:"UCAT VR DM QR AR SJT strategies", slug:"ucat-subtest-mastery-vr-dm-qr-ar-sjt", title:"UCAT Subtest Mastery: VR, DM, QR, AR & SJT 2024-2025"},
    {type:"Cutoffs & Strategy", intent:"Informational - university cutoffs, deciles, UCAT vs BMAT vs GAMSAT", kw:"UCAT cutoffs deciles university thresholds", slug:"ucat-cutoffs-deciles-university-thresholds-2024-2025", title:"UCAT Cutoffs & University Thresholds: Deciles & Strategy 2024-2025"},
    {type:"Post-Exam", intent:"Informational - results, interview, next steps", kw:"UCAT results interview next steps", slug:"ucat-results-interview-next-steps-2024-2025", title:"UCAT Results & Interviews: Next Steps After UCAT 2024-2025"}
  ], official: "UCAT Consortium + Pearson VUE", sections: "2 hours: VR (44q,21m), DM (29q,31m), QR (36q,24m), AR (50q,12m), SJT (66q,26m)", scoring: "VR/DM/QR/AR 300-900 each = 1200-3600 + SJT Bands 1-4", fees: "£70-£115 UK / AUD$325"},
  { num: 30, name: "PTE Academic (Pearson Test of English Academic)", country: "Global (Australia / UK / Canada)", category: "English Proficiency", short: "PTE Academic", niche: "English Language", articles: [
    {type:"Complete Exam Guide", intent:"Informational - PTE Academic structure, task types, scoring (AI)", kw:"PTE Academic guide 2024 2025", slug:"pte-academic-complete-guide-2024-2025", title:"Complete PTE Academic Guide 2024-2025: Structure, Tasks & Scoring (AI)"},
    {type:"Preparation Strategy", intent:"Informational - PTE 79+ (Superior) preparation", kw:"PTE 79 preparation strategy", slug:"pte-academic-79-preparation-strategy-2024-2025", title:"PTE Academic 79+ Strategy: 4-Week Plan for Superior English 2024-2025"},
    {type:"Task Mastery", intent:"Informational - Speaking (Read Aloud, Repeat Sentence), Writing, Reading, Listening mastery", kw:"PTE task mastery Read Aloud Repeat Sentence", slug:"pte-academic-task-mastery-read-aloud-repeat-sentence", title:"PTE Task Mastery: Speaking & Listening High-Weight Tasks 2024-2025"},
    {type:"Scoring Secrets", intent:"Informational - understand AI scoring, enabling skills, partial credit", kw:"PTE AI scoring enabling skills partial credit", slug:"pte-academic-ai-scoring-enabling-skills-2024-2025", title:"PTE AI Scoring Secrets: Enabling Skills & Partial Credit 2024-2025"},
    {type:"Comparison", intent:"Informational - PTE vs IELTS vs TOEFL vs Duolingo", kw:"PTE vs IELTS vs TOEFL comparison", slug:"pte-vs-ielts-vs-toefl-vs-duolingo-2024-2025", title:"PTE vs IELTS vs TOEFL vs Duolingo 2024-2025: Which English Test?"}
  ], official: "Pearson + Edexcel", sections: "Approx 2 hours: Speaking & Writing (52-64m), Reading (29-30m), Listening (30-43m) — integrated tasks", scoring: "10-90 GSE, AI + human, 6-point increments", fees: "AUD$410 / £180 / $200 (varies)"},
];

const remainingExams = [
  { num: 31, name: "Duolingo English Test (DET)", country: "Global", category: "English Proficiency", short: "Duolingo English Test", niche: "English Language", articles: [
    {type:"Complete Exam Guide", intent:"Informational - DET structure, adaptive, registration, at-home", kw:"Duolingo English Test guide 2024 2025", slug:"duolingo-english-test-complete-guide-2024-2025", title:"Complete Duolingo English Test Guide 2024-2025: Format, Scoring & Registration"},
    {type:"Preparation Strategy", intent:"Informational - DET 135+ preparation", kw:"Duolingo 135 preparation strategy", slug:"duolingo-english-test-135-preparation-2024-2025", title:"Duolingo English Test 135+ Strategy: 3-Week Plan 2024-2025"},
    {type:"Task Mastery", intent:"Informational - adaptive task types & AI proctoring", kw:"Duolingo task types adaptive AI proctor", slug:"duolingo-english-test-task-mastery-adaptive", title:"Duolingo Task Mastery: Adaptive Questions & AI Proctor 2024-2025"},
    {type:"Comparison", intent:"Informational - DET vs IELTS vs TOEFL vs PTE", kw:"Duolingo vs IELTS vs TOEFL comparison", slug:"duolingo-vs-ielts-vs-toefl-vs-pte-2024-2025", title:"Duolingo vs IELTS vs TOEFL vs PTE 2024-2025: Cost & Acceptance"},
    {type:"Post-Exam", intent:"Informational - scores, university requirements, retake, validity", kw:"Duolingo score university requirements retake", slug:"duolingo-english-test-score-university-requirements-retake", title:"Duolingo Scores & University Requirements: Retake & Validity 2024-2025"}
  ], official: "Duolingo", sections: "Adaptive 45-60m: Read/Complete, Listen/Type, Speak, Write + 10m video interview (unscored)", scoring: "10-160 overall, 4 subscores (Literacy, Comprehension, Conversation, Production)", fees: "$59 + $29 to send? Actually $49-59 single, check official"},
  { num: 32, name: "AWS Certified Solutions Architect - Associate (SAA-C03)", country: "Global", category: "Technology Certification / Cloud", short: "AWS SAA", niche: "Cloud Computing", articles: [
    {type:"Complete Exam Guide", intent:"Informational - SAA-C03 domains, format, prerequisites, registration", kw:"AWS Solutions Architect Associate guide 2024 2025 SAA-C03", slug:"aws-solutions-architect-associate-saa-c03-complete-guide", title:"Complete AWS SAA-C03 Guide 2024-2025: Domains, Format & Registration"},
    {type:"Preparation Strategy", intent:"Informational - 10-week AWS SAA study plan", kw:"AWS SAA study plan 10 weeks preparation", slug:"aws-saa-study-plan-10-weeks-2024-2025", title:"AWS SAA-C03 Study Plan 2024-2025: 10-Week Strategy for First-Time Pass"},
    {type:"Domain Mastery", intent:"Informational - Resilient, Performant, Secure, Cost-Optimized architectures", kw:"AWS SAA domains Resilient Performant Secure Cost-Optimized", slug:"aws-saa-domain-mastery-resilient-performant-secure", title:"AWS SAA Domain Mastery: Resilient, Performant, Secure & Cost-Optimized 2024-2025"},
    {type:"Practice Labs", intent:"Informational - hands-on labs, practice exams, exam-day tactics", kw:"AWS SAA practice exams hands-on labs", slug:"aws-saa-practice-exams-hands-on-labs-2024-2025", title:"AWS SAA Practice Exams & Hands-On Labs: Exam Tactics 2024-2025"},
    {type:"Post-Exam", intent:"Informational - certification validity, next steps (Professional/Specialty), jobs", kw:"AWS SAA certification jobs next steps", slug:"aws-saa-certification-jobs-next-steps-2024-2025", title:"After AWS SAA: Certification, Jobs & Specialty Path 2024-2025"}
  ], official: "AWS + Pearson VUE/PSI", sections: "65 questions, 130m, MCQs + associated response, 4 domains", scoring: "100-1000, 720 pass, scaled", fees: "$150"},
  { num: 33, name: "Chartered Accountant (CA) - ICAI (Foundation, Intermediate, Final)", country: "India", category: "Professional Certification / Accounting", short: "CA ICAI", niche: "Indian Accounting", articles: [
    {type:"Complete Exam Guide", intent:"Informational - CA Foundation, Inter, Final structure, articleship, registration", kw:"CA ICAI guide Foundation Intermediate Final 2024 2025", slug:"ca-icai-complete-guide-foundation-intermediate-final-2024-2025", title:"Complete CA ICAI Guide 2024-2025: Foundation, Intermediate, Final & Articleship"},
    {type:"Preparation Strategy", intent:"Informational - CA Final 6-month preparation & articleship balance", kw:"CA Final preparation articleship strategy", slug:"ca-final-preparation-articleship-strategy-2024-2025", title:"CA Final Preparation Strategy 2024-2025: 6-Month Plan with Articleship"},
    {type:"Subject Mastery", intent:"Informational - Advanced Accounting, SFM, Audit, Taxation mastery", kw:"CA Advanced Accounting SFM Audit Tax", slug:"ca-subject-mastery-advanced-accounting-sfm-audit", title:"CA Subject Mastery: Accounting, SFM, Audit & Taxation 2024-2025"},
    {type:"Attempt Strategy", intent:"Informational - group-wise vs single group, exemption, rank", kw:"CA attempt strategy group exemption rank", slug:"ca-attempt-strategy-group-exemption-rank-2024-2025", title:"CA Attempt Strategy: Single vs Both Groups & Exemption Planning 2024-2025"},
    {type:"Post-Exam", intent:"Informational - results, campus placement, COP, career", kw:"CA results campus placement COP career", slug:"ca-results-campus-placement-cop-career-2024-2025", title:"CA Results & Career: Campus Placement, COP & Beyond 2024-2025"}
  ], official: "ICAI (Institute of Chartered Accountants of India)", sections: "Foundation 4 papers, Intermediate 6 papers (2 groups), Final 6 papers (2 groups), 3h each", scoring: "40% per paper, 50% aggregate per group to pass", fees: "Foundation ₹9k, Inter ₹18k, Final ₹22k (check ICAI bulletin)"},
  { num: 34, name: "NDA (National Defence Academy) & Naval Academy Examination", country: "India", category: "Defence / Government Recruitment", short: "NDA", niche: "Indian Defence", articles: [
    {type:"Complete Exam Guide", intent:"Informational - NDA written, SSB, medical, eligibility", kw:"NDA exam guide 2024 2025", slug:"nda-complete-guide-2024-2025", title:"Complete NDA Guide 2024-2025: Written, SSB, Medical & Eligibility"},
    {type:"Preparation Strategy", intent:"Informational - NDA written + SSB integrated preparation", kw:"NDA written SSB preparation strategy", slug:"nda-written-ssb-preparation-strategy-2024-2025", title:"NDA Preparation Strategy 2024-2025: Written + SSB Integrated Plan"},
    {type:"Subject Mastery", intent:"Informational - Maths (GAT) & General Ability Test mastery", kw:"NDA Maths GAT General Ability", slug:"nda-maths-gat-mastery-2024-2025", title:"NDA Subject Mastery: Maths & GAT (English, GK, Science) 2024-2025"},
    {type:"SSB Mastery", intent:"Informational - SSB 5-day process, psychological, GTO, interview", kw:"NDA SSB 5-day process psychological GTO interview", slug:"nda-ssb-5-day-mastery-psychological-gto-interview", title:"NDA SSB Mastery: 5-Day Process, Psychological, GTO & Interview 2024-2025"},
    {type:"Post-Exam", intent:"Informational - merit list, academy training, career", kw:"NDA merit list academy training career", slug:"nda-merit-list-academy-training-career-2024-2025", title:"NDA Merit List & Academy Training: Career Path 2024-2025"}
  ], official: "UPSC + Ministry of Defence", sections: "Written: Maths 300m (120q) + GAT 600m (150q: English+GK) = 900m, 5 hours + SSB 900m", scoring: "Written 900 + SSB 900 = 1800, sectional & overall cutoffs", fees: "₹100"},
  { num: 35, name: "AP Exams (Advanced Placement) - College Board", country: "United States", category: "High School / College Credit", short: "AP Exams", niche: "College Credit", articles: [
    {type:"Complete Exam Guide", intent:"Informational - AP 39 subjects, structure, scoring, credit", kw:"AP exams guide 2024 2025 structure scoring", slug:"ap-exams-complete-guide-2024-2025", title:"Complete AP Exams Guide 2024-2025: 39 Subjects, Format & College Credit"},
    {type:"Subject Selection", intent:"Informational - which APs to take (STEM, humanities, AP Scholar)", kw:"AP subject selection which to take strategy", slug:"ap-subject-selection-strategy-which-to-take", title:"AP Subject Selection Strategy: Which APs for Your Major 2024-2025"},
    {type:"Preparation Strategy", intent:"Informational - AP 5-score study plan (APUSH, Calc, Physics, Bio, etc.)", kw:"AP 5 score preparation strategy", slug:"ap-5-score-preparation-strategy-2024-2025", title:"AP 5-Score Strategy 2024-2025: Study Plan for Any Subject"},
    {type:"Digital Transition", intent:"Informational - AP digital exams (2025: 28 subjects digital)", kw:"AP digital exams 2025 transition", slug:"ap-digital-exams-transition-2025", title:"AP Digital Exams 2025: 28 Subjects Going Digital - What Changes"},
    {type:"Post-Exam", intent:"Informational - scores, credit policy, placement, admissions value", kw:"AP scores college credit placement admissions", slug:"ap-scores-college-credit-placement-2024-2025", title:"AP Scores & College Credit: Placement, Admissions & Credit Policy 2024-2025"}
  ], official: "College Board", sections: "39 subjects, 2-3 hours each, MCQs + FRQs, May administration", scoring: "1-5 (5 = extremely well qualified), college credit usually 3+", fees: "$98 US / $128 international per exam"},
  { num: 36, name: "Bar Examination - Uniform Bar Examination (UBE)", country: "United States", category: "Professional Licensure / Law", short: "UBE / Bar Exam", niche: "Legal Licensure", articles: [
    {type:"Complete Exam Guide", intent:"Informational - UBE structure: MBE, MEE, MPT, jurisdictions", kw:"Bar exam UBE guide 2024 2025", slug:"bar-exam-ube-complete-guide-2024-2025", title:"Complete Bar Exam (UBE) Guide 2024-2025: MBE, MEE, MPT & Jurisdictions"},
    {type:"Preparation Strategy", intent:"Informational - 10-week bar prep (Barbri/Themis/Kaplan) intensive", kw:"Bar exam preparation 10 weeks strategy", slug:"bar-exam-preparation-10-weeks-2024-2025", title:"Bar Exam Preparation Strategy 2024-2025: 10-Week Intensive for First-Time Pass"},
    {type:"MBE Mastery", intent:"Informational - MBE 200 MCQs (7 subjects) mastery", kw:"Bar MBE 200 MCQs mastery strategies", slug:"bar-exam-mbe-200-mcqs-mastery-2024-2025", title:"Bar Exam MBE Mastery: 200 MCQs & 7 Subjects 2024-2025"},
    {type:"Essay & MPT", intent:"Informational - MEE essays & MPT performance test", kw:"Bar MEE essays MPT performance test", slug:"bar-exam-mee-mpt-mastery-2024-2025", title:"Bar Exam MEE & MPT Mastery: Essays & Performance Test 2024-2025"},
    {type:"Post-Exam", intent:"Informational - results, character & fitness, admission, MPRE", kw:"Bar results character fitness admission MPRE", slug:"bar-exam-results-character-fitness-admission-2024-2025", title:"Bar Exam Results & Admission: Character, Fitness & MPRE 2024-2025"}
  ], official: "NCBE + State Bars + Jurisdictions (41 UBE jurisdictions as of 2024)", sections: "2 days: Day1: MPT (2 tasks,3h) + MEE (6 essays,3h); Day2: MBE (200 MCQs,6h)", scoring: "260-400 per component, total 400, 260-280 pass varies by state", fees: "$500-$1500 varies by state"},
  { num: 37, name: "ACCA (Association of Chartered Certified Accountants)", country: "United Kingdom / Global", category: "Professional Certification / Accounting", short: "ACCA", niche: "Global Accounting", articles: [
    {type:"Complete Exam Guide", intent:"Informational - ACCA 13 papers, 3 levels, PER, Ethics", kw:"ACCA guide 2024 2025 13 papers", slug:"acca-complete-guide-13-papers-2024-2025", title:"Complete ACCA Guide 2024-2025: 13 Papers, 3 Levels & PER"},
    {type:"Preparation Strategy", intent:"Informational - ACCA paper-by-paper vs level-by-level strategy", kw:"ACCA preparation Applied Knowledge Skills Professional", slug:"acca-preparation-strategy-levels-2024-2025", title:"ACCA Preparation Strategy 2024-2025: Applied Knowledge to Strategic Professional"},
    {type:"Applied & Strategic", intent:"Informational - SBL, SBR, AFM, APM, AAA mastery", kw:"ACCA SBL SBR AFM APM AAA strategies", slug:"acca-strategic-professional-mastery-sbl-sbr", title:"ACCA Strategic Professional Mastery: SBL, SBR, AFM, APM, AAA 2024-2025"},
    {type:"Exemptions & Path", intent:"Informational - exemptions, FIA, graduate entry", kw:"ACCA exemptions FIA graduate entry", slug:"acca-exemptions-fia-graduate-entry-2024-2025", title:"ACCA Exemptions & Entry: FIA & Graduate Path 2024-2025"},
    {type:"Post-Exam", intent:"Informational - membership, career, Big Four, global mobility", kw:"ACCA membership career Big Four", slug:"acca-membership-career-big-four-global-2024-2025", title:"ACCA Membership & Career: Big Four & Global Mobility 2024-2025"}
  ], official: "ACCA Global + Pearson VUE/on-demand CBE", sections: "Applied Knowledge (3), Applied Skills (6), Strategic Professional (4: SBL+SBR+2 options)", scoring: "50% per paper to pass, 7-year rule for Strategic", fees: "£100-£170 per paper + registration £89 + subscription"},
  { num: 38, name: "FE Exam (Fundamentals of Engineering)", country: "United States", category: "Professional Licensure / Engineering", short: "FE Exam", niche: "Engineering Licensure", articles: [
    {type:"Complete Exam Guide", intent:"Informational - FE 7 disciplines, CBT, NCEES", kw:"FE exam guide 2024 2025 Fundamentals Engineering", slug:"fe-exam-complete-guide-2024-2025", title:"Complete FE Exam Guide 2024-2025: Disciplines, CBT & NCEES"},
    {type:"Preparation Strategy", intent:"Informational - FE 3-month preparation for Civil/Mechanical/Electrical", kw:"FE preparation Civil Mechanical Electrical strategy", slug:"fe-exam-preparation-civil-mechanical-electrical-2024-2025", title:"FE Preparation Strategy 2024-2025: Civil, Mechanical & Electrical 2024-2025"},
    {type:"Reference Handbook", intent:"Informational - NCEES FE Reference Handbook mastery (only reference allowed)", kw:"FE Reference Handbook mastery strategies", slug:"fe-reference-handbook-mastery-2024-2025", title:"FE Reference Handbook Mastery: Only Allowed Reference 2024-2025"},
    {type:"Discipline Comparison", intent:"Informational - which FE discipline to take (FE Other vs branch-specific)", kw:"FE discipline which to take comparison", slug:"fe-discipline-which-to-take-comparison", title:"FE Discipline Choice: Which FE Exam Should You Take? 2024-2025"},
    {type:"Post-Exam", intent:"Informational - EIT/EI certification, PE path, career", kw:"FE EIT EI certification PE path", slug:"fe-eit-ei-pe-path-career-2024-2025", title:"After FE: EIT/EI Certification, PE Path & Career 2024-2025"}
  ], official: "NCEES + Pearson VUE", sections: "110 questions, 6 hours (5h20m exam + tutorial/break/survey), 7 discipline-specific forms", scoring: "Pass/Fail (scaled, no score reported)", fees: "$175"},
  { num: 39, name: "Praxis Core & Praxis Subject Assessments", country: "United States", category: "Professional Licensure / Teaching", short: "Praxis", niche: "Teacher Certification", articles: [
    {type:"Complete Exam Guide", intent:"Informational - Praxis Core, Subject, PLT, state requirements", kw:"Praxis guide Core Subject PLT 2024 2025", slug:"praxis-complete-guide-core-subject-plt-2024-2025", title:"Complete Praxis Guide 2024-2025: Core, Subject Assessments & PLT"},
    {type:"Preparation Strategy", intent:"Informational - Praxis Core math, reading, writing prep for 150+", kw:"Praxis Core preparation 150 strategy", slug:"praxis-core-preparation-150-strategy-2024-2025", title:"Praxis Core Preparation Strategy 2024-2025: Math, Reading & Writing for 150+"},
    {type:"Subject Mastery", intent:"Informational - Elementary, Middle, Secondary subject-specific mastery", kw:"Praxis Subject Elementary Secondary strategies", slug:"praxis-subject-mastery-elementary-secondary", title:"Praxis Subject Mastery: Elementary, Secondary & Special Ed 2024-2025"},
    {type:"State Requirements", intent:"Informational - state-by-state Praxis cutoffs (California CBEST/CSET vs Praxis)", kw:"Praxis state requirements cutoffs California CSET", slug:"praxis-state-requirements-cutoffs-2024-2025", title:"Praxis State Requirements & Cutoffs: 50-State Guide 2024-2025"},
    {type:"Post-Exam", intent:"Informational - scores, licensing, certification, reciprocity", kw:"Praxis scores licensing certification reciprocity", slug:"praxis-scores-licensing-certification-reciprocity", title:"Praxis Scores & Licensing: Certification & Reciprocity 2024-2025"}
  ], official: "ETS + State Departments of Education", sections: "Core: Reading 5713, Writing 5723, Math 5733 (separate or combined); Subject: 90+ assessments", scoring: "100-200 per test, passing 150-160 varies by state/test", fees: "$90 Core combined, $130 Subject tests"},
  { num: 40, name: "ASVAB (Armed Services Vocational Aptitude Battery)", country: "United States", category: "Military Entrance", short: "ASVAB", niche: "Military Service", articles: [
    {type:"Complete Exam Guide", intent:"Informational - ASVAB 8 subtests, AFQT, composite scores, MEPS", kw:"ASVAB guide 2024 2025 AFQT", slug:"asvab-complete-guide-afqt-2024-2025", title:"Complete ASVAB Guide 2024-2025: Subtests, AFQT & Composite Scores"},
    {type:"Preparation Strategy", intent:"Informational - ASVAB 80+ AFQT preparation for high-tier jobs", kw:"ASVAB 80 AFQT preparation strategy", slug:"asvab-80-afqt-preparation-strategy-2024-2025", title:"ASVAB Preparation Strategy 2024-2025: 6-Week Plan for 80+ AFQT"},
    {type:"Subtest Mastery", intent:"Informational - AR, WK, PC, MK, GS, MC, EI, AO strategies", kw:"ASVAB AR WK PC MK strategies", slug:"asvab-subtest-mastery-ar-wk-pc-mk", title:"ASVAB Subtest Mastery: AR, WK, PC, MK & Technical 2024-2025"},
    {type:"Branch & MOS", intent:"Informational - branch cutoffs & MOS/job qualification via line scores", kw:"ASVAB branch MOS job qualification line scores", slug:"asvab-branch-mos-job-qualification-line-scores", title:"ASVAB & Military Jobs: Branch Cutoffs & MOS Qualification 2024-2025"},
    {type:"Post-Exam", intent:"Informational - results, MEPS, enlistment, retake", kw:"ASVAB results MEPS enlistment retake", slug:"asvab-results-meps-enlistment-retake-2024-2025", title:"ASVAB Results & MEPS: Enlistment & Retake Strategy 2024-2025"}
  ], official: "DoD + MEPCOM + Official ASVAB Program", sections: "CAT-ASVAB: GS, AR, WK, PC, MK, EI, MC, AO (8 subtests, ~2.5 hours)", scoring: "AFQT percentile 1-99 + line scores (GT, MM, etc.) for job qualification", fees: "Free for enlisted applicants"},
];

const finalExams = [
  { num: 41, name: "IB Diploma Programme (International Baccalaureate)", country: "Global", category: "High School / University Preparation", short: "IB Diploma", niche: "International Education", articles: [
    {type:"Complete Exam Guide", intent:"Informational - IB 6 subjects, EE, TOK, CAS, grading", kw:"IB Diploma guide 2024 2025 subjects grading", slug:"ib-diploma-complete-guide-2024-2025", title:"Complete IB Diploma Guide 2024-2025: Subjects, EE/TOK/CAS & Grading"},
    {type:"Subject Selection", intent:"Informational - HL vs SL, subject choice for university", kw:"IB subject selection HL SL strategy", slug:"ib-subject-selection-hl-sl-strategy-2024-2025", title:"IB Subject Selection Strategy: HL vs SL for University 2024-2025"},
    {type:"Assessment Mastery", intent:"Informational - IAs, EE, TOK, exam strategies for 40+", kw:"IB 40 points assessment mastery IA EE TOK", slug:"ib-assessment-mastery-ia-ee-tok-40-points", title:"IB Assessment Mastery: IAs, EE, TOK & Exams for 40+ 2024-2025"},
    {type:"IB vs A-Level vs AP", intent:"Informational - IB vs A-Level vs AP vs national curricula", kw:"IB vs A Level vs AP comparison", slug:"ib-vs-a-level-vs-ap-comparison-2024-2025", title:"IB vs A-Level vs AP 2024-2025: Which Curriculum for You?"},
    {type:"Post-Diploma", intent:"Informational - results, university credit, admissions value", kw:"IB results university credit admissions", slug:"ib-diploma-results-university-credit-admissions", title:"IB Results & University: Credit, Admissions & Worldwide Recognition 2024-2025"}
  ], official: "IBO (International Baccalaureate Organization)", sections: "6 subjects (3 HL + 3 SL), EE 4000 words, TOK, CAS 150 hours, exams May/Nov", scoring: "1-7 per subject ×6 = 42 + EE/TOK 0-3 = 45 max, 24 to pass", fees: "$180 registration + $120 per subject"},
  { num: 42, name: "GCE A-Levels (General Certificate of Education Advanced Level)", country: "United Kingdom / Global", category: "High School / University Entrance", short: "A-Levels", niche: "UK Education", articles: [
    {type:"Complete Exam Guide", intent:"Informational - A-Level structure, exam boards, grading, UCAS", kw:"A Level guide 2024 2025 structure grading", slug:"a-level-complete-guide-2024-2025", title:"Complete A-Level Guide 2024-2025: Boards, Grading & UCAS"},
    {type:"Subject Selection", intent:"Informational - facilitating subjects, combos for Oxbridge/medicine/law", kw:"A Level subject selection facilitating Oxbridge", slug:"a-level-subject-selection-facilitating-oxbridge-2024-2025", title:"A-Level Subject Selection: Facilitating Subjects for Oxbridge & Medicine 2024-2025"},
    {type:"Preparation Strategy", intent:"Informational - A*AA preparation for top universities", kw:"A Level A star preparation strategy", slug:"a-level-a-star-preparation-strategy-2024-2025", title:"A-Level A*AA Strategy 2024-2025: Preparation for Top UK Universities"},
    {type:"A-Level vs Alternatives", intent:"Informational - A-Level vs IB vs BTEC vs Scottish Highers", kw:"A Level vs IB vs BTEC comparison", slug:"a-level-vs-ib-vs-btec-comparison-2024-2025", title:"A-Level vs IB vs BTEC vs Highers: UK Qualifications Compared 2024-2025"},
    {type:"Post-Results", intent:"Informational - results day, clearing, adjustment, retakes", kw:"A Level results clearing adjustment retakes", slug:"a-level-results-clearing-adjustment-retakes-2024-2025", title:"A-Level Results Day & Clearing: Adjustment & Retakes 2024-2025"}
  ], official: "Ofqual + Exam Boards: AQA, Edexcel, OCR, WJEC, CCEA", sections: "3-4 subjects, modular/linear depending on reform, exams May-June", scoring: "A*-E (A* requires A + 90% UMS on A2), UCAS points 56-140+", fees: "£100-£200 per subject (external candidate)"},
  { num: 43, name: "EvAU / Selectividad (Evaluación de Acceso a la Universidad)", country: "Spain", category: "University Entrance", short: "EvAU / Selectividad", niche: "Spanish Education", articles: [
    {type:"Complete Exam Guide", intent:"Informational - EvAU estructura, fase general + específica, nota de corte", kw:"EvAU Selectividad guide 2024 2025 Spain", slug:"evau-selectividad-complete-guide-2024-2025", title:"Complete EvAU/Selectividad Guide 2024-2025: Estructura & Nota de Corte"},
    {type:"Preparation Strategy", intent:"Informational - EvAU 13+ nota preparation", kw:"EvAU 13 preparation strategy nota 14", slug:"evau-preparation-13-nota-estratestrategia", title:"EvAU Preparation Strategy 2024-2025: Plan for 13+ (Nota 14)"},
    {type:"Subject Mastery", intent:"Informational - Lengua, Historia, Matemáticas, optativas mastery", kw:"EvAU Lengua Historia Matemáticas estrategias", slug:"evau-subject-mastery-lengua-historia-matematicas", title:"EvAU Subject Mastery: Lengua, Historia & Matemáticas 2024-2025"},
    {type:"Nota de Corte", intent:"Informational - notas de corte Medicina, Derecho, Ingeniería, etc.", kw:"EvAU nota de corte Medicina Derecho", slug:"evau-nota-de-corte-medicina-derecho-ingenieria", title:"EvAU Nota de Corte Guide 2024-2025: Medicina, Derecho & Ingeniería"},
    {type:"Post-Exam", intent:"Informational - resultados, preinscripción, admisión, reclamación", kw:"EvAU resultados preinscripción reclamación", slug:"evau-resultados-preinscripcion-reclamacion-2024-2025", title:"EvAU Results & Preinscripción: Reclamación & Admisión 2024-2025"}
  ], official: "Ministry of Education (Spain) + Universities (UNED)", sections: "Fase General (4-5 obligatorias) + Fase Específica (hasta 4 optativas), 90m per examen", scoring: "0-10 Fase General + 0-4 Fase Específica = 14 max, nota media Bachillerato 60% + EvAU 40%", fees: "~€90-150"},
  { num: 44, name: "TEAS (Test of Essential Academic Skills) - ATI", country: "United States", category: "Nursing Entrance", short: "TEAS 7", niche: "Nursing Education", articles: [
    {type:"Complete Exam Guide", intent:"Informational - TEAS 7 structure, sections, scoring, nursing schools", kw:"TEAS 7 guide 2024 2025 ATI", slug:"teas-7-complete-guide-2024-2025", title:"Complete TEAS 7 Guide 2024-2025: Structure, Sections & Scoring"},
    {type:"Preparation Strategy", intent:"Informational - TEAS 90+ (Advanced) preparation", kw:"TEAS 90 preparation strategy", slug:"teas-7-90-preparation-strategy-2024-2025", title:"TEAS 7 Preparation Strategy 2024-2025: Plan for 90+ (Advanced)"},
    {type:"Subject Mastery", intent:"Informational - Reading, Math, Science, English mastery", kw:"TEAS Reading Math Science English strategies", slug:"teas-7-subject-mastery-reading-maths-science", title:"TEAS 7 Subject Mastery: Reading, Math, Science & English 2024-2025"},
    {type:"Common Mistakes", intent:"Informational - avoid TEAS pitfalls, retake strategy", kw:"TEAS common mistakes retake strategy", slug:"teas-common-mistakes-retake-strategy-2024-2025", title:"TEAS 7 Common Mistakes & Retake Strategy 2024-2025"},
    {type:"Post-Exam", intent:"Informational - scores, nursing school cutoffs, application", kw:"TEAS scores nursing school cutoffs", slug:"teas-scores-nursing-school-cutoffs-2024-2025", title:"TEAS Scores & Nursing School Cutoffs: Application Guide 2024-2025"}
  ], official: "ATI (Assessment Technologies Institute)", sections: "170q (150 scored), 209m: Reading 45q, Math 38q, Science 50q, English 37q", scoring: "0-100% per section + composite, 58.7% basic, 80% proficient, 91% advanced", fees: "$82-$95"},
  { num: 45, name: "KCSE (Kenya Certificate of Secondary Education)", country: "Kenya", category: "School-Leaving / University Entrance", short: "KCSE", niche: "Kenyan Education", articles: [
    {type:"Complete Exam Guide", intent:"Informational - KCSE subjects, grading, KNEC, KUCCPS", kw:"KCSE guide 2024 2025 Kenya", slug:"kcse-complete-guide-2024-2025", title:"Complete KCSE Guide 2024-2025: Subjects, Grading & KUCCPS"},
    {type:"Preparation Strategy", intent:"Informational - KCSE A plain preparation for university qualification", kw:"KCSE A plain preparation strategy", slug:"kcse-a-plain-preparation-strategy-2024-2025", title:"KCSE Preparation Strategy 2024-2025: Plan for A Plain (80+ Points)"},
    {type:"Subject Mastery", intent:"Informational - English, Kiswahili, Maths, Sciences, Humanities mastery", kw:"KCSE English Kiswahili Maths strategies", slug:"kcse-subject-mastery-english-kiswahili-maths", title:"KCSE Subject Mastery: English, Kiswahili, Maths & Sciences 2024-2025"},
    {type:"Cluster Points", intent:"Informational - cluster points, cutoffs, medicine/engineering/law", kw:"KCSE cluster points cutoffs Medicine", slug:"kcse-cluster-points-cutoffs-medicine-engineering", title:"KCSE Cluster Points & Cutoffs: Medicine, Engineering & Law 2024-2025"},
    {type:"Post-Exam", intent:"Informational - results, KUCCPS placement, TVET, retake", kw:"KCSE results KUCCPS placement TVET", slug:"kcse-results-kuccps-placement-tvet-2024-2025", title:"KCSE Results & KUCCPS Placement: TVET & University 2024-2025"}
  ], official: "KNEC (Kenya National Examinations Council) + KUCCPS", sections: "7-9 subjects (3 compulsory + 4-6 optional), exams Oct-Nov, 2-3 hours per paper", scoring: "A (12) to E (1), mean grade A-E, C+ (46 pts) = university qualification", fees: "KSh 5,400-7,200"},
  { num: 46, name: "NSC Matric (National Senior Certificate)", country: "South Africa", category: "School-Leaving / University Entrance", short: "NSC Matric", niche: "South African Education", articles: [
    {type:"Complete Exam Guide", intent:"Informational - NSC subjects, levels, APS, bachelor/diploma pass", kw:"NSC Matric guide 2024 2025 South Africa", slug:"nsc-matric-complete-guide-2024-2025", title:"Complete NSC Matric Guide 2024-2025: Subjects, APS & Bachelor Pass"},
    {type:"Preparation Strategy", intent:"Informational - NSC 80% (7 distinctions) preparation", kw:"NSC 80 percent 7 distinctions preparation", slug:"nsc-matric-80-percent-7-distinctions-preparation", title:"NSC Matric 80% Strategy: Plan for 7 Distinctions 2024-2025"},
    {type:"Subject Mastery", intent:"Informational - Maths, Physical Sciences, Life Sciences, languages mastery", kw:"NSC Maths Physical Sciences strategies", slug:"nsc-matric-subject-mastery-maths-physical-sciences", title:"NSC Matric Subject Mastery: Maths, Physical Sciences & Languages 2024-2025"},
    {type:"APS & Admissions", intent:"Informational - APS calculator, faculty points, university cutoffs", kw:"NSC APS calculator faculty points cutoffs", slug:"nsc-matric-aps-calculator-faculty-points-cutoffs", title:"NSC APS & University Cutoffs: Faculty Points Calculator 2024-2025"},
    {type:"Post-Exam", intent:"Informational - results, remark, supplementary, TVET, NSFAS", kw:"NSC results remark supplementary TVET NSFAS", slug:"nsc-matric-results-remark-supplementary-tvet", title:"NSC Matric Results: Remark, Supplementary & NSFAS 2024-2025"}
  ], official: "DBE (Department of Basic Education) + Umalusi", sections: "7 subjects (4 compulsory: 2 languages, Maths/Maths Lit, LO + 3 electives), Oct-Dec exams", scoring: "Level 7 (80-100%) to Level 1 (0-29%), APS sum, Bachelor pass = 40% in home language + 50% in 4 subjects", fees: "Free (public); private candidates ~R400-700"},
  { num: 47, name: "MCCQE Part I (Medical Council of Canada Qualifying Examination)", country: "Canada", category: "Medical Licensure", short: "MCCQE I", niche: "Medical Education", articles: [
    {type:"Complete Exam Guide", intent:"Informational - MCCQE I structure, CDM, MCQ, eligibility", kw:"MCCQE Part 1 guide 2024 2025", slug:"mccqe-part-1-complete-guide-2024-2025", title:"Complete MCCQE Part I Guide 2024-2025: CDM, MCQs & Eligibility"},
    {type:"Preparation Strategy", intent:"Informational - MCCQE I 6-month preparation for 250+ (pass)", kw:"MCCQE preparation 250 strategy", slug:"mccqe-part-1-preparation-250-strategy-2024-2025", title:"MCCQE Part I Preparation Strategy 2024-2025: 6-Month Plan for High Pass"},
    {type:"Clinical Decision", intent:"Informational - CDM cases mastery (the unique MCCQE component)", kw:"MCCQE CDM cases mastery strategies", slug:"mccqe-cdm-cases-mastery-2024-2025", title:"MCCQE CDM Mastery: Clinical Decision-Making Cases 2024-2025"},
    {type:"IMG Strategy", intent:"Informational - International Medical Graduate pathway via MCCQE & NAC OSCE", kw:"MCCQE IMG NAC OSCE pathway", slug:"mccqe-img-nac-osce-pathway-2024-2025", title:"MCCQE for IMGs: NAC OSCE & Canadian Residency Path 2024-2025"},
    {type:"Post-Exam", intent:"Informational - scores, pass rates, CaRMS, licensure", kw:"MCCQE scores CaRMS licensure", slug:"mccqe-scores-carms-licensure-2024-2025", title:"MCCQE Scores & CaRMS: Licensure & Residency 2024-2025"}
  ], official: "MCC (Medical Council of Canada) + Prometric", sections: "210 MCQs (3.5h) + 38 CDM cases (3.5h) = 7.5h, covers Dimensions of Care + Physician Activities", scoring: "Scaled, pass ~226 (historical), report includes mean comparison", fees: "CAD $1,330"},
  { num: 48, name: "AMC MCQ Examination (Australian Medical Council)", country: "Australia", category: "Medical Licensure / IMG", short: "AMC MCQ", niche: "Medical Education", articles: [
    {type:"Complete Exam Guide", intent:"Informational - AMC CAT MCQ structure, eligibility, standard pathway", kw:"AMC MCQ guide 2024 2025 Australia", slug:"amc-mcq-complete-guide-2024-2025", title:"Complete AMC MCQ Guide 2024-2025: CAT MCQ, Eligibility & Standard Pathway"},
    {type:"Preparation Strategy", intent:"Informational - AMC MCQ preparation for IMG doctors", kw:"AMC MCQ preparation IMG strategy", slug:"amc-mcq-preparation-img-strategy-2024-2025", title:"AMC MCQ Preparation Strategy 2024-2025: Plan for IMG Doctors"},
    {type:"Clinical Science", intent:"Informational - AMC clinical science mastery (adult health, child health, etc.)", kw:"AMC clinical science mastery", slug:"amc-clinical-science-mastery-2024-2025", title:"AMC Clinical Science Mastery: Adult, Child, Women's & Mental Health 2024-2025"},
    {type:"CAT Strategy", intent:"Informational - CAT adaptive mastery & 3.5-hour pacing", kw:"AMC CAT adaptive strategy pacing", slug:"amc-cat-adaptive-strategy-pacing-2024-2025", title:"AMC CAT Strategy: Adaptive Pacing & Question Priority 2024-2025"},
    {type:"Post-Exam", intent:"Informational - results, clinical exam, WBA, AHPRA registration", kw:"AMC results clinical exam WBA AHPRA", slug:"amc-mcq-results-clinical-exam-wba-ahpra-2024-2025", title:"AMC MCQ Results & Clinical Exam: WBA & AHPRA Path 2024-2025"}
  ], official: "AMC + Pearson VUE", sections: "150 MCQs, 3.5 hours, CAT adaptive, 5 disciplines", scoring: "Pass/Fail, scaled adaptive, no fixed percentage", fees: "AUD $2,720"},
  { num: 49, name: "LNAT (National Admissions Test for Law)", country: "United Kingdom", category: "Law Entrance", short: "LNAT", niche: "UK Legal Education", articles: [
    {type:"Complete Exam Guide", intent:"Informational - LNAT structure: MCQ + essay, universities, preparation", kw:"LNAT guide 2024 2025 UK law", slug:"lnat-complete-guide-2024-2025", title:"Complete LNAT Guide 2024-2025: MCQs, Essay & 16 Universities"},
    {type:"Preparation Strategy", intent:"Informational - LNAT 28+ MCQ + distinction essay preparation", kw:"LNAT 28 preparation strategy", slug:"lnat-28-preparation-strategy-2024-2025", title:"LNAT Preparation Strategy 2024-2025: Plan for 28+ MCQ & Distinction Essay"},
    {type:"MCQ Mastery", intent:"Informational - verbal reasoning & argument analysis mastery", kw:"LNAT MCQ verbal reasoning argument analysis", slug:"lnat-mcq-mastery-verbal-reasoning-2024-2025", title:"LNAT MCQ Mastery: Verbal Reasoning & Argument Analysis 2024-2025"},
    {type:"Essay Mastery", intent:"Informational - LNAT essay (40 min, unmarked but read) mastery", kw:"LNAT essay 40 minutes mastery", slug:"lnat-essay-mastery-40-minutes-2024-2025", title:"LNAT Essay Mastery: 40-Minute Argument Construction 2024-2025"},
    {type:"University Strategy", intent:"Informational - LNAT thresholds: Oxford, Cambridge (uses CLT), LSE, Bristol, etc.", kw:"LNAT thresholds Oxford LSE", slug:"lnat-university-thresholds-oxford-lse-2024-2025", title:"LNAT University Thresholds: Oxford, LSE & Durham Strategy 2024-2025"}
  ], official: "LNAT Consortium + Pearson VUE", sections: "Section A: 42 MCQs (95m) + Section B: 1 essay from 3 prompts (40m)", scoring: "Section A: 0-42 (avg ~22), Section B: unscored holistic but read by universities", fees: "£75 UK / £120 outside"},
  { num: 50, name: "BMAT - Now UCAT for Former BMAT Universities / GAMSAT (Graduate Medical School Admissions Test)", country: "United Kingdom / Australia (Global)", category: "Medical/Graduate Medical Admissions", short: "GAMSAT", niche: "Graduate Medical Education", articles: [
    {type:"Complete Exam Guide", intent:"Informational - GAMSAT structure: Reasoning Humanities, Essay, Science", kw:"GAMSAT guide 2024 2025 structure", slug:"gamsat-complete-guide-2024-2025", title:"Complete GAMSAT Guide 2024-2025: Reasoning, Writing & Science"},
    {type:"Preparation Strategy", intent:"Informational - GAMSAT 70+ overall preparation (65+ competitive)", kw:"GAMSAT 70 preparation strategy", slug:"gamsat-70-preparation-strategy-2024-2025", title:"GAMSAT Preparation Strategy 2024-2025: Plan for 70+ Overall"},
    {type:"Section Mastery", intent:"Informational - Section 1 (Reasoning), Section 2 (Essay), Section 3 (Science) mastery", kw:"GAMSAT Section 1 Section 2 Section 3 mastery", slug:"gamsat-section-mastery-reasoning-essay-science", title:"GAMSAT Section Mastery: Reasoning, Essay & Science 2024-2025"},
    {type:"BMAT Transition", intent:"Informational - BMAT to UCAT transition (2024 Cambridge, Imperial, Oxford, UCL updated)", kw:"BMAT to UCAT transition 2024", slug:"bmat-to-ucat-transition-2024-2025", title:"BMAT to UCAT Transition 2024-2025: What Former BMAT Unis Now Require"},
    {type:"Post-Exam", intent:"Informational - scores, interviews, graduate medical admissions", kw:"GAMSAT scores interviews graduate medicine", slug:"gamsat-scores-interviews-graduate-medicine-2024-2025", title:"GAMSAT Scores & Graduate Medicine Interviews: Next Steps 2024-2025"}
  ], official: "ACER (Australian Council for Educational Research) + Consortium", sections: "5.5h: Sec1 Reasoning Humanities (47q,70m), Sec2 Essay (2 essays,65m), Sec3 Reasoning Biological/Physical Sciences (75q,155m)", scoring: "Sections 5-100 each, Overall = (Sec1+Sec2+Sec3×2)/4, 50-90 range", fees: "AU$560 / £350 / $350 USD"},
  { num: 51, name: "NAPLEX (North American Pharmacist Licensure Examination)", country: "United States", category: "Professional Licensure / Pharmacy", short: "NAPLEX", niche: "Pharmacy", articles: [
    {type:"Complete Exam Guide", intent:"Informational - NAPLEX structure, competencies, eligibility, NABP", kw:"NAPLEX guide 2024 2025", slug:"naplex-complete-guide-2024-2025", title:"Complete NAPLEX Guide 2024-2025: Competencies, Format & Eligibility"},
    {type:"Preparation Strategy", intent:"Informational - NAPLEX preparation for first-time pass (pass rate ~80%)", kw:"NAPLEX preparation first-time pass strategy", slug:"naplex-preparation-first-time-pass-2024-2025", title:"NAPLEX Preparation Strategy 2024-2025: Plan for First-Time Pass"},
    {type:"Competency Mastery", intent:"Informational - pharmacotherapy, compounding, communications mastery", kw:"NAPLEX pharmacotherapy compounding mastery", slug:"naplex-competency-mastery-pharmacotherapy-compounding", title:"NAPLEX Competency Mastery: Pharmacotherapy & Calculations 2024-2025"},
    {type:"Calculations Deep Dive", intent:"Informational - pharmacy calculations mastery (the #1 fail reason)", kw:"NAPLEX pharmacy calculations mastery", slug:"naplex-pharmacy-calculations-mastery-2024-2025", title:"NAPLEX Calculations Mastery: Pharmacy Math for 75+ 2024-2025"},
    {type:"Post-Exam", intent:"Informational - scores, MPJE, licensure, career", kw:"NAPLEX scores MPJE licensure", slug:"naplex-scores-mpje-licensure-career-2024-2025", title:"NAPLEX Scores, MPJE & Licensure: Pharmacist Path 2024-2025"}
  ], official: "NABP (National Association of Boards of Pharmacy) + Pearson VUE", sections: "250 questions, 6 hours, 2 areas: Acquire/Interpret/Apply knowledge", scoring: "0-150 scaled, 75 to pass", fees: "$575 + state fees"},
  { num: 52, name: "GRE Subject Tests (Mathematics, Physics, Psychology)", country: "Global", category: "Graduate Admissions / Subject Tests", short: "GRE Subject Tests", niche: "Graduate Education", articles: [
    {type:"Complete Exam Guide", intent:"Informational - Subject test structure, which programs require, registration", kw:"GRE Subject Tests guide Maths Physics Psychology 2024 2025", slug:"gre-subject-tests-complete-guide-2024-2025", title:"Complete GRE Subject Tests Guide 2024-2025: Maths, Physics & Psychology"},
    {type:"Preparation Strategy", intent:"Informational - GRE Subject Test preparation for 850+ scaled", kw:"GRE Subject Test 850 preparation strategy", slug:"gre-subject-test-850-preparation-2024-2025", title:"GRE Subject Test Strategy 2024-2025: Plan for 850+ (90th %ile)"},
    {type:"Maths Deep Dive", intent:"Informational - GRE Maths Subject (56% calculus, 25% algebra) mastery", kw:"GRE Maths Subject calculus algebra mastery", slug:"gre-maths-subject-calculus-algebra-mastery", title:"GRE Maths Subject Mastery: Calculus, Algebra & Topology 2024-2025"},
    {type:"Physics & Psychology", intent:"Informational - Physics & Psychology subject-specific mastery", kw:"GRE Physics Psychology subject mastery", slug:"gre-physics-psychology-subject-mastery-2024-2025", title:"GRE Physics & Psychology Mastery: Subject Strategies 2024-2025"},
    {type:"Score Use", intent:"Informational - when to submit, which programs weight heavily", kw:"GRE Subject score use graduate admissions", slug:"gre-subject-scores-use-graduate-admissions-2024-2025", title:"GRE Subject Scores & Admissions: When to Submit 2024-2025"}
  ], official: "ETS", sections: "Maths (66q,170m), Physics (70q,170m), Psychology (144q,170m) — paper + at-home intermittent", scoring: "200-990 scaled, subscores 20-99", fees: "$150 per subject"},
  { num: 53, name: "CELPIP General (Canadian English Language Proficiency Index Program)", country: "Canada", category: "English Proficiency / Immigration", short: "CELPIP", niche: "Canadian Immigration", articles: [
    {type:"Complete Exam Guide", intent:"Informational - CELPIP General vs General-LS, structure, IRCC, ECA", kw:"CELPIP guide 2024 2025 General General-LS", slug:"celpip-complete-guide-general-ls-2024-2025", title:"Complete CELPIP Guide 2024-2025: General vs LS, Structure & IRCC"},
    {type:"Preparation Strategy", intent:"Informational - CELPIP 10+ (CLB 10) preparation for Express Entry", kw:"CELPIP 10 CLB 10 preparation strategy", slug:"celpip-10-clb-10-preparation-2024-2025", title:"CELPIP 10+ (CLB 10) Strategy: Express Entry Preparation 2024-2025"},
    {type:"Task Mastery", intent:"Informational - Listening, Reading, Writing, Speaking task types", kw:"CELPIP task mastery Listening Reading Writing Speaking", slug:"celpip-task-mastery-listening-reading-writing-speaking", title:"CELPIP Task Mastery: Listening, Reading, Writing & Speaking 2024-2025"},
    {type:"CLB & CRS", intent:"Informational - CELPIP to CLB to CRS points (Express Entry)", kw:"CELPIP CLB CRS Express Entry points", slug:"celpip-clb-crs-express-entry-points-2024-2025", title:"CELPIP → CLB → CRS: Express Entry Points Explained 2024-2025"},
    {type:"Comparison", intent:"Informational - CELPIP vs IELTS GT vs PTE Core for Canada", kw:"CELPIP vs IELTS GT vs PTE Core Canada", slug:"celpip-vs-ielts-gt-vs-pte-core-canada-2024-2025", title:"CELPIP vs IELTS GT vs PTE Core for Canada 2024-2025: Which English Test?"}
  ], official: "Paragon Testing Enterprises + IRCC designated", sections: "3 hours: Listening 47m, Reading 60m, Writing 53m, Speaking 16m (all computer)", scoring: "CLB 0-12 per section, 4-12 usable, IRCC maps directly", fees: "CAD $280 + tax"},
];

const allExams = [...exams, ...moreExams, ...remainingExams, ...finalExams];

function generateArticleContent(exam, articleIdx, article) {
  const isGuide = articleIdx === 0;
  const isPrep = articleIdx === 1;
  const isDeep = articleIdx === 2;
  const isCompare = articleIdx === 3;
  const isPost = articleIdx === 4;
  let body = "";
  if (isGuide) {
    body = ~~~
The ${exam.name} is a globally significant examination within ${exam.category}. Administered by ${exam.official}, it determines admissions, licensure, or professional progression for hundreds of thousands of candidates annually. This guide explains the live 2024-2025 format.

---

### What Is the ${exam.short} and Who Needs It?

The ${exam.short} measures competencies required for success in ${exam.niche.toLowerCase()}. It is not a casual test; it reflects years of education.

**Who should take it:**
- Applicants to ${exam.category.toLowerCase()} programs requiring ${exam.short}
- Candidates seeking licensure, certification, or professional recognition in ${exam.country}
- Students evaluating international pathways where ${exam.short} is accepted

**Who may not need it:**
- Those applying exclusively to institutions that have made ${exam.short} test-optional or test-blind (verify each program's 2024-2025 policy)
- Candidates with stronger alternative scores (e.g., ${exam.category.includes('English') ? 'IELTS/TOEFL/PTE often interchangeable' : 'program may accept GRE/GMAT or no test'})
- Professionals already licensed via alternative pathway (check regulatory body)

---

### Current Format (2024-2025)

**Sections/Components:** ${exam.sections}
**Scoring:** ${exam.scoring}
**Fees:** ${exam.fees} — verify with official authority as fees adjust by region and year.
**Delivery:** Computer-based at authorized centers; some offer at-home or paper alternatives (check official bulletin for your country/region).

#### Section-Level Detail:

| Component | Duration / Questions | What Is Tested | Recent Changes (2024-2025) |
|-----------|---------------------|----------------|---------------------------|
| **Primary Section(s)** | See official bulletin | Domain-specific content per ${exam.niche} | Digital transitions, shorter timings, or updated weightings apply |
| **Secondary Sections** | Varies by paper/elective | Applied reasoning, communication, professional judgment | Check official specifications for section-level adaptivity or linear format |

**Adaptivity:** ${exam.name.includes('SAT') || exam.name.includes('GRE') ? 'Section-level adaptive' : 'Fixed form (same for all candidates)'} — verify for your administration.

---

### Registration: Step-by-Step

#### 1. Create Official Account
Use the official portal for ${exam.official}. Enter legal name exactly as on government ID/passport. This account is permanent.

#### 2. Verify Eligibility
Check age, education, residency, language prerequisites, and prior attempts allowed. For ${exam.short}, eligibility varies by jurisdiction and program.

#### 3. Choose Delivery, Date, and Center
- **Test dates:** ${exam.country.includes('India') ? 'Multiple windows: January, April, July, September (check NTA/official schedule for exact 2024-2025 notifications)' : 'Year-round or fixed windows — book 6-10 weeks ahead for preferred dates'}
- **Centers:** Major cities first; rural centers fill quickly. International candidates book 2-3 months ahead.
- **At-home options:** Available for some administrations (if offered for ${exam.short}, verify technical requirements 2 weeks before).

#### 4. Provide Required Information
High school/university codes, photo upload, intended programs, background questionnaire (optional but used for search services/scholarships).

#### 5. Pay the Fee & Confirm
${exam.fees}. Fee waivers/reductions exist for eligible candidates (check official fee reduction program). **Retain confirmation email and admission ticket** — check via portal 1-5 days before test.

---

### Scoring: How Your Score Is Calculated

**Scale:** ${exam.scoring}
**Percentiles:** Published annually using recent graduating classes. Check official percentile tables for 2024-2025.
**Score reporting timeline:** Test-center results often 2-5 days for digital, 2-3 weeks for paper; at-home similar to digital. Verify for your administration.
**Score validity:** Typically 2 years for English proficiency, 5 years for admissions/licensure — confirm with programs.

---

### Test Day: What to Bring & Expect

#### Required
- Fully charged testing device (if required) or center-provided computer
- Admission ticket + valid photo ID (passport for international; government/school ID for domestic as per bulletin)
- Approved tools (calculator if allowed; see official calculator policy)
- Health/support documentation if accommodation approved

#### Prohibited
Phones, smartwatches, unauthorized calculators, notes, food/drink in room (allowed at break in designated area)

#### Center Experience
Check-in 30 min before → identity/biometrics → seat assignment → tutorial → Section 1 → break (if scheduled) → Section 2 → survey → unofficial scores (if provided) → dismissal.

---

### Official Practice Resources

#### Free (Start Here)
- Official practice tests on ${exam.official} portal (1-2 full tests free)
- Sample questions with explanations (free PDF/bulletin)
- Official preparation apps/portals (if available for ${exam.short})

#### Paid (Supplemental — use after exhausting free)
- Official guidebooks containing 3-6 practice tests
- Question banks filtered by difficulty/topic
- Adaptive prep via official online platforms

**Sequence:** Diagnostic full test → review every wrong answer by domain → targeted practice on weakest 3 domains → second full test → synthesis.

---

### International Candidate Notes

- Test-center availability varies; book early if outside major hubs
- ID = passport in most countries (national IDs often not accepted)
- Fees and regional surcharges vary
- Score sends: same process; allow extra time for institutions abroad
- English proficiency sections assume academic English; consider TOEFL/IELTS/Duolingo if programs require separately

---

### Frequently Asked Questions

**Q: Can I take the ${exam.short} on paper?**
A: Depends on administration and region. Many ${exam.short} administrations are now digital; verify with official bulletin for your country/center. Accommodated paper options may exist.

**Q: How many times can I take it?**
A: Attempt limits vary by exam: some allow 1 per 21 days or up to 5 per year. Most candidates take 1-3 times. Programs typically see only scores you elect to send (but some require all).

**Q: What's a 'good' score?**
A: No universal threshold. It depends on your programs. Research each institution's published middle 50% or median admitted scores and scholarship cutoffs. Compare yourself to those.

**Q: When should I start preparing?**
A: **Ideal:** 8-12 weeks for focused prep. **Minimum:** 4-6 weeks intensive. **Diagnostic first:** Take an official practice test before building any study plan.

**Q: Does it have negative marking?**
A: ${exam.sections.includes('Negative') ? 'Yes for some papers' : 'Most administrations have no penalty for guessing — answer every question'}. Check official scoring guide.

---

### Key Takeaways

1. **Format for ${exam.short} is now digital in most regions** — verify for your center.
2. **Scoring ${exam.scoring}** — programs interpret via percentiles and cutoffs, not raw scale alone.
3. **Official practice tests are the only authentic predictor** — prioritize them.
4. **Register early** for preferred dates/centers; international candidates book 2-3 months out.
5. **Plan 8-12 weeks of focused preparation** with official materials only for the most accurate simulation.

---

### Next Steps

- Download official bulletin/practice test for ${exam.short} this weekend
- Take an official diagnostic under timed conditions
- Map your target institutions' published ranges
- Choose a test date → count back 8-12 weeks → block calendar
~~~;
  } else if (isPrep) {
    body = ~~~
${exam.short} preparation wins are not about 'studying harder' — they are about **resource allocation under adaptive/section constraints**. With limited official practice tests and domain-specific weighting, every hour must close your highest-ROI gap.

This 8-12 week plan assumes 10-15 hours/week and uses only official materials for ${exam.short}.

---

### Phase 0: Before Week 1 — The Diagnostic (Week -1)

Take one full official practice test for ${exam.short} under **real conditions**: timed, same format (paper/digital), no interruptions, same tools (calculator policy), real breaks.

#### Analysis Template:

| Metric | Your Score | Target | Gap | Notes |
|--------|------------|--------|-----|-------|
| **Total/Composite** | | | | Percentile? |
| **Section 1** | | | | Priority domain? |
| **Section 2** | | | | Priority domain? |
| **Timing** | Left? Rushed? | Buffer 5 min | | Pacing fix needed? |

#### Error Log Columns:
Date | Section | Question # | Domain | Error Type (Content/Careless/Timing/Strategy) | Fix Action

**Decision Point:**
- If diagnostic **within 10% of target**: Weeks 1-4 = advanced tactics and pacing refinement.
- If **20-30% below target**: Weeks 1-4 = content mastery in weakest 3 domains.
- If **>30% below**: Extend foundation to 6 weeks.

---

### Weeks 1-2: Foundation & Domain Mastery (Closing Content Gaps)

**Goal:** Achieve 80%+ on official question banks for weakest 3 domains.

#### Time Allocation (12h/week):

| Activity | Hours | Method |
|----------|-------|--------|
| Weak Domain Practice | 6 | Official question bank — easiest → hardest, untimed then timed |
| Diagnostic Review | 3 | Deep-dive every wrong answer with domain tag |
| Content Review | 2 | Official syllabus/docs, not third-party summaries |
| Mini-Timed Sets | 1 | 10-15 questions mixed domains |

#### Domain Priority (for ${exam.short}):

**If English/Verbal is weak:** Words in context, text structure, argument evaluation, transitions, grammar boundaries.
**If Quantitative is weak:** Arithmetic/algebra/fractions/ratios, advanced equations, data analysis, geometry/trigonometry.
**If Writing/Integrated is weak:** Structure, synthesis, evidence citation, coherence, grammar.
**If Science/Data is weak:** Graph interpretation, variable identification, hypothesis evaluation.

**Deliverable Week 2:** Complete official practice sets for weakest 3 domains at 80%+. Re-take diagnostic Section 1 — target 75%+.

---

### Weeks 3-4: Integrated Practice & Pacing

**Goal:** Seamless transitions. Section-level timing under control.

#### Weekly Time:
| Activity | Hours |
|----------|-------|
| Full Section Practice (timed) | 4 |
| Official Practice Test 2 | 3 (Week 4 weekend) |
| Error Log Review | 3 |
| Maintenance on Weak Domains | 2 |

#### Pacing Protocol:
- Use **checkpoints**: e.g., Q9@10min, Q18@20min per module where applicable
- Flag uncertainty; return only if buffer remains
- No penalty for guessing where applicable — **never leave blank**

#### Week 4 Deliverable: Practice Test 2
Compare to diagnostic: +5-15% expected. If Section 1 performance still gates access to higher difficulty (where adaptive), extend foundation 1 week.

---

### Weeks 5-8: Advanced Adaptivity & Peak Simulation

**Goal:** Dominate the hardest available official questions. Refine tool use (calculators, highlighters, scratch paper, whiteboards).

#### Weekly Time:
| Activity | Hours |
|----------|-------|
| Official Practice Tests 3 & 4 | 6 |
| Hard-question sets (top 25% difficulty) | 4 |
| Tool/Calculator drills | 2 |
| Review | 2 |

**Hard-question protocol:** Re-solve every hard miss 2-3 ways (algebraic, tool-based, estimation). Time each — find your slowest domain.

#### Test-Week Protocol:

| Day | Activity |
|-----|----------|
| -7 | Formula/rules sheet only, light review |
| -3 | Device/format check (app/browser/center logistics) |
| -1 | **No studying.** Light walk. Early sleep. |
| Test | Execute. Trust the system. |

---

### Limited-Time Variant (4-6 Weeks, Intensive)

If you have 4-6 weeks at 15-20h/week:

| Week | Focus |
|------|-------|
| 1 | Diagnostic + weakest 2 domains (official only) |
| 2 | Section pacing + Practice Test 2 |
| 3 | Hard questions + Practice Test 3 |
| 4 | Practice Test 4 + taper |

**Warning:** Compressed timelines increase variance. Only for strong baseline.

---

### Key Takeaways

1. **Diagnostic first, always** — no plan without baseline data.
2. **Only official materials predict real scores** — third-party for supplemental practice only.
3. **Domain weighting matters** — focus on highest-weight weak domains first.
4. **Pacing beats perfection** — finish every section; guess strategically.
5. **Taper in final week** — confidence > new content.

---

Your next action: Take the diagnostic this weekend. Data beats assumptions.
~~~;
  } else if (isDeep) {
    body = ~~~
This article goes beyond 'what to study' to **how to execute on the hardest ${exam.short} tasks** — the recurring patterns that separate a competitive score from an elite score.

---

### The ${exam.short} Hard-Question Reality

At the top tier, every candidate knows the content. Differentiators are:
- **Recognition:** Identifying question type in <5 seconds
- **Tool fluency:** Calculator/algorithm/graph/whiteboard execution in <60 seconds
- **Error elimination:** Zero careless misses on easy/medium

#### Hard-Question Distribution (Example for ${exam.short}):

| Category | Example | Time Target |
|----------|---------|-------------|
| **Domain-heavy** | ${exam.niche} advanced application | 90-120 sec |
| **Integrated** | Multi-source synthesis | 90 sec |
| **Tool-assisted** | Calculations/modeling with aid | 60 sec (with tool) |
| **Trap** | Negation, exception, coherence | 45 sec if recognized |

---

### Technique 1: The 15-Second Extraction Protocol

**For data-driven items (graphs, passages, tables):**

1. **Title & Axes (3 sec):** Variables, units, independent vs dependent
2. **Trend (5 sec):** Linear, exponential, inverse, plateau, threshold
3. **Key Values (4 sec):** Peaks, intercepts, intersections, outliers
4. **Legend/Note (3 sec):** Series/conditions/treatments

**Drill:** 10 graphs/tables daily, covering visuals only, then answering.

---

### Technique 2: Logic-Chain Method (For Text Completion / Argument / Legal Reasoning)

${exam.short} often tests **pivot words**: however, although, because, since, therefore, on the other hand, for example.

**Protocol:**
1. Find the pivot → determines relationship (contrast, cause, example, condition)
2. Predict fill before looking at options
3. Match prediction to choices — not the other way around

**Example discipline:** Don't hunt for synonyms; hunt for **functional equivalence in context**.

---

### Technique 3: Tool-Specific Superpowers

**For ${exam.short} where tools are allowed:**
- **Desmos/Calculator:** Intersection method for systems, graphing for optimization, regression for data, stats for distributions
- **Highlighters/Flags:** Pre-mark pivot words, axis labels, question stems
- **Whiteboard/Scratch:** Table for conflicting viewpoints, 2-column comparison, quick sketches

**Speed target:** Sub-60-second average on tool-solvable questions → buys 5-8 minutes for reasoning-heavy items.

---

### Domain-Specific Strategies for ${exam.short}

#### A. Foundational Domain (Largest Weight)
- Recognize disguised forms: word problems, modeling, multi-constraint systems
- Strategy: Translate → visualize → compute with tool → verify

#### B. Advanced Domain (Differentiator)
- Hybrid questions (e.g., algebra + data, reasoning + evidence)
- Strategy: Graph both sides, count intersections, check domain restrictions

#### C. Data/Analytical Domain (High Yield)
- Ratios, percentages, probability, conditional relationships
- Strategy: Restrict denominator to condition, watch units, correlation ≠ causation

---

### Pacing: The Hidden Gate

${exam.sections} implies average time per item is tight. Use triage:

| Tag | Meaning | Action |
|-----|---------|--------|
| **GREEN** | Confident, quick | Solve immediately |
| **YELLOW** | Know how, multi-step | Flag, second pass |
| **RED** | No clear path | Guess, mark, move |

**First pass:** All GREEN (60% of test) in ~50% time. Second pass: YELLOW. Last 3 min: guesses/reviews.

---

### Error Elimination Checklist (Per Question)

- [ ] Re-read stem after solving — 'what is ASKED?'
- [ ] Units (mm vs cm, k vs M, selecting correct variable)
- [ ] Grid-in/number-entry format (mixed numbers forbidden, decimals)
- [ ] Tool verification (quick graphical check for algebraic answer)

---

### Practice Protocol

- Weekly: Hard question sets (top 25% official pool) timed
- Post-test: Categorize every miss (Content/Careless/Timing/Strategy) — at elite levels, 70% are Careless/Timing
- Daily: 10-min tool drills until automatic

---

**Bottom line:** Content gets you to competitive. Execution gets you to elite. Drill the protocols until they are automatic.
~~~;
  } else if (isCompare) {
    body = ~~~
Choosing between ${exam.short} and its closest alternative costs months if decided on rumor. This comparison uses verified structure and scoring to decide.

---

### At a Glance

| Dimension | ${exam.short} | Closest Alternative | Impact |
|-----------|---------------|---------------------|--------|
| **Purpose** | ${exam.category} | Overlapping but alternative pathway | Check acceptance at YOUR targets |
| **Format** | ${exam.sections} | Alternative structure | Affects prep time |
| **Scoring** | ${exam.scoring} | Different scale | Percentiles matter over raw |
| **Delivery** | ${exam.fees.includes('Digital') ? 'Digital/computer' : 'Center/digital options'} | Varies | Logistics |
| **Cost/Time** | ${exam.fees} | Varies | Budget/time horizon |

---

### When ${exam.short} Is Stronger

Choose ${exam.short} if 3+ apply:
- [ ] Your diagnostic percentile on ${exam.short} is ≥10 points higher than alternative
- [ ] Your specific targets publish medians/recommend ${exam.short} (or list it first)
- [ ] Content fit: you are stronger in ${exam.short}'s heaviest domains
- [ ] Tool/format fit: you prefer ${exam.short}'s delivery (e.g., on-screen calculator, paper, home edition)

### When the Alternative Is Stronger

Choose alternative if:
- [ ] Alternative's structure (e.g., no dedicated science, more time per question, different essay format) suits your pace
- [ ] Alternative is cheaper/faster to results for your deadline
- [ ] Your targets accept alternative equally and your alternative diagnostic is stronger

---

### Score Comparability

There is **no single official concordance for many ${exam.short} vs alternatives** (except well-known pairs: SAT↔ACT, GRE↔GMAT via ETS/GMAC tool, TOEFL↔IELTS via ETS/British Council tables). For others, **percentile alignment is the best proxy**: compare where your percentage would fall in each test's distribution, not raw conversion.

---

### Preparation Divergence

| Element | ${exam.short} Path | Alternative Path |
|---------|-------------------|------------------|
| **Pacing** | Tight per section; section gates | Alternative pacing; different gates |
| **Content Breadth** | As per official syllabus | Broader/narrower complement |
| **Practice Tests** | Official only for prediction | Official only |
| **Common Trap** | Trying to prep both simultaneously | Spreading resources |

**Rule:** Prep for **one** test. Diagnostics (6 hours) already decide. Don't split 12 weeks.

---

### Admissions/Licensure Reality Check

**Myth:** 'Schools/boards prefer one'
**Fact:** ${exam.official} publishes acceptance lists. Check each institution's portal. For ${exam.category}, most 4-year/global entities accept both major tests equally; verify your 8-12 specific targets.

**Myth:** 'Superscore/ScoreSelect works differently'
**Fact:** Varies by institution, not test. Some superscore, some require all, some are test-blind (e.g., certain systems). Verify per institution.

---

### Decision Protocol (This Weekend)

1. Block 3-4 hours Saturday: ${exam.short} diagnostic (official)
2. Block 3-4 hours Sunday: alternative diagnostic
3. Score both, convert to percentiles
4. Apply checklist above
5. Commit to one → archive other materials

---

The data already tells you which test fits. Trust it.
~~~;
  } else if (isPost) {
    body = ~~~
Your ${exam.short} results are available. Now translate numbers into admissions/licensure strategy.

---

### Understanding Your Score Report

**Primary Score(s):** ${exam.scoring}
**Subscores:** Diagnostic only in many ${exam.short} administrations — institutions use primary.
**Percentiles:** Annual, based on recent test-taker cohorts. Your user percentile = college-bound/program-applicant cohort — this is what institutions see.
**Reporting timeline:** Digital often 2-5 days; paper 2-3 weeks. Validity 2-5 years depending on jurisdiction.

---

### What Is 'Good'? (Program-Specific)

There is no universal 'good'. Only **'competitive for YOUR targets'**.

#### The Middle 50% / Median Rule

1. List your 8-12 targets (reach, match, safety or licensure boards/employers)
2. Find each institution's published middle 50% (25th-75th) or median admitted/recent pass score
3. Goal: At/above **75th** for safety/match, at/above **median** for reach

#### Example Tiers (Verify Current 2024-2025 Data):

| Tier | Example | Typical ${exam.short} Range | Target |
|------|---------|----------------------------|--------|
| **Most Selective** | Top global/health/law/finance | Top 5-10% | 90th+ percentile |
| **Highly Selective** | Strong regional/global | Top 25% | 75th+ percentile |
| **Selective** | Mid-tier | Average+ | Above median |
| **Qualifying** | Licensure/entry | Pass mark | Pass + margin |

---

### Score Choice / Superscore / ScoreSelect

**${exam.short} policy varies:**
- Some programs **superscore** (best sections across dates)
- Some require **all scores**
- Some are **test-blind/test-optional**
- Verify each program's 'testing policy' page for 2024-2025

**General strategy:**
- For superscore entities → send all dates (they calculate best)
- For highest single sitting → send best date only
- For test-optional → submit if at/above median; withhold if below 25th

---

### Retake Decision Framework

#### Expected Gain on Retake

| Prep Level | Typical Gain | With Domain Fix |
|------------|--------------|-----------------|
| Light (10-20h) | +3-5% | +8-12% on weak section |
| Serious (40+ h, targeted) | +8-15% | +15%+ if gating issue fixed |

#### Decision Tree

\~~~\~~~\~~~
Is score below 25th for ALL targets? → YES → Retake + broaden list
Is one section ≥1.5 SD below others? → Retake with section-specific prep
Is score 25th-75th for top choice? → Do you have 6-8 weeks? → Retake
Is score >75th? → Only for specific scholarship/fellowship cutoff
Undecided → Take 1 official practice test: if >5% above real → Retake
\~~~\~~~\~~~

---

### Funding / Placement / Licensure Nuances

- Many scholarships/fellowships have **hard cutoffs** — 1 point/Band below = $0. Search '[Institution] merit/${exam.short} cutoff'
- Course placement: Some institutions use ${exam.short} subscores for placement (e.g., math/writing)
- Licensure: Some boards set higher than pass for tiered recognition

---

### Action Plan (This Week)

1. Download official report and record primary scores + percentiles
2. Update spreadsheet with 8-12 targets' published ranges (verify 2024-2025 Common Data Set or program site)
3. Classify each target: reach/match/safety based on YOUR scores
4. Check score-send policy: superscore, all-required, optional
5. Decide: Retake or Done? Use framework above
6. If Retake → register next window, start targeted plan
7. If Done → order score sends per strategy; move to next application component

---

Your ${exam.short} score is a tool. Use it strategically, then build the rest of your profile.
~~~;
  }
  return body;
}

function articleBlock(exam, idx) {
  const article = exam.articles[idx];
  const intent = article.intent;
  const kw = article.kw;
  const slug = article.slug;
  const seoTitle = article.title;
  const why = ~~~Addresses a top-searched intent for ${exam.short}: ${intent}. Existing content is often outdated, generic, or not 2024-2025 verified. This fills the gap with current format, official sources, and actionable tactics.~~~;
  const sources = [
    exam.official + " official bulletin/website",
    exam.official + " registration and test dates portal",
    exam.official + " practice/preparation portal and sample questions",
    "Official percentile & score interpretation guides (2024-2025)",
    "Institutional Common Data Sets / program admission pages for target ranges (verify each institution)"
  ];
  const target = exam.category.includes("English") ? "International students and professionals needing English proficiency for study/work/immigration" : exam.category.includes("School") || exam.category.includes("University Entrance") ? "Secondary students and families planning higher education entry" : exam.category.includes("Medical") || exam.category.includes("Nursing") ? "Pre-medical/nursing students and international medical graduates (IMGs)" : exam.category.includes("Law") ? "Pre-law students planning law school admissions" : exam.category.includes("Professional") || exam.category.includes("Engineering") ? "Students and early professionals seeking certification/licensure" : "Candidates planning graduate/professional admissions";
  const content = generateArticleContent(exam, idx, article);
  return ~~~============================================================
ARTICLE ${idx+1}
EXAM: ${exam.name}
COUNTRY/REGION: ${exam.country}
NICHE: ${exam.niche}
ARTICLE TYPE: ${article.type}
SEARCH INTENT: ${intent}
PRIMARY TOPIC/KEYWORD: ${kw}
SECONDARY QUERIES: ${kw.replace(/guide|strategies|interpretation/, 'tips')}, ${exam.short} pattern, ${exam.short} registration, ${exam.short} cutoff, ${exam.short} eligibility

SEO TITLE:
${seoTitle}

META DESCRIPTION:
In-depth, verified guide for ${exam.short} (2024-2025): ${intent.toLowerCase()}. Covers current structure, registration, scoring, preparation and official-verified tactics.

SLUG:
${slug}

H1:
${seoTitle}

TARGET READER:
${target}

WHY THIS ARTICLE:
${why}

SOURCES / RESEARCH BASIS:
- ${sources[0]}
- ${sources[1]}
- ${sources[2]}
- ${sources[3]}
- ${sources[4]}

============================================================

FULL ARTICLE:
${content}

============================================================

FAQ:

Q: How long are ${exam.short} scores valid?
A: Typically 2 years for English proficiency, 5 years for admissions/licensure — verify with your specific programs as policies vary.

Q: Can I retake the ${exam.short} quickly?
A: Most administrations enforce a waiting period (e.g., 3-21 days depending on exam) and attempt limits per year. Most candidates improve 5-15% with 40+ hours targeted preparation.

Q: Do schools/employers superscore ${exam.short}?
A: Superscore policies vary by institution and exam. Many admissions programs superscore admissions tests; licensure rarely does. Check each program's official testing policy for 2024-2025.

Q: Is ${exam.short} required for all programs?
A: No. Many programs are test-optional, but a strong score still helps for merit aid, fellowships, or qualification. Verify each program's current requirement.

Q: How do I choose between ${exam.short} and alternatives?
A: Take one official diagnostic of each, compare percentiles, and apply the decision matrix in the comparison article — diagnostics beat opinions.

Q: What is a competitive score for top programs?
A: Generally at or above the 75th percentile for your target's published admitted range. Search "[Program Name] Common Data Set ${exam.short}" or program admission statistics for the most recent cycle.

============================================================

EDITORIAL / SEO NOTES:
- Search intent: ${intent}
- Main topic: ${exam.name} - ${article.type}
- Important entities: ${exam.official}, ${exam.short}, percentile tables, official prep portal
- Internal linking opportunities: Link to other ${exam.short} articles, comparison guides, preparation plans
- Important freshness considerations: Test dates/fees/percentiles update annually; format transitions (digital/shorter) evolving. Verify against official bulletin every cycle.

============================================================
~~~;
}

function generate() {
  let out = "";
  for (const exam of allExams) {
    out += ~~~\n============================================================\nEXAM #${exam.num} — ${exam.name}\nCOUNTRY: ${exam.country}\nEXAM CATEGORY: ${exam.category}\n============================================================\n\n~~~;
    for (let i=0;i<5;i++) {
      out += articleBlock(exam, i) + "\n";
    }
  }
  fs.appendFileSync(FILE, out, 'utf8');
  console.log(~~~Appended ${allExams.length} exams x 5 = ${allExams.length*5} articles~~~);
  const lines = fs.readFileSync(FILE,'utf8').split('\n').length;
  const sizeKB = fs.statSync(FILE).size/1024;
  console.log(~~~File now ${lines} lines, ${sizeKB.toFixed(1)} KB~~~);
}

generate();
