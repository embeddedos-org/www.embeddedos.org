export const ECAD_MIRROR_REPOSITORY =
  "https://github.com/embeddedos-org/eCAD-Hardware-Products";

export const ECAD_MIRROR_AS_OF = {
  date: "29 October 2026",
  commit: "23aa85309228858651820e0c2826932475cae64d",
} as const;

export const ECAD_MIRROR = {
  records: 336,
  ecosystems: 29,
  ecosystemsInIssue28: 31,
  unlicensedRecords: 80,
  pdfOnlyRecords: 2,
  boards: 254,
  cadFiles: 4022,
  gigabytes: "4.36",
  designSources: 1394,
  fabricationFiles: 2140,
  modelFiles: 488,
  eagleFiles: 748,
  stepBoards: 25,
  commercialReuseRecords: 256,
  licences: {
    ccBySa: 225,
    ccBy: 21,
    permissive: 7,
    zeroBsdGrant: 1,
  },
} as const;

export function formatCount(n: number): string {
  return n.toLocaleString("en-US");
}
