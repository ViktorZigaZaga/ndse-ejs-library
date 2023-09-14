const express = require('express');
const Book = require('../Book');
const unloadMulter = require('../middleware/unload');
const router = express.Router();

const library = {
    books: [
        new Book(`Том 1`, `Виктор`, `Начало`),
        new Book(`Том 2`, `Виктор`, `Продолжение`),
    ],
}

router.get('/', (req, res) => {
    const {books} = library;
    res.render('../src/views/books/index', {
        title: 'Books',
        books: books,
    });
});

router.get('/:id', (req, res) => {
    const {books} = library;
    const {id} = req.params;
    const idx = books.findIndex((el) => el.id === id);
    if (idx !== -1) {
        res.render('../src/views/books/view', {
            title: 'Book view',
            books: books[idx],
        });
    } else { 
        res.redirect('/404');
    }
});

router.get('/:id/download', (req, res) => {
    const {books} = library;
    const {id} = req.params;
    const idx = books.findIndex((el) => el.id === id);
    if (idx !== -1) {
        res.download(`${__dirname}/../public/books/${books[idx].fileBook}`, books[idx].fileName, err => {
            if (err) {
                res.redirect('/404');
            }
        });
    } else { 
        res.redirect('/404');
    }
});

router.get('/create', (req, res) => {
    const {books} = library;
    res.render('../src/views/books/create', {
        title: 'Book create',
        books: books,
    });
})

router.post('/create', unloadMulter.single('filebook'), (req, res) => {
    const {books} = library;
    const {
        title, 
        authors, 
        description, 
        favorite, 
        fileCover, 
        fileName,
    } = req.body;

    // if (!req.file) {
    //     res.redirect('/404');
    //     return;
    // }
    const fileBook = req.file.path;

    const newBook = new Book(
        title, 
        authors, 
        description, 
        favorite, 
        fileCover, 
        fileName,
        fileBook,
    );
    books.push(newBook);
    res.redirect('api/books');
});

router.get('/update/:id', (req, res) => {
    const {books} = library;
    const {id} = req.params;
    const idx = books.findIndex((el) => el.id === id);
    if (idx !== -1) {
        res.render('../src/views/books/update', {
            title: 'Book update',
            books: books[idx],
        });
    } else { 
        res.redirect('/404');
    }
});

router.post('/update/:id', unloadMulter.single('filebook'), (req, res) => {
    const {books} = library;
    const {
        title, 
        authors, 
        description, 
        favorite, 
        fileCover, 
        fileName,
    } = req.body;

    // if (!req.file) {
    //     res.redirect('/404');
    //     return;
    // }
    const fileBook = req.file.path;

    const {id} = req.params;
    const idx = books.findIndex((el) => el.id === id);
    if (idx !== -1) {
        books[idx] = {
            ...books[idx],
            title, 
            authors, 
            description, 
            favorite, 
            fileCover, 
            fileName,
            fileBook,
        }
        res.redirect(`/api/books/${id}`);
    } else { 
        res.redirect('/404');
    }
});

router.post('/delete/:id', (req, res) => {
    const {books} = library;
    const {id} = req.params;
    const idx = books.findIndex((el) => el.id === id);
    if (idx === -1) {
        res.redirect('/404');
    }

    books.slice(idx, 1);
    res.redirect('/api/books');
});

module.exports = router;
