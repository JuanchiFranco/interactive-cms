'use strict';

module.exports = {
    async find(ctx) {
        return await strapi.service('api::quiz.quiz').find(ctx.query);
    },

    async findOne(ctx) {
        return await strapi.service('api::quiz.quiz').findOne(ctx.params);
    }
}
