export function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export function pickWeighted(choices) {
  // choices: [{ weight: number, value: any }]
  const total = choices.reduce((sum, c) => sum + (c.weight || 0), 0);
  if (total <= 0) return choices[0]?.value;
  let r = Math.random() * total;
  for (const c of choices) {
    r -= c.weight || 0;
    if (r <= 0) return c.value;
  }
  return choices[choices.length - 1]?.value;
}

