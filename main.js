// Do your work here...
let books = [];
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

  if (json) {
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

document.addEventListener('DOMContentLoaded', () => {
  const bookForm = document.getElementById('bookForm');
  bookForm.addEventListener('submit', (e) => {
    if (!document.querySelector('#bookId')) {
      e.preventDefault();
      addBook();
    } else {
      updateBook();
    }
  });

  if (StorageExists()) {
    loadDataFromStorage();
  }
});

function addBook() {
  const title = document.getElementById('bookFormTitle').value;
  const author = document.getElementById('bookFormAuthor').value;
  const year = document.getElementById('bookFormYear').value;
  const isComplete = document.getElementById('bookFormIsComplete').checked;

  const book = generateBookData(title, author, year, isComplete);
  books.push(book);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateBookData(title, author, year, isComplete) {
  let id = document.getElementById('bookId');
  if (!id) {
    id = genId();
  } else {
    id = parseInt(id.value);
  }

  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function genId() {
  return new Date().getTime();
}

/**
 * Format:
 * ```html
 * <div data-bookid="123123123" data-testid="bookItem">
 *   <h3 data-testid="bookItemTitle">Judul Buku 1</h3>
 *   <p data-testid="bookItemAuthor">Penulis: Penulis Buku 1</p>
 *   <p data-testid="bookItemYear">Tahun: 2030</p>
 *   <div>
 *     <button data-testid="bookItemIsCompleteButton">Selesai dibaca</button>
 *     <button data-testid="bookItemDeleteButton">Hapus buku</button>
 *     <button data-testid="bookItemEditButton">Edit buku</button>
 *   </div>
 * </div>
 * ```
 * @param {} book
 */
function makeBookElt(bookData) {
  const { id, title, author, year, isComplete } = bookData;

  const bookElement = document.createElement('div');
  bookElement.setAttribute('data-bookid', id);
  bookElement.setAttribute('data-testid', 'bookItem');

  const judul = document.createElement('h3');
  judul.setAttribute('data-testid', 'bookItemTitle');
  judul.innerText = title;

  const penulis = document.createElement('p');
  penulis.setAttribute('data-testid', 'bookItemAuthor');
  penulis.innerText = author;

  const tahun = document.createElement('p');
  tahun.setAttribute('data-testid', 'bookItemYear');
  tahun.innerText = year;

  const tombol = document.createElement('div');

  const selesai = document.createElement('button');
  selesai.setAttribute('data-testid', 'bookItemIsCompleteButton');
  selesai.innerText = 'Selesai dibaca';
  selesai.addEventListener('click', () => moveToFinishedBook(id));

  const belumSelesai = document.createElement('button');
  belumSelesai.setAttribute('data-testid', 'bookItemIsCompleteButton');
  belumSelesai.innerText = 'Belum selesai dibaca';
  belumSelesai.addEventListener('click', () => moveToUnfinishedBook(id));

  const hapus = document.createElement('button');
  hapus.setAttribute('data-testid', 'bookItemDeleteButton');
  hapus.innerText = 'Hapus buku';
  hapus.addEventListener('click', () => deleteBook(id));

  const edit = document.createElement('button');
  edit.setAttribute('data-testid', 'bookItemEditButton');
  edit.innerText = 'Edit buku';
  edit.addEventListener('click', () => editBook(id));

  if (isComplete) {
    tombol.append(belumSelesai, hapus, edit);
  } else {
    tombol.append(selesai, hapus, edit);
  }

  bookElement.append(judul, penulis, tahun, tombol);

  return bookElement;
}

function moveToFinishedBook(bookId) {
  for (const book of books) {
    if (book.id === bookId) {
      book.isComplete = true;
      break;
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function moveToUnfinishedBook(bookId) {
  for (const book of books) {
    if (book.id === bookId) {
      book.isComplete = false;
      break;
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function deleteBook(bookId) {
  const index = findBookIndex(bookId);

  books.splice(index, 1);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
  return books.findIndex((book) => book.id === bookId);
}

function editBook(bookId) {
  const bookIndex = findBookIndex(bookId);
  const book = books[bookIndex];

  document.getElementById('bookFormTitle').value = book.title;
  document.getElementById('bookFormAuthor').value = book.author;
  document.getElementById('bookFormYear').value = book.year;
  document.getElementById('bookFormIsComplete').checked = book.isComplete;
  document.getElementById('bookFormSubmit').innerText = 'Perbarui data';
  document.querySelector('main>section>h2').textContent = 'Perbarui Data Buku';

  const bookNumber = document.createElement('input');
  bookNumber.setAttribute('type', 'hidden');
  bookNumber.setAttribute('id', 'bookId');
  bookNumber.value = book.id;
  const form = document.getElementById('bookForm');
  form.prepend(bookNumber);
  location.href = '#form';
}

function updateBook() {
  const id = parseInt(document.getElementById('bookId').value);
  const title = document.getElementById('bookFormTitle').value;
  const author = document.getElementById('bookFormAuthor').value;
  const year = document.getElementById('bookFormYear').value;
  const isComplete = document.getElementById('bookFormIsComplete').checked;

  const book = generateBookData(title, author, year, isComplete);
  const bookIndex = findBookIndex(id);
  books.splice(bookIndex, 1, book);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
