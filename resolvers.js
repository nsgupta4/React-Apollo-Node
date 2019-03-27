import BooksData from './schema/booksSchema';
import AuthorsData from './schema/authorSchema';
import mongoose, { Collection } from 'mongoose';

const addBook = (title, authorId, bookId) => new Promise((resolve, reject) => {
    BooksData.create({
        title,
        authorId,
        _id: bookId
    }, (err, result) => {
        if (err) reject(err);
        else resolve(result);
    });
});

const updateBook = (id, title) => new Promise((resolve, reject) => {
    BooksData.findOneAndUpdate({
        _id: id 
    }, {
        "$set" : {title: title} 
    }, 
    (err, result) => {
        if(err) reject(err);
        else resolve(result);
    });
});

const deleteBook = (id) => new Promise((resolve, reject) => {
    BooksData.findByIdAndRemove({
        "_id": id
    }, (err, result) => {
        if(err) reject(err);
        else resolve(result);
    });
});

const deleteAuthor = (id) => new Promise((resolve, reject) => {
    AuthorsData.findByIdAndRemove({
        "_id": id
    }, (err, result) => {
        if (err) reject(err);
        else resolve(result);
    });
});

const addAuthor = (name, booksId, authorId) => new Promise((resolve, reject) => {
    AuthorsData.create({
        name,
        booksId,
        _id: authorId
    }, (err, result) => {
        if (err) reject(err);
        else {
            console.log('addAuthor success', result);
            resolve(result);
        }
    });
});

const updateAuthor = (id, name) => new Promise((resolve, reject) => {
    AuthorsData.findOneAndUpdate({
        _id: id 
    }, {
        "$set" : {name: name} 
    }, 
    (err, result) => {
        if(err) reject(err);
        else resolve(result);
    });
});

const resolvers = {
    Query: {
        allBooks: async () => {
            // console.log('-==-=-=',);
            // const res = BooksData.aggregate([
            //     {
            //         $lookup: {
            //             from: "AuthorsData",
            //             localField: "_id",
            //             foreignField: "booksId",
            //             as: "collection"
            //         },
            //     },
            //     {
            //         $unwind: "$collection"
            //     },
            //     // {
            //     //     $project: {
            //     //         __v: "",
            //     //         "collection.__v": "",
            //     //         "collection._id": "",
            //     //         "collection.booksId": "",
            //     //         "collection.name": ""
            //     //     }
            //     // },
            // ]);
            // console.log('response', res);
            // .then(res  => {
            //     console.log('res', res);   
            // }).catch(err => {
            //     console.log('err', err);
            // }));
            const res = await BooksData.find().populate('authorId').exec();
            const result = [];
            // (err, users) => console.log('users -err', err, users)
            res.map(item => {
                result.push({
                    id: item._id.toString(),
                    title: item.title,
                    author: {
                        id: item.authorId._id.toString(),
                        name: item.authorId.name,
                    }});
            })
            console.log('ha ha ', result);
            return result;
        },
        book: (_, args) => {
            return BooksData.findOne({ title: args.title });
        },
        allAuthors: () => {
            return AuthorsData.find({});
        },
        author: (_, args) => {
            return AuthorsData.findOne({ id: args.id});
        }
    },
    Mutation: {
        updateBook: (_,args) => {
            return Promise.all([
                updateBook(args.id, args.title),
                updateAuthor(args.authorId, args.author)
            ]).then(result => result[0])
                .catch(error => console.log('updateBook - error', error));
        },
        addBook: (_, args) => {
            const authorId = mongoose.Types.ObjectId();
            const bookId = mongoose.Types.ObjectId();
            return Promise.all([
                addBook(args.title, authorId, bookId),
                addAuthor(args.author, bookId, authorId)
            ]).then(result => result[0])
            .catch(error => console.log('error', error));
        },
        deleteBook: (_, args) => {
            return Promise.all([
                deleteBook(args.id),
                deleteAuthor(args.authorId)
            ])
            .then(result => result[0])
            .catch(error => console.log('error delete', error));
        },
        addAuthor: (_, args) => {
            const authorId = mongoose.Types.ObjectId();
            const bookId = mongoose.Types.ObjectId();
            return Promise.all([
                addAuthor(args.name, bookId, authorId),
                addBook(args.book, authorId, bookId)
            ]).then(result => result[0])
            .catch(error => console.log('error', error));
        }
    }
}

export default resolvers;