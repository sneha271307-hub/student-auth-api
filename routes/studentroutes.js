const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authmiddleware");
const roleMiddleware = require("../middleware/rolemiddleware");

const {
    getStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent
} = require("../controllers/studentcontroller");

router.get("/", authMiddleware, getStudents);

router.get("/:id", authMiddleware, getStudentById);

router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    createStudent
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    updateStudent
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    deleteStudent
);

module.exports = router;