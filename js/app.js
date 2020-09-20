const list = document.querySelector('.list');
document
  .querySelector('button[type=submit]')
  .addEventListener('mouseover', (e) => {
    document.querySelector('input[name=todo]').focus();
    document.querySelector('input[name=todo]').classList.add('active');
  });
document
  .querySelector('button[type=submit]')
  .addEventListener('mouseout', (e) => {
    const inputText = document.querySelector('input[name=todo]').value.trim();
    if (!inputText) {
      document.querySelector('input[name=todo]').classList.remove('active');
    }
    return;
  });
document
  .querySelector('input[name=todo]')
  .addEventListener('mouseover', (e) => {
    document.querySelector('input[name=todo]').classList.add('active');
  });
document.querySelector('input[name=todo]').addEventListener('mouseout', (e) => {
  if (!e.currentTarget.value) {
    document.querySelector('input[name=todo]').classList.remove('active');
  }
  return;
});

// prevent Default
document.querySelector('button[type=submit]').addEventListener('click', (e) => {
  e.preventDefault();
});

//get all data

const renderList = (doc) => {
  const li = document.createElement('li');
  const spanTodo = document.createElement('span');
  const spanDel = document.createElement('span');
  const img = document.createElement('img');

  const inputEdit = document.createElement('input');
  inputEdit.type = 'text';
  inputEdit.placeholder = 'edit todo';
  inputEdit.classList.add('inputText');

  spanTodo.classList.add('list-todo');
  spanDel.classList.add('list-del');
  img.src = '../images/trash-icon.png';
  img.alt = 'delete';

  //adding contents
  spanTodo.textContent = doc.data().text;
  li.setAttribute('id', doc.id);

  //delete li
  spanDel.addEventListener('click', (e) => {
    e.stopPropagation();
    const id = e.currentTarget.parentElement.getAttribute('id');
    db.collection('todos').doc(id).delete();
  });

  //edit li
  li.addEventListener('dblclick', (e) => {
    e.stopPropagation();
    spanDel.setAttribute('style', 'display: none');
    const id = e.currentTarget.getAttribute('id');
    inputEdit.value = spanTodo.textContent;
    spanTodo.replaceWith(inputEdit);
    inputEdit.focus();

    list.addEventListener('mouseleave', (e) => {
      spanTodo.textContent = inputEdit.value.trim() || 'edit todo';
      spanDel.setAttribute('style', 'display: inline');
      inputEdit.replaceWith(spanTodo);
      db.collection('todos').doc(id).update({
        text: spanTodo.textContent,
      });
    });
  });

  //adding elements to each other
  spanDel.appendChild(img);
  li.appendChild(spanTodo);
  li.appendChild(spanDel);
  list.appendChild(li);
};

//add new todo
document.querySelector('button[type=submit]').addEventListener('click', (e) => {
  e.preventDefault();
  const text = document.querySelector('input[name=todo]');
  if (text.value.trim()) {
    db.collection('todos').add({
      text: text.value.trim(),
    });
    text.value = '';
  }
});

//refresh data
db.collection('todos').onSnapshot((snapshot) => {
  const changes = snapshot.docChanges();
  changes.map((change) => {
    if (change.type === 'added') {
      renderList(change.doc);
    } else if (change.type === 'removed') {
      const li = list.querySelector(`[id='${change.doc.id}']`);
      list.removeChild(li);
    } else if (change === 'modified') {
      const li = list.querySelector(`[id='${change.doc.id}']`);
      li.firstChild.textContent = change.data().text;
    }
  });
});
