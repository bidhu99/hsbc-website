import {
    getMetadata
} from '../../scripts/aem.js';

export default function decorate(block) {
    if (block.classList.contains("right")) {
        const surveyJson = extractSurveyData();
        appendToMain(surveyJson);
        appendImageItem(surveyJson);
    }
    if (block.classList.contains("below")) {
        // Step 1: Extract relevant data and filter valid entries
        const imageTextBlocks = block.querySelectorAll('.imagewithtext-wrapper .imagewithtext > div');

        const filteredAppFraudData = [];

        imageTextBlocks.forEach(individualBlock => {
            const img = individualBlock.querySelector('img')?.getAttribute('src') || '';
            const paragraphs = individualBlock.querySelectorAll('p');
            const heading = paragraphs[0]?.textContent.trim() || '';
            const description = paragraphs[1]?.textContent.trim() || '';
            const link = individualBlock.querySelector('a')?.getAttribute('href') || '';

            // Only add items that have a valid image, heading, description, and link
            if (img && heading && description && link) {
                filteredAppFraudData.push({
                    image: img,
                    heading: heading,
                    description: description,
                    link: link
                });
            }
        });

        const main = document.querySelector('main');
        if (main) {
            const generatedHtml = createHtmlFromData(filteredAppFraudData);
            main.appendChild(generatedHtml);
        }
    }
    if (block.classList.contains("single")) {
      imageWithTextSingle();
    }
}

function createSurveyHTML(surveyData) {
    const wrapper = document.createElement("div");
    wrapper.className = "grid";

    // Build inner HTML structure
    wrapper.innerHTML = `
  <div class="cc-wrapper O-COLCTRL-RW-DEV" role="region">
    <div id="hp_main_columnControl_2">
      <div class="cc cc-columns-66-33">
        <div id="hp_main_columnControlColumn_5" class="cc-column">
          <div class="M-CONTMAST-RW-RBWM O-SMARTSPCGEN-DEV" role="region">
            <div class="anchor" id="independent-service-quality-survey-results"></div>
            <h2 class="heading A-TYP28L-RW-ALL remove-bottom-space" id="hp_main_heading_1">
              ${surveyData.mainTitle}
            </h2>
          </div>
          <div class="M-CONTMAST-RW-RBWM O-SMARTSPCGEN-DEV" role="region">
            <h3 class="heading A-TYP22L-RW-ALL" id="hp_main_heading_2">
              ${surveyData.subTitle}
            </h3>
          </div>
        </div>
        <div id="hp_main_columnControlColumn_6" class="cc-column"></div>
      </div>
    </div>
    </div>
  `;

    return wrapper;
}

// Append generated HTML inside a <main> element
function appendToMain(data) {
    let main = document.querySelector('main');
    if (!main) {
        main = document.createElement('main');
        document.body.appendChild(main);
    }
    const newSurveyContent = createSurveyHTML(data);
    main.appendChild(newSurveyContent);
}

function appendImageItem(surveyData) {
    let main = document.querySelector('main');
    if (!main) {
        main = document.createElement('main');
        document.body.appendChild(main);
    }
    surveyData.sections.forEach((section, index) => {
        const sectionWrapper = document.createElement("div");
        sectionWrapper.className = "grid";

        const sectionId = index === 0 ? "gb" : "ni";
        const anchorId = section.region.toLowerCase().replace(/\s+/g, "-");

        sectionWrapper.innerHTML = `
      <div class="cc-wrapper O-COLCTRL-RW-DEV" role="region">
        <div id="hp_main_columnControl_${index + 3}">
          <div class="cc cc-columns-50-50 cc-mobile-reflow">
            <div id="hp_main_columnControlColumn_${index * 2 + 7}" class="cc-column">
              <div class="M-IMG-RW-DEV O-SMARTSPCGEN-DEV" role="region">
                <div id="hp_main_image_${index + 10}" class="smart-image">
                  <figure class="smart-image-figure">
                    <picture id="hp_main_image_${index + 11}">
                      <img
                        id="hp_main_image_${index + 12}"
                        class="A-IMAGE-RW-ALL smart-image-img"
                        role="img"
                        src="${section.image.src}"
                        width="${section.image.width}"
                        height="${section.image.height}"
                        alt="${section.image.alt}"
                      />
                    </picture>
                  </figure>
                </div>
              </div>
            </div>

            <div id="hp_main_columnControlColumn_${index * 2 + 8}" class="cc-column">
              <div class="M-CONTMAST-RW-RBWM O-SMARTSPCGEN-DEV" role="region">
                <div class="anchor" id="${anchorId}"></div>
                <h4 class="heading A-TYP22L-RW-ALL remove-bottom-space">
                  ${section.region}
                </h4>
              </div>

              <div class="M-CONTMAST-RW-RBWM O-SMARTSPCGEN-DEV rich-text" role="region">
                <div class="remove-bottom-space A-PAR16R-RW-ALL-WRAPPER">
                  <p class="A-PAR16R-RW-ALL">
                    ${section.surveyDetails.description}
                  </p>
                  <p class="A-PAR16R-RW-ALL">${section.surveyDetails.published}</p>
                </div>
              </div>

              <div class="O-SMARTSPCGEN-DEV M-CONTMAST-RW-RBWM links" role="region">
                <ul class="links-list">
                  <li>
                    <div class="link-container">
                      <a class="A-LNKST-RW-ALL" href="${section.link.url}" target="_self">
                        <span class="link">${section.link.text}</span>
                        <span class="icon icon-chevron-right" aria-hidden="true"></span>
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        </div>
      `;

        main.appendChild(sectionWrapper);
    });
}

function extractSurveyData() {
    const wrapper = document.querySelector('.imagewithtext-wrapper');
    const blocks = wrapper.querySelectorAll('.imagewithtext > div');

    const mainTitle = blocks[0].querySelector('p')?.textContent.trim() || '';
    const subTitle = blocks[1].querySelector('p')?.textContent.trim() || '';

    const sections = [];

    // Remaining blocks contain each section
    for (let i = 2; i < blocks.length; i++) {
        const sectionBlock = blocks[i];
        const picture = sectionBlock.querySelector('img');
        const paragraphs = sectionBlock.querySelectorAll('p');

        const region = paragraphs[0]?.textContent.trim();
        const descriptionHTML = paragraphs[1]?.innerHTML || '';
        const description = paragraphs[1]?.textContent.trim();
        const published = paragraphs[2]?.textContent.trim();
        const linkText = paragraphs[3]?.textContent.trim();
        const linkHref = paragraphs[4]?.textContent.trim();

        // Extract sample size and provider count from description using regex
        const sampleMatch = descriptionHTML.match(/<strong>(\d+,?\d*)<\/strong>/);
        const providerMatch = descriptionHTML.match(/<strong>(.*?)<\/strong>/g);
        const sampleSize = sampleMatch ? sampleMatch[1].replace(',', '') : '';
        const providers = providerMatch && providerMatch[1] ?
            providerMatch[1].replace(/<strong>|<\/strong>/g, '') :
            '';

        sections.push({
            region,
            image: {
                src: picture.getAttribute('src'),
                width: parseInt(picture.getAttribute('width'), 10),
                height: parseInt(picture.getAttribute('height'), 10),
                alt: picture.getAttribute('alt') || ''
            },
            surveyDetails: {
                sampleSize,
                providers,
                description,
                published
            },
            link: {
                text: linkText,
                url: linkHref
            }
        });
    }

    return {
        mainTitle,
        subTitle,
        sections
    };
}

function createHtmlFromData(data) {
    const wrapper = document.createElement('div');
    wrapper.className = 'cc-wrapper O-COLCTRL-RW-DEV';
    wrapper.setAttribute('role', 'region');

    const columnControl = document.createElement('div');
    columnControl.className = 'cc cc-columns-50-50 cc-mobile-reflow';

    data.forEach((item, index) => {
        const column = document.createElement('div');
        column.className = 'cc-column';

        column.innerHTML = `
      <div class="M-IMG-RW-DEV O-SMARTSPCGEN-DEV" role="region">
        <div class="smart-image">
          <figure class="smart-image-figure">
            <picture>
              <img class="A-IMAGE-RW-ALL smart-image-img" src="${item.image}" alt="${item.heading}" width="550" height="350" />
            </picture>
          </figure>
        </div>
      </div>

      <div class="M-CONTMAST-RW-RBWM O-SMARTSPCGEN-DEV" role="region">
        <h3 class="heading A-TYP22L-RW-ALL remove-bottom-space">${item.heading}</h3>
      </div>

      <div class="M-CONTMAST-RW-RBWM O-SMARTSPCGEN-DEV rich-text" role="region">
        <div class="A-PAR16R-RW-ALL-WRAPPER">
          <p class="A-PAR16R-RW-ALL">${item.description}</p>
        </div>
      </div>

      <div class="O-SMARTSPCGEN-DEV M-CONTMAST-RW-RBWM links" role="region">
        <div>
          <ul class="links-list">
            <li>
              <div class="link-container">
                <a class="A-LNKST-RW-ALL" href="${item.link}" target="_blank" rel="noopener" data-event-component="text link" data-event-name="See full results">
                  <span aria-hidden="true" class="link">See full results</span>
                  <span class="icon icon-chevron-right" aria-hidden="true"></span>
                  <span class="visuallyhidden">See full results. This link will open in a new window</span>
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    `;

        columnControl.appendChild(column);
    });

    const columnControlWrapper = document.createElement('div');
    columnControlWrapper.appendChild(columnControl);
    wrapper.appendChild(columnControlWrapper);

    return wrapper;
}

function imageWithTextSingle(){
  // Get the source HTML container
  const sourceBlock = document.querySelector('.imagewithtext-wrapper .imagewithtext.single');

  // Extract image URL
  const imageSrc = sourceBlock.querySelector('img')?.getAttribute('src') || '';

  // Extract paragraph content
  const paragraphs = sourceBlock.querySelectorAll('p');
  const p1 = paragraphs[0]?.innerHTML.trim() || '';
  const p2 = paragraphs[1]?.innerText.trim() || '';
  const p3 = paragraphs[2]?.innerText.trim() || '';

  // Extract link href and display text
  const fullLink = sourceBlock.querySelector('a')?.getAttribute('href') || '';
  const linkText = sourceBlock.querySelector('div:nth-child(3) p')?.innerText.trim() || 'Find out more';

  // Create the new HTML structure
  const newSection = document.createElement('div');
  newSection.className = 'cc-wrapper O-COLCTRL-RW-DEV';
  newSection.setAttribute('role', 'region');
  newSection.innerHTML = `
    <div id="hp_rel_columnControl_4">
      <div class="cc cc-columns-33-66">
        <div id="hp_rel_columnControlColumn_7" class="cc-column">
          <div class="M-IMG-RW-DEV">
            <div id="hp_rel_image_13" class="crh-smart-image crh-smart-image--landscape">
              <a class="smart-image-content" href="${fullLink}" target="_blank" rel="noopener">
                <span class="visuallyhidden">This link will open in a new window</span>
                <div class="smart-image-content crh-media-aspect-ratio-container">
                  <picture id="hp_rel_image_14">
                    <source srcset="${imageSrc}" media="(min-width: 960px)" />
                    <source srcset="${imageSrc}" media="(min-width: 480px)" />
                    <source srcset="${imageSrc} 1x, ${imageSrc} 2x" />
                    <img
                      id="hp_rel_image_15"
                      class="A-IMAGE-RW-ALL crh-media-aspect-ratio-container__media-inside"
                      role="img"
                      src="${imageSrc}"
                      alt="Logo of FSCS - Protecting your money"
                    />
                  </picture>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div id="hp_rel_columnControlColumn_8" class="cc-column">
          <div class="M-CONTMAST-RW-RBWM O-SMARTSPCGEN-DEV rich-text" role="region">
            <div id="hp_rel_richtext_6" class="remove-bottom-space A-PAR16R-RW-ALL-WRAPPER">
              <p class="A-PAR16R-RW-ALL">${p1}</p>
              <p class="A-PAR16R-RW-ALL">${p2}</p>
              <p class="A-PAR16R-RW-ALL">${p3}</p>
            </div>
          </div>

          <div class="O-SMARTSPCGEN-DEV M-CONTMAST-RW-RBWM links" role="region">
            <div>
              <ul id="hp_rel_links_5" class="links-list">
                <li>
                  <div id="hp_rel_link_5" class="link-container">
                    <a class="A-LNKST-RW-ALL" href="${new URL(fullLink).pathname}" target="_self">
                      <span aria-hidden="true" class="link">${linkText}</span>
                      <span class="icon icon-chevron-right" aria-hidden="true"></span>
                      <span class="visuallyhidden">${linkText} about FSCS </span>
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Append the section to <main>
  document.querySelector('main')?.appendChild(newSection);
}