export function authErrorSkill(message: string): string {
  if (message.includes("Password should be at least")) {
    return "A senha deve ter pelo menos 6 caracteres";
  }

  if (message.includes("Password is too weak")) {
    return "A senha é muito fraca. Use letras maiúsculas e números.";
  }

  if (message.includes("Invalid login credentials")) {
    return "E-mail ou senha incorretos";
  }

  if (message.includes("Email not confirmed")) {
    return "Por favor, confirme seu e-mail antes de fazer login";
  }

  if (message.includes("User already registered")) {
    return "Este e-mail já está cadastrado";
  }

  return "Ocorreu um erro. Tente novamente.";
}
if (
  message.includes("known to be weak") ||
  message.includes("easy to guess")
) {
  return "A senha é muito fraca ou fácil de adivinhar. Escolha uma senha mais segura.";
}

if (
  message.includes("should contain at least one character") ||
  message.includes("abcdefghijklmnopqrstuvwxyz")
) {
  return "A senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais.";
}
