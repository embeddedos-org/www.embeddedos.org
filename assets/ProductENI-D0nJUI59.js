import{j as e}from"./vendor-motion-mgp-wB1q.js";import{P as n}from"./ProductDetailPage-CLT2uD1B.js";import"./vendor-react-DdUyh3Gc.js";import"./index-Bs2DruTa.js";import"./code-xml-BklL03CJ.js";function s(){return e.jsx(n,{badge:"Neural Interface",title:"eNI — Neural Interface Platform",subtitle:"1,024 Channels · 30 kHz EEG · Spike Sorting · BCI Ready",description:"A high-density neural signal acquisition and processing platform. Acquires EEG, EMG, ECoG, LFP, and spike trains from up to 1,024 channels simultaneously, applies real-time hardware-accelerated filtering and spike sorting, and delivers structured data to eAI for on-device BCI decoding.",accent:"#10B981",gradient:"from-emerald-500/20 to-green-600/20",lang:"C / VHDL",github:"embeddedos-org/eNI",heroImage:"/media/product-eni-neural_0723fbf2.jpg",stackHighlight:"neural interface",stats:[{value:"1,024",label:"Simultaneous Channels"},{value:"30 kHz",label:"EEG Sample Rate"},{value:"100 kHz",label:"EMG Sample Rate"},{value:"24-bit",label:"ADC Resolution"}],workflow:[{step:1,title:"Configure the Acquisition Pipeline",desc:"Select the signal modality (EEG, EMG, ECoG, LFP, spikes) and configure the channel map, sample rate, and hardware filter parameters. eNI supports mixed-modality acquisition — EEG and EMG simultaneously on different channel groups.",code:`eni_config_t cfg = {
    .modality    = ENI_MOD_EEG | ENI_MOD_EMG,
    .eeg_channels = 256,
    .emg_channels = 64,
    .eeg_fs       = 30000,  // 30 kHz
    .emg_fs       = 100000, // 100 kHz
    .ref          = ENI_REF_AVERAGE,
};
eni_t eni = eni_open(&cfg);`},{step:2,title:"Apply Hardware Filters",desc:"eNI's FPGA/DSP pipeline applies notch filters (50/60 Hz), bandpass filters, and common-average referencing in hardware — before the data reaches the CPU. This removes the most expensive processing from the software stack.",code:`// Configure hardware filter chain
eni_filter_notch(eni, ENI_NOTCH_60HZ);
eni_filter_bandpass(eni, 0.5f, 300.0f);  // 0.5–300 Hz for EEG
eni_filter_car(eni, ENI_CAR_GLOBAL);     // Common-average reference`},{step:3,title:"Run Spike Sorting",desc:"For extracellular recordings, eNI's hardware spike sorter detects action potentials, extracts waveform features, and clusters them into single-unit activity — all in real time, without CPU involvement.",code:`// Enable hardware spike sorter
eni_spike_config_t sc = {
    .threshold_uv = -50.0f,   // -50 µV threshold
    .window_ms    = 1.5f,     // 1.5 ms waveform window
    .n_clusters   = 4,        // Up to 4 units per channel
};
eni_spike_enable(eni, &sc);`},{step:4,title:"Stream Data to eAI via EIPC",desc:"eNI packages filtered signals and spike events into EIPC messages and sends them to the eAI inference task. The EIPC transport adds HMAC-SHA256 integrity and AES-256 encryption — critical for medical-grade data.",code:`// eNI streams to eAI via EIPC
void eni_stream_task(void *arg) {
    for (;;) {
        eni_frame_t frame;
        eni_read(eni, &frame, ENI_WAIT_FOREVER);
        eipc_send(eai_port, &frame, sizeof(frame));
    }
}`},{step:5,title:"Decode Intent with eAI",desc:"eAI receives the neural data frame, runs the BCI decoder model, and outputs the decoded motor intent or gesture class. The result is sent via EIPC to the actuator (robotic arm, cursor, stimulator).",code:`// eAI BCI decoder (receives from eNI via EIPC)
void eai_bci_task(void *arg) {
    for (;;) {
        eni_frame_t frame;
        eipc_recv(eni_port, &frame, EOS_WAIT_FOREVER);
        eai_tensor_t out = eai_infer_sync(bci_model, frame.eeg);
        int intent = eai_argmax(out);
        eipc_send(arm_port, &intent, sizeof(intent));
    }
}`}],usageExamples:[{title:"Motor BCI Prosthetic",scenario:"Decoding 64-channel ECoG signals in real time to control a robotic arm.",code:`// Motor BCI pipeline: ECoG → eNI → EIPC → eAI → arm
#include <eni/eni.h>
#include <eai/model.h>
#include <eipc/eipc.h>

void bci_pipeline_init(void) {
    // Configure eNI for 64-channel ECoG
    eni_config_t cfg = {
        .modality    = ENI_MOD_ECOG,
        .eeg_channels = 64,
        .eeg_fs       = 30000,
    };
    eni_t eni = eni_open(&cfg);
    eni_filter_bandpass(eni, 70.0f, 200.0f); // High-gamma band

    // Load motor decoder
    eai_model_t decoder = eai_model_load("motor_decoder_v3.eai",
                                         EAI_BACKEND_NPU);

    // Stream: eNI → eAI → robotic arm
    eni_stream_to_eai(eni, decoder, arm_actuator_port);
}`},{title:"Seizure Detection",scenario:"Continuous EEG monitoring on a wearable device, detecting seizure onset and triggering a neurostimulator within 2 seconds.",code:`// Seizure detection pipeline
#include <eni/eni.h>
#include <eai/model.h>

void seizure_monitor_task(void *arg) {
    eni_t eni = eni_open(&eeg_256ch_cfg);
    eai_model_t detector = eai_model_load("seizure_v2.eai",
                                           EAI_BACKEND_NPU);

    for (;;) {
        eni_frame_t frame;
        eni_read(eni, &frame, ENI_WAIT_FOREVER);

        float prob = eai_infer_scalar(detector, frame.eeg);
        if (prob > 0.92f) {
            // Trigger closed-loop neurostimulator
            eipc_send(stim_port, &STIM_SUPPRESS_CMD, 4);
            log_seizure_event(frame.timestamp);
        }
    }
}`}],ecosystemRole:{importance:"high",role:"Biosignal Acquisition Layer",summary:"eNI is the sensory nervous system of the EoS ecosystem. It bridges the biological world — neurons, muscles, brains — with the digital world of EoS. Without eNI, EoS cannot acquire the high-density biosignals needed for BCI prosthetics, seizure detection, cognitive load monitoring, or neural-controlled interfaces. eNI is the only component in the EoS stack that operates at the boundary between biology and silicon, making it indispensable for the entire eHealth365 and BCI product line.",dependsOn:["EoS Kernel — eNI acquisition runs as a high-priority ISR with DMA HAL access","EIPC — transports neural data frames to eAI with integrity and encryption","Hardware ADC / FPGA — 24-bit ADC front-end and FPGA spike sorter"],enabledBy:["eAI — receives eNI data for BCI decoding, seizure detection, gesture recognition","eHealth365 HEALTH-BAND Neuro — sEMG + TENS wristband uses eNI acquisition","eAI Edge Stack — the full eNI → EIPC → eAI pipeline for BCI applications","Research tools — 1,024-channel recordings for neuroscience research"]},features:[{name:"1,024 Simultaneous Channels",desc:"Acquire EEG, EMG, ECoG, LFP, and spike trains from up to 1,024 channels at once."},{name:"Hardware Spike Sorter",desc:"FPGA-based spike detection, waveform extraction, and clustering — no CPU cycles consumed."},{name:"Mixed-Modality Acquisition",desc:"EEG and EMG simultaneously on different channel groups with independent sample rates."},{name:"Hardware Filter Chain",desc:"Notch (50/60 Hz), bandpass, and common-average referencing applied in hardware before CPU."},{name:"Hardware-Pipelined Signal Path",desc:"Filtering and spike sorting run in the FPGA/DSP pipeline ahead of the CPU, so the electrode-to-EIPC path carries no software filtering overhead."},{name:"Medical-Grade Isolation",desc:"Patient isolation per IEC 60601-1. Galvanic isolation on all electrode inputs."},{name:"Impedance Measurement",desc:"Built-in electrode impedance measurement for signal quality monitoring."},{name:"Configurable Reference",desc:"Global common-average, local bipolar, or custom reference montage."}],specs:[{key:"Max Channels",value:"1,024 simultaneous (EEG + EMG + ECoG mixed)"},{key:"EEG Sample Rate",value:"Up to 30 kHz per channel"},{key:"EMG Sample Rate",value:"Up to 100 kHz per channel"},{key:"ADC Resolution",value:"24-bit"},{key:"Input Noise",value:"< 1 µVrms (0.5–300 Hz bandwidth)"},{key:"CMRR",value:"> 120 dB"},{key:"Processing Path",value:"Hardware DSP/FPGA pipeline (filtering + spike sorting) ahead of the EIPC handoff"},{key:"Safety",value:"IEC 60601-1 patient isolation; galvanic isolation on all inputs"},{key:"Interface",value:"SPI / LVDS to host processor; EIPC to eAI"},{key:"License",value:"MIT (software); hardware schematics under CERN-OHL-S"}],pairs:[{name:"eAI",route:"/product-eai",desc:"eNI feeds biosignals directly into eAI for BCI decoding, seizure detection, and gesture recognition."},{name:"EIPC",route:"/product-eipc",desc:"Transports neural data frames from eNI to eAI with HMAC integrity and AES-256 encryption."},{name:"EoS Kernel",route:"/product-eos",desc:"eNI acquisition runs as a high-priority EoS ISR with direct DMA HAL access."}]})}export{s as default};
