import { useEffect, useState } from "react";

export const useValidations = <V extends FieldValues, C extends FieldConfigs>(
  props: ValidatorProps<V, C>
) => {
  const [state, setState] = useState(validateFields<V, C>(props));
  useEffect(() => {
    setState(validateFields<V, C>(props));
  }, [props]);

  return state;
};

function validateFields<V extends FieldValues, F extends FieldConfigs>({
  values,
  configs
}: ValidatorProps<V, F>) {
  const results = {} as Record<keyof F, ValidatorResult>;

  for (const fieldName in configs) {
    const fieldConfig = configs[fieldName];
    const fieldValue = values[fieldName];
    results[fieldName] = validateField(fieldValue, fieldConfig);
  }

  return results;
}

function validateField(value: FieldValue, fields: FieldConfig) {
  const result = createInitialValue();

  for (const validatorName in fields) {
    const validatorConfig = fields[validatorName as keyof FieldConfig];
    const validator = validators[validatorName];

    validator(validatorConfig, result)(value);
    if (result.errors.length) break;
  }

  return result;
}
const createInitialValue = (): ValidatorResult => ({ errors: [] });
const isFile: Validator<FileConfig, File> = (
  { label, required, max, extensions },
  result = createInitialValue()
) => {
  const requiredValidator = isRequired({ label, required }, result);

  return value => {
    if (value) {
      if (extensions) {
        const extensionIsValid = extensions
          .map(v => v.toLowerCase())
          .includes(value.type.toLowerCase());
        if (!extensionIsValid) {
          result.errors.push({
            message: `${label} has unsupported file format`
          });
        }
      } else if (max && value.size >= max) {
        result.errors.push({ message: `${label} file is too large` });
      }
    }

    return requiredValidator(value);
  };
};

const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const isEmail: Validator<EmailConfig, string> = (
  { label, required },
  result = createInitialValue()
) => {
  return isString({ label, required, regex: emailRegex }, result);
};

const urlRegex =
  /^(?:(?:https?):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
const isUrl: Validator<URLConfig, string> = (
  { label, required },
  result = createInitialValue()
) => {
  return isString({ label, required, regex: urlRegex }, result);
};

const isDate: Validator<DateConfig, Date> = (
  { label, required, start, end, between },
  result = createInitialValue()
) => {
  const requiredValidator = isRequired({ label, required }, result);
  return value => {
    if (start && value && value.getTime() < start.getTime()) {
      result.errors.push({
        message: `${label} must be greater then ${start.getTime()}.`
      });
    } else if (end && value && value.getTime() > end.getTime()) {
      result.errors.push({
        message: `${label} must be lower then ${end.getTime()}.`
      });
    } else if (
      between &&
      value &&
      (value.getTime() > between.end.getTime() ||
        value.getTime() < between.start.getTime())
    ) {
      result.errors.push({
        message: `${label} must be between ${between.start.getTime()} and ${between.end.getTime()}.`
      });
    }

    return requiredValidator(value);
  };
};

const isNumber: Validator<NumberConfig, number> = (
  { label, required, min, max },
  result = createInitialValue()
) => {
  const requiredValidator = isRequired({ label, required }, result);
  return value => {
    if (value && min && value < min) {
      result.errors.push({ message: `${label} must be larger than ${min}.` });
    } else if (value && max && value > max) {
      result.errors.push({ message: `${label} must be less than ${max}.` });
    }

    return requiredValidator(value);
  };
};

const isString: Validator<StringConfig, string> = (
  { label, required, min, max, regex },
  result: ValidatorResult = createInitialValue()
) => {
  const requiredValidator = isRequired({ label, required }, result);
  return (value: string) => {
    if (value) {
      if (min && value.length < min) {
        result.errors.push({
          message: `${label} must be at least ${min} characters long.`
        });
      } else if (max && value.length > max) {
        result.errors.push({
          message: `${label} must be shorter than ${max} characters.`
        });
      } else if (regex && !regex.test(value)) {
        result.errors.push({ message: `${label} is not in valid format.` });
      }
    }

    return requiredValidator(value);
  };
};

function isCustom<T>(
  { label, required, test }: CustomConfig<T>,
  result: ValidatorResult = createInitialValue()
) {
  const requiredValidator = isRequired({ label, required }, result);

  return (value: T) => {
    if (!test(value)) {
      result.errors.push({ message: `${label} is not in valid format.` });
    }

    return requiredValidator(value);
  };
}

const isRequired: Validator<RequiredConfig, FieldValue> = (
  { label, required = true },
  result: ValidatorResult = createInitialValue()
) => {
  return value => {
    if (required) {
      if (typeof value === "string" && !value.trim()) {
        result.errors.push({ message: `${label} is required.` });
      } else if (Array.isArray(value) && !value.length) {
        result.errors.push({ message: `${label} is required.` });
      } else if (!value) {
        result.errors.push({ message: `${label} is required.` });
      }
    }

    return result;
  };
};

const validators: Record<string, Validator<any, any>> = {
  required: isRequired,
  number: isNumber,
  string: isString,
  custom: isCustom,
  url: isUrl,
  email: isEmail,
  date: isDate,
  file: isFile
};

interface ValidatorProps<V extends FieldValues, C extends FieldConfigs> {
  values: V;
  configs: C;
}

export type FieldValues = Record<string, FieldValue>;
export type FieldConfigs = Record<string, FieldConfig>;
export type FieldConfig = Partial<{
  required: RequiredConfig;
  number: NumberConfig;
  string: StringConfig;
  url: URLConfig;
  email: EmailConfig;
  date: DateConfig;
  file: FileConfig;
  custom: CustomConfig<unknown>;
}>;
export type FieldValue = any;

export type ValidatorResult = {
  errors: { message: string }[];
};
export type ValidatorConfig = Record<string, any>;
export type Validator<T extends ValidatorConfig, K> = (
  config: T,
  interim: ValidatorResult
) => (value: K) => ValidatorResult;

interface NumberConfig extends RequiredConfig {
  min?: number;
  max?: number;
}

interface StringConfig extends RequiredConfig {
  min?: number;
  max?: number;
  regex?: RegExp;
}

interface URLConfig extends RequiredConfig {}

interface EmailConfig extends RequiredConfig {}

interface DateConfig extends RequiredConfig {
  start?: Date;
  end?: Date;
  between?: { start: Date; end: Date };
}

interface FileConfig extends RequiredConfig {
  max?: number;
  extensions: string[];
}

interface CustomConfig<T> extends RequiredConfig {
  test: (value: T) => boolean;
}

interface RequiredConfig {
  label: string;
  required: boolean;
}
