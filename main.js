// Do your work here...
const books = [];
const STORAGE_KEY = 'bookshelf_app';
const BOOK_SAVED_EVENT = 'book_saved';
const RENDER_EVENT = 'render_book';

function StorageExists() {
  if (typeof Storage === undefined) {
    alert('Browser tidak mendukung local storage');
    return false;
  }
  return true;
}

function saveData() {
  if (StorageExists()) {
    const booksJSON = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, booksJSON);
    document.dispatchEvent(new Event(BOOK_SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const json = localStorage.getItem(STORAGE_KEY);

  if (books !== null) {
    books = JSON.parse(json);
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener(BOOK_SAVED_EVENT, () => {
  console.log('Buku berhasil disimpan.');
});

document.addEventListener(RENDER_EVENT, function () {
  const unfinishedReads = document.getElementById('incompleteBookList');
  unfinishedReads.innerHTML = '';

  const finishedReads = document.getElementById('completeBookList');
  finishedReads.innerHTML = '';

  books.forEach((book) => {
    const bookElement = makeBookElt(book);

    if (book.isComplete) {
      finishedReads.append(bookElement);
    } else {
      unfinishedReads.append(bookElement);
    }
  });
});

function makeBookElt(book) {}
