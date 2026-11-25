# Hiring review implementation

Reviewed 25 November 2026. Scope: the existing HTML/CSS/JavaScript portfolio, aimed at employers assessing junior infrastructure, DevOps and IT support work. The job of the site is to connect a clear role and contact route to inspectable engineering evidence. Native Apple navigation conventions do not apply to this website; the HIG foundations do.

## Changes against the supplied review

| Request | Implementation |
| --- | --- |
| Contact and CV | Direct email plus Contact and PDF download in the hero, global navigation, About and Contact. Rebuilt the outdated CV as a two-page PDF from the published profile. The old Word URL redirects to the current PDF. |
| Impact | Concrete scope for all 22 projects; measured figures remain unclaimed. Six case studies separate capabilities, context, outcomes and prospective improvements. |
| Six case studies | Kept the three existing URLs and added `/projects/engram`, `/projects/cosmopod-os`, `/projects/proxmox`. Public repository evidence is linked at the inspected revision. |
| About duplication | One authoritative entry per qualification; apprenticeship is consolidated with assessment/result details. Removed the redundant Courses panel and repeated apprenticeship education entry. |
| Expired credential | ISC2 Candidate is explicitly expired under Earlier learning, outside the six current qualification/training entries. |
| Skills | Five-row evidence matrix covering scripting, infrastructure, automation/monitoring, cloud/security, and continuing learning. Work, personal projects and training are distinguished. Existing 35 native skill controls remain. |
| Hero | Explicit Junior IT Technician / infrastructure and automation headline, with the existing real HPC screenshot. Removed the decorative AI lead image and scroll ticker. |
| Filters and hiring route | Kept existing filters, added Monitoring, and provided monitoring/reliability/automation shortcuts. Filter choices are shareable in the URL and Back/Forward restores the selected view. |

The supplied review missed existing contact navigation, grouped skills and category filters. These were strengthened rather than duplicated. The previous skills script also attached click handlers to plain skill labels; it now targets real buttons only.

## Apple Design review

Overall: Good at source review, with browser validation still qualified below. The distinctive element is the real university monitoring artifact paired with a direct role statement. The existing editorial identity remains; a generic replacement theme was rejected.

- High, resolved: contact and career proof were separated from the first-screen message. `layout.md › Visual hierarchy`: “Order content by relative importance.” Role, contact and CV now precede project browsing.
- High, resolved: generated artwork led the engineering claim. Judgment: the existing HPC artifact provides stronger subject-specific evidence. Its caption describes what is visible without inventing a performance result.
- Medium, resolved: repeated qualifications increased reading work. `layout.md › Visual hierarchy`: “Use progressive disclosure to make layouts cleaner and easier to interact with.” Existing native disclosure sections remain, with one qualification record per item.
- Medium, resolved: hiring evidence required reconstructing a tool list. `lists-and-tables.md › Content` recommends descriptive column headings. The semantic table states area, tools, context and evidence; narrow layouts stack its cells with labels.
- Medium, resolved: CV/contact actions needed clear names. `buttons.md › Content`: “Ensure that each button clearly communicates its purpose.” Ordinary links say Contact Jayden and Download CV, retain keyboard focus and have at least 44px control height.
- Craft: preserve Georgia display text and the restrained editorial palette; use the system font for controls, body and the evidence matrix. The scroll ticker and decorative AI banner were removed.

Read references: accessibility, layout, typography, color, designing-for-iOS, cross-platform translation, buttons, lists-and-tables, writing, motion. No new animation; reduced-motion, reduced-transparency and increased-contrast styles are defined. Native links, buttons, details and table semantics carry interaction.

### Tokens and layout

| Role | Light | Dark editorial |
| --- | --- | --- |
| Surface | #ffffff | #111311 |
| Group | #f5f5f7 | #202521 |
| Text | #1d1d1f | #f3f1e9 |
| Secondary | #595960 | #c1c8bc |
| Action | #0066cc | #efb9a9 |
| Boundary | #76767d | #899084 |

Contrast ratios are computed by `tests/check_palette.py`. These tokens cover the new evidence components; the existing portfolio retains its deliberately dark editorial surfaces. Display text scales from 2.2rem at compact widths to 4.5rem; body 1.0625–1.125rem; matrix/metadata .9375rem; controls 1rem. The existing system/Georgia pairing remains.

```text
Regular                                  Compact
brand   pages   Contact   CV   Email      brand       Menu
role / concise summary | real dashboard  role / summary
Contact  CV  projects   | scope caption   Contact  CV  email
email                                     real dashboard + caption
monitoring | reliability | automation     three evidence shortcuts
six stories / full filtered catalogue     stacked project stories
skills matrix -> technical evidence       labelled stacked matrix cells
```

## ADHD exploration

Brief: shorten the hiring decision without turning personal projects or training into invented production claims. Five isolated frames generated six ideas each. The available three child-agent slots required two parallel batches; no branch received another branch's output. Scores below are Novelty, Viability and Fit (0–10), weighted 0.35 / 0.40 / 0.25.

### Make claims inspectable

- Evidence receipt with artifact/date/contribution [N8 V9 F10].
- Sourced metrics or concrete before/after descriptions [N7 V10 F10].
- Screenshot disclosure note [N6 V8 F7].
- ★ Skills provenance plus exact evidence destination [N8 V10 F10].
- Credential issuer/date/status reconciliation [N5 V10 F10].
- Ownership strip beside work/lab/learning context [N7 V9 F10].
- Environment and evidence freshness labels [N7 V9 F9].
- Learning checkpoint versus demonstrated artifact [N7 V8 F9].
- Current/historical/planned labels [N7 V9 F9].
- Diagnostic screenshot captions [N7 V10 F9].

### Shorten the assessment path

- Six-story handover manifest [N7 V9 F10].
- CV as a contact handoff at several exit points [N5 V10 F10].
- Timed 30-second / two-minute / deep-dive route [N8 V8 F8].
- Matrix rows as evidence shortcuts [N7 V10 F10].
- Role presets using existing filters [N7 V8 F9].
- Responsibility-to-project hiring map [N7 V9 F10].
- Filters exposing cross-project patterns [N7 V8 F9].
- ★ Complete hiring path with JavaScript disabled [N8 V10 F10].
- Bookmarkable project-filter URLs [N7 V10 F9].

### Show operational judgment

- Problem/artifact/verification/outcome receipt [N7 V9 F10].
- Recovery rehearsal with symptom and verified boundary [N8 V6 F8].
- Personal versus collaborative contribution boundaries [N7 V9 F10].
- Unresolved constraint and next justifying test [N8 V9 F9].
- Rollback/failure/next-improvement manifest [N8 V8 F8].
- Ownership/platform/unfinished boundary [N7 V9 F10].
- Failure-to-diagnosis-to-recovery strip [N8 V7 F9].
- ★ Six concise operational handovers [N8 V10 F10].
- Operated/platform/experimental boundary [N7 V9 F10].

### Avoid new machinery

- Clickable screenshot incident hotspots [N9 V4 F6] — trap: extra interaction and accessibility work, while the available screenshot does not establish a real incident narrative.
- Runtime profile object feeding every page [N5 V5 F7] — trap: adds client-side content dependence to a static site. Reuse published JSON for the CV and guide instead.

Converge: the three ★ ideas all score 9.30 and directly serve the hiring task. They preserve the existing site, make provenance visible and remove reading friction. Do not add a new routing system or an evidence dashboard.

### Focus

1. **Evidence matrix.** Pair practical skill areas with tools, work/lab/training labels and exact evidence links. The matrix complements existing tool dialogs. Its first step was mapping published claims to destinations. Load-bearing risk: a Work label could falsely imply employer deployment; the text keeps university duties separate from personal infrastructure. Child ideas: task-first rows, cross-context evidence, consistent case-study structure, learning progression.
2. **Hiring path.** Put role, email and PDF CV before project exploration. Ordinary links route monitoring to HPC, reliability to backups and automation to iDRAC. All project stories exist in HTML; filtering is an enhancement. First step: inspect the existing home/Contact/CV flow. Load-bearing risk: route convenience cannot compensate for weak ownership evidence. Child ideas: responsibility labels, visible sources, shared CV vocabulary, descriptive project contact links.
3. **Operational handovers.** Six stories each state problem, build, tools, scope, outcome and a prospective next improvement. Public code supports Engram and Cosmopod; existing screenshots and descriptions support the other stories. First step: build a source-backed content inventory. Load-bearing risk: configuration must not be presented as measured operational success. Child ideas: evidence links, context boundaries, diagrams only when supported, next measurements.

Provocation: the strongest next addition would be one documented restore rehearsal with a real elapsed time and acceptance check, rather than more project names.

## Validation and remaining limits

Automated source checks cover eleven page shells, links and anchors, six case studies, all 22 scope lines, qualification counts, 35 native skill buttons, inline/external JS syntax, and filter URLs/history/fallback behaviour. The two-page PDF is rasterized and visually inspected. Staged Flask checks cover the new profile structure, CV, project and assessment answers.

Computer Use stopped because the current browser URL could not be established safely. No further UI automation was attempted. Live browser clicking, 320/390px rendering, 200% zoom, keyboard dialog/menu behavior and appearance-preference rendering are not newly verified in this change. CSS defines the narrow-screen and preference behaviours; source checks are not a substitute for those browser checks.

See `CONTENT-TO-CONFIRM.md` for the short factual checklist. Live HTTP and installed-file hash checks are recorded in the deployment result; existing server configuration, Discord verification and unrelated files are preserved.

### Deployment result

The release was installed on 25 November 2026 with SHA-256 verification of 19 targeted files. All eleven public pages returned HTTP 200 with the new release marker. The CV returned HTTP 200 with `application/pdf`; the old Word URL resolved to the PDF. Public guide requests returned the updated CV, Intune-assessment, Engram and six-project answers. Discord domain verification still returns the original expected value. Apache configuration passed, and Apache and chatbot were active after the guide restart. Rollback is retained at `/root/hindley-before-hiring-20261125.tar.gz`. None of these checks establishes browser rendering or user interaction behavior.

### Reproducing checks

With Python, BeautifulSoup, Node and ReportLab available:

```sh
python tests/check_hiring_content.py
node tests/check_project_filters.cjs
python tests/check_palette.py
python tests/check_guide.py # requires Flask
python scripts/build_cv.py
```

`NODE_BINARY` can select a Node executable for the HTML/inline-JavaScript checks. `profile.json` remains the public source for the CV. Rasterize the rebuilt PDF and inspect both pages after changing it.
