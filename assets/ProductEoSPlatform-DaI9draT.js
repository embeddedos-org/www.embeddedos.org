import{j as e}from"./vendor-motion-mgp-wB1q.js";import{P as t}from"./ProductDetailPage-BsPyX-lT.js";import"./vendor-react-DdUyh3Gc.js";import"./index-NHxY0SPK.js";import"./code-xml-B9UkIA02.js";import"./circle-check-gm5SlFfB.js";function l(){return e.jsx(t,{badge:"Platform",title:"EoS Platform — Device Management & OTA",subtitle:"Fleet Management · OTA Updates · Telemetry · Remote Debug",description:"The cloud-side platform for managing EoS device fleets. Provides over-the-air firmware updates, device telemetry, remote debugging, configuration management, and a REST API for integration with existing DevOps pipelines.",accent:"#6366F1",gradient:"from-indigo-500/20 to-blue-600/20",lang:"Go / TypeScript",github:"embeddedos-org/eos",heroImage:"/media/product-eos-kernel_0ca24d8d.jpg",stackHighlight:"eos-platform profile",stats:[{value:"OTA",label:"Firmware Updates"},{value:"REST",label:"Management API"},{value:"A/B",label:"Safe Rollout"},{value:"TLS",label:"Secure Telemetry"}],workflow:[{step:1,title:"Register Devices",desc:"Each EoS device registers with the platform at first boot using its eBoot-derived device identity. The platform issues a device certificate that is used for all subsequent communication.",code:`// Device registration (runs at first boot)
#include <eos_platform/client.h>

void platform_register(void) {
    // Derive device identity from eBoot TPM
    uint8_t device_id[32];
    eboot_derive_key(device_id, "eos_platform_id");

    // Register with platform
    eos_platform_register(
        "https://platform.embeddedos.org",
        device_id,
        FIRMWARE_VERSION
    );
}`},{step:2,title:"Push OTA Updates",desc:"Upload a signed firmware image to the platform and target a device group for update. The platform delivers the update to devices via HTTPS, and eBoot's A/B mechanism handles the safe rollout.",code:`# Upload firmware to platform
eos-platform firmware upload build/firmware.eos \\
    --version 1.2.0 \\
    --release-notes "Bug fixes and performance improvements"

# Deploy to 10% of fleet (canary)
eos-platform deploy firmware/1.2.0 \\
    --group production \\
    --canary 10%`},{step:3,title:"Monitor Telemetry",desc:"Devices send telemetry (CPU, RAM, temperature, error logs) to the platform via TLS-secured HTTPS. The platform dashboard shows fleet health in real time.",code:`// Device-side telemetry reporting
#include <eos_platform/telemetry.h>

void telemetry_task(void *arg) {
    for (;;) {
        eos_platform_telemetry_t t = {
            .cpu_pct   = eos_cpu_usage(),
            .ram_free  = eos_mem_free(),
            .temp_c    = eos_hal_temp_read(),
            .uptime_s  = eos_uptime_s(),
        };
        eos_platform_send_telemetry(&t);
        eos_task_delay_ms(60000); // Every 60 s
    }
}`},{step:4,title:"Remote Debug",desc:"Open a secure tunnel to a device for remote GDB debugging or shell access. The tunnel is authenticated with the device certificate and authorized by the platform.",code:`# Open remote debug tunnel
eos-platform debug device/node-42 --gdb
# Tunnel open: localhost:3333 → node-42:3333

# Connect GDB
arm-none-eabi-gdb firmware.elf
(gdb) target remote localhost:3333`}],usageExamples:[{title:"Fleet OTA Rollout",scenario:"Rolling out a security patch to 10,000 industrial sensors with automatic rollback on failure.",code:`# Staged OTA rollout
# Phase 1: 1% canary (100 devices)
eos-platform deploy firmware/1.2.1 --group industrial --canary 1%

# Monitor for 24 hours
eos-platform deploy status firmware/1.2.1
# Healthy: 99/100 devices updated successfully
# 1 device rolled back (watchdog timeout)

# Phase 2: 10% rollout
eos-platform deploy firmware/1.2.1 --group industrial --canary 10%

# Phase 3: Full rollout
eos-platform deploy firmware/1.2.1 --group industrial --canary 100%`}],ecosystemRole:{importance:"high",role:"Fleet Management and Cloud Bridge",summary:"EoS Platform is the bridge between the EoS device ecosystem and the cloud. Without it, managing a fleet of EoS devices at scale — pushing firmware updates, monitoring health, debugging issues — would require manual intervention on each device. EoS Platform makes EoS deployments production-ready: it provides the OTA infrastructure that eBoot's A/B slots are designed for, the telemetry pipeline that operations teams need, and the remote debug capability that reduces on-site service calls. It is the component that turns EoS from a development platform into a production fleet management system.",dependsOn:["eBoot — A/B update slots are the delivery mechanism for platform OTA updates","EoS Kernel — device identity and telemetry APIs","eDB — device configuration and update history stored on-device","EIPC — platform client communicates with device services via EIPC"],enabledBy:["Production EoS deployments — any fleet of EoS devices at scale","DevOps pipelines — REST API integrates with existing CI/CD workflows","Operations teams — real-time fleet health monitoring and alerting","Field service teams — remote debug reduces on-site service calls"]},features:[{name:"OTA Firmware Updates",desc:"Signed firmware delivery to device fleets. Staged canary rollouts with automatic rollback."},{name:"Fleet Management",desc:"Device registry, group management, and bulk operations via REST API and web dashboard."},{name:"Telemetry Pipeline",desc:"Real-time device health metrics (CPU, RAM, temperature, errors) with alerting."},{name:"Remote Debug",desc:"Secure GDB tunnel and shell access to any registered device."},{name:"Configuration Management",desc:"Push configuration changes to device groups. Version-controlled config history."},{name:"REST API",desc:"Full REST API for integration with existing DevOps pipelines (GitHub Actions, Jenkins, etc.)."},{name:"A/B Rollout",desc:"Canary deployments with automatic rollback if devices fail to mark firmware healthy."},{name:"Audit Log",desc:"Immutable audit log of all platform operations for compliance and forensics."}],specs:[{key:"Deployment Model",value:"SaaS (platform.embeddedos.org) or self-hosted (Docker)"},{key:"API",value:"REST + WebSocket for real-time telemetry"},{key:"Authentication",value:"Device certificates (eBoot-derived); OAuth 2.0 for operators"},{key:"Transport Security",value:"TLS 1.3 for all device-to-platform communication"},{key:"OTA Protocol",value:"HTTPS with Ed25519-signed firmware images"},{key:"Telemetry Retention",value:"90 days (SaaS); configurable (self-hosted)"},{key:"License",value:"MIT (self-hosted); SaaS pricing TBD"}],pairs:[{name:"eBootloader",route:"/product-eboot",desc:"eBoot's A/B slots are the delivery mechanism for EoS Platform OTA updates."},{name:"eBuild",route:"/product-ebuild",desc:"eBuild produces the signed firmware images that EoS Platform distributes."},{name:"EoS Kernel",route:"/product-eos",desc:"Device identity and telemetry APIs are provided by the EoS kernel."}]})}export{l as default};
