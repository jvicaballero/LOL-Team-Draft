// Champion names are used here instead of IDs because IDs are auto-assigned by the DB.
// The seed function looks up each champion's ID by name before inserting.
export const teamsData = [
  {
    name: "Iron Frontline",
    top: "Malphite",
    jungle: "Warwick",
    mid: "Orianna",
    bot: "Sivir",
    support: "Blitzcrank",
    team_strength_pct: 72.5,
  },
  {
    name: "Assassin's Creed",
    top: "Teemo",
    jungle: "Nidalee",
    mid: "Katarina",
    bot: "Draven",
    support: "Thresh",
    team_strength_pct: 88.0,
  },
  {
    name: "The Budget Squad",
    top: "Garen",
    jungle: "Warwick",
    mid: "Fizz",
    bot: "Jinx",
    support: "Janna",
    team_strength_pct: 65.0,
  },
];
