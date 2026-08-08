/**
 * The industries the Foundation's hardware and software work serves.
 *
 * Every field here is sourced, and the provenance matters more than the
 * presentation, so read this before editing:
 *
 * - `targetStandards` are **targets**, never achieved certifications. 58 of the
 *   datasheets in `eCAD-Hardware-Products` title their standards table
 *   "Compliance Targets", and nothing in the repositories has been through a
 *   certification authority. Two datasheets overstate this — the avionics sheet
 *   says "DO-178C Level A certified software" and HEALTH-KEY ULTRA says
 *   "ISO 13485 QMS certified (BSI audit Q4 2026)", an audit that has not
 *   happened. Neither wording is carried onto the site.
 *
 * - `referenceDesign` names a design that actually exists in a repository. It is
 *   `null` where none does. It is never borrowed from an unrelated industry to
 *   fill the field.
 *
 * - `status` is transcribed from the datasheet's own `**Status:**` line.
 *
 * - `trl` is a band derived from `status`, not an independent assessment:
 *   Concept -> 1-2, Research Phase -> 2-3, Design Phase -> 3-4. The page states
 *   that it is self-assessed and unaudited. Do not raise a band without evidence
 *   from a test campaign; "we think it is further along" is not evidence.
 *
 * The health devices are the one place where two sources disagree. Their CAD
 * datasheets say "Production Ready"; `eos-health/PRODUCT_MATURITY_ROADMAP.md`
 * says reliability "needs physical testing" and the FDA 510(k) submissions are
 * pending. The conservative source wins here, because an unsubmitted Class II
 * medical device is not production ready and saying so to a grant reviewer would
 * be a material misstatement.
 */

/** Which public-funding theme an industry's work maps to. */
export type FundingTheme =
  | "Sovereignty"
  | "Safety certification"
  | "Decarbonisation"
  | "Health access"
  | "Resilience";

/** Self-assessed maturity, derived from the source datasheet's status line. */
export type Maturity =
  | { kind: "concept"; status: string; trl: "TRL 1-2" }
  | { kind: "research"; status: string; trl: "TRL 2-3" }
  | { kind: "design"; status: string; trl: "TRL 3-4" }
  | { kind: "documented"; status: string; trl: "TRL 4" }
  | { kind: "sought"; status: string; trl: null };

export interface Industry {
  id: string;
  name: string;
  /** What the Foundation's work covers in this industry. */
  blurb: string;
  group: "core" | "frontier";
  /** Standards the designs are built toward. Not certifications held. */
  targetStandards: string[];
  maturity: Maturity;
  /** A design that exists today, or null where none does yet. */
  referenceDesign: { name: string; note: string; repoPath: string } | null;
  fundingTheme: FundingTheme;
}

const design = (status = "Design Phase"): Maturity => ({
  kind: "design",
  status,
  trl: "TRL 3-4",
});
const concept = (status: string): Maturity => ({
  kind: "concept",
  status,
  trl: "TRL 1-2",
});
const research = (status = "Research Phase"): Maturity => ({
  kind: "research",
  status,
  trl: "TRL 2-3",
});
/** Design and regulatory documentation complete; physical testing pending. */
const documented = (status: string): Maturity => ({
  kind: "documented",
  status,
  trl: "TRL 4",
});
/** No design exists yet. Stated as sought rather than dressed up. */
const sought = (): Maturity => ({
  kind: "sought",
  status: "No reference design yet — on the roadmap",
  trl: null,
});

const CAD = "eCAD-Hardware-Products";

export const INDUSTRIES: Industry[] = [
  {
    id: "aerospace",
    name: "Aerospace",
    blurb: "Avionics, flight control, and airborne systems electronics.",
    group: "core",
    targetStandards: ["DO-178C", "DO-254", "MIL-STD-1553B", "MIL-STD-704F"],
    maturity: design(),
    referenceDesign: {
      name: "eFC-1000 Primary Flight Computer",
      note: "3U VPX flight computer, part of a six-unit avionics suite",
      repoPath: `${CAD}/eAerospace_CAD_Design/avionics`,
    },
    fundingTheme: "Safety certification",
  },
  {
    id: "space-satellite",
    name: "Space & Satellite",
    blurb:
      "Onboard computers, CubeSat payloads, and ground-segment hardware.",
    group: "core",
    targetStandards: ["ECSS-E-ST-10", "ECSS-E-ST-50", "MIL-STD-883"],
    maturity: design(),
    referenceDesign: {
      name: "eCUBE-3U-OBC",
      note: "3U CubeSat onboard computer, with EPS and ADCS boards alongside",
      repoPath: `${CAD}/eAerospace_CAD_Design/cubesat_systems`,
    },
    fundingTheme: "Sovereignty",
  },
  {
    id: "defence",
    name: "Defence",
    blurb:
      "Land, air, and C4ISR platform electronics built to military standards.",
    group: "core",
    targetStandards: ["MIL-STD-6016", "MIL-STD-810H", "FIPS 140-3 Level 3"],
    maturity: design(),
    referenceDesign: {
      name: "eC4I-7000",
      note: "Tactical C4ISR compute node on Zynq UltraScale+ with AI fusion",
      repoPath: `${CAD}/eDefense_CAD_Design/c4isr`,
    },
    fundingTheme: "Sovereignty",
  },
  {
    id: "naval-maritime",
    name: "Naval & Maritime",
    blurb: "Shipboard control, subsea, and unmanned marine systems.",
    group: "core",
    targetStandards: ["IEC 61174", "IEC 60945", "MIL-STD-1399"],
    maturity: design(),
    referenceDesign: {
      name: "eNav-ECDIS",
      note: "Electronic chart display and information system, with AIS and autopilot units",
      repoPath: `${CAD}/eTransport_CAD_Design/maritime_systems`,
    },
    fundingTheme: "Sovereignty",
  },
  {
    id: "radar-sensing",
    name: "Radar & Sensing",
    blurb: "Radar, sonar, and RF front-end board design.",
    group: "core",
    targetStandards: ["IEC 60565", "MIL-STD-461G", "IEC 61000-4-2"],
    maturity: design(),
    referenceDesign: {
      name: "eRadar360 hardware",
      note: "Radar front-end and processing boards in a dedicated design repository",
      repoPath: `${CAD}/eRadar360_CAD_Design/hardware`,
    },
    fundingTheme: "Resilience",
  },
  {
    id: "automotive",
    name: "Automotive",
    blurb: "ECUs, ADAS sensor nodes, and in-vehicle networks.",
    group: "core",
    targetStandards: ["ISO 26262", "AEC-Q100", "CISPR 25"],
    maturity: design(),
    referenceDesign: {
      name: "eVCU-Pro",
      note: "Vehicle control unit, alongside an L2 ADAS node and driver-monitoring board",
      repoPath: `${CAD}/eTransport_CAD_Design/automotive_electronics`,
    },
    fundingTheme: "Safety certification",
  },
  {
    id: "ev-charging",
    name: "Electric Vehicles & Charging",
    blurb:
      "Battery management, powertrain control, and charging infrastructure.",
    group: "core",
    targetStandards: ["IEC 62619", "UL 1973", "IEC 62477-1"],
    maturity: design(),
    referenceDesign: {
      name: "eBMS-100A",
      note: "100 A battery management system, with a 10 kWh pack and 22 kW motor drive",
      repoPath: `${CAD}/eEnergy_CAD_Design/battery_products`,
    },
    fundingTheme: "Decarbonisation",
  },
  {
    id: "rail-transit",
    name: "Rail & Transit",
    blurb:
      "Signalling, trackside monitoring, and rolling-stock electronics.",
    group: "core",
    targetStandards: [
      "EN 50128 SIL 4",
      "EN 50129 SIL 4",
      "EN 50155",
      "EN 50121-4",
    ],
    maturity: design(),
    referenceDesign: {
      name: "eTCU-Pro",
      note: "Train control unit targeting SIL 4, with an automatic train protection board",
      repoPath: `${CAD}/eTransport_CAD_Design/rail_systems`,
    },
    fundingTheme: "Safety certification",
  },
  {
    id: "transport-logistics",
    name: "Transport & Logistics",
    blurb: "Fleet telematics, asset tracking, and port automation.",
    group: "core",
    targetStandards: ["ISO 3691-4", "IEC 62061 SIL 2"],
    maturity: design(),
    referenceDesign: {
      name: "eWarehouse-1T",
      note: "One-tonne autonomous mobile robot, with a delivery robot and 4G telematics unit",
      repoPath: `${CAD}/eRobotics_CAD_Design/autonomous_systems`,
    },
    fundingTheme: "Decarbonisation",
  },
  {
    id: "medical-devices",
    name: "Medical Devices",
    blurb:
      "Patient monitoring, diagnostics, and therapy device controllers.",
    group: "core",
    targetStandards: [
      "IEC 60601-1",
      "IEC 62304",
      "ISO 13485",
      "ISO 80601-2-12",
    ],
    maturity: design(),
    referenceDesign: {
      name: "eVent-Pro",
      note: "ICU ventilator controller, alongside infusion, oxygen and 12-lead ECG designs",
      repoPath: `${CAD}/eMedical_CAD_Design/patient_care`,
    },
    fundingTheme: "Health access",
  },
  {
    id: "digital-health",
    name: "Digital Health",
    blurb: "Wearables, remote monitoring, and connected-care hardware.",
    group: "core",
    targetStandards: ["IEC 60601-1", "ISO 13485", "FDA 510(k) pathway"],
    maturity: documented(
      "Firmware, open hardware and algorithms complete; reliability testing and FDA 510(k) submission pending"
    ),
    referenceDesign: {
      name: "HEALTH-KEY ULTRA",
      note: "Open hardware under CERN OHL with KiCad sources; regulatory documentation complete, physical testing pending",
      repoPath: "eos-health/devices/health-key-ultra",
    },
    fundingTheme: "Health access",
  },
  {
    id: "energy-power",
    name: "Energy & Power",
    blurb: "Generation, inverters, and power electronics design.",
    group: "core",
    targetStandards: ["IEC 62477-1", "IEC 61800-5-1", "IEC 62040-1"],
    maturity: design(),
    referenceDesign: {
      name: "eDCDC-5kW",
      note: "5 kW DC-DC converter, with a 10 kVA UPS and smart breaker designs",
      repoPath: `${CAD}/eEnergy_CAD_Design/power_electronics`,
    },
    fundingTheme: "Decarbonisation",
  },
  {
    id: "smart-grid",
    name: "Smart Grid & Utilities",
    blurb:
      "Substation automation, protection relays, and smart metering.",
    group: "core",
    targetStandards: ["IEC 62056", "IEC 62052-11", "IEEE 1547"],
    maturity: design(),
    referenceDesign: {
      name: "eSM-3P",
      note: "Three-phase smart meter, with gas and water meters in the same family",
      repoPath: `${CAD}/eSmartCity_CAD_Design/utilities`,
    },
    fundingTheme: "Decarbonisation",
  },
  {
    id: "renewables-storage",
    name: "Renewables & Storage",
    blurb:
      "Solar, wind, hydrogen, and battery storage controllers.",
    group: "core",
    targetStandards: [
      "IEC 61727",
      "IEEE 1547",
      "IEC 61400-1",
      "IEEE 2030.7",
    ],
    maturity: design(),
    referenceDesign: {
      name: "eSolarInv-10kW",
      note: "10 kW string solar inverter, with a 50 kW wind controller and 100 kW microgrid controller",
      repoPath: `${CAD}/eEnergy_CAD_Design/renewable_energy`,
    },
    fundingTheme: "Decarbonisation",
  },
  {
    id: "oil-gas",
    name: "Oil, Gas & Pipelines",
    blurb: "Ruggedized monitoring and process control electronics.",
    group: "core",
    targetStandards: ["IEC 60079", "ATEX", "IECEx"],
    maturity: design(),
    referenceDesign: {
      name: "eEnv-ATEX",
      note: "ATEX-zone environmental monitor, with a four-gas detector in the same family",
      repoPath: `${CAD}/eMining_CAD_Design/industrial_safety`,
    },
    fundingTheme: "Resilience",
  },
  {
    id: "mining",
    name: "Mining & Heavy Industry",
    blurb:
      "Underground sensing, autonomous haulage, and plant control.",
    group: "core",
    targetStandards: [
      "ISO 17757",
      "ISO 15998",
      "IECEx",
      "IEC 62061 SIL 3",
    ],
    maturity: design(),
    referenceDesign: {
      name: "eHaul-Auto",
      note: "Autonomous haulage controller, with underground inspection UAV and worker-proximity safety units",
      repoPath: `${CAD}/eMining_CAD_Design/mining_equipment`,
    },
    fundingTheme: "Resilience",
  },
  {
    id: "industrial-automation",
    name: "Industrial Automation",
    blurb: "PLC, SCADA, motor drives, and process control hardware.",
    group: "core",
    targetStandards: [
      "IEC 61131-3",
      "IEC 61508 SIL 2",
      "IEC 62443",
      "IEC 61010-1",
    ],
    maturity: design(),
    referenceDesign: {
      name: "ePLC-1000",
      note: "Programmable logic controller, with an IIoT gateway, HMI and 32-channel DAQ",
      repoPath: `${CAD}/eIndustrial_CAD_Design/industrial_electronics`,
    },
    fundingTheme: "Safety certification",
  },
  {
    id: "robotics",
    name: "Robotics",
    blurb:
      "Motion control, sensor fusion, and autonomous platform electronics.",
    group: "core",
    targetStandards: ["ISO 10218-1", "IEC 62061 SIL 2"],
    maturity: design(),
    referenceDesign: {
      name: "eArm-7",
      note: "Seven-axis industrial arm controller, with a collaborative robot and delta picker",
      repoPath: `${CAD}/eRobotics_CAD_Design/industrial_robots`,
    },
    fundingTheme: "Safety certification",
  },
  {
    id: "manufacturing",
    name: "Manufacturing & Industry 4.0",
    blurb:
      "IIoT gateways, predictive maintenance, and digital twins.",
    group: "core",
    targetStandards: ["IEC 62443", "IEC 61131-3"],
    maturity: design(),
    referenceDesign: {
      name: "eGW-500",
      note: "Industrial IoT gateway bridging fieldbus to OT-secured networks",
      repoPath: `${CAD}/eIndustrial_CAD_Design/industrial_electronics`,
    },
    fundingTheme: "Sovereignty",
  },
  {
    id: "semiconductors",
    name: "Semiconductors & Electronics",
    blurb: "Board-level design, test, and bring-up infrastructure.",
    group: "core",
    targetStandards: ["IEC 62368-1", "EN 55032"],
    maturity: design(),
    referenceDesign: {
      name: "eMCU-Ultra",
      note: "MCU platform board, with an FPGA board and PCB prototyping designs",
      repoPath: `${CAD}/eElectronics_CAD_Design/semiconductor_products`,
    },
    fundingTheme: "Sovereignty",
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    blurb: "Secure boot, hardware root of trust, and OT security.",
    group: "core",
    targetStandards: ["FIPS 140-3", "IEC 62443-4-2", "ETSI EN 303 645"],
    maturity: design(),
    referenceDesign: {
      name: "eHSM-Pro",
      note: "Hardware security module, with secure-boot and root-of-trust subsystem designs",
      repoPath: `${CAD}/eCybersecurity_CAD_Design/security_appliances`,
    },
    fundingTheme: "Sovereignty",
  },
  {
    id: "telecommunications",
    name: "Telecommunications",
    blurb:
      "Open RAN, private 5G, IoT gateways, and timing distribution.",
    group: "core",
    targetStandards: ["ETSI EN 303 645", "IEC 62443-4-2", "IEEE 1588"],
    maturity: design(),
    referenceDesign: {
      name: "e5G-Small",
      note: "5G small cell, with a private-network controller and IoT gateway",
      repoPath: `${CAD}/eSmartCity_CAD_Design/telecom`,
    },
    fundingTheme: "Sovereignty",
  },
  {
    id: "agriculture",
    name: "Agriculture & AgriTech",
    blurb:
      "Precision agriculture, irrigation, and crop and livestock sensing.",
    group: "core",
    targetStandards: ["ISO 3691-4", "ETSI EN 303 645"],
    maturity: concept("Concept — sensor stack and LoRa mesh topology TBD"),
    referenceDesign: {
      name: "eFarm",
      note: "Solar LoRaWAN soil and crop sensor mesh; an eAgri-Tractor controller exists in the robotics designs",
      repoPath: `${CAD}/future_designs/eFarm`,
    },
    fundingTheme: "Resilience",
  },
  {
    id: "food-cold-chain",
    name: "Food & Cold Chain",
    blurb:
      "Traceability, storage monitoring, and food-safety instrumentation.",
    group: "core",
    targetStandards: ["IEC 61010-1", "EN 12830"],
    maturity: sought(),
    referenceDesign: null,
    fundingTheme: "Resilience",
  },
  {
    id: "water-wastewater",
    name: "Water & Wastewater",
    blurb:
      "Quality monitoring, leak detection, and treatment control.",
    group: "core",
    targetStandards: ["ISO 4064", "IEC 62056"],
    maturity: design(),
    referenceDesign: {
      name: "eWM-DN50 and eLeakDetect",
      note: "DN50 water meter and leak-detection unit; an eHydro water-quality concept is in future designs",
      repoPath: `${CAD}/eSmartCity_CAD_Design/utilities`,
    },
    fundingTheme: "Resilience",
  },
  {
    id: "environment-climate",
    name: "Environment & Climate",
    blurb:
      "Air quality, emissions, weather, and ecological sensor networks.",
    group: "core",
    targetStandards: ["EN 15267", "IEC 61010-1"],
    maturity: design(),
    referenceDesign: {
      name: "eEnvStation",
      note: "Environmental monitoring station targeting EN 15267, with an eAQ-Pro air-quality unit",
      repoPath: `${CAD}/eSmartCity_CAD_Design/urban_infrastructure`,
    },
    fundingTheme: "Decarbonisation",
  },
  {
    id: "disaster-resilience",
    name: "Disaster Resilience & Public Safety",
    blurb:
      "Flood, seismic, wildfire, and emergency-response systems.",
    group: "core",
    targetStandards: ["IEC 62676", "EN 50131-1"],
    maturity: concept("Concept — sensor calibration and public dashboard TBD"),
    referenceDesign: {
      name: "eHydro",
      note: "River-level and water-quality monitoring concept; emergency communications hardware exists in the industrial-safety designs",
      repoPath: `${CAD}/future_designs/eHydro`,
    },
    fundingTheme: "Resilience",
  },
  {
    id: "smart-cities",
    name: "Smart Cities",
    blurb:
      "Street lighting, traffic, waste management, and civic sensing.",
    group: "core",
    targetStandards: ["NTCIP 1202", "IEC 62264", "ISO 14906"],
    maturity: design(),
    referenceDesign: {
      name: "eTrafficCtrl",
      note: "Traffic signal controller to NTCIP 1202, with smart parking, lighting and civic sensing units",
      repoPath: `${CAD}/eSmartCity_CAD_Design/urban_infrastructure`,
    },
    fundingTheme: "Decarbonisation",
  },
  {
    id: "construction-infrastructure",
    name: "Construction & Infrastructure",
    blurb:
      "Structural health monitoring for bridges, tunnels, and dams.",
    group: "core",
    targetStandards: ["ISO 17757", "IEC 61010-1"],
    maturity: design(),
    referenceDesign: {
      name: "eInspect-Site",
      note: "Site inspection and survey platform, with structural robots in the same family",
      repoPath: `${CAD}/eMining_CAD_Design/construction_robots`,
    },
    fundingTheme: "Resilience",
  },
  {
    id: "building-automation",
    name: "Building Automation",
    blurb: "HVAC, lighting, fire safety, and access control.",
    group: "core",
    targetStandards: ["IEC 62676-1", "EN 50131-1", "IEC 60598-2-3"],
    maturity: design(),
    referenceDesign: {
      name: "eAccess-Pro",
      note: "Access control and biometric lock designs, with a smart streetlight controller for lighting",
      repoPath: `${CAD}/eCybersecurity_CAD_Design/physical_security`,
    },
    fundingTheme: "Decarbonisation",
  },
  {
    id: "consumer-electronics",
    name: "Consumer Electronics",
    blurb: "Audio, display, camera, and connected-device hardware.",
    group: "core",
    targetStandards: ["IEC 62368-1", "EN 55032"],
    maturity: design(),
    referenceDesign: {
      name: "eWatch-Pro",
      note: "Wearable platform, with AR glasses and portable sensor designs alongside",
      repoPath: `${CAD}/eConsumer_CAD_Design/personal_devices`,
    },
    fundingTheme: "Health access",
  },
  {
    id: "smart-home-iot",
    name: "Smart Home & IoT",
    blurb: "Matter, Thread, Zigbee, and BLE device platforms.",
    group: "core",
    targetStandards: ["ETSI EN 303 645", "IEC 62368-1"],
    maturity: design(),
    referenceDesign: {
      name: "eHub-Pro",
      note: "Multi-protocol home hub, with thermostat, doorbell and camera designs",
      repoPath: `${CAD}/eConsumer_CAD_Design/smart_home`,
    },
    fundingTheme: "Decarbonisation",
  },
  {
    id: "edge-ai",
    name: "Edge AI & Embedded Intelligence",
    blurb: "TinyML, machine vision, and on-device inference.",
    group: "core",
    targetStandards: ["IEC 62368-1", "IEC 62471", "ISO 26262"],
    maturity: design(),
    referenceDesign: {
      name: "TinyML platform boards",
      note: "TinyML, NPU subsystem, vision and sensor-fusion board designs, running eAI",
      repoPath: `${CAD}/eEdgeAI_CAD_Design/tinyml_platforms`,
    },
    fundingTheme: "Sovereignty",
  },
  {
    id: "research-education",
    name: "Research & Education",
    blurb:
      "Teaching platforms, lab instrumentation, and open hardware.",
    group: "core",
    targetStandards: ["IEC 61010-1", "CERN OHL"],
    maturity: concept("Concept — curriculum draft and enclosure design TBD"),
    referenceDesign: {
      name: "eEdu-Kit",
      note: "Teaching kit paired with the Foundation's free books and Kids Edition curriculum",
      repoPath: `${CAD}/future_designs/eEdu-Kit`,
    },
    fundingTheme: "Health access",
  },
  {
    id: "quantum-photonics",
    name: "Quantum & Photonics Instrumentation",
    blurb:
      "Cryogenic control, precision timing, and quantum sensing electronics.",
    group: "frontier",
    targetStandards: ["IEC 61010-1", "IEC 62368-1"],
    maturity: research(),
    referenceDesign: {
      name: "eQuantum-Sense and eCryo-Ctrl",
      note: "Quantum sensing front-end and cryogenic controller, with a precision clock board",
      repoPath: `${CAD}/eElectronics_CAD_Design/emerging_tech`,
    },
    fundingTheme: "Sovereignty",
  },
  {
    id: "bioelectronics",
    name: "Bioelectronics & Lab-on-Chip",
    blurb:
      "Neural interfaces, sequencing, and miniaturised laboratory instrumentation.",
    group: "frontier",
    targetStandards: ["IEC 60601-1", "ISO 15189", "IEC 61010-2-020"],
    maturity: concept("Concept — electrode placement and intent decoder TBD"),
    referenceDesign: {
      name: "eBCI-Lite",
      note: "Low-channel brain-computer interface concept; eSeq-Nano and ePCR-96 lab designs exist today",
      repoPath: `${CAD}/future_designs/eBCI-Lite`,
    },
    fundingTheme: "Health access",
  },
  {
    id: "autonomous-drones",
    name: "Autonomous Systems & Drones",
    blurb:
      "Fixed-wing, multirotor, VTOL, and ground autonomy platforms.",
    group: "frontier",
    targetStandards: ["DO-178C", "ISO 3691-4", "IEC 62061 SIL 2"],
    maturity: design(),
    referenceDesign: {
      name: "eVT-5000 and eSwarm-10",
      note: "VTOL platform and swarm controller, with a ground control station design",
      repoPath: `${CAD}/eAerospace_CAD_Design/uav_drone_systems`,
    },
    fundingTheme: "Resilience",
  },
  {
    id: "sustainable-electronics",
    name: "Sustainable & Circular Electronics",
    blurb:
      "Repairability, long-life firmware support, and design for disassembly.",
    group: "frontier",
    targetStandards: ["IEC 62368-1", "EU Ecodesign (ErP)"],
    maturity: sought(),
    referenceDesign: null,
    fundingTheme: "Decarbonisation",
  },
];

/** Industries in one group, in declaration order. */
export const industriesInGroup = (group: Industry["group"]): Industry[] =>
  INDUSTRIES.filter(i => i.group === group);

/** How many industries have a design behind them today. */
export const withReferenceDesign = (): number =>
  INDUSTRIES.filter(i => i.referenceDesign !== null).length;

/** The distinct funding themes present, in a stable order. */
export const FUNDING_THEMES: FundingTheme[] = [
  "Sovereignty",
  "Safety certification",
  "Decarbonisation",
  "Health access",
  "Resilience",
];
