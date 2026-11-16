
export { };

document.addEventListener("DOMContentLoaded", () => {
    const taskForm = document.getElementById("taskForm") as HTMLFormElement;
    const taskPriority = document.getElementById("taskPriority") as HTMLSelectElement;
    const taskList = document.getElementById("taskList") as HTMLDivElement;
    const taskInput = document.getElementById("taskInput") as HTMLInputElement;

    console.log("Script Loaded!");


    let tasks: {
        title: string;
        priority: string;
        completed: boolean;
    }[] = [];

    function addTask() {


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

        const checkboxLabel = document.createElement("label");
        checkboxLabel.className = "task-checkbox";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";

        const checkmark = document.createElement("span");
        checkmark.className = "checkmark";

        checkboxLabel.appendChild(checkbox);
        checkboxLabel.appendChild(checkmark);

        const menuContainer = document.createElement("div");
        menuContainer.className = "task-menu-container";

        const menuButton = document.createElement("button");
        menuButton.className = "task-menu";
        menuButton.textContent = "•••";

        const dropdown = document.createElement("div");
        dropdown.className = "task-dropdown";

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "dropdown-edit";

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "dropdown-delete";

        dropdown.appendChild(editButton);
        dropdown.appendChild(deleteButton);

        menuContainer.appendChild(menuButton);
        menuContainer.appendChild(dropdown);

        taskInfo.appendChild(heading);
        taskInfo.appendChild(description);

        const priorityElement = document.createElement("span");
        priorityElement.className = `priority ${priority.toLowerCase()}`;
        priorityElement.textContent = priority;

        const dateElement = document.createElement("span");
        dateElement.className = "task-date";
        dateElement.textContent = "Today";

        taskItem.appendChild(checkboxLabel);
        taskItem.appendChild(taskInfo);
        taskItem.appendChild(priorityElement);
        taskItem.appendChild(dateElement);
        taskItem.appendChild(menuContainer);

        const taskData = {
            title: taskInput.value.trim(),
            priority: taskPriority.value,
            completed: false
        };

        console.log(taskData);
        tasks.push(taskData);
        console.log(tasks);

        saveTasks();

        taskList.prepend(taskItem);
        taskInput.value = "";
        console.log("Task Added Successfully!");
    }
    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    function loadTasks() {
        const savedTasks = localStorage.getItem("tasks");

        if (savedTasks) {
            tasks = JSON.parse(savedTasks);
        }
    } function renderTasks() {
        taskList.innerHTML = "";

        tasks.forEach((task) => {
            const taskItem = document.createElement("div");
            taskItem.className = "task-item";
            if (task.completed) {
                taskItem.classList.add("completed");
            }

            const checkboxLabel = document.createElement("label");
            checkboxLabel.className = "task-checkbox";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;

            const checkmark = document.createElement("span");
            checkmark.className = "checkmark";

          
            const taskInfo = document.createElement("div");
            taskInfo.className = "task-info";

            const heading = document.createElement("h4");
            heading.textContent = task.title;

            const description = document.createElement("p");
            description.textContent = "NEW TASK";

            const priorityElement = document.createElement("span");
            priorityElement.className = `priority ${task.priority.toLowerCase()}`;
            priorityElement.textContent = task.priority;

            const dateElement = document.createElement("span");
            dateElement.className = "task-date";
            dateElement.textContent = "Today";

            taskItem.appendChild(checkboxLabel);
            checkboxLabel.appendChild(checkbox);
            checkboxLabel.appendChild(checkmark);

            taskInfo.appendChild(heading);
            taskInfo.appendChild(description);

            taskItem.appendChild(taskInfo);
            taskItem.appendChild(priorityElement);
            taskList.appendChild(taskItem);
            taskItem.appendChild(dateElement);


        });
    }

    let currentlyEditing: HTMLElement | null = null;

    taskList.addEventListener("click", (event) => {
        const target = event.target as HTMLElement;
        if (target.classList.contains("task-menu")) {
            const currentMenu = target.nextElementSibling as HTMLElement;
            document.querySelectorAll(".task-dropdown").forEach((menu) => {
                if (menu !== currentMenu) {
                    menu.classList.remove("show");
                }
            });
            currentMenu.classList.toggle("show");
        }
        if (target.classList.contains("dropdown-edit")) {
            if (currentlyEditing) {
                alert("Please save or cancel the current task first!");
                return;
            }
            const taskItem = target.closest(".task-item") as HTMLElement;
            taskItem.querySelector(".task-dropdown")?.classList.remove("show");
            currentlyEditing = taskItem;
            editTask(event);
        }
        if (target.classList.contains("dropdown-delete")) {
            if (currentlyEditing) {
                alert("Please save or cancel editing first!");
                return;
            }

            deleteTask(target);
        }
    });
    function deleteTask(target: HTMLElement) {
        const taskItem = target.closest(".task-item");
        taskItem?.remove();
    }

    function toggleTask(event: Event) {
        const checkbox = event.target as HTMLInputElement;
        const taskItem = checkbox.closest(".task-item");
        if (checkbox.checked) {
            console.log("Task Change Succed");
            taskItem?.classList.add("completed");
        }
        else {
            console.log("Tak In Progress");
            taskItem?.classList.remove("completed");
        }
        const taskTitle = taskItem?.querySelector("h4")?.textContent;

const task = tasks.find((t) => t.title === taskTitle);

if (task) {
    task.completed = checkbox.checked;
    saveTasks();
}

    }
    taskList.addEventListener("change", (event) => {
        console.log("Checkbox Changed!");
        toggleTask(event);
    })

    taskForm.addEventListener("submit", (event) => {
        event.preventDefault();
        console.log("Form Submitted!");
        addTask();
    });

    function editTask(event: Event) {
        const button = event.target as HTMLButtonElement;
        const taskItem = button.closest(".task-item") as HTMLElement;
        if (!taskItem) return;

        const heading = taskItem.querySelector("h4") as HTMLHeadingElement;
        const priorityElement = taskItem.querySelector(".priority") as HTMLSpanElement;
        const menuContainer = taskItem.querySelector(".task-menu-container") as HTMLDivElement;

        menuContainer.style.display = "none";

        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.value = heading.textContent || "";

        const prioritySelect = document.createElement("select");

        ["High", "Medium", "Low"].forEach((priority) => {
            const option = document.createElement("option");
            option.value = priority;
            option.textContent = priority;
            prioritySelect.appendChild(option);
        });

        prioritySelect.value = priorityElement.textContent || "Medium";

        const saveButton = document.createElement("button");
        saveButton.textContent = "Save";
        saveButton.className = "save-btn";

        const cancelButton = document.createElement("button");
        cancelButton.textContent = "Cancel";
        cancelButton.className = "cancel-btn";

        heading.replaceWith(nameInput);
        priorityElement.replaceWith(prioritySelect);

        taskItem.appendChild(saveButton);
        taskItem.appendChild(cancelButton);

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

            saveButton.remove();
            cancelButton.remove();

            menuContainer.style.display = "";

            currentlyEditing = null;
        });

        cancelButton.addEventListener("click", () => {

            nameInput.replaceWith(heading);
            prioritySelect.replaceWith(priorityElement);

            saveButton.remove();
            cancelButton.remove();

            menuContainer.style.display = "";

            currentlyEditing = null;
        });
    }

    loadTasks();
    renderTasks();
});
