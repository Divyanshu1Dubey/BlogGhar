import fs from 'node:fs';

const asiaPart1 = [
  {
    title: 'Bangladesh BCS Preliminary Exam 2026: Official Notice, Syllabus & Preparation Workflow',
    slug: 'bangladesh-bcs-preliminary-official-guide',
    category: 'South Asia Exams',
    focusKeyword: 'Bangladesh BCS preliminary exam',
    excerpt: 'A comprehensive, source-first workflow for checking the BPSC notice, matching cadre requirements, verifying age limits, and structuring your BCS Preliminary preparation.',
    sourceUrl: 'https://bpsc.gov.bd/',
    body: `## Direct Answer & Strategic Overview

The Bangladesh Civil Service (BCS) Preliminary Examination is a highly competitive 200-mark multiple-choice test conducted by the Bangladesh Public Service Commission (BPSC). It serves as the primary screening for executive, administrative, police, and specialized government cadres. Success requires strict adherence to the official BPSC circular rather than relying on third-party coaching summaries. The notice dictates your eligibility, age cut-offs, quota allocations, and the specific syllabus weightage.

## Eligibility & Institutional Framework

Before purchasing study materials, verify your eligibility against the operative BPSC circular. Different cadres carry distinct academic and physical requirements.

| Cadre Type | Core Qualification | Physical Requirements (General) | Notes |
| :--- | :--- | :--- | :--- |
| **General Cadres** (Admin, Police, Foreign, etc.) | Bachelor's or Master's degree from a recognized university. | Police/Ansar: Min height 5'5" (Male), 5'3" (Female). Weight proportional to height. | More than one 3rd class/division in academic life disqualifies the candidate. |
| **Professional/Technical Cadres** (Health, PWD, Agriculture) | Degree in the relevant specialized field (e.g., MBBS, BSc Engineering, BSc Agriculture). | No specific height/weight requirements aside from general medical fitness. | Must have relevant professional registration (e.g., BMDC for doctors). |
| **Both Cadres** | Combination of above. | As applicable for the selected general cadre. | Highest competition; requires strategic preference ordering. |

## Step-by-Step Portal Application & Verification

Do not wait until the final deadline week, as the Teletalk servers frequently experience heavy loads.

1. **Download the PDF Circular**: Go to the BPSC official website (bpsc.gov.bd) and download the full PDF notice. Note the precise "Age Calculation Date" printed in the circular.
2. **Photograph & Signature Preparation**: Ensure your color photograph is exactly 300x300 pixels (max 100KB) and your signature is 300x80 pixels (max 60KB). Incorrect dimensions will result in rejection.
3. **Form BPSC-1 Completion**: Navigate to the Teletalk BCS application portal (bpsc.teletalk.com.bd). Fill out the BPSC-1 Form with exact details matching your SSC/HSC certificates.
4. **Cadre Preference Ordering**: Strategically rank your cadre choices. You cannot change this order once the application is submitted.
5. **Teletalk SMS Payment**: Pay the application fee (typically BDT 700, or BDT 100 for tribal/disabled candidates) within 72 hours of receiving your User ID via a pre-paid Teletalk mobile connection.
6. **Admit Card Download**: Once payment is confirmed, download and safely store both the Applicant's Copy and the Admit Card.

## Syllabus Breakdown & Subject Weightage

The 200-mark preliminary examination is heavily structured. Knowing the exact mark distribution helps prioritize study time.

*   **Bengali Language & Literature**: 35 marks
*   **English Language & Literature**: 35 marks
*   **Bangladesh Affairs**: 30 marks
*   **International Affairs**: 20 marks
*   **Geography, Environment & Disaster Management**: 10 marks
*   **General Science**: 15 marks
*   **Computer & Information Technology**: 15 marks
*   **Mathematical Reasoning**: 15 marks
*   **Mental Ability**: 15 marks
*   **Ethics, Values & Good Governance**: 10 marks

*Penalty*: 0.50 marks are deducted for every incorrect answer. Guessing blindly is statistically punishing.

## Common Pitfalls & How to Avoid Them

*   **Mismatching Names**: Spelling your name or parents' names differently from your SSC certificate.
*   **Wrong Police Station/Upazila**: Entering an incorrect permanent address upazila. This complicates the later Special Branch (SB) police verification process.
*   **Missing Corrigendums**: Failing to check the BPSC website for subsequent notices extending deadlines or altering cadre vacancy numbers.
*   **Relying on Outdated Note-books**: Bangladesh and International Affairs change rapidly. Rely on recent Economic Reviews, official government portals, and major newspapers rather than old guidebooks.

## Frequently Asked Questions (FAQ)

**Can appearing students apply for the BCS Preliminary?**
Yes, if your final written examinations have concluded before the BCS application deadline. You must obtain a certificate from your department head confirming the exam completion dates.

**How is the age limit calculated for freedom fighter quotas?**
The maximum age limit is generally 30 years for general candidates and 32 years for freedom fighter children and physically disabled candidates. The precise cut-off date is rigidly defined in each specific circular.

**Is it possible to recover a lost User ID or Password?**
Yes. You can recover them through the BPSC Teletalk portal by using the "Recover User ID/Password" option and providing your name, father's name, and mobile number.

## Official Source
*   Bangladesh Public Service Commission: [bpsc.gov.bd](https://bpsc.gov.bd/)
*   Application Portal: [bpsc.teletalk.com.bd](http://bpsc.teletalk.com.bd/)`
  }
];

fs.writeFileSync('scripts/temp-asia-1.json', JSON.stringify(asiaPart1, null, 2));
console.log('Done Part 1');
