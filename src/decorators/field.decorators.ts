import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

interface IFieldOptions {
  each?: boolean;
  swagger?: boolean;
  nullable?: boolean;
  groups?: string[];
}

@ValidatorConstraint({ async: false })
export class IsStudentCodeConstraint implements ValidatorConstraintInterface {
  validate(student_code: any, args: ValidationArguments) {
    const studentCodePattern = /^\d{3}\.\d{5}\.\d{2}\.\d{4}$/;
    return (
      typeof student_code === 'string' && studentCodePattern.test(student_code)
    );
  }

  defaultMessage(args: ValidationArguments) {
    return 'Student code must match the pattern 201.00345.33.0042';
  }
}

export function IsStudentCode(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsStudentCodeConstraint,
    });
  };
}

@ValidatorConstraint({ async: false })
export class IsEmailConstraint implements ValidatorConstraintInterface {
  validate(email: any, args: ValidationArguments) {
    // Basic email pattern for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return typeof email === 'string' && emailRegex.test(email);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Invalid email format';
  }
}

// Create the custom decorator
export function IsEmailField(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailConstraint,
    });
  };
}

@ValidatorConstraint({ async: false })
export class IsPhoneNumberConstraint implements ValidatorConstraintInterface {
  validate(phoneNumber: any, args: ValidationArguments) {
    const phoneRegex = /^(17|77)\d{6}$/;
    return typeof phoneNumber === 'string' && phoneRegex.test(phoneNumber);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Phone number must start with 17 or 77 with 8 digits';
  }
}

// Create the custom decorator
export function IsPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPhoneNumberConstraint,
    });
  };
}

@ValidatorConstraint({ async: false })
export class IsStrongPasswordConstraint
  implements ValidatorConstraintInterface
{
  validate(password: string, args: ValidationArguments) {
    if (typeof password !== 'string') {
      return false;
    }

    const minLength = 8;
    const maxLength = 32;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumberOrSpecial = /((?=.*\d)|(?=.*\W+))/.test(password);

    return (
      password.length >= minLength &&
      password.length <= maxLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumberOrSpecial
    );
  }

  defaultMessage(args: ValidationArguments) {
    return [
      'Password must be between 8 and 32 characters long',
      'Password must contain at least 1 upper case letter',
      'Password must contain at least 1 lower case letter',
      'Password must contain at least 1 number or special character',
    ].join('\n');
  }
}

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsStrongPasswordConstraint,
    });
  };
}

@ValidatorConstraint({ async: false })
export class IsValidNameConstraint implements ValidatorConstraintInterface {
  validate(name: string, args: ValidationArguments) {
    if (typeof name !== 'string') {
      return false;
    }

    const minLength = 2;
    const maxLength = 32;
    const hasValidLength = name.length >= minLength && name.length <= maxLength;
    const hasValidCharacters = /^[A-Za-z\s]+$/.test(name);

    return hasValidLength && hasValidCharacters;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Name must be a string containing only letters and spaces, and must be between 2 and 32 characters long';
  }
}

// Create the custom decorator
export function IsValidName(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidNameConstraint,
    });
  };
}
