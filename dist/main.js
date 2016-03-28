'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var taskExample = {
	type: 'individual' || 'command',
	name: 'Название задачи',
	description: 'Описание задачи'
};

var state = {
	lastStudentId: null,
	lastMentorId: null,
	students: [],
	mentors: [],
	tasks: []
};

var School = function () {
	function School() {
		_classCallCheck(this, School);

		this.state = {
			tasks: [],
			lastTaskId: 0
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


	_createClass(School, [{
		key: 'addTask',
		value: function addTask(type, name, description) {
			if (type !== 'individual' && type !== 'command') {
				throw new Error('Неверный тип задачи');
			}

			if (name === undefined) {
				throw new Error('При создании задачи следует указать название');
			}

			this.state.tasks.push({
				type: type,
				name: name,
				description: description,
				id: ++this.state.lastTaskId
			});

			return this.state.lastTaskId;
		}

		/**
   * Удаляет задачу
   *
   * @param {number} id — идентификатор задачи
   * @return {array} Обновлённый массив задач
   */

	}, {
		key: 'removeTask',
		value: function removeTask(_id) {
			if (_id === undefined) {
				throw new Error('Для удаления задачи нужно передать её идентификатор');
			}

			var state = this.state;


			state.tasks = state.tasks.filter(function (_ref) {
				var id = _ref.id;
				return id !== _id;
			});
			return state.tasks;
		}

		/**
   * Возвращает задачу с переданным идентификатором
   *
   * @param {number} id — идентификатор задачи
   * @return {object} Задача с нужным идентификатором
   */

	}, {
		key: 'getTask',
		value: function getTask(_id) {
			return this.state.tasks.filter(function (_ref2) {
				var id = _ref2.id;
				return id === _id;
			})[0];
		}
	}]);

	return School;
}();

exports.default = School;