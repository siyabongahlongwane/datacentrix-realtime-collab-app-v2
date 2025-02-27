import { createNewUser, loginUser, getAllUsers, updateProfile } from "./userController";
import { createDocument, getDocument, getAllDocuments } from "./documentController"
import { addCollaborator, removeCollaborator, changeCollaboratorRole, getCollaborators } from "./collaboratorController";


export { createNewUser, loginUser, createDocument, getDocument, getAllDocuments, addCollaborator, removeCollaborator, changeCollaboratorRole, getCollaborators, getAllUsers, updateProfile };