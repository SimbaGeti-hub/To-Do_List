const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const themeToggle = document.getElementById("themeToggle");
const searchInput = document.getElementById("searchInput");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const clearAllBtn = document.getElementById("clearAllBtn");

document.addEventListener("DOMContentLoaded", ()=>{
  loadTasks();
  loadTheme();
  setInterval(checkDueDates, 60000); // check every minute
});

// Add task
addTaskBtn.addEventListener("click", ()=>{ createTaskFromInput(); });

// Enter key shortcut
taskInput.addEventListener("keypress",(e)=>{
  if(e.key==="Enter") createTaskFromInput();
});

function createTaskFromInput(){
  const text = taskInput.value.trim();
  if(!text) return alert("Enter a task!");
  createTask(text);
  taskInput.value="";
  saveTasks();
}

// Search
searchInput.addEventListener("input", filterTasks);

// Clear buttons
clearCompletedBtn.addEventListener("click", ()=>{
  document.querySelectorAll("#taskList li.completed").forEach(li=>li.remove());
  saveTasks();
});
clearAllBtn.addEventListener("click", ()=>{
  if(confirm("Clear all tasks?")){ taskList.innerHTML=""; saveTasks(); }
});

// Drag & Drop
let dragSrcEl=null;
function handleDragStart(e){ dragSrcEl=this; e.dataTransfer.effectAllowed='move'; e.dataTransfer.setData('text/html',this.innerHTML);}
function handleDragOver(e){ e.preventDefault(); return false;}
function handleDrop(e){ e.stopPropagation(); if(dragSrcEl!=this){ [dragSrcEl.innerHTML,this.innerHTML]=[this.innerHTML,dragSrcEl.innerHTML]; saveTasks(); } return false;}

// Create task
function createTask(text, completed=false, subtasks=[], subStyle="bullets", priority="medium", due="") {
  const li=document.createElement("li");
  li.draggable=true;
  li.addEventListener("dragstart",handleDragStart);
  li.addEventListener("dragover",handleDragOver);
  li.addEventListener("drop",handleDrop);
  if(completed) li.classList.add("completed");

  // Header
  const header=document.createElement("div"); header.classList.add("task-header");
  const span=document.createElement("span"); span.textContent=text;
  span.addEventListener("click", ()=>{ li.classList.toggle("completed"); saveTasks(); });

  const actions=document.createElement("div"); actions.classList.add("task-actions");

  // Edit
  const editBtn=document.createElement("button"); editBtn.textContent="Edit";
  editBtn.addEventListener("click", ()=>{
    const t=prompt("Edit task:",span.textContent);
    if(t){ span.textContent=t.trim(); saveTasks(); }
  });

  // Delete
  const deleteBtn=document.createElement("button"); deleteBtn.textContent="Delete";
  deleteBtn.addEventListener("click",()=>{ li.remove(); saveTasks(); });

  // Priority selector
  const priorityBtn=document.createElement("button"); priorityBtn.textContent="Priority";
  priorityBtn.addEventListener("click", ()=>{
    const p=prompt("Enter priority: high, medium, low",priority);
    if(["high","medium","low"].includes(p)){ li.dataset.priority=p; saveTasks(); renderPriority(li); }
  });

  // Due date
  const dueBtn=document.createElement("button"); dueBtn.textContent="Due";
  dueBtn.addEventListener("click", ()=>{
    const d=prompt("Enter due date YYYY-MM-DD HH:MM", due);
    if(d){ li.dataset.due=d; saveTasks(); renderDueDate(li); }
  });

  actions.append(editBtn,deleteBtn,priorityBtn,dueBtn);
  header.append(span,actions);

  // Toolbar for subtask style
  const toolbar=document.createElement("div"); toolbar.classList.add("subtask-toolbar");
  ["bullets","numbers","checklist"].forEach(style=>{
    const btn=document.createElement("button");
    btn.textContent=style.charAt(0).toUpperCase()+style.slice(1);
    if(style===subStyle) btn.classList.add("active");
    btn.addEventListener("click", ()=>{
      li.dataset.subStyle=style;
      [...toolbar.children].forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      renderSubtasks(li);
      saveTasks();
    });
    toolbar.appendChild(btn);
  });

  // Subtask input
  const subInputDiv=document.createElement("div"); subInputDiv.classList.add("subtask-input");
  const subInput=document.createElement("input"); subInput.placeholder="Add subtask...";
  const subAddBtn=document.createElement("button"); subAddBtn.textContent="Add";
  subAddBtn.addEventListener("click", ()=>{
    if(!subInput.value.trim()) return;
    addSubtask(subtaskList,subInput.value.trim(),false,li.dataset.subStyle);
    subInput.value=""; saveTasks();
  });
  subInput.addEventListener("keypress",(e)=>{ if(e.key==="Enter") subAddBtn.click(); });
  subInputDiv.append(subInput,subAddBtn);

  // Subtask list
  const subtaskList=document.createElement("ul"); subtaskList.classList.add("subtask-list"); li.dataset.subStyle=subStyle;
  subtasks.forEach(st=>addSubtask(subtaskList,st.text,st.completed,subStyle));

  subtaskList.addEventListener("click",e=>{
    const style=li.dataset.subStyle;
    if(e.target.tagName==="LI"){
      if(style==="checklist"){
        const cb=e.target.querySelector("input[type=checkbox]");
        if(cb) cb.checked=!cb.checked;
      } else e.target.classList.toggle("completed");
      saveTasks();
    }
  });

  li.append(header,toolbar,subInputDiv,subtaskList);
  renderSubtasks(li);
  li.dataset.priority=priority;
  li.dataset.due=due;
  renderPriority(li);
  renderDueDate(li);

  taskList.appendChild(li);
}

// Add subtask
function addSubtask(ul,text,completed=false,style="bullets"){
  const li=document.createElement("li");
  if(style==="checklist"){
    const cb=document.createElement("input"); cb.type="checkbox"; cb.checked=completed;
    const span=document.createElement("span"); span.textContent=text;
    li.append(cb,span);
  }else{
    li.textContent=text; if(completed) li.classList.add("completed");
  }
  ul.appendChild(li);
  renderSubtasks(ul.parentElement);
}

// Render subtasks
function renderSubtasks(taskLi){
  const style=taskLi.dataset.subStyle||"bullets";
  const ul=taskLi.querySelector(".subtask-list");
  ul.style.listStyleType=(style==="bullets"?"disc":style==="numbers"?"decimal":"none");
}

// Priority
function renderPriority(taskLi){
  let p=taskLi.querySelector(".priority");
  if(!p){ p=document.createElement("span"); p.classList.add("priority"); taskLi.querySelector(".task-header").appendChild(p); }
  p.textContent=taskLi.dataset.priority?.toUpperCase()||"MEDIUM";
  p.className="priority "+(taskLi.dataset.priority||"medium");
}

// Due Date
function renderDueDate(taskLi){
  let d=taskLi.querySelector(".due-date");
  if(!d){ d=document.createElement("span"); d.classList.add("due-date"); taskLi.querySelector(".task-header").appendChild(d); }
  d.textContent=taskLi.dataset.due||"";
}

// Check due dates for notifications
function checkDueDates(){
  const now=new Date();
  taskList.querySelectorAll("li").forEach(li=>{
    if(li.dataset.due && !li.dataset.notified){
      const due=new Date(li.dataset.due);
      if(due<=now){ alert(`Task "${li.querySelector(".task-header span").textContent}" is due!`); li.dataset.notified=true; }
    }
  });
}

function saveTasks(){
  const tasks=[];
  taskList.querySelectorAll("> li").forEach(taskLi=>{
    const taskText=taskLi.querySelector(".task-header span").textContent;
    const completed=taskLi.classList.contains("completed");
    const subStyle=taskLi.dataset.subStyle;
    const priority=taskLi.dataset.priority;
    const due=taskLi.dataset.due;
    const subtasks=[];
    taskLi.querySelectorAll(".subtask-list li").forEach(li=>{
      if(subStyle==="checklist"){ const span=li.querySelector("span"); const cb=li.querySelector("input[type=checkbox]");
        subtasks.push({text:span.textContent,completed:cb.checked});
      }else subtasks.push({text:li.textContent,completed:li.classList.contains("completed")});
    });
    tasks.push({text:taskText,completed,subtasks,subStyle,priority,due});
  });
  localStorage.setItem("tasks",JSON.stringify(tasks));
}

function loadTasks(){
  const tasks=JSON.parse(localStorage.getItem("tasks")||"[]");
  tasks.forEach(t=>createTask(t.text,t.completed,t.subtasks,t.subStyle,t.priority,t.due));
}

function filterTasks(){}
 
