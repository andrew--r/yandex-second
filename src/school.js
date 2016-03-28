const taskExample = {
 type: 'individual' || 'command',
 name: 'Название задачи',
 description: 'Описание задачи',
};

const state = {
	lastStudentId: null,
	lastMentorId: null,
	students: [],
	mentors: [],
	tasks: [],
};

export default class School {
	constructor() {
		this.state = {
			tasks: [],
			lastTaskId: 0,
		};
	}

	// Students
	getStudents() {}
	createStudent(student) {}
	removeStudent(id) {}

	// Mentors
	getMentors() {}
	createMentor(mentor) {}
	removeMentor(id) {}

	/**
	 *
	 * @param {string} type — тип задачи, 'individual' или 'command'
	 * @param {string} name — название задачи
	 * @param {string} description — описание задачи
	 */
	addTask(type, name, description) {
		if (type !== 'individual' && type !== 'command') {
			throw new Error('Неверный тип задачи');
		}

		if (name === undefined) {
			throw new Error('При создании задачи следует указать название');
		}

		this.state.tasks.push({
			type,
			name,
			description,
			id: ++this.state.lastTaskId,
		});

		return this.state.lastTaskId;
	}
}
