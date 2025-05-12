<!-- Copyright (C) 2025 Subhajit Sahu -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<!-- See LICENSE for full terms -->

This package currently provides detailed nutrient composition of commodity and minimally processed food samples in the United States. The data is based on [USDA]’s comprehensive source of food composition data, [FoodData Central].

▌
📦 [JSR](https://jsr.io/@nodef/usda-fdc),
📰 [Docs](https://jsr.io/@nodef/usda-fdc/doc).

<br>
<br>


```javascript
import * as usdaFdc from "jsr:@nodef/usda-fdc";


await usdaFdc.loadFoundationFoods();
// Load corpus first

usdaFdc.foundationFoods('kale');
usdaFdc.foundationFoods('raw kale');
// → [ { code: '323505',
// →     name: 'Kale, raw',
// →     category: 'Vegetables and Vegetable Products',
// →     protkcal: 2.44,
// →     fatkcal: 8.37,
// →     carbkcal: 3.57,
// →     protfac: 6.25,
// →     ala: 0,
// →     ala_e: 0,
// →     arg: 0,
// →     arg_e: 0,
// →     ash: 1.54,
// →     ash_e: 0.49,
// →     ... } ]
```

<br>
<br>


### Reference

| Method                  | Action
|-------------------------|-------
| [foundationFoods]       | Detailed nutrient composition of minimally processed food in the US.


[USDA]: https://www.usda.gov/
[FoodData Central]: https://fdc.nal.usda.gov/
[foundationFoods]: https://jsr.io/@nodef/usda-fdc/doc/~/foundationFoods

<br>
<br>


## Foundation Foods

Detailed *nutrient composition* of commodity and minimally processed food samples in the United States.

<br>

```javascript
import * as usdaFdc from "jsr:@nodef/usda-fdc";
// usdaFdc.loadFoundationFoods() → corpus
// usdaFdc.foundationFoodsSql([table], [options]) → SQL statements
// usdaFdc.foundationFoodsCsv() → path of CSV file
// usdaFdc.foundationFoods(query)
// → matches [{code, name, category, ...}]


await usdaFdc.loadFoundationFoods();
// Load corpus first

usdaFdc.foundationFoods('kale');
usdaFdc.foundationFoods('raw kale');
// → [ { code: '323505',
// →     name: 'Kale, raw',
// →     category: 'Vegetables and Vegetable Products',
// →     protkcal: 2.44,
// →     fatkcal: 8.37,
// →     carbkcal: 3.57,
// →     protfac: 6.25,
// →     ala: 0,
// →     ala_e: 0,
// →     arg: 0,
// →     arg_e: 0,
// →     ash: 1.54,
// →     ash_e: 0.49,
// →     ... } ]

usdaFdc.compositions('ricotta cheese');
usdaFdc.compositions('whole milk ricotta');
// → [ { code: '746766',
// →     name: 'Cheese, ricotta, whole milk',
// →     category: 'Dairy and Egg Products',
// →     protkcal: 4.27,
// →     fatkcal: 8.79,
// →     carbkcal: 3.87,
// →     protfac: 6.38,
// →     ala: 0.325,
// →     ala_e: 0.07,
// →     arg: 0.21,
// →     arg_e: 0.04000000000000001,
// →     ash: 1.36,
// →     ash_e: 0.6100000000000001,
// →     ... } ]
```

<br>
<br>


## License

This project is licensed under AGPL-3.0.

<br>
<br>


[![](https://raw.githubusercontent.com/qb40/designs/gh-pages/0/image/11.png)](https://wolfram77.github.io)<br>
[![ORG](https://img.shields.io/badge/org-nodef-green?logo=Org)](https://nodef.github.io)
![](https://ga-beacon.deno.dev/G-RC63DPBH3P:SH3Eq-NoQ9mwgYeHWxu7cw/github.com/nodef/usda-fdc)
