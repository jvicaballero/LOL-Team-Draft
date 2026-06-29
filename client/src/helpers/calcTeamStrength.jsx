// Have Claude come up with formula later

function calcTeamStrength(champions) {
  const allTags = champions.flatMap((c) => c.tags);
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {});

  const uniqueTags = Object.keys(tagCounts).length;

  // Diversity score (0-40 pts) — more unique tags = better
  const diversityScore = Math.min(uniqueTags * 8, 40);

  // Stack penalty (0 to -20 pts) — lose 5pts per champ over 2 sharing a tag
  const stackPenalty = Object.values(tagCounts)
    .filter((count) => count > 2)
    .reduce((total, count) => total + (count - 2) * 5, 0);

  // Cost score (0-30 pts)
  const totalCost = champions.reduce((sum, c) => sum + c.be_cost, 0);
  const maxCost = 6300 * 5;
  const costScore = Math.round((totalCost / maxCost) * 30);

  // Archetype coverage (0-30 pts) — still reward hitting key roles
  const hasTank = allTags.includes("Tank");
  const hasDamage = allTags.includes("Mage") || allTags.includes("Marksman");
  const hasSupport = allTags.includes("Support");
  const coverageScore =
    (hasTank ? 10 : 0) + (hasDamage ? 10 : 0) + (hasSupport ? 10 : 0);

  return Math.max(
    0,
    Math.min(100, diversityScore - stackPenalty + costScore + coverageScore),
  );
}

/**
 * All fighters (Darius, Hecarim, Warwick, Draven, Blitzcrank) — should land around 40-50, heavy stack penalty
Balanced draft (Malphite, Elise, Orianna, Jinx, Thresh) — should hit 80+, good archetype coverage and diversity
Budget team (Garen, Warwick, Katarina, Sivir, Janna) — mid score, dragged down by low cost even with decent diversity
 */

export default calcTeamStrength;
