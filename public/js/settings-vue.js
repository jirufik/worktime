Vue.component('user-settings', {
    data() {
        return {
            glObj,
            dialogLogin,
            curPasswordType: false,
            newPasswordType: false,
            confirmPasswordType: false
        }
    },
    methods: {
        async close() {
            await closeUserSettings();
        },
        async save() {
            await saveUserSettings();
        }
    },
    template: `
    <v-layout>
        <v-dialog
            v-model="glObj.settings.show"
            max-width="450"
            persistent
        >
            <v-card>
                <v-card-title class="headline indigo--text">
                    {{ glObj.settings.login }}
                </v-card-title>         
                <v-card-text>
                   <v-flex>
                        <v-text-field
                            color="indigo"
                            v-model="glObj.settings.curPassword"
                            :append-icon="curPasswordType ? 'visibility_off' : 'visibility'"
                            :type="curPasswordType ? 'text' : 'password'"
                            @click:append="curPasswordType = !curPasswordType"
                            label="Current password"                                                        
                        ></v-text-field>
                   </v-flex>
                   <v-flex>
                        <v-text-field
                            color="indigo"
                            v-model="glObj.settings.newPassword"
                            :append-icon="newPasswordType ? 'visibility_off' : 'visibility'"
                            :type="newPasswordType ? 'text' : 'password'"
                            @click:append="newPasswordType = !newPasswordType"
                            label="New password"                                                        
                        ></v-text-field>
                   </v-flex>
                   <v-flex>
                        <v-text-field
                            color="indigo"
                            v-model="glObj.settings.confirmPassword"
                            :append-icon="confirmPasswordType ? 'visibility_off' : 'visibility'"
                            :type="confirmPasswordType ? 'text' : 'password'"
                            @click:append="confirmPasswordType = !confirmPasswordType"
                            label="Confirm password"                                                        
                        ></v-text-field>
                   </v-flex>
                   <v-flex>
                        <v-radio-group
                            v-model="glObj.settings.typeSaveData"
                            :disabled="!dialogLogin.isBackend"
                        >
                            <v-radio 
                                label="Save data to browser" 
                                value="browser"
                                color="indigo"
                            ></v-radio>
                            <v-radio 
                                label="Save data to cloud" 
                                value="server"
                                color="indigo"
                            ></v-radio>
                        </v-radio-group>
                   </v-flex>    
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        @click="close"
                        outline
                        color="indigo"
                    >Cancel</v-btn>
                    <v-btn
                        @click="save"
                        outline
                        color="deep-orange"
                    >Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>`
});