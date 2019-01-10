Vue.component('pomodoro-settings', {
    data() {
        return {
            glObj,
            pomodoro
        }
    },
    methods: {
        async cancel() {
            glObj.pomodoro.show = false;
        },
        async apply() {
            await setPomodoro();
            glObj.pomodoro.show = false;
        },
        async setDefault() {
            await setDefaultsPomodoroSettings();
        },
        async play() {
            await this.stop();
            if (!glObj.pomodoro.sound) {
                return;
            }
            this.$refs.audiopomodoro.play();

        },
        async stop() {
            this.$refs.audiopomodoro.pause();
            this.$refs.audiopomodoro.currentTime = 0;
        },
        async testSound() {
            this.$refs.audiopomodoro.volume = glObj.pomodoro.volume;
            await this.play();
        }
    },
    template: `
    <v-layout>
        <v-dialog 
            v-model="glObj.pomodoro.show"
            max-width="450"          
        >
            <v-card>
                <v-card-title class="headline indigo--text">Pomodoro settings</v-card-title>
                <v-card-text>
                    <v-layout row>
                        <v-flex xs12 sm3 md3>
                            <v-text-field
                                color="indigo"
                                v-model="glObj.pomodoro.timePomodoro"
                                label="Pomodoro"                             
                                type="number"
                                hint="Pomodoro time min"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm3 md3 pl-2>
                            <v-text-field
                                color="indigo"
                                v-model="glObj.pomodoro.timeShortPause"
                                label="Short pause"                             
                                type="number"
                                hint="Short pause time min"
                            ></v-text-field>
                        </v-flex> 
                        <v-flex xs12 sm3 md3 pl-2>
                            <v-text-field
                                color="indigo"
                                v-model="glObj.pomodoro.timeLongPause"
                                label="Long pause"                             
                                type="number"
                                hint="Long pause time min"
                            ></v-text-field>
                        </v-flex>                         
                    </v-layout>                    
                    <v-layout column> 
                        <v-flex class="pl-2 grey--text text--darken-2 font-weight-light caption">
                            Pomodoro count {{ glObj.pomodoro.countBeforeLongPause }}
                        </v-flex>
                        <v-flex>                       
                            <v-rating
                                v-model="glObj.pomodoro.countBeforeLongPause"
                                length="10"
                                empty-icon="panorama_fish_eye"
                                full-icon="lens"                             
                                color="deep-orange"
                                background-color="grey lighten-1"                                                       
                            ></v-rating>
                        </v-flex>    
                    </v-layout>
                    <v-layout column>  
                        <v-flex xs8 sm5 md5>
                          <v-switch
                            v-model="glObj.pomodoro.sound"                
                            label="Sound"                
                            color="indigo"                
                          ></v-switch>
                        </v-flex>
                        <v-flex xs12>
                          <v-slider
                            v-model="glObj.pomodoro.volume"
                            append-icon="volume_up"
                            prepend-icon="volume_down"
                            color="indigo"
                            step=0.1
                            min=0
                            max=1
                            :disabled="!glObj.pomodoro.sound"
                            @change="testSound"
                          ></v-slider>
                        </v-flex>      
                        <audio ref="audiopomodoro" 
                               :src="glObj.pomodoro.soundPomodoro"
                        ></audio>                            
                    </v-layout>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="cancel"
                           outline
                           color="indigo"
                    >
                        Cancel
                    </v-btn>
                    <v-btn @click="setDefault"
                           outline
                           color="deep-orange"
                    >
                        Set default
                    </v-btn>
                    <v-btn @click="apply"
                           outline
                           color="deep-orange"
                    >
                        Set
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>`
});