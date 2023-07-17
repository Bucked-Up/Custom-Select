const removeNodesExceptLast = (father) => {
  while (father.childNodes.length > 1) {
    father.removeChild(father.firstChild);
  }
};

const removeNone = (array) => {
  array.forEach((item) => {
    item.style.display = "";
  });
};

const selectOption = (
  select,
  customSelectName,
  customOption,
  customSelectOptions,
  option
) => {
  select.value = option.value;
  select.dispatchEvent(customSelectChangeEvent);
  if (!select.hasAttribute("no-arrow")) {
    removeNodesExceptLast(customSelectName);
    customSelectName.insertAdjacentHTML("afterbegin", customOption.innerHTML);
  } else customSelectName.innerHTML = customOption.innerHTML;
  removeNone(customSelectOptions.querySelectorAll(".custom-select__option"));
  customOption.style.display = "none";
};

const createCustomOption = (option) => {
  let customOption = document.createElement("div");
  customOption.innerHTML = option.innerHTML;
  customOption.classList.add("custom-select__option");
  customOption.setAttribute("role", "button");
  customOption.setAttribute("value", option.getAttribute("value"));
  customOption.setAttribute("tabindex", "1");
  let image = document.querySelector(`[custom-option-img='${option.id}']`);
  image ? (image.style.display = "none") : "";
  customOption.innerHTML = image
    ? image.innerHTML + option.innerHTML
    : option.innerHTML;
  return customOption;
};

const customSelectChangeEvent = new Event("change");
const selectChangeEvent = new Event("directChange");

const caretDown =
  '<svg class=custom-select__icon width="10" height="5" viewBox="0 0 10 5" xmlns="http://www.w3.org/2000/svg"><path d="M5 5L0 0H10L5 5Z"/></svg>';

const updateSelect = (select) => {
  const customSelectOptions = document.querySelector(
    `[original-id="${select.id}"] .custom-select__options`
  );
  const customSelectName = document.querySelector(
    `[original-id="${select.id}"] .custom-select__name`
  );
  const options = select.querySelectorAll("option");
  customSelectOptions.innerHTML = "";
  options.forEach((option) => {
    let customOption = createCustomOption(option);
    customOption.addEventListener("keydown", (event) => {
      if (event.key === "Enter") customOption.click();
    });
    customSelectOptions.appendChild(customOption);
    customOption.addEventListener("click", () => {
      selectOption(
        select,
        customSelectName,
        customOption,
        customSelectOptions,
        option
      );
    });
  });
  select.hasAttribute("no-arrow")
    ? (customSelectName.innerHTML = options[0].innerHTML)
    : (customSelectName.innerHTML = options[0].innerHTML + caretDown);
  customSelectOptions.querySelector(".custom-select__option").style.display =
    "none";
};

const watchSelects = () => {
  const selects = document.querySelectorAll("[custom-select]");

  for (let select of selects) {
    select.style.display = "none";
    if (document.querySelector(`[original-id="${select.id}"]`)) continue;

    const options = Array.from(select.childNodes).filter(
      (obj) => obj.nodeName === "OPTION"
    );

    const customSelect = document.createElement("div");
    customSelect.classList.add("custom-select");
    customSelect.setAttribute("original-id", select.id);
    customSelect.setAttribute("role", "button");
    customSelect.setAttribute("tabindex", "0");
    select.classList.forEach((item) => {
      customSelect.classList.add(item);
    });

    const selectName = document.createElement("p");
    const selectNameOption = options[0];
    const selectNameImage = document.querySelector(
      `[custom-option-img="${selectNameOption.id}"]`
    );
    selectNameImage ? (selectNameImage.style.display = "none") : "";
    if (!select.hasAttribute("no-arrow"))
      selectName.innerHTML = selectNameImage
        ? selectNameImage.innerHTML + selectNameOption.innerHTML + caretDown
        : selectNameOption.innerHTML + caretDown;
    else
      selectName.innerHTML = selectNameImage
        ? selectNameImage.innerHTML + selectNameOption.innerHTML
        : selectNameOption.innerHTML;
    selectName.classList.add("custom-select__name");

    const customOptions = document.createElement("div");
    customOptions.classList.add("custom-select__options");
    customOptions.classList.add("small-scroll");

    options
      .filter((op) => op.value !== "")
      .forEach((option) => {
        let customOption = createCustomOption(option);
        customOptions.appendChild(customOption);
        customOption.addEventListener("click", () => {
          selectOption(select, selectName, customOption, customOptions, option);
        });
      });

    if (options[0].value !== "") {
      customOptions.childNodes[0].style.visibility = "none";
    }

    document.addEventListener("click", (e) => {
      if (
        !customSelect.contains(e.target) &&
        customSelect.classList.contains("active") &&
        e.target.style.display !== "none"
      ) {
        customSelect.classList.remove("active");
        document.onkeydown = null;
      }
    });

    customSelect.addEventListener("click", () => {
      select.focus();
      if (!select.hasAttribute("disabled")) {
        if (customSelect.classList.contains("active")) {
          customSelect.classList.remove("active");
          document.onkeydown = null;
        } else {
          customSelect.classList.add("active");
          let keys = "";
          document.onkeydown = (e) => {
            keys = keys + e.key;
            customSelect
              .querySelectorAll(".custom-select__option")
              .forEach((el) => {
                if (el.innerHTML.toLowerCase().startsWith(keys)) {
                  el.focus();
                  return;
                }
              });
          };
        }
      }
    });

    select.addEventListener("directChange", () => {
      const newSelected = options.filter((op) => op.value === select.value)[0];
      removeNodesExceptLast(selectName);
      selectName.insertAdjacentHTML("afterbegin", newSelected.innerHTML);
      removeNone(customOptions.querySelectorAll(".custom-select__option"));
      document.querySelector(
        `.custom-select__options [value='${select.value}']`
      ).style.display = "none";
    });

    customSelect.appendChild(selectName);
    customSelect.appendChild(customOptions);
    select.after(customSelect);
  }
};

watchSelects();