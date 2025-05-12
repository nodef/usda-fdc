// Copyright (C) 2025 Subhajit Sahu
// SPDX-License-Identifier: AGPL-3.0-or-later
// See LICENSE for full terms
import * as csv  from "jsr:@std/csv@1.0.6";
import lunr from "npm:lunr@2.3.9";  // @deno-types="npm:@types/lunr@2.3.7"
import {type ColumnTypes, type SetupTableOptions, createView, createIndex, setupTableIndex} from "jsr:@nodef/extra-sql@0.1.2";




//#region TYPES
/** Detailed nutrient composition of commodity and minimally processed food samples in the United States. */
export interface FoundationFood {
  /** Food Code. */
  code: string,
  /** Food Name. */
  name: string,
  /** Food Category. */
  category: string,
  /** Protein to kcal conversion factor. */
  protkcal: number,
  /** Fat to kcal conversion factor. */
  fatkcal: number,
  /** Carbohydrate to kcal conversion factor. */
  carbkcal: number,
  /** Protein conversion factor. */
  protfac: number,
  /** 5-Formyltetrahydrofolic acid (5-HCOH4), in g [suggested: µg]. */
  fthf5: number,
  /** 5-methyl tetrahydrofolate (5-MTHF), in g [suggested: µg]. */
  mthf5: number,
  /** Alanine, in g [suggested: g]. */
  ala: number,
  /** Arginine, in g [suggested: g]. */
  arg: number,
  /** Ash, in g [suggested: g]. */
  ash: number,
  /** Aspartic acid, in g [suggested: g]. */
  asp: number,
  /** Delta-5-avenasterol, in g [suggested: mg]. */
  aved5: number,
  /** Boron, in g [suggested: µg]. */
  b: number,
  /** Betaine, in g [suggested: mg]. */
  betn: number,
  /** Biotin, in g [suggested: µg]. */
  biot: number,
  /** Brassicasterol, in g [suggested: mg]. */
  brastr: number,
  /** Calcium, in g [suggested: mg]. */
  ca: number,
  /** Campestanol, in g [suggested: mg]. */
  camstl: number,
  /** Campesterol, in g [suggested: mg]. */
  camt: number,
  /** Carotene, alpha, in g [suggested: µg]. */
  carta: number,
  /** Carotene, beta, in g [suggested: µg]. */
  cartb: number,
  /** cis-beta-Carotene, in g [suggested: µg]. */
  cartbcis: number,
  /** trans-beta-Carotene, in g [suggested: µg]. */
  cartbt: number,
  /** Carotene, gamma, in g [suggested: µg]. */
  cartg: number,
  /** Choline, from phosphotidyl choline, in g [suggested: mg]. */
  chlnp: number,
  /** Carbohydrate, by difference, in g [suggested: g]. */
  choavldf: number,
  /** Vitamin D3 (cholecalciferol), in g [suggested: µg]. */
  chocal: number,
  /** 25-hydroxycholecalciferol, in g [suggested: µg]. */
  chocaloh: number,
  /** Carbohydrate, by summation, in g [suggested: g]. */
  chocsm: number,
  /** Cholesterol, in g [suggested: mg]. */
  cholc: number,
  /** Choline, total, in g [suggested: mg]. */
  choln: number,
  /** Choline, free, in g [suggested: mg]. */
  cholnf: number,
  /** Choline, from glycerophosphocholine, in g [suggested: mg]. */
  cholngpc: number,
  /** Choline, from phosphocholine, in g [suggested: mg]. */
  cholnpc: number,
  /** Choline, from sphingomyelin, in g [suggested: mg]. */
  cholnsm: number,
  /** Citric acid, in g [suggested: mg]. */
  citac: number,
  /** Cobalt, Co, in g [suggested: µg]. */
  co: number,
  /** Cryptoxanthin, alpha, in g [suggested: µg]. */
  crypxa: number,
  /** Cryptoxanthin, beta, in g [suggested: µg]. */
  crypxb: number,
  /** Copper, Cu, in g [suggested: mg]. */
  cu: number,
  /** Cystine, in g [suggested: g]. */
  cys: number,
  /** Cysteine, in g [suggested: g]. */
  cyste: number,
  /** Daidzin, in g [suggested: mg]. */
  daidzn: number,
  /** Daidzein, in g [suggested: mg]. */
  ddzein: number,
  /** Ergothioneine, in g [suggested: mg]. */
  egt: number,
  /** Energy, in g [suggested: kJ]. */
  enerc: number,
  /** Energy (Atwater General Factors), in g [suggested: kcal]. */
  enercawg: number,
  /** Energy (Atwater Specific Factors), in g [suggested: kcal]. */
  enercaws: number,
  /** Ergosta-5,7-dienol, in g [suggested: mg]. */
  erg5d7dienol: number,
  /** Ergosta-7,22-dienol, in g [suggested: mg]. */
  erg7d22dienol: number,
  /** Ergosta-7-enol, in g [suggested: mg]. */
  erg7enol: number,
  /** Vitamin D2 (ergocalciferol), in g [suggested: µg]. */
  ergcal: number,
  /** Ergosterol, in g [suggested: mg]. */
  ergstr: number,
  /** SFA 10:0, in g [suggested: g]. */
  f10d0: number,
  /** SFA 11:0, in g [suggested: g]. */
  f11d0: number,
  /** SFA 12:0, in g [suggested: g]. */
  f12d0: number,
  /** MUFA 12:1, in g [suggested: g]. */
  f12d1: number,
  /** SFA 14:0, in g [suggested: g]. */
  f14d0: number,
  /** MUFA 14:1 c, in g [suggested: g]. */
  f14d1c: number,
  /** TFA 14:1 t, in g [suggested: g]. */
  f14d1t: number,
  /** SFA 15:0, in g [suggested: g]. */
  f15d0: number,
  /** MUFA 15:1, in g [suggested: g]. */
  f15d1: number,
  /** SFA 16:0, in g [suggested: g]. */
  f16d0: number,
  /** MUFA 16:1 c, in g [suggested: g]. */
  f16d1: number,
  /** TFA 16:1 t, in g [suggested: g]. */
  f16d1t: number,
  /** SFA 17:0, in g [suggested: g]. */
  f17d0: number,
  /** MUFA 17:1, in g [suggested: g]. */
  f17d1: number,
  /** MUFA 17:1 c, in g [suggested: g]. */
  f17d1c: number,
  /** SFA 18:0, in g [suggested: g]. */
  f18d0: number,
  /** MUFA 18:1, in g [suggested: g]. */
  f18d1: number,
  /** MUFA 18:1 c, in g [suggested: g]. */
  f18d1c: number,
  /** TFA 18:1 t, in g [suggested: g]. */
  f18d1t: number,
  /** PUFA 18:2, in g [suggested: g]. */
  f18d2: number,
  /** PUFA 18:2 c, in g [suggested: g]. */
  f18d2c: number,
  /** PUFA 18:2 CLAs, in g [suggested: g]. */
  f18d2cla: number,
  /** PUFA 18:3 n-6 c,c,c, in g [suggested: g]. */
  f18d2cn3: number,
  /** PUFA 18:2 n-6 c,c, in g [suggested: g]. */
  f18d2cn6: number,
  /** TFA 18:2 t not further defined, in g [suggested: g]. */
  f18d2t: number,
  /** PUFA 18:3i, in g [suggested: g]. */
  f18d3: number,
  /** PUFA 18:3 c, in g [suggested: g]. */
  f18d3c: number,
  /** PUFA 18:3 n-3 c,c,c (ALA), in g [suggested: g]. */
  f18d3cn3: number,
  /** TFA 18:3 t, in g [suggested: g]. */
  f18d3t: number,
  /** PUFA 18:4, in g [suggested: g]. */
  f18d4: number,
  /** SFA 20:0, in g [suggested: g]. */
  f20d0: number,
  /** MUFA 20:1, in g [suggested: g]. */
  f20d1: number,
  /** MUFA 20:1 c, in g [suggested: g]. */
  f20d1c: number,
  /** TFA 20:1 t, in g [suggested: g]. */
  f20d1t: number,
  /** PUFA 20:2 c, in g [suggested: g]. */
  f20d2: number,
  /** PUFA 20:2 n-6 c,c, in g [suggested: g]. */
  f20d2cn6: number,
  /** PUFA 20:3 n-3, in g [suggested: g]. */
  f20d3: number,
  /** PUFA 20:3 c, in g [suggested: g]. */
  f20d3c: number,
  /** PUFA 20:3 n-6, in g [suggested: g]. */
  f20d3n6: number,
  /** PUFA 20:3 n-9, in g [suggested: g]. */
  f20d3n9: number,
  /** PUFA 20:4, in g [suggested: g]. */
  f20d4: number,
  /** PUFA 20:4c, in g [suggested: g]. */
  f20d4c: number,
  /** PUFA 20:5c, in g [suggested: g]. */
  f20d5: number,
  /** PUFA 20:5 n-3 (EPA), in g [suggested: g]. */
  f20d5n3: number,
  /** SFA 21:0, in g [suggested: g]. */
  f21d0: number,
  /** SFA 22:0, in g [suggested: g]. */
  f22d0: number,
  /** MUFA 22:1 c, in g [suggested: g]. */
  f22d1: number,
  /** MUFA 22:1 n-11, in g [suggested: g]. */
  f22d1cn11: number,
  /** MUFA 22:1 n-9, in g [suggested: g]. */
  f22d1n9: number,
  /** TFA 22:1 t, in g [suggested: g]. */
  f22d1tn9: number,
  /** PUFA 22:2, in g [suggested: g]. */
  f22d2: number,
  /** PUFA 22:3, in g [suggested: g]. */
  f22d3: number,
  /** PUFA 22:4, in g [suggested: g]. */
  f22d4: number,
  /** PUFA 22:5 c, in g [suggested: g]. */
  f22d5: number,
  /** PUFA 22:5 n-3 (DPA), in g [suggested: g]. */
  f22d5n3: number,
  /** PUFA 22:6 c, in g [suggested: g]. */
  f22d6: number,
  /** PUFA 22:6 n-3 (DHA), in g [suggested: g]. */
  f22d6n3: number,
  /** SFA 23:0, in g [suggested: g]. */
  f23d0: number,
  /** SFA 24:0, in g [suggested: g]. */
  f24d0: number,
  /** MUFA 24:1 c, in g [suggested: g]. */
  f24d1: number,
  /** SFA 4:0, in g [suggested: g]. */
  f4d0: number,
  /** SFA 5:0, in g [suggested: g]. */
  f5d0: number,
  /** SFA 6:0, in g [suggested: g]. */
  f6d0: number,
  /** SFA 7:0, in g [suggested: g]. */
  f7d0: number,
  /** SFA 8:0, in g [suggested: g]. */
  f8d0: number,
  /** SFA 9:0, in g [suggested: g]. */
  f9d0: number,
  /** Fatty acids, total trans-dienoic, in g [suggested: g]. */
  fadt: number,
  /** Fatty acids, total monounsaturated, in g [suggested: g]. */
  fams: number,
  /** Fatty acids, total polyunsaturated, in g [suggested: g]. */
  fapu: number,
  /** Fatty acids, total saturated, in g [suggested: g]. */
  fasat: number,
  /** Total lipid (fat), in g [suggested: g]. */
  fat: number,
  /** Total fat (NLEA), in g [suggested: g]. */
  fatnlea: number,
  /** Fatty acids, total trans, in g [suggested: g]. */
  fatrans: number,
  /** Fatty acids, total trans-monoenoic, in g [suggested: g]. */
  fatrnm: number,
  /** Fatty acids, total trans-polyenoic, in g [suggested: g]. */
  fatrnp: number,
  /** Iron, Fe, in g [suggested: mg]. */
  fe: number,
  /** Fiber, insoluble, in g [suggested: g]. */
  fibins: number,
  /** Fiber, soluble, in g [suggested: g]. */
  fibsol: number,
  /** Total dietary fiber (AOAC 2011.25), in g [suggested: g]. */
  fibtg: number,
  /** Fiber, total dietary, in g [suggested: g]. */
  fibtsw: number,
  /** Folate, total, in g [suggested: µg]. */
  fol: number,
  /** 10-Formyl folic acid (10HCOFA), in g [suggested: µg]. */
  folhco10: number,
  /** Fructose, in g [suggested: g]. */
  frus: number,
  /** Galactose, in g [suggested: g]. */
  gals: number,
  /** Glutamic acid, in g [suggested: g]. */
  glu: number,
  /** Beta-glucan, in g [suggested: g]. */
  glucnb: number,
  /** Glucose, in g [suggested: g]. */
  glus: number,
  /** Glycine, in g [suggested: g]. */
  gly: number,
  /** Glycitin, in g [suggested: mg]. */
  glyctn: number,
  /** Genistein, in g [suggested: mg]. */
  gnstein: number,
  /** Genistin, in g [suggested: mg]. */
  gnstin: number,
  /** Glutathione, in g [suggested: mg]. */
  gsh: number,
  /** Histidine, in g [suggested: g]. */
  his: number,
  /** High Molecular Weight Dietary Fiber (HMWDF), in g [suggested: g]. */
  hmwdf: number,
  /** Hydroxyproline, in g [suggested: g]. */
  hyp: number,
  /** Iodine, I, in g [suggested: µg]. */
  id: number,
  /** Isoleucine, in g [suggested: g]. */
  ile: number,
  /** Potassium, K, in g [suggested: mg]. */
  k: number,
  /** Lactose, in g [suggested: g]. */
  lacs: number,
  /** Leucine, in g [suggested: g]. */
  leu: number,
  /** Low Molecular Weight Dietary Fiber (LMWDF), in g [suggested: g]. */
  lmwdf: number,
  /** Lutein, in g [suggested: µg]. */
  lutn: number,
  /** Lycopene, in g [suggested: µg]. */
  lycpn: number,
  /** cis-Lycopene, in g [suggested: µg]. */
  lycpncis: number,
  /** trans-Lycopene, in g [suggested: µg]. */
  lycpnt: number,
  /** Lysine, in g [suggested: g]. */
  lys: number,
  /** Lutein + zeaxanthin, in g [suggested: µg]. */
  lzea: number,
  /** cis-Lutein/Zeaxanthin, in g [suggested: µg]. */
  lzeac: number,
  /** Malic acid, in g [suggested: mg]. */
  malac: number,
  /** Maltose, in g [suggested: g]. */
  mals: number,
  /** Methionine, in g [suggested: g]. */
  met: number,
  /** Magnesium, Mg, in g [suggested: mg]. */
  mg: number,
  /** Vitamin K (Menaquinone-4), in g [suggested: µg]. */
  mk4: number,
  /** Manganese, Mn, in g [suggested: mg]. */
  mn: number,
  /** Molybdenum, Mo, in g [suggested: µg]. */
  mo: number,
  /** Sodium, Na, in g [suggested: mg]. */
  na: number,
  /** Nickel, Ni, in g [suggested: µg]. */
  ni: number,
  /** Niacin, in g [suggested: mg]. */
  nia: number,
  /** Nitrogen, in g [suggested: g]. */
  nt: number,
  /** Oxalic acid, in g [suggested: mg]. */
  oxalac: number,
  /** Phosphorus, P, in g [suggested: mg]. */
  p: number,
  /** Pantothenic acid, in g [suggested: mg]. */
  pantac: number,
  /** Phenylalanine, in g [suggested: g]. */
  phe: number,
  /** Phytofluene, in g [suggested: µg]. */
  phyflu: number,
  /** Phytosterols, other, in g [suggested: mg]. */
  phystroth: number,
  /** Phytoene, in g [suggested: µg]. */
  phytoene: number,
  /** Proline, in g [suggested: g]. */
  pro: number,
  /** Protein, in g [suggested: g]. */
  procnt: number,
  /** Pyruvic acid, in g [suggested: mg]. */
  pyrac: number,
  /** Quinic acid, in g [suggested: mg]. */
  quinac: number,
  /** Raffinose, in g [suggested: g]. */
  rafs: number,
  /** Retinol, in g [suggested: µg]. */
  retol: number,
  /** Riboflavin, in g [suggested: mg]. */
  ribf: number,
  /** Sulfur, S, in g [suggested: mg]. */
  s: number,
  /** Selenium, Se, in g [suggested: µg]. */
  se: number,
  /** Serine, in g [suggested: g]. */
  ser: number,
  /** Beta-sitostanol, in g [suggested: mg]. */
  sitstl: number,
  /** Beta-sitosterol, in g [suggested: mg]. */
  sitstr: number,
  /** Specific Gravity, in g [suggested: sp gr]. */
  spgr: number,
  /** Starch, in g [suggested: g]. */
  starch: number,
  /** Resistant starch, in g [suggested: g]. */
  stares: number,
  /** Stachyose, in g [suggested: g]. */
  stas: number,
  /** Stigmastadiene, in g [suggested: mg]. */
  stgmd: number,
  /** Stigmasterol, in g [suggested: mg]. */
  stgstr: number,
  /** Delta-7-Stigmastenol, in g [suggested: mg]. */
  stigma7: number,
  /** Sucrose, in g [suggested: g]. */
  sucs: number,
  /** Sugars, Total, in g [suggested: g]. */
  sugar: number,
  /** Thiamin, in g [suggested: mg]. */
  thia: number,
  /** Threonine, in g [suggested: g]. */
  thr: number,
  /** Vitamin E (alpha-tocopherol), in g [suggested: mg]. */
  tocpha: number,
  /** Tocopherol, beta, in g [suggested: mg]. */
  tocphb: number,
  /** Tocopherol, delta, in g [suggested: mg]. */
  tocphd: number,
  /** Tocopherol, gamma, in g [suggested: mg]. */
  tocphg: number,
  /** Tocotrienol, alpha, in g [suggested: mg]. */
  toctra: number,
  /** Tocotrienol, beta, in g [suggested: mg]. */
  toctrb: number,
  /** Tocotrienol, delta, in g [suggested: mg]. */
  toctrd: number,
  /** Tocotrienol, gamma, in g [suggested: mg]. */
  toctrg: number,
  /** Tryptophan, in g [suggested: g]. */
  trp: number,
  /** Tyrosine, in g [suggested: g]. */
  tyr: number,
  /** Valine, in g [suggested: g]. */
  val: number,
  /** Verbascose, in g [suggested: g]. */
  vers: number,
  /** Vitamin A, in g [suggested: mg]. */
  vita: number,
  /** Vitamin A, RAE, in g [suggested: µg]. */
  vitaa: number,
  /** Vitamin B-12, in g [suggested: µg]. */
  vitb12: number,
  /** Vitamin B-6, in g [suggested: mg]. */
  vitb6a: number,
  /** Vitamin C, total ascorbic acid, in g [suggested: mg]. */
  vitc: number,
  /** Vitamin D (D2 + D3), in g [suggested: µg]. */
  vitd: number,
  /** Vitamin D4, in g [suggested: µg]. */
  vitd4: number,
  /** Vitamin D (D2 + D3), International Units, in g [suggested: IU]. */
  vitda: number,
  /** Vitamin K (phylloquinone), in g [suggested: µg]. */
  vitk1: number,
  /** Vitamin K (Dihydrophylloquinone), in g [suggested: µg]. */
  vitk1d: number,
  /** Water, in g [suggested: g]. */
  water: number,
  /** Zeaxanthin, in g [suggested: µg]. */
  zea: number,
  /** Zinc, Zn, in g [suggested: mg]. */
  zn: number,
};
//#endregion




//#region CONSTANTS
const TEXTCOLS = new Set(['code', 'name', 'category']);
//#endregion




//#region GLOBALS
let corpus: Map<string, FoundationFood> | null = null;
let index: lunr.Index | null = null;
//#endregion




//#region FUNCTIONS
// Parse a row from the CSV file.
function parseRow(row: Record<string, string>) {
  const a: Record<string, string | number> = {};
  for (const k in row) {
    // Name of column is after the last semicolon.
    const l = k.substring(k.lastIndexOf(';')+1).trim();
    a[l] = TEXTCOLS.has(l)? row[k] : parseFloat(row[k] || "0");
  }
  return a;
}


/**
 * Load the foundation foods corpus from CSV file.
 * @param file CSV file path
 * @returns foundation foods corpus
 */
async function loadFromCsv(file: string) {
  const map  = new Map<string, FoundationFood>();
  const data = await (await fetch(file)).text();
  const records = csv.parse(data, {skipFirstRow: true, comment: "#"});
  for (const r of records)
    map.set(r.code, parseRow(r) as unknown as FoundationFood);
  return map;
}


/**
 * Setup the lunr index for the foundation foods corpus.
 * @returns lunr index
 */
function setupIndex(corpus: Map<string, FoundationFood>) {
  return lunr(function(this: lunr.Builder) {
    this.ref('code');
    this.field('code');
    this.field('name');
    this.field('category');
    for (const r of corpus.values()) {
      let {code, name, category} = r;
      name = name.replace(/^(\w+),/g, '$1 $1 $1 $1,');
      this.add({code, name, category});
    }
  });
}


/**
 * Load the foundation foods corpus from the file.
 * @returns foundation foods corpus
 */
export async function loadFoundationFoods(): Promise<Map<string, FoundationFood>> {
  if (corpus) return corpus;
  corpus = await loadFromCsv(foundationFoodsCsv());
  index  = setupIndex(corpus);
  return corpus;
}


/**
 * Get the path to the compositions CSV file.
 * @returns CSV file URL
 */
export function foundationFoodsCsv(): string {
  return import.meta.resolve('./index.csv');
}


function tsvector(_tab: string, cols: Record<string, string>) {
  const {code, name, category} = cols;
  return `setweight(to_tsvector('english', "code"), '${code}')||`+
  `setweight(to_tsvector('english', left("name", strpos("name", ','))), '${code}')||`+
  `setweight(to_tsvector('english', "name"), '${name}')||`+
  `setweight(to_tsvector('english', "category"), '${category}')`;
}


function createTable(tab: string, cols: FoundationFood, opt: SetupTableOptions={}, a='') {
  const pre = ['code', 'name', 'category'];
  a += `CREATE TABLE IF NOT EXISTS "${tab}" (`;
  for (const c of pre)
    a += ` "${c}" TEXT NOT NULL,`;
  for (const c in cols) {
    if (pre.includes(c)) continue;
    a += ` "${c}" REAL NOT NULL,`;
  }
  if (opt.pk) a += ` PRIMARY KEY ("code"), `;
  a = a.endsWith(', ')? a.substring(0, a.length-2) : a;
  a += `);\n`;
  return a;
}

function insertIntoBegin(tab: string, cols: FoundationFood, a='') {
  a += `INSERT INTO "${tab}" (`;
  for (const c in cols)
    a += `"${c}", `;
  a = a.endsWith(', ')? a.substring(0, a.length-2) : a;
  a += ') VALUES\n(';
  return a;
}

function insertIntoMid(val: Record<string, string | number>, a='') {
  for (const k in val)
    a += `'${val[k]}', `;
  a = a.endsWith(', ')? a.substring(0, a.length-2) : a;
  a += `),\n(`;
  return a;
}

function insertIntoEnd(a='') {
  a = a.endsWith(',\n(')? a.substring(0, a.length-3) : a;
  a += ';\n';
  return a;
}



/**
 * Obtain SQL command to create and populate the compositions table.
 * @param tab table name
 * @param opt options for the table
 * @returns CREATE TABLE, INSERT, CREATE VIEW, CREATE INDEX statements
 */
export async function foundationFoodsSql(tab: string="foundationfoods", opt: SetupTableOptions={}): Promise<string> {
  const tsv = tsvector(tab, {code: 'A', name: 'B', category: 'C'});
  opt = Object.assign({pk: 'code', index: true}, opt);
  const map  = await loadFoundationFoods();
  const cols = map.get("321358") as FoundationFood;
  let a = createTable(tab, cols, opt, '');
  a = insertIntoBegin(tab, cols, a);
  for (const [, row] of map)
    a = insertIntoMid(row as unknown as Record<string, string | number>, a);
  a = insertIntoEnd(a);
  a += createView(`${tab}_tsvector`, `SELECT *, ${tsv} AS "tsvector" FROM "${tab}"`);
  a += createIndex(`${tab}_tsvector_idx`, tab, `(${tsv})`, {method: 'GIN'});
  a  = setupTableIndex(tab, cols as unknown as ColumnTypes, opt, a);
  return a;
}


/**
 * Find matching foundation foods with detailed nutrient composition, of a code/name/category query.
 * @param txt code/name/category query
 * @returns matches `[{code, name, category, ...}]`
 * @example
 * ```javascript
 * usdaFdc.foundationFoods('kale');
 * usdaFdc.foundationFoods('raw kale');
 * // → [ { code: '323505',
 * // →     name: 'Kale, raw',
 * // →     category: 'Vegetables and Vegetable Products',
 * // →     protkcal: 2.44,
 * // →     fatkcal: 8.37,
 * // →     carbkcal: 3.57,
 * // →     protfac: 6.25,
 * // →     ala: 0,
 * // →     ala_e: 0,
 * // →     arg: 0,
 * // →     arg_e: 0,
 * // →     ash: 1.54,
 * // →     ash_e: 0.49,
 * // →     ... } ]
 *
 * usdaFdc.compositions('ricotta cheese');
 * usdaFdc.compositions('whole milk ricotta');
 * // → [ { code: '746766',
 * // →     name: 'Cheese, ricotta, whole milk',
 * // →     category: 'Dairy and Egg Products',
 * // →     protkcal: 4.27,
 * // →     fatkcal: 8.79,
 * // →     carbkcal: 3.87,
 * // →     protfac: 6.38,
 * // →     ala: 0.325,
 * // →     ala_e: 0.07,
 * // →     arg: 0.21,
 * // →     arg_e: 0.04000000000000001,
 * // →     ash: 1.36,
 * // →     ash_e: 0.6100000000000001,
 * // →     ... } ]
 * ```
 */
export function foundationFoods(txt: string): FoundationFood[] {
  if (index == null) return [];
  const a: FoundationFood[] = []; txt = txt.replace(/\W/g, ' ');
  const mats = index.search(txt); let max = 0;
  for (const mat of mats)
    max = Math.max(max, Object.keys(mat.matchData.metadata).length);
  for (const mat of mats)
    if (Object.keys(mat.matchData.metadata).length === max) a.push(corpus?.get(mat.ref) || {} as FoundationFood);
  return a;
}
//#endregion
