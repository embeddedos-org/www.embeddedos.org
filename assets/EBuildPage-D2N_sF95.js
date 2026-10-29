import{r as d,j as e,L as i}from"./vendor-react-aOLDZyDv.js";import{c as y}from"./clipboard-B9HKxd0_.js";import{i as x,j as v,k as j,l,p as w,m as C,n as k}from"./index-fhjakIhk.js";import"./vendor-motion-D0ROkIIu.js";const b=[{group:"Project Management",color:"#F97316",cmds:[{cmd:"ebuild init <name>",flags:"--template rtos|bare|app  --target <board>  --bsp <path>",desc:"Create a new EoS project. Generates CMakeLists.txt, linker scripts, startup code, and ebuild.toml for the specified target board.",example:"ebuild init my-sensor --template rtos --target esp32"},{cmd:"ebuild clean",flags:"--all",desc:"Remove all build artifacts. --all also removes the CMake cache.",example:"ebuild clean --all"},{cmd:"ebuild info",flags:"",desc:"Print project metadata: target board, EoS version, enabled features, memory layout.",example:"ebuild info"}]},{group:"Build",color:"#22D3EE",cmds:[{cmd:"ebuild build",flags:"--jobs N  --release  --debug  --size",desc:"Compile and link the firmware. Produces firmware.elf, firmware.bin, and firmware.map. --size prints a detailed memory usage report.",example:"ebuild build --jobs 8 --size"},{cmd:"ebuild build --target <board>",flags:"--bsp <path>  --features wifi,bt",desc:"Cross-compile for a different board without changing ebuild.toml. Useful for CI/CD pipelines that build for multiple targets.",example:"ebuild build --target stm32h7 --features wifi"}]},{group:"Simulation",color:"#A78BFA",cmds:[{cmd:"ebuild sim",flags:"--platform <board>  --gui  --gdb  --bsp <path>",desc:"Launch EoSim with the compiled firmware. --gui opens the graphical pin visualizer. --gdb starts a GDB stub on port 3333.",example:"ebuild sim --platform esp32 --gui"},{cmd:"ebuild eflow open",flags:"--port 8090",desc:"Launch the eFlow visual block editor in your browser. Automatically loads the current project's BSP for auto-populated pin names.",example:"ebuild eflow open --port 8090"}]},{group:"Flash & Monitor",color:"#34D399",cmds:[{cmd:"ebuild flash",flags:"--port /dev/ttyUSB0  --interface jlink|stlink|cmsis-dap  --verify  --offset 0x8000000",desc:"Write firmware to the target device. Auto-detects the programmer. --verify reads back and confirms the flash contents.",example:"ebuild flash --interface stlink --verify"},{cmd:"ebuild monitor",flags:"--baud N  --port <port>  --timestamp  --filter <regex>",desc:"Open a serial monitor. --filter shows only lines matching a regex. --timestamp prepends UTC timestamps to each line.",example:"ebuild monitor --baud 115200 --filter '\\[app\\]'"},{cmd:"ebuild ota push",flags:"--url <device-ip>  --key <signing-key>",desc:"Push a signed OTA update to a device running eBoot. The device verifies the signature before applying the update.",example:"ebuild ota push --url 192.168.1.42 --key keys/ota.pem"}]},{group:"CAD Analysis",color:"#F59E0B",cmds:[{cmd:"ebuild cad analyze <schematic>",flags:"--format kicad|altium  --output report.json",desc:"Parse a KiCad or Altium schematic. Identifies the MCU, maps all peripheral pins, checks power rails, and produces an EoS compatibility report.",example:"ebuild cad analyze my-board.kicad_sch --output report.json"},{cmd:"ebuild cad generate <schematic>",flags:"--output bsp/  --name <board-name>",desc:"Generate a complete Board Support Package from a schematic: pins.h, clocks.c, peripherals.c, linker.ld, and ebuild.toml.",example:"ebuild cad generate my-board.kicad_sch --output bsp/ --name my-board"},{cmd:"ebuild cad diff <old> <new>",flags:"",desc:"Compare two schematic versions and show what changed: new pins, removed peripherals, power rail changes.",example:"ebuild cad diff v1.kicad_sch v2.kicad_sch"}]},{group:"Analysis & Quality",color:"#F472B6",cmds:[{cmd:"ebuild analyze",flags:"--stack  --misra  --memory  --all",desc:"Run the full static analysis suite. Reports stack depth per task, MISRA C:2012 violations, memory overlap, and uninitialized variable usage.",example:"ebuild analyze --all"},{cmd:"ebuild size",flags:"--sections  --symbols  --json",desc:"Detailed firmware size report: .text, .data, .bss per file and per symbol. --json outputs machine-readable data for CI dashboards.",example:"ebuild size --symbols"},{cmd:"ebuild test",flags:"--coverage  --filter <pattern>",desc:"Run the EoS unit test suite on the host machine (no hardware needed). --coverage generates an HTML coverage report.",example:"ebuild test --coverage"}]}],h=[{phase:"Design",color:"#F97316",steps:[{title:"Design your schematic in KiCad",desc:"Place your MCU, sensors, power regulators, and connectors. Assign net names that match EoS HAL conventions (UART_TX, SPI_CLK, etc.)."},{title:"Run CAD analysis",desc:"ebuild cad analyze my-board.kicad_sch — ebuild identifies the MCU, maps all peripheral pins, and checks EoS compatibility.",code:`ebuild cad analyze my-board.kicad_sch
# [CAD] MCU: STM32H743ZIT6
# [CAD] 14 peripherals mapped
# [CAD] EoS compatibility: FULL`},{title:"Generate the BSP",desc:"ebuild cad generate produces pins.h, clocks.c, peripherals.c, and linker.ld — all derived from your schematic.",code:"ebuild cad generate my-board.kicad_sch --output bsp/ --name my-board"}]},{phase:"Develop",color:"#A78BFA",steps:[{title:"Create the project",desc:"ebuild init creates a complete project pre-configured for your BSP. All pin names match your schematic labels.",code:`ebuild init my-firmware --template rtos --bsp bsp/my-board
cd my-firmware`},{title:"Write firmware (or use eFlow)",desc:"Write C code using the EoS HAL, or use ebuild eflow open to design visually. eFlow auto-populates pin names from your BSP.",code:`// All pin names come from bsp/my-board/pins.h
eos_uart_init(UART_DEBUG, 115200);
eos_i2c_init(I2C_SENSORS, 400000);`},{title:"Build",desc:"ebuild build compiles your code. The bundled ARM GCC toolchain means no separate toolchain install.",code:`ebuild build --jobs 8 --size
# .text: 44,128 bytes / 2,097,152 (2.1%)
# .data:  1,024 bytes / 1,048,576 (0.1%)
# Build complete in 3.2s`}]},{phase:"Simulate",color:"#22D3EE",steps:[{title:"Simulate with your BSP",desc:"ebuild sim --bsp bsp/my-board launches EoSim with virtual peripherals that match your real schematic.",code:`ebuild sim --bsp bsp/my-board --gui
# [EoSim] BME280 (I2C1 0x76): temp=23.4°C
# [EoSim] W25Q128 (SPI2): 16MB NOR flash`},{title:"Inject virtual sensor data",desc:"Simulate different environmental conditions without physical hardware.",code:`# In another terminal while simulation runs:
eosim inject --peripheral bme280 --temp 85.0
# [app] ALERT: Temperature critical: 85.0°C`},{title:"Debug with GDB",desc:"ebuild sim --gdb exposes a GDB stub. Connect any GDB client to set breakpoints and inspect memory.",code:`ebuild sim --gdb
# GDB server on :3333

# In another terminal:
arm-none-eabi-gdb build/firmware.elf
(gdb) target remote :3333
(gdb) break sensor_task`}]},{phase:"Validate",color:"#34D399",steps:[{title:"Run static analysis",desc:"ebuild analyze checks stack depth, MISRA compliance, memory overlap, and uninitialized variables.",code:`ebuild analyze --all
# Stack: all tasks within limits OK
# MISRA: 0 required violations OK
# Memory: no overlaps OK
# Overall: PASS`},{title:"Run unit tests",desc:"ebuild test runs the EoS test suite on your host machine — no hardware needed for unit tests.",code:`ebuild test --coverage
# Running 47 tests...
# 47 passed, 0 failed
# Coverage: 87.3% (report: build/coverage/index.html)`},{title:"Check firmware size",desc:"ebuild size --symbols shows per-symbol memory usage. Identify which functions are consuming the most flash.",code:`ebuild size --symbols | head -10
# led_task:       1,024 bytes (.text)
# sensor_task:    2,048 bytes (.text)
# bme280_driver:  4,096 bytes (.text)`}]},{phase:"Deploy",color:"#F59E0B",steps:[{title:"Flash to hardware",desc:"When your PCB arrives, flash the same firmware you already tested in simulation. ebuild auto-detects the programmer.",code:`ebuild flash --interface jlink --verify
# [ebuild] J-Link v10.1 detected
# [ebuild] Writing 180,224 bytes... OK
# [ebuild] Verify: OK`},{title:"Monitor live output",desc:"ebuild monitor connects to the UART console. Use --filter to show only relevant log lines.",code:`ebuild monitor --baud 115200 --filter '\\[app\\]'
# [app] EmbeddedOS v2.5.0 starting...
# [app] BME280 init OK
# [app] Temp: 22.8°C`},{title:"OTA updates",desc:"Once deployed, push firmware updates over Wi-Fi using eBoot's OTA pipeline. No physical access needed.",code:`ebuild ota push --url 192.168.1.42 --key keys/ota.pem
# [OTA] Connecting to device...
# [OTA] Uploading firmware (180KB)...
# [OTA] Device verifying signature...
# [OTA] Update applied. Device rebooting.`}]}],n=`[project]
name = "my-sensor-node"
version = "1.0.0"
eos_version = "2.5.0"

[target]
board = "stm32h743"
cpu = "cortex-m7"
fpu = "fpv5-d16"
clock_hz = 480_000_000

[memory]
flash_size = "2MB"
ram_size   = "1MB"
flash_origin = "0x08000000"
ram_origin   = "0x20000000"

[features]
rtos     = true
wifi     = false
bluetooth = false
eai      = false
eboot    = true

[dependencies]
bme280 = "1.2.0"
w25q   = "0.9.1"

[build]
optimization = "Os"   # Os = size, O2 = speed, Og = debug
lto = true
stack_size = 4096

[analysis]
misra = "advisory"    # required | advisory | off
stack_check = true
coverage = false`,S=[{label:"KiCad Schematic",sub:".kicad_sch",color:"#F97316"},{label:"ebuild cad analyze",sub:"MCU + pin map",color:"#F59E0B"},{label:"ebuild cad generate",sub:"BSP files",color:"#A78BFA"},{label:"ebuild init",sub:"project scaffold",color:"#22D3EE"},{label:"ebuild build",sub:"firmware.elf",color:"#34D399"},{label:"ebuild sim",sub:"virtual board",color:"#60A5FA"},{label:"ebuild analyze",sub:"static analysis",color:"#F472B6"},{label:"ebuild flash",sub:"real hardware",color:"#F97316"}];function O(){const[r,f]=d.useState(0),[o,g]=d.useState(0),[c,m]=d.useState(null),t=async a=>{await y(a)&&(m(a),setTimeout(()=>m(null),2e3))},u=h[o],p=b[r];return e.jsxs(x,{className:"ebuild",children:[e.jsx(v,{label:"ebuild — Developer Workflow",title:e.jsxs(e.Fragment,{children:["One Tool for the",e.jsx("br",{}),"Entire EoS Lifecycle"]}),lead:"ebuild is the EmbeddedOS build tool. It handles everything from project creation to CAD analysis, simulation, static analysis, flashing, and OTA updates — with a single CLI and zero configuration files to maintain manually.",children:e.jsxs("div",{className:"ctas",children:[e.jsx(i,{href:"/getting-started",className:"btn pri",children:"Get Started"}),e.jsxs(i,{href:"/eflow",className:"btn gh",children:["eFlow Visual Editor"," ",e.jsx("span",{className:"ar","aria-hidden":"true",children:"→"})]})]})}),e.jsx(j,{name:"ebuild",items:[{id:"install",label:"Install"},{id:"workflow",label:"Developer Workflow"},{id:"commands",label:"Command Reference"},{id:"toml",label:"ebuild.toml"},{id:"cad",label:"CAD → Firmware"}]}),e.jsxs(l,{id:"install",tight:!0,children:[e.jsxs("div",{className:"code eb-term",children:[e.jsxs("div",{className:"cbar",children:[e.jsx("b",{children:"Terminal"}),e.jsx("button",{type:"button",onClick:()=>t("pip install embeddedos-ebuild"),className:"eb-copy",children:"Copy"})]}),e.jsxs("pre",{children:[e.jsx("span",{className:"pr",children:"$ "}),"pip install embeddedos-ebuild",`
`,e.jsx("span",{className:"pr",children:"$ "}),"ebuild --version",`
`,e.jsx("span",{className:"ok",children:"ebuild v2.1.0 (EmbeddedOS Build Tool)"}),`
`,e.jsx("span",{className:"pr",children:"$ "}),"ebuild platforms list | wc -l",`
`,e.jsx("span",{className:"ok",children:"63"})]})]}),e.jsx(w,{small:!0,items:[{value:`${C} platforms`,label:"supported targets"},{value:"Zero config",label:"toolchain bundled"},{value:"One command",label:"build → flash → monitor"}]})]}),e.jsxs(l,{id:"workflow",title:"The Complete Developer Workflow",lead:"From KiCad schematic to OTA-updated production firmware — every step handled by ebuild.",split:!0,alt:!0,children:[e.jsx("div",{className:"ctas eb-tabs",children:h.map((a,s)=>e.jsx("button",{type:"button",onClick:()=>g(s),"aria-pressed":o===s,className:"btn gh",style:{"--c":a.color},children:a.phase},a.phase))}),e.jsx("ol",{className:"steps num eb-steps",style:{"--c":u.color},children:u.steps.map((a,s)=>e.jsxs("li",{children:[e.jsx("span",{className:"n",children:s+1}),e.jsxs("div",{children:[e.jsx("h3",{children:a.title}),e.jsx("p",{children:a.desc}),a.code&&e.jsxs("div",{className:"code",children:[e.jsxs("div",{className:"cbar",children:[e.jsx("span",{}),e.jsx("button",{type:"button",onClick:()=>t(a.code),className:"eb-copy",children:c===a.code?"Copied!":"Copy"})]}),e.jsx("pre",{tabIndex:0,role:"region","aria-label":`${a.title}: commands`,children:e.jsx("code",{children:a.code})})]})]})]},a.title))},o)]}),e.jsxs(l,{id:"commands",title:"Command Reference",lead:"Every ebuild command with flags, descriptions, and examples.",split:!0,children:[e.jsx("div",{className:"ctas eb-tabs",children:b.map((a,s)=>e.jsx("button",{type:"button",onClick:()=>f(s),"aria-pressed":r===s,className:"btn gh",style:{"--c":a.color},children:a.group},a.group))}),e.jsx("ul",{className:"eb-cmds",style:{"--c":p.color},children:p.cmds.map(a=>e.jsxs("li",{className:"card",children:[e.jsxs("div",{className:"top",children:[e.jsxs("div",{className:"eb-sig",children:[e.jsx("code",{children:a.cmd}),a.flags&&e.jsx("div",{className:"eb-flags",children:a.flags})]}),e.jsx("button",{type:"button",onClick:()=>t(a.example),className:"eb-copy",children:"Copy example"})]}),e.jsx("p",{children:a.desc}),e.jsxs("pre",{className:"eb-ex",children:[e.jsx("span",{className:"pr",children:"$ "}),a.example]})]},a.cmd))},r)]}),e.jsx(l,{id:"toml",title:"ebuild.toml Reference",lead:"The project configuration file. Every field is optional — ebuild uses sensible defaults for everything not specified.",split:!0,alt:!0,children:e.jsxs("div",{className:"code",children:[e.jsxs("div",{className:"cbar",children:[e.jsx("b",{children:"ebuild.toml"}),e.jsx("button",{type:"button",onClick:()=>t(n),className:"eb-copy",children:c===n?"Copied!":"Copy all"})]}),e.jsx("pre",{tabIndex:0,role:"region","aria-label":"ebuild.toml example",children:n})]})}),e.jsxs(l,{id:"cad",title:"CAD → Firmware Pipeline",lead:"The complete flow from KiCad schematic to simulated, validated, and deployed firmware — without touching a soldering iron until the very end.",split:!0,children:[e.jsx("ol",{className:"eb-flow",children:S.map(a=>e.jsxs("li",{style:{"--c":a.color},children:[e.jsx("b",{children:a.label}),e.jsx("span",{children:a.sub})]},a.label))}),e.jsxs("div",{className:"gnote eb-note",children:[e.jsx("strong",{children:"Key insight:"}),' Because you simulate with the same BSP that was generated from your schematic, the firmware that passes simulation will work on real hardware on the first flash — no "it works in sim but not on hardware" surprises. The virtual BME280 on I²C1 address 0x76 behaves identically to the real chip.']})]}),e.jsxs(k,{title:"Start Building",lead:"Install ebuild and create your first EoS project in under 5 minutes.",children:[e.jsx(i,{href:"/getting-started",className:"btn pri",children:"Getting Started Guide"}),e.jsxs(i,{href:"/eflow",className:"btn gh",children:["Try eFlow Visual Editor"," ",e.jsx("span",{className:"ar","aria-hidden":"true",children:"→"})]}),e.jsx(i,{href:"/product-ebuild",className:"btn gh",children:"eBuild engineering detail"})]})]})}export{O as default};
