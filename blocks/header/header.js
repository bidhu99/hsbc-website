import {
    getMetadata
} from "../../scripts/aem.js";
import {
    decorateMain
} from "../../scripts/scripts.js";

export default function decorate(block) {
    fetchNav(block, "/nav");
}

// Function to generate the HTML
function generateHeader(leftData, rightData) {
    const headerContainer = document.createElement("div");
    headerContainer.classList.add(
        "header-top-container",
        "hide-on-mobile-and-tablet"
    );

    const headerTop = document.createElement("div");
    headerTop.classList.add("header-top");

    const row = document.createElement("div");
    row.classList.add("row");

    const lg12 = document.createElement("div");
    lg12.classList.add("lg-12");

    const nav = document.createElement("nav");
    nav.setAttribute("aria-label", "product line");

    const ul = document.createElement("ul");
    ul.classList.add("header-top-navigation");

    // Generate navigation items based on the first data array (data)
    leftData.forEach((item, index) => {
        if (item.name) {
            // Only create the item if name is present
            const li = document.createElement("li");
            li.classList.add("header-top-navigation-item");
            if (index === 0) li.classList.add("is-active"); // Mark the first item as active

            const a = item.url ?
                document.createElement("a") :
                document.createElement("span"); // If URL exists, use anchor tag, else span tag
            if (item.url) {
                a.href = item.url;
                a.setAttribute("data-event-component", "topnav");
                a.setAttribute(
                    "data-event-name",
                    `${item.name.toLowerCase()} banking|component:top nav|position:${
            index + 1
          }`
                );
                a.setAttribute("aria-selected", index === 0 ? "true" : "false");
                a.setAttribute(
                    "aria-label",
                    `${item.name} ${index === 0 ? "currently selected" : ""}`
                );
            }
            a.textContent = item.name;

            li.appendChild(a);
            ul.appendChild(li);
        }
    });

    nav.appendChild(ul);

    // Generate meta section for language and user options from the second data array (data2)
    const metaDiv = document.createElement("div");
    metaDiv.classList.add("header-top-meta");

    const dropdownContainer = document.createElement("div");
    dropdownContainer.classList.add("dropdown-container");

    const dropdownNav = document.createElement("nav");
    dropdownNav.setAttribute("aria-label", "language");

    const dropdownUl = document.createElement("ul");

    // Generate language item (from data2)
    rightData.forEach((item) => {
        if (item.name) {
            // Only create the item if name is present
            const li = document.createElement("li");
            li.classList.add("header-dropdown", "header-generic-dropdown");

            const span = document.createElement("span");
            span.innerHTML = item.url ?
                `<a href="${item.url}">${item.name}</a>` :
                item.name; // If URL exists, wrap name in anchor

            if (item?.name === "Log on") {
                span.className = "primary-button";
            }
            li.appendChild(span);
            const registerIconSpan = document.createElement("span");
            registerIconSpan.className = "icon icon-chevron-right-small icon-chevron-down-small";
            registerIconSpan.setAttribute("aria-hidden", "true");
            if (item?.name === "Register") {
                li.appendChild(registerIconSpan);
            }
            dropdownUl.appendChild(li);
        }
    });

    // Add the generated dropdown items to the dropdownNav
    dropdownNav.appendChild(dropdownUl);
    dropdownContainer.appendChild(dropdownNav);
    metaDiv.appendChild(dropdownContainer);

    // Append everything to the main container
    lg12.appendChild(nav);
    lg12.appendChild(metaDiv);
    row.appendChild(lg12);
    headerTop.appendChild(row);
    headerContainer.appendChild(headerTop);

    return headerContainer;
}

// Function to append the header only once
function appendHeader(leftData, rightData) {
    // Check if the header already exists
    const existingHeader = document.querySelector(".header-top-container");
    if (existingHeader) {
        existingHeader.remove(); // Remove the existing header if it already exists
    }

    const oldNav = document.querySelector(".primaryheader-container");
    if (oldNav) oldNav.remove();
}

async function fetchNav(block, path) {
    try {
        const response = await fetch(`${path}.plain.html`);
        if (!response.ok) {
            throw new Error("Network response was not ok: " + response.status);
        }

        const data = await response.text();

        const container = document.querySelector("main .section");
        if (container != null) {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = data;

            // Extract the .primaryheader div (removes the extra outer div)
            const primaryHeader = tempDiv.querySelector(".primaryheader");
            const mainHeader = tempDiv.querySelector(".header");
            container.insertAdjacentHTML("beforeend", primaryHeader.outerHTML);
            container.insertAdjacentHTML("beforeend", mainHeader.outerHTML);

            const allBlocks = document.querySelectorAll(".primaryheader > div");

            const leftData = [];
            const rightData = [];

            allBlocks.forEach((block, index) => {
                const name = block.children[0]?.innerText.trim();
                const url = block.children[1]?.innerText.trim();

                const obj = {
                    name,
                    url,
                };

                if (index < 4) {
                    leftData.push(obj);
                } else {
                    rightData.push(obj);
                }
            });

            appendHeader(leftData, rightData);
            block.appendChild(generateHeader(leftData, rightData));
            extractHeaderData(leftData);
            offerBarData();
        }
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
    }
}

function extractHeaderData(leftData) {
    const parent = document.querySelector("main .section .header");
    const firstLevelDivs = Array.from(parent.children).filter(
        (child) => child.tagName === "DIV"
    );

    const result = {
        logo: {
            image: {},
        },
        sections: [],
    };
    let section = {};
    let subSections = [];
    let subSection = {};
    let links = [];
    let link = {};

    firstLevelDivs.forEach((block, index) => {
        if (block.querySelector("img") != null) {
            const imageBlock = block.querySelector("img");
            const image = {};
            result.logo.image = {
                alt: imageBlock.getAttribute("alt") || "",
                src: imageBlock.getAttribute("src"),
                width: parseInt(imageBlock.getAttribute("width")) || null,
                height: parseInt(imageBlock.getAttribute("height")) || null,
            };
        }
        const childNodeArray = Array.from(block.children).filter(
            (child) => child.tagName === "DIV"
        );
        if (childNodeArray.length == 6) {
            if (links.length > 0) {
                subSection.links = links;
                subSections.push(subSection);
                links = [];
                subSection = {};
            }
            if (Object.keys(section).length > 0) {
                section.subsections = subSections;
                result.sections.push(section);
                section = {};
                subSections = [];
            }
            childNodeArray.forEach((childBlock, index) => {
                if (index == 0) {
                    const title = readDataFromParagraphTag(childBlock);
                    section.title = title;
                }
                if (index == 1) {
                    const subTitle = readDataFromParagraphTag(childBlock);
                    section.subTitle = subTitle;
                }
                if (index == 2) {
                    const title = readDataFromParagraphTag(childBlock);
                    subSection.title = title;
                }

                if (index == 3) {
                    const url = childBlock.querySelector("a")?.getHTML().trim() || "";
                    subSection.url = url;
                }

                if (index == 4) {
                    const title = readDataFromParagraphTag(childBlock);
                    if (title !== "") {
                        link.title = title;
                    }
                }

                if (index == 5) {
                    const url = childBlock.querySelector("a")?.getHTML().trim() || "";
                    if (url !== "") {
                        link.url = url;
                    }
                }
                if (Object.keys(link).length > 1) {
                    links.push(link);
                    link = {};
                }
            });
        }
        if (childNodeArray.length == 2) {
            childNodeArray.forEach((childBlock, index) => {
                if (index == 0) {
                    const title = readDataFromParagraphTag(childBlock);
                    if (title !== "") {
                        link.title = title;
                    }
                }

                if (index == 1) {
                    const url = childBlock.querySelector("a")?.getHTML().trim() || "";
                    if (url !== "") {
                        link.url = url;
                    }
                }
                if (Object.keys(link).length > 1) {
                    links.push(link);
                    link = {};
                }
            });
        }
        if (childNodeArray.length == 4) {
            if (links.length > 0) {
                subSection.links = links;
                subSections.push(subSection);
                links = [];
                subSection = {};
            }
            childNodeArray.forEach((childBlock, index) => {
                if (index == 0) {
                    const title = readDataFromParagraphTag(childBlock);
                    subSection.title = title;
                }

                if (index == 1) {
                    const url = childBlock.querySelector("a")?.getHTML().trim() || "";
                    subSection.url = url;
                }

                if (index == 2) {
                    const title = readDataFromParagraphTag(childBlock);
                    if (title !== "") {
                        link.title = title;
                    }
                }

                if (index == 3) {
                    const url = childBlock.querySelector("a")?.getHTML().trim() || "";
                    if (url !== "") {
                        link.url = url;
                    }
                }
                if (Object.keys(link).length > 1) {
                    links.push(link);
                    link = {};
                }
            });
        }
        if (firstLevelDivs.length == index + 1) {
            if (links.length > 0) {
                subSection.links = links;
                subSections.push(subSection);
                links = [];
                subSection = {};
            }
            if (Object.keys(section).length > 0) {
                section.subsections = subSections;
                result.sections.push(section);
                section = {};
                subSections = [];
            }
        }
    });
    buildHeader(result);
    buildMobileHeader(result,leftData);
}

function readDataFromParagraphTag(childBlock) {
    const pTag = childBlock.querySelector("p");
    const htmlContent =
        (pTag ? pTag.innerHTML : childBlock.innerHTML)?.trim() || "";
    return htmlContent;
}

function buildHeader(data) {
    const header = document.querySelector("header"); // Get the existing <header> tag
    if (!header) {
        console.error("No <header> tag found in the document.");
        return;
    }

    const headerTopContainer = document.querySelector(".header-top-container");

    header.className = "";
    header.className = "header grid header-no-patternlab";

    const headerWrapperMain = document.createElement("div");
    headerWrapperMain.className = "header-wrapper-main";

    const headerNavWrapper = document.createElement("div");
    headerNavWrapper.className = "header-nav-wrapper";

    const container = document.createElement("div");
    container.className = "header-main-container hide-on-mobile-and-tablet";

    const row = document.createElement("div");
    row.className = "row wrapper";

    const headerMain = document.createElement("div");
    headerMain.className = "header-main";

    // Logo
    const logoDiv = document.createElement("div");
    logoDiv.className = "header-logo lg-2";

    const logoLink = document.createElement("a");
    logoLink.href = "/";

    const logoImg = document.createElement("img");
    logoImg.src = data.logo.image.src;
    logoImg.alt = data.logo.image.alt;
    logoImg.width = data.logo.image.width;
    logoImg.height = data.logo.image.height;

    logoLink.appendChild(logoImg);
    logoDiv.appendChild(logoLink);
    row.appendChild(logoDiv);

    // Navigation
    const nav = document.createElement("nav");
    nav.className = "header-main-navigation lg-10";
    nav.setAttribute("aria-label", "main navigation");

    const navList = document.createElement("ul");
    navList.className = "row";

    data.sections.forEach((section, index) => {
        const navItem = document.createElement("li");
        navItem.className = "header-main-navigation-item";
        navItem.tabIndex = 0;

        const titleDiv = document.createElement("div");
        titleDiv.className = `header-mobile-doormat-${index} header-doormat-mobile-title sidebar-submenu-trigger`;
        titleDiv.dataset.target = `header-doormat-${index}`;

        const iconSpan = document.createElement("span");
        iconSpan.className = "icon icon-banking hide-on-desktop";
        iconSpan.setAttribute("aria-hidden", "true");
        titleDiv.appendChild(iconSpan);

        const titleSpan = document.createElement("span");
        titleSpan.className = "header-main-navigation-title";
        titleSpan.textContent = section.title;

        titleDiv.appendChild(titleSpan);
        navItem.appendChild(titleDiv);

        const iconRightSpan = document.createElement("span");
        iconRightSpan.className = "icon icon-chevron-right hide-on-desktop";
        iconRightSpan.setAttribute("aria-hidden", "true");
        titleDiv.appendChild(iconRightSpan);

        const subtitleSpan = document.createElement("span");
        subtitleSpan.className = "header-main-navigation-subtitle";
        subtitleSpan.textContent = decodeHTMLEntities(section.subTitle);
        titleDiv.appendChild(subtitleSpan);

        // Doormat dropdown
        const doormat = document.createElement("div");
        doormat.className = "doormat-menu";
        doormat.dataset.source = `header-doormat-${index}`;
        doormat.setAttribute("aria-hidden", "true");

        const doormatContainer = document.createElement("div");
        doormatContainer.className = "doormat-container row";

        const doormatMain = document.createElement("div");
        doormatMain.className = "doormat-main sm-12 lg-9";

        const doormatRow = document.createElement("div");
        doormatRow.className = "row";

        section.subsections.forEach((sub, indx) => {
            const col = document.createElement("div");
            col.className = "doormat-main-column sm-12 lg-4";

            const content = document.createElement("div");
            content.className = "doormat-column-content";

            const group = document.createElement("div");
            group.className = "links-group";

            const subLink = document.createElement("a");
            subLink.href = sub.url || "#";
            subLink.className = "doormat-heading-link";

            const subHeading = document.createElement("h2");
            subHeading.className = "doormat-heading";
            subHeading.textContent = sub.title;

            subLink.appendChild(subHeading);
            group.appendChild(subLink);

            const linkList = document.createElement("ul");
            linkList.className = "doormat-links";

            sub.links.forEach((link) => {
                const li = document.createElement("li");
                const a = document.createElement("a");
                a.href = link.url;
                a.textContent = link.title;
                li.appendChild(a);
                linkList.appendChild(li);
            });

            if (section.subsections.length - 1 === indx) {
                const colHighlight = document.createElement("div");
                colHighlight.className = "doormat-highlight sm-12 lg-3";

                const highlightMenu = document.createElement("div");
                highlightMenu.className = "doormat-highlight-menu";

                content.className = "";

                group.appendChild(linkList);
                content.appendChild(group);
                highlightMenu.appendChild(content);
                colHighlight.appendChild(highlightMenu);
                doormatRow.appendChild(colHighlight);
            } else {
                group.appendChild(linkList);
                content.appendChild(group);
                col.appendChild(content);
                doormatRow.appendChild(col);
            }
        });

        doormatMain.appendChild(doormatRow);
        doormatContainer.appendChild(doormatMain);
        doormat.appendChild(doormatContainer);
        navItem.appendChild(doormat);
        navList.appendChild(navItem);

        const colHighlight = doormatRow.querySelector(".doormat-highlight");
        doormatContainer.appendChild(colHighlight);
    });

    nav.appendChild(navList);
    row.appendChild(nav);
    headerMain.appendChild(row);
    container.appendChild(headerMain);
    headerNavWrapper.appendChild(headerTopContainer);
    headerNavWrapper.appendChild(container);
    headerWrapperMain.appendChild(headerNavWrapper);
    header.appendChild(headerWrapperMain);
}

function decodeHTMLEntities(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

function buildMobileHeader(headerData,leftData) {

    // Get the <header> element
    const header = document.querySelector('header .header-wrapper-main .header-nav-wrapper');
    if (!header) {
        console.error('No <header> tag found in the document.');
    }

    const mainContainer = document.createElement('div');
    mainContainer.className = "header-mobile";

    const topContainer = document.createElement('div');
    topContainer.className = "header-mobile-top hide-on-desktop";


    const overLayContainer = document.createElement('div');
    overLayContainer.className = "header-mobile-overlay";
    overLayContainer.setAttribute('aria-hidden', 'true');
    overLayContainer.setAttribute('style', 'top: 52.8px;');

    const buttonContainer = document.createElement('button');
    buttonContainer.className = "header-sidebar-trigger";
    buttonContainer.setAttribute('aria-label', 'Open menu');
    buttonContainer.setAttribute('data-aria-label-open-menu', 'Open menu');
    buttonContainer.setAttribute('data-aria-label-close-menu', 'Close menu');

    const buttonSpan = document.createElement('span');
    buttonSpan.className = "icon icon-menu";
    buttonContainer.setAttribute('aria-hidden', 'true');
    buttonContainer.appendChild(buttonSpan);

    const buttonSliderSpan = document.createElement('span');
    buttonSpan.className = "header-sidebar-trigger-text";
    buttonContainer.textContent = "Menu";
    buttonContainer.appendChild(buttonSliderSpan);
    topContainer.appendChild(buttonContainer);

    // === 1. Render the Logo ===
    const logoDiv = document.createElement('div');
    logoDiv.className = 'header-mobile-logo';

    const logoSpan = document.createElement('apan');

    const logoImg = document.createElement('img');
    logoImg.src = headerData.logo.image.src;
    logoImg.alt = headerData.logo.image.alt || '';
    logoImg.width = headerData.logo.image.width;
    logoImg.height = headerData.logo.image.height;

    logoSpan.appendChild(logoImg);
    logoDiv.appendChild(logoSpan);

    const navContainer = document.createElement('nav');
    navContainer.className = "header-mobile-sidebar hide-on-desktop";
    navContainer.id = "sidebar";

    const divInsideNav = document.createElement('div');
    divInsideNav.className = "header-mobile-sidebar-content";

    const closeSubMenuContainer = document.createElement('div');
    closeSubMenuContainer.className = "close-submenu-trigger hidden";
    closeSubMenuContainer.setAttribute('role', 'button');
    closeSubMenuContainer.setAttribute('tabindex', '0');
    closeSubMenuContainer.setAttribute('aria-label', 'Close Submenu');

    const closeSubMenuSpan = document.createElement('span');
    closeSubMenuSpan.className = "icon icon-chevron-left";
    closeSubMenuSpan.setAttribute('aria-hidden', 'true');
    closeSubMenuContainer.appendChild(closeSubMenuSpan);
    divInsideNav.appendChild(closeSubMenuContainer);


    // === 2. Create the mobile nav menu container ===
    const ul = document.createElement('ul');
    ul.className = 'header-mobile-doormat';
    ul.setAttribute('role', 'menubar');

    // === 3. Loop through each section ===
    headerData.sections.forEach((section, sectionIndex) => {
        const li = document.createElement('li');
        li.className = 'header-main-navigation-item';
        li.setAttribute('role', 'presentation');

        // Submenu trigger
        const triggerDiv = document.createElement('div');
        triggerDiv.className = `header-mobile-doormat-${sectionIndex} header-doormat-mobile-title sidebar-submenu-trigger`;
        triggerDiv.setAttribute('data-target', `header-doormat-${sectionIndex}`);
        triggerDiv.setAttribute('tabindex', '0');
        triggerDiv.setAttribute('role', 'menuitem');
        triggerDiv.setAttribute('aria-haspopup', 'true');

        const individualIconSpan = document.createElement('span');
        if(sectionIndex == 0){
          individualIconSpan.className = "icon icon-banking hide-on-desktop";
        }else if(sectionIndex == 1){
          individualIconSpan.className = "icon icon-borrowing hide-on-desktop";
        }else if(sectionIndex == 2){
          individualIconSpan.className = "icon icon-investment hide-on-desktop";
        }else if(sectionIndex == 3){
          individualIconSpan.className = "icon icon-insurance hide-on-desktop";
        }else if(sectionIndex == 4){
          individualIconSpan.className = "icon icon-health hide-on-desktop";
        }else if(sectionIndex == 5){
          individualIconSpan.className = "icon icon-help hide-on-desktop";
        }
        individualIconSpan.setAttribute("aria-hidden","true");
        triggerDiv.appendChild(individualIconSpan);

        const titleSpan = document.createElement('span');
        titleSpan.className = 'header-main-navigation-title';
        titleSpan.textContent = section.title;
        triggerDiv.appendChild(titleSpan);

        const individualIconDesktopSpan = document.createElement('span');
        individualIconDesktopSpan.className = "icon icon-chevron-right hide-on-desktop";
        individualIconDesktopSpan.setAttribute("aria-hidden","true");
        triggerDiv.appendChild(individualIconSpan);

        const subTitleSpan = document.createElement('span');
        subTitleSpan.className = 'header-main-navigation-subtitle';
        subTitleSpan.innerHTML = section.subTitle;
        triggerDiv.appendChild(subTitleSpan);

        li.appendChild(triggerDiv);

        // === Submenu structure ===
        const submenuDiv = document.createElement('div');
        submenuDiv.className = 'doormat-menu';
        submenuDiv.setAttribute('aria-hidden', 'true');
        submenuDiv.setAttribute('data-source', `header-doormat-${sectionIndex}`);
        submenuDiv.setAttribute('tabindex', '0');

        const containerDiv = document.createElement('div');
        containerDiv.className = 'doormat-container row';

        const mainDiv = document.createElement('div');
        mainDiv.className = 'doormat-main sm-12 lg-9';

        const rowDiv = document.createElement('div');
        rowDiv.className = 'row';

        section.subsections.forEach(subsection => {
            const columnDiv = document.createElement('div');
            columnDiv.className = 'doormat-main-column sm-12 lg-4';

            const contentDiv = document.createElement('div');
            contentDiv.className = 'doormat-column-content';

            const groupDiv = document.createElement('div');
            groupDiv.className = 'links-group';

            // Subsection title
            if (subsection.url) {
                const h2Link = document.createElement('a');
                h2Link.href = subsection.url;
                h2Link.className = 'doormat-heading-link';

                const h2 = document.createElement('h2');
                h2.className = 'doormat-heading';
                h2.textContent = subsection.title;

                h2Link.appendChild(h2);
                groupDiv.appendChild(h2Link);
            } else {
                const h2 = document.createElement('h2');
                h2.className = 'doormat-heading';
                h2.textContent = subsection.title;
                groupDiv.appendChild(h2);
            }

            // Subsection links
            const ulLinks = document.createElement('ul');
            ulLinks.className = 'doormat-links';

            subsection.links.forEach(link => {
                const linkLi = document.createElement('li');
                const linkA = document.createElement('a');
                linkA.href = link.url;
                linkA.setAttribute('aria-label', link.title);
                linkA.textContent = link.title;
                linkLi.appendChild(linkA);
                ulLinks.appendChild(linkLi);
            });

            groupDiv.appendChild(ulLinks);
            contentDiv.appendChild(groupDiv);
            columnDiv.appendChild(contentDiv);
            rowDiv.appendChild(columnDiv);
        });

        mainDiv.appendChild(rowDiv);
        containerDiv.appendChild(mainDiv);
        submenuDiv.appendChild(containerDiv);
        li.appendChild(submenuDiv);

        ul.appendChild(li);
    });

    const singleRedirectionContainer = document.createElement('div');
    singleRedirectionContainer.className = 'header-mobile-sidebar-footer header-dropdown';

    const businessLinkUl = document.createElement('ul');
    businessLinkUl.className = "header-mobile-business-links";

    leftData.forEach((businessLink,businessIndex) => {
      const individualBusinessLink = document.createElement('li');

      const businessLinkAnchor = document.createElement('a');
      businessLinkAnchor.className = "header-mobile-business-item register-button";
      businessLinkAnchor.href = businessLink.url;
      businessLinkAnchor.text = businessLink.name;
      businessLinkAnchor.setAttribute('data-event-component', "topnav");
      businessLinkAnchor.setAttribute('data-event-name', businessLink.name);

      const iconSpanContainer = document.createElement('span');
      iconSpanContainer.className = "icon icon-chevron-right icon-chevron-down-small";
      iconSpanContainer.setAttribute('aria-hidden', "true");

      businessLinkAnchor.appendChild(iconSpanContainer);
      individualBusinessLink.appendChild(businessLinkAnchor);
      businessLinkUl.appendChild(individualBusinessLink);
    });
    singleRedirectionContainer.appendChild(businessLinkUl);

    divInsideNav.appendChild(ul);
    divInsideNav.appendChild(singleRedirectionContainer);
    navContainer.appendChild(divInsideNav);
    topContainer.appendChild(navContainer);
    topContainer.appendChild(overLayContainer);
    topContainer.appendChild(logoDiv);
    mainContainer.appendChild(topContainer);
    header.appendChild(mainContainer);
}

function offerBarData(){
  const offerbarRoot = document.querySelector('.offerbar-wrapper .offerbar');
  const codeElements = offerbarRoot.querySelectorAll('code');

  const bannerJSON = {
    banner: {
      message: codeElements[0]?.textContent.trim() || '',
      link: {
        href: codeElements[3]?.textContent.trim() || '',
        text: codeElements[1]?.textContent.trim() || '',
        visuallyHiddenText: codeElements[2]?.textContent.trim() || ''
      }
    }
  };
  offerBar(bannerJSON);
}

function offerBar(bannerData){
  const header = document.querySelector('header .header-wrapper-main .header-nav-wrapper');

    const headerWrapperMain = document.createElement("div");
    headerWrapperMain.className = "header-wrapper-main";

    const wrapper = document.createElement("div");
    wrapper.className = "O-PINBANNER-RW-ALL";
    wrapper.setAttribute("aria-hidden", "false");
    wrapper.style.bottom = "-84.6px";

    wrapper.innerHTML = `
      <div class="grid">
        <div class="row">
          <div id="pp_intro_pinnedBanner_1" class="pinned-wrapper sm-12">
            <div class="A-PINBANNER-TITLE-RW-ALL text-container text">
              ${bannerData.banner.message}
            </div>
            <div class="action-buttons">
              <div class="secondary-button">
                <div>
                  <a class="A-BTNPINSEC-RW-ALL"
                     href="${bannerData.banner.link.href}"
                     target="_self"
                     id="pp_intro_button_2"
                     data-event-component="button"
                     data-event-name="find out more|component:pin banner|position:1">
                    <span aria-hidden="true">${bannerData.banner.link.text}</span>
                    <span class="visuallyhidden">${bannerData.banner.link.visuallyHiddenText}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    header.appendChild(wrapper);
}