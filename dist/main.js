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
			lastMentorId: 0
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

			var task = this.getTask(id);
			if (!task) return this;

			this.state.tasks = this.state.tasks.filter(function (task) {
				return task.id !== id;
			});
			this.state[task.type === 'team' ? 'teams' : 'students'].forEach(function (executor) {
				executor.tasks = executor.tasks.filter(function (task) {
					return task.id !== id;
				});
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
   * Completes task
   *
   * @param {number} taskId — task identifier
   * @param {(number|string)} executorId — student identifier or team name
   * @param {number} score
   * @return {School}
   */

	}, {
		key: 'completeTask',
		value: function completeTask(taskId, executorId, score) {
			if (taskId === undefined || executorId === undefined || score === undefined) {
				throw new Error('taskId, executorId and score are required to complete task');
			}

			if (typeof taskId !== 'number' || typeof score !== 'number') {
				throw new Error('taskId and score must be specified as a number');
			}

			if (score < 1 || score > 5) {
				throw new Error('score must be in range from 1 to 5');
			}

			var task = this.getTask(taskId);

			if (!task) {
				throw new Error('Unknown task');
			}

			if (task.type === 'team' && typeof executorId !== 'string') {
				throw new Error('executorId for task with type \'team\' must be a string');
			}

			if (task.type === 'individual' && typeof executorId !== 'number') {
				throw new Error('executorId for task with type \'individual\' must be a number');
			}

			var getMethodName = 'get' + (task.type === 'team' ? 'Team' : 'Student');

			this[getMethodName](executorId).tasks = this[getMethodName](executorId).tasks.map(function (task) {
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

	}, {
		key: 'createStudent',
		value: function createStudent(fullname) {
			var state = this.state;


			state.students.push({
				fullname: fullname,
				id: ++state.lastStudentId,
				mentor: null,
				team: null,
				tasks: [],
				preferredMentors: []
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
   * Deletes student
   *
   * @param {number} id — unique student id
   * @return {School}
   */

	}, {
		key: 'deleteStudent',
		value: function deleteStudent(id) {
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
   * Creates new mentor
   *
   * @param {string} fullname — mentor full name
   * @return {number} unique mentor id
   */

	}, {
		key: 'createMentor',
		value: function createMentor(fullname) {
			var state = this.state;


			state.mentors.push({
				fullname: fullname,
				id: ++state.lastMentorId,
				preferredStudents: [],
				students: []
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
   * Deletes mentor
   *
   * @param {number} id — unique mentor id
   * @return {School}
   */

	}, {
		key: 'deleteMentor',
		value: function deleteMentor(id) {
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

		/**
   * Deletes team with specified name
   *
   * @param {string} name — team name
   * @return {School}
   */

	}, {
		key: 'deleteTeam',
		value: function deleteTeam(name) {
			var _this4 = this;

			if (!name || name.trim() === '') return;

			var teamToRemove = this.getTeam(name);

			teamToRemove.members.forEach(function (id) {
				_this4.getStudent(id).team = null;
			});

			this.state.teams = this.state.teams.filter(function (team) {
				return team.name !== name;
			});
			return this;
		}

		// GETTERS

		/**
   * Returns students list
   *
   * @return {Object[]}
   */

	}, {
		key: 'getStudents',
		value: function getStudents() {
			return this.state.students;
		}

		/**
   * Returns mentors list
   *
   * @return {Object[]}
   */

	}, {
		key: 'getMentors',
		value: function getMentors() {
			return this.state.mentors;
		}

		/**
   * Returns tasks list
   *
   * @return {Object[]}
   */

	}, {
		key: 'getTasks',
		value: function getTasks() {
			return this.state.tasks;
		}

		/**
   * Returns teams list
   *
   * @return {Object[]}
   */

	}, {
		key: 'getTeams',
		value: function getTeams() {
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

	}, {
		key: 'pushPriority',
		value: function pushPriority(options) {
			var subjectId = options.subjectId;
			var value = options.value;

			var subjectType = capitalize(options.subjectType);
			var revertedSubject = getRevertedSubjectType(subjectType);

			if (!this['get' + revertedSubject](value)) {
				throw new Error(revertedSubject + ' with id ' + value + ' doesn\'t exist');
			}

			var preferredList = this['get' + subjectType](subjectId)['preferred' + revertedSubject + 's'];

			if (! ~preferredList.indexOf(value)) {
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

	}, {
		key: 'popPriority',
		value: function popPriority(options) {
			var subjectId = options.subjectId;

			var subjectType = capitalize(options.subjectType);
			var revertedSubject = getRevertedSubjectType(subjectType);

			return this['get' + subjectType](subjectId)['preferred' + revertedSubject + 's'].pop();
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

	}, {
		key: 'insertPriority',
		value: function insertPriority(options) {
			var subjectId = options.subjectId;
			var value = options.value;
			var index = options.index;

			var subjectType = capitalize(options.subjectType);
			var revertedSubject = getRevertedSubjectType(subjectType);

			if (!this['get' + revertedSubject](value)) {
				throw new Error(revertedSubject + ' with id ' + value + ' doesn\'t exist');
			}

			var preferredList = this['get' + subjectType](subjectId)['preferred' + revertedSubject + 's'];

			if (~preferredList.indexOf(value)) {
				this.removePriority({
					subjectId: subjectId,
					subjectType: subjectType,
					value: value
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

	}, {
		key: 'removePriority',
		value: function removePriority(options) {
			var subjectId = options.subjectId;
			var value = options.value;

			var subjectType = capitalize(options.subjectType);
			var revertedSubject = getRevertedSubjectType(subjectType);

			if (!this['get' + revertedSubject](value)) {
				throw new Error(revertedSubject + ' with id ' + value + ' doesn\'t exist');
			}

			var preferredList = this['get' + subjectType](subjectId)['preferred' + revertedSubject + 's'];
			var realIndex = preferredList.indexOf(value);

			if (~realIndex) {
				return preferredList.splice(realIndex, 1)[0];
			}
		}

		/**
   * Distributes students between mentors taking into account their priorities
   *
   * @return {School}
   */

	}, {
		key: 'distributePriorities',
		value: function distributePriorities() {
			var _this5 = this;

			var _state = this.state;
			var mentors = _state.mentors;
			var students = _state.students;

			var averageMentorStudentsCount = Math.floor(students.length / mentors.length); // сколько студентов должно быть у каждого ментора
			var weightsTable = createWeightsTable(mentors, students).sort(sortByValues);
			var mentorsWithExtraStudents = [];
			var extraStudents = students.length % mentors.length;

			students.forEach(function (student) {
				var pairs = weightsTable.filter(function (pair) {
					return pair.studentId === student.id;
				});
				var currentItem = 0;

				while (!student.mentor) {
					var mentorId = pairs[currentItem].mentorId;
					var mentor = _this5.getMentor(mentorId);
					var mentorStudentsCount = mentor.students.length;

					var isFullButExtraAvailable = mentorStudentsCount >= averageMentorStudentsCount && extraStudents && ! ~mentorsWithExtraStudents.indexOf(mentorId);
					var isntFull = mentorStudentsCount < averageMentorStudentsCount;

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
	var weightsTable = [];

	mentors.forEach(function (mentor) {
		mentor.preferredStudents.forEach(function (studentId, index, prioritiesList) {
			weightsTable.push({
				studentId: studentId,
				mentorId: mentor.id,
				// вес пары без учёта приоритетов студентов
				value: prioritiesList.length - index
			});
		});

		// Учитываем студентов, не добавленных в список приоритетов
		students.forEach(function (student) {
			if (! ~mentor.preferredStudents.indexOf(student.id)) {
				weightsTable.push({
					mentorId: mentor.id,
					studentId: student.id,
					value: 0
				});
			}
		});
	});

	students.forEach(function (student) {
		student.preferredMentors.forEach(function (mentorId, index, prioritiesList) {
			var pair = weightsTable.filter(function (item) {
				return item.mentorId === mentorId && item.studentId === student.id;
			})[0];

			pair.value += prioritiesList.length - index;
		});

		// не добавленных в приоритеты менторов учитывать не нужно, с ними уже
		// есть пара
	});

	return weightsTable;
}