// Copyright (C) 2025 Subhajit Sahu
// SPDX-License-Identifier: AGPL-3.0-or-later
// See LICENSE for full terms
import * as path from "jsr:@std/path@1.0.9";
import * as csv  from "jsr:@std/csv@1.0.6";
import * as infoods from "../../infoods/index.ts";




//#region TYPES
/** Represents a row in the food.csv file. */
interface Food {
  fdc_id: string,
  description: string,
  food_category_id: string,
};


/** Represents a row in the food_category.csv file. */
interface FoodCategory {
  id: string,
  code: string,
  description: string,
};


/** Represents a row in the food_nutrient.csv file. */
interface FoodNutrient {
  id: string,
  fdc_id: string,
  nutrient_id: string,
  amount: string,
};


/** Represents a row in the food_nutrient.csv file. */
interface Nutrient {
  id: string,
  code: string,
  name: string,
  alt_name: string,
  unit_name: string,
  synonyms: string,
};
//#endregion




//#region FUNCTIONS
/** Get a unique key for a food, based on its description. */
function foodKey(description: string) {
  return description.toLowerCase().replace(/\s+/g, " ").trim();
}


/** Load only the interesting parts of the food.csv file. */
async function loadFoodMap(file: string) {
  const map  = new Map<string, Food>();
  const data = await Deno.readTextFile(file);
  const records = csv.parse(data, {skipFirstRow: true, comment: "#"});
  for (const r of records)
    map.set(r.fdc_id, {fdc_id: r.fdc_id, description: r.description, food_category_id: r.food_category_id});
  return map;
}


/** Load the food_category.csv file. */
async function loadFoodCategoryMap(file: string) {
  const map  = new Map<string, FoodCategory>();
  const data = await Deno.readTextFile(file);
  const records = csv.parse(data, {skipFirstRow: true, comment: "#"});
  for (const r of records)
    map.set(r.id, r as unknown as FoodCategory);
  return map;
}


/** Load the interesting parts of the nutrient.csv file. */
async function loadNutrientMap(file: string) {
  await infoods.loadTagnames();
  const map   = new Map<string, Nutrient>();
  const data  = await Deno.readTextFile(file);
  const records = csv.parse(data, {skipFirstRow: true, comment: "#"});
  for (const r of records) {
    const s = infoods.tagnames(r.name)[0];
    if (!s) console.error(`No tagname found for nutrient ${r.name}`);
    map.set(r.id, {id: r.id, code: s.code, name: r.name, alt_name: s.name, unit_name: r.unit_name, synonyms: s.synonyms});
  }
  return map;
}


/** Load only the records in the  food_nutrient.csv file. */
async function loadFoodNutrientRecords(file: string) {
  const data = await Deno.readTextFile(file);
  return csv.parse(data, {skipFirstRow: true, comment: "#"}) as unknown as FoodNutrient[];
}


/** The main function, of course. */
async function main() {
  const assets = path.join(import.meta.dirname || "", "assets");
  const foodMap     = await loadFoodMap(path.join(assets, "food.csv"));
  const categoryMap = await loadFoodCategoryMap(path.join(assets, "food_category.csv"));
  const nutrientMap = await loadNutrientMap(path.join(assets, "nutrient.csv"));
  const records     = await loadFoodNutrientRecords(path.join(assets, "food_nutrient.csv"));
  // Setup food map by food name, instead of fdc_id.
  const foodNameMap = new Map<string, Food>();
  for (const r of foodMap.values())
    foodNameMap.set(foodKey(r.description), r);
  // Obtain the composition of each food.
  const composition      = new Map<string, Record<string, string | number>>();
  const compositionCount = new Map<string, Record<string, number>>();
  const columnDetails    = new Map<string, Record<string, string>>();
  for (const {fdc_id, nutrient_id, amount} of records) {
    const {description, food_category_id} = foodMap.get(fdc_id) as Food;
    const {description: food_category}    = categoryMap.get(food_category_id) || {description: "Unknown"};
    if (!nutrientMap.has(nutrient_id)) { console.warn(`Nutrient ${nutrient_id} not found in nutrient map`); continue; }
    const {code: c, name: cname, alt_name: calt, unit_name: cunit} = nutrientMap.get(nutrient_id) as Nutrient;
    const key = foodKey(description);
    if (!composition.has(key)) composition.set(key, {});
    if (!compositionCount.has(key)) compositionCount.set(key, {});
    const {fdc_id: best_fdc_id} = foodNameMap.get(key) as Food;
    const row = composition.get(key) as Record<string, string | number>;
    const rno = compositionCount.get(key) as Record<string, number>;
    row.fdc_id        = best_fdc_id;
    row.description   = description;
    row.food_category = food_category;
    row[c] = row[c] || 0; (row[c] as number) += parseFloat(amount) * (cunit==="KCAL"? 4.184 : 1);
    rno[c] = rno[c] || 0; rno[c] += 1;
    if (!columnDetails.has(c)) columnDetails.set(c, {code: c, name: cname, alt_name: calt, unit_name: cunit==="KCAL"? "kJ" : cunit});
    // else if (columnDetails.get(c)?.code !== c) console.error(new Error(`Code mismatch for nutrient ${c}: ${columnDetails.get(c)?.code} vs ${c}`));
    // else if (columnDetails.get(c)?.name !== cname) console.error(new Error(`Name mismatch for nutrient ${c}: ${columnDetails.get(c)?.name} vs ${cname}`));
    // else if (columnDetails.get(c)?.alt_name !== calt) console.error(new Error(`Alt name mismatch for nutrient ${c}: ${columnDetails.get(c)?.alt_name} vs ${calt}`));
    // else if (columnDetails.get(c)?.unit_name !== (cunit==="KCAL"? "kJ" : cunit)) console.error(new Error(`Unit name mismatch for nutrient ${c}: ${columnDetails.get(c)?.unit_name} vs ${cunit==="KCAL"? "kJ" : cunit}`));
  }
  // Get a list of all the columns in the compositions map.
  const columns = new Set<string>();
  for (const r of composition.values()) {
    for (const k in r)
      columns.add(k);
  }
  // Write the composition to a CSV file.
  const output = path.join(import.meta.dirname || "", "index.csv");
  let data = [...columns].join(",") + "\n";
  for (const [k, row] of composition) {
    const rno = compositionCount.get(k) as Record<string, number>;
    for (const k in row) {
      if (k === "fdc_id") data += `"${row.fdc_id}",`;
      else if (k === "description")   data += `"${row.description}",`;
      else if (k === "food_category") data += `"${row.food_category}",`;
      else if (rno[k]) data += `${(row[k] as number) / rno[k]},`;
      else throw new Error(`Missing nutrient ${k} in food ${row.fdc_id}`);
    }
    data = data.slice(0, -1) + "\n";
  }
  await Deno.writeTextFile(output, data);
}
main();




/** Generate the index.csv file. */
async function _generateIndexCsv() {
  const assets = path.join(import.meta.dirname || "", "assets");
  await loadFoodMap(path.join(assets, "food.csv"));
  await loadFoodCategoryMap(path.join(assets, "food_category.csv"));
  await writeNutrientMapCsv(path.join(assets, "nutrient.csv"));
}


/** Write the nutrient map to a CSV file. */
async function writeNutrientMapCsv(file: string) {
  await infoods.loadTagnames();
  const codes = new Set<string>();
  const map  = new Map<string, Record<string, string>>();
  const data = await Deno.readTextFile(file);
  const records = csv.parse(data, {skipFirstRow: true, comment: "#"});
  let duplicates = 0;
  for (const r of records) {
    if (/do not use/i.test(r.name)) continue;
    if (/atwater/i.test(r.name)) continue;
    if (/specific gravity/i.test(r.name)) continue;
    if (/non-fat/i.test(r.name)) continue;
    if (/solids, soluble/i.test(r.name)) continue;
    if (/carbohydrate, other/i.test(r.name)) continue;
    if (/lutein\s*[\+\/]\s*zeaxanthin/i.test(r.name)) continue;
    if (/vitamin a, re/i.test(r.name)) continue;
    if (/folate, not 5-mthf/i.test(r.name)) continue;
    if (/Cysteine and methionine/i.test(r.name)) continue;
    if (/Phenylalanine and tyrosine/i.test(r.name)) continue;
    if (/Fatty acids, other than/i.test(r.name)) continue;
    if (/Fatty acids, total.*(NLEA|enoic)/i.test(r.name)) continue;
    if (/^ORAC/i.test(r.name)) continue;
    if (/^Proanthocyanidin/i.test(r.name)) continue;
    if (/^proximate/i.test(r.name)) continue;
    const row = infoods.tagnames(r.name)[0];
    if (codes.has(row?.code)) { console.error(`Duplicate nutrient id: ${row?.code}`); duplicates++; }
    codes.add(row?.code || "");
    console.log(`"${r.name}","${row?.code || ""}","${row?.name || ""}"`);
    map.set(r.id, {id: r.id, name: r.name, unit_name: r.unit_name});
  }
  console.error(`Found ${codes.size} unique nutrient codes.`);
  if (duplicates > 0) console.error(`Found ${duplicates} duplicate nutrient codes.`);
  return map;
}
//#endregion
