# Architecture

```mermaid
flowchart LR
    Ticket[Service ticket] --> Context[Freshworks app client]
    Context --> Email[Requester email]
    Email --> App[Asset context controller]
    App --> Repo[Public synthetic asset repository]
    Repo --> Filter[Requester assignment filter]
    Filter --> Widget[Compact requester sidebar widget]
```

## Public demo runtime

The same UI can run in two contexts:

1. **Freshworks context** — the app waits for activation and reads `contact`, `ticket` or `requester` data through the platform client.
2. **Standalone preview** — a fictional requester email is supplied by the preview shell.

The public asset repository is an in-memory synthetic dataset. It deliberately has no external network dependency.

## Original production concept

The internal concept extended the controller with an external asset gateway:

```mermaid
flowchart LR
    Email[Requester email] --> Token[Token request via request template]
    Token --> Cache[Short-lived token cache]
    Cache --> Search[External asset search request]
    Search --> Map[Field mapping]
    Map --> Filter[Current employee match]
    Filter --> Widget[Asset table]
```

Production API templates, credentials, field identifiers and asset-system URLs are not published.

## Separation of concerns

- `core.js`: normalization, field mapping, filtering and date formatting;
- `app.js`: platform activation, requester lookup, loading/error/empty states and rendering;
- `style.css`: compact sidebar appearance matching the original app;
- `preview/`: generic service-desk shell for portfolio presentation only.
