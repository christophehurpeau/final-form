export type Subscription = { [key: string]: boolean }
export type Subscriber<V> = (value: V) => void
export type IsEqual = (a: any, b: any) => boolean
export interface AnyObject {
  [key: string]: any
}
export interface ValidationErrors extends AnyObject {}
export interface SubmissionErrors extends AnyObject {}

export interface FormSubscription {
  active?: boolean
  dirty?: boolean
  dirtyFields?: boolean
  dirtyFieldsSinceLastSubmit?: boolean
  dirtySinceLastSubmit?: boolean
  error?: boolean
  errors?: boolean
  hasSubmitErrors?: boolean
  hasValidationErrors?: boolean
  initialValues?: boolean
  invalid?: boolean
  modified?: boolean
  pristine?: boolean
  submitError?: boolean
  submitErrors?: boolean
  submitFailed?: boolean
  submitting?: boolean
  submitSucceeded?: boolean
  touched?: boolean
  valid?: boolean
  validating?: boolean
  values?: boolean
  visited?: boolean
}

export interface FormState<FormValues, InitialFormValues = Partial<FormValues>> {
  // by default: all values are subscribed. if subscription is specified, some values may be undefined
  active: undefined | string
  dirty: boolean
  dirtyFields: { [key: string]: boolean }
  dirtyFieldsSinceLastSubmit: { [key: string]: boolean }
  dirtySinceLastSubmit: boolean
  error: any
  errors: ValidationErrors
  hasSubmitErrors: boolean
  hasValidationErrors: boolean
  initialValues: InitialFormValues
  invalid: boolean
  modified?: { [key: string]: boolean }
  pristine: boolean
  submitError: any
  submitErrors: SubmissionErrors
  submitFailed: boolean
  submitSucceeded: boolean
  submitting: boolean
  touched?: { [key: string]: boolean }
  valid: boolean
  validating: boolean
  values: FormValues
  visited?: { [key: string]: boolean }
}

export type FormSubscriber<FormValues, InitialFormValues = Partial<FormValues>> = Subscriber<FormState<FormValues, InitialFormValues>>

export interface FieldState<FieldValue> {
  active?: boolean
  blur: () => void
  change: (value: any) => void
  data?: AnyObject
  dirty?: boolean
  dirtySinceLastSubmit?: boolean
  error?: any
  focus: () => void
  initial?: FieldValue
  invalid?: boolean
  length?: number
  modified?: boolean
  name: string
  pristine?: boolean
  submitError?: any
  submitFailed?: boolean
  submitSucceeded?: boolean
  submitting?: boolean
  touched?: boolean
  valid?: boolean
  validating?: boolean
  value?: FieldValue
  visited?: boolean
}

export interface FieldSubscription {
  active?: boolean
  data?: boolean
  dirty?: boolean
  dirtySinceLastSubmit?: boolean
  error?: boolean
  initial?: boolean
  invalid?: boolean
  length?: boolean
  modified?: boolean
  pristine?: boolean
  submitError?: boolean
  submitFailed?: boolean
  submitSucceeded?: boolean
  submitting?: boolean
  touched?: boolean
  valid?: boolean
  validating?: boolean
  value?: boolean
  visited?: boolean
}

export type FieldSubscriber<FieldValue> = Subscriber<FieldState<FieldValue>>
export type Subscribers<T extends Object> = {
  index: number
  entries: {
    [key: number]: {
      subscriber: Subscriber<T>
      subscription: Subscription
      notified: boolean
    }
  }
}

export type Unsubscribe = () => void

type FieldValidator<FieldValue> = (
  value: FieldValue,
  allValues: object,
  meta?: FieldState<FieldValue>
) => any | Promise<any>
type GetFieldValidator<FieldValue> = () =>
  | FieldValidator<FieldValue>
  | undefined

export interface FieldConfig<FieldValue> {
  afterSubmit?: () => void
  beforeSubmit?: () => void | false
  data?: any
  defaultValue?: any
  getValidator?: GetFieldValidator<FieldValue>
  initialValue?: any
  isEqual?: IsEqual
  validateFields?: string[]
}

export type RegisterField<FieldValue> = (
  name: string,
  subscriber: FieldSubscriber<FieldValue>,
  subscription: FieldSubscription,
  config?: FieldConfig<FieldValue>
) => Unsubscribe

export interface InternalFieldState<FieldValue> {
  active: boolean
  blur: () => void
  change: (value: any) => void
  data: AnyObject
  focus: () => void
  isEqual: IsEqual
  lastFieldState?: FieldState<FieldValue>
  length?: any
  modified: boolean
  name: string
  touched: boolean
  validateFields?: string[]
  validators: {
    [index: number]: GetFieldValidator<FieldValue>
  }
  valid: boolean
  validating: boolean
  visited: boolean
}

export interface InternalFormState {
  active?: string
  dirtySinceLastSubmit: boolean
  error?: any
  errors: ValidationErrors
  initialValues?: object
  lastSubmittedValues?: object
  pristine: boolean
  submitError?: any
  submitErrors?: object
  submitFailed: boolean
  submitSucceeded: boolean
  submitting: boolean
  valid: boolean
  validating: number
  values: object
}

type ConfigKey = keyof Config

export interface FormApi<FormValues = object, InitialFormValues = Partial<FormValues>> {
  batch: (fn: () => void) => void
  blur: (name: string) => void
  change: (name: string, value?: any) => void
  destroyOnUnregister: boolean
  focus: (name: string) => void
  initialize: (data: FormValues | ((values: FormValues) => FormValues)) => void
  isValidationPaused: () => boolean
  getFieldState: (field: string) => FieldState<any> | undefined
  getRegisteredFields: () => string[]
  getState: () => FormState<FormValues, InitialFormValues>
  mutators: { [key: string]: (...args: any[]) => any }
  pauseValidation: () => void
  registerField: RegisterField<any>
  reset: (initialValues?: object) => void
  resetFieldState: (name: string) => void
  resumeValidation: () => void
  setConfig: <K extends ConfigKey>(
    name: K,
    value: Config<FormValues>[K]
  ) => void
  submit: () => Promise<FormValues | undefined> | undefined
  subscribe: (
    subscriber: FormSubscriber<FormValues>,
    subscription: FormSubscription
  ) => Unsubscribe
}

export type DebugFunction<FormValues, InitialFormValues = Partial<FormValues>> = (
  state: FormState<FormValues, InitialFormValues>,
  fieldStates: { [key: string]: FieldState<any> }
) => void

export interface MutableState<FormValues, InitialFormValues = Partial<FormValues>> {
  fieldSubscribers: { [key: string]: Subscribers<FieldState<any>> }
  fields: {
    [key: string]: InternalFieldState<any>
  }
  formState: InternalFormState
  lastFormState?: FormState<FormValues, InitialFormValues>
}

export type GetIn = (state: object, complexKey: string) => any
export type SetIn = (state: object, key: string, value: any) => object
export type ChangeValue<FormValues = object, InitialFormValues = Partial<FormValues>> = (
  state: MutableState<FormValues, InitialFormValues>,
  name: string,
  mutate: (value: any) => any
) => void
export type RenameField<FormValues = object, InitialFormValues = Partial<FormValues>> = (
  state: MutableState<FormValues, InitialFormValues>,
  from: string,
  to: string
) => void
export interface Tools<FormValues, InitialFormValues = Partial<FormValues>> {
  changeValue: ChangeValue<FormValues, InitialFormValues>
  getIn: GetIn
  renameField: RenameField<FormValues, InitialFormValues>
  resetFieldState: (name: string) => void
  setIn: SetIn
  shallowEqual: IsEqual
}

export type Mutator<FormValues = object, InitialFormValues = Partial<FormValues>> = (
  args: any,
  state: MutableState<FormValues, InitialFormValues>,
  tools: Tools<FormValues, InitialFormValues>
) => any

export interface Config<FormValues = object, InitialFormValues = Partial<FormValues>> {
  debug?: DebugFunction<FormValues, InitialFormValues>
  destroyOnUnregister?: boolean
  initialValues?: InitialFormValues
  keepDirtyOnReinitialize?: boolean
  mutators?: { [key: string]: Mutator<FormValues, InitialFormValues> }
  onSubmit: (
    values: FormValues,
    form: FormApi<FormValues, InitialFormValues>,
    callback?: (errors?: SubmissionErrors) => void
  ) =>
    | SubmissionErrors
    | Promise<SubmissionErrors | undefined>
    | undefined
    | void
  validate?: (
    values: FormValues
  ) => ValidationErrors | Promise<ValidationErrors> | undefined
  validateOnBlur?: boolean
}

export type Decorator<FormValues = object, InitialFormValues = Partial<FormValues>> = (
  form: FormApi<FormValues, InitialFormValues>
) => Unsubscribe

export function createForm<FormValues, InitialFormValues = Partial<FormValues>>(
  config: Config<FormValues>
): FormApi<FormValues, InitialFormValues>
export const fieldSubscriptionItems: string[]
export const formSubscriptionItems: string[]
export const ARRAY_ERROR: 'FINAL_FORM/array-error'
export const FORM_ERROR: 'FINAL_FORM/form-error'
export function getIn(state: object, complexKey: string): any
export function setIn(state: object, key: string, value: any): object
export const version: string
export const configOptions: ConfigKey[]
