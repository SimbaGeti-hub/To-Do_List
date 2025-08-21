📝 To-Do List App

This project is a simple To-Do List application created with HTML, CSS, and JavaScript. 
The app allows users to add new tasks, mark tasks as completed with a tick, delete tasks, and also restore deleted tasks 
if needed. Sub-tasks are automatically displayed with bullet points for better organization. The layout is styled using CSS 
for a clean and responsive design, while the interactivity is handled with JavaScript.

The JavaScript code demonstrates how different asynchronous features work in real applications. 
For example, setTimeout is used to delay actions for a given number of milliseconds, showing how 
code execution can be scheduled. Promises are used to represent tasks that complete in the future, and the .then, 
.catch, and .finally methods handle success, failure, and completion of these tasks. Errors in the code are 
managed with throw statements combined with try...catch blocks, ensuring the app continues running smoothly 
even when something goes wrong. The async/await syntax is used to make working with Promises simpler and easier
to read. Finally, the project highlights the difference between microtasks (like Promises) and macrotasks
(like setTimeout) in the JavaScript event loop, which controls the exact order in which different pieces of code run.

The code is separated into three main files:

index.html provides the structure of the app and the task list.

style.css controls the appearance, making the app user-friendly and visually clear.

script.js contains all the logic for adding, completing, deleting, restoring tasks, and handling asynchronous behavior.

To use the app, clone this repository, open the project folder, and run the index.html file in a web browser.
Tasks can then be added, marked, deleted, or restored directly from the interface.
