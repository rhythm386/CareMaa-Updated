const mongoose = require("mongoose");
require("dotenv").config();

const Disease = require("./models/Disease");
const Doctor = require("./models/Doctor");

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/caremaa")
  .then(async () => {
    console.log("MongoDB connected");

    // Clear old data
    await Disease.deleteMany();
    await Doctor.deleteMany();

    // Insert diseases
    await Disease.insertMany([
      {
        category: "Pregnancy",
        disease_name: "Anemia",
        symptoms: ["Fatigue", "Weakness"],
        common_medicines: ["Iron Tablets", "Folic Acid"],
        recommended_specialist: "Gynecologist",
        severity: "Moderate"
      },
      {
        category: "Periods",
        disease_name: "PCOS",
        symptoms: ["Irregular periods", "Weight gain"],
        common_medicines: ["Metformin"],
        recommended_specialist: "Gynecologist",
        severity: "Serious"
      },
      {
        category: "Girl Child",
        disease_name: "Worm Infection",
        symptoms: ["Stomach pain"],
        common_medicines: ["Albendazole"],
        recommended_specialist: "Pediatrician",
        severity: "Mild"
      }
    ]);

    // Insert doctors
    await Doctor.insertMany([
      {
        doctor_id: "DOC001",
        name: "Dr. Ananya Sharma",
        specialist: "Gynecologist",
        hospital: { name: "Sanjeevani Hospital", location: "Bhopal" },
        verified: true,
        proxy_contact: "+91-9000011111"
      },
      {
        doctor_id: "DOC002",
        name: "Dr. Ritu Verma",
        specialist: "Pediatrician",
        hospital: { name: "ChildCare Clinic", location: "Indore" },
        verified: true,
        proxy_contact: "+91-9000022222"
      }
    ]);

    console.log("✅ Database seeded successfully");
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
