import { applyForScholarship } from "../../../actions";

export const applyScholarshipMutation = async ({ scholarshipId, description }) => {
    return await applyForScholarship(scholarshipId, description);
};
