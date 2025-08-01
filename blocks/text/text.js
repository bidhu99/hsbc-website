import { getMetadata } from "../../scripts/aem.js";

export default function decorate(block) {
  const sourcePara = document.querySelector(".text-wrapper p");
  const textWrapper = document.querySelector(".text.withheading.block");
  if (!sourcePara || !textWrapper) {
    console.warn("Source paragraph not found.");
  }
  if (block.classList.contains("withoutheading")) {
    textWithOutHeading(sourcePara);
  }
  if (block.classList.contains("withheading")) {
    textWithHeading(textWrapper);
  }
}

function textWithOutHeading(sourcePara) {
  const clonedPara = sourcePara.cloneNode(true);

  // Step 2: Create the new HTML structure
  const wrapper = document.createElement("div");
  // wrapper.className = "grid";
  wrapper.innerHTML = `
        <div class="cc-wrapper O-COLCTRL-RW-DEV" role="region">
          <div id="hp_main_columnControl_5">
            <div class="cc cc-columns-66-33">
              <div id="hp_main_columnControlColumn_11" class="cc-column">
                <div class="M-CONTMAST-RW-RBWM O-SMARTSPCGEN-DEV rich-text" role="region">
                  <div id="hp_main_richtext_3" class="A-PAR16R-RW-ALL-WRAPPER" data-date-format="M/D/YYYY" data-time-format="HH:MM:SS A" data-zone="America/New_York">
                  </div>
                </div>
              </div>
              <div id="hp_main_columnControlColumn_12" class="cc-column"></div>
            </div>
          </div>
          </div>
        `;

  // Step 3: Insert the paragraph into the new structure
  const richTextDiv = wrapper.querySelector("#hp_main_richtext_3");
  clonedPara.className = "A-PAR16R-RW-ALL";
  richTextDiv.appendChild(clonedPara);

  // Step 4: Append the whole structure to <main> or document body
  const main = document.querySelector("main") || document.body;
  main.appendChild(wrapper);
}

function textWithHeading(textWrapper) {
  // Step 2: Extract heading and paragraphs
  const headingText = textWrapper.querySelector("p")?.textContent.trim();
  const paragraphNodes = textWrapper.querySelectorAll(
    "div > div:nth-child(2) p"
  );

  // Step 3: Create new structure
  const wrapper = document.createElement("div");
  // wrapper.className = "grid";

  wrapper.innerHTML = `
          <div class="cc-wrapper O-COLCTRL-RW-DEV" role="region">
            <div class="cc-wrapper O-COLCTRL-RW-DEV" role="region">
              <div id="hp_rel_columnControl_1">
                <div class="cc cc-columns-66-33">
                  <div id="hp_rel_columnControlColumn_1" class="cc-column">
                    <div class="M-CONTMAST-RW-RBWM O-SMARTSPCGEN-DEV" role="region">
                      <div class="anchor" id="authorised-push-payment-app-scams-rankings-in-2023"></div>
                      <h2 class="heading A-TYP28L-RW-ALL remove-bottom-space" id="hp_rel_heading_1">${headingText}</h2>
                    </div>
                    <div class="M-CONTMAST-RW-RBWM O-SMARTSPCGEN-DEV rich-text" role="region">
                      <div id="hp_rel_richtext_1" class="A-PAR16R-RW-ALL-WRAPPER" data-date-format="M/D/YYYY" data-time-format="HH:MM:SS A" data-zone="America/New_York"></div>
                    </div>
                  </div>
                  <div id="hp_rel_columnControlColumn_2" class="cc-column"></div>
                </div>
              </div>
              </div>
              </div>
            `;

  // Step 4: Populate the paragraph content
  const targetContainer = wrapper.querySelector("#hp_rel_richtext_1");

  paragraphNodes.forEach((para) => {
    const cloned = para.cloneNode(true);

    // For external link, rewrite it with additional spans (if necessary)
    if (cloned.querySelector("a")) {
      const link = cloned.querySelector("a");
      const urlText = link.textContent.trim();
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener");

      // Rewrite link inner content for accessibility
      link.innerHTML = `
                  <span aria-hidden="true">${urlText}</span>
                  <span class="visuallyhidden">${urlText} This link will open in a new window</span>
                `;
    }

    cloned.className = "A-PAR16R-RW-ALL";
    targetContainer.appendChild(cloned);
  });

  // Step 5: Append to <main> or another container
  const main = document.querySelector("main") || document.body;
  main.appendChild(wrapper);
}
