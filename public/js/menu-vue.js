Vue.component('main-menu', {
    data() {
        return {
            glObj,
            menu: false
        }
    },
    methods: {
        async exportShow() {
            await exportShow();
        },
        async importShow() {
            await importShow();
        },
        async logout() {
            await logout();
        },
        async showUserSettings() {
            await showUserSettings();
        },
        async helpChangeShow() {
            await helpChangeShow();
        },
        async menuShowMainForm() {
            await menuShowMainForm();
        }
    },
    template: `
        <v-menu
            v-model="menu"          
            :nudge-width="200"            
            offset-y
        >       
            <v-icon 
                class="white--text"
                slot="activator"
                @click="menuShowMainForm"    
            >alarm</v-icon>            
            <v-list 
                class="indigo--text"              
            >
                <v-list-tile @click="showUserSettings">
                    <v-list-tile-avatar>
                        <v-icon color="indigo">sentiment_satisfied_alt</v-icon>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                        <v-list-tile-title>
                            {{ glObj.settings.login }}
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-divider></v-divider>                                               
                <v-list-tile @click="exportShow">                   
                    <v-list-tile-avatar>
                        <v-icon color="indigo">arrow_downward</v-icon>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                        <v-list-tile-title>
                            Export
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile @click="importShow">                   
                    <v-list-tile-avatar>
                        <v-icon color="indigo">arrow_upward</v-icon>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                        <v-list-tile-title>
                            Import
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile @click="helpChangeShow">
                    <v-list-tile-avatar>
                        <v-icon color="indigo">help_outline</v-icon>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                        <v-list-tile-title>
                            Help
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-divider></v-divider>
                <v-list-tile @click="logout">
                    <v-list-tile-avatar>
                        <v-icon color="indigo">power_settings_new</v-icon>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                        <v-list-tile-title>
                            Logout
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>                     
        </v-menu>                  
    `
});