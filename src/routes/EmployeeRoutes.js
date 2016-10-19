/**
 * Created by romit on 10/13/16.
 */
import express from 'express';
import EmployeeController from '../controllers/EmployeeController';

class EmployeeRoutes {
    constructor(dbUtils) {
        this.employeeRouter = express.Router();
        this.employeeController = new EmployeeController(dbUtils);
        this.setupRoutes = this.setupRoutes.bind(this);
    }

    setupRoutes() {
        this.employeeRouter.route("/")
            .get(this.employeeController.getAll)
            .post(this.employeeController.saveEmployeeInfo);

        return this.employeeRouter;
    }
}

export default EmployeeRoutes;