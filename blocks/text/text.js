import {
    getMetadata
} from "../../scripts/aem.js";

export default function decorate(block) {
    const sourcePara = document.querySelector(".text-wrapper p");
    const textWrapper = document.querySelector(".text.withheading.block");
    if (block.classList.contains("withoutheading")) {
        textWithOutHeading(sourcePara);
    }
    if (block.classList.contains("withheading")) {
        if (!sourcePara || !textWrapper) {
            console.warn("Source paragraph not found.");
        }
        textWithHeading(textWrapper);
    }
    if (block.classList.contains("singleheading")) {
        singleHeader();
    }
    if (block.classList.contains("singleheadingsecondvarient")) {
        singleheadingsecondvarient();
    }
    if (block.classList.contains("textblock")) {
        textBlock();
    }
    if (block.classList.contains("h3-first")) {
        h3Heading("h3-first");
    }
    if (block.classList.contains("h3-second")) {
        h3Heading("h3-second");
    }
    if (block.classList.contains("subheading-first")) {
        subheading("subheading-first");
    }
    if (block.classList.contains("subheading-second")) {
        subheading("subheading-second");
    }
    if (block.classList.contains("subheading-first-content")) {
        subheading("subheading-first-content");
    }
    if (block.classList.contains("textblock-first")) {
        testBlockFirst("textblock-first");
    }
    if (block.classList.contains("textblock-second")) {
        testBlockFirst("textblock-second");
    }
}

function textWithOutHeading(sourcePara) {
    const clonedPara = sourcePara.cloneNode(true);

    // Step 2: Create the new HTML structure
    const wrapper = document.createElement("div");
    wrapper.className = "row";
    wrapper.innerHTML = `
        <div class="cc-wrapper O-COLCTRL-RW-DEV sm-12" role="region">
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
    wrapper.className = "row";

    wrapper.innerHTML = `
          <div class="cc-wrapper O-COLCTRL-RW-DEV sm-12" role="region">
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

function singleHeader() {
    const secondMainWrapper = document.querySelectorAll("main .with-bg > .sm-12")[1];

    // 1. Get the heading text from your existing block
    const sourceTextEl = document.querySelector('.text.singleheading.block p code');
    const headingText = sourceTextEl ? sourceTextEl.textContent.trim() : "";

    // 2. Create the new HTML structure
    const wrapper = document.createElement('div');
    wrapper.className = 'cc-wrapper O-COLCTRL-RW-DEV';
    wrapper.setAttribute('role', 'region');

    wrapper.innerHTML = `
      <div id="pp_tools_columnControl_2">
          <div class="cc cc-columns-66-33">
              <div id="pp_tools_columnControlColumn_2" class="cc-column">
                  <div class="M-CONTMAST-RW-RBWM O-SMARTSPCGEN-DEV" role="region">
                      <div class="anchor" id="${headingText.toLowerCase().replace(/\s+/g, '-')}"></div>
                      <h2 class="heading A-TYP28L-RW-ALL" id="pp_tools_heading_1">
                          ${headingText}
                      </h2>
                  </div>
              </div>
              <div id="pp_tools_columnControlColumn_3" class="cc-column"></div>
          </div>
      </div>
  `;

    // 3. Append it wherever you need (example: inside body)
    secondMainWrapper.appendChild(wrapper);
}

function singleheadingsecondvarient() {
    // Step 1: Get the text from the <code> inside .singleheadingsecondvarient
    const sourceText = document.querySelector(
            ".text.singleheadingsecondvarient blockquote, .text.singleheadingsecondvarient code, .text.singleheadingsecondvarient p code"
        ) ?
        document.querySelector(".text.singleheadingsecondvarient p code").textContent.trim() :
        "";

    // Step 2: Create slug (id-friendly)
    const slug = sourceText
        .toLowerCase()
        .replace(/[^\w\s-]/g, "") // remove non-alphanumeric except spaces/hyphens
        .replace(/\s+/g, "-"); // spaces → hyphens

    // Step 3: Build the target HTML
    const html = `
  <div class="cc-wrapper O-COLCTRL-RW-DEV" role="region">
    <div id="pp_tools_columnControl_4">
      <div class="cc cc-columns-66-33">
        <div id="pp_tools_columnControlColumn_6" class="cc-column">
          <div class="M-CONTMAST-RW-RBWM O-SMARTSPCGEN-DEV" role="region">
            <div class="anchor" id="${slug}"></div>
            <h2 class="heading A-TYP28L-RW-ALL remove-bottom-space" id="pp_tools_heading_2">
              ${sourceText}
            </h2>
          </div>
        </div>
        <div id="pp_tools_columnControlColumn_7" class="cc-column"></div>
      </div>
    </div>
  </div>
  `;
    const secondMainWrapper = document.querySelectorAll("main .with-bg > .sm-12")[1];
    const temp = document.createElement("div");
    temp.innerHTML = html;
    secondMainWrapper.appendChild(temp.firstElementChild);

}

function decodeHTML(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}

function extractEligibilityJSON() {


    const container = document.querySelector('.text.textblock.block');
    if (!container) {
        console.error('Container .text.textblock.block not found');
        return null;
    }

    // Only direct child divs (keeps order)
    const blocks = Array.from(container.querySelectorAll(':scope > div'));

    // HEADER
    const headerP = blocks[0]?.querySelector('p');
    const headerText = headerP ? headerP.textContent.trim() : '';

    // SUBHEADING - decode encoded tags like &lt;strong&gt;
    const subP = blocks[1]?.querySelector('p');
    const rawSub = subP ? subP.innerHTML.trim() : '';
    const subheading = rawSub ? decodeHTML(rawSub) : '';

    // CRITERIA
    const criteria = [];
    for (let i = 2; i < blocks.length; i++) {
        const block = blocks[i];
        // label is inside first inner div -> p > code
        const labelEl = block.querySelector(':scope > div:first-child p code');
        const label = labelEl ? labelEl.textContent.trim() : (block.querySelector(':scope > div:first-child')?.textContent.trim() || '');

        // description is inside second inner div
        const descDiv = block.querySelector(':scope > div:nth-child(2)');
        let description = '';

        if (descDiv) {
            const codeDesc = descDiv.querySelector('p code');
            if (codeDesc) {
                // simple text description wrapped in <code>
                description = codeDesc.textContent.trim();
            } else {
                // may contain encoded tags (e.g. &lt;a&gt;, &amp;nbsp;, etc.)
                const raw = descDiv.innerHTML.trim();
                const decoded = decodeHTML(raw); // now tags like &lt;a&gt; are real <a>
                // strip outer wrapper if present (e.g. <h1>...</h1> or <p>...</p>)
                const tmp = document.createElement('div');
                tmp.innerHTML = decoded;
                if (tmp.firstElementChild && /^(p|h[1-6]|div)$/i.test(tmp.firstElementChild.tagName)) {
                    description = tmp.firstElementChild.innerHTML.trim();
                } else {
                    description = tmp.innerHTML.trim();
                }
            }
        }

        // convert real NBSP chars back to entity so JSON matches your sample exactly
        description = description.replace(/\u00A0/g, '&nbsp;');

        criteria.push({
            label,
            description
        });
    }

    const result = {
        headerText,
        subheading,
        criteria
    };
    return result;
}

function textBlock() {
    const data = extractEligibilityJSON();
    // Create the main wrapper
    const container = document.createElement("div");
    container.className = "O-SMARTSPCGEN-DEV O-MASTERCARD-RW-DEV";
    container.setAttribute("role", "region");

    container.innerHTML = `
      <div id="pp_tools_masterCard_2" class="crh-master-card">
          <div class="crh-master-card__grid">
              <div class="crh-master-card__header-container" et-event-counter="1">
                  <div class="crh-master-card__header-wrapper">
                      <div id="pp_tools_title_6">
                          <div class="anchor" id="who-can-apply"></div>
                          <h2 class="crh-master-card__header A-TYPS2R-RW-DEV text-container text">${data.headerText}</h2>
                      </div>
                      <div id="pp_tools_description_2">
                          <div class="crh-master-card__lead A-TYPS5L-RW-DEV text-container text" style="margin-bottom: 0px;" et-event-counter="2">
                              ${data.subheading}
                          </div>
                          <ul class="A-LSTU-RW-ALL"></ul>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  `;

    // Add criteria items
    const ul = container.querySelector("ul");
    data.criteria.forEach(item => {
        const li = document.createElement("li");

        const label = document.createElement("b");
        label.textContent = item.label;

        const desc = document.createElement("div");
        desc.className = "A-PAR14R-RW-ALL description text-container text";
        desc.innerHTML = item.description; // keep HTML like links and &nbsp;

        li.appendChild(label);
        li.appendChild(desc);
        ul.appendChild(li);
    });
    const finalContainer = document.querySelectorAll("main .with-bg > .sm-12")[1];
    finalContainer.appendChild(container);
}

function h3Heading(classType) {
    let sourceText = document.querySelector(
        '.text.' + classType + '.block p code'
    )?.textContent.trim();

    if (sourceText == null) {
        sourceText = document.querySelector(
            '.text.' + classType + '.block p'
        )?.textContent.trim();
    }
    if (sourceText) {
        let container = document.createElement('div');
        container.className = 'M-CONTMAST-RW-RBWM O-SMARTSPCGEN-DEV';
        container.setAttribute('role', 'region');

        let anchor = document.createElement('div');
        anchor.className = 'anchor';
        anchor.id = 'new-to-hsbc-uk';

        let heading = document.createElement('h3');
        heading.className = 'heading A-TYP22L-RW-ALL remove-bottom-space';
        heading.id = 'pp_tools_heading_4';
        heading.textContent = sourceText;

        container.appendChild(anchor);
        container.appendChild(heading);

        let finalContainer = document.querySelector("main .with-bg > .sm-12 > .two-column-control > #pp_tools_columnControl_2 > .cc-columns-50-50 > #pp_tools_columnControlColumn_1")
        if (classType.includes("second")) {
            finalContainer = document.querySelector("main .with-bg > .sm-12 > .two-column-control > #pp_tools_columnControl_2 > .cc-columns-50-50 > #pp_tools_columnControlColumn_2")
        }
        finalContainer.appendChild(container); // Or wherever it needs to go
    }
}

function subheading(classType) {
    let sourceText = document.querySelector(
        '.text.' + classType + '.block p code'
    )?.textContent.trim();

    if (sourceText == null) {
        sourceText = document.querySelector(
            '.text.' + classType + '.block p'
        )?.textContent.trim();
    }
    if (sourceText) {
        let container = document.createElement('div');
        container.className = 'M-CONTMAST-RW-RBWM O-SMARTSPCGEN-DEV rich-text';
        container.setAttribute('role', 'region');

        let innerDiv = document.createElement('div');
        innerDiv.id = 'pp_tools_richtext_15';
        innerDiv.className = 'remove-bottom-space A-PAR16R-RW-ALL-WRAPPER';
        innerDiv.dataset.dateFormat = 'M/D/YYYY';
        innerDiv.dataset.timeFormat = 'HH:MM:SS A';
        innerDiv.dataset.zone = 'America/New_York';

        let paragraph = document.createElement('p');
        paragraph.className = 'A-PAR16R-RW-ALL';
        paragraph.textContent = sourceText;

        innerDiv.appendChild(paragraph);
        container.appendChild(innerDiv);

        let finalContainer = document.querySelector("main .with-bg > .sm-12 > .two-column-control > #pp_tools_columnControl_2 > .cc-columns-50-50 > #pp_tools_columnControlColumn_1");
        if (classType.includes("second")) {
            finalContainer = document.querySelector("main .with-bg > .sm-12 > .two-column-control > #pp_tools_columnControl_2 > .cc-columns-50-50 > #pp_tools_columnControlColumn_2")
        }
        finalContainer.appendChild(container);
    }
}

function testBlockFirst(classType) {
    // Step 1: Select the source block
    const sourceTextBlock = document.querySelector('.text.'+classType+'.block');

    // Step 2: Extract all <p> tags from the source
    const paragraphs = sourceTextBlock.querySelectorAll('p');

    // Step 3: Build HTML for target paragraphs
    const paragraphHtml = Array.from(paragraphs).map(p => {
        // Step 1: decode the encoded HTML (so &lt;a&gt; becomes <a>)
        const decodedContent = decodeHTMLNew(p.innerHTML);

        // Step 2: wrap in the target <p> class
        return `<p class="A-PAR16R-RW-ALL">${decodedContent}</p>`;
    }).join('\n');

    // Step 4: Wrap into HSBC rich-text block structure
    const newHtml = `
  <div class="M-CONTMAST-RW-RBWM O-SMARTSPCGEN-DEV rich-text" role="region">
      <div id="pp_tools_richtext_17"
           class="remove-bottom-space A-PAR16R-RW-ALL-WRAPPER"
           data-date-format="M/D/YYYY"
           data-time-format="HH:MM:SS A"
           data-zone="America/New_York">
          ${paragraphHtml}
      </div>
  </div>
  `;

    let finalContainer = document.querySelector("main .with-bg > .sm-12 > .two-column-control > #pp_tools_columnControl_2 > .cc-columns-50-50 > #pp_tools_columnControlColumn_1");
    if (classType.includes("second")) {
        finalContainer = document.querySelector("main .with-bg > .sm-12 > .two-column-control > #pp_tools_columnControl_2 > .cc-columns-50-50 > #pp_tools_columnControlColumn_2")
    }
    const temp = document.createElement("div");
    temp.innerHTML = newHtml;
    finalContainer.appendChild(temp.firstElementChild);
}

function decodeHTMLNew(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}