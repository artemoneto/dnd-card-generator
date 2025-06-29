// Wrap the entire script in an IIFE to encapsulate variables and functions
(function() {
    const item_editors = document.getElementById("item-editors");
    const A4 = document.getElementById("A4");

    const converter = new showdown.Converter();

    const translation = {
	english: {
		print: "Print",
		toggle_preview: "Toggle preview",
		item: "Item",
		item_name: "Name of the item",
		short_description_requirement: "Short description",
		image_requirement: "Image",
		type_requirement: "Type",
		type: "Type",
		item_type: "Type of the item",
		attunement_requirement: "Attunement",
		rarity: "Rarity",
		common: "Common",
		uncommon: "Uncommon",
		rare: "Rare",
		epic: "Epic",
		legendary: "Legendary",
		artifact: "Artifact",
		attunement: "Attunement",
		item_details: "Details of the item",
		item_charges: "Item charges:",
		none: "None",
		flip_short_edge: "Flip for short-edge printing",
		// save: "Save",
        // load: "Load",
        // cards_loaded: "Cards loaded successfully!",
		clear_all_confirm: "Are you sure you want to clear all cards?",
	},
	russian: {
		print: "Печать",
		toggle_preview: "Переключить<br>предпросмотр",
		item: "Предмет",
		item_name: "Имя предмета",
		short_description_requirement: "Короткое описание",
		image_requirement: "Изображение",
		type_requirement: "Тип",
		type: "Тип",
		item_type: "Тип предмета",
		attunement_requirement: "Настройка",
		rarity: "Редкость",
		common: "Обычный",
		uncommon: "Необычный",
		rare: "Редкий",
		epic: "Эпический",
		legendary: "Легендарный",
		artifact: "Артефакт",
		attunement: "Настройка",
		item_details: "Подробное описание",
		item_charges: "Заряды предмета:",
		none: "Нет",
		flip_short_edge: "Перевернуть для печати<br>по короткому краю",
		// save: "Сохранить",
        // load: "Загрузить",
        // cards_loaded: "Карты успешно загружены!",
		clear_all_confirm: "Вы уверены, что хотите очистить все карты?",
	},
};

    const NUM_ITEMS = 9; // Define a constant for the number of items

    let languageSelect = document.getElementById(`language-select`);
    let currentLanguage = languageSelect.options[languageSelect.selectedIndex].value;

    // Utility function for debouncing (moved up for clarity)
    const debounce = (func, delay) => {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    }

    const DEBOUNCE_DELAY = 150; // Milliseconds for debouncing textFit calls
    const debouncedFitText = debounce(fit_text, DEBOUNCE_DELAY);
	const debouncedSaveState = debounce(saveStateToLocalStorage, DEBOUNCE_DELAY);

    // Helper to get item number from element ID
    function get_item_number(element) {
        let id = element.id;
        let parts = id.split("-");
        let lastPart = parts[parts.length - 1];
        return !isNaN(lastPart) ? parseInt(lastPart, 10) : null;
    }

    // Function to apply text fitting
    function fit_text() {
        textFit(document.getElementsByClassName('card-details'),
        {
            minFontSize: 8,
            maxFontSize: 16,
            multiLine: true
        });
    }

    // Function to update all language-dependent text
    function updateAllText() {
		const flipLabel = document.querySelector("#flip-on-short-edge-label");
        if (flipLabel) {
            flipLabel.innerHTML = translation[currentLanguage]["flip_short_edge"];
        }
        document.querySelectorAll(".item-name").forEach((element) => {
            element.innerHTML = translation[currentLanguage]["item"];
        });
        document
            .querySelectorAll(".item-name-editor > input")
            .forEach((element) => {
                element.placeholder = translation[currentLanguage]["item_name"];
            });
        document.querySelectorAll(".card-name").forEach((element) => {
            // Only update if it's the default placeholder, otherwise keep user input
            const itemNum = get_item_number(element);
            const itemNameInput = document.getElementById(`item-name-${itemNum}`);
            if (itemNameInput.value === "") {
                element.innerHTML = translation[currentLanguage]["item_name"];
            }
        });
        document
            .querySelectorAll(".item-short-description-editor > label > span")
            .forEach((element) => {
                element.innerHTML =
                    translation[currentLanguage]["short_description_requirement"];
            });
        document
            .querySelectorAll(".item-image-editor > label > span")
            .forEach((element) => {
                element.innerHTML = translation[currentLanguage]["image_requirement"];
            });
        document
            .querySelectorAll(".item-type-editor > label > span")
            .forEach((element) => {
                element.innerHTML = translation[currentLanguage]["type_requirement"];
            });
        document
            .querySelectorAll(".item-type-editor > div > input")
            .forEach((element) => {
                element.placeholder = translation[currentLanguage]["item_type"];
            });
        document.querySelectorAll(".item-type-header").forEach((element) => {
            element.innerHTML = translation[currentLanguage]["type"];
        });
        document.querySelectorAll(".item-type").forEach((element) => {
            // Only update if it's the default placeholder, otherwise keep user input
            const itemNum = get_item_number(element);
            const itemTypeInput = document.getElementById(`item-type-value-${itemNum}`);
            if (itemTypeInput.value === "") {
                element.innerHTML = translation[currentLanguage]["item_type"];
            }
        });
        document
            .querySelectorAll(".attunement-editor > label > span")
            .forEach((element) => {
                element.innerHTML = translation[currentLanguage]["attunement_requirement"];
            });
        document.querySelectorAll(".item-attunement").forEach((element) => {
            element.innerHTML = translation[currentLanguage]["attunement"];
        });
        document.querySelectorAll(".item-details-editor").forEach((element) => {
            element.placeholder = translation[currentLanguage]["item_details"];
        });

        document
            .querySelectorAll(".charges-editor > label > span")
            .forEach((element) => {
                element.innerHTML = translation[currentLanguage]["item_charges"];
            });
        document
            .querySelectorAll(".charges-editor > label > div > input[type='range']")
            .forEach((element) => {
                // Re-call change_charges to update the display value based on new language
                change_charges(element);
            });
        document.querySelectorAll(".item-rarity-editor > label > span").forEach(element => {
            element.innerHTML = translation[currentLanguage]["rarity"];
        });
        document.querySelectorAll(".item-rarity-editor select").forEach(select => {
            // Loop through rarities to update option text
            const rarities = ["common", "uncommon", "rare", "epic", "legendary", "artifact"];
            rarities.forEach(rarity => {
                const option = select.querySelector(`option[value="${rarity}"]`);
                if (option) {
                    option.innerHTML = translation[currentLanguage][rarity];
                }
            });
        });
    }

    // Initial HTML generation: Build strings first, then set innerHTML once
    const itemEditorHtmls = [];
    const A4Htmls = [];
    const backsideHtmls = []; // New array for back sides

    for (let i = 1; i <= NUM_ITEMS; i++) {
        itemEditorHtmls.push(`
        <details class="item-editor" id="item-editor-${i}" open>
            <summary>
                <div class="item-name-editor">
                    <span style="display:none" class="item-name">${translation[currentLanguage]["item"]}</span>
                    <span style="display:none">${i}:</span>
                    <input id="item-name-${i}" type="text" placeholder="${translation[currentLanguage]["item_name"]}">
                </div>
            </summary>
            <div class="properties">
			
				<div class="item-rarity-editor item-property">
                    <label>
                        <span>${translation[currentLanguage]["rarity"]}</span>
                        <select id="item-rarity-${i}">
                            <option value="common">${translation[currentLanguage]["common"]}</option>
                            <option value="uncommon">${translation[currentLanguage]["uncommon"]}</option>
                            <option value="rare">${translation[currentLanguage]["rare"]}</option>
                            <option value="epic">${translation[currentLanguage]["epic"]}</option>
                            <option value="legendary">${translation[currentLanguage]["legendary"]}</option>
                            <option value="artifact">${translation[currentLanguage]["artifact"]}</option>
                        </select>
                    </label>
                </div>

                <div class="item-short-description-editor">
                    <label>
                        <input id="item-short-description-${i}" class="item-short-description" type="checkbox" checked>
                        <span>${translation[currentLanguage]["short_description_requirement"]}</span>
                    </label>
                </div>

                <div class="item-image-editor item-property">
                    <label>
                        <input id="item-image-requirement-${i}" class="item-image-requirement" type="checkbox" checked>
                        <span>${translation[currentLanguage]["image_requirement"]}</span>
                    </label>
                    <div class="item-image-value-container">
                        <input id="item-image-value-${i}" class="item-image-value" type="file" accept="image/*">
                    </div>
                </div>

                <div class="item-type-editor item-property">
                    <label>
                        <input id="item-type-requirement-${i}" class="item-type-requirement" type="checkbox" checked>
                        <span>${translation[currentLanguage]["type_requirement"]}</span>
                    </label>
                    <div class="item-type-value-container">
                        <input id="item-type-value-${i}" class="item-type-value" type="text" placeholder="${translation[currentLanguage]["item_type"]}">
                    </div>
                </div>

                <div class="attunement-editor item-property">
                    <label>
                        <input id="item-attunement-${i}" type="checkbox" checked>
                        <span>${translation[currentLanguage]["attunement_requirement"]}</span>
                    </label>
                </div>
    
                <div class="details-editor-container">
                    <textarea id="item-details-${i}" class="item-details-editor" placeholder="${translation[currentLanguage]["item_details"]}"></textarea>
                </div>

                <div class="charges-editor">
                    <label>
                        <span>${translation[currentLanguage]["item_charges"]}</span>
                        <div class="slider-and-value">
                            <input type="range" id="item-charges-${i}" min="0" max="12" value="0"/>
                            <span id="item-charges-value-${i}">${translation[currentLanguage]["none"]}</span>
                        </div>
                    </label>
                </div>
            </div>
        </details>
        `);
        A4Htmls.push(`
        <div id="card-${i}" class="card-container">
            <div class="card-outline">
                <div id="card-name-${i}" class="card-name">
                    ${translation[currentLanguage]["item_name"]}
                </div>
                <div id="card-short-description-${i}" class="card-short-description">
                    <div id="card-image-value-${i}" class="image">
                    </div>
                    <div class="characteristics">
                        <div id="card-type-${i}" class="card-type">
                            <div id="card-type-header-${i}" class="item-type-header">
                                ${translation[currentLanguage]["type"]}
                            </div>
                            <div id="card-type-value-${i}" class="item-type">
                                ${translation[currentLanguage]["item_type"]}
                            </div>
                        </div>
                        <div id="card-attunement-${i}" class="item-attunement-container">
                            <span class="material-symbols-outlined" style="color: grey;">
                                check_box_outline_blank
                            </span>
                            <span class="item-attunement">${translation[currentLanguage]["attunement"]}</span>
                        </div>
                    </div>
                </div>
                <hr>
                <div id="card-details-${i}" class="card-details">
                </div>
            </div>

            <div id="card-battery-container-${i}" class="battery-container">
                <div id="card-battery-${i}" class="battery">
                    <div class="battery-section">
                    </div>
                </div>
                <div class="battery-terminal">
                </div>
            </div>
            
        </div>
    	`);
        // Add backside HTML
        backsideHtmls.push(`
        <div id="card-back-${i}" class="card-container card-backside">
            <div class="card-outline card-back-outline">
                <div class="card-back-content">
					<svg xmlns="http://www.w3.org/2000/svg" version="1.0" viewBox="0 0 597 524">
						<g class="dragon-primary" stroke-width="0">
							<path d="M126 68.8v37l-8.2 9.4c-22.4 25.6-36.6 55.5-39.6 83.2-1 9-.6 9.2 3.1 2.6 15.8-28.2 45.2-53.2 77.7-66.2l9.5-3.7-10-.1c-9.3 0-18.3 1.3-26.5 4-15.7 5-17 .5-2.7-9.2 20.3-13.8 58.2-19.9 82.2-13.1 9.7 2.7-14.9-11.2-28.8-16.3-13.5-5-8.8-7.8 11.3-6.8 33.7 1.6 59.4 9.8 85.1 27 11.7 7.8 10.9 7.8 10.9-.3 0-14.3-1.5-18.6-15.3-44.6-7.8-14.5-5.8-18.5 6.4-12.9 26.6 12 38.4 35.8 49.3 99.4 5.6 33 10.1 43.3 27.8 64.1 4.5 5.4 10.4 12.4 13.1 15.5 17.2 20.6 18.6 54.3 3.1 76.8-6.1 8.8-8.8 8.6-12-1.1-2.3-6.8-8.8-19.8-13.4-26.6-7.7-11.3-15.1-16.7-31.5-22.9-6.1-2.3-8-3.3-11.3-5.8-1.9-1.5-4.8-4.5-6.4-6.6-3-4.2-3.6-3.5-1.4 1.7 2.1 5.2 8.8 10.1 18.4 13.7 17 6.3 28.5 19.2 36.1 40 4.7 13 3.6 14.4-7.1 9.5-3-1.4-8.3-3.1-11.9-3.8-6.3-1.3-6.4-1.3-13.2-9.7-17.2-21.2-38-39-53.7-46.2-7-3.2-11.6-5-14.5-5.8-1.6-.5-5.7-1.6-9-2.5-8.2-2.3-27.6-2.3-37 0-15.4 3.8-17.6 3.3-14.5-3.1 4.4-8.8 16.9-20.3 29.2-27l6.3-3.4h-8.6c-12.1 0-27.8 2.9-39.4 7.4-13.8 5.4-15.1 4.5-8.7-6.3 8.4-14.5 28.5-32.4 48.9-43.6 11.2-6.2 11.1-6.7-.8-2.6-37.3 13-63.7 39-76 75-1.6 4.7-2.9 8.9-2.9 9.3 0 .5 3.4-1.5 7.5-4.3 10.3-7 25.8-13.9 31.3-13.9 5.1 0 5.2.5.6 5.8-10.9 12.8-15.7 29.5-12.5 43.5 1.3 5.5 1.4 5.5 8-.5 3.3-3.1 7.1-5.8 8.5-6.2 1.4-.3 4.7-1.9 7.3-3.4 12.9-7.5 24-10.4 23.5-6.2-2.9 24.9 6.4 36.6 43.8 55 12.2 6.1 15.1 7.4 30 14 5.2 2.3 11.5 5.1 14 6.2 65.9 29.6 96.4 57.5 108.5 99.2 1.4 5 2.7 9.2 3 9.4.2.3 3.9-1.7 8.2-4.4 93.5-58.2 131.2-174.5 89.6-276.4-28-68.6-90.3-120.5-162-134.8-22.4-4.6-21-4.5-124-4.9l-99.3-.4z"/>
							<path d="M293.7 192.2c-2.4 19.7 7.1 33.8 22.7 33.8h3.9l-2.1-2.3c-1.2-1.3-4.7-7.2-7.7-13.1-6.1-11.9-9.9-17.9-13.7-21.4l-2.5-2.3zM104 232.6c-11.4 26.4-10 51.7 4.4 80.2 3.8 7.4 14.8 24.6 16.5 25.6.8.5 1.1 21.7 1.1 73.2V484h64.8l1.6-8.9c9.8-53.3.1-88-37.1-132.2-5.4-6.4-13.5-16-18.1-21.4-26.3-31.3-35.5-56.4-31.4-85.5 1.3-9 .9-9.8-1.8-3.4"/>
						</g>
						<path class="dragon-secondary" d="M202 270.4c-8.6 3.8-19 9.6-17.4 9.6.7 0 1.3 3.3 1.7 8.3 1.7 23.9 14.7 38.9 59 68.2 48.7 32.2 64.3 44.9 78.2 63.3 10.4 13.8 16.2 26.3 21.5 46.5l1.3 4.8 5.1-.6c26.9-3.4 62.4-14.4 60.6-18.8-.5-1.2-2-6.3-3.5-11.2-6.5-22-19.8-40.8-40.5-57.4-19.8-15.9-38.3-26-85.4-46.8-58.7-25.8-74.4-40.7-69.3-65.6 1-4.8-.9-4.9-11.3-.3"/>
					</svg>
                </div>
				<div class="card-back-logo-background"></div>
            </div>
        </div>
        `);
    }

    item_editors.innerHTML = itemEditorHtmls.join('');
    item_editors.addEventListener('input', debouncedSaveState);
    item_editors.addEventListener('change', debouncedSaveState);

    A4.innerHTML = `
        <div class="print-page front-page">
            ${A4Htmls.join('')}
        </div>
        <div class="print-page back-page">
            ${backsideHtmls.join('')}
        </div>
    `;

    languageSelect.addEventListener('change', (event) => {
        currentLanguage = event.target.options[event.target.selectedIndex].value;
        updateAllText();
        fit_text();
        debouncedSaveState(); // Save state on language change
    });

	const loadInput = document.getElementById('load-input');
    if (loadInput) {
        loadInput.addEventListener('change', handleFileLoad);
    }

	const saveButton = document.getElementById('save-button');
    if (saveButton) {
        saveButton.addEventListener('click', saveData);
    }

    const clearButton = document.getElementById('clear-button');
    if (clearButton) {
        clearButton.addEventListener('click', clearAllCards);
    }

	document.getElementById(`toggle-preview-button`).addEventListener('click', toggle_preview);
	function toggle_preview() {
        const main_section = document.getElementById(`main-section`);
        main_section.classList.toggle("no-preview");
    }

    const flipCheckbox = document.getElementById('flip-on-short-edge');
    if (flipCheckbox) {
        flipCheckbox.addEventListener('change', (event) => {
            const backPage = document.querySelector('.back-page');
            if (backPage) {
                backPage.classList.toggle('flipped-for-short-edge', event.target.checked);
            }
        });
    }

	const printButton = document.getElementById('print-button');
    if (printButton) {
        printButton.addEventListener('click', () => window.print());
    }

    // Attach event listeners to dynamically created elements
    for (let i = 1; i <= NUM_ITEMS; i++) {
        const itemEditorSummary = document.querySelector(`#item-editor-${i} > summary`);
        const itemNameInput = document.getElementById(`item-name-${i}`);
        const shortDescCheckbox = document.getElementById(`item-short-description-${i}`);
        const imageRequirementCheckbox = document.getElementById(`item-image-requirement-${i}`);
        const imageValueInput = document.getElementById(`item-image-value-${i}`);
        const typeRequirementCheckbox = document.getElementById(`item-type-requirement-${i}`);
        const typeValueInput = document.getElementById(`item-type-value-${i}`);
        const attunementCheckbox = document.getElementById(`item-attunement-${i}`);
        const raritySelect = document.getElementById(`item-rarity-${i}`);
        const detailsTextarea = document.getElementById(`item-details-${i}`);
        const chargesRangeInput = document.getElementById(`item-charges-${i}`);

        itemEditorSummary.addEventListener('keyup', prevent_toggling);
        itemNameInput.addEventListener('keyup', (event) => change_name(event.target));
        shortDescCheckbox.addEventListener('change', (event) => toggle_short_description(event.target));
        imageRequirementCheckbox.addEventListener('change', (event) => toggle_image(event.target));
        imageValueInput.addEventListener('change', (event) => change_image(event.target));
        typeRequirementCheckbox.addEventListener('change', (event) => toggle_type(event.target));
        typeValueInput.addEventListener('keyup', (event) => change_type(event.target));
        attunementCheckbox.addEventListener('change', (event) => toggle_attunement(event.target));
        raritySelect.addEventListener('change', (event) => change_rarity(event.target));
        detailsTextarea.addEventListener('keyup', (event) => change_details(event.target));
        chargesRangeInput.addEventListener('input', (event) => change_charges(event.target));
    }

    function prevent_toggling(event) {
        if (event.keyCode === 32) {
            event.preventDefault();
        }
    }

    function change_name(element) { // Renamed Element to element for consistency
        const item_number = get_item_number(element); // Use const
        const card_name = document.getElementById(`card-name-${item_number}`); // Use const

        if (element.value === "") { // Use strict equality
            card_name.innerHTML = translation[currentLanguage]["item_name"];
        } else {
            card_name.innerHTML = "&#8203;" + element.value;
        }
        fit_text();
    }

	function change_rarity(element) {
        const item_number = get_item_number(element);
        const card_container = document.getElementById(`card-${item_number}`);
		const card_container_back = document.getElementById(`card-back-${item_number}`);
        const selectedRarity = element.value;

        // List of all possible rarity classes
        const rarityClasses = ['rarity-common', 'rarity-uncommon', 'rarity-rare', 'rarity-epic', 'rarity-legendary', 'rarity-artifact'];

        // Remove all existing rarity classes
        card_container.classList.remove(...rarityClasses);
		card_container_back.classList.remove(...rarityClasses);

        // Add the new rarity class if it's not common (or if you want a specific common style)
        if (selectedRarity && selectedRarity !== 'common') {
            card_container.classList.add(`rarity-${selectedRarity}`);
			card_container_back.classList.add(`rarity-${selectedRarity}`);
        }
    }

    function toggle_short_description(element) {
        const item_number = get_item_number(element);
        const card_short_description = document.getElementById(
            `card-short-description-${item_number}`
        );
        if (element.checked) {
            card_short_description.style.display = "grid";
        } else {
            card_short_description.style.display = "none";
        }
        fit_text();
    }

	function toggle_image(element) {
        const item_number = get_item_number(element);
        const card_short_description = document.getElementById(
            `card-short-description-${item_number}`
        );
        if (element.checked) {
            card_short_description.classList.remove("no-image");
        } else {
            card_short_description.classList.add("no-image");
        }
        fit_text();
    }

	function applyImageToCard(item_number, dataUrl) {
        const card_image_value = document.getElementById(`card-image-value-${item_number}`);
        if (dataUrl && dataUrl !== 'none' && dataUrl !== '') {
            card_image_value.style.backgroundImage = dataUrl;
            card_image_value.style.backgroundColor = "white";
        } else {
            card_image_value.style.backgroundImage = '';
            card_image_value.style.backgroundColor = 'gainsboro';
        }
    }

    function change_image(element) {
        const item_number = get_item_number(element);
        // const card_image_value = document.getElementById(
        //     `card-image-value-${item_number}`
        // );
        const file = element.files[0]; // Use const
        const reader = new FileReader(); // Use const
        reader.onloadend = () => {
			applyImageToCard(item_number, `url(${reader.result})`);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
        fit_text();
    }

    function toggle_type(element) {
        const item_number = get_item_number(element);
        const card_type = document.getElementById(`card-type-${item_number}`);
        // card_short_description was not defined in original, but used. Added const.
        const card_short_description = document.getElementById(
            `card-short-description-${item_number}`
        );
        if (element.checked) {
            card_type.style.visibility = "visible";
            card_short_description.classList.remove("no-type");
        } else {
            card_type.style.visibility = "hidden";
            card_short_description.classList.add("no-type");
        }
		fit_text();
    }

    function change_type(element) {
        const item_number = get_item_number(element);
        const card_type_value = document.getElementById(`card-type-value-${item_number}`);

        if (element.value === "") {
            card_type_value.innerHTML = translation[currentLanguage]["item_type"];
        } else {
            card_type_value.innerHTML = "&#8203;" + element.value;
        }
        fit_text();
    }

    function toggle_attunement(element) {
        const item_number = get_item_number(element);
        const card_short_description = document.getElementById(
            `card-short-description-${item_number}`
        );
        const card_attunement = document.getElementById(`card-attunement-${item_number}`);
        if (element.checked) {
            card_attunement.style.display = "flex";
            card_short_description.classList.remove("no-attunement");
        } else {
            card_attunement.style.display = "none";
            card_short_description.classList.add("no-attunement");
        }
		fit_text();
    }

	function change_details(element) {
        const item_number = get_item_number(element);
        const card_details = document.getElementById(`card-details-${item_number}`);

        const details_editor_value = element.value; // Use const
        const markdown_to_html = converter.makeHtml(details_editor_value); // Use const
        card_details.innerHTML = markdown_to_html;
        fit_text();
    }

    function change_charges(element) {
        const item_number = get_item_number(element);
        const item_charges_display = document.getElementById(
            `item-charges-value-${item_number}`
        );
        const card_battery_container = document.getElementById(
            `card-battery-container-${item_number}`
        );
        const card_charges = document.getElementById(`card-battery-${item_number}`);

        if (element.value === "0") {
            card_battery_container.style.display = "none";
            item_charges_display.innerHTML = translation[currentLanguage]["none"];
        } else {
            card_battery_container.style.display = "flex";
            let battery_sections = ``;
            for (let i = 1; i <= parseInt(element.value); i++) {
                battery_sections += `<div class="battery-section"></div>`;
            }
            card_charges.innerHTML = battery_sections;
            item_charges_display.innerHTML = element.value;
        }
        fit_text();
    }

    // --- Save/Load Functions ---

    function getAllCardsData() {
        const allCardsData = [];
        for (let i = 1; i <= NUM_ITEMS; i++) {
            const cardData = {
                name: document.getElementById(`item-name-${i}`).value,
                rarity: document.getElementById(`item-rarity-${i}`).value,
                shortDescription: document.getElementById(`item-short-description-${i}`).checked,
                imageRequired: document.getElementById(`item-image-requirement-${i}`).checked,
                imageDataUrl: document.getElementById(`card-image-value-${i}`).style.backgroundImage,
                typeRequired: document.getElementById(`item-type-requirement-${i}`).checked,
                typeValue: document.getElementById(`item-type-value-${i}`).value,
                attunement: document.getElementById(`item-attunement-${i}`).checked,
                details: document.getElementById(`item-details-${i}`).value,
                charges: document.getElementById(`item-charges-${i}`).value,
            };
            allCardsData.push(cardData);
        }
        return allCardsData;
    }

    function saveData() {
        const allCardsData = getAllCardsData();
        const jsonString = JSON.stringify(allCardsData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'dnd-cards.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function handleFileLoad(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const loadedData = JSON.parse(e.target.result);
                if (Array.isArray(loadedData) && loadedData.length === NUM_ITEMS) {
                    applyAllData(loadedData);
                } else {
                    alert('Invalid or corrupted card file.');
                }
            } catch (error) {
                console.error('Error parsing JSON file:', error);
                alert('Error reading file. Please ensure it is a valid JSON file.');
            }
        };
        reader.readAsText(file);
        event.target.value = ''; // Reset input to allow loading the same file again
    }

    function applyAllData(allCardsData) {
        allCardsData.forEach((cardData, index) => {
            const i = index + 1; // Card numbers are 1-based

            const nameInput = document.getElementById(`item-name-${i}`);
            const raritySelect = document.getElementById(`item-rarity-${i}`);
            const shortDescCheckbox = document.getElementById(`item-short-description-${i}`);
            const imageReqCheckbox = document.getElementById(`item-image-requirement-${i}`);
            const typeReqCheckbox = document.getElementById(`item-type-requirement-${i}`);
            const typeValueInput = document.getElementById(`item-type-value-${i}`);
            const attunementCheckbox = document.getElementById(`item-attunement-${i}`);
            const detailsTextarea = document.getElementById(`item-details-${i}`);
            const chargesRange = document.getElementById(`item-charges-${i}`);

            nameInput.value = cardData.name || '';
            raritySelect.value = cardData.rarity || 'common';
            shortDescCheckbox.checked = cardData.shortDescription !== false;
            imageReqCheckbox.checked = cardData.imageRequired !== false;
			applyImageToCard(i, cardData.imageDataUrl);
            typeReqCheckbox.checked = cardData.typeRequired !== false;
            typeValueInput.value = cardData.typeValue || '';
            attunementCheckbox.checked = cardData.attunement !== false;
            detailsTextarea.value = cardData.details || '';
            chargesRange.value = cardData.charges || '0';

            // Trigger all update functions to refresh the card previews
            [raritySelect, shortDescCheckbox, imageReqCheckbox, typeReqCheckbox, attunementCheckbox].forEach(el => el.dispatchEvent(new Event('change', { bubbles: true })));
            [nameInput, typeValueInput, detailsTextarea].forEach(el => el.dispatchEvent(new Event('keyup', { bubbles: true })));
			chargesRange.dispatchEvent(new Event('input', { bubbles: true }));
        });

        // alert(translation[currentLanguage]['cards_loaded']);
		fit_text();
    }

    function clearAllCards() {
        if (window.confirm(translation[currentLanguage]['clear_all_confirm'])) {
            // Preserve the language setting while clearing card data.
            const savedStateJSON = localStorage.getItem('dndCardGeneratorState');
            let langToKeep = languageSelect.value; // Default to current selection

            if (savedStateJSON) {
                try {
                    const savedState = JSON.parse(savedStateJSON);
                    if (savedState.language) {
                        langToKeep = savedState.language;
                    }
                } catch (e) { /* Ignore parsing errors, will use default */ }
            }
            const newState = { language: langToKeep }; // Create a new state with only the language
            localStorage.setItem('dndCardGeneratorState', JSON.stringify(newState));
            location.reload();
        }
    }

	// --- Local Storage Functions ---

    function saveStateToLocalStorage() {
        const state = {
            language: languageSelect.value,
            cards: getAllCardsData(),
        };
        localStorage.setItem('dndCardGeneratorState', JSON.stringify(state));
    }

    function loadStateFromLocalStorage() {
        const savedStateJSON = localStorage.getItem('dndCardGeneratorState');
        if (!savedStateJSON) return;

        try {
            const savedState = JSON.parse(savedStateJSON);
            if (savedState.language) {
                languageSelect.value = savedState.language;
                languageSelect.dispatchEvent(new Event('change'));
            }
            if (savedState.cards && Array.isArray(savedState.cards)) {
                applyAllData(savedState.cards);
            }
        } catch (error) {
            console.error("Error loading state from localStorage:", error);
            localStorage.removeItem('dndCardGeneratorState');
        }
    }

    // Initial calls to set up text and fit text after DOM is ready
    updateAllText();
    fit_text();
    loadStateFromLocalStorage();

})(); // End of IIFE
