const container = document.getElementById("template-container");
let currentIndex = -1;

let templateArray = [];

function createInput(index, value) {
  const label = document.createElement("label");
  label.setAttribute("index", index);
  label.classList.add("template-input");

  // Create the input element and set its attributes
  const input = document.createElement("input");
  input.type = "text";

  input.name = "template";
  if (value) {
    input.value = value;
  }
  input.placeholder = "enter new template";
  input.autocomplete = "given-name";

  // Assemble the DOM structure
  label.appendChild(input);
  return label;
}

function onInput(event) {
  const target = event.target;
  const typedValue = target.value;
  console.log("Typed value:", typedValue);
}

function update(index, value) {
  templateArray[index] = value;

  if (value !== "" && index === currentIndex) {
    addInput("");
  }

  if (value === "") {
    removeInput(index);
  }

  browser.storage.sync.set({
    templates: templateArray,
  });

  console.log(templateArray, index, value);
}

function removeInput(index) {
  templateArray.splice(index, 1);
  container.querySelector(`[index="${index}"]`).remove();

  Array.from(container.querySelectorAll("[index]")).forEach((element) => {
    const otherIndex = parseInt(element.getAttribute("index"));

    if (otherIndex > index) {
      element.setAttribute("index", otherIndex - 1);
    }
  });

  currentIndex--;
}

function addInput(value) {
  currentIndex++;

  const input = createInput(currentIndex, value);
  container.appendChild(input);

  let previousValue = value;
  input.querySelector("input").addEventListener("input", function (event) {
    const value = event.target.value;
    if (value !== previousValue) {
      if (previousValue === "") {
        templateArray.push("");
      }
      update(parseInt(input.getAttribute("index")), value);
    }
    previousValue = value;
  });
}

let getting = browser.storage.sync.get("templates");
getting.then(({ templates }) => {
  templateArray = templates || ["pip install {name}", "{name}~={version}"];
  console.log(templateArray);
  templateArray.forEach(addInput);
  addInput("");
}, console.error);
