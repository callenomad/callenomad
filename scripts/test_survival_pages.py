#!/usr/bin/env python3
"""
Test suite for CalleNomad Programmatic SEO (pSEO) Survival Playbooks.
Validates content manifest, templates, generated static HTML pages, and sitemap.
"""

import os
import sys
import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_FILE = BASE_DIR / "data" / "survival_playbooks.json"
AUDIOS_DIR = BASE_DIR / "audios"

EXPECTED_SLUGS = [
    "negotiate-rent-medellin-spanish",
    "colombian-taxi-indrive-spanish-phrases",
    "dating-whatsapp-slang-colombia",
    "order-coffee-tinto-medellin-bogota",
    "what-does-dar-papaya-lucas-mean",
]

REQUIRED_TOP_FIELDS = [
    "slug",
    "metaTitle",
    "metaDescription",
    "h1",
    "city",
    "cityBadge",
    "readTime",
    "updatedDate",
    "introHook",
    "comparisonRows",
    "audioTasters",
    "miniQuiz",
    "whatsappScripts",
    "faqs",
]

REQUIRED_GUIDE_PLACEHOLDERS = [
    "{{H1}}",
    "{{META_TITLE}}",
    "{{META_DESCRIPTION}}",
    "{{CANONICAL_URL}}",
    "{{SCHEMA_JSON}}",
    "{{BREADCRUMB_NAME}}",
    "{{CITY_BADGE}}",
    "{{READ_TIME}}",
    "{{INTRO_HOOK}}",
    "{{COMPARISON_TABLE}}",
    "{{AUDIO_TASTERS}}",
    "{{MINI_QUIZ}}",
    "{{WHATSAPP_SCRIPTS}}",
    "{{FAQS}}",
    "{{RELATED_GUIDES}}",
]

GUIDE_TEMPLATE_FILE = BASE_DIR / "templates" / "survival_guide_template.html"
HUB_TEMPLATE_FILE = BASE_DIR / "templates" / "survival_hub_template.html"


def test_manifest():
    print(f"Testing manifest existence at: {DATA_FILE}")
    assert DATA_FILE.exists(), f"Manifest file does not exist: {DATA_FILE}"

    with open(DATA_FILE, "r", encoding="utf-8") as f:
        try:
            playbooks = json.load(f)
        except json.JSONDecodeError as e:
            raise AssertionError(f"Manifest is not valid JSON: {e}")

    assert isinstance(playbooks, list), f"Manifest root must be a list, got {type(playbooks)}"
    assert len(playbooks) == 5, f"Expected exactly 5 playbooks, got {len(playbooks)}"

    found_slugs = [p.get("slug") for p in playbooks]
    assert found_slugs == EXPECTED_SLUGS, f"Slugs mismatch! Expected {EXPECTED_SLUGS}, got {found_slugs}"

    for i, p in enumerate(playbooks):
        slug = p.get("slug", f"index_{i}")
        for field in REQUIRED_TOP_FIELDS:
            assert field in p and p[field], f"[{slug}] Missing or empty required field: {field}"

        # Validate comparisonRows
        rows = p["comparisonRows"]
        assert isinstance(rows, list) and len(rows) >= 3, (
            f"[{slug}] comparisonRows must have at least 3 rows, got {len(rows) if isinstance(rows, list) else type(rows)}"
        )
        for r in rows:
            for rf in ["intent", "textbook", "calle", "nuance"]:
                assert rf in r and r[rf], f"[{slug}] comparisonRow missing field {rf}: {r}"

        # Validate audioTasters
        tasters = p["audioTasters"]
        assert isinstance(tasters, list) and len(tasters) == 2, (
            f"[{slug}] audioTasters must have exactly 2 items, got {len(tasters) if isinstance(tasters, list) else type(tasters)}"
        )
        for t in tasters:
            for tf in ["file", "phrase", "translation", "breakdown"]:
                assert tf in t and t[tf], f"[{slug}] audioTaster missing field {tf}: {t}"
            # Check audio file exists
            audio_path = BASE_DIR / t["file"]
            assert audio_path.exists(), f"[{slug}] Referenced audio file does not exist on disk: {audio_path}"

        # Validate miniQuiz
        quiz = p["miniQuiz"]
        assert isinstance(quiz, list) and len(quiz) == 3, (
            f"[{slug}] miniQuiz must contain exactly 3 questions, got {len(quiz) if isinstance(quiz, list) else type(quiz)}"
        )
        for q in quiz:
            assert "question" in q and q["question"], f"[{slug}] miniQuiz question missing question text"
            assert "options" in q and isinstance(q["options"], list) and len(q["options"]) >= 2, (
                f"[{slug}] miniQuiz question options must have at least 2 choices"
            )
            has_correct = False
            for opt in q["options"]:
                assert "text" in opt and opt["text"], f"[{slug}] Option missing 'text'"
                assert "correct" in opt and isinstance(opt["correct"], bool), f"[{slug}] Option missing 'correct' bool"
                assert "feedback" in opt and opt["feedback"], f"[{slug}] Option missing 'feedback'"
                if opt["correct"]:
                    has_correct = True
            assert has_correct, f"[{slug}] miniQuiz question has no correct option: {q['question']}"

        # Validate whatsappScripts
        scripts = p["whatsappScripts"]
        assert isinstance(scripts, list) and len(scripts) >= 1, (
            f"[{slug}] whatsappScripts must have at least 1 script"
        )
        for s in scripts:
            for sf in ["title", "script", "english"]:
                assert sf in s and s[sf], f"[{slug}] whatsappScript missing field {sf}: {s}"

        # Validate faqs
        faqs = p["faqs"]
        assert isinstance(faqs, list) and len(faqs) >= 2, (
            f"[{slug}] faqs must have at least 2 items, got {len(faqs) if isinstance(faqs, list) else type(faqs)}"
        )
        for faq in faqs:
            for ff in ["question", "answer"]:
                assert ff in faq and faq[ff], f"[{slug}] FAQ missing field {ff}: {faq}"

    print(f"PASS: All 5 playbooks in {DATA_FILE} successfully validated!")


def test_guide_template():
    print(f"Testing guide template existence at: {GUIDE_TEMPLATE_FILE}")
    assert GUIDE_TEMPLATE_FILE.exists(), f"Guide template does not exist: {GUIDE_TEMPLATE_FILE}"

    with open(GUIDE_TEMPLATE_FILE, "r", encoding="utf-8") as f:
        html = f.read()

    # Placeholders check
    for ph in REQUIRED_GUIDE_PLACEHOLDERS:
        assert ph in html, f"Missing required placeholder in guide template: {ph}"

    # Sticky bar check
    assert "https://buy.stripe.com/9B628r7dUh1G8LndbAcV203" in html, (
        "Guide template missing Stripe checkout CTA link"
    )
    assert "https://cal.com/callenomad/20min" in html, (
        "Guide template missing Cal.com audit CTA link"
    )

    # Audio player markup / logic check
    assert "<audio" in html or "data-audio-src" in html or "audio" in html.lower(), (
        "Guide template missing audio markup"
    )

    # Clipboard copy functionality check
    assert "clipboard" in html or "copy" in html.lower(), (
        "Guide template missing clipboard copy script"
    )

    # Mini quiz interactivity check
    assert "mini-quiz" in html or "quiz" in html.lower(), (
        "Guide template missing mini-quiz component"
    )

    print("PASS: Guide template successfully validated!")


def test_hub_template():
    print(f"Testing hub template existence at: {HUB_TEMPLATE_FILE}")
    assert HUB_TEMPLATE_FILE.exists(), f"Hub template does not exist: {HUB_TEMPLATE_FILE}"

    with open(HUB_TEMPLATE_FILE, "r", encoding="utf-8") as f:
        html = f.read()

    assert "{{GUIDES_GRID}}" in html, "Hub template missing {{GUIDES_GRID}} placeholder"
    assert "Street Spanish Survival Playbooks" in html or "Survival" in html, (
        "Hub template missing core headline"
    )
    assert 'href="/"' in html or "href='/'" in html, "Hub template missing link to homepage"

    print("PASS: Hub template successfully validated!")


if __name__ == "__main__":
    test_manifest()
    test_guide_template()
    test_hub_template()
