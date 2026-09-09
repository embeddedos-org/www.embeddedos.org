import{j as e}from"./vendor-motion-mgp-wB1q.js";import{P as t}from"./ProductDetailPage-e1wZir49.js";import"./vendor-react-DdUyh3Gc.js";import"./index-BmWJZxd4.js";import"./code-xml-D1vFLGuh.js";function r(){return e.jsx(t,{badge:"AI Runtime",title:"eAI — On-Device AI Inference Engine",subtitle:"TFLite · ONNX · GGUF · ReAct Agents · LoRA Fine-tuning",description:"A full-stack on-device AI runtime for embedded systems. Runs LLMs, vision models, and audio classifiers on NPU, GPU, or CPU — with ReAct agent orchestration, LoRA fine-tuning, and federated learning, all within milliwatt power budgets.",accent:"#A855F7",gradient:"from-purple-500/20 to-violet-600/20",lang:"C++ / Python",github:"embeddedos-org/eAI",heroImage:"/media/product-eai-eni_df2d2734.jpg",stackHighlight:"ai runtime",stats:[{value:"3",label:"Model Formats (TFLite, ONNX, GGUF)"},{value:"< 5 mW",label:"Inference Power (NPU)"},{value:"4",label:"Inference Backends"},{value:"4-bit",label:"Quantization Support"}],workflow:[{step:1,title:"Prepare and Quantize Your Model",desc:"Start with a trained model in TensorFlow, PyTorch, or ONNX format. Use eAI's model converter to quantize it to INT8 or 4-bit and generate an .eai bundle with the model, metadata, and calibration data.",code:`# Convert and quantize a TFLite model
eai-convert model.tflite --quant int8 --calib calib_data/ --out model.eai

# Or convert from ONNX
eai-convert model.onnx --quant int4 --out model.eai`},{step:2,title:"Deploy the Model Bundle",desc:"Copy the .eai bundle to the device (flash, SD card, or eDB). The eAI runtime loads it lazily — only the layers needed for the current inference are paged into RAM.",code:`// Load model from flash
eai_model_t model = eai_model_load("model.eai", EAI_BACKEND_NPU);
if (!model) {
    model = eai_model_load("model.eai", EAI_BACKEND_CPU); // fallback
}`},{step:3,title:"Run Inference",desc:"Prepare input tensors, call eai_infer(), and read output tensors. The runtime automatically selects the best backend (NPU > GPU > CPU) based on availability and power budget.",code:`// Image classification example
eai_tensor_t input  = eai_tensor_from_image(frame, 224, 224);
eai_tensor_t output = eai_tensor_alloc(1000); // 1000-class

eai_infer(model, &input, &output);

int class_id = eai_argmax(output);
float conf   = eai_softmax_max(output);
printf("Class: %d  Conf: %.2f\\n", class_id, conf);`},{step:4,title:"Use ReAct Agents for Multi-Step Reasoning",desc:"eAI includes a lightweight ReAct agent loop. Define tools (sensor reads, actuator calls, eDB queries), and the LLM agent will reason and act autonomously — entirely on-device.",code:`// Define tools for the agent
eai_tool_t tools[] = {
    { "read_temp",    tool_read_temperature },
    { "set_fan_speed", tool_set_fan_speed    },
    { "query_db",     tool_edb_query        },
};

// Run the ReAct agent
eai_agent_t agent = eai_agent_create(llm_model, tools, 3);
eai_agent_run(agent,
    "The server room is overheating. Check the temperature "
    "and adjust the fan speed to keep it below 25°C.");`},{step:5,title:"Fine-Tune On-Device with LoRA",desc:"eAI supports LoRA (Low-Rank Adaptation) fine-tuning directly on the device. Collect labeled examples, run a few gradient steps, and the model adapts to your specific use case without sending data to the cloud.",code:`// On-device LoRA fine-tuning
eai_lora_config_t cfg = {
    .rank = 8, .alpha = 16,
    .layers = EAI_LORA_ATTN_LAYERS,
    .lr = 1e-4f, .epochs = 3,
};
eai_lora_train(model, labeled_dataset, &cfg);
eai_model_save(model, "model_finetuned.eai");`}],usageExamples:[{title:"Keyword Spotting",scenario:"Always-on wake-word detection on a Cortex-M4 at < 1 mW, triggering a larger LLM on a more powerful core.",code:`// Keyword spotting pipeline
#include <eai/audio.h>
#include <eai/model.h>

void audio_task(void *arg) {
    eai_model_t kws = eai_model_load("kws_hey_eos.eai", EAI_BACKEND_CPU);
    eai_audio_stream_t mic = eai_audio_open(MIC0, 16000, 1);

    for (;;) {
        // Collect 1-second audio window
        float mfcc[40 * 98];  // 40 MFCC × 98 frames
        eai_audio_mfcc(mic, mfcc, 1000);

        eai_tensor_t out = eai_infer_sync(kws, mfcc);
        if (eai_argmax(out) == KWS_HEY_EOS) {
            eos_event_set(WAKE_EVENT);  // Wake the LLM task
        }
    }
}`},{title:"Visual Inspection (Defect Detection)",scenario:"A factory camera running MobileNetV3 on an NPU to detect PCB defects at 30 fps.",code:`// PCB defect detection at 30 fps
#include <eai/vision.h>

void inspection_task(void *arg) {
    eai_model_t det = eai_model_load("pcb_defect_v2.eai", EAI_BACKEND_NPU);
    camera_t cam = camera_open(CAM0, 640, 480, FMT_RGB888);

    for (;;) {
        uint8_t *frame = camera_capture(cam);
        eai_tensor_t img = eai_tensor_from_image(frame, 224, 224);
        eai_tensor_t out = eai_infer_sync(det, img);

        if (eai_sigmoid(out) > 0.85f) {
            trigger_reject_actuator();
            log_defect_to_edb(frame);
        }
    }
}`},{title:"On-Device LLM Chat",scenario:"A Llama-3.2-1B model running on a Raspberry Pi 5 with eAI, answering user queries about device status.",code:`// On-device LLM with eAI
#include <eai/llm.h>

void llm_task(void *arg) {
    // Load 4-bit quantized Llama 3.2 1B
    eai_model_t llm = eai_model_load("llama3.2-1b-q4.eai", EAI_BACKEND_GPU);

    eai_chat_t chat = eai_chat_create(llm);
    eai_chat_system(chat, "You are an embedded system assistant. "
                          "Answer questions about device status.");

    char response[512];
    eai_chat_complete(chat, "What is the current CPU temperature?",
                      response, sizeof(response));
    printf("LLM: %s\\n", response);
}`}],ecosystemRole:{importance:"high",role:"AI Intelligence Layer",summary:"eAI is the intelligence layer of the EoS ecosystem. It transforms raw sensor data from eNI and the HAL into actionable decisions, natural language responses, and autonomous agent behaviors — all without a cloud connection. eAI is what makes EoS devices 'smart': a health device that detects arrhythmias, a factory robot that recognizes defects, a BCI prosthetic that decodes motor intent, or an edge server that answers questions about its own state. Without eAI, EoS devices are capable but reactive; with eAI, they become proactive and intelligent.",dependsOn:["EoS Kernel — eAI inference tasks run as EoS threads with NPU HAL access","eNI — neural interface data feeds directly into eAI inference pipelines","EIPC — eAI outputs are routed to actuators and other services via EIPC","eDB — model bundles and training data are stored in eDB"],enabledBy:["eHealth365 — arrhythmia detection, SpO₂ analysis, seizure prediction","eNI edge stack — BCI motor decoding, gesture recognition, cognitive load monitoring","eRadar360 — object classification and threat assessment","AeroSwift — flight anomaly detection and predictive maintenance","eOffice — AI-assisted document editing, voice commands, smart scheduling"]},features:[{name:"3 Model Formats",desc:"TFLite, ONNX, and GGUF (LLMs). One eai-convert CLI handles all three with INT8 and 4-bit quantization."},{name:"NPU / GPU / CPU Backends",desc:"Automatic backend selection. Falls back gracefully from NPU to GPU to CPU based on availability and power budget."},{name:"ReAct Agent Loop",desc:"On-device LLM agent with tool use. Define tools as C callbacks; the agent reasons and acts autonomously."},{name:"LoRA Fine-Tuning",desc:"Adapt models on-device with labeled examples. No cloud required. Rank-8 LoRA on 1B models in < 10 minutes."},{name:"Federated Learning",desc:"Aggregate model updates from a fleet of devices without centralizing raw data. Privacy-preserving by design."},{name:"< 5 mW Inference",desc:"Keyword spotting and anomaly detection at milliwatt power levels on dedicated NPU hardware."},{name:"Streaming Inference",desc:"Process audio, video, and sensor streams frame-by-frame without buffering entire inputs."},{name:"Model Versioning",desc:"Pin model versions in the firmware manifest. eBuild ensures the correct model ships with each firmware release."}],specs:[{key:"Supported Formats",value:"TFLite (.tflite), ONNX (.onnx), GGUF (.gguf — LLMs)"},{key:"Quantization",value:"FP32, FP16, INT8, INT4 (4-bit)"},{key:"Backends",value:"NPU (vendor-specific), OpenCL GPU, XNNPACK CPU, CMSIS-NN (Cortex-M)"},{key:"LLM Support",value:"Llama 3.2 1B/3B, Phi-3 Mini, Gemma 2B, Mistral 7B (4-bit, high-RAM devices)"},{key:"Vision Models",value:"MobileNetV3, EfficientDet, YOLO-Nano, ResNet-50 (quantized)"},{key:"Audio Models",value:"Whisper Tiny/Base, wav2vec2, keyword spotting CNNs"},{key:"Agent Framework",value:"ReAct loop with C-callback tools; JSON-schema structured output"},{key:"LoRA Rank",value:"Configurable (4, 8, 16, 32); targets attention layers by default"},{key:"Minimum RAM",value:"128 KB (keyword spotting); 512 MB (1B LLM at 4-bit)"},{key:"License",value:"MIT"}],pairs:[{name:"eNI",route:"/product-eni",desc:"1,024-channel neural interface feeds raw biosignals directly into eAI inference pipelines."},{name:"EIPC",route:"/product-eipc",desc:"Routes eAI outputs to actuators, displays, and other services over the eIPC bus."},{name:"EoS Kernel",route:"/product-eos",desc:"eAI inference tasks run as high-priority EoS threads with direct NPU HAL access."}]})}export{r as default};
