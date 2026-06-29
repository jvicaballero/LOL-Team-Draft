const BASE_URL = '/api/teams';

export const getAllTeams = async () => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Failed to fetch teams');
  return res.json();
};

export const getTeamById = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch team');
  return res.json();
};

export const createTeam = async (team) => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(team),
  });
  if (!res.ok) throw new Error('Failed to create team');
  return res.json();
};

export const updateTeam = async (id, team) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(team),
  });
  if (!res.ok) throw new Error('Failed to update team');
  return res.json();
};

export const deleteTeam = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete team');
  return res.json();
};
