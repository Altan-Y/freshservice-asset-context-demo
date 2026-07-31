# Feature parity

| Capability | Original production concept | Public demo |
|---|---:|---:|
| Requester-sidebar placement | Yes | Yes, manifest included |
| Freshworks app activation | Yes | Yes |
| Requester email lookup | Yes | Yes, from contact/ticket/requester |
| Loading, empty and error states | Yes | Yes |
| Compact Assets card | Yes | Yes |
| Asset count pill | Yes | Yes |
| ID, serial and warranty table | Yes | Yes |
| Clickable asset values | Yes | Local synthetic detail dialog |
| External asset-system authentication | Yes | No |
| Short-lived access-token cache | Yes | Documented only |
| External asset search API | Yes | No |
| Production field mapping | Yes | No, neutral public model |
| Real employee and ticket data | Yes | No |
| Real asset URLs | Yes | No |

## Visual parity review

The public widget intentionally retains the original visual measurements:

- 10 px card radius and 12 px card padding;
- 14 px bold title;
- outlined count pill;
- sticky muted table header;
- 13 px table values;
- alternating row background and hover state;
- blue links;
- compact spinner, empty state and red error state.

The surrounding ticket page is a neutral portfolio shell and is not a copy of Freshservice branding.
