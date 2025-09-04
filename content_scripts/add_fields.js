const container = document.getElementsByClassName("package-header__left")[0];
const templateElement = container.querySelector(
  '[data-controller="clipboard"]'
);

templateElement.remove();

const templateValues = (() => {
  const headerTokens = container
    .querySelector("h1.package-header__name")
    .innerText.split(" ");

  return {
    name: headerTokens[0],
    version: headerTokens[1],
  };
})();

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

function addText(text) {
  text = text.replace(/{(\w+)}/g, (match, key) => {
    return templateValues[key] !== undefined ? templateValues[key] : match;
  });

  const element = duplicateElement(templateElement);
  element.querySelector("span").innerText = text;
  container.appendChild(element);
}

const templates = ["pip install {name}", "{name}~={version}"];
templates.forEach(addText);
