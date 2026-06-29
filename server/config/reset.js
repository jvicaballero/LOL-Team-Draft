// Need methods to create and seed my table.
// Fetch my data from separate data/... .js files

// The roles will be my limiting factor: Cannot have a champion with the same role in 1 team I.E 2 supports
// Cannot have duplicate champions I.E 2 lulus in 1 team draft
// Instead of money I have Blue essence (even though its not really how it works in game)
import "./dotenv.js";
import { pool } from "./database.js";
import { championsData } from "../data/champions.js";
import { teamsData } from "../data/teams.js";

const createChampionsTable = async () => {
  // Same steps:
  // build my query
  // call my pool with the query
  // call my fn at the end (in this case, It'll be called in my seedChampionsTable fn)

  // Drop teams first — it references champions(id) so it must go before champions
  await pool.query(`DROP TABLE IF EXISTS teams`);
  await pool.query(`DROP TABLE IF EXISTS champions`);

  const createChampionsTableQuery = `CREATE TABLE champions (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(50) NOT NULL,          -- e.g. "Ahri", "Wukong"
  role        VARCHAR(20) NOT NULL,          -- "Top", "Jungle", "Mid", "Bot", "Support"
  tags        TEXT[],                        -- e.g. {"Mage","Assassin"} from API
  image_url   TEXT NOT NULL,                 -- full splash art URL
  icon_url    TEXT NOT NULL,                 -- square icon URL
  be_cost     INTEGER DEFAULT 450            -- Blue Essence cost for "price" feature
    );`;

  try {
    await pool.query(createChampionsTableQuery);
    console.log(`🎉 Champions Table created successfully!`);
  } catch (error) {
    console.error("⚠️ Error trying to create Champions Table:", error);
  }
};

const seedChampionsTable = async () => {
  await createChampionsTable();

  // Loop through all champions data to build my array of insertQueries
  for (const champion of championsData) {
    const insertQuery = `INSERT INTO champions (name, role, tags, image_url, icon_url, be_cost) 
    VALUES($1, $2, $3, $4, $5, $6)`;

    const values = [
      champion.name,
      champion.role,
      champion.tags,
      champion.image_url,
      champion.icon_url,
      champion.be_cost,
    ];

    // call my pool and insert
    try {
      await pool.query(insertQuery, values);
      console.log(
        `✅ Champion data inserted successfully for ${champion.name}`,
      );
    } catch (error) {
      console.error("⚠️ Error inserting match data:", error);
    }
  }
};

const createTeamsTable = async () => {
  // Separate columns per role (not an array) so each slot has an explicit role mapping
  // and PostgreSQL can enforce REFERENCES champions(id) per slot
  const createTeamsTableQuery = `CREATE TABLE teams (
    id                  SERIAL PRIMARY KEY,
    name                VARCHAR(50) NOT NULL,
    top_id              INTEGER REFERENCES champions(id),
    jungle_id           INTEGER REFERENCES champions(id),
    mid_id              INTEGER REFERENCES champions(id),
    bot_id              INTEGER REFERENCES champions(id),
    support_id          INTEGER REFERENCES champions(id),
    total_be_cost       INTEGER DEFAULT 0,
    team_strength_pct   NUMERIC(5,2) DEFAULT 0
  );`;

  try {
    await pool.query(createTeamsTableQuery);
    console.log(`🎉 Teams Table created successfully!`);
  } catch (error) {
    console.error("⚠️ Error trying to create Teams Table:", error);
  }
};

const seedTeamsTable = async () => {
  await createTeamsTable();

  for (const team of teamsData) {
    // Look up each champion's ID by name since IDs are DB-assigned
    const lookupId = async (name) => {
      const result = await pool.query(
        `SELECT id, be_cost FROM champions WHERE name = $1`,
        [name],
      );
      return result.rows[0];
    };

    const top = await lookupId(team.top);
    const jungle = await lookupId(team.jungle);
    const mid = await lookupId(team.mid);
    const bot = await lookupId(team.bot);
    const support = await lookupId(team.support);

    const total_be_cost =
      top.be_cost +
      jungle.be_cost +
      mid.be_cost +
      bot.be_cost +
      support.be_cost;

    const insertQuery = `INSERT INTO teams (name, top_id, jungle_id, mid_id, bot_id, support_id, total_be_cost, team_strength_pct)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;

    const values = [
      team.name,
      top.id,
      jungle.id,
      mid.id,
      bot.id,
      support.id,
      total_be_cost,
      team.team_strength_pct,
    ];

    try {
      await pool.query(insertQuery, values);
      console.log(`✅ Team inserted successfully: ${team.name}`);
    } catch (error) {
      console.error(`⚠️ Error inserting team ${team.name}:`, error);
    }
  }
};

// Chain seeds so teams table is always created after champions (teams references champions(id))
const seed = async () => {
  await seedChampionsTable();
  await seedTeamsTable();
};

seed();
