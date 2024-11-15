import { combineReducers } from "redux";
import { authReducer } from "./authReducer";
import { userReducer } from "./userReducer";
import { supplierReducer } from "./supplierReducer"
import { materialReducer } from "./materialReducer"
import { projectReducer } from "./projectReducer"
import { taskReducer } from "./taskReducer"
import purchaseReducer from "./purchaseReducer";

export default combineReducers({
    auth: authReducer,
    users: userReducer, // Add the userReducer here
    suppliers: supplierReducer,
    materials: materialReducer,
    projects: projectReducer,
    tasks: taskReducer,
    purchases: purchaseReducer,
});
