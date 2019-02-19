const Blog = require('../../sequelize').Blog;
const Book = require('../../sequelize').Book;
const moment = require('moment');


module.exports = {

    fetchAll(req, res) {
        Blog.findAll({
            order: [['id', 'DESC']],
            limit: 50
        }).then(blogs => {
            const blogst = [];
            blogs.forEach(function (blog) {
                const blogt = {
                    id: blog.id,
                    title: blog.title,
                    description: blog.description,
                    createdAt: moment(blog.createdAt).format('MMMM Do YYYY, h:mm:ss')
                };
                blogst.push(blogt)
            });
            res.status(200).json(blogst);
        }).catch(err => {
                res.status(500).json({error: 'Oops!!, Something went wrong'})
            })

    },

    fetchById(req, res) {
        Blog.findById(req.params.id)
            .then(blog => {
                const blogt = {
                    id: blog.id,
                    title: blog.title,
                    description: blog.description,
                    createdAt: moment(blog.createdAt).format('MMMM Do YYYY, h:mm:ss')
                };
                res.status(200).json(blogt);
            })
            .catch(err => {
            res.status(500).json({error: 'Oops!!, Something went wrong'})
        })
    },

    fetchAllBooks(req, res) {
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

            res.status(200).json(fBooks);
        }).catch(err=>{
            res.status(500).json({
                error: err.message? err.message:'Oops! Something went wrong',
            })
        })
    }


};