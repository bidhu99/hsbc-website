import { getMetadata } from "../../scripts/aem.js";
import { decorateMain } from "../../scripts/scripts.js";


export default function decorate(block) {
  if (block.classList.contains("first")) {
    buttonMarkup();
  }
}

function buttonMarkup(){
  // Step 1: Select the source markup
  const sourceButton = document.querySelector('.button.first.block');

  // Extract the button text from <p><code>...</code></p>
  const buttonText = sourceButton.querySelector('p code')?.textContent.trim() || "";

  // Extract the URL from the <a> tag
  const buttonUrl = sourceButton.querySelector('a')?.getAttribute('href') || "";

  // Step 2: Build the target HTML
  const targetHtml = `
  <div class="M-CONTMAST-RW-RBWM O-SMARTSPCGEN-DEV content-buttons" role="region">
      <div id="pp_tools_buttons_1">
          <div class="clearfix horizontal">
              <a
                  class="A-BTNP-RW-ALL"
                  href="${buttonUrl}"
                  target="_blank"
                  rel="noopener"
                  id="pp_tools_button_2"
                  data-event-component="button"
                  data-event-name="${buttonText.toLowerCase()} | component:apply | colour:red|position:1"
              >
                  <span aria-hidden="true">${buttonText}</span>
                  <span class="visuallyhidden">${buttonText} This link will open in a new window</span>
              </a>
          </div>
      </div>
  </div>
  `;

  const finalContainer = document.querySelector("main .with-bg > .sm-12 > .two-column-control > #pp_tools_columnControl_2 > .cc-columns-50-50 > #pp_tools_columnControlColumn_1");
  const temp = document.createElement("div");
  temp.innerHTML = targetHtml;
  finalContainer.appendChild(temp.firstElementChild);

}