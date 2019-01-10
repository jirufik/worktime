async function setDefaultDialog() {
    await setDialog();
}

async function setDialog({
                             head = '',
                             text = '',
                             textBtnCancel = 'Cancel',
                             textBtnApply = 'Apply',
                             obj = {},
                             act = 'add',
                             show = false
                         } = {}) {

    glObj.dialog.head = head;
    glObj.dialog.text = text;
    glObj.dialog.textBtnCancel = textBtnCancel;
    glObj.dialog.textBtnApply = textBtnApply;
    glObj.dialog.obj = obj;
    glObj.dialog.show = show;
    glObj.dialog.act = act;
    glObj.dialog.acts = {
        ADD: 'add',
        GET: 'get',
        EDIT: 'edit',
        DELETE: 'del'
    };

}

async function runDialog() {

    if (glObj.dialog.act === glObj.dialog.acts.DELETE
        && glObj.dialog.obj.task) {
        let index = glObj.tasks.indexOf(glObj.dialog.obj);
        if (index > -1) {
            glObj.tasks.splice(index, 1);
            await setSnackbar({
                text: 'Task deleted',
                show: true
            });
        }
    }

    await setDefaultDialog();

}