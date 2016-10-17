/**
 * Created by romit on 10/17/16.
 */
import express from 'express';
import StudentController from '../controllers/StudentController';

class EmployeeRoutes {
    constructor(dbUtils) {
        this.studentRouter = express.Router();
        this.studentController = new StudentController(dbUtils);
        this.setupRoutes = this.setupRoutes.bind(this);
    }

    setupRoutes() {
        this.studentRouter.route("/")
            .get(this.studentController.getAll);

        return this.studentRouter;
    }
}

export default EmployeeRoutes;