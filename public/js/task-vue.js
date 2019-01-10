Vue.component('task', {
    data: function () {
        return {
            glObj
        };
    },
    methods: {
        convertPriceToNumber() {
            glObj.curTask.price = Number(glObj.curTask.price);
        }
    },
    template: `
    <v-container>
        <v-layout justify-center>
            <v-flex xs12 sm8 md6>
              <v-combobox
                v-model="glObj.curTask.company"
                :items="glObj.companiesList"
                label="Company"
                clearable
                color="indigo"
              ></v-combobox>
            </v-flex>
        </v-layout> 
        <v-layout justify-center>
            <v-flex xs12 sm8 md6>
              <v-combobox
                v-model="glObj.curTask.project"
                :items="glObj.projectsList"
                label="Project"
                clearable
                color="indigo"
              ></v-combobox>
            </v-flex>
        </v-layout>            
        <v-layout justify-center>
            <v-flex xs12 sm8 md6>
              <v-combobox
                v-model="glObj.curTask.task"
                :items="glObj.tasksList"
                label="Task"
                clearable
                color="indigo"
              ></v-combobox>
            </v-flex>
        </v-layout> 
        <v-layout justify-center>   
            <v-flex xs12 sm8 md6>
              <v-textarea
                label="Description"
                v-model="glObj.curTask.description"
                color="indigo"
                rows="4"              
              ></v-textarea>              
              <v-layout>
                <v-flex xs4 sm2 md2>
                  <v-text-field
                    v-model="glObj.curTask.price"                
                    label="Price"                
                    color="indigo" 
                    @change="convertPriceToNumber"               
                  ></v-text-field>
                </v-flex>
                <v-flex xs8 sm5 md5 pl-3>
                  <v-switch
                    v-model="glObj.curTask.pricePerHour"                
                    label="Price per hour"                
                    color="indigo"                
                  ></v-switch>
                </v-flex>
              </v-layout>                
            </v-flex>
        </v-layout>
    </v-container>
    `
});