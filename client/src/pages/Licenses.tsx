import { motion } from "framer-motion";
import { Scale, CheckCircle2, ExternalLink, ArrowRight } from "lucide-react";

const licenses = [
  {
    name: "EmbeddedOS Core",
    license: "MIT License",
    desc: "All EmbeddedOS products (EoS kernel, eBootloader, EAI, ENI, EIPC, eBuild, EoSim, EoStudio, eDB, eBrowser, eOffice, eFlow) are released under the MIT License.",
    href: "https://opensource.org/licenses/MIT",
  },
  {
    name: "CMSIS (ARM)",
    license: "Apache 2.0",
    desc: "ARM CMSIS-Core, CMSIS-DSP, and CMSIS-NN are used for Cortex-M hardware abstraction and neural network acceleration.",
    href: "https://github.com/ARM-software/CMSIS_6/blob/main/LICENSE",
  },
  {
    name: "lwIP",
    license: "BSD 3-Clause",
    desc: "lwIP is used for the EoS networking stack (TCP/IP, UDP, DHCP, DNS, TLS).",
    href: "https://savannah.nongnu.org/projects/lwip/",
  },
  {
    name: "mbedTLS",
    license: "Apache 2.0",
    desc: "mbedTLS provides the cryptographic primitives (AES, ChaCha20, Ed25519, X25519, SHA-3) in the EoS crypto module.",
    href: "https://github.com/Mbed-TLS/mbedtls",
  },
  {
    name: "FatFS",
    license: "BSD 1-Clause (Custom)",
    desc: "FatFS is used for FAT12/16/32 filesystem support in the EoS filesystem module.",
    href: "https://elm-chan.org/fsw/ff/00index_e.html",
  },
  {
    name: "TensorFlow Lite Micro",
    license: "Apache 2.0",
    desc: "TFLite Micro is used as one of the inference backends in EAI for ONNX and TFLite model execution.",
    href: "https://github.com/tensorflow/tflite-micro",
  },
  {
    name: "React",
    license: "MIT",
    desc: "The EmbeddedOS website and EoStudio IDE frontend are built with React.",
    href: "https://github.com/facebook/react/blob/main/LICENSE",
  },
  {
    name: "Three.js",
    license: "MIT",
    desc: "Three.js is used for 3D hardware visualizations on the EmbeddedOS website.",
    href: "https://github.com/mrdoob/three.js/blob/dev/LICENSE",
  },
];

const mitText = `MIT License

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
SOFTWARE.`;

export default function LicensesPage() {
  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-cyan-500/5" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium mb-6">
              <Scale className="w-4 h-4" /> LICENSES
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
              Licenses
            </h1>
            <p className="text-xl text-gray-300">
              All EmbeddedOS software is MIT licensed. Third-party component
              licenses are listed below.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-4">
            EmbeddedOS MIT License
          </h2>
          <pre className="bg-white/5 border border-white/10 rounded-xl p-6 text-gray-300 text-xs font-mono whitespace-pre-wrap overflow-x-auto">
            {mitText}
          </pre>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">
            Third-Party Licenses
          </h2>
          <div className="space-y-3">
            {licenses.map((l, i) => (
              <motion.div
                key={l.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium">{l.name}</span>
                      <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs">
                        {l.license}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{l.desc}</p>
                  </div>
                </div>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-white transition-colors flex-shrink-0"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
