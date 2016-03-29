'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var School = function () {
	function School() {
		_classCallCheck(this, School);

		this.state = {
			tasks: [],
			lastTaskId: 0
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

			this.state.tasks.push({
				type: type,
				name: name,
				id: ++this.state.lastTaskId
			});

			return this.state.lastTaskId;
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
	}]);

	return School;
}();

exports.default = School;