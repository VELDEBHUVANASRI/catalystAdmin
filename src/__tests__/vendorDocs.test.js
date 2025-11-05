import { getDocument, buildDataUrl } from '../lib/vendorDocs';

describe('vendorDocs adapter', () => {
  test('getDocument prefers keys in order and returns object', () => {
    const vendor = { panDocument: { name: 'pan.pdf', type: 'application/pdf', data: 'dGVzdA==' } };
    const doc = getDocument(vendor, ['panCard', 'panDocument', 'pan']);
    expect(doc).toBe(vendor.panDocument);
  });

  test('getDocument returns URL string when present', () => {
    const vendor = { panCard: 'https://example.com/pan.png' };
    const doc = getDocument(vendor, ['panCard', 'panDocument', 'pan']);
    expect(doc).toBe('https://example.com/pan.png');
  });

  test('getDocument returns null when none found', () => {
    const vendor = {};
    const doc = getDocument(vendor, ['panCard', 'panDocument', 'pan']);
    expect(doc).toBeNull();
  });

  test('buildDataUrl returns data URL for object with base64', () => {
    const document = { name: 'img.png', type: 'image/png', data: 'aGVsbG8=' };
    const url = buildDataUrl(document);
    expect(url).toBe('data:image/png;base64,aGVsbG8=');
  });

  test('buildDataUrl returns raw URL string as-is', () => {
    const urlString = 'https://cdn.example.com/doc.pdf';
    const url = buildDataUrl(urlString);
    expect(url).toBe(urlString);
  });
});
