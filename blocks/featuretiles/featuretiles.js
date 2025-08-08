import { getMetadata } from "../../scripts/aem.js";
import { decorateMain } from "../../scripts/scripts.js";

export default function decorate(block) {
    const data = getFeatureTilesJSON();
    buildMasterCardHTML(data);
}

function getFeatureTilesJSON() {
  const container = document.querySelector(".featuretiles.block");
  if (!container) return null;

  const json = {
    heading: container.querySelector("h2")?.textContent.trim() || "",
    subheading: container.querySelector("code")?.textContent.trim() || "",
    features: []
  };

  // Each feature is the group of divs after the intro blocks
  const featureBlocks = Array.from(container.children).slice(2); // skip heading + subheading
  featureBlocks.forEach(block => {
    const title = block.querySelector("p strong")?.textContent.trim() || "";
    const img = block.querySelector("img")?.getAttribute("src") || "";
    const descriptionEl = block.querySelectorAll("p strong")[1] || block.querySelectorAll("p")[1];
    const description = descriptionEl ? descriptionEl.textContent.trim() : "";

    json.features.push({
      title,
      image: img,
      description
    });
  });

  return json;
}


function buildMasterCardHTML(data) {
  const mainWrapper = document.querySelectorAll("main .with-bg > .sm-12")[1];
  const container = document.createElement("div");
  container.className = "O-SMARTSPCGEN-DEV O-MASTERCARD-RW-DEV";
  container.setAttribute("role", "region");

  container.innerHTML = `
    <div id="pp_tools_masterCard_1" class="crh-master-card">
      <div class="crh-master-card__grid">
        <div class="crh-master-card__header-container">
          <div class="crh-master-card__header-wrapper">
            <div id="pp_tools_title_1">
              <h2 class="crh-master-card__header A-TYPS2R-RW-DEV text-container text">
                ${data.heading}
              </h2>
            </div>
            <div id="pp_tools_description_1">
              <div class="crh-master-card__lead A-TYPS5L-RW-DEV text-container text">
                ${data.subheading}
              </div>
            </div>
          </div>
        </div>
        <div role="list" class="crh-master-cards crh-master-cards__size-${data.features.length}" data-cards-size="${data.features.length}">
          ${data.features
            .map(
              (card, index) => `
            <div class="M-MASTERCARD crh-card crh-master-cards__card crh-master-cards__card--hide-frame ${index === 2 ? "crh-master-cards__third-card-margin" : ""}" role="listitem">
              <div id="pp_tools_card_${index + 1}" class="crh-parsys">
                <div class="image-class">
                  <div id="pp_tools_image_${index + 1}" class="smart-image">
                    <figure class="smart-image-figure">
                      <picture id="pp_tools_image_${index + 2}">
                        <source srcset="${card.image} 1x" media="(min-width: 960px)" />
                        <source srcset="${card.image} 1x" media="(min-width: 480px)" />
                        <source srcset="${card.image}/jcr:content/renditions/cq5dam.web.490.1000.jpeg 1x" />
                        <img id="pp_tools_image_${index + 3}" class="A-IMAGE-RW-ALL smart-image-img" role="img" src="${card.image}" alt="" />
                      </picture>
                    </figure>
                  </div>
                </div>
                <div id="pp_tools_title_${index + 2}" class="crh-master-card__header">
                  <h3 class="crh-text A-TYPS3R-RW-DEV text-container text">
                    ${card.title}
                  </h3>
                </div>
                <div class="master-card__text">
                  <div id="pp_tools_text_${index + 1}">
                    <div class="crh-text A-TYPS5R-RW-DEV text-container text">
                      ${card.description}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    </div>
  `;

  mainWrapper.appendChild(container);
  return container;
}
