export const newEntry = Vue.component('new-entry', {
  props: ['strains', 'submit', 'isverified'],
  data: function () {
    return {
      dialog: false,
      newStrain: '',
      newDate: null,
      newRating: null,
      newType: null,
      categories: ['Indica', 'Sativa', 'Hybrid'],
      today: (new Date()).toISOString().substring(0,10)
    }
  },
  methods: {
    save() {
      // send data to parent component
      this.$emit("save-session", {
        name: this.newStrain,
        type: this.newType,
        date: this.newDate,
        rating: this.newRating
      })
      this.close()
    },
    close(){
      this.dialog = false
      this.newStrain = '',
      this.newType = null,
      this.newRating = null,
      this.newDate = null
    },
    findType(rawStrains) {
      if (rawStrains.find(strain => strain.name === this.newStrain)) {
        this.newType = rawStrains.find(strain => strain.name === this.newStrain).category;
      } else {
        console.log("No matching strain in databse.")
      }
    }
  },
  template: `
  <v-row justify="end">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon>mdi-plus-circle</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Session Entry</span>
        </v-card-title>
        <v-card-text>
        <v-alert type="warning" v-show="!isverified">You cannot submit entries until you verify your email address.</v-alert>
          <v-container>
            <v-combobox :items="strains.map(strain => strain.name)" v-model="newStrain" label="Strain name*" @change="findType(strains)" required></v-combobox>
            <v-combobox :items="categories" v-model="newType" label="Type*" required></v-combobox>
            <v-menu
              :close-on-content-click="true"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="newDate"
                  label="Date"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="newDate" :max="today"></v-date-picker>
            </v-menu>
            <v-row justify="center">
              <v-rating v-model="newRating" label="Rating" required></v-rating>
            </v-row>
            <br />
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">Close</v-btn>
          <v-btn color="blue darken-1" text @click="save" :disabled="!isverified">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
`
})