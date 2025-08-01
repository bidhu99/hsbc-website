import { getMetadata } from "../../scripts/aem.js";

export default function decorate(block) {
  const cardsData = parseArticleCardsToJson(".articlecards-wrapper");
  const wrapper = document.createElement("div");
  wrapper.className = "row";
  wrapper.setAttribute("role", "region");

  wrapper.innerHTML = `
  <div class = "sm-12 O-SMARTSPCGEN-DEV O-MASTERCARD-RW-DEV">
    <div id="hp_main_masterCard_1" class="crh-master-card">
      <div class="crh-master-card__grid">
        <div role="list" class="crh-master-cards crh-master-cards__size-3" data-cards-size="3"></div>
      </div>
    </div>
    </div>
  `;

  const cardList = wrapper.querySelector(".crh-master-cards");

  cardsData.forEach((card, index) => {
    const cardId = index + 1;
    const firstSection = card.sections[0];
    const additionalSections = card.sections.slice(1);

    const cardItem = document.createElement("div");
    cardItem.className = `M-MASTERCARD crh-card crh-master-cards__card crh-master-cards__margin-2${
      index === 0 ? " crh-master-cards__first-card--size-3" : ""
    }`;
    cardItem.setAttribute("role", "listitem");

    cardItem.innerHTML = `
      <div id="hp_main_card_${cardId}" class="crh-parsys">
        <div class="image-class">
          <div id="hp_main_image_${cardId * 3 - 2}" class="smart-image">
            <figure class="smart-image-figure">
              <picture id="hp_main_image_${cardId * 3 - 1}">
                <source srcset="${card.image}" media="(min-width: 960px)" />
                <source srcset="${card.image}" media="(min-width: 480px)" />
                <img id="hp_main_image_${
                  cardId * 3
                }" class="A-IMAGE-RW-ALL smart-image-img" role="img" src="${
      card.image
    }" alt="" />
              </picture>
            </figure>
          </div>
        </div>

        <div id="hp_main_title_${cardId}" class="crh-master-card__header">
          <h2 id="hp_main_link_${
            cardId + 8
          }" class="link-container link-header">
            <a class="A-LNKC16R-RW-ALL A-TYPS3R-RW-DEV master-card-chevron-link-title" href="${
              firstSection.link
            }" target="_self">
              <span class="link text">${
                firstSection.title
              }</span>&nbsp;<span class="icon icon-chevron-right-small" aria-hidden="true"></span>
            </a>
          </h2>
        </div>

        ${
          firstSection.description
            ? `
        <div class="master-card__text">
          <div id="hp_main_text_${cardId}">
            <div class="crh-text A-TYPS5R-RW-DEV text-container text">
              ${firstSection.description}
            </div>
          </div>
        </div>`
            : ""
        }
      `;

    additionalSections.forEach((section, i) => {
      const linkId = 10 + cardId * 3 + i;
      const wrapper = document.createElement("div");
      wrapper.className = "master-card__link-wrapper";
      wrapper.innerHTML = `
        <div id="hp_main_link_${linkId}" class="link-container">
          <a class="A-LNKC16R-RW-ALL A-TYPS5R-RW-DEV master-card-chevron-link" href="${section.link}" target="_self">
            <span class="link text">${section.title}</span>&nbsp;<span class="icon icon-chevron-right-small" aria-hidden="true"></span>
          </a>
        </div>
      `;
      cardItem.querySelector(".crh-parsys").appendChild(wrapper);
    });

    cardItem.innerHTML += `</div>`;
    cardList.appendChild(cardItem);
  });

  const mainTag = document.querySelector("main");
  if (mainTag) {
    mainTag.appendChild(wrapper);
  } else {
    console.warn("<main> tag not found.");
  }
}

function parseArticleCardsToJson(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return [];

  const cards = container.querySelectorAll(".articlecards > div");
  const result = [];

  cards.forEach((card) => {
    const image = card.querySelector("img")?.getAttribute("src") || "";
    const paragraphs = Array.from(card.querySelectorAll("p")).map((p) =>
      p.textContent.trim()
    );

    const sections = [];

    // The first 3 paragraphs are: main title, main link, main description
    if (paragraphs.length >= 3) {
      sections.push({
        title: paragraphs[0],
        link: paragraphs[1],
        description: paragraphs[2],
      });
    }

    // Then every 2 paragraphs = [title, link]
    for (let i = 3; i < paragraphs.length; i += 2) {
      const title = paragraphs[i] || "";
      const link = paragraphs[i + 1] || "";

      if (title && link) {
        sections.push({ title, link });
      }
    }

    result.push({ image, sections });
  });

  return result;
}
