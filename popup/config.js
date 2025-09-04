const container = document.getElementById("template-container");
let currentIndex = -1;

function createInput(index) {
  const label = document.createElement("label");
  label.setAttribute("index", index);
  label.classList.add("template-input");

  // Create the input element and set its attributes
  const input = document.createElement("input");
  input.name = "template";
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
  console.log(index, value);

  if (value !== "" && index === currentIndex) {
    addInput();
  }

  if (value === "") {
    removeInput(index);
  }
}

function removeInput(index) {
  container.querySelector(`[index="${index}"]`).remove();

  Array.from(container.querySelectorAll("[index]")).forEach((element) => {
    const otherIndex = parseInt(element.getAttribute("index"));

    if (otherIndex > index) {
      element.setAttribute("index", otherIndex - 1);
    }
  });
}

function addInput() {
  currentIndex++;

  lastInput = createInput(currentIndex);
  container.appendChild(lastInput);

  let previousValue = "";
  lastInput.querySelector("input").addEventListener("input", function (event) {
    const value = event.target.value;
    if (value !== previousValue) {
      update(parseInt(event.target.getAttribute("index")), value);
    }
    previousValue = value;
  });
}

addInput();
