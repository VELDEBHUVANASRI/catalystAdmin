// Utility helpers for vendor document access and normalization
export const getDocument = (vendor, keys = []) => {
  if (!vendor) return null;
  for (const k of keys) {
    if (!k) continue;
    const val = vendor[k];
    if (val) return val;
  }
  return null;
};

// buildDataUrl supports two shapes:
// - string (assumed to be an URL)
// - object with { data, type, name } where data is base64
export const buildDataUrl = (document) => {
  if (!document) return null;
  if (typeof document === 'string') return document; // raw URL
  if (!document.data) return null;
  const type = document.type ? document.type.trim() : 'application/octet-stream';
  return `data:${type};base64,${document.data}`;
};
