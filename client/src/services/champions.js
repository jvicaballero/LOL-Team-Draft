const BASE_URL = '/api/champions';

export const getAllChampions = async () => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Failed to fetch champions');
  return res.json();
};
