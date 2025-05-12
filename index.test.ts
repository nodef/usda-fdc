// Copyright (C) 2025 Subhajit Sahu
// SPDX-License-Identifier: AGPL-3.0-or-later
// See LICENSE for full terms
import {assertEquals} from "jsr:@std/assert";
import * as usdaFdc from "./index.ts";




//#region TEST FOUNDATION FOODS
Deno.test("Foundation Foods 1", async () => {
  await usdaFdc.loadFoundationFoods();
  const a = usdaFdc.foundationFoods("kale");
  const b = usdaFdc.foundationFoods("raw kale");
  assertEquals(a[0].code, "323505");
  assertEquals(b[0].code, "323505");
});


Deno.test("Foundation Foods 2", async () => {
  await usdaFdc.loadFoundationFoods();
  const a = usdaFdc.foundationFoods("cheese, swiss");
  const b = usdaFdc.foundationFoods("swiss cheese");
  assertEquals(a[0].code, "746767");
  assertEquals(b[0].code, "746767");
});
//#endregion
