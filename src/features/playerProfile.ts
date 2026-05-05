import { Settings } from '../core/settings';
import { FaceitAPI } from '../core/api';
import { RawIcons } from '../assets/icons';
import { t } from '../core/i18n';

let currentProfileNickname = '';
let matchHistoryData: any[] = [];

export function initPlayerProfile() {
  setInterval(async () => {
    if (!window.location.pathname.includes('/players/')) return;
    
    const showElo = Settings.get('faceit.playerProfile.stats.eloLevel.enabled');
    const showDemo = Settings.get('faceit.playerProfile.stats.demoDownload.enabled');
    const showRecent = Settings.get('faceit.playerProfile.stats.recent20.enabled');

    if (!showElo && !showDemo && !showRecent) return;

    const nicknameMatch = window.location.pathname.match(/\/players\/([^/]+)/);
    if (nicknameMatch) {
      const nickname = nicknameMatch[1];
      if (currentProfileNickname !== nickname) {
        currentProfileNickname = nickname;
        const user = await FaceitAPI.getUserByNickname(nickname);
        if (user) {
          matchHistoryData = await FaceitAPI.getPlayerMatchHistory(user.id);
          
          // НОВОЕ: Инжект статы за последние 20 матчей
          if (showRecent && matchHistoryData && matchHistoryData.length > 0) {
            injectRecentStats(matchHistoryData);
          }
        }
      }
    }

    // Обработка ELO и подсветка
    if (showElo) {
      const skillLevelContainers = document.querySelectorAll('div[class*="SkillLevel__Container"]');
      skillLevelContainers.forEach(container => {
        const texts = Array.from(container.querySelectorAll('span, p'));
        const eloTextNode = texts.find(t => t.textContent?.toLowerCase().includes('elo'));
        if (eloTextNode && !container.classList.contains('faceit-ext-profile-enhanced')) {
          container.classList.add('faceit-ext-profile-enhanced');
          (eloTextNode as HTMLElement).style.color = '#ff5500';
          (eloTextNode as HTMLElement).style.fontWeight = 'bold';
          (eloTextNode as HTMLElement).style.fontSize = '16px';
        }
      });
    }

    // Обработка строк с матчами
    const matchRows = document.querySelectorAll('table[class*="MatchTable"] tbody tr, div[class*="MatchHistory__ItemsContainer"] a[href*="/room/"]');
    
    matchRows.forEach(row => {
      const link = row.tagName === 'A' ? (row as HTMLAnchorElement) : row.querySelector('a[href*="/room/"]');
      const matchId = link ? (link as HTMLAnchorElement).href.split('/room/').pop() : null;

      if (!row.classList.contains('faceit-ext-colored') && showElo) {
        const textContent = row.textContent?.toLowerCase() || '';
        if (textContent.includes('win')) row.classList.add('faceit-ext-colored', 'faceit-ext-win');
        else if (textContent.includes('loss')) row.classList.add('faceit-ext-colored', 'faceit-ext-loss');

        if (matchHistoryData && matchId && !row.querySelector('.faceit-ext-elo-diff')) {
          const matchData = matchHistoryData.find((m: any) => m.matchId === matchId);
          if (matchData && matchData.eloDiff) {
            const diff = parseInt(matchData.eloDiff);
            const diffSpan = document.createElement('span');
            diffSpan.className = `faceit-ext-elo-diff`;
            diffSpan.style.color = diff > 0 ? '#22c55e' : '#ef4444';
            diffSpan.style.fontWeight = 'bold';
            diffSpan.style.marginLeft = '8px';
            diffSpan.textContent = `[${diff > 0 ? '+' : ''}${diff}]`;
            
            const resultCell = Array.from(row.querySelectorAll('span, div')).find(el => el.textContent?.trim().toLowerCase() === 'win' || el.textContent?.trim().toLowerCase() === 'loss');
            if (resultCell) resultCell.parentElement?.appendChild(diffSpan);
          }
        }
      }

      // НОВОЕ: Кнопка Открыть Матч + Демка
      if (showDemo && matchId && !row.querySelector('.faceit-ext-actions-container')) {
        const actionContainer = document.createElement('div');
        actionContainer.className = 'faceit-ext-actions-container';
        actionContainer.style.display = 'inline-flex';
        actionContainer.style.gap = '8px';
        actionContainer.style.marginLeft = 'auto';

        const openMatchBtn = document.createElement('a');
        openMatchBtn.href = `/en/cs2/room/${matchId}`;
        openMatchBtn.target = '_blank';
        openMatchBtn.title = t('openMatchTitle');
        openMatchBtn.innerHTML = RawIcons.ExternalLink;
        openMatchBtn.className = 'faceit-ext-action-btn';
        actionContainer.appendChild(openMatchBtn);

        row.appendChild(actionContainer); 

        FaceitAPI.getMatchDetails(matchId).then(details => {
          const demoUrls = details?.demo_url;
          if (demoUrls && demoUrls.length > 0) {
            const demoBtn = document.createElement('a');
            demoBtn.href = demoUrls[0];
            demoBtn.title = t('demoTitle');
            demoBtn.innerHTML = RawIcons.DemoDownload;
            demoBtn.className = 'faceit-ext-action-btn faceit-ext-demo-btn';
            actionContainer.appendChild(demoBtn);
          }
        });

        const flexContainers = Array.from(row.querySelectorAll('div[class*="Flex"]'));
        const targetCell = flexContainers.length > 0 ? flexContainers[flexContainers.length - 1] : row.lastElementChild;
        if (targetCell) targetCell.appendChild(actionContainer);
      }
    });

  }, 1500);
}

// НОВОЕ: Подсчет статы за ласт 20 матчей
function injectRecentStats(matches: any[]) {
  const container = document.querySelector('div[class*="ProfileHeader__Container"]');
  if (!container || document.querySelector('.faceit-ext-recent20')) return;

  const validMatches = matches.filter(m => m.i6 && m.i8); // i6 = kills, i8 = K/D
  if (validMatches.length === 0) return;

  const wins = validMatches.filter(m => m.i10 === '1').length; // i10 = 1 if win
  const winRate = Math.round((wins / validMatches.length) * 100);
  const avgKD = (validMatches.reduce((acc, m) => acc + parseFloat(m.i8), 0) / validMatches.length).toFixed(2);

  const block = document.createElement('div');
  block.className = 'faceit-ext-recent20';
  block.innerHTML = t('recent20Stats', { kd: avgKD, wr: winRate });
  
  // Вставляем красиво над статистикой
  const statsArea = container.querySelector('div[class*="SkillLevel__Container"]')?.parentElement;
  if (statsArea) statsArea.appendChild(block);
}