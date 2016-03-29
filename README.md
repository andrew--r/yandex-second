# Задание 2

## Описание

### Предметная область
Студенты в Школе разработки интерфейсов делятся на команды. В процессе обучения
студенты выполняют задания. Оценки за них ставятся либо конкретному студенту,
либо всей команде студентов. В конце Школы перед менторами стоит задача
распределения студентов. Каждый ментор составляет приоритезированный список
студентов, в которых он заинтересован. Каждый из студентов также составляет
приоритезированный список менторов, к которым он бы хотел пойти.

### Задача
Создайте библиотеку, которая реализует такой программный интерфейс:

- добавление студентов-участников и объединение их в команды; 
- создание командных и индивидуальных заданий; 
- выставление оценок за задание; 
- создание приоритезированных списков менторов и студентов; 
- решение задачи распределения студентов среди менторов в соответствии
с приоритезированными списками.

Выполнение одной или нескольких дополнительных задач будет плюсом:

- организуйте процесс сериализации/десериализации в разных форматах данных; 
- создайте тесты к библиотеке; 
- реализуйте веб-интерфейс или интерфейс командной строки для своей библиотеки.

## Мои комментарии

### Ход мыслей
Определяю, какие данные необходимо будет хранить. Выделяю четыре сущности:

- Задания;
- Студенты;
- Команды студентов;
- Менторы.

Решаю начать с наиболее независимой сущности. Описываю задание:

```javascript
{
	id: 1,
	type: 'individual' || 'command',
	name: '',
	description: '',
}
```

Каждое задание имеет уникальный идентификатор `id`. Самое простое решение
для генерации этого идентификатора, не требующее особых ресурсов — хранить `id`
последнего созданного задания и пре-инкрементировать его при добавлении нового
задания:

```javascript
{
	id: ++lastTaskId,
}
```

Пишу методы для добавления, удаления и получения заданий.

Сразу думаю о том, что у студентов и команд будут храниться
идентификаторы заданий вместе со статусом выполнения и оценкой, так что при
удалении задания следует позаботиться также и об удалении ссылки на него
в студентах и командах.

Описываю команду студентов:

```javascript
{
	name: '', // уникальное поле
	members: [], // содержит идентификаторы участников
	tasks: [], // содержит данные о заданиях и прогрессе выполнения
}
```

Как должны выглядеть данные о заданиях и прогрессе выполения
у команд и студентов? Минимальный набор необходимых данных:

```javascript
{
	tasks: [
		{
			id: 1,
			completed: false,
			score: null,
		},
		{
			id: 1,
			completed: true,
			score: 10, // десятибалльная шкала
		}
	],
}
```

Реализую интерфейс для добавления команд.