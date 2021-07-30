import { AbstractControl } from '@angular/forms';

export function RequireMatch(control: AbstractControl) {
    const selection: any = control.value;
    if (typeof selection === 'string' && selection.length > 1) {
        return { incorrect: true };
    }
    // else if (typeof selection === 'string' && selection === '') {
    //   return { incorrect: false };
    // }
    return null;
}
