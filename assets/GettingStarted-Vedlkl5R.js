import{r as m,j as e,m as a,W as v,C as n,S as g,L as h,B as x,P as d,a as E,b as G,A as y,c as D,d as k,e as P,f as b,g as A}from"./index-Dgv1uCQo.js";import{P as f}from"./play-DWwulP6s.js";import{C as p}from"./circle-check-Ccbbv0BM.js";import{M as S}from"./monitor-C4pQkQVK.js";import{P as j}from"./pen-tool-D8H-qvTx.js";import{I as C}from"./info-Bb6RXwro.js";import{C as _}from"./copy-DhI1ixFT.js";import{H as V}from"./hard-drive-C5Home7j.js";const l={hidden:{opacity:0,y:20},visible:(r=0)=>({opacity:1,y:0,transition:{duration:.45,delay:r*.07,ease:[.23,1,.32,1]}})},T=[{id:"ebuild",name:"ebuild",role:"Build Tool",desc:"Compiles, links, analyzes CAD, and flashes firmware. The single CLI for the entire EoS lifecycle.",color:"#F97316",icon:v},{id:"eosim",name:"EoSim",role:"Simulator",desc:"Runs your firmware in-browser on 63+ virtual boards. No hardware required — ever.",color:"#22D3EE",icon:S},{id:"eos",name:"EoS Kernel",role:"RTOS Kernel",desc:"The real-time OS kernel. Provides HAL, scheduler, IPC, drivers, and POSIX subset.",color:"#F97316",icon:n},{id:"eboot",name:"eBoot",role:"Bootloader",desc:"Secure bootloader with verified boot, OTA A/B updates, and hardware root of trust.",color:"#F59E0B",icon:g},{id:"eflow",name:"eFlow",role:"Visual Programming",desc:"Drag-and-drop block editor that generates production C code. No assembly needed for common patterns.",color:"#A78BFA",icon:h},{id:"eai",name:"EAI / ENI",role:"Edge AI",desc:"On-device TFLite/ONNX inference and neural interface adapter for BCI devices.",color:"#34D399",icon:x},{id:"eapps",name:"eApps",role:"App Ecosystem",desc:"60+ apps including eOffice Suite, eBrowser, eDB, and eBot AI assistant.",color:"#60A5FA",icon:d},{id:"eostudio",name:"EoStudio",role:"IDE",desc:"Universal IDE with AI tutor, 3D modeler, game editor, and UI designer.",color:"#F472B6",icon:E}],I=[{id:"nosim",icon:f,label:"No Hardware, No Install",sublabel:"Run in browser — 60 seconds",color:"#34D399",badge:"Fastest"},{id:"sim",icon:S,label:"Simulator on My Computer",sublabel:"Full EoSim CLI + ebuild",color:"#22D3EE"},{id:"esp32",icon:G,label:"I Have an ESP32",sublabel:"Flash EoS to $5 board",color:"#F97316"},{id:"stm32",icon:n,label:"I Have an STM32",sublabel:"Nucleo / Discovery board",color:"#22D3EE"},{id:"apps",icon:d,label:"I Want to Build eApps",sublabel:"C + LVGL cross-platform apps",color:"#F59E0B"},{id:"hardware-design",icon:j,label:"I'm a Hardware Engineer",sublabel:"CAD → ebuild → simulate → flash",color:"#A78BFA"}],O={nosim:{title:"Run EoS in Your Browser — No Install",color:"#34D399",intro:"EoSim runs entirely in your browser using WebAssembly. You can write, compile, and simulate firmware on a virtual STM32, ESP32, or Raspberry Pi Pico without installing anything. This is the fastest way to understand what EmbeddedOS is.",prereq:"A modern browser (Chrome 90+, Firefox 88+, Safari 15+). That is it.",time:"~5 minutes",steps:[{title:"Open the EoSim Demo",text:"Navigate to the EoSim demo page. You will see a virtual board with GPIO pins, a code editor, and a UART output console. No login required.",substeps:["Click 'Demo' in the top navigation, or go directly to /demo","The simulator loads a virtual STM32F4 board by default"]},{title:"Choose a Board",text:"EoSim supports 63+ virtual boards. For your first run, keep the default STM32F4 Discovery. You can switch to ESP32 or Raspberry Pi Pico using the board selector.",substeps:["STM32F4 — ARM Cortex-M4, 168MHz, 1MB flash","ESP32 — Xtensa LX6, 240MHz, Wi-Fi + BT","RPi Pico — RP2040, dual-core ARM Cortex-M0+"]},{title:"Select a Program",text:"Three example programs are pre-loaded:",substeps:["LED Blink — Toggles GPIO PA5 every 500ms. The simplest possible EoS program.","UART Echo — Reads from UART1 and echoes back. Demonstrates the EoS UART HAL.","GPIO Scanner — Reads all GPIO pins and prints their state every 100ms."]},{title:"Click Run",text:"Press the green Run button. The simulator compiles the program, loads it onto the virtual board, and starts execution. You will see UART output appear in the console within 1-2 seconds.",tip:"The GPIO pins on the right side of the board light up in real time as the program toggles them."},{title:"Interact with the Simulation",substeps:["Click any GPIO pin to toggle it manually — the program will read the new state","The UART console shows all output from the virtual board","Click Reset to restart the simulation from the beginning","Click Stop to pause execution at any point"]},{title:"What You Just Ran — The Source Code",text:"The LED Blink program is a complete EoS application:",code:`#include "eos/hal/gpio.h"
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
# [app] Temp: 22.8C, Humidity: 59.4%`,tip:"Because you simulated with the same BSP, the firmware should work on first boot with no changes needed."}],nextSteps:[{label:"ebuild CAD reference",href:"/flow"},{label:"HEALTH device CAD files",href:"/hardware-lab"},{label:"Add EAI to your design",href:"/eai"}]}};function z(){const[r,N]=m.useState("nosim"),[c,u]=m.useState(null),i=O[r],w=(t,s)=>{navigator.clipboard.writeText(t),u(s),setTimeout(()=>u(null),2e3)};return e.jsxDEV("div",{"data-loc":"client/src/pages/GettingStarted.tsx:397",className:"min-h-screen bg-[#080F1E]",children:[e.jsxDEV("section",{"data-loc":"client/src/pages/GettingStarted.tsx:399",className:"relative py-20 sm:py-24 overflow-hidden",children:[e.jsxDEV("div",{"data-loc":"client/src/pages/GettingStarted.tsx:400",className:"absolute inset-0 bg-gradient-to-b from-[#0A1628] to-[#080F1E]"},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:400,columnNumber:9},this),e.jsxDEV("div",{"data-loc":"client/src/pages/GettingStarted.tsx:401",className:"absolute inset-0 pointer-events-none",children:[e.jsxDEV("div",{"data-loc":"client/src/pages/GettingStarted.tsx:402",className:"absolute top-1/3 left-1/4 w-80 h-80 bg-[#F97316]/5 rounded-full blur-[100px]"},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:402,columnNumber:11},this),e.jsxDEV("div",{"data-loc":"client/src/pages/GettingStarted.tsx:403",className:"absolute top-1/4 right-1/3 w-64 h-64 bg-[#22D3EE]/4 rounded-full blur-[80px]"},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:403,columnNumber:11},this)]},void 0,!0,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:401,columnNumber:9},this),e.jsxDEV("div",{"data-loc":"client/src/pages/GettingStarted.tsx:405",className:"relative max-w-5xl mx-auto px-4 sm:px-6 text-center",children:[e.jsxDEV(a.div,{"data-loc":"client/src/pages/GettingStarted.tsx:406",variants:l,initial:"hidden",animate:"visible",custom:0,children:e.jsxDEV("span",{"data-loc":"client/src/pages/GettingStarted.tsx:407",className:"inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6",style:{background:"rgba(249,115,22,0.12)",border:"1px solid rgba(249,115,22,0.3)",color:"#F97316"},children:[e.jsxDEV(f,{"data-loc":"client/src/pages/GettingStarted.tsx:409",size:12},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:409,columnNumber:15},this)," Getting Started"]},void 0,!0,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:407,columnNumber:13},this)},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:406,columnNumber:11},this),e.jsxDEV(a.h1,{"data-loc":"client/src/pages/GettingStarted.tsx:412",variants:l,initial:"hidden",animate:"visible",custom:1,className:"font-heading font-black text-5xl sm:text-6xl text-white mb-5 leading-[1.05]",children:["Start Building with",e.jsxDEV("br",{"data-loc":"client/src/pages/GettingStarted.tsx:414"},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:414,columnNumber:32},this),e.jsxDEV("span",{"data-loc":"client/src/pages/GettingStarted.tsx:415",style:{color:"#F97316"},children:"EmbeddedOS"},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:415,columnNumber:13},this)]},void 0,!0,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:412,columnNumber:11},this),e.jsxDEV(a.p,{"data-loc":"client/src/pages/GettingStarted.tsx:417",variants:l,initial:"hidden",animate:"visible",custom:2,className:"text-white/60 text-xl max-w-2xl mx-auto mb-4 leading-relaxed",children:"No hardware required to get started. Choose your path below and go from zero to running firmware in minutes."},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:417,columnNumber:11},this),e.jsxDEV(a.div,{"data-loc":"client/src/pages/GettingStarted.tsx:421",variants:l,initial:"hidden",animate:"visible",custom:3,className:"inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-[#34D399]",style:{background:"rgba(52,211,153,0.08)",border:"1px solid rgba(52,211,153,0.2)"},children:[e.jsxDEV(p,{"data-loc":"client/src/pages/GettingStarted.tsx:424",size:14},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:424,columnNumber:13},this)," You can simulate 63+ boards in your browser — no install, no hardware needed"]},void 0,!0,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:421,columnNumber:11},this)]},void 0,!0,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:405,columnNumber:9},this)]},void 0,!0,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:399,columnNumber:7},this),e.jsxDEV("section",{"data-loc":"client/src/pages/GettingStarted.tsx:430",className:"pb-16",children:e.jsxDEV("div",{"data-loc":"client/src/pages/GettingStarted.tsx:431",className:"max-w-5xl mx-auto px-4 sm:px-6",children:[e.jsxDEV(a.div,{"data-loc":"client/src/pages/GettingStarted.tsx:432",variants:l,initial:"hidden",whileInView:"visible",viewport:{once:!0},className:"text-center mb-8",children:[e.jsxDEV("h2",{"data-loc":"client/src/pages/GettingStarted.tsx:433",className:"font-heading font-black text-2xl text-white mb-2",children:"The EmbeddedOS Ecosystem"},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:433,columnNumber:13},this),e.jsxDEV("p",{"data-loc":"client/src/pages/GettingStarted.tsx:434",className:"text-white/40 text-sm",children:"8 tools that work together — understand what each one does before you start"},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:434,columnNumber:13},this)]},void 0,!0,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:432,columnNumber:11},this),e.jsxDEV("div",{"data-loc":"client/src/pages/GettingStarted.tsx:436",className:"grid grid-cols-2 sm:grid-cols-4 gap-3",children:T.map((t,s)=>{const o=t.icon;return e.jsxDEV(a.div,{"data-loc":"client/src/pages/GettingStarted.tsx:440",variants:l,initial:"hidden",whileInView:"visible",viewport:{once:!0},custom:s,className:"rounded-2xl border p-4",style:{background:`${t.color}06`,borderColor:`${t.color}20`},children:[e.jsxDEV("div",{"data-loc":"client/src/pages/GettingStarted.tsx:443",className:"flex items-center gap-2 mb-2",children:[e.jsxDEV("div",{"data-loc":"client/src/pages/GettingStarted.tsx:444",className:"w-8 h-8 rounded-lg flex items-center justify-center shrink-0",style:{background:`${t.color}18`},children:e.jsxDEV(o,{"data-loc":"client/src/pages/GettingStarted.tsx:446",size:14,style:{color:t.color}},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:446,columnNumber:23},this)},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:444,columnNumber:21},this),e.jsxDEV("div",{"data-loc":"client/src/pages/GettingStarted.tsx:448",children:[e.jsxDEV("div",{"data-loc":"client/src/pages/GettingStarted.tsx:449",className:"font-heading font-bold text-white text-sm",children:t.name},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:449,columnNumber:23},this),e.jsxDEV("div",{"data-loc":"client/src/pages/GettingStarted.tsx:450",className:"text-[10px]",style:{color:t.color},children:t.role},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:450,columnNumber:23},this)]},void 0,!0,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:448,columnNumber:21},this)]},void 0,!0,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:443,columnNumber:19},this),e.jsxDEV("p",{"data-loc":"client/src/pages/GettingStarted.tsx:453",className:"text-white/45 text-xs leading-relaxed",children:t.desc},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:453,columnNumber:19},this)]},t.id,!0,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:440,columnNumber:17},this)})},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:436,columnNumber:11},this)]},void 0,!0,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:431,columnNumber:9},this)},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:430,columnNumber:7},this),e.jsxDEV("section",{"data-loc":"client/src/pages/GettingStarted.tsx:462",className:"pb-8",children:e.jsxDEV("div",{"data-loc":"client/src/pages/GettingStarted.tsx:463",className:"max-w-5xl mx-auto px-4 sm:px-6",children:[e.jsxDEV(a.div,{"data-loc":"client/src/pages/GettingStarted.tsx:464",variants:l,initial:"hidden",whileInView:"visible",viewport:{once:!0},className:"text-center mb-6",children:[e.jsxDEV("h2",{"data-loc":"client/src/pages/GettingStarted.tsx:465",className:"font-heading font-black text-2xl text-white mb-1",children:"Choose Your Path"},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:465,columnNumber:13},this),e.jsxDEV("p",{"data-loc":"client/src/pages/GettingStarted.tsx:466",className:"text-white/40 text-sm",children:"Pick the option that matches where you are right now"},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:466,columnNumber:13},this)]},void 0,!0,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:464,columnNumber:11},this),e.jsxDEV("div",{"data-loc":"client/src/pages/GettingStarted.tsx:468",className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3",children:I.map(t=>{const s=t.icon;return e.jsxDEV("button",{"data-loc":"client/src/pages/GettingStarted.tsx:472",onClick:()=>N(t.id),className:"relative flex items-center gap-3 p-4 rounded-2xl text-left transition-all",style:r===t.id?{background:`${t.color}15`,border:`1.5px solid ${t.color}50`}:{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)"},children:[t.badge&&e.jsxDEV("span",{"data-loc":"client/src/pages/GettingStarted.tsx:478",className:"absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold",style:{background:t.color,color:"#000"},children:t.badge},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:478,columnNumber:21},this),e.jsxDEV("div",{"data-loc":"client/src/pages/GettingStarted.tsx:481",className:"w-10 h-10 rounded-xl flex items-center justify-center shrink-0",style:{background:r===t.id?`${t.color}25`:`${t.color}12`},children:e.jsxDEV(s,{"data-loc":"client/src/pages/GettingStarted.tsx:483",size:18,style:{color:t.color}},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:483,columnNumber:21},this)},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:481,columnNumber:19},this),e.jsxDEV("div",{"data-loc":"client/src/pages/GettingStarted.tsx:485",children:[e.jsxDEV("div",{"data-loc":"client/src/pages/GettingStarted.tsx:486",className:"font-heading font-bold text-white text-sm",children:t.label},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:486,columnNumber:21},this),e.jsxDEV("div",{"data-loc":"client/src/pages/GettingStarted.tsx:487",className:"text-xs text-white/45",children:t.sublabel},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:487,columnNumber:21},this)]},void 0,!0,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:485,columnNumber:19},this)]},t.id,!0,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:472,columnNumber:17},this)})},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:468,columnNumber:11},this)]},void 0,!0,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:463,columnNumber:9},this)},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:462,columnNumber:7},this),e.jsxDEV("section",{"data-loc":"client/src/pages/GettingStarted.tsx:497",className:"pb-20",children:e.jsxDEV("div",{"data-loc":"client/src/pages/GettingStarted.tsx:498",className:"max-w-4xl mx-auto px-4 sm:px-6",children:e.jsxDEV(y,{"data-loc":"client/src/pages/GettingStarted.tsx:499",mode:"wait",children:e.jsxDEV(a.div,{"data-loc":"client/src/pages/GettingStarted.tsx:500",initial:{opacity:0,y:16},animate:{opacity:1,y:0},exit:{opacity:0,y:-16},transition:{duration:.3,ease:[.23,1,.32,1]},children:[e.jsxDEV("div",{"data-loc":"client/src/pages/GettingStarted.tsx:506",className:"rounded-2xl border p-6 mb-6",style:{background:`${i.color}08`,borderColor:`${i.color}25`},children:[e.jsxDEV("div",{"data-loc":"client/src/pages/GettingStarted.tsx:508",className:"flex flex-wrap items-center gap-3 mb-3",children:[e.jsxDEV("h2",{"data-loc":"client/src/pages/GettingStarted.tsx:509",className:"font-heading font-black text-2xl sm:text-3xl text-white",children:i.title},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:509,columnNumber:19},this),e.jsxDEV("span",{"data-loc":"client/src/pages/GettingStarted.tsx:510",className:"px-3 py-1 rounded-full text-xs font-bold",style:{background:`${i.color}20`,color:i.color},children:i.time},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:510,columnNumber:19},this)]},void 0,!0,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:508,columnNumber:17},this),e.jsxDEV("p",{"data-loc":"client/src/pages/GettingStarted.tsx:513",className:"text-white/60 text-base mb-4 leading-relaxed",children:i.intro},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:513,columnNumber:17},this),e.jsxDEV("div",{"data-loc":"client/src/pages/GettingStarted.tsx:514",className:"flex items-start gap-2 p-3 rounded-xl",style:{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)"},children:[e.jsxDEV(C,{"data-loc":"client/src/pages/GettingStarted.tsx:516",size:14,className:"text-white/40 mt-0.5 shrink-0"},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:516,columnNumber:19},this),e.jsxDEV("div",{"data-loc":"client/src/pages/GettingStarted.tsx:517",children:[e.jsxDEV("span",{"data-loc":"client/src/pages/GettingStarted.tsx:518",className:"text-xs font-bold text-white/40 uppercase tracking-wider",children:"Prerequisites: "},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:518,columnNumber:21},this),e.jsxDEV("span",{"data-loc":"client/src/pages/GettingStarted.tsx:519",className:"text-xs text-white/60",children:i.prereq},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:519,columnNumber:21},this)]},void 0,!0,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:517,columnNumber:19},this)]},void 0,!0,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:514,columnNumber:17},this)]},void 0,!0,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:506,columnNumber:15},this),e.jsxDEV("div",{"data-loc":"client/src/pages/GettingStarted.tsx:524",className:"space-y-4",children:i.steps.map((t,s)=>e.jsxDEV(a.div,{"data-loc":"client/src/pages/GettingStarted.tsx:526",variants:l,initial:"hidden",animate:"visible",custom:s,className:"rounded-2xl border border-white/8 overflow-hidden",style:{background:"rgba(255,255,255,0.02)"},children:[e.jsxDEV("div",{"data-loc":"client/src/pages/GettingStarted.tsx:529",className:"flex items-center gap-3 px-5 py-4 border-b border-white/5",children:[e.jsxDEV("div",{"data-loc":"client/src/pages/GettingStarted.tsx:530",className:"w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0",style:{background:`${i.color}25`,border:`1px solid ${i.color}40`},children:s+1},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:530,columnNumber:23},this),e.jsxDEV("h3",{"data-loc":"client/src/pages/GettingStarted.tsx:534",className:"font-heading font-bold text-white",children:t.title},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:534,columnNumber:23},this)]},void 0,!0,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:529,columnNumber:21},this),e.jsxDEV("div",{"data-loc":"client/src/pages/GettingStarted.tsx:536",className:"px-5 py-4 space-y-3",children:[t.text&&e.jsxDEV("p",{"data-loc":"client/src/pages/GettingStarted.tsx:537",className:"text-sm text-white/60 leading-relaxed",children:t.text},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:537,columnNumber:37},this),t.substeps&&e.jsxDEV("ul",{"data-loc":"client/src/pages/GettingStarted.tsx:539",className:"space-y-1.5",children:t.substeps.map(o=>e.jsxDEV("li",{"data-loc":"client/src/pages/GettingStarted.tsx:541",className:"flex items-start gap-2 text-sm text-white/55",children:[e.jsxDEV(D,{"data-loc":"client/src/pages/GettingStarted.tsx:542",size:13,className:"mt-0.5 shrink-0",style:{color:i.color}},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:542,columnNumber:31},this),o]},o,!0,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:541,columnNumber:29},this))},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:539,columnNumber:25},this),t.code&&e.jsxDEV("div",{"data-loc":"client/src/pages/GettingStarted.tsx:549",className:"relative rounded-xl overflow-hidden border border-white/8",style:{background:"rgba(5,10,20,0.9)"},children:[e.jsxDEV("div",{"data-loc":"client/src/pages/GettingStarted.tsx:551",className:"flex items-center justify-between px-4 py-2 border-b border-white/5",children:[e.jsxDEV("div",{"data-loc":"client/src/pages/GettingStarted.tsx:552",className:"flex gap-1.5",children:[e.jsxDEV("div",{"data-loc":"client/src/pages/GettingStarted.tsx:553",className:"w-2.5 h-2.5 rounded-full bg-[#F85149]/50"},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:553,columnNumber:31},this),e.jsxDEV("div",{"data-loc":"client/src/pages/GettingStarted.tsx:554",className:"w-2.5 h-2.5 rounded-full bg-[#F0883E]/50"},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:554,columnNumber:31},this),e.jsxDEV("div",{"data-loc":"client/src/pages/GettingStarted.tsx:555",className:"w-2.5 h-2.5 rounded-full bg-[#3FB950]/50"},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:555,columnNumber:31},this)]},void 0,!0,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:552,columnNumber:29},this),e.jsxDEV("button",{"data-loc":"client/src/pages/GettingStarted.tsx:557",onClick:()=>w(t.code,s),className:"flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors",children:[c===s?e.jsxDEV(p,{"data-loc":"client/src/pages/GettingStarted.tsx:559",size:12,className:"text-[#34D399]"},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:559,columnNumber:50},this):e.jsxDEV(_,{"data-loc":"client/src/pages/GettingStarted.tsx:559",size:12},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:559,columnNumber:157},this),c===s?"Copied!":"Copy"]},void 0,!0,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:557,columnNumber:29},this)]},void 0,!0,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:551,columnNumber:27},this),e.jsxDEV("pre",{"data-loc":"client/src/pages/GettingStarted.tsx:563",className:"p-4 text-xs overflow-x-auto font-mono leading-relaxed",children:e.jsxDEV("code",{"data-loc":"client/src/pages/GettingStarted.tsx:564",style:{color:"#E6EDF3"},children:t.code},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:564,columnNumber:29},this)},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:563,columnNumber:27},this)]},void 0,!0,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:549,columnNumber:25},this),t.tip&&e.jsxDEV("div",{"data-loc":"client/src/pages/GettingStarted.tsx:569",className:"flex items-start gap-2 p-3 rounded-xl text-xs",style:{background:`${i.color}08`,border:`1px solid ${i.color}20`},children:[e.jsxDEV(k,{"data-loc":"client/src/pages/GettingStarted.tsx:571",size:12,style:{color:i.color},className:"mt-0.5 shrink-0"},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:571,columnNumber:27},this),e.jsxDEV("span",{"data-loc":"client/src/pages/GettingStarted.tsx:572",style:{color:i.color},children:[e.jsxDEV("strong",{"data-loc":"client/src/pages/GettingStarted.tsx:572",children:"Tip:"},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:572,columnNumber:117},this)," ",t.tip]},void 0,!0,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:572,columnNumber:27},this)]},void 0,!0,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:569,columnNumber:25},this),t.warn&&e.jsxDEV("div",{"data-loc":"client/src/pages/GettingStarted.tsx:576",className:"flex items-start gap-2 p-3 rounded-xl text-xs",style:{background:"rgba(248,81,73,0.08)",border:"1px solid rgba(248,81,73,0.2)"},children:[e.jsxDEV(P,{"data-loc":"client/src/pages/GettingStarted.tsx:578",size:12,className:"text-[#F85149] mt-0.5 shrink-0"},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:578,columnNumber:27},this),e.jsxDEV("span",{"data-loc":"client/src/pages/GettingStarted.tsx:579",className:"text-[#F85149]",children:[e.jsxDEV("strong",{"data-loc":"client/src/pages/GettingStarted.tsx:579",children:"Note:"},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:579,columnNumber:111},this)," ",t.warn]},void 0,!0,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:579,columnNumber:27},this)]},void 0,!0,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:576,columnNumber:25},this)]},void 0,!0,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:536,columnNumber:21},this)]},t.title,!0,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:526,columnNumber:19},this))},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:524,columnNumber:15},this),e.jsxDEV("div",{"data-loc":"client/src/pages/GettingStarted.tsx:587",className:"mt-8 rounded-2xl border border-white/8 p-5",style:{background:"rgba(255,255,255,0.02)"},children:[e.jsxDEV("div",{"data-loc":"client/src/pages/GettingStarted.tsx:589",className:"text-xs font-bold text-white/40 uppercase tracking-widest mb-3",children:"What's Next"},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:589,columnNumber:17},this),e.jsxDEV("div",{"data-loc":"client/src/pages/GettingStarted.tsx:590",className:"flex flex-wrap gap-2",children:i.nextSteps.map(t=>e.jsxDEV(b,{"data-loc":"client/src/pages/GettingStarted.tsx:592",href:t.href,className:"inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white/70 hover:text-white transition-all",style:{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)"},children:[t.label," ",e.jsxDEV(A,{"data-loc":"client/src/pages/GettingStarted.tsx:595",size:13},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:595,columnNumber:34},this)]},t.label,!0,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:592,columnNumber:21},this))},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:590,columnNumber:17},this)]},void 0,!0,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:587,columnNumber:15},this)]},r,!0,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:500,columnNumber:13},this)},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:499,columnNumber:11},this)},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:498,columnNumber:9},this)},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:497,columnNumber:7},this),e.jsxDEV("section",{"data-loc":"client/src/pages/GettingStarted.tsx:606",className:"pb-24",children:e.jsxDEV("div",{"data-loc":"client/src/pages/GettingStarted.tsx:607",className:"max-w-5xl mx-auto px-4 sm:px-6",children:e.jsxDEV("div",{"data-loc":"client/src/pages/GettingStarted.tsx:608",className:"grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3",children:[{label:"EoS Kernel",href:"/eos",color:"#F97316",icon:n},{label:"eBoot",href:"/eboot",color:"#F59E0B",icon:g},{label:"eFlow",href:"/flow",color:"#A78BFA",icon:h},{label:"EAI / ENI",href:"/eai",color:"#34D399",icon:x},{label:"eOffice",href:"/eoffice",color:"#22D3EE",icon:d},{label:"Hardware Lab",href:"/hardware-lab",color:"#60A5FA",icon:V}].map(t=>{const s=t.icon;return e.jsxDEV(b,{"data-loc":"client/src/pages/GettingStarted.tsx:619",href:t.href,className:"flex flex-col items-center gap-2 p-4 rounded-2xl border text-center transition-all hover:scale-[1.02]",style:{background:`${t.color}08`,borderColor:`${t.color}20`},children:[e.jsxDEV("div",{"data-loc":"client/src/pages/GettingStarted.tsx:622",className:"w-10 h-10 rounded-xl flex items-center justify-center",style:{background:`${t.color}18`},children:e.jsxDEV(s,{"data-loc":"client/src/pages/GettingStarted.tsx:624",size:16,style:{color:t.color}},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:624,columnNumber:21},this)},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:622,columnNumber:19},this),e.jsxDEV("span",{"data-loc":"client/src/pages/GettingStarted.tsx:626",className:"text-xs font-bold text-white/60",children:t.label},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:626,columnNumber:19},this)]},t.label,!0,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:619,columnNumber:17},this)})},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:608,columnNumber:11},this)},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:607,columnNumber:9},this)},void 0,!1,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:606,columnNumber:7},this)]},void 0,!0,{fileName:"/home/ubuntu/embeddedos-website/client/src/pages/GettingStarted.tsx",lineNumber:397,columnNumber:5},this)}export{z as default};
