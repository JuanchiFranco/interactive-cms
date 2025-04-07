'use strict';

module.exports = {
    async find(ctx) {
        let quizzes = await strapi.documents("api::quiz.quiz").findMany({
            status: 'published',
            populate: {
                questions: {
                    fields: ['question', 'options'],
                },
            },
        });

        return quizzes;
    },

    async findOne(params) {
        let quiz = await strapi.documents("api::quiz.quiz").findOne({
            documentId: params.documentId,
            status: 'published',
            populate: {
                questions: {
                    fields: ['question', 'options'],
                },
            },
        });

        return quiz;
    }
}
