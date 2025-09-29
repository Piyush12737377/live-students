// --- State Management ---
let currentFilteredStudents = [];
let clearedStudentIds = new Set();
let activeChatStudentId = null;

// --- Event Handlers ---

function handleChapterUpdate() {
    const selectedClass = classSelect.value;
    const selectedSubject = subjectSelect.value;

    topicSelect.innerHTML = '<option value="">Select Topic</option>';

    if (selectedClass && selectedSubject && studyData[selectedSubject]?.[selectedClass]) {
        const chapters = studyData[selectedSubject][selectedClass];
        updateDropdown(chapterSelect, chapters, 'Select Chapter');
    } else {
        chapterSelect.innerHTML = '<option value="">Select Chapter</option>';
    }
}

function handleTopicUpdate() {
    const selectedClass = classSelect.value;
    const selectedSubject = subjectSelect.value;
    const selectedChapter = chapterSelect.value;

    if (selectedClass && selectedSubject && selectedChapter && studyData[selectedSubject]?.[selectedClass]?.[selectedChapter]) {
        const topics = studyData[selectedSubject][selectedClass][selectedChapter].topics.reduce((acc, topic, index) => {
            acc[`${selectedChapter}-topic${index + 1}`] = { name: topic };
            return acc;
        }, {});
        updateDropdown(topicSelect, topics, 'Select Topic');
    } else {
        topicSelect.innerHTML = '<option value="">Select Topic</option>';
    }
}

function handleSetStatus() {
    const selectedChapterId = chapterSelect.value;

    if (selectedChapterId) {
        currentFilteredStudents = studentData.filter(student => student.studying.includes(selectedChapterId));
    } else {
        alert('Please select a Class, Subject, and Chapter first!');
        currentFilteredStudents = studentData;
    }
    renderStudentList(currentFilteredStudents, initialStudentView);
    renderStudentList(currentFilteredStudents, chatSidebarContainer);
}

function handleStudentCardClick(event) {
    const card = event.target.closest('.student-card');
    if (card) {
        renderStudentList(currentFilteredStudents, chatSidebarContainer);
        openChatWithUser(card.dataset.studentId, card.dataset.studentName);
    }
}

function handleClearDoubt() {
    if (activeChatStudentId) {
        clearedStudentIds.add(activeChatStudentId.toString());
        renderStudentList(currentFilteredStudents, chatSidebarContainer);
    }
}

function handleGlobalKeyPress(event) {
    const activeElement = document.activeElement;
    if (event.key.length === 1 && !['INPUT', 'SELECT', 'TEXTAREA'].includes(activeElement.tagName) && chatView.className !== 'hidden') {
        chatInputField.focus();
    }
}

// --- Initial Setup & Event Listeners ---

classSelect.addEventListener('change', handleChapterUpdate);
subjectSelect.addEventListener('change', handleChapterUpdate);
chapterSelect.addEventListener('change', handleTopicUpdate);
setStatusBtn.addEventListener('click', handleSetStatus);
initialStudentView.addEventListener('click', handleStudentCardClick);
chatSidebarContainer.addEventListener('click', handleStudentCardClick);
clearDoubtBtn.addEventListener('click', handleClearDoubt);
sendBtn.addEventListener('click', sendMessage);
chatInputField.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
});
window.addEventListener('keydown', handleGlobalKeyPress);

window.addEventListener('load', () => {
    currentFilteredStudents = studentData;
    renderStudentList(studentData, initialStudentView);
});
