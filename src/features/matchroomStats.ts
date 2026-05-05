import { Settings } from '../core/settings';
import { FaceitAPI, GlobalCache } from '../core/api';
import { CONSTANTS } from '../core/constants';
import { FaceitAssets } from '../assets/icons';
import { t } from '../core/i18n';

let currentMatchId = '';
let matchData: any = null;
const encountersCache = new Set<string>();
let myIdFetched = false;
let hoverCardEl: HTMLDivElement | null = null;

export function initMatchroomStats() {
  createHoverCardElement();

  setInterval(async () => {
    if (!window.location.pathname.includes('/room/')) return;
    
    const match = window.location.pathname.match(/\/room\/([^/]+)/);
    if (!match) return;
    const matchId = match[1];

    if (currentMatchId !== matchId) {
      currentMatchId = matchId;
      matchData = await FaceitAPI.getMatchDetails(matchId);
      
      if (Settings.get('faceit.matchroom.overview.player.encounters.enabled') && !myIdFetched) {
        fetchMyEncounters();
      }
    }

    if (!matchData) return;

    if (Settings.get('faceit.matchroom.overview.team.elo.enabled')) injectTeamStats(matchData);
    if (Settings.get('faceit.matchroom.overview.player.stats.enabled') || Settings.get('faceit.matchroom.overview.player.countryFlag.enabled')) {
      injectAllPlayerStats(matchData);
    }
  }, 2000);
}

// Hover Card DOM Setup
function createHoverCardElement() {
  hoverCardEl = document.createElement('div');
  hoverCardEl.className = 'faceit-ext-hover-card';
  document.body.appendChild(hoverCardEl);

  document.addEventListener('mouseover', async (e) => {
    if (!Settings.get('faceit.matchroom.overview.player.hoverCards.enabled')) return;
    const target = e.target as HTMLElement;
    const playerStatSpan = target.closest('.faceit-ext-player-stats') || target.closest('div[class*="ListContentPlayer__Background"]');
    
    if (playerStatSpan) {
      const nameEl = playerStatSpan.parentElement?.querySelector('div[class*="NicknameContainer"], span[class*="Nickname"]');
      const nickname = nameEl?.textContent?.trim() || playerStatSpan.getAttribute('data-nickname');
      
      if (nickname && hoverCardEl) {
        const user = await FaceitAPI.getUserByNickname(nickname);
        if (!user) return;
        const stats = await FaceitAPI.getPlayerStats(user.id);
        const rankGlobal = await FaceitAPI.getPlayerRanking(user.id, 'cs2', user.games?.cs2?.region || 'EU');
        const rankCountry = await FaceitAPI.getPlayerRanking(user.id, 'cs2', user.games?.cs2?.region || 'EU', user.country);
        
        let rankHtml = '';
        if (rankGlobal && rankGlobal.position) rankHtml += `<div>🌍 Global: <b>#${rankGlobal.position}</b></div>`;
        if (rankCountry && rankCountry.position) rankHtml += `<div>${CONSTANTS.getCountryEmoji(user.country)} ${user.country.toUpperCase()}: <b>#${rankCountry.position}</b></div>`;

        hoverCardEl.innerHTML = `
          <div class="hover-card-header">
            <img src="${user.avatar || 'https://corporate.faceit.com/wp-content/uploads/2021/01/5d31a54605151.png'}" />
            <div>
              <div class="hover-card-name">${nickname}</div>
              <div class="hover-card-elo">${user.games?.cs2?.faceit_elo || 'N/A'} ELO <img src="${FaceitAssets.getLevelIcon(user.games?.cs2?.skill_level || 1)}"/></div>
            </div>
          </div>
          <div class="hover-card-stats">
            <div>Matches: <b>${stats?.lifetime?.['Matches'] || '-'}</b></div>
            <div>Winrate: <b>${stats?.lifetime?.['Win Rate %'] || '-'}%</b></div>
            <div>K/D Ratio: <b>${stats?.lifetime?.['Average K/D Ratio'] || '-'}</b></div>
            <div>Headshots: <b>${stats?.lifetime?.['Average Headshots %'] || '-'}%</b></div>
          </div>
          ${rankHtml ? `<div class="hover-card-ranks">${rankHtml}</div>` : ''}
        `;
        
        const rect = playerStatSpan.getBoundingClientRect();
        hoverCardEl.style.left = `${rect.left + window.scrollX}px`;
        hoverCardEl.style.top = `${rect.bottom + window.scrollY + 10}px`;
        hoverCardEl.classList.add('visible');
      }
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target as HTMLElement;
    if (hoverCardEl && !target.closest('.faceit-ext-player-stats') && !target.closest('div[class*="ListContentPlayer__Background"]') && !target.closest('.faceit-ext-hover-card')) {
      hoverCardEl.classList.remove('visible');
    }
  });
}

async function fetchMyEncounters() {
  const myProfileLink = document.querySelector('div[class*="AccountSidebarHolder"] a[href^="/en/players/"]') as HTMLAnchorElement;
  if (myProfileLink) {
    const nickname = myProfileLink.href.split('/').pop();
    if (nickname) {
      myIdFetched = true;
      const user = await FaceitAPI.getUserByNickname(nickname);
      if (user) {
        const history = await FaceitAPI.getPlayerMatchHistory(user.id);
        if (history) {
          history.forEach((m: any) => encountersCache.add(m.matchId));
        }
      }
    }
  }
}

function injectTeamStats(data: any) {
  const f1 = data.teams?.faction1;
  const f2 = data.teams?.faction2;
  if (!f1 || !f2) return;

  const f1Elo = calculateTeamElo(f1.roster);
  const f2Elo = calculateTeamElo(f2.roster);
  const f1WinElo = calculateExpectedElo(f1Elo, f2Elo, true);
  const f1LoseElo = calculateExpectedElo(f1Elo, f2Elo, false);

  injectToTeam(f1.name, t('statsAvg', { elo: f1Elo, win: f1WinElo, lose: f1LoseElo }));
  injectToTeam(f2.name, t('statsAvg', { elo: f2Elo, win: calculateExpectedElo(f2Elo, f1Elo, true), lose: calculateExpectedElo(f2Elo, f1Elo, false) }));
}

function calculateTeamElo(roster: any[]) {
  if (!roster || roster.length === 0) return 0;
  const total = roster.reduce((acc, p) => acc + (p.elo || 0), 0);
  return Math.round(total / roster.length);
}

function calculateExpectedElo(teamElo: number, enemyElo: number, isWin: boolean) {
  const pWin = 1 / (1 + Math.pow(10, (enemyElo - teamElo) / 400));
  return Math.round(50 * (isWin ? (1 - pWin) : (0 - pWin)));
}

function injectToTeam(teamName: string, text: string) {
  const els = Array.from(document.querySelectorAll('h6, span, div, h5'));
  const teamEl = els.find(el => el.textContent?.trim() === teamName && el.children.length === 0);
  if (teamEl && teamEl.parentElement && !teamEl.parentElement.querySelector('.faceit-ext-team-elo')) {
    const span = document.createElement('span');
    span.className = 'faceit-ext-team-elo';
    span.textContent = text;
    teamEl.parentElement.appendChild(span);
  }
}

function injectAllPlayerStats(data: any) {
  const rosters = [...(data.teams?.faction1?.roster || []), ...(data.teams?.faction2?.roster || [])];
  const showEncounters = Settings.get('faceit.matchroom.overview.player.encounters.enabled');
  const showStats = Settings.get('faceit.matchroom.overview.player.stats.enabled');
  const showFlags = Settings.get('faceit.matchroom.overview.player.countryFlag.enabled');
  
  rosters.forEach(async (player) => {
    const playerId = player.player_id;
    const nickname = player.nickname;
    
    // НОВОЕ: Подсветка Challenger игроков (ELO > 3500 или Lvl 10)
    const playerCard = getPlayerCardElement(nickname);
    if (playerCard && player.elo > 3500) {
      playerCard.classList.add('faceit-ext-challenger');
    }

    const stats = await FaceitAPI.getPlayerStats(playerId);
    if (stats) {
      if (showFlags) {
         FaceitAPI.getUserByNickname(nickname).then(user => {
            if (user && user.country) injectFlagToPlayer(nickname, CONSTANTS.getCountryEmoji(user.country));
         });
      }

      if (showStats) {
        const kd = stats.lifetime?.['Average K/D Ratio'] || '-';
        const matches = stats.lifetime?.['Matches'] || '-';
        const winRate = stats.lifetime?.['Win Rate %'] || '-';
        const streak = stats.lifetime?.['Current Win Streak'] || '0';
        
        let text = t('statsPlayer', { matches, wr: winRate, kd, streak });
        if (showEncounters && encountersCache.has(playerId)) text += t('statsPlayedBefore');
        injectToPlayer(nickname, text);
      }
    }
  });
}

function getPlayerCardElement(nickname: string) {
  const els = Array.from(document.querySelectorAll('span, div'));
  const nameEl = els.find(el => el.textContent?.trim() === nickname && el.children.length === 0);
  return nameEl?.closest('div[class*="ListContentPlayer__Background"]');
}

function injectFlagToPlayer(nickname: string, flag: string) {
  const els = Array.from(document.querySelectorAll('span, div, a'));
  const nameEl = els.find(el => el.textContent?.trim() === nickname && el.children.length === 0);
  if (nameEl && nameEl.parentElement && !nameEl.parentElement.querySelector('.faceit-ext-flag')) {
    const span = document.createElement('span');
    span.className = 'faceit-ext-flag';
    span.textContent = flag;
    span.style.marginRight = '4px';
    nameEl.parentElement.insertBefore(span, nameEl);
  }
}

function injectToPlayer(nickname: string, text: string) {
  const els = Array.from(document.querySelectorAll('span, div, a'));
  const nameEl = els.find(el => el.textContent?.trim() === nickname && el.children.length === 0);
  if (nameEl && nameEl.parentElement && !nameEl.parentElement.querySelector('.faceit-ext-player-stats')) {
    const span = document.createElement('span');
    span.className = 'faceit-ext-player-stats';
    span.setAttribute('data-nickname', nickname); // Для hover-карточек
    span.textContent = text;
    nameEl.parentElement.appendChild(span);
  }
}