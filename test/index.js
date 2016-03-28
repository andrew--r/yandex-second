var test = require('tape');
var School = require('../dist/main').default;

test('tasks', function (t) {
	var Shri = new School();

	t.throws(
		function () { Shri.addTask('custom') },
		/Неверный тип задачи/,
		'Тип задачи должен должен быть "individual" или "command"'
	);

	t.throws(
		function () { Shri.addTask('command') },
		/При создании задачи следует указать название/,
		'Нельзя добавить задачу без названия'
	);

	t.equal(
		Shri.addTask('individual', 'Заполнить профиль на сайте'),
		1,
		'Задача с типом и названием успешно добавляется'
	);

	t.equal(
		Shri.addTask('command', 'Заполнить профиль на сайте', 'Сайт: http://passport.yandex.ru'),
		2,
		'Задача с типом, названием и описанием успешно добавляется'
	);

	t.ok(Shri.getTask(2), 'Добавленную задачу можно получить по её идентификатору');

	t.throws(
		function () { Shri.removeTask() },
		/Для удаления задачи нужно передать её идентификатор/,
		'Нельзя удалить задачу, не передав её идентификатор'
	);

	Shri.removeTask(2);

	t.equals(Shri.getTask(2), undefined, 'Задача удаляется по идентификатору');

	t.end();
});