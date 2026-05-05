export const defaultSettings = {
  "extension.enabled": true,
  "extension.language": "auto",
  
  // Авто-принятия
  "faceit.matchReady.autoAccept.enabled": true,
  "faceit.matchReady.autoAccept.delay": 3000,
  "faceit.partyInvite.autoAccept.enabled": true,
  "faceit.partyInvite.autoAccept.delay": 3000,
  
  // Матчрум (Коннект)
  "faceit.matchroom.overview.connect.autoCopy.enabled": true,
  "faceit.matchroom.overview.connect.autoConnect.enabled": false,
  "faceit.matchroom.overview.connect.acProtocol.enabled": true,
  "faceit.matchroom.overview.connect.autoConnect.delay": 10000,
  
  // Авто-бан (Veto)
  "faceit.matchroom.veto.map.autoBan.enabled": false,
  "faceit.matchroom.veto.map.autoBan.list": "Dust2, Mirage, Vertigo",
  "faceit.matchroom.veto.server.autoBan.enabled": false,
  "faceit.matchroom.veto.server.autoBan.list": "Moscow, Kazakhstan",
  "faceit.matchroom.veto.autoBan.delay": 3000,
  "faceit.matchroom.veto.stats.enabled": true,
  
  // Интерфейс (UI)
  "faceit.matchroom.ui.focusMode.enabled": false,
  "faceit.matchroom.ui.hideSkinOfTheMatch.enabled": true,
  "faceit.matchroom.ui.theaterMode.enabled": true, // <-- НОВОЕ
  
  // Статистика Матчрума
  "faceit.matchroom.overview.team.elo.enabled": true,
  "faceit.matchroom.overview.player.stats.enabled": true,
  "faceit.matchroom.overview.player.encounters.enabled": true,
  "faceit.matchroom.overview.player.hoverCards.enabled": true, // <-- НОВОЕ
  
  // Сайдбар и Профиль
  "faceit.rightSidebar.eloLevel.enabled": true,
  "faceit.rightSidebar.friends.eloLevel.enabled": true,
  "faceit.playerProfile.stats.eloLevel.enabled": true,
  "faceit.playerProfile.stats.demoDownload.enabled": true,
  "faceit.playerProfile.stats.recent20.enabled": true, // <-- НОВОЕ
  
  "faceit.matchroom.notifications.enabled": true,
  "faceit.matchroom.overview.player.countryFlag.enabled": true,
  "faceit.rightSidebar.eloProgress.enabled": true,
  "faceit.rightSidebar.matches.elo.enabled": true,
};

export type SettingsKey = keyof typeof defaultSettings;

export const Settings = {
  get<T extends SettingsKey>(key: T): typeof defaultSettings[T] {
    try {
      const stored = localStorage.getItem(`repeek_ext_${key}`);
      return stored !== null ? JSON.parse(stored) : defaultSettings[key];
    } catch {
      return defaultSettings[key];
    }
  },
  set<T extends SettingsKey>(key: T, value: typeof defaultSettings[T]) {
    localStorage.setItem(`repeek_ext_${key}`, JSON.stringify(value));
  }
};