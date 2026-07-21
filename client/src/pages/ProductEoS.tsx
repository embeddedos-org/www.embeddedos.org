import ProductDetailPage from "@/components/ProductDetailPage";

export default function ProductEoS() {
  return (
    <ProductDetailPage
      badge="Kernel"
      title="EoS Kernel — Real-Time Embedded OS"
      subtitle="7 Architectures · 33 HAL Drivers · < 1 µs IRQ Latency"
      description="The deterministic, preemptive real-time kernel at the heart of every EoS device. Supports ARM Cortex-M/A/R, RISC-V, x86, MIPS, ARC, and Xtensa — with a unified HAL, capability-based security, and a < 4 KB minimum footprint."
      accent="#22D3EE"
      gradient="from-cyan-500/20 to-blue-600/20"
      lang="C11"
      github="embeddedos-org/EoS"
      heroImage="/manus-storage/product-eos-kernel_0ca24d8d.png"
      stackHighlight="kernel"
      stats={[
        { value: "< 1 µs", label: "IRQ Latency (Cortex-M4)" },
        { value: "33", label: "HAL Peripheral Classes" },
        { value: "41", label: "BSP Profiles" },
        { value: "< 4 KB", label: "Minimum Footprint" },
      ]}
      workflow={[
        {
          step: 1,
          title: "Select a BSP Profile",
          desc: "Pick one of 41 ready-made Board Support Package profiles that matches your hardware target. Each profile bundles the right HAL drivers, linker script, and clock configuration for that board.",
          code: "# List available profiles\nebuild profile list --arch cortex-m4\n\n# Apply a profile to your project\nebuild profile apply stm32f4-discovery",
        },
        {
          step: 2,
          title: "Initialize the Kernel",
          desc: "Call eos_init() to set up the scheduler, memory allocator, and HAL. The kernel starts in privileged mode; your application tasks run in unprivileged mode with capability-checked access to peripherals.",
          code: '#include <eos/kernel.h>\n#include <eos/hal/uart.h>\n\nint main(void) {\n    eos_init();                     // Init scheduler + HAL\n    eos_task_create(sensor_task, STACK_SIZE, PRIORITY_HIGH);\n    eos_task_create(comms_task,  STACK_SIZE, PRIORITY_NORMAL);\n    eos_start();                    // Start preemptive scheduler\n}',
        },
        {
          step: 3,
          title: "Write Tasks with HAL APIs",
          desc: "Each task runs as an independent thread. Use the 33 HAL peripheral classes (UART, SPI, I²C, GPIO, CAN, USB, ADC, DMA, …) through a unified API that works identically across all 7 supported architectures.",
          code: 'void sensor_task(void *arg) {\n    eos_hal_spi_t spi = eos_hal_spi_open(SPI1, 8_MHZ, MODE_0);\n    uint8_t buf[4];\n    for (;;) {\n        eos_hal_spi_transfer(spi, cmd, buf, 4);\n        float temp = decode_temp(buf);\n        eos_queue_send(temp_queue, &temp, EOS_WAIT_FOREVER);\n        eos_task_delay_ms(100);\n    }\n}',
        },
        {
          step: 4,
          title: "Use IPC Primitives for Safe Communication",
          desc: "Tasks communicate through message queues, semaphores, mutexes, and event flags — all with bounded worst-case timing. The EIPC module extends this to cross-board communication.",
          code: '// Producer: sensor_task sends readings\neos_queue_send(temp_queue, &temp, EOS_WAIT_FOREVER);\n\n// Consumer: comms_task receives and transmits\nvoid comms_task(void *arg) {\n    float temp;\n    for (;;) {\n        eos_queue_recv(temp_queue, &temp, EOS_WAIT_FOREVER);\n        char json[64];\n        snprintf(json, sizeof(json), "{\\"temp\\":%.2f}", temp);\n        eos_hal_uart_write(UART1, json, strlen(json));\n    }\n}',
        },
        {
          step: 5,
          title: "Flash and Monitor",
          desc: "Use eBuild to compile, sign, and flash the firmware. EoSim lets you run the same binary on a virtual board before touching real hardware.",
          code: "# Build for the target board\nebuild build --target stm32f4-discovery\n\n# Flash via OpenOCD / J-Link\nebuild flash --target stm32f4-discovery\n\n# Or simulate first\nebuild sim --platform stm32f4 --gui",
        },
      ]}
      usageExamples={[
        {
          title: "IoT Sensor Node",
          scenario: "A battery-powered temperature + humidity sensor that wakes every 60 s, reads the sensor, and transmits over LoRa.",
          code: '// EoS low-power sensor node example\n#include <eos/kernel.h>\n#include <eos/hal/i2c.h>\n#include <eos/hal/lora.h>\n#include <eos/power.h>\n\nvoid sensor_task(void *arg) {\n    eos_hal_i2c_t i2c = eos_hal_i2c_open(I2C1, 400_KHZ);\n    eos_hal_lora_t lora = eos_hal_lora_open(SPI2, &lora_cfg);\n\n    for (;;) {\n        float temp, hum;\n        sht31_read(i2c, &temp, &hum);\n\n        uint8_t payload[8];\n        encode_sensor(payload, temp, hum);\n        eos_hal_lora_send(lora, payload, sizeof(payload));\n\n        eos_power_sleep_ms(60000);  // Deep-sleep 60 s\n    }\n}',
        },
        {
          title: "Industrial Motor Controller",
          scenario: "A 3-phase BLDC motor controller running field-oriented control at 20 kHz PWM with < 1 µs jitter.",
          code: '// EoS real-time motor control (FOC at 20 kHz)\n#include <eos/kernel.h>\n#include <eos/hal/pwm.h>\n#include <eos/hal/adc.h>\n\n// High-priority ISR — runs every 50 µs\nEOS_ISR void foc_isr(void) {\n    float ia = eos_hal_adc_read_dma(ADC1, CH0);\n    float ib = eos_hal_adc_read_dma(ADC1, CH1);\n\n    float id, iq;\n    clarke_park(ia, ib, rotor_angle, &id, &iq);\n\n    float vd = pi_ctrl(&ctrl_d, id_ref - id);\n    float vq = pi_ctrl(&ctrl_q, iq_ref - iq);\n\n    float duty[3];\n    inv_park_svpwm(vd, vq, rotor_angle, duty);\n    eos_hal_pwm_set_duty3(TIM1, duty);\n}',
        },
        {
          title: "Automotive CAN Gateway",
          scenario: "A CAN-to-Ethernet gateway bridging vehicle CAN bus messages to a cloud backend over LTE.",
          code: '// EoS automotive CAN-to-Ethernet gateway\n#include <eos/kernel.h>\n#include <eos/hal/can.h>\n#include <eos/net/tcp.h>\n\nvoid can_rx_task(void *arg) {\n    eos_hal_can_t can = eos_hal_can_open(CAN1, 500_KBPS);\n    eos_hal_can_filter(can, 0x7DF, 0x7FF); // OBD-II PIDs\n\n    for (;;) {\n        eos_can_frame_t frame;\n        eos_hal_can_recv(can, &frame, EOS_WAIT_FOREVER);\n\n        char json[128];\n        can_frame_to_json(&frame, json, sizeof(json));\n        eos_tcp_send(cloud_sock, json, strlen(json));\n    }\n}',
        },
      ]}
      ecosystemRole={{
        importance: "critical",
        role: "Foundation",
        summary: "EoS Kernel is the absolute foundation of the entire EmbeddedOS ecosystem. Every other component — eBoot, eAI, eNI, EIPC, eDB, eOffice, eFlow, EoStudio, EoSim — runs on top of EoS or depends on its HAL abstractions. Without EoS, none of the higher-level services can exist. It provides the scheduler, memory model, HAL, and security primitives that the entire stack is built upon. Choosing EoS means every device in your fleet — from a 4 KB microcontroller to a 64-core server — runs the same kernel API, enabling code reuse, unified tooling, and consistent security policies across the entire product line.",
        dependsOn: [
          "eBoot (eBootloader) — loads and verifies the EoS image before handing off control",
          "eBuild — compiles, links, and signs the EoS firmware binary",
          "Hardware BSP — board-specific clock, memory map, and peripheral configuration",
        ],
        enabledBy: [
          "eAI — on-device ML inference runs as EoS tasks using the HAL NPU driver",
          "eNI — 1,024-channel neural signal acquisition runs as a high-priority EoS ISR",
          "EIPC — inter-process and inter-board communication built on EoS IPC primitives",
          "eDB — embedded database engine runs as an EoS service task",
          "eOffice — all 11 office apps are EoS application-layer processes",
          "eFlow — visual block programs compile to EoS task graphs",
          "EoSim — simulates the full EoS kernel on a virtual board",
          "eHealth365 — all health device firmware runs on EoS",
          "AeroSwift / eRadar360 — aerospace and radar systems use EoS real-time guarantees",
        ],
      }}
      features={[
        { name: "Preemptive RT Scheduler", desc: "Priority-based preemptive scheduler with time-slicing. SMP and AMP multicore modes. Deterministic context switch < 200 ns." },
        { name: "33 HAL Peripheral Classes", desc: "UART, SPI, I²C, GPIO, CAN, USB, ETH, ADC, PWM, Timer, DMA, RTC, Crypto, and 20 more — identical API across all architectures." },
        { name: "7 CPU Architectures", desc: "ARM Cortex-M/A/R, RISC-V RV32/RV64, x86, MIPS, ARC, Xtensa. Same application code runs on all." },
        { name: "Capability-Based Security", desc: "Process isolation with capability tokens. Tasks can only access peripherals they hold a capability for. Secure world handoff for TrustZone." },
        { name: "< 4 KB Footprint", desc: "Bare scheduler + HAL fits in 4 KB flash and 2 KB RAM — suitable for the smallest Cortex-M0 devices." },
        { name: "41 BSP Profiles", desc: "Ready-made board support packages for sensor nodes, gateways, infotainment, robotics, and edge servers." },
        { name: "IPC Primitives", desc: "Message queues, shared memory, semaphores, mutexes, condition variables, and event flags — all with bounded timing." },
        { name: "Power Management", desc: "Tickless idle, dynamic voltage/frequency scaling, and deep-sleep modes. Integrates with eos_power API for < 5 µA standby." },
      ]}
      specs={[
        { key: "Kernel Language", value: "C11 (ISO/IEC 9899:2011)" },
        { key: "Scheduler", value: "Preemptive priority-based RT scheduler with time-slicing; SMP and AMP multicore modes" },
        { key: "HAL Peripheral Classes", value: "33 (UART, SPI, I²C, GPIO, CAN, USB, ETH, ADC, PWM, Timer, DMA, RTC, Crypto, …)" },
        { key: "Product Profiles", value: "41 ready-made BSP profiles (sensor nodes, gateways, infotainment, robotics, edge servers)" },
        { key: "Minimum Footprint", value: "< 4 KB flash, < 2 KB RAM (bare scheduler + HAL)" },
        { key: "IRQ Latency", value: "< 1 µs on Cortex-M4 @ 168 MHz" },
        { key: "Supported Architectures", value: "ARM Cortex-M/A/R, RISC-V RV32/RV64, x86, MIPS, ARC, Xtensa" },
        { key: "IPC Primitives", value: "Message queues, shared memory, semaphores, mutexes, condition variables, event flags" },
        { key: "Security Model", value: "Capability-based access control; process isolation; secure world handoff" },
        { key: "License", value: "MIT — commercial use permitted without royalty" },
        { key: "Current Version", value: "v0.1.0 (active development)" },
        { key: "Build System", value: "eBuild (CMake + Ninja); POSIX make fallback" },
      ]}
      pairs={[
        { name: "eBootloader", route: "/product-eboot", desc: "Portable, secure, fail-safe boot for 24 boards across 10 architectures." },
        { name: "EAI", route: "/product-eai", desc: "On-device LLM inference, ReAct agents, LoRA, and federated learning — at edge power budgets." },
        { name: "EIPC", route: "/product-eipc", desc: "Capability-secured IPC fabric: predictable latency, HMAC-authenticated messages." },
      ]}
    />
  );
}
