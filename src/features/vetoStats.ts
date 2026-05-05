import { Settings } from '../core/settings';
import { t } from '../core/i18n';

export function initVetoStats() {
  setInterval(() => {
    if (!window.location.pathname.includes('/room/')) return;
    if (!Settings.get('faceit.matchroom.veto.stats.enabled')) return;

    const mapItems = document.querySelectorAll('div[data-testid="matchPreference"]:not(.faceit-ext-stats-added)');
    if (mapItems.length === 0) return;

    mapItems.forEach(item => {
      if (!item.innerHTML.includes('/games/')) return;
      
      item.classList.add('faceit-ext-stats-added');
      
      const statDiv = document.createElement('div');
      statDiv.className = 'faceit-ext-veto-stats';
      statDiv.innerHTML = t('statsVetoLoading');
      
      item.appendChild(statDiv);

      setTimeout(() => {
         statDiv.innerHTML = t('statsVetoData', { matches: '-', wr: '-' });
      }, 500);
    });
  }, 1000);
}