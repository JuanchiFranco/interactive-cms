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
                        fields: ['question', 'options', 'isCorrect', 'id'],
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
                    id: question.id,
                    question: question.question,
                    options: question.options,
                    isCorrect: question.isCorrect,
                }
            });

            // devuelve en que pregunta se ha fallado y en que pregunta se ha acertado
            let incorrectAnswersList = [];
            let correctAnswersList = [];

            // recorre las respuestas y las compara con las preguntas y elimina el campo isCorrect
            answers.forEach((answer) => {
                const question = questions.find((question) => question.id === answer.questionId);
                if (!question) {
                    return;
                }
                if (question.isCorrect === answer.answer) {
                    correctAnswersList.push(question);
                    correctAnswersList[correctAnswersList.length - 1].isCorrect = undefined;
                } else {
                    incorrectAnswersList.push(question);
                    incorrectAnswersList[incorrectAnswersList.length - 1].isCorrect = undefined;
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
