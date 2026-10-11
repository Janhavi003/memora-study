# Design System

## 1. Direction

Editorial learning studio: calm, tactile, focused, and information-rich. Avoid generic purple-gradient SaaS styling, excessive pill shapes, ornamental gradients, and chatbot-first layouts.

## 2. Color tokens

Use semantic tokens rather than hard-coded colors throughout components. Initial light-theme targets:

- `background`: warm ivory `#F7F5EF`
- `surface`: paper `#FFFEFA`
- `foreground`: charcoal `#202722`
- `primary`: forest green `#245640`
- `primary-foreground`: near-white `#F8FAF7`
- `secondary`: muted sage `#E4EADF`
- `muted`: warm gray `#ECEAE3`
- `muted-foreground`: `#68716A`
- `border`: `#DCDDD4`
- `destructive`: deep red `#A33D36`
- `focus`: accessible green outline with sufficient contrast

Dark mode should use deep charcoal-green surfaces, soft ivory text, and a restrained lighter green accent. Verify contrast for actual token pairs before release; these are design starting points, not a completed accessibility audit.

## 3. Typography

- Editorial display: a restrained serif for major page headings where licensing and loading permit; system fallback required.
- UI and body: readable sans-serif stack.
- Use a consistent type scale: display, page title, section title, body, small, caption.
- Avoid all-caps for long labels. Use tabular numerals for metrics and timers.
- Limit line length for explanatory copy.

## 4. Layout and spacing

Use a 4px base spacing scale (4, 8, 12, 16, 24, 32, 48, 64). Desktop app shell should include a stable navigation rail/sidebar and a readable content max-width. Mobile navigation should be reachable without obscuring content. Prefer aligned sections and whitespace over nested card containers.

## 5. Shape, borders, elevation

- Use subtle 1px borders to separate regions.
- Reserve larger radii for primary panels and flashcards; controls should have consistent modest radii.
- Use shadows sparingly, primarily to communicate elevation or a floating menu.
- Avoid wrapping every statistic and paragraph in a card.

## 6. Signature components

- **Study dashboard:** prominent “Continue studying” area, a compact due queue, streak and daily-goal indicators, recent decks, and a meaningful activity summary.
- **Focus room:** centered card, clear reveal action, restrained progress indicator, visible self-assessment choices after reveal, keyboard hint, completion summary.
- **Note-to-deck studio:** source editor beside candidate preview on wide screens; stacked flow on mobile; generation settings in a compact panel; explicit candidate status and edit/delete/approve actions.
- **Deck row/card:** title, subject, actual card count, due count, last studied if available, contextual actions.
- **Empty states:** explain why the area is empty and offer one relevant next action.
- **Notifications:** concise, announced accessibly, not the only way an error is communicated.

## 7. Interaction rules

- All interactive controls must have visible hover, focus-visible, active, disabled, and loading states as appropriate.
- Use semantic buttons/links and labels.
- Destructive actions require a confirmation dialog.
- Keyboard focus must remain predictable when dialogs open/close.
- Flashcard reveal should support Space/Enter only when focus context makes it safe; arrow navigation must not interfere with text inputs.
- Respect reduced-motion preferences. Animations should be brief and functional.
- Never use emoji as substitute iconography.

## 8. Responsive behavior

- Mobile: one-column workflows, compact top-level navigation, touch targets sized comfortably, no horizontal overflow.
- Tablet: collapsible navigation and balanced split panes where space allows.
- Desktop: persistent navigation and two-column note-to-deck studio.
- Test narrow widths, keyboard-only flows, zoom, and long deck/card titles.

## 9. Accessibility checklist

- Semantic landmarks and heading hierarchy.
- Accessible names and labels for form fields and icon-only controls.
- Keyboard operation and visible focus.
- Appropriate contrast in both themes.
- Error text linked to invalid fields.
- Dialog focus management.
- Status updates announced to assistive technology.
- Do not rely on color alone to communicate correctness or due state.
