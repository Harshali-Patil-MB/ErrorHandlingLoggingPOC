import Joi from "joi";

export const createAppointmentSchema = Joi.object({
  doctorPublicId: Joi.string().trim().uuid().required(),
  reason: Joi.string().trim().min(2).max(255).required(),
  appointmentDate: Joi.date()
    .iso()
    .required()
    .custom((value, helpers) => {
      const selectedDate = value instanceof Date ? value : new Date(value);

      if (Number.isNaN(selectedDate.getTime())) {
        return helpers.error("date.base");
      }

      if (selectedDate.getTime() <= Date.now()) {
        return helpers.error("date.future");
      }

      if (
        selectedDate.getMinutes() % 30 !== 0 ||
        selectedDate.getSeconds() !== 0 ||
        selectedDate.getMilliseconds() !== 0
      ) {
        return helpers.error("date.slot");
      }

      return value;
    }, "future date validation")
    .messages({
      "date.base": "Appointment date is invalid",
      "date.future": "Appointment date must be in the future",
      "date.slot": "Appointment time must be on a 30-minute slot",
    }),
});
