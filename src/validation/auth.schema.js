const z = require("zod");

const passwordSchema = z
  .string()
  .min(8, "Mật khẩu phải tối thiểu 8 ký tự")
  .refine(
    (val) => /[a-zA-Z]/.test(val) && /[0-9]/.test(val),
    "Mật khẩu phải có ít nhất 1 chữ cái và 1 chữ số",
  );

const registerSchema = z.object({
  name: z.string().min(2, "Tên ít nhất 2 ký tự"),
  email: z.string().email("Email không đúng định dạng"),
  password: passwordSchema,
});

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Xác nhận mật khẩu không khớp",
    path: ["confirmPassword"],
  });

const googleLoginSchema = z.object({
  code: z.string().min(1, "Mã code là bắt buộc"),
  redirectUri: z.string().min(1, "Redirect URI là bắt buộc"),
});

const githubLoginSchema = z.object({
  code: z.string().min(1, "Mã code là bắt buộc"),
  redirectUri: z.string().min(1, "Redirect URI là bắt buộc"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

module.exports = {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  googleLoginSchema,
  githubLoginSchema,
  forgotPasswordSchema,
};
