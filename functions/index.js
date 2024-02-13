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
const PromisePool = require("es6-promise-pool");
// Maximum concurrent account deletions.
const MAX_CONCURRENT = 3;

// Run once a day at midnight, to clean up the users
// Manually run the task here https://console.cloud.google.com/cloudscheduler
exports.recreateDailyHH = onSchedule("every day 00:00", async (event) => {
  const happyHours = await admin.firestore().collection("happyhours").get();
  const happyHoursData = happyHours.docs
      .map((doc) => ({id: doc.id, ...doc.data()}));

  console.log(happyHoursData);

  const happyHoursDataToRecreate = happyHoursData
      .filter((happyHour) => happyHour.recurency === "Daily");

  console.log(happyHoursDataToRecreate);

  const happyHoursToRecreate = happyHoursDataToRecreate.map((happyHour) => {
    const newHappyHour = {...happyHour};
    const d = new Date(dayjs(happyHour.date).add(1, "day").toDate());
    const dateTimeLocalValue =
      (new Date(d.getTime() - d.getTimezoneOffset() * 60000)
          .toISOString())
          .slice(0, -5);
    newHappyHour.date = dateTimeLocalValue;

    return newHappyHour;
  });

  console.log(happyHoursToRecreate);

  const happyHoursToRecreatePromises = happyHoursToRecreate.map((happyHour) =>
    admin.firestore()
        .collection("happyhours")
        .doc(happyHour.id).set(happyHour),
  );

  const pool = new PromisePool(() => {
    const promise = happyHoursToRecreatePromises.shift();
    return promise ? promise : null;
  }, MAX_CONCURRENT);

  // Create a pool of promises.
  await pool.start();

  logger.log("Recreate Daily Happy hour");
  logger.log("Done");
});

exports.recreateWeeklyHH = onSchedule("every day 00:00", async (event) => {
  const happyHours = await admin.firestore().collection("happyhours").get();
  const happyHoursData = happyHours.docs
      .map((doc) => ({id: doc.id, ...doc.data()}));

  console.log(happyHoursData);

  const today = dayjs().startOf("day");

  const happyHoursDataToRecreate = happyHoursData
      .filter((happyHour) => {
        const happyHourEndDate = dayjs(happyHour.date);
        return (
          happyHour.recurency === "Weekly" &&
            happyHourEndDate.isSame(today, "day")
        );
      });

  console.log(happyHoursDataToRecreate);

  const happyHoursToRecreate = happyHoursDataToRecreate.map((happyHour) => {
    const newHappyHour = {...happyHour};
    const d = new Date(dayjs(happyHour.date).add(1, "week").toDate());
    const dateTimeLocalValue =
      (new Date(d.getTime() - d.getTimezoneOffset() * 60000)
          .toISOString())
          .slice(0, -5);
    newHappyHour.date = dateTimeLocalValue;

    return newHappyHour;
  });

  console.log(happyHoursToRecreate);

  const happyHoursToRecreatePromises = happyHoursToRecreate.map((happyHour) =>
    admin.firestore()
        .collection("happyhours")
        .doc(happyHour.id).set(happyHour),
  );

  const pool = new PromisePool(() => {
    const promise = happyHoursToRecreatePromises.shift();
    return promise ? promise : null;
  }, MAX_CONCURRENT);

  // Create a pool of promises.
  await pool.start();

  logger.log("Recreate Weekly Happy hour");
  logger.log("Done");
});
