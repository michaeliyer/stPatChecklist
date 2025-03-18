// Retrieve sections from localStorage or initialize
let sections = JSON.parse(localStorage.getItem("sections")) || {};

// References
const container = document.getElementById("sectionsContainer");
let selectedSection = null;

// Render all sections on page load
document.addEventListener("DOMContentLoaded", function () {
    renderSections();
    populateFontDropdown();
});




function renderSections() {
    container.innerHTML = "";

    Object.keys(sections).forEach(sectionName => {
        const sectionData = sections[sectionName];

        const section = document.createElement("div");
        section.className = "section";
        section.id = `section-${sectionName.replace(/\s+/g, "")}`;

        // Apply saved styles
        section.style.fontFamily = sectionData.fontFamily || "Arial";
        section.style.fontSize = sectionData.fontSize ? `${sectionData.fontSize}px` : "16px";
        section.style.color = sectionData.color || "#000000";
        section.style.backgroundColor = sectionData.backgroundColor || "#ffffff";

        const title = document.createElement("span");
        title.className = "section-title";
        title.textContent = sectionName;
        title.addEventListener("click", () => editSectionName(sectionName));

        // 🟢 Hamburger Menu
        const menuBtn = document.createElement("button");
        menuBtn.textContent = "☰";
        menuBtn.className = "menu-btn";

        const dropdown = document.createElement("div");
        dropdown.className = "dropdown-menu";

        // Style Button
        const styleBtn = document.createElement("button");
        styleBtn.textContent = "🎨 Style";
        styleBtn.addEventListener("click", () => openStyleModal(sectionName));

        // Hide Button
        const toggleBtn = document.createElement("button");
        toggleBtn.textContent = "👁 Hide";
        toggleBtn.addEventListener("click", () => toggleContent(section));

        // Delete Button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑 Delete";
        deleteBtn.addEventListener("click", () => deleteSection(sectionName));

        // ➕ Add Task Button (inside dropdown)
        const showInputBtn = document.createElement("button");
        showInputBtn.textContent = "➕ Add Task";

        // Section Content
        const content = document.createElement("div");
        content.className = "section-content";

        const list = document.createElement("ul");
        list.id = `${sectionName.replace(/\s+/g, "")}List`;

        // Hidden Input + Add Button Container
        const inputContainer = document.createElement("div");
        inputContainer.style.display = "none"; // Hidden initially
        inputContainer.style.flexDirection = "column";
        inputContainer.style.marginTop = "0.5rem";
        inputContainer.className = "task-input-container";

        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Add task...";
        input.id = `${sectionName.replace(/\s+/g, "")}Task`;

        const addBtn = document.createElement("button");
        addBtn.textContent = "Add";
        addBtn.addEventListener("click", () => addTask(sectionName));

        inputContainer.appendChild(input);
        inputContainer.appendChild(addBtn);

        // Toggle input visibility on click
        showInputBtn.addEventListener("click", () => {
            inputContainer.style.display = inputContainer.style.display === "flex" ? "none" : "flex";
        });

        // Assemble dropdown
        dropdown.appendChild(styleBtn);
        dropdown.appendChild(toggleBtn);
        dropdown.appendChild(deleteBtn);
        dropdown.appendChild(showInputBtn);

        // Toggle dropdown
        menuBtn.addEventListener("click", () => {
            dropdown.style.display = dropdown.style.display === "flex" ? "none" : "flex";
        });

        content.appendChild(list);
        content.appendChild(inputContainer);

        section.appendChild(title);
        section.appendChild(menuBtn);
        section.appendChild(dropdown);
        section.appendChild(content);

        container.appendChild(section);

        renderTasks(sectionName);
    });

    saveSections();
}

// function renderSections() {
//     container.innerHTML = "";

//     Object.keys(sections).forEach(sectionName => {
//         const sectionData = sections[sectionName];

//         const section = document.createElement("div");
//         section.className = "section";
//         section.id = `section-${sectionName.replace(/\s+/g, "")}`;

//         // Apply styles
//         section.style.fontFamily = sectionData.fontFamily || "Arial";
//         section.style.fontSize = sectionData.fontSize ? `${sectionData.fontSize}px` : "16px";
//         section.style.color = sectionData.color || "#000000";
//         section.style.backgroundColor = sectionData.backgroundColor || "#ffffff";

//         // Section Title
//         const title = document.createElement("span");
//         title.className = "section-title";
//         title.textContent = sectionName;
//         title.addEventListener("click", () => editSectionName(sectionName));

//         // 🟢 Hamburger Menu Button
//         const menuBtn = document.createElement("button");
//         menuBtn.textContent = "☰";
//         menuBtn.className = "menu-btn";

//         // 🟢 Dropdown Menu
//         const dropdown = document.createElement("div");
//         dropdown.className = "dropdown-menu";

//         // Style Button
//         const styleBtn = document.createElement("button");
//         styleBtn.textContent = "🎨 Style";
//         styleBtn.addEventListener("click", () => openStyleModal(sectionName));

//         // Toggle Button
//         const toggleBtn = document.createElement("button");
//         toggleBtn.textContent = "👁 Hide";
//         toggleBtn.addEventListener("click", () => toggleContent(section));

//         // Delete Button
//         const deleteBtn = document.createElement("button");
//         deleteBtn.textContent = "🗑 Delete";
//         deleteBtn.addEventListener("click", () => deleteSection(sectionName));

//         // Assemble Dropdown
//         dropdown.appendChild(styleBtn);
//         dropdown.appendChild(toggleBtn);
//         dropdown.appendChild(deleteBtn);

//         // Toggle dropdown visibility
//         menuBtn.addEventListener("click", () => {
//             dropdown.style.display = dropdown.style.display === "flex" ? "none" : "flex";
//         });

//         // Section Content
//         const content = document.createElement("div");
//         content.className = "section-content";

//         const list = document.createElement("ul");
//         list.id = `${sectionName.replace(/\s+/g, "")}List`;

//         const input = document.createElement("input");
//         input.type = "text";
//         input.placeholder = "Add task...";
//         input.id = `${sectionName.replace(/\s+/g, "")}Task`;

//         const addBtn = document.createElement("button");
//         addBtn.textContent = "➕ Add";
//         addBtn.addEventListener("click", () => addTask(sectionName));

//         content.appendChild(list);
//         content.appendChild(input);
//         content.appendChild(addBtn);

//         section.appendChild(title);
//         section.appendChild(menuBtn);
//         section.appendChild(dropdown);
//         section.appendChild(content);

//         container.appendChild(section);

//         renderTasks(sectionName);
//     });

//     saveSections();
// }







// Render sections


// Save sections
function saveSections() {
    localStorage.setItem("sections", JSON.stringify(sections));
}

// Add section
function addSection() {
    const sectionInput = document.getElementById("newSection");
    const sectionName = sectionInput.value.trim();

    if (sectionName === "" || sections[sectionName]) {
        alert("Section name invalid or already exists.");
        return;
    }

    sections[sectionName] = {
        tasks: [],
        fontFamily: "Arial",
        fontSize: 16,
        color: "#000000",
        backgroundColor: "#ffffff"
    };

    sectionInput.value = "";
    renderSections();
}

// Edit section name
function editSectionName(oldName) {
    const newName = prompt("Enter new name:", oldName);
    if (newName && newName.trim() !== "" && newName !== oldName) {
        if (sections[newName]) {
            alert("Section name already exists.");
            return;
        }
        sections[newName] = { ...sections[oldName] };
        delete sections[oldName];
        renderSections();
    }
}

// Delete section
function deleteSection(sectionName) {
    if (confirm(`Delete "${sectionName}"?`)) {
        delete sections[sectionName];
        renderSections();
    }
}

// Toggle
function toggleContent(section) {
    const content = section.querySelector(".section-content");
    const toggleBtn = section.querySelector("button:nth-of-type(2)");

    if (content.style.display === "none") {
        content.style.display = "block";
        toggleBtn.textContent = "👁 Hide";
    } else {
        content.style.display = "none";
        toggleBtn.textContent = "👁 Show";
    }
}

// Add task
function addTask(sectionName) {
    const taskInput = document.getElementById(`${sectionName.replace(/\s+/g, "")}Task`);
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Task cannot be empty.");
        return;
    }

    sections[sectionName].tasks.push({
        text: taskText,
        checked: false
    });

    taskInput.value = "";
    renderTasks(sectionName);
}

// Render tasks
function renderTasks(sectionName) {
    const list = document.getElementById(`${sectionName.replace(/\s+/g, "")}List`);
    list.innerHTML = "";

    const bgColor = sections[sectionName].backgroundColor || "#ffffff"; // Get saved bg

    sections[sectionName].tasks.forEach((taskObj, index) => {
        const listItem = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = taskObj.checked;
        checkbox.id = `${sectionName.replace(/\s+/g, "")}Task${index}`;

        // Apply checked style
        if (taskObj.checked) {
            listItem.classList.add("completed");
        }

        checkbox.addEventListener("change", () => {
            sections[sectionName].tasks[index].checked = checkbox.checked;
            if (checkbox.checked) {
                listItem.classList.add("completed");
            } else {
                listItem.classList.remove("completed");
            }
            saveSections();
        });

        const label = document.createElement("label");
        label.htmlFor = checkbox.id;
        label.textContent = taskObj.text;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑";
        deleteBtn.addEventListener("click", () => {
            deleteTask(sectionName, index);
        });

        // 🟢 Match task background to section bg
        listItem.style.backgroundColor = bgColor;

        listItem.appendChild(checkbox);
        listItem.appendChild(label);
        listItem.appendChild(deleteBtn);
        list.appendChild(listItem);
    });

    saveSections();
}
// function renderTasks(sectionName) {
//     const list = document.getElementById(`${sectionName.replace(/\s+/g, "")}List`);
//     list.innerHTML = "";

//     sections[sectionName].tasks.forEach((taskObj, index) => {
//         const listItem = document.createElement("li");

//         const checkbox = document.createElement("input");
//         checkbox.type = "checkbox";
//         checkbox.checked = taskObj.checked;
//         checkbox.id = `${sectionName.replace(/\s+/g, "")}Task${index}`;

//         // Add/remove .completed class immediately on change
//         checkbox.addEventListener("change", () => {
//             sections[sectionName].tasks[index].checked = checkbox.checked;

//             if (checkbox.checked) {
//                 listItem.classList.add("completed");
//             } else {
//                 listItem.classList.remove("completed");
//             }

//             saveSections(); // Save state
//         });

//         const label = document.createElement("label");
//         label.htmlFor = checkbox.id;
//         label.textContent = taskObj.text;

//         const deleteBtn = document.createElement("button");
//         deleteBtn.textContent = "🗑";
//         deleteBtn.addEventListener("click", () => {
//             deleteTask(sectionName, index);
//         });

//         // Apply .completed if already checked
//         if (taskObj.checked) {
//             listItem.classList.add("completed");
//         }

//         listItem.appendChild(checkbox);
//         listItem.appendChild(label);
//         listItem.appendChild(deleteBtn);
//         list.appendChild(listItem);
//     });

//     saveSections();
// }

// Delete task
function deleteTask(sectionName, taskIndex) {
    sections[sectionName].tasks.splice(taskIndex, 1);
    renderTasks(sectionName);
}

// Open style modal
function openStyleModal(sectionName) {
    selectedSection = sectionName;
    const sectionData = sections[sectionName];

    document.getElementById("fontSelect").value = sectionData.fontFamily || "Arial";
    document.getElementById("fontSize").value = sectionData.fontSize || 16;
    document.getElementById("textColor").value = sectionData.color || "#000000";
    document.getElementById("bgColor").value = sectionData.backgroundColor || "#ffffff";

    document.getElementById("styleModal").style.display = "block";
}

// Apply style
function applyStyle() {
    if (!selectedSection) return;

    const font = document.getElementById("fontSelect").value;
    const size = parseInt(document.getElementById("fontSize").value);
    const color = document.getElementById("textColor").value;
    const bg = document.getElementById("bgColor").value;

    sections[selectedSection].fontFamily = font;
    sections[selectedSection].fontSize = size;
    sections[selectedSection].color = color;
    sections[selectedSection].backgroundColor = bg;

    saveSections();
    renderSections();
    closeStyleModal();
}

// Close modal
function closeStyleModal() {
    document.getElementById("styleModal").style.display = "none";
    selectedSection = null;
}

// Export
function exportData() {
    const dataStr = JSON.stringify(sections, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "sections.json";
    a.click();

    URL.revokeObjectURL(url);
}

// Import
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            sections = JSON.parse(e.target.result);
            saveSections();
            renderSections();
        } catch (err) {
            alert("Import failed.");
        }
    };
    reader.readAsText(file);
}

// Populate fonts dropdown (from fonts.js)
function populateFontDropdown() {
    const fontSelect = document.getElementById("fontSelect");
    googleFonts.forEach(font => {
        const option = document.createElement("option");
        option.value = font;
        option.textContent = font;
        option.style.fontFamily = font;
        fontSelect.appendChild(option);
    });
}