const User = require('../models/User')
const Club = require('../models/Club')
const { ApolloError } = require('apollo-server-errors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../config/default.json')

/**
 *
 * Upon login I want to be able to
 *
 */
module.exports = {
  Mutation: {
    async registerUser(
      _,
      { registerInput: { name, email, password, role, clubName } },
    ) {
      // See if user already exists
      console.log(name, email, role, password)
      email = email.toLowerCase()
      const userExists = await User.findOne({ email })
      console.log(userExists)
      if (userExists) {
        throw new ApolloError(
          'User with this email is already registed ' + email,
          'USER_ALREADY_EXISTS',
        )
      }

      // Encrypt Password

      var encryptedPassword = await bcrypt.hash(password, 10)

      const user = new User({
        name: name,
        email: email.toLowerCase(),
        password: encryptedPassword,
        role: role,
        clubName: clubName,
      })

      // Create Token
      const token = jwt.sign(
        { id: user.id, role: user.role },
        config.jwtSecret,
        { expiresIn: 3600 },
      )

      user.token = token

      //   const clubExisits = await Club.findOne({ email});
      //   if (clubExisits) {
      //     throw new ApolloError(
      //         "Club with this name is already registed " + clubName,
      //         "CLUB_ALREADY_EXISTS"
      //         );
      //     }
      const newClub = new Club({
        name: clubName,
        department: null,
        description: null,
      })

      const clubRes = await newClub.save() //This is where MongoDB actually saves
      console.log(clubRes._id)
      user.clubID = clubRes._id
      console.log('Saved club ' + clubRes)

      const res = await user.save()

      return {
        id: res.id,
        ...res._doc,
      }
    },
    async loginUser(_, { loginInput: { email, password } }) {
      // Check if user exists
      const user = await User.findOne({ email })

      // Check if password is correct && Create new Token
      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign(
          { id: user.id, role: user.role },
          config.jwtSecret,
          { expiresIn: 3600 },
        )
        user.token = token

        // Find associated Club
        const clubID = user.clubID

        const userClub = await Club.findById(clubID)

        return {
          id: userClub.id,
          ...userClub._doc,
        }
      }
      throw new ApolloError('Incorrect password', 'INCORRECT_PASSWORD')

      // Create new Token
    },
  },
  Query: {
    user: (_, { ID }) => User.findById(ID),
  },
}
