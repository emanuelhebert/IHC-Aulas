document.addEventListener("DOMContentLoaded", () => {
    const eventsContainer = document.getElementById("eventsContainer");
    const eventForm = document.getElementById("eventForm");
    const taskForm = document.getElementById("taskForm");
    const noEventsMessage = document.getElementById("noEventsMessage");
    let events = [];

    
    eventForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const eventName = document.getElementById("eventName").value;
        const eventDate = document.getElementById("eventDate").value;
        const newEvent = {
            id: Date.now(),
            name: eventName,
            date: eventDate,
            tasks: []
        };
        events.push(newEvent);
        renderEvents();
        eventForm.reset();
        const createEventModal = bootstrap.Modal.getInstance(document.getElementById('createEventModal'));
        createEventModal.hide();
    });

    
    function renderEvents() {
        eventsContainer.innerHTML = '';
        if (events.length === 0) {
            noEventsMessage.style.display = 'block';  
        } else {
            noEventsMessage.style.display = 'none';   
            events.forEach(event => {
                const eventCard = `
                    <div class="col-md-4">
                        <div class="card mb-4">
                            <div class="card-body">
                                <h5 class="card-title">${event.name}</h5>
                                <p class="card-text">Data: ${event.date}</p>
                                <button class="btn btn-danger" onclick="removeEvent(${event.id})">Remover Evento</button>
                                <button class="btn btn-success" onclick="openTaskModal(${event.id})">Adicionar Tarefa</button>
                                <div class="task-list mt-3">
                                    <h6>Tarefas:</h6>
                                    <ul id="taskList-${event.id}" class="list-group">
                                        ${event.tasks.map(task => `
                                            <li class="list-group-item">
                                                ${task.name} - ${task.dueDate}
                                                <button class="btn btn-danger btn-sm float-end" onclick="removeTask(${event.id}, '${task.name}')">Remover</button>
                                            </li>`).join('')}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                eventsContainer.innerHTML += eventCard;
            });
        }
    }

    
    window.openTaskModal = function(eventId) {
        document.getElementById('currentEventId').value = eventId;
        const taskModal = new bootstrap.Modal(document.getElementById('taskModal'));
        taskModal.show();
    }

    
    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const taskName = document.getElementById("taskName").value;
        const taskDueDate = document.getElementById("taskDueDate").value;
        const eventId = document.getElementById("currentEventId").value;
        const newTask = {
            name: taskName,
            dueDate: taskDueDate
        };
        const event = events.find(e => e.id == eventId);
        event.tasks.push(newTask);
        renderEvents();
        taskForm.reset();
        const taskModal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
        taskModal.hide();
    });

    
    window.removeTask = function(eventId, taskName) {
        const event = events.find(e => e.id === eventId);
        event.tasks = event.tasks.filter(task => task.name !== taskName);
        renderEvents();
    }

    
    window.removeEvent = function(eventId) {
        events = events.filter(event => event.id !== eventId);
        renderEvents();
    }
});
