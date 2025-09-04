const container = document.getElementsByClassName("package-header__left")[0];
const templateElement = container.querySelector(
  '[data-controller="clipboard"]'
);

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

  // create clipboard source to show untrimmed version, but trim the copy value
  const clipboardSource = document.createElement("span");
  clipboardSource.setAttribute("data-clipboard-target", "source");
  clipboardSource.innerText = text.trim();
  clipboardSource.style.display = "none";
  element.appendChild(clipboardSource);

  const textElement = element.querySelector("span");
  textElement.innerText = text;
  textElement.removeAttribute("data-clipboard-target");
  textElement.style.whiteSpace = "preserve";
  container.appendChild(element);
}

function rightPadStrings(stringsArray) {
  if (!Array.isArray(stringsArray) || stringsArray.length === 0) {
    return [];
  }

  // Find the length of the longest string
  const maxLength = Math.max(...stringsArray.map((str) => str.length));

  // Right-pad each string to match the maxLength
  return stringsArray.map((str) => {
    return str.padEnd(maxLength, " ");
  });
}

let getting = browser.storage.sync.get("templates");
getting.then(({ templates }) => {
  templateElement.remove();

  const templateArray = rightPadStrings(
    templates || ["pip install {name}", "{name}~={version}"]
  );
  templateArray.forEach(addText);
}, console.error);
