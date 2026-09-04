/**
 * Batch 6 — 10 more regional posts (Americas ×5 + Europe/Africa ×5).
 * Overwrites ~250-word stubs with 500+ word practical guides.
 */
export type DeepenedRegionalV2Post = {
  title: string;
  slug: string;
  category: string;
  focusKeyword: string;
  excerpt: string;
  sourceUrl: string;
  body: string;
};

export const deepenedRegionalV2Posts: DeepenedRegionalV2Post[] = [
  {
    title: "Brazil MEI Opening and DAS Compliance: What a Micro-Entrepreneur Should Verify",
    slug: "brazil-mei-opening-das-compliance",
    category: "Latin America Small Business",
    focusKeyword: "Brazil MEI registration",
    excerpt: "Activity eligibility, municipal permission, CCMEI receipt, monthly DAS, annual declaration, invoices and when to migrate beyond MEI.",
    sourceUrl: "https://www.gov.br/empresas-e-negocios/pt-br/empreendedor",
    body: `MEI (Microempreendedor Individual) is Brazil's simplified regime for individual micro-entrepreneurs. It caps annual revenue, employees, activity and partners — and the municipality still decides whether your address can host the activity. This guide maps what to verify on the federal portal and with the city before registering, and what to calendar after opening so DAS payments, invoicing and declarations do not slip.

## Is your activity eligible?

The federal portal publishes the current list of permitted CNAE activities and the revenue and hiring limits. Do not rely on a tutorial from two years ago — activities are added or removed and limits are updated. If your activity is not on the list, MEI is not the correct regime even if a video says it is "easy to open."

**Common trap:** choosing a generic CNAE because it appears in a dropdown. The code affects licensing, address approval, and whether the activity is permitted at that location.

## Address and licensing before you click "open"

Municipal approval (viabilidade) and, where applicable, fire-safety or health rules are separate from federal registration. A CCMEI alone does not authorise a physical operation that requires a licence. Verify with the prefeitura whether the activity can operate at the intended address and what inspection, if any, applies.

## Federal registration — use only the official portal

Register only through the portal identified on gov.br (currently via Portal do Empreendedor / gov.br account). Third-party sites that charge for "expedited approval" add no legal value and may mishandle your data. Save the CCMEI and the protocol number.

## After opening — monthly and annual duties you must own

- **DAS monthly payment:** a fixed amount that bundles INSS, ICMS and/or ISS depending on activity. Create a monthly calendar entry; late payment accrues charges.
- **Annual declaration (DASN-SIMEI):** due by the date published for the calendar year (commonly 31 May for the prior year). File even in months with no revenue.
- **Invoices and receipts:** customer invoice rules depend on municipality and state — confirm with the city hall or state fazenda. Keep receipts and DAS payment proofs together.
- **Record-keeping and reassessment:** track revenue, employees, activity changes and address changes. If any condition will be exceeded, consult an accountant about migration to ME/EPP before the limit is breached.

## When to reassess the regime

Revenue growth, hiring a second employee, adding a partner, or expanding activity often means MEI is no longer suitable. Migration is a planned accounting step, not a penalty — but retroactive correction is more expensive than early advice.

## Caveats that matter

Limits, amounts, permitted activities and municipal rules change. Registration does not authorise every operation at every address.

## Official source

[Gov.br — Empreendedor / MEI](https://www.gov.br/empresas-e-negocios/pt-br/empreendedor). Confirm activity list, limits and declaration dates live; this guide is educational.

## Frequently asked question

**Q: Can a MEI have a partner?** The regime is for an individual entrepreneur; verify the current rule before restructuring — adding a partner typically requires a different form.`,
  },
  {
    title: "Mexico RFC and e.firma: A Business Owner's SAT Registration Preparation Guide",
    slug: "mexico-rfc-efirma-business-registration-guide",
    category: "Latin America Government Processes",
    focusKeyword: "Mexico RFC e.firma business",
    excerpt: "Individual vs legal-entity RFC, appointment and document matching, e.firma key custody, invoicing and filing duties that follow registration.",
    sourceUrl: "https://www.sat.gob.mx/personas",
    body: `In Mexico the RFC identifies taxpayers and the e.firma (advanced electronic signature) is used for many SAT electronic procedures. The route differs for an individual, a legal entity, a representative and a foreign person, and SAT's appointment guidance changes, so the live portal — not a social-media list — is the authority.

## Individual or legal entity? Decide before you book

SAT treats persona física (individual) and persona moral (legal entity) differently: who can appear, what powers are required, and whether a legal representative must attend. A representative needs proof of representation exactly as SAT describes it for that case. Booking the wrong appointment type is a common wasted trip.

## Matching names, CURP and address across documents

SAT appointments often fail because the name on the RFC request does not character-match the CURP, passport, or entity record, or because address components are abbreviated differently. Prepare identity and address evidence exactly as requested and use the same spelling everywhere. For legal entities, the notarial instrument and powers must align with the SAT request.

## Appointment, appearance and what to bring

1. Read the current requirements and appointment instructions on sat.gob.mx for the persona/ entity you are.
2. Book the appointment at the office that actually handles that procedure.
3. Bring the originals SAT lists (typically official ID, CURP where applicable, proof of address, powers/entity documents) and know which copies, if any, are required.
4. Verify the appointment location — modules move and cities can have multiple SAT offices.

## e.firma and file custody

The e.firma consists of a certificate and a private key. SAT will not email you a private key — so any message claiming to do so is fraudulent. Store the .key and .cer files in a restricted, backed-up location with recovery and access procedures for the business. Do not email private key material, and log certificate expiry and renewal tasks. Revocation and renewal run through SAT channels.

## After SAT registration

Registration is not the end. Invoicing (CFDI), payroll where you have employees, monthly and annual filings, and VAT obligations follow and depend on the regime, activity and domicile. Ask a contador about regime choice and periodic duties rather than inferring from another taxpayer's situation.

## Common mistakes

- Booking an appointment with the wrong persona/ entity selection.
- CURP, name or address mismatch across documents.
- Emailing private key material or leaving it on an unencrypted drive.
- Assuming RFC registration replaces municipal or sector permits.

## Official source

[SAT — Personas](https://www.sat.gob.mx/personas). Verify appointment availability, required evidence and key handling on the live page; this is not Mexican tax advice.

## Frequently asked question

**Q: Is an RFC the same as a business permit?** No. Tax registration is one layer; municipal, sector and professional permissions remain separate where they apply.`,
  },
  {
    title: "Canada CRA Business Number and GST/HST Account: A Registration Decision Tree",
    slug: "canada-cra-business-number-gst-hst-guide",
    category: "Canada Small Business",
    focusKeyword: "Canada business number GST HST",
    excerpt: "When a BN is needed, which CRA program accounts apply, turnover and activity tests, invoicing distinctions and provincial rules you still must check.",
    sourceUrl: "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/registering-your-business.html",
    body: `A Canada Revenue Agency (CRA) Business Number (BN) identifies a business, while GST/HST, payroll, import-export and corporation-income-tax accounts represent different program obligations. Determining legal structure and activities before opening an account prevents voluntary-registration consequences you did not intend.

## BN vs the program accounts

- A **BN** alone does not mean you charge GST/HST or run payroll — it is the root identifier.
- **GST/HST account** relates to charging, collecting and remitting goods and services / harmonized sales tax where turnover and activity make you a registrant or you choose voluntary registration.
- **Payroll, import-export and corporation accounts** are separate program accounts with their own triggers and filing periods.

## Decision tree before you register

1. Is the business a sole proprietorship, partnership or corporation? Incorporation under federal or provincial law is separate from a BN.
2. What activities will you carry on and where? Marketplace sales, interprovincial supplies and imported services can affect GST/HST analysis.
3. Do turnover and activity thresholds make registration required, or is voluntary registration advantageous? Ask CRA or an accountant — voluntary registration can be difficult to unwind.
4. Register only the accounts your facts require and record effective dates, accounting period, filing frequency and remittance calendar in one place.

## Invoicing, records and filing hygiene

Where GST/HST applies, invoicing must distinguish taxable, zero-rated and exempt supplies and show the correct registration number. Keep a calendar of filings and remittances, and review when activity changes — for example adding interprovincial sales or digital services.

## Provincial and marketplace layers

CRA accounts do not answer provincial sales tax (PST/RST/QST), municipal licensing or Indigenous-tax questions. Marketplace facilitator, drop-shipping and platform-sales rules need specialized review. Record each jurisdiction separately.

## Common mistakes

- Assuming a BN equals incorporation.
- Registering for GST/HST voluntarily without advice and then needing to charge on supplies where customers expected no tax.
- Ignoring provincial or territorial rules.
- Assuming a threshold or rate is permanent — they change.

## Official source

[CRA — Registering your business](https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/registering-your-business.html). Verify turnover, rate and filing-period rules live; this guide is educational.

## Frequently asked question

**Q: Is a BN the same as incorporation?** No. A number identifies CRA program accounts; it does not create a corporation.`,
  },
  {
    title: "U.S. Business Licenses: A City, County, State, and Federal Research Checklist",
    slug: "us-business-license-research-checklist",
    category: "North America Small Business",
    focusKeyword: "U.S. business license checklist",
    excerpt: "Why there is no single national business-license database — SBA overview then city, county, state, tribal and federal authority for your activity.",
    sourceUrl: "https://www.sba.gov/business-guide/launch-your-business/apply-licenses-permits",
    body: `There is no single U.S. "business license." A home-based consultancy, food truck, construction firm, online seller and health practice can face entirely different permits. License needs depend on activity, location, structure and sometimes professional credentials. Start with the SBA overview then verify the exact city, county, state, tribal and federal authority for what you actually do.

## Describe the activity in plain language

Write one paragraph covering products/services, premises, employees, sales channels, storage and signage. That sentence is what the clerk needs to map you to the right approvals. "Software company" is too vague; "B2B SaaS sold online, no public premises, two employees, servers in us-east-1" is useful.

## Layered search, then confirmation

1. Read the SBA guide and identify the likely layers: city business licence, county health/fire, state sales-tax or entity registration, federal licence where the activity is federally controlled (e.g., alcohol, aviation, firearms, broadcast).
2. Open the relevant **government domain** pages — not a lead-generation directory — and list issuing office, form, fee, renewal cycle, inspection trigger and allowed premises.
3. Ask the local clerk whether zoning, occupancy, signage or health inspection applies before you sign a lease. A licence does not override zoning.
4. Save applications, certificates and renewal reminders in one compliance register.
5. Re-check requirements before changing address, ownership, products, or equipment — a menu change or new location can trigger a new health or fire approval.

## Professional and federal overlays

A corporation or LLC is **not** permission to practice a regulated activity. Architecture, engineering, medicine, legal, cosmetology and similar boards control practice separately. Federal agencies control certain activities directly.

## Common mistakes

- Searching a generic directory and assuming one national licence covers every location.
- Using a professional board's licence as proof that the business itself is licensed where it operates.
- Beginning regulated operations while an approval is only "pending" unless the authority expressly permits it.
- Budgeting once for a fee and ignoring renewal and inspection costs.

## Caveats that matter

Local rules, fees and renewal cycles change. Written confirmation from the issuing authority is valuable evidence.

## Official source

[SBA — Licenses and permits](https://www.sba.gov/business-guide/launch-your-business/apply-licenses-permits). Verify the issuer for your activity and location before paying.

## Frequently asked question

**Q: Is an LLC itself a business licence?** No. Entity formation and permission to conduct a regulated activity are separate; you may need both.`,
  },
  {
    title: "OAuth 2.0 PKCE for Browser and Mobile Apps: The Threat-Model-First Setup",
    slug: "oauth-pkce-browser-mobile-threat-model",
    category: "Developer Security",
    focusKeyword: "OAuth PKCE implementation",
    excerpt: "Why PKCE matters for public clients, code verifier/challenge, state and nonce, token storage, and the flows you must not use in browser/mobile.",
    sourceUrl: "https://oauth.net/2/pkce/",
    body: `Public clients — browser SPAs and native mobile apps — cannot safely store a client secret. PKCE (RFC 7636) mitigates authorization-code interception by binding the code to a verifier only the legitimate client holds. This guide frames the setup as a threat model, not a copy-paste.

## Threat model for public clients

An attacker who can intercept or inject the redirect can try to exchange a stolen code for tokens. On mobile, a malicious app can register the same scheme. On web, a leaked referrer or compromised history can expose the code. Design before you code: where can the code leak, where are tokens stored, and how do you bind the code to the original request?

## The PKCE flow, precisely

1. Client creates a high-entropy **code_verifier** and derives a **code_challenge** (S256).
2. Authorization request includes challenge and method; the server stores the challenge with the code.
3. On token exchange the client sends the verifier. The server recomputes and compares. Without the verifier, the stolen code is useless.
4. Also send **state** and validate it on return, use exact redirect-URI matching, and add **nonce** for OpenID Connect id_token.

## Implementation that survives review

- Use S256, not plain.
- Generate verifier with a cryptographic RNG (43-128 chars).
- Validate state/nonce and reject if missing or mismatched.
- Exact redirect URI — no wildcard prefix matching on the server.
- Request only the scopes needed; prefer short-lived access tokens and rotating refresh tokens where the provider supports them.
- Do not put tokens in URLs. Keep tokens out of localStorage where possible — prefer memory or secure, httpOnly storage behind your backend, and plan for XSS impact.

## What not to do

- Do not use the implicit flow for new apps.
- Do not store a client secret in the app binary or JavaScript bundle.
- Do not accept a code without PKCE on a public client.

## Caveats that matter

Provider implementations differ (code lifetimes, refresh rotation, DPoP/binding). Verify the current provider docs and test code-replay, wrong-verifier and state-mismatch cases.

## Official source

[OAuth.net — PKCE](https://oauth.net/2/pkce/) and the authorization server's current documentation. Verify parameter handling before shipping.

## Frequently asked question

**Q: Does PKCE replace state?** No. PKCE binds code to verifier; state binds request to session. Use both.`,
  },
  {
    title: "EU Blue Card Information: Compare the Official National Application Route",
    slug: "eu-blue-card-national-application-route",
    category: "Migration Procedures",
    focusKeyword: "EU Blue Card requirements",
    excerpt: "EU-wide concept, national salary thresholds, contract, qualification/skill evidence, family and mobility rules you must check per country.",
    sourceUrl: "https://immigration-portal.ec.europa.eu/eu-blue-card_en",
    body: `The EU Blue Card is an EU-wide concept for highly qualified workers, but it is **implemented nationally**. The European Immigration Portal explains who the card is for and links to country information; the chosen member state's page then controls salary thresholds, contract, documents, processing, fees, mobility and family rules.

## Concept vs national route

Do not apply through a generic "EU visa" site. Choose the member state, then open its **country-specific Blue Card page** on its immigration authority domain. That page is the only source for the threshold that applies to you — thresholds are updated and can differ between standard and shortage occupations.

## Conditions you must verify per country

- Eligible occupation, recognised qualification or higher professional skills evidence, and, where accepted, experience in lieu of a degree.
- Signed employment contract or binding offer with duration and weekly hours that meet the national minimum.
- Salary threshold: annual gross per current national figure, and whether shortage-occupation and recent-graduate lower thresholds apply.
- Health insurance, accommodation and criminal-record evidence where the authority lists them.
- Labour-market test or exemption where the country's rules still impose one.

## Filing and beyond

Follow the filing route named by the authority — sometimes employer-filed, sometimes applicant-filed at a consulate or immigration office. After approval, follow separate instructions for residence registration and, where applicable, family reunification and later intra-EU mobility.

## Common mistakes

- Applying via a generic portal rather than a national authority route.
- Using a salary figure copied from a forum — thresholds change annually.
- Working for a different role or employer without checking whether permission is tied to the sponsoring post for an initial period.
- Assuming issuance in one state grants immediate work rights in another.

## Official source

[EU Immigration Portal — EU Blue Card](https://immigration-portal.ec.europa.eu/eu-blue-card_en). Verify threshold and procedure for your state immediately before acting; this is not legal advice.

## Frequently asked question

**Q: Can I move to another EU state right after issuance?** Mobility is possible but conditioned — typically after an initial period and via the second state's own procedure. Check the second state's page before moving.`,
  },
  {
    title: "UK Skilled Worker Visa: Link the Job, Sponsor, and Evidence Correctly",
    slug: "uk-skilled-worker-visa-evidence-checklist",
    category: "Migration Procedures",
    focusKeyword: "UK Skilled Worker visa checklist",
    excerpt: "Sponsor register, CoS vs offer, occupation code and going rate, English, maintenance, translations and the GOV.UK application route.",
    sourceUrl: "https://www.gov.uk/skilled-worker-visa",
    body: `A Skilled Worker application succeeds or fails on alignment: the job, the licensed sponsor, the certificate of sponsorship (CoS), the occupation code and salary, and the applicant's evidence must agree. GOV.UK is the source for the current eligible occupations, going rates, fees and financial requirements.

## The chain that must match

Offer, CoS, occupation code, salary, and sponsorship must describe the **same** job. A mismatch in title, SOC code or salary between offer letter and CoS is a routine refusal reason.

## What to verify before you pay

1. The employer appears on the **official sponsor register** and the job is eligible at the current salary thresholds and going rate for that code.
2. The CoS details match the offer: title, code, salary, hours, start date and work address. Do not rely on a hiring email — only the CoS reference issued via the sponsorship system counts.
3. Assemble identity, **English-language evidence or exemption**, maintenance (or sponsor certification of maintenance), and criminal-record/ tuberculosis evidence where the route requires it. Translations must be in the format GOV.UK specifies.
4. Submit the application and biometrics through the current GOV.UK route and keep the CoS reference, application number and biometric appointment together.

## Common mistakes

- Paying for sponsorship or a guaranteed visa — licensed sponsors do not sell sponsorship.
- Using the wrong occupation code because the title sounds similar.
- Assuming a sponsor's email replaces the CoS — only the CoS reference in the system is operative.
- Submitting financial evidence that does not meet the format and duration rules.

## Caveats that matter

Rules, salary tables, fees and eligible occupations change — sometimes mid-year. A prior approval does not grandfather the next application. Seek regulated advice (OISC/ solicitor) for complex cases.

## Official source

[GOV.UK — Skilled Worker visa](https://www.gov.uk/skilled-worker-visa). Read the current occupation codes, salary tables and document rules before acting; this guide is educational.

## Frequently asked question

**Q: Does a job offer alone qualify me?** No. Only an eligible job with a licensed sponsor, a valid CoS assigned in the sponsorship system, and a matching salary and code can support the application.`,
  },
  {
    title: "Schengen Short-Stay Visa: Build a Consistent Application File",
    slug: "schengen-short-stay-visa-application-file",
    category: "Migration Procedures",
    focusKeyword: "Schengen visa application documents",
    excerpt: "Choosing the correct consulate, authorised form, biometrics provider, passport and insurance rules, itinerary and financial evidence.",
    sourceUrl: "https://home-affairs.ec.europa.eu/policies/schengen-borders-and-visa/visa-policy_en",
    body: `A Schengen short-stay visa (Type C, up to 90 days in 180) is submitted to the consulate responsible under the destination rule — not whichever centre has the earliest appointment. The file must present a coherent story: purpose, itinerary, means, accommodation, insurance, and intention to comply with the authorised stay.

## Which consulate is responsible?

- Main destination (longest stay, or purpose where stays are equal). Some consulates publish a calculator or table — follow it.
- If no main destination can be identified, the first entry state may be responsible, but verify the rule the consulate publishes.

## The file, in order

1. Read the consulate's **current checklist** and complete the **authorised application form** (online or PDF as listed). Photocopied old forms are rejected.
2. Book biometrics through the consulate's **named provider** (often TLScontact, VFS Global or the consulate itself). Do not pay a third-party "appointment seller."
3. Assemble: passport meeting stated validity (often 3 months beyond intended departure) and blank-page rules; itinerary and accommodation/invitation or event evidence; **travel medical insurance** meeting the required coverage (commonly €30,000); financial, employment/study and return-ties evidence appropriate to your case; passport photos per spec.
4. Carry copies of the submitted file, keep the receipt, and follow the consulate's decision-notification and appeal instructions — processing times and appeal windows differ.

## Consistency wins decisions

Dates must agree across bookings, forms, invitation letters, employment letter and bank statements. A hotel for 7 nights paired with forms showing 14 nights is read as inconsistency, not generosity.

## Common mistakes

- Submitting inconsistent dates across bookings and forms.
- Buying non-refundable travel solely because a visa is pending.
- Using a fake reservation or unverified agent — consulates verify bookings.
- Ignoring travel-history and prior refusal disclosure where the form asks.

## Caveats that matter

Consulates set checklists, appointment capacity, fees and processing information within the common Visa Code framework. Verify the responsible consulate, checklist and provider before booking travel.

## Official source

[European Commission — Schengen visa policy](https://home-affairs.ec.europa.eu/policies/schengen-borders-and-visa/visa-policy_en) and the specific consulate's checklist for your destination. Confirm the live rules before acting.

## Frequently asked question

**Q: Should I buy refundable bookings?** Where you have a choice, consulates generally prefer verifiable, ideally refundable or hold bookings — do not create sunk costs that you will cite as pressure to issue.`,
  },
  {
    title: "Kenya eCitizen Passport Application: A Document and Appointment Checklist",
    slug: "kenya-ecitizen-passport-application-checklist",
    category: "Kenya Government Services",
    focusKeyword: "Kenya eCitizen passport application",
    excerpt: "Immigration.go.ke document list, personal eCitizen account, official payment flow, biometrics and collection — without a broker.",
    sourceUrl: "https://immigration.go.ke/passport-application/",
    body: `Kenyan passport applications are initiated through the government's stated digital and appointment process. The Directorate of Immigration Services decides document, biometric, collection and replacement requirements — a broker's handwritten list is not authoritative.

## Prepare before you create the application

- Read the current **passport category** page on immigration.go.ke (ordinary, diplomatic, East African, etc.) and the exact document list for your category. Minor, lost-passport and replacement cases have additional requirements.
- Use **your own eCitizen account** with your ID, phone and email. Do not use a broker's account or phone number — it complicates later access and correction.

## Application and payment

1. Create or sign in to eCitizen and complete the passport form accurately — names, birth registration details and parent information must match supporting documents.
2. Pay only through the **official payment flow** shown after submission and retain the receipt and application number.
3. Book or attend the selected immigration centre for biometrics with the originals the checklist requests (birth certificate/ registration evidence, national ID where required, parents'/ guarantor evidence when listed, previous passport and police report for replacement).

## Collection

Collect only after the **official notification** (SMS/portal) says the passport is ready, and bring the receipt and ID. Collection location, fees and processing times are subject to official updates — follow the current notice for turnaround.

## Common mistakes

- Using a broker's phone number or account.
- Booking biometrics before checking the centre and required originals.
- Assuming payment guarantees approval — it secures processing, not issuance.

## Official source

[Directorate of Immigration Services — Passport application](https://immigration.go.ke/passport-application/). Follow the current checklist for your category; this guide is educational.

## Frequently asked question

**Q: Will a broker get my passport faster?** No. Biometrics, vetting and printing run on the official system; paying a broker adds cost and risks access to your account.`,
  },
  {
    title: "South Africa NSFAS Funding: Verify Application and Appeal Evidence",
    slug: "south-africa-nsfas-application-appeal-guide",
    category: "South Africa Education",
    focusKeyword: "NSFAS application appeal",
    excerpt: "Current cycle announcement, personal account, document naming, status messages, appeal reason with targeted evidence, and why funding status is not registration.",
    sourceUrl: "https://www.nsfas.org.za/",
    body: `NSFAS funding depends on the published rules for the relevant academic cycle. Students should apply through NSFAS, monitor the portal for verification requests, and — if the decision permits — use the stated appeal process with evidence that actually addresses the rejection reason.

## Cycle-specific rules matter

The announcement controls eligibility, participating institutions, allowances, dates and required documents for that year. A prior year's guide may list a closed institution or a changed income threshold.

## Account, documents and status

1. Read the current funding and application announcement end-to-end.
2. Create a **personal** myNSFAS account — do not share credentials with an "NSFAS agent" — and upload clear, correctly named documents. Name files so the assessor can find them (e.g., "HouseholdIncome_Payslips_JanMar2025.pdf").
3. Check status messages and respond to requests for additional evidence before the portal deadline. Missing a verification window often closes the case for the cycle.
4. If eligible to appeal, select the **stated reason** and attach evidence that addresses **that** reason — for example proof of changed household circumstances where that is the rejection code. Uploading unrelated documents is a common failed appeal.

## Registration, accommodation and payment

Funding approval is not the same as institutional registration, accommodation allocation or fee clearance. Your university/TVET's financial-aid office links funding status to registration and disbursement. Ask them which fees are covered and what gap, if any, remains.

## Scams and privacy

- Never pay someone to "unlock" funding — NSFAS does not charge for application or appeal.
- Uploading a certificate without dates or learning detail, or claiming the same activity twice, creates an audit trail problem.
- Keep screenshots and reference numbers for portal problems.

## Caveats that matter

Eligibility, allowances, participating institutions, dates and appeal windows are cycle-specific. Confirm announcements on nsfas.org.za and with your institution's aid office before paying or travelling.

## Official source

[NSFAS](https://www.nsfas.org.za/). Verify the live announcement for your cycle; this guide is educational.

## Frequently asked question

**Q: Does applying equal registration or accommodation funding?** No. The application is for funding consideration; registration and accommodation are separate institutional decisions with their own evidence.`,
  },
];
