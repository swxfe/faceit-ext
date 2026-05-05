export const en = {
  // Logs & Console
  logInit: '[Faceit Ext] Initialization started...',
  logMatchFound: '[Faceit Ext] Match found! Accepting in {delay}ms...',
  logMatchAccepted: '[Faceit Ext] Match accepted!',
  logPartyFound: '[Faceit Ext] Party invite found! Accepting in {delay}ms...',
  logPartyAccepted: '[Faceit Ext] Party accepted!',
  logBanCanceled: '[Faceit Ext] Auto-ban cancelled by user.',
  logBanSuccess: '[Faceit Ext] Veto: Banned "{target}"!',
  logIpCopied: '[Faceit Ext] IP address automatically copied!',
  logAcConnect: '[Faceit Ext] Direct connect (Faceit AC) in {delay}ms...',
  logAutoConnect: '[Faceit Ext] Auto-click Connect in {delay}ms...',
  logSotmHidden: '[Faceit Ext] "Skin of the Match" ad hidden!',

  // UI / Toasts / Notifications
  toastAutoBan: 'Auto-Ban: <b>{target}</b> in <span id="veto-timer">{time}</span>s.',
  btnCancel: 'Cancel',
  notifMatchStart: 'FACEIT Match Started! 🎮',
  notifMatchBody: 'Map: {map}\nServer: {server}\nJoin the game, server is ready!',
  unknown: 'Unknown',

  // Stats / Overlays
  statsAvg: 'Avg: {elo} (+{win} / {lose})',
  statsPlayer: '🎮 {matches} | 🏆 {wr}% | 🎯 {kd} | 🔥 W{streak}',
  statsPlayedBefore: ' | 🤝 Played recently',
  statsVetoLoading: '<span>📊 Stats: Loading...</span>',
  statsVetoData: '<span style="color: #b2b2b2;">Matches: <b style="color:white;">{matches}</b> | WR: <b style="color:white;">{wr}%</b></span>',
  demoTitle: 'Download GOTV Demo',
  openMatchTitle: 'Open Match Room',
  recent20Stats: 'Recent 20: 🎯 {kd} K/D | 🏆 {wr}% WR',
  ladderRank: 'Ladder: #{rank}',

  // Settings UI
  uiTitle: 'Faceit Extender',
  tabGeneral: '🕹️ General',
  tabMatchroom: '🚀 Matchroom',
  tabVeto: '🚫 Auto-Bans',
  tabUI: '📊 Interface',
  tabProfile: '👤 Profile',

  // Fields (General)
  secExtension: 'Extension Settings',
  setLanguage: 'Language',
  setLanguageDesc: 'Extension interface language. Page will reload on change.',
  langAuto: 'Auto (Browser)',
  langEn: 'English',
  langRu: 'Русский',

  // Match / Party
  secAutoAccept: 'Auto-Accept Match',
  setMatchEnable: 'Enable',
  setMatchEnableDesc: "Automatically clicks the 'Accept' button.",
  setMatchDelay: 'Delay (ms)',
  setMatchDelayDesc: 'How long to wait before accepting.',
  secParty: 'Party Invite',
  setPartyEnable: 'Auto-Join Party',
  setPartyEnableDesc: 'Automatically accepts lobby invitations.',
  
  // Connection
  secConnect: 'Server Connection',
  setNotif: 'Push Notifications',
  setNotifDesc: 'Sends a notification when the server is ready.',
  setAutoCopy: 'Auto-Copy IP',
  setAutoCopyDesc: 'Automatically copies the server IP to clipboard.',
  setAutoConnect: 'Auto-Connect',
  setAutoConnectDesc: 'Automatically joins the server.',
  setAcProtocol: 'Direct Connect (AC Protocol)',
  setAcProtocolDesc: 'Connects faster directly via Faceit AC (faceitac://).',
  setConnectDelay: 'Connection Delay (ms)',
  
  // Veto
  secVeto: 'Automatic Bans (Veto)',
  setVetoDelay: 'Auto-Ban Delay (ms)',
  setVetoDelayDesc: 'During the delay, a popup will appear to cancel.',
  setVetoStats: 'Map Statistics',
  setVetoStatsDesc: 'Show map info under the ban button (WR/Matches).',
  setMapBan: 'Map Ban',
  setMapBanDesc: 'Automatically bans selected maps.',
  setServerBan: 'Server Ban',
  setServerBanDesc: 'Automatically bans selected servers.',
  vetoQueueLabel: 'Ban Queue (bans these first):',
  vetoAvailLabel: 'Available:',
  vetoNothing: 'Nothing selected',

  // UI
  secInterface: 'Interface (Matchroom)',
  setFocusMode: 'Focus Mode',
  setFocusModeDesc: 'Blurs enemy nicknames and stats to prevent tilt.',
  setHideSotm: 'Hide Skin of the Match',
  setHideSotmDesc: 'Removes the advertising banner.',
  setTheaterMode: 'Auto Theater Mode (Znipe)',
  setTheaterModeDesc: 'Automatically expands Faceit streams to full width.',
  
  // Stats
  secStats: 'Matchroom Statistics',
  setTeamElo: 'Average Team ELO',
  setTeamEloDesc: 'Calculates average ELO and point forecast.',
  setPlayerStats: 'K/D, Winrate and Matches',
  setPlayerStatsDesc: 'Displays detailed stats next to each player.',
  setHoverCards: 'Hover Player Cards',
  setHoverCardsDesc: 'Shows a detailed popup (Ladder, Elo, Stats) on hover.',
  setEncounters: 'Encounters',
  setEncountersDesc: 'Marks players in the lobby you have played with recently.',

  // Sidebar & Profile
  secSidebar: 'Right Menu (Sidebar)',
  setSidebarElo: 'Own ELO in menu',
  setSidebarEloDesc: 'Shows your exact ELO in the right corner.',
  setFriendsElo: 'Friends / Invites ELO',
  setFriendsEloDesc: 'Shows ELO next to each friend and party recommendation.',

  secProfilePage: 'Profile Page',
  setEnhancedProfile: 'Enhanced Profile',
  setEnhancedProfileDesc: 'Orange ELO and exact +/- ELO in match history.',
  setDemoBtn: 'Demo & Match Buttons',
  setDemoBtnDesc: 'Adds download and open-in-new-tab buttons in history.',
  setRecent20: 'Recent 20 Matches Stats',
  setRecent20Desc: 'Calculates and shows accurate K/D and WR for the last 20 games.',
};