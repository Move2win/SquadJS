import Rcon from './index.js';

export default class SquadRcon extends Rcon {
  async broadcast(message) {
    await this.execute(`AdminBroadcast ${message}`);
  }

  async getCurrentMap() {
    const response = await this.execute('ShowCurrentMap');
    const match = response.match(/^Current level is (.*), layer is (.*)/);
    return { level: match[1], layer: match[2] };
  }

  async getNextMap() {
    const response = await this.execute('ShowNextMap');
    const match = response.match(/^Next level is (.*), layer is (.*)/);

    return {
      level: match[1] !== '' ? match[1] : null,
      layer: match[2] !== 'To be voted' ? match[2] : null
    };
  }

  async getListPlayers() {
    const response = await this.execute('ListPlayers');

    const players = [];

    for (const line of response.split('\n')) {
      const match = line.match(
        /ID: ([0-9]+) \| SteamID: ([0-9]{17}) \| Name: (.+) \| Team ID: ([0-9]+) \| Squad ID: ([0-9]+|N\/A)/
      );
      if (!match) continue;

      players.push({
        playerID: match[1],
        steamID: match[2],
        name: match[3],
        teamID: match[4],
        squadID: match[5] !== 'N/A' ? match[5] : null
      });
    }

    return players;
  }

  async warn(steamID, message) {
    await this.execute(`AdminWarn "${steamID}" ${message}`);
  }

  async switchTeam(steamID) {
    await this.execute(`AdminForceTeamChange "${steamID}"`);
  }
}
