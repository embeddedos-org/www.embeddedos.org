import{j as e}from"./vendor-react-aOLDZyDv.js";import{i as t,j as o,l as i}from"./index-CzZRO8AM.js";import"./vendor-motion-D0ROkIIu.js";const r=[{name:"EmbeddedOS Core",license:"MIT License",desc:"All EmbeddedOS products (EoS kernel, eBootloader, EAI, ENI, EIPC, eBuild, EoSim, EoStudio, eDB, eBrowser, eOffice, eFlow) are released under the MIT License.",href:"https://spdx.org/licenses/MIT.html"},{name:"CMSIS (ARM)",license:"Apache 2.0",desc:"ARM CMSIS-Core, CMSIS-DSP, and CMSIS-NN are used for Cortex-M hardware abstraction and neural network acceleration.",href:"https://github.com/ARM-software/CMSIS_6/blob/main/LICENSE"},{name:"lwIP",license:"BSD 3-Clause",desc:"lwIP is used for the EoS networking stack (TCP/IP, UDP, DHCP, DNS, TLS).",href:"https://github.com/lwip-tcpip/lwip"},{name:"mbedTLS",license:"Apache 2.0",desc:"mbedTLS provides the cryptographic primitives (AES, ChaCha20, Ed25519, X25519, SHA-3) in the EoS crypto module.",href:"https://github.com/Mbed-TLS/mbedtls"},{name:"FatFS",license:"BSD 1-Clause (Custom)",desc:"FatFS is used for FAT12/16/32 filesystem support in the EoS filesystem module.",href:"https://elm-chan.org/fsw/ff/00index_e.html"},{name:"TensorFlow Lite Micro",license:"Apache 2.0",desc:"TFLite Micro is used as one of the inference backends in EAI for ONNX and TFLite model execution.",href:"https://github.com/tensorflow/tflite-micro"},{name:"React",license:"MIT",desc:"The EmbeddedOS website and EoStudio IDE frontend are built with React.",href:"https://github.com/facebook/react/blob/main/LICENSE"},{name:"Three.js",license:"MIT",desc:"Three.js is used for 3D hardware visualizations on the EmbeddedOS website.",href:"https://github.com/mrdoob/three.js/blob/dev/LICENSE"}],n=`MIT License

Copyright (c) 2023–2026 EmbeddedOS Research Foundation

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;function l(){return e.jsxs(t,{className:"licenses",children:[e.jsx(o,{sig:!0,label:"LICENSES",title:"Licenses",lead:"All EmbeddedOS software is MIT licensed. Third-party component licenses are listed below."}),e.jsx(i,{title:"EmbeddedOS MIT License",tight:!0,children:e.jsxs("div",{className:"code",children:[e.jsxs("div",{className:"cbar",children:[e.jsx("b",{children:"LICENSE"}),e.jsx("span",{children:"MIT"})]}),e.jsx("pre",{className:"wrapm",children:n})]})}),e.jsx(i,{title:"Third-Party Licenses",children:e.jsx("ul",{className:"cards two",children:r.map(s=>e.jsx("li",{children:e.jsxs("div",{className:"card",children:[e.jsxs("div",{className:"top",children:[e.jsx("h3",{children:s.name}),e.jsx("a",{href:s.href,target:"_blank",rel:"noopener noreferrer","aria-label":`${s.name} licence, opens in a new tab`,className:"lc-ext",children:e.jsx("span",{"aria-hidden":"true",children:"↗"})})]}),e.jsx("p",{className:"k",children:s.license}),e.jsx("p",{children:s.desc})]})},s.name))})})]})}export{l as default};
