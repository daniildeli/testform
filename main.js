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

function makeRequest() {
  console.log(getAction());
  let action = getAction();
  let api = 'https://my-json-server.typicode.com/daniildeli/testform/posts/';

  switch(action.toLowerCase()) {
    case 'get': 
      api += postId.value;
  }
  let promise = new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();

    xhr.open(action.toUpperCase(), api, true);
    xhr.send();


    xhr.onreadystatechange = function () {
      if (xhr.status !== 200) {
        reject(`${xhr.status}: ${xhr.statusText}`);
      }
      if (!!xhr.response) {
        resolve(xhr.response);
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
        .then((result) => console.log(JSON.parse(result)))
        .catch((error) => console.log('Error: ', error));
    }

    target = target.parentNode;
  }
});