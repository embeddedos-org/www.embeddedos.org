# PR #92 media spot-check, 2026-10-18

These are re-renders of three `/open-hardware` images, made from their source files on
eCAD-Hardware-Products master `0e543f053ef95a91999240781ddd651768790ced`. Each one uses a different
tool from the one the page used. The PR author's side made them. They support the reviewer's check
but do not replace it. In each PNG the left panel is the page JPEG, unchanged. The right panel is
the re-render, scaled to the same height.

| PNG | Page image (page's tool) | Re-render |
|---|---|---|
| `1-redboard-rp2350-kicad.png` | `open-hardware-kicad-redboard-rp2350.jpg` (KiCanvas) | kicad-cli 10.0.6 |
| `2-sparkfun-edge-gerber-top.png` | `open-hardware-gerber-edge-top.jpg` (pcb-stackup) | gerbonara 1.6.3 + cairosvg 2.9.1 |
| `3-beaglebone-ai-64-step-kicad.png` | `open-hardware-3d-beaglebone-ai-64.jpg` (occt-import-js + three.js) | kicad-cli 10.0.6 `pcb render` |
| `4-beaglebone-ai-64-step-no-occt.png` | same | STEP text parsed in Python, no CAD kernel |

## Commands

Paths are relative to the eCAD checkout.

**1. RedBoard.** `B=boards/cad/sparkfun/iot-redboard-rp2350/cad/Hardware/SparkFun_IoT_RedBoard-RP2350.kicad_pcb`

```sh
kicad-cli pcb export svg --mode-single --layers F.Cu,Edge.Cuts --exclude-drawing-sheet \
  --fit-page-to-board --drill-shape-opt 2 -o redboard_fcu.svg "$B"
python -c "import cairosvg; cairosvg.svg2png(url='redboard_fcu.svg', write_to='redboard_fcu.png', output_width=1600, background_color='#0b1220')"
kicad-cli pcb export drill --excellon-separate-th --excellon-units mm -o drill/ "$B"
```

For the hole check, each hit in `-NPTH.drl` and `-PTH.drl` was mapped onto the page image through
the Edge.Cuts box (x 115.58 to 184.16 mm, y 66.05 to 124.47 mm). The script then looked for the hole
disc or the gold pad at that spot.

**2. Edge Gerbers.** `pip install gerbonara==1.6.3 cairosvg numpy scipy pillow`

1. `gerbonara.layers.LayerStack.open('boards/cad/sparkfun/edge/cad/Hardware/SparkFun_TensorFlow_Ambiq_Apollo3-Gerbers')` reads the folder.
2. Each of these becomes its own SVG through `svg_objects()` or `outline_svg_d()`: top copper, top
   mask, top silk, the outline and the drill file.
3. cairosvg rasterises each SVG at 1,400 px.
4. numpy stacks the rasters: mask, then copper under the mask, then exposed copper, then silk, then holes.

`gerbonara render --top` draws its colours with SVG filters, which cairosvg ignores. That is why the
layers were stacked by hand. For the hole check, `scipy.ndimage.label` found the dark regions in both
images, and each region was paired with the nearest centre in the other image.

**3. BeagleBone AI-64 STEP.**

A throwaway `.kicad_pcb` holds one footprint, `(at 100 100)`. Its `model` is
`boards/cad/beagleboard/beaglebone-ai-64/cad/hw/BeagleBone_AI-64_Rev_B1_3D_220826.stp`, with
`(offset (xyz -228.165 -243.29 0.5))`. The file also has a 1.0 mm thick, 76 x 56 mm Edge.Cuts
rectangle, which sits inside the model's own 102.5 x 80 mm PCB and is hidden by it.

```sh
kicad-cli pcb render --width 1600 --height 1000 --zoom 0.55 --rotate '-50,0,-23' --perspective \
  --quality high --background opaque -o kicad_iso.png bbai64_step_holder.kicad_pcb
```

KiCad's STEP plugin is also OpenCASCADE (7.9.3), so PNG 4 reads the file without a CAD kernel. A
Python script walks `NEXT_ASSEMBLY_USAGE_OCCURRENCE` and `ITEM_DEFINED_TRANSFORMATION`, collects
every `EDGE_CURVE` and draws the edges with Pillow at azimuth -23 deg, elevation 40 deg. Lines are
drawn exactly, circles are sampled from their definition, and any other curve becomes a chord. The
colours quoted in PNG 3 come from the same parse. They were read per part from `STYLED_ITEM`,
`OVER_RIDING_STYLED_ITEM` and `COLOUR_RGB`.
