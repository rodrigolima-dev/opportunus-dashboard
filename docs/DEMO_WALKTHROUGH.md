# Five-minute walkthrough

The application runs locally with fictional companies, profiles, contacts, orders, and metrics. Follow the [setup instructions](../README.md#executar-localmente), then open `/login`.

1. Select **Administração fictícia** and enter the local demo access key. The overview shows sample metrics for Aurora. Open [the overview image](images/overview.png) to see the same synthetic state without running the app.
2. Open `/crm` and `/pedidos` to inspect the read-only examples. The [CRM](images/crm.png) and [orders](images/orders.png) captures contain only fictional records. The operation page has a separate [sample view](images/operations.png).
3. Use **Empresas** to switch from Aurora to Horizonte. The server signs the new active tenant into the session. A request for the other tenant's `/api/tenants/:tenant/summary` returns `403`, even for a profile that belongs to both, until the active tenant is changed again.
4. Sign out and select **Leitura Aurora**. Horizonte is not offered as a selectable company. Opening `/api/tenants/horizonte/orders` directly still returns `403`; hiding a control in the interface is not the authorization boundary.
5. Run `npm run test:http` to repeat the allowed, denied, invalid-origin, oversized-body, logout, and private-cache checks without manual browser steps. Run `npm test` for session, membership, adapter, and aggregation tests.

## What the walkthrough demonstrates

Protected pages and read-only APIs share server-side checks for session validity, tenant membership, active selection, and route capability. The data comes from local fixtures through tenant adapters. No step contacts a customer system, performs a commercial mutation, or exercises a production identity provider. The shared-key login exists only for this offline demonstration.

The screenshots show one static sample state. Local execution and the tests establish the behavior described above; an image alone does not prove access control.
