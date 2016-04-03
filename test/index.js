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


test('add and remove students', function (t) {
	var Shri = new School();

	var firstStudent = {
		fullname: 'Андрей Романов',
		id: 1,
		tasks: [],
		team: null,
	};

	var secondStudent = {
		fullname: 'Мария Кузницына',
		id: 2,
		tasks: [],
		team: null,
	};

	t.equals(Shri.addStudent('Андрей Романов'), 1);
	t.equals(Shri.addStudent('Мария Кузницына'), 2);

	t.deepEqual(Shri.getStudent(1), firstStudent);
	t.deepEqual(Shri.getStudent(2), secondStudent);

	t.equals(Shri.state.students.length, 2);

	t.ok(Shri.removeStudent(1));

	t.equals(Shri.state.students.length, 1);
	t.equals(Shri.getStudent(1), undefined);
	t.deepEqual(Shri.getStudent(2), secondStudent);

	t.end();
});


test('create and delete teams', function (t) {
	var Shri = new School();

	t.equals(Shri.addStudent('Андрей Романов'), 1);
	t.equals(Shri.addStudent('Мария Кузницына'), 2);
	t.equals(Shri.addStudent('Алексей Иванов'), 3);
	t.equals(Shri.addStudent('Олег Петров'), 4);
	t.equals(Shri.addStudent('Анна Василюк'), 5);
	t.equals(Shri.addStudent('Егор Китцелюк'), 6);
	t.equals(Shri.state.students.length, 6);

	var firstTeam = {
		name: 'First',
		members: [1, 2],
		tasks: [],
	};

	var secondTeam = {
		name: 'Second',
		members: [3, 4, 5],
		tasks: [],
	};

	t.ok(Shri.createTeam('First', [1, 2]));
	t.notOk(Shri.createTeam('First', [1, 2]));
	t.equals(Shri.state.teams.length, 1);
	t.deepEqual(Shri.getTeam('First'), firstTeam);
	t.equals(Shri.getStudent(1).team, 'First');
	t.equals(Shri.getStudent(2).team, 'First');

	t.ok(Shri.createTeam('Second', [1, 2, 3, 4, 5]));
	t.equals(Shri.state.teams.length, 2);
	t.deepEqual(Shri.getTeam('Second'), secondTeam);
	t.equals(Shri.getStudent(1).team, 'First');
	t.equals(Shri.getStudent(2).team, 'First');
	t.equals(Shri.getStudent(3).team, 'Second');
	t.equals(Shri.getStudent(4).team, 'Second');
	t.equals(Shri.getStudent(5).team, 'Second');

	t.throws(
		function() {
			Shri.createTeam('Thrid', [1, 2, 6]);
		},
		/Cannot create team with members who are already assigned to another team/
	);

	t.end();
});


test('remove students and autoremove teams', function (t) {
	var Shri = new School();

	t.equals(Shri.addStudent('Андрей Романов'), 1);
	t.equals(Shri.addStudent('Мария Кузницына'), 2);
	t.equals(Shri.addStudent('Алексей Иванов'), 3);
	t.equals(Shri.state.students.length, 3);

	var firstTeam = {
		name: 'First',
		members: [1, 2],
		tasks: [],
	};

	t.ok(Shri.createTeam('First', [1, 2]));
	t.equals(Shri.state.teams.length, 1);
	t.deepEqual(Shri.getTeam('First'), firstTeam);
	t.equals(Shri.getStudent(2).team, 'First');

	var firstStudent = {
		fullname: 'Андрей Романов',
		id: 1,
		tasks: [],
		team: 'First',
	};

	t.deepEqual(Shri.getStudent(1), firstStudent);

	t.ok(Shri.removeStudent(1));
	t.equals(Shri.getStudent(1), undefined);
	t.equals(Shri.getTeam('First'), undefined);
	t.equals(Shri.getStudent(2).team, null);

	t.end();
});


test('mentors', function (t) {
	var Shri = new School();

	t.equals(Shri.addMentor('Андрей Ситник'), 1);
	t.equals(Shri.addMentor('Эдди Османи'), 2);
	t.equals(Shri.state.mentors.length, 2);

	var firstMentor = {
		fullname: 'Андрей Ситник',
		id: 1,
	};

	t.deepEqual(Shri.getMentor(1), firstMentor);

	t.ok(Shri.removeMentor(1));
	t.equals(Shri.state.mentors.length, 1);
	t.equals(Shri.getMentor(1), undefined);

	t.end();
});