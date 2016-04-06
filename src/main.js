export default class School {
	constructor() {
		// По-хорошему этот объект должен быть приватным,
		// но, к сожалению, в ES6 нет приватных свойств и методов класса.
		// Можно было бы обойтись IIFE с модулем внутри, но я хотел
		// использовать классы ES6.
		this.state = {
			tasks: [],
			students: [],
			teams: [],
			mentors: [],
			lastTaskId: 0,
			lastStudentId: 0,
			lastMentorId: 0,
		};
	}


	// TASKS

	/**
	 * Creates new task
	 *
	 * @param {string} type — task type, 'individual' or 'team'
	 * @param {string} name — task name
	 * @return {number} Unique task identifier.
	 */
	createTask(type, name) {
		if (!type || !name) {
			throw new Error('Both type and name of task must be specified');
		}

		if (typeof type !== 'string' || typeof name !== 'string') {
			throw new TypeError('Type and name of task must be a string');
		}

		if (type !== 'individual' && type !== 'team') {
			throw new Error('Unknown task type, expected \'individual\' or \'team\'');
		}

		const {state} = this;

		state.tasks.push({
			type,
			name,
			id: ++state.lastTaskId,
		});

		return state.lastTaskId;
	}

	/**
	 * Deletes task by its identifier
	 *
	 * @param {number} id — task identifier
	 * @return {School}
	 */
	deleteTask(id) {
		if (id === undefined) {
			throw new Error('Task identifier must be specified');
		}

		if (typeof id !== 'number') {
			throw new Error('Task identifier must be a number');
		}

		const task = this.getTask(id);
		if (!task) return this;

		this.state.tasks = this.state.tasks.filter((task) => task.id !== id);
		this.state[task.type === 'team' ? 'teams' : 'students'].forEach((executor) => {
			executor.tasks = executor.tasks.filter((task) => task.id !== id);
		});

		return this;
	}

	/**
	 * Returns task with specified identifier
	 *
	 * @param {number} id — task identifier
	 * @return {Object} Task with specified identifier.
	 */
	getTask(id) {
		if (id === undefined) {
			throw new Error('Task identifier must be specified');
		}

		if (typeof id !== 'number') {
			throw new Error('Task identifier must be a number');
		}
		
		return this.state.tasks.filter((task) => task.id === id)[0];
	}

	/**
	 * Assigns task to teams or students
	 *
	 * @param {number} id — task identifier
	 * @param {(number[]|string[])} executors — students or teams
	 * @return {School}
	 */
	assignTask(id, executors) {
		const taskType = this.getTask(id).type;
		
		executors
			// оставляем только исполнителей, подходящих к типу задачи
			.filter((executorId) => {
				const filterBy = (taskType === 'team') ? 'string' : 'number';
				return typeof executorId === filterBy;
			})
			.map((executorId) => this[(taskType === 'team') ? 'getTeam' : 'getStudent'](executorId))
			.forEach((executor) => {
				if (executor.tasks.filter((task) => task.id == id).length) return;
				executor.tasks.push({
					id,
					completed: false,
					score: null,
				});
			});

		return this;
	}

	/**
	 * Completes task
	 *
	 * @param {number} taskId — task identifier
	 * @param {(number|string)} executorId — student identifier or team name
	 * @param {number} score
	 * @return {School}
	 */
	completeTask(taskId, executorId, score) {
		if (taskId === undefined || executorId === undefined || score === undefined) {
			throw new Error('taskId, executorId and score are required to complete task');
		}

		if (typeof taskId !== 'number' || typeof score !== 'number') {
			throw new Error('taskId and score must be specified as a number');
		}

		if (score < 1 || score > 5) {
			throw new Error('score must be in range from 1 to 5');
		}

		const task = this.getTask(taskId);

		if (!task) {
			throw new Error('Unknown task');
		}

		if (task.type === 'team' && typeof executorId !== 'string') {
			throw new Error('executorId for task with type \'team\' must be a string');
		}

		if (task.type === 'individual' && typeof executorId !== 'number') {
			throw new Error('executorId for task with type \'individual\' must be a number');
		}

		const getMethodName = `get${task.type === 'team' ? 'Team' : 'Student'}`;

		this[getMethodName](executorId).tasks = this[getMethodName](executorId)
			.tasks
			.map((task) => {
				if (task.id === taskId && !task.completed) {
					task.completed = true;
					task.score = score;
				}

				return task;
			});

		return this;
	}


	// STUDENTS

	/**
	 * Creates new student
	 *
	 * @param {string} fullname — student full name
	 * @return {number} unique student id
	 */
	createStudent(fullname) {
		const {state} = this;

		state.students.push({
			fullname,
			id: ++state.lastStudentId,
			mentor: null,
			team: null,
			tasks: [],
			preferredMentors: [],
		});

		return state.lastStudentId;
	}

	/**
	 * Returns student with specified id if student exists
	 *
	 * @param {number} id — unique student id
	 * @return {Object} student or undefined
	 */
	getStudent(id) {
		return this.state.students.filter((student) => student.id === id)[0];
	}

	/**
	 * Deletes student
	 *
	 * @param {number} id — unique student id
	 * @return {School}
	 */
	deleteStudent(id) {
		this.state.students = this.state.students.filter((student) => student.id !== id);

		const teamsToDelete = [];

		this.state.teams.forEach((team) => {
			team.members = team.members.filter((member) => member !== id);
			if (team.members.length < 2) teamsToDelete.push(team.name);
		});

		teamsToDelete.forEach((teamName) => {
			this
				.getTeam(teamName)
				.members
				.forEach((id) => this.getStudent(id).team = null);
		});

		this.state.teams = this.state.teams.filter((team) => !~teamsToDelete.indexOf(team.name));

		return this;
	}

	// MENTORS

	/**
	 * Creates new mentor
	 *
	 * @param {string} fullname — mentor full name
	 * @return {number} unique mentor id
	 */
	createMentor(fullname) {
		const {state} = this;

		state.mentors.push({
			fullname,
			id: ++state.lastMentorId,
			preferredStudents: [],
			students: [],
		});

		return state.lastMentorId;
	}

	/**
	 * Returns student with specified id if student exists
	 *
	 * @param {number} id — unique student id
	 * @return {Object} student or undefined
	 */
	getMentor(id) {
		return this.state.mentors.filter((mentor) => mentor.id === id)[0];
	}

	/**
	 * Deletes mentor
	 *
	 * @param {number} id — unique mentor id
	 * @return {School}
	 */
	deleteMentor(id) {
		this.state.mentors = this.state.mentors.filter((mentor) => mentor.id !== id);
		return this;
	}


	// TEAMS

	/**
	 * Creates new students team
	 *
	 * @param {string} name — unique team name
	 * @param {number[]} members — team members
	 * @return {School}
	 */
	createTeam(name, members) {
		if (contains(this.state.teams, (team) => team.name === name)) return;
		if (!Array.isArray(members)) return;

		const freeMembers = members
			.filter((id) => !this.getStudent(id).team)
			.map((id) => {
				this.getStudent(id).team = name;
				return id;
			});

		if (freeMembers.length < 2) {
			throw new Error('Cannot create team with members who are already assigned to another team');
		}

		this.state.teams.push({
			name,
			members: freeMembers,
			tasks: [],
		});

		return this;
	}

	/**
	 * Returns team with specified name
	 *
	 * @param {string} name — team name
	 * @return {Object} Team with specified name.
	 */
	getTeam(name) {
		return this.state.teams.filter((team) => team.name === name)[0];
	}

	/**
	 * Deletes team with specified name
	 *
	 * @param {string} name — team name
	 * @return {School}
	 */
	deleteTeam(name) {
		if (!name || name.trim() === '') return;

		const teamToRemove = this.getTeam(name);

		teamToRemove.members.forEach((id) => {
			this.getStudent(id).team = null;
		});

		this.state.teams = this.state.teams.filter((team) => team.name !== name);
		return this;
	}


	// GETTERS

	/**
	 * Returns students list
	 *
	 * @return {Object[]}
	 */
	getStudents() {
		return this.state.students;
	}

	/**
	 * Returns mentors list
	 *
	 * @return {Object[]}
	 */
	getMentors() {
		return this.state.mentors;
	}

	/**
	 * Returns tasks list
	 *
	 * @return {Object[]}
	 */
	getTasks() {
		return this.state.tasks;
	}

	/**
	 * Returns teams list
	 *
	 * @return {Object[]}
	 */
	getTeams() {
		return this.state.teams;
	}


	// PRIORITIES

	/**
	 * Adds mentor or student to list of student or mentor priorities
	 *
	 * @param {Object} options
	 * @param {number} options.subjectId
	 * @param {string} options.subjectType — 'student' or 'mentor'
	 * @param {number} options.value — mentor or student identifier depending
	 * on options.subjectType
	 * @return {(number|Object)} Added value (if it doesn't exist in list) or undefined
	 */
	pushPriority(options) {
		const {subjectId, value} = options;
		const subjectType = capitalize(options.subjectType);
		const revertedSubject = getRevertedSubjectType(subjectType);

		if (!this[`get${revertedSubject}`](value)) {
			throw new Error(`${revertedSubject} with id ${value} doesn't exist`);
		}

		const preferredList = this[`get${subjectType}`](subjectId)[`preferred${revertedSubject}s`];

		if (!~preferredList.indexOf(value)) {
			preferredList.push(value);
			return value;
		}
	}

	/**
	 * Removes last mentor or student from list of student or mentor priorities
	 *
	 * @param {Object} options
	 * @param {number} options.subjectId
	 * @param {string} options.subjectType — 'student' or 'mentor'
	 * @return {Object[]}
	 */
	popPriority(options) {
		const {subjectId} = options;
		const subjectType = capitalize(options.subjectType);
		const revertedSubject = getRevertedSubjectType(subjectType);

		return this[`get${subjectType}`](subjectId)[`preferred${revertedSubject}s`].pop();
	}

	/**
	 * Add priority with specified index
	 *
	 * @param {Object} options
	 * @param {number} options.subjectId
	 * @param {string} options.subjectType — 'student' or 'mentor'
	 * @param {number} options.value — mentor or student identifier
	 * @param {number} index — where to insert new priority
	 * @return {School}
	 */
	insertPriority(options) {
		const {subjectId, value, index} = options;
		const subjectType = capitalize(options.subjectType);
		const revertedSubject = getRevertedSubjectType(subjectType);

		if (!this[`get${revertedSubject}`](value)) {
			throw new Error(`${revertedSubject} with id ${value} doesn't exist`);
		}

		const preferredList = this[`get${subjectType}`](subjectId)[`preferred${revertedSubject}s`];

		if (~preferredList.indexOf(value)) {
			this.removePriority({
				subjectId,
				subjectType,
				value
			});
		}

		preferredList.splice(index, 0, value);
		return this;
	}

	/**
	 * Removes specified priority from list of priorities
	 *
	 * @param {Object} options
	 * @param {number} options.subjectId
	 * @param {string} options.subjectType — 'student' or 'mentor'
	 * @param {number} options.value — mentor's or student's id to remove
	 * @return {number} Removed priority
	 */
	removePriority(options) {
		const {subjectId, value} = options;
		const subjectType = capitalize(options.subjectType);
		const revertedSubject = getRevertedSubjectType(subjectType);

		if (!this[`get${revertedSubject}`](value)) {
			throw new Error(`${revertedSubject} with id ${value} doesn't exist`);
		}

		const preferredList = this[`get${subjectType}`](subjectId)[`preferred${revertedSubject}s`];
		const realIndex = preferredList.indexOf(value);

		if (~realIndex) {
			return preferredList.splice(realIndex, 1)[0];
		}
	}

	/**
	 * Distributes students between mentors taking into account their priorities
	 *
	 * @return {School}
	 */
	distributePriorities() {
		const {mentors, students} = this.state;
		const averageMentorStudentsCount = Math.floor(students.length / mentors.length); // сколько студентов должно быть у каждого ментора
		const weightsTable = createWeightsTable(mentors, students).sort(sortByValues);
		const mentorsWithExtraStudents = [];
		let extraStudents = students.length % mentors.length;
		
		students.forEach((student) => {
			const pairs = weightsTable.filter((pair) => pair.studentId === student.id);
			let currentItem = 0;

			while (!student.mentor) {
				const mentorId = pairs[currentItem].mentorId;
				const mentor = this.getMentor(mentorId);
				const mentorStudentsCount = mentor.students.length;

				const isFullButExtraAvailable = (
					mentorStudentsCount >= averageMentorStudentsCount
					&& extraStudents
					&& !~mentorsWithExtraStudents.indexOf(mentorId)
				);
				const isntFull = mentorStudentsCount < averageMentorStudentsCount;

				if (isFullButExtraAvailable) {
					extraStudents--;
					mentorsWithExtraStudents.push(mentorId);
				}

				if (isntFull || isFullButExtraAvailable) {
					student.mentor = mentorId;
					mentor.students.push(student.id);
				}

				currentItem++;
			}
		});

		return this;
	}
}


// HELPERS

/**
 * Checks if array contains element that matches predicate
 *
 * @param {Array} array
 * @param {Function} predicate
 * @return {Boolean}
 */
function contains(array, predicate) {
	const result = array.filter(predicate);
	return Boolean(result.length);
}

/**
 * Returns string with first char in uppercase and other chars in lowercase
 *
 * @param {string} string
 * @return {string} Capitalized string.
 */
function capitalize(string) {
	return string[0].toUpperCase() + string.toLowerCase().slice(1);
}

/**
 * @param {string} subject — 'Mentor' or 'Student'
 * @return {string} Reverted subject
 */
function getRevertedSubjectType(subject) {
	return subject === 'Mentor' ? 'Student' : 'Mentor';
}

/**
 * Function for sorting list of objects by its key 'value' in descending order
 *
 * @return {number} Difference between b.value and a.value
 */
function sortByValues(a, b) {
	return b.value - a.value;
}

/**
 * Creates weights table for mentors and students by priorities
 *
 * @return {Object[]} Weigts table.
 */
function createWeightsTable(mentors, students) {
	const weightsTable = [];

	mentors.forEach((mentor) => {
		mentor.preferredStudents.forEach((studentId, index, prioritiesList) => {
			weightsTable.push({
				studentId,
				mentorId: mentor.id,
				// вес пары без учёта приоритетов студентов
				value: prioritiesList.length - index,
			});
		});

		// Учитываем студентов, не добавленных в список приоритетов
		students.forEach((student) => {
			if (!~mentor.preferredStudents.indexOf(student.id)) {
				weightsTable.push({
					mentorId: mentor.id,
					studentId: student.id,
					value: 0,
				});
			}
		});
	});

	students.forEach((student) => {
		student.preferredMentors.forEach((mentorId, index, prioritiesList) => {
			const pair = weightsTable.filter((item) => {
				return item.mentorId === mentorId && item.studentId === student.id;
			})[0];

			pair.value += prioritiesList.length - index;
		});

		// не добавленных в приоритеты менторов учитывать не нужно, с ними уже
		// есть пара
	});

	return weightsTable;
}
