'use strict';

module.exports = {
    async validateResponse(ctx) {
        const { documentId } = ctx.params;
        const { answers } = ctx.request.body;

        // Validate the request body
        if (!documentId) {
            return ctx.badRequest('Document ID is required');
        }
        if (!answers || !Array.isArray(answers)) {
            return ctx.badRequest('Answers must be an array');
        }
        if (answers.length === 0) {
            return ctx.badRequest('Answers array cannot be empty');
        }

        if (answers.some(answer => !answer.questionId || answer.answer === undefined)) {
            return ctx.badRequest('Each answer must have a questionId and an answer');
        }
        

        try {
            const response = await strapi.service('api::question.question').validateResponse(documentId, answers);

            if (!response.status) {
                return ctx.badRequest(response.message);
            }

            return {
                status: true,
                message: 'Response validated successfully',
                data: response.data,
            };
                
        }catch (error) {
            return {
                status: false,
                message: 'Error validating response',
            }
        }
    }
}
