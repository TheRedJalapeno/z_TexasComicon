---
title: "Texas Convention Calendar 2027: Every Date Announced So Far"
description: Confirmed and rumored 2027 dates for Texas comic cons, anime conventions, and gaming expos, kept current from our verified listings.
updated: 2026-10-12
---

Planning your 2027 convention year? Below is every Texas show in our directory with announced dates. The list is built straight from our verified listings, so it updates whenever a convention announces.

**Confirmed** means the organizer has published the dates on its official site. **Unconfirmed** means ticketing or calendar sites list dates the organizer hasn't posted yet, so don't book nonrefundable travel on those.

{% assign dated = site.conventions | where_exp: 'x', 'x.upcoming.start' | sort: 'upcoming.start' %}
<table class="table">
  <thead><tr><th>Dates</th><th>Convention</th><th>City</th><th>Status</th></tr></thead>
  <tbody>
  {% for c in dated %}
    <tr><td>{% include daterange.html start=c.upcoming.start end=c.upcoming.end %}</td><td><a href="{{ c.url | relative_url }}">{{ c.title }}</a></td><td>{{ c.city }}</td><td>{% include status.html status=c.upcoming.status %}</td></tr>
  {% endfor %}
  </tbody>
</table>

## Still waiting on dates

These established shows haven't announced their next edition yet. Here's when they usually run:

{% assign tba = site.conventions | where: 'upcoming.status', 'tba' | sort: 'month' %}
{% for c in tba %}- **[{{ c.title }}]({{ c.url | relative_url }})** ({{ c.city }}), usually {{ c.typical }}. Last held {% include daterange.html start=c.held.start end=c.held.end %}.
{% endfor %}

## Date changes to note

A few long-running shows are moving in 2027:

- **[FAN EXPO Dallas]({{ '/conventions/fan-expo-dallas/' | relative_url }})** goes back to **June** (June 11–13) after a September 2026 edition.
- **[El Paso Comic Con]({{ '/conventions/el-paso-comic-con/' | relative_url }})** moves up to **March 5–7**, about two months earlier than 2026.
- **[AggieCon]({{ '/conventions/aggiecon/' | relative_url }})** shifts from its late-January 2026 slot to **March 6–7**.
- **[Dream Con]({{ '/conventions/dream-con/' | relative_url }})** moves from July to **June 18–20**.
- **[Retro Expo]({{ '/conventions/retro-expo/' | relative_url }})** moves from March to **April 17–18**.

We re-check every listing regularly. Each convention page shows the date we last verified it.
