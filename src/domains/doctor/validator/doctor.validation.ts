import Joi from "joi";

export const createDoctorSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  specialization: Joi.string().trim().min(2).max(100).required(),
  experience: Joi.number().integer().min(0).max(60).required(),
});
