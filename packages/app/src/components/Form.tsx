import {
  createContext,
  Dispatch,
  FormEvent,
  PropsWithChildren,
  Reducer,
  useMemo,
  useReducer
} from "react";
import { useDeepLayoutEffect } from "../hooks/useDeepEquals";
import {
  FieldConfig,
  FieldValues,
  useValidations,
  ValidatorResult
} from "../hooks/useValidations";
import { createContextHook } from "../utilities/react";
import { styled } from "../utilities/stitches";
import { Size } from "../utilities/types";
import { Flex, FlexProps } from "./Flex";
import { Input } from "./Input";
import { baseTextSize, extraSmallTextSize, smallTextSize } from "./Typography";
import { Checkbox } from "./Checkbox";
import { Select, SelectOption } from "./Select";

export function Form<V extends FieldValues>({
  initialValues,
  size,
  onSubmit,
  ...props
}: PropsWithChildren<{
  size: Size;
  initialValues: V;
  onSubmit: (e: FormEvent<HTMLFormElement>, state: V) => void;
}>) {
  const [state, dispatch] = useReducer(formReducer, initState(initialValues));
  const validations = useValidations(state);

  const value = useMemo(
    (): FormStore<V> => ({
      size,
      state,
      dispatch,
      validations
    }),
    [size, state, dispatch, validations]
  );

  return (
    <FormContext.Provider value={value}>
      <StyledForm
        {...props}
        onSubmit={e => {
          e.preventDefault();
          dispatch({ type: "submit", payload: true });

          const error = Object.values(validations).some(
            ({ errors }) => errors.length > 0
          );
          if (error) return;
          onSubmit(e, state.values);
        }}
      />
    </FormContext.Provider>
  );
}
const StyledForm = styled("form", {
  display: "flex",
  flexDirection: "column",
  variants: {
    size: { compact: { gap: "$xxs" }, default: { gap: "$xxs" } }
  },
  defaultVariants: { size: "default" }
});

interface FormItemProps extends FlexProps {
  validation?: FieldConfig;
  label: string;
  name: string;
}

const FormItem: React.FC<PropsWithChildren<FormItemProps>> = ({
  children,
  validation,
  label,
  name
}) => {
  const { dispatch, validations } = useForm();
  const error = useFormError(name);

  useDeepLayoutEffect(() => {
    if (!validation) return;
    dispatch({ type: "register", payload: { name, field: validation } });
    return () => dispatch({ type: "unregister", payload: { name } });
  }, [name, validation]);

  return (
    <Flex css={{ flexDirection: "column", position: "relative" }}>
      {label && (
        <FormLabel htmlFor={name} css={{ paddingBottom: "$xs" }}>
          {label}
        </FormLabel>
      )}
      {children}
      <FormError error={error}>
        {validations[name]?.errors[0]?.message || ""}
      </FormError>
    </Flex>
  );
};

export const FormLabel = styled("label", {
  color: "$text",
  fontFamily: "$sans",
  fontWeight: "$normal",
  variants: {
    size: {
      compact: { ...smallTextSize },
      default: { ...baseTextSize }
    }
  },
  defaultVariants: { size: "default" }
});

const FormError = styled("div", {
  color: "$danger",
  opacity: 0,
  transition: "opacity 100ms",
  variants: {
    size: {
      compact: { height: "16px", ...extraSmallTextSize },
      default: { height: "16px", ...smallTextSize }
    },
    error: { true: { opacity: 1 } }
  },
  defaultVariants: { size: "default" }
});

export interface FormInputProps extends FormItemProps {}
export const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  validation,
  ...props
}) => {
  const { size, state, dispatch } = useForm();
  const error = useFormError(name);

  return (
    <FormItem name={name} label={label} validation={validation} {...props}>
      <Input
        id={name}
        size={size}
        danger={error}
        onBlur={() => dispatch({ type: "blur", payload: { name } })}
        value={state.values[name]}
        onChange={e => {
          dispatch({
            type: "change",
            payload: { name, value: e.target.value }
          });
        }}
      />
    </FormItem>
  );
};

export interface FormCheckboxProps extends FormItemProps {}
export const FormCheckbox: React.FC<FormCheckboxProps> = ({
  name,
  label,
  validation,
  ...props
}) => {
  const { size, state, dispatch } = useForm();
  const error = useFormError(name);

  return (
    <FormItem name={name} label="" validation={validation} {...props}>
      <Checkbox
        id={name}
        size={size}
        danger={error}
        onBlur={() => dispatch({ type: "blur", payload: { name } })}
        checked={state.values[name]}
        onCheckedChange={value => {
          dispatch({ type: "change", payload: { name, value } });
        }}
      >
        <FormLabel htmlFor={name}>{label}</FormLabel>
      </Checkbox>
    </FormItem>
  );
};

export interface FormSelectProps extends FormItemProps {
  options: SelectOption[];
}

export const FormSelect: React.FC<FormSelectProps> = ({
  name,
  label,
  validation,
  options,
  ...props
}) => {
  const { size, state, dispatch } = useForm();
  const error = useFormError(name);

  return (
    <FormItem name={name} label={label} validation={validation} {...props}>
      <Select
        id={name}
        size={size}
        danger={error}
        options={options}
        onBlur={() => dispatch({ type: "blur", payload: { name } })}
        value={state.values[name]}
        onValueChange={value => {
          dispatch({
            type: "change",
            payload: { name, value }
          });
        }}
      />
    </FormItem>
  );
};

const useFormError = (name: string) => {
  const { state, validations } = useForm();
  return useMemo(() => {
    const hasSubmitted = state.submitted;
    const hasBlurred = state.blurs[name];
    const hasErrors = validations[name]?.errors.length > 0;
    const showError = (hasSubmitted || hasBlurred) && hasErrors;
    return showError;
  }, [state, validations, name]);
};

const FormContext = createContext<FormStore<any> | undefined>(undefined);
const useForm = createContextHook(FormContext);

const initState = <V extends FieldValues>(values: V): FormState => {
  return { values, configs: {}, blurs: {}, submitted: false };
};

const formReducer: Reducer<FormState, FormAction> = (state, action) => {
  switch (action.type) {
    case "change": {
      const { name, value } = action.payload;
      const values = { ...state.values, [name]: value };
      return { ...state, values };
    }
    case "blur": {
      const blurs = { ...state.blurs, [action.payload.name]: true };
      return { ...state, blurs };
    }
    case "register": {
      const { field, name } = action.payload;
      const configs = { ...state.configs, [name]: field };
      return { ...state, configs };
    }
    case "unregister": {
      const next = { ...state };
      delete next.configs[action.payload.name];
      return next;
    }
    case "submit":
      return { ...state, submitted: action.payload };
    case "reset":
      return { ...action.payload };
    default:
      throw new Error("Unknown action type");
  }
};

interface FormStore<V extends FieldValues> {
  size: Size;
  state: FormState<V>;
  dispatch: Dispatch<FormAction>;
  validations: Record<keyof V, ValidatorResult>;
}

interface FormState<V extends FieldValues = any> {
  values: V;
  configs: Record<keyof V, FieldConfig>;
  blurs: Record<keyof V, boolean>;
  submitted: boolean;
}

type ChangeAction = {
  type: "change";
  payload: { name: string; value: unknown };
};
type BlurAction = { type: "blur"; payload: { name: string } };
type SubmitAction = { type: "submit"; payload: boolean };
type ResetAction = { type: "reset"; payload: FormState };
type RegisterAction = {
  type: "register";
  payload: { name: string; field: FieldConfig };
};
type UnregisterAction = { type: "unregister"; payload: { name: string } };
type FormAction =
  | ChangeAction
  | BlurAction
  | RegisterAction
  | UnregisterAction
  | ResetAction
  | SubmitAction;
