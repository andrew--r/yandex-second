export default class School {
	constructor() {
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
	 * @param {Object} config
	 * @param {string} config.type — task type, 'individual' or 'team'
	 * @param {string} config.name — task name
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

		const {state} = this;

		state.tasks = state.tasks.filter((task) => task.id !== id);
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


	// STUDENTS

	/**
	 * Adds new student
	 *
	 * @param {string} fullname — student full name
	 * @return {number} unique student id
	 */
	addStudent(fullname) {
		const {state} = this;

		state.students.push({
			fullname,
			id: ++state.lastStudentId,
			tasks: [],
			team: null,
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
	 * Removes student
	 *
	 * @param {number} id — unique student id
	 * @return {School}
	 */
	removeStudent(id) {
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
	 * Adds new mentor
	 *
	 * @param {string} fullname — mentor full name
	 * @return {number} unique mentor id
	 */
	addMentor(fullname) {
		const {state} = this;

		state.mentors.push({
			fullname,
			id: ++state.lastMentorId,
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
	 * Removes mentor
	 *
	 * @param {number} id — unique mentor id
	 * @return {School}
	 */
	removeMentor(id) {
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