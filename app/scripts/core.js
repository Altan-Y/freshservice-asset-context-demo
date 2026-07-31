(function attachAssetContextCore(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.AssetContextCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createAssetContextCore() {
  'use strict';

  function normalizeEmail(value) {
    return String(value || '').trim().toLowerCase();
  }

  function firstNonEmpty(values) {
    for (const value of values || []) {
      if (value !== undefined && value !== null && String(value).trim() !== '') return value;
    }
    return '';
  }

  function fieldValue(field) {
    if (field && typeof field === 'object') {
      return field.value ?? field.name ?? field.label ?? '';
    }
    return field ?? '';
  }

  function formatDate(value, locale = 'de-DE') {
    const raw = String(value || '').trim();
    if (!raw) return '';
    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) return raw;
    return date.toLocaleDateString(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  function mapAsset(asset) {
    const source = asset || {};
    return {
      id: String(firstNonEmpty([source.assetId, source.id, fieldValue(source.fields?.assetId)]) || '—'),
      serial: String(firstNonEmpty([source.serial, source.serialNumber, fieldValue(source.fields?.serial)]) || '—'),
      warranty: formatDate(firstNonEmpty([source.warrantyUntil, source.warranty, fieldValue(source.fields?.warranty)])),
      employeeEmail: normalizeEmail(firstNonEmpty([
        source.currentEmployeeEmail,
        source.assignedTo,
        fieldValue(source.fields?.currentEmployee)
      ])),
      url: String(firstNonEmpty([source.url, source.shareUrl]) || '')
    };
  }

  function filterAssetsForRequester(assets, requesterEmail) {
    const normalizedRequester = normalizeEmail(requesterEmail);
    return (assets || [])
      .map(mapAsset)
      .filter((asset) => asset.employeeEmail && asset.employeeEmail === normalizedRequester);
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function getRequesterEmailFromPayload(payload) {
    return firstNonEmpty([
      payload?.contact?.email,
      payload?.ticket?.requester_email,
      payload?.requester?.email
    ]);
  }

  return {
    normalizeEmail,
    firstNonEmpty,
    fieldValue,
    formatDate,
    mapAsset,
    filterAssetsForRequester,
    escapeHtml,
    getRequesterEmailFromPayload
  };
});
