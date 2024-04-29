import { FormControl, FormGroup } from '@angular/forms';

//validatins: Allow alphanumeric char and space only
export class TextFieldValidators {
    static validTextField(fc: FormControl) {
        if (fc.value != undefined && fc.value != "") {
            const regex = /^[0-9a-zA-Z ]+$/;

            if (regex.test(fc.value)) {
                return null;
            } else {
                return { validTextField: true }
            }
        } else {
            return null;
        }
    }
}

//validatins: Allow Numeric
export class NumericFieldValidators {
    static validNumericField(fc: FormControl) {
        if (fc.value != undefined && fc.value != "") {
            const regex = /[0-9]+/;

            if (regex.test(fc.value)) {
                return null;
            } else {
                return { validNumericField: true }
            }
        } else {
            return null;
        }
    }
}

//validatins: Allow char and space only
export class OnlyCharFieldValidators {
    static validOnlyCharField(fc: FormControl) {
        if (fc.value != undefined && fc.value != "") {
            const regex = /^[a-zA-Z ]+$/;

            if (regex.test(fc.value)) {
                return null;
            } else {
                return { validOnlyCharField: true }
            }
        } else {
            return null;
        }
    }
}

//validatins: Allow Email
export class EmailFieldValidators {
    static validEmailField(fc: FormControl) {
        if (fc.value != undefined && fc.value != "") {
            const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/;

            if (regex.test(fc.value)) {
                return null;
            } else {
                return { validEmailField: true }
            }
        } else {
            return null;
        }
    }
}

//Validation : Not allow whitespace only
export class NoWhiteSpaceValidator {
    static noWhiteSpaceValidator(fc: FormControl) {
        if (fc.value != undefined && fc.value != "" && fc.value != null) {
            const isWhiteSpace = (fc.value.toString().trim().length === 0)
            if (!isWhiteSpace) {
                return null;
            } else {
                return { noWhiteSpaceValidator: true }
            }
        } else {
            return null;
        }
    }
}

//validations: To check two fields match
export function MustMatchValidators(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            return;
        }

        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true })
        } else {
            matchingControl.setErrors(null)
        }
    }
}