const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
        me: async(parent, args, context) => {
            if(context.user){
                const userData = await User.findOne({_id: context.user._id}).select('-__v -password');
                return userData;
            }
            throw new AuthenticationError('Whoops, You Must Log In!');
        }
    },
    Mutation:{
        addUser: async(parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return{token, user};
        },
        
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
              throw new AuthenticationError('Uh oh, No User Found.');
            }
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
              throw new AuthenticationError('Try Again!');
            }
            const token  =signToken(user);
            return {token, user};
        },
        
        saveBook: async(parent, args, context) => {
            if(context.user){
                const updatedBooks = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    {$addToSet: {savedBooks: args} },
                    {
                    new: true, 
                    runValidators: true
                  }
                );
                return updatedBooks;
            }
            throw new AuthenticationError('Cannot Add Book');
        },
        
        removeBook: async (parent, { bookId }, context) => {
            if(context.user){
                const updatedBooks = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    {$pull: {savedBooks: {bookId} } },
                    {
                      new: true
                    }
                );
                return updatedBooks;
            }
            throw new AuthenticationError('Cannot Delete Book');
        }
    }
};

module.exports = resolvers;