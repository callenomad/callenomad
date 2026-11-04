#!/usr/bin/env python3
"""
CalleNomad Programmatic SEO (pSEO) Page Builder.
Compiles data/survival_playbooks.json + HTML templates into pre-rendered static pages,
generates the survival hub directory, updates sitemap.xml and robots.txt.
"""

import html
import json
import os
import urllib.parse
from datetime import datetime
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_FILE = BASE_DIR / "data" / "survival_playbooks.json"
TEMPLATES_DIR = BASE_DIR / "templates"
GUIDE_TEMPLATE_FILE = TEMPLATES_DIR / "survival_guide_template.html"
HUB_TEMPLATE_FILE = TEMPLATES_DIR / "survival_hub_template.html"
SURVIVAL_DIR = BASE_DIR / "survival"
SITEMAP_FILE = BASE_DIR / "sitemap.xml"
ROBOTS_FILE = BASE_DIR / "robots.txt"


def escape_js_string(s: str) -> str:
    """Safely escape string for embedding inside single-quoted JS onclick."""
    return s.replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n").replace("\r", "")


def build_comparison_table(rows):
    lines = [
        '<div class="comparison-table-wrapper">',
        '  <table class="comparison-table">',
        '    <thead>',
        '      <tr>',
        '        <th style="width: 25%;">Situation / Intent</th>',
        '        <th style="width: 25%;">Textbook Spanish ❌</th>',
        '        <th style="width: 25%;">Calle Spanish ✅</th>',
        '        <th style="width: 25%;">Cultural Nuance</th>',
        '      </tr>',
        '    </thead>',
        '    <tbody>',
    ]
    for r in rows:
        intent = html.escape(r["intent"])
        textbook = html.escape(r["textbook"])
        calle = html.escape(r["calle"])
        nuance = html.escape(r["nuance"])
        lines.append('      <tr>')
        lines.append(f'        <td><strong>{intent}</strong></td>')
        lines.append(f'        <td class="table-textbook">{textbook}</td>')
        lines.append(f'        <td class="table-calle">{calle}</td>')
        lines.append(f'        <td class="table-nuance">{nuance}</td>')
        lines.append('      </tr>')
    lines.append('    </tbody>')
    lines.append('  </table>')
    lines.append('</div>')
    return "\n".join(lines)


def build_audio_tasters(tasters):
    lines = ['<div class="audio-grid">']
    for t in tasters:
        phrase = html.escape(t["phrase"])
        translation = html.escape(t["translation"])
        breakdown = html.escape(t["breakdown"])
        # Encode audio URL cleanly
        audio_file_rel = t["file"]
        encoded_audio_url = "/" + urllib.parse.quote(audio_file_rel)
        lines.append('  <div class="audio-card">')
        lines.append('    <div class="audio-card-header">')
        lines.append(f'      <div class="audio-phrase">{phrase}</div>')
        lines.append(f'      <div class="audio-translation">{translation}</div>')
        lines.append(f'      <div class="audio-breakdown">{breakdown}</div>')
        lines.append('    </div>')
        lines.append('    <div class="audio-player-wrapper">')
        lines.append(f'      <audio controls preload="none">')
        lines.append(f'        <source src="{encoded_audio_url}" type="audio/mp4">')
        lines.append('        Your browser does not support audio playback.')
        lines.append('      </audio>')
        lines.append('    </div>')
        lines.append('  </div>')
    lines.append('</div>')
    return "\n".join(lines)


def build_mini_quiz(quiz):
    lines = [
        '<div class="quiz-widget-card">',
        '  <div class="quiz-header">',
        '    <span class="quiz-badge">Interactive Challenge</span>',
        '    <h3>Street Fluency Quick Test</h3>',
        '    <p>Select the response that demonstrates native cultural fluency:</p>',
        '  </div>',
    ]
    for idx, q in enumerate(quiz):
        q_text = html.escape(q["question"])
        lines.append(f'  <div class="quiz-question-block" data-qindex="{idx}">')
        lines.append(f'    <div class="quiz-question-title"><strong>Question {idx + 1}:</strong> {q_text}</div>')
        lines.append('    <div class="quiz-options">')
        for opt in q["options"]:
            opt_text = html.escape(opt["text"])
            is_correct_bool = "true" if opt["correct"] else "false"
            feedback_escaped = escape_js_string(opt["feedback"])
            lines.append(
                f'      <button type="button" class="quiz-option-btn" '
                f'onclick="selectQuizOption(this, {is_correct_bool}, {idx}); '
                f'this.closest(\'.quiz-question-block\').querySelector(\'.quiz-feedback\').innerHTML = \'{feedback_escaped}\';">'
                f'{opt_text}</button>'
            )
        lines.append('    </div>')
        lines.append('    <div class="quiz-feedback"></div>')
        lines.append('  </div>')

    # Result summary box
    lines.append('  <div id="quizResultSummary" class="quiz-result-summary">')
    lines.append('    <div id="quizScoreText" class="quiz-score-badge"></div>')
    lines.append('    <p style="margin-bottom: 1.25rem; font-size: 0.95rem; color: var(--text-secondary);">'
                 'Ready to stop translating in your head and speak with effortless Colombian confidence?</p>')
    lines.append('    <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">')
    lines.append('      <a href="https://buy.stripe.com/9B628r7dUh1G8LndbAcV203" class="vault-promo-cta" style="padding: 0.65rem 1.25rem; font-size: 0.875rem;">'
                 '🎧 Get 30 Audio Vault Clips ($19)</a>')
    lines.append('      <a href="https://cal.com/callenomad/20min" class="header-cta-btn" style="padding: 0.65rem 1.25rem; font-size: 0.875rem;">'
                 '⚡ Book Free 20-Min Audit</a>')
    lines.append('    </div>')
    lines.append('  </div>')
    lines.append('</div>')
    return "\n".join(lines)


def build_whatsapp_scripts(scripts):
    lines = ['<div class="whatsapp-scripts-container">']
    for s in scripts:
        title = html.escape(s["title"])
        raw_script = s["script"]
        escaped_script = html.escape(raw_script)
        english = html.escape(s["english"])
        js_safe_script = escape_js_string(raw_script)
        lines.append('  <div class="whatsapp-card">')
        lines.append(f'    <div class="whatsapp-card-title">{title}</div>')
        lines.append(f'    <div class="whatsapp-speech-bubble">{escaped_script}</div>')
        lines.append(f'    <div class="whatsapp-english">Translation: &ldquo;{english}&rdquo;</div>')
        lines.append(
            f'    <button type="button" class="copy-btn" onclick="copyScript(this, \'{js_safe_script}\')">'
            f'<span>📋</span> Copy Script</button>'
        )
        lines.append('  </div>')
    lines.append('</div>')
    return "\n".join(lines)


def build_faqs(faqs):
    lines = ['<div class="faq-list">']
    for f in faqs:
        q = html.escape(f["question"])
        a = html.escape(f["answer"])
        lines.append('  <div class="faq-item">')
        lines.append(
            f'    <button type="button" class="faq-question" onclick="var ans = this.nextElementSibling; '
            f'var isHidden = ans.style.display === \'none\'; '
            f'ans.style.display = isHidden ? \'block\' : \'none\'; '
            f'this.querySelector(\'.faq-toggle-icon\').textContent = isHidden ? \'−\' : \'+\';">'
            f'<span>{q}</span><span class="faq-toggle-icon">+</span></button>'
        )
        lines.append(f'    <div class="faq-answer" style="display: none;">{a}</div>')
        lines.append('  </div>')
    lines.append('</div>')
    return "\n".join(lines)


def build_related_guides(current_slug, playbooks):
    lines = ['<div class="related-guides-grid">']
    for p in playbooks:
        if p["slug"] == current_slug:
            continue
        city = html.escape(p["city"])
        title = html.escape(p["metaTitle"])
        slug = p["slug"]
        lines.append(f'  <a href="/survival/{slug}/" class="related-guide-card">')
        lines.append(f'    <div class="related-guide-city">{city}</div>')
        lines.append(f'    <div class="related-guide-title">{title}</div>')
        lines.append('  </a>')
    lines.append('</div>')
    return "\n".join(lines)


def build_schema_json(playbook):
    article_schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": playbook["h1"],
        "description": playbook["metaDescription"],
        "url": f"https://callenomad.com/survival/{playbook['slug']}/",
        "image": "https://callenomad.com/og-image.jpg",
        "author": {
            "@type": "Person",
            "name": "Ben Chiverton-Hunt",
            "url": "https://callenomad.com"
        },
        "publisher": {
            "@type": "Organization",
            "name": "CalleNomad",
            "url": "https://callenomad.com"
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": f"https://callenomad.com/survival/{playbook['slug']}/"
        }
    }

    faq_schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": f["question"],
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": f["answer"]
                }
            }
            for f in playbook.get("faqs", [])
        ]
    }

    return (
        f'<script type="application/ld+json">\n{json.dumps(article_schema, indent=2, ensure_ascii=False)}\n</script>\n'
        f'<script type="application/ld+json">\n{json.dumps(faq_schema, indent=2, ensure_ascii=False)}\n</script>'
    )


def build_hub_grid(playbooks):
    lines = []
    for p in playbooks:
        badge = html.escape(p["cityBadge"])
        title = html.escape(p["metaTitle"])
        desc = html.escape(p["metaDescription"])
        read_time = html.escape(p["readTime"])
        slug = p["slug"]
        lines.append(f'<div class="playbook-card">')
        lines.append(f'  <div class="playbook-card-badge">{badge}</div>')
        lines.append(f'  <h2 class="playbook-card-title"><a href="/survival/{slug}/">{title}</a></h2>')
        lines.append(f'  <p class="playbook-card-desc">{desc}</p>')
        lines.append(f'  <div class="playbook-card-footer">')
        lines.append(f'    <span>{read_time}</span>')
        lines.append(f'    <a href="/survival/{slug}/" class="playbook-read-link">Read Guide →</a>')
        lines.append(f'  </div>')
        lines.append(f'</div>')
    return "\n".join(lines)


def build_sitemap(playbooks):
    today = datetime.now().strftime("%Y-%m-%d")
    urls = [
        ("https://callenomad.com/", "1.0", "weekly"),
        ("https://callenomad.com/survival/", "0.9", "weekly"),
        ("https://callenomad.com/quiz/", "0.8", "monthly"),
    ]
    for p in playbooks:
        urls.append((f"https://callenomad.com/survival/{p['slug']}/", "0.8", "monthly"))

    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for loc, priority, changefreq in urls:
        lines.append('  <url>')
        lines.append(f'    <loc>{loc}</loc>')
        lines.append(f'    <lastmod>{today}</lastmod>')
        lines.append(f'    <changefreq>{changefreq}</changefreq>')
        lines.append(f'    <priority>{priority}</priority>')
        lines.append('  </url>')
    lines.append('</urlset>')

    with open(SITEMAP_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")
    print(f"Generated {SITEMAP_FILE} with {len(urls)} URLs")


def build_robots():
    content = """User-agent: *
Allow: /

Sitemap: https://callenomad.com/sitemap.xml
"""
    with open(ROBOTS_FILE, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Generated {ROBOTS_FILE}")


def main():
    print(f"Loading manifest from {DATA_FILE}")
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        playbooks = json.load(f)

    with open(GUIDE_TEMPLATE_FILE, "r", encoding="utf-8") as f:
        guide_template = f.read()

    with open(HUB_TEMPLATE_FILE, "r", encoding="utf-8") as f:
        hub_template = f.read()

    SURVIVAL_DIR.mkdir(parents=True, exist_ok=True)

    # 1. Build individual playbooks
    for p in playbooks:
        slug = p["slug"]
        slug_dir = SURVIVAL_DIR / slug
        slug_dir.mkdir(parents=True, exist_ok=True)
        out_file = slug_dir / "index.html"

        content = guide_template
        content = content.replace("{{H1}}", html.escape(p["h1"]))
        content = content.replace("{{META_TITLE}}", html.escape(p["metaTitle"]))
        content = content.replace("{{META_DESCRIPTION}}", html.escape(p["metaDescription"]))
        content = content.replace("{{CANONICAL_URL}}", f"https://callenomad.com/survival/{slug}/")
        content = content.replace("{{SCHEMA_JSON}}", build_schema_json(p))
        content = content.replace("{{BREADCRUMB_NAME}}", html.escape(p["metaTitle"]))
        content = content.replace("{{CITY_BADGE}}", html.escape(p["cityBadge"]))
        content = content.replace("{{READ_TIME}}", html.escape(p["readTime"]))
        content = content.replace("{{INTRO_HOOK}}", html.escape(p["introHook"]))
        content = content.replace("{{COMPARISON_TABLE}}", build_comparison_table(p["comparisonRows"]))
        content = content.replace("{{AUDIO_TASTERS}}", build_audio_tasters(p["audioTasters"]))
        content = content.replace("{{MINI_QUIZ}}", build_mini_quiz(p["miniQuiz"]))
        content = content.replace("{{WHATSAPP_SCRIPTS}}", build_whatsapp_scripts(p["whatsappScripts"]))
        content = content.replace("{{FAQS}}", build_faqs(p["faqs"]))
        content = content.replace("{{RELATED_GUIDES}}", build_related_guides(slug, playbooks))

        # Check for unrendered placeholders
        if "{{" in content:
            raise RuntimeError(f"Unrendered placeholder remains in {slug} page!")

        with open(out_file, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Generated {out_file}")

    # 2. Build hub index
    hub_grid_html = build_hub_grid(playbooks)
    hub_content = hub_template.replace("{{GUIDES_GRID}}", hub_grid_html)
    if "{{" in hub_content:
        raise RuntimeError("Unrendered placeholder remains in hub page!")

    hub_out_file = SURVIVAL_DIR / "index.html"
    with open(hub_out_file, "w", encoding="utf-8") as f:
        f.write(hub_content)
    print(f"Generated {hub_out_file}")

    # 3. Generate sitemap.xml & robots.txt
    build_sitemap(playbooks)
    build_robots()
    print("Build complete!")


if __name__ == "__main__":
    main()
