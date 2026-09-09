import{j as e}from"./vendor-motion-mgp-wB1q.js";import{P as a}from"./ProductDetailPage-e1wZir49.js";import"./vendor-react-DdUyh3Gc.js";import"./index-BmWJZxd4.js";import"./code-xml-D1vFLGuh.js";function r(){return e.jsx(a,{badge:"App Ecosystem",title:"eApps — Embedded Application Ecosystem",subtitle:"60+ First-Party Apps · Package Manager · App Store",description:"The EoS first-party application ecosystem. 60+ apps spanning productivity, developer tools, system utilities, health, and entertainment — all built for embedded hardware, distributed via the eApps package manager, and installable on any EoS device.",accent:"#F97316",gradient:"from-orange-500/20 to-amber-600/20",lang:"C++ / eUI",github:"embeddedos-org/eapps",heroImage:"/media/product-eapps_89b01d4a.jpg",stackHighlight:"app layer",stats:[{value:"60+",label:"First-Party Apps"},{value:"eApps",label:"Package Manager"},{value:"MIT",label:"All Apps Open Source"},{value:"< 1 MB",label:"Typical App Size"}],workflow:[{step:1,title:"Browse and Install Apps",desc:"Use the eApps CLI or the EoStudio App Browser to search, install, and update apps. All apps are signed with Ed25519 and verified by eBoot before installation.",code:`# Search for apps
eapps search weather

# Install an app
eapps install eweather

# List installed apps
eapps list

# Update all apps
eapps update --all`},{step:2,title:"Launch Apps via EIPC",desc:"Apps are launched by sending EIPC messages to the EoS platform launcher. This enables one app to open another — for example, eMail opening an attachment in eWrite.",code:`// Launch eWeather from your app
eipc_msg_t msg = {
    .service = "eos.launcher",
    .action  = "launch",
    .payload = {"app": "eweather", "args": {"city": "San Francisco"}}
};
eipc_send(launcher_port, &msg, sizeof(msg));`},{step:3,title:"Publish Your Own App",desc:"Build your app with eBuild, sign it, and submit it to the eApps registry. The registry runs automated security scanning and compatibility testing before publishing.",code:`# Build and package your app
ebuild build --target eapp

# Sign the package
ebuild sign --key my_app_key.pem build/myapp.eapp

# Submit to eApps registry
eapps publish build/myapp.eapp --registry apps.embeddedos.org`}],usageExamples:[{title:"Smart Home Hub",scenario:"A Raspberry Pi 4 running EoS as a smart home hub with eWeather, eHome, and eEnergy apps.",code:`// Smart home hub app bundle
// manifest.yml
packages:
  - eweather: 1.2.0    // Weather display
  - ehome: 2.0.0       // Smart home control
  - eenergy: 1.0.0     // Energy monitoring
  - eoffice-suite: 1.0.0  // Productivity

// eHome controls lights via EIPC → eIPC → Zigbee bridge
eipc_msg_t cmd = {
    .service = "ehome.lights",
    .action  = "set",
    .payload = {"room": "living_room", "brightness": 80}
};
eipc_send(ehome_port, &cmd, sizeof(cmd));`}],ecosystemRole:{importance:"medium",role:"Application Ecosystem",summary:"eApps is the application ecosystem that makes EoS a complete platform rather than just a kernel. The 60+ first-party apps demonstrate what EoS can do in practice — from weather displays to smart home control to developer tools. The package manager and app store infrastructure make it easy for third-party developers to build and distribute EoS apps, growing the ecosystem beyond what the EmbeddedOS Foundation can build alone. eApps is what turns an EoS device from a development board into a product.",dependsOn:["EoS Kernel — all apps run as EoS processes","eBoot — app packages are signed and verified before installation","EIPC — inter-app communication and platform service access","eDB — app data storage","eOffice Suite — many apps integrate with eOffice"],enabledBy:["End users — the primary way users extend their EoS devices","Third-party developers — publish apps to the eApps registry","Smart home, industrial, and consumer EoS devices"]},features:[{name:"60+ First-Party Apps",desc:"Productivity, developer tools, system utilities, health, entertainment, and IoT apps."},{name:"Package Manager",desc:"CLI and GUI package manager with dependency resolution, version pinning, and rollback."},{name:"Signed Packages",desc:"All packages are Ed25519 signed. eBoot verifies signatures before installation."},{name:"App Store",desc:"Web-based app store at apps.embeddedos.org with search, ratings, and reviews."},{name:"EIPC Integration",desc:"Apps communicate via EIPC — launch, share data, and integrate with system services."},{name:"< 1 MB Typical Size",desc:"Apps are optimized for embedded storage — most apps fit in under 1 MB."},{name:"Auto-Update",desc:"Background app updates with A/B slot mechanism — no downtime."},{name:"Sandboxing",desc:"Each app runs in an EoS process with capability-limited access to system resources."}],specs:[{key:"First-Party Apps",value:"60+ across productivity, developer tools, utilities, health, entertainment"},{key:"Package Format",value:".eapp (signed ZIP with manifest, binary, and assets)"},{key:"Signature Algorithm",value:"Ed25519"},{key:"Package Manager",value:"eApps CLI + EoStudio App Browser"},{key:"Registry",value:"apps.embeddedos.org (public, open submission)"},{key:"Typical App Size",value:"< 1 MB (binary + assets)"},{key:"License",value:"MIT (all first-party apps)"}],pairs:[{name:"eOffice Suite",route:"/product-eoffice",desc:"The flagship eApps bundle — 11 productivity apps for embedded devices."},{name:"eBuild",route:"/product-ebuild",desc:"Build and package EoS apps with eBuild's eapp target."},{name:"EIPC",route:"/product-eipc",desc:"All eApps communicate with each other and system services via EIPC."}]})}export{r as default};
