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

	/**
	 * Добавляет новую задачу
	 *
	 * @param {string} type — тип задачи, 'individual' или 'command'
	 * @param {string} name — название задачи
	 * @param {string} description — описание задачи
	 * @return {number} Идентификатор добавленной задачи.
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

	/**
	 * Удаляет задачу
	 *
	 * @param {number} id — идентификатор задачи
	 * @return {array} Обновлённый массив задач
	 */
	removeTask(_id) {
		if (_id === undefined) {
			throw new Error('Для удаления задачи нужно передать её идентификатор');
		}

		const {state} = this;

		state.tasks = state.tasks.filter(({id}) => id !== _id);
		return state.tasks;
	}

	/**
	 * Возвращает задачу с переданным идентификатором
	 *
	 * @param {number} id — идентификатор задачи
	 * @return {object} Задача с нужным идентификатором
	 */
	getTask(_id) {
		return this.state.tasks.filter(({id}) => id === _id)[0];
	}
}
