Vue.component('login', {
    data() {
        return {
            glObj,
            dialogLogin
        }
    },
    methods: {
        async changeNewUser() {
            if (dialogLogin.isCreateNewUser) {
                await settDialogLogin({
                    textHead: 'Create new user',
                    textBtn: 'Create',
                    login: '',
                    password: '',
                    passwordConfirm: '',
                    isCreateNewUser: dialogLogin.isCreateNewUser
                });
            } else {
                await settDialogLogin({
                    textHead: 'Login',
                    textBtn: 'Work',
                    login: '',
                    password: '',
                    passwordConfirm: '',
                    isCreateNewUser: dialogLogin.isCreateNewUser
                });
            }
        },
        async createOrWork() {
            await createOrWork();
        }
    },
    template: `
    <v-layout>
        <v-dialog
            v-model="dialogLogin.show"
            max-width="300"
            persistent
        >
            <v-card>
                <v-card-title class="headline indigo--text">{{ dialogLogin.textHead }}</v-card-title>
                <v-card-text>
                   <v-flex>
                        <v-text-field
                            color="indigo"
                            v-model="dialogLogin.login"
                            label="Login"
                            autofocus                             
                        ></v-text-field>
                   </v-flex>
                   <v-flex>
                        <v-text-field
                            color="indigo"
                            v-model="dialogLogin.password"
                            :append-icon="dialogLogin.passwordType ? 'visibility_off' : 'visibility'"
                            :type="dialogLogin.passwordType ? 'text' : 'password'"
                            @click:append="dialogLogin.passwordType = !dialogLogin.passwordType"
                            label="Password"
                            @keyup.enter="createOrWork"                             
                        ></v-text-field>
                   </v-flex>
                   <v-flex v-if="dialogLogin.isCreateNewUser">
                        <v-text-field
                            color="indigo"
                            v-model="dialogLogin.passwordConfirm"
                            :append-icon="dialogLogin.passwordConfirmType ? 'visibility_off' : 'visibility'"
                            :type="dialogLogin.passwordConfirmType ? 'text' : 'password'"
                            @click:append="dialogLogin.passwordConfirmType = !dialogLogin.passwordConfirmType"
                            label="Password confirm"
                            @keyup.enter="createOrWork"                                                       
                        ></v-text-field>
                   </v-flex>
                   <v-flex v-if="dialogLogin.isCreateNewUserShow">
                        <v-checkbox
                            v-model="dialogLogin.isCreateNewUser"
                            color="indigo"
                            label="Create new user"
                            @change="changeNewUser"                            
                        ></v-checkbox>
                   </v-flex>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        outline
                        color="indigo"
                        @click="createOrWork"
                    >
                        {{ dialogLogin.textBtn }}
                    </v-btn>
                </v-card-actions>
            </v-card>    
        </v-dialog>    
    </v-layout>`
});