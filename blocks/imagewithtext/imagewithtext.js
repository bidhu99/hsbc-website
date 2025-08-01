import {
    getMetadata
} from '../../scripts/aem.js';

export default function decorate(block) {
    if(block.classList.contains("right")){
      const surveyJson = extractSurveyData();
      appendToMain(surveyJson);
      appendImageItem(surveyJson);
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