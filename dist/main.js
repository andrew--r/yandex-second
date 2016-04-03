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
			mentors: [],
			lastTaskId: 0,
			lastStudentId: 0,
			lastMentorId: 0
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

		// STUDENTS

		/**
   * Adds new student
   *
   * @param {string} fullname — student full name
   * @return {number} unique student id
   */

	}, {
		key: 'addStudent',
		value: function addStudent(fullname) {
			var state = this.state;


			state.students.push({
				fullname: fullname,
				id: ++state.lastStudentId,
				tasks: [],
				team: null
			});

			return state.lastStudentId;
		}

		/**
   * Returns student with specified id if student exists
   *
   * @param {number} id — unique student id
   * @return {Object} student or undefined
   */

	}, {
		key: 'getStudent',
		value: function getStudent(id) {
			return this.state.students.filter(function (student) {
				return student.id === id;
			})[0];
		}

		/**
   * Removes student
   *
   * @param {number} id — unique student id
   * @return {School}
   */

	}, {
		key: 'removeStudent',
		value: function removeStudent(id) {
			var _this2 = this;

			this.state.students = this.state.students.filter(function (student) {
				return student.id !== id;
			});

			var teamsToDelete = [];

			this.state.teams.forEach(function (team) {
				team.members = team.members.filter(function (member) {
					return member !== id;
				});
				if (team.members.length < 2) teamsToDelete.push(team.name);
			});

			teamsToDelete.forEach(function (teamName) {
				_this2.getTeam(teamName).members.forEach(function (id) {
					return _this2.getStudent(id).team = null;
				});
			});

			this.state.teams = this.state.teams.filter(function (team) {
				return ! ~teamsToDelete.indexOf(team.name);
			});

			return this;
		}

		// MENTORS

		/**
   * Adds new mentor
   *
   * @param {string} fullname — mentor full name
   * @return {number} unique mentor id
   */

	}, {
		key: 'addMentor',
		value: function addMentor(fullname) {
			var state = this.state;


			state.mentors.push({
				fullname: fullname,
				id: ++state.lastMentorId
			});

			return state.lastMentorId;
		}

		/**
   * Returns student with specified id if student exists
   *
   * @param {number} id — unique student id
   * @return {Object} student or undefined
   */

	}, {
		key: 'getMentor',
		value: function getMentor(id) {
			return this.state.mentors.filter(function (mentor) {
				return mentor.id === id;
			})[0];
		}

		/**
   * Removes mentor
   *
   * @param {number} id — unique mentor id
   * @return {School}
   */

	}, {
		key: 'removeMentor',
		value: function removeMentor(id) {
			this.state.mentors = this.state.mentors.filter(function (mentor) {
				return mentor.id !== id;
			});
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

	}, {
		key: 'createTeam',
		value: function createTeam(name, members) {
			var _this3 = this;

			if (contains(this.state.teams, function (team) {
				return team.name === name;
			})) return;
			if (!Array.isArray(members)) return;

			var freeMembers = members.filter(function (id) {
				return !_this3.getStudent(id).team;
			}).map(function (id) {
				_this3.getStudent(id).team = name;
				return id;
			});

			if (freeMembers.length < 2) {
				throw new Error('Cannot create team with members who are already assigned to another team');
			}

			this.state.teams.push({
				name: name,
				members: freeMembers,
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
	}]);

	return School;
}();

// HELPERS

/**
 * Checks if array contains element that matches predicate
 *
 * @param {Array} array
 * @param {Function} predicate
 * @return {Boolean}
 */


exports.default = School;
function contains(array, predicate) {
	var result = array.filter(predicate);
	return Boolean(result.length);
}