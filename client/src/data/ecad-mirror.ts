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

export const GUIDE_RUN = {
  boardFiles: 33,
  downloadedMB: 16,
  filesMB: 88,
  seconds: [5, 11],
  sizes: {
    beagleboneAi64: [102.5, 82.6, 36.6],
    pocketBeagle: [56.4, 35.0, 6.9],
    artemis: [10.5, 15.5, 1.8],
  },
} as const;

export function formatSize(mm: readonly number[], joiner = " × "): string {
  return mm.map(n => n.toFixed(1)).join(joiner);
}
