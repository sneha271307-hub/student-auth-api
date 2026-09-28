const Student = require("../models/student");


// GET all students
const getStudents = async (req, res) => {
    try {
        const students = await Student.find();

        res.status(200).json(students);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch students",
            error: error.message
        });
    }
};


// GET one student
const getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json(student);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch student",
            error: error.message
        });
    }
};


// CREATE student
const createStudent = async (req, res) => {
    try {
        const { name, email, age, course } = req.body;

        const student = await Student.create({
            name,
            email,
            age,
            course
        });

        res.status(201).json({
            message: "Student created successfully",
            student
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create student",
            error: error.message
        });
    }
};


// UPDATE student
const updateStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json({
            message: "Student updated successfully",
            student
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update student",
            error: error.message
        });
    }
};


// DELETE student
const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json({
            message: "Student deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete student",
            error: error.message
        });
    }
};


module.exports = {
    getStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent
};