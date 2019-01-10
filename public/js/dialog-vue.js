Vue.component('dialog-apply', {
    data() {
        return {
            glObj
        }
    },
    methods: {
        async cancel() {
            await setDefaultDialog();
        },
        async apply() {
            await runDialog();
        }
    },
    template: `
    <v-layout>
        <v-dialog 
            v-model="glObj.dialog.show"
            max-width="290"
            persistent
        >
            <v-card>
                <v-card-title class="headline indigo--text">{{ glObj.dialog.head }}</v-card-title>
                <v-card-text>{{ glObj.dialog.text }}</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="cancel"
                           outline
                           color="indigo"
                    >
                        {{ glObj.dialog.textBtnCancel }}
                    </v-btn>
                    <v-btn @click="apply"
                           outline
                           color="deep-orange"
                    >
                        {{ glObj.dialog.textBtnApply }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>`
});