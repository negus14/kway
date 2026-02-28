# Kway — Product Specification Document

**Version:** 1.0
**Date:** 28 February 2026
**Author:** Abel
**Status:** Draft

---

## 1. The Problem

Google Maps is the world's most powerful navigation tool. But for millions of people — elderly users, those with cognitive difficulties, people with low digital literacy, anxious travellers — it is completely overwhelming.

The interface is cluttered. The steps are buried. The font is small. There is no way to print, save, or share directions in a format that a non-tech user can actually follow.

Adult children spend significant time helping their parents navigate before every journey. Care workers manually write down directions for residents. Elderly people avoid going places they want to go because they cannot figure out how to get there independently.

This is a solved problem that nobody has solved yet.

---

## 2. The Solution

Kway is a mobile app that sits quietly in the background until you need it.

When a user finds a route in Google Maps and taps "Share", Kway appears as an option in the share sheet — on both iOS and Android. The user taps it, and within seconds receives a clean, large-text, beautifully formatted directions card that they can:

- Print
- Save as PDF
- Send via WhatsApp
- Send via iMessage
- Export as an image

No maps to interpret. No cluttered interface. Just: turn left here, turn right there, you've arrived.

---

## 3. Target Users

### Primary User (the sender)
- Adult children aged 25–50
- Tech-comfortable
- Frustrated by having to explain directions to parents repeatedly
- Want a quick, reliable way to send directions their parents will actually follow

### End User (the recipient)
- Elderly people aged 60–85
- Low digital literacy
- Comfortable with WhatsApp, printing, paper
- Want independence but lack confidence navigating technology
- May have visual impairment, early cognitive decline, or anxiety around technology

### Secondary Users
- Care homes and assisted living facilities
- NHS and social care workers supporting independent living
- Travel agents printing directions for clients
- Councils running digital inclusion programmes
- Tourists and visitors unfamiliar with local areas

---

## 4. Name

**Chosen Name: Kway**

- Derived from Jamaican Patois/British street slang meaning "far"
- The app that makes nowhere feel too far away
- Short, punchy, memorable, unique — no conflicts in the navigation space
- Cultural authenticity — London-born, diaspora-rooted
- **Tagline:** "No place too Kway."

### Other Names Considered
WayToGo, A2B, Via, Mapped, Mapps, Lost, ClearWay, Sorted, Tootle, Mapper, RouteOne, AtoZ, Ways, Roadie

---

## 5. Core Features

### 5.1 Share Sheet Integration (MVP)
- App registers as a share target for Google Maps URLs on both iOS and Android
- User taps "Share" in Google Maps → Kway appears as an option
- App receives URL, parses origin and destination
- Calls routing API to retrieve turn-by-turn directions
- Generates formatted directions card instantly

### 5.2 Directions Card
- Large, readable font (minimum 16px body, 24px headings)
- Numbered steps with clear turn instructions
- Road names highlighted in pill/badge format
- Distance per step
- Total journey time and distance at top
- Travel mode indicator (driving, walking, transit)
- Origin and destination clearly labelled
- "You've arrived" confirmation at the bottom
- Kway branding in footer

### 5.3 Export Options
- **Print** — opens system print dialog, print-optimised layout
- **Save as PDF** — generates PDF, saves to device or Files app
- **Share via WhatsApp** — exports as image, opens WhatsApp share
- **Share via iMessage** — exports as image, opens Messages
- **Save to Photos** — saves as image to camera roll
- **Copy Link** — generates shareable web link to the directions card

### 5.4 Large Print Mode
- Toggle for increased font size throughout
- Higher contrast colour scheme
- Simplified layout with fewer elements
- Designed specifically for visual impairment and elderly users

### 5.5 Saved Routes
- Save frequently used routes (home to GP surgery, home to supermarket etc.)
- One-tap regeneration of directions card for saved routes
- Name and organise saved routes

### 5.6 Settings
- Default export format (PDF, image, print)
- Default share platform (WhatsApp, iMessage)
- Font size preference
- Colour scheme (standard, high contrast)
- Units (miles, kilometres)

---

## 6. Technical Architecture

### 6.1 Platform
**React Native** — single codebase targeting iOS and Android

Rationale:
- One codebase for both platforms reduces development time significantly
- Share extensions supported on both platforms via React Native modules
- Large ecosystem of libraries for PDF generation, image export, maps
- Can be developed and tested rapidly

### 6.2 Share Extension

**iOS:**
- Native Share Extension built as a separate target in Xcode
- Registered for `com.apple.share-services` with URL type filter
- Listens for `maps.google.com` and `goo.gl/maps` URLs
- Passes URL to main app via App Groups shared container
- Requires Apple Developer account (£79/year)

**Android:**
- Intent filter declared in `AndroidManifest.xml`
- Registered for `ACTION_SEND` with `text/plain` MIME type
- Filtered by Google Maps URL patterns
- Handled via React Native's Linking API
- More permissive than iOS — easier to implement

### 6.3 URL Parsing

Google Maps share URLs follow these patterns:
```
https://maps.google.com/maps?saddr=ORIGIN&daddr=DESTINATION
https://goo.gl/maps/SHORTCODE
https://maps.app.goo.gl/SHORTCODE
```

Strategy:
1. Detect URL pattern
2. If short URL — follow redirect to get full URL
3. Extract `saddr` (origin) and `daddr` (destination) parameters
4. If coordinates — reverse geocode to get human-readable address
5. Pass to routing API

### 6.4 Routing API

**Recommended: Google Maps Directions API**
- Most accurate, especially for UK roads
- Returns step-by-step HTML instructions
- Supports driving, walking, cycling, transit
- Free tier: 10,000 requests/month
- Paid: $5 per 1,000 requests beyond free tier

**Alternative: OpenRouteService** (free, open source)
- No API key required for low volume
- Slightly less accurate for complex urban routing
- Good fallback option

**Alternative: OSRM** (completely free)
- Self-hostable
- Very fast
- Driving only, no transit

### 6.5 PDF & Image Generation

**PDF:**
- React Native library: `react-native-html-to-pdf`
- Renders directions card HTML template to PDF
- Saved to device Documents folder or shared via system share sheet

**Image:**
- Library: `react-native-view-shot`
- Captures directions card view as PNG
- Optimised for WhatsApp sharing (1080px wide)

### 6.6 Backend (Optional for MVP)

MVP can be entirely client-side. Backend becomes useful for:
- Storing saved routes in the cloud (sync across devices)
- Generating shareable web links to directions cards
- Analytics and usage tracking
- B2B subscription management

Stack if needed: Node.js / TypeScript, deployed on Railway or Render

### 6.7 Distribution

**Consumer:**
- Apple App Store (requires Apple Developer account, £79/year)
- Google Play Store (one-time fee, £20)
- TestFlight for iOS beta testing (free, no App Store review)
- Direct APK for Android sideloading (no Play Store needed)

**B2B:**
- MDM (Mobile Device Management) deployment for care homes
- Direct APK distribution for Android-heavy care environments
- Enterprise App Store distribution for large NHS trusts

---

## 7. Design Principles

- **Clarity above all** — every screen has one job
- **Large everything** — text, buttons, spacing
- **No map required** — the user never needs to interpret a map
- **Reassuring tone** — warm, encouraging, never condescending
- **Print-first thinking** — every output should look as good on paper as on screen
- **One tap to share** — the entire flow from share to WhatsApp in under 10 seconds

---

## 8. User Flow

```
User opens Google Maps
        ↓
User searches for destination and gets directions
        ↓
User taps "Share" button in Google Maps
        ↓
Kway appears in share sheet
        ↓
User taps Kway
        ↓
App opens, parses URL (2–3 seconds)
        ↓
Directions card generated and displayed
        ↓
User selects export option:
  → Print
  → Save as PDF
  → Send via WhatsApp
  → Send via iMessage
  → Save to Photos
        ↓
Done — recipient receives clear, readable directions
```

---

## 9. Monetisation Strategy

### Tier 1: Free
- Up to 10 direction exports per month
- Standard font size
- Kway watermark on exports
- WhatsApp and iMessage sharing

### Tier 2: Personal (£2.99/month or £19.99/year)
- Unlimited exports
- Large print mode
- No watermark
- PDF export
- Saved routes (up to 20)
- Priority customer support

### Tier 3: Family (£4.99/month or £34.99/year)
- Everything in Personal
- Up to 5 family members
- Shared saved routes
- One-tap resend of saved routes to family members

### Tier 4: Care Home / Professional (£49/month per location)
- Unlimited exports
- Bulk route management
- Staff accounts (up to 10 per location)
- Branded exports with care home logo
- Print queue management
- Resident route profiles
- API access for integration with care management software

### Revenue Projections (Conservative)

| Tier | Users | MRR |
|------|-------|-----|
| Personal | 500 | £1,495 |
| Family | 100 | £499 |
| Care Home | 10 locations | £490 |
| **Total** | | **£2,484/mo** |

### Revenue Projections (Optimistic, 12 months post-launch)

| Tier | Users | MRR |
|------|-------|-----|
| Personal | 5,000 | £14,950 |
| Family | 1,000 | £4,990 |
| Care Home | 100 locations | £4,900 |
| **Total** | | **£24,840/mo** |

---

## 10. Go-To-Market Strategy

### Phase 1: Launch (Month 1–2)
- Launch on TestFlight and Android APK for beta testing
- Share in relevant Facebook groups (elderly parent support groups, digital inclusion communities)
- Post in Reddit communities: r/mildlyinteresting, r/CasualUK, r/eldercare
- LinkedIn post targeting care home managers and social workers

### Phase 2: Growth (Month 3–6)
- Submit to App Store and Google Play
- Pitch to bloggers and journalists covering eldercare and digital inclusion
- Target "apps for elderly parents" listicles and YouTube channels
- Approach Age UK, Alzheimer's Society as potential partners
- Cold outreach to 50 care homes in London

### Phase 3: Scale (Month 6–12)
- B2B sales push targeting care home groups (multi-location operators)
- NHS digital inclusion programme partnerships
- Local council digital skills programme integrations
- Consider white-labelling for care home brands

---

## 11. Competitive Landscape

| Product | What it does | Gap |
|---------|-------------|-----|
| Google Maps | Full navigation | Too complex for elderly users |
| Apple Maps | Full navigation | Same problem |
| Waze | Crowdsourced navigation | Even more complex |
| Google Maps Print | Basic print from desktop | No mobile share, poor formatting |
| **None** | Simple shareable directions card | **This is Kway** |

No direct competitor exists. The gap is real.

---

## 12. Risks

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Google builds this natively into Maps | Medium | Move fast, build B2B moat |
| Google Maps API pricing increases | Low | Build OpenRouteService fallback |
| App Store rejection | Low | Follow guidelines carefully, appeal if needed |
| Low organic discovery | High | Invest in targeted community marketing |
| Share extension broken by iOS update | Medium | Monitor beta releases, test early |

---

## 13. MVP Scope

The minimum viable product needed to validate the idea:

- [x] React Native app shell
- [x] Android share intent integration
- [x] iOS share extension
- [x] Google Maps URL parser
- [x] Google Maps Directions API integration
- [x] Directions card UI (large text, numbered steps)
- [x] WhatsApp export (image)
- [x] Print export
- [ ] PDF export (post-MVP)
- [ ] Saved routes (post-MVP)
- [ ] Large print mode (post-MVP)
- [ ] Subscription/payments (post-MVP)
- [ ] Care home tier (post-MVP)

**Estimated MVP build time:** 2–4 weeks (solo developer)

---

## 14. Directions Card Export Format

The directions card is the core output of Kway. It must:
- Be readable by someone with no smartphone required
- Print cleanly on A4 paper
- Be legible by elderly users with mild visual impairment
- Contain everything needed to complete the journey without referring back to the app

### Required Fields

```
[Kway branding — top left]
─────────────────────────────────────────
FROM: [Origin name and address]
TO:   [Destination name and address]
─────────────────────────────────────────
Total time: X min
Total distance: X miles
Travel mode: Driving / Walking / Transit
─────────────────────────────────────────
STEP 1: [Instruction]
         [Road name badge]              [Distance]

STEP 2: [Instruction]
         [Road name badge]              [Distance]
...
─────────────────────────────────────────
YOU HAVE ARRIVED
[Destination address]
─────────────────────────────────────────
Generated: [Date] via Google Maps · Kway
```

### Typography
- Step instructions: minimum 16px, ideally 18px
- Road name badges: 13px, bold
- Distances: 14px, muted
- Origin/destination names: 26px, serif display font
- Large print mode: all sizes +4px minimum

---

## 15. Next Steps

- [ ] Register kway.app or getkway.com or nokway.com domain
- [ ] Create Apple Developer account
- [ ] Create Google Play Developer account
- [ ] Set up React Native project with Expo or bare workflow
- [ ] Implement Android share intent (easiest, start here)
- [ ] Integrate Google Maps Directions API
- [ ] Build directions card UI
- [ ] Test full flow Android → WhatsApp
- [ ] Implement iOS share extension
- [ ] Beta test with real elderly users (including mum)
- [ ] Iterate on font size, layout, wording
- [ ] Submit to App Store and Play Store
- [ ] Soft launch and community marketing
- [ ] Cold outreach to 10 care homes

---

*Kway — No place too Kway.*
