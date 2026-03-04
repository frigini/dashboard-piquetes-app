import { useState, useMemo, useEffect, useCallback } from "react";

const PIQUETES_DATA = [{ "id": 1, "sheet": "PIQUETES BRASA", "ct": "40000099", "piquete": "5527-140-6000161257", "peso_apto_kg": 64.566, "maquinas": ["LPA003"], "items": [{ "prio": "10E", "cont": "40000099", "ov": "5527", "op": "10256395", "posicao": "15H V1EL", "material": "PERFIL L AC 45X3MM", "qtd": 1, "peso": 0.971, "maq": "LPA003", "pendencia": "DECAPAGEM" }], "pendencias": ["DECAPAGEM"] }, { "id": 2, "sheet": "PIQUETES BRASA", "ct": "1446", "piquete": "2759-140-6000132105, 2759-150-6000132103, 2759-160-6000132101 e 2759-20-6000129362", "peso_apto_kg": 9.126, "maquinas": ["LPA049"], "items": [{ "prio": "4B", "cont": "1446", "ov": "2759", "op": "10097963", "posicao": "1203H JPSL", "material": "PERFIL L AC 75X5MM", "qtd": 2, "peso": 53.534, "maq": "LPA049", "pendencia": "FALTA GAL" }], "pendencias": ["FALTA GAL"] }, { "id": 3, "sheet": "PIQUETES BRASA", "ct": "1574", "piquete": "3457-40-6000058485, 3457-40-6000058488, 3457-50-6000058510 e 3467-130-6000058042", "peso_apto_kg": 8.847, "maquinas": ["LPA003", "LPA041"], "items": [{ "prio": "10E", "cont": "1574", "ov": "3467", "op": "10256389", "posicao": "52H C61SM", "material": "PERFIL L AC 45X3MM", "qtd": 1, "peso": 4.491, "maq": "LPA003", "pendencia": "FALTA GAL" }, { "prio": "5A", "cont": "1574", "ov": "3457", "op": "10106079", "posicao": "713H C61SL", "material": "PERFIL L AC 90X6MM", "qtd": 2, "peso": 6.804, "maq": "LPA041", "pendencia": "DECAPAGEM" }], "pendencias": ["DECAPAGEM", "FALTA GAL"] }, { "id": 4, "sheet": "PIQUETES BRASA", "ct": "1446", "piquete": "2759-90-6000132084, 2759-90-6000132087, 2765-120-6000134067 e 2765-20-6000129368", "peso_apto_kg": 4.843, "maquinas": ["LPA042", "LPA049"], "items": [{ "prio": "7B", "cont": "1446", "ov": "2759", "op": "10097816", "posicao": "716EH JPSL", "material": "PERFIL L AC 75X6MM", "qtd": 1, "peso": 42.468, "maq": "LPA042", "pendencia": "FALTA GAL" }, { "prio": "7B", "cont": "1446", "ov": "2759", "op": "10268644", "posicao": "716EH JPSL", "material": "PERFIL L AC 75X6MM", "qtd": 1, "peso": 42.468, "maq": "LPA049", "pendencia": "CORTE" }], "pendencias": ["CORTE", "FALTA GAL"] }, { "id": 5, "sheet": "PIQUETES BRASA", "ct": "1574", "piquete": "3457-30-6000058495, 3457-30-6000058496, 3457-40-6000058487 e 3457-60-6000058508", "peso_apto_kg": 7.361, "maquinas": ["LPA041", "LPA042", "LPA043"], "items": [{ "prio": "5A", "cont": "1574", "ov": "3457", "op": "10106582", "posicao": "70G C61SL", "material": "PERFIL L AC 90X6MM", "qtd": 2, "peso": 102.914, "maq": "LPA041", "pendencia": "CORTE" }, { "prio": "5A", "cont": "1574", "ov": "3457", "op": "10103166", "posicao": "303H C61SL", "material": "PERFIL L AC 75X7MM", "qtd": 3, "peso": 74.607, "maq": "LPA042", "pendencia": "CORTE" }, { "prio": "5A", "cont": "1574", "ov": "3457", "op": "10103901", "posicao": "221G C61SL", "material": "PERFIL L AC 100X8MM ", "qtd": 2, "peso": 4.546, "maq": "LPA043", "pendencia": "CORTE" }], "pendencias": ["CORTE"] }, { "id": 6, "sheet": "PIQUETES BRASA", "ct": "1574", "piquete": "3467-40-6000057980, 3467-80-6000058008 e 3505-30-6000058497", "peso_apto_kg": 5.006, "maquinas": ["LPA014"], "items": [{ "prio": "4A", "cont": "1574", "ov": "3467", "op": "10090060", "posicao": "1083H C61SM", "material": "PERFIL L AC 40X4MM", "qtd": 1, "peso": 2.593, "maq": "LPA014", "pendencia": "DECAPAGEM" }, { "prio": "7A", "cont": "1574", "ov": "3505", "op": "10103475", "posicao": "324H C61SL", "material": "PERFIL L AC 50X3MM", "qtd": 10, "peso": 50.11, "maq": "LPA014", "pendencia": "CORTE" }], "pendencias": ["CORTE", "DECAPAGEM"] }, { "id": 7, "sheet": "PIQUETES BRASA", "ct": "1574", "piquete": "3207-60-6000058501, 3284-40-6000058497, 3284-90-6000058506 e 3457-30-6000058497", "peso_apto_kg": 4.138, "maquinas": ["LPA014"], "items": [{ "prio": "7A", "cont": "1574", "ov": "3284", "op": "10103474", "posicao": "324H C61SL", "material": "PERFIL L AC 50X3MM", "qtd": 6, "peso": 30.066, "maq": "LPA014", "pendencia": "CORTE" }], "pendencias": ["CORTE"] }, { "id": 8, "sheet": "PIQUETES BRASA", "ct": "40000099", "piquete": "5527-140-6000161259", "peso_apto_kg": 154.871, "maquinas": ["LPA003", "LPA023"], "items": [{ "prio": "10E", "cont": "40000099", "ov": "5527", "op": "10256385", "posicao": "142H V1EL", "material": "PERFIL L AC 65X5MM", "qtd": 22, "peso": 317.328, "maq": "LPA003", "pendencia": "CORTE" }, { "prio": "10E", "cont": "40000099", "ov": "5527", "op": "10256391", "posicao": "126H V1EL", "material": "PERFIL L AC 75X5MM", "qtd": 2, "peso": 28.878, "maq": "LPA023", "pendencia": "CORTE" }, { "prio": "10E", "cont": "40000099", "ov": "5527", "op": "10256390", "posicao": "195DG V1EL", "material": "PERFIL L AC 75X5MM", "qtd": 5, "peso": 79.26, "maq": "LPA023", "pendencia": "CORTE" }], "pendencias": ["CORTE"] }, { "id": 9, "sheet": "PIQUETES BRASA", "ct": "40000099", "piquete": "5527-140-6000161260", "peso_apto_kg": 106.462, "maquinas": ["LPA012"], "items": [{ "prio": "10E", "cont": "40000099", "ov": "5527", "op": "10256396", "posicao": "258H V1EL", "material": "PERFIL L AC 100X10MM", "qtd": 2, "peso": 7.16, "maq": "LPA012", "pendencia": "CORTE" }], "pendencias": ["CORTE"] }, { "id": 10, "sheet": "PIQUETES BRASA", "ct": "1574", "piquete": "3467-130-6000058044 e 3467-130-6000058045", "peso_apto_kg": 7.747, "maquinas": ["GUI001"], "items": [{ "prio": "3B", "cont": "1574", "ov": "3467", "op": "10087999", "posicao": "165 C61SM", "material": "CHAPA LIS 6,3MM", "qtd": 13, "peso": 66.989, "maq": "GUI001", "pendencia": "DECAPAGEM" }, { "prio": "3B", "cont": "1574", "ov": "3467", "op": "10089262", "posicao": "365 C61SM", "material": "CHAPA LIS 6,3MM", "qtd": 26, "peso": 34.788, "maq": "GUI001", "pendencia": "DECAPAGEM" }], "pendencias": ["DECAPAGEM"] }, { "id": 11, "sheet": "PIQUETES BRASA", "ct": "40000099", "piquete": "5527-140-6000161238 e 5527-140-6000161241", "peso_apto_kg": 3.597, "maquinas": ["LAS001", "PUNC05"], "items": [{ "prio": "7B", "cont": "40000099", "ov": "5527", "op": "10199085", "posicao": "202 V1EL", "material": "CHAPA LIS 3MM", "qtd": 50, "peso": 29.5, "maq": "LAS001", "pendencia": "DECAPAGEM" }, { "prio": "7B", "cont": "40000099", "ov": "5527", "op": "10199086", "posicao": "202 V1EL", "material": "CHAPA LIS 3MM", "qtd": 50, "peso": 29.5, "maq": "LAS001", "pendencia": "FALTA GAL" }, { "prio": "7B", "cont": "40000099", "ov": "5527", "op": "10199087", "posicao": "202 V1EL", "material": "CHAPA LIS 3MM", "qtd": 50, "peso": 29.5, "maq": "LAS001", "pendencia": "FALTA GAL" }, { "prio": "7B", "cont": "40000099", "ov": "5527", "op": "10199088", "posicao": "202 V1EL", "material": "CHAPA LIS 3MM", "qtd": 50, "peso": 29.5, "maq": "LAS001", "pendencia": "FALTA GAL" }, { "prio": "7B", "cont": "40000099", "ov": "5527", "op": "10199089", "posicao": "202 V1EL", "material": "CHAPA LIS 3MM", "qtd": 50, "peso": 29.5, "maq": "LAS001", "pendencia": "FALTA GAL" }, { "prio": "9A", "cont": "40000099", "ov": "5527", "op": "10197235", "posicao": "88 V1EL", "material": "CHAPA LIS 6,3MM", "qtd": 50, "peso": 66.55, "maq": "PUNC05", "pendencia": "DECAPAGEM" }], "pendencias": ["DECAPAGEM", "FALTA GAL"] }, { "id": 12, "sheet": "PIQUETES BRASA", "ct": "1574", "piquete": "3483-70-6000129874", "peso_apto_kg": 15.266, "maquinas": ["GUI001"], "items": [{ "prio": "9B", "cont": "1574", "ov": "3483", "op": "10208381", "posicao": "24 C61CRE", "material": "CHAPA LIS 4,75MM", "qtd": 41, "peso": 96.104, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089990", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089991", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089992", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089993", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089994", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089995", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089996", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089997", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089998", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089999", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10090000", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10090001", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10090002", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10090003", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10090004", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 36, "peso": 89.712, "maq": "GUI001", "pendencia": "CORTE" }], "pendencias": ["CORTE"] }, { "id": 13, "sheet": "PIQUETES BRASA", "ct": "1446", "piquete": "2450-110-6000129364", "peso_apto_kg": 15.806, "maquinas": ["GUI001", "PUNC05"], "items": [{ "prio": "8A", "cont": "1446", "ov": "2450", "op": "10094473", "posicao": "61 JPSL", "material": "CHAPA LIS 9,5MM", "qtd": 50, "peso": 237.9, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1446", "ov": "2450", "op": "10094474", "posicao": "61 JPSL", "material": "CHAPA LIS 9,5MM", "qtd": 50, "peso": 237.9, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "4B", "cont": "1446", "ov": "2450", "op": "10093768", "posicao": "76 JPSL", "material": "CHAPA LIS 4,75MM", "qtd": 50, "peso": 25.1, "maq": "PUNC05", "pendencia": "DECAPAGEM" }, { "prio": "4B", "cont": "1446", "ov": "2450", "op": "10093772", "posicao": "76 JPSL", "material": "CHAPA LIS 4,75MM", "qtd": 16, "peso": 8.032, "maq": "PUNC05", "pendencia": "DECAPAGEM" }], "pendencias": ["CORTE", "DECAPAGEM"] }, { "id": 14, "sheet": "PIQUETES BRASA", "ct": "1574", "piquete": "3207-140-6000058494, 3207-140-6000058498, 3207-80-6000058486 e 3284-40-6000058494", "peso_apto_kg": 6.319, "maquinas": ["GUI001"], "items": [{ "prio": "5A", "cont": "1574", "ov": "3207", "op": "10103820", "posicao": "368 C61SL", "material": "CHAPA LIS 6,3MM", "qtd": 28, "peso": 35.924, "maq": "GUI001", "pendencia": "DECAPAGEM" }, { "prio": "8A", "cont": "1574", "ov": "3284", "op": "10102445", "posicao": "128 C61SL", "material": "CHAPA LIS 8MM", "qtd": 6, "peso": 51.618, "maq": "GUI001", "pendencia": "MARCAR" }, { "prio": "8A", "cont": "1574", "ov": "3207", "op": "10105133", "posicao": "130 C61SL", "material": "CHAPA LIS 8MM", "qtd": 28, "peso": 103.656, "maq": "GUI001", "pendencia": "FALTA GAL" }, { "prio": "8A", "cont": "1574", "ov": "3284", "op": "10105134", "posicao": "130 C61SL", "material": "CHAPA LIS 8MM", "qtd": 12, "peso": 44.424, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3284", "op": "10102115", "posicao": "131 C61SL", "material": "CHAPA LIS 8MM", "qtd": 12, "peso": 39.168, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3284", "op": "10105390", "posicao": "234 C61SL", "material": "CHAPA LIS 8MM", "qtd": 12, "peso": 5.064, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3284", "op": "10106729", "posicao": "236 C61SL", "material": "CHAPA LIS 8MM", "qtd": 12, "peso": 4.308, "maq": "GUI001", "pendencia": "CORTE" }], "pendencias": ["CORTE", "DECAPAGEM", "FALTA GAL", "MARCAR"] }, { "id": 15, "sheet": "PIQUETES BRASA", "ct": "1574", "piquete": "3472-10-6000131766 e 3472-70-6000131786", "peso_apto_kg": 11.27, "maquinas": ["GUI001", "MCC003"], "items": [{ "prio": "3B", "cont": "1574", "ov": "3472", "op": "10088360", "posicao": "34 C61CR", "material": "CHAPA LIS 4,75MM", "qtd": 48, "peso": 29.952, "maq": "GUI001", "pendencia": "DECAPAGEM" }, { "prio": "8A", "cont": "1574", "ov": "3472", "op": "10088974", "posicao": "43 C61CR", "material": "CHAPA LIS 8MM", "qtd": 48, "peso": 294.144, "maq": "MCC003", "pendencia": "CORTE" }], "pendencias": ["CORTE", "DECAPAGEM"] }, { "id": 16, "sheet": "PIQUETES BRASA", "ct": "1574", "piquete": "3483-40-6000129863", "peso_apto_kg": 5.889, "maquinas": ["GUI001"], "items": [{ "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089983", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089984", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089985", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089986", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089987", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089988", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089989", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 36, "peso": 89.712, "maq": "GUI001", "pendencia": "CORTE" }], "pendencias": ["CORTE"] }, { "id": 17, "sheet": "PIQUETES BRASA", "ct": "1574", "piquete": "3505-30-6000058494, 3505-30-6000058499 e 3505-40-6000058486", "peso_apto_kg": 4.433, "maquinas": ["GUI001"], "items": [{ "prio": "8A", "cont": "1574", "ov": "3505", "op": "10102447", "posicao": "128 C61SL", "material": "CHAPA LIS 8MM", "qtd": 10, "peso": 86.03, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3505", "op": "10105135", "posicao": "130 C61SL", "material": "CHAPA LIS 8MM", "qtd": 20, "peso": 74.04, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3505", "op": "10102118", "posicao": "131 C61SL", "material": "CHAPA LIS 8MM", "qtd": 20, "peso": 65.28, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3505", "op": "10105391", "posicao": "234 C61SL", "material": "CHAPA LIS 8MM", "qtd": 20, "peso": 8.44, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3505", "op": "10106728", "posicao": "236 C61SL", "material": "CHAPA LIS 8MM", "qtd": 20, "peso": 7.18, "maq": "GUI001", "pendencia": "RECORTE" }, { "prio": "8A", "cont": "1574", "ov": "3505", "op": "10104021", "posicao": "490 C61SL", "material": "CHAPA LIS 8MM", "qtd": 20, "peso": 49.0, "maq": "GUI001", "pendencia": "MARCAR" }, { "prio": "5A", "cont": "1574", "ov": "3505", "op": "10104582", "posicao": "329 C61SL", "material": "CHAPA LIS 9,5MM", "qtd": 19, "peso": 30.02, "maq": "GUI001", "pendencia": "DECAPAGEM" }], "pendencias": ["CORTE", "DECAPAGEM", "MARCAR", "RECORTE"] }, { "id": 18, "sheet": "PIQUETES BRASA", "ct": "1574", "piquete": "3457-30-6000058498, 3457-40-6000058486 e 4101-20-6000129867", "peso_apto_kg": 0.495, "maquinas": ["GUI001"], "items": [{ "prio": "5A", "cont": "1574", "ov": "3457", "op": "10104266", "posicao": "208 C61SL", "material": "CHAPA LIS 6,3MM", "qtd": 4, "peso": 4.42, "maq": "GUI001", "pendencia": "DECAPAGEM" }, { "prio": "8A", "cont": "1574", "ov": "4101", "op": "10089974", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 48, "peso": 119.616, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3457", "op": "10104022", "posicao": "490 C61SL", "material": "CHAPA LIS 8MM", "qtd": 4, "peso": 9.8, "maq": "GUI001", "pendencia": "MARCAR" }], "pendencias": ["CORTE", "DECAPAGEM", "MARCAR"] }, { "id": 19, "sheet": "PIQUETES BRASA", "ct": "1446/1574", "piquete": "2765-80-6000132102, 3207-100-6000057430, 3284-90-6000058505 e 3457-30-6000058494", "peso_apto_kg": 0.445, "maquinas": ["GUI001", "PUNC05"], "items": [{ "prio": "8A", "cont": "1574", "ov": "3457", "op": "10102448", "posicao": "128 C61SL", "material": "CHAPA LIS 8MM", "qtd": 2, "peso": 17.206, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3457", "op": "10105132", "posicao": "130 C61SL", "material": "CHAPA LIS 8MM", "qtd": 4, "peso": 14.808, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "5A", "cont": "1574", "ov": "3457", "op": "10106727", "posicao": "236 C61SL", "material": "CHAPA LIS 8MM", "qtd": 4, "peso": 1.436, "maq": "GUI001", "pendencia": "FALTA GAL" }, { "prio": "8A", "cont": "1574", "ov": "3457", "op": "10107268", "posicao": "249 C61SL", "material": "CHAPA LIS 8MM", "qtd": 2, "peso": 4.724, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "4A", "cont": "1446", "ov": "2765", "op": "10097590", "posicao": "691 JPSL", "material": "CHAPA LIS 6,3MM", "qtd": 8, "peso": 4.912, "maq": "PUNC05", "pendencia": "DECAPAGEM" }], "pendencias": ["CORTE", "DECAPAGEM", "FALTA GAL"] }, { "id": 20, "sheet": "PIQUETES BRASA", "ct": "1574", "piquete": "3483-50-6000129867 e 3483-60-6000129869", "peso_apto_kg": 5.064, "maquinas": ["GUI001"], "items": [{ "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089939", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089940", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089941", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089942", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089943", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089944", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089945", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089946", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089947", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089948", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089949", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089950", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089951", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089952", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089953", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089954", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089955", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089956", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089957", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089958", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089959", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089960", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089961", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089962", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089963", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089964", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089965", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089966", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089967", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089968", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089969", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089970", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089971", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089972", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10089973", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 20, "peso": 49.84, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10090005", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10090006", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10090007", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10090008", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10090009", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10090010", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 50, "peso": 124.6, "maq": "GUI001", "pendencia": "CORTE" }, { "prio": "8A", "cont": "1574", "ov": "3483", "op": "10090011", "posicao": "102 C61CRE", "material": "CHAPA LIS 8MM", "qtd": 12, "peso": 29.904, "maq": "GUI001", "pendencia": "CORTE" }], "pendencias": ["CORTE"] }, { "id": 21, "sheet": "PIQUETES BRASA", "ct": "40000099", "piquete": "5527-140-6000161258", "peso_apto_kg": 42.71, "maquinas": ["LPA013", "LPA023", "LPA042", "LPA052"], "items": [{ "prio": "-", "cont": "40000099", "ov": "5527", "op": "10197613", "posicao": "249H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 154, "peso": 238.084, "maq": "LPA013", "pendencia": "CORTE" }, { "prio": "-", "cont": "40000099", "ov": "5527", "op": "10198242", "posicao": "279H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 154, "peso": 242.088, "maq": "LPA013", "pendencia": "RECORTE" }, { "prio": "-", "cont": "40000099", "ov": "5527", "op": "10196845", "posicao": "303H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 200, "peso": 129.2, "maq": "LPA013", "pendencia": "CORTE" }, { "prio": "-", "cont": "40000099", "ov": "5527", "op": "10196846", "posicao": "303H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 108, "peso": 69.768, "maq": "LPA013", "pendencia": "CORTE" }, { "prio": "-", "cont": "40000099", "ov": "5527", "op": "10197440", "posicao": "316H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 154, "peso": 135.982, "maq": "LPA013", "pendencia": "CORTE" }, { "prio": "-", "cont": "40000099", "ov": "5527", "op": "10196699", "posicao": "323H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 154, "peso": 873.796, "maq": "LPA013", "pendencia": "RECORTE" }, { "prio": "-", "cont": "40000099", "ov": "5527", "op": "10198838", "posicao": "375H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 154, "peso": 743.512, "maq": "LPA013", "pendencia": "CORTE" }, { "prio": "-", "cont": "40000099", "ov": "5527", "op": "10198419", "posicao": "24H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 154, "peso": 204.204, "maq": "LPA023", "pendencia": "CORTE" }, { "prio": "-", "cont": "40000099", "ov": "5527", "op": "10196927", "posicao": "254H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 200, "peso": 1150.8, "maq": "LPA023", "pendencia": "CORTE" }, { "prio": "-", "cont": "40000099", "ov": "5527", "op": "10196928", "posicao": "254H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 108, "peso": 621.432, "maq": "LPA023", "pendencia": "CORTE" }, { "prio": "-", "cont": "40000099", "ov": "5527", "op": "10197591", "posicao": "285H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 154, "peso": 945.56, "maq": "LPA023", "pendencia": "RECORTE" }, { "prio": "-", "cont": "40000099", "ov": "5527", "op": "10199111", "posicao": "414H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 154, "peso": 947.716, "maq": "LPA023", "pendencia": "RECORTE" }, { "prio": "-", "cont": "40000099", "ov": "5527", "op": "10198810", "posicao": "416H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 154, "peso": 932.47, "maq": "LPA023", "pendencia": "RECORTE" }, { "prio": "-", "cont": "40000099", "ov": "5527", "op": "10198156", "posicao": "349H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 154, "peso": 1058.442, "maq": "LPA042", "pendencia": "RECORTE" }, { "prio": "-", "cont": "40000099", "ov": "5527", "op": "10198857", "posicao": "353H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 154, "peso": 1026.564, "maq": "LPA042", "pendencia": "RECORTE" }, { "prio": "-", "cont": "40000099", "ov": "5527", "op": "10196810", "posicao": "10H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 200, "peso": 964.6, "maq": "LPA052", "pendencia": "CORTE" }, { "prio": "-", "cont": "40000099", "ov": "5527", "op": "10196811", "posicao": "10H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 108, "peso": 520.884, "maq": "LPA052", "pendencia": "CORTE" }, { "prio": "-", "cont": "40000099", "ov": "5527", "op": "10198483", "posicao": "14H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 200, "peso": 615.0, "maq": "LPA052", "pendencia": "CORTE" }, { "prio": "-", "cont": "40000099", "ov": "5527", "op": "10198485", "posicao": "14H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 108, "peso": 332.1, "maq": "LPA052", "pendencia": "CORTE" }, { "prio": "-", "cont": "40000099", "ov": "5527", "op": "10198122", "posicao": "312H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 200, "peso": 999.4, "maq": "LPA052", "pendencia": "CORTE" }, { "prio": "-", "cont": "40000099", "ov": "5527", "op": "10198124", "posicao": "312H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 108, "peso": 539.676, "maq": "LPA052", "pendencia": "CORTE" }, { "prio": "-", "cont": "40000099", "ov": "5527", "op": "10197130", "posicao": "415H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 154, "peso": 932.47, "maq": "LPA052", "pendencia": "CORTE" }, { "prio": "-", "cont": "40000099", "ov": "5527", "op": "10197102", "posicao": "417H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 154, "peso": 917.378, "maq": "LPA052", "pendencia": "CORTE" }, { "prio": "-", "cont": "40000099", "ov": "5527", "op": "10198416", "posicao": "421H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 154, "peso": 715.33, "maq": "LPA052", "pendencia": "CORTE" }, { "prio": "-", "cont": "40000099", "ov": "5527", "op": "10198267", "posicao": "430H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 154, "peso": 641.718, "maq": "LPA052", "pendencia": "CORTE" }, { "prio": "-", "cont": "40000099", "ov": "5527", "op": "10197911", "posicao": "9H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 200, "peso": 1029.8, "maq": "LPA052", "pendencia": "CORTE" }, { "prio": "-", "cont": "40000099", "ov": "5527", "op": "10197912", "posicao": "9H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 108, "peso": 556.092, "maq": "LPA052", "pendencia": "CORTE" }], "pendencias": ["CORTE", "RECORTE"] }, { "id": 22, "sheet": "PIQUETES BRASA", "ct": "40000099", "piquete": "5528-140-6000161258", "peso_apto_kg": 24.406, "maquinas": ["LPA013", "LPA023", "LPA042", "LPA052"], "items": [{ "prio": "-", "cont": "40000099", "ov": "5528", "op": "10197927", "posicao": "249H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 88, "peso": 136.048, "maq": "LPA013", "pendencia": "CORTE" }, { "prio": "-", "cont": "40000099", "ov": "5528", "op": "10198298", "posicao": "279H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 88, "peso": 138.336, "maq": "LPA013", "pendencia": "RECORTE" }, { "prio": "-", "cont": "40000099", "ov": "5528", "op": "10197314", "posicao": "303H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 176, "peso": 113.696, "maq": "LPA013", "pendencia": "CORTE" }, { "prio": "-", "cont": "40000099", "ov": "5528", "op": "10197811", "posicao": "316H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 88, "peso": 77.704, "maq": "LPA013", "pendencia": "RECORTE" }, { "prio": "-", "cont": "40000099", "ov": "5528", "op": "10197142", "posicao": "323H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 88, "peso": 499.312, "maq": "LPA013", "pendencia": "RECORTE" }, { "prio": "-", "cont": "40000099", "ov": "5528", "op": "10198673", "posicao": "375H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 88, "peso": 424.864, "maq": "LPA013", "pendencia": "CORTE" }, { "prio": "-", "cont": "40000099", "ov": "5528", "op": "10198410", "posicao": "24H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 88, "peso": 116.688, "maq": "LPA023", "pendencia": "CORTE" }, { "prio": "-", "cont": "40000099", "ov": "5528", "op": "10197402", "posicao": "254H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 176, "peso": 1012.704, "maq": "LPA023", "pendencia": "CORTE" }, { "prio": "-", "cont": "40000099", "ov": "5528", "op": "10197914", "posicao": "285H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 88, "peso": 540.32, "maq": "LPA023", "pendencia": "DECAPAGEM" }, { "prio": "-", "cont": "40000099", "ov": "5528", "op": "10198915", "posicao": "414H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 88, "peso": 541.552, "maq": "LPA023", "pendencia": "DECAPAGEM" }, { "prio": "-", "cont": "40000099", "ov": "5528", "op": "10198655", "posicao": "416H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 88, "peso": 532.84, "maq": "LPA023", "pendencia": "RECORTE" }, { "prio": "-", "cont": "40000099", "ov": "5528", "op": "10197751", "posicao": "418H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 88, "peso": 524.216, "maq": "LPA023", "pendencia": "DECAPAGEM" }, { "prio": "-", "cont": "40000099", "ov": "5528", "op": "10197322", "posicao": "346H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 88, "peso": 566.368, "maq": "LPA042", "pendencia": "DECAPAGEM" }, { "prio": "-", "cont": "40000099", "ov": "5528", "op": "10198686", "posicao": "353H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 88, "peso": 586.608, "maq": "LPA042", "pendencia": "CORTE" }, { "prio": "-", "cont": "40000099", "ov": "5528", "op": "10197273", "posicao": "10H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 176, "peso": 848.848, "maq": "LPA052", "pendencia": "CORTE" }, { "prio": "-", "cont": "40000099", "ov": "5528", "op": "10198452", "posicao": "14H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 176, "peso": 541.2, "maq": "LPA052", "pendencia": "CORTE" }, { "prio": "-", "cont": "40000099", "ov": "5528", "op": "10198226", "posicao": "312H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 176, "peso": 879.472, "maq": "LPA052", "pendencia": "CORTE" }, { "prio": "-", "cont": "40000099", "ov": "5528", "op": "10197632", "posicao": "415H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 88, "peso": 532.84, "maq": "LPA052", "pendencia": "CORTE" }, { "prio": "-", "cont": "40000099", "ov": "5528", "op": "10197614", "posicao": "417H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 88, "peso": 524.216, "maq": "LPA052", "pendencia": "CORTE" }, { "prio": "-", "cont": "40000099", "ov": "5528", "op": "10198406", "posicao": "421H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 88, "peso": 408.76, "maq": "LPA052", "pendencia": "CORTE" }, { "prio": "-", "cont": "40000099", "ov": "5528", "op": "10198315", "posicao": "430H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 88, "peso": 366.696, "maq": "LPA052", "pendencia": "CORTE" }, { "prio": "-", "cont": "40000099", "ov": "5528", "op": "10198095", "posicao": "9H V1EL", "material": "PERFIL L AC 50X3MM", "qtd": 176, "peso": 906.224, "maq": "LPA052", "pendencia": "CORTE" }], "pendencias": ["CORTE", "DECAPAGEM", "RECORTE"] }, { "id": 23, "sheet": "PIQUETES BRASA", "ct": "1564", "piquete": "2848-50-6000133493", "peso_apto_kg": 20.988, "maquinas": ["LPA056"], "items": [{ "prio": "9A", "cont": "1564", "ov": "2848", "op": "10219117", "posicao": "124G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 200, "peso": 598.4, "maq": "LPA056", "pendencia": "DECAPAGEM" }, { "prio": "9A", "cont": "1564", "ov": "2848", "op": "10219125", "posicao": "124G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 192, "peso": 574.464, "maq": "LPA056", "pendencia": "DECAPAGEM" }], "pendencias": ["DECAPAGEM"] }, { "id": 24, "sheet": "PIQUETES BRASA", "ct": "1564", "piquete": "2845-40-6000133497", "peso_apto_kg": 54.913, "maquinas": ["LPA041"], "items": [{ "prio": "10A", "cont": "1564", "ov": "2845", "op": "10241143", "posicao": "80G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 24, "peso": 1445.088, "maq": "LPA041", "pendencia": "DECAPAGEM" }, { "prio": "10A", "cont": "1564", "ov": "2845", "op": "10241144", "posicao": "80G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 24, "peso": 1445.088, "maq": "LPA041", "pendencia": "CORTE" }, { "prio": "10A", "cont": "1564", "ov": "2845", "op": "10241145", "posicao": "80G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 24, "peso": 1445.088, "maq": "LPA041", "pendencia": "CORTE" }, { "prio": "10A", "cont": "1564", "ov": "2845", "op": "10241146", "posicao": "80G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 24, "peso": 1445.088, "maq": "LPA041", "pendencia": "CORTE" }, { "prio": "10A", "cont": "1564", "ov": "2845", "op": "10241148", "posicao": "80G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 24, "peso": 1445.088, "maq": "LPA041", "pendencia": "CORTE" }], "pendencias": ["CORTE", "DECAPAGEM"] }, { "id": 25, "sheet": "PIQUETES BRASA", "ct": "1564", "piquete": "2848-40-6000133497", "peso_apto_kg": 19.99, "maquinas": ["LPA043"], "items": [{ "prio": "9B", "cont": "1564", "ov": "2848", "op": "10241180", "posicao": "80G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 24, "peso": 1445.088, "maq": "LPA043", "pendencia": "CORTE" }], "pendencias": ["CORTE"] }, { "id": 26, "sheet": "PIQUETES BRASA", "ct": "1564", "piquete": "2852-90-6000133484", "peso_apto_kg": 10.519, "maquinas": ["LPA030", "LPA031", "LPA041", "LPA057"], "items": [{ "prio": "9B", "cont": "1564", "ov": "2852", "op": "10241249", "posicao": "73H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 200, "peso": 738.6, "maq": "LPA030", "pendencia": "RECORTE" }, { "prio": "9B", "cont": "1564", "ov": "2852", "op": "10241329", "posicao": "72H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 200, "peso": 738.6, "maq": "LPA031", "pendencia": "FALTA GAL" }, { "prio": "10A", "cont": "1564", "ov": "2852", "op": "10256517", "posicao": "72H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 3, "peso": 11.079, "maq": "LPA031", "pendencia": "CORTE" }, { "prio": "10A", "cont": "1564", "ov": "2852", "op": "10256500", "posicao": "73H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 3, "peso": 11.079, "maq": "LPA031", "pendencia": "CORTE" }, { "prio": "10A", "cont": "1564", "ov": "2852", "op": "10223327", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 12, "peso": 50.196, "maq": "LPA041", "pendencia": "CORTE" }, { "prio": "9B", "cont": "1564", "ov": "2852", "op": "10223309", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA057", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2852", "op": "10223313", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA057", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2852", "op": "10223318", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA057", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2852", "op": "10223322", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA057", "pendencia": "CHANFRO" }], "pendencias": ["CHANFRO", "CORTE", "FALTA GAL", "RECORTE"] }, { "id": 27, "sheet": "PIQUETES BRASA", "ct": "1564", "piquete": "2979-60-6000133484", "peso_apto_kg": 15.131, "maquinas": ["LPA031", "LPA041"], "items": [{ "prio": "9B", "cont": "1564", "ov": "2979", "op": "10241337", "posicao": "72H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 200, "peso": 738.6, "maq": "LPA031", "pendencia": "DECAPAGEM" }, { "prio": "9B", "cont": "1564", "ov": "2979", "op": "10225106", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA041", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2979", "op": "10225110", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA041", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2979", "op": "10225115", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA041", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2979", "op": "10225125", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA041", "pendencia": "FALTA GAL" }, { "prio": "10A", "cont": "1564", "ov": "2979", "op": "10225130", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 168, "peso": 702.744, "maq": "LPA041", "pendencia": "CORTE" }], "pendencias": ["CHANFRO", "CORTE", "DECAPAGEM", "FALTA GAL"] }, { "id": 28, "sheet": "PIQUETES BRASA", "ct": "1564", "piquete": "2838-70-6000133484", "peso_apto_kg": 22.178, "maquinas": ["LPA031", "LPA041"], "items": [{ "prio": "9B", "cont": "1564", "ov": "2838", "op": "10241326", "posicao": "72H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 200, "peso": 738.6, "maq": "LPA031", "pendencia": "DECAPAGEM" }, { "prio": "9B", "cont": "1564", "ov": "2838", "op": "10241327", "posicao": "72H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 200, "peso": 738.6, "maq": "LPA031", "pendencia": "DECAPAGEM" }, { "prio": "9B", "cont": "1564", "ov": "2838", "op": "10223163", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA041", "pendencia": "FALTA GAL" }, { "prio": "9B", "cont": "1564", "ov": "2838", "op": "10223169", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA041", "pendencia": "FALTA GAL" }, { "prio": "9B", "cont": "1564", "ov": "2838", "op": "10223191", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA041", "pendencia": "FALTA GAL" }, { "prio": "9B", "cont": "1564", "ov": "2838", "op": "10223202", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA041", "pendencia": "CHANFRO" }, { "prio": "10A", "cont": "1564", "ov": "2838", "op": "10223212", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 112, "peso": 468.496, "maq": "LPA041", "pendencia": "CHANFRO" }], "pendencias": ["CHANFRO", "DECAPAGEM", "FALTA GAL"] }, { "id": 29, "sheet": "PIQUETES BRASA", "ct": "1564", "piquete": "2979-70-6000133493", "peso_apto_kg": 33.608, "maquinas": ["LPA049", "LPA056"], "items": [{ "prio": "9B", "cont": "1564", "ov": "2979", "op": "10220576", "posicao": "123G R51CRB", "material": "PERFIL L AC 90X6MM", "qtd": 200, "peso": 735.2, "maq": "LPA049", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2979", "op": "10220581", "posicao": "123G R51CRB", "material": "PERFIL L AC 90X6MM", "qtd": 200, "peso": 735.2, "maq": "LPA049", "pendencia": "DECAPAGEM" }, { "prio": "9B", "cont": "1564", "ov": "2979", "op": "10220592", "posicao": "123G R51CRB", "material": "PERFIL L AC 90X6MM", "qtd": 200, "peso": 735.2, "maq": "LPA049", "pendencia": "DECAPAGEM" }, { "prio": "9B", "cont": "1564", "ov": "2979", "op": "10220596", "posicao": "123G R51CRB", "material": "PERFIL L AC 90X6MM", "qtd": 148, "peso": 544.048, "maq": "LPA049", "pendencia": "CORTE" }, { "prio": "9A", "cont": "1564", "ov": "2979", "op": "10221617", "posicao": "124G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 200, "peso": 598.4, "maq": "LPA056", "pendencia": "FALTA GAL" }], "pendencias": ["CHANFRO", "CORTE", "DECAPAGEM", "FALTA GAL"] }, { "id": 30, "sheet": "PIQUETES BRASA", "ct": "1564", "piquete": "2845-80-6000133493", "peso_apto_kg": 32.332, "maquinas": ["LPA049", "LPA056"], "items": [{ "prio": "9B", "cont": "1564", "ov": "2845", "op": "10221322", "posicao": "123G R51CRB", "material": "PERFIL L AC 90X6MM", "qtd": 200, "peso": 735.2, "maq": "LPA049", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2845", "op": "10221326", "posicao": "123G R51CRB", "material": "PERFIL L AC 90X6MM", "qtd": 200, "peso": 735.2, "maq": "LPA049", "pendencia": "CORTE" }, { "prio": "9A", "cont": "1564", "ov": "2845", "op": "10222033", "posicao": "124G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 200, "peso": 598.4, "maq": "LPA056", "pendencia": "CHANFRO" }, { "prio": "9A", "cont": "1564", "ov": "2845", "op": "10222053", "posicao": "124G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 112, "peso": 335.104, "maq": "LPA056", "pendencia": "CHANFRO" }], "pendencias": ["CHANFRO", "CORTE"] }, { "id": 31, "sheet": "PIQUETES BRASA", "ct": "1564", "piquete": "2843-90-6000133493", "peso_apto_kg": 26.66, "maquinas": ["LPA049", "LPA056"], "items": [{ "prio": "9B", "cont": "1564", "ov": "2843", "op": "10222793", "posicao": "123G R51CRB", "material": "PERFIL L AC 90X6MM", "qtd": 200, "peso": 735.2, "maq": "LPA049", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2843", "op": "10222800", "posicao": "123G R51CRB", "material": "PERFIL L AC 90X6MM", "qtd": 200, "peso": 735.2, "maq": "LPA049", "pendencia": "FALTA GAL" }, { "prio": "9B", "cont": "1564", "ov": "2843", "op": "10222810", "posicao": "123G R51CRB", "material": "PERFIL L AC 90X6MM", "qtd": 152, "peso": 558.752, "maq": "LPA049", "pendencia": "CORTE" }, { "prio": "9A", "cont": "1564", "ov": "2843", "op": "10223201", "posicao": "124G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 152, "peso": 454.784, "maq": "LPA056", "pendencia": "CHANFRO" }], "pendencias": ["CHANFRO", "CORTE", "FALTA GAL"] }, { "id": 32, "sheet": "PIQUETES BRASA", "ct": "1564", "piquete": "2852-20-6000133493", "peso_apto_kg": 21.271, "maquinas": ["LPA049", "LPA056"], "items": [{ "prio": "9B", "cont": "1564", "ov": "2852", "op": "10215007", "posicao": "123G R51CRB", "material": "PERFIL L AC 90X6MM", "qtd": 200, "peso": 735.2, "maq": "LPA049", "pendencia": "CORTE" }, { "prio": "9B", "cont": "1564", "ov": "2852", "op": "10215009", "posicao": "123G R51CRB", "material": "PERFIL L AC 90X6MM", "qtd": 200, "peso": 735.2, "maq": "LPA049", "pendencia": "CORTE" }, { "prio": "9B", "cont": "1564", "ov": "2852", "op": "10215011", "posicao": "123G R51CRB", "material": "PERFIL L AC 90X6MM", "qtd": 200, "peso": 735.2, "maq": "LPA049", "pendencia": "FALTA GAL" }, { "prio": "9A", "cont": "1564", "ov": "2852", "op": "10215063", "posicao": "124G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 200, "peso": 598.4, "maq": "LPA056", "pendencia": "CHANFRO" }], "pendencias": ["CHANFRO", "CORTE", "FALTA GAL"] }, { "id": 33, "sheet": "PIQUETES BRASA", "ct": "1564", "piquete": "2850-50-6000133493", "peso_apto_kg": 16.166, "maquinas": ["LPA056"], "items": [{ "prio": "9A", "cont": "1564", "ov": "2850", "op": "10219102", "posicao": "124G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 200, "peso": 598.4, "maq": "LPA056", "pendencia": "CHANFRO" }, { "prio": "9A", "cont": "1564", "ov": "2850", "op": "10219107", "posicao": "124G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 200, "peso": 598.4, "maq": "LPA056", "pendencia": "CHANFRO" }, { "prio": "9A", "cont": "1564", "ov": "2850", "op": "10219112", "posicao": "124G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 56, "peso": 167.552, "maq": "LPA056", "pendencia": "CHANFRO" }], "pendencias": ["CHANFRO"] }, { "id": 34, "sheet": "PIQUETES BRASA", "ct": "1564", "piquete": "2845-40-6000133496", "peso_apto_kg": 52.956, "maquinas": ["LPA041", "LPA043", "LPA056"], "items": [{ "prio": "9B", "cont": "1564", "ov": "2845", "op": "10230237", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA041", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2845", "op": "10230247", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA041", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2845", "op": "10230249", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA041", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2845", "op": "10230252", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA041", "pendencia": "CHANFRO" }, { "prio": "10A", "cont": "1564", "ov": "2845", "op": "10230254", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 24, "peso": 100.392, "maq": "LPA041", "pendencia": "CORTE" }, { "prio": "9A", "cont": "1564", "ov": "2845", "op": "10235113", "posicao": "10G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 200, "peso": 470.8, "maq": "LPA043", "pendencia": "CHANFRO" }, { "prio": "9A", "cont": "1564", "ov": "2845", "op": "10235116", "posicao": "10G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 200, "peso": 470.8, "maq": "LPA043", "pendencia": "CHANFRO" }, { "prio": "9A", "cont": "1564", "ov": "2845", "op": "10235122", "posicao": "10G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 200, "peso": 470.8, "maq": "LPA043", "pendencia": "CHANFRO" }, { "prio": "9A", "cont": "1564", "ov": "2845", "op": "10235125", "posicao": "10G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 112, "peso": 263.648, "maq": "LPA043", "pendencia": "CHANFRO" }, { "prio": "9A", "cont": "1564", "ov": "2845", "op": "10240740", "posicao": "6G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 50, "peso": 1480.65, "maq": "LPA043", "pendencia": "CHANFRO" }, { "prio": "9A", "cont": "1564", "ov": "2845", "op": "10240742", "posicao": "6G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 50, "peso": 1480.65, "maq": "LPA043", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2845", "op": "10230232", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA043", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2845", "op": "10230234", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA043", "pendencia": "CORTE" }, { "prio": "9B", "cont": "1564", "ov": "2845", "op": "10230213", "posicao": "14G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 195, "peso": 1497.795, "maq": "LPA056", "pendencia": "ABA" }, { "prio": "9B", "cont": "1564", "ov": "2845", "op": "10230216", "posicao": "14G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 33, "peso": 253.473, "maq": "LPA056", "pendencia": "CORTE" }, { "prio": "9B", "cont": "1564", "ov": "2845", "op": "10217472", "posicao": "15G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 33, "peso": 253.473, "maq": "LPA056", "pendencia": "CORTE" }], "pendencias": ["ABA", "CHANFRO", "CORTE"] }, { "id": 35, "sheet": "PIQUETES BRASA", "ct": "1564", "piquete": "2848-40-6000133496", "peso_apto_kg": 34.375, "maquinas": ["LPA041", "LPA043", "LPA056", "LPA057"], "items": [{ "prio": "10A", "cont": "1564", "ov": "2848", "op": "10230181", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 184, "peso": 769.672, "maq": "LPA041", "pendencia": "CHANFRO" }, { "prio": "9A", "cont": "1564", "ov": "2848", "op": "10235070", "posicao": "10G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 200, "peso": 470.8, "maq": "LPA043", "pendencia": "CHANFRO" }, { "prio": "9A", "cont": "1564", "ov": "2848", "op": "10240734", "posicao": "6G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 50, "peso": 1480.65, "maq": "LPA043", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2848", "op": "10230175", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA043", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2848", "op": "10230177", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA043", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2848", "op": "10230179", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA043", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2848", "op": "10230091", "posicao": "14G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 94, "peso": 722.014, "maq": "LPA056", "pendencia": "RECORTE" }, { "prio": "9B", "cont": "1564", "ov": "2848", "op": "10217337", "posicao": "13G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 36, "peso": 215.316, "maq": "LPA057", "pendencia": "CORTE" }], "pendencias": ["CHANFRO", "CORTE", "RECORTE"] }, { "id": 36, "sheet": "PIQUETES BRASA", "ct": "1564", "piquete": "2850-40-6000133496", "peso_apto_kg": 26.478, "maquinas": ["LPA041", "LPA043", "LPA056", "LPA057"], "items": [{ "prio": "10A", "cont": "1564", "ov": "2850", "op": "10230210", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 112, "peso": 468.496, "maq": "LPA041", "pendencia": "CHANFRO" }, { "prio": "9A", "cont": "1564", "ov": "2850", "op": "10235087", "posicao": "10G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 200, "peso": 470.8, "maq": "LPA043", "pendencia": "CHANFRO" }, { "prio": "9A", "cont": "1564", "ov": "2850", "op": "10240738", "posicao": "6G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 50, "peso": 1480.65, "maq": "LPA043", "pendencia": "DECAPAGEM" }, { "prio": "9B", "cont": "1564", "ov": "2850", "op": "10230205", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA043", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2850", "op": "10230208", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA043", "pendencia": "CHANFRO" }, { "prio": "9A", "cont": "1564", "ov": "2850", "op": "10230279", "posicao": "7G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 50, "peso": 1480.65, "maq": "LPA056", "pendencia": "DECAPAGEM" }, { "prio": "9A", "cont": "1564", "ov": "2850", "op": "10230281", "posicao": "7G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 50, "peso": 1480.65, "maq": "LPA056", "pendencia": "FALTA GAL" }, { "prio": "9B", "cont": "1564", "ov": "2850", "op": "10217340", "posicao": "13G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 114, "peso": 681.834, "maq": "LPA057", "pendencia": "RECORTE" }], "pendencias": ["CHANFRO", "DECAPAGEM", "FALTA GAL", "RECORTE"] }, { "id": 37, "sheet": "PIQUETES BRASA", "ct": "1564", "piquete": "2979-30-6000133496", "peso_apto_kg": 54.349, "maquinas": ["LPA043", "LPA049", "LPA056", "LPA057"], "items": [{ "prio": "9A", "cont": "1564", "ov": "2979", "op": "10219533", "posicao": "10G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 200, "peso": 470.8, "maq": "LPA043", "pendencia": "CHANFRO" }, { "prio": "9A", "cont": "1564", "ov": "2979", "op": "10219535", "posicao": "10G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 200, "peso": 470.8, "maq": "LPA043", "pendencia": "CHANFRO" }, { "prio": "9A", "cont": "1564", "ov": "2979", "op": "10219541", "posicao": "10G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 200, "peso": 470.8, "maq": "LPA043", "pendencia": "CHANFRO" }, { "prio": "9A", "cont": "1564", "ov": "2979", "op": "10219543", "posicao": "10G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 136, "peso": 320.144, "maq": "LPA043", "pendencia": "CHANFRO" }, { "prio": "9A", "cont": "1564", "ov": "2979", "op": "10232041", "posicao": "6G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 50, "peso": 1480.65, "maq": "LPA043", "pendencia": "CORTE" }, { "prio": "9A", "cont": "1564", "ov": "2979", "op": "10232049", "posicao": "6G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 50, "peso": 1480.65, "maq": "LPA043", "pendencia": "CHANFRO" }, { "prio": "9A", "cont": "1564", "ov": "2979", "op": "10232057", "posicao": "6G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 34, "peso": 1006.842, "maq": "LPA043", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2979", "op": "10216676", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA043", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2979", "op": "10216678", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA043", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2979", "op": "10216680", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA043", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2979", "op": "10216682", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA043", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2979", "op": "10216684", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA043", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2979", "op": "10216686", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA043", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2979", "op": "10216690", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA043", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2979", "op": "10216692", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA043", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2979", "op": "10216694", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA043", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2979", "op": "10216672", "posicao": "58G R51CRB", "material": "PERFIL L AC 90X6MM", "qtd": 200, "peso": 735.2, "maq": "LPA049", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2979", "op": "10216674", "posicao": "58G R51CRB", "material": "PERFIL L AC 90X6MM", "qtd": 136, "peso": 499.936, "maq": "LPA049", "pendencia": "CHANFRO" }, { "prio": "9A", "cont": "1564", "ov": "2979", "op": "10216711", "posicao": "7G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 34, "peso": 1006.842, "maq": "LPA056", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2979", "op": "10216663", "posicao": "14G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 195, "peso": 1497.795, "maq": "LPA056", "pendencia": "RECORTE" }, { "prio": "9B", "cont": "1564", "ov": "2979", "op": "10215957", "posicao": "15G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 39, "peso": 299.559, "maq": "LPA056", "pendencia": "RECORTE" }, { "prio": "9B", "cont": "1564", "ov": "2979", "op": "10215960", "posicao": "12G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 1, "peso": 5.981, "maq": "LPA057", "pendencia": "ABA" }, { "prio": "9B", "cont": "1564", "ov": "2979", "op": "10215963", "posicao": "12G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 1, "peso": 5.981, "maq": "LPA057", "pendencia": "ABA" }, { "prio": "9B", "cont": "1564", "ov": "2979", "op": "10215966", "posicao": "12G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 1, "peso": 5.981, "maq": "LPA057", "pendencia": "ABA" }, { "prio": "9B", "cont": "1564", "ov": "2979", "op": "10215969", "posicao": "12G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 1, "peso": 5.981, "maq": "LPA057", "pendencia": "ABA" }, { "prio": "9B", "cont": "1564", "ov": "2979", "op": "10215972", "posicao": "12G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 1, "peso": 5.981, "maq": "LPA057", "pendencia": "ABA" }, { "prio": "9B", "cont": "1564", "ov": "2979", "op": "10215975", "posicao": "12G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 1, "peso": 5.981, "maq": "LPA057", "pendencia": "ABA" }, { "prio": "9B", "cont": "1564", "ov": "2979", "op": "10215977", "posicao": "12G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 1, "peso": 5.981, "maq": "LPA057", "pendencia": "ABA" }, { "prio": "9B", "cont": "1564", "ov": "2979", "op": "10215979", "posicao": "12G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 1, "peso": 5.981, "maq": "LPA057", "pendencia": "ABA" }, { "prio": "9B", "cont": "1564", "ov": "2979", "op": "10215893", "posicao": "13G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 1196.2, "maq": "LPA057", "pendencia": "FALTA GAL" }, { "prio": "9B", "cont": "1564", "ov": "2979", "op": "10215896", "posicao": "13G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 34, "peso": 203.354, "maq": "LPA057", "pendencia": "CORTE" }], "pendencias": ["ABA", "CHANFRO", "CORTE", "FALTA GAL", "RECORTE"] }, { "id": 38, "sheet": "PIQUETES BRASA", "ct": "1564", "piquete": "2838-10-6000133496", "peso_apto_kg": 72.001, "maquinas": ["LPA041", "LPA043", "LPA049", "LPA056"], "items": [{ "prio": "10A", "cont": "1564", "ov": "2838", "op": "10214742", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA041", "pendencia": "CHANFRO" }, { "prio": "10A", "cont": "1564", "ov": "2838", "op": "10214743", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA041", "pendencia": "CHANFRO" }, { "prio": "10A", "cont": "1564", "ov": "2838", "op": "10214744", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA041", "pendencia": "CHANFRO" }, { "prio": "10A", "cont": "1564", "ov": "2838", "op": "10214745", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 164, "peso": 686.012, "maq": "LPA041", "pendencia": "CORTE" }, { "prio": "9A", "cont": "1564", "ov": "2838", "op": "10216837", "posicao": "10G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 200, "peso": 470.8, "maq": "LPA043", "pendencia": "CHANFRO" }, { "prio": "9A", "cont": "1564", "ov": "2838", "op": "10216843", "posicao": "10G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 8, "peso": 18.832, "maq": "LPA043", "pendencia": "CHANFRO" }, { "prio": "9A", "cont": "1564", "ov": "2838", "op": "10231056", "posicao": "6G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 50, "peso": 1480.65, "maq": "LPA043", "pendencia": "CORTE" }, { "prio": "9A", "cont": "1564", "ov": "2838", "op": "10231058", "posicao": "6G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 50, "peso": 1480.65, "maq": "LPA043", "pendencia": "CHANFRO" }, { "prio": "9A", "cont": "1564", "ov": "2838", "op": "10231062", "posicao": "6G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 50, "peso": 1480.65, "maq": "LPA043", "pendencia": "DECAPAGEM" }, { "prio": "9B", "cont": "1564", "ov": "2838", "op": "10214746", "posicao": "58G R51CRB", "material": "PERFIL L AC 90X6MM", "qtd": 200, "peso": 735.2, "maq": "LPA049", "pendencia": "FALTA GAL" }, { "prio": "9B", "cont": "1564", "ov": "2838", "op": "10214747", "posicao": "58G R51CRB", "material": "PERFIL L AC 90X6MM", "qtd": 200, "peso": 735.2, "maq": "LPA049", "pendencia": "CHANFRO" }, { "prio": "9A", "cont": "1564", "ov": "2838", "op": "10214771", "posicao": "7G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 50, "peso": 1480.65, "maq": "LPA056", "pendencia": "DECAPAGEM" }, { "prio": "9A", "cont": "1564", "ov": "2838", "op": "10214772", "posicao": "7G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 50, "peso": 1480.65, "maq": "LPA056", "pendencia": "DECAPAGEM" }, { "prio": "9A", "cont": "1564", "ov": "2838", "op": "10214775", "posicao": "7G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 50, "peso": 1480.65, "maq": "LPA056", "pendencia": "CHANFRO" }, { "prio": "9A", "cont": "1564", "ov": "2838", "op": "10214776", "posicao": "7G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 50, "peso": 1480.65, "maq": "LPA056", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2838", "op": "10214765", "posicao": "14G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 195, "peso": 1497.795, "maq": "LPA056", "pendencia": "RECORTE" }, { "prio": "9B", "cont": "1564", "ov": "2838", "op": "10214463", "posicao": "15G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 115, "peso": 883.315, "maq": "LPA056", "pendencia": "RECORTE" }], "pendencias": ["CHANFRO", "CORTE", "DECAPAGEM", "FALTA GAL", "RECORTE"] }, { "id": 39, "sheet": "PIQUETES BRASA", "ct": "1564", "piquete": "2843-10-6000133496", "peso_apto_kg": 43.665, "maquinas": ["LPA041", "LPA043", "LPA049", "LPA056"], "items": [{ "prio": "10A", "cont": "1564", "ov": "2843", "op": "10159769", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA041", "pendencia": "CHANFRO" }, { "prio": "10A", "cont": "1564", "ov": "2843", "op": "10159770", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA041", "pendencia": "CHANFRO" }, { "prio": "10A", "cont": "1564", "ov": "2843", "op": "10159771", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA041", "pendencia": "CHANFRO" }, { "prio": "10A", "cont": "1564", "ov": "2843", "op": "10159772", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA041", "pendencia": "CHANFRO" }, { "prio": "10A", "cont": "1564", "ov": "2843", "op": "10159773", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA041", "pendencia": "CHANFRO" }, { "prio": "10A", "cont": "1564", "ov": "2843", "op": "10159774", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA041", "pendencia": "CHANFRO" }, { "prio": "10A", "cont": "1564", "ov": "2843", "op": "10159775", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 104, "peso": 435.032, "maq": "LPA041", "pendencia": "CHANFRO" }, { "prio": "9A", "cont": "1564", "ov": "2843", "op": "10154650", "posicao": "10G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 200, "peso": 470.8, "maq": "LPA043", "pendencia": "CHANFRO" }, { "prio": "9A", "cont": "1564", "ov": "2843", "op": "10154653", "posicao": "10G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 152, "peso": 357.808, "maq": "LPA043", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2843", "op": "10157625", "posicao": "58G R51CRB", "material": "PERFIL L AC 90X6MM", "qtd": 200, "peso": 735.2, "maq": "LPA049", "pendencia": "DECAPAGEM" }, { "prio": "9A", "cont": "1564", "ov": "2843", "op": "10157614", "posicao": "7G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 50, "peso": 1480.65, "maq": "LPA056", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2843", "op": "10154324", "posicao": "15G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 188, "peso": 1444.028, "maq": "LPA056", "pendencia": "RECORTE" }], "pendencias": ["CHANFRO", "DECAPAGEM", "RECORTE"] }, { "id": 40, "sheet": "PIQUETES BRASA", "ct": "1564", "piquete": "2852-60-6000133496", "peso_apto_kg": 34.839, "maquinas": ["LPA041", "LPA043", "LPA049", "LPA056", "LPA057"], "items": [{ "prio": "10A", "cont": "1564", "ov": "2852", "op": "10224891", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA041", "pendencia": "CHANFRO" }, { "prio": "10A", "cont": "1564", "ov": "2852", "op": "10224896", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA041", "pendencia": "CHANFRO" }, { "prio": "10A", "cont": "1564", "ov": "2852", "op": "10224903", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA041", "pendencia": "CHANFRO" }, { "prio": "10A", "cont": "1564", "ov": "2852", "op": "10224908", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA041", "pendencia": "CHANFRO" }, { "prio": "10A", "cont": "1564", "ov": "2852", "op": "10224913", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA041", "pendencia": "CHANFRO" }, { "prio": "9A", "cont": "1564", "ov": "2852", "op": "10228502", "posicao": "10G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 200, "peso": 470.8, "maq": "LPA043", "pendencia": "CHANFRO" }, { "prio": "9A", "cont": "1564", "ov": "2852", "op": "10228506", "posicao": "10G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 200, "peso": 470.8, "maq": "LPA043", "pendencia": "CHANFRO" }, { "prio": "9A", "cont": "1564", "ov": "2852", "op": "10228510", "posicao": "10G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 200, "peso": 470.8, "maq": "LPA043", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2852", "op": "10225078", "posicao": "58G R51CRB", "material": "PERFIL L AC 90X6MM", "qtd": 200, "peso": 735.2, "maq": "LPA049", "pendencia": "CHANFRO" }, { "prio": "9A", "cont": "1564", "ov": "2852", "op": "10225180", "posicao": "7G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 50, "peso": 1480.65, "maq": "LPA056", "pendencia": "CHANFRO" }, { "prio": "9A", "cont": "1564", "ov": "2852", "op": "10225185", "posicao": "7G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 50, "peso": 1480.65, "maq": "LPA056", "pendencia": "CHANFRO" }, { "prio": "9A", "cont": "1564", "ov": "2852", "op": "10225189", "posicao": "7G R51CRB", "material": "PERFIL L AC 75X6MM", "qtd": 50, "peso": 1480.65, "maq": "LPA056", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2852", "op": "10219911", "posicao": "13G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 150, "peso": 897.15, "maq": "LPA057", "pendencia": "FALTA GAL" }], "pendencias": ["CHANFRO", "FALTA GAL"] }, { "id": 41, "sheet": "PRÓXIMOS", "ct": "1564", "piquete": "2838-60-6000133481", "peso_apto_kg": 14.182, "maquinas": ["LPA031", "LPA041"], "items": [{ "prio": "10B", "cont": "1564", "ov": "2838", "op": "10256526", "posicao": "72H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 116, "peso": 428.388, "maq": "LPA031", "pendencia": "CORTE" }, { "prio": "10B", "cont": "1564", "ov": "2838", "op": "10256509", "posicao": "73H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 116, "peso": 428.388, "maq": "LPA031", "pendencia": "CORTE" }, { "prio": "10A", "cont": "1564", "ov": "2838", "op": "10224960", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 64, "peso": 267.712, "maq": "LPA041", "pendencia": "CORTE" }], "pendencias": ["CORTE"] }, { "id": 42, "sheet": "PRÓXIMOS", "ct": "1564", "piquete": "2843-60-6000133484", "peso_apto_kg": 12.125, "maquinas": ["LPA030", "LPA031", "LPA041"], "items": [{ "prio": "10A", "cont": "1564", "ov": "2843", "op": "10241239", "posicao": "73H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 200, "peso": 738.6, "maq": "LPA030", "pendencia": "DECAPAGEM" }, { "prio": "10A", "cont": "1564", "ov": "2843", "op": "10241335", "posicao": "72H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 200, "peso": 738.6, "maq": "LPA031", "pendencia": "CORTE" }, { "prio": "10B", "cont": "1564", "ov": "2843", "op": "10256524", "posicao": "72H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 34, "peso": 125.562, "maq": "LPA031", "pendencia": "CORTE" }, { "prio": "10B", "cont": "1564", "ov": "2843", "op": "10256481", "posicao": "73H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 34, "peso": 125.562, "maq": "LPA031", "pendencia": "CORTE" }, { "prio": "9B", "cont": "1564", "ov": "2843", "op": "10225135", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA041", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2843", "op": "10225138", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA041", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2843", "op": "10225143", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA041", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2843", "op": "10225148", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA041", "pendencia": "CHANFRO" }, { "prio": "10A", "cont": "1564", "ov": "2843", "op": "10225152", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 136, "peso": 568.888, "maq": "LPA041", "pendencia": "CORTE" }], "pendencias": ["CHANFRO", "CORTE", "DECAPAGEM"] }, { "id": 43, "sheet": "PRÓXIMOS", "ct": "1564", "piquete": "2843-20-6000045161, 2843-50-6000045163 e 2843-70-6000133481", "peso_apto_kg": 12.614, "maquinas": ["LPA031", "LPA041"], "items": [{ "prio": "10B", "cont": "1564", "ov": "2843", "op": "10256537", "posicao": "72H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 8, "peso": 29.544, "maq": "LPA031", "pendencia": "CORTE" }, { "prio": "10B", "cont": "1564", "ov": "2843", "op": "10256539", "posicao": "72H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 2, "peso": 7.386, "maq": "LPA031", "pendencia": "CORTE" }, { "prio": "10B", "cont": "1564", "ov": "2843", "op": "10256543", "posicao": "72H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 86, "peso": 317.598, "maq": "LPA031", "pendencia": "CORTE" }, { "prio": "10B", "cont": "1564", "ov": "2843", "op": "10256484", "posicao": "73H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 2, "peso": 7.386, "maq": "LPA031", "pendencia": "CORTE" }, { "prio": "10B", "cont": "1564", "ov": "2843", "op": "10256487", "posicao": "73H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 8, "peso": 29.544, "maq": "LPA031", "pendencia": "CORTE" }, { "prio": "10B", "cont": "1564", "ov": "2843", "op": "10256511", "posicao": "73H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 86, "peso": 317.598, "maq": "LPA031", "pendencia": "CORTE" }, { "prio": "10A", "cont": "1564", "ov": "2843", "op": "10215123", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 8, "peso": 33.464, "maq": "LPA041", "pendencia": "CORTE" }, { "prio": "10A", "cont": "1564", "ov": "2843", "op": "10219330", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 32, "peso": 133.856, "maq": "LPA041", "pendencia": "CHANFRO" }, { "prio": "10A", "cont": "1564", "ov": "2843", "op": "10223222", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 144, "peso": 602.352, "maq": "LPA041", "pendencia": "CORTE" }], "pendencias": ["CHANFRO", "CORTE"] }, { "id": 44, "sheet": "PRÓXIMOS", "ct": "1564", "piquete": "2845-60-6000133481", "peso_apto_kg": 7.335, "maquinas": ["LPA031", "LPA041"], "items": [{ "prio": "10B", "cont": "1564", "ov": "2845", "op": "10256545", "posicao": "72H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 60, "peso": 221.58, "maq": "LPA031", "pendencia": "CORTE" }, { "prio": "10B", "cont": "1564", "ov": "2845", "op": "10256508", "posicao": "73H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 60, "peso": 221.58, "maq": "LPA031", "pendencia": "CORTE" }, { "prio": "9B", "cont": "1564", "ov": "2845", "op": "10225157", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA041", "pendencia": "CHANFRO" }, { "prio": "10A", "cont": "1564", "ov": "2845", "op": "10225161", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 40, "peso": 167.32, "maq": "LPA041", "pendencia": "CORTE" }], "pendencias": ["CHANFRO", "CORTE"] }, { "id": 45, "sheet": "PRÓXIMOS", "ct": "1564", "piquete": "2845-70-6000133484", "peso_apto_kg": 17.929, "maquinas": ["LPA031", "LPA041", "LPA043", "LPA057"], "items": [{ "prio": "10A", "cont": "1564", "ov": "2845", "op": "10241341", "posicao": "72H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 200, "peso": 738.6, "maq": "LPA031", "pendencia": "DECAPAGEM" }, { "prio": "10B", "cont": "1564", "ov": "2845", "op": "10256521", "posicao": "72H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 146, "peso": 539.178, "maq": "LPA031", "pendencia": "CORTE" }, { "prio": "10B", "cont": "1564", "ov": "2845", "op": "10256498", "posicao": "73H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 146, "peso": 539.178, "maq": "LPA031", "pendencia": "CORTE" }, { "prio": "10A", "cont": "1564", "ov": "2845", "op": "10222942", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 184, "peso": 769.672, "maq": "LPA041", "pendencia": "CORTE" }, { "prio": "9B", "cont": "1564", "ov": "2845", "op": "10222921", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA043", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2845", "op": "10222929", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA043", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2845", "op": "10222935", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA043", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2845", "op": "10222898", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA057", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2845", "op": "10222907", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA057", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2845", "op": "10222914", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA057", "pendencia": "CHANFRO" }], "pendencias": ["CHANFRO", "CORTE", "DECAPAGEM"] }, { "id": 46, "sheet": "PRÓXIMOS", "ct": "1564", "piquete": "2848-60-6000045163, 2848-70-6000133481 e 2848-80-6000133484", "peso_apto_kg": 16.665, "maquinas": ["LPA031", "LPA041"], "items": [{ "prio": "10A", "cont": "1564", "ov": "2848", "op": "10241331", "posicao": "72H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 200, "peso": 738.6, "maq": "LPA031", "pendencia": "CORTE" }, { "prio": "10B", "cont": "1564", "ov": "2848", "op": "10256529", "posicao": "72H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 52, "peso": 192.036, "maq": "LPA031", "pendencia": "CORTE" }, { "prio": "10B", "cont": "1564", "ov": "2848", "op": "10256536", "posicao": "72H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 4, "peso": 14.772, "maq": "LPA031", "pendencia": "CORTE" }, { "prio": "10B", "cont": "1564", "ov": "2848", "op": "10256541", "posicao": "72H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 22, "peso": 81.246, "maq": "LPA031", "pendencia": "CORTE" }, { "prio": "10B", "cont": "1564", "ov": "2848", "op": "10256482", "posicao": "73H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 22, "peso": 81.246, "maq": "LPA031", "pendencia": "CORTE" }, { "prio": "10B", "cont": "1564", "ov": "2848", "op": "10256488", "posicao": "73H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 4, "peso": 14.772, "maq": "LPA031", "pendencia": "CORTE" }, { "prio": "10B", "cont": "1564", "ov": "2848", "op": "10256503", "posicao": "73H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 52, "peso": 192.036, "maq": "LPA031", "pendencia": "CORTE" }, { "prio": "9B", "cont": "1564", "ov": "2848", "op": "10222581", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA041", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2848", "op": "10222585", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA041", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2848", "op": "10222591", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA041", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2848", "op": "10222594", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA041", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2848", "op": "10222599", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA041", "pendencia": "CHANFRO" }, { "prio": "10A", "cont": "1564", "ov": "2848", "op": "10222603", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 8, "peso": 33.464, "maq": "LPA041", "pendencia": "CHANFRO" }, { "prio": "10A", "cont": "1564", "ov": "2848", "op": "10223229", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 88, "peso": 368.104, "maq": "LPA041", "pendencia": "CHANFRO" }, { "prio": "10A", "cont": "1564", "ov": "2848", "op": "10225166", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 16, "peso": 66.928, "maq": "LPA041", "pendencia": "CORTE" }], "pendencias": ["CHANFRO", "CORTE"] }, { "id": 47, "sheet": "PRÓXIMOS", "ct": "1564", "piquete": "2850-60-6000133484", "peso_apto_kg": 8.446, "maquinas": ["LPA031", "LPA041"], "items": [{ "prio": "10A", "cont": "1564", "ov": "2850", "op": "10241339", "posicao": "72H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 163, "peso": 601.959, "maq": "LPA031", "pendencia": "CORTE" }, { "prio": "9B", "cont": "1564", "ov": "2850", "op": "10225087", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA041", "pendencia": "FALTA GAL" }, { "prio": "9B", "cont": "1564", "ov": "2850", "op": "10225091", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA041", "pendencia": "CHANFRO" }, { "prio": "9B", "cont": "1564", "ov": "2850", "op": "10225095", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA041", "pendencia": "FALTA GAL" }, { "prio": "10A", "cont": "1564", "ov": "2850", "op": "10225100", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 52, "peso": 217.516, "maq": "LPA041", "pendencia": "CORTE" }], "pendencias": ["CHANFRO", "CORTE", "FALTA GAL"] }, { "id": 48, "sheet": "PRÓXIMOS", "ct": "1564", "piquete": "2850-70-6000133481", "peso_apto_kg": 5.991, "maquinas": ["LPA031", "LPA041"], "items": [{ "prio": "10B", "cont": "1564", "ov": "2850", "op": "10256544", "posicao": "72H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 49, "peso": 180.957, "maq": "LPA031", "pendencia": "CORTE" }, { "prio": "10B", "cont": "1564", "ov": "2850", "op": "10256510", "posicao": "73H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 49, "peso": 180.957, "maq": "LPA031", "pendencia": "CORTE" }, { "prio": "10A", "cont": "1564", "ov": "2850", "op": "10222717", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 196, "peso": 819.868, "maq": "LPA041", "pendencia": "CORTE" }], "pendencias": ["CORTE"] }, { "id": 49, "sheet": "PRÓXIMOS", "ct": "1564", "piquete": "2850-80-6000045163, 2850-90-6000045161, 2852-40-6000045163 e 2852-50-6000045161", "peso_apto_kg": 1.908, "maquinas": ["LPA031", "LPA041"], "items": [{ "prio": "10B", "cont": "1564", "ov": "2850", "op": "10256534", "posicao": "72H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 2, "peso": 7.386, "maq": "LPA031", "pendencia": "CORTE" }, { "prio": "10B", "cont": "1564", "ov": "2850", "op": "10256535", "posicao": "72H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 4, "peso": 14.772, "maq": "LPA031", "pendencia": "CORTE" }, { "prio": "10B", "cont": "1564", "ov": "2852", "op": "10256538", "posicao": "72H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 2, "peso": 7.386, "maq": "LPA031", "pendencia": "CORTE" }, { "prio": "10B", "cont": "1564", "ov": "2852", "op": "10256486", "posicao": "73H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 2, "peso": 7.386, "maq": "LPA031", "pendencia": "CORTE" }, { "prio": "10B", "cont": "1564", "ov": "2850", "op": "10256489", "posicao": "73H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 2, "peso": 7.386, "maq": "LPA031", "pendencia": "CORTE" }, { "prio": "10A", "cont": "1564", "ov": "2852", "op": "10219179", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 8, "peso": 33.464, "maq": "LPA041", "pendencia": "CORTE" }, { "prio": "10A", "cont": "1564", "ov": "2850", "op": "10222411", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 16, "peso": 66.928, "maq": "LPA041", "pendencia": "CORTE" }, { "prio": "10A", "cont": "1564", "ov": "2850", "op": "10223228", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 8, "peso": 33.464, "maq": "LPA041", "pendencia": "CORTE" }], "pendencias": ["CORTE"] }, { "id": 50, "sheet": "PRÓXIMOS", "ct": "1564", "piquete": "2852-30-6000133481", "peso_apto_kg": 7.458, "maquinas": ["LPA031", "LPA041"], "items": [{ "prio": "10B", "cont": "1564", "ov": "2852", "op": "10256542", "posicao": "72H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 61, "peso": 225.273, "maq": "LPA031", "pendencia": "CORTE" }, { "prio": "10B", "cont": "1564", "ov": "2852", "op": "10256506", "posicao": "73H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 61, "peso": 225.273, "maq": "LPA031", "pendencia": "CORTE" }, { "prio": "10A", "cont": "1564", "ov": "2852", "op": "10216627", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA041", "pendencia": "CHANFRO" }, { "prio": "10A", "cont": "1564", "ov": "2852", "op": "10216629", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 44, "peso": 184.052, "maq": "LPA041", "pendencia": "CHANFRO" }], "pendencias": ["CHANFRO", "CORTE"] }, { "id": 51, "sheet": "PRÓXIMOS", "ct": "1564", "piquete": "2979-40-6000045163", "peso_apto_kg": 4.125, "maquinas": ["LPA031", "LPA041"], "items": [{ "prio": "10B", "cont": "1564", "ov": "2979", "op": "10256532", "posicao": "72H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 18, "peso": 66.474, "maq": "LPA031", "pendencia": "CORTE" }, { "prio": "10B", "cont": "1564", "ov": "2979", "op": "10256492", "posicao": "73H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 18, "peso": 66.474, "maq": "LPA031", "pendencia": "CORTE" }, { "prio": "10A", "cont": "1564", "ov": "2979", "op": "10216924", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 72, "peso": 301.176, "maq": "LPA041", "pendencia": "CORTE" }], "pendencias": ["CORTE"] }, { "id": 52, "sheet": "PRÓXIMOS", "ct": "1564", "piquete": "2979-50-6000133481", "peso_apto_kg": 12.715, "maquinas": ["LPA031", "LPA041"], "items": [{ "prio": "10B", "cont": "1564", "ov": "2979", "op": "10256546", "posicao": "72H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 104, "peso": 384.072, "maq": "LPA031", "pendencia": "CORTE" }, { "prio": "10B", "cont": "1564", "ov": "2979", "op": "10256507", "posicao": "73H R51CRB", "material": "PERFIL L AC 40X3MM", "qtd": 104, "peso": 384.072, "maq": "LPA031", "pendencia": "CORTE" }, { "prio": "10A", "cont": "1564", "ov": "2979", "op": "10217536", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA041", "pendencia": "CORTE" }, { "prio": "10A", "cont": "1564", "ov": "2979", "op": "10217540", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 200, "peso": 836.6, "maq": "LPA041", "pendencia": "CORTE" }, { "prio": "10A", "cont": "1564", "ov": "2979", "op": "10217544", "posicao": "81G R51CRB", "material": "PERFIL L AC 90X7MM", "qtd": 16, "peso": 66.928, "maq": "LPA041", "pendencia": "CORTE" }], "pendencias": ["CORTE"] }];

// ─── BRAMETAL DESIGN SYSTEM ────────────────────────────────────────────────
const T = {
  red: "#E8001D",
  redDark: "#9B0013",
  redGlow: "#E8001D44",
  black: "#0A0A0A",
  surface: "#121212",
  card: "#1A1A1A",
  cardHov: "#202020",
  border: "#2A2A2A",
  muted: "#3A3A3A",
  text: "#F0F0F0",
  sub: "#888888",
  dim: "#444444",
};

const STATUS = {
  "CONCLUÍDO": { bg: "#0A1F0F", fg: "#22C55E", border: "#166534", glow: "#22C55E33" },
  "EM PROGRESSO": { bg: "#0A1628", fg: "#3B82F6", border: "#1E40AF", glow: "#3B82F633" },
  "BLOQUEADO": { bg: "#1A0808", fg: "#EF4444", border: "#991B1B", glow: "#EF444433" },
  "AGUARDANDO": { bg: "#1A1400", fg: "#F59E0B", border: "#92400E", glow: "#F59E0B33" },
};
const SOPTS = ["AGUARDANDO", "EM PROGRESSO", "CONCLUÍDO", "BLOQUEADO"];

const PEND = {
  CORTE: { bg: "#071420", fg: "#38BDF8", bd: "#0369A1" },
  DECAPAGEM: { bg: "#071A0E", fg: "#4ADE80", bd: "#15803D" },
  "FALTA GAL": { bg: "#1A0707", fg: "#F87171", bd: "#B91C1C" },
  CHANFRO: { bg: "#120720", fg: "#A78BFA", bd: "#7C3AED" },
  RECORTE: { bg: "#1A1200", fg: "#FCD34D", bd: "#B45309" },
  MARCAR: { bg: "#061A1A", fg: "#2DD4BF", bd: "#0F766E" },
  ABA: { bg: "#1A0D00", fg: "#FB923C", bd: "#C2410C" },
};
const DP = { bg: "#111", fg: "#666", bd: "#333" };

const LOGO_SRC = "data:image/png;base64,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";

// ─── MICRO COMPONENTS ──────────────────────────────────────────────────────
const Badge = ({ label, style: s = {} }) => {
  const c = STATUS[label] || DP;
  return (
    <span style={{
      background: c.bg, color: c.fg, border: `1px solid ${c.border}`,
      borderRadius: 4, padding: "2px 9px", fontSize: 9, fontWeight: 700,
      letterSpacing: .8, boxShadow: `0 0 8px ${c.glow || "transparent"}`, ...s
    }}>
      {label}
    </span>
  );
};

const Tag = ({ label }) => {
  const c = PEND[label] || DP;
  return (
    <span style={{
      background: c.bg, color: c.fg, border: `1px solid ${c.bd}`,
      borderRadius: 3, padding: "2px 7px", fontSize: 9, fontWeight: 700, letterSpacing: .5
    }}>
      {label}
    </span>
  );
};

const MachineTag = ({ label }) => (
  <span style={{
    background: "#111", color: "#555", border: "1px solid #222",
    borderRadius: 3, padding: "2px 6px", fontSize: 9, fontFamily: "monospace"
  }}>
    {label}
  </span>
);

// ─── ANIMATED PROGRESS RING ────────────────────────────────────────────────
const Ring = ({ pct, size = 80, stroke = 7, color = T.red, bg = "#1A1A1A" }) => {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={bg} strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray .8s cubic-bezier(.4,0,.2,1)" }} />
    </svg>
  );
};

// ─── SPARKLINE ─────────────────────────────────────────────────────────────
const Sparkline = ({ data, color = T.red, h = 40, w = 120 }) => {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => `${(i / (Math.max(data.length - 1, 1))) * (w - 4) + 2},${h - 2 - ((v / max) * (h - 4))}`).join(" ");
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      {data.map((v, i) => {
        const x = (i / (Math.max(data.length - 1, 1))) * (w - 4) + 2;
        const y = h - 2 - ((v / max) * (h - 4));
        return <circle key={i} cx={x} cy={y} r="2" fill={color} />;
      })}
    </svg>
  );
};

// ─── STACKED BAR ───────────────────────────────────────────────────────────
const StackedBar = ({ segments, total, h = 10 }) => (
  <div style={{ display: "flex", height: h, borderRadius: h, overflow: "hidden", background: T.muted, gap: 1 }}>
    {segments.map(({ pct, color }, i) => (
      <div key={i} style={{ width: `${pct}%`, background: color, transition: "width .6s cubic-bezier(.4,0,.2,1)" }} />
    ))}
  </div>
);

// ─── HORIZONTAL BAR CHART ──────────────────────────────────────────────────
const HBar = ({ label, value, max, color, sub, onClick, active }) => (
  <div onClick={onClick} style={{
    cursor: onClick ? "pointer" : "default",
    padding: "8px 10px", borderRadius: 7, marginBottom: 4,
    background: active ? "#1E1E1E" : "transparent",
    border: `1px solid ${active ? color : "transparent"}`,
    transition: "all .2s"
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, alignItems: "center" }}>
      <span style={{ fontSize: 10, color: active ? color : T.sub, fontWeight: active ? 700 : 400 }}>{label}</span>
      <span style={{ fontSize: 10, color: T.text, fontWeight: 700 }}>{value}<span style={{ color: T.dim, marginLeft: 4, fontWeight: 400 }}>{sub}</span></span>
    </div>
    <div style={{ height: 6, background: T.muted, borderRadius: 6, overflow: "hidden" }}>
      <div style={{
        height: "100%", width: `${max > 0 ? (value / max) * 100 : 0}%`, background: color,
        borderRadius: 6, transition: "width .6s cubic-bezier(.4,0,.2,1)",
        boxShadow: active ? `0 0 8px ${color}66` : "none"
      }} />
    </div>
  </div>
);

// ─── LINE CHART ────────────────────────────────────────────────────────────
const LineChart = ({ data }) => {
  if (!data.length) return (
    <div style={{ padding: "30px 0", textAlign: "center", color: T.dim, fontSize: 11 }}>
      Atualize piquetes para ver a evolucao
    </div>
  );
  const W = 340, H = 100, maxV = Math.max(...data.map(d => d.v), 1);
  const px = (i) => 16 + (i / Math.max(data.length - 1, 1)) * (W - 32);
  const py = (v) => H - 16 - ((v / maxV) * (H - 28));
  const pts = data.map((d, i) => [px(i), py(d.v)]);
  const linePts = pts.map(p => p.join(",")).join(" ");
  const area = `M${pts[0][0]},${H} ` + pts.map(p => `L${p[0]},${p[1]}`).join(" ") + ` L${pts[pts.length - 1][0]},${H} Z`;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={T.red} stopOpacity=".35" />
          <stop offset="100%" stopColor={T.red} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#areaFill)" />
      <polyline points={linePts} fill="none" stroke={T.red} strokeWidth="2" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p[0]} cy={p[1]} r="3.5" fill={T.red} stroke={T.surface} strokeWidth="1.5" />
          <text x={p[0]} y={p[1] - 8} textAnchor="middle" fill={T.sub} fontSize="8" fontFamily="monospace">{data[i].v}</text>
          {data.length <= 8 && <text x={p[0]} y={H - 2} textAnchor="middle" fill={T.dim} fontSize="7">{data[i].d.slice(0, 5)}</text>}
        </g>
      ))}
      <line x1="16" y1={H - 14} x2={W - 16} y2={H - 14} stroke={T.border} strokeWidth="1" />
    </svg>
  );
};

// ─── MAIN DASHBOARD ────────────────────────────────────────────────────────
export default function App() {
  const [updates, setUpdates] = useState({});
  const [history, setHistory] = useState([]);
  const [view, setView] = useState("dash");
  const [sheetF, setSheetF] = useState("TODOS");
  const [pendF, setPendF] = useState("TODAS");
  const [maqF, setMaqF] = useState("TODAS");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState({});
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [actPend, setActPend] = useState(null);
  const [actMaq, setActMaq] = useState(null);
  const [importedData, setImportedData] = useState([]);
  const [importStatus, setImportStatus] = useState(null);
  const [importDragging, setImportDragging] = useState(false);
  const [dynData, setDynData] = useState(null); // override PIQUETES_DATA
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const today = now.toLocaleDateString("pt-BR");
  const timeStr = now.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });

  useEffect(() => {
    const load = async () => {
      try {
        if (window.storage) {
          const a = await window.storage.get("piq_updates"); if (a) setUpdates(JSON.parse(a.value));
          const b = await window.storage.get("piq_history"); if (b) setHistory(JSON.parse(b.value));
          const dyn = await window.storage.get("piq_dyn"); if (dyn) setDynData(JSON.parse(dyn.value));
        }
      } catch { }
    };
    load();
  }, []);

  const persist = (u, h) => {
    setUpdates(u);
    if (h !== undefined) setHistory(h);
    try {
      if (window.storage) {
        window.storage.set("piq_updates", JSON.stringify(u));
        if (h !== undefined) window.storage.set("piq_history", JSON.stringify(h));
      }
    } catch { }
  };

  const activeData = dynData || PIQUETES_DATA;
  const sheets = useMemo(() => ["TODOS", ...new Set(activeData.map(p => p.sheet || p.situacao || "TODOS"))], [dynData]);
  const allPends = useMemo(() => { const s = new Set(); activeData.forEach(p => (p.pendencias || []).forEach(x => s.add(x))); return [...s].sort(); }, [dynData]);
  const allMaqs = useMemo(() => { const s = new Set(); activeData.forEach(p => (p.maquinas || []).forEach(m => s.add(m))); return [...s].sort(); }, [dynData]);

  const filtered = useMemo(() => activeData.filter(p => {
    if (sheetF !== "TODOS" && (p.sheet || p.situacao || "TODOS") !== sheetF) return false;
    if (pendF !== "TODAS" && !(p.pendencias || []).includes(pendF)) return false;
    if (maqF !== "TODAS" && !(p.maquinas || []).includes(maqF)) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!p.piquete.toLowerCase().includes(q) && !p.ct.includes(q) &&
        !((p.items || p.itens) || []).some(i => (i.material || i.desc || "").toLowerCase().includes(q))) return false;
    }
    return true;
  }), [sheetF, pendF, maqF, search]);

  const pendSum = useMemo(() => {
    const c = {}; filtered.forEach(p => p.pendencias.forEach(x => { c[x] = (c[x] || 0) + 1; })); return c;
  }, [filtered]);

  const analytics = useMemo(() => {
    const all = activeData;
    const concl = all.filter(p => updates[p.id]?.status === "CONCLUÍDO").length;
    const prog = all.filter(p => updates[p.id]?.status === "EM PROGRESSO").length;
    const bloq = all.filter(p => updates[p.id]?.status === "BLOQUEADO").length;
    const agua = all.length - concl - prog - bloq;
    const open = all.filter(p => updates[p.id]?.status !== "CONCLUÍDO");
    const pendC = {}, pendW = {}, maqC = {};
    open.forEach(p => {
      p.pendencias.forEach(x => { pendC[x] = (pendC[x] || 0) + 1; pendW[x] = (pendW[x] || 0) + p.peso_apto_kg; });
      p.maquinas.forEach(m => { maqC[m] = (maqC[m] || 0) + 1; });
    });
    const gPend = Object.entries(pendC).sort((a, b) => b[1] - a[1]);
    const gMaq = Object.entries(maqC).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const esforco = open.map(p => ({ ...p, score: (p.peso_apto_kg || p.peso_kg || 0) / Math.max((p.items || p.itens || []).length, 1), pos: (p.items || p.itens || []).length })).sort((a, b) => b.score - a.score).slice(0, 10);
    const topPeso = [...open].sort((a, b) => (b.peso_apto_kg || b.peso_kg || 0) - (a.peso_apto_kg || a.peso_kg || 0)).slice(0, 10);
    const dayMap = {};
    history.forEach(e => { if (e.changes?.status === "CONCLUÍDO") dayMap[e.date] = (dayMap[e.date] || 0) + 1; });
    const evoKeys = Object.keys(dayMap).sort((a, b) => { const pa = a.split("/"), pb = b.split("/"); return new Date(`${pa[2]}-${pa[1]}-${pa[0]}`) - new Date(`${pb[2]}-${pb[1]}-${pb[0]}`); });
    let cum = 0; const evo = evoKeys.map(d => { cum += dayMap[d]; return { d, v: cum }; });
    const totalPeso = all.reduce((a, p) => a + (p.peso_apto_kg || p.peso_kg || 0), 0);
    const pendPeso = open.reduce((a, p) => a + (p.peso_apto_kg || p.peso_kg || 0), 0);
    const pendPos = open.reduce((a, p) => a + p.items.length, 0);
    return { total: all.length, concl, prog, bloq, agua, open, pendC, pendW, gPend, gMaq, esforco, topPeso, evo, totalPeso, pendPeso, pendPos };
  }, [updates, history]);

  const openEdit = p => {
    const u = updates[p.id] || {};
    setEditForm({ status: u.status || "AGUARDANDO", obs: u.obs || "", pesoRealizado: u.pesoRealizado || "", responsavel: u.responsavel || "" });
    setEditId(editId === p.id ? null : p.id);
  };
  const saveEdit = piq => {
    const newU = { ...updates, [piq.id]: { ...(updates[piq.id] || {}), ...editForm, updatedAt: today } };
    const entry = { date: today, time: new Date().toLocaleTimeString("pt-BR"), piqueteId: piq.id, piquete: piq.piquete, ct: piq.ct, changes: { ...editForm } };
    persist(newU, [entry, ...history].slice(0, 300));
    setEditId(null);
  };

  const pct = analytics.total > 0 ? Math.round(analytics.concl / analytics.total * 100) : 0;
  const MAQ_COLORS = ["#E8001D", "#F97316", "#EAB308", "#22C55E", "#3B82F6", "#8B5CF6", "#EC4899", "#14B8A6", "#F43F5E", "#84CC16"];

  // ─── IMPORTAR XLSX ───────────────────────────────────────────────────────
  const processFile = (file) => {
    setImportStatus({ type: "info", msg: "Lendo arquivo..." });
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        // Parse xlsx manually - read binary and extract data
        // We'll use a simple CSV-like approach via text parsing
        // Actually read as ArrayBuffer and parse with simple xlsx logic
        const data = e.target.result;
        const bytes = new Uint8Array(data);

        // Check if it's a valid xlsx (PK header = 50 4B)
        if (bytes[0] !== 0x50 || bytes[1] !== 0x4B) {
          setImportStatus({ type: "err", msg: "Arquivo inválido. Use .xlsx exportado do Excel." });
          return;
        }

        setImportStatus({ type: "err", msg: "Para ler .xlsx no browser, exporte a planilha como CSV primeiro (Arquivo → Salvar Como → CSV UTF-8) e importe o .csv." });
      } catch (err) {
        setImportStatus({ type: "err", msg: "Erro: " + err.message });
      }
    };

    // Try CSV first
    if (file.name.toLowerCase().endsWith('.csv')) {
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          const lines = text.split(/\r?\n/).filter(l => l.trim());
          const header = lines[0].split(';').map(h => h.replace(/"/g, '').trim());
          // Map columns
          const idx = {
            plano: header.indexOf('Plano GAL'),
            ct: header.indexOf('Contrato'),
            piquete: header.indexOf('Piquete'),
            descr: header.indexOf('Descrição Embalagem'),
            peso: header.indexOf('Peso Piquete'),
            situacao: header.indexOf('Situação Piquete'),
            status_op: header.indexOf('Status OP'),
            dt: header.indexOf('Data Contratual'),
            ov: header.indexOf('Ordem Venda'),
            cod_comp: header.indexOf('Cód. Componente'),
            desc_comp: header.indexOf('Descrição Componente'),
            qtd: header.indexOf('Qtde Necessária'),
            peso_comp: header.indexOf('Peso OP Componente'),
            etapa: header.indexOf('Etapa Atual'),
          };

          const piqMap = {};
          for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(';').map(c => c.replace(/^"|"$/g, '').trim());
            const piq = cols[idx.piquete];
            if (!piq) continue;
            if (!piqMap[piq]) {
              piqMap[piq] = {
                id: Object.keys(piqMap).length + 1,
                plano: cols[idx.plano] || '-',
                ct: cols[idx.ct] || '-',
                piquete: piq,
                descr: cols[idx.descr] || '',
                peso_kg: parseFloat(cols[idx.peso]?.replace(',', '.')) || 0,
                situacao: cols[idx.situacao] || '',
                status_op: cols[idx.status_op] || '',
                dt_contrat: cols[idx.dt] || '',
                ov: cols[idx.ov] || '',
                pendencias: new Set(),
                itens: [],
              };
            }
            const etapa = cols[idx.etapa] || '-';
            if (etapa && etapa !== 'Finalizado' && etapa !== '-') piqMap[piq].pendencias.add(etapa);
            if (cols[idx.cod_comp]) {
              piqMap[piq].itens.push({
                cod: cols[idx.cod_comp],
                desc: cols[idx.desc_comp] || '',
                qtd: parseInt(cols[idx.qtd]) || 0,
                peso: parseFloat(cols[idx.peso_comp]?.replace(',', '.')) || 0,
                etapa,
              });
            }
          }

          const result = Object.values(piqMap).map(p => ({ ...p, pendencias: [...p.pendencias] }));
          setImportedData(result);
          setImportStatus({ type: "ok", msg: `✓ ${result.length} piquetes lidos com sucesso! Revise abaixo e clique em "USAR ESSES DADOS".` });
        } catch (err) {
          setImportStatus({ type: "err", msg: "Erro ao ler CSV: " + err.message });
        }
      };
      reader.readAsText(file, 'UTF-8');
    } else {
      // XLSX: instruct user
      setImportStatus({ type: "err", msg: "Para importar: abra a planilha no Excel → Arquivo → Salvar como → CSV UTF-8 (delimitado por ponto e vírgula) → importe o arquivo .csv aqui." });
      reader.readAsArrayBuffer(file);
    }
  };

  const confirmImport = async () => {
    setDynData(importedData);
    try {
      if (window.storage) await window.storage.set("piq_dyn", JSON.stringify(importedData));
    } catch { }
    setImportStatus({ type: "ok", msg: `✓ ${importedData.length} piquetes carregados no dashboard!` });
    setTimeout(() => setView("dash"), 1200);
  };

  // ─── SIDEBAR ─────────────────────────────────────────────────────────────
  const SideBtn = ({ label, k, icon }) => (
    <button onClick={() => setView(k)} style={{
      display: "flex", alignItems: "center", gap: 10, width: "100%",
      padding: "10px 14px", borderRadius: 7, marginBottom: 3, cursor: "pointer",
      background: view === k ? T.redDark + "33" : "transparent",
      border: `1px solid ${view === k ? T.red : "transparent"}`,
      color: view === k ? "#fff" : T.sub, fontSize: 11, fontWeight: view === k ? 700 : 400,
      transition: "all .15s", textAlign: "left"
    }}>
      <span style={{ fontSize: 14, width: 18, textAlign: "center" }}>{icon}</span>
      <span>{label}</span>
      {view === k && <span style={{ marginLeft: "auto", width: 3, height: 3, borderRadius: "50%", background: T.red }} />}
    </button>
  );

  return (
    <div style={{ fontFamily: "'Segoe UI',system-ui,sans-serif", background: T.black, minHeight: "100vh", color: T.text, display: "flex", flexDirection: "column", fontSize: 13 }}>
      <style>{`
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:#111}
        ::-webkit-scrollbar-thumb{background:#2a2a2a;border-radius:4px}
        ::-webkit-scrollbar-thumb:hover{background:#3a3a3a}
        input,select{font-family:inherit;background:#1A1A1A;color:#F0F0F0;border:1px solid #2A2A2A;border-radius:7px;padding:8px 12px;font-size:12px;outline:none;transition:border-color .15s,box-shadow .15s}
        input:focus,select:focus{border-color:${T.red};box-shadow:0 0 0 2px ${T.redGlow}}
        button{font-family:inherit;cursor:pointer;transition:all .15s}
        .pcard{transition:all .2s}
        .pcard:hover{transform:translateY(-1px);box-shadow:0 6px 24px #00000066}
        .hbtn:hover{background:#1E1E1E!important;color:#F0F0F0!important}
        .row:hover{background:#1A1A1A!important}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
        .pulse{animation:pulse 2s infinite}
      `}</style>

      {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
      <header style={{
        background: `linear-gradient(135deg, ${T.redDark} 0%, ${T.red} 55%, ${T.redDark} 100%)`,
        padding: "0 28px", height: 70, display: "flex", alignItems: "center",
        justifyContent: "space-between", flexShrink: 0,
        boxShadow: "0 4px 32px #00000088, inset 0 1px 0 rgba(255,255,255,.1)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ position: "relative" }}>
            <img src={LOGO_SRC} alt="Brametal" style={{ width: 52, height: 52, borderRadius: "50%", border: "2px solid rgba(255,255,255,.3)", boxShadow: "0 0 24px #00000088", display: "block" }} />
            <div style={{ position: "absolute", inset: -2, borderRadius: "50%", border: "1px solid rgba(255,255,255,.1)" }} />
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", letterSpacing: 4, lineHeight: 1, textShadow: "0 2px 12px #00000066" }}>BRAMETAL</div>
            <div style={{ fontSize: 9, color: "rgba(255,220,220,.8)", letterSpacing: 5, marginTop: 3, fontWeight: 500 }}>CONTROLE DE PIQUETES</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 0, alignItems: "stretch", background: "rgba(0,0,0,.2)", borderRadius: 10, padding: 2, border: "1px solid rgba(255,255,255,.1)" }}>
          {[
            { l: "PIQUETES", v: PIQUETES_DATA.length },
            { l: "CONCLUIDOS", v: analytics.concl },
            { l: "PROGRESSO", v: analytics.prog },
            { l: "PESO TOTAL", v: `${analytics.totalPeso.toFixed(0)}t` },
          ].map(({ l, v }, i, arr) => (
            <div key={l} style={{ padding: "8px 18px", textAlign: "center", borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,.1)" : "none" }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{v}</div>
              <div style={{ fontSize: 8, color: "rgba(255,200,200,.7)", letterSpacing: 2, marginTop: 3 }}>{l}</div>
            </div>
          ))}
          <div style={{ padding: "8px 18px", textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{pct}%</div>
            <div style={{ fontSize: 8, color: "rgba(255,200,200,.7)", letterSpacing: 2, marginTop: 3 }}>AVANCO</div>
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 10, color: "rgba(255,200,200,.6)", letterSpacing: 2, marginBottom: 3 }}>ATUALIZACAO</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{today} {timeStr}</div>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ══ SIDEBAR ═════════════════════════════════════════════════════ */}
        <aside style={{ width: 210, background: T.surface, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 10px" }}>

            <div style={{ fontSize: 9, color: T.dim, letterSpacing: 3, padding: "0 6px", marginBottom: 8 }}>NAVEGACAO</div>
            <SideBtn label="Dashboard" k="dash" icon="◈" />
            <SideBtn label="Analise" k="analytics" icon="▲" />
            <SideBtn label="Historico" k="history" icon="≡" />
            <SideBtn label="Importar" k="import" icon="↑" />

            <div style={{ height: 1, background: T.border, margin: "16px 0" }} />
            <div style={{ fontSize: 9, color: T.dim, letterSpacing: 3, padding: "0 6px", marginBottom: 8 }}>ABA</div>
            {sheets.map(sh => {
              const active = sheetF === sh;
              const cnt = sh === "TODOS" ? activeData.length : activeData.filter(p => (p.sheet || p.situacao || "TODOS") === sh).length;
              return (
                <button key={sh} onClick={() => setSheetF(sh)} className="hbtn" style={{
                  width: "100%", textAlign: "left", padding: "8px 12px", borderRadius: 7, marginBottom: 3,
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  background: active ? T.redDark + "33" : "transparent",
                  border: `1px solid ${active ? T.red : "transparent"}`,
                  color: active ? "#fff" : T.sub, fontSize: 10, fontWeight: active ? 700 : 400
                }}>
                  <span>{sh === "TODOS" ? "Todos" : sh === "PIQUETES BRASA" ? "Piq. Brasa" : "Proximos"}</span>
                  <span style={{ background: active ? T.red : "#1E1E1E", color: active ? "#fff" : T.dim, borderRadius: 10, padding: "1px 8px", fontSize: 9, fontWeight: 700 }}>{cnt}</span>
                </button>
              );
            })}

            <div style={{ height: 1, background: T.border, margin: "16px 0" }} />
            <div style={{ fontSize: 9, color: T.dim, letterSpacing: 3, padding: "0 6px", marginBottom: 8 }}>PENDENCIA</div>
            <button onClick={() => setPendF("TODAS")} className="hbtn" style={{ width: "100%", textAlign: "left", padding: "6px 12px", borderRadius: 6, marginBottom: 3, background: pendF === "TODAS" ? T.redDark + "33" : "transparent", border: `1px solid ${pendF === "TODAS" ? T.red : "transparent"}`, color: pendF === "TODAS" ? "#fff" : T.sub, fontSize: 10 }}>Todas as pendencias</button>
            {allPends.map(p => {
              const c = PEND[p] || DP; const active = pendF === p;
              return (
                <button key={p} onClick={() => setPendF(active ? "TODAS" : p)} className="hbtn" style={{
                  width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "6px 10px", borderRadius: 6, marginBottom: 3, fontSize: 10,
                  background: active ? c.bg : "transparent", border: `1px solid ${active ? c.bd : "transparent"}`,
                  color: active ? c.fg : T.sub
                }}>
                  <span style={{ fontWeight: active ? 700 : 400 }}>{p}</span>
                  <span style={{ fontSize: 9, opacity: .8, background: active ? c.bd + "44" : "#1E1E1E", padding: "1px 6px", borderRadius: 8 }}>{pendSum[p] || 0}</span>
                </button>
              );
            })}

            <div style={{ height: 1, background: T.border, margin: "16px 0" }} />
            <div style={{ fontSize: 9, color: T.dim, letterSpacing: 3, padding: "0 6px", marginBottom: 8 }}>MAQUINA</div>
            <button onClick={() => setMaqF("TODAS")} className="hbtn" style={{ width: "100%", textAlign: "left", padding: "6px 12px", borderRadius: 6, marginBottom: 3, background: maqF === "TODAS" ? T.redDark + "33" : "transparent", border: `1px solid ${maqF === "TODAS" ? T.red : "transparent"}`, color: maqF === "TODAS" ? "#fff" : T.sub, fontSize: 10 }}>Todas as maquinas</button>
            {allMaqs.map(m => {
              const active = maqF === m;
              return (
                <button key={m} onClick={() => setMaqF(active ? "TODAS" : m)} className="hbtn" style={{
                  width: "100%", textAlign: "left", padding: "6px 12px", borderRadius: 6, marginBottom: 3, fontSize: 10,
                  background: active ? T.redDark + "33" : "transparent", border: `1px solid ${active ? T.red : "transparent"}`,
                  color: active ? "#fff" : T.sub, fontWeight: active ? 700 : 400
                }}>{m}</button>
              );
            })}
          </div>
          <div style={{ borderTop: `1px solid ${T.border}`, padding: "10px 16px", fontSize: 9, color: T.dim, textAlign: "center" }}>
            {filtered.length} / {activeData.length} piquetes
          </div>
        </aside>

        {/* ══ MAIN ════════════════════════════════════════════════════════ */}
        <main style={{ flex: 1, overflowY: "auto", background: T.black }}>

          {/* ─── ANALYTICS ────────────────────────────────────────────── */}
          {view === "analytics" && (
            <div style={{ padding: "24px 28px" }}>
              <div style={{ fontSize: 10, color: T.dim, letterSpacing: 4, marginBottom: 20 }}>ANALISE OPERACIONAL</div>

              {/* Status Cards com Ring */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
                {[
                  { l: "CONCLUIDOS", v: analytics.concl, c: "#22C55E", bg: "#0A1F0F" },
                  { l: "EM PROGRESSO", v: analytics.prog, c: "#3B82F6", bg: "#0A1628" },
                  { l: "BLOQUEADOS", v: analytics.bloq, c: T.red, bg: "#1A0808" },
                  { l: "AGUARDANDO", v: analytics.agua, c: "#F59E0B", bg: "#1A1400" },
                ].map(({ l, v, c, bg }) => {
                  const p2 = analytics.total > 0 ? Math.round(v / analytics.total * 100) : 0;
                  return (
                    <div key={l} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "18px 16px", position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: c }} />
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <div style={{ fontSize: 9, color: T.sub, letterSpacing: 2, marginBottom: 8 }}>{l}</div>
                          <div style={{ fontSize: 36, fontWeight: 900, color: c, lineHeight: 1 }}>{v}</div>
                          <div style={{ fontSize: 10, color: T.dim, marginTop: 6 }}>{p2}% do total</div>
                        </div>
                        <div style={{ position: "relative", flexShrink: 0 }}>
                          <Ring pct={p2} size={56} stroke={5} color={c} bg={bg} />
                          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: c }}>{p2}%</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Metricas pendentes */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
                {[
                  { l: "PESO PENDENTE", v: `${analytics.pendPeso.toFixed(1)}t`, sub: `de ${analytics.totalPeso.toFixed(0)}t`, c: "#F97316", pct: analytics.totalPeso > 0 ? Math.round(analytics.pendPeso / analytics.totalPeso * 100) : 0 },
                  { l: "POSICOES ABERTAS", v: analytics.pendPos, sub: `em ${analytics.open.length} piquetes`, c: "#3B82F6", pct: 0 },
                  { l: "AVANCO GERAL", v: `${pct}%`, sub: "concluido", c: "#22C55E", pct },
                ].map(({ l, v, sub, c, pct: p2 }) => (
                  <div key={l} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "18px 16px" }}>
                    <div style={{ fontSize: 9, color: T.sub, letterSpacing: 2, marginBottom: 8 }}>{l}</div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: c, lineHeight: 1 }}>{v}</div>
                    <div style={{ fontSize: 10, color: T.dim, marginTop: 6, marginBottom: 10 }}>{sub}</div>
                    {p2 > 0 && <div style={{ height: 4, background: T.muted, borderRadius: 4 }}><div style={{ height: "100%", width: `${p2}%`, background: c, borderRadius: 4, transition: "width .6s" }} /></div>}
                  </div>
                ))}
              </div>

              {/* Charts row */}
              <div style={{ display: "grid", gridTemplateColumns: "5fr 7fr", gap: 12, marginBottom: 20 }}>
                {/* Donut status */}
                <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "18px 20px" }}>
                  <div style={{ fontSize: 10, color: T.sub, letterSpacing: 3, marginBottom: 16 }}>DISTRIBUICAO STATUS</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <Ring pct={pct} size={110} stroke={12} color="#22C55E" bg={T.muted} />
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>{analytics.concl}</div>
                        <div style={{ fontSize: 8, color: T.sub, letterSpacing: 1 }}>concl.</div>
                      </div>
                    </div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                      {[
                        ["Concluidos", analytics.concl, "#22C55E"],
                        ["Progresso", analytics.prog, "#3B82F6"],
                        ["Bloqueados", analytics.bloq, T.red],
                        ["Aguardando", analytics.agua, "#F59E0B"],
                      ].map(([l, v, c]) => (
                        <div key={l} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 8, height: 8, borderRadius: 2, background: c, flexShrink: 0 }} />
                          <div style={{ flex: 1, fontSize: 10, color: T.sub }}>{l}</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: c }}>{v}</div>
                          <div style={{ fontSize: 9, color: T.dim, width: 28, textAlign: "right" }}>{analytics.total > 0 ? Math.round(v / analytics.total * 100) : 0}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Evolucao */}
                <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div style={{ fontSize: 10, color: T.sub, letterSpacing: 3 }}>EVOLUCAO DE CONCLUSOES</div>
                    {analytics.evo.length > 0 && <div style={{ fontSize: 11, fontWeight: 700, color: "#22C55E" }}>{analytics.evo[analytics.evo.length - 1].v} concluidos</div>}
                  </div>
                  <LineChart data={analytics.evo} />
                </div>
              </div>

              {/* Gargalos */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                {/* Por pendencia */}
                <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "18px 20px" }}>
                  <div style={{ fontSize: 10, color: T.sub, letterSpacing: 3, marginBottom: 4 }}>GARGALOS POR PENDENCIA</div>
                  <div style={{ fontSize: 10, color: T.dim, marginBottom: 14 }}>Clique para filtrar o dashboard</div>
                  {analytics.gPend.map(([k, v]) => {
                    const c = PEND[k] || DP; const maxV = analytics.gPend[0][1];
                    const active = actPend === k;
                    return (
                      <div key={k} onClick={() => { setActPend(active ? null : k); setPendF(active ? "TODAS" : k); setView("dash"); }}
                        style={{
                          cursor: "pointer", padding: "8px 10px", borderRadius: 8, marginBottom: 6,
                          background: active ? c.bg : "transparent", border: `1px solid ${active ? c.bd : "transparent"}`,
                          transition: "all .2s"
                        }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                          <Tag label={k} />
                          <span style={{ marginLeft: "auto", fontSize: 9, color: T.sub }}>{v} piquetes · {analytics.pendW[k]?.toFixed(1)}t</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ flex: 1, height: 6, background: T.muted, borderRadius: 6, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${maxV > 0 ? (v / maxV) * 100 : 0}%`, background: c.bd, borderRadius: 6, transition: "width .6s" }} />
                          </div>
                          <span style={{ fontSize: 10, color: c.fg, fontWeight: 700, width: 32, textAlign: "right" }}>{analytics.open.length > 0 ? Math.round(v / analytics.open.length * 100) : 0}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Por maquina */}
                <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "18px 20px" }}>
                  <div style={{ fontSize: 10, color: T.sub, letterSpacing: 3, marginBottom: 4 }}>GARGALOS POR MAQUINA</div>
                  <div style={{ fontSize: 10, color: T.dim, marginBottom: 14 }}>Clique para filtrar o dashboard</div>
                  {analytics.gMaq.map(([k, v], i) => {
                    const c = MAQ_COLORS[i % MAQ_COLORS.length]; const maxV = analytics.gMaq[0][1];
                    const active = actMaq === k;
                    return (
                      <HBar key={k} label={k} value={v} max={maxV} color={c}
                        sub={`piquetes`} active={active}
                        onClick={() => { setActMaq(active ? null : k); setMaqF(active ? "TODAS" : k); setView("dash"); }} />
                    );
                  })}
                </div>
              </div>

              {/* Menor esforco */}
              <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "18px 20px", marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: T.sub, letterSpacing: 3, marginBottom: 4 }}>MENOR ESFORCO / MAIOR RETORNO</div>
                <div style={{ fontSize: 10, color: T.dim, marginBottom: 16 }}>Razao tonelagem / posicoes — priorize para maximo impacto com menor trabalho</div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        {["", "CT", "PIQUETE", "POS", "PESO", "ROI t/pos", "MAQUINAS", "STATUS"].map(h => (
                          <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 9, color: T.dim, letterSpacing: 1, borderBottom: `1px solid ${T.border}`, whiteSpace: "nowrap", fontWeight: 600 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.esforco.map((p, i) => {
                        const u = updates[p.id] || {};
                        return (
                          <tr key={p.id} className="row" style={{ borderBottom: `1px solid ${T.border}`, cursor: "default" }}>
                            <td style={{ padding: "9px 12px", fontSize: i < 3 ? 16 : 11, color: T.dim }}>{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}</td>
                            <td style={{ padding: "9px 12px", color: T.red, fontWeight: 800, fontSize: 12 }}>{p.ct}</td>
                            <td style={{ padding: "9px 12px", color: T.sub, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 10 }}>{p.piquete?.slice(0, 38)}</td>
                            <td style={{ padding: "9px 12px", color: T.text, textAlign: "center", fontWeight: 700 }}>{p.pos}</td>
                            <td style={{ padding: "9px 12px", color: "#A78BFA", fontWeight: 700 }}>{p.peso_apto_kg.toFixed(2)}t</td>
                            <td style={{ padding: "9px 12px" }}>
                              <span style={{ background: i === 0 ? "#0A1F0F" : i === 1 ? "#0A1628" : "#111", color: i === 0 ? "#22C55E" : i === 1 ? "#3B82F6" : T.sub, border: `1px solid ${i === 0 ? "#166534" : i === 1 ? "#1E40AF" : T.border}`, borderRadius: 5, padding: "3px 10px", fontSize: 10, fontWeight: 700 }}>{p.score.toFixed(2)}</span>
                            </td>
                            <td style={{ padding: "9px 12px", color: T.dim, fontSize: 9 }}>{p.maquinas?.join(", ")}</td>
                            <td style={{ padding: "9px 12px" }}>{u.status ? <Badge label={u.status} /> : <span style={{ color: T.dim, fontSize: 9 }}>—</span>}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top peso */}
              <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "18px 20px" }}>
                <div style={{ fontSize: 10, color: T.sub, letterSpacing: 3, marginBottom: 4 }}>TOP PESO PENDENTE</div>
                <div style={{ fontSize: 10, color: T.dim, marginBottom: 16 }}>Maior tonelagem em aberto — priorize para volume de entrega</div>
                {analytics.topPeso.map((p, i) => {
                  const u = updates[p.id] || {}; const maxW = analytics.topPeso[0]?.peso_apto_kg || 1;
                  const c = i === 0 ? T.red : i === 1 ? "#F97316" : i === 2 ? "#F59E0B" : T.muted;
                  return (
                    <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 10px", borderRadius: 8, marginBottom: 6, background: i === 0 ? "#1A0808" : "transparent", border: `1px solid ${i === 0 ? T.red : T.border}`, transition: "all .2s" }}>
                      <div style={{ fontSize: i < 3 ? 16 : 10, width: 24, textAlign: "center", flexShrink: 0 }}>{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}</div>
                      <div style={{ width: 40, fontSize: 11, color: T.red, fontWeight: 800, flexShrink: 0 }}>CT {p.ct}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
                          <div style={{ flex: 1, height: 8, background: T.muted, borderRadius: 4, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${(p.peso_apto_kg / maxW) * 100}%`, background: c, borderRadius: 4, transition: "width .6s", boxShadow: i === 0 ? `0 0 8px ${T.red}66` : "none" }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 800, color: i === 0 ? T.red : "#A78BFA", flexShrink: 0 }}>{p.peso_apto_kg.toFixed(1)}t</span>
                        </div>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{p.pendencias.map(pd => <Tag key={pd} label={pd} />)}</div>
                      </div>
                      <div style={{ flexShrink: 0, textAlign: "right" }}>
                        {u.status ? <Badge label={u.status} /> : <span style={{ color: T.dim, fontSize: 9 }}>—</span>}
                        <div style={{ fontSize: 9, color: T.dim, marginTop: 3 }}>{p.items.length} pos</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}


          {/* ─── IMPORTAR ────────────────────────────────────────────── */}
          {view === "import" && (
            <div style={{ padding: "24px 28px" }}>
              <div style={{ fontSize: 10, color: T.dim, letterSpacing: 4, marginBottom: 20 }}>IMPORTAR PLANILHA</div>

              <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "24px 28px", marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 6 }}>Como importar sua planilha</div>
                <div style={{ fontSize: 11, color: T.sub, lineHeight: 1.7, marginBottom: 20 }}>
                  Selecione o arquivo <b style={{ color: T.text }}>piquetes.xlsx</b> — o sistema vai ler automaticamente e montar os piquetes com suas etapas, pesos e itens.
                </div>

                <div style={{ background: "#0F0F0F", border: `2px dashed ${importDragging ? T.red : T.border}`, borderRadius: 10, padding: "32px", textAlign: "center", marginBottom: 16, transition: "border-color .2s", cursor: "pointer" }}
                  onDragOver={e => { e.preventDefault(); setImportDragging(true); }}
                  onDragLeave={() => setImportDragging(false)}
                  onDrop={e => { e.preventDefault(); setImportDragging(false); const f = e.dataTransfer.files[0]; if (f) processFile(f); }}
                  onClick={() => document.getElementById('xlsxInput').click()}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>📊</div>
                  <div style={{ fontSize: 13, color: T.sub, marginBottom: 6 }}>Arraste o arquivo aqui ou clique para selecionar</div>
                  <div style={{ fontSize: 10, color: T.dim }}>Aceita .xlsx e .xls</div>
                  <input id="xlsxInput" type="file" accept=".xlsx,.xls" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) processFile(e.target.files[0]); }} />
                </div>

                {importStatus && (
                  <div style={{ padding: "12px 16px", borderRadius: 8, background: importStatus.type === "ok" ? "#0A1F0F" : importStatus.type === "err" ? "#1A0808" : "#0A1628", border: `1px solid ${importStatus.type === "ok" ? "#166534" : importStatus.type === "err" ? T.red : "#1E40AF"}`, color: importStatus.type === "ok" ? "#22C55E" : importStatus.type === "err" ? "#EF4444" : "#3B82F6", fontSize: 12 }}>
                    {importStatus.msg}
                  </div>
                )}
              </div>

              {importedData.length > 0 && (
                <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "20px 24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{importedData.length} piquetes lidos</div>
                      <div style={{ fontSize: 10, color: T.dim, marginTop: 2 }}>{importedData.filter(p => p.pendencias?.length > 0).length} com pendencias · {importedData.reduce((a, p) => a + p.peso_kg, 0).toFixed(1)}t total</div>
                    </div>
                    <button onClick={confirmImport} style={{ background: T.red, border: "none", color: "#fff", borderRadius: 8, padding: "10px 24px", fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>
                      ✓ USAR ESSES DADOS NO DASHBOARD
                    </button>
                  </div>
                  <div style={{ maxHeight: 300, overflowY: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
                      <thead><tr style={{ background: "#0F0F0F", position: "sticky", top: 0 }}>
                        {["CT", "PIQUETE", "PESO (t)", "PENDENCIAS", "STATUS OP", "DT CONTRATUAL"].map(h => (
                          <th key={h} style={{ padding: "7px 12px", textAlign: "left", color: T.dim, fontSize: 9, letterSpacing: 1, borderBottom: `1px solid ${T.border}`, whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr></thead>
                      <tbody>
                        {importedData.slice(0, 50).map((p, i) => (
                          <tr key={i} className="row" style={{ borderBottom: `1px solid #151515` }}>
                            <td style={{ padding: "6px 12px", color: T.red, fontWeight: 700 }}>{p.ct}</td>
                            <td style={{ padding: "6px 12px", color: T.sub, fontFamily: "monospace", fontSize: 9, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.piquete}</td>
                            <td style={{ padding: "6px 12px", color: "#A78BFA", fontWeight: 700 }}>{p.peso_kg.toFixed(1)}</td>
                            <td style={{ padding: "6px 12px" }}><div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>{p.pendencias?.map(pd => <Tag key={pd} label={pd} />)}</div></td>
                            <td style={{ padding: "6px 12px", color: p.status_op === "Aberto" ? "#F59E0B" : "#22C55E", fontSize: 9, fontWeight: 600 }}>{p.status_op}</td>
                            <td style={{ padding: "6px 12px", color: T.dim, fontSize: 9 }}>{p.dt_contrat}</td>
                          </tr>
                        ))}
                        {importedData.length > 50 && <tr><td colSpan={6} style={{ padding: "8px 12px", color: T.dim, fontSize: 10, textAlign: "center" }}>... e mais {importedData.length - 50} piquetes</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
          {/* ─── HISTORICO ───────────────────────────────────────────── */}
          {view === "history" && (
            <div style={{ padding: "24px 28px" }}>
              <div style={{ fontSize: 10, color: T.dim, letterSpacing: 4, marginBottom: 20 }}>HISTORICO DE ATUALIZACOES</div>
              {history.length === 0 && (
                <div style={{ textAlign: "center", padding: "60px 0", color: T.dim, fontSize: 12 }}>Nenhum registro ainda.<br />Atualize um piquete para comecar.</div>
              )}
              {history.map((e, i) => (
                <div key={i} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 16px", marginBottom: 8, display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ flexShrink: 0, width: 70, textAlign: "right" }}>
                    <div style={{ fontSize: 10, color: T.red, fontWeight: 700 }}>{e.date}</div>
                    <div style={{ fontSize: 9, color: T.dim }}>{e.time}</div>
                  </div>
                  <div style={{ width: 1, background: T.border, alignSelf: "stretch" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 6 }}>
                      <span style={{ color: T.red, fontSize: 12, fontWeight: 800 }}>CT {e.ct}</span>
                      <span style={{ color: T.dim, fontSize: 10 }}>{e.piquete?.slice(0, 50)}</span>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                      {e.changes?.status && <Badge label={e.changes.status} />}
                      {e.changes?.responsavel && <span style={{ color: T.sub, fontSize: 10 }}>👤 {e.changes.responsavel}</span>}
                      {e.changes?.pesoRealizado && <span style={{ color: "#A78BFA", fontSize: 10 }}>⚖ {e.changes.pesoRealizado}t</span>}
                      {e.changes?.obs && <span style={{ color: T.dim, fontSize: 10, fontStyle: "italic" }}>"{e.changes.obs.slice(0, 60)}"</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ─── DASHBOARD ───────────────────────────────────────────── */}
          {view === "dash" && (
            <div>
              {/* Strip de KPIs + barra empilhada */}
              <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "16px 28px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10, marginBottom: 14 }}>
                  {[
                    { l: "TOTAL", v: analytics.total, c: T.text },
                    { l: "CONCLUIDOS", v: analytics.concl, c: "#22C55E" },
                    { l: "PROGRESSO", v: analytics.prog, c: "#3B82F6" },
                    { l: "BLOQUEADOS", v: analytics.bloq, c: T.red },
                    { l: "PESO TOTAL", v: `${(analytics.totalPeso || 0).toFixed(0)}t`, c: "#A78BFA" },
                  ].map(({ l, v, c }) => (
                    <div key={l} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 9, padding: "10px 14px", position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: c }} />
                      <div style={{ fontSize: 8, color: T.dim, letterSpacing: 2, marginBottom: 5 }}>{l}</div>
                      <div style={{ fontSize: 24, fontWeight: 900, color: c, lineHeight: 1 }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ fontSize: 9, color: T.dim, whiteSpace: "nowrap", letterSpacing: 1 }}>AVANCO</div>
                  <div style={{ flex: 1, height: 8, background: T.muted, borderRadius: 8, overflow: "hidden", display: "flex" }}>
                    {[
                      { v: analytics.concl, c: "#22C55E" },
                      { v: analytics.prog, c: "#3B82F6" },
                      { v: analytics.bloq, c: T.red },
                    ].map(({ v, c }, i) => (
                      <div key={i} style={{ width: `${analytics.total > 0 ? (v / analytics.total) * 100 : 0}%`, height: "100%", background: c, transition: "width .6s" }} />
                    ))}
                  </div>
                  <div style={{ fontSize: 12, color: "#22C55E", fontWeight: 800, whiteSpace: "nowrap" }}>{pct}%</div>
                </div>
              </div>

              {/* Search bar */}
              <div style={{ padding: "12px 28px", borderBottom: `1px solid ${T.border}`, display: "flex", gap: 10, alignItems: "center", background: T.surface }}>
                <div style={{ flex: 1, position: "relative" }}>
                  <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: T.dim, fontSize: 16, pointerEvents: "none" }}>⌕</span>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por piquete, CT ou material..." style={{ width: "100%", paddingLeft: 36 }} />
                </div>
                {search && <button onClick={() => setSearch("")} style={{ background: T.card, border: `1px solid ${T.border}`, color: T.sub, borderRadius: 7, padding: "8px 12px", fontSize: 11 }}>✕</button>}
                <div style={{ fontSize: 11, color: T.dim, whiteSpace: "nowrap" }}>{filtered.length} / {PIQUETES_DATA.length}</div>
              </div>

              {/* Piquete cards */}
              <div style={{ padding: "16px 28px" }}>
                {filtered.length === 0 && <div style={{ textAlign: "center", padding: "60px 0", color: T.dim, fontSize: 12 }}>Nenhum piquete encontrado.</div>}
                {filtered.map(p => {
                  const u = updates[p.id] || {};
                  const isExp = expanded[p.id];
                  const isEd = editId === p.id;
                  const st = STATUS[u.status];
                  const borderColor = st ? st.border : T.border;
                  const glowColor = st ? st.glow : "transparent";
                  const progPct = u.status === "CONCLUÍDO" ? 100 : u.status === "EM PROGRESSO" ? 50 : 0;
                  return (
                    <div key={p.id} className="pcard" style={{
                      background: T.card, border: `1px solid ${borderColor}`,
                      borderRadius: 12, marginBottom: 10, overflow: "hidden",
                      boxShadow: `0 2px 12px ${glowColor}`
                    }}>
                      {/* Thin progress bar */}
                      {progPct > 0 && (
                        <div style={{ height: 3, background: T.muted }}>
                          <div style={{ height: "100%", width: `${progPct}%`, background: st?.fg, transition: "width .4s" }} />
                        </div>
                      )}

                      <div style={{ padding: "14px 18px", display: "flex", alignItems: "flex-start", gap: 14 }}>
                        {/* Status dot */}
                        <div style={{ marginTop: 5, flexShrink: 0 }}>
                          <div className={!u.status || u.status === "AGUARDANDO" ? "pulse" : ""} style={{
                            width: 10, height: 10, borderRadius: "50%",
                            background: st ? st.fg : "#333",
                            boxShadow: st ? `0 0 8px ${st.fg}88` : "none"
                          }} />
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          {/* Header row */}
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 5 }}>
                            <span style={{ color: T.red, fontWeight: 900, fontSize: 14, letterSpacing: .5 }}>CT {p.ct}</span>
                            <span style={{ color: T.border }}>│</span>
                            <span style={{ color: T.dim, fontSize: 10 }}>{p.sheet === "PRÓXIMOS" ? "PROXIMOS" : "PIG. BRASA"}</span>
                            <span style={{ color: T.border }}>│</span>
                            <span style={{ color: "#A78BFA", fontWeight: 700, fontSize: 11 }}>{(p.peso_apto_kg || p.peso_kg || 0).toFixed(2)} t</span>
                            {u.status && <Badge label={u.status} />}
                            <span style={{ marginLeft: "auto", fontSize: 9, color: T.dim }}>{u.updatedAt && `↻ ${u.updatedAt}`}</span>
                          </div>

                          {/* Code */}
                          <div style={{ color: T.sub, fontSize: 10, marginBottom: 8, fontFamily: "monospace", letterSpacing: .3, wordBreak: "break-all" }}>{p.piquete}</div>

                          {/* Tags */}
                          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
                            {p.pendencias.map(pd => <Tag key={pd} label={pd} />)}
                            {p.pendencias.length > 0 && <span style={{ color: T.border, fontSize: 10 }}>·</span>}
                            {p.maquinas.map(m => <MachineTag key={m} label={m} />)}
                          </div>

                          {/* Notes */}
                          {(u.responsavel || u.obs) && (
                            <div style={{ display: "flex", gap: 14, marginTop: 8, flexWrap: "wrap" }}>
                              {u.responsavel && <span style={{ color: T.sub, fontSize: 10 }}>👤 {u.responsavel}</span>}
                              {u.obs && <span style={{ color: T.dim, fontSize: 10, fontStyle: "italic" }}>"{u.obs.slice(0, 80)}"</span>}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div style={{ display: "flex", gap: 7, flexShrink: 0 }}>
                          <button onClick={() => openEdit(p)} style={{
                            background: isEd ? T.red : T.redDark + "33",
                            border: `1px solid ${T.red}`,
                            color: isEd ? "#fff" : "#ff8080",
                            borderRadius: 7, padding: "6px 12px", fontSize: 10, fontWeight: 700
                          }}>✏ {isEd ? "Editando" : "Editar"}</button>
                          <button onClick={() => setExpanded(e => ({ ...e, [p.id]: !e[p.id] }))} style={{
                            background: T.card, border: `1px solid ${T.border}`,
                            color: T.sub, borderRadius: 7, padding: "6px 10px", fontSize: 10
                          }}>{isExp ? "▲" : "▼"} {(p.items || p.itens || []).length}</button>
                        </div>
                      </div>

                      {/* Edit form */}
                      {isEd && (
                        <div style={{ background: "#0F0F0F", borderTop: `1px solid ${T.border}`, padding: "16px 18px" }}>
                          <div style={{ fontSize: 9, color: T.red, fontWeight: 700, letterSpacing: 3, marginBottom: 12 }}>ATUALIZACAO DIARIA · {today}</div>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 12 }}>
                            {[
                              { k: "status", l: "STATUS", type: "select" },
                              { k: "responsavel", l: "RESPONSAVEL", type: "text", ph: "Nome" },
                              { k: "pesoRealizado", l: "PESO REALIZADO (t)", type: "number", ph: p.peso_apto_kg },
                              { k: "obs", l: "OBSERVACAO", type: "text", ph: "Anotacao..." },
                            ].map(({ k, l, type, ph }) => (
                              <div key={k}>
                                <label style={{ fontSize: 9, color: T.dim, display: "block", marginBottom: 4, letterSpacing: 1 }}>{l}</label>
                                {type === "select"
                                  ? <select value={editForm[k]} onChange={e => setEditForm(f => ({ ...f, [k]: e.target.value }))} style={{ width: "100%" }}>{SOPTS.map(s => <option key={s} value={s}>{s}</option>)}</select>
                                  : <input type={type} value={editForm[k]} onChange={e => setEditForm(f => ({ ...f, [k]: e.target.value }))} placeholder={String(ph || "")} style={{ width: "100%" }} step={type === "number" ? "0.001" : undefined} />
                                }
                              </div>
                            ))}
                          </div>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={() => saveEdit(p)} style={{ background: T.red, border: "none", color: "#fff", borderRadius: 7, padding: "8px 20px", fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>SALVAR</button>
                            <button onClick={() => setEditId(null)} style={{ background: "#1A1A1A", border: `1px solid ${T.border}`, color: T.sub, borderRadius: 7, padding: "8px 16px", fontSize: 11 }}>Cancelar</button>
                          </div>
                        </div>
                      )}

                      {/* Items table */}
                      {isExp && (
                        <div style={{ borderTop: `1px solid ${T.border}`, overflowX: "auto" }}>
                          <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                              <tr style={{ background: "#0F0F0F" }}>
                                {["PRIO", "OV", "OP", "POSICAO", "MATERIAL", "QTD", "PESO kg", "MAQ", "PENDENCIA"].map(h => (
                                  <th key={h} style={{ padding: "7px 12px", textAlign: "left", fontSize: 9, color: T.dim, letterSpacing: 1, borderBottom: `1px solid ${T.border}`, whiteSpace: "nowrap", fontWeight: 600 }}>{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {(p.items || p.itens || []).map((it, idx) => (
                                <tr key={idx} className="row" style={{ borderBottom: `1px solid #151515` }}>
                                  <td style={{ padding: "6px 12px", color: T.red, fontWeight: 800, fontSize: 11 }}>{it.prio}</td>
                                  <td style={{ padding: "6px 12px", color: T.sub, fontSize: 10 }}>{it.ov}</td>
                                  <td style={{ padding: "6px 12px", color: T.dim, fontFamily: "monospace", fontSize: 9 }}>{it.op}</td>
                                  <td style={{ padding: "6px 12px", color: T.text, fontSize: 10 }}>{it.posicao}</td>
                                  <td style={{ padding: "6px 12px", color: T.sub, fontSize: 10, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.material || it.desc}</td>
                                  <td style={{ padding: "6px 12px", color: T.text, textAlign: "right", fontWeight: 600 }}>{it.qtd}</td>
                                  <td style={{ padding: "6px 12px", color: "#A78BFA", textAlign: "right", fontWeight: 600, fontFamily: "monospace" }}>{(it.peso || 0).toFixed(3)}</td>
                                  <td style={{ padding: "6px 12px" }}>
                                    <span style={{ color: "#38BDF8", background: "#071420", border: "1px solid #0369A1", borderRadius: 4, padding: "2px 8px", fontFamily: "monospace", fontSize: 9 }}>{it.maq}</span>
                                  </td>
                                  <td style={{ padding: "6px 12px" }}>{(it.pendencia || it.etapa) && (it.pendencia || it.etapa) !== "Finalizado" && (it.pendencia || it.etapa) !== "-" && <Tag label={it.pendencia || it.etapa} />}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
