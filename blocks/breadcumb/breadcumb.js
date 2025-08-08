import { getMetadata } from "../../scripts/aem.js";
import { decorateMain } from "../../scripts/scripts.js";

export default function decorate(block) {
  const breadcrumbJSON = parseBreadcrumbs();
  renderBreadcrumbs(breadcrumbJSON);
}


function parseBreadcrumbs() {
    const breadcrumbDivs = document.querySelectorAll('.breadcumb > div');
    const breadcrumbs = [];

    breadcrumbDivs.forEach((div, index) => {
        const textEl = div.querySelector('div:nth-child(1) p strong');
        const linkEl = div.querySelector('div:nth-child(2) a');

        const name = textEl ? textEl.textContent.trim() : '';
        const href = linkEl ? new URL(linkEl.getAttribute('href')).pathname : '';
        const isCurrent = !linkEl;

        breadcrumbs.push({
            id: `pp_link_${index + 3}`, // matches your target IDs
            name: name,
            href: isCurrent ? null : href,
            class: isCurrent ? 'A-TYP16B-RW-ALL' : 'A-LNKC16R-RW-ALL',
            iconClass: isCurrent ? null : 'icon icon-chevron-right-small',
            position: index + 1,
            isCurrent: isCurrent,
            spanClass: name === 'Products' ? 'link one-word' : 'link',
            ariaLabel: isCurrent ? name : null
        });
    });

    return {
        wrapper: {
            rowClass: "row",
            leftColClass: "lg-9 md-10 hide-on-mobile",
            rightColClass: "lg-3 md-2 sm-12",
            navClass: "O-BRDCRUM-RW-ALL sm-12",
            olClass: "breadcrumbs-list O-SMARTSPCGEN-DEV"
        },
        breadcrumbs: breadcrumbs
    };
}

function renderBreadcrumbs(data) {
    const mainWrapper = document.querySelectorAll("main .with-bg > .sm-12")[0];

    const wrapperDiv = document.createElement('div');
    wrapperDiv.className = data.wrapper.rowClass;

    const leftCol = document.createElement('div');
    leftCol.className = data.wrapper.leftColClass;

    const innerRow = document.createElement('div');
    innerRow.className = "row hide-on-mobile";

    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'You are here');
    nav.className = data.wrapper.navClass;

    const ol = document.createElement('ol');
    ol.setAttribute('itemscope', '');
    ol.setAttribute('itemtype', 'http://schema.org/BreadcrumbList');
    ol.setAttribute('role', 'list');
    ol.className = data.wrapper.olClass;

    // Loop through each breadcrumb
    data.breadcrumbs.forEach(b => {
        const li = document.createElement('li');
        li.className = 'item';
        li.setAttribute('role', 'listitem');
        li.setAttribute('itemscope', '');
        li.setAttribute('itemprop', 'itemListElement');
        li.setAttribute('itemtype', 'http://schema.org/ListItem');

        if (!b.isCurrent) {
            const div = document.createElement('div');
            div.id = b.id;
            div.className = 'link-container';

            const a = document.createElement('a');
            a.className = b.class;
            a.href = b.href;
            a.setAttribute('itemprop', 'item');
            a.setAttribute('itemtype', 'http://schema.org/Thing');

            const spanName = document.createElement('span');
            spanName.setAttribute('itemprop', 'name');
            spanName.className = b.spanClass;
            spanName.textContent = b.name;

            const nbsp = document.createTextNode('\u00A0');

            const iconSpan = document.createElement('span');
            iconSpan.className = b.iconClass;
            iconSpan.setAttribute('aria-hidden', 'true');

            a.appendChild(spanName);
            a.appendChild(nbsp);
            a.appendChild(iconSpan);
            div.appendChild(a);
            li.appendChild(div);
        } else {
            const spanOuter = document.createElement('span');
            spanOuter.className = b.class;
            spanOuter.setAttribute('aria-current', 'page');
            spanOuter.setAttribute('aria-label', b.ariaLabel);

            const spanName = document.createElement('span');
            spanName.setAttribute('itemprop', 'name');
            spanName.textContent = b.name;

            spanOuter.appendChild(spanName);
            li.appendChild(spanOuter);
        }

        const meta = document.createElement('meta');
        meta.setAttribute('itemprop', 'position');
        meta.setAttribute('content', b.position);

        li.appendChild(meta);
        ol.appendChild(li);
    });

    nav.appendChild(ol);
    innerRow.appendChild(nav);
    leftCol.appendChild(innerRow);

    const rightCol = document.createElement('div');
    rightCol.className = data.wrapper.rightColClass;

    wrapperDiv.appendChild(leftCol);
    wrapperDiv.appendChild(rightCol);

    mainWrapper.appendChild(wrapperDiv);
    return wrapperDiv;
}

