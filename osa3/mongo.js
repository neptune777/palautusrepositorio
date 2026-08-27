const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = encodeURIComponent(process.argv[2])

const url =
    `mongodb+srv://mattikkinnunen_db_user:${password}@cluster0.9hedpr0.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)
const numberOfArgs = process.argv.length
if (numberOfArgs === 5) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })
    person.save().then(result => {
        console.log('added', result.name, result.number, 'to phonebook.')
        mongoose.connection.close()
    })
} else if (numberOfArgs === 3) {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
} else {
    console.log(`Use this command syntax to save a person data: node mongo.js yourPassword 'name' number`)
    console.log(`Use this command syntax to print all persons in the database: node mongo.js yourPassword`)
    mongoose.connection.close()
}