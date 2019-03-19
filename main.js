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

const myForm = document.querySelector('#my-test-form');
const radioInputs = document.getElementsByName('radioAction');
const postId = myForm.querySelector('#post-id');
const postTitle = myForm.querySelector('#post-title');
const postBody = myForm.querySelector('#post-body');



function getAction() {
  for(let i = 0; i < radioInputs.length; i++) {
    if(radioInputs[i].checked) {
      return radioInputs[i].value;
    }
  }
}

function makeRequest(action = getAction()) {
  console.log(getAction());
  
  let api = 'https://my-json-server.typicode.com/daniildeli/testform/posts/';

  if(action.toLowerCase() !== 'create') {
    api += postId.value;
  }
  
  let obj = {};

  let promise = new Promise((resolve, reject) => {

    let xhr = new XMLHttpRequest();
    xhr.open(action.toUpperCase(), api, true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

    switch (action.toLowerCase()) {
      case 'get':  
        xhr.send();
        break;

      case 'post':
        
        obj.title = postTitle.value,
        obj.body = postBody.value;
        

        xhr.send(JSON.stringify(obj));
        break;


      // case 'put':
      //   obj.title = postTitle.value,
      //   obj.body = postBody.value;

      //   xhr.send(JSON.stringify(obj));
      //   break;

      // case 'delete':
      //   xhr.send();
      //   break;
    }    


    xhr.onreadystatechange = function () {
      if (xhr.status !== 200) {
        reject(`${xhr.status}: ${xhr.statusText}`);
      }

      if (!!xhr.response) {
        resolve(JSON.parse(xhr.response));
      }

    };
  });

  return promise;
}

myForm.addEventListener('click', (e) => {
  let target = e.target;
  while (target !== myForm) {
    if (target.tagName === 'BUTTON') {
      makeRequest()
        .then((result) => console.log(result))
        .catch((error) => console.log('Error: ', error));
    }

    target = target.parentNode;
  }
});