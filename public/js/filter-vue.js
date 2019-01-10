Vue.component('filter-work', {
    data() {
        return {
            glObj,
            menuDateStart: false,
            menuDateFinish: false
        }
    },
    methods: {
        async showFilter() {
            await showFilter();
        },
        async inputFilterDate(typeDate) {
            await inputFilterDate(typeDate);
            this.menuDateStart = false;
            this.menuDateFinish = false;
        },
        async reset() {
            await setDefaultFilter(true);
            await setSnackbar({
                text: 'Filter reset',
                show: true
            });
        }
    },
    template: `
    <v-layout row justify-center>        
        <v-dialog v-model="glObj.filter.show"
                  max-width="600"
        >
            <v-card>
                <v-card-title class="headline indigo--text">
                    Filter
                </v-card-title>
                <v-card-text>
                    <v-layout row>
                        <v-flex xs12 sm3 md3>
                            <v-menu
                              :close-on-content-click="false"
                              v-model="menuDateStart"
                              :nudge-right="40"
                              lazy
                              transition="scale-transition"
                              offset-y
                              full-width
                              min-width="290px"
                            >
                              <v-text-field
                                slot="activator"
                                v-model="glObj.filter.startDateStr"
                                label="Date start"
                                prepend-icon="event"
                                color="indigo"
                                readonly
                              ></v-text-field>
                              <v-date-picker                                 
                                v-model="glObj.filter.startDatePicker"
                                color="indigo" 
                                @input="inputFilterDate('start')"
                              ></v-date-picker>
                            </v-menu>
                        </v-flex>
                        <v-flex xs12 sm3 md3 pl-2>
                            <v-menu
                              :close-on-content-click="false"
                              v-model="menuDateFinish"
                              :nudge-right="40"
                              lazy
                              transition="scale-transition"
                              offset-y
                              full-width
                              min-width="290px"
                            >
                              <v-text-field
                                slot="activator"
                                v-model="glObj.filter.finishDateStr"
                                label="Date finish"
                                prepend-icon="event"
                                color="indigo"
                                readonly
                              ></v-text-field>
                              <v-date-picker                                 
                                v-model="glObj.filter.finishDatePicker"
                                color="indigo" 
                                @input="inputFilterDate('finish')"
                              ></v-date-picker>
                            </v-menu>
                        </v-flex>                       
                    </v-layout>
                    <v-layout row>
                        <v-flex xs12 sm8 md6>
                            <v-select                           
                              :items="glObj.companiesList"
                              v-model="glObj.filter.companies"
                              label="Companies"
                              multiple
                              color="indigo"
                            ></v-select>
                        </v-flex>
                        <v-flex xs8 sm5 md5 pl-3>
                          <v-switch
                            v-model="glObj.filter.excludeCompanies"                
                            label="Exclude"                
                            color="indigo"                
                          ></v-switch>
                        </v-flex>
                    </v-layout> 
                    <v-layout row>
                        <v-flex xs12 sm8 md6>
                            <v-select                           
                              :items="glObj.projectsList"
                              v-model="glObj.filter.projects"
                              label="Projects"
                              multiple
                              color="indigo"
                            ></v-select>
                        </v-flex>
                        <v-flex xs8 sm5 md5 pl-3>
                          <v-switch
                            v-model="glObj.filter.excludeProjects"                
                            label="Exclude"                
                            color="indigo"                
                          ></v-switch>
                        </v-flex>
                    </v-layout>                     
                    <v-layout row>
                        <v-flex xs12 sm8 md6>
                            <v-select                           
                              :items="glObj.tasksList"
                              v-model="glObj.filter.tasks"
                              label="Tasks"
                              color="indigo"
                              multiple
                            ></v-select>
                        </v-flex>
                        <v-flex xs8 sm5 md5 pl-3>
                          <v-switch
                            v-model="glObj.filter.excludeTasks"                
                            label="Exclude"                
                            color="indigo"                
                          ></v-switch>
                        </v-flex>
                    </v-layout> 
                    <v-layout>
                        <v-flex xs12 sm8 md6>
                            <v-text-field
                              v-model="glObj.filter.search"
                              label="Search"
                              color="indigo"
                              clearable
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs8 sm5 md5 pl-3>
                          <v-switch
                            v-model="glObj.filter.excludeSearch"                
                            label="Exclude"                
                            color="indigo"                
                          ></v-switch>
                        </v-flex>                        
                    </v-layout>                    
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="showFilter"
                           outline
                           color="indigo"
                    >
                        Close
                    </v-btn>                    
                    <v-btn @click="reset"
                           outline
                           color="deep-orange"
                    >
                        Reset
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>`
});