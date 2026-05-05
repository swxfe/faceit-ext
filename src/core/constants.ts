export const CONSTANTS = {
  AVAILABLE_MAPS: ["Mirage", "Dust2", "Inferno", "Nuke", "Ancient", "Anubis", "Overpass", "Cache"],
  AVAILABLE_SERVERS: ["Germany", "UK", "Netherlands", "Sweden", "Moscow", "Kazakhstan", "Yekatirenburg", "Novosibirsk", "Vladivostok", "Finland"],
  
  MATCH_READY_REGEX: new RegExp(
    ["Match ready", "경기 준비", "Rozgrywka gotowa", "المباراة جاهزة", "Zápas připraven", "Match bereit", "Partida lista", "Ottelu valmis", "Match prêt", "Meč je spreman", "A mérkőzés készen áll", "Perlawanan sedia", "試合を行えます", "Натпреварот е подготвен", "Partida pronta", "Jogo preparado", "Матч готов", "Match redo", "การแข่งขันพร้อมแล้ว", "Maç hazır", "比赛已就绪"].join("|"),
    "i"
  ),
  
  PARTY_INVITE_REGEX: new RegExp(
    ["Click accept to join the party", "انقر فوق قبول للانضمام إلى المجموعة", "Kliknutím na tlačítko Přijmout se připojíte ke straně", "Klicke auf Akzeptieren, um beizutreten", "Haz clic en «Aceptar» para unirte al grupo", "Klikkaa hyväksy liittyäksesi ryhmään", "Clique pour accepter de rejoindre le groupe", "Klikni na „Prihvati” za pridruživanje grupi", "Kattints az elfogadás gombra a csatlakozáshoz", "Klik terima untuk gabung ke kelompok", "グループに加入するには承認をクリックしてください", "집단에 참가하려면 수락을 클릭하세요", "Кликни на „Прифати“ за да се приклучиш на групата", "Kliknij „Zaakceptuj”, aby dołączyć do ekipy", "Clique em aceitar para entrar no grupo", "Clica em aceitar para te juntares ao grupo", "Нажмите «Принять», чтобы присоединиться к группе", "Klicka acceptera для att gå med i gruppen", "คลิกยอมรับเพื่อเข้าร่วมปาร์ตี้", "Gruba katılmak için kabul et'e tıkla", "点击接受加入派全"].join("|"),
    "i"
  ),

  // НОВОЕ: Границы ELO для CS2 (Спизжено из Repeek Блок #41)
  CS2_ELO_LEVELS: [
    { level: 1, min: 1, max: 500 },
    { level: 2, min: 501, max: 750 },
    { level: 3, min: 751, max: 900 },
    { level: 4, min: 901, max: 1050 },
    { level: 5, min: 1051, max: 1200 },
    { level: 6, min: 1201, max: 1350 },
    { level: 7, min: 1351, max: 1530 },
    { level: 8, min: 1531, max: 1750 },
    { level: 9, min: 1751, max: 2000 },
    { level: 10, min: 2001, max: Infinity }
  ],

  // Конвертер кода страны (ru, de, us) в Emoji флаг
  getCountryEmoji: (countryCode: string) => {
    if (!countryCode) return '';
    return countryCode
      .toUpperCase()
      .replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397));
  }
};