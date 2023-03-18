import { user, pass } from '../config/default.json'
const Application = require('../models/Application')
const transporter = require('../email/transporter')

module.exports = {
  Query: {
    //look up object syntax
    async application(_, { ID }) {
      return await Application.findByID(ID)
    },
    async getApplications(_, { amount, positionID }) {
      if (positionID == null) {
        return await Application.find().sort({ name: -1 }).limit(amount)
      }
      return await Application.find({ positionID: positionID })
    },
  },
  Mutation: 
    async createApplication(
      _,
      {
        applicationInput: {
          name,
          email,
          description,
          qA,
          positionID,
          resumeID,
        },
      },
    ) {
      const createdApplication = new Application({
        name: name,
        email: email,
        description: description,
        qA: qA,
        positionID: positionID,
        resumeID: resumeID,
      })

      const res = await createdApplication.save() //This is where MongoDB actually saves

      // Send a confirmation email
      let testAccount = {
        user: user,
        pass: pass,
      }

      const options = {
        from: testAccount.user,
        to: email,
        subject: 'Thanks for Applying!',
        text: "Hi BOT Woohoo! \n  We just received your application for the Backend Software Engineer - New Grad 2023 role. We're so excited you're interested in growing your career at Dune Mountain.",
      }

      transporter.sendMail(options, function (err, info) {
        if (err) {
          console.log(err)
          return
        }
        console.log('Sent: ' + info.response)
      })

      return {
        id: res.id,
        ...res._doc,
      }
    },
    async deleteApplication(_, { ID }) {
      const wasDeleted = (await Application.deleteOne({ _id: ID })).deletedCount
      return wasDeleted
      //1 if something was deleted, 0 if nothing was deleted
    },
  },
}
