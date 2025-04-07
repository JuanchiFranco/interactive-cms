'use strict';

module.exports = {
    async validateResponse(ctx) {
        const { documentId } = ctx.params;
        const { answers } = ctx.request.body;

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
