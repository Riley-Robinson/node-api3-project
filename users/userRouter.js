const express = require('express');

const Users = require('./userDb')
const Posts = require('../posts/postDb')

const router = express.Router();

router.post('/', validateUserId, validateUser('name'), (req, res) => {
 
  Users.insert(req.body)
    .then(user => {
      res.status(201).json(user)
    })
 
    .catch(error => {
      console.log(error);
      res.status(400).json({
        message: "Missing Required text field"
      })
    })
});

router.post('/:id/posts', validateUserId, validatePost('text'), (req, res) => {
  const comment = {...req.body, user_id: req.params.id}
  Posts.insert(comment)
    .then(post => {
      res.status(201).json(post)
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'error adding text'
      })
    })
});

router.get('/', (req, res) => {
  // do your magic!

    Users.get()
        .then(users => {
          res.status(200).json({ headers: req.headers, users})
        })
        .catch(err => {
          console.log(err)
          res.status(500).json({
            message: 'error retrieving users'
          })
        })

});

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!


    Users.getById(req.params.id)
      .then(posts => {
        res.status(200).json(posts)
      })
      .catch(error => {
        console.log(error)
        res.status(500).json({message: 'error retrieving posts'})
      })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  
  Users.getUserPosts(req.params.id)
    .then(posts => {
      res.status(200).json(posts)
    })

    .catch(error => {
      console.log(error)
      res.status(500).json({message: "error retrieving posts"})
    })

});

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!

    Users.remove(req.params.id)
          .then(user => {
            if (user) {
              res.status(200).json({message: 'user deleted'})
            } else {
              res.status(404).json({ message: 'User not valid'})
            }
          })
          .catch(error => {
            console.log(error)
            res.status(500).json({
              message: 'internal server error'
            })
          })
});

router.put('/:id', validateUserId, (req, res) => {
  // do your magic!

  Users.update(req.params.id, req.body)
        .then(post => {
            if (post) {
              res.status(201).json(post)
            } else {
              res.status(400).json({message: "missing required text field"})
            }
        })
          .catch(error => {
            console.log(error)
            res.status(400).json({message: 'missing post data'})
          })
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  Users.getById(req.params.id)
  .then(user => {
    if (user) {
      req.user = user;
      next()
    } else {
      res.status(404).json({message: "User by ID not found"})
    }
  })
  .catch(error => {
    console.log(error)
    res.status(500).json({
      message: "error retrieving user"
    })
  })
}

function validateUser(prop) {
  // do your magic!
  return function (req, res, next) {
      if (!req.body[prop]) {
        res,status(400).json({ message: 'missing user data'})
      } else {
        next()
      }
   }
}

function validatePost(prop) {
  // do your magic!
  return function (req, res, next) {
    if (!req.body[prop]) {
      res,status(400).json({ message: 'missing post data'})
    } else {
      next()
    }
  }
}

module.exports = router;


//for a new commit to push up to github 