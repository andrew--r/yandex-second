export default class School {
	constructor() {
		this.state = {
			tasks: [],
			lastTaskId: 0,
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

		this.state.tasks.push({
			type,
			name,
			id: ++this.state.lastTaskId,
		});

		return this.state.lastTaskId;
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
}
