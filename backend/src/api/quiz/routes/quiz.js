module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/quizzes',
            handler: 'quiz.find',
            config: {
                auth: false
            }
        },
        {
            method: 'GET',
            path: '/quizzes/:documentId',
            handler: 'quiz.findOne',
            config: {
                auth: false
            }
        },
    ]
}
