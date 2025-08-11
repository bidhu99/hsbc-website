import {
    getMetadata
} from "../../scripts/aem.js";

export default function decorate(block) {
  const data = parseSliderToJSON();

  // Target container
  const container = document.querySelectorAll("main .with-bg > .sm-12")[1];
  buildMarkup(data,container);
  bindAccordionEvents();

}


// Utility: create element with optional classes and content
function createEl(tag, classes = [], content = "") {
    const el = document.createElement(tag);
    if (classes.length) el.className = classes.join(" ");
    if (content) el.innerHTML = content;
    return el;
}

// Build accordion section
function buildAccordion(section, index) {
    if (!section || !section.title || !section.content?.length) return null;

    const accordionRow = createEl("div", ["O-SMARTSPCGEN-DEV", "O-ADVEXP-RW-RBWM", "row"]);
    const col = createEl("div", ["sm-12", "clear-float"]);
    accordionRow.appendChild(col);

    const expander = createEl("div", ["A-EXPCNT-RW-RBWM", "expander"]);

    // Dropdown
    const dropdown = createEl("div", ["dropdown"]);
    dropdown.setAttribute("role", "button");
    dropdown.setAttribute("tabindex", "0");
    dropdown.setAttribute("aria-expanded", "false");
    dropdown.setAttribute("aria-controls", `panel_${index}`);

    const h3 = createEl("h3", ["dropdown-text"], section.title);
    h3.id = `tab_${index}`;
    dropdown.appendChild(h3);
    dropdown.appendChild(createEl("span", ["chevron"]));
    expander.appendChild(dropdown);

    // Content section
    const sectionContent = createEl("section", ["exp-content"]);
    sectionContent.id = `panel_${index}`;
    sectionContent.setAttribute("aria-hidden", "true");

    const expPanel = createEl("div", ["exp-panel"]);
    const ccWrapper = createEl("div", ["cc-wrapper", "O-COLCTRL-RW-DEV"]);
    const ccInner = createEl("div");
    const ccColumns = createEl("div", ["cc", "cc-columns-100"]);
    const ccColumn = createEl("div", ["cc-column"]);

    // Loop through content items
    section.content.forEach(item => {
        if (item.type === "text" && item.value) {
            const richText = createEl("div", ["M-CONTMAST-RW-RBWM", "O-SMARTSPCGEN-DEV", "rich-text"]);
            const inner = createEl("div", ["A-PAR16R-RW-ALL-WRAPPER"]);
            inner.appendChild(createEl("p", ["A-PAR16R-RW-ALL"], item.value));
            richText.appendChild(inner);
            ccColumn.appendChild(richText);
        } else if (item.type === "list" && Array.isArray(item.items) && item.items.length) {
            const richText = createEl("div", ["M-CONTMAST-RW-RBWM", "O-SMARTSPCGEN-DEV", "rich-text"]);
            const inner = createEl("div", ["A-PAR16R-RW-ALL-WRAPPER"]);
            const ul = createEl("ul", ["A-LSTU-RW-ALL"]);
            item.items.forEach(liItem => {
                ul.appendChild(createEl("li", [], liItem));
            });
            inner.appendChild(ul);
            richText.appendChild(inner);
            ccColumn.appendChild(richText);
        } else if (item.type === "document" && item.url) {
            const linksWrapper = createEl("div", ["O-SMARTSPCGEN-DEV", "M-CONTMAST-RW-RBWM", "links"]);
            const ul = createEl("ul", ["links-list"]);
            const li = createEl("li");
            const linkContainer = createEl("div", ["link-container"]);
            const a = createEl("a", ["A-LNKD-RW-ALL"]);
            a.href = item.url;
            a.target = "_blank";
            a.innerHTML = `<span class="icon icon-download icon-right-space" aria-hidden="true"></span>
                           <span aria-hidden="true" class="link">${item.title || ""}</span>`;
            linkContainer.appendChild(a);
            li.appendChild(linkContainer);
            ul.appendChild(li);
            linksWrapper.appendChild(ul);
            ccColumn.appendChild(linksWrapper);
        }
    });

    ccColumns.appendChild(ccColumn);
    ccInner.appendChild(ccColumns);
    ccWrapper.appendChild(ccInner);
    expPanel.appendChild(ccWrapper);
    sectionContent.appendChild(expPanel);
    expander.appendChild(sectionContent);
    col.appendChild(expander);

    return accordionRow;
}

// Build the full structure
function buildMarkup(data,container) {
    if (!data || !Array.isArray(data) || !data.length) return;

    const ccWrapperMain = createEl("div", ["cc-wrapper", "O-COLCTRL-RW-DEV"]);
    const innerDiv = createEl("div");
    const ccColumnsMain = createEl("div", ["cc", "cc-columns-66-33"]);
    const leftCol = createEl("div", ["cc-column"]);

    data.forEach((section, idx) => {
        const accordion = buildAccordion(section, idx + 1);
        if (accordion) leftCol.appendChild(accordion);
    });

    const rightCol = createEl("div", ["cc-column"]);
    ccColumnsMain.appendChild(leftCol);
    ccColumnsMain.appendChild(rightCol);
    innerDiv.appendChild(ccColumnsMain);
    ccWrapperMain.appendChild(innerDiv);

    container.appendChild(ccWrapperMain);
}

function parseSliderToJSON() {
  const slider = document.querySelector(".slider.block");
  const jsonData = [];

  if (!slider) return jsonData;

  let currentSection = null;

  slider.querySelectorAll(":scope > div").forEach(block => {
    const h3 = block.querySelector("h3");
    const pCode = block.querySelector("p code");
    const preCode = block.querySelector("pre code");
    const link = block.querySelector("a");

    // If a heading, start a new section
    if (h3) {
      currentSection = {
        title: h3.textContent.trim(),
        content: []
      };
      jsonData.push(currentSection);
    }

    // If paragraph code, add as text
    if (pCode) {
      if (!currentSection) {
        currentSection = { title: null, content: [] };
        jsonData.push(currentSection);
      }
      currentSection.content.push({
        type: "text",
        value: pCode.textContent.trim()
      });
    }

    // If preformatted list
    if (preCode) {
      if (!currentSection) {
        currentSection = { title: null, content: [] };
        jsonData.push(currentSection);
      }
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = preCode.textContent.trim();
      const listItems = [...tempDiv.querySelectorAll("li")].map(li =>
        li.textContent.trim()
      );
      currentSection.content.push({
        type: "list",
        items: listItems
      });
    }

    // If document link
    if (link) {
      if (!currentSection) {
        currentSection = { title: null, content: [] };
        jsonData.push(currentSection);
      }
      currentSection.content.push({
        type: "document",
        title: link.parentElement.previousElementSibling
          ? link.parentElement.previousElementSibling.textContent.trim()
          : "",
        url: link.href
      });
    }
  });

  return jsonData;
}

function bindAccordionEvents() {
    document.querySelectorAll(".dropdown").forEach(dropdown => {
        dropdown.addEventListener("click", function () {
            const expanded = this.getAttribute("aria-expanded") === "true";
            this.setAttribute("aria-expanded", !expanded);
            const panel = document.getElementById(this.getAttribute("aria-controls"));
            if (panel) {
                panel.setAttribute("aria-hidden", expanded);
                panel.style.display = expanded ? "none" : "block";
            }
        });
    });
}