'use strict';
// ------------------------- Using Promises ------------------------------------------------

const myForm = document.querySelector('#my-test-form');
const radioInputs = document.getElementsByName('radioAction');
const postId = myForm.querySelector('#post-id');
const postTitle = myForm.querySelector('#post-title');
const postBody = myForm.querySelector('#post-body');
const typeElements = myForm.getElementsByClassName('type-element');
const radioFieldset = myForm.querySelectorAll('.radio-fieldset')[0];
const codePlace = document.getElementsByClassName('code')[0];


function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

function getAction() {
  for(let i = 0; i < radioInputs.length; i++) {
    if(radioInputs[i].checked) {
      return radioInputs[i].value;
    }
  }
}

function validate(arg) {
  const action = getAction();

  if(!action) {
    radioFieldset.classList.add('error');
    throw new Error('Choose action');
  }

  if(!!arg) {
    for (let i = 0; i < arg.length; i++) {
      if (arg[i].classList.contains('error')) {
        arg[i].classList.remove('error');
      }
    }
    return;
  }

  switch (action.toLowerCase()) {
    case 'get': 
      if(!postId.value) {
        postId.classList.add('error');
        throw new Error('Provide with ID');
      }

      break;

    case 'post':
      if (!postTitle.value) {
        postTitle.classList.add('error');
      }

      if (!postBody.value) {
        postBody.classList.add('error');
      }

      if (!postTitle.value || !postBody.value) {
        throw new Error('Provide with title and post text');
      }

      break;

    case 'put':
      if (!postId.value) {
        postId.classList.add('error');
      }

      if (!postTitle.value) {
        postTitle.classList.add('error');
      }

      if (!postBody.value) {
        postBody.classList.add('error');
      }
      if (!postId.value || !postTitle.value || !postBody.value) {
        throw new Error('Provide with ID, title and text');
      }
    break;

    case 'delete':
      if (!postId.value) {
        postId.classList.add('error');
        throw new Error('Provide with ID');
      }

      break;

    default: return;
  }  
}

function clearInputs(arg = typeElements) {
  for (let i = 0; i < arg.length; i++) {
    arg[i].value = '';
  }

  return;
}

function setInputsState() {

  for (let i = 0; i < typeElements.length; i++) {
    typeElements[i].removeAttribute('required');
    typeElements[i].removeAttribute('disabled');
  }

  const action = getAction();

  if (action.toLowerCase() === 'get' || action.toLowerCase() === 'delete') {
    postId.setAttribute('required', true);
    postTitle.setAttribute('disabled', true);
    postBody.setAttribute('disabled', true);
  }

  if (action.toLowerCase() === 'post' || action.toLowerCase() === 'put') {
    postTitle.setAttribute('required', true);
    postBody.setAttribute('required', true);
  }

  if (action.toLowerCase() === 'post') {
    postId.setAttribute('disabled', true);
  }

  if (action.toLowerCase() === 'put') {
    postId.setAttribute('required', true);
  }

  const arrToClear = [];

  for (let i = 0; i < typeElements.length; i++) {
    if (typeElements[i].disabled) {
      arrToClear.push(typeElements[i]);
    }
  }

  clearInputs(arrToClear);
}

function makeRequest(myApi, action = getAction().toLowerCase()) {
  console.log(action);

  let api = action === 'post' ? 'https://my-json-server.typicode.com/daniildeli/testform/posts/' : `https://my-json-server.typicode.com/daniildeli/testform/posts/${postId.value}`;
  
  // let api = action.toLowerCase() === 'post' ? 'http://localhost:3000/posts' : `http://localhost:3000/posts/${postId.value}`;
    
  const obj = {};

  const promise = new Promise((resolve, reject) => {

    let xhr = new XMLHttpRequest();
    xhr.open(action.toUpperCase(), myApi || api );
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');    

    if (action === 'post') {
      obj.id = uuidv4();
    }

    if (action === 'post' || action === 'put') {
      obj.title = postTitle.value;
      obj.body = postBody.value;
      xhr.send(JSON.stringify(obj));
    } else {
      xhr.send();
    }

    const postID = postId.value || null;

    xhr.onreadystatechange = function () {
      if (xhr.status === 404 && action === 'delete' || xhr.status === 404 && action === 'get') {
        reject(`Post with ID: '${postID}' not found`);
      }

      if (xhr.status !== 200 && xhr.status !== 201) {
        reject(`${xhr.status}: ${xhr.statusText}`);
      }
      
      if (!!xhr.response) {

        let arg;

        switch (action.toLowerCase()) {
          case 'get': 
            arg = JSON.parse(xhr.response);
            break;

          case 'post':
            arg = JSON.parse(xhr.response);
            break;

          case 'put':
            arg = `Post ${postID} was updated`;
            break;

          case 'delete':
            arg = `Post ${postID} was deleted`;
            break;
        }

        resolve(arg);
      }

    };
  });
  
  return promise;
}


myForm.addEventListener('click', (e) => {
  let target = e.target;
  while (target !== myForm) {
    if (target.tagName === 'BUTTON') {
      validate();
      makeRequest()
        .then((result) => { 
          console.log(result); 
          clearInputs(); 
          printData();
        })
        .catch((error) => console.log('Error: ', error));
    }

    target = target.parentNode;
  }
});

myForm.addEventListener('input', (e) => {
  let target = e.target;
  while (target !== myForm) {

    if (target.name === 'radioAction') {
      validate(typeElements);
      setInputsState();
    }

    if (target.tagName === 'INPUT' && target !== postTitle && getAction() === 'put' && postId.value.length === 36) {
        makeRequest(null, 'get')
          .then((result) => {
            postTitle.value = result.title;
            postBody.value = result.body;
            if (!!postTitle.value && !!postBody.value) {
              validate(typeElements);
            } 
          })
          .catch((err) => console.log(err));
    }
    
    if (target.classList.contains('error')) {
      target.classList.remove('error');
    }

    target = target.parentNode;
  }
});

function printData() {
  makeRequest('https://my-json-server.typicode.com/daniildeli/testform/posts/', 'get')
    .then((result) => {
      codePlace.innerText = JSON.stringify(result);
      
    });
}

window.onload = printData();

// ------------------------------ Using Fetch--------------------------------------------------------

// const myForm = document.querySelector('#my-test-form');
// const radioInputs = document.getElementsByName('radioAction');
// const postId = myForm.querySelector('#post-id');
// const postTitle = myForm.querySelector('#post-title');
// const postBody = myForm.querySelector('#post-body');
// const typeElements = myForm.getElementsByClassName('type-element');
// const radioFieldset = myForm.querySelectorAll('.radio-fieldset')[0];

// function uuidv4() {
//   return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
//     (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
//   );
// }

// function getAction() {
//   for (let i = 0; i < radioInputs.length; i++) {
//     if (radioInputs[i].checked) {
//       return radioInputs[i].value;
//     }
//   }
// }

// function validate(arg) {
//   const action = getAction();

//   if (!action) {
//     radioFieldset.classList.add('error');
//     throw new Error('Choose action');
//   }

//   if (!!arg) {
//     for (let i = 0; i < arg.length; i++) {
//       if (arg[i].classList.contains('error')) {
//         arg[i].classList.remove('error');
//       }
//     }
//     return;
//   }

//   switch (action.toLowerCase()) {
//     case 'get':
//       if (!postId.value) {
//         postId.classList.add('error');
//         throw new Error('Provide with ID');
//       }

//       break;

//     case 'post':
//       if (!postTitle.value) {
//         postTitle.classList.add('error');
//       }

//       if (!postBody.value) {
//         postBody.classList.add('error');
//       }

//       if (!postTitle.value || !postBody.value) {
//         throw new Error('Provide with title and post text');
//       }

//       break;

//     case 'put':
//       if (!postId.value) {
//         postId.classList.add('error');
//       }

//       if (!postTitle.value) {
//         postTitle.classList.add('error');
//       }

//       if (!postBody.value) {
//         postBody.classList.add('error');
//       }
//       if (!postId.value || !postTitle.value || !postBody.value) {
//         throw new Error('Provide with ID, title and text');
//       }
//       break;

//     case 'delete':
//       if (!postId.value) {
//         postId.classList.add('error');
//         throw new Error('Provide with ID');
//       }

//       break;

//     default: return;
//   }
// }

// function clearInputs(arg = typeElements) {
//   for (let i = 0; i < arg.length; i++) {
//     arg[i].value = '';
//   }

//   return;
// }

// function setInputsState() {

//   for (let i = 0; i < typeElements.length; i++) {
//     typeElements[i].removeAttribute('required');
//     typeElements[i].removeAttribute('disabled');
//   }

//   const action = getAction();

//   if (action.toLowerCase() === 'get' || action.toLowerCase() === 'delete') {
//     postId.setAttribute('required', true);
//     postTitle.setAttribute('disabled', true);
//     postBody.setAttribute('disabled', true);
//   }

//   if (action.toLowerCase() === 'post' || action.toLowerCase() === 'put') {
//     postTitle.setAttribute('required', true);
//     postBody.setAttribute('required', true);
//   }

//   if (action.toLowerCase() === 'post') {
//     postId.setAttribute('disabled', true);
//   }

//   if (action.toLowerCase() === 'put') {
//     postId.setAttribute('required', true);
//   }

//   const arrToClear = [];

//   for (let i = 0; i < typeElements.length; i++) {
//     if (typeElements[i].disabled) {
//       arrToClear.push(typeElements[i]);
//     }
//   }

//   clearInputs(arrToClear);
// }

// function makeRequest(action = getAction().toLowerCase()) {
//   console.log(action);

//   let api = action === 'post' ? 'https://my-json-server.typicode.com/daniildeli/testform/posts/' : `https://my-json-server.typicode.com/daniildeli/testform/posts/${postId.value}`;

//   const obj = { 
//     method: `${action.toUpperCase()}`,
//     headers: {
//       "Content-type": "application/json; charset=UTF-8"
//     }
//   };

//   switch (action) {
//     case 'post':
//       obj.body = JSON.stringify({
//         id: uuidv4(),
//         title: postTitle.value,
//         body: postBody.value
//       });

//       break;

//     case 'put':
//       obj.body = JSON.stringify({
//         title: postTitle.value,
//         body: postBody.value
//       });

//       break;

//     default: break;
//   }

//   return fetch(api, obj);
// }

// myForm.addEventListener('click', (e) => {
//   let target = e.target;
//   while (target !== myForm) {
//     if (target.tagName === 'BUTTON') {
//       validate();
//       makeRequest()
//         .then((result) => result.json())
//         .then((json) => {
//           console.log(json);
//           clearInputs();
//         })
//         .catch((error) => console.log('Error: ', error));
//     }

//     target = target.parentNode;
//   }
// });

// myForm.addEventListener('input', (e) => {
//   let target = e.target;
//   while (target !== myForm) {

//     if (target.name === 'radioAction') {
//       validate(typeElements);

//       setInputsState();
//     }

//     if (target.tagName === 'INPUT' && getAction() === 'put' && postId.value.length === 36) {
//       makeRequest('get')
//         .then((result) => result.json())
//         .then((result) => {
//           postTitle.value = result.title;
//           postBody.value = result.body;
//         })
//         .then(() => {
//           if (!!postTitle.value && !!postBody.value) {
//              validate(typeElements);
//            } 
//         })
//         .catch((err) => console.log(err));
//     }

//     if (target.classList.contains('error')) {
//       target.classList.remove('error');
//     }

//     target = target.parentNode;
//   }
// });