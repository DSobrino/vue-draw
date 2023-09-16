export function getExtensionFromMimeType(mimeType: string): string {
  return mimeType.split('/')[1];
}

export function generateDatetimeFilename(mimeType: string): string {
  const extension = getExtensionFromMimeType(mimeType);
  return `${new Date().toISOString()}.${extension}`;
}
