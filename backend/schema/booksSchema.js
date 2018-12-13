import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const booksSchema = new Schema({
    authorId: { type: Schema.Types.ObjectId, ref: 'AuthorsData' },
    title: String
}, {
    collection: 'BooksData'
});

export default mongoose.model('BooksData', booksSchema);