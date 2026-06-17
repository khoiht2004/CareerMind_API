const z = require("zod");

const applySchema = z.object({
  jobId: z
    .string({ required_error: "jobId là bắt buộc" })
    .min(1, "jobId là bắt buộc"),
  name: z
    .string({ required_error: "Vui lòng nhập họ và tên" })
    .trim()
    .min(2, "Họ và tên phải có ít nhất 2 ký tự")
    .regex(/^[^<>]*$/, "Họ và tên không được chứa ký tự HTML (<, >)"),
  email: z
    .string({ required_error: "Vui lòng nhập email" })
    .trim()
    .email("Email không đúng định dạng"),
  phone: z
    .string({ required_error: "Vui lòng nhập số điện thoại" })
    .trim()
    .min(9, "Số điện thoại phải có ít nhất 9 ký tự")
    .max(11, "Số điện thoại tối đa 11 ký tự")
    .regex(/^[0-9+\s().-]+$/, "Số điện thoại không hợp lệ"),
  linkedin: z
    .string()
    .trim()
    .url("Đường dẫn LinkedIn không hợp lệ")
    .optional()
    .or(z.literal("")),
  cvUrl: z.string().trim().optional().nullable(),
  cvId: z.string().trim().optional().nullable(),
  coverLetter: z.string().trim().optional().nullable(),
  isDraft: z.boolean().optional(),
});

module.exports = { applySchema };
