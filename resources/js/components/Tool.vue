<template>
    <div>
        <FullCalendar 
            ref="fullCalendar" 
            :plugins="calendarPlugins"
            :weekends="calendarWeekends"
            :events="calendarEvents"
        />
    </div>
</template>

<script>

import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";

export default {
    components: {
        FullCalendar
    },
    data() {
        return {
            calendarPlugins: [
                dayGridPlugin
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
</style>
