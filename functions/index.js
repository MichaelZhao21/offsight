const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const serviceAccount = require("./permissions.json");


// Initialize express app
const app = express();
app.use(cors({ origin: true }));

// Initialize firestore database
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-api-9a206..firebaseio.com",
});
const db = admin.firestore();

//create the courses
app.post("/courses", async (req, res) => {
  try {
    id = req.body.name.replace(/ /g, "+");
    id = id.toLowerCase();
    await db
      .collection("courses")
      .doc(id)
      .set({ item: req.body.item , name : req.body.name });
      
    return res.status(200).send();
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

//get the course from the id given
app.get("/courses/:item_id", async (req, res) => {
  try {
    const document = db.collection("courses").doc(req.params.item_id);
    let item = await document.get();
    let response = item.data();
    return res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

// read all
app.get('/read', (req, res) => {
  (async () => {
      try {
          let query = db.collection('courses');
          let response = [];
          await query.get().then(querySnapshot => {
          let docs = querySnapshot.docs;
          for (let doc of docs) {
              const selectedItem = {
                  id: doc.id,
                  item: doc.data().item,
                  name: doc.data().name
              };
              response.push(selectedItem);
          }
          });
          return res.status(200).send(response);
      } catch (error) {
          console.log(error);
          return res.status(500).send(error);
      }
      })();
  });





exports.app = functions.https.onRequest(app);
