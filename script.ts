
export { };

document.addEventListener("DOMContentLoaded", () => {
    const taskForm = document.getElementById("taskForm") as HTMLFormElement;
    const taskPriority = document.getElementById("taskPriority") as HTMLSelectElement;
    const taskList = document.getElementById("taskList") as HTMLDivElement;
    const taskInput = document.getElementById("taskInput") as HTMLInputElement;
    const searchInput = document.getElementById("searchInput") as HTMLInputElement;
    const filterButtons = document.querySelectorAll(".filter-btn");
    const totalTasksElement = document.getElementById("totalTasks") as HTMLHeadingElement;
    const inProgressTasksElement = document.getElementById("inProgressTasks") as HTMLHeadingElement;
    const completedTasksElement = document.getElementById("completedTasks") as HTMLHeadingElement;
    const progressPercentageElement = document.getElementById("progressPercentage") as HTMLHeadingElement;
    const progressCompletedElement = document.getElementById("progressCompleted") as HTMLElement;
    const progressInProgressElement = document.getElementById("progressInProgress") as HTMLElement;
    const progressRemainingElement = document.getElementById("progressRemaining") as HTMLElement;
    const progressCircleElement = document.querySelector(".progress-circle") as HTMLDivElement;
    const taskStatus = document.getElementById("taskStatus") as HTMLSelectElement;
    const notStartedTasksElement = document.getElementById("notStartedTasks") as HTMLHeadingElement;

    let currentFilter = "all";
    console.log("Script Loaded!");


    let tasks: {
        title: string;
        priority: string;
        completed: boolean;
        status: string;
    }[] = [];

    function addTask() {


        const taskName = taskInput.value.trim();
        const priority = taskPriority.value;
        const status = taskStatus.value;
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
        description.textContent = status.replace("-", " ").toUpperCase();

        const checkboxLabel = document.createElement("label");
        checkboxLabel.className = "task-checkbox";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = status === "completed";

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
            completed: status === "completed",
            status: status
        };

        console.log(taskData);
        tasks.push(taskData);
        console.log(tasks);

        saveTasks();
        updateStats();

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
            const status = task.status || (task.completed ? "completed" : "in-progress");
            description.textContent = status.replace("-", " ").toUpperCase();

            const priorityElement = document.createElement("span");
            priorityElement.className = `priority ${task.priority.toLowerCase()}`;
            priorityElement.textContent = task.priority;

            const dateElement = document.createElement("span");
            dateElement.className = "task-date";
            dateElement.textContent = "Today";

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


            taskItem.appendChild(checkboxLabel);
            checkboxLabel.appendChild(checkbox);
            checkboxLabel.appendChild(checkmark);
            taskInfo.appendChild(heading);
            taskInfo.appendChild(description);
            dropdown.appendChild(editButton);
            dropdown.appendChild(deleteButton);
            menuContainer.appendChild(menuButton);
            menuContainer.appendChild(dropdown);

            taskItem.appendChild(taskInfo);
            taskItem.appendChild(priorityElement);
            taskList.appendChild(taskItem);
            taskItem.appendChild(dateElement);
            taskItem.appendChild(menuContainer);


            taskList.prepend(taskItem);
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

        const taskTitle = taskItem?.querySelector("h4")?.textContent;

        tasks = tasks.filter((task) => task.title !== taskTitle);

        saveTasks();
        updateStats();

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

            task.status = checkbox.checked
                ? "completed"
                : "in-progress";

            saveTasks();
            applyFilter();
            updateStats();
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
            const oldName = heading.textContent;
            const task = tasks.find((t) => t.title === oldName);

            if (task) {
                task.title = newName;
                task.priority = prioritySelect.value;
                saveTasks();
            }


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
    function searchTasks() {
        const searchValue = searchInput.value.toLowerCase().trim();

        const taskItems = taskList.querySelectorAll(".task-item");

        taskItems.forEach((item) => {
            const title = item.querySelector("h4")?.textContent?.toLowerCase() || "";

            if (title.includes(searchValue)) {
                (item as HTMLElement).style.display = "";
            } else {
                (item as HTMLElement).style.display = "none";
            }
        });
    }
    searchInput.addEventListener("input", () => {
        searchTasks();
    });
    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            console.log(button.textContent);
        });
    });
    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {

            const filterText = button.textContent?.trim();

            if (filterText === "All Tasks") {
                currentFilter = "all";
            }
            else if (filterText === "In Progress") {
                currentFilter = "progress";
            }
            else if (filterText === "Completed") {
                currentFilter = "completed";
            }
            else if (filterText === "Not Started") {
    currentFilter = "not-started";
}
            applyFilter();
            filterButtons.forEach((btn) => {
                btn.classList.remove("selected");
            });

            button.classList.add("selected");
        });
    });
    function applyFilter() {
    const taskItems = taskList.querySelectorAll(".task-item");

    taskItems.forEach((item) => {
        const isCompleted = item.classList.contains("completed");

        const description = item.querySelector("p")?.textContent?.trim();

        if (currentFilter === "all") {
            (item as HTMLElement).style.display = "";
        }
        else if (currentFilter === "progress") {
            (item as HTMLElement).style.display =
                description === "IN PROGRESS" ? "" : "none";
        }
        else if (currentFilter === "not-started") {
            (item as HTMLElement).style.display =
                description === "NOT STARTED" ? "" : "none";
        }
        else if (currentFilter === "completed") {
            (item as HTMLElement).style.display =
                isCompleted ? "" : "none";
        }
    });
}
    function updateStats() {

        const total = tasks.length;

        const completed = tasks.filter(
            (task) => task.status === "completed" || (!task.status && task.completed)
        ).length;

        const inProgress = tasks.filter(
            (task) => task.status === "in-progress"
        ).length;

        const notStarted = tasks.filter(
            (task) => task.status === "not-started"
        ).length;
        const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
        progressPercentageElement.textContent = `${percentage}%`;
        progressCircleElement.style.background =
            `conic-gradient(var(--primary) 0% ${percentage}%, #eeeafc ${percentage}% 100%)`;
        progressCompletedElement.textContent = `${completed} Tasks`;
        progressInProgressElement.textContent = `${inProgress} Tasks`;
progressRemainingElement.textContent = `${total - completed} Tasks`;        
        totalTasksElement.textContent = total.toString();
        completedTasksElement.textContent = completed.toString();
        inProgressTasksElement.textContent = inProgress.toString();
        notStartedTasksElement.textContent = notStarted.toString();

    }



    loadTasks();
    renderTasks();
    updateStats();
});
