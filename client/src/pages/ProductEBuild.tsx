import ProductDetailPage from "@/components/ProductDetailPage";

export default function ProductEBuild() {
  return (
    <ProductDetailPage
      badge="Build System"
      title="eBuild — Build System & SDK Generator"
      subtitle="18-Command CLI · 14 SDK Targets · Reproducible Builds"
      description="The EoS build system and SDK generator. An 18-command CLI that compiles, signs, packages, and flashes firmware for all 41 BSP profiles. Generates per-component SDKs, runs reproducible builds, and integrates the full EoSim simulation pipeline."
      accent="#EF4444"
      gradient="from-red-500/20 to-rose-600/20"
      lang="Go"
      github="embeddedos-org/ebuild"
      heroImage="/manus-storage/product-eos-kernel_0ca24d8d.jpg"
      stackHighlight="build"
      stats={[
        { value: "18", label: "CLI Commands" },
        { value: "14", label: "SDK Targets" },
        { value: "41", label: "BSP Profiles" },
        { value: "100%", label: "Reproducible Builds" },
      ]}
      workflow={[
        {
          step: 1,
          title: "Initialize a Project",
          desc: "Run ebuild init to scaffold a new EoS project. Choose a BSP profile (board + architecture + peripheral set) and eBuild generates the CMakeLists.txt, linker script, and manifest.yml.",
          code: "# Create a new EoS project for STM32F4 Discovery\nebuild init my_sensor_node --profile stm32f4-discovery\ncd my_sensor_node\n# Generated: CMakeLists.txt, manifest.yml, src/main.c",
        },
        {
          step: 2,
          title: "Edit manifest.yml",
          desc: "The manifest.yml is the single source of truth for your firmware. It specifies the board, kernel profile (minimal/standard/full), enabled services (eAI, eDB, EIPC), and pinned component versions.",
          code: "# manifest.yml\nboard: stm32f4-discovery\nprofile: standard\nservices:\n  - eai: 0.1.0\n  - edb: 0.1.0\n  - eipc: 0.1.0\nfeatures:\n  - uart_console\n  - ota_update",
        },
        {
          step: 3,
          title: "Build the Firmware",
          desc: "ebuild build reads the manifest, resolves all dependencies, invokes CMake + Ninja, and produces a signed .eos firmware image. The same manifest always produces the same binary (reproducible build).",
          code: "# Build for the target\nebuild build\n# Output: build/firmware.eos (signed), build/firmware.hex, build/firmware.elf\n\n# Build with verbose output\nebuild build --verbose\n\n# Build for a different profile\nebuild build --profile stm32f4-minimal",
        },
        {
          step: 4,
          title: "Simulate Before Flashing",
          desc: "Run the firmware in EoSim before touching real hardware. ebuild sim launches EoSim with the compiled binary, opens the GPIO visualizer, and optionally starts a GDB server for debugging.",
          code: "# Run in EoSim with GUI\nebuild sim --gui\n\n# Run with GDB server on port 3333\nebuild sim --gdb\n\n# In another terminal:\narm-none-eabi-gdb build/firmware.elf\n(gdb) target remote :3333\n(gdb) break sensor_task",
        },
        {
          step: 5,
          title: "Flash and Monitor",
          desc: "ebuild flash programs the firmware to the target board via OpenOCD, J-Link, or ST-Link. ebuild monitor opens a serial console to the device.",
          code: "# Flash via OpenOCD (auto-detects probe)\nebuild flash\n\n# Flash via J-Link\nebuild flash --probe jlink\n\n# Open serial monitor at 115200 baud\nebuild monitor --baud 115200",
        },
      ]}
      usageExamples={[
        {
          title: "CI/CD Pipeline",
          scenario:
            "A GitHub Actions workflow that builds, tests, and signs firmware for every pull request.",
          code: "# .github/workflows/firmware.yml\nname: Firmware CI\non: [push, pull_request]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - name: Install eBuild\n        run: pip install embeddedos-ebuild\n      - name: Build firmware\n        run: ebuild build --profile stm32f4-discovery\n      - name: Run tests in EoSim\n        run: ebuild test --sim --timeout 60\n      - name: Upload signed firmware\n        uses: actions/upload-artifact@v4\n        with:\n          name: firmware\n          path: build/firmware.eos",
        },
        {
          title: "Multi-Board Workspace",
          scenario:
            "A monorepo with three boards (sensor, AI, actuator) built and signed in one command.",
          code: "# workspace.yml\nworkspace:\n  - name: sensor_node\n    path: boards/sensor\n    profile: stm32f4-discovery\n  - name: ai_board\n    path: boards/ai\n    profile: rpi4-cortex-a72\n  - name: actuator_board\n    path: boards/actuator\n    profile: stm32h7-nucleo\n\n# Build all boards\nebuild workspace build\n\n# Flash all boards in sequence\nebuild workspace flash --order sensor,ai,actuator",
        },
      ]}
      ecosystemRole={{
        importance: "critical",
        role: "Build and Toolchain Foundation",
        summary:
          "eBuild is the developer-facing entry point to the entire EoS ecosystem. Every firmware image that runs on an EoS device was built by eBuild. It is the tool that ties together the EoS kernel, eBoot signing, eAI model packaging, eDB schema migrations, and EoSim simulation into a single, reproducible workflow. Without eBuild, developers would need to manually coordinate CMake, signing tools, BSP configuration, and simulation — a fragile and error-prone process. eBuild makes the entire EoS stack accessible to a developer with a single CLI.",
        dependsOn: [
          "EoS Kernel — compiles and links EoS kernel source for the target BSP",
          "eBoot — signs the firmware image with the Ed25519 key that eBoot verifies",
          "EoSim — launches the simulator for pre-flash testing",
          "CMake + Ninja — underlying build system invoked by eBuild",
        ],
        enabledBy: [
          "All EoS developers — every firmware project uses eBuild",
          "CI/CD pipelines — reproducible builds enable automated testing and deployment",
          "EoStudio — the IDE's Build button invokes eBuild under the hood",
          "OTA update system — eBuild produces the signed .eos images that eBoot verifies",
        ],
      }}
      features={[
        {
          name: "14 SDK Targets",
          desc: "Auto-generates a build SDK for every component (EoS, EAI, ENI, EIPC, eBoot, eApps, …).",
        },
        {
          name: "Profile Composition",
          desc: "Combine board + product profile + feature flags; resolves the full dependency graph.",
        },
        {
          name: "Reproducible Builds",
          desc: "Pinned source revs, isolated toolchains, hash-stable outputs.",
        },
        {
          name: "Signing & Packaging",
          desc: "Built-in Ed25519 signing, .eos / .img / .hex / .uf2 packaging.",
        },
        {
          name: "Bench & Fuzz",
          desc: "Integrated micro-benchmark and fuzzer drivers for kernel / app modules.",
        },
        {
          name: "Workspace Mode",
          desc: "Multi-repo monorepos with shared toolchain caches.",
        },
        {
          name: "Static Analysis",
          desc: "Integrated clang-tidy, cppcheck, and MISRA-C 2012 checker.",
        },
        {
          name: "Coverage Reports",
          desc: "GCOV/LCOV coverage reports with HTML output.",
        },
      ]}
      specs={[
        {
          key: "Build System",
          value: "CMake 3.25+ with Ninja generator (parallel builds)",
        },
        {
          key: "Supported Compilers",
          value:
            "GCC 13+, Clang/LLVM 17+, ARM Compiler 6, IAR EWARM, RISC-V GCC, Xtensa GCC",
        },
        {
          key: "BSP Profiles",
          value: "41 pre-configured BSP profiles across 6 categories",
        },
        {
          key: "SDK Generation",
          value:
            "Automatic SDK generation with headers, libraries, and CMake package config",
        },
        {
          key: "Static Analysis",
          value: "Integrated clang-tidy, cppcheck, and MISRA-C 2012 checker",
        },
        {
          key: "Coverage",
          value: "GCOV/LCOV coverage reports with HTML output",
        },
        { key: "License", value: "MIT" },
      ]}
      pairs={[
        {
          name: "EoS Kernel",
          route: "/product-eos",
          desc: "eBuild compiles and links the EoS kernel for every supported BSP profile.",
        },
        {
          name: "eBootloader",
          route: "/product-eboot",
          desc: "eBuild signs firmware images with the Ed25519 key that eBoot verifies at boot.",
        },
        {
          name: "EoStudio",
          route: "/product-eostudio",
          desc: "The EoStudio IDE invokes eBuild for all compile, flash, and simulate operations.",
        },
      ]}
    />
  );
}
