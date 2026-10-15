export const BOARD_STATUS =
  "designed and checked in KiCad; not yet manufactured or bench-tested";

export const BOARD_LICENSOR = {
  name: "Kartikeydheer Srivastava",
  email: "kartikeydheer@gmail.com",
  year: 2026,
} as const;

export const BOARD_REPO =
  "https://github.com/embeddedos-org/eCAD-Hardware-Products";
export const BOARD_FOLDER = "boards/eos";

export interface BoardSource {
  readonly ref: string;
  readonly pullRequest: number;
}

export const BOARD_SOURCES = {
  merged: { ref: "master", pullRequest: 60 },
} as const satisfies Record<string, BoardSource>;

export type BoardView = "iso" | "top" | "bottom";

export interface PixelSize {
  readonly width: number;
  readonly height: number;
}

export interface BoardChecks {
  readonly commit: string;
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
  readonly category: string;
  readonly source: BoardSource;
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
    readonly thumb: PixelSize;
    readonly iso: PixelSize;
    readonly plan: PixelSize;
    readonly turntable: PixelSize;
  };
}

const RENDER_THUMB: PixelSize = { width: 480, height: 316 };
const RENDER_ISO: PixelSize = { width: 1600, height: 1052 };
const RENDER_PLAN: PixelSize = { width: 1200, height: 693 };
const KICAD_LIBRARIES =
  "Footprints, symbols and 3D models from KiCad's libraries: CC BY-SA 4.0, with the KiCad libraries' exception for designs that use them and files generated from those designs";

export const EOS_BOARDS: readonly EosBoard[] = [
  {
    slug: "eos-learn-rp2350",
    name: "EoS Learn RP2350",
    category: "Teaching board",
    source: BOARD_SOURCES.merged,
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
      commit: "28ec996",
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
      thumb: RENDER_THUMB,
      iso: RENDER_ISO,
      plan: RENDER_PLAN,
      turntable: { width: 928, height: 616 },
    },
  },
  {
    slug: "eos-esp32-devkit",
    name: "EoS ESP32 DevKit",
    category: "Development board",
    source: BOARD_SOURCES.merged,
    purpose:
      "A breadboard development board for the Espressif ESP32-WROOM-32E module: the same job as Espressif's ESP32-DevKitC V4, in an original design.",
    mainChip: "Espressif ESP32 (ESP32-WROOM-32E-N4 module)",
    sizeMm: [27.94, 48.76],
    layers: 2,
    stackup: "ground poured on both sides; 1.6 mm",
    looks:
      "the ESP32-WROOM-32E module at one end with its antenna past the edge, the EN and BOOT buttons, and a 19-pin header down each side",
    features: [
      "ESP32-WROOM-32E-N4 module (4 MB flash, no PSRAM), its whole antenna area overhanging the top edge so the antenna keep-out lies off the board",
      "USB-C 5 V sink with SP0503BAHTG ESD protection, a 500 mA polyfuse and a Schottky diode, so 5 V fed into the 5V pin cannot reach the USB host",
      "CP2102N USB-UART bridge with esptool's two-transistor automatic reset into the bootloader",
      "AP7361C-33 1 A 3.3 V regulator",
      "EN and BOOT buttons, a power LED and a user LED on IO4",
      "Every usable GPIO on two 1×19, 2.54 mm headers, on the DevKitC V4's header grid and in its pin order, with the JTAG pins there for an external adapter",
    ],
    checks: {
      commit: "28ec996",
      kicad: "10.0.6",
      ercViolations: 0,
      drcErrors: 0,
      unconnectedItems: 0,
      schematicParity: 0,
      drcWarnings: 8,
      warningNote:
        "Silkscreen past the board edge: the header rows and the USB-C connector sit at the edge, and the module's outline runs over its antenna overhang.",
    },
    notYetDone: [
      "Nothing has been measured: not the antenna on this base board, the regulator's temperature, the Schottky's leakage or the auto-reset timing with esptool.",
    ],
    thirdParty: [
      "Header grid, 27.94 mm board width and J2/J3 pin order from Espressif's ESP32-DevKitC V4 user guide and dimension drawing, used as positions and pin names only",
      KICAD_LIBRARIES,
    ],
    media: {
      thumb: RENDER_THUMB,
      iso: RENDER_ISO,
      plan: RENDER_PLAN,
      turntable: { width: 928, height: 616 },
    },
  },
  {
    slug: "eos-probe-s3",
    name: "EoS Probe S3",
    category: "Debug probe",
    source: BOARD_SOURCES.merged,
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
      commit: "28ec996",
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
      thumb: RENDER_THUMB,
      iso: RENDER_ISO,
      plan: RENDER_PLAN,
      turntable: { width: 928, height: 616 },
    },
  },
  {
    slug: "eos-sense-cape",
    name: "EoS Sense Cape",
    category: "PocketBeagle cape",
    source: BOARD_SOURCES.merged,
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
      commit: "28ec996",
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
      thumb: RENDER_THUMB,
      iso: RENDER_ISO,
      plan: RENDER_PLAN,
      turntable: { width: 784, height: 504 },
    },
  },
  {
    slug: "eos-motion-wing",
    name: "EoS Motion Wing",
    category: "FeatherWing",
    source: BOARD_SOURCES.merged,
    purpose:
      "An accelerometer and temperature FeatherWing: the same job as Adafruit's ADXL343 + ADT7410 Sensor FeatherWing, in an original design.",
    mainChip:
      "Analog Devices ADXL343 accelerometer and ADT7410 temperature sensor; a Feather is the host",
    sizeMm: [50.8, 22.86],
    layers: 2,
    stackup: "ground poured on both sides; 1.6 mm",
    looks:
      "the Feather header rows along both long edges, the two sensors between them and the address and interrupt solder jumpers",
    features: [
      "ADXL343 3-axis accelerometer on the Feather's I2C bus at 0x53, or 0x1D with its address jumper moved",
      "ADT7410 16-bit temperature sensor on the same bus at 0x48, with 0x49 to 0x4B set by jumpers",
      "Both sensors run from the Feather's 3V pin and draw well under 1 mA",
      "10 kΩ I2C pull-ups through a solder jumper, to cut when the Feather or another wing already pulls the bus up",
      "The ADXL343's INT1 and INT2 and the ADT7410's INT and CT reach D5, D6, D10 and D11 through solder jumpers, open as delivered",
      "FeatherWing outline, corner holes and header positions from Adafruit's Feather Specification, with male 1×16 and 1×12 headers on the back",
    ],
    checks: {
      commit: "28ec996",
      kicad: "10.0.6",
      ercViolations: 0,
      drcErrors: 0,
      unconnectedItems: 0,
      schematicParity: 0,
      drcWarnings: 5,
      warningNote:
        "The header outlines on the back silkscreen sit near the board edge, where the Feather Specification puts the header rows, 0.05 in from the edge.",
    },
    notYetDone: [
      "The ADXL343 values come from its data sheet Rev. 0; they have not been checked against the current Rev. A.",
      "How the accelerometer behaves on a Feather stack, away from a hard mounting point, has not been checked.",
      "The I2C pull-up limits are calculated, not measured, and no firmware or driver has been run against the board.",
    ],
    thirdParty: [
      "FeatherWing outline, corner holes, header positions and pin order from Adafruit's Feather Specification, used as dimensions only",
      "Schematic symbols in hardware/symbols (EoS_Sensors.kicad_sym), written by the repository's generator: MIT licence",
      KICAD_LIBRARIES,
    ],
    media: {
      thumb: RENDER_THUMB,
      iso: RENDER_ISO,
      plan: RENDER_PLAN,
      turntable: { width: 928, height: 616 },
    },
  },
  {
    slug: "eos-cm4-base",
    name: "EoS CM4 Base",
    category: "Compute module carrier",
    source: BOARD_SOURCES.merged,
    purpose:
      "A carrier board for the Raspberry Pi Compute Module 4: the same job as Raspberry Pi's CM4 IO Board, in an original design built on EoS CM5 Base's layout.",
    mainChip: "Raspberry Pi Compute Module 4, on two 100-pin connectors",
    sizeMm: [90, 80],
    layers: 4,
    stackup: "signal, GND plane, 5 V plane, signal; 1.6 mm",
    looks:
      "the footprints of the two 100-pin module connectors, the MagJack's pads and the 40-pin GPIO header along one edge",
    features: [
      "Two Hirose DF40C-100DS-0.4V 100-pin connectors for 1.5 mm stacking: all 200 pads, the four holes and every ground, 5 V, 3.3 V and GPIO pin's net checked at KiCad's 1 nm resolution, and the HDMI, camera, display, PCIe, 1.8 V and reserved pins checked to stay unconnected",
      "USB-C power in, for a 5 V / 3 A supply, with 5.1 kΩ on CC1 and CC2",
      "The CM4's one USB 2.0 port on two connectors: a jumper and a TI TS3USB30E switch send it to USB-C for rpiboot flashing and gadget mode, or to a USB-A host port whose 5 V comes through a TPS2051C",
      "Gigabit Ethernet through a TRXCOM TRJG0926HENL MagJack, with TPD4EUSB30 ESD protection",
      "microSD for CM4 Lite, powered through an RT9742GGJ5 switch",
      "Standard 40-pin Raspberry Pi GPIO header at 3.3 V",
      "Reset button through 220 Ω, a buffered power LED, an activity LED, a fan connector, and nRPIBOOT, EEPROM write-protect and USB host-mode jumpers",
      "No copper on any layer under the module's PCB antenna: the 8 × 15 mm cut-out the CM4 datasheet calls ideal, checked by a test",
    ],
    checks: {
      commit: "28ec996",
      kicad: "10.0.6",
      ercViolations: 0,
      drcErrors: 0,
      unconnectedItems: 0,
      schematicParity: 0,
      drcWarnings: 4,
      warningNote:
        "Silkscreen of the USB-C connector (J3) and the RJ45 MagJack (J5) past the board edge, where edge connectors belong.",
    },
    notYetDone: [
      "No signal-integrity simulation: the CM4 datasheet asks for 90 Ω differential pairs matched to 0.15 mm, and the generator matches no lengths, so the pairs are short but not matched.",
      "The USB switch's effect on the USB eye has not been measured.",
      "HDMI, PCIe and the camera and display (MIPI CSI and DSI) interfaces are left off on purpose, and there is no RTC coin cell or fan speed control.",
    ],
    thirdParty: [
      "CM4 pinout from the Raspberry Pi Compute Module 4 datasheet, section 4 (facts only)",
      "Connector and mounting-hole positions from the CM5 footprint in Raspberry Pi's CM5 IO Board files, which Figure 4 of the CM4 and CM5 datasheets shows the CM4 shares (facts only)",
      "Schematic symbols in hardware/symbols (EoS_Connectors.kicad_sym, EoS_Parts.kicad_sym), written by the repository's generator: MIT licence",
      KICAD_LIBRARIES,
    ],
    media: {
      thumb: RENDER_THUMB,
      iso: RENDER_ISO,
      plan: RENDER_PLAN,
      turntable: { width: 928, height: 616 },
    },
  },
  {
    slug: "eos-cm5-base",
    name: "EoS CM5 Base",
    category: "Compute module carrier",
    source: BOARD_SOURCES.merged,
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
      "No copper on any layer under the module's PCB antenna: the 8 × 15 mm cut-out the CM5 datasheet calls ideal, where its Figure 4 puts the antenna, checked by a test",
    ],
    checks: {
      commit: "28ec996",
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
      thumb: RENDER_THUMB,
      iso: RENDER_ISO,
      plan: RENDER_PLAN,
      turntable: { width: 928, height: 616 },
    },
  },
  {
    slug: "eos-atmega328p-board",
    name: "EoS ATmega328P Board",
    category: "Development board",
    source: BOARD_SOURCES.merged,
    purpose:
      "A 5 V, 16 MHz development board with the Uno R3 shield header layout and an original power and USB circuit.",
    mainChip: "Microchip ATmega328P-AU",
    sizeMm: [68.58, 53.34],
    layers: 2,
    stackup: "ground poured on both sides; 1.6 mm",
    looks:
      "the ATmega328P between the shield headers, a barrel jack and USB-C on the left edge",
    features: [
      "ATmega328P at 16 MHz, with ICSP programming and reset button",
      "CH340C USB-UART with Ioff-rated isolation buffers and DTR auto-reset",
      "USB-C or 7–12 V barrel input; AP63205 buck and TPS2116 power mux",
      "Uno R3 shield headers, a 3.3 V output and power/user LEDs",
    ],
    checks: {
      commit: "28ec996",
      kicad: "10.0.6",
      ercViolations: 0,
      drcErrors: 0,
      unconnectedItems: 0,
      schematicParity: 0,
      drcWarnings: 4,
      warningNote:
        "Silkscreen outlines within the board-edge clearance at the edge connectors; see the board README for the recorded warnings.",
    },
    notYetDone: [
      "No firmware or bootloader has been run on this board; crystal margin and auto-reset timing remain unmeasured.",
      "The 3.3 V header is an output. High-current shields need an external supply and must follow the README power limits.",
    ],
    thirdParty: [
      "Uno R3 header and mounting-hole dimensions from published dimension drawings and the Arduino product reference manual",
      KICAD_LIBRARIES,
    ],
    media: {
      thumb: {
        width: 480,
        height: 316,
      },
      iso: {
        width: 1600,
        height: 1052,
      },
      plan: {
        width: 1200,
        height: 693,
      },
      turntable: {
        width: 704,
        height: 448,
      },
    },
  },
  {
    slug: "eos-msp430g2-board",
    name: "EoS MSP430G2 Board",
    category: "Development board",
    source: BOARD_SOURCES.merged,
    purpose:
      "A socketed MSP430G2553 development board with 20-pin BoosterPack headers and an external Spy-Bi-Wire debug connection.",
    mainChip: "Texas Instruments MSP430G2553IN20",
    sizeMm: [56.0, 80.0],
    layers: 2,
    stackup: "ground poured on both sides; 1.6 mm",
    looks:
      "a DIP-20 socket between the expansion headers, with USB-C and a debug header above it",
    features: [
      "Socketed DIP-20 MSP430G2553 and a 32.768 kHz crystal",
      "20-pin BoosterPack header layout",
      "CP2102N USB-UART bridge and USB-C power input",
      "MSP-FET connector for external Spy-Bi-Wire programming; no on-board eZ-FET",
    ],
    checks: {
      commit: "28ec996",
      kicad: "10.0.6",
      ercViolations: 0,
      drcErrors: 0,
      unconnectedItems: 0,
      schematicParity: 0,
      drcWarnings: 2,
      warningNote:
        "Silkscreen outlines within the board-edge clearance at the edge connectors; see the board README for the recorded warnings.",
    },
    notYetDone: [
      "No firmware, oscillator start-up or connected BoosterPack has been tested.",
      "Programming needs an external Spy-Bi-Wire probe; security-fuse programming is not connected.",
    ],
    thirdParty: [
      "20-pin BoosterPack header facts from TI’s published BoosterPack standard",
      KICAD_LIBRARIES,
    ],
    media: {
      thumb: {
        width: 480,
        height: 316,
      },
      iso: {
        width: 1600,
        height: 1052,
      },
      plan: {
        width: 1200,
        height: 693,
      },
      turntable: {
        width: 704,
        height: 448,
      },
    },
  },
  {
    slug: "eos-tm4c123-board",
    name: "EoS TM4C123 Board",
    category: "Development board",
    source: BOARD_SOURCES.merged,
    purpose:
      "A Cortex-M4F development board with 40-pin BoosterPack headers, separate USB device and serial ports, and external SWD/JTAG.",
    mainChip: "Texas Instruments TM4C123GH6PM",
    sizeMm: [50.8, 60.0],
    layers: 2,
    stackup: "ground poured on both sides; 1.6 mm",
    looks:
      "the LQFP-64 MCU between four expansion-header rows, with two USB-C connectors",
    features: [
      "TM4C123GH6PM with 16 MHz and 32.768 kHz crystals",
      "40-pin BoosterPack expansion headers",
      "MCU USB device port and a separate CP2102N USB-UART port",
      "Cortex 10-pin SWD/JTAG header replaces the on-board debug interface",
    ],
    checks: {
      commit: "28ec996",
      kicad: "10.0.6",
      ercViolations: 0,
      drcErrors: 0,
      unconnectedItems: 0,
      schematicParity: 0,
      drcWarnings: 4,
      warningNote:
        "Silkscreen outlines within the board-edge clearance at the edge connectors; see the board README for the recorded warnings.",
    },
    notYetDone: [
      "The BoosterPack 5 V power path has a documented back-feed limitation; read the README before connecting an externally powered BoosterPack.",
      "No hardware, firmware, USB signal integrity or thermal behaviour has been tested.",
    ],
    thirdParty: [
      "Schematic symbols in hardware/symbols (EoS_MCU.kicad_sym), written by the repository’s generator: MIT licence",
      "40-pin BoosterPack header positions and pin roles from TI’s published BoosterPack standards",
      KICAD_LIBRARIES,
    ],
    media: {
      thumb: {
        width: 480,
        height: 316,
      },
      iso: {
        width: 1600,
        height: 1052,
      },
      plan: {
        width: 1200,
        height: 693,
      },
      turntable: {
        width: 704,
        height: 448,
      },
    },
  },
  {
    slug: "eos-kl25-board",
    name: "EoS KL25 Board",
    category: "Development board",
    source: BOARD_SOURCES.merged,
    purpose:
      "A 3.3 V Cortex-M0+ board with Uno R3 shield headers, a USB device port and an accelerometer.",
    mainChip: "NXP MKL25Z128VLK4",
    sizeMm: [68.58, 53.34],
    layers: 2,
    stackup: "ground poured on both sides; 1.6 mm",
    looks:
      "the LQFP-80 MCU and accelerometer inside the shield headers, beside two USB-C connectors",
    features: [
      "Kinetis KL25Z with an 8 MHz crystal",
      "MCU USB device port plus a CP2102N USB-UART bridge",
      "LIS2HH12 accelerometer, RGB LED and reset button",
      "Uno R3 header layout and Cortex 10-pin SWD header replacing OpenSDA",
    ],
    checks: {
      commit: "28ec996",
      kicad: "10.0.6",
      ercViolations: 0,
      drcErrors: 0,
      unconnectedItems: 0,
      schematicParity: 0,
      drcWarnings: 4,
      warningNote:
        "Silkscreen outlines within the board-edge clearance at the edge connectors; see the board README for the recorded warnings.",
    },
    notYetDone: [
      "Use only 3.3 V shields or shields that follow IOREF; 5 V logic can damage the MCU.",
      "No touch slider or 7–12 V input; VIN is unconnected. No firmware or shield compatibility has been tested.",
    ],
    thirdParty: [
      "Uno R3 header and mounting-hole dimensions from published dimension drawings and the Arduino product reference manual",
      KICAD_LIBRARIES,
    ],
    media: {
      thumb: {
        width: 480,
        height: 316,
      },
      iso: {
        width: 1600,
        height: 1052,
      },
      plan: {
        width: 1200,
        height: 693,
      },
      turntable: {
        width: 704,
        height: 448,
      },
    },
  },
  {
    slug: "eos-stm32-64",
    name: "EoS STM32 64",
    category: "Development board",
    source: BOARD_SOURCES.merged,
    purpose:
      "A 3.3 V Cortex-M4F board in the Nucleo-64 format, with morpho and Uno headers and an external debug connection.",
    mainChip: "STMicroelectronics STM32F411RE",
    sizeMm: [70.0, 82.5],
    layers: 2,
    stackup: "ground poured on both sides; 1.6 mm",
    looks:
      "two long morpho headers around the MCU and shield headers, with two USB-C ports",
    features: [
      "STM32F411RE with 8 MHz and 32.768 kHz crystals",
      "Uno V3 and two 2×19 morpho headers",
      "CP2102N USART2 console and a separate MCU USB port for ROM DFU",
      "Cortex Debug header replaces ST-LINK; USB and 7–12 V buck power paths",
    ],
    checks: {
      commit: "28ec996",
      kicad: "10.0.6",
      ercViolations: 0,
      drcErrors: 0,
      unconnectedItems: 0,
      schematicParity: 0,
      drcWarnings: 4,
      warningNote:
        "Silkscreen outlines within the board-edge clearance at the edge connectors; see the board README for the recorded warnings.",
    },
    notYetDone: [
      "The console UART is not the F411 ROM bootloader UART; use USB DFU or an external probe.",
      "No USB host power switch. No firmware, oscillator or shield fit has been bench-tested.",
    ],
    thirdParty: [
      "Nucleo-64 dimensions and header pin assignments from ST’s published UM1724 user manual",
      KICAD_LIBRARIES,
    ],
    media: {
      thumb: {
        width: 480,
        height: 316,
      },
      iso: {
        width: 1600,
        height: 1052,
      },
      plan: {
        width: 1200,
        height: 693,
      },
      turntable: {
        width: 704,
        height: 448,
      },
    },
  },
  {
    slug: "eos-lpc55s69-board",
    name: "EoS LPC55S69 Board",
    category: "Development board",
    source: BOARD_SOURCES.merged,
    purpose:
      "A dual Cortex-M33 board with Uno R3 shield headers, full-speed USB, a serial bridge and external SWD.",
    mainChip: "NXP LPC55S69JBD100",
    sizeMm: [68.58, 53.34],
    layers: 4,
    stackup: "signal, GND plane, 3.3 V plane, signal; 1.6 mm",
    looks:
      "the exposed-pad HLQFP-100 MCU inside the shield headers, with two USB-C ports",
    features: [
      "LPC55S69 with 16 MHz and 32.768 kHz crystals",
      "Four layers with internal GND and 3.3 V planes",
      "USB0 full-speed device and CP2102N USB-UART on separate ports",
      "TPS2116 power mux, TPS7A91 regulator and external SWD header replacing LPC-Link2",
    ],
    checks: {
      commit: "28ec996",
      kicad: "10.0.6",
      ercViolations: 0,
      drcErrors: 0,
      unconnectedItems: 0,
      schematicParity: 0,
      drcWarnings: 4,
      warningNote:
        "Silkscreen outlines within the board-edge clearance at the edge connectors; see the board README for the recorded warnings.",
    },
    notYetDone: [
      "USB1 high speed, audio codec, microSD and extra expansion connectors are omitted.",
      "Use 3.3 V shield logic. AREF, VIN and the Uno ICSP header are not connected or fitted; I2C is separate from A4/A5.",
      "No firmware, USB signal integrity or hardware performance has been tested.",
    ],
    thirdParty: [
      "Schematic symbols in hardware/symbols (EoS_MCU.kicad_sym), written by the repository’s generator: MIT licence",
      "Uno R3 header and mounting-hole dimensions from published dimension drawings and the Arduino product reference manual",
      KICAD_LIBRARIES,
    ],
    media: {
      thumb: {
        width: 480,
        height: 316,
      },
      iso: {
        width: 1600,
        height: 1052,
      },
      plan: {
        width: 1200,
        height: 693,
      },
      turntable: {
        width: 704,
        height: 448,
      },
    },
  },
  {
    slug: "eos-ke16z-board",
    name: "EoS KE16Z Board",
    category: "Development board",
    source: BOARD_SOURCES.merged,
    purpose:
      "A 3.3 V Kinetis KE16Z board with Uno R3 shield headers, USB serial and CAN-controller pins for an external transceiver.",
    mainChip: "NXP MKE16Z64VLF4",
    sizeMm: [68.58, 53.34],
    layers: 2,
    stackup: "ground poured on both sides; 1.6 mm",
    looks:
      "the LQFP-48 MCU between the shield headers, with USB-C, buttons and an RGB LED",
    features: [
      "48 MHz Cortex-M0+ with 64 KB flash, 8 KB SRAM and an 8 MHz crystal",
      "CP2102N on LPUART1 and USB-C power",
      "RGB LED, reset and two user buttons",
      "External SWD replaces OpenSDA; MSCAN pins reach a separate header",
    ],
    checks: {
      commit: "28ec996",
      kicad: "10.0.6",
      ercViolations: 0,
      drcErrors: 0,
      unconnectedItems: 0,
      schematicParity: 0,
      drcWarnings: 2,
      warningNote:
        "Silkscreen outlines within the board-edge clearance at the edge connectors; see the board README for the recorded warnings.",
    },
    notYetDone: [
      "Use 3.3 V shield logic; never feed the 3V3 or IOREF outputs.",
      "No CAN transceiver, touch electrodes, thermistor or 7–12 V input. VIN is unconnected.",
      "No firmware, bus communication or thermal behaviour has been tested.",
    ],
    thirdParty: [
      "Uno R3 header and mounting-hole dimensions from published dimension drawings and the Arduino product reference manual",
      KICAD_LIBRARIES,
    ],
    media: {
      thumb: {
        width: 480,
        height: 316,
      },
      iso: {
        width: 1600,
        height: 1052,
      },
      plan: {
        width: 1200,
        height: 693,
      },
      turntable: {
        width: 704,
        height: 448,
      },
    },
  },
  {
    slug: "eos-ra2e1-board",
    name: "EoS RA2E1 Board",
    category: "Development board",
    source: BOARD_SOURCES.merged,
    purpose:
      "A Cortex-M23 board with Uno R3 shield headers, two Pmod connectors and a USB serial interface on the boot-programming UART.",
    mainChip: "Renesas R7FA2E1A92DFM",
    sizeMm: [68.58, 53.34],
    layers: 2,
    stackup: "ground poured on both sides; 1.6 mm",
    looks:
      "the LQFP-64 MCU between the shield headers, with Pmod connectors and a USB-C port",
    features: [
      "48 MHz RA2E1 with 128 KB code flash and 16 KB SRAM",
      "CP2102N on SCI9 for console and serial boot programming with the MD jumper",
      "Two Pmod headers and Uno R3 shield header layout",
      "Cortex 10-pin SWD replaces J-Link OB; TPS7A91 3.3 V supply and 32.768 kHz crystal",
    ],
    checks: {
      commit: "28ec996",
      kicad: "10.0.6",
      ercViolations: 0,
      drcErrors: 0,
      unconnectedItems: 0,
      schematicParity: 0,
      drcWarnings: 2,
      warningNote:
        "Silkscreen outlines within the board-edge clearance at the edge connectors; see the board README for the recorded warnings.",
    },
    notYetDone: [
      "Use 3.3 V shield logic; AREF and VIN are unconnected and I2C is separate from A4/A5.",
      "No touch electrode, main crystal or Uno ICSP header. No firmware, boot programming or connected module has been tested.",
    ],
    thirdParty: [
      "Schematic symbols in hardware/symbols (EoS_MCU.kicad_sym), written by the repository’s generator: MIT licence",
      "Uno R3 header dimensions from published drawings; Pmod facts from Digilent’s Pmod Interface Specification",
      KICAD_LIBRARIES,
    ],
    media: {
      thumb: {
        width: 480,
        height: 316,
      },
      iso: {
        width: 1600,
        height: 1052,
      },
      plan: {
        width: 1200,
        height: 693,
      },
      turntable: {
        width: 704,
        height: 448,
      },
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

export function boardThumb(slug: string): string {
  return `/media/board-${slug}-thumb`;
}

export function boardFolderUrl(board: EosBoard): string {
  return `${BOARD_REPO}/tree/${board.source.ref}/${BOARD_FOLDER}/${board.slug}`;
}

export function pullRequestUrl(pullRequest: number): string {
  return `https://github.com/embeddedos-org/eCAD-Hardware-Products/pull/${pullRequest}`;
}

export function boardMailto(subject: string): string {
  return `mailto:${BOARD_LICENSOR.email}?subject=${encodeURIComponent(subject)}`;
}
