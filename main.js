let login = "login";
let pass = 'pass';

let xhr = new XMLHttpRequest();

let body = {
  "title": "titleName",
  "body": 'Body'
};

xhr.open('POST', 'https://my-json-server.typicode.com/daniildeli/testform/posts', true);
// xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhr.setRequestHeader('Content-Type', 'application/json');

xhr.send(JSON.stringify(body));

xhr.onreadystatechange = function () {
  console.log(xhr.responseText);
};