'use strict';

/**
 * question service
 */

module.exports = {
    async validateResponse(documentId, answer) {
        try {
            const question = await strapi.documents("api::question.question").findOne({
                documentId: documentId,
                status: 'published',
                fields: ['isCorrect'],
            });

            if (!question) {
                return {
                    status: false,
                    message: 'Question not found',
                }
            }

            if(question.isCorrect !== answer) {
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
