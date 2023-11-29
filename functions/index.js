/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// The Cloud Functions for Firebase SDK to set up triggers and logging.
const {onSchedule} = require("firebase-functions/v2/scheduler");
const {logger} = require("firebase-functions");
const dayjs = require("dayjs");

// The Firebase Admin SDK to delete inactive users.
const admin = require("firebase-admin");
admin.initializeApp();

// The es6-promise-pool to limit the concurrency of promises.
const PromisePool = require("es6-promise-pool").default;
// Maximum concurrent account deletions.
const MAX_CONCURRENT = 3;

// Run once a day at midnight, to clean up the users
// Manually run the task here https://console.cloud.google.com/cloudscheduler
exports.recreateDailyHH = onSchedule("every day 00:00", async (event) => {
  // Fetch all user details.
  const happyHours = await admin.firestore().collection("happyhours").get();
  const happyHoursData = happyHours.docs.map((doc) => (
    {id: doc.id, ...doc.data()}
  ));
  const happyHoursDataToRecreate = happyHoursData
      .filter((happyHour) => happyHour.recurrency === "Daily");

  const happyHoursToRecreate = happyHoursDataToRecreate.map((happyHour) => {
    const newHappyHour = happyHour;
    newHappyHour.date = dayjs(happyHour.date).add(1, "day").toDate();
    return newHappyHour;
  });

  const happyHoursToRecreatePromises = happyHoursToRecreate.map((happyHour) => {
    return admin.firestore()
        .collection("happyhours")
        .doc(happyHour.id).set(happyHour);
  });

  const pool = new PromisePool(happyHoursToRecreatePromises, MAX_CONCURRENT);

  // Create a pool of promises.
  await pool.start();


  logger.log("Recreate Daily Happy hour");
});

export const recreateWeeklyHH = onSchedule("every day 00:00", async (event) => {
  // Fetch all user details.
  const happyHours = await admin.firestore().collection("happyhours").get();
  const happyHoursData = happyHours.docs.map((doc) => (
    {id: doc.id, ...doc.data()}
  ));
  const happyHoursDataToRecreate = happyHoursData
      .filter((happyHour) => {
        return happyHour.recurrency === "Weekly" &&
        dayjs(happyHour.date).day() === 0;
      });

  const happyHoursToRecreate = happyHoursDataToRecreate.map((happyHour) => {
    const newHappyHour = happyHour;
    newHappyHour.date = dayjs(happyHour.date).add(1, "week").toDate();
    return newHappyHour;
  });

  const happyHoursToRecreatePromises = happyHoursToRecreate.map((happyHour) => {
    return admin.firestore()
        .collection("happyhours")
        .doc(happyHour.id).set(happyHour);
  });

  const pool = new PromisePool(happyHoursToRecreatePromises, MAX_CONCURRENT);

  // Create a pool of promises.
  await pool.start();

  logger.log("Recreate Weekly Happy hour");
});
