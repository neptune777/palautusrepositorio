const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}
console.log('process.argv[0]:', process.argv[0], 'process.argv[1]', process.argv[1], 'process.argv[2]', process.argv[2])
const password = encodeURIComponent(process.argv[2])

const url =
  `mongodb+srv://mattikkinnunen_db_user:${password}@cluster0.9hedpr0.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)
/*

const note = new Note({
    content: 'HTML is easy',
    important: true,
})
const note2 = new Note({
    content: 'HTML is easier than you think',
    important: false,
})
const note3 = new Note({
    content: 'JavaScript is easy too',
    important: true,
})

note.save().then(result => {
    console.log('note saved!')

    note2.save().then(result => {
        console.log('note2 saved!')

        note3.save().then(result => {
            console.log('note3 saved! Connection of mongoose will be closed.')

            mongoose.connection.close()
        })
    })
})
*/

Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})





