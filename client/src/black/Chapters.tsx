import type { CSSProperties } from "react";
import { Link } from "wouter";

/**
 * Every industry: the 25 chapters the homepage's 3D story used to carry, as an
 * explorer. The chapter cards and the part cards ("spots") are the story's own
 * markup, moved here unchanged except for what only the 3D stage needed (the
 * "drag to turn it" hints, `inert`, `data-side`) and the heading level (each
 * chapter now sits under this section's h2). Without script every chapter
 * shows in order; with it (mountBlack) the list selects one at a time and its
 * device clip plays. The chapter ids are the story's (`#ch-ehealth365` …), so
 * existing links to a chapter still land on it.
 */
export default function Chapters() {
  return (
    <section className="bk-sec bk-ind" id="industries" aria-labelledby="ind-h">
      <div className="bk-wrap">
        <div className="bk-sec-h bk-split">
          <div>
            <p className="bk-label">eCAD Hardware</p>
            <h2 id="ind-h">One board. Every industry.</h2>
          </div>
          <p className="bk-lead">
            <b>125 product lines and 292 named models</b> across eighteen eCAD
            domains, plus eAgriTech, and a full-body robot built from five of
            them. Pick an industry to see its design and the EoS profile it
            runs.
          </p>
        </div>
        <div className="bk-ix">
          <ol
            className="bk-ix-list"
            role="tablist"
            aria-label="Industries"
            aria-orientation="vertical"
          >
            <li role="presentation">
              <a
                role="tab"
                id="bk-ct-ehealth365"
                href="#ch-ehealth365"
                aria-controls="ch-ehealth365"
                aria-selected={true}
                tabIndex={0}
                style={{ "--c": "#EF4444" } as CSSProperties}
              >
                <span className="n">01</span>
                <span className="dn">eHealth365</span>
                <span className="dh">
                  A ring for vitals, a patch for chemistry
                </span>
              </a>
            </li>
            <li role="presentation">
              <a
                role="tab"
                id="bk-ct-eoshealth"
                href="#ch-eoshealth"
                aria-controls="ch-eoshealth"
                aria-selected={false}
                tabIndex={-1}
                style={{ "--c": "#FB7185" } as CSSProperties}
              >
                <span className="n">02</span>
                <span className="dn">eosHealth</span>
                <span className="dh">A health band on the wrist</span>
              </a>
            </li>
            <li role="presentation">
              <a
                role="tab"
                id="bk-ct-emedical"
                href="#ch-emedical"
                aria-controls="ch-emedical"
                aria-selected={false}
                tabIndex={-1}
                style={{ "--c": "#F472B6" } as CSSProperties}
              >
                <span className="n">03</span>
                <span className="dn">eMedical</span>
                <span className="dh">A 12-lead ECG on battery power</span>
              </a>
            </li>
            <li role="presentation">
              <a
                role="tab"
                id="bk-ct-eradar360"
                href="#ch-eradar360"
                aria-controls="ch-eradar360"
                aria-selected={false}
                tabIndex={-1}
                style={{ "--c": "#F97316" } as CSSProperties}
              >
                <span className="n">04</span>
                <span className="dn">eRadar360</span>
                <span className="dh">360° awareness from the windshield</span>
              </a>
            </li>
            <li role="presentation">
              <a
                role="tab"
                id="bk-ct-etransport"
                href="#ch-etransport"
                aria-controls="ch-etransport"
                aria-selected={false}
                tabIndex={-1}
                style={{ "--c": "#38BDF8" } as CSSProperties}
              >
                <span className="n">05</span>
                <span className="dn">eTransport</span>
                <span className="dh">Charts on the bridge</span>
              </a>
            </li>
            <li role="presentation">
              <a
                role="tab"
                id="bk-ct-epam"
                href="#ch-epam"
                aria-controls="ch-epam"
                aria-selected={false}
                tabIndex={-1}
                style={{ "--c": "#2DD4BF" } as CSSProperties}
              >
                <span className="n">06</span>
                <span className="dn">ePAM</span>
                <span className="dh">A four-seat tilt-rotor</span>
              </a>
            </li>
            <li role="presentation">
              <a
                role="tab"
                id="bk-ct-eaerospace"
                href="#ch-eaerospace"
                aria-controls="ch-eaerospace"
                aria-selected={false}
                tabIndex={-1}
                style={{ "--c": "#22D3EE" } as CSSProperties}
              >
                <span className="n">07</span>
                <span className="dn">eAerospace</span>
                <span className="dh">An inspection drone</span>
              </a>
            </li>
            <li role="presentation">
              <a
                role="tab"
                id="bk-ct-erobotics"
                href="#ch-erobotics"
                aria-controls="ch-erobotics"
                aria-selected={false}
                tabIndex={-1}
                style={{ "--c": "#A78BFA" } as CSSProperties}
              >
                <span className="n">08</span>
                <span className="dn">eRobotics</span>
                <span className="dh">
                  A whole robot, built from five designs
                </span>
              </a>
            </li>
            <li role="presentation">
              <a
                role="tab"
                id="bk-ct-eagritech"
                href="#ch-eagritech"
                aria-controls="ch-eagritech"
                aria-selected={false}
                tabIndex={-1}
                style={{ "--c": "#10B981" } as CSSProperties}
              >
                <span className="n">09</span>
                <span className="dn">eAgriTech</span>
                <span className="dh">A tractor that steers itself</span>
              </a>
            </li>
            <li role="presentation">
              <a
                role="tab"
                id="bk-ct-efrontier"
                href="#ch-efrontier"
                aria-controls="ch-efrontier"
                aria-selected={false}
                tabIndex={-1}
                style={{ "--c": "#C084FC" } as CSSProperties}
              >
                <span className="n">10</span>
                <span className="dn">eFrontier</span>
                <span className="dh">A robot arm for space</span>
              </a>
            </li>
            <li role="presentation">
              <a
                role="tab"
                id="bk-ct-eindustrial"
                href="#ch-eindustrial"
                aria-controls="ch-eindustrial"
                aria-selected={false}
                tabIndex={-1}
                style={{ "--c": "#34D399" } as CSSProperties}
              >
                <span className="n">11</span>
                <span className="dn">eIndustrial</span>
                <span className="dh">A controller for the plant floor</span>
              </a>
            </li>
            <li role="presentation">
              <a
                role="tab"
                id="bk-ct-eenergy"
                href="#ch-eenergy"
                aria-controls="ch-eenergy"
                aria-selected={false}
                tabIndex={-1}
                style={{ "--c": "#F59E0B" } as CSSProperties}
              >
                <span className="n">12</span>
                <span className="dn">eEnergy</span>
                <span className="dh">A board that watches every cell</span>
              </a>
            </li>
            <li role="presentation">
              <a
                role="tab"
                id="bk-ct-esmartcity"
                href="#ch-esmartcity"
                aria-controls="ch-esmartcity"
                aria-selected={false}
                tabIndex={-1}
                style={{ "--c": "#60A5FA" } as CSSProperties}
              >
                <span className="n">13</span>
                <span className="dn">eSmartCity</span>
                <span className="dh">Street lights that report back</span>
              </a>
            </li>
            <li role="presentation">
              <a
                role="tab"
                id="bk-ct-emining"
                href="#ch-emining"
                aria-controls="ch-emining"
                aria-selected={false}
                tabIndex={-1}
                style={{ "--c": "#A8A29E" } as CSSProperties}
              >
                <span className="n">14</span>
                <span className="dn">eMining</span>
                <span className="dh">Four gases, one warning</span>
              </a>
            </li>
            <li role="presentation">
              <a
                role="tab"
                id="bk-ct-eedgeai"
                href="#ch-eedgeai"
                aria-controls="ch-eedgeai"
                aria-selected={false}
                tabIndex={-1}
                style={{ "--c": "#818CF8" } as CSSProperties}
              >
                <span className="n">15</span>
                <span className="dn">eEdgeAI</span>
                <span className="dh">Four eyes, one decision</span>
              </a>
            </li>
            <li role="presentation">
              <a
                role="tab"
                id="bk-ct-eelectronics"
                href="#ch-eelectronics"
                aria-controls="ch-eelectronics"
                aria-selected={false}
                tabIndex={-1}
                style={{ "--c": "#FBBF24" } as CSSProperties}
              >
                <span className="n">16</span>
                <span className="dn">eElectronics</span>
                <span className="dh">Down to the silicon</span>
              </a>
            </li>
            <li role="presentation">
              <a
                role="tab"
                id="bk-ct-econsumer"
                href="#ch-econsumer"
                aria-controls="ch-econsumer"
                aria-selected={false}
                tabIndex={-1}
                style={{ "--c": "#8B5CF6" } as CSSProperties}
              >
                <span className="n">17</span>
                <span className="dn">eConsumer</span>
                <span className="dh">One hub for the whole home</span>
              </a>
            </li>
            <li role="presentation">
              <a
                role="tab"
                id="bk-ct-ecybersec"
                href="#ch-ecybersec"
                aria-controls="ch-ecybersec"
                aria-selected={false}
                tabIndex={-1}
                style={{ "--c": "#06B6D4" } as CSSProperties}
              >
                <span className="n">18</span>
                <span className="dn">eCybersecurity</span>
                <span className="dh">A vault for keys</span>
              </a>
            </li>
            <li role="presentation">
              <a
                role="tab"
                id="bk-ct-edefense"
                href="#ch-edefense"
                aria-controls="ch-edefense"
                aria-selected={false}
                tabIndex={-1}
                style={{ "--c": "#9CA3AF" } as CSSProperties}
              >
                <span className="n">19</span>
                <span className="dn">eDefense</span>
                <span className="dh">A computer with no fan to fail</span>
              </a>
            </li>
            <li role="presentation">
              <a
                role="tab"
                id="bk-ct-rbt-wake"
                href="#ch-rbt-wake"
                aria-controls="ch-rbt-wake"
                aria-selected={false}
                tabIndex={-1}
                style={{ "--c": "#34D399" } as CSSProperties}
              >
                <span className="n">20</span>
                <span className="dn">Full-body robot</span>
                <span className="dh">The board docks, and a body wakes up</span>
              </a>
            </li>
            <li role="presentation">
              <a
                role="tab"
                id="bk-ct-rbt-see"
                href="#ch-rbt-see"
                aria-controls="ch-rbt-see"
                aria-selected={false}
                tabIndex={-1}
                style={{ "--c": "#34D399" } as CSSProperties}
              >
                <span className="n">21</span>
                <span className="dn">Full-body robot</span>
                <span className="dh">
                  Two eyes for depth, one laser for the room
                </span>
              </a>
            </li>
            <li role="presentation">
              <a
                role="tab"
                id="bk-ct-rbt-walk"
                href="#ch-rbt-walk"
                aria-controls="ch-rbt-walk"
                aria-selected={false}
                tabIndex={-1}
                style={{ "--c": "#34D399" } as CSSProperties}
              >
                <span className="n">22</span>
                <span className="dn">Full-body robot</span>
                <span className="dh">Walking is a real-time job</span>
              </a>
            </li>
            <li role="presentation">
              <a
                role="tab"
                id="bk-ct-rbt-hands"
                href="#ch-rbt-hands"
                aria-controls="ch-rbt-hands"
                aria-selected={false}
                tabIndex={-1}
                style={{ "--c": "#34D399" } as CSSProperties}
              >
                <span className="n">23</span>
                <span className="dn">Full-body robot</span>
                <span className="dh">Hands that pick, check and place</span>
              </a>
            </li>
            <li role="presentation">
              <a
                role="tab"
                id="bk-ct-rbt-safe"
                href="#ch-rbt-safe"
                aria-controls="ch-rbt-safe"
                aria-selected={false}
                tabIndex={-1}
                style={{ "--c": "#34D399" } as CSSProperties}
              >
                <span className="n">24</span>
                <span className="dn">Full-body robot</span>
                <span className="dh">
                  Stops in one call, updates over the air
                </span>
              </a>
            </li>
            <li role="presentation">
              <a
                role="tab"
                id="bk-ct-every"
                href="#ch-every"
                aria-controls="ch-every"
                aria-selected={false}
                tabIndex={-1}
                style={{ "--c": "#38BDF8" } as CSSProperties}
              >
                <span className="n">25</span>
                <span className="dn">Every industry</span>
                <span className="dh">
                  Eighteen domains, one open collection
                </span>
              </a>
            </li>
          </ol>
          <div className="bk-ix-body">
            <div
              className="bk-chap on"
              id="ch-ehealth365"
              role="tabpanel"
              aria-labelledby="bk-ct-ehealth365"
              style={{ "--c": "#EF4444" } as CSSProperties}
            >
              <figure
                className="bk-chap-media"
                data-clip="/media/industries/d01"
              >
                <picture>
                  <source
                    type="image/avif"
                    srcSet="/media/industries/d01.avif"
                  />
                  <img
                    src="/media/industries/d01.webp"
                    width={1280}
                    height={720}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <video
                  muted
                  playsInline
                  loop
                  preload="none"
                  aria-hidden="true"
                />
              </figure>
              <article
                className="card"
                style={{ "--c": "#EF4444" } as CSSProperties}
              >
                {" "}
                <span className="eyebrow">01 · eHealth365</span>{" "}
                <h3>A ring for vitals, a patch for chemistry</h3>{" "}
                <p className="lead">
                  eHealth365 pairs two wearable designs. The Smart Ring Pro is
                  designed to measure heart rate, HRV, SpO₂, body temperature,
                  sleep stages and activity. The Smart Patch Pro, worn one patch
                  a week, is designed to measure glucose, sweat electrolytes,
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
              </article>{" "}
              <div className="bk-spots">
                <article
                  className="spot"
                  data-spot="ehealth365-design"
                  style={{ "--c": "#EF4444" } as CSSProperties}
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
                    Two wearables, one ring and one patch, each with its own
                    sensors and a shared phone app.
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
                  style={{ "--c": "#34D399" } as CSSProperties}
                  aria-label="How EoS would run it"
                >
                  {" "}
                  <span className="spot-k">EoS · wearable profile</span>{" "}
                  <h3>How EoS would run it</h3>{" "}
                  <div className="chips">
                    <span className="s-code">Profile in eos</span>
                    <span className="s-docs">
                      Not validated on this hardware
                    </span>
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
                        Heart-rate, SpO₂ and temperature samples would pass
                        through the EoS sensor service, whose filtering and
                        calibration are working code.
                      </li>
                      <li>
                        Bluetooth LE to the phone app would use the BLE HAL
                        class, which is a stub today.
                      </li>
                      <li>
                        Updates would land through the OTA service: its A/B
                        state machine and SHA-256 checks are in code, but it
                        does not write flash yet.
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
              </div>
            </div>
            <div
              className="bk-chap"
              id="ch-eoshealth"
              role="tabpanel"
              aria-labelledby="bk-ct-eoshealth"
              style={{ "--c": "#FB7185" } as CSSProperties}
            >
              <figure
                className="bk-chap-media"
                data-clip="/media/industries/d02"
              >
                <picture>
                  <source
                    type="image/avif"
                    srcSet="/media/industries/d02.avif"
                  />
                  <img
                    src="/media/industries/d02.webp"
                    width={1280}
                    height={720}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <video
                  muted
                  playsInline
                  loop
                  preload="none"
                  aria-hidden="true"
                />
              </figure>
              <article
                className="card compact"
                style={{ "--c": "#FB7185" } as CSSProperties}
              >
                {" "}
                <span className="eyebrow">02 · eosHealth</span>{" "}
                <h3>A health band on the wrist</h3>{" "}
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
              </article>{" "}
            </div>
            <div
              className="bk-chap"
              id="ch-emedical"
              role="tabpanel"
              aria-labelledby="bk-ct-emedical"
              style={{ "--c": "#F472B6" } as CSSProperties}
            >
              <figure
                className="bk-chap-media"
                data-clip="/media/industries/d03"
              >
                <picture>
                  <source
                    type="image/avif"
                    srcSet="/media/industries/d03.avif"
                  />
                  <img
                    src="/media/industries/d03.webp"
                    width={1280}
                    height={720}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <video
                  muted
                  playsInline
                  loop
                  preload="none"
                  aria-hidden="true"
                />
              </figure>
              <article
                className="card"
                style={{ "--c": "#F472B6" } as CSSProperties}
              >
                {" "}
                <span className="eyebrow">03 · eMedical</span>{" "}
                <h3>A 12-lead ECG on battery power</h3>{" "}
                <p className="lead">
                  eMedical covers diagnostic, patient-care, surgical and
                  laboratory designs. The eECG-12 design is a battery-powered
                  12-lead ECG with a 7-inch touch display, BLE 5.3 and Wi-Fi 6,
                  designed for eight hours on its battery and to the IEC 60601-1
                  safety standard.
                </p>{" "}
                <p className="fact">
                  <span>
                    From diagnostic_equipment/product_datasheet.md · Design
                    Phase
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
              </article>{" "}
              <div className="bk-spots">
                <article
                  className="spot"
                  data-spot="emedical-design"
                  style={{ "--c": "#F472B6" } as CSSProperties}
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
                    A 12-lead ECG design with a 7-inch 1024 × 600 touch display
                    and a 7.4 V 5000 mAh battery.
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
                  style={{ "--c": "#34D399" } as CSSProperties}
                  aria-label="How EoS would run it"
                >
                  {" "}
                  <span className="spot-k">EoS · medical profile</span>{" "}
                  <h3>How EoS would run it</h3>{" "}
                  <div className="chips">
                    <span className="s-code">Profile in eos</span>
                    <span className="s-docs">
                      Not validated on this hardware
                    </span>
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
                        register code for STM32F4 only, so the STM32H7 here
                        needs its own port.
                      </li>
                      <li>
                        Each lead would be a sensor-service channel with
                        filtering (working code).
                      </li>
                      <li>
                        The os service keeps an audit log and integrity checks,
                        and the security service holds keys and an access list
                        (working code). No EoS build is certified for medical
                        use.
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
              </div>
            </div>
            <div
              className="bk-chap"
              id="ch-eradar360"
              role="tabpanel"
              aria-labelledby="bk-ct-eradar360"
              style={{ "--c": "#F97316" } as CSSProperties}
            >
              <figure
                className="bk-chap-media"
                data-clip="/media/industries/d04"
              >
                <picture>
                  <source
                    type="image/avif"
                    srcSet="/media/industries/d04.avif"
                  />
                  <img
                    src="/media/industries/d04.webp"
                    width={1280}
                    height={720}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <video
                  muted
                  playsInline
                  loop
                  preload="none"
                  aria-hidden="true"
                />
              </figure>
              <article
                className="card compact"
                style={{ "--c": "#F97316" } as CSSProperties}
              >
                {" "}
                <span className="eyebrow">04 · eRadar360</span>{" "}
                <h3>360° awareness from the windshield</h3>{" "}
                <p className="lead">
                  eRadar360 (Aegis One for OEMs) is a windshield-mounted car
                  safety design. It is designed to fuse four sensor types: front
                  and rear 77 GHz FMCW radar, five laser detectors spaced 72°
                  apart for 360° coverage, and V2X radio.
                </p>{" "}
                <p className="fact">
                  <span>From eRadar360_CAD_Design/README.md</span>2× TI AWR2944
                  77 GHz radar · 5× InGaAs APD laser detectors · V2X
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
              </article>{" "}
            </div>
            <div
              className="bk-chap"
              id="ch-etransport"
              role="tabpanel"
              aria-labelledby="bk-ct-etransport"
              style={{ "--c": "#38BDF8" } as CSSProperties}
            >
              <figure
                className="bk-chap-media"
                data-clip="/media/industries/d05"
              >
                <picture>
                  <source
                    type="image/avif"
                    srcSet="/media/industries/d05.avif"
                  />
                  <img
                    src="/media/industries/d05.webp"
                    width={1280}
                    height={720}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <video
                  muted
                  playsInline
                  loop
                  preload="none"
                  aria-hidden="true"
                />
              </figure>
              <article
                className="card compact"
                style={{ "--c": "#38BDF8" } as CSSProperties}
              >
                {" "}
                <span className="eyebrow">05 · eTransport</span>{" "}
                <h3>Charts on the bridge</h3>{" "}
                <p className="lead">
                  eTransport covers automotive, maritime and rail electronics.
                  The eNav-ECDIS design is an electronic chart display for
                  ships, with a 27-inch sunlight-readable display and encrypted
                  S-57/S-63 electronic navigational charts.
                </p>{" "}
                <p className="fact">
                  <span>
                    From maritime_systems/product_datasheet.md · IEC 61174,
                    SOLAS
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
              </article>{" "}
            </div>
            <div
              className="bk-chap"
              id="ch-epam"
              role="tabpanel"
              aria-labelledby="bk-ct-epam"
              style={{ "--c": "#2DD4BF" } as CSSProperties}
            >
              <figure
                className="bk-chap-media"
                data-clip="/media/industries/d06"
              >
                <picture>
                  <source
                    type="image/avif"
                    srcSet="/media/industries/d06.avif"
                  />
                  <img
                    src="/media/industries/d06.webp"
                    width={1280}
                    height={720}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <video
                  muted
                  playsInline
                  loop
                  preload="none"
                  aria-hidden="true"
                />
              </figure>
              <article
                className="card compact"
                style={{ "--c": "#2DD4BF" } as CSSProperties}
              >
                {" "}
                <span className="eyebrow">06 · ePAM</span>{" "}
                <h3>A four-seat tilt-rotor</h3>{" "}
                <p className="lead">
                  ePAM holds personal air and mobility designs: the Urban Drone,
                  a space shuttle avionics board, an eco car and a combo unit.
                  The Urban Drone design is a four-seat tilt-rotor eVTOL, shown
                  here as a scale model.
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
              </article>{" "}
            </div>
            <div
              className="bk-chap"
              id="ch-eaerospace"
              role="tabpanel"
              aria-labelledby="bk-ct-eaerospace"
              style={{ "--c": "#22D3EE" } as CSSProperties}
            >
              <figure
                className="bk-chap-media"
                data-clip="/media/industries/d07"
              >
                <picture>
                  <source
                    type="image/avif"
                    srcSet="/media/industries/d07.avif"
                  />
                  <img
                    src="/media/industries/d07.webp"
                    width={1280}
                    height={720}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <video
                  muted
                  playsInline
                  loop
                  preload="none"
                  aria-hidden="true"
                />
              </figure>
              <article
                className="card"
                style={{ "--c": "#22D3EE" } as CSSProperties}
              >
                {" "}
                <span className="eyebrow">07 · eAerospace</span>{" "}
                <h3>An inspection drone</h3>{" "}
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
              </article>{" "}
              <div className="bk-spots">
                <article
                  className="spot"
                  data-spot="eaerospace-design"
                  style={{ "--c": "#22D3EE" } as CSSProperties}
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
                  style={{ "--c": "#34D399" } as CSSProperties}
                  aria-label="How EoS would run it"
                >
                  {" "}
                  <span className="spot-k">EoS · drone profile</span>{" "}
                  <h3>How EoS would run it</h3>{" "}
                  <div className="chips">
                    <span className="s-code">Profile in eos</span>
                    <span className="s-docs">
                      Not validated on this hardware
                    </span>
                  </div>{" "}
                  <p className="what">
                    Docked here, the core board would boot EoS built with the
                    drone product profile: 23 features switched on, 6 of them
                    services with working code today.
                  </p>{" "}
                  <div className="how">
                    <span>How EoS would work here</span>
                    <ol>
                      <li>
                        Four motors fit inside the motor service's limit of
                        eight: its PID speed loops and trajectories are working
                        code.
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
              </div>
            </div>
            <div
              className="bk-chap"
              id="ch-erobotics"
              role="tabpanel"
              aria-labelledby="bk-ct-erobotics"
              style={{ "--c": "#A78BFA" } as CSSProperties}
            >
              <figure
                className="bk-chap-media"
                data-clip="/media/industries/d08"
              >
                <picture>
                  <source
                    type="image/avif"
                    srcSet="/media/industries/d08.avif"
                  />
                  <img
                    src="/media/industries/d08.webp"
                    width={1280}
                    height={720}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <video
                  muted
                  playsInline
                  loop
                  preload="none"
                  aria-hidden="true"
                />
              </figure>
              <article
                className="card"
                style={{ "--c": "#A78BFA" } as CSSProperties}
              >
                {" "}
                <span className="eyebrow">08 · eRobotics</span>{" "}
                <h3>A whole robot, built from five designs</h3>{" "}
                <p className="lead">
                  eRobotics covers industrial robots, autonomous systems and
                  robot components. This robot is assembled from five of them:
                  the eAMR-500 mobile base, the eArm-7 seven-axis arm, the
                  eGripper-3F hand, eVision-4K stereo eyes and the eLiDAR-360.
                </p>{" "}
                <p className="fact">
                  <span>
                    From autonomous_systems, industrial_robots and
                    robot_components datasheets
                  </span>
                  eAMR-500: 500 kg payload, 2 m/s, LiDAR SLAM · eArm-7: 10 kg,
                  1.3 m reach
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
              </article>{" "}
              <div className="bk-spots">
                <article
                  className="spot"
                  data-spot="erobotics-design"
                  style={{ "--c": "#A78BFA" } as CSSProperties}
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
                    An autonomous mobile manipulator: base, arm, gripper, vision
                    and LiDAR are each an eRobotics design.
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
                  aria-label="How EoS would run it"
                >
                  {" "}
                  <span className="spot-k">EoS · robot profile</span>{" "}
                  <h3>How EoS would run it</h3>{" "}
                  <div className="chips">
                    <span className="s-code">Profile in eos</span>
                    <span className="s-docs">
                      Not validated on this hardware
                    </span>
                  </div>{" "}
                  <p className="what">
                    Docked here, the core board would boot EoS built with the
                    robot product profile: 15 features switched on, 3 of them
                    services with working code today.
                  </p>{" "}
                  <div className="how">
                    <span>How EoS would work here</span>
                    <ol>
                      <li>
                        The arm's 7 joints plus the base's 4 hub motors make 11
                        motors, more than the 8 the motor service tracks per
                        image today, so this robot needs that limit raised or
                        two EoS images.
                      </li>
                      <li>
                        LiDAR, cameras and the IMU sit behind HAL stub classes;
                        the sensor service (working code) holds up to 16
                        sensors.
                      </li>
                      <li>
                        The priority scheduler keeps the safety stop ahead of
                        everything else, and eos_motor_ctrl_emergency_stop()
                        halts a motor in one call (working code).
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
              </div>
            </div>
            <div
              className="bk-chap"
              id="ch-eagritech"
              role="tabpanel"
              aria-labelledby="bk-ct-eagritech"
              style={{ "--c": "#10B981" } as CSSProperties}
            >
              <figure
                className="bk-chap-media"
                data-clip="/media/industries/d09"
              >
                <picture>
                  <source
                    type="image/avif"
                    srcSet="/media/industries/d09.avif"
                  />
                  <img
                    src="/media/industries/d09.webp"
                    width={1280}
                    height={720}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <video
                  muted
                  playsInline
                  loop
                  preload="none"
                  aria-hidden="true"
                />
              </figure>
              <article
                className="card compact"
                style={{ "--c": "#10B981" } as CSSProperties}
              >
                {" "}
                <span className="eyebrow">09 · eAgriTech</span>{" "}
                <h3>A tractor that steers itself</h3>{" "}
                <p className="lead">
                  The website lists eAgriTech as its own industry. Its design
                  lives in the eRobotics autonomous-systems line: the
                  eAgri-Tractor, an autonomous tractor designed to navigate by
                  RTK GPS and LiDAR.
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
              </article>{" "}
            </div>
            <div
              className="bk-chap"
              id="ch-efrontier"
              role="tabpanel"
              aria-labelledby="bk-ct-efrontier"
              style={{ "--c": "#C084FC" } as CSSProperties}
            >
              <figure
                className="bk-chap-media"
                data-clip="/media/industries/d10"
              >
                <picture>
                  <source
                    type="image/avif"
                    srcSet="/media/industries/d10.avif"
                  />
                  <img
                    src="/media/industries/d10.webp"
                    width={1280}
                    height={720}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <video
                  muted
                  playsInline
                  loop
                  preload="none"
                  aria-hidden="true"
                />
              </figure>
              <article
                className="card compact"
                style={{ "--c": "#C084FC" } as CSSProperties}
              >
                {" "}
                <span className="eyebrow">10 · eFrontier</span>{" "}
                <h3>A robot arm for space</h3>{" "}
                <p className="lead">
                  eFrontier explores bioelectronics, nanotechnology,
                  neuromorphic computing, photonics, quantum control, space
                  robotics and swarms. The eSRB-900 design is a space-robotics
                  controller for a seven-axis arm on a rad-hard processor.
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
              </article>{" "}
            </div>
            <div
              className="bk-chap"
              id="ch-eindustrial"
              role="tabpanel"
              aria-labelledby="bk-ct-eindustrial"
              style={{ "--c": "#34D399" } as CSSProperties}
            >
              <figure
                className="bk-chap-media"
                data-clip="/media/industries/d11"
              >
                <picture>
                  <source
                    type="image/avif"
                    srcSet="/media/industries/d11.avif"
                  />
                  <img
                    src="/media/industries/d11.webp"
                    width={1280}
                    height={720}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <video
                  muted
                  playsInline
                  loop
                  preload="none"
                  aria-hidden="true"
                />
              </figure>
              <article
                className="card compact"
                style={{ "--c": "#34D399" } as CSSProperties}
              >
                {" "}
                <span className="eyebrow">11 · eIndustrial</span>{" "}
                <h3>A controller for the plant floor</h3>{" "}
                <p className="lead">
                  eIndustrial spans industrial electronics, sensors and
                  infrastructure equipment. The ePLC-1000 design is a modular
                  PLC for IEC 61131-3 programs on an NXP i.MX 8M Plus, with 32
                  digital inputs, 32 digital outputs, 16 analog inputs and 8
                  analog outputs.
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
              </article>{" "}
            </div>
            <div
              className="bk-chap"
              id="ch-eenergy"
              role="tabpanel"
              aria-labelledby="bk-ct-eenergy"
              style={{ "--c": "#F59E0B" } as CSSProperties}
            >
              <figure
                className="bk-chap-media"
                data-clip="/media/industries/d12"
              >
                <picture>
                  <source
                    type="image/avif"
                    srcSet="/media/industries/d12.avif"
                  />
                  <img
                    src="/media/industries/d12.webp"
                    width={1280}
                    height={720}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <video
                  muted
                  playsInline
                  loop
                  preload="none"
                  aria-hidden="true"
                />
              </figure>
              <article
                className="card"
                style={{ "--c": "#F59E0B" } as CSSProperties}
              >
                {" "}
                <span className="eyebrow">12 · eEnergy</span>{" "}
                <h3>A board that watches every cell</h3>{" "}
                <p className="lead">
                  eEnergy covers battery products, renewable energy and power
                  electronics. The eBMS-100A battery-management design is
                  designed to monitor each cell, sense pack current, balance
                  cells actively and protect against over-voltage,
                  under-voltage, over-current, overheating and short circuits.
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
              </article>{" "}
              <div className="bk-spots">
                <article
                  className="spot"
                  data-spot="eenergy-design"
                  style={{ "--c": "#F59E0B" } as CSSProperties}
                  aria-label="eBMS-100A"
                >
                  {" "}
                  <span className="spot-k">
                    eEnergy · 3 lines · 15 models
                  </span>{" "}
                  <h3>eBMS-100A</h3>{" "}
                  <div className="chips">
                    <span className="s-info">Design stage</span>
                  </div>{" "}
                  <p className="what">
                    A battery-management design with per-cell monitoring and
                    active balancing.
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
                  aria-label="How EoS would run it"
                >
                  {" "}
                  <span className="spot-k">EoS · ev profile</span>{" "}
                  <h3>How EoS would run it</h3>{" "}
                  <div className="chips">
                    <span className="s-code">Profile in eos</span>
                    <span className="s-docs">
                      Not validated on this hardware
                    </span>
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
                        sensor-service channel with filtering (working code).
                        Its 18 cells exceed the service's 16 channels today.
                      </li>
                      <li>
                        Over-voltage, over-current and short-circuit protection
                        would run as the highest-priority kernel task.
                      </li>
                      <li>
                        CAN FD and BLE are HAL stubs, and the power service is
                        bookkeeping only, so real readings come from the BMS
                        itself.
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
              </div>
            </div>
            <div
              className="bk-chap"
              id="ch-esmartcity"
              role="tabpanel"
              aria-labelledby="bk-ct-esmartcity"
              style={{ "--c": "#60A5FA" } as CSSProperties}
            >
              <figure
                className="bk-chap-media"
                data-clip="/media/industries/d13"
              >
                <picture>
                  <source
                    type="image/avif"
                    srcSet="/media/industries/d13.avif"
                  />
                  <img
                    src="/media/industries/d13.webp"
                    width={1280}
                    height={720}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <video
                  muted
                  playsInline
                  loop
                  preload="none"
                  aria-hidden="true"
                />
              </figure>
              <article
                className="card"
                style={{ "--c": "#60A5FA" } as CSSProperties}
              >
                {" "}
                <span className="eyebrow">13 · eSmartCity</span>{" "}
                <h3>Street lights that report back</h3>{" "}
                <p className="lead">
                  eSmartCity has 13 lines, from civic sensing to waste
                  management. The eSL-400 design twists into a street light's
                  NEMA socket. It is designed to dim the lamp by ambient light,
                  motion and schedule, meter its energy and report faults over
                  LoRaWAN.
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
              </article>{" "}
              <div className="bk-spots">
                <article
                  className="spot"
                  data-spot="esmartcity-design"
                  style={{ "--c": "#60A5FA" } as CSSProperties}
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
                  style={{ "--c": "#34D399" } as CSSProperties}
                  aria-label="How EoS would run it"
                >
                  {" "}
                  <span className="spot-k">EoS · iot profile</span>{" "}
                  <h3>How EoS would run it</h3>{" "}
                  <div className="chips">
                    <span className="s-code">Profile in eos</span>
                    <span className="s-docs">
                      Not validated on this hardware
                    </span>
                  </div>{" "}
                  <p className="what">
                    Docked here, the core board would boot EoS built with the
                    iot product profile: 17 features switched on, 5 of them
                    services with working code today.
                  </p>{" "}
                  <div className="how">
                    <span>How EoS would work here</span>
                    <ol>
                      <li>
                        LoRaWAN is not in EoS yet; it appears only in the docs.
                      </li>
                      <li>
                        Dimming from 1% to 100% would use the PWM HAL class and
                        0–10 V the DAC class; both are stubs today.
                      </li>
                      <li>
                        Metered voltage and current fit the sensor service's
                        voltage and current types (working code).
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
              </div>
            </div>
            <div
              className="bk-chap"
              id="ch-emining"
              role="tabpanel"
              aria-labelledby="bk-ct-emining"
              style={{ "--c": "#A8A29E" } as CSSProperties}
            >
              <figure
                className="bk-chap-media"
                data-clip="/media/industries/d14"
              >
                <picture>
                  <source
                    type="image/avif"
                    srcSet="/media/industries/d14.avif"
                  />
                  <img
                    src="/media/industries/d14.webp"
                    width={1280}
                    height={720}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <video
                  muted
                  playsInline
                  loop
                  preload="none"
                  aria-hidden="true"
                />
              </figure>
              <article
                className="card compact"
                style={{ "--c": "#A8A29E" } as CSSProperties}
              >
                {" "}
                <span className="eyebrow">14 · eMining</span>{" "}
                <h3>Four gases, one warning</h3>{" "}
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
              </article>{" "}
            </div>
            <div
              className="bk-chap"
              id="ch-eedgeai"
              role="tabpanel"
              aria-labelledby="bk-ct-eedgeai"
              style={{ "--c": "#818CF8" } as CSSProperties}
            >
              <figure
                className="bk-chap-media"
                data-clip="/media/industries/d15"
              >
                <picture>
                  <source
                    type="image/avif"
                    srcSet="/media/industries/d15.avif"
                  />
                  <img
                    src="/media/industries/d15.webp"
                    width={1280}
                    height={720}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <video
                  muted
                  playsInline
                  loop
                  preload="none"
                  aria-hidden="true"
                />
              </figure>
              <article
                className="card"
                style={{ "--c": "#818CF8" } as CSSProperties}
              >
                {" "}
                <span className="eyebrow">15 · eEdgeAI</span>{" "}
                <h3>Four eyes, one decision</h3>{" "}
                <p className="lead">
                  eEdgeAI is eight lines of edge-AI hardware: accelerators,
                  inference servers, NPUs, sensor fusion, SLAM, speech, TinyML
                  and vision. The eVIS-600 design synchronises four
                  global-shutter cameras and runs object detection at 30 fps in
                  1080p on an i.MX 8M Plus NPU. Research horizon: AGI-enabling
                  methods for autonomous physical systems. No achieved AGI
                  system is claimed as available today.
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
              </article>{" "}
              <div className="bk-spots">
                <article
                  className="spot"
                  data-spot="eedgeai-design"
                  style={{ "--c": "#818CF8" } as CSSProperties}
                  aria-label="eVIS-600"
                >
                  {" "}
                  <span className="spot-k">
                    eEdgeAI · 8 lines · 8 models
                  </span>{" "}
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
                  style={{ "--c": "#34D399" } as CSSProperties}
                  aria-label="How EoS would run it"
                >
                  {" "}
                  <span className="spot-k">EoS · ai_edge profile</span>{" "}
                  <h3>How EoS would run it</h3>{" "}
                  <div className="chips">
                    <span className="s-code">Profile in eos</span>
                    <span className="s-docs">
                      Not validated on this hardware
                    </span>
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
                        The nearest EoS board is imx8m (i.MX 8M Mini); the
                        kernel's AMP support would split vision from strobe
                        timing (working code).
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
              </div>
            </div>
            <div
              className="bk-chap"
              id="ch-eelectronics"
              role="tabpanel"
              aria-labelledby="bk-ct-eelectronics"
              style={{ "--c": "#FBBF24" } as CSSProperties}
            >
              <figure
                className="bk-chap-media"
                data-clip="/media/industries/d16"
              >
                <picture>
                  <source
                    type="image/avif"
                    srcSet="/media/industries/d16.avif"
                  />
                  <img
                    src="/media/industries/d16.webp"
                    width={1280}
                    height={720}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <video
                  muted
                  playsInline
                  loop
                  preload="none"
                  aria-hidden="true"
                />
              </figure>
              <article
                className="card compact"
                style={{ "--c": "#FBBF24" } as CSSProperties}
              >
                {" "}
                <span className="eyebrow">16 · eElectronics</span>{" "}
                <h3>Down to the silicon</h3>{" "}
                <p className="lead">
                  eElectronics designs the parts themselves: components,
                  semiconductors and emerging technology. The eASIC-Vision
                  design is a computer-vision chip on a 7 nm process with 32 MB
                  of on-chip SRAM, in a 25 × 25 mm BGA-576 package.
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
              </article>{" "}
            </div>
            <div
              className="bk-chap"
              id="ch-econsumer"
              role="tabpanel"
              aria-labelledby="bk-ct-econsumer"
              style={{ "--c": "#8B5CF6" } as CSSProperties}
            >
              <figure
                className="bk-chap-media"
                data-clip="/media/industries/d17"
              >
                <picture>
                  <source
                    type="image/avif"
                    srcSet="/media/industries/d17.avif"
                  />
                  <img
                    src="/media/industries/d17.webp"
                    width={1280}
                    height={720}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <video
                  muted
                  playsInline
                  loop
                  preload="none"
                  aria-hidden="true"
                />
              </figure>
              <article
                className="card compact"
                style={{ "--c": "#8B5CF6" } as CSSProperties}
              >
                {" "}
                <span className="eyebrow">17 · eConsumer</span>{" "}
                <h3>One hub for the whole home</h3>{" "}
                <p className="lead">
                  eConsumer covers smart home, smart devices and personal
                  devices. The eHub-Pro design is a smart-home hub that speaks
                  Matter 1.3, Zigbee 3.0, Z-Wave 700, BLE 5.3 and Wi-Fi 6, built
                  on an NXP i.MX 8M Mini.
                </p>{" "}
                <p className="fact">
                  <span>
                    From smart_home/product_datasheet.md · Design Phase
                  </span>
                  The same line includes a thermostat, a video doorbell, an
                  indoor camera and an AI speaker
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
              </article>{" "}
            </div>
            <div
              className="bk-chap"
              id="ch-ecybersec"
              role="tabpanel"
              aria-labelledby="bk-ct-ecybersec"
              style={{ "--c": "#06B6D4" } as CSSProperties}
            >
              <figure
                className="bk-chap-media"
                data-clip="/media/industries/d18"
              >
                <picture>
                  <source
                    type="image/avif"
                    srcSet="/media/industries/d18.avif"
                  />
                  <img
                    src="/media/industries/d18.webp"
                    width={1280}
                    height={720}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <video
                  muted
                  playsInline
                  loop
                  preload="none"
                  aria-hidden="true"
                />
              </figure>
              <article
                className="card compact"
                style={{ "--c": "#06B6D4" } as CSSProperties}
              >
                {" "}
                <span className="eyebrow">18 · eCybersecurity</span>{" "}
                <h3>A vault for keys</h3>{" "}
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
                  M-of-N smartcard quorum · certification target FIPS 140-3
                  Level 4
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
              </article>{" "}
            </div>
            <div
              className="bk-chap"
              id="ch-edefense"
              role="tabpanel"
              aria-labelledby="bk-ct-edefense"
              style={{ "--c": "#9CA3AF" } as CSSProperties}
            >
              <figure
                className="bk-chap-media"
                data-clip="/media/industries/d19"
              >
                <picture>
                  <source
                    type="image/avif"
                    srcSet="/media/industries/d19.avif"
                  />
                  <img
                    src="/media/industries/d19.webp"
                    width={1280}
                    height={720}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <video
                  muted
                  playsInline
                  loop
                  preload="none"
                  aria-hidden="true"
                />
              </figure>
              <article
                className="card compact"
                style={{ "--c": "#9CA3AF" } as CSSProperties}
              >
                {" "}
                <span className="eyebrow">19 · eDefense</span>{" "}
                <h3>A computer with no fan to fail</h3>{" "}
                <p className="lead">
                  eDefense has 19 lines, from ruggedised computing to sonar. The
                  eRGD-2000 design is a rugged mission computer that cools by
                  conduction through its chassis, so it needs no fan and can be
                  sealed to IP67. It is designed for MIL-STD-810H shock and
                  vibration.
                </p>{" "}
                <p className="fact">
                  <span>
                    From ruggedized_computing/product_datasheet.md · Design
                    Phase
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
              </article>{" "}
            </div>
            <div
              className="bk-chap"
              id="ch-rbt-wake"
              role="tabpanel"
              aria-labelledby="bk-ct-rbt-wake"
              style={{ "--c": "#34D399" } as CSSProperties}
            >
              <figure
                className="bk-chap-media"
                data-clip="/media/industries/d08"
              >
                <picture>
                  <source
                    type="image/avif"
                    srcSet="/media/industries/d08.avif"
                  />
                  <img
                    src="/media/industries/d08.webp"
                    width={1280}
                    height={720}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <video
                  muted
                  playsInline
                  loop
                  preload="none"
                  aria-hidden="true"
                />
              </figure>
              <article
                className="card"
                style={{ "--c": "#34D399" } as CSSProperties}
              >
                {" "}
                <span className="eyebrow">20 · Full-body robot</span>{" "}
                <h3>The board docks, and a body wakes up</h3>{" "}
                <p className="lead">
                  At the centre of the hall stands a full-body robot built only
                  from eRobotics designs: eServo-200 drives in its 26 rotary
                  joints, eActuator-50 push rods at the ankles, eGripper-3F
                  hands, eVision-4K eyes and an eLiDAR-360 crown. The core board
                  docks behind the chest window, and EoS brings the body up.
                </p>{" "}
                <p className="fact">
                  <span>Concept · assembled from eRobotics datasheets</span>
                  Every part is an eRobotics design; the body itself is not a
                  datasheet product
                </p>{" "}
                <div className="pills">
                  <span
                    className="pill"
                    style={{ "--t": "var(--tone-concept)" } as CSSProperties}
                  >
                    Concept · built from eRobotics parts
                  </span>
                  <span
                    className="pill"
                    style={{ "--t": "var(--tone-available)" } as CSSProperties}
                  >
                    EoS profile: robot
                  </span>
                </div>{" "}
              </article>{" "}
              <div className="bk-spots">
                <article
                  className="spot"
                  data-spot="rbt-board"
                  style={{ "--c": "#34D399" } as CSSProperties}
                  aria-label="The same board, docked in the chest"
                >
                  {" "}
                  <span className="spot-k">EoS · robot profile</span>{" "}
                  <h3>The same board, docked in the chest</h3>{" "}
                  <div className="chips">
                    <span className="s-code">Profile in eos</span>
                    <span className="s-info">Concept body</span>
                  </div>{" "}
                  <p className="what">
                    The core board that toured the hall docks behind the chest
                    window. It would boot EoS built with the robot product
                    profile: 15 features, including motor control and sensors.
                  </p>{" "}
                  <dl className="facts">
                    <div>
                      <dt>Features</dt>
                      <dd>
                        <span data-count="15">15</span>
                      </dd>
                    </div>
                    <div>
                      <dt>Joints</dt>
                      <dd>
                        <span data-count="30">30</span>
                      </dd>
                    </div>
                  </dl>{" "}
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
                  data-spot="rbt-boot"
                  style={{ "--c": "#34D399" } as CSSProperties}
                  aria-label="EoS wakes the body"
                >
                  {" "}
                  <span className="spot-k">EoS · boot order</span>{" "}
                  <h3>EoS wakes the body</h3>{" "}
                  <div className="chips">
                    <span className="s-code">Kernel + init · working code</span>
                    <span className="s-part">eBoot · host-tested</span>
                  </div>{" "}
                  <p className="what">
                    Power-on follows the same chain as the Chain of Trust story;
                    then EoS brings the body up from the inside out, joint by
                    joint.
                  </p>{" "}
                  <div className="how">
                    <span>Boot, step by step</span>
                    <ol>
                      <li>
                        eBoot's stage-0 checks stage-1, which verifies the
                        Ed25519-signed EoS image (host-tested; not yet booted on
                        hardware).
                      </li>
                      <li>
                        The kernel starts its priority scheduler, and the init
                        service starts each service in dependency order, with
                        restart policies and a watchdog.
                      </li>
                      <li>
                        In this concept, sensors come up before motors, so every
                        joint knows where it is before it may move.
                      </li>
                    </ol>
                  </div>{" "}
                  <div className="chips items">
                    <span className="s-part">eBoot</span>
                    <span className="s-code">kernel scheduler</span>
                    <span className="s-code">init service</span>
                    <span className="s-code">sensor service</span>
                    <span className="s-code">motor service</span>
                  </div>{" "}
                  <p className="src">
                    eBoot · eos kernel/ · services/init
                  </p>{" "}
                </article>{" "}
              </div>
            </div>
            <div
              className="bk-chap"
              id="ch-rbt-see"
              role="tabpanel"
              aria-labelledby="bk-ct-rbt-see"
              style={{ "--c": "#34D399" } as CSSProperties}
            >
              <figure
                className="bk-chap-media"
                data-clip="/media/industries/d08"
              >
                <picture>
                  <source
                    type="image/avif"
                    srcSet="/media/industries/d08.avif"
                  />
                  <img
                    src="/media/industries/d08.webp"
                    width={1280}
                    height={720}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <video
                  muted
                  playsInline
                  loop
                  preload="none"
                  aria-hidden="true"
                />
              </figure>
              <article
                className="card"
                style={{ "--c": "#34D399" } as CSSProperties}
              >
                {" "}
                <span className="eyebrow">21 · Full-body robot</span>{" "}
                <h3>Two eyes for depth, one laser for the room</h3>{" "}
                <p className="lead">
                  eVision-4K gives the head 4K stereo cameras with depth over
                  Gigabit Ethernet. The eLiDAR-360 crown sweeps the whole hall:
                  360°, 100 m of range and 0.1° resolution. EoS would turn both
                  into data the rest of the body can use.
                </p>{" "}
                <p className="fact">
                  <span>From robot_components/product_datasheet.md</span>
                  eVision-4K: 4K stereo + depth, GbE · eLiDAR-360: 100 m, 0.1°,
                  Ethernet
                </p>{" "}
                <div className="pills">
                  <span
                    className="pill"
                    style={{ "--t": "var(--tone-concept)" } as CSSProperties}
                  >
                    Concept · built from eRobotics parts
                  </span>
                  <span
                    className="pill"
                    style={{ "--t": "var(--tone-available)" } as CSSProperties}
                  >
                    EoS profile: robot
                  </span>
                </div>{" "}
              </article>{" "}
              <div className="bk-spots">
                <article
                  className="spot"
                  data-spot="rbt-eyes"
                  style={{ "--c": "#22D3EE" } as CSSProperties}
                  aria-label="Stereo eyes with depth"
                >
                  {" "}
                  <span className="spot-k">eRobotics · eVision-4K</span>{" "}
                  <h3>Stereo eyes with depth</h3>{" "}
                  <div className="chips">
                    <span className="s-info">Design stage</span>
                  </div>{" "}
                  <p className="what">
                    Two 4K cameras, a hand's width apart, see depth the way
                    people do. The datasheet lists 4K stereo plus depth over
                    Gigabit Ethernet.
                  </p>{" "}
                  <div className="how">
                    <span>How EoS would see</span>
                    <ol>
                      <li>
                        EoS would read the cameras through its camera HAL class,
                        a stub today.
                      </li>
                      <li>
                        Frames would go to eAI for detection; eAI's default
                        build returns stub inference.
                      </li>
                    </ol>
                  </div>{" "}
                  <dl className="facts">
                    <div>
                      <dt>Output</dt>
                      <dd>
                        4K<small>stereo + depth</small>
                      </dd>
                    </div>
                    <div>
                      <dt>Link</dt>
                      <dd>GbE</dd>
                    </div>
                  </dl>{" "}
                  <div className="chips items">
                    <span className="s-docs">camera HAL</span>
                    <span className="s-docs">Ethernet HAL</span>
                    <span className="s-part">eAI</span>
                  </div>{" "}
                  <p className="src">
                    eRobotics_CAD_Design/robot_components
                  </p>{" "}
                </article>{" "}
                <article
                  className="spot"
                  data-spot="rbt-lidar"
                  style={{ "--c": "#5EEAD4" } as CSSProperties}
                  aria-label="A full turn of laser range"
                >
                  {" "}
                  <span className="spot-k">eRobotics · eLiDAR-360</span>{" "}
                  <h3>A full turn of laser range</h3>{" "}
                  <div className="chips">
                    <span className="s-info">Design stage</span>
                  </div>{" "}
                  <p className="what">
                    The crown sweeps the hall. Every dot is a simulated return
                    from the floor, the pedestals and the designs standing on
                    them.
                  </p>{" "}
                  <div className="how">
                    <span>How EoS would map the room</span>
                    <ol>
                      <li>
                        EoS would take the point cloud over Ethernet; the
                        radar/LiDAR HAL class is a stub today.
                      </li>
                      <li>
                        The sensor service (working code) filters and calibrates
                        up to 16 sensors, so a full point cloud would need its
                        own path.
                      </li>
                    </ol>
                  </div>{" "}
                  <dl className="facts">
                    <div>
                      <dt>Range</dt>
                      <dd>
                        <span data-count="100">100</span>
                        <small>m</small>
                      </dd>
                    </div>
                    <div>
                      <dt>Resolution</dt>
                      <dd>
                        <span data-count="0.1" data-dec="1">
                          0.1
                        </span>
                        <small>°</small>
                      </dd>
                    </div>
                  </dl>{" "}
                  <div className="chips items">
                    <span className="s-docs">radar/LiDAR HAL</span>
                    <span className="s-code">sensor service</span>
                    <span className="s-part">sockets (host builds)</span>
                  </div>{" "}
                  <p className="src">
                    eRobotics_CAD_Design/robot_components
                  </p>{" "}
                </article>{" "}
              </div>
            </div>
            <div
              className="bk-chap"
              id="ch-rbt-walk"
              role="tabpanel"
              aria-labelledby="bk-ct-rbt-walk"
              style={{ "--c": "#34D399" } as CSSProperties}
            >
              <figure
                className="bk-chap-media"
                data-clip="/media/industries/d08"
              >
                <picture>
                  <source
                    type="image/avif"
                    srcSet="/media/industries/d08.avif"
                  />
                  <img
                    src="/media/industries/d08.webp"
                    width={1280}
                    height={720}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <video
                  muted
                  playsInline
                  loop
                  preload="none"
                  aria-hidden="true"
                />
              </figure>
              <article
                className="card"
                style={{ "--c": "#34D399" } as CSSProperties}
              >
                {" "}
                <span className="eyebrow">22 · Full-body robot</span>{" "}
                <h3>Walking is a real-time job</h3>{" "}
                <p className="lead">
                  Every step means reading the IMU and the 23-bit joint
                  encoders, then updating every drive on time. Each eServo-200
                  closes its own 20 kHz current loop; EoS would run the joint
                  loops and keep the balance task ahead of everything else.
                </p>{" "}
                <p className="fact">
                  <span>From robot_components/product_datasheet.md</span>
                  eServo-200: 200 W at 48 V, EtherCAT CoE (CiA 402), ±0.01°
                  position accuracy
                </p>{" "}
                <div className="pills">
                  <span
                    className="pill"
                    style={{ "--t": "var(--tone-concept)" } as CSSProperties}
                  >
                    Concept · built from eRobotics parts
                  </span>
                  <span
                    className="pill"
                    style={{ "--t": "var(--tone-available)" } as CSSProperties}
                  >
                    EoS profile: robot
                  </span>
                </div>{" "}
              </article>{" "}
              <div className="bk-spots">
                <article
                  className="spot"
                  data-spot="rbt-drives"
                  style={{ "--c": "#A78BFA" } as CSSProperties}
                  aria-label="A servo drive in every joint"
                >
                  {" "}
                  <span className="spot-k">eRobotics · eServo-200</span>{" "}
                  <h3>A servo drive in every joint</h3>{" "}
                  <div className="chips">
                    <span className="s-info">Design stage</span>
                  </div>{" "}
                  <p className="what">
                    Each rotary joint is an eServo-200 EtherCAT drive whose own
                    STM32G474 closes a 20 kHz current loop. Two eActuator-50
                    push rods move each ankle.
                  </p>{" "}
                  <div className="how">
                    <span>How EoS would drive the joints</span>
                    <ol>
                      <li>
                        EoS's motor service (working code) runs PID speed and
                        position loops and trajectories for each motor.
                      </li>
                      <li>
                        It tracks 8 motors per image today, so a 30-joint body
                        needs that limit raised or one EoS controller per limb.
                      </li>
                      <li>EtherCAT itself is not in EoS yet.</li>
                    </ol>
                  </div>{" "}
                  <dl className="facts">
                    <div>
                      <dt>Drives</dt>
                      <dd>
                        <span data-count="26">26</span>
                      </dd>
                    </div>
                    <div>
                      <dt>Encoders</dt>
                      <dd>
                        <span data-count="23">23</span>
                        <small>bit</small>
                      </dd>
                    </div>
                  </dl>{" "}
                  <div className="chips items">
                    <span className="s-code">motor service</span>
                    <span className="s-docs">motor HAL</span>
                    <span className="s-none">EtherCAT</span>
                  </div>{" "}
                  <p className="src">
                    robot_components · eos services/motor
                  </p>{" "}
                </article>{" "}
                <article
                  className="spot"
                  data-spot="rbt-balance"
                  style={{ "--c": "#FBBF24" } as CSSProperties}
                  aria-label="Balance is a deadline"
                >
                  {" "}
                  <span className="spot-k">EoS · real time</span>{" "}
                  <h3>Balance is a deadline</h3>{" "}
                  <div className="chips">
                    <span className="s-code">Kernel · working code</span>
                    <span className="s-docs">IMU HAL · stub</span>
                  </div>{" "}
                  <p className="what">
                    The amber ring is the centre of mass; the green outline is
                    the support polygon under the feet. Keep one inside the
                    other on every cycle, and the robot stays up.
                  </p>{" "}
                  <div className="how">
                    <span>How EoS would keep it upright</span>
                    <ol>
                      <li>
                        The kernel's priority scheduler would run the balance
                        task first, and priority-inheritance mutexes stop a
                        slower task from blocking it.
                      </li>
                      <li>
                        Message queues would carry joint targets from the
                        planner to the motor task, paced by software timers.
                      </li>
                      <li>
                        The IMU HAL class is a stub today; the kernel and the
                        sensor service are working code.
                      </li>
                    </ol>
                  </div>{" "}
                  <div className="chips items">
                    <span className="s-code">priority scheduler</span>
                    <span className="s-code">PI mutexes</span>
                    <span className="s-code">message queues</span>
                    <span className="s-code">software timers</span>
                    <span className="s-docs">IMU HAL</span>
                  </div>{" "}
                  <p className="src">
                    eos kernel/src/task.c · sync.c · ipc.c
                  </p>{" "}
                </article>{" "}
              </div>
            </div>
            <div
              className="bk-chap"
              id="ch-rbt-hands"
              role="tabpanel"
              aria-labelledby="bk-ct-rbt-hands"
              style={{ "--c": "#34D399" } as CSSProperties}
            >
              <figure
                className="bk-chap-media"
                data-clip="/media/industries/d08"
              >
                <picture>
                  <source
                    type="image/avif"
                    srcSet="/media/industries/d08.avif"
                  />
                  <img
                    src="/media/industries/d08.webp"
                    width={1280}
                    height={720}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <video
                  muted
                  playsInline
                  loop
                  preload="none"
                  aria-hidden="true"
                />
              </figure>
              <article
                className="card"
                style={{ "--c": "#34D399" } as CSSProperties}
              >
                {" "}
                <span className="eyebrow">23 · Full-body robot</span>{" "}
                <h3>Hands that pick, check and place</h3>{" "}
                <p className="lead">
                  Each hand is an eGripper-3F: three adaptive fingers, an 80 mm
                  span and 50 N of grip, on RS-485. The robot picks up a part,
                  lifts it to its eyes to check it, then places it in a tray.
                </p>{" "}
                <p className="fact">
                  <span>From robot_components/product_datasheet.md</span>
                  eGripper-3F: 3-finger adaptive gripper · 80 mm span · 50 N ·
                  RS-485
                </p>{" "}
                <div className="pills">
                  <span
                    className="pill"
                    style={{ "--t": "var(--tone-concept)" } as CSSProperties}
                  >
                    Concept · built from eRobotics parts
                  </span>
                  <span
                    className="pill"
                    style={{ "--t": "var(--tone-available)" } as CSSProperties}
                  >
                    EoS profile: robot
                  </span>
                </div>{" "}
              </article>{" "}
              <div className="bk-spots">
                <article
                  className="spot"
                  data-spot="rbt-grip"
                  style={{ "--c": "#A78BFA" } as CSSProperties}
                  aria-label="Three fingers that adapt"
                >
                  {" "}
                  <span className="spot-k">eRobotics · eGripper-3F</span>{" "}
                  <h3>Three fingers that adapt</h3>{" "}
                  <div className="chips">
                    <span className="s-info">Design stage</span>
                  </div>{" "}
                  <p className="what">
                    Two fingers and an opposed thumb close around the part with
                    up to 50 N and report back over RS-485.
                  </p>{" "}
                  <div className="how">
                    <span>How EoS would grip</span>
                    <ol>
                      <li>
                        EoS would talk to the gripper over a UART-based RS-485
                        link; the UART driver is register code for STM32F4 only.
                      </li>
                      <li>
                        The reach itself is a motor-service trajectory for each
                        arm joint (working code).
                      </li>
                    </ol>
                  </div>{" "}
                  <dl className="facts">
                    <div>
                      <dt>Span</dt>
                      <dd>
                        <span data-count="80">80</span>
                        <small>mm</small>
                      </dd>
                    </div>
                    <div>
                      <dt>Grip</dt>
                      <dd>
                        <span data-count="50">50</span>
                        <small>N</small>
                      </dd>
                    </div>
                  </dl>{" "}
                  <div className="chips items">
                    <span className="s-part">UART HAL</span>
                    <span className="s-code">motor trajectories</span>
                  </div>{" "}
                  <p className="src">
                    eRobotics_CAD_Design/robot_components
                  </p>{" "}
                </article>{" "}
                <article
                  className="spot"
                  data-spot="rbt-check"
                  style={{ "--c": "#22D3EE" } as CSSProperties}
                  aria-label="Eyes guide the hand"
                >
                  {" "}
                  <span className="spot-k">EoS + eAI</span>{" "}
                  <h3>Eyes guide the hand</h3>{" "}
                  <div className="chips">
                    <span className="s-part">eAI · stub inference</span>
                  </div>{" "}
                  <p className="what">
                    Before placing the part, the robot lifts it to its eyes and
                    checks it with stereo depth.
                  </p>{" "}
                  <div className="how">
                    <span>What it would take</span>
                    <ol>
                      <li>
                        Recognising the part is a job for eAI, the planned
                        on-device AI layer; its default build returns stub
                        inference today.
                      </li>
                      <li>
                        The eNI → eIPC → eAI pipeline described in the docs is
                        not wired up in code yet.
                      </li>
                    </ol>
                  </div>{" "}
                  <div className="chips items">
                    <span className="s-part">eAI runtime</span>
                    <span className="s-part">eIPC</span>
                    <span className="s-docs">camera HAL</span>
                  </div>{" "}
                  <p className="src">eAI · eIPC</p>{" "}
                </article>{" "}
              </div>
            </div>
            <div
              className="bk-chap"
              id="ch-rbt-safe"
              role="tabpanel"
              aria-labelledby="bk-ct-rbt-safe"
              style={{ "--c": "#34D399" } as CSSProperties}
            >
              <figure
                className="bk-chap-media"
                data-clip="/media/industries/d08"
              >
                <picture>
                  <source
                    type="image/avif"
                    srcSet="/media/industries/d08.avif"
                  />
                  <img
                    src="/media/industries/d08.webp"
                    width={1280}
                    height={720}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <video
                  muted
                  playsInline
                  loop
                  preload="none"
                  aria-hidden="true"
                />
              </figure>
              <article
                className="card"
                style={{ "--c": "#34D399" } as CSSProperties}
              >
                {" "}
                <span className="eyebrow">24 · Full-body robot</span>{" "}
                <h3>Stops in one call, updates over the air</h3>{" "}
                <p className="lead">
                  An emergency stop has to beat every other task. EoS's motor
                  service stops a motor in one call, and the scheduler runs that
                  task first. Afterwards, new firmware arrives over the air into
                  the spare A/B slot, and eBoot checks its signature before
                  switching.
                </p>{" "}
                <p className="fact">
                  <span>From eos services/motor and services/ota</span>
                  eos_motor_ctrl_emergency_stop() · A/B slots with SHA-256
                  checks
                </p>{" "}
                <div className="pills">
                  <span
                    className="pill"
                    style={{ "--t": "var(--tone-concept)" } as CSSProperties}
                  >
                    Concept · built from eRobotics parts
                  </span>
                  <span
                    className="pill"
                    style={{ "--t": "var(--tone-available)" } as CSSProperties}
                  >
                    EoS profile: robot
                  </span>
                </div>{" "}
              </article>{" "}
              <div className="bk-spots">
                <article
                  className="spot"
                  data-spot="rbt-stop"
                  style={{ "--c": "#EF4444" } as CSSProperties}
                  aria-label="Stop in one call"
                >
                  {" "}
                  <span className="spot-k">EoS · motor service</span>{" "}
                  <h3>Stop in one call</h3>{" "}
                  <div className="chips">
                    <span className="s-code">e-stop · working code</span>
                  </div>{" "}
                  <p className="what">
                    An emergency stop zeroes a motor's target speed, PID output
                    and integrators in a single call, and every light on the
                    body turns red.
                  </p>{" "}
                  <div className="how">
                    <span>How EoS would stop it</span>
                    <ol>
                      <li>
                        eos_motor_ctrl_emergency_stop() is working code; a
                        full-body stop would call it for every joint, then hold
                        position.
                      </li>
                      <li>
                        The eArm-7 datasheet targets ISO 10218-1 and IEC 62061
                        SIL 2 for the arm; a whole humanoid would need its own
                        safety case.
                      </li>
                    </ol>
                  </div>{" "}
                  <div className="chips items">
                    <span className="s-code">e-stop call</span>
                    <span className="s-none">functional-safety case</span>
                  </div>{" "}
                  <p className="src">
                    eos services/motor/src/motor_ctrl.c
                  </p>{" "}
                </article>{" "}
                <article
                  className="spot"
                  data-spot="rbt-ota"
                  style={{ "--c": "#34D399" } as CSSProperties}
                  aria-label="Update without a cable"
                >
                  {" "}
                  <span className="spot-k">EoS · OTA + eBoot</span>{" "}
                  <h3>Update without a cable</h3>{" "}
                  <div className="chips">
                    <span className="s-part">OTA · partial</span>
                    <span className="s-part">eBoot · host-tested</span>
                  </div>{" "}
                  <p className="what">
                    New firmware drops into the spare A/B slot. eBoot verifies
                    its Ed25519 signature and version before switching, and can
                    roll back.
                  </p>{" "}
                  <div className="how">
                    <span>How the update would land</span>
                    <ol>
                      <li>
                        The EoS OTA service is an A/B state machine with SHA-256
                        checks; today it hashes chunks but does not write flash.
                      </li>
                      <li>
                        eBoot's slot selection, signature checks and
                        anti-rollback are host-tested and have not run on
                        hardware yet.
                      </li>
                    </ol>
                  </div>{" "}
                  <div className="chips items">
                    <span className="s-part">OTA service</span>
                    <span className="s-part">eBoot A/B + rollback</span>
                    <span className="s-code">Ed25519 verify</span>
                  </div>{" "}
                  <p className="src">eos services/ota · eBoot</p>{" "}
                </article>{" "}
              </div>
            </div>
            <div
              className="bk-chap"
              id="ch-every"
              role="tabpanel"
              aria-labelledby="bk-ct-every"
              style={{ "--c": "#38BDF8" } as CSSProperties}
            >
              <article
                className="card"
                style={{ "--c": "#38BDF8" } as CSSProperties}
              >
                {" "}
                <span className="eyebrow">25 · Every industry</span>{" "}
                <h3>Eighteen domains, one open collection</h3>{" "}
                <p className="lead">
                  Every design in this hall, and every part of the robot at its
                  centre, is part of eCAD Hardware: 125 product lines and 292
                  named models. Each carries a datasheet, and most add a bill of
                  materials and a power simulation. All are at design stage; no
                  routed PCB or Gerbers yet. The repository is published under
                  the MIT licence.
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
                  <span style={{ "--c": "#2DD4BF" } as CSSProperties}>
                    ePAM
                  </span>
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
            </div>
          </div>
        </div>
        <div className="legend">
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
        <p className="bk-fine">
          Every design here is at design stage: a datasheet, most with a bill of
          materials and a power simulation; no routed PCB or Gerbers yet. Target
          standards are targets, not certifications held.
        </p>
      </div>
    </section>
  );
}
