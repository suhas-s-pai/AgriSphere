# Maps & Nearby — Frontend

The Maps & Nearby module is owned by Sharayu on the frontend.

## Included
- Interactive OpenStreetMap view using Leaflet loaded in the browser.
- Category filters for APMC/mandi, cold storage, agri inputs, and KVK/extension services.
- Search over the seeded map locations.
- Browser geolocation with a "Use my location" control.
- Clickable map markers and matching result cards.
- OpenStreetMap directions link for the selected location.
- API-ready seeded location structure so backend/database data can replace the demo points later.

## Integration note
The current locations are frontend seed/demo points for the Belagavi area. They should be replaced by the team's real database/API records when the backend endpoint is ready.

Leaflet is loaded from the public CDN at runtime, so no new npm dependency is required in the current frontend package.
