import Joi from "joi";

export const createAppointmentSchema = Joi.object({
  doctorPublicId: Joi.string().trim().uuid().required(),
  reason: Joi.string().trim().min(2).max(255).required(),
  appointmentDate: Joi.date().iso().required(),
});

