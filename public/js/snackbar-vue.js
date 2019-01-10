Vue.component('snackbar', {
    data() {
        return {
            glObj
        }
    },
    methods: {
        async close() {
            await setDefaultSnackbar();
        }
    },
    template: `
    <v-layout>
        <v-snackbar 
            multi-line
            top
            dark
            v-model="glObj.snackbar.show"
            :timeout="glObj.snackbar.timeout"
            :color="glObj.snackbar.color"
        >
            {{ glObj.snackbar.text }}
            <v-btn
                flat
                color="deep-orange"
                @click="close"
            >
                Close
            </v-btn>
        </v-snackbar>
    </v-layout>`
});