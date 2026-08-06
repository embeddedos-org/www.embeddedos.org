import{j as e,m as o,A as v}from"./vendor-motion-DJ7isXre.js";import{r as p,L as u}from"./vendor-react-r7gXz3yt.js";import{P as h}from"./play-Roj25IIT.js";import{C as b}from"./circle-check-C2u4PtGX.js";import{W as k,C as n,S as x,L as g,B as f,P as d,a as E,b as P,c as A,d as j,e as C,A as _}from"./index-C_mVJP2y.js";import{M as y}from"./monitor-CAR95XQm.js";import{P as T}from"./pen-tool-BBXAwD5H.js";import{I as N}from"./info-D7duM1nZ.js";import{C as I}from"./copy-Btr5SVye.js";import{H as D}from"./hard-drive-C1QmxcAb.js";const s={hidden:{opacity:0,y:20},visible:(r=0)=>({opacity:1,y:0,transition:{duration:.45,delay:r*.07,ease:[.23,1,.32,1]}})},O=[{id:"ebuild",name:"ebuild",role:"Build Tool",desc:"Compiles, links, analyzes CAD, and flashes firmware. The single CLI for the entire EoS lifecycle.",color:"#F97316",icon:k},{id:"eosim",name:"EoSim",role:"Simulator",desc:"Runs your firmware in-browser on 63+ virtual boards. No hardware required — ever.",color:"#22D3EE",icon:y},{id:"eos",name:"EoS Kernel",role:"RTOS Kernel",desc:"The real-time OS kernel. Provides HAL, scheduler, IPC, drivers, and POSIX subset.",color:"#F97316",icon:n},{id:"eboot",name:"eBoot",role:"Bootloader",desc:"Secure bootloader with verified boot, OTA A/B updates, and hardware root of trust.",color:"#F59E0B",icon:x},{id:"eflow",name:"eFlow",role:"Visual Programming",desc:"Drag-and-drop block editor that generates production C code. No assembly needed for common patterns.",color:"#A78BFA",icon:g},{id:"eai",name:"EAI / ENI",role:"Edge AI",desc:"On-device TFLite/ONNX inference and neural interface adapter for BCI devices.",color:"#34D399",icon:f},{id:"eapps",name:"eApps",role:"App Ecosystem",desc:"60+ apps including eOffice Suite, eBrowser, eDB, and eBot AI assistant.",color:"#60A5FA",icon:d},{id:"eostudio",name:"EoStudio",role:"IDE",desc:"Universal IDE with AI tutor, 3D modeler, game editor, and UI designer.",color:"#F472B6",icon:E}],B=[{id:"nosim",icon:h,label:"No Hardware, No Install",sublabel:"Run in browser — 60 seconds",color:"#34D399",badge:"Fastest"},{id:"sim",icon:y,label:"Simulator on My Computer",sublabel:"Full EoSim CLI + ebuild",color:"#22D3EE"},{id:"esp32",icon:P,label:"I Have an ESP32",sublabel:"Flash EoS to $5 board",color:"#F97316"},{id:"stm32",icon:n,label:"I Have an STM32",sublabel:"Nucleo / Discovery board",color:"#22D3EE"},{id:"apps",icon:d,label:"I Want to Build eApps",sublabel:"C + LVGL cross-platform apps",color:"#F59E0B"},{id:"hardware-design",icon:T,label:"I'm a Hardware Engineer",sublabel:"CAD → ebuild → simulate → flash",color:"#A78BFA"}],L={nosim:{title:"Run EoS in Your Browser — No Install",color:"#34D399",intro:"EoSim runs entirely in your browser using WebAssembly. You can write, compile, and simulate firmware on a virtual STM32, ESP32, or Raspberry Pi Pico without installing anything. This is the fastest way to understand what EmbeddedOS is.",prereq:"A modern browser (Chrome 90+, Firefox 88+, Safari 15+). That is it.",time:"~5 minutes",steps:[{title:"Open the EoSim Demo",text:"Navigate to the EoSim demo page. You will see a virtual board with GPIO pins, a code editor, and a UART output console. No login required.",substeps:["Click 'Demo' in the top navigation, or go directly to /demo","The simulator loads a virtual STM32F4 board by default"]},{title:"Choose a Board",text:"EoSim supports 63+ virtual boards. For your first run, keep the default STM32F4 Discovery. You can switch to ESP32 or Raspberry Pi Pico using the board selector.",substeps:["STM32F4 — ARM Cortex-M4, 168MHz, 1MB flash","ESP32 — Xtensa LX6, 240MHz, Wi-Fi + BT","RPi Pico — RP2040, dual-core ARM Cortex-M0+"]},{title:"Select a Program",text:"Three example programs are pre-loaded:",substeps:["LED Blink — Toggles GPIO PA5 every 500ms. The simplest possible EoS program.","UART Echo — Reads from UART1 and echoes back. Demonstrates the EoS UART HAL.","GPIO Scanner — Reads all GPIO pins and prints their state every 100ms."]},{title:"Click Run",text:"Press the green Run button. The simulator compiles the program, loads it onto the virtual board, and starts execution. You will see UART output appear in the console within 1-2 seconds.",tip:"The GPIO pins on the right side of the board light up in real time as the program toggles them."},{title:"Interact with the Simulation",substeps:["Click any GPIO pin to toggle it manually — the program will read the new state","The UART console shows all output from the virtual board","Click Reset to restart the simulation from the beginning","Click Stop to pause execution at any point"]},{title:"What You Just Ran — The Source Code",text:"The LED Blink program is a complete EoS application:",code:`#include "eos/hal/gpio.h"
#include "eos/kernel/task.h"

// EoS task — runs on the RTOS scheduler
void led_task(void *arg) {
    eos_gpio_init(GPIO_PA5, GPIO_OUTPUT);
    while (1) {
        eos_gpio_toggle(GPIO_PA5);   // Toggle LED
        eos_task_delay_ms(500);      // Wait 500ms
    }
}

int main(void) {
    eos_kernel_init();
    eos_task_create(led_task, "led", 512, NULL, 1);
    eos_kernel_start();  // Never returns
}`},{title:"Next: Install ebuild Locally",text:"When you are ready to go deeper, install ebuild and EoSim on your computer for full CLI access and the ability to flash real hardware.",code:`pip install embeddedos-ebuild embeddedos-eosim
ebuild init my-first-project --template rtos --target stm32f4
cd my-first-project && ebuild sim`}],nextSteps:[{label:"Install ebuild locally",href:"/getting-started"},{label:"Read the EoS Kernel docs",href:"/eos"},{label:"Browse 60+ eApps",href:"/eapps"}]},sim:{title:"Full Simulator on Your Computer",color:"#22D3EE",intro:"EoSim + ebuild give you a complete EmbeddedOS development environment on your laptop. Write firmware, compile it, simulate it on a virtual board, and debug it — all without any physical hardware. This is how most EoS contributors develop.",prereq:"Python 3.10+, Git, 2GB disk space. Windows 10+, macOS 12+, or Ubuntu 20.04+.",time:"~15 minutes",steps:[{title:"Install ebuild and EoSim",text:"ebuild is the EmbeddedOS build tool. It handles project creation, compilation, simulation, flashing, and monitoring. EoSim is the hardware simulator that ebuild uses internally.",code:`pip install embeddedos-ebuild embeddedos-eosim

ebuild --version
# ebuild v2.1.0 (EmbeddedOS Build Tool)

eosim --version
# EoSim v1.4.0 — 63 platforms available`,tip:"On Windows, run these commands in PowerShell as Administrator. On macOS/Linux, you may need pip3."},{title:"Create Your First Project",text:"ebuild init creates a complete EoS project with the correct directory structure, CMakeLists.txt, linker scripts, and startup code for your target board.",code:`ebuild init my-blink --template rtos --target stm32f4
cd my-blink

# Project structure:
# my-blink/
#   src/main.c          <- Your application code
#   src/tasks/          <- RTOS task files
#   include/            <- Header files
#   CMakeLists.txt      <- Build configuration
#   ebuild.toml         <- Project metadata
#   .eosim/             <- Simulation config`},{title:"Understand the Project Structure",substeps:["src/main.c — Entry point. Initialises the kernel and creates tasks.","src/tasks/ — Each RTOS task lives in its own file. Tasks run concurrently.","include/ — Shared header files. EoS HAL headers are auto-included.","ebuild.toml — Declares the target board, EoS version, and dependencies.","CMakeLists.txt — Auto-generated. Do not edit manually — ebuild manages it.",".eosim/ — Simulation configuration: virtual peripherals, pin mapping, clock speed."]},{title:"The Default main.c",text:"The template generates a working LED blink program. Open src/main.c:",code:`#include "eos/hal/gpio.h"
#include "eos/kernel/task.h"
#include "eos/kernel/uart.h"

void led_task(void *arg) {
    eos_gpio_init(GPIO_PA5, GPIO_OUTPUT);
    uint32_t tick = 0;
    while (1) {
        eos_gpio_toggle(GPIO_PA5);
        eos_uart_printf(UART1, "[app] LED toggled, tick=%lu\\n", tick++);
        eos_task_delay_ms(500);
    }
}

int main(void) {
    eos_kernel_init();
    eos_task_create(led_task, "led", 1024, NULL, 1);
    eos_kernel_start();
    return 0;
}`},{title:"Build the Firmware",code:`ebuild build

# [ebuild] Configuring for stm32f4...
# [ebuild] Compiling src/main.c
# [ebuild] Linking firmware.elf
# [ebuild] Binary: build/firmware.bin (45,232 bytes)
# [ebuild] Build complete in 3.2s`,tip:"ebuild build --jobs 8 uses 8 parallel compile threads for faster builds."},{title:"Simulate on a Virtual Board",code:`ebuild sim

# [EoSim] Loading firmware.elf on stm32f4...
# [EoSim] CPU: ARM Cortex-M4 @ 168MHz (virtual)
# [EoSim] Starting simulation...
# [app] EmbeddedOS v2.5.0 starting...
# [app] LED toggled, tick=0
# [app] LED toggled, tick=1

# Press Ctrl+C to stop`,tip:"Add --gui to open the graphical simulator with pin state visualization: ebuild sim --gui"},{title:"Switch to a Different Board",text:"EoSim supports 63+ boards. Switch targets without changing your source code.",code:`ebuild sim --platform esp32
ebuild sim --platform raspi-pico

# List all available platforms
ebuild platforms list
# stm32f4, stm32h7, esp32, esp32s3, raspi4,
# raspi-pico, nrf52840, imxrt1062, ...`},{title:"Debug with GDB",code:`# Terminal 1: Start simulation with GDB server
ebuild sim --gdb
# [EoSim] GDB server listening on :3333

# Terminal 2: Connect GDB
arm-none-eabi-gdb build/firmware.elf
(gdb) target remote :3333
(gdb) break led_task
(gdb) continue
# Breakpoint 1, led_task () at src/main.c:8`}],nextSteps:[{label:"EoS Kernel deep dive",href:"/eos"},{label:"Try eFlow visual editor",href:"/flow"},{label:"Flash to ESP32",href:"/getting-started"}]},esp32:{title:"Flash EoS to Your ESP32",color:"#F97316",intro:"The ESP32 is the most popular EoS target. At $5-$10, it gives you Wi-Fi, Bluetooth, two cores, and 520KB of RAM. This guide takes you from an out-of-the-box ESP32 to a running EoS application in under 30 minutes.",prereq:"ESP32 DevKit board ($5-$10), USB-A to Micro-USB cable, Python 3.10+.",time:"~25 minutes",steps:[{title:"Install ebuild",text:"ebuild bundles the Xtensa GCC toolchain and esptool.py — no separate ESP-IDF install needed.",code:`pip install embeddedos-ebuild

ebuild --version
# ebuild v2.1.0

ebuild platforms list | grep esp32
# esp32, esp32s2, esp32s3, esp32c3, esp32h2`},{title:"Connect Your ESP32 and Find the Port",code:`# Linux/macOS
ls /dev/tty* | grep -i usb
# /dev/ttyUSB0  (Linux)
# /dev/cu.usbserial-0001  (macOS)

# Windows: check Device Manager
# Look for "Silicon Labs CP210x" or "CH340"`,tip:"If the port does not appear, install the CP2102 or CH340 USB driver for your OS."},{title:"Create an ESP32 Project",code:`ebuild init my-esp32-app --template rtos --target esp32
cd my-esp32-app

# Configures: dual-core FreeRTOS, Wi-Fi stack,
# UART0 for serial output, GPIO2 as built-in LED`},{title:"Build",code:`ebuild build

# [ebuild] Configuring for esp32 (Xtensa LX6, 240MHz)...
# [ebuild] Linking firmware.elf
# [ebuild] Binary: build/firmware.bin (312,448 bytes)
# [ebuild] Build complete in 4.1s`},{title:"Simulate Before Flashing",text:"Always simulate first to catch bugs before writing to hardware.",code:`ebuild sim --platform esp32

# [EoSim] Loading on virtual ESP32...
# [app] EmbeddedOS v2.5.0 starting...
# [app] LED toggled, tick=0`},{title:"Flash to Your ESP32",code:`ebuild flash
# or: ebuild flash --port /dev/ttyUSB0

# [ebuild] Detected ESP32 on /dev/ttyUSB0
# [ebuild] Erasing flash...
# [ebuild] Writing firmware.bin (312,448 bytes)...
# [ebuild] Verifying... OK
# [ebuild] Flash complete. Resetting device.`,warn:"Hold the BOOT button on your ESP32 while the flash command starts if it fails to connect automatically."},{title:"Monitor Serial Output",code:`ebuild monitor --baud 115200

# [app] EmbeddedOS v2.5.0 starting...
# [app] CPU: ESP32 Xtensa LX6 @ 240MHz
# [app] Free heap: 298,432 bytes
# [app] LED toggled, tick=0

# Press Ctrl+] to exit`},{title:"Enable Wi-Fi",code:`# In ebuild.toml:
[features]
wifi = true

# In your code:
#include "eos/net/wifi.h"

void wifi_task(void *arg) {
    eos_wifi_init();
    eos_wifi_connect("MyNetwork", "password");
    eos_uart_printf(UART0, "IP: %s\\n",
        eos_wifi_get_ip());
}`,tip:"See the EoS networking docs for MQTT, HTTP client, WebSocket, and mDNS examples."}],nextSteps:[{label:"EoS Wi-Fi + networking",href:"/docs"},{label:"Add EAI edge AI",href:"/eai"},{label:"Build an eApp for ESP32",href:"/eapps"}]},stm32:{title:"Flash EoS to Your STM32",color:"#22D3EE",intro:"STM32 boards are the most common target for professional embedded development. The Nucleo-F446RE ($15) has an on-board ST-Link debugger, making flashing as simple as plugging in a USB cable.",prereq:"STM32 Nucleo or Discovery board, USB cable, Python 3.10+.",time:"~30 minutes",steps:[{title:"Install ebuild and OpenOCD",code:`pip install embeddedos-ebuild

# Install OpenOCD for ST-Link
# Ubuntu: sudo apt install openocd
# macOS:  brew install openocd
# Windows: download from openocd.org`},{title:"Create an STM32 Project",code:`ebuild init my-stm32-app --template rtos --target stm32f4
# or: --target stm32h7  (higher performance)
# or: --target stm32l4  (ultra-low power)

cd my-stm32-app`},{title:"The Unified EoS HAL",text:"EoS provides a unified HAL that works identically across all STM32 families. Write once, run on any STM32.",code:`// GPIO
eos_gpio_init(GPIO_PA5, GPIO_OUTPUT);
eos_gpio_toggle(GPIO_PA5);

// UART
eos_uart_init(UART2, 115200);
eos_uart_printf(UART2, "Hello EoS!\\n");

// SPI
eos_spi_init(SPI1, SPI_MODE0, 8000000);
eos_spi_transfer(SPI1, tx_buf, rx_buf, 16);

// I2C
eos_i2c_init(I2C1, 400000);
eos_i2c_write(I2C1, 0x68, reg, data, len);`},{title:"Build",code:`ebuild build --jobs 8

# Size report:
#   .text (flash): 44,128 bytes / 1,048,576 (4.2%)
#   .data (RAM):    1,024 bytes / 196,608 (0.5%)
# [ebuild] Build complete in 2.8s`},{title:"Flash via ST-Link",code:`ebuild flash

# [ebuild] Detected ST-Link v2.1
# [ebuild] Target: STM32F446RE
# [ebuild] Writing firmware.bin...
# [ebuild] Verify: OK
# [ebuild] Flash complete.`,tip:"You can also drag-and-drop firmware.bin onto the NUCLEO drive that appears in your file manager."},{title:"Monitor UART Output",code:`ebuild monitor --baud 115200

# [app] EmbeddedOS v2.5.0 starting...
# [app] CPU: STM32F446RE ARM Cortex-M4 @ 168MHz
# [app] LED toggled, tick=0`},{title:"Debug with GDB + OpenOCD",code:`# Terminal 1: Start OpenOCD
openocd -f interface/stlink.cfg -f target/stm32f4x.cfg

# Terminal 2: Connect GDB
arm-none-eabi-gdb build/firmware.elf
(gdb) target extended-remote :3333
(gdb) monitor reset halt
(gdb) break main
(gdb) continue`},{title:"Use eFlow for Faster Development",text:"Once your hardware is working, try eFlow — the visual block editor that generates C code for you.",substeps:["ebuild eflow open — launches the eFlow editor in your browser","Drag a GPIO Output block onto the canvas","Connect it to a Timer block (500ms period)","Click Generate — eFlow writes the C code and adds it to your project","ebuild build && ebuild flash — deploy the generated code"]}],nextSteps:[{label:"EoS HAL reference",href:"/docs"},{label:"Try eFlow visual editor",href:"/flow"},{label:"Add EAI on STM32H7",href:"/eai"}]},apps:{title:"Build Cross-Platform eApps",color:"#F59E0B",intro:"eApps are C applications built with LVGL (Light and Versatile Graphics Library). They run natively on embedded displays, on your desktop (via SDL2), in a browser (via WebAssembly), and on Android/iOS (via Flutter wrapper). The same source code runs everywhere.",prereq:"Git, CMake 3.20+, GCC or Clang, SDL2 development libraries.",time:"~20 minutes",steps:[{title:"Install SDL2 (Desktop Preview)",code:`# Ubuntu / Debian
sudo apt install libsdl2-dev cmake ninja-build

# macOS
brew install sdl2 cmake ninja

# Windows (MSYS2)
pacman -S mingw-w64-x86_64-SDL2 cmake ninja`},{title:"Clone the eApps Repository",code:`git clone https://github.com/embeddedos-org/eApps.git
cd eApps

# apps/          <- 60+ individual apps
# apps/snake/    <- Snake game
# apps/ecalc/    <- Scientific calculator
# apps/ewriter/  <- Word processor
# lib/lvgl/      <- LVGL graphics library
# ports/         <- Platform backends (SDL2, ESP32, web)`},{title:"Build All Apps for Desktop",code:`cmake -B build -G Ninja \\
  -DEAPPS_PORT=sdl2 \\
  -DCMAKE_BUILD_TYPE=Release

cmake --build build --parallel
# Builds all 60+ apps in ~2 minutes`},{title:"Run the Built-in Apps",code:`./build/apps/snake/snake       # Snake game
./build/apps/ecalc/ecalc       # Calculator
./build/apps/ewriter/ewriter   # Word processor
./build/apps/esheet/esheet     # Spreadsheet
./build/eapps_launcher         # All apps launcher`,tip:"Each app opens in a 480x320 window by default, matching common embedded display sizes."},{title:"Create Your Own App",code:`cd eApps
ebuild eapp new my-sensor-dashboard

# Creates:
# apps/my-sensor-dashboard/
#   main.c      <- App entry point
#   ui.c / ui.h <- LVGL UI code`},{title:"Write Your First LVGL UI",code:`#include "lvgl/lvgl.h"

void app_main(void) {
    lv_obj_t *scr = lv_scr_act();
    lv_obj_set_style_bg_color(scr,
        lv_color_hex(0x0A1628), LV_PART_MAIN);

    lv_obj_t *label = lv_label_create(scr);
    lv_label_set_text(label, "Hello EmbeddedOS!");
    lv_obj_center(label);

    lv_obj_t *btn = lv_btn_create(scr);
    lv_obj_set_size(btn, 120, 40);
    lv_obj_align(btn, LV_ALIGN_BOTTOM_MID, 0, -20);
}`},{title:"Build for WebAssembly",code:`# Install Emscripten
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk && ./emsdk install latest && ./emsdk activate latest
source ./emsdk_env.sh

# Build for web
cmake -B build-web -G Ninja \\
  -DCMAKE_TOOLCHAIN_FILE=$EMSDK/upstream/emscripten/cmake/Modules/Platform/Emscripten.cmake \\
  -DEAPPS_PORT=emscripten
cmake --build build-web

python3 -m http.server 8080 --directory build-web`},{title:"Deploy to an Embedded Display",code:`# Build for ILI9341 display on ESP32
ebuild build --target esp32 \\
  --display ili9341 --touch xpt2046

ebuild flash --port /dev/ttyUSB0`}],nextSteps:[{label:"LVGL widget reference",href:"/docs"},{label:"eOffice Suite source code",href:"/eoffice"},{label:"Deploy to ESP32 display",href:"/getting-started"}]},"hardware-design":{title:"Hardware Engineer Workflow",color:"#A78BFA",intro:"If you are designing hardware for EmbeddedOS, ebuild has a dedicated CAD analysis pipeline. Import your KiCad or Altium schematic, ebuild extracts the component list and pin assignments, generates a board support package (BSP), and lets you simulate the entire firmware stack before your PCB arrives from the fab.",prereq:"KiCad 7+ or Altium Designer, Python 3.10+, ebuild.",time:"~45 minutes",steps:[{title:"Install ebuild with CAD Support",code:`pip install "embeddedos-ebuild[cad]"

# Installs: KiCad Python API, Altium parser,
# component database connector, BSP generator

ebuild cad --version
# ebuild CAD module v1.2.0`},{title:"Export Your Schematic",text:"ebuild reads KiCad .kicad_sch files directly. For Altium, export as Altium ASCII Schematic (.SchDoc) first.",code:`# KiCad CLI export:
kicad-cli sch export netlist \\
  --format kicad my-board.kicad_pro \\
  -o my-board.kicad_sch`},{title:"Run CAD Analysis",text:"ebuild cad analyze reads your schematic and produces a detailed report: MCU identification, peripheral mapping, power rail analysis, and EoS compatibility check.",code:`ebuild cad analyze my-board.kicad_sch

# [CAD] MCU detected: STM32H743ZIT6
# [CAD] Core: ARM Cortex-M7 @ 480MHz
# [CAD] Peripherals found:
#   UART1 (PA9/PA10) -> USB-UART bridge
#   SPI2 (PB13-15)  -> W25Q128 NOR flash
#   I2C1 (PB6/PB7)  -> BME280 sensor
#   ADC1 (PA0)      -> Analog input
# [CAD] EoS compatibility: FULL`},{title:"Generate the Board Support Package",text:"ebuild cad generate creates a complete BSP: pin definitions, clock configuration, peripheral init code, and linker scripts — all derived from your schematic.",code:`ebuild cad generate my-board.kicad_sch \\
  --output bsp/ --name my-board

# Generated:
# bsp/my-board/
#   pins.h        <- Pin definitions from schematic
#   clocks.c      <- Clock tree configuration
#   peripherals.c <- Peripheral init (UART, SPI, I2C)
#   linker.ld     <- Memory map from chip datasheet
#   ebuild.toml   <- Project configuration

# Example from pins.h:
# #define UART_TX  GPIO_PA9
# #define FLASH_CS GPIO_PB12`},{title:"Create a Project Using Your BSP",code:`ebuild init my-board-firmware \\
  --template rtos \\
  --bsp bsp/my-board

cd my-board-firmware
# Pre-configured for your exact hardware.
# All pin names match your schematic labels.`},{title:"Simulate the Full Hardware Stack",text:"EoSim can simulate your custom board using the BSP. Virtual peripherals match your real schematic.",code:`ebuild sim --bsp bsp/my-board

# [EoSim] Loading custom BSP: my-board
# [EoSim] MCU: STM32H743ZIT6 @ 480MHz (virtual)
# [EoSim] Virtual peripherals:
#   BME280 (I2C1 0x76): temp=23.4C, hum=61%
#   W25Q128 (SPI2): 16MB NOR flash
# [app] BME280 init OK
# [app] Temp: 23.4C, Humidity: 61.2%`,tip:"Inject virtual sensor data: eosim inject --peripheral bme280 --temp 35.0"},{title:"Run Static Analysis",code:`ebuild analyze

# [analyze] Stack depth analysis...
#   led_task: max stack 312 bytes (limit 1024) OK
#   sensor_task: max stack 488 bytes OK
# [analyze] Memory overlap check... OK
# [analyze] MISRA C:2012 compliance...
#   2 advisory violations (non-blocking)
# [analyze] Overall: PASS`},{title:"When Your PCB Arrives: Flash and Verify",code:`# Connect JTAG/SWD debugger
ebuild flash --interface jlink

# [ebuild] Detected J-Link v10.1
# [ebuild] Writing 180,224 bytes... OK
# [ebuild] Flash complete.

ebuild monitor --baud 115200
# [app] EmbeddedOS v2.5.0 starting...
# [app] BME280 init OK
# [app] Temp: 22.8C, Humidity: 59.4%`,tip:"Because you simulated with the same BSP, the firmware should work on first boot with no changes needed."}],nextSteps:[{label:"ebuild CAD reference",href:"/flow"},{label:"HEALTH device CAD files",href:"/hardware-lab"},{label:"Add EAI to your design",href:"/eai"}]}};function K(){const[r,w]=p.useState("nosim"),[c,m]=p.useState(null),i=L[r],S=(t,a)=>{navigator.clipboard.writeText(t),m(a),setTimeout(()=>m(null),2e3)};return e.jsxs("div",{className:"min-h-screen bg-[#080F1E]",children:[e.jsxs("section",{className:"relative py-20 sm:py-24 overflow-hidden",children:[e.jsx("div",{className:"absolute inset-0 bg-gradient-to-b from-[#0A1628] to-[#080F1E]"}),e.jsxs("div",{className:"absolute inset-0 pointer-events-none",children:[e.jsx("div",{className:"absolute top-1/3 left-1/4 w-80 h-80 bg-[#F97316]/5 rounded-full blur-[100px]"}),e.jsx("div",{className:"absolute top-1/4 right-1/3 w-64 h-64 bg-[#22D3EE]/4 rounded-full blur-[80px]"})]}),e.jsxs("div",{className:"relative max-w-5xl mx-auto px-4 sm:px-6 text-center",children:[e.jsx(o.div,{variants:s,initial:"hidden",animate:"visible",custom:0,children:e.jsxs("span",{className:"inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6",style:{background:"rgba(249,115,22,0.12)",border:"1px solid rgba(249,115,22,0.3)",color:"#F97316"},children:[e.jsx(h,{size:12})," Getting Started"]})}),e.jsxs(o.h1,{variants:s,initial:"hidden",animate:"visible",custom:1,className:"font-heading font-black text-5xl sm:text-6xl text-white mb-5 leading-[1.05]",children:["Start Building with",e.jsx("br",{}),e.jsx("span",{style:{color:"#F97316"},children:"EmbeddedOS"})]}),e.jsx(o.p,{variants:s,initial:"hidden",animate:"visible",custom:2,className:"text-white/60 text-xl max-w-2xl mx-auto mb-4 leading-relaxed",children:"No hardware required to get started. Choose your path below and go from zero to running firmware in minutes."}),e.jsxs(o.div,{variants:s,initial:"hidden",animate:"visible",custom:3,className:"inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-[#34D399]",style:{background:"rgba(52,211,153,0.08)",border:"1px solid rgba(52,211,153,0.2)"},children:[e.jsx(b,{size:14})," You can simulate 63+ boards in your browser — no install, no hardware needed"]})]})]}),e.jsx("section",{className:"pb-16",children:e.jsxs("div",{className:"max-w-5xl mx-auto px-4 sm:px-6",children:[e.jsxs(o.div,{variants:s,initial:"hidden",whileInView:"visible",viewport:{once:!0},className:"text-center mb-8",children:[e.jsx("h2",{className:"font-heading font-black text-2xl text-white mb-2",children:"The EmbeddedOS Ecosystem"}),e.jsx("p",{className:"text-white/40 text-sm",children:"8 tools that work together — understand what each one does before you start"})]}),e.jsx("div",{className:"grid grid-cols-2 sm:grid-cols-4 gap-3",children:O.map((t,a)=>{const l=t.icon;return e.jsxs(o.div,{variants:s,initial:"hidden",whileInView:"visible",viewport:{once:!0},custom:a,className:"rounded-2xl border p-4",style:{background:`${t.color}06`,borderColor:`${t.color}20`},children:[e.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[e.jsx("div",{className:"w-8 h-8 rounded-lg flex items-center justify-center shrink-0",style:{background:`${t.color}18`},children:e.jsx(l,{size:14,style:{color:t.color}})}),e.jsxs("div",{children:[e.jsx("div",{className:"font-heading font-bold text-white text-sm",children:t.name}),e.jsx("div",{className:"text-[10px]",style:{color:t.color},children:t.role})]})]}),e.jsx("p",{className:"text-white/45 text-xs leading-relaxed",children:t.desc})]},t.id)})})]})}),e.jsx("section",{className:"pb-8",children:e.jsxs("div",{className:"max-w-5xl mx-auto px-4 sm:px-6",children:[e.jsxs(o.div,{variants:s,initial:"hidden",whileInView:"visible",viewport:{once:!0},className:"text-center mb-6",children:[e.jsx("h2",{className:"font-heading font-black text-2xl text-white mb-1",children:"Choose Your Path"}),e.jsx("p",{className:"text-white/40 text-sm",children:"Pick the option that matches where you are right now"})]}),e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3",children:B.map(t=>{const a=t.icon;return e.jsxs("button",{onClick:()=>w(t.id),className:"relative flex items-center gap-3 p-4 rounded-2xl text-left transition-all",style:r===t.id?{background:`${t.color}15`,border:`1.5px solid ${t.color}50`}:{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)"},children:[t.badge&&e.jsx("span",{className:"absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold",style:{background:t.color,color:"#000"},children:t.badge}),e.jsx("div",{className:"w-10 h-10 rounded-xl flex items-center justify-center shrink-0",style:{background:r===t.id?`${t.color}25`:`${t.color}12`},children:e.jsx(a,{size:18,style:{color:t.color}})}),e.jsxs("div",{children:[e.jsx("div",{className:"font-heading font-bold text-white text-sm",children:t.label}),e.jsx("div",{className:"text-xs text-white/45",children:t.sublabel})]})]},t.id)})})]})}),e.jsx("section",{className:"pb-20",children:e.jsx("div",{className:"max-w-4xl mx-auto px-4 sm:px-6",children:e.jsx(v,{mode:"wait",children:e.jsxs(o.div,{initial:{opacity:0,y:16},animate:{opacity:1,y:0},exit:{opacity:0,y:-16},transition:{duration:.3,ease:[.23,1,.32,1]},children:[e.jsxs("div",{className:"rounded-2xl border p-6 mb-6",style:{background:`${i.color}08`,borderColor:`${i.color}25`},children:[e.jsxs("div",{className:"flex flex-wrap items-center gap-3 mb-3",children:[e.jsx("h2",{className:"font-heading font-black text-2xl sm:text-3xl text-white",children:i.title}),e.jsx("span",{className:"px-3 py-1 rounded-full text-xs font-bold",style:{background:`${i.color}20`,color:i.color},children:i.time})]}),e.jsx("p",{className:"text-white/60 text-base mb-4 leading-relaxed",children:i.intro}),e.jsxs("div",{className:"flex items-start gap-2 p-3 rounded-xl",style:{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)"},children:[e.jsx(N,{size:14,className:"text-white/40 mt-0.5 shrink-0"}),e.jsxs("div",{children:[e.jsxs("span",{className:"text-xs font-bold text-white/40 uppercase tracking-wider",children:["Prerequisites:"," "]}),e.jsx("span",{className:"text-xs text-white/60",children:i.prereq})]})]})]}),e.jsx("div",{className:"space-y-4",children:i.steps.map((t,a)=>e.jsxs(o.div,{variants:s,initial:"hidden",animate:"visible",custom:a,className:"rounded-2xl border border-white/8 overflow-hidden",style:{background:"rgba(255,255,255,0.02)"},children:[e.jsxs("div",{className:"flex items-center gap-3 px-5 py-4 border-b border-white/5",children:[e.jsx("div",{className:"w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0",style:{background:`${i.color}25`,border:`1px solid ${i.color}40`},children:a+1}),e.jsx("h3",{className:"font-heading font-bold text-white",children:t.title})]}),e.jsxs("div",{className:"px-5 py-4 space-y-3",children:[t.text&&e.jsx("p",{className:"text-sm text-white/60 leading-relaxed",children:t.text}),t.substeps&&e.jsx("ul",{className:"space-y-1.5",children:t.substeps.map(l=>e.jsxs("li",{className:"flex items-start gap-2 text-sm text-white/55",children:[e.jsx(A,{size:13,className:"mt-0.5 shrink-0",style:{color:i.color}}),l]},l))}),t.code&&e.jsxs("div",{className:"relative rounded-xl overflow-hidden border border-white/8",style:{background:"rgba(5,10,20,0.9)"},children:[e.jsxs("div",{className:"flex items-center justify-between px-4 py-2 border-b border-white/5",children:[e.jsxs("div",{className:"flex gap-1.5",children:[e.jsx("div",{className:"w-2.5 h-2.5 rounded-full bg-[#F85149]/50"}),e.jsx("div",{className:"w-2.5 h-2.5 rounded-full bg-[#F0883E]/50"}),e.jsx("div",{className:"w-2.5 h-2.5 rounded-full bg-[#3FB950]/50"})]}),e.jsxs("button",{onClick:()=>S(t.code,a),className:"flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors",children:[c===a?e.jsx(b,{size:12,className:"text-[#34D399]"}):e.jsx(I,{size:12}),c===a?"Copied!":"Copy"]})]}),e.jsx("pre",{className:"p-4 text-xs overflow-x-auto font-mono leading-relaxed",children:e.jsx("code",{style:{color:"#E6EDF3"},children:t.code})})]}),t.tip&&e.jsxs("div",{className:"flex items-start gap-2 p-3 rounded-xl text-xs",style:{background:`${i.color}08`,border:`1px solid ${i.color}20`},children:[e.jsx(j,{size:12,style:{color:i.color},className:"mt-0.5 shrink-0"}),e.jsxs("span",{style:{color:i.color},children:[e.jsx("strong",{children:"Tip:"})," ",t.tip]})]}),t.warn&&e.jsxs("div",{className:"flex items-start gap-2 p-3 rounded-xl text-xs",style:{background:"rgba(248,81,73,0.08)",border:"1px solid rgba(248,81,73,0.2)"},children:[e.jsx(C,{size:12,className:"text-[#F85149] mt-0.5 shrink-0"}),e.jsxs("span",{className:"text-[#F85149]",children:[e.jsx("strong",{children:"Note:"})," ",t.warn]})]})]})]},t.title))}),e.jsxs("div",{className:"mt-8 rounded-2xl border border-white/8 p-5",style:{background:"rgba(255,255,255,0.02)"},children:[e.jsx("div",{className:"text-xs font-bold text-white/40 uppercase tracking-widest mb-3",children:"What's Next"}),e.jsx("div",{className:"flex flex-wrap gap-2",children:i.nextSteps.map(t=>e.jsxs(u,{href:t.href,className:"inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white/70 hover:text-white transition-all",style:{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)"},children:[t.label," ",e.jsx(_,{size:13})]},t.label))})]})]},r)})})}),e.jsx("section",{className:"pb-24",children:e.jsx("div",{className:"max-w-5xl mx-auto px-4 sm:px-6",children:e.jsx("div",{className:"grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3",children:[{label:"EoS Kernel",href:"/eos",color:"#F97316",icon:n},{label:"eBoot",href:"/eboot",color:"#F59E0B",icon:x},{label:"eFlow",href:"/flow",color:"#A78BFA",icon:g},{label:"EAI / ENI",href:"/eai",color:"#34D399",icon:f},{label:"eOffice",href:"/eoffice",color:"#22D3EE",icon:d},{label:"Hardware Lab",href:"/hardware-lab",color:"#60A5FA",icon:D}].map(t=>{const a=t.icon;return e.jsxs(u,{href:t.href,className:"flex flex-col items-center gap-2 p-4 rounded-2xl border text-center transition-all hover:scale-[1.02]",style:{background:`${t.color}08`,borderColor:`${t.color}20`},children:[e.jsx("div",{className:"w-10 h-10 rounded-xl flex items-center justify-center",style:{background:`${t.color}18`},children:e.jsx(a,{size:16,style:{color:t.color}})}),e.jsx("span",{className:"text-xs font-bold text-white/60",children:t.label})]},t.label)})})})})]})}export{K as default};
