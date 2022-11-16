import { Router } from "express";
import multer from "multer";

import uploadConfig from "@config/upload";

import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";

import { CreateCompanyController } from "../controllers/CreateCompanyController";
import { CreateImageCompanyController } from "../controllers/CreateImageCompanyController";
import { FindByCompanyController } from "@modules/companies/infra/http/controllers/FindByCompanyController";
import { ListAllCompaniesController } from "../controllers/ListAllCompaniesController";
import { UpdateCompanyController } from "../controllers/UpdateCompanyController";
import { DeleteCompanyController } from "../controllers/DeleteCompanyController";

const companiesRouter = Router();

const upload = multer(uploadConfig);

const createCompanyController = new CreateCompanyController();
const createImageCompanyController = new CreateImageCompanyController();
const findByCompanyController = new FindByCompanyController();
const listAllCompaniesController = new ListAllCompaniesController();
const updateCompanyController = new UpdateCompanyController();
const deleteCompanyController = new DeleteCompanyController();

companiesRouter.use(ensureAuthenticated);

companiesRouter.post('/', createCompanyController.handle);
companiesRouter.post(
    '/images/:id',
    upload.array("images"),
    createImageCompanyController.handle
);
companiesRouter.get('/:id', findByCompanyController.handle);
companiesRouter.get('/', listAllCompaniesController.handle);
companiesRouter.put('/:id', updateCompanyController.handle);
companiesRouter.delete('/:id', deleteCompanyController.handle);


export default companiesRouter;
