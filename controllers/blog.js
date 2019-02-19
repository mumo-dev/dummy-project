const moment = require('moment')
const Blog = require('../sequelize').Blog;

module.exports = {
    index(req, res) {

        Blog.findAll({
            order: [['id', 'DESC']]
        }).then((blogs => {
            const blogst = [];
            blogs.forEach(function (blog) {
                const blogt = {
                    id: blog.id,
                    title: blog.title,
                    description: blog.description,
                    createdAt: moment(blog.createdAt).format('MMMM Do YYYY, h:mm:ss')
                }
                blogst.push(blogt)
            });
            res.render('admin/blog', {
                blogs: blogst,
                success: req.flash('successMessage'),
                error: req.flash('errorMessage'),
            });
        }))

    },

    showCreateView(req, res) {
        res.render('admin/blog-create')
    },
    create(req, res) {
        Blog.create(req.body).then(blog => {
            req.flash('successMessage', 'Blog Post Created');
            res.redirect('/blog');
        }).catch(err => {
            req.flash('errorMessage', err.message);
            res.redirect('/blog');
        })
    },
    showBlogItem(req, res) {
        Blog.findById(req.params.id).then((blog => {
            const blogt = {
                id: blog.id,
                title: blog.title,
                description: blog.description,
                createdAt: moment(blog.createdAt).format('MMMM Do YYYY, h:mm:ss')
            };

            res.render('admin/blog-show', {
                blog: blogt,
                success: req.flash('successMessage'),
                error: req.flash('errorMessage'),
            });
        }))
    },

    edit(req, res) {
        Blog.findById(req.params.id).then((blog => {
            res.render('admin/blog-edit', {
                blog
            });
        }))
    },
    update(req, res) {
        const values = {
            title: req.body.title,
            description: req.body.description
        };

        const selector = {
            where: {id: req.body.id}
        };

        Blog.update(values, selector)
            .then(() => {
                req.flash('successMessage', 'Blog Post updated');
                res.redirect('/blog/' + req.body.id)
            })

    },
    delete(req, res) {
        Blog.findById(req.params.id).then((blog => {
            if (blog) {
                blog.destroy();
                req.flash('successMessage', 'Blog Post Deleted');
                res.redirect('/blog');

            } else {
                req.flash('errorMessage', 'Blog Post Delete Failed');
                res.redirect('/blog');
            }

        })).catch(err => {
            req.flash('errorMessage', err.message);
            res.redirect('/blog');
        })
    }

};