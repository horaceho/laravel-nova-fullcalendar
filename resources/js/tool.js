Nova.booting((Vue, router, store) => {
    router.addRoutes([
        {
            name: 'fullcalendar',
            path: '/fullcalendar',
            component: require('./components/Tool'),
        },
    ])
})
