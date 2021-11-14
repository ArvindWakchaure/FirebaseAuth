import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../../model/user';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  user: User[];
  setIndeterminateState: boolean;
  parentCheckbox: boolean;
  form: FormGroup;
  submitted:boolean = false;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  openinterest: boolean = false;
  
  public interstList = [
    { val: 'Politics', checked: true },
    { val: 'Fashion' },
    { val: 'Education' },
    { val: 'Technology' },
    { val: 'Bollywood' },
    { val: 'Health  ' },
  ];
  constructor(private formBuilder: FormBuilder, private db: AngularFirestore,
    private _service: FirebaseAuthService,
    private commonService: CommonService
    ) {
    const things = db.collection('users').valueChanges();
      things.subscribe(console.log);
   }

  ngOnInit() {
    this.form = this.formBuilder.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      email: ['', [Validators.required,  Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      checkboxArrayList: this.formBuilder.array([], Validators.required),
      password: ['', [
        Validators.required,
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}') ] ]
    });

    this._service.getUserData().subscribe(res => {
      console.log("Response: ",res);
      res.map(e => {
        // console.log(e.payload.doc.id);
        // console.log(e.payload.doc.data());
        // console.log(e.payload.exists);
        console.log(e.type);
      })
    })
  }

  updateCheckControl(cal, o) {
    if (o.checked) {
      cal.push(new FormControl(o.value));
    } else {
      cal.controls.forEach((item: FormControl, index) => {
        if (item.value == o.value) {
          cal.removeAt(index);
          return;
        }
      });
    }
  }

  onLoadCheckboxStatus() {
    const checkboxArrayList: FormArray = this.form.get('checkboxArrayList') as FormArray;
    this.interstList.forEach(o => {
      this.updateCheckControl(checkboxArrayList, o);
    })
    console.log(checkboxArrayList);
  }

  onSelectionChange(e, i) {
    console.log(e.target.value);
    const checkboxArrayList: FormArray = this.form.get('checkboxArrayList') as FormArray;
    this.interstList[i].checked = e.target.checked;
    this.updateCheckControl(checkboxArrayList, e.target);

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
          this.doRegister();
        }
      });
    }
  }

  checkEmailExist(email) {
    this._service.checkEmail({'email': email}).subscribe(res => {
      console.log(res);
      // console.log(res.docs);
      // if(res.size >= 1) {
      //   console.log("inside If");
      //   this.commonService.presentToast('Email already exist');
      // }
      // else {
      //   this.doRegister();
      // }
    })
    // .subscribe(res => {
    //   console.log(res.length);
    //   res.map(e => {
    //     console.log(e.payload.exists);
    //     if(e.type == 'added') {
    //       console.log("inside If");
    //       this.commonService.presentToast('Email already exist');
    //     return false;
    //     }
    //     else {
    //       this.doRegister();
    //     }
    //   })
      // if(res.length != 0) { 
      //   this.commonService.presentToast('Email already exist');
      //   return false;
      //  }
       
    // })
  }

  doRegister() {
    const addUser = {};
      addUser['firstname'] = this.form.value.fname;
      addUser['lastname'] = this.form.value.lname;
      addUser['email'] = this.form.value.email;
      addUser['password'] = this.form.value.password;
      addUser['interest'] = this.form.value.checkboxArrayList;
      this._service.signUp(addUser).then(res => {
        console.log("Registered response:  ", res);
      })
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  onSelect() {
    setTimeout(() => {
      this.interstList.forEach(item => {
        item.checked = this.parentCheckbox;
      });
    });
  }

  onChange() {
    const checkboxes = this.interstList.length;
    let selected = 0;

    this.interstList.map(el => {
      if (el.checked) selected++;
    });

    if (selected > 0 && selected < checkboxes) {
      this.setIndeterminateState = true;
      this.parentCheckbox = false;
    } else if (selected == checkboxes) {
      this.parentCheckbox = true;
      this.setIndeterminateState = false;
    } else {
      this.setIndeterminateState = false;
      this.parentCheckbox = false;
    }
  }

  openInterest() {
    console.log(this.openinterest);
        this.openinterest = !this.openinterest;

  }
}
