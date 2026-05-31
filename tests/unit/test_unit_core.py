"""
tests/unit/test_unit_core.py — Comprehensive www.embeddedos.org website unit tests
SPDX-License-Identifier: MIT  Copyright (c) 2026 EmbeddedOS Foundation
"""
import unittest
import xml.etree.ElementTree as ET
from html.parser import HTMLParser as _HTMLParser
from pathlib import Path

SITE_ROOT = Path(__file__).parent.parent.parent


class HTMLValidator(_HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.title = ""
        self._in_title = False

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        if tag == "a" and "href" in attrs_dict:
            self.links.append(attrs_dict["href"])
        if tag == "title":
            self._in_title = True

    def handle_data(self, data):
        if self._in_title:
            self.title += data

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False


class TestWwwEmbeddedOsOrg(unittest.TestCase):
    def setUp(self):
        self.index = (SITE_ROOT / "index.html").read_text(encoding="utf-8")
        self.v = HTMLValidator()
        self.v.feed(self.index)

    def test_index_html_exists(self):
        self.assertTrue((SITE_ROOT / "index.html").exists())

    def test_index_has_title(self):
        self.assertGreater(len(self.v.title.strip()), 0)

    def test_index_has_links(self):
        self.assertGreater(len(self.v.links), 0)

    def test_index_contains_embeddedos(self):
        self.assertIn("EmbeddedOS", self.index)

    def test_no_lorem_ipsum(self):
        self.assertNotIn("Lorem ipsum", self.index)

    def test_robots_txt_exists(self):
        self.assertTrue((SITE_ROOT / "robots.txt").exists())

    def test_sitemap_xml_exists(self):
        self.assertTrue((SITE_ROOT / "sitemap.xml").exists())

    def test_404_page_exists(self):
        self.assertTrue((SITE_ROOT / "404.html").exists())

    def test_products_page_exists(self):
        self.assertTrue((SITE_ROOT / "products.html").exists())

    def test_about_page_exists(self):
        self.assertTrue((SITE_ROOT / "about.html").exists())

    def test_news_page_exists(self):
        self.assertTrue((SITE_ROOT / "news.html").exists())

    def test_sitemap_valid_xml(self):
        sitemap = (SITE_ROOT / "sitemap.xml").read_text()
        try:
            ET.fromstring(sitemap)
            valid = True
        except ET.ParseError:
            valid = False
        self.assertTrue(valid)

    def test_no_broken_internal_links(self):
        broken = []
        for link in self.v.links:
            if link.startswith("#") or link.startswith("http") or link.startswith("mailto"):
                continue
            path = link.split("?")[0].split("#")[0]
            if not path:
                continue
            full = SITE_ROOT / path.lstrip("/")
            if not full.exists():
                broken.append(link)
        self.assertEqual(broken, [], f"Broken internal links: {broken}")

    def test_css_directory_exists(self):
        self.assertTrue((SITE_ROOT / "css").exists())

    def test_js_directory_exists(self):
        self.assertTrue((SITE_ROOT / "js").exists())


if __name__ == "__main__":
    unittest.main()
