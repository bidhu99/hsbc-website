import { getMetadata } from "../../scripts/aem.js";

export default function decorate(block) {
  const blocks = document.querySelectorAll(".aboutus.block > div");
  const headings = Array.from(blocks[0].querySelectorAll("p")).map((p) =>
    p.textContent.trim()
  );
  const contentBlocks = Array.from(blocks).slice(1);

  const data = headings.map((heading, index) => {
    const items = [];
    // Collect <p> elements in pairs (title, link) for this column
    for (let i = 0; i < contentBlocks.length; i++) {
      const ps = Array.from(contentBlocks[i].querySelectorAll("p"));
      for (let j = 0; j < ps.length - 1; j += 2) {
        const title = ps[j].textContent.trim();
        const link = ps[j + 1].textContent.trim();
        // Only include if it belongs to this heading block
        const headingIndex = headings.findIndex((h) => h === heading);
        if (i % headings.length === headingIndex) {
          items.push({ title, link });
        }
      }
    }
    return { heading, items };
  });

  //const jsonData = JSON.stringify(data, null, 2);
  createMasterCards(data);
}

function createMasterCards(data) {
  const containerGrid = document.createElement("div");
  containerGrid.className = "grid";

  const container = document.createElement("div");
  container.className = "O-SMARTSPCGEN-DEV O-MASTERCARD-RW-DEV";
  container.setAttribute("role", "region");

  containerGrid.appendChild(container);

  const masterCard = document.createElement("div");
  masterCard.id = "hp_main_masterCard_2";
  masterCard.className = "crh-master-card";

  const grid = document.createElement("div");
  grid.className =
    "crh-master-card__grid crh-master-card__grid-off crh-master-card__light-pearl";

  const list = document.createElement("div");
  list.className = "crh-master-cards crh-master-cards__size-3-alternative";
  list.setAttribute("role", "list");
  list.dataset.cardsSize = "3";

  data.forEach((section, index) => {
    const card = document.createElement("div");
    card.className = `M-MASTERCARD crh-card crh-master-cards__card crh-master-cards__card--hide-frame${
      index === 0
        ? " crh-master-cards__first-card"
        : index === 1
        ? " crh-master-cards__margin-2"
        : ""
    }`;
    card.setAttribute("role", "listitem");

    const cardWrapper = document.createElement("div");
    cardWrapper.className = "crh-parsys";

    const header = document.createElement("div");
    header.className = "crh-master-card__header";
    header.innerHTML = `<h2 class="crh-text A-TYPS3R-RW-DEV text-container text">${section.heading}</h2>`;

    cardWrapper.appendChild(header);

    section.items.forEach((item, idx) => {
      const wrapper = document.createElement("div");
      wrapper.className = "master-card__link-wrapper";

      const linkContainer = document.createElement("div");
      linkContainer.className = "link-container";

      const anchor = document.createElement("a");
      anchor.className =
        "A-LNKC16R-RW-ALL A-TYPS5R-RW-DEV master-card-chevron-link";
      anchor.href = item.link;
      anchor.target = "_self";
      anchor.setAttribute("data-event-component", "text link");
      anchor.setAttribute(
        "data-event-name",
        `${item.title.toLowerCase()}|component:${section.heading.toLowerCase()}|position:${
          index + 1
        }`
      );

      anchor.innerHTML = `<span class="link text">${item.title}</span>&nbsp;<span class="icon icon-chevron-right-small" aria-hidden="true"></span>`;

      linkContainer.appendChild(anchor);
      wrapper.appendChild(linkContainer);
      cardWrapper.appendChild(wrapper);
    });

    card.appendChild(cardWrapper);
    list.appendChild(card);
  });

  grid.appendChild(list);
  masterCard.appendChild(grid);
  container.appendChild(masterCard);

  const mainTag = document.querySelector("main");
  if (mainTag) {
    mainTag.appendChild(containerGrid);
  } else {
    console.warn("<main> tag not found.");
  }
}
