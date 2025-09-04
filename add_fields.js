document.body.style.border = "5px solid red";

function duplicateElement(element, options = {}) {
  // Default options
  const {
    deepClone = true,
    insertAfterOriginal = false,
    insertBeforeOriginal = false,
    appendToParent = false,
    targetParent = null,
    clearIds = true,
    clearEventListeners = true,
  } = options;

  if (!element || !(element instanceof Element)) {
    throw new Error("Invalid element provided");
  }

  // Clone the element
  const clone = element.cloneNode(deepClone);

  // Handle IDs to avoid duplicates
  if (clearIds) {
    if (clone.id) clone.id = "";
    const elementsWithId = clone.querySelectorAll("[id]");
    elementsWithId.forEach((el) => (el.id = ""));
  }

  // Insert the clone based on options
  if (insertAfterOriginal && element.parentNode) {
    element.parentNode.insertBefore(clone, element.nextSibling);
  } else if (insertBeforeOriginal && element.parentNode) {
    element.parentNode.insertBefore(clone, element);
  } else if (appendToParent && element.parentNode) {
    element.parentNode.appendChild(clone);
  } else if (targetParent && targetParent instanceof Element) {
    targetParent.appendChild(clone);
  }

  return clone;
}

const container = document.getElementsByClassName("package-header__left")[0];
const templateElement = container.querySelector(
  '[data-controller="clipboard"]'
);

templateElement.remove();

function addText(text) {
  const element = duplicateElement(templateElement);
  element.querySelector("span").innerText = text;
  container.appendChild(element);
}

addText("gock <333");
addText("boobs <333");
addText("meow <333");
/*
const duplicated = duplicateElement(
  document.getElementsByClassName("package-header__pip-instructions")[0]
);
duplicated.querySelectorAll("span")[0].innerText = "gock <333";

container.appendChild(duplicated);
*/
