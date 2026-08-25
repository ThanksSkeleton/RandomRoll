const XCC_SHEET_MARKUP = `
  <article class="xcc-sheet">
    <div class="everything-else-column">
      <section class="logo-bio" aria-label="Crawler biography">
        <header class="xcc-logo">
          <span class="xcc-logo-name">XCrawl</span>
          <div class="xcc-divider xcc-divider--vertical xcc-divider--logo-name-subtitle" aria-hidden="true"><span class="xcc-divider-line"></span></div>
          <span class="xcc-logo-subtitle">Crawler<br />Spotlight</span>
        </header>

        <div class="xcc-divider xcc-divider--horizontal xcc-divider--logo-bio" aria-hidden="true"><span class="xcc-divider-line"></span></div>

        <div class="bio">
          <div class="bio-row">
            <span class="bio-label">Name</span>
            <span class="bio-value">
              <span data-field="firstName">Alice</span>
              <span data-field="lastName">Cooper</span>
            </span>
          </div>
          <div class="bio-row">
            <span class="bio-label">Occupation</span>
            <span class="bio-value" data-field="professionTitle">Bootblack</span>
          </div>
          <div class="bio-row">
            <span class="bio-label">Olympian Boon</span>
            <span class="bio-value" data-field="luckySignName">Guided by Hera</span>
          </div>
        </div>
      </section>

      <div class="xcc-divider xcc-divider--horizontal xcc-divider--bio-stats" aria-hidden="true"><span class="xcc-divider-line"></span></div>

      <div class="xcc-sheet-row stats-row">
        <section class="base-stats" aria-label="Base statistics">
          <div class="stat-line"><span>STR</span><span data-field="strengthScore">13</span><span data-field="strengthMod">+1</span></div>
          <div class="stat-line"><span>AGI</span><span data-field="agilityScore">14</span><span data-field="agilityMod">+1</span></div>
          <div class="stat-line"><span>STA</span><span data-field="staminaScore">13</span><span data-field="staminaMod">+1</span></div>
          <div class="stat-line"><span>PER</span><span data-field="personalityScore">8</span><span data-field="personalityMod">0</span></div>
          <div class="stat-line"><span>INT</span><span data-field="intelligenceScore">7</span><span data-field="intelligenceMod">-1</span></div>
          <div class="stat-line"><span>LCK</span><span data-field="luckScore">14</span><span data-field="luckMod">+1</span></div>
          <div class="stat-line wide-value"><span>BIAS</span><span data-field="alignment">Chaotic</span></div>
        </section>

        <div class="xcc-divider xcc-divider--vertical xcc-divider--stats-columns" aria-hidden="true"><span class="xcc-divider-line"></span></div>

        <section class="secondary-stats" aria-label="Secondary statistics">
          <div class="stat-line"><span>FORT</span><span data-field="fortitudeSave">+1</span></div>
          <div class="stat-line"><span>REF</span><span data-field="reflexSave">+1</span></div>
          <div class="stat-line"><span>WILL</span><span data-field="willSave">0</span></div>
          <div class="stat-line"><span>HP</span><span data-field="hitPoints">1</span></div>
          <div class="stat-line"><span>AC</span><span data-field="armorClass">11</span></div>
          <div class="stat-line"><span>INIT</span><span data-field="initiative">+1</span></div>
          <div class="stat-line"><span>SPEED</span><span data-field="speed">30</span></div>
        </section>
      </div>

      <div class="xcc-divider xcc-divider--horizontal xcc-divider--stats-weapon-armor" aria-hidden="true"><span class="xcc-divider-line"></span></div>

      <section class="weapon-armor-section" aria-label="Weapon and armor statistics">
        <div class="weapon-armor-row">
          <div class="weapon-armor-pair">
            <span class="weapon-label">Weapon</span>
            <span class="weapon-armor-value" data-field="weaponDisplay">Dagger</span>
          </div>
          <div class="weapon-armor-pair">
            <span class="weapon-label">ATK</span>
            <span class="weapon-armor-value" data-field="attackBonus">+1</span>
          </div>
          <div class="weapon-armor-pair">
            <span class="weapon-label">DMG</span>
            <span class="weapon-armor-value" data-field="weaponDamage">1d4+1</span>
          </div>
        </div>
        <div class="weapon-armor-row">
          <div class="weapon-armor-pair">
            <span class="weapon-label" data-field="weaponRangeLabel">Range</span>
            <span class="weapon-armor-value" data-field="weaponRange">10/20/30</span>
          </div>
          <div class="weapon-armor-pair weapon-armor-pair--right">
            <span class="weapon-label">GEAR</span>
            <span class="weapon-armor-value" data-field="pack">Pack A</span>
          </div>
        </div>
        <div class="weapon-armor-row">
          <div class="weapon-armor-pair">
            <span class="weapon-label">Armor</span>
            <span class="weapon-armor-value" data-field="armorName">Armored Jacket</span>
          </div>
        </div>
      </section>
    </div>

    <div class="portrait-column" aria-label="Crawler portrait">
      <div class="portrait-frame">
        <div class="portrait-image" data-field="portrait" role="img"></div>
      </div>
      <div class="identity-stripe" data-field="identityStripe" hidden>
        <span data-field="identityStripeLabel">Elf</span>
      </div>
    </div>
  </article>
`;

export function createXccSheetElement(): HTMLElement {
  const template = document.createElement("template");
  template.innerHTML = XCC_SHEET_MARKUP.trim();
  const sheet = template.content.firstElementChild;

  if (!(sheet instanceof HTMLElement) || !sheet.classList.contains("xcc-sheet")) {
    throw new Error("Shared XCC sheet markup must have an .xcc-sheet root.");
  }

  return sheet;
}
