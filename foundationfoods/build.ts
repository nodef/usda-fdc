import * as path from "jsr:@std/path";
import * as infoods from "../../infoods/index.ts";


const FACTORS = new Map([
  ["µg",    1e-6],
  ["mg",    1e-3],
  ["g",     1],
  ["kJ",    1e3],
  ["kcal",  4184],
  ["IU",    1],
  ["sp gr", 1]
]);


async function main() {
  await infoods.loadTagnames();
  const data  = JSON.parse(await Deno.readTextFile(path.join(import.meta.dirname || "", "asset.json")));
  const units = new Map<string, string>();
  const columns = new Map<string, Record<string, string>>();
  const records = [];
  for (const f of data.FoundationFoods) {
    const r: Record<string, string | number> = {};
    r.code = f.fdcId;
    r.name = f.description.replace(/\s+/g, " ").trim();
    r.category = f.foodCategory.description;
    // Process nutrient conversion factors.
    for (const c of f.nutrientConversionFactors || []) {
      if (c.type===".CalorieConversionFactor") {
        r.protkcal = c.proteinValue;
        r.fatkcal  = c.fatValue;
        r.carbkcal = c.carbohydrateValue;
      }
      else if (c.type===".ProteinConversionFactor") {
        r.protfac = c.value;
      }
    }
    // Process nutrients.
    const names = new Map<string, string>();
    for (const n of f.foodNutrients) {
      const name = n.nutrient.name;
      const unit = n.nutrient.unitName;
      const val  = n.amount * (FACTORS.get(unit) as number);
      const err  = ((n.max || n.amount) - (n.min || n.amount)) * (FACTORS.get(unit) as number);
      const code = infoods.tagnames(name)[0].code.toLowerCase();
      if (!columns.has(code)) columns.set(code, {code, name, unit});
      if (!names.has(code)) names.set(code, name);
      if (!units.has(code)) units.set(code, unit);
      else if (unit==="kcal") { /* Do nothing */ }
      else if (units.get(code) !== unit) {
        console.warn(`Unit mismatch for (${code}) ${name}: ${unit} != ${names.get(code)} ${units.get(code)}`);
      }
      if (r[code] == null) r[code] = val;
      else if (r[code] !== val) {
        console.warn(`Value mismatch for (${code}) ${name}: ${val} !=  ${names.get(code)} ${r[code]}`);
        r[code] = Math.max(r[code] as number, val);
      }
      if (r[code+"_e"] == null) r[code+"_e"] = err;
      else if (r[code+"_e"] !== err) {
        console.warn(`Error mismatch for (${code}) ${name}: ${err} !=  ${names.get(code)} ${r[code+"_e"]}`);
        r[code+"_e"] = Math.max(r[code+"_e"] as number, err);
      }
    }
    records.push(r);
  }
  // Save the records to CSV file.
  const cols: string[] = [];
  for (const code of units.keys()) {
    cols.push(code);
    cols.push(code+"_e");
  }
  cols.sort();
  cols.unshift("code", "name", "category", "protkcal", "fatkcal", "carbkcal", "protfac");
  const lines = [cols.join(",")];
  for (const r of records) {
    const row: string[] = [];
    for (const c of cols) {
      if (r[c] == null) row.push("");
      else if (typeof r[c] === "number") row.push(r[c].toString());
      else row.push(`"${r[c]}"`);
    }
    lines.push(row.join(","));
  }
  let csv    = lines.join("\n") + "\n";
  let output = path.join(import.meta.dirname || "", "index.csv");
  await Deno.writeTextFile(output, csv);
  // Save units to a separate file.
  lines.length = 0;
  lines.push("code,name,unit");
  for (const {code, name, unit} of [...columns.values()].sort((a, b) => a.code.localeCompare(b.code)))
    lines.push(`"${code}","${name}","${unit}"`);
  csv = lines.join("\n") + "\n";
  output = path.join(import.meta.dirname || "", "columns.csv");
  await Deno.writeTextFile(output, csv);
}
main();
