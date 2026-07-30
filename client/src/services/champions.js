const BASE_URL = "https://server-5byc.onrender.com/api/champions";

export const getAllChampions = async () => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch champions");
  return res.json();
};
