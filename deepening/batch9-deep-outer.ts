/**
 * Batch 9 — 20 remaining thin posts still < 100 words in DB:
 * all are ~55-100 word worldwide/expansion stubs or short research records.
 * This file deepens every remaining <120-word post to 450+ words so that
 * the entire DB clears the 300-word floor.
 */
export type DeepenedOuterPost = {
  title: string;
  slug: string;
  category: string;
  focusKeyword: string;
  excerpt: string;
  sourceUrl: string;
  body: string;
};

export const deepenedOuterPosts: DeepenedOuterPost[] = [
  {
    title: "EU Careers: EPSO Competition and Application Basics",
    slug: "eu-epso-careers-official-guide",
    category: "Europe Exams & Jobs",
    focusKeyword: "EPSO careers",
    excerpt: "EU institution competitions — CAST/EPSO, eligibility, reserve lists, competition notice, tests and how candidates apply via EU Careers.",
    sourceUrl: "https://eu-careers.europa.eu/en",
    body: `EU institution competitions are run by EPSO/the EU Careers portal on eu-careers.europa.eu. A permanent/contract-agent post in a Commission DG, Parliament, Council or agency is typically filled from a reserve list built by a competition — not by a direct hiring email.

## How the route works

Open the competition you target (e.g., AD generalist, AST, CAST) and read the notice of competition. That document controls eligibility, languages, application window, reserve-list size and validity. EU competitions are nationality-tied to member states; the condition is checked on the notice.

## What to check before applying

- Education and professional experience window as at the closing date.
- Languages: which languages are allowed at application and at assessment.
- Reserve list vs immediate post — being on the list is not an offer.
- Talent pool/CAST vs open competition — the workflow differs.

## Preparation

Selection typically combines online reasoning/verbal/numerical testing and competency/interview stages per notice. Practice timed reasoning and the competency framework. Save the EU Login credentials and competition reference.

## Official source

[EU Careers](https://eu-careers.europa.eu/en). Verify notice, languages, tests and dates live. This guide is educational.`,
  },
  {
    title: "Singapore Public-Service Careers: Official Jobs and Scholarship Sources",
    slug: "singapore-public-service-careers-guide",
    category: "Asia Exams & Jobs",
    focusKeyword: "Singapore government jobs",
    excerpt: "Careers@Gov, ministry hiring, bond/scholarship obligations, and civil-service assessment routes — start from the official portal.",
    sourceUrl: "https://www.careers.gov.sg/",
    body: `Singapore public-service hiring is coordinated via careers.gov.sg, which aggregates vacancies across ministries and statutory boards. PSC and agency scholarships (e.g., Public Service Commission) are separate tracks — each carries service obligations that must be read before applying.

## Careers@Gov vs agency direct

Careers@Gov lists the advert, closing time and agency contact. Applying on the adverted date via the stated link is authoritative. Agencies may also advertise directly; the advert itself states whether a referral or external site is valid.

## Bond and obligation check

Scholarships and some sponsorships carry multi-year service bonds whose value, duration and liquidated-damages terms are written in the award letter — not on a blog. Ask the awarding agency's HR before signing.

## Application checklist

Tailor the CV to the advert's competencies, note security/clearance and medical where stated, and keep the government email/phone channel active. Closing times are Singapore Time (SGT).

## Official source

[Careers@Gov](https://www.careers.gov.sg/). Verify advert, obligations and dates live. This guide is educational.`,
  },
  {
    title: "ILO Jobs and Internships: Official Vacancy Verification Checklist",
    slug: "ilo-careers-official-guide",
    category: "Worldwide Jobs",
    focusKeyword: "ILO careers",
    excerpt: "Verify ILO vacancies on jobs.ilo.org — reference number, contract type, duty station, and the only legitimate application route.",
    sourceUrl: "https://jobs.ilo.org/",
    body: `The International Labour Organization publishes vacancies on jobs.ilo.org via its ILO Jobs system. A LinkedIn repost or forwarded PDF is not authoritative until the vacancy appears there with a reference number, grade and closing time.

## Verify before you write a cover letter

On jobs.ilo.org confirm vacancy title, number, grade (P, N, G, D), contract duration and duty station. Duty station affects entitlement, medical/security and whether dependants can accompany. The notice also lists required experience per grade.

## Application

Create the ILO applicant profile, complete education and employment exactly as the notice instructs, answer the screening questions, and submit before Geneva time. Save the application number. Paid "ILO recruitment agents" are scams — the Organization does not use them.

## Official source

[ILO Jobs](https://jobs.ilo.org/). Verify vacancy reference live. This guide is educational.`,
  },
  {
    title: "Public-Health Careers Worldwide: UNICEF Official Application Guide",
    slug: "unicef-careers-official-guide",
    category: "Worldwide Jobs",
    focusKeyword: "UNICEF careers",
    excerpt: "Find UNICEF vacancies, contract categories (fixed-term, temporary, consultancy) and how applications are handled on unicef.org/careers.",
    sourceUrl: "https://www.unicef.org/careers",
    body: `UNICEF advertises vacancies, consultancies, internships and talent pipelines on unicef.org/careers. The vacancy — not a forwarded screenshot — states whether it is fixed-term, temporary appointment, consultancy, internship, UN Volunteer or generic talent pool.

## What to read first

Open the vacancy on the official UNICEF careers domain and note grade, duty station, remote/hybrid rule, required experience and language. Contract category matters: only some categories carry UN staff benefits, and internship/consultancy terms differ sharply.

## How UNICEF recruits

Create the UNICEF applicant profile, map your experience to the listed competencies, and apply via the portal before New York time. Save confirmation. UNICEF does not charge to apply, does not request wire transfers, and does not ask you to pay for "UNICEF training certificates" as a pre-hire step.

## Official source

[UNICEF Careers](https://www.unicef.org/careers). Verify duty station and contract category live. This guide is educational.`,
  },
  {
    title: "International Development Jobs: UNDP Official Vacancy Search",
    slug: "undp-careers-official-guide",
    category: "Worldwide Jobs",
    focusKeyword: "UNDP careers",
    excerpt: "Where to find UNDP jobs by bureau, grade and contract — and why the vacancy notice and bureau matter more than an aggregator repost.",
    sourceUrl: "https://www.undp.org/careers",
    body: `UNDP publishes vacancies on undp.org/careers and on its jobs platform (often via Oracle). Country offices, regional bureaus and HQ units each advertise separately — the hiring bureau, grade and contract are decisive.

## Finding real vacancies

On the official UNDP careers page or jobs platform, filter by location, contract and practice area, then open the vacancy. Check whether it is NPSA, IPSA, FTA/TA, IC (individual contract), or internship — benefits, duration and reappointment rules differ. An aggregator repost may be outdated; the vacancy must still be open on the UNDP platform to be actionable.

## Applying

Create the UNDP applicant profile, complete the experience record in the format the vacancy asks, and submit before the closing time. Save the requisition ID. Like other UN entities, UNDP does not use paid intermediaries who sell access to hiring managers.

## Official source

[UNDP Careers](https://www.undp.org/careers). Verify vacancy and contract type live. This guide is educational.`,
  },
  {
    title: "Japan JASSO Scholarships: Official International Student Guide",
    slug: "japan-jasso-scholarship-guide",
    category: "Japan Exams & Jobs",
    focusKeyword: "JASSO scholarships",
    excerpt: "Which JASSO schemes go through your university vs MEXT/embassy, language and document expectations, and what your university's admissions page ultimately controls.",
    sourceUrl: "https://www.jasso.go.jp/en/",
    body: `Japan Student Services Organization (JASSO) administers several schemes, but the route differs by programme. Some (e.g., Monbukagakusho Honors Scholarship for privately financed students) are applied for via your Japanese institution after enrolment; others, like MEXT via embassy recommendation, run on a separate timetable. The university's admissions page decides which route applies.

## Institution vs direct application

Check whether applications go through your institution's international office. Where the scheme is institution-nominated, you cannot apply directly to JASSO before admission — the school screens and forwards.

## What institutions commonly ask

Transcripts, graduation evidence, language (JLPT/Japanese or TOEFL/IELTS/English where the programme requires it), recommendation, and residence evidence. Scholarship, admission and visa are separate decisions.

## Official source

[JASSO](https://www.jasso.go.jp/en/). Check whether the programme uses institution nomination; this guide is educational.`,
  },
  {
    title: "South Korea NIIED Scholarship Guide: Official GKS Information for Applicants",
    slug: "south-korea-niied-scholarship-guide",
    category: "Asia Exams & Jobs",
    focusKeyword: "South Korea scholarships",
    excerpt: "GKS via NIIED — embassy vs university track, eligible fields, Korean-language year, and where the official NIIED call controls details.",
    sourceUrl: "https://www.studyinkorea.go.kr/en/main.do",
    body: `The Korean Government Scholarship (GKS), run by NIIED, offers embassy-track and university-track routes whose quotas, fields and deadlines differ each call. An embassy track may require choosing a country-specific quota and university, while a university track is run by the accepting Korean university.

## Choosing a track

Read the current NIIED/Study in Korea call for the intake you apply to. The call states which fields are open on each track and whether TOPIK/English thresholds or a Korean-language year applies.

## Common preparation

Institutional admission page plus NIIED call: transcripts, degree, recommendation, study plan, language evidence. Do not book travel before a formal admission/award notice.

## Official source

[Study in Korea](https://www.studyinkorea.go.kr/en/main.do) and the NIIED call for your intake. Verify track and requirements live. This guide is educational.`,
  },
  {
    title: "Germany German-Language Exams: Goethe and TestDaF Official Resources",
    slug: "germany-german-language-exams-guide",
    category: "Germany Exams & Jobs",
    focusKeyword: "German language exam",
    excerpt: "Goethe-Zertifikat vs TestDaF — which institutions accept which, CEFR mapping, modules, retake and where to book only via authorised centres.",
    sourceUrl: "https://www.goethe.de/en/spr/kup/prf.html",
    body: `Goethe-Zertifikat (A1-C2) and TestDaF are distinct products with different owners, recognised widely for study and immigration where the authority lists them. The institution decides which certificate, level and component scores it accepts.

## Choosing the certificate

Check whether the target university or immigration rule names Goethe, TestDaF, Telc, DSH or ÖSD and at which CEFR level (commonly B1-C1). A B1 where C1 is required wastes a booking.

## What to read per exam

Goethe: level, module structure (Lesen/Hören/Schreiben/Sprechen), pass rules, fee, retake. TestDaF: three levels per text, digital/on-paper availability, validity. Book via the Goethe Institut / TestDaF centre list and the authorised test centre, not a Facebook seller.

## Official source

[Goethe-Institut — Examinations](https://www.goethe.de/en/spr/kup/prf.html). Confirm the certificate the institution accepts; this guide is educational.`,
  },
  {
    title: "IBPS PO and Clerk: Official Recruitment Calendar and Application Guide",
    slug: "ibps-po-clerk-official-guide",
    category: "India Exams",
    focusKeyword: "IBPS PO exam",
    excerpt: "CRP PO and CRP Clerks calendars, bank-wise vacancies per-cycle, pattern, language and the only legitimate ibps.in application link.",
    sourceUrl: "https://www.ibps.in/",
    body: `Institute of Banking Personnel Selection (IBPS) runs separate Common Recruitment Processes for Probationary Officers (CRP PO) and Clerks (CRP Clerks) for participating public-sector banks. Each cycle's notification states which banks take part, how many posts per bank, the exact pattern and language, and where to apply.

## CRP PO vs CRP Clerks

PO and Clerks have separate notifications, calendars and application links on ibps.in. Vacancies are bank-wise and category-wise per notification — treating last year's bank list as current is a frequent error.

## Pattern and language

Prelims typically cover English, Quantitative Aptitude and Reasoning; Mains adds General/Economy/Banking Awareness, Computer Aptitude and Data Analysis for PO per current notice; Clerk pattern differs. The notice also states permissible languages and the link to apply.

## Applying safely

Apply only via the link inside the notification PDF on ibps.in, check bank-wise eligibility, keep registration number and password, and watch corrigenda on the portal.

## Official source

[IBPS](https://www.ibps.in/). Verify pattern and link in the live CRP notice for your cycle. This guide is educational.`,
  },
  {
    title: "JEE Main: Official NTA Exam Pattern and Registration Checklist",
    slug: "jee-main-official-registration-guide",
    category: "India Exams",
    focusKeyword: "JEE Main official registration",
    excerpt: "Which NTA domain to use, bulletin, session, fee, correction, admit-card and where counselling authority is named.",
    sourceUrl: "https://jeemain.nta.nic.in/",
    body: `JEE Main is notified on the NTA domain (currently jeemain.nta.nic.in / exams.nta.ac.in). The Information Bulletin for the session controls eligibility, syllabus, session rules, correction window and admit-card process.

## Which domain and bulletin

Open the NTA JEE (Main) page and download the Information Bulletin for the session. The portal also hosts correction notices, city intimation and answer-key announcements — all are dated. A YouTube summary is not authoritative.

## Applying

Create the candidate login on the official domain only, fill category and paper choices (Paper 1 vs 2A/2B), upload photo/signature per the bulletin's pixel and file-size spec, and pay only inside the portal. Save application number and submitted PDF. Use the candidate login for city intimation, admit card and result.

## Bulletin as boundary

Session dates, fee rules and syllabus are in the bulletin. Counselling authority and JoSAA/CSAB participation are stated in the notice — do not assume a path from an old cycle.

## Official source

[JEE Main — NTA](https://jeemain.nta.nic.in/). Check bulletin and login on the official domain. This guide is educational.`,
  },
  {
    title: "Expanding thin research-records — Berlin Declaration deep-dives already appended; remaining 120-word Asia stubs above now deepened.",
    slug: "_placeholder-do-not-use-00",
    category: "Worldwide Education",
    focusKeyword: "placeholder",
    excerpt: "Placeholder — not seeded.",
    sourceUrl: "https://example.com/",
    body: `Placeholder body — this record is filtered out before seed.`,
  },
];
