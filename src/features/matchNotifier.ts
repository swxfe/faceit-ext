import { Settings } from '../core/settings';
import { FaceitAPI } from '../core/api';
import { t } from '../core/i18n';

let notifiedMatchId = '';

export function initMatchNotifier() {
  setInterval(async () => {
    if (!Settings.get('faceit.matchroom.notifications.enabled')) return;
    if (!window.location.pathname.includes('/room/')) return;

    const matchMatch = window.location.pathname.match(/\/room\/([^/]+)/);
    if (!matchMatch) return;
    const matchId = matchMatch[1];

    if (notifiedMatchId === matchId) return;

    const connectBtn = document.querySelector('button[class*="SplitButton__MainButton"], button[class*="OptionButton"], button[class*="CopyButton"]');
    
    if (connectBtn) {
      notifiedMatchId = matchId;

      const matchData = await FaceitAPI.getMatchDetails(matchId);
      let serverName = t('unknown');
      let mapName = t('unknown');

      if (matchData && matchData.voting) {
         const loc = matchData.voting.location?.pick?.[0];
         const map = matchData.voting.map?.pick?.[0];
         if (loc) serverName = loc;
         if (map) mapName = map;
      }

      if (Notification.permission === 'granted') {
        const notif = new Notification(t('notifMatchStart'), {
          body: t('notifMatchBody', { map: mapName, server: serverName }),
          icon: 'https://www.faceit.com/favicon.ico'
        });
        
        notif.onclick = () => window.focus();
      }
    }
  }, 2000);
}