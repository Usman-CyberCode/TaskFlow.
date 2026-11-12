document.addEventListener("DOMContentLoaded", () => {
    const taskForm = document.getElementById("taskForm");
    const taskPriority = document.getElementById("taskPriority");
    const taskList = document.getElementById("taskList");
    const taskInput = document.getElementById("taskInput");
    console.log("Script Loaded!");
    function addTask() {
        console.log("Add Task Function Called!");
        const taskName = taskInput.value.trim();
        const priority = taskPriority.value;
        if (taskName === "") {
            alert("Please enter a task!");
            return;
        }
        const taskItem = document.createElement("div");
        taskItem.className = "task-item";
        const taskInfo = document.createElement("div");
        taskInfo.className = "task-info";
        const heading = document.createElement("h4");
        heading.textContent = taskName;
        const description = document.createElement("p");
        description.textContent = "NEW TASK";
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-checkbox-input";
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-btn";
        taskInfo.appendChild(heading);
        taskInfo.appendChild(description);
        const priorityElement = document.createElement("span");
        priorityElement.className = `priority ${priority.toLowerCase()}`;
        priorityElement.textContent = priority;
        const dateElement = document.createElement("span");
        dateElement.className = "task-date";
        dateElement.textContent = "Today";
        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskInfo);
        taskItem.appendChild(priorityElement);
        taskItem.appendChild(dateElement);
        taskItem.appendChild(editButton);
        taskItem.appendChild(deleteButton);
        taskList.prepend(taskItem);
        taskInput.value = "";
        console.log("Task Added Successfully!");
    }
    function deleteTask(event) {
        const button = event.target;
        const taskItem = button.closest(".task-item");
        taskItem?.remove();
    }
    taskList.addEventListener("click", (event) => {
        const target = event.target;
        if (target.classList.contains("delete-btn")) {
            deleteTask(event);
        }
        if (target.classList.contains("edit-btn")) {
            editTask(event);
        }
    });
    function toggleTask(event) {
        const checkbox = event.target;
        const taskItem = checkbox.closest(".task-item");
        if (checkbox.checked) {
            console.log("Task Change Succed");
            taskItem?.classList.add("completed");
        }
        else {
            console.log("Tak In Progress");
            taskItem?.classList.remove("completed");
        }
    }
    taskList.addEventListener("change", (event) => {
        console.log("Checkbox Changed!");
        toggleTask(event);
    });
    taskForm.addEventListener("submit", (event) => {
        event.preventDefault();
        console.log("Form Submitted!");
        addTask();
    });
    function editTask(event) {
        const button = event.target;
        const taskItem = button.closest(".task-item");
        if (!taskItem)
            return;
        const heading = taskItem.querySelector("h4");
        const priorityElement = taskItem.querySelector(".priority");
        // Create input for task name
        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.value = heading.textContent || "";
        // Create select for priority
        const prioritySelect = document.createElement("select");
        ["High", "Medium", "Low"].forEach((priority) => {
            const option = document.createElement("option");
            option.value = priority;
            option.textContent = priority;
            prioritySelect.appendChild(option);
        });
        prioritySelect.value = priorityElement.textContent || "Medium";
        // Save button
        const saveButton = document.createElement("button");
        saveButton.textContent = "Save";
        saveButton.className = "savebtn";
        // Cancel button
        const cancelButton = document.createElement("button");
        cancelButton.textContent = "Cancel";
        cancelButton.className = "canclebtn";
        // Replace existing content
        heading.replaceWith(nameInput);
        priorityElement.replaceWith(prioritySelect);
        button.replaceWith(saveButton);
        taskItem.appendChild(cancelButton);
        // Save changes
        saveButton.addEventListener("click", () => {
            const newName = nameInput.value.trim();
            if (newName === "") {
                alert("Task name cannot be empty!");
                return;
            }
            const newHeading = document.createElement("h4");
            newHeading.textContent = newName;
            const newPriority = document.createElement("span");
            newPriority.className = `priority ${prioritySelect.value.toLowerCase()}`;
            newPriority.textContent = prioritySelect.value;
            nameInput.replaceWith(newHeading);
            prioritySelect.replaceWith(newPriority);
            saveButton.replaceWith(button);
            cancelButton.remove();
        });
        // Cancel editing
        cancelButton.addEventListener("click", () => {
            nameInput.replaceWith(heading);
            prioritySelect.replaceWith(priorityElement);
            saveButton.replaceWith(button);
            cancelButton.remove();
        });
    }
});
export {};
