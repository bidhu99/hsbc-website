import {
    getMetadata
} from '../../scripts/aem.js';


export default async function decorate(block) {
    const customerSupportContainer = document.querySelector(".customersupport");
    const primaryFooterContainer = document.querySelector(".primary");
    const secondaryFooterContainer = document.querySelector(".secondary");
    if (customerSupportContainer == null && primaryFooterContainer == null && secondaryFooterContainer == null) {
        fetchNav(block, "/footer");
    } else {
        customerSupport();
        if (block.classList.contains("primary")) {
            primaryFooter();
        }
        if (block.classList.contains("secondary")) {
            secondaryFooter();
        }
    }
}

function customerSupportJson() {
    const container = document.querySelector('.customersupport');
    if (!container) return null;

    const children = container.children;

    const header = children[0].children[0].textContent.trim();
    const helpLink = children[0].children[1].textContent.trim();
    const description = children[0].children[2].textContent.trim();

    const platforms = [{
            platform: 'Facebook',
            iconClass: 'social-icon-facebook'
        },
        {
            platform: 'Twitter',
            iconClass: 'social-icon-twitter'
        },
        {
            platform: 'YouTube',
            iconClass: 'social-icon-youtube'
        }
    ];

    const socialLinks = Array.from(children)
        .slice(1)
        .map((el, index) => {
            const anchor = el.querySelector('a');
            return {
                platform: platforms[index].platform,
                url: anchor.getAttribute('href'),
                iconClass: platforms[index].iconClass,
                altText: `Follow HSBC UK on ${platforms[index].platform} This link will open in a new window`
            };
        });

    return {
        header,
        description,
        helpLink,
        socialLinks
    };
}

function customerSupport() {
    const supportData = customerSupportJson();
    if (supportData != null) {
        document.querySelectorAll('.socialMediaFooter.grid').forEach(el => el.remove());


        const container = document.createElement("div");
        container.className = "socialMediaFooter grid";
        container.innerHTML = `
        <div class="row social-row" id="content_socialmediafooter_1">
          <span class="A-DIVHL-RW-ALL"></span>

          <div class="sm-12 lg-9">
            <div id="content_link_6" class="link-container">
              <a class="A-LNKC22L-RW-ALL" href="${supportData.helpLink}" rel="nofollow" data-event-component="text link" data-event-name="Customer support">
                <h2 class="link link-header">${supportData.header}</h2>
                &nbsp;<span class="icon icon-chevron-right-small" aria-hidden="true"></span>
              </a>
            </div>
            <div class="A-PAR16R-RW-ALL">${supportData.description}</div>
          </div>

          <div class="sm-12 lg-3">
            <div class="right-column">
              ${supportData.socialLinks.map((link, i) => `
                <span class="social-link">
                  <a
                    class="social-image ${link.iconClass}"
                    id="content_socialmediafooterlink_${i + 1}"
                    href="${link.url}"
                    rel="noopener noreferrer"
                    data-event-component="other"
                    data-event-name="${link.platform} Icon"
                    target="_blank"
                  >
                    <span class="visuallyhidden">${link.altText}</span>
                  </a>
                </span>
              `).join("")}
            </div>
          </div>
        </div>
      `;

        // Append after <main>
        const mainTag = document.querySelector("main");
        if (mainTag) {
            mainTag.insertAdjacentElement("afterend", container);
        }
    }
}

function primaryFooter() {
    const footerItems = document.querySelectorAll('.footer.primary > div');
    const footerJSON = [];

    footerItems.forEach(item => {
        const divs = item.querySelectorAll('div');
        const title = divs[0]?.textContent.trim();
        const description = divs[2]?.textContent.trim();

        footerJSON.push({
            title,
            url: title, // or use divs[1]?.textContent.trim() if you want the actual URL
            description
        });
    });

    // Optional: remove any existing .footer-main blocks to prevent duplication
    document.querySelectorAll('.footer-main').forEach(el => el.remove());

    const iconMap = {
        "Help & support": "icon-phone",
        "Branch finder": "icon-location",
        "Our service performance": "icon-circle-info",
        "About HSBC": "icon-global"
    };

    const footerMain = document.createElement('div');
    footerMain.className = 'footer-main';
    footerMain.innerHTML = `
    <div class="grid">
      <div class="row wrapper">
        <nav aria-label="Footer navigation">
          <ul class="footer-large">
            ${footerJSON.map(item => `
              <li class="footer-large-item lg-3">
                <div class="footer-large-title">
                  <i class="icon ${iconMap[item.title] || ''}" aria-hidden="true"></i>
                  <h2 class="footer-section-title">${item.title}</h2>
                </div>
                <a href="${item.url}" data-event-component="footer" data-event-name="${item.description}">
                  <span class="visuallyhidden">Contact HSBC</span>
                  ${item.description}&nbsp;<i class="icon icon-chevron-right" aria-hidden="true"></i>
                </a>
              </li>
            `).join('')}
          </ul>
        </nav>
      </div>
    </div>
  `;

    // Insert into the DOM (after <main> or anywhere appropriate)
    const footerTag = document.querySelector('footer');
    if (footerTag) {
        footerTag.appendChild(footerMain);
    }
}

function secondaryFooter() {
    const footerSecondary = document.querySelector('.footer.secondary');
    const items = footerSecondary.querySelectorAll(':scope > div');

    const footerBottomJSON = {
        supplementaryLinks: [],
        groupInfo: {},
        copyright: '',
        countryNotice: {}
    };

    items.forEach((item, index) => {
        const divs = item.querySelectorAll('div, code');

        // Handle supplementary links (first 5 items)
        if (index < 5) {
            footerBottomJSON.supplementaryLinks.push({
                title: divs[0]?.textContent.trim(),
                url: divs[1]?.textContent.trim()
            });
        }

        // Handle HSBC Group info (6th item)
        else if (index === 5) {
            footerBottomJSON.groupInfo = {
                title: divs[0]?.textContent.trim(),
                url: divs[1]?.textContent.trim()
            };
        }

        // Handle copyright (7th item)
        else if (index === 6) {
            footerBottomJSON.copyright = divs[0]?.textContent.trim();
        }

        // Handle country notice (8th item)
        else if (index === 7) {
            footerBottomJSON.countryNotice = {
                text: divs[0]?.textContent.trim(),
                url: divs[1]?.textContent.trim()
            };
        }
    });

    // Remove existing .footer-bottom if present
    document.querySelectorAll('.footer-bottom').forEach(el => el.remove());

    // Create .footer-bottom
    const footerBottom = document.createElement('div');
    footerBottom.className = 'footer-bottom';
    footerBottom.innerHTML = `
    <div class="grid">
      <div class="row wrapper">
        <nav class="lg-7" aria-label="Footer navigation">
          <ul class="footer-supplementary clearfix">
            ${footerBottomJSON.supplementaryLinks.map(link => `
              <li class="footer-supplementary-item">
                <a href="${link.url}" rel="nofollow">${link.title}</a>
              </li>
            `).join('')}
          </ul>
        </nav>

        <div class="footer-legal-regulatory sm-12 lg-5 text">
          <p>
            <a href="${footerBottomJSON.groupInfo.url}" target="_blank" rel="noopener">
              <span aria-hidden="true">${footerBottomJSON.groupInfo.title}</span>
              <span class="visuallyhidden">${footerBottomJSON.groupInfo.title} This link will open in a new window</span>
            </a>
            ${footerBottomJSON.copyright}
          </p>
          <p>
            <a href="${footerBottomJSON.countryNotice.url}">${footerBottomJSON.countryNotice.text}</a>
          </p>
        </div>
      </div>
    </div>
  `;

    // Insert inside <footer>
    const footerTag = document.querySelector('footer');
    if (footerTag) {
        footerTag.appendChild(footerBottom);
    }
}

async function fetchNav(block, path) {
    try {
        const response = await fetch(`${path}.plain.html`);
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.status);
        }

        const data = await response.text();

        const container = document.querySelector('main .section');
        if (container != null) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = data;

            // Extract the .primaryheader div (removes the extra outer div)
            const customerSupportEl = tempDiv.querySelector('.customersupport');
            container.insertAdjacentHTML('beforeend', customerSupportEl.outerHTML);

            const primaryFooterEl = tempDiv.querySelector('.primary');
            container.insertAdjacentHTML('beforeend', primaryFooterEl.outerHTML);

            const secondaryFooterEl = tempDiv.querySelector('.secondary');
            container.insertAdjacentHTML('beforeend', secondaryFooterEl.outerHTML);

            customerSupport();
            primaryFooter();
            secondaryFooter();
        }

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}