import ProductDetailPage from "@/components/ProductDetailPage";

// The service apps ship inside the eApps repository. There is no separate
// `eserviceapps` repo — linking to one returned 404 from every "View on
// GitHub" control on this page.
export default function ProductEServiceApps() {
  return (
    <ProductDetailPage
      badge="Service Apps"
      title="eServiceApps — Embedded Service Applications"
      subtitle="eSocial · eRide · eTravel · eWallet · eHealth Mobile"
      description="A suite of consumer-facing service applications for EoS devices. eSocial, eRide, eTravel, eWallet, and eHealth365 Mobile — all running natively on EoS hardware with offline-first architecture, end-to-end encryption, and EIPC integration with the EoS platform."
      accent="#EC4899"
      gradient="from-pink-500/20 to-rose-600/20"
      lang="C++ / eUI"
      github="embeddedos-org/eApps"
      heroImage="/manus-storage/product-eserviceapps_6c6d4f1a.jpg"
      stackHighlight="app layer"
      stats={[
        { value: "5", label: "Service Apps" },
        { value: "Offline-First", label: "Architecture" },
        { value: "E2E", label: "Encryption" },
        { value: "BLE + WiFi", label: "Connectivity" },
      ]}
      workflow={[
        {
          step: 1,
          title: "Install Service Apps",
          desc: "Service apps are installed via eApps. They require network connectivity (WiFi or cellular) for their cloud backends, but all core functionality works offline with eDB local storage.",
          code: "# Install service apps\neapps install esocial eride etravel ewallet ehealth365-mobile",
        },
        {
          step: 2,
          title: "Authenticate with eVault",
          desc: "Service apps use eVault for secure credential storage. OAuth tokens, API keys, and user credentials are stored encrypted in eDB with keys derived from the eBoot chain of trust.",
          code: '// Store OAuth token in eVault\nevault_store("esocial.oauth_token", token, strlen(token));\n\n// Retrieve it later\nchar token[256];\nevault_get("esocial.oauth_token", token, sizeof(token));',
        },
        {
          step: 3,
          title: "Use Offline-First Architecture",
          desc: "All service apps write to eDB first, then sync to the cloud when connectivity is available. This ensures the app works even without network access.",
          code: '// eRide: store trip locally, sync when online\nvoid record_trip(trip_t *trip) {\n    // Always write to eDB first\n    edb_doc_t doc = trip_to_doc(trip);\n    edb_collection_insert(db, "eride_trips", doc);\n\n    // Sync to cloud if online\n    if (eos_net_is_connected()) {\n        sync_to_cloud("eride_trips");\n    }\n    // Background sync task handles offline trips\n}',
        },
      ]}
      usageExamples={[
        {
          title: "eHealth365 Mobile Integration",
          scenario:
            "The eHealth365 Mobile app receives real-time biometric data from a HEALTH-BAND Neuro wristband via BLE and displays it on an EoS tablet.",
          code: '// eHealth365 Mobile: BLE → eNI → eAI → display\n#include <eos/ble.h>\n#include <eai/model.h>\n\nvoid health_monitor_task(void *arg) {\n    ble_device_t band = ble_connect("HEALTH-BAND-Neuro-4821");\n    eai_model_t hrv = eai_model_load("hrv_analysis.eai", EAI_BACKEND_CPU);\n\n    for (;;) {\n        health_frame_t frame;\n        ble_recv(band, &frame, sizeof(frame));\n\n        // AI analysis\n        float hrv_score = eai_infer_scalar(hrv, frame.rr_intervals);\n\n        // Store in eDB\n        edb_doc_t doc = health_frame_to_doc(&frame, hrv_score);\n        edb_collection_insert(db, "health_log", doc);\n\n        // Update UI\n        ui_update_biometrics(&frame, hrv_score);\n    }\n}',
        },
      ]}
      ecosystemRole={{
        importance: "medium",
        role: "Consumer Service Layer",
        summary:
          "eServiceApps brings consumer-grade service applications to EoS devices. They demonstrate that EoS is not just for industrial and medical applications — it is a complete consumer platform. eServiceApps also serves as the reference implementation for how EoS apps should handle cloud connectivity: offline-first with eDB, secure credential storage with eVault, and EIPC integration with the EoS platform.",
        dependsOn: [
          "EoS Kernel — all service apps run as EoS processes",
          "eDB — offline-first local storage for all service data",
          "eVault (eOffice) — secure credential and token storage",
          "EIPC — inter-app communication and platform service access",
          "eAI — AI features (health analysis, route optimization, fraud detection)",
        ],
        enabledBy: [
          "Consumer EoS devices — tablets, smart displays, wearables",
          "eHealth365 devices — biometric data visualization and analysis",
          "Smart city infrastructure — eRide and eTravel for urban mobility",
        ],
      }}
      features={[
        {
          name: "eSocial",
          desc: "Social networking client with end-to-end encrypted messaging, offline post drafting, and eDB sync.",
        },
        {
          name: "eRide",
          desc: "Ride-sharing and navigation app with offline maps, route optimization, and trip logging in eDB.",
        },
        {
          name: "eTravel",
          desc: "Travel planning app with offline itineraries, boarding pass storage, and currency conversion.",
        },
        {
          name: "eWallet",
          desc: "Digital wallet with NFC payments, transaction history in eDB, and eVault-encrypted credentials.",
        },
        {
          name: "eHealth365 Mobile",
          desc: "Companion app for eHealth365 devices. Real-time biometric dashboard, AI health insights, and HIPAA-compliant eDB storage.",
        },
        {
          name: "Offline-First",
          desc: "All apps write to eDB first and sync to cloud when connectivity is available.",
        },
        {
          name: "E2E Encryption",
          desc: "All user data is encrypted with AES-256 keys stored in eVault.",
        },
        {
          name: "BLE + WiFi",
          desc: "Connect to eHealth365 devices via BLE; sync to cloud via WiFi or cellular.",
        },
      ]}
      specs={[
        {
          key: "Apps",
          value: "eSocial, eRide, eTravel, eWallet, eHealth365 Mobile",
        },
        {
          key: "Architecture",
          value:
            "Offline-first with eDB local storage and background cloud sync",
        },
        {
          key: "Encryption",
          value:
            "AES-256 for data at rest (eVault); TLS 1.3 for data in transit",
        },
        {
          key: "Connectivity",
          value: "BLE 5.0, WiFi 802.11ac, LTE (via modem HAL)",
        },
        {
          key: "Health Standards",
          value: "HIPAA-compliant data handling for eHealth365 Mobile",
        },
        { key: "License", value: "MIT" },
      ]}
      pairs={[
        {
          name: "eDB",
          route: "/product-edb",
          desc: "Offline-first local storage for all service app data.",
        },
        {
          name: "eOffice Suite",
          route: "/product-eoffice",
          desc: "eVault (part of eOffice) provides secure credential storage for service apps.",
        },
        {
          name: "eAI",
          route: "/product-eai",
          desc: "AI features: health analysis, route optimization, fraud detection.",
        },
      ]}
    />
  );
}
