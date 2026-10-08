import { useEffect, useRef, type CSSProperties } from "react";
import { Link } from "wouter";
import { BOARD_COUNT, REPO_COUNT } from "@/data/stack";
import { EAI_EDGE_PROFILE } from "@/data/architecture";
import "../home3d/story.css";

type PrerenderWindow = Window & { __EOS_PRERENDER__?: boolean };

export default function Home() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = root.current;
    if (!host || (window as PrerenderWindow).__EOS_PRERENDER__) return;
    let dispose: (() => void) | undefined;
    let cancelled = false;
    void import("../home3d/story").then(({ mountStory }) => {
      if (!cancelled) dispose = mountStory(host);
    });
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);

  return (
    <div ref={root} className="hs">
      <div className="track" id="track">
        {" "}
        <div className="stage" id="stage">
          {" "}
          <div className="poster" aria-hidden="true" />{" "}
          <canvas id="gl" aria-hidden="true" />{" "}
          <div className="kinetic" id="kinetic" aria-hidden="true">
            {" "}
            <div
              className="kw"
              data-t0="0.950"
              data-t1="2.020"
              data-x0="34"
              data-x1="-36"
              data-a="0.07"
              style={
                {
                  "--c": "#EF4444",
                  "--y": "9%",
                  "--ym": "11%",
                } as CSSProperties
              }
            >
              eHealth365
            </div>{" "}
            <div
              className="ribbon"
              aria-hidden="true"
              data-t0="1.040"
              data-t1="1.970"
              data-dir="-1"
              data-speed="40"
              style={
                {
                  "--c": "#EF4444",
                  "--y": "calc(100% - 74px)",
                  "--ymb": "calc(var(--bar-h) + 34px)",
                } as CSSProperties
              }
            >
              <div className="rb-track">
                <span className="rb s-head">eHealth365</span>
                <span className="rb s-docs">Smart Patch Pro</span>
                <span className="rb s-docs">Smart Ring Pro</span>
                <span className="rb s-head">eHealth365</span>
                <span className="rb s-docs">Smart Patch Pro</span>
                <span className="rb s-docs">Smart Ring Pro</span>
                <span className="rb s-head">eHealth365</span>
                <span className="rb s-docs">Smart Patch Pro</span>
                <span className="rb s-docs">Smart Ring Pro</span>
                <span className="rb s-head">eHealth365</span>
                <span className="rb s-docs">Smart Patch Pro</span>
                <span className="rb s-docs">Smart Ring Pro</span>
                <span className="rb s-head">eHealth365</span>
                <span className="rb s-docs">Smart Patch Pro</span>
                <span className="rb s-docs">Smart Ring Pro</span>
                <span className="rb s-head">eHealth365</span>
                <span className="rb s-docs">Smart Patch Pro</span>
                <span className="rb s-docs">Smart Ring Pro</span>
                <span className="rb s-head">eHealth365</span>
                <span className="rb s-docs">Smart Patch Pro</span>
                <span className="rb s-docs">Smart Ring Pro</span>
                <span className="rb s-head">eHealth365</span>
                <span className="rb s-docs">Smart Patch Pro</span>
                <span className="rb s-docs">Smart Ring Pro</span>
                <span className="rb s-head">eHealth365</span>
                <span className="rb s-docs">Smart Patch Pro</span>
                <span className="rb s-docs">Smart Ring Pro</span>
                <span className="rb s-head">eHealth365</span>
                <span className="rb s-docs">Smart Patch Pro</span>
                <span className="rb s-docs">Smart Ring Pro</span>
                <span className="rb s-head">eHealth365</span>
                <span className="rb s-docs">Smart Patch Pro</span>
                <span className="rb s-docs">Smart Ring Pro</span>
                <span className="rb s-head">eHealth365</span>
                <span className="rb s-docs">Smart Patch Pro</span>
                <span className="rb s-docs">Smart Ring Pro</span>
              </div>
            </div>{" "}
            <div
              className="kw"
              data-t0="2.950"
              data-t1="4.020"
              data-x0="34"
              data-x1="-36"
              data-a="0.07"
              style={
                {
                  "--c": "#F472B6",
                  "--y": "9%",
                  "--ym": "11%",
                } as CSSProperties
              }
            >
              eMedical
            </div>{" "}
            <div
              className="ribbon"
              aria-hidden="true"
              data-t0="3.040"
              data-t1="3.970"
              data-dir="-1"
              data-speed="auto"
              style={
                {
                  "--c": "#F472B6",
                  "--y": "calc(100% - 74px)",
                  "--ymb": "calc(var(--bar-h) + 34px)",
                } as CSSProperties
              }
            >
              <div className="rb-track">
                <span className="rb s-head">eMedical</span>
                <span className="rb s-docs">eECG-12</span>
                <span className="rb s-docs">eEEG-32</span>
                <span className="rb s-docs">eUS-Pro</span>
                <span className="rb s-docs">ePM-500</span>
                <span className="rb s-docs">eBA-100</span>
                <span className="rb s-docs">ePCR-96</span>
                <span className="rb s-docs">eCentri-24K</span>
                <span className="rb s-docs">eSeq-Nano</span>
                <span className="rb s-docs">eSpec-UV</span>
                <span className="rb s-docs">eLab-Auto</span>
                <span className="rb s-docs">eVent-Pro</span>
                <span className="rb s-docs">eInfuse-200</span>
                <span className="rb s-docs">eO2-5L</span>
                <span className="rb s-docs">eRehab-Arm</span>
                <span className="rb s-docs">eProsth-Hand</span>
                <span className="rb s-docs">eSurgBot-7</span>
                <span className="rb s-docs">eESG-400</span>
                <span className="rb s-docs">eEndo-4K</span>
                <span className="rb s-docs">eSurgNav-3D</span>
              </div>
            </div>{" "}
            <div
              className="kw"
              data-t0="6.950"
              data-t1="8.020"
              data-x0="34"
              data-x1="-36"
              data-a="0.07"
              style={
                {
                  "--c": "#22D3EE",
                  "--y": "9%",
                  "--ym": "11%",
                } as CSSProperties
              }
            >
              eAerospace
            </div>{" "}
            <div
              className="ribbon"
              aria-hidden="true"
              data-t0="7.040"
              data-t1="7.970"
              data-dir="-1"
              data-speed="auto"
              style={
                {
                  "--c": "#22D3EE",
                  "--y": "calc(100% - 74px)",
                  "--ymb": "calc(var(--bar-h) + 34px)",
                } as CSSProperties
              }
            >
              <div className="rb-track">
                <span className="rb s-head">eAerospace</span>
                <span className="rb s-docs">eATM-3000</span>
                <span className="rb s-docs">eATM-RSU</span>
                <span className="rb s-docs">eATM-TWR</span>
                <span className="rb s-docs">eAPT-900</span>
                <span className="rb s-docs">eAPT-VDGS</span>
                <span className="rb s-docs">eAPT-APR</span>
                <span className="rb s-docs">eFC-1000</span>
                <span className="rb s-docs">eNAV-500</span>
                <span className="rb s-docs">eADC-200</span>
                <span className="rb s-docs">eFD-1080</span>
                <span className="rb s-docs">eCOM-400</span>
                <span className="rb s-docs">eXPDR-1090</span>
                <span className="rb s-docs">eCUBE-3U-OBC</span>
                <span className="rb s-docs">eCUBE-EPS</span>
                <span className="rb s-docs">eCUBE-ADCS</span>
                <span className="rb s-docs">eCUBE-3U</span>
                <span className="rb s-docs">eFCS-2000</span>
                <span className="rb s-docs">eFCS-2000M</span>
                <span className="rb s-docs">eACE-400</span>
                <span className="rb s-docs">eGNSS-400</span>
                <span className="rb s-docs">eGNSS-400T</span>
                <span className="rb s-docs">eGNSS-ANT</span>
                <span className="rb s-docs">eGS-1200</span>
                <span className="rb s-docs">eGS-RCU</span>
                <span className="rb s-docs">eGS-LNA</span>
                <span className="rb s-docs">eLV-500</span>
                <span className="rb s-docs">eLV-AFTS</span>
                <span className="rb s-docs">eLV-SEQ</span>
                <span className="rb s-docs">eINS-900</span>
                <span className="rb s-docs">eINS-900L</span>
                <span className="rb s-docs">eINS-AHRS</span>
                <span className="rb s-docs">ePCU-700</span>
                <span className="rb s-docs">ePCU-EP</span>
                <span className="rb s-docs">ePCU-RCS</span>
                <span className="rb s-docs">eRAD-100</span>
                <span className="rb s-docs">eRAD-LCL</span>
                <span className="rb s-docs">eRAD-SCRUB</span>
                <span className="rb s-docs">eSAT-8000</span>
                <span className="rb s-docs">eSAT-PCU</span>
                <span className="rb s-docs">eSAT-RIU</span>
                <span className="rb s-docs">eSat-Bus-100</span>
                <span className="rb s-docs">eCubeSat-3U</span>
                <span className="rb s-docs">eRW-0.1</span>
                <span className="rb s-docs">eST-200</span>
                <span className="rb s-docs">eSA-50</span>
                <span className="rb s-docs">eEPS-5</span>
                <span className="rb s-docs">eSWX-200</span>
                <span className="rb s-docs">eSWX-PD</span>
                <span className="rb s-docs">eSWX-MAG</span>
                <span className="rb s-docs">eTLM-600</span>
                <span className="rb s-docs">eTLM-DAU</span>
                <span className="rb s-docs">eTLM-GRX</span>
                <span className="rb s-docs">eFW-1000</span>
                <span className="rb s-docs">eMR-400</span>
                <span className="rb s-docs">eVT-5000</span>
                <span className="rb s-docs">eGCS-100</span>
                <span className="rb s-docs">eSwarm-10</span>
              </div>
            </div>{" "}
            <div
              className="kw"
              data-t0="7.950"
              data-t1="9.020"
              data-x0="34"
              data-x1="-36"
              data-a="0.07"
              style={
                {
                  "--c": "#A78BFA",
                  "--y": "9%",
                  "--ym": "11%",
                } as CSSProperties
              }
            >
              eRobotics
            </div>{" "}
            <div
              className="ribbon"
              aria-hidden="true"
              data-t0="8.040"
              data-t1="8.970"
              data-dir="1"
              data-speed="auto"
              style={
                {
                  "--c": "#A78BFA",
                  "--y": "calc(100% - 74px)",
                  "--ymb": "calc(var(--bar-h) + 34px)",
                } as CSSProperties
              }
            >
              <div className="rb-track">
                <span className="rb s-head">eRobotics</span>
                <span className="rb s-docs">eAMR-500</span>
                <span className="rb s-docs">eWarehouse-1T</span>
                <span className="rb s-docs">eDelivery-Bot</span>
                <span className="rb s-docs">eAgri-Tractor</span>
                <span className="rb s-docs">eSecurity-Patrol</span>
                <span className="rb s-docs">eArm-7</span>
                <span className="rb s-docs">eWeld-6</span>
                <span className="rb s-docs">eAssemble-4</span>
                <span className="rb s-docs">ePick-Delta</span>
                <span className="rb s-docs">eCobot-5</span>
                <span className="rb s-docs">eServo-200</span>
                <span className="rb s-docs">eActuator-50</span>
                <span className="rb s-docs">eGripper-3F</span>
                <span className="rb s-docs">eVision-4K</span>
                <span className="rb s-docs">eLiDAR-360</span>
              </div>
            </div>{" "}
            <div
              className="kw"
              data-t0="11.950"
              data-t1="13.020"
              data-x0="34"
              data-x1="-36"
              data-a="0.07"
              style={
                {
                  "--c": "#F59E0B",
                  "--y": "9%",
                  "--ym": "11%",
                } as CSSProperties
              }
            >
              eEnergy
            </div>{" "}
            <div
              className="ribbon"
              aria-hidden="true"
              data-t0="12.040"
              data-t1="12.970"
              data-dir="1"
              data-speed="auto"
              style={
                {
                  "--c": "#F59E0B",
                  "--y": "calc(100% - 74px)",
                  "--ymb": "calc(var(--bar-h) + 34px)",
                } as CSSProperties
              }
            >
              <div className="rb-track">
                <span className="rb s-head">eEnergy</span>
                <span className="rb s-docs">eBMS-100A</span>
                <span className="rb s-docs">eLiPack-10kWh</span>
                <span className="rb s-docs">eESS-100kWh</span>
                <span className="rb s-docs">ePPS-5kW</span>
                <span className="rb s-docs">eSBM-Smart</span>
                <span className="rb s-docs">eDCDC-5kW</span>
                <span className="rb s-docs">eUPS-10kVA</span>
                <span className="rb s-docs">eMotorDrive-22kW</span>
                <span className="rb s-docs">ePDU-Smart</span>
                <span className="rb s-docs">eBreaker-Smart</span>
                <span className="rb s-docs">eSolarInv-10kW</span>
                <span className="rb s-docs">eSolarTracker</span>
                <span className="rb s-docs">eWindCtrl-50kW</span>
                <span className="rb s-docs">eMicrogrid-100</span>
                <span className="rb s-docs">eSCC-60A</span>
              </div>
            </div>{" "}
            <div
              className="kw"
              data-t0="12.950"
              data-t1="14.020"
              data-x0="34"
              data-x1="-36"
              data-a="0.07"
              style={
                {
                  "--c": "#60A5FA",
                  "--y": "9%",
                  "--ym": "11%",
                } as CSSProperties
              }
            >
              eSmartCity
            </div>{" "}
            <div
              className="ribbon"
              aria-hidden="true"
              data-t0="13.040"
              data-t1="13.970"
              data-dir="-1"
              data-speed="auto"
              style={
                {
                  "--c": "#60A5FA",
                  "--y": "calc(100% - 74px)",
                  "--ymb": "calc(var(--bar-h) + 34px)",
                } as CSSProperties
              }
            >
              <div className="rb-track">
                <span className="rb s-head">eSmartCity</span>
                <span className="rb s-docs">eCS-200</span>
                <span className="rb s-docs">eDIS-600</span>
                <span className="rb s-docs">eGOV-500</span>
                <span className="rb s-docs">eEMR-800</span>
                <span className="rb s-docs">eHUM-400</span>
                <span className="rb s-docs">eKSK-900</span>
                <span className="rb s-docs">ePS-1200</span>
                <span className="rb s-docs">eRUR-700</span>
                <span className="rb s-docs">eSL-400</span>
                <span className="rb s-docs">e5G-Small</span>
                <span className="rb s-docs">eIoT-GW</span>
                <span className="rb s-docs">eRouter-Pro</span>
                <span className="rb s-docs">eNetMon</span>
                <span className="rb s-docs">ePrivNet</span>
                <span className="rb s-docs">eTrafficCtrl</span>
                <span className="rb s-docs">eParkSensor</span>
                <span className="rb s-docs">eStreetLight</span>
                <span className="rb s-docs">eEnvStation</span>
                <span className="rb s-docs">eSafety-Cam</span>
                <span className="rb s-docs">eSM-3P</span>
                <span className="rb s-docs">eWM-DN50</span>
                <span className="rb s-docs">eGM-100</span>
                <span className="rb s-docs">eLeakDetect</span>
                <span className="rb s-docs">eUtilMonitor</span>
                <span className="rb s-docs">eWM-300</span>
              </div>
            </div>{" "}
            <div
              className="kw"
              data-t0="14.950"
              data-t1="16.020"
              data-x0="34"
              data-x1="-36"
              data-a="0.07"
              style={
                {
                  "--c": "#818CF8",
                  "--y": "9%",
                  "--ym": "11%",
                } as CSSProperties
              }
            >
              eEdgeAI
            </div>{" "}
            <div
              className="ribbon"
              aria-hidden="true"
              data-t0="15.040"
              data-t1="15.970"
              data-dir="-1"
              data-speed="40"
              style={
                {
                  "--c": "#818CF8",
                  "--y": "calc(100% - 74px)",
                  "--ymb": "calc(var(--bar-h) + 34px)",
                } as CSSProperties
              }
            >
              <div className="rb-track">
                <span className="rb s-head">eEdgeAI</span>
                <span className="rb s-docs">eAI-2000</span>
                <span className="rb s-docs">eINF-4000</span>
                <span className="rb s-docs">eNPU-800</span>
                <span className="rb s-docs">eSFU-500</span>
                <span className="rb s-docs">eSLM-700</span>
                <span className="rb s-docs">eSPX-300</span>
                <span className="rb s-docs">eTML-100</span>
                <span className="rb s-docs">eVIS-600</span>
                <span className="rb s-head">eEdgeAI</span>
                <span className="rb s-docs">eAI-2000</span>
                <span className="rb s-docs">eINF-4000</span>
                <span className="rb s-docs">eNPU-800</span>
                <span className="rb s-docs">eSFU-500</span>
                <span className="rb s-docs">eSLM-700</span>
                <span className="rb s-docs">eSPX-300</span>
                <span className="rb s-docs">eTML-100</span>
                <span className="rb s-docs">eVIS-600</span>
                <span className="rb s-head">eEdgeAI</span>
                <span className="rb s-docs">eAI-2000</span>
                <span className="rb s-docs">eINF-4000</span>
                <span className="rb s-docs">eNPU-800</span>
                <span className="rb s-docs">eSFU-500</span>
                <span className="rb s-docs">eSLM-700</span>
                <span className="rb s-docs">eSPX-300</span>
                <span className="rb s-docs">eTML-100</span>
                <span className="rb s-docs">eVIS-600</span>
                <span className="rb s-head">eEdgeAI</span>
                <span className="rb s-docs">eAI-2000</span>
                <span className="rb s-docs">eINF-4000</span>
                <span className="rb s-docs">eNPU-800</span>
                <span className="rb s-docs">eSFU-500</span>
                <span className="rb s-docs">eSLM-700</span>
                <span className="rb s-docs">eSPX-300</span>
                <span className="rb s-docs">eTML-100</span>
                <span className="rb s-docs">eVIS-600</span>
              </div>
            </div>{" "}
            <div
              className="kw"
              data-t0="24.950"
              data-t1="26.000"
              data-x0="30"
              data-x1="-80"
              data-a="0.07"
              style={
                {
                  "--c": "#38BDF8",
                  "--y": "9%",
                  "--ym": "11%",
                } as CSSProperties
              }
            >
              EVERY INDUSTRY
            </div>{" "}
          </div>{" "}
          <div className="scrim" /> <div className="scrim r" />{" "}
          <div className="labels" id="labels" aria-hidden="true" />{" "}
          <svg className="leaders" id="leaders" aria-hidden="true" />{" "}
          <div className="anchors" id="anchors" aria-hidden="true" />{" "}
          <div className="hoverring" id="hoverring" aria-hidden="true" />{" "}
          <div
            className="hovercard"
            id="hovercard"
            role="status"
            aria-live="polite"
          />{" "}
          <div className="cards" id="cards">
            {" "}
            <article
              className="card hero-card"
              style={{ "--c": "#F97316" } as CSSProperties}
            >
              {" "}
              <Link className="eyebrow" href="/mission">
                Foundation · 501(c)(3) · MIT License
              </Link>{" "}
              <h1 id="hero-heading">
                Open-source embedded systems for intelligent physical devices
              </h1>{" "}
              <p className="lead">
                From open hardware and secure boot to a real-time OS, developer
                tools, and on-device AI.
              </p>{" "}
              <div className="hero-tag">
                <b>Open infrastructure for physical AI.</b>
                <span>
                  {EAI_EDGE_PROFILE.maturity}: {EAI_EDGE_PROFILE.name} ={" "}
                  {EAI_EDGE_PROFILE.sequence.join(" → ")}
                </span>
              </div>{" "}
              <div className="cta">
                {" "}
                <Link className="btn primary" href="/getting-started">
                  Get Started →
                </Link>{" "}
                <Link className="btn ghost" href="/donate">
                  <span className="heart" aria-hidden="true">
                    ♥
                  </span>
                  {" Support Our Mission"}
                </Link>{" "}
                <a
                  className="btn link"
                  href="https://github.com/embeddedos-org"
                  target="_blank"
                  rel="noopener"
                >
                  {"View on GitHub "}
                  <span className="star" aria-hidden="true">
                    ★
                  </span>
                </a>{" "}
              </div>{" "}
              <div className="hero-stats" aria-label="At a glance">
                {" "}
                <div>
                  <b data-n={REPO_COUNT} style={{ color: "#F97316" }}>
                    {REPO_COUNT}
                  </b>
                  <span>Repositories</span>
                </div>{" "}
                <div>
                  <b data-n={BOARD_COUNT} style={{ color: "#22D3EE" }}>
                    {BOARD_COUNT}
                  </b>
                  <span>Boards</span>
                </div>{" "}
                <div>
                  <b data-n="14" style={{ color: "#A78BFA" }}>
                    14
                  </b>
                  <span>Books</span>
                </div>{" "}
              </div>{" "}
              <span className="hint">
                <span className="h-fine">
                  Scroll to follow one board through every industry · drag to
                  turn it 360°
                </span>
                <span className="h-touch">
                  Scroll to follow one board through every industry · swipe
                  sideways to turn it
                </span>
              </span>{" "}
            </article>{" "}
            <article
              className="card"
              style={{ "--c": "#EF4444" } as CSSProperties}
              inert
            >
              {" "}
              <span className="eyebrow">01 · eHealth365</span>{" "}
              <h2>A ring for vitals, a patch for chemistry</h2>{" "}
              <p className="lead">
                eHealth365 pairs two wearable designs. The Smart Ring Pro is
                designed to measure heart rate, HRV, SpO₂, body temperature,
                sleep stages and activity. The Smart Patch Pro, worn one patch a
                week, is designed to measure glucose, sweat electrolytes,
                hydration and skin pH.
              </p>{" "}
              <p className="fact">
                <span>From eHealth365_CAD_Design/README.md</span>Both are
                designed to connect to one mobile app over Bluetooth LE
              </p>{" "}
              <div className="pills">
                <span
                  className="pill"
                  style={{ "--t": "var(--tone-concept)" } as CSSProperties}
                >
                  eCAD Hardware · Design stage
                </span>
                <span
                  className="pill"
                  style={{ "--t": "var(--tone-available)" } as CSSProperties}
                >
                  EoS profile: wearable
                </span>
              </div>{" "}
              <span className="hint">
                <span className="h-fine">
                  Drag to turn it 360° · hover a part for details
                </span>
                <span className="h-touch">
                  Swipe sideways to turn it 360° · tap a part for details
                </span>
              </span>{" "}
            </article>{" "}
            <article
              className="card compact"
              style={{ "--c": "#FB7185" } as CSSProperties}
              data-side="right"
              inert
            >
              {" "}
              <span className="eyebrow">02 · eosHealth</span>{" "}
              <h2>A health band on the wrist</h2>{" "}
              <p className="lead">
                eosHealth holds four EoS Health designs: HEALTH-KEY ULTRA,
                HEALTH-BAND Neuro, HEALTH-RING and HEALTH-LAB. The HEALTH-BAND
                Neuro design is a wristband with a 44 mm case and a 1.4-inch
                AMOLED display, rated IP68.
              </p>{" "}
              <p className="fact">
                <span>
                  From
                  eosHealth_CAD_Design/HEALTH-BAND-Neuro/product_datasheet.md
                </span>
                Case 44 × 38 × 12 mm · 42 g with band
              </p>{" "}
              <div className="pills">
                <span
                  className="pill"
                  style={{ "--t": "var(--tone-concept)" } as CSSProperties}
                >
                  eCAD Hardware · Design stage
                </span>
                <span
                  className="pill"
                  style={{ "--t": "var(--tone-available)" } as CSSProperties}
                >
                  EoS profile: watch
                </span>
              </div>{" "}
              <span className="hint">
                <span className="h-fine">
                  Drag to turn it 360° · hover a part for details
                </span>
                <span className="h-touch">
                  Swipe sideways to turn it 360° · tap a part for details
                </span>
              </span>{" "}
            </article>{" "}
            <article
              className="card"
              style={{ "--c": "#F472B6" } as CSSProperties}
              inert
            >
              {" "}
              <span className="eyebrow">03 · eMedical</span>{" "}
              <h2>A 12-lead ECG on battery power</h2>{" "}
              <p className="lead">
                eMedical covers diagnostic, patient-care, surgical and
                laboratory designs. The eECG-12 design is a battery-powered
                12-lead ECG with a 7-inch touch display, BLE 5.3 and Wi-Fi 6,
                designed for eight hours on its battery and to the IEC 60601-1
                safety standard.
              </p>{" "}
              <p className="fact">
                <span>
                  From diagnostic_equipment/product_datasheet.md · Design Phase
                </span>
                STM32H7B3 MCU · ADS1298 8-channel 24-bit ECG front end
              </p>{" "}
              <div className="pills">
                <span
                  className="pill"
                  style={{ "--t": "var(--tone-concept)" } as CSSProperties}
                >
                  eCAD Hardware · Design stage
                </span>
                <span
                  className="pill"
                  style={{ "--t": "var(--tone-available)" } as CSSProperties}
                >
                  EoS profile: medical
                </span>
              </div>{" "}
              <span className="hint">
                <span className="h-fine">
                  Drag to turn it 360° · hover a part for details
                </span>
                <span className="h-touch">
                  Swipe sideways to turn it 360° · tap a part for details
                </span>
              </span>{" "}
            </article>{" "}
            <article
              className="card compact"
              style={{ "--c": "#F97316" } as CSSProperties}
              data-side="right"
              inert
            >
              {" "}
              <span className="eyebrow">04 · eRadar360</span>{" "}
              <h2>360° awareness from the windshield</h2>{" "}
              <p className="lead">
                eRadar360 (Aegis One for OEMs) is a windshield-mounted car
                safety design. It is designed to fuse four sensor types: front
                and rear 77 GHz FMCW radar, five laser detectors spaced 72°
                apart for 360° coverage, and V2X radio.
              </p>{" "}
              <p className="fact">
                <span>From eRadar360_CAD_Design/README.md</span>2× TI AWR2944 77
                GHz radar · 5× InGaAs APD laser detectors · V2X
              </p>{" "}
              <div className="pills">
                <span
                  className="pill"
                  style={{ "--t": "var(--tone-concept)" } as CSSProperties}
                >
                  eCAD Hardware · Design stage
                </span>
                <span
                  className="pill"
                  style={{ "--t": "var(--tone-available)" } as CSSProperties}
                >
                  EoS profile: automotive
                </span>
              </div>{" "}
              <span className="hint">
                <span className="h-fine">
                  Drag to turn it 360° · hover a part for details
                </span>
                <span className="h-touch">
                  Swipe sideways to turn it 360° · tap a part for details
                </span>
              </span>{" "}
            </article>{" "}
            <article
              className="card compact"
              style={{ "--c": "#38BDF8" } as CSSProperties}
              inert
            >
              {" "}
              <span className="eyebrow">05 · eTransport</span>{" "}
              <h2>Charts on the bridge</h2>{" "}
              <p className="lead">
                eTransport covers automotive, maritime and rail electronics. The
                eNav-ECDIS design is an electronic chart display for ships, with
                a 27-inch sunlight-readable display and encrypted S-57/S-63
                electronic navigational charts.
              </p>{" "}
              <p className="fact">
                <span>
                  From maritime_systems/product_datasheet.md · IEC 61174, SOLAS
                </span>
                NXP i.MX 8M Plus · NMEA 2000, NMEA 0183, AIS, Ethernet
              </p>{" "}
              <div className="pills">
                <span
                  className="pill"
                  style={{ "--t": "var(--tone-concept)" } as CSSProperties}
                >
                  eCAD Hardware · Design stage
                </span>
                <span
                  className="pill"
                  style={{ "--t": "var(--tone-available)" } as CSSProperties}
                >
                  EoS profile: cockpit
                </span>
              </div>{" "}
              <span className="hint">
                <span className="h-fine">
                  Drag to turn it 360° · hover a part for details
                </span>
                <span className="h-touch">
                  Swipe sideways to turn it 360° · tap a part for details
                </span>
              </span>{" "}
            </article>{" "}
            <article
              className="card compact"
              style={{ "--c": "#2DD4BF" } as CSSProperties}
              data-side="right"
              inert
            >
              {" "}
              <span className="eyebrow">06 · ePAM</span>{" "}
              <h2>A four-seat tilt-rotor</h2>{" "}
              <p className="lead">
                ePAM holds personal air and mobility designs: the Urban Drone, a
                space shuttle avionics board, an eco car and a combo unit. The
                Urban Drone design is a four-seat tilt-rotor eVTOL, shown here
                as a scale model.
              </p>{" "}
              <p className="fact">
                <span>
                  From ePAM_CAD_Design/urban_drone/product_datasheet.md
                </span>
                Wingspan 12 m extended, 4 m folded · MTOW 1,400 kg
              </p>{" "}
              <div className="pills">
                <span
                  className="pill"
                  style={{ "--t": "var(--tone-concept)" } as CSSProperties}
                >
                  eCAD Hardware · Design stage
                </span>
                <span
                  className="pill"
                  style={{ "--t": "var(--tone-available)" } as CSSProperties}
                >
                  EoS profile: aerospace
                </span>
              </div>{" "}
              <span className="hint">
                <span className="h-fine">
                  Drag to turn it 360° · hover a part for details
                </span>
                <span className="h-touch">
                  Swipe sideways to turn it 360° · tap a part for details
                </span>
              </span>{" "}
            </article>{" "}
            <article
              className="card"
              style={{ "--c": "#22D3EE" } as CSSProperties}
              inert
            >
              {" "}
              <span className="eyebrow">07 · eAerospace</span>{" "}
              <h2>An inspection drone</h2>{" "}
              <p className="lead">
                eAerospace has the most models of any domain: avionics,
                CubeSats, flight control, navigation, launch systems and UAVs.
                The eMR-400 design is a multirotor inspection drone in the UAV
                and drone line.
              </p>{" "}
              <p className="fact">
                <span>
                  From uav_drone_systems/product_datasheet.md · Design Phase
                </span>
                eMR-400 design targets: 1 kg payload, 45 min endurance, 10 km
                range
              </p>{" "}
              <div className="pills">
                <span
                  className="pill"
                  style={{ "--t": "var(--tone-concept)" } as CSSProperties}
                >
                  eCAD Hardware · Design stage
                </span>
                <span
                  className="pill"
                  style={{ "--t": "var(--tone-available)" } as CSSProperties}
                >
                  EoS profile: drone
                </span>
              </div>{" "}
              <span className="hint">
                <span className="h-fine">
                  Drag to turn it 360° · hover a part for details
                </span>
                <span className="h-touch">
                  Swipe sideways to turn it 360° · tap a part for details
                </span>
              </span>{" "}
            </article>{" "}
            <article
              className="card"
              style={{ "--c": "#A78BFA" } as CSSProperties}
              data-side="right"
              inert
            >
              {" "}
              <span className="eyebrow">08 · eRobotics</span>{" "}
              <h2>A whole robot, built from five designs</h2>{" "}
              <p className="lead">
                eRobotics covers industrial robots, autonomous systems and robot
                components. This robot is assembled from five of them: the
                eAMR-500 mobile base, the eArm-7 seven-axis arm, the eGripper-3F
                hand, eVision-4K stereo eyes and the eLiDAR-360.
              </p>{" "}
              <p className="fact">
                <span>
                  From autonomous_systems, industrial_robots and
                  robot_components datasheets
                </span>
                eAMR-500: 500 kg payload, 2 m/s, LiDAR SLAM · eArm-7: 10 kg, 1.3
                m reach
              </p>{" "}
              <div className="pills">
                <span
                  className="pill"
                  style={{ "--t": "var(--tone-concept)" } as CSSProperties}
                >
                  eCAD Hardware · Design stage
                </span>
                <span
                  className="pill"
                  style={{ "--t": "var(--tone-available)" } as CSSProperties}
                >
                  EoS profile: robot
                </span>
              </div>{" "}
              <span className="hint">
                <span className="h-fine">
                  Drag to turn it 360° · hover a part for details
                </span>
                <span className="h-touch">
                  Swipe sideways to turn it 360° · tap a part for details
                </span>
              </span>{" "}
            </article>{" "}
            <article
              className="card compact"
              style={{ "--c": "#10B981" } as CSSProperties}
              inert
            >
              {" "}
              <span className="eyebrow">09 · eAgriTech</span>{" "}
              <h2>A tractor that steers itself</h2>{" "}
              <p className="lead">
                The website lists eAgriTech as its own industry. Its design
                lives in the eRobotics autonomous-systems line: the
                eAgri-Tractor, an autonomous tractor designed to navigate by RTK
                GPS and LiDAR.
              </p>{" "}
              <p className="fact">
                <span>
                  From
                  eRobotics_CAD_Design/autonomous_systems/product_datasheet.md
                </span>
                eAgri-Tractor · design speed 3 m/s
              </p>{" "}
              <div className="pills">
                <span
                  className="pill"
                  style={{ "--t": "var(--tone-concept)" } as CSSProperties}
                >
                  eCAD Hardware · Design stage
                </span>
                <span
                  className="pill"
                  style={{ "--t": "var(--tone-available)" } as CSSProperties}
                >
                  EoS profile: autonomous
                </span>
              </div>{" "}
              <span className="hint">
                <span className="h-fine">
                  Drag to turn it 360° · hover a part for details
                </span>
                <span className="h-touch">
                  Swipe sideways to turn it 360° · tap a part for details
                </span>
              </span>{" "}
            </article>{" "}
            <article
              className="card compact"
              style={{ "--c": "#C084FC" } as CSSProperties}
              data-side="right"
              inert
            >
              {" "}
              <span className="eyebrow">10 · eFrontier</span>{" "}
              <h2>A robot arm for space</h2>{" "}
              <p className="lead">
                eFrontier explores bioelectronics, nanotechnology, neuromorphic
                computing, photonics, quantum control, space robotics and
                swarms. The eSRB-900 design is a space-robotics controller for a
                seven-axis arm on a rad-hard processor.
              </p>{" "}
              <p className="fact">
                <span>From space_robotics/product_datasheet.md</span>GR712RC
                dual-core LEON3FT · 50 krad(Si) dose target
              </p>{" "}
              <div className="pills">
                <span
                  className="pill"
                  style={{ "--t": "var(--tone-concept)" } as CSSProperties}
                >
                  eCAD Hardware · Design stage
                </span>
                <span
                  className="pill"
                  style={{ "--t": "var(--tone-available)" } as CSSProperties}
                >
                  EoS profile: satellite
                </span>
              </div>{" "}
              <span className="hint">
                <span className="h-fine">
                  Drag to turn it 360° · hover a part for details
                </span>
                <span className="h-touch">
                  Swipe sideways to turn it 360° · tap a part for details
                </span>
              </span>{" "}
            </article>{" "}
            <article
              className="card compact"
              style={{ "--c": "#34D399" } as CSSProperties}
              inert
            >
              {" "}
              <span className="eyebrow">11 · eIndustrial</span>{" "}
              <h2>A controller for the plant floor</h2>{" "}
              <p className="lead">
                eIndustrial spans industrial electronics, sensors and
                infrastructure equipment. The ePLC-1000 design is a modular PLC
                for IEC 61131-3 programs on an NXP i.MX 8M Plus, with 32 digital
                inputs, 32 digital outputs, 16 analog inputs and 8 analog
                outputs.
              </p>{" "}
              <p className="fact">
                <span>
                  From industrial_electronics/product_datasheet.md · Design
                  Phase
                </span>
                Fieldbus: PROFIBUS DP, PROFINET, EtherCAT, Modbus TCP/RTU
              </p>{" "}
              <div className="pills">
                <span
                  className="pill"
                  style={{ "--t": "var(--tone-concept)" } as CSSProperties}
                >
                  eCAD Hardware · Design stage
                </span>
                <span
                  className="pill"
                  style={{ "--t": "var(--tone-available)" } as CSSProperties}
                >
                  EoS profile: plc
                </span>
              </div>{" "}
              <span className="hint">
                <span className="h-fine">
                  Drag to turn it 360° · hover a part for details
                </span>
                <span className="h-touch">
                  Swipe sideways to turn it 360° · tap a part for details
                </span>
              </span>{" "}
            </article>{" "}
            <article
              className="card"
              style={{ "--c": "#F59E0B" } as CSSProperties}
              data-side="right"
              inert
            >
              {" "}
              <span className="eyebrow">12 · eEnergy</span>{" "}
              <h2>A board that watches every cell</h2>{" "}
              <p className="lead">
                eEnergy covers battery products, renewable energy and power
                electronics. The eBMS-100A battery-management design is designed
                to monitor each cell, sense pack current, balance cells actively
                and protect against over-voltage, under-voltage, over-current,
                overheating and short circuits.
              </p>{" "}
              <p className="fact">
                <span>
                  From battery_products/product_datasheet.md · Design Phase
                </span>
                eBMS-100A communication: CAN FD, SMBus, RS-485, BLE
              </p>{" "}
              <div className="pills">
                <span
                  className="pill"
                  style={{ "--t": "var(--tone-concept)" } as CSSProperties}
                >
                  eCAD Hardware · Design stage
                </span>
                <span
                  className="pill"
                  style={{ "--t": "var(--tone-available)" } as CSSProperties}
                >
                  EoS profile: ev
                </span>
              </div>{" "}
              <span className="hint">
                <span className="h-fine">
                  Drag to turn it 360° · hover a part for details
                </span>
                <span className="h-touch">
                  Swipe sideways to turn it 360° · tap a part for details
                </span>
              </span>{" "}
            </article>{" "}
            <article
              className="card"
              style={{ "--c": "#60A5FA" } as CSSProperties}
              inert
            >
              {" "}
              <span className="eyebrow">13 · eSmartCity</span>{" "}
              <h2>Street lights that report back</h2>{" "}
              <p className="lead">
                eSmartCity has 13 lines, from civic sensing to waste management.
                The eSL-400 design twists into a street light's NEMA socket. It
                is designed to dim the lamp by ambient light, motion and
                schedule, meter its energy and report faults over LoRaWAN.
              </p>{" "}
              <p className="fact">
                <span>
                  From street_lighting/product_datasheet.md · Design Phase
                </span>
                Socket: ANSI C136.41 7-pin NEMA twist-lock
              </p>{" "}
              <div className="pills">
                <span
                  className="pill"
                  style={{ "--t": "var(--tone-concept)" } as CSSProperties}
                >
                  eCAD Hardware · Design stage
                </span>
                <span
                  className="pill"
                  style={{ "--t": "var(--tone-available)" } as CSSProperties}
                >
                  EoS profile: iot
                </span>
              </div>{" "}
              <span className="hint">
                <span className="h-fine">
                  Drag to turn it 360° · hover a part for details
                </span>
                <span className="h-touch">
                  Swipe sideways to turn it 360° · tap a part for details
                </span>
              </span>{" "}
            </article>{" "}
            <article
              className="card compact"
              style={{ "--c": "#A8A29E" } as CSSProperties}
              data-side="right"
              inert
            >
              {" "}
              <span className="eyebrow">14 · eMining</span>{" "}
              <h2>Four gases, one warning</h2>{" "}
              <p className="lead">
                eMining covers mining equipment, industrial safety and
                construction robots. The eGasDetect-4 design is a four-gas
                detector for oxygen, carbon monoxide, hydrogen sulphide and
                flammable gas, with audible, vibrating and visual alarms,
                designed to IP67.
              </p>{" "}
              <p className="fact">
                <span>
                  From industrial_safety/product_datasheet.md · Design Phase
                </span>
                ATEX design target: Ex ia IIC T4 Ga, Zones 0, 1 and 2
              </p>{" "}
              <div className="pills">
                <span
                  className="pill"
                  style={{ "--t": "var(--tone-concept)" } as CSSProperties}
                >
                  eCAD Hardware · Design stage
                </span>
                <span
                  className="pill"
                  style={{ "--t": "var(--tone-available)" } as CSSProperties}
                >
                  EoS profile: industrial
                </span>
              </div>{" "}
              <span className="hint">
                <span className="h-fine">
                  Drag to turn it 360° · hover a part for details
                </span>
                <span className="h-touch">
                  Swipe sideways to turn it 360° · tap a part for details
                </span>
              </span>{" "}
            </article>{" "}
            <article
              className="card"
              style={{ "--c": "#818CF8" } as CSSProperties}
              inert
            >
              {" "}
              <span className="eyebrow">15 · eEdgeAI</span>{" "}
              <h2>Four eyes, one decision</h2>{" "}
              <p className="lead">
                eEdgeAI is eight lines of edge-AI hardware: accelerators,
                inference servers, NPUs, sensor fusion, SLAM, speech, TinyML and
                vision. The eVIS-600 design synchronises four global-shutter
                cameras and runs object detection at 30 fps in 1080p on an i.MX
                8M Plus NPU. Research horizon: AGI-enabling methods for
                autonomous physical systems. No achieved AGI system is claimed
                as available today.
              </p>{" "}
              <p className="fact">
                <span>From vision_processing/product_datasheet.md</span>
                {"4× MIPI CSI-2 · <1 µs inter-camera skew · 850 nm IR strobe"}
              </p>{" "}
              <div className="pills">
                <span
                  className="pill"
                  style={{ "--t": "var(--tone-concept)" } as CSSProperties}
                >
                  eCAD Hardware · Design stage
                </span>
                <span
                  className="pill"
                  style={{ "--t": "var(--tone-available)" } as CSSProperties}
                >
                  EoS profile: ai_edge
                </span>
              </div>{" "}
              <span className="hint">
                <span className="h-fine">
                  Drag to turn it 360° · hover a part for details
                </span>
                <span className="h-touch">
                  Swipe sideways to turn it 360° · tap a part for details
                </span>
              </span>{" "}
            </article>{" "}
            <article
              className="card compact"
              style={{ "--c": "#FBBF24" } as CSSProperties}
              data-side="right"
              inert
            >
              {" "}
              <span className="eyebrow">16 · eElectronics</span>{" "}
              <h2>Down to the silicon</h2>{" "}
              <p className="lead">
                eElectronics designs the parts themselves: components,
                semiconductors and emerging technology. The eASIC-Vision design
                is a computer-vision chip on a 7 nm process with 32 MB of
                on-chip SRAM, in a 25 × 25 mm BGA-576 package.
              </p>{" "}
              <p className="fact">
                <span>
                  From semiconductor_products/product_datasheet.md · Design
                  Phase
                </span>
                Design targets: 100 TOPS (INT8) at 5 W typical
              </p>{" "}
              <div className="pills">
                <span
                  className="pill"
                  style={{ "--t": "var(--tone-concept)" } as CSSProperties}
                >
                  eCAD Hardware · Design stage
                </span>
                <span
                  className="pill"
                  style={{ "--t": "var(--tone-available)" } as CSSProperties}
                >
                  EoS profile: computer
                </span>
              </div>{" "}
              <span className="hint">
                <span className="h-fine">
                  Drag to turn it 360° · hover a part for details
                </span>
                <span className="h-touch">
                  Swipe sideways to turn it 360° · tap a part for details
                </span>
              </span>{" "}
            </article>{" "}
            <article
              className="card compact"
              style={{ "--c": "#8B5CF6" } as CSSProperties}
              inert
            >
              {" "}
              <span className="eyebrow">17 · eConsumer</span>{" "}
              <h2>One hub for the whole home</h2>{" "}
              <p className="lead">
                eConsumer covers smart home, smart devices and personal devices.
                The eHub-Pro design is a smart-home hub that speaks Matter 1.3,
                Zigbee 3.0, Z-Wave 700, BLE 5.3 and Wi-Fi 6, built on an NXP
                i.MX 8M Mini.
              </p>{" "}
              <p className="fact">
                <span>From smart_home/product_datasheet.md · Design Phase</span>
                The same line includes a thermostat, a video doorbell, an indoor
                camera and an AI speaker
              </p>{" "}
              <div className="pills">
                <span
                  className="pill"
                  style={{ "--t": "var(--tone-concept)" } as CSSProperties}
                >
                  eCAD Hardware · Design stage
                </span>
                <span
                  className="pill"
                  style={{ "--t": "var(--tone-available)" } as CSSProperties}
                >
                  EoS profile: smart_home
                </span>
              </div>{" "}
              <span className="hint">
                <span className="h-fine">
                  Drag to turn it 360° · hover a part for details
                </span>
                <span className="h-touch">
                  Swipe sideways to turn it 360° · tap a part for details
                </span>
              </span>{" "}
            </article>{" "}
            <article
              className="card compact"
              style={{ "--c": "#06B6D4" } as CSSProperties}
              data-side="right"
              inert
            >
              {" "}
              <span className="eyebrow">18 · eCybersecurity</span>{" "}
              <h2>A vault for keys</h2>{" "}
              <p className="lead">
                eCybersecurity designs hardware for trust: roots of trust,
                secure elements, TPMs and security appliances. The eHSM-9000
                design is a network-attached hardware security module designed
                to generate, store and use keys inside a tamper-responsive
                boundary, and to erase them if its active mesh is breached.
              </p>{" "}
              <p className="fact">
                <span>
                  From hardware_security_modules/product_datasheet.md · Design
                  Phase
                </span>
                M-of-N smartcard quorum · certification target FIPS 140-3 Level
                4
              </p>{" "}
              <div className="pills">
                <span
                  className="pill"
                  style={{ "--t": "var(--tone-concept)" } as CSSProperties}
                >
                  eCAD Hardware · Design stage
                </span>
                <span
                  className="pill"
                  style={{ "--t": "var(--tone-available)" } as CSSProperties}
                >
                  EoS profile: crypto_hw
                </span>
              </div>{" "}
              <span className="hint">
                <span className="h-fine">
                  Drag to turn it 360° · hover a part for details
                </span>
                <span className="h-touch">
                  Swipe sideways to turn it 360° · tap a part for details
                </span>
              </span>{" "}
            </article>{" "}
            <article
              className="card compact"
              style={{ "--c": "#9CA3AF" } as CSSProperties}
              inert
            >
              {" "}
              <span className="eyebrow">19 · eDefense</span>{" "}
              <h2>A computer with no fan to fail</h2>{" "}
              <p className="lead">
                eDefense has 19 lines, from ruggedised computing to sonar. The
                eRGD-2000 design is a rugged mission computer that cools by
                conduction through its chassis, so it needs no fan and can be
                sealed to IP67. It is designed for MIL-STD-810H shock and
                vibration.
              </p>{" "}
              <p className="fact">
                <span>
                  From ruggedized_computing/product_datasheet.md · Design Phase
                </span>
                NXP i.MX 8M Plus with NPU · −40 °C to +71 °C operating
              </p>{" "}
              <div className="pills">
                <span
                  className="pill"
                  style={{ "--t": "var(--tone-concept)" } as CSSProperties}
                >
                  eCAD Hardware · Design stage
                </span>
                <span
                  className="pill"
                  style={{ "--t": "var(--tone-available)" } as CSSProperties}
                >
                  EoS profile: server
                </span>
              </div>{" "}
              <span className="hint">
                <span className="h-fine">
                  Drag to turn it 360° · hover a part for details
                </span>
                <span className="h-touch">
                  Swipe sideways to turn it 360° · tap a part for details
                </span>
              </span>{" "}
            </article>{" "}
            <article
              className="card"
              style={{ "--c": "#34D399" } as CSSProperties}
              inert
            />{" "}
            <article
              className="card"
              style={{ "--c": "#34D399" } as CSSProperties}
              data-side="right"
              inert
            />{" "}
            <article
              className="card"
              style={{ "--c": "#34D399" } as CSSProperties}
              inert
            />{" "}
            <article
              className="card"
              style={{ "--c": "#34D399" } as CSSProperties}
              data-side="right"
              inert
            />{" "}
            <article
              className="card"
              style={{ "--c": "#34D399" } as CSSProperties}
              inert
            />{" "}
            <article
              className="card"
              style={{ "--c": "#38BDF8" } as CSSProperties}
              inert
            >
              {" "}
              <span className="eyebrow">20 · Every industry</span>{" "}
              <h2>Eighteen domains, one open collection</h2>{" "}
              <p className="lead">
                Every design in this hall, and every part of the robot at its
                centre, is part of eCAD Hardware: 125 product lines and 292
                named models. Each carries a datasheet, and most add a bill of
                materials and a power simulation. All are at design stage; no
                routed PCB or Gerbers yet. The repository is published under the
                MIT licence.
              </p>{" "}
              <p className="fact">
                <span>Ten future concepts</span>eBCI-Lite, eCubeSat-1U,
                eEdu-Kit, eFarm, eHand, eHive, eHydro, eMeshGrid, eRover-Mini,
                eVision
              </p>{" "}
              <div className="stack-chips fin-chips">
                <span style={{ "--c": "#EF4444" } as CSSProperties}>
                  eHealth365
                </span>
                <span style={{ "--c": "#FB7185" } as CSSProperties}>
                  eosHealth
                </span>
                <span style={{ "--c": "#F472B6" } as CSSProperties}>
                  eMedical
                </span>
                <span style={{ "--c": "#F97316" } as CSSProperties}>
                  eRadar360
                </span>
                <span style={{ "--c": "#38BDF8" } as CSSProperties}>
                  eTransport
                </span>
                <span style={{ "--c": "#2DD4BF" } as CSSProperties}>ePAM</span>
                <span style={{ "--c": "#22D3EE" } as CSSProperties}>
                  eAerospace
                </span>
                <span style={{ "--c": "#A78BFA" } as CSSProperties}>
                  eRobotics
                </span>
                <span style={{ "--c": "#10B981" } as CSSProperties}>
                  eAgriTech
                </span>
                <span style={{ "--c": "#C084FC" } as CSSProperties}>
                  eFrontier
                </span>
                <span style={{ "--c": "#34D399" } as CSSProperties}>
                  eIndustrial
                </span>
                <span style={{ "--c": "#F59E0B" } as CSSProperties}>
                  eEnergy
                </span>
                <span style={{ "--c": "#60A5FA" } as CSSProperties}>
                  eSmartCity
                </span>
                <span style={{ "--c": "#A8A29E" } as CSSProperties}>
                  eMining
                </span>
                <span style={{ "--c": "#818CF8" } as CSSProperties}>
                  eEdgeAI
                </span>
                <span style={{ "--c": "#FBBF24" } as CSSProperties}>
                  eElectronics
                </span>
                <span style={{ "--c": "#8B5CF6" } as CSSProperties}>
                  eConsumer
                </span>
                <span style={{ "--c": "#06B6D4" } as CSSProperties}>
                  eCybersecurity
                </span>
                <span style={{ "--c": "#9CA3AF" } as CSSProperties}>
                  eDefense
                </span>
                <span style={{ "--c": "#34D399" } as CSSProperties}>
                  Full-body robot
                </span>
              </div>{" "}
              <div className="cta">
                {" "}
                <Link className="btn primary" href="/ecad-hardware">
                  Explore eCAD Hardware →
                </Link>{" "}
                <a
                  className="btn ghost"
                  href="https://github.com/embeddedos-org/eCAD-Hardware-Products"
                  target="_blank"
                  rel="noopener"
                >
                  View on GitHub
                </a>{" "}
                <Link className="btn ghost" href="/getting-started">
                  Get Started
                </Link>{" "}
              </div>{" "}
            </article>{" "}
            <article
              className="spot"
              data-spot="ehealth365-design"
              style={{ "--c": "#EF4444" } as CSSProperties}
              inert
              aria-label="Smart Ring Pro + Smart Patch Pro"
            >
              {" "}
              <span className="spot-k">
                eHealth365 · 2 lines · 2 models
              </span>{" "}
              <h3>Smart Ring Pro + Smart Patch Pro</h3>{" "}
              <div className="chips">
                <span className="s-info">Design stage</span>
              </div>{" "}
              <p className="what">
                Two wearables, one ring and one patch, each with its own sensors
                and a shared phone app.
              </p>{" "}
              <dl className="facts">
                <div>
                  <dt>Devices</dt>
                  <dd>
                    <span data-count="2">2</span>
                  </dd>
                </div>
              </dl>{" "}
              <div className="chips items">
                <span className="s-info">Smart Patch Pro</span>
                <span className="s-info">Smart Ring Pro</span>
              </div>{" "}
              <p className="src">eHealth365_CAD_Design</p>{" "}
            </article>{" "}
            <article
              className="spot"
              data-spot="ehealth365-eos"
              data-side="right"
              style={{ "--c": "#34D399" } as CSSProperties}
              inert
              aria-label="How EoS would run it"
            >
              {" "}
              <span className="spot-k">EoS · wearable profile</span>{" "}
              <h3>How EoS would run it</h3>{" "}
              <div className="chips">
                <span className="s-code">Profile in eos</span>
                <span className="s-docs">Not validated on this hardware</span>
              </div>{" "}
              <p className="what">
                Docked here, the core board would boot EoS built with the
                wearable product profile: 17 features switched on, 4 of them
                services with working code today.
              </p>{" "}
              <div className="how">
                <span>How EoS would work here</span>
                <ol>
                  <li>
                    Heart-rate, SpO₂ and temperature samples would pass through
                    the EoS sensor service, whose filtering and calibration are
                    working code.
                  </li>
                  <li>
                    Bluetooth LE to the phone app would use the BLE HAL class,
                    which is a stub today.
                  </li>
                  <li>
                    Updates would land through the OTA service: its A/B state
                    machine and SHA-256 checks are in code, but it does not
                    write flash yet.
                  </li>
                </ol>
              </div>{" "}
              <div className="chips items">
                <span className="s-info">GPIO</span>
                <span className="s-info">UART</span>
                <span className="s-info">SPI</span>
                <span className="s-info">timer</span>
                <span className="s-docs">ADC</span>
                <span className="s-docs">BLE</span>
                <span className="s-docs">display</span>
                <span className="s-docs">touch</span>
                <span className="s-docs">IMU</span>
                <span className="s-docs">NFC</span>
                <span className="s-docs">flash</span>
                <span className="s-docs">RTC</span>
                <span className="s-code">crypto</span>
                <span className="s-code">OTA</span>
                <span className="s-code">filesystem</span>
                <span className="s-docs">power</span>
                <span className="s-code">sensor</span>
              </div>{" "}
              <p className="src">eos · products/wearable.h</p>{" "}
            </article>{" "}
            <article
              className="spot"
              data-spot="emedical-design"
              style={{ "--c": "#F472B6" } as CSSProperties}
              inert
              aria-label="eECG-12"
            >
              {" "}
              <span className="spot-k">
                eMedical · 4 lines · 19 models
              </span>{" "}
              <h3>eECG-12</h3>{" "}
              <div className="chips">
                <span className="s-info">Design stage</span>
              </div>{" "}
              <p className="what">
                A 12-lead ECG design with a 7-inch 1024 × 600 touch display and
                a 7.4 V 5000 mAh battery.
              </p>{" "}
              <dl className="facts">
                <div>
                  <dt>Leads</dt>
                  <dd>
                    <span data-count="12">12</span>
                  </dd>
                </div>
                <div>
                  <dt>Battery</dt>
                  <dd>
                    <span data-count="8">8</span>
                    <small>h design</small>
                  </dd>
                </div>
              </dl>{" "}
              <div className="chips items">
                <span className="s-info">eECG-12</span>
                <span className="s-info">eEEG-32</span>
                <span className="s-info">eUS-Pro</span>
                <span className="s-info">ePM-500</span>
                <span className="s-info">eBA-100</span>
                <span className="s-info">ePCR-96</span>
                <span className="s-info">eCentri-24K</span>
                <span className="s-info">eSeq-Nano</span>
                <span className="s-info">eSpec-UV</span>
                <span className="s-info">eLab-Auto</span>
                <span className="s-info">eVent-Pro</span>
                <span className="s-info">eInfuse-200</span>
                <span className="s-info">eO2-5L</span>
                <span className="s-info">eRehab-Arm</span>
                <span className="s-info">eProsth-Hand</span>
                <span className="s-info">eSurgBot-7</span>
                <span className="s-info">eESG-400</span>
                <span className="s-info">eEndo-4K</span>
                <span className="s-info">eSurgNav-3D</span>
              </div>{" "}
              <p className="src">eMedical_CAD_Design</p>{" "}
            </article>{" "}
            <article
              className="spot"
              data-spot="emedical-eos"
              data-side="right"
              style={{ "--c": "#34D399" } as CSSProperties}
              inert
              aria-label="How EoS would run it"
            >
              {" "}
              <span className="spot-k">EoS · medical profile</span>{" "}
              <h3>How EoS would run it</h3>{" "}
              <div className="chips">
                <span className="s-code">Profile in eos</span>
                <span className="s-docs">Not validated on this hardware</span>
              </div>{" "}
              <p className="what">
                Docked here, the core board would boot EoS built with the
                medical product profile: 13 features switched on, 4 of them
                services with working code today.
              </p>{" "}
              <div className="how">
                <span>How EoS would work here</span>
                <ol>
                  <li>
                    The ADS1298 ECG front end talks SPI. EoS's SPI driver is
                    register code for STM32F4 only, so the STM32H7 here needs
                    its own port.
                  </li>
                  <li>
                    Each lead would be a sensor-service channel with filtering
                    (working code).
                  </li>
                  <li>
                    The os service keeps an audit log and integrity checks, and
                    the security service holds keys and an access list (working
                    code). No EoS build is certified for medical use.
                  </li>
                </ol>
              </div>{" "}
              <div className="chips items">
                <span className="s-info">GPIO</span>
                <span className="s-info">UART</span>
                <span className="s-info">SPI</span>
                <span className="s-info">timer</span>
                <span className="s-docs">ADC</span>
                <span className="s-docs">BLE</span>
                <span className="s-docs">display</span>
                <span className="s-code">crypto</span>
                <span className="s-code">security</span>
                <span className="s-docs">power</span>
                <span className="s-code">sensor</span>
                <span className="s-docs">safety</span>
                <span className="s-code">audit</span>
              </div>{" "}
              <p className="src">eos · products/medical.h</p>{" "}
            </article>{" "}
            <article
              className="spot"
              data-spot="eaerospace-design"
              style={{ "--c": "#22D3EE" } as CSSProperties}
              inert
              aria-label="eMR-400"
            >
              {" "}
              <span className="spot-k">
                eAerospace · 17 lines · 57 models
              </span>{" "}
              <h3>eMR-400</h3>{" "}
              <div className="chips">
                <span className="s-info">Design stage</span>
              </div>{" "}
              <p className="what">
                A multirotor inspection drone design; the line also includes
                fixed-wing, VTOL cargo and swarm designs.
              </p>{" "}
              <dl className="facts">
                <div>
                  <dt>Payload</dt>
                  <dd>
                    <span data-count="1">1</span>
                    <small>kg target</small>
                  </dd>
                </div>
                <div>
                  <dt>Endurance</dt>
                  <dd>
                    <span data-count="45">45</span>
                    <small>min target</small>
                  </dd>
                </div>
              </dl>{" "}
              <div className="chips items">
                <span className="s-info">eATM-3000</span>
                <span className="s-info">eATM-RSU</span>
                <span className="s-info">eATM-TWR</span>
                <span className="s-info">eAPT-900</span>
                <span className="s-info">eAPT-VDGS</span>
                <span className="s-info">eAPT-APR</span>
                <span className="s-info">eFC-1000</span>
                <span className="s-info">eNAV-500</span>
                <span className="s-info">eADC-200</span>
                <span className="s-info">eFD-1080</span>
                <span className="s-info">eCOM-400</span>
                <span className="s-info">eXPDR-1090</span>
                <span className="s-info">eCUBE-3U-OBC</span>
                <span className="s-info">eCUBE-EPS</span>
                <span className="s-info">eCUBE-ADCS</span>
                <span className="s-info">eCUBE-3U</span>
                <span className="s-info">eFCS-2000</span>
                <span className="s-info">eFCS-2000M</span>
                <span className="s-info">eACE-400</span>
                <span className="s-info">eGNSS-400</span>
                <span className="s-info">+37 more</span>
              </div>{" "}
              <p className="src">eAerospace_CAD_Design</p>{" "}
            </article>{" "}
            <article
              className="spot"
              data-spot="eaerospace-eos"
              data-side="right"
              style={{ "--c": "#34D399" } as CSSProperties}
              inert
              aria-label="How EoS would run it"
            >
              {" "}
              <span className="spot-k">EoS · drone profile</span>{" "}
              <h3>How EoS would run it</h3>{" "}
              <div className="chips">
                <span className="s-code">Profile in eos</span>
                <span className="s-docs">Not validated on this hardware</span>
              </div>{" "}
              <p className="what">
                Docked here, the core board would boot EoS built with the drone
                product profile: 23 features switched on, 6 of them services
                with working code today.
              </p>{" "}
              <div className="how">
                <span>How EoS would work here</span>
                <ol>
                  <li>
                    Four motors fit inside the motor service's limit of eight:
                    its PID speed loops and trajectories are working code.
                  </li>
                  <li>
                    The motor (ESC) and IMU HAL classes are stubs today, so
                    nothing drives real hardware yet.
                  </li>
                  <li>
                    GNSS position comes from the gps service (NMEA parsing,
                    working code); updates would arrive through the OTA A/B
                    service.
                  </li>
                </ol>
              </div>{" "}
              <div className="chips items">
                <span className="s-info">GPIO</span>
                <span className="s-info">UART</span>
                <span className="s-info">SPI</span>
                <span className="s-info">timer</span>
                <span className="s-docs">ADC</span>
                <span className="s-docs">PWM</span>
                <span className="s-docs">wifi</span>
                <span className="s-docs">BLE</span>
                <span className="s-docs">camera</span>
                <span className="s-docs">motor</span>
                <span className="s-code">GNSS</span>
                <span className="s-docs">IMU</span>
                <span className="s-docs">radar</span>
                <span className="s-docs">DMA</span>
                <span className="s-code">OTA</span>
                <span className="s-docs">flash</span>
                <span className="s-docs">WDT</span>
                <span className="s-code">filesystem</span>
                <span className="s-docs">power</span>
                <span className="s-code">net</span>
                <span className="s-code">sensor</span>
                <span className="s-code">motor ctrl</span>
                <span className="s-docs">safety</span>
              </div>{" "}
              <p className="src">eos · products/drone.h</p>{" "}
            </article>{" "}
            <article
              className="spot"
              data-spot="erobotics-design"
              data-side="right"
              style={{ "--c": "#A78BFA" } as CSSProperties}
              inert
              aria-label="A full robot from five designs"
            >
              {" "}
              <span className="spot-k">
                eRobotics · 3 lines · 15 models
              </span>{" "}
              <h3>A full robot from five designs</h3>{" "}
              <div className="chips">
                <span className="s-info">Design stage</span>
              </div>{" "}
              <p className="what">
                An autonomous mobile manipulator: base, arm, gripper, vision and
                LiDAR are each an eRobotics design.
              </p>{" "}
              <dl className="facts">
                <div>
                  <dt>Designs combined</dt>
                  <dd>
                    <span data-count="5">5</span>
                  </dd>
                </div>
                <div>
                  <dt>Arm axes</dt>
                  <dd>
                    <span data-count="7">7</span>
                  </dd>
                </div>
              </dl>{" "}
              <div className="chips items">
                <span className="s-info">eAMR-500</span>
                <span className="s-info">eWarehouse-1T</span>
                <span className="s-info">eDelivery-Bot</span>
                <span className="s-info">eAgri-Tractor</span>
                <span className="s-info">eSecurity-Patrol</span>
                <span className="s-info">eArm-7</span>
                <span className="s-info">eWeld-6</span>
                <span className="s-info">eAssemble-4</span>
                <span className="s-info">ePick-Delta</span>
                <span className="s-info">eCobot-5</span>
                <span className="s-info">eServo-200</span>
                <span className="s-info">eActuator-50</span>
                <span className="s-info">eGripper-3F</span>
                <span className="s-info">eVision-4K</span>
                <span className="s-info">eLiDAR-360</span>
              </div>{" "}
              <p className="src">eRobotics_CAD_Design</p>{" "}
            </article>{" "}
            <article
              className="spot"
              data-spot="erobotics-eos"
              style={{ "--c": "#34D399" } as CSSProperties}
              inert
              aria-label="How EoS would run it"
            >
              {" "}
              <span className="spot-k">EoS · robot profile</span>{" "}
              <h3>How EoS would run it</h3>{" "}
              <div className="chips">
                <span className="s-code">Profile in eos</span>
                <span className="s-docs">Not validated on this hardware</span>
              </div>{" "}
              <p className="what">
                Docked here, the core board would boot EoS built with the robot
                product profile: 15 features switched on, 3 of them services
                with working code today.
              </p>{" "}
              <div className="how">
                <span>How EoS would work here</span>
                <ol>
                  <li>
                    The arm's 7 joints plus the base's 4 hub motors make 11
                    motors, more than the 8 the motor service tracks per image
                    today, so this robot needs that limit raised or two EoS
                    images.
                  </li>
                  <li>
                    LiDAR, cameras and the IMU sit behind HAL stub classes; the
                    sensor service (working code) holds up to 16 sensors.
                  </li>
                  <li>
                    The priority scheduler keeps the safety stop ahead of
                    everything else, and eos_motor_ctrl_emergency_stop() halts a
                    motor in one call (working code).
                  </li>
                </ol>
              </div>{" "}
              <div className="chips items">
                <span className="s-info">GPIO</span>
                <span className="s-info">UART</span>
                <span className="s-info">SPI</span>
                <span className="s-info">I2C</span>
                <span className="s-info">timer</span>
                <span className="s-docs">ADC</span>
                <span className="s-docs">PWM</span>
                <span className="s-docs">wifi</span>
                <span className="s-docs">BLE</span>
                <span className="s-docs">camera</span>
                <span className="s-docs">motor</span>
                <span className="s-docs">IMU</span>
                <span className="s-code">net</span>
                <span className="s-code">sensor</span>
                <span className="s-code">motor ctrl</span>
              </div>{" "}
              <p className="src">eos · products/robot.h</p>{" "}
            </article>{" "}
            <article
              className="spot"
              data-spot="eenergy-design"
              data-side="right"
              style={{ "--c": "#F59E0B" } as CSSProperties}
              inert
              aria-label="eBMS-100A"
            >
              {" "}
              <span className="spot-k">eEnergy · 3 lines · 15 models</span>{" "}
              <h3>eBMS-100A</h3>{" "}
              <div className="chips">
                <span className="s-info">Design stage</span>
              </div>{" "}
              <p className="what">
                A battery-management design with per-cell monitoring and active
                balancing.
              </p>{" "}
              <dl className="facts">
                <div>
                  <dt>Interfaces</dt>
                  <dd>
                    <span data-count="4">4</span>
                  </dd>
                </div>
              </dl>{" "}
              <div className="chips items">
                <span className="s-info">eBMS-100A</span>
                <span className="s-info">eLiPack-10kWh</span>
                <span className="s-info">eESS-100kWh</span>
                <span className="s-info">ePPS-5kW</span>
                <span className="s-info">eSBM-Smart</span>
                <span className="s-info">eDCDC-5kW</span>
                <span className="s-info">eUPS-10kVA</span>
                <span className="s-info">eMotorDrive-22kW</span>
                <span className="s-info">ePDU-Smart</span>
                <span className="s-info">eBreaker-Smart</span>
                <span className="s-info">eSolarInv-10kW</span>
                <span className="s-info">eSolarTracker</span>
                <span className="s-info">eWindCtrl-50kW</span>
                <span className="s-info">eMicrogrid-100</span>
                <span className="s-info">eSCC-60A</span>
              </div>{" "}
              <p className="src">eEnergy_CAD_Design</p>{" "}
            </article>{" "}
            <article
              className="spot"
              data-spot="eenergy-eos"
              style={{ "--c": "#34D399" } as CSSProperties}
              inert
              aria-label="How EoS would run it"
            >
              {" "}
              <span className="spot-k">EoS · ev profile</span>{" "}
              <h3>How EoS would run it</h3>{" "}
              <div className="chips">
                <span className="s-code">Profile in eos</span>
                <span className="s-docs">Not validated on this hardware</span>
              </div>{" "}
              <p className="what">
                Docked here, the core board would boot EoS built with the ev
                product profile: 31 features switched on, 9 of them services
                with working code today.
              </p>{" "}
              <div className="how">
                <span>How EoS would work here</span>
                <ol>
                  <li>
                    The LTC6813 talks SPI, and each cell would be a
                    sensor-service channel with filtering (working code). Its 18
                    cells exceed the service's 16 channels today.
                  </li>
                  <li>
                    Over-voltage, over-current and short-circuit protection
                    would run as the highest-priority kernel task.
                  </li>
                  <li>
                    CAN FD and BLE are HAL stubs, and the power service is
                    bookkeeping only, so real readings come from the BMS itself.
                  </li>
                </ol>
              </div>{" "}
              <div className="chips items">
                <span className="s-info">GPIO</span>
                <span className="s-info">UART</span>
                <span className="s-info">SPI</span>
                <span className="s-info">timer</span>
                <span className="s-docs">ADC</span>
                <span className="s-docs">DAC</span>
                <span className="s-docs">PWM</span>
                <span className="s-docs">CAN</span>
                <span className="s-docs">ethernet</span>
                <span className="s-docs">motor</span>
                <span className="s-docs">IMU</span>
                <span className="s-code">GNSS</span>
                <span className="s-docs">display</span>
                <span className="s-docs">touch</span>
                <span className="s-docs">DMA</span>
                <span className="s-docs">flash</span>
                <span className="s-docs">RTC</span>
                <span className="s-docs">WDT</span>
                <span className="s-docs">cellular</span>
                <span className="s-docs">wifi</span>
                <span className="s-docs">BLE</span>
                <span className="s-code">crypto</span>
                <span className="s-docs">safety</span>
                <span className="s-code">audit</span>
                <span className="s-docs">power</span>
                <span className="s-code">net</span>
                <span className="s-code">sensor</span>
                <span className="s-code">motor ctrl</span>
                <span className="s-code">OTA</span>
                <span className="s-code">filesystem</span>
                <span className="s-code">multicore</span>
              </div>{" "}
              <p className="src">eos · products/ev.h</p>{" "}
            </article>{" "}
            <article
              className="spot"
              data-spot="esmartcity-design"
              style={{ "--c": "#60A5FA" } as CSSProperties}
              inert
              aria-label="eSL-400"
            >
              {" "}
              <span className="spot-k">
                eSmartCity · 13 lines · 25 models
              </span>{" "}
              <h3>eSL-400</h3>{" "}
              <div className="chips">
                <span className="s-info">Design stage</span>
              </div>{" "}
              <p className="what">
                A NEMA twist-lock lighting controller design with dimming,
                metering and LoRaWAN.
              </p>{" "}
              <dl className="facts">
                <div>
                  <dt>Product lines</dt>
                  <dd>
                    <span data-count="13">13</span>
                  </dd>
                </div>
              </dl>{" "}
              <div className="chips items">
                <span className="s-info">eCS-200</span>
                <span className="s-info">eDIS-600</span>
                <span className="s-info">eGOV-500</span>
                <span className="s-info">eEMR-800</span>
                <span className="s-info">eHUM-400</span>
                <span className="s-info">eKSK-900</span>
                <span className="s-info">ePS-1200</span>
                <span className="s-info">eRUR-700</span>
                <span className="s-info">eSL-400</span>
                <span className="s-info">e5G-Small</span>
                <span className="s-info">eIoT-GW</span>
                <span className="s-info">eRouter-Pro</span>
                <span className="s-info">eNetMon</span>
                <span className="s-info">ePrivNet</span>
                <span className="s-info">eTrafficCtrl</span>
                <span className="s-info">eParkSensor</span>
                <span className="s-info">eStreetLight</span>
                <span className="s-info">eEnvStation</span>
                <span className="s-info">eSafety-Cam</span>
                <span className="s-info">eSM-3P</span>
                <span className="s-info">+5 more</span>
              </div>{" "}
              <p className="src">eSmartCity_CAD_Design</p>{" "}
            </article>{" "}
            <article
              className="spot"
              data-spot="esmartcity-eos"
              data-side="right"
              style={{ "--c": "#34D399" } as CSSProperties}
              inert
              aria-label="How EoS would run it"
            >
              {" "}
              <span className="spot-k">EoS · iot profile</span>{" "}
              <h3>How EoS would run it</h3>{" "}
              <div className="chips">
                <span className="s-code">Profile in eos</span>
                <span className="s-docs">Not validated on this hardware</span>
              </div>{" "}
              <p className="what">
                Docked here, the core board would boot EoS built with the iot
                product profile: 17 features switched on, 5 of them services
                with working code today.
              </p>{" "}
              <div className="how">
                <span>How EoS would work here</span>
                <ol>
                  <li>
                    LoRaWAN is not in EoS yet; it appears only in the docs.
                  </li>
                  <li>
                    Dimming from 1% to 100% would use the PWM HAL class and 0–10
                    V the DAC class; both are stubs today.
                  </li>
                  <li>
                    Metered voltage and current fit the sensor service's voltage
                    and current types (working code).
                  </li>
                </ol>
              </div>{" "}
              <div className="chips items">
                <span className="s-info">GPIO</span>
                <span className="s-info">UART</span>
                <span className="s-info">SPI</span>
                <span className="s-info">timer</span>
                <span className="s-docs">ADC</span>
                <span className="s-docs">wifi</span>
                <span className="s-docs">BLE</span>
                <span className="s-docs">cellular</span>
                <span className="s-docs">flash</span>
                <span className="s-docs">RTC</span>
                <span className="s-docs">WDT</span>
                <span className="s-code">crypto</span>
                <span className="s-code">OTA</span>
                <span className="s-code">filesystem</span>
                <span className="s-docs">power</span>
                <span className="s-code">net</span>
                <span className="s-code">sensor</span>
              </div>{" "}
              <p className="src">eos · products/iot.h</p>{" "}
            </article>{" "}
            <article
              className="spot"
              data-spot="eedgeai-design"
              style={{ "--c": "#818CF8" } as CSSProperties}
              inert
              aria-label="eVIS-600"
            >
              {" "}
              <span className="spot-k">eEdgeAI · 8 lines · 8 models</span>{" "}
              <h3>eVIS-600</h3>{" "}
              <div className="chips">
                <span className="s-info">Design stage</span>
              </div>{" "}
              <p className="what">
                A four-camera embedded vision design with a hardware ISP, IR
                strobe and GigE Vision output.
              </p>{" "}
              <dl className="facts">
                <div>
                  <dt>Cameras</dt>
                  <dd>
                    <span data-count="4">4</span>
                  </dd>
                </div>
                <div>
                  <dt>NPU</dt>
                  <dd>
                    <span data-count="2.3" data-dec="1">
                      2.3
                    </span>
                    <small>TOPS</small>
                  </dd>
                </div>
              </dl>{" "}
              <div className="chips items">
                <span className="s-info">eAI-2000</span>
                <span className="s-info">eINF-4000</span>
                <span className="s-info">eNPU-800</span>
                <span className="s-info">eSFU-500</span>
                <span className="s-info">eSLM-700</span>
                <span className="s-info">eSPX-300</span>
                <span className="s-info">eTML-100</span>
                <span className="s-info">eVIS-600</span>
              </div>{" "}
              <p className="src">eEdgeAI_CAD_Design</p>{" "}
            </article>{" "}
            <article
              className="spot"
              data-spot="eedgeai-eos"
              data-side="right"
              style={{ "--c": "#34D399" } as CSSProperties}
              inert
              aria-label="How EoS would run it"
            >
              {" "}
              <span className="spot-k">EoS · ai_edge profile</span>{" "}
              <h3>How EoS would run it</h3>{" "}
              <div className="chips">
                <span className="s-code">Profile in eos</span>
                <span className="s-docs">Not validated on this hardware</span>
              </div>{" "}
              <p className="what">
                Docked here, the core board would boot EoS built with the
                ai_edge product profile: 22 features switched on, 6 of them
                services with working code today.
              </p>{" "}
              <div className="how">
                <span>How EoS would work here</span>
                <ol>
                  <li>
                    Detection on the NPU would go through eAI, whose default
                    build returns stub inference today.
                  </li>
                  <li>
                    The four cameras would use the camera HAL class, a stub
                    today.
                  </li>
                  <li>
                    The nearest EoS board is imx8m (i.MX 8M Mini); the kernel's
                    AMP support would split vision from strobe timing (working
                    code).
                  </li>
                </ol>
              </div>{" "}
              <div className="chips items">
                <span className="s-info">GPIO</span>
                <span className="s-info">UART</span>
                <span className="s-info">SPI</span>
                <span className="s-info">timer</span>
                <span className="s-docs">USB</span>
                <span className="s-docs">ethernet</span>
                <span className="s-docs">wifi</span>
                <span className="s-docs">camera</span>
                <span className="s-docs">audio</span>
                <span className="s-docs">GPU</span>
                <span className="s-docs">PCIe</span>
                <span className="s-docs">DMA</span>
                <span className="s-docs">flash</span>
                <span className="s-docs">RTC</span>
                <span className="s-docs">SDIO</span>
                <span className="s-code">crypto</span>
                <span className="s-code">OTA</span>
                <span className="s-docs">power</span>
                <span className="s-code">net</span>
                <span className="s-code">sensor</span>
                <span className="s-code">filesystem</span>
                <span className="s-code">multicore</span>
              </div>{" "}
              <p className="src">eos · products/ai_edge.h</p>{" "}
            </article>{" "}
          </div>{" "}
          <div className="legend" id="legend" aria-hidden="true">
            <span className="l-code">
              <i />
              Working
            </span>
            <span className="l-part">
              <i />
              In code
            </span>
            <span className="l-docs">
              <i />
              Docs or descriptor
            </span>
            <span className="l-none">
              <i />
              Not in the repos yet
            </span>
          </div>{" "}
          <nav className="rail" id="rail" aria-label="Chapters">
            {" "}
            <button
              type="button"
              data-i="25"
              aria-label="Every industry"
              style={{ "--c": "#38BDF8" } as CSSProperties}
            >
              <span>Every industry</span>
              <i />
            </button>{" "}
            <button
              type="button"
              data-i="24"
              aria-label="Robot · safety"
              style={{ "--c": "#34D399" } as CSSProperties}
            >
              <span>Robot · safety</span>
              <i />
            </button>{" "}
            <button
              type="button"
              data-i="23"
              aria-label="Robot · hands"
              style={{ "--c": "#34D399" } as CSSProperties}
            >
              <span>Robot · hands</span>
              <i />
            </button>{" "}
            <button
              type="button"
              data-i="22"
              aria-label="Robot · walk"
              style={{ "--c": "#34D399" } as CSSProperties}
            >
              <span>Robot · walk</span>
              <i />
            </button>{" "}
            <button
              type="button"
              data-i="21"
              aria-label="Robot · see"
              style={{ "--c": "#34D399" } as CSSProperties}
            >
              <span>Robot · see</span>
              <i />
            </button>{" "}
            <button
              type="button"
              data-i="20"
              aria-label="Robot · wake"
              style={{ "--c": "#34D399" } as CSSProperties}
            >
              <span>Robot · wake</span>
              <i />
            </button>{" "}
            <button
              type="button"
              data-i="19"
              aria-label="eDefense"
              style={{ "--c": "#9CA3AF" } as CSSProperties}
            >
              <span>eDefense</span>
              <i />
            </button>{" "}
            <button
              type="button"
              data-i="18"
              aria-label="eCybersecurity"
              style={{ "--c": "#06B6D4" } as CSSProperties}
            >
              <span>eCybersecurity</span>
              <i />
            </button>{" "}
            <button
              type="button"
              data-i="17"
              aria-label="eConsumer"
              style={{ "--c": "#8B5CF6" } as CSSProperties}
            >
              <span>eConsumer</span>
              <i />
            </button>{" "}
            <button
              type="button"
              data-i="16"
              aria-label="eElectronics"
              style={{ "--c": "#FBBF24" } as CSSProperties}
            >
              <span>eElectronics</span>
              <i />
            </button>{" "}
            <button
              type="button"
              data-i="15"
              aria-label="eEdgeAI"
              style={{ "--c": "#818CF8" } as CSSProperties}
            >
              <span>eEdgeAI</span>
              <i />
            </button>{" "}
            <button
              type="button"
              data-i="14"
              aria-label="eMining"
              style={{ "--c": "#A8A29E" } as CSSProperties}
            >
              <span>eMining</span>
              <i />
            </button>{" "}
            <button
              type="button"
              data-i="13"
              aria-label="eSmartCity"
              style={{ "--c": "#60A5FA" } as CSSProperties}
            >
              <span>eSmartCity</span>
              <i />
            </button>{" "}
            <button
              type="button"
              data-i="12"
              aria-label="eEnergy"
              style={{ "--c": "#F59E0B" } as CSSProperties}
            >
              <span>eEnergy</span>
              <i />
            </button>{" "}
            <button
              type="button"
              data-i="11"
              aria-label="eIndustrial"
              style={{ "--c": "#34D399" } as CSSProperties}
            >
              <span>eIndustrial</span>
              <i />
            </button>{" "}
            <button
              type="button"
              data-i="10"
              aria-label="eFrontier"
              style={{ "--c": "#C084FC" } as CSSProperties}
            >
              <span>eFrontier</span>
              <i />
            </button>{" "}
            <button
              type="button"
              data-i="9"
              aria-label="eAgriTech"
              style={{ "--c": "#10B981" } as CSSProperties}
            >
              <span>eAgriTech</span>
              <i />
            </button>{" "}
            <button
              type="button"
              data-i="8"
              aria-label="eRobotics"
              style={{ "--c": "#A78BFA" } as CSSProperties}
            >
              <span>eRobotics</span>
              <i />
            </button>{" "}
            <button
              type="button"
              data-i="7"
              aria-label="eAerospace"
              style={{ "--c": "#22D3EE" } as CSSProperties}
            >
              <span>eAerospace</span>
              <i />
            </button>{" "}
            <button
              type="button"
              data-i="6"
              aria-label="ePAM"
              style={{ "--c": "#2DD4BF" } as CSSProperties}
            >
              <span>ePAM</span>
              <i />
            </button>{" "}
            <button
              type="button"
              data-i="5"
              aria-label="eTransport"
              style={{ "--c": "#38BDF8" } as CSSProperties}
            >
              <span>eTransport</span>
              <i />
            </button>{" "}
            <button
              type="button"
              data-i="4"
              aria-label="eRadar360"
              style={{ "--c": "#F97316" } as CSSProperties}
            >
              <span>eRadar360</span>
              <i />
            </button>{" "}
            <button
              type="button"
              data-i="3"
              aria-label="eMedical"
              style={{ "--c": "#F472B6" } as CSSProperties}
            >
              <span>eMedical</span>
              <i />
            </button>{" "}
            <button
              type="button"
              data-i="2"
              aria-label="eosHealth"
              style={{ "--c": "#FB7185" } as CSSProperties}
            >
              <span>eosHealth</span>
              <i />
            </button>{" "}
            <button
              type="button"
              data-i="1"
              aria-label="eHealth365"
              style={{ "--c": "#EF4444" } as CSSProperties}
            >
              <span>eHealth365</span>
              <i />
            </button>{" "}
          </nav>{" "}
          <div className="cue" id="cue">
            Scroll
          </div>{" "}
          <div className="loading" id="loading">
            Loading the 3D model
          </div>{" "}
          <p className="no-gl-note">
            This browser can't run the 3D model, so you're seeing the still
            image. Every chapter still works as you scroll.
          </p>{" "}
        </div>{" "}
        <div className="spacers" id="spacers">
          {" "}
          <div id="ch-intro" style={{ height: "100vh" }} />{" "}
          <div id="ch-ehealth365" style={{ height: "70vh" }} />{" "}
          <div id="ch-eoshealth" style={{ height: "28vh" }} />{" "}
          <div id="ch-emedical" style={{ height: "70vh" }} />{" "}
          <div id="ch-eradar360" style={{ height: "28vh" }} />{" "}
          <div id="ch-etransport" style={{ height: "28vh" }} />{" "}
          <div id="ch-epam" style={{ height: "28vh" }} />{" "}
          <div id="ch-eaerospace" style={{ height: "70vh" }} />{" "}
          <div id="ch-erobotics" style={{ height: "70vh" }} />{" "}
          <div id="ch-eagritech" style={{ height: "28vh" }} />{" "}
          <div id="ch-efrontier" style={{ height: "28vh" }} />{" "}
          <div id="ch-eindustrial" style={{ height: "28vh" }} />{" "}
          <div id="ch-eenergy" style={{ height: "70vh" }} />{" "}
          <div id="ch-esmartcity" style={{ height: "70vh" }} />{" "}
          <div id="ch-emining" style={{ height: "28vh" }} />{" "}
          <div id="ch-eedgeai" style={{ height: "70vh" }} />{" "}
          <div id="ch-eelectronics" style={{ height: "28vh" }} />{" "}
          <div id="ch-econsumer" style={{ height: "28vh" }} />{" "}
          <div id="ch-ecybersec" style={{ height: "28vh" }} />{" "}
          <div id="ch-edefense" style={{ height: "28vh" }} />{" "}
          <div id="ch-rbt-wake" style={{ height: "0vh" }} />{" "}
          <div id="ch-rbt-see" style={{ height: "0vh" }} />{" "}
          <div id="ch-rbt-walk" style={{ height: "0vh" }} />{" "}
          <div id="ch-rbt-hands" style={{ height: "0vh" }} />{" "}
          <div id="ch-rbt-safe" style={{ height: "0vh" }} />{" "}
          <div id="ch-every" style={{ height: "140vh" }} />{" "}
        </div>{" "}
      </div>
      <div className="hp" id="home-sections">
        {" "}
        <div className="hp-marquee" aria-label="EmbeddedOS ecosystem">
          {" "}
          <p>EmbeddedOS Ecosystem</p>{" "}
          <div className="mq-row">
            <span
              className="mq-item"
              style={{ "--c": "#F97316" } as CSSProperties}
            >
              <i>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect width="16" height="16" x="4" y="4" rx="2" />
                  <rect width="6" height="6" x="9" y="9" rx="1" />
                  <path d="M15 2v2" />
                  <path d="M15 20v2" />
                  <path d="M2 15h2" />
                  <path d="M2 9h2" />
                  <path d="M20 15h2" />
                  <path d="M20 9h2" />
                  <path d="M9 2v2" />
                  <path d="M9 20v2" />
                </svg>
              </i>
              <b>EoS Kernel</b>
              <em>Core</em>
            </span>
            <span
              className="mq-item"
              style={{ "--c": "#22D3EE" } as CSSProperties}
            >
              <i>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
                </svg>
              </i>
              <b>eBoot</b>
              <em>Security</em>
            </span>
            <span
              className="mq-item"
              style={{ "--c": "#A78BFA" } as CSSProperties}
            >
              <i>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </i>
              <b>eIPC</b>
              <em>Platform</em>
            </span>
            <span
              className="mq-item"
              style={{ "--c": "#34D399" } as CSSProperties}
            >
              <i>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
                  <path d="M8.5 2h7" />
                  <path d="M7 16h10" />
                </svg>
              </i>
              <b>eAI</b>
              <em>AI</em>
            </span>
            <span
              className="mq-item"
              style={{ "--c": "#60A5FA" } as CSSProperties}
            >
              <i>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
                  <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
                  <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
                  <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
                  <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
                  <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
                  <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
                  <path d="M6 18a4 4 0 0 1-1.967-.516" />
                  <path d="M19.967 17.484A4 4 0 0 1 18 18" />
                </svg>
              </i>
              <b>eosllm</b>
              <em>AI</em>
            </span>
            <span
              className="mq-item"
              style={{ "--c": "#F472B6" } as CSSProperties}
            >
              <i>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
                </svg>
              </i>
              <b>eNI</b>
              <em>Neural</em>
            </span>
            <span
              className="mq-item"
              style={{ "--c": "#22D3EE" } as CSSProperties}
            >
              <i>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <ellipse cx="12" cy="5" rx="9" ry="3" />
                  <path d="M3 5V19A9 3 0 0 0 21 19V5" />
                  <path d="M3 12A9 3 0 0 0 21 12" />
                </svg>
              </i>
              <b>eDB</b>
              <em>Data</em>
            </span>
            <span
              className="mq-item"
              style={{ "--c": "#F97316" } as CSSProperties}
            >
              <i>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
                  <path d="M12 22V12" />
                  <path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7" />
                  <path d="m7.5 4.27 9 5.15" />
                </svg>
              </i>
              <b>eApps</b>
              <em>Apps</em>
            </span>
            <span
              className="mq-item"
              style={{ "--c": "#A78BFA" } as CSSProperties}
            >
              <i>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
              </i>
              <b>eBrowser</b>
              <em>UI</em>
            </span>
            <span
              className="mq-item"
              style={{ "--c": "#34D399" } as CSSProperties}
            >
              <i>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                  <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                  <path d="M10 9H8" />
                  <path d="M16 13H8" />
                  <path d="M16 17H8" />
                </svg>
              </i>
              <b>eOffice</b>
              <em>Apps</em>
            </span>
            <span
              className="mq-item"
              style={{ "--c": "#FBBF24" } as CSSProperties}
            >
              <i>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
              </i>
              <b>ebuild</b>
              <em>Build</em>
            </span>
            <span
              className="mq-item"
              style={{ "--c": "#F472B6" } as CSSProperties}
            >
              <i>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              </i>
              <b>EoStudio</b>
              <em>IDE</em>
            </span>
            <span
              className="mq-item"
              style={{ "--c": "#60A5FA" } as CSSProperties}
            >
              <i>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
                  <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
                  <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
                </svg>
              </i>
              <b>EoSim</b>
              <em>Simulation</em>
            </span>
            <span
              className="mq-item"
              style={{ "--c": "#38BDF8" } as CSSProperties}
            >
              <i>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect width="16" height="16" x="4" y="4" rx="2" />
                  <rect width="6" height="6" x="9" y="9" rx="1" />
                  <path d="M15 2v2" />
                  <path d="M15 20v2" />
                  <path d="M2 15h2" />
                  <path d="M2 9h2" />
                  <path d="M20 15h2" />
                  <path d="M20 9h2" />
                  <path d="M9 2v2" />
                  <path d="M9 20v2" />
                </svg>
              </i>
              <b>eCAD Hardware</b>
              <em>Hardware</em>
            </span>
            <span
              className="mq-item"
              style={{ "--c": "#F59E0B" } as CSSProperties}
            >
              <i>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="6" x2="10" y1="11" y2="11" />
                  <line x1="8" x2="8" y1="9" y2="13" />
                  <line x1="15" x2="15.01" y1="12" y2="12" />
                  <line x1="18" x2="18.01" y1="10" y2="10" />
                  <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" />
                </svg>
              </i>
              <b>Kids Edition</b>
              <em>Education</em>
            </span>
            <span
              className="mq-item"
              style={{ "--c": "#60A5FA" } as CSSProperties}
            >
              <i>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="16" y="16" width="6" height="6" rx="1" />
                  <rect x="2" y="16" width="6" height="6" rx="1" />
                  <rect x="9" y="2" width="6" height="6" rx="1" />
                  <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
                  <path d="M12 12V8" />
                </svg>
              </i>
              <b>eNet</b>
              <em>Planned</em>
            </span>
            <span
              className="mq-item"
              style={{ "--c": "#F59E0B" } as CSSProperties}
            >
              <i>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                </svg>
              </i>
              <b>eSec</b>
              <em>Planned</em>
            </span>
            <span aria-hidden="true" style={{ display: "contents" }}>
              <span
                className="mq-item"
                style={{ "--c": "#F97316" } as CSSProperties}
              >
                <i>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect width="16" height="16" x="4" y="4" rx="2" />
                    <rect width="6" height="6" x="9" y="9" rx="1" />
                    <path d="M15 2v2" />
                    <path d="M15 20v2" />
                    <path d="M2 15h2" />
                    <path d="M2 9h2" />
                    <path d="M20 15h2" />
                    <path d="M20 9h2" />
                    <path d="M9 2v2" />
                    <path d="M9 20v2" />
                  </svg>
                </i>
                <b>EoS Kernel</b>
                <em>Core</em>
              </span>
              <span
                className="mq-item"
                style={{ "--c": "#22D3EE" } as CSSProperties}
              >
                <i>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
                  </svg>
                </i>
                <b>eBoot</b>
                <em>Security</em>
              </span>
              <span
                className="mq-item"
                style={{ "--c": "#A78BFA" } as CSSProperties}
              >
                <i>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </i>
                <b>eIPC</b>
                <em>Platform</em>
              </span>
              <span
                className="mq-item"
                style={{ "--c": "#34D399" } as CSSProperties}
              >
                <i>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
                    <path d="M8.5 2h7" />
                    <path d="M7 16h10" />
                  </svg>
                </i>
                <b>eAI</b>
                <em>AI</em>
              </span>
              <span
                className="mq-item"
                style={{ "--c": "#60A5FA" } as CSSProperties}
              >
                <i>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
                    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
                    <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
                    <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
                    <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
                    <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
                    <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
                    <path d="M6 18a4 4 0 0 1-1.967-.516" />
                    <path d="M19.967 17.484A4 4 0 0 1 18 18" />
                  </svg>
                </i>
                <b>eosllm</b>
                <em>AI</em>
              </span>
              <span
                className="mq-item"
                style={{ "--c": "#F472B6" } as CSSProperties}
              >
                <i>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
                  </svg>
                </i>
                <b>eNI</b>
                <em>Neural</em>
              </span>
              <span
                className="mq-item"
                style={{ "--c": "#22D3EE" } as CSSProperties}
              >
                <i>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <ellipse cx="12" cy="5" rx="9" ry="3" />
                    <path d="M3 5V19A9 3 0 0 0 21 19V5" />
                    <path d="M3 12A9 3 0 0 0 21 12" />
                  </svg>
                </i>
                <b>eDB</b>
                <em>Data</em>
              </span>
              <span
                className="mq-item"
                style={{ "--c": "#F97316" } as CSSProperties}
              >
                <i>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
                    <path d="M12 22V12" />
                    <path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7" />
                    <path d="m7.5 4.27 9 5.15" />
                  </svg>
                </i>
                <b>eApps</b>
                <em>Apps</em>
              </span>
              <span
                className="mq-item"
                style={{ "--c": "#A78BFA" } as CSSProperties}
              >
                <i>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                    <path d="M2 12h20" />
                  </svg>
                </i>
                <b>eBrowser</b>
                <em>UI</em>
              </span>
              <span
                className="mq-item"
                style={{ "--c": "#34D399" } as CSSProperties}
              >
                <i>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                    <path d="M10 9H8" />
                    <path d="M16 13H8" />
                    <path d="M16 17H8" />
                  </svg>
                </i>
                <b>eOffice</b>
                <em>Apps</em>
              </span>
              <span
                className="mq-item"
                style={{ "--c": "#FBBF24" } as CSSProperties}
              >
                <i>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                </i>
                <b>ebuild</b>
                <em>Build</em>
              </span>
              <span
                className="mq-item"
                style={{ "--c": "#F472B6" } as CSSProperties}
              >
                <i>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                </i>
                <b>EoStudio</b>
                <em>IDE</em>
              </span>
              <span
                className="mq-item"
                style={{ "--c": "#60A5FA" } as CSSProperties}
              >
                <i>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
                    <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
                    <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
                  </svg>
                </i>
                <b>EoSim</b>
                <em>Simulation</em>
              </span>
              <span
                className="mq-item"
                style={{ "--c": "#38BDF8" } as CSSProperties}
              >
                <i>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect width="16" height="16" x="4" y="4" rx="2" />
                    <rect width="6" height="6" x="9" y="9" rx="1" />
                    <path d="M15 2v2" />
                    <path d="M15 20v2" />
                    <path d="M2 15h2" />
                    <path d="M2 9h2" />
                    <path d="M20 15h2" />
                    <path d="M20 9h2" />
                    <path d="M9 2v2" />
                    <path d="M9 20v2" />
                  </svg>
                </i>
                <b>eCAD Hardware</b>
                <em>Hardware</em>
              </span>
              <span
                className="mq-item"
                style={{ "--c": "#F59E0B" } as CSSProperties}
              >
                <i>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="6" x2="10" y1="11" y2="11" />
                    <line x1="8" x2="8" y1="9" y2="13" />
                    <line x1="15" x2="15.01" y1="12" y2="12" />
                    <line x1="18" x2="18.01" y1="10" y2="10" />
                    <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" />
                  </svg>
                </i>
                <b>Kids Edition</b>
                <em>Education</em>
              </span>
              <span
                className="mq-item"
                style={{ "--c": "#60A5FA" } as CSSProperties}
              >
                <i>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="16" y="16" width="6" height="6" rx="1" />
                    <rect x="2" y="16" width="6" height="6" rx="1" />
                    <rect x="9" y="2" width="6" height="6" rx="1" />
                    <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
                    <path d="M12 12V8" />
                  </svg>
                </i>
                <b>eNet</b>
                <em>Planned</em>
              </span>
              <span
                className="mq-item"
                style={{ "--c": "#F59E0B" } as CSSProperties}
              >
                <i>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                  </svg>
                </i>
                <b>eSec</b>
                <em>Planned</em>
              </span>
            </span>
          </div>{" "}
        </div>{" "}
        <section
          className="hp-band hp-stats"
          aria-label="Key statistics"
          data-reveal=""
        >
          {" "}
          <div className="hp-wrap">
            {" "}
            <div className="hp-grid g6" data-stagger="">
              <div
                className="hp-stat"
                style={{ "--c": "#F97316" } as CSSProperties}
              >
                <span className="dot" />
                <b data-n={REPO_COUNT}>{REPO_COUNT}</b>
                <span>Repositories</span>
              </div>
              <div
                className="hp-stat"
                style={{ "--c": "#22D3EE" } as CSSProperties}
              >
                <span className="dot" />
                <b data-n={BOARD_COUNT}>{BOARD_COUNT}</b>
                <span>Boards</span>
              </div>
              <div
                className="hp-stat"
                style={{ "--c": "#A78BFA" } as CSSProperties}
              >
                <span className="dot" />
                <b data-n="300">300</b>
                <i>+</i>
                <span>APIs</span>
              </div>
              <div
                className="hp-stat"
                style={{ "--c": "#34D399" } as CSSProperties}
              >
                <span className="dot" />
                <b data-n="60">60</b>
                <i>+</i>
                <span>Apps</span>
              </div>
              <div
                className="hp-stat"
                style={{ "--c": "#F59E0B" } as CSSProperties}
              >
                <span className="dot" />
                <b data-n="4">4</b>
                <span>Health devices</span>
              </div>
              <div
                className="hp-stat"
                style={{ "--c": "#60A5FA" } as CSSProperties}
              >
                <span className="dot" />
                <b data-n="14">14</b>
                <span>Books</span>
              </div>
            </div>{" "}
          </div>{" "}
        </section>{" "}
        <section
          className="hp-sec"
          id="board-map"
          aria-labelledby="hp-map"
          data-reveal=""
        >
          {" "}
          <div className="hp-wrap">
            {" "}
            <div className="hp-head center">
              {" "}
              <span
                className="hp-badge"
                style={{ "--c": "#FDBA74" } as CSSProperties}
                data-fade=""
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect width="16" height="16" x="4" y="4" rx="2" />
                  <rect width="6" height="6" x="9" y="9" rx="1" />
                  <path d="M15 2v2" />
                  <path d="M15 20v2" />
                  <path d="M2 15h2" />
                  <path d="M2 9h2" />
                  <path d="M20 15h2" />
                  <path d="M20 9h2" />
                  <path d="M9 2v2" />
                  <path d="M9 20v2" />
                </svg>
                {" The board, part by part"}
              </span>{" "}
              <h2 id="hp-map" data-split="">
                Every component, and the bus that reaches it
              </h2>{" "}
              <p data-fade="">
                Click or tap any part. U1 runs EoS; every other part hangs off
                its own bus, and each says how EoS uses it today. The board is
                illustrative; the statuses come from the code.
              </p>{" "}
            </div>{" "}
            <div className="hp-map">
              {" "}
              <div className="hp-board" data-fade="">
                {" "}
                <svg
                  viewBox="0 0 1000 720"
                  role="group"
                  aria-label="Board map: click a part for details"
                >
                  {" "}
                  <defs>
                    <pattern
                      id="hp-grid"
                      width="40"
                      height="40"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        className="grid"
                        d="M 40 0 L 0 0 0 40"
                        fill="none"
                      />
                    </pattern>
                  </defs>{" "}
                  <rect
                    x="4"
                    y="4"
                    width="992"
                    height="712"
                    rx="18"
                    fill="url(#hp-grid)"
                  />{" "}
                  <rect
                    className="edge"
                    x="14"
                    y="14"
                    width="972"
                    height="692"
                    rx="14"
                  />{" "}
                  <g className="traces" />
                  <g className="holes" />
                  <g className="parts" />
                  <g className="pulses" />{" "}
                  <text className="silk" x="560" y="702">
                    EMBEDDEDOS · EoS REFERENCE · REV A
                  </text>{" "}
                </svg>{" "}
              </div>{" "}
              <aside className="hp-detail" aria-live="polite" data-fade="">
                {" "}
                <span className="ref" /> <h3 /> <p className="bus" />{" "}
                <p className="what" />{" "}
                <div className="eos">
                  <i>EoS</i>
                  <span />
                </div>{" "}
                <span className="hp-pill st-pill" />{" "}
              </aside>{" "}
            </div>{" "}
            <div
              className="hp-parts"
              role="group"
              aria-label="All parts"
            />{" "}
          </div>{" "}
        </section>{" "}
        <section
          className="hp-sec hp-band"
          aria-labelledby="hp-mission"
          data-reveal=""
        >
          {" "}
          <div className="hp-wrap">
            {" "}
            <div className="hp-head center">
              {" "}
              <span className="hp-badge" data-fade="">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
                {" Our Mission"}
              </span>{" "}
              <h2 id="hp-mission" data-split="">
                Embedded computing should be free to learn and free to build on
              </h2>{" "}
              <p data-fade="">
                The Embedded Operating Systems Research Foundation is a
                501(c)(3) public charity (EIN 41-4821627). We exist to advance
                open-source embedded systems research, education, and technology
                for the public benefit, accountable to our community, not to
                shareholders. Every line of code we publish is MIT licensed and
                free, forever.
              </p>{" "}
            </div>{" "}
            <div className="hp-grid g3" data-stagger="">
              {" "}
              <div className="hp-cell">
                <div
                  className="hp-card"
                  style={{ "--c": "#F97316" } as CSSProperties}
                >
                  <span className="hp-ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="16 18 22 12 16 6" />
                      <polyline points="8 6 2 12 8 18" />
                    </svg>
                  </span>
                  <h3>Open-source software, permanently free</h3>
                  <p>
                    The kernel, bootloader, drivers, build tools, and every
                    application we ship are MIT licensed and developed in public
                    on GitHub. No paid tiers, no license fees, no vendor
                    lock-in.
                  </p>
                </div>
              </div>{" "}
              <div className="hp-cell">
                <div
                  className="hp-card"
                  style={{ "--c": "#22D3EE" } as CSSProperties}
                >
                  <span className="hp-ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                      <path d="M9 18h6" />
                      <path d="M10 22h4" />
                    </svg>
                  </span>
                  <h3>Free education for engineers and students</h3>
                  <p>
                    14 full-length technical books, free certification exams, a
                    Kids Edition for classrooms, and paid internships for
                    students and new graduates, all at no cost to learners.
                  </p>
                </div>
              </div>{" "}
              <div className="hp-cell">
                <div
                  className="hp-card"
                  style={{ "--c": "#A78BFA" } as CSSProperties}
                >
                  <span className="hp-ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M6 18h8" />
                      <path d="M3 22h18" />
                      <path d="M14 22a7 7 0 1 0 0-14h-1" />
                      <path d="M9 14h2" />
                      <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" />
                      <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
                    </svg>
                  </span>
                  <h3>Public-benefit research</h3>
                  <p>
                    We publish our research openly, including patent filings for
                    health-monitoring hardware, so that clinicians,
                    universities, and other nonprofits can build on the work
                    rather than license it.
                  </p>
                </div>
              </div>{" "}
            </div>{" "}
            <div
              className="hp-actions center"
              style={{ marginTop: "40px" }}
              data-fade=""
            >
              {" "}
              <Link className="hp-btn primary" href="/donate">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
                {" Make a Donation"}
              </Link>{" "}
              <Link className="hp-btn ghost" href="/get-involved">
                {"Volunteer or Contribute "}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>{" "}
              <Link className="hp-btn ghost" href="/mission">
                {"Our Mission & Scope "}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>{" "}
              <Link className="hp-btn ghost" href="/about">
                About the Foundation
              </Link>{" "}
            </div>{" "}
          </div>{" "}
        </section>{" "}
        <section className="hp-sec" aria-labelledby="hp-stack" data-reveal="">
          {" "}
          <div className="hp-wrap">
            {" "}
            <div className="hp-head center">
              {" "}
              <span
                className="hp-badge"
                style={{ "--c": "#22D3EE" } as CSSProperties}
                data-fade=""
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
                  <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
                  <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
                </svg>
                {" Architecture and maturity"}
              </span>{" "}
              <h2 id="hp-stack" data-split="">
                An Illustrative Reference Architecture
              </h2>{" "}
              <p data-fade="">
                Seven layers, the same ones you scrolled through, each with what
                is built and tested and what is still planned. Illustrative
                reference only. Individual projects and integrations have
                different maturity levels; planned elements are not yet
                available products.
              </p>{" "}
            </div>{" "}
            <div className="hp-stack">
              {" "}
              <div className="hp-rail" aria-hidden="true">
                <span className="hp-dot" />
              </div>{" "}
              <div className="hp-layers">
                {" "}
                <div
                  className="hp-layer"
                  style={{ "--c": "#fbbf24" } as CSSProperties}
                >
                  <h3>eBoot</h3>
                  <p>
                    Two-stage secure boot: Ed25519 + SHA-512 image check, A/B
                    slots and recovery. Host-tested; key storage needs board
                    hooks.
                  </p>
                  <div className="hp-chips">
                    <span className="hp-pill s-work">Working</span>
                    <span className="hp-pill s-docs">Keys: board hooks</span>
                  </div>
                </div>{" "}
                <div
                  className="hp-layer"
                  style={{ "--c": "#34d399" } as CSSProperties}
                >
                  <h3>EoS HAL</h3>
                  <p>
                    One driver API on every target. The dispatch layer, GPIO on
                    Linux and the devicetree parser work; 28 extended classes
                    are stubs.
                  </p>
                  <div className="hp-chips">
                    <span className="hp-pill s-work">Dispatch</span>
                    <span className="hp-pill s-docs">28 stubs</span>
                  </div>
                </div>{" "}
                <div
                  className="hp-layer"
                  style={{ "--c": "#34d399" } as CSSProperties}
                >
                  <h3>EoS kernel</h3>
                  <p>
                    Priority scheduler, priority-inheritance mutexes,
                    semaphores, events, queues and a validated heap. 45 CTest
                    suites on hosts.
                  </p>
                  <div className="hp-chips">
                    <span className="hp-pill s-work">Working</span>
                  </div>
                </div>{" "}
                <div
                  className="hp-layer"
                  style={{ "--c": "#34d399" } as CSSProperties}
                >
                  <h3>EoS services</h3>
                  <p>
                    18 libraries: motor and sensor control, OTA, crypto,
                    networking, files and debug. Flash writes and an MCU network
                    stack are planned.
                  </p>
                  <div className="hp-chips">
                    <span className="hp-pill s-code">In code</span>
                    <span className="hp-pill s-plan">Some planned</span>
                  </div>
                </div>{" "}
                <div
                  className="hp-layer"
                  style={{ "--c": "#22d3ee" } as CSSProperties}
                >
                  <h3>eIPC · eDB</h3>
                  <p>
                    Authenticated messages between services and devices; a
                    multi-model data store with 38 endpoints. Both are working
                    prototypes.
                  </p>
                  <div className="hp-chips">
                    <span className="hp-pill s-work">Prototypes</span>
                  </div>
                </div>{" "}
                <div
                  className="hp-layer"
                  style={{ "--c": "#f97316" } as CSSProperties}
                >
                  <h3>Apps</h3>
                  <p>
                    The eApps catalogue (124 entries), the eBrowser engine and
                    11 eOffice apps; packages install as verified .eapp files.
                    Many apps are templates.
                  </p>
                  <div className="hp-chips">
                    <span className="hp-pill s-code">In code</span>
                    <span className="hp-pill s-docs">Templates</span>
                  </div>
                </div>{" "}
                <div
                  className="hp-layer"
                  style={{ "--c": "#a78bfa" } as CSSProperties}
                >
                  <h3>On-device AI</h3>
                  <p>
                    eosllm runs models with three real back ends; eNI works in
                    simulation; eAI's runtimes are placeholders today.
                  </p>
                  <div className="hp-chips">
                    <span className="hp-pill s-work">eosllm</span>
                    <span className="hp-pill s-docs">eAI runtimes</span>
                  </div>
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </section>{" "}
        <section
          className="hp-sec hp-band"
          aria-labelledby="hp-eco"
          data-reveal=""
        >
          {" "}
          <div className="hp-wrap">
            {" "}
            <div className="hp-head center">
              {" "}
              <span className="hp-badge" data-fade="">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
                  <path d="M12 22V12" />
                  <path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7" />
                  <path d="m7.5 4.27 9 5.15" />
                </svg>
                {" The ecosystem"}
              </span>{" "}
              <h2 id="hp-eco" data-split="">
                The Complete Embedded Ecosystem
              </h2>{" "}
              <p data-fade="">
                Every component you need to build, deploy and manage embedded
                systems, each described as it stands in its repository today.
              </p>{" "}
            </div>{" "}
            <div className="hp-grid g4" data-stagger="" data-grid="">
              {" "}
              <div className="hp-cell">
                <div
                  className="hp-card"
                  style={{ "--c": "#F97316" } as CSSProperties}
                >
                  <span className="hp-ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect width="16" height="16" x="4" y="4" rx="2" />
                      <rect width="6" height="6" x="9" y="9" rx="1" />
                      <path d="M15 2v2" />
                      <path d="M15 20v2" />
                      <path d="M2 15h2" />
                      <path d="M2 9h2" />
                      <path d="M20 15h2" />
                      <path d="M20 9h2" />
                      <path d="M9 2v2" />
                      <path d="M9 20v2" />
                    </svg>
                  </span>
                  <h3>
                    {"EoS kernel "}
                    <span className="hp-pill s-work">Working</span>
                  </h3>
                  <p>
                    Real-time kernel with priority scheduling, sync and queues;
                    tested on hosts.
                  </p>
                </div>
              </div>{" "}
              <div className="hp-cell">
                <div
                  className="hp-card"
                  style={{ "--c": "#22D3EE" } as CSSProperties}
                >
                  <span className="hp-ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
                    </svg>
                  </span>
                  <h3>
                    {"eBoot "}
                    <span className="hp-pill s-work">Working</span>
                  </h3>
                  <p>
                    Signed two-stage boot with A/B slots and recovery; not yet
                    booted on hardware.
                  </p>
                </div>
              </div>{" "}
              <div className="hp-cell">
                <div
                  className="hp-card"
                  style={{ "--c": "#A78BFA" } as CSSProperties}
                >
                  <span className="hp-ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </span>
                  <h3>
                    {"eIPC "}
                    <span className="hp-pill s-code">Prototype</span>
                  </h3>
                  <p>
                    Authenticated messages between processes and devices; Go
                    core and a C SDK.
                  </p>
                </div>
              </div>{" "}
              <div className="hp-cell">
                <div
                  className="hp-card"
                  style={{ "--c": "#34D399" } as CSSProperties}
                >
                  <span className="hp-ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
                      <path d="M8.5 2h7" />
                      <path d="M7 16h10" />
                    </svg>
                  </span>
                  <h3>
                    {"eAI "}
                    <span className="hp-pill s-docs">Framework</span>
                  </h3>
                  <p>
                    The on-device AI layer; its model runtimes are placeholders
                    today.
                  </p>
                </div>
              </div>{" "}
              <div className="hp-cell">
                <div
                  className="hp-card"
                  style={{ "--c": "#60A5FA" } as CSSProperties}
                >
                  <span className="hp-ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
                      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
                      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
                      <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
                      <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
                      <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
                      <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
                      <path d="M6 18a4 4 0 0 1-1.967-.516" />
                      <path d="M19.967 17.484A4 4 0 0 1 18 18" />
                    </svg>
                  </span>
                  <h3>
                    {"eosllm "}
                    <span className="hp-pill s-work">Working</span>
                  </h3>
                  <p>
                    Runs language models on the device with three real back
                    ends; 160 tests.
                  </p>
                </div>
              </div>{" "}
              <div className="hp-cell">
                <div
                  className="hp-card"
                  style={{ "--c": "#22D3EE" } as CSSProperties}
                >
                  <span className="hp-ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <ellipse cx="12" cy="5" rx="9" ry="3" />
                      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
                      <path d="M3 12A9 3 0 0 0 21 12" />
                    </svg>
                  </span>
                  <h3>
                    {"eDB "}
                    <span className="hp-pill s-code">Prototype</span>
                  </h3>
                  <p>
                    Multi-model data store: five models, 38 endpoints, 42
                    passing tests.
                  </p>
                </div>
              </div>{" "}
              <div className="hp-cell">
                <div
                  className="hp-card"
                  style={{ "--c": "#A78BFA" } as CSSProperties}
                >
                  <span className="hp-ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                      <path d="M2 12h20" />
                    </svg>
                  </span>
                  <h3>
                    {"eBrowser "}
                    <span className="hp-pill s-code">Engine</span>
                  </h3>
                  <p>
                    Browser engine for embedded displays; JavaScript and the
                    sandbox are planned.
                  </p>
                </div>
              </div>{" "}
              <div className="hp-cell">
                <div
                  className="hp-card"
                  style={{ "--c": "#34D399" } as CSSProperties}
                >
                  <span className="hp-ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                      <path d="M10 9H8" />
                      <path d="M16 13H8" />
                      <path d="M16 17H8" />
                    </svg>
                  </span>
                  <h3>
                    {"eOffice "}
                    <span className="hp-pill s-code">Prototype</span>
                  </h3>
                  <p>11 office apps with 741 tests.</p>
                </div>
              </div>{" "}
              <div className="hp-cell">
                <div
                  className="hp-card"
                  style={{ "--c": "#F97316" } as CSSProperties}
                >
                  <span className="hp-ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
                      <path d="M12 22V12" />
                      <path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7" />
                      <path d="m7.5 4.27 9 5.15" />
                    </svg>
                  </span>
                  <h3>
                    {"eApps "}
                    <span className="hp-pill s-code">Catalogue</span>
                  </h3>
                  <p>124 catalogue entries; many apps are templates.</p>
                </div>
              </div>{" "}
              <div className="hp-cell">
                <div
                  className="hp-card"
                  style={{ "--c": "#FBBF24" } as CSSProperties}
                >
                  <span className="hp-ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                    </svg>
                  </span>
                  <h3>
                    {"ebuild "}
                    <span className="hp-pill s-work">Working</span>
                  </h3>
                  <p>
                    One CLI to create, build, flash and simulate; knows 171
                    MCUs, 826 tests.
                  </p>
                </div>
              </div>{" "}
              <div className="hp-cell">
                <div
                  className="hp-card"
                  style={{ "--c": "#F472B6" } as CSSProperties}
                >
                  <span className="hp-ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="16 18 22 12 16 6" />
                      <polyline points="8 6 2 12 8 18" />
                    </svg>
                  </span>
                  <h3>
                    {"EoStudio "}
                    <span className="hp-pill s-docs">7 of 13</span>
                  </h3>
                  <p>
                    Design studio and IDE: 7 of its 13 editors are real; 40 code
                    generators.
                  </p>
                </div>
              </div>{" "}
              <div className="hp-cell">
                <div
                  className="hp-card"
                  style={{ "--c": "#60A5FA" } as CSSProperties}
                >
                  <span className="hp-ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
                      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
                      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
                    </svg>
                  </span>
                  <h3>
                    {"EoSim "}
                    <span className="hp-pill s-work">Working</span>
                  </h3>
                  <p>Simulator with 153 platforms and 2,117 passing tests.</p>
                </div>
              </div>{" "}
            </div>{" "}
            <div
              className="hp-actions center"
              style={{ marginTop: "32px" }}
              data-fade=""
            >
              {" "}
              <Link className="hp-btn ghost" href="/projects">
                {"All Projects "}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>{" "}
              <Link className="hp-btn ghost" href="/eapps">
                {"All Apps "}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>{" "}
            </div>{" "}
          </div>{" "}
        </section>{" "}
        <section className="hp-sec" aria-labelledby="hp-health" data-reveal="">
          {" "}
          <div className="hp-wrap">
            {" "}
            <div className="hp-head center">
              {" "}
              <span
                className="hp-badge"
                style={{ "--c": "#F472B6" } as CSSProperties}
                data-fade=""
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
                {" Health Technology"}
              </span>{" "}
              <h2 id="hp-health" data-split="">
                4 Health Devices · 2 Patents Pending
              </h2>{" "}
              <p data-fade="">
                In-development open hardware designs for health-monitoring
                research. Physical reliability and clinical validation are
                pending.
              </p>{" "}
            </div>{" "}
            <div className="hp-grid g4" data-stagger="">
              {" "}
              <div className="hp-cell">
                <div
                  className="hp-card"
                  style={{ "--c": "#F472B6" } as CSSProperties}
                >
                  <span className="hp-ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
                    </svg>
                  </span>
                  <h3>HEALTH-KEY ULTRA</h3>
                  <p>
                    A USB-C research design for exploring ECG, blood-oxygen,
                    breath-alcohol, temperature, UV and motion sensing.
                    Validation is pending.
                  </p>
                </div>
              </div>{" "}
              <div className="hp-cell">
                <div
                  className="hp-card"
                  style={{ "--c": "#A78BFA" } as CSSProperties}
                >
                  <span className="hp-ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="6" />
                      <polyline points="12 10 12 12 13 13" />
                      <path d="m16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05" />
                      <path d="m7.88 16.36.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05" />
                    </svg>
                  </span>
                  <h3>HEALTH-BAND Neuro</h3>
                  <p>
                    A wristband research design for sEMG gesture studies,
                    biometric sensing and TENS exploration. No therapeutic
                    benefit is claimed.
                  </p>
                </div>
              </div>{" "}
              <div className="hp-cell">
                <div
                  className="hp-card"
                  style={{ "--c": "#22D3EE" } as CSSProperties}
                >
                  <span className="hp-ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
                      <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
                      <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
                      <path d="M2 12a10 10 0 0 1 18-6" />
                      <path d="M2 16h.01" />
                      <path d="M21.8 16c.2-2 .131-5.354 0-6" />
                      <path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" />
                      <path d="M8.65 22c.21-.66.45-1.32.57-2" />
                      <path d="M9 6.8a6 6 0 0 1 9 5.2v2" />
                    </svg>
                  </span>
                  <h3>HEALTH-RING</h3>
                  <p>
                    A concept ring for researching optical and electrical
                    sensing. Clinical measurement has not been validated.
                  </p>
                </div>
              </div>{" "}
              <div className="hp-cell">
                <div
                  className="hp-card"
                  style={{ "--c": "#34D399" } as CSSProperties}
                >
                  <span className="hp-ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M6 18h8" />
                      <path d="M3 22h18" />
                      <path d="M14 22a7 7 0 1 0 0-14h-1" />
                      <path d="M9 14h2" />
                      <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" />
                      <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
                    </svg>
                  </span>
                  <h3>HEALTH-LAB</h3>
                  <p>
                    A biosensor patch concept for health-monitoring research.
                  </p>
                </div>
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </section>{" "}
        <section
          className="hp-sec hp-band"
          aria-labelledby="hp-hw"
          data-reveal=""
        >
          {" "}
          <div className="hp-wrap">
            {" "}
            <div className="hp-head" style={{ marginBottom: "0" }}>
              {" "}
              <span
                className="hp-badge"
                style={{ "--c": "#38BDF8" } as CSSProperties}
                data-fade=""
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect width="16" height="16" x="4" y="4" rx="2" />
                  <rect width="6" height="6" x="9" y="9" rx="1" />
                  <path d="M15 2v2" />
                  <path d="M15 20v2" />
                  <path d="M2 15h2" />
                  <path d="M2 9h2" />
                  <path d="M20 15h2" />
                  <path d="M20 9h2" />
                  <path d="M9 2v2" />
                  <path d="M9 20v2" />
                </svg>
                {" Open Hardware"}
              </span>{" "}
              <h2 id="hp-hw" data-split="">
                eCAD Hardware · 18 domains, 292 models
              </h2>{" "}
              <p data-fade="">
                Open designs from smart rings to a tilt-rotor eVTOL, in 125
                product lines. Every one is at design stage with a datasheet,
                and most add a bill of materials and a power simulation. A
                dev-board CAD database adds 322 reference boards, 186 of them
                verified.
              </p>{" "}
              <div className="hp-actions" data-fade="">
                <Link className="hp-btn ghost" href="/ecad-hardware">
                  {"View all eCAD Hardware "}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </section>{" "}
        <section className="hp-sec" aria-labelledby="hp-why" data-reveal="">
          {" "}
          <div className="hp-wrap">
            {" "}
            <div className="hp-head center">
              {" "}
              <span className="hp-badge" data-fade="">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                  <path d="M20 3v4" />
                  <path d="M22 5h-4" />
                  <path d="M4 17v2" />
                  <path d="M5 18H3" />
                </svg>
                {" Why EmbeddedOS"}
              </span>{" "}
              <h2 id="hp-why" data-split="">
                The Operating System for Every Device
              </h2>{" "}
              <p data-fade="">
                Built by embedded engineers, for any embedded hardware. Every
                design decision prioritizes reliability, security, and developer
                experience.
              </p>{" "}
            </div>{" "}
            <div className="hp-grid g3" data-stagger="">
              {" "}
              <div className="hp-cell">
                <div
                  className="hp-card"
                  style={{ "--c": "#F97316" } as CSSProperties}
                >
                  <span className="hp-ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="4 17 10 11 4 5" />
                      <line x1="12" x2="20" y1="19" y2="19" />
                    </svg>
                  </span>
                  <h3>Real-Time Scheduling</h3>
                  <p>
                    Priority-driven scheduling with priority inheritance; timing
                    is characterized per target.
                  </p>
                </div>
              </div>{" "}
              <div className="hp-cell">
                <div
                  className="hp-card"
                  style={{ "--c": "#22D3EE" } as CSSProperties}
                >
                  <span className="hp-ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <h3>Signed From the First Instruction</h3>
                  <p>
                    Ed25519-signed boot and authenticated messages; hardware key
                    storage needs board hooks.
                  </p>
                </div>
              </div>{" "}
              <div className="hp-cell">
                <div
                  className="hp-card"
                  style={{ "--c": "#34D399" } as CSSProperties}
                >
                  <span className="hp-ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 20h.01" />
                      <path d="M2 8.82a15 15 0 0 1 20 0" />
                      <path d="M5 12.859a10 10 0 0 1 14 0" />
                      <path d="M8.5 16.429a5 5 0 0 1 7 0" />
                    </svg>
                  </span>
                  <h3>Connectivity, Honestly</h3>
                  <p>
                    Wi-Fi, BLE, Ethernet and CAN are defined in the HAL; sockets
                    work on hosts and MCU stacks are planned.
                  </p>
                </div>
              </div>{" "}
              <div className="hp-cell">
                <div
                  className="hp-card"
                  style={{ "--c": "#A78BFA" } as CSSProperties}
                >
                  <span className="hp-ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="16 18 22 12 16 6" />
                      <polyline points="8 6 2 12 8 18" />
                    </svg>
                  </span>
                  <h3>Developer Friendly</h3>
                  <p>
                    ebuild, EoStudio and EoSim, 14 technical books,
                    documentation and free certification.
                  </p>
                </div>
              </div>{" "}
              <div className="hp-cell">
                <div
                  className="hp-card"
                  style={{ "--c": "#FBBF24" } as CSSProperties}
                >
                  <span className="hp-ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
                      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
                      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
                    </svg>
                  </span>
                  <h3>Modular Architecture</h3>
                  <p>
                    Use only what you need, from the bare kernel to the full
                    application stack.
                  </p>
                </div>
              </div>{" "}
              <div className="hp-cell">
                <div
                  className="hp-card"
                  style={{ "--c": "#60A5FA" } as CSSProperties}
                >
                  <span className="hp-ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect width="16" height="16" x="4" y="4" rx="2" />
                      <rect width="6" height="6" x="9" y="9" rx="1" />
                      <path d="M15 2v2" />
                      <path d="M15 20v2" />
                      <path d="M2 15h2" />
                      <path d="M2 9h2" />
                      <path d="M20 15h2" />
                      <path d="M20 9h2" />
                      <path d="M9 2v2" />
                      <path d="M9 20v2" />
                    </svg>
                  </span>
                  <h3>Broad Hardware Coverage</h3>
                  <p>
                    {BOARD_COUNT}
                    {
                      " board descriptors across 55 architectures. Maturity varies by target; a descriptor is not a validated port."
                    }
                  </p>
                </div>
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </section>{" "}
        <section
          className="hp-sec hp-band"
          aria-labelledby="hp-comm"
          data-reveal=""
        >
          {" "}
          <div className="hp-wrap hp-split">
            {" "}
            <div className="hp-head" style={{ marginBottom: "0" }}>
              {" "}
              <span className="hp-badge" data-fade="">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                {" Foundation Community"}
              </span>{" "}
              <h2 id="hp-comm" data-split="">
                Built by the Community, for the Community
              </h2>{" "}
              <p data-fade="">
                EmbeddedOS is a 501(c)(3), community-driven project, built by
                embedded engineers for any embedded hardware. Every line of
                code, every document, and every tool prioritizes reliability,
                security, and developer experience.
              </p>{" "}
              <div className="hp-actions" data-fade="">
                <Link className="hp-btn primary" href="/get-involved">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                  {" Get Involved"}
                </Link>
                <a
                  className="hp-btn ghost"
                  href="https://github.com/embeddedos-org"
                  target="_blank"
                  rel="noopener"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                  {" Star on GitHub"}
                </a>
              </div>{" "}
            </div>{" "}
            <div
              className="hp-grid"
              style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}
              data-stagger=""
            >
              {" "}
              <div className="hp-cell">
                <div
                  className="hp-card"
                  style={{ "--c": "#34D399" } as CSSProperties}
                >
                  <span className="hp-ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                      <path d="M9 18c-4.51 2-5-2-7-2" />
                    </svg>
                  </span>
                  <h3>25 repositories in public</h3>
                  <p>Developed openly on GitHub, 23 of them MIT licensed.</p>
                </div>
              </div>{" "}
              <div className="hp-cell">
                <div
                  className="hp-card"
                  style={{ "--c": "#F97316" } as CSSProperties}
                >
                  <span className="hp-ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 7v14" />
                      <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
                    </svg>
                  </span>
                  <h3>14 books to learn from</h3>
                  <p>Full-length technical books, free for everyone.</p>
                </div>
              </div>{" "}
              <div className="hp-cell">
                <div
                  className="hp-card"
                  style={{ "--c": "#22D3EE" } as CSSProperties}
                >
                  <span className="hp-ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                    </svg>
                  </span>
                  <h3>10 fuzz harnesses</h3>
                  <p>Plus CodeQL and Scorecard across the organisation.</p>
                </div>
              </div>{" "}
              <div className="hp-cell">
                <div
                  className="hp-card"
                  style={{ "--c": "#A78BFA" } as CSSProperties}
                >
                  <span className="hp-ic">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                      <path d="M20 3v4" />
                      <path d="M22 5h-4" />
                      <path d="M4 17v2" />
                      <path d="M5 18H3" />
                    </svg>
                  </span>
                  <h3>Every claim checked</h3>
                  <p>
                    This page says what works, what is partial and what is
                    planned.
                  </p>
                </div>
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </section>{" "}
        <section
          className="hp-sec hp-cta"
          aria-labelledby="hp-cta"
          data-reveal=""
        >
          {" "}
          <span
            className="hp-orb"
            style={{ left: "6%", top: "8%", "--o": "#f97316" } as CSSProperties}
            aria-hidden="true"
          />{" "}
          <span
            className="hp-orb"
            style={
              { right: "8%", top: "28%", "--o": "#22d3ee" } as CSSProperties
            }
            aria-hidden="true"
          />{" "}
          <span
            className="hp-orb"
            style={
              {
                left: "42%",
                bottom: "-90px",
                "--o": "#a78bfa",
              } as CSSProperties
            }
            aria-hidden="true"
          />{" "}
          <div className="hp-wrap">
            {" "}
            <div className="hp-cta-card">
              {" "}
              <span className="hp-badge" data-fade="">
                Open Source · 501(c)(3) · MIT License
              </span>{" "}
              <h2 id="hp-cta" data-split="">
                Ready to build on EmbeddedOS?
              </h2>{" "}
              <p className="hp-muted" style={{ margin: "0 auto" }} data-fade="">
                Join engineers building the next generation of embedded systems.
                Free, foundation-backed, and 501(c)(3) forever.
              </p>{" "}
              <div
                className="hp-actions center"
                style={{ marginTop: "28px" }}
                data-fade=""
              >
                <Link className="hp-btn primary" href="/getting-started">
                  {"Start Building "}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
                <Link className="hp-btn ghost" href="/docs">
                  Read the Docs
                </Link>
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </section>{" "}
      </div>
    </div>
  );
}
