import { Settings } from '../core/settings';
import { t } from '../core/i18n';

export function initMatchroomUI() {
  const styleId = 'faceit-ext-ui-styles';
  let styleEl = document.getElementById(styleId);

  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = styleId;
    document.head.appendChild(styleEl);
  }

  setInterval(() => {
    const isMatchroom = window.location.pathname.includes('/room/');
    let css = '';

    if (isMatchroom && Settings.get('faceit.matchroom.ui.focusMode.enabled')) {
      css += `
        div[class*="ListContentPlayer__Background"] div[class*="NicknameContainer"],
        div[class*="ListContentPlayer__Background"] div[class*="AvatarHolder"],
        div[class*="ListContentPlayer__Background"] div[class*="StatsContainer"],
        div[class*="ListContentPlayer__Background"] div[class*="SkillLevelContainer"],
        div[class*="ListContentPlayer__Background"] div[class*="EndSlotContainer"] {
          filter: blur(6px); opacity: 0.5; pointer-events: none; user-select: none;
          transition: filter 0.3s ease, opacity 0.3s ease;
        }
        div[class*="ListContentPlayer__Background"]:hover div[class*="NicknameContainer"],
        div[class*="ListContentPlayer__Background"]:hover div[class*="AvatarHolder"],
        div[class*="ListContentPlayer__Background"]:hover div[class*="StatsContainer"],
        div[class*="ListContentPlayer__Background"]:hover div[class*="SkillLevelContainer"],
        div[class*="ListContentPlayer__Background"]:hover div[class*="EndSlotContainer"] {
          filter: blur(0px); opacity: 1;
        }
      `;
    }

    // НОВОЕ: Znipe Theater Mode (Широкий экран трансляции)
    if (isMatchroom && Settings.get('faceit.matchroom.ui.theaterMode.enabled')) {
       css += `
         znipe-multi-view-player {
           position: fixed !important;
           top: 0 !important;
           left: 0 !important;
           width: 100vw !important;
           height: 100vh !important;
           z-index: 9999 !important;
         }
       `;
    }

    if (styleEl.innerHTML !== css) styleEl.innerHTML = css;

    if (isMatchroom && Settings.get('faceit.matchroom.ui.hideSkinOfTheMatch.enabled')) {
      const elements = Array.from(document.querySelectorAll('h5, h6, span, div'));
      const sotmHeader = elements.find(el => {
        const text = el.textContent?.toLowerCase() || '';
        return text === 'skin of the match' || text.includes('skin of the match');
      });

      if (sotmHeader) {
        const card = sotmHeader.closest('div[class*="styles__Card"], div[class*="Overview__Column"] > div');
        if (card && (card as HTMLElement).style.display !== 'none') {
          (card as HTMLElement).style.display = 'none';
          console.log(t('logSotmHidden'));
        }
      }
    }
  }, 1000);
}