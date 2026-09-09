import{j as e}from"./vendor-motion-mgp-wB1q.js";import{P as t}from"./ProductDetailPage-e1wZir49.js";import"./vendor-react-DdUyh3Gc.js";import"./index-BmWJZxd4.js";import"./code-xml-D1vFLGuh.js";function r(){return e.jsx(t,{badge:"Office Suite",title:"eOffice Suite — 11-App Embedded Office Suite",subtitle:"eWrite · eCalc · ePresent · eNotes · eMail · eCalendar · eCam · eFiles · eContacts · eChat · eVault",description:"A complete 11-application office suite designed to run natively on EoS devices — from a Raspberry Pi to an automotive infotainment system. All apps share a unified eDB storage backend, EIPC inter-app communication, and a consistent UI framework optimized for embedded displays.",accent:"#059669",gradient:"from-emerald-500/20 to-green-600/20",lang:"C++ / eUI",github:"embeddedos-org/eoffice",heroImage:"/media/product-eoffice_c4309cdd.jpg",stackHighlight:"app layer",stats:[{value:"11",label:"Applications"},{value:"eDB",label:"Unified Storage Backend"},{value:"< 32 MB",label:"Full Suite RAM"},{value:"EIPC",label:"Inter-App Communication"}],workflow:[{step:1,title:"Install the eOffice Suite",desc:"eOffice is distributed as an .eos application package. Install it via the eApps package manager or include it in your eBuild manifest. All 11 apps share a single eDB database for unified storage.",code:`# Install via eApps
eapps install eoffice-suite

# Or include in manifest.yml
packages:
  - eoffice-suite: 1.0.0`},{step:2,title:"Launch an App via EIPC",desc:"eOffice apps communicate with each other and with the EoS platform via EIPC. Launch eWrite from another app by sending an EIPC message to the eOffice launcher service.",code:`// Launch eWrite with a document
eipc_msg_t msg = {
    .service = "eoffice.launch",
    .action  = "open",
    .payload = {"app": "ewrite", "file": "/docs/report.edoc"}
};
eipc_send(eoffice_port, &msg, sizeof(msg));`},{step:3,title:"Read and Write Documents via eDB",desc:"All eOffice documents are stored in eDB. Access them programmatically from other EoS apps using the eDB document store API.",code:`// Read an eWrite document from eDB
edb_doc_t doc = edb_collection_find_one(db, "ewrite_docs",
                                         "title", "Q3 Report");
const char *content = edb_doc_get_str(doc, "content");

// Create a new spreadsheet in eCalc
edb_doc_t sheet = edb_doc_new();
edb_doc_set_str(sheet, "title", "Sensor Data");
edb_doc_set_str(sheet, "type",  "spreadsheet");
edb_collection_insert(db, "ecalc_sheets", sheet);`},{step:4,title:"Integrate AI Features",desc:"eOffice integrates with eAI for AI-assisted features: document summarization in eWrite, formula suggestions in eCalc, slide generation in ePresent, and voice commands in all apps.",code:`// eWrite AI summarization
eipc_msg_t req = {
    .service = "eai.summarize",
    .payload = {"text": document_content, "max_words": 100}
};
eipc_send(eai_port, &req, sizeof(req));

// Receive summary
eipc_msg_t resp;
eipc_recv(eai_port, &resp, sizeof(resp), EIPC_WAIT_FOREVER);
printf("Summary: %s\\n", resp.payload.summary);`}],usageExamples:[{title:"Automotive Infotainment",scenario:"An automotive head unit running eOffice for navigation notes, calendar integration, and hands-free voice commands.",code:`// Automotive eOffice integration
// eCalendar shows upcoming appointments on the dashboard
// eNotes stores voice-dictated driving notes
// eFiles accesses documents from the vehicle cloud

// Voice command integration via eAI
void voice_cmd_task(void *arg) {
    for (;;) {
        // Wake word detected by eAI KWS
        eos_event_wait(WAKE_EVENT, EOS_WAIT_FOREVER);

        // Transcribe command
        char cmd[256];
        eai_transcribe(mic, cmd, sizeof(cmd));

        // Route to eOffice
        eipc_send(eoffice_port, cmd, strlen(cmd));
    }
}`},{title:"Medical Device Documentation",scenario:"A clinical device using eWrite and eVault to create encrypted patient notes stored in eDB.",code:`// HIPAA-compliant patient notes
// eVault encrypts all eWrite documents with AES-256
// Keys derived from eBoot chain of trust

// Create encrypted patient note
eipc_msg_t msg = {
    .service = "eoffice.ewrite",
    .action  = "create_encrypted",
    .payload = {
        "title":   "Patient 4821 — Visit Notes",
        "content": note_content,
        "vault":   true,   // eVault encryption
        "patient_id": "4821"
    }
};
eipc_send(eoffice_port, &msg, sizeof(msg));`}],ecosystemRole:{importance:"medium",role:"User-Facing Application Layer",summary:"eOffice Suite is the user-facing application layer of the EoS ecosystem. It demonstrates that EoS is not just a kernel for sensor nodes — it is a complete platform capable of running a full productivity suite on embedded hardware. eOffice is the primary reason end users interact with EoS devices directly: automotive infotainment, medical device documentation, industrial HMI panels, and educational tablets all use eOffice. It also serves as the reference implementation for how EoS applications should be structured: EIPC for inter-app communication, eDB for storage, and eAI for intelligence.",dependsOn:["EoS Kernel — all 11 apps run as EoS processes with HAL display access","eDB — unified document, spreadsheet, and calendar storage","EIPC — inter-app communication and platform service access","eAI — AI-assisted features (summarization, voice commands, formula suggestions)","eUI framework — shared UI toolkit for consistent look and feel"],enabledBy:["End users on EoS devices — the primary user-facing application suite","Automotive infotainment — navigation notes, calendar, voice commands","Medical devices — encrypted patient documentation via eVault","Industrial HMI — operator notes, shift reports, maintenance logs","Educational tablets — document editing and presentation for students"]},features:[{name:"eWrite",desc:"Rich text editor with markdown support, tables, and AI-assisted writing. Exports to PDF and HTML."},{name:"eCalc",desc:"Spreadsheet with 200+ functions, charts, and AI formula suggestions. Compatible with CSV and XLSX."},{name:"ePresent",desc:"Slide presentation editor with AI slide generation from text prompts."},{name:"eNotes",desc:"Quick notes with voice dictation, handwriting recognition, and eDB sync."},{name:"eMail",desc:"Email client with IMAP/SMTP support, S/MIME encryption, and offline mode."},{name:"eCalendar",desc:"Calendar with CalDAV sync, reminders, and integration with eNotes and eMail."},{name:"eCam",desc:"Camera app with AI scene recognition, QR/barcode scanning, and eDB photo storage."},{name:"eVault",desc:"Encrypted file vault with AES-256 encryption rooted in the eBoot chain of trust."}],specs:[{key:"Applications",value:"11 (eWrite, eCalc, ePresent, eNotes, eMail, eCalendar, eCam, eFiles, eContacts, eChat, eVault)"},{key:"Storage Backend",value:"eDB (SQL + document + KV)"},{key:"Inter-App Communication",value:"EIPC with capability-based access control"},{key:"UI Framework",value:"eUI — embedded UI toolkit with hardware-accelerated compositing"},{key:"RAM Requirement",value:"< 32 MB for full suite (< 8 MB per app)"},{key:"Supported Displays",value:"LVDS, MIPI-DSI, HDMI, SPI TFT (320×240 to 4K)"},{key:"AI Features",value:"Summarization, voice commands, formula suggestions, slide generation via eAI"},{key:"License",value:"MIT"}],pairs:[{name:"eDB",route:"/product-edb",desc:"All eOffice documents, spreadsheets, and calendar events are stored in eDB."},{name:"eAI",route:"/product-eai",desc:"AI-assisted features: summarization, voice commands, formula suggestions."},{name:"EIPC",route:"/product-eipc",desc:"Inter-app communication and platform service access via EIPC."}]})}export{r as default};
