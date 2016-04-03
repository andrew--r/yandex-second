var test = require('tape');
var School = require('../dist/main').default;

test('tasks', function (t) {
	var Shri = new School();

	t.throws(
		function () {
			Shri.createTask();
		},
		/Both type and name of task must be specified/,
		'Нельзя создать задание, не указав вид и название'
	);

	t.throws(
		function () {
			Shri.createTask('');
		},
		/Both type and name of task must be specified/,
		'Нельзя создать задание, не указав вид'
	);

	t.throws(
		function () {
			Shri.createTask('team');
		},
		/Both type and name of task must be specified/,
		'Нельзя создать задание, не указав название'
	);

	t.throws(
		function () {
			Shri.createTask('team', '');
		},
		/Both type and name of task must be specified/,
		'Нельзя создать задание, не указав название'
	);

	t.throws(
		function () {
			Shri.createTask(123, 'qwe');
		},
		/Type and name of task must be a string/,
		'Вид задания должен быть строкой'
	);

	t.throws(
		function () {
			Shri.createTask('individual', 123);
		},
		/Type and name of task must be a string/,
		'Название задания должно быть строкой'
	);

	t.throws(
		function () {
			Shri.createTask('custom', 'Example task');
		},
		/Unknown task type, expected \'individual\' or \'team\'/,
		'Вид задания должен быть \'individual\' или \'team\''
	);

	t.equal(
		Shri.createTask('individual', 'Познакомиться с преподавателями'),
		1,
		'Задача с корректными типом и названием успешно добавляется'
	);

	t.equal(
		Shri.createTask('individual', 'Посетить два занятия'),
		2,
		'Задача с корректными типом и названием успешно добавляется'
	);

	t.throws(
		function () {
			Shri.getTask();
		},
		/Task identifier must be specified/,
		'Нельзя получить задание, не указав его идентификатор'
	);

	t.throws(
		function () {
			Shri.getTask('qwe');
		},
		/Task identifier must be a number/,
		'Нельзя получить задание, указав идентификатор неправильного типа'
	);

	t.ok(Shri.getTask(2), 'Добавленную задачу можно получить по её идентификатору');

	t.throws(
		function () {
			Shri.deleteTask();
		},
		/Task identifier must be specified/,
		'Нельзя удалить задачу, не передав её идентификатор'
	);

	t.throws(
		function () {
			Shri.deleteTask([1]);
		},
		/Task identifier must be a number/,
		'Нельзя удалить задачу, передав идентификатор неправильного типа'
	);

	t.equals(Shri.deleteTask(2), Shri);

	t.equals(Shri.getTask(2), undefined, 'Задача удаляется по идентификатору');

	t.end();
});


// test('teams', function (t) {
// 	var Shri = new School();

// 	t.throws(
// 		function () {
// 			Shri.createTeam();
// 		},
// 		/Team name must be specified/,
// 		'Нельзя создать команду без названия'
// 	);

// 	t.throws(
// 		function () {
// 			Shri.createTeam('');
// 		},
// 		/Team name must be specified/,
// 		'Нельзя создать команду без названия'
// 	);

// 	t.throws(
// 		function () {
// 			Shri.createTeam('       ');
// 		},
// 		/Team name must be specified/,
// 		'Нельзя создать команду без названия'
// 	);

// 	t.throws(
// 		function () {
// 			Shri.createTeam(1234);
// 		},
// 		/Team name must be a string/,
// 		'Название команды должно быть строкой'
// 	);

// 	t.throws(
// 		function () {
// 			Shri.createTeam('Dreamteam');
// 		},
// 		/Team members must be specified/,
// 		'Нельзя создать команду без участников'
// 	);

// 	t.throws(
// 		function () {
// 			Shri.createTeam('Dreamteam', [0, 1]);
// 		},
// 		/Cannot create team without members/,
// 		'Нельзя создать команду без участников'
// 	);

// 	t.end();
// });

test('usecase1', function(t) {
	var Shri = new School();

	t.equals(Shri.createStudent('Андрей Романов'), 1);
	t.equals(Shri.createStudent('Алексей Иванов'), 2);
	t.equals(Shri.createStudent('Олег Петров'), 3);
	t.equals(Shri.createStudent('Мария Кузницына'), 4);

	t.ok(Shri.createTeam('Dreamteam', [1, 2, 4]));

	t.equals(Shri.createTask('individual', 'Познакомиться с командой'), 1);
	t.ok(Shri.assignTask(1, Shri.getTeam('Dreamteam').members));

	console.log('Shri.state.students[0]', Shri.state.students[0]);

	t.end();
});