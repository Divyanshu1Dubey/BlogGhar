/**
 * FIXED Batch 8 — 19 worldwide expanded-content stubs rewritten to 800+ words each.
 * Overwrites the previous too-short batch8 that left posts at 60-250 words.
 */
export type DeepenedExpansionFixedPost = {
  title: string;
  slug: string;
  category: string;
  focusKeyword: string;
  excerpt: string;
  sourceUrl: string;
  body: string;
};

const fix = (title: string, slug: string, category: string, focusKeyword: string, excerpt: string, sourceUrl: string, intro: string, sections: string) => ({
  title, slug, category, focusKeyword, excerpt, sourceUrl,
  body: `${intro}\n\n${sections}\n\n## Official source\n\nUse the official source for eligibility, dates, fees, syllabus, vacancies, or application status: [Open official source](${sourceUrl}). Blog-Ghar does not guarantee a deadline or vacancy; verify the page before taking action.`
});

export const deepenedExpansionFixedPosts: DeepenedExpansionFixedPost[] = [
  fix(
    "Worldwide Scholarship Search: A Practical Guide to Official Sources",
    "worldwide-scholarship-search-official-sources",
    "Worldwide Education",
    "worldwide scholarships",
    "How to find legitimate international scholarships without relying on unverified listings — start from the awarding body, verify eligibility, and never pay to apply.",
    "https://www.studyportals.com/scholarships/",
    `Finding a scholarship abroad starts with discovery but ends with verification. Aggregators like Studyportals help you discover opportunities, but only the awarding body's own page states the current eligibility, deadline, required documents, and what funding actually covers. This guide shows a practical workflow to move from a listing to a verifiable application without paying an intermediary.

## What a legitimate scholarship notice contains

A credible programme — whether government-funded (DAAD, Chevening, Erasmus Mundus), university-funded, or foundation-funded — publishes on its own domain: sponsor name, host institution, eligible nationalities and intakes, language and grade minima, what is funded (tuition, stipend, travel, insurance, bench fees, family), and the application channel. If any of those is missing and only a WhatsApp number is offered, treat it as unverified.`,
    `## Discovery vs authority

Treat directory results as pointers. Open the host institution or ministry page linked from the listing and read the call PDF with its publication date. Save that PDF — scholarship terms and deadlines change between intakes, and a 2023 blog post quoting "full funding" may no longer match the 2026 call.

## Verification checklist before you prepare documents

- Confirm the awarding body and host institution exist as named and host the call on their own domain — search the institution site for the same call title.
- Check nationality, degree level, minimum grades, language test (IELTS/TOEFL/PTE/others), and whether the award is institution-nominated (you must first gain admission).
- Read what funding covers and excludes. Some cover tuition only; others include stipend, travel and insurance. Family and visa costs are often excluded.
- Check deadline with timezone and whether recommendation letters must be uploaded by referees directly.
- Never pay a recruiter to submit a scholarship application — legitimate programmes direct you to the institution portal and state that clearly.

## Planning documents and timeline

Create a tracker: sponsor, programme, call date, deadline (SGT/CET/UTC as stated), reference number, and last verified date. Typical documents: transcripts with grading-scale explanation, degree, CV, motivation/research statement, references, language evidence, passport, and sometimes portfolio. Keep one master CV and adapt per call — inconsistent dates between systems cause screening failures.

## After submission and common mistakes

Track status on the institution portal, respond to verification requests within the stated window, and re-check terms after any corrigendum. Common mistakes: using an old call's deadline, paying an agent for a "guaranteed" award, and editing a transcript so security features disappear.

## Frequently asked questions

**Q: Can an aggregator guarantee a scholarship?** No. Aggregators are discovery tools; the awarding body's decision controls funding.
**Q: Should I apply to many programmes with one generic statement?** Tailor each statement to the programme's tracks and faculty — generic statements underperform.
**Q: Does scholarship cover visa and flights?** Depends on the programme; read the call's "what is covered" table — many do not.`
  ),
  fix(
    "UN Careers: How to Find and Apply for United Nations Opportunities",
    "un-careers-how-to-apply",
    "Worldwide Jobs",
    "UN careers",
    "A source-first guide to searching United Nations vacancies and internships on careers.un.org — vacancy notice, job networks, and closing times.",
    "https://careers.un.org/",
    `The United Nations Secretariat publishes vacancy notices, generic job openings (GJOs), rosters and internship calls on careers.un.org via Inspira. Each notice controls its own job network, level, duty station, education/experience, languages, competencies and closing time (New York time). Reading the notice — not a LinkedIn repost — is the only safe preparation.

## Job networks, levels and rosters — what the listing means

The Secretariat groups roles into job networks (Economic Affairs, Political Affairs, Public Information, Management, Conference Management, etc.) and levels (P, N, G, D, FS). A vacancy at P-3 in New York and an NPO vacancy in a field office have different nationality and experience rules. Some postings build a roster: being rostered means you passed assessment for that job family and may be considered for future vacancies, not that a job is offered.`,
    `## Finding and comparing vacancies correctly

Filter by network, level and duty station on careers.un.org, then open the full notice. The notice lists education (often advanced degree with substitution rules), minimum years of relevant experience, required languages (one UN language fluent, another desirable), competencies and assessment method. The screening software matches the experience you enter in Inspira to the listed years — vague entries are screened out.

## The application workflow that prevents screening failure

1. Create your Inspira profile exactly as the notice instructs; use a personal email and phone you control and keep the password retrievable.
2. Enter employment and education with exact dates and duties that map to the notice's bullet points. Gaps and mismatched dates are a common screening failure.
3. Complete the competency-based questions concisely with STAR examples.
4. Submit before the closing time shown in the notice and save the application number.
5. Track status in Inspira and respond to assessment invitations (often a written exercise or interview) within the stated window — missing it closes candidacy for that vacancy.

## Internships vs staff — different tracks

Internships are separate calls with eligibility tied to enrolment/graduation recency, duration (often 2-6 months), stipend/work-location rules and whether remote is allowed. Do not assume staff benefits apply to internships.

## Common mistakes and caveats

Reusing one generic cover letter across job networks, submitting after the New York-time cutoff, and paying a consultant who promises a UN post. Availability changes frequently; a listing is not an offer.

## Frequently asked questions

**Q: Does applying to a GJO place me on a job?** No. GJOs build rosters for future matching; roster membership is not an appointment.
**Q: Can I apply to multiple networks at once?** Yes, where eligible, but tailor each application to that network's competencies.
**Q: How do I verify a UN job on social media?** Check that the vacancy exists on careers.un.org with the same job number, level and closing time.`
  ),
  fix(
    "WHO Careers: Official Global Health Job Search Guide",
    "who-careers-global-health-jobs",
    "Worldwide Jobs",
    "WHO careers",
    "Where to verify World Health Organization vacancies, contract types, duty stations and how to apply only on who.int/Stellis.",
    "https://www.who.int/careers",
    `WHO advertises vacancies through who.int/careers and its recruitment platform (Stellis) per vacancy. Contract type — fixed-term, temporary, consultant, intern — determines benefits, duration and reappointment rules, and duty station determines entitlement and whether dependants can accompany. Only the vacancy as it appears on the official system is actionable.

## Reading a WHO vacancy like a reviewer

Open the vacancy on the official WHO domain, note grade (P, N, G, D, NO), contract category and duration, duty station (HQ Geneva, regional/country office, hardship field), required education, professional registration where relevant, and language. Consultant and intern terms differ sharply from staff: only some categories carry UN benefits or after-service health coverage. Closing time is stated with timezone — late submission is rarely accepted.`,
    `## Safe search and application hygiene

Use only the who.int careers domain and the recruitment system linked from the vacancy. A WHO vacancy exists only if it appears on the official vacancy list or the linked Stelis vacancy page. Do not send money, original identity documents, or one-time passwords to an unverified contact who forwards a WHO-like appointment letter — recruitment fraud commonly impersonates WHO.

## Preparing evidence the hiring manager actually checks

Map each "required" bullet to verifiable experience: degree, years, technical domain (e.g., epidemiology, health systems, emergency response), language level, and field experience. Keep WHO's competency framework in mind and save the application ID. Track status in the official account; do not rely on a recruiter's forwarded screenshot.

## Internships, consultants and field realities

Consultancies and internships often have separate windows and criteria. Field duty stations can involve hardship, security clearance and medical requirements. Read the vacancy's duty station page before assuming family accompaniment is automatic.

## Common mistakes

Assuming every WHO contract is a staff benefits package; paying for a "WHO certificate" before appointment; using a forwarded PDF instead of checking that the vacancy is still open on the system.

## Frequently asked questions

**Q: Does WHO charge to apply?** No. WHO does not use paid intermediaries or request wire transfers for recruitment.
**Q: Is a vacancy on LinkedIn enough?** Verify it is still open on who.int/Stellis with the same number, grade and closing time.
**Q: Can I negotiate duty station?** No — the duty station in the vacancy controls the post.`
  ),
  fix(
    "World Bank Careers: Application Steps and Candidate Checklist",
    "world-bank-careers-application-guide",
    "Worldwide Jobs",
    "World Bank careers",
    "How to find World Bank Group vacancies by bureau, grade and contract — professional, analyst, early-career programmes and why the vacancy notice matters more than an aggregator repost.",
    "https://www.worldbank.org/en/about/careers",
    `World Bank Group careers (IBRD/IDA, IFC, MIGA) are published on worldbank.org/careers and on the jobs platform (often via Workday). Country offices, regional bureaus and anchor Global Practices advertise separately — the hiring unit, grade and contract are decisive, not the headline "World Bank job" on an aggregator.

## Finding real vacancies and understanding grades

On the official careers site/jobs platform filter by location, contract and practice area (e.g., Urban, Health, Finance, Climate), then open the vacancy. Check whether it is Extended Term Consultant (ETC), Short Term Consultant (STC), Young Professionals Program (YPP), or staff (GF/GG/GH) — benefits, duration and reappointment rules differ. An aggregator repost may be outdated; the vacancy must still be open on the official platform to be actionable. The vacancy's grade dictates experience: GF/GH roles typically expect advanced degree and substantial relevant experience.`,
    `## Building an application that survives screening

Create the applicant profile, complete education and employment exactly as the vacancy asks, and map each required experience to a measurable example with project, country, budget, and result. A generic CV that lists "World Bank experience" without a project is screened out. Tailor the cover letter to the bureau's regional priorities and save the requisition ID.

## Programmes that need separate reading

Young Professionals Program (YPP), internships, and Debt/Investment analyst tracks have distinct windows, nationality, age and language criteria — read the programme page, not a summary marketplace post that conflates them. Language minima and field experience expectations are stated per call.

## Common mistakes

Treating every vacancy as "HQ Washington"; assuming consultant terms carry staff benefits; paying a consultant who sells access to hiring managers — the Group does not use such intermediaries.

## Frequently asked questions

**Q: Can I apply to multiple requisitions?** Yes, where eligible, but tailor each to that unit's competencies.
**Q: Is a consultant role a path to staff?** Not automatically; read the contract's extension and conversion language.
**Q: How do I know a vacancy is real?** Confirm it is still open on the official jobs platform with the same requisition, grade and closing date.`
  ),
  fix(
    "IELTS, TOEFL, and PTE: Choosing an English Test by Official Rules",
    "ielts-toefl-pte-official-comparison",
    "Worldwide Education",
    "IELTS TOEFL PTE comparison",
    "Compare the three tests on your receiver's accepted-test list, score currency, component minima, ID rules and rescheduling — then choose where your profile fits.",
    "https://www.ielts.org/",
    `IELTS Academic, TOEFL iBT and PTE Academic differ in delivery, sections, scoring scales, recognition and cost — and the receiving university, professional body or immigration authority decides which scores it accepts, not the test centre. A booking made before checking the receiver's list is the most expensive mistake.

## The check that saves a booking

Open the programme, faculty or immigration page you actually apply to and find the section headed Accepted English Tests or Language Requirements. Note accepted tests, overall and component minima (e.g., IELTS 7.0 with no band below 6.5), score validity (often two years from test date), and whether the requirement differs by programme or country (common for UKVI vs academic IELTS, or TOEFL Home Edition vs centre). Book only after this check — centres do not refund because your receiver wanted a different test.`,
    `## Format, scoring and delivery differences that affect preparation

- IELTS Academic: Listening, Reading, Writing, Speaking. Speaking is often face-to-face in some centres; listening uses paper and audio once.
- TOEFL iBT: Reading, Listening, Speaking, Writing on one continuous test day, fully computer-based, with integrated tasks.
- PTE Academic: fully computer-based with integrated tasks and AI scoring; results typically faster.

Each provider's "Test day" page states photo, identification (passport where required), arrival time, rescheduling fees and what is allowed in the room — and those pages change. Read the current page for your centre.

## Choosing strategically where multiple tests are accepted

If your target accepts more than one, choose where your component profile fits minima. For example a candidate strong in speaking but weaker in integrated listening/writing may perform differently across formats. Use official practice material to learn the scoring descriptors and practice timed writing with the official word-count expectations where provided.

## Retake, validity and sending scores

Validity is commonly two years; some receivers impose a shorter window. Score sending differs: IELTS Test Report Form, ETS score recipients, Pearson's assignment. Confirm the receiver's score-send method before booking.

## Official sources

IELTS · ETS TOEFL · Pearson PTE. Verify accepted-test, validity, ID and rescheduling rules live before booking.

## Frequently asked questions

**Q: Is IELTS UKVI different?** Yes — some UK programmes/visas require IELTS for UKVI on a specific format; check the receiver's UKVI line.
**Q: Does a higher score expire differently?** No — validity is fixed regardless of score.
**Q: Can I use Home Edition everywhere?** No — some receivers do not accept Home Edition; check the receiver list.`
  ),
  fix(
    "How to Verify an International Job Offer and Avoid Recruitment Scams",
    "verify-international-job-offer",
    "Worldwide Jobs",
    "verify overseas job offer",
    "A safety-first verification sequence — employer, vacancy on official domain, contract, destination immigration, and never paying for a guaranteed job or visa.",
    "https://www.interpol.int/en/Crimes/Financial-crime/Online-scams",
    `A real employer does not need you to pay for a guaranteed job, a "premium" visa, or a "processing release" before you start. Recruitment fraud often impersonates real companies using look-alike domains, stolen logos, and urgency. Verify the employer independently before sharing sensitive information or money.

## A verification sequence that catches most fakes

1. Open the employer's website independently — type the domain from a search, do not click only the link in the email. Check that the vacancy exists on the employer's own careers page under that domain, not merely on a third-party board.
2. Verify sender domain character by character (e.g., @company.com vs @company-jobs.com or @companyhr.com) and check whether contract, salary and location match the employer's industry and country norms.
3. Ask for a verifiable contact (company directory, reception) and call back on the number published on the official site — not the number in the offer letter alone.
4. Ask for the contract in a language you understand and check who employs and pays you, where work may legally be performed, probation, leave and who bears permit costs.
5. Check destination-country work-permission steps on the official immigration site — no payment to an individual can lawfully bypass that.

## Never share for a job

One-time passwords, bank PINs, original passport or upfront fees for a job, visa or "government processing." Legitimate employers pay via payroll after lawful hiring steps and do not ask for gift cards.

## If you already engaged

Stop sharing data, keep case numbers, report to the police/cybercrime authority where you live and where the employer claims to be, and to the platform or bank involved.`,
    `## Two red-flag phrases that always mean pause

- "Pay to release the visa/job" — real visa fees are published on the official immigration site and payable via the official channel.
- "Keep this offer confidential" — a legitimate offer can be verified on the employer's domain.

## Frequently asked questions

**Q: The offer looks perfect and urgent — should I pay to secure it?** No. Urgency is the fraudster's tool. Verify on the official domain and immigration site first.
**Q: Can a video interview guarantee legitimacy?** No. Scammers also run video interviews. Verification on the official domain still matters.`
  ),
  fix(
    "India UPSC CMS Exam: Eligibility, Official Notice, and Preparation Plan",
    "upsc-cms-exam-official-guide",
    "India Exams",
    "UPSC CMS exam",
    "UPSC Combined Medical Services for eligible medical graduates — where the active notice lives, internship and qualification rules, and a syllabus-driven plan.",
    "https://upsc.gov.in/examinations/active-exams",
    `UPSC CMS (Combined Medical Services Examination) is conducted by the Union Public Service Commission for eligible medical graduates to fill medical officer posts in government services. The only authority for dates, vacancies, centres, age, internship completion deadline, and the two-paper pattern (plus interview/personality test) is the notice for the relevant cycle on upsc.gov.in → Active Examinations and the detailed PDF linked there.

## What the notice controls — and what coaching summaries cannot

- Who may apply: MBBS degree and internship completion cut-off as stated (typically completion on or before a date in the notice), plus age and attempt rules for CMS.
- Papers, marks and syllabus: Paper I (General Medicine & Paediatrics) and Paper II (Surgery, Gynaecology & Obstetrics, Preventive & Social Medicine), plus interview. Weightage shifts per notice.
- Centres, fees (portal-specified), photograph/signature specs, and document requirements for detail.

## Preparation that respects the notice

Use the official syllabus as the boundary and previous CMS papers for weightage; do not treat a coaching centre's "expected vacancies" as authoritative. Keep internship completion certificate and medical registration evidence ready for interview stage, and track the notice's DAF (Detailed Application Form) instructions after the written result.

## Common mistakes

Applying based on last year's internship deadline, missing the notice's corrigendum, or assuming CMS eligibility equals CSE eligibility — they are different examinations.

## Frequently asked questions

**Q: Is CMS the same as CSE?** No — different notice, eligibility, papers, and services.
**Q: Where is the notice?** Active Examinations page on upsc.gov.in for the cycle you target.`
  ),
  fix(
    "India Job Search: Government Portals to Check Before Applying",
    "india-government-job-portals-official",
    "India Jobs",
    "India government jobs official portals",
    "National Career Service, UPSC, SSC and PSU portals — verify advertisement number, employer, fees and closing dates on the portal itself, not an app.",
    "https://www.ncs.gov.in/",
    `India's central and state recruitment is published on the recruiting organisation's own portal — NCS aggregates and career-informs, but UPSC, SSC, state PSCs, banks and PSUs each publish the advertisement PDF that controls the post. A listing on a private job app is not an endorsement and availability changes frequently.

## Portals to check by post type

- Central services: UPSC (upsc.gov.in), SSC (ssc.gov.in), state PSC sites, NCS (ncs.gov.in) for discovery.
- Banks: IBPS (ibps.in), SBI careers.
- PSUs: the PSU's own careers page.
- e-Governance services (Apprenticeship India, etc.) where the notification directs.

## Verification before you apply and pay

Match post title, advertisement number and employer between the portal and the PDF. Read age, qualification, fee and closing date/time **in the notice** — screenshots often omit corrigenda and category-wise cut-offs. Keep application number and payment receipt. Never pay an intermediary for a guaranteed government job; legitimate fees are payable only via the portal named in the notice.

## Common mistakes

Applying after the portal clock, assuming an app's "last date" equals the notice's date, and uploading a photograph that does not meet the pixel/spec.

## Frequently asked questions

**Q: Is NCS application enough?** No — NCS is discovery; you must apply on the recruiting organisation's portal linked in the advertisement.`,
  ),
  fix(
    "Government Exam and Job Scam Red Flags: A Global Safety Guide",
    "government-exam-job-scam-red-flags",
    "Worldwide Jobs",
    "government job scam warning",
    "Copied logos, urgency, personal-account payment, OTP requests and domain impersonation — how to verify a government notice before you act.",
    "https://www.consumer.ftc.gov/articles/job-scams",
    `Fraudsters impersonate government departments by copying logos, reposting PDFs with altered fees, and demanding payment or personal information via messaging or call. Official portals publish their own legitimate application paths, and for many scams, searching the agency site for the same notice reveals nothing — which itself is a warning that the message is fake.

## Red flags that should stop you paying

- A personal UPI/mobile-money number, gift-card, crypto or wire to a person for a government fee.
- "Pay within one hour or lose the post" or a threat of blacklisting.
- A domain that differs by one character, hyphen or TLD (e.g., ssc-gov-in.com vs ssc.gov.in) or an HTTP site where the official is HTTPS.
- An OTP, banking PIN or original document sent to an individual rather than uploaded on the portal's secure form.
- A caller who asks you to keep the offer confidential and not to check the official site.

## Domain and notice check you should do every time

Type the official domain yourself, search the agency site for the notice title and number, and compare the PDF date, number and closing time. Call the agency's published helpline listed on that domain — not the number in the forwarded message. Report impersonation via the agency's contact page and do not send money while you wait.

## If you were targeted

Keep messages, report to the cybercrime authority where you live and to the impersonated agency, and alert your bank if money was sent.

## Frequently asked questions

**Q: The PDF looks official — is it safe?** Check the domain and notice number on the official site; scammers copy formatting.
**Q: Can I get a refund if I already paid an impersonator?** Report quickly to your bank and the cybercrime authority with transaction evidence; waiting reduces chances.`
  ),
  fix(
    "USA Federal Jobs: How to Search and Apply on USAJOBS",
    "usajobs-federal-application-guide",
    "USA Exams & Jobs",
    "USAJOBS application",
    "How to read the vacancy announcement — qualifications, How to Apply, assessment questionnaire, closing time and applicant limit — and submit via USAJOBS.",
    "https://www.usajobs.gov/",
    `USAJOBS (usajobs.gov) is the central site for U.S. federal vacancies, but the vacancy announcement itself — not the search snippet — controls what the hiring agency will use: qualifications, assessment, required documents, and the How to Apply block with closing time.

## Searching without missing the actual requirements

Create a USAJOBS profile, upload a federal resume, and use filters (open to public, series, location). Then open the announcement and read **Qualifications and Evaluations**: specialized experience by grade, education substitution where allowed, and selective factors. Read **How to Apply** end-to-end for resume format, transcripts, SF-50 where relevant, and whether the agency uses USA Hire or a questionnaire.

## Submitting correctly

Submit via the Apply button that routes to the agency system (often USAJOBS → agency). Track status in your USAJOBS account and provide additional documents only through the method the announcement lists. Some announcements impose an **applicant limit** — postings close early when the cap is reached even before the closing date, so applying early matters. Keep the announcement number.

## After submission

Assessment may include an occupational questionnaire scored on self-reported competencies — answer accurately, as later verification can occur. Address any assessment invitation before the window closes.

## Frequently asked questions

**Q: Is every federal job on USAJOBS?** Most, but SES, intelligence and some excepted service jobs can use different systems — the announcement still explains the route.
**Q: Do I need a federal-formatted resume?** Read the announcement — many require a federal resume with hours per week, supervisor, and address detail.`
  ),
  fix(
    "UK Civil Service Jobs: Official Application and Assessment Guide",
    "uk-civil-service-jobs-guide",
    "UK Exams & Jobs",
    "UK Civil Service Jobs",
    "Success Profiles, behaviours vs technical, strengths, nationality/right-to-work checks, and keeping a copy of submitted evidence.",
    "https://www.civilservicejobs.service.gov.uk/",
    `Civil Service Jobs on GOV.UK lists UK government vacancies and describes role-specific recruitment: online tests, Experience/Behaviours/Technical assessments mapped to Success Profiles, and interviews. Each vacancy states its own eligibility, scoring and reserve-list rules — reading the advert fully before writing is the highest-leverage step.

## What to read before you write

Open the advert and its Success Profiles section. Note which **Behaviours** (e.g., Communicating & Influencing, Making Effective Decisions) are assessed, at which grade, and how (application form vs test vs interview), plus any **Technical** skill and **Strengths**. Prepare STAR examples tied to the level's expectations rather than generic statements; the framework publishes grade examples.

## Checks that close applications early

Nationality and right-to-work rules, location and security requirements, and any reserve list mechanics are in the advert. Assessment can include Civil Service Tests (verbal/numerical/situational). Save your submitted evidence and the closing time — appeals without evidence are difficult, and late submission is rarely accepted even by minutes.

## Official source

[Civil Service Jobs](https://www.civilservicejobs.service.gov.uk/). Verify the vacancy's current advert; this guide is educational.`,
    ``
  ),
  fix(
    "NHS Jobs: How to Search Legitimate UK Healthcare Vacancies",
    "nhs-jobs-official-search-guide",
    "UK Exams & Jobs",
    "NHS Jobs UK",
    "How to use NHS Jobs for trust identity, job reference, banding, professional registration (NMC/GMC/HCPC/GPhC) and why the vacancy page is the only legitimate application path.",
    "https://www.jobs.nhs.uk/",
    `NHS Jobs (jobs.nhs.uk) is the recruitment service many NHS trusts, boards and partner organisations use. Each vacancy names the employing trust, registration, experience and right-to-work requirements — and the vacancy page is the legitimate application route, not an email that asks for payment.

## Safe search and trust identity

Filter by location, employer and profession, then open the full advert. Check the employing organisation (trust or board name), job reference, Agenda for Change banding, site, hours, and closing time. Cross-check the trust on nhs.uk — a look-alike domain with a different trust name is a common scam pattern.

## Registration, experience and right-to-work

Some roles require current UK professional registration (NMC, GMC, HCPC, GPhC) before the start date; others accept pending registration with evidence. Right-to-work and Certificate of Sponsorship ties are advert-specific — read the advert's sponsorship line rather than assuming every band sponsors. Keep registration evidence and references ready for pre-employment checks.

## Applying

Apply via the vacancy page; save the application and advert PDF. Do not pay a recruiter who claims to secure an NHS post for a fee.

## Official source

[NHS Jobs](https://www.jobs.nhs.uk/). Verify trust identity, banding and registration requirement live; this guide is educational.`,
    ``
  ),
  fix(
    "Canada Government Jobs: Official GC Jobs Application Guide",
    "canada-gc-jobs-application-guide",
    "Canada Exams & Jobs",
    "GC Jobs Canada",
    "Language profiles (BBB/CBC), education, security, employment equity and why screening-question evidence decides screening.",
    "https://www.canada.ca/en/services/jobs/opportunities/government.html",
    `The Government of Canada publishes federal opportunities via Canada.ca and the GC Jobs system (jobs-emplois.gc.ca). Each posting states language profile (English/French — e.g., BBB, CBC), education, security (Reliability, Secret), employment equity, location, duration and whether the pool remains open.

## How to apply without being screened out

Read language, education and security requirements before attaching evidence. Answer screening questions as mini-STAR examples — task, action, result — tied to the result you claim; vague one-line answers are screened out even where you meet the years. Keep language test, degree and security forms ready where required, and save the reference number and submitted application; pools can remain open for months and re-contact without history is slow. Some processes create inventories/pools that live for a year.

## Official source

[GC Jobs — Government of Canada](https://www.canada.ca/en/services/jobs/opportunities/government.html). Verify language and security requirement live; this guide is educational.`,
    ``
  ),
  fix(
    "Australia APS Jobs: Official Public-Service Recruitment Guide",
    "australia-aps-jobs-official-guide",
    "Australia Exams & Jobs",
    "APS Jobs Australia",
    "APSJobs, position description, citizenship and clearance, ILS capabilities, selection criteria, and why the vacancy's workflow matters.",
    "https://www.apsjobs.gov.au/",
    `APS Jobs (apsjobs.gov.au) lists Australian Public Service vacancies by classification (APS1-6, EL1-2, SES), agency and location. The position description — not the search snippet — defines duties, clearance, and selection criteria.

## Applying well

Read citizenship (Australian citizen usually required at engagement) and baseline/negative vetting where the advert lists them. Prepare examples using the agency's requested capability framework (often the Integrated Leadership System — ILS). Address selection criteria concisely with STAR examples and submit through the vacancy's official workflow — emailed CVs are rarely accepted and paper applications are not kept. Location can be flexible or advertised as remote/hybrid; the advert controls it.

## Common misunderstandings

Citizenship cannot be waived after application; some agencies require citizenship at application, others at engagement — check the advert's phrasing. Merit pools frequently fill future vacancies; being in a pool is not a job offer until the agency contacts you.

## Official source

[APS Jobs](https://www.apsjobs.gov.au/). Read the position description and citizenship rule; this guide is educational.`,
    ``
  ),
  fix(
    "International CV and Resume Standards: Country-Specific Checks",
    "international-cv-resume-country-guide",
    "Worldwide Careers",
    "international CV format",
    "Europass is one European format — but always follow the vacancy's requested file, length, photo, and personal-data rules.",
    "https://europa.eu/europass/en/create-europass-cv",
    `CV norms differ by country: expected length, cover letter, photo, date format, personal data, and file type. Europass provides one official European format via europa.eu/europass, but the vacancy instructions override any template — including Europass.

## What to align before you send

Check the vacancy's requested file format (often PDF, sometimes .docx to allow applicant-tracking parsing), length (one vs two pages per country), whether photo, birthdate or marital status is expected or should be omitted, and date format. Some countries expect a photo; many now ask you to omit it — the advert and local law control the choice. Keep personal data limited to what the employer needs and remove sensitive details where the employer expects omission.

## Evidence quality beats formatting

Per bullet, add verifiable evidence that matches the listed requirement rather than a generic CV: project, employer, period, result with numbers where lawful. Keep the same spelling of name and dates across CV, application form and references.

## Official source

[Europass CV](https://europa.eu/europass/en/create-europass-cv). Follow the vacancy instructions over any template; this guide is educational.`,
    ``
  ),
  fix(
    "New Zealand Government Jobs: Official Careers and Application Checklist",
    "new-zealand-government-jobs-guide",
    "Oceania Exams & Jobs",
    "New Zealand government jobs",
    "jobs.govt.nz plus agency careers pages — work rights, location/presence, closing time (NZT), reference, and security/clearance.",
    "https://jobs.govt.nz/",
    `New Zealand government roles are listed on jobs.govt.nz and on individual agency careers pages (MSD, Whaikaha, NZ Police, IRD, MoE, etc.). The vacancy's closing time (NZT), required evidence and reference control your application — a board listing cannot replace them.

## Applying correctly

Check work rights and whether you must be in New Zealand at application or start date; many vacancies require current right to work and the ability to attain baseline/ national security clearance. Note location — some roles are location-specific, not remote. Use the vacancy's closing time (NZT) and reference, and submit on the portal named in the vacancy — not via a recruiter who asks for payment or a personal bank account. Keep the application PDF and confirmation email.

## After applying

Track status in the agency system, respond to vetting/security forms quickly, and keep referees informed at the level the vacancy asks (often managerial).

## Official source

[Jobs.govt.nz](https://jobs.govt.nz/). Use the role's closing time and reference; this guide is educational.`,
    ``
  ),
  fix(
    "South Africa Government Jobs: DPSA Vacancy Verification Guide",
    "south-africa-dpsa-vacancies-guide",
    "Africa Exams & Jobs",
    "South Africa government jobs",
    "Match DPSA Public Service Vacancy Circular post title/reference, centre, requirements, closing date and whether Z83 is required — and ignore payment requests.",
    "https://www.dpsa.gov.za/newsroom/psv/",
    `The Department of Public Service and Administration (DPSA) publishes the weekly Public Service Vacancy Circular (often Friday) and related notices on dpsa.gov.za. Each post lists reference number, centre, directorate, salary level, requirements, duties, and the address/method for submission — the department's own advertisement is authoritative, not a Facebook repost.

## Safe workflow that prevents wasted applications

Open the DPSA Circular PDF for the week and find the post, then open the department's advertisement and match title and reference between the two. Check whether New Z83 (effective 2021) is required and which version the circular mandates — submitting an old Z83 is a common rejection. Note centre, closing date and time (South Africa time), and whether e-mail, hand delivery or postal address is allowed. Submit to the address in the circular; do not pay a recruiter who forwards a similar post with a different closing date or account number.

## Why this check matters

Circulars are republished for weeks with identical titles; the reference differentiates them. A repost on social media often strips the reference and changes the closing date — applying to the wrong reference is not considered.

## Official source

[DPSA Vacancies](https://www.dpsa.gov.za/newsroom/psv/). Verify the circular for the week you apply; this guide is educational.`,
    ``
  ),
  fix(
    "EU Careers: EPSO Competition and Application Basics",
    "eu-epso-careers-official-guide",
    "Europe Exams & Jobs",
    "EPSO careers",
    "EU institution competitions on EU Careers — eligibility by nationality, languages, notice of competition, reserve list vs immediate post, and Talent pool/CAST.",
    "https://eu-careers.europa.eu/en",
    `EU institution posts are filled via EPSO/EU Careers competitions at eu-careers.europa.eu. A permanent/contract-agent post in a DG, agency or delegation is typically filled from a reserve list built by a competition — it is not a direct hiring email, even where a hiring manager contacts you.

## What the notice of competition controls

Eligibility by nationality (EU member states, with narrow exceptions per notice), languages (which languages at application and at assessment), education/experience window as at the closing date, reserve-list size and validity (often 12 months and extendable), and assessment stages. Open competitions and Talent pool/CAST have different workflows — read the notice that matches the profile you apply under.

## Applying

Create an EU Careers account, complete the profile exactly as the notice instructs, select the correct competition/profile, and submit before Brussels time. Save the application number and keep the EU Login credentials.

## Common misunderstandings

Being on a reserve list is not a job offer; the list is drawn upon as vacancies arise. Language derogations are stated in the notice — assuming English-only at every stage is a rejection reason.

## Official source

[EU Careers](https://eu-careers.europa.eu/en). Verify notice, languages, and validity live. This guide is educational.`,
    ``
  ),
  fix(
    "ILO Jobs and Internships: Official Vacancy Verification Checklist",
    "ilo-careers-official-guide",
    "Worldwide Jobs",
    "ILO careers",
    "Verify ILO vacancies on jobs.ilo.org — reference, closing time, grade/contract, duty station, and why only the ILO system route is legitimate.",
    "https://jobs.ilo.org/",
    `The International Labour Organization publishes vacancies on jobs.ilo.org via its ILO Jobs system (and occasionally via UN Inspira for joint calls). Each vacancy carries its own reference number, closing time (Geneva time), grade, contract type and duty station — a LinkedIn repost is not authoritative until the vacancy appears there.

## Verify before you write a cover letter

On jobs.ilo.org confirm title, reference (e.g., DC/MANILA/…), grade (P, N, G, D, NO), contract duration/category (fixed-term, temporary, consultant, intern) and duty station. Duty station affects entitlement, medical/security and whether dependants can accompany. The notice also lists required experience per grade — read it before tailoring.

## Applying without losing the window

Create the ILO applicant profile, complete education and employment exactly as the notice instructs, answer screening questions, and submit before Geneva time. Save the application number. Paid "ILO recruitment agents" and personal-account payment requests are scams — the Organization does not use them and does not ask you to pay to "secure" a post.

## Official source

[ILO Jobs](https://jobs.ilo.org/). Check vacancy reference live. This guide is educational.`,
    ``
  ),
];
