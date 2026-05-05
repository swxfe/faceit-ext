// Глобальный кэш для Hover-карточек и статы, чтобы не спамить API
export const GlobalCache = {
  stats: new Map<string, any>(),
  users: new Map<string, any>(),
  ranks: new Map<string, any>(),
  history: new Map<string, any>()
};

export const FaceitAPI = {
  async getMatchDetails(matchId: string) {
    try {
      const res = await fetch(`https://api.faceit.com/match/v2/match/${matchId}`);
      if (!res.ok) return null;
      return (await res.json()).payload;
    } catch { return null; }
  },

  async getPlayerStats(userId: string, game = 'cs2') {
    if (GlobalCache.stats.has(userId)) return GlobalCache.stats.get(userId);
    try {
      const res = await fetch(`https://api.faceit.com/stats/v1/stats/users/${userId}/games/${game}`);
      if (!res.ok) return null;
      const data = (await res.json()).payload;
      GlobalCache.stats.set(userId, data);
      return data;
    } catch { return null; }
  },

  async getUserByNickname(nickname: string) {
    if (GlobalCache.users.has(nickname)) return GlobalCache.users.get(nickname);
    try {
      const res = await fetch(`https://api.faceit.com/users/v1/nicknames/${nickname}`);
      if (!res.ok) return null;
      const data = (await res.json()).payload;
      GlobalCache.users.set(nickname, data);
      return data;
    } catch { return null; }
  },

  async getPlayerMatchHistory(userId: string, game = 'cs2') {
    if (GlobalCache.history.has(userId)) return GlobalCache.history.get(userId);
    try {
      const res = await fetch(`https://api.faceit.com/stats/v1/stats/time/users/${userId}/games/${game}?size=20`);
      if (!res.ok) return null;
      const data = await res.json();
      GlobalCache.history.set(userId, data);
      return data;
    } catch { return null; }
  },

  // НОВОЕ: Позиции в ладдере
  async getPlayerRanking(userId: string, game = 'cs2', region = 'EU', country = '') {
    const cacheKey = `${userId}_${region}_${country}`;
    if (GlobalCache.ranks.has(cacheKey)) return GlobalCache.ranks.get(cacheKey);
    try {
      const query = country ? `?country=${country}` : '';
      const res = await fetch(`https://api.faceit.com/ranking/v1/globalranking/${game}/${region}/${userId}${query}`);
      if (!res.ok) return null;
      const data = (await res.json()).payload;
      GlobalCache.ranks.set(cacheKey, data);
      return data;
    } catch { return null; }
  }
};