import { Settings } from '../core/settings';
import { FaceitAPI } from '../core/api';
import { t } from '../core/i18n';

let hasCopied = false;
let hasConnected = false;
let currentMatchUrl = '';

export function initMatchroomConnect() {
  setInterval(async () => {
    if (!window.location.pathname.includes('/room/')) {
      hasCopied = false;
      hasConnected = false;
      currentMatchUrl = '';
      return;
    }

    if (currentMatchUrl !== window.location.href) {
      currentMatchUrl = window.location.href;
      hasCopied = false;
      hasConnected = false;
    }

    const autoCopy = Settings.get('faceit.matchroom.overview.connect.autoCopy.enabled');
    const autoConnect = Settings.get('faceit.matchroom.overview.connect.autoConnect.enabled');
    const useAcProtocol = Settings.get('faceit.matchroom.overview.connect.acProtocol.enabled');
    const connectDelay = Settings.get('faceit.matchroom.overview.connect.autoConnect.delay');

    if (!autoCopy && !autoConnect) return;

    if (autoCopy && !hasCopied) {
      const copyBtn = document.querySelector('button[class*="CopyButton"], button[aria-label*="Copy"]') as HTMLButtonElement;
      if (copyBtn) {
        hasCopied = true;
        copyBtn.click();
        console.log(t('logIpCopied'));
      }
    }

    if (autoConnect && !hasConnected) {
      const connectBtn = document.querySelector('button[class*="SplitButton__MainButton"], button[class*="OptionButton"]') as HTMLButtonElement;
      
      if (connectBtn && !connectBtn.disabled && /(connect|play|играть|подключиться)/i.test(connectBtn.textContent || '')) {
        hasConnected = true;
        
        if (useAcProtocol) {
          const matchId = window.location.pathname.split('/room/')[1];
          const matchData = await FaceitAPI.getMatchDetails(matchId);
          
          if (matchData && matchData.clientCustom && matchData.clientCustom.server) {
             const ip = matchData.clientCustom.server.ip;
             const port = matchData.clientCustom.server.port;
             const acLink = `faceitac://connect/${ip}:${port}`;
             
             console.log(t('logAcConnect', { delay: connectDelay }));
             setTimeout(() => { window.open(acLink, '_self'); }, connectDelay);
             return;
          }
        }

        console.log(t('logAutoConnect', { delay: connectDelay }));
        setTimeout(() => { connectBtn.click(); }, connectDelay);
      }
    }
  }, 1000);
}