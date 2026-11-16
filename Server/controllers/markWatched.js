const mongoose = require("mongoose");

const markWatched =
  ({ Watchlist, Library, fields, label }) =>
  async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({ message: "Invalid watchlist item." });
      }
      const owner = req.user.id;
      const item = await Watchlist.findOne({
        _id: req.params.id,
        owner,
      }).lean();
      if (!item) {
        return res
          .status(404)
          .send({ message: `${label} not found in watchlist` });
      }

      const libraryEntry = { owner };
      fields.forEach((field) => {
        if (item[field] !== undefined) libraryEntry[field] = item[field];
      });
      const result = await Library.updateOne(
        { id: item.id, owner },
        { $setOnInsert: libraryEntry },
        { upsert: true, runValidators: true },
      );
      await Watchlist.deleteOne({ _id: item._id, owner });

      const alreadyInLibrary = !result.upsertedCount;
      res.send({
        message: alreadyInLibrary
          ? `${label} was already in your list and has been removed from your watchlist.`
          : `${label} moved to your list.`,
        alreadyInLibrary,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Something went wrong" });
    }
  };

module.exports = markWatched;
