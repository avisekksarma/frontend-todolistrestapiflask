var flash_msg_div;
var register_div_wrapper;
var login_div_wrapper;
var content;
var addTodoDiv;

document.addEventListener('DOMContentLoaded',event => {

    // check if user is logged in
    
    initializeVariables();
    checkLoggedIn();
    getTodos();
    // make the all todos in nav to be like active
    document.querySelector('.nav-todolist').style.backgroundColor = '#74B9FF';

    document.querySelector('#register-to-login').addEventListener('click',e =>{
        register_div_wrapper.style.display = 'none';
        login_div_wrapper.style.display = 'block';
    })
    document.querySelector('#login-to-register').addEventListener('click',e =>{
        register_div_wrapper.style.display = 'block';
        login_div_wrapper.style.display = 'none';
    })

    let registerbtn = document.querySelector('.submit-btn-register')
    registerbtn.addEventListener('click',event=>{
        event.preventDefault()
        var username = document.getElementById('register-username').value
        var email = document.getElementById('register-email').value
        var password = document.getElementById('register-password').value
        if ( username && email && password){
            login_register_user(username,email,password,'register');
        }else{
            console.log('please enter all the credentials.')
        }
    })

    let loginbtn = document.querySelector('.submit-btn-login')
    loginbtn.addEventListener('click',event=>{
        event.preventDefault()
        var username = document.getElementById('login-username').value
        var password = document.getElementById('login-password').value
        if ( username && password){
            login_register_user(username,'',password,'login');
        }else{
            console.log('Please enter all the credentials.')
        }
    })

    // event listener to change color to blue if clicked in nav-todolist
    document.querySelectorAll('.nav-todolist').forEach(elem => {
        elem.addEventListener('click',e =>{
            if (window.getComputedStyle(elem).backgroundColor == 'rgb(186, 220, 87)'){
                // if color is green then make it blue.
                elem.style.backgroundColor = '#74B9FF'
                
                document.querySelectorAll('.nav-todolist').forEach(box => {
                    if (box != elem){
                        box.style.backgroundColor = '#BADC57'
                    }
                })
                console.log(elem.innerText)
        
                // get the todos for uncompleted or completed section.
                getTodos(elem.innerText)
            }
        })
        
    })

    addtodoitem();
})


function login_register_user(username,email,password,login_register){
    var json_body = {
        username: username,
        email : email,
        password: password,
        app_name : 'avisektodo'
    }

    var URL;
    if (login_register === 'login'){
        URL = 'http://127.0.0.1:5000/api/login'
    }else{
        URL = 'http://127.0.0.1:5000/api/register'
    }

    fetch(URL,{
        credentials: 'include',   //used for sending the cookies and also storing the cookies for whatever server sends in set-cookie.
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            
        },
        body: JSON.stringify(json_body)
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        if (result.error){
            console.log(result.error)
            flash_msg_div.style.visibility = 'visible';
            flash_msg_div.style.backgroundColor = 'lightcoral'
            flash_msg_div.firstElementChild.innerHTML = result.error;
        }else{
            console.log(result.success)
            flash_msg_div.style.visibility = 'visible';
            flash_msg_div.style.backgroundColor = 'lightgreen'
            flash_msg_div.firstElementChild.innerHTML = result.success;

            if (login_register == 'login'){
                register_div_wrapper.style.display = 'none';
                login_div_wrapper.style.display = 'none';
                content.style.display = 'block';
                addTodoDiv.style.display = 'block'
            }else{
                register_div_wrapper.style.display = 'none';
                login_div_wrapper.style.display = 'block';
            }
            
        }
    })
    .catch(e => {
        console.log(e)
    })
}

function getTodos(value='ALL TODOS'){
    
    fetch('http://127.0.0.1:5000/api/todos',{
        credentials:'include'
    })
    .then(response => response.json())
    .then(result => {
        let todolist = document.querySelector('.todolist')
        todolist.innerHTML = ''
        console.log(result)
        result.todos.forEach(element => {
            if (value === 'ALL TODOS'){
                console.log(element.completed)
                console.log( typeof element.completed)
                if (!element.completed){
                    todolist.innerHTML += getATodoInTodolist(element.todo,element.id,element.completed)
                }
            }else{
                if (element.completed){
                    todolist.innerHTML += getATodoInTodolist(element.todo,element.id,element.completed)
                }
            }
        })
    })
    .then( () => {
        update_todo_list();
    })
    .catch(e=>{
        console.log(e)
    })
}

function checkLoggedIn(){
    
    //  the fetch is done to confirm from the server side whether he is logged in or not.
    fetch('http://127.0.0.1:5000/api/login',{ 
        credentials: 'include',
    })   // credentials include is used in sending and receiving cookies in the cross-origin requests.
    .then(response => response.json())
    .then(result => {
        console.log(result)
        if (result.error){
            console.log('You are not logged in.')
            content.style.display = 'none';
            addTodoDiv.style.display = 'none'
            register_div_wrapper.style.display = 'none'
            login_div_wrapper.style.display = 'block';
            return 
        }else{
            console.log('You are logged in.')
            login_div_wrapper.style.display = 'none'
            register_div_wrapper.style.display = 'none'
            content.style.display = 'block';
            addTodoDiv.style.display = 'block'
            return
        }
    })
    .catch(e => {
        console.log(e)
    })

}


function initializeVariables(){
    flash_msg_div = document.querySelector('.flash_msg')
    register_div_wrapper = document.querySelector('.register-div-wrapper')
    login_div_wrapper = document.querySelector('.login-div-wrapper')
    content = document.querySelector('.content')
    addTodoDiv = document.querySelector('.create-a-new-todo')
}

function addtodoitem(){
    btnAddTodo = document.querySelector('#button-add-todo-item')
    btnAddTodo.addEventListener('click',(e)=> {
        console.log('clicked on add btn');

        let todo_item = document.querySelector('#added-todo-item').value;
        if (todo_item !== ''){
            fetch('http://127.0.0.1:5000/api/todos',{
                credentials: 'include',  // sends cookies and also sets cookies sent from server in cross origin requests.
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    
                },
                body:JSON.stringify({
                    todo:todo_item
                })
            })
            .then( res => res.json())
            .then( result => {
                console.log(result)
            })
            todo_item.value = ''
            location.reload();
        }else{
            console.log('You sent an empty data.')
        }
    })
}

function getATodoInTodolist(todo_value,todo_id,is_completed){
    let symbol_number;
    try {
        let last_todo = document.querySelector('.todolist').lastElementChild
        symbol_number = parseInt(last_todo.querySelector('span.sn').innerText) + 1
    }catch(error){
        symbol_number = 1
    }
    
    let aTodoInTodolist;
    if (!is_completed){
        aTodoInTodolist = `<table class="todos">
    <td class="align-middle"><p><span class="sn">${symbol_number}</span>
    ${todo_value}
    <button class="btn btn-sm btn-success mark-complete" data-id = "${todo_id}">Completed</button>
    <button class="btn btn-sm btn-danger delete" data-id = "${todo_id}">Delete</button>
    </p>
    </td>
    </table>`
    }
    else{
        aTodoInTodolist = `<table class="todos">
    <td class="align-middle"><p><span class="sn">${symbol_number}</span>
    ${todo_value}
    <button class="btn btn-sm btn-danger delete" data-id = "${todo_id}">Delete</button>
    </p>
    </td>
    </table>`
    }

    return aTodoInTodolist
}


//  this function updates the todo list item by deleting a todo or marking it as complete.
function update_todo_list(){
    btnMarkComplete = document.querySelectorAll('.mark-complete')
    btnDelete = document.querySelectorAll('.delete')
    
    if (btnMarkComplete.length !== 0){
        btnMarkComplete.forEach(function(btn){
            btn.addEventListener('click',e => {
                console.log(`Complete btn was clicked ${btn.dataset.id}`)
                fetch(`http://127.0.0.1:5000/api/todos/${btn.dataset.id}`,{
                    credentials:'include',
                    method: 'PUT',
                    headers : {
                        'Content-Type':'application/json',
                    },
                    body : JSON.stringify({
                        completed: 'Yes'
                    })
                })
                .then(res => res.json())
                .then(res => console.log(res))
                .then(()=> location.reload())
            })
        })
    }

    if (btnDelete.length !== 0){
        btnDelete.forEach(function(btn){
            btn.addEventListener('click',e => {
                console.log(`Delete btn was clicked ${btn.dataset.id}`)
                fetch(`http://127.0.0.1:5000/api/todos/${btn.dataset.id}`,{
                    credentials:'include',
                    method: 'DELETE'
                })
                .then(res => res.json())
                .then(res => console.log(res))
                .then(()=> location.reload())
            })
        })
    }
}
