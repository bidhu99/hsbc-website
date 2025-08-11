import { getMetadata } from "../../scripts/aem.js";
import { decorateMain } from "../../scripts/scripts.js";

export default function decorate(block) {
  if (block.classList.contains("two")) {
    fiftyFiftyColumnControl();
  }
}

function fiftyFiftyColumnControl(){
   const finalContainer = document.querySelectorAll("main .with-bg > .sm-12")[1];

   const mainContainer = document.createElement("div");
   mainContainer.className = "cc-wrapper O-COLCTRL-RW-DEV two-column-control";
   mainContainer.setAttribute("role", "region");

   const subContainer = document.createElement("div");
   subContainer.id = "pp_tools_columnControl_2";

   const columnControlContainer = document.createElement("div");
   columnControlContainer.className = "cc cc-columns-50-50";

   const firstColumn = document.createElement("div");
   firstColumn.className = "cc-column";
   firstColumn.id = "pp_tools_columnControlColumn_1";

    const secondColumn = document.createElement("div");
    secondColumn.className = "cc-column";
    secondColumn.id = "pp_tools_columnControlColumn_2";

    columnControlContainer.appendChild(firstColumn);
    columnControlContainer.appendChild(secondColumn);

    subContainer.appendChild(columnControlContainer);
    mainContainer.appendChild(subContainer);
    finalContainer.appendChild(mainContainer);
}