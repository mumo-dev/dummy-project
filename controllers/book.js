const Book = require('../sequelize').Book;
const moment = require('moment');


module.exports = {

    index(req, res) {
        Book.findAll({
            order: [['id', 'DESC']]
        }).then(books => {
            const fBooks = [];
            books.forEach(function (book) {
                const fbook = {
                    id: book.id,
                    title: book.title,
                    description: book.description,
                    downloadUrl: book.downloadUrl,
                    updatedAt: moment(book.updatedAt).format('MMMM Do YYYY, h:mm:ss')
                };
                fBooks.push(fbook)
            });

            res.render('admin/books', {
                books: fBooks,
                success: req.flash('successMessage'),
                error: req.flash('errorMessage')
            })
        });


    },

    create(req, res) {
        const data = {
            title: req.body.bookTitle,
            description: req.body.bookDescription,
            downloadUrl: req.file.filename
        };

        Book.create(data).then(() => {
            req.flash('successMessage', 'Book added');
            res.redirect('/books')
        }).catch(err => {
            req.flash('errorMessage', 'Sorry, something went wrong');
            res.redirect('/books')
        })
    },

    update(req, res) {
        const values = {
            title: req.body.title,
            description: req.body.description
        };

        const selector = {
            where: {id: req.body.id}
        };

        Book.update(values, selector)
            .then(() => {
                req.flash('successMessage', 'Blog Post updated');
                res.redirect('/books')
            })

    },
    delete(req, res) {
        Book.findById(req.body.bookId).then((book => {
            if (book) {
                book.destroy();
                req.flash('successMessage', 'Book Deleted');
                res.redirect('/books');

            } else {
                req.flash('errorMessage', 'Deleting of book failed');
                res.redirect('/books');
            }

        })).catch(err => {
            req.flash('errorMessage', err.message);
            res.redirect('/books');
        })
    }


};