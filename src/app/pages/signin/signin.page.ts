import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
  form: FormGroup;
  submitted:boolean = false;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  constructor(private formBuilder: FormBuilder,private db: AngularFirestore,
    private commonService: CommonService) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required,  Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', [
        Validators.required,
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}') ] ]
    });
  }

  get valueControl() {
    return this.form.controls;
  }
  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      console.log('All fields are required');
      return;
    }
    else {
      let email = this.form.value.email;
      this.db.collection('users', ref => ref.where('email', '==', email).limit(1)).get().subscribe(res => {
        console.log(res.size);
        if(res.size >= 1) {
          this.commonService.presentToast('Email already exist');
        }
        else {
          // this.doRegister();
        }
      });
    }
  }
  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }
}
