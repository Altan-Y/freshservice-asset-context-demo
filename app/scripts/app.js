(() => {
  'use strict';

  const core = window.AssetContextCore;
  const root = document.querySelector('[data-asset-context-root]');
  if (!core || !root) return;

  const syntheticAssets = [
    {
      assetId: 'NB-1042',
      serial: 'C02X-7K2L-91QP',
      warrantyUntil: '2027-11-18',
      currentEmployeeEmail: 'alex.morgan@example.test',
      url: '#asset-NB-1042'
    },
    {
      assetId: 'MON-2217',
      serial: 'DEMO-48Q2-7Z91',
      warrantyUntil: '2028-03-02',
      currentEmployeeEmail: 'alex.morgan@example.test',
      url: '#asset-MON-2217'
    },
    {
      assetId: 'PHONE-0631',
      serial: 'SIM-2407-1182',
      warrantyUntil: '2026-09-30',
      currentEmployeeEmail: 'jamie.lee@example.test',
      url: '#asset-PHONE-0631'
    }
  ];

  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    void boot();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }

  async function boot() {
    renderStatus('loading', 'Lade Assets …');

    try {
      const requesterEmail = await resolveRequesterEmail();
      if (window.ASSET_CONTEXT_DEMO?.state === 'error' || new URLSearchParams(window.location.search).get('state') === 'error') {
        throw new Error('Die Demo-Datenquelle ist vorübergehend nicht erreichbar.');
      }

      await wait(420);
      const rows = core.filterAssetsForRequester(syntheticAssets, requesterEmail);
      renderAssets(rows);
      wireDemoLinks();
    } catch (error) {
      renderStatus('error', error instanceof Error ? error.message : String(error));
    }
  }

  async function resolveRequesterEmail() {
    if (typeof window.app !== 'undefined') {
      const client = await window.app.initialized();
      await activated(client);
      return getRequesterEmailFromFreshworks(client);
    }

    const params = new URLSearchParams(window.location.search);
    return params.get('requester') || window.ASSET_CONTEXT_DEMO?.requesterEmail || 'alex.morgan@example.test';
  }

  function activated(client) {
    return new Promise((resolve) => {
      let resolved = false;
      const done = () => {
        if (resolved) return;
        resolved = true;
        resolve();
      };
      client.events.on('app.activated', done);
      window.setTimeout(done, 300);
    });
  }

  async function safeDataGet(client, key) {
    try {
      const response = await client.data.get(key);
      return response?.[key];
    } catch {
      return undefined;
    }
  }

  async function getRequesterEmailFromFreshworks(client) {
    const payload = {
      contact: await safeDataGet(client, 'contact'),
      ticket: await safeDataGet(client, 'ticket'),
      requester: await safeDataGet(client, 'requester')
    };
    const email = core.getRequesterEmailFromPayload(payload);
    if (!email) throw new Error('Keine Requester-E-Mail im Ticket gefunden.');
    return email;
  }

  function renderStatus(state, message) {
    const safeMessage = core.escapeHtml(message || '');
    if (state === 'loading') {
      root.innerHTML = `
        <section class="asset-card" aria-live="polite">
          <div class="asset-row asset-row--center">
            <span class="asset-spinner" aria-hidden="true"></span>
            <span class="asset-muted">${safeMessage}</span>
          </div>
        </section>`;
      return;
    }

    root.innerHTML = `
      <section class="asset-card asset-card--error" role="alert">
        <div class="asset-title">Fehler</div>
        <pre class="asset-error-message">${safeMessage}</pre>
      </section>`;
  }

  function renderAssets(rows) {
    if (!rows.length) {
      root.innerHTML = `
        <section class="asset-card">
          <header class="asset-header">
            <div class="asset-title">Assets</div>
          </header>
          <div class="asset-empty">Keine Assets gefunden.</div>
        </section>`;
      return;
    }

    const tableRows = rows.map((row) => `
      <tr class="asset-table__row">
        <td class="asset-table__cell">${linkOrText(row.id, row.url)}</td>
        <td class="asset-table__cell asset-table__cell--strong">${linkOrText(row.serial, row.url)}</td>
        <td class="asset-table__cell">${linkOrText(row.warranty || '—', row.url)}</td>
      </tr>`).join('');

    root.innerHTML = `
      <section class="asset-card">
        <header class="asset-header">
          <div class="asset-title">Assets</div>
          <span class="asset-pill" aria-label="${rows.length} Assets">${rows.length}</span>
        </header>
        <div class="asset-table-wrap">
          <table class="asset-table">
            <thead>
              <tr>
                <th class="asset-table__head">ID</th>
                <th class="asset-table__head">Serial</th>
                <th class="asset-table__head">Warranty</th>
              </tr>
            </thead>
            <tbody>${tableRows}</tbody>
          </table>
        </div>
      </section>`;
  }

  function linkOrText(value, url) {
    const safeValue = core.escapeHtml(value);
    if (!url) return safeValue;
    return `<a class="asset-link" href="${core.escapeHtml(url)}" data-demo-asset-link>${safeValue}</a>`;
  }

  function wireDemoLinks() {
    root.querySelectorAll('[data-demo-asset-link]').forEach((link) => {
      link.addEventListener('click', (event) => {
        if (link.getAttribute('href')?.startsWith('#asset-')) {
          event.preventDefault();
          document.dispatchEvent(new CustomEvent('asset-context:open-demo-asset', {
            detail: { assetId: link.getAttribute('href').replace('#asset-', '') }
          }));
        }
      });
    });
  }

  function wait(milliseconds) {
    return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
  }
})();
