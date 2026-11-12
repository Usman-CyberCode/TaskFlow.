// export { };
document.addEventListener("DOMContentLoaded", () => {
    const taskForm = document.getElementById("taskForm");
    const taskPriority = document.getElementById("taskPriority");
    const taskList = document.getElementById("taskList");
    const taskInput = document.getElementById("taskInput");
    console.log("script loaded");
    taskForm.addEventListener("submit", (event) => {
        event.preventDefault();
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
        const heading = document.createElement("h4 ");
        heading.textContent = taskName;
        const discription = document.createElement("p");
        discription.textContent = "NEW TASK";
        taskInfo.appendChild(heading);
        taskInfo.appendChild(discription);
        const priorityElement = document.createElement("span");
        priorityElement.className = `priority ${priority.toLowerCase()}`;
        priorityElement.textContent = priority;
        const dateElement = document.createElement("span");
        dateElement.className = "task-date";
        dateElement.textContent = "Today";
        taskItem.appendChild(taskInfo);
        taskItem.appendChild(priorityElement);
        taskItem.appendChild(dateElement);
        taskList.prepend(taskItem);
        taskInput.value = "";
    });
});
export { };
