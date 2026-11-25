// Builds public/pdo.json: approximate zones for Greece's 33 wine PDOs.
// Island-wide zones use Natural Earth 10m coastlines; others are a buffered hull
// around the villages each appellation covers, clipped to land.
const turf = require('@turf/turf');
const fs = require('fs');

const BB = [19, 34.6, 30, 42];
const land = [];
for (const f of ['land10.geojson', 'minor.geojson']) {
  for (const ft of JSON.parse(fs.readFileSync(f)).features) {
    const c = turf.bboxClip(ft, BB);
    for (const p of turf.flatten(c).features) if (turf.area(p) > 1e5) land.push(p);
  }
}
const island = (lat, lng) => {
  const pt = turf.point([lng, lat]);
  const hit = land.find(p => turf.booleanPointInPolygon(pt, p));
  if (!hit) throw new Error('no island at ' + lat + ',' + lng);
  return hit;
};
const islands = pts => pts.map(([a, b]) => { try { return island(a, b); } catch (e) { console.warn('skip', e.message); return null; } }).filter(Boolean).reduce((u, p) => u ? turf.union(turf.featureCollection([u, p])) : p, null);
const onLand = g => {
  const box = turf.bbox(g);
  const near = land.filter(p => { const b = turf.bbox(p); return !(b[0] > box[2] || b[2] < box[0] || b[1] > box[3] || b[3] < box[1]); });
  let out = null;
  for (const p of near) {
    const i = turf.intersect(turf.featureCollection([g, p]));
    if (i) out = out ? turf.union(turf.featureCollection([out, i])) : i;
  }
  return out || g;
};
const zone = (pts, km, clip) => {
  const fc = turf.featureCollection(pts.map(([a, b]) => turf.point([b, a])));
  const hull = pts.length > 2 ? turf.convex(fc) : turf.buffer(fc.features[0], 0.5, { units: 'kilometers' });
  let g = turf.buffer(hull, km, { units: 'kilometers' });
  g = clip ? turf.intersect(turf.featureCollection([g, clip])) : onLand(g);
  return g;
};

const KEF = island(38.20, 20.55), RHO = island(36.20, 27.95);
const candiaPts = [[35.38, 24.96], [35.34, 25.13], [35.32, 25.36], [35.29, 25.46], [35.18, 25.40], [35.05, 25.30], [35.00, 25.15], [35.03, 24.95], [35.05, 24.80], [35.15, 24.85], [35.30, 24.95]];
const sitiaPts = [[35.21, 26.10], [35.18, 26.11], [35.13, 26.06], [35.15, 25.98], [35.07, 26.15], [35.22, 26.22], [35.06, 26.20]];
const patrasPts = [[38.25, 21.73], [38.30, 21.79], [38.25, 22.08], [38.16, 22.31], [38.03, 22.11], [38.12, 21.80], [38.14, 21.55], [38.06, 21.68]];
const patrasLow = [[38.14, 21.55], [38.25, 21.73], [38.30, 21.79], [38.25, 22.08], [38.12, 21.80]];

const P = [
  // id, name, Greek, region, styles, wines, geometry
  ['amyntaio', 'Amyntaio', 'Αμύνταιο', 'Macedonia', ['red', 'rose', 'sparkling'], 'Xinomavro reds, rosés and sparkling from a cool lake plateau', zone([[40.69, 21.68], [40.676, 21.52], [40.69, 21.62], [40.72, 21.74], [40.67, 21.72], [40.74, 21.64]], 3)],
  ['goumenissa', 'Goumenissa', 'Γουμένισσα', 'Macedonia', ['red'], 'Reds from Xinomavro with Negoska', zone([[40.95, 22.45], [40.93, 22.41], [40.98, 22.46], [40.97, 22.38], [40.94, 22.48]], 3)],
  ['naoussa', 'Naoussa', 'Νάουσα', 'Macedonia', ['red'], 'Xinomavro reds on the slopes of Mount Vermio', zone([[40.63, 22.07], [40.60, 22.01], [40.62, 22.10], [40.66, 22.12], [40.66, 22.18], [40.60, 22.08], [40.64, 22.15]], 3)],
  ['meliton', 'Slopes of Meliton', 'Πλαγιές Μελίτωνα', 'Macedonia', ['red', 'white'], 'Limnio–Cabernet reds and Athiri–Roditis–Assyrtiko whites, Sithonia', zone([[40.10, 23.78], [40.08, 23.79], [40.12, 23.79], [40.11, 23.82]], 4)],
  ['rapsani', 'Rapsani', 'Ραψάνη', 'Thessaly', ['red'], 'Xinomavro, Krassato and Stavroto reds on Mount Olympus', zone([[39.89, 22.56], [39.93, 22.61], [39.88, 22.52], [39.91, 22.58]], 3)],
  ['messenikola', 'Messenikola', 'Μεσενικόλα', 'Thessaly', ['red'], 'Reds from Mavro Messenikola with Carignan and Syrah', zone([[39.32, 21.76], [39.35, 21.78], [39.31, 21.71]], 3)],
  ['anchialos', 'Anchialos', 'Αγχίαλος', 'Thessaly', ['white'], 'Whites from Roditis and Savatiano', zone([[39.27, 22.82], [39.28, 22.77], [39.25, 22.79]], 3)],
  ['zitsa', 'Zitsa', 'Ζίτσα', 'Epirus', ['white', 'sparkling'], 'Debina whites and sparkling wines at 600–700 m', zone([[39.75, 20.65], [39.77, 20.65], [39.72, 20.68], [39.78, 20.60], [39.73, 20.66], [39.74, 20.70]], 3)],
  ['nemea', 'Nemea', 'Νεμέα', 'Peloponnese', ['red'], 'Agiorgitiko reds, dry and sweet', zone([[37.82, 22.66], [37.81, 22.71], [37.88, 22.55], [37.84, 22.62], [37.85, 22.56], [37.78, 22.60], [37.79, 22.55], [37.86, 22.60], [37.71, 22.75], [37.78, 22.77], [37.70, 22.70], [37.665, 22.776]], 3)],
  ['mantinia', 'Mantinia', 'Μαντινεία', 'Peloponnese', ['white', 'sparkling'], 'Moschofilero whites from a 650 m plateau', zone([[37.60, 22.37], [37.58, 22.40], [37.63, 22.45], [37.61, 22.46], [37.68, 22.30], [37.73, 22.39], [37.64, 22.34], [37.53, 22.37], [37.56, 22.45], [37.431, 22.47], [37.45, 22.42]], 3)],
  ['patras', 'Patras', 'Πάτρα', 'Peloponnese', ['white'], 'Dry Roditis whites from the hills of Achaia', zone(patrasPts, 3)],
  ['mavrodaphne-patras', 'Mavrodaphne of Patras', 'Μαυροδάφνη Πατρών', 'Peloponnese', ['sweet', 'red'], 'Sweet fortified Mavrodaphne reds', zone(patrasLow, 3)],
  ['muscat-patras', 'Muscat of Patras', 'Μοσχάτος Πατρών', 'Peloponnese', ['sweet'], 'Sweet white Muscat', zone(patrasLow, 3)],
  ['muscat-rio-patras', 'Muscat of Rio Patras', 'Μοσχάτος Ρίου Πατρών', 'Peloponnese', ['sweet'], 'Sweet white Muscat from the coast around Rio', zone([[38.30, 21.79], [38.26, 21.75], [38.28, 21.85], [38.32, 21.83]], 3)],
  ['monemvasia-malvasia', 'Monemvasia–Malvasia', 'Μονεμβασία–Malvasia', 'Peloponnese', ['sweet'], 'Sweet sun-dried Malvasia wines of south-east Laconia', zone([[36.69, 23.05], [36.72, 22.98], [36.80, 22.85], [36.75, 22.88], [36.51, 23.06]], 4)],
  ['robola', 'Robola of Kefalonia', 'Ρομπόλα Κεφαλληνίας', 'Ionian Islands', ['white'], 'Dry Robola whites from the mountains of Kefalonia', zone([[38.17, 20.58], [38.16, 20.59], [38.15, 20.56], [38.20, 20.60], [38.14, 20.67], [38.11, 20.62], [38.22, 20.55], [38.13, 20.50]], 4, KEF)],
  ['muscat-kefalonia', 'Muscat of Kefalonia', 'Μοσχάτος Κεφαλληνίας', 'Ionian Islands', ['sweet'], 'Sweet white Muscat', KEF],
  ['mavrodaphne-kefalonia', 'Mavrodaphne of Kefalonia', 'Μαυροδάφνη Κεφαλληνίας', 'Ionian Islands', ['sweet', 'red'], 'Sweet fortified Mavrodaphne reds', KEF],
  ['santorini', 'Santorini', 'Σαντορίνη', 'Aegean Islands', ['white', 'sweet'], 'Assyrtiko whites and Vinsanto from volcanic soils', islands([[36.40, 25.45], [36.44, 25.35]])],
  ['paros', 'Paros', 'Πάρος', 'Aegean Islands', ['white', 'red'], 'Monemvasia whites and Mandilaria–Monemvasia reds', island(37.07, 25.20)],
  ['malvasia-paros', 'Malvasia Paros', 'Malvasia Πάρος', 'Aegean Islands', ['sweet'], 'Sweet sun-dried Malvasia, Paros and Antiparos', islands([[37.07, 25.20], [37.02, 25.08]])],
  ['samos', 'Samos', 'Σάμος', 'Aegean Islands', ['sweet'], 'Sweet Muscat from mountain terraces', island(37.75, 26.83)],
  ['lemnos', 'Lemnos', 'Λήμνος', 'Aegean Islands', ['white', 'red'], 'Dry Muscat of Alexandria whites and Limnio reds', island(39.95, 25.20)],
  ['muscat-lemnos', 'Muscat of Lemnos', 'Μοσχάτος Λήμνου', 'Aegean Islands', ['sweet'], 'Sweet Muscat of Alexandria', island(39.95, 25.20)],
  ['rhodes', 'Rhodes', 'Ρόδος', 'Aegean Islands', ['white', 'red', 'sparkling'], 'Athiri whites and Mandilaria reds around Mount Attaviros', zone([[36.23, 27.86], [36.18, 27.76], [36.13, 27.73], [36.17, 27.86], [36.26, 27.84], [36.26, 27.94], [36.32, 28.07], [36.38, 28.10]], 3, RHO)],
  ['muscat-rhodes', 'Muscat of Rhodes', 'Μοσχάτος Ρόδου', 'Aegean Islands', ['sweet'], 'Sweet white Muscat', RHO],
  ['candia', 'Candia (Handakas)', 'Χάνδακας–Candia', 'Crete', ['white', 'red'], 'Vilana whites and Kotsifali–Mandilari reds across Heraklion', zone(candiaPts, 2)],
  ['malvasia-candia', 'Malvasia Candia', 'Malvasia Χάνδακας–Candia', 'Crete', ['sweet'], 'Sweet sun-dried Malvasia blends of Heraklion', zone(candiaPts, 2)],
  ['peza', 'Peza', 'Πεζά', 'Crete', ['white', 'red'], 'Vilana whites and Kotsifali–Mandilari reds', zone([[35.26, 25.21], [35.27, 25.19], [35.24, 25.21], [35.22, 25.19], [35.21, 25.15], [35.22, 25.22]], 2.5)],
  ['archanes', 'Archanes', 'Αρχάνες', 'Crete', ['red'], 'Kotsifali–Mandilari reds', zone([[35.24, 25.16], [35.21, 25.15], [35.25, 25.15]], 2.5)],
  ['dafnes', 'Dafnes', 'Δαφνές', 'Crete', ['red', 'sweet'], 'Liatiko reds, dry and sweet', zone([[35.22, 25.05], [35.20, 25.03], [35.19, 25.03], [35.23, 25.04], [35.23, 25.00]], 3)],
  ['sitia', 'Sitia', 'Σητεία', 'Crete', ['white', 'red', 'sweet'], 'Vilana–Thrapsathiri whites and Liatiko reds', zone(sitiaPts, 4)],
  ['malvasia-sitia', 'Malvasia Sitia', 'Malvasia Σητείας', 'Crete', ['sweet'], 'Sweet sun-dried Malvasia, aged 2+ years in oak', zone(sitiaPts, 4)],
];
if (P.length !== 33) throw new Error('expected 33, got ' + P.length);

const round = g => JSON.parse(JSON.stringify(g, (k, v) => typeof v === 'number' ? Math.round(v * 1e4) / 1e4 : v));
const out = P.map(([id, name, el, region, styles, wines, g], i) => {
  const s = turf.simplify(g, { tolerance: 0.002, highQuality: true });
  return { id, name, el, region, styles, wines, approx: !['santorini', 'paros', 'malvasia-paros', 'samos', 'lemnos', 'muscat-lemnos', 'muscat-kefalonia', 'mavrodaphne-kefalonia', 'muscat-rhodes'].includes(id), geometry: round(s.geometry) };
});
fs.writeFileSync(process.argv[2], JSON.stringify(out));
for (const z of out) console.log(z.id.padEnd(24), (turf.area(z.geometry) / 1e6).toFixed(0) + ' km2', z.geometry.type);
console.log('bytes', fs.statSync(process.argv[2]).size);
