// Retrieve or initialize sections from localStorage
let sections = JSON.parse(localStorage.getItem("sections")) || {};

// Reference to the container holding all sections
const container = document.getElementById("sectionsContainer");

// Currently selected section for styling
let selectedSection = null;

// Render all sections on page load
document.addEventListener("DOMContentLoaded", function () {
    renderSections();
    populateFontDropdown();
});

// Function to render all sections




function renderSections() {
    container.innerHTML = ""; // Clear existing content

    Object.keys(sections).forEach(sectionName => {
        const sectionData = sections[sectionName];

        // Create section container
        const section = document.createElement("div");
        section.className = "section";
        section.id = `section-${sectionName.replace(/\s+/g, "")}`;

        

        // Apply saved styles
        applySavedStyles(section, sectionData);

        // Section title
        const title = document.createElement("span");
        title.className = "section-title";
        title.textContent = sectionName;
        title.addEventListener("click", () => editSectionName(sectionName));

        // Style button
        const styleBtn = document.createElement("button");
        styleBtn.textContent = "🎨 Style";
        styleBtn.addEventListener("click", () => openStyleModal(sectionName));

        // Toggle visibility button
        const toggleBtn = document.createElement("button");
        toggleBtn.textContent = "👁 Hide";
        toggleBtn.addEventListener("click", () => toggleContent(section));

        // Delete section button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑 Delete";
        deleteBtn.addEventListener("click", () => deleteSection(sectionName));

        // Section content container
        const content = document.createElement("div");
        content.className = "section-content";

        // Task list
        const list = document.createElement("ul");
        list.id = `${sectionName.replace(/\s+/g, "")}List`;

        // Input for new tasks
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Add task...";
        input.id = `${sectionName.replace(/\s+/g, "")}Task`;

        // Button to add new tasks
        const addBtn = document.createElement("button");
        addBtn.textContent = "➕ Add";
        addBtn.addEventListener("click", () => addTask(sectionName));

        // Assemble section content
        content.appendChild(list);
        content.appendChild(input);
        content.appendChild(addBtn);

        // Assemble section
        section.appendChild(title);
        section.appendChild(styleBtn);
        section.appendChild(toggleBtn);
        section.appendChild(deleteBtn);
        section.appendChild(content);

        // Add section to container
        container.appendChild(section);

        // Render tasks for the section
        renderTasks(sectionName);
    });

    // Save updated sections to localStorage
    saveSections();
}

// Function to apply saved styles to a section
function applySavedStyles(section, sectionData) {
    section.style.fontFamily = sectionData.fontFamily || "Arial";
    section.style.fontSize = sectionData.fontSize ? `${sectionData.fontSize}px` : "16px";
    section.style.color = sectionData.color || "#000000";
    section.style.backgroundColor = sectionData.backgroundColor || "#ffffff";

}

// Function to add a new section
function addSection() {
    const sectionInput = document.getElementById("newSection");
    const sectionName = sectionInput.value.trim();

    if (sectionName === "") {
        alert("Section name cannot be empty.");
        return;
    }

    if (sections[sectionName]) {
        alert("Section already exists.");
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

// Function to delete a section
function deleteSection(sectionName) {
    if (confirm(`Are you sure you want to delete the section "${sectionName}"?`)) {
        delete sections[sectionName];
        renderSections();
    }
}

// Function to edit a section name
function editSectionName(oldName) {
    const newName = prompt("Enter new section name:", oldName);

    if (newName && newName.trim() !== "" && newName !== oldName) {
        if (sections[newName]) {
            alert("A section with this name already exists.");
            return;
        }

        sections[newName] = { ...sections[oldName] };
        delete sections[oldName];
        renderSections();
    }
}

// Function to toggle the visibility of section content
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

// Function to add a task to a section
function addTask(sectionName) {
    const taskInput = document.getElementById(`${sectionName.replace(/\s+/g, "")}Task`);
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Task cannot be empty.");
        return;
    }

    sections[sectionName].tasks.push(taskText);
    taskInput.value = "";
    renderTasks(sectionName);
}

// Function to render tasks for a section
function renderTasks(sectionName) {
    const list = document.getElementById(`${sectionName.replace(/\s+/g, "")}List`);
    list.innerHTML = "";

    sections[sectionName].tasks.forEach((task, index) => {
        const listItem = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `${sectionName.replace(/\s+/g, "")}Task${index}`;
        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                listItem.classList.add("completed");
            } else {
                listItem.classList.remove("completed");
            }
        });

        const label = document.createElement("label");
        label.htmlFor = checkbox.id;
        label.textContent = task;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑";
        deleteBtn.addEventListener("click", () => {
            deleteTask(sectionName, index);
        });

        listItem.appendChild(checkbox);
        listItem.appendChild(label);
        listItem.appendChild(deleteBtn);
        list.appendChild(listItem);
    });

    saveSections();
}

// Function to delete a task from a section
function deleteTask(sectionName, taskIndex) {
    sections[sectionName].tasks.splice(taskIndex, 1);
    renderTasks(sectionName);
}

// Function to open the style modal for a section
// Function to open the style modal for a section
function openStyleModal(sectionName) {
    selectedSection = sectionName;
    const sectionData = sections[sectionName];

    // Pre-fill modal fields
    document.getElementById("fontSelect").value = sectionData.fontFamily || "Arial";
    document.getElementById("fontSize").value = sectionData.fontSize || 16;
    document.getElementById("textColor").value = sectionData.color || "#000000";
    document.getElementById("bgColor").value = sectionData.backgroundColor || "#ffffff";

    // Show modal
    document.getElementById("styleModal").style.display = "block";
}





// Function to apply styles and save
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




// Function to close modal
function closeStyleModal() {
    document.getElementById("styleModal").style.display = "none";
    selectedSection = null;
} 


// Save sections to localStorage
function saveSections() {
    localStorage.setItem("sections", JSON.stringify(sections));
}

// Export data
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

// Import data
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
            alert("Error importing file. Make sure it's valid JSON.");
        }
    };
    reader.readAsText(file);
}


// Dynamically populate font dropdown (from fonts.js)
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