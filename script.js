const item_editors = document.getElementById("item-editors");
const A4 = document.getElementById("A4");

var converter = new showdown.Converter();

translation = {
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
		attunement: "Attunement",
		item_details: "Details of the item",
		item_charges: "Item charges:",
		none: "None",
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
		attunement: "Настройка",
		item_details: "Подробное описание",
		item_charges: "Заряды предмета:",
		none: "Нет",
	},
};

language_select = document.getElementById(`language-select`);
language = language_select.options[language_select.selectedIndex].value;

// document.getElementById(`print-button-content`).innerHTML =
// 	translation[language]["print"];

// document.getElementById(`toggle-preview-button-content`).innerHTML =
// 	translation[language]["toggle_preview"];

for (let i = 1; i <= 9; i++) {
	item_editors.innerHTML += `
        <details class="item-editor" id="item-editor-${i}" open>
            <summary onkeyup="prevent_toggling(event)">
                <div class="item-name-editor">
                    <span style="display:none" class="item-name">${translation[language]["item"]}</span>
                    <span style="display:none">${i}:</span>
                    <input id="item-name-${i}" type="text" placeholder="${translation[language]["item_name"]}" onkeyup="change_name(this)">
                </div>
            </summary>
            <div class="properties">
                <div class="item-short-description-editor">
                    <label>
                        <input id="item-short-description-${i}" class="item-short-description" type="checkbox" checked onchange="toggle_short_description(this)">
                        <span>${translation[language]["short_description_requirement"]}</span>
                    </label>
                </div>

                <div class="item-image-editor item-property">
                    <label>
                        <input id="item-image-requirement-${i}" class="item-image-requirement" type="checkbox" onchange="toggle_image(this)" checked>
                        <span>${translation[language]["image_requirement"]}</span>
                    </label>
                    <div class="item-image-value-container">
                        <input id="item-image-value-${i}" class="item-image-value" type="file" accept="image/*" onchange="change_image(this)">
                    </div>
                </div>

                <div class="item-type-editor item-property">
                    <label>
                        <input id="item-type-requirement-${i}" class="item-type-requirement" type="checkbox" onchange="toggle_type(this)" checked>
                        <span>${translation[language]["type_requirement"]}</span>
                    </label>
                    <div class="item-type-value-container">
                        <input id="item-type-value-${i}" class="item-type-value" type="text" placeholder="${translation[language]["item_type"]}" onkeyup="change_type(this)">
                    </div>
                </div>

                <div class="attunement-editor item-property">
                    <label>
                        <input id="item-attunement-${i}" type="checkbox" checked onchange="toggle_attunement(this)">
                        <span>${translation[language]["attunement_requirement"]}</span>
                    </label>
                </div>
    
                <div class="details-editor-container">
                    <textarea id="item-details-${i}" class="item-details-editor" placeholder="${translation[language]["item_details"]}" onkeyup="change_details(this)"></textarea>
                </div>

                <div class="charges-editor">
                    <label>
                        <span>${translation[language]["item_charges"]}</span>
                        <div class="slider-and-value">
                            <input type="range" id="item-charges-${i}" min="0" max="12" value="0" oninput="change_charges(this)"/>
                            <span id="item-charges-value-${i}">${translation[language]["none"]}</span>
                        </div>
                    </label>
                </div>
            </div>
        </details>
        `;

	A4.innerHTML += `
        <div id="card-${i}" class="card-container">
            <div class="card-outline">
                <div id="card-name-${i}" class="card-name">
                    ${translation[language]["item_name"]}
                </div>
                <div id="card-short-description-${i}" class="card-short-description">
                    <div id="card-image-value-${i}" class="image">
                    </div>
                    <div class="characteristics">
                        <div id="card-type-${i}" class="card-type">
                            <div id="card-type-header-${i}" class="item-type-header">
                                ${translation[language]["type"]}
                            </div>
                            <div id="card-type-value-${i}" class="item-type">
                                ${translation[language]["item_type"]}
                            </div>
                        </div>
                        <div id="card-attunement-${i}" class="item-attunement-container">
                            <span class="material-symbols-outlined" style="color: grey;">
                                check_box_outline_blank
                            </span>
                            <span class="item-attunement">${translation[language]["attunement"]}</span>
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
    `;
}

function change_language(Element) {
	language_select = document.getElementById(`language-select`);
	language = language_select.options[language_select.selectedIndex].value;

	// document.getElementById(`print-button-content`).innerHTML =
	// 	translation[language]["print"];
	// document.getElementById(`toggle-preview-button-content`).innerHTML =
	// 	translation[language]["toggle_preview"];
	document.querySelectorAll(".item-name").forEach((element) => {
		element.innerHTML = translation[language]["item"];
	});
	document
		.querySelectorAll(".item-name-editor > input")
		.forEach((element) => {
			element.placeholder = translation[language]["item_name"];
		});
	document.querySelectorAll(".card-name").forEach((element) => {
		element.innerHTML = translation[language]["item_name"];
	});
	document
		.querySelectorAll(".item-short-description-editor > label > span")
		.forEach((element) => {
			element.innerHTML =
				translation[language]["short_description_requirement"];
		});
	document
		.querySelectorAll(".item-image-editor > label > span")
		.forEach((element) => {
			element.innerHTML = translation[language]["image_requirement"];
		});
	document
		.querySelectorAll(".item-type-editor > label > span")
		.forEach((element) => {
			element.innerHTML = translation[language]["type_requirement"];
		});
	document
		.querySelectorAll(".item-type-editor > div > input")
		.forEach((element) => {
			element.placeholder = translation[language]["item_type"];
		});
	document.querySelectorAll(".item-type-header").forEach((element) => {
		element.innerHTML = translation[language]["type"];
	});
	document.querySelectorAll(".item-type").forEach((element) => {
		element.innerHTML = translation[language]["item_type"];
	});
	document
		.querySelectorAll(".attunement-editor > label > span")
		.forEach((element) => {
			element.innerHTML = translation[language]["attunement_requirement"];
		});
	document.querySelectorAll(".item-attunement").forEach((element) => {
		element.innerHTML = translation[language]["attunement"];
	});
	document.querySelectorAll(".item-details-editor").forEach((element) => {
		element.placeholder = translation[language]["item_details"];
	});

	document
		.querySelectorAll(".charges-editor > label > span")
		.forEach((element) => {
			element.innerHTML = translation[language]["item_charges"];
		});
	document
		.querySelectorAll(".charges-editor > label > div > input")
		.forEach((element) => {
			change_charges(element);
		});
}

function prevent_toggling(event) {
	if (event.keyCode == 32) {
		event.preventDefault();
	}
}

function toggle_preview() {
	main_section = document.getElementById(`main-section`);
	main_section.classList.toggle("no-preview");
}

function get_item_number(Element) {
	let id = Element.id;
	let parts = id.split("-");
	let lastPart = parts[parts.length - 1];

	if (!isNaN(lastPart)) {
		return parseInt(lastPart, 10);
	}
	return null;
}

function fit_text() {
	textFit(document.getElementsByClassName('card-details'), 
	{
		minFontSize: 8, 
		maxFontSize: 16, 
		multiLine: true
	})
}

function change_name(Element) {
	item_number = get_item_number(Element);
	card_name = document.getElementById(`card-name-${item_number}`);

	language_select = document.getElementById(`language-select`);
	language = language_select.options[language_select.selectedIndex].value;

	if (Element.value == "") {
		card_name.innerHTML = translation[language]["item_name"];
	} else {
		card_name.innerHTML = "&#8203;" + Element.value;
	}
}

function toggle_short_description(Element) {
	item_number = get_item_number(Element);
	card_short_description = document.getElementById(
		`card-short-description-${item_number}`
	);
	if (Element.checked) {
		card_short_description.style.display = "grid";
		// card_short_description.style.margin = "5px";
	} else {
		card_short_description.style.display = "none";
		// card_short_description.style.margin = "0";
	}
	fit_text()
}

function toggle_type(Element) {
	item_number = get_item_number(Element);
	card_type = document.getElementById(`card-type-${item_number}`);
	if (Element.checked) {
		card_type.style.visibility = "visible";
		card_short_description.classList.remove("no-type");
	} else {
		card_type.style.visibility = "hidden";
		card_short_description.classList.add("no-type");
	}
	fit_text()
}

function change_type(Element) {
	item_number = get_item_number(Element);
	card_type_value = document.getElementById(`card-type-value-${item_number}`);

	language_select = document.getElementById(`language-select`);
	language = language_select.options[language_select.selectedIndex].value;

	if (Element.value == "") {
		card_type_value.innerHTML = translation[language]["item_type"];
	} else {
		card_type_value.innerHTML = "&#8203;" + Element.value;
	}
}

function toggle_image(Element) {
	item_number = get_item_number(Element);
	card_short_description = document.getElementById(
		`card-short-description-${item_number}`
	);
	if (Element.checked) {
		card_short_description.classList.remove("no-image");
	} else {
		card_short_description.classList.add("no-image");
	}
	fit_text()
}

function change_image(Element) {
	item_number = get_item_number(Element);
	card_image_value = document.getElementById(
		`card-image-value-${item_number}`
	);
	// if (Element.value == "") {
	//     card_type_value.innerHTML = "Type of the item"
	// } else {
	//     card_type_value.innerHTML = "&nbsp;" + Element.value
	// }
	let file = Element.files[0];
	let reader = new FileReader();
	reader.onloadend = () => {
		card_image_value.style.backgroundImage = `url(${reader.result})`;
		card_image_value.style.backgroundColor = "white";
		// document.getElementById('unselect-image').style.display = "inline";
	};
	if (file) {
		reader.readAsDataURL(file);
	}
}

function toggle_attunement(Element) {
	item_number = get_item_number(Element);
	card_short_description = document.getElementById(
		`card-short-description-${item_number}`
	);
	card_attunement = document.getElementById(`card-attunement-${item_number}`);
	if (Element.checked) {
		// card_attunement.style.visibility = "visible"
		card_attunement.style.display = "flex";
		card_short_description.classList.remove("no-attunement");
	} else {
		// card_attunement.style.visibility = "hidden"
		card_attunement.style.display = "none";
		card_short_description.classList.add("no-attunement");
	}
	fit_text()
}

function change_details(Element) {
	item_number = get_item_number(Element);
	card_details = document.getElementById(`card-details-${item_number}`);

	details_editor_value = Element.value;
	markdown_to_html = converter.makeHtml(details_editor_value);
	card_details.innerHTML = markdown_to_html;
	fit_text()
}

function change_charges(Element) {
	item_number = get_item_number(Element);
	item_charges_display = document.getElementById(
		`item-charges-value-${item_number}`
	);
	card_battery_container = document.getElementById(
		`card-battery-container-${item_number}`
	);
	card_charges = document.getElementById(`card-battery-${item_number}`);

	language_select = document.getElementById(`language-select`);
	language = language_select.options[language_select.selectedIndex].value;

	if (Element.value == "0") {
		card_battery_container.style.display = "none";
		item_charges_display.innerHTML = translation[language]["none"];
	} else {
		card_battery_container.style.display = "flex";
		let battery_sections = ``;
		for (let i = 1; i <= parseInt(Element.value); i++) {
			battery_sections += `<div class="battery-section"></div>`;
		}
		card_charges.innerHTML = battery_sections;
		item_charges_display.innerHTML = Element.value;
	}
	fit_text()
}
