# Apple-inspired portfolio direction

This is a web portfolio for people evaluating Jayden's infrastructure and automation work. Its job is to make the actual systems easy to explore. Apple's website supplies the composition: compact navigation, a centered statement, large imagery and a small number of blue actions. The HIG foundations apply as web principles; native iOS navigation and window conventions do not.

## Review and thesis

The previous iteration solved broken interactions, but the dark panels and equal-weight cards still obscured the work. The new thesis is "complex systems, made simple": a real HPC dashboard becomes the signature image, followed by two distinct project stories. There are no Apple logos, borrowed product images or claims of affiliation.

The initial idea of a generic centered landing page needed a stronger connection to the subject. It was revised around the existing HPC screenshot, backup notifications, iDRAC integration and Jayden's real portrait. The profile panel and decorative chips were removed from the first screen to give that work more space. This is design judgment, grounded in the portfolio's purpose.

## Tokens

| Role | Light | Dark |
| --- | --- | --- |
| Canvas | #ffffff | #161617 |
| Group surface | #f5f5f7 | #000000 / #242426 |
| Main content | #1d1d1f | #f5f5f7 |
| Secondary content | #626267 | #a1a1a6 |
| Links and focus | #0066cc | #85bbff |
| Border | #86868b | #86868b |

Computed WCAG contrast: main text on light group surface 15.46:1; secondary text 5.57:1; blue links on white and white text on blue actions both 5.57:1; dark secondary text on #242426 6.02:1; dark links on #242426 7.78:1. Status is also expressed by words. Controls retain at least 44px hit regions and visible focus.

One system UI font stack handles display, body and controls. Display scales from about 38px to 80px; section headings 32–56px; homepage supporting text 19–22px; ordinary body text 17px; utility labels 13–15px. The underlying native buttons, dialog, form labels, landmarks and live regions remain.

## Layout

Wide sections progressively move from the centered statement to a dashboard showcase, paired project stories, personal introduction and contact action. At compact widths, the menu expands vertically, project stories stack and all actions remain available.

```text
Regular                         Compact
name       navigation           name       Menu
       title                         title
       summary                       summary
       two actions                   two actions
   actual HPC screenshot         HPC screenshot
   backup       iDRAC             backup
   portrait + introduction       iDRAC
       contact                   portrait + introduction
                                 contact
```

Motion is limited to existing brief control feedback. No entrance animation is required to see content. Reduced motion disables animations; reduced transparency makes navigation solid; increased contrast strengthens text and boundaries. Appearance follows the device setting without an extra switch.

## Reference principles used

- `layout.md › Visual hierarchy`: "Group related items to clearly express related information or functions." Spacing and the two project stories provide grouping.
- `typography.md › Conveying hierarchy`: "Minimize the number of typefaces you use". Google font downloads were removed in favor of the system stack.
- `buttons.md › Best practices`: sufficient hit regions, press feedback and clear actions; existing interaction semantics stay intact.
- `accessibility.md › Vision`: text enlargement, real contrast measurements and non-color-only meaning.
- `color.md › Best practices`: semantic light/dark tokens and increased contrast variants.
- `branding.md › Best practices`: brand expression defers to content. Jayden's own screenshots and portrait carry identity.
- `motion.md › Best practices`: "Make motion optional." No new decorative motion.
- `design-principles.md › Simplicity`: remove elements without a useful job.

Also consulted the skill's cross-platform translation and Designing for iOS for touch and text adaptation, without applying native app conventions to this website.

## Scope

The update changes nine HTML shells and adds the shared `css/apple.css` layer after the existing layout styles. The portfolio guide, email-draft workflow, skill dialog, project filtering and telemetry collector remain functional. A fresh server backup precedes deployment, and assets use a new cache version.

At the owner's request, professional information was refreshed from his LinkedIn profile on 10 October 2026. `profile.json` contains only public professional facts: six roles, three education entries, seven qualifications/training entries, three courses, 45 distinct skills (46 profile entries with a duplicate SOLIDWORKS spelling merged), and two projects. The About page and portfolio guide now describe the Junior IT Technician role since July 2025. Overall apprenticeship Pass and professional-discussion Distinction are separate; expired ISC2 Candidate status is explicit; AZ-400 links to training and is not represented as DevOps Expert certification. Private analytics, recruiter-only preferences and account details were excluded.
