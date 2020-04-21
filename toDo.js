class User{
    constructor(name){
        this.name = name;
        this.listTasks = [];
    }
    toString(){
        return "[" + this.name, this.listTasks + "]"
    }
}

class Task{
    constructor(name, text, date){
        this.name = name;
        this.text = text;
        this.date = date;
    }
}

//usuário que terá suas próprias atividades
var user = new User("Default-user")
//Adicionar elemento em lista
$("#adicionar").click(function() {
    var name = $("#task-name").val()//obtenho o nome da tarefa
    if(name.length!=0){
        var newTask = new Task(name, " ", new Date()); //criando nova tarefa
        user.listTasks.push(newTask) //adição de nova tarefa no usuário
        $("#task-name").val(""); //campo do modal fica em branco
        saveStorage();
        updateTask(null);
    }else{
        alert("Você não pode criar uma tarefa sem nome!")
    }
 
})

function saveStorage() {
    localStorage.setItem("users", JSON.stringify(user.listTasks))
}


$('#task-search').keyup(function(){
    var search = $("#task-search").val().toUpperCase();

    found = user.listTasks.filter(function(el) {
        return el.name.toLowerCase().indexOf(search.toLowerCase()) > -1;
    })

    if(found.length!=0){
        updateTask(found)
    }
});

$("#refresh").click(function () {
    $("#task-search").val("")
    updateTask(null);
})

//Remover elemento em lista
$("#removeTask").click(function() {
    var title = $("#titleTask").text();
    var text = $("#contentTask").text();
    var index = -1;
    for(var i=0; i<user.listTasks.length; i++){
        if(user.listTasks[i].name==title&&user.listTasks[i].text==text){
            index=i;//id encontrado
            break;
        }
    }
    if(index!=-1) {
        user.listTasks.splice(index,1);
    }
    updateTask(null);
    topContent(0);//exibição do primeiro item da lista no painel
    saveStorage()
});


$("#removeData").click(function () { //lista de tarefas é removida do localStorage
    localStorage.removeItem("users")
    user.listTasks = JSON.parse(localStorage.getItem("users") || '[]')
    alert("Dados deletados!")
})

//sempre que digitar no text área, salvar na variável
$('#contentTask').keyup(function(){
    var title = $("#titleTask").text();
    var text = $("#contentText").val();
    for(var i=0; i<user.listTasks.length; i++){
        if(user.listTasks[i].name==title){
            var task = new Task(title, text, new Date())
            user.listTasks.splice(i,1);//removo elemento
            user.listTasks.unshift(task)//o insiro novamente no topo
            break;
        }
    }
    saveStorage();
    updateTask(null);
})

function updateTask(taskList) {

    taskList = taskList==null? user.listTasks : taskList;

    if(taskList.length!=0){
        $("#livro").text(' ');

        for(var i=0; i<taskList.length; i++){
            var name = taskList[i].name.length > 25? taskList[i].name.substring(0,25) + "...": taskList[i].name; 
            $("#livro").append(`<a id = ${i} class="task list-group-item list-group-item-action font-weight-bold"  data-toggle= "tooltip" title ="Atividade número 01"  data-placement="top"href="#c2">
            ${name}
            </a>`)
        }
    }else{
        $("#titleTask").text("");
        $("#dateTask").text("");
        $("#livro").html('<h6 class="text-dark d-flex justify-content-center">Sem novas atividades</h6>');
        $("#contentTask").html(`<div class="row-3 text-primary d-flex justify-content-center align-items-center" style="min-height: 520px;">
        <div class="col-4">
            <img src="public/img/icons/empty.png" style="opacity: 0.3;" width="220px" height="200px">
        </div>

        <div class="col-6 text-primary ">
            <p class="font-weight-bold">
                Que pena, não há anotações para mostrar :(
            </p> 
            <br>
            > Crie uma tarefa clicando no botão +
            <br>
            > Selecione uma tarefa existente na lista ao lado
        </div>

    </div>  `)
    }

}

//função para elementos criados dinamicamente
$(function () {
    user.listTasks = JSON.parse(localStorage.getItem("users") || '[]') //recepção da lista armazenada no local storage, caso ela exista

    for(var i=0; i<user.listTasks.length;i++)
        user.listTasks[i].date = Date(user.listTasks[i].date) 

    updateTask(null);
    //Usuário clicou em tarefa
    $("#livro").on('click','.task',function() {
        $("#task-search").val("")
        var id = $(this).attr("id") 
        topContent(id);
        console.log(id)
    });
});

function topContent(id) {
    if(user.listTasks.length!=0){
        $("#titleTask").text(user.listTasks[id].name);
        var date = user.listTasks[id].date
        var texto = `<textarea id="contentText" class="form-control" style="min-height: 550px; resize:none;">${user.listTasks[id].text}</textarea>`
        $("#contentTask").html(texto);
        $("#dateTask").text(  `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} - ` +  `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}` )
        $("#opcoes").html(`<button  id="btn-delete" class="btn btn-light" data-toggle="modal" data-target="#delete">
        <img src="public/img/icons/trash.png" width="30px" height="30px" alt="adicionar nova tarefa"></button>`)
    }
}
