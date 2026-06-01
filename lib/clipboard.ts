export async function copyTextToClipboard(value: string): Promise<boolean> {
  if (!navigator.clipboard?.writeText) {
    return false;
  }

  await navigator.clipboard.writeText(value);
  return true;
}
