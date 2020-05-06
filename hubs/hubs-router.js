const express = require("express");

const Posts = require("../data/db.js");

const router = express.Router();

router.post("/", (req, res) => {
  const { title, contents } = req.body;
  if (title === "" || contents === "" || title === null || contents === null) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post",
    });
  } else
    Posts.insert(req.body)
      .then((post) => {
        res.status(201).json(post);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          error: "There was an error while saving the post to the database",
        });
      });
});

router.post("/:id/comments", (req, res) => {
  const id = req.params;
  const newText = req.body;
  if (!newText.text) {
    return res
      .status(400)
      .json({ errorMessage: "Please provide text for the comment" });
  } else {
    Posts.insertComment(newText)
      .then((comment) => {
        if (comment) {
          res.status(201).json(comment);
        } else {
          res
            .status(404)
            .json({ errorMessage: "There was an error posting a comment" });
        }
      })
      .catch((error) => {
        console.log(error, "newText", newText);
        res.status(500).json({
          errorMessage: "There was an error saving the comment to the database",
        });
      });
  }
});
router.get("/", (req, res) => {
  Posts.find(req.query)
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((error) => {
      console.log(error),
        res
          .status(500)
          .json({ error: "The posts information could not be retrieved" });
    });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  Posts.findById(id)
    .then((post) => {
      post
        ? res.status(200).json(post)
        : res.status(404).json({
            message: "The post with the specified ID does not exist",
          });
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The post information could not be retrieved" });
    });
});

router.get("/:id/comments", (req, res) => {
  const id = req.params.id;
  const commentData = req.body;
  Posts.findPostComments(id)
    .then((comment) => {
      if (comment) {
        res.status(200).json(comment);
      } else {
        res.status(404).json({
          message:
            "The post with the specified ID does not contain comments or the post with the specified ID does not exist",
        });
      }
    })
    .catch((error) => {
      console.log(error),
        res.status(500).json({
          error: "The post information could not be retrieved",
        });
    });
});
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  Posts.remove(id).then((post) => {
    post > 0
      ? res.status(200).json({ message: "The post has been removed" })
      : res
          .status(404)
          .json({
            message: "The post with the specified ID does not exist",
          })

          .catch((error) => {
            console.log(error);
            res.status(500).json({ error: "The post could not be removed" });
          });
  });
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const postData = req.body;
  Posts.findById(id)
    .then((post) => {
      if (post.length > 0) {
        if (!postData.title || !postData.contents) {
          res.status(400).json({
            errorMessage: "Please provide title and contents for the post",
          });
        } else {
          Posts.update(id, {
            title: postData.title,
            contents: postData.contents,
          })
            .then((updated) => {
              Posts.findById(id)
                .then((post) => res.status(200).json(post))
                .catch((error) => {
                  console.log(error);
                  res.status(500).json({
                    error: "The post information could not be modified",
                  });
                });
            })
            .catch((error) => {
              console.log(error);
              res
                .status(500)
                .json({ error: "The post information could not be modified" });
            });
        }
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      }
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The post information could not be modified" });
    });
});
module.exports = router;
