import unittest

class Testwww.embeddedos.orgUnit(unittest.TestCase):
    def test_web_routing_table(self):
        # Simulate web server routing table
        routes = {"/": "index.html", "/docs": "docs.html", "/api": "api.html"}
        assert routes["/docs"] == "docs.html"
