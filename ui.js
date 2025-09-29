// DOM Element References
const classSelect = document.getElementById('class-select');
const subjectSelect = document.getElementById('subject-select');
const chapterSelect = document.getElementById('chapter-select');
const topicSelect = document.getElementById('topic-select');
const setStatusBtn = document.getElementById('set-status-btn');
const chatHeader = document.getElementById('chat-header');
const chatWindow = document.getElementById('chat-window');
const sendBtn = document.getElementById('send-btn');
const chatInputField = document.getElementById('chat-input-field');
const initialStudentView = document.getElementById('initial-student-view');
const chatView = document.getElementById('chat-view');
const chatSidebarContainer = document.getElementById('chat-sidebar-container');
const clearDoubtBtn = document.getElementById('clear-doubt-btn');

function sendMessage() {
    const messageText = chatInputField.value.trim();

    if (messageText === '') {
        return; // Don't send empty messages
    }

    const messageElement = document.createElement('div');
    messageElement.className = 'message sent';
    messageElement.innerHTML = `
        <div>
            ${messageText}
            <span class="timestamp">${getCurrentTime()}</span>
        </div>
    `;

    chatWindow.appendChild(messageElement);
    chatInputField.value = ''; // Clear the input
    chatWindow.scrollTop = chatWindow.scrollHeight; // Scroll to the latest message
}

function openChatWithUser(studentId, studentName) {
    // Show chat view and hide initial view
    initialStudentView.classList.add('hidden');
    chatView.classList.remove('hidden');

    // Set the active chat user
    activeChatStudentId = studentId;

    // Update chat header
    chatHeader.textContent = `Chat with ${studentName}`;

    // Load dummy messages
    chatWindow.innerHTML = `
        <div class="message received">
            <strong>${studentName}</strong>
            <div>
                Hey! I saw you're also studying this chapter. Stuck on anything?
                <span class="timestamp">${getCurrentTime()}</span>
            </div>
        </div>
        <div class="message sent">
            <div>
                Yeah, just starting out. How about you?
                <span class="timestamp">${getCurrentTime()}</span>
            </div>
        </div>
    `;
    chatInputField.focus();
}

function renderStudentList(students, container) {
    container.innerHTML = ''; // Clear current list
    if (students.length === 0) {
        container.innerHTML = '<p style="padding: 10px; text-align: center; color: var(--dark-gray);">No students found.</p>';
        return;
    }

    students.forEach(student => {
        const card = document.createElement('div');
        card.className = 'student-card';
        card.dataset.studentId = student.id;
        card.dataset.studentName = student.name;

        let buttonHtml;
        if (clearedStudentIds.has(student.id.toString())) {
            card.classList.add('doubt-cleared');
            buttonHtml = `<span class="cleared-indicator">
                <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"></path></svg>
            </span>`;
        } else {
            buttonHtml = `<button class="chat-btn" data-student-id="${student.id}" data-student-name="${student.name}">
                <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"></path></svg>
            </button>`;
        }

        card.innerHTML = `
            <div><span class="status-dot"></span><span class="student-name">${student.name}</span></div>
            ${buttonHtml}
        `;
        container.appendChild(card);
    });
}

function updateDropdown(selectElement, data, placeholder) {
    selectElement.innerHTML = `<option value="">${placeholder}</option>`;
    for (const id in data) {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = data[id].name || data[id];
        selectElement.appendChild(option);
    }
}
