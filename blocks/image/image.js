import {
    getMetadata
} from "../../scripts/aem.js";

export default function decorate(block) {
  imageRender();
}

function imageRender(){
  // Select the original .image.block
  const imageBlock = document.querySelector('.image.block');
  if (imageBlock) {
      const picture = imageBlock.querySelector('picture');
      const img = picture.querySelector('img');

      // Get all <source> srcset values
      const sources = Array.from(picture.querySelectorAll('source')).map(src => ({
          srcset: src.getAttribute('srcset') || '',
          media: src.getAttribute('media') || ''
      }));

      // Get main <img> attributes
      const imgSrc = img.getAttribute('src');
      const imgAlt = img.getAttribute('alt') || '';
      const imgWidth = img.getAttribute('width') || '';
      const imgHeight = img.getAttribute('height') || '';

      // Build the new HTML string
      const newHTML = `
  <div class="cc-wrapper O-COLCTRL-RW-DEV" role="region">
      <div id="pp_tools_columnControl_14">
          <div class="cc cc-columns-25-75">
              <div id="pp_tools_columnControlColumn_25" class="cc-column">
                  <div class="M-IMG-RW-DEV O-SMARTSPCGEN-DEV" role="region">
                      <div id="pp_tools_image_22" class="smart-image">
                          <a class="smart-image-content" href="/fscs/" target="_self" data-event-component="other" data-event-name="fscs logo|component:added information">
                              <figure class="smart-image-content smart-image-figure">
                                  <picture id="pp_tools_image_23">
                                      ${sources.map(s => `<source srcset="${s.srcset}"${s.media ? ` media="${s.media}"` : ''} />`).join('\n                                    ')}
                                      <img
                                          id="pp_tools_image_24"
                                          class="A-IMAGE-RW-ALL smart-image-img"
                                          role="img"
                                          src="${imgSrc}"
                                          alt="${imgAlt || 'Logo of FSCS - Protecting your money'}"
                                          width="${imgWidth}"
                                          height="${imgHeight}"
                                      />
                                  </picture>
                              </figure>
                          </a>
                      </div>
                  </div>
              </div>
              <div id="pp_tools_columnControlColumn_26" class="cc-column"></div>
          </div>
      </div>
  </div>
      `.trim();

    const container = document.querySelectorAll("main .with-bg > .sm-12")[1];
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = newHTML;
    container.appendChild(tempDiv.firstElementChild);
  }

}