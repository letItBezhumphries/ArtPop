const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
const functions = require("firebase-functions");
const serviceAcct = require("./artpop-dev-b9e42-firebase-adminsdk-27gku-bbedb897e1.json");
const firebaseConfig = require("./config.js");
const gcconfig = {
  projectId: "artpop-dev-b9e42",
  keyFilename: "artpop-dev-b9e42-firebase-adminsdk-27gku-bbedb897e1.json",
};
const admin = require("firebase-admin");
admin.initializeApp({
  firebaseConfig: firebaseConfig,
  credential: admin.credential.cert(serviceAcct),
  databaseURL: "https://artpop-dev-b9e42.firebaseio.com",
});

const path = require("path");
const fs = require("fs-extra");
const os = require("os");
// Imports the Google Cloud client library.
const { Storage } = require("@google-cloud/storage");
const sharp = require("sharp");
const gcs = new Storage(gcconfig);
const cors = require("cors")({ origin: true });
const Busboy = require("busboy");

const THUMB_SM = "55x155";
const THUMB_MD = "235x235";
const THUMB_LG = "365x665";
const THUMB_XLG = "1405x1405";
const ThumbSizes = [THUMB_SM, THUMB_MD, THUMB_LG, THUMB_XLG];

// Thumbnail prefix added to file names.
const THUMB_PREFIX = "thumb_";

/*
 */
exports.resizeImg = functions
  .runWith({ memory: "2GB", timeoutSeconds: 120 })
  .storage.object()
  .onFinalize(async (object) => {
    const bucket = gcs.bucket(object.bucket);
    const filePath = object.name;
    const fileName = filePath.split("/").pop();
    const bucketDir = path.dirname(filePath);

    const workingDir = path.join(os.tmpdir(), "resize");
    const tmpFilePath = path.join(workingDir, filePath);

    if (fileName.includes("@s_") || !object.contentType.includes("image")) {
      console.log(`Already resized. Exiting function`);
      return false;
    }

    await fs.ensureDir(workingDir);
    await bucket.file(filePath).download({ destination: tmpFilePath });

    const sizes = ["55x155", "230x230", "460x660", "1400x1400"];
    let imgWid, imgHt;

    const uploadPromises = sizes.map(async (size) => {
      imgWid = parseInt(size.split("x")[0], 0);
      imgHt = parseInt(size.split("x")[1], 0);

      const ext = fileName.split(".").pop();
      let imgName = fileName.replace(`.${ext}`, "");
      let newImgName = `${imgName}@s_${size}.${ext}`;
      let imgPath = path.join(workingDir, newImgName);

      await sharp(tmpFilePath)
        .resize({ width: imgWid, height: imgHt })
        .toFile(imgPath);

      // console.log(`DONKEY KONG!! imgName ${imgName} at size ${size}`);
      let filedest = path.join(bucketDir, newImgName);
      await bucket.upload(imgPath, {
        destination: filedest,
        uploadType: "media",
        metadata: {
          contentType: "image/jpg",
          metadata: {
            cacheControl: "public, max-age=36000",
          },
        },
      });

      const encodedPath = encodeURIComponent(newImgName);
      const trimUrl =
        "https://firebasestorage.googleapis.com/v0/b/artpop-dev-b9e42.appspot.com/o/" +
        encodedPath +
        "?alt=media";

      await admin.database().ref(`images/${imgName}/${size}`).push(trimUrl);
    });

    await Promise.all(uploadPromises);

    return fs.remove(workingDir);
  });

/*
 */
exports.uploadImage = functions.https.onRequest(async (req, res) => {
  try {
    return cors(req, res, () => {
      if (req.method !== "POST") {
        return res.status(500).json({
          message: "Not allowed",
        });
      }

      const busboy = new Busboy({ headers: req.headers });
      let uploadData = null;

      busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
        console.log("it's a file event filename:", filename, "file:", file);
        const filepath = path.join(os.tmpdir(), filename);
        uploadData = { file: filepath, type: mimetype };
        file.pipe(fs.createWriteStream(filepath));
      });

      busboy.on("finish", () => {
        const bucket = gcs.bucket("artpop-dev-b9e42.appspot.com");
        bucket
          .upload(uploadData.file, {
            uploadType: "media",
            metadata: {
              metadata: {
                contentType: uploadData.type,
                cacheControl: "public, max-age=36000",
              },
            },
          })
          .then(() => {
            res.status(200).json({
              message: "It worked!",
            });
          })
          .catch((err) => {
            res.status(500).json({
              error: err,
            });
          });
      });
      busboy.end(req.rawBody);
    });
  } catch (err) {
    res.status(500).json({
      msg: "Server Error",
    });
  }
});
