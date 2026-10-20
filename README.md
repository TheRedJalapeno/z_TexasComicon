# Texas Comicon

The verified guide to Texas comic, anime, horror, and gaming conventions: [texascomicon.com](https://texascomicon.com).

A Jekyll site built by GitHub Pages. There is no build pipeline: push to `main` and Pages rebuilds.

## Local development

```bash
bundle install
bundle exec jekyll serve --livereload
```

## Content

| What | Where |
| --- | --- |
| Conventions (one page each) | `_conventions/<slug>.md` |
| Region landing pages | `_regions/<slug>.md` |
| Blog posts | `_posts/YYYY-MM-DD-title.md` |
| Site settings, ads, UTM, Mailchimp | `_config.yml` |

### Convention front matter

```yaml
title: "San Japan"
description: "One-sentence summary used on cards and as the meta description."
category: anime            # comic | anime | horror | gaming
region: san-antonio        # dfw | houston | central | san-antonio | west
city: "San Antonio"
venue: "Henry B. González Convention Center"
address: "900 E Market St" # optional
zip: "78205"
typical: "Labor Day weekend"   # human text for "Usually held"
month: 9                       # typical month number (directory filter and sort)
upcoming:
  start: 2027-09-03            # omit start/end when not announced
  end: 2027-09-05
  status: confirmed            # confirmed | listed | tba
held:
  start: 2026-09-04
  end: 2026-09-06
website: "https://www.san-japan.org/"
socials: { facebook: "...", instagram: "...", x: "...", tiktok: "...", youtube: "...", bluesky: "...", threads: "...", discord: "..." }
tags: ["anime", "gaming"]
featured: false     # true = pinned to the top of "Coming up next" until the event ends
claimed: false      # true = "Verified by organizer" badge; hides the Claim boxes
sponsored: false    # true = "Sponsored" label, rel="sponsored", hides the Sponsor boxes
sponsor:            # presenting sponsor credit, shown when sponsored: true
  name: ""
  url: ""
contact:            # used only on /outreach/, never shown on public pages
  email: "info@example.com"   # or null
  personal: true    # optional: a named person's address
  verify: true      # optional: inbox may not reach marketing
  note: "How to reach them"
verified: 2026-10-12
```

**Date status rules**

- `confirmed`: the dates are published on the organizer's official site.
- `listed`: only ticketing or calendar sites show the dates.
- `tba`: not announced. Leave out `upcoming.start` and `upcoming.end`.

Update `verified` every time you re-check a listing.

**Ended events.** Once `upcoming.end` passes, the convention drops out of every upcoming list (home page, calendar, sidebars, and the 2027 calendar post), even if it's featured or sponsored. Its page shows an "edition has ended" notice, and its event markup is removed. The build checks the date, and `site.js` re-checks against today's date in the browser, because GitHub Pages only rebuilds on push.

When an edition ends, move `upcoming` into `held`, then set `upcoming.status: tba` until new dates are published. Past events are also hidden in the browser automatically, so a missed update won't show stale "upcoming" dates.

## Outreach and contact

- **`/outreach/`** is a password gate. It hashes the password you type (SHA-256) and redirects to `/outreach/<hash>/`, the page built from `outreach-list.html`, so the password never appears in page source and crawlers have nothing to follow. To change the password, set that file's `permalink` to the new password's hash, which `printf 'newpass' | shasum -a 256` prints. The list itself is an internal list of every convention, with its contact email, a pre-written pitch mailto, "Copy all emails", and a CSV download. It isn't linked anywhere, is excluded from the sitemap, and has `noindex`. It's still a public URL, though, and the repo is public, so keep personal addresses (`personal: true`) to a minimum.
- **Claim, sponsor, add, and correction buttons** are mailto links to `contact.email` in `_config.yml`, with pre-filled subjects and bodies. The pitch email's sign-off is `outreach.signature`.

## Monetization

- **AdSense.** Auto ads run from `ads.client`. To turn on manual units, paste AdSense slot IDs into `ads.slots` in `_config.yml`. Empty slots show a house ad pointing to `/advertise/`. Add `ads: false` to any page's front matter to turn ads off there.
- **Sponsored content.** For a post, set `sponsored: true` and `sponsor: "Name"` to show a disclosure banner. For a convention, `sponsored: true` adds labels and `rel="sponsored"`, and `featured: true` pins it to the home page.
- **Outbound links.** Every link to a convention goes through `_includes/link.html`, which appends `utm_source=texascomicon&utm_medium=referral&utm_campaign=<slug>&utm_content=<link type>`. Clicks are sent to GA4 as `outbound_click` events, and claim/sponsor/correction mailto clicks as `generate_lead`.
