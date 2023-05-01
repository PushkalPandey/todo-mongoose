// var button = document.getElementById("btn");
var ip=document.getElementById("ipt");
var parent = document.getElementById("parent");
var btn = document.getElementById("save-btn");
var count=0;





//FOR PRE PRINTING AFTER LOADING THE Page
var request = new XMLHttpRequest();

request.open("GET", "/todos");
request.send();


request.addEventListener("load", function()
{

  var todos = JSON.parse(request.responseText);

  todos.forEach(function(todo)
  { console.log(todo);
    // console.log(`/images${todo.imagePath}`);
    printTodo(todo.text, todo.done,`/images/${todo.imagePath}`);
    // var li = document.createElement("li");
    // li.innerHTML = todo.text;

    // parent.appendChild(li);
  })

  
})



///





// //ADD TODO
// btn.addEventListener("click", function()
// {
//   if(ip.value!=""){
//   var request = new XMLHttpRequest();

//   request.open("post", "/add-todo");
//   request.setRequestHeader("Content-type","application/json")
//   request.send(JSON.stringify( { text: ip.value, done: false} ));


//   request.addEventListener("load", function()
//   {
//     console.log(request);
//     if(request.status==202 && request.readyState==4){
//       alert("Unique Value Required")
//     } 
//     else
//     printTodo(ip.value);
//   })
// }
// else{
//   alert("Empty Input!!!");
// }
// })





//To print single Todo
function printTodo(text,checkStatus, imgpath){ 
    var todoContainer = document.createElement("div");
        todoContainer.setAttribute("class","todoContainer");
        todoContainer.setAttribute("id",`${text}${count}`);
        parent.appendChild(todoContainer);
    
    //Text Node appended
        var textNode = document.createElement("p");
        textNode.innerText=text;
        todoContainer.appendChild(textNode);


        //     uploaded image display
        var img = document.createElement("img");
        img.setAttribute("src",imgpath);
todoContainer.appendChild(img);
        //Delete btn

        var deleteBtn = document.createElement("button");
        deleteBtn.setAttribute("id",`del${count}`);
        deleteBtn.innerHTML="X";
        todoContainer.appendChild(deleteBtn);

        //Delete button avent listener
        deleteBtn.addEventListener("click",function(){

           
            var request = new XMLHttpRequest();
            request.open("post", "/delete-todo");
            request.setRequestHeader("Content-type","application/json");

            request.send(JSON.stringify( { text: text} ));

          
            request.addEventListener("load", function()
            {
                deleteTodo(deleteBtn);
                // deleteTodo(ok);
                 // printTodo(ip.value);
            });
        

        });




        //checkbox

var checkBox = document.createElement("input");

        checkBox.type = "checkbox";
        if(checkStatus){
          checkBox.checked =true;
        }
        checkBox.setAttribute("id",`check${count}`);
        
        todoContainer.appendChild(checkBox);



    //checkBox addEvent Listener
    checkBox.addEventListener("click", function(){

      console.log(checkBox.checked);


      var request = new XMLHttpRequest();
            request.open("post", "/check-todo");
            request.setRequestHeader("Content-type","application/json");

            request.send(JSON.stringify( { text: text} ));

            request.addEventListener("load", function()
            {
              
                if(checkBox.checked){
                  textNode.style.textDecoration="line-through";
                }
                else{
                  textNode.style.textDecoration="none";
                }

               
            });

    })

    checkStatus=checkBox.checked;

    if(checkStatus==true){
      textNode.style.textDecoration="line-through";
    }
    else{
      textNode.style.textDecoration="none";
    }


    parent.appendChild(todoContainer);
    clearInput(ip)

    count++;
}



function deleteTodo(delEl){

    var todoParent = delEl.parentNode;
    console.log(todoParent);
    parent.removeChild(todoParent);
}



function clearInput(ip) {
    // ip.value="";
}















/* ---------------- ---------------- ---------------- ---------------- ---------------- ---------------- ---------------- ---------------- ---------------- ---------------- ---------------- ---------------- ----------------*/





// var todos = getTodos();

// todos.forEach(function(todo) {
//     printTodo(todo);
// });


// ip.addEventListener("keydown",function(event) {
//     if(event.key =="Enter"){

//         addTodo(ip.value);
//     }
// });


// button.addEventListener("click",function(event) {
//     addTodo(ip.value);
// });


// //ADD ToDO
// function addTodo(value) {
//     var isValidTodo = checkValidTodo(value);

//     if(isValidTodo)
//     {
//         printTodo(value);
//         saveTodo(value);
//         clearInput(ip);
//     }
//     else{
//         console.log('INPUT IS EMPTY');
//     }
// }



// //Print ToDO
// function printTodo(value) {
//     var todoContainer = document.createElement("div");
//     todoContainer.setAttribute("class","container");
//     parent.appendChild(todoContainer);


//     var textNode = document.createElement("p");
//     textNode.innerText=value;
//     todoContainer.appendChild(textNode);

//     var deleteBtn=document.createElement("button");
//     deleteBtn.innerHTML=`<i class="fa-solid fa-trash-can"></i>`;
//     todoContainer.appendChild(deleteBtn);
    

//     deleteBtn.addEventListener("click",function(event) {
//         removeTodo(value);
//         parent.removeChild(todoContainer);
//     })


//     var check=document.createElement("INPUT");
//     check.setAttribute("type", "checkbox");
//     todoContainer.appendChild(check);

//     check.addEventListener('change',function(event){
//         if(this.checked){
//         //    var container = event.target.parentNode;
//         //    container.childNodes[0].setAttribute("style","text-decoration:line-through");
//         textNode.style.textDecoration="line-through";
//     }
//         else {
//         //   var container = event.target.parentNode;
//         //    container.childNodes[0].setAttribute("style","text-decoration:none");
//         textNode.style.textDecoration="none";
//     }
//       });


//     var editBtn=document.createElement("button");
//     // editBtn.innerHTML=`<i class="fa-solid fa-pencil"></i>`;
//     editBtn.innerHTML = "Edit";
//     todoContainer.appendChild(editBtn);


//     editBtn.addEventListener("click",function(event){
//         var parent = event.target.parentNode;
//         let text = parent.childNodes[0].innerText;
//         console.log(text);
//         ip.value=text;
//         parent.remove();
//     })

// }


// //Validity Checker
// function checkValidTodo(value) {
//     if(value){
//         return true;
//     }
// }

// //Clear Input Fn
// function clearInput(element) {
//     element.value="";
// }

// function getTodos(){

//     var todos = localStorage.getItem("todos");

//     if(todos)
//     {
        
//         return JSON.parse(todos);
//     }

//     return [];
// }

// function saveTodo(value){
//     var todos = getTodos();

//     todos.push(value);

//     todos = JSON.stringify(todos);
//     localStorage.setItem("todos",todos);
// }


// function removeTodo(value){
//     var todos = getTodos();

//     for(var i = 0; i < todos.length;i++){
//         if(todos[i] == value){
//             todos.splice(i, 1);
//             todos = JSON.stringify(todos);
//     localStorage.setItem("todos",todos);
//     break;
//         }
//     }
// }