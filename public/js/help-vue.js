Vue.component('help', {
    data() {
        return {
            dialogLogin,
            glObj
        }
    },
    methods: {
        async showMainForm() {
            await showMainForm();
        },
        scrollHelp(idEl = '#timehelp') {

            if (!glObj.settings.enLang) {
                idEl = `${idEl}ru`;
            } else {
                idEl = `${idEl}en`;
            }

            let scrollOptions = {
                duration: 300,
                offset: -58,
                easing: 'easeInOutCubic',
            };
            this.$vuetify.goTo(idEl, scrollOptions);
            this.dialogLogin.help.showNavigation = false;
        },
        async play(type = 'pomodoro') {
            await this.stop(type);
            if (type === 'pomodoro') {
                this.$refs.audiopomodoro.play();
            } else {
                this.$refs.audiopause.play();
            }

        },
        async stop(type) {
            if (type === 'pomodoro') {
                this.$refs.audiopomodoro.pause();
                this.$refs.audiopomodoro.currentTime = 0;
            } else {
                this.$refs.audiopause.pause();
                this.$refs.audiopause.currentTime = 0;
            }
        }
    },
    template: `
    <v-container>       
        <audio ref="audiopomodoro" 
               :src="glObj.pomodoro.soundPomodoro"
        ></audio>
        <audio ref="audiopause" 
               :src="glObj.pomodoro.soundPause"
        ></audio>
        <v-navigation-drawer            
            clipped
            app           
            v-model="dialogLogin.help.showNavigation"                                            
        >
            <v-list>
                <v-list-tile>
                    <v-list-tile-action>
                        <v-switch
                            v-model="glObj.settings.enLang"
                            color="deep-orange"
                        ></v-switch>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title class="deep-orange--text">Ru/En</v-list-tile-title>                        
                    </v-list-tile-content>
                </v-list-tile> 
                <v-list-tile @click="scrollHelp('#abouthelp')">
                    <v-list-tile-content>
                        <v-list-tile-title class="indigo--text">
                            About
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>            
                <v-list-tile @click="scrollHelp('#taskhelp')">
                    <v-list-tile-content>
                        <v-list-tile-title class="indigo--text">
                            Task
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile @click="scrollHelp('#pomodorohelp')">
                    <v-list-tile-content>
                        <v-list-tile-title class="indigo--text">
                            Pomodoro
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile @click="scrollHelp('#settingspomodorohelp')">
                    <v-list-tile-content>
                        <v-list-tile-title class="indigo--text">
                            Pomodoro settings
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>                
                <v-list-tile @click="scrollHelp('#worktimehelp')">
                    <v-list-tile-content>
                        <v-list-tile-title class="indigo--text">
                            Worktime
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile @click="scrollHelp('#filterhelp')">
                    <v-list-tile-content>
                        <v-list-tile-title class="indigo--text">
                            Filter
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile @click="scrollHelp('#usersettingshelp')">
                    <v-list-tile-content>
                        <v-list-tile-title class="indigo--text">
                            User settings
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile @click="scrollHelp('#exporthelp')">
                    <v-list-tile-content>
                        <v-list-tile-title class="indigo--text">
                            Export
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile @click="scrollHelp('#exporthelp')">
                    <v-list-tile-content>
                        <v-list-tile-title class="indigo--text">
                            Import
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile @click="scrollHelp('#installhelp')">
                    <v-list-tile-content>
                        <v-list-tile-title class="indigo--text">
                            Install
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile
                    class="indigo--text"
                    @click="showMainForm"
                >
                    <v-list-tile-content>
                        <v-list-tile-title>
                            Close help
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-layout v-if="!glObj.settings.enLang" column pl-3>
            <v-flex>
                <h4 class="display-1 indigo--text" id="abouthelpru">
                    About
                </h4>
                <p><b>Worktime</b> — это web приложение которое ведет временной и стоимостной 
                учет задач. С возможностью применения техники "Помидор".</p>               
            </v-flex>
            <v-flex>
                <h4 class="display-1 indigo--text" id="taskhelpru">
                    Task
                </h4>
                <p><b>Task</b> — управление текущей задачей.</p> 
                <v-img 
                    src="img/help/task.png"
                    max-width=600
                ></v-img>
                <p><b>00:00:33</b> — время прошедшее с момента начала выполнения задачи.</p>
                <p><b>Play</b> — начать выполнять задачу. Фиксируется датавремя начала 
                выполнения задачи.</p>
                <p><b>Pause</b> — приостановить выполнение задачи. Время паузы не 
                учитывается при окончании выполнения задачи. Стоимость не рассчитывается
                 на время паузы.</p>
                <p><b>Stop</b> — закончить выполнение задачи. Фиксируется датавремя 
                окончания выполнения задачи. Рассчитывается время затраченное на 
                задачу и стоимость, без учета времени паузы.</p>
                <p><b>Company</b> — организация для которой выполняется задача.</p>
                <p><b>Project</b> — проект для которого выполняется задача.</p>
                <p><b>Task</b> — краткое наименование задачи.</p>
                <p><b>Description</b> — детальное описание задачи.</p>
                <p><b>Price</b> — стоимость задачи.</p>
                <p><b>Price per hour</b> — стоимость в час. Если признак выключен, 
                то стоимость за всю задачу, без учета затраченного времени.</p>               
            </v-flex>                     
            <v-flex>
                <h4 class="display-1 indigo--text" id="pomodorohelpru">
                    Pomodoro
                </h4>
                <p><b>Pomodoro</b> — техника управления временем, предложенная Франческо Чирилло 
                в конце 1980-х. Техника предполагает разбиение задач на 25-минутные периоды, 
                называемые «помидоры», сопровождаемые короткими перерывами.</p>
                <v-img src="img/help/pomodoro.png"></v-img>
                <strong>Принцип техники:</strong>
                <p><b>1</b> — определитесь с задачей, которую будете выполнять.</p>
                <p><b>2</b> — поставьте помидор (таймер) на 25 минут.</p>
                <p><b>3</b> — работайте, ни на что не отвлекаясь, пока таймер не прозвонит.
                 Если что-то отвлекающее возникло у вас в голове, запишите это и немедленно 
                 возвращайтесь к работе.</p>
                <p><b>4</b> — сделайте короткий перерыв 5 минут.</p>
                <p><b>5</b> — после каждого 4-го «помидора» сделайте длинный перерыв 30 
                минут.</p>                
            </v-flex>
            <v-flex>
                <h4 class="display-1 indigo--text" id="settingspomodorohelpru">
                    Pomodoro settings
                </h4>               
                <v-img 
                    src="img/help/pomodorosettings.png"
                    max-width=500 
                ></v-img>
                <p><b>Pomodoro</b> — длительность помидора (минуты).</p>
                <p><b>Short pause</b> — длительность короткой паузы (минуты).</p>
                <p><b>Long pause</b> — длительность длинной паузы (минуты).</p>
                <p><b>Pomodoro count</b> — количество помидоров до длинной паузы.</p>
                <p><b>Sound</b> — вкл/выкл. звуковое оповещение.</p>
                <p><b>Set</b> — применить настройки.</p>
                <p><b>Set default</b> — установить настройки по умолчанию.</p>
                <v-btn 
                    @click="play('pomodoro')"
                    color="deep-orange"
                    outline
                >
                    Звук начала помидора
                </v-btn>
                <v-btn 
                    @click="play('pause')"
                    color="light-green"
                    outline
                >
                    Звук начала паузы
                </v-btn>                               
            </v-flex>
            <v-flex>
                <h4 class="display-1 indigo--text" id="worktimehelpru">
                    Worktime
                </h4>
                <p><b>Worktime</b> — хранит данные о всех ранее выполненных задачах. Задачи 
                можно отобрать с помощью фильтра.</p>
                <v-img src="img/help/worktime1.png"></v-img>
                <p><b>Date start</b> — дата начала выполнения задачи.</p>
                <p><b>Date finish</b> — дата завершения выполнения задачи.</p>
                <p><b>Time start</b> — время начала выполнения задачи.</p>
                <p><b>Time finish</b> — время завершения выполнения задачи.</p>
                <p><b>Pausetime</b> — время пауз. В подвале всего времени 
                пауз по отфильтрованным задачам.</p>
                <p><b>Worktime</b> — общее время выполнения задачи без учета пауз. 
                В подвале всего времени выполнения по отфильтрованным задачам.</p>
                <v-img src="img/help/worktime2.png"></v-img>
                <p><b>Price</b> — цена задачи.</p>
                <p><b>Cost</b> — стоимость задачи рассчитанная из Worktime и Price. 
                В подвале суммарная стоимость по отфильтрованным задачам.</p>
                <p><b>Company</b> — компания. В подвале всего различных компаний по 
                отфильтрованным задачам.</p>
                <p><b>Project</b> — проект. В подвале всего различных проектов по 
                отфильтрованным задачам.</p>
                <p><b>Task</b> — задача. В подвале всего различных задач по 
                отфильтрованным задачам.</p>
                <p><b>Description</b> — описание задачи.</p>
                <p><b>Del</b> — удалить задачу.</p>
            </v-flex>
            <v-flex>
                <h4 class="display-1 indigo--text" id="filterhelpru">
                    Filter
                </h4>
                <p><b>Filter</b> — отобрать выполненные задачи в Worktime по заданным 
                условиям. </p>
                <v-img 
                    src="img/help/worktimefilter.png"
                    max-width=500
                ></v-img>
                <p><b>Date start</b> — начало периода.</p>
                <p><b>Date finish</b> — окончание периода.</p>
                <p><b>Companies</b> — отобрать задачи выбранных компаний. При включенном 
                Exclude, отобрать задачи исключая выбранные компании.</p>
                <p><b>Projects</b> — отобрать задачи выбранных проектов. При включенном 
                Exclude, отобрать задачи исключая выбранные проекты.</p>
                <p><b>Tasks</b> — отобрать выбранные задачи. При включенном Exclude, 
                отобрать исключая выбранные задачи.</p>
                <p><b>Search</b> — строковой поиск. Отобрать задачи у которых встречается 
                подстрока. При включенном Exclude, отобрать задачи у которых не встречается 
                подстрока.</p>
                <p><b>Reset</b> — сбросить фильтр.</p>               
            </v-flex>
            <v-flex>
                <h4 class="display-1 indigo--text" id="usersettingshelpru">
                    User settings
                </h4>
                <p><b>User settings</b> — изменить пароль. Выбрать вариант хранения данных.</p>
                <v-img 
                    src="img/help/settings.png"
                    max-width=500
                ></v-img>
                <p><b>Current password</b> — текущий пароль.</p>
                <p><b>New password</b> — новый пароль.</p>
                <p><b>Confirm password</b> — подтверждение нового пароля.</p>
                <p><b>Save data to browser</b> — хранить данные в браузере. Данные 
                хранятся в текущем браузере, на текущем устройстве. В другом браузере, 
                на текущем устройстве, данные будут не доступны. На другом устройстве 
                данные не доступны. При выборе варианта хранения, данные сохраняются в 
                браузере, на сервере данные удаляются.</p>
                <p><b>Save data to cloud</b> — хранить данные на сервере приложения. 
                Данные сохраняются на сервере. Данные доступны из других браузеров и с 
                других устройств. При выборе варианта хранения, данные сохраняются на 
                сервер, в браузере удаляются. Вариант доступен, если приложение 
                запущено с параметром BACKEND: true.</p>
                <p><b>Save</b> — применить изменения настроек пользователя.</p>                              
            </v-flex>
            <v-flex>
                <h4 class="display-1 indigo--text" id="exporthelpru">
                    Export
                </h4>
                <p><b>Export</b> — сохранить данные в JSON формате.</p>
                <v-img 
                    src="img/help/export.png"
                    max-width=300
                ></v-img>
                <p><b>Copy</b> — скопировать JSON в буфер обмена.</p>                                             
            </v-flex>
            <v-flex>
                <h4 class="display-1 indigo--text" id="importhelpru">
                    Import
                </h4>
                <p><b>Import</b> — загрузить данные из JSON формата.</p>
                <v-img 
                    src="img/help/import.png"
                    max-width=300
                ></v-img>
                <p><b>Load</b> — загрузить данные из JSON формата. Текущие 
                данные будут удалены.</p>
            </v-flex> 
            <v-flex>
                <h4 class="display-1 indigo--text" id="installhelpru">
                    Install
                </h4>
                <p><b>Install Node.js</b> — установите <a target="_blank" href="https://nodejs.org/en/download/">
                Node.js</a>.</p>               
                <p><b>Install MongoDB</b> — установите <a target="_blank" href="https://www.mongodb.com/download-center/community">
                MongoDB</a>. Если хранение данных планируется только в браузере, то можно не устанавливать MongoDB.</p>
                <p><b>Worktime</b> — скачайте <a target="_blank" href="https://github.com/jirufik/worktime">Worktime</a>
                или <kbd>git clone https://github.com/jirufik/worktime.git</kbd></p>
                <p><b>Npm</b> — установите пакеты <kbd>npm i</kbd></p>
                <p><b>Config</b> — настройте конфигурацию приложения в файле <kbd>worktime/config/index.js</kbd>.
                 Файл содержит два раздела, для сред исполнения: production и development.</p>
                <ul>
                    <li><b>PORT</b> — порт по которому будет доступно приложение.</li>
                    <li><b>BACKEND</b> — false данные хранятся только в браузере. true данные могут храниться 
                    в браузере или на сервере.</li>
                    <li><b>DBHOSTNAME</b> — адрес MongoDB. Заполняется при BACKEND: true.</li>
                    <li><b>DBNAME</b> — база MongoDB. Заполняется при BACKEND: true.</li>
                    <li><b>DBPORT</b> — порт MongoDB. Заполняется при BACKEND: true.</li>
                    <li><b>DBUSER</b> — пользователь MongoDB. Заполняется при BACKEND: true.</li>
                    <li><b>DBPASS</b> — пароль пользователя MongoDB. Заполняется при BACKEND: true.</li>
                    <li><b>pass.SALT</b> — соль для шифрования пароля.</li>
                    <li><b>pass.ITERATIONS</b> — количество итераций.</li>
                    <li><b>pass.HASH_LENGTH</b> — длина хэша.</li>                    
                </ul>
                <p></p>
                <p><b>Start</b> — запуск приложения <kbd>npm run startdev</kbd> или <kbd>npm run startprod</kbd></p>
            </v-flex>                                                        
        </v-layout>
        <v-layout v-if="glObj.settings.enLang" column pl-3>
            <v-flex>
                <h4 class="display-1 indigo--text" id="abouthelpen">
                    About
                </h4>
                <p><b>Worktime</b> — is a web application that keeps time and cost 
                accounting of tasks. With the possibility of using technology "Pomodoro".</p>               
            </v-flex>
            <v-flex>
                <h4 class="display-1 indigo--text" id="taskhelpen">
                    Task
                </h4>
                <p><b>Task</b> — management of the current task.</p> 
                <v-img 
                    src="img/help/task.png"
                    max-width=600
                ></v-img>
                <p><b>00:00:33</b> — elapsed time since the start of the task.</p>
                <p><b>Play</b> — start the task. The date of the start of the task is fixed.</p>
                <p><b>Pause</b> — pause the task. The pause time is not taken into account 
                when the task is completed. The cost is not calculated at the time of the pause.</p>
                <p><b>Stop</b> — finish the task. The date of completion of the task is fixed. 
                Calculates the time spent on the task and cost, without taking into account the 
                pause time.</p>
                <p><b>Company</b> — the organization for which the task is performed.</p>
                <p><b>Project</b> — the project for which the task is executed.</p>
                <p><b>Task</b> — short name of the task.</p>
                <p><b>Description</b> — a detailed description of the task.</p>
                <p><b>Price</b> — the cost of the task.</p>
                <p><b>Price per hour</b> — cost per hour. If the sign is off, the cost for 
                the entire task, without taking into account the time spent.</p>               
            </v-flex>                     
            <v-flex>
                <h4 class="display-1 indigo--text" id="pomodorohelpen">
                    Pomodoro
                </h4>
                <p><b>Pomodoro</b> — is a time management method developed by Francesco 
                Cirillo in the late 1980s. The technique uses a timer to break down work into 
                intervals, traditionally 25 minutes in length, separated by short breaks. </p>
                <v-img src="img/help/pomodoro.png"></v-img>
                <strong>Underlying principles:</strong>
                <p><b>1</b> — Decide on the task to be done.</p>
                <p><b>2</b> — Set the pomodoro timer (traditionally to 25 minutes).</p>
                <p><b>3</b> — Work on the task.</p>
                <p><b>4</b> — End work when the timer rings and put a checkmark on a piece of paper.</p>
                <p><b>5</b> — If you have fewer than four checkmarks, take a short break (5 minutes), 
                then go to step 2.</p> 
                <p><b>6</b> — After four pomodoros, take a longer break (30 minutes), 
                reset your checkmark count to zero, then go to step 1.</p>               
            </v-flex>
            <v-flex>
                <h4 class="display-1 indigo--text" id="settingspomodorohelpen">
                    Pomodoro settings
                </h4>               
                <v-img 
                    src="img/help/pomodorosettings.png"
                    max-width=500 
                ></v-img>
                <p><b>Pomodoro</b> — the duration of the pomodoro (minutes).</p>
                <p><b>Short pause</b> — the duration of the short pause (minutes).</p>
                <p><b>Long pause</b> — the length of a long pause (minutes).</p>
                <p><b>Pomodoro count</b> — the number of pomodoroes before a long pause.</p>
                <p><b>Sound</b> — on / off. sound alert.</p>
                <p><b>Set</b> — apply settings.</p>
                <p><b>Set default</b> — set default settings.</p>
                <v-btn 
                    @click="play('pomodoro')"
                    color="deep-orange"
                    outline
                >
                    Sound start pomodoro
                </v-btn>
                <v-btn 
                    @click="play('pause')"
                    color="light-green"
                    outline
                >
                    Sound start pause
                </v-btn>                               
            </v-flex>
            <v-flex>
                <h4 class="display-1 indigo--text" id="worktimehelpen">
                    Worktime
                </h4>
                <p><b>Worktime</b> — stores data about all previously completed tasks. 
                Tasks can be selected using a filter.</p>
                <v-img src="img/help/worktime1.png"></v-img>
                <p><b>Date start</b> — the start date of the task.</p>
                <p><b>Date finish</b> — the task completion date.</p>
                <p><b>Time start</b> — the start time of the task.</p>
                <p><b>Time finish</b> — task completion time.</p>
                <p><b>Pausetime</b> — pause time. In the basement of all time pauses for filtered tasks.</p>
                <p><b>Worktime</b> — the total time to complete the task without taking pauses. 
                In the basement of the entire execution time for filtered tasks.</p>
                <v-img src="img/help/worktime2.png"></v-img>
                <p><b>Price</b> — the price of the task.</p>
                <p><b>Cost</b> — task cost calculated from Worktime and Price. 
                In the basement, the total cost of the filtered tasks.</p>
                <p><b>Company</b> — the company. In the basement of all the various companies 
                on the filtered tasks.</p>
                <p><b>Project</b> — project. In the basement of all the various projects on the filtered tasks.</p>
                <p><b>Task</b> — a task. In the basement of all the various tasks on the filtered tasks.</p>
                <p><b>Description</b> — description of the task.</p>
                <p><b>Del</b> — delete the task.</p>
            </v-flex>
            <v-flex>
                <h4 class="display-1 indigo--text" id="filterhelpen">
                    Filter
                </h4>
                <p><b>Filter</b> — select completed tasks in Worktime by specified conditions.</p>
                <v-img 
                    src="img/help/worktimefilter.png"
                    max-width=500
                ></v-img>
                <p><b>Date start</b> — the beginning of the period.</p>
                <p><b>Date finish</b> — the end of the period.</p>
                <p><b>Companies</b> — select tasks of selected companies. With Exclude enabled, 
                select tasks excluding selected companies.</p>
                <p><b>Projects</b> — select tasks of selected projects. With Exclude enabled, 
                select tasks excluding selected projects.</p>
                <p><b>Tasks</b> — select selected tasks. With Exclude enabled, select exclude selected tasks.</p>
                <p><b>Search</b> — string search. Select tasks that have a substring. 
                When Exclude is enabled, select tasks that do not have a substring.</p>
                <p><b>Reset</b> — reset the filter.</p>               
            </v-flex>
            <v-flex>
                <h4 class="display-1 indigo--text" id="usersettingshelpen">
                    User settings
                </h4>
                <p><b>User settings</b> — change password. Choose a data storage option.</p>
                <v-img 
                    src="img/help/settings.png"
                    max-width=500
                ></v-img>
                <p><b>Current password</b> — current password.</p>
                <p><b>New password</b> — new password.</p>
                <p><b>Confirm password</b> — confirmation of the new password.</p>
                <p><b>Save data to browser</b> — store data in the browser. 
                Data is stored in the current browser, on the current device. 
                In another browser, on the current device, the data will not be available. 
                No data is available on the other device. When choosing a storage option, 
                the data is saved in the browser, the data is deleted on the server.</p>
                <p><b>Save data to cloud</b> — store data on the application server. 
                Data is stored on the server. Data is available from other browsers 
                and other devices. When you select a storage option, the data is saved to 
                the server and deleted in the browser. The option is available if the application 
                is running with the parameter BACKEND: true.</p>
                <p><b>Save</b> — apply changes to user settings.</p>                              
            </v-flex>
            <v-flex>
                <h4 class="display-1 indigo--text" id="exporthelpen">
                    Export
                </h4>
                <p><b>Export</b> — save data in JSON format.</p>
                <v-img 
                    src="img/help/export.png"
                    max-width=300
                ></v-img>
                <p><b>Copy</b> — copy JSON to clipboard.</p>                                             
            </v-flex>
            <v-flex>
                <h4 class="display-1 indigo--text" id="importhelpen">
                    Import
                </h4>
                <p><b>Import</b> — load data from JSON format.</p>
                <v-img 
                    src="img/help/import.png"
                    max-width=300
                ></v-img>
                <p><b>Load</b> — load data from JSON format. Current data will be deleted.</p>
            </v-flex> 
            <v-flex>
                <h4 class="display-1 indigo--text" id="installhelpen">
                    Install
                </h4>
                <p><b>Install Node.js</b> — install <a target="_blank" href="https://nodejs.org/en/download/">
                Node.js</a>.</p>               
                <p><b>Install MongoDB</b> — install <a target="_blank" href="https://www.mongodb.com/download-center/community">
                MongoDB</a>. If data storage is planned only in the browser, then you can not install MongoDB.</p>
                <p><b>Worktime</b> — download <a target="_blank" href="https://github.com/jirufik/worktime">Worktime</a>
                or <kbd>git clone https://github.com/jirufik/worktime.git</kbd></p>
                <p><b>Npm</b> — install packages <kbd>npm i</kbd></p>
                <p><b>Config</b> — set up the application configuration in the file <kbd>worktime/config/index.js</kbd>.
                 The file contains two sections for execution environments: production and development.</p>
                <ul>
                    <li><b>PORT</b> — the port on which the application will be available.</li>
                    <li><b>BACKEND</b> — false data is stored only in the browser. true data 
                    can be stored in a browser or on a server.</li>
                    <li><b>DBHOSTNAME</b> — is the MongoDB address. Filled with BACKEND: true.</li>
                    <li><b>DBNAME</b> — MongoDB database. Filled with BACKEND: true.</li>
                    <li><b>DBPORT</b> — is a MongoDB port. Filled with BACKEND: true.</li>
                    <li><b>DBUSER</b> — is a MongoDB user. Filled with BACKEND: true.</li>
                    <li><b>DBPASS</b> — is the password of the MongoDB user. Filled with BACKEND: true.</li>
                    <li><b>pass.SALT</b> — salt to encrypt the password.</li>
                    <li><b>pass.ITERATIONS</b> — the number of iterations.</li>
                    <li><b>pass.HASH_LENGTH</b> — hash length.</li>                    
                </ul>
                <p></p>
                <p><b>Start</b> — start application <kbd>npm run startdev</kbd> or <kbd>npm run startprod</kbd></p>
            </v-flex>                                                        
        </v-layout>
    </v-container>
`
});