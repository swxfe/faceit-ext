import { Settings } from '../core/settings';
import { CONSTANTS } from '../core/constants';
import { t } from '../core/i18n';

let isAcceptingParty = false;

export function initPartyAutoAccept() {
  setInterval(() => {
    if (!Settings.get('faceit.partyInvite.autoAccept.enabled')) return;
    if (isAcceptingParty) return;

    const popups = document.querySelectorAll('div[role="dialog"], [class*="Snackbar"], [class*="Toast"]');

    for (const popup of Array.from(popups)) {
      if (CONSTANTS.PARTY_INVITE_REGEX.test(popup.textContent || '')) {
        const buttons = Array.from(popup.querySelectorAll('button'));
        const acceptBtn = buttons.find(b => /(Accept|Принять|Godkänn|Kabul Et)/i.test(b.textContent || ''));

        if (acceptBtn && !acceptBtn.disabled) {
          isAcceptingParty = true;
          const delay = Settings.get('faceit.partyInvite.autoAccept.delay');
          console.log(t('logPartyFound', { delay }));

          setTimeout(() => {
            acceptBtn.click();
            console.log(t('logPartyAccepted'));
            setTimeout(() => { isAcceptingParty = false; }, 5000);
          }, delay);

          break;
        }
      }
    }
  }, 1000);
}