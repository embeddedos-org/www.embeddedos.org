// Shared navigation model + active-state logic.
// Imported by src/components/Nav.astro AND unit-tested in tests/unit/.

export const MENU = [
  { type: 'link', href: '/index.html', label: 'Home' },
  { type: 'group', label: 'Products', items: [
    { href: '/products.html', label: 'All products' },
    { href: '/product-eos.html', label: 'EoS (RTOS)' },
    { href: '/product-eos-platform.html', label: 'eos-platform' },
    { href: '/product-eboot.html', label: 'eBootloader' },
    { href: '/product-ebuild.html', label: 'eBuild' },
    { href: '/product-eai.html', label: 'EAI' },
    { href: '/product-eni.html', label: 'ENI' },
    { href: '/product-eipc.html', label: 'EIPC' },
    { href: '/product-eapps.html', label: 'eApps' },
    { href: '/product-eosim.html', label: 'EoSim' },
    { href: '/product-eostudio.html', label: 'EoStudio' },
    { href: '/product-edb.html', label: 'eDB' },
    { href: '/product-ebowser.html', label: 'eBowser' },
    { href: '/product-eoffice.html', label: 'eOffice' },
    { href: '/product-eserviceapps.html', label: 'eServiceApps' },
    { href: '/ecosystem.html', label: 'Ecosystem' },
    { href: '/ecosystem-map.html', label: 'Ecosystem map' },
  ]},
  { type: 'group', label: 'Research', items: [
    { href: '/research.html', label: 'Neural Link Architecture' },
    { href: '/neural-link-ai.html', label: 'Neural Link & AI' },
    { href: '/ai-os.html', label: 'AI Operating Systems' },
    { href: '/building-os.html', label: 'Building OS (Linux/RTOS)' },
    { href: '/future-research.html', label: 'Future Research' },
    { href: '/resources.html', label: 'Theses & Papers' },
  ]},
  { type: 'group', label: 'Learn', items: [
    { href: '/getting-started.html', label: 'Getting Started' },
    { href: '/documentation.html', label: 'Documentation' },
    { href: '/docs/index.html', label: 'Docs' },
    { href: '/books.html', label: 'Books' },
    { href: '/flow.html', label: 'Flow' },
    { href: '/kids.html', label: 'Kids' },
    { href: '/hardware-lab.html', label: 'Hardware Lab' },
    { href: '/stacks/index.html', label: 'Stacks' },
    { href: '/downloads/index.html', label: 'Downloads' },
    { href: '/faq.html', label: 'FAQ' },
    { href: '/roadmap.html', label: 'Roadmap' },
    { href: '/changelog.html', label: 'Changelog' },
  ]},
  { type: 'group', label: 'Community', items: [
    { href: '/get-involved.html', label: 'Get Involved' },
    { href: '/news.html', label: 'News' },
    { href: '/events.html', label: 'Events' },
    { href: '/community.html', label: 'Community' },
    { href: '/sponsors.html', label: 'Sponsors' },
    { href: '/eApps/index.html', label: 'App Store' },
    { href: '/index.html#health-devices', label: 'Health Devices' },
  ]},
  { type: 'group', label: 'Foundation', items: [
    { href: '/about.html', label: 'About' },
    { href: '/organization.html', label: 'Organization' },
    { href: '/projects.html', label: 'Projects' },
    { href: '/vision.html', label: 'Vision' },
    { href: '/membership.html', label: 'Membership' },
    { href: '/certification.html', label: 'Certification' },
    { href: '/internship.html', label: 'Internship' },
    { href: '/careers.html', label: 'Careers' },
    { href: '/contact.html', label: 'Contact' },
  ]},
];

/** Normalise a URL pathname to a canonical page key ("/" -> "/index.html"). */
export function normalizePath(pathname) {
  return (pathname === '/' || pathname === '') ? '/index.html' : pathname;
}

/** Is this link the current page? (ignores #fragments) */
export function isActive(href, cur) {
  return href.split('#')[0] === cur;
}

/** Does any child of a group match the current page? */
export function groupActive(items, cur) {
  return items.some((it) => isActive(it.href, cur));
}

/** Flat list of every internal href referenced by the menu (deduped, no #). */
export function menuTargets() {
  const out = new Set();
  for (const m of MENU) {
    if (m.type === 'link') out.add(m.href.split('#')[0]);
    else m.items.forEach((it) => out.add(it.href.split('#')[0]));
  }
  return [...out];
}
