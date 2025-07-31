import { getMetadata } from "../../scripts/aem.js";

export default function decorate(block) {
  const items = document.querySelectorAll(".multilinks.block > div");
  const jsonData = [];

  items.forEach((item) => {
    const [titleEl, urlEl] = item.querySelectorAll("p");
    if (titleEl && urlEl) {
      jsonData.push({
        title: titleEl.textContent.trim(),
        url: urlEl.textContent.trim(),
      });
    }
  });

  let columnHtml = "";
  let colIndex = 1;
  let linkCounter = 1;

  for (let i = 0; i < jsonData.length; i += 2) {
    const left = jsonData[i];
    const right = jsonData[i + 1];

    let colContent = "";

    [left, right].forEach((item, j) => {
      if (item) {
        const blockId = linkCounter;
        const linkHtml = `
          <div class="M-SIMPLELINKS-DEV O-SMARTSPCGEN-DEV" role="region">
            <div id="hp_main_simplelinks_${blockId}">
              <ul class="links-list">
                <li>
                  <div id="hp_main_link_${blockId}" class="link-container">
                    <a class="A-LNKC28L-RW-ALL" href="${item.url}"
                       data-pid="PWS_UK_EN_DEFAULT_${colIndex}${
          j === 0 ? "A" : "B"
        }"
                       data-pid-action="Internal promotion click"
                       data-event-component="text link"
                       data-event-name="${item.title}">
                      <span class="link${
                        item.title.split(" ").length === 1 ? " one-word" : ""
                      }">${item.title}</span>
                      &nbsp;<span class="icon icon-chevron-right-small" aria-hidden="true"></span>
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        `;
        colContent += linkHtml;
        linkCounter++;
      }
    });

    columnHtml += `
      <div id="hp_main_columnControlColumn_${colIndex}" class="cc-column">
        ${colContent}
      </div>
    `;
    colIndex++;
  }

  // Wrap everything
  const finalHtml = `
  <div class="grid">
  <div class="row with-bg">
            <div class="sm-12">
  <div class="cc-wrapper O-COLCTRL-RW-DEV" role="region">
    <div id="hp_main_columnControl_1">
      <div class="cc cc-columns-25-25-25-25">
        ${columnHtml}
      </div>
    </div>
  </div>
  </div>
  </div>
  </div>
  `;

  const mainTag = document.querySelector("main");
  if (mainTag) {
    mainTag.insertAdjacentHTML("beforeend", finalHtml);
  } else {
    console.warn("<main> tag not found.");
  }

  const oldNav = document.querySelector(".multilinks-container");
  if (oldNav) oldNav.remove();
}
