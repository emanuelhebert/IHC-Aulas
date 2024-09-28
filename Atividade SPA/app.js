document.addEventListener("DOMContentLoaded", () => {
    const eventsContainer = document.getElementById("eventsContainer");
    const eventForm = document.getElementById("eventForm");
    const taskForm = document.getElementById("taskForm");
    const noEventsMessage = document.getElementById("noEventsMessage");
    const API_URL = "http://localhost:3000/eventos";
    let events = [];

    // Função para carregar eventos da API
    async function loadEvents() {
        try {
            const response = await fetch(API_URL);
            events = await response.json();
            renderEvents();
        } catch (error) {
            console.error("Erro ao carregar eventos:", error);
        }
    }

    loadEvents();

    // Adiciona um novo evento
    eventForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const eventName = document.getElementById("eventName").value;
        const eventDate = document.getElementById("eventDate").value;

        const newEvent = {
            name: eventName,
            date: eventDate,
            tasks: [], // Inicializa tarefas como um array vazio
        };

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newEvent),
            });
            const createdEvent = await response.json();
            events.push(createdEvent);
            renderEvents();
            eventForm.reset();

            const createEventModal = bootstrap.Modal.getInstance(document.getElementById("createEventModal"));
            createEventModal.hide();
        } catch (error) {
            console.error("Erro ao criar evento:", error);
        }
    });

    // Renderiza os eventos na interface
    function renderEvents() {
        eventsContainer.innerHTML = "";
        noEventsMessage.style.display = events.length === 0 ? "block" : "none";

        events.forEach((event) => {
            const eventCard = `
                <div class="col-md-4">
                    <div class="card mb-4">
                        <div class="card-body">
                            <h5 class="card-title">${event.name}</h5>
                            <p class="card-text">Data: ${event.date}</p>
                            <button class="btn btn-danger" onclick="removeEvent('${event.id}')">Remover Evento</button>
                            <button class="btn btn-success" onclick="openTaskModal('${event.id}')">Adicionar Tarefa</button>
                            <h6>Tarefas:</h6>
                            <ul id="taskList-${event.id}" class="list-group">
                                ${event.tasks.map(task => `
                                    <li class="list-group-item">
                                        <strong>${task.name}</strong> - ${task.dueDate}
                                        <button class="btn btn-danger btn-sm float-end" onclick="removeTask('${event.id}', '${task.id}')">Remover</button>
                                    </li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>`;
            eventsContainer.innerHTML += eventCard;
        });
    }

    // Remove um evento
    window.removeEvent = async function (eventId) {
        try {
            await fetch(`${API_URL}/${eventId}`, {
                method: "DELETE",
            });
            events = events.filter((event) => event.id !== eventId);
            renderEvents();
        } catch (error) {
            console.error("Erro ao remover evento:", error);
        }
    };

    // Abre o modal para adicionar uma tarefa
    window.openTaskModal = function (eventId) {
        document.getElementById("currentEventId").value = eventId;
        const taskModal = new bootstrap.Modal(document.getElementById("taskModal"));
        taskModal.show();
    };


    taskForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const taskName = document.getElementById("taskName").value;
        const taskDueDate = document.getElementById("taskDueDate").value;
        const eventId = document.getElementById("currentEventId").value;

        const newTask = {
            id: Math.random().toString(36).substr(2, 5),
            name: taskName,
            dueDate: taskDueDate,
        };

        const eventIndex = events.findIndex(event => event.id === eventId);
        if (eventIndex > -1) {
            events[eventIndex].tasks.push(newTask);
            
            try {
                await fetch(`${API_URL}/${eventId}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ tasks: events[eventIndex].tasks }), // Atualiza apenas a lista de tarefas
                });
                renderEvents();
                taskForm.reset();
    
                const taskModal = bootstrap.Modal.getInstance(document.getElementById("taskModal"));
                taskModal.hide();
            } catch (error) {
                console.error("Erro ao adicionar tarefa ao evento:", error);
            }
        }
    });

    window.removeTask = async function (eventId, taskId) {
        const eventIndex = events.findIndex(event => event.id === eventId);
        if (eventIndex > -1) {
            // Filtra a tarefa que deve ser removida
            events[eventIndex].tasks = events[eventIndex].tasks.filter(task => task.id !== taskId);
    
            // Atualiza o evento no servidor
            try {
                await fetch(`${API_URL}/${eventId}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ tasks: events[eventIndex].tasks }), // Atualiza apenas a lista de tarefas
                });
                renderEvents();
            } catch (error) {
                console.error("Erro ao remover tarefa do evento:", error);
            }
        }
    };
});
