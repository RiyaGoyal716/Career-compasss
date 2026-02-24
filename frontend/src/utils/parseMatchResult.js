export default function parseMatchResult(resultText) {
  let score = 0;
  const keywords = [];
  const skills = [];

  // Example patterns (customize for real data)
  const match = resultText.match(/score\s*[:-]?\s*(\d+)%/i);
  if (match) score = parseInt(match[1]);

  const keywordMatches = resultText.match(/(Python|JavaScript|React|SQL|HTML|CSS|Data Analysis)/gi);
  if (keywordMatches) {
    keywordMatches.forEach(k => {
      const exists = keywords.find(w => w.toLowerCase() === k.toLowerCase());
      if (!exists) keywords.push(k);
    });
  }

  keywords.forEach(k => {
    skills.push({ name: k, value: Math.floor(Math.random() * 40) + 60 }); // Dummy values
  });

  return { score, keywords, skills };
}
