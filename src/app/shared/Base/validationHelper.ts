export function validate(formInstance) {
  const result: any = formInstance.instance.validate();

  if (!result.isValid) {
    result.brokenRules[0].validator.focus();
    return false;
  }
  return true;
}
