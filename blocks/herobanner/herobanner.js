import { getMetadata } from '../../scripts/aem.js';

export default function decorate(block) {
  const heroData = parseHeroBanner();
  renderHeroBanner(heroData);
}

function parseHeroBanner() {
  const wrapper = document.querySelector('.herobanner-wrapper');
  if (!wrapper) return null;

  const img = wrapper.querySelector('img')?.getAttribute('src') || '';
  const h2 = wrapper.querySelector('h2')?.textContent.trim() || '';
  const paras = wrapper.querySelectorAll('p');
  const paragraphs = Array.from(paras).map(p => p.textContent.trim());

  const primary = {
    title: h2,
    description: paragraphs[2] || '',
    ctaText: paragraphs[4]?.replace(/`/g, '') || '',
    ctaLink: paragraphs[5] || '',
    secondaryDescription: paragraphs[6] || '',
    image: img
  };

  const cards = [];

  // Card 1 - Going abroad
  if (paragraphs[7]) {
    cards.push({
      title: paragraphs[7],
      description: paragraphs[8] || '',
      linkText: paragraphs[9] || '',
      linkHref: wrapper.querySelectorAll('a')[0]?.getAttribute('href') || ''
    });
  }

  // Card 2 - Wealth Insights
  if (paragraphs[10]) {
    cards.push({
      title: paragraphs[10],
      description: paragraphs[11] || '',
      linkText: paragraphs[12] || '',
      linkHref: wrapper.querySelectorAll('a')[1]?.getAttribute('href') || ''
    });
  }

  return {
    image: primary.image,
    mainTitle: primary.title,
    mainDescription: primary.description,
    ctaText: primary.ctaText,
    ctaLink: primary.ctaLink,
    secondaryDescription: primary.secondaryDescription,
    cards: cards
  };
}

function renderHeroBanner(json) {
  if (!json) return;

  const container = document.querySelector('.multilinks-container');
  if (!container) return;

  const heroHTML = `
  <div class="row transparent-bg intro-section hero-remove-height">
    <div class="">
      <div class="O-HERO-RW-DEV">
        <div class="crh-grid grid O-SMARTSPCGENGRID">
          <div class="crh-hero-banner" et-event-counter="2">
            <div class="crh-hero-banner__main-wrapper">
              <div>
                <div class="O-HEROCARD-RW-RBWM">
                  <h2 class="crh-hero-banner__main-header A-TYPS1R-RW-DEV text-container text">
                    ${json.mainTitle}
                  </h2>
                  <div id="par_hero_description_1">
                    <div class="crh-hero-banner__main-lead A-TYPS5R-RW-DEV text-container text" et-event-counter="1">
                      ${json.mainDescription}
                    </div>
                  </div>
                  <div class="crh-hero-banner__main-buttons-wrapper">
                    <div>
                      <a class="crh-button crh-link-button crh-button-primary crh-hero-banner__main-button"
                        href="${json.ctaLink}" target="_blank" rel="noopener"
                        data-event-name="${json.ctaText}">
                        <span aria-hidden="true">${json.ctaText}</span>
                        <span class="visuallyhidden">${json.ctaText} This link will open in a new window</span>
                      </a>
                    </div>
                  </div>
                  <div id="par_hero_second_description_1" class="hero-main-second-lead">
                    <div class="crh-hero-banner__main-second-lead A-TYPS6L-RW-DEV text-container text">
                      ${json.secondaryDescription}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="crh-hero-banner__main-image-wrapper">
              <div class="M-IMG-RW-DEV">
                <div class="smart-image">
                  <figure class="smart-image-figure">
                    <img class="A-IMAGE-RW-ALL smart-image-img" role="img" src="${json.image}" alt="Hero Image" />
                  </figure>
                </div>
              </div>
            </div>
            <div class="crh-hero-banner__cards-wrapper">
              ${json.cards.map((card, i) => `
                <div class="crh-card-with-link crh-hero-banner__card ${i === 0 ? 'crh-hero-banner__first-card' : ''}">
                  <div class="crh-card-with-link__wrapper">
                    <h2 class="crh-card-with-link__header A-TYPS3R-RW-DEV text-container text">${card.title}</h2>
                    <div class="crh-card-with-link__content A-TYPS5R-RW-DEV text-container text">
                      ${card.description}
                    </div>
                    <div class="link-container">
                      <a class="crh-link crh-chevron-link A-TYPS5M-RW-DEV" href="${card.linkHref}" target="_self">
                        <span class="link text">
                          <span class="crh-chevron-link__text crh-chevron-link__text--forward">${card.linkText}</span>
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;

  container.insertAdjacentHTML('afterend', heroHTML);
}