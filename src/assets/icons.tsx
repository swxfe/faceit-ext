// src/assets/icons.tsx

export const Icons = {
  Settings: () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M12 8a4 4 0 100 8 4 4 0 000-8zm-2 4a2 2 0 114 0 2 2 0 01-4 0z" fill="currentColor"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.28.9l-1.3-.75c-1.36-.79-2.96.81-2.17 2.17l.75 1.3c.38.65.1 1.48-.56 1.83A1.53 1.53 0 011.5 10.5H0v3h1.5c.67 0 1.28.43 1.54 1.05.27.63-.03 1.36-.6 1.7l-.75 1.3c-.79 1.36.81 2.96 2.17 2.17l1.3-.75a1.533 1.533 0 012.28.9c.38 1.56 2.6 1.56 2.98 0a1.532 1.532 0 012.28-.9l1.3.75c1.36.79 2.96-.81 2.17-2.17l-.75-1.3a1.533 1.533 0 01.56-1.83 1.53 1.53 0 011.45-.12l1.3.75c1.36-.79.81-2.96-.55-2.17l-1.3-.75a1.532 1.532 0 01-.56-1.83c.27-.63.88-1.06 1.55-1.06h1.5v-3h-1.5a1.53 1.53 0 01-1.44-.12 1.533 1.533 0 01-.56-1.83l.75-1.3c.79-1.36-.81-2.96-2.17-2.17l-1.3.75a1.532 1.532 0 01-2.28-.9z" fill="currentColor"/>
    </svg>
  ),
  Close: () => (
    <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  )
};

export const RawIcons = {
  DemoDownload: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
  // НОВОЕ: Иконка внешней ссылки (Новая вкладка)
  ExternalLink: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`
};

export const FaceitAssets = {
  getLevelIcon: (level: number) => {
    const safeLevel = Math.max(1, Math.min(10, level));
    return `https://cdn-frontend.faceit-cdn.net/web/static/media/assets_images_skill-icons_skill_level_${safeLevel}_svg.svg`;
  }
};