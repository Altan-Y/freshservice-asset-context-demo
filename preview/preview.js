(() => {
  'use strict';
  const dialog = document.querySelector('[data-asset-detail]');
  const title = document.querySelector('[data-asset-detail-title]');

  document.addEventListener('asset-context:open-demo-asset', (event) => {
    if (!dialog || !title) return;
    title.textContent = event.detail?.assetId || 'Asset';
    dialog.showModal();
  });

  document.querySelector('[data-close-dialog]')?.addEventListener('click', () => dialog?.close());
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
})();
