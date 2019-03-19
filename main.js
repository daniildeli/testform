// let login = "login";
// let pass = 'pass';

// let xhr = new XMLHttpRequest();

// let body = {
//   "title": "titleName",
//   "body": 'Body'
// };

// xhr.open('POST', 'https://my-json-server.typicode.com/daniildeli/testform/posts', true);
// // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
// xhr.setRequestHeader('Content-Type', 'application/json');

// xhr.send(JSON.stringify(body));

// xhr.onreadystatechange = function () {
//   console.log(xhr.responseText);
// };

// ------------------------- Using Promises ------------------------------------------------

// const myForm = document.querySelector('#my-test-form');
// const radioInputs = document.getElementsByName('radioAction');
// const postId = myForm.querySelector('#post-id');
// const postTitle = myForm.querySelector('#post-title');
// const postBody = myForm.querySelector('#post-body');



// function getAction() {
//   for(let i = 0; i < radioInputs.length; i++) {
//     if(radioInputs[i].checked) {
//       return radioInputs[i].value;
//     }
//   }
// }

// // function validate(action) {
// //   if(!!action) {
// //     switch (action.toLowerCase()) {
// //       case 'get':
// //         // if (!!postId.value) {
// //         //   return new Promise.reject('Provide with ID');
// //         // }
// //         postTitle.setAttribute('disabled, disabled');
// //     }
// //   } 
// // }

// function makeRequest() {
//   const action = getAction();
//   console.log(action);

//   // validate(action);

//   let api = action.toLowerCase() === 'post' ? 'https://my-json-server.typicode.com/daniildeli/testform/posts/' : `https://my-json-server.typicode.com/daniildeli/testform/posts/${postId.value}`;
    
//   let obj = {};

//   let promise = new Promise((resolve, reject) => {

//     let xhr = new XMLHttpRequest();
//     xhr.open(action.toUpperCase(), api, true);
//     xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

//     switch (action.toLowerCase()) {

//       case 'get':  

//         xhr.send();
//         break;

//       case 'post':
        
//         obj.title = postTitle.value;
//         obj.body = postBody.value;
        

//         xhr.send(JSON.stringify(obj));
//         break;


//       case 'put':
//         obj.title = postTitle.value;
//         obj.body = postBody.value;

//         xhr.send(JSON.stringify(obj));
//         break;

//       case 'delete':
//         xhr.send();
//         break;
//     }    


//     xhr.onreadystatechange = function () {
//       if (xhr.status !== 200) {
//         reject(`${xhr.status}: ${xhr.statusText}`);
//       }

//       if (!!xhr.response) {

//         let arg;

//         switch (action.toLowerCase()) {
//           case 'get': 
//             arg = JSON.parse(xhr.response);
//             break;

//           case 'post':
//             arg = JSON.parse(xhr.response);
//             break;

//           case 'put':
//             arg = `Post ${postId.value} was updated`;
//             break;

//           case 'delete':
//             arg = `Post ${postId.value} was deleted`;
//             break;
//         }

//         resolve(arg);
//       }

//     };
//   });

//   return promise;
// }

// myForm.addEventListener('click', (e) => {
//   let target = e.target;
//   while (target !== myForm) {
//     if (target.tagName === 'BUTTON') {
//       makeRequest()
//         .then((result) => console.log(result))
//         .catch((error) => console.log('Error: ', error));
//     }
//     // if (target.tagName === 'INPUT') {
//     //   validate();
//     // }
//     target = target.parentNode;
//   }
// });

// ------------------------------ Using Fetch--------------------------------------------------------

const myForm = document.querySelector('#my-test-form');
const radioInputs = document.getElementsByName('radioAction');
const postId = myForm.querySelector('#post-id');
const postTitle = myForm.querySelector('#post-title');
const postBody = myForm.querySelector('#post-body');



function getAction() {
  for (let i = 0; i < radioInputs.length; i++) {
    if (radioInputs[i].checked) {
      return radioInputs[i].value;
    }
  }
}

function makeRequest() {
  const action = getAction();
  console.log(action);

  let api = action.toLowerCase() === 'post' ? 'https://my-json-server.typicode.com/daniildeli/testform/posts/' : `https://my-json-server.typicode.com/daniildeli/testform/posts/${postId.value}`;

  if (action.toLowerCase() === 'get' || action.toLowerCase() === 'delete') {
    return fetch(api, {
      method: `${action.toUpperCase()}`
    });
  }
  
  if (action.toLowerCase() === 'post' || action.toLowerCase() === 'put') {
    return fetch(api, {
      method: `${action.toUpperCase()}`,
      body: JSON.stringify({
        title: postTitle.value,
        body: postBody.value
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });
  } 
}

myForm.addEventListener('click', (e) => {
  let target = e.target;
  while (target !== myForm) {
    if (target.tagName === 'BUTTON') {
      makeRequest()
        .then((result) => result.json())
        .then((json) => console.log(json));
    }
    target = target.parentNode;
  }
});