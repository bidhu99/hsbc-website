import { getMetadata } from "../../scripts/aem.js";

export default function decorate(block) {
  const data = parseSliderHTML(block);

  const container = document.querySelectorAll("main .with-bg > .sm-12")[1];
  const wrapper = createEligibilityHTML(data);
  container.appendChild(wrapper);
  bindAccordionEvents();
}


function bindAccordionEvents() {
  document.querySelectorAll(".dropdown").forEach((dropdown) => {
    dropdown.addEventListener("click", function () {
      const expanded = this.getAttribute("aria-expanded") === "true";
      this.setAttribute("aria-expanded", !expanded);
      const panel = document.getElementById(this.getAttribute("aria-controls"));
      if (panel) {
        panel.setAttribute("aria-hidden", expanded);
        if (expanded) {
          panel.classList.add("expanded");
        } else {
          panel.classList.remove("expanded");
        }
        // panel.style.display = expanded ? "none" : "block";
      }
    });
  });
}

function parseSliderHTML(sliderEl) {
  if (!sliderEl) throw new Error("Pass the .slider.block element");

  const result = { type: "slider", sections: [] };

  // State for where to put content
  let currentSection = null;
  let currentSubsection = null;

  // Helper: ensure content array exists on the right target
  function pushContent(value) {
    if (!value) return;
    if (currentSubsection) {
      if (!currentSubsection.content) currentSubsection.content = [];
      currentSubsection.content.push(value);
    } else if (currentSection) {
      if (!currentSection.content) currentSection.content = [];
      currentSection.content.push(value);
    }
  }


  function decodeEntities(str) {
    const tmp = document.createElement("div");
    // Using textContent preserves raw characters; innerHTML decodes entities
    tmp.innerHTML = str;
    return tmp.textContent || tmp.innerText || "";
  }

  // Walk each top-level block <div> inside the slider
  const blocks = Array.from(sliderEl.children);

  // We’ll accumulate escaped list markup across <p> lines within a block
  blocks.forEach((block) => {
    const h1 = block.querySelector("h1");
    const h3 = block.querySelector("h3");
    const h5 = block.querySelector("h5");
    const linkInH1 = h1 && h1.querySelector("a[href]");

    // 1) Section/Subsection handling
    if (h3 && !linkInH1) {
      // New top-level section (e.g., "Full eligibility criteria", "Important documents")
      currentSection = { title: h3.textContent.trim() };
      result.sections.push(currentSection);
      currentSubsection = null;
    } else if (h1 && !linkInH1) {
      // Some sections use <h1> (e.g., "HSBC Premier Travel Insurance")
      currentSection = { title: h1.textContent.trim() };
      result.sections.push(currentSection);
      currentSubsection = null;
    }

    if (h5) {
      // Subsection (e.g., "HSBC Premier Account")
      if (!currentSection) {
        currentSection = { title: "" };
        result.sections.push(currentSection);
      }
      currentSubsection = { title: h5.textContent.trim(), content: [] };
      if (!currentSection.subsections) currentSection.subsections = [];
      currentSection.subsections.push(currentSubsection);
    }

    // 2) Document triplets handling (name p, download p, h1>a link)
    if (linkInH1) {
      // Find a name from the paragraphs within this same block (skip the "Download" label)
      const ps = Array.from(block.querySelectorAll("p")).map((p) =>
        p.textContent.trim()
      );
      const name =
        ps.find((t) => t && !/download$/i.test(t)) ||
        linkInH1.textContent.trim() ||
        linkInH1.href;

      if (!currentSection) {
        currentSection = { title: "Documents" };
        result.sections.push(currentSection);
      }
      if (!currentSection.documents) currentSection.documents = [];
      currentSection.documents.push({
        name,
        url: linkInH1.href,
      });

      // This block is a pure document entry; skip adding its <p> text as content
      return;
    }

    // 3) Paragraphs and escaped <ul>/<li> lists
    const paragraphs = Array.from(block.querySelectorAll("p"));
    if (!paragraphs.length) return;

    let collectingList = false;
    let listHtml = "";

    paragraphs.forEach((p) => {
      let raw = p.textContent || "";
      raw = raw.trim();
      if (!raw) return;

      // Detect escaped-list lines (start with &lt;...&gt;)
      const decoded = decodeEntities(raw);
      const looksLikeTag = decoded.startsWith("<") && decoded.endsWith(">");

      if (looksLikeTag) {
        // Start or continue an escaped list
        if (decoded.toLowerCase().startsWith("<ul")) {
          collectingList = true;
          listHtml = decoded;
          return;
        }

        if (collectingList) {
          listHtml += decoded;
          if (decoded.toLowerCase().includes("</ul>")) {
            // Close list: parse it and push { list: [...] }
            const tmp = document.createElement("div");
            tmp.innerHTML = listHtml;
            const items = Array.from(tmp.querySelectorAll("li")).map((li) =>
              li.textContent.trim()
            );
            if (items.length) pushContent({ list: items });
            collectingList = false;
            listHtml = "";
          }
          return;
        }
      }

      // Normal paragraph text (ignore "Download" labels)
      if (/^download$/i.test(raw)) return;
      pushContent(raw);
    });
  });

  return result;
}

function createEligibilityHTML(data) {
    const wrapper = document.createElement('div');
    wrapper.className = "cc-wrapper O-COLCTRL-RW-DEV";
    wrapper.setAttribute("role", "region");

    wrapper.innerHTML = `
        <div id="pp_tools_columnControl_15">
            <div class="cc cc-columns-66-33">
                <div id="pp_tools_columnControlColumn_27" class="cc-column">
                    <div class="O-SMARTSPCGEN-DEV O-ACCRD-RW-RBWM row" role="region">
                        <div>
                            <div id="pp_tools_accordion_1" class="accordions-container sm-12">
                                ${data.sections.map((section, idx) => {
                                    if (section.subsections) {
                                        // Accordion with subsections
                                        return `
                                            <div class="O-SMARTSPCGEN-DEV O-ADVEXP-RW-RBWM row" role="region">
                                                <div id="pp_tools_advanced_expander_${idx+1}" class="sm-12 clear-float">
                                                    <div class="anchor" id="${section.title.toLowerCase().replace(/\s+/g, '-')}"></div>
                                                    <div class="A-EXPCNT-RW-RBWM expander">
                                                        <div class="dropdown" role="button" tabindex="0" aria-expanded="false">
                                                            <h3 class="dropdown-text">${section.title}&nbsp;</h3>
                                                            <span class="chevron"></span>
                                                        </div>
                                                        <section class="exp-content" aria-hidden="true" tabindex="-1">
                                                            <div class="exp-panel">
                                                                <div class="cc-wrapper O-COLCTRL-RW-DEV" role="region">
                                                                    <div class="cc cc-columns-100">
                                                                        <div class="cc-column">
                                                                            ${section.subsections.map(sub => `
                                                                                <div class="M-CONTMAST-RW-RBWM O-SMARTSPCGEN-DEV rich-text" role="region">
                                                                                    <div class="remove-bottom-space A-PAR16R-RW-ALL-WRAPPER">
                                                                                        <h4><strong><span class="A-TYP16B-RW-ALL">${sub.title}</span></strong></h4>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="M-CONTMAST-RW-RBWM O-SMARTSPCGEN-DEV rich-text" role="region">
                                                                                    <div class="A-PAR16R-RW-ALL-WRAPPER">
                                                                                        ${sub.content.map(item => {
                                                                                            if (item.startsWith("<ul")) return item;
                                                                                            return `<p class="A-PAR16R-RW-ALL">${item}</p>`;
                                                                                        }).join('')}
                                                                                    </div>
                                                                                </div>
                                                                            `).join('')}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </section>
                                                    </div>
                                                </div>
                                            </div>
                                        `;
                                    }
                                    else if (section.documents) {
                                        // Accordion with documents
                                        return `
                                            <div class="O-SMARTSPCGEN-DEV O-ADVEXP-RW-RBWM row" role="region">
                                                <div id="pp_tools_advanced_expander_${idx+1}" class="sm-12 clear-float">
                                                    <div class="A-EXPCNT-RW-RBWM expander">
                                                        <div class="dropdown" role="button" tabindex="0" aria-expanded="false">
                                                            <h3 class="dropdown-text">${section.title}&nbsp;</h3>
                                                            <span class="chevron"></span>
                                                        </div>
                                                        <section class="exp-content" aria-hidden="true" tabindex="-1">
                                                            <div class="exp-panel">
                                                                <div class="cc-wrapper O-COLCTRL-RW-DEV" role="region">
                                                                    <div class="cc cc-columns-100">
                                                                        <div class="cc-column">
                                                                            <div class="O-SMARTSPCGEN-DEV M-CONTMAST-RW-RBWM links" role="region">
                                                                                <div>
                                                                                    <ul class="links-list">
                                                                                        ${section.documents.map((doc, docIdx) => `
                                                                                            <li>
                                                                                                <div class="link-container">
                                                                                                    <a class="A-LNKD-RW-ALL" href="${doc.url}" download>
                                                                                                        <span class="icon icon-download icon-right-space" aria-hidden="true"></span>
                                                                                                        <span aria-hidden="true" class="link">${doc.name}</span>
                                                                                                        <span class="visuallyhidden">${doc.name} Download</span>
                                                                                                    </a>
                                                                                                </div>
                                                                                            </li>
                                                                                        `).join('')}
                                                                                    </ul>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </section>
                                                    </div>
                                                </div>
                                            </div>
                                        `;
                                    }
                                    return '';
                                }).join('')}
                            </div>
                        </div>
                    </div>
                </div>
                <div id="pp_tools_columnControlColumn_30" class="cc-column"></div>
            </div>
        </div>
    `;
    return wrapper;
}



