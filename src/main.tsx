import { render } from 'preact';
import { initMatchAutoAccept } from './features/autoAcceptMatch';
import { initPartyAutoAccept } from './features/autoAcceptParty';
import { initMatchroomConnect } from './features/matchroomConnect';
import { initAutoVeto } from './features/autoVeto';
import { initVetoStats } from './features/vetoStats';
import { initMatchroomUI } from './features/matchroomUI';
import { initMatchroomStats } from './features/matchroomStats';
import { initRightSidebar } from './features/rightSidebar';
import { initPlayerProfile } from './features/playerProfile';
import { initMatchNotifier } from './features/matchNotifier';
import { SettingsUI } from './features/ui/SettingsUI';
import { t } from './core/i18n';
import './index.css';

function injectUI() {
  const sidebarContainer = document.querySelector('div[class*="SideBarContainer"]');
  if (sidebarContainer && !document.getElementById('faceit-ext-root')) {
    const appRoot = document.createElement('div');
    appRoot.id = 'faceit-ext-root';
    sidebarContainer.appendChild(appRoot);
    render(<SettingsUI />, appRoot);
  }
}

function bootstrap() {
  console.log(t('logInit'));

  initMatchAutoAccept();
  initPartyAutoAccept();
  initMatchroomConnect();
  initAutoVeto();
  initVetoStats();
  initMatchroomUI();
  initMatchroomStats();
  initRightSidebar();
  initPlayerProfile();
  initMatchNotifier();

  setInterval(injectUI, 1000);
}

bootstrap();