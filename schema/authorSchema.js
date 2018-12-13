import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const authorSchema = new Schema({
    booksId: [Schema.Types.ObjectId],
    name: String
}, {
    collection: 'AuthorsData'
});

export default mongoose.model('AuthorsData', authorSchema);