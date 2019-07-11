## About Laravel Nova Fullcalender
Laravel Nova Fullcalender is an event calendar built from Laravel Nova Tool.

![Laravel Nova Fullcalender](https://raw.githubusercontent.com/horaceho/laravel-nova-fullcalendar/a4c60c4d50bbe1d575f350b2f379427abb67b01b/resources/images/nova-fullcalendar.png)

## Getting Start
Create a new Laravel application with Laravel Nova following the instructions on offical websites:
- [Laravel](https://laravel.com/docs/master)
- [Laravel Nova](https://nova.laravel.com/docs/)

Create a simple Event model:
````
php artisan make:model Event --migration
````
Add Event fields to ````create_events_table.php```` migration file:
````
    public function up()
    {
        Schema::create('events', function (Blueprint $table) {
            $table->increments('id');
            $table->text('title');
            $table->dateTime('start_date')->nullable();
            $table->dateTime('end_date')->nullable();
            $table->timestamps();
        });
    }
````
Install [Laravel 5 Full Calendar Helper](https://github.com/maddhatter/laravel-fullcalendar) and [implement the event interface](https://github.com/maddhatter/laravel-fullcalendar):
````
composer require maddhatter/laravel-fullcalendar
````
Perform the migration:
````
php artisan migrate
````
Update fields to ````App\Nova\Event.php```` resource:
````
    public function fields(Request $request)
    {
        return [
            ID::make()->sortable(),
            Text::make('Title')->rules('required'),
            DateTime::make('From', 'start_date'),
            DateTime::make('To', 'end_date'),
        ];
    }
````
Define ````$dates```` in ````App\Event.php```` model:
````
class Event extends Model
{
    protected $dates = [
        'start_date',
        'end_date',
    ];
}
````

## Making Of
This section is a step-by-step guide to build Laravel Nova Fullcalendar. Once Laravel and Laravel Nova are setup up properly, follow the [Laravel Nova documentation](https://nova.laravel.com/docs/) to create a blank tool:
````
php artisan nova:tool horaceho/fullcalendar

Would you like to install the tool's NPM dependencies? (yes/no) [yes]:
> yes
Would you like to compile the tool's assets? (yes/no) [yes]:
> yes
Would you like to update your Composer packages? (yes/no) [yes]:
> yes
````
Update ````app/Providers/NovaServiceProvider````:
````
use Horaceho\Fullcalendar\Fullcalendar;

    public function tools()
    {
        return [
            new Fullcalendar,
        ];
    }
````
Add route to ````nova-components/Fullcalendar/routes/api.php````:
````
use App\Event;

Route::get('/events', function (Request $request) {
    $events = Event::all();
    return response()->json($events);
});
````
Install a calendar module, we pick [@fullcalendar/vue](https://fullcalendar.io/docs/vue):
````
npm install --save @fullcalendar/vue
npm install --save @fullcalendar/core
npm install --save @fullcalendar/daygrid
npm install --save @fullcalendar/timegrid
npm install --save @fullcalendar/interaction
````
Get rid of the ````ajv@^6.0.0```` warning:
````
npm install ajv@^6.0.0 --save
````
Change to the tool folder, and auto-compile the assets:
````
cd nova-components/Fullcalendar
npm run watch
````
Import Calendar in ````nova-components/Fullcalendar/resources/js/tool.js````:
````
Nova.booting((Vue, router) => {
    router.addRoutes([
        {
            name: 'fullcalendar',
            path: '/fullcalendar',
            component: require('./components/Tool'),
        },
    ])
})
````
Display calendar in ````nova-components/Fullcalendar/resources/js/components/Tool.vue````:
````
<template>
    <div>
        <FullCalendar 
            @dateClick="handleDateClick"
            @eventClick="handleEventClick"
            @eventMouseEnter="handleLeaveEnter"
            @eventMouseLeave="handleMouseLeave"
            ref="fullCalendar"
            :plugins="calendarPlugins"
            :weekends="calendarWeekends"
            :events="calendarEvents"
            :header="{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,listWeek'
            }"
        />
    </div>
</template>

<script>

import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default {
    components: {
        FullCalendar
    },
    methods: {
        handleDateClick(info) {
            console.log(info);
        },
        handleEventClick(info) {
            console.log(info);
        },
        handleLeaveEnter(info) {
            console.log(info);
        },
        handleMouseLeave(info) {
            console.log(info);
        },
    },
    data() {
        return {
            calendarPlugins: [
                dayGridPlugin,
                timeGridPlugin,
                interactionPlugin
            ],
            calendarWeekends: true,
            calendarEvents: [
                { title: "Today", start: new Date() }
            ]
        };
    },
    mounted() {
        console.log('mounted()')
        axios.get('/horaceho/fullcalendar/events').then(response => {
            this.events = response.data
            if (this.events) {
                this.calendarEvents = []
                this.events.forEach((event) => {
                    this.calendarEvents.push({
                        title: event.title,
                        start: event.start_date,
                        end: event.end_date
                    })
                })
            }
        });
    },
}

</script>

<style>
@import "~@fullcalendar/core/main.css";
@import "~@fullcalendar/daygrid/main.css";
@import "~@fullcalendar/timegrid/main.css";
</style>

````
Now, create a few events to show on the calendar...

## Credit
- [Publishing Your First Laravel Nova Tool](https://tighten.co/blog/publishing-your-first-laravel-nova-tool) by Sara Bine

## License
Laravel Nova Fullcalendar is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
