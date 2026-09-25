# DECAPSULATE: Cybersecurity Portfolio

Welcome to your new portfolio. Designed strictly according to the "Forensic Editorial" aesthetic, this repository leverages Astro, Tailwind v4, Preact, and GSAP to deliver a premium, 0-JS (by default) static architecture. 

## 1. Project Structure

- `src/pages/` - Core routes (`index.astro`, `hardening.astro`, `404.astro`)
- `src/content/` - Your content data models (`profile`, `case-files`, etc.). This is where you edit your data!
- `src/components/` - The islands and interactive features (Triage Desk, Resume Verifier, Skill Graph).
- `src/styles/global.css` - Centralized design tokens and typography constraints.
- `public/` - Static assets (`_headers`, `.well-known/security.txt`, resume PDF).

## 2. Content Editing Guide

You do not need to touch the Astro components to update your portfolio. 

- **Profile & Links**: Edit `src/content/profile/profile.yaml`.
- **Case Files**: Add `.md` files to `src/content/case-files/`. The **Skill Graph** (F4) automatically reads the `skills`, `tools`, and `frameworks` arrays from these files and generates the interactive visualization.
- **Resume Integrity**: Place your PDF at `public/resume/resume.pdf`. Run a SHA-256 hash on it (e.g., `shasum -a 256 resume.pdf`) and paste that hash into `profile.yaml`. The F7 Verifier handles the rest.

## 3. Deployment Instructions

This site uses `output: static` and is pre-configured with strict security headers in `public/_headers`.

**To deploy to Cloudflare Pages / Vercel / Netlify:**
1. Connect this repository to your platform.
2. Build command: `npm run build`
3. Output directory: `dist`
4. The platform will automatically parse the `_headers` file and apply the A+ security policies.

## 4. Final Placeholder Checklist

The following placeholders (`{{...}}`) must be filled out before your final production deployment. Use a global project search to locate and replace them:

### Global Profile (`src/content/profile/profile.yaml`)
- [ ] `{{FULL_NAME}}` (Also in `index.astro`, `hardening.astro`, `Layout.astro`)
- [ ] `{{ONE_LINE_POSITIONING}}`
- [ ] `{{ROLE_1}}` (Also in `Layout.astro` Recruiter Mode)
- [ ] `{{ROLE_2}}`
- [ ] `{{CITY_OR_REMOTE}}`
- [ ] `{{AVAILABILITY}}`
- [ ] `{{BIO_SHORT}}`
- [ ] `{{ORIGIN_STORY}}`

### Security Configuration (`public/.well-known/security.txt`)
- [ ] `{{CONTACT_EMAIL}}`
- [ ] `{{DOMAIN}}` (in canonical and policy URLs)

### Case Files (`src/content/case-files/*.md`)
*(Ensure you update these for EXH-01, EXH-02, and EXH-03)*
- [ ] `{{PROJECT_X_TITLE}}`
- [ ] `{{PROJECT_X_SUMMARY_ONE_LINE_OUTCOME}}`
- [ ] `{{YYYY-MM}}`
- [ ] `{{LAB_PLATFORM_OR_ENVIRONMENT}}`
- [ ] `{{PROJECT_X_SUMMARY_DETAILED}}`
- [ ] `{{PROJECT_X_SCOPE_DETAILS}}`
- [ ] `{{PROJECT_X_TIMELINE_EVENTS}}`
- [ ] `{{PROJECT_X_EVIDENCE_LOGS_OR_SCREENSHOTS}}`
- [ ] `{{PROJECT_X_ROOT_CAUSE_ANALYSIS}}`
- [ ] `{{PROJECT_X_REMEDIATION_STEPS}}`
- [ ] `{{PROJECT_X_LESSONS_LEARNED}}`
- [ ] `{{PROJECT_X_WHAT_ID_DO_DIFFERENTLY}}`

### Dynamic Graph Tags (In Case Files)
*(Replace these with real tools/skills so the Graph builds accurately)*
- [ ] `{{T1110}}`, `{{T1078}}`, `{{T1059}}`, `{{T1003}}`, `{{T1105}}` (ATT&CK Techniques)
- [ ] `{{TOOL_1}}` through `{{TOOL_5}}`
- [ ] `{{SKILL_1}}` through `{{SKILL_4}}`
- [ ] `{{FRAMEWORK_1}}`, `{{FRAMEWORK_2}}`

### UI Fallbacks (`src/pages/index.astro` L7 Section)
- [ ] `{{TITLE}}`
- [ ] `{{ONE_LINE_OUTCOME}}`

### L2 Connections Section (`src/pages/index.astro`)
- [ ] `{{TRAINING_PROGRAM_NAME}}`
- [ ] `{{COHORT_EXPERIENCE_SUMMARY_E.G_TEAM_LABS_PEER_REVIEW}}`
- [ ] `{{KEY_COLLABORATION_SKILL}}`
- [ ] `{{PROFESSIONAL_ORG_NAME}}`
- [ ] `{{INVOLVEMENT_OR_MEMBERSHIP_DETAILS}}`
- [ ] `{{ORG_ROLE_OR_STATUS}}`
- [ ] `{{CONFERENCE_OR_WEBINAR_NAME}}`
- [ ] `{{KEY_TAKEAWAY_OR_TOPIC}}`
- [ ] `{{EVENT_DATE_OR_YEAR}}`
- [ ] `{{DISCORD_OR_FORUM_NAME}}`
- [ ] `{{COMMUNITY_ACTIVITY_OR_MENTORSHIP}}`
- [ ] `{{PLATFORM_NAME}}`

---

*Build completed by your Orchestrator. Good hunting.*
