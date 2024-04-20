const express = require('express')
const method = require('../controllers/QuestionController.js')

const router = express.Router()

router.route('/').get(method.getAllQuestions).post(method.postQuestion)
router.route('/:id').get(method.getQuestion).patch(method.patchQuestion).delete(method.deleteQuestion)


module.exports=router