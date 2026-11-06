# ReUseU — The Campus Circular Marketplace 🌿🎓

> **“Your next find. Someone else’s second chance.”**  
> *Buy less new. Find more nearby.*

Built for the **Smart Campus & Student Life** challenge: A campus-exclusive circular economy platform where university students can **buy, sell, lend, donate, and swap** pre-loved textbooks, lab essentials, calculators, hostel furniture, sports equipment, and electronics within their own verified campus community.

---

## 🏆 Key Features Built

1. **Editorial Asymmetrical Landing Experience**
   - Distinctive brand identity (Forest Green `#173F35`, Warm Ivory `#F7F5EF`, Lime `#C6F36B`, Muted Sage `#A6B8A4`).
   - Dynamic floating product showcases, trending campus listings, interactive category tiles, and transparent sustainability impact metrics.

2. **Full-Featured Campus Marketplace (`/marketplace`)**
   - Real-time debounced multi-field search across title, description, category, and tags.
   - Rich filter panel: Category taxonomy, exchange modes (Sell, Donate, Lend, Swap), item condition, max price slider, and designated campus pickup spots.
   - Multi-mode sorting: Recently listed, most popular, price low-to-high, price high-to-low.
   - Quick one-click filter for free campus giveaways (`$0`).

3. **Product Detail Experience (`/listing/:id`)**
   - Multi-angle high-resolution image gallery with thumbnail preview.
   - Contextual exchange action modals:
     - **Sell:** Make an offer with custom price negotiation.
     - **Donate:** Request free donation with student reason and pickup preference.
     - **Lend:** Request temporary loan with duration.
     - **Swap:** Propose campus item exchange based on seller preference.
   - Interactive favorite saving and content moderation reporting modal.
   - Verified student seller profile card with ratings, reviews, and items reused count.

4. **Multi-Step Listing Creation Flow (`/sell`)**
   - **Step 1:** Choose exchange model (Sell, Donate, Lend, Swap).
   - **Step 2:** Item title, description, category, condition, pricing, tags, and illustrated safe campus pickup spot selector.
   - **Step 3:** Image uploader with device file upload, preview, and demo preset shortcuts.
   - **Step 4:** Live preview, campus guidelines confirmation, and publication with celebratory confetti.

5. **Campus Wanted Board & Matching Engine (`/wanted`)**
   - Community-powered request board for students needing specific textbooks, lab coats, or equipment.
   - **Smart Algorithmic Matching:** Evaluates marketplace listings against wanted requests using token overlap, category taxonomy, and budget compatibility (`findMatchesForWanted`).
   - "I Have This Item" instant peer connection.

6. **Interactive Buyer-Seller Messaging (`/messages`)**
   - Two-pane conversation interface with listing preview card.
   - Offer alerts directly inside chat bubbles.
   - Simulated peer reply trigger to test interactive live chat in demo mode.

7. **Personalized User Dashboard (`/dashboard`)**
   - Overview metrics: Active listings, completed exchanges, recovered student value, and incoming offers.
   - Listings management: view, mark reserved, mark completed, or delete.
   - Peer offer negotiation: accept (reserves item and creates transaction) or decline.
   - Personal circular impact calculation.

8. **Orders & Handover History (`/orders`)**
   - Complete record of completed and pending student handovers.
   - Interactive peer review modal to submit 1-5 star ratings and comments.

9. **Sustainability Impact Dashboard (`/impact`)**
   - Live metrics: Items reused, student savings, items donated, completed swaps, estimated waste diverted (kg), and CO₂e emissions avoided.
   - Transparent, documented illustrative methodology.

10. **Campus Moderation & Governance (`/admin`)**
    - Student moderator desk to inspect flagged items, remove inappropriate listings, inspect users, and reset seed state.

11. **Instant Persona Switcher & Authentication (`/auth`)**
    - Seamless switching between student personas (Arjun Verma - CS Junior, Maya Lin - Biomed Senior & Lab TA, Carlos Diaz - MechE Cyclist, Sarah Jenkins - Architecture Senior) and Campus Green Committee Admin.

---

## 🛠️ Tech Stack

- **Framework:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS (custom editorial palette & typography)
- **Routing:** React Router v6
- **Animations:** Framer Motion
- **State Management:** Zustand (reactive local persistence)
- **Icons:** Lucide React
- **Confetti:** Canvas Confetti
- **Database Architecture:** PostgreSQL Schema (`supabase_schema.sql`) + Supabase client fallback layer

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 🔑 Demo Accounts Available (Quick Switch in Top Bar or `/auth`)

1. **Arjun Verma** (`arjun.v@campus.edu`) — CS Junior, resident at Hostel Block 4.
2. **Maya Lin** (`maya.lin@campus.edu`) — Biomed Senior & Chemistry Lab TA.
3. **Carlos Diaz** (`carlos.d@campus.edu`) — MechE Sophomore & campus cyclist.
4. **Sarah Jenkins** (`sarah.j@campus.edu`) — Architecture Senior.
5. **Campus Green Committee** (`moderator@campus.edu`) — Official Campus Administrator.
