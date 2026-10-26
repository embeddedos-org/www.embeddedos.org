import{j as e,r as d}from"./vendor-react-aOLDZyDv.js";import{i as l,j as h,k as y}from"./index-b9RpI-8S.js";/* empty css              */import"./vendor-motion-D0ROkIIu.js";const r=[{title:"1. Information We Collect",content:`We collect minimal information necessary to operate this website. This includes:

• **Usage Data:** This site loads the Google Ads tag (gtag.js) for conversion measurement — it records that a page was viewed so the Foundation can measure its Google Ads. Our hosting provider may also retain standard web-server logs, such as request time, requested path, referrer, IP address, and user agent, for security and reliability.
• **Contact Information:** If you contact us through the form at www.embeddedos.org/contact, we retain your email address and message content solely to respond to your inquiry.
• **Meeting Bookings:** When you use the Google Calendar appointment schedule on /book or follow its booking link, what you type into the booking form, such as your name, email address and the topic you mention, goes to Google and to the Foundation's calendar. This website does not receive or store your booking.
• **Donation Data:** The donation flow offers three options: a Zeffy-hosted donation form, card payment via Stripe, and PayPal. Information you enter goes directly to the chosen processor (Zeffy, Stripe, or PayPal) and any payment or anti-abuse providers identified there; it is not first collected by this website. The Foundation may receive the donor contact details and transaction records the processor makes available to us. We do not receive or store full card or bank credentials on our servers.
• **GitHub:** If you interact with our GitHub repositories, GitHub's privacy policy applies to that data.`},{title:"2. How We Use Information",content:`We use collected information solely for:

• Operating and improving the EmbeddedOS website and documentation.
• Responding to support and contact inquiries.
• Scheduling meetings and following up on the topic you mention.
• Sending project update emails if you have explicitly opted in.
• Complying with legal obligations as a 501(c)(3).

We do not sell, rent, or share your personal information with third parties for marketing purposes.`},{title:"3. Cookies",content:`This website does not set any cookies of its own — there are no session, advertising, analytics, or cross-site tracking cookies from embeddedos.org.

What the site does store, in your browser's local storage (not cookies), is limited to two functional preferences: your theme choice (light/dark) and whether you have dismissed the donate dialog. Both stay on your device, are never transmitted to us, and clearing your browser storage simply resets them.

Two Google services are involved in loading every page of this site, and a third on /book. Google Fonts (fonts.gstatic.com) serves the typefaces used across the pages and may set a cache cookie per Google's own privacy policy. The Google Ads tag (googletagmanager.com) measures page views and ad conversions for the Foundation's Google Ads account; Google's handling of that data is governed by Google's Privacy Policy. This site sets no cookies of its own. The third, the Google Calendar booking calendar on /book, is described with its cookies and storage under Third-Party Services below.

You can disable cookies in your browser settings. Doing so will not prevent you from accessing any content on this website.`},{title:"4. Third-Party Services",content:`This website integrates with the following third-party services:

• **Zeffy** (hosted donation form and payment facilitation) — governed by Zeffy's Privacy Policy at zeffy.com/privacy-policy. Zeffy may identify additional payment and anti-abuse providers within its form.
• **Stripe** (card payment processing) — governed by Stripe's Privacy Policy at stripe.com/privacy. Card details you enter go directly to Stripe; this website never sees them.
• **PayPal** (PayPal checkout) — governed by PayPal's Privacy Policy at paypal.com/us/legalhub/privacy-full. Gifts are completed on paypal.com under PayPal's terms.
• **Google Calendar** (meeting scheduling, Google LLC) — governed by Google's Privacy Policy at policies.google.com/privacy. The appointment calendar loads from Google only on /book. When it loads, your browser connects to Google, which may process device and usage information and use cookies or local storage. What you type into the booking form goes to Google and to the Foundation's calendar. You can use our contact form to arrange a meeting without loading the calendar.
• **GitHub** (source code hosting) — governed by GitHub's Privacy Policy at docs.github.com/en/site-policy/privacy-policies
• **InterServer** (web hosting) — governed by InterServer's Privacy Policy at interserver.net/privacy-policy
• **Google Ads** (conversion measurement, tag AW-18484485270) — governed by Google's Privacy Policy at policies.google.com/privacy. The tag records page views; ad-click attribution is handled by Google.

We have no control over the data practices of these third parties.`},{title:"5. Data Retention",content:"We retain contact inquiry emails for up to 12 months. Hosting logs are retained according to InterServer's operational policies. Retention of donation records depends on the practices of the payment processor used (Zeffy, Stripe, or PayPal) and the Foundation's applicable accounting and legal obligations."},{title:"6. Your Rights",content:`You have the right to:

• Request access to personal data we hold about you.
• Request correction or deletion of your personal data.
• Withdraw consent for any data processing based on consent.
• Lodge a complaint with your local data protection authority.

To exercise these rights, contact us through the form at www.embeddedos.org/contact.`},{title:"7. Children's Privacy",content:"This website is not directed at children under 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us immediately through the form at www.embeddedos.org/contact."},{title:"8. Changes to This Policy",content:"We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date. Continued use of the website after changes constitutes acceptance of the updated policy."},{title:"9. Contact",content:`For privacy-related questions or requests, contact the Embedded Operating Systems Research Foundation at:

**Contact form:** www.embeddedos.org/contact
**Website:** www.embeddedos.org
**GitHub:** github.com/embeddedos-org`}];function c(t){return t.split("**").map((o,i)=>i%2===1?e.jsx("strong",{children:o},i):o)}function g({text:t}){return e.jsx("div",{className:"prose",children:t.split(`

`).map((o,i)=>{const n=o.split(`
`);return n.every(a=>a.startsWith("• "))?e.jsx("ul",{children:n.map((a,s)=>e.jsx("li",{children:c(a.slice(2))},s))},i):e.jsx("p",{children:n.map((a,s)=>e.jsxs(d.Fragment,{children:[s>0&&e.jsx("br",{}),c(a)]},s))},i)})})}function v(){return e.jsxs(l,{className:"legal privacy",children:[e.jsx(h,{sig:!0,label:"Legal",title:"Privacy Policy",children:e.jsx("p",{className:"lg-meta",children:"Effective date: October 24, 2026 · Embedded Operating Systems Research Foundation"})}),e.jsx(y,{name:"Privacy Policy",items:r.map((t,o)=>({id:`s${o+1}`,label:t.title.replace(/^\d+\.\s*/,"")}))}),e.jsx("div",{className:"sec lg-body",children:e.jsx("div",{className:"wrap",children:e.jsxs("div",{className:"lg-doc",children:[e.jsx("div",{className:"lg-intro",children:e.jsxs("p",{children:['The Embedded Operating Systems Research Foundation ("Foundation", "we", "us", or "our") operates the website at'," ",e.jsx("strong",{children:"www.embeddedos.org"}),". This Privacy Policy explains how we collect, use, and protect information when you use our website, documentation, and services. As a 501(c)(3), we are committed to transparency and minimal data collection."]})}),r.map((t,o)=>e.jsxs("section",{id:`s${o+1}`,className:"lg-sec","aria-labelledby":`s${o+1}-h`,children:[e.jsx("h2",{id:`s${o+1}-h`,children:t.title}),e.jsx(g,{text:t.content})]},t.title))]})})})]})}export{v as default};
