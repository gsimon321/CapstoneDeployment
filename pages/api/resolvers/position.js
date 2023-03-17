//This is where the actual logic comes in

const Position = require('../models/Position')

module.exports = {
  Query: {
    //look up object syntax
    async position(_, { ID }) {
      return await Position.findById(ID)
    },
    async getPositions(_, { amount, clubId }) {
      if (clubId == null) {
        return await Position.find().sort({ name: -1 }).limit(amount)
      }
      return await Position.find({ clubId: clubId })
    },
  },
  Mutation: {
    async createPosition(
      _,
      {
        positionInput: {
          name,
          description,
          numberOfOpenings,
          skills,
          q,
          clubId,
        },
      },
    ) {
      const createdPosition = new Position({
        name: name,
        description: description,
        numberOfOpenings: numberOfOpenings,
        skills: skills,
        q: q,
        clubId: clubId,
      })

      const res = await createdPosition.save() //This is where MongoDB actually saves
      return {
        id: res.id,
        ...res._doc,
      }
    },
    async deletePosition(_, { ID }) {
      const wasDeleted = (await Position.deleteOne({ _id: ID })).deletedCount
      return wasDeleted
      //1 if something was deleted, 0 if nothing was deleted
    },
    async editPosition(
      _,
      {
        ID,
        positionInput: {
          name,
          description,
          numberOfOpenings,
          skills,
          q,
          clubId,
        },
      },
    ) {
      const wasEdited = (
        await Position.updateOne(
          { _id: ID },
          {
            name: name,
            description: description,
            numberOfOpenings: numberOfOpenings,
            skills: skills,
            q: q,
            clubId: clubId,
          },
        )
      ).modifiedCount
      return wasEdited
    },
  },
}