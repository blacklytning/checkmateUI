export async function fetchUsernamesFromTeam() {
  const response = await fetch(`https://lichess.org/api/team/checkmate-club-apsit/users`);
  const text = await response.text();

  // Parse NDJSON into array of usernames
  const usernames = text
    .trim()
    .split('\n')
    .map(line => JSON.parse(line).name);

  return usernames;
}
