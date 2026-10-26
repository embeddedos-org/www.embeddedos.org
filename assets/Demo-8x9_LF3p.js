const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/PCBTrace-8Jbh9RCM.js","assets/vendor-react-aOLDZyDv.js","assets/reduced-motion-C0Xs7zLp.js","assets/on-screen-DIDx_J3K.js","assets/Oscilloscope-B0dVghhx.js"])))=>i.map(i=>d[i]);
import{i as S,j as E,l as v,y as R,g as w,_ as f}from"./index-b9RpI-8S.js";import{r as i,j as e,L as G}from"./vendor-react-aOLDZyDv.js";import"./vendor-motion-D0ROkIIu.js";const W=i.lazy(()=>f(()=>import("./PCBTrace-8Jbh9RCM.js"),__vite__mapDeps([0,1,2,3]))),H=i.lazy(()=>f(()=>import("./Oscilloscope-B0dVghhx.js"),__vite__mapDeps([4,1,2,3]))),m=[{id:"stm32f4",name:"STM32F4 Discovery",mcu:"STM32F407VGT6",arch:"ARM Cortex-M4",freq:"168 MHz",flash:"1 MB",ram:"192 KB",color:"#22D3EE",pins:[{id:0,label:"PA0",mode:"OUTPUT",state:"LOW"},{id:1,label:"PA1",mode:"OUTPUT",state:"LOW"},{id:2,label:"PB0",mode:"OUTPUT",state:"LOW"},{id:3,label:"PB1",mode:"INPUT",state:"LOW"},{id:4,label:"PC0",mode:"OUTPUT",state:"LOW"},{id:5,label:"PC1",mode:"OUTPUT",state:"LOW"},{id:6,label:"PD0",mode:"INPUT",state:"LOW"},{id:7,label:"PD1",mode:"OUTPUT",state:"LOW"}]},{id:"esp32",name:"ESP32 DevKit",mcu:"ESP32-D0WDQ6",arch:"Xtensa LX6 (dual-core)",freq:"240 MHz",flash:"4 MB",ram:"520 KB",color:"#34D399",pins:[{id:0,label:"GPIO2",mode:"OUTPUT",state:"LOW"},{id:1,label:"GPIO4",mode:"OUTPUT",state:"LOW"},{id:2,label:"GPIO5",mode:"OUTPUT",state:"LOW"},{id:3,label:"GPIO12",mode:"INPUT",state:"LOW"},{id:4,label:"GPIO13",mode:"OUTPUT",state:"LOW"},{id:5,label:"GPIO14",mode:"INPUT",state:"LOW"},{id:6,label:"GPIO16",mode:"OUTPUT",state:"LOW"},{id:7,label:"GPIO17",mode:"OUTPUT",state:"LOW"}]},{id:"rpi-pico",name:"Raspberry Pi Pico",mcu:"RP2040",arch:"ARM Cortex-M0+ (dual-core)",freq:"133 MHz",flash:"2 MB",ram:"264 KB",color:"#A78BFA",pins:[{id:0,label:"GP0",mode:"OUTPUT",state:"LOW"},{id:1,label:"GP1",mode:"OUTPUT",state:"LOW"},{id:2,label:"GP2",mode:"INPUT",state:"LOW"},{id:3,label:"GP3",mode:"OUTPUT",state:"LOW"},{id:4,label:"GP4",mode:"OUTPUT",state:"LOW"},{id:5,label:"GP5",mode:"INPUT",state:"LOW"},{id:6,label:"GP6",mode:"OUTPUT",state:"LOW"},{id:7,label:"GP7",mode:"OUTPUT",state:"LOW"}]}],T=[{id:"blink",name:"LED Blink",desc:"Toggles an output pin at 1 Hz",code:`// EoS LED Blink — written against the real EoS HAL (eos/hal.h)
#include <eos/hal.h>
#include <stdio.h>

int main(void) {
    eos_hal_init();
    eos_gpio_config_t led = { .pin = 0, .mode = EOS_GPIO_OUTPUT };
    eos_gpio_init(&led);
    printf("LED blink started\\n");

    while (1) {
        eos_gpio_write(0, true);
        printf("PIN_0 -> HIGH\\n");
        eos_delay_ms(500);

        eos_gpio_write(0, false);
        printf("PIN_0 -> LOW\\n");
        eos_delay_ms(500);
    }
}`,run:(t,c,l)=>{const n=Math.floor(l/5)%2===0,a=t.map(o=>o.id===0?{...o,state:n?"HIGH":"LOW"}:o);if(l%5===0){const o=n?"HIGH":"LOW";c(O=>[...O.slice(-49),{id:Date.now(),ts:new Date().toLocaleTimeString(),level:"ok",msg:`PIN_0 → ${o}`}])}return a}},{id:"uart",name:"UART Echo",desc:"Sends periodic messages over UART0",code:`// EoS UART heartbeat — UART0 at 115200 baud, real EoS HAL
#include <eos/hal.h>
#include <stdio.h>
#include <string.h>

int main(void) {
    eos_hal_init();
    eos_uart_config_t uart = { .port = 0, .baudrate = 115200, .data_bits = 8 };
    eos_uart_init(&uart);
    uint32_t counter = 0;

    while (1) {
        char buf[64];
        int n = snprintf(buf, sizeof(buf),
            "EoS heartbeat #%lu\\r\\n", (unsigned long)counter++);
        eos_uart_write(0, (const uint8_t *)buf, (size_t)n);
        eos_delay_ms(1000);
    }
}`,run:(t,c,l)=>{if(l%10===0){const n=Math.floor(l/10);c(a=>[...a.slice(-49),{id:Date.now(),ts:new Date().toLocaleTimeString(),level:"info",msg:`UART0 TX: "EoS heartbeat #${n}\\r\\n"`}])}return t}},{id:"gpio-scan",name:"GPIO Scanner",desc:"Cycles through all output pins sequentially",code:`// EoS GPIO Scanner — knight-rider pattern, real EoS HAL
#include <eos/hal.h>
#include <stdio.h>

#define PIN_COUNT 8

int main(void) {
    eos_hal_init();
    for (uint16_t i = 0; i < PIN_COUNT; i++) {
        eos_gpio_config_t cfg = { .pin = i, .mode = EOS_GPIO_OUTPUT };
        eos_gpio_init(&cfg);
    }
    int active = 0;

    while (1) {
        for (int i = 0; i < PIN_COUNT; i++)
            eos_gpio_write((uint16_t)i, i == active);

        printf("Active pin: %d -> HIGH\\n", active);
        active = (active + 1) % PIN_COUNT;
        eos_delay_ms(200);
    }
}`,run:(t,c,l)=>{const n=l%8,a=t.map(o=>({...o,state:o.mode==="OUTPUT"&&o.id===n?"HIGH":"LOW"}));return l%2===0&&c(o=>[...o.slice(-49),{id:Date.now(),ts:new Date().toLocaleTimeString(),level:"ok",msg:`Active pin: ${n} → HIGH`}]),a}}];function A(){const[t,c]=i.useState(0),[l,n]=i.useState(0),[a,o]=i.useState(!1),[O,b]=i.useState(m[0].pins),[P,j]=i.useState([]),g=i.useRef(0),h=i.useRef(null),_=i.useRef(null),N=i.useRef(null),d=m[t],u=T[l],p=i.useCallback(()=>{h.current&&clearInterval(h.current),h.current=null,o(!1)},[]);i.useEffect(()=>{p(),b(m[t].pins.map(s=>({...s,state:"LOW"}))),j([]),g.current=0},[t,l,p]),i.useEffect(()=>{const s=N.current;!s||P.length===0||(s.scrollTop=s.scrollHeight)},[P]);const U=i.useCallback(()=>{a||(o(!0),j(s=>[...s,{id:Date.now(),ts:new Date().toLocaleTimeString(),level:"info",msg:`EoSim: running "${u.name}" on ${d.name}`}]),h.current=setInterval(()=>{g.current+=1;const s=g.current;b(r=>u.run(r,j,s))},100))},[a,u,d]),I=i.useCallback(()=>{p(),b(m[t].pins.map(s=>({...s,state:"LOW"}))),j([]),g.current=0},[t,p]);i.useEffect(()=>()=>{h.current&&clearInterval(h.current)},[]);const L=s=>{a||b(r=>r.map(x=>x.id===s&&x.mode==="OUTPUT"?{...x,state:x.state==="HIGH"?"LOW":"HIGH"}:x))};return e.jsxs(S,{className:"demo",style:{"--c":d.color},children:[e.jsx(E,{sig:!0,label:"Interactive Board Visualisation",title:e.jsxs(e.Fragment,{children:["See an EoS Program ",e.jsx("span",{children:"Run"}),e.jsx("br",{}),"Without Hardware"]}),lead:"An illustrative, in-browser visualisation of small EoS programs: toggle GPIO pins and watch console output. It does not compile or execute EoS. To boot the real kernel without hardware, use ebuild sim on QEMU (see Getting Started).",children:e.jsxs("div",{className:"ctas",children:[e.jsxs("a",{href:"https://github.com/embeddedos-org/EoSim",target:"_blank",rel:"noopener noreferrer",className:"btn pri",children:["View EoSim on GitHub"," ",e.jsx("span",{className:"ar","aria-hidden":"true",children:"↗"})]}),e.jsxs(G,{href:"/docs",className:"btn gh",children:["Documentation"," ",e.jsx("span",{className:"ar","aria-hidden":"true",children:"→"})]})]})}),e.jsxs(v,{wide:!0,tight:!0,className:"demo-bench",ariaLabel:"Board visualisation",children:[e.jsxs("div",{className:"demo-bar",children:[e.jsxs("div",{className:"demo-grp",children:[e.jsx("p",{className:"label",children:"Target Board"}),e.jsx("div",{className:"demo-seg",children:m.map((s,r)=>e.jsx("button",{type:"button",onClick:()=>c(r),"aria-pressed":t===r,className:"demo-opt",style:{"--c":s.color},children:s.name},s.id))})]}),e.jsxs("div",{className:"demo-grp",children:[e.jsx("p",{className:"label",children:"Program"}),e.jsx("div",{className:"demo-seg",children:T.map((s,r)=>e.jsx("button",{type:"button",onClick:()=>n(r),"aria-pressed":l===r,className:"demo-opt",children:s.name},s.id))})]}),e.jsxs("div",{className:"demo-run",children:[e.jsx("button",{type:"button",onClick:U,disabled:a,className:"btn pri",children:a?"Running…":"Run"}),e.jsx("button",{type:"button",onClick:p,disabled:!a,className:"btn gh",children:"Stop"}),e.jsx("button",{type:"button",onClick:I,"aria-label":"Reset simulation",title:"Reset simulation",className:"btn gh demo-reset",children:e.jsx(R,{size:16,"aria-hidden":"true"})})]})]}),e.jsxs("div",{className:"demo-scopes",children:[e.jsxs("figure",{className:"demo-scope",children:[e.jsxs("figcaption",{children:[e.jsx("b",{children:"PCB Signal Traces"}),e.jsx("span",{children:m[t].name})]}),e.jsx("div",{className:"demo-cv",children:e.jsx(i.Suspense,{fallback:e.jsx("div",{className:"demo-load",children:"Loading..."}),children:e.jsx(W,{running:a})})})]}),e.jsxs("figure",{className:"demo-scope",children:[e.jsxs("figcaption",{children:[e.jsxs("b",{className:"nodot",children:[e.jsx("i",{className:a?"demo-live on":"demo-live","aria-hidden":"true"}),"Oscilloscope"]}),e.jsx("span",{children:T[l].name})]}),e.jsx("div",{className:"demo-cv",children:e.jsx(i.Suspense,{fallback:e.jsx("div",{className:"demo-load",children:"Loading..."}),children:e.jsx(H,{program:T[l].id,running:a,color:m[t].color})})})]})]}),e.jsxs("div",{className:"demo-grid",children:[e.jsxs("div",{className:"demo-col",children:[e.jsxs("div",{className:"demo-panel demo-board",children:[e.jsxs("div",{className:"demo-bh",children:[e.jsxs("div",{children:[e.jsx("div",{className:"demo-bn",children:d.name}),e.jsx("div",{className:"demo-mcu",children:d.mcu})]}),e.jsx("span",{className:"demo-arch",children:d.arch})]}),e.jsx("dl",{className:"demo-specs",children:[{label:"Clock",value:d.freq},{label:"Flash",value:d.flash},{label:"RAM",value:d.ram}].map(s=>e.jsxs("div",{children:[e.jsx("dt",{children:s.label}),e.jsx("dd",{children:s.value})]},s.label))})]}),e.jsxs("div",{className:"demo-panel",children:[e.jsxs("div",{className:"demo-ph",children:[e.jsx("div",{className:"demo-pt",children:"GPIO Pins"}),e.jsx("div",{className:"demo-hint",children:a?"Read-only while running":"Click OUTPUT pins to toggle"})]}),e.jsx("div",{className:"demo-pins",children:O.map(s=>e.jsxs("button",{type:"button",onClick:()=>L(s.id),disabled:s.mode==="INPUT"||a,className:["demo-pin",s.state==="HIGH"&&"hi",s.mode==="INPUT"&&"in"].filter(Boolean).join(" "),children:[e.jsx("span",{className:"demo-pl",children:s.label}),e.jsx("span",{className:"demo-ps",children:s.state}),e.jsx("span",{className:"demo-pm",children:s.mode})]},s.id))})]})]}),e.jsxs("div",{className:"demo-col",children:[e.jsxs("div",{className:"code demo-code",children:[e.jsxs("div",{className:"cbar",children:[e.jsxs("b",{children:[u.name.toLowerCase().replace(/ /g,"_"),".c"]}),e.jsx("span",{children:u.desc})]}),e.jsx("pre",{tabIndex:0,children:e.jsx("code",{children:u.code})})]}),e.jsxs("div",{className:"code demo-uart",children:[e.jsxs("div",{className:"cbar",children:[e.jsx("b",{children:"UART / Serial Output"}),e.jsxs("span",{className:"demo-state",children:[e.jsx("i",{className:a?"demo-live on ok":"demo-live","aria-hidden":"true"}),a?"LIVE":"IDLE"]})]}),e.jsxs("div",{ref:N,className:"demo-log",tabIndex:0,children:[P.length===0&&e.jsx("div",{className:"demo-empty",children:"Press Run to start simulation…"}),P.map(s=>e.jsxs("div",{className:`demo-ln ${s.level}`,children:[e.jsx("span",{className:"demo-ts",children:s.ts}),e.jsx("span",{className:"demo-msg",children:s.msg})]},s.id)),e.jsx("div",{ref:_})]})]})]})]})]}),e.jsx(v,{className:"demo-facts",children:e.jsx("ul",{className:"cards",children:[{title:`${w} Supported Boards`,desc:"STM32, ESP32, Raspberry Pi Pico, RISC-V, nRF52, i.MX RT and more, shown as board views. This is a visualisation, not an emulator."},{title:"Real Kernel on QEMU",desc:"For real execution, ebuild sim builds your code with the EoS kernel and boots it on QEMU's Cortex-M3 machine."},{title:"HIL Bridge Support",desc:"Connect EoSim to real hardware via the HIL bridge for hardware-in-the-loop testing workflows."}].map(s=>e.jsx("li",{children:e.jsxs("div",{className:"card",children:[e.jsx("h2",{className:"demo-fh",children:s.title}),e.jsx("p",{children:s.desc})]})},s.title))})})]})}export{A as default};
