/**
 * Long-form "about" content for the content-category index pages.
 *
 * The fourteen categories below have no published items yet (see the
 * compliance audit, F-01: placeholder pages with no substantial content).
 * Their index pages say "Nothing published yet" and carry an `emptyNote`;
 * the sections here give each page the substantial, truthful content it
 * needs to be worth a reader`s time before the first item exists: what the
 * category is for, what will appear, and how to take part.
 *
 * Every word below is either a statement of present fact (verifiable in the
 * repo or on the site) or a stated plan for a not-yet-started programme.
 * Nothing here invents press releases, events, videos, episodes,
 * partnerships, statistics, or quotes.
 */
import type { AboutSection } from "@/data/about-section";
import { CONTACT_EMAILS } from "@/data/foundation";

export const CATEGORY_ABOUT: Record<string, ReadonlyArray<AboutSection>> = {
  "/press-releases": [
    {
      heading: "What this page is for",
      body: [
        "The Embedded Operating Systems Research Foundation publishes formal press releases here. So far we have not issued one, and the count above is honest about that. Announcements to date have gone through the News page, which is where we put timely updates about the Foundation's work.",
        "This page will change the first time we have something that warrants the formal treatment: a statement we stand behind as an organisation, written for people who were not already following us. Until then there is nothing to pad, and we will not pad it.",
      ],
    },
    {
      heading: "When a release gets issued",
      body: [
        "We will issue a press release for a small number of defined occasions: a significant software release from the Foundation's projects, a governance milestone such as a change in leadership or bylaws, a published research result, or a partnership that has been signed and can be described in concrete terms.",
        "We will not issue releases for routine development work, contributor activity, or intentions that are not yet real. If a journalist is unsure whether something they saw in News or on our socials qualifies as a formal statement from the Foundation, it does not. The press releases on this page are the complete record of what does.",
      ],
    },
    {
      heading: "What each release contains",
      body: [
        "A Foundation press release states facts: what happened, when, what it changes, and what it does not change. It will name the people and projects involved, quote the person responsible where a quote adds something a fact cannot, and link to the underlying evidence — a repository, a report, a filing — so nothing has to be taken on trust.",
        "Releases are reviewed by the Foundation's leadership before publication. We will correct errors openly: if a fact in a release turns out to be wrong, we will update the release and note the correction rather than quietly editing it.",
      ],
    },
    {
      heading: "Who releases are written for",
      body: [
        "Releases are written for working journalists, analysts, and anyone else who needs an attributable, checkable statement from the Foundation. That means plain language, full context, and no reliance on having followed our work for years.",
        `If you are a reporter on deadline, do not wait for a release. The fastest route to us is the press inbox: ${CONTACT_EMAILS.press}. We monitor it and will confirm facts, arrange interviews with the right person, and tell you plainly what we do not know yet.`,
      ],
    },
    {
      heading: "The press list and the press kit",
      body: [
        `We keep a press list: journalists and outlets who want to receive each release when it is published. To be added, write to ${CONTACT_EMAILS.press} from your work address with your name and outlet, and we will confirm. We will use the list only for press releases and corrections, never for marketing.`,
        "A media and press-kit page will live on this site alongside this one, with the Foundation's logo files, boilerplate description, and leadership bios. Until the first release is issued, the boilerplate on the contact page and the facts on the transparency page are the authoritative reference.",
      ],
    },
    {
      heading: "Embargoes and background",
      body: [
        `Where timing matters — a release coordinated with a published report, for example — we will share material under embargo through ${CONTACT_EMAILS.press}. An embargo from us means one thing: do not publish before the stated time. We will not ask for quote approval as a condition of access, and we will not withdraw access because a story was critical, provided it was accurate.`,
        "We will also talk on background when the subject genuinely requires it, and we will say so explicitly when we do. The default, however, is on the record: a nonprofit research foundation has little reason to hide its reasoning.",
      ],
    },
  ],
  "/newsletter": [
    {
      heading: "What the newsletter is",
      body: [
        "The Foundation will publish a newsletter: a periodic email rounding up what has actually shipped, what is being discussed, and where help is needed across our projects. No issue has been sent yet, so the archive above is empty for now. That is the honest state of things.",
        "The newsletter is for people who want to stay in touch without watching every repository. If you read an issue and find nothing relevant to you, that is a sign we did it right — it means we included only what was worth your time.",
      ],
    },
    {
      heading: "What each issue will carry",
      body: [
        "Each issue will cover three things. First, shipped work: what was released or merged since the last issue, in concrete terms. Second, design discussions: open questions in our projects where outside input would genuinely help, with links to the discussions themselves. Third, calls for help: the tasks, reviews, and testing that are currently blocking progress.",
        "What it will not carry: fundraising appeals, announcements of plans with no substance behind them, and rehashes of the News page. If there is not enough real material to justify an issue, we will skip it rather than fill it.",
      ],
    },
    {
      heading: "How often it goes out",
      body: [
        "The newsletter will go out periodically, not on a fixed schedule. The Foundation is volunteer-run, and we would rather send six substantive issues a year than twelve thin ones. You will not receive filler to meet a quota.",
        "When an issue is ready, it will be published to the archive on this site at the same time it is emailed. The email and the archive will always match — there is no subscriber-only content.",
      ],
    },
    {
      heading: "How to get notified",
      body: [
        `To be notified of new issues, use our contact page and mention the newsletter. We will add you to the mailing list and confirm. You can leave the list at any time by replying to any issue or writing to ${CONTACT_EMAILS.contact}.`,
        "We hold the list only for sending the newsletter and administrative notices about it, such as a change of address. We do not share it, rent it, or use it for anything else. There are no ads in the newsletter and nothing in it is sponsored.",
      ],
    },
    {
      heading: "Why the archive stays public",
      body: [
        "Every issue will be readable on this site without subscribing. The Foundation's work is public by design — our software is MIT licensed and our governance is open — and it would be strange for our own summary of that work to sit behind a signup form.",
        "The public archive also keeps us honest. Anyone can check whether an old issue's claims held up, whether a call for help was answered, and whether our cadence matched our intentions. We consider that scrutiny useful.",
      ],
    },
    {
      heading: "How it differs from News and the Blog",
      body: [
        "The News page carries timely announcements: one item at a time, as things happen. The Blog carries longer pieces: explanations, reflections, and technical writing. The newsletter is the digest: a curated summary for readers who check in occasionally rather than daily.",
        "If you follow the repositories or the News page closely, the newsletter will mostly confirm what you already know. It exists for everyone else.",
        "Readers who want depth should go to the Blog, and readers who want immediacy should go to News. The newsletter is for the third group: people who care about the project but have an inbox-shaped amount of attention for it.",
      ],
    },
  ],
  "/case-studies": [
    {
      heading: "What a case study is here",
      body: [
        "A case study on this page describes a real deployment of the Foundation's software: where it runs, what it does, and what changed because of it, measured in numbers the subject stands behind. None have been published yet. We would rather have an empty page than a page of vague success stories.",
        "The subjects of our case studies are the people who run the software in production — device makers, engineering teams, research groups — telling their own story in their own words. The Foundation's role is to check the facts, not to write the praise.",
      ],
    },
    {
      heading: "The bar, and why it is high",
      body: [
        "To qualify, a case study must describe a deployment that is real and current, and it must include measurable results: cost saved, reliability improved, development time reduced, or whatever the relevant metric is for that deployment. Qualitative claims like “it works well for us” are welcome in a testimonial, but they are not enough for a case study.",
        "The bar is high for a simple reason. A case study carries the Foundation's credibility, and credibility is the only thing a nonprofit has to spend. A single inflated claim would cost us more than a dozen honest pages would earn.",
      ],
    },
    {
      heading: "What we ask of subjects",
      body: [
        "We ask three things of anyone featured. First, verifiable numbers: figures you can defend if asked, with the methodology behind them stated in the piece. Second, permission: written agreement to publish, from someone authorised to give it. Third, review: you read the final draft before publication and confirm it is accurate.",
        "We will not pay for case studies, accept payment for them, or let a commercial relationship shape the findings. If the subject is also a donor or partner of the Foundation, the case study will say so.",
      ],
    },
    {
      heading: "The anonymisation option",
      body: [
        "Some deployments cannot be named: a product not yet announced, a system under a confidentiality agreement, a team whose employer restricts public statements. We can publish a case study with the subject anonymised, describing the deployment and the numbers without identifying the organisation.",
        "Anonymised studies go through the same verification. The Foundation will still know who the subject is and will still check the figures; only the published page withholds the name. If we cannot verify a claim, we will not publish it anonymously either.",
      ],
    },
    {
      heading: "How it differs from a product showcase",
      body: [
        "A product showcase is marketing: it selects the best angle and omits the rest. A case study, as we define it, includes the constraints — what the software did not do, what was hard, what the team would do differently. Readers evaluating our software for their own deployment need the full picture, and that includes the rough edges.",
        "We will not publish case studies written by the Foundation about other people's deployments. If we did not run it, we do not narrate it.",
      ],
    },
    {
      heading: "How to propose one",
      body: [
        `If you run our software in production and have numbers to share, we would like to hear from you. Write to ${CONTACT_EMAILS.contact} with a short description of the deployment, the metrics you can stand behind, and whether you can be named or need anonymisation.`,
        "We will reply honestly about whether the material fits and what would be needed to publish it. Not every proposal will become a case study, and we will say so early rather than drag the process out. There is no fee, no obligation, and no marketing review of your words beyond checking the facts.",
      ],
    },
  ],
  "/member-stories": [
    {
      heading: "What member stories are",
      body: [
        "Member stories are accounts from the Foundation's member organisations, in their own words: why they joined, what they work on, and what membership means to them. No stories have been published yet, because the membership programme itself is still being set up. We are not going to invent members to fill the page.",
        "When the programme opens and organisations join, their stories will appear here — written by them, checked by us for accuracy, and never rewritten into marketing copy.",
      ],
    },
    {
      heading: "The membership programme's planned shape",
      body: [
        "To be direct about where things stand: the membership programme is being designed now. The structure, tiers, and dues are not final, and we will publish them in full — including exactly what members get and what they do not — before asking any organisation to join.",
        "What we can say already: membership will be open to organisations of any size, from two-person startups to large institutions, and the terms will be the same public terms for everyone. There will be no private arrangements and no unpublished benefits.",
      ],
    },
    {
      heading: "What membership means — and does not",
      body: [
        "Membership in the Foundation is a form of recognition and support: a public statement that an organisation values open-source embedded systems research and wants to help sustain it. Members will be listed, thanked, and invited to Foundation events and briefings.",
        "What membership does not buy is technical influence. The direction of our software is decided in the open, through the public governance process in our repositories — proposals, review, and discussion that anyone can read and join. No member, whatever their dues, gets a private vote on what gets merged. We consider that separation essential, and it will be written into the programme's terms.",
      ],
    },
    {
      heading: "Why a nonprofit takes members",
      body: [
        "The Foundation is a 501(c)(3) public charity. Membership dues are one of the ways a nonprofit sustains its work alongside donations and grants, and they give organisations a formal, transparent way to support research they depend on.",
        "Dues go to the Foundation's charitable mission — research, education, and open technology for the public benefit — not to any private interest. Our finances are reported on the transparency page, and members' contributions will appear there like everything else.",
      ],
    },
    {
      heading: "How to register interest",
      body: [
        `If your organisation would like to be told when the programme opens, write to ${CONTACT_EMAILS.partners} with your organisation's name and a contact person. We will keep a list and notify everyone on it at the same time — no early access for anyone.`,
        "Registering interest commits you to nothing. It simply means you want the information when it is ready. We will not use the list for anything else, and you can ask to be removed at any time.",
      ],
    },
    {
      heading: "What the stories will cover",
      body: [
        "Once members exist, their stories will cover practical ground: what the organisation builds, which of the Foundation's projects it uses or contributes to, and why open-source embedded software matters to its work. We expect the stories to be specific rather than grand — a team's experience is more useful than a mission statement.",
        "Stories will be published as submitted, after a factual check. If a member leaves the programme, their story will be marked as historical rather than removed, so the record stays honest about who was part of the Foundation and when.",
      ],
    },
  ],
  "/datasets": [
    {
      heading: "What this page is for",
      body: [
        "This page is where the Foundation publishes the raw data behind its published measurements: the numbers that the Benchmarks page reports, in the form they were collected in, so that anyone can inspect them, re-analyse them, or argue with them. A benchmark whose data nobody can inspect is an assertion, and assertions are not research.",
        "No dataset has been published yet. When benchmark data is released, it will appear here under an open licence, with the collection method described in full. Until then, this page holds the space and explains the standard that future releases will meet.",
      ],
    },
    {
      heading: "Why datasets are published",
      body: [
        "Measurements are only as trustworthy as the method behind them, and the method is only as trustworthy as the data it produces. Publishing the raw measurements alongside the reported results closes the loop: readers can check whether the analysis was fair, whether the outliers were handled honestly, and whether the conclusions follow from the numbers.",
        "This is reproducibility in its practical form. It does not require anyone to rebuild a laboratory; it requires that the Foundation's own data be available so that its own claims can be checked. A result that cannot be checked is a claim the reader is asked to accept on trust, and the Foundation's research programme is built on the opposite principle: everything published should be checkable.",
      ],
    },
    {
      heading: "What a dataset release contains",
      body: [
        "A dataset release contains the raw measurements — the timing traces, the footprint logs, the power readings — as collected, before any summarising or smoothing. Alongside the data comes the collection method: how the measurement was set up, what was measured and what was not, the hardware configuration, the software configuration including versions, and the environmental conditions where they matter.",
        "Where analysis scripts were used to go from raw data to reported results, those scripts are included too. The point is that a reader should be able to start from the raw data and arrive at the same results — or, if they find a different answer, to show exactly where the divergence came from.",
      ],
    },
    {
      heading: "Licensing",
      body: [
        "Datasets are released under an open licence, so that anyone can download them, use them, and build on them without asking permission. The Foundation's research programme investigates problems the commercial market under-serves and publishes its findings openly rather than licensing them; the data behind the findings follows the same principle.",
        "The specific licence for each release will be stated on the dataset page itself, alongside the data. The commitment is that it will be a genuinely open licence — no registration walls, no restrictive terms, no data that is technically public but practically unusable.",
      ],
    },
    {
      heading: "The honesty standard",
      body: [
        "The standard for a dataset release is that the method is described fully enough for an independent reader to reproduce the measurement or to dispute the result. That includes describing what went wrong: failed runs, discarded measurements, conditions that turned out to matter. A dataset that only contains the clean runs is a curated story, not an honest record.",
        "This is a high standard, and it means dataset releases take time to prepare. The method write-up, the configuration documentation and the data cleaning all have to be done before publication. The empty state of this page reflects that: the first release will appear when it meets the standard, not before.",
      ],
    },
    {
      heading: "Relationship to the Benchmarks page",
      body: [
        "The Benchmarks page is where the Foundation publishes its measurement results — the numbers, the comparisons, the conclusions. This page is the evidence behind those results. Each benchmark publication will link to the dataset release that supports it, and each dataset will link back to the benchmark write-up it belongs to.",
        "Readers who are interested in the results should start at the Benchmarks page. Readers who want to check the results — or to use the data for their own analysis — should come here.",
      ],
    },
    {
      heading: "How to be notified",
      body: [
        "The first dataset release will be announced on the News page, which is the best place to watch for it. If you want to be notified directly, or if you have questions about the data programme, the contact page has the details.",
        `And if you have collected your own measurements on embedded systems — latency, footprint, power, determinism — the Foundation is interested. Independent data makes the whole field stronger, and collaboration questions can go to ${CONTACT_EMAILS.partners}.`,
      ],
    },
  ],
  "/white-papers": [
    {
      heading: "What this page is for",
      body: [
        "This page is where the Foundation will publish its white papers: long-form arguments about how embedded systems should be built, aimed at the people who make platform decisions — engineers choosing an operating system, technical leads setting architecture direction, anyone who has to live with the consequences of a foundational choice. A white paper here is an argument, developed at length, not a summary and not a brochure.",
        "None have been published yet. White papers will appear as the architecture work reaches the point where the argument is worth making in full. Until there is an argument, there is no white paper — and saying that out loud is better than filling the page with placeholders.",
      ],
    },
    {
      heading: "What a white paper is here",
      body: [
        "A white paper in the Foundation's sense is a complete case: it states a position about embedded systems design, lays out the reasoning and the evidence, addresses the reasonable objections, and concludes with something the reader can act on. It is longer and more deliberate than a blog post, and it carries the Foundation's name, which means it carries the Foundation's reputation.",
        "This is deliberately distinct from the other publication formats on the site. Technical Reports document how something was built. Publications are the peer-facing research output. Blog posts are informal and conversational. A white paper sits between the report and the publication: less formal than a peer-reviewed paper, more committed than a blog post, and written for a reader who is deciding what to build.",
      ],
    },
    {
      heading: "The bar for publishing one",
      body: [
        "The bar is simple and high: the argument must exist first. A white paper is not a way to generate interest in work that has not been done; it is the full presentation of work and thinking that have already happened. There are no marketing white papers here — no documents whose purpose is to make the platform look good rather than to say something true.",
        "This means white papers will be rare. That is intentional. A page with three white papers that each made a serious argument is worth more than a page with thirty that each said something vague. The Foundation would rather publish slowly and be worth reading than publish often and be skimmed.",
      ],
    },
    {
      heading: "Review and publication",
      body: [
        "Before publication, a white paper is reviewed by the project maintainers. The review is not a rubber stamp: it checks the argument for holes, the evidence for soundness, and the claims for overreach. A white paper that does not survive review does not get published, and one that needs to be wrong will be corrected openly rather than quietly replaced.",
        "White papers are published under the Foundation's name and, like all Foundation software and research output, are free to read and share. The source reasoning behind them — the design documents, the measured data, the code — is public in the GitHub repositories, so readers are never asked to take the argument on trust.",
      ],
    },
    {
      heading: "Relationship to Publications and the Blog",
      body: [
        "If Publications are where the Foundation speaks to researchers, and the Blog is where it thinks out loud, white papers are where it makes its case to decision-makers. The three can and will reference each other: a white paper may build on published research and be discussed informally on the blog, and a blog post that grows into a serious argument may eventually become a white paper.",
        "Readers looking for current published work should check the Publications page and the News page, which are where finished output and announcements appear.",
      ],
    },
    {
      heading: "Proposing a topic",
      body: [
        "White paper topics come from the Foundation's own research programme — they are the arguments the work itself has earned. But the maintainers are interested in the arguments the community needs made: positions on embedded systems design that you think should be argued seriously and in full, backed by evidence.",
        `If you have a topic in mind, write to ${CONTACT_EMAILS.contact} with the argument as you see it and the evidence you think supports it. A proposal does not commit anyone to anything, but the serious ones will be read carefully.`,
      ],
    },
  ],
  "/research/architecture": [
    {
      heading: "What this page is for",
      body: [
        "This page is where the Foundation publishes research on the architecture of the EmbeddedOS platform as a whole: how the kernel, the IPC layer, the storage layer, the boot sequence and the surrounding services fit together, and what each of them is allowed to assume about the others. A single subsystem can be studied in isolation, but a system is built from its boundaries, and this category is where those boundaries are examined.",
        "Nothing is filed here yet. Architecture work currently appears in the Technical Reports category and in the master design document for the platform. This page exists so that when architecture-level write-ups do appear, they have a home that is distinct from subsystem documentation and design notes.",
      ],
    },
    {
      heading: "What architecture research means here",
      body: [
        "Architecture research at the Foundation means asking questions like these: what may the boot loader assume about the kernel image it hands off to; what may the kernel assume about the behaviour of the IPC transport; what does the storage layer guarantee, and to whom, when power is lost mid-write. These are not implementation details. They are the contracts that make the whole system predictable, and they are exactly the place where reasoning about correctness has to live.",
        "A write-up in this category starts from a contract — a stated set of assumptions and guarantees — and works outward. The implementation that satisfies the contract lives in the repositories on GitHub; the write-up explains why the contract is shaped the way it is, what alternatives were considered, and what breaks if an assumption is violated.",
      ],
    },
    {
      heading: "Why it matters for safety",
      body: [
        "The Foundation's research programme covers areas like health monitoring hardware and avionics, where a failure of the platform is not an inconvenience but a hazard. In safety-critical engineering, the standard practice is to argue explicitly about why a system is safe to use. That argument depends on assumptions holding: the watchdog fires, the redundant path takes over, the corrupted state is detected. Architecture research is where those assumptions are collected, written down and examined.",
        "The blunt version of this is that assumptions are where bugs live. A subsystem can be correct against its own specification and still fail the system if two specifications disagree about what the other promises. Writing the contracts down does not remove that risk, but it turns silent disagreements into visible ones, which is the first step toward fixing them.",
      ],
    },
    {
      heading: "Relationship to Technical Reports",
      body: [
        "Technical Reports document subsystems: what a component does, how it was built, what was measured. This category covers the whole and its contracts: how the subsystems combine, what the composition assumes, and what the platform's design argues overall. If Technical Reports are the chapters, the architecture research is the document structure — the argument that the chapters belong together and what holds them up.",
        "In practice the two will reference each other. An architecture write-up will point at the Technical Reports for the subsystems it builds on, and Technical Reports will point here when a design decision only makes sense in the context of a system-level contract.",
      ],
    },
    {
      heading: "What future write-ups will look like",
      body: [
        "Architecture write-ups will state their assumptions explicitly rather than leaving them implicit. They will include diagrams of the layer structure and the data flows, design rationale that explains why the chosen contract was preferred over alternatives, and a discussion of failure modes: what happens when an assumption is violated, and how the system detects or contains the violation.",
        "Each write-up will be reviewed by the project maintainers before publication, and all of it will be published under the Foundation's name with the source material available in the GitHub repositories, so readers can check the reasoning against the actual code.",
      ],
    },
    {
      heading: "How to follow the work meanwhile",
      body: [
        "Until write-ups appear here, the best places to follow the architecture work are the Technical Reports page and the master design document, which together show how the platform's design is evolving. The implementation itself is public: the eos repository on GitHub contains the kernel, and the surrounding repositories contain the boot loader, build tooling and services.",
        `If you are working on a system-level design question and want to discuss it with the maintainers, the contact page has the details, and research collaboration questions can go to ${CONTACT_EMAILS.partners}.`,
      ],
    },
  ],
  "/research/linux": [
    {
      heading: "What this page is for",
      body: [
        "This page is where the Foundation will publish its comparative and related research on Linux, from the perspective of a real-time operating system project. That may sound like an odd thing to study: the EmbeddedOS platform is not Linux, does not claim to be Linux, and is not competing with Linux in the spaces where Linux is strong. The point of studying it is to understand exactly where those spaces begin and end.",
        "Nothing is filed here yet. Comparative work against Linux is planned but not published, and that is deliberate: publishing a comparison before the measurements exist would be the wrong order, and we are not going to do it.",
      ],
    },
    {
      heading: "Why a real-time OS project studies Linux",
      body: [
        "The embedded world is not divided into projects that use Linux and projects that do not; it is full of engineers who move between the two every day, of toolchains that speak to both, and of hardware where the device tree, the driver knowledge and the debug tooling were built around the Linux ecosystem. Understanding Linux is practical: it tells us where the Foundation can reuse existing knowledge — device trees, protocol implementations, hardware bring-up experience — and where the platform has to go its own way.",
        "Equally important is knowing where Linux is the right answer. A general-purpose operating system with virtual memory, a full network stack and a huge driver base is the correct choice for a large class of embedded products. The Foundation's position is straightforward: if your problem is served well by Linux, use Linux. Our research programme exists to investigate the problems the commercial market under-serves — determinism, auditability, behaviour under tight resource constraints — and that work is sharper when it is measured against the real alternative rather than a straw man.",
      ],
    },
    {
      heading: "What comparative work will cover",
      body: [
        "When comparative work is published here, it will cover the dimensions that matter to the platform's users: scheduling latency under load, memory footprint of the running system, and determinism of behaviour — worst-case timing, not just average. These will be measured on stated hardware, with the configuration and method described in full, so that anyone can reproduce the numbers or dispute them.",
        "What will not appear here is asserted comparison: claims about Linux that are not backed by measurements taken under the same conditions. If a claim cannot be checked, it will not be published. That rule applies in both directions — the platform's own numbers get the same treatment.",
      ],
    },
    {
      heading: "The honesty principle",
      body: [
        "The ordering matters. Measurements come first, then the comparison, then the publication. This is not caution for its own sake; it is because a comparison published without measurements is marketing, and marketing dressed up as research poisons the well for everyone. Engineers who have been burned by a vendor benchmark stop trusting all benchmarks, including the honest ones.",
        "This page will stay empty until the measurements exist. An empty page is more honest than a filled one built on assertions, and the empty state is the point: it signals that we have not done the work yet, rather than pretending we have.",
      ],
    },
    {
      heading: "Related existing work",
      body: [
        "Two nearby categories already carry related work. The Benchmarks page publishes measurement results from the platform's own test runs, with the methods described, and the Technical Reports category documents subsystem designs that future comparisons will draw on. When Linux comparison work begins, it will build on both: the benchmark harness and the published subsystem write-ups.",
        "Readers looking for the Foundation's current published research should look at the Publications and Technical Reports pages, which are where finished work appears.",
      ],
    },
    {
      heading: "Proposing a comparison topic",
      body: [
        "If you have a comparison you would like to see made — a specific latency question, a footprint question on particular hardware, a determinism claim you want tested — the Foundation is interested in hearing it. Well-posed comparison questions from people building real systems are exactly the ones worth measuring.",
        `Write to ${CONTACT_EMAILS.contact} with the question, the hardware it applies to, and why the answer matters for your use case. Not every proposal will be taken on, but every proposal will be read, and the ones that get taken on will be measured before they are published.`,
      ],
    },
  ],
  "/research/networking": [
    {
      heading: "What this page is for",
      body: [
        "This page is where the Foundation will publish research on networking for constrained devices: how embedded systems stay connected, what it costs them, and how the network stack behaves when the link is not the clean laboratory connection that most protocol testing assumes. Networking is one of the places where the gap between how a stack is specified and how it behaves in the field is widest, and that gap is worth studying.",
        "Nothing is filed here yet. The networking layer exists in the platform — it is implemented in the eNI repository on GitHub — but no research write-up has been published about it. This page holds the space for that research and describes what it will cover.",
      ],
    },
    {
      heading: "What networking research means for constrained devices",
      body: [
        "On a server or a phone, the network stack is a solved problem that the operating system hands you. On a constrained device — a sensor with kilobytes of RAM, a battery that has to last years, a radio link that drops half its packets — the stack is a research problem. Every connection kept open costs power. Every retransmission costs energy. Every byte of stack state costs memory that could have gone to the application.",
        "The questions that matter here are concrete: how does the stack behave when packets are lost; how much memory does it hold under real traffic rather than in a benchmark; what is the power cost of staying connected, and where can the protocol or the implementation be shaped to reduce it. These are not theoretical questions. They decide whether a deployed device meets its battery budget.",
      ],
    },
    {
      heading: "The implementation under study",
      body: [
        "The Foundation's networking implementation is the eNI repository on GitHub, which is part of the public EmbeddedOS platform. Like all Foundation software, it is MIT licensed, and the source is there for anyone to read, audit and build on.",
        "Research published in this category will be research about that implementation — measured, examined and written up — not research about networking in the abstract. The point of studying our own stack is that the findings can feed directly back into the code, and readers can verify every claim against the source.",
      ],
    },
    {
      heading: "What future write-ups will examine",
      body: [
        "Future write-ups will examine behaviour under loss: how the stack's reliability mechanisms respond to degraded links, and what the measured cost of that response is. They will examine the memory footprint of the stack as a function of connection count and traffic pattern, not just as a single best-case number. And they will include real-world link measurements — radio environments, lossy links, the conditions devices actually see — with the test setup described in full.",
        "Write-ups will also state their limits plainly: what was tested, what was not, and where the results should not be extrapolated. A measurement taken on one radio and one traffic pattern is a data point, not a universal truth, and the write-ups will say so.",
      ],
    },
    {
      heading: "The measurement-first principle",
      body: [
        "The same rule applies here as on the Linux research page: measurements come before publication. Networking claims are especially easy to assert and especially hard to verify — a throughput number without a described setup is an advertisement — so nothing will appear here until there are measured results with a described method behind them.",
        "That means this page stays empty while the measurement work is being set up. The empty state is not a backlog; it is the Foundation refusing to publish assertions dressed as research.",
      ],
    },
    {
      heading: "How to follow or contribute",
      body: [
        `Until research write-ups appear, the eNI repository on GitHub is the place to watch: it is where the implementation lives, and the commit history shows how it is evolving. Questions about the networking layer can go to the contact page, and if you have measurement data, test setups or field experience with constrained-device networking, the Foundation would like to hear from you — write to ${CONTACT_EMAILS.partners} about research collaboration.`,
        "All findings, designs and filings from the Foundation's research programme are published openly rather than licensed, and that applies here too: when networking research exists, it will be free to read, free to check and free to build on.",
      ],
    },
  ],
  "/product-showcases": [
    {
      heading: "What this page is for",
      body: [
        "This page exists to show products that people can actually buy and use, built on the EmbeddedOS stack. Not prototypes, not demos, not roadmaps — products that have shipped to customers and are running EmbeddedOS software in the field.",
        "Nothing is listed here yet. When a listing does appear, you should be able to trust that the product described is a real thing in real customers’ hands, not a rendering and not a promise.",
      ],
    },
    {
      heading: "What qualifies",
      body: [
        "Two conditions, both required. First, the product has shipped to real users outside the company that made it. Second, it runs EmbeddedOS software — the eos kernel, eBoot, or other stack components — in its shipping form. A development board used for evaluation does not count as a shipped product, and a prototype shown at a trade show does not count either.",
        "Submissions are reviewed by Foundation maintainers before anything is listed. A vendor supplies a description of the product and a public link where customers can find it, and the details are confirmed before publication.",
      ],
    },
    {
      heading: "Why the bar is “shipped”",
      body: [
        "A listing on a foundation website reads as an endorsement, whether or not anyone intends it that way. Visitors will reasonably assume the Foundation stands behind what appears here. A demo can be staged for a camera; a shipped product has survived customers, support tickets, and manufacturing. That is the difference the bar protects.",
        "The bar is deliberately higher than the one on the project showcases page. Projects may be experiments, and experiments are welcome — but products listed here must be facts. That asymmetry is intentional, and it is what makes a listing here mean something.",
      ],
    },
    {
      heading: "What a showcase contains",
      body: [
        "Each listing describes which parts of the stack the product uses — for example, the eos kernel together with eBoot and the IPC layer — and which board or silicon it ships on, where the vendor permits that detail. Some vendors treat their board choice as proprietary; the listing says so rather than guessing.",
        "The listing also links to the vendor’s own product page, so you can see the product in its maker’s words. The Foundation does not sell anything, takes no commission, and runs no affiliate links. The point is to document, in public, that the stack works inside products people rely on.",
      ],
    },
    {
      heading: "Submitting a showcase",
      body: [
        `If your company ships a product built on EmbeddedOS, write to ${CONTACT_EMAILS.contact} with a description of the product, the stack components it uses, and a public link where customers can find it. Maintainers will review the submission and confirm the details with you before anything is published.`,
        "There is no fee, no sponsorship tier, and no paid placement. A listing is never bought; it is earned by shipping.",
      ],
    },
    {
      heading: "How this differs from other pages",
      body: [
        "Case studies carry measured outcomes — numbers, benchmarks, before-and-after results from real deployments. Project showcases cover community and research builds, and require nothing to have shipped. This page sits between them: the requirement is commercial reality, not measured performance, and not experimentation for its own sake.",
        "If you are deciding where your work belongs, the question is simple. Has it shipped to customers? If yes, this page. If it runs on real hardware but is not a product, the project showcases page. If you measured something worth reporting, a case study. The three pages are meant to stay distinct, so each one keeps its meaning.",
      ],
    },
  ],
  "/project-showcases": [
    {
      heading: "What this page is for",
      body: [
        "This page lists projects built on the EmbeddedOS stack by the community and by researchers: hardware experiments, research builds, ports to new boards, side projects that got out of hand in the best way. The one requirement is that the thing exists and works.",
        "There is no shipping requirement here — that is what the product showcases page is for. Nothing is listed yet. This page will grow the way open-source projects grow: one person’s evening build at a time.",
      ],
    },
    {
      heading: "The bar: working on real hardware",
      body: [
        "The bar is modest but firm: the project must run on real hardware. A build that only exists in a simulator does not qualify. EoSim is a fine tool, but a showcase here has to survive contact with actual silicon, with all the clock trees, errata, and loose jumpers that entails.",
        "The reason is practical. Running on real hardware proves something a simulation cannot: that the code handles the timing, the peripherals, and the quirks of a physical device. It also means someone else can reproduce the result by buying the same board.",
      ],
    },
    {
      heading: "What to submit",
      body: [
        "Send a description of what the project does, a link to the repository, and the hardware it runs on — the board, the microcontroller or SoC, and any relevant peripherals. Photos are welcome where you have them; a short clip of the hardware doing the thing helps even more.",
        "The repository should be public and should contain enough that someone else can build and run the project: the source, build instructions, and a note about which board revision and toolchain you used. If a stranger cannot reproduce it, it is not ready for this page yet.",
      ],
    },
    {
      heading: "Review process",
      body: [
        "Before a project is listed, Foundation maintainers check that it builds and runs. This is not an audit of your architecture and not an endorsement of your design choices — it is a practical check that the project is what it claims to be.",
        "If something does not build, the maintainers will say what failed and give you a chance to fix it. Nobody is keeping score. The goal is a page full of projects that actually work, and the review exists to keep it that way.",
      ],
    },
    {
      heading: "How to submit",
      body: [
        "Use the contact page to reach the Foundation, and put “project showcase” in the subject line or first sentence. Include the description, the repository link, and the hardware details. A reply will come back with any questions and the outcome of the review.",
        "If your project changes — new board support, a new release, a rewrite — write again and the listing can be updated. Listings are meant to stay accurate, not to freeze the project in time.",
      ],
    },
    {
      heading: "Relationship to GitHub Discussions",
      body: [
        "The Foundation’s GitHub Discussions area has a show-and-tell corner where people post works in progress, ask for help, and trade ideas. That is the right place for half-finished experiments, open questions, and “has anyone tried this board?” threads.",
        "This page is the curated end of that spectrum: finished, verified projects that run on real hardware. Posting in Discussions first is encouraged — it is where you will find testers, and maintainers read it — but a listing here is the one someone else can trust to build and run for themselves.",
      ],
    },
  ],
  "/videos": [
    {
      heading: "What this page is for",
      body: [
        "This page is the index of the Foundation’s video recordings: talks, walkthroughs, and demonstrations. Each entry lists the title, the recording date, a description, and chapters where they are available, so you can find what you need without scrolling through a channel page.",
        "Nothing is indexed here yet. When recordings are published, they will appear here as well as on the channel.",
      ],
    },
    {
      heading: "What gets recorded",
      body: [
        "Recordings cover three kinds of material. Talks, from project meetups and gatherings, explain how something works or why a design decision was made. Walkthroughs show the tooling in use: building the stack, configuring a board, using ebuild, bringing up a new target. Demonstrations show the software doing something on real hardware.",
        "Not everything gets recorded. Working sessions, planning calls, and anything where a camera would make people guarded about speaking plainly stay off the record. The recordings are meant to teach, not to surveil.",
      ],
    },
    {
      heading: "Why an index outside YouTube",
      body: [
        "Video platforms are fine places to host video, but they are poor archives. Search inside a channel is unreliable, older recordings sink out of sight, and finding a specific topic without an account — or without a recommendation algorithm doing it for you — is harder than it should be.",
        "This index exists so the recordings stay findable on the open web, without requiring a Google account. Each listing carries enough description and chapter information that you can judge whether a recording is worth your time before you open the video.",
      ],
    },
    {
      heading: "What each listing carries",
      body: [
        "Every listing carries the title, the date it was recorded, a description of what it covers, and chapters with timestamps where the recording has them. Where the recording accompanies other material — slides, source code, a technical report — the listing points to it on this site.",
        "Listings are added as recordings are published. Dates shown are recording dates, not upload dates, so the material can be placed in the right context: a walkthrough of ebuild from a year ago is a different document than one from this week.",
      ],
    },
    {
      heading: "Suggesting a topic",
      body: [
        `If there is something you would like to see explained on camera — a subsystem nobody has documented, a bring-up procedure you keep doing from memory, a demonstration of something the stack can do — write to ${CONTACT_EMAILS.contact}. A suggestion is not a promise that it will be recorded, but requests genuinely shape what gets scheduled.`,
        "Volunteer presenters are welcome. You do not need to be a maintainer or to work for anyone in particular; you need to know the topic and be willing to explain it clearly.",
      ],
    },
    {
      heading: "The channel itself",
      body: [
        "The Foundation’s channel is @EmbeddedOS_ORG on YouTube. Follow it there if you want new recordings as they appear; use this page when you want to find a specific one later.",
        "Consistent with the Foundation’s stance everywhere — no ads, no paid tiers, no paywalls — the recordings exist to be watched, not to be monetized. The content is the point; the platform is just where the files live.",
        "Subscribing on the platform is optional and free. If you would rather not use YouTube at all, this page will still tell you when something new exists — the index is the notification channel that needs no account.",
      ],
    },
  ],
  "/podcast": [
    {
      heading: "What this page is for",
      body: [
        "This is the home of the Foundation’s podcast — or will be. No episodes have been recorded yet, so this page describes what the podcast will be and how to follow it when it starts.",
        "When the first episode is published, it will be listed here, alongside the archive of everything that follows.",
      ],
    },
    {
      heading: "What the podcast will be",
      body: [
        "Conversations with engineers building embedded systems and with the people who run those systems in production: firmware engineers, hardware designers, test engineers, maintainers, and the operators who keep fleets of devices alive long after the launch party.",
        "The subject is the work itself — how decisions get made, what breaks, what lasts. Not news, not announcements, and not a marketing channel under a different name.",
        "We are also interested in the perspectives that rarely make it into conference talks: the sustaining engineer keeping a decade-old product line on patched kernels, the factory technician who knows which board revisions fail in humidity, the open-source maintainer triaging driver bugs at midnight. Their knowledge is operational and deep, and it is exactly what gets lost when only the launch stories are recorded.",
      ],
    },
    {
      heading: "Format",
      body: [
        "The intent is technical and long-form. Embedded systems reward patience: a bring-up story or a debugging session cannot be told in fifteen minutes, and the podcast will not try. Episodes will run as long as the conversation needs.",
        "Releases will be irregular at first — when there is a conversation worth recording, not on a fixed schedule. Regularity will follow quality, not the other way around.",
        "Editing will be light: ums and pauses stay where they are part of thinking, and only the genuinely unlistenable gets cut. The point is to preserve how an experienced engineer actually reasons through a problem, because that is the part a written tutorial cannot carry.",
      ],
    },
    {
      heading: "Why open RSS",
      body: [
        "The podcast will publish to an open RSS feed, and will be listed in the usual podcast directories as well. RSS matters because it needs no account: anyone with any podcast app can subscribe, download episodes, and keep them.",
        "That is the same stance as everything else the Foundation publishes — no paywall, no account wall, no platform lock-in. The feed is the canonical home of the podcast; the directories are conveniences on top of it.",
      ],
    },
    {
      heading: "Proposing a guest or topic",
      body: [
        `If you know an engineer with a story worth an hour, or you are that engineer, write to ${CONTACT_EMAILS.contact} with the name, what they built or operate, and why the conversation would be interesting. Topics can be proposed the same way.`,
        "The bar for a guest is simple: firsthand experience with embedded systems, and a willingness to talk about the parts that did not go to plan. The most useful episodes will be the ones where something broke and the guest explains exactly how.",
      ],
    },
    {
      heading: "Where it will be listed",
      body: [
        "Once live, episodes will be listed on this page with the feed address published prominently. The Foundation will also announce new episodes through the News page and the newsletter, so you can follow whichever way suits you.",
        "The feed will carry the full archive from day one. Nothing expires, nothing rotates out, and older episodes stay downloadable — an episode about a debugging session from two years ago is still useful to the person hitting the same bug today.",
      ],
    },
  ],
  "/webinars": [
    {
      heading: "What this page is for",
      body: [
        "Webinars are the Foundation’s live technical sessions: real-time walkthroughs and discussions, open to anyone. None are scheduled yet, so this page describes how they will work.",
        "After each session, the recording and any materials will be posted here. The archive never sits behind a form.",
      ],
    },
    {
      heading: "What webinars will cover",
      body: [
        "Sessions cover the practical side of embedded work: board bring-up, debugging techniques, deep dives into subsystems like the scheduler, the IPC layer, or the bootloader. The emphasis is on showing the work as it happens, not on slide decks describing finished work.",
        "Topics come from what people are actually building and struggling with — the bring-up that took three weeks, the bug that only appeared at temperature, the subsystem nobody fully understands yet. The agenda is written by the work, not by a marketing calendar.",
        "Sessions are interactive by design. The presenter shows the work live and answers questions as they come, which means the audience steers as much as the agenda does. A webinar where nothing unexpected happens is a webinar where nobody asked anything — and those are the questions the archive preserves for everyone else.",
      ],
    },
    {
      heading: "No gating, ever",
      body: [
        "A live session needs a link and a time; that is the only barrier, and it is unavoidable. Everything else — the recording, the slides, the code shown on screen — is public, with no registration wall and no form asking for your email before you can watch.",
        "The archive exists for the people who could not attend, including everyone in the wrong time zone. Gating the archive would punish exactly the people a foundation should serve, so it will not happen.",
      ],
    },
    {
      heading: "Scheduling and announcements",
      body: [
        "Sessions are announced through the News page and the newsletter, with enough lead time to plan around: the date, the time with its time zone, and what the session will cover.",
        "There is no fixed cadence. Webinars happen when a presenter and a topic are ready, which is how a volunteer-run project keeps them worth attending. A quiet month means nothing was worth your time; a busy one means several things were.",
        "Each announcement names the presenter, the prerequisites if any, and where to find the recording afterwards. If a session is cancelled or rescheduled, the announcement is updated rather than deleted, so nobody follows a stale link to an empty room.",
      ],
    },
    {
      heading: "Proposing a session or presenting",
      body: [
        `To propose a topic, or to volunteer to present one, write to ${CONTACT_EMAILS.contact} with what you want to cover and what you would show. Presenters do not need to be maintainers; they need to know their subject and be willing to answer questions live.`,
        "A proposal is not a commitment to a date — scheduling works around the presenter — and a proposal that needs more preparation gets it, not a rejection. The goal is a good session, whenever it is ready.",
      ],
    },
    {
      heading: "Time-zone honesty",
      body: [
        "The Foundation is a volunteer-run project, and sessions are scheduled when presenters are available. That means live times will not always be convenient for every time zone, and this page will not pretend otherwise.",
        "The ungated archive is the answer to that: if you cannot attend live, the recording and materials are there afterwards, with no form in front of them. Live attendance is a bonus, not a requirement.",
      ],
    },
  ],
};
