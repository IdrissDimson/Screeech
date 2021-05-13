const { db } = require('../util/admin');

exports.getAllScreechs = (req, res) => {
  db.collection('screechs')
    .orderBy('createdAt', 'desc')
    .get()
    .then(data => {
      let screechs = [];
      data.forEach(doc => {
        screechs.push({
          screechId: doc.id,
          ...doc.data()
        });
      });
      return res.status(200).json(screechs);
    })
    .catch(err => console.error(err));
};

exports.postOneScreech = (req, res) => {
  if (req.body.body.trim() === '') {
    return res.status(400).json({ body: 'Body must not be empty' });
  }
  const newScreech = {
    body: req.body.body,
    imageUrl: '',
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0
  };

  db.collection('screechs')
    .add(newScreech)
    .then(doc => {
      const theScreech = newScreech;
      theScreech.screechId = doc.id;
      res.status(200).json(theScreech);
    })
    .catch(err => {
      res.status(500).json({ error: `something went wrong` });
      console.error(err);
    });
};
// Fetch one screech
exports.getScreech = (req, res) => {
  let screechData = {};
  db.doc(`/screechs/${req.params.screechId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'screech not found' });
      }
      screechData = doc.data();
      screechData.screechId = doc.id;
      return db
        .collection('comments')
        .orderBy('createdAt', 'desc')
        .where('screechId', '==', req.params.screechId)
        .get();
    })
    .then(data => {
      screechData.comments = [];
      data.forEach(doc => {
        screechData.comments.push(doc.data());
      });
      return res.status(200).json(screechData);
    })
    .catch(err => {
      res.status(500).json({ error: `something went wrong` });
      console.error(err);
    });
};
// Comment on a screech
exports.commentOnScreech = (req, res) => {
  if (req.body.body.trim() === '')
    return res.status(400).json({ comment: 'Must not be empty' });

  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    screechId: req.params.screechId,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl
  };

  db.doc(`/screechs/${req.params.screechId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'screech not found' });
      }
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => {
      return db.collection('comments').add(newComment);
    })
    .then(() => {
      res.status(200).json(newComment);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: `something went wrong` });
    });
};
// Like a screech
exports.likeScreech = (req, res) => {
  const likeDocument = db
    .collection('likes')
    .where('userHandle', '==', req.user.handle)
    .where('screechId', '==', req.params.screechId)
    .limit(1);
  const screechDocument = db.doc(`/screechs/${req.params.screechId}`);

  let screechData;

  screechDocument
    .get()
    .then(doc => {
      if (doc.exists) {
        screechData = doc.data();
        screechData.screechId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: 'screech not found' });
      }
    })
    .then(data => {
      if (data.empty) {
        return db
          .collection('likes')
          .add({
            screechId: req.params.screechId,
            userHandle: req.user.handle
          })
          .then(() => {
            screechData.likeCount++;
            return screechDocument.update({ likeCount: screechData.likeCount });
          })
          .then(() => {
            return res.status(200).json(screechData);
          });
      } else {
        return res.status(400).json({ error: 'screech already liked ' });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.unlikeScreech = (req, res) => {
  const likeDocument = db
    .collection('likes')
    .where('userHandle', '==', req.user.handle)
    .where('screechId', '==', req.params.screechId)
    .limit(1);
  const screechDocument = db.doc(`/screechs/${req.params.screechId}`);

  let screechData;

  screechDocument
    .get()
    .then(doc => {
      if (doc.exists) {
        screechData = doc.data();
        screechData.screechId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: 'screech not found' });
      }
    })
    .then(data => {
      if (data.empty) {
        return res.status(400).json({ error: 'screech not liked ' });
      } else {
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            screechData.likeCount--;
            return screechDocument.update({ likeCount: screechData.likeCount });
          })
          .then(() => {
            res.status(200).json(screechData);
          });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};
// Delete screech
exports.deleteScreech = (req, res) => {
  const document = db.doc(`/screechs/${req.params.screechId}`);
  document
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'screech not found' });
      }
      if (doc.data().userHandle !== req.user.handle) {
        return res.status(403).json({ error: 'Unauthorized' });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      res.status(200).json({ message: 'screech deleted successfully' });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ err: err.code });
    });
};
// Upload a profile image for user
exports.uploadScreechImage = (req, res) => {
  const BusBoy = require('busboy');
  const path = require('path');
  const os = require('os');
  const fs = require('fs');

  const busboy = new BusBoy({ headers: req.headers });
  let imageToBeUploaded = {};
  let imageFileName;

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    console.log(fieldname, file, filename, encoding, mimetype);
    if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
      return res.status(400).json({ error: 'Wrong file type submitted' });
    }
    // my.image.png => ['my', 'image', 'png']
    const imageExtension = filename.split('.')[filename.split('.').length - 1];
    // 32756238461724837.png
    imageFileName = `${Math.round(
      Math.random() * 1000000000000
    ).toString()}.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on('finish', () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype
          }
        }
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
        return db.doc(`/screechs/${req.params.screechId}`).update({ imageUrl });
      })
      .then(() => {
        return res.json({ message: 'image uploaded successfully' });
      })
      .catch(err => {
        console.error(err);
        return res.status(500).json({ error: 'something went wrong' });
      });
  });
  busboy.end(req.rawBody);
};
