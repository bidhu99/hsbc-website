import {
    getMetadata
} from "../../scripts/aem.js";
import {
    decorateMain
} from "../../scripts/scripts.js";

export default function decorate(block) {
  createTabs("main .with-bg > .sm-12", extractTabsData());
}

function createTabs(containerId, tabs) {
  const container = document.querySelectorAll("main .with-bg > .sm-12")[1];

  const tabMainContainer = document.createElement("div");
  tabMainContainer.className = "cc-wrapper O-COLCTRL-RW-DEV";
  tabMainContainer.setAttribute('role', 'region');

  const columnControlContainer = document.createElement("div");
  columnControlContainer.id = "pp_tools_columnControl_5";

  const subColumnControlContainer = document.createElement("div");
  subColumnControlContainer.className = "cc cc-columns-100";

  const columnControl = document.createElement("div");
  columnControl.id = "pp_tools_columnControlColumn_8";
  columnControl.className = "cc-column";

  const tabContainer = document.createElement("div");
  tabContainer.className = "tabsHorizontal";

  const tabDiv = document.createElement("div");

  const sectionContainer = document.createElement("section");
  sectionContainer.className = "O-HRZTAB-RW-RBWM O-SMARTSPCGEN-DEV";

  const tabFirstDiv = document.createElement("div");
  tabFirstDiv.id = "pp_tools_tabsHorizontal_1";

  const anchorDiv = document.createElement("div");
  anchorDiv.className = "anchor";
  anchorDiv.id = "tabs";

  tabFirstDiv.appendChild(anchorDiv);

  const tabMainDiv = document.createElement("div");
  tabMainDiv.className = "tab-wrapper A-TABH-RW-ALL";

  // Create tab header list
  const tabList = document.createElement("ul");
  tabList.className = "tab-widget-list clearfix";
  tabList.setAttribute('role', 'tablist');
  tabs.forEach((tab, i) => {
    const li = document.createElement("li");
    li.className = "tab-widget-item";
    li.setAttribute('role', 'presentation');
    li.innerHTML = `<a role="button" href="#" class="tab-widget-link${i === 0 ? " is-active" : ""}" tabindex="${i}" data-index="${i}">${tab.title}</a>`;
    tabList.appendChild(li);
  });
  tabMainDiv.appendChild(tabList);

  // Create tab content panels
  const contentWrapper = document.createElement("div");
  contentWrapper.className = "tab-widget-tabs";
  tabList.setAttribute('role', 'tabpanel');

  tabs.forEach((tab, i) => {
    const mainContentContainer = document.createElement("div");
    mainContentContainer.className = "tab-widget-tab-content";
    mainContentContainer.className = `tab-widget-tab-content${i === 0 ? "" : " hidden"}`

    const subContentDiv = document.createElement("div");
    subContentDiv.className = "cc-wrapper O-COLCTRL-RW-DEV";

    const subContentDivOne = document.createElement("div");
    subContentDivOne.className = "pp_tools_columnControl_6";

    const subColumnControlDiv = document.createElement("div");
    subColumnControlDiv.className = "cc cc-columns-66-33 ";

    const subToolsDiv = document.createElement("div");
    subToolsDiv.className = "cc-column";
    subToolsDiv.id = "pp_tools_columnControlColumn_9";

    const contentContainer = document.createElement("div");
    contentContainer.className = "M-CONTMAST-RW-RBWM O-SMARTSPCGEN-DEV rich-text";

    const contentDiv = document.createElement("div");
    contentDiv.className = " A-PAR16R-RW-ALL-WRAPPER";
    contentDiv.id = "pp_tools_richtext_3";
    contentDiv.innerHTML = tab.content;

    contentContainer.appendChild(contentDiv);
    subToolsDiv.appendChild(contentContainer);
    subColumnControlDiv.appendChild(subToolsDiv);
    subContentDivOne.appendChild(subColumnControlDiv);
    subContentDiv.appendChild(subContentDivOne);
    mainContentContainer.appendChild(subContentDiv);
    contentWrapper.appendChild(mainContentContainer);
  });
  tabMainDiv.appendChild(contentWrapper);
  tabFirstDiv.appendChild(tabMainDiv);
  sectionContainer.appendChild(tabFirstDiv);
  tabDiv.appendChild(sectionContainer);
  tabContainer.appendChild(tabDiv);
  columnControl.appendChild(tabContainer);
  subColumnControlContainer.appendChild(columnControl);
  columnControlContainer.appendChild(subColumnControlContainer);
  tabMainContainer.appendChild(columnControlContainer);
  container.appendChild(tabMainContainer);

  // Tab switching logic
  container.addEventListener("click", (e) => {
    if (e.target.classList.contains("tab-widget-link")) {
      e.preventDefault();
      const index = e.target.dataset.index;

      // Remove active class from all links
      container.querySelectorAll(".tab-widget-link").forEach(link => link.classList.remove("is-active"));
      e.target.classList.add("is-active");

      // Hide all content
      container.querySelectorAll(".tab-widget-tab-content").forEach((panel, idx) => {
        panel.classList.toggle("hidden", idx != index);
      });
    }
  });
}

function extractTabsData() {
  const result = [];

  // Loop over each main tab container (Travel, Health, International, Wealth)
  document.querySelectorAll('.tab.block > div').forEach(section => {
    const h2s = section.querySelectorAll('h2 strong');

    // First H2 contains the title
    const title = h2s[0]?.textContent.trim() || "";

    // Remaining H2s contain HTML-encoded fragments
    let contentParts = [];
    for (let i = 1; i < h2s.length; i++) {
      let encodedHTML = h2s[i].innerHTML; // e.g. &lt;p&gt;...&lt;/p&gt;
      let decodedHTML = encodedHTML
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&"); // basic decode
      contentParts.push(decodedHTML);
    }

    // Join and clean up into one HTML string
    let content = contentParts.join("\n");

    result.push({
      title,
      content
    });
  });

  return result;
}

