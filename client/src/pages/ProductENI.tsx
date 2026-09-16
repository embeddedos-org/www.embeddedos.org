import ProductDetailPage from "@/components/ProductDetailPage";

export default function ProductENI() {
  return (
    <ProductDetailPage
      badge="Neural Interface"
      title="eNI — Neural Interface Platform"
      subtitle="Configurable Channels · Hardware-Defined Sample Rates · Neural Research"
      description="An in-development neural signal acquisition and processing platform for EEG, EMG, ECoG, LFP, and spike-train research. Channel count and sample rate depend on the acquisition hardware and configuration; performance limits remain research targets until measured on a named setup."
      accent="#10B981"
      gradient="from-emerald-500/20 to-green-600/20"
      lang="C / VHDL"
      github="embeddedos-org/eNI"
      heroImage="/media/product-eni-neural_0723fbf2.jpg"
      stackHighlight="neural interface"
      stats={[
        { value: "Configurable", label: "Channel Map" },
        { value: "Hardware", label: "Sample-Rate Limit" },
        { value: "Research", label: "Spike-Sorting Pipeline" },
        { value: "Front End", label: "ADC Resolution" },
      ]}
      workflow={[
        {
          step: 1,
          title: "Configure the Acquisition Pipeline",
          desc: "Select the signal modality (EEG, EMG, ECoG, LFP, spikes) and configure the channel map, sample rate, and hardware filter parameters. eNI supports mixed-modality acquisition — EEG and EMG simultaneously on different channel groups.",
          code: "eni_config_t cfg = {\n    .modality     = ENI_MOD_EEG | ENI_MOD_EMG,\n    .eeg_channels = BOARD_EEG_CHANNELS,\n    .emg_channels = BOARD_EMG_CHANNELS,\n    .eeg_fs       = BOARD_EEG_SAMPLE_RATE,\n    .emg_fs       = BOARD_EMG_SAMPLE_RATE,\n    .ref          = ENI_REF_AVERAGE,\n};\neni_t eni = eni_open(&cfg);",
        },
        {
          step: 2,
          title: "Apply Hardware Filters",
          desc: "eNI's FPGA/DSP pipeline applies notch filters (50/60 Hz), bandpass filters, and common-average referencing in hardware — before the data reaches the CPU. This removes the most expensive processing from the software stack.",
          code: "// Configure hardware filter chain\neni_filter_notch(eni, ENI_NOTCH_60HZ);\neni_filter_bandpass(eni, 0.5f, 300.0f);  // 0.5–300 Hz for EEG\neni_filter_car(eni, ENI_CAR_GLOBAL);     // Common-average reference",
        },
        {
          step: 3,
          title: "Run Spike Sorting",
          desc: "For extracellular recordings, eNI's hardware spike sorter detects action potentials, extracts waveform features, and clusters them into single-unit activity — all in real time, without CPU involvement.",
          code: "// Enable hardware spike sorter\neni_spike_config_t sc = {\n    .threshold_uv = -50.0f,   // -50 µV threshold\n    .window_ms    = 1.5f,     // 1.5 ms waveform window\n    .n_clusters   = 4,        // Up to 4 units per channel\n};\neni_spike_enable(eni, &sc);",
        },
        {
          step: 4,
          title: "Stream Data to eAI via EIPC",
          desc: "eNI packages filtered signals and spike events into EIPC messages and sends them to the eAI inference task. The design uses HMAC-SHA256 integrity and AES-256 encryption; medical use would require system-level validation and regulatory approval.",
          code: "// eNI streams to eAI via EIPC\nvoid eni_stream_task(void *arg) {\n    for (;;) {\n        eni_frame_t frame;\n        eni_read(eni, &frame, ENI_WAIT_FOREVER);\n        eipc_send(eai_port, &frame, sizeof(frame));\n    }\n}",
        },
        {
          step: 5,
          title: "Decode Intent with eAI",
          desc: "eAI receives the neural data frame, runs the BCI decoder model, and outputs the decoded motor intent or gesture class. The result is sent via EIPC to the actuator (robotic arm, cursor, stimulator).",
          code: "// eAI BCI decoder (receives from eNI via EIPC)\nvoid eai_bci_task(void *arg) {\n    for (;;) {\n        eni_frame_t frame;\n        eipc_recv(eni_port, &frame, EOS_WAIT_FOREVER);\n        eai_tensor_t out = eai_infer_sync(bci_model, frame.eeg);\n        int intent = eai_argmax(out);\n        eipc_send(arm_port, &intent, sizeof(intent));\n    }\n}",
        },
      ]}
      usageExamples={[
        {
          title: "Motor BCI Prosthetic",
          scenario:
            "Illustrative research configuration for evaluating ECoG motor-intent decoding with an assistive controller.",
          code: '// Illustrative research pipeline: ECoG → eNI → EIPC → eAI\n#include <eni/eni.h>\n#include <eai/model.h>\n#include <eipc/eipc.h>\n\nvoid bci_pipeline_init(void) {\n    eni_config_t cfg = {\n        .modality     = ENI_MOD_ECOG,\n        .eeg_channels = BOARD_ECOG_CHANNELS,\n        .eeg_fs       = BOARD_ECOG_SAMPLE_RATE,\n    };\n    eni_t eni = eni_open(&cfg);\n    eni_filter_bandpass(eni, 70.0f, 200.0f);\n\n    eai_model_t decoder = eai_model_load("research_decoder.eai",\n                                         EAI_BACKEND_NPU);\n    eni_stream_to_eai(eni, decoder, research_output_port);\n}',
        },
        {
          title: "Seizure Detection",
          scenario:
            "Illustrative research pipeline for evaluating EEG pattern detection; it does not claim clinical detection performance or treatment efficacy.",
          code: '// Seizure detection pipeline\n#include <eni/eni.h>\n#include <eai/model.h>\n\nvoid seizure_monitor_task(void *arg) {\n    eni_t eni = eni_open(&eeg_256ch_cfg);\n    eai_model_t detector = eai_model_load("seizure_v2.eai",\n                                           EAI_BACKEND_NPU);\n\n    for (;;) {\n        eni_frame_t frame;\n        eni_read(eni, &frame, ENI_WAIT_FOREVER);\n\n        float prob = eai_infer_scalar(detector, frame.eeg);\n        if (prob > 0.92f) {\n            // Trigger closed-loop neurostimulator\n            eipc_send(stim_port, &STIM_SUPPRESS_CMD, 4);\n            log_seizure_event(frame.timestamp);\n        }\n    }\n}',
        },
      ]}
      ecosystemRole={{
        importance: "high",
        role: "Biosignal Acquisition Layer",
        summary:
          "eNI is the sensory nervous system of the EoS ecosystem. It bridges the biological world — neurons, muscles, brains — with the digital world of EoS. Without eNI, EoS cannot acquire the high-density biosignals needed for BCI prosthetics, seizure detection, cognitive load monitoring, or neural-controlled interfaces. eNI is the only component in the EoS stack that operates at the boundary between biology and silicon, making it indispensable for the entire eHealth365 and BCI product line.",
        dependsOn: [
          "EoS Kernel — eNI acquisition runs as a high-priority ISR with DMA HAL access",
          "EIPC — transports neural data frames to eAI with integrity and encryption",
          "Hardware ADC / FPGA — 24-bit ADC front-end and FPGA spike sorter",
        ],
        enabledBy: [
          "eAI — receives eNI data for BCI decoding, seizure detection, gesture recognition",
          "eHealth365 HEALTH-BAND Neuro — sEMG + TENS wristband uses eNI acquisition",
          "eAI Edge Stack — the full eNI → EIPC → eAI pipeline for BCI applications",
          "Research tools — configuration-specific neural recordings",
        ],
      }}
      features={[
        {
          name: "Configurable Channel Maps",
          desc: "Configure EEG, EMG, ECoG, LFP, and spike-train inputs within the limits of the attached acquisition hardware.",
        },
        {
          name: "Hardware Spike Sorter",
          desc: "FPGA-based spike detection, waveform extraction, and clustering — no CPU cycles consumed.",
        },
        {
          name: "Mixed-Modality Acquisition",
          desc: "EEG and EMG simultaneously on different channel groups with independent sample rates.",
        },
        {
          name: "Hardware Filter Chain",
          desc: "Notch (50/60 Hz), bandpass, and common-average referencing applied in hardware before CPU.",
        },
        {
          name: "Hardware-Pipelined Signal Path",
          desc: "Filtering and spike sorting run in the FPGA/DSP pipeline ahead of the CPU, so the electrode-to-EIPC path carries no software filtering overhead.",
        },
        {
          name: "Isolation Design Target",
          desc: "The hardware design targets IEC 60601-1 patient-isolation requirements; certification and physical validation are pending.",
        },
        {
          name: "Impedance Measurement",
          desc: "Built-in electrode impedance measurement for signal quality monitoring.",
        },
        {
          name: "Configurable Reference",
          desc: "Global common-average, local bipolar, or custom reference montage.",
        },
      ]}
      specs={[
        {
          key: "Channels and Sample Rate",
          value: "Configuration-specific; limited by the acquisition front end",
        },
        { key: "ADC Resolution", value: "Acquisition-front-end dependent" },
        { key: "Input Noise", value: "Hardware benchmark pending" },
        { key: "CMRR", value: "Hardware benchmark pending" },
        {
          key: "Processing Path",
          value:
            "Hardware DSP/FPGA pipeline (filtering + spike sorting) ahead of the EIPC handoff",
        },
        {
          key: "Safety",
          value:
            "Design target: IEC 60601-1 patient isolation; validation pending",
        },
        {
          key: "Interface",
          value: "SPI / LVDS to host processor; EIPC to eAI",
        },
        {
          key: "License",
          value: "MIT (software); hardware schematics under CERN-OHL-S",
        },
      ]}
      pairs={[
        {
          name: "eAI",
          route: "/product-eai",
          desc: "eNI feeds biosignals directly into eAI for BCI decoding, seizure detection, and gesture recognition.",
        },
        {
          name: "EIPC",
          route: "/product-eipc",
          desc: "Transports neural data frames from eNI to eAI with HMAC integrity and AES-256 encryption.",
        },
        {
          name: "EoS Kernel",
          route: "/product-eos",
          desc: "eNI acquisition runs as a high-priority EoS ISR with direct DMA HAL access.",
        },
      ]}
    />
  );
}
