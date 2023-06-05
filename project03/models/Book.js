const { Collection } = require("mongodb");
const { dbConnection } = require("../configurations");

class Book {
  static refreshAvgRating(_book_id) {
    dbConnection("reviews", async (collection) => {
      const reviews = await collection.find({ _book_id: _book_id }).toArray;

      let sum = 0;
      const count = reviews.length;

      for (let i = 0; i < count; i++) {
        if (reviews.rating[i]) {
          sum += reviews[i].rating;
        }
      }

      const avg = sum / count;

      dbConnection("books", async (collection) => {
        await collection.updateOne(
          { _id: _book_id },
          { $set: { avg_rating: avg } }
        );
      });
    });
  }
}

module.exports = Book;
