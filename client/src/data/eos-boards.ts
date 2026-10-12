export const BOARD_STATUS =
  "designed and checked in KiCad; not yet manufactured or bench-tested";

export const BOARD_LICENSOR = {
  name: "Kartikeydheer Srivastava",
  email: "kartikeydheer@gmail.com",
  year: 2026,
} as const;

export const BOARD_SOURCE = {
  repo: "https://github.com/Kartikey1306/eCAD-Hardware-Products",
  ref: "feat/eos-dev-boards",
  commit: "7cd8d15",
  folder: "boards/eos",
  pullRequest:
    "https://github.com/embeddedos-org/eCAD-Hardware-Products/pull/54",
} as const;

export type BoardView = "iso" | "top" | "bottom";

export interface PixelSize {
  readonly width: number;
  readonly height: number;
}

export interface BoardChecks {
  readonly kicad: string;
  readonly ercViolations: number;
  readonly drcErrors: number;
  readonly unconnectedItems: number;
  readonly schematicParity: number;
  readonly drcWarnings: number;
  readonly warningNote?: string;
}

export interface EosBoard {
  readonly slug: string;
  readonly name: string;
  readonly purpose: string;
  readonly mainChip: string;
  readonly sizeMm: readonly [number, number];
  readonly layers: number;
  readonly stackup: string;
  readonly looks: string;
  readonly features: readonly string[];
  readonly checks: BoardChecks;
  readonly notYetDone: readonly string[];
  readonly thirdParty: readonly string[];
  readonly media: {
    readonly iso: PixelSize;
    readonly plan: PixelSize;
    readonly turntable: PixelSize;
  };
}

const RENDER_ISO: PixelSize = { width: 1600, height: 1052 };
const RENDER_PLAN: PixelSize = { width: 1200, height: 693 };
const KICAD_LIBRARIES =
  "Footprints, symbols and 3D models from KiCad's libraries: CC BY-SA 4.0, with the KiCad libraries' exception for designs that use them and files generated from those designs";

export const EOS_BOARDS: readonly EosBoard[] = [
  {
    slug: "eos-learn-rp2350",
    name: "EoS Learn RP2350",
    purpose:
      "A teaching board for the RP2350A, built around Raspberry Pi's own core layout, reproduced to the nanometre.",
    mainChip: "Raspberry Pi RP2350A",
    sizeMm: [52.6, 51.6],
    layers: 4,
    stackup: "signal, GND plane, 3.3 V plane, signal; 1.6 mm",
    looks:
      "the RP2350A at the centre, a 20-pin header down each side and the USB-C connector on one edge",
    features: [
      "RP2350A with a 12 MHz crystal and 128 Mbit QSPI flash (W25Q128JV)",
      "Raspberry Pi's RP2350A Minimal Design R4 core layout, kept unchanged: the parts' positions and 124 tracks, 25 vias and 7 zones are checked against it to KiCad's 1 nm resolution",
      "USB-C 5 V sink with USBLC6-2SC6 ESD protection",
      "500 mA polyfuse and a Schottky diode, so 5 V fed into the header never reaches the USB host, then an AP7361C 3.3 V regulator",
      "All 30 GPIOs on two 1×20, 2.54 mm headers, in pin order",
      "Qwiic (I2C0 on GPIO4/5) and a Raspberry Pi Debug Probe SWD connector",
      "BOOTSEL and RUN buttons, a power LED and a user LED on GPIO25",
    ],
    checks: {
      kicad: "10.0.6",
      ercViolations: 0,
      drcErrors: 0,
      unconnectedItems: 0,
      schematicParity: 0,
      drcWarnings: 4,
      warningNote:
        "Two short 3.3 V track ends in Raspberry Pi's unchanged copper, and two USB-C silkscreen lines clipped at the board edge, where the connector is meant to sit.",
    },
    notYetDone: [
      "No signal-integrity simulation of USB or QSPI. The QSPI routing is Raspberry Pi's own.",
    ],
    thirdParty: [
      "RP2350A core layout: Raspberry Pi RP2350A Minimal Design R4, Copyright (c) 2026 Raspberry Pi Ltd, MIT licence",
      KICAD_LIBRARIES,
    ],
    media: {
      iso: RENDER_ISO,
      plan: RENDER_PLAN,
      turntable: { width: 928, height: 616 },
    },
  },
  {
    slug: "eos-sense-cape",
    name: "EoS Sense Cape",
    purpose:
      "A sensor cape for BeagleBoard.org PocketBeagle, its fit checked pin for pin against PocketBeagle's own board file.",
    mainChip:
      "Bosch BME280, ST LIS3DH and Broadcom APDS-9306 sensors; PocketBeagle is the host",
    sizeMm: [55, 60],
    layers: 2,
    stackup: "ground poured on both sides; 1.6 mm",
    looks:
      "two 2×18 sockets for PocketBeagle, with the sensors, two buttons and the Qwiic connector below them",
    features: [
      "BME280 temperature, humidity and pressure sensor on I2C1 at 0x76",
      "LIS3DH accelerometer on I2C1 at 0x18, its INT1 on P2.03",
      "APDS-9306-065 ambient light sensor on I2C1 at 0x52",
      "24LC256 EEPROM on I2C2 at 0x57 for the cape's identity",
      "10 kΩ NTC thermistor on AIN5 and a trimmer on AIN6, kept under the processor's 1.8 V limit by PocketBeagle's own dividers",
      "4.7 kΩ pull-ups on I2C1 and I2C2, which PocketBeagle does not have",
      "Two buttons, two PWM LEDs and a Qwiic / STEMMA QT connector",
      "All 72 socket pads checked against PocketBeagle's header pins at KiCad's 1 nm resolution",
    ],
    checks: {
      kicad: "10.0.6",
      ercViolations: 0,
      drcErrors: 0,
      unconnectedItems: 0,
      schematicParity: 0,
      drcWarnings: 0,
    },
    notYetDone: [],
    thirdParty: [
      "PocketBeagle outline and P1/P2 header positions from BeagleBoard.org PocketBeagle, CC BY 4.0, used unchanged as positions only",
      KICAD_LIBRARIES,
    ],
    media: {
      iso: RENDER_ISO,
      plan: RENDER_PLAN,
      turntable: { width: 784, height: 504 },
    },
  },
  {
    slug: "eos-probe-s3",
    name: "EoS Probe S3",
    purpose:
      "An ESP32-S3 debug probe for Arm SWD/JTAG targets and their UART, working at the target's own I/O voltage from 1.65 to 5.5 V.",
    mainChip: "Espressif ESP32-S3 (ESP32-S3-WROOM-1-N8R2 module)",
    sizeMm: [62, 30],
    layers: 2,
    stackup: "ground poured on both sides; 1.6 mm",
    looks:
      "the ESP32-S3 module on one end with its antenna past the board edge, six level shifters in the middle and the USB-C connector on the other end",
    features: [
      "ESP32-S3-WROOM-1-N8R2 module, its antenna past the board edge so Espressif's keep-out falls off the board",
      "One SN74LVC1T45 level shifter per line, its target side powered from VTref, so an unpowered target is never driven",
      "Arm 10-pin Cortex Debug header (1.27 mm) for SWD/JTAG with SWO and an open-drain nRESET",
      "UART header (1×4, 2.54 mm)",
      "VTref sensed by the ESP32-S3's ADC through a 100 kΩ / 100 kΩ divider",
      "USB-C 5 V sink with USBLC6-2SC6 ESD protection, a 500 mA polyfuse and a 1 A AP7361C-33 regulator",
      "Reset and boot buttons, status and activity LEDs",
    ],
    checks: {
      kicad: "10.0.6",
      ercViolations: 0,
      drcErrors: 0,
      unconnectedItems: 0,
      schematicParity: 0,
      drcWarnings: 4,
      warningNote:
        "Silkscreen past the board edge: the module's outline over its antenna, and the USB-C connector, which is meant to sit on the edge.",
    },
    notYetDone: [
      "No firmware: the pin assignment is meant for CMSIS-DAP probe firmware on the ESP32-S3, but none has been ported or run on this board.",
    ],
    thirdParty: [KICAD_LIBRARIES],
    media: {
      iso: RENDER_ISO,
      plan: RENDER_PLAN,
      turntable: { width: 928, height: 616 },
    },
  },
  {
    slug: "eos-cm5-base",
    name: "EoS CM5 Base",
    purpose:
      "A carrier board for the Raspberry Pi Compute Module 5, with USB-C power, Gigabit Ethernet, a USB 2.0 host port, microSD and the 40-pin GPIO header.",
    mainChip: "Raspberry Pi Compute Module 5, on two 100-pin connectors",
    sizeMm: [90, 80],
    layers: 4,
    stackup: "signal, GND plane, 5 V plane, signal; 1.6 mm",
    looks:
      "the footprints of the two 100-pin module connectors, the USB-A port and the 40-pin GPIO header along one edge",
    features: [
      "Two Amphenol 10164227-1001A1RLF 100-pin connectors: all 200 pads, the module's four M2.5 holes and every ground, power and GPIO net checked against Raspberry Pi's CM5 data at KiCad's 1 nm resolution",
      "USB-C power in and USB 2.0 device for rpiboot flashing and gadget mode, with USBLC6-2SC6 ESD protection",
      "Gigabit Ethernet through a TRXCOM TRJG0926HENL MagJack, with TPD4EUSB30 ESD protection",
      "USB 2.0 host on a USB-A port, its 5 V switched by a TPS2051C",
      "microSD for CM5 Lite, powered through an RT9742GGJ5 switch",
      "Standard 40-pin Raspberry Pi GPIO header at 3.3 V",
      "Fan connector, RTC coin cell, power button, and nRPIBOOT and EEPROM write-protect jumpers",
    ],
    checks: {
      kicad: "10.0.6",
      ercViolations: 0,
      drcErrors: 0,
      unconnectedItems: 0,
      schematicParity: 0,
      drcWarnings: 6,
      warningNote:
        "Silkscreen of the USB-C, USB-A and RJ45 connectors past the board edge, where edge connectors belong.",
    },
    notYetDone: [
      "No signal-integrity simulation: the Ethernet and USB 2.0 pairs are kept short, but their impedance has not been calculated or simulated.",
      "HDMI, PCIe, USB 3.0 SuperSpeed and the camera and display (MIPI) interfaces are left off on purpose, because the generator cannot match or verify their differential pairs.",
      "The MagJack footprint is this project's own and has no 3D model.",
    ],
    thirdParty: [
      "CM5 connector and mounting-hole positions and the CM5 pinout, from Raspberry Pi's CM5 datasheet and CM5 IO Board design files (facts only)",
      "Schematic symbols in hardware/symbols, written by the repository's generator: MIT licence",
      KICAD_LIBRARIES,
    ],
    media: {
      iso: RENDER_ISO,
      plan: RENDER_PLAN,
      turntable: { width: 928, height: 616 },
    },
  },
];

export function boardImage(slug: string, view: BoardView): string {
  return `/media/board-${slug}-${view}`;
}

export function boardTurntable(slug: string): {
  video: string;
  poster: string;
} {
  return {
    video: `/media/board-${slug}-turntable.mp4`,
    poster: `/media/board-${slug}-turntable-poster.jpg`,
  };
}

export function boardFolderUrl(slug: string): string {
  return `${BOARD_SOURCE.repo}/tree/${BOARD_SOURCE.ref}/${BOARD_SOURCE.folder}/${slug}`;
}

export function boardMailto(subject: string): string {
  return `mailto:${BOARD_LICENSOR.email}?subject=${encodeURIComponent(subject)}`;
}
