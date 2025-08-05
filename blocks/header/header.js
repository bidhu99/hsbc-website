import { getMetadata } from "../../scripts/aem.js";
import { decorateMain } from "../../scripts/scripts.js";

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

      const a = item.url
        ? document.createElement("a")
        : document.createElement("span"); // If URL exists, use anchor tag, else span tag
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
      span.innerHTML = item.url
        ? `<a href="${item.url}">${item.name}</a>`
        : item.name; // If URL exists, wrap name in anchor

      if (item?.name === "Log on") {
        span.className = "primary-button";
      }
      li.appendChild(span);
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

    const container = document.querySelector("main .text-container");
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
      extractHeaderData();
    }
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

function extractHeaderData() {
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
  });
  buildHeader(result);
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

    const titleSpan = document.createElement("span");
    titleSpan.className = "header-main-navigation-title";
    titleSpan.textContent = section.title;

    titleDiv.appendChild(titleSpan);
    navItem.appendChild(titleDiv);

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

    section.subsections.forEach((sub) => {
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

      group.appendChild(linkList);
      content.appendChild(group);
      col.appendChild(content);
      doormatRow.appendChild(col);
    });

    doormatMain.appendChild(doormatRow);
    doormatContainer.appendChild(doormatMain);
    doormat.appendChild(doormatContainer);
    navItem.appendChild(doormat);

    navList.appendChild(navItem);
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
