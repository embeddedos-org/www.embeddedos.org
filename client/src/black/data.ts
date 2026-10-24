/**
 * The fifteen original EoS boards, for the homepage showcase. Source: each
 * board's README and build report in eCAD-Hardware-Products
 * (boards/eos/<folder>), as summarised in its content/hardware.md. Board
 * designs are © Kartikeydheer Srivastava, all rights reserved; EmbeddedOS may
 * use them.
 */
export interface EosBoard {
  slug: string;
  folder: string;
  name: string;
  kind: string;
  chip: string;
  size: string;
  layers: number;
  purpose: string;
  facts: string[];
}

/**
 * The homepage's media folder (story frames, boards, film, industry clips).
 * Its files are served as immutable for a year (.htaccess) and their names
 * carry no content hash, so new media goes in a new folder: change this name
 * whenever any of it changes.
 */
export const MEDIA_HOME = "/media/home-2026-10-22/";

export const BOARDS_URL =
  "https://github.com/embeddedos-org/eCAD-Hardware-Products/tree/master/boards/eos/";

/** KiCad 10.0.6 results shared by every board (build-report.json). */
export const BOARD_CHECKS = "0 ERC · 0 DRC · 0 unconnected";

export const EOS_BOARDS: EosBoard[] = [
  {
    slug: "learn-rp2350",
    folder: "eos-learn-rp2350",
    name: "EoS Learn RP2350",
    kind: "Teaching board",
    chip: "RP2350A",
    size: "52.6 × 51.6",
    layers: 4,
    purpose:
      "A teaching board for the RP2350A, with every GPIO broken out in pin order.",
    facts: [
      "RP2350A with a 12 MHz crystal and 128 Mbit QSPI flash.",
      "USB-C (5 V sink) with ESD protection, a polyfuse and a Schottky diode, so 5 V fed into the header can power the board but never reach the USB host.",
      "All 30 GPIOs on two 1×20 headers in pin order, plus Qwiic, a 3-pin SWD debug connector, BOOTSEL and RUN buttons.",
      "The RP2350A core layout is kept unchanged, checked at KiCad’s 1 nm resolution.",
    ],
  },
  {
    slug: "esp32-devkit",
    folder: "eos-esp32-devkit",
    name: "EoS ESP32 DevKit",
    kind: "Development board",
    chip: "ESP32-WROOM-32E module",
    size: "27.94 × 48.76",
    layers: 2,
    purpose:
      "A breadboard development board for the ESP32-WROOM-32E module, in an original design.",
    facts: [
      "USB-C in, a CP2102N USB-UART bridge with esptool’s automatic reset into the bootloader, a 1 A 3.3 V regulator, EN and BOOT buttons.",
      "Every usable GPIO on two 1×19 headers, on the ESP32-DevKitC V4 grid.",
      "Power from USB-C, the 5V pin or the 3V3 pin; the antenna keep-out lies off the board.",
      "No mounting holes: it is meant for a breadboard or a socket.",
    ],
  },
  {
    slug: "probe-s3",
    folder: "eos-probe-s3",
    name: "EoS Probe S3",
    kind: "Debug probe",
    chip: "ESP32-S3-WROOM-1 module",
    size: "62 × 30",
    layers: 2,
    purpose:
      "An ESP32-S3 debug probe for Arm SWD/JTAG targets and their UART, working at the target’s own I/O voltage from 1.65 to 5.5 V.",
    facts: [
      "The target voltage is read from VTref through one level shifter per line; if either supply is off, both ports go high-impedance.",
      "Arm 10-pin Cortex Debug header (1.27 mm) and a 1×4 UART header.",
      "USB-C (5 V sink) with ESD protection and a polyfuse.",
      "No firmware is included: the pins are assigned for CMSIS-DAP, but none has been ported or run.",
    ],
  },
  {
    slug: "cm5-base",
    folder: "eos-cm5-base",
    name: "EoS CM5 Base",
    kind: "Compute module carrier",
    chip: "Compute Module 5",
    size: "90 × 80",
    layers: 4,
    purpose:
      "A carrier board for Compute Module 5, with USB-C power, Gigabit Ethernet, a USB 2.0 host port, microSD and the 40-pin GPIO header.",
    facts: [
      "One USB-C for power in and USB 2.0 device (rpiboot flashing, gadget mode); the module negotiates its own power.",
      "USB-A host, a Gigabit Ethernet MagJack, microSD (CM5 Lite) and the 40-pin GPIO header.",
      "Fan connector with PWM and tacho, an RTC coin cell, a power button, power and activity LEDs.",
      "Two 100-pin module connectors, all 200 pads checked at 1 nm; copper kept clear under the module antenna.",
    ],
  },
  {
    slug: "cm4-base",
    folder: "eos-cm4-base",
    name: "EoS CM4 Base",
    kind: "Compute module carrier",
    chip: "Compute Module 4",
    size: "90 × 80",
    layers: 4,
    purpose: "A carrier board for Compute Module 4.",
    facts: [
      "USB-C power in (5 V / 3 A sink).",
      "One USB 2.0 port switched by jumper between USB-C (device: rpiboot flashing, gadget mode) and USB-A (host).",
      "Gigabit Ethernet MagJack, microSD (CM4 Lite), the 40-pin GPIO header and a 5 V fan connector.",
      "HDMI, PCIe and MIPI are left off on purpose.",
    ],
  },
  {
    slug: "sense-cape",
    folder: "eos-sense-cape",
    name: "EoS Sense Cape",
    kind: "PocketBeagle cape",
    chip: "BME280, LIS3DH, APDS-9306 sensors",
    size: "55 × 60",
    layers: 2,
    purpose:
      "A sensor cape for BeagleBoard.org PocketBeagle, its fit checked pin for pin against PocketBeagle’s own board file.",
    facts: [
      "BME280 (temperature, humidity, pressure), LIS3DH accelerometer and APDS-9306 ambient light on I2C1.",
      "A 24LC256 EEPROM on I2C2 for cape identity.",
      "An NTC, a trimmer, two buttons, two LEDs on PWM pins and Qwiic / STEMMA QT.",
      "PocketBeagle plugs in on top; all 72 socket pads are checked at 1 nm.",
    ],
  },
  {
    slug: "motion-wing",
    folder: "eos-motion-wing",
    name: "EoS Motion Wing",
    kind: "FeatherWing",
    chip: "ADXL343 accelerometer, ADT7410 temperature",
    size: "50.8 × 22.86",
    layers: 2,
    purpose: "An accelerometer and temperature FeatherWing.",
    facts: [
      "An ADXL343 3-axis accelerometer and an ADT7410 16-bit temperature sensor share the Feather’s I2C bus.",
      "I2C addresses selectable by jumper; pull-ups through a cuttable jumper.",
      "Interrupt lines reach D5, D6, D10 and D11 through solder jumpers.",
      "Outline and headers follow Adafruit’s Feather Specification.",
    ],
  },
  {
    slug: "stm32-64",
    folder: "eos-stm32-64",
    name: "EoS STM32 64",
    kind: "Development board",
    chip: "ST STM32F411RE (Cortex-M4F)",
    size: "70 × 82.5",
    layers: 2,
    purpose:
      "A 3.3 V Cortex-M4F board in the Nucleo-64 format, with morpho and Uno headers and an external debug connection.",
    facts: [
      "STM32F411RET6 with 8 MHz and 32.768 kHz crystals.",
      "Arduino Uno V3 headers and both ST morpho headers where a Nucleo-64 has them, with the same signals.",
      "Two USB-C ports: a CP2102N serial bridge, and the MCU’s own USB for ROM DFU flashing with no probe.",
      "A 10-pin Cortex Debug connector replaces ST-LINK.",
    ],
  },
  {
    slug: "lpc55s69",
    folder: "eos-lpc55s69-board",
    name: "EoS LPC55S69 Board",
    kind: "Development board",
    chip: "NXP LPC55S69 (dual Cortex-M33)",
    size: "68.58 × 53.34",
    layers: 4,
    purpose:
      "A dual Cortex-M33 board with Uno R3 shield headers, full-speed USB, a serial bridge and external SWD.",
    facts: [
      "LPC55S69JBD100 with 16 MHz and 32.768 kHz crystals.",
      "Two USB-C sinks feed a power mux; full-speed USB0 on one, a CP2102N debug UART on the other.",
      "An Arm 10-pin SWD header replaces LPC-Link2.",
      "Uno R3 headers at 3.3 V logic, an RGB LED, reset, ISP and user buttons.",
    ],
  },
  {
    slug: "tm4c123",
    folder: "eos-tm4c123-board",
    name: "EoS TM4C123 Board",
    kind: "Development board",
    chip: "TI TM4C123GH6PM (Cortex-M4F)",
    size: "50.8 × 60",
    layers: 2,
    purpose:
      "A BoosterPack-compatible (40-pin) development board for the TI TM4C123GH6PM.",
    facts: [
      "A USB-C device port on the MCU’s own USB and a second USB-C with a CP2102N on UART0.",
      "A jumper picks which port powers the board, so one host never feeds the other.",
      "Arm Cortex Debug 10-pin header (SWD/JTAG); TI’s ICDI is not on the board.",
      "RGB LED, user, reset and WAKE buttons, four BoosterPack headers.",
    ],
  },
  {
    slug: "kl25",
    folder: "eos-kl25-board",
    name: "EoS KL25 Board",
    kind: "Development board",
    chip: "NXP MKL25Z128 (Cortex-M0+)",
    size: "68.58 × 53.34",
    layers: 2,
    purpose: "An NXP Kinetis KL25 development board that fits Uno R3 shields.",
    facts: [
      "The KL25’s own full-speed USB on one USB-C port, a CP2102N USB-UART bridge on a second.",
      "An 8 MHz crystal, an RGB LED, a LIS2HH12 accelerometer and a reset button.",
      "An Arm Cortex 10-pin SWD header in place of OpenSDA.",
      "3.3 V I/O: use 3.3 V shields, or shields that follow IOREF.",
    ],
  },
  {
    slug: "atmega328p",
    folder: "eos-atmega328p-board",
    name: "EoS ATmega328P Board",
    kind: "Development board",
    chip: "Microchip ATmega328P",
    size: "68.58 × 53.34",
    layers: 2,
    purpose: "An ATmega328P development board that fits Uno R3 shields.",
    facts: [
      "ATmega328P-AU at 16 MHz from 5 V.",
      "Power from USB-C or a 7–12 V barrel jack, with a power mux that blocks reverse current.",
      "A CH340C bridges USB to the UART and resets the MCU from DTR, so sketches upload over USB the usual way.",
      "Not an Arduino product; no bootloader is included or tested.",
    ],
  },
  {
    slug: "msp430g2",
    folder: "eos-msp430g2-board",
    name: "EoS MSP430G2 Board",
    kind: "Development board",
    chip: "TI MSP430G2553",
    size: "56 × 80",
    layers: 2,
    purpose:
      "A BoosterPack-compatible (20-pin) MSP430G2553 board with the chip in a DIP-20 socket.",
    facts: [
      "The socketed chip can be swapped, or programmed here and moved to another board.",
      "Two 1×10 BoosterPack headers; USB-C feeds a CP2102N serial bridge and an LDO.",
      "A 14-pin MSP-FET connector (Spy-Bi-Wire) takes the place of TI’s eZ-FET.",
      "A jumper lets an ammeter measure the MCU alone.",
    ],
  },
  {
    slug: "ke16z",
    folder: "eos-ke16z-board",
    name: "EoS KE16Z Board",
    kind: "Development board",
    chip: "NXP MKE16Z64",
    size: "68.58 × 53.34",
    layers: 2,
    purpose: "An NXP Kinetis KE16Z development board that fits Uno R3 shields.",
    facts: [
      "Cortex-M0+ at 48 MHz, 64 KB flash, 8 KB SRAM, MSCAN.",
      "A USB-C port with a CP2102N USB-UART bridge on the Uno’s D0/D1 pins.",
      "An Arm Cortex 10-pin SWD header in place of OpenSDA; MSCAN pins broken out for a CAN transceiver.",
      "3.3 V I/O; VIN is not connected.",
    ],
  },
  {
    slug: "ra2e1",
    folder: "eos-ra2e1-board",
    name: "EoS RA2E1 Board",
    kind: "Development board",
    chip: "Renesas RA2E1 (Cortex-M23)",
    size: "68.58 × 53.34",
    layers: 2,
    purpose:
      "A Renesas RA2E1 development board that fits Arduino Uno R3 shields and Digilent Pmod modules.",
    facts: [
      "Runs at 3.3 V from the RA2E1’s 48 MHz on-chip oscillator; no main crystal.",
      "One USB-C powers the board and carries a CP2102N bridge: the console and, with the MD jumper fitted, the flash programmer.",
      "An Arm 10-pin SWD header replaces the J-Link OB.",
      "Two Pmod host ports (SPI and I²C, 3.3 V only).",
    ],
  },
];

/** The making-of film: chapter starts and segment cuts in seconds (tools/film-mk.json). */
export const FILM = {
  length: "1 min 23 s",
  chapters: [
    ["Start", 0],
    ["The schematic", 5],
    ["The parts", 18],
    ["The copper", 30],
    ["The checks", 46],
    ["The board", 52],
    ["The first second", 63],
    ["The files", 76],
  ] as [string, number][],
  segments: [0, 5, 11.5, 18, 24, 30, 38, 46, 52, 57.5, 63, 69.5, 76, 83],
};
