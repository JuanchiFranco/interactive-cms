'use strict';

/**
 * question service
 */

module.exports = {
    async validateResponse(documentId, answers) {
        try {
            const question = await strapi.documents("api::quiz.quiz").findOne({
                documentId: documentId,
                status: 'published',
                populate: {
                    questions: {
                        fields: ['question', 'options', 'isCorrect'],
                    },
                },
            });

            if (!question) {
                return {
                    status: false,
                    message: 'Question not found',
                }
            }
            const questions = question.questions.map((question) => {
                return {
                    question: question.question,
                    options: question.options,
                    isCorrect: question.isCorrect,
                }
            });

            // devuelve en que pregunta se ha fallado y en que pregunta se ha acertado
            let incorrectAnswersList = [];
            let correctAnswersList = [];
            questions.forEach((question, index) => {
                if (question.isCorrect === answers[index]) {
                    correctAnswersList.push(question.question);
                } else {
                    incorrectAnswersList.push(question.question);
                }
            });
            return {
                status: true,
                message: 'Response validated successfully',
                data: {
                    correctAnswers: correctAnswersList,
                    incorrectAnswers: incorrectAnswersList,
                },
            };
        }catch (error) {
            return {
                status: false,
                message: 'Error validating response',
            }
        }
    }
}
