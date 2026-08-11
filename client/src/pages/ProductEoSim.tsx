import ProductDetailPage from "@/components/ProductDetailPage";
import { SIM_PLATFORM_COUNT } from "@/data/stack";

export default function ProductEoSim() {
  return (
    <ProductDetailPage
      badge="Simulator"
      title="EoSim — Virtual Platform Simulator"
      subtitle={`${SIM_PLATFORM_COUNT} Platforms · GPIO Visualizer · HIL Bridge · GDB Support`}
      description={`A full-system virtual platform simulator for EoS firmware. Run unmodified EoS binaries on ${SIM_PLATFORM_COUNT} simulated platforms — with a graphical GPIO pin visualizer, UART terminal, hardware-in-the-loop (HIL) bridge, and GDB debugging support.`}
      accent="#06B6D4"
      gradient="from-cyan-500/20 to-sky-600/20"
      lang="C++ / Python"
      github="embeddedos-org/eosim"
      heroImage="/manus-storage/product-eosim-sim_78145da3.jpg"
      stackHighlight="build / ide / sim"
      stats={[
        { value: `${SIM_PLATFORM_COUNT}`, label: "Simulated Platforms" },
        { value: "100%", label: "Binary Compatible" },
        { value: "< 5 ms", label: "Boot-to-Prompt" },
        { value: "HIL", label: "Hardware-in-the-Loop" },
      ]}
      workflow={[
        {
          step: 1,
          title: "List Available Platforms",
          desc: `EoSim ships with ${SIM_PLATFORM_COUNT} pre-configured virtual platforms covering all major EoS reference boards. Use eosim list to browse them by architecture, MCU family, or peripheral set.`,
          code: "# List all platforms\neosim list\n\n# Filter by architecture\neosim list --filter cortex-m4\n\n# Search by board name\neosim search stm32f4",
        },
        {
          step: 2,
          title: "Run Your Firmware",
          desc: "Point EoSim at your compiled .elf or .eos binary. It loads the firmware, maps peripherals to the simulated board, and starts executing — no hardware required.",
          code: "# Run firmware on STM32F4 Discovery\neosim run build/firmware.elf --platform stm32f4-discovery\n\n# Run with graphical GPIO visualizer\neosim run build/firmware.elf --platform stm32f4-discovery --gui\n\n# Run with UART output to terminal\neosim run build/firmware.elf --platform stm32f4-discovery --uart0",
        },
        {
          step: 3,
          title: "Debug with GDB",
          desc: "EoSim exposes a GDB stub on port 3333. Connect any GDB client to set breakpoints, inspect registers, and step through your firmware — exactly as you would on real hardware.",
          code: "# Start EoSim with GDB server\neosim run firmware.elf --platform stm32f4 --gdb\n# GDB server listening on :3333\n\n# In another terminal:\narm-none-eabi-gdb firmware.elf\n(gdb) target remote :3333\n(gdb) break sensor_task\n(gdb) continue\n(gdb) print temp_reading",
        },
        {
          step: 4,
          title: "Use the GPIO Visualizer",
          desc: "The --gui flag opens a graphical pin state visualizer showing all GPIO pins, their current state (high/low/PWM), and a logic analyzer trace. Perfect for debugging SPI, I²C, and UART protocols.",
          code: "# Open GUI with logic analyzer\neosim run firmware.elf --platform stm32f4 --gui --trace spi1,uart2\n\n# Export trace to VCD for GTKWave\neosim run firmware.elf --platform stm32f4 --trace-out trace.vcd",
        },
        {
          step: 5,
          title: "Hardware-in-the-Loop (HIL) Bridge",
          desc: "The HIL bridge connects EoSim's virtual peripherals to real hardware. Simulate the firmware logic while driving real sensors, actuators, or communication buses — the best of both worlds.",
          code: "# HIL bridge: virtual firmware + real I2C sensor\neosim run firmware.elf --platform stm32f4 \\\n    --hil i2c1:/dev/i2c-1 \\\n    --hil uart2:/dev/ttyUSB0",
        },
      ]}
      usageExamples={[
        {
          title: "Automated Firmware Testing",
          scenario:
            "A CI pipeline runs 500 firmware test cases in EoSim in under 2 minutes — no hardware needed.",
          code: "# Run all tests in EoSim (headless)\neosim test tests/ --platform stm32f4-discovery --timeout 120\n\n# Output:\n# Running 500 test cases on stm32f4-discovery...\n# [PASS] test_uart_loopback          (12 ms)\n# [PASS] test_spi_sensor_read        (8 ms)\n# [PASS] test_eai_kws_inference      (45 ms)\n# [PASS] test_edb_insert_query       (23 ms)\n# ...\n# 500/500 passed in 98 s",
        },
        {
          title: "Multi-Board System Simulation",
          scenario:
            "Simulate a 3-board robot (sensor + AI + actuator) communicating via virtual EIPC/UART.",
          code: "# Launch 3-board simulation\neosim multi \\\n    --board sensor:stm32f4:boards/sensor/firmware.elf \\\n    --board ai:rpi4:boards/ai/firmware.elf \\\n    --board actuator:stm32h7:boards/actuator/firmware.elf \\\n    --connect sensor.uart2:ai.uart1 \\\n    --connect ai.uart2:actuator.uart1 \\\n    --gui",
        },
      ]}
      ecosystemRole={{
        importance: "high",
        role: "Development Acceleration Layer",
        summary:
          "EoSim dramatically accelerates EoS development by eliminating the hardware dependency during the development and testing cycle. Developers can write, test, and debug firmware on their laptop before a single physical board is available. CI pipelines can run hundreds of firmware test cases in minutes. The HIL bridge means that when real hardware is needed, EoSim can still handle the firmware logic while real sensors and actuators are connected. EoSim is what makes EoS development scalable — a team of 10 developers doesn't need 10 physical boards of every type.",
        dependsOn: [
          "EoS Kernel — simulates the full EoS kernel including scheduler, HAL, and IPC",
          "eBuild — compiles the firmware binary that EoSim loads and executes",
          "EoStudio — the IDE's Simulate button launches EoSim",
        ],
        enabledBy: [
          "All EoS developers — test firmware without hardware",
          "CI/CD pipelines — automated firmware testing at scale",
          "Hardware-in-the-loop testing — virtual firmware + real peripherals",
          "Education — students learn EoS without needing physical boards",
        ],
      }}
      features={[
        {
          name: `${SIM_PLATFORM_COUNT} Virtual Platforms`,
          desc: "Pre-configured simulations of STM32, NXP i.MX, Raspberry Pi, ESP32, RISC-V SiFive, NVIDIA Jetson, and more.",
        },
        {
          name: "Binary Compatible",
          desc: "Run unmodified .elf or .eos binaries — no recompilation or simulation-specific code.",
        },
        {
          name: "GPIO Visualizer",
          desc: "Graphical pin state display with logic analyzer trace for SPI, I²C, UART, and PWM.",
        },
        {
          name: "GDB Stub",
          desc: "Built-in GDB server on port 3333. Set breakpoints, inspect memory, and step through code.",
        },
        {
          name: "HIL Bridge",
          desc: "Connect virtual peripherals to real hardware via /dev/i2c-*, /dev/ttyUSB*, etc.",
        },
        {
          name: "Headless Mode",
          desc: "Run without GUI for CI pipelines. JSON test result output for automation.",
        },
        {
          name: "Multi-Board Simulation",
          desc: "Simulate multiple boards communicating via virtual UART, SPI, or TCP/EIPC.",
        },
        {
          name: "Trace Export",
          desc: "Export GPIO traces to VCD format for GTKWave analysis.",
        },
      ]}
      specs={[
        {
          key: "Simulated Platforms",
          value: `${SIM_PLATFORM_COUNT} (STM32, NXP i.MX, Raspberry Pi, ESP32, RISC-V, NVIDIA Jetson, …)`,
        },
        {
          key: "Simulation Engine",
          value: "QEMU-based with EoS-specific peripheral models",
        },
        {
          key: "GDB Protocol",
          value:
            "GDB Remote Serial Protocol on configurable port (default: 3333)",
        },
        {
          key: "Trace Format",
          value: "VCD (Value Change Dump) for GTKWave; JSON for automation",
        },
        {
          key: "HIL Transports",
          value: "I²C (/dev/i2c-*), UART (/dev/ttyUSB*), SPI (/dev/spidev*)",
        },
        { key: "Boot-to-Prompt", value: "< 5 ms for Cortex-M targets" },
        { key: "License", value: "MIT" },
      ]}
      pairs={[
        {
          name: "eBuild",
          route: "/product-ebuild",
          desc: "eBuild compiles the firmware and launches EoSim with ebuild sim.",
        },
        {
          name: "EoStudio",
          route: "/product-eostudio",
          desc: "EoStudio's Simulate button launches EoSim with the current project.",
        },
        {
          name: "EoS Kernel",
          route: "/product-eos",
          desc: "EoSim simulates the full EoS kernel including scheduler, HAL, and IPC primitives.",
        },
      ]}
    />
  );
}
