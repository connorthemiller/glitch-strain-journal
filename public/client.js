// client-side js
// run by the browser each time your view template is loaded

console.log("hello world :o");

import firebaseConfig from "./firebaseConfig.js";
import { newEntry } from "./components.js";

var strains = ["foo", "bar", "swag"];

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be whitelisted in the Firebase Console.
  url: "https://strain-journal.glitch.me/",
  // This must be true.
  handleCodeInApp: true
};

const auth = firebase.auth();
const db = firebase.firestore();

var app = new Vue({
  el: "#app",
  vuetify: new Vuetify(),
  data: function() {
    return {
      authError: null,
      message: "Strain Journal",
      email: "",
      password: "",
      newStrain: "",
      newRating: 5,
      newType: "",
      date: null,
      user: null,
      strains: [],
      error: "",
      strainnames: [],
      emailVerified: false
    };
  },
  methods: {
    login: function() {
      this.authError = null;
      auth
        .signInWithEmailAndPassword(this.email, this.password)
        .then(function() {
          console.log("success!");
        })
        .catch(e => {
          this.authError = e.message;
          console.log(e.message);
        });
      this.clearCred();
    },
    logout: function() {
      this.strains = [];
      auth.signOut();
    },
    signup: function() {
      var self = this
      auth
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(function() {
          self.authError = null
          console.log("success!");
        })
        .catch(e => {
          this.authError = e.message;
          console.log(e.message);
        });
      this.clearCred();
    },
    verifyEmail(){
      console.log("Verification Email Sent!")
      auth.currentUser.sendEmailVerification(actionCodeSettings).then(function(){
        
      }).catch(function(error){
        console.log(error.message)
      })
    },
    submit: function(value) {
      var self = this;
      console.log(value);
      db.collection("strains")
        .add({
          date: value.date,
          name: value.name,
          type: value.type,
          rating: value.rating,
          user: this.user.uid
        })
        .then(function(docRef) {
          self.strains.unshift({
            id: docRef.id,
            data: {
              date: value.date,
              name: value.name,
              type: value.type,
              rating: value.rating
            }
          });
          console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
          alert(error.message)
          console.log(error)
        });
    },
    clearCred: function() {
      this.email = "";
      this.password = "";
      this.error = "";
    },
    deleteIt: function(el, i) {
      var r = confirm(
        "You are about to delete this block. Do you wish to proceed?"
      );
      console.log(el.id, i);
      if (r == true) {
        // delete the thing
        db.collection("strains")
          .doc(el.id)
          .delete()
          .then(function() {
            console.log("Document " + el.id + " deleted!");
          });
        this.strains.splice(i, 1);
      }
    },
    updateIt: function(el, i) {
      console.log(el.data);
    },
    getStrains: function() {
      var retrievedArr = [];
      db.collection("strains")
        .where("user", "==", this.user.uid)
        .orderBy("date", "desc")
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            retrievedArr.push({ data: doc.data(), id: doc.id });
          });
        })
        .then(() => {
          this.strains = retrievedArr;
        });
    }
  },
  mounted: function() {
    auth.onAuthStateChanged(user => {
      this.user = user;
      if (user) {
        console.log("EMAIL VERIFIED: " + user.emailVerified)
        if (user.emailVerified) {
          auth.currentUser.getIdToken(true)
        }
        this.getStrains();
        this.emailVerified = user.emailVerified
      }
    });
    fetch("https://cannabis-api.glitch.me/strainnames")
      .then(res => {
        return res.json();
      })
      .then(data => {
        this.strainnames = data;
      });

  }
});
