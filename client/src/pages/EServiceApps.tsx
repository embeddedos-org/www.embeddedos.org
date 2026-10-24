import type { CSSProperties } from "react";
import { Link } from "wouter";
import { BpPage, PageHero, Section, Stats } from "@/components/bp";
import "./EServiceApps.css";

const apps = [
  {
    name: "eHealth365 Mobile",
    platform: "iOS + Android",
    desc: "Companion app for all eHealth365 devices. Real-time biometric dashboard, historical trends, AI health insights, and device configuration.",
    color: "#34D399",
    features: [
      "Live biometric streaming via BLE",
      "30-day trend analysis with AI insights",
      "Medication reminders and health goals",
      "HIPAA-compliant data export",
    ],
  },
  {
    name: "EoSim Mobile",
    platform: "iOS + Android",
    desc: "Run EoSim simulations from your phone. Monitor GPIO state, UART output, and simulation statistics in real time.",
    color: "#22D3EE",
    features: [
      "Connect to EoSim over LAN or USB",
      "Real-time GPIO pin state visualization",
      "UART terminal with syntax highlighting",
      "Push notifications for simulation events",
    ],
  },
  {
    name: "eRadar360 Monitor",
    platform: "iOS + Android",
    desc: "Real-time radar data visualization for eRadar360 / Aegis One. Object tracking, threat classification, and alert management.",
    color: "#F97316",
    features: [
      "Live radar sweep visualization",
      "Object tracking with classification labels",
      "Configurable alert zones and thresholds",
      "Historical track replay",
    ],
  },
  {
    name: "eOffice Mobile",
    platform: "iOS + Android",
    desc: "Full eOffice Suite on mobile. Edit eWriter documents, view eSheet spreadsheets, and present ePresent slideshows from your phone.",
    color: "#A855F7",
    features: [
      "Full document editing (eWriter, eSheet)",
      "Offline mode with sync on reconnect",
      "Collaborative editing with real-time cursors",
      "File sharing via eFiles integration",
    ],
  },
  {
    name: "EoS Device Manager",
    platform: "iOS + Android",
    desc: "Manage all your EoS devices from one app. Monitor device health, trigger OTA updates, view logs, and configure network settings.",
    color: "#FBBF24",
    features: [
      "Device discovery via mDNS/BLE",
      "OTA update management with rollback",
      "Real-time device logs and metrics",
      "Remote shell via EIPC tunnel",
    ],
  },
  {
    name: "eBot Agent",
    platform: "iOS + Android",
    desc: "Chat with your embedded devices using natural language. eBot translates natural language commands into EIPC service calls.",
    color: "#F472B6",
    features: [
      "Natural language device control",
      "Multi-device conversation context",
      "Tool calling for sensor reads and actuator control",
      "Voice input via eNI microphone",
    ],
  },
];

export default function EServiceAppsPage() {
  return (
    <BpPage className="esa">
      <PageHero
        sig
        label="ESERVICEAPPS"
        title="eServiceApps"
        sub="Flutter Mobile Companion Apps"
        lead="Native iOS and Android companion apps for every EmbeddedOS product. Built with Flutter for pixel-perfect cross-platform UI. Connect to your EoS devices over BLE, Wi-Fi, or USB."
      />

      <div className="wrap esa-stats">
        <Stats
          small
          items={[
            { value: "6", label: "Apps" },
            { value: "Flutter", label: "Framework" },
            { value: "iOS + Android", label: "Platforms" },
            { value: "Free", label: "Open Source" },
          ]}
        />
      </div>

      <Section className="esa-apps">
        <ul className="cards two">
          {apps.map(app => (
            <li key={app.name}>
              <div
                className="card"
                style={{ "--c": app.color } as CSSProperties}
              >
                <div className="top">
                  <h2>{app.name}</h2>
                  <span className="st">{app.platform}</span>
                </div>
                <p>{app.desc}</p>
                <ul>
                  {app.features.map(f => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section tight>
        <div className="ctas">
          <Link href="/eapps" className="btn pri">
            All eApps{" "}
            <span className="ar" aria-hidden="true">
              →
            </span>
          </Link>
          <Link href="/eoffice" className="btn gh">
            eOffice Suite
          </Link>
          <Link href="/product-eserviceapps" className="btn gh">
            eServiceApps engineering detail
          </Link>
        </div>
      </Section>
    </BpPage>
  );
}
