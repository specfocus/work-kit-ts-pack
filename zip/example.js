const archiver= require("archiver");
//create collection data zip file and upload it into s3 bucket.
const createZip = async (bucketConn, bucketName, collectionName) => {
  let archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
  });
  let collection = this.db.collection(collectionName);
  let dataStream = collection.find({});
  logger.info("Creating zip");
  archive.append(dataStream.pipe(JSONStream.stringify()), {name: collectionName + ".json"});
  archive.finalize();
  let writeStrem = new stream.PassThrough();
  archive.pipe(writeStrem);
  this.uploadToS3(bucketConn, bucketName, writeStrem, collectionName);
  dataStream.on("end", async() => {
      logger.info("Done!");
  });
  dataStream.on("error", (err) => {
      logger.error("error => ", err);
  });
}
