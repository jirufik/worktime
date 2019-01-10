Vue.component('tasks', {
    data: function () {
        return {
            glObj,
            headers: [
                {text: 'Date start', align: 'left', value: 'start'},
                {text: 'Date finish', align: 'left', value: 'finish'},
                {text: 'Time start', align: 'left', value: 'startTimeStr'},
                {text: 'Time finish', align: 'left', value: 'finishTimeStr'},
                {text: 'Pausetime', align: 'left', value: 'pauseStr'},
                {text: 'Worktime', align: 'left', value: 'periodStr'},
                {text: 'Price', align: 'left', value: 'price'},
                {text: 'Cost', align: 'left', value: 'cost'},
                {text: 'Company', align: 'left', value: 'company'},
                {text: 'Project', align: 'left', value: 'project'},
                {text: 'Task', align: 'left', value: 'task'},
                {text: 'Description', align: 'left', value: 'description'},
                {text: 'Del', sortable: false, value: 'task'}
            ],
            search: ''
        }
    },
    methods: {
        convertToDate(datetime) {
            try {
                let d = `${datetime.getDate()}`;
                let m = `${datetime.getMonth() + 1}`;
                let y = `${datetime.getFullYear()}`;
                if (d.length < 2) d = `0${d}`;
                if (m.length < 2) m = `0${m}`;
                return `${d}.${m}.${y}`;
            } catch (e) {
                return '01.01.2001'
            }
        },
        convertMS(ms) {

            let d = 0;
            let h = 0;
            let m = 0;
            let s = 0;
            let strTime = '';

            s = Math.floor(ms / 1000);
            m = Math.floor(s / 60);
            s = s % 60;
            h = Math.floor(m / 60);
            m = m % 60;
            d = Math.floor(h / 24);
            h = h % 24;
            h += d * 24;

            if (`${h}`.length === 1) {
                strTime += `0${h}`;
            } else {
                strTime += `${h}`;
            }

            if (`${m}`.length === 1) {
                strTime += `:0${m}`;
            } else {
                strTime += `:${m}`;
            }

            if (`${s}`.length === 1) {
                strTime += `:0${s}`;
            } else {
                strTime += `:${s}`;
            }

            return strTime;
        },
        async createSeparate(item, typeTime) {

            let time = `${item[typeTime].slice(0, 2)}`;
            time += `:${item[typeTime].slice(2, 4)}`;
            time += `:${item[typeTime].slice(4, 6)}`;
            item[typeTime] = time;
            await recountTimes(item);

        },
        async recountCost(item) {
            await recountCost(item);
        },
        recountFooter(items) {

            glObj.tasksFooter.pausetime = 0;
            glObj.tasksFooter.worktime = 0;
            glObj.tasksFooter.cost = 0;
            glObj.tasksFooter.companiesCount = 0;
            glObj.tasksFooter.tasksCount = 0;
            glObj.tasksFooter.projectsCount = 0;

            let companies = [];
            let projects = [];
            let tasks = [];

            for (let item of items) {

                glObj.tasksFooter.pausetime += item.pause;
                glObj.tasksFooter.worktime += item.period;
                glObj.tasksFooter.cost += Number(item.cost);

                if (!companies.includes(item.company)) companies.push(item.company);
                if (!projects.includes(item.project)) projects.push(item.project);
                if (!tasks.includes(item.task)) tasks.push(item.task);

            }

            glObj.tasksFooter.companiesCount = companies.length;
            glObj.tasksFooter.projectsCount = projects.length;
            glObj.tasksFooter.tasksCount = tasks.length;
            glObj.tasksFooter.cost = (glObj.tasksFooter.cost).toFixed(2);
        },
        customFilter(items, search, filter, headers) {

            const props = headers.map(h => h.value);

            let itemsFilter = items.filter(item => {
                let yes = item.start >= glObj.filter.startDate
                    && item.finish <= glObj.filter.finishDate;

                if (yes && glObj.filter.companies && glObj.filter.companies.length) {
                    if (glObj.filter.excludeCompanies) {
                        yes = !glObj.filter.companies.includes(item.company);
                    } else {
                        yes = glObj.filter.companies.includes(item.company);
                    }
                }

                if (yes && glObj.filter.projects && glObj.filter.projects.length) {
                    if (glObj.filter.excludeProjects) {
                        yes = !glObj.filter.projects.includes(item.project);
                    } else {
                        yes = glObj.filter.projects.includes(item.project);
                    }
                }

                if (yes && glObj.filter.tasks && glObj.filter.tasks.length) {
                    if (glObj.filter.excludeTasks) {
                        yes = !glObj.filter.tasks.includes(item.task);
                    } else {
                        yes = glObj.filter.tasks.includes(item.task);
                    }
                }

                if (yes && glObj.filter.search) {
                    if (glObj.filter.excludeSearch) {
                        yes = !props.some(prop => item[prop].toString().toLowerCase().includes(glObj.filter.search.toString().toLowerCase()));
                    } else {
                        yes = props.some(prop => item[prop].toString().toLowerCase().includes(glObj.filter.search.toString().toLowerCase()));
                    }
                }

                return yes;
            });

            this.recountFooter(itemsFilter);

            return itemsFilter;
        },
        async deleteTask(task) {
            await setDialog({
                head: 'Delete task',
                text: `Company: ${task.company}. Task: ${task.task}`,
                textBtnApply: 'Delete',
                obj: task,
                act: glObj.dialog.acts.DELETE,
                show: true
            });
            await save();
        },
        truncate(text, len = 30) {

            if (!text) {
                return '';
            }

            text = String(text);
            if (text.length <= len) {
                return text;
            }

            return text.slice(0, len) + '...';
        }
    },
    template: `
    <v-data-table 
      :headers="headers"
      :items="glObj.tasks"
      :pagination.sync="glObj.pagination" 
      :custom-filter="customFilter" 
      :search="search"      
    >
      <template slot="items" slot-scope="props">
        <td>{{ convertToDate(props.item.start) }}</td>
        <td>{{ convertToDate(props.item.finish) }}</td>       
        <td>
            <v-edit-dialog
              :return-value.sync="props.item.startTimeStr"
              lazy
              @save="createSeparate(props.item, 'startTimeStr')"         
            > {{ props.item.startTimeStr }}
              <v-text-field
                slot="input"
                v-model="props.item.startTimeStr"              
                label="Edit"
                single-line 
                color="indigo"
                mask="##:##:##"               
              ></v-text-field>
            </v-edit-dialog>
        </td>      
        <td>
            <v-edit-dialog
              :return-value.sync="props.item.finishTimeStr"
              lazy
              @save="createSeparate(props.item, 'finishTimeStr')"         
            > {{ props.item.finishTimeStr }}
              <v-text-field
                slot="input"
                v-model="props.item.finishTimeStr"              
                label="Edit"
                single-line 
                color="indigo"
                mask="##:##:##"               
              ></v-text-field>
            </v-edit-dialog>
        </td>
        <td>
            <v-edit-dialog
              :return-value.sync="props.item.pauseStr"
              lazy
              @save="createSeparate(props.item, 'pauseStr')"         
            > {{ props.item.pauseStr }}
              <v-text-field
                slot="input"
                v-model="props.item.pauseStr"              
                label="Edit"
                single-line 
                color="indigo"
                mask="##:##:##"               
              ></v-text-field>
            </v-edit-dialog>
        </td>
        <td>{{ props.item.periodStr }}</td>       
        <td>
            <v-edit-dialog
              :return-value.sync="props.item.price"              
              lazy   
              @save="recountCost(props.item)"                    
            > {{ props.item.price }}
              <v-text-field
                slot="input"
                v-model="props.item.price"              
                label="Price"
                color="indigo"
                single-line                                
              ></v-text-field>
            </v-edit-dialog>
        </td>
        <td>{{ props.item.cost }}</td>       
        <td>
            <v-edit-dialog
              :return-value.sync="props.item.company"              
              lazy                       
            > {{ props.item.company }}
              <v-text-field
                slot="input"
                v-model="props.item.company"              
                label="Company"
                color="indigo"
                single-line                                
              ></v-text-field>
            </v-edit-dialog>
        </td> 
        <td>
            <v-edit-dialog
              :return-value.sync="props.item.project"              
              lazy                       
            > {{ props.item.project }}
              <v-text-field
                slot="input"
                v-model="props.item.project"              
                label="Project"
                color="indigo"
                single-line                                
              ></v-text-field>
            </v-edit-dialog>
        </td>           
        <td>
            <v-edit-dialog
              :return-value.sync="props.item.task"              
              lazy                       
            > {{ truncate(props.item.task) }}
              <v-text-field
                slot="input"
                v-model="props.item.task"              
                label="Task"
                color="indigo"
                single-line                                
              ></v-text-field>
            </v-edit-dialog>
        </td>       
        <td>
            <v-edit-dialog
              :return-value.sync="props.item.description"              
              lazy                       
            > {{ truncate(props.item.description) }}
              <v-text-field
                slot="input"
                v-model="props.item.description"              
                label="Description"
                color="indigo"
                single-line                                
              ></v-text-field>
            </v-edit-dialog>
        </td>       
        <td>
            <v-icon @click="deleteTask(props.item)">
                delete_outline
            </v-icon>            
        </td>
      </template>
       <template slot="footer">
        <td>
          <strong></strong>
        </td>
        <td>
          <strong></strong>
        </td>
        <td>
          <strong></strong>
        </td>
        <td>
          <strong></strong>
        </td>
        <td>
          <strong>{{ convertMS(glObj.tasksFooter.pausetime) }}</strong>
        </td>           
        <td>
          <strong>{{ convertMS(glObj.tasksFooter.worktime) }}</strong>
        </td>   
        <td>
          <strong></strong>
        </td>   
        <td>
          <strong> {{ glObj.tasksFooter.cost }}</strong>
        </td>   
        <td>
          <strong> {{ glObj.tasksFooter.companiesCount }}</strong>
        </td> 
        <td>
          <strong> {{ glObj.tasksFooter.projectsCount }}</strong>
        </td>           
        <td>
          <strong>{{ glObj.tasksFooter.tasksCount }}</strong>
        </td>   
        <td>
          <strong></strong>
        </td>   
        <td>
          <strong></strong>
        </td> 
      </template>
    </v-data-table>`
});