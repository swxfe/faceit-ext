import { useState } from 'preact/hooks';
import { createPortal } from 'preact/compat';
import { Settings, SettingsKey } from '../../core/settings';
import { Icons } from '../../assets/icons';
import { CONSTANTS } from '../../core/constants';
import { t } from '../../core/i18n';

function SettingRow({ title, description, children }: { title: string, description: string, children: preact.ComponentChildren }) {
  return (
    <div class="setting-row">
      <div class="setting-info">
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
      <div class="setting-control">{children}</div>
    </div>
  );
}

function NumberInput({ value, min, max, step, onChange }: { value: number, min: number, max: number, step: number, onChange: (v: number) => void }) {
  const handleDec = () => onChange(Math.max(min, value - step));
  const handleInc = () => onChange(Math.min(max, value + step));
  const handleChange = (e: any) => {
    let val = parseInt(e.target.value) || 0;
    if (val < min) val = min;
    if (val > max) val = max;
    onChange(val);
  };
  return (
    <div class="number-control">
      <button class="number-control-btn" onClick={handleDec}>−</button>
      <input type="number" class="number-control-input" value={value} min={min} max={max} step={step} onChange={handleChange} />
      <button class="number-control-btn" onClick={handleInc}>+</button>
    </div>
  );
}

function CustomSelect({ value, options, onChange }: { value: string, options: {val: string, label: string}[], onChange: (v: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(o => o.val === value) || options[0];

  return (
    <div class="faceit-custom-select-container">
      <div class={`faceit-custom-select-trigger ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        <span>{selectedOption.label}</span>
        <span class="chevron">▼</span>
      </div>
      {isOpen && (
        <>
          <div class="faceit-custom-select-backdrop" onClick={() => setIsOpen(false)}></div>
          <div class="faceit-custom-select-menu">
            {options.map(opt => (
              <div 
                class={`faceit-custom-select-option ${opt.val === value ? 'selected' : ''}`} 
                onClick={() => { onChange(opt.val); setIsOpen(false); }}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function PriorityBuilder({ pool, valueStr, onChange }: { pool: string[], valueStr: string, onChange: (val: string) => void }) {
  const selected = valueStr.split(',').map(s => s.trim()).filter(s => s.length > 0);
  const available = pool.filter(item => !selected.includes(item));
  return (
    <div class="veto-builder">
      <div class="veto-builder-section">
        <span class="veto-builder-label">{t('vetoQueueLabel')}</span>
        <div class="veto-pill-container">
          {selected.map(item => (<div class="veto-pill selected" onClick={() => onChange(selected.filter(i => i !== item).join(', '))}>{item} <span>✕</span></div>))}
          {selected.length === 0 && <span class="veto-empty">{t('vetoNothing')}</span>}
        </div>
      </div>
      <div class="veto-builder-section">
        <span class="veto-builder-label">{t('vetoAvailLabel')}</span>
        <div class="veto-pill-container">
          {available.map(item => (<div class="veto-pill" onClick={() => onChange([...selected, item].join(', '))}>{item} <span>+</span></div>))}
        </div>
      </div>
    </div>
  );
}

type TabKey = 'general' | 'matchroom' | 'veto' | 'ui' | 'profile';

export function SettingsUI() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('general');

  const [language, setLanguage] = useState(Settings.get('extension.language'));

  const [matchEnabled, setMatchEnabled] = useState(Settings.get('faceit.matchReady.autoAccept.enabled'));
  const [matchDelay, setMatchDelay] = useState(Settings.get('faceit.matchReady.autoAccept.delay') as number);
  const [partyEnabled, setPartyEnabled] = useState(Settings.get('faceit.partyInvite.autoAccept.enabled'));
  const [partyDelay, setPartyDelay] = useState(Settings.get('faceit.partyInvite.autoAccept.delay') as number);

  const [autoCopy, setAutoCopy] = useState(Settings.get('faceit.matchroom.overview.connect.autoCopy.enabled'));
  const [autoConnect, setAutoConnect] = useState(Settings.get('faceit.matchroom.overview.connect.autoConnect.enabled'));
  const [acProtocol, setAcProtocol] = useState(Settings.get('faceit.matchroom.overview.connect.acProtocol.enabled'));
  const [connectDelay, setConnectDelay] = useState(Settings.get('faceit.matchroom.overview.connect.autoConnect.delay') as number);
  const [notifications, setNotifications] = useState(Settings.get('faceit.matchroom.notifications.enabled'));

  const [mapBanEnabled, setMapBanEnabled] = useState(Settings.get('faceit.matchroom.veto.map.autoBan.enabled'));
  const [mapBanList, setMapBanList] = useState(Settings.get('faceit.matchroom.veto.map.autoBan.list'));
  const [serverBanEnabled, setServerBanEnabled] = useState(Settings.get('faceit.matchroom.veto.server.autoBan.enabled'));
  const [serverBanList, setServerBanList] = useState(Settings.get('faceit.matchroom.veto.server.autoBan.list'));
  const [vetoDelay, setVetoDelay] = useState(Settings.get('faceit.matchroom.veto.autoBan.delay') as number);
  const [vetoStats, setVetoStats] = useState(Settings.get('faceit.matchroom.veto.stats.enabled'));

  const [focusMode, setFocusMode] = useState(Settings.get('faceit.matchroom.ui.focusMode.enabled'));
  const [hideSOTM, setHideSOTM] = useState(Settings.get('faceit.matchroom.ui.hideSkinOfTheMatch.enabled'));
  const [theaterMode, setTheaterMode] = useState(Settings.get('faceit.matchroom.ui.theaterMode.enabled'));
  
  const [teamEloEnabled, setTeamEloEnabled] = useState(Settings.get('faceit.matchroom.overview.team.elo.enabled'));
  const [playerStatsEnabled, setPlayerStatsEnabled] = useState(Settings.get('faceit.matchroom.overview.player.stats.enabled'));
  const [hoverCards, setHoverCards] = useState(Settings.get('faceit.matchroom.overview.player.hoverCards.enabled'));
  const [encounters, setEncounters] = useState(Settings.get('faceit.matchroom.overview.player.encounters.enabled'));

  const [sidebarElo, setSidebarElo] = useState(Settings.get('faceit.rightSidebar.eloLevel.enabled'));
  const [friendsElo, setFriendsElo] = useState(Settings.get('faceit.rightSidebar.friends.eloLevel.enabled'));
  const [profileElo, setProfileElo] = useState(Settings.get('faceit.playerProfile.stats.eloLevel.enabled'));
  const [demoDownload, setDemoDownload] = useState(Settings.get('faceit.playerProfile.stats.demoDownload.enabled'));
  const [recent20, setRecent20] = useState(Settings.get('faceit.playerProfile.stats.recent20.enabled'));

  const updateSetting = (key: SettingsKey, value: any, setter: (v: any) => void) => {
    Settings.set(key, value);
    setter(value);
  };

  return (
    <>
      <button class={`custom-sidebar-btn ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(true)}>
        <Icons.Settings />
      </button>

      {isOpen && createPortal(
        <div class="custom-modal-overlay" onClick={() => setIsOpen(false)}>
          <div class="custom-modal-box" onClick={(e) => e.stopPropagation()}>
            <div class="custom-modal-header">
              <h2>{t('uiTitle')}</h2>
              <button class="close-btn" onClick={() => setIsOpen(false)}><Icons.Close /></button>
            </div>
            <div class="custom-modal-body">
              <div class="custom-modal-sidebar">
                <button class={`tab-btn ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')}>{t('tabGeneral')}</button>
                <button class={`tab-btn ${activeTab === 'matchroom' ? 'active' : ''}`} onClick={() => setActiveTab('matchroom')}>{t('tabMatchroom')}</button>
                <button class={`tab-btn ${activeTab === 'veto' ? 'active' : ''}`} onClick={() => setActiveTab('veto')}>{t('tabVeto')}</button>
                <button class={`tab-btn ${activeTab === 'ui' ? 'active' : ''}`} onClick={() => setActiveTab('ui')}>{t('tabUI')}</button>
                <button class={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>{t('tabProfile')}</button>
              </div>

              <div class="custom-modal-content">
                {activeTab === 'general' && (
                  <>
                    <h3 class="section-title">{t('secExtension')}</h3>
                    <SettingRow title={t('setLanguage')} description={t('setLanguageDesc')}>
                      <CustomSelect 
                        value={language as string} 
                        options={[ {val: 'auto', label: t('langAuto')}, {val: 'en', label: t('langEn')}, {val: 'ru', label: t('langRu')} ]}
                        onChange={(val) => { updateSetting('extension.language', val, setLanguage); setTimeout(() => window.location.reload(), 300); }}
                      />
                    </SettingRow>

                    <div class="divider"></div>
                    <h3 class="section-title">{t('secAutoAccept')}</h3>
                    <SettingRow title={t('setMatchEnable')} description={t('setMatchEnableDesc')}>
                      <label class="faceit-toggle"><input type="checkbox" checked={matchEnabled} onChange={(e) => updateSetting('faceit.matchReady.autoAccept.enabled', (e.target as HTMLInputElement).checked, setMatchEnabled)} /><span class="slider"></span></label>
                    </SettingRow>
                    <SettingRow title={t('setMatchDelay')} description={t('setMatchDelayDesc')}>
                      <NumberInput value={matchDelay} min={0} max={10000} step={500} onChange={(v) => updateSetting('faceit.matchReady.autoAccept.delay', v, setMatchDelay)} />
                    </SettingRow>

                    <div class="divider"></div>
                    <h3 class="section-title">{t('secParty')}</h3>
                    <SettingRow title={t('setPartyEnable')} description={t('setPartyEnableDesc')}>
                      <label class="faceit-toggle"><input type="checkbox" checked={partyEnabled} onChange={(e) => updateSetting('faceit.partyInvite.autoAccept.enabled', (e.target as HTMLInputElement).checked, setPartyEnabled)} /><span class="slider"></span></label>
                    </SettingRow>
                    <SettingRow title={t('setMatchDelay')} description={t('setMatchDelayDesc')}>
                      <NumberInput value={partyDelay} min={0} max={10000} step={500} onChange={(v) => updateSetting('faceit.partyInvite.autoAccept.delay', v, setPartyDelay)} />
                    </SettingRow>
                  </>
                )}

                {activeTab === 'matchroom' && (
                  <>
                    <h3 class="section-title">{t('secConnect')}</h3>
                    <SettingRow title={t('setNotif')} description={t('setNotifDesc')}>
                      <label class="faceit-toggle"><input type="checkbox" checked={notifications} onChange={(e) => updateSetting('faceit.matchroom.notifications.enabled', (e.target as HTMLInputElement).checked, setNotifications)} /><span class="slider"></span></label>
                    </SettingRow>
                    <SettingRow title={t('setAutoCopy')} description={t('setAutoCopyDesc')}>
                      <label class="faceit-toggle"><input type="checkbox" checked={autoCopy} onChange={(e) => updateSetting('faceit.matchroom.overview.connect.autoCopy.enabled', (e.target as HTMLInputElement).checked, setAutoCopy)} /><span class="slider"></span></label>
                    </SettingRow>
                    <SettingRow title={t('setAutoConnect')} description={t('setAutoConnectDesc')}>
                      <label class="faceit-toggle"><input type="checkbox" checked={autoConnect} onChange={(e) => updateSetting('faceit.matchroom.overview.connect.autoConnect.enabled', (e.target as HTMLInputElement).checked, setAutoConnect)} /><span class="slider"></span></label>
                    </SettingRow>
                    <SettingRow title={t('setAcProtocol')} description={t('setAcProtocolDesc')}>
                      <label class="faceit-toggle"><input type="checkbox" checked={acProtocol} onChange={(e) => updateSetting('faceit.matchroom.overview.connect.acProtocol.enabled', (e.target as HTMLInputElement).checked, setAcProtocol)} /><span class="slider"></span></label>
                    </SettingRow>
                    <SettingRow title={t('setConnectDelay')} description={t('setMatchDelayDesc')}>
                      <NumberInput value={connectDelay} min={0} max={120000} step={1000} onChange={(v) => updateSetting('faceit.matchroom.overview.connect.autoConnect.delay', v, setConnectDelay)} />
                    </SettingRow>
                  </>
                )}

                {activeTab === 'veto' && (
                  <>
                    <h3 class="section-title">{t('secVeto')}</h3>
                    <SettingRow title={t('setVetoDelay')} description={t('setVetoDelayDesc')}>
                      <NumberInput value={vetoDelay} min={500} max={20000} step={500} onChange={(v) => updateSetting('faceit.matchroom.veto.autoBan.delay', v, setVetoDelay)} />
                    </SettingRow>
                    <SettingRow title={t('setVetoStats')} description={t('setVetoStatsDesc')}>
                      <label class="faceit-toggle"><input type="checkbox" checked={vetoStats} onChange={(e) => updateSetting('faceit.matchroom.veto.stats.enabled', (e.target as HTMLInputElement).checked, setVetoStats)} /><span class="slider"></span></label>
                    </SettingRow>

                    <div class="divider"></div>
                    <SettingRow title={t('setMapBan')} description={t('setMapBanDesc')}>
                      <label class="faceit-toggle"><input type="checkbox" checked={mapBanEnabled} onChange={(e) => updateSetting('faceit.matchroom.veto.map.autoBan.enabled', (e.target as HTMLInputElement).checked, setMapBanEnabled)} /><span class="slider"></span></label>
                    </SettingRow>
                    {mapBanEnabled && <PriorityBuilder pool={CONSTANTS.AVAILABLE_MAPS} valueStr={mapBanList as string} onChange={(val) => updateSetting('faceit.matchroom.veto.map.autoBan.list', val, setMapBanList)} />}

                    <div class="divider"></div>
                    <SettingRow title={t('setServerBan')} description={t('setServerBanDesc')}>
                      <label class="faceit-toggle"><input type="checkbox" checked={serverBanEnabled} onChange={(e) => updateSetting('faceit.matchroom.veto.server.autoBan.enabled', (e.target as HTMLInputElement).checked, setServerBanEnabled)} /><span class="slider"></span></label>
                    </SettingRow>
                    {serverBanEnabled && <PriorityBuilder pool={CONSTANTS.AVAILABLE_SERVERS} valueStr={serverBanList as string} onChange={(val) => updateSetting('faceit.matchroom.veto.server.autoBan.list', val, setServerBanList)} />}
                  </>
                )}

                {activeTab === 'ui' && (
                  <>
                    <h3 class="section-title">{t('secInterface')}</h3>
                    <SettingRow title={t('setFocusMode')} description={t('setFocusModeDesc')}>
                      <label class="faceit-toggle"><input type="checkbox" checked={focusMode} onChange={(e) => updateSetting('faceit.matchroom.ui.focusMode.enabled', (e.target as HTMLInputElement).checked, setFocusMode)} /><span class="slider"></span></label>
                    </SettingRow>
                    <SettingRow title={t('setHideSotm')} description={t('setHideSotmDesc')}>
                      <label class="faceit-toggle"><input type="checkbox" checked={hideSOTM} onChange={(e) => updateSetting('faceit.matchroom.ui.hideSkinOfTheMatch.enabled', (e.target as HTMLInputElement).checked, setHideSOTM)} /><span class="slider"></span></label>
                    </SettingRow>
                    <SettingRow title={t('setTheaterMode')} description={t('setTheaterModeDesc')}>
                      <label class="faceit-toggle"><input type="checkbox" checked={theaterMode} onChange={(e) => updateSetting('faceit.matchroom.ui.theaterMode.enabled', (e.target as HTMLInputElement).checked, setTheaterMode)} /><span class="slider"></span></label>
                    </SettingRow>

                    <div class="divider"></div>
                    <h3 class="section-title">{t('secStats')}</h3>
                    <SettingRow title={t('setTeamElo')} description={t('setTeamEloDesc')}>
                      <label class="faceit-toggle"><input type="checkbox" checked={teamEloEnabled} onChange={(e) => updateSetting('faceit.matchroom.overview.team.elo.enabled', (e.target as HTMLInputElement).checked, setTeamEloEnabled)} /><span class="slider"></span></label>
                    </SettingRow>
                    <SettingRow title={t('setPlayerStats')} description={t('setPlayerStatsDesc')}>
                      <label class="faceit-toggle"><input type="checkbox" checked={playerStatsEnabled} onChange={(e) => updateSetting('faceit.matchroom.overview.player.stats.enabled', (e.target as HTMLInputElement).checked, setPlayerStatsEnabled)} /><span class="slider"></span></label>
                    </SettingRow>
                    <SettingRow title={t('setHoverCards')} description={t('setHoverCardsDesc')}>
                      <label class="faceit-toggle"><input type="checkbox" checked={hoverCards} onChange={(e) => updateSetting('faceit.matchroom.overview.player.hoverCards.enabled', (e.target as HTMLInputElement).checked, setHoverCards)} /><span class="slider"></span></label>
                    </SettingRow>
                    <SettingRow title={t('setEncounters')} description={t('setEncountersDesc')}>
                      <label class="faceit-toggle"><input type="checkbox" checked={encounters} onChange={(e) => updateSetting('faceit.matchroom.overview.player.encounters.enabled', (e.target as HTMLInputElement).checked, setEncounters)} /><span class="slider"></span></label>
                    </SettingRow>
                  </>
                )}

                {activeTab === 'profile' && (
                  <>
                    <h3 class="section-title">{t('secSidebar')}</h3>
                    <SettingRow title={t('setSidebarElo')} description={t('setSidebarEloDesc')}>
                      <label class="faceit-toggle"><input type="checkbox" checked={sidebarElo} onChange={(e) => updateSetting('faceit.rightSidebar.eloLevel.enabled', (e.target as HTMLInputElement).checked, setSidebarElo)} /><span class="slider"></span></label>
                    </SettingRow>
                    <SettingRow title={t('setFriendsElo')} description={t('setFriendsEloDesc')}>
                      <label class="faceit-toggle"><input type="checkbox" checked={friendsElo} onChange={(e) => updateSetting('faceit.rightSidebar.friends.eloLevel.enabled', (e.target as HTMLInputElement).checked, setFriendsElo)} /><span class="slider"></span></label>
                    </SettingRow>

                    <div class="divider"></div>
                    <h3 class="section-title">{t('secProfilePage')}</h3>
                    <SettingRow title={t('setRecent20')} description={t('setRecent20Desc')}>
                      <label class="faceit-toggle"><input type="checkbox" checked={recent20} onChange={(e) => updateSetting('faceit.playerProfile.stats.recent20.enabled', (e.target as HTMLInputElement).checked, setRecent20)} /><span class="slider"></span></label>
                    </SettingRow>
                    <SettingRow title={t('setEnhancedProfile')} description={t('setEnhancedProfileDesc')}>
                      <label class="faceit-toggle"><input type="checkbox" checked={profileElo} onChange={(e) => updateSetting('faceit.playerProfile.stats.eloLevel.enabled', (e.target as HTMLInputElement).checked, setProfileElo)} /><span class="slider"></span></label>
                    </SettingRow>
                    <SettingRow title={t('setDemoBtn')} description={t('setDemoBtnDesc')}>
                      <label class="faceit-toggle"><input type="checkbox" checked={demoDownload} onChange={(e) => updateSetting('faceit.playerProfile.stats.demoDownload.enabled', (e.target as HTMLInputElement).checked, setDemoDownload)} /><span class="slider"></span></label>
                    </SettingRow>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}