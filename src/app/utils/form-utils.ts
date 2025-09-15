import { AbstractControl, Form, FormArray, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';


async function sleep(){
  return new Promise ((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 2500);
  })
}
export class FormUtils {
  //Expresiones regulares
  static namePattern = '^([a-zA-Z]+) ([a-zA-Z]+)';
  static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static notOnlySpacesPattern = '^[a-zA-Z0-9]+$';

  static getTextError(errors: ValidationErrors) {
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
        case 'min':
          return `Mínimo ${errors['min'].min} caracteres`;
        case 'email':
          return 'El valor ingresado no es un correo electrónico';
        case 'pattern':
          if (errors['pattern'].requiredPattern === FormUtils.emailPattern) {
            return 'El valor ingresado no es un correo electrónico';
          }
          return 'El valor ingresado no es válido';

        case 'emailTaken':
          return 'El correo ingresado ya está registrado'; 
        default:
          return `Error de validación no controlado ${key}`;
      }
    }
    return null;
  }

  static isValidField(form: FormGroup, fieldName: string): boolean | null {
    return (
      !!form.controls[fieldName].errors && form.controls[fieldName].touched
    );
  }

  static getFieldError(form: FormGroup, fieldName: string): string | null {
    if (!form.controls[fieldName]) return null;

    const errors = form.controls[fieldName].errors ?? {};

    return FormUtils.getTextError(errors);
  }

  static isValidFieldInArray(formArray: FormArray, index: number) {
    return (
      formArray.controls[index].errors && formArray.controls[index].touched
    );
  }

  // static isValidField(form: FormGroup, fieldName: string): boolean | null {
  //   return (
  //     !!form.controls[fieldName].errors && form.controls[fieldName].touched
  //   );
  // }

  static getFieldErrorInArray(
    formArray: FormArray,
    index: number
  ): string | null {
    if (formArray.controls.length === 0) return null;

    const errors = formArray.controls[index].errors ?? {};

    return FormUtils.getTextError(errors);
  }

  static matchFields(field1: string, field2: string): ValidatorFn {
    return (group: AbstractControl) => {
      const control1 = group.get(field1);
      const control2 = group.get(field2);
      if (!control1 || !control2) return null;
      return control1.value === control2.value ? null : { fieldsMismatch: true };
    };
  }

  static async checkingServerResponse (control: AbstractControl):Promise<ValidationErrors | null> {
    await sleep();

    const formValue = control.value;
    if (formValue === 'hola@mundo.com') {
      return {
        emailTaken: true
      };
    }



    return null
  }


}
