import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { copyText } from "@/lib/clipboard";
import { SIM_PLATFORM_COUNT } from "@/data/stack";
import {
  Terminal,
  Cpu,
  Package,
  PenTool,
  ArrowRight,
  CheckCircle2,
  Copy,
  ChevronRight,
  Monitor,
  Wifi,
  Brain,
  HardDrive,
  Code,
  Layers,
  Play,
  Shield,
  Wrench,
  Info,
  AlertCircle,
  Star,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      delay: i * 0.07,
      ease: [0.23, 1, 0.32, 1] as [number, number, number, number],
    },
  }),
};

const ECOSYSTEM = [
  {
    id: "ebuild",
    name: "ebuild",
    role: "Build Tool",
    desc: "Compiles, links, analyzes CAD, and flashes firmware. The single CLI for the entire EoS lifecycle.",
    color: "#F97316",
    icon: Wrench,
  },
  {
    id: "eosim",
    name: "EoSim",
    role: "Simulator",
    desc: `Runs your firmware in-browser on ${SIM_PLATFORM_COUNT} virtual platforms. No hardware required — ever.`,
    color: "#22D3EE",
    icon: Monitor,
  },
  {
    id: "eos",
    name: "EoS Kernel",
    role: "RTOS Kernel",
    desc: "The real-time OS kernel. Provides HAL, scheduler, IPC, drivers, and POSIX subset.",
    color: "#F97316",
    icon: Cpu,
  },
  {
    id: "eboot",
    name: "eBoot",
    role: "Bootloader",
    desc: "Secure bootloader with verified boot, OTA A/B updates, and hardware root of trust.",
    color: "#F59E0B",
    icon: Shield,
  },
  {
    id: "eflow",
    name: "eFlow",
    role: "Visual Programming",
    desc: "Drag-and-drop block editor that generates production C code. No assembly needed for common patterns.",
    color: "#A78BFA",
    icon: Layers,
  },
  {
    id: "eai",
    name: "EAI / ENI",
    role: "Edge AI",
    desc: "On-device TFLite/ONNX inference and neural interface adapter for BCI devices.",
    color: "#34D399",
    icon: Brain,
  },
  {
    id: "eapps",
    name: "eApps",
    role: "App Ecosystem",
    desc: "60+ apps including eOffice Suite, eBrowser, eDB, and eBot AI assistant.",
    color: "#60A5FA",
    icon: Package,
  },
  {
    id: "eostudio",
    name: "EoStudio",
    role: "IDE",
    desc: "Universal IDE with AI tutor, 3D modeler, game editor, and UI designer.",
    color: "#F472B6",
    icon: Code,
  },
];

type Path = "nosim" | "sim" | "stm32" | "esp32" | "apps" | "hardware-design";

const PATHS: {
  id: Path;
  icon: typeof Terminal;
  label: string;
  sublabel: string;
  color: string;
  badge?: string;
}[] = [
  {
    id: "nosim",
    icon: Play,
    label: "No Hardware, No Install",
    sublabel: "Run in browser — 60 seconds",
    color: "#34D399",
    badge: "Fastest",
  },
  {
    id: "sim",
    icon: Monitor,
    label: "Simulator on My Computer",
    sublabel: "Full EoSim CLI + ebuild",
    color: "#22D3EE",
  },
  {
    id: "esp32",
    icon: Wifi,
    label: "I Have an ESP32",
    sublabel: "Flash EoS to $5 board",
    color: "#F97316",
  },
  {
    id: "stm32",
    icon: Cpu,
    label: "I Have an STM32",
    sublabel: "Nucleo / Discovery board",
    color: "#22D3EE",
  },
  {
    id: "apps",
    icon: Package,
    label: "I Want to Build eApps",
    sublabel: "C + LVGL cross-platform apps",
    color: "#F59E0B",
  },
  {
    id: "hardware-design",
    icon: PenTool,
    label: "I'm a Hardware Engineer",
    sublabel: "CAD → ebuild → simulate → flash",
    color: "#A78BFA",
  },
];

interface Step {
  title: string;
  text?: string;
  code?: string;
  tip?: string;
  warn?: string;
  substeps?: string[];
}

interface PathContent {
  title: string;
  color: string;
  intro: string;
  prereq: string;
  time: string;
  steps: Step[];
  nextSteps: { label: string; href: string }[];
}

const PATH_CONTENT: Record<Path, PathContent> = {
  nosim: {
    title: "Run EoS in Your Browser — No Install",
    color: "#34D399",
    intro:
      "EoSim runs entirely in your browser using WebAssembly. You can write, compile, and simulate firmware on a virtual STM32, ESP32, or Raspberry Pi Pico without installing anything. This is the fastest way to understand what EmbeddedOS is.",
    prereq:
      "A modern browser (Chrome 90+, Firefox 88+, Safari 15+). That is it.",
    time: "~5 minutes",
    steps: [
      {
        title: "Open the EoSim Demo",
        text: "Navigate to the EoSim demo page. You will see a virtual board with GPIO pins, a code editor, and a UART output console. No login required.",
        substeps: [
          "Click 'Demo' in the top navigation, or go directly to /demo",
          "The simulator loads a virtual STM32F4 board by default",
        ],
      },
      {
        title: "Choose a Board",
        text: `EoSim supports ${SIM_PLATFORM_COUNT} virtual platforms. For your first run, keep the default STM32F4 Discovery. You can switch to ESP32 or Raspberry Pi Pico using the board selector.`,
        substeps: [
          "STM32F4 — ARM Cortex-M4, 168MHz, 1MB flash",
          "ESP32 — Xtensa LX6, 240MHz, Wi-Fi + BT",
          "RPi Pico — RP2040, dual-core ARM Cortex-M0+",
        ],
      },
      {
        title: "Select a Program",
        text: "Three example programs are pre-loaded:",
        substeps: [
          "LED Blink — Toggles GPIO PA5 every 500ms. The simplest possible EoS program.",
          "UART Echo — Reads from UART1 and echoes back. Demonstrates the EoS UART HAL.",
          "GPIO Scanner — Reads all GPIO pins and prints their state every 100ms.",
        ],
      },
      {
        title: "Click Run",
        text: "Press the green Run button. The simulator compiles the program, loads it onto the virtual board, and starts execution. You will see UART output appear in the console within 1-2 seconds.",
        tip: "The GPIO pins on the right side of the board light up in real time as the program toggles them.",
      },
      {
        title: "Interact with the Simulation",
        substeps: [
          "Click any GPIO pin to toggle it manually — the program will read the new state",
          "The UART console shows all output from the virtual board",
          "Click Reset to restart the simulation from the beginning",
          "Click Stop to pause execution at any point",
        ],
      },
      {
        title: "What You Just Ran — The Source Code",
        text: "The LED Blink program is a complete EoS application:",
        code: `#include "eos/hal/gpio.h"\n#include "eos/kernel/task.h"\n\n// EoS task — runs on the RTOS scheduler\nvoid led_task(void *arg) {\n    eos_gpio_init(GPIO_PA5, GPIO_OUTPUT);\n    while (1) {\n        eos_gpio_toggle(GPIO_PA5);   // Toggle LED\n        eos_task_delay_ms(500);      // Wait 500ms\n    }\n}\n\nint main(void) {\n    eos_kernel_init();\n    eos_task_create(led_task, "led", 512, NULL, 1);\n    eos_kernel_start();  // Never returns\n}`,
      },
      {
        title: "Next: Install ebuild Locally",
        text: "When you are ready to go deeper, install ebuild and EoSim on your computer for full CLI access and the ability to flash real hardware.",
        code: `pip install embeddedos-ebuild embeddedos-eosim\nebuild init my-first-project --template rtos --target stm32f4\ncd my-first-project && ebuild sim`,
      },
    ],
    nextSteps: [
      { label: "Install ebuild locally", href: "/getting-started" },
      { label: "Read the EoS Kernel docs", href: "/eos" },
      { label: "Browse 60+ eApps", href: "/eapps" },
    ],
  },
  sim: {
    title: "Full Simulator on Your Computer",
    color: "#22D3EE",
    intro:
      "EoSim + ebuild give you a complete EmbeddedOS development environment on your laptop. Write firmware, compile it, simulate it on a virtual board, and debug it — all without any physical hardware. This is how most EoS contributors develop.",
    prereq:
      "Python 3.10+, Git, 2GB disk space. Windows 10+, macOS 12+, or Ubuntu 20.04+.",
    time: "~15 minutes",
    steps: [
      {
        title: "Install ebuild and EoSim",
        text: "ebuild is the EmbeddedOS build tool. It handles project creation, compilation, simulation, flashing, and monitoring. EoSim is the hardware simulator that ebuild uses internally.",
        code: `pip install embeddedos-ebuild embeddedos-eosim\n\nebuild --version\n# ebuild v2.1.0 (EmbeddedOS Build Tool)\n\neosim --version\n# EoSim v1.4.0 — ${SIM_PLATFORM_COUNT} platforms available`,
        tip: "On Windows, run these commands in PowerShell as Administrator. On macOS/Linux, you may need pip3.",
      },
      {
        title: "Create Your First Project",
        text: "ebuild init creates a complete EoS project with the correct directory structure, CMakeLists.txt, linker scripts, and startup code for your target board.",
        code: `ebuild init my-blink --template rtos --target stm32f4\ncd my-blink\n\n# Project structure:\n# my-blink/\n#   src/main.c          <- Your application code\n#   src/tasks/          <- RTOS task files\n#   include/            <- Header files\n#   CMakeLists.txt      <- Build configuration\n#   ebuild.toml         <- Project metadata\n#   .eosim/             <- Simulation config`,
      },
      {
        title: "Understand the Project Structure",
        substeps: [
          "src/main.c — Entry point. Initialises the kernel and creates tasks.",
          "src/tasks/ — Each RTOS task lives in its own file. Tasks run concurrently.",
          "include/ — Shared header files. EoS HAL headers are auto-included.",
          "ebuild.toml — Declares the target board, EoS version, and dependencies.",
          "CMakeLists.txt — Auto-generated. Do not edit manually — ebuild manages it.",
          ".eosim/ — Simulation configuration: virtual peripherals, pin mapping, clock speed.",
        ],
      },
      {
        title: "The Default main.c",
        text: "The template generates a working LED blink program. Open src/main.c:",
        code: `#include "eos/hal/gpio.h"\n#include "eos/kernel/task.h"\n#include "eos/kernel/uart.h"\n\nvoid led_task(void *arg) {\n    eos_gpio_init(GPIO_PA5, GPIO_OUTPUT);\n    uint32_t tick = 0;\n    while (1) {\n        eos_gpio_toggle(GPIO_PA5);\n        eos_uart_printf(UART1, "[app] LED toggled, tick=%lu\\n", tick++);\n        eos_task_delay_ms(500);\n    }\n}\n\nint main(void) {\n    eos_kernel_init();\n    eos_task_create(led_task, "led", 1024, NULL, 1);\n    eos_kernel_start();\n    return 0;\n}`,
      },
      {
        title: "Build the Firmware",
        code: `ebuild build\n\n# [ebuild] Configuring for stm32f4...\n# [ebuild] Compiling src/main.c\n# [ebuild] Linking firmware.elf\n# [ebuild] Binary: build/firmware.bin (45,232 bytes)\n# [ebuild] Build complete in 3.2s`,
        tip: "ebuild build --jobs 8 uses 8 parallel compile threads for faster builds.",
      },
      {
        title: "Simulate on a Virtual Board",
        code: `ebuild sim\n\n# [EoSim] Loading firmware.elf on stm32f4...\n# [EoSim] CPU: ARM Cortex-M4 @ 168MHz (virtual)\n# [EoSim] Starting simulation...\n# [app] EmbeddedOS v2.5.0 starting...\n# [app] LED toggled, tick=0\n# [app] LED toggled, tick=1\n\n# Press Ctrl+C to stop`,
        tip: "Add --gui to open the graphical simulator with pin state visualization: ebuild sim --gui",
      },
      {
        title: "Switch to a Different Board",
        text: `EoSim supports ${SIM_PLATFORM_COUNT} platforms. Switch targets without changing your source code.`,
        code: `ebuild sim --platform esp32\nebuild sim --platform raspi-pico\n\n# List all available platforms\nebuild platforms list\n# stm32f4, stm32h7, esp32, esp32s3, raspi4,\n# raspi-pico, nrf52840, imxrt1062, ...`,
      },
      {
        title: "Debug with GDB",
        code: `# Terminal 1: Start simulation with GDB server\nebuild sim --gdb\n# [EoSim] GDB server listening on :3333\n\n# Terminal 2: Connect GDB\narm-none-eabi-gdb build/firmware.elf\n(gdb) target remote :3333\n(gdb) break led_task\n(gdb) continue\n# Breakpoint 1, led_task () at src/main.c:8`,
      },
    ],
    nextSteps: [
      { label: "EoS Kernel deep dive", href: "/eos" },
      { label: "Try eFlow visual editor", href: "/flow" },
      { label: "Flash to ESP32", href: "/getting-started" },
    ],
  },
  esp32: {
    title: "Flash EoS to Your ESP32",
    color: "#F97316",
    intro:
      "The ESP32 is the most popular EoS target. At $5-$10, it gives you Wi-Fi, Bluetooth, two cores, and 520KB of RAM. This guide takes you from an out-of-the-box ESP32 to a running EoS application in under 30 minutes.",
    prereq:
      "ESP32 DevKit board ($5-$10), USB-A to Micro-USB cable, Python 3.10+.",
    time: "~25 minutes",
    steps: [
      {
        title: "Install ebuild",
        text: "ebuild bundles the Xtensa GCC toolchain and esptool.py — no separate ESP-IDF install needed.",
        code: `pip install embeddedos-ebuild\n\nebuild --version\n# ebuild v2.1.0\n\nebuild platforms list | grep esp32\n# esp32, esp32s2, esp32s3, esp32c3, esp32h2`,
      },
      {
        title: "Connect Your ESP32 and Find the Port",
        code: `# Linux/macOS\nls /dev/tty* | grep -i usb\n# /dev/ttyUSB0  (Linux)\n# /dev/cu.usbserial-0001  (macOS)\n\n# Windows: check Device Manager\n# Look for "Silicon Labs CP210x" or "CH340"`,
        tip: "If the port does not appear, install the CP2102 or CH340 USB driver for your OS.",
      },
      {
        title: "Create an ESP32 Project",
        code: `ebuild init my-esp32-app --template rtos --target esp32\ncd my-esp32-app\n\n# Configures: dual-core FreeRTOS, Wi-Fi stack,\n# UART0 for serial output, GPIO2 as built-in LED`,
      },
      {
        title: "Build",
        code: `ebuild build\n\n# [ebuild] Configuring for esp32 (Xtensa LX6, 240MHz)...\n# [ebuild] Linking firmware.elf\n# [ebuild] Binary: build/firmware.bin (312,448 bytes)\n# [ebuild] Build complete in 4.1s`,
      },
      {
        title: "Simulate Before Flashing",
        text: "Always simulate first to catch bugs before writing to hardware.",
        code: `ebuild sim --platform esp32\n\n# [EoSim] Loading on virtual ESP32...\n# [app] EmbeddedOS v2.5.0 starting...\n# [app] LED toggled, tick=0`,
      },
      {
        title: "Flash to Your ESP32",
        code: `ebuild flash\n# or: ebuild flash --port /dev/ttyUSB0\n\n# [ebuild] Detected ESP32 on /dev/ttyUSB0\n# [ebuild] Erasing flash...\n# [ebuild] Writing firmware.bin (312,448 bytes)...\n# [ebuild] Verifying... OK\n# [ebuild] Flash complete. Resetting device.`,
        warn: "Hold the BOOT button on your ESP32 while the flash command starts if it fails to connect automatically.",
      },
      {
        title: "Monitor Serial Output",
        code: `ebuild monitor --baud 115200\n\n# [app] EmbeddedOS v2.5.0 starting...\n# [app] CPU: ESP32 Xtensa LX6 @ 240MHz\n# [app] Free heap: 298,432 bytes\n# [app] LED toggled, tick=0\n\n# Press Ctrl+] to exit`,
      },
      {
        title: "Enable Wi-Fi",
        code: `# In ebuild.toml:\n[features]\nwifi = true\n\n# In your code:\n#include "eos/net/wifi.h"\n\nvoid wifi_task(void *arg) {\n    eos_wifi_init();\n    eos_wifi_connect("MyNetwork", "password");\n    eos_uart_printf(UART0, "IP: %s\\n",\n        eos_wifi_get_ip());\n}`,
        tip: "See the EoS networking docs for MQTT, HTTP client, WebSocket, and mDNS examples.",
      },
    ],
    nextSteps: [
      { label: "EoS Wi-Fi + networking", href: "/docs" },
      { label: "Add EAI edge AI", href: "/eai" },
      { label: "Build an eApp for ESP32", href: "/eapps" },
    ],
  },
  stm32: {
    title: "Flash EoS to Your STM32",
    color: "#22D3EE",
    intro:
      "STM32 boards are the most common target for professional embedded development. The Nucleo-F446RE ($15) has an on-board ST-Link debugger, making flashing as simple as plugging in a USB cable.",
    prereq: "STM32 Nucleo or Discovery board, USB cable, Python 3.10+.",
    time: "~30 minutes",
    steps: [
      {
        title: "Install ebuild and OpenOCD",
        code: `pip install embeddedos-ebuild\n\n# Install OpenOCD for ST-Link\n# Ubuntu: sudo apt install openocd\n# macOS:  brew install openocd\n# Windows: download from openocd.org`,
      },
      {
        title: "Create an STM32 Project",
        code: `ebuild init my-stm32-app --template rtos --target stm32f4\n# or: --target stm32h7  (higher performance)\n# or: --target stm32l4  (ultra-low power)\n\ncd my-stm32-app`,
      },
      {
        title: "The Unified EoS HAL",
        text: "EoS provides a unified HAL that works identically across all STM32 families. Write once, run on any STM32.",
        code: `// GPIO\neos_gpio_init(GPIO_PA5, GPIO_OUTPUT);\neos_gpio_toggle(GPIO_PA5);\n\n// UART\neos_uart_init(UART2, 115200);\neos_uart_printf(UART2, "Hello EoS!\\n");\n\n// SPI\neos_spi_init(SPI1, SPI_MODE0, 8000000);\neos_spi_transfer(SPI1, tx_buf, rx_buf, 16);\n\n// I2C\neos_i2c_init(I2C1, 400000);\neos_i2c_write(I2C1, 0x68, reg, data, len);`,
      },
      {
        title: "Build",
        code: `ebuild build --jobs 8\n\n# Size report:\n#   .text (flash): 44,128 bytes / 1,048,576 (4.2%)\n#   .data (RAM):    1,024 bytes / 196,608 (0.5%)\n# [ebuild] Build complete in 2.8s`,
      },
      {
        title: "Flash via ST-Link",
        code: `ebuild flash\n\n# [ebuild] Detected ST-Link v2.1\n# [ebuild] Target: STM32F446RE\n# [ebuild] Writing firmware.bin...\n# [ebuild] Verify: OK\n# [ebuild] Flash complete.`,
        tip: "You can also drag-and-drop firmware.bin onto the NUCLEO drive that appears in your file manager.",
      },
      {
        title: "Monitor UART Output",
        code: `ebuild monitor --baud 115200\n\n# [app] EmbeddedOS v2.5.0 starting...\n# [app] CPU: STM32F446RE ARM Cortex-M4 @ 168MHz\n# [app] LED toggled, tick=0`,
      },
      {
        title: "Debug with GDB + OpenOCD",
        code: `# Terminal 1: Start OpenOCD\nopenocd -f interface/stlink.cfg -f target/stm32f4x.cfg\n\n# Terminal 2: Connect GDB\narm-none-eabi-gdb build/firmware.elf\n(gdb) target extended-remote :3333\n(gdb) monitor reset halt\n(gdb) break main\n(gdb) continue`,
      },
      {
        title: "Use eFlow for Faster Development",
        text: "Once your hardware is working, try eFlow — the visual block editor that generates C code for you.",
        substeps: [
          "ebuild eflow open — launches the eFlow editor in your browser",
          "Drag a GPIO Output block onto the canvas",
          "Connect it to a Timer block (500ms period)",
          "Click Generate — eFlow writes the C code and adds it to your project",
          "ebuild build && ebuild flash — deploy the generated code",
        ],
      },
    ],
    nextSteps: [
      { label: "EoS HAL reference", href: "/docs" },
      { label: "Try eFlow visual editor", href: "/flow" },
      { label: "Add EAI on STM32H7", href: "/eai" },
    ],
  },
  apps: {
    title: "Build Cross-Platform eApps",
    color: "#F59E0B",
    intro:
      "eApps are C applications built with LVGL (Light and Versatile Graphics Library). They run natively on embedded displays, on your desktop (via SDL2), in a browser (via WebAssembly), and on Android/iOS (via Flutter wrapper). The same source code runs everywhere.",
    prereq: "Git, CMake 3.20+, GCC or Clang, SDL2 development libraries.",
    time: "~20 minutes",
    steps: [
      {
        title: "Install SDL2 (Desktop Preview)",
        code: `# Ubuntu / Debian\nsudo apt install libsdl2-dev cmake ninja-build\n\n# macOS\nbrew install sdl2 cmake ninja\n\n# Windows (MSYS2)\npacman -S mingw-w64-x86_64-SDL2 cmake ninja`,
      },
      {
        title: "Clone the eApps Repository",
        code: `git clone https://github.com/embeddedos-org/eApps.git\ncd eApps\n\n# apps/          <- 60+ individual apps\n# apps/snake/    <- Snake game\n# apps/ecalc/    <- Scientific calculator\n# apps/ewriter/  <- Word processor\n# lib/lvgl/      <- LVGL graphics library\n# ports/         <- Platform backends (SDL2, ESP32, web)`,
      },
      {
        title: "Build All Apps for Desktop",
        code: `cmake -B build -G Ninja \\\n  -DEAPPS_PORT=sdl2 \\\n  -DCMAKE_BUILD_TYPE=Release\n\ncmake --build build --parallel\n# Builds all 60+ apps in ~2 minutes`,
      },
      {
        title: "Run the Built-in Apps",
        code: `./build/apps/snake/snake       # Snake game\n./build/apps/ecalc/ecalc       # Calculator\n./build/apps/ewriter/ewriter   # Word processor\n./build/apps/esheet/esheet     # Spreadsheet\n./build/eapps_launcher         # All apps launcher`,
        tip: "Each app opens in a 480x320 window by default, matching common embedded display sizes.",
      },
      {
        title: "Create Your Own App",
        code: `cd eApps\nebuild eapp new my-sensor-dashboard\n\n# Creates:\n# apps/my-sensor-dashboard/\n#   main.c      <- App entry point\n#   ui.c / ui.h <- LVGL UI code`,
      },
      {
        title: "Write Your First LVGL UI",
        code: `#include "lvgl/lvgl.h"\n\nvoid app_main(void) {\n    lv_obj_t *scr = lv_scr_act();\n    lv_obj_set_style_bg_color(scr,\n        lv_color_hex(0x0A1628), LV_PART_MAIN);\n\n    lv_obj_t *label = lv_label_create(scr);\n    lv_label_set_text(label, "Hello EmbeddedOS!");\n    lv_obj_center(label);\n\n    lv_obj_t *btn = lv_btn_create(scr);\n    lv_obj_set_size(btn, 120, 40);\n    lv_obj_align(btn, LV_ALIGN_BOTTOM_MID, 0, -20);\n}`,
      },
      {
        title: "Build for WebAssembly",
        code: `# Install Emscripten\ngit clone https://github.com/emscripten-core/emsdk.git\ncd emsdk && ./emsdk install latest && ./emsdk activate latest\nsource ./emsdk_env.sh\n\n# Build for web\ncmake -B build-web -G Ninja \\\n  -DCMAKE_TOOLCHAIN_FILE=$EMSDK/upstream/emscripten/cmake/Modules/Platform/Emscripten.cmake \\\n  -DEAPPS_PORT=emscripten\ncmake --build build-web\n\npython3 -m http.server 8080 --directory build-web`,
      },
      {
        title: "Deploy to an Embedded Display",
        code: `# Build for ILI9341 display on ESP32\nebuild build --target esp32 \\\n  --display ili9341 --touch xpt2046\n\nebuild flash --port /dev/ttyUSB0`,
      },
    ],
    nextSteps: [
      { label: "LVGL widget reference", href: "/docs" },
      { label: "eOffice Suite source code", href: "/eoffice" },
      { label: "Deploy to ESP32 display", href: "/getting-started" },
    ],
  },
  "hardware-design": {
    title: "Hardware Engineer Workflow",
    color: "#A78BFA",
    intro:
      "If you are designing hardware for EmbeddedOS, ebuild has a dedicated CAD analysis pipeline. Import your KiCad or Altium schematic, ebuild extracts the component list and pin assignments, generates a board support package (BSP), and lets you simulate the entire firmware stack before your PCB arrives from the fab.",
    prereq: "KiCad 7+ or Altium Designer, Python 3.10+, ebuild.",
    time: "~45 minutes",
    steps: [
      {
        title: "Install ebuild with CAD Support",
        code: `pip install "embeddedos-ebuild[cad]"\n\n# Installs: KiCad Python API, Altium parser,\n# component database connector, BSP generator\n\nebuild cad --version\n# ebuild CAD module v1.2.0`,
      },
      {
        title: "Export Your Schematic",
        text: "ebuild reads KiCad .kicad_sch files directly. For Altium, export as Altium ASCII Schematic (.SchDoc) first.",
        code: `# KiCad CLI export:\nkicad-cli sch export netlist \\\n  --format kicad my-board.kicad_pro \\\n  -o my-board.kicad_sch`,
      },
      {
        title: "Run CAD Analysis",
        text: "ebuild cad analyze reads your schematic and produces a detailed report: MCU identification, peripheral mapping, power rail analysis, and EoS compatibility check.",
        code: `ebuild cad analyze my-board.kicad_sch\n\n# [CAD] MCU detected: STM32H743ZIT6\n# [CAD] Core: ARM Cortex-M7 @ 480MHz\n# [CAD] Peripherals found:\n#   UART1 (PA9/PA10) -> USB-UART bridge\n#   SPI2 (PB13-15)  -> W25Q128 NOR flash\n#   I2C1 (PB6/PB7)  -> BME280 sensor\n#   ADC1 (PA0)      -> Analog input\n# [CAD] EoS compatibility: FULL`,
      },
      {
        title: "Generate the Board Support Package",
        text: "ebuild cad generate creates a complete BSP: pin definitions, clock configuration, peripheral init code, and linker scripts — all derived from your schematic.",
        code: `ebuild cad generate my-board.kicad_sch \\\n  --output bsp/ --name my-board\n\n# Generated:\n# bsp/my-board/\n#   pins.h        <- Pin definitions from schematic\n#   clocks.c      <- Clock tree configuration\n#   peripherals.c <- Peripheral init (UART, SPI, I2C)\n#   linker.ld     <- Memory map from chip datasheet\n#   ebuild.toml   <- Project configuration\n\n# Example from pins.h:\n# #define UART_TX  GPIO_PA9\n# #define FLASH_CS GPIO_PB12`,
      },
      {
        title: "Create a Project Using Your BSP",
        code: `ebuild init my-board-firmware \\\n  --template rtos \\\n  --bsp bsp/my-board\n\ncd my-board-firmware\n# Pre-configured for your exact hardware.\n# All pin names match your schematic labels.`,
      },
      {
        title: "Simulate the Full Hardware Stack",
        text: "EoSim can simulate your custom board using the BSP. Virtual peripherals match your real schematic.",
        code: `ebuild sim --bsp bsp/my-board\n\n# [EoSim] Loading custom BSP: my-board\n# [EoSim] MCU: STM32H743ZIT6 @ 480MHz (virtual)\n# [EoSim] Virtual peripherals:\n#   BME280 (I2C1 0x76): temp=23.4C, hum=61%\n#   W25Q128 (SPI2): 16MB NOR flash\n# [app] BME280 init OK\n# [app] Temp: 23.4C, Humidity: 61.2%`,
        tip: "Inject virtual sensor data: eosim inject --peripheral bme280 --temp 35.0",
      },
      {
        title: "Run Static Analysis",
        code: `ebuild analyze\n\n# [analyze] Stack depth analysis...\n#   led_task: max stack 312 bytes (limit 1024) OK\n#   sensor_task: max stack 488 bytes OK\n# [analyze] Memory overlap check... OK\n# [analyze] MISRA C:2012 compliance...\n#   2 advisory violations (non-blocking)\n# [analyze] Overall: PASS`,
      },
      {
        title: "When Your PCB Arrives: Flash and Verify",
        code: `# Connect JTAG/SWD debugger\nebuild flash --interface jlink\n\n# [ebuild] Detected J-Link v10.1\n# [ebuild] Writing 180,224 bytes... OK\n# [ebuild] Flash complete.\n\nebuild monitor --baud 115200\n# [app] EmbeddedOS v2.5.0 starting...\n# [app] BME280 init OK\n# [app] Temp: 22.8C, Humidity: 59.4%`,
        tip: "Because you simulated with the same BSP, the firmware should work on first boot with no changes needed.",
      },
    ],
    nextSteps: [
      { label: "ebuild CAD reference", href: "/flow" },
      { label: "HEALTH device CAD files", href: "/hardware-lab" },
      { label: "Add EAI to your design", href: "/eai" },
    ],
  },
};

export default function GettingStarted() {
  const [activePath, setActivePath] = useState<Path>("nosim");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const content = PATH_CONTENT[activePath];

  const copyCode = async (code: string, idx: number) => {
    if (!(await copyText(code))) return;
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#080F1E]">
      {/* Hero */}
      <section className="relative py-20 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628] to-[#080F1E]" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-[#F97316]/5 rounded-full blur-[100px]" />
          <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-[#22D3EE]/4 rounded-full blur-[80px]" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6"
              style={{
                background: "rgba(249,115,22,0.12)",
                border: "1px solid rgba(249,115,22,0.3)",
                color: "#F97316",
              }}
            >
              <Play size={12} /> Getting Started
            </span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="font-heading font-black text-5xl sm:text-6xl text-white mb-5 leading-[1.05]"
          >
            Start Building with
            <br />
            <span style={{ color: "#F97316" }}>EmbeddedOS</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-white/60 text-xl max-w-2xl mx-auto mb-4 leading-relaxed"
          >
            No hardware required to get started. Choose your path below and go
            from zero to running firmware in minutes.
          </motion.p>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-[#34D399]"
            style={{
              background: "rgba(52,211,153,0.08)",
              border: "1px solid rgba(52,211,153,0.2)",
            }}
          >
            <CheckCircle2 size={14} /> You can simulate {SIM_PLATFORM_COUNT}{" "}
            platforms in your browser — no install, no hardware needed
          </motion.div>
        </div>
      </section>

      {/* Ecosystem Map */}
      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="font-heading font-black text-2xl text-white mb-2">
              The EmbeddedOS Ecosystem
            </h2>
            <p className="text-white/40 text-sm">
              8 tools that work together — understand what each one does before
              you start
            </p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {ECOSYSTEM.map((tool, i) => {
              const TIcon = tool.icon;
              return (
                <motion.div
                  key={tool.id}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="rounded-2xl border p-4"
                  style={{
                    background: `${tool.color}06`,
                    borderColor: `${tool.color}20`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${tool.color}18` }}
                    >
                      <TIcon size={14} style={{ color: tool.color }} />
                    </div>
                    <div>
                      <div className="font-heading font-bold text-white text-sm">
                        {tool.name}
                      </div>
                      <div
                        className="text-[10px]"
                        style={{ color: tool.color }}
                      >
                        {tool.role}
                      </div>
                    </div>
                  </div>
                  <p className="text-white/45 text-xs leading-relaxed">
                    {tool.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Path Selector */}
      <section className="pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-6"
          >
            <h2 className="font-heading font-black text-2xl text-white mb-1">
              Choose Your Path
            </h2>
            <p className="text-white/40 text-sm">
              Pick the option that matches where you are right now
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PATHS.map(p => {
              const PIcon = p.icon;
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePath(p.id)}
                  className="relative flex items-center gap-3 p-4 rounded-2xl text-left transition-all"
                  style={
                    activePath === p.id
                      ? {
                          background: `${p.color}15`,
                          border: `1.5px solid ${p.color}50`,
                        }
                      : {
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }
                  }
                >
                  {p.badge && (
                    <span
                      className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold"
                      style={{ background: p.color, color: "#000" }}
                    >
                      {p.badge}
                    </span>
                  )}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background:
                        activePath === p.id ? `${p.color}25` : `${p.color}12`,
                    }}
                  >
                    <PIcon size={18} style={{ color: p.color }} />
                  </div>
                  <div>
                    <div className="font-heading font-bold text-white text-sm">
                      {p.label}
                    </div>
                    <div className="text-xs text-white/45">{p.sublabel}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Path Content */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePath}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              <div
                className="rounded-2xl border p-6 mb-6"
                style={{
                  background: `${content.color}08`,
                  borderColor: `${content.color}25`,
                }}
              >
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h2 className="font-heading font-black text-2xl sm:text-3xl text-white">
                    {content.title}
                  </h2>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{
                      background: `${content.color}20`,
                      color: content.color,
                    }}
                  >
                    {content.time}
                  </span>
                </div>
                <p className="text-white/60 text-base mb-4 leading-relaxed">
                  {content.intro}
                </p>
                <div
                  className="flex items-start gap-2 p-3 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <Info size={14} className="text-white/40 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-white/40 uppercase tracking-wider">
                      Prerequisites:{" "}
                    </span>
                    <span className="text-xs text-white/60">
                      {content.prereq}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {content.steps.map((step, i) => (
                  <motion.div
                    key={step.title}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={i}
                    className="rounded-2xl border border-white/8 overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.02)" }}
                  >
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0"
                        style={{
                          background: `${content.color}25`,
                          border: `1px solid ${content.color}40`,
                        }}
                      >
                        {i + 1}
                      </div>
                      <h3 className="font-heading font-bold text-white">
                        {step.title}
                      </h3>
                    </div>
                    <div className="px-5 py-4 space-y-3">
                      {step.text && (
                        <p className="text-sm text-white/60 leading-relaxed">
                          {step.text}
                        </p>
                      )}
                      {step.substeps && (
                        <ul className="space-y-1.5">
                          {step.substeps.map(s => (
                            <li
                              key={s}
                              className="flex items-start gap-2 text-sm text-white/55"
                            >
                              <ChevronRight
                                size={13}
                                className="mt-0.5 shrink-0"
                                style={{ color: content.color }}
                              />
                              {s}
                            </li>
                          ))}
                        </ul>
                      )}
                      {step.code && (
                        <div
                          className="relative rounded-xl overflow-hidden border border-white/8"
                          style={{ background: "rgba(5,10,20,0.9)" }}
                        >
                          <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
                            <div className="flex gap-1.5">
                              <div className="w-2.5 h-2.5 rounded-full bg-[#F85149]/50" />
                              <div className="w-2.5 h-2.5 rounded-full bg-[#F0883E]/50" />
                              <div className="w-2.5 h-2.5 rounded-full bg-[#3FB950]/50" />
                            </div>
                            <button
                              onClick={() => copyCode(step.code!, i)}
                              className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors"
                            >
                              {copiedIdx === i ? (
                                <CheckCircle2
                                  size={12}
                                  className="text-[#34D399]"
                                />
                              ) : (
                                <Copy size={12} />
                              )}
                              {copiedIdx === i ? "Copied!" : "Copy"}
                            </button>
                          </div>
                          <pre className="p-4 text-xs overflow-x-auto font-mono leading-relaxed">
                            <code style={{ color: "#E6EDF3" }}>
                              {step.code}
                            </code>
                          </pre>
                        </div>
                      )}
                      {step.tip && (
                        <div
                          className="flex items-start gap-2 p-3 rounded-xl text-xs"
                          style={{
                            background: `${content.color}08`,
                            border: `1px solid ${content.color}20`,
                          }}
                        >
                          <Star
                            size={12}
                            style={{ color: content.color }}
                            className="mt-0.5 shrink-0"
                          />
                          <span style={{ color: content.color }}>
                            <strong>Tip:</strong> {step.tip}
                          </span>
                        </div>
                      )}
                      {step.warn && (
                        <div
                          className="flex items-start gap-2 p-3 rounded-xl text-xs"
                          style={{
                            background: "rgba(248,81,73,0.08)",
                            border: "1px solid rgba(248,81,73,0.2)",
                          }}
                        >
                          <AlertCircle
                            size={12}
                            className="text-[#F85149] mt-0.5 shrink-0"
                          />
                          <span className="text-[#F85149]">
                            <strong>Note:</strong> {step.warn}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div
                className="mt-8 rounded-2xl border border-white/8 p-5"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <div className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">
                  What's Next
                </div>
                <div className="flex flex-wrap gap-2">
                  {content.nextSteps.map(ns => (
                    <Link
                      key={ns.label}
                      href={ns.href}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white/70 hover:text-white transition-all"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      {ns.label} <ArrowRight size={13} />
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Quick reference */}
      <section className="pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              {
                label: "EoS Kernel",
                href: "/eos",
                color: "#F97316",
                icon: Cpu,
              },
              {
                label: "eBoot",
                href: "/eboot",
                color: "#F59E0B",
                icon: Shield,
              },
              { label: "eFlow", href: "/flow", color: "#A78BFA", icon: Layers },
              {
                label: "EAI / ENI",
                href: "/eai",
                color: "#34D399",
                icon: Brain,
              },
              {
                label: "eOffice",
                href: "/eoffice",
                color: "#22D3EE",
                icon: Package,
              },
              {
                label: "Hardware Lab",
                href: "/hardware-lab",
                color: "#60A5FA",
                icon: HardDrive,
              },
            ].map(l => {
              const LIcon = l.icon;
              return (
                <Link
                  key={l.label}
                  href={l.href}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl border text-center transition-all hover:scale-[1.02]"
                  style={{
                    background: `${l.color}08`,
                    borderColor: `${l.color}20`,
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${l.color}18` }}
                  >
                    <LIcon size={16} style={{ color: l.color }} />
                  </div>
                  <span className="text-xs font-bold text-white/60">
                    {l.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
