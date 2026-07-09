# MCAN Oyo State — Official Website

**Muslim Corpers' Association of Nigeria, Oyo State Chapter**  
Built with Next.js 14, Supabase, EmailJS, and deployed on Netlify.

---

## 🌟 Features

| Feature | Description |
|---|---|
| **Homepage** | Hero, upcoming & past events, daily Islamic content widget |
| **About** | Full MCAN history, mission, vision, aims & objectives, programmes |
| **Daily Content** | 7-day schedule (Hadith, Azkar, Tawheed, Fiqh, Jumu'ah, Stories) — admin-managed |
| **LGI & MCLO** | All 33 Oyo LGAs with officer contact info — grouped by zone |
| **Lodges** | Lodge directory with addresses, contacts & Google Maps directions |
| **Executives** | Current MCAN Oyo leadership with photos & contacts |
| **Registration** | Current-year-only signup (batch A/B/C, stream 1/2) |
| **Donate** | One-time & monthly donation with bank details & copy button |
| **Contact** | All contacts, socials, and quick action links |
| **Admin Panel** | Full CMS for all content — events, daily posts, executives, LGI, lodges, registrations, email campaigns, site settings |
| **Email Campaigns** | Batched sending (100/day via EmailJS), queue persistence across days |
| **Keep-Alive** | Netlify scheduled function pings Supabase every 5 days (prevents pause) |

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/your-org/mcan-oyo.git
cd mcan-oyo
npm install
```

### 2. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → paste the entire contents of `supabase/schema.sql` → **Run**
3. Go to **Storage** → create two **public** buckets: `events` and `executives`
4. Go to **Authentication → Users** → **Add User** → create your admin account

### 3. Configure EmailJS

1. Sign up at [emailjs.com](https://emailjs.com)
2. Create a new **Email Service** (Gmail recommended)
3. Create a new **Email Template** with these variables:
   - `{{to_name}}` — recipient name
   - `{{to_email}}` — recipient email  
   - `{{subject}}` — email subject
   - `{{message}}` — email body
4. Copy your **Service ID**, **Template ID**, and **Public Key**

### 4. Environment Variables

Copy `.env.example` to `.env.local` and fill in all values:

```bash
cp .env.example .env.local
```

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API (keep secret!) |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | EmailJS → Email Services |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | EmailJS → Email Templates |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | EmailJS → Account → General |

### 5. Seed Initial Data

```bash
# Seed daily content from JSON file
npx ts-node --project tsconfig.json scripts/seed-daily-content.ts
```

### 6. Run Locally

```bash
npm run dev
# Visit http://localhost:3000
# Admin: http://localhost:3000/admin
```

---

## 📦 Deployment (Netlify)

### First Deploy

1. Push your code to GitHub
2. Log in to [netlify.com](https://netlify.com) → **Add new site** → **Import from Git**
3. Select your repo
4. Build settings are auto-detected from `netlify.toml`
5. Add all environment variables from `.env.local` to **Netlify → Site Settings → Environment Variables**
6. Deploy!

### Keep-Alive Setup

The `netlify/functions/keep-alive.ts` scheduled function runs every 5 days automatically.
This prevents your **Supabase free tier** project from being paused (which happens after 7 days of inactivity).

No extra configuration needed — it's all in `netlify.toml`.

---

## 📁 Project Structure

```
mcan-oyo/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── about/page.tsx              # About MCAN
│   ├── daily/page.tsx              # Daily Islamic content
│   ├── lgi/page.tsx                # LGI & MCLO contacts
│   ├── lodges/page.tsx             # Lodge finder
│   ├── executives/page.tsx         # Current executives
│   ├── register/page.tsx           # Corps member registration
│   ├── donate/page.tsx             # Donation page
│   ├── contact/page.tsx            # Contact page
│   ├── events/[id]/page.tsx        # Event detail page
│   └── admin/
│       ├── layout.tsx              # Admin layout (auth-protected)
│       ├── login/page.tsx          # Admin login
│       ├── page.tsx                # Admin dashboard
│       ├── events/page.tsx         # Manage events
│       ├── daily-content/page.tsx  # Manage daily posts
│       ├── executives/page.tsx     # Manage executives
│       ├── lgi/page.tsx            # Edit LGI contacts
│       ├── lodges/page.tsx         # Manage lodges
│       ├── registrations/page.tsx  # View registrations + CSV export
│       ├── emails/page.tsx         # Email campaigns with batching
│       └── settings/page.tsx       # Site-wide settings CMS
├── components/
│   ├── Navbar.tsx                  # Mobile-responsive navigation
│   ├── Footer.tsx                  # Footer with donate CTA
│   ├── EventCard.tsx               # Event card (featured + compact)
│   ├── DailyContent.tsx            # Daily content display card
│   └── AdminSidebar.tsx            # Admin panel sidebar
├── lib/
│   ├── supabase.ts                 # Browser Supabase client + types
│   ├── supabase-server.ts          # Server-side Supabase clients
│   └── emailjs.ts                  # EmailJS with batching & queue
├── data/
│   └── daily-content.json          # Sample Islamic content for seeding
├── supabase/
│   └── schema.sql                  # Complete database schema
├── netlify/
│   └── functions/
│       └── keep-alive.ts           # Supabase keep-alive ping
└── scripts/
    └── seed-daily-content.ts       # Seed daily content from JSON
```

---

## 🔒 Admin Access

1. Go to `/admin/login`
2. Use the credentials you set up in **Supabase Authentication**

### Admin Capabilities

- ✅ Post/edit/delete events (with image upload, live streaming link)
- ✅ Add daily Islamic content for any day of the week
- ✅ Update executive list with photos
- ✅ Edit LGI & MCLO contacts for all 33 LGAs
- ✅ Add/edit lodges with map coordinates
- ✅ View all registrations with filters + CSV export
- ✅ Send email campaigns with automatic batching (100/day)
- ✅ Edit all site settings (contact info, bank details, socials)

---

## 📧 EmailJS Template Setup

Create a template in EmailJS with this HTML:

```html
<p>As-salamu alaykum wa rahmatullahi wa barakatuh,</p>
<p>Dear {{to_name}},</p>
<p>{{message}}</p>
<br>
<p>Baarakallahu feekum,<br>
MCAN Oyo State<br>
<em>Serving Islam through the Nation</em></p>
```

**To:** `{{to_email}}`  
**Subject:** `{{subject}}`

---

## 🗓 Registration Rules

- Only corps members with `service_year = CURRENT_YEAR` can register
- The year is determined server-side — no manipulation possible
- Duplicate emails for the same year are rejected
- Registered emails receive programme updates via EmailJS campaigns

---

## 🎨 Design System

| Color | Hex | Usage |
|---|---|---|
| Primary Green | `#145a32` | Main brand color (from logo) |
| Primary Light | `#1e8449` | Hover states |
| Gold | `#c8972a` | Accents, donate CTA |
| Cream | `#fafaf5` | Background |

**Fonts:**
- **Display:** Cormorant Garamond (headings, Arabic feel)
- **Body:** Outfit (clean, modern sans-serif)
- **Arabic:** Amiri (traditional Arabic calligraphy)

---

## 🤲 Jazakumullahu Khairan

May Allah accept this work as Sadaqah Jariyah for all who contributed.  
*"And cooperate in righteousness and piety." — Quran 5:2*
