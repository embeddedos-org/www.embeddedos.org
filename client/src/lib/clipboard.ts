/**
 * Copy text to the clipboard, reporting whether it actually worked.
 *
 * `navigator.clipboard` is unavailable on insecure origins and rejects when the
 * permission is denied, so calling `writeText` bare leaves an unhandled
 * rejection and a "Copied!" label that lies. Callers await this and only show
 * confirmation on `true`.
 *
 * @param text - the text to place on the clipboard
 * @returns `true` when the text reached the clipboard, `false` otherwise
 *
 * @example
 * if (await copyText(snippet)) setCopied(true);
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the legacy path below.
  }

  // Legacy fallback for insecure origins and browsers that deny the async API.
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}
