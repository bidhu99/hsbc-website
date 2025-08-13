import { getMetadata } from "../../scripts/aem.js";

export default function decorate(block) {
  const jsonData = tilesToJSON(block);
  const container = document.querySelectorAll("main .with-bg > .sm-12")[1];
  const wrapper = createMastercardHTML(jsonData);
  container.appendChild(wrapper);
}

function tilesToJSON(tilesEl) {
  const sections = tilesEl.querySelectorAll(':scope > div'); // top-level div children
  const json = {
    title: "",
    cards: []
  };

  // First section is the main title
  const firstHeading = sections[0]?.querySelector('h2');
  if (firstHeading) {
    json.title = firstHeading.textContent.trim();
  }

  // Remaining sections are cards
  for (let i = 1; i < sections.length; i++) {
    const cardEl = sections[i];
    const titleEl = cardEl.querySelector('h3');
    const linkEl = cardEl.querySelector('a');
    const descriptionEls = cardEl.querySelectorAll('h1');

    const card = {
      title: titleEl ? titleEl.textContent.trim() : "",
      link: linkEl ? linkEl.getAttribute('href') : "",
      descriptions: []
    };

    descriptionEls.forEach(desc => {
      const text = desc.textContent.trim();
      if (text) card.descriptions.push(text);
    });

    json.cards.push(card);
  }

  return json;
}

function createMastercardHTML(data) {
  const container = document.createElement("div");
  container.className = "O-SMARTSPCGEN-DEV O-MASTERCARD-RW-DEV";
  container.setAttribute("role", "region");

  container.innerHTML = `
    <div class="crh-master-card crh-master-card__browser-wide crh-master-card__light-pearl">
      <div class="crh-master-card__grid crh-master-card__browser-wide crh-master-card__light-pearl">
        <div class="crh-master-card__header-container">
          <div class="crh-master-card__header-wrapper">
            <h2 class="crh-master-card__header A-TYPS2R-RW-DEV text-container text">
              ${data.title}
            </h2>
          </div>
        </div>
        <div role="list" class="crh-master-cards crh-master-cards__size-${data.cards.length}-alternative" data-cards-size="${data.cards.length}">
          ${data.cards.map((card, index) => `
            <div class="M-MASTERCARD crh-card crh-master-cards__card ${index === 0 ? 'crh-master-cards__first-card' : index === 1 ? 'crh-master-cards__margin-2' : ''}" role="listitem">
              <div class="crh-parsys">
                <div class="crh-master-card__header">
                  <h3 class="link-container link-header">
                    <a class="A-LNKC16R-RW-ALL A-TYPS3R-RW-DEV master-card-chevron-link-title"
                       href="${card.link}"
                       target="_self">
                      <span class="link text">${card.title}</span>
                      &nbsp;<span class="icon icon-chevron-right-small" aria-hidden="true"></span>
                    </a>
                  </h3>
                </div>
                ${card.descriptions.map(desc => `
                  <div class="master-card__text">
                    <div class="crh-text A-TYPS5R-RW-DEV text-container text">${desc}</div>
                  </div>
                `).join("")}
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;
  return container;
}