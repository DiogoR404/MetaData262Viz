const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/students')
const Student = require('./Student')

const app = express()
const port = 5000

app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/student/:studentId', async (req, res) => {
  let result
  await Student.findOne({number: req.params.studentId}).then((res) => {
    result = res
    console.log(result)
  })
  res.send(JSON.stringify(result))
})

app.post('/newStudent', async (req, res) => {
  let name = req.body.name
  let number = req.body.number
  let course = req.body.course
  const newStudent = new Student({name: name, number: number, course: course})
  await newStudent.save()
  res.send('Student was added!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
