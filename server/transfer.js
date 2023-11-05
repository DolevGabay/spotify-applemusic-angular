const express = require('express');
const router = express.Router();
// const conn = require('./db/conn.js');

// const db = conn.getDb();
router.get('/', (req, res) => {
    const { transferData } = req.session;
    
    if(transferData === undefined) {
        res.sendStatus(404);
    } else {
        res.status(200).json({ transferData });
    }
});

router.post('/', async (req, res) => {
   // console.log(db)
   // const collection = await db.collection('transfers');

    const { transferData } = req.body;
   // const source = req.session.streamers.source.streamer;
   // const dest = req.session.streamers.dest.streamer;
    
   //const result = await collection.insertOne({ transferData, source, dest});
    req.session.transferData = transferData;
   // res.send(result.insertedId).status(201);
    res.sendStatus(201);
});

router.delete('/', (req, res) => {
    req.session.transferData = undefined;
    res.sendStatus(200);
});

module.exports = router;