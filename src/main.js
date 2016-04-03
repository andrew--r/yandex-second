export default class School {
	constructor() {
		this.state = {
			tasks: [],
			students: [],
			teams: [],
			lastTaskId: 0,
			lastStudentId: 0,
		};
	}

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


	/**
	 * Creates new students team
	 *
	 * @param {string} name — unique team name
	 * @param {number[]} members — team members
	 * @return {School}
	 */
	createTeam(name, members) {
		if (this.state.teams.filter((team) => team.name === name).length) return;
		if (!Array.isArray(members)) return;

		this.state.teams.push({
			name,
			members,
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
	 * Creates new student
	 *
	 * @param {string} fullname — student full name
	 * @return {number} student id
	 */
	createStudent(fullname) {
		if (!fullname || typeof fullname !=='string' || fullname.trim() === '') {
			throw new Error('Student fullname must be specified');
		}

		const {state} = this;

		state.students.push({
			fullname,
			id: ++state.lastStudentId,
			tasks: [],
		});

		return state.lastStudentId;
	}

	getStudent(id) {
		return this.state.students.filter((student) => student.id === id)[0];
	}
}
