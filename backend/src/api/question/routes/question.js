module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/question/:documentId',
            handler: 'question.validateResponse',
            config: {
                auth: false
            }
        }
    ]
}