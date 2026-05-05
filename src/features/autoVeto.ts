import { Settings } from '../core/settings';
import { t } from '../core/i18n';

let isBanning = false;

export function initAutoVeto() {
  setInterval(() => {
    if (!window.location.pathname.includes('/room/')) return;
    if (isBanning) return;

    const mapBanEnabled = Settings.get('faceit.matchroom.veto.map.autoBan.enabled');
    const serverBanEnabled = Settings.get('faceit.matchroom.veto.server.autoBan.enabled');
    
    if (!mapBanEnabled && !serverBanEnabled) return;

    const preferenceItems = Array.from(document.querySelectorAll('div[data-testid="matchPreference"]'));
    if (preferenceItems.length === 0) return;

    const votableItems = preferenceItems.filter(item => {
      const btn = item.querySelector('button');
      return btn && !btn.disabled;
    });

    if (votableItems.length === 0) return;

    const isMapVeto = votableItems.some(i => i.innerHTML.includes('/games/'));
    const isServerVeto = votableItems.some(i => i.innerHTML.includes('/flags/'));

    let banListString = '';

    if (isMapVeto && mapBanEnabled) {
      banListString = Settings.get('faceit.matchroom.veto.map.autoBan.list') as string;
    } else if (isServerVeto && serverBanEnabled) {
      banListString = Settings.get('faceit.matchroom.veto.server.autoBan.list') as string;
    } else {
      return;
    }

    const banPriority = banListString.split(',').map(s => s.trim().toLowerCase()).filter(s => s.length > 0);
    if (banPriority.length === 0) return;

    for (const targetName of banPriority) {
      const itemToBan = votableItems.find(item => {
        const itemName = item.textContent?.toLowerCase() || '';
        return itemName.includes(targetName);
      });

      if (itemToBan) {
        const banBtn = itemToBan.querySelector('button') as HTMLButtonElement;
        if (banBtn && !banBtn.disabled) {
          isBanning = true;
          const delay = Settings.get('faceit.matchroom.veto.autoBan.delay') as number;
          
          const toastId = 'faceit-ext-veto-toast';
          let toast = document.getElementById(toastId);
          if (!toast) {
            toast = document.createElement('div');
            toast.id = toastId;
            toast.className = 'faceit-ext-toast';
            toast.innerHTML = `
              <div class="toast-content">
                <span class="toast-text">${t('toastAutoBan', { target: targetName.toUpperCase(), time: delay / 1000 })}</span>
                <button id="cancel-ban-btn" class="toast-btn">${t('btnCancel')}</button>
              </div>
            `;
            document.body.appendChild(toast);
          }

          let cancelled = false;
          let timeLeft = delay / 1000;
          
          const timerInterval = setInterval(() => {
            timeLeft -= 1;
            const timerEl = document.getElementById('veto-timer');
            if (timerEl) timerEl.textContent = timeLeft.toString();
          }, 1000);

          document.getElementById('cancel-ban-btn')?.addEventListener('click', () => {
            cancelled = true;
            toast?.remove();
            clearInterval(timerInterval);
            console.log(t('logBanCanceled'));
            setTimeout(() => { isBanning = false; }, 3000); 
          });

          setTimeout(() => {
            clearInterval(timerInterval);
            if (!cancelled && document.body.contains(banBtn) && !banBtn.disabled) {
              banBtn.click();
              console.log(t('logBanSuccess', { target: targetName }));
            }
            if (!cancelled) toast?.remove();
            setTimeout(() => { isBanning = false; }, 2000);
          }, delay);

          break; 
        }
      }
    }
  }, 1000);
}