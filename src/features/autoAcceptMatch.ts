import { Settings } from '../core/settings';
import { CONSTANTS } from '../core/constants';
import { t } from '../core/i18n';

let isAcceptingMatch = false;

export function initMatchAutoAccept() {
  setInterval(() => {
    if (!Settings.get('faceit.matchReady.autoAccept.enabled')) return;
    if (isAcceptingMatch) return;

    const dialogs = document.querySelectorAll('div[role="dialog"], [class*="Modal"]');

    for (const dialog of Array.from(dialogs)) {
      if (CONSTANTS.MATCH_READY_REGEX.test(dialog.textContent || '')) {
        const buttons = Array.from(dialog.querySelectorAll('button'));
        const acceptBtn = buttons.find(b => /(Accept|Принять|Godkänn|Kabul Et|Accepta|Gotowa)/i.test(b.textContent || ''));

        if (acceptBtn && !acceptBtn.disabled) {
          isAcceptingMatch = true;
          const delay = Settings.get('faceit.matchReady.autoAccept.delay');
          console.log(t('logMatchFound', { delay }));

          setTimeout(() => {
            acceptBtn.click();
            console.log(t('logMatchAccepted'));
            setTimeout(() => { isAcceptingMatch = false; }, 5000);
          }, delay);

          break;
        }
      }
    }
  }, 1000);
}