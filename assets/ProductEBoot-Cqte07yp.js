import{j as e}from"./vendor-motion-mgp-wB1q.js";import{P as t}from"./ProductDetailPage-CLT2uD1B.js";import"./vendor-react-DdUyh3Gc.js";import"./index-Bs2DruTa.js";import"./code-xml-BklL03CJ.js";function s(){return e.jsx(t,{badge:"Bootloader",title:"eBootloader — Multi-Architecture Bootloader",subtitle:"10 Architectures · 24 Reference Boards · A/B Update Slots",description:"A portable, secure, fail-safe bootloader for 24 boards across 10 architectures. Supports A/B update slots, measured boot, TPM 2.0, and a unified board-support package model.",accent:"#F97316",gradient:"from-orange-500/20 to-red-600/20",lang:"C",github:"embeddedos-org/eboot",heroImage:"/media/product-eboot_90e7936e.jpg",stackHighlight:"ebootloader",stats:[{value:"10",label:"Architectures"},{value:"24",label:"Reference Boards"},{value:"A/B",label:"Update Slots"},{value:"< 500 ms",label:"Cold Boot (Cortex-M)"}],workflow:[{step:1,title:"ROM Bootstrap",desc:"The chip's immutable ROM code runs first. It reads the eBoot primary image from flash, verifies its Ed25519 signature against the public key burned into OTP, and jumps to eBoot if the signature is valid.",code:`# ROM verifies eBoot signature against OTP public key
# If valid: jump to eBoot primary slot
# If invalid: enter recovery mode (USB/UART DFU)`},{step:2,title:"eBoot Initializes Hardware",desc:"eBoot initializes the minimum hardware needed for boot: clocks, DRAM controller, watchdog, and the storage interface (eMMC/QSPI/SD). It then reads the firmware slot manifest to decide which slot (A or B) to boot.",code:`// eBoot hardware init sequence
eBoot_clocks_init();    // PLL, dividers
eBoot_dram_init();      // DDR4/LPDDR4 training
eBoot_storage_init();   // eMMC / QSPI
eBoot_wdt_arm(30000);   // 30 s watchdog`},{step:3,title:"Verify Firmware Slot",desc:"eBoot reads the active firmware slot (A or B), verifies its ECDSA-256 signature, checks the anti-rollback counter in OTP, and optionally decrypts the payload with AES-256-GCM if the image is encrypted.",code:`// Slot verification
if (eBoot_slot_verify(SLOT_A) == EBOOT_OK) {
    eBoot_slot_boot(SLOT_A);
} else if (eBoot_slot_verify(SLOT_B) == EBOOT_OK) {
    eBoot_slot_boot(SLOT_B);
} else {
    eBoot_recovery_enter();  // Both slots invalid
}`},{step:4,title:"Hand Off to EoS Kernel",desc:"eBoot passes a boot descriptor (memory map, device tree, boot reason) to the EoS kernel entry point and jumps to it. The watchdog is armed — if EoS doesn't check in within 30 s, eBoot rolls back to the other slot.",code:`// Hand-off structure
eBoot_descriptor_t desc = {
    .dtb_addr   = 0x80000000,
    .boot_reason = EBOOT_REASON_NORMAL,
    .slot        = SLOT_A,
};
eBoot_jump_to_kernel(&desc);`},{step:5,title:"OTA Update Flow",desc:"When a new firmware image arrives (over HTTPS, MQTT, or USB), the application writes it to the inactive slot and marks it as pending. On next reboot, eBoot verifies and activates the new slot. If the new firmware fails to mark itself healthy, eBoot rolls back automatically.",code:`// Application triggers OTA
ota_download_to_slot(SLOT_B, url, &progress_cb);
eBoot_slot_mark_pending(SLOT_B);
eos_reboot();  // eBoot will verify + activate SLOT_B`}],usageExamples:[{title:"Secure OTA Update",scenario:"A fleet of 10,000 industrial sensors receives a firmware update over MQTT with automatic rollback on failure.",code:`// Application-side OTA trigger
#include <eboot/ota.h>

void ota_task(void *arg) {
    // Download signed firmware to inactive slot
    eboot_ota_result_t r = eboot_ota_download(
        SLOT_B,
        "https://updates.embeddedos.org/fw/v1.2.0.eos",
        &verify_cb
    );

    if (r == EBOOT_OTA_OK) {
        eboot_slot_mark_pending(SLOT_B);
        eos_reboot();  // eBoot activates SLOT_B on next boot
    }
}

// In EoS application — mark firmware healthy
void app_startup_check(void) {
    if (eboot_slot_is_pending()) {
        run_self_test();
        eboot_slot_mark_healthy();  // Prevent rollback
    }
}`},{title:"Measured Boot with TPM",scenario:"A medical device records boot measurements in TPM PCR registers to prove firmware integrity to a remote attestation server.",code:`// eBoot TPM measurement flow
#include <eboot/tpm.h>

// eBoot extends PCR[0] with eBoot hash
// eBoot extends PCR[1] with firmware slot hash
// eBoot extends PCR[2] with device tree hash

// Application reads TPM quote for remote attestation
void attest_device(void) {
    tpm_quote_t quote;
    tpm_get_quote(pcr_mask, nonce, &quote);
    // Send quote to attestation server
    send_attestation(server, &quote);
}`}],ecosystemRole:{importance:"critical",role:"Secure Boot Foundation",summary:"eBootloader is the first piece of EmbeddedOS software that runs on every device. It establishes the chain of trust that every other component depends on. Without a verified boot chain, an attacker could replace the EoS kernel or any application with malicious code. eBoot's A/B update slots make zero-downtime OTA updates possible across the entire EoS fleet — from 256 KB microcontrollers to 64-core edge servers. Every EoS device ships with eBoot; it is non-optional.",dependsOn:["ROM bootloader — chip-level immutable code that verifies eBoot itself","OTP / eFuse — stores the root public key and anti-rollback counter","eBuild — signs firmware images with the Ed25519 key that eBoot verifies"],enabledBy:["EoS Kernel — eBoot hands off to EoS after signature verification","eDB — encryption keys are rooted in the eBoot chain of trust","OTA update system — A/B slots enable zero-downtime firmware updates","Remote attestation — TPM measurements prove firmware integrity"]},features:[{name:"10 Architectures",desc:"ARMv7-M, ARMv8-A, RISC-V (RV32, RV64), x86_64, AArch64, MIPS, PowerPC, Xtensa, AVR."},{name:"24 Reference Boards",desc:"STM32, NXP i.MX, Raspberry Pi, BeagleBone, ESP32, RISC-V SiFive, NVIDIA Jetson, and more."},{name:"A/B Update Slots",desc:"Two firmware slots with automatic fallback if a new image fails to mark itself healthy."},{name:"Signed Images",desc:"Ed25519 / ECDSA signature verification rooted in immutable boot ROM."},{name:"Encrypted Updates",desc:"Optional AES-GCM payload encryption for over-the-air delivery."},{name:"Recovery Mode",desc:"Standalone recovery slot with USB / UART / TFTP firmware upload."},{name:"Fast Boot",desc:"Sub-second cold boot on Cortex-M, sub-3-second on Cortex-A SoCs."},{name:"Watchdog Hand-Off",desc:"Hard watchdog armed before kernel runs; rolls back if kernel doesn't check in."}],specs:[{key:"Signature Algorithm",value:"ECDSA-256 (NIST P-256 curve)"},{key:"Hash Algorithm",value:"SHA-256"},{key:"Encryption",value:"AES-256-GCM for encrypted firmware images"},{key:"Anti-Rollback",value:"Monotonic counter in OTP / eFuse; configurable policy"},{key:"Update Protocol",value:"OTA-ready; dual-bank A/B update with atomic swap"},{key:"Debug Security",value:"JTAG/SWD lock-out in production mode; debug unlock via signed token"},{key:"Boot Time (Cortex-M)",value:"< 500 ms cold boot to kernel handoff"},{key:"Boot Time (Cortex-A)",value:"< 3 s cold boot to kernel handoff"},{key:"Supported Architectures",value:"ARMv7-M, ARMv8-A/R, RISC-V RV32/RV64, x86_64, AArch64, MIPS, PowerPC, Xtensa, AVR"},{key:"License",value:"MIT"}],pairs:[{name:"EoS",route:"/product-eos",desc:"The foundation: a deterministic real-time embedded OS for everything from the bootloader up."},{name:"eBuild",route:"/product-ebuild",desc:"Build system & SDK generator with signing and packaging built-in."},{name:"eDB",route:"/product-edb",desc:"Keys rooted in the eBoot chain-of-trust for AES-256 at-rest encryption."}]})}export{s as default};
