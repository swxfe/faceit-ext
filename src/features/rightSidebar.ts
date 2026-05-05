import { Settings } from '../core/settings';
import { FaceitAPI } from '../core/api';
import { FaceitAssets } from '../assets/icons';
import { CONSTANTS } from '../core/constants';

const userCache = new Map<string, any>();
let myMatchHistory: any[] = [];

export function initRightSidebar() {
  setInterval(async () => {
    
    if (Settings.get('faceit.rightSidebar.eloLevel.enabled') || Settings.get('faceit.rightSidebar.eloProgress.enabled')) {
      const myProfileLink = document.querySelector('div[class*="AccountSidebarHolder"] a[href^="/en/players/"]') as HTMLAnchorElement;
      if (myProfileLink) {
        const nickname = myProfileLink.href.split('/').pop();
        if (nickname) injectEloToSidebarElement(nickname, myProfileLink.parentElement, true);
      }
    }

    // НОВОЕ: Расширен поиск элементов (теперь ловит и инвайты/рекомендации)
    if (Settings.get('faceit.rightSidebar.friends.eloLevel.enabled')) {
      const items = document.querySelectorAll(`
        div[data-testid="friend-list-item"], 
        div[class*="InvitePlayersHolder"] div[class*="styles__PlayersHolder"]
      `);
      
      items.forEach(item => {
        const nameSpan = item.querySelector('span[class*="styles__Nickname"], span[class*="styles__Name"]');
        if (nameSpan && nameSpan.textContent) {
          injectEloToSidebarElement(nameSpan.textContent.trim(), item as HTMLElement, false);
        }
      });
    }

    if (Settings.get('faceit.rightSidebar.matches.elo.enabled')) {
      const historyLinks = document.querySelectorAll('div[class*="MatchHistory__Container"] a[href*="/room/"]');
      if (historyLinks.length > 0 && myMatchHistory.length === 0) {
         const myProfileLink = document.querySelector('div[class*="AccountSidebarHolder"] a[href^="/en/players/"]') as HTMLAnchorElement;
         if (myProfileLink) {
            const nickname = myProfileLink.href.split('/').pop();
            if (nickname) {
               const user = await FaceitAPI.getUserByNickname(nickname);
               if (user) myMatchHistory = await FaceitAPI.getPlayerMatchHistory(user.id);
            }
         }
      }

      historyLinks.forEach(link => {
        const matchId = (link as HTMLAnchorElement).href.split('/room/').pop();
        if (matchId && myMatchHistory.length > 0 && !link.querySelector('.faceit-ext-sidebar-diff')) {
          const matchData = myMatchHistory.find((m: any) => m.matchId === matchId);
          if (matchData && matchData.eloDiff) {
            const diff = parseInt(matchData.eloDiff);
            const diffSpan = document.createElement('span');
            diffSpan.className = `faceit-ext-sidebar-diff`;
            diffSpan.style.color = diff > 0 ? '#22c55e' : '#ef4444';
            diffSpan.style.fontSize = '12px';
            diffSpan.style.fontWeight = 'bold';
            diffSpan.style.marginLeft = 'auto';
            diffSpan.textContent = ` ${diff > 0 ? '+' : ''}${diff}`;
            
            const scoreDiv = link.querySelector('div[class*="MatchHistoryItem__TextContainer"]');
            if (scoreDiv) scoreDiv.appendChild(diffSpan);
          }
        }
      });
    }
  }, 2500);
}

async function injectEloToSidebarElement(nickname: string, container: HTMLElement | null, isSelf: boolean) {
  if (!container || container.querySelector('.faceit-ext-sidebar-elo')) return;

  if (!userCache.has(nickname)) {
    userCache.set(nickname, 'fetching');
    const user = await FaceitAPI.getUserByNickname(nickname);
    if (user && user.games && user.games.cs2) {
      userCache.set(nickname, {
        elo: user.games.cs2.faceit_elo,
        level: user.games.cs2.skill_level,
        country: user.country
      });
    } else {
      userCache.set(nickname, 'error');
    }
  }

  const data = userCache.get(nickname);
  if (!data || data === 'fetching' || data === 'error') return;

  // НОВОЕ: Свечение Челленджеров в Сайдбаре!
  if (data.elo > 3500 && container) {
     container.classList.add('faceit-ext-challenger');
  }

  const eloDiv = document.createElement('div');
  eloDiv.className = `faceit-ext-sidebar-elo ${isSelf ? 'self' : 'friend'}`;

  const levelImg = document.createElement('img');
  levelImg.src = FaceitAssets.getLevelIcon(data.level);
  levelImg.alt = `Level ${data.level}`;

  let text = `${data.elo} ELO`;

  if (isSelf && Settings.get('faceit.rightSidebar.eloProgress.enabled') && data.level < 10) {
     const nextLevelData = CONSTANTS.CS2_ELO_LEVELS.find(l => l.level === data.level + 1);
     if (nextLevelData) {
        const eloNeeded = nextLevelData.min - data.elo;
        text += ` (${eloNeeded} to next)`;
     }
  }

  const eloText = document.createElement('span');
  eloText.textContent = text;

  if (Settings.get('faceit.matchroom.overview.player.countryFlag.enabled') && data.country) {
     const flag = document.createElement('span');
     flag.textContent = CONSTANTS.getCountryEmoji(data.country);
     flag.style.marginRight = '6px';
     eloDiv.appendChild(flag);
  }

  eloDiv.appendChild(levelImg);
  eloDiv.appendChild(eloText);

  if (isSelf) {
    container.appendChild(eloDiv);
  } else {
    const wrapper = container.querySelector('div[class*="MiddleSlotWrapper"], div[class*="styles__ActionHolder"]');
    if (wrapper) wrapper.parentElement?.insertBefore(eloDiv, wrapper);
  }
}