'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var School = function () {
	function School() {
		_classCallCheck(this, School);

		this.state = {
			tasks: [],
			students: [],
			teams: [],
			lastTaskId: 0,
			lastStudentId: 0
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


	_createClass(School, [{
		key: 'createTask',
		value: function createTask(type, name) {
			if (!type || !name) {
				throw new Error('Both type and name of task must be specified');
			}

			if (typeof type !== 'string' || typeof name !== 'string') {
				throw new TypeError('Type and name of task must be a string');
			}

			if (type !== 'individual' && type !== 'team') {
				throw new Error('Unknown task type, expected \'individual\' or \'team\'');
			}

			var state = this.state;


			state.tasks.push({
				type: type,
				name: name,
				id: ++state.lastTaskId
			});

			return state.lastTaskId;
		}

		/**
   * Deletes task by its identifier
   *
   * @param {number} id — task identifier
   * @return {School}
   */

	}, {
		key: 'deleteTask',
		value: function deleteTask(id) {
			if (id === undefined) {
				throw new Error('Task identifier must be specified');
			}

			if (typeof id !== 'number') {
				throw new Error('Task identifier must be a number');
			}

			var state = this.state;


			state.tasks = state.tasks.filter(function (task) {
				return task.id !== id;
			});
			return this;
		}

		/**
   * Returns task with specified identifier
   *
   * @param {number} id — task identifier
   * @return {Object} Task with specified identifier.
   */

	}, {
		key: 'getTask',
		value: function getTask(id) {
			if (id === undefined) {
				throw new Error('Task identifier must be specified');
			}

			if (typeof id !== 'number') {
				throw new Error('Task identifier must be a number');
			}

			return this.state.tasks.filter(function (task) {
				return task.id === id;
			})[0];
		}

		/**
   * Assigns task to teams or students
   *
   * @param {number} id — task identifier
   * @param {(number[]|string[])} executors — students or teams
   * @return {School}
   */

	}, {
		key: 'assignTask',
		value: function assignTask(id, executors) {
			var _this = this;

			var taskType = this.getTask(id).type;

			executors
			// оставляем только исполнителей, подходящих к типу задачи
			.filter(function (executorId) {
				var filterBy = taskType === 'team' ? 'string' : 'number';
				return (typeof executorId === 'undefined' ? 'undefined' : _typeof(executorId)) === filterBy;
			}).map(function (executorId) {
				return _this[taskType === 'team' ? 'getTeam' : 'getStudent'](executorId);
			}).forEach(function (executor) {
				if (executor.tasks.filter(function (task) {
					return task.id == id;
				}).length) return;
				executor.tasks.push({
					id: id,
					completed: false,
					score: null
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

	}, {
		key: 'createTeam',
		value: function createTeam(name, members) {
			if (this.state.teams.filter(function (team) {
				return team.name === name;
			}).length) return;
			if (!Array.isArray(members)) return;

			this.state.teams.push({
				name: name,
				members: members,
				tasks: []
			});

			return this;
		}

		/**
   * Returns team with specified name
   *
   * @param {string} name — team name
   * @return {Object} Team with specified name.
   */

	}, {
		key: 'getTeam',
		value: function getTeam(name) {
			return this.state.teams.filter(function (team) {
				return team.name === name;
			})[0];
		}

		/**
   * Creates new student
   *
   * @param {string} fullname — student full name
   * @return {number} student id
   */

	}, {
		key: 'createStudent',
		value: function createStudent(fullname) {
			if (!fullname || typeof fullname !== 'string' || fullname.trim() === '') {
				throw new Error('Student fullname must be specified');
			}

			var state = this.state;


			state.students.push({
				fullname: fullname,
				id: ++state.lastStudentId,
				tasks: []
			});

			return state.lastStudentId;
		}
	}, {
		key: 'getStudent',
		value: function getStudent(id) {
			return this.state.students.filter(function (student) {
				return student.id === id;
			})[0];
		}
	}]);

	return School;
}();

exports.default = School;