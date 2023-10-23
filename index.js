document.addEventListener("DOMContentLoaded", function () {
    let selectedDate = "";
    const taskDateInput = document.getElementById("taskDate");
    const taskInput = document.getElementById("task");
    const taskTimeStartInput = document.getElementById("taskTimeStart");
    const taskTimeEndInput = document.getElementById("taskTimeEnd");
    const taskList = document.getElementById("taskList");
    const taskModal = document.getElementById("taskModal");
    const editTaskText = document.getElementById("editTaskText");
    const editTaskTimeStart = document.getElementById("editTaskTimeStart");
    const editTaskTimeEnd = document.getElementById("editTaskTimeEnd");
    const editTaskStatus = document.getElementById("editTaskStatus");
    const closeButton = document.querySelector(".close"); 

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    function updateTaskList() {
        taskList.innerHTML = `
            <li class="task-list-header">
                <span class="task-number">Номер</span>
                <span class="task-text">Зміст завдання</span>
                <span class="task-date">Дата</span>
                <span class="task-time-start">Час початку виконання</span>
                <span class="task-time-end">Час завершення виконання</span>
                <span class="task-status">Статус</span>
                <span class="task-actions">Дії</span>
            </li>
        `;

        const taskCounter = {}; 

        tasks.forEach(function (task, index) {
            if (task.date === selectedDate) {
                const taskNumber = taskCounter[selectedDate] || 0;

                const li = document.createElement("li");
                li.classList.add("task-list-item");
                li.dataset.index = index;
                li.dataset.status = task.status;
                li.innerHTML = `
                    <span class="task-number">${taskNumber + 1}</span>
                    <span class="task-text">${task.text}</span>
                    <span class="task-date">${task.date}</span>
                    <span class="task-time-start">${task.timeStart}</span>
                    <span class="task-time-end">${task.timeEnd}</span>
                    <span class="task-status">${task.status}</span>
                    <span class="task-actions">
                        <button class="edit" onclick="editTask(${index})">Редагувати</button>
                        <button class="delete" onclick="confirmDeleteTask(${index})">Видалити</button>
                    </span>
                `;
                taskList.appendChild(li);

                taskCounter[selectedDate] = taskNumber + 1;
            }
        });
    }

    function addTask() {
        const text = taskInput.value;
        const timeStart = taskTimeStartInput.value;
        const timeEnd = taskTimeEndInput.value;
        const status = "В черзі на виконання";

        if (text === "" || timeStart === "" || timeEnd === "") {
            alert("Будь ласка, заповніть всі поля.");
            return;
        }

        const task = {
            text,
            date: selectedDate,
            timeStart,
            timeEnd,
            status,
        };

        tasks.push(task);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        taskInput.value = "";
        taskTimeStartInput.value = "";
        taskTimeEndInput.value = "";
        updateTaskList();
    }

    function confirmDeleteTask(index) {
        if (confirm("Ви дійсно бажаєте видалити завдання?")) {
            deleteTask(index);
        }
    }

    function editTask(index) {
        const task = tasks[index];
        taskModal.style.display = "block";
        editTaskText.value = task.text;
        editTaskTimeStart.value = task.timeStart;
        editTaskTimeEnd.value = task.timeEnd;
        editTaskStatus.value = task.status;
        taskModal.dataset.taskIndex = index;
    }

    function updateTask() {
        const index = taskModal.dataset.taskIndex;
        if (index != null) {
            const text = editTaskText.value;
            const timeStart = editTaskTimeStart.value;
            const timeEnd = editTaskTimeEnd.value;
            const status = editTaskStatus.value;

            if (text === "" || timeStart === "" || timeEnd === "") {
                alert("Будь ласка, заповніть всі поля.");
                return;
            }

            tasks[index] = {
                text,
                date: selectedDate,
                timeStart,
                timeEnd,
                status,
            };
            localStorage.setItem("tasks", JSON.stringify(tasks));
            closeTaskModal();
        }
        updateTaskList();
    }

    function closeTaskModal() {
        taskModal.style.display = "none";
        editTaskText.value = "";
        editTaskTimeStart.value = "";
        editTaskTimeEnd.value = "";
        editTaskStatus.value = "В процесі виконання";
        delete taskModal.dataset.taskIndex;
    }

    function deleteTask(index) {
        tasks.splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        updateTaskList();
    }

    function changeDate() {
        selectedDate = taskDateInput.value;
        updateTaskList();
    }

    const addTaskButton = document.getElementById("addTaskButton");
    addTaskButton.addEventListener("click", addTask);

    const updateTaskButton = document.getElementById("updateTaskButton");
    updateTaskButton.addEventListener("click", updateTask);

    closeButton.addEventListener("click", closeTaskModal);

    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("edit")) {
            const index = e.target.parentElement.parentElement.dataset.index;
            editTask(index);
        }
        if (e.target.classList.contains("delete")) {
            const index = e.target.parentElement.parentElement.dataset.index;
            confirmDeleteTask(index);
        }
    });

    taskDateInput.addEventListener("change", changeDate);

    updateTaskList();
});
