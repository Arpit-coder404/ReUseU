import { Listing, WantedPost } from '@/types';

export interface MatchResult {
  listing: Listing;
  score: number; // 0 to 100
  reasons: string[];
}

export function findMatchesForWanted(wanted: WantedPost, listings: Listing[]): MatchResult[] {
  const activeListings = listings.filter((l) => l.status === 'active');
  const results: MatchResult[] = [];

  const wantedTokens = tokenize(`${wanted.title} ${wanted.description}`);

  for (const listing of activeListings) {
    let score = 0;
    const reasons: string[] = [];

    // 1. Category Match (40 pts)
    if (listing.category === wanted.category) {
      score += 40;
      reasons.push('Exact category match');
    }

    // 2. Budget compatibility (25 pts)
    if (wanted.maxBudget !== undefined && wanted.maxBudget > 0) {
      if (listing.price <= wanted.maxBudget) {
        score += 25;
        if (listing.price === 0) {
          reasons.push('Free donation item!');
        } else {
          reasons.push(`Within budget: $${listing.price} ≤ $${wanted.maxBudget}`);
        }
      }
    } else if (listing.price === 0) {
      score += 20;
      reasons.push('Free donation listing');
    }

    // 3. Keyword Overlap (up to 35 pts)
    const listingTokens = tokenize(`${listing.title} ${listing.description} ${listing.tags.join(' ')}`);
    const commonTokens = wantedTokens.filter((token) => listingTokens.includes(token));

    if (commonTokens.length > 0) {
      const keywordScore = Math.min(35, commonTokens.length * 10);
      score += keywordScore;
      const sampleTokens = commonTokens.slice(0, 3).join(', ');
      reasons.push(`Matched keywords: ${sampleTokens}`);
    }

    // Only include if score >= 40
    if (score >= 40) {
      results.push({
        listing,
        score: Math.min(100, score),
        reasons,
      });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}

function tokenize(text: string): string[] {
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'it', 'this', 'that', 'i', 'my', 'me', 'you', 'your',
    'looking', 'need', 'seeking', 'want', 'wanted', 'buy', 'get', 'can'
  ]);

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));
}

