import {
    getMetadata
} from '../../scripts/aem.js';
import {
    decorateMain,
} from '../../scripts/scripts.js';

export default function decorate(block) {
    fetchNav(block, "/nav");
}

// Function to generate the HTML
function generateHeader(leftData, rightData) {
    const headerContainer = document.createElement('div');
    headerContainer.classList.add('header-top-container', 'hide-on-mobile-and-tablet');

    const headerTop = document.createElement('div');
    headerTop.classList.add('header-top');

    const row = document.createElement('div');
    row.classList.add('row');

    const lg12 = document.createElement('div');
    lg12.classList.add('lg-12');

    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'product line');

    const ul = document.createElement('ul');
    ul.classList.add('header-top-navigation');

    // Generate navigation items based on the first data array (data)
    leftData.forEach((item, index) => {
        if (item.name) { // Only create the item if name is present
            const li = document.createElement('li');
            li.classList.add('header-top-navigation-item');
            if (index === 0) li.classList.add('is-active'); // Mark the first item as active

            const a = item.url ? document.createElement('a') : document.createElement('span'); // If URL exists, use anchor tag, else span tag
            if (item.url) {
                a.href = item.url;
                a.setAttribute('data-event-component', 'topnav');
                a.setAttribute('data-event-name', `${item.name.toLowerCase()} banking|component:top nav|position:${index + 1}`);
                a.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
                a.setAttribute('aria-label', `${item.name} ${index === 0 ? 'currently selected' : ''}`);
            }
            a.textContent = item.name;

            li.appendChild(a);
            ul.appendChild(li);
        }
    });

    nav.appendChild(ul);

    // Generate meta section for language and user options from the second data array (data2)
    const metaDiv = document.createElement('div');
    metaDiv.classList.add('header-top-meta');

    const dropdownContainer = document.createElement('div');
    dropdownContainer.classList.add('dropdown-container');

    const dropdownNav = document.createElement('nav');
    dropdownNav.setAttribute('aria-label', 'language');

    const dropdownUl = document.createElement('ul');

    // Generate language item (from data2)
    rightData.forEach((item) => {
        if (item.name) { // Only create the item if name is present
            const li = document.createElement('li');
            li.classList.add('header-dropdown', 'header-generic-dropdown');

            const span = document.createElement('span');
            span.innerHTML = item.url ? `<a href="${item.url}">${item.name}</a>` : item.name; // If URL exists, wrap name in anchor
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
    const existingHeader = document.querySelector('.header-top-container');
    if (existingHeader) {
        existingHeader.remove(); // Remove the existing header if it already exists
    }

    const oldNav = document.querySelector('.primaryheader-container');
    if (oldNav) oldNav.remove();
}

async function fetchNav(block, path) {
    try {
        const response = await fetch(`${path}.plain.html`);
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.status);
        }

        const data = await response.text();

        const container = document.querySelector('main .text-container');
        if (container != null) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = data;

            // Extract the .primaryheader div (removes the extra outer div)
            const primaryHeader = tempDiv.querySelector('.primaryheader');
            container.insertAdjacentHTML('beforeend', primaryHeader.outerHTML);

            const allBlocks = document.querySelectorAll('.primaryheader > div');

            const leftData = [];
            const rightData = [];

            allBlocks.forEach((block, index) => {
                const name = block.children[0]?.innerText.trim();
                const url = block.children[1]?.innerText.trim();

                const obj = {
                    name,
                    url
                };

                if (index < 4) {
                    leftData.push(obj);
                } else {
                    rightData.push(obj);
                }
            });

            appendHeader(leftData, rightData);
            block.appendChild(generateHeader(leftData, rightData));
        }

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}