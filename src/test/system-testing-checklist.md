# System Testing Checklist

## FUNC-Marker-Accuracy-01: Marker Position Accuracy

- Run `npm test`.
- Expected: `worldToMap` correctly applies affine transformation coefficients.
- Expected: Marker coordinates are converted from world to map coordinates (rounded).
- Expected: Negative coordinates handled correctly.

## FUNC-Marker-Accuracy-02: Marker Name/Desc Accuracy

- Run `npm test`.
- Expected: Extract markers use exact name from API.
- Expected: Transit markers use description from API; name derived from target map.
- Expected: Boss spawn markers include zone name; non-boss spawns excluded.

## FUNC-Marker-Accuracy-03: Marker Search/Filter Correctness

- Run `npm test`.
- Expected: Text search matches name, description, and tags (case-insensitive).
- Expected: Type filter returns only selected marker types.
- Expected: Approximate filter excludes approximate markers when disabled.
- Expected: Hidden markers always excluded.

## USAB-Map-Controls-01: Map Panning

- Start site.
- Click+drag in each direction.
- Expected: Map pans; markers pan with it. :contentReference\[oaicite:11\]{index=11}
- Drag to each edge.
- Expected: Cannot pan beyond map image bounds.

## USAB-Map-Controls-02: Map Zoom In/Out

- Start site.
- Mouse over map; zoom in/out until stop.
- Expected: Zoom works; has a stopping point; markers move with zoom.

## USAB-Map-Controls-03: Map Recentering

- Start site; note default view.
- Press recenter without moving.
- Move to corners; press recenter.
- Expected: Map and markers return to default view.

## SEC-System-Hardening-01: XSS Manual Attempt

- In Search input and any URL parameters used, try:
  - &lt;script&gt;alert(1)&lt;/script&gt;
  - "&gt;&lt;img src=x onerror=alert(1)&gt;
- Expected: No script executes; treated as text; app stable.

## SEC-System-Hardening-02: Package Vulnerability

- Run `npm audit`.
- Review any lasting vulnerabilities.
  - If any, consider adhering to follow up messages in terminal from Node.

## SEC-System-Hardening-03: Network Safety

- Open DevTools -&gt; Network tab; refresh the page.
- Expected: All requests use HTTPS; no mixed content warnings in console.