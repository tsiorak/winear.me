// Builds public/areas-europe.json: approximate outlines of well-known wine areas
// across Europe (Greece has its own file, pdo.json, from build-pdo.js).
// Each area is a buffered hull ('h') or buffered line along a river/slope ('l')
// through real village coordinates, then clipped to its country's land
// (world-atlas countries-10m, Natural Earth 1:10m).
// Run: npm i @turf/turf world-atlas topojson-client && node build-areas-europe.js ../public/areas-europe.json
const turf = require('@turf/turf');
const topo = require('topojson-client');
const fs = require('fs');
const world = require('world-atlas/countries-10m.json');
const COUNTRY = {}; // our name -> Natural Earth name
for (const n of ['France', 'Italy', 'Spain', 'Portugal', 'Germany', 'Austria', 'Switzerland', 'Hungary', 'Slovenia', 'Croatia', 'Serbia', 'Bulgaria', 'Romania', 'Moldova', 'Georgia', 'Armenia', 'Cyprus', 'United Kingdom', 'Luxembourg', 'Czechia', 'Slovakia', 'Montenegro', 'Albania', 'Ukraine', 'Malta']) COUNTRY[n] = n;
COUNTRY['North Macedonia'] = 'Macedonia';
COUNTRY['Bosnia and Herzegovina'] = 'Bosnia and Herz.';
const shapes = {};
for (const f of topo.feature(world, world.objects.countries).features) shapes[f.properties.name] = f;

// [id, name, local name, kind, country, region, styles, wines, parts]; part = [type, km, [[lat,lng],...]]
const A = [
  // ---------- France ----------
  ['champagne', 'Champagne', 'Champagne', 'AOC', 'France', 'Champagne', ['champagne'], 'Traditional-method sparkling from Chardonnay, Pinot Noir and Meunier', [
    ['h', 3, [[49.27, 3.90], [49.25, 4.03], [49.20, 4.10], [49.08, 4.10], [49.04, 3.96], [48.91, 4.00], [48.85, 3.90], [49.10, 3.65]]],
    ['l', 3, [[49.08, 3.65], [49.06, 3.50], [49.05, 3.40]]],
    ['h', 3, [[48.72, 3.72], [48.65, 3.65], [48.70, 3.78]]],
    ['h', 3, [[48.23, 4.70], [48.20, 4.55], [48.11, 4.38], [47.99, 4.37], [48.05, 4.55]]]]],
  ['chablis', 'Chablis', 'Chablis', 'AOC', 'France', 'Burgundy', ['white'], 'Mineral Chardonnay on Kimmeridgian limestone', [['h', 3, [[47.81, 3.80], [47.86, 3.78], [47.75, 3.72], [47.83, 3.90], [47.76, 3.85]]]]],
  ['cote-de-nuits', 'Côte de Nuits', 'Côte de Nuits', '', 'France', 'Burgundy', ['red'], 'Grand cru Pinot Noir: Gevrey-Chambertin, Vosne-Romanée, Chambolle-Musigny', [['l', 2, [[47.28, 4.99], [47.23, 4.97], [47.17, 4.95], [47.14, 4.95], [47.10, 4.90]]]]],
  ['cote-de-beaune', 'Côte de Beaune', 'Côte de Beaune', '', 'France', 'Burgundy', ['white', 'red'], 'Meursault and Montrachet Chardonnay, Volnay and Pommard Pinot Noir', [['l', 2.5, [[47.08, 4.90], [47.05, 4.86], [47.02, 4.84], [46.99, 4.78], [46.98, 4.77], [46.94, 4.73], [46.91, 4.69]]]]],
  ['cote-chalonnaise', 'Côte Chalonnaise', 'Côte Chalonnaise', '', 'France', 'Burgundy', ['red', 'white', 'sparkling'], 'Mercurey, Givry, Rully and Crémant de Bourgogne', [['l', 3, [[46.88, 4.72], [46.87, 4.74], [46.84, 4.72], [46.78, 4.74], [46.71, 4.67]]]]],
  ['maconnais', 'Mâconnais', 'Mâconnais', '', 'France', 'Burgundy', ['white'], 'Chardonnay incl. Pouilly-Fuissé and Saint-Véran', [['h', 3, [[46.56, 4.91], [46.45, 4.80], [46.31, 4.83], [46.28, 4.75], [46.22, 4.74], [46.40, 4.70]]]]],
  ['beaujolais', 'Beaujolais', 'Beaujolais', 'AOC', 'France', 'Burgundy', ['red'], 'Gamay, from Nouveau to the ten crus such as Morgon and Fleurie', [['h', 4, [[46.21, 4.72], [46.19, 4.70], [46.15, 4.67], [46.10, 4.67], [45.99, 4.72], [45.92, 4.58], [45.94, 4.72]]]]],
  ['medoc', 'Médoc', 'Médoc', '', 'France', 'Bordeaux', ['red'], 'Cabernet-led reds: Margaux, Saint-Julien, Pauillac, Saint-Estèphe', [['l', 3.5, [[44.91, -0.64], [45.04, -0.67], [45.16, -0.74], [45.20, -0.75], [45.26, -0.77], [45.33, -0.82], [45.40, -0.90]]], ['h', 3, [[45.07, -0.79], [45.06, -0.76], [45.04, -0.70]]]]],
  ['saint-emilion-pomerol', 'Saint-Émilion & Pomerol', 'Saint-Émilion, Pomerol', 'AOC', 'France', 'Bordeaux', ['red'], 'Merlot and Cabernet Franc reds of the Right Bank', [['h', 2, [[44.92, -0.24], [44.93, -0.20], [44.89, -0.16], [44.95, -0.20], [44.93, -0.11], [44.86, -0.12], [44.88, -0.22]]]]],
  ['pessac-graves', 'Pessac-Léognan & Graves', 'Pessac-Léognan, Graves', 'AOC', 'France', 'Bordeaux', ['red', 'white'], 'Gravelly Left Bank reds and Sauvignon–Sémillon whites', [['l', 3, [[44.80, -0.63], [44.73, -0.60], [44.71, -0.55], [44.70, -0.42], [44.65, -0.36], [44.55, -0.25]]]]],
  ['sauternes', 'Sauternes & Barsac', 'Sauternes, Barsac', 'AOC', 'France', 'Bordeaux', ['sweet'], 'Botrytised sweet Sémillon and Sauvignon Blanc', [['h', 2, [[44.61, -0.32], [44.53, -0.34], [44.56, -0.37], [44.58, -0.30], [44.54, -0.29]]]]],
  ['entre-deux-mers', 'Entre-Deux-Mers', 'Entre-Deux-Mers', 'AOC', 'France', 'Bordeaux', ['white', 'red'], 'Fresh Sauvignon–Sémillon whites between the Garonne and Dordogne', [['h', 2, [[44.83, -0.45], [44.78, -0.30], [44.70, -0.20], [44.64, -0.10], [44.70, 0.05], [44.80, 0.05], [44.83, -0.15]]]]],
  ['sancerre', 'Sancerre & Pouilly-Fumé', 'Sancerre, Pouilly-Fumé', 'AOC', 'France', 'Loire', ['white'], 'Sauvignon Blanc on flint and limestone', [['h', 4, [[47.33, 2.84], [47.31, 2.79], [47.28, 2.95], [47.34, 2.82], [47.24, 2.97]]]]],
  ['vouvray', 'Vouvray & Montlouis', 'Vouvray, Montlouis-sur-Loire', 'AOC', 'France', 'Loire', ['white', 'sparkling', 'sweet'], 'Chenin Blanc from dry to sweet and sparkling', [['h', 3, [[47.41, 0.80], [47.44, 0.78], [47.42, 0.86], [47.39, 0.83], [47.37, 0.88]]]]],
  ['chinon-bourgueil', 'Chinon & Bourgueil', 'Chinon, Bourgueil', 'AOC', 'France', 'Loire', ['red'], 'Cabernet Franc reds of Touraine', [['h', 3, [[47.17, 0.24], [47.28, 0.17], [47.27, 0.25], [47.15, 0.30], [47.20, 0.12]]]]],
  ['saumur', 'Saumur', 'Saumur', 'AOC', 'France', 'Loire', ['red', 'sparkling', 'white'], 'Saumur-Champigny reds and Crémant de Loire', [['h', 3, [[47.26, -0.08], [47.22, -0.05], [47.15, -0.15], [47.20, -0.20], [47.25, 0.00]]]]],
  ['anjou', 'Anjou: Layon & Savennières', 'Coteaux du Layon, Savennières', 'AOC', 'France', 'Loire', ['white', 'sweet'], 'Chenin Blanc, bone-dry Savennières to sweet Quarts de Chaume', [['h', 3, [[47.38, -0.66], [47.36, -0.66], [47.32, -0.63], [47.29, -0.45], [47.27, -0.50], [47.24, -0.60]]]]],
  ['muscadet', 'Muscadet Sèvre et Maine', 'Muscadet Sèvre et Maine', 'AOC', 'France', 'Loire', ['white'], 'Melon de Bourgogne whites aged on the lees', [['h', 4, [[47.16, -1.27], [47.09, -1.28], [47.14, -1.34], [47.17, -1.47], [47.14, -1.42]]]]],
  ['alsace', 'Alsace', 'Alsace', 'AOC', 'France', 'Alsace', ['white', 'sweet', 'sparkling'], 'Riesling, Gewurztraminer and Pinot Gris on the Vosges foothills', [['l', 3, [[48.62, 7.49], [48.54, 7.49], [48.41, 7.45], [48.30, 7.40], [48.19, 7.32], [48.14, 7.26], [48.08, 7.29], [48.04, 7.31], [47.91, 7.21], [47.81, 7.10]]]]],
  ['northern-rhone', 'Northern Rhône', 'Côte-Rôtie, Condrieu, Hermitage, Cornas', '', 'France', 'Rhône', ['red', 'white'], 'Syrah from Côte-Rôtie to Cornas, Viognier from Condrieu', [['l', 3, [[45.49, 4.81], [45.46, 4.77], [45.42, 4.73], [45.30, 4.78], [45.19, 4.80], [45.07, 4.85], [44.96, 4.85], [44.94, 4.84]]]]],
  ['chateauneuf', 'Châteauneuf-du-Pape', 'Châteauneuf-du-Pape', 'AOC', 'France', 'Rhône', ['red'], 'Grenache-led blends on large galet stones', [['h', 1.5, [[44.06, 4.83], [44.08, 4.86], [44.03, 4.86], [44.05, 4.80], [44.10, 4.84]]]]],
  ['southern-rhone', 'Southern Rhône villages', 'Gigondas, Vacqueyras, Rasteau', '', 'France', 'Rhône', ['red', 'rose'], 'Grenache–Syrah reds from Gigondas, Vacqueyras, Rasteau', [['h', 3, [[44.31, 4.70], [44.27, 4.99], [44.13, 5.08], [44.03, 4.98], [43.95, 4.80], [44.05, 4.70], [44.20, 4.67]]]]],
  ['tavel', 'Tavel', 'Tavel', 'AOC', 'France', 'Rhône', ['rose'], 'France\'s historic dry rosé', [['h', 2, [[43.98, 4.70], [44.01, 4.70], [44.02, 4.66], [43.96, 4.66]]]]],
  ['provence', 'Côtes de Provence', 'Côtes de Provence', 'AOC', 'France', 'Provence', ['rose', 'red'], 'Pale dry rosé from Grenache, Cinsault and Syrah', [['h', 4, [[43.50, 5.70], [43.45, 6.05], [43.43, 6.45], [43.45, 6.75], [43.23, 6.55], [43.15, 6.25], [43.25, 5.95], [43.35, 5.75]]]]],
  ['bandol', 'Bandol', 'Bandol', 'AOC', 'France', 'Provence', ['red', 'rose'], 'Mourvèdre reds and rosés above the sea', [['h', 2, [[43.14, 5.75], [43.16, 5.80], [43.20, 5.78], [43.19, 5.70], [43.15, 5.72]]]]],
  ['languedoc', 'Languedoc', 'Languedoc', 'AOC', 'France', 'Languedoc-Roussillon', ['red', 'white', 'rose'], 'Pic Saint-Loup, Faugères, Saint-Chinian, Minervois, Corbières', [['h', 4, [[43.78, 3.80], [43.57, 3.18], [43.42, 2.95], [43.32, 2.65], [43.05, 2.70], [42.89, 2.97], [43.18, 3.00], [43.46, 3.42], [43.70, 4.05]]]]],
  ['limoux', 'Limoux', 'Limoux', 'AOC', 'France', 'Languedoc-Roussillon', ['sparkling', 'white'], 'Blanquette and Crémant de Limoux, among the oldest sparkling wines', [['h', 4, [[43.05, 2.22], [43.10, 2.25], [42.98, 2.15], [43.00, 2.30]]]]],
  ['roussillon', 'Roussillon', 'Roussillon', 'AOC', 'France', 'Languedoc-Roussillon', ['red', 'sweet'], 'Grenache reds and fortified Banyuls, Maury and Rivesaltes', [['h', 4, [[42.85, 2.50], [42.80, 2.95], [42.48, 3.13], [42.55, 2.85], [42.60, 2.70], [42.75, 2.45]]]]],
  ['cahors', 'Cahors', 'Cahors', 'AOC', 'France', 'South West', ['red'], 'Dark Malbec reds along the Lot valley', [['l', 4, [[44.45, 1.44], [44.50, 1.35], [44.50, 1.25], [44.48, 1.10]]]]],
  ['bergerac', 'Bergerac & Monbazillac', 'Bergerac, Monbazillac', 'AOC', 'France', 'South West', ['red', 'white', 'sweet'], 'Bordeaux-style reds and sweet Monbazillac', [['h', 5, [[44.85, 0.48], [44.80, 0.49], [44.83, 0.30], [44.86, 0.65]]]]],
  ['madiran', 'Madiran', 'Madiran', 'AOC', 'France', 'South West', ['red'], 'Powerful Tannat reds', [['h', 5, [[43.55, -0.06], [43.50, -0.05], [43.60, -0.10]]]]],
  ['jurancon', 'Jurançon', 'Jurançon', 'AOC', 'France', 'South West', ['sweet', 'white'], 'Sweet and dry Petit and Gros Manseng', [['h', 4, [[43.25, -0.40], [43.30, -0.45], [43.20, -0.45], [43.27, -0.33]]]]],
  ['jura', 'Jura', 'Jura', 'AOC', 'France', 'Jura & Savoie', ['white', 'sweet', 'red'], 'Vin jaune, vin de paille, Savagnin and Poulsard', [['l', 4, [[46.94, 5.88], [46.90, 5.77], [46.84, 5.71], [46.75, 5.63], [46.68, 5.54], [46.55, 5.45], [46.43, 5.34]]]]],
  ['savoie', 'Savoie', 'Savoie', 'AOC', 'France', 'Jura & Savoie', ['white'], 'Alpine Jacquère, Altesse and Mondeuse', [['l', 4, [[45.52, 6.00], [45.60, 6.06], [45.75, 5.92], [45.88, 5.80], [45.96, 5.83]]]]],
  ['patrimonio', 'Patrimonio', 'Patrimonio', 'AOC', 'France', 'Corsica', ['red', 'white', 'rose'], 'Corsican Nielluccio reds and Vermentino whites', [['h', 3, [[42.70, 9.36], [42.68, 9.30], [42.64, 9.28]]]]],
  // ---------- Italy ----------
  ['barolo', 'Barolo', 'Barolo', 'DOCG', 'Italy', 'Piedmont', ['red'], 'Nebbiolo reds, the "king of wines", from the Langhe', [['h', 1.5, [[44.64, 7.93], [44.61, 7.94], [44.58, 7.97], [44.61, 8.00], [44.62, 7.97], [44.65, 7.99], [44.67, 7.93], [44.59, 7.93]]]]],
  ['barbaresco', 'Barbaresco', 'Barbaresco', 'DOCG', 'Italy', 'Piedmont', ['red'], 'Elegant Nebbiolo reds above the Tanaro', [['h', 1.5, [[44.73, 8.08], [44.73, 8.12], [44.69, 8.09], [44.70, 8.06]]]]],
  ['asti', 'Asti & Moscato d\'Asti', 'Asti, Moscato d\'Asti', 'DOCG', 'Italy', 'Piedmont', ['sparkling', 'sweet', 'red'], 'Sweet sparkling Moscato and Barbera d\'Asti reds', [['h', 3, [[44.72, 8.29], [44.71, 8.23], [44.90, 8.21], [44.77, 8.36], [44.68, 8.47], [44.72, 8.19]]]]],
  ['gavi', 'Gavi', 'Gavi', 'DOCG', 'Italy', 'Piedmont', ['white'], 'Crisp Cortese whites', [['h', 3, [[44.69, 8.81], [44.74, 8.80], [44.67, 8.86], [44.71, 8.75]]]]],
  ['franciacorta', 'Franciacorta', 'Franciacorta', 'DOCG', 'Italy', 'Lombardy', ['sparkling'], 'Italy\'s top traditional-method sparkling', [['h', 2.5, [[45.60, 9.97], [45.66, 10.05], [45.56, 10.00], [45.59, 10.16], [45.62, 9.96]]]]],
  ['valtellina', 'Valtellina', 'Valtellina', 'DOCG', 'Italy', 'Lombardy', ['red'], 'Alpine Nebbiolo (Chiavennasca) and Sforzato', [['l', 2, [[46.13, 9.57], [46.17, 9.87], [46.22, 10.17]]]]],
  ['soave', 'Soave', 'Soave', 'DOC', 'Italy', 'Veneto', ['white'], 'Garganega whites on volcanic hills', [['h', 3, [[45.42, 11.25], [45.45, 11.20], [45.47, 11.30], [45.40, 11.30]]]]],
  ['valpolicella', 'Valpolicella & Amarone', 'Valpolicella', 'DOC', 'Italy', 'Veneto', ['red', 'sweet'], 'Corvina reds, dried-grape Amarone and sweet Recioto', [['h', 2, [[45.53, 10.94], [45.54, 10.88], [45.52, 10.89], [45.55, 10.92], [45.52, 10.83], [45.52, 11.02], [45.47, 11.18]]]]],
  ['prosecco', 'Prosecco Conegliano Valdobbiadene', 'Conegliano Valdobbiadene Prosecco', 'DOCG', 'Italy', 'Veneto', ['sparkling'], 'Glera sparkling from steep hills', [['h', 2, [[45.90, 12.00], [45.89, 12.30], [45.98, 12.30], [45.90, 12.17], [45.95, 12.12]]]]],
  ['alto-adige', 'Alto Adige', 'Alto Adige / Südtirol', 'DOC', 'Italy', 'Trentino-Alto Adige', ['white', 'red'], 'Alpine Pinot Grigio, Gewürztraminer, Lagrein and Schiava', [['l', 3, [[46.24, 11.21], [46.34, 11.24], [46.41, 11.24], [46.50, 11.35], [46.60, 11.20], [46.67, 11.16]]], ['l', 2.5, [[46.55, 11.48], [46.71, 11.65]]]]],
  ['trentodoc', 'Trento', 'Trento DOC', 'DOC', 'Italy', 'Trentino-Alto Adige', ['sparkling', 'white'], 'Mountain traditional-method sparkling', [['l', 3, [[45.76, 11.00], [45.89, 11.04], [46.07, 11.12], [46.21, 11.12]]]]],
  ['collio', 'Collio', 'Collio Goriziano', 'DOC', 'Italy', 'Friuli', ['white', 'amber'], 'Friulano and Ribolla whites; skin-contact orange wines at Oslavia', [['h', 2, [[45.96, 13.47], [45.98, 13.59], [46.03, 13.48], [45.94, 13.51], [45.96, 13.60]]]]],
  ['chianti-classico', 'Chianti Classico', 'Chianti Classico', 'DOCG', 'Italy', 'Tuscany', ['red'], 'Sangiovese reds between Florence and Siena', [['h', 3, [[43.66, 11.18], [43.58, 11.32], [43.47, 11.29], [43.45, 11.20], [43.55, 11.21], [43.49, 11.37], [43.47, 11.43], [43.35, 11.50], [43.55, 11.32]]]]],
  ['brunello', 'Brunello di Montalcino', 'Brunello di Montalcino', 'DOCG', 'Italy', 'Tuscany', ['red'], 'Long-lived 100% Sangiovese', [['h', 2, [[43.06, 11.49], [42.98, 11.45], [42.99, 11.53], [43.09, 11.55], [43.02, 11.41]]]]],
  ['montepulciano', 'Vino Nobile di Montepulciano', 'Vino Nobile di Montepulciano', 'DOCG', 'Italy', 'Tuscany', ['red'], 'Prugnolo Gentile (Sangiovese) reds', [['h', 2, [[43.10, 11.79], [43.13, 11.83], [43.06, 11.85], [43.09, 11.74]]]]],
  ['bolgheri', 'Bolgheri', 'Bolgheri', 'DOC', 'Italy', 'Tuscany', ['red'], 'The coastal home of the Super Tuscans', [['h', 3, [[43.16, 10.61], [43.24, 10.62], [43.17, 10.57], [43.20, 10.66]]]]],
  ['montefalco', 'Montefalco Sagrantino', 'Montefalco Sagrantino', 'DOCG', 'Italy', 'Umbria', ['red', 'sweet'], 'Tannic Sagrantino, dry and passito', [['h', 3, [[42.89, 12.65], [42.93, 12.62], [42.86, 12.62], [42.90, 12.70]]]]],
  ['verdicchio', 'Verdicchio dei Castelli di Jesi', 'Verdicchio dei Castelli di Jesi', 'DOC', 'Italy', 'Marche', ['white'], 'Verdicchio whites from the Marche hills', [['h', 3, [[43.45, 13.12], [43.43, 13.18], [43.52, 13.24], [43.53, 13.06], [43.54, 13.04]]]]],
  ['lambrusco', 'Lambrusco', 'Lambrusco di Sorbara, Grasparossa', 'DOC', 'Italy', 'Emilia-Romagna', ['red', 'sparkling'], 'Fizzy red Lambrusco around Modena', [['h', 5, [[44.72, 11.00], [44.51, 10.95], [44.70, 10.63], [44.55, 10.75]]]]],
  ['irpinia', 'Irpinia: Taurasi, Fiano, Greco', 'Taurasi, Fiano di Avellino, Greco di Tufo', 'DOCG', 'Italy', 'Campania', ['red', 'white'], 'Aglianico reds and Fiano and Greco whites', [['h', 4, [[41.01, 14.96], [41.05, 14.90], [40.95, 14.82], [40.98, 15.02], [41.07, 14.85]]]]],
  ['primitivo-manduria', 'Primitivo di Manduria', 'Primitivo di Manduria', 'DOC', 'Italy', 'Puglia', ['red'], 'Rich Primitivo reds of Salento', [['h', 5, [[40.40, 17.63], [40.45, 17.55], [40.35, 17.70], [40.38, 17.50]]]]],
  ['etna', 'Etna', 'Etna', 'DOC', 'Italy', 'Sicily', ['red', 'white'], 'Nerello Mascalese and Carricante on the volcano\'s slopes', [['l', 3, [[37.79, 14.83], [37.88, 14.95], [37.87, 15.05], [37.84, 15.14], [37.72, 15.12], [37.66, 15.14], [37.61, 15.10], [37.64, 14.87]]]]],
  ['marsala', 'Marsala', 'Marsala', 'DOC', 'Italy', 'Sicily', ['sweet'], 'Fortified Grillo and Inzolia wines', [['h', 4, [[37.80, 12.44], [37.90, 12.55], [37.75, 12.70], [37.70, 12.50]]]]],
  ['pantelleria', 'Pantelleria', 'Passito di Pantelleria', 'DOC', 'Italy', 'Sicily', ['sweet'], 'Sweet sun-dried Zibibbo (Muscat)', [['h', 9, [[36.79, 11.99]]]]],
  ['vermentino-gallura', 'Vermentino di Gallura', 'Vermentino di Gallura', 'DOCG', 'Italy', 'Sardinia', ['white'], 'Vermentino whites on granite', [['h', 5, [[40.95, 9.15], [41.05, 9.30], [40.85, 9.40], [40.80, 9.20]]]]],
  // ---------- Spain ----------
  ['rioja', 'Rioja', 'Rioja', 'DOCa', 'Spain', 'Rioja & the North', ['red', 'white'], 'Tempranillo reds from Crianza to Gran Reserva', [['h', 3, [[42.62, -2.95], [42.58, -2.85], [42.56, -2.58], [42.50, -2.40], [42.35, -2.00], [42.18, -1.75], [42.10, -1.90], [42.25, -2.20], [42.40, -2.60], [42.48, -2.90]]]]],
  ['ribera-del-duero', 'Ribera del Duero', 'Ribera del Duero', 'DO', 'Spain', 'Castilla y León', ['red'], 'Tinto Fino (Tempranillo) reds on a high plateau', [['l', 8, [[41.62, -4.37], [41.60, -4.12], [41.70, -3.92], [41.67, -3.69], [41.58, -3.20]]]]],
  ['toro', 'Toro', 'Toro', 'DO', 'Spain', 'Castilla y León', ['red'], 'Powerful Tinta de Toro reds', [['h', 6, [[41.52, -5.39], [41.45, -5.30], [41.50, -5.50], [41.55, -5.25]]]]],
  ['rueda', 'Rueda', 'Rueda', 'DO', 'Spain', 'Castilla y León', ['white'], 'Fresh Verdejo whites', [['h', 5, [[41.41, -4.96], [41.35, -4.85], [41.28, -4.95], [41.25, -5.05], [41.40, -5.10], [41.20, -4.75]]]]],
  ['bierzo', 'Bierzo', 'Bierzo', 'DO', 'Spain', 'Castilla y León', ['red'], 'Mencía reds on slate slopes', [['h', 5, [[42.60, -6.75], [42.55, -6.60], [42.65, -6.55], [42.52, -6.85], [42.62, -6.90]]]]],
  ['rias-baixas', 'Rías Baixas', 'Rías Baixas', 'DO', 'Spain', 'Galicia', ['white'], 'Albariño whites by the Atlantic', [['h', 5, [[42.55, -8.85], [42.45, -8.75], [42.50, -8.70]]], ['h', 5, [[42.10, -8.55], [42.15, -8.40]]], ['h', 4, [[41.94, -8.84], [41.90, -8.75]]]]],
  ['ribeira-sacra', 'Ribeira Sacra', 'Ribeira Sacra', 'DO', 'Spain', 'Galicia', ['red', 'white'], 'Mencía from dizzying river-canyon terraces', [['h', 4, [[42.40, -7.60], [42.45, -7.45], [42.55, -7.40], [42.35, -7.30]]]]],
  ['txakoli', 'Getariako Txakolina', 'Getariako Txakolina', 'DO', 'Spain', 'Rioja & the North', ['white'], 'Light, spritzy Basque whites', [['h', 4, [[43.30, -2.20], [43.29, -2.10], [43.25, -2.25]]]]],
  ['priorat', 'Priorat', 'Priorat', 'DOQ', 'Spain', 'Catalonia', ['red'], 'Garnacha and Cariñena on llicorella slate', [['h', 3, [[41.19, 0.78], [41.19, 0.86], [41.15, 0.82], [41.23, 0.84], [41.21, 0.81]]]]],
  ['penedes-cava', 'Penedès & Cava', 'Penedès, Cava', 'DO', 'Spain', 'Catalonia', ['sparkling', 'white'], 'Heartland of Cava, Spain\'s traditional-method sparkling', [['h', 6, [[41.43, 1.79], [41.35, 1.70], [41.22, 1.53], [41.38, 1.61], [41.40, 1.81]]]]],
  ['jumilla', 'Jumilla', 'Jumilla', 'DO', 'Spain', 'Murcia', ['red'], 'Sun-baked Monastrell reds', [['h', 8, [[38.47, -1.33], [38.55, -1.45], [38.40, -1.20]]]]],
  ['jerez', 'Jerez (Sherry)', 'Jerez-Xérès-Sherry', 'DO', 'Spain', 'Andalusia', ['white', 'sweet'], 'Fino, Manzanilla, Oloroso and sweet PX fortified wines', [['h', 5, [[36.69, -6.13], [36.78, -6.35], [36.60, -6.23], [36.74, -6.43], [36.87, -6.18]]]]],
  ['montilla', 'Montilla-Moriles', 'Montilla-Moriles', 'DO', 'Spain', 'Andalusia', ['white', 'sweet'], 'Pedro Ximénez finos and sweet wines', [['h', 6, [[37.59, -4.64], [37.48, -4.43], [37.55, -4.50]]]]],
  ['lanzarote', 'Lanzarote', 'Lanzarote', 'DO', 'Spain', 'Canary Islands', ['white', 'sweet'], 'Malvasía grown in volcanic-ash pits', [['h', 6, [[28.98, -13.70], [29.00, -13.62]]]]],
  // ---------- Portugal ----------
  ['douro', 'Douro & Port', 'Douro, Porto', 'DOC', 'Portugal', 'North', ['red', 'sweet'], 'Port and Touriga Nacional reds on terraced schist', [['l', 8, [[41.16, -7.89], [41.16, -7.79], [41.19, -7.55], [41.15, -7.40], [41.08, -7.14], [41.03, -6.93]]]]],
  ['vinho-verde', 'Vinho Verde', 'Vinho Verde', 'DOC', 'Portugal', 'North', ['white'], 'Light, fresh Alvarinho and Loureiro whites', [['h', 0.5, [[42.08, -8.48], [41.80, -8.10], [41.45, -8.00], [41.05, -8.30], [41.20, -8.70], [41.60, -8.80], [41.95, -8.70]]]]],
  ['dao', 'Dão', 'Dão', 'DOC', 'Portugal', 'Centre', ['red', 'white'], 'Elegant Touriga Nacional and Encruzado', [['h', 6, [[40.66, -7.91], [40.50, -7.85], [40.40, -8.05], [40.55, -8.15], [40.70, -7.70]]]]],
  ['bairrada', 'Bairrada', 'Bairrada', 'DOC', 'Portugal', 'Centre', ['red', 'sparkling'], 'Baga reds and traditional-method sparkling', [['h', 5, [[40.45, -8.45], [40.35, -8.45], [40.55, -8.55], [40.40, -8.55]]]]],
  ['alentejo', 'Alentejo', 'Alentejo', 'DOC', 'Portugal', 'South', ['red', 'white'], 'Ripe reds from Aragonez, Trincadeira and Alicante Bouschet', [['h', 6, [[39.29, -7.43], [38.84, -7.59], [38.65, -7.55], [38.42, -7.53], [38.21, -7.80], [38.57, -7.91], [38.20, -7.30]]]]],
  ['setubal', 'Moscatel de Setúbal', 'Moscatel de Setúbal', 'DOC', 'Portugal', 'South', ['sweet'], 'Fortified Muscat', [['h', 4, [[38.55, -8.95], [38.50, -8.90], [38.58, -8.80], [38.53, -9.05]]]]],
  ['madeira', 'Madeira', 'Madeira', 'DOC', 'Portugal', 'Madeira', ['sweet'], 'Fortified, heat-aged Madeira from dry Sercial to rich Malmsey', [['h', 30, [[32.75, -16.95]]]]],
  // ---------- Germany ----------
  ['mosel', 'Mosel', 'Mosel', 'Anbaugebiet', 'Germany', 'Mosel', ['white', 'sweet'], 'Riesling on steep slate slopes, dry to sweet', [['l', 2.5, [[49.75, 6.64], [49.82, 6.88], [49.88, 6.92], [49.92, 7.07], [49.95, 7.01], [49.95, 7.12], [50.03, 7.18], [50.15, 7.17], [50.32, 7.51], [50.35, 7.59]]], ['l', 2.5, [[49.75, 6.64], [49.70, 6.58], [49.61, 6.55]]]]],
  ['rheingau', 'Rheingau', 'Rheingau', 'Anbaugebiet', 'Germany', 'Rhine', ['white', 'red'], 'Riesling and Spätburgunder on the Rhine\'s south-facing bank', [['l', 2.5, [[50.04, 7.80], [49.99, 7.87], [49.98, 7.92], [49.99, 7.97], [50.00, 8.03], [50.03, 8.12], [50.05, 8.25], [50.01, 8.35]]]]],
  ['rheinhessen', 'Rheinhessen', 'Rheinhessen', 'Anbaugebiet', 'Germany', 'Rhine', ['white', 'red'], 'Germany\'s largest region; Riesling and Silvaner', [['h', 2, [[49.97, 7.90], [49.99, 8.27], [49.63, 8.36], [49.75, 8.11], [49.87, 8.34]]]]],
  ['pfalz', 'Pfalz', 'Pfalz', 'Anbaugebiet', 'Germany', 'Rhine', ['white', 'red'], 'Rich Riesling and Pinot along the Weinstrasse', [['l', 4, [[49.60, 8.18], [49.46, 8.17], [49.41, 8.18], [49.35, 8.14], [49.20, 8.11], [49.05, 7.95]]]]],
  ['nahe', 'Nahe', 'Nahe', 'Anbaugebiet', 'Germany', 'Rhine', ['white'], 'Riesling on varied volcanic and slate soils', [['l', 3, [[49.96, 7.90], [49.84, 7.87], [49.81, 7.85], [49.79, 7.76], [49.80, 7.59]]]]],
  ['ahr', 'Ahr', 'Ahr', 'Anbaugebiet', 'Germany', 'Ahr', ['red'], 'Spätburgunder (Pinot Noir) in a narrow valley', [['l', 2, [[50.52, 6.99], [50.52, 7.02], [50.53, 7.05], [50.54, 7.12]]]]],
  ['franken', 'Franken', 'Franken', 'Anbaugebiet', 'Germany', 'Franken', ['white'], 'Dry Silvaner in the flat Bocksbeutel bottle', [['h', 4, [[49.86, 10.18], [49.86, 10.23], [49.83, 10.21], [49.79, 9.93], [49.76, 9.98], [49.70, 10.26]]]]],
  ['kaiserstuhl', 'Baden – Kaiserstuhl', 'Kaiserstuhl', 'Anbaugebiet', 'Germany', 'Baden', ['red', 'white'], 'Pinot Noir and Pinot Gris on a volcanic hill', [['h', 2, [[48.10, 7.62], [48.07, 7.70], [48.03, 7.65], [48.08, 7.58]]]]],
  // ---------- Austria ----------
  ['wachau', 'Wachau', 'Wachau', 'DAC', 'Austria', 'Lower Austria', ['white'], 'Grüner Veltliner and Riesling on Danube terraces', [['l', 2.5, [[48.25, 15.35], [48.30, 15.41], [48.37, 15.42], [48.40, 15.47], [48.39, 15.52], [48.39, 15.55]]]]],
  ['kamptal-kremstal', 'Kamptal & Kremstal', 'Kamptal, Kremstal', 'DAC', 'Austria', 'Lower Austria', ['white'], 'Grüner Veltliner and Riesling', [['h', 3, [[48.47, 15.68], [48.41, 15.60], [48.48, 15.69], [48.45, 15.69], [48.42, 15.65]]]]],
  ['weinviertel', 'Weinviertel', 'Weinviertel', 'DAC', 'Austria', 'Lower Austria', ['white'], 'Peppery Grüner Veltliner', [['h', 6, [[48.67, 16.63], [48.57, 16.57], [48.76, 15.95], [48.56, 16.08]]]]],
  ['wien', 'Vienna', 'Wien', 'DAC', 'Austria', 'Vienna', ['white'], 'Wiener Gemischter Satz field blends', [['h', 2, [[48.26, 16.35], [48.30, 16.41], [48.32, 16.36], [48.15, 16.27]]]]],
  ['neusiedlersee', 'Neusiedlersee & Rust', 'Neusiedlersee, Ruster Ausbruch', 'DAC', 'Austria', 'Burgenland', ['red', 'sweet'], 'Zweigelt reds and botrytised sweet wines', [['h', 3, [[47.90, 16.91], [47.76, 16.80], [47.80, 16.67], [47.85, 16.84], [47.95, 16.84], [47.85, 16.52], [47.87, 17.08]]]]],
  ['sudsteiermark', 'Südsteiermark', 'Südsteiermark', 'DAC', 'Austria', 'Styria', ['white'], 'Sauvignon Blanc on steep hills by the Slovenian border', [['h', 3, [[46.72, 15.55], [46.66, 15.47], [46.72, 15.59], [46.78, 15.45]]]]],
  // ---------- Switzerland ----------
  ['lavaux', 'Lavaux', 'Lavaux', 'AOC', 'Switzerland', 'Vaud', ['white'], 'Chasselas on UNESCO-listed terraces over Lake Geneva', [['l', 1.5, [[46.50, 6.69], [46.49, 6.73], [46.49, 6.75], [46.48, 6.78], [46.46, 6.84]]]]],
  ['valais', 'Valais', 'Valais', 'AOC', 'Switzerland', 'Valais', ['white', 'red'], 'Petite Arvine, Fendant and Cornalin in the Rhône valley', [['l', 3, [[46.10, 7.07], [46.14, 7.11], [46.23, 7.36], [46.29, 7.53], [46.31, 7.57], [46.29, 7.88]]]]],
  ['ticino', 'Ticino', 'Ticino', 'DOC', 'Switzerland', 'Ticino', ['red'], 'Swiss Merlot', [['h', 4, [[46.17, 8.80], [46.00, 8.95], [45.87, 8.98], [46.20, 9.02]]]]],
  // ---------- Hungary ----------
  ['tokaj', 'Tokaj', 'Tokaj', 'OEM', 'Hungary', 'Tokaj', ['sweet', 'white'], 'Tokaji Aszú and dry Furmint', [['h', 3, [[48.12, 21.41], [48.13, 21.35], [48.19, 21.28], [48.24, 21.23], [48.32, 21.57], [48.27, 21.36], [48.28, 21.19], [48.16, 21.36]]]]],
  ['eger', 'Eger', 'Eger', 'OEM', 'Hungary', 'Northern Hungary', ['red', 'white'], 'Egri Bikavér ("Bull\'s Blood") reds', [['h', 5, [[47.90, 20.37], [47.93, 20.30], [47.85, 20.40], [47.88, 20.25]]]]],
  ['villany', 'Villány', 'Villány', 'OEM', 'Hungary', 'Pannon', ['red'], 'Cabernet Franc and Bordeaux-style reds', [['h', 3, [[45.87, 18.45], [45.86, 18.37], [45.89, 18.55]]]]],
  ['badacsony', 'Badacsony', 'Badacsony', 'OEM', 'Hungary', 'Balaton', ['white'], 'Volcanic whites above Lake Balaton', [['h', 4, [[46.79, 17.50], [46.80, 17.44], [46.88, 17.44]]]]],
  ['somlo', 'Somló', 'Somló', 'OEM', 'Hungary', 'Balaton', ['white'], 'Juhfark and Furmint on a lone volcanic hill', [['h', 3, [[47.15, 17.38]]]]],
  // ---------- Slovenia / Croatia / Balkans ----------
  ['brda', 'Goriška Brda', 'Goriška Brda', 'ZGP', 'Slovenia', 'Primorska', ['white', 'amber'], 'Rebula (Ribolla) whites and orange wines', [['h', 3, [[46.00, 13.55], [46.05, 13.50], [45.96, 13.60]]]]],
  ['vipava', 'Vipava Valley', 'Vipavska dolina', 'ZGP', 'Slovenia', 'Primorska', ['white', 'amber'], 'Zelen and Pinela whites', [['l', 4, [[45.88, 13.80], [45.85, 13.95], [45.80, 14.05]]]]],
  ['stajerska', 'Štajerska', 'Štajerska Slovenija', 'ZGP', 'Slovenia', 'Podravje', ['white', 'sweet'], 'Šipon (Furmint), Sauvignon and sweet late harvests', [['h', 6, [[46.47, 16.18], [46.55, 15.65], [46.52, 16.20], [46.42, 15.90]]]]],
  ['istria', 'Istria', 'Istra', 'ZOI', 'Croatia', 'Istria', ['white', 'red'], 'Malvazija Istarska whites and Teran reds', [['h', 3, [[45.40, 13.60], [45.20, 13.62], [45.10, 13.90], [45.30, 13.95], [45.45, 13.80]]]]],
  ['peljesac', 'Pelješac', 'Pelješac (Dingač, Postup)', 'ZOI', 'Croatia', 'Dalmatia', ['red'], 'Plavac Mali reds on sea-facing slopes', [['l', 2.5, [[42.98, 17.25], [42.95, 17.40], [42.90, 17.55]]]]],
  ['slavonia', 'Slavonia', 'Slavonija (Kutjevo)', 'ZOI', 'Croatia', 'Slavonia', ['white'], 'Graševina (Welschriesling) whites', [['h', 5, [[45.42, 17.88], [45.35, 17.95], [45.40, 17.75]]]]],
  ['fruska-gora', 'Fruška Gora', 'Фрушка гора', '', 'Serbia', 'Vojvodina', ['white', 'red'], 'Wines from the hills above the Danube near Novi Sad', [['h', 4, [[45.15, 19.70], [45.20, 19.90], [45.12, 19.50], [45.18, 19.40]]]]],
  ['zupa', 'Župa', 'Жупа', '', 'Serbia', 'Central Serbia', ['red'], 'Prokupac reds around Aleksandrovac', [['h', 5, [[43.46, 21.05], [43.55, 21.20]]]]],
  ['tikves', 'Tikveš', 'Тиквеш', '', 'North Macedonia', 'Vardar', ['red', 'white'], 'Vranec reds from the Vardar valley', [['h', 7, [[41.43, 22.01], [41.48, 22.09], [41.40, 22.24]]]]],
  ['mostar', 'Herzegovina (Mostar)', 'Hercegovina', '', 'Bosnia and Herzegovina', 'Herzegovina', ['white', 'red'], 'Žilavka whites and Blatina reds', [['h', 6, [[43.23, 17.70], [43.30, 17.85], [43.15, 17.75]]]]],
  ['crmnica', 'Crmnica & Lake Skadar', 'Crmnica', '', 'Montenegro', 'Lake Skadar', ['red'], 'Vranac reds', [['h', 5, [[42.25, 19.09], [42.43, 19.26], [42.30, 19.00]]]]],
  ['berat', 'Berat', 'Berat', '', 'Albania', 'Central Albania', ['red', 'white'], 'Shesh i Zi reds and native whites', [['h', 6, [[40.70, 19.95], [40.75, 19.90]]]]],
  // ---------- Eastern Europe & Caucasus ----------
  ['thracian-valley', 'Thracian Valley', 'Тракийска низина', 'PGI', 'Bulgaria', 'Thrace', ['red', 'white'], 'Mavrud, Rubin and international reds around Plovdiv', [['h', 6, [[42.15, 24.75], [42.01, 24.88], [42.42, 25.63], [42.19, 24.33]]]]],
  ['melnik', 'Melnik & Struma Valley', 'Мелник', '', 'Bulgaria', 'Struma Valley', ['red'], 'Broadleaf Melnik reds', [['h', 5, [[41.52, 23.39], [41.56, 23.28], [41.45, 23.30]]]]],
  ['dealu-mare', 'Dealu Mare', 'Dealu Mare', 'DOC', 'Romania', 'Muntenia', ['red'], 'Fetească Neagră reds on the Carpathian foothills', [['h', 4, [[44.99, 26.23], [45.01, 26.33], [45.03, 26.43], [45.10, 26.58]]]]],
  ['cotnari', 'Cotnari', 'Cotnari', 'DOC', 'Romania', 'Moldavia', ['sweet', 'white'], 'Sweet Grasă de Cotnari', [['h', 4, [[47.36, 26.93], [47.40, 26.98]]]]],
  ['tarnave', 'Târnave', 'Târnave', 'DOC', 'Romania', 'Transylvania', ['white', 'sparkling'], 'Cool Transylvanian whites and sparkling', [['h', 5, [[46.22, 24.10], [46.17, 23.92], [46.16, 24.35]]]]],
  ['murfatlar', 'Murfatlar', 'Murfatlar', 'DOC', 'Romania', 'Dobrogea', ['white', 'sweet', 'red'], 'Wines near the Black Sea', [['h', 5, [[44.17, 28.41], [44.22, 28.30]]]]],
  ['codru', 'Codru', 'Codru', 'IGP', 'Moldova', 'Codru', ['white', 'sparkling', 'red'], 'Heart of Moldovan wine, with the giant Cricova and Mileștii Mici cellars', [['h', 5, [[47.14, 28.86], [46.92, 28.83], [46.83, 28.59], [47.14, 28.61]]]]],
  ['stefan-voda', 'Ștefan Vodă (Purcari)', 'Valul lui Traian, Ștefan Vodă', 'IGP', 'Moldova', 'South-East', ['red'], 'Rară Neagră and Negru de Purcari reds', [['h', 6, [[46.52, 29.85], [46.45, 29.70]]]]],
  ['shabo', 'Shabo (Odesa)', 'Шабо', '', 'Ukraine', 'Odesa', ['white', 'sparkling'], 'Wines by the Dniester estuary', [['h', 5, [[46.13, 30.38], [46.20, 30.30]]]]],
  ['kakheti', 'Kakheti', 'კახეთი', '', 'Georgia', 'Kakheti', ['amber', 'red', 'white'], 'Qvevri amber Rkatsiteli and Saperavi reds', [['h', 5, [[41.92, 45.48], [41.74, 45.80], [41.62, 45.92], [41.95, 45.81], [41.89, 45.57], [41.83, 46.28], [42.03, 45.21]]]]],
  ['areni', 'Vayots Dzor (Areni)', 'Վայոց Ձոր', '', 'Armenia', 'Vayots Dzor', ['red'], 'Areni Noir reds near the world\'s oldest known winery', [['h', 6, [[39.72, 45.20], [39.75, 45.30]]]]],
  ['moravia', 'Moravia', 'Morava', '', 'Czechia', 'Moravia', ['white', 'red'], 'Grüner Veltliner, Riesling and Pálava', [['h', 4, [[48.86, 16.05], [48.81, 16.64], [48.90, 16.82], [48.90, 17.32], [49.05, 16.60]]]]],
  ['male-karpaty', 'Malé Karpaty', 'Malokarpatská oblasť', '', 'Slovakia', 'Little Carpathians', ['white', 'red'], 'Riesling and Grüner Veltliner below the Little Carpathians', [['l', 4, [[48.18, 17.10], [48.29, 17.27], [48.33, 17.31], [48.40, 17.40]]]]],
  // ---------- Western & Mediterranean extras ----------
  ['sussex', 'Sussex', 'Sussex', 'PDO', 'United Kingdom', 'England', ['sparkling'], 'English traditional-method sparkling on chalk', [['h', 4, [[50.95, -0.90], [50.90, 0.10], [50.85, -0.30], [51.00, -0.40]]]]],
  ['kent', 'Kent', 'Kent', '', 'United Kingdom', 'England', ['sparkling'], 'Sparkling from the North Downs chalk', [['h', 4, [[51.25, 0.50], [51.15, 0.90], [51.10, 0.50]]]]],
  ['moselle-lux', 'Moselle Luxembourgeoise', 'Moselle Luxembourgeoise', 'AOP', 'Luxembourg', 'Moselle', ['white', 'sparkling'], 'Riesling, Auxerrois and Crémant de Luxembourg', [['l', 2, [[49.47, 6.37], [49.54, 6.37], [49.68, 6.44], [49.71, 6.50]]]]],
  ['commandaria', 'Commandaria', 'Κουμανδαρία', 'PDO', 'Cyprus', 'Troodos', ['sweet'], 'Sweet sun-dried wine, one of the oldest named wines', [['h', 4, [[34.83, 33.00], [34.86, 33.05], [34.83, 32.97], [34.81, 33.04]]]]],
  ['malta', 'Malta & Gozo', 'Malta, Gozo', 'DOK', 'Malta', 'Malta', ['white', 'red'], 'Ġellewża reds and Girgentina whites', [['h', 20, [[35.90, 14.40], [36.05, 14.25]]]]],
];

const zone = (country, parts) => {
  let g = null;
  for (const [t, km, pts] of parts) {
    const ll = pts.map(([a, b]) => [b, a]);
    let base;
    if (t === 'l') base = turf.lineString(ll);
    else if (ll.length > 2) base = turf.convex(turf.featureCollection(ll.map(p => turf.point(p))));
    else if (ll.length === 2) base = turf.lineString(ll);
    else base = turf.point(ll[0]);
    const b = turf.buffer(base, km, { units: 'kilometers', steps: 12 });
    g = g ? turf.union(turf.featureCollection([g, b])) : b;
  }
  const shape = shapes[COUNTRY[country]];
  if (!shape) throw new Error('no country shape ' + country);
  const clipped = turf.intersect(turf.featureCollection([g, shape]));
  if (!clipped) throw new Error('empty after clip');
  return clipped;
};

const round = g => JSON.parse(JSON.stringify(g, (k, v) => typeof v === 'number' ? Math.round(v * 1e4) / 1e4 : v));
const ids = new Set();
const out = A.map(([id, name, local, kind, country, region, styles, wines, parts]) => {
  if (ids.has(id)) throw new Error('dup ' + id); ids.add(id);
  let g;
  try { g = zone(country, parts); } catch (e) { throw new Error(id + ': ' + e.message); }
  const s = turf.simplify(g, { tolerance: 0.003, highQuality: true });
  return { id, name, el: local, kind, country, region, styles, wines, approx: true, geometry: round(s.geometry) };
});
fs.writeFileSync(process.argv[2], JSON.stringify(out));
for (const z of out) console.log(z.country.padEnd(16), z.id.padEnd(22), (turf.area(z.geometry) / 1e6).toFixed(0).padStart(6) + ' km2', z.geometry.type);
console.log(out.length, 'areas,', fs.statSync(process.argv[2]).size, 'bytes');
