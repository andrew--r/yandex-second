var test = require('tape');

var School = require('../dist/main').default;


test('create, delete and get tasks', function (t) {
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

	var firstTask = {
		type: 'individual',
		name: 'Познакомиться с преподавателями',
		id: 1,
	};

	t.deepEqual(Shri.getTask(1), firstTask);

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


test('create and delete students', function (t) {
	var Shri = new School();

	var firstStudent = {
		fullname: 'Андрей Романов',
		id: 1,
		team: null,
		tasks: [],
		preferredMentors: [],
	};

	var secondStudent = {
		fullname: 'Мария Кузницына',
		id: 2,
		team: null,
		tasks: [],
		preferredMentors: [],
	};

	t.equals(Shri.createStudent('Андрей Романов'), 1);
	t.equals(Shri.createStudent('Мария Кузницына'), 2);

	t.deepEqual(Shri.getStudent(1), firstStudent);
	t.deepEqual(Shri.getStudent(2), secondStudent);

	t.equals(Shri.state.students.length, 2);

	t.ok(Shri.deleteStudent(1));

	t.equals(Shri.state.students.length, 1);
	t.equals(Shri.getStudent(1), undefined);
	t.deepEqual(Shri.getStudent(2), secondStudent);

	t.end();
});


test('create and delete teams', function (t) {
	var Shri = new School();

	t.equals(Shri.createStudent('Андрей Романов'), 1);
	t.equals(Shri.createStudent('Мария Кузницына'), 2);
	t.equals(Shri.createStudent('Алексей Иванов'), 3);
	t.equals(Shri.createStudent('Олег Петров'), 4);
	t.equals(Shri.createStudent('Анна Василюк'), 5);
	t.equals(Shri.createStudent('Егор Китцелюк'), 6);
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
		function () {
			Shri.createTeam('Thrid', [1, 2, 6]);
		},
		/Cannot create team with members who are already assigned to another team/
	);

	t.ok(Shri.deleteTeam('Second'));
	t.equals(Shri.state.teams.length, 1);
	t.deepEqual(Shri.getTeam('First'), firstTeam);
	t.equals(Shri.getStudent(1).team, 'First');
	t.equals(Shri.getStudent(2).team, 'First');
	t.equals(Shri.getStudent(3).team, null);
	t.equals(Shri.getStudent(4).team, null);
	t.equals(Shri.getStudent(5).team, null);

	t.end();
});


test('delete students and autodelete teams', function (t) {
	var Shri = new School();

	t.equals(Shri.createStudent('Андрей Романов'), 1);
	t.equals(Shri.createStudent('Мария Кузницына'), 2);
	t.equals(Shri.createStudent('Алексей Иванов'), 3);
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
		team: 'First',
		tasks: [],
		preferredMentors: [],
	};

	t.deepEqual(Shri.getStudent(1), firstStudent);

	t.ok(Shri.deleteStudent(1));
	t.equals(Shri.getStudent(1), undefined);
	t.equals(Shri.getTeam('First'), undefined);
	t.equals(Shri.getStudent(2).team, null);

	t.end();
});


test('create, delete and get mentors', function (t) {
	var Shri = new School();

	t.equals(Shri.createMentor('Андрей Ситник'), 1);
	t.equals(Shri.createMentor('Эдди Османи'), 2);
	t.equals(Shri.state.mentors.length, 2);

	var firstMentor = {
		fullname: 'Андрей Ситник',
		id: 1,
		preferredStudents: [],
	};

	t.deepEqual(Shri.getMentor(1), firstMentor);

	t.ok(Shri.deleteMentor(1));
	t.equals(Shri.state.mentors.length, 1);
	t.equals(Shri.getMentor(1), undefined);

	t.end();
});


test('assign, complete and delete tasks', function (t) {
	var Shri = new School();

	t.equals(Shri.createStudent('Андрей Романов'), 1);
	t.equals(Shri.createStudent('Мария Кузницына'), 2);
	t.equals(Shri.createStudent('Алексей Иванов'), 3);
	t.equals(Shri.createStudent('Олег Петров'), 4);
	t.equals(Shri.createStudent('Анна Василюк'), 5);
	t.equals(Shri.createStudent('Егор Китцелюк'), 6);

	t.ok(Shri.createTeam('First', [1, 2]));
	t.ok(Shri.createTeam('Second', [3, 4, 5, 6]));

	t.equals(Shri.createTask('individual', 'Познакомиться с участниками ШРИ'), 1);
	t.equals(Shri.createTask('team', 'Познакомиться с другими командами'), 2);
	t.equals(Shri.createTask('team', 'Представить идею проекта'), 3);

	t.ok(Shri.assignTask(1, [1, 2, 3, 4, 5, 6]));
	t.ok(Shri.assignTask(2, ['First', 'Second']));
	t.ok(Shri.assignTask(3, ['First']));

	var firstTask = {
		id: 1,
		completed: false,
		score: null,
	};

	var secondTask = {
		id: 2,
		completed: false,
		score: null,
	};

	var thirdTask = {
		id: 3,
		completed: false,
		score: null,
	};

	t.deepEqual(Shri.getStudent(1).tasks[0], firstTask);
	t.deepEqual(Shri.getStudent(2).tasks[0], firstTask);
	t.deepEqual(Shri.getStudent(3).tasks[0], firstTask);
	t.deepEqual(Shri.getStudent(4).tasks[0], firstTask);
	t.deepEqual(Shri.getStudent(5).tasks[0], firstTask);
	t.deepEqual(Shri.getStudent(6).tasks[0], firstTask);

	t.deepEqual(Shri.getTeam('First').tasks[0], secondTask);
	t.deepEqual(Shri.getTeam('Second').tasks[0], secondTask);

	t.deepEqual(Shri.getTeam('First').tasks[1], thirdTask);

	t.ok(Shri.completeTask(1, 1, 4));
	t.ok(Shri.completeTask(2, 'First', 3));

	var firstCompletedTask = {
		id: 1,
		completed: true,
		score: 4,
	};

	var secondCompletedTask = {
		id: 2,
		completed: true,
		score: 3,
	};

	t.deepEqual(Shri.getStudent(1).tasks[0], firstCompletedTask);
	t.deepEqual(Shri.getTeam('First').tasks[0], secondCompletedTask);

	t.ok(Shri.completeTask(2, 'First', 5));

	t.deepEqual(Shri.getTeam('First').tasks[0], secondCompletedTask, 'Нельзя менять оценку в уже выполненных задачах');

	t.ok(Shri.deleteTask(3));
	t.equals(Shri.getTask(3), undefined);
	t.equals(Shri.getTeam('First').tasks[1], undefined);

	t.throws(
		function () {
			Shri.completeTask();
		},
		/taskId, executorId and score are required to complete task/
	);

	t.throws(
		function () {
			Shri.completeTask(1);
		},
		/taskId, executorId and score are required to complete task/
	);

	t.throws(
		function () {
			Shri.completeTask(1, 1);
		},
		/taskId, executorId and score are required to complete task/
	);

	t.throws(
		function () {
			Shri.completeTask('1', 1, 5);
		},
		/taskId and score must be specified as a number/
	);

	t.throws(
		function () {
			Shri.completeTask(1, 1, '5');
		},
		/taskId and score must be specified as a number/
	);

	t.throws(
		function () {
			Shri.completeTask(1, 1, 0);
		},
		/score must be in range from 1 to 5/
	);

	t.throws(
		function () {
			Shri.completeTask(1, 1, 6);
		},
		/score must be in range from 1 to 5/
	);

	t.throws(
		function () {
			Shri.completeTask(40, 1, 5);
		},
		/Unknown task/
	);

	t.throws(
		function () {
			Shri.completeTask(40, 1, 5);
		},
		/Unknown task/
	);

	t.throws(
		function () {
			Shri.completeTask(1, 'Team name', 5);
		},
		/executorId for task with type \'individual\' must be a number/
	);

	t.throws(
		function () {
			Shri.completeTask(2, 3, 5);
		},
		/executorId for task with type \'team\' must be a string/
	);

	t.end();
});


test('getters', function (t) {
	var Shri = new School();

	Shri.createStudent('Андрей Романов');
	Shri.createStudent('Мария Кузницына');

	Shri.createMentor('Иван Иванов');

	Shri.createTask('team', 'Пример задания');
	Shri.createTeam('Dreamteam', [1, 2]);

	var students = [
		{
			fullname: 'Андрей Романов',
			id: 1,
			team: 'Dreamteam',
			tasks: [],
			preferredMentors: [],
		},
		{
			fullname: 'Мария Кузницына',
			id: 2,
			team: 'Dreamteam',
			tasks: [],
			preferredMentors: [],
		},
	];

	t.deepEqual(Shri.getStudents(), students);

	var mentors = [
		{
			fullname: 'Иван Иванов',
			id: 1,
			preferredStudents: [],
		},
	];

	t.deepEqual(Shri.getMentors(), mentors);

	var tasks = [
		{
			id: 1,
			name: 'Пример задания',
			type: 'team',
		},
	];

	t.deepEqual(Shri.getTasks(), tasks);

	var teams = [
		{
			name: 'Dreamteam',
			members: [1, 2],
			tasks: [],
		},
	];

	t.deepEqual(Shri.getTeams(), teams);

	t.end();
});


test('push priorities', function (t) {
	var Shri = new School();

	t.equals(Shri.createStudent('Андрей Романов'), 1);
	t.equals(Shri.createStudent('Даниил Рудель'), 2);
	t.equals(Shri.createMentor('Роман Лютиков'), 1);
	t.equals(Shri.createMentor('Андрей Ситник'), 2);

	t.equals(Shri.pushPriority({
		subjectId: 1,
		subjectType: 'student',
		value: 1,
	}), 1);

	t.equals(Shri.pushPriority({
		subjectId: 1,
		subjectType: 'student',
		value: 1,
	}), undefined);

	t.equals(Shri.pushPriority({
		subjectId: 1,
		subjectType: 'student',
		value: 2,
	}), 2);

	t.equals(Shri.pushPriority({
		subjectId: 1,
		subjectType: 'student',
		value: 2,
	}), undefined);

	var firstStudent = {
		fullname: 'Андрей Романов',
		id: 1,
		team: null,
		tasks: [],
		preferredMentors: [1, 2],
	};

	t.deepEqual(Shri.getStudent(1), firstStudent);

	t.equals(Shri.pushPriority({
		subjectId: 2,
		subjectType: 'student',
		value: 2,
	}), 2);

	t.equals(Shri.pushPriority({
		subjectId: 2,
		subjectType: 'student',
		value: 1,
	}), 1);

	var secondStudent = {
		fullname: 'Даниил Рудель',
		id: 2,
		team: null,
		tasks: [],
		preferredMentors: [2, 1],
	};

	t.deepEqual(Shri.getStudent(2), secondStudent);

	t.equals(Shri.pushPriority({
		subjectId: 1,
		subjectType: 'mentor',
		value: 1,
	}), 1);

	t.equals(Shri.pushPriority({
		subjectId: 1,
		subjectType: 'mentor',
		value: 1,
	}), undefined);

	t.equals(Shri.pushPriority({
		subjectId: 1,
		subjectType: 'mentor',
		value: 2,
	}), 2);

	var firstMentor = {
		fullname: 'Роман Лютиков',
		id: 1,
		preferredStudents: [1, 2],
	};

	t.deepEqual(Shri.getMentor(1), firstMentor);

	t.equals(Shri.pushPriority({
		subjectId: 2,
		subjectType: 'mentor',
		value: 2,
	}), 2);

	t.equals(Shri.pushPriority({
		subjectId: 2,
		subjectType: 'mentor',
		value: 1,
	}), 1);

	var secondMentor = {
		fullname: 'Андрей Ситник',
		id: 2,
		preferredStudents: [2, 1],
	};

	t.deepEqual(Shri.getMentor(2), secondMentor);

	t.throws(
		function () {
			Shri.pushPriority({
				subjectId: 1,
				subjectType: 'student',
				value: 200,
			});
		},
		/Mentor with id 200 doesn't exist/
	);

	t.throws(
		function () {
			Shri.pushPriority({
				subjectId: 1,
				subjectType: 'mentor',
				value: 59991,
			});
		},
		/Student with id 59991 doesn't exist/
	);

	t.end();
});

test('pop priorities', function (t) {
	var Shri = new School();

	t.equals(Shri.createStudent('Андрей Романов'), 1);
	t.equals(Shri.createStudent('Даниил Рудель'), 2);
	t.equals(Shri.createMentor('Роман Лютиков'), 1);
	t.equals(Shri.createMentor('Андрей Ситник'), 2);

	Shri.pushPriority({
		subjectId: 1,
		subjectType: 'student',
		value: 1,
	});

	Shri.pushPriority({
		subjectId: 1,
		subjectType: 'student',
		value: 2,
	});

	t.equals(Shri.popPriority({
		subjectId: 1,
		subjectType: 'student',
	}), 2);

	t.equals(Shri.popPriority({
		subjectId: 1,
		subjectType: 'student',
	}), 1);

	t.equals(Shri.popPriority({
		subjectId: 1,
		subjectType: 'student',
	}), undefined);

	t.equals(Shri.popPriority({
		subjectId: 2,
		subjectType: 'student',
	}), undefined);

	t.end();
});