export const validatePhoneNumber = (phone: string): boolean => {
  // Turkish phone number validation
  const phoneRegex = /^(\+90|0)?5\d{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

export const formatPhoneNumber = (phone: string): string => {
  // Format as +90 5XX XXX XX XX
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("90")) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(
      5,
      8
    )} ${cleaned.slice(8, 10)} ${cleaned.slice(10, 12)}`;
  }
  if (cleaned.startsWith("0")) {
    return `+90 ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(
      7,
      9
    )} ${cleaned.slice(9, 11)}`;
  }
  return `+90 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(
    6,
    8
  )} ${cleaned.slice(8, 10)}`;
};
