import { CategoryId, Transaction } from '@/types';

/**
 * Transparent illustrative weights per category in kg.
 * Sources referenced for educational modeling:
 * - Textbooks/Notes: ~1.2 kg per academic volume
 * - Electronics: ~2.5 kg avg e-waste footprint
 * - Lab Essentials: ~0.8 kg fabric/glassware
 * - Hostel & Room: ~6.0 kg furniture/storage
 * - Fashion: ~0.7 kg apparel
 * - Sports: ~1.4 kg sports gear
 * - Cycles: ~13.5 kg steel/aluminum commuter
 * - Free/Misc: ~1.0 kg generic bundle
 */
export const CATEGORY_ESTIMATED_WEIGHT_KG: Record<CategoryId, number> = {
  textbooks: 1.2,
  electronics: 2.5,
  lab: 0.8,
  hostel: 6.0,
  fashion: 0.7,
  sports: 1.4,
  cycles: 13.5,
  free: 1.0,
};

/**
 * Illustrative lifecycle carbon avoidance coefficient:
 * Reusing consumer goods avoids manufacturing + shipping embodied carbon,
 * modeled conservatively at ~2.75 kg CO2e per kg of reused hardware/materials.
 */
export const CO2_AVOIDED_PER_KG = 2.75;

export function calculateTransactionsImpact(transactions: Transaction[]) {
  const completed = transactions.filter((t) => t.status === 'completed');

  let totalItemsReused = completed.length;
  let estimatedStudentSavings = 0;
  let itemsDonated = 0;
  let completedSwaps = 0;
  let wasteAvoidedKg = 0;

  for (const t of completed) {
    if (t.exchangeType === 'donate') {
      itemsDonated += 1;
    } else if (t.exchangeType === 'swap') {
      completedSwaps += 1;
    }

    const weight = CATEGORY_ESTIMATED_WEIGHT_KG[t.category] || 1.5;
    wasteAvoidedKg += weight;
  }

  const co2SavedKg = Math.round(wasteAvoidedKg * CO2_AVOIDED_PER_KG);

  return {
    totalItemsReused,
    estimatedStudentSavings,
    itemsDonated,
    completedSwaps,
    wasteAvoidedKg: Math.round(wasteAvoidedKg),
    co2SavedKg,
  };
}
