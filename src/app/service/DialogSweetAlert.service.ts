import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

export class DialogSweetAlertService {

    public static opentModalSweetAlertConfirm(title, text, onTab, onCancel?) {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success btn-fill',
                cancelButton: 'btn btn-danger btn-fill mr-2'
            },
            buttonsStyling: false
        })
        swalWithBootstrapButtons.fire({
            title: title,
            text: text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ตกลง',
            cancelButtonText: 'ยกเลิก',
            showConfirmButton: true,
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                onTab();
            } else {
                if (onCancel) onCancel();
            }
        });
    }
    public static opentModalSweetAlertSuccess(title, text) {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success btn-fill',
            },
            buttonsStyling: false
        })
        swalWithBootstrapButtons.fire({
            title: title,
            text: text,
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'ตกลง',
            showConfirmButton: true,
            reverseButtons: true
        }).then((result) => { })

    }
    public static opentModalSweetAlertError(title, text) {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success btn-fill',
            },
            buttonsStyling: false
        })
        swalWithBootstrapButtons.fire({
            title: title,
            text: text,
            icon: 'error',
            showCancelButton: false,
            confirmButtonText: 'ตกลง',
            showConfirmButton: true,
            reverseButtons: true
        }).then((result) => { })

    }
    // icon type SweetAlertIcon = 'success' | 'error' | 'warning' | 'info' | 'question';
    public static opentModalSweetAlertConfirmCustom(title, text, icon, onTab) {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success btn-fill',
                cancelButton: 'btn btn-danger btn-fill mr-2'
            },
            buttonsStyling: false
        })
        swalWithBootstrapButtons.fire({
            title: title,
            text: text,
            icon: icon,
            showCancelButton: true,
            confirmButtonText: 'ตกลง',
            cancelButtonText: 'ยกเลิก',
            showConfirmButton: true,
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                onTab();
            }
        })
    }
}
