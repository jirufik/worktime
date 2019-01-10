Vue.component('export-import', {
    data() {
        return {
            glObj
        }
    },
    methods: {
        run() {
            if (glObj.settings.exportImport.export) {

                let bodyTextArea = this.$refs.txtstate.$el.querySelector('textarea');
                copyToClipboard(bodyTextArea);
                return;

            }
            importData();
        },
        async cancel() {
            await setDefaultExportImport();
        }
    },
    template: `
    <v-layout>
        <v-dialog
            v-model="glObj.settings.exportImport.show"
            max-width="290"
        >
            <v-card>
                <v-card-title class="headline indigo--text">
                    {{ glObj.settings.exportImport.textHead }}
                </v-card-title>                
                    <v-card-text>
                        <v-textarea
                            v-model="glObj.settings.exportImport.textState"
                            color="indigo"
                            ref="txtstate"
                            autofocus
                        >               
                        </v-textarea>                   
                    </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="cancel"
                           outline
                           color="indigo"
                    >
                        cancel
                    </v-btn>                   
                    <v-btn @click="run"
                           outline
                           color="deep-orange"
                    >
                        {{ glObj.settings.exportImport.textBtn }}
                    </v-btn>
                </v-card-actions>
            </v-card>            
        </v-dialog>
    </v-layout>`
});