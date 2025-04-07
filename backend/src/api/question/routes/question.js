module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/quizzes/:documentId',
            handler: 'question.validateResponse',
            config: {
                auth: false
            }
        }
    ]
}