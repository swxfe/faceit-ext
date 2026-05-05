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
         const mapVoting = matchData.voting.map;
         if (mapVoting && mapVoting.pick && mapVoting.pick.length > 0) {
           const pickedMapId = mapVoting.pick[0]; 
           const entity = mapVoting.entities?.find((e: any) => e.class_name === pickedMapId || e.game_map_id === pickedMapId || e.guid === pickedMapId);
           mapName = entity ? entity.name : pickedMapId;
           if (mapName.startsWith('de_')) {
             mapName = mapName.replace('de_', '').charAt(0).toUpperCase() + mapName.slice(4);
           }
         }

         const locVoting = matchData.voting.location;
         if (locVoting && locVoting.pick && locVoting.pick.length > 0) {
           const pickedLocId = locVoting.pick[0];
           const entity = locVoting.entities?.find((e: any) => e.guid === pickedLocId);
           serverName = entity ? entity.name : pickedLocId;
         }
      }

      if (Notification.permission === 'granted') {
        const notif = new Notification(t('notifMatchStart'), {
          body: t('notifMatchBody', { map: mapName, server: serverName }),
          icon: 'https://www.faceit.com/favicon.ico'
        });
        notif.onclick = () => window.focus();
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }
  }, 2000);
}