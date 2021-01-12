const fs = require('fs');
const path  = require('path');

const todo_path = path.join(process.cwd(), "todo.txt");
const done_path = path.join(process.cwd(), "done.txt");

var inputs = process.argv;
fs.appendFileSync(todo_path, "");
fs.appendFileSync(done_path, "");

if (process.argv.length == 2)
    inputs.push("help");

if (inputs[2] == "help") {
    let help_txt = "Usage :-\n$ ./todo add \"todo item\"  # Add a new todo\n$ ./todo ls               # Show remaining todos\n$ ./todo del NUMBER       # Delete a todo\n$ ./todo done NUMBER      # Complete a todo\n$ ./todo help             # Show usage\n$ ./todo report           # Statistics";
    console.log(help_txt);
}

else if (inputs[2] == "ls") {
    let todos = fs.readFileSync(todo_path, 'utf8');
    todos = todos.replace("\r", "").split("\n");

    if (todos[0] == '') {
        console.log("There are no pending todos!");
    } else {
        for (let i = todos.length-2; i>=0; i--)
            console.log(`[${i+1}] ${todos[i]}`);
    }
}

else if (inputs[2] == "add") {
    if (inputs.length == 4){
        fs.appendFileSync(todo_path, inputs[3]+"\n");
        console.log("Added todo: \""+inputs[3]+"\"");
    } else {
        console.log("Error: Missing todo string. Nothing added!");
    }
}

else if (inputs[2] == "del") {
    if (inputs.length == 4){
        let todos = fs.readFileSync(todo_path, 'utf8');
        todos = todos.replace("\r", "").split("\n");
        let index = inputs[3] - 1;

        if (index>=0 && index<inputs.length-1){
            todos.splice(index, 1);
            fs.writeFileSync(todo_path, "");
            todos.forEach((todo) => fs.appendFileSync(todo_path, todo+"\n"));
            console.log(`Deleted todo #${index+1}`);
        } else {
            console.log(`Error: todo #${index+1} does not exist. Nothing deleted.`);
        }
    } else {
        console.log("Error: Missing NUMBER for deleting todo.");
    }
}

else if (inputs[2] == "done") {
    if (inputs.length == 4){
        let todos = fs.readFileSync(todo_path, 'utf8');
        todos = todos.replace("\r", "").split("\n");
        let index = inputs[3] - 1;

        if (index>=0 && index<inputs.length-1){
            let data = todos[index];
            todos.splice(index, 1);
            fs.writeFileSync(todo_path, "");
            for(let i=0; i<todos.length-1; i++)
                fs.appendFileSync(todo_path, todos[i]+"\n");
            let date = new Date();
            fs.appendFileSync(done_path, `x ${date.toISOString().slice(0, 10)} ${data}\n`);
            console.log(`Marked todo #${index+1} as done.`);
        } else {
            console.log(`Error: todo #${index+1} does not exist.`);
        }
    }
    else {
        console.log("Error: Missing NUMBER for marking todo as done.");
    }
}

else if (inputs[2] == "report") {
    let date = new Date();
    let todos = fs.readFileSync(todo_path, 'utf8');
    let dones = fs.readFileSync(done_path, 'utf8');
    todos = todos.replace("\r", "").split("\n");
    dones = dones.replace("\r", "").split("\n");
    console.log(`${date.toISOString().slice(0, 10)} Pending : ${todos.length-1} Completed : ${dones.length-1}`);
}