import { getMetadata } from "../../scripts/aem.js";
import { decorateMain } from "../../scripts/scripts.js";

export default function decorate(block) {
  if(!block.classList.contains("secondvarient")){
    cardWithImage();
  }
  if(block.classList.contains("secondvarient")){
    secondvarient();
  }
}

function cardWithImage(){
  // Extract data from the "cardwithimage" block
  const card = document.querySelector('.cardwithimage');

  const title = card.querySelector('h2#get-a-500-selfridges-gift-card-and-vip-experience strong').textContent;
  const subtitle = card.querySelector('h2#open-an-hsbc-premier-account-and-either-deposit-100000-or-more-into-savings--investments-or-switch-your-account-using-the-current-account-switch-service-offer-ends-28-aug-2025 strong').textContent;
  const buttonText = card.querySelector('h2#find-out-more-and-apply strong').textContent;
  const buttonHref = card.querySelector('h2#discover-how-premier-gives-you-more strong').textContent;

  const para1 = card.querySelector('h2#apply-for-an-hsbc-premier-account-between-28-jul-and-28-aug-2025-and-by17-oct-2025either-a-pay-in-100k-in-savings--investmentsor-b-complete-a-full-switch-including-your-monthly-salary-equivalent-to-an-individual-annual-salary-of-100k-and-2-direct-debits strong').textContent;
  const para2 = card.querySelector('h2#continue-to-meet-the-criteria-until-31-dec-2025-and-youll-receive-an-email-on-or-after-2-feb-2026-to-claim-the-offer strong').textContent;
  const para3 = card.querySelector('h2#excludes-existing-hsbc-uk-and-first-direct-current-account-customers-uk-residents-only-further-offer-and-premier-eligibility-criteria-apply strong').textContent;

  // Image sources
  const mainImageSrc = card.querySelectorAll('picture img')[0].getAttribute('src');
  const logoImageSrc = card.querySelectorAll('picture img')[1].getAttribute('src');

  // Build the first HTML structure dynamically
  const promoHTML = `
  <div class="O-SMARTSPCGEN-DEV in-page-promo" role="region">
      <div id="pp_tools_inPage_promo_1" class="in-page-promo--pearl img-small img-left clearfix">
          <div class="in-page-promo__image-container">
              <div class="image">
                  <div class="img-container">
                      <div class="M-IMG-RW-DEV">
                          <div id="pp_tools_image_13" class="smart-image">
                              <figure class="smart-image-figure">
                                  <picture id="pp_tools_image_14">
                                      <img id="pp_tools_image_15" class="A-IMAGE-RW-ALL smart-image-img" role="img" src="${mainImageSrc}" alt="" />
                                  </picture>
                              </figure>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <div class="in-page-promo__text-container">
              <div class="in-page-promo__wrapper m-xsm-12 m-mdsm-10 m-md-8">
                  <div class="in-page-promo__title">
                      <h2 class="A-TYPS3L-RW-DEV text-container text">${title}</h2>
                      <div class="in-page-promo__subtitle">
                          <p class="A-TYPS5R-RW-DEV text-container text">${subtitle}</p>
                      </div>
                  </div>
                  <div class="action-buttons">
                      <div class="secondary-button">
                          <div>
                              <a class="A-BTNSS-RW-ALL" href="${buttonHref}" target="_self" id="pp_tools_button_1">
                                  <span aria-hidden="true">${buttonText}</span>
                                  <span class="visuallyhidden">${buttonText} for HSBC Premier Bank Account</span>
                              </a>
                          </div>
                      </div>
                  </div>
                  <div class="in-page-promo__small">
                      <div class="A-TYPS7R-RW-DEV text-container text">
                          <p>${para1}</p>
                          <p>${para2}</p>
                          <p>${para3}</p>
                      </div>
                  </div>
                  <div class="logo-wrapper">
                      <div class="logo-container">
                          <div class="logo-container__item">
                              <div class="img-container">
                                  <div class="M-IMG-RW-DEV">
                                      <div id="pp_tools_image_16" class="smart-image">
                                          <figure class="smart-image-figure">
                                              <picture id="pp_tools_image_17">
                                                  <img id="pp_tools_image_18" class="A-IMAGE-RW-ALL smart-image-img" role="img" src="${logoImageSrc}" alt="" />
                                              </picture>
                                          </figure>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
  `;
  const secondMainWrapper = document.querySelectorAll("main .with-bg > .sm-12")[1];
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = promoHTML;
  secondMainWrapper.appendChild(tempDiv.firstElementChild);

}

function secondvarient(){
  // 1. Source element
  const cardBlock = document.querySelector('.cardwithimage.secondvarient.block');

  // --- Extract image sources ---
  const imgEl = cardBlock.querySelector('picture img');
  const imgSrc = imgEl ? imgEl.getAttribute('src') : '';
  const imgAlt = imgEl ? imgEl.getAttribute('alt') || '' : '';

  // Extract <source> tags (optional if you want multiple resolutions)
  const sources = cardBlock.querySelectorAll('picture source');
  let sourcesHTML = '';
  sources.forEach(source => {
    sourcesHTML += source.outerHTML + '\n';
  });

  // --- Extract paragraph text ---
  const paraText = cardBlock.querySelectorAll('p code')[0]?.textContent.trim() || '';

  // --- Extract list HTML ---
  const listHTMLRaw = cardBlock.querySelector('pre code')?.textContent || '';
  // decode HTML entities to get usable HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = listHTMLRaw;
  const listHTML = tempDiv.innerHTML.trim();

  // 2. Create wrapper
  const wrapper = document.createElement('div');
  wrapper.className = 'cc-wrapper O-COLCTRL-RW-DEV';
  wrapper.setAttribute('role', 'region');

  wrapper.innerHTML = `
      <div id="pp_tools_columnControl_3">
          <div class="cc cc-columns-50-50 cc-mobile-reflow">
              <div id="pp_tools_columnControlColumn_4" class="cc-column">
                  <div class="M-IMG-RW-DEV O-SMARTSPCGEN-DEV" role="region">
                      <div id="pp_tools_image_19" class="smart-image">
                          <figure class="smart-image-figure">
                              <picture id="pp_tools_image_20">
                                  ${sourcesHTML}
                                  <img id="pp_tools_image_21" class="A-IMAGE-RW-ALL smart-image-img" role="img" src="${imgSrc}" alt="${imgAlt}" />
                              </picture>
                          </figure>
                      </div>
                  </div>
              </div>

              <div id="pp_tools_columnControlColumn_5" class="cc-column">
                  <div class="M-CONTMAST-RW-RBWM O-SMARTSPCGEN-DEV rich-text" role="region">
                      <div id="pp_tools_richtext_1" class="remove-bottom-space A-PAR16R-RW-ALL-WRAPPER"
                          data-date-format="M/D/YYYY" data-time-format="HH:MM:SS A" data-zone="America/New_York">
                          <p class="A-PAR16R-RW-ALL">${paraText}</p>
                      </div>
                  </div>

                  <div class="M-CONTMAST-RW-RBWM O-SMARTSPCGEN-DEV rich-text" role="region">
                      <div id="pp_tools_richtext_2" class="A-PAR16R-RW-ALL-WRAPPER"
                          data-date-format="M/D/YYYY" data-time-format="HH:MM:SS A" data-zone="America/New_York">
                          ${listHTML}
                      </div>
                  </div>
              </div>
          </div>
      </div>
  `;
  const secondMainWrapper = document.querySelectorAll("main .with-bg > .sm-12")[1];
  secondMainWrapper.appendChild(wrapper);
}