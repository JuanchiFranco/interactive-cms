'use strict';

module.exports = {
    async validateResponse(ctx) {
        const { documentId } = ctx.params;
        const { answer } = ctx.request.query;

        try {
            const isCorrect = await strapi.service('api::question.question').validateResponse(documentId, answer);

            if (!isCorrect.status) {
                return {
                    status: false,
                    message: 'Incorrect answer',
                }
            }

            return {
                status: true,
                message: 'Correct answer',
            }
                
        }catch (error) {
            return {
                status: false,
                message: 'Error validating response',
            }
        }
    }
}
