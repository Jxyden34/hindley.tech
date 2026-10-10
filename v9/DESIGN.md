# hindley.tech design implementation

Purpose: help employers and collaborators understand Jayden's practical infrastructure and automation work, then contact him.

Keep the existing dark identity, portrait, Inter body type and Space Grotesk headings. Make the real HPC, backup and iDRAC screenshots the defining visual element. The three featured builds form the same sequence on the homepage and Projects page, with honest case studies drawn only from existing public claims.

Remove the redundant three generic homepage claims, floating skills physics, content-panel blur and recurring decorative background motion. Navigation may retain a restrained translucent surface; content remains opaque and readable.

## Tokens

| Role | Dark | Light counterpart | Measured dark contrast |
| --- | --- | --- | --- |
| Canvas | #0b1020 | #f8fafc | — |
| Content surface | #121a2a | #ffffff | — |
| Main text | #f8fafc | #0b1020 | 18.10:1 on canvas |
| Supporting text | #b6c2d3 | #475569 | 9.65:1 on surface |
| Links / focus | #7dd3fc | #075985 | 10.44:1 on surface |
| Primary action | #7c3aed | #7c3aed | White label 5.70:1 |

Dark is the retained site appearance; light counterparts document future roles rather than introducing an unsolicited appearance switch. Body: 17px / 1.65. Card copy: 16px / 1.6. Utility labels: 14px. Display: 36–60px, responsive, 1.08 line-height. Controls at least 44px tall. Focus ring 3px blue with 4px separation. No information depends solely on accent color.

## Layout

Regular: familiar header → compact two-column introduction and portrait → three featured builds with real screenshots → contact invitation → footer.

```
JH hindley.tech                       Home About Skills Projects Security Contact
[Jayden / concise headline + two links]         [portrait + practical strengths]
Selected work
[HPC screenshot + case study] [Backups screenshot + case study] [iDRAC + case study]
Contact invitation
```

Compact: brand and Menu → stacked introduction → portrait → single-column featured builds; Skills shows two columns when space allows, otherwise one.

```
JH hindley.tech  [Menu]
Jayden / headline
[View projects] [Contact]
Portrait and strengths
Selected work
HPC / case study
Backups / case study
iDRAC / case study
Contact invitation
```

Critique: a generic dark tech template would lead with glowing badges and promises. This design instead leads to actual screenshots and specific build notes. Familiar controls provide navigation; the identity belongs in Jayden's work. No decorative motion is necessary. Existing terminal easter egg remains available, with accessible hiding and without intercepting text entry.

Apply Apple foundations to web semantics: accessibility.md › Speech, layout.md › Visual hierarchy and Adaptability, typography.md › Ensuring legibility, branding.md › Best practices. Validate 320px, 390px and desktop widths, keyboard dialogs and menu, 200% text enlargement, reduced motion and transparency, real chat fallback, telemetry freshness and project-to-contact context. Keep factual career dates pending user clarification.
